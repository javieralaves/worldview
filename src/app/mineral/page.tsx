"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TokenInput } from "@/components/token-input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/components/wallet-context";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link2 } from "lucide-react";
import { truncateAddress } from "@/lib/utils";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const tvlHistory = [
  { month: "Jan", tvl: 2 },
  { month: "Feb", tvl: 2.5 },
  { month: "Mar", tvl: 3 },
  { month: "Apr", tvl: 3.8 },
  { month: "May", tvl: 4.5 },
  { month: "Jun", tvl: 5 },
];

const performanceHistory = [
  { month: "Jan", apy: 7, price: 1 },
  { month: "Feb", apy: 7.5, price: 1.02 },
  { month: "Mar", apy: 8, price: 1.03 },
  { month: "Apr", apy: 8.3, price: 1.04 },
  { month: "May", apy: 8.5, price: 1.05 },
  { month: "Jun", apy: 8.7, price: 1.06 },
];

const tokenholders = [
  { address: "0x8f2A557b32bfb50a0529Fe49829D2268403406f1", balance: 1500 },
  { address: "0x4b3c845980b10703e7532a8DcE600b7B2F1C2A66", balance: 950 },
  { address: "0xAA1D84F2db4aF6e6424491bA7c7E5c3E785d8b8D", balance: 725 },
  { address: "0xFF9e35d1845e0b542dA0c4B9c0E8e079F06F4A79", balance: 450 },
  { address: "0x00BBa16A29d965F8F1d19089F9e3cF7AA02D2A42", balance: 100 },
  { address: "0x1122334455667788990011223344556677889900", balance: 90 },
  { address: "0xaabbccddeeff0011223344556677889900aabbcc", balance: 80 },
  { address: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef", balance: 70 },
  { address: "0x1234567890abcdef1234567890abcdef12345678", balance: 60 },
  { address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd", balance: 55 },
  { address: "0x9988776655443322110099887766554433221100", balance: 50 },
  { address: "0xfeefeefeefeefeefeefeefeefeefeefeefeefee", balance: 45 },
  { address: "0x0102030405060708090a0b0c0d0e0f1011121314", balance: 40 },
  { address: "0x1111111111111111111111111111111111111111", balance: 35 },
  { address: "0x2222222222222222222222222222222222222222", balance: 30 },
  { address: "0x3333333333333333333333333333333333333333", balance: 25 },
  { address: "0x4444444444444444444444444444444444444444", balance: 20 },
  { address: "0x5555555555555555555555555555555555555555", balance: 15 },
  { address: "0x6666666666666666666666666666666666666666", balance: 14 },
  { address: "0x7777777777777777777777777777777777777777", balance: 13 },
  { address: "0x8888888888888888888888888888888888888888", balance: 12 },
  { address: "0x9999999999999999999999999999999999999999", balance: 11 },
  { address: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", balance: 10 },
  { address: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", balance: 9 },
].sort((a, b) => b.balance - a.balance);

const now = Date.now();
const vaultTransactions = [
  {
    address: tokenholders[0].address,
    type: "Mint" as const,
    amount: 5000,
    timestamp: now - 36e5,
  },
  {
    address: tokenholders[1].address,
    type: "Redeem" as const,
    amount: 2500,
    timestamp: now - 72e5,
  },
  {
    address: tokenholders[2].address,
    type: "Mint" as const,
    amount: 1000,
    timestamp: now - 108e5,
  },
  {
    address: tokenholders[3].address,
    type: "Mint" as const,
    amount: 750,
    timestamp: now - 144e5,
  },
  {
    address: tokenholders[4].address,
    type: "Redeem" as const,
    amount: 600,
    timestamp: now - 180e5,
  },
];

type Tokenholder = (typeof tokenholders)[number];

const columns: ColumnDef<Tokenholder>[] = [
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="font-mono">
        {truncateAddress(row.getValue<string>("address"))}
      </div>
    ),
  },
  {
    accessorKey: "balance",
    header: () => <div className="text-right">Balance</div>,
    cell: ({ row }) => (
      <div className="text-right">
        {row.getValue<number>("balance").toLocaleString()} MNV
      </div>
    ),
  },
];

export default function VaultPage() {
  const { connected } = useWallet();
  const [tokenBalance, setTokenBalance] = useState(0);
  const [dollarBalance, setDollarBalance] = useState(0);
  const [pusdBalance, setPusdBalance] = useState(1000);
  const [stakeAmount, setStakeAmount] = useState("");
  const [redeemAmount, setRedeemAmount] = useState("");
  const [activeTab, setActiveTab] = useState("stake");
  const [stakeStep, setStakeStep] = useState<"idle" | "approving" | "approved" | "minting">("idle");
  const [redeemStep, setRedeemStep] = useState<"idle" | "approving" | "approved" | "redeeming">("idle");
  const [transactions, setTransactions] = useState<
    { type: "Mint" | "Redeem"; amount: number; timestamp: number }[]
  >([]);
  const price = performanceHistory[performanceHistory.length - 1].price;
  const currentApy = performanceHistory[performanceHistory.length - 1].apy;
  const tvl = tvlHistory[tvlHistory.length - 1].tvl;
  const tvlDelta =
    tvlHistory[tvlHistory.length - 1].tvl -
    tvlHistory[tvlHistory.length - 2].tvl;
  const apyDelta =
    performanceHistory[performanceHistory.length - 1].apy -
    performanceHistory[performanceHistory.length - 2].apy;
  const priceDelta =
    performanceHistory[performanceHistory.length - 1].price -
    performanceHistory[performanceHistory.length - 2].price;
  const stakeValue = parseFloat(stakeAmount) || 0;
  const stakeReceive = stakeValue ? stakeValue / price : 0;
  const redeemValue = parseFloat(redeemAmount) || 0;
  const burnAmount = redeemValue ? redeemValue / price : 0;
  const apy = performanceHistory[performanceHistory.length - 1].apy / 100;
  const monthlyEarnings = tokenBalance * price * apy * (30 / 365);
  const yearlyEarnings = tokenBalance * price * apy;
  const earningsProjection = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    earnings: ((i + 1) / 30) * monthlyEarnings,
  }));

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: tokenholders,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    setStakeStep("idle");
  }, [stakeAmount]);

  useEffect(() => {
    setRedeemStep("idle");
  }, [redeemAmount]);

  useEffect(() => {
    if (!tokenBalance) return;
    const id = setInterval(() => {
      // Increment a few cents per second so the balance visibly grows
      setDollarBalance((d) => d + 0.03);
    }, 1000);
    return () => clearInterval(id);
  }, [tokenBalance]);

  useEffect(() => {
    if (!connected) {
      setActiveTab("stake");
    }
  }, [connected]);

  function onStake(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = parseFloat(stakeAmount);
    if (stakeStep === "idle") {
      if (isNaN(value) || value <= 0 || value > pusdBalance) return;
      setStakeStep("approving");
      setTimeout(() => {
        setStakeStep("approved");
        toast.success("Access approved", {
          description: "You can now proceed to mint",
        });
      }, 2000);
      return;
    }
    if (stakeStep === "approved") {
      if (isNaN(value) || value <= 0 || value > pusdBalance) return;
        setStakeStep("minting");
        setTimeout(() => {
          const minted = value / price;
          setTokenBalance((t) => t + minted);
          setDollarBalance((d) => d + value);
          setPusdBalance((b) => b - value);
          setStakeAmount("");
          setStakeStep("idle");
          setActiveTab("stake");
          setTransactions((tx) => [
            ...tx,
            { type: "Mint", amount: value, timestamp: Date.now() },
          ]);
          toast.success("Mint completed", {
            description: "Vault tokens will arrive to your wallet shortly",
          });
        }, 2000);
      }
  }

  function onRedeem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = parseFloat(redeemAmount);
    if (redeemStep === "idle") {
      if (isNaN(value) || value <= 0) return;
      const burn = value / price;
      if (burn > tokenBalance) return;
      setRedeemStep("approving");
      setTimeout(() => {
        setRedeemStep("approved");
        toast.success("Access approved", {
          description: "You can now proceed to redeem",
        });
      }, 2000);
      return;
    }
    if (redeemStep === "approved") {
      if (isNaN(value) || value <= 0) return;
      const burn = value / price;
      if (burn > tokenBalance) return;
      setRedeemStep("redeeming");
      setTimeout(() => {
        setTokenBalance((t) => t - burn);
        setDollarBalance((d) => Math.max(d - value, 0));
        setPusdBalance((b) => b + value);
        setRedeemAmount("");
        setRedeemStep("idle");
        setActiveTab("stake");
        setTransactions((tx) => [
          ...tx,
          { type: "Redeem", amount: value, timestamp: Date.now() },
        ]);
        toast.success("Redemption completed", {
          description: "Funds will arrive to your wallet shortly",
        });
      }, 2000);
    }
  }

  return (
    <div className="p-6 md:p-10 grid md:grid-cols-[1fr_320px] gap-6 max-w-[1080px] mx-auto">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Mineral</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold">Mineral Vault (MNV)</h1>
          <p className="text-muted-foreground">
            Tokenized exposure to royalty fees from U.S. mineral and oil extraction.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              toast.success("Copied to clipboard")
            }}
          >
            <Link2 /> Share
          </Button>
          <div className="flex flex-col sm:flex-row gap-6 my-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">TVL</div>
              <div className="text-3xl font-bold">{`$${tvl.toLocaleString()}M`}</div>
              <div
                className={`text-sm ${
                  tvlDelta >= 0 ? "text-green-500" : "text-muted-foreground"
                }`}
              >
                {`${tvlDelta >= 0 ? "+" : ""}${tvlDelta.toFixed(1)}M in the past 7 days`}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Price</div>
              <div className="text-3xl font-bold">{`$${price.toFixed(2)}`}</div>
              <div
                className={`text-sm ${
                  priceDelta >= 0 ? "text-green-500" : "text-muted-foreground"
                }`}
              >
                {`${priceDelta >= 0 ? "+" : ""}$${priceDelta.toFixed(2)} in the past 7 days`}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">APY</div>
              <div className="text-3xl font-bold">{currentApy}%</div>
              <div
                className={`text-sm ${
                  apyDelta >= 0 ? "text-green-500" : "text-muted-foreground"
                }`}
              >
                {`${apyDelta >= 0 ? "+" : ""}${apyDelta.toFixed(1)}% in the past 7 days`}
              </div>
            </div>
          </div>
        </div>



        <Tabs defaultValue="overview" className="flex flex-col gap-6">
          <TabsList className="mb-4">
            {connected && tokenBalance > 0 && (
              <TabsTrigger value="position">My Position</TabsTrigger>
            )}
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="risk">Risk</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {connected && tokenBalance > 0 && (
            <TabsContent value="position" className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Balance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-2xl font-bold">
                    {"$" + dollarBalance.toFixed(2)}
                    <span className="animate-pulse rounded-full bg-green-500 size-2" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tokenBalance.toFixed(2)} MNV
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Projection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsAreaChart
                      data={earningsProjection}
                      margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="earnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--green-500))" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="hsl(var(--green-500))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--popover))",
                          borderColor: "hsl(var(--border))",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="earnings"
                        stroke="hsl(var(--green-500))"
                        fill="url(#earnings)"
                      />
                    </RechartsAreaChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Projected 30d earnings</span>
                      <span>{`$${monthlyEarnings.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Projected 1y earnings</span>
                      <span>{`$${yearlyEarnings.toFixed(2)}`}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {transactions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Transactions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-muted">
                        <TableRow className="border-muted">
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Amount (pUSD)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions
                          .slice()
                          .sort((a, b) => b.timestamp - a.timestamp)
                          .map((tx, i) => (
                            <TableRow key={i} className="border-muted">
                              <TableCell>
                                {new Date(tx.timestamp).toLocaleString(undefined, {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })}
                              </TableCell>
                              <TableCell>{tx.type}</TableCell>
                              <TableCell className="text-right">
                                {tx.amount.toLocaleString()} pUSD
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          <TabsContent value="overview" className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Issuer:</strong> Resource Minerals LLC
                </div>
                <div>
                  <strong>Current Yield (APY):</strong> 8.7% net of fees
                </div>
                <div>
                  <strong>Redemption timeline:</strong> 10 day cooldown
                </div>
                <div>
                  <strong>Underlying asset:</strong> Rights to royalty payments from mineral and oil extraction on U.S. land
                </div>
                <div>
                  <strong>Risk Level:</strong> BBB equivalent – moderate credit risk
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Value Locked</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-3xl font-bold">{`$${tvl.toLocaleString()}M`}</div>
                  <div
                    className={`text-sm ${
                      tvlDelta >= 0 ? "text-green-500" : "text-muted-foreground"
                    }`}
                  >
                    {`${tvlDelta >= 0 ? "+" : ""}${tvlDelta.toFixed(1)}M in the past 7 days`}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsAreaChart data={tvlHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="tvl" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--green-500))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--green-500))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip contentStyle={{background:"hsl(var(--popover))",borderColor:"hsl(var(--border))",color:"hsl(var(--popover-foreground))"}} labelStyle={{color:"hsl(var(--popover-foreground))"}} />
                    <Area type="monotone" dataKey="tvl" stroke="hsl(var(--green-500))" fill="url(#tvl)" />
                  </RechartsAreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historical Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="apy" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="apy">APY</TabsTrigger>
                    <TabsTrigger value="price">Price</TabsTrigger>
                  </TabsList>
                  <TabsContent value="apy" className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-3xl font-bold">{currentApy}%</div>
                      <div
                        className={`text-sm ${
                          apyDelta >= 0 ? "text-green-500" : "text-muted-foreground"
                        }`}
                      >
                        {`${apyDelta >= 0 ? "+" : ""}${apyDelta.toFixed(1)}% in the past 7 days`}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsAreaChart
                        data={performanceHistory}
                        margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="apy" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor="hsl(var(--green-500))"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="hsl(var(--green-500))"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip contentStyle={{background:"hsl(var(--popover))",borderColor:"hsl(var(--border))",color:"hsl(var(--popover-foreground))"}} labelStyle={{color:"hsl(var(--popover-foreground))"}} />
                        <Area
                          type="monotone"
                          dataKey="apy"
                          stroke="hsl(var(--green-500))"
                          fill="url(#apy)"
                        />
                      </RechartsAreaChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  <TabsContent value="price" className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-3xl font-bold">{`$${price.toFixed(2)}`}</div>
                      <div
                        className={`text-sm ${
                          priceDelta >= 0 ? "text-green-500" : "text-muted-foreground"
                        }`}
                      >
                        {`${priceDelta >= 0 ? "+" : ""}$${priceDelta.toFixed(2)} in the past 7 days`}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsAreaChart
                        data={performanceHistory}
                        margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="price" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor="hsl(var(--green-500)/0.5)"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="hsl(var(--green-500)/0.5)"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip contentStyle={{background:"hsl(var(--popover))",borderColor:"hsl(var(--border))",color:"hsl(var(--popover-foreground))"}} labelStyle={{color:"hsl(var(--popover-foreground))"}} />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="hsl(var(--green-500)/0.5)"
                          fill="url(#price)"
                        />
                      </RechartsAreaChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Transparency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Legal & custodial structure:</strong> Delaware statutory trust, assets held with Wells Fargo as custodian
                </div>
                <div>
                  <strong>Asset pricing source:</strong> Monthly appraisal by third-party valuation agent
                </div>
                <div>
                  <strong>Vault token:</strong> 0xMineralTokenAddress (ERC-20, 18 decimals)
                  {" "}
                  <a href="#" className="underline">Explorer</a>
                </div>
                <div>
                  <strong>Fee structure:</strong> 1% management, 10% performance, 0.5% redemption
                </div>
                <div>
                  <strong>Due diligence docs:</strong> <a href="#" className="underline">Full package</a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow className="border-muted">
                      <TableHead>Date</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount (pUSD)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vaultTransactions
                      .slice()
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .map((tx, i) => (
                        <TableRow key={i} className="border-muted">
                          <TableCell>
                            {new Date(tx.timestamp).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarFallback>
                                  {tx.address.slice(2, 4).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-mono">
                                {truncateAddress(tx.address)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{tx.type}</TableCell>
                          <TableCell className="text-right">
                            {tx.amount.toLocaleString()} pUSD
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{`Tokenholders (${tokenholders.length})`}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow
                        key={headerGroup.id}
                        className="border-muted"
                      >
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className={header.column.id === "balance" ? "text-right" : undefined}>
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
                          <TableCell key={cell.id} className={cell.column.id === "balance" ? "text-right" : ""}>
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
                <div className="flex items-center justify-end space-x-2 p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-6 sticky top-6 h-fit">
        <Card>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="stake">Stake</TabsTrigger>
                <TabsTrigger value="redeem">Redeem</TabsTrigger>
              </TabsList>
              <TabsContent value="stake">
                <form className="space-y-4" onSubmit={onStake}>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <TokenInput
                      id="amount"
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0"
                      token="pUSD"
                      usdValue={stakeValue}
                      balance={connected ? pusdBalance : undefined}
                      onMax={
                        connected
                          ? () => setStakeAmount(pusdBalance.toString())
                          : undefined
                      }
                      disabled={!connected}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receive">Receive</Label>
                    <TokenInput
                      id="receive"
                      type="text"
                      readOnly
                      value={stakeAmount ? stakeReceive.toFixed(2) : ""}
                      token="MNV"
                      usdValue={stakeValue}
                      disabled={!connected}
                    />
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exchange rate</span>
                      <span className="text-right">{`1 MNV = $${price.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Staking fee</span>
                      <span className="text-right">Free for now</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Redemption term</span>
                      <span className="text-right">10 day cooldown</span>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!connected || stakeStep === "approving" || stakeStep === "minting"}
                  >
                    {stakeStep === "approving"
                      ? "Approving"
                      : stakeStep === "approved"
                      ? "Mint"
                      : stakeStep === "minting"
                      ? "Minting"
                      : stakeAmount
                      ? "Approve access"
                      : "Stake"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="redeem">
                <form className="space-y-4" onSubmit={onRedeem}>
                  <div className="space-y-2">
                    <Label htmlFor="redeem">Amount</Label>
                    <TokenInput
                      id="redeem"
                      type="number"
                      value={redeemAmount}
                      onChange={(e) => setRedeemAmount(e.target.value)}
                      placeholder="0"
                      token="pUSD"
                      usdValue={redeemValue}
                      onMax={() =>
                        setRedeemAmount((tokenBalance * price).toString())
                      }
                      disabled={!connected}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="burn">Burn</Label>
                    <TokenInput
                      id="burn"
                      type="text"
                      readOnly
                      value={redeemAmount ? burnAmount.toFixed(2) : ""}
                      token="MNV"
                      usdValue={redeemValue}
                      balance={connected ? tokenBalance : undefined}
                      disabled={!connected}
                    />
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exchange rate</span>
                      <span className="text-right">{`1 MNV = $${price.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Redemption fee</span>
                      <span className="text-right">0.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Receive by</span>
                      <span className="text-right">
                        {new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!connected || redeemStep === "approving" || redeemStep === "redeeming"}
                  >
                    {redeemStep === "approving"
                      ? "Approving"
                      : redeemStep === "approved"
                      ? "Redeem"
                      : redeemStep === "redeeming"
                      ? "Redeeming"
                      : redeemAmount
                      ? "Approve access"
                      : "Redeem"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
