"use client";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
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

type SocialProvider = "Google" | "Facebook";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = () => {
    console.log("Login attempt:", { email, password });
  };

  const handleSocialLogin = (provider: SocialProvider) => {
    console.log(`Login with ${provider}`);
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

  return (
    <div className="min-h-screen flex bg-white">
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

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-600">
              Sign in to continue your adventure with Reluv.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 placeholder-gray-400"
                  placeholder="Enter your password"
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="/auth/forgot"
                  className="font-medium text-sky-600 hover:text-sky-500 transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 transform"
            >
              Sign In
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                className="flex-1 flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 transform"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("Facebook")}
                className="flex-1 flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 transform"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="#1877F2"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don`t have an account?{" "}
                <a
                  href="/auth/register"
                  className="font-medium text-sky-600 hover:text-sky-500 transition-colors duration-200"
                >
                  Register here
                </a>
              </p>
            </div>
          </div>
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

        /* --- NEW Digital Stream Animation Styles --- */
        .stream-column {
          display: flex;
          flex-direction: column;
          animation-name: digital-rain;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .stream-icon {
          font-size: 2rem; /* Size of the icons */
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

        /* --- End of New Animation Styles --- */

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

export default Login;
