# Apex Academy

Curso interactivo de Apex (Salesforce) para uso personal. Doce módulos y dos
proyectos, con el mismo ciclo en cada sub-lección: **Teoría → Quiz → Ejercicio
práctico**, todo bilingüe ES/EN y con la metáfora de Salesforce Admin como hilo
conductor.

Estado actual: **Módulo 1 completo** (9 sub-lecciones + checkpoint), estructura
lista para los módulos 2–12 y los dos Desafíos.

---

## Índice

1. [Qué incluye](#qué-incluye)
2. [Correr el proyecto en local](#correr-el-proyecto-en-local)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Editar el contenido del curso](#editar-el-contenido-del-curso)
5. [Base de datos (Neon)](#base-de-datos-neon)
6. [Subir a GitHub](#subir-a-github)
7. [Desplegar en Vercel](#desplegar-en-vercel)
8. [Variables de entorno](#variables-de-entorno)

---

## Qué incluye

- **Next.js 15 (App Router) + React 19 + Tailwind CSS 4**, responsive
  mobile-first (móvil → iPad → escritorio).
- **Identidad propia**: logo SVG, paleta minimalista (un color de marca, un
  acento, neutros cálidos) con variantes para modo claro y oscuro.
- **Acceso con contraseña** (`SITE_PASSWORD`) sin librerías de terceros: cookie
  de sesión firmada con HMAC mediante Web Crypto.
- **Toggle ES/EN** que cambia *todo* el contenido: teoría, quizzes, ejercicios,
  comentarios del código de partida, soluciones y etiquetas de los diagramas.
- **Editor de Apex propio** con resaltado de sintaxis, números de línea, sangría
  automática, scroll horizontal propio y tipografía de 16 px en móvil (para que
  iOS no haga zoom al enfocar).
- **Autoguardado** del código: `localStorage` con debounce de ~1 s y persistencia
  en Postgres al validar.
- **Validación de ejercicios por reglas declarativas** (viven junto al contenido,
  no en el código de la app) y **retroalimentación cualitativa** que va más allá
  de pass/fail: detecta SOQL/DML en bucles, Ids escritos a mano, falta de
  defensas frente a `null`, nombres pobres…
- **Pistas progresivas de 3 niveles**: zona del error → concepto → pseudocódigo
  parcial. Cada pista se abre solo tras un intento fallido más; la solución
  completa, solo tras las tres pistas.
- **Diagramas SVG responsive** (viewBox relativo, colores por token de tema), al
  menos uno por sub-lección y tres en el checkpoint.
- **Metodología**: active recall (preguntas de respuesta escrita), repetición
  espaciada (preguntas marcadas «Repaso» de sub-lecciones anteriores) e
  interleaving (escenarios que combinan varios conceptos).

---

## Correr el proyecto en local

Requisitos: **Node 18.18+** (probado con Node 22) y npm.

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>. La contraseña por defecto en local es `apex`, y
está en `.env.local`.

> **Sin Node instalado en el sistema (Windows)**
> El CLI de Salesforce trae su propio Node. Desde la carpeta del proyecto:
>
> ```powershell
> & "C:\Program Files\sf\client\bin\node.exe" `
>   "C:\Program Files\sf\client\node_modules\npm\bin\npm-cli.js" install
>
> & "C:\Program Files\sf\client\bin\node.exe" `
>   "C:\Program Files\sf\client\node_modules\npm\bin\npm-cli.js" run dev
> ```
>
> Para instalarlos de forma permanente: `winget install OpenJS.NodeJS.LTS` y
> `winget install Git.Git`.

**Sin base de datos también funciona.** Si no hay `DATABASE_URL`, el progreso se
guarda en `.data/apex-progress.json` (ignorado por git) y en el navegador.

### Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build |
| `npm run db:migrate` | Aplica `db/migrations/*.sql` a Neon |
| `npm run audit:responsive` | Audita la app en 6 tamaños de pantalla (ver abajo) |

---

## Estructura del proyecto

```
src/
  app/
    layout.tsx              raíz: fuentes, tema sin parpadeo, providers
    login/page.tsx          pantalla de acceso
    (app)/
      layout.tsx            shell con sidebar (fija en desktop, drawer en móvil)
      page.tsx              home: módulos + tarjetas de Desafío
      m/[moduleId]/[slug]/  página de sub-lección
      c/[id]/               página de Desafío
    api/
      auth/login|logout/    sesión
      progress/             progreso, borradores e intentos
  components/               UI (editor, quiz, ejercicio, teoría, shell, logo)
  lib/
    types.ts                modelo de contenido y de progreso
    i18n.ts                 textos de la interfaz
    auth.ts                 cookie firmada (Web Crypto)
    db.ts                   Neon + fallback a fichero
    validate.ts             motor de validación de ejercicios
    feedback.ts             motor de retroalimentación cualitativa
    highlight.ts            tokenizador de Apex
  content/
    course.ts               registro del curso y navegación
    challenges.ts           Desafíos 1 y 2
    diagrams.tsx            todos los diagramas SVG
    modules/m01/            una sub-lección por fichero
db/migrations/              esquema SQL
scripts/migrate.mjs         aplicador de migraciones
```

---

## Editar el contenido del curso

Todo el contenido vive como datos tipados, separado de la lógica de la UI. Para
cambiar una sub-lección no hace falta tocar ningún componente: se edita su
fichero en `src/content/modules/m01/`.

Cada texto es un objeto bilingüe `{ es, en }`. Una sub-lección tiene:

```ts
{
  id, slug, n, kind: "lesson" | "checkpoint",
  title, summary, objectives, minutes,
  theory: [ { type: "p" | "h" | "lead" | "code" | "callout" | "table" | "list" | "diagram" | "divider", ... } ],
  quiz:   [ { kind: "single" | "multi" | "text", prompt, options?, answer?, accept?, explain, tags? } ],
  exercise: { prompt, brief[], starter, hints: [1,2,3], solution, checks[], rubric? }
}
```

**Validación de ejercicios.** Cada `check` es una regla declarativa que se
evalúa contra el código del alumno con los comentarios neutralizados, para que
un requisito no pueda «cumplirse» desde un comentario (los literales de texto sí
se conservan, porque muchas comprobaciones buscan un valor concreto):

```ts
{
  id: "l01-c2",
  label: { es: "contactCount es Integer", en: "contactCount is an Integer" },
  rule: { op: "match", pattern: "Integer\\s+contactCount\\s*=\\s*12\\s*;" },
  onFail: { es: "…", en: "…" },   // se muestra como retroalimentación
  optional: false,
}
```

Operadores disponibles: `match`, `absent`, `count` (con `min`/`max`), `all`,
`any`.

**Autodiagnóstico del contenido.** Con el servidor de desarrollo levantado, abre
<http://localhost:3000/api/selftest>. Comprueba, en los dos idiomas, que la
solución de cada ejercicio pasa sus propias validaciones, que el código de
partida *no* las pasa ya, que hay tres pistas y que cada sub-lección tiene al
menos un diagrama. Si añades contenido, este es el primer sitio donde mirar.

**Añadir un módulo nuevo.** Crea `src/content/modules/m02/`, exporta un `Module`
con `status: "ready"` y sus `lessons`, e impórtalo en `src/content/course.ts`
sustituyendo el `planned(...)` correspondiente. La navegación, el progreso, el
sidebar y el desbloqueo de Desafíos se actualizan solos.

**Añadir un diagrama.** Escribe el componente en `src/content/diagrams.tsx`
(recibe `lang` y devuelve SVG con `viewBox`), regístralo en `REGISTRY` y
referencia su id desde el contenido con `{ type: "diagram", id: "…" }`.

---

## Base de datos (Neon)

El esquema está en `db/migrations/0001_init.sql`. Es de un solo usuario: no hay
tabla de usuarios a propósito.

| Tabla | Guarda |
| --- | --- |
| `lesson_progress` | Estado por sub-lección: no iniciado / en progreso / completado, teoría leída, quiz superado y nota, ejercicio superado |
| `quiz_attempts` | Cada respuesta a cada pregunta, con acierto o fallo |
| `quiz_results` | Una fila por quiz completado (nota y total) |
| `exercise_attempts` | Cada validación: código enviado, resultado, pistas usadas y detalle por comprobación |
| `code_drafts` | Autoguardado del editor |
| `challenge_progress` | Estado de los dos Desafíos y componentes superados |

### Provisionar Neon desde el Vercel Marketplace

1. En Vercel, abre tu proyecto → pestaña **Storage** → **Create Database** →
   **Neon** (Marketplace). Elige el plan gratuito y la región más cercana.
2. Vercel crea la base y **añade `DATABASE_URL` a las variables de entorno del
   proyecto** automáticamente (también `DATABASE_URL_UNPOOLED` y similares; este
   proyecto solo usa `DATABASE_URL`).
3. Para aplicar el esquema, copia el valor de `DATABASE_URL` a tu `.env.local` y
   ejecuta:

   ```bash
   npm run db:migrate
   ```

4. Vuelve a desplegar para que la app en Vercel empiece a usar Postgres.

Sin `DATABASE_URL` la app sigue funcionando: guarda el progreso en fichero local
y en el navegador.

---

## Subir a GitHub

```bash
git init
git add .
git commit -m "Apex Academy: base + Módulo 1"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/apex-academy.git
git push -u origin main
```

`.gitignore` ya excluye `node_modules/`, `.next/`, `.data/` y los ficheros
`.env*.local`, así que la contraseña no se sube.

---

## Desplegar en Vercel

1. <https://vercel.com/new> → **Import Git Repository** → elige `apex-academy`.
2. Framework: **Next.js** (se detecta solo). No hace falta tocar los comandos de
   build.
3. Antes de desplegar, en **Environment Variables** añade:
   - `SITE_PASSWORD` → la contraseña con la que entrarás al curso.
   - `AUTH_SECRET` → una cadena larga y aleatoria (opcional pero recomendada).
4. **Deploy**. Con el plan Hobby es suficiente.
5. Añade Neon como en la sección anterior y vuelve a desplegar.

Para cambiar la contraseña más adelante: Vercel → proyecto → **Settings** →
**Environment Variables** → edita `SITE_PASSWORD` → **Redeploy**. Si definiste
`AUTH_SECRET`, las sesiones abiertas siguen siendo válidas; si no, cambiar la
contraseña cierra las sesiones.

---

## Variables de entorno

| Variable | Obligatoria | Para qué |
| --- | --- | --- |
| `SITE_PASSWORD` | Sí | Contraseña de acceso al curso |
| `AUTH_SECRET` | No | Firma de la cookie de sesión; si falta, se usa `SITE_PASSWORD` |
| `DATABASE_URL` | No | Postgres de Neon; sin ella, progreso en fichero local |

---

## Responsive

- **Móvil (< 640 px)**: barra superior con hamburguesa, sidebar en drawer, editor
  a 16 px, diagramas escalados por `viewBox`, bloques de código con scroll
  horizontal propio.
- **Tablet / iPad (640–1024 px)**: rejilla de dos columnas en el home, drawer
  todavía activo, más aire lateral.
- **Escritorio (≥ 1024 px)**: sidebar fija de 264 px, columna de contenido
  limitada a ~68 caracteres para que el texto se lea cómodo.

### Auditoría automática

Con el servidor de desarrollo levantado:

```bash
npm run audit:responsive
```

Abre tu Chrome instalado (vía `playwright-core`, sin descargar navegadores) y
recorre 9 vistas — home, teoría, diagrama, quiz, ejercicio, línea de código
larga, checkpoint, desafío y drawer — en seis perfiles: iPhone 14, Pixel 7,
Android de 360 px, iPad vertical, iPad horizontal y escritorio, más una pasada
en modo oscuro. Comprueba tres cosas y falla si alguna se rompe:

- **desbordamiento horizontal** de la página (con el elemento culpable si lo hay);
- **tamaño de los controles táctiles** (umbral configurable con `TAP_MIN`,
  36 px por defecto);
- **errores de consola**.

Las capturas se guardan en la carpeta que le pases como argumento.
