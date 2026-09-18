import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

/**
 * Wraps children with GoogleOAuthProvider when a client ID is configured.
 * Without it, children render normally and Google buttons stay hidden.
 */
const GoogleAuthProvider = ({ children }) => {
  if (!clientId) {
    return children;
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
};

export const isGoogleAuthConfigured = () => Boolean(clientId);

export default GoogleAuthProvider;
