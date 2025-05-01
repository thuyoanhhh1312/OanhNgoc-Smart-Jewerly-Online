import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import authServices from "../../services/authServices";
import { ToastContainer, toast } from 'react-toastify';
import { auth } from "../../firebase";
import { sendSignInLinkToEmail } from "firebase/auth";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  console.log("process.env.APP_REGISTER_REDIRECT_URL", process.env.REACT_APP_APP_REGISTER_REDIRECT_URL)

  const handleSubmit = async (e) => {
    e.preventDefault();
    // try{
    //   const data = await authServices.register(name, email, password);
    //   localStorage.setItem('token', data.token);
    //   navigate('/');
    // }catch(err){
    //   console.error(err);
    // }
    const config = {
      url: process.env.REACT_APP_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true
    }
    await sendSignInLinkToEmail(auth, email, config);
    toast.success(
      `Email is sent to ${email}. Click the link to complete your registration.`
    );
    // save user email in local storage
    window.localStorage.setItem("emailForRegistration", email);
    // clear state
    setEmail("");

  }
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
