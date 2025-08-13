"use client";

import { useState, useEffect } from "react";
import { Investment } from "@/types/investment";

interface UseInvestmentsResult {
  investments: Investment[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useInvestments(): UseInvestmentsResult {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/investments");
      if (!response.ok) {
        throw new Error("Failed to fetch investments");
      }
      const data = await response.json();
      setInvestments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  return { investments, loading, error, refetch: fetchInvestments };
}
