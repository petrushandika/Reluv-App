"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, AlertTriangle } from "lucide-react";
import axios from "axios";
import { api } from "../api/authApi";
import Spinner from "@/shared/components/atoms/Spinner";

const ConfirmForm = () => (
  <Suspense fallback={<LoadingState />}>
    <ConfirmForms />
  </Suspense>
);

const ConfirmForms = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState(
    "Verifying your email, please wait..."
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(
        "Verification token not found. Please check the link from your email."
      );
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await api.get(`/auth/confirm?token=${token}`);
        setStatus("success");
        const message = typeof response.data === 'string' 
          ? response.data 
          : (response.data?.message || "Your email has been successfully verified!");
        setMessage(message);
      } catch (err: unknown) {
        setStatus("error");
        if (axios.isAxiosError(err)) {
          const errorMessage = typeof err.response?.data === 'string'
            ? err.response.data
            : (err.response?.data?.message || "Verification failed. The link may be invalid or expired.");
          setMessage(errorMessage);
        } else {
          setMessage("An unexpected error occurred during verification.");
        }
      }
    };

    const timer = setTimeout(verifyToken, 1500);
    return () => clearTimeout(timer);
  }, [token]);

  if (status === "loading") {
    return <LoadingState message={message} />;
  }

  if (status === "success") {
    return (
      <SuccessState
        message={message}
        onNavigate={() => router.push("/auth/login?verified=true")}
      />
    );
  }

  return (
    <Suspense fallback={<LoadingState message="Loading..." />}>
      <ErrorState message={message} />
    </Suspense>
  );
};

const LoadingState = ({ message = "Loading..." }: { message?: string }) => (
  <div className="text-center p-10 flex flex-col items-center justify-center">
    <Spinner />
    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Processing...</h3>
    <p className="text-gray-600 dark:text-gray-300 mt-2">{message}</p>
  </div>
);

const SuccessState = ({
  message,
  onNavigate,
}: {
  message: string;
  onNavigate: () => void;
}) => (
  <div className="text-center max-w-sm w-full bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
    <CheckCircle className="w-16 h-16 text-green-500 dark:text-green-400 mx-auto mb-4" />
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      Verification Successful!
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
    <button
      onClick={onNavigate}
      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 cursor-pointer"
    >
      Proceed to Login
    </button>
  </div>
);

const ErrorState = ({ message }: { message: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const isExpired = message.toLowerCase().includes("expired") || message.toLowerCase().includes("expire");

  return (
    <div className="text-center max-w-sm w-full bg-white dark:bg-gray-800 p-8 border border-red-200 dark:border-red-800 rounded-lg shadow-md">
      <AlertTriangle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Verification Failed
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
      {isExpired && (
        <div className="mb-4">
          <button
            onClick={() => router.push(`/auth/verification${email ? `?email=${encodeURIComponent(email)}` : ""}`)}
            className="w-full flex justify-center py-3 px-4 border border-sky-600 dark:border-sky-400 rounded-lg shadow-sm text-sm font-medium text-sky-600 dark:text-sky-400 bg-white dark:bg-gray-800 hover:bg-sky-50 dark:hover:bg-sky-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-sky-400 transition-all duration-200 cursor-pointer mb-3"
          >
            Resend Verification Email
          </button>
        </div>
      )}
      <button
        onClick={() => router.push("/auth/login")}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-600 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400 cursor-pointer"
      >
        Back to Login
      </button>
    </div>
  );
};

export default ConfirmForm;
