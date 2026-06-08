import * as fs from "fs";

const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46]);

export function assertPdfMagicNumber(filePath: string): void {
  const fd = fs.openSync(filePath, "r");
  const header = Buffer.alloc(4);
  try {
    fs.readSync(fd, header, 0, 4, 0);
  } finally {
    fs.closeSync(fd);
  }

  if (!header.equals(PDF_MAGIC)) {
    throw new Error("Arquivo rejeitado: assinatura de bytes inválida para PDF");
  }
}
