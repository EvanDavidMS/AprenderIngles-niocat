"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button, Card, PageHeader, ScoreBadge, SpeakButtons } from "@/components/ui";
import { ArrowRight, CheckIcon, XIcon } from "@/components/icons";
import { GRAMMAR, type GrammarTopic } from "@/data/grammar";
import { saveGrammarScore } from "@/lib/store";

function Quiz({ topic }: { topic: GrammarTopic }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const total = topic.quiz.length;
  const q = topic.quiz[i];

  const restart = () => {
    setI(0);
    setPicked(null);
    setCorrect(0);
  };

  if (!q) {
    const score = Math.round((correct / total) * 100);
    return (
      <Card initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
        <p className="font-display text-5xl font-semibold">
          {correct}/{total}
        </p>
        <div className="mt-3">
          <ScoreBadge score={score} />
        </div>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
          {score === 100
            ? "¡Perfecto! Ahora intenta usar esta estructura hoy en una frase en voz alta."
            : "Repasa los errores típicos de arriba y vuelve a intentarlo."}
        </p>
        <Button variant="ghost" className="mt-5" onClick={restart}>
          Repetir quiz
        </Button>
      </Card>
    );
  }

  const pick = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    const ok = idx === q.answer;
    const newCorrect = correct + (ok ? 1 : 0);
    if (ok) setCorrect(newCorrect);
    if (i === total - 1) saveGrammarScore(topic.slug, Math.round((newCorrect / total) * 100));
  };

  const [before, after] = q.q.split("___");

  return (
    <AnimatePresence mode="wait">
      <motion.div key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
        <Card className="space-y-5">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>
              Pregunta {i + 1} de {total}
            </span>
            <span className="font-semibold text-green">{correct} ✓</span>
          </div>
          <p className="font-display text-2xl font-semibold leading-snug">
            {before}
            <span className={`mx-1 inline-block min-w-16 border-b-2 text-center ${picked === null ? "border-ink" : picked === q.answer ? "border-green text-green" : "border-accent text-accent"}`}>
              {picked === null ? " " : q.options[q.answer]}
            </span>
            {after}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {q.options.map((o, idx) => {
              const isAnswer = idx === q.answer;
              const isPicked = idx === picked;
              const state =
                picked === null
                  ? "border-line bg-paper hover:border-ink"
                  : isAnswer
                    ? "border-green bg-green-soft text-green"
                    : isPicked
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-line opacity-50";
              return (
                <motion.button
                  key={o}
                  whileTap={picked === null ? { scale: 0.97 } : undefined}
                  animate={isPicked && !isAnswer ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  onClick={() => pick(idx)}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left font-medium transition-colors ${state}`}
                >
                  {o}
                  {picked !== null && isAnswer && <CheckIcon />}
                  {isPicked && !isAnswer && <XIcon />}
                </motion.button>
              );
            })}
          </div>
          <AnimatePresence>
            {picked !== null && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                <p className="rounded-2xl bg-paper p-4 text-sm">
                  <strong>{picked === q.answer ? "¡Correcto! " : "Ojo: "}</strong>
                  {q.why}
                </p>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => {
                      setI((n) => n + 1);
                      setPicked(null);
                    }}
                  >
                    {i === total - 1 ? "Ver resultado" : "Siguiente"} <ArrowRight />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export function GrammarLesson({ topic }: { topic: GrammarTopic }) {
  const idx = GRAMMAR.findIndex((g) => g.slug === topic.slug);
  const next = GRAMMAR[(idx + 1) % GRAMMAR.length];

  return (
    <div className="space-y-8">
      <div>
        <Link href="/gramatica" className="text-sm text-muted hover:text-ink">
          ← Todos los temas
        </Link>
      </div>
      <PageHeader eyebrow={topic.subtitle} title={topic.title}>
        {topic.intro}
      </PageHeader>

      <section className="space-y-4">
        {topic.rules.map((r, i) => (
          <Card
            key={r.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.05 }}
          >
            <h2 className="font-display text-xl font-semibold">{r.title}</h2>
            {r.text && <p className="mt-1 text-muted">{r.text}</p>}
            <ul className="mt-4 space-y-2">
              {r.examples.map(([en, es]) => (
                <li key={en} className="flex items-start gap-3 rounded-2xl bg-paper p-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{en}</p>
                    <p className="text-sm text-muted">{es}</p>
                  </div>
                  <SpeakButtons text={en.replace(/^"[^"]*"\s*→\s*/, "")} size="sm" withSlow={false} />
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="mb-3 font-display text-2xl font-semibold">Errores típicos de hispanohablantes</h2>
        <div className="space-y-3">
          {topic.mistakes.map((m) => (
            <motion.div
              key={m.wrong}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-line bg-card p-4"
            >
              <p className="flex items-center gap-2 text-accent line-through decoration-2">
                <XIcon width={16} height={16} className="shrink-0" /> {m.wrong}
              </p>
              <p className="mt-1 flex items-center gap-2 font-semibold text-green">
                <CheckIcon width={16} height={16} className="shrink-0" /> {m.right}
              </p>
              <p className="mt-2 text-sm text-muted">{m.why}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-2xl font-semibold">Ponte a prueba</h2>
        <Quiz key={topic.slug} topic={topic} />
      </section>

      <Link
        href={`/gramatica/${next.slug}`}
        className="group flex items-center justify-between rounded-3xl bg-ink p-5 text-paper transition-colors hover:bg-accent"
      >
        <div>
          <p className="text-xs uppercase tracking-wider opacity-70">Siguiente tema</p>
          <p className="font-display text-xl font-semibold">{next.title}</p>
        </div>
        <ArrowRight className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
