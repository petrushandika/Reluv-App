"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  User,
  MapPin,
  MessageSquare,
  ShoppingBag,
  LogOut,
  Check,
  ChevronRight,
  Camera,
  Loader2,
  Package,
  HelpCircle,
  MessageCircle,
  Ticket,
} from "lucide-react";
import { useAuthStore } from "@/features/(auth)/store/auth.store";
import { User as UserType } from "@/features/(auth)/types";
import { updateMyProfileAvatar, getMe } from "@/features/(main)/user/api/userApi";
import { toast } from "sonner";

interface ProfileMenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  category?: string;
}

interface ProfileSidebarProps {
  user?: UserType | null;
}

const LogoutConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-9999 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-none w-full max-w-sm sm:max-w-md p-8 border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-black dark:text-white mb-4 glossy-text-title">
          Sign Out
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">
          Are you sure you want to sign out? You will need to log in again to
          access your account.
        </p>
        <div className="grid grid-cols-2 sm:flex sm:flex-row sm:justify-end items-center gap-3">
          <button
            onClick={onClose}
            className="w-full px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-none cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user }) => {
  const pathname = usePathname();
  const { user: authUser, logout, fetchAndSetUser, token } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [localUser, setLocalUser] = useState<UserType | null>(user || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const userData = await getMe();
          setLocalUser(userData);
        } catch (error) {
        }
      }
    };

    if (!user && token) {
      fetchUserData();
    } else if (user) {
      setLocalUser(user);
    }
  }, [user, token]);

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
      title: "My Vouchers",
      href: "/profile/vouchers",
      icon: Ticket,
      category: "My Purchases",
    },
    {
      title: "My Reviews",
      href: "/profile/reviews",
      icon: MessageSquare,
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
      icon: ShoppingBag,
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

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
    window.location.href = "/";
  };

  const currentUser = localUser || user || authUser;
  
  const displayName = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "User"
    : "User";

  const displayEmail = currentUser?.email || "";

  const avatarUrl = currentUser?.profile?.avatar;

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
      setLocalUser(updatedUser);
      toast.success("Avatar Updated", {
        description: "Your profile avatar has been updated successfully",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update avatar. Please try again.";
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

  return (
    <aside className="hidden lg:block w-full lg:w-80 shrink-0 lg:sticky lg:self-start">
      <div className="bg-linear-to-br from-sky-500 to-sky-700 dark:from-sky-600 dark:to-sky-800 rounded-lg p-4 sm:p-6 mb-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
          }}
        />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 bg-white/20 dark:bg-white/10 px-3 py-1.5 rounded-full">
              <Check className="w-3 h-3 text-white" />
              <span className="text-xs font-semibold text-white">Bronze</span>
            </div>
            <button className="text-white/90 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer">
              Details
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative group">
              <button
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white/30 hover:border-white/50 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center">
                    <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
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
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 truncate">
                {displayName}
              </h2>
              <p className="text-white/90 text-sm truncate">{displayEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-sm">0 Point</span>
          </div>
        </div>
      </div>

      <nav className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-950">
        <div className="space-y-6">
          {["My Details", "My Purchases", "My Sales", "Customer Services", "Account Management"].map(
            (category) => (
              <div key={category}>
                <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 px-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500/50" />
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
                            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                              isActive
                                ? "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent"
                            }`}
                          >
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-sky-600 dark:bg-sky-400 rounded-r-full" />
                            )}
                            <Icon
                              className={`w-5 h-5 ${
                                isActive
                                  ? "text-sky-600 dark:text-sky-400"
                                  : "text-slate-400 dark:text-slate-500"
                              }`}
                            />
                            <span className="text-xs font-bold uppercase tracking-widest">{item.title}</span>
                          </Link>
                        );
                      })}
                  {category === "My Purchases" &&
                    menuItems
                      .filter((item) => item.category === "My Purchases")
                      .map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                              isActive
                                ? "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent"
                            }`}
                          >
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-sky-600 dark:bg-sky-400 rounded-r-full" />
                            )}
                            <Icon
                              className={`w-5 h-5 ${
                                isActive
                                  ? "text-sky-600 dark:text-sky-400"
                                  : "text-slate-400 dark:text-slate-500"
                              }`}
                            />
                            <span className="text-xs font-bold uppercase tracking-widest">{item.title}</span>
                          </Link>
                        );
                      })}
                  {category === "My Sales" &&
                    menuItems
                      .filter((item) => item.category === "My Sales")
                      .map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                              isActive
                                ? "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent"
                            }`}
                          >
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-sky-600 dark:bg-sky-400 rounded-r-full" />
                            )}
                            <Icon
                              className={`w-5 h-5 ${
                                isActive
                                  ? "text-sky-600 dark:text-sky-400"
                                  : "text-slate-400 dark:text-slate-500"
                              }`}
                            />
                            <span className="text-xs font-bold uppercase tracking-widest">{item.title}</span>
                          </Link>
                        );
                      })}
                  {category === "Customer Services" &&
                    menuItems
                      .filter((item) => item.category === "Customer Services")
                      .map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                              isActive
                                ? "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent"
                            }`}
                          >
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-sky-600 dark:bg-sky-400 rounded-r-full" />
                            )}
                            <Icon
                              className={`w-5 h-5 ${
                                isActive
                                  ? "text-sky-600 dark:text-sky-400"
                                  : "text-slate-400 dark:text-slate-500"
                              }`}
                            />
                            <span className="text-xs font-bold uppercase tracking-widest">{item.title}</span>
                          </Link>
                        );
                      })}
                  {category === "Account Management" && (
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30 group"
                    >
                      <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
                      <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </nav>
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </aside>
  );
};

export default ProfileSidebar;
