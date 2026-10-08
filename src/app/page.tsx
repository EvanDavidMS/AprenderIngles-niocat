"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, SpeakButtons } from "@/components/ui";
import { ArrowRight, ArrowUpRight, CheckIcon, FlameIcon } from "@/components/icons";
import { TOPIC_BG } from "@/components/topic-colors";
import { DAILY_GOAL, useHydrated, useNow, useProgress } from "@/lib/store";
import { DICTIONARY, TOTAL_WORDS } from "@/data/dictionary";

const FEATURED = ["cuerpo", "animales", "comida"];
const BLOCK_GOAL = 10;

const ROUTINE = [
  { href: "/diccionario", title: "Arma 5 frases", detail: "Bloques en el diccionario", key: "blocks", target: 5, color: "bg-lilac" },
  { href: "/vocabulario", title: "Repasa 10 palabras", detail: "Tarjetas con repaso espaciado", key: "cards", target: 10, color: "bg-peach" },
  { href: "/escuchar", title: "Haz 3 dictados", detail: "Entrena el oído", key: "dictations", target: 3, color: "bg-sky" },
  { href: "/hablar", title: "Di 5 frases en voz alta", detail: "Tu micrófono te corrige", key: "speaking", target: 5, color: "bg-mint" },
  { href: "/gramatica", title: "1 tema de gramática", detail: "Explicación + quiz corto", key: "quizzes", target: 1, color: "bg-lime" },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

function GoalRing({ value }: { value: number }) {
  const pct = Math.min(1, value / DAILY_GOAL);
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--line)" strokeWidth="11" />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 1.4, ease }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-xl font-black">{value}</span>
        <span className="text-[10px] text-muted">/ {DAILY_GOAL} XP</span>
      </div>
    </div>
  );
}

function Stat({ value, label, delay }: { value: number | string; label: string; delay: number }) {
  return (
    <Card className="flex flex-col justify-between">
      <motion.p
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 16, delay }}
        className="origin-left font-display text-4xl font-black"
      >
        {value}
      </motion.p>
      <p className="mt-3 text-sm leading-snug text-muted">{label}</p>
    </Card>
  );
}

export default function Home() {
  const progress = useProgress();
  const hydrated = useHydrated();
  const now = useNow();

  const blocks = hydrated ? progress.blocks : {};
  const todayXp = hydrated ? progress.today.xp : 0;
  const learned = Object.values(progress.cards).filter((c) => c.interval >= 3).length;
  const topicsStarted = Object.keys(blocks).length;
  const featured = DICTIONARY.filter((t) => FEATURED.includes(t.slug));

  // palabra del día: cambia cada 24 h, recorre todo el diccionario
  const all = DICTIONARY.flatMap((t) => t.entries.map((e) => ({ t, e })));
  const dayIndex = hydrated ? Math.floor(now / 86_400_000) : 0;
  const wotd = all[(dayIndex * 37) % all.length];

  return (
    <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.08 }} className="space-y-8">
      {/* Hero */}
      <motion.section variants={item}>
        <h2 className="mb-3 font-display text-lg font-extrabold">Tu progreso</h2>
        <div className="relative overflow-visible rounded-[2rem] bg-hero p-6 text-hero-ink sm:p-8 lg:pr-4">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-md">
              <p className="text-sm opacity-70">¡Hola! 👋</p>
              <h1 className="mt-2 font-display text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl">
                Aprende inglés por temas, gratis y a tu ritmo.
              </h1>
              <p className="mt-3 text-sm opacity-70">
                {TOTAL_WORDS} palabras en {DICTIONARY.length} temas, con singular, plural, audio y frases para armar.
              </p>
              <Link
                href="/diccionario"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#26233a] transition-transform hover:scale-105"
              >
                Ver diccionario <ArrowUpRight width={14} height={14} />
              </Link>
            </div>

            <div className="no-scrollbar -mx-6 flex gap-3 overflow-x-auto px-6 pb-2 sm:mx-0 sm:px-0 lg:-mr-12 lg:overflow-visible">
              {featured.map((t, i) => {
                const done = Math.min(BLOCK_GOAL, blocks[t.slug] ?? 0);
                const pct = Math.round((done / BLOCK_GOAL) * 100);
                return (
                  <motion.div
                    key={t.slug}
                    initial={{ opacity: 0, y: 40, rotate: 8 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 160, damping: 16, delay: 0.25 + i * 0.12 }}
                    whileHover={{ y: -10, rotate: i === 1 ? 0 : i === 0 ? -2 : 2 }}
                    className="shrink-0"
                  >
                    <Link
                      href={`/diccionario/${t.slug}`}
                      className={`flex h-48 w-40 flex-col rounded-3xl p-4 text-on-pastel shadow-xl shadow-black/20 sm:w-44 ${TOPIC_BG[t.color]}`}
                    >
                      <div className="flex justify-between text-xs font-bold opacity-70">
                        <span>0{i + 1}</span>
                        <span>⋮</span>
                      </div>
                      <span className="mt-auto text-3xl">{t.emoji}</span>
                      <p className="mt-2 font-display text-[15px] font-black leading-tight">{t.title}</p>
                      <p className="mt-2 text-[11px] font-semibold opacity-70">
                        {t.entries.length} palabras | {pct}%
                      </p>
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-on-pastel/15">
                        <motion.div
                          className="h-full rounded-full bg-on-pastel"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease, delay: 0.8 }}
                        />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-8">
          {/* Estadísticas */}
          <motion.section variants={item}>
            <h2 className="mb-3 font-display text-lg font-extrabold">Estadísticas</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_1.6fr]">
              <Stat value={hydrated ? progress.xp : 0} label="XP en total" delay={0.3} />
              <Stat value={hydrated ? topicsStarted : 0} label="Temas practicados" delay={0.4} />
              <Card className="col-span-2 flex items-center gap-4 sm:col-span-1">
                <GoalRing value={todayXp} />
                <div>
                  <p className="font-display font-extrabold">{todayXp >= DAILY_GOAL ? "¡Meta cumplida! 🎉" : "Meta de hoy"}</p>
                  <p className="mt-1 text-sm text-muted">
                    {todayXp >= DAILY_GOAL ? "Todo lo extra suma." : `Te faltan ${DAILY_GOAL - todayXp} XP.`}
                  </p>
                  <p className="mt-2 text-xs font-bold text-muted">{hydrated ? learned : 0} palabras dominadas</p>
                </div>
              </Card>
            </div>
          </motion.section>

          {/* Rutina */}
          <motion.section variants={item}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold">Tu rutina de hoy</h2>
              <span className="text-xs font-bold text-muted">~20 min</span>
            </div>
            <div className="space-y-2">
              {ROUTINE.map((r, i) => {
                const count = hydrated ? (progress.today[r.key] ?? 0) : 0;
                const done = count >= r.target;
                return (
                  <motion.div key={r.href} whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                    <Link href={r.href} className="group flex items-center gap-4 rounded-2xl bg-card p-3 pr-4 shadow-soft">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display font-black text-on-pastel ${done ? "bg-green text-white" : r.color}`}
                      >
                        {done ? <CheckIcon /> : i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`font-bold ${done ? "text-muted line-through" : ""}`}>{r.title}</p>
                        <p className="text-xs text-muted">{r.detail}</p>
                      </div>
                      <span className="text-xs font-bold text-muted">
                        {Math.min(count, r.target)}/{r.target}
                      </span>
                      <ArrowRight width={18} height={18} className="shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-ink" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        </div>

        <aside className="space-y-8">
          {/* Racha */}
          <motion.section variants={item}>
            <h2 className="mb-3 font-display text-lg font-extrabold">Racha</h2>
            <Card className="flex items-center gap-4">
              <motion.span
                animate={{ scale: [1, 1.12, 1], rotate: [0, -6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-soft text-gold"
              >
                <FlameIcon width={28} height={28} />
              </motion.span>
              <div>
                <p className="font-display text-3xl font-black">
                  {hydrated ? progress.streak : 0} <span className="text-base font-bold text-muted">{progress.streak === 1 ? "día" : "días"}</span>
                </p>
                <p className="text-xs text-muted">Con una actividad al día cuenta.</p>
              </div>
            </Card>
          </motion.section>

          {/* Palabra del día */}
          <motion.section variants={item}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold">Palabra del día</h2>
              {hydrated && (
                <Link href={`/diccionario/${wotd.t.slug}#${wotd.e.id}`} className="text-xs font-bold text-muted hover:text-ink">
                  Ver más
                </Link>
              )}
            </div>
            <Card className="relative overflow-hidden">
              {hydrated ? (
                <>
                  <span className="absolute -right-3 -top-3 text-7xl opacity-20">{wotd.t.emoji}</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">{wotd.t.title}</p>
                  <p className="mt-1 font-display text-3xl font-black">{wotd.e.en}</p>
                  <p className="text-accent">{wotd.e.es}</p>
                  {wotd.e.plEn && wotd.e.kind === "noun" && (
                    <p className="mt-2 text-sm text-muted">
                      Plural: <b className="text-ink">{wotd.e.plEn}</b> · {wotd.e.plEs}
                    </p>
                  )}
                  <div className="mt-4">
                    <SpeakButtons text={wotd.e.en} size="sm" />
                  </div>
                </>
              ) : (
                <div className="h-36" />
              )}
            </Card>
          </motion.section>
        </aside>
      </div>

      {/* Temas */}
      <motion.section variants={item}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold">Todos los temas</h2>
          <Link href="/diccionario" className="text-xs font-bold text-muted hover:text-ink">
            Ver todos
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-3 sm:-mx-8 sm:px-8">
          {DICTIONARY.map((t) => (
            <motion.div key={t.slug} whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }} className="shrink-0">
              <Link href={`/diccionario/${t.slug}`} className="flex items-center gap-3 rounded-2xl bg-card py-2.5 pl-2.5 pr-5 shadow-soft">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${TOPIC_BG[t.color]}`}>{t.emoji}</span>
                <span>
                  <span className="block text-sm font-bold">{t.title}</span>
                  <span className="block text-xs text-muted">{t.entries.length} palabras</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
