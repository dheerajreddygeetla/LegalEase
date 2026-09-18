import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import * as userService from '../services/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUser = async () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // ignore malformed cache, will refresh below
        }
      }

      // Refresh from server so profile fields (state, occupation, savedSchemes, etc.) stay current
      try {
        const response = await userService.getProfile();
        const freshUser = response.data.data;
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      } catch {
        // Token may be invalid/expired; the api interceptor will redirect on a 401
      }
    }

    setIsLoading(false);
  };

  // The backend returns a flat payload: { success, _id, name, email, token }
  const applyAuthSession = async (response) => {
    const { token: newToken, _id, name, email: userEmail } = response.data;
    const newUser = { _id, name, email: userEmail };

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);

    // Fill in the rest of the profile (state, occupation, savedSchemes, etc.) in the background
    try {
      const profileResponse = await userService.getProfile();
      const fullUser = profileResponse.data.data;
      setUser(fullUser);
      localStorage.setItem('user', JSON.stringify(fullUser));
    } catch {
      // Non-fatal: the basic user object from login is still usable
    }

    return response;
  };

  const login = async (email, password, rememberMe = false) => {
    const response = await authService.login(email, password, rememberMe);
    return applyAuthSession(response);
  };

  const loginWithGoogle = async (idToken, rememberMe = false) => {
    const response = await authService.googleAuth(idToken, rememberMe);
    return applyAuthSession(response);
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    loginWithGoogle,
    register,
    logout,
    updateUser,
    refreshUser: loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
