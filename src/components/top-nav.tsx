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
    <nav className="border-b px-4 md:px-6 flex items-center justify-between h-16 md:h-[72px]">
      <Link href="/" className="block">
        <img
          src="/nest-logo.svg"
          alt="Nest logo"
          className="w-8 h-8"
        />
      </Link>
      <div className="flex items-center gap-2">
        <Button asChild variant="secondary">
          <Link href="/admin">Admin</Link>
        </Button>
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
      </div>
    </nav>
  );
}
