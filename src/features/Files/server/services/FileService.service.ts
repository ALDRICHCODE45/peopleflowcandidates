import { Err, Ok, Result } from "@/core/shared/helpers/tryCatchResults.types";
import { FileRepository } from "../repositories/FileRepository.repository";
import { DigitalOceanSpacesService } from "./DigitalOceanSpacesService.service";
import { FileEntity } from "../entities/FileEntity.entity";
import { CreateFileDto } from "../dtos/createFileDto.dto";

export class FileService {
  constructor(
    private fileRespository: FileRepository,
    private spacesService: DigitalOceanSpacesService,
  ) { }

  /**
   * Sube un archivo a Digital Ocean Spaces y guarda la referencia en la base de datos
   */
  async uploadFile(
    file: File,
    uploadedBy?: string | undefined,
  ): Promise<Result<FileEntity, Error>> {
    try {
      console.log("File desde el FileService", file);
      // Subir archivo a Digital Ocean Spaces
      const fileUrl = await this.spacesService.uploadFile(file, "cvs");

      // Guardar referencia en la base de datos
      const createFileDto: CreateFileDto = {
        fileName: file.name,
        fileUrl,
        fileSize: file.size,
        mimeType: file.type,
        uploadedBy: uploadedBy,
      };

      const fileEntity = await this.fileRespository.createFile(createFileDto);

      return Ok(fileEntity);
    } catch (error) {
      return Err(
        error instanceof Error ? error : new Error("Error al subir el archivo"),
      );
    }
  }

  /**
   * Elimina un archivo de Digital Ocean Spaces y de la base de datos
   */
  async deleteFile(fileId: string): Promise<Result<void, Error>> {
    try {
      // Obtener información del archivo
      const fileEntity = await this.fileRespository.getByCandidateId({
        id: fileId,
      });

      if (!fileEntity) {
        return Err(new Error("Archivo no encontrado"));
      }

      // Eliminar de Digital Ocean Spaces
      await this.spacesService.deleteFile(fileEntity.fileUrl);

      // Eliminar de la base de datos
      await this.fileRespository.deleteFile({ id: fileId });

      return Ok(undefined);
    } catch (error) {
      return Err(
        error instanceof Error
          ? error
          : new Error("Error al eliminar el archivo"),
      );
    }
  }
}
