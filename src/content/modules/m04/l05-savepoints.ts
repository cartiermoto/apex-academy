import type { Lesson } from "@/lib/types";

export const l05Savepoints: Lesson = {
  id: "m04-l05",
  slug: "savepoints-y-rollback",
  n: 5,
  kind: "lesson",
  minutes: 25,
  title: {
    es: "Savepoints y rollback",
    en: "Savepoints and rollback",
  },
  summary: {
    es: "Marcar un punto de la transacción y, si lo que viene después sale mal, volver a él: deshacer solo una parte, sin tirar todo lo anterior.",
    en: "Mark a point in the transaction and, if what follows goes wrong, go back to it: undo just one part, without throwing away everything before.",
  },
  analogy: {
    es: "El elemento Roll Back Records de un camino de error en Flow",
    en: "The Roll Back Records element on a Flow fault path",
  },
  objectives: [
    {
      es: "Explicar qué se deshace automáticamente cuando una transacción falla.",
      en: "Explain what is undone automatically when a transaction fails.",
    },
    {
      es: "Usar Database.setSavepoint() y Database.rollback() para deshacer una parte concreta.",
      en: "Use Database.setSavepoint() and Database.rollback() to undo a specific part.",
    },
    {
      es: "Conocer lo que un rollback no deshace y lo que cuesta en límites.",
      en: "Know what a rollback does not undo and what it costs in limits.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Ya sabes que un error sin tratar deshace la [[transaccion|transacción]] entera. Pero a veces no quieres eso: quieres intentar un paso y, si falla, dejar la base de datos como estaba justo antes de ese paso, y seguir con lo demás. Para eso existen los [[savepoint|puntos de guardado]].",
        en: "You already know an unhandled error undoes the whole [[transaccion|transaction]]. But sometimes you do not want that: you want to try a step and, if it fails, leave the database as it was just before that step, and carry on with the rest. That is what [[savepoint|save points]] are for.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "En un Flow, cuando un Create Records falla, puedes conectar un camino de error (fault path) y poner en él el elemento Roll Back Records: deshace los cambios pendientes de ese flow y luego decides qué hacer, por ejemplo mandar un aviso. Database.rollback() es ese elemento, con una ventaja: tú eliges exactamente a qué punto volver.",
        en: "In a Flow, when a Create Records fails, you can connect a fault path and place the Roll Back Records element on it: it undoes that flow's pending changes and then you decide what to do, for example send an alert. Database.rollback() is that element, with one advantage: you choose exactly which point to go back to.",
      },
    },
    {
      type: "h",
      text: { es: "Lo que ya ocurre solo", en: "What already happens on its own" },
    },
    {
      type: "p",
      text: {
        es: "Si la transacción termina con un error sin tratar, Salesforce no guarda nada de ella: ni tus inserts, ni lo que hicieron los flows, ni los triggers. Por eso un usuario nunca ve «media cuenta guardada». Esta red de seguridad es automática y es todo o nada. Los savepoints sirven para cuando quieres algo intermedio.",
        en: "If the transaction ends with an unhandled error, Salesforce saves nothing from it: not your inserts, not what the flows did, not the triggers. That is why a user never sees “half an account saved”. This safety net is automatic and all-or-nothing. Savepoints are for when you want something in between.",
      },
    },
    {
      type: "h",
      text: { es: "Marcar y volver", en: "Mark and go back" },
    },
    {
      type: "code",
      code: {
        es: `Savepoint sp = Database.setSavepoint();   // 📍 marca: la base de datos está así

Account acc = new Account(Name = 'Aurora Foods');
insert acc;

List<Contact> contacts = new List<Contact>{
    new Contact(LastName = 'Nakamura', AccountId = acc.Id),
    new Contact(LastName = 'Okafor',   AccountId = acc.Id, Email = 'no-es-un-email')
};
List<Database.SaveResult> results = Database.insert(contacts, false);

Boolean anyFailed = false;
for (Database.SaveResult sr : results) {
    if (!sr.isSuccess()) {
        anyFailed = true;
    }
}

if (anyFailed) {
    Database.rollback(sp);   // ↩ vuelve a la marca: ni cuenta ni contactos
}`,
        en: `Savepoint sp = Database.setSavepoint();   // 📍 mark: this is the database's state

Account acc = new Account(Name = 'Aurora Foods');
insert acc;

List<Contact> contacts = new List<Contact>{
    new Contact(LastName = 'Nakamura', AccountId = acc.Id),
    new Contact(LastName = 'Okafor',   AccountId = acc.Id, Email = 'not-an-email')
};
List<Database.SaveResult> results = Database.insert(contacts, false);

Boolean anyFailed = false;
for (Database.SaveResult sr : results) {
    if (!sr.isSuccess()) {
        anyFailed = true;
    }
}

if (anyFailed) {
    Database.rollback(sp);   // ↩ back to the mark: no account, no contacts
}`,
      },
      caption: {
        es: "Sin el rollback quedaría una cuenta con un solo contacto: justo lo que el negocio no quiere. Con él, o se guarda todo el alta o nada.",
        en: "Without the rollback you would be left with an account with a single contact: exactly what the business does not want. With it, either the whole onboarding is saved or nothing is.",
      },
    },
    {
      type: "diagram",
      id: "m04-savepoint",
      caption: {
        es: "Lo que ocurrió antes de la marca se queda. Lo de después, desaparece.",
        en: "What happened before the mark stays. What came after disappears.",
      },
    },
    {
      type: "p",
      text: {
        es: "En este ejemplo el fallo se detecta mirando los SaveResult, como en la lección 2. En el Módulo 8 verás la otra forma habitual: capturar la excepción de un insert con try/catch y hacer el rollback dentro del catch. La mecánica del savepoint es la misma.",
        en: "In this example the failure is detected by looking at the SaveResults, as in lesson 2. In Module 8 you will see the other usual way: catch an insert's exception with try/catch and do the rollback inside the catch. The savepoint mechanics are the same.",
      },
    },
    {
      type: "h",
      text: { es: "Lo que conviene saber antes de usarlo", en: "What is worth knowing before using it" },
    },
    {
      type: "list",
      items: [
        {
          es: "setSavepoint() y rollback() cuentan cada uno como una instrucción DML en los límites. No los metas en un bucle.",
          en: "setSavepoint() and rollback() each count as one DML statement against the limits. Do not put them in a loop.",
        },
        {
          es: "El rollback deshace la base de datos, no tus variables. Después del rollback, acc sigue teniendo el Id que recibió en el insert. Si intentas insert acc otra vez, falla: un registro con Id no se puede insertar. Si necesitas reintentar, crea el objeto de nuevo o usa acc.clone() (Módulo 5).",
          en: "The rollback undoes the database, not your variables. After the rollback, acc still has the Id it received on insert. If you try insert acc again, it fails: a record with an Id cannot be inserted. If you need to retry, create the object again or use acc.clone() (Module 5).",
        },
        {
          es: "Los contadores de límites no vuelven atrás: las consultas y DML que gastaste antes del rollback siguen gastados.",
          en: "The limit counters do not go back: the queries and DML you spent before the rollback stay spent.",
        },
        {
          es: "Solo deshace lo que se hizo después de esa marca, en esa misma transacción. No es un «deshacer» de ayer.",
          en: "It only undoes what was done after that mark, in that same transaction. It is not an “undo” for yesterday.",
        },
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "¿Savepoint o todo o nada?", en: "Savepoint or all-or-nothing?" },
      text: {
        es: "Si el objetivo es «si algo falla, que no quede nada», a menudo te basta con el todo o nada de insert: dejas que el error suba y Salesforce deshace la transacción entera. El savepoint tiene sentido cuando quieres deshacer una parte y seguir: por ejemplo, anular un alta fallida pero registrar el intento en un objeto de log, o continuar con el siguiente cliente de un lote.",
        en: "If the goal is “if anything fails, leave nothing”, insert's all-or-nothing is often enough: you let the error rise and Salesforce undoes the whole transaction. The savepoint makes sense when you want to undo a part and carry on: for example, cancel a failed onboarding but record the attempt in a log object, or continue with the next customer in a batch.",
      },
    },
    {
      type: "h",
      text: { es: "Dos detalles que se aprenden a golpes", en: "Two details people learn the hard way" },
    },
    {
      type: "list",
      items: [
        {
          es: "Un savepoint no es gratis: cada Database.setSavepoint() y cada Database.rollback() cuentan como una instrucción DML del límite de 150. Úsalos donde hay una unidad que proteger, no en cada línea.",
          en: "A savepoint is not free: every Database.setSavepoint() and every Database.rollback() counts as one DML statement against the 150 limit. Use them where there is a unit to protect, not on every line.",
        },
        {
          es: "El rollback deshace la base de datos, no tus variables. Después de volver al savepoint, acc sigue teniendo el Id que recibió en el insert, aunque ese registro ya no exista. Si intentas insertarla otra vez tal cual, falla porque un insert no admite un Id: crea un registro nuevo o limpia el Id primero.",
          en: "Rollback undoes the database, not your variables. After going back to the savepoint, acc still holds the Id it got from the insert, even though that record no longer exists. Try to insert it again as it is and it fails, because an insert does not accept an Id: create a new record or clear the Id first.",
        },
      ],
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Ya conoces el «todo o nada» de un guardado", en: "You already know a save's «all or nothing»" },
      text: {
        es: "Cuando una regla de validación rechaza un registro en pantalla, no se guarda nada de ese guardado: ni el campo que estaba bien ni el que estaba mal. Toda la transacción funciona así por defecto: si algo falla sin tratar, se deshace entero. El savepoint sirve para lo contrario de lo habitual: cuando tú has decidido capturar el error y seguir, te deja elegir qué parte deshacer.",
        en: "When a validation rule rejects a record on screen, nothing from that save is kept: neither the field that was fine nor the one that was wrong. The whole transaction works like that by default: if something fails unhandled, it is all undone. The savepoint is for the opposite case: when you have decided to catch the error and carry on, it lets you choose which part to undo.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "El libro no trata transacciones: cada INSERT y cada UPDATE de su capa de datos se confirma por separado en cuanto se ejecuta, así que si la factura se graba y la línea falla, la base de datos queda con una factura sin líneas. En Java se resuelve con connection.setAutoCommit(false), commit() y rollback() sobre la conexión. En Apex la transacción ya existe sin pedirla, y el savepoint te da el control fino que en Java tendrías que montar a mano.",
        en: "The book does not cover transactions: every INSERT and UPDATE in its data layer is committed separately as soon as it runs, so if the invoice is saved and the line fails, the database is left with an invoice without lines. In Java that is solved with connection.setAutoCommit(false), commit() and rollback() on the connection. In Apex the transaction already exists without asking for it, and the savepoint gives you the fine control you would have to build by hand in Java.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué dos métodos marcan y vuelven? Después de un rollback, ¿qué conserva tu variable que la base de datos ya no tiene? ¿Cuántas instrucciones DML gastan un setSavepoint y un rollback?",
        en: "Without looking: which two methods mark and go back? After a rollback, what does your variable keep that the database no longer has? How many DML statements do a setSavepoint and a rollback spend?",
      },
    },
  ],

  quiz: [
    {
      id: "m04-l05-q1",
      kind: "single",
      prompt: {
        es: "¿Qué queda en la base de datos al final?",
        en: "What is left in the database at the end?",
      },
      code: {
        es: `insert new Account(Name = 'Uno');
Savepoint sp = Database.setSavepoint();
insert new Account(Name = 'Dos');
Database.rollback(sp);
insert new Account(Name = 'Tres');`,
        en: `insert new Account(Name = 'One');
Savepoint sp = Database.setSavepoint();
insert new Account(Name = 'Two');
Database.rollback(sp);
insert new Account(Name = 'Three');`,
      },
      options: [
        { es: "Uno y Tres", en: "One and Three" },
        { es: "Solo Tres", en: "Only Three" },
        { es: "Uno, Dos y Tres", en: "One, Two and Three" },
        { es: "Ninguna", en: "None" },
      ],
      answer: 0,
      explain: {
        es: "La marca se puso después de Uno, así que Uno se queda. Dos se deshace. Tres se inserta después del rollback.",
        en: "The mark was set after One, so One stays. Two is undone. Three is inserted after the rollback.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m04-l05-q2",
      kind: "single",
      prompt: {
        es: "Después de este código, ¿qué pasa en la última línea?",
        en: "After this code, what happens on the last line?",
      },
      code: {
        es: `Savepoint sp = Database.setSavepoint();
Account acc = new Account(Name = 'Aurora');
insert acc;
Database.rollback(sp);
insert acc;`,
        en: `Savepoint sp = Database.setSavepoint();
Account acc = new Account(Name = 'Aurora');
insert acc;
Database.rollback(sp);
insert acc;`,
      },
      options: [
        {
          es: "Falla: acc todavía tiene un Id, y un registro con Id no se puede insertar.",
          en: "It fails: acc still has an Id, and a record with an Id cannot be inserted.",
        },
        { es: "Inserta Aurora de nuevo sin problema.", en: "It inserts Aurora again with no problem." },
        { es: "No hace nada.", en: "It does nothing." },
      ],
      answer: 0,
      explain: {
        es: "El rollback deshace la base de datos, no la memoria. Para reintentar, crea el objeto otra vez o usa acc.clone().",
        en: "The rollback undoes the database, not memory. To retry, create the object again or use acc.clone().",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M5 L2", en: "Review · M5 L2" },
    },
    {
      id: "m04-l05-q3",
      kind: "single",
      prompt: {
        es: "¿Cuál es el equivalente en Flow de Database.rollback()?",
        en: "What is the Flow equivalent of Database.rollback()?",
      },
      options: [
        { es: "El elemento Roll Back Records", en: "The Roll Back Records element" },
        { es: "El elemento Delete Records", en: "The Delete Records element" },
        { es: "Desactivar la versión del flow", en: "Deactivating the flow version" },
      ],
      answer: 0,
      explain: {
        es: "Roll Back Records, normalmente en un camino de error, deshace los cambios pendientes. Delete Records borraría registros confirmados, que es otra cosa.",
        en: "Roll Back Records, usually on a fault path, undoes pending changes. Delete Records would delete committed records, which is something else.",
      },
      tags: ["recall"],
    },
    {
      id: "m04-l05-q4",
      kind: "multi",
      prompt: {
        es: "¿Qué es cierto sobre los savepoints?",
        en: "What is true about savepoints?",
      },
      options: [
        {
          es: "setSavepoint() y rollback() cuentan como instrucciones DML.",
          en: "setSavepoint() and rollback() count as DML statements.",
        },
        {
          es: "Después de un rollback, las consultas gastadas vuelven a estar disponibles.",
          en: "After a rollback, the queries spent become available again.",
        },
        {
          es: "Solo deshacen lo hecho después de la marca, en la misma transacción.",
          en: "They only undo what was done after the mark, in the same transaction.",
        },
        {
          es: "Sirven para deshacer lo que se guardó ayer.",
          en: "They can undo what was saved yesterday.",
        },
      ],
      answers: [0, 2],
      explain: {
        es: "Los contadores de límites nunca retroceden, y lo confirmado en otra transacción ya no se puede tocar con un rollback.",
        en: "Limit counters never go back, and what was committed in another transaction can no longer be touched by a rollback.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m04-l05-q5",
      kind: "single",
      prompt: {
        es: "Procesas un lote de 50 altas de cliente. Si un alta falla, quieres anularla por completo pero seguir con las demás. ¿Cuál es la MEJOR opción?",
        en: "You are processing a batch of 50 customer onboardings. If one fails, you want to cancel it completely but carry on with the rest. Which is the BEST option?",
      },
      options: [
        {
          es: "Un savepoint antes de cada alta y rollback si esa falla, sin que el error detenga el lote.",
          en: "A savepoint before each onboarding and a rollback if it fails, without the error stopping the batch.",
        },
        {
          es: "insert normal de todo: si una falla, que no se guarde ninguna.",
          en: "A plain insert of everything: if one fails, none is saved.",
        },
        {
          es: "No hacer nada y revisar a mano al día siguiente.",
          en: "Do nothing and check by hand the next day.",
        },
      ],
      answer: 0,
      explain: {
        es: "Es el caso típico del savepoint: deshacer una parte y seguir. Ojo al coste: cada setSavepoint y rollback gasta una instrucción DML, así que con 50 altas hay que vigilar el límite de 150 (y en el Módulo 9 verás cómo repartir el trabajo en lotes).",
        en: "It is the textbook savepoint case: undo a part and carry on. Mind the cost: each setSavepoint and rollback spends a DML statement, so with 50 onboardings you must watch the 150 limit (and in Module 9 you will see how to split the work into batches).",
      },
      tags: ["interleaving"],
    },
    {
      id: "m04-l05-q6",
      kind: "text",
      prompt: {
        es: "Escribe la línea que crea un punto de guardado en una variable sp.",
        en: "Write the line that creates a save point in a variable sp.",
      },
      accept: ["^\\s*Savepoint\\s+sp\\s*=\\s*Database\\.setSavepoint\\(\\s*\\)\\s*;?\\s*$"],
      placeholder: { es: "una línea de Apex", en: "one line of Apex" },
      explain: {
        es: "Savepoint sp = Database.setSavepoint(); — y para volver, Database.rollback(sp);",
        en: "Savepoint sp = Database.setSavepoint(); — and to go back, Database.rollback(sp);",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 5 DE 6 · Vuelta a la pieza 1: el alta de clientes tiene un hueco, y hoy firma Aurora Foods. El alta de un cliente crea la cuenta y sus contactos. Hoy, si un contacto falla, la cuenta se queda huérfana y alguien del equipo tiene que borrarla a mano. Haz que el alta sea completa o no exista.",
      en: "TASK 5 OF 6 · Back to piece 1: customer onboarding has a gap, and today Aurora Foods signs. A customer onboarding creates the account and its contacts. Today, if a contact fails, the account is left orphaned and someone on the team has to delete it by hand. Make the onboarding either complete or non-existent.",
    },
    brief: [
      {
        es: "Crea un Savepoint sp antes de insertar la cuenta.",
        en: "Create a Savepoint sp before inserting the account.",
      },
      {
        es: "Inserta los contactos con resultados parciales y averigua si alguno falló en una variable Boolean anyFailed.",
        en: "Insert the contacts with partial results and find out whether any failed in a Boolean anyFailed variable.",
      },
      {
        es: "Si alguno falló, vuelve al savepoint y muestra un aviso. Si no, muestra el Id de la cuenta creada.",
        en: "If any failed, go back to the savepoint and show a warning. If not, show the created account's Id.",
      },
    ],
    starter: {
      es: `// CASO: la operación diaria de Northwind, en código
// Tarea 5 de 6: el alta de la tarea 1, completa o inexistente.

Account acc = new Account(Name = 'Aurora Foods');
insert acc;

List<Contact> contacts = new List<Contact>{
    new Contact(LastName = 'Nakamura', AccountId = acc.Id),
    new Contact(LastName = 'Okafor',   AccountId = acc.Id, Email = 'no-es-un-email')
};
Database.insert(contacts, false);
`,
      en: `// CASE: Northwind's daily operation, in code
// Task 5 of 6: task 1's onboarding, complete or non-existent.

Account acc = new Account(Name = 'Aurora Foods');
insert acc;

List<Contact> contacts = new List<Contact>{
    new Contact(LastName = 'Nakamura', AccountId = acc.Id),
    new Contact(LastName = 'Okafor',   AccountId = acc.Id, Email = 'not-an-email')
};
Database.insert(contacts, false);
`,
    },
    hints: [
      {
        es: "La marca tiene que ir antes del insert de la cuenta: si va después, el rollback no la deshace.",
        en: "The mark has to come before the account insert: if it comes after, the rollback does not undo it.",
      },
      {
        es: "Guarda los SaveResult, recórrelos y pon anyFailed = true si alguno no es isSuccess(). Después, un if/else.",
        en: "Store the SaveResults, walk them and set anyFailed = true if any is not isSuccess(). Then an if/else.",
      },
      {
        es: "Pseudocódigo: Savepoint sp = Database.setSavepoint(); insert acc; ... List<Database.SaveResult> results = Database.insert(contacts, false); Boolean anyFailed = false; for (...) if (!sr.isSuccess()) anyFailed = true; if (anyFailed) { Database.rollback(sp); System.debug(...); } else { System.debug(acc.Id); }",
        en: "Pseudocode: Savepoint sp = Database.setSavepoint(); insert acc; ... List<Database.SaveResult> results = Database.insert(contacts, false); Boolean anyFailed = false; for (...) if (!sr.isSuccess()) anyFailed = true; if (anyFailed) { Database.rollback(sp); System.debug(...); } else { System.debug(acc.Id); }",
      },
    ],
    solution: {
      es: `Savepoint sp = Database.setSavepoint();

Account acc = new Account(Name = 'Aurora Foods');
insert acc;

List<Contact> contacts = new List<Contact>{
    new Contact(LastName = 'Nakamura', AccountId = acc.Id),
    new Contact(LastName = 'Okafor',   AccountId = acc.Id, Email = 'no-es-un-email')
};
List<Database.SaveResult> results = Database.insert(contacts, false);

Boolean anyFailed = false;
for (Database.SaveResult sr : results) {
    if (!sr.isSuccess()) {
        anyFailed = true;
    }
}

if (anyFailed) {
    Database.rollback(sp);
    System.debug('Alta anulada: algún contacto no se pudo crear');
} else {
    System.debug('Alta completa: ' + acc.Id);
}`,
      en: `Savepoint sp = Database.setSavepoint();

Account acc = new Account(Name = 'Aurora Foods');
insert acc;

List<Contact> contacts = new List<Contact>{
    new Contact(LastName = 'Nakamura', AccountId = acc.Id),
    new Contact(LastName = 'Okafor',   AccountId = acc.Id, Email = 'not-an-email')
};
List<Database.SaveResult> results = Database.insert(contacts, false);

Boolean anyFailed = false;
for (Database.SaveResult sr : results) {
    if (!sr.isSuccess()) {
        anyFailed = true;
    }
}

if (anyFailed) {
    Database.rollback(sp);
    System.debug('Onboarding cancelled: a contact could not be created');
} else {
    System.debug('Onboarding complete: ' + acc.Id);
}`,
    },
    checks: [
      {
        id: "m04-l05-c1",
        label: {
          es: "El savepoint se crea antes de insertar la cuenta",
          en: "The savepoint is created before inserting the account",
        },
        rule: { op: "match", pattern: "Savepoint\\s+sp\\s*=\\s*Database\\.setSavepoint\\(\\s*\\)\\s*;[\\s\\S]*\\binsert\\s+acc\\s*;" },
        onFail: {
          es: "Savepoint sp = Database.setSavepoint(); tiene que ir antes de insert acc;",
          en: "Savepoint sp = Database.setSavepoint(); has to come before insert acc;",
        },
      },
      {
        id: "m04-l05-c2",
        label: {
          es: "Los resultados de los contactos se guardan y se revisan",
          en: "The contacts' results are stored and checked",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "List\\s*<\\s*Database\\.SaveResult\\s*>\\s+\\w+\\s*=\\s*Database\\.insert\\(\\s*contacts\\s*,\\s*false\\s*\\)" },
            { op: "match", pattern: "Boolean\\s+anyFailed\\s*=\\s*false\\s*;" },
            { op: "match", pattern: "!\\s*\\w+(\\[\\s*\\w+\\s*\\])?\\.isSuccess\\(\\s*\\)[\\s\\S]*anyFailed\\s*=\\s*true" },
          ],
        },
        onFail: {
          es: "Guarda List<Database.SaveResult> results = Database.insert(contacts, false); y en un bucle: if (!sr.isSuccess()) anyFailed = true;",
          en: "Store List<Database.SaveResult> results = Database.insert(contacts, false); and in a loop: if (!sr.isSuccess()) anyFailed = true;",
        },
      },
      {
        id: "m04-l05-c3",
        label: {
          es: "Si algo falló, vuelve al savepoint",
          en: "If anything failed, it goes back to the savepoint",
        },
        rule: { op: "match", pattern: "if\\s*\\(\\s*anyFailed\\s*\\)\\s*\\{[^}]*Database\\.rollback\\(\\s*sp\\s*\\)\\s*;" },
        onFail: {
          es: "if (anyFailed) { Database.rollback(sp); ... }",
          en: "if (anyFailed) { Database.rollback(sp); ... }",
        },
      },
      {
        id: "m04-l05-c4",
        label: {
          es: "Si todo fue bien, muestra el Id de la cuenta",
          en: "If all went well, it shows the account's Id",
        },
        rule: { op: "match", pattern: "else\\s*\\{[^}]*System\\.debug\\([^;]*acc\\.Id[^;]*\\)" },
        onFail: {
          es: "En el else: System.debug('Alta completa: ' + acc.Id);",
          en: "In the else: System.debug('Onboarding complete: ' + acc.Id);",
        },
        onPass: {
          es: "Nadie más tendrá que borrar cuentas huérfanas a mano: el alta existe entera o no existe.",
          en: "Nobody will have to delete orphaned accounts by hand again: the onboarding exists whole or not at all.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué pasaría si movieras el Savepoint justo después de insert acc? Recórrelo mentalmente con el contacto Okafor fallando.",
        en: "What would happen if you moved the Savepoint right after insert acc? Walk through it in your head with the Okafor contact failing.",
      },
    ],
  },
};
