"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SPECIALTIES } from "@/data/specialties";
import { TOPIC_BG } from "@/components/topic-colors";
import { ArrowUpRight } from "@/components/icons";
import { useHydrated, useProgress } from "@/lib/store";

const GOAL = 10; // frases armadas para "dominar" una especialidad

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 24 } },
} as const;

export default function SpecialtiesIndex() {
  const { blocks } = useProgress();
  const hydrated = useHydrated();

  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">Especialidades</p>
        <h1 className="font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
          El inglés <span className="text-accent">de tu trabajo.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted sm:text-lg">
          Vocabulario técnico, frases reales y diálogos de cada profesión. Elige la tuya y practica lo que de verdad vas a
          usar.
        </p>
      </motion.header>

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.06 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {SPECIALTIES.map((s, i) => {
          const done = hydrated ? Math.min(GOAL, blocks[`esp-${s.slug}`] ?? 0) : 0;
          return (
            <motion.div key={s.slug} variants={item}>
              <Link href={`/especialidades/${s.slug}`} className="group block h-full">
                <motion.div
                  whileHover={{ y: -6, rotate: i % 2 ? 0.8 : -0.8 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  className={`relative flex h-full flex-col overflow-hidden rounded-3xl p-5 text-on-pastel ${TOPIC_BG[s.color]}`}
                >
                  <div className="flex items-start justify-between">
                    <motion.span
                      className="block origin-bottom-left text-5xl"
                      whileHover={{ scale: 1.15, rotate: -8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    >
                      {s.emoji}
                    </motion.span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/50 transition-all group-hover:rotate-45 group-hover:bg-white">
                      <ArrowUpRight width={16} height={16} />
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-black leading-tight">{s.title}</h2>
                  <p className="text-sm font-semibold opacity-60">{s.titleEn}</p>
                  <p className="mt-2 line-clamp-2 text-sm opacity-75">{s.blurb}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.groups.map((g) => (
                      <span key={g.title} className="rounded-full bg-white/45 px-2.5 py-1 text-[11px] font-bold">
                        {g.emoji} {g.title}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-5">
                    <div className="flex justify-between text-xs font-bold opacity-70">
                      <span>
                        {s.totalTerms} términos · {s.phrases.length} frases
                      </span>
                      <span>
                        {done}/{GOAL}
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

      <p className="mt-8 text-center text-sm text-muted">Pronto: médico, diseñador, contador y ventas.</p>
    </div>
  );
}
