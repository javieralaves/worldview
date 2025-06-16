import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TokenInputProps extends React.ComponentProps<"input"> {
  token: string
  usdValue?: number
  balance?: number
  onMax?: () => void
}

const TokenInput = React.forwardRef<HTMLInputElement, TokenInputProps>(
  ({ token, usdValue, balance, onMax, className, readOnly, disabled, ...props }, ref) => {
    return (
      <div className="grid gap-1">
        <div className="relative">
          <Input
            ref={ref}
            readOnly={readOnly}
            disabled={disabled}
            className={cn("pr-16", className, readOnly && "cursor-default")}
            {...props}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {token}
          </span>
        </div>
        <div className="flex justify-between px-3 text-xs text-muted-foreground">
          <span>{usdValue !== undefined ? `$${usdValue.toFixed(2)}` : ""}</span>
          {balance !== undefined && (
            <span className="flex items-center gap-1">
              {balance.toFixed(2)} {token}
              {onMax && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={onMax}
                  className="px-1 h-5 text-[10px]"
                  disabled={disabled}
                >
                  MAX
                </Button>
              )}
            </span>
          )}
        </div>
      </div>
    )
  }
)
TokenInput.displayName = "TokenInput"

export { TokenInput }
