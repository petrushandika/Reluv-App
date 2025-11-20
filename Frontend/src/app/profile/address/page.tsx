'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ChevronLeft, Navigation2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { getMe } from '@/features/user/api/userApi';
import { User as UserType } from '@/features/auth/types';
import { PrivateRoute } from '@/shared/components/guards/RouteGuards';
import ProfileSidebar from '@/shared/components/organisms/ProfileSidebar';
import Spinner from '@/shared/components/atoms/Spinner';

const AddressPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated()) {
        router.push('/auth/login');
        return;
      }

      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="lg:hidden">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-4 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  My Address
                </h1>
              </button>
            </div>

            <ProfileSidebar user={user} />

            <main className="flex-1 min-w-0">
              <div className="hidden lg:block mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    My Address
                  </h1>
                </div>
              </div>

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
                  onClick={() => router.push('/profile/address/add')}
                  className="px-6 py-3 bg-sky-600 dark:bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors cursor-pointer"
                >
                  Add Address
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default AddressPage;
