import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, a escala
// Tarea 3 de 7: la migración de 300.000 renovaciones, de 200 en 200.

public class RenewalMigrationJob implements Queueable {
    public void execute(QueueableContext ctx) {
        List<ERP_Renewal__c> rows = [
            SELECT Id, ERP_Code__c, Amount__c
            FROM ERP_Renewal__c
            WHERE Processed__c = false
            LIMIT 200
        ];
        RenewalImporter.fromStaging(rows);   // Módulo 8: crea las renovaciones y marca Processed__c

        // Si ha llenado la tanda, quedan más: el trabajo se encola a sí mismo
        if (rows.size() == 200) {
            System.enqueueJob(new RenewalMigrationJob());
        }
    }
}

// Arranque, desde Execute Anonymous:
Id jobId = System.enqueueJob(new RenewalMigrationJob());
System.debug('Migración encolada: ' + jobId);`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, a escala\n// Tarea 3 de 7: la migración de 300.000 renovaciones, de 200 en 200.",
  "// CASE: the ERP bridge, at scale\n// Task 3 of 7: the migration of 300,000 renewals, 200 at a time.",
)
  .replace("// Módulo 8: crea las renovaciones y marca Processed__c", "// Module 8: creates the renewals and sets Processed__c")
  .replace("// Si ha llenado la tanda, quedan más: el trabajo se encola a sí mismo", "// If it filled the chunk, there are more: the job enqueues itself")
  .replace("// Arranque, desde Execute Anonymous:", "// Kick-off, from Execute Anonymous:")
  .replace("'Migración encolada: '", "'Migration enqueued: '");

export const l03Queueable: Lesson = {
  id: "m09-l03",
  slug: "queueable",
  n: 3,
  kind: "lesson",
  minutes: 30,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 2", en: "Remember? · Review of lesson 2" },
    prompt: {
      es: "Un @future ha terminado de avisar al ERP y quieres lanzar un segundo paso. ¿Puede llamar a otro @future?",
      en: "An @future has finished notifying the ERP and you want to launch a second step. Can it call another @future?",
    },
    options: [
      { es: "No: un @future no puede llamar a otro @future", en: "No: an @future cannot call another @future" },
      { es: "Sí, sin límite", en: "Yes, with no limit" },
      { es: "Sí, hasta 50", en: "Yes, up to 50" },
    ],
    answer: 0,
    explain: {
      es: "@future no encadena. Hoy aprendes la herramienta que sí: Queueable.",
      en: "@future does not chain. Today you learn the tool that does: Queueable.",
    },
  },
  title: { es: "Queueable Apex", en: "Queueable Apex" },
  summary: {
    es: "Un Queueable es una clase que se mete en la cola. A diferencia de @future, puede guardar estado, recibir registros, devolverte un Id para seguirlo y encolar el siguiente paso cuando termina.",
    en: "A Queueable is a class that goes into the queue. Unlike @future, it can hold state, receive records, give you an Id to track it and enqueue the next step when it finishes.",
  },
  analogy: {
    es: "Un flow que al terminar se lanza a sí mismo para la siguiente tanda",
    en: "A flow that relaunches itself for the next batch when it finishes",
  },
  objectives: [
    { es: "Escribir una clase que implemente Queueable y encolarla con System.enqueueJob.", en: "Write a class that implements Queueable and enqueue it with System.enqueueJob." },
    { es: "Encadenar trabajos: que cada uno procese una tanda y encole el siguiente.", en: "Chain jobs: each one processes a chunk and enqueues the next." },
    { es: "Seguir un trabajo por su Id en AsyncApexJob.", en: "Track a job by its Id in AsyncApexJob." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Las 300.000 renovaciones de la migración ya están en Salesforce, en un objeto de preparación, ERP_Renewal__c, esperando a convertirse en oportunidades. El importador del Módulo 8 sabe convertirlas, pero de 300.000 en una transacción, no. Hay que trocear: 200 por trabajo, y que cada trabajo lance el siguiente.",
        en: "The migration's 300,000 renewals are already in Salesforce, in a staging object, ERP_Renewal__c, waiting to become opportunities. Module 8's importer knows how to convert them, but not 300,000 in one transaction. You have to split: 200 per job, and each job launches the next.",
      },
    },
    {
      type: "h",
      text: { es: "Una interfaz, un método", en: "One interface, one method" },
    },
    {
      type: "code",
      code: {
        es: `public class RenewalMigrationJob implements Queueable {
    public void execute(QueueableContext ctx) {
        // lo que hay que hacer, en su propia transacción asíncrona
    }
}

Id jobId = System.enqueueJob(new RenewalMigrationJob());   // a la cola`,
        en: `public class RenewalMigrationJob implements Queueable {
    public void execute(QueueableContext ctx) {
        // the work to do, in its own async transaction
    }
}

Id jobId = System.enqueueJob(new RenewalMigrationJob());   // into the queue`,
      },
      caption: {
        es: "Es la interfaz del Módulo 5: un contrato con un solo método, execute. Salesforce lo llama cuando le toca el turno.",
        en: "It is Module 5's interface: a contract with a single method, execute. Salesforce calls it when its turn comes.",
      },
    },
    {
      type: "p",
      text: {
        es: "Como es un objeto, un Queueable puede tener atributos y constructor: puedes pasarle una lista de registros, un contador o la fase del proceso. Y System.enqueueJob te devuelve un Id: con él consultas AsyncApexJob (Status, NumberOfErrors) o lo ves en Setup → Apex Jobs. Con @future no tenías ni lo uno ni lo otro.",
        en: "Being an object, a Queueable can have attributes and a constructor: you can pass it a list of records, a counter or the process phase. And System.enqueueJob gives you back an Id: with it you query AsyncApexJob (Status, NumberOfErrors) or see it in Setup → Apex Jobs. With @future you had neither.",
      },
    },
    {
      type: "h",
      text: { es: "Encadenar: el trabajo que se relanza", en: "Chaining: the job that relaunches itself" },
    },
    {
      type: "p",
      text: {
        es: "Dentro de execute puedes encolar otro trabajo, uno solo. Esa es la llave de la migración: cada trabajo consulta las siguientes 200 filas sin procesar, las procesa y, si ha llenado la tanda, se encola de nuevo. Cuando una tanda sale incompleta, ya no quedan más y la cadena se detiene sola.",
        en: "Inside execute you can enqueue another job, just one. That is the key to the migration: each job queries the next 200 unprocessed rows, processes them and, if it filled the chunk, enqueues itself again. When a chunk comes out short, there are none left and the chain stops on its own.",
      },
    },
    {
      type: "diagram",
      id: "m09-queueable-chain",
      caption: {
        es: "Elige cuántas filas hay que migrar y sigue la cadena: cada eslabón es una transacción nueva, con su presupuesto a cero.",
        en: "Choose how many rows to migrate and follow the chain: each link is a new transaction, with its budget back at zero.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "La condición de parada no es opcional", en: "The stopping condition is not optional" },
      text: {
        es: "Si el trabajo se encola siempre, sin mirar si quedan filas, la cadena no para nunca. Y si procesas filas pero no las marcas como procesadas, la siguiente vuelta consulta las mismas: bucle infinito, pero en la cola. En producción la cadena no tiene tope de profundidad; en una Developer Org y en orgs de prueba, se corta a los 5 eslabones, así que pruébalo con pocas filas.",
        en: "If the job always enqueues itself, without checking whether rows remain, the chain never stops. And if you process rows but do not mark them as processed, the next pass queries the same ones: an infinite loop, but in the queue. In production the chain has no depth limit; in a Developer Org and trial orgs, it is cut at 5 links, so test it with few rows.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque un flow no se relanza a sí mismo", en: "Why not a Flow? Because a flow does not relaunch itself" },
      text: {
        es: "Lo más parecido en Flow es un flow programado sobre ERP_Renewal__c, que crea una interview por fila. Con su máximo de 250.000 interviews al día (o 200 por licencia, si es mayor), la migración necesitaba dos días, y ese cupo diario es de toda la org: lo gastaba también cualquier otro flow programado. Y un flow no puede, al terminar, lanzarse a sí mismo para la siguiente tanda con lo que sabe. La cadena de Queueables empieza la siguiente tanda en cuanto acaba la anterior.",
        en: "The closest thing in Flow is a scheduled flow on ERP_Renewal__c, which creates one interview per row. With its maximum of 250,000 interviews a day (or 200 per licence, if greater), the migration needed two days, and that daily quota belongs to the whole org: any other scheduled flow used it up too. And a flow cannot, when it finishes, relaunch itself for the next chunk with what it knows. The chain of Queueables starts the next chunk as soon as the previous one ends.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué interfaz implementa un Queueable y qué método obliga a escribir? ¿Cuántos trabajos puede encolar un Queueable desde su execute? ¿Qué pasa si se encola siempre, sin condición?",
        en: "Without looking: which interface does a Queueable implement and which method does it force you to write? How many jobs can a Queueable enqueue from its execute? What happens if it always enqueues itself, with no condition?",
      },
    },
  ],

  quiz: [
    {
      id: "m09-l03-q1",
      kind: "single",
      prompt: { es: "¿Qué tiene un Queueable que no tiene @future?", en: "What does a Queueable have that @future does not?" },
      options: [
        {
          es: "Un Id para seguirlo, estado propio (puede recibir registros) y la posibilidad de encolar el siguiente paso",
          en: "An Id to track it, its own state (it can receive records) and the ability to enqueue the next step",
        },
        { es: "Límites síncronos", en: "Synchronous limits" },
        { es: "Se ejecuta en el mismo guardado", en: "It runs in the same save" },
        { es: "Puede devolver un valor a quien lo encoló", en: "It can return a value to whoever enqueued it" },
      ],
      answer: 0,
      explain: {
        es: "Sigue siendo asíncrono: quien lo encola no recibe su resultado, pero sí un Id para consultarlo en AsyncApexJob.",
        en: "It is still asynchronous: whoever enqueues it does not get its result, but does get an Id to check it in AsyncApexJob.",
      },
    },
    {
      id: "m09-l03-q2",
      kind: "single",
      prompt: { es: "¿Qué hace esta línea?", en: "What does this line do?" },
      code: { es: "Id jobId = System.enqueueJob(new RenewalMigrationJob());", en: "Id jobId = System.enqueueJob(new RenewalMigrationJob());" },
      options: [
        { es: "Mete el trabajo en la cola y te da su Id para seguirlo", en: "Puts the job in the queue and gives you its Id to track it" },
        { es: "Ejecuta el trabajo ahora y espera a que termine", en: "Runs the job now and waits for it to finish" },
        { es: "Programa el trabajo para las 2:00", en: "Schedules the job for 2:00" },
        { es: "Crea un registro de RenewalMigrationJob en la base de datos", en: "Creates a RenewalMigrationJob record in the database" },
      ],
      answer: 0,
      explain: {
        es: "Encolar no es ejecutar: la línea termina al instante y el trabajo corre cuando le toca. Programarlo a una hora es la lección 5.",
        en: "Enqueueing is not running: the line finishes instantly and the job runs when its turn comes. Scheduling it for a time is lesson 5.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m09-l03-q3",
      kind: "single",
      prompt: {
        es: "Un trabajo consulta 200 filas sin procesar, las convierte en oportunidades y se encola otra vez, pero nunca marca las filas como procesadas. ¿Qué pasa?",
        en: "A job queries 200 unprocessed rows, turns them into opportunities and enqueues itself again, but never marks the rows as processed. What happens?",
      },
      options: [
        { es: "Cada vuelta procesa las mismas 200 filas: duplicados y una cadena que no para", en: "Each pass processes the same 200 rows: duplicates and a chain that never stops" },
        { es: "Salesforce las marca solo", en: "Salesforce marks them on its own" },
        { es: "La segunda vuelta falla por límites", en: "The second pass fails on limits" },
        { es: "Nada: la cadena se detiene a los 5 eslabones siempre", en: "Nothing: the chain always stops at 5 links" },
      ],
      answer: 0,
      explain: {
        es: "La consulta de la siguiente vuelta vuelve a encontrar las mismas filas. El tope de 5 solo existe en Developer Orgs y orgs de prueba.",
        en: "The next pass's query finds the same rows again. The 5-link cap only exists in Developer Orgs and trial orgs.",
      },
    },
    {
      id: "m09-l03-q4",
      kind: "text",
      prompt: {
        es: "Escribe la cabecera de una clase RenewalMigrationJob que se pueda encolar.",
        en: "Write the header of a RenewalMigrationJob class that can be enqueued.",
      },
      accept: ["(public\\s+)?class\\s+renewalmigrationjob\\s+implements\\s+queueable\\s*\\{?"],
      placeholder: { es: "public class …", en: "public class …" },
      explain: {
        es: "public class RenewalMigrationJob implements Queueable, y dentro, public void execute(QueueableContext ctx).",
        en: "public class RenewalMigrationJob implements Queueable, and inside, public void execute(QueueableContext ctx).",
      },
      tags: ["recall"],
    },
    {
      id: "m09-l03-q5",
      kind: "multi",
      prompt: { es: "¿Qué es cierto sobre encadenar Queueables?", en: "What is true about chaining Queueables?" },
      options: [
        { es: "Desde un execute se puede encolar un solo trabajo hijo", en: "From an execute you can enqueue a single child job" },
        { es: "Cada eslabón es una transacción nueva con su propio presupuesto", en: "Each link is a new transaction with its own budget" },
        { es: "En una Developer Org la cadena se corta a los 5 eslabones", en: "In a Developer Org the chain is cut at 5 links" },
        { es: "Todos los eslabones comparten los mismos límites", en: "All links share the same limits" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Uno por execute, presupuesto nuevo en cada eslabón y tope de 5 solo en orgs de desarrollo y prueba.",
        en: "One per execute, a fresh budget on each link and a cap of 5 only in development and trial orgs.",
      },
    },
    {
      id: "m09-l03-q6",
      kind: "single",
      prompt: {
        es: "Repaso: un Queueable implementa la interfaz Queueable. ¿Qué te obliga a hacer una interfaz?",
        en: "Review: a Queueable implements the Queueable interface. What does an interface force you to do?",
      },
      options: [
        { es: "Escribir todos sus métodos con la misma firma", en: "Write all its methods with the same signature" },
        { es: "Heredar sus atributos", en: "Inherit its attributes" },
        { es: "Marcar la clase como abstract", en: "Mark the class as abstract" },
        { es: "Nada: es opcional", en: "Nothing: it is optional" },
      ],
      answer: 0,
      explain: {
        es: "Es un contrato: execute(QueueableContext) con esa firma exacta. Por eso Salesforce sabe cómo arrancar cualquier Queueable.",
        en: "It is a contract: execute(QueueableContext) with that exact signature. That is why Salesforce knows how to start any Queueable.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M5 L10", en: "Review · M5 L10" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 3 DE 7 · El primer intento de la migración fue un método que consultaba todas las filas pendientes de ERP_Renewal__c de golpe: con 300.000, revienta al instante. Conviértelo en un Queueable que procese 200 filas por trabajo y se encole a sí mismo mientras queden filas.",
      en: "TASK 3 OF 7 · The migration's first attempt was a method querying every pending ERP_Renewal__c row at once: with 300,000, it blows up instantly. Turn it into a Queueable that processes 200 rows per job and enqueues itself while rows remain.",
    },
    brief: [
      {
        es: "public class RenewalMigrationJob implements Queueable, con public void execute(QueueableContext ctx).",
        en: "public class RenewalMigrationJob implements Queueable, with public void execute(QueueableContext ctx).",
      },
      {
        es: "En execute, consulta las filas con Processed__c = false, LIMIT 200, y pásalas a RenewalImporter.fromStaging(rows), que ya crea las renovaciones y las marca como procesadas.",
        en: "In execute, query the rows with Processed__c = false, LIMIT 200, and pass them to RenewalImporter.fromStaging(rows), which already creates the renewals and marks them as processed.",
      },
      {
        es: "Solo si la tanda sale llena (200 filas), encola un nuevo RenewalMigrationJob con System.enqueueJob.",
        en: "Only if the chunk comes out full (200 rows), enqueue a new RenewalMigrationJob with System.enqueueJob.",
      },
      {
        es: "Fuera de la clase, arranca la cadena guardando el Id que devuelve System.enqueueJob.",
        en: "Outside the class, start the chain storing the Id System.enqueueJob returns.",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, a escala
// Ya resuelto (tareas 1-2): cada pieza sabe dónde corre, y el ERP se entera de cada renovación.
// Tarea 3 de 7: la migración de 300.000 renovaciones, de 200 en 200.

public class RenewalMigration {
    public static void runAll() {
        List<ERP_Renewal__c> rows = [
            SELECT Id, ERP_Code__c, Amount__c
            FROM ERP_Renewal__c
            WHERE Processed__c = false
        ];
        RenewalImporter.fromStaging(rows);   // Módulo 8: crea las renovaciones y marca Processed__c
    }
}

RenewalMigration.runAll();
`,
      en: `// CASE: the ERP bridge, at scale
// Already solved (tasks 1-2): every piece knows where it runs, and the ERP hears about each renewal.
// Task 3 of 7: the migration of 300,000 renewals, 200 at a time.

public class RenewalMigration {
    public static void runAll() {
        List<ERP_Renewal__c> rows = [
            SELECT Id, ERP_Code__c, Amount__c
            FROM ERP_Renewal__c
            WHERE Processed__c = false
        ];
        RenewalImporter.fromStaging(rows);   // Module 8: creates the renewals and sets Processed__c
    }
}

RenewalMigration.runAll();
`,
    },
    hints: [
      {
        es: "Yo lo pensaría como una carga de Data Loader con tamaño de lote 200, pero sin nadie delante: cada tanda tiene que saber si queda otra y lanzarla ella misma.",
        en: "I would think of it as a Data Loader load with a batch size of 200, but with nobody at the keyboard: each chunk has to know whether another one remains and launch it itself.",
      },
      {
        es: "Lo que me ayudó: la consulta lleva LIMIT 200. Si devuelve 200 justas, seguramente quedan más; si devuelve menos, era la última. Esa es la condición del System.enqueueJob.",
        en: "What helped me: the query carries LIMIT 200. If it returns exactly 200, there are probably more; if fewer, it was the last one. That is the condition for System.enqueueJob.",
      },
      {
        es: "Te dejo el esquema: public class RenewalMigrationJob implements Queueable { public void execute(QueueableContext ctx) { List<ERP_Renewal__c> rows = [SELECT … WHERE Processed__c = false LIMIT 200]; RenewalImporter.fromStaging(rows); if (rows.size() == 200) { System.enqueueJob(new RenewalMigrationJob()); } } } · Id jobId = System.enqueueJob(new RenewalMigrationJob());",
        en: "Here is the outline: public class RenewalMigrationJob implements Queueable { public void execute(QueueableContext ctx) { List<ERP_Renewal__c> rows = [SELECT … WHERE Processed__c = false LIMIT 200]; RenewalImporter.fromStaging(rows); if (rows.size() == 200) { System.enqueueJob(new RenewalMigrationJob()); } } } · Id jobId = System.enqueueJob(new RenewalMigrationJob());",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m09-l03-c1",
        label: { es: "La clase implementa Queueable con su execute", en: "The class implements Queueable with its execute" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "class\\s+RenewalMigrationJob\\s+implements\\s+Queueable\\b" },
            { op: "match", pattern: "public\\s+void\\s+execute\\s*\\(\\s*QueueableContext\\s+\\w+\\s*\\)" },
          ],
        },
        onFail: {
          es: "public class RenewalMigrationJob implements Queueable { public void execute(QueueableContext ctx) { … } }",
          en: "public class RenewalMigrationJob implements Queueable { public void execute(QueueableContext ctx) { … } }",
        },
        otter: {
          es: "Es el contrato de la cola: implements Queueable, y Salesforce solo necesita saber una cosa, public void execute(QueueableContext ctx). Ahí dentro va el trabajo de cada tanda.",
          en: "It is the queue's contract: implements Queueable, and Salesforce only needs to know one thing, public void execute(QueueableContext ctx). Each chunk's work goes in there.",
        },
      },
      {
        id: "m09-l03-c2",
        label: { es: "Cada trabajo toma 200 filas pendientes", en: "Each job takes 200 pending rows" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "FROM\\s+ERP_Renewal__c\\s+WHERE\\s+Processed__c\\s*=\\s*false[^\\]]*LIMIT\\s+200" },
            { op: "match", pattern: "RenewalImporter\\s*\\.\\s*fromStaging\\s*\\(\\s*\\w+\\s*\\)" },
          ],
        },
        onFail: {
          es: "La consulta de execute necesita WHERE Processed__c = false y LIMIT 200, y el resultado va a RenewalImporter.fromStaging(rows).",
          en: "execute's query needs WHERE Processed__c = false and LIMIT 200, and the result goes to RenewalImporter.fromStaging(rows).",
        },
        otter: {
          es: "Es tu tamaño de lote de Data Loader: LIMIT 200 sobre las pendientes (Processed__c = false). Y el trabajo pesado ya lo sabe hacer RenewalImporter.fromStaging(rows).",
          en: "It is your Data Loader batch size: LIMIT 200 over the pending ones (Processed__c = false). And RenewalImporter.fromStaging(rows) already knows how to do the heavy work.",
        },
      },
      {
        id: "m09-l03-c3",
        label: { es: "Se encola otra vez solo si quedan filas", en: "It enqueues itself again only if rows remain" },
        rule: {
          op: "match",
          pattern: "if\\s*\\([^)]*\\.\\s*size\\s*\\(\\s*\\)[^)]*\\)\\s*\\{?\\s*System\\s*\\.\\s*enqueueJob\\s*\\(\\s*new\\s+RenewalMigrationJob\\s*\\(",
        },
        onFail: {
          es: "Dentro de execute: if (rows.size() == 200) { System.enqueueJob(new RenewalMigrationJob()); }",
          en: "Inside execute: if (rows.size() == 200) { System.enqueueJob(new RenewalMigrationJob()); }",
        },
        otter: {
          es: "La cadena necesita su condición de parada, como la condición de salida de un bucle: if (rows.size() == 200) { System.enqueueJob(new RenewalMigrationJob()); }. Tanda llena, queda más; tanda corta, era la última.",
          en: "The chain needs its stopping condition, like a loop's exit condition: if (rows.size() == 200) { System.enqueueJob(new RenewalMigrationJob()); }. Full chunk, more remain; short chunk, it was the last.",
        },
      },
      {
        id: "m09-l03-c4",
        label: { es: "La cadena se arranca y se guarda su Id", en: "The chain is started and its Id stored" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Id\\s+\\w+\\s*=\\s*System\\s*\\.\\s*enqueueJob\\s*\\(" },
            { op: "absent", pattern: "static\\s+void\\s+runAll" },
          ],
        },
        onFail: {
          es: "Quita runAll y arranca la cadena desde fuera: Id jobId = System.enqueueJob(new RenewalMigrationJob());",
          en: "Remove runAll and start the chain from outside: Id jobId = System.enqueueJob(new RenewalMigrationJob());",
        },
        otter: {
          es: "El método que lo hacía todo de golpe sobra. Arranca la cadena con Id jobId = System.enqueueJob(new RenewalMigrationJob()); y con ese Id la seguirás en Setup → Apex Jobs.",
          en: "The method that did everything at once is not needed. Start the chain with Id jobId = System.enqueueJob(new RenewalMigrationJob()); and with that Id you will follow it in Setup → Apex Jobs.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Cuántos eslabones hacen falta para 300.000 filas? ¿Y si mañana el importador puede con 1.000 por transacción?",
        en: "How many links are needed for 300,000 rows? And if tomorrow the importer can handle 1,000 per transaction?",
      },
    ],
    voice: "otter",
    outro: {
      es: "La migración ya avanza sola, 200 filas por trabajo. Pero una cadena de 1.500 eslabones es frágil: si uno falla, se para. En la tarea 4 conoces la herramienta hecha justo para esto, que trocea millones de filas por ti: Batch Apex.",
      en: "The migration now moves on its own, 200 rows per job. But a chain of 1,500 links is fragile: if one fails, it stops. In task 4 you meet the tool made exactly for this, which splits millions of rows for you: Batch Apex.",
    },
  },
};
