"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import type { SearchResult } from "leaflet-geosearch/dist/providers/provider.js";
import { Search } from "lucide-react";
import Spinner from "../atoms/Spinner";

interface GeoSearchProps {
  onLocationSelect: (location: SearchResult) => void;
}

const GeoSearch = ({ onLocationSelect }: GeoSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const provider = useMemo(() => new OpenStreetMapProvider(), []);

  const performSearch = useCallback(
    (currentQuery: string) => {
      const trimmedQuery = currentQuery.trim();
      if (trimmedQuery.length < 3) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      if (searchAbortRef.current) {
        searchAbortRef.current.abort();
        searchAbortRef.current = null;
      }

      setIsLoading(true);

      const abortController = new AbortController();
      searchAbortRef.current = abortController;

      provider
        .search({ query: trimmedQuery })
        .then((search_results) => {
          if (!abortController.signal.aborted && search_results) {
            setResults(Array.isArray(search_results) ? search_results : []);
            setIsLoading(false);
          } else if (!abortController.signal.aborted) {
            setResults([]);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (!abortController.signal.aborted) {
            setResults([]);
            setIsLoading(false);
          }
        });
    },
    [provider]
  );

  useEffect(() => {
    if (isSelected) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
      if (searchAbortRef.current) {
        searchAbortRef.current.abort();
        searchAbortRef.current = null;
      }
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 3) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(trimmedQuery);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    };
  }, [query, performSearch, isSelected]);

  const handleSelect = (result: SearchResult) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
      searchAbortRef.current = null;
    }
    setIsLoading(false);
    setResults([]);
    setQuery(result.label);
    setIsSelected(true);
    onLocationSelect(result);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (isSelected) {
      setIsSelected(false);
    }

    if (newQuery.trim().length < 3) {
      setResults([]);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && results.length > 0 && !isSelected) {
      e.preventDefault();
      handleSelect(results[0]);
    }
  };

  return (
    <div className="relative w-full sm:w-80">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-black" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (isSelected) {
              setIsSelected(false);
            }
          }}
          placeholder="Search location..."
          className="w-full rounded-lg border-2 border-transparent bg-black/20 py-3 pl-11 pr-10 text-white placeholder-gray-300 backdrop-blur-lg transition-all focus:border-sky-500 focus:bg-black/30 focus:outline-none"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Spinner />
          </div>
        )}
      </div>

      {!isSelected && results.length > 0 && (
        <ul className="absolute z-[1001] mt-2 w-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700">
          {results.map((result, index) => (
            <li
              key={`${result.x}-${result.y}-${index}`}
              onClick={() => handleSelect(result)}
              className="cursor-pointer px-4 py-3 text-sm text-gray-700 dark:text-gray-300 transition-colors hover:bg-sky-100 dark:hover:bg-sky-900/30"
            >
              {result.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GeoSearch;
