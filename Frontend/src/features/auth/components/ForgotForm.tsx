"use client";

import React from "react";
import { Mail } from "lucide-react";

interface ForgotFormProps {
  email: string;
  isSubmitted: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  onBackToLogin: () => void;
  onTryAnotherEmail: () => void;
}

const ForgotForm: React.FC<ForgotFormProps> = ({
  email,
  isSubmitted,
  onEmailChange,
  onSubmit,
  onBackToLogin,
  onTryAnotherEmail,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
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

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  onChange={(e) => onEmailChange(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 placeholder-gray-400"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 transform"
            >
              Send Reset Instructions
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="inline-flex items-center text-sm text-gray-600 hover:text-sky-600 transition-colors duration-200"
              >
                Back to Sign In
              </button>
            </div>
          </form>
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
              Didn`t receive the email? Check your spam folder or try again with
              a different email address.
            </p>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={onTryAnotherEmail}
              className="w-full flex justify-center py-3 px-4 border border-sky-600 rounded-lg shadow-sm text-sm font-medium text-sky-600 bg-white hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200"
            >
              Try Another Email
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="inline-flex items-center text-sm text-gray-600 hover:text-sky-600 transition-colors duration-200"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotForm;
