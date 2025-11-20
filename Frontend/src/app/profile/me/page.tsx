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
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getMe } from "@/features/user/api/userApi";
import { User as UserType } from "@/features/auth/types";
import { PrivateRoute } from "@/shared/components/guards/RouteGuards";

interface ProfileMenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  category?: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user: authUser, logout, isAuthenticated } = useAuthStore();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              {/* User Card */}
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

              {/* Navigation Menu */}
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

            {/* Right Content Area */}
            <main className="flex-1 min-w-0">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    My Profile
                  </h1>
                </div>
              </div>

              {/* Personal Info Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    Personal Info
                  </h2>
                  <button className="flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium text-sm transition-colors">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                      Title
                    </label>
                    <p className="text-gray-900 dark:text-white">-</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                      First Name
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {user?.firstName || authUser?.firstName || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                      Last Name
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {user?.lastName || authUser?.lastName || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                      Date of Birth
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(user?.profile?.birth || null)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                      Gender
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {user?.profile?.gender ||
                        authUser?.profile?.gender ||
                        "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Info Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    Account Info
                  </h2>
                  <button className="flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium text-sm transition-colors">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                      Phone Number
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {user?.phone || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                      Email
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {displayEmail || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default ProfilePage;
