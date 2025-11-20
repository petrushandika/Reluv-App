'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import type { SearchResult } from 'leaflet-geosearch/dist/providers/provider.js';
import { Search } from 'lucide-react';
import Spinner from '../atoms/Spinner';
import { api } from '@/shared/lib/axios';

interface GeoSearchProps {
  onLocationSelect: (location: SearchResult) => void;
}

const GeoSearch = ({ onLocationSelect }: GeoSearchProps) => {
  const [query, setQuery] = useState('');
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

      const searchWithProvider = async () => {
        try {
          try {
            const response = await api.get('/maps/search-osm', {
              params: { q: trimmedQuery },
            });

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
              const formattedResults: SearchResult[] = response.data.map((item: any) => ({
                x: parseFloat(item.lon),
                y: parseFloat(item.lat),
                label: item.display_name || `${item.name || ''}, ${item.address?.city || ''}, ${item.address?.country || ''}`.trim(),
                raw: item,
              }));
              
              if (!abortController.signal.aborted) {
                setResults(formattedResults);
                setIsLoading(false);
                return;
              }
            }
          } catch (backendError) {
            console.log('Backend search failed, using OpenStreetMap provider');
          }

          const search_results = await provider.search({ query: trimmedQuery });
          
          if (!abortController.signal.aborted) {
            if (search_results && Array.isArray(search_results) && search_results.length > 0) {
              setResults(search_results);
            } else {
              setResults([]);
            }
            setIsLoading(false);
          }
        } catch (error) {
          if (!abortController.signal.aborted) {
            console.error('GeoSearch error:', error);
            setResults([]);
            setIsLoading(false);
          }
        }
      };

      searchWithProvider();
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
    if (e.key === 'Enter' && results.length > 0 && !isSelected) {
      e.preventDefault();
      handleSelect(results[0]);
    }
  };

  return (
    <div className="relative w-full z-10">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-700 dark:text-gray-300" />
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
          placeholder="Search Location"
          className="w-full rounded-lg border border-white/30 dark:border-white/20 bg-white/20 dark:bg-black/20 backdrop-blur-md py-3 pl-10 pr-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all focus:border-white/50 dark:focus:border-white/30 focus:bg-white/30 dark:focus:bg-black/30 focus:outline-none focus:ring-2 focus:ring-white/20 dark:focus:ring-white/10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Spinner />
          </div>
        )}
      </div>

      {!isSelected && results.length > 0 && (
        <ul className="absolute z-[1001] mt-2 w-full rounded-lg bg-white dark:bg-gray-800 shadow-xl max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700">
          {results.map((result, index) => (
            <li
              key={`${result.x}-${result.y}-${index}`}
              onClick={() => handleSelect(result)}
              className="cursor-pointer px-4 py-3 text-sm text-gray-700 dark:text-gray-300 transition-colors hover:bg-sky-50 dark:hover:bg-sky-900/30 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
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
