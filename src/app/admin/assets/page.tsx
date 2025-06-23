"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
import type { AssetEntry } from "./data";
import { integratedAssets, pendingAssets } from "./data";

const categories: { title: string; keys: (keyof AssetEntry)[] }[] = [
  {
    title: "Basic Info",
    keys: ["name", "ticker", "contract", "issuer", "price", "priceSource"],
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
  {
    title: "Risk",
    keys: ["riskScore"],
  },
];

const hiddenFields: (keyof AssetEntry)[] = [
  "ticker",
  "contract",
  "amountNest",
  "amountUsd",
  "currApy",
  "apyDiff",
  "yieldReceived",
  "lastPaid",
  "nextPayout",
  "riskScore",
];

const integratedDefault: VisibilityState = {
  ticker: false,
  contract: false,
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
  riskScore: true,
};

const pendingDefault: VisibilityState = {
  ticker: false,
  contract: false,
  price: false,
  priceSource: false,
  compositions: false,
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
  riskScore: false,
};

export default function AssetsPage() {
  const [view, setView] = useState("integrated");
  const [integratedData, setIntegratedData] = useState(integratedAssets);
  const [pendingData, setPendingData] = useState(pendingAssets);
  const data = view === "integrated" ? integratedData : pendingData;
  const router = useRouter();

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
    { accessorKey: "ticker", header: headerCell("Ticker"), meta: { label: "Ticker" } },
    { accessorKey: "contract", header: headerCell("Contract"), meta: { label: "Contract" } },
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
    { accessorKey: "riskScore", header: headerCell("Tokenized Risk Score"), meta: { label: "Tokenized Risk Score" }, cell: ({ row }) => row.getValue<number>("riskScore").toFixed(1) },
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
    {
      id: "edit",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setEditingIndex(row.index);
            setFormData(row.original);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  const labels: Partial<Record<keyof AssetEntry, string>> = {
    name: "Asset name",
    ticker: "Ticker",
    contract: "Contract",
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
    scorecard: "Scorecard",
    underwriter: "Underwriter",
    riskScore: "Tokenized Risk Score",
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
    <div className="p-6 md:p-10 space-y-6 w-full flex-1">
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
                    onClick={() => router.push(`/admin/assets/${row.original.ticker}`)}
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
