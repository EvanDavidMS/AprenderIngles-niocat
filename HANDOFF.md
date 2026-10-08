# Handoff · Soltura (app para aprender inglés)

Última revisión: 2026-10-08 · rama `main` · último commit `efe0ad3`
Estado: `npx tsc --noEmit` y `npm run lint` pasan sin errores. Árbol limpio.

## Qué es

App en español para hispanohablantes que aprenden inglés. Sin backend: todo el progreso vive en
`localStorage` (`soltura-progress-v1`, tema en `soltura-theme`).

Stack: **Next.js 16.4** (App Router, `cacheComponents` y `partialPrefetching` activos en `next.config.ts`),
React 19.3, Tailwind v4 (vía `@tailwindcss/turbopack`), Framer Motion 14, TypeScript.
⚠️ `AGENTS.md`: esta versión de Next tiene cambios; leer `node_modules/next/dist/docs/` antes de tocar APIs.
Ya se usan los tipos globales `PageProps<"/ruta">` y `LayoutProps<"/">`, y `params` es una promesa (`await params`).

## Mapa del código

| Ruta / archivo | Qué hace |
| --- | --- |
| `src/app/page.tsx` | Inicio: XP diario (meta 60), racha, palabra del día, rutina, todos los temas |
| `src/app/diccionario/` | Índice de 19 temas (tarjetas pastel) → `[tema]/TopicView.tsx` con pestañas Palabras / Preguntas / Armar frases |
| `src/app/vocabulario/` | Tarjetas con repaso espaciado (SM-2 simplificado en `store.ts → reviewCard`) |
| `src/app/escuchar/` | Dictados en 3 niveles + reducciones (gonna, wanna…) |
| `src/app/hablar/` | Shadowing con reconocimiento de voz + preguntas de conversación |
| `src/app/frases/` | Phrasal verbs e idioms con quiz |
| `src/app/gramatica/` | 12 temas → `[slug]/GrammarLesson.tsx` |
| `src/components/Shell.tsx` | Navegación (barra lateral + barra inferior en móvil con 5 links), buscador global, botón de tema |
| `src/components/WordBuilder.tsx` | Juego de armar frases con bloques (reutilizable: recibe `topic` y `sentences`) |
| `src/components/ui.tsx` | `PageHeader`, `Card`, `Button`, `SpeakButtons`, `Tabs`, `DiffView`, `ScoreBadge`, `RateControl` |
| `src/components/topic-colors.ts` | Mapa color → clase Tailwind (las clases deben ir escritas completas) |
| `src/data/*.ts` | Todo el contenido |
| `src/lib/store.ts` | Estado global con `useSyncExternalStore` + localStorage (`earn`, `saveBlock`, `saveGrammarScore`…) |
| `src/lib/forms.ts` | Generadores de plural / artículos / 3ª persona en inglés y español |
| `src/lib/speech.ts` | Text-to-speech y reconocimiento de voz (Chrome/Edge) |
| `src/lib/theme*.ts` | Modo claro/oscuro sin parpadeo (script en `<head>` + `data-theme`) |

### Cómo funciona el diccionario (`src/data/dictionary.ts`)
- Cada tema es un `TopicDef`: `slug, title, titleEn, emoji, color, kind ("noun"|"adj"|"verb"), blurb, sing?, plural?, rows, questions`.
- `rows` son `[en, es, opts?]`; las opciones marcan irregulares (`pl`, `esPl`, `past`, `third`), incontables (`u`),
  pares (`pair`), únicos (`one`), sin plural (`np`), ejemplo manual (`ex`) y `note`.
- `sing`/`plural` son plantillas con tokens `{en} {enPl} {a} {es} {esPl} {esN} {esNPl} {un} {unos} {este} {estos}`
  (con mayúscula inicial → se capitaliza).
- Los ids son `${slug}-${índice}` → **agregar filas siempre al final** o se mezcla el progreso guardado.
- `Topic` contiene una función (`examples`), por eso `[tema]/page.tsx` sólo pasa el `slug` al cliente.

### Diseño / colores (`src/app/globals.css`)
- Tokens en `:root` y `:root[data-theme="dark"]`, expuestos a Tailwind con `@theme inline` (`bg-card`, `text-muted`, etc.).
- Variante `dark:` ligada a `data-theme`, no al sistema.
- Pasteles de tema (`lilac, peach, lime, sky, mint, rose`) son **iguales en ambos modos**; texto encima con `text-on-pastel`.
- Fuentes: Plus Jakarta Sans (texto) y Nunito (títulos, `font-display`).
- Botones estilo Duolingo: `.btn-3d`, bloques `.chip-3d`.

## Pendientes / ideas acordadas

### 1. Sección "Especialidades" — ✅ hecha (falta probarla a mano en el navegador)
Inglés técnico por profesión. Hoy hay 3: **Programador**, **Abogado** (inglés legal de EE. UU.) y **Maestro**.
- Datos: `src/data/specialties.ts`. Cada especialidad trae `groups` (subtemas con términos `[en, es, nota?]`),
  `phrases` (`[en, es]`) y `dialogues` (líneas `[quién, en, es]`). Para agregar una profesión basta con añadir otro objeto.
- Rutas: `/especialidades` (tarjetas) y `/especialidades/[slug]` → `SpecialtyView.tsx` con pestañas
  Palabras (con filtro) / Frases (con "modo práctica" que oculta el inglés) / Diálogos ("Escuchar todo" lee línea
  por línea y resalta la que va) / Armar (reusa `WordBuilder`).
- El progreso del juego de bloques se guarda como `blocks["esp-<slug>"]`, así no choca con los temas del diccionario.
- Navegación: en la barra inferior del celular **Especialidades sustituyó a Hablar** (Hablar sigue en la barra lateral
  y en los accesos de arriba en móvil). En móvil la etiqueta corta es "Oficios" (campo `short` en `LINKS`), porque
  "Especialidades" no cabe.
- Pendientes: más profesiones (médico/enfermero, diseñador, contador, ventas/atención al cliente); meter los términos en el
  buscador global (`searchDictionary` sólo busca en el diccionario); quizá mostrarlas en la página de inicio.

### 2. Ajustes de color sugeridos (no aplicados)
- `--muted` claro `#7a778c` da ~3.6:1 sobre `--paper` y ~4.3:1 sobre blanco → por debajo de AA (4.5) en texto chico.
  Oscurecer a algo como `#686579`. Se usa en ~96 lugares, así que el cambio es en un solo token.
- `--gold` claro `#c9820a` como **texto** sobre blanco ≈ 3.1:1 (se usa en 6 sitios con `text-gold`). Oscurecer para texto (~`#9a6206`) o usarlo sólo en fondos/iconos.
- En modo oscuro los pasteles a brillo completo sobre `#121119` pueden deslumbrar; probar versión un poco más apagada
  (redefinir `--lilac`… dentro de `[data-theme="dark"]`, cuidando que `--on-pastel` siga contrastando).
- `--lime` `#e6f55a` es más chillón que el resto de pasteles; considerar `#dcef7a` o similar.

### 3. Otros
- README: ya lista `/diccionario` y `/especialidades`.
