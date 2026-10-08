"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useId, useMemo, useRef, useState, type ReactNode } from "react";
import { searchDictionary } from "@/data/dictionary";
import { updateSettings, useHydrated, useProgress } from "@/lib/store";
import { setTheme, useTheme } from "@/lib/theme";
import {
  BookIcon,
  BriefcaseIcon,
  CardsIcon,
  ChatIcon,
  EarIcon,
  FlameIcon,
  HomeIcon,
  MicIcon,
  MoonIcon,
  SearchIcon,
  SparkIcon,
  SunIcon,
} from "./icons";

const LINKS = [
  { href: "/", label: "Inicio", Icon: HomeIcon },
  { href: "/diccionario", label: "Diccionario", Icon: BookIcon },
  { href: "/especialidades", label: "Especialidades", short: "Oficios", Icon: BriefcaseIcon },
  { href: "/vocabulario", label: "Tarjetas", Icon: CardsIcon },
  { href: "/escuchar", label: "Escuchar", Icon: EarIcon },
  { href: "/hablar", label: "Hablar", Icon: MicIcon },
  { href: "/frases", label: "Frases", Icon: ChatIcon },
  { href: "/gramatica", label: "Gramática", Icon: SparkIcon },
];

/** En el celular, la barra inferior muestra sólo los esenciales */
const MOBILE = ["/", "/diccionario", "/especialidades", "/vocabulario", "/escuchar"];

const spring = { type: "spring", stiffness: 420, damping: 34 } as const;

function useActive() {
  const pathname = usePathname();
  return (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
}

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <motion.span
        whileHover={{ rotate: -12, scale: 1.08 }}
        transition={spring}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-display text-lg font-black text-white"
      >
        S
      </motion.span>
      <span className="font-display text-xl font-extrabold tracking-tight">
        Soltura<span className="text-accent">.</span>
      </span>
    </Link>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={dark ? "Modo claro" : "Modo oscuro"}
      className={`relative flex h-9 w-[4.25rem] shrink-0 items-center rounded-full border border-line bg-card p-1 ${className}`}
    >
      <motion.span
        layout
        transition={spring}
        className={`flex h-7 w-7 items-center justify-center rounded-full ${dark ? "ml-auto bg-accent text-white" : "bg-lime text-on-pastel"}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {dark ? <MoonIcon width={15} height={15} /> : <SunIcon width={15} height={15} />}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  );
}

function AccentSwitch() {
  const { settings } = useProgress();
  // hay dos copias (barra lateral y cabecera móvil): cada una necesita su propio layoutId
  const pillId = useId();
  return (
    <div className="flex rounded-full border border-line bg-card p-0.5 text-xs font-bold" role="group" aria-label="Acento de la voz">
      {(["en-US", "en-GB"] as const).map((a) => (
        <button
          key={a}
          onClick={() => updateSettings({ accent: a })}
          className={`relative rounded-full px-2.5 py-1.5 transition-colors ${settings.accent === a ? "text-white" : "text-muted hover:text-ink"}`}
          aria-pressed={settings.accent === a}
          title={a === "en-US" ? "Acento americano" : "Acento británico"}
        >
          {settings.accent === a && (
            <motion.span layoutId={pillId} className="absolute inset-0 rounded-full bg-hero" transition={spring} />
          )}
          <span className="relative">{a === "en-US" ? "US" : "UK"}</span>
        </button>
      ))}
    </div>
  );
}

function Streak() {
  const progress = useProgress();
  const hydrated = useHydrated();
  return (
    <div
      className="flex items-center gap-1 rounded-full bg-gold-soft px-3 py-1.5 text-sm font-extrabold text-gold"
      title="Días seguidos practicando"
    >
      <FlameIcon width={16} height={16} />
      {hydrated ? progress.streak : 0}
    </div>
  );
}

function Search() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchDictionary(q, 7), [q]);

  const go = (slug: string, id: string) => {
    setOpen(false);
    setQ("");
    inputRef.current?.blur();
    router.push(`/diccionario/${slug}#${id}`);
    // si ya estamos en ese tema, la página escucha este evento para abrir la palabra
    window.setTimeout(() => window.dispatchEvent(new CustomEvent("dict-focus", { detail: id })), 60);
  };

  return (
    <div className="relative w-full max-w-md">
      <label className="flex items-center gap-2.5 rounded-2xl bg-card px-4 py-2.5 text-muted shadow-soft focus-within:ring-2 focus-within:ring-accent/40">
        <SearchIcon width={18} height={18} className="shrink-0" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results[0]) go(results[0].topic.slug, results[0].entry.id);
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder="Busca una palabra: rodilla, knee, oso…"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          aria-label="Buscar en el diccionario"
        />
      </label>
      <AnimatePresence>
        {open && q.trim().length >= 2 && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-card p-1.5 shadow-soft"
          >
            {results.length === 0 && <li className="px-3 py-3 text-sm text-muted">No encontré esa palabra todavía.</li>}
            {results.map(({ topic, entry }) => (
              <li key={entry.id}>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(topic.slug, entry.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-paper"
                >
                  <span className="text-lg">{topic.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{entry.en}</span>
                    <span className="block truncate text-xs text-muted">{entry.es}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted">{topic.title}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function Sidebar() {
  const isActive = useActive();
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line px-5 py-7 lg:flex">
      <div className="px-2">
        <Logo />
      </div>
      <nav className="mt-10 flex flex-col gap-1">
        {LINKS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {active && (
                <>
                  <motion.span layoutId="side-bg" className="absolute inset-0 rounded-xl bg-card shadow-soft" transition={spring} />
                  <motion.span
                    layoutId="side-bar"
                    className="absolute -left-5 top-1.5 bottom-1.5 w-1 rounded-r-full bg-ink"
                    transition={spring}
                  />
                </>
              )}
              <Icon width={18} height={18} className="relative" />
              <span className="relative">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-3 px-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted">Tema</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted">Acento</span>
          <AccentSwitch />
        </div>
      </div>
    </aside>
  );
}

function MobileTabs() {
  const isActive = useActive();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/90 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-lg lg:hidden">
      <div className="mx-auto flex max-w-md justify-between">
        {LINKS.filter((l) => MOBILE.includes(l.href)).map(({ href, label, short, Icon }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href} className="relative flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-bold">
              {active && (
                <motion.span layoutId="tab-bg" className="absolute inset-x-2 inset-y-0 rounded-2xl bg-accent-soft" transition={spring} />
              )}
              <motion.span
                animate={{ y: active ? -1 : 0, scale: active ? 1.1 : 1 }}
                transition={spring}
                className={`relative ${active ? "text-accent" : "text-muted"}`}
              >
                <Icon width={21} height={21} />
              </motion.span>
              <span className={`relative ${active ? "text-accent" : "text-muted"}`}>{short ?? label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const isActive = useActive();
  const extra = LINKS.filter((l) => !MOBILE.includes(l.href));
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative z-30 bg-paper/80 backdrop-blur-lg lg:sticky lg:top-0">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-8 lg:py-5">
            <div className="lg:hidden">
              <Logo />
            </div>
            <div className="hidden flex-1 sm:block">
              <Search />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Streak />
              <div className="lg:hidden">
                <ThemeToggle />
              </div>
              <div className="hidden sm:block lg:hidden">
                <AccentSwitch />
              </div>
            </div>
          </div>
          <div className="px-4 pb-3 sm:hidden">
            <Search />
          </div>
          {/* accesos extra en móvil (los que no caben en la barra inferior) */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
            {extra.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                  isActive(href) ? "border-ink bg-ink text-paper" : "border-line bg-card text-muted"
                }`}
              >
                <Icon width={14} height={14} />
                {label}
              </Link>
            ))}
            <div className="sm:hidden">
              <AccentSwitch />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-32 pt-2 sm:px-8 lg:pb-16">{children}</main>
      </div>
      <MobileTabs />
    </div>
  );
}
