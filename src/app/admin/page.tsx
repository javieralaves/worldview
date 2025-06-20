"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { ArrowUpDown } from "lucide-react";

interface KPI {
  title: string;
  value: string;
  subtitle?: string;
}

const kpis: KPI[] = [
  { title: "Nest TVL", value: "$12.3M" },
  { title: "# of Vaults", value: "4" },
  { title: "Yield Distributed", value: "$1.2M / 30d" },
  { title: "Redemptions", value: "20k pUSD", subtitle: "since Jun 1" },
];

interface Vault {
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
    name: "Mineral Vault",
    type: "Asset",
    curator: "Nest",
    price: 1.23,
    tvl: 5.0,
    apy: 8.7,
    drift: 0.1,
    rebalance: "2024-06-15",
    pending: 10000,
  },
  {
    name: "Nest Treasuries",
    type: "Composition",
    curator: "Nest",
    price: 1.12,
    tvl: 3.2,
    apy: 12.3,
    drift: -0.05,
    rebalance: "2024-06-18",
    pending: 5000,
  },
  {
    name: "Nest Alpha",
    type: "Composition",
    curator: "Nest",
    price: 0.98,
    tvl: 2.4,
    apy: 9.8,
    drift: 0.02,
    rebalance: "2024-06-12",
    pending: 1200,
  },
  {
    name: "Nest Credit",
    type: "Composition",
    curator: "Nest",
    price: 1.05,
    tvl: 2.8,
    apy: 8.1,
    drift: -0.03,
    rebalance: "2024-06-10",
    pending: 7500,
  },
];

const activity = [
  { type: "Create vault", timestamp: "2024-06-01T12:00:00Z" },
  { type: "Buy asset", timestamp: "2024-06-03T09:00:00Z" },
  { type: "Sell asset", timestamp: "2024-06-06T15:30:00Z" },
  { type: "Update price", timestamp: "2024-06-08T11:45:00Z" },
];

export default function AdminPage() {
  const [filter, setFilter] = useState<"All" | "Asset" | "Composition">("All");
  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo(() => {
    return vaults.filter((v) => (filter === "All" ? true : v.type === filter));
  }, [filter]);

  const columns: ColumnDef<Vault>[] = [
    {
      accessorKey: "name",
      header: "Vault Name",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "curator",
      header: "Curator",
    },
    {
      accessorKey: "price",
      header: "Token Price",
      cell: ({ row }) => `$${row.getValue<number>("price").toFixed(2)}`,
    },
    {
      accessorKey: "tvl",
      header: "TVL",
      cell: ({ row }) => `$${row.getValue<number>("tvl").toLocaleString()}M`,
    },
    {
      accessorKey: "apy",
      header: "APY",
      cell: ({ row }) => `${row.getValue<number>("apy")}%`,
    },
    {
      accessorKey: "drift",
      header: "Drift",
      cell: ({ row }) => `${(row.getValue<number>("drift") * 100).toFixed(1)}%`,
    },
    {
      accessorKey: "rebalance",
      header: "Last Rebalance",
      cell: ({ row }) =>
        new Date(row.getValue<string>("rebalance")).toLocaleDateString(),
    },
    {
      accessorKey: "pending",
      header: "Pending Redemptions Volume",
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="shadow-none border bg-[#F5F5F5]">
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
                      <div className="flex items-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
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
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {activity.map((act, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span>
                  {new Date(act.timestamp).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
                <span>{act.type}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
