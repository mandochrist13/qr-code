import { NextResponse } from "next/server";
import { getEmployeeById } from "@/lib/employees";
import { generateVCard, getVCardFileName } from "@/lib/vcard";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const employee = getEmployeeById(id);

  if (!employee) {
    return new NextResponse("Employé introuvable", { status: 404 });
  }

  const vcard = generateVCard(employee);
  const fileName = getVCardFileName(employee);
  const encodedFileName = encodeURIComponent(fileName);

  return new NextResponse(vcard, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `inline; filename="${fileName}"; filename*=UTF-8''${encodedFileName}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  });
}
