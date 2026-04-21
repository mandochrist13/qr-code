"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Download, Eye, Phone, Mail, User, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QRCodeDisplay } from "@/components/qr-code-display";
import type { Employee } from "@/lib/types";
import { downloadVCard } from "@/lib/vcard";
import { downloadQRCodeById } from "@/lib/qr-utils";
import { getEmployeePublicUrl } from "@/lib/publicUrl";

interface EmployeeCardProps {
  employee: Employee;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const handleDownloadVCard = () => {
    downloadVCard(employee);
  };

  const handleDownloadQR = async () => {
    try {
      await downloadQRCodeById(`qr-${employee.id}`, employee.nomComplet);
    } catch (error) {
      console.error("Impossible de télécharger le QR code:", error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getEmployeePublicUrl(employee.id));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Impossible de copier le lien:", error);
    }
  };

  const showImage = Boolean(employee.photoUrl) && !imageFailed;

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative flex items-center justify-center bg-muted p-6 sm:w-48">
            {showImage ? (
              <Image
                src={employee.photoUrl}
                alt={employee.nomComplet}
                width={120}
                height={120}
                onError={() => setImageFailed(true)}
                className="h-24 w-24 rounded-full object-cover ring-4 ring-background"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary ring-4 ring-background">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {employee.nomComplet}
              </h3>
              <p className="text-sm font-medium text-primary">{employee.poste}</p>
              <div className="mt-3 flex flex-col gap-1.5">
                <a
                  href={`tel:${employee.telephone}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Phone className="h-4 w-4" />
                  <span>{employee.telephone}</span>
                </a>
                <a
                  href={`mailto:${employee.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{employee.email}</span>
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button asChild size="sm" variant="default">
                <Link href={`/e/${employee.id}`}>
                  <Eye className="mr-1.5 h-4 w-4" />
                  Voir la fiche
                </Link>
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownloadQR}>
                <Download className="mr-1.5 h-4 w-4" />
                QR code
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownloadVCard}>
                <Download className="mr-1.5 h-4 w-4" />
                vCard
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCopyLink}>
                {copied ? (
                  <>
                    <Check className="mr-1.5 h-4 w-4" />
                    Copié
                  </>
                ) : (
                  <>
                    <Link2 className="mr-1.5 h-4 w-4" />
                    Copier le lien
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="hidden items-center justify-center border-l border-border p-4 lg:flex">
            <QRCodeDisplay employeeId={employee.id} size={96} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
