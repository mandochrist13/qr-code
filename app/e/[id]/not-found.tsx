import Link from "next/link";
import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmployeeNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="mx-auto flex max-w-md flex-col items-center rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <UserX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          Employé introuvable
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Cette fiche professionnelle n'existe pas ou a été supprimée.
          Le QR code que vous avez scanné n'est peut-être plus valide.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/admin">Voir les fiches disponibles</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
