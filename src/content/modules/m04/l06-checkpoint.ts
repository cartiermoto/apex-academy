import type { Lesson } from "@/lib/types";

export const l06Checkpoint: Lesson = {
  id: "m04-l06",
  slug: "checkpoint",
  n: 6,
  kind: "checkpoint",
  minutes: 45,
  title: {
    es: "Checkpoint del Módulo 4",
    en: "Module 4 checkpoint",
  },
  summary: {
    es: "Repaso del módulo, un caso real de escalado de casos escrito para aguantar 200 registros, y tu primer choque controlado con un governor limit en la Developer Org.",
    en: "A module review, a real case-escalation job written to withstand 200 records, and your first controlled collision with a governor limit in the Developer Org.",
  },
  analogy: {
    es: "Revisar un Flow antes de activarlo pensando en la carga masiva del lunes",
    en: "Reviewing a Flow before activating it with Monday's mass load in mind",
  },
  objectives: [
    {
      es: "Aplicar la receta completa de DML seguro: juntar, consultar una vez, decidir en memoria, guardar una vez y revisar resultados.",
      en: "Apply the full safe-DML recipe: gather, query once, decide in memory, save once and check results.",
    },
    {
      es: "Elegir entre todo o nada, resultados parciales y savepoints según el negocio.",
      en: "Choose between all-or-nothing, partial results and savepoints based on the business.",
    },
    {
      es: "Provocar y leer un LimitException en una Developer Org.",
      en: "Trigger and read a LimitException in a Developer Org.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Con los Módulos 3 y 4 tienes las dos mitades de casi cualquier automatización: leer y escribir. A partir del Módulo 6 las meterás dentro de triggers, donde el volumen no lo eliges tú. Este checkpoint es el ensayo general.",
        en: "With Modules 3 and 4 you have both halves of almost any automation: reading and writing. From Module 6 you will put them inside triggers, where you do not choose the volume. This checkpoint is the dress rehearsal.",
      },
    },
    {
      type: "h",
      text: { es: "Lo que has aprendido, sub-lección a sub-lección", en: "What you learned, sub-lesson by sub-lesson" },
    },
    {
      type: "p",
      text: {
        es: "1 · DML. insert, update, delete, undelete y upsert son las operaciones de Data Loader. insert rellena el Id; update necesita el Id; upsert decide por un Id externo. Todo DML pasa por validaciones, flows y triggers.",
        en: "1 · DML. insert, update, delete, undelete and upsert are Data Loader's operations. insert fills in the Id; update needs the Id; upsert decides by an external Id. Every DML goes through validations, flows and triggers.",
      },
    },
    {
      type: "p",
      text: {
        es: "2 · Resultados parciales. La instrucción es todo o nada; Database.insert(lista, false) guarda lo que puede y devuelve un SaveResult por registro, en el mismo orden: tu success.csv y error.csv. Parcial nunca significa ignorar los errores.",
        en: "2 · Partial results. The statement is all or nothing; Database.insert(list, false) saves what it can and returns one SaveResult per record, in the same order: your success.csv and error.csv. Partial never means ignoring the errors.",
      },
    },
    {
      type: "p",
      text: {
        es: "3 · Bulkificación. Los registros llegan de 200 en 200. Ninguna consulta ni DML dentro de un bucle: juntar en un Set, consultar una vez con IN, trabajar en memoria, guardar una vez. Map para no duplicar Ids.",
        en: "3 · Bulkification. Records arrive 200 at a time. No query or DML inside a loop: gather in a Set, query once with IN, work in memory, save once. A Map to avoid duplicate Ids.",
      },
    },
    {
      type: "p",
      text: {
        es: "4 · Governor limits. 100 consultas, 150 DML, 50.000 filas leídas, 10.000 filas escritas, 10 s de CPU, 6 MB de heap, por transacción y compartidos con los flows. LimitException no se captura. La clase Limits mide.",
        en: "4 · Governor limits. 100 queries, 150 DML, 50,000 rows read, 10,000 rows written, 10 s of CPU, 6 MB of heap, per transaction and shared with flows. LimitException cannot be caught. The Limits class measures.",
      },
    },
    {
      type: "p",
      text: {
        es: "5 · Savepoints. Database.setSavepoint() marca y Database.rollback() vuelve: deshacer una parte y seguir. Cuestan DML, no devuelven límites y no borran los Ids de tus variables.",
        en: "5 · Savepoints. Database.setSavepoint() marks and Database.rollback() goes back: undo a part and carry on. They cost DML, do not give limits back and do not clear the Ids in your variables.",
      },
    },
    {
      type: "diagram",
      id: "m04-cp-recipe",
      caption: {
        es: "La receta de DML seguro. Cuando escribas un trigger en el Módulo 6, tendrá exactamente esta forma.",
        en: "The safe-DML recipe. When you write a trigger in Module 6, it will have exactly this shape.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "La lista de revisión que ya usas con Flow", en: "The review checklist you already use with Flow" },
      text: {
        es: "Antes de activar un Flow desencadenado por registro te preguntas: ¿hay Get Records o Update Records dentro de un Loop? ¿Qué pasa si Data Loader carga 200 registros? ¿Qué pasa si falla un Create Records? Son exactamente las tres preguntas de este módulo: bulkificación, límites y manejo de fallos. Hazte las mismas con cada bloque de Apex.",
        en: "Before activating a record-triggered Flow you ask yourself: is there a Get Records or Update Records inside a Loop? What happens if Data Loader loads 200 records? What happens if a Create Records fails? They are exactly this module's three questions: bulkification, limits and failure handling. Ask yourself the same ones for every block of Apex.",
      },
    },
    {
      type: "h",
      text: { es: "Ahora en tu Developer Org", en: "Now in your Developer Org" },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Solo en tu Developer Org", en: "Only in your Developer Org" },
      text: {
        es: "Todo lo que sigue escribe y borra registros de verdad. Hazlo en tu Developer Org o en un sandbox, nunca en la org de producción de tu empresa.",
        en: "Everything that follows writes and deletes real records. Do it in your Developer Org or a sandbox, never in your company's production org.",
      },
    },
    {
      type: "list",
      ordered: true,
      items: [
        {
          es: "En Developer Console → Debug → Open Execute Anonymous Window, ejecuta tu solución del ejercicio de la lección 1. Busca Nimbus Logistics en la interfaz: ahí están la cuenta y sus dos contactos.",
          en: "In Developer Console → Debug → Open Execute Anonymous Window, run your solution to lesson 1's exercise. Search for Nimbus Logistics in the UI: the account and its two contacts are there.",
        },
        {
          es: "Ejecuta delete [SELECT Id FROM Account WHERE Name = 'Nimbus Logistics']; y abre la Papelera: la cuenta está allí. Recupérala con undelete, usando ALL ROWS en la consulta.",
          en: "Run delete [SELECT Id FROM Account WHERE Name = 'Nimbus Logistics']; and open the Recycle Bin: the account is there. Restore it with undelete, using ALL ROWS in the query.",
        },
        {
          es: "Provoca el límite a propósito: for (Integer i = 0; i < 151; i++) { insert new Task(Subject = 'Prueba ' + i); }. Lee el error: «System.LimitException: Too many DML statements: 151». Luego busca las tareas «Prueba»: no hay ninguna. La transacción se deshizo entera.",
          en: "Trigger the limit on purpose: for (Integer i = 0; i < 151; i++) { insert new Task(Subject = 'Test ' + i); }. Read the error: “System.LimitException: Too many DML statements: 151”. Then search for the “Test” tasks: there are none. The whole transaction was undone.",
        },
        {
          es: "Ahora la versión bulkificada: añade las 151 tareas a una lista dentro del bucle y haz un solo insert fuera. Funciona. En el log, con Debug Only desmarcado, busca LIMIT_USAGE_FOR_NS: «Number of DML statements: 1 out of 150». Borra después esas tareas.",
          en: "Now the bulkified version: add the 151 tasks to a list inside the loop and do a single insert outside. It works. In the log, with Debug Only unticked, look for LIMIT_USAGE_FOR_NS: “Number of DML statements: 1 out of 150”. Delete those tasks afterwards.",
        },
        {
          es: "Guarda la clase LimitsReport de la lección 4 en Setup → Apex Classes → New, y llama a LimitsReport.log('fin') al final del ejercicio de este checkpoint.",
          en: "Save lesson 4's LimitsReport class in Setup → Apex Classes → New, and call LimitsReport.log('end') at the end of this checkpoint's exercise.",
        },
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "Lo que no traduces de la capa de datos del libro, al escribir: el INSERT construido como texto con los valores en su posición (Apex inserta objetos por nombre de campo), el UPDATE sin WHERE que cambia la tabla entera (update actúa solo sobre los Ids que le pasas), una conexión y una sentencia por cada clic (bulkificación), el catch que imprime y sigue (revisa los SaveResult o deja que la transacción se deshaga) y la ausencia de transacciones (Apex las trae de serie, con savepoints si los necesitas).",
        en: "What you do not translate from the book's data layer, on the writing side: the INSERT built as text with the values in position (Apex inserts objects by field name), the UPDATE with no WHERE that changes the whole table (update acts only on the Ids you pass), one connection and one statement per click (bulkification), the catch that prints and carries on (check the SaveResults or let the transaction roll back) and the lack of transactions (Apex has them built in, with savepoints when you need them).",
      },
    },
  ],

  quiz: [
    {
      id: "m04-l06-q1",
      kind: "single",
      prompt: {
        es: "Con 200 casos, ¿cuántas consultas y cuántos DML hace este código?",
        en: "With 200 cases, how many queries and how many DML does this code run?",
      },
      code: {
        es: `Set<Id> ids = new Set<Id>();
for (Case c : cases) { ids.add(c.AccountId); }
Map<Id, Account> accs = new Map<Id, Account>(
    [SELECT Id, Rating FROM Account WHERE Id IN :ids]);
for (Case c : cases) {
    if (accs.get(c.AccountId)?.Rating == 'Hot') { c.Priority = 'High'; }
}
update cases;`,
        en: `Set<Id> ids = new Set<Id>();
for (Case c : cases) { ids.add(c.AccountId); }
Map<Id, Account> accs = new Map<Id, Account>(
    [SELECT Id, Rating FROM Account WHERE Id IN :ids]);
for (Case c : cases) {
    if (accs.get(c.AccountId)?.Rating == 'Hot') { c.Priority = 'High'; }
}
update cases;`,
      },
      options: [
        { es: "1 consulta y 1 DML", en: "1 query and 1 DML" },
        { es: "200 consultas y 200 DML", en: "200 queries and 200 DML" },
        { es: "1 consulta y 200 DML", en: "1 query and 200 DML" },
      ],
      answer: 0,
      explain: {
        es: "La receta completa: el Set y el Map en memoria, una consulta con IN y un update de la lista. Con 1 caso o con 200, lo mismo.",
        en: "The full recipe: the Set and the Map in memory, one query with IN and one update of the list. With 1 case or 200, the same.",
      },
      tags: ["predict-output", "interleaving"],
    },
    {
      id: "m04-l06-q2",
      kind: "single",
      prompt: {
        es: "Importas 5.000 contactos desde un sistema externo. Algunos pueden venir con un correo mal formado. El negocio quiere los buenos guardados y una lista de los malos. ¿Cuál es la MEJOR opción?",
        en: "You are importing 5,000 contacts from an external system. Some may come with a malformed email. The business wants the good ones saved and a list of the bad ones. Which is the BEST option?",
      },
      options: [
        {
          es: "Database.insert(contacts, false) y recorrer los SaveResult para registrar los fallos.",
          en: "Database.insert(contacts, false) and walk the SaveResults to log the failures.",
        },
        {
          es: "insert contacts; para que si uno falla no se guarde ninguno.",
          en: "insert contacts; so that if one fails none is saved.",
        },
        {
          es: "Insertar cada contacto por separado en un bucle, con su propio try/catch.",
          en: "Insert each contact separately in a loop, each with its own try/catch.",
        },
      ],
      answer: 0,
      explain: {
        es: "Resultados parciales con revisión de errores: el success.csv y el error.csv del negocio. La tercera gastaría 5.000 instrucciones DML.",
        en: "Partial results with error review: the business's success.csv and error.csv. The third would spend 5,000 DML statements.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m04-l06-q3",
      kind: "multi",
      prompt: {
        es: "Revisas el código de un compañero. ¿Qué líneas son un problema? (Marca todas.)",
        en: "You are reviewing a colleague's code. Which lines are a problem? (Tick all.)",
      },
      code: {
        es: `for (Opportunity o : opps) {                                        // A
    Account a = [SELECT Id FROM Account WHERE Id = :o.AccountId];   // B
    a.Rating = 'Hot';                                               // C
    update a;                                                       // D
}`,
        en: `for (Opportunity o : opps) {                                        // A
    Account a = [SELECT Id FROM Account WHERE Id = :o.AccountId];   // B
    a.Rating = 'Hot';                                               // C
    update a;                                                       // D
}`,
      },
      options: [
        { es: "B: consulta dentro del bucle.", en: "B: query inside the loop." },
        { es: "D: DML dentro del bucle.", en: "D: DML inside the loop." },
        { es: "C: cambiar un campo dentro del bucle.", en: "C: changing a field inside the loop." },
        { es: "A: recorrer la lista.", en: "A: looping the list." },
      ],
      answers: [0, 1],
      explain: {
        es: "Recorrer y cambiar campos en memoria es trabajo normal dentro de un bucle. Lo que no puede estar dentro son los viajes a la base de datos.",
        en: "Looping and changing fields in memory is normal work inside a loop. What cannot be inside is the trips to the database.",
      },
      tags: ["find-error"],
    },
    {
      id: "m04-l06-q4",
      kind: "single",
      prompt: {
        es: "En tu Developer Org ejecutas un bucle que hace 151 inserts de Task. ¿Cuántas tareas quedan guardadas?",
        en: "In your Developer Org you run a loop doing 151 Task inserts. How many tasks remain saved?",
      },
      options: [
        { es: "Ninguna", en: "None" },
        { es: "150", en: "150" },
        { es: "151", en: "151" },
      ],
      answer: 0,
      explain: {
        es: "La 151 lanza LimitException, que no se puede capturar, y la transacción se deshace entera, incluidas las 150 anteriores.",
        en: "Number 151 throws LimitException, which cannot be caught, and the whole transaction is undone, including the previous 150.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m04-l06-q5",
      kind: "single",
      prompt: {
        es: "Tu clase de servicio tiene este método. ¿Qué cambiarías para que sea seguro en triggers?",
        en: "Your service class has this method. What would you change to make it trigger-safe?",
      },
      code: {
        es: `public static void escalate(Case c) {
    c.Priority = 'High';
    update c;
}`,
        en: `public static void escalate(Case c) {
    c.Priority = 'High';
    update c;
}`,
      },
      options: [
        {
          es: "Que reciba List<Case> y haga un solo update de la lista.",
          en: "Make it take List<Case> and do a single update of the list.",
        },
        {
          es: "Nada: basta con llamarlo dentro de un for.",
          en: "Nothing: just call it inside a for.",
        },
        {
          es: "Quitar el static.",
          en: "Remove the static.",
        },
      ],
      answer: 0,
      explain: {
        es: "Un método que guarda un solo registro invita a llamarlo en un bucle: el DML en bucle escondido un nivel más abajo. Los métodos de servicio reciben listas.",
        en: "A method that saves a single record invites being called in a loop: loop DML hidden one level down. Service methods take lists.",
      },
      tags: ["interleaving", "spaced"],
      from: { es: "Repaso · M5 L5", en: "Review · M5 L5" },
    },
    {
      id: "m04-l06-q6",
      kind: "single",
      prompt: {
        es: "¿Qué muestra este código si la cuenta tiene tres contactos?",
        en: "What does this code print if the account has three contacts?",
      },
      code: {
        es: `List<Contact> cs = [SELECT Id FROM Contact WHERE AccountId = :accId];
for (Contact c : cs) { c.Title = 'Decisor'; }
update cs;
System.debug(Limits.getDmlStatements() + ' / ' + Limits.getDmlRows());`,
        en: `List<Contact> cs = [SELECT Id FROM Contact WHERE AccountId = :accId];
for (Contact c : cs) { c.Title = 'Decision maker'; }
update cs;
System.debug(Limits.getDmlStatements() + ' / ' + Limits.getDmlRows());`,
      },
      options: [
        { es: "1 / 3", en: "1 / 3" },
        { es: "3 / 3", en: "3 / 3" },
        { es: "1 / 1", en: "1 / 1" },
      ],
      answer: 0,
      explain: {
        es: "Una instrucción DML, tres filas. Instrucciones y filas son dos contadores distintos.",
        en: "One DML statement, three rows. Statements and rows are two different counters.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m04-l06-q7",
      kind: "single",
      prompt: {
        es: "¿Qué herramienta del Módulo 3 es la base del paso «consultar una vez»?",
        en: "Which Module 3 tool is the foundation of the “query once” step?",
      },
      options: [
        { es: "WHERE Id IN :conjuntoDeIds", en: "WHERE Id IN :setOfIds" },
        { es: "SOSL con FIND", en: "SOSL with FIND" },
        { es: "Database.query con concatenación", en: "Database.query with concatenation" },
      ],
      answer: 0,
      explain: {
        es: "El enlace a una colección: una sola consulta responde por todos los registros del lote.",
        en: "Binding to a collection: a single query answers for every record in the batch.",
      },
      tags: ["spaced", "recall"],
      from: { es: "Repaso · M3 L4", en: "Review · M3 L4" },
    },
    {
      id: "m04-l06-q8",
      kind: "text",
      prompt: {
        es: "¿Qué número de instrucciones DML permite una transacción síncrona?",
        en: "How many DML statements does a synchronous transaction allow?",
      },
      accept: ["^\\s*150\\s*$"],
      placeholder: { es: "número", en: "number" },
      explain: {
        es: "150. Y 100 consultas SOQL. Dos números que vas a recordar toda tu carrera.",
        en: "150. And 100 SOQL queries. Two numbers you will remember for your whole career.",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "Cada mañana, Soporte quiere escalar automáticamente los casos creados ayer cuyas cuentas son Hot: ponerlos en prioridad High y crear una tarea de seguimiento para el propietario de cada caso. El proceso tiene que aguantar 200 casos, y un caso que no se pueda actualizar no debe impedir que se escalen los demás.",
      en: "Every morning, Support wants to automatically escalate yesterday's cases whose accounts are Hot: set them to High priority and create a follow-up task for each case's owner. The process has to withstand 200 cases, and a case that cannot be updated must not stop the others from being escalated.",
    },
    brief: [
      {
        es: "Consulta los casos creados ayer con Id, Priority, AccountId y OwnerId.",
        en: "Query the cases created yesterday with Id, Priority, AccountId and OwnerId.",
      },
      {
        es: "Junta los AccountId en un Set y trae de una vez las cuentas Hot a un Map<Id, Account> hotAccounts.",
        en: "Gather the AccountIds in a Set and fetch the Hot accounts in one go into a Map<Id, Account> hotAccounts.",
      },
      {
        es: "Para cada caso de cuenta Hot que no sea ya High: prioridad High, añádelo a List<Case> escalated y crea una Task en List<Task> tasks (WhatId = caso, OwnerId = propietario del caso, Subject y ActivityDate hoy).",
        en: "For each Hot-account case not already High: priority High, add it to List<Case> escalated and create a Task in List<Task> tasks (WhatId = case, OwnerId = case owner, Subject and ActivityDate today).",
      },
      {
        es: "Guarda los casos con resultados parciales y cuenta los fallos en failed. Inserta las tareas con una sola instrucción.",
        en: "Save the cases with partial results and count the failures in failed. Insert the tasks with a single statement.",
      },
    ],
    starter: {
      es: `// 1. Casos de ayer


// 2. Cuentas Hot de esos casos


// 3. Decidir en memoria


// 4. Guardar y revisar
`,
      en: `// 1. Yesterday's cases


// 2. Hot accounts of those cases


// 3. Decide in memory


// 4. Save and check
`,
    },
    hints: [
      {
        es: "Es la receta del diagrama, paso a paso: juntar, consultar una vez, decidir en memoria, guardar una vez, revisar.",
        en: "It is the diagram's recipe, step by step: gather, query once, decide in memory, save once, check.",
      },
      {
        es: "YESTERDAY es un literal de fecha. El Map se construye directamente con la consulta (WHERE Id IN :accountIds AND Rating = 'Hot'), y en el bucle preguntas hotAccounts.containsKey(c.AccountId).",
        en: "YESTERDAY is a date literal. The Map is built straight from the query (WHERE Id IN :accountIds AND Rating = 'Hot'), and in the loop you ask hotAccounts.containsKey(c.AccountId).",
      },
      {
        es: "Pseudocódigo: … for (Case c : cases) { if (hotAccounts.containsKey(c.AccountId) && c.Priority != 'High') { c.Priority = 'High'; escalated.add(c); tasks.add(new Task(WhatId = c.Id, OwnerId = c.OwnerId, Subject = '…', ActivityDate = Date.today())); } } List<Database.SaveResult> results = Database.update(escalated, false); … insert tasks;",
        en: "Pseudocode: … for (Case c : cases) { if (hotAccounts.containsKey(c.AccountId) && c.Priority != 'High') { c.Priority = 'High'; escalated.add(c); tasks.add(new Task(WhatId = c.Id, OwnerId = c.OwnerId, Subject = '…', ActivityDate = Date.today())); } } List<Database.SaveResult> results = Database.update(escalated, false); … insert tasks;",
      },
    ],
    solution: {
      es: `// 1. Casos de ayer
List<Case> cases = [
    SELECT Id, Priority, AccountId, OwnerId
    FROM Case
    WHERE CreatedDate = YESTERDAY
];

// 2. Cuentas Hot de esos casos
Set<Id> accountIds = new Set<Id>();
for (Case c : cases) {
    accountIds.add(c.AccountId);
}
Map<Id, Account> hotAccounts = new Map<Id, Account>(
    [SELECT Id FROM Account WHERE Id IN :accountIds AND Rating = 'Hot']
);

// 3. Decidir en memoria
List<Case> escalated = new List<Case>();
List<Task> tasks = new List<Task>();
for (Case c : cases) {
    if (hotAccounts.containsKey(c.AccountId) && c.Priority != 'High') {
        c.Priority = 'High';
        escalated.add(c);
        tasks.add(new Task(
            WhatId = c.Id,
            OwnerId = c.OwnerId,
            Subject = 'Revisar caso escalado',
            ActivityDate = Date.today()
        ));
    }
}

// 4. Guardar y revisar
List<Database.SaveResult> results = Database.update(escalated, false);
Integer failed = 0;
for (Database.SaveResult sr : results) {
    if (!sr.isSuccess()) {
        failed++;
    }
}
insert tasks;

System.debug('Escalados: ' + escalated.size() + ' · fallidos: ' + failed);`,
      en: `// 1. Yesterday's cases
List<Case> cases = [
    SELECT Id, Priority, AccountId, OwnerId
    FROM Case
    WHERE CreatedDate = YESTERDAY
];

// 2. Hot accounts of those cases
Set<Id> accountIds = new Set<Id>();
for (Case c : cases) {
    accountIds.add(c.AccountId);
}
Map<Id, Account> hotAccounts = new Map<Id, Account>(
    [SELECT Id FROM Account WHERE Id IN :accountIds AND Rating = 'Hot']
);

// 3. Decide in memory
List<Case> escalated = new List<Case>();
List<Task> tasks = new List<Task>();
for (Case c : cases) {
    if (hotAccounts.containsKey(c.AccountId) && c.Priority != 'High') {
        c.Priority = 'High';
        escalated.add(c);
        tasks.add(new Task(
            WhatId = c.Id,
            OwnerId = c.OwnerId,
            Subject = 'Review escalated case',
            ActivityDate = Date.today()
        ));
    }
}

// 4. Save and check
List<Database.SaveResult> results = Database.update(escalated, false);
Integer failed = 0;
for (Database.SaveResult sr : results) {
    if (!sr.isSuccess()) {
        failed++;
    }
}
insert tasks;

System.debug('Escalated: ' + escalated.size() + ' · failed: ' + failed);`,
    },
    checks: [
      {
        id: "m04-l06-c1",
        label: {
          es: "Casos de ayer con AccountId y OwnerId",
          en: "Yesterday's cases with AccountId and OwnerId",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "SELECT[^\\]]*\\bAccountId\\b[^\\]]*FROM\\s+Case\\b" },
            { op: "match", pattern: "SELECT[^\\]]*\\bOwnerId\\b[^\\]]*FROM\\s+Case\\b" },
            { op: "match", pattern: "FROM\\s+Case\\s+WHERE[^\\]]*CreatedDate\\s*=\\s*YESTERDAY\\b" },
          ],
        },
        onFail: {
          es: "[SELECT Id, Priority, AccountId, OwnerId FROM Case WHERE CreatedDate = YESTERDAY]",
          en: "[SELECT Id, Priority, AccountId, OwnerId FROM Case WHERE CreatedDate = YESTERDAY]",
        },
      },
      {
        id: "m04-l06-c2",
        label: {
          es: "Las cuentas Hot se traen de una vez a un Map",
          en: "Hot accounts are fetched in one go into a Map",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Set\\s*<\\s*Id\\s*>\\s+accountIds\\b" },
            { op: "match", pattern: "Map\\s*<\\s*Id\\s*,\\s*Account\\s*>\\s+hotAccounts\\s*=\\s*new\\s+Map\\s*<\\s*Id\\s*,\\s*Account\\s*>\\s*\\(\\s*\\[" },
            { op: "match", pattern: "Id\\s+IN\\s*:\\s*accountIds[^\\]]*Rating\\s*=\\s*'Hot'|Rating\\s*=\\s*'Hot'[^\\]]*Id\\s+IN\\s*:\\s*accountIds" },
          ],
        },
        onFail: {
          es: "new Map<Id, Account>([SELECT Id FROM Account WHERE Id IN :accountIds AND Rating = 'Hot'])",
          en: "new Map<Id, Account>([SELECT Id FROM Account WHERE Id IN :accountIds AND Rating = 'Hot'])",
        },
      },
      {
        id: "m04-l06-c3",
        label: {
          es: "Decide en memoria: escala y prepara la tarea con su dueño",
          en: "Decides in memory: escalates and prepares the task with its owner",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "hotAccounts\\.containsKey\\(\\s*\\w+\\.AccountId\\s*\\)" },
            { op: "match", pattern: "\\.Priority\\s*!=\\s*'High'" },
            { op: "match", pattern: "escalated\\.add\\(" },
            { op: "match", pattern: "new\\s+Task\\([^;]*WhatId\\s*=\\s*\\w+\\.Id" },
            { op: "match", pattern: "new\\s+Task\\([^;]*OwnerId\\s*=\\s*\\w+\\.OwnerId" },
          ],
        },
        onFail: {
          es: "En el bucle: if (hotAccounts.containsKey(c.AccountId) && c.Priority != 'High') { … escalated.add(c); tasks.add(new Task(WhatId = c.Id, OwnerId = c.OwnerId, …)); }",
          en: "In the loop: if (hotAccounts.containsKey(c.AccountId) && c.Priority != 'High') { … escalated.add(c); tasks.add(new Task(WhatId = c.Id, OwnerId = c.OwnerId, …)); }",
        },
      },
      {
        id: "m04-l06-c4",
        label: {
          es: "Casos con resultados parciales y fallos contados",
          en: "Cases saved with partial results and failures counted",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Database\\.update\\(\\s*escalated\\s*,\\s*false\\s*\\)" },
            { op: "match", pattern: "Integer\\s+failed\\s*=\\s*0\\s*;" },
            { op: "match", pattern: "failed\\s*\\+\\+|failed\\s*\\+=\\s*1" },
          ],
        },
        onFail: {
          es: "List<Database.SaveResult> results = Database.update(escalated, false); y cuenta con failed++ los que no son isSuccess().",
          en: "List<Database.SaveResult> results = Database.update(escalated, false); and count with failed++ the ones that are not isSuccess().",
        },
      },
      {
        id: "m04-l06-c5",
        label: {
          es: "Bulkificado: dos consultas, nada de base de datos dentro de los bucles, un insert de tareas",
          en: "Bulkified: two queries, no database work inside loops, one task insert",
        },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "\\[\\s*SELECT\\b", min: 2, max: 2 },
            { op: "absent", pattern: "(for|while)\\s*\\([^)]*\\)\\s*\\{[^{}]*\\[\\s*SELECT\\b" },
            { op: "absent", pattern: "(for|while)\\s*\\([^)]*\\)\\s*\\{[^{}]*\\b(insert|update|delete|upsert)\\s+[\\w.()]+\\s*;" },
            { op: "count", pattern: "\\binsert\\s+tasks\\s*;", min: 1, max: 1 },
          ],
        },
        onFail: {
          es: "Exactamente dos consultas, ninguna dentro de un bucle, y un único insert tasks; al final.",
          en: "Exactly two queries, none inside a loop, and a single insert tasks; at the end.",
        },
        onPass: {
          es: "Dos consultas y dos DML, sean 3 casos o 200. Este bloque ya se puede meter en un trigger del Módulo 6.",
          en: "Two queries and two DML, whether 3 cases or 200. This block can go straight into a Module 6 trigger.",
        },
      },
    ],
    rubric: [
      {
        es: "Ahora las tareas se crean aunque su caso no se haya podido actualizar. ¿Cómo usarías los SaveResult para crear tareas solo de los casos que sí se escalaron?",
        en: "Right now the tasks are created even if their case could not be updated. How would you use the SaveResults to create tasks only for the cases that were actually escalated?",
      },
    ],
  },
};
