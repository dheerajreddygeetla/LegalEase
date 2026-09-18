import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../common/Input';
import Button from '../common/Button';
import GoogleSignInButton from './GoogleSignInButton';
import { isGoogleAuthConfigured } from './GoogleAuthProvider';
import { useLanguage } from '../../hooks/useLanguage';

const RegisterForm = () => {
  const { register: registerUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const googleEnabled = isGoogleAuthConfigured();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await registerUser({
        name: data.fullName,
        email: data.email,
        password: data.password,
      });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCredential = async (idToken) => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle(idToken);
      toast.success('Account ready — signed in with Google!');
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
        {t('register')}
      </h2>

      {googleEnabled && (
        <div className="mb-5 space-y-4">
          <GoogleSignInButton
            onCredential={handleGoogleCredential}
            disabled={isLoading || isGoogleLoading}
          />

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              or register with email
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          error={errors.fullName?.message}
          {...register('fullName')}
        />

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
          placeholder="Create a password"
          error={errors.password?.message}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          showPasswordToggle
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          {...register('confirmPassword')}
        />

        <label
          className="flex items-start gap-2 text-xs font-medium cursor-pointer"
          style={{ color: 'var(--text-muted)' }}
        >
          <input
            type="checkbox"
            style={{ accentColor: '#D4A43A', marginTop: 2, borderRadius: 4, flexShrink: 0 }}
            {...register('terms')}
          />
          <span>
            I agree to the{' '}
            <Link
              to="/terms"
              className="font-semibold transition-colors duration-200"
              style={{ color: 'var(--accent-gold)' }}
              onMouseEnter={(e) => (e.target.style.color = '#E8C05C')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--accent-gold)')}
            >
              Terms and Conditions
            </Link>
          </span>
        </label>
        {errors.terms && (
          <p className="text-xs font-medium" style={{ color: '#B03A2E' }}>
            {errors.terms.message}
          </p>
        )}

        <Button type="submit" fullWidth loading={isLoading} size="lg" disabled={isGoogleLoading}>
          {t('register')}
        </Button>

        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold transition-colors duration-200"
            style={{ color: 'var(--accent-gold)' }}
            onMouseEnter={(e) => (e.target.style.color = '#E8C05C')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--accent-gold)')}
          >
            {t('login')}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
