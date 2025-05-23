import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { EyeCloseIcon, EyeIcon } from '../../icons';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../api/auth';

export default function SignInForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => ({ ...state }));

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const roleBasedRedirect = (user) => {
    let intended = location.state;
    console.log('user', user);

    if (intended) {
      navigate(intended.from);
    } else {
      if (user.role_id === 1 || user.role_id === 3) {
        navigate('/admin/categories');
      } else {
        navigate('/');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Vui lòng nhập email và mật khẩu.');
      return;
    }

    try {
      const res = await login({ email, password });
      console.log('res', res);

      const userData = {
        ...res.data.user,
        token: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      };

      dispatch({ type: 'LOGGED_IN_USER', payload: userData });
      localStorage.setItem('user', JSON.stringify(userData));

      toast.success('Đăng nhập thành công!');
      roleBasedRedirect(res.data.user);
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng nhập thất bại.';
      toast.error(msg);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      roleBasedRedirect(user);
    }
  }, [user]);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <ToastContainer />
          <div className="mb-5 sm:mb-8">
            <div className="mb-2 font-semibold text-gray-800 text-[32px] dark:text-white/90 sm:text-title-md flex justify-center">
              Sign In
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex justify-center">
              Enter your email and password to sign in!
            </p>
          </div>

          {/* Form đăng nhập */}
          <form onSubmit={handleSubmit} method="POST">
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="info@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link
                  to="/forgot/password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>

              <div>
                <Button className="w-full" type="submit">
                  Sign in
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
