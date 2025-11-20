"use client";

import React from "react";
import {
  X,
  Copy,
  Mail,
  MessageCircle,
  Send,
  Twitter,
  Facebook,
} from "lucide-react";
import { Product } from "@/features/products/types";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const ShareModal = ({ isOpen, onClose, product }: ShareModalProps) => {
  if (!isOpen) return null;

  const productUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/products/${product.id}`
      : "";
  const shareText = encodeURIComponent(
    `Check out this amazing product: ${product.name} on Reluv!`
  );
  const fullShareText = `${shareText} ${productUrl}`;

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <MessageCircle />,
      href: `https://wa.me/?text=${fullShareText}`,
      color: "bg-green-500",
    },
    {
      name: "Telegram",
      icon: <Send />,
      href: `https://t.me/share/url?url=${productUrl}&text=${shareText}`,
      color: "bg-sky-500",
    },
    {
      name: "Facebook",
      icon: <Facebook />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${productUrl}`,
      color: "bg-blue-600",
    },
    {
      name: "Twitter",
      icon: <Twitter />,
      href: `https://twitter.com/intent/tweet?url=${productUrl}&text=${shareText}`,
      color: "bg-blue-400",
    },
    {
      name: "Email",
      icon: <Mail />,
      href: `mailto:?subject=Check out this product from Reluv&body=${fullShareText}`,
      color: "bg-gray-500",
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(productUrl).then(
      () => {
        toast.success("Link copied to clipboard!");
      },
      (err) => {
        toast.error("Failed to copy link.");
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-xl w-full max-w-sm sm:max-w-md p-6 border border-gray-200/50 dark:border-gray-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white glossy-text-title">
            Share this Product
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm glossy-text">
          Share this link via
        </p>
        <div className="flex space-x-4 overflow-x-auto pb-3 share-modal-scroll">
          {shareOptions.map((option) => (
            <a
              key={option.name}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-shrink-0 flex flex-col items-center justify-center p-3 bg-gray-50/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-lg hover:bg-gray-100/90 dark:hover:bg-gray-600/90 transition-colors w-20 shadow-sm cursor-pointer"
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-white ${option.color}`}
              >
                {React.cloneElement(option.icon, {
                  className: "w-5 h-5 sm:w-6 sm:h-6",
                })}
              </div>
              <span className="text-xs mt-2 text-gray-700 dark:text-gray-300 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                {option.name}
              </span>
            </a>
          ))}
        </div>

        <p className="text-gray-600 dark:text-gray-300 my-4 text-sm">
          Or copy link
        </p>
        <div className="flex items-center">
          <input
            type="text"
            readOnly
            value={productUrl}
            className="w-full px-3 py-2 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-l-md text-sm text-gray-600 dark:text-gray-300 focus:outline-none shadow-sm glossy-text"
          />
          <button
            onClick={copyToClipboard}
            className="bg-sky-600/90 dark:bg-sky-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-r-md hover:bg-sky-700/90 dark:hover:bg-sky-600/90 transition-colors shadow-md glossy-text-strong cursor-pointer"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
