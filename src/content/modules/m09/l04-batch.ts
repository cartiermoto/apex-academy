import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, a escala
// Tarea 4 de 7: la migración, como un Batch que Salesforce trocea por ti.

public class RenewalMigrationBatch implements Database.Batchable<sObject>, Database.Stateful {
    private Integer processed = 0;   // Stateful: sobrevive de una tanda a la siguiente

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator(
            'SELECT Id, ERP_Code__c, Amount__c FROM ERP_Renewal__c WHERE Processed__c = false'
        );
    }

    public void execute(Database.BatchableContext bc, List<ERP_Renewal__c> scope) {
        RenewalImporter.fromStaging(scope);   // Módulo 8
        processed += scope.size();
    }

    public void finish(Database.BatchableContext bc) {
        System.debug('Migración terminada: ' + processed + ' filas procesadas');
    }
}

Id jobId = Database.executeBatch(new RenewalMigrationBatch(), 200);`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, a escala\n// Tarea 4 de 7: la migración, como un Batch que Salesforce trocea por ti.",
  "// CASE: the ERP bridge, at scale\n// Task 4 of 7: the migration, as a Batch that Salesforce splits for you.",
)
  .replace("// Stateful: sobrevive de una tanda a la siguiente", "// Stateful: survives from one chunk to the next")
  .replace("// Módulo 8", "// Module 8")
  .replace("'Migración terminada: ' + processed + ' filas procesadas'", "'Migration finished: ' + processed + ' rows processed'");

const STARTER_BODY = `public class RenewalMigrationJob implements Queueable {
    public void execute(QueueableContext ctx) {
        List<ERP_Renewal__c> rows = [
            SELECT Id, ERP_Code__c, Amount__c
            FROM ERP_Renewal__c
            WHERE Processed__c = false
            LIMIT 200
        ];
        RenewalImporter.fromStaging(rows);
        if (rows.size() == 200) {
            System.enqueueJob(new RenewalMigrationJob());
        }
    }
}

Id jobId = System.enqueueJob(new RenewalMigrationJob());
`;

export const l04Batch: Lesson = {
  id: "m09-l04",
  slug: "batch",
  n: 4,
  kind: "lesson",
  minutes: 35,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 3", en: "Remember? · Review of lesson 3" },
    prompt: {
      es: "En la cadena de Queueables de la migración, ¿qué detiene la cadena?",
      en: "In the migration's Queueable chain, what stops the chain?",
    },
    options: [
      { es: "Una tanda que sale con menos de 200 filas", en: "A chunk that comes out with fewer than 200 rows" },
      { es: "Salesforce, a los 100 eslabones", en: "Salesforce, at 100 links" },
      { es: "Nada: hay que pararla a mano", en: "Nothing: you have to stop it by hand" },
    ],
    answer: 0,
    explain: {
      es: "La condición de parada la escribiste tú. Hoy verás una herramienta en la que el troceo y el final los lleva Salesforce.",
      en: "You wrote the stopping condition. Today you will see a tool where Salesforce handles the splitting and the end.",
    },
  },
  title: { es: "Batch Apex", en: "Batch Apex" },
  summary: {
    es: "Batch Apex es la herramienta para millones de registros: tú dices qué registros (start), qué hacer con cada tanda (execute) y qué hacer al final (finish). Salesforce trocea, reparte y lleva la cuenta.",
    en: "Batch Apex is the tool for millions of records: you say which records (start), what to do with each chunk (execute) and what to do at the end (finish). Salesforce splits, hands out and keeps count.",
  },
  analogy: {
    es: "Data Loader con su tamaño de lote, pero dentro de Salesforce",
    en: "Data Loader with its batch size, but inside Salesforce",
  },
  objectives: [
    { es: "Escribir un Batch con sus tres métodos: start, execute y finish.", en: "Write a Batch with its three methods: start, execute and finish." },
    { es: "Lanzarlo con Database.executeBatch eligiendo el tamaño de tanda.", en: "Launch it with Database.executeBatch choosing the chunk size." },
    { es: "Usar Database.Stateful para llevar la cuenta entre tandas.", en: "Use Database.Stateful to keep count between chunks." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "La cadena de Queueables funciona, pero tiene 1.500 eslabones y la condición de parada es cosa tuya: si uno falla, la cadena se detiene ahí. Para recorrer muchos registros de un objeto, Salesforce tiene una herramienta hecha a medida, que trocea, reparte y lleva la cuenta por ti.",
        en: "The Queueable chain works, but it has 1,500 links and the stopping condition is up to you: if one fails, the chain stops there. For walking through many records of an object, Salesforce has a tailor-made tool that splits, hands out and keeps count for you.",
      },
    },
    {
      type: "h",
      text: { es: "Tres métodos: empezar, cada tanda, terminar", en: "Three methods: start, each chunk, finish" },
    },
    {
      type: "code",
      code: {
        es: `public class RenewalMigrationBatch implements Database.Batchable<sObject> {
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator('SELECT … FROM ERP_Renewal__c WHERE …');  // 1 · qué registros
    }
    public void execute(Database.BatchableContext bc, List<ERP_Renewal__c> scope) {
        // 2 · qué hacer con cada tanda (scope)
    }
    public void finish(Database.BatchableContext bc) {
        // 3 · qué hacer al final: un resumen, un aviso, el siguiente trabajo
    }
}

Id jobId = Database.executeBatch(new RenewalMigrationBatch(), 200);   // tandas de 200`,
        en: `public class RenewalMigrationBatch implements Database.Batchable<sObject> {
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator('SELECT … FROM ERP_Renewal__c WHERE …');  // 1 · which records
    }
    public void execute(Database.BatchableContext bc, List<ERP_Renewal__c> scope) {
        // 2 · what to do with each chunk (scope)
    }
    public void finish(Database.BatchableContext bc) {
        // 3 · what to do at the end: a summary, a notice, the next job
    }
}

Id jobId = Database.executeBatch(new RenewalMigrationBatch(), 200);   // chunks of 200`,
      },
    },
    {
      type: "p",
      text: {
        es: "start se ejecuta una vez y devuelve un QueryLocator: la consulta de todos los registros, hasta 50 millones. Salesforce los parte en tandas del tamaño que elijas (por defecto 200, como mucho 2.000) y llama a execute una vez por tanda, cada una en su propia transacción con su presupuesto. Cuando no quedan tandas, llama a finish una vez.",
        en: "start runs once and returns a QueryLocator: the query for every record, up to 50 million. Salesforce splits them into chunks of the size you choose (200 by default, 2,000 at most) and calls execute once per chunk, each in its own transaction with its own budget. When no chunks remain, it calls finish once.",
      },
    },
    {
      type: "diagram",
      id: "m09-batch",
      caption: {
        es: "Lanza el Batch y mira cómo start, las tandas y finish se reparten en transacciones distintas. Prueba a hacer fallar una tanda.",
        en: "Launch the Batch and watch start, the chunks and finish spread over separate transactions. Try making one chunk fail.",
      },
    },
    {
      type: "h",
      text: { es: "Llevar la cuenta: Database.Stateful", en: "Keeping count: Database.Stateful" },
    },
    {
      type: "p",
      text: {
        es: "Cada tanda es una transacción nueva, así que las variables del Batch empiezan de cero en cada una. Si quieres un contador que sume a lo largo de todas las tandas (filas procesadas, filas con error), añade Database.Stateful a la cabecera: Salesforce guarda los atributos del objeto entre una tanda y la siguiente, y en finish tienes el total.",
        en: "Each chunk is a new transaction, so the Batch's variables start from zero in each. If you want a counter that adds up across every chunk (rows processed, rows with errors), add Database.Stateful to the header: Salesforce keeps the object's attributes between one chunk and the next, and in finish you have the total.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Es tu Data Loader, sin nadie delante", en: "It is your Data Loader, with nobody at the keyboard" },
      text: {
        es: "Yo lo entendí así: el tamaño de tanda es el «Batch size» de la configuración de Data Loader, y Setup → Apex Jobs es mi pantalla de resultados, con las tandas procesadas y las que fallaron. La diferencia es que aquí no hay nadie delante del portátil: el Batch se lanza desde código, a cualquier hora, y lo que en Data Loader era el error.csv lo decides tú en execute y en finish.",
        en: "This is how I understood it: the chunk size is the «Batch size» in Data Loader's settings, and Setup → Apex Jobs is my results screen, with the chunks processed and the ones that failed. The difference is that here there is nobody at the laptop: the Batch is launched from code, at any time, and what in Data Loader was the error.csv you decide in execute and finish.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Una tanda que falla no tumba las demás", en: "A failing chunk does not bring down the others" },
      text: {
        es: "Si una tanda lanza una excepción sin capturar, se deshace solo esa tanda; las demás siguen y el trabajo termina con NumberOfErrors mayor que cero en AsyncApexJob. Es justo lo contrario de la cadena de Queueables, donde un eslabón roto para todo. Y un detalle: solo puede haber 5 Batch en marcha a la vez en la org.",
        en: "If a chunk throws an uncaught exception, only that chunk is rolled back; the others go on and the job finishes with NumberOfErrors above zero in AsyncApexJob. It is exactly the opposite of the Queueable chain, where one broken link stops everything. And one detail: only 5 Batches can be running at once in the org.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Por la escala", en: "Why not a Flow? Because of the scale" },
      text: {
        es: "Un flow programado es lo más parecido a un Batch: recorre registros en tandas de hasta 200. Pero cada registro es una interview, y el máximo diario es de 250.000 interviews (o 200 por licencia de usuario, si es mayor), para toda la org. Un Batch recorre hasta 50 millones de registros en un solo trabajo, y el tamaño de cada tanda lo eliges tú.",
        en: "A scheduled flow is the closest thing to a Batch: it walks records in chunks of up to 200. But each record is an interview, and the daily maximum is 250,000 interviews (or 200 per user licence, if greater), for the whole org. A Batch walks up to 50 million records in a single job, and you choose each chunk's size.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿cuántas veces se ejecuta start, execute y finish? ¿Para qué sirve Database.Stateful? ¿Qué pasa con las demás tandas si una falla?",
        en: "Without looking: how many times do start, execute and finish run? What is Database.Stateful for? What happens to the other chunks if one fails?",
      },
    },
  ],

  quiz: [
    {
      id: "m09-l04-q1",
      kind: "single",
      prompt: {
        es: "Un Batch recorre 1.000 registros con tamaño de tanda 200. ¿Cuántas veces se ejecuta cada método?",
        en: "A Batch walks 1,000 records with a chunk size of 200. How many times does each method run?",
      },
      options: [
        { es: "start 1, execute 5, finish 1", en: "start 1, execute 5, finish 1" },
        { es: "start 5, execute 5, finish 5", en: "start 5, execute 5, finish 5" },
        { es: "start 1, execute 1.000, finish 1", en: "start 1, execute 1,000, finish 1" },
        { es: "start 1, execute 200, finish 1", en: "start 1, execute 200, finish 1" },
      ],
      answer: 0,
      explain: {
        es: "start y finish, una vez; execute, una por tanda: 1.000 / 200 = 5.",
        en: "start and finish, once; execute, once per chunk: 1,000 / 200 = 5.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m09-l04-q2",
      kind: "single",
      prompt: {
        es: "Tu Batch suma en un atributo Integer processed, pero en finish siempre vale 0. ¿Qué falta?",
        en: "Your Batch adds up in an Integer processed attribute, but in finish it is always 0. What is missing?",
      },
      options: [
        { es: "Database.Stateful en la cabecera", en: "Database.Stateful in the header" },
        { es: "Hacer processed static", en: "Making processed static" },
        { es: "Un tamaño de tanda mayor", en: "A bigger chunk size" },
        { es: "Declararlo dentro de execute", en: "Declaring it inside execute" },
      ],
      answer: 0,
      explain: {
        es: "Sin Stateful, cada tanda trabaja con una copia del objeto tal como estaba al lanzar el Batch, y finish también: el 0 del principio. static tampoco sirve: cada tanda es otra transacción.",
        en: "Without Stateful, each chunk works with a copy of the object as it was when the Batch was launched, and so does finish: the initial 0. static does not help either: each chunk is another transaction.",
      },
      tags: ["find-error"],
    },
    {
      id: "m09-l04-q3",
      kind: "single",
      prompt: { es: "¿Qué pasa si la tanda 3 de 10 lanza una excepción sin capturar?", en: "What happens if chunk 3 of 10 throws an uncaught exception?" },
      options: [
        { es: "Se deshace esa tanda; las demás siguen, y el trabajo termina con errores", en: "That chunk is rolled back; the others go on, and the job ends with errors" },
        { es: "Se deshace todo el Batch", en: "The whole Batch is rolled back" },
        { es: "El Batch se detiene en la tanda 3", en: "The Batch stops at chunk 3" },
        { es: "La tanda se repite hasta que funcione", en: "The chunk is retried until it works" },
      ],
      answer: 0,
      explain: {
        es: "Cada tanda es su propia transacción. Lo verás en AsyncApexJob: NumberOfErrors cuenta las tandas que fallaron.",
        en: "Each chunk is its own transaction. You will see it in AsyncApexJob: NumberOfErrors counts the chunks that failed.",
      },
    },
    {
      id: "m09-l04-q4",
      kind: "text",
      prompt: {
        es: "Escribe la línea que lanza new RenewalMigrationBatch() en tandas de 500.",
        en: "Write the line that launches new RenewalMigrationBatch() in chunks of 500.",
      },
      accept: [
        "(id\\s+\\w+\\s*=\\s*)?database\\.executebatch\\(\\s*new\\s+renewalmigrationbatch\\(\\s*\\)\\s*,\\s*500\\s*\\)\\s*;?",
      ],
      placeholder: { es: "Database.…", en: "Database.…" },
      explain: {
        es: "Database.executeBatch(new RenewalMigrationBatch(), 500); y devuelve el Id del trabajo.",
        en: "Database.executeBatch(new RenewalMigrationBatch(), 500); and it returns the job's Id.",
      },
      tags: ["recall"],
    },
    {
      id: "m09-l04-q5",
      kind: "multi",
      prompt: { es: "¿Qué es cierto sobre Batch Apex?", en: "What is true about Batch Apex?" },
      options: [
        { es: "Un QueryLocator puede devolver hasta 50 millones de registros", en: "A QueryLocator can return up to 50 million records" },
        { es: "El tamaño de tanda por defecto es 200 y el máximo 2.000", en: "The default chunk size is 200 and the maximum 2,000" },
        { es: "Solo puede haber 5 Batch en marcha a la vez", en: "Only 5 Batches can be running at once" },
        { es: "Todas las tandas comparten un único presupuesto de límites", en: "All chunks share a single limits budget" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Cada tanda tiene su propio presupuesto: es lo que hace que el Batch escale.",
        en: "Each chunk has its own budget: that is what makes the Batch scale.",
      },
    },
    {
      id: "m09-l04-q6",
      kind: "single",
      prompt: {
        es: "Repaso: dentro de execute conviertes 200 filas. ¿Dónde va el insert de las renovaciones?",
        en: "Review: inside execute you convert 200 rows. Where does the insert of the renewals go?",
      },
      options: [
        { es: "Uno solo, después del bucle, con la lista entera", en: "A single one, after the loop, with the whole list" },
        { es: "Uno por fila, dentro del bucle", en: "One per row, inside the loop" },
        { es: "En start", en: "In start" },
        { es: "En finish, para todas las tandas", en: "In finish, for every chunk" },
      ],
      answer: 0,
      explain: {
        es: "Una tanda sigue siendo una transacción con 150 DML: la receta del Módulo 4 vale igual dentro de execute.",
        en: "A chunk is still a transaction with 150 DML: Module 4's recipe applies just the same inside execute.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M4 L3", en: "Review · M4 L3" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 4 DE 7 · La cadena de Queueables de la tarea 3 migra, pero con 1.500 eslabones que dependen de ti. Rehaz la migración como un Batch: Salesforce trocea, un fallo no para el resto, y al final quieres saber cuántas filas se procesaron.",
      en: "TASK 4 OF 7 · Task 3's Queueable chain migrates, but with 1,500 links that depend on you. Redo the migration as a Batch: Salesforce splits, one failure does not stop the rest, and at the end you want to know how many rows were processed.",
    },
    brief: [
      {
        es: "public class RenewalMigrationBatch implements Database.Batchable<sObject>, Database.Stateful, con un atributo private Integer processed = 0.",
        en: "public class RenewalMigrationBatch implements Database.Batchable<sObject>, Database.Stateful, with a private Integer processed = 0 attribute.",
      },
      {
        es: "start devuelve Database.getQueryLocator con las filas de ERP_Renewal__c con Processed__c = false.",
        en: "start returns Database.getQueryLocator with the ERP_Renewal__c rows with Processed__c = false.",
      },
      {
        es: "execute(Database.BatchableContext bc, List<ERP_Renewal__c> scope) pasa scope a RenewalImporter.fromStaging y suma scope.size() a processed.",
        en: "execute(Database.BatchableContext bc, List<ERP_Renewal__c> scope) passes scope to RenewalImporter.fromStaging and adds scope.size() to processed.",
      },
      {
        es: "finish escribe el total con System.debug. Lánzalo con Database.executeBatch en tandas de 200.",
        en: "finish writes the total with System.debug. Launch it with Database.executeBatch in chunks of 200.",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, a escala
// Ya resuelto (tareas 1-3): la migración avanza en una cadena de Queueables, 200 filas por eslabón.
// Tarea 4 de 7: la migración, como un Batch que Salesforce trocea por ti.

${STARTER_BODY}`,
      en: `// CASE: the ERP bridge, at scale
// Already solved (tasks 1-3): the migration moves along a chain of Queueables, 200 rows per link.
// Task 4 of 7: the migration, as a Batch that Salesforce splits for you.

${STARTER_BODY}`,
    },
    hints: [
      {
        es: "Yo lo pensaría como un Data Loader: primero qué registros exporto (start), después qué hago con cada lote (execute) y al final el resumen (finish). La condición de parada ya no la escribes tú.",
        en: "I would think of it as Data Loader: first which records I export (start), then what I do with each batch (execute) and at the end the summary (finish). You no longer write the stopping condition.",
      },
      {
        es: "Lo que me ayudó: el LIMIT 200 y el enqueueJob desaparecen, porque el troceo lo hace Salesforce. Y para que processed sume entre tandas, la cabecera lleva también Database.Stateful.",
        en: "What helped me: the LIMIT 200 and the enqueueJob disappear, because Salesforce does the splitting. And for processed to add up across chunks, the header also carries Database.Stateful.",
      },
      {
        es: "Te dejo el esquema: class RenewalMigrationBatch implements Database.Batchable<sObject>, Database.Stateful { private Integer processed = 0; public Database.QueryLocator start(Database.BatchableContext bc) { return Database.getQueryLocator('SELECT … WHERE Processed__c = false'); } public void execute(Database.BatchableContext bc, List<ERP_Renewal__c> scope) { RenewalImporter.fromStaging(scope); processed += scope.size(); } public void finish(Database.BatchableContext bc) { System.debug(…processed…); } } · Database.executeBatch(new RenewalMigrationBatch(), 200);",
        en: "Here is the outline: class RenewalMigrationBatch implements Database.Batchable<sObject>, Database.Stateful { private Integer processed = 0; public Database.QueryLocator start(Database.BatchableContext bc) { return Database.getQueryLocator('SELECT … WHERE Processed__c = false'); } public void execute(Database.BatchableContext bc, List<ERP_Renewal__c> scope) { RenewalImporter.fromStaging(scope); processed += scope.size(); } public void finish(Database.BatchableContext bc) { System.debug(…processed…); } } · Database.executeBatch(new RenewalMigrationBatch(), 200);",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m09-l04-c1",
        label: { es: "Es un Batch con estado", en: "It is a Batch with state" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "class\\s+RenewalMigrationBatch\\s+implements[^{]*Database\\s*\\.\\s*Batchable\\s*<\\s*(sObject|ERP_Renewal__c)\\s*>" },
            { op: "match", pattern: "class\\s+RenewalMigrationBatch\\s+implements[^{]*Database\\s*\\.\\s*Stateful" },
          ],
        },
        onFail: {
          es: "La cabecera: public class RenewalMigrationBatch implements Database.Batchable<sObject>, Database.Stateful",
          en: "The header: public class RenewalMigrationBatch implements Database.Batchable<sObject>, Database.Stateful",
        },
        otter: {
          es: "Dos contratos en la cabecera: Database.Batchable<sObject> para que Salesforce sepa trocearlo, y Database.Stateful para que el contador no se reinicie en cada tanda.",
          en: "Two contracts in the header: Database.Batchable<sObject> so Salesforce knows how to split it, and Database.Stateful so the counter does not reset on each chunk.",
        },
      },
      {
        id: "m09-l04-c2",
        label: { es: "start devuelve un QueryLocator con las pendientes", en: "start returns a QueryLocator with the pending rows" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Database\\s*\\.\\s*QueryLocator\\s+start\\s*\\(\\s*Database\\s*\\.\\s*BatchableContext\\s+\\w+\\s*\\)" },
            { op: "match", pattern: "Database\\s*\\.\\s*getQueryLocator\\s*\\([^;]*ERP_Renewal__c[^;]*Processed__c\\s*=\\s*false" },
            { op: "absent", pattern: "LIMIT\\s+200" },
          ],
        },
        onFail: {
          es: "public Database.QueryLocator start(Database.BatchableContext bc) { return Database.getQueryLocator('SELECT … FROM ERP_Renewal__c WHERE Processed__c = false'); }, sin LIMIT.",
          en: "public Database.QueryLocator start(Database.BatchableContext bc) { return Database.getQueryLocator('SELECT … FROM ERP_Renewal__c WHERE Processed__c = false'); }, with no LIMIT.",
        },
        otter: {
          es: "start es tu «qué exporto» de Data Loader: todas las pendientes, sin LIMIT, porque el troceo ya no es cosa tuya. return Database.getQueryLocator('SELECT … FROM ERP_Renewal__c WHERE Processed__c = false');",
          en: "start is your Data Loader «what do I export»: every pending row, no LIMIT, because splitting is no longer your job. return Database.getQueryLocator('SELECT … FROM ERP_Renewal__c WHERE Processed__c = false');",
        },
      },
      {
        id: "m09-l04-c3",
        label: { es: "execute procesa la tanda y suma", en: "execute processes the chunk and adds up" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "void\\s+execute\\s*\\(\\s*Database\\s*\\.\\s*BatchableContext\\s+\\w+\\s*,\\s*List\\s*<\\s*(ERP_Renewal__c|sObject)\\s*>\\s+(\\w+)\\s*\\)" },
            { op: "match", pattern: "RenewalImporter\\s*\\.\\s*fromStaging\\s*\\(\\s*\\w+\\s*\\)" },
            { op: "match", pattern: "\\w+\\s*\\+=\\s*\\w+\\s*\\.\\s*size\\s*\\(\\s*\\)" },
            { op: "absent", pattern: "System\\s*\\.\\s*enqueueJob" },
          ],
        },
        onFail: {
          es: "public void execute(Database.BatchableContext bc, List<ERP_Renewal__c> scope) { RenewalImporter.fromStaging(scope); processed += scope.size(); }, y ya sin enqueueJob.",
          en: "public void execute(Database.BatchableContext bc, List<ERP_Renewal__c> scope) { RenewalImporter.fromStaging(scope); processed += scope.size(); }, with no enqueueJob.",
        },
        otter: {
          es: "Cada tanda llega sola en scope: RenewalImporter.fromStaging(scope) y processed += scope.size(). El enqueueJob sobra: Salesforce ya sabe cuál es la siguiente tanda.",
          en: "Each chunk arrives on its own in scope: RenewalImporter.fromStaging(scope) and processed += scope.size(). The enqueueJob is not needed: Salesforce already knows the next chunk.",
        },
      },
      {
        id: "m09-l04-c4",
        label: { es: "finish da el total y el Batch se lanza", en: "finish gives the total and the Batch is launched" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "void\\s+finish\\s*\\(\\s*Database\\s*\\.\\s*BatchableContext\\s+\\w+\\s*\\)\\s*\\{[^}]*System\\s*\\.\\s*debug" },
            { op: "match", pattern: "Database\\s*\\.\\s*executeBatch\\s*\\(\\s*new\\s+RenewalMigrationBatch\\s*\\(\\s*\\)\\s*,\\s*\\d+\\s*\\)" },
          ],
        },
        onFail: {
          es: "finish(Database.BatchableContext bc) con un System.debug del total, y fuera: Database.executeBatch(new RenewalMigrationBatch(), 200);",
          en: "finish(Database.BatchableContext bc) with a System.debug of the total, and outside: Database.executeBatch(new RenewalMigrationBatch(), 200);",
        },
        otter: {
          es: "El resumen de Data Loader: en finish, System.debug con processed. Y el botón de arrancar: Database.executeBatch(new RenewalMigrationBatch(), 200), el 200 es tu tamaño de lote.",
          en: "Data Loader's summary: in finish, System.debug with processed. And the start button: Database.executeBatch(new RenewalMigrationBatch(), 200), the 200 is your batch size.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué pasaría si RenewalImporter.fromStaging no marcara Processed__c? ¿El Batch procesaría filas repetidas, como la cadena, o no?",
        en: "What would happen if RenewalImporter.fromStaging did not set Processed__c? Would the Batch process repeated rows, like the chain, or not?",
      },
    ],
    voice: "otter",
    outro: {
      es: "La migración ya es un Batch: Salesforce trocea, lleva la cuenta y aísla los fallos. Pero alguien tiene que lanzarlo. En la tarea 5 lo programas para que arranque solo cada noche a las 2:00, de lunes a viernes.",
      en: "The migration is now a Batch: Salesforce splits, keeps count and isolates failures. But someone has to launch it. In task 5 you schedule it to start on its own every night at 2:00, Monday to Friday.",
    },
  },
};
