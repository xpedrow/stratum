import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const STRATUM_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-3.1-pro-preview"
];

const stratumAnalysisSchema = {
  type: "object",
  properties: {
    candidate: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        location: { type: "string" },
        linkedin: { type: "string" }
      },
      required: ["name", "email", "phone", "location"]
    },
    profile: {
      type: "object",
      properties: {
        professional_summary: { type: "string" },
        years_of_experience: { type: "number" },
        estimated_seniority_level: {
          type: "string",
          enum: ["Junior", "Mid", "Senior", "Lead"]
        }
      },
      required: ["professional_summary", "years_of_experience", "estimated_seniority_level"]
    },
    skills: {
      type: "object",
      properties: {
        hard_skills: {
          type: "array",
          items: { type: "string" }
        },
        soft_skills: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["hard_skills", "soft_skills"]
    },
    professional_history: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: { type: "string" },
          role: { type: "string" },
          period: { type: "string" },
          main_activities: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["company", "role", "period", "main_activities"]
      }
    },
    job_match: {
      type: "object",
      properties: {
        score: { type: "number" },
        justification: { type: "string" },
        strengths: {
          type: "array",
          items: { type: "string" }
        },
        gaps_identified: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["score", "justification", "strengths", "gaps_identified"]
    }
  },
  required: ["candidate", "profile", "skills", "professional_history"]
};

export async function POST(request: NextRequest) {
  let tempFilePath = "";
  let uploadName = "";

  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File | null;
    const vaga = formData.get("vaga") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempDir = os.tmpdir();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    tempFilePath = path.join(tempDir, `resume-${uniqueSuffix}.pdf`);

    await fs.promises.writeFile(tempFilePath, buffer);

    const uploadResult = await ai.files.upload({
      file: tempFilePath,
      config: {
        mimeType: "application/pdf"
      }
    });

    if (!uploadResult.name) {
      throw new Error("Falha ao obter o nome do arquivo enviado");
    }
    uploadName = uploadResult.name;

    let geminiFile = await ai.files.get({ name: uploadName });
    while (geminiFile.state === "PROCESSING") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      geminiFile = await ai.files.get({ name: uploadName });
    }

    if (geminiFile.state !== "ACTIVE") {
      throw new Error("Falha ao processar o arquivo no Gemini");
    }

    if (!geminiFile.uri || !geminiFile.mimeType) {
      throw new Error("Arquivo sem URI ou MIME type");
    }

    const systemInstruction = "Você é o motor de IA do Stratum, um parseador de currículos cirúrgico e de alta precisão. Sua tarefa é analisar o arquivo fornecido (PDF) e extrair os dados com fidelidade absoluta ao documento. Não invente ou assuma dados não explícitos. Se uma informação não for encontrada, retorne o campo vazio ou array vazio. Remova qualquer formatação textual ou ruído do arquivo original, normalizando as competências para termos técnicos de mercado padrão.";

    let prompt = "Analise o currículo anexo e extraia as informações estruturadas de acordo com o schema especificado.";
    if (vaga) {
      prompt += `\n\nAdicionalmente, avalie o candidato em relação à seguinte vaga:\n${vaga}`;
    }

    let lastError: any = null;

    try {
      const primaryModel = STRATUM_MODELS[0];
      const response = await ai.models.generateContent({
        model: primaryModel,
        contents: [
          {
            fileData: {
              fileUri: geminiFile.uri,
              mimeType: geminiFile.mimeType
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

      return NextResponse.json(parsed);
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
                fileUri: geminiFile.uri,
                mimeType: geminiFile.mimeType
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

        return NextResponse.json(parsed);
      } catch (fallbackErr: any) {
        lastError = fallbackErr;
        console.error(`Falha também no modelo de fallback: ${fallbackErr.message || fallbackErr}`);
      }
    }

    throw new Error(`Todos os modelos falharam. Erro final: ${lastError?.message || lastError}`);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro interno no servidor" }, { status: 500 });
  } finally {
    if (tempFilePath) {
      fs.unlink(tempFilePath, () => { });
    }
    if (uploadName) {
      try {
        await ai.files.delete({ name: uploadName });
      } catch { }
    }
  }
}
