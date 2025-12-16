"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ChevronLeft, Navigation2, Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "@/features/(auth)/store/auth.store";
import { getMe } from "@/features/(main)/user/api/userApi";
import { User as UserType } from "@/features/(auth)/types";
import { PrivateRoute } from "@/shared/components/guards/RouteGuards";
import ProfileSidebar from "@/shared/components/layout/ProfileSidebar";
import Spinner from "@/shared/components/common/Spinner";
import { getAddresses, deleteAddress } from "@/features/(main)/address/api/addressApi";
import { Address } from "@/features/(main)/address/types";
import { toast } from "sonner";

const AddressPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated()) {
        router.push("/login");
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

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!isAuthenticated()) return;

      try {
        setIsLoadingAddresses(true);
        const addressList = await getAddresses();
        setAddresses(addressList);
      } catch (error) {
        setAddresses([]);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    if (isAuthenticated()) {
      fetchAddresses();
    }
  }, [isAuthenticated]);

  const handleDelete = async (id: number) => {
    if (addresses.length <= 1) {
      toast.error("Cannot Delete Address", {
        description: "You must have at least one address.",
      });
      return;
    }

    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      await deleteAddress(id);
      setAddresses(addresses.filter((addr) => addr.id !== id));
      toast.success("Address Deleted", {
        description: "The address has been deleted successfully.",
      });
    } catch (error: any) {
      toast.error("Failed to Delete Address", {
        description:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while deleting the address.",
      });
    }
  };

  if (isLoading || isLoadingAddresses) {
    return <Spinner />;
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
            <div className="lg:hidden mb-4">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    My Address
                  </h1>
                </button>
                {addresses.length > 0 && (
                  <button
                    onClick={() => router.push("/profile/address/add")}
                    className="ml-auto px-3 py-1.5 text-sm bg-sky-600 dark:bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors cursor-pointer"
                  >
                    Add Address
                  </button>
                )}
              </div>
            </div>

            <ProfileSidebar user={user} />

            <main className="flex-1 min-w-0">
              <div className="hidden lg:block mb-6 lg:pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    My Address
                  </h1>
                  {addresses.length > 0 && (
                    <button
                      onClick={() => router.push("/profile/address/add")}
                      className="ml-auto px-3 py-1.5 text-sm bg-sky-600 dark:bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors cursor-pointer"
                    >
                      Add Address
                    </button>
                  )}
                </div>
              </div>

              {addresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
                  <div className="mb-8 flex items-center justify-center">
                    <Navigation2 className="w-24 h-24 sm:w-32 sm:h-32 text-sky-600 dark:text-sky-400 stroke-[1.5] transform rotate-45" />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    There is no address yet
                  </h2>

                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center mb-8 max-w-md">
                    Add an address for a faster checkout when you shop.
                  </p>

                  <button
                    onClick={() => router.push("/profile/address/add")}
                    className="px-4 py-2 text-sm bg-sky-600 dark:bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors cursor-pointer"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          {address.isDefault && (
                            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-sky-600 dark:bg-sky-500 text-white text-xs font-medium rounded">
                              Main Address
                            </span>
                          )}
                          <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                            {address.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/profile/address/edit?id=${address.id}`
                              )
                            }
                            className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm font-medium">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(address.id)}
                            disabled={addresses.length <= 1}
                            className="flex items-center gap-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm font-medium">
                              Delete
                            </span>
                          </button>
                        </div>
                      </div>

                        <div className="space-y-1 text-gray-700 dark:text-gray-300">
                          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                            {address.recipient}
                          </p>
                          <p className="text-xs sm:text-sm">{address.phone}</p>
                          <p className="text-xs sm:text-sm">
                            {address.address}
                            {address.address &&
                              (address.city || address.province) &&
                              ", "}
                            {address.city && address.province
                              ? `${address.city}, ${address.province}`
                              : address.city || address.province}
                            {address.postalCode && `, ${address.postalCode}`}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default AddressPage;
