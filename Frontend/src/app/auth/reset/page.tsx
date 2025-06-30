"use client";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  Tag,
  Truck,
  Gift,
  Package,
  Star,
  ShieldCheck,
  ShoppingCart,
  Gem,
  Percent,
} from "lucide-react";

const Reset = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isReset, setIsReset] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Password reset:", formData);
    setIsReset(true);
  };

  const handleBackToLogin = () => {
    console.log("Navigate back to login");
  };

  const promoCards = [
    {
      id: 1,
      icon: <Tag className="w-7 h-7 text-sky-200" />,
      title: "Exclusive Vouchers",
      description: "Unlock special discounts",
      style: { top: "15%", left: "20%", animationDelay: "0s" },
      animationName: "slide-from-left",
    },
    {
      id: 2,
      icon: <Truck className="w-7 h-7 text-sky-200" />,
      title: "Free Shipping",
      description: "On thousands of items",
      style: { top: "35%", left: "65%", animationDelay: "1.5s" },
      animationName: "slide-from-right",
    },
    {
      id: 3,
      icon: <Star className="w-7 h-7 text-sky-200" />,
      title: "Curated Finds",
      description: "Discover unique style",
      style: { top: "75%", left: "10%", animationDelay: "3s" },
      animationName: "slide-from-left",
    },
    {
      id: 4,
      icon: <Gift className="w-7 h-7 text-sky-200" />,
      title: "Daily Flash Deals",
      description: "Offers you can't miss",
      style: { top: "55%", left: "75%", animationDelay: "4.5s" },
      animationName: "slide-from-right",
    },
    {
      id: 5,
      icon: <ShieldCheck className="w-7 h-7 text-sky-200" />,
      title: "Secure Payments",
      description: "Shop with confidence",
      style: { top: "85%", left: "50%", animationDelay: "6s" },
      animationName: "slide-from-left",
    },
    {
      id: 6,
      icon: <Package className="w-7 h-7 text-sky-200" />,
      title: "New Arrivals",
      description: "Fresh items daily",
      style: { top: "5%", left: "50%", animationDelay: "7.5s" },
      animationName: "slide-from-right",
    },
  ];

  const streamIcons = [
    <Tag key="1" />,
    <ShoppingCart key="2" />,
    <Package key="3" />,
    <Gem key="4" />,
    <Percent key="5" />,
    <Gift key="6" />,
    <Star key="7" />,
  ];

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Same as Login */}
      <div className="hidden lg:flex items-center justify-center lg:w-1/2 bg-gradient-to-br from-sky-500 to-sky-700 relative overflow-hidden">
        <div className="absolute inset-0 z-0 flex justify-between opacity-100">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="stream-column"
              style={{
                animationDuration: `${10 + i * 2}s`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              {[...Array(10)].map((_, j) => (
                <div key={j} className="stream-icon">
                  {streamIcons[Math.floor(Math.random() * streamIcons.length)]}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="absolute inset-0 z-20">
          {promoCards.map((card) => (
            <div
              key={card.id}
              className="promo-card-sky"
              style={{ ...card.style, animationName: card.animationName }}
            >
              {card.icon}
              <div>
                <p className="font-bold text-white">{card.title}</p>
                <p className="text-sky-100 text-sm">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white px-12 text-center">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-wide [text-shadow:_2px_2px_8px_rgba(0,0,0,0.2)] animate-fade-in">
            Reluv
          </h1>
          <p className="text-2xl font-light mb-8 opacity-90 [text-shadow:_1px_1px_4px_rgba(0,0,0,0.2)] animate-fade-in-delayed">
            Where Style Finds a Second Life.
          </p>
          <p className="text-md max-w-sm opacity-80 animate-fade-in-delayed-2">
            Join our community to unearth unique items, enjoy exclusive deals,
            and give your style a sustainable spin.
          </p>
        </div>
      </div>

      {/* Right Side - Reset Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          {!isReset ? (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Reset Password
                </h2>
                <p className="text-gray-600">
                  Please enter your new password below.
                </p>
              </div>

              <div className="space-y-6">
                {/* New Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 placeholder-gray-400"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-sky-500 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              strengthColors[passwordStrength - 1] ||
                              "bg-gray-200"
                            }`}
                            style={{
                              width: `${(passwordStrength / 5) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {strengthLabels[passwordStrength - 1] || ""}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 placeholder-gray-400"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-sky-500 transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="mt-2">
                      {formData.password === formData.confirmPassword ? (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Passwords match
                        </div>
                      ) : (
                        <div className="text-red-600 text-sm">
                          Passwords do not match
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Password Requirements:
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li
                      className={`flex items-center ${
                        formData.password.length >= 8 ? "text-green-600" : ""
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          formData.password.length >= 8
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      At least 8 characters
                    </li>
                    <li
                      className={`flex items-center ${
                        /[A-Z]/.test(formData.password) ? "text-green-600" : ""
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          /[A-Z]/.test(formData.password)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      One uppercase letter
                    </li>
                    <li
                      className={`flex items-center ${
                        /[a-z]/.test(formData.password) ? "text-green-600" : ""
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          /[a-z]/.test(formData.password)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      One lowercase letter
                    </li>
                    <li
                      className={`flex items-center ${
                        /[0-9]/.test(formData.password) ? "text-green-600" : ""
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          /[0-9]/.test(formData.password)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      One number
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    !formData.password ||
                    !formData.confirmPassword ||
                    formData.password !== formData.confirmPassword
                  }
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset Password
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-sky-600 transition-colors duration-200"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Password Reset Successful!
                </h2>
                <p className="text-gray-600 mb-8">
                  Your password has been successfully reset. You can now sign in
                  with your new password.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200"
                >
                  Continue to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .promo-card-sky {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 1rem 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
          will-change: transform, opacity;
          animation-duration: 15s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @keyframes slide-from-left {
          0% {
            opacity: 0;
            transform: translateX(-100%) translateY(20px) rotate(-10deg);
          }
          20% {
            opacity: 1;
            transform: translateX(0) translateY(0) rotate(5deg);
          }
          80% {
            opacity: 1;
            transform: translateX(0) translateY(0) rotate(-5deg);
          }
          100% {
            opacity: 0;
            transform: translateX(100%) translateY(-20px) rotate(10deg);
          }
        }

        @keyframes slide-from-right {
          0% {
            opacity: 0;
            transform: translateX(100%) translateY(-20px) rotate(10deg);
          }
          20% {
            opacity: 1;
            transform: translateX(0) translateY(0) rotate(-5deg);
          }
          80% {
            opacity: 1;
            transform: translateX(0) translateY(0) rotate(5deg);
          }
          100% {
            opacity: 0;
            transform: translateX(-100%) translateY(20px) rotate(-10deg);
          }
        }

        .stream-column {
          display: flex;
          flex-direction: column;
          animation-name: digital-rain;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .stream-icon {
          font-size: 2rem;
          color: rgba(255, 255, 255, 0.5);
          padding: 1rem 2rem;
          animation: fade-in-out 1s ease-in-out infinite alternate;
        }

        .stream-icon:nth-child(odd) {
          animation-delay: 0.5s;
        }

        @keyframes digital-rain {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(100vh);
          }
        }

        @keyframes fade-in-out {
          from {
            opacity: 0.2;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-fade-in-delayed {
          animation: fade-in 1s ease-out 0.3s forwards;
          opacity: 0;
        }
        .animate-fade-in-delayed-2 {
          animation: fade-in 1s ease-out 0.6s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Reset;
