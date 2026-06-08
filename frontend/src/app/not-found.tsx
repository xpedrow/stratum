"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, House, FileText, MagnifyingGlass } from "@phosphor-icons/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full min-h-[85vh] bg-background text-on-background flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="grainy-bg absolute inset-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-violet-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[480px] flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-20 h-20 bg-surface-container-low border border-primary/20 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-xl"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.08, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4, 
              ease: "easeInOut" 
            }}
          >
            <FileText className="w-10 h-10 text-primary" />
          </motion.div>
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full"></div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-7xl font-black tracking-tight text-white font-mono select-none"
        >
          404
        </motion.div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4 w-full flex flex-col items-center"
        >
          <div>
            <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-[0.25em] bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full inline-block whitespace-nowrap">
              Erro de Mapeamento
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans mt-2">
            Caminho Não Mapeado
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed font-sans max-w-[400px]">
            A rota de currículo solicitada não existe ou foi movida no banco de talentos. O analisador semântico retornou um desvio de navegação.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-full bg-surface-container-low border border-outline-variant/60 rounded-2xl p-5 text-left font-mono text-xs text-on-surface-variant/90 space-y-2.5 backdrop-blur-md"
        >
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
            <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Console de Depuração</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          </div>
          <div className="space-y-1.5 text-[11px] w-full">
            <p className="text-zinc-500">&gt; STRATUM_PARSER_DIAGNOSTIC</p>
            <p className="text-red-400">Error: Route '/not-found' resolved with status 404</p>
            <p className="text-zinc-400">Reason: Target resource indexation failed (null pointer)</p>
            <p className="text-primary/70">&gt; Redirecionando para rota de fit profissional...</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="w-full flex justify-center"
        >
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-[#05020a] hover:brightness-110 hover:violet-glow rounded-xl text-xs font-bold uppercase tracking-[0.1em] transition-all w-full sm:w-auto max-w-[240px] cursor-pointer"
          >
            <House className="w-4 h-4" />
            <span>Voltar ao Início</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
