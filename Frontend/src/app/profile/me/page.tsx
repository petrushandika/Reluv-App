"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  MapPin,
  ShoppingBag,
  LogOut,
  Check,
  Edit,
  ChevronRight,
  ChevronLeft,
  X,
  Calendar,
  Plus,
  Mail,
  Phone,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getMe, updateMe, updateMyProfile } from "@/features/user/api/userApi";
import { User as UserType } from "@/features/auth/types";
import { PrivateRoute } from "@/shared/components/guards/RouteGuards";
import { toast } from "sonner";

interface ProfileMenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  category?: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    user: authUser,
    logout,
    isAuthenticated,
    fetchAndSetUser,
  } = useAuthStore();
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

  const menuItems: ProfileMenuItem[] = [
    {
      title: "My Profile",
      href: "/profile/me",
      icon: User,
      category: "My Details",
    },
    {
      title: "My Address",
      href: "/profile/address",
      icon: MapPin,
      category: "My Details",
    },
    {
      title: "Order History",
      href: "/orders",
      icon: ShoppingBag,
      category: "My Purchases",
    },
  ];

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

  const handleLogout = () => {
    logout();
    router.push("/");
  };

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
    setIsSubmitting(true);

    try {
      const updateUserData: any = {};
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
      toast.success("Personal info updated successfully");
    } catch (error) {
      console.error("Failed to update personal info:", error);
      toast.error("Failed to update personal info");
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
    setIsSubmittingPhone(true);

    try {
      await updateMe({ phone: phoneNumber });
      await fetchAndSetUser();
      const userData = await getMe();
      setUser(userData);
      setIsPhoneInputOpen(false);
      toast.success("Phone number updated successfully");
    } catch (error) {
      console.error("Failed to update phone number:", error);
      toast.error("Failed to update phone number");
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

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User"
    : authUser
    ? `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim() || "User"
    : "User";

  const displayEmail = user?.email || authUser?.email || "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
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
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Personal Info
                  </h1>
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <form onSubmit={handleSubmitPersonalInfo} className="space-y-5">
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
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors"
                        placeholder="Date of Birth"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Fill your date of birth to get birthday reward once a
                      year.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting || !formData.firstName || !formData.lastName
                    }
                    className={`w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      formData.firstName && formData.lastName && !isSubmitting
                        ? "bg-sky-600 dark:bg-sky-500 text-white hover:bg-sky-700 dark:hover:bg-sky-600"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500"
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
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-4"
              >
                <ChevronLeft className="w-5 h-5" />
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  My Profile
                </h1>
              </button>
            </div>

            <aside className="hidden lg:block w-full lg:w-80 shrink-0">
              <div className="bg-gradient-to-br from-sky-500 to-sky-700 dark:from-sky-600 dark:to-sky-800 rounded-lg p-4 sm:p-6 mb-6 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Check className="w-3 h-3 text-white" />
                      <span className="text-xs font-semibold text-white">
                        Bronze
                      </span>
                    </div>
                    <button className="text-white/90 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors">
                      Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    {user?.profile?.avatar || authUser?.profile?.avatar ? (
                      <img
                        src={
                          user?.profile?.avatar ||
                          authUser?.profile?.avatar ||
                          "https://res.cloudinary.com/dqcyabvc2/image/upload/v1753019800/user_nxnpv1.webp"
                        }
                        alt={displayName}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white/30"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                        <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 truncate">
                        {displayName}
                      </h2>
                      <p className="text-white/90 text-sm truncate">
                        {displayEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 text-sm">0 VP</span>
                  </div>
                </div>
              </div>

              <nav className="space-y-6">
                {["My Details", "My Purchases", "Account Management"].map(
                  (category) => (
                    <div key={category}>
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                        {category}
                      </h3>
                      <div className="space-y-1">
                        {category === "My Details" &&
                          menuItems
                            .filter((item) => item.category === "My Details")
                            .map((item) => {
                              const isActive = pathname === item.href;
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                    isActive
                                      ? "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400"
                                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                  }`}
                                >
                                  {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sky-600 dark:bg-sky-400 rounded-r-full" />
                                  )}
                                  <Icon
                                    className={`w-5 h-5 ${
                                      isActive
                                        ? "text-sky-600 dark:text-sky-400"
                                        : "text-gray-500 dark:text-gray-400"
                                    }`}
                                  />
                                  <span className="font-medium">
                                    {item.title}
                                  </span>
                                </Link>
                              );
                            })}
                        {category === "My Purchases" &&
                          menuItems
                            .filter((item) => item.category === "My Purchases")
                            .map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                  <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                  <span className="font-medium">
                                    {item.title}
                                  </span>
                                </Link>
                              );
                            })}
                        {category === "Account Management" && (
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                )}
              </nav>
            </aside>

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
                    className="flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium text-sm transition-colors"
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
                    className="flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium text-sm transition-colors"
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Personal Info
                </h2>
                <button
                  onClick={handleCloseEditPersonalInfo}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmitPersonalInfo}
              className="flex-1 overflow-y-auto p-4 space-y-5"
            >
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
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors"
                    placeholder="Date of Birth"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
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
                className="w-full py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="bg-white dark:bg-gray-800 lg:rounded-xl lg:shadow-xl w-full h-auto lg:h-auto lg:max-w-md lg:max-h-[90vh] flex flex-col mt-auto lg:mt-0 rounded-t-2xl lg:rounded-t-xl max-h-[85vh] lg:overflow-hidden"
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
                  className="px-4 pb-4 pt-2 space-y-4"
                >
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent dark:focus:bg-gray-700 transition-colors"
                      placeholder="Enter phone number"
                    />
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
