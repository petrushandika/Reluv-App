"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Truck,
  Ticket,
  X,
  BookText,
  Clock,
  ChevronDown,
  Search,
  Edit,
} from "lucide-react";
import type { LatLngExpression } from "leaflet";
import { useCart } from "@/features/(main)/cart/hooks/useCart";
import { useBuyStore } from "@/features/(main)/checkout/store/buy.store";
import Spinner from "@/shared/components/common/Spinner";
import { getAddresses, createAddress } from "@/features/(main)/address/api/addressApi";
import { Address } from "@/features/(main)/address/types";
import {
  Province,
  Regency,
  District,
  SubDistrict,
  ShippingData,
} from "@/features/(main)/checkout/types";
import { toast } from "sonner";
import {
  checkShippingRates,
  createOrder,
  type ShippingRate,
  getVouchers,
  type Voucher,
} from "@/features/(main)/checkout/api/checkoutApi";
import { PrivateRoute } from "@/shared/components/guards/RouteGuards";

const checkoutFormSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(100, { message: "First name must be at most 100 characters" })
    .trim(),
  lastName: z
    .string()
    .max(100, { message: "Last name must be at most 100 characters" })
    .trim()
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please provide a valid email address" })
    .max(255, { message: "Email must be at most 255 characters" })
    .trim(),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^[0-9+\-\s()]+$/, { message: "Please provide a valid phone number" })
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(20, { message: "Phone number must be at most 20 characters" })
    .trim(),
  address: z
    .string()
    .min(1, { message: "Street address is required" })
    .max(255, { message: "Street address must be at most 255 characters" })
    .trim(),
  country: z.string().min(1, { message: "Country is required" }),
  province: z.string().min(1, { message: "Province is required" }),
  city: z.string().min(1, { message: "City is required" }),
  district: z.string().min(1, { message: "District is required" }),
  subDistrict: z.string().min(1, { message: "Sub-district is required" }),
  zip: z
    .string()
    .min(1, { message: "Postal code is required" })
    .regex(/^[0-9]+$/, { message: "Postal code must contain only numbers" })
    .min(5, { message: "Postal code must be at least 5 digits" })
    .max(10, { message: "Postal code must be at most 10 digits" })
    .trim(),
  detailAddress: z
    .string()
    .max(500, { message: "Detail address must be at most 500 characters" })
    .optional()
    .or(z.literal("")),
});

const orderNotesSchema = z
  .string()
  .max(1000, { message: "Order notes must be at most 1000 characters" })
  .optional()
  .or(z.literal(""));

const MapPicker = dynamic(
  () => import("@/shared/components/organisms/MapPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 w-full bg-gray-200 dark:bg-gray-700 flex justify-center items-center rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Loading Map...</p>
      </div>
    ),
  }
);

const shippingData: ShippingData = {
  sicepat: {
    name: "SiCepat",
    services: [
      {
        id: "sicepat-reg",
        name: "Regular",
        estimation: "2-3 Days",
        price: 15000,
      },
      { id: "sicepat-best", name: "BEST", estimation: "1 Day", price: 28000 },
    ],
  },
  jne: {
    name: "JNE",
    services: [
      { id: "jne-reg", name: "Regular", estimation: "2-3 Days", price: 18000 },
      {
        id: "jne-yes",
        name: "YES (Next Day)",
        estimation: "1 Day",
        price: 35000,
      },
    ],
  },
  gosend: {
    name: "GoSend",
    services: [
      {
        id: "gojek-sameday",
        name: "Same Day",
        estimation: "6-8 Hours",
        price: 25000,
      },
      {
        id: "gojek-instant",
        name: "Instant",
        estimation: "1-2 Hours",
        price: 40000,
      },
    ],
  },
  tiki: {
    name: "TIKI",
    services: [
      {
        id: "tiki-reg",
        name: "Regular",
        estimation: "2-4 Days",
        price: 20000,
      },
      {
        id: "tiki-ons",
        name: "ONS (Overnight Service)",
        estimation: "1 Day",
        price: 30000,
      },
    ],
  },
  jnt: {
    name: "J&T Express",
    services: [
      {
        id: "jnt-reg",
        name: "Regular",
        estimation: "2-3 Days",
        price: 16000,
      },
      {
        id: "jnt-eco",
        name: "ECO",
        estimation: "3-5 Days",
        price: 12000,
      },
    ],
  },
  pos: {
    name: "POS Indonesia",
    services: [
      {
        id: "pos-reg",
        name: "Paket Kilat Khusus",
        estimation: "2-3 Days",
        price: 14000,
      },
      {
        id: "pos-express",
        name: "Express Next Day",
        estimation: "1 Day",
        price: 32000,
      },
    ],
  },
};


const formatPrice = (price: number) =>
  `Rp${new Intl.NumberFormat("id-ID").format(price)}`;

const Checkout = () => {
  const router = useRouter();
  const { cart, isFetchingCart, subtotal } = useCart();
  const { item: buyItem } = useBuyStore();
  const [hasCheckedCart, setHasCheckedCart] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [isLoadingShippingRates, setIsLoadingShippingRates] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    country: "ID",
    province: "",
    city: "",
    district: "",
    subDistrict: "",
    zip: "",
    detailAddress: "",
  });

  const [mapPosition, setMapPosition] = useState<LatLngExpression>([
    -6.2088, 106.8456,
  ]);

  const [selectedCourier, setSelectedCourier] = useState("");
  const [selectedService, setSelectedService] = useState<{
    id: string;
    name: string;
    estimation: string;
    price: number;
    courierCode?: string;
    courierServiceCode?: string;
  } | null>(null);
  const [orderNotes, setOrderNotes] = useState("");
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [isSubDistrictOpen, setIsSubDistrictOpen] = useState(false);
  const [isCourierOpen, setIsCourierOpen] = useState(false);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingRegencies, setIsLoadingRegencies] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingSubDistricts, setIsLoadingSubDistricts] = useState(false);
  const [provinceSearchTerm, setProvinceSearchTerm] = useState("");
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [districtSearchTerm, setDistrictSearchTerm] = useState("");
  const [subDistrictSearchTerm, setSubDistrictSearchTerm] = useState("");

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [addressMode, setAddressMode] = useState<"select" | "new">("select");
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [orderNotesError, setOrderNotesError] = useState<string | null>(null);
  const [hasShownAddressToast, setHasShownAddressToast] = useState(false);

  useEffect(() => {
    if (validationError) {
      toast.error("Validation Error", {
        description: validationError,
      });
    }
  }, [validationError]);

  useEffect(() => {
    if (fieldErrors.province) {
      toast.error("Validation Error", {
        description: fieldErrors.province,
      });
    }
  }, [fieldErrors.province]);

  useEffect(() => {
    if (fieldErrors.city) {
      toast.error("Validation Error", {
        description: fieldErrors.city,
      });
    }
  }, [fieldErrors.city]);

  useEffect(() => {
    if (fieldErrors.district) {
      toast.error("Validation Error", {
        description: fieldErrors.district,
      });
    }
  }, [fieldErrors.district]);

  useEffect(() => {
    if (fieldErrors.subDistrict) {
      toast.error("Validation Error", {
        description: fieldErrors.subDistrict,
      });
    }
  }, [fieldErrors.subDistrict]);

  useEffect(() => {
    if (!isFetchingCart) {
      setHasCheckedCart(true);
    }
  }, [isFetchingCart]);

  useEffect(() => {
    if (hasCheckedCart && !isFetchingCart) {
      if (!buyItem && (!cart || (cart.items && cart.items.length === 0))) {
        const timer = setTimeout(() => {
          router.push("/cart");
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [cart, isFetchingCart, hasCheckedCart, router, buyItem]);

  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoadingAddresses(true);
      try {
        const data = await getAddresses();
        setAddresses(data);
        if (data.length > 0) {
          const defaultAddress = data.find((addr) => addr.isDefault) || data[0];
          setSelectedAddressId(defaultAddress.id);
          setAddressMode("select");
          await handleSelectAddress(defaultAddress);
        } else {
          setAddressMode("new");
        }
      } catch {
        setAddressMode("new");
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []); 

  useEffect(() => {
    const fetchVouchers = async () => {
      setIsLoadingVouchers(true);
      try {
        let storeId: number | null | undefined = undefined;
        
        if (buyItem) {
          storeId = buyItem.storeId;
        } else if (cart?.items && cart.items.length > 0) {
          storeId = cart.items[0].variant.product.storeId;
        }
        
        const data = await getVouchers(storeId);
        setVouchers(data);
      } catch {
        setVouchers([]);
      } finally {
        setIsLoadingVouchers(false);
      }
    };

    if (hasCheckedCart && !isFetchingCart) {
      fetchVouchers();
    }
  }, [buyItem, cart?.items, hasCheckedCart, isFetchingCart]);

  useEffect(() => {
    if (addressMode === "select" && addresses.length > 0 && !hasShownAddressToast && !isLoadingAddresses) {
      toast.info("Using Saved Address", {
        description: "Contact information is locked because you're using a saved address. To edit these details, please use the 'Edit' button on the address card or switch to 'Add New Address' mode.",
        duration: 5000,
      });
      setHasShownAddressToast(true);
    }
  }, [addressMode, addresses.length, hasShownAddressToast, isLoadingAddresses]);

  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const response = await fetch(
          "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
        );
        const data: Province[] = await response.json();
        setProvinces(data);
      } catch {
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
        } catch {
          setRegencies([]);
        } finally {
          setIsLoadingRegencies(false);
        }
      };
      fetchRegencies();
    } else {
      setRegencies([]);
      setFormData((prev) => ({ ...prev, city: "", district: "", subDistrict: "" }));
    }
  }, [formData.province]);

  useEffect(() => {
    if (formData.city && addressMode === "new") {
      const timer = setTimeout(() => {
        const items = buyItem
          ? [{ id: `buy-${buyItem.variantId}`, variant: { id: buyItem.variantId, product: { id: buyItem.productId, name: buyItem.productName, images: [buyItem.productImage] }, price: buyItem.variantPrice, compareAtPrice: null, size: buyItem.variantSize, color: buyItem.variantColor }, quantity: buyItem.quantity }]
          : cart?.items || [];
        if (items.length > 0) {
          loadShippingRates();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [formData.city, addressMode, buyItem, cart?.items]); 

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
        } catch {
          setDistricts([]);
        } finally {
          setIsLoadingDistricts(false);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setFormData((prev) => ({ ...prev, district: "", subDistrict: "" }));
    }
  }, [formData.city]);

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
        } catch {
          setSubDistricts([]);
        } finally {
          setIsLoadingSubDistricts(false);
        }
      };
      fetchSubDistricts();
    } else {
      setSubDistricts([]);
      setFormData((prev) => ({ ...prev, subDistrict: "" }));
    }
  }, [formData.district]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setValidationError(null);
  };

  const handleOrderNotesChange = (value: string) => {
    setOrderNotes(value);
    if (orderNotesError) {
      setOrderNotesError(null);
    }
  };

  const handleProvinceChange = (provinceId: string) => {
    setFormData((prev) => ({ ...prev, province: provinceId, city: "" }));
    setIsProvinceOpen(false);
    setProvinceSearchTerm("");
  };

  const handleCityChange = (regencyId: string) => {
    setFormData((prev) => ({ ...prev, city: regencyId, district: "", subDistrict: "" }));
    setIsCityOpen(false);
    setCitySearchTerm("");
  };

  const handleDistrictChange = (districtId: string) => {
    setFormData((prev) => ({ ...prev, district: districtId, subDistrict: "" }));
    setIsDistrictOpen(false);
    setDistrictSearchTerm("");
  };

  const handleSubDistrictChange = (subDistrictId: string) => {
    setFormData((prev) => ({ ...prev, subDistrict: subDistrictId }));
    setIsSubDistrictOpen(false);
    setSubDistrictSearchTerm("");
  };

  const handleCourierChange = (courierValue: string) => {
    setSelectedCourier(courierValue);
    setSelectedService(null);
  };

  const loadShippingRates = async () => {
    if (!selectedAddressId && addressMode === "new") {
      if (!formData.province || !formData.city) {
        return;
      }
    }

    if (!checkoutItems || checkoutItems.length === 0) {
      return;
    }

    setIsLoadingShippingRates(true);
    try {
      const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
      if (!selectedAddress && addressMode === "select") {
        setIsLoadingShippingRates(false);
        return;
      }

      const destinationCity = addressMode === "select"
        ? selectedAddress!.city
        : regencies.find((r) => r.id === formData.city)?.name || "";

      if (!destinationCity) {
        setIsLoadingShippingRates(false);
        return;
      }

      const items = checkoutItems.map((item) => {
        const product = item.variant.product;
        const variant = item.variant;
        
        const weight = "weight" in variant && typeof variant.weight === 'number' ? variant.weight : 500;
        const length = "length" in variant && typeof variant.length === 'number' ? variant.length : 20;
        const width = "width" in variant && typeof variant.width === 'number' ? variant.width : 15;
        const height = "height" in variant && typeof variant.height === 'number' ? variant.height : 10;
        const productDescription = "description" in product && typeof product.description === 'string' 
          ? product.description 
          : product.name;

        return {
          name: product.name,
          description: productDescription || product.name,
          value: Math.round(item.variant.price),
          length: Math.round(length),
          width: Math.round(width),
          height: Math.round(height),
          weight: Math.round(weight),
          quantity: item.quantity,
        };
      });

      const originAreaId = "ID-JK";
      
      let destinationAreaId: string;
      if (addressMode === "select" && selectedAddress?.biteship_area_id) {
        destinationAreaId = selectedAddress.biteship_area_id;
      } else {
        destinationAreaId = destinationCity;
      }

      const rates = await checkShippingRates({
        origin_area_id: originAreaId,
        destination_area_id: destinationAreaId,
        items,
      });

      if (rates && rates.length > 0) {
        setShippingRates(rates);
      } else {
        setShippingRates([]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to load shipping rates. You can still proceed with manual shipping selection.";
      
      if (errorMessage.includes("Could not find area ID") || errorMessage.includes("not found for destination")) {
        toast.info("Shipping Rates Unavailable", {
          description: "Could not find shipping rates for this location. You can still proceed with manual shipping selection.",
        });
      } else if (errorMessage.includes("temporarily unavailable") || errorMessage.includes("502") || errorMessage.includes("503")) {
        toast.warning("Shipping Service Unavailable", {
          description: "Shipping service is temporarily unavailable. You can still proceed with manual shipping selection.",
        });
      } else {
        toast.warning("Shipping Rates Unavailable", {
          description: errorMessage,
        });
      }
      setShippingRates([]);
    } finally {
      setIsLoadingShippingRates(false);
    }
  };

  const handleServiceChange = (
    service: (typeof shippingData.sicepat.services)[0] | ShippingRate
  ) => {
    if ("courier" in service) {
      setSelectedService({
        id: `${service.courier.code}-${service.courier_service_code}`,
        name: service.courier_service_name,
        estimation: service.duration || "2-3 Days",
        price: service.price,
        courierCode: service.courier.code,
        courierServiceCode: service.courier_service_code,
      });
    } else {
      setSelectedService(service);
    }
  };

  const handleVoucherSelect = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsVoucherModalOpen(false);
  };

  const handleSelectAddress = async (address: Address) => {
    setSelectedAddressId(address.id);
    setAddressMode("select");

    const addressLines = address.address.split("\n");
    const streetAddress = addressLines[0] || "";
    const detailAddress = addressLines.slice(1).join("\n") || "";

    const provinceMatch = provinces.find((p) => p.name === address.province);
    let cityId = "";
    let districtId = "";
    let subDistrictId = "";

    if (provinceMatch) {
      try {
        const regenciesResponse = await fetch(
          `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceMatch.id}.json`
        );
        const regenciesData: Regency[] = await regenciesResponse.json();
        setRegencies(regenciesData);

        const cityMatch = regenciesData.find((r) => r.name === address.city);
        if (cityMatch) {
          cityId = cityMatch.id;

          const districtsResponse = await fetch(
            `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${cityId}.json`
          );
          const districtsData: District[] = await districtsResponse.json();
          setDistricts(districtsData);

          const districtMatch = districtsData.find((d) => d.name === address.district);
          if (districtMatch) {
            districtId = districtMatch.id;

            const subDistrictsResponse = await fetch(
              `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtId}.json`
            );
            const subDistrictsData: SubDistrict[] = await subDistrictsResponse.json();
            setSubDistricts(subDistrictsData);

            const subDistrictMatch = subDistrictsData.find((s) => s.name === address.subDistrict);
            if (subDistrictMatch) {
              subDistrictId = subDistrictMatch.id;
            }
          }
        }
      } catch {
      }
    }

    setFormData({
      firstName: address.recipient.split(" ")[0] || "",
      lastName: address.recipient.split(" ").slice(1).join(" ") || "",
      email: formData.email,
      phone: address.phone,
      address: streetAddress,
      country: "ID",
      province: provinceMatch?.id || "",
      city: cityId,
      district: districtId,
      subDistrict: subDistrictId,
      zip: address.postalCode,
      detailAddress: detailAddress,
    });

    if (address.latitude && address.longitude) {
      setMapPosition([address.latitude, address.longitude]);
    }

    loadShippingRates();
  };

  const handleAddressModeChange = (mode: "select" | "new") => {
    setAddressMode(mode);
    if (mode === "new") {
      setSelectedAddressId(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: formData.email,
        phone: "",
        address: "",
        country: "ID",
        province: "",
        city: "",
        district: "",
        subDistrict: "",
        zip: "",
        detailAddress: "",
      });
    } else if (addresses.length > 0) {
      const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0];
      handleSelectAddress(defaultAddress);
    }
  };

  const validateCheckout = (): boolean => {
    setValidationError(null);
    setFieldErrors({});
    setOrderNotesError(null);

    if (orderNotes) {
      const notesValidation = orderNotesSchema.safeParse(orderNotes);
      if (!notesValidation.success) {
        setOrderNotesError(notesValidation.error.errors[0]?.message || "Invalid order notes");
        toast.error("Invalid Order Notes", {
          description: notesValidation.error.errors[0]?.message || "Order notes must be at most 1000 characters",
        });
        return false;
      }
    }

    if (!selectedService) {
      toast.error("Shipping Required", {
        description: "Please select a shipping method.",
      });
      return false;
    }

    if (addressMode === "select") {
      if (!selectedAddressId) {
        toast.error("Address Required", {
          description: "Please select an address.",
        });
        return false;
      }
    } else {
      const formValidation = checkoutFormSchema.safeParse(formData);
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
        return false;
      }
    }

    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCheckout()) {
      return;
    }

    if (addressMode === "new") {

      try {
        const selectedProvince = provinces.find((p) => p.id === formData.province);
        const selectedCity = regencies.find((r) => r.id === formData.city);
        const selectedDistrict = districts.find((d) => d.id === formData.district);
        const selectedSubDistrict = subDistricts.find((s) => s.id === formData.subDistrict);

        if (!selectedProvince || !selectedCity) {
          toast.error("Invalid Selection", {
            description: "Please select both province and city.",
          });
          return;
        }

        let fullAddress = formData.address.trim();
        if (formData.detailAddress.trim()) {
          fullAddress += `\n${formData.detailAddress.trim()}`;
        }

        const addressData = {
          label: "Home",
          recipient: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone.trim(),
          province: selectedProvince.name,
          city: selectedCity.name,
          district: selectedDistrict?.name || formData.district.trim(),
          subDistrict: selectedSubDistrict?.name || formData.subDistrict.trim(),
          postalCode: formData.zip.trim(),
          address: fullAddress,
          isDefault: addresses.length === 0,
          latitude: Array.isArray(mapPosition) ? mapPosition[0] : undefined,
          longitude: Array.isArray(mapPosition) ? mapPosition[1] : undefined,
        };

        const newAddress = await createAddress(addressData);
        toast.success("Address Saved", {
          description: "Your address has been saved successfully.",
        });

        const updatedAddresses = await getAddresses();
        setAddresses(updatedAddresses);
        setSelectedAddressId(newAddress.id);
        setAddressMode("select");

        await processOrder(newAddress.id);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save address";
        toast.error("Failed to Save Address", {
          description: errorMessage,
        });
        return;
      }
    } else {
      if (!selectedAddressId) {
        toast.error("Address Required", {
          description: "Please select or create an address.",
        });
        return;
      }
      await processOrder(selectedAddressId);
    }
  };

  const processOrder = async (locationId: number) => {
    setIsSubmitting(true);
    try {
      const orderData = {
        locationId,
        shippingCost: selectedService!.price,
        notes: orderNotes || undefined,
        voucherCode: selectedVoucher?.code || undefined,
        ...(buyItem ? {
          items: [{
            variantId: buyItem.variantId,
            quantity: buyItem.quantity,
          }],
        } : {}),
      };

      const response = await createOrder(orderData);

      if (response.payment?.redirect_url) {
        toast.success("Order Created", {
          description: "Redirecting to payment...",
        });
        setTimeout(() => {
          window.location.href = response.payment.redirect_url!;
        }, 500);
      } else if (response.payment?.token) {
        toast.success("Order Created", {
          description: "Redirecting to payment...",
        });
        setTimeout(() => {
          router.push(`/payment?token=${response.payment.token}`);
        }, 500);
      } else {
        toast.warning("Order Created", {
          description: "Payment redirect not available. Please check your order.",
        });
        setTimeout(() => {
          router.push(`/orders/${response.order.id}`);
        }, 500);
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            status?: number;
            data?: { message?: string; error?: string };
            statusText?: string;
          };
          message?: string;
        };
        const errorMessage = axiosError.response?.data?.message 
          || axiosError.response?.data?.error 
          || axiosError.message 
          || "Failed to create order. Please try again.";
        toast.error("Order Failed", {
          description: errorMessage,
        });
      } else {
        const errorMessage = error instanceof Error
          ? error.message
          : "Failed to create order. Please try again.";
        toast.error("Order Failed", {
          description: errorMessage,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkoutItems = buyItem
    ? [
        {
          id: `buy-${buyItem.variantId}`,
          variant: {
            id: buyItem.variantId,
            product: {
              id: buyItem.productId,
              name: buyItem.productName,
              images: [buyItem.productImage],
            },
            price: buyItem.variantPrice,
            compareAtPrice: null,
            size: buyItem.variantSize,
            color: buyItem.variantColor,
          },
          quantity: buyItem.quantity,
        },
      ]
    : cart?.items || [];

  const checkoutSubtotal = buyItem
    ? buyItem.variantPrice * buyItem.quantity
    : subtotal;

  if (isFetchingCart && !buyItem) {
    return <Spinner />;
  }

  if (!buyItem && (!cart || cart.items.length === 0)) {
    return null;
  }

  const shippingCost = selectedService?.price || 0;
  const TAX_RATE = 0.11;
  const tax = checkoutSubtotal * TAX_RATE;

  let voucherDiscount = 0;
  if (selectedVoucher) {
    switch (selectedVoucher.type) {
      case "PERCENTAGE":
        const percentageDiscount = Math.floor((checkoutSubtotal * selectedVoucher.value) / 100);
        voucherDiscount = selectedVoucher.maxDiscount
          ? Math.min(percentageDiscount, selectedVoucher.maxDiscount)
          : percentageDiscount;
        break;
      case "FIXED_AMOUNT":
        voucherDiscount = Math.min(selectedVoucher.value, checkoutSubtotal);
        break;
      case "FREE_SHIPPING":
        voucherDiscount = Math.min(shippingCost, selectedVoucher.value || shippingCost);
        break;
      default:
        voucherDiscount = 0;
    }
  }

  const formatVoucherExpiry = (expiryDate: string): string => {
    const date = new Date(expiryDate);
    return `Valid until ${date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  };

  const totalSavings = checkoutItems.reduce((sum, item) => {
    if (item.variant.compareAtPrice) {
      return (
        sum + (item.variant.compareAtPrice - item.variant.price) * item.quantity
      );
    }
    return sum;
  }, 0);

  const total = Math.max(
    0,
    checkoutSubtotal + shippingCost + tax - voucherDiscount
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
      if (!isOpen) return;
      
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!selectRef.current) return;
        
        if (selectRef.current.contains(target)) {
          return;
        }
        
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
        if (isInput) {
          return;
        }
        
        setIsOpen(false);
      };
      
      document.addEventListener("click", handleClickOutside);
      
      return () => {
        document.removeEventListener("click", handleClickOutside);
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
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="w-full flex justify-between items-center text-left px-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed cursor-pointer"
          >
            <span
              className={
                selectedOption ? "" : "text-gray-400 dark:text-gray-500"
              }
            >
              {selectedOption
                ? selectedOption.name
                : placeholder || `Select ${label}`}
            </span>
          </button>
          <ChevronDown
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
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
                  autoFocus
                />
              </div>
            </div>
            <ul className="max-h-60 overflow-y-auto scrollbar-hide">
              {isLoading ? (
                <li className="px-4 py-3 text-center">
                  <Spinner size="sm" fullScreen={false} className="mx-auto" />
                </li>
              ) : filteredOptions.length === 0 ? (
                <li className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm text-center">
                  No results found
                </li>
              ) : (
                filteredOptions.map((option) => (
                  <li
                    key={option.id}
                    className="px-4 py-2 hover:bg-sky-100 dark:hover:bg-sky-900/30 cursor-pointer text-gray-900 dark:text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(option.id);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {option.name}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const CustomSelect = ({
    id,
    label,
    options,
    value,
    onSelect,
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
    onSelect: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    required?: boolean;
  }) => {
    const selectRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!isOpen) return;
      
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!selectRef.current) return;
        
        if (selectRef.current.contains(target)) {
          return;
        }
        
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
        if (isInput) {
          return;
        }
        
        setIsOpen(false);
      };
      
      document.addEventListener("click", handleClickOutside);
      
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [isOpen, setIsOpen]);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
      <div ref={selectRef} className="relative w-full">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="w-full flex justify-between items-center text-left px-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed cursor-pointer"
          >
            <span
              className={
                selectedOption ? "" : "text-gray-400 dark:text-gray-500"
              }
            >
              {selectedOption
                ? selectedOption.label
                : placeholder || `Select ${label}`}
            </span>
          </button>
          <ChevronDown
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        {isOpen && (
          <div className="relative w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
            <ul className="max-h-60 overflow-y-auto scrollbar-hide">
              {options.length === 0 ? (
                <li className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm text-center">
                  No options available
                </li>
              ) : (
                options.map((option) => (
                  <li
                    key={option.value}
                    className="px-4 py-2 hover:bg-sky-100 dark:hover:bg-sky-900/30 cursor-pointer text-gray-900 dark:text-white transition-colors"
                    onClick={() => {
                      onSelect(option.value);
                      setIsOpen(false);
                    }}
                  >
                    {option.label}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };

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
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onMouseDown={() => setIsOpen(!isOpen)}
          className="block w-full pl-4 pr-12 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder:text-base placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 disabled:bg-gray-50/80 dark:disabled:bg-gray-700/80 disabled:cursor-not-allowed appearance-none cursor-pointer"
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
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
    </div>
  );

  const isLoading = isFetchingCart || !hasCheckedCart;

  return (
    <PrivateRoute>
      {isLoading && (
        <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-50 flex items-center justify-center">
          <Spinner size="lg" fullScreen={false} />
        </div>
      )}
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8">
            Shipping Details
          </h1>
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="lg:col-span-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-800 shadow-sm">
              <form className="space-y-6 sm:space-y-8" onSubmit={handleFormSubmit}>

                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-2 sm:gap-3">
                    <User className="w-5 h-5 sm:w-6 sm:h-6" /> Contact
                    Information
                  </h2>
                  

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                      >
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                      id="firstName"
                        name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                        disabled={addressMode === "select"}
                        onClick={
                          addressMode === "select"
                            ? (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toast.info("Cannot Edit", {
                                  description: "This field cannot be edited because you're using a saved address. Please use the Edit button on the address card to modify your saved address, or switch to Add New Address mode.",
                                  duration: 5000,
                                });
                              }
                            : undefined
                        }
                        onFocus={
                          addressMode === "select"
                            ? (e) => {
                                e.preventDefault();
                                toast.info("Cannot Edit", {
                                  description: "This field cannot be edited because you're using a saved address. Please use the Edit button on the address card to modify your saved address, or switch to Add New Address mode.",
                                  duration: 5000,
                                });
                              }
                            : undefined
                        }
                        placeholder="John"
                        className={`block w-full pl-4 pr-3 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-base placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60 ${
                          fieldErrors.firstName
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                      {fieldErrors.firstName && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {fieldErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                      id="lastName"
                        name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                        disabled={addressMode === "select"}
                        onClick={
                          addressMode === "select"
                            ? (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toast.info("Cannot Edit", {
                                  description: "This field cannot be edited because you're using a saved address. Please use the Edit button on the address card to modify your saved address, or switch to Add New Address mode.",
                                  duration: 5000,
                                });
                              }
                            : undefined
                        }
                        onFocus={
                          addressMode === "select"
                            ? (e) => {
                                e.preventDefault();
                                toast.info("Cannot Edit", {
                                  description: "This field cannot be edited because you're using a saved address. Please use the Edit button on the address card to modify your saved address, or switch to Add New Address mode.",
                                  duration: 5000,
                                });
                              }
                            : undefined
                        }
                        placeholder="Doe"
                        className={`block w-full pl-4 pr-3 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-base placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60 ${
                          fieldErrors.lastName
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                    />
                    {fieldErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {fieldErrors.lastName}
                      </p>
                    )}
                  </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <Mail
                          className="h-5 w-5 text-gray-400 dark:text-gray-500"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                    type="email"
                        id="email"
                        name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                        placeholder="you@example.com"
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-base placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 ${
                          fieldErrors.email
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <Phone
                          className="h-5 w-5 text-gray-400 dark:text-gray-500"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                    type="tel"
                        id="phone"
                        name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                        disabled={addressMode === "select"}
                        onClick={
                          addressMode === "select"
                            ? (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toast.info("Cannot Edit", {
                                  description: "This field cannot be edited because you're using a saved address. Please use the 'Edit' button on the address card to modify your saved address, or switch to 'Add New Address' mode.",
                                  duration: 5000,
                                });
                              }
                            : undefined
                        }
                        onFocus={
                          addressMode === "select"
                            ? (e) => {
                                e.preventDefault();
                                toast.info("Cannot Edit", {
                                  description: "This field cannot be edited because you're using a saved address. Please use the 'Edit' button on the address card to modify your saved address, or switch to 'Add New Address' mode.",
                                  duration: 5000,
                                });
                              }
                            : undefined
                        }
                        placeholder="+62 812-3456-7890"
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-base placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60 ${
                          fieldErrors.phone
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-2 sm:gap-3">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6" /> Shipping
                    Address
                  </h2>

                  {addresses.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="addressMode"
                            checked={addressMode === "select"}
                            onChange={() => handleAddressModeChange("select")}
                            className="h-4 w-4 accent-sky-600 dark:accent-sky-400 text-sky-600 dark:text-sky-400 focus:ring-sky-500 dark:focus:ring-sky-400 border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Use Saved Address
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="addressMode"
                            checked={addressMode === "new"}
                            onChange={() => handleAddressModeChange("new")}
                            className="h-4 w-4 accent-sky-600 dark:accent-sky-400 text-sky-600 dark:text-sky-400 focus:ring-sky-500 dark:focus:ring-sky-400 border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Add New Address
                          </span>
                        </label>
                      </div>

                      {addressMode === "select" && (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {isLoadingAddresses ? (
                            <div className="flex items-center justify-center py-4">
                              <Spinner />
                            </div>
                          ) : (
                            addresses.map((address) => (
                              <div
                                key={address.id}
                                className={`flex items-start p-3 sm:p-4 border rounded-lg cursor-pointer transition-all bg-white dark:bg-gray-800 ${
                                  selectedAddressId === address.id
                                    ? "border-sky-500 dark:border-sky-400"
                                    : "border-gray-300 dark:border-gray-600 hover:border-sky-300 dark:hover:border-sky-500"
                                }`}
                              >
                                <label className="flex items-start flex-grow cursor-pointer">
                                  <input
                                    type="radio"
                                    name="selectedAddress"
                                    checked={selectedAddressId === address.id}
                                    onChange={() => handleSelectAddress(address)}
                                    className="mt-1 h-4 w-4 accent-sky-600 dark:accent-sky-400 text-sky-600 dark:text-sky-400 focus:ring-sky-500 dark:focus:ring-sky-400 border-gray-300 dark:border-gray-600 cursor-pointer"
                                  />
                                  <div className="ml-3 flex-grow">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                        {address.label}
                                      </span>
                                      {address.isDefault && (
                                        <span className="px-2 py-0.5 bg-sky-600 dark:bg-sky-500 text-white text-xs font-semibold rounded">
                                          Main
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                      {address.recipient}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                      {address.phone}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {address.address}
                                      {address.address && (address.city || address.province) && ", "}
                                      {address.city && address.province
                                        ? `${address.city}, ${address.province}`
                                        : address.city || address.province}
                                      {address.postalCode && `, ${address.postalCode}`}
                                    </p>
                                  </div>
                                </label>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/profile/address/edit?id=${address.id}`);
                                  }}
                                  className="ml-2 sm:ml-3 flex items-center gap-1 sm:gap-2 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                                  title="Edit Address"
                                >
                                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                                    Edit
                                  </span>
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {addressMode === "new" && (
                    <>
                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                        >
                          Street Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                    id="address"
                          name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                          placeholder="Sudirman St. No. 52-53"
                          className={`block w-full pl-4 pr-3 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-base placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 ${
                            fieldErrors.address
                              ? "border-red-500 dark:border-red-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                  />
                      {fieldErrors.address && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {fieldErrors.address}
                        </p>
                      )}
                      </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormSelect
                      id="country"
                      label="Country"
                      options={[{ value: "ID", label: "Indonesia" }]}
                      value={formData.country}
                      onChange={handleInputChange}
                      isOpen={isCountryOpen}
                      setIsOpen={setIsCountryOpen}
                      required={true}
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
                      required={true}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                      required={true}
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
                      required={true}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                      required={true}
                    />
                    <div>
                      <label
                        htmlFor="zip"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                      >
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                      id="zip"
                        name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                        placeholder="12190"
                        className={`block w-full pl-4 pr-3 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-base placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 ${
                          fieldErrors.zip
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                      {fieldErrors.zip && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {fieldErrors.zip}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Detail Address
                    </label>
                    <textarea
                      id="detailAddress"
                      name="detailAddress"
                      value={formData.detailAddress}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Additional address details (e.g., building name, floor, unit number)"
                      className={`block w-full text-sm p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-base placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 resize-y ${
                        fieldErrors.detailAddress
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {fieldErrors.detailAddress && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {fieldErrors.detailAddress}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Pinpoint Location
                    </label>
                    <MapPicker
                      position={mapPosition}
                      setPosition={setMapPosition}
                    />
                  </div>
                    </>
                  )}
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-2 sm:gap-3">
                    <Truck className="w-5 h-5 sm:w-6 sm:h-6" /> Shipping Method
                  </h2>
                  <CustomSelect
                    id="courier"
                    label="Courier"
                    placeholder="Select Courier"
                    value={selectedCourier}
                    onSelect={handleCourierChange}
                    options={(() => {
                      const courierSet = new Set<string>();
                      shippingRates.forEach((rate) => {
                        if (rate.courier?.code) {
                          courierSet.add(rate.courier.code.toLowerCase());
                        }
                      });
                      const courierOptions = Array.from(courierSet).map((code) => {
                        const rate = shippingRates.find(
                          (r) => r.courier?.code?.toLowerCase() === code
                        );
                        return {
                          value: code,
                          label: rate?.courier?.name || code.toUpperCase(),
                        };
                      });
                      if (courierOptions.length === 0) {
                        return Object.keys(shippingData).map((key) => ({
                          value: key,
                          label:
                            shippingData[key as keyof typeof shippingData].name,
                        }));
                      }
                      return courierOptions;
                    })()}
                    isOpen={isCourierOpen}
                    setIsOpen={setIsCourierOpen}
                  />
                  {selectedCourier && (
                    <div className="pt-2">
                      <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Select Service
                      </p>
                      {isLoadingShippingRates ? (
                        <div className="flex items-center justify-center p-8">
                          <Spinner />
                        </div>
                      ) : shippingRates.length > 0 ? (
                        <div className="space-y-3">
                          {shippingRates
                            .filter(
                              (rate) =>
                                rate.courier?.code?.toLowerCase() ===
                                selectedCourier.toLowerCase()
                            )
                            .map((rate) => {
                              if (!rate.courier || !rate.courier.code) {
                                return null;
                              }
                              return (
                                <label
                                  key={`${rate.courier.code}-${rate.courier_service_code}`}
                                  htmlFor={`${rate.courier.code}-${rate.courier_service_code}`}
                                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all bg-white dark:bg-gray-800 ${
                                    selectedService?.id ===
                                    `${rate.courier.code}-${rate.courier_service_code}`
                                      ? "border-sky-500 dark:border-sky-400 ring-2 ring-sky-500 dark:ring-sky-400"
                                      : "border-gray-300 dark:border-gray-600"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="shippingService"
                                    id={`${rate.courier.code}-${rate.courier_service_code}`}
                                    checked={
                                      selectedService?.id ===
                                      `${rate.courier.code}-${rate.courier_service_code}`
                                    }
                                    onChange={() => handleServiceChange(rate)}
                                    className="h-4 w-4 accent-sky-600 dark:accent-sky-400 text-sky-600 dark:text-sky-400 focus:ring-sky-500 dark:focus:ring-sky-400 border-gray-300 dark:border-gray-600 cursor-pointer"
                                  />
                                  <div className="ml-4 flex-grow grid grid-cols-2 sm:grid-cols-3 items-center">
                                    <div className="col-span-2 sm:col-span-1">
                                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                        {rate.courier_service_name}
                                      </span>
                                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                                        {rate.duration || rate.description || "2-3 Days"}
                                      </span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white sm:text-right">
                                      {formatPrice(rate.price)}
                                    </span>
                                  </div>
                                </label>
                              );
                            })
                            .filter(Boolean)}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <p className="text-sm mb-2">
                              Shipping rates are currently unavailable.
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              You can still proceed with checkout. Shipping cost will be calculated manually.
                            </p>
                          </div>
                          {shippingData[selectedCourier as keyof typeof shippingData] && (
                            <div className="space-y-3">
                              {shippingData[selectedCourier as keyof typeof shippingData].services.map((service) => (
                                <label
                                  key={service.id}
                                  htmlFor={service.id}
                                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all bg-white dark:bg-gray-800 ${
                                    selectedService?.id === service.id
                                      ? "border-sky-500 dark:border-sky-400 ring-2 ring-sky-500 dark:ring-sky-400"
                                      : "border-gray-300 dark:border-gray-600"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="shippingService"
                                    id={service.id}
                                    checked={selectedService?.id === service.id}
                                    onChange={() => handleServiceChange(service)}
                                    className="h-4 w-4 accent-sky-600 dark:accent-sky-400 text-sky-600 dark:text-sky-400 focus:ring-sky-500 dark:focus:ring-sky-400 border-gray-300 dark:border-gray-600 cursor-pointer"
                                  />
                                  <div className="ml-4 flex-grow grid grid-cols-2 sm:grid-cols-3 items-center">
                                    <div className="col-span-2 sm:col-span-1">
                                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                        {service.name}
                                      </span>
                                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                                        {service.estimation}
                                      </span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white sm:text-right">
                                      {formatPrice(service.price)}
                                    </span>
                                  </div>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-5 md:p-6 lg:sticky lg:top-4 border border-gray-200 dark:border-gray-700">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  Order Summary
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {checkoutItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 sm:gap-4"
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <img
                            src={item.variant.product.images[0] || ""}
                            alt={item.variant.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-sky-600 text-[10px] sm:text-xs font-medium text-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate">
                          {item.variant.product.name}
                        </p>
                        <div className="flex flex-wrap gap-x-1.5 sm:gap-x-2 text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs">
                          {item.variant.size && (
                            <span>Size: {item.variant.size}</span>
                          )}
                          {item.variant.color && (
                            <span>Color: {item.variant.color}</span>
                          )}
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm shrink-0">
                        {formatPrice(item.variant.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

                <div className="space-y-4 mb-4">
                  <div>
                    {selectedVoucher ? (
                      <div className="flex justify-between items-center bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Ticket size={18} />
                          <p className="font-semibold text-sm">
                            {selectedVoucher.code}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedVoucher(null)}
                          className="p-1 hover:bg-sky-100 dark:hover:bg-sky-800 rounded-full cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsVoucherModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-sky-500 dark:hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors p-3 rounded-lg cursor-pointer"
                      >
                        <Ticket size={18} />
                        <span className="text-sm font-semibold">
                          Select or Enter Voucher
                        </span>
                      </button>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="orderNotes"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2"
                    >
                      <BookText size={16} /> Note for Seller (Optional)
                    </label>
                    <textarea
                      id="orderNotes"
                      name="orderNotes"
                      value={orderNotes}
                      onChange={(e) => handleOrderNotesChange(e.target.value)}
                      rows={3}
                      placeholder="e.g., Please pack securely..."
                      className={`block w-full text-sm p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-base placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 ${
                        orderNotesError
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    ></textarea>
                    {orderNotesError && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {orderNotesError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

                <div className="space-y-2 sm:space-y-2.5 md:space-y-3 mb-3 sm:mb-4">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(checkoutSubtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Shipping
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tax (VAT 11%)
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(tax)}
                    </span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm text-green-600 dark:text-green-400">
                      <span className="font-medium">You Save</span>
                      <span className="font-medium">
                        -{formatPrice(totalSavings)}
                      </span>
                    </div>
                  )}
                  {voucherDiscount > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm text-green-600 dark:text-green-400">
                      <span className="font-medium">Voucher Discount</span>
                      <span className="font-medium">
                        -{formatPrice(voucherDiscount)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
                  <div className="flex justify-between text-base sm:text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-sky-600 dark:text-sky-400">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const fakeEvent = {
                      preventDefault: () => {},
                    } as React.FormEvent<HTMLFormElement>;
                    handleFormSubmit(fakeEvent);
                  }}
                  disabled={(() => {
                    if (isSubmitting) return true;
                    if (!selectedService) return true;
                    if (addressMode === "select" && !selectedAddressId) return true;
                    if (orderNotes) {
                      const notesValidation = orderNotesSchema.safeParse(orderNotes);
                      if (!notesValidation.success) return true;
                    }
                    if (addressMode === "new") {
                      const formValidation = checkoutFormSchema.safeParse(formData);
                      if (!formValidation.success) return true;
                    }
                    return false;
                  })()}
                  className="mt-4 sm:mt-5 block w-full bg-sky-500 dark:bg-sky-600 text-white text-center py-3 px-4 rounded-md font-medium hover:bg-sky-600 dark:hover:bg-sky-700 transition-colors text-sm sm:text-base cursor-pointer touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isVoucherModalOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsVoucherModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg shadow border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Select Voucher
              </h3>
              <button
                onClick={() => setIsVoucherModalOpen(false)}
                className="p-2 -m-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div 
              className="p-3 sm:p-5 space-y-3 max-h-[60vh] overflow-y-auto voucher-scrollbar"
            >
              <style jsx>{`
                .voucher-scrollbar {
                  scrollbar-width: thin;
                  scrollbar-color: #0ea5e9 transparent;
                }
                .voucher-scrollbar::-webkit-scrollbar {
                  width: 3px;
                }
                .voucher-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                .voucher-scrollbar::-webkit-scrollbar-thumb {
                  background-color: #0ea5e9;
                  border-radius: 10px;
                }
                .voucher-scrollbar::-webkit-scrollbar-thumb:hover {
                  background-color: #0284c7;
                }
              `}</style>
              {isLoadingVouchers ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner size="md" />
                </div>
              ) : vouchers.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Ticket className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No vouchers available</p>
                </div>
              ) : (
                vouchers.map((voucher) => (
                  <div
                    key={voucher.id}
                    onClick={() => handleVoucherSelect(voucher)}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ease-in-out border-2 bg-white dark:bg-gray-800 ${
                      selectedVoucher?.id === voucher.id
                        ? "border-sky-500 dark:border-sky-400 shadow"
                        : "border-gray-200 dark:border-gray-700 shadow hover:border-sky-300 dark:hover:border-sky-500"
                    }`}
                  >
                    <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-sky-100/70 dark:bg-sky-900/30">
                      <Ticket className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div className="ml-4 flex-grow">
                      <p className="font-bold text-sky-700 dark:text-sky-400 text-base">
                        {voucher.code}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        {voucher.description || voucher.name}
                      </p>
                      {voucher.minPurchase && (
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                          Min. purchase: {formatPrice(voucher.minPurchase)}
                        </p>
                      )}
                      <div className="flex items-center text-gray-400 dark:text-gray-500 text-xs mt-2">
                        <Clock size={14} className="mr-1.5" />
                        <span>{formatVoucherExpiry(voucher.expiry)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </PrivateRoute>
  );
};

export default Checkout;
