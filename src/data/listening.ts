export type Dictation = {
  id: string;
  level: 1 | 2 | 3;
  text: string;
  es: string;
  /** Cómo suena realmente en boca de un nativo */
  sounds?: string;
  tip: string;
};

type Row = [text: string, es: string, sounds: string | undefined, tip: string];

const LEVELS: Record<1 | 2 | 3, Row[]> = {
  1: [
    ["What do you want to do this weekend?", "¿Qué quieres hacer este fin de semana?", "Whaddaya wanna do this weekend?", "\"What do you\" se funde en \"whaddaya\" y \"want to\" en \"wanna\"."],
    ["I'm going to grab something to eat.", "Voy a comer algo rápido.", "I'm gonna grab somethin' to eat.", "\"Going to\" casi siempre suena \"gonna\". La -g final de -ing desaparece."],
    ["Can I get a large coffee, please?", "¿Me da un café grande, por favor?", "C'n I get a large coffee, please?", "\"Can\" sin acento suena \"c'n\". Si suena fuerte (\"CAN\") suele ser negativo (can't) o enfático."],
    ["Where are you from?", "¿De dónde eres?", "Where're ya from?", "\"You\" en posición débil suena \"ya\"."],
    ["I don't know what you mean.", "No sé a qué te refieres.", "I dunno whatcha mean.", "\"Don't know\" → \"dunno\"; \"what you\" → \"whatcha\"."],
    ["Let me think about it.", "Déjame pensarlo.", "Lemme think about it.", "\"Let me\" → \"lemme\". La t se pierde."],
    ["I have to go to work early tomorrow.", "Tengo que ir a trabajar temprano mañana.", "I hafta go ta work early tomorrow.", "\"Have to\" → \"hafta\"; \"to\" suena \"ta\"."],
    ["Did you see that?", "¿Viste eso?", "Didja see that?", "\"Did you\" → \"didja\": la d + y suena como \"y\" de \"yo\" (sonido dj)."],
    ["What are you doing?", "¿Qué estás haciendo?", "Whatcha doin'?", "\"What are you\" se comprime muchísimo: \"whatcha\"."],
    ["It's kind of cold today.", "Hace como frío hoy.", "It's kinda cold today.", "\"Kind of\" → \"kinda\". Igual \"sort of\" → \"sorta\"."],
  ],
  2: [
    ["I should have called you yesterday.", "Debí haberte llamado ayer.", "I shoulda called ya yesterday.", "\"Should have\" → \"shoulda\" (igual \"could have\" → \"coulda\")."],
    ["Do you want me to pick you up at the airport?", "¿Quieres que pase por ti al aeropuerto?", "D'ya want me ta pick ya up at the airport?", "\"Pick you up\" se encadena: \"pi-kya-up\"."],
    ["We've been waiting for almost an hour.", "Llevamos esperando casi una hora.", "We've been waitin' fer almost an hour.", "Las palabras de función (for, to, of) se reducen a una vocal neutra \"schwa\"."],
    ["I didn't get it, could you say that again?", "No le entendí, ¿lo puedes repetir?", "I didn' get it, couldja say that again?", "\"Could you\" → \"couldja\". La t de \"didn't\" casi no se oye."],
    ["She told me she was going to be late.", "Me dijo que iba a llegar tarde.", "She told me she was gonna be late.", "En estilo indirecto \"is going to\" pasa a \"was going to\"."],
    ["I'm not sure, but I think it's on the second floor.", "No estoy seguro, pero creo que está en el segundo piso.", undefined, "\"Think it's on\" se encadena: \"thin-ki-tson\". La consonante final se pega a la vocal siguiente."],
    ["Give me a second, I'll be right back.", "Dame un segundo, ahorita regreso.", "Gimme a sec, I'll be right back.", "\"Give me\" → \"gimme\"; \"second\" muchas veces se acorta a \"sec\"."],
    ["Have you ever been to New York?", "¿Alguna vez has ido a Nueva York?", "Have ya ever been ta New York?", "\"Been\" en inglés americano suena casi como \"bin\"."],
    ["It's not a big deal, don't worry about it.", "No es para tanto, no te preocupes.", "It's not a big deal, don' worry 'bout it.", "\"About\" pierde la a inicial: \"'bout\"."],
    ["I've got to finish this report by Friday.", "Tengo que terminar este reporte para el viernes.", "I gotta finish this report by Friday.", "\"Have got to\" → \"gotta\". Muy común en conversación."],
  ],
  3: [
    ["If I had known you were coming, I would have cooked something.", "Si hubiera sabido que venías, habría cocinado algo.", "If I'd known you were comin', I woulda cooked somethin'.", "Tercer condicional: \"had known\" → \"I'd known\", \"would have\" → \"woulda\"."],
    ["I've been meaning to tell you, but I kept forgetting.", "Te lo quería decir, pero se me seguía olvidando.", undefined, "\"I've been meaning to\" = llevo tiempo queriendo… Muy natural en conversación."],
    ["He's supposed to be here by now, what's taking him so long?", "Ya debería estar aquí, ¿por qué tarda tanto?", "He's s'posta be here by now, what's takin' 'im so long?", "\"Supposed to\" → \"s'posta\"; \"him\" pierde la h: \"'im\"."],
    ["You might want to check the schedule before you leave.", "Quizá te convenga revisar el horario antes de salir.", "You might wanna check the schedule before ya leave.", "\"You might want to\" es una forma amable de dar un consejo."],
    ["I'd rather stay home tonight, I'm exhausted.", "Prefiero quedarme en casa hoy, estoy agotado.", undefined, "\"I'd rather\" = preferiría. La d de \"I'd\" casi no se escucha: pon atención al contexto."],
    ["We ended up staying at a hotel near the beach.", "Terminamos quedándonos en un hotel cerca de la playa.", "We ende-dup stayin' at a hotel near the beach.", "\"Ended up\" se encadena: la d se pega a la u."],
    ["Could you let me know as soon as you hear back from them?", "¿Me avisas en cuanto te respondan?", "Couldja lemme know as soon as ya hear back from 'em?", "\"Them\" → \"'em\". \"Hear back from\" = recibir respuesta."],
    ["I'm used to working late, so it doesn't bother me.", "Estoy acostumbrado a trabajar tarde, así que no me molesta.", undefined, "\"Used to\" suena \"yusta\" — fíjate en el contexto: \"be used to + -ing\" = estar acostumbrado."],
    ["There's no way we're going to make it on time.", "Es imposible que lleguemos a tiempo.", "There's no way we're gonna make it on time.", "\"Make it\" = lograrlo / llegar. Se encadena: \"may-kit\"."],
    ["What would you do if you were in my shoes?", "¿Qué harías tú en mi lugar?", "Whadja do if ya were in my shoes?", "\"What would you\" → \"whadja\" / \"whudja\". \"In my shoes\" = en mi lugar."],
  ],
};

export const DICTATIONS: Dictation[] = ([1, 2, 3] as const).flatMap((level) =>
  LEVELS[level].map(([text, es, sounds, tip], i) => ({
    id: `d${level}-${i}`,
    level,
    text,
    es,
    sounds,
    tip,
  })),
);

export const REDUCTIONS: { short: string; full: string; example: string }[] = [
  { short: "gonna", full: "going to", example: "I'm gonna call you later." },
  { short: "wanna", full: "want to", example: "Do you wanna come with us?" },
  { short: "gotta", full: "have got to", example: "I gotta go, see you!" },
  { short: "hafta", full: "have to", example: "I hafta work tomorrow." },
  { short: "lemme", full: "let me", example: "Lemme see that." },
  { short: "gimme", full: "give me", example: "Gimme a minute." },
  { short: "dunno", full: "don't know", example: "I dunno where he is." },
  { short: "kinda / sorta", full: "kind of / sort of", example: "It's kinda weird." },
  { short: "whatcha", full: "what are you / what do you", example: "Whatcha doing tonight?" },
  { short: "didja", full: "did you", example: "Didja see the game?" },
  { short: "couldja / wouldja", full: "could you / would you", example: "Couldja pass me the salt?" },
  { short: "shoulda / coulda / woulda", full: "should have / could have / would have", example: "You shoulda told me!" },
  { short: "outta", full: "out of", example: "Get outta here!" },
  { short: "lotta", full: "a lot of", example: "That's a lotta money." },
  { short: "'em", full: "them", example: "Tell 'em I said hi." },
  { short: "ya", full: "you", example: "See ya tomorrow!" },
  { short: "y'all", full: "you all (sur de EE. UU.)", example: "Are y'all ready?" },
  { short: "ain't", full: "am not / isn't / haven't (informal)", example: "It ain't over yet." },
];
