import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { ToastContainer, toast } from 'react-toastify';
import { useSelector, useDispatch } from "react-redux";
import { register } from "../../api/auth";
import { EyeCloseIcon, EyeIcon } from "../../icons";

export default function SignUpForm() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("Vui lòng nhập đầy đủ thông tin.");
    }

    try {
      const res = await register({ name, email, password });

      dispatch({
        type: "LOGGED_IN_USER",
        payload: {
          ...res.data.user,
          token: res.data.accessToken,
          refreshToken: res.data.refreshToken
        },
      });

      localStorage.setItem("user", JSON.stringify({ ...res.data.user, token: res.data.accessToken }));

      toast.success("Đăng ký thành công!");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng ký thất bại.";
      toast.error(msg);
    }
  };

  useEffect(() => {
    if (user && user.token) navigate("/");
  }, [user]);

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8 flex justify-center items-center">
          <div className="mb-2 font-semibold text-gray-800 text-[24px] dark:text-white/90 sm:text-[32px]">
            Sign Up
          </div>
        </div>
        <ToastContainer />
        {/* Form */}
        <form onSubmit={handleSubmit} method="POST">
          <div className="space-y-5">
            <div>
              <Label>Email<span className="text-error-500">*</span></Label>
              <Input
                type="text"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e?.target?.value)}
              />
            </div>
            <div>
              <Label>Name<span className="text-error-500">*</span></Label>
              <Input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e?.target?.value)}
              />
            </div>
            <div>
              <Label>Password <span className="text-error-500">*</span></Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e?.target?.value)}
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
            <div>
              <button
                type="submit"
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
