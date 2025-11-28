import { CreateFileDto } from "../dtos/createFileDto.dto";
import { DeleteFileDto } from "../dtos/deleteFileDto.dto";
import { GetFileByCandidateDto } from "../dtos/GetFileByCandidateIdDto.dto";
import { FileEntity } from "../entities/FileEntity.entity";

export interface FileRepository {
  createFile(data: CreateFileDto): Promise<FileEntity>;
  deleteFile(data: DeleteFileDto): Promise<void>;
  getByCandidateId(
    data: GetFileByCandidateDto,
  ): Promise<FileEntity | undefined>;
}
