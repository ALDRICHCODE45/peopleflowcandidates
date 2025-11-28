import { FileAttachment } from "@/app/generated/prisma/client";
import { FileEntity } from "../entities/FileEntity.entity";

export const toFileEntity = (prismaFileModel: FileAttachment): FileEntity => {
  return {
    id: prismaFileModel.id,
    fileName: prismaFileModel.fileName,
    fileSize: prismaFileModel.fileSize,
    fileUrl: prismaFileModel.fileUrl,
    mimeType: prismaFileModel.mimeType,
  };
};

export const toManyEntities = (
  prismaFilesModels: FileAttachment[],
): FileEntity[] => {
  return prismaFilesModels.map((prismaFile) => {
    return toFileEntity(prismaFile);
  });
};
