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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const tvlHistory = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "TVL (M USD)",
      data: [2, 2.5, 3, 3.8, 4.5, 5],
      borderColor: "hsl(var(--primary))",
      backgroundColor: "hsl(var(--primary))",
      fill: false,
    },
  ],
};

const performanceHistory = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "APY %",
      data: [7, 7.5, 8, 8.3, 8.5, 8.7],
      borderColor: "hsl(var(--primary))",
      backgroundColor: "hsl(var(--primary))",
      fill: false,
    },
    {
      label: "Token Price",
      data: [1, 1.02, 1.03, 1.04, 1.05, 1.06],
      borderColor: "hsl(var(--primary)/0.5)",
      backgroundColor: "hsl(var(--primary)/0.5)",
      fill: false,
    },
  ],
};

export default function VaultPage() {
  const [tokenBalance, setTokenBalance] = useState(0);
  const [dollarBalance, setDollarBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState("stake");

  useEffect(() => {
    if (!tokenBalance) return;
    const id = setInterval(() => {
      // Increment a few cents per second so the balance visibly grows
      setDollarBalance((d) => d + 0.03);
    }, 1000);
    return () => clearInterval(id);
  }, [tokenBalance]);

  function onStake(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0) {
      setTokenBalance(value);
      setDollarBalance(value);
      setActiveTab("balance");
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
        </div>

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
          <CardContent>
            <Line
              data={tvlHistory}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historical Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={performanceHistory}
              options={{ responsive: true }}
            />
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
      </div>

      <div className="space-y-6 sticky top-6 h-fit">
        <Card>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                {tokenBalance > 0 && (
                  <TabsTrigger value="balance">Balance</TabsTrigger>
                )}
                <TabsTrigger value="stake">Stake</TabsTrigger>
                <TabsTrigger value="redeem">Redeem</TabsTrigger>
              </TabsList>
              {tokenBalance > 0 && (
                <TabsContent value="balance" className="space-y-2">
                  <div className="flex items-center gap-2 text-2xl font-bold">
                    {"$" + dollarBalance.toFixed(2)}
                    <span className="animate-pulse rounded-full bg-green-500 size-2" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tokenBalance.toFixed(2)} MNV
                  </div>
                </TabsContent>
              )}
              <TabsContent value="stake">
                <form className="space-y-4" onSubmit={onStake}>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Stake
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="redeem">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="redeem">Amount</Label>
                    <Input id="redeem" type="number" placeholder="0" />
                  </div>
                  <Button type="submit" className="w-full">
                    Redeem
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
