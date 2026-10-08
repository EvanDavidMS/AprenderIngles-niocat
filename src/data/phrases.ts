export type Phrase = { id: string; en: string; es: string; example: string };

type Row = [en: string, es: string, example: string];

const PHRASAL: Row[] = [
  ["get up", "levantarse", "I get up at six every day."],
  ["give up", "rendirse / dejar (un hábito)", "Don't give up, you're almost there!"],
  ["look for", "buscar", "I'm looking for my keys."],
  ["look after", "cuidar", "Can you look after my dog this weekend?"],
  ["look up", "buscar (información)", "Look it up on Google."],
  ["find out", "averiguar / enterarse", "I just found out that she's moving."],
  ["turn down", "rechazar / bajar (volumen)", "He turned down the job offer."],
  ["put off", "posponer", "Stop putting off your homework."],
  ["put up with", "aguantar / tolerar", "I can't put up with this noise anymore."],
  ["run out of", "quedarse sin", "We ran out of milk."],
  ["come up with", "ocurrírsele (una idea)", "She came up with a great idea."],
  ["get along with", "llevarse bien con", "I get along with my coworkers."],
  ["break up", "terminar (una relación)", "They broke up last month."],
  ["bring up", "sacar (un tema) / criar", "Don't bring up politics at dinner."],
  ["call off", "cancelar", "They called off the meeting."],
  ["carry on", "continuar", "Sorry for interrupting, carry on."],
  ["catch up", "ponerse al día", "Let's grab a coffee and catch up."],
  ["check out", "echar un ojo / salir del hotel", "Check out this video, it's hilarious."],
  ["end up", "terminar (haciendo algo)", "We ended up staying until midnight."],
  ["fill out", "llenar (un formulario)", "Please fill out this form."],
  ["get over", "superar", "It took me months to get over it."],
  ["go on", "continuar / pasar", "What's going on here?"],
  ["hang up", "colgar (el teléfono)", "Don't hang up, I'm still here."],
  ["hold on", "esperar un momento", "Hold on, let me check."],
  ["keep up with", "seguir el ritmo de", "It's hard to keep up with all the news."],
  ["make up", "inventar / reconciliarse", "He made up an excuse."],
  ["pick up", "recoger / aprender sin estudiar", "I'll pick you up at eight."],
  ["set up", "configurar / organizar", "Can you help me set up my new phone?"],
  ["show up", "llegar / aparecer", "He showed up two hours late."],
  ["take off", "despegar / quitarse", "Take off your shoes, please."],
  ["work out", "hacer ejercicio / salir bien", "Don't worry, everything will work out."],
  ["come across", "toparse con", "I came across an old photo of us."],
  ["drop by", "pasar (de visita breve)", "Drop by whenever you want."],
  ["get by", "arreglárselas", "My English is enough to get by."],
  ["point out", "señalar / hacer notar", "She pointed out a mistake in my report."],
  ["sort out", "resolver / arreglar", "Don't worry, I'll sort it out."],
  ["run into", "encontrarse (por casualidad)", "I ran into my ex at the supermarket."],
  ["go over", "repasar / revisar", "Let's go over the plan one more time."],
  ["give back", "devolver", "Can you give me back my charger?"],
  ["figure out", "descifrar / entender", "I finally figured out the problem."],
];

const IDIOMS: Row[] = [
  ["piece of cake", "pan comido", "The exam was a piece of cake."],
  ["break a leg", "¡mucha suerte! (antes de actuar)", "Break a leg tonight!"],
  ["call it a day", "dar por terminado (el día)", "I'm tired, let's call it a day."],
  ["under the weather", "sentirse mal / medio enfermo", "I'm feeling a bit under the weather."],
  ["on second thought", "pensándolo bien", "On second thought, I'll have tea."],
  ["the last straw", "la gota que derramó el vaso", "That was the last straw, I quit!"],
  ["once in a blue moon", "muy de vez en cuando", "I only eat fast food once in a blue moon."],
  ["cost an arm and a leg", "costar un ojo de la cara", "That phone costs an arm and a leg."],
  ["get the hang of it", "agarrarle la onda", "It's hard at first, but you'll get the hang of it."],
  ["no big deal", "no es para tanto", "Don't worry, it's no big deal."],
  ["beat around the bush", "andarse por las ramas", "Stop beating around the bush and tell me."],
  ["in the long run", "a la larga", "Exercise pays off in the long run."],
  ["not my cup of tea", "no es lo mío", "Horror movies are not my cup of tea."],
  ["hit the road", "ponerse en camino / irse", "It's late, we should hit the road."],
  ["keep me posted", "mantenme al tanto", "Keep me posted about the interview."],
  ["my bad", "mi culpa / perdón", "My bad, I forgot to text you."],
  ["sounds good", "va / me parece bien", "Dinner at eight? Sounds good."],
  ["I'm down", "me apunto", "Tacos tonight? I'm down."],
  ["it slipped my mind", "se me olvidó", "Sorry, it completely slipped my mind."],
  ["to be on the same page", "estar en la misma sintonía", "Let's make sure we're on the same page."],
];

const toPhrases = (rows: Row[], prefix: string): Phrase[] =>
  rows.map(([en, es, example], i) => ({ id: `${prefix}-${i}`, en, es, example }));

export const PHRASAL_VERBS = toPhrases(PHRASAL, "pv");
export const IDIOM_LIST = toPhrases(IDIOMS, "id");
