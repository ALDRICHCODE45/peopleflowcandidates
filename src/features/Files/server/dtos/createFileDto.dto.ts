export interface CreateFileDto {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy?: string;
  candidate?: string;
}
