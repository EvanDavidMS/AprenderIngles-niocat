export type Question = {
  q: string;
  options: string[];
  answer: number;
  why: string;
};

export type GrammarTopic = {
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  rules: { title: string; text: string; examples: [string, string][] }[];
  mistakes: { wrong: string; right: string; why: string }[];
  quiz: Question[];
};

export const GRAMMAR: GrammarTopic[] = [
  {
    slug: "present-perfect",
    title: "Present Perfect vs Past Simple",
    subtitle: "I have done vs I did",
    intro:
      "El error número uno de los hispanohablantes. La clave: ¿el momento en el pasado está terminado y es específico (ayer, en 2020)? → Past Simple. ¿Conecta el pasado con el presente o no importa cuándo? → Present Perfect.",
    rules: [
      {
        title: "Past Simple: momento terminado y específico",
        text: "Se usa con yesterday, last week, in 2019, ago, when I was a kid… Si dices CUÁNDO, casi siempre es Past Simple.",
        examples: [
          ["I saw that movie last week.", "Vi esa película la semana pasada."],
          ["She moved to Canada two years ago.", "Se mudó a Canadá hace dos años."],
        ],
      },
      {
        title: "Present Perfect: experiencia (sin decir cuándo)",
        text: "have/has + participio. Para experiencias de vida: ever, never, before, already, yet.",
        examples: [
          ["Have you ever been to Mexico City?", "¿Alguna vez has ido a la CDMX?"],
          ["I've never tried sushi.", "Nunca he probado el sushi."],
        ],
      },
      {
        title: "Present Perfect: algo que empezó y sigue (for / since)",
        text: "Español: 'llevo 5 años viviendo aquí' / 'vivo aquí desde 2020'. En inglés NO se usa presente: se usa Present Perfect. For = duración, since = punto de inicio.",
        examples: [
          ["I've lived here for five years.", "Llevo cinco años viviendo aquí."],
          ["We've known each other since 2015.", "Nos conocemos desde 2015."],
        ],
      },
    ],
    mistakes: [
      { wrong: "I live here since 2020.", right: "I've lived here since 2020.", why: "Con since/for para algo que sigue, usa Present Perfect." },
      { wrong: "I have seen him yesterday.", right: "I saw him yesterday.", why: "'Yesterday' es un momento terminado → Past Simple." },
      { wrong: "I have 25 years.", right: "I'm 25 (years old).", why: "La edad se dice con 'to be', no con 'have'." },
    ],
    quiz: [
      { q: "I ___ to London three times.", options: ["went", "have been", "am going", "was"], answer: 1, why: "Es experiencia de vida sin momento específico → Present Perfect." },
      { q: "She ___ her phone yesterday.", options: ["has lost", "lost", "have lost", "loses"], answer: 1, why: "'Yesterday' pide Past Simple." },
      { q: "We ___ each other for ten years.", options: ["know", "knew", "have known", "are knowing"], answer: 2, why: "Algo que empezó y continúa + for → Present Perfect." },
      { q: "___ you finished your homework yet?", options: ["Did", "Have", "Are", "Do"], answer: 1, why: "'Yet' va con Present Perfect: Have you … yet?" },
      { q: "When ___ you start working here?", options: ["have", "did", "has", "do"], answer: 1, why: "Preguntas con 'when' piden un momento específico → Past Simple." },
    ],
  },
  {
    slug: "used-to",
    title: "Used to / Be used to / Get used to",
    subtitle: "Solía · estar acostumbrado · acostumbrarse",
    intro: "Tres estructuras que se parecen muchísimo pero significan cosas distintas. Fíjate en lo que viene después: verbo base o -ing.",
    rules: [
      {
        title: "used to + verbo base = solía",
        text: "Hábitos o estados del pasado que ya no ocurren.",
        examples: [
          ["I used to play soccer every day.", "Solía jugar fútbol todos los días."],
          ["Did you use to live here?", "¿Vivías aquí antes?"],
        ],
      },
      {
        title: "be used to + -ing / sustantivo = estar acostumbrado",
        text: "Algo que ya es normal para ti.",
        examples: [
          ["I'm used to waking up early.", "Estoy acostumbrado a levantarme temprano."],
          ["She isn't used to the cold.", "No está acostumbrada al frío."],
        ],
      },
      {
        title: "get used to + -ing / sustantivo = acostumbrarse",
        text: "El proceso de volverse normal.",
        examples: [
          ["You'll get used to driving on the left.", "Te vas a acostumbrar a manejar por la izquierda."],
          ["I can't get used to this weather.", "No me acostumbro a este clima."],
        ],
      },
    ],
    mistakes: [
      { wrong: "I'm used to wake up early.", right: "I'm used to waking up early.", why: "Después de 'be used to' va -ing ('to' es preposición)." },
      { wrong: "I use to go to the gym.", right: "I usually go to the gym.", why: "Para hábitos del presente se usa 'usually', no 'use to'." },
    ],
    quiz: [
      { q: "When I was a kid, I ___ climb trees.", options: ["was used to", "used to", "got used to", "use to"], answer: 1, why: "Hábito del pasado → used to + verbo base." },
      { q: "I'm not used to ___ in English.", options: ["speak", "speaking", "spoke", "speaks"], answer: 1, why: "be used to + -ing." },
      { q: "It took me a month to ___ the new schedule.", options: ["used to", "get used to", "be use to", "use"], answer: 1, why: "Proceso de acostumbrarse → get used to." },
      { q: "Did you ___ have long hair?", options: ["used to", "use to", "using to", "be used to"], answer: 1, why: "En preguntas y negativas con 'did' se escribe 'use to'." },
      { q: "She's a nurse, so she ___ working at night.", options: ["used to", "is used to", "uses to", "use to"], answer: 1, why: "Ya es normal para ella → is used to + -ing." },
    ],
  },
  {
    slug: "conditionals",
    title: "Condicionales",
    subtitle: "If… zero, first, second, third",
    intro: "Los condicionales expresan qué tan real es una situación. Aprende la estructura como un bloque y úsala en voz alta.",
    rules: [
      {
        title: "Zero: verdades generales",
        text: "If + presente, presente.",
        examples: [["If you heat ice, it melts.", "Si calientas el hielo, se derrite."]],
      },
      {
        title: "First: posible en el futuro",
        text: "If + presente, will + verbo. ¡Nunca 'will' después de 'if'!",
        examples: [["If it rains, I'll stay home.", "Si llueve, me quedo en casa."]],
      },
      {
        title: "Second: hipotético / irreal en el presente",
        text: "If + pasado, would + verbo. Con 'to be' se puede usar 'were' para todas las personas.",
        examples: [
          ["If I had more time, I would learn French.", "Si tuviera más tiempo, aprendería francés."],
          ["If I were you, I'd take the job.", "Yo que tú, aceptaría el trabajo."],
        ],
      },
      {
        title: "Third: pasado que no pasó",
        text: "If + had + participio, would have + participio. Para arrepentimientos.",
        examples: [["If I had studied, I would have passed.", "Si hubiera estudiado, habría pasado."]],
      },
    ],
    mistakes: [
      { wrong: "If it will rain, I'll stay home.", right: "If it rains, I'll stay home.", why: "Después de 'if' usa presente, no 'will'." },
      { wrong: "If I would have money, I would travel.", right: "If I had money, I would travel.", why: "En la parte del 'if' va pasado, no 'would'." },
    ],
    quiz: [
      { q: "If I ___ rich, I would buy a boat.", options: ["am", "were", "will be", "would be"], answer: 1, why: "Segundo condicional: if + pasado ('were')." },
      { q: "If you ___ late again, the boss will be angry.", options: ["are", "will be", "were", "would be"], answer: 0, why: "Primer condicional: if + presente." },
      { q: "If she had called me, I ___ her.", options: ["would help", "will help", "would have helped", "helped"], answer: 2, why: "Tercer condicional: would have + participio." },
      { q: "If you mix red and blue, you ___ purple.", options: ["get", "will get", "would get", "got"], answer: 0, why: "Verdad general → zero conditional." },
      { q: "What would you do if you ___ the lottery?", options: ["win", "won", "will win", "had won"], answer: 1, why: "Situación hipotética → if + pasado." },
    ],
  },
  {
    slug: "future",
    title: "Will / Going to / Presente continuo",
    subtitle: "Tres formas de hablar del futuro",
    intro: "En español casi siempre decimos 'voy a…'. En inglés la elección depende de si ya lo decidiste, si lo decides ahora o si ya está agendado.",
    rules: [
      {
        title: "Will: decisiones del momento, promesas, predicciones",
        text: "Cuando decides en ese instante u ofreces ayuda.",
        examples: [
          ["I'm cold. — I'll close the window.", "Tengo frío. — Cierro la ventana."],
          ["I'll call you tomorrow, I promise.", "Te llamo mañana, lo prometo."],
        ],
      },
      {
        title: "Going to: planes ya decididos y evidencias",
        text: "Ya lo tenías pensado, o ves pruebas de que va a pasar.",
        examples: [
          ["I'm going to start a new course.", "Voy a empezar un curso nuevo."],
          ["Look at those clouds, it's going to rain.", "Mira esas nubes, va a llover."],
        ],
      },
      {
        title: "Presente continuo: planes agendados",
        text: "Citas, reuniones, cosas con hora y lugar.",
        examples: [["I'm meeting Ana at 7 tonight.", "Hoy veo a Ana a las 7."]],
      },
    ],
    mistakes: [
      { wrong: "Will you come to the party? — Yes, I come.", right: "Yes, I'll come.", why: "Para responder una decisión futura usa 'will' (o going to)." },
    ],
    quiz: [
      { q: "The phone is ringing. — I ___ get it!", options: ["'m going to", "'ll", "'m getting", "get"], answer: 1, why: "Decisión en el momento → will." },
      { q: "We ___ to Cancun next month, we already bought the tickets.", options: ["will go", "are going", "go", "would go"], answer: 1, why: "Plan agendado → presente continuo (o going to)." },
      { q: "Be careful! You ___ fall!", options: ["will", "are going to", "are falling", "fall"], answer: 1, why: "Evidencia presente → going to." },
      { q: "I think AI ___ change everything.", options: ["is changing", "will", "will change", "changes"], answer: 2, why: "Predicción/opinión con 'I think' → will." },
    ],
  },
  {
    slug: "gerund-infinitive",
    title: "Gerundio vs Infinitivo",
    subtitle: "enjoy doing · want to do",
    intro: "Algunos verbos van seguidos de -ing y otros de 'to + verbo'. No hay una regla perfecta: hay que memorizar los más comunes en bloques.",
    rules: [
      {
        title: "Verbos + -ing",
        text: "enjoy, mind, avoid, finish, suggest, keep, consider, can't stand, look forward to, be used to.",
        examples: [
          ["I enjoy cooking.", "Disfruto cocinar."],
          ["Do you mind waiting?", "¿Te molesta esperar?"],
        ],
      },
      {
        title: "Verbos + to + verbo",
        text: "want, need, decide, hope, plan, promise, agree, refuse, seem, would like, manage.",
        examples: [
          ["I decided to quit.", "Decidí renunciar."],
          ["She seems to be happy.", "Parece estar feliz."],
        ],
      },
      {
        title: "Después de preposición → siempre -ing",
        text: "about, of, for, without, before, after, at, in + -ing.",
        examples: [["I'm good at drawing.", "Soy bueno para dibujar."], ["Think before speaking.", "Piensa antes de hablar."]],
      },
      {
        title: "Cambian de significado: stop / remember / try",
        text: "stop smoking = dejar de fumar; stop to smoke = detenerse para fumar. remember doing = acordarse de algo pasado; remember to do = acordarse de hacer algo.",
        examples: [["Remember to lock the door.", "Acuérdate de cerrar la puerta."]],
      },
    ],
    mistakes: [
      { wrong: "I'm thinking in buy a car.", right: "I'm thinking about buying a car.", why: "'Think about/of' + -ing, no 'think in'." },
      { wrong: "I want that you come.", right: "I want you to come.", why: "want + persona + to + verbo." },
    ],
    quiz: [
      { q: "I can't stand ___ in line.", options: ["to wait", "waiting", "wait", "waited"], answer: 1, why: "can't stand + -ing." },
      { q: "They agreed ___ the price.", options: ["lowering", "to lower", "lower", "for lowering"], answer: 1, why: "agree + to + verbo." },
      { q: "She left without ___ goodbye.", options: ["say", "to say", "saying", "said"], answer: 2, why: "Después de preposición → -ing." },
      { q: "My mom wants ___ a doctor.", options: ["that I become", "me to become", "me becoming", "me become"], answer: 1, why: "want + persona + to + verbo." },
      { q: "I'm looking forward to ___ you.", options: ["see", "seeing", "saw", "be seeing"], answer: 1, why: "En 'look forward to', 'to' es preposición → -ing." },
    ],
  },
  {
    slug: "modals-deduction",
    title: "Must / Might / Can't (deducción)",
    subtitle: "Qué tan seguro estás",
    intro: "Los nativos usan muchísimo estos modales para especular. Reconocerlos te ayuda a entender el tono de una conversación.",
    rules: [
      {
        title: "Presente",
        text: "must = seguro que sí (95%); might/may/could = quizá (50%); can't = seguro que no.",
        examples: [
          ["She must be tired, she worked all night.", "Debe estar cansada, trabajó toda la noche."],
          ["He might be at home.", "Quizá está en casa."],
          ["That can't be true!", "¡No puede ser cierto!"],
        ],
      },
      {
        title: "Pasado: modal + have + participio",
        text: "must have, might have, can't/couldn't have.",
        examples: [
          ["I must have left my keys at work.", "Debí dejar mis llaves en el trabajo."],
          ["She can't have seen us.", "No puede habernos visto."],
        ],
      },
    ],
    mistakes: [{ wrong: "He mustn't be at home, the lights are off.", right: "He can't be at home…", why: "Para deducción negativa se usa 'can't', no 'mustn't' (que significa prohibición)." }],
    quiz: [
      { q: "You haven't eaten all day. You ___ be hungry.", options: ["can't", "must", "might not", "mustn't"], answer: 1, why: "Deducción casi segura → must." },
      { q: "That ___ be Juan, he's in Spain this week.", options: ["must", "can't", "might", "should"], answer: 1, why: "Imposible → can't." },
      { q: "I'm not sure where she is. She ___ be at the gym.", options: ["must", "can't", "might", "has to"], answer: 2, why: "Posibilidad → might." },
      { q: "The floor is wet. It ___ rained.", options: ["must have", "can't have", "must", "might"], answer: 0, why: "Deducción sobre el pasado → must have + participio." },
    ],
  },
  {
    slug: "passive",
    title: "Voz pasiva",
    subtitle: "It was made… / It's being fixed",
    intro: "Se usa cuando importa más la acción que quién la hace. Es muy común en noticias, avisos y en el trabajo.",
    rules: [
      {
        title: "Estructura: be (en el tiempo que toque) + participio",
        text: "El verbo 'be' cambia de tiempo; el participio no cambia.",
        examples: [
          ["English is spoken all over the world.", "El inglés se habla en todo el mundo."],
          ["The bridge was built in 1990.", "El puente fue construido en 1990."],
          ["My car is being repaired.", "Están arreglando mi carro."],
          ["The package has been delivered.", "El paquete ya fue entregado."],
        ],
      },
      {
        title: "'Se' impersonal del español",
        text: "Muchas frases con 'se' en español se traducen con pasiva.",
        examples: [["Spanish is spoken here.", "Se habla español."]],
      },
    ],
    mistakes: [{ wrong: "I was born on 1995.", right: "I was born in 1995.", why: "Años y meses van con 'in'." }],
    quiz: [
      { q: "This song ___ by a famous DJ.", options: ["produced", "was produced", "was producing", "has produce"], answer: 1, why: "Pasiva en pasado: was + participio." },
      { q: "The rooms ___ every day.", options: ["are cleaned", "cleaned", "are cleaning", "is cleaned"], answer: 0, why: "Pasiva en presente, plural: are + participio." },
      { q: "Your order ___ right now.", options: ["is prepared", "is being prepared", "has prepared", "prepares"], answer: 1, why: "Acción en progreso → is being + participio." },
      { q: "The meeting ___ cancelled.", options: ["has been", "has", "have been", "is be"], answer: 0, why: "Present perfect pasivo: has been + participio." },
    ],
  },
  {
    slug: "reported-speech",
    title: "Estilo indirecto",
    subtitle: "She said that…",
    intro: "Para contar lo que alguien dijo. Normalmente el verbo 'retrocede' un tiempo.",
    rules: [
      {
        title: "Retroceso de tiempos",
        text: "presente → pasado · pasado → past perfect · will → would · can → could.",
        examples: [
          ['"I\'m tired." → She said (that) she was tired.', "Dijo que estaba cansada."],
          ['"I will help you." → He said he would help me.', "Dijo que me ayudaría."],
        ],
      },
      {
        title: "Say vs Tell",
        text: "say something · tell SOMEONE something. 'Tell' necesita a quién.",
        examples: [
          ["She told me she was busy.", "Me dijo que estaba ocupada."],
          ["He said he was busy.", "Dijo que estaba ocupado."],
        ],
      },
      {
        title: "Preguntas: orden de afirmación",
        text: "En preguntas indirectas no se invierte el orden ni se usa do/did.",
        examples: [['"Where do you live?" → She asked me where I lived.', "Me preguntó dónde vivía."]],
      },
    ],
    mistakes: [
      { wrong: "He said me that…", right: "He told me that…", why: "'Say' no lleva persona directa; usa 'tell'." },
      { wrong: "She asked me where did I live.", right: "She asked me where I lived.", why: "Pregunta indirecta = orden normal, sin 'did'." },
    ],
    quiz: [
      { q: '"I can swim." → He said he ___ swim.', options: ["can", "could", "would", "can't"], answer: 1, why: "can → could." },
      { q: "She ___ me that she was leaving.", options: ["said", "told", "says", "spoke"], answer: 1, why: "Con persona (me) → told." },
      { q: '"Where is the bank?" → He asked where the bank ___.', options: ["is it", "was", "did be", "was it"], answer: 1, why: "Pregunta indirecta: orden normal y retroceso." },
      { q: '"I will call you." → She said she ___ call me.', options: ["will", "would", "can", "shall"], answer: 1, why: "will → would." },
    ],
  },
  {
    slug: "relative-clauses",
    title: "Who / Which / That / Where",
    subtitle: "Oraciones de relativo",
    intro: "Sirven para unir ideas y sonar más natural en vez de hablar en frases cortitas.",
    rules: [
      {
        title: "Who (personas), which (cosas), that (ambas)",
        text: "'That' es lo más común en conversación.",
        examples: [
          ["The guy who/that lives next door is a chef.", "El chavo que vive al lado es chef."],
          ["The phone which/that I bought is great.", "El teléfono que compré es excelente."],
        ],
      },
      {
        title: "Where (lugares), whose (de quien)",
        text: "",
        examples: [
          ["That's the restaurant where we met.", "Ese es el restaurante donde nos conocimos."],
          ["She's the woman whose car was stolen.", "Es la mujer a quien le robaron el carro."],
        ],
      },
      {
        title: "Se puede omitir cuando no es el sujeto",
        text: "The movie (that) I watched = La película que vi.",
        examples: [["The book I'm reading is amazing.", "El libro que estoy leyendo está increíble."]],
      },
    ],
    mistakes: [{ wrong: "The man which called you.", right: "The man who called you.", why: "Para personas usa 'who' o 'that'." }],
    quiz: [
      { q: "She's the teacher ___ helped me.", options: ["which", "who", "where", "whose"], answer: 1, why: "Persona → who." },
      { q: "This is the city ___ I was born.", options: ["which", "who", "where", "that"], answer: 2, why: "Lugar → where." },
      { q: "I have a friend ___ dad is a pilot.", options: ["who", "whose", "which", "that"], answer: 1, why: "Posesión → whose." },
      { q: "The laptop ___ I bought broke.", options: ["who", "where", "that", "whose"], answer: 2, why: "Cosa → that/which." },
    ],
  },
  {
    slug: "prepositions",
    title: "In / On / At",
    subtitle: "Preposiciones de tiempo y lugar",
    intro: "Piensa en una pirámide: IN para lo más grande y general, ON para lo intermedio y AT para lo más específico.",
    rules: [
      {
        title: "Tiempo",
        text: "IN: meses, años, estaciones, partes del día (in the morning). ON: días y fechas (on Monday, on May 5th). AT: horas y momentos exactos (at 7 p.m., at night, at the weekend 🇬🇧).",
        examples: [
          ["I was born in March, on the 12th, at 3 a.m.", "Nací en marzo, el 12, a las 3 a.m."],
        ],
      },
      {
        title: "Lugar",
        text: "IN: dentro de un espacio (in the car, in Mexico). ON: superficies y transporte público (on the table, on the bus). AT: puntos o lugares específicos (at home, at work, at the bus stop).",
        examples: [
          ["I'm at work, my phone is in my bag.", "Estoy en el trabajo, mi teléfono está en mi bolsa."],
          ["She's on the bus.", "Está en el camión."],
        ],
      },
    ],
    mistakes: [
      { wrong: "See you in Monday.", right: "See you on Monday.", why: "Días → on." },
      { wrong: "I'm in home.", right: "I'm at home.", why: "'At home' es una expresión fija." },
    ],
    quiz: [
      { q: "The meeting is ___ Tuesday.", options: ["in", "on", "at", "to"], answer: 1, why: "Días → on." },
      { q: "I usually wake up ___ 6:30.", options: ["in", "on", "at", "by"], answer: 2, why: "Horas → at." },
      { q: "We met ___ 2018.", options: ["in", "on", "at", "since"], answer: 0, why: "Años → in." },
      { q: "I left my phone ___ the bus.", options: ["in", "on", "at", "inside"], answer: 1, why: "Transporte público → on." },
      { q: "Call me when you're ___ home.", options: ["in", "on", "at", "to"], answer: 2, why: "At home (fija)." },
    ],
  },
  {
    slug: "make-do",
    title: "Make vs Do",
    subtitle: "Los dos significan 'hacer'",
    intro: "Regla general: DO para tareas, trabajo y actividades; MAKE para crear o producir algo. Pero muchas son colocaciones fijas.",
    rules: [
      {
        title: "DO",
        text: "homework, the dishes, the laundry, exercise, a favor, business, your best, research, nothing.",
        examples: [["Can you do me a favor?", "¿Me haces un favor?"]],
      },
      {
        title: "MAKE",
        text: "a mistake, a decision, money, friends, a call, a plan, noise, an effort, sense, dinner, an appointment.",
        examples: [
          ["I made a mistake.", "Cometí un error."],
          ["It doesn't make sense.", "No tiene sentido."],
        ],
      },
    ],
    mistakes: [
      { wrong: "I did a mistake.", right: "I made a mistake.", why: "Siempre 'make a mistake'." },
      { wrong: "Make your homework.", right: "Do your homework.", why: "Tareas → do." },
    ],
    quiz: [
      { q: "I need to ___ a decision soon.", options: ["do", "make", "take", "have"], answer: 1, why: "make a decision." },
      { q: "Who's going to ___ the dishes?", options: ["make", "do", "wash up", "clean up"], answer: 1, why: "do the dishes." },
      { q: "She ___ a lot of money in her new job.", options: ["does", "makes", "wins", "earns to"], answer: 1, why: "make money." },
      { q: "Could you ___ me a favor?", options: ["make", "do", "give", "have"], answer: 1, why: "do someone a favor." },
      { q: "Please don't ___ noise, the baby is sleeping.", options: ["do", "make", "have", "put"], answer: 1, why: "make noise." },
    ],
  },
  {
    slug: "questions",
    title: "Cómo hacer preguntas",
    subtitle: "do/does/did y orden de palabras",
    intro: "En español basta con la entonación ('¿Vives aquí?'). En inglés casi siempre necesitas un auxiliar antes del sujeto. Si no lo pones, se nota muchísimo.",
    rules: [
      {
        title: "Auxiliar + sujeto + verbo",
        text: "Pregunta-palabra (where, what…) + auxiliar (do/does/did/is/have…) + sujeto + verbo.",
        examples: [
          ["Where do you live?", "¿Dónde vives?"],
          ["What did she say?", "¿Qué dijo ella?"],
          ["How long have you been here?", "¿Cuánto tiempo llevas aquí?"],
        ],
      },
      {
        title: "Preguntas de sujeto: sin do/did",
        text: "Si 'who' o 'what' es el sujeto (quien hace la acción), no se usa auxiliar.",
        examples: [
          ["Who called you?", "¿Quién te llamó?"],
          ["What happened?", "¿Qué pasó?"],
        ],
      },
      {
        title: "Con 'be' no se usa do",
        text: "Se invierte directamente: Are you…? Is it…? Were they…?",
        examples: [["Are you ready?", "¿Estás listo?"]],
      },
    ],
    mistakes: [
      { wrong: "Where you live?", right: "Where do you live?", why: "Falta el auxiliar 'do'." },
      { wrong: "What did happen?", right: "What happened?", why: "'What' es el sujeto → sin 'did'." },
      { wrong: "Do you are tired?", right: "Are you tired?", why: "Con 'be' no se usa 'do'." },
    ],
    quiz: [
      { q: "What time ___ the movie start?", options: ["is", "does", "do", "—"], answer: 1, why: "the movie = it → does." },
      { q: "Who ___ the window?", options: ["did break", "broke", "did broke", "breaked"], answer: 1, why: "Pregunta de sujeto → sin 'did'." },
      { q: "Where ___ you go on vacation last year?", options: ["do", "were", "did", "have"], answer: 2, why: "Pasado + verbo normal → did." },
      { q: "___ you hungry?", options: ["Do", "Are", "Have", "Does"], answer: 1, why: "Con 'be' → Are you…?" },
      { q: "How long ___ you been learning English?", options: ["do", "did", "have", "are"], answer: 2, why: "Present perfect continuo → have you been." },
    ],
  },
];

export const grammarBySlug = (slug: string) => GRAMMAR.find((g) => g.slug === slug);
