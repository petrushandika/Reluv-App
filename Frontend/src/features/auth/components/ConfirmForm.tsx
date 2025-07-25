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
        setMessage(
          response.data.message || "Your email has been successfully verified!"
        );
      } catch (err: unknown) {
        setStatus("error");
        if (axios.isAxiosError(err)) {
          setMessage(
            err.response?.data?.message ||
              "Verification failed. The link may be invalid or expired."
          );
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

  return <ErrorState message={message} />;
};

const LoadingState = ({ message = "Loading..." }: { message?: string }) => (
  <div className="text-center p-10 flex flex-col items-center justify-center">
    <Spinner />
    <h3 className="text-xl font-semibold text-gray-800">Processing...</h3>
    <p className="text-gray-600 mt-2">{message}</p>
  </div>
);

const SuccessState = ({
  message,
  onNavigate,
}: {
  message: string;
  onNavigate: () => void;
}) => (
  <div className="text-center max-w-sm w-full bg-white p-8 border border-gray-200 rounded-lg shadow-md">
    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
    <h2 className="text-2xl font-bold text-gray-900 mb-2">
      Verification Successful!
    </h2>
    <p className="text-gray-600 mb-6">{message}</p>
    <button
      onClick={onNavigate}
      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
    >
      Proceed to Login
    </button>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="text-center max-w-sm w-full bg-white p-8 border border-red-200 rounded-lg shadow-md">
    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
    <h2 className="text-2xl font-bold text-gray-900 mb-2">
      Verification Failed
    </h2>
    <p className="text-gray-600 mb-6">{message}</p>
    <button
      onClick={() => (window.location.href = "/")}
      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
    >
      Back to Homepage
    </button>
  </div>
);

export default ConfirmForm;
