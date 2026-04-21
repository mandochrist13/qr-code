import type { Employee } from "@/lib/types";
import { slugifyFileName } from "@/lib/publicUrl";

function escapeVCardValue(value: string): string {
  if (!value) return "";
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }
  const lastName = parts.pop() as string;
  return { firstName: parts.join(" "), lastName };
}

export function generateVCard(employee: Employee): string {
  const { firstName, lastName } = splitFullName(employee.nomComplet);

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCardValue(lastName)};${escapeVCardValue(firstName)};;;`,
    `FN:${escapeVCardValue(employee.nomComplet)}`,
    employee.entreprise ? `ORG:${escapeVCardValue(employee.entreprise)}` : null,
    employee.poste ? `TITLE:${escapeVCardValue(employee.poste)}` : null,
    employee.telephone ? `TEL;TYPE=WORK,VOICE:${escapeVCardValue(employee.telephone)}` : null,
    employee.email ? `EMAIL;TYPE=WORK,INTERNET:${escapeVCardValue(employee.email)}` : null,
    employee.adresse
      ? `ADR;TYPE=WORK:;;${escapeVCardValue(employee.adresse)};;;;`
      : null,
    employee.siteWeb ? `URL:${escapeVCardValue(employee.siteWeb)}` : null,
    employee.bioCourte ? `NOTE:${escapeVCardValue(employee.bioCourte)}` : null,
    "END:VCARD",
  ].filter((line): line is string => Boolean(line));

  return lines.join("\r\n");
}

export function getVCardFileName(employee: Employee): string {
  const slug = slugifyFileName(employee.nomComplet) || employee.id;
  return `${slug}.vcf`;
}
