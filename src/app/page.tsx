"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { VaultCard } from "@/components/vault-card";
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

  const compositions = [
    {
      name: "Nest Treasuries",
      description: "Highest Quality Treasury Bills",
      tvl: 3.2,
      apy: 12.3,
      icon: "/tokens/nest-treasuries.svg",
      history: [
        { month: "Jan", tvl: 1 },
        { month: "Feb", tvl: 1.5 },
        { month: "Mar", tvl: 2 },
        { month: "Apr", tvl: 2.7 },
        { month: "May", tvl: 3 },
        { month: "Jun", tvl: 3.2 },
      ],
    },
    {
      name: "Nest Alpha",
      description: "Tokenized Real World Assets",
      tvl: 2.4,
      apy: 9.8,
      icon: "/tokens/nest-alpha.svg",
      history: [
        { month: "Jan", tvl: 0.5 },
        { month: "Feb", tvl: 0.8 },
        { month: "Mar", tvl: 0.8 },
        { month: "Apr", tvl: 1.6 },
        { month: "May", tvl: 2 },
        { month: "Jun", tvl: 2.4 },
      ],
    },
    {
      name: "Nest Credit",
      description: "Institutional-Grade Private Credit",
      tvl: 2.8,
      apy: 8.1,
      icon: "/tokens/nest-credit.svg",
      history: [
        { month: "Jan", tvl: 1.2 },
        { month: "Feb", tvl: 1.4 },
        { month: "Mar", tvl: 1.9 },
        { month: "Apr", tvl: 2.2 },
        { month: "May", tvl: 2.5 },
        { month: "Jun", tvl: 2.8 },
      ],
    },
  ];


  const assets = [
    {
      name: "Mineral Vault",
      description: "U.S. Mineral & Oil Royalties",
      tvl: 5.0,
      apy: 8.7,
      icon: "/tokens/mineral-vault.svg",
      history: [
        { month: "Jan", tvl: 2 },
        { month: "Feb", tvl: 2 },
        { month: "Mar", tvl: 2.5 },
        { month: "Apr", tvl: 3.7 },
        { month: "May", tvl: 4.2 },
        { month: "Jun", tvl: 5 },
      ],
    },
    {
      name: "iSNR",
      description: "Senior Secured Loans",
      tvl: 3.2,
      apy: 6.0,
      icon: "/tokens/invesco-isnr.svg",
      history: [
        { month: "Jan", tvl: 1.5 },
        { month: "Feb", tvl: 1.7 },
        { month: "Mar", tvl: 1.7 },
        { month: "Apr", tvl: 2 },
        { month: "May", tvl: 2.5 },
        { month: "Jun", tvl: 3.2 },
      ],
    },
    {
      name: "mBASIS",
      description: "Crypto Basis Trading",
      tvl: 4.1,
      apy: 7.1,
      icon: "/tokens/mbasis.svg",
      history: [
        { month: "Jan", tvl: 1 },
        { month: "Feb", tvl: 1.3 },
        { month: "Mar", tvl: 1.7 },
        { month: "Apr", tvl: 2.5 },
        { month: "May", tvl: 3.6 },
        { month: "Jun", tvl: 4.1 },
      ],
    },
  ];

  const tvlDelta = tvl - 20;

  return (
    <div className="space-y-16 p-6 md:p-10 max-w-[1080px] mx-auto">

      {/* metrics strip removed */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Nest TVL</h2>
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
        <h2 className="text-[32px] leading-[40px] font-medium">Compositions</h2>
        <p className="text-[20px] leading-[28px] font-medium max-w-[640px] text-muted-foreground">
          Stake into institutional-grade, professional curated real-world asset strategies through a single onchain token. Each vault follows a clear strategy—balancing risk, yield, and liquidity—so you get diversified exposure without managing individual assets.
        </p>
        <div className="flex gap-6 pb-4">
          {compositions.map((c) => (
            <VaultCard key={c.name} {...c} />
          ))}
        </div>
      </section>



      <section className="space-y-4">
        <h2 className="text-[32px] leading-[40px] font-medium">Single Assets</h2>
        <p className="text-[20px] leading-[28px] font-medium max-w-[640px] text-muted-foreground">
          Stake directly into real-world, yield-generating assets—one vault, one token. It’s the simplest way to access onchain yield.
        </p>
        <div className="flex gap-6 pb-4">
          {assets.map((a, i) => {
            const card = <VaultCard key={a.name} {...a} />;
            return i === 0 ? (
              <Link href="/mineral" className="flex-1" key={a.name}>
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
