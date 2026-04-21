import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-primary">Erreur 404</p>
        <h1 className="mt-2 text-2xl font-bold text-foreground">Page introuvable</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/admin">Retour à l'administration</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
