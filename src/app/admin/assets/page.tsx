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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
  SortingState,
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
  const [integratedData, setIntegratedData] = useState(integratedAssets);
  const [pendingData, setPendingData] = useState(pendingAssets);
  const data = view === "integrated" ? integratedData : pendingData;
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    priceSource: false,
    amountUsd: false,
    yieldReceived: false,
    yieldExpected: false,
    lastPaid: false,
    jurisdiction: false,
    legal: false,
    redemption: false,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<AssetEntry | null>(null);

  const headerCell = (label: string) =>
    // eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
    ({ column }: { column: any }) => (
      <button
        className="max-w-[12rem] truncate font-medium"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        {label}
      </button>
    );

  const columns: ColumnDef<AssetEntry>[] = [
    { accessorKey: "name", header: headerCell("Asset name") },
    { accessorKey: "issuer", header: headerCell("Issuer name") },
    {
      accessorKey: "price",
      header: headerCell("Asset price"),
      cell: ({ row }) => `$${row.getValue<number>("price").toFixed(2)}`,
    },
    {
      accessorKey: "priceSource",
      header: headerCell("Price source (URL)"),
      cell: ({ row }) => (
        <Link href={row.getValue<string>("priceSource")}>{"Source"}</Link>
      ),
    },
    { accessorKey: "amountNest", header: headerCell("Amount on Nest") },
    { accessorKey: "amountUsd", header: headerCell("Amount in USD") },
    {
      accessorKey: "estApy",
      header: headerCell("Estimated APY"),
      cell: ({ row }) => `${row.getValue<number>("estApy")}%`,
    },
    {
      accessorKey: "currApy",
      header: headerCell("Current APY"),
      cell: ({ row }) => `${row.getValue<number>("currApy")}%`,
    },
    {
      accessorKey: "apyDiff",
      header: headerCell("APY Difference"),
      cell: ({ row }) => `${row.getValue<number>("apyDiff")}%`,
    },
    { accessorKey: "yieldReceived", header: headerCell("Yield Received 30D") },
    { accessorKey: "yieldExpected", header: headerCell("Yield Expected 30D") },
    { accessorKey: "yieldCycle", header: headerCell("Yield Payout Cycle") },
    { accessorKey: "lastPaid", header: headerCell("Last Paid") },
    { accessorKey: "nextPayout", header: headerCell("Next Payout Date") },
    { accessorKey: "jurisdiction", header: headerCell("Jurisdiction") },
    { accessorKey: "legal", header: headerCell("Legal Structure") },
    { accessorKey: "redemption", header: headerCell("Redemption Duration") },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility, sorting },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const saveAsset = () => {
    if (editingIndex === null || !formData) return;
    const updater = (arr: AssetEntry[]) =>
      arr.map((a, i) => (i === editingIndex ? formData : a));
    if (view === "integrated") {
      setIntegratedData((d) => updater(d));
    } else {
      setPendingData((d) => updater(d));
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-6">
      <h1 className="text-2xl font-semibold">Assets</h1>
      <Tabs value={view} onValueChange={setView} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="integrated">Integrated</TabsTrigger>
            <TabsTrigger value="pending">To integrate</TabsTrigger>
          </TabsList>
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
                    onSelect={(e) => e.preventDefault()}
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <TabsContent value={view}>
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id} className="border-muted">
                    {hg.headers.map((header) => (
                      <TableHead key={header.id} className="max-w-[12rem] truncate">
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
                  <TableRow
                    key={row.id}
                    className="border-muted cursor-pointer"
                    onClick={() => {
                      setEditingIndex(row.index);
                      setFormData(row.original);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="max-w-[12rem] truncate whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={formData !== null} onOpenChange={(o) => !o && setFormData(null)}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Edit Asset</SheetTitle>
          </SheetHeader>
          {formData && (
            <form
              className="space-y-4 overflow-y-auto p-2"
              onSubmit={(e) => {
                e.preventDefault();
                saveAsset();
                setFormData(null);
              }}
            >
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <label className="block text-sm font-medium capitalize">
                    {key}
                  </label>
                  <Input
                    value={String(value)}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                  />
                </div>
              ))}
              <Button type="submit">Save</Button>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
