"use client";

import { useSyncExternalStore } from "react";

export type Rating = "again" | "hard" | "good" | "easy";

export type CardState = {
  ease: number;
  interval: number; // días
  due: number; // timestamp
  reps: number;
  lapses: number;
};

export type Accent = "en-US" | "en-GB";

export type Settings = {
  accent: Accent;
  rate: number;
};

export type Activity = "cards" | "dictations" | "speaking" | "quizzes" | "blocks";

export type Progress = {
  xp: number;
  streak: number;
  lastDay: string | null;
  today: { day: string; xp: number } & Record<Activity, number>;
  cards: Record<string, CardState>;
  grammar: Record<string, number>; // mejor puntaje (0-100)
  blocks: Record<string, number>; // frases armadas bien por tema del diccionario
  settings: Settings;
};

export const DAILY_GOAL = 60;
const KEY = "soltura-progress-v1";
const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

export const dayKey = (d = new Date()) => d.toLocaleDateString("en-CA");

const emptyToday = (day: string) => ({
  day,
  xp: 0,
  cards: 0,
  dictations: 0,
  speaking: 0,
  quizzes: 0,
  blocks: 0,
});

const DEFAULT: Progress = {
  xp: 0,
  streak: 0,
  lastDay: null,
  today: emptyToday(""),
  cards: {},
  grammar: {},
  blocks: {},
  settings: { accent: "en-US", rate: 0.9 },
};

let state: Progress = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Progress>;
      state = {
        ...DEFAULT,
        ...parsed,
        today: { ...emptyToday(""), ...parsed.today },
        blocks: parsed.blocks ?? {},
        settings: { ...DEFAULT.settings, ...parsed.settings },
      };
    }
  } catch {
    // almacenamiento no disponible: trabajamos en memoria
  }
  if (state.today.day !== dayKey()) {
    state = { ...state, today: emptyToday(dayKey()) };
  }
}

function set(updater: (s: Progress) => Progress) {
  load();
  state = updater(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignorar
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  load();
  return state;
}

const getServerSnapshot = () => DEFAULT;

export function useProgress() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** true sólo después de hidratar: evita mostrar datos vacíos como si fueran reales */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

let nowValue = 0;

/** Hora actual (se refresca cada 30 s). Vale 0 en el servidor y durante la hidratación. */
export function useNow() {
  return useSyncExternalStore(
    (cb) => {
      const t = setInterval(() => {
        nowValue = Date.now();
        cb();
      }, 30_000);
      return () => clearInterval(t);
    },
    () => {
      if (!nowValue) nowValue = Date.now();
      return nowValue;
    },
    () => 0,
  );
}

function withActivity(s: Progress, xp: number, activity: Activity): Progress {
  const today = dayKey();
  let { streak } = s;
  if (s.lastDay !== today) {
    const yesterday = dayKey(new Date(Date.now() - DAY));
    streak = s.lastDay === yesterday ? streak + 1 : 1;
  }
  const t = s.today.day === today ? s.today : emptyToday(today);
  return {
    ...s,
    xp: s.xp + xp,
    streak,
    lastDay: today,
    today: { ...t, xp: t.xp + xp, [activity]: t[activity] + 1 },
  };
}

export function earn(xp: number, activity: Activity) {
  set((s) => withActivity(s, xp, activity));
}

export function reviewCard(id: string, rating: Rating) {
  set((s) => {
    const prev = s.cards[id] ?? { ease: 2.5, interval: 0, due: 0, reps: 0, lapses: 0 };
    const now = Date.now();
    let { ease, interval, reps, lapses } = prev;
    let due: number;

    if (rating === "again") {
      lapses += 1;
      reps = 0;
      interval = 0;
      ease = Math.max(1.3, ease - 0.2);
      due = now + MINUTE;
    } else {
      reps += 1;
      if (rating === "hard") {
        ease = Math.max(1.3, ease - 0.15);
        interval = reps === 1 ? 0.5 : Math.max(1, interval * 1.2);
      } else if (rating === "good") {
        interval = reps === 1 ? 1 : reps === 2 ? 3 : interval * ease;
      } else {
        ease += 0.15;
        interval = reps === 1 ? 4 : interval * ease * 1.3;
      }
      due = now + interval * DAY;
    }

    const xp = rating === "again" ? 2 : 5;
    return withActivity(
      { ...s, cards: { ...s.cards, [id]: { ease, interval, due, reps, lapses } } },
      xp,
      "cards",
    );
  });
}

export function saveGrammarScore(slug: string, score: number) {
  set((s) => {
    const best = Math.max(s.grammar[slug] ?? 0, score);
    return withActivity({ ...s, grammar: { ...s.grammar, [slug]: best } }, Math.round(score / 5), "quizzes");
  });
}

export function saveBlock(topic: string) {
  set((s) => withActivity({ ...s, blocks: { ...s.blocks, [topic]: (s.blocks[topic] ?? 0) + 1 } }, 5, "blocks"));
}

export function updateSettings(patch: Partial<Settings>) {
  set((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
}

export function resetProgress() {
  set(() => ({ ...DEFAULT, today: emptyToday(dayKey()) }));
}
