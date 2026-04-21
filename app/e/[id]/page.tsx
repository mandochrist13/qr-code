import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PublicProfile } from "@/components/public-profile";
import { getEmployeeById, getAllEmployees } from "@/lib/employees";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const employees = getAllEmployees();
  return employees.map((employee) => ({
    id: employee.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const employee = getEmployeeById(id);

  if (!employee) {
    return {
      title: "Employé non trouvé",
    };
  }

  return {
    title: `${employee.nomComplet} - ${employee.poste}`,
    description: employee.bioCourte || `Fiche professionnelle de ${employee.nomComplet}`,
    openGraph: {
      title: `${employee.nomComplet} - ${employee.poste}`,
      description: employee.bioCourte || `Fiche professionnelle de ${employee.nomComplet}`,
      images: employee.photoUrl ? [employee.photoUrl] : [],
    },
  };
}

export default async function EmployeePublicPage({ params }: PageProps) {
  const { id } = await params;
  const employee = getEmployeeById(id);

  if (!employee) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <PublicProfile employee={employee} />
    </div>
  );
}
