import { PDFParse } from 'pdf-parse';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const uint8Array = new Uint8Array(buffer);
  const parser = new PDFParse({data: uint8Array});
  const data = await parser.getText();
  return data.text.trim();
}