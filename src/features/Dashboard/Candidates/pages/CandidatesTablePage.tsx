import { TablePresentation } from "@/core/shared/components/DataTable/TablePresentation";

export const CandidatesTablePage = () => {
  return (
    <div className="container mx-auto py-6">
      <TablePresentation
        subtitle="Administra los candidatos que ingresan directamente del formulario en este apartado"
        title="Gestión de Candidato"
      />
    </div>
  );
};
