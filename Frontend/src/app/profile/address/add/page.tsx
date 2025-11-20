'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ChevronLeft, X, Navigation } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { getMe } from '@/features/user/api/userApi';
import { User as UserType } from '@/features/auth/types';
import { PrivateRoute } from '@/shared/components/guards/RouteGuards';
import ProfileSidebar from '@/shared/components/organisms/ProfileSidebar';
import MapPicker from '@/shared/components/organisms/MapPicker';
import GeoSearch from '@/shared/components/organisms/GeoSearch';
import type { LatLngExpression } from 'leaflet';
import type { SearchResult } from 'leaflet-geosearch/dist/providers/provider.js';
import { toast } from 'sonner';

const AddAddressPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPinpointModal, setShowPinpointModal] = useState(false);
  const [mapPosition, setMapPosition] = useState<LatLngExpression>([
    -6.2088, 106.8456,
  ]);
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    fullAddress: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    label: '',
    recipientName: '',
    phoneNumber: '',
    provinceCityDistrictPostal: '',
    fullAddress: '',
    notes: '',
  });

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    console.log('Map position:', mapPosition);
    toast.success('Address saved successfully');
    router.push('/profile/address');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900 pb-24 lg:pb-0">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="lg:hidden">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-4 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Add Address
                </h1>
              </button>
            </div>

            <ProfileSidebar user={user} />

            <main className="flex-1 min-w-0">
              <div className="hidden lg:block mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    Add Address
                  </h1>
                </div>
              </div>

              <form id="address-form" onSubmit={handleSubmit}>
                <div className="flex flex-col lg:flex-row lg:gap-8">
                  <div className="flex-1 space-y-6 mb-6 lg:mb-0">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address Label<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="label"
                        value={formData.label}
                        onChange={handleInputChange}
                        required
                        placeholder="Example: Home, Office, etc."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors"
                      />
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                        Recipient
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Name<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="recipientName"
                            value={formData.recipientName}
                            onChange={handleInputChange}
                            required
                            placeholder="Name*"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                            placeholder="Phone Number*"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="lg:hidden">
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                          Set pinpoint
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Pinpoint your address to use instant delivery services
                          (optional)
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowPinpointModal(true)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-600 dark:bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors cursor-pointer"
                        >
                          <MapPin className="w-5 h-5" />
                          Add Pinpoint
                        </button>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                        Address Detail
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Province, City, District, Postal Code
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="provinceCityDistrictPostal"
                            value={formData.provinceCityDistrictPostal}
                            onChange={handleInputChange}
                            required
                            placeholder="Province, City, District, Postal Code*"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Address<span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="fullAddress"
                            value={formData.fullAddress}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            placeholder="Full Address*"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors resize-y"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Make sure the full address matches your pinpoint.
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Notes for courier
                          </label>
                          <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Notes for courier"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors resize-y"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:block lg:w-96 flex-shrink-0 mb-6 lg:mb-0">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 h-fit">
                      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                        Set pinpoint
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Pinpoint your address to use instant delivery services
                        (optional)
                      </p>

                      <button
                        type="button"
                        onClick={() => setShowPinpointModal(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-sky-600 dark:border-sky-500 text-sky-600 dark:text-sky-400 font-medium rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors cursor-pointer"
                      >
                        <MapPin className="w-5 h-5" />
                        Add Pinpoint
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              <div className="hidden lg:block mt-6">
                <button
                  type="submit"
                  form="address-form"
                  className="w-full lg:w-auto px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </main>
          </div>
        </div>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 z-50 shadow-lg">
          <button
            type="submit"
            form="address-form"
            className="w-full px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors cursor-pointer"
          >
            Save Address
          </button>
        </div>

        {showPinpointModal && (
          <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPinpointModal(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col lg:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full lg:w-1/2 p-6 flex flex-col overflow-y-auto relative">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Add Pinpoint
                  </h2>
                  <button
                    onClick={() => setShowPinpointModal(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="relative w-full">
                    <GeoSearch
                      onLocationSelect={(location: SearchResult) => {
                        const newPos: LatLngExpression = [
                          location.y,
                          location.x,
                        ];
                        setMapPosition(newPos);
                        setSelectedLocation({
                          name: location.label.split(',')[0],
                          fullAddress: location.label,
                        });
                      }}
                    />
                  </div>
                </div>

                {selectedLocation ? (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Selected Location
                    </label>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="font-bold text-gray-900 dark:text-white mb-1">
                        {selectedLocation.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {selectedLocation.fullAddress}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Selected Location
                    </label>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No location selected
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (selectedLocation || mapPosition) {
                      if (!selectedLocation) {
                        setSelectedLocation({
                          name: 'Selected Location',
                          fullAddress: 'Location selected',
                        });
                      }
                      setShowPinpointModal(false);
                    }
                  }}
                  disabled={!selectedLocation && !mapPosition}
                  className="mt-auto w-full px-6 py-3 bg-sky-600 dark:bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Select Location
                </button>
              </div>

              <div className="w-full lg:w-1/2 relative bg-gray-100 dark:bg-gray-900">
                <button
                  onClick={() => setShowPinpointModal(false)}
                  className="lg:hidden absolute top-4 left-4 z-[1000] p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>

                <button
                  type="button"
                  className="absolute bottom-4 right-4 z-[1000] flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Use Current Location
                  </span>
                </button>

                <div className="h-full min-h-[400px] lg:min-h-[600px]">
                  <MapPicker
                    position={mapPosition}
                    setPosition={setMapPosition}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
};

export default AddAddressPage;
