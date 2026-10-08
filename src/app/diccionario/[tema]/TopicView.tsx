"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { builderSentences, topicBySlug, type Entry, type Sentence, type Topic } from "@/data/dictionary";
import { TOPIC_BG } from "@/components/topic-colors";
import { SpeakButtons } from "@/components/ui";
import { WordBuilder } from "@/components/WordBuilder";
import { ArrowLeft, BlocksIcon, BookIcon, EyeIcon, QuestionIcon, SearchIcon } from "@/components/icons";

type Tab = "words" | "questions" | "blocks";

const TABS: { value: Tab; label: string; Icon: typeof BookIcon }[] = [
  { value: "words", label: "Palabras", Icon: BookIcon },
  { value: "questions", label: "Preguntas", Icon: QuestionIcon },
  { value: "blocks", label: "Armar frases", Icon: BlocksIcon },
];

const ease = [0.22, 1, 0.36, 1] as const;

function FormRow({ label, en, es }: { label: string; en: string; es: string | null }) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] items-center gap-3 border-t border-line py-2.5 first:border-t-0">
      <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">{label}</span>
      <div className="flex min-w-0 items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="font-bold">{en}</p>
          {es && <p className="text-sm text-muted">{es}</p>}
        </div>
        <SpeakButtons text={en} size="sm" withSlow={false} />
      </div>
    </div>
  );
}

function ExampleLine({ label, s }: { label: string; s: Sentence }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-paper p-3">
      <span className="mt-0.5 shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-accent">
        {label}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{s.en}</p>
        <p className="text-sm text-muted">{s.es}</p>
      </div>
      <SpeakButtons text={s.en} size="sm" />
    </div>
  );
}

function WordDetail({ topic, e }: { topic: Topic; e: Entry }) {
  const ex = topic.examples(e);
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease }}
      className="overflow-hidden"
    >
      <div className="grid gap-3 pt-4 md:grid-cols-2">
        <div className="self-start rounded-2xl border border-line px-3">
          {e.kind === "verb" ? (
            <>
              <FormRow label="Yo / tú" en={e.singEn} es={e.es} />
              <FormRow label="Él / ella" en={e.plEn!} es="En presente, con he / she / it cambia (casi siempre +s)" />
              <FormRow label="Pasado" en={e.past!} es={e.past !== `${e.en}ed` && e.past !== `${e.en}d` ? "Irregular: hay que memorizarlo" : "Regular: termina en -ed"} />
            </>
          ) : e.kind === "adj" ? (
            <>
              <FormRow label="Singular" en={e.singEn} es={e.singEs} />
              <FormRow label="Plural" en={e.plEn!} es={`${e.plEs} · en inglés no cambia`} />
            </>
          ) : (
            <>
              <FormRow label="Singular" en={e.singEn} es={e.singEs} />
              {e.plEn ? (
                <FormRow label="Plural" en={e.plEn} es={e.plEs} />
              ) : (
                <div className="grid grid-cols-[5.5rem_1fr] gap-3 border-t border-line py-2.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">Plural</span>
                  <p className="text-sm text-muted">
                    {e.noPlural ? (
                      <>Normalmente no se usa en plural.</>
                    ) : (
                      <>
                        No se cuenta (incontable): no lleva &ldquo;a&rdquo; ni &ldquo;s&rdquo;. Para cantidades se dice{" "}
                        <b className="text-ink">some {e.en}</b> o <b className="text-ink">a lot of {e.en}</b>.
                      </>
                    )}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        <div className="space-y-3">
          {ex.sing && <ExampleLine label={e.kind === "verb" || !ex.plural ? "Ejemplo" : "Uno"} s={ex.sing} />}
          {ex.plural && <ExampleLine label={e.kind === "adj" ? "Plural" : "Varios"} s={ex.plural} />}
          {e.note && (
            <p className="rounded-2xl bg-gold-soft px-3 py-2.5 text-sm font-medium text-ink">
              <span className="mr-1">💡</span>
              {e.note}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function WordCard({ topic, e, open, onToggle }: { topic: Topic; e: Entry; open: boolean; onToggle: () => void }) {
  const badge = e.pair ? "siempre plural" : e.uncountable ? "incontable" : e.noPlural ? "sin plural" : null;
  const irregular = e.kind === "noun" && e.plEn && !e.pair && e.enPl !== `${e.en}s` && e.enPl !== `${e.en}es`;
  return (
    <motion.div
      layout
      id={e.id}
      transition={{ layout: { duration: 0.35, ease } }}
      className={`scroll-mt-40 rounded-3xl border bg-card p-4 shadow-soft transition-colors ${open ? "border-accent/50 md:col-span-2" : "border-line/70"}`}
    >
      <motion.div layout="position" className="flex items-center gap-3">
        <button onClick={onToggle} className="min-w-0 flex-1 text-left" aria-expanded={open}>
          <p className="flex flex-wrap items-center gap-2">
            <span className="font-display text-xl font-extrabold">{e.en}</span>
            {badge && (
              <span className="rounded-full bg-blue-soft px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-blue">
                {badge}
              </span>
            )}
            {irregular && (
              <span className="rounded-full bg-rose px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-on-pastel">
                plural: {e.enPl}
              </span>
            )}
          </p>
          <p className="truncate text-sm text-muted">{e.es}</p>
        </button>
        <SpeakButtons text={e.en} size="sm" />
        <motion.button
          onClick={onToggle}
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold ${open ? "bg-accent text-white" : "bg-paper text-muted"}`}
          aria-label={open ? "Cerrar" : "Ver singular, plural y ejemplos"}
        >
          +
        </motion.button>
      </motion.div>
      <AnimatePresence initial={false}>{open && <WordDetail topic={topic} e={e} />}</AnimatePresence>
    </motion.div>
  );
}

function QuestionCard({ q, i }: { q: Topic["questions"][number]; i: number }) {
  const [shown, setShown] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05, duration: 0.4, ease }}
      className="rounded-3xl border border-line/70 bg-card p-5 shadow-soft"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft font-display font-black text-accent">
          ?
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-extrabold leading-snug">{q.q}</p>
          <p className="text-sm text-muted">{q.qEs}</p>
        </div>
        <SpeakButtons text={q.q} size="sm" />
      </div>
      <div className="mt-4 pl-12">
        <AnimatePresence mode="wait" initial={false}>
          {shown ? (
            <motion.div
              key="a"
              initial={{ opacity: 0, rotateX: -70, y: -6 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              style={{ transformOrigin: "top" }}
              className="flex items-start gap-3 rounded-2xl bg-green-soft p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-bold text-green">{q.a}</p>
                <p className="text-sm text-muted">{q.aEs}</p>
              </div>
              <SpeakButtons text={q.a} size="sm" withSlow={false} />
            </motion.div>
          ) : (
            <motion.button
              key="btn"
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setShown(true)}
              className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-line px-4 py-2.5 text-sm font-bold text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <EyeIcon width={16} height={16} />
              Piensa tu respuesta y luego toca para ver un ejemplo
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function TopicView({ slug }: { slug: string }) {
  const topic = topicBySlug(slug)!;
  const [tab, setTab] = useState<Tab>("words");
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const sentences = useMemo(() => builderSentences(topic), [topic]);

  // abrir una palabra que viene del buscador (#id)
  useEffect(() => {
    const focus = (id: string) => {
      if (!topic.entries.some((e) => e.id === id)) return;
      setTab("words");
      setFilter("");
      setOpen(id);
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    };
    const fromHash = () => focus(decodeURIComponent(window.location.hash.slice(1)));
    fromHash();
    const onEvent = (ev: Event) => focus((ev as CustomEvent<string>).detail);
    window.addEventListener("dict-focus", onEvent);
    window.addEventListener("hashchange", fromHash);
    return () => {
      window.removeEventListener("dict-focus", onEvent);
      window.removeEventListener("hashchange", fromHash);
    };
  }, [topic]);

  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const shown = filter.trim()
    ? topic.entries.filter((e) => norm(e.en).includes(norm(filter)) || norm(e.es).includes(norm(filter)))
    : topic.entries;

  return (
    <div>
      <Link href="/diccionario" className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-muted transition-colors hover:text-ink">
        <ArrowLeft width={16} height={16} /> Todos los temas
      </Link>

      {/* portada del tema */}
      <motion.section
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease }}
        className="relative overflow-hidden rounded-[2rem] bg-hero p-6 text-hero-ink sm:p-8"
      >
        <motion.div
          aria-hidden
          className={`absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-90 sm:-right-10 sm:-top-10 sm:h-72 sm:w-72 ${TOPIC_BG[topic.color]}`}
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
          {topic.emoji}
        </motion.span>
        <div className="relative max-w-xl pt-10 sm:pr-40 sm:pt-0">
          <p className="text-sm font-bold opacity-60">{topic.titleEn}</p>
          <h1 className="mt-1 font-display text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl">{topic.title}</h1>
          <p className="mt-3 opacity-75">{topic.blurb}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-white/10 px-3 py-1.5">{topic.entries.length} palabras</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">{topic.questions.length} preguntas</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">{sentences.length} frases para armar</span>
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
                  layoutId="topic-tab"
                  className="absolute inset-0 rounded-xl bg-accent"
                  transition={{ type: "spring", stiffness: 450, damping: 34 }}
                />
              )}
              <Icon width={16} height={16} className="relative hidden shrink-0 min-[400px]:block" />
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
          {tab === "words" && (
            <>
              <label className="mb-4 flex max-w-sm items-center gap-2 rounded-2xl border border-line bg-card px-4 py-2.5 text-muted focus-within:border-accent">
                <SearchIcon width={16} height={16} />
                <input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder={`Filtrar en ${topic.title.toLowerCase()}…`}
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                />
              </label>
              <p className="mb-4 text-sm text-muted">
                Toca <b className="text-ink">+</b> en cualquier palabra para ver su singular, plural y frases de ejemplo.
              </p>
              <div className="grid items-start gap-3 md:grid-cols-2">
                {shown.map((e) => (
                  <WordCard key={e.id} topic={topic} e={e} open={open === e.id} onToggle={() => setOpen(open === e.id ? null : e.id)} />
                ))}
              </div>
              {shown.length === 0 && <p className="py-10 text-center text-muted">Ninguna palabra coincide con &ldquo;{filter}&rdquo;.</p>}
            </>
          )}

          {tab === "questions" && (
            <div className="grid gap-4 md:grid-cols-2">
              {topic.questions.map((q, i) => (
                <QuestionCard key={q.q} q={q} i={i} />
              ))}
            </div>
          )}

          {tab === "blocks" && (
            <div className="rounded-[2rem] border border-line/70 bg-card p-5 shadow-soft sm:p-8">
              <WordBuilder topic={topic.slug} sentences={sentences} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
