"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
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
  compositions: string;
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
    compositions: "Nest Credit",
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
    compositions: "Nest Alpha",
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
    compositions: "",
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

const categories: { title: string; keys: (keyof AssetEntry)[] }[] = [
  {
    title: "Basic Info",
    keys: ["name", "issuer", "price", "priceSource"],
  },
  {
    title: "Compositions",
    keys: ["compositions"],
  },
  {
    title: "Position",
    keys: ["amountNest", "amountUsd"],
  },
  {
    title: "Yield & Performance",
    keys: [
      "estApy",
      "currApy",
      "apyDiff",
      "yieldReceived",
      "yieldExpected",
      "yieldCycle",
      "lastPaid",
      "nextPayout",
    ],
  },
  {
    title: "Legal & Terms",
    keys: ["jurisdiction", "legal", "redemption"],
  },
];

const hiddenFields: (keyof AssetEntry)[] = [
  "amountNest",
  "amountUsd",
  "currApy",
  "apyDiff",
  "yieldReceived",
  "lastPaid",
  "nextPayout",
];

const integratedDefault: VisibilityState = {
  priceSource: false,
  amountUsd: false,
  estApy: false,
  yieldReceived: false,
  yieldExpected: false,
  yieldCycle: false,
  lastPaid: false,
  nextPayout: false,
  jurisdiction: false,
  legal: false,
  redemption: false,
};

const pendingDefault: VisibilityState = {
  price: false,
  priceSource: false,
  amountNest: false,
  amountUsd: false,
  currApy: false,
  apyDiff: false,
  yieldReceived: false,
  yieldExpected: false,
  yieldCycle: false,
  lastPaid: false,
  nextPayout: false,
  jurisdiction: false,
  legal: false,
};

export default function AssetsPage() {
  const [view, setView] = useState("integrated");
  const [integratedData, setIntegratedData] = useState(integratedAssets);
  const [pendingData, setPendingData] = useState(pendingAssets);
  const data = view === "integrated" ? integratedData : pendingData;

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    integratedDefault,
  );

  useEffect(() => {
    setColumnVisibility(view === "integrated" ? integratedDefault : pendingDefault);
  }, [view]);
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
    { accessorKey: "name", header: headerCell("Asset name"), meta: { label: "Asset name" } },
    { accessorKey: "issuer", header: headerCell("Issuer name"), meta: { label: "Issuer name" } },
    {
      accessorKey: "price",
      header: headerCell("Asset price"),
      meta: { label: "Asset price" },
      cell: ({ row }) => `$${row.getValue<number>("price").toFixed(2)}`,
    },
    {
      accessorKey: "priceSource",
      header: headerCell("Price source (URL)"),
      meta: { label: "Price source (URL)" },
      cell: ({ row }) => (
        <Link href={row.getValue<string>("priceSource")}>{"Source"}</Link>
      ),
    },
    { accessorKey: "compositions", header: headerCell("Compositions"), meta: { label: "Compositions" } },
    { accessorKey: "amountNest", header: headerCell("Amount on Nest"), meta: { label: "Amount on Nest" } },
    { accessorKey: "amountUsd", header: headerCell("Amount in USD"), meta: { label: "Amount in USD" } },
    {
      accessorKey: "estApy",
      header: headerCell("Estimated APY"),
      meta: { label: "Estimated APY" },
      cell: ({ row }) => `${row.getValue<number>("estApy")}%`,
    },
    {
      accessorKey: "currApy",
      header: headerCell("Current APY"),
      meta: { label: "Current APY" },
      cell: ({ row }) => `${row.getValue<number>("currApy")}%`,
    },
    {
      accessorKey: "apyDiff",
      header: headerCell("APY Difference"),
      meta: { label: "APY Difference" },
      cell: ({ row }) => `${row.getValue<number>("apyDiff")}%`,
    },
    { accessorKey: "yieldReceived", header: headerCell("Yield Received 30D"), meta: { label: "Yield Received 30D" } },
    { accessorKey: "yieldExpected", header: headerCell("Yield Expected 30D"), meta: { label: "Yield Expected 30D" } },
    { accessorKey: "yieldCycle", header: headerCell("Yield Payout Cycle"), meta: { label: "Yield Payout Cycle" } },
    { accessorKey: "lastPaid", header: headerCell("Last Paid"), meta: { label: "Last Paid" } },
    { accessorKey: "nextPayout", header: headerCell("Next Payout Date"), meta: { label: "Next Payout Date" } },
    { accessorKey: "jurisdiction", header: headerCell("Jurisdiction"), meta: { label: "Jurisdiction" } },
    { accessorKey: "legal", header: headerCell("Legal Structure"), meta: { label: "Legal Structure" } },
    { accessorKey: "redemption", header: headerCell("Redemption Duration"), meta: { label: "Redemption Duration" } },
  ];

  const labels: Record<keyof AssetEntry, string> = {
    name: "Asset name",
    issuer: "Issuer name",
    price: "Asset price",
    priceSource: "Price source (URL)",
    compositions: "Compositions",
    amountNest: "Amount on Nest",
    amountUsd: "Amount in USD",
    estApy: "Estimated APY",
    currApy: "Current APY",
    apyDiff: "APY Difference",
    yieldReceived: "Yield Received 30D",
    yieldExpected: "Yield Expected 30D",
    yieldCycle: "Yield Payout Cycle",
    lastPaid: "Last Paid",
    nextPayout: "Next Payout Date",
    jurisdiction: "Jurisdiction",
    legal: "Legal Structure",
    redemption: "Redemption Duration",
  };

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
    <div className="space-y-6">
      <Tabs value={view} onValueChange={setView} className="gap-0 space-y-0">
        <div className="flex items-center justify-between p-4">
          <TabsList>
            <TabsTrigger value="integrated">Integrated</TabsTrigger>
            <TabsTrigger value="pending">To integrate</TabsTrigger>
          </TabsList>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Columns</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {categories.map((cat) => (
                <div key={cat.title} className="space-y-1">
                  <DropdownMenuLabel className="font-semibold">
                    {cat.title}
                  </DropdownMenuLabel>
                  {cat.keys.map((k) => {
                    const column = table.getColumn(k);
                    if (!column) return null;
                    const label = labels[k];
                    return (
                      <DropdownMenuCheckboxItem
                        key={k}
                        checked={column.getIsVisible()}
                        onCheckedChange={column.toggleVisibility}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {label}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <TabsContent value={view}>
          <div className="w-full overflow-x-auto">
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
              {categories.map((cat) => (
                <div key={cat.title} className="space-y-2">
                  <h4 className="text-sm font-semibold">{cat.title}</h4>
                  {cat.keys
                    .filter((k) => !hiddenFields.includes(k))
                    .map((k) => {
                      const label = labels[k];
                      const value = formData[k];
                      return (
                        <div key={k} className="space-y-1">
                          <label className="block text-sm font-medium">
                            {label}
                          </label>
                          <Input
                            value={String(value)}
                            onChange={(e) =>
                              setFormData({ ...formData, [k]: e.target.value })
                            }
                          />
                        </div>
                      );
                    })}
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
