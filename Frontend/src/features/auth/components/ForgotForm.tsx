"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { Mail } from "lucide-react";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please provide a valid email address" })
    .max(255, { message: "Email must be at most 255 characters" })
    .trim(),
});

interface ForgotFormProps {
  email: string;
  isSubmitted: boolean;
  isLoading: boolean;
  error: string | null;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  onBackToLogin: () => void;
  onTryAnotherEmail: () => void;
}

const ForgotForm = ({
  email,
  isSubmitted,
  isLoading,
  error,
  onEmailChange,
  onSubmit,
  onBackToLogin,
  onTryAnotherEmail,
}: ForgotFormProps) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleEmailChange = (value: string) => {
    onEmailChange(value);
    if (fieldErrors.email) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
    setValidationError(null);
  };

  useEffect(() => {
    if (error) {
      toast.error("Error", {
        description: error,
      });
    }
  }, [error]);

  useEffect(() => {
    if (validationError) {
      toast.error("Validation Error", {
        description: validationError,
      });
    }
  }, [validationError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setFieldErrors({});

    const validationResult = forgotPasswordSchema.safeParse({ email });

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const fieldName = err.path[0] as string;
          errors[fieldName] = err.message;
        } else {
          const errorMsg = err.message;
          setValidationError(errorMsg);
          toast.error("Validation Error", {
            description: errorMsg,
          });
        }
      });
      setFieldErrors(errors);
      if (Object.keys(errors).length === 0 && validationResult.error.errors[0]) {
        const errorMsg = validationResult.error.errors[0].message;
        setValidationError(errorMsg);
        toast.error("Validation Error", {
          description: errorMsg,
        });
      }
      return;
    }

    onSubmit();
  };

  return (
    <div className="max-w-md w-full space-y-8">
      {!isSubmitted ? (
        <>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              No worries! We`ll send you reset instructions.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  maxLength={255}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 dark:focus:bg-gray-800 transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500 ${
                    fieldErrors.email
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.email}
                </p>
              )}
            </div>


            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 transform disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Sending..." : "Send Reset Instructions"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
              <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We`ve sent password reset instructions to
            </p>
            <p className="text-sky-600 dark:text-sky-400 font-medium mb-6">{email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Didn`t receive the email? Check your spam folder or try again with
              a different email address.
            </p>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={onTryAnotherEmail}
              className="w-full flex justify-center py-3 px-4 border border-sky-600 dark:border-sky-400 rounded-lg shadow-sm text-sm font-medium text-sky-600 dark:text-sky-400 bg-white dark:bg-gray-800 hover:bg-sky-50 dark:hover:bg-sky-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-sky-400 transition-all duration-200 cursor-pointer"
            >
              Try Another Email
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer"
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
