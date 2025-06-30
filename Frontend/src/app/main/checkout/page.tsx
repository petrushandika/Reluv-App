"use client";

import React, { useState } from "react";
import { User, Mail, Phone, MapPin } from "lucide-react";

const locationData = {
  countries: [{ value: "ID", label: "Indonesia" }],
  provinces: [
    { value: "ID-JK", label: "DKI Jakarta" },
    { value: "ID-JB", label: "Jawa Barat" },
    { value: "ID-JT", label: "Jawa Tengah" },
    { value: "ID-JI", label: "Jawa Timur" },
    { value: "ID-BA", label: "Bali" },
    { value: "ID-SU", label: "Sumatera Utara" },
  ],
  cities: {
    "ID-JK": [
      { value: "jkt-pusat", label: "Jakarta Pusat" },
      { value: "jkt-barat", label: "Jakarta Barat" },
      { value: "jkt-selatan", label: "Jakarta Selatan" },
      { value: "jkt-timur", label: "Jakarta Timur" },
      { value: "jkt-utara", label: "Jakarta Utara" },
    ],
    "ID-JB": [
      { value: "bandung", label: "Bandung" },
      { value: "bekasi", label: "Bekasi" },
      { value: "bogor", label: "Bogor" },
      { value: "depok", label: "Depok" },
    ],
    "ID-JT": [
      { value: "semarang", label: "Semarang" },
      { value: "surakarta", label: "Surakarta" },
      { value: "magelang", label: "Magelang" },
    ],
    "ID-JI": [
      { value: "surabaya", label: "Surabaya" },
      { value: "malang", label: "Malang" },
      { value: "sidoarjo", label: "Sidoarjo" },
    ],
    "ID-BA": [
      { value: "denpasar", label: "Denpasar" },
      { value: "badung", label: "Badung" },
      { value: "ubud", label: "Ubud" },
    ],
    "ID-SU": [
      { value: "medan", label: "Medan" },
      { value: "binjai", label: "Binjai" },
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

const formatPrice = (price: number) => {
  return `Rp${new Intl.NumberFormat("id-ID").format(price)}`;
};

const Checkout = () => {
  const [selectedProvince, setSelectedProvince] = useState("");

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = 50000;
  const tax = subtotal * 0.11;
  const total = subtotal + shippingCost + tax;

  const totalSavings = checkoutItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  const FormInput = ({
    id,
    label,
    type = "text",
    placeholder,
    icon: Icon,
  }: {
    id: string;
    label: string;
    type?: string;
    placeholder: string;
    icon?: React.ElementType;
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
  }: {
    id: string;
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
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
          Select {label}
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
    <div className="bg-white">
      <div className="container mx-auto px-6 md:px-20 xl:px-40 p-8">
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
                  />
                  <FormInput
                    id="lastName"
                    label="Last Name"
                    placeholder="Doe"
                  />
                </div>
                <FormInput
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  icon={Mail}
                />
                <FormInput
                  id="phone"
                  label="Call Number"
                  type="tel"
                  placeholder="0812-3456-7890"
                  icon={Phone}
                />
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-sky-600 flex items-center gap-3">
                  <MapPin size={22} /> Shipping Address
                </h2>
                <FormInput
                  id="address"
                  label="Street Address"
                  placeholder="Jl. Jend. Sudirman No. 52-53"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormSelect
                    id="country"
                    label="Country"
                    options={locationData.countries}
                    value={"ID"}
                    onChange={() => {}}
                  />
                  <FormSelect
                    id="state"
                    label="State / Province"
                    options={locationData.provinces}
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormSelect
                    id="city"
                    label="City"
                    options={
                      locationData.cities[
                        selectedProvince as keyof typeof locationData.cities
                      ] || []
                    }
                    value={""}
                    onChange={() => {}}
                    disabled={!selectedProvince}
                  />
                  <FormInput id="zip" label="Postal Code" placeholder="12190" />
                </div>
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map integration placeholder</p>
                </div>
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
                      <p className="text-gray-500 text-xs">Size: {item.size}</p>
                    </div>
                    <p className="font-semibold text-black text-sm">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                ))}
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
                  <span className="text-gray-600">Tax (PPN 11%)</span>
                  <span className="font-medium text-black">
                    {formatPrice(tax)}
                  </span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-green-600">You Save</span>
                    <span className="font-medium text-green-600">
                      -{formatPrice(totalSavings)}
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
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
