"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button, Card, PageHeader, ScoreBadge, SpeakButtons, Tabs } from "@/components/ui";
import { ArrowRight, CheckIcon, XIcon } from "@/components/icons";
import { IDIOM_LIST, PHRASAL_VERBS, type Phrase } from "@/data/phrases";
import { earn } from "@/lib/store";

const ROUND = 10;

type Q = { phrase: Phrase; options: string[]; answer: number };

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

function buildQuiz(list: Phrase[]): Q[] {
  return shuffle(list)
    .slice(0, ROUND)
    .map((phrase) => {
      const wrong = shuffle(list.filter((p) => p.id !== phrase.id))
        .slice(0, 3)
        .map((p) => p.es);
      const options = shuffle([phrase.es, ...wrong]);
      return { phrase, options, answer: options.indexOf(phrase.es) };
    });
}

/** Resalta la frase dentro del ejemplo (tolerante a conjugaciones simples) */
function Highlight({ text, phrase }: { text: string; phrase: string }) {
  const first = phrase.split(" ")[0].slice(0, 3);
  if (first.length < 3) return <>{text}</>;
  const re = new RegExp(`(\\b${first}\\w*(?:\\s+\\w+){0,${phrase.split(" ").length - 1}})`, "i");
  const m = text.match(re);
  if (!m || m.index === undefined) return <>{text}</>;
  return (
    <>
      {text.slice(0, m.index)}
      <mark className="rounded bg-gold-soft px-0.5 text-ink">{m[0]}</mark>
      {text.slice(m.index + m[0].length)}
    </>
  );
}

function Quiz({ list, onExit }: { list: Phrase[]; onExit: () => void }) {
  const [questions, setQuestions] = useState(() => buildQuiz(list));
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);

  const q = questions[i];

  if (!q) {
    const score = Math.round((correct / questions.length) * 100);
    return (
      <Card initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-10 text-center">
        <p className="font-display text-6xl font-semibold">
          {correct}/{questions.length}
        </p>
        <div className="mt-3">
          <ScoreBadge score={score} />
        </div>
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="ghost" onClick={onExit}>
            Ver lista
          </Button>
          <Button
            onClick={() => {
              setQuestions(buildQuiz(list));
              setI(0);
              setPicked(null);
              setCorrect(0);
            }}
          >
            Otra ronda
          </Button>
        </div>
      </Card>
    );
  }

  const pick = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.answer) {
      setCorrect((c) => c + 1);
      earn(3, "quizzes");
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={onExit} className="text-sm text-muted hover:text-ink">
          ← Salir
        </button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
          <motion.div className="h-full rounded-full bg-accent" animate={{ width: `${(i / questions.length) * 100}%` }} />
        </div>
        <span className="text-sm font-semibold tabular-nums">
          {i + 1}/{questions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <Card className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">¿Qué significa?</p>
                <p className="mt-1 font-display text-4xl font-semibold">{q.phrase.en}</p>
              </div>
              <SpeakButtons text={q.phrase.en} size="sm" withSlow={false} />
            </div>
            <div className="grid gap-2">
              {q.options.map((o, idx) => {
                const isAnswer = idx === q.answer;
                const isPicked = idx === picked;
                const state =
                  picked === null
                    ? "border-line bg-card hover:border-ink"
                    : isAnswer
                      ? "border-green bg-green-soft text-green"
                      : isPicked
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-line bg-card opacity-50";
                return (
                  <motion.button
                    key={o}
                    whileTap={picked === null ? { scale: 0.98 } : undefined}
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
                  <div className="flex items-start justify-between gap-3 rounded-2xl bg-paper p-4">
                    <p className="italic">
                      <Highlight text={q.phrase.example} phrase={q.phrase.en} />
                    </p>
                    <SpeakButtons text={q.phrase.example} size="sm" withSlow={false} />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={() => {
                        setI((n) => n + 1);
                        setPicked(null);
                      }}
                    >
                      Siguiente <ArrowRight />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function PhrasesPage() {
  const [kind, setKind] = useState<"phrasal" | "idioms">("phrasal");
  const [quiz, setQuiz] = useState(false);
  const list = kind === "phrasal" ? PHRASAL_VERBS : IDIOM_LIST;

  return (
    <div>
      <PageHeader eyebrow="Frases" title="Habla como nativo">
        Los nativos casi no dicen <em>&ldquo;postpone&rdquo;</em> o <em>&ldquo;tolerate&rdquo;</em>: dicen{" "}
        <em>&ldquo;put off&rdquo;</em> y <em>&ldquo;put up with&rdquo;</em>. Los phrasal verbs son la razón #1 por la que
        no se les entiende.
      </PageHeader>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Tabs
          id="phrase-kind"
          value={kind}
          onChange={(v) => {
            setKind(v);
            setQuiz(false);
          }}
          options={[
            { value: "phrasal", label: `Phrasal verbs (${PHRASAL_VERBS.length})` },
            { value: "idioms", label: `Expresiones (${IDIOM_LIST.length})` },
          ]}
        />
        {!quiz && (
          <Button variant="soft" onClick={() => setQuiz(true)}>
            Ponme a prueba →
          </Button>
        )}
      </div>

      {quiz ? (
        <Quiz key={kind} list={list} onExit={() => setQuiz(false)} />
      ) : (
        <motion.div
          key={kind}
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.025 }}
          className="grid gap-3 sm:grid-cols-2"
        >
          {list.map((p) => (
            <motion.div
              key={p.id}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              className="flex items-start gap-3 rounded-2xl border border-line bg-card p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl font-semibold">{p.en}</p>
                <p className="text-sm text-accent">{p.es}</p>
                <p className="mt-1.5 text-sm italic text-muted">
                  <Highlight text={p.example} phrase={p.en} />
                </p>
              </div>
              <SpeakButtons text={p.example} size="sm" withSlow={false} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
