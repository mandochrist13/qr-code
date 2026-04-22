"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Phone,
  Mail,
  Globe,
  User,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProfileDetails, ProfileFooter } from "@/components/profile-details";
import type { Employee } from "@/lib/types";
import { getEmployeePublicUrl } from "@/lib/publicUrl";

interface PublicProfileProps {
  employee: Employee;
}

export function PublicProfile({ employee }: PublicProfileProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(employee.photoUrl) && !imageFailed;
  const whatsappNumber = employee.telephone?.replace(/[^\d]/g, "");

  const handleShare = async () => {
    const url = getEmployeePublicUrl(employee.id);
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({
          title: `${employee.nomComplet} — ${employee.poste}`,
          text: `Contact professionnel de ${employee.nomComplet}`,
          url,
        });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
    } catch (error) {
      if ((error as DOMException)?.name !== "AbortError") {
        console.error("Partage impossible:", error);
      }
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-6 sm:py-10">
      <Card className="overflow-hidden border-[#c9a865]/30 p-0 shadow-2xl shadow-[#0f3d26]/30">
        <div className="relative aspect-9/16 w-full overflow-hidden bg-[#0f3d26]">
          {showImage ? (
            <Image
              src={employee.photoUrl}
              alt={employee.nomComplet}
              fill
              priority
              onError={() => setImageFailed(true)}
              className="object-cover"
              sizes="(max-width: 480px) 100vw, 448px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#1a5237] to-[#0f3d26]">
              <User className="h-32 w-32 text-[#c9a865]/60" />
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-b from-black/25 from-0% via-transparent via-40% to-[#0f3d26] to-100%" />

          <div className="absolute left-4 top-4 z-10">
            <Image
              src="/logo_FEG_blanc.png"
              alt="FEG"
              width={64}
              height={64}
              priority
              className="h-14 w-auto drop-shadow-lg"
            />
          </div>

          {employee.statut && (
            <div className="absolute right-4 top-4 z-10">
              <span className="inline-flex items-center rounded-full bg-[#c9a865]/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0f3d26] shadow-md">
                {employee.statut}
              </span>
            </div>
          )}

          {/* <div className="pointer-events-none absolute inset-x-0 top-[48%] -translate-y-1/2">
            <svg
              viewBox="0 0 400 180"
              preserveAspectRatio="none"
              className="h-40 w-full"
              aria-hidden
            >
              <polyline
                points="0,20 200,130 400,20"
                stroke="#c9a865"
                strokeWidth="26"
                fill="none"
                opacity="0.88"
                strokeLinejoin="miter"
              />
              <polyline
                points="0,75 200,185 400,75"
                stroke="#1a5237"
                strokeWidth="26"
                fill="none"
                opacity="0.85"
                strokeLinejoin="miter"
              />
            </svg>
          </div> */}

          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-4 pb-6 pt-10">
            <h1 className="text-balance text-center text-3xl font-bold leading-tight text-white drop-shadow-[0_2px_10px_rgba(29,79,65)] sm:text-4xl">
              {employee.nomComplet}
            </h1>
            <p className="mt-2 text-center text-sm font-medium tracking-wide text-[#eadb8e] drop-shadow-md sm:text-base">
              {employee.poste}
            </p>
            {employee.profession && (
              <p className="mt-0.5 text-center text-xs italic text-white/80 drop-shadow">
                {employee.profession}
              </p>
            )}

            <div className="mt-5 flex items-center justify-center gap-3">
              <SocialIcon href={`tel:${employee.telephone}`} label="Appeler">
                <Phone className="h-4.5 w-4.5" />
              </SocialIcon>
              <SocialIcon href={`mailto:${employee.email}`} label="Email">
                <Mail className="h-4.5 w-4.5" />
              </SocialIcon>
              {whatsappNumber && (
                <SocialIcon
                  href={`https://wa.me/${whatsappNumber}`}
                  label="WhatsApp"
                  external
                >
                  <MessageCircle className="h-4.5 w-4.5" />
                </SocialIcon>
              )}
              {employee.siteWeb && (
                <SocialIcon href={employee.siteWeb} label="Site web" external>
                  <Globe className="h-4.5 w-4.5" />
                </SocialIcon>
              )}
              {/* <button
                type="button"
                onClick={handleShare}
                aria-label="Partager"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-md transition hover:bg-[#c9a865] hover:text-[#0f3d26]"
              >
                <Share2 className="h-[18px] w-[18px]" />
              </button> */}
            </div>
          </div>
        </div>

        <ProfileDetails employee={employee} />
      </Card>

      <ProfileFooter employee={employee} />
    </div>
  );
}

interface SocialIconProps {
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}

function SocialIcon({ href, label, external, children }: SocialIconProps) {
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-md transition hover:bg-[#c9a865] hover:text-[#0f3d26]"
    >
      {children}
    </a>
  );
}
