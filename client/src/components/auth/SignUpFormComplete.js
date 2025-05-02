import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { ToastContainer, toast } from 'react-toastify';
import { signInWithEmailLink, updatePassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { useDispatch } from "react-redux"
import { createOrUpdateUser } from "../../api/auth"

export default function SignUpFormComplete({ history }) {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    let dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !password || !email) {
            toast.error("Name and password is required");
            return;
        }

        try {
            const result = await signInWithEmailLink(auth, email, window.location.href)
            if (result.user.emailVerified) {
                window.localStorage.removeItem("emailForRegistration");
                let user = auth.currentUser
                await updatePassword(user, password);
                await updateProfile(user, {
                    displayName: name,
                });
                const idTokenResult = await user.getIdTokenResult();
                createOrUpdateUser(idTokenResult.token)
                    .then((res) => {
                        dispatch({
                            type: "LOGGED_IN_USER",
                            payload: {
                                name: res.data.name,
                                email: res.data.email,
                                token: idTokenResult.token,
                                role_id: res.data.role_id,
                            },
                        });
                        // roleBasedRedirect(res);
                    })
                    .catch((err) => console.log(err));
                navigate('/');
            }
        } catch (error) {
            //
            toast.error(error?.message);
        }
    }

    useEffect(() => {
        setEmail(window.localStorage.getItem("emailForRegistration"));
    }, [history]);

    return (
        <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div className="mb-5 sm:mb-8 flex justify-center items-center">
                    <div className="mb-2 font-semibold text-gray-800 text-[24px] dark:text-white/90 sm:text-[32px]">
                        Sign Up Successful
                    </div>
                </div>
                <ToastContainer />
                {/* Form */}
                <form onSubmit={handleSubmit} method="POST">
                    <div className="space-y-5">
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
                            <Label>Email<span className="text-error-500">*</span></Label>
                            <Input
                                type="text"
                                name="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e?.target?.value)}
                                disabled={true}
                            />
                        </div>
                        <div>
                            <Label>Password<span className="text-error-500">*</span></Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e?.target?.value)}
                                    name="password"
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
                                Complete Registration
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
