"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Store } from "lucide-react";

const AuthWarningModal = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-sky-50 rounded-xl">
      <div className="relative bg-sky-600 p-5 rounded-full mb-6 shadow-lg shadow-sky-200/50">
        <Store className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-sky-800">
        One More Step to Start Selling
      </h2>
      <p className="mt-4 text-gray-600 max-w-sm">
        Join our community of sellers! Please sign in or create an account to
        list your first item.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          onClick={() => router.push("/auth/login")}
          className="w-full flex justify-center items-center bg-sky-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push("/auth/register")}
          className="w-full flex justify-center items-center bg-white text-sky-600 px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors border-2 border-sky-600"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default AuthWarningModal;
