"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { specialtyBySlug, specialtySentences, type Specialty, type Term } from "@/data/specialties";
import { TOPIC_BG } from "@/components/topic-colors";
import { SpeakButtons } from "@/components/ui";
import { WordBuilder } from "@/components/WordBuilder";
import { ArrowLeft, BlocksIcon, BookIcon, ChatIcon, EyeIcon, SearchIcon, SparkIcon, SpeakerIcon, StopIcon } from "@/components/icons";
import { canSpeak, speak } from "@/lib/speech";
import { useProgress } from "@/lib/store";

type Tab = "words" | "phrases" | "dialogues" | "blocks";

const TABS: { value: Tab; label: string; Icon: typeof BookIcon }[] = [
  { value: "words", label: "Palabras", Icon: BookIcon },
  { value: "phrases", label: "Frases", Icon: SparkIcon },
  { value: "dialogues", label: "Diálogos", Icon: ChatIcon },
  { value: "blocks", label: "Armar", Icon: BlocksIcon },
];

const ease = [0.22, 1, 0.36, 1] as const;

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function TermCard({ t }: { t: Term }) {
  return (
    <div className="rounded-3xl border border-line/70 bg-card p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-extrabold leading-snug">{t.en}</p>
          <p className="text-sm text-muted">{t.es}</p>
        </div>
        <SpeakButtons text={t.en} size="sm" />
      </div>
      {t.note && (
        <p className="mt-3 rounded-2xl bg-gold-soft px-3 py-2 text-sm font-medium text-ink">
          <span className="mr-1">💡</span>
          {t.note}
        </p>
      )}
    </div>
  );
}

function WordsTab({ s }: { s: Specialty }) {
  const [filter, setFilter] = useState("");
  const q = norm(filter.trim());
  const groups = s.groups
    .map((g) => ({ ...g, terms: q ? g.terms.filter((t) => norm(t.en).includes(q) || norm(t.es).includes(q)) : g.terms }))
    .filter((g) => g.terms.length > 0);

  return (
    <>
      <label className="mb-6 flex max-w-sm items-center gap-2 rounded-2xl border border-line bg-card px-4 py-2.5 text-muted focus-within:border-accent">
        <SearchIcon width={16} height={16} />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrar términos…"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
        />
      </label>
      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g.title}>
            <div className="mb-3 flex items-baseline gap-2">
              <h2 className="font-display text-xl font-black">
                <span className="mr-1.5">{g.emoji}</span>
                {g.title}
              </h2>
              <span className="text-sm font-semibold text-muted">{g.titleEn}</span>
            </div>
            <div className="grid items-start gap-3 md:grid-cols-2 lg:grid-cols-3">
              {g.terms.map((t) => (
                <TermCard key={t.id} t={t} />
              ))}
            </div>
          </section>
        ))}
      </div>
      {groups.length === 0 && <p className="py-10 text-center text-muted">Ningún término coincide con &ldquo;{filter}&rdquo;.</p>}
    </>
  );
}

function PhraseCard({ en, es, hideEn, i }: { en: string; es: string; hideEn: boolean; i: number }) {
  const [revealed, setRevealed] = useState(false);
  const hidden = hideEn && !revealed;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03, duration: 0.35, ease }}
      className="flex items-center gap-3 rounded-3xl border border-line/70 bg-card p-4 shadow-soft"
    >
      <div className="min-w-0 flex-1">
        {hidden ? (
          <button
            onClick={() => setRevealed(true)}
            className="flex items-center gap-2 text-sm font-bold text-accent hover:underline"
          >
            <EyeIcon width={16} height={16} /> Dilo en voz alta y toca para ver
          </button>
        ) : (
          <p className="font-display text-lg font-extrabold leading-snug">{en}</p>
        )}
        <p className="text-sm text-muted">{es}</p>
      </div>
      {!hidden && <SpeakButtons text={en} size="sm" />}
    </motion.div>
  );
}

function PhrasesTab({ s }: { s: Specialty }) {
  const [hideEn, setHideEn] = useState(false);
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">Frases que vas a escuchar (y decir) en el trabajo.</p>
        <button
          onClick={() => setHideEn((h) => !h)}
          className={`rounded-full border px-4 py-1.5 text-sm font-bold transition-colors ${
            hideEn ? "border-accent bg-accent text-white" : "border-line bg-card text-muted hover:text-ink"
          }`}
          aria-pressed={hideEn}
        >
          Modo práctica: {hideEn ? "sí" : "no"}
        </button>
      </div>
      {/* key: al cambiar de modo se vuelven a ocultar todas */}
      <div key={String(hideEn)} className="grid gap-3 md:grid-cols-2">
        {s.phrases.map((p, i) => (
          <PhraseCard key={p.en} en={p.en} es={p.es} hideEn={hideEn} i={i} />
        ))}
      </div>
    </>
  );
}

function DialogueCard({ d }: { d: Specialty["dialogues"][number] }) {
  const { settings } = useProgress();
  const [current, setCurrent] = useState<number | null>(null);
  const [showEs, setShowEs] = useState(true);
  const run = useRef(0); // cada reproducción tiene su número; si cambia, la anterior se detiene
  const first = d.lines[0]?.who;

  useEffect(() => {
    const r = run;
    return () => {
      r.current += 1;
    };
  }, []);

  const playFrom = (idx: number, token: number) => {
    if (token !== run.current) return;
    if (idx >= d.lines.length) {
      setCurrent(null);
      return;
    }
    setCurrent(idx);
    speak(d.lines[idx].en, {
      lang: settings.accent,
      rate: settings.rate,
      onEnd: () => window.setTimeout(() => playFrom(idx + 1, token), 350),
    });
  };

  const stop = () => {
    run.current += 1;
    setCurrent(null);
  };

  const toggleAll = () => {
    if (current !== null) {
      stop();
      if (canSpeak()) window.speechSynthesis.cancel();
      return;
    }
    run.current += 1;
    playFrom(0, run.current);
  };

  return (
    <div className="rounded-[2rem] border border-line/70 bg-card p-5 shadow-soft sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-black">{d.title}</h3>
          <p className="text-sm font-semibold text-muted">{d.titleEn}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowEs((v) => !v)}
            className="rounded-full border border-line px-3 py-1.5 text-xs font-bold text-muted transition-colors hover:text-ink"
          >
            {showEs ? "Ocultar español" : "Ver español"}
          </button>
          <button
            onClick={toggleAll}
            className="btn-3d inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-extrabold text-white [--btn-edge:color-mix(in_srgb,var(--accent)_65%,black)]"
          >
            {current !== null ? <StopIcon width={14} height={14} /> : <SpeakerIcon width={14} height={14} />}
            {current !== null ? "Detener" : "Escuchar todo"}
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {d.lines.map((l, i) => {
          const left = l.who === first;
          const active = current === i;
          return (
            <div key={i} className={`flex ${left ? "justify-start" : "justify-end"}`}>
              {/* tocar un audio suelto detiene la reproducción completa */}
              <motion.div
                onClickCapture={stop}
                animate={{ scale: active ? 1.02 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className={`flex max-w-[92%] items-start gap-3 rounded-3xl px-4 py-3 sm:max-w-[80%] ${
                  left ? "rounded-bl-md" : "rounded-br-md"
                } ${active ? "bg-accent-soft ring-2 ring-accent" : left ? "bg-paper" : "bg-blue-soft"}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted">{l.who}</p>
                  <p className="font-semibold">{l.en}</p>
                  {showEs && <p className="text-sm text-muted">{l.es}</p>}
                </div>
                <SpeakButtons text={l.en} size="sm" withSlow={false} />
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SpecialtyView({ slug }: { slug: string }) {
  const s = specialtyBySlug(slug)!;
  const [tab, setTab] = useState<Tab>("words");
  const sentences = useMemo(() => specialtySentences(s), [s]);

  return (
    <div>
      <Link href="/especialidades" className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-muted transition-colors hover:text-ink">
        <ArrowLeft width={16} height={16} /> Todas las especialidades
      </Link>

      {/* portada */}
      <motion.section
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease }}
        className="relative overflow-hidden rounded-[2rem] bg-hero p-6 text-hero-ink sm:p-8"
      >
        <motion.div
          aria-hidden
          className={`absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-90 sm:-right-10 sm:-top-10 sm:h-72 sm:w-72 ${TOPIC_BG[s.color]}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.1 }}
        />
        <motion.span
          aria-hidden
          className="absolute right-4 top-4 text-5xl sm:right-14 sm:top-10 sm:text-8xl"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0, y: [0, -8, 0] }}
          transition={{
            scale: { type: "spring", stiffness: 260, damping: 12, delay: 0.25 },
            rotate: { type: "spring", stiffness: 260, damping: 12, delay: 0.25 },
            y: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
          }}
        >
          {s.emoji}
        </motion.span>
        <div className="relative max-w-xl pt-10 sm:pr-40 sm:pt-0">
          <p className="text-sm font-bold opacity-60">English for {s.titleEn.toLowerCase()}s</p>
          <h1 className="mt-1 font-display text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl">{s.title}</h1>
          <p className="mt-3 opacity-75">{s.blurb}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-white/10 px-3 py-1.5">{s.totalTerms} términos</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">{s.phrases.length} frases</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">{s.dialogues.length} diálogos</span>
          </div>
        </div>
      </motion.section>

      {/* pestañas */}
      <div className="sticky top-0 z-20 -mx-4 mt-6 bg-paper/85 px-4 py-3 backdrop-blur-lg sm:-mx-8 sm:px-8 lg:top-20">
        <div className="flex w-full gap-1 rounded-2xl bg-card p-1.5 shadow-soft sm:inline-flex sm:w-auto">
          {TABS.map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[13px] font-extrabold transition-colors sm:flex-none sm:gap-2 sm:px-4 sm:text-sm ${
                tab === value ? "text-white" : "text-muted hover:text-ink"
              }`}
            >
              {tab === value && (
                <motion.span
                  layoutId="specialty-tab"
                  className="absolute inset-0 rounded-xl bg-accent"
                  transition={{ type: "spring", stiffness: 450, damping: 34 }}
                />
              )}
              <Icon width={16} height={16} className="relative hidden shrink-0 min-[440px]:block" />
              <span className="relative whitespace-nowrap">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease }}
          className="mt-3"
        >
          {tab === "words" && <WordsTab s={s} />}
          {tab === "phrases" && <PhrasesTab s={s} />}
          {tab === "dialogues" && (
            <div className="grid gap-5 lg:grid-cols-2">
              {s.dialogues.map((d) => (
                <DialogueCard key={d.title} d={d} />
              ))}
            </div>
          )}
          {tab === "blocks" && (
            <div className="rounded-[2rem] border border-line/70 bg-card p-5 shadow-soft sm:p-8">
              <WordBuilder topic={`esp-${s.slug}`} sentences={sentences} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
