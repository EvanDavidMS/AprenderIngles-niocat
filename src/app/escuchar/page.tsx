"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Button, Card, DiffView, PageHeader, RateControl, ScoreBadge, SpeakButtons, Tabs } from "@/components/ui";
import { ArrowRight, SnailIcon, SpeakerIcon } from "@/components/icons";
import { DICTATIONS, REDUCTIONS } from "@/data/listening";
import { diffWords } from "@/lib/compare";
import { speak } from "@/lib/speech";
import { earn, useProgress } from "@/lib/store";

const LEVELS = [
  { value: "1", label: "Nivel 1 · Básico" },
  { value: "2", label: "Nivel 2 · Intermedio" },
  { value: "3", label: "Nivel 3 · Nativo" },
] as const;

type Level = (typeof LEVELS)[number]["value"];

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function Dictation() {
  const { settings } = useProgress();
  const [level, setLevel] = useState<Level>("1");
  const [order, setOrder] = useState(() => DICTATIONS.filter((d) => d.level === 1));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<ReturnType<typeof diffWords> | null>(null);
  const [plays, setPlays] = useState(0);
  const [playing, setPlaying] = useState<"normal" | "slow" | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const item = order[index % order.length];

  const changeLevel = (l: Level) => {
    setLevel(l);
    setOrder(shuffle(DICTATIONS.filter((d) => d.level === Number(l))));
    setIndex(0);
    reset();
  };

  const reset = () => {
    setAnswer("");
    setResult(null);
    setPlays(0);
  };

  const play = (mode: "normal" | "slow") => {
    setPlays((p) => p + 1);
    setPlaying(mode);
    speak(item.text, {
      lang: settings.accent,
      rate: mode === "slow" ? 0.6 : settings.rate,
      onEnd: () => {
        setPlaying(null);
        inputRef.current?.focus();
      },
    });
  };

  const check = () => {
    const r = diffWords(item.text, answer);
    setResult(r);
    earn(r.score >= 90 ? 10 : r.score >= 60 ? 6 : 3, "dictations");
  };

  const next = () => {
    setIndex((i) => i + 1);
    reset();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs id="levels" value={level} onChange={changeLevel} options={[...LEVELS]} />
        <RateControl />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={item.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
          <Card className="space-y-6">
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <p className="text-sm text-muted">Escucha y escribe exactamente lo que oyes</p>
              <div className="flex items-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.04 }}
                  onClick={() => play("normal")}
                  className="relative flex h-24 w-24 items-center justify-center rounded-full bg-blue text-paper shadow-lg"
                  aria-label="Reproducir"
                >
                  {playing === "normal" &&
                    [0, 0.4].map((d) => (
                      <motion.span
                        key={d}
                        className="absolute inset-0 rounded-full border-4 border-blue"
                        initial={{ scale: 1, opacity: 0.7 }}
                        animate={{ scale: 1.7, opacity: 0 }}
                        transition={{ duration: 1.3, repeat: Infinity, delay: d }}
                      />
                    ))}
                  <SpeakerIcon width={40} height={40} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => play("slow")}
                  className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-soft text-green"
                  aria-label="Reproducir lento"
                  title="Lento"
                >
                  {playing === "slow" && (
                    <motion.span
                      className="absolute inset-0 rounded-full border-2 border-green"
                      animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                  )}
                  <SnailIcon width={24} height={24} />
                </motion.button>
              </div>
              <p className="text-xs text-muted">
                {plays === 0 ? "Puedes escucharlo las veces que quieras" : `Escuchado ${plays} ${plays === 1 ? "vez" : "veces"}`}
              </p>
            </div>

            <textarea
              ref={inputRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (result) next();
                  else if (answer.trim()) check();
                }
              }}
              disabled={!!result}
              rows={2}
              placeholder="Escribe aquí lo que escuchaste…"
              className="w-full resize-none rounded-2xl border border-line bg-paper px-4 py-3 text-lg outline-none transition-colors placeholder:text-muted/60 focus:border-ink disabled:opacity-70"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />

            <AnimatePresence>
              {result && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 overflow-hidden">
                  <div className="flex flex-wrap items-center gap-3">
                    <ScoreBadge score={result.score} />
                    <span className="text-xs text-muted">
                      <span className="text-green">verde</span> = bien ·{" "}
                      <span className="text-accent">resaltado</span> = te faltó ·{" "}
                      <span className="line-through">tachado</span> = sobró o estaba mal
                    </span>
                  </div>
                  <DiffView parts={result.parts} />
                  <div className="rounded-2xl bg-paper p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-xl font-semibold">{item.text}</p>
                        <p className="text-sm text-muted">{item.es}</p>
                      </div>
                      <SpeakButtons text={item.text} size="sm" />
                    </div>
                    {item.sounds && (
                      <p className="mt-3 text-sm">
                        <span className="font-semibold text-blue">Así suena: </span>
                        <span className="italic">&ldquo;{item.sounds}&rdquo;</span>
                      </p>
                    )}
                    <p className="mt-2 text-sm">
                      <span className="font-semibold text-gold">💡 </span>
                      {item.tip}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap justify-end gap-2">
              {!result ? (
                <>
                  <Button variant="ghost" onClick={() => setResult(diffWords(item.text, answer))}>
                    Me rindo, muéstrame
                  </Button>
                  <Button onClick={check} disabled={!answer.trim()}>
                    Revisar
                  </Button>
                </>
              ) : (
                <Button onClick={next}>
                  Siguiente <ArrowRight />
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-xs text-muted">
        Frase {(index % order.length) + 1} de {order.length} · Enter para revisar / continuar
      </p>
    </div>
  );
}

function Reductions() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const items = useMemo(() => REDUCTIONS, []);
  return (
    <div className="space-y-5">
      <Card className="bg-blue-soft">
        <p className="text-sm">
          <strong>¿Por qué no entiendes a los nativos?</strong> No es solo vocabulario: al hablar rápido, las palabras se
          funden. Nadie dice <em>&ldquo;What are you going to do?&rdquo;</em>, dicen <em>&ldquo;Whatcha gonna do?&rdquo;</em>. Si
          aprendes a reconocer estas formas, de repente vas a entender mucho más.
        </p>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((r, i) => {
          const open = revealed.has(r.short);
          return (
            <motion.button
              key={r.short}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.025 }}
              onClick={() =>
                setRevealed((s) => {
                  const n = new Set(s);
                  if (n.has(r.short)) n.delete(r.short);
                  else n.add(r.short);
                  return n;
                })
              }
              className="rounded-2xl border border-line bg-card p-4 text-left transition-colors hover:border-ink"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-2xl font-semibold text-accent">{r.short}</p>
                <SpeakButtons text={r.example} size="sm" withSlow={false} />
              </div>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    <p className="mt-1 text-sm">
                      = <strong>{r.full}</strong>
                    </p>
                    <p className="mt-1 text-sm italic text-muted">{r.example}</p>
                  </motion.div>
                ) : (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 text-xs text-muted">
                    Toca para ver qué significa
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default function ListeningPage() {
  const [tab, setTab] = useState<"dictation" | "reductions">("dictation");
  return (
    <div>
      <PageHeader eyebrow="Escuchar" title="Entrena el oído">
        Los dictados te obligan a escuchar cada palabra, incluso las pequeñitas que normalmente te saltas. Empieza en
        velocidad normal y usa el caracol 🐌 solo si de plano no entiendes.
      </PageHeader>
      <div className="mb-6">
        <Tabs
          id="listen-tab"
          value={tab}
          onChange={setTab}
          options={[
            { value: "dictation", label: "Dictado" },
            { value: "reductions", label: "Así hablan los nativos" },
          ]}
        />
      </div>
      {tab === "dictation" ? <Dictation /> : <Reductions />}
    </div>
  );
}
