import prisma from "@/core/lib/prisma";
import { CandidatesTablePage } from "@/features/Dashboard/Candidates/pages/CandidatesTablePage";

const getCandidatesData = async () => {
  try {
    const data = await prisma.candidate.findMany();
    return data;
  } catch (e) {
    throw new Error("Error al fetchear data");
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
