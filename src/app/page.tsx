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

export default function Home() {
  const [tvl, setTvl] = useState(0);
  const tokenholders = 1350;

  useEffect(() => {
    const target = 37.5; // total TVL in millions
    let current = 0;
    const id = setInterval(() => {
      current = Math.min(current + 0.05, target);
      setTvl(current);
      if (current >= target) clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, []);

  const trending = [
    { name: "Real Yield", assets: 5, return: 12.3, curator: "0xAlice", tvl: 3.2 },
    { name: "Metals Basket", assets: 7, return: 9.8, curator: "0xBob", tvl: 2.4 },
    { name: "Growth Mix", assets: 6, return: 8.1, curator: "0xCarol", tvl: 2.8 },
  ];

  const curators = [
    { name: "Alice", return: 8.2, aum: 12.4 },
    { name: "Bob", return: 7.6, aum: 9.1 },
    { name: "Carol", return: 6.9, aum: 8.7 },
  ];

  const assets = [
    { name: "Mineral", performance: 8.7, tvl: 5.0, yield: 8.7 },
    { name: "Agriculture", performance: 6.1, tvl: 3.2, yield: 6.0 },
    { name: "Real Estate", performance: 7.2, tvl: 4.1, yield: 7.1 },
  ];

  return (
    <div className="space-y-12 p-6 md:p-10">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Nest</h1>
        <div className="flex flex-col sm:flex-row justify-center gap-8">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Total value locked</div>
            <div className="text-3xl font-bold">${tvl.toFixed(1)}M</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Tokenholders</div>
            <div className="text-3xl font-bold">{tokenholders.toLocaleString()}</div>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Trending compositions</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {trending.map((t) => (
            <Card key={t.name} className="min-w-[16rem] shrink-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t.name}</CardTitle>
                <CardDescription>{t.assets} assets</CardDescription>
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
            <Card key={c.name} className="min-w-[12rem] shrink-0 items-center">
              <CardHeader className="flex items-center gap-2 pb-2">
                <Avatar>
                  <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-base">{c.name}</CardTitle>
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
                <CardHeader className="pb-2">
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
