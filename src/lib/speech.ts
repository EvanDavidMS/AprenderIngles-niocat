"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Accent } from "./store";

/* ---------- Síntesis de voz (el navegador "habla") ---------- */

function pickVoice(lang: Accent): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  const exact = voices.filter((v) => v.lang.replace("_", "-") === lang);
  const pool = exact.length ? exact : voices.filter((v) => v.lang.startsWith("en"));
  // Las voces "Natural"/"Online"/"Google" suenan mucho más humanas
  return (
    pool.find((v) => /natural|online/i.test(v.name)) ??
    pool.find((v) => /google/i.test(v.name)) ??
    pool[0]
  );
}

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(
  text: string,
  opts: { lang: Accent; rate: number; onEnd?: () => void },
) {
  if (!canSpeak()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = opts.lang;
  u.rate = opts.rate;
  const voice = pickVoice(opts.lang);
  if (voice) u.voice = voice;
  u.onend = () => opts.onEnd?.();
  u.onerror = () => opts.onEnd?.();
  synth.speak(u);
}

/** Algunos navegadores cargan las voces de forma asíncrona */
export function useVoicesReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!canSpeak()) return;
    const check = () => setReady(window.speechSynthesis.getVoices().length > 0);
    check();
    window.speechSynthesis.addEventListener("voiceschanged", check);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", check);
  }, []);
  return ready;
}

/* ---------- Reconocimiento de voz (el navegador "escucha") ---------- */

type RecognitionResultEvent = {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
};

type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: RecognitionResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type RecognitionCtor = new () => Recognition;

function getRecognitionCtor(): RecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

const ERRORS: Record<string, string> = {
  "not-allowed": "No diste permiso al micrófono. Actívalo en el candado de la barra de direcciones.",
  "no-speech": "No escuché nada. Acércate al micrófono e intenta otra vez.",
  "audio-capture": "No encontré un micrófono conectado.",
  network: "El reconocimiento de voz necesita internet.",
};

export function useSpeechRecognition(lang: Accent) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<Recognition | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- detección de API del navegador tras montar
    setSupported(!!getRecognitionCtor());
    return () => recRef.current?.abort();
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    recRef.current?.abort();
    window.speechSynthesis?.cancel();
    const rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    let finalText = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      setTranscript((finalText + interim).trim());
    };
    rec.onerror = (e) => {
      if (e.error !== "aborted") setError(ERRORS[e.error] ?? `Error: ${e.error}`);
    };
    rec.onend = () => setListening(false);
    setTranscript("");
    setError(null);
    setListening(true);
    recRef.current = rec;
    rec.start();
  }, [lang]);

  const stop = useCallback(() => recRef.current?.stop(), []);
  const reset = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  return { supported, listening, transcript, error, start, stop, reset };
}
