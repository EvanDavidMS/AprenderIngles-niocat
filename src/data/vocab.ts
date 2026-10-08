export type Word = {
  id: string;
  en: string;
  es: string;
  example: string;
  exampleEs: string;
  topic: string;
  note?: string;
};

type Row = [en: string, es: string, example: string, exampleEs: string, note?: string];

const TOPICS: Record<string, { label: string; emoji: string; rows: Row[] }> = {
  daily: {
    label: "Día a día",
    emoji: "☕",
    rows: [
      ["to run errands", "hacer mandados / pendientes", "I need to run some errands before lunch.", "Necesito hacer unos mandados antes de comer."],
      ["chores", "quehaceres de la casa", "I usually do the chores on Saturday morning.", "Normalmente hago los quehaceres el sábado en la mañana."],
      ["to sleep in", "dormir hasta tarde (a propósito)", "On Sundays I like to sleep in.", "Los domingos me gusta dormir hasta tarde."],
      ["to oversleep", "quedarse dormido (sin querer)", "I overslept and missed the bus.", "Me quedé dormido y perdí el camión."],
      ["commute", "trayecto diario al trabajo/escuela", "My commute takes about forty minutes.", "Mi trayecto al trabajo dura unos cuarenta minutos."],
      ["leftovers", "sobras de comida", "We had leftovers for dinner.", "Cenamos las sobras."],
      ["groceries", "el mandado / compras del súper", "Can you help me carry the groceries?", "¿Me ayudas a cargar el mandado?"],
      ["to grab (a coffee)", "ir por / tomar algo rápido", "Let's grab a coffee after class.", "Vamos por un café después de clase."],
      ["to be running late", "ir tarde", "Sorry, I'm running late. I'll be there in ten minutes.", "Perdón, voy tarde. Llego en diez minutos."],
      ["to hang out", "pasar el rato / salir con amigos", "We hung out at the park all afternoon.", "Estuvimos en el parque toda la tarde."],
      ["appointment", "cita (médico, trámite)", "I have a dentist appointment tomorrow.", "Tengo cita con el dentista mañana.", "Una cita romántica es 'a date'."],
      ["bill", "cuenta / recibo por pagar", "Can we get the bill, please?", "¿Nos trae la cuenta, por favor?"],
    ],
  },
  work: {
    label: "Trabajo",
    emoji: "💼",
    rows: [
      ["deadline", "fecha límite", "The deadline for the report is Friday.", "La fecha límite del reporte es el viernes."],
      ["to be in charge of", "estar a cargo de", "She's in charge of the marketing team.", "Ella está a cargo del equipo de marketing."],
      ["to apply for", "solicitar / postularse a", "I applied for a job at a tech company.", "Me postulé a un trabajo en una empresa de tecnología."],
      ["skills", "habilidades", "Communication skills are really important.", "Las habilidades de comunicación son muy importantes."],
      ["salary", "sueldo", "The salary is good, but the hours are long.", "El sueldo es bueno, pero el horario es largo."],
      ["to hire", "contratar", "They hired three new developers this month.", "Contrataron a tres desarrolladores nuevos este mes."],
      ["to lay off", "despedir (por recorte)", "The company laid off two hundred people.", "La empresa despidió a doscientas personas.", "'To fire' es despedir por mal desempeño."],
      ["meeting", "junta / reunión", "I'm in a meeting, can I call you back?", "Estoy en una junta, ¿te marco al rato?"],
      ["to follow up", "dar seguimiento", "I'll follow up with the client tomorrow.", "Le doy seguimiento al cliente mañana."],
      ["workload", "carga de trabajo", "My workload has doubled this year.", "Mi carga de trabajo se duplicó este año."],
      ["coworker", "compañero de trabajo", "My coworkers are really friendly.", "Mis compañeros de trabajo son muy amables."],
      ["to take a day off", "tomarse un día libre", "I'm taking a day off on Monday.", "Me voy a tomar el lunes libre."],
    ],
  },
  travel: {
    label: "Viajes",
    emoji: "✈️",
    rows: [
      ["to book", "reservar", "I booked a hotel near the beach.", "Reservé un hotel cerca de la playa."],
      ["luggage", "equipaje", "How much luggage can I bring?", "¿Cuánto equipaje puedo llevar?", "Es incontable: no se dice 'luggages'."],
      ["delayed", "retrasado", "Our flight was delayed for two hours.", "Nuestro vuelo se retrasó dos horas."],
      ["to check in", "registrarse (hotel, vuelo)", "We can check in after 3 p.m.", "Podemos registrarnos después de las 3."],
      ["boarding pass", "pase de abordar", "Please have your boarding pass ready.", "Por favor tengan listo su pase de abordar."],
      ["round trip", "viaje redondo (ida y vuelta)", "A round trip ticket is cheaper.", "Un boleto redondo sale más barato."],
      ["layover", "escala", "We have a three-hour layover in Dallas.", "Tenemos una escala de tres horas en Dallas."],
      ["sightseeing", "recorrer lugares turísticos", "We spent the whole day sightseeing.", "Pasamos todo el día recorriendo lugares turísticos."],
      ["to get lost", "perderse", "We got lost on the way to the museum.", "Nos perdimos camino al museo."],
      ["nearby", "cerca / cercano", "Is there a pharmacy nearby?", "¿Hay una farmacia cerca?"],
      ["currency", "moneda / divisa", "What currency do they use in Japan?", "¿Qué moneda usan en Japón?"],
      ["to pack", "hacer la maleta", "I still haven't packed for the trip.", "Todavía no hago la maleta para el viaje."],
    ],
  },
  feelings: {
    label: "Emociones",
    emoji: "💭",
    rows: [
      ["upset", "molesto / afectado", "She was upset because nobody called her.", "Estaba molesta porque nadie le llamó."],
      ["worried", "preocupado", "I'm worried about the exam.", "Estoy preocupado por el examen."],
      ["excited", "emocionado", "I'm so excited about the concert!", "¡Estoy súper emocionado por el concierto!", "No significa 'excitado'."],
      ["embarrassed", "avergonzado / apenado", "I was so embarrassed when I fell.", "Me dio muchísima pena cuando me caí.", "¡Falso amigo! Embarazada = pregnant."],
      ["annoyed", "fastidiado / irritado", "I get annoyed when people are late.", "Me fastidia cuando la gente llega tarde."],
      ["proud", "orgulloso", "I'm really proud of you.", "Estoy muy orgulloso de ti."],
      ["jealous", "celoso / envidioso", "He's jealous of his brother's success.", "Le tiene envidia al éxito de su hermano."],
      ["overwhelmed", "abrumado", "I feel overwhelmed with so much work.", "Me siento abrumado con tanto trabajo."],
      ["relieved", "aliviado", "I was relieved when I passed the test.", "Me sentí aliviado cuando pasé el examen."],
      ["shy", "tímido", "He's a bit shy at first.", "Es un poco tímido al principio."],
      ["reliable", "confiable / cumplido", "She's very reliable, she always delivers on time.", "Es muy cumplida, siempre entrega a tiempo."],
      ["stubborn", "terco", "My dad is so stubborn.", "Mi papá es muy terco."],
    ],
  },
  talk: {
    label: "Muletillas",
    emoji: "🗣️",
    rows: [
      ["actually", "en realidad / la verdad", "Actually, I've never been there.", "La verdad, nunca he ido.", "¡Falso amigo! Actualmente = currently / nowadays."],
      ["anyway", "en fin / de todos modos", "Anyway, what were we talking about?", "En fin, ¿de qué estábamos hablando?"],
      ["by the way", "por cierto", "By the way, did you call your mom?", "Por cierto, ¿le llamaste a tu mamá?"],
      ["I mean", "o sea / es decir", "It's good. I mean, it's not perfect, but it's good.", "Está bien. O sea, no es perfecto, pero está bien."],
      ["kind of", "algo / medio / más o menos", "I'm kind of tired today.", "Estoy medio cansado hoy."],
      ["to be honest", "para ser sincero", "To be honest, I didn't like the movie.", "Para ser sincero, no me gustó la película."],
      ["no way!", "¡no manches! / ¡no puede ser!", "No way! You met Taylor Swift?", "¡No manches! ¿Conociste a Taylor Swift?"],
      ["fair enough", "va, tiene sentido / me parece justo", "You're tired? Fair enough, let's go tomorrow.", "¿Estás cansado? Va, vamos mañana."],
      ["that makes sense", "eso tiene sentido", "Oh, that makes sense now.", "Ah, ya tiene sentido."],
      ["I guess", "supongo / creo que sí", "I guess we can try again.", "Supongo que podemos intentarlo otra vez."],
      ["you know what?", "¿sabes qué?", "You know what? Let's order pizza.", "¿Sabes qué? Pidamos pizza."],
      ["it's up to you", "como tú quieras / tú decides", "Pizza or tacos? It's up to you.", "¿Pizza o tacos? Tú decides."],
    ],
  },
  falseFriends: {
    label: "Falsos amigos",
    emoji: "⚠️",
    rows: [
      ["library", "biblioteca", "I study at the library every afternoon.", "Estudio en la biblioteca todas las tardes.", "Librería = bookstore."],
      ["to realize", "darse cuenta", "I didn't realize it was so late.", "No me di cuenta de que era tan tarde.", "Realizar = to carry out."],
      ["to attend", "asistir a", "I attended a conference in Chicago.", "Asistí a una conferencia en Chicago.", "'To assist' = ayudar."],
      ["carpet", "alfombra", "We bought a new carpet for the living room.", "Compramos una alfombra nueva para la sala.", "Carpeta = folder."],
      ["sensible", "sensato", "That's a sensible decision.", "Es una decisión sensata.", "Sensible = sensitive."],
      ["sensitive", "sensible", "My teeth are sensitive to cold.", "Mis dientes son sensibles al frío."],
      ["success", "éxito", "The party was a huge success.", "La fiesta fue todo un éxito.", "Suceso = event."],
      ["exit", "salida", "Where's the emergency exit?", "¿Dónde está la salida de emergencia?", "Éxito = success."],
      ["to pretend", "fingir", "He pretended to be sick.", "Fingió estar enfermo.", "Pretender = to intend / to aim."],
      ["eventually", "con el tiempo / al final", "Eventually, I found a better job.", "Con el tiempo, encontré un mejor trabajo.", "Eventualmente = occasionally."],
      ["college", "universidad", "My sister is in college.", "Mi hermana está en la universidad.", "Colegio = school."],
      ["rope", "cuerda / soga", "Tie it with a rope.", "Amárralo con una cuerda.", "Ropa = clothes."],
    ],
  },
  verbs: {
    label: "Verbos clave",
    emoji: "⚡",
    rows: [
      ["to figure out", "descifrar / entender / resolver", "I can't figure out how this works.", "No logro entender cómo funciona esto."],
      ["to deal with", "lidiar con / encargarse de", "I'll deal with it tomorrow.", "Mañana me encargo de eso."],
      ["to afford", "poder pagar / permitirse", "I can't afford a new car right now.", "Ahorita no me alcanza para un carro nuevo."],
      ["to borrow", "pedir prestado", "Can I borrow your pen?", "¿Me prestas tu pluma?"],
      ["to lend", "prestar", "Could you lend me twenty dollars?", "¿Me prestas veinte dólares?"],
      ["to miss", "extrañar / perder (transporte)", "I miss my family. I also missed my flight.", "Extraño a mi familia. También perdí mi vuelo."],
      ["to remind", "recordarle algo a alguien", "Remind me to buy milk.", "Recuérdame comprar leche."],
      ["to avoid", "evitar", "I try to avoid sugar.", "Trato de evitar el azúcar."],
      ["to manage to", "lograr", "I finally managed to fix my bike.", "Por fin logré arreglar mi bici."],
      ["to rely on", "contar con / depender de", "You can always rely on me.", "Siempre puedes contar conmigo."],
      ["to look forward to", "tener muchas ganas de", "I'm looking forward to seeing you.", "Tengo muchas ganas de verte.", "Va seguido de -ing."],
      ["to complain", "quejarse", "He always complains about the weather.", "Siempre se queja del clima."],
    ],
  },
  city: {
    label: "Casa y ciudad",
    emoji: "🏙️",
    rows: [
      ["neighborhood", "colonia / barrio", "I live in a quiet neighborhood.", "Vivo en una colonia tranquila."],
      ["downtown", "el centro", "Let's meet downtown.", "Veámonos en el centro."],
      ["rent", "renta / alquiler", "The rent is due on the first of the month.", "La renta se paga el primero de cada mes."],
      ["landlord", "casero / dueño del depa", "I have to call my landlord about the leak.", "Tengo que llamarle al casero por la fuga."],
      ["traffic jam", "embotellamiento / tráfico", "I was stuck in a traffic jam for an hour.", "Estuve atorado en el tráfico una hora."],
      ["sidewalk", "banqueta / acera", "Kids were playing on the sidewalk.", "Unos niños jugaban en la banqueta."],
      ["crosswalk", "paso peatonal", "Always use the crosswalk.", "Siempre usa el paso peatonal."],
      ["block", "cuadra", "The bank is two blocks away.", "El banco está a dos cuadras."],
      ["to move", "mudarse", "We moved to a bigger place last year.", "Nos mudamos a un lugar más grande el año pasado."],
      ["noisy", "ruidoso", "My neighbors are really noisy.", "Mis vecinos son muy ruidosos."],
      ["crowded", "lleno de gente", "The subway is always crowded in the morning.", "El metro siempre está lleno en la mañana."],
      ["upstairs / downstairs", "arriba / abajo (pisos)", "The bathroom is upstairs.", "El baño está arriba."],
    ],
  },
  health: {
    label: "Salud",
    emoji: "🩺",
    rows: [
      ["to feel sick", "sentirse mal", "I feel sick, I think I ate something bad.", "Me siento mal, creo que comí algo que me cayó mal."],
      ["headache", "dolor de cabeza", "I have a terrible headache.", "Tengo un dolor de cabeza horrible."],
      ["sore throat", "dolor de garganta", "I have a sore throat and a cough.", "Tengo dolor de garganta y tos."],
      ["to catch a cold", "resfriarse", "I caught a cold last week.", "Me resfrié la semana pasada."],
      ["to get better", "mejorar / aliviarse", "I hope you get better soon.", "Espero que te alivies pronto."],
      ["prescription", "receta médica", "You need a prescription for this medicine.", "Necesitas receta para esta medicina."],
      ["painkiller", "analgésico", "Take a painkiller and rest.", "Tómate un analgésico y descansa."],
      ["to sprain", "torcerse", "I sprained my ankle playing soccer.", "Me torcí el tobillo jugando fútbol."],
      ["to work out", "hacer ejercicio / ir al gym", "I work out three times a week.", "Hago ejercicio tres veces por semana."],
      ["out of shape", "fuera de forma", "I'm so out of shape, I can't run anymore.", "Estoy muy fuera de forma, ya no puedo correr."],
      ["exhausted", "agotado", "I'm exhausted after that hike.", "Estoy agotado después de esa caminata."],
      ["allergic to", "alérgico a", "I'm allergic to peanuts.", "Soy alérgico a los cacahuates."],
    ],
  },
  money: {
    label: "Dinero y compras",
    emoji: "💳",
    rows: [
      ["cash", "efectivo", "Do you accept cash?", "¿Aceptan efectivo?"],
      ["change", "cambio (dinero)", "Keep the change.", "Quédese con el cambio."],
      ["receipt", "ticket / comprobante", "Can I have the receipt, please?", "¿Me da el ticket, por favor?"],
      ["discount", "descuento", "Students get a ten percent discount.", "Los estudiantes tienen diez por ciento de descuento."],
      ["on sale", "en oferta / rebaja", "These shoes are on sale.", "Estos zapatos están en oferta.", "'For sale' = en venta."],
      ["to save", "ahorrar", "I'm saving money for a trip.", "Estoy ahorrando para un viaje."],
      ["to spend", "gastar / pasar (tiempo)", "I spent too much money this weekend.", "Gasté demasiado dinero este fin de semana."],
      ["refund", "reembolso", "I'd like a refund, please.", "Quisiera un reembolso, por favor."],
      ["to owe", "deber (dinero)", "You owe me ten bucks.", "Me debes diez dólares."],
      ["broke", "sin dinero / quebrado", "I can't go out, I'm broke.", "No puedo salir, ando sin dinero."],
      ["worth it", "vale la pena", "It's expensive, but it's worth it.", "Es caro, pero vale la pena."],
      ["to try on", "probarse (ropa)", "Can I try this on?", "¿Me lo puedo probar?"],
    ],
  },
};

export const TOPIC_LIST = Object.entries(TOPICS).map(([key, t]) => ({
  key,
  label: t.label,
  emoji: t.emoji,
  count: t.rows.length,
}));

export const WORDS: Word[] = Object.entries(TOPICS).flatMap(([topic, t]) =>
  t.rows.map(([en, es, example, exampleEs, note], i) => ({
    id: `${topic}-${i}`,
    en,
    es,
    example,
    exampleEs,
    topic,
    note,
  })),
);

export const topicLabel = (key: string) => TOPICS[key]?.label ?? key;
