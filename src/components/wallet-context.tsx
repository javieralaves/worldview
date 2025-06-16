"use client";
import { createContext, useContext, useState } from "react";

interface WalletContextValue {
  connected: boolean;
  balance: number;
  transactions: string[];
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<string[]>([]);

  function connect() {
    setConnected(true);
    setBalance(1000);
    setTransactions(["Initial deposit"]);
  }

  function disconnect() {
    setConnected(false);
    setBalance(0);
    setTransactions([]);
  }

  return (
    <WalletContext.Provider
      value={{ connected, balance, transactions, connect, disconnect }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
