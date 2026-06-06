import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const STRATUM_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-3.1-pro-preview"
];

export const stratumAnalysisSchema = {
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
