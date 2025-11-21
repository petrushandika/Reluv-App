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

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const numericPrice = listingData.price.replace(/\./g, "");

    if (!listingData.categoryId) {
      errors.push("Category is required");
    }

    if (!listingData.name.trim()) {
      errors.push("Listing title is required");
    } else if (listingData.name.trim().length > 255) {
      errors.push("Listing title must be at most 255 characters");
    }

    if (!listingData.condition) {
      errors.push("Condition is required");
    }

    if (!listingData.price || numericPrice === "") {
      errors.push("Price is required");
    } else {
      const priceValue = parseFloat(numericPrice);
      if (isNaN(priceValue) || priceValue < 0) {
        errors.push("Price must be 0 or greater");
      } else if (priceValue > 999999999) {
        errors.push("Price must be less than 1 billion");
      }
    }

    if (listingData.description && listingData.description.length > 10000) {
      errors.push("Description must be at most 10000 characters");
    }

    if (listingData.conditionNote && listingData.conditionNote.length > 500) {
      errors.push("Condition note must be at most 500 characters");
    }

    if (listingData.size === "OTHER" && listingData.customSize) {
      if (listingData.customSize.length > 50) {
        errors.push("Custom size must be at most 50 characters");
      }
    }

    if (listingData.color === "OTHER" && listingData.customColor) {
      if (listingData.customColor.length > 50) {
        errors.push("Custom color must be at most 50 characters");
      }
    }

    const weight = parseInt(listingData.weight, 10);
    if (listingData.weight && !isNaN(weight)) {
      if (weight < 1) {
        errors.push("Weight must be at least 1 gram");
      } else if (weight > 999999) {
        errors.push("Weight must be less than 1 million grams");
      }
    }

    const length = parseInt(listingData.length, 10);
    if (listingData.length && !isNaN(length)) {
      if (length < 1) {
        errors.push("Length must be at least 1 cm");
      } else if (length > 9999) {
        errors.push("Length must be less than 10000 cm");
      }
    }

    const width = parseInt(listingData.width, 10);
    if (listingData.width && !isNaN(width)) {
      if (width < 1) {
        errors.push("Width must be at least 1 cm");
      } else if (width > 9999) {
        errors.push("Width must be less than 10000 cm");
      }
    }

    const height = parseInt(listingData.height, 10);
    if (listingData.height && !isNaN(height)) {
      if (height < 1) {
        errors.push("Height must be at least 1 cm");
      } else if (height > 9999) {
        errors.push("Height must be less than 10000 cm");
      }
    }

    const stock = Number(listingData.stock);
    if (!isNaN(stock) && stock < 0) {
      errors.push("Stock must be 0 or greater");
    } else if (!isNaN(stock) && stock > 999999) {
      errors.push("Stock must be less than 1 million");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const isFormValid = () => {
    return validateForm().isValid;
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
                    min="0"
                    max="999999"
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
              maxLength={10000}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            {listingData.description.length > 9500 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                {10000 - listingData.description.length} characters remaining
              </p>
            )}
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
                  max="999999"
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
                  max="9999"
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
                  max="9999"
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
                  max="9999"
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
