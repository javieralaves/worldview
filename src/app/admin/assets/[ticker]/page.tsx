"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";
import type { AssetEntry } from "../data";
import { integratedAssets, pendingAssets } from "../data";

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

const riskBreakdown = [
  {
    title: "Assets",
    factors: [
      { label: "Diversification", score: 3 },
      { label: "Portfolio Quality", score: 4 },
      { label: "Liquidity", score: 3 },
      { label: "Counterparty Concentration", score: 3 },
      { label: "Counterparty Quality", score: 3 },
      { label: "Base Currency Risk", score: 2 },
    ],
  },
  {
    title: "Capital",
    factors: [
      { label: "Cash Flow Leverage", score: 3 },
      { label: "Balance Sheet Leverage", score: 3 },
      { label: "Seniority", score: 4 },
      { label: "Quality of Outside Capital", score: 3 },
      { label: "Systemic Importance", score: 2 },
    ],
  },
  {
    title: "Quality",
    factors: [
      { label: "ROC/Track Record", score: 3 },
      { label: "Retention Rates / Customer Stickiness", score: 3 },
      { label: "Historical Trending CAGRs", score: 3 },
      { label: "Cash Flow", score: 3 },
      { label: "Pricing Power", score: 3 },
      { label: "Business Competitiveness and Strategy", score: 3 },
      { label: "Complexity", score: 2 },
    ],
  },
  {
    title: "Management",
    factors: [
      { label: "Incentive Alignment", score: 3 },
      { label: "Legacy/Reputation/Franchise Position", score: 3 },
      { label: "Intangibles", score: 3 },
      { label: "Transparency", score: 3 },
      { label: "Consistency of Reporting", score: 3 },
      { label: "Opacity of Reports", score: 2 },
      { label: "Excess Reports", score: 3 },
    ],
  },
];

export default function AssetPage({ params }: { params: { ticker: string } }) {
  const asset = [...integratedAssets, ...pendingAssets].find(
    (a) => a.ticker.toLowerCase() === params.ticker.toLowerCase(),
  );
  const router = useRouter();
  const [editingField, setEditingField] = useState<keyof AssetEntry | null>(null);
  const [formData, setFormData] = useState<AssetEntry | null>(asset || null);

  if (!asset || !formData) {
    return (
      <div className="p-6 md:p-10">
        <p>Asset not found.</p>
      </div>
    );
  }

  const labels: Record<keyof AssetEntry, string> = {
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
  };

  const groups: { title: string; keys: (keyof AssetEntry)[] }[] = [
    { title: "Basic Info", keys: ["issuer", "contract", "price", "priceSource"] },
    { title: "Position", keys: ["amountNest", "amountUsd"] },
    { title: "Yield Terms", keys: ["yieldCycle", "lastPaid", "nextPayout"] },
    { title: "Legal", keys: ["jurisdiction", "legal", "redemption"] },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8">
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
        <div>
          <h1 className="text-2xl font-medium">{asset.name}</h1>
          <p className="text-muted-foreground">{asset.ticker}</p>
        </div>
        <div className="ml-auto">
          <Button onClick={() => router.push(`/admin/assets`)}>Back</Button>
        </div>
      </div>

      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
        </TabsList>
        <TabsContent value="charts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>TVL on Nest</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsAreaChart data={tvlHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsAreaChart data={apyHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <RechartsTooltip
                    contentStyle={{ background: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                  />
                  <Area type="monotone" dataKey="apy" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
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
            <CardContent>
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
                      <div>{formData[k]}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingField(k)}
                      className="size-6"
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="risk" className="space-y-6">
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
                const input = form.elements.namedItem("value") as HTMLInputElement;
                setFormData({ ...formData, [editingField]: input.value });
                setEditingField(null);
              }}
            >
              <Input name="value" defaultValue={String(formData[editingField])} />
              <Button type="submit">Save</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
