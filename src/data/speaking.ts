export type ShadowGroup = {
  key: string;
  label: string;
  emoji: string;
  phrases: { en: string; es: string }[];
};

export const SHADOWING: ShadowGroup[] = [
  {
    key: "smalltalk",
    label: "Small talk",
    emoji: "👋",
    phrases: [
      { en: "Hey, how's it going?", es: "Hola, ¿cómo va todo?" },
      { en: "What do you do for a living?", es: "¿A qué te dedicas?" },
      { en: "How long have you been living here?", es: "¿Cuánto tiempo llevas viviendo aquí?" },
      { en: "I've heard a lot about you.", es: "He oído mucho de ti." },
      { en: "It was really nice talking to you.", es: "Me dio mucho gusto platicar contigo." },
    ],
  },
  {
    key: "food",
    label: "Restaurante",
    emoji: "🍽️",
    phrases: [
      { en: "Could I get a table for two, please?", es: "¿Me da una mesa para dos, por favor?" },
      { en: "What would you recommend?", es: "¿Qué me recomienda?" },
      { en: "I'll have the chicken with a side salad.", es: "Voy a querer el pollo con ensalada." },
      { en: "Could we get the check, please?", es: "¿Nos trae la cuenta, por favor?" },
      { en: "Can I get this to go?", es: "¿Me lo pone para llevar?" },
    ],
  },
  {
    key: "work",
    label: "Trabajo",
    emoji: "💼",
    phrases: [
      { en: "Sorry, could you repeat that?", es: "Perdón, ¿podrías repetir eso?" },
      { en: "Let me get back to you on that.", es: "Déjame revisarlo y te aviso." },
      { en: "I'll send you an email with the details.", es: "Te mando un correo con los detalles." },
      { en: "What's the deadline for this project?", es: "¿Cuál es la fecha límite de este proyecto?" },
      { en: "I think we're on the same page.", es: "Creo que estamos en la misma sintonía." },
    ],
  },
  {
    key: "travel",
    label: "Viajes",
    emoji: "🧳",
    phrases: [
      { en: "Excuse me, how do I get to the train station?", es: "Disculpe, ¿cómo llego a la estación de tren?" },
      { en: "I'd like to check in, I have a reservation.", es: "Quisiera registrarme, tengo una reservación." },
      { en: "Is breakfast included?", es: "¿El desayuno está incluido?" },
      { en: "How much does it cost to get downtown?", es: "¿Cuánto cuesta ir al centro?" },
      { en: "My flight was delayed and I missed my connection.", es: "Mi vuelo se retrasó y perdí mi conexión." },
    ],
  },
  {
    key: "opinions",
    label: "Opiniones",
    emoji: "💡",
    phrases: [
      { en: "In my opinion, it's a great idea.", es: "En mi opinión, es una gran idea." },
      { en: "I see your point, but I'm not sure I agree.", es: "Entiendo tu punto, pero no estoy seguro de estar de acuerdo." },
      { en: "That makes a lot of sense.", es: "Eso tiene mucho sentido." },
      { en: "I couldn't agree more.", es: "Estoy totalmente de acuerdo." },
      { en: "It really depends on the situation.", es: "Realmente depende de la situación." },
    ],
  },
  {
    key: "help",
    label: "Cuando no entiendes",
    emoji: "🆘",
    phrases: [
      { en: "Sorry, I didn't catch that.", es: "Perdón, no te entendí." },
      { en: "Could you speak a little more slowly?", es: "¿Podrías hablar un poco más despacio?" },
      { en: "What does that word mean?", es: "¿Qué significa esa palabra?" },
      { en: "Could you spell that for me?", es: "¿Me lo deletreas?" },
      { en: "I'm still learning English, so please be patient with me.", es: "Todavía estoy aprendiendo inglés, así que tenme paciencia." },
    ],
  },
];

export type Prompt = {
  q: string;
  es: string;
  useful: string[];
  sample: string;
};

export const CONVERSATION: Prompt[] = [
  {
    q: "So, what do you do for a living?",
    es: "¿A qué te dedicas?",
    useful: ["I work as a…", "I'm in charge of…", "I've been working there for…", "Right now I'm studying…"],
    sample: "I work as a web developer at a small company. I've been there for about two years, and I'm in charge of the front end.",
  },
  {
    q: "What did you do last weekend?",
    es: "¿Qué hiciste el fin de semana pasado?",
    useful: ["I hung out with…", "I slept in", "Nothing special, I just…", "We ended up…"],
    sample: "Nothing special, honestly. I slept in on Saturday, and then I hung out with some friends. We ended up watching a movie at home.",
  },
  {
    q: "What are your plans for the holidays?",
    es: "¿Qué planes tienes para las vacaciones?",
    useful: ["I'm going to…", "I'm planning to…", "I'm looking forward to…", "I haven't decided yet"],
    sample: "I'm planning to visit my family. I haven't seen them in a while, so I'm really looking forward to it.",
  },
  {
    q: "If you could travel anywhere, where would you go?",
    es: "Si pudieras viajar a cualquier lugar, ¿a dónde irías?",
    useful: ["I would go to…", "I've always wanted to…", "because…", "It's on my bucket list"],
    sample: "I would go to Japan. I've always wanted to try real ramen and see Kyoto. It's definitely on my bucket list.",
  },
  {
    q: "What's the best thing about the city where you live?",
    es: "¿Qué es lo mejor de la ciudad donde vives?",
    useful: ["The best thing is…", "There are a lot of…", "The only downside is…", "It's pretty…"],
    sample: "The best thing is the food. There are a lot of amazing places to eat. The only downside is the traffic.",
  },
  {
    q: "How long have you been studying English?",
    es: "¿Cuánto tiempo llevas estudiando inglés?",
    useful: ["I've been studying for…", "since…", "My main problem is…", "I'm trying to improve my…"],
    sample: "I've been studying English for a few years, but my main problem is listening. I'm trying to improve my vocabulary and practice speaking more.",
  },
  {
    q: "What would you do if you won the lottery?",
    es: "¿Qué harías si te ganaras la lotería?",
    useful: ["If I won the lottery, I would…", "First of all…", "I'd probably…", "I wouldn't…"],
    sample: "If I won the lottery, I'd probably buy a house for my parents first. Then I would travel for a year. I wouldn't quit my job right away, though.",
  },
  {
    q: "Can you tell me about a show or movie you like?",
    es: "¿Me cuentas de una serie o película que te guste?",
    useful: ["It's about…", "The main character is…", "What I like the most is…", "I'd totally recommend it"],
    sample: "I really like a series called Dark. It's about time travel and a small town with a lot of secrets. What I like the most is the story. I'd totally recommend it.",
  },
  {
    q: "What do you usually have for breakfast?",
    es: "¿Qué sueles desayunar?",
    useful: ["I usually have…", "It depends on the day", "On weekends…", "I try to avoid…"],
    sample: "It depends on the day. During the week I usually just grab a coffee and some toast, but on weekends I make eggs or pancakes.",
  },
  {
    q: "Tell me about a time you had a problem and how you solved it.",
    es: "Cuéntame de una vez que tuviste un problema y cómo lo resolviste.",
    useful: ["One time…", "At first I didn't know…", "So I decided to…", "In the end…"],
    sample: "One time my flight was cancelled. At first I didn't know what to do, so I talked to the airline and they booked me on the next flight. In the end, I only arrived a few hours late.",
  },
];
