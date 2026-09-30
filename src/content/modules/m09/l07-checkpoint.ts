import type { Lesson } from "@/lib/types";

const REPORT_ES = `// Ya existe: manda al ERP el resumen de la noche
public class ErpNightlyReport implements Queueable, Database.AllowsCallouts {
    private Integer synced;
    private Integer failed;
    public ErpNightlyReport(Integer synced, Integer failed) {
        this.synced = synced;
        this.failed = failed;
    }
    public void execute(QueueableContext ctx) {
        // … llamada al ERP con el resumen
    }
}`;

const REPORT_EN = REPORT_ES.replace("// Ya existe: manda al ERP el resumen de la noche", "// Already exists: sends the night's summary to the ERP").replace(
  "// … llamada al ERP con el resumen",
  "// … call to the ERP with the summary",
);

const SOLUTION_ES = `// CASO: el puente con el ERP, a escala
// Tarea 7 de 7 · La entrega: la sincronización nocturna completa.

${REPORT_ES}

// 1. El Batch: recorre las renovaciones pendientes de enviar
public class ErpNightlySyncBatch implements Database.Batchable<sObject>, Database.Stateful, Database.AllowsCallouts {
    private Integer synced = 0;
    private Integer failed = 0;

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator(
            'SELECT Id, Name, Amount, Account.ERP_Code__c FROM Opportunity ' +
            'WHERE Type = \\'Renewal\\' AND ERP_Synced__c = false'
        );
    }

    public void execute(Database.BatchableContext bc, List<Opportunity> scope) {
        // Primero la llamada con toda la tanda…
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:ERP/renewals');
        req.setMethod('POST');
        req.setBody(JSON.serialize(scope));
        http.send(req);

        // …después el guardado parcial, contando cada resultado
        for (Opportunity o : scope) {
            o.ERP_Synced__c = true;
        }
        for (Database.SaveResult sr : Database.update(scope, false)) {
            if (sr.isSuccess()) {
                synced++;
            } else {
                failed++;
            }
        }
    }

    public void finish(Database.BatchableContext bc) {
        System.enqueueJob(new ErpNightlyReport(synced, failed));
    }
}

// 2. El despertador
public class ErpNightlySyncScheduler implements Schedulable {
    public void execute(SchedulableContext sc) {
        Database.executeBatch(new ErpNightlySyncBatch(), 100);
    }
}

// 3. Se programa una vez
System.schedule('Sincronización ERP · noches laborables', '0 0 2 ? * MON-FRI', new ErpNightlySyncScheduler());`;

const SOLUTION_EN = SOLUTION_ES.replace(REPORT_ES, REPORT_EN)
  .replace(
    "// CASO: el puente con el ERP, a escala\n// Tarea 7 de 7 · La entrega: la sincronización nocturna completa.",
    "// CASE: the ERP bridge, at scale\n// Task 7 of 7 · The delivery: the full nightly sync.",
  )
  .replace("// 1. El Batch: recorre las renovaciones pendientes de enviar", "// 1. The Batch: walks the renewals still to be sent")
  .replace("// Primero la llamada con toda la tanda…", "// First the call with the whole chunk…")
  .replace("// …después el guardado parcial, contando cada resultado", "// …then the partial save, counting each result")
  .replace("// 2. El despertador", "// 2. The alarm clock")
  .replace("// 3. Se programa una vez", "// 3. Scheduled once")
  .replace("'Sincronización ERP · noches laborables'", "'ERP sync · weeknights'");

export const l07Checkpoint: Lesson = {
  id: "m09-l07",
  slug: "checkpoint",
  n: 7,
  kind: "checkpoint",
  minutes: 50,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 6", en: "Remember? · Review of lesson 6" },
    prompt: {
      es: "En un mismo execute tienes que llamar al ERP y guardar. ¿En qué orden?",
      en: "In the same execute you have to call the ERP and save. In which order?",
    },
    options: [
      { es: "Primero la llamada, después el guardado", en: "First the call, then the save" },
      { es: "Primero el guardado, después la llamada", en: "First the save, then the call" },
      { es: "Da igual", en: "It does not matter" },
    ],
    answer: 0,
    explain: {
      es: "Con un DML pendiente, Salesforce ya no deja llamar fuera. Hoy lo aplicas dentro de cada tanda de un Batch.",
      en: "With a DML pending, Salesforce no longer lets you call out. Today you apply it inside each chunk of a Batch.",
    },
  },
  title: { es: "Checkpoint del Módulo 9", en: "Module 9 checkpoint" },
  summary: {
    es: "La entrega: la sincronización nocturna con el ERP. Un programador que despierta a las 2:00, un Batch que envía las renovaciones pendientes tanda a tanda y cuenta los resultados, y un Queueable que manda el resumen al terminar.",
    en: "The delivery: the nightly sync with the ERP. A scheduler that wakes at 2:00, a Batch that sends the pending renewals chunk by chunk and counts the results, and a Queueable that sends the summary at the end.",
  },
  analogy: {
    es: "Un flow programado, un Data Loader y un correo de resumen, encadenados sin nadie delante",
    en: "A scheduled flow, a Data Loader and a summary email, chained with nobody at the keyboard",
  },
  objectives: [
    { es: "Combinar Scheduled, Batch y Queueable en un solo proceso.", en: "Combine Scheduled, Batch and Queueable in a single process." },
    { es: "Hacer callouts desde un Batch con Database.AllowsCallouts.", en: "Make callouts from a Batch with Database.AllowsCallouts." },
    { es: "Contar resultados entre tandas y lanzar el siguiente paso desde finish.", en: "Count results across chunks and launch the next step from finish." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Seis tareas preparando piezas. La última pide juntarlas: cada noche laborable, todas las renovaciones que el ERP todavía no tiene se le envían por tandas, cada una se marca como enviada, y al terminar el ERP recibe un resumen de cuántas entraron y cuántas fallaron.",
        en: "Six tasks preparing pieces. The last one asks you to put them together: every weeknight, all the renewals the ERP does not have yet are sent to it in chunks, each one is marked as sent, and at the end the ERP gets a summary of how many got in and how many failed.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Pieza", en: "Piece" },
        { es: "Qué hace en la entrega", en: "What it does in the delivery" },
        { es: "Tarea", en: "Task" },
      ],
      rows: [
        [{ es: "Scheduled", en: "Scheduled" }, { es: "Despierta a las 2:00 y lanza el Batch.", en: "Wakes at 2:00 and launches the Batch." }, { es: "5", en: "5" }],
        [{ es: "Batch + Stateful", en: "Batch + Stateful" }, { es: "Recorre las pendientes en tandas y cuenta resultados.", en: "Walks the pending ones in chunks and counts results." }, { es: "4", en: "4" }],
        [{ es: "Database.AllowsCallouts", en: "Database.AllowsCallouts" }, { es: "Deja al Batch llamar al ERP en cada tanda.", en: "Lets the Batch call the ERP in each chunk." }, { es: "6", en: "6" }],
        [{ es: "Queueable desde finish", en: "Queueable from finish" }, { es: "Envía el resumen cuando no quedan tandas.", en: "Sends the summary when no chunks remain." }, { es: "3 y 6", en: "3 and 6" }],
        [{ es: "Database.update(…, false)", en: "Database.update(…, false)" }, { es: "Una renovación que no se puede guardar no frena a las demás.", en: "A renewal that cannot be saved does not hold back the others." }, { es: "Módulo 8", en: "Module 8" }],
      ],
    },
    {
      type: "diagram",
      id: "m09-cp-pipeline",
      caption: {
        es: "Sigue una noche entera: del despertador a las tandas, y de finish al resumen.",
        en: "Follow a whole night: from the alarm clock to the chunks, and from finish to the summary.",
      },
    },
    {
      type: "p",
      text: {
        es: "Dos decisiones merecen atención. El tamaño de tanda es 100, no 200: cada tanda hace una llamada con todas sus renovaciones, y el ERP acepta como mucho 100 por petición. Y el callout va antes del Database.update, por la regla de la tarea 6. Si el ERP falla, la excepción deshace solo esa tanda, que seguirá pendiente (ERP_Synced__c = false) y entrará la noche siguiente.",
        en: "Two decisions deserve attention. The chunk size is 100, not 200: each chunk makes one call with all its renewals, and the ERP accepts at most 100 per request. And the callout goes before the Database.update, by task 6's rule. If the ERP fails, the exception rolls back only that chunk, which stays pending (ERP_Synced__c = false) and goes in the next night.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque son tres flows que no se hablan", en: "Why not a Flow? Because they are three flows that do not talk" },
      text: {
        es: "El equipo lo pintó primero con clics: un flow programado sobre las renovaciones pendientes, con una acción HTTP Callout por interview. Tres problemas. El tope de 250.000 interviews al día para toda la org. Una petición por renovación, cuando el ERP pide tandas de 100. Y el resumen: cada interview es independiente, así que no hay un contador común para decir «entraron 9.800, fallaron 12». Con Stateful, el Batch lleva esa cuenta y en finish la entrega.",
        en: "The team sketched it first with clicks: a scheduled flow on the pending renewals, with an HTTP Callout action per interview. Three problems. The cap of 250,000 interviews a day for the whole org. One request per renewal, when the ERP asks for chunks of 100. And the summary: each interview is independent, so there is no shared counter to say «9,800 got in, 12 failed». With Stateful, the Batch keeps that count and hands it over in finish.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "Lo que viene: el Módulo 10", en: "What comes next: Module 10" },
    },
    {
      type: "p",
      text: {
        es: "Todo este módulo ha supuesto que el código funciona. ¿Cómo lo demuestras antes de desplegarlo? Con tests. Y el asíncrono tiene truco: Test.startTest() y Test.stopTest() hacen que los trabajos encolados se ejecuten al momento, para poder comprobar su resultado. Es el Módulo 10, y sin él nada de esto llega a producción.",
        en: "This whole module has assumed the code works. How do you prove it before deploying? With tests. And async has a trick: Test.startTest() and Test.stopTest() make enqueued jobs run right away, so you can check their result. That is Module 10, and without it none of this reaches production.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes del quiz", en: "Before the quiz" },
      text: {
        es: "Sin mirar: ¿qué pieza despierta, cuál recorre y cuál envía el resumen? ¿Por qué el Batch necesita Stateful y AllowsCallouts? ¿Qué le pasa a una tanda si el ERP falla?",
        en: "Without looking: which piece wakes up, which walks the records and which sends the summary? Why does the Batch need Stateful and AllowsCallouts? What happens to a chunk if the ERP fails?",
      },
    },
  ],

  quiz: [
    {
      id: "m09-cp-q1",
      kind: "single",
      prompt: {
        es: "¿Por qué el Batch de la entrega lleva Database.AllowsCallouts?",
        en: "Why does the delivery's Batch carry Database.AllowsCallouts?",
      },
      options: [
        { es: "Porque cada tanda llama al ERP", en: "Because each chunk calls the ERP" },
        { es: "Porque finish encola un Queueable", en: "Because finish enqueues a Queueable" },
        { es: "Porque lo lanza un Schedulable", en: "Because a Schedulable launches it" },
        { es: "Porque hace DML", en: "Because it does DML" },
      ],
      answer: 0,
      explain: {
        es: "Sin esa interfaz, el http.send de execute fallaría. Encolar o hacer DML no la necesita.",
        en: "Without that interface, execute's http.send would fail. Enqueueing or DML does not need it.",
      },
    },
    {
      id: "m09-cp-q2",
      kind: "single",
      prompt: {
        es: "La tanda 7 recibe un error del ERP y lanza una excepción. ¿Qué pasa con sus renovaciones?",
        en: "Chunk 7 gets an error from the ERP and throws an exception. What happens to its renewals?",
      },
      options: [
        {
          es: "Esa tanda se deshace: siguen con ERP_Synced__c = false y entrarán la noche siguiente",
          en: "That chunk is rolled back: they keep ERP_Synced__c = false and go in the next night",
        },
        { es: "Se deshace todo el Batch", en: "The whole Batch is rolled back" },
        { es: "Se marcan como enviadas igualmente", en: "They are marked as sent anyway" },
        { es: "El Batch se detiene en la tanda 7", en: "The Batch stops at chunk 7" },
      ],
      answer: 0,
      explain: {
        es: "Cada tanda es su propia transacción, y el filtro de start las vuelve a encontrar mañana.",
        en: "Each chunk is its own transaction, and start's filter finds them again tomorrow.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m09-cp-q3",
      kind: "single",
      prompt: { es: "¿Dónde se lanza el Queueable del resumen?", en: "Where is the summary Queueable launched?" },
      options: [
        { es: "En finish, cuando ya no quedan tandas", en: "In finish, when no chunks remain" },
        { es: "Al final de cada execute", en: "At the end of each execute" },
        { es: "En start", en: "In start" },
        { es: "En el Schedulable, justo después de executeBatch", en: "In the Schedulable, right after executeBatch" },
      ],
      answer: 0,
      explain: {
        es: "executeBatch solo encola el Batch y termina al instante: si lanzaras el resumen ahí, saldría antes de procesar nada.",
        en: "executeBatch only enqueues the Batch and finishes instantly: if you launched the summary there, it would go out before anything was processed.",
      },
    },
    {
      id: "m09-cp-q4",
      kind: "multi",
      prompt: { es: "¿Qué hace falta para que synced y failed lleguen bien a finish?", en: "What is needed for synced and failed to reach finish correctly?" },
      options: [
        { es: "Database.Stateful en la cabecera", en: "Database.Stateful in the header" },
        { es: "Que sean atributos del Batch, no variables dentro de execute", en: "That they are Batch attributes, not variables inside execute" },
        { es: "Declararlos static", en: "Declaring them static" },
        { es: "Un tamaño de tanda de 2.000", en: "A chunk size of 2,000" },
      ],
      answers: [0, 1],
      explain: {
        es: "Atributos del objeto más Stateful. static no sobrevive entre transacciones.",
        en: "Object attributes plus Stateful. static does not survive between transactions.",
      },
    },
    {
      id: "m09-cp-q5",
      kind: "single",
      prompt: {
        es: "Diccionario Flow → Apex: ¿qué equivale al camino «Run Asynchronously» de un flow?",
        en: "Flow → Apex dictionary: what matches a flow's «Run Asynchronously» path?",
      },
      options: [
        { es: "Un @future o un Queueable lanzado desde el trigger", en: "An @future or a Queueable launched from the trigger" },
        { es: "Un Batch", en: "A Batch" },
        { es: "Un Schedulable", en: "A Schedulable" },
        { es: "Un before trigger", en: "A before trigger" },
      ],
      answer: 0,
      explain: {
        es: "Después del guardado, en su propia transacción y sin hacer esperar: eso es @future o Queueable.",
        en: "After the save, in its own transaction and without making anyone wait: that is @future or Queueable.",
      },
    },
    {
      id: "m09-cp-q6",
      kind: "text",
      prompt: {
        es: "Escribe la línea que, desde un Schedulable, lanza new ErpNightlySyncBatch() en tandas de 100.",
        en: "Write the line that, from a Schedulable, launches new ErpNightlySyncBatch() in chunks of 100.",
      },
      accept: ["(id\\s+\\w+\\s*=\\s*)?database\\.executebatch\\(\\s*new\\s+erpnightlysyncbatch\\(\\s*\\)\\s*,\\s*100\\s*\\)\\s*;?"],
      placeholder: { es: "Database.…", en: "Database.…" },
      explain: {
        es: "Database.executeBatch(new ErpNightlySyncBatch(), 100);",
        en: "Database.executeBatch(new ErpNightlySyncBatch(), 100);",
      },
      tags: ["recall"],
    },
    {
      id: "m09-cp-q7",
      kind: "single",
      prompt: {
        es: "Repaso: en execute, ¿qué te dice cada Database.SaveResult de Database.update(scope, false)?",
        en: "Review: in execute, what does each Database.SaveResult from Database.update(scope, false) tell you?",
      },
      options: [
        { es: "Si ese registro se guardó y, si no, por qué", en: "Whether that record was saved and, if not, why" },
        { es: "Si el ERP lo recibió", en: "Whether the ERP received it" },
        { es: "Cuántas tandas quedan", en: "How many chunks remain" },
        { es: "El Id del trabajo", en: "The job's Id" },
      ],
      answer: 0,
      explain: {
        es: "El SaveResult habla de Salesforce, no del ERP: por eso se cuenta aparte lo que se guardó y lo que no.",
        en: "The SaveResult is about Salesforce, not the ERP: that is why what was saved and what was not is counted separately.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M8 L6", en: "Review · M8 L6" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 7 DE 7 · La entrega. Cada noche laborable a las 2:00, todas las renovaciones que el ERP aún no tiene se le envían en tandas de 100, cada una se marca con ERP_Synced__c = true, y al terminar el ERP recibe el resumen con ErpNightlyReport, que ya existe. Escribe el Batch y el programador, y deja programada la sincronización.",
      en: "TASK 7 OF 7 · The delivery. Every weeknight at 2:00, all the renewals the ERP does not have yet are sent to it in chunks of 100, each is marked with ERP_Synced__c = true, and at the end the ERP gets the summary with ErpNightlyReport, which already exists. Write the Batch and the scheduler, and leave the sync scheduled.",
    },
    brief: [
      {
        es: "ErpNightlySyncBatch implements Database.Batchable<sObject>, Database.Stateful, Database.AllowsCallouts, con atributos synced y failed a 0.",
        en: "ErpNightlySyncBatch implements Database.Batchable<sObject>, Database.Stateful, Database.AllowsCallouts, with synced and failed attributes at 0.",
      },
      {
        es: "start: las Opportunity con Type = 'Renewal' y ERP_Synced__c = false.",
        en: "start: the Opportunity records with Type = 'Renewal' and ERP_Synced__c = false.",
      },
      {
        es: "execute: primero la llamada con toda la tanda (el código de la tarea 6); después ERP_Synced__c = true y Database.update(scope, false), sumando a synced o a failed según cada SaveResult.",
        en: "execute: first the call with the whole chunk (task 6's code); then ERP_Synced__c = true and Database.update(scope, false), adding to synced or failed per SaveResult.",
      },
      {
        es: "finish: System.enqueueJob(new ErpNightlyReport(synced, failed)). Y ErpNightlySyncScheduler lanza el Batch en tandas de 100; prográmalo con '0 0 2 ? * MON-FRI'.",
        en: "finish: System.enqueueJob(new ErpNightlyReport(synced, failed)). And ErpNightlySyncScheduler launches the Batch in chunks of 100; schedule it with '0 0 2 ? * MON-FRI'.",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, a escala
// Ya resuelto (tareas 1-6): contexto asíncrono, aviso al ERP en Queueable, migración en Batch programada.
// Tarea 7 de 7 · La entrega: la sincronización nocturna completa.

${REPORT_ES}

// Tu entrega: el Batch, el programador y la línea que lo programa.
`,
      en: `// CASE: the ERP bridge, at scale
// Already solved (tasks 1-6): async context, ERP notice in a Queueable, migration as a scheduled Batch.
// Task 7 of 7 · The delivery: the full nightly sync.

${REPORT_EN}

// Your delivery: the Batch, the scheduler and the line that schedules it.
`,
    },
    hints: [
      {
        es: "Yo lo dibujaría antes de escribir, como un proceso de Admin: ¿qué arranca (el programador), qué recorre (el Batch) y qué avisa al final (el Queueable que ya existe)? Cada pieza ya la has escrito una vez en este módulo.",
        en: "I would draw it before writing, like an Admin process: what starts it (the scheduler), what walks the records (the Batch) and what reports at the end (the Queueable that already exists)? You have already written each piece once in this module.",
      },
      {
        es: "Lo que me ayudó: la cabecera del Batch lleva tres interfaces. Dentro de execute, el orden de la tarea 6 (primero http.send, después el guardado), y el Database.update(scope, false) del Módulo 8 para contar con cada SaveResult.",
        en: "What helped me: the Batch header carries three interfaces. Inside execute, task 6's order (first http.send, then the save), and Module 8's Database.update(scope, false) to count with each SaveResult.",
      },
      {
        es: "Te dejo el esquema: class ErpNightlySyncBatch implements Database.Batchable<sObject>, Database.Stateful, Database.AllowsCallouts { start → getQueryLocator('… WHERE Type = \\'Renewal\\' AND ERP_Synced__c = false'); execute → llamada; for (o) o.ERP_Synced__c = true; for (sr : Database.update(scope, false)) { if (sr.isSuccess()) synced++; else failed++; } finish → System.enqueueJob(new ErpNightlyReport(synced, failed)); } · class ErpNightlySyncScheduler implements Schedulable { execute → Database.executeBatch(new ErpNightlySyncBatch(), 100); } · System.schedule('…', '0 0 2 ? * MON-FRI', new ErpNightlySyncScheduler());",
        en: "Here is the outline: class ErpNightlySyncBatch implements Database.Batchable<sObject>, Database.Stateful, Database.AllowsCallouts { start → getQueryLocator('… WHERE Type = \\'Renewal\\' AND ERP_Synced__c = false'); execute → call; for (o) o.ERP_Synced__c = true; for (sr : Database.update(scope, false)) { if (sr.isSuccess()) synced++; else failed++; } finish → System.enqueueJob(new ErpNightlyReport(synced, failed)); } · class ErpNightlySyncScheduler implements Schedulable { execute → Database.executeBatch(new ErpNightlySyncBatch(), 100); } · System.schedule('…', '0 0 2 ? * MON-FRI', new ErpNightlySyncScheduler());",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m09-cp-c1",
        label: { es: "El Batch lleva sus tres interfaces", en: "The Batch carries its three interfaces" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "class\\s+ErpNightlySyncBatch\\s+implements[^{]*Database\\s*\\.\\s*Batchable\\s*<\\s*(sObject|Opportunity)\\s*>" },
            { op: "match", pattern: "class\\s+ErpNightlySyncBatch\\s+implements[^{]*Database\\s*\\.\\s*Stateful" },
            { op: "match", pattern: "class\\s+ErpNightlySyncBatch\\s+implements[^{]*Database\\s*\\.\\s*AllowsCallouts" },
          ],
        },
        onFail: {
          es: "public class ErpNightlySyncBatch implements Database.Batchable<sObject>, Database.Stateful, Database.AllowsCallouts",
          en: "public class ErpNightlySyncBatch implements Database.Batchable<sObject>, Database.Stateful, Database.AllowsCallouts",
        },
        otter: {
          es: "Tres contratos, tres capacidades: Batchable para trocear, Stateful para que los contadores sobrevivan entre tandas y AllowsCallouts para poder llamar al ERP.",
          en: "Three contracts, three abilities: Batchable to split, Stateful so the counters survive between chunks and AllowsCallouts to be able to call the ERP.",
        },
      },
      {
        id: "m09-cp-c2",
        label: { es: "start busca las renovaciones pendientes", en: "start looks for the pending renewals" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Database\\s*\\.\\s*getQueryLocator\\s*\\([^;]*FROM\\s+Opportunity[^;]*ERP_Synced__c\\s*=\\s*false" },
            { op: "match", pattern: "getQueryLocator\\s*\\([^;]*Type\\s*=\\s*\\\\?'Renewal" },
          ],
        },
        onFail: {
          es: "En start: Database.getQueryLocator('SELECT … FROM Opportunity WHERE Type = \\'Renewal\\' AND ERP_Synced__c = false').",
          en: "In start: Database.getQueryLocator('SELECT … FROM Opportunity WHERE Type = \\'Renewal\\' AND ERP_Synced__c = false').",
        },
        otter: {
          es: "Las que el ERP todavía no tiene: renovaciones (Type = 'Renewal') con ERP_Synced__c = false. Y como las enviadas se marcan, la noche siguiente ya no vuelven a salir.",
          en: "The ones the ERP does not have yet: renewals (Type = 'Renewal') with ERP_Synced__c = false. And since the sent ones are marked, they will not come up again the next night.",
        },
      },
      {
        id: "m09-cp-c3",
        label: { es: "execute llama, marca y cuenta con guardado parcial", en: "execute calls, marks and counts with a partial save" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "\\.\\s*send\\s*\\([^)]*\\)[\\s\\S]*Database\\s*\\.\\s*update\\s*\\(\\s*\\w+\\s*,\\s*false\\s*\\)" },
            { op: "match", pattern: "ERP_Synced__c\\s*=\\s*true" },
            { op: "match", pattern: "\\.\\s*isSuccess\\s*\\(\\s*\\)" },
            { op: "match", pattern: "\\w+\\s*(\\+\\+|\\+=\\s*1)[\\s\\S]*\\w+\\s*(\\+\\+|\\+=\\s*1)" },
          ],
        },
        onFail: {
          es: "En execute: primero http.send(req); después ERP_Synced__c = true en cada una y Database.update(scope, false), con synced++ o failed++ según sr.isSuccess().",
          en: "In execute: first http.send(req); then ERP_Synced__c = true on each and Database.update(scope, false), with synced++ or failed++ per sr.isSuccess().",
        },
        otter: {
          es: "Dos reglas que ya conoces, juntas: la llamada antes del guardado (tarea 6) y el guardado parcial con su SaveResult (Módulo 8). Cada sr.isSuccess() suma a synced o a failed.",
          en: "Two rules you already know, together: the call before the save (task 6) and the partial save with its SaveResult (Module 8). Each sr.isSuccess() adds to synced or failed.",
        },
      },
      {
        id: "m09-cp-c4",
        label: { es: "finish envía el resumen", en: "finish sends the summary" },
        rule: {
          op: "match",
          pattern: "void\\s+finish\\s*\\(\\s*Database\\s*\\.\\s*BatchableContext\\s+\\w+\\s*\\)\\s*\\{[^}]*System\\s*\\.\\s*enqueueJob\\s*\\(\\s*new\\s+ErpNightlyReport\\s*\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*\\)",
        },
        onFail: {
          es: "public void finish(Database.BatchableContext bc) { System.enqueueJob(new ErpNightlyReport(synced, failed)); }",
          en: "public void finish(Database.BatchableContext bc) { System.enqueueJob(new ErpNightlyReport(synced, failed)); }",
        },
        otter: {
          es: "El resumen sale cuando ya no quedan tandas, y eso es finish: System.enqueueJob(new ErpNightlyReport(synced, failed)). Gracias a Stateful, los números son los de toda la noche.",
          en: "The summary goes out when no chunks remain, and that is finish: System.enqueueJob(new ErpNightlyReport(synced, failed)). Thanks to Stateful, the numbers cover the whole night.",
        },
      },
      {
        id: "m09-cp-c5",
        label: { es: "El programador lanza el Batch en tandas de 100", en: "The scheduler launches the Batch in chunks of 100" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "class\\s+ErpNightlySyncScheduler\\s+implements\\s+Schedulable\\b" },
            { op: "match", pattern: "execute\\s*\\(\\s*SchedulableContext\\s+\\w+\\s*\\)\\s*\\{[^}]*Database\\s*\\.\\s*executeBatch\\s*\\(\\s*new\\s+ErpNightlySyncBatch\\s*\\(\\s*\\)\\s*,\\s*100\\s*\\)" },
          ],
        },
        onFail: {
          es: "public class ErpNightlySyncScheduler implements Schedulable { public void execute(SchedulableContext sc) { Database.executeBatch(new ErpNightlySyncBatch(), 100); } }",
          en: "public class ErpNightlySyncScheduler implements Schedulable { public void execute(SchedulableContext sc) { Database.executeBatch(new ErpNightlySyncBatch(), 100); } }",
        },
        otter: {
          es: "El despertador de la tarea 5, con un cambio: tandas de 100, porque cada tanda es una petición y el ERP acepta como mucho 100 renovaciones por petición.",
          en: "Task 5's alarm clock, with one change: chunks of 100, because each chunk is one request and the ERP accepts at most 100 renewals per request.",
        },
      },
      {
        id: "m09-cp-c6",
        label: { es: "La sincronización queda programada", en: "The sync is left scheduled" },
        rule: {
          op: "match",
          pattern: "System\\s*\\.\\s*schedule\\s*\\(\\s*'[^']+'\\s*,\\s*'0\\s+0\\s+2\\s+\\?\\s+\\*\\s+(MON-FRI|2-6)(\\s+\\*)?'\\s*,\\s*new\\s+ErpNightlySyncScheduler\\s*\\(\\s*\\)\\s*\\)",
        },
        onFail: {
          es: "System.schedule('un nombre', '0 0 2 ? * MON-FRI', new ErpNightlySyncScheduler());",
          en: "System.schedule('a name', '0 0 2 ? * MON-FRI', new ErpNightlySyncScheduler());",
        },
        otter: {
          es: "Y la última línea, la que se ejecuta una sola vez: System.schedule('…', '0 0 2 ? * MON-FRI', new ErpNightlySyncScheduler()). A partir de ahí, cada noche laborable va sola.",
          en: "And the last line, the one run only once: System.schedule('…', '0 0 2 ? * MON-FRI', new ErpNightlySyncScheduler()). From then on, every weeknight runs on its own.",
        },
      },
    ],
    rubric: [
      {
        es: "Si una noche el ERP no responde, ¿qué renovaciones intentará enviar la noche siguiente? ¿Hace falta algún código para reintentar?",
        en: "If one night the ERP does not respond, which renewals will it try to send the next night? Is any retry code needed?",
      },
      {
        es: "En una entrevista te preguntarán cuándo usar @future, Queueable, Batch o Scheduled. Esta entrega usa tres: ¿sabrías explicar por qué cada una está donde está?",
        en: "In an interview you will be asked when to use @future, Queueable, Batch or Scheduled. This delivery uses three: could you explain why each one is where it is?",
      },
    ],
    voice: "otter",
    outro: {
      es: "¡Entregaste la sincronización nocturna con el ERP! Cada noche laborable arranca sola, envía en tandas, aísla los fallos y manda su resumen: 300.000 renovaciones sin que nadie esté delante. En el Módulo 10 aprendes a demostrar con tests que todo esto funciona, que es lo que Salesforce te exige antes de dejarte desplegarlo.",
      en: "You delivered the nightly sync with the ERP! Every weeknight it starts on its own, sends in chunks, isolates failures and sends its summary: 300,000 renewals with nobody at the keyboard. In Module 10 you learn to prove with tests that all this works, which is what Salesforce demands before letting you deploy it.",
    },
  },
};
