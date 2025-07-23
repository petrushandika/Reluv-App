"use client";

import React from "react";
import { ListingData, Condition } from "../types";
import CategorySelector from "@/shared/components/molecules/CategorySelector";

const conditionOptions: Record<Condition, string> = {
  NEW: "New",
  LIKE_NEW: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
};

const sizeOptions = ["S", "M", "L", "XL", "XXL", "OTHER"];
const colorOptions = [
  "Red",
  "Blue",
  "Black",
  "White",
  "Green",
  "Yellow",
  "OTHER",
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
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const isFormValid = () => {
    return (
      listingData.categoryId &&
      listingData.name.trim() &&
      listingData.condition &&
      listingData.price &&
      parseFloat(listingData.price) > 0
    );
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="border border-gray-200 p-6 rounded-lg space-y-6"
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
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div>
            <h4 className="block text-sm font-medium text-gray-700 mb-2">
              About the item
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-2">
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
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
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
                  className="block text-xs text-gray-500 mb-1"
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
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-xs text-gray-500 mb-1"
                  >
                    Price (IDR) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={listingData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="stock"
                    className="block text-xs text-gray-500 mb-1"
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="size"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Size (Optional)
              </label>
              <select
                id="size"
                name="size"
                value={listingData.size}
                onChange={(e) =>
                  setListingData((prev) => ({ ...prev, size: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Select a size</option>
                {sizeOptions.map((s) => (
                  <option key={s} value={s}>
                    {s === "OTHER" ? "Another Size..." : s}
                  </option>
                ))}
              </select>
              {listingData.size === "OTHER" && (
                <input
                  type="text"
                  name="customSize"
                  value={listingData.customSize}
                  onChange={handleInputChange}
                  placeholder="Enter custom size"
                  className="mt-2 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              )}
            </div>
            <div>
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Color (Optional)
              </label>
              <select
                id="color"
                name="color"
                value={listingData.color}
                onChange={(e) =>
                  setListingData((prev) => ({ ...prev, color: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Select a color</option>
                {colorOptions.map((c) => (
                  <option key={c} value={c}>
                    {c === "OTHER" ? "Another Color..." : c}
                  </option>
                ))}
              </select>
              {listingData.color === "OTHER" && (
                <input
                  type="text"
                  name="customColor"
                  value={listingData.customColor}
                  onChange={handleInputChange}
                  placeholder="Enter custom color"
                  className="mt-2 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Shipping Details (Optional)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="weight"
                  className="block text-xs text-gray-500 mb-1"
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
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="length"
                  className="block text-xs text-gray-500 mb-1"
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
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="width"
                  className="block text-xs text-gray-500 mb-1"
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
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="height"
                  className="block text-xs text-gray-500 mb-1"
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
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-sm"
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
              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isPreloved"
              className="ml-2 block text-sm text-gray-900"
            >
              This is a pre-loved item
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isFormValid()}
            className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg hover:bg-sky-700 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? "Listing..." : "List Now"}
          </button>
        </>
      )}
    </form>
  );
};

export default ListingForm;
