"use client";

import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Building2,
  Briefcase,
  ExternalLink,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Employee } from "@/lib/types";
import { getEmployeeVCardUrl } from "@/lib/publicUrl";

interface ProfileDetailsProps {
  employee: Employee;
}

export function ProfileDetails({ employee }: ProfileDetailsProps) {
  const vcardUrl = getEmployeeVCardUrl(employee.id);

  return (
    <div className="space-y-5 bg-white p-5 sm:p-6">
      {/* <Button
        asChild
        size="lg"
        className="w-full bg-[#1a5237] text-white hover:bg-[#0f3d26]"
      >
        <a href={vcardUrl}>
          <Download className="mr-2 h-5 w-5" />
          Enregistrer le contact
        </a>
      </Button> */}

      <div className="space-y-4 rounded-xl border border-[#c9a865]/25 bg-linear-to-br from-[#1a5237]/5 via-white to-[#c9a865]/10 p-5">
        {employee.telephone && (
          <InfoRow
            icon={Phone}
            label="Téléphone"
            value={employee.telephone}
            href={`tel:${employee.telephone}`}
          />
        )}
        {employee.email && (
          <InfoRow
            icon={Mail}
            label="Email"
            value={employee.email}
            href={`mailto:${employee.email}`}
          />
        )}
        {employee.entreprise && (
          <InfoRow icon={Building2} label="Entreprise" value={employee.entreprise} />
        )}
        {employee.poste && <InfoRow icon={Briefcase} label="Poste" value={employee.poste} />}
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
    </div>
  );
}

export function ProfileFooter({ employee }: ProfileDetailsProps) {
  if (!employee.entreprise) return null;
  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <Image
        src="/logo FEG revectoriser.png"
        alt="Fédération des Entreprises du Gabon"
        width={72}
        height={72}
        priority
        className="h-16 w-auto object-contain"
      />
      <p className="text-center text-xs text-muted-foreground">
        Propulsé par la {employee.entreprise}
      </p>
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
