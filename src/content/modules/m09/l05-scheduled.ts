import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, a escala
// Tarea 5 de 7: que la migración arranque sola, a las 2:00 de lunes a viernes.

public class RenewalMigrationScheduler implements Schedulable {
    public void execute(SchedulableContext sc) {
        Database.executeBatch(new RenewalMigrationBatch(), 200);
    }
}

// Se programa una sola vez, desde Execute Anonymous:
String cron = '0 0 2 ? * MON-FRI';   // segundos minutos horas día-del-mes mes día-de-la-semana
Id jobId = System.schedule('Migración ERP · noches laborables', cron, new RenewalMigrationScheduler());`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, a escala\n// Tarea 5 de 7: que la migración arranque sola, a las 2:00 de lunes a viernes.",
  "// CASE: the ERP bridge, at scale\n// Task 5 of 7: make the migration start on its own, at 2:00 Monday to Friday.",
)
  .replace("// Se programa una sola vez, desde Execute Anonymous:", "// It is scheduled once, from Execute Anonymous:")
  .replace("// segundos minutos horas día-del-mes mes día-de-la-semana", "// seconds minutes hours day-of-month month day-of-week")
  .replace("'Migración ERP · noches laborables'", "'ERP migration · weeknights'");

export const l05Scheduled: Lesson = {
  id: "m09-l05",
  slug: "scheduled",
  n: 5,
  kind: "lesson",
  minutes: 25,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 4", en: "Remember? · Review of lesson 4" },
    prompt: {
      es: "¿Qué línea lanza el Batch de la migración en tandas de 200?",
      en: "Which line launches the migration Batch in chunks of 200?",
    },
    options: [
      { es: "Database.executeBatch(new RenewalMigrationBatch(), 200);", en: "Database.executeBatch(new RenewalMigrationBatch(), 200);" },
      { es: "System.enqueueJob(new RenewalMigrationBatch());", en: "System.enqueueJob(new RenewalMigrationBatch());" },
      { es: "RenewalMigrationBatch.start(200);", en: "RenewalMigrationBatch.start(200);" },
    ],
    answer: 0,
    explain: {
      es: "Database.executeBatch con el tamaño de tanda. Hoy esa línea deja de escribirla una persona cada mañana.",
      en: "Database.executeBatch with the chunk size. Today that line stops being typed by a person every morning.",
    },
  },
  title: { es: "Scheduled Apex", en: "Scheduled Apex" },
  summary: {
    es: "Una clase Schedulable se ejecuta sola, cuando dice una expresión cron: a las 2:00 de lunes a viernes, el último día del mes o cuando necesites. Casi siempre, lo que hace es lanzar un Batch o un Queueable.",
    en: "A Schedulable class runs on its own, when a cron expression says so: at 2:00 Monday to Friday, on the last day of the month or whenever you need. Almost always, what it does is launch a Batch or a Queueable.",
  },
  analogy: {
    es: "Un flow programado, con toda la precisión que quieras",
    en: "A scheduled flow, with as much precision as you want",
  },
  objectives: [
    { es: "Escribir una clase Schedulable que lance un Batch.", en: "Write a Schedulable class that launches a Batch." },
    { es: "Leer y escribir una expresión cron.", en: "Read and write a cron expression." },
    { es: "Programarla con System.schedule y encontrarla en Setup.", en: "Schedule it with System.schedule and find it in Setup." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "La migración ya es un Batch, pero cada mañana alguien del equipo abre Execute Anonymous y lo lanza a mano. El día que esa persona se va de vacaciones, la migración se para. Northwind quiere que arranque sola, de noche, cuando nadie usa la org.",
        en: "The migration is now a Batch, but every morning someone on the team opens Execute Anonymous and launches it by hand. The day that person goes on holiday, the migration stops. Northwind wants it to start on its own, at night, when nobody uses the org.",
      },
    },
    {
      type: "h",
      text: { es: "Una interfaz más, un execute más", en: "One more interface, one more execute" },
    },
    {
      type: "code",
      code: {
        es: `public class RenewalMigrationScheduler implements Schedulable {
    public void execute(SchedulableContext sc) {
        Database.executeBatch(new RenewalMigrationBatch(), 200);   // lo pesado, en el Batch
    }
}

System.schedule('Migración ERP · noches laborables', '0 0 2 ? * MON-FRI', new RenewalMigrationScheduler());`,
        en: `public class RenewalMigrationScheduler implements Schedulable {
    public void execute(SchedulableContext sc) {
        Database.executeBatch(new RenewalMigrationBatch(), 200);   // the heavy work, in the Batch
    }
}

System.schedule('ERP migration · weeknights', '0 0 2 ? * MON-FRI', new RenewalMigrationScheduler());`,
      },
      caption: {
        es: "System.schedule recibe tres cosas: un nombre para el trabajo, la expresión cron y la instancia que se ejecutará.",
        en: "System.schedule takes three things: a name for the job, the cron expression and the instance to run.",
      },
    },
    {
      type: "p",
      text: {
        es: "El Schedulable es solo el despertador: su execute debería hacer poco y lanzar el trabajo de verdad, normalmente un Batch o un Queueable. Así lo pesado corre con sus propias tandas y su propio presupuesto. Si además necesitas llamar a otro sistema, tampoco se hace aquí directamente: se lanza un @future(callout=true) o un Queueable que lo haga.",
        en: "The Schedulable is just the alarm clock: its execute should do little and launch the real work, usually a Batch or a Queueable. That way the heavy work runs with its own chunks and budget. And if you need to call another system, that is not done here directly either: you launch an @future(callout=true) or a Queueable that does it.",
      },
    },
    {
      type: "h",
      text: { es: "La expresión cron: siete posiciones", en: "The cron expression: seven positions" },
    },
    {
      type: "p",
      text: {
        es: "Una [[cron|expresión cron]] se lee de izquierda a derecha: segundos, minutos, horas, día del mes, mes, día de la semana y, opcional, año. El asterisco significa «todos». Y una regla de Salesforce: día del mes y día de la semana no pueden ir los dos fijados; en uno de ellos va un interrogante, «me da igual».",
        en: "A [[cron|cron expression]] reads left to right: seconds, minutes, hours, day of month, month, day of week and, optionally, year. The asterisk means «all». And one Salesforce rule: day of month and day of week cannot both be set; one of them takes a question mark, «I do not care».",
      },
    },
    {
      type: "diagram",
      id: "m09-cron",
      caption: {
        es: "Elige cuándo tiene que arrancar el trabajo y mira cómo se escribe la expresión, posición a posición.",
        en: "Choose when the job has to start and see how the expression is written, position by position.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Dónde se ve y cómo se para", en: "Where you see it and how to stop it" },
      text: {
        es: "Setup → Scheduled Jobs lista los trabajos programados, con su próxima ejecución, y desde ahí se eliminan. También puedes programar una clase sin código en Setup → Apex Classes → Schedule Apex, aunque ahí solo eliges días y una hora. La org admite como mucho 100 trabajos de Apex programados a la vez.",
        en: "Setup → Scheduled Jobs lists the scheduled jobs, with their next run, and you delete them from there. You can also schedule a class without code in Setup → Apex Classes → Schedule Apex, although there you only pick days and an hour. The org allows at most 100 scheduled Apex jobs at once.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque un flow programado no lanza tu Batch", en: "Why not a Flow? Because a scheduled flow does not launch your Batch" },
      text: {
        es: "Un flow programado arranca a una hora, con frecuencia única, diaria o semanal; para saltarte el fin de semana basta una Decision que mire el día. Hasta ahí, Flow llega. Pero no hay ningún elemento que lance un Batch de Apex: haría falta una acción escrita en Apex solo para eso. Y hay horarios que su frecuencia no expresa, como «el último día de cada mes», que en cron es una L en el día del mes.",
        en: "A scheduled flow starts at a set time, with a once, daily or weekly frequency; to skip the weekend a Decision checking the day is enough. Up to there, Flow gets there. But there is no element that launches an Apex Batch: you would need an action written in Apex just for that. And some schedules its frequency cannot express, like «the last day of every month», which in cron is an L in the day of month.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué hace normalmente el execute de un Schedulable? ¿Qué significan las posiciones de '0 0 2 ? * MON-FRI'? ¿Por qué hay un interrogante?",
        en: "Without looking: what does a Schedulable's execute usually do? What do the positions of '0 0 2 ? * MON-FRI' mean? Why is there a question mark?",
      },
    },
  ],

  quiz: [
    {
      id: "m09-l05-q1",
      kind: "single",
      prompt: { es: "¿Qué significa '0 30 6 ? * SAT'?", en: "What does '0 30 6 ? * SAT' mean?" },
      options: [
        { es: "Los sábados a las 6:30", en: "Saturdays at 6:30" },
        { es: "Cada 30 minutos los sábados", en: "Every 30 minutes on Saturdays" },
        { es: "El día 6 de cada mes a las 00:30", en: "The 6th of every month at 00:30" },
        { es: "Todos los días a las 6:30", en: "Every day at 6:30" },
      ],
      answer: 0,
      explain: {
        es: "Segundos 0, minutos 30, horas 6, día del mes «me da igual», todos los meses, sábado.",
        en: "Seconds 0, minutes 30, hours 6, day of month «I do not care», every month, Saturday.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m09-l05-q2",
      kind: "single",
      prompt: {
        es: "¿Por qué el execute de un Schedulable suele limitarse a lanzar un Batch?",
        en: "Why does a Schedulable's execute usually just launch a Batch?",
      },
      options: [
        {
          es: "Porque así el trabajo pesado corre en tandas, con su propio presupuesto, y el programador solo hace de despertador",
          en: "Because that way the heavy work runs in chunks, with its own budget, and the scheduler just acts as the alarm clock",
        },
        { es: "Porque un Schedulable no puede hacer DML", en: "Because a Schedulable cannot do DML" },
        { es: "Porque es obligatorio", en: "Because it is mandatory" },
        { es: "Porque un Schedulable no tiene límites", en: "Because a Schedulable has no limits" },
      ],
      answer: 0,
      explain: {
        es: "Un Schedulable puede hacer DML, pero su execute es una sola transacción: para muchos registros, mejor que lance un Batch.",
        en: "A Schedulable can do DML, but its execute is a single transaction: for many records, better to launch a Batch.",
      },
    },
    {
      id: "m09-l05-q3",
      kind: "single",
      prompt: { es: "¿Qué falla en '0 0 2 1 * MON'?", en: "What is wrong with '0 0 2 1 * MON'?" },
      options: [
        {
          es: "Fija a la vez el día del mes (1) y el día de la semana (MON): uno de los dos tiene que ser ?",
          en: "It sets both the day of month (1) and the day of week (MON): one of the two must be ?",
        },
        { es: "Falta el año", en: "The year is missing" },
        { es: "Las 2 tendría que escribirse 02", en: "The 2 should be written 02" },
        { es: "Nada, es válido", en: "Nothing, it is valid" },
      ],
      answer: 0,
      explain: {
        es: "Es la regla del interrogante. El año es opcional y las horas se escriben sin cero delante.",
        en: "It is the question-mark rule. The year is optional and hours are written without a leading zero.",
      },
      tags: ["find-error"],
    },
    {
      id: "m09-l05-q4",
      kind: "text",
      prompt: {
        es: "Escribe la expresión cron para «todos los días a las 23:00».",
        en: "Write the cron expression for «every day at 23:00».",
      },
      accept: ["'?0 0 23 \\* \\* \\?'?", "'?0 0 23 \\? \\* \\*'?"],
      placeholder: { es: "0 …", en: "0 …" },
      explain: {
        es: "'0 0 23 * * ?': todos los días del mes y el día de la semana, «me da igual».",
        en: "'0 0 23 * * ?': every day of the month and the day of week, «I do not care».",
      },
      tags: ["recall"],
    },
    {
      id: "m09-l05-q5",
      kind: "single",
      prompt: {
        es: "Tu Schedulable necesita avisar al ERP por HTTP. ¿Dónde va el callout?",
        en: "Your Schedulable needs to notify the ERP over HTTP. Where does the callout go?",
      },
      options: [
        { es: "En un @future(callout=true) o un Queueable que el Schedulable lanza", en: "In an @future(callout=true) or a Queueable the Schedulable launches" },
        { es: "Directamente en el execute del Schedulable", en: "Directly in the Schedulable's execute" },
        { es: "En el constructor del Schedulable", en: "In the Schedulable's constructor" },
        { es: "En un trigger", en: "In a trigger" },
      ],
      answer: 0,
      explain: {
        es: "Un Schedulable no hace callouts directamente: los delega en un trabajo que sí puede, como el ErpNotifier de la tarea 2.",
        en: "A Schedulable does not make callouts directly: it delegates them to a job that can, like task 2's ErpNotifier.",
      },
    },
    {
      id: "m09-l05-q6",
      kind: "single",
      prompt: {
        es: "Repaso: en un Batch, ¿qué método se ejecuta una sola vez al final?",
        en: "Review: in a Batch, which method runs only once, at the end?",
      },
      options: [
        { es: "finish", en: "finish" },
        { es: "execute", en: "execute" },
        { es: "start", en: "start" },
        { es: "schedule", en: "schedule" },
      ],
      answer: 0,
      explain: {
        es: "finish, cuando no quedan tandas. Es el sitio del resumen, o de lanzar el siguiente trabajo, como verás en el checkpoint.",
        en: "finish, when no chunks remain. It is the place for the summary, or for launching the next job, as you will see in the checkpoint.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M9 L4", en: "Review · M9 L4" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 5 DE 7 · Hoy alguien lanza la migración a mano cada mañana. Escribe el programador que la lanza solo, a las 2:00 de lunes a viernes, y prográmalo una vez.",
      en: "TASK 5 OF 7 · Today someone launches the migration by hand every morning. Write the scheduler that launches it on its own, at 2:00 Monday to Friday, and schedule it once.",
    },
    brief: [
      {
        es: "public class RenewalMigrationScheduler implements Schedulable, con public void execute(SchedulableContext sc).",
        en: "public class RenewalMigrationScheduler implements Schedulable, with public void execute(SchedulableContext sc).",
      },
      {
        es: "El execute solo lanza el Batch de la tarea 4: Database.executeBatch(new RenewalMigrationBatch(), 200).",
        en: "The execute only launches task 4's Batch: Database.executeBatch(new RenewalMigrationBatch(), 200).",
      },
      {
        es: "Prográmalo con System.schedule: un nombre, la expresión cron de «a las 2:00, de lunes a viernes» y una instancia del programador.",
        en: "Schedule it with System.schedule: a name, the cron expression for «at 2:00, Monday to Friday» and an instance of the scheduler.",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, a escala
// Ya resuelto (tareas 1-4): la migración es un Batch con estado, en tandas de 200.
// Tarea 5 de 7: que la migración arranque sola, a las 2:00 de lunes a viernes.

// Hoy, alguien del equipo pega esto cada mañana en Execute Anonymous:
Database.executeBatch(new RenewalMigrationBatch(), 200);
`,
      en: `// CASE: the ERP bridge, at scale
// Already solved (tasks 1-4): the migration is a stateful Batch, in chunks of 200.
// Task 5 of 7: make the migration start on its own, at 2:00 Monday to Friday.

// Today, someone on the team pastes this every morning into Execute Anonymous:
Database.executeBatch(new RenewalMigrationBatch(), 200);
`,
    },
    hints: [
      {
        es: "Yo lo pensaría como un flow programado: la frecuencia va en un sitio (la expresión cron) y lo que se hace, en otro (el execute). Y lo que se hace ya lo tienes escrito.",
        en: "I would think of it as a scheduled flow: the frequency goes in one place (the cron expression) and what is done, in another (the execute). And what is done you already have written.",
      },
      {
        es: "Lo que me ayudó: la línea que se pega cada mañana es exactamente el cuerpo del execute. Y la expresión se escribe posición a posición: 0 segundos, 0 minutos, 2 horas, ? día del mes, * mes, MON-FRI.",
        en: "What helped me: the line pasted every morning is exactly the execute's body. And the expression is written position by position: 0 seconds, 0 minutes, 2 hours, ? day of month, * month, MON-FRI.",
      },
      {
        es: "Te dejo el esquema: public class RenewalMigrationScheduler implements Schedulable { public void execute(SchedulableContext sc) { Database.executeBatch(new RenewalMigrationBatch(), 200); } } · System.schedule('…', '0 0 2 ? * MON-FRI', new RenewalMigrationScheduler());",
        en: "Here is the outline: public class RenewalMigrationScheduler implements Schedulable { public void execute(SchedulableContext sc) { Database.executeBatch(new RenewalMigrationBatch(), 200); } } · System.schedule('…', '0 0 2 ? * MON-FRI', new RenewalMigrationScheduler());",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m09-l05-c1",
        label: { es: "La clase implementa Schedulable", en: "The class implements Schedulable" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "class\\s+RenewalMigrationScheduler\\s+implements\\s+Schedulable\\b" },
            { op: "match", pattern: "public\\s+void\\s+execute\\s*\\(\\s*SchedulableContext\\s+\\w+\\s*\\)" },
          ],
        },
        onFail: {
          es: "public class RenewalMigrationScheduler implements Schedulable { public void execute(SchedulableContext sc) { … } }",
          en: "public class RenewalMigrationScheduler implements Schedulable { public void execute(SchedulableContext sc) { … } }",
        },
        otter: {
          es: "Otro contrato de la plataforma, como Queueable: implements Schedulable y un único método, public void execute(SchedulableContext sc).",
          en: "Another platform contract, like Queueable: implements Schedulable and a single method, public void execute(SchedulableContext sc).",
        },
      },
      {
        id: "m09-l05-c2",
        label: { es: "El execute lanza el Batch", en: "The execute launches the Batch" },
        rule: {
          op: "match",
          pattern: "execute\\s*\\(\\s*SchedulableContext\\s+\\w+\\s*\\)\\s*\\{[^}]*Database\\s*\\.\\s*executeBatch\\s*\\(\\s*new\\s+RenewalMigrationBatch\\s*\\(\\s*\\)\\s*,\\s*\\d+\\s*\\)",
        },
        onFail: {
          es: "Dentro del execute: Database.executeBatch(new RenewalMigrationBatch(), 200);",
          en: "Inside the execute: Database.executeBatch(new RenewalMigrationBatch(), 200);",
        },
        otter: {
          es: "El execute es el despertador: la misma línea que alguien pegaba cada mañana, Database.executeBatch(new RenewalMigrationBatch(), 200), ahora dentro.",
          en: "The execute is the alarm clock: the same line someone pasted every morning, Database.executeBatch(new RenewalMigrationBatch(), 200), now inside.",
        },
      },
      {
        id: "m09-l05-c3",
        label: { es: "Se programa a las 2:00 de lunes a viernes", en: "It is scheduled at 2:00 Monday to Friday" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "System\\s*\\.\\s*schedule\\s*\\(\\s*'[^']+'\\s*,\\s*(\\w+|'[^']*')\\s*,\\s*new\\s+RenewalMigrationScheduler\\s*\\(\\s*\\)\\s*\\)" },
            { op: "match", pattern: "'0\\s+0\\s+2\\s+\\?\\s+\\*\\s+(MON-FRI|2-6)(\\s+\\*)?'" },
          ],
        },
        onFail: {
          es: "System.schedule('un nombre', '0 0 2 ? * MON-FRI', new RenewalMigrationScheduler());",
          en: "System.schedule('a name', '0 0 2 ? * MON-FRI', new RenewalMigrationScheduler());",
        },
        otter: {
          es: "La frecuencia, posición a posición: 0 segundos, 0 minutos, 2 horas, ? en el día del mes (porque fijas el de la semana), * todos los meses y MON-FRI. System.schedule('…', '0 0 2 ? * MON-FRI', new RenewalMigrationScheduler());",
          en: "The frequency, position by position: 0 seconds, 0 minutes, 2 hours, ? in the day of month (because you set the day of week), * every month and MON-FRI. System.schedule('…', '0 0 2 ? * MON-FRI', new RenewalMigrationScheduler());",
        },
      },
    ],
    rubric: [
      {
        es: "Si el Batch de una noche tarda más de 24 horas, ¿qué pasa al día siguiente a las 2:00? ¿Cómo lo comprobarías antes de lanzar otro?",
        en: "If one night's Batch takes more than 24 hours, what happens the next day at 2:00? How would you check before launching another?",
      },
    ],
    voice: "otter",
    outro: {
      es: "La migración ya arranca sola cada noche laborable. Tienes las cuatro herramientas; en la tarea 6 toca elegir bien entre ellas, empezando por el @future de la tarea 2, que se ha quedado corto.",
      en: "The migration now starts on its own every weeknight. You have the four tools; in task 6 it is time to choose well among them, starting with task 2's @future, which has fallen short.",
    },
  },
};
