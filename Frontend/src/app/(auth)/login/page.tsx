"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
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
import LoginForm from "@/features/(auth)/components/LoginForm";
import { useAuthStore } from "@/features/(auth)/store/auth.store";
import { useCartStore } from "@/features/(main)/cart/store/cart.store";
import { useWishlistStore } from "@/features/(main)/wishlist/store/wishlist.store";
import {
  redirectToGoogleAuth,
  redirectToFacebookAuth,
} from "@/features/(auth)/api/authApi";
import { LoginPayload, SocialProvider } from "@/features/(auth)/types";

const Login = () => {
  const router = useRouter();
  const { login, status } = useAuthStore();
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const [error, setError] = useState<string | null>(null);

  const isLoading = status === "loading";

  const handleLoginSubmit = async (data: LoginPayload) => {
    setError(null);
    try {
      const authResponse = await login(data);
      
      
      if (authResponse.user.role === "USER") {
        await Promise.all([fetchCart(), fetchWishlist()]);
      }
      
      toast.success("Login Successful!", {
        description: "Welcome back! Redirecting you now...",
      });
      
      
      switch (authResponse.user.role) {
        case "STORE":
          router.push("/store");
          break;
        case "ADMIN":
          router.push("/superadmin");
          break;
        case "USER":
        default:
          router.push("/");
          break;
      }
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred.";
      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials.";
        
        if (errorMessage.includes("verify your email") || errorMessage.includes("email")) {
          const email = data.email;
          router.push(`/verification?email=${encodeURIComponent(email)}`);
          return;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error("Login Failed", {
        description: errorMessage,
      });
    }
  };

  const handleSocialLogin = (provider: SocialProvider) => {
    if (provider === "Google") {
      redirectToGoogleAuth();
    } else if (provider === "Facebook") {
      redirectToFacebookAuth();
    }
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
                  {streamIcons[(i + j) % streamIcons.length]}
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
            <h1 className="text-6xl font-bold text-white mb-4 tracking-wide [text-shadow:_2px_2px_8px_rgba(0,0,0,0.2)]">
              Reluv
            </h1>
          </Link>
          <p className="text-2xl font-light mb-8 opacity-90 [text-shadow:_1px_1px_4px_rgba(0,0,0,0.2)]">
            Where Style Finds a Second Life.
          </p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <LoginForm
          onSubmit={handleLoginSubmit}
          onSocialLogin={handleSocialLogin}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default Login;
