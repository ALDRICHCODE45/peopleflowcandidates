import prisma from "@/core/lib/prisma";
import { CandidatesTablePage } from "@/features/Dashboard/Candidates/pages/CandidatesTablePage";

// Forzar renderizado dinámico para evitar prerender durante el build
// Esto es necesario porque la página accede a la base de datos
export const dynamic = 'force-dynamic';

const getCandidatesData = async () => {
  try {
    const data = await prisma.candidate.findMany();
    return data;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Error desconocido';
    console.error('Error al fetchear datos de candidatos:', errorMessage);
    throw new Error(`Error al fetchear data: ${errorMessage}`);
  }
};

const CandidatesPage = async () => {
  const candidates = await getCandidatesData();

  return (
    <>
      <CandidatesTablePage data={candidates} />
    </>
  );
};

export default CandidatesPage;
