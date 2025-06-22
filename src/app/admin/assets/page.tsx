"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

interface AssetEntry {
  name: string;
  issuer: string;
  price: number;
  priceSource: string;
  amountNest: number;
  amountUsd: number;
  estApy: number;
  currApy: number;
  apyDiff: number;
  yieldReceived: number;
  yieldExpected: number;
  yieldCycle: string;
  lastPaid: string;
  nextPayout: string;
  jurisdiction: string;
  legal: string;
  redemption: string;
}

const integratedAssets: AssetEntry[] = [
  {
    name: "Mineral Vault",
    issuer: "Mineral",
    price: 1.23,
    priceSource: "https://example.com/mineral",
    amountNest: 50000,
    amountUsd: 61500,
    estApy: 8.7,
    currApy: 8.5,
    apyDiff: -0.2,
    yieldReceived: 5000,
    yieldExpected: 5200,
    yieldCycle: "Monthly",
    lastPaid: "2024-06-01",
    nextPayout: "2024-07-01",
    jurisdiction: "US",
    legal: "SPV",
    redemption: "7 days",
  },
  {
    name: "iSNR",
    issuer: "Invesco",
    price: 1.08,
    priceSource: "https://example.com/isnr",
    amountNest: 30000,
    amountUsd: 32400,
    estApy: 6.0,
    currApy: 6.1,
    apyDiff: 0.1,
    yieldReceived: 2500,
    yieldExpected: 2400,
    yieldCycle: "Quarterly",
    lastPaid: "2024-05-15",
    nextPayout: "2024-08-15",
    jurisdiction: "US",
    legal: "Reg D",
    redemption: "14 days",
  },
];

const pendingAssets: AssetEntry[] = [
  {
    name: "mBASIS",
    issuer: "M DAO",
    price: 0.92,
    priceSource: "https://example.com/mbasis",
    amountNest: 0,
    amountUsd: 0,
    estApy: 7.1,
    currApy: 0,
    apyDiff: 0,
    yieldReceived: 0,
    yieldExpected: 0,
    yieldCycle: "Monthly",
    lastPaid: "-",
    nextPayout: "-",
    jurisdiction: "SG",
    legal: "DAO",
    redemption: "-",
  },
];

export default function AssetsPage() {
  const [view, setView] = useState("integrated");
  const data = view === "integrated" ? integratedAssets : pendingAssets;
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns: ColumnDef<AssetEntry>[] = [
    { accessorKey: "name", header: "Asset name" },
    { accessorKey: "issuer", header: "Issuer name" },
    {
      accessorKey: "price",
      header: "Asset price",
      cell: ({ row }) => `$${row.getValue<number>("price").toFixed(2)}`,
    },
    {
      accessorKey: "priceSource",
      header: "Price source (URL)",
      cell: ({ row }) => (
        <Link href={row.getValue<string>("priceSource")}>{"Source"}</Link>
      ),
    },
    { accessorKey: "amountNest", header: "Amount on Nest" },
    { accessorKey: "amountUsd", header: "Amount in USD" },
    {
      accessorKey: "estApy",
      header: "Estimated APY",
      cell: ({ row }) => `${row.getValue<number>("estApy")}%`,
    },
    {
      accessorKey: "currApy",
      header: "Current APY",
      cell: ({ row }) => `${row.getValue<number>("currApy")}%`,
    },
    {
      accessorKey: "apyDiff",
      header: "APY Difference",
      cell: ({ row }) => `${row.getValue<number>("apyDiff")}%`,
    },
    { accessorKey: "yieldReceived", header: "Yield Received 30D" },
    { accessorKey: "yieldExpected", header: "Yield Expected 30D" },
    { accessorKey: "yieldCycle", header: "Yield Payout Cycle" },
    { accessorKey: "lastPaid", header: "Last Paid" },
    { accessorKey: "nextPayout", header: "Next Payout Date" },
    { accessorKey: "jurisdiction", header: "Jurisdiction" },
    { accessorKey: "legal", header: "Legal Structure" },
    { accessorKey: "redemption", header: "Redemption Duration" },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6 md:p-10 space-y-8">
      <Tabs value={view} onValueChange={setView} className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="integrated">Integrated</TabsTrigger>
          <TabsTrigger value="pending">To integrate</TabsTrigger>
        </TabsList>
        <TabsContent value={view}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Assets</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Columns</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table.getAllLeafColumns().map((column) => {
                    const label = column.columnDef.header as string;
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={column.toggleVisibility}
                      >
                        {label}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted">
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id} className="border-muted">
                      {hg.headers.map((header) => (
                        <TableHead key={header.id}>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
