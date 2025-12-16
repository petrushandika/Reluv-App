"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(100, { message: "Password must be at most 100 characters" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface ResetFormProps {
  isReset: boolean;
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: { password: string; confirmPassword: string }) => void;
  onBackToLogin: () => void;
}

const ResetForm = ({
  isReset,
  isLoading,
  error,
  onSubmit,
  onBackToLogin,
}: ResetFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

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
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
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

    const validationResult = resetPasswordSchema.safeParse(formData);

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

    onSubmit(validationResult.data);
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
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
    <div className="max-w-md w-full space-y-8">
      {!isReset ? (
        <>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Reset Password
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please enter your new password below.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  minLength={6}
                  maxLength={100}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 dark:focus:bg-gray-800 transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500 ${
                    fieldErrors.password
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.password}
                </p>
              )}
              {formData.password && !fieldErrors.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strengthColors[passwordStrength - 1] ||
                          "bg-gray-200 dark:bg-gray-700"
                        }`}
                        style={{
                          width: `${(passwordStrength / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {strengthLabels[passwordStrength - 1] || ""}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  minLength={6}
                  maxLength={100}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 dark:focus:bg-gray-800 transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500 ${
                    fieldErrors.confirmPassword
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.confirmPassword}
                </p>
              )}
              {formData.confirmPassword &&
                !fieldErrors.confirmPassword &&
                formData.password === formData.confirmPassword && (
                  <div className="mt-2">
                    <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Passwords match
                    </div>
                  </div>
                )}
            </div>


            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password Requirements:
              </h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li
                  className={`flex items-center ${
                    formData.password.length >= 6
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      formData.password.length >= 6
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  ></div>
                  At least 6 characters
                </li>
                <li
                  className={`flex items-center ${
                    /[A-Z]/.test(formData.password)
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      /[A-Z]/.test(formData.password)
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  ></div>
                  One uppercase letter
                </li>
                <li
                  className={`flex items-center ${
                    /[a-z]/.test(formData.password)
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      /[a-z]/.test(formData.password)
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  ></div>
                  One lowercase letter
                </li>
                <li
                  className={`flex items-center ${
                    /[0-9]/.test(formData.password)
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      /[0-9]/.test(formData.password)
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  ></div>
                  One number
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={
                isLoading ||
                !formData.password ||
                !formData.confirmPassword ||
                Object.keys(fieldErrors).length > 0
              }
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
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
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Your password has been successfully reset. You can now sign in
              with your new password.
            </p>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 cursor-pointer"
            >
              Continue to Sign In
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ResetForm;
