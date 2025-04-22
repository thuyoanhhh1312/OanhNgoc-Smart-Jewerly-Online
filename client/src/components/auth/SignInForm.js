import { useState } from "react";
import { Link , useNavigate} from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import authServices from "../../services/authServices";
export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const data = await authServices.login(email, password);
      localStorage.setItem('token', data.token);
      navigate('/');
    }catch(err){
      console.error(err);
    }
  }
  return (
    <div className="flex flex-col flex-1">
      
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <div className="mb-2 font-semibold text-gray-800 text-[32px] dark:text-white/90 sm:text-title-md flex  justify-center">
              Sign In
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex justify-center" >
              Enter your email and password to sign in!
            </p>
          </div>


          {/* Form đăng nhập */}
          <form onSubmit={handleSubmit} method="POST">
            <div className="space-y-6">
              <div>
                <Label>Email <span className="text-error-500">*</span></Label>
                <Input 
                  type="text"
                  name="email"
                  id="email"
                  placeholder="info@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e?.target?.value)}
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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
                <Link
                  to="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>

              <div>
                <Button className="w-full" size="sm" type="submit">Sign in</Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Don't have an account?{" "}
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
