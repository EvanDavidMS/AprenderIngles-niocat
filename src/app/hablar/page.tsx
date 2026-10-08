"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button, Card, DiffView, PageHeader, RateControl, ScoreBadge, SpeakButtons, Tabs } from "@/components/ui";
import { ArrowRight, EyeIcon, MicIcon, StopIcon } from "@/components/icons";
import { CONVERSATION, SHADOWING } from "@/data/speaking";
import { diffWords, tokenize } from "@/lib/compare";
import { speak, useSpeechRecognition } from "@/lib/speech";
import { earn, useProgress } from "@/lib/store";

function MicButton({ listening, onStart, onStop }: { listening: boolean; onStart: () => void; onStop: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.04 }}
      onClick={listening ? onStop : onStart}
      className={`relative flex h-20 w-20 items-center justify-center rounded-full text-paper shadow-lg transition-colors ${
        listening ? "bg-accent" : "bg-ink"
      }`}
      aria-label={listening ? "Detener" : "Hablar"}
    >
      {listening &&
        [0, 0.5].map((d) => (
          <motion.span
            key={d}
            className="absolute inset-0 rounded-full bg-accent"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.4, repeat: Infinity, delay: d }}
          />
        ))}
      <span className="relative">{listening ? <StopIcon width={30} height={30} /> : <MicIcon width={32} height={32} />}</span>
    </motion.button>
  );
}

function Unsupported() {
  return (
    <Card className="bg-gold-soft text-sm">
      <strong>Tu navegador no puede escucharte.</strong> El reconocimiento de voz funciona en <strong>Google Chrome</strong> o{" "}
      <strong>Microsoft Edge</strong> (en compu o Android). Mientras tanto puedes practicar igual: escucha la frase, repítela en
      voz alta imitando el ritmo y califícate tú mismo.
    </Card>
  );
}

function Shadowing() {
  const { settings } = useProgress();
  const [groupKey, setGroupKey] = useState(SHADOWING[0].key);
  const [index, setIndex] = useState(0);
  const rec = useSpeechRecognition(settings.accent);
  const [result, setResult] = useState<ReturnType<typeof diffWords> | null>(null);
  const awarded = useRef(false);

  const group = SHADOWING.find((g) => g.key === groupKey)!;
  const phrase = group.phrases[index];

  // Cuando termina de escuchar, calificamos
  useEffect(() => {
    if (rec.listening || !rec.transcript) return;
    const r = diffWords(phrase.en, rec.transcript);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resultado derivado al terminar la grabación
    setResult(r);
    if (!awarded.current) {
      awarded.current = true;
      earn(r.score >= 85 ? 8 : 4, "speaking");
    }
  }, [rec.listening, rec.transcript, phrase.en]);

  const go = (i: number) => {
    setIndex(i);
    setResult(null);
    rec.reset();
    awarded.current = false;
  };

  const selfRate = () => {
    earn(5, "speaking");
    go((index + 1) % group.phrases.length);
  };

  return (
    <div className="space-y-5">
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {SHADOWING.map((g) => (
          <button
            key={g.key}
            onClick={() => {
              setGroupKey(g.key);
              go(0);
            }}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              groupKey === g.key ? "border-ink bg-ink text-paper" : "border-line bg-card text-muted hover:text-ink"
            }`}
          >
            {g.emoji} {g.label}
          </button>
        ))}
      </div>

      {!rec.supported && <Unsupported />}

      <AnimatePresence mode="wait">
        <motion.div key={groupKey + index} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <Card className="space-y-6 text-center">
            <div className="flex justify-center gap-1.5">
              {group.phrases.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-accent" : "w-2 bg-line hover:bg-muted"}`}
                  aria-label={`Frase ${i + 1}`}
                />
              ))}
            </div>

            <div>
              <p className="font-display text-3xl font-semibold leading-tight sm:text-4xl">{phrase.en}</p>
              <p className="mt-2 text-muted">{phrase.es}</p>
            </div>

            <div className="flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <SpeakButtons text={phrase.en} />
                <span className="text-xs text-muted">1. Escucha</span>
              </div>
              {rec.supported && (
                <div className="flex flex-col items-center gap-2">
                  <MicButton
                    listening={rec.listening}
                    onStart={() => {
                      setResult(null);
                      awarded.current = false;
                      rec.start();
                    }}
                    onStop={rec.stop}
                  />
                  <span className="text-xs text-muted">2. {rec.listening ? "Te escucho…" : "Repite"}</span>
                </div>
              )}
            </div>

            {rec.error && <p className="text-sm text-accent">{rec.error}</p>}

            {rec.listening && rec.transcript && <p className="text-lg italic text-muted">{rec.transcript}</p>}

            <AnimatePresence>
              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 rounded-2xl bg-paper p-4 text-left">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">Lo que entendí</span>
                    <ScoreBadge score={result.score} />
                  </div>
                  <DiffView parts={result.parts} />
                  {result.score < 85 && (
                    <p className="text-sm text-muted">
                      Las palabras resaltadas no se entendieron bien. Escúchala en lento 🐌, fíjate en esas palabras y vuelve a
                      intentar.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap justify-center gap-2">
              {!rec.supported && (
                <Button variant="soft" onClick={selfRate}>
                  Ya la dije en voz alta ✓
                </Button>
              )}
              <Button variant="ghost" onClick={() => go((index + 1) % group.phrases.length)}>
                Siguiente frase <ArrowRight />
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <Card className="text-sm text-muted">
        <strong className="text-ink">Técnica &ldquo;shadowing&rdquo;:</strong> escucha la frase y repítela imitando
        exactamente el ritmo, la entonación y dónde se juntan las palabras, como si fueras un eco. No te preocupes por el
        acento perfecto: lo importante es el ritmo.
      </Card>
    </div>
  );
}

function Conversation() {
  const { settings } = useProgress();
  const [index, setIndex] = useState(0);
  const [showSample, setShowSample] = useState(false);
  const [showEs, setShowEs] = useState(false);
  const rec = useSpeechRecognition(settings.accent);
  const awarded = useRef(false);
  const prompt = CONVERSATION[index];

  useEffect(() => {
    if (rec.listening || awarded.current) return;
    if (tokenize(rec.transcript).length >= 4) {
      awarded.current = true;
      earn(10, "speaking");
    }
  }, [rec.listening, rec.transcript]);

  const ask = () => speak(prompt.q, { lang: settings.accent, rate: settings.rate });

  const next = () => {
    setIndex((i) => (i + 1) % CONVERSATION.length);
    setShowSample(false);
    setShowEs(false);
    rec.reset();
    awarded.current = false;
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <RateControl />
      </div>
      {!rec.supported && <Unsupported />}
      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
          <Card className="space-y-5">
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-soft text-2xl"
              >
                🧑‍🦱
              </motion.div>
              <div className="min-w-0 flex-1">
                <div className="inline-block rounded-3xl rounded-tl-md bg-blue-soft px-5 py-3">
                  <p className="font-display text-xl font-semibold sm:text-2xl">{prompt.q}</p>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <SpeakButtons text={prompt.q} size="sm" />
                  <button onClick={() => setShowEs((s) => !s)} className="text-xs text-muted underline-offset-2 hover:underline">
                    {showEs ? prompt.es : "¿No entendiste? Ver traducción"}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-paper p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Frases que te pueden servir</p>
              <div className="flex flex-wrap gap-2">
                {prompt.useful.map((u) => (
                  <span key={u} className="rounded-full border border-line bg-card px-3 py-1 text-sm">
                    {u}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 py-2">
              {rec.supported ? (
                <>
                  <MicButton listening={rec.listening} onStart={rec.start} onStop={rec.stop} />
                  <span className="text-xs text-muted">
                    {rec.listening ? "Te escucho… toca para terminar" : "Toca y responde en voz alta (2-3 oraciones)"}
                  </span>
                </>
              ) : (
                <Button variant="ghost" onClick={ask}>
                  Escuchar la pregunta otra vez
                </Button>
              )}
              {rec.error && <p className="text-sm text-accent">{rec.error}</p>}
            </div>

            <AnimatePresence>
              {rec.transcript && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                  <div className="max-w-[90%] rounded-3xl rounded-tr-md bg-ink px-5 py-3 text-paper">
                    <p className="text-xs opacity-60">Tú dijiste:</p>
                    <p className="text-lg">{rec.transcript}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {rec.transcript && !rec.listening && (
              <p className="text-center text-xs text-muted">
                Si lo que aparece no es lo que querías decir, probablemente alguna palabra no se entendió bien. ¡Inténtalo otra vez!
              </p>
            )}

            <div className="flex flex-wrap justify-between gap-2 border-t border-line pt-4">
              <Button variant="ghost" onClick={() => setShowSample((s) => !s)}>
                <EyeIcon /> {showSample ? "Ocultar ejemplo" : "Ver respuesta de ejemplo"}
              </Button>
              <Button onClick={next}>
                Otra pregunta <ArrowRight />
              </Button>
            </div>

            <AnimatePresence>
              {showSample && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="flex items-start gap-3 rounded-2xl bg-green-soft p-4">
                    <p className="flex-1 italic">{prompt.sample}</p>
                    <SpeakButtons text={prompt.sample} size="sm" />
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

export default function SpeakingPage() {
  const [tab, setTab] = useState<"shadow" | "talk">("shadow");
  return (
    <div>
      <PageHeader eyebrow="Hablar" title="Pierde el miedo a hablar">
        Aquí nadie te juzga. Primero repite frases útiles para soltar la boca; después responde preguntas reales como en una
        plática.
      </PageHeader>
      <div className="mb-6">
        <Tabs
          id="speak-tab"
          value={tab}
          onChange={setTab}
          options={[
            { value: "shadow", label: "Repetir frases" },
            { value: "talk", label: "Conversación" },
          ]}
        />
      </div>
      {tab === "shadow" ? <Shadowing /> : <Conversation />}
    </div>
  );
}
