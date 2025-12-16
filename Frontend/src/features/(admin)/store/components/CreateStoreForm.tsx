"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { Store, MapPin, Link as LinkIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

const createStoreSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Store name is required." })
    .max(255, { message: "Store name must be less than 255 characters." }),
  slug: z
    .string()
    .min(1, { message: "Store slug is required." })
    .max(255, { message: "Store slug must be less than 255 characters." })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens.",
    }),
});

interface CreateStoreFormData {
  name: string;
  slug: string;
}

interface CreateStoreFormProps {
  onSubmit: (data: CreateStoreFormData) => void;
  isLoading: boolean;
}

const CreateStoreForm = ({ onSubmit, isLoading }: CreateStoreFormProps) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-generate slug from name
  useEffect(() => {
    if (name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setSlug(generatedSlug);
    }
  }, [name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const validationResult = createStoreSchema.safeParse({ name, slug });

    if (!validationResult.success) {
      const errorMsg = validationResult.error.errors[0].message;
      setValidationError(errorMsg);
      toast.error("Validation Error", {
        description: errorMsg,
      });
      return;
    }
    onSubmit(validationResult.data);
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-sky-100 dark:bg-sky-900/30 rounded-full">
            <Store className="w-12 h-12 text-sky-600 dark:text-sky-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 glossy-text-title">
          Create Your Store
        </h2>
        <p className="text-gray-600 dark:text-gray-300 glossy-text">
          Set up your store and start selling on Reluv today!
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Store Name
          </label>
          <div className="relative">
            <Store className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Enter your store name"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            This will be displayed as your store's public name
          </p>
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Store URL (Slug)
          </label>
          <div className="relative">
            <LinkIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="your-store-slug"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            reluv.com/store/<span className="font-medium text-sky-600 dark:text-sky-400">{slug || "your-store-slug"}</span>
          </p>
        </div>

        <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-sky-900 dark:text-sky-100 mb-1">
                Location (Optional)
              </h4>
              <p className="text-xs text-sky-700 dark:text-sky-300">
                You can add your store location later in the dashboard settings to help buyers find you.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Creating Store...
            </>
          ) : (
            <>
              <Store className="-ml-1 mr-2 h-5 w-5" />
              Create Store
            </>
          )}
        </button>

        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            What's next?
          </h4>
          <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="text-sky-600 dark:text-sky-400 mr-2">✓</span>
              <span>Access your store dashboard</span>
            </li>
            <li className="flex items-start">
              <span className="text-sky-600 dark:text-sky-400 mr-2">✓</span>
              <span>Customize your store profile</span>
            </li>
            <li className="flex items-start">
              <span className="text-sky-600 dark:text-sky-400 mr-2">✓</span>
              <span>Start listing your products</span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Already have a store?{" "}
            <a
              href="/dashboard/store"
              className="font-medium text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300"
            >
              Go to Dashboard
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default CreateStoreForm;
