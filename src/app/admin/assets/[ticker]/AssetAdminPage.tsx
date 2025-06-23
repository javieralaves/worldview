"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ReferenceLine,
} from "recharts";
import type { AssetEntry } from "../data";

const assetIcons: Record<string, string> = {
  MNRL: "/tokens/mineral-vault.svg",
  iSNR: "/tokens/invesco-isnr.svg",
  MBASIS: "/tokens/mbasis.svg",
};

const tvlHistory = [
  { month: "Jan", tvl: 2 },
  { month: "Feb", tvl: 2.5 },
  { month: "Mar", tvl: 3 },
  { month: "Apr", tvl: 3.8 },
  { month: "May", tvl: 4.5 },
  { month: "Jun", tvl: 5 },
];

const tvlHistoryUsd = tvlHistory.map((d) => ({ month: d.month, tvl: d.tvl * 10 }));

const apyHistory = [
  { month: "Jan", apy: 7 },
  { month: "Feb", apy: 7.5 },
  { month: "Mar", apy: 8 },
  { month: "Apr", apy: 8.3 },
  { month: "May", apy: 8.5 },
  { month: "Jun", apy: 8.7 },
];

const priceHistory = [
  { month: "Jan", price: 1 },
  { month: "Feb", price: 1.02 },
  { month: "Mar", price: 1.03 },
  { month: "Apr", price: 1.04 },
  { month: "May", price: 1.05 },
  { month: "Jun", price: 1.06 },
];

const activityHistory = [
  { date: "2024-01-15", amount: 1000 },
  { date: "2024-02-15", amount: 900 },
  { date: "2024-03-15", amount: 1100 },
  { date: "2024-04-15", amount: 950 },
];

const riskBreakdown = [
  {
    title: "Assets",
    weight: 0.25,
    factors: [
      { label: "Diversification", score: 3, weight: 0.2 },
      { label: "Portfolio Quality", score: 4, weight: 0.25 },
      { label: "Liquidity", score: 3, weight: 0.25 },
      { label: "Counterparty Concentration", score: 3, weight: 0.1 },
      { label: "Counterparty Quality", score: 3, weight: 0.1 },
      { label: "Base Currency Risk", score: 2, weight: 0.1 },
    ],
  },
  {
    title: "Capital",
    weight: 0.25,
    factors: [
      { label: "Cash Flow Leverage", score: 3, weight: 0.25 },
      { label: "Balance Sheet Leverage", score: 3, weight: 0.25 },
      { label: "Seniority", score: 4, weight: 0.25 },
      { label: "Quality of Outside Capital", score: 3, weight: 0.15 },
      { label: "Systemic Importance", score: 2, weight: 0.1 },
    ],
  },
  {
    title: "Quality",
    weight: 0.2,
    factors: [
      { label: "ROC/Track Record", score: 3, weight: 0.15 },
      { label: "Retention Rates / Customer Stickiness", score: 3, weight: 0.2 },
      { label: "Historical Trending CAGRs", score: 3, weight: 0.05 },
      { label: "Cash Flow", score: 3, weight: 0.2 },
      { label: "Pricing Power", score: 3, weight: 0.15 },
      { label: "Business Competitiveness and Strategy", score: 3, weight: 0.15 },
      { label: "Complexity", score: 2, weight: 0.1 },
    ],
  },
  {
    title: "Management",
    weight: 0.3,
    factors: [
      { label: "Incentive Alignment", score: 3, weight: 0.15 },
      { label: "Legacy/Reputation/Franchise Position", score: 3, weight: 0.1 },
      { label: "Intangibles", score: 3, weight: 0.1 },
      { label: "Transparency", score: 3, weight: 0.1 },
      { label: "Consistency of Reporting", score: 3, weight: 0.2 },
      { label: "Opacity of Reports", score: 2, weight: 0.2 },
      { label: "Excess Reports", score: 3, weight: 0.15 },
    ],
  },
];

const categoryScores = riskBreakdown.map((cat) => {
  const score = cat.factors.reduce(
    (s, f) => s + f.score * f.weight,
    0,
  );
  return { title: cat.title, score, weight: cat.weight };
});

const totalRiskScore = categoryScores.reduce(
  (s, c) => s + c.score * c.weight,
  0,
);

export default function AssetAdminPage({ asset }: { asset: AssetEntry }) {
  const [editingField, setEditingField] = useState<keyof AssetEntry | null>(null);
  const [formData, setFormData] = useState<AssetEntry>(asset);
  const [tvlView, setTvlView] = useState<"asset" | "usd">("asset");
  const handleTvlViewChange = (value: string) => {
    setTvlView(value as "asset" | "usd");
  };

  const latestTvl = (tvlView === "usd" ? tvlHistoryUsd : tvlHistory)[tvlHistory.length - 1].tvl;
  const latestApy = apyHistory[apyHistory.length - 1].apy;
  const latestPrice = priceHistory[priceHistory.length - 1].price;

  const labels: Partial<Record<keyof AssetEntry, string>> = {
    name: "Asset name",
    ticker: "Ticker",
    contract: "Contract",
    issuer: "Issuer name",
    price: "Asset price",
    priceSource: "Price source",
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
    status: "Status",
    riskScore: "Tokenized Risk Score",
    custodian: "Custodian",
  };

  const groups: { title: string; keys: (keyof AssetEntry)[] }[] = [
    { title: "Basic Info", keys: ["issuer", "contract", "price", "priceSource"] },
    { title: "Position", keys: ["amountNest", "amountUsd"] },
    { title: "Yield Terms", keys: ["yieldCycle", "lastPaid", "nextPayout"] },
    { title: "Legal", keys: ["jurisdiction", "legal", "redemption"] },
  ];

  const readOnlyFields: (keyof AssetEntry)[] = [
    "price",
    "amountNest",
    "amountUsd",
    "lastPaid",
    "nextPayout",
  ];

  return (
    <div className="p-6 md:p-10 w-full">
      <div className="mx-auto max-w-5xl space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/assets">Assets</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{asset.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-4">
        <img src={assetIcons[asset.ticker] || "/tokens/nest-alpha.svg"} alt="" className="size-12" />
        <div className="space-y-1">
          <h1 className="text-2xl font-medium">{asset.name}</h1>
          <p className="text-muted-foreground">{asset.ticker}</p>
          <div className="flex items-center gap-1 text-sm">
            <span className={`size-2 rounded-full ${asset.status === "Completed" ? "bg-green-500" : "bg-yellow-500"}`} />
            {asset.status}
          </div>
        </div>
      </div>

      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="charts" className="space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>{`${asset.ticker} on Nest`}</CardTitle>
              <Tabs value={tvlView} onValueChange={handleTvlViewChange} className="ml-auto">
                <TabsList>
                  <TabsTrigger value="asset">{asset.ticker}</TabsTrigger>
                  <TabsTrigger value="usd">USD</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-medium">
                {tvlView === "usd" ? `$${latestTvl.toLocaleString()}` : latestTvl}
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsAreaChart data={tvlView === 'usd' ? tvlHistoryUsd : tvlHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <RechartsTooltip
                    contentStyle={{ background: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                  />
                  <Area type="monotone" dataKey="tvl" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                </RechartsAreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Historical APY</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-medium">{latestApy}%</div>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsAreaChart data={apyHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <RechartsTooltip
                    contentStyle={{ background: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                  />
                  <Area type="monotone" dataKey="apy" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                  <ReferenceLine y={asset.estApy} strokeDasharray="4 4" stroke="hsl(var(--muted-foreground))" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                </RechartsAreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Historical Price</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-medium">{`$${latestPrice.toFixed(2)}`}</div>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsAreaChart data={priceHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <RechartsTooltip
                    contentStyle={{ background: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                  />
                  <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                </RechartsAreaChart>
              </ResponsiveContainer>
              <div className="text-right text-sm mt-2">
                Source: <Link href={asset.priceSource}>{asset.priceSource}</Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="info" className="space-y-6">
          {groups.map((group) => (
            <Card key={group.title} className="shadow-none">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{group.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 sm:grid-cols-2">
                {group.keys.map((k) => (
                  <div key={k} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">{labels[k]}</div>
                      <div>{String(formData[k])}</div>
                    </div>
                    {!readOnlyFields.includes(k) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingField(k)}
                        className="size-6"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Custody</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Custodian:</strong> {asset.custodian}
              </div>
              {asset.attestationHistory.length > 0 && (
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow className="border-muted">
                      <TableHead>Date</TableHead>
                      <TableHead>Summary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {asset.attestationHistory.map((a, i) => (
                      <TableRow key={i} className="border-muted">
                        <TableCell>{a.date}</TableCell>
                        <TableCell>{a.summary}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {asset.allocations && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Vault Allocations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow className="border-muted">
                      <TableHead>Vault</TableHead>
                      <TableHead className="text-right">Amount in USD</TableHead>
                      <TableHead className="text-right">Allocation %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {asset.allocations.map((a, i) => (
                      <TableRow key={i} className="border-muted">
                        <TableCell>{a.vault}</TableCell>
                        <TableCell className="text-right">{a.amountUsd.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{a.allocationPct}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="risk" className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Tokenized risk score</span>
              <span className="text-xl">{totalRiskScore.toFixed(2)}/5</span>
            </div>
            <div className="text-sm">
              <Link href={asset.scorecard} className="underline mr-2">
                Scorecard
              </Link>
              Underwriter: {asset.underwriter}
            </div>
          </div>
          {categoryScores.map((cat) => (
            <div key={cat.title} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{cat.title}</span>
                <span>{cat.score.toFixed(2)}/5</span>
              </div>
              <Progress value={cat.score * 20} />
            </div>
          ))}
          {riskBreakdown.map((section) => (
            <Card key={section.title} className="shadow-none">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {section.factors.map((f) => (
                  <div key={f.label} className="flex justify-between text-sm">
                    <span>{f.label}</span>
                    <span>{f.score}/5</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Yield payouts</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow className="border-muted">
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityHistory.map((a, i) => (
                    <TableRow key={i} className="border-muted">
                      <TableCell>{a.date}</TableCell>
                      <TableCell className="text-right">{a.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={editingField !== null} onOpenChange={(o) => !o && setEditingField(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingField ? `Edit ${labels[editingField]}` : ""}</DialogTitle>
          </DialogHeader>
          {editingField && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!editingField) return;
                const form = e.target as HTMLFormElement;
                let value = "";
                if (editingField === "priceSource") {
                  const input = form.elements.namedItem("value") as HTMLInputElement;
                  value = `https://${input.value}`;
                } else if (editingField === "yieldCycle") {
                  const qty = form.elements.namedItem("quantity") as HTMLInputElement;
                  const period = form.elements.namedItem("period") as HTMLSelectElement;
                  value = `${qty.value} ${period.value === "weeks" ? "weeks" : "months"}`;
                } else if (editingField === "redemption") {
                  const qty = form.elements.namedItem("quantity") as HTMLInputElement;
                  const period = form.elements.namedItem("period") as HTMLSelectElement;
                  value = `${qty.value} ${period.value}`;
                } else {
                  const input = form.elements.namedItem("value") as HTMLInputElement;
                  value = input.value;
                }
                setFormData({ ...formData, [editingField]: value });
                setEditingField(null);
              }}
            >
              {editingField === "priceSource" && (
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 px-2 text-sm text-muted-foreground bg-muted">
                    https://
                  </span>
                  <Input name="value" defaultValue={formData.priceSource.replace(/^https?:\/\//, "")} className="rounded-l-none" />
                </div>
              )}
              {editingField === "yieldCycle" && (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    name="quantity"
                    defaultValue={parseInt(formData.yieldCycle) || 1}
                    className="w-20"
                  />
                  <select name="period" defaultValue={formData.yieldCycle.includes("Week") || formData.yieldCycle.includes("week") ? "weeks" : "months"} className="border rounded-md px-2">
                    <option value="weeks">Weekly</option>
                    <option value="months">Monthly</option>
                  </select>
                </div>
              )}
              {editingField === "redemption" && (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    name="quantity"
                    defaultValue={parseInt(formData.redemption) || 0}
                    className="w-20"
                  />
                  <select name="period" defaultValue={(formData.redemption.split(" ")[1] ?? "days").toLowerCase()} className="border rounded-md px-2">
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              )}
              {editingField !== "priceSource" &&
                editingField !== "yieldCycle" &&
                editingField !== "redemption" && (
                  <Input name="value" defaultValue={String(formData[editingField])} />
                )}
              <Button type="submit">Save</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
