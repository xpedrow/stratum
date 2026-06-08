import { Request, Response } from "express";
import { analyzeResume } from "../services/analyzer";
import { assertPdfMagicNumber } from "../lib/pdfValidator";
import * as fs from "fs";

export async function handleResumeUpload(req: Request, res: Response): Promise<void> {
  const file = req.file;
  const vaga: string | undefined = req.body.vaga;

  if (!file) {
    res.status(400).json({ error: "Nenhum arquivo enviado" });
    return;
  }

  try {
    assertPdfMagicNumber(file.path);

    const analysis = await analyzeResume({
      filePath: file.path,
      sanitizedName: file.filename,
      vaga
    });

    res.json(analysis);
  } catch (error: unknown) {
    const isValidationError =
      error instanceof Error &&
      error.message.startsWith("Arquivo rejeitado");

    if (isValidationError) {
      res.status(422).json({ error: (error as Error).message });
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      console.error("[upload] Erro interno:", error);
    }

    res.status(500).json({ error: "Erro interno no servidor" });
  } finally {
    if (file?.path) {
      fs.unlink(file.path, () => {});
    }
  }
}
