"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Store,
  Package,
  TrendingUp,
  Users,
  Award,
  ShieldCheck,
  Zap,
  Heart,
} from "lucide-react";
import CreateStoreForm from "@/features/(admin)/store/components/CreateStoreForm";
import { useAuthStore } from "@/features/(auth)/store/auth.store";
import Spinner from "@/shared/components/common/Spinner";
import { CreateStorePayload } from "@/features/(admin)/store/types";
import { createStore } from "@/features/(admin)/store/api/storeApi";

const CreateStore = () => {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: CreateStorePayload) => {
    setLoading(true);

    try {
      await createStore(formData);
      toast.success("Store Created Successfully!", {
        description: "Your store has been created. Welcome to Reluv seller community!",
      });
      router.push("/dashboard/store");
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error("Store Creation Failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const promoCards = [
    {
      id: 1,
      icon: <Store className="w-7 h-7 text-sky-200" />,
      title: "Your Own Store",
      description: "Build your brand identity",
      style: { top: "15%", left: "20%", animationDelay: "0s" },
      animationName: "slide-from-left",
    },
    {
      id: 2,
      icon: <Package className="w-7 h-7 text-sky-200" />,
      title: "Sell Unlimited",
      description: "No listing limits",
      style: { top: "35%", left: "65%", animationDelay: "1.5s" },
      animationName: "slide-from-right",
    },
    {
      id: 3,
      icon: <TrendingUp className="w-7 h-7 text-sky-200" />,
      title: "Analytics Dashboard",
      description: "Track your performance",
      style: { top: "75%", left: "10%", animationDelay: "3s" },
      animationName: "slide-from-left",
    },
    {
      id: 4,
      icon: <Users className="w-7 h-7 text-sky-200" />,
      title: "Reach Millions",
      description: "Connect with buyers",
      style: { top: "55%", left: "75%", animationDelay: "4.5s" },
      animationName: "slide-from-right",
    },
    {
      id: 5,
      icon: <ShieldCheck className="w-7 h-7 text-sky-200" />,
      title: "Secure Transactions",
      description: "Protected payments",
      style: { top: "85%", left: "50%", animationDelay: "6s" },
      animationName: "slide-from-left",
    },
    {
      id: 6,
      icon: <Award className="w-7 h-7 text-sky-200" />,
      title: "Seller Support",
      description: "We're here to help",
      style: { top: "5%", left: "50%", animationDelay: "7.5s" },
      animationName: "slide-from-right",
    },
  ];

  const streamIcons = [
    <Store key="1" />,
    <Package key="2" />,
    <TrendingUp key="3" />,
    <Users key="4" />,
    <Award key="5" />,
    <Zap key="6" />,
    <Heart key="7" />,
  ];

  if (!isHydrated) {
    return <Spinner />;
  }

  if (!isAuthenticated()) {
    router.push("/auth/login");
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      <div className="hidden lg:flex items-center justify-center lg:w-1/2 bg-linear-to-br from-sky-500 to-sky-700 dark:from-sky-600 dark:to-sky-800 relative overflow-hidden">
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
        <div className="absolute inset-0 z-1">
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
            <h1 className="text-6xl font-bold text-white mb-4 tracking-wide [text-shadow:2px_2px_8px_rgba(0,0,0,0.2)] animate-fade-in">
              Reluv
            </h1>
          </Link>
          <p className="text-2xl font-light mb-8 opacity-90 [text-shadow:1px_1px_4px_rgba(0,0,0,0.2)] animate-fade-in-delayed">
            Start Your Selling Journey
          </p>
          <p className="text-md max-w-sm opacity-80 animate-fade-in-delayed-2">
            Join thousands of sellers who trust Reluv to grow their business.
            Create your store in minutes and start selling today!
          </p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <CreateStoreForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
};

export default CreateStore;
