import type { Sentence, TopicColor } from "./dictionary";

/** [inglés, español, nota opcional] */
type TermRow = [en: string, es: string, note?: string];

/** [quién habla, inglés, español] */
type Line = [who: string, en: string, es: string];

type SpecialtyDef = {
  slug: string;
  title: string;
  titleEn: string;
  emoji: string;
  color: TopicColor;
  blurb: string;
  groups: { title: string; titleEn: string; emoji: string; terms: TermRow[] }[];
  phrases: [en: string, es: string][];
  dialogues: { title: string; titleEn: string; lines: Line[] }[];
};

const SPECIALTIES_DEF: SpecialtyDef[] = [
  {
    slug: "programador",
    title: "Programador",
    titleEn: "Programmer",
    emoji: "👩‍💻",
    color: "lilac",
    blurb: "El inglés que se usa todos los días en el código, en Git y en las juntas del equipo.",
    groups: [
      {
        title: "Código básico",
        titleEn: "Code basics",
        emoji: "💻",
        terms: [
          ["variable", "la variable"],
          ["function", "la función"],
          ["loop", "el ciclo / el bucle"],
          ["array", "el arreglo"],
          ["string", "la cadena de texto"],
          ["object", "el objeto"],
          ["class", "la clase"],
          ["library", "la librería", "Ojo: 'library' es biblioteca; 'bookstore' es librería (tienda de libros)."],
          ["framework", "el framework / el marco de trabajo"],
          ["bug", "el error / el bug"],
          ["feature", "la funcionalidad"],
          ["syntax error", "el error de sintaxis"],
          ["to run", "ejecutar / correr", "'Run the tests' = corre las pruebas."],
          ["to refactor", "refactorizar", "Reescribir código para que quede más limpio sin cambiar lo que hace."],
        ],
      },
      {
        title: "Git y trabajo en equipo",
        titleEn: "Git & teamwork",
        emoji: "🌿",
        terms: [
          ["repository", "el repositorio", "Casi siempre se dice 'repo'."],
          ["branch", "la rama"],
          ["main branch", "la rama principal"],
          ["commit", "el commit / la confirmación", "También es verbo: 'I committed the changes'."],
          ["to push", "subir (cambios)"],
          ["to pull", "bajar (cambios)"],
          ["to clone", "clonar"],
          ["to merge", "fusionar / hacer merge"],
          ["merge conflict", "el conflicto de fusión"],
          ["pull request", "la solicitud de cambios", "Se dice 'PR'. En GitLab se llama 'merge request' (MR)."],
          ["code review", "la revisión de código"],
          ["to approve", "aprobar"],
        ],
      },
      {
        title: "Depurar y desplegar",
        titleEn: "Debugging & deploying",
        emoji: "🐞",
        terms: [
          ["to debug", "depurar"],
          ["stack trace", "la traza de la pila", "La lista de llamadas que aparece cuando algo truena."],
          ["log", "el registro / el log"],
          ["breakpoint", "el punto de interrupción"],
          ["to reproduce", "reproducir", "'I can't reproduce it' = no logro que el error vuelva a pasar."],
          ["edge case", "el caso límite"],
          ["to crash", "tronar / caerse"],
          ["to deploy", "desplegar / hacer deploy"],
          ["production", "producción", "Se dice 'prod': 'It's broken in prod'."],
          ["staging", "el entorno de pruebas"],
          ["rollback", "la reversión", "Verbo: 'to roll back' (separado)."],
          ["hotfix", "la corrección urgente"],
          ["downtime", "el tiempo fuera de servicio"],
        ],
      },
      {
        title: "Juntas y trabajo ágil",
        titleEn: "Meetings & agile",
        emoji: "📅",
        terms: [
          ["standup", "la junta diaria", "Reunión corta: qué hiciste ayer, qué harás hoy y qué te bloquea."],
          ["sprint", "el sprint / la iteración"],
          ["ticket", "el ticket / la tarea"],
          ["backlog", "la lista de pendientes"],
          ["deadline", "la fecha límite"],
          ["estimate", "la estimación"],
          ["blocker", "el bloqueo / el impedimento", "'I'm blocked' = no puedo avanzar."],
          ["to ship", "lanzar / sacar a producción", "Muy común: 'We shipped the new feature'."],
          ["requirement", "el requisito"],
          ["stakeholder", "el interesado / la parte interesada"],
          ["roadmap", "la hoja de ruta"],
        ],
      },
    ],
    phrases: [
      ["Can you review my pull request?", "¿Puedes revisar mi pull request?"],
      ["I can't reproduce the bug.", "No logro reproducir el error."],
      ["It works on my machine.", "En mi computadora sí funciona."],
      ["The build is failing.", "La compilación está fallando."],
      ["I'm blocked by the backend team.", "Estoy bloqueado por el equipo de backend."],
      ["I'll fix it and push a new commit.", "Lo arreglo y subo un nuevo commit."],
      ["We need to roll back the last deploy.", "Tenemos que revertir el último despliegue."],
      ["What's the expected behavior?", "¿Cuál es el comportamiento esperado?"],
      ["I'll open a ticket for that.", "Voy a abrir un ticket para eso."],
      ["Let's move this to the next sprint.", "Pasemos esto al siguiente sprint."],
      ["Can you share your screen?", "¿Puedes compartir tu pantalla?"],
      ["Let's pair on this after lunch.", "Trabajemos juntos en esto después de comer."],
      ["I left a few comments on your code.", "Te dejé unos comentarios en tu código."],
      ["The tests are passing now.", "Las pruebas ya pasan."],
    ],
    dialogues: [
      {
        title: "La junta diaria",
        titleEn: "Daily standup",
        lines: [
          ["Lead", "Good morning, everyone. Let's start. Ana?", "Buenos días a todos. Empecemos. ¿Ana?"],
          ["Ana", "Yesterday I finished the login page.", "Ayer terminé la página de inicio de sesión."],
          ["Ana", "Today I'm going to write the tests for it.", "Hoy voy a escribir las pruebas."],
          ["Lead", "Any blockers?", "¿Algún bloqueo?"],
          ["Ana", "Yes, I need access to the staging server.", "Sí, necesito acceso al servidor de pruebas."],
          ["Lead", "Okay, I'll ask DevOps right after this meeting.", "Va, le pregunto a DevOps saliendo de esta junta."],
        ],
      },
      {
        title: "Revisión de código",
        titleEn: "Code review",
        lines: [
          ["Leo", "Hey, did you get a chance to look at my PR?", "Oye, ¿alcanzaste a ver mi PR?"],
          ["Sam", "Yes, it looks good, but I left a couple of comments.", "Sí, se ve bien, pero te dejé un par de comentarios."],
          ["Leo", "What's the main issue?", "¿Cuál es el problema principal?"],
          ["Sam", "This function doesn't handle empty arrays.", "Esta función no maneja arreglos vacíos."],
          ["Leo", "Good catch. I'll fix it and push again.", "Buen ojo. Lo arreglo y vuelvo a subirlo."],
          ["Sam", "Great, I'll approve it after that.", "Perfecto, lo apruebo después de eso."],
        ],
      },
    ],
  },
  {
    slug: "abogado",
    title: "Abogado",
    titleEn: "Lawyer",
    emoji: "⚖️",
    color: "peach",
    blurb: "Vocabulario de despacho, contratos y juicios. Está basado en el inglés legal de Estados Unidos.",
    groups: [
      {
        title: "El despacho y el caso",
        titleEn: "The firm & the case",
        emoji: "🏛️",
        terms: [
          ["law firm", "el despacho de abogados"],
          ["attorney", "el abogado / la abogada", "En EE. UU. 'attorney' es más formal que 'lawyer'."],
          ["paralegal", "el asistente legal / la asistente legal"],
          ["client", "el cliente / la clienta"],
          ["case", "el caso"],
          ["lawsuit", "la demanda"],
          ["plaintiff", "el demandante / la demandante"],
          ["defendant", "el demandado / el acusado"],
          ["judge", "el juez / la jueza"],
          ["court", "el tribunal / la corte"],
          ["witness", "el testigo / la testigo"],
          ["evidence", "las pruebas", "Es incontable: 'a piece of evidence', nunca 'evidences'."],
          ["fee", "los honorarios"],
        ],
      },
      {
        title: "Contratos",
        titleEn: "Contracts",
        emoji: "📝",
        terms: [
          ["contract", "el contrato"],
          ["agreement", "el acuerdo / el convenio"],
          ["clause", "la cláusula"],
          ["party", "la parte", "Cada persona o empresa que firma: 'both parties'."],
          ["to sign", "firmar"],
          ["signature", "la firma"],
          ["terms", "los términos / las condiciones"],
          ["breach of contract", "el incumplimiento de contrato"],
          ["liability", "la responsabilidad legal"],
          ["amendment", "la modificación / la enmienda"],
          ["non-disclosure agreement", "el acuerdo de confidencialidad", "Se dice 'NDA'."],
          ["power of attorney", "el poder notarial"],
          ["to terminate", "rescindir / dar por terminado"],
          ["enforceable", "exigible / válido ante la ley"],
        ],
      },
      {
        title: "En el juicio",
        titleEn: "In court",
        emoji: "🧑‍⚖️",
        terms: [
          ["to sue", "demandar", "'She sued the company' = demandó a la empresa."],
          ["to file a lawsuit", "presentar una demanda"],
          ["hearing", "la audiencia"],
          ["trial", "el juicio"],
          ["jury", "el jurado"],
          ["testimony", "el testimonio / la declaración"],
          ["objection", "la objeción"],
          ["ruling", "el fallo / la resolución"],
          ["verdict", "el veredicto"],
          ["guilty", "culpable"],
          ["not guilty", "no culpable / inocente", "En el juicio se dice 'not guilty', no 'innocent'."],
          ["sentence", "la sentencia / la condena", "También significa 'oración' en gramática."],
          ["settlement", "el acuerdo extrajudicial"],
          ["to appeal", "apelar"],
          ["bail", "la fianza"],
        ],
      },
    ],
    phrases: [
      ["I'd like to schedule a consultation.", "Me gustaría agendar una consulta."],
      ["Please read the contract carefully before you sign it.", "Por favor lea el contrato con cuidado antes de firmarlo."],
      ["This clause is not enforceable.", "Esta cláusula no es exigible."],
      ["We reached a settlement out of court.", "Llegamos a un acuerdo fuera de la corte."],
      ["My client pleads not guilty.", "Mi cliente se declara no culpable."],
      ["Objection, Your Honor.", "Objeción, su señoría."],
      ["The hearing has been postponed.", "La audiencia se pospuso."],
      ["Do you have any evidence to support that?", "¿Tiene alguna prueba que respalde eso?"],
      ["You have the right to remain silent.", "Tiene derecho a guardar silencio."],
      ["We are going to appeal the decision.", "Vamos a apelar la decisión."],
      ["I need a copy of the signed agreement.", "Necesito una copia del acuerdo firmado."],
      ["What are my options?", "¿Cuáles son mis opciones?"],
      ["Everything you tell me is confidential.", "Todo lo que me diga es confidencial."],
    ],
    dialogues: [
      {
        title: "Primera consulta",
        titleEn: "First consultation",
        lines: [
          ["Lawyer", "Thank you for coming in. How can I help you?", "Gracias por venir. ¿En qué le puedo ayudar?"],
          ["Client", "My landlord kept my deposit and won't return it.", "Mi casero se quedó con mi depósito y no me lo quiere regresar."],
          ["Lawyer", "Do you have a copy of your lease?", "¿Tiene una copia de su contrato de arrendamiento?"],
          ["Client", "Yes, and I have photos of the apartment.", "Sí, y tengo fotos del departamento."],
          ["Lawyer", "Good. That evidence will help your case.", "Bien. Esas pruebas van a ayudar a su caso."],
          ["Lawyer", "First, we'll send him a formal letter.", "Primero le vamos a mandar una carta formal."],
        ],
      },
      {
        title: "En la corte",
        titleEn: "In the courtroom",
        lines: [
          ["Judge", "Please state your name for the record.", "Por favor diga su nombre para que conste en actas."],
          ["Witness", "My name is Laura Smith.", "Me llamo Laura Smith."],
          ["Attorney", "Where were you on the night of May fifth?", "¿Dónde estaba la noche del cinco de mayo?"],
          ["Witness", "I was at work until ten.", "Estaba en el trabajo hasta las diez."],
          ["Attorney", "Objection, Your Honor. That's not relevant.", "Objeción, su señoría. Eso no es relevante."],
          ["Judge", "Overruled. The witness may answer.", "No ha lugar. La testigo puede responder."],
        ],
      },
    ],
  },
  {
    slug: "maestro",
    title: "Maestro",
    titleEn: "Teacher",
    emoji: "🧑‍🏫",
    color: "mint",
    blurb: "Lo que dice un maestro en el salón: instrucciones, tareas, calificaciones y juntas con papás.",
    groups: [
      {
        title: "En el salón",
        titleEn: "In the classroom",
        emoji: "🏫",
        terms: [
          ["classroom", "el salón de clases"],
          ["whiteboard", "el pizarrón blanco"],
          ["desk", "el pupitre / el escritorio"],
          ["textbook", "el libro de texto"],
          ["worksheet", "la hoja de ejercicios"],
          ["homework", "la tarea", "Incontable: 'a lot of homework', nunca 'homeworks'."],
          ["assignment", "la tarea / el trabajo asignado", "Sí se cuenta: 'two assignments'."],
          ["lesson plan", "la planeación de clase"],
          ["attendance", "la asistencia", "'To take attendance' = pasar lista."],
          ["schedule", "el horario"],
          ["recess", "el recreo"],
          ["semester", "el semestre"],
          ["principal", "el director / la directora"],
        ],
      },
      {
        title: "Evaluar",
        titleEn: "Assessment",
        emoji: "📊",
        terms: [
          ["test", "el examen"],
          ["quiz", "el examen rápido"],
          ["grade", "la calificación", "También es 'grado escolar': 'She's in third grade'."],
          ["to grade", "calificar"],
          ["report card", "la boleta de calificaciones"],
          ["rubric", "la rúbrica"],
          ["feedback", "la retroalimentación", "Incontable: 'some feedback'."],
          ["to pass", "aprobar / pasar"],
          ["to fail", "reprobar"],
          ["extra credit", "los puntos extra"],
          ["due date", "la fecha de entrega"],
          ["to hand in", "entregar", "Phrasal verb: 'hand in your homework'."],
        ],
      },
      {
        title: "Manejo del grupo",
        titleEn: "Classroom management",
        emoji: "🙋",
        terms: [
          ["to raise your hand", "levantar la mano"],
          ["to pay attention", "poner atención"],
          ["to take turns", "turnarse"],
          ["pair work", "el trabajo en parejas"],
          ["group work", "el trabajo en equipo"],
          ["rules", "las reglas"],
          ["behavior", "la conducta"],
          ["detention", "el castigo después de clases"],
          ["field trip", "la excursión escolar"],
          ["parent-teacher conference", "la junta con padres de familia"],
        ],
      },
    ],
    phrases: [
      ["Open your books to page twenty.", "Abran sus libros en la página veinte."],
      ["Please raise your hand before you speak.", "Por favor levanten la mano antes de hablar."],
      ["Work in pairs.", "Trabajen en parejas."],
      ["Who wants to read?", "¿Quién quiere leer?"],
      ["Hand in your homework, please.", "Entreguen su tarea, por favor."],
      ["The project is due on Friday.", "El proyecto se entrega el viernes."],
      ["Any questions?", "¿Alguna pregunta?"],
      ["Let's review what we learned yesterday.", "Repasemos lo que aprendimos ayer."],
      ["Take out a sheet of paper.", "Saquen una hoja de papel."],
      ["Great job! Keep it up.", "¡Muy bien! Sigan así."],
      ["Please be quiet and pay attention.", "Por favor guarden silencio y pongan atención."],
      ["You have ten minutes left.", "Les quedan diez minutos."],
      ["Your son is doing very well in class.", "Su hijo va muy bien en clase."],
    ],
    dialogues: [
      {
        title: "Empieza la clase",
        titleEn: "Starting the class",
        lines: [
          ["Teacher", "Good morning, class. Please sit down.", "Buenos días, grupo. Siéntense, por favor."],
          ["Teacher", "Let me take attendance first.", "Primero voy a pasar lista."],
          ["Student", "Teacher, I forgot my homework at home.", "Maestra, olvidé mi tarea en la casa."],
          ["Teacher", "Okay, you can hand it in tomorrow.", "Está bien, la puedes entregar mañana."],
          ["Teacher", "Now, open your books to page twenty.", "Ahora, abran sus libros en la página veinte."],
          ["Student", "Can I read the first paragraph?", "¿Puedo leer el primer párrafo?"],
        ],
      },
      {
        title: "Junta con papás",
        titleEn: "Parent-teacher conference",
        lines: [
          ["Teacher", "Thank you for coming today.", "Gracias por venir hoy."],
          ["Parent", "How is my daughter doing?", "¿Cómo va mi hija?"],
          ["Teacher", "She's doing great in reading.", "Va muy bien en lectura."],
          ["Teacher", "But she needs to work on math.", "Pero necesita mejorar en matemáticas."],
          ["Parent", "What can we do at home?", "¿Qué podemos hacer en casa?"],
          ["Teacher", "Practice with her for fifteen minutes every day.", "Practiquen con ella quince minutos cada día."],
        ],
      },
    ],
  },
];

/* ---------- Forma lista para la vista ---------- */

export type Term = { id: string; en: string; es: string; note?: string };

export type Specialty = Omit<SpecialtyDef, "groups" | "phrases" | "dialogues"> & {
  groups: { title: string; titleEn: string; emoji: string; terms: Term[] }[];
  phrases: Sentence[];
  dialogues: { title: string; titleEn: string; lines: { who: string; en: string; es: string }[] }[];
  totalTerms: number;
};

export const SPECIALTIES: Specialty[] = SPECIALTIES_DEF.map((s) => ({
  ...s,
  groups: s.groups.map((g, gi) => ({
    ...g,
    terms: g.terms.map(([en, es, note], i) => ({ id: `esp-${s.slug}-${gi}-${i}`, en, es, note })),
  })),
  phrases: s.phrases.map(([en, es]) => ({ en, es })),
  dialogues: s.dialogues.map((d) => ({ ...d, lines: d.lines.map(([who, en, es]) => ({ who, en, es })) })),
  totalTerms: s.groups.reduce((n, g) => n + g.terms.length, 0),
}));

export const specialtyBySlug = (slug: string) => SPECIALTIES.find((s) => s.slug === slug);

/** Frases para el juego de bloques: frases útiles + líneas cortas de los diálogos */
export function specialtySentences(s: Specialty): Sentence[] {
  const fromDialogues = s.dialogues.flatMap((d) => d.lines).filter((l) => l.en.split(/\s+/).length <= 10);
  return [...s.phrases, ...fromDialogues.map(({ en, es }) => ({ en, es }))];
}
