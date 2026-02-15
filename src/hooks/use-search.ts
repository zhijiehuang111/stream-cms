"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "./use-debounce";

type SearchResult = {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
};

export function useSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&pageSize=5`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) {
          setResults(data.data.items);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return { results, isLoading };
}
