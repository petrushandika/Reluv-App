"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { getCategories } from "@/features/categories/api/categoryApi";
import { Category } from "@/features/categories/types";
import Spinner from "../atoms/Spinner";

interface CategorySelectorProps {
  selectedCategoryId: number | null;
  onSelectCategory: (id: number) => void;
}

const CategorySelector = ({
  selectedCategoryId,
  onSelectCategory,
}: CategorySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError("Failed to load categories.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCategoryName =
    categories.find((c) => c.id === selectedCategoryId)?.name ||
    "Select a category";

  return (
    <div className="relative" ref={categoryRef}>
      <label
        htmlFor="category"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Category
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors text-gray-900 dark:text-white"
      >
        <span>{selectedCategoryName}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 dark:text-gray-300 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search category..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <ul className="max-h-48 overflow-y-auto">
            {isLoading ? (
              <Spinner />
            ) : error ? (
              <li className="px-4 py-2 text-red-500 dark:text-red-400">{error}</li>
            ) : (
              filteredCategories.map((cat) => (
                <li
                  key={cat.id}
                  className="px-4 py-2 hover:bg-sky-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white"
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {cat.name}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
