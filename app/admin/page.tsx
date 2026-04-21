import { Users, CreditCard, QrCode } from "lucide-react";
import { Header } from "@/components/header";
import { EmployeeCard } from "@/components/employee-card";
import { getAllEmployees } from "@/lib/employees";

export const metadata = {
  title: "Administration - Cartes Professionnelles",
  description: "Gérez les cartes professionnelles de vos employés",
};

export default function AdminPage() {
  const employees = getAllEmployees();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Gestion des Cartes
          </h1>
          <p className="mt-2 text-muted-foreground">
            Consultez et gérez les cartes professionnelles de vos collaborateurs.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={Users}
            label="Employés"
            value={employees.length.toString()}
          />
          <StatCard
            icon={CreditCard}
            label="Cartes actives"
            value={employees.length.toString()}
          />
          <StatCard
            icon={QrCode}
            label="QR Codes générés"
            value={employees.length.toString()}
          />
        </div>

        <div className="mb-6 rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Comment ça fonctionne ?
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                1
              </span>
              <span>
                Chaque employé possède une fiche publique accessible via une URL unique.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                2
              </span>
              <span>
                Le QR code encode cette URL et peut être imprimé sur la carte professionnelle.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                3
              </span>
              <span>
                Les visiteurs peuvent scanner le code et enregistrer le contact directement via vCard.
              </span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Liste des employés
          </h2>
          {employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
              <Users className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                Aucun employé enregistré pour le moment.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {employees.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
