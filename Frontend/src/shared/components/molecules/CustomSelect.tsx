"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";

interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  placeholder?: string;
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  searchable?: boolean;
  allowCustom?: boolean;
  customPlaceholder?: string;
  onCustomChange?: (value: string) => void;
  customValue?: string;
}

const CustomSelect = ({
  label,
  placeholder = "Select an option",
  options,
  value,
  onChange,
  searchable = true,
  allowCustom = false,
  customPlaceholder = "Enter custom value",
  onCustomChange,
  customValue = "",
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCustomExpanded, setIsCustomExpanded] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setIsCustomExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value === "OTHER" && isOpen) {
      setIsCustomExpanded(true);
    } else if (value !== "OTHER") {
      setIsCustomExpanded(false);
    }
  }, [value, isOpen]);

  const filteredOptions = searchTerm
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption
    ? selectedOption.label
    : value || placeholder;

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === "OTHER" && allowCustom) {
      onChange(selectedValue);
      setIsCustomExpanded(true);
    } else {
      onChange(selectedValue);
      setIsOpen(false);
      setSearchTerm("");
      setIsCustomExpanded(false);
    }
  };

  const handleCustomInputChange = (inputValue: string) => {
    if (onCustomChange) {
      onCustomChange(inputValue);
    }
  };

  const handleCustomInputBlur = () => {
    if (customValue && customValue.trim()) {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleCustomInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && customValue && customValue.trim()) {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const otherOption = options.find((opt) => opt.value === "OTHER");
  const regularOptions = filteredOptions.filter((opt) => opt.value !== "OTHER");

  return (
    <div className="relative" ref={selectRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors text-gray-900 dark:text-white"
      >
        <span className={value ? "" : "text-gray-500 dark:text-gray-400"}>
          {value === "OTHER" && customValue
            ? customValue
            : displayValue}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 dark:text-gray-300 transition-transform flex-shrink-0 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
          {searchable && (
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          <ul className="max-h-64 overflow-y-auto">
            {regularOptions.length === 0 && !otherOption ? (
              <li className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm">
                No options found
              </li>
            ) : (
              <>
                {regularOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`px-4 py-2 hover:bg-sky-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white ${
                      value === option.value
                        ? "bg-sky-100 dark:bg-sky-900/30 font-medium"
                        : ""
                    }`}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </li>
                ))}
                {allowCustom && otherOption && (
                  <li className="border-t border-gray-200 dark:border-gray-700">
                    <div
                      className={`px-4 py-2 hover:bg-sky-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white flex items-center justify-between ${
                        value === "OTHER"
                          ? "bg-sky-100 dark:bg-sky-900/30 font-medium"
                          : ""
                      }`}
                      onClick={() => handleSelect("OTHER")}
                    >
                      <span>{otherOption.label}</span>
                      <ChevronRight
                        className={`w-4 h-4 text-gray-400 dark:text-gray-400 transition-transform ${
                          isCustomExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                    {isCustomExpanded && (
                      <div className="p-2 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                        <input
                          type="text"
                          placeholder={customPlaceholder}
                          value={customValue}
                          onChange={(e) => handleCustomInputChange(e.target.value)}
                          onBlur={handleCustomInputBlur}
                          onKeyDown={handleCustomInputKeyDown}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;

