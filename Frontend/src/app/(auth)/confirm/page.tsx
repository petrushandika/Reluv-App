"use client";

import React from "react";
import {
  UserCheck,
  Tag,
  ShoppingCart,
  Package,
  Gem,
  Percent,
  Gift,
  Star,
  MailCheck,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import ConfirmForm from "@/features/(auth)/components/ConfirmForm";

const Confirm = () => {
  const promoCards = [
    {
      id: 1,
      icon: <MailCheck className="w-7 h-7 text-sky-200" />,
      title: "Email Verified",
      description: "Your communication channel is secure.",
      style: {
        top: "20%",
        left: "15%",
        animationName: "slide-from-left",
        animationDelay: "0s",
      },
    },
    {
      id: 2,
      icon: <ShieldCheck className="w-7 h-7 text-sky-200" />,
      title: "Account Secured",
      description: "Enjoy enhanced security features.",
      style: {
        top: "45%",
        left: "60%",
        animationName: "slide-from-right",
        animationDelay: "1.5s",
      },
    },
    {
      id: 3,
      icon: <KeyRound className="w-7 h-7 text-sky-200" />,
      title: "Full Access Unlocked",
      description: "Explore all features available to you.",
      style: {
        top: "70%",
        left: "25%",
        animationName: "slide-from-left",
        animationDelay: "3s",
      },
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
            <div key={card.id} className="promo-card-sky" style={card.style}>
              {card.icon}
              <div>
                <p className="font-bold text-white">{card.title}</p>
                <p className="text-sky-100 text-sm">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white px-12 text-center">
          <UserCheck className="w-24 h-24 mb-6 text-white animate-fade-in" />
          <h1 className="text-5xl font-bold text-white mb-4 tracking-wide [text-shadow:_2px_2px_8px_rgba(0,0,0,0.2)] animate-fade-in-delayed">
            One Last Step
          </h1>
          <p className="text-xl font-light max-w-sm opacity-90 [text-shadow:_1px_1px_4px_rgba(0,0,0,0.2)] animate-fade-in-delayed-2">
            Let`s confirm your email to activate and secure your account.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <ConfirmForm />
      </div>
    </div>
  );
};

export default Confirm;
