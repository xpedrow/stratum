import { Request, Response } from "express";
import { analyzeResume } from "../services/analyzer";
import * as fs from "fs";

export async function handleResumeUpload(req: Request, res: Response): Promise<void> {
  const file = req.file;
  const vaga = req.body.vaga;

  if (!file) {
    res.status(400).json({ error: "Nenhum arquivo enviado" });
    return;
  }

  try {
    const analysis = await analyzeResume({
      filePath: file.path,
      vaga
    });

    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Erro interno no servidor" });
  } finally {
    if (file && file.path) {
      fs.unlink(file.path, () => {});
    }
  }
}
