import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AppProvider } from './contexts/AppContext';
import GoogleAuthProvider from './components/auth/GoogleAuthProvider';
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assistant from './pages/Assistant';
import Documents from './pages/Documents';
import DocumentDetail from './pages/DocumentDetail';
import Schemes from './pages/Schemes';
import SchemeDetail from './pages/SchemeDetail';
import Eligibility from './pages/Eligibility';
import Profile from './pages/Profile';
import Help from './pages/Help';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <GoogleAuthProvider>
            <AuthProvider>
              <AppProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="help" element={<Help />} />
                  </Route>

                  {/* Auth Routes */}
                  <Route path="/login" element={<AuthLayout />}>
                    <Route index element={<Login />} />
                  </Route>
                  <Route path="/register" element={<AuthLayout />}>
                    <Route index element={<Register />} />
                  </Route>

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                  </Route>

                  <Route
                    path="/assistant"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Assistant />} />
                  </Route>

                  <Route
                    path="/documents"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Documents />} />
                    <Route path=":id" element={<DocumentDetail />} />
                  </Route>

                  <Route
                    path="/schemes"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Schemes />} />
                    <Route path=":id" element={<SchemeDetail />} />
                  </Route>

                  <Route
                    path="/eligibility"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Eligibility />} />
                  </Route>

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Profile />} />
                  </Route>

                  {/* Catch all - redirect to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
              </AppProvider>
            </AuthProvider>
          </GoogleAuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
