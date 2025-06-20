import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Bolt } from "lucide-react";

interface VaultCardProps {
  icon: string;
  name: string;
  description: string;
  tvl: number;
  apy: number;
  tokenValue: number;
}

export function VaultCard({ icon, name, description, tvl, apy, tokenValue }: VaultCardProps) {
  const [animatedValue, setAnimatedValue] = useState(tokenValue);

  useEffect(() => {
    const id = setInterval(() => {
      setAnimatedValue((v) => parseFloat((v + 0.02).toFixed(2)));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card className="flex-1 w-full sm:min-w-[16rem] bg-[#F5F5F5] shadow-none border-none py-0">
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
      <div className="px-6 mt-6">
        <div className="text-[16px] leading-[24px] text-muted-foreground">Token Value</div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mt-1 flex items-center gap-1 text-[20px] leading-[32px] font-semibold">
              {`$${animatedValue.toFixed(2)}`}
              <Bolt className="size-4 fill-[#28A29C] stroke-none" />
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={4}>Generating real-world yield in real time</TooltipContent>
        </Tooltip>
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

