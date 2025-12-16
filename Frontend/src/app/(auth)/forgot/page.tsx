"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { z } from "zod";
import {
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
import ForgotForm from "@/features/(auth)/components/ForgotForm";
import { forgotPassword } from "@/features/(auth)/api/authApi";
import { toast } from "sonner";
import { useRateLimit } from "@/shared/hooks/useRateLimit";

const emailSchema = z
  .string()
  .email({ message: "Please enter a valid email address." });

const Forgot = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isBlocked, remainingSeconds, checkRateLimit, recordRequest } = useRateLimit(30);

  const handleSubmit = async () => {
    setError(null);

    const validationResult = emailSchema.safeParse(email);

    if (!validationResult.success) {
      const msg = validationResult.error.errors[0].message;
      setError(msg);
      toast.error("Validation Error", {
        description: msg,
      });
      return;
    }

    if (checkRateLimit()) {
      const msg = `Please wait ${remainingSeconds} seconds before making another request.`;
      setError(msg);
      toast.error("Rate Limit", {
        description: msg,
      });
      return;
    }

    setLoading(true);
    try {
      await forgotPassword({ email });
      recordRequest();
      toast.success("Email Sent", {
        description: "If a user with that email exists, a password reset link has been sent.",
      });
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
            "Failed to send reset link.";
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error("Error", {
        description: errorMessage,
      });
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
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
            <h1 className="text-6xl font-bold text-white mb-4 tracking-wide [text-shadow:_2px_2px_8px_rgba(0,0,0,0.2)] animate-fade-in">
              Reluv
            </h1>
          </Link>
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
          <ForgotForm
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

export default Forgot;
