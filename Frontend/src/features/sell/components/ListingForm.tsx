"use client";

import React from "react";
import { ListingData, Condition } from "../types";
import CategorySelector from "@/shared/components/molecules/CategorySelector";
import CustomSelect from "@/shared/components/molecules/CustomSelect";

const conditionOptions: Record<Condition, string> = {
  NEW: "New",
  LIKE_NEW: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
};

const sizeOptions = [
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
  { value: "OTHER", label: "Another Size..." },
];

const colorOptions = [
  { value: "Red", label: "Red" },
  { value: "Blue", label: "Blue" },
  { value: "Black", label: "Black" },
  { value: "White", label: "White" },
  { value: "Green", label: "Green" },
  { value: "Yellow", label: "Yellow" },
  { value: "OTHER", label: "Another Color..." },
];

interface ListingFormProps {
  listingData: ListingData;
  setListingData: React.Dispatch<React.SetStateAction<ListingData>>;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: () => void;
  isLoading: boolean;
}

const ListingForm = ({
  listingData,
  setListingData,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ListingFormProps) => {
  const formatPrice = (value: string): string => {
    const numericValue = value.replace(/\./g, "");
    if (!numericValue) return "";
    const number = parseInt(numericValue, 10);
    if (isNaN(number)) return "";
    return number.toLocaleString("id-ID");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatPrice(value);
    setListingData((prev) => ({ ...prev, price: formattedValue }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const isFormValid = () => {
    const numericPrice = listingData.price.replace(/\./g, "");
    return (
      listingData.categoryId &&
      listingData.name.trim() &&
      listingData.condition &&
      listingData.price &&
      parseFloat(numericPrice) > 0
    );
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg space-y-6 bg-white dark:bg-gray-800 shadow-sm"
    >
      <CategorySelector
        selectedCategoryId={listingData.categoryId}
        onSelectCategory={(id) =>
          setListingData((prev) => ({ ...prev, categoryId: id }))
        }
      />

      {listingData.categoryId && (
        <>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Listing Title *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={listingData.name}
              onChange={handleInputChange}
              placeholder="e.g. Vintage Leather Handbag"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
          </div>

          <div>
            <h4 className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              About the item
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Condition *
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(conditionOptions).map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setListingData((prev) => ({
                          ...prev,
                          condition: key as Condition,
                        }))
                      }
                      className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                        listingData.condition === key
                          ? "bg-sky-600 text-white border-sky-600"
                          : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="conditionNote"
                  className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
                >
                  Condition Note (Optional)
                </label>
                <input
                  type="text"
                  id="conditionNote"
                  name="conditionNote"
                  value={listingData.conditionNote}
                  onChange={handleInputChange}
                  placeholder="e.g. Slight scratch on the buckle"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
                  >
                    Price (IDR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      Rp
                    </span>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={listingData.price}
                      onChange={handlePriceChange}
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="stock"
                    className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
                  >
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={listingData.stock}
                    onChange={handleInputChange}
                    placeholder="1"
                    min="1"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomSelect
              label="Size (Optional)"
              placeholder="Select a size"
              options={sizeOptions}
              value={listingData.size}
              onChange={(value) =>
                setListingData((prev) => ({ ...prev, size: value }))
              }
              allowCustom={true}
              customPlaceholder="Enter custom size"
              onCustomChange={(value) =>
                setListingData((prev) => ({ ...prev, customSize: value }))
              }
              customValue={listingData.customSize}
            />
            <CustomSelect
              label="Color (Optional)"
              placeholder="Select a color"
              options={colorOptions}
              value={listingData.color}
              onChange={(value) =>
                setListingData((prev) => ({ ...prev, color: value }))
              }
              allowCustom={true}
              customPlaceholder="Enter custom color"
              onCustomChange={(value) =>
                setListingData((prev) => ({ ...prev, customColor: value }))
              }
              customValue={listingData.customColor}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={listingData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe your item in detail..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Shipping Details (Optional)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="weight"
                  className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
                >
                  Weight (g)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={listingData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g. 500"
                  min="1"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <div>
                <label
                  htmlFor="length"
                  className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
                >
                  Length (cm)
                </label>
                <input
                  type="number"
                  id="length"
                  name="length"
                  value={listingData.length}
                  onChange={handleInputChange}
                  placeholder="e.g. 20"
                  min="1"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <div>
                <label
                  htmlFor="width"
                  className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
                >
                  Width (cm)
                </label>
                <input
                  type="number"
                  id="width"
                  name="width"
                  value={listingData.width}
                  onChange={handleInputChange}
                  placeholder="e.g. 15"
                  min="1"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <div>
                <label
                  htmlFor="height"
                  className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
                >
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={listingData.height}
                  onChange={handleInputChange}
                  placeholder="e.g. 10"
                  min="1"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="isPreloved"
              name="isPreloved"
              type="checkbox"
              checked={listingData.isPreloved}
              onChange={(e) =>
                setListingData((prev) => ({
                  ...prev,
                  isPreloved: e.target.checked,
                }))
              }
              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            />
            <label
              htmlFor="isPreloved"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              This is a pre-loved item
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isFormValid()}
            className="w-full bg-sky-600 dark:bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? "Selling..." : "Sell Now"}
          </button>
        </>
      )}
    </form>
  );
};

export default ListingForm;
