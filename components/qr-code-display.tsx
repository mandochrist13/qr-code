"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getEmployeePublicUrl } from "@/lib/publicUrl";
import { cn } from "@/lib/utils";

interface QRCodeDisplayProps {
  employeeId: string;
  size?: number;
  className?: string;
  /**
   * Optional URL override. Useful when the caller already knows
   * the final public URL (e.g. after SSR) and wants to skip the
   * client-side computation.
   */
  url?: string;
}

export function QRCodeDisplay({
  employeeId,
  size = 128,
  className,
  url,
}: QRCodeDisplayProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(url ?? null);

  useEffect(() => {
    if (url) {
      setResolvedUrl(url);
      return;
    }
    setResolvedUrl(getEmployeePublicUrl(employeeId));
  }, [employeeId, url]);

  return (
    <div
      id={`qr-${employeeId}`}
      className={cn("inline-flex items-center justify-center bg-white p-2", className)}
      style={{ width: size + 16, height: size + 16 }}
    >
      {resolvedUrl ? (
        <QRCodeSVG
          value={resolvedUrl}
          size={size}
          level="M"
          marginSize={0}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      ) : (
        <div
          className="animate-pulse bg-muted"
          style={{ width: size, height: size }}
          aria-hidden
        />
      )}
    </div>
  );
}
