"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Building2,
  Briefcase,
  User,
  Download,
  ExternalLink,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QRCodeDisplay } from "@/components/qr-code-display";
import { InteractiveBackground } from "@/components/interactive-background";
import { FegBrand } from "@/components/feg-brand";
import type { Employee } from "@/lib/types";
import { getEmployeePublicUrl, getEmployeeVCardUrl } from "@/lib/publicUrl";

interface PublicProfileProps {
  employee: Employee;
}

export function PublicProfile({ employee }: PublicProfileProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(employee.photoUrl) && !imageFailed;

  const vcardUrl = getEmployeeVCardUrl(employee.id);

  const handleShare = async () => {
    const url = getEmployeePublicUrl(employee.id);
    const shareData = {
      title: `${employee.nomComplet} — ${employee.poste}`,
      text: `Contact professionnel de ${employee.nomComplet}`,
      url,
    };

    try {
      if (typeof navigator.share === "function") {
        await navigator.share(shareData);
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
    <div className="mx-auto max-w-lg px-4 py-6 sm:py-10">
      <Card className="overflow-hidden border-[#c9a865]/30 shadow-2xl shadow-[#0f3d26]/20">
        <div className="relative overflow-hidden pb-8 pt-5">
          <InteractiveBackground />

          <div className="pointer-events-none flex justify-center">
            <div className="shadow-lg backdrop-blur-md ">
              <Image
                  src="/logo_FEG_blanc.png"
                  alt={employee.nomComplet}
                  width={80}
                  height={80}
                  priority
                  onError={() => setImageFailed(true)}
                  className="object-cover"
                />
            </div>
          </div>

          <div className="relative mt-14 flex flex-col items-center px-4">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-linear-to-br from-[#c9a865] via-[#eadb8e] to-[#1a5237] opacity-50 blur-md" />
              {showImage ? (
                <Image
                  src={employee.photoUrl}
                  alt={employee.nomComplet}
                  width={160}
                  height={160}
                  priority
                  onError={() => setImageFailed(true)}
                  className="relative h-32 w-32 rounded-full object-cover ring-4 ring-white/95 shadow-2xl"
                />
              ) : (
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[#1a5237] ring-4 ring-white/95 shadow-2xl">
                  <User className="h-16 w-16 text-[#c9a865]" />
                </div>
              )}
            </div>
            <h1 className="mt-5 text-balance text-center text-2xl font-bold text-white drop-shadow-md sm:text-3xl">
              {employee.nomComplet}
            </h1>
            {employee.statut && (
              <div className="mt-2 inline-flex items-center rounded-full bg-[#c9a865]/90 px-3 py-1 text-xs font-semibold text-[#0f3d26] shadow-sm">
                {employee.statut}
              </div>
            )}
          </div>
        </div>

        <CardContent className="space-y-6 bg-white p-5 sm:p-6">
          <div className="space-y-1 text-center">
            <p className="text-lg font-semibold text-[#1a5237]">
              {employee.poste}
            </p>
            {employee.profession && (
              <p className="text-sm text-muted-foreground">{employee.profession}</p>
            )}
          </div>

          <div className="grid gap-2.5">
            {/* <Button asChild size="lg" className="w-full">
              <a href={vcardUrl}>
                <Download className="mr-2 h-5 w-5" />
                Enregistrer le contact
              </a>
            </Button> */}

            <div className="grid grid-cols-2 gap-2.5">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[#1a5237]/30 text-[#1a5237] hover:bg-[#1a5237] hover:text-white"
              >
                <a href={`tel:${employee.telephone}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Appeler
                </a>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="bg-[#063a1e] relative hover:bg-white group"
              >
                <a href={`mailto:${employee.email}`}>
                  
                  <span className="absolute inset-0 w-full h-full bg-[#dcdaa4] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0"></span>
                      <span className="relative mr-3 z-10 transition-colors duration-500 ease-in-out group-hover:text-[#063a1e]">
                        <p className="flex justify-center items-center"><Mail className="mr-2 h-5 w-5" />
                  Email</p>
                      </span>
                </a>
              </Button>
            </div>

            {/* <Button onClick={handleShare} variant="ghost" size="sm" className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Partager cette fiche
            </Button> */}
          </div>

          <div className="space-y-4 rounded-xl border border-[#c9a865]/20 bg-linear-to-br from-[#1a5237]/5 via-white to-[#c9a865]/10 p-5">
            <InfoRow
              icon={Phone}
              label="Téléphone"
              value={employee.telephone}
              href={`tel:${employee.telephone}`}
            />
            <InfoRow
              icon={Mail}
              label="Email"
              value={employee.email}
              href={`mailto:${employee.email}`}
            />
            {employee.entreprise && (
              <InfoRow icon={Building2} label="Entreprise" value={employee.entreprise} />
            )}
            <InfoRow icon={Briefcase} label="Poste" value={employee.poste} />
            {employee.adresse && (
              <InfoRow icon={MapPin} label="Adresse" value={employee.adresse} />
            )}
            {employee.siteWeb && (
              <InfoRow
                icon={Globe}
                label="Site web"
                value={employee.siteWeb}
                href={employee.siteWeb}
                external
              />
            )}
          </div>

          {employee.bioCourte && (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-foreground">À propos</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {employee.bioCourte}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {employee.entreprise && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <Image
                  src="/logo FEG revectoriser.png"
                  alt={employee.nomComplet}
                  width={80}
                  height={80}
                  priority
                  onError={() => setImageFailed(true)}
                  className="object-cover"
                />
          <p className="text-center text-xs text-muted-foreground">
            Propulsé par la {employee.entreprise}
          </p>
        </div>
      )}
    </div>
  );
}

interface InfoRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

function InfoRow({ icon: Icon, label, value, href, external }: InfoRowProps) {
  const displayValue = external ? value.replace(/^https?:\/\//, "") : value;

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#1a5237]/10">
        <Icon className="h-3.5 w-3.5 text-[#1a5237]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a6f2a]">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1 break-words text-sm font-medium text-[#1a5237] hover:underline"
          >
            {displayValue}
            {external && <ExternalLink className="h-3 w-3 shrink-0" />}
          </a>
        ) : (
          <p className="break-words text-sm font-medium text-foreground">{value}</p>
        )}
      </div>
    </div>
  );
}
