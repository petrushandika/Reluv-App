'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, ChevronLeft, X, Navigation, ChevronDown, Search } from 'lucide-react';
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
import Spinner from '@/shared/components/atoms/Spinner';
import { getAddress, updateAddress } from '@/features/address/api/addressApi';

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  name: string;
  province_id: string;
}

interface District {
  id: string;
  name: string;
  regency_id: string;
}

interface SubDistrict {
  id: string;
  name: string;
  district_id: string;
}

const EditAddressPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = searchParams.get('id');
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
    streetAddress: '',
    country: 'ID',
    province: '',
    city: '',
    district: '',
    subDistrict: '',
    postalCode: '',
    notes: '',
    isDefault: false,
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingRegencies, setIsLoadingRegencies] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingSubDistricts, setIsLoadingSubDistricts] = useState(false);
  const [provinceSearchTerm, setProvinceSearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [districtSearchTerm, setDistrictSearchTerm] = useState('');
  const [subDistrictSearchTerm, setSubDistrictSearchTerm] = useState('');
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [isSubDistrictOpen, setIsSubDistrictOpen] = useState(false);

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

  useEffect(() => {
    const fetchAddress = async () => {
      if (!addressId) {
        router.push('/profile/address');
        return;
      }

      try {
        const address = await getAddress(Number(addressId));
        
        const provinceMatch = provinces.find((p) => p.name === address.province);
        
        const addressLines = address.address.split('\n');
        const streetAddress = addressLines[0] || '';
        const notes = addressLines.slice(1).join('\n') || '';
        
        setFormData({
          label: address.label,
          recipientName: address.recipient,
          phoneNumber: address.phone,
          streetAddress: streetAddress,
          country: 'ID',
          province: provinceMatch?.id || '',
          city: '',
          district: '',
          subDistrict: '',
          postalCode: address.postalCode,
          notes: notes,
          isDefault: address.isDefault,
        });

        if (address.latitude && address.longitude) {
          setMapPosition([address.latitude, address.longitude]);
        }

        if (provinceMatch) {
          const response = await fetch(
            `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceMatch.id}.json`
          );
          const data: Regency[] = await response.json();
          setRegencies(data);
          
          const cityMatch = data.find((r) => r.name === address.city);
          if (cityMatch) {
            setFormData((prev) => ({ ...prev, city: cityMatch.id }));
            
            const districtResponse = await fetch(
              `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${cityMatch.id}.json`
            );
            const districtData: District[] = await districtResponse.json();
            setDistricts(districtData);
            
            const districtMatch = districtData.find((d) => d.name === address.district);
            if (districtMatch) {
              setFormData((prev) => ({ ...prev, district: districtMatch.id }));
              
              const subDistrictResponse = await fetch(
                `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtMatch.id}.json`
              );
              const subDistrictData: SubDistrict[] = await subDistrictResponse.json();
              setSubDistricts(subDistrictData);
              
              const subDistrictMatch = subDistrictData.find((s) => s.name === address.subDistrict);
              if (subDistrictMatch) {
                setFormData((prev) => ({ ...prev, subDistrict: subDistrictMatch.id }));
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch address:', error);
        toast.error('Failed to Load Address', {
          description: 'Could not load address data.',
        });
        router.push('/profile/address');
      }
    };

    if (addressId && provinces.length > 0) {
      fetchAddress();
    }
  }, [addressId, provinces, router]);

  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const response = await fetch(
          'https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json'
        );
        const data: Province[] = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error('Failed to fetch provinces:', error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (formData.province) {
      const fetchRegencies = async () => {
        setIsLoadingRegencies(true);
        try {
          const response = await fetch(
            `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${formData.province}.json`
          );
          const data: Regency[] = await response.json();
          setRegencies(data);
        } catch (error) {
          console.error('Failed to fetch regencies:', error);
          setRegencies([]);
        } finally {
          setIsLoadingRegencies(false);
        }
      };
      fetchRegencies();
    } else {
      setRegencies([]);
      setFormData((prev) => ({ ...prev, city: '', district: '', subDistrict: '' }));
    }
  }, [formData.province]);

  useEffect(() => {
    if (formData.city) {
      const fetchDistricts = async () => {
        setIsLoadingDistricts(true);
        try {
          const response = await fetch(
            `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${formData.city}.json`
          );
          const data: District[] = await response.json();
          setDistricts(data);
          
          const currentDistrictName = formData.district;
          if (currentDistrictName && typeof currentDistrictName === 'string' && !currentDistrictName.match(/^\d+$/)) {
            const districtMatch = data.find((d) => d.name === currentDistrictName);
            if (districtMatch) {
              setFormData((prev) => ({ ...prev, district: districtMatch.id }));
            }
          }
        } catch (error) {
          console.error('Failed to fetch districts:', error);
          setDistricts([]);
        } finally {
          setIsLoadingDistricts(false);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setFormData((prev) => ({ ...prev, district: '', subDistrict: '' }));
    }
  }, [formData.city]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (formData.district) {
      const fetchSubDistricts = async () => {
        setIsLoadingSubDistricts(true);
        try {
          const response = await fetch(
            `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${formData.district}.json`
          );
          const data: SubDistrict[] = await response.json();
          setSubDistricts(data);
          
          const currentSubDistrictName = formData.subDistrict;
          if (currentSubDistrictName && typeof currentSubDistrictName === 'string' && !currentSubDistrictName.match(/^\d+$/)) {
            const subDistrictMatch = data.find((s) => s.name === currentSubDistrictName);
            if (subDistrictMatch) {
              setFormData((prev) => ({ ...prev, subDistrict: subDistrictMatch.id }));
            }
          }
        } catch (error) {
          console.error('Failed to fetch sub-districts:', error);
          setSubDistricts([]);
        } finally {
          setIsLoadingSubDistricts(false);
        }
      };
      fetchSubDistricts();
    } else {
      setSubDistricts([]);
      setFormData((prev) => ({ ...prev, subDistrict: '' }));
    }
  }, [formData.district]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = (provinceId: string) => {
    setFormData((prev) => ({ ...prev, province: provinceId, city: '' }));
    setIsProvinceOpen(false);
    setProvinceSearchTerm('');
  };

  const handleCityChange = (regencyId: string) => {
    setFormData((prev) => ({ ...prev, city: regencyId, district: '', subDistrict: '' }));
    setIsCityOpen(false);
    setCitySearchTerm('');
  };

  const handleDistrictChange = (districtId: string) => {
    setFormData((prev) => ({ ...prev, district: districtId, subDistrict: '' }));
    setIsDistrictOpen(false);
    setDistrictSearchTerm('');
  };

  const handleSubDistrictChange = (subDistrictId: string) => {
    setFormData((prev) => ({ ...prev, subDistrict: subDistrictId }));
    setIsSubDistrictOpen(false);
    setSubDistrictSearchTerm('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressId) return;

    try {
      const selectedProvince = provinces.find((p) => p.id === formData.province);
      const selectedCity = regencies.find((r) => r.id === formData.city);

      if (!selectedProvince || !selectedCity) {
        toast.error('Invalid Selection', {
          description: 'Please select both province and city.',
        });
        return;
      }

      const selectedDistrict = districts.find((d) => d.id === formData.district);
      const selectedSubDistrict = subDistricts.find((s) => s.id === formData.subDistrict);

      const addressParts = [formData.streetAddress.trim()];
      if (formData.notes.trim()) {
        addressParts.push(formData.notes.trim());
      }
      const fullAddress = addressParts.join('\n');

      const addressData = {
        label: formData.label.trim(),
        recipient: formData.recipientName.trim(),
        phone: formData.phoneNumber.trim(),
        province: selectedProvince.name,
        city: selectedCity.name,
        district: selectedDistrict?.name || formData.district.trim(),
        subDistrict: selectedSubDistrict?.name || formData.subDistrict.trim(),
        postalCode: formData.postalCode.trim(),
        address: fullAddress,
        isDefault: formData.isDefault,
        latitude: Array.isArray(mapPosition) ? mapPosition[0] : undefined,
        longitude: Array.isArray(mapPosition) ? mapPosition[1] : undefined,
      };

      await updateAddress(Number(addressId), addressData);
      toast.success('Address Updated', {
        description: 'Your address has been updated successfully.',
      });
      router.push('/profile/address');
    } catch (error: unknown) {
      console.error('Failed to update address:', error);
      const errorMessage = (error as { response?: { data?: { message?: string | string[] } }; message?: string })?.response?.data?.message || (error as { message?: string })?.message || 'An error occurred while updating the address.';
      const errorDetails = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
      toast.error('Failed to Update Address', {
        description: errorDetails,
      });
    }
  };

  const FormInput = ({
    id,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    required = false,
  }: {
    id: string;
    label: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
  }) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        onKeyPress={(e) => {
          e.stopPropagation();
        }}
        onKeyUp={(e) => {
          e.stopPropagation();
        }}
        onInput={(e) => {
          e.stopPropagation();
        }}
        onCompositionStart={(e) => {
          e.stopPropagation();
        }}
        onCompositionUpdate={(e) => {
          e.stopPropagation();
        }}
        onCompositionEnd={(e) => {
          e.stopPropagation();
        }}
        onFocus={(e) => {
          e.stopPropagation();
        }}
        onBlur={(e) => {
          e.stopPropagation();
        }}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-base placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors"
      />
    </div>
  );

  const FormSelect = ({
    id,
    label,
    options,
    value,
    onChange,
    disabled = false,
    placeholder,
    isOpen,
    setIsOpen,
    required = false,
  }: {
    id: string;
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    placeholder?: string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    required?: boolean;
  }) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onMouseDown={() => setIsOpen(!isOpen)}
          className="block w-full pl-4 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed appearance-none cursor-pointer"
        >
          <option value="" disabled>
            {placeholder || `Select ${label}`}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>
    </div>
  );

  const SearchableSelect = ({
    id,
    label,
    value,
    options,
    isLoading,
    searchTerm,
    setSearchTerm,
    isOpen,
    setIsOpen,
    onSelect,
    disabled = false,
    placeholder,
    required = false,
  }: {
    id: string;
    label: string;
    value: string;
    options: { id: string; name: string }[];
    isLoading: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSelect: (id: string) => void;
    disabled?: boolean;
    placeholder?: string;
    required?: boolean;
  }) => {
    const selectRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (
          selectRef.current &&
          !selectRef.current.contains(target) &&
          !target.closest('input') &&
          !target.closest('textarea')
        ) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, setIsOpen]);

    const filteredOptions = options.filter((option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find((opt) => opt.id === value);

    return (
      <div ref={selectRef} className="relative">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="w-full flex justify-between items-center text-left px-4 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed cursor-pointer"
          >
            <span
              className={
                selectedOption ? '' : 'text-gray-400 dark:text-gray-500'
              }
            >
              {isLoading
                ? 'Loading...'
                : selectedOption
                  ? selectedOption.name
                  : placeholder || `Select ${label}`}
            </span>
          </button>
          <ChevronDown
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-hidden">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-base placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  onKeyUp={(e) => e.stopPropagation()}
                  onInput={(e) => e.stopPropagation()}
                  onCompositionStart={(e) => e.stopPropagation()}
                  onCompositionUpdate={(e) => e.stopPropagation()}
                  onCompositionEnd={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-48">
              {filteredOptions.length === 0 ? (
                <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(option.id);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    {option.name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <Spinner />;
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
                  Edit Address
                </h1>
              </button>
            </div>

            <ProfileSidebar user={user} />

            <main className="flex-1 min-w-0">
              <div className="hidden lg:block mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    Edit Address
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
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                        onKeyDown={(e) => {
                          e.stopPropagation();
                        }}
                        onKeyPress={(e) => {
                          e.stopPropagation();
                        }}
                        onKeyUp={(e) => {
                          e.stopPropagation();
                        }}
                        onInput={(e) => {
                          e.stopPropagation();
                        }}
                        onCompositionStart={(e) => {
                          e.stopPropagation();
                        }}
                        onCompositionUpdate={(e) => {
                          e.stopPropagation();
                        }}
                        onCompositionEnd={(e) => {
                          e.stopPropagation();
                        }}
                        onFocus={(e) => {
                          e.stopPropagation();
                        }}
                        onBlur={(e) => {
                          e.stopPropagation();
                        }}
                        required
                        placeholder="Example: Home, Office, etc."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-base placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors"
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
                            onMouseDown={(e) => {
                              e.stopPropagation();
                            }}
                            onKeyDown={(e) => {
                              e.stopPropagation();
                            }}
                            onKeyPress={(e) => {
                              e.stopPropagation();
                            }}
                            onKeyUp={(e) => {
                              e.stopPropagation();
                            }}
                            onInput={(e) => {
                              e.stopPropagation();
                            }}
                            onCompositionStart={(e) => {
                              e.stopPropagation();
                            }}
                            onCompositionUpdate={(e) => {
                              e.stopPropagation();
                            }}
                            onCompositionEnd={(e) => {
                              e.stopPropagation();
                            }}
                            onFocus={(e) => {
                              e.stopPropagation();
                            }}
                            onBlur={(e) => {
                              e.stopPropagation();
                            }}
                            required
                            placeholder="Name*"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-base placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors"
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
                            onMouseDown={(e) => {
                              e.stopPropagation();
                            }}
                            onKeyDown={(e) => {
                              e.stopPropagation();
                            }}
                            onKeyPress={(e) => {
                              e.stopPropagation();
                            }}
                            onKeyUp={(e) => {
                              e.stopPropagation();
                            }}
                            onInput={(e) => {
                              e.stopPropagation();
                            }}
                            onCompositionStart={(e) => {
                              e.stopPropagation();
                            }}
                            onCompositionUpdate={(e) => {
                              e.stopPropagation();
                            }}
                            onCompositionEnd={(e) => {
                              e.stopPropagation();
                            }}
                            onFocus={(e) => {
                              e.stopPropagation();
                            }}
                            onBlur={(e) => {
                              e.stopPropagation();
                            }}
                            required
                            placeholder="Phone Number*"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-base placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors"
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
                        <FormInput
                          id="streetAddress"
                          label="Street Address"
                          placeholder="Sudirman St. No. 52-53"
                          value={formData.streetAddress}
                          onChange={handleInputChange}
                          required
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormSelect
                            id="country"
                            label="Country"
                            options={[{ value: 'ID', label: 'Indonesia' }]}
                            value={formData.country}
                            onChange={handleSelectChange}
                            isOpen={isCountryOpen}
                            setIsOpen={setIsCountryOpen}
                            required
                          />
                          <SearchableSelect
                            id="province"
                            label="Province"
                            value={formData.province}
                            options={provinces}
                            isLoading={isLoadingProvinces}
                            searchTerm={provinceSearchTerm}
                            setSearchTerm={setProvinceSearchTerm}
                            isOpen={isProvinceOpen}
                            setIsOpen={setIsProvinceOpen}
                            onSelect={handleProvinceChange}
                            placeholder="Select Province"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <SearchableSelect
                            id="city"
                            label="City"
                            value={formData.city}
                            options={regencies}
                            isLoading={isLoadingRegencies}
                            searchTerm={citySearchTerm}
                            setSearchTerm={setCitySearchTerm}
                            isOpen={isCityOpen}
                            setIsOpen={setIsCityOpen}
                            onSelect={handleCityChange}
                            disabled={!formData.province}
                            placeholder="Select City"
                            required
                          />
                          <SearchableSelect
                            id="district"
                            label="District"
                            value={formData.district}
                            options={districts}
                            isLoading={isLoadingDistricts}
                            searchTerm={districtSearchTerm}
                            setSearchTerm={setDistrictSearchTerm}
                            isOpen={isDistrictOpen}
                            setIsOpen={setIsDistrictOpen}
                            onSelect={handleDistrictChange}
                            disabled={!formData.city}
                            placeholder="Select District"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <SearchableSelect
                            id="subDistrict"
                            label="Sub District"
                            value={formData.subDistrict}
                            options={subDistricts}
                            isLoading={isLoadingSubDistricts}
                            searchTerm={subDistrictSearchTerm}
                            setSearchTerm={setSubDistrictSearchTerm}
                            isOpen={isSubDistrictOpen}
                            setIsOpen={setIsSubDistrictOpen}
                            onSelect={handleSubDistrictChange}
                            disabled={!formData.district}
                            placeholder="Select Sub District"
                            required
                          />
                          <FormInput
                            id="postalCode"
                            label="Postal Code"
                            placeholder="12190"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Address Detail
                          </label>
                          <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                            }}
                            onKeyDown={(e) => {
                              e.stopPropagation();
                            }}
                            onKeyPress={(e) => {
                              e.stopPropagation();
                            }}
                            onKeyUp={(e) => {
                              e.stopPropagation();
                            }}
                            onInput={(e) => {
                              e.stopPropagation();
                            }}
                            onCompositionStart={(e) => {
                              e.stopPropagation();
                            }}
                            onCompositionUpdate={(e) => {
                              e.stopPropagation();
                            }}
                            onCompositionEnd={(e) => {
                              e.stopPropagation();
                            }}
                            onFocus={(e) => {
                              e.stopPropagation();
                            }}
                            onBlur={(e) => {
                              e.stopPropagation();
                            }}
                            rows={3}
                            placeholder="Additional address details (e.g., building name, floor, unit number)"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-base placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-colors resize-y"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isDefault"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                isDefault: e.target.checked,
                              }))
                            }
                            className="w-4 h-4 text-sky-600 dark:text-sky-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 dark:focus:ring-sky-400 focus:ring-2 cursor-pointer"
                          />
                          <label
                            htmlFor="isDefault"
                            className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                          >
                            Use as main Address
                          </label>
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
                  className="w-full lg:w-auto px-6 py-3 bg-sky-600 dark:bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors cursor-pointer"
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
            className="w-full px-6 py-3 bg-sky-600 dark:bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors cursor-pointer"
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

              <div className="w-full lg:w-1/2 relative bg-gray-100 dark:bg-gray-900 min-h-[400px] lg:min-h-[600px] lg:h-full">
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

                <MapPicker
                  key={
                    showPinpointModal
                      ? 'pinpoint-map-open'
                      : 'pinpoint-map-closed'
                  }
                  position={mapPosition}
                  setPosition={setMapPosition}
                  fullHeight={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
};

export default EditAddressPage;

