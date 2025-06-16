"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/wallet-context";

export function TopNav() {
  const { connected, connect, disconnect } = useWallet();
  return (
    <nav className="border-b px-6 py-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg">
        Nest
      </Link>
      {connected ? (
        <Button onClick={disconnect}>Disconnect</Button>
      ) : (
        <Button onClick={connect}>Connect</Button>
      )}
    </nav>
  );
}
