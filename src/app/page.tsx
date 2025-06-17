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
  const [tokenholders, setTokenholders] = useState(1000);
  const volume = 6.2;
  const volumeDelta = 0.5;
  const avgApy = 7.9;
  const apyDelta = 0.2;

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
    const targetHolders = 1350;
    let currentTvl = 20;
    let currentHolders = 1000;
    const id = setInterval(() => {
      currentTvl = Math.min(currentTvl + 0.25, targetTvl);
      currentHolders = Math.min(currentHolders + 2, targetHolders);
      setTvl(currentTvl);
      setTokenholders(currentHolders);
      if (currentTvl >= targetTvl && currentHolders >= targetHolders) {
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

  const curators = [
    { name: "BlackRock", return: 8.2, aum: 12.4 },
    { name: "Cicada Partners", return: 7.6, aum: 9.1 },
    { name: "Simplify", return: 6.9, aum: 8.7 },
  ];

  const assets = [
    { name: "Mineral Vault", performance: 8.7, tvl: 5.0, yield: 8.7 },
    { name: "Invesco iSNR", performance: 6.1, tvl: 3.2, yield: 6.0 },
    { name: "Kasu", performance: 7.2, tvl: 4.1, yield: 7.1 },
  ];

  const tvlDelta = tvl - 20;
  const holderDelta = tokenholders - 1000;

  return (
    <div className="space-y-12 p-6 md:p-10 max-w-[1080px] mx-auto">

      <div className="flex flex-col sm:flex-row gap-6 justify-between">
        <div className="space-y-1 flex-1">
          <div className="text-xs text-muted-foreground">1D Volume</div>
          <div className="text-xl font-bold">{`$${volume.toFixed(1)}M`}</div>
          <div className={`text-sm ${volumeDelta >= 0 ? "text-green-500" : "text-muted-foreground"}`}>{`${volumeDelta >= 0 ? "+" : ""}${volumeDelta.toFixed(1)}%`}</div>
        </div>
        <div className="space-y-1 flex-1">
          <div className="text-xs text-muted-foreground">Average APY</div>
          <div className="text-xl font-bold">{avgApy}%</div>
          <div className={`text-sm ${apyDelta >= 0 ? "text-green-500" : "text-muted-foreground"}`}>{`${apyDelta >= 0 ? "+" : ""}${apyDelta.toFixed(1)}%`}</div>
        </div>
        <div className="space-y-1 flex-1">
          <div className="text-xs text-muted-foreground">Total Tokenholders</div>
          <div className="text-xl font-bold">{tokenholders.toLocaleString()}</div>
          <div className={`text-sm ${holderDelta >= 0 ? "text-green-500" : "text-muted-foreground"}`}>{`${holderDelta >= 0 ? "+" : ""}${holderDelta.toLocaleString()}`}</div>
        </div>
      </div>
      <section className="space-y-4">
          <h2 className="text-xl font-bold">Total Value Locked</h2>
          <div className="space-y-1">
            <div className="text-3xl font-bold">{`$${tvl.toFixed(1)}M`}</div>
            <div
              className={`text-sm ${
                tvlDelta >= 0 ? "text-green-500" : "text-muted-foreground"
              }`}
            >
              {`${tvlDelta >= 0 ? "+" : ""}${tvlDelta.toFixed(1)}M since launch`}
            </div>
          </div>
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
                  stroke="var(--chart-2)"
                  strokeWidth={4}
                  dot={false}
                />
              </RechartsLineChart>
          </ResponsiveContainer>
        </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Trending compositions</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {trending.map((t) => (
            <Card key={t.name} className="min-w-[16rem] shrink-0">
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
        <h2 className="text-xl font-bold">Top curators</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {curators.map((c) => (
            <Card key={c.name} className="min-w-[16rem] shrink-0">
              <CardHeader className="flex items-center gap-2 pb-2">
                <Avatar>
                  <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{c.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div>30d avg {c.return}%</div>
                <div>AUM ${c.aum}M</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Popular assets</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {assets.map((a, i) => {
            const card = (
              <Card className="min-w-[16rem] shrink-0" key={a.name}>
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
