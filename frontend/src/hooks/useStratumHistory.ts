import { useState, useEffect, useCallback } from "react";

export interface StratumAnalysis {
  candidate: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
  };
  profile: {
    professional_summary: string;
    years_of_experience: number;
    estimated_seniority_level: "Junior" | "Mid" | "Senior" | "Lead";
  };
  skills: {
    hard_skills: string[];
    soft_skills: string[];
  };
  professional_history: Array<{
    company: string;
    role: string;
    period: string;
    main_activities: string[];
  }>;
  job_match?: {
    score: number;
    justification: string;
    strengths: string[];
    gaps_identified: string[];
  };
}

export interface SavedAnalysis {
  id: string;
  timestamp: number;
  candidateName: string;
  roleName: string;
  matchScore: number;
  latency: number;
  analysisData: StratumAnalysis;
}

interface ErrorWithCode extends Error {
  code?: number;
}

const saveToLocalStorage = (items: SavedAnalysis[]): SavedAnalysis[] => {
  try {
    localStorage.setItem("stratum_analyses", JSON.stringify(items));
    return items;
  } catch (error) {
    const err = error as ErrorWithCode;
    const isQuotaError =
      err.name === "QuotaExceededError" ||
      err.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
      err.code === 22 ||
      err.code === 1014;

    if (isQuotaError && items.length > 3) {
      const reducedItems = items.slice(0, -3);
      return saveToLocalStorage(reducedItems);
    }

    if (isQuotaError) {
      localStorage.removeItem("stratum_analyses");
      return [];
    }

    return items;
  }
};

export function useStratumHistory(limit = 20) {
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("stratum_analyses");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SavedAnalysis[];
        setSavedAnalyses(parsed.sort((a, b) => b.timestamp - a.timestamp));
      } catch (e) {
      }
    }
  }, []);

  const addAnalysis = useCallback((data: StratumAnalysis, roleName: string, latency: number) => {
    const newAnalysis: SavedAnalysis = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      candidateName: data.candidate.name,
      roleName,
      matchScore: data.job_match?.score || 0,
      latency,
      analysisData: data
    };

    setSavedAnalyses((prev) => {
      let updated = [newAnalysis, ...prev];
      if (updated.length > limit) {
        updated = updated.slice(0, limit);
      }
      const sorted = updated.sort((a, b) => b.timestamp - a.timestamp);
      return saveToLocalStorage(sorted);
    });
  }, [limit]);

  const deleteAnalysis = useCallback((id: string) => {
    setSavedAnalyses((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      return saveToLocalStorage(updated);
    });
  }, []);

  const clearAll = useCallback(() => {
    setSavedAnalyses([]);
    localStorage.removeItem("stratum_analyses");
  }, []);

  return {
    savedAnalyses,
    addAnalysis,
    deleteAnalysis,
    clearAll
  };
}
