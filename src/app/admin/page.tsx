"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow, differenceInDays, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import {
  LineChart as RechartsLineChart,
  Line,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

const tvlHistory = [
  { month: "Jan", tvl: 8 },
  { month: "Feb", tvl: 9 },
  { month: "Mar", tvl: 10 },
  { month: "Apr", tvl: 11 },
  { month: "May", tvl: 12 },
  { month: "Jun", tvl: 12.3 },
];

const apyHistory = [
  { month: "Jan", apy: 7 },
  { month: "Feb", apy: 7.2 },
  { month: "Mar", apy: 7.5 },
  { month: "Apr", apy: 8 },
  { month: "May", apy: 8.3 },
  { month: "Jun", apy: 8.4 },
];

interface KPI {
  title: string;
  value: string;
  subtitle?: string;
}

const secondaryKpis: KPI[] = [
  { title: "Yield Distributed 7D", value: "$120k" },
  { title: "Yield Distributed 30D", value: "$1.2M" },
  { title: "Avg. Drift", value: "0.3%" },
  { title: "Redemption Volume", value: "20k pUSD" },
  { title: "Avg. Redemption Duration", value: "2 days" },
];

interface Vault {
  icon: string;
  name: string;
  type: "Asset" | "Composition";
  curator: string;
  price: number;
  tvl: number;
  apy: number;
  drift: number;
  rebalance: string;
  pending: number;
}

const vaults: Vault[] = [
  {
    icon: "/tokens/mineral-vault.svg",
    name: "Mineral Vault",
    type: "Asset",
    curator: "Nest",
    price: 1.23,
    tvl: 5.0,
    apy: 8.7,
    drift: 0.1,
    rebalance: "2025-06-15",
    pending: 10000,
  },
  {
    icon: "/tokens/nest-treasuries.svg",
    name: "Nest Treasuries",
    type: "Composition",
    curator: "Nest",
    price: 1.12,
    tvl: 3.2,
    apy: 12.3,
    drift: -0.05,
    rebalance: "2025-06-18",
    pending: 5000,
  },
  {
    icon: "/tokens/nest-alpha.svg",
    name: "Nest Alpha",
    type: "Composition",
    curator: "Nest",
    price: 0.98,
    tvl: 2.4,
    apy: 9.8,
    drift: 0.02,
    rebalance: "2025-06-12",
    pending: 1200,
  },
  {
    icon: "/tokens/nest-credit.svg",
    name: "Nest Credit",
    type: "Composition",
    curator: "Nest",
    price: 1.05,
    tvl: 2.8,
    apy: 8.1,
    drift: -0.03,
    rebalance: "2025-06-08",
    pending: 7500,
  },
];

interface ActivityLog {
  timestamp: string;
  action: string;
  vault?: string;
  asset?: string;
  amount?: number;
}

const activityLogs: ActivityLog[] = [
  {
    action: "Create vault",
    timestamp: "2024-06-01T12:00:00Z",
    vault: "Mineral Vault",
  },
  {
    action: "Buy asset",
    timestamp: "2024-06-03T09:00:00Z",
    asset: "iSNR",
    amount: 10000,
    vault: "Nest Credit",
  },
  {
    action: "Sell asset",
    timestamp: "2024-06-06T15:30:00Z",
    asset: "mBASIS",
    amount: 5000,
    vault: "Nest Alpha",
  },
  {
    action: "Update price",
    timestamp: "2024-06-08T11:45:00Z",
    vault: "Nest Alpha",
  },
];

export default function AdminPage() {
  const [filter, setFilter] = useState<"All" | "Asset" | "Composition">("All");
  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo(() => {
    return vaults.filter((v) => (filter === "All" ? true : v.type === filter));
  }, [filter]);

  const headerWithTooltip = (label: string, tip: string) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>{label}</span>
      </TooltipTrigger>
      <TooltipContent sideOffset={4}>{tip}</TooltipContent>
    </Tooltip>
  );

  const columns: ColumnDef<Vault>[] = [
    {
      accessorKey: "name",
      header: () => headerWithTooltip("Vault Name", "Name of the vault"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage src={row.original.icon} alt="" />
            <AvatarFallback>{row.getValue<string>("name").charAt(0)}</AvatarFallback>
          </Avatar>
          {row.getValue<string>("name")}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: () => headerWithTooltip("Type", "Vault type"),
    },
    {
      accessorKey: "curator",
      header: () => headerWithTooltip("Curator", "Vault manager"),
    },
    {
      accessorKey: "price",
      header: () => headerWithTooltip("Token Price", "Price per vault token"),
      cell: ({ row }) => `$${row.getValue<number>("price").toFixed(2)}`,
    },
    {
      accessorKey: "tvl",
      header: () => headerWithTooltip("TVL", "Total value locked"),
      cell: ({ row }) => `$${row.getValue<number>("tvl").toLocaleString()}M`,
    },
    {
      accessorKey: "apy",
      header: () => headerWithTooltip("APY", "Annual percentage yield"),
      cell: ({ row }) => `${row.getValue<number>("apy")}%`,
    },
    {
      accessorKey: "drift",
      header: () => headerWithTooltip("Drift", "Backing vs token price"),
      cell: ({ row }) => `${(Math.abs(row.getValue<number>("drift")) * 100).toFixed(1)}%`,
    },
    {
      accessorKey: "rebalance",
      header: () => headerWithTooltip("Last Rebalance", "When vault was rebalanced"),
      cell: ({ row }) => {
        const date = parseISO(row.getValue<string>("rebalance"));
        const diff = formatDistanceToNow(date, { addSuffix: true });
        const stale = differenceInDays(Date.now(), date) > 10;
        return (
          <div className="flex items-center gap-1">
            {diff}
            {stale && <span className="size-2 rounded-full bg-yellow-400" />}
          </div>
        );
      },
    },
    {
      accessorKey: "pending",
      header: () => headerWithTooltip("Pending Redemptions", "Pending withdrawals"),
      cell: ({ row }) =>
        `${row.getValue<number>("pending").toLocaleString()} pUSD`,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-[1080px] mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Welcome to the Nest Console</h1>
        <Button>New Vault</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Nest TVL chart */}
        <section className="space-y-4">
          <h2 className="text-xl font-medium">Nest TVL</h2>
          <div className="bg-[#D9DFCF] rounded-[24px] p-6">
            <div className="space-y-[12px]">
              <div className="text-[60px] leading-[72px] font-medium text-[#030301]">
                {`$${tvlHistory[tvlHistory.length - 1].tvl.toFixed(1)}M`}
              </div>
              <div className="text-[18px] leading-[28px] text-[#155538]">
                {`${(tvlHistory[tvlHistory.length - 1].tvl - tvlHistory[0].tvl) >= 0 ? "+" : ""}${(tvlHistory[tvlHistory.length - 1].tvl - tvlHistory[0].tvl).toFixed(1)}M last 6mo`}
              </div>
            </div>
            <div className="mt-[64px]">
              <ResponsiveContainer width="100%" height={200}>
                <RechartsLineChart data={tvlHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <RechartsTooltip
                    contentStyle={{ background: "#000", borderColor: "#000", color: "#fff" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tvl"
                    stroke="#47644C"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Avg. APY chart */}
        <section className="space-y-4">
          <h2 className="text-xl font-medium">Avg. APY</h2>
          <div className="bg-[#D9DFCF] rounded-[24px] p-6">
            <div className="space-y-[12px]">
              <div className="text-[60px] leading-[72px] font-medium text-[#030301]">
                {`${apyHistory[apyHistory.length - 1].apy.toFixed(1)}%`}
              </div>
              <div className="text-[18px] leading-[28px] text-[#155538]">
                {`${(apyHistory[apyHistory.length - 1].apy - apyHistory[0].apy) >= 0 ? "+" : ""}${(apyHistory[apyHistory.length - 1].apy - apyHistory[0].apy).toFixed(1)}% last 6mo`}
              </div>
            </div>
            <div className="mt-[64px]">
              <ResponsiveContainer width="100%" height={200}>
                <RechartsLineChart data={apyHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <RechartsTooltip
                    contentStyle={{ background: "#000", borderColor: "#000", color: "#fff" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="apy"
                    stroke="#47644C"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {secondaryKpis.map((kpi) => (
          <Card key={kpi.title} className="shadow-none bg-[#F5F5F5]">
            <CardHeader>
              <CardTitle>{kpi.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl font-medium">{kpi.value}</div>
              {kpi.subtitle && (
                <div className="text-sm text-muted-foreground">{kpi.subtitle}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Vaults</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="capitalize">
                {filter.toLowerCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(["All", "Asset", "Composition"] as const).map((type) => (
                <DropdownMenuItem key={type} onClick={() => setFilter(type)}>
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-muted">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer select-none"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-muted">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Logs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow className="border-muted">
                <TableHead>Date &amp; Time</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Context</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLogs.map((log, i) => {
                const context =
                  log.action === "Create vault"
                    ? log.vault
                    : log.action === "Buy asset" || log.action === "Sell asset"
                    ? `${log.amount?.toLocaleString()} ${log.asset} in ${log.vault}`
                    : log.vault ?? "";
                return (
                  <TableRow key={i} className="border-muted">
                    <TableCell>
                      {new Date(log.timestamp).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell className="whitespace-nowrap">{context}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
