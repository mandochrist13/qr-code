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
import type { Employee } from "@/lib/types";
import { downloadVCard } from "@/lib/vcard";
import { getEmployeePublicUrl } from "@/lib/publicUrl";

interface PublicProfileProps {
  employee: Employee;
}

export function PublicProfile({ employee }: PublicProfileProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(employee.photoUrl) && !imageFailed;

  const handleSaveContact = () => {
    downloadVCard(employee);
  };

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
      <Card className="overflow-hidden shadow-xl">
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-14 pt-10 sm:pt-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.03),transparent)]" />
          <div className="relative flex flex-col items-center px-4">
            {showImage ? (
              <Image
                src={employee.photoUrl}
                alt={employee.nomComplet}
                width={160}
                height={160}
                priority
                onError={() => setImageFailed(true)}
                className="h-32 w-32 rounded-full object-cover ring-4 ring-background shadow-lg"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-secondary ring-4 ring-background shadow-lg">
                <User className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            <h1 className="mt-5 text-balance text-center text-2xl font-bold text-foreground sm:text-3xl">
              {employee.nomComplet}
            </h1>
            {employee.statut && (
              <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {employee.statut}
              </div>
            )}
          </div>
        </div>

        <CardContent className="space-y-6 p-5 sm:p-6">
          <div className="space-y-1 text-center">
            <p className="text-lg font-semibold text-foreground">
              {employee.poste}
            </p>
            {employee.profession && (
              <p className="text-sm text-muted-foreground">{employee.profession}</p>
            )}
          </div>

          <div className="grid gap-2.5">
            <Button onClick={handleSaveContact} size="lg" className="w-full">
              <Download className="mr-2 h-5 w-5" />
              Enregistrer le contact
            </Button>

            <div className="grid grid-cols-2 gap-2.5">
              <Button asChild variant="outline" size="lg">
                <a href={`tel:${employee.telephone}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Appeler
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={`mailto:${employee.email}`}>
                  <Mail className="mr-2 h-5 w-5" />
                  Email
                </a>
              </Button>
            </div>

            <Button onClick={handleShare} variant="ghost" size="sm" className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Partager cette fiche
            </Button>
          </div>

          <div className="space-y-4 rounded-xl bg-muted/50 p-5">
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

          <div className="flex flex-col items-center gap-3 border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">
              Scannez pour partager cette fiche
            </p>
            <QRCodeDisplay employeeId={employee.id} size={112} />
          </div>
        </CardContent>
      </Card>

      {employee.entreprise && (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Propulsé par {employee.entreprise}
        </p>
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
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        {href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1 break-words text-sm font-medium text-primary hover:underline"
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
