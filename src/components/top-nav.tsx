"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/wallet-context";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-context";

export function TopNav() {
  const { connected, connect, disconnect } = useWallet();
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="border-b px-6 py-4 flex justify-between items-center">
      <Link href="/" className="font-medium text-lg">
        Nest
      </Link>
      {connected ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage alt="avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === "light" ? "Dark Theme" : "Light Theme"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={disconnect}>
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={connect}>Connect</Button>
      )}
    </nav>
  );
}
