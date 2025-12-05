"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Edit,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Mail,
  AlertCircle,
} from "lucide-react";
import { z } from "zod";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getMe, updateMe } from "@/features/user/api/userApi";
import { User as UserType } from "@/features/auth/types";
import { PrivateRoute } from "@/shared/components/guards/RouteGuards";
import { toast } from "sonner";
import ProfileSidebar from "@/shared/components/organisms/ProfileSidebar";
import Spinner from "@/shared/components/atoms/Spinner";

const personalInfoSchema = z.object({
  title: z.string().optional(),
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(100, { message: "First name must be at most 100 characters" })
    .trim(),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(100, { message: "Last name must be at most 100 characters" })
    .trim(),
  dateOfBirth: z.string().optional(),
});

const phoneNumberSchema = z
  .string()
  .min(1, { message: "Phone number is required" })
  .regex(/^\+?[0-9]{7,15}$/, { message: "Invalid phone number format" })
  .trim();

const ProfilePage = () => {
  const router = useRouter();
  const { user: authUser, isAuthenticated, fetchAndSetUser } = useAuthStore();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditPersonalInfoOpen, setIsEditPersonalInfoOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditAccountInfoOpen, setIsEditAccountInfoOpen] = useState(false);
  const [isPhoneInputOpen, setIsPhoneInputOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated()) {
        router.push("/auth/login");
        return;
      }

      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated()) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  const handleOpenEditPersonalInfo = () => {
    setFormData({
      title: "",
      firstName: user?.firstName || authUser?.firstName || "",
      lastName: user?.lastName || authUser?.lastName || "",
      dateOfBirth:
        user?.birth || authUser?.birth
          ? new Date(user?.birth || authUser?.birth || "")
              .toISOString()
              .split("T")[0]
          : "",
    });
    setIsEditPersonalInfoOpen(true);
  };

  const handleCloseEditPersonalInfo = () => {
    setIsEditPersonalInfoOpen(false);
  };

  const handleSubmitPersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    setValidationError(null);
    setFieldErrors({});

    const formValidation = personalInfoSchema.safeParse(formData);

    if (!formValidation.success) {
      const errors: Record<string, string> = {};
      formValidation.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const fieldName = err.path[0] as string;
          errors[fieldName] = err.message;
        } else {
          setValidationError(err.message);
        }
      });
      setFieldErrors(errors);
      if (Object.keys(errors).length === 0 && formValidation.error.errors[0]) {
        setValidationError(formValidation.error.errors[0].message);
      }
      toast.error("Validation Failed", {
        description: "Please fix the errors in the form before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const updateUserData: {
        firstName?: string;
        lastName?: string;
        birth?: string;
      } = {};
      if (formData.firstName) updateUserData.firstName = formData.firstName;
      if (formData.lastName) updateUserData.lastName = formData.lastName;
      if (formData.dateOfBirth) {
        updateUserData.birth = formData.dateOfBirth;
      }

      if (Object.keys(updateUserData).length > 0) {
        await updateMe(updateUserData);
      }

      await fetchAndSetUser();
      const userData = await getMe();
      setUser(userData);
      setIsEditPersonalInfoOpen(false);
      toast.success("Profile Updated", {
        description: "Your personal information has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update personal info:", error);
      toast.error("Update Failed", {
        description: "Unable to update personal information. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditAccountInfo = () => {
    setPhoneNumber(user?.phone || "");
    setIsPhoneInputOpen(false);
    setIsEditAccountInfoOpen(true);
  };

  const handleCloseEditAccountInfo = () => {
    setIsEditAccountInfoOpen(false);
    setIsPhoneInputOpen(false);
    setPhoneNumber(user?.phone || "");
  };

  const handleTogglePhoneInput = () => {
    setIsPhoneInputOpen(!isPhoneInputOpen);
    if (!isPhoneInputOpen) {
      setPhoneNumber(user?.phone || "");
    }
  };

  const handleSubmitPhoneNumber = async (e: React.FormEvent) => {
    e.preventDefault();

    setPhoneError(null);

    const phoneValidation = phoneNumberSchema.safeParse(phoneNumber);

    if (!phoneValidation.success) {
      setPhoneError(
        phoneValidation.error.errors[0]?.message || "Invalid phone number"
      );
      toast.error("Validation Failed", {
        description: "Please fix the phone number before submitting.",
      });
      return;
    }

    setIsSubmittingPhone(true);

    try {
      await updateMe({ phone: phoneNumber });
      await fetchAndSetUser();
      const userData = await getMe();
      setUser(userData);
      setIsPhoneInputOpen(false);
      toast.success("Phone Updated", {
        description: "Your phone number has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update phone number:", error);
      toast.error("Update Failed", {
        description: "Unable to update phone number. Please try again.",
      });
    } finally {
      setIsSubmittingPhone(false);
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const displayEmail = user?.email || authUser?.email || "";

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {isEditPersonalInfoOpen ? (
          <div className="lg:hidden min-h-screen bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
              <div className="mb-4">
                <button
                  onClick={handleCloseEditPersonalInfo}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Personal Info
                  </h1>
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                <form onSubmit={handleSubmitPersonalInfo} className="space-y-5">
                  {validationError && (
                    <div className="flex items-center p-3 text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                      <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Title
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="title"
                          value="Mr."
                          checked={formData.title === "Mr."}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="w-4 h-4 text-sky-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-sky-500 dark:focus:ring-sky-400 focus:ring-2"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          Mr.
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="title"
                          value="Mrs./Ms."
                          checked={formData.title === "Mrs./Ms."}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="w-4 h-4 text-sky-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-sky-500 dark:focus:ring-sky-400 focus:ring-2"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          Mrs./Ms.
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      First Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => {
                        setFormData({ ...formData, firstName: e.target.value });
                        if (fieldErrors.firstName) {
                          setFieldErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.firstName;
                            return newErrors;
                          });
                        }
                      }}
                      required
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors ${
                        fieldErrors.firstName
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="First Name*"
                    />
                    {fieldErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {fieldErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Last Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => {
                        setFormData({ ...formData, lastName: e.target.value });
                        if (fieldErrors.lastName) {
                          setFieldErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.lastName;
                            return newErrors;
                          });
                        }
                      }}
                      required
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors ${
                        fieldErrors.lastName
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Last Name*"
                    />
                    {fieldErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {fieldErrors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            dateOfBirth: e.target.value,
                          });
                          if (fieldErrors.dateOfBirth) {
                            setFieldErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.dateOfBirth;
                              return newErrors;
                            });
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors ${
                          fieldErrors.dateOfBirth
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Date of Birth"
                      />
                    </div>
                    {fieldErrors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {fieldErrors.dateOfBirth}
                      </p>
                    )}
                    {!fieldErrors.dateOfBirth && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Fill your date of birth to get birthday reward once a
                        year.
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting || !formData.firstName || !formData.lastName
                    }
                    className={`w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                      formData.firstName && formData.lastName && !isSubmitting
                        ? "bg-sky-600 dark:bg-sky-500 text-white hover:bg-sky-700 dark:hover:bg-sky-600"
                        : "bg-sky-600 dark:bg-sky-500 text-white hover:bg-sky-700 dark:hover:bg-sky-600"
                    }`}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : null}
        <div
          className={`container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14 ${
            isEditPersonalInfoOpen ? "hidden lg:block" : ""
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="lg:hidden">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-4 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  My Profile
                </h1>
              </button>
            </div>

            <ProfileSidebar user={user} />

            <main className="flex-1 min-w-0">
              <div className="hidden lg:block mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    My Profile
                  </h1>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    Personal Info
                  </h2>
                  <button
                    onClick={handleOpenEditPersonalInfo}
                    className="flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium text-sm transition-colors cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
                <div className="space-y-4 sm:space-y-5">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                      Title
                    </label>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      -
                    </p>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                      First Name
                    </label>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {user?.firstName || authUser?.firstName || "-"}
                    </p>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                      Last Name
                    </label>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {user?.lastName || authUser?.lastName || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                      Date of Birth
                    </label>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {formatDate(user?.birth || authUser?.birth || null)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    Account Info
                  </h2>
                  <button
                    onClick={handleOpenEditAccountInfo}
                    className="flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium text-sm transition-colors cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
                <div className="space-y-4 sm:space-y-5">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                      Phone Number
                    </label>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {user?.phone || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                      Email
                    </label>
                    <p className="text-gray-900 dark:text-white font-semibold break-words">
                      {displayEmail || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {isEditPersonalInfoOpen && (
        <div
          className="hidden lg:flex fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 items-center justify-center p-4"
          onClick={handleCloseEditPersonalInfo}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Personal Info
                </h2>
                <button
                  onClick={handleCloseEditPersonalInfo}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmitPersonalInfo}
              className="flex-1 overflow-y-auto p-4 space-y-5"
            >
              {validationError && (
                <div className="flex items-center p-3 text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Title
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="title"
                      value="Mr."
                      checked={formData.title === "Mr."}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500 dark:focus:ring-sky-400 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Mr.
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="title"
                      value="Mrs./Ms."
                      checked={formData.title === "Mrs./Ms."}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500 dark:focus:ring-sky-400 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Mrs./Ms.
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  First Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent dark:focus:bg-gray-700 transition-colors"
                  placeholder="First Name*"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Last Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent dark:focus:bg-gray-700 transition-colors"
                  placeholder="Last Name*"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateOfBirth: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors"
                    placeholder="Date of Birth"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Fill your date of birth to get birthday reward once a year.
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting || !formData.firstName || !formData.lastName
                }
                className="w-full py-3 bg-sky-600 dark:bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditAccountInfoOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex flex-col justify-end lg:flex lg:items-center lg:justify-center lg:p-4"
          onClick={handleCloseEditAccountInfo}
        >
          <div
            className="bg-white dark:bg-gray-800 lg:rounded-xl lg:shadow-xl w-full h-auto lg:h-auto lg:max-w-md lg:max-h-[90vh] flex flex-col mt-auto lg:mt-0 rounded-t-2xl lg:rounded-t-xl max-h-[85vh] lg:overflow-hidden border-t lg:border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  onClick={handleCloseEditAccountInfo}
                  className="p-1 -ml-1"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Account Info
                </h2>
              </div>
              <div className="hidden lg:flex items-center justify-between w-full">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Account Info
                </h2>
                <button
                  onClick={handleCloseEditAccountInfo}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-0">
              <button
                type="button"
                onClick={handleTogglePhoneInput}
                className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5 text-gray-900 dark:text-white" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    Add Phone Number
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>

              {isPhoneInputOpen && (
                <form
                  onSubmit={handleSubmitPhoneNumber}
                  className="py-2 space-y-4"
                >
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (phoneError) {
                          setPhoneError(null);
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors ${
                        phoneError
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Enter phone number"
                    />
                    {phoneError && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {phoneError}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPhoneInputOpen(false)}
                      className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingPhone}
                      className="flex-1 py-2 px-4 bg-sky-600 dark:bg-sky-500 text-white rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingPhone ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              )}

              <button
                type="button"
                disabled
                className="w-full flex items-center justify-between p-4 rounded-lg opacity-60 cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-900 dark:text-white" />
                  <div className="flex flex-col items-start">
                    <span className="text-gray-900 dark:text-white font-medium">
                      Change Email
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 break-words">
                      {displayEmail || "-"}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </PrivateRoute>
  );
};

export default ProfilePage;
