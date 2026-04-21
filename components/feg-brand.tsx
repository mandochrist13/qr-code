"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FegBrandProps {
  className?: string;
  variant?: "full" | "compact";
  tone?: "dark" | "light";
}

export function FegBrand({ className, variant = "full", tone = "dark" }: FegBrandProps) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <Image
        src="/feg-logo.png"
        alt="Fédération des Entreprises du Gabon"
        width={variant === "compact" ? 72 : 120}
        height={variant === "compact" ? 72 : 120}
        priority
        onError={() => setFailed(true)}
        className={cn("h-auto w-auto object-contain drop-shadow-sm", className)}
      />
    );
  }

  const colorMain = tone === "light" ? "text-white" : "text-[#1a5237]";
  const colorSub = tone === "light" ? "text-white/80" : "text-[#1a5237]/80";

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn("text-4xl font-black tracking-tight", colorMain)}>FEG</div>
      {variant === "full" && (
        <div className={cn("mt-0.5 text-[8px] font-semibold tracking-widest", colorSub)}>
          FÉDÉRATION DES ENTREPRISES DU GABON
        </div>
      )}
    </div>
  );
}
