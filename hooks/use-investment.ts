"use client";

import { useState, useEffect, useCallback } from "react";
import type { Investment, InvestmentFormData } from "@/types/investment";

export function useInvestments(userId?: string) {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use useCallback to memoize the function and fix the dependency issue
  const fetchInvestments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = userId ? `?userId=${userId}` : "";
      const response = await fetch(`/api/investments${params}`);
      if (!response.ok) throw new Error("Failed to fetch investments");

      const data = await response.json();
      setInvestments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [userId]); // Add userId as dependency

  const createInvestment = async (data: InvestmentFormData) => {
    try {
      const response = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create investment");

      const newInvestment = await response.json();
      setInvestments((prev) => [newInvestment, ...prev]);
      return newInvestment;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to create investment"
      );
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]); // Now fetchInvestments is properly memoized

  return {
    investments,
    loading,
    error,
    createInvestment,
    refetch: fetchInvestments,
  };
}
