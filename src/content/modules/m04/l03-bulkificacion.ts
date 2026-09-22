import type { Lesson } from "@/lib/types";

export const l03Bulkificacion: Lesson = {
  id: "m04-l03",
  slug: "bulkificacion",
  n: 3,
  kind: "lesson",
  minutes: 35,
  title: {
    es: "Bulkificación",
    en: "Bulkification",
  },
  summary: {
    es: "Escribir código que hace el mismo número de consultas y de DML con un registro que con doscientos. La receta es siempre la misma: juntar, consultar una vez, trabajar en memoria, guardar una vez.",
    en: "Writing code that runs the same number of queries and DML with one record as with two hundred. The recipe is always the same: gather, query once, work in memory, save once.",
  },
  analogy: {
    es: "En Flow: asignar a una colección dentro del Loop y un solo Update Records después",
    en: "In Flow: assign to a collection inside the Loop and a single Update Records afterwards",
  },
  objectives: [
    {
      es: "Reconocer consultas y DML dentro de bucles y explicar por qué fallan con volumen.",
      en: "Spot queries and DML inside loops and explain why they fail at volume.",
    },
    {
      es: "Aplicar la receta juntar → consultar una vez → trabajar en memoria → guardar una vez.",
      en: "Apply the recipe gather → query once → work in memory → save once.",
    },
    {
      es: "Evitar Ids duplicados en una lista de update usando Set o Map.",
      en: "Avoid duplicate Ids in an update list by using a Set or a Map.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Casi todo el código de este curso funciona con un registro. La pregunta que separa el código de práctica del código de producción es otra: ¿funciona con doscientos a la vez? En Salesforce, esa pregunta no es teórica, porque doscientos a la vez es lo normal.",
        en: "Almost all the code in this course works with one record. The question that separates practice code from production code is a different one: does it work with two hundred at once? In Salesforce, that question is not theoretical, because two hundred at once is normal.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "En Data Loader, en Settings, hay un «Batch size» que por defecto es 200. Cuando cargas 10.000 oportunidades, Salesforce las guarda en [[lote|lotes]] de 200, y cada lote es una transacción: tus triggers y flows reciben 200 registros de golpe, no uno. Lo mismo pasa con una actualización masiva desde una list view o con una integración. Tu código tiene que estar escrito pensando en ese lote.",
        en: "In Data Loader, under Settings, there is a “Batch size” that defaults to 200. When you load 10,000 opportunities, Salesforce saves them in [[lote|batches]] of 200, and each batch is one transaction: your triggers and flows receive 200 records at once, not one. The same happens with a mass update from a list view or with an integration. Your code has to be written with that batch in mind.",
      },
    },
    {
      type: "h",
      text: { es: "El código que funciona… hasta que no", en: "The code that works… until it does not" },
    },
    {
      type: "code",
      code: {
        es: `// Marcar como Hot las cuentas de las oportunidades ganadas hoy
List<Opportunity> wonToday = [SELECT Id, AccountId FROM Opportunity
                              WHERE IsWon = true AND CloseDate = TODAY];

for (Opportunity o : wonToday) {
    Account acc = [SELECT Id, Rating FROM Account WHERE Id = :o.AccountId];  // ❌ consulta en el bucle
    acc.Rating = 'Hot';
    update acc;                                                              // ❌ DML en el bucle
}`,
        en: `// Mark as Hot the accounts of opportunities won today
List<Opportunity> wonToday = [SELECT Id, AccountId FROM Opportunity
                              WHERE IsWon = true AND CloseDate = TODAY];

for (Opportunity o : wonToday) {
    Account acc = [SELECT Id, Rating FROM Account WHERE Id = :o.AccountId];  // ❌ query in the loop
    acc.Rating = 'Hot';
    update acc;                                                              // ❌ DML in the loop
}`,
      },
      caption: {
        es: "Con 3 oportunidades: 4 consultas y 3 DML. Con 150: 151 consultas y la transacción muere en la 101.",
        en: "With 3 opportunities: 4 queries and 3 DML. With 150: 151 queries and the transaction dies at 101.",
      },
    },
    {
      type: "p",
      text: {
        es: "Este código pasa cualquier prueba hecha a mano, porque a mano ganas una oportunidad cada vez. El día que Ventas cierra el trimestre con una carga masiva, falla. Y falla entero: la [[governor-limits|LimitException]] no se puede capturar, así que se deshace todo lo que había hecho la transacción, incluido lo que guardaron los flows.",
        en: "This code passes any test done by hand, because by hand you win one opportunity at a time. The day Sales closes the quarter with a mass load, it fails. And it fails completely: the [[governor-limits|LimitException]] cannot be caught, so everything the transaction had done is undone, including what the flows saved.",
      },
    },
    {
      type: "h",
      text: { es: "La receta en cuatro pasos", en: "The four-step recipe" },
    },
    {
      type: "diagram",
      id: "m04-bulk",
      caption: {
        es: "A la izquierda, un viaje a la base de datos por registro. A la derecha, dos viajes para todos.",
        en: "On the left, one trip to the database per record. On the right, two trips for all of them.",
      },
    },
    {
      type: "code",
      code: {
        es: `List<Opportunity> wonToday = [SELECT Id, AccountId FROM Opportunity
                              WHERE IsWon = true AND CloseDate = TODAY];

// 1. Juntar: los Ids que necesitas, sin repetir
Set<Id> accountIds = new Set<Id>();
for (Opportunity o : wonToday) {
    accountIds.add(o.AccountId);
}

// 2. Consultar una vez
List<Account> accounts = [SELECT Id, Rating FROM Account WHERE Id IN :accountIds];

// 3. Trabajar en memoria
for (Account a : accounts) {
    a.Rating = 'Hot';
}

// 4. Guardar una vez
update accounts;`,
        en: `List<Opportunity> wonToday = [SELECT Id, AccountId FROM Opportunity
                              WHERE IsWon = true AND CloseDate = TODAY];

// 1. Gather: the Ids you need, no repeats
Set<Id> accountIds = new Set<Id>();
for (Opportunity o : wonToday) {
    accountIds.add(o.AccountId);
}

// 2. Query once
List<Account> accounts = [SELECT Id, Rating FROM Account WHERE Id IN :accountIds];

// 3. Work in memory
for (Account a : accounts) {
    a.Rating = 'Hot';
}

// 4. Save once
update accounts;`,
      },
      caption: {
        es: "Con 3 oportunidades: 2 consultas y 1 DML. Con 200: 2 consultas y 1 DML.",
        en: "With 3 opportunities: 2 queries and 1 DML. With 200: 2 queries and 1 DML.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Flow te enseñó esto primero", en: "Flow taught you this first" },
      text: {
        es: "La buena práctica de Flow es idéntica: dentro del Loop no pones Update Records; pones un Assignment que añade el registro a una variable de colección, y después del Loop, un único Update Records con esa colección. Si alguna vez lo hiciste así, ya sabes [[bulkificacion|bulkificar]]. La diferencia es que en Flow Builder te avisa del error, mientras que en Apex la responsabilidad es tuya.",
        en: "Flow's best practice is identical: inside the Loop you do not place Update Records; you place an Assignment that adds the record to a collection variable, and after the Loop, a single Update Records with that collection. If you ever did it that way, you already know how to [[bulkificacion|bulkify]]. The difference is that Flow Builder warns you about the mistake, while in Apex the responsibility is yours.",
      },
    },
    {
      type: "h",
      text: { es: "La trampa del Id duplicado", en: "The duplicate Id trap" },
    },
    {
      type: "p",
      text: {
        es: "Si dos oportunidades ganadas son de la misma cuenta y vas añadiendo cuentas a una List dentro del bucle, la lista acaba con la misma cuenta dos veces. update de una lista con Ids repetidos falla con «Duplicate id in list». Por eso el paso 1 usa un Set: guarda cada Id una sola vez. Si además necesitas ir modificando los registros mientras recorres, usa un Map<Id, Account>: put con la misma clave sustituye en lugar de duplicar, y al final haces update mapa.values().",
        en: "If two won opportunities belong to the same account and you keep adding accounts to a List inside the loop, the list ends up with the same account twice. An update of a list with repeated Ids fails with “Duplicate id in list”. That is why step 1 uses a Set: it keeps each Id only once. If you also need to modify records as you go, use a Map<Id, Account>: put with the same key replaces instead of duplicating, and at the end you do update map.values().",
      },
    },
    {
      type: "code",
      code: {
        es: `Map<Id, Account> toUpdate = new Map<Id, Account>();
for (Opportunity o : wonToday) {
    toUpdate.put(o.AccountId, new Account(Id = o.AccountId, Rating = 'Hot'));
}
update toUpdate.values();   // cada cuenta una sola vez, sin haberla consultado`,
        en: `Map<Id, Account> toUpdate = new Map<Id, Account>();
for (Opportunity o : wonToday) {
    toUpdate.put(o.AccountId, new Account(Id = o.AccountId, Rating = 'Hot'));
}
update toUpdate.values();   // each account once, without having queried it`,
      },
      caption: {
        es: "Aquí ni siquiera hace falta consultar: el update sin consulta de la lección 1, combinado con el Map del Módulo 1.",
        en: "Here there is not even a need to query: lesson 1's update without a query, combined with Module 1's Map.",
      },
    },
    {
      type: "h",
      text: { es: "Cómo detectar código sin bulkificar", en: "How to spot unbulkified code" },
    },
    {
      type: "list",
      items: [
        {
          es: "Un corchete de consulta [SELECT … ] dentro de las llaves de un for o de un while.",
          en: "A query bracket [SELECT … ] inside the braces of a for or a while.",
        },
        {
          es: "insert, update, delete o upsert dentro de un bucle, o Database.insert/update llamados dentro.",
          en: "insert, update, delete or upsert inside a loop, or Database.insert/update called inside.",
        },
        {
          es: "Un método que recibe un solo registro (Account acc) y hace una consulta o un DML, llamado desde un bucle. Es el mismo error escondido un nivel más abajo: los métodos bien diseñados reciben listas.",
          en: "A method that takes a single record (Account acc) and does a query or DML, called from a loop. It is the same mistake hidden one level down: well-designed methods take lists.",
        },
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "El formulario de facturas del libro crea un objeto DatosBDproductos y abre una conexión nueva cada vez que pulsas «Agregar», y su método grabar recorre toda la tabla antes de insertar un solo producto. En una aplicación de escritorio con un usuario, eso solo es lento. En Salesforce, donde un mismo guardado puede traer 200 registros y los límites se cuentan por transacción, ese estilo de «un viaje a la base de datos por cada cosa» es exactamente lo que la bulkificación prohíbe.",
        en: "The book's invoice form creates a DatosBDproductos object and opens a new connection every time you press “Add”, and its grabar method walks the whole table before inserting a single product. In a single-user desktop app, that is merely slow. In Salesforce, where one save can bring 200 records and limits are counted per transaction, that “one trip to the database per thing” style is exactly what bulkification forbids.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: di los cuatro pasos de la receta. ¿Por qué el paso 1 usa un Set y no una List? ¿Qué error da un update con el mismo Id dos veces?",
        en: "Without looking: say the recipe's four steps. Why does step 1 use a Set and not a List? What error does an update with the same Id twice give?",
      },
    },
  ],

  quiz: [
    {
      id: "m04-l03-q1",
      kind: "single",
      prompt: {
        es: "Un usuario carga 1.000 contactos con Data Loader con el tamaño de lote por defecto. ¿Cuántos registros recibe cada ejecución de tu trigger?",
        en: "A user loads 1,000 contacts with Data Loader using the default batch size. How many records does each run of your trigger receive?",
      },
      options: [
        { es: "Hasta 200", en: "Up to 200" },
        { es: "1", en: "1" },
        { es: "1.000", en: "1,000" },
      ],
      answer: 0,
      explain: {
        es: "Lotes de 200: cinco transacciones de 200 registros cada una. Tu código tiene que aguantar 200 a la vez.",
        en: "Batches of 200: five transactions of 200 records each. Your code must cope with 200 at once.",
      },
      tags: ["recall"],
    },
    {
      id: "m04-l03-q2",
      kind: "single",
      prompt: {
        es: "¿Cuántas consultas SOQL lanza este código con 80 casos?",
        en: "How many SOQL queries does this code run with 80 cases?",
      },
      code: {
        es: `List<Case> cases = [SELECT Id, ContactId FROM Case WHERE Status = 'New'];
for (Case c : cases) {
    Contact ct = [SELECT Email FROM Contact WHERE Id = :c.ContactId];
}`,
        en: `List<Case> cases = [SELECT Id, ContactId FROM Case WHERE Status = 'New'];
for (Case c : cases) {
    Contact ct = [SELECT Email FROM Contact WHERE Id = :c.ContactId];
}`,
      },
      options: [
        { es: "81", en: "81" },
        { es: "2", en: "2" },
        { es: "80", en: "80" },
      ],
      answer: 0,
      explain: {
        es: "Una fuera del bucle más una por vuelta. Todavía cabe en 100, pero con 100 casos ya no. Con la receta serían 2 siempre.",
        en: "One outside the loop plus one per iteration. It still fits within 100, but with 100 cases it does not. With the recipe it would always be 2.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m04-l03-q3",
      kind: "single",
      prompt: {
        es: "¿Qué pasa con este código si dos oportunidades son de la misma cuenta?",
        en: "What happens with this code if two opportunities belong to the same account?",
      },
      code: {
        es: `List<Account> toUpdate = new List<Account>();
for (Opportunity o : wonToday) {
    toUpdate.add(new Account(Id = o.AccountId, Rating = 'Hot'));
}
update toUpdate;`,
        en: `List<Account> toUpdate = new List<Account>();
for (Opportunity o : wonToday) {
    toUpdate.add(new Account(Id = o.AccountId, Rating = 'Hot'));
}
update toUpdate;`,
      },
      options: [
        {
          es: "Falla: «Duplicate id in list».",
          en: "It fails: “Duplicate id in list”.",
        },
        { es: "Actualiza la cuenta dos veces sin problema.", en: "It updates the account twice with no problem." },
        { es: "Apex quita el duplicado automáticamente.", en: "Apex removes the duplicate automatically." },
      ],
      answer: 0,
      explain: {
        es: "Una List admite repetidos; un update no. Usa un Map<Id, Account> y update toUpdate.values().",
        en: "A List accepts repeats; an update does not. Use a Map<Id, Account> and update toUpdate.values().",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M1 L8", en: "Review · M1 L8" },
    },
    {
      id: "m04-l03-q4",
      kind: "single",
      prompt: {
        es: "En un Flow desencadenado por registro necesitas actualizar un campo en muchos registros relacionados. ¿Cuál es la MEJOR forma, y cuál es su equivalente en Apex?",
        en: "In a record-triggered Flow you need to update a field on many related records. What is the BEST way, and what is its Apex equivalent?",
      },
      options: [
        {
          es: "Assignment a una colección dentro del Loop y un Update Records después: en Apex, añadir a una lista o mapa y un solo update fuera del bucle.",
          en: "Assignment to a collection inside the Loop and one Update Records afterwards: in Apex, add to a list or map and a single update outside the loop.",
        },
        {
          es: "Update Records dentro del Loop: en Apex, update dentro del for.",
          en: "Update Records inside the Loop: in Apex, update inside the for.",
        },
        {
          es: "Un subflow por registro: en Apex, un método que hace update de un registro.",
          en: "One subflow per record: in Apex, a method that updates one record.",
        },
      ],
      answer: 0,
      explain: {
        es: "Es la misma receta en las dos herramientas. La tercera parece distinta pero esconde el mismo DML por registro.",
        en: "It is the same recipe in both tools. The third looks different but hides the same per-record DML.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m04-l03-q5",
      kind: "multi",
      prompt: {
        es: "¿Cuáles de estas señales indican código sin bulkificar?",
        en: "Which of these signs point to unbulkified code?",
      },
      options: [
        { es: "Un [SELECT ...] dentro de un for.", en: "A [SELECT ...] inside a for." },
        { es: "Un update dentro de un for.", en: "An update inside a for." },
        {
          es: "Un método updateRating(Account a) que hace update, llamado desde un for.",
          en: "An updateRating(Account a) method that does an update, called from a for.",
        },
        { es: "Un Set<Id> que se rellena dentro de un for.", en: "A Set<Id> filled inside a for." },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Rellenar un Set en un bucle es el paso 1 de la receta: perfecto. Lo peligroso son los viajes a la base de datos dentro, aunque estén escondidos en un método.",
        en: "Filling a Set in a loop is step 1 of the recipe: perfect. What is dangerous are the trips to the database inside, even when hidden in a method.",
      },
      tags: ["find-error", "spaced"],
      from: { es: "Repaso · M5 L1", en: "Review · M5 L1" },
    },
    {
      id: "m04-l03-q6",
      kind: "text",
      prompt: {
        es: "Con un Map<Id, Account> llamado toUpdate, ¿qué escribes para guardar todas sus cuentas con una sola instrucción?",
        en: "With a Map<Id, Account> called toUpdate, what do you write to save all its accounts in a single statement?",
      },
      accept: ["^\\s*update\\s+toUpdate\\.values\\(\\s*\\)\\s*;?\\s*$"],
      placeholder: { es: "instrucción", en: "statement" },
      explain: {
        es: "update toUpdate.values(); — values() devuelve la lista de registros del mapa, cada uno una vez.",
        en: "update toUpdate.values(); — values() returns the map's records as a list, each one once.",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "Este es el código que un compañero subió para marcar como Hot las cuentas de las oportunidades ganadas hoy. En la demo funcionó; el primer cierre de trimestre, con 180 oportunidades ganadas en una carga, reventó. Bulkifícalo.",
      en: "This is the code a colleague deployed to mark as Hot the accounts of opportunities won today. In the demo it worked; on the first quarter close, with 180 opportunities won in one load, it blew up. Bulkify it.",
    },
    brief: [
      {
        es: "Ninguna consulta ni ningún DML dentro de un bucle.",
        en: "No query and no DML inside any loop.",
      },
      {
        es: "Junta los AccountId en un Set<Id> accountIds.",
        en: "Gather the AccountIds into a Set<Id> accountIds.",
      },
      {
        es: "Cada cuenta tiene que acabar con Rating 'Hot', y cada una se actualiza una sola vez.",
        en: "Every account must end up with Rating 'Hot', and each is updated only once.",
      },
      {
        es: "Una sola instrucción update en todo el código.",
        en: "A single update statement in the whole code.",
      },
    ],
    starter: {
      es: `List<Opportunity> wonToday = [SELECT Id, AccountId FROM Opportunity
                              WHERE IsWon = true AND CloseDate = TODAY];

for (Opportunity o : wonToday) {
    Account acc = [SELECT Id, Rating FROM Account WHERE Id = :o.AccountId];
    acc.Rating = 'Hot';
    update acc;
}
`,
      en: `List<Opportunity> wonToday = [SELECT Id, AccountId FROM Opportunity
                              WHERE IsWon = true AND CloseDate = TODAY];

for (Opportunity o : wonToday) {
    Account acc = [SELECT Id, Rating FROM Account WHERE Id = :o.AccountId];
    acc.Rating = 'Hot';
    update acc;
}
`,
    },
    hints: [
      {
        es: "Dentro del bucle solo debe quedar trabajo en memoria. Todo lo que va a la base de datos sale fuera.",
        en: "Only in-memory work should remain inside the loop. Everything that goes to the database moves out.",
      },
      {
        es: "Paso 1: el Set. Paso 2: una consulta con IN :accountIds (o ninguna, usando new Account(Id = ..., Rating = 'Hot')). Paso 3: cambiar Rating. Paso 4: un update.",
        en: "Step 1: the Set. Step 2: a query with IN :accountIds (or none, using new Account(Id = ..., Rating = 'Hot')). Step 3: change Rating. Step 4: one update.",
      },
      {
        es: "Pseudocódigo: Set<Id> accountIds = new Set<Id>(); for (Opportunity o : wonToday) accountIds.add(o.AccountId); List<Account> accounts = [SELECT Id, Rating FROM Account WHERE Id IN :accountIds]; for (Account a : accounts) a.Rating = 'Hot'; update accounts;",
        en: "Pseudocode: Set<Id> accountIds = new Set<Id>(); for (Opportunity o : wonToday) accountIds.add(o.AccountId); List<Account> accounts = [SELECT Id, Rating FROM Account WHERE Id IN :accountIds]; for (Account a : accounts) a.Rating = 'Hot'; update accounts;",
      },
    ],
    solution: {
      es: `List<Opportunity> wonToday = [SELECT Id, AccountId FROM Opportunity
                              WHERE IsWon = true AND CloseDate = TODAY];

// 1. Juntar
Set<Id> accountIds = new Set<Id>();
for (Opportunity o : wonToday) {
    accountIds.add(o.AccountId);
}

// 2. Consultar una vez
List<Account> accounts = [SELECT Id, Rating FROM Account WHERE Id IN :accountIds];

// 3. Trabajar en memoria
for (Account a : accounts) {
    a.Rating = 'Hot';
}

// 4. Guardar una vez
update accounts;`,
      en: `List<Opportunity> wonToday = [SELECT Id, AccountId FROM Opportunity
                              WHERE IsWon = true AND CloseDate = TODAY];

// 1. Gather
Set<Id> accountIds = new Set<Id>();
for (Opportunity o : wonToday) {
    accountIds.add(o.AccountId);
}

// 2. Query once
List<Account> accounts = [SELECT Id, Rating FROM Account WHERE Id IN :accountIds];

// 3. Work in memory
for (Account a : accounts) {
    a.Rating = 'Hot';
}

// 4. Save once
update accounts;`,
    },
    checks: [
      {
        id: "m04-l03-c1",
        label: {
          es: "Ninguna consulta dentro de un bucle",
          en: "No query inside a loop",
        },
        rule: { op: "absent", pattern: "(for|while)\\s*\\([^)]*\\)\\s*\\{[^{}]*\\[\\s*SELECT\\b" },
        onFail: {
          es: "Hay un [SELECT ...] dentro de las llaves de un bucle. Sácalo: una consulta con IN antes del bucle.",
          en: "There is a [SELECT ...] inside a loop's braces. Move it out: one query with IN before the loop.",
        },
      },
      {
        id: "m04-l03-c2",
        label: {
          es: "Ningún DML dentro de un bucle",
          en: "No DML inside a loop",
        },
        rule: { op: "absent", pattern: "(for|while)\\s*\\([^)]*\\)\\s*\\{[^{}]*\\b(insert|update|delete|upsert)\\s+[\\w.()]+\\s*;" },
        onFail: {
          es: "Dentro del bucle solo cambias el campo; el update va una vez, después.",
          en: "Inside the loop you only change the field; the update goes once, afterwards.",
        },
      },
      {
        id: "m04-l03-c3",
        label: {
          es: "Los AccountId se juntan en un Set<Id> accountIds",
          en: "The AccountIds are gathered in a Set<Id> accountIds",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Set\\s*<\\s*Id\\s*>\\s+accountIds\\s*=\\s*new\\s+Set\\s*<\\s*Id\\s*>\\s*\\(\\s*\\)" },
            { op: "match", pattern: "accountIds\\.add\\(\\s*\\w+\\.AccountId\\s*\\)" },
          ],
        },
        onFail: {
          es: "Set<Id> accountIds = new Set<Id>(); y en un for: accountIds.add(o.AccountId);",
          en: "Set<Id> accountIds = new Set<Id>(); and in a for: accountIds.add(o.AccountId);",
        },
      },
      {
        id: "m04-l03-c4",
        label: {
          es: "Las cuentas se obtienen de una vez y quedan en Hot",
          en: "Accounts are fetched in one go and set to Hot",
        },
        rule: {
          op: "all",
          of: [
            {
              op: "any",
              of: [
                { op: "match", pattern: "FROM\\s+Account\\s+WHERE\\s+Id\\s+IN\\s*:\\s*accountIds\\b" },
                { op: "match", pattern: "new\\s+Account\\(\\s*Id\\s*=\\s*\\w+\\s*,\\s*Rating\\s*=\\s*'Hot'\\s*\\)" },
              ],
            },
            { op: "match", pattern: "Rating\\s*=\\s*'Hot'" },
          ],
        },
        onFail: {
          es: "O consultas con WHERE Id IN :accountIds y cambias Rating en un bucle, o creas new Account(Id = id, Rating = 'Hot') para cada Id del Set.",
          en: "Either query with WHERE Id IN :accountIds and change Rating in a loop, or create new Account(Id = id, Rating = 'Hot') for each Id in the Set.",
        },
      },
      {
        id: "m04-l03-c5",
        label: {
          es: "Una sola instrucción update",
          en: "A single update statement",
        },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "\\bupdate\\s+[\\w.()]+\\s*;", min: 1, max: 1 },
            { op: "absent", pattern: "\\[\\s*SELECT[^\\]]*WHERE\\s+Id\\s*=\\s*:" },
          ],
        },
        onFail: {
          es: "Deja un único update al final, sobre la lista (o sobre mapa.values()).",
          en: "Leave a single update at the end, on the list (or on map.values()).",
        },
        onPass: {
          es: "Dos consultas y un DML, sean 3 oportunidades o 180. Ya está listo para el cierre de trimestre.",
          en: "Two queries and one DML, whether 3 opportunities or 180. It is ready for quarter close.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué versión es más corta: la que consulta las cuentas o la que usa new Account(Id = ..., Rating = 'Hot')? ¿Cuándo necesitarías consultar sí o sí?",
        en: "Which version is shorter: the one that queries the accounts or the one using new Account(Id = ..., Rating = 'Hot')? When would you absolutely need to query?",
      },
    ],
  },
};
