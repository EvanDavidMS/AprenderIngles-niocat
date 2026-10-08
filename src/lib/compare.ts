const CONTRACTIONS: Record<string, string> = {
  "i'm": "i am",
  "you're": "you are",
  "we're": "we are",
  "they're": "they are",
  "he's": "he is",
  "she's": "she is",
  "it's": "it is",
  "that's": "that is",
  "what's": "what is",
  "there's": "there is",
  "how's": "how is",
  "where's": "where is",
  "who's": "who is",
  "i've": "i have",
  "you've": "you have",
  "we've": "we have",
  "they've": "they have",
  "i'll": "i will",
  "you'll": "you will",
  "we'll": "we will",
  "they'll": "they will",
  "he'll": "he will",
  "she'll": "she will",
  "it'll": "it will",
  "i'd": "i would",
  "you'd": "you would",
  "we'd": "we would",
  "they'd": "they would",
  "he'd": "he would",
  "she'd": "she would",
  "don't": "do not",
  "doesn't": "does not",
  "didn't": "did not",
  "isn't": "is not",
  "aren't": "are not",
  "wasn't": "was not",
  "weren't": "were not",
  "can't": "can not",
  "cannot": "can not",
  "couldn't": "could not",
  "shouldn't": "should not",
  "wouldn't": "would not",
  "won't": "will not",
  "haven't": "have not",
  "hasn't": "has not",
  "hadn't": "had not",
  "let's": "let us",
  "gonna": "going to",
  "wanna": "want to",
  "gotta": "got to",
  "ok": "okay",
};

// Contracciones escritas sin apóstrofo que no se confunden con otra palabra
// (se excluyen its, were, well, ill, id, hed, shed, wed, lets…)
for (const c of Object.keys(CONTRACTIONS)) {
  const bare = c.replace("'", "");
  if (bare !== c && !["its", "were", "well", "ill", "id", "hed", "shed", "wed", "lets", "whos", "hes", "wont"].includes(bare)) {
    CONTRACTIONS[bare] = CONTRACTIONS[c];
  }
}

export function tokenize(text: string): string[] {
  const cleaned = text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[^a-z0-9'\s-]/g, " ")
    .replace(/-/g, " ");
  return cleaned
    .split(/\s+/)
    .map((w) => w.replace(/^'+|'+$/g, ""))
    .filter(Boolean)
    .flatMap((w) => (CONTRACTIONS[w] ?? w).split(" "));
}

export type DiffPart = { word: string; kind: "ok" | "missing" | "extra" };

/** Diferencia palabra por palabra (LCS) entre lo esperado y lo que escribió/dijo la persona */
export function diffWords(expected: string, actual: string) {
  const a = tokenize(expected);
  const b = tokenize(actual);
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const parts: DiffPart[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      parts.push({ word: a[i], kind: "ok" });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      parts.push({ word: a[i++], kind: "missing" });
    } else {
      parts.push({ word: b[j++], kind: "extra" });
    }
  }
  while (i < a.length) parts.push({ word: a[i++], kind: "missing" });
  while (j < b.length) parts.push({ word: b[j++], kind: "extra" });

  const score = a.length ? Math.round((dp[0][0] / Math.max(a.length, b.length)) * 100) : 0;
  return { parts, score };
}
