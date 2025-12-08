"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  ShoppingBag,
  LogOut,
  Check,
  ChevronRight,
  Camera,
  Loader2,
  Package,
  QrCode,
  HelpCircle,
  MessageCircle,
  ScrollText,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getMe, updateMyProfileAvatar } from "@/features/user/api/userApi";
import { User as UserType } from "@/features/auth/types";
import { PrivateRoute } from "@/shared/components/guards/RouteGuards";
import { toast } from "sonner";
import Spinner from "@/shared/components/atoms/Spinner";
import Image from "next/image";
import ProfileSidebar from "@/shared/components/organisms/ProfileSidebar";

interface ProfileMenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const { isAuthenticated, logout, fetchAndSetUser } = useAuthStore();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid File Type", {
        description: "Please select a valid image file (JPEG, PNG, or WebP)",
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File Too Large", {
        description: "Avatar file size must be less than 5MB",
      });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const updatedUser = await updateMyProfileAvatar(file);
      await fetchAndSetUser();
      setUser(updatedUser);
      toast.success("Avatar Updated", {
        description: "Your profile avatar has been updated successfully",
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update avatar. Please try again.";
      toast.error("Upload Failed", {
        description: errorMessage,
      });
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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
      href: "/profile/orders",
      icon: ShoppingBag,
      category: "My Purchases",
    },
    {
      title: "My Product",
      href: "/profile/products",
      icon: Package,
      category: "My Sales",
    },
    {
      title: "Order List",
      href: "/profile/orders/seller",
      icon: ScrollText,
      category: "My Sales",
    },
    {
      title: "Help Center",
      href: "/help",
      icon: HelpCircle,
      category: "Customer Services",
    },
    {
      title: "Contact Us",
      href: "/contact",
      icon: MessageCircle,
      category: "Customer Services",
    },
  ];

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User"
    : "User";

  const displayEmail = user?.email || "";

  const avatarUrl = user?.profile?.avatar;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="hidden lg:block">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
            <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
              <ProfileSidebar user={user} />
              <main className="flex-1 min-w-0">
                <div className="hidden lg:block mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      Profile
                    </h1>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
                    Welcome to your profile page. Select an option from the sidebar to get started.
                  </p>
                </div>
              </main>
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <div className="bg-gradient-to-br from-sky-500 to-sky-700 dark:from-sky-600 dark:to-sky-800 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
              }}
            />
            <div className="relative z-10 px-4 pt-6 pb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 bg-white/20 dark:bg-white/10 px-3 py-1.5 rounded-full border border-white/30">
                  <Check className="w-3 h-3 text-white" />
                  <span className="text-xs font-semibold text-white">Bronze</span>
                </div>
                <button
                  onClick={() => router.push("/profile/me")}
                  className="text-white/90 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="relative group">
                  <button
                    onClick={handleAvatarClick}
                    disabled={isUploadingAvatar}
                    className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 hover:border-white/50 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={displayName}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                    {!isUploadingAvatar && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">
                    {displayName}
                  </h2>
                  <p className="text-white/90 text-xs sm:text-sm truncate mb-1">{displayEmail}</p>
                  <p className="text-white/80 text-xs sm:text-sm">0 Point</p>
                </div>
              </div>

              <button
                onClick={() => setShowQRModal(true)}
                className="w-full bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 flex items-center justify-center gap-2 text-white font-medium hover:bg-white/30 transition-colors cursor-pointer"
              >
                <QrCode className="w-5 h-5" />
                <span>Show Member QR</span>
              </button>
            </div>
          </div>

          <div className="px-4 py-6 space-y-6">
            {["My Details", "My Purchases", "My Sales", "Customer Services", "Account Management"].map(
              (category) => (
                <div key={category}>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {category === "My Details" &&
                      menuItems
                        .filter((item) => item.category === "My Details")
                        .map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                                <span className="text-xs sm:text-sm md:text-base font-medium text-gray-900 dark:text-white">
                                  {item.title}
                                </span>
                              </div>
                              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
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
                              className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                                <span className="text-xs sm:text-sm md:text-base font-medium text-gray-900 dark:text-white">
                                  {item.title}
                                </span>
                              </div>
                              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
                            </Link>
                          );
                        })}
                    {category === "My Sales" &&
                      menuItems
                        .filter((item) => item.category === "My Sales")
                        .map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                                <span className="text-xs sm:text-sm md:text-base font-medium text-gray-900 dark:text-white">
                                  {item.title}
                                </span>
                              </div>
                              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
                            </Link>
                          );
                        })}
                    {category === "Customer Services" &&
                      menuItems
                        .filter((item) => item.category === "Customer Services")
                        .map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                                <span className="text-xs sm:text-sm md:text-base font-medium text-gray-900 dark:text-white">
                                  {item.title}
                                </span>
                              </div>
                              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
                            </Link>
                          );
                        })}
                    {category === "Account Management" && (
                      <button
                        onClick={() => {
                          const confirmLogout = window.confirm(
                            "Are you sure you want to sign out?"
                          );
                          if (confirmLogout) {
                            logout();
                            window.location.href = "/";
                          }
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                          <span className="text-xs sm:text-sm md:text-base font-medium text-red-600 dark:text-red-400">
                            Sign Out
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 dark:text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {showQRModal && (
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQRModal(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                  Member QR Code
                </h2>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
                  <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded">
                    <QrCode className="w-32 h-32 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
                  Show this QR code to earn points and access member benefits
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
};

export default ProfilePage;

