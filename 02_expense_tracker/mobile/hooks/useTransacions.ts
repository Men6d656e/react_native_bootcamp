//react custom hook file

import { API_URL } from "@/constants/api";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export interface Transaction {
  id: number;
  user_id: string;
  title: string;
  amount: string;
  category: string;
  created_at: string;
}

export interface Summary {
  balance: number;
  income: number;
  expenses: number;
}

export const useTransactions = (userId: string | undefined) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    balance: 0,
    income: 0,
    expenses: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    const response = await fetch(`${API_URL}/transactions/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch history");
    const data = await response.json();
    // Fix: Access the array inside the response object
    setTransactions(data.transactions || []);
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch summary");
    const data = await response.json();
    // Ensure numbers are handled correctly
    setSummary({
      balance: Number(data.balance),
      income: Number(data.income),
      expenses: Number(data.expenses),
    });
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load data";
      setError(msg);
      console.error("Hook Error:", msg);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");

      // Refresh local data
      await loadData();
      Alert.alert("Success", "Transaction deleted");
    } catch (err) {
      Alert.alert("Error", "Could not delete transaction");
    }
  };
  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
