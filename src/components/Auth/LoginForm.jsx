import Lottie from "lottie-react";
import {
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Shield,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../api/authAPI";
import truckAnimation from "../../assets/lottieflow-ecommerce.json";
import {
  loginStart,
  loginSuccess,
  stopLoading,
} from "../../store/slices/authSlice";
import { encryptPassword } from "../../utils/PasswordEnc";
import ForgotPassword from "./ForgotPassword";

import logo from '../../assets/Ganapathy_metals_logo.png';


const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationStep, setVerificationStep] = useState("form"); // 'form', 'verify', 'success'
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    type: "",
    industry: "",
    branch: "",
    branchCode: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  // Handle Signup - Only show OTP verification
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    dispatch(loginStart());

    try {
      const payload = {
        active: true,
        branch: formData.branch || "",
        branchCode: formData.branchCode || "",
        createdby: formData.name,
        email: formData.email,
        id: 0,
        mobileNo: formData.phone,
        orgId: 0,
        organizationName: formData.industry,
        password: encryptPassword(formData.password),
        status: "APPROVED",
        type: formData.type,
        userName: formData.email,
      };

      console.log("Sending signup payload:", payload);

      // Call signup API - this should trigger email OTP
      const response = await authAPI.signup(payload);
      console.log("Signup API success:", response);

      // IMPORTANT: Use stopLoading instead of loginSuccess to avoid auto-login
      dispatch(stopLoading());

      // Move to verification step
      setVerificationStep("verify");
    } catch (error) {
      console.error("Signup API error:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Signup failed. Please try again.";
      setErrorMessage(errorMsg);
      dispatch(stopLoading());
    }
  };

  // Handle OTP Verification - Only verify, DO NOT login
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP");
      return;
    }

    setErrorMessage("");
    dispatch(loginStart());

    try {
      const verifyPayload = {
        email: formData.email,
        otp: verificationCode,
      };

      console.log("Verifying OTP with payload:", verifyPayload);

      const verifyResponse = await authAPI.verifyOtp(verifyPayload);
      console.log("OTP verification success:", verifyResponse);

      // ----------------- CORRECT SUCCESS CHECK -----------------
      const isVerified =
        verifyResponse?.statusFlag === "Ok" &&
        verifyResponse?.paramObjectsMap?.verified === true;

      if (isVerified) {
        dispatch(stopLoading());
        setVerificationStep("success");

        // Switch to login after delay
        setTimeout(() => {
          setVerificationStep("form");
          setVerificationCode("");
          setIsSignup(false);

          setFormData((prev) => ({
            name: "",
            email: prev.email,
            phone: "",
            password: "",
            type: "",
            industry: "",
            branch: "",
            branchCode: "",
          }));

          setErrorMessage("");
        }, 2000);
      } else {
        throw new Error(
          verifyResponse?.paramObjectsMap?.message || "OTP verification failed"
        );
      }
    } catch (error) {
      console.error("OTP verification error:", error);

      const errorMsg =
        error?.response?.paramObjectsMap?.message ||
        error?.message ||
        "Invalid OTP. Please try again.";

      setErrorMessage(errorMsg);
      dispatch(stopLoading());
    }
  };

  // Handle Login - ONLY here we authenticate and navigate
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    dispatch(loginStart());

    try {
      const loginPayload = {
        userName: formData.email,
        password: encryptPassword(formData.password),
      };

      const response = await authAPI.login(loginPayload);
      console.log("Login API success:", response);

      const statusFlag = response?.status;

      // ----------- CHECK IF LOGIN SUCCESS OR FAILURE -----------
      if (!statusFlag) {
        const errorMsg =
          response?.paramObjectsMap?.errorMessage ||
          response?.paramObjectsMap?.message ||
          "Login failed. Please try again.";

        setErrorMessage(errorMsg);
        dispatch(stopLoading());
        return; // STOP execution → do not navigate
      }

      // ----------- ONLY ON SUCCESS -----------
      const userVO = response?.paramObjectsMap?.userVO || {};

      dispatch(
        loginSuccess({
          name: userVO.userName || formData.name,
          email: formData.email,
          token: userVO.token,
          orgId: userVO.orgId,
          userName: userVO.userName,
          userId: userVO.usersId,
          ...response.data,
        })
      );

      navigate("/");
    } catch (error) {
      console.error("Login API error:", error);
      const errorMsg =
        error?.response?.paramObjectsMap?.errorMessage ||
        error?.message ||
        "Login failed. Please check your credentials.";

      setErrorMessage(errorMsg);
      dispatch(stopLoading());
    }
  };

  const resendVerificationCode = async () => {
    try {
      setErrorMessage("");
      dispatch(loginStart());

      const resendPayload = {
        email: formData.email,
      };

      console.log("Resending OTP to:", formData.email);

      await authAPI.resendOtp(resendPayload);
      alert("New OTP sent to your email!");
      dispatch(stopLoading());
    } catch (error) {
      console.error("Resend OTP error:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to resend OTP. Please try again.";
      setErrorMessage(errorMsg);
      dispatch(stopLoading());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      if (verificationStep === "form") {
        handleSignupSubmit(e);
      } else if (verificationStep === "verify") {
        handleVerificationSubmit(e);
      }
    } else {
      handleLoginSubmit(e);
    }
  };

  const goBackToForm = () => {
    setVerificationStep("form");
    setVerificationCode("");
    setErrorMessage("");
  };

  // Reset form when switching between login/signup
  const handleAuthToggle = (isSignupMode) => {
    setIsSignup(isSignupMode);
    setVerificationStep("form");
    setVerificationCode("");
    setErrorMessage("");

    if (!isSignupMode) {
      // When switching to login, keep email but clear other fields
      setFormData((prev) => ({
        name: "",
        email: prev.email, // Keep email for convenience
        phone: "",
        password: "",
        type: "",
        industry: "",
        branch: "",
        branchCode: "",
      }));
    } else {
      // When switching to signup, clear everything
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        type: "",
        industry: "",
        branch: "",
        branchCode: "",
      });
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackFromForgotPassword = () => {
    setShowForgotPassword(false);
  };

  // Add this at the beginning of your AuthForm component
  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={handleBackFromForgotPassword} />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Form Section */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 lg:px-20 bg-white dark:bg-gray-900">
        <div className="mx-auto w-full max-w-md">
          {/* Back button for verification steps */}
          {(verificationStep === "verify" ||
            verificationStep === "success") && (
            <button
              onClick={goBackToForm}
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-6 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to form
            </button>
          )}

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                 <img
                                src={logo}
                                alt="Ganapathy Metal Logo"
                                className="w-12 h-12 object-contain" // adjust size as needed
                              />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Ganapathy Metals
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recycling Revolution
                </p>
              </div>
            </div>

            {/* Dynamic Headings */}
            {verificationStep === "verify" ? (
              <>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Verify Your Email
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter the 6-digit OTP sent to {formData.email}
                </p>
              </>
            ) : verificationStep === "success" ? (
              <>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Account Created Successfully!
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Redirecting to login...
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {isSignup ? "Create an Account" : "Welcome Back"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isSignup
                    ? "Get started with your logistics journey"
                    : "Sign in to your account"}
                </p>
              </>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          {/* Auth Toggle - Only show when not in verification steps */}
          {verificationStep === "form" && (
            <div className="flex justify-center mb-6">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => handleAuthToggle(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    !isSignup
                      ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  disabled
                  onClick={() => handleAuthToggle(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    isSignup
                      ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {/* Form Content based on verification step */}
          {verificationStep === "verify" ? (
            // Verification Code Form
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We sent a verification OTP to your email address
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      );
                      if (errorMessage) setErrorMessage("");
                    }}
                    required
                    maxLength={6}
                    className="w-full text-center text-2xl font-mono tracking-widest px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={resendVerificationCode}
                  disabled={loading}
                  className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Didn't receive OTP? Resend"}
                </button>
              </div>

              <button
                type="submit"
                disabled={verificationCode.length !== 6 || loading}
                className="w-full flex justify-center items-center py-4 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          ) : verificationStep === "success" ? (
            // Success State
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Verification Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your account has been created. Please login.
                </p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full animate-pulse"></div>
              </div>
            </div>
          ) : (
            // Main Auth Form
            <form className="space-y-5" onSubmit={handleSubmit}>
              {isSignup && (
                <>
                  {/* Name */}
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>
                </>
              )}

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  // required
                  className="w-full pl-10 pr-3 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {isSignup && (
                <>
                  {/* Type */}
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Type</option>
                      <option value="Transporter">Transporter</option>
                      <option value="Industry">Industry</option>
                    </select>
                  </div>

                  {/* Industry / Transport Name */}
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="industry"
                      placeholder="Industry / Transport Name"
                      value={formData.industry}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>
                </>
              )}

              {!isSignup && verificationStep === "form" && (
                <div className="text-right mb-3">
                  <button
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Please wait..."
                  : isSignup
                  ? "Create Account"
                  : "Sign In"}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center gap-2 text-xs mt-4">
              <Shield className="h-4 w-4" />
              <span>Your data is securely encrypted</span>
            </div>
            <p className="mt-3 text-xs">
              © 2025 Why Digit System Private Limited · Made with ❤️ in India
            </p>
          </div>
        </div>
      </div>

      {/* Right: Animation Section */}
<div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900">
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="max-w-md w-full">
      {/* Animation section */}
      <div className="text-center mb-8">
        {/* <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-md border border-white/10 p-4 shadow-xl">
          <img
            src={logo}
            alt="Ganapathy Metal Logo"
            className="w-50 h-50 object-contain"
          />
        </div> */}
        <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
          Leading The
          <span className="block bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
            Recycling Revolution
          </span>
        </h3>
      </div>
      <div className="space-y-3">
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="text-white font-semibold text-base">
                Global Recycling Network
              </h4>
              <p className="text-green-100/80 text-xs">
                Serving 15+ countries worldwide
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="text-white font-semibold text-base">
                15,000 MT Annual Capacity
              </h4>
              <p className="text-amber-100/80 text-xs">
                Ferrous & non-ferrous metals
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="text-white font-semibold text-base">
                Quality Assurance
              </h4>
              <p className="text-teal-100/80 text-xs">
                ISRI specification compliance
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="text-white font-semibold text-base">
                Comprehensive Services
              </h4>
              <p className="text-blue-100/80 text-xs">
                Industrial to demolition scrap
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-md border border-white/10">
          <div className="text-white font-bold text-lg">15K+</div>
          <div className="text-green-200/80 text-xs">MT Annual</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-md border border-white/10">
          <div className="text-white font-bold text-lg">15+</div>
          <div className="text-green-200/80 text-xs">Countries</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-md border border-white/10">
          <div className="text-white font-bold text-lg">100%</div>
          <div className="text-green-200/80 text-xs">Quality</div>
        </div>
      </div>

      {/* Company Tagline */}
      <div className="mt-6 text-center">
        <p className="text-green-200/70 text-sm italic">
          "Transforming scrap into sustainable value"
        </p>
        <p className="text-white/50 text-xs mt-2">
          Ganapathy Metal Sdn.Bhd • Malaysia
        </p>
      </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default AuthForm;
