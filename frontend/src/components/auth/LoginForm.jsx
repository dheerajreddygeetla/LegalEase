import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../common/Input';
import Button from '../common/Button';
import GoogleSignInButton from './GoogleSignInButton';
import { isGoogleAuthConfigured } from './GoogleAuthProvider';
import { useLanguage } from '../../hooks/useLanguage';

const LoginForm = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const googleEnabled = isGoogleAuthConfigured();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password, rememberMe);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCredential = async (idToken, rememberMeValue = false) => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle(idToken, rememberMeValue);
      navigate('/dashboard');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div>
      <h2
        className="text-2xl font-bold tracking-tight text-center mb-6 text-white"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {t('login')}
      </h2>

      {googleEnabled && (
        <div className="mb-5 space-y-4">
          <GoogleSignInButton
            onCredential={handleGoogleCredential}
            disabled={isLoading || isGoogleLoading}
            rememberMe={rememberMe}
          />

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              or continue with email
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <label
            className="flex items-center gap-2 text-xs font-medium cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: '#D4A43A', borderRadius: 4 }}
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-xs font-semibold transition-colors duration-200"
            style={{ color: 'var(--accent-gold)' }}
            onMouseEnter={(e) => (e.target.style.color = '#E8C05C')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--accent-gold)')}
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={isLoading} size="lg" disabled={isGoogleLoading}>
          {t('login')}
        </Button>

        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold transition-colors duration-200"
            style={{ color: 'var(--accent-gold)' }}
            onMouseEnter={(e) => (e.target.style.color = '#E8C05C')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--accent-gold)')}
          >
            {t('register')}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
