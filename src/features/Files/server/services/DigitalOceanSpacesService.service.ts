import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { env } from "@/core/shared/config/env.config";
import { randomUUID } from "crypto";

// Tipos MIME permitidos para documentos (CVs)
const ALLOWED_MIME_TYPES = [
  // PDF
  "application/pdf",
  // Word documents
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

export class DigitalOceanSpacesService {
  private s3Client: S3Client;
  private bucket: string;
  private endpoint: string;

  constructor() {
    this.bucket = env.DO_SPACES_BUCKET;

    // Extraer el endpoint base sin el bucket
    // Si el endpoint es https://peopleflowcandidates.sfo3.digitaloceanspaces.com
    // El endpoint base debe ser https://sfo3.digitaloceanspaces.com
    const endpointUrl = new URL(env.DO_SPACES_ENDPOINT);
    const hostnameParts = endpointUrl.hostname.split(".");

    // Si el primer segmento es el bucket, lo removemos
    // bdpsystem.sfo3.digitaloceanspaces.com -> sfo3.digitaloceanspaces.com
    if (hostnameParts[0] === this.bucket) {
      hostnameParts.shift();
    }

    const baseHostname = hostnameParts.join(".");
    const baseEndpoint = `${endpointUrl.protocol}//${baseHostname}`;
    this.endpoint = baseEndpoint;

    this.s3Client = new S3Client({
      endpoint: baseEndpoint,
      region: env.DO_SPACES_REGION,
      credentials: {
        accessKeyId: env.DO_ACCESS_KEY,
        secretAccessKey: env.DO_SECRET_KEY,
      },
      forcePathStyle: true, // Usar path-style para Digital Ocean Spaces
    });
  }

  /**
   * Valida el tipo MIME del archivo
   */
  private validateMimeType(mimeType: string): boolean {
    return ALLOWED_MIME_TYPES.includes(mimeType);
  }

  /**
   * Genera un nombre único para el archivo
   */
  private generateUniqueFileName(
    originalFileName: string,
    folder: string,
  ): string {
    const extension = originalFileName.split(".").pop();
    const uniqueId = randomUUID();
    const timestamp = Date.now();
    return `${folder}/${timestamp}-${uniqueId}.${extension}`;
  }

  /**
   * Sube un archivo a Digital Ocean Spaces
   * @param file - El archivo a subir
   * @param folder - La carpeta donde se guardará (ej: "facturas", "egresos")
   * @returns La URL del archivo subido
   */
  async uploadFile(file: File, folder: string): Promise<string> {
    // Validar tipo MIME
    if (!this.validateMimeType(file.type)) {
      throw new Error(
        `Tipo de archivo no permitido: ${file.type}. Tipos permitidos: PDF, Word (.doc, .docx)`,
      );
    }

    // Validar tamaño (máximo 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`El archivo excede el tamaño máximo permitido de 10MB`);
    }

    // Generar nombre único
    const fileName = this.generateUniqueFileName(file.name, folder);

    // Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir a Digital Ocean Spaces
    // Nota: Removemos ACL "public-read" ya que puede causar "Access Denied"
    // El bucket debe estar configurado como público en Digital Ocean Spaces
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read", // <--- ESTO ES LA CLAVE
      // ACL removido - usar configuración del bucket en lugar de ACL por objeto
      // Si necesitas archivos públicos, configura el bucket como público en Digital Ocean
    });

    try {
      await this.s3Client.send(command);

      // Construir la URL pública del archivo
      // Con forcePathStyle: true, la URL es: endpoint/bucket/key
      const fileUrl = `${this.endpoint}/${this.bucket}/${fileName}`;
      return fileUrl;
    } catch (error) {
      // Mejorar el mensaje de error con más detalles para debugging
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";

      // Log detallado del error para debugging
      console.error("Error detallado de Digital Ocean Spaces:", {
        error: errorMessage,
        bucket: this.bucket,
        endpoint: this.endpoint,
        region: env.DO_SPACES_REGION,
        fileName,
        hasAccessKey: !!env.DO_ACCESS_KEY,
        hasSecretKey: !!env.DO_SECRET_KEY,
      });

      // Proporcionar mensaje más útil según el tipo de error
      if (errorMessage.includes("Access Denied")) {
        throw new Error(
          `Acceso denegado al subir el archivo. Verifica que:
1. Las credenciales (DO_ACCESS_KEY y DO_SECRET_KEY) sean correctas
2. El bucket "${this.bucket}" exista y tenga permisos de escritura
3. La región "${env.DO_SPACES_REGION}" sea correcta
4. El endpoint "${env.DO_SPACES_ENDPOINT}" sea válido
5. Si necesitas archivos públicos, configura el bucket como público en Digital Ocean Spaces (no uses ACL por objeto)`,
        );
      }

      throw new Error(
        `Error al subir el archivo a Digital Ocean Spaces: ${errorMessage}`,
      );
    }
  }

  /**
   * Elimina un archivo de Digital Ocean Spaces
   * @param fileUrl - La URL del archivo a eliminar
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extraer el key del archivo desde la URL
      // URL format con forcePathStyle: https://sfo3.digitaloceanspaces.com/bdpsystem/folder/timestamp-uuid.ext
      const url = new URL(fileUrl);
      // Remover el bucket del pathname: /bdpsystem/folder/file.ext -> /folder/file.ext
      const pathParts = url.pathname.split("/").filter(Boolean);
      if (pathParts[0] === this.bucket) {
        pathParts.shift(); // Remover el bucket
      }
      const key = pathParts.join("/");

      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      throw new Error(
        `Error al eliminar el archivo de Digital Ocean Spaces: ${error instanceof Error ? error.message : "Error desconocido"
        }`,
      );
    }
  }
}
