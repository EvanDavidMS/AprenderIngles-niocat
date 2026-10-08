/* Reglas de singular / plural para inglés y español.
   Cubren los casos regulares; las excepciones se escriben a mano en el diccionario. */

const VOWELS = "aeiou";

/** a / an según el sonido inicial */
export function indefiniteEn(word: string) {
  const w = word.toLowerCase();
  if (/^(hour|honest|honou?r|heir)/.test(w)) return "an";
  if (/^(uni|use|usu|eu|one|ewe|u[bcfhjkqrstn][aeiou])/.test(w) && !/^(umbrella|uncle|under|ugly|up)/.test(w)) return "a";
  return VOWELS.includes(w[0]) ? "an" : "a";
}

/** Plural regular en inglés (pluraliza la última palabra) */
export function pluralEn(phrase: string) {
  const parts = phrase.split(" ");
  const w = parts.pop()!;
  let p: string;
  if (/(s|x|z|ch|sh)$/.test(w)) p = w + "es";
  else if (/[^aeiou]y$/.test(w)) p = w.slice(0, -1) + "ies";
  else p = w + "s";
  return [...parts, p].join(" ");
}

/** Tercera persona (he/she/it) de un verbo inglés */
export function thirdPersonEn(verb: string) {
  const [head, ...rest] = verb.split(" ");
  let h: string;
  if (head === "have") h = "has";
  else if (head === "be") h = "is";
  else if (head === "do" || head === "go") h = head + "es";
  else h = pluralEn(head);
  return [h, ...rest].join(" ");
}

const STRIP: Record<string, string> = { á: "a", é: "e", í: "i", ó: "o", ú: "u" };

function pluralEsWord(w: string) {
  const last = w.slice(-1);
  if (/[aeiouáéó]$/.test(w)) return w + "s";
  if (/[íú]$/.test(w)) return w + "es";
  if (last === "z") return w.slice(0, -1) + "ces";
  // agudas con tilde: camión → camiones, autobús → autobuses
  const m = w.match(/([áéíóú])([nsl])$/);
  if (m) return w.slice(0, -2) + STRIP[m[1]] + m[2] + "es";
  if (/[sx]$/.test(w)) {
    // monosílabas (mes, gas) → meses; llanas (lunes, paraguas) no cambian
    const vowelGroups = w.match(/[aeiouáéíóú]+/g) ?? [];
    return vowelGroups.length <= 1 ? w + "es" : w;
  }
  return w + "es";
}

/** "el brazo" → "los brazos" (pluraliza artículo y sustantivo principal) */
export function pluralEs(phrase: string): string {
  if (phrase.includes(" / ")) return phrase.split(" / ").map(pluralEs).join(" / ");
  const parts = phrase.split(" ");
  const art = parts[0];
  const hasArticle = art === "el" || art === "la";
  const words = hasArticle ? parts.slice(1) : parts;
  words[0] = pluralEsWord(words[0]);
  const plArt = art === "el" ? "los" : "las";
  return hasArticle ? [plArt, ...words].join(" ") : words.join(" ");
}

/** Plural de adjetivo en español: feliz → felices, triste → tristes */
export const pluralEsAdj = (w: string) => w.split(" / ").map(pluralEsWord).join(" / ");

/** el → un, la → una, los → unos, las → unas */
export function indefiniteEs(phrase: string): string {
  if (phrase.includes(" / ")) return phrase.split(" / ").map(indefiniteEs).join(" / ");
  return phrase
    .replace(/^el /, "un ")
    .replace(/^la /, "una ")
    .replace(/^los /, "unos ")
    .replace(/^las /, "unas ");
}

/** Quita el artículo: "el brazo" → "brazo" */
export const bareEs = (phrase: string) => phrase.replace(/(^|\/ )(el|la|los|las) /g, "$1");

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
