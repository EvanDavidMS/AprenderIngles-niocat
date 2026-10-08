"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui";
import { ArrowRight } from "@/components/icons";
import { GRAMMAR } from "@/data/grammar";
import { useHydrated, useProgress } from "@/lib/store";

export default function GrammarIndex() {
  const { grammar } = useProgress();
  const hydrated = useHydrated();

  return (
    <div>
      <PageHeader eyebrow="Gramática" title="Las reglas, pero prácticas">
        Explicaciones cortas en español, los errores típicos de quienes hablamos español y un quiz rápido para
        comprobar que sí quedó.
      </PageHeader>

      <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.04 }} className="grid gap-3 sm:grid-cols-2">
        {GRAMMAR.map((g, i) => {
          const best = hydrated ? grammar[g.slug] : undefined;
          return (
            <motion.div key={g.slug} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
              <Link
                href={`/gramatica/${g.slug}`}
                className="group flex h-full items-center gap-4 rounded-3xl border border-line bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-ink"
              >
                <span className="font-display text-3xl font-semibold text-line transition-colors group-hover:text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-snug">{g.title}</p>
                  <p className="text-sm text-muted">{g.subtitle}</p>
                  {best !== undefined && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-line">
                        <div
                          className={`h-full rounded-full ${best >= 80 ? "bg-green" : best >= 50 ? "bg-gold" : "bg-accent"}`}
                          style={{ width: `${best}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted">mejor: {best}%</span>
                    </div>
                  )}
                </div>
                <ArrowRight className="shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-ink" />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
