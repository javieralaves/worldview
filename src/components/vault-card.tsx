import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LineChart as RechartsLineChart, Line, ResponsiveContainer } from "recharts";

interface VaultCardProps {
  icon: string;
  name: string;
  description: string;
  tvl: number;
  apy: number;
  history: { month: string; tvl: number }[];
}

export function VaultCard({ icon, name, description, tvl, apy, history }: VaultCardProps) {
  return (
    <Card className="flex-1 min-w-[16rem] bg-[#F5F5F5] shadow-none border-none py-0">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage src={icon} alt={`${name} icon`} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-[18px] leading-[24px] font-medium">{name}</div>
        </div>
        <p className="mt-3 text-muted-foreground leading-[24px]">{description}</p>
      </div>
      <div className="mt-12">
        <ResponsiveContainer width="100%" height={80}>
          <RechartsLineChart data={history} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <Line type="monotone" dataKey="tvl" stroke="currentColor" strokeWidth={2} dot={false} />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 px-6 pt-6 pb-6">
        <div>
          <div className="text-[16px] leading-[24px] text-muted-foreground">TVL</div>
          <div className="mt-1 text-[20px] leading-[32px] font-semibold">{`$${tvl}M`}</div>
        </div>
        <div>
          <div className="text-[16px] leading-[24px] text-muted-foreground">APY</div>
          <div className="mt-1 text-[20px] leading-[32px] font-semibold">{`${apy}%`}</div>
        </div>
      </div>
    </Card>
  );
}

