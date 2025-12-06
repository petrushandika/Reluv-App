"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { ListingData, Condition } from "../types";
import CategorySelector from "@/shared/components/molecules/CategorySelector";
import CustomSelect from "@/shared/components/molecules/CustomSelect";
import { toast } from "sonner";

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

const createListingSchema = (listingData: ListingData) => {
  const numericPrice = listingData.price.replace(/\./g, "");
  const priceValue = numericPrice ? parseFloat(numericPrice) : NaN;

  return z.object({
    categoryId: z.number().min(1, { message: "Category is required" }),
    name: z
      .string()
      .min(1, { message: "Listing title is required" })
      .max(255, { message: "Listing title must be at most 255 characters" })
      .trim(),
    condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"], {
      required_error: "Condition is required",
      invalid_type_error: "Please select a valid condition",
    }),
    price: z
      .string()
      .min(1, { message: "Price is required" })
      .refine(
        () => {
          return !isNaN(priceValue) && priceValue >= 0;
        },
        { message: "Price must be 0 or greater" }
      )
      .refine(
        () => {
          return !isNaN(priceValue) && priceValue <= 999999999;
        },
        { message: "Price must be less than 1 billion" }
      ),
    description: z
      .string()
      .max(10000, { message: "Description must be at most 10000 characters" })
      .optional()
      .or(z.literal("")),
    conditionNote: z
      .string()
      .max(500, { message: "Condition note must be at most 500 characters" })
      .optional()
      .or(z.literal("")),
    customSize: z
      .string()
      .max(50, { message: "Custom size must be at most 50 characters" })
      .optional()
      .or(z.literal("")),
    customColor: z
      .string()
      .max(50, { message: "Custom color must be at most 50 characters" })
      .optional()
      .or(z.literal("")),
    weight: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => {
          if (!val) return true;
          const num = parseInt(val, 10);
          return !isNaN(num) && num >= 1 && num <= 999999;
        },
        { message: "Weight must be between 1 and 999999 grams" }
      ),
    length: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => {
          if (!val) return true;
          const num = parseInt(val, 10);
          return !isNaN(num) && num >= 1 && num <= 9999;
        },
        { message: "Length must be between 1 and 9999 cm" }
      ),
    width: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => {
          if (!val) return true;
          const num = parseInt(val, 10);
          return !isNaN(num) && num >= 1 && num <= 9999;
        },
        { message: "Width must be between 1 and 9999 cm" }
      ),
    height: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => {
          if (!val) return true;
          const num = parseInt(val, 10);
          return !isNaN(num) && num >= 1 && num <= 9999;
        },
        { message: "Height must be between 1 and 9999 cm" }
      ),
    stock: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => {
          if (!val) return true;
          const num = Number(val);
          return !isNaN(num) && num >= 0 && num <= 999999;
        },
        { message: "Stock must be between 0 and 999999" }
      ),
  });
};

const ListingForm = ({
  listingData,
  setListingData,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ListingFormProps) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    if (fieldErrors.price) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.price;
        return newErrors;
      });
    }
  };

  const handleFormInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleInputChange(e);
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
    setValidationError(null);
  };

  useEffect(() => {
    if (validationError) {
      toast.error("Validation Error", {
        description: validationError,
      });
    }
  }, [validationError]);

  useEffect(() => {
    if (fieldErrors.categoryId) {
      toast.error("Validation Error", {
        description: fieldErrors.categoryId,
      });
    }
  }, [fieldErrors.categoryId]);

  useEffect(() => {
    if (fieldErrors.condition) {
      toast.error("Validation Error", {
        description: fieldErrors.condition,
      });
    }
  }, [fieldErrors.condition]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setFieldErrors({});

    const schema = createListingSchema(listingData);
    const validationResult = schema.safeParse(listingData);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const fieldName = err.path[0] as string;
          errors[fieldName] = err.message;
        } else {
          const errorMsg = err.message;
          setValidationError(errorMsg);
          toast.error("Validation Error", {
            description: errorMsg,
          });
        }
      });
      setFieldErrors(errors);
      if (Object.keys(errors).length === 0 && validationResult.error.errors[0]) {
        const errorMsg = validationResult.error.errors[0].message;
        setValidationError(errorMsg);
        toast.error("Validation Error", {
          description: errorMsg,
        });
      }
      return;
    }

    handleSubmit();
  };

  const isFormValid = () => {
    const schema = createListingSchema(listingData);
    const validationResult = schema.safeParse(listingData);
    return validationResult.success;
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
              Listing Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={listingData.name}
              onChange={handleFormInputChange}
              placeholder="e.g. Vintage Leather Handbag"
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                fieldErrors.name
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              required
            />
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <h4 className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              About the item
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Condition <span className="text-red-500">*</span>
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
                      className={`px-4 py-2 text-sm rounded-full border transition-colors cursor-pointer ${
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
                  onChange={handleFormInputChange}
                  placeholder="e.g. Slight scratch on the buckle"
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                    fieldErrors.conditionNote
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {fieldErrors.conditionNote && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {fieldErrors.conditionNote}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
                  >
                    Price (IDR) <span className="text-red-500">*</span>
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
                      className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                        fieldErrors.price
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      required
                    />
                  </div>
                  {fieldErrors.price && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.price}
                    </p>
                  )}
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
              onChange={handleFormInputChange}
              rows={4}
              placeholder="Describe your item in detail..."
              maxLength={10000}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                fieldErrors.description
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {fieldErrors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.description}
              </p>
            )}
            {!fieldErrors.description && listingData.description.length > 9500 && (
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
            className="w-full bg-sky-600 dark:bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isLoading ? "Selling..." : "Sell Now"}
          </button>
        </>
      )}
    </form>
  );
};

export default ListingForm;
