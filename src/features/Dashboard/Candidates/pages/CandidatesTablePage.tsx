import { Candidate } from "@/app/generated/prisma/client";
import { DataTable } from "@/core/shared/components/DataTable/DataTable";
import { TablePresentation } from "@/core/shared/components/DataTable/TablePresentation";
import { CandidatesColumns } from "../components/columns/CandidatesColumns";

interface CandidatesTablePageInterface {
  data: Candidate[];
}

export const CandidatesTablePage = ({ data }: CandidatesTablePageInterface) => {
  return (
    <div className="container mx-auto py-6">
      <TablePresentation
        subtitle="Administra los candidatos que ingresan directamente del formulario en este apartado"
        title="Gestión de Candidato"
      />
      <DataTable columns={CandidatesColumns} data={data} />
    </div>
  );
};
