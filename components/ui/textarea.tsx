import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>): React.ReactElement {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-xl border border-[#2b3340] bg-[#0d1117] px-3 py-2 text-sm text-[#f5f8ff] placeholder:text-[#6f7c8d] focus:border-[#4db2ff] focus:outline-none",
        className
      )}
      {...props}
    />
  );
}
