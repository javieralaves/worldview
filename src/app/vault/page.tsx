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
import { Button } from "@/components/ui/button";
import { TokenInput } from "@/components/token-input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/components/wallet-context";
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
].sort((a, b) => b.balance - a.balance);

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
    if (!connected && activeTab === "balance") {
      setActiveTab("stake");
    }
  }, [connected, activeTab]);

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
          setActiveTab("balance");
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
        setActiveTab("balance");
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
    <div className="p-6 md:p-10 grid md:grid-cols-[1fr_320px] gap-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Mineral Vault (MNV)</h1>
          <p className="text-muted-foreground">
            Tokenized exposure to royalty fees from U.S. mineral and oil extraction.
          </p>
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

        <Card>
          <CardHeader>
            <CardTitle>Total Value Locked</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">{`$${tvl.toLocaleString()}M`}</div>
            <div
              className={`text-sm ${
                tvlDelta >= 0 ? "text-green-500" : "text-muted-foreground"
              }`}
            >
              {`${tvlDelta >= 0 ? "+" : ""}${tvlDelta.toFixed(1)}M in the past 7 days`}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsAreaChart data={tvlHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tvl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Area type="monotone" dataKey="tvl" stroke="hsl(var(--primary))" fill="url(#tvl)" />
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
                <div className="text-3xl font-bold">{currentApy}%</div>
                <div
                  className={`text-sm ${
                    apyDelta >= 0 ? "text-green-500" : "text-muted-foreground"
                  }`}
                >
                  {`${apyDelta >= 0 ? "+" : ""}${apyDelta.toFixed(1)}% in the past 7 days`}
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
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="apy"
                      stroke="hsl(var(--primary))"
                      fill="url(#apy)"
                    />
                  </RechartsAreaChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="price" className="space-y-4">
                <div className="text-3xl font-bold">{`$${price.toFixed(2)}`}</div>
                <div
                  className={`text-sm ${
                    priceDelta >= 0 ? "text-green-500" : "text-muted-foreground"
                  }`}
                >
                  {`${priceDelta >= 0 ? "+" : ""}$${priceDelta.toFixed(2)} in the past 7 days`}
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
                          stopColor="hsl(var(--primary)/0.5)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary)/0.5)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--primary)/0.5)"
                      fill="url(#price)"
                    />
                  </RechartsAreaChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>


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

        <Card>
          <CardHeader>
            <CardTitle>{`Tokenholders (${tokenholders.length})`}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow className="border-muted">
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokenholders.map((holder) => (
                  <TableRow key={holder.address} className="border-muted">
                    <TableCell className="font-mono">{holder.address}</TableCell>
                    <TableCell className="text-right">
                      {holder.balance.toLocaleString()} MNV
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 sticky top-6 h-fit">
        <Card>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                {connected && tokenBalance > 0 && (
                  <TabsTrigger value="balance">Balance</TabsTrigger>
                )}
                <TabsTrigger value="stake">Stake</TabsTrigger>
                <TabsTrigger value="redeem">Redeem</TabsTrigger>
              </TabsList>
              {connected && tokenBalance > 0 && (
                <TabsContent value="balance" className="space-y-2">
                  <div className="flex items-center gap-2 text-2xl font-bold">
                    {"$" + dollarBalance.toFixed(2)}
                    <span className="animate-pulse rounded-full bg-green-500 size-2" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tokenBalance.toFixed(2)} MNV
                  </div>
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
                </TabsContent>
              )}
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
