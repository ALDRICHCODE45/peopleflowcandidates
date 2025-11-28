import { CreateFileDto } from "../dtos/createFileDto.dto";
import { FileEntity } from "../entities/FileEntity.entity";
import { PrismaClient } from "@/app/generated/prisma/client";
import { FileRepository } from "./FileRepository.repository";
import { DeleteFileDto } from "../dtos/deleteFileDto.dto";
import { GetFileByCandidateDto } from "../dtos/GetFileByCandidateIdDto.dto";
import { toFileEntity } from "../mappers/toFileEntity.mapper";

type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export class PrismaFileRespository implements FileRepository {
  constructor(
    private readonly prisma: PrismaClient | PrismaTransactionClient,
  ) {}

  async createFile(data: CreateFileDto): Promise<FileEntity> {
    const fileAttachment = await this.prisma.fileAttachment.create({
      data: {
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        uploadedBy: data.uploadedBy || null,
      },
    });

    return toFileEntity(fileAttachment);
  }

  async deleteFile(data: DeleteFileDto): Promise<void> {
    await this.prisma.fileAttachment.delete({
      where: { id: data.id },
    });
  }

  async getByCandidateId(
    data: GetFileByCandidateDto,
  ): Promise<FileEntity | undefined> {
    const fileAttachment = await this.prisma.fileAttachment.findUnique({
      where: { id: data.id },
    });

    if (!fileAttachment) {
      return undefined;
    }

    return toFileEntity(fileAttachment);
  }
}
