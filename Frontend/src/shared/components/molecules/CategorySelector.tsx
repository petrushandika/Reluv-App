"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
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
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        categoryRef.current &&
        !categoryRef.current.contains(target) &&
        !target.closest('input') &&
        !target.closest('textarea')
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const flattenCategories = (cats: Category[]): Category[] => {
    const result: Category[] = [];
    const traverse = (cat: Category) => {
      result.push(cat);
      if (cat.childCategories && cat.childCategories.length > 0) {
        cat.childCategories.forEach(traverse);
      }
    };
    cats.forEach(traverse);
    return result;
  };

  const findCategoryPath = (
    cats: Category[],
    id: number,
    path: Category[] = []
  ): Category[] | null => {
    for (const cat of cats) {
      const currentPath = [...path, cat];
      if (cat.id === id) return currentPath;
      if (cat.childCategories) {
        const found = findCategoryPath(cat.childCategories, id, currentPath);
        if (found) return found;
      }
    }
    return null;
  };

  const allCategories = flattenCategories(categories);
  const filteredCategories = searchTerm
    ? allCategories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categories;

  const selectedCategoryPath = selectedCategoryId
    ? findCategoryPath(categories, selectedCategoryId)
    : null;

  const renderCategoryPath = () => {
    if (!selectedCategoryPath || selectedCategoryPath.length === 0) {
      return <span className="text-gray-500 dark:text-gray-400">Select a category</span>;
    }

    if (selectedCategoryPath.length === 1) {
      return <span>{selectedCategoryPath[0].name}</span>;
    }

    return (
      <span className="flex items-center gap-1 flex-wrap">
        {selectedCategoryPath.map((cat, index) => {
          const isLast = index === selectedCategoryPath.length - 1;
          const isParent = index < selectedCategoryPath.length - 1;
          
          return (
            <React.Fragment key={cat.id}>
              <span
                className={
                  isLast
                    ? "text-sm font-medium"
                    : "text-xs text-gray-500 dark:text-gray-400"
                }
              >
                {cat.name}
              </span>
              {isParent && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  &gt;
                </span>
              )}
            </React.Fragment>
          );
        })}
      </span>
    );
  };

  const toggleExpand = (categoryId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleCategorySelect = (categoryId: number) => {
    onSelectCategory(categoryId);
    setIsOpen(false);
    setSearchTerm("");
  };

  const renderCategoryItem = (category: Category, level: number = 0) => {
    const hasChildren =
      category.childCategories && category.childCategories.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategoryId === category.id;

    return (
      <React.Fragment key={category.id}>
        <li
          className={`px-4 py-2 hover:bg-sky-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white flex items-center justify-between ${
            isSelected
              ? "bg-sky-100 dark:bg-sky-900/30 font-medium"
              : ""
          }`}
          style={{ paddingLeft: `${12 + level * 20}px` }}
          onClick={() => handleCategorySelect(category.id)}
        >
          <div className="flex items-center gap-2 flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(category.id, e)}
                className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                )}
              </button>
            ) : (
              <span className="w-5" />
            )}
            <span>{category.name}</span>
          </div>
        </li>
        {hasChildren &&
          isExpanded &&
          category.childCategories?.map((child) =>
            renderCategoryItem(child, level + 1)
          )}
      </React.Fragment>
    );
  };

  const renderSearchResults = () => {
    return filteredCategories.map((cat) => (
      <li
        key={cat.id}
        className={`px-4 py-2 hover:bg-sky-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white ${
          selectedCategoryId === cat.id
            ? "bg-sky-100 dark:bg-sky-900/30 font-medium"
            : ""
        }`}
        onClick={() => handleCategorySelect(cat.id)}
      >
        {cat.name}
      </li>
    ));
  };

  return (
    <div className="relative" ref={categoryRef}>
      <label
        htmlFor="category"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Category <span className="text-red-500">*</span>
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors text-gray-900 dark:text-white"
      >
        <div className="flex-1 min-w-0">{renderCategoryPath()}</div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 dark:text-gray-300 transition-transform flex-shrink-0 ml-2 ${
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
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
                onInput={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <li className="px-4 py-4 flex justify-center">
                <Spinner />
              </li>
            ) : error ? (
              <li className="px-4 py-2 text-red-500 dark:text-red-400">
                {error}
              </li>
            ) : searchTerm ? (
              renderSearchResults()
            ) : (
              categories.map((cat) => renderCategoryItem(cat, 0))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
