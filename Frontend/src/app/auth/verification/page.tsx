"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { z } from "zod";
import {
  Tag,
  Gift,
  Package,
  Star,
  ShieldCheck,
  ShoppingCart,
  Gem,
  Percent,
  MailCheck,
} from "lucide-react";
import VerificationForm from "@/features/auth/components/VerificationForm";
import { verification } from "@/features/auth/api/authApi";
import { useRateLimit } from "@/shared/hooks/useRateLimit";

const emailSchema = z
  .string()
  .email({ message: "Please enter a valid email address." });

const VerificationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isBlocked, remainingSeconds, checkRateLimit, recordRequest } = useRateLimit(30);

  useEffect(() => {
    if (searchParams.get("email")) {
      setEmail(searchParams.get("email") || "");
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    setError(null);
    
    if (checkRateLimit()) {
      setError(`Please wait ${remainingSeconds} seconds before making another request.`);
      return;
    }

    const validationResult = emailSchema.safeParse(email);

    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      await verification(email);
      recordRequest();
      setIsSubmitted(true);
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred.";
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          errorMessage = err.response?.data?.message || "Please wait 30 seconds before making another request.";
          recordRequest();
        } else {
          errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Failed to send verification email.";
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  const handleTryAnotherEmail = () => {
    setIsSubmitted(false);
    setEmail("");
    setError(null);
  };

  const promoCards = [
    {
      id: 1,
      icon: <MailCheck className="w-7 h-7 text-sky-200" />,
      title: "Email Verification",
      description: "Secure your account",
      style: { top: "20%", left: "15%", animationDelay: "0s" },
      animationName: "slide-from-left",
    },
    {
      id: 2,
      icon: <ShieldCheck className="w-7 h-7 text-sky-200" />,
      title: "Account Security",
      description: "Protect your data",
      style: { top: "45%", left: "60%", animationDelay: "1.5s" },
      animationName: "slide-from-right",
    },
    {
      id: 3,
      icon: <Star className="w-7 h-7 text-sky-200" />,
      title: "Verified Access",
      description: "Unlock all features",
      style: { top: "70%", left: "25%", animationDelay: "3s" },
      animationName: "slide-from-left",
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
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      <div className="hidden lg:flex items-center justify-center lg:w-1/2 bg-gradient-to-br from-sky-500 to-sky-700 dark:from-sky-600 dark:to-sky-800 relative overflow-hidden">
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
        <div className="absolute inset-0 z-[1]">
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
          <Link
            href="/"
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <h1 className="text-6xl font-bold text-white mb-4 tracking-wide [text-shadow:_2px_2px_8px_rgba(0,0,0,0.2)] animate-fade-in">
              Reluv
            </h1>
          </Link>
          <p className="text-2xl font-light mb-8 opacity-90 [text-shadow:_1px_1px_4px_rgba(0,0,0,0.2)] animate-fade-in-delayed">
            Verify Your Account
          </p>
          <p className="text-md max-w-sm opacity-80 animate-fade-in-delayed-2">
            Complete your registration by verifying your email address to access
            all features.
          </p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <VerificationForm
          isSubmitted={isSubmitted}
          email={email}
          onEmailChange={setEmail}
          onSubmit={handleSubmit}
          onBackToLogin={handleBackToLogin}
          onTryAnotherEmail={handleTryAnotherEmail}
          isLoading={loading || isBlocked}
          error={error}
        />
      </div>
    </div>
  );
};

const Verification = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationContent />
    </Suspense>
  );
};

export default Verification;
