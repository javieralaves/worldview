"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const dummyHistory = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Yield",
      data: [0, 1, 1.5, 2, 2.2, 2.4],
      borderColor: "hsl(var(--primary))",
      backgroundColor: "hsl(var(--primary))",
      fill: false,
    },
  ],
};

export default function VaultPage() {
  return (
    <div className="p-6 flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">US Treasury Bill Vault</h1>
        <p className="text-muted-foreground">Stake into short-term US treasury bills and earn onchain yield.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Vault Details</CardTitle>
          <CardDescription>Asset: Treasury Bills</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Current APY</div>
            <div className="text-lg font-medium">4.3%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">TVL</div>
            <div className="text-lg font-medium">$12,340,000</div>
          </div>
          <div className="sm:col-span-2">
            <Button asChild className="mt-2">
              <a href="#">Asset Transparency</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stake</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="stake" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="stake">Stake</TabsTrigger>
              <TabsTrigger value="redeem">Redeem</TabsTrigger>
            </TabsList>
            <TabsContent value="stake">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="0" />
                </div>
                <Button type="submit" className="w-full">Stake</Button>
              </form>
            </TabsContent>
            <TabsContent value="redeem">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="redeem">Amount</Label>
                  <Input id="redeem" type="number" placeholder="0" />
                </div>
                <Button type="submit" className="w-full">Redeem</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={dummyHistory} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>Deposit: 1,000 USDC - Jun 1</div>
          <div>Rebalance: Bought T-Bills - May 28</div>
          <div>Deposit: 500 USDC - May 15</div>
        </CardContent>
      </Card>
    </div>
  );
}
