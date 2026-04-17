import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[#264a2f] bg-[#0d1f15] px-3 py-1 text-xs font-medium text-[#79e5a7]",
        className
      )}
      {...props}
    />
  );
}
