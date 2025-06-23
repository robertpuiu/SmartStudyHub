import "server-only";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import PdfParse from "pdf-parse";

export const S3 = new S3Client({
  region: "auto",
  endpoint: "https://t3.storage.dev",
  forcePathStyle: false,
});

export async function fetchPdfBuffer(fileKey: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: fileKey,
  });
  const response = await S3.send(command);
  const streamBody = response.Body as Readable;
  const chunks: Buffer[] = [];
  for await (const chunk of streamBody) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function fetchPdfText(fileKey: string): Promise<string> {
  const buffer = await fetchPdfBuffer(fileKey);
  const { text } = await PdfParse(buffer);
  return text;
}

export async function textOfPDFMaterials(
  pdfMaterials: { fileKey: string }[]
): Promise<string[]> {
  const textPromises = pdfMaterials.map((material) =>
    fetchPdfText(material.fileKey)
  );

  return Promise.all(textPromises);
}
