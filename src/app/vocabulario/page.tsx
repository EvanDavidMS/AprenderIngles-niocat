"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, PageHeader, SpeakButtons, Tabs } from "@/components/ui";
import { CheckIcon, RefreshIcon } from "@/components/icons";
import { TOPIC_LIST, WORDS, type Word } from "@/data/vocab";
import { reviewCard, useHydrated, useNow, useProgress, type Rating } from "@/lib/store";

const NEW_PER_SESSION = 10;

const RATINGS: { value: Rating; label: string; hint: string; cls: string }[] = [
  { value: "again", label: "Otra vez", hint: "No me acordé", cls: "bg-accent-soft text-accent hover:bg-accent hover:text-paper" },
  { value: "hard", label: "Difícil", hint: "Me costó", cls: "bg-gold-soft text-gold hover:bg-gold hover:text-paper" },
  { value: "good", label: "Bien", hint: "Me acordé", cls: "bg-green-soft text-green hover:bg-green hover:text-paper" },
  { value: "easy", label: "Fácil", hint: "Súper fácil", cls: "bg-blue-soft text-blue hover:bg-blue hover:text-paper" },
];

type Direction = "en-es" | "es-en";

function Flashcard({ word, flipped, onFlip, direction }: { word: Word; flipped: boolean; onFlip: () => void; direction: Direction }) {
  const front = direction === "en-es" ? word.en : word.es;
  return (
    <div className="perspective h-80 w-full cursor-pointer select-none" onClick={onFlip}>
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-line bg-card p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            {direction === "en-es" ? "¿Qué significa?" : "¿Cómo se dice en inglés?"}
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">{front}</h2>
          {direction === "en-es" && (
            <div className="mt-6">
              <SpeakButtons text={word.en} />
            </div>
          )}
          <p className="absolute bottom-5 text-xs text-muted">Toca la tarjeta o presiona espacio para voltear</p>
        </div>

        <div
          className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-ink bg-ink p-6 text-center text-paper"
          style={{ transform: "rotateY(180deg)" }}
        >
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">{word.en}</h2>
          <p className="mt-1 text-lg text-accent">{word.es}</p>
          <p className="mt-5 text-lg italic">&ldquo;{word.example}&rdquo;</p>
          <p className="mt-1 text-sm opacity-70">{word.exampleEs}</p>
          {word.note && (
            <p className="mt-4 rounded-full bg-paper/10 px-3 py-1 text-xs font-medium">💡 {word.note}</p>
          )}
          <div className="mt-5">
            <SpeakButtons text={`${word.en}. ${word.example}`} size="sm" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Session({ queue: initial, direction, onExit }: { queue: Word[]; direction: Direction; onExit: () => void }) {
  const [queue, setQueue] = useState(initial);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(0);
  const total = initial.length;
  const current = queue[0];

  const rate = useCallback(
    (r: Rating) => {
      if (!current) return;
      reviewCard(current.id, r);
      setFlipped(false);
      setQueue((q) => {
        const [head, ...rest] = q;
        // Si no te acordaste, la tarjeta vuelve a salir en esta sesión
        if (r === "again") return [...rest.slice(0, 3), head, ...rest.slice(3)];
        return rest;
      });
      if (r !== "again") setDone((d) => d + 1);
    },
    [current],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
      if (!flipped) return;
      const idx = ["Digit1", "Digit2", "Digit3", "Digit4"].indexOf(e.code);
      if (idx >= 0) rate(RATINGS[idx].value);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, rate]);

  if (!current) {
    return (
      <Card initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 text-center">
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green text-paper"
        >
          <CheckIcon width={32} height={32} />
        </motion.div>
        <h2 className="mt-4 font-display text-3xl font-semibold">¡Sesión terminada!</h2>
        <p className="mt-2 text-muted">Repasaste {total} palabras. Las difíciles volverán pronto; las fáciles, en unos días.</p>
        <Button className="mt-6" onClick={onExit}>
          Volver
        </Button>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={onExit} className="text-sm text-muted hover:text-ink">
          ← Salir
        </button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
          <motion.div className="h-full rounded-full bg-accent" animate={{ width: `${(done / total) * 100}%` }} />
        </div>
        <span className="text-sm font-semibold tabular-nums">
          {done}/{total}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id + queue.length}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          <Flashcard word={current} flipped={flipped} onFlip={() => setFlipped((f) => !f)} direction={direction} />
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 min-h-24">
        <AnimatePresence>
          {flipped ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-4 gap-2"
            >
              {RATINGS.map((r, i) => (
                <motion.button
                  key={r.value}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => rate(r.value)}
                  className={`rounded-2xl px-2 py-3 text-center transition-colors ${r.cls}`}
                >
                  <span className="block text-sm font-bold">{r.label}</span>
                  <span className="block text-[11px] opacity-80">
                    {r.hint} · {i + 1}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
              <Button variant="ghost" onClick={() => setFlipped(true)}>
                Mostrar respuesta
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function VocabularyPage() {
  const progress = useProgress();
  const hydrated = useHydrated();
  const [topic, setTopic] = useState<string>("all");
  const [direction, setDirection] = useState<Direction>("en-es");
  const [mode, setMode] = useState<"study" | "browse">("study");
  const [session, setSession] = useState<Word[] | null>(null);

  const pool = useMemo(() => (topic === "all" ? WORDS : WORDS.filter((w) => w.topic === topic)), [topic]);

  const now = useNow();
  const stats = useMemo(() => {
    const due = pool.filter((w) => progress.cards[w.id] && progress.cards[w.id].due <= now);
    const fresh = pool.filter((w) => !progress.cards[w.id]);
    const learned = pool.filter((w) => (progress.cards[w.id]?.interval ?? 0) >= 3).length;
    return { due, fresh, learned };
  }, [pool, progress.cards, now]);

  const start = () => {
    const due = [...stats.due].sort((a, b) => progress.cards[a.id].due - progress.cards[b.id].due);
    const fresh = [...stats.fresh].sort(() => Math.random() - 0.5).slice(0, NEW_PER_SESSION);
    setSession([...due, ...fresh]);
  };

  if (session) {
    return <Session queue={session} direction={direction} onExit={() => setSession(null)} />;
  }

  return (
    <div>
      <PageHeader eyebrow="Vocabulario" title="Palabras que de verdad se usan">
        Expresiones de uso diario que casi nunca vienen en los libros. Las tarjetas usan repaso espaciado: lo que
        olvidas vuelve pronto, lo que dominas aparece cada vez menos.
      </PageHeader>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Tabs
          id="vocab-mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: "study", label: "Estudiar" },
            { value: "browse", label: "Ver todas" },
          ]}
        />
        {mode === "study" && (
          <Tabs
            id="vocab-dir"
            value={direction}
            onChange={setDirection}
            options={[
              { value: "en-es", label: "Inglés → Español" },
              { value: "es-en", label: "Español → Inglés" },
            ]}
          />
        )}
      </div>

      <div className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {[{ key: "all", label: "Todas", emoji: "✨", count: WORDS.length }, ...TOPIC_LIST].map((t) => (
          <button
            key={t.key}
            onClick={() => setTopic(t.key)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              topic === t.key ? "border-ink bg-ink text-paper" : "border-line bg-card text-muted hover:text-ink"
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {mode === "study" ? (
        <Card initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              {stats.due.length + Math.min(stats.fresh.length, NEW_PER_SESSION) > 0 ? "Lista tu sesión" : "¡Todo al día! 🎉"}
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { n: stats.due.length, label: "por repasar", cls: "text-accent" },
                { n: Math.min(stats.fresh.length, NEW_PER_SESSION), label: "nuevas", cls: "text-blue" },
                { n: stats.learned, label: "dominadas", cls: "text-green" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-paper p-3 text-center">
                  <p className={`font-display text-3xl font-semibold ${s.cls}`}>{hydrated ? s.n : "–"}</p>
                  <p className="text-xs text-muted">{s.label}</p>
                </div>
              ))}
            </div>
            {stats.due.length + stats.fresh.length === 0 && (
              <p className="mt-3 text-sm text-muted">Vuelve más tarde o elige otro tema para aprender palabras nuevas.</p>
            )}
          </div>
          <Button
            onClick={start}
            disabled={!hydrated || stats.due.length + stats.fresh.length === 0}
            className="px-8 py-4 text-base"
          >
            <RefreshIcon /> Empezar
          </Button>
        </Card>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.02 }}
          className="grid gap-3 sm:grid-cols-2"
        >
          {pool.map((w) => {
            const state = progress.cards[w.id];
            const learned = (state?.interval ?? 0) >= 3;
            return (
              <motion.div
                key={w.id}
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                className="flex items-start gap-3 rounded-2xl border border-line bg-card p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{w.en}</p>
                    {hydrated && learned && <span className="h-2 w-2 rounded-full bg-green" title="Dominada" />}
                  </div>
                  <p className="text-sm text-accent">{w.es}</p>
                  <p className="mt-1.5 text-sm italic text-muted">{w.example}</p>
                  {w.note && <p className="mt-1 text-xs text-gold">💡 {w.note}</p>}
                </div>
                <SpeakButtons text={`${w.en}. ${w.example}`} size="sm" withSlow={false} />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
