"use client";

import React, { useState } from "react";
import {
  Mail,
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

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    console.log("Password reset request for:", email);
    setIsSubmitted(true);
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

      {/* Right Side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          {!isSubmitted ? (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-gray-600">
                  No worries! We`ll send you reset instructions.
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
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 transform"
                >
                  Send Reset Instructions
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
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Check Your Email
                </h2>
                <p className="text-gray-600 mb-4">
                  We`ve sent password reset instructions to
                </p>
                <p className="text-sky-600 font-medium mb-6">{email}</p>
                <p className="text-sm text-gray-500 mb-8">
                  Didn`t receive the email? Check your spam folder or try again
                  with a different email address.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full flex justify-center py-3 px-4 border border-sky-600 rounded-lg shadow-sm text-sm font-medium text-sky-600 bg-white hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200"
                >
                  Try Another Email
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

export default Forgot;
