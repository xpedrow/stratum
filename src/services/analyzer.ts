import { ai, STRATUM_MODELS, stratumAnalysisSchema } from "../config/gemini";
import * as fs from "fs";

export interface AnalysisInput {
  filePath: string;
  vaga?: string;
}

export async function analyzeResume(input: AnalysisInput): Promise<any> {
  const uploadResult = await ai.files.upload({
    file: input.filePath,
    config: {
      mimeType: "application/pdf"
    }
  });

  const uploadName = uploadResult.name;
  if (!uploadName) {
    throw new Error("Falha ao obter o nome do arquivo enviado");
  }

  try {
    let file = await ai.files.get({ name: uploadName });
    while (file.state === "PROCESSING") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      file = await ai.files.get({ name: uploadName });
    }

    if (file.state !== "ACTIVE") {
      throw new Error("Falha ao processar o arquivo no Gemini");
    }

    if (!file.uri || !file.mimeType) {
      throw new Error("Arquivo sem URI ou MIME type");
    }

    const systemInstruction = "Você é o motor de IA do Stratum, um parseador de currículos cirúrgico e de alta precisão. Sua tarefa é analisar o arquivo fornecido (PDF) e extrair os dados com fidelidade absoluta ao documento. Não invente ou assuma dados não explícitos. Se uma informação não for encontrada, retorne o campo vazio ou array vazio. Remova qualquer formatação textual ou ruído do arquivo original, normalizando as competências para termos técnicos de mercado padrão.";

    let prompt = "Analise o currículo anexo e extraia as informações estruturadas de acordo com o schema especificado.";
    if (input.vaga) {
      prompt += `\n\nAdicionalmente, avalie o candidato em relação à seguinte vaga:\n${input.vaga}`;
    }

    let lastError: any = null;

    try {
      const primaryModel = STRATUM_MODELS[0];
      const response = await ai.models.generateContent({
        model: primaryModel,
        contents: [
          {
            fileData: {
              fileUri: file.uri,
              mimeType: file.mimeType
            }
          },
          prompt
        ],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: stratumAnalysisSchema
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Nenhum conteúdo retornado pelo modelo principal");
      }

      const parsed = JSON.parse(text);
      parsed._meta = {
        modelUsed: primaryModel,
        fallbacksTriggered: 0
      };

      return parsed;
    } catch (err: any) {
      console.warn(`Falha ou limite de requisições no modelo principal: ${err.message || err}`);
      lastError = err;

      const fallbackModel = STRATUM_MODELS[1];
      console.log(`Disparando fallback imediato para ${fallbackModel}...`);

      try {
        const response = await ai.models.generateContent({
          model: fallbackModel,
          contents: [
            {
              fileData: {
                fileUri: file.uri,
                mimeType: file.mimeType
              }
            },
            prompt
          ],
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: stratumAnalysisSchema
          }
        });

        const text = response.text;
        if (!text) {
          throw new Error("Nenhum conteúdo retornado pelo modelo de fallback");
        }

        const parsed = JSON.parse(text);
        parsed._meta = {
          modelUsed: fallbackModel,
          fallbacksTriggered: 1
        };

        return parsed;
      } catch (fallbackErr: any) {
        lastError = fallbackErr;
        console.error(`Falha também no modelo de fallback: ${fallbackErr.message || fallbackErr}`);
      }
    }

    throw new Error(`Todos os modelos falharam. Erro final: ${lastError?.message || lastError}`);
  } finally {
    try {
      await ai.files.delete({ name: uploadName });
    } catch {
    }
  }
}
