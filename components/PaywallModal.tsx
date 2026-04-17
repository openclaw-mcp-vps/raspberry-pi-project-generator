"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    LemonSqueezy?: {
      Url?: {
        Open: (url: string) => void;
      };
    };
  }
}

interface PaywallModalProps {
  checkoutUrl: string;
}

export function PaywallModal({ checkoutUrl }: PaywallModalProps): React.ReactElement {
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = useMemo(() => searchParams.get("order_id"), [searchParams]);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    const confirm = async (): Promise<void> => {
      setIsConfirming(true);
      setError(null);

      const result = await fetch("/api/paywall/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId })
      });

      if (!result.ok) {
        setError("Payment was detected but is still syncing. Refresh in 10 seconds.");
        setIsConfirming(false);
        return;
      }

      router.replace("/generator");
      router.refresh();
    };

    void confirm();
  }, [orderId, router]);

  const handleCheckout = (): void => {
    setError(null);
    if (!checkoutUrl) {
      setError("Set NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID before accepting payments.");
      return;
    }

    if (window.LemonSqueezy?.Url?.Open) {
      window.LemonSqueezy.Url.Open(checkoutUrl);
      return;
    }

    window.location.href = checkoutUrl;
  };

  return (
    <div className="rounded-2xl border border-[#2b3340] bg-[#111827] p-6">
      <div className="mb-4 inline-flex rounded-full border border-[#27405d] bg-[#102238] p-2 text-[#79c7ff]">
        <Lock size={18} />
      </div>
      <h2 className="text-2xl font-bold">Unlock Personalized Project Generator</h2>
      <p className="mt-2 text-sm text-[#9aa4b2]">
        Get custom Raspberry Pi ideas matched to your exact parts, plus wiring maps and code examples. One plan, no ads, no fluff.
      </p>

      <div className="mt-5 space-y-3 rounded-xl border border-[#2b3340] bg-[#0d1117] p-4">
        <p className="text-3xl font-bold">
          $7<span className="text-base text-[#9aa4b2]">/month</span>
        </p>
        <ul className="space-y-2 text-sm text-[#d8e3f5]">
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-0.5 text-[#00d084]" />
            Unlimited tailored project generation for your current parts bin
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-0.5 text-[#00d084]" />
            Step-by-step build plans with setup and debugging notes
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-0.5 text-[#00d084]" />
            Practical wiring diagrams with pin mapping guidance
          </li>
        </ul>
      </div>

      {error ? <p className="mt-4 text-sm text-[#ff7f7f]">{error}</p> : null}

      <Button className="mt-6 w-full" size="lg" onClick={handleCheckout} disabled={isConfirming}>
        {isConfirming ? "Confirming purchase..." : "Start Subscription"}
      </Button>
    </div>
  );
}
