"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useCallback, useMemo, useState, type CSSProperties } from "react";
import type { Sentence } from "@/data/dictionary";
import { speak } from "@/lib/speech";
import { saveBlock, useProgress } from "@/lib/store";
import { CheckIcon, RefreshIcon, XIcon } from "./icons";
import { SpeakButtons } from "./ui";

type Token = { id: number; text: string };

const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, "");
const tokenize = (s: string) => s.split(/\s+/).filter(Boolean);

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Arma la ronda: palabras de la frase + 2-3 palabras "trampa" */
function makeRound(sentences: Sentence[], index: number) {
  const target = sentences[index];
  const words = tokenize(target.en);
  const own = new Set(words.map(clean));
  const pool = shuffle(
    Array.from(new Set(sentences.flatMap((s) => tokenize(s.en)))).filter((w) => !own.has(clean(w))),
  );
  const distractors = pool.slice(0, words.length > 6 ? 3 : 2);
  const bank: Token[] = shuffle([...words, ...distractors]).map((text, id) => ({ id, text }));
  return { target, bank };
}

const chipSpring = { type: "spring", stiffness: 520, damping: 34, mass: 0.7 } as const;

export function WordBuilder({ topic, sentences }: { topic: string; sentences: Sentence[] }) {
  const { settings } = useProgress();
  const order = useMemo(() => shuffle(sentences.map((_, i) => i)), [sentences]);
  const [step, setStep] = useState(0);
  const [round, setRound] = useState(() => makeRound(sentences, order[0]));
  const [picked, setPicked] = useState<number[]>([]);
  const [status, setStatus] = useState<"idle" | "right" | "wrong">("idle");
  const [streak, setStreak] = useState(0);

  const answer = picked.map((id) => round.bank.find((t) => t.id === id)!);
  const locked = status !== "idle";

  const toggle = (id: number) => {
    if (locked) return;
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const check = () => {
    const got = answer.map((t) => clean(t.text)).join(" ");
    const want = tokenize(round.target.en).map(clean).join(" ");
    if (got === want) {
      setStatus("right");
      setStreak((s) => s + 1);
      saveBlock(topic);
      speak(round.target.en, { lang: settings.accent, rate: settings.rate });
    } else {
      setStatus("wrong");
      setStreak(0);
    }
  };

  const next = useCallback(() => {
    const n = step + 1;
    setStep(n);
    setRound(makeRound(sentences, order[n % order.length]));
    setPicked([]);
    setStatus("idle");
  }, [step, sentences, order]);

  const retry = () => {
    setPicked([]);
    setStatus("idle");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center gap-3">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full rounded-full bg-green"
            animate={{ width: `${Math.min(100, (streak / 5) * 100)}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
          />
        </div>
        <span className="font-display text-sm font-extrabold text-muted">
          {streak >= 5 ? "🔥 " : ""}
          {streak} seguidas
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Traduce al inglés</p>
          <h3 className="mt-2 font-display text-2xl font-extrabold leading-snug sm:text-3xl">{round.target.es}</h3>

          <LayoutGroup id={`builder-${step}`}>
            {/* línea de respuesta */}
            <div className="mt-6 flex min-h-[7.5rem] flex-wrap content-start gap-2 border-b-2 border-t-2 border-line py-4">
              {answer.length === 0 && (
                <p className="self-center text-sm text-muted">Toca los bloques en orden para armar la frase…</p>
              )}
              {answer.map((t) => (
                <motion.button
                  layoutId={`tok-${t.id}`}
                  key={t.id}
                  transition={chipSpring}
                  onClick={() => toggle(t.id)}
                  disabled={locked}
                  className={`chip-3d rounded-xl border-2 px-3.5 py-2 text-base font-bold ${
                    status === "right"
                      ? "border-green bg-green-soft text-green"
                      : status === "wrong"
                        ? "border-red bg-red-soft text-red"
                        : "border-line bg-card"
                  }`}
                >
                  {t.text}
                </motion.button>
              ))}
            </div>

            {/* banco de bloques */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {round.bank.map((t) => {
                const used = picked.includes(t.id);
                return (
                  <span key={t.id} className="relative">
                    {/* hueco que queda cuando el bloque se va a la respuesta */}
                    <span
                      className={`block rounded-xl border-2 border-line bg-line/60 px-3.5 py-2 text-base font-bold text-transparent ${used ? "" : "invisible"}`}
                      aria-hidden
                    >
                      {t.text}
                    </span>
                    {!used && (
                      <motion.button
                        layoutId={`tok-${t.id}`}
                        transition={chipSpring}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => toggle(t.id)}
                        disabled={locked}
                        className="chip-3d absolute inset-0 rounded-xl border-2 border-line bg-card px-3.5 py-2 text-base font-bold"
                      >
                        {t.text}
                      </motion.button>
                    )}
                  </span>
                );
              })}
            </div>
          </LayoutGroup>
        </motion.div>
      </AnimatePresence>

      {/* barra inferior de verificación, estilo Duolingo */}
      <div className="relative mt-8 min-h-[5.5rem]">
        <AnimatePresence mode="wait">
          {status === "idle" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between gap-3"
            >
              <button
                onClick={next}
                className="rounded-2xl px-4 py-3 text-sm font-extrabold uppercase tracking-wider text-muted transition-colors hover:text-ink"
              >
                Saltar
              </button>
              <button
                onClick={check}
                disabled={answer.length === 0}
                style={{ "--btn-edge": "color-mix(in srgb, var(--green) 70%, black)" } as CSSProperties}
                className="btn-3d rounded-2xl bg-green px-8 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white disabled:bg-line disabled:text-muted disabled:shadow-none"
              >
                Comprobar
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className={`flex flex-wrap items-center gap-4 rounded-3xl p-4 sm:p-5 ${status === "right" ? "bg-green-soft" : "bg-red-soft"}`}
            >
              <motion.span
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.05 }}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ${status === "right" ? "bg-green" : "bg-red"}`}
              >
                {status === "right" ? <CheckIcon width={26} height={26} strokeWidth={3} /> : <XIcon width={24} height={24} strokeWidth={3} />}
              </motion.span>
              <div className={`min-w-0 flex-1 ${status === "right" ? "text-green" : "text-red"}`}>
                <p className="font-display text-lg font-extrabold">{status === "right" ? "¡Excelente! +5 XP" : "Respuesta correcta:"}</p>
                <p className="flex flex-wrap items-center gap-2 font-semibold">
                  {round.target.en}
                  <SpeakButtons text={round.target.en} size="sm" withSlow={false} />
                </p>
              </div>
              <div className="flex gap-2">
                {status === "wrong" && (
                  <button
                    onClick={retry}
                    className="flex items-center gap-1.5 rounded-2xl border-2 border-red/40 px-4 py-3 text-sm font-extrabold uppercase tracking-wider text-red"
                  >
                    <RefreshIcon width={16} height={16} /> Otra vez
                  </button>
                )}
                <button
                  onClick={next}
                  autoFocus
                  style={
                    {
                      "--btn-edge": `color-mix(in srgb, var(--${status === "right" ? "green" : "red"}) 70%, black)`,
                    } as CSSProperties
                  }
                  className={`btn-3d rounded-2xl px-7 py-3 text-sm font-extrabold uppercase tracking-wider text-white ${status === "right" ? "bg-green" : "bg-red"}`}
                >
                  Continuar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
