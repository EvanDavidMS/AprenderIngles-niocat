"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useState, type ReactNode } from "react";
import { speak } from "@/lib/speech";
import { updateSettings, useProgress } from "@/lib/store";
import type { DiffPart } from "@/lib/compare";
import { SnailIcon, SpeakerIcon } from "./icons";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8"
    >
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
      <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
        {title}
      </h1>
      {children && <div className="mt-3 max-w-2xl text-base text-muted sm:text-lg">{children}</div>}
    </motion.header>
  );
}

export function Card({ className = "", ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={`rounded-3xl border border-line/70 bg-card p-5 shadow-soft sm:p-6 ${className}`}
      {...props}
    />
  );
}

type BtnVariant = "primary" | "ghost" | "soft";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: HTMLMotionProps<"button"> & { variant?: BtnVariant }) {
  const styles: Record<BtnVariant, string> = {
    primary: "btn-3d bg-accent text-white [--btn-edge:color-mix(in_srgb,var(--accent)_65%,black)] hover:brightness-110",
    soft: "btn-3d bg-accent-soft text-accent [--btn-edge:color-mix(in_srgb,var(--accent)_30%,transparent)] hover:bg-accent hover:text-white",
    ghost: "btn-3d border-2 border-line bg-card text-ink [--btn-edge:var(--line)] hover:border-muted",
  };
  return (
    <motion.button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-extrabold transition-colors disabled:pointer-events-none disabled:opacity-40 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}

/** Botón de audio: normal y lento */
export function SpeakButtons({
  text,
  size = "md",
  withSlow = true,
}: {
  text: string;
  size?: "sm" | "md";
  withSlow?: boolean;
}) {
  const { settings } = useProgress();
  const [playing, setPlaying] = useState<"normal" | "slow" | null>(null);
  const dim = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  const icon = size === "sm" ? 16 : 20;

  const play = (mode: "normal" | "slow") => {
    setPlaying(mode);
    speak(text, {
      lang: settings.accent,
      rate: mode === "slow" ? Math.min(settings.rate, 0.6) : settings.rate,
      onEnd: () => setPlaying(null),
    });
  };

  return (
    <span className="inline-flex gap-1.5">
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          play("normal");
        }}
        className={`${dim} relative inline-flex items-center justify-center rounded-full bg-blue-soft text-blue transition-colors hover:bg-blue hover:text-paper`}
        aria-label="Escuchar"
        title="Escuchar"
      >
        {playing === "normal" && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-blue"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
        <SpeakerIcon width={icon} height={icon} />
      </motion.button>
      {withSlow && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            play("slow");
          }}
          className={`${dim} relative inline-flex items-center justify-center rounded-full bg-green-soft text-green transition-colors hover:bg-green hover:text-paper`}
          aria-label="Escuchar lento"
          title="Escuchar lento"
        >
          {playing === "slow" && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-green"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
          )}
          <SnailIcon width={icon} height={icon} />
        </motion.button>
      )}
    </span>
  );
}

export function DiffView({ parts }: { parts: DiffPart[] }) {
  return (
    <p className="flex flex-wrap gap-x-1.5 gap-y-1 text-lg leading-relaxed">
      {parts.map((p, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className={
            p.kind === "ok"
              ? "text-green"
              : p.kind === "missing"
                ? "rounded bg-accent-soft px-1 font-semibold text-accent underline decoration-dotted"
                : "text-muted line-through"
          }
          title={p.kind === "missing" ? "Faltó esta palabra" : p.kind === "extra" ? "Palabra de más / incorrecta" : undefined}
        >
          {p.word}
        </motion.span>
      ))}
    </p>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 90 ? "bg-green-soft text-green" : score >= 60 ? "bg-gold-soft text-gold" : "bg-accent-soft text-accent";
  const label = score >= 90 ? "¡Excelente!" : score >= 60 ? "¡Casi!" : "Sigue intentando";
  return (
    <motion.span
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${tone}`}
    >
      {score}% · {label}
    </motion.span>
  );
}

export function Tabs<T extends string>({
  value,
  onChange,
  options,
  id,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  id: string;
}) {
  return (
    <div className="no-scrollbar inline-flex max-w-full overflow-x-auto rounded-full border border-line bg-card p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`relative shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            value === o.value ? "text-paper" : "text-muted hover:text-ink"
          }`}
        >
          {value === o.value && (
            <motion.span
              layoutId={`tabs-${id}`}
              className="absolute inset-0 rounded-full bg-ink"
              transition={{ type: "spring", stiffness: 450, damping: 34 }}
            />
          )}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export function RateControl() {
  const { settings } = useProgress();
  return (
    <label className="flex items-center gap-3 text-sm text-muted">
      <span className="shrink-0">Velocidad</span>
      <input
        type="range"
        min={0.5}
        max={1.2}
        step={0.05}
        value={settings.rate}
        onChange={(e) =>
          updateSettings({ rate: Number(e.target.value) })
        }
        className="w-32 accent-[var(--accent)]"
      />
      <span className="w-10 font-mono text-ink">{settings.rate.toFixed(2)}x</span>
    </label>
  );
}
