"use client";

import { useState, useEffect, useCallback } from "react";
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
  const provider = new OpenStreetMapProvider();

  const debouncedSearch = useCallback(
    (currentQuery: string) => {
      if (currentQuery.length < 3) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      provider.search({ query: currentQuery }).then((search_results) => {
        setResults(search_results);
        setIsLoading(false);
      });
    },
    [provider]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      debouncedSearch(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query, debouncedSearch]);

  const handleSelect = (result: SearchResult) => {
    onLocationSelect(result);
    setQuery(result.label);
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && results.length > 0) {
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
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search location..."
          className="w-full rounded-lg border-2 border-transparent bg-black/20 py-3 pl-11 pr-10 text-white placeholder-gray-300 backdrop-blur-lg transition-all focus:border-sky-500 focus:bg-black/30 focus:outline-none"
        />
        {isLoading && <Spinner />}
      </div>

      {results.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg bg-white shadow-lg">
          {results.map((result, index) => (
            <li
              key={result.x + "" + result.y + index}
              onClick={() => handleSelect(result)}
              className="cursor-pointer px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-sky-100"
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
