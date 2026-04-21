import { toPng } from "html-to-image";
import { slugifyFileName } from "@/lib/publicUrl";

export { getEmployeePublicUrl, getBaseUrl } from "@/lib/publicUrl";

export async function downloadQRCodeFromElement(
  element: HTMLElement,
  fileBaseName: string,
): Promise<void> {
  const dataUrl = await toPng(element, {
    quality: 1,
    pixelRatio: 3,
    backgroundColor: "#ffffff",
    cacheBust: true,
  });

  const link = document.createElement("a");
  link.download = `${slugifyFileName(fileBaseName) || "qrcode"}_qrcode.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function downloadQRCodeById(
  elementId: string,
  fileBaseName: string,
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`QR code element not found: ${elementId}`);
  }
  await downloadQRCodeFromElement(element, fileBaseName);
}
