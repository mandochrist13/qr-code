import { employees } from "@/data/employees";
import type { Employee } from "@/lib/types";

export function getAllEmployees(): Employee[] {
  return employees;
}

export function getEmployeeById(id: string): Employee | undefined {
  return employees.find((employee) => employee.id === id);
}

export function employeeExists(id: string): boolean {
  return employees.some((employee) => employee.id === id);
}
