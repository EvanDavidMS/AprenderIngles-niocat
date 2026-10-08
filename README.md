# Soltura · Inglés de verdad

App para pasar de "sé las reglas" a "entiendo y hablo". Next.js + Tailwind + TypeScript + Framer Motion.

## Cómo correrla

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Usa **Chrome o Edge** para que funcione el micrófono.

## Secciones

| Ruta | Qué hace |
| --- | --- |
| `/` | Meta diaria (XP), racha, palabra del día y rutina de 20 min |
| `/diccionario` | 19 temas con singular/plural, preguntas y juego de armar frases |
| `/especialidades` | Inglés técnico por profesión (programador, abogado, maestro): términos, frases y diálogos |
| `/vocabulario` | ~130 palabras por tema con tarjetas y repaso espaciado |
| `/escuchar` | Dictados en 3 niveles + reducciones nativas (gonna, wanna, dunno…) |
| `/hablar` | Shadowing con reconocimiento de voz + preguntas de conversación |
| `/frases` | 40 phrasal verbs y 20 expresiones, con quiz |
| `/gramatica` | 12 temas con explicación, errores típicos y quiz |

El progreso se guarda en el navegador (localStorage).

## Agregar contenido

Todo el contenido está en `src/data/`. Para agregar palabras, añade filas **al final** de cada tema en
`vocab.ts`; si las insertas en medio, cambian los ids y se mezcla tu progreso de repaso.
