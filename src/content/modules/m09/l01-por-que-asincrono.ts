import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, a escala
// Tarea 1 de 7: saber en qué transacción estás y cuánto presupuesto tienes.

public class AsyncContext {
    public static Boolean isAsync() {
        return System.isFuture() || System.isQueueable()
            || System.isBatch() || System.isScheduled();
    }

    public static String describe() {
        String mode = isAsync() ? 'asíncrono' : 'síncrono';
        return mode + ' · ' + Limits.getLimitQueries() + ' consultas · '
            + Limits.getLimitCpuTime() + ' ms de CPU';
    }
}

System.debug(AsyncContext.describe());   // síncrono · 100 consultas · 10000 ms de CPU`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, a escala\n// Tarea 1 de 7: saber en qué transacción estás y cuánto presupuesto tienes.",
  "// CASE: the ERP bridge, at scale\n// Task 1 of 7: know which transaction you are in and how much budget you have.",
)
  .replace("'asíncrono' : 'síncrono'", "'asynchronous' : 'synchronous'")
  .replace("' consultas · '", "' queries · '")
  .replace("' ms de CPU'", "' ms of CPU'")
  .replace("// síncrono · 100 consultas · 10000 ms de CPU", "// synchronous · 100 queries · 10000 ms of CPU");

export const l01PorQueAsincrono: Lesson = {
  id: "m09-l01",
  slug: "por-que-asincrono",
  n: 1,
  kind: "lesson",
  minutes: 25,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso del Módulo 8", en: "Remember? · Review of Module 8" },
    prompt: {
      es: "El importador del Módulo 8 revienta con una LimitException a mitad de la noche. ¿La puede capturar un catch?",
      en: "Module 8's importer blows up with a LimitException in the middle of the night. Can a catch trap it?",
    },
    options: [
      { es: "No: un límite superado mata la transacción", en: "No: an exceeded limit kills the transaction" },
      { es: "Sí, con catch (Exception e)", en: "Yes, with catch (Exception e)" },
      { es: "Sí, en el finally", en: "Yes, in the finally" },
    ],
    answer: 0,
    explain: {
      es: "LimitException no se captura. Hoy verás la otra salida: repartir el trabajo en transacciones que tengan más presupuesto o que sean más pequeñas.",
      en: "LimitException cannot be caught. Today you will see the other way out: split the work into transactions that have more budget or are smaller.",
    },
  },
  title: { es: "Por qué existe el asíncrono", en: "Why async exists" },
  summary: {
    es: "Hay trabajo que no cabe en el guardado del usuario: demasiadas filas, una llamada a otro sistema, un proceso nocturno. El código asíncrono se ejecuta más tarde, en su propia transacción y con límites más amplios.",
    en: "Some work does not fit in the user's save: too many rows, a call to another system, a nightly job. Asynchronous code runs later, in its own transaction and with wider limits.",
  },
  analogy: {
    es: "El camino «Run Asynchronously» de un flow",
    en: "A flow's «Run Asynchronously» path",
  },
  objectives: [
    { es: "Explicar qué significa que un código sea asíncrono y cuándo hace falta.", en: "Explain what it means for code to be asynchronous and when it is needed." },
    { es: "Comparar los límites síncronos y asíncronos.", en: "Compare synchronous and asynchronous limits." },
    { es: "Saber en qué contexto se está ejecutando tu código.", en: "Know which context your code is running in." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "El importador del Módulo 8 aguanta 300 filas. Pero el ERP de Northwind acaba de anunciar que la migración del año pasado entra este mes: 300.000 renovaciones. Ninguna bulkificación hace caber eso en una sola transacción. La salida no es hacer el código más rápido: es hacerlo en otro momento.",
        en: "Module 8's importer copes with 300 rows. But Northwind's ERP has just announced that last year's migration comes in this month: 300,000 renewals. No amount of bulkification fits that into one transaction. The way out is not making the code faster: it is running it at another time.",
      },
    },
    {
      type: "h",
      text: { es: "Síncrono y asíncrono", en: "Synchronous and asynchronous" },
    },
    {
      type: "p",
      text: {
        es: "Todo lo que has escrito hasta ahora era síncrono: pasa mientras alguien espera, dentro del mismo guardado. El código [[asincrono|asíncrono]] se deja en una [[cola-apex|cola]] y Salesforce lo ejecuta cuando tiene recursos libres, normalmente segundos después. Corre en su propia transacción, con su propio presupuesto, y el usuario no espera por él.",
        en: "Everything you have written so far was synchronous: it happens while someone waits, inside the same save. [[asincrono|Asynchronous]] code is left in a [[cola-apex|queue]] and Salesforce runs it when it has free resources, usually seconds later. It runs in its own transaction, with its own budget, and the user does not wait for it.",
      },
    },
    {
      type: "diagram",
      id: "m09-sync-async",
      caption: {
        es: "Guarda una renovación en los dos modos y mira quién espera y cuánto presupuesto tiene cada transacción.",
        en: "Save a renewal in both modes and see who waits and how much budget each transaction has.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Tu camino asíncrono de siempre", en: "Your usual asynchronous path" },
      text: {
        es: "Yo lo usaba sin llamarlo así: en un flow desencadenado por registro, el camino «Run Asynchronously» se ejecuta después del guardado, en su propia transacción, y es el único sitio donde el flow puede llamar a un sistema externo. Apex asíncrono es la misma idea, con cuatro herramientas distintas según el trabajo.",
        en: "I used it without calling it that: in a record-triggered flow, the «Run Asynchronously» path runs after the save, in its own transaction, and it is the only place the flow can call an external system. Asynchronous Apex is the same idea, with four different tools depending on the job.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "Por qué lo necesitarás", en: "Why you will need it" },
    },
    {
      type: "table",
      head: [
        { es: "Situación", en: "Situation" },
        { es: "Por qué no cabe en el guardado", en: "Why it does not fit in the save" },
      ],
      rows: [
        [
          { es: "Llamar a otro sistema (el ERP)", en: "Calling another system (the ERP)" },
          { es: "Un trigger no puede esperar a una respuesta externa: Salesforce no permite callouts en ese momento.", en: "A trigger cannot wait for an external response: Salesforce does not allow callouts at that point." },
        ],
        [
          { es: "Procesar cientos de miles de filas", en: "Processing hundreds of thousands of rows" },
          { es: "Ningún presupuesto de una transacción alcanza: hay que trocearlo.", en: "No single transaction's budget is enough: it has to be split up." },
        ],
        [
          { es: "Un proceso cada noche", en: "A nightly process" },
          { es: "Nadie está guardando nada a las 2:00: tiene que arrancar solo.", en: "Nobody is saving anything at 2:00: it has to start on its own." },
        ],
        [
          { es: "Un cálculo pesado tras guardar", en: "A heavy calculation after saving" },
          { es: "El usuario no debería esperar diez segundos para ver su registro guardado.", en: "The user should not wait ten seconds to see their record saved." },
        ],
      ],
    },
    {
      type: "h",
      text: { es: "Más presupuesto, pero no infinito", en: "More budget, but not infinite" },
    },
    {
      type: "table",
      head: [
        { es: "Límite por transacción", en: "Limit per transaction" },
        { es: "Síncrono", en: "Synchronous" },
        { es: "Asíncrono", en: "Asynchronous" },
      ],
      rows: [
        [{ es: "Consultas SOQL", en: "SOQL queries" }, { es: "100", en: "100" }, { es: "200", en: "200" }],
        [{ es: "Tiempo de CPU", en: "CPU time" }, { es: "10 s", en: "10 s" }, { es: "60 s", en: "60 s" }],
        [{ es: "Memoria (heap)", en: "Memory (heap)" }, { es: "6 MB", en: "6 MB" }, { es: "12 MB", en: "12 MB" }],
        [{ es: "Instrucciones DML", en: "DML statements" }, { es: "150", en: "150" }, { es: "150", en: "150" }],
      ],
    },
    {
      type: "p",
      text: {
        es: "Fíjate en la última fila: no todo sube. El asíncrono no te regala una transacción enorme; te regala muchas transacciones, cada una con su presupuesto. Por eso el Batch de la lección 4 no procesa 300.000 filas de golpe, sino en tandas de 200. Y tu código puede preguntar en cuál está: Limits.getLimitQueries() devuelve 100 o 200 según el contexto, y System.isBatch(), System.isFuture()… dicen quién lo está ejecutando.",
        en: "Look at the last row: not everything goes up. Async does not give you one huge transaction; it gives you many transactions, each with its own budget. That is why lesson 4's Batch does not process 300,000 rows at once, but in chunks of 200. And your code can ask which one it is in: Limits.getLimitQueries() returns 100 or 200 depending on the context, and System.isBatch(), System.isFuture()… say who is running it.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Aquí Flow también tiene su camino", en: "Why not a Flow? Here Flow has its path too" },
      text: {
        es: "Con franqueza: para «haz esto después del guardado», el camino asíncrono de un flow basta, y para «cada noche», un flow programado. Donde no llega es a la escala de este módulo. Un flow programado tiene un máximo diario de 250.000 interviews (o 200 por licencia de usuario, si es mayor): las 300.000 renovaciones del ERP no caben en un día. Y no hay forma de encadenar trabajos con estado, ni de elegir el tamaño de cada tanda. Eso es lo que te dan las cuatro herramientas de Apex.",
        en: "Frankly: for «do this after the save», a flow's async path is enough, and for «every night», a scheduled flow. Where it does not reach is this module's scale. A scheduled flow has a daily maximum of 250,000 interviews (or 200 per user licence, if greater): the ERP's 300,000 renewals do not fit in one day. And there is no way to chain jobs with state, or to choose each chunk's size. That is what Apex's four tools give you.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿quién espera cuando el código es asíncrono? ¿Qué límite no cambia entre síncrono y asíncrono? ¿Cómo sabe tu código si lo está ejecutando un Batch?",
        en: "Without looking: who waits when the code is asynchronous? Which limit does not change between sync and async? How does your code know whether a Batch is running it?",
      },
    },
  ],

  quiz: [
    {
      id: "m09-l01-q1",
      kind: "single",
      prompt: { es: "¿Qué significa que un código sea asíncrono?", en: "What does it mean for code to be asynchronous?" },
      options: [
        { es: "Que se ejecuta más tarde, en su propia transacción, sin que el usuario espere", en: "It runs later, in its own transaction, without the user waiting" },
        { es: "Que se ejecuta más rápido", en: "It runs faster" },
        { es: "Que no tiene governor limits", en: "It has no governor limits" },
        { es: "Que se ejecuta en el navegador del usuario", en: "It runs in the user's browser" },
      ],
      answer: 0,
      explain: {
        es: "Asíncrono es «en otro momento y en otra transacción». No es más rápido ni ilimitado: tiene su propio presupuesto, algo más amplio.",
        en: "Asynchronous means «at another time and in another transaction». It is neither faster nor unlimited: it has its own, somewhat wider, budget.",
      },
    },
    {
      id: "m09-l01-q2",
      kind: "multi",
      prompt: { es: "¿Qué límites son más amplios en asíncrono?", en: "Which limits are wider in async?" },
      options: [
        { es: "Consultas SOQL (200 en vez de 100)", en: "SOQL queries (200 instead of 100)" },
        { es: "Tiempo de CPU (60 s en vez de 10 s)", en: "CPU time (60 s instead of 10 s)" },
        { es: "Memoria (12 MB en vez de 6 MB)", en: "Memory (12 MB instead of 6 MB)" },
        { es: "Instrucciones DML (300 en vez de 150)", en: "DML statements (300 instead of 150)" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Consultas, CPU y memoria suben. Las 150 instrucciones DML se quedan igual.",
        en: "Queries, CPU and memory go up. The 150 DML statements stay the same.",
      },
    },
    {
      id: "m09-l01-q3",
      kind: "single",
      prompt: {
        es: "Un trigger after insert necesita avisar al ERP por HTTP. ¿Qué pasa si hace el callout ahí mismo?",
        en: "An after insert trigger needs to notify the ERP over HTTP. What happens if it does the callout right there?",
      },
      options: [
        { es: "Salesforce no lo permite: el callout tiene que ir en código asíncrono", en: "Salesforce does not allow it: the callout has to go in async code" },
        { es: "Funciona, pero más lento", en: "It works, but slower" },
        { es: "Funciona si hay menos de 100 registros", en: "It works if there are fewer than 100 records" },
        { es: "Solo funciona en before insert", en: "It only works in before insert" },
      ],
      answer: 0,
      explain: {
        es: "Un trigger no puede quedarse esperando a otro sistema en mitad del guardado. El callout va en un @future(callout=true) o en un Queueable: es la tarea 2.",
        en: "A trigger cannot wait for another system in the middle of the save. The callout goes in an @future(callout=true) or a Queueable: that is task 2.",
      },
    },
    {
      id: "m09-l01-q4",
      kind: "single",
      prompt: { es: "¿Qué devuelve Limits.getLimitQueries() dentro de un Batch?", en: "What does Limits.getLimitQueries() return inside a Batch?" },
      options: [
        { es: "200", en: "200" },
        { es: "100", en: "100" },
        { es: "Las consultas que llevas gastadas", en: "The queries you have used so far" },
        { es: "Infinito", en: "Infinite" },
      ],
      answer: 0,
      explain: {
        es: "getLimitQueries() es el tope del contexto: 200 en asíncrono. Las gastadas las da getQueries(), del Módulo 4.",
        en: "getLimitQueries() is the context's ceiling: 200 in async. The ones used are given by getQueries(), from Module 4.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m09-l01-q5",
      kind: "text",
      prompt: {
        es: "Escribe la expresión que devuelve true si el código lo está ejecutando un Batch.",
        en: "Write the expression that returns true if a Batch is running the code.",
      },
      accept: ["system\\.isbatch\\(\\s*\\)\\s*;?"],
      placeholder: { es: "System.…", en: "System.…" },
      explain: {
        es: "System.isBatch(). Sus hermanas son System.isFuture(), System.isQueueable() y System.isScheduled().",
        en: "System.isBatch(). Its siblings are System.isFuture(), System.isQueueable() and System.isScheduled().",
      },
      tags: ["recall"],
    },
    {
      id: "m09-l01-q6",
      kind: "single",
      prompt: {
        es: "Repaso: en el importador del Módulo 8, ¿qué te dice cada Database.SaveResult?",
        en: "Review: in Module 8's importer, what does each Database.SaveResult tell you?",
      },
      options: [
        { es: "Si ese registro se guardó y, si no, por qué", en: "Whether that record was saved and, if not, why" },
        { es: "Cuántas consultas llevas", en: "How many queries you have used" },
        { es: "Si la transacción es asíncrona", en: "Whether the transaction is asynchronous" },
        { es: "El Id del trabajo en la cola", en: "The job's Id in the queue" },
      ],
      answer: 0,
      explain: {
        es: "isSuccess() y getErrors(), registro a registro. Lo reutilizarás en el Batch del checkpoint.",
        en: "isSuccess() and getErrors(), record by record. You will reuse it in the checkpoint's Batch.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M8 L6", en: "Review · M8 L6" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 1 DE 7 · Antes de mover 300.000 renovaciones, el equipo quiere que cada pieza del puente pueda decir en qué transacción corre y cuánto presupuesto tiene. Escribe la clase AsyncContext con dos métodos: uno que diga si el código es asíncrono y otro que lo describa en una línea para el log.",
      en: "TASK 1 OF 7 · Before moving 300,000 renewals, the team wants every piece of the bridge to be able to say which transaction it runs in and how much budget it has. Write the AsyncContext class with two methods: one saying whether the code is asynchronous and another describing it in one line for the log.",
    },
    brief: [
      {
        es: "public static Boolean isAsync(): true si lo ejecuta un @future, un Queueable, un Batch o un Scheduled (System.isFuture(), isQueueable(), isBatch(), isScheduled()).",
        en: "public static Boolean isAsync(): true if an @future, a Queueable, a Batch or a Scheduled job runs it (System.isFuture(), isQueueable(), isBatch(), isScheduled()).",
      },
      {
        es: "public static String describe(): el modo ('asíncrono' o 'síncrono', usando isAsync()), el tope de consultas con Limits.getLimitQueries() y el de CPU con Limits.getLimitCpuTime().",
        en: "public static String describe(): the mode ('asynchronous' or 'synchronous', using isAsync()), the query ceiling with Limits.getLimitQueries() and the CPU one with Limits.getLimitCpuTime().",
      },
      {
        es: "Nada de valores escritos a mano: los topes se preguntan a Limits, porque cambian según el contexto.",
        en: "No hand-typed values: the ceilings are asked of Limits, because they change with the context.",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, a escala
// Ya resuelto (Módulo 8): el importador aguanta 300 filas con errores fila a fila.
// Tarea 1 de 7: saber en qué transacción estás y cuánto presupuesto tienes.

public class AsyncContext {
    public static Boolean isAsync() {
        return false;
    }

    public static String describe() {
        return 'síncrono · 100 consultas';
    }
}

System.debug(AsyncContext.describe());
`,
      en: `// CASE: the ERP bridge, at scale
// Already solved (Module 8): the importer copes with 300 rows with row-by-row errors.
// Task 1 of 7: know which transaction you are in and how much budget you have.

public class AsyncContext {
    public static Boolean isAsync() {
        return false;
    }

    public static String describe() {
        return 'synchronous · 100 queries';
    }
}

System.debug(AsyncContext.describe());
`,
    },
    hints: [
      {
        es: "Yo lo pensaría como el camino de un flow: primero, ¿en cuál de los cuatro contextos asíncronos estoy? Después, ¿cuánto presupuesto me da ese contexto?",
        en: "I would think of it like a flow's path: first, which of the four async contexts am I in? Then, how much budget does that context give me?",
      },
      {
        es: "Lo que me ayudó: System.isFuture(), System.isQueueable(), System.isBatch() y System.isScheduled() devuelven Boolean; únelos con ||. Y Limits.getLimitQueries() te da 100 o 200 sin que escribas el número.",
        en: "What helped me: System.isFuture(), System.isQueueable(), System.isBatch() and System.isScheduled() return Boolean; join them with ||. And Limits.getLimitQueries() gives you 100 or 200 without you typing the number.",
      },
      {
        es: "Te dejo el esquema: return System.isFuture() || System.isQueueable() || System.isBatch() || System.isScheduled(); · String mode = isAsync() ? 'asíncrono' : 'síncrono'; return mode + ' · ' + Limits.getLimitQueries() + ' consultas · ' + Limits.getLimitCpuTime() + ' ms de CPU';",
        en: "Here is the outline: return System.isFuture() || System.isQueueable() || System.isBatch() || System.isScheduled(); · String mode = isAsync() ? 'asynchronous' : 'synchronous'; return mode + ' · ' + Limits.getLimitQueries() + ' queries · ' + Limits.getLimitCpuTime() + ' ms of CPU';",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m09-l01-c1",
        label: { es: "isAsync mira los cuatro contextos asíncronos", en: "isAsync checks the four async contexts" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "System\\s*\\.\\s*isFuture\\s*\\(\\s*\\)" },
            { op: "match", pattern: "System\\s*\\.\\s*isQueueable\\s*\\(\\s*\\)" },
            { op: "match", pattern: "System\\s*\\.\\s*isBatch\\s*\\(\\s*\\)" },
            { op: "match", pattern: "System\\s*\\.\\s*isScheduled\\s*\\(\\s*\\)" },
            { op: "absent", pattern: "isAsync\\s*\\(\\s*\\)\\s*\\{\\s*return\\s+false\\s*;" },
          ],
        },
        onFail: {
          es: "isAsync tiene que devolver System.isFuture() || System.isQueueable() || System.isBatch() || System.isScheduled().",
          en: "isAsync has to return System.isFuture() || System.isQueueable() || System.isBatch() || System.isScheduled().",
        },
        otter: {
          es: "Son los cuatro caminos asíncronos de Apex, y System te dice en cuál estás: isFuture(), isQueueable(), isBatch() e isScheduled(). Únelos con || y devuelve el resultado.",
          en: "They are Apex's four async paths, and System tells you which one you are in: isFuture(), isQueueable(), isBatch() and isScheduled(). Join them with || and return the result.",
        },
      },
      {
        id: "m09-l01-c2",
        label: { es: "describe usa isAsync para el modo", en: "describe uses isAsync for the mode" },
        rule: { op: "match", pattern: "describe\\s*\\(\\s*\\)\\s*\\{[\\s\\S]*isAsync\\s*\\(\\s*\\)" },
        onFail: {
          es: "Dentro de describe(), decide el modo llamando a isAsync(): isAsync() ? '…' : '…'.",
          en: "Inside describe(), decide the mode by calling isAsync(): isAsync() ? '…' : '…'.",
        },
        otter: {
          es: "No repitas la lógica: describe() le pregunta a isAsync() y elige el texto con el operador condicional, como un IF() de fórmula.",
          en: "Do not repeat the logic: describe() asks isAsync() and picks the text with the conditional operator, like a formula IF().",
        },
      },
      {
        id: "m09-l01-c3",
        label: { es: "Los topes se preguntan a Limits", en: "The ceilings are asked of Limits" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Limits\\s*\\.\\s*getLimitQueries\\s*\\(\\s*\\)" },
            { op: "match", pattern: "Limits\\s*\\.\\s*getLimitCpuTime\\s*\\(\\s*\\)" },
            { op: "absent", pattern: "'[^']*\\b100\\b[^']*'" },
          ],
        },
        onFail: {
          es: "Usa Limits.getLimitQueries() y Limits.getLimitCpuTime() en el texto, sin escribir 100 a mano.",
          en: "Use Limits.getLimitQueries() and Limits.getLimitCpuTime() in the text, without typing 100 by hand.",
        },
        otter: {
          es: "El 100 escrito a mano miente en cuanto el código corre en un Batch, donde el tope es 200. Pregúntaselo a Limits: getLimitQueries() y getLimitCpuTime().",
          en: "A hand-typed 100 lies as soon as the code runs in a Batch, where the ceiling is 200. Ask Limits: getLimitQueries() and getLimitCpuTime().",
        },
      },
    ],
    rubric: [
      {
        es: "Si llamas a describe() desde el Batch de la lección 4, ¿qué imprimirá? ¿Y desde Execute Anonymous?",
        en: "If you call describe() from lesson 4's Batch, what will it print? And from Execute Anonymous?",
      },
    ],
    voice: "otter",
    outro: {
      es: "Tu código ya sabe dónde corre y con qué presupuesto. En la tarea 2 das el primer paso fuera del guardado: avisar al ERP de cada renovación nueva sin que el trigger tenga que esperar.",
      en: "Your code now knows where it runs and with what budget. In task 2 you take the first step outside the save: notifying the ERP of every new renewal without the trigger having to wait.",
    },
  },
};
