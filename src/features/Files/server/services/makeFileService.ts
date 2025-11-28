import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaFileRespository } from "../repositories/PrismaFileRepository.repository";
import { FileService } from "./FileService.service";
import { DigitalOceanSpacesService } from "./DigitalOceanSpacesService.service";

export function makeFileService({ prisma }: { prisma: PrismaClient }) {
  const fileRepository = new PrismaFileRespository(prisma);
  const spacesService = new DigitalOceanSpacesService();
  return new FileService(fileRepository, spacesService);
}
