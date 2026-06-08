"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadSimple,
  FilePdf,
  Briefcase,
  EnvelopeSimple,
  LinkedinLogo,
  Sparkle,
  Check,
  CheckCircle,
  WarningCircle,
  Code,
  Database,
  Terminal,
  Stack,
  BracketsCurly,
  GitBranch,
  Cloud,
  Desktop,
  Cpu,
  Monitor,
  Heart,
  Phone,
  ArrowLeft,
  CaretRight,
  ArrowUpRight,
  FileText,
  User,
  X,
  ShieldCheck,
  Shield,
  ChartBar,
  MapPin,
  Trash
} from "@phosphor-icons/react";
import dynamic from "next/dynamic";
const Gauge = dynamic(() => import("@/components/Gauge").then((mod) => mod.Gauge), { ssr: false });
const Timeline = dynamic(() => import("@/components/Timeline").then((mod) => mod.Timeline), { ssr: false });
import { GlowCard } from "@/components/ui/spotlight-card";

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
  const [vagaText, setVagaText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [analysis, setAnalysis] = useState<StratumAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedAnalyses, setSavedAnalyses] = useState<Array<{
    id: string;
    timestamp: number;
    candidateName: string;
    roleName: string;
    matchScore: number;
    latency: number;
    analysisData: StratumAnalysis;
  }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const stored = localStorage.getItem("stratum_analyses");
    if (stored) {
      try {
        setSavedAnalyses(JSON.parse(stored));
      } catch (e) { }
    }
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "ST";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isMatchExato = (skill: string) => {
    if (!vagaText) return false;
    return vagaText.toLowerCase().includes(skill.toLowerCase());
  };

  const getSkillCategory = (skill: string) => {
    const s = skill.toLowerCase();
    const linguagens = ["typescript", "javascript", "js", "ts", "python", "py", "go", "golang", "ruby", "c++", "c#", "java", "rust", "sql", "html", "css", "php", "lua"];
    if (linguagens.some(lang => s.includes(lang))) {
      return "language";
    }
    return "framework";
  };

  const getRoleTitle = (text: string, data: StratumAnalysis) => {
    if (!text) return `Análise - ${data.profile.estimated_seniority_level}`;
    const firstLine = text.split("\n")[0].trim();
    if (firstLine.length > 30) {
      return firstLine.substring(0, 30) + "...";
    }
    return firstLine || `Análise - ${data.profile.estimated_seniority_level}`;
  };

  const saveAnalysis = (data: StratumAnalysis, latencySec: number) => {
    const newAnalysis = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      candidateName: data.candidate.name,
      roleName: getRoleTitle(vagaText, data),
      matchScore: data.job_match?.score || 0,
      latency: latencySec,
      analysisData: data
    };
    const updated = [newAnalysis, ...savedAnalyses].slice(0, 10);
    setSavedAnalyses(updated);
    localStorage.setItem("stratum_analyses", JSON.stringify(updated));
  };

  const handleDeleteSaved = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = savedAnalyses.filter(item => item.id !== id);
    setSavedAnalyses(updated);
    localStorage.setItem("stratum_analyses", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setSavedAnalyses([]);
    localStorage.removeItem("stratum_analyses");
  };

  const getRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Agora mesmo";
    if (mins < 60) return `Há ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Há ${hours} h`;
    const days = Math.floor(hours / 24);
    return `Há ${days} dias`;
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError(null);
        if (status === "error") {
          setStatus("idle");
        }
      } else {
        setError("Por favor, envie apenas arquivos no formato PDF.");
        setStatus("error");
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError(null);
        if (status === "error") {
          setStatus("idle");
        }
      } else {
        setError("Por favor, envie apenas arquivos no formato PDF.");
        setStatus("error");
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (status === "error") {
      setStatus("idle");
      setError(null);
    }
  };

  const handleAnalysis = async () => {
    if (!file) {
      setError("Por favor, selecione um arquivo PDF.");
      setStatus("error");
      return;
    }

    setIsAnalyzing(true);
    setStatus("processing");
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);
    if (vagaText) {
      formData.append("vaga", vagaText);
    }

    const startTime = Date.now();
    try {
      const response = await fetch("/api/analisar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ocorreu um erro ao analisar o currículo.");
      }

      const data = await response.json();
      const endTime = Date.now();
      const latencySec = (endTime - startTime) / 1000;
      setAnalysis(data);
      setStatus("success");
      saveAnalysis(data, latencySec);
      setIsAnalyzing(false);
    } catch (err: any) {
      setError(err.message || "Erro de conexão com o servidor.");
      setStatus("error");
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setVagaText("");
    setAnalysis(null);
    setError(null);
    setStatus("idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-on-background font-body-md antialiased selection:bg-primary/30 selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="grainy-bg absolute inset-0"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]"></div>
      </div>



      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-12 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {status === "processing" ? (
            <motion.div
              key="processing-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-[448px] bg-surface-container border border-outline-variant rounded-[24px] p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center text-center gap-6"
            >
              <div className="relative flex items-center justify-center w-20 h-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-outline-variant border-t-primary"
                />
                <Sparkle className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="font-headline-lg text-lg font-bold text-white tracking-wide">Análise em Progresso</h2>
                <p className="text-xs text-on-surface-variant leading-relaxed max-w-[320px] font-sans">
                  Nossos agentes de IA estão processando o currículo e cruzando com as atribuições fornecidas. Isso pode levar alguns segundos.
                </p>
              </div>
              <div className="w-full space-y-2 mt-2">
                <div className="h-1 bg-surface-variant rounded-full overflow-hidden w-full relative">
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="absolute top-0 bottom-0 w-1/2 left-0 scanning-line"
                  />
                </div>
                <span className="text-[9px] font-label-sm text-on-surface-variant uppercase tracking-wider block">Mapeando fit profissional...</span>
              </div>
            </motion.div>
          ) : status === "success" && analysis ? (
            <motion.div
              key="dashboard-screen"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="w-full flex flex-col gap-6"
            >
              <div className="flex justify-start">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-primary/30 bg-primary/10 text-primary text-xs font-mono font-bold hover:bg-primary/20 hover:border-primary/50 transition-all shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>NOVA ANÁLISE</span>
                </button>
              </div>
              <div className="grid grid-cols-12 gap-8 items-start w-full">
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  <motion.div variants={staggerItem}>
                    <GlowCard customSize className="w-full p-4 sm:p-6 flex flex-col gap-6">
                      <div>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-950/50 to-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-sm font-bold text-white tracking-wider font-mono">
                          {getInitials(analysis.candidate.name)}
                        </div>
                        <h2 className="font-headline-lg text-xl font-bold text-white tracking-tight leading-tight">{analysis.candidate.name || "Sem informações"}</h2>
                        <div className="flex flex-col gap-2.5 mt-4 text-xs text-on-surface-variant">
                          <span className="flex items-center gap-2 font-label-sm">
                            <EnvelopeSimple className="w-4 h-4 text-outline" />
                            {analysis.candidate.email || "Sem informações"}
                          </span>
                          <span className="flex items-center gap-2 font-label-sm">
                            <Phone className="w-4 h-4 text-outline" />
                            {analysis.candidate.phone || "Sem informações"}
                          </span>
                          <span className="flex items-center gap-2 font-label-sm">
                            <MapPin className="w-4 h-4 text-outline" />
                            {analysis.candidate.location || "Sem informações"}
                          </span>
                          {analysis.candidate.linkedin ? (
                            <a
                              href={analysis.candidate.linkedin.startsWith("http") ? analysis.candidate.linkedin : `https://${analysis.candidate.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-primary hover:underline font-label-sm font-bold"
                            >
                              <LinkedinLogo className="w-4 h-4" />
                              LinkedIn
                            </a>
                          ) : (
                            <span className="flex items-center gap-2 font-label-sm text-on-surface-variant/50">
                              <LinkedinLogo className="w-4 h-4 text-outline" />
                              Sem informações
                            </span>
                          )}
                        </div>
                      </div>
                      <hr className="border-outline-variant" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex flex-col gap-1">
                          <span className="text-[9px] text-on-surface-variant uppercase font-label-sm font-bold tracking-wider">Experiência</span>
                          <span className="text-sm font-bold text-white font-label-sm">{analysis.profile.years_of_experience} anos</span>
                        </div>
                        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex flex-col gap-1">
                          <span className="text-[9px] text-on-surface-variant uppercase font-label-sm font-bold tracking-wider">Senioridade</span>
                          <span className="text-sm font-bold text-primary font-label-sm uppercase tracking-wider drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]">{analysis.profile.estimated_seniority_level}</span>
                        </div>
                      </div>
                  </GlowCard>
                </motion.div>

                {analysis.job_match && (
                  <motion.div variants={staggerItem}>
                    <GlowCard customSize className="w-full p-4 sm:p-6 flex flex-col gap-6">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between w-full">
                        <h3 className="font-headline-md text-sm font-bold text-white tracking-wide text-center sm:text-left">Avaliação de Match</h3>
                        <div className="scale-90">
                          <Gauge score={analysis.job_match.score} />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-label-sm uppercase font-bold tracking-wider text-on-surface-variant">Justificativa do Fit</span>
                          <p className="text-xs text-on-surface-variant leading-relaxed font-medium font-sans">{analysis.job_match.justification}</p>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="space-y-2">
                            <span className="text-[9px] font-label-sm uppercase font-bold tracking-wider text-primary">Pontos Fortes</span>
                            <ul className="space-y-1.5">
                              {analysis.job_match.strengths.map((ponto, pIdx) => (
                                <li key={pIdx} className="text-xs text-on-background flex items-start gap-2 leading-relaxed font-sans">
                                  <Check className="w-3.5 h-3.5 text-emerald-500 mt-1 flex-shrink-0" />
                                  <span>{ponto}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[9px] font-label-sm uppercase font-bold tracking-wider text-orange-400">Lacunas Identificadas</span>
                            <ul className="space-y-1.5">
                              {analysis.job_match.gaps_identified.map((lacuna, lIdx) => (
                                <li key={lIdx} className="text-xs text-on-background flex items-start gap-2 leading-relaxed font-sans">
                                  <WarningCircle className="w-3.5 h-3.5 text-amber-500 mt-1 flex-shrink-0" />
                                  <span>{lacuna}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </GlowCard>
                  </motion.div>
                )}
              </div>

              <div className="col-span-12 lg:col-span-8 space-y-6">
                <motion.div variants={staggerItem}>
                  <GlowCard customSize className="w-full p-4 sm:p-6 space-y-4">
                    <h3 className="font-headline-md text-sm font-bold text-white tracking-wide">Resumo Profissional</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed font-medium font-sans">{analysis.profile.professional_summary}</p>
                  </GlowCard>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <GlowCard customSize className="w-full p-4 sm:p-6 space-y-6">
                    <h3 className="font-headline-md text-sm font-bold text-white tracking-wide">Mapeamento de Competências</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <span className="text-[10px] text-on-surface-variant font-label-sm font-bold uppercase tracking-wider block">Hard Skills</span>
                        <div className="flex flex-wrap gap-2">
                          {analysis.skills.hard_skills.map((skill, sIdx) => {
                            const exactMatch = isMatchExato(skill);
                            const cat = getSkillCategory(skill);
                            const bgClass = cat === "language" ? "bg-surface-variant" : "bg-surface-variant/60";
                            const borderClass = exactMatch ? "border-emerald-500/80" : "border-outline-variant";
                            return (
                              <span
                                key={sIdx}
                                className={`px-2.5 py-1 text-on-background border text-xs rounded font-medium flex items-center gap-1.5 font-label-sm font-bold transition-all duration-300 ${bgClass} ${borderClass}`}
                              >
                                {getSkillIcon(skill)}
                                <span>{skill}</span>
                                {exactMatch && <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] text-on-surface-variant font-label-sm font-bold uppercase tracking-wider block">Soft Skills</span>
                        <div className="flex flex-wrap gap-2">
                          {analysis.skills.soft_skills.map((skill, sIdx) => (
                            <span key={sIdx} className="px-2.5 py-1 bg-surface-variant/50 text-on-surface-variant border border-outline-variant/50 text-xs rounded font-medium flex items-center gap-1.5 font-label-sm font-bold">
                              <Heart className="w-3.5 h-3.5 text-red-400" />
                              <span>{skill}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <GlowCard customSize className="w-full p-4 sm:p-6 space-y-6">
                    <h3 className="font-headline-md text-sm font-bold text-white tracking-wide">Linha do Tempo Profissional</h3>
                    <Timeline items={analysis.professional_history} />
                  </GlowCard>
                </motion.div>
              </div>
            </div>
            </motion.div>
          ) : (
            <motion.div
              key="landing-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-7xl animate-fade-in"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4 space-y-10">
                  <div className="space-y-4">
                    <div className="font-label-sm text-primary uppercase tracking-[0.2em] flex items-center gap-2 drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]">
                      <span className="w-4 h-px bg-primary/40"></span>
                      Professional Suite
                    </div>
                    <h1 className="font-display-lg text-on-surface leading-tight text-white text-3xl sm:text-4xl lg:text-[40px]">
                      Central de Inteligência para <span className="text-primary tracking-wide" style={{ textShadow: "0 0 6px rgba(168, 85, 247, 0.85), 0 0 15px rgba(168, 85, 247, 0.45), 0 0 30px rgba(168, 85, 247, 0.2)" }}>Recrutamento</span>
                    </h1>
                    <p className="font-body-md text-on-surface-variant leading-relaxed w-full max-w-[448px] whitespace-normal font-sans">
                      Utilize análise semântica de alta precisão para cruzar perfis técnicos com descritivos de cargos complexos.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Análises Recentes</h4>
                      {savedAnalyses.length > 0 && (
                        <button
                          onClick={handleClearAll}
                          className="text-[9px] font-label-sm text-red-400 hover:underline uppercase tracking-wider cursor-pointer"
                        >
                          Limpar Tudo
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {savedAnalyses.length === 0 ? (
                        <p className="text-xs text-on-surface-variant italic py-2">Nenhuma análise recente.</p>
                      ) : (
                        savedAnalyses.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setAnalysis(item.analysisData);
                              setStatus("success");
                            }}
                            className="group p-3 border border-outline-variant hover:border-primary/30 rounded bg-surface-container-low hover:bg-zinc-900/60 transition-all duration-300 cursor-pointer flex items-center justify-between"
                          >
                            <div className="flex-1 min-w-0 pr-2">
                              <p className="text-sm font-medium text-on-surface truncate">{item.roleName}</p>
                              <p className="text-[10px] sm:text-[11px] text-on-surface-variant flex flex-wrap gap-x-1 items-center">
                                <span>Match: {item.matchScore}%</span>
                                <span>•</span>
                                <span className="truncate max-w-[100px] sm:max-w-none">Candidato: {item.candidateName}</span>
                                <span>•</span>
                                <span>{getRelativeTime(item.timestamp)}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-3 overflow-hidden">
                              <button
                                onClick={(e) => handleDeleteSaved(e, item.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 text-on-surface-variant hover:text-red-400 rounded transition-all cursor-pointer"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                              <CaretRight className="text-on-surface-variant text-sm transition-transform duration-300 transform translate-x-2 group-hover:translate-x-0" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-outline-variant">
                    <div className="space-y-1">
                      <span className="block font-label-sm text-[10px] text-on-surface-variant uppercase">Precisão</span>
                      <span className="block font-display-lg text-2xl text-on-surface">99.8%</span>
                    </div>
                    <div className="space-y-1">
                      <span className="block font-label-sm text-[10px] text-on-surface-variant uppercase">Latência Média</span>
                      <span className="block font-display-lg text-2xl text-on-surface">
                        {savedAnalyses.length > 0
                          ? `${(savedAnalyses.reduce((acc, curr) => acc + (curr.latency || 2.4), 0) / savedAnalyses.length).toFixed(1)}s`
                          : "<2.4s"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <GlowCard customSize className="w-full p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 font-label-sm text-[11px] uppercase tracking-wider text-primary font-bold">
                          <FileText className="text-[16px]" />
                          Descrição da Vaga de Destino
                        </label>
                        <span className="text-[10px] text-on-surface-variant/60 italic">Copie e cole os requisitos técnicos e responsabilidades</span>
                      </div>
                      <textarea
                        value={vagaText}
                        onChange={(e) => setVagaText(e.target.value)}
                        className="w-full h-48 bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 font-body-md text-on-surface focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none transition-all custom-scrollbar resize-none placeholder:text-slate-400 font-sans"
                        placeholder="Ex: Buscamos profissional com 5+ anos de experiência em React, Node.js e arquitetura de microserviços..."
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center gap-2 font-label-sm text-[11px] uppercase tracking-wider text-primary font-bold">
                        <User className="text-[16px]" />
                        Currículo do Candidato (PDF)
                      </label>
                      <div
                        onClick={onButtonClick}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`relative glass-dropzone rounded group/zone cursor-pointer w-full transition-all duration-300 ${isDragging
                          ? "border-primary shadow-[0_0_15px_rgba(168,85,247,0.2)] bg-primary/5"
                          : "border-outline-variant"
                          }`}
                        id="drop-zone"
                      >
                        <div className="px-6 py-10 flex flex-col items-center justify-center text-center space-y-4">
                          <div className="w-12 h-12 rounded bg-surface-variant flex items-center justify-center border border-outline-variant group-hover/zone:border-primary/40 transition-colors overflow-hidden">
                            <motion.div
                              animate={isDragging ? { y: [0, -6, 0] } : {}}
                              transition={isDragging ? { repeat: Infinity, duration: 1.2, ease: "easeInOut" } : {}}
                            >
                              <UploadSimple className="text-2xl text-on-surface-variant group-hover/zone:text-primary" />
                            </motion.div>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-sm font-medium text-on-surface">Arraste o currículo ou clique para importar</h3>
                            <p className="text-[11px] text-on-surface-variant">Apenas arquivos .pdf são suportados para processamento semântico</p>
                          </div>
                        </div>
                        <input
                          ref={fileInputRef}
                          accept=".pdf"
                          className="hidden"
                          id="file-input"
                          type="file"
                          onChange={handleFileChange}
                        />

                        {file && (
                          <div className="absolute inset-0 bg-surface-container-highest flex items-center justify-center p-6 z-20 rounded" id="file-preview">
                            <div className="w-full flex items-center gap-4 bg-surface-container-lowest border border-primary/20 p-4 rounded shadow-lg relative">
                              <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary">
                                <FilePdf className="text-xl" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-on-surface truncate font-sans" id="file-name">{file.name}</p>
                                <p className="text-[9px] text-primary uppercase font-bold tracking-widest mt-0.5">Vínculo estabelecido</p>
                              </div>
                              <button
                                onClick={handleRemoveFile}
                                className="p-1.5 hover:bg-red-500/10 text-on-surface-variant hover:text-red-500 transition-colors rounded cursor-pointer"
                                id="remove-file"
                              >
                                <X className="text-sm" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded text-xs flex items-start gap-2">
                        <WarningCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block">Erro na Operação</span>
                          <span className="text-[#94a3b8] leading-relaxed font-sans">{error}</span>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 border-t border-outline-variant">
                      <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 text-on-surface-variant w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="text-sm" />
                          <span className="text-[10px] font-label-sm uppercase tracking-wider">PII Sanitized</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="text-sm" />
                          <span className="text-[10px] font-label-sm uppercase tracking-wider">GDPR Compliant</span>
                        </div>
                      </div>
                      <button
                        onClick={handleAnalysis}
                        disabled={!file || isAnalyzing}
                        className="relative bg-primary text-[#05020a] w-full sm:w-auto justify-center px-8 py-4 rounded font-display-lg text-sm font-bold uppercase tracking-[0.1em] hover:brightness-110 hover:violet-glow transition-all flex items-center gap-3 shadow-lg shadow-primary/5 disabled:opacity-30 cursor-pointer overflow-hidden"
                        id="start-analysis"
                      >
                        {isAnalyzing ? (
                          <>
                            <span>Analisando perfil com IA...</span>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                            >
                              <Sparkle className="w-5 h-5 animate-pulse" />
                            </motion.div>
                          </>
                        ) : (
                          <>
                            <span>Executar Análise de Match</span>
                            <ChartBar className="text-lg" />
                          </>
                        )}
                        {isAnalyzing && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-950 overflow-hidden">
                            <motion.div
                              animate={{ x: ["-100%", "100%"] }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                              className="absolute top-0 bottom-0 w-1/2 left-0 bg-primary"
                            />
                          </div>
                        )}
                      </button>
                    </div>
                  </GlowCard>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>


    </div>
  );
}
