"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ImagePlus,
  UploadCloud,
  X,
  Info,
  Search,
  ChevronDown,
} from "lucide-react";

const allCategories = [
  { id: 1, name: "Women's Fashion" },
  { id: 2, name: "Men's Fashion" },
  { id: 3, name: "Kids & Babies" },
  { id: 4, name: "Bags & Wallets" },
  { id: 5, name: "Shoes" },
  { id: 6, name: "Accessories" },
  { id: 7, name: "Electronics" },
  { id: 8, name: "Home & Living" },
  { id: 9, name: "Books & Hobbies" },
  { id: 10, name: "Health & Beauty" },
];

const conditionOptions = {
  NEW: "New",
  LIKE_NEW: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
};

export default function Sell() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  const [listingData, setListingData] = useState({
    categoryId: null as number | null,
    name: "",
    description: "",
    price: "",
    condition: "",
    stock: 1,
    weight: "",
    length: "",
    width: "",
    height: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      const combinedFiles = [...files, ...newFiles].slice(0, 10);
      setFiles(combinedFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (newFiles.length === 0) {
      setListingData((prev) => ({ ...prev, categoryId: null }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setListingData((prev) => ({ ...prev, [name]: value }));
  };

  const filteredCategories = allCategories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const InitialUploadView = () => (
    <div
      className={`relative flex flex-col items-center justify-center w-full h-80 rounded-lg border-2 border-dashed transition-colors duration-300 ${
        isDragging ? "border-sky-400 bg-sky-200" : "border-sky-500 bg-sky-100"
      } text-sky-800 cursor-pointer`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="text-center">
        <UploadCloud className="mx-auto h-12 w-12 text-sky-500 opacity-80" />
        <button
          type="button"
          className="mt-4 px-6 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 transition-colors"
        >
          Select photos
        </button>
        <p className="mt-2 text-sm text-sky-700 opacity-90">
          or drag photos here
        </p>
        <p className="mt-1 text-xs text-sky-600 opacity-70">
          (Up to 10 photos)
        </p>
      </div>
    </div>
  );

  const UploadedImagesView = () => {
    const selectedCategoryName =
      allCategories.find((c) => c.id === listingData.categoryId)?.name ||
      "Select a category";

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {files.map((file, index) => (
              <div key={index} className="relative group aspect-square">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview ${index}`}
                  className="w-full h-full object-cover rounded-md border-2 border-transparent group-hover:border-sky-500"
                  onLoad={(e) =>
                    URL.revokeObjectURL((e.target as HTMLImageElement).src)
                  }
                />
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs font-bold px-2 py-1 rounded">
                    COVER
                  </div>
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {files.length < 10 && (
              <div
                className={`relative flex flex-col items-center justify-center w-full aspect-square rounded-lg border-2 border-dashed transition-colors duration-300 ${
                  isDragging
                    ? "border-sky-400 bg-sky-200"
                    : "border-sky-500 bg-sky-100"
                } text-sky-800 cursor-pointer`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="h-8 w-8 text-sky-500" />
                <p className="mt-1 text-xs text-center">Add more</p>
              </div>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Info className="w-4 h-4 mr-2 text-sky-600" />
            <span>Tip: Drag and drop to re-arrange photos.</span>
          </div>
        </div>

        <div className="border border-gray-200 p-6 rounded-lg space-y-6">
          <div className="relative" ref={categoryRef}>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category
            </label>
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full flex justify-between items-center text-left px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            >
              <span>{selectedCategoryName}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isCategoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isCategoryOpen && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search category..."
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                    />
                  </div>
                </div>
                <ul className="max-h-48 overflow-y-auto">
                  {filteredCategories.map((cat) => (
                    <li
                      key={cat.id}
                      className="px-4 py-2 hover:bg-sky-100 cursor-pointer"
                      onClick={() => {
                        setListingData((prev) => ({
                          ...prev,
                          categoryId: cat.id,
                        }));
                        setIsCategoryOpen(false);
                        setCategorySearch("");
                      }}
                    >
                      {cat.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {listingData.categoryId && (
            <>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Listing Title
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={listingData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Vintage Leather Handbag"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <h4 className="block text-sm font-medium text-gray-700 mb-2">
                  About the item
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500">
                      Condition
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Object.entries(conditionOptions).map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            setListingData((prev) => ({
                              ...prev,
                              condition: key,
                            }))
                          }
                          className={`px-3 py-1 text-sm rounded-full border transition-colors ${
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
                      htmlFor="price"
                      className="block text-xs text-gray-500 mb-1"
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={listingData.price}
                      onChange={handleInputChange}
                      placeholder="Rp 0"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                    />
                  </div>
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
                  rows={5}
                  placeholder="Describe your item in detail..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                ></textarea>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Shipping Details
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
              <button className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg hover:bg-sky-700 shadow-sm hover:shadow-md">
                List Now
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white w-full flex items-center justify-center p-4">
      <div className="container mx-auto px-6 md:px-20 xl:px-40 py-12 md:py-12">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        {files.length === 0 ? <InitialUploadView /> : <UploadedImagesView />}
      </div>
    </div>
  );
}
