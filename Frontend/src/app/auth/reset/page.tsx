"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import { toast } from "sonner";
import { KeyRound, ShieldCheck, UserCheck } from "lucide-react";
import ResetForm from "@/features/auth/components/ResetForm";
import { resetPassword } from "@/features/auth/api/authApi";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const ResetComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isReset, setIsReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    setError(null);

    if (!token) {
      const msg = "Reset token is missing or invalid.";
      toast.error("Invalid Request", {
        description: msg,
      });
      setError(msg);
      return;
    }

    const validationResult = resetSchema.safeParse(data);
    if (!validationResult.success) {
      const msg = validationResult.error.errors[0].message;
      toast.error("Validation Failed", {
        description: msg,
      });
      setError(msg);
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        token,
        newPassword: validationResult.data.password,
        confirmNewPassword: validationResult.data.confirmPassword,
      });
      toast.success("Password Reset Successful!", {
        description: "You can now log in with your new password.",
      });
      setIsReset(true);
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred.";
      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to reset password.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error("Reset Failed", { description: errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  const promoCards = [
    {
      id: 1,
      icon: <KeyRound className="w-7 h-7 text-sky-200" />,
      title: "New Credentials",
      description: "Create a new, secure password.",
      style: { top: "20%", left: "15%", animationDelay: "0s" },
      animationName: "slide-from-left",
    },
    {
      id: 2,
      icon: <ShieldCheck className="w-7 h-7 text-sky-200" />,
      title: "Account Secured",
      description: "Regain access and protect your account.",
      style: { top: "45%", left: "60%", animationDelay: "1.5s" },
      animationName: "slide-from-right",
    },
    {
      id: 3,
      icon: <UserCheck className="w-7 h-7 text-sky-200" />,
      title: "Access Restored",
      description: "You're just one step away.",
      style: { top: "70%", left: "25%", animationDelay: "3s" },
      animationName: "slide-from-left",
    },
  ];

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      <div className="hidden lg:flex items-center justify-center lg:w-1/2 bg-gradient-to-br from-sky-500 to-sky-700 dark:from-sky-600 dark:to-sky-800 relative overflow-hidden">
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
          <h1 className="text-6xl font-bold text-white mb-4 tracking-wide [text-shadow:_2px_2px_8px_rgba(0,0,0,0.2)]">
            Create a New Password
          </h1>
          <p className="text-2xl font-light mb-8 opacity-90 [text-shadow:_1px_1px_4px_rgba(0,0,0,0.2)]">
            A strong password helps keep your account secure.
          </p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <ResetForm
          onSubmit={handleSubmit}
          onBackToLogin={handleBackToLogin}
          isReset={isReset}
          isLoading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

const Reset = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResetComponent />
  </Suspense>
);

export default Reset;
