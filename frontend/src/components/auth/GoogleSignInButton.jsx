import { useEffect, useRef, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

/**
 * Google Identity Services button. Parent should only render this when
 * VITE_GOOGLE_CLIENT_ID is configured (see isGoogleAuthConfigured).
 */
const GoogleSignInButton = ({ onCredential, disabled = false, label = 'Continue with Google', rememberMe = false }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(320);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const update = () => setWidth(Math.max(240, Math.floor(el.clientWidth)));
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSuccess = async (response) => {
    if (!response?.credential) {
      toast.error('Google did not return a valid credential. Please try again.');
      return;
    }
    try {
      await onCredential(response.credential, rememberMe);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Google sign-in failed. Please try again.'
      );
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
      aria-label={label}
    >
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error('Google sign-in was cancelled or failed.')}
        useOneTap={false}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width={String(width)}
        logo_alignment="left"
      />
    </div>
  );
};

export default GoogleSignInButton;
