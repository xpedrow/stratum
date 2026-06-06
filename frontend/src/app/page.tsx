"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadSimple, 
  FilePdf, 
  Briefcase, 
  EnvelopeSimple, 
  LinkedinLogo, 
  Spinner, 
  User, 
  Clock, 
  MapPin, 
  Trash, 
  Sparkle,
  Check,
  CheckCircle,
  WarningCircle,
  FileText,
  IdentificationCard,
  Code,
  Database,
  Terminal,
  Globe,
  Stack,
  BracketsCurly,
  GitBranch,
  Cloud,
  Desktop,
  Cpu,
  Monitor,
  Heart
} from "@phosphor-icons/react";
import { Gauge } from "@/components/Gauge";
import { Timeline } from "@/components/Timeline";

interface StratumAnalysis {
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

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 18 } }
};

function getSkillIcon(skillName: string) {
  const name = skillName.toLowerCase();
  if (name.includes("typescript") || name.includes("javascript") || name.includes("js") || name.includes("ts")) {
    return <Code className="w-3.5 h-3.5 text-yellow-400" />;
  }
  if (name.includes("sql") || name.includes("postgres") || name.includes("database") || name.includes("banco")) {
    return <Database className="w-3.5 h-3.5 text-cyan-400" />;
  }
  if (name.includes("python") || name.includes("lua") || name.includes("ruby") || name.includes("go")) {
    return <BracketsCurly className="w-3.5 h-3.5 text-blue-400" />;
  }
  if (name.includes("react") || name.includes("next") || name.includes("vue") || name.includes("angular")) {
    return <Desktop className="w-3.5 h-3.5 text-sky-400" />;
  }
  if (name.includes("node") || name.includes("express") || name.includes("nest") || name.includes("api")) {
    return <Cpu className="w-3.5 h-3.5 text-green-400" />;
  }
  if (name.includes("git") || name.includes("github") || name.includes("gitlab")) {
    return <GitBranch className="w-3.5 h-3.5 text-orange-400" />;
  }
  if (name.includes("docker") || name.includes("container") || name.includes("kubernetes")) {
    return <Cloud className="w-3.5 h-3.5 text-blue-500" />;
  }
  if (name.includes("vercel") || name.includes("supabase") || name.includes("firebase") || name.includes("cloud")) {
    return <Cloud className="w-3.5 h-3.5 text-purple-400" />;
  }
  if (name.includes("shell") || name.includes("scripting") || name.includes("bash") || name.includes("linux")) {
    return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
  }
  if (name.includes("css") || name.includes("html") || name.includes("tailwind") || name.includes("design")) {
    return <Monitor className="w-3.5 h-3.5 text-pink-400" />;
  }
  return <Stack className="w-3.5 h-3.5 text-gray-400" />;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [vaga, setVaga] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<StratumAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Por favor, envie apenas arquivos no formato PDF.");
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Por favor, envie apenas arquivos no formato PDF.");
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalysis = async () => {
    if (!file) {
      setError("Por favor, selecione um arquivo PDF.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("resume", file);
    if (vaga) {
      formData.append("vaga", vaga);
    }

    try {
      const response = await fetch("http://localhost:3000/api/analisar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ocorreu um erro ao analisar o currículo.");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || "Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-[#090B11] text-gray-300 font-sans antialiased selection:bg-[#00FF9D]/30 selection:text-white">
      <div className="w-full h-full max-w-[1440px] mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 h-full flex flex-col justify-center">
          <div className="bg-[#121620] border border-white/5 rounded-[20px] p-5 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00FF9D]/10 flex items-center justify-center border border-[#00FF9D]/20">
                <Sparkle className="w-5.5 h-5.5 text-[#00FF9D]" />
              </div>
              <div>
                <h1 className="text-md font-bold text-white tracking-wider">STRATUM</h1>
                <p className="text-[10px] text-gray-400 font-medium">Analisador de Currículos de Alta Precisão</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {file ? (
                <motion.div
                  key="compact-file"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border border-[#00FF9D]/30 bg-[#00FF9D]/5 rounded-xl p-5 flex flex-col items-center justify-center gap-2 relative group shadow-[0_0_15px_rgba(0,255,157,0.03)]"
                >
                  <FilePdf className="w-10 h-10 text-[#00FF9D]" />
                  <p className="text-xs font-semibold text-white break-all text-center">{file.name}</p>
                  <p className="text-[10px] text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-gray-800/60 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="upload-zone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={onButtonClick}
                  className={`border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                    isDragActive 
                      ? "border-[#00FF9D] bg-[#00FF9D]/5 shadow-[0_0_15px_rgba(0,255,157,0.05)]" 
                      : "bg-[#090B11]/40 hover:border-[#00FF9D]/40 hover:bg-[#00FF9D]/5"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <UploadSimple className="w-8 h-8 text-gray-500" />
                  <span className="text-xs text-gray-300 font-semibold">Arraste o currículo PDF</span>
                  <span className="text-[10px] text-gray-500">ou clique para selecionar</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-gray-500" /> Vaga de Emprego (Opcional)
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={vaga}
                  onChange={(e) => setVaga(e.target.value)}
                  placeholder="Full-Stack Developer"
                  className="w-full bg-[#090B11] border border-white/5 rounded-xl py-3 pl-4 pr-10 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#00FF9D]/50 focus:ring-1 focus:ring-[#00FF9D]/20 transition-all"
                />
                <FileText className="w-4 h-4 text-gray-500 absolute right-4" />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-[10px] flex items-center gap-2"
              >
                <WarningCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              onClick={handleAnalysis}
              disabled={loading || !file}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#00FF9D] to-[#00E58C] disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 text-[#090B11] font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(0,255,157,0.12)] hover:shadow-[0_4px_25px_rgba(0,255,157,0.22)] disabled:shadow-none cursor-pointer text-xs relative overflow-hidden group"
            >
              {loading ? (
                <>
                  <Spinner className="w-4 h-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <span>Começar Análise</span>
                  <CheckCircle className="w-4 h-4 absolute right-4 text-[#090B11]" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 h-full overflow-y-auto pr-2 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#121620] border border-white/5 rounded-[20px] p-6 shadow-2xl flex flex-col gap-6 animate-pulse"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="h-7 w-2/5 bg-gray-800/80 rounded-lg" />
                    <div className="h-4 w-3/5 bg-gray-800/80 rounded-lg" />
                  </div>
                  <div className="h-9 w-24 bg-gray-800/80 rounded-full" />
                </div>
                <hr className="border-white/5" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-16 bg-gray-800/80 rounded-xl" />
                  <div className="h-16 bg-gray-800/80 rounded-xl" />
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-1/4 bg-gray-800/80 rounded-lg" />
                  <div className="h-28 bg-gray-800/80 rounded-xl" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-1/5 bg-gray-800/80 rounded-lg" />
                  <div className="h-32 bg-gray-800/80 rounded-xl" />
                </div>
              </motion.div>
            ) : analysis ? (
              <motion.div
                key="results"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="bg-[#121620] border border-white/5 rounded-[20px] p-6 shadow-2xl flex flex-col gap-6"
              >
                <motion.div variants={staggerItem} className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">{analysis.candidate.name}</h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <EnvelopeSimple className="w-4 h-4 text-gray-500" />
                        {analysis.candidate.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        {analysis.candidate.location}
                      </span>
                      {analysis.candidate.linkedin && (
                        <a
                          href={analysis.candidate.linkedin.startsWith("http") ? analysis.candidate.linkedin : `https://${analysis.candidate.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[#00FF9D] hover:underline"
                        >
                          <LinkedinLogo className="w-4 h-4 text-[#00FF9D]" />
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-1">
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Senioridade Estimada</span>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {analysis.profile.estimated_seniority_level}
                    </span>
                  </div>
                </motion.div>

                <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                  <div className="bg-[#090B11] border border-white/5 rounded-xl p-4 flex items-center justify-start gap-3.5 min-h-full">
                    <div className="w-10 h-10 rounded-lg bg-gray-800/40 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider">Tempo de Experiência</span>
                      <span className="text-xs font-bold text-white font-mono">{analysis.profile.years_of_experience} anos</span>
                    </div>
                  </div>
                  <div className="bg-[#090B11] border border-white/5 rounded-xl p-4 flex items-start justify-start gap-3.5 min-h-full">
                    <div className="w-10 h-10 rounded-lg bg-gray-800/40 flex items-center justify-center flex-shrink-0 mt-1">
                      <IdentificationCard className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider">Resumo Profissional</span>
                      <span className="text-xs text-zinc-100 font-semibold block break-words leading-loose">
                        {analysis.profile.professional_summary}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {analysis.job_match && (
                  <motion.div variants={staggerItem} className="bg-[#090B11] border border-white/5 rounded-xl p-5 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                      <Gauge score={analysis.job_match.score} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Avaliação de Fit</h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">{analysis.job_match.justification}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase font-bold tracking-wider text-[#00FF9D]">Pontos Fortes</span>
                          <ul className="space-y-1">
                            {analysis.job_match.strengths.map((ponto, pIdx) => (
                              <li key={pIdx} className="text-xs text-gray-300 flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-[#00FF9D] mt-0.5 flex-shrink-0" />
                                <span className="leading-relaxed">{ponto}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase font-bold tracking-wider text-orange-400">Lacunas</span>
                          <ul className="space-y-1">
                            {analysis.job_match.gaps_identified.map((lacuna, lIdx) => (
                              <li key={lIdx} className="text-xs text-gray-300 flex items-start gap-1.5">
                                <span className="text-orange-400 mr-1 mt-0.5 font-mono">•</span>
                                <span className="leading-relaxed">{lacuna}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.div variants={staggerItem} className="space-y-2.5">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Habilidades</h3>
                  <div className="bg-[#090B11] border border-white/5 rounded-xl p-5 space-y-4">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Hard Skills</span>
                      <div className="flex flex-wrap gap-2">
                        {analysis.skills.hard_skills.map((skill, sIdx) => (
                          <span key={sIdx} className="px-2.5 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg font-medium flex items-center gap-1.5">
                            {getSkillIcon(skill)}
                            <span>{skill}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Soft Skills</span>
                      <div className="flex flex-wrap gap-2">
                        {analysis.skills.soft_skills.map((skill, sIdx) => (
                          <span key={sIdx} className="px-2.5 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-lg font-medium flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-red-400" />
                            <span>{skill}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-2.5">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Histórico Profissional</h3>
                  <div className="bg-[#090B11] border border-white/5 rounded-xl p-5">
                    <Timeline items={analysis.professional_history} />
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 bg-[#121620]/20 border border-dashed border-white/10 rounded-[20px] p-8 flex flex-col items-center justify-center gap-3 text-center min-h-[400px]"
              >
                <Sparkle className="w-12 h-12 text-gray-600 animate-pulse" />
                <h2 className="text-sm font-bold text-gray-400">Aguardando Documento</h2>
                <p className="text-xs text-gray-500 max-w-[280px] leading-relaxed">
                  Faça o upload do currículo do candidato no painel esquerdo para processar a análise detalhada.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="fixed bottom-6 right-6 pointer-events-none opacity-20">
        <Sparkle className="w-20 h-20 text-[#00FF9D] animate-spin" style={{ animationDuration: "25s" }} />
      </div>
    </div>
  );
}
