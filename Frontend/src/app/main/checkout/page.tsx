"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
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
} from "lucide-react";
import type { LatLngExpression } from "leaflet";

const MapPicker = dynamic(
  () => import("../../../shared/components/organisms/MapPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 w-full bg-gray-200 flex justify-center items-center rounded-lg">
        <p className="text-gray-500">Loading Map...</p>
      </div>
    ),
  }
);

const locationData = {
  countries: [{ value: "ID", label: "Indonesia" }],
  provinces: [
    { value: "ID-JK", label: "DKI Jakarta" },
    { value: "ID-JB", label: "West Java" },
    { value: "ID-JT", label: "Central Java" },
  ],
  cities: {
    "ID-JK": [
      { value: "jkt-selatan", label: "South Jakarta" },
      { value: "jkt-pusat", label: "Central Jakarta" },
    ],
    "ID-JB": [
      { value: "bandung", label: "Bandung" },
      { value: "bekasi", label: "Bekasi" },
    ],
    "ID-JT": [
      { value: "semarang", label: "Semarang" },
      { value: "surakarta", label: "Surakarta" },
    ],
  },
};

const checkoutItems = [
  {
    id: 1,
    name: "Air Jordan 1 High '85",
    price: 2240000,
    originalPrice: 2800000,
    imageUrl:
      "https://res.cloudinary.com/dqcyabvc2/image/upload/v1750143729/airdjordan1high85_fmbzyt.png",
    quantity: 1,
    size: "42",
  },
  {
    id: 3,
    name: "Jordan Air Rev",
    price: 2800000,
    imageUrl:
      "https://res.cloudinary.com/dqcyabvc2/image/upload/v1750143729/jordanairrev_pkb1qo.png",
    quantity: 1,
    size: "41",
  },
];

const shippingData = {
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
};

const voucherData = [
  {
    id: 1,
    code: "SAVE20",
    description: "20% discount for all items",
    type: "percentage",
    value: 0.2,
    maxDiscount: 50000,
    expiry: "Valid until 31 Jul 2025",
  },
  {
    id: 2,
    code: "SUPERDEAL",
    description: "Direct discount of Rp 75,000",
    type: "fixed",
    value: 75000,
    expiry: "Valid until 15 Aug 2025",
  },
  {
    id: 3,
    code: "FREESHIP",
    description: "Free Shipping up to Rp 20,000",
    type: "shipping",
    value: 20000,
    expiry: "Valid until 30 Sep 2025",
  },
];

const formatPrice = (price: number) =>
  `Rp${new Intl.NumberFormat("id-ID").format(price)}`;

const Checkout = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    country: "ID",
    province: "",
    city: "",
    zip: "",
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
  } | null>(null);
  const [orderNotes, setOrderNotes] = useState("");
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<
    (typeof voucherData)[0] | null
  >(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, province: e.target.value, city: "" }));
  };

  const handleCourierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourier(e.target.value);
    setSelectedService(null);
  };

  const handleServiceChange = (
    service: (typeof shippingData.sicepat.services)[0]
  ) => {
    setSelectedService(service);
  };

  const handleVoucherSelect = (voucher: (typeof voucherData)[0]) => {
    setSelectedVoucher(voucher);
    setIsVoucherModalOpen(false);
  };

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = selectedService?.price || 0;
  const tax = subtotal * 0.11;

  let voucherDiscount = 0;
  if (selectedVoucher) {
    switch (selectedVoucher.type) {
      case "percentage":
        voucherDiscount = Math.min(
          subtotal * selectedVoucher.value,
          selectedVoucher.maxDiscount || Infinity
        );
        break;
      case "fixed":
        voucherDiscount = selectedVoucher.value;
        break;
      case "shipping":
        voucherDiscount = Math.min(shippingCost, selectedVoucher.value);
        break;
      default:
        voucherDiscount = 0;
    }
  }

  const total = Math.max(0, subtotal + shippingCost + tax - voucherDiscount);
  const totalSavings = checkoutItems.reduce(
    (sum, item) =>
      item.originalPrice
        ? sum + (item.originalPrice - item.price) * item.quantity
        : sum,
    0
  );

  const FormInput = ({
    id,
    label,
    type = "text",
    placeholder,
    icon: Icon,
    value,
    onChange,
  }: {
    id: string;
    label: string;
    type?: string;
    placeholder: string;
    icon?: React.ElementType;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={`block w-full ${
            Icon ? "pl-10" : "pl-4"
          } pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 placeholder-gray-400`}
          placeholder={placeholder}
        />
      </div>
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
  }: {
    id: string;
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    placeholder?: string;
  }) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
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
    </div>
  );

  return (
    <>
      <div className="bg-white">
        <div className="container mx-auto px-6 md:px-20 xl:px-40 py-12 md:py-12">
          <h1 className="text-xl md:text-2xl font-bold text-black mb-6 md:mb-8">
            Shipping Details
          </h1>
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 border border-gray-200 rounded-lg p-6 md:p-8">
              <form className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-sky-600 flex items-center gap-3">
                    <User size={22} /> Contact Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormInput
                      id="firstName"
                      label="First Name"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                    <FormInput
                      id="lastName"
                      label="Last Name"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <FormInput
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    icon={Mail}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <FormInput
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    placeholder="+62 812-3456-7890"
                    icon={Phone}
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-sky-600 flex items-center gap-3">
                    <MapPin size={22} /> Shipping Address
                  </h2>
                  <FormInput
                    id="address"
                    label="Street Address"
                    placeholder="Sudirman St. No. 52-53"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormSelect
                      id="country"
                      label="Country"
                      options={locationData.countries}
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                    <FormSelect
                      id="province"
                      label="Province"
                      options={locationData.provinces}
                      value={formData.province}
                      onChange={handleProvinceChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormSelect
                      id="city"
                      label="City"
                      options={
                        locationData.cities[
                          formData.province as keyof typeof locationData.cities
                        ] || []
                      }
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!formData.province}
                    />
                    <FormInput
                      id="zip"
                      label="Postal Code"
                      placeholder="12190"
                      value={formData.zip}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Pinpoint Location
                    </label>
                    <MapPicker
                      position={mapPosition}
                      setPosition={setMapPosition}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-sky-600 flex items-center gap-3">
                    <Truck size={22} /> Shipping Method
                  </h2>
                  <FormSelect
                    id="courier"
                    label="Courier"
                    placeholder="Select Courier"
                    value={selectedCourier}
                    onChange={handleCourierChange}
                    options={Object.keys(shippingData).map((key) => ({
                      value: key,
                      label:
                        shippingData[key as keyof typeof shippingData].name,
                    }))}
                  />
                  {selectedCourier && (
                    <div className="pt-2">
                      <p className="block text-sm font-medium text-gray-700 mb-1.5">
                        Select Service
                      </p>
                      <div className="space-y-3">
                        {shippingData[
                          selectedCourier as keyof typeof shippingData
                        ].services.map((service) => (
                          <label
                            key={service.id}
                            htmlFor={service.id}
                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedService?.id === service.id
                                ? "border-sky-500 ring-2 ring-sky-500"
                                : "border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="shippingService"
                              id={service.id}
                              checked={selectedService?.id === service.id}
                              onChange={() => handleServiceChange(service)}
                              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300"
                            />
                            <div className="ml-4 flex-grow grid grid-cols-2 sm:grid-cols-3 items-center">
                              <div className="col-span-2 sm:col-span-1">
                                <span className="font-semibold text-sm text-black">
                                  {service.name}
                                </span>
                                <span className="block text-xs text-gray-500">
                                  {service.estimation}
                                </span>
                              </div>
                              <span className="text-sm font-semibold text-black sm:text-right">
                                {formatPrice(service.price)}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 lg:sticky lg:top-4 border border-gray-200">
                <h2 className="text-base md:text-lg font-semibold text-black mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                        <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-xs font-medium text-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold text-black text-sm">
                          {item.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Size: {item.size}
                        </p>
                      </div>
                      <p className="font-semibold text-black text-sm">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="my-6 border-t border-gray-200"></div>

                <div className="space-y-4 mb-4">
                  <div>
                    {selectedVoucher ? (
                      <div className="flex justify-between items-center bg-sky-50 text-sky-700 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Ticket size={18} />
                          <p className="font-semibold text-sm">
                            {selectedVoucher.code}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedVoucher(null)}
                          className="p-1 hover:bg-sky-100 rounded-full"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsVoucherModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 text-gray-500 hover:border-sky-500 hover:text-sky-600 transition-colors p-3 rounded-lg"
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
                      className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2"
                    >
                      <BookText size={16} /> Note for Seller (Optional)
                    </label>
                    <textarea
                      id="orderNotes"
                      name="orderNotes"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      rows={3}
                      placeholder="e.g., Please pack securely..."
                      className="block w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 placeholder-gray-400"
                    ></textarea>
                  </div>
                </div>

                <div className="my-6 border-t border-gray-200"></div>

                <div className="space-y-2 md:space-y-3 mb-4">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-black">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-black">
                      {formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">Tax (VAT 11%)</span>
                    <span className="font-medium text-black">
                      {formatPrice(tax)}
                    </span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-xs md:text-sm text-green-600">
                      <span className="font-medium">You Save</span>
                      <span className="font-medium">
                        -{formatPrice(totalSavings)}
                      </span>
                    </div>
                  )}
                  {voucherDiscount > 0 && (
                    <div className="flex justify-between text-xs md:text-sm text-green-600">
                      <span className="font-medium">Voucher Discount</span>
                      <span className="font-medium">
                        -{formatPrice(voucherDiscount)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-black">Total</span>
                    <span className="text-sky-600">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-5 block w-full bg-sky-500 text-white text-center py-3 px-4 rounded-md font-medium hover:bg-sky-600 transition-colors text-sm md:text-base cursor-pointer"
                >
                  Pay Now
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
            className="bg-white rounded-xl w-full max-w-lg shadow border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Select Voucher
              </h3>
              <button
                onClick={() => setIsVoucherModalOpen(false)}
                className="p-2 -m-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-3 sm:p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              {voucherData.map((voucher) => (
                <div
                  key={voucher.id}
                  onClick={() => handleVoucherSelect(voucher)}
                  className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ease-in-out border-2 ${
                    selectedVoucher?.id === voucher.id
                      ? "border-sky-500 shadow"
                      : "border-gray-200 shadow hover:border-sky-300"
                  }`}
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-sky-100/70">
                    <Ticket className="w-8 h-8 text-sky-600" />
                  </div>
                  <div className="ml-4 flex-grow">
                    <p className="font-bold text-sky-700 text-base">
                      {voucher.code}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {voucher.description}
                    </p>
                    <div className="flex items-center text-gray-400 text-xs mt-2">
                      <Clock size={14} className="mr-1.5" />
                      <span>{voucher.expiry}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
