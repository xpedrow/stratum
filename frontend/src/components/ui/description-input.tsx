"use client";

import React, { useState, useEffect } from "react";
import { motion, animate } from "framer-motion";
import { FileText } from "@phosphor-icons/react";

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const placeholderPool = [
  "Ex: Buscamos profissional com 5+ anos de experiência em React, Node.js e arquitetura de microserviços...",
  "Ex: Engenheiro de Software Júnior com paixão por Python, Docker e AWS...",
  "Ex: Desenvolvedor Front-end Pleno especialista em Next.js, Tailwind CSS e UI/UX...",
  "Ex: Arquiteto de Cloud com certificações em Kubernetes, Terraform e GCP...",
  "Ex: Profissional com forte conhecimento em Node.js, Express e PostgreSQL..."
];

export default function DescriptionInput({ value, onChange }: DescriptionInputProps) {
  const [typedText, setTypedText] = useState("");
  const [poolIndex, setPoolIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    let active = true;
    const currentText = placeholderPool[poolIndex];

    const typeAnimation = animate(0, currentText.length, {
      duration: currentText.length * 0.04 + Math.random() * 0.2,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (active) {
          setTypedText(currentText.substring(0, Math.floor(latest)));
        }
      },
      onComplete: () => {
        if (!active) return;
        setTimeout(() => {
          if (!active) return;
          const deleteAnimation = animate(currentText.length, 0, {
            duration: 0.8,
            ease: "easeIn",
            onUpdate: (latest) => {
              if (active) {
                setTypedText(currentText.substring(0, Math.floor(latest)));
              }
            },
            onComplete: () => {
              if (!active) return;
              setPoolIndex((prev) => (prev + 1) % placeholderPool.length);
            }
          });
        }, 2000);
      }
    });

    return () => {
      active = false;
      typeAnimation.stop();
    };
  }, [poolIndex]);

  const displayPlaceholder = typedText + (showCursor ? "|" : " ");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 font-label-sm text-[11px] uppercase tracking-wider text-primary font-bold">
          <FileText className="text-[16px]" />
          Descrição da Vaga de Destino
        </label>
        <span className="text-[10px] text-on-surface-variant/60 italic">
          Copie e cole os requisitos técnicos e responsabilidades
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-48 bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 font-body-md text-on-surface focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none transition-all custom-scrollbar resize-none placeholder:text-slate-400 font-sans"
        placeholder={displayPlaceholder}
      />
    </div>
  );
}
