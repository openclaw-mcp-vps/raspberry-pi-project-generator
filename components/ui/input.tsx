import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>): React.ReactElement {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-[#2b3340] bg-[#0d1117] px-3 text-sm text-[#f5f8ff] placeholder:text-[#6f7c8d] focus:border-[#4db2ff] focus:outline-none",
        className
      )}
      {...props}
    />
  );
}
