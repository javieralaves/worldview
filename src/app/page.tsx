"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LineChart as RechartsLineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [tvl, setTvl] = useState(20);
  // metrics for volume, APY and tokenholders were removed

  const tvlHistory = [
    { month: "Jan", tvl: 15 },
    { month: "Feb", tvl: 16 },
    { month: "Mar", tvl: 17 },
    { month: "Apr", tvl: 18.5 },
    { month: "May", tvl: 19 },
    { month: "Jun", tvl: 20 },
  ];


  useEffect(() => {
    const targetTvl = 37.5; // total TVL in millions
    let currentTvl = 20;
    const id = setInterval(() => {
      currentTvl = Math.min(currentTvl + 0.25, targetTvl);
      setTvl(currentTvl);
      if (currentTvl >= targetTvl) {
        clearInterval(id);
      }
    }, 500);
    return () => clearInterval(id);
  }, []);

  const trending = [
    { name: "nTBILL", assets: 5, return: 12.3, curator: "0xAlice", tvl: 3.2 },
    { name: "nALPHA", assets: 7, return: 9.8, curator: "0xBob", tvl: 2.4 },
    { name: "nBASIS", assets: 6, return: 8.1, curator: "0xCarol", tvl: 2.8 },
  ];


  const assets = [
    { name: "Mineral Vault", performance: 8.7, tvl: 5.0, yield: 8.7 },
    { name: "Invesco iSNR", performance: 6.1, tvl: 3.2, yield: 6.0 },
    { name: "Kasu", performance: 7.2, tvl: 4.1, yield: 7.1 },
  ];

  const tvlDelta = tvl - 20;

  return (
    <div className="space-y-12 p-6 md:p-10 max-w-[1080px] mx-auto">

      {/* metrics strip removed */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Nest TVL</h2>
        <div className="bg-[#D9DFCF] rounded-[24px] p-6">
          <div className="space-y-[12px]">
            <div className="text-[60px] leading-[72px] font-medium text-[#030301]">
              {`$${tvl.toFixed(1)}M`}
            </div>
            <div className="text-[18px] leading-[28px] text-[#155538]">
              {`${tvlDelta >= 0 ? "+" : ""}${tvlDelta.toFixed(1)}M since launch`}
            </div>
          </div>
          <div className="mt-[64px]">
            <ResponsiveContainer width="100%" height={200}>
              <RechartsLineChart
                data={tvlHistory}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <Tooltip
                  contentStyle={{
                    background: "#000",
                    borderColor: "#000",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="tvl"
                  stroke="#47644C"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Compositions</h2>
        <p className="max-w-[50%] text-muted-foreground">
          Stake into institutional-grade, professional curated real-world asset strategies through a single onchain token. Each vault follows a clear strategy—balancing risk, yield, and liquidity—so you get diversified exposure without managing individual assets.
        </p>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {trending.map((t) => (
            <Card key={t.name} className="min-w-[16rem] shrink-0 bg-[#F5F5F5] shadow-none border-none">
              <CardHeader className="flex items-center gap-2 pb-2">
                <Avatar>
                  <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-base">{t.name}</CardTitle>
                  <CardDescription>{t.assets} assets</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div>30d return {t.return}%</div>
                <div>Curator {t.curator}</div>
                <div>TVL ${t.tvl}M</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>



      <section className="space-y-4">
        <h2 className="text-xl font-bold">Single Assets</h2>
        <p className="max-w-[50%] text-muted-foreground">
          Stake directly into real-world, yield-generating assets—one vault, one token. It’s the simplest way to access onchain yield.
        </p>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {assets.map((a, i) => {
            const card = (
              <Card className="min-w-[16rem] shrink-0 bg-[#F5F5F5] shadow-none border-none" key={a.name}>
                <CardHeader className="flex items-center gap-2 pb-2">
                  <Avatar>
                    <AvatarFallback>{a.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-base">{a.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <div>30d {a.performance}%</div>
                  <div>TVL ${a.tvl}M</div>
                  <div>Yield {a.yield}%</div>
                </CardContent>
              </Card>
            );
            return i === 0 ? (
              <Link href="/mineral" className="shrink-0" key={a.name}>
                {card}
              </Link>
            ) : (
              card
            );
          })}
        </div>
      </section>
    </div>
  );
}
