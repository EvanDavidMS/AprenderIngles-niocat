"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DICTIONARY, TOTAL_WORDS } from "@/data/dictionary";
import { TOPIC_BG } from "@/components/topic-colors";
import { ArrowUpRight } from "@/components/icons";
import { useHydrated, useProgress } from "@/lib/store";

const GOAL = 10; // frases armadas para "dominar" un tema

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 24 } },
} as const;

export default function DictionaryIndex() {
  const { blocks } = useProgress();
  const hydrated = useHydrated();

  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">Diccionario por temas</p>
          <h1 className="font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
            Todas las palabras, <span className="text-accent">por tema.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-muted sm:text-lg">
            Cada tema trae la palabra en inglés y español, cómo se dice en singular y en plural, preguntas reales para
            usarla y un juego para armar frases con bloques.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-2xl bg-card px-5 py-3 shadow-soft">
            <p className="font-display text-3xl font-black">{DICTIONARY.length}</p>
            <p className="text-xs text-muted">temas</p>
          </div>
          <div className="rounded-2xl bg-card px-5 py-3 shadow-soft">
            <p className="font-display text-3xl font-black">{TOTAL_WORDS}</p>
            <p className="text-xs text-muted">palabras</p>
          </div>
        </div>
      </motion.header>

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.045 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {DICTIONARY.map((t, i) => {
          const done = hydrated ? Math.min(GOAL, blocks[t.slug] ?? 0) : 0;
          return (
            <motion.div key={t.slug} variants={item}>
              <Link href={`/diccionario/${t.slug}`} className="group block h-full">
                <motion.div
                  whileHover={{ y: -6, rotate: i % 2 ? 0.8 : -0.8 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  className={`relative flex h-full flex-col overflow-hidden rounded-3xl p-5 text-on-pastel ${TOPIC_BG[t.color]}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-display text-sm font-extrabold opacity-60">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/50 transition-all group-hover:rotate-45 group-hover:bg-white">
                      <ArrowUpRight width={16} height={16} />
                    </span>
                  </div>
                  <motion.span
                    className="mt-3 block origin-bottom-left text-5xl"
                    whileHover={{ scale: 1.15, rotate: -8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 12 }}
                  >
                    {t.emoji}
                  </motion.span>
                  <h2 className="mt-3 font-display text-xl font-black leading-tight">{t.title}</h2>
                  <p className="text-sm font-semibold opacity-60">{t.titleEn}</p>
                  <p className="mt-2 line-clamp-2 text-sm opacity-75">{t.blurb}</p>
                  <div className="mt-auto pt-5">
                    <div className="flex justify-between text-xs font-bold opacity-70">
                      <span>{t.entries.length} palabras</span>
                      <span>
                        {done}/{GOAL} frases
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-on-pastel/15">
                      <motion.div
                        className="h-full rounded-full bg-on-pastel"
                        initial={{ width: 0 }}
                        animate={{ width: `${(done / GOAL) * 100}%` }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
