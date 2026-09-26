import type { Lesson } from "@/lib/types";

export const l02DatabaseMethods: Lesson = {
  id: "m04-l02",
  slug: "database-insert-y-resultados-parciales",
  n: 2,
  kind: "lesson",
  minutes: 25,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 1", en: "Remember? · Review of lesson 1" },
    prompt: { es: "Insertas una cuenta con insert acc;. ¿Cuándo tiene Id la variable acc?", en: "You insert an account with insert acc;. When does the acc variable have an Id?" },
    options: [
      { es: "Nunca: hay que consultarla", en: "Never: you have to query it" },
      { es: "Justo después del insert", en: "Right after the insert" },
      { es: "Al terminar la transacción", en: "When the transaction ends" },
    ],
    answer: 1,
    explain: { es: "Justo después del insert la variable ya tiene su Id, como el success.csv de Data Loader. Por eso los contactos se insertan después.", en: "Right after the insert the variable already has its Id, like Data Loader's success.csv. That is why the contacts are inserted afterwards." },
  },
  title: {
    es: "Database.insert y resultados parciales",
    en: "Database.insert and partial results",
  },
  summary: {
    es: "Todo o nada frente a «guarda lo que puedas y dime qué falló»: la misma decisión que tomas cada vez que cargas un CSV con Data Loader.",
    en: "All or nothing versus “save what you can and tell me what failed”: the same decision you make every time you load a CSV with Data Loader.",
  },
  analogy: {
    es: "Los archivos success.csv y error.csv de Data Loader",
    en: "Data Loader's success.csv and error.csv files",
  },
  objectives: [
    {
      es: "Explicar qué hace insert cuando falla un solo registro de la lista.",
      en: "Explain what insert does when a single record in the list fails.",
    },
    {
      es: "Usar Database.insert(lista, false) y leer cada SaveResult.",
      en: "Use Database.insert(list, false) and read each SaveResult.",
    },
    {
      es: "Decidir cuándo conviene todo o nada y cuándo resultados parciales.",
      en: "Decide when all-or-nothing fits and when partial results do.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Insertas 200 leads y uno tiene un correo mal formado, que el campo Email rechaza por sí solo. ¿Qué debería pasar con los otros 199? Depende del negocio, y Apex te deja elegir. La instrucción insert de la lección anterior elige por ti; los métodos de la clase Database te dejan decidir.",
        en: "You insert 200 leads and one has a malformed email, which the Email field rejects on its own. What should happen to the other 199? It depends on the business, and Apex lets you choose. The previous lesson's insert statement chooses for you; the Database class methods let you decide.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Cuando yo cargaba 1.000 filas con Data Loader y 3 fallaban, al terminar tenía dos archivos: success.csv con las 997 guardadas (y sus Ids nuevos) y error.csv con las 3 rechazadas y el motivo de cada una. Data Loader guarda lo que puede y te cuenta el resto. Eso es exactamente Database.insert(lista, false).",
        en: "When I loaded 1,000 rows with Data Loader and 3 failed, at the end I had two files: success.csv with the 997 saved (and their new Ids) and error.csv with the 3 rejected and the reason for each. Data Loader saves what it can and tells you about the rest. That is exactly Database.insert(list, false).",
      },
      voice: "otter",
    },
    {
      type: "diagram",
      id: "m04-all-or-none",
      caption: {
        es: "Misma lista, mismo registro malo, dos resultados distintos.",
        en: "Same list, same bad record, two different outcomes.",
      },
    },
    {
      type: "h",
      text: { es: "insert: todo o nada", en: "insert: all or nothing" },
    },
    {
      type: "p",
      text: {
        es: "Con la instrucción insert (y update, delete, upsert), si un solo registro de la lista falla, no se guarda ninguno y se lanza una DmlException que detiene tu código. Es lo que quieres cuando los registros solo tienen sentido juntos: un pedido y sus líneas, una cuenta y su contacto principal.",
        en: "With the insert statement (and update, delete, upsert), if a single record in the list fails, none is saved and a DmlException is thrown that stops your code. It is what you want when the records only make sense together: an order and its lines, an account and its main contact.",
      },
    },
    {
      type: "h",
      text: { es: "Database.insert(lista, false): lo que se pueda", en: "Database.insert(list, false): whatever it can" },
    },
    {
      type: "code",
      code: {
        es: `List<Lead> leads = new List<Lead>{
    new Lead(LastName = 'Ruiz', Company = 'Acme', Email = 'ruiz@acme.com'),
    new Lead(LastName = 'Kim',  Company = 'Globex', Email = 'no-es-un-email'),
    new Lead(LastName = 'Silva', Company = 'Initech', Email = 'silva@initech.com')
};

List<Database.SaveResult> results = Database.insert(leads, false);

for (Integer i = 0; i < results.size(); i++) {
    Database.SaveResult sr = results[i];
    if (sr.isSuccess()) {
        System.debug('Guardado: ' + sr.getId());
    } else {
        for (Database.Error err : sr.getErrors()) {
            System.debug(leads[i].LastName + ' falló: ' + err.getMessage());
        }
    }
}`,
        en: `List<Lead> leads = new List<Lead>{
    new Lead(LastName = 'Ruiz', Company = 'Acme', Email = 'ruiz@acme.com'),
    new Lead(LastName = 'Kim',  Company = 'Globex', Email = 'not-an-email'),
    new Lead(LastName = 'Silva', Company = 'Initech', Email = 'silva@initech.com')
};

List<Database.SaveResult> results = Database.insert(leads, false);

for (Integer i = 0; i < results.size(); i++) {
    Database.SaveResult sr = results[i];
    if (sr.isSuccess()) {
        System.debug('Saved: ' + sr.getId());
    } else {
        for (Database.Error err : sr.getErrors()) {
            System.debug(leads[i].LastName + ' failed: ' + err.getMessage());
        }
    }
}`,
      },
      caption: {
        es: "Ruiz y Silva se guardan; Kim no. El código no se detiene: tú decides qué hacer con el error.",
        en: "Ruiz and Silva are saved; Kim is not. The code does not stop: you decide what to do with the error.",
      },
    },
    {
      type: "list",
      items: [
        {
          es: "El segundo parámetro se llama allOrNone. true (o no ponerlo) se comporta como insert; false permite resultados parciales.",
          en: "The second parameter is called allOrNone. true (or leaving it out) behaves like insert; false allows partial results.",
        },
        {
          es: "Devuelve una lista de Database.SaveResult en el mismo orden que la lista de entrada. results[1] es el resultado de leads[1]: por eso el for con índice, del Módulo 2, y no el for-each.",
          en: "It returns a list of Database.SaveResult in the same order as the input list. results[1] is leads[1]'s result: hence the indexed for from Module 2, not the for-each.",
        },
        {
          es: "isSuccess() dice si se guardó; getId(), el Id nuevo; getErrors(), una lista de Database.Error con getMessage(), getStatusCode() y getFields(). Es tu error.csv, fila a fila.",
          en: "isSuccess() says whether it saved; getId(), the new Id; getErrors(), a list of Database.Error with getMessage(), getStatusCode() and getFields(). It is your error.csv, row by row.",
        },
        {
          es: "Existen igual Database.update, Database.upsert (con UpsertResult e isCreated()) y Database.delete (con DeleteResult).",
          en: "Database.update, Database.upsert (with UpsertResult and isCreated()) and Database.delete (with DeleteResult) work the same way.",
        },
      ],
    },
    {
      type: "h",
      text: { es: "¿Cuál uso?", en: "Which one do I use?" },
    },
    {
      type: "table",
      head: [
        { es: "Situación", en: "Situation" },
        { es: "Elige", en: "Choose" },
      ],
      rows: [
        [
          { es: "Una cuenta y su contacto principal: sin uno, el otro sobra", en: "An account and its main contact: without one, the other is pointless" },
          { es: "insert (todo o nada)", en: "insert (all or nothing)" },
        ],
        [
          { es: "Carga nocturna de leads de un formulario web", en: "Nightly load of leads from a web form" },
          { es: "Database.insert(lista, false) y registrar los fallos", en: "Database.insert(list, false) and log the failures" },
        ],
        [
          { es: "Actualizar la valoración de 500 cuentas independientes", en: "Updating the rating of 500 independent accounts" },
          { es: "Database.update(lista, false)", en: "Database.update(list, false)" },
        ],
        [
          { es: "Una factura y sus líneas", en: "An invoice and its lines" },
          { es: "Todo o nada (y en la lección 5, savepoints)", en: "All or nothing (and in lesson 5, savepoints)" },
        ],
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Parcial no significa ignorar", en: "Partial does not mean ignore" },
      text: {
        es: "El peor uso de Database.insert(lista, false) es no mirar los resultados: los fallos desaparecen en silencio y nadie se entera hasta que Ventas pregunta por qué faltan leads. Si eliges resultados parciales, recorre los SaveResult y haz algo con los errores: guardarlos en un registro de log, avisar por correo, devolverlos a quien llamó.",
        en: "The worst use of Database.insert(list, false) is not looking at the results: the failures vanish silently and nobody finds out until Sales asks why leads are missing. If you choose partial results, walk the SaveResults and do something with the errors: store them in a log record, send an email, return them to the caller.",
      },
    },
    {
      type: "h",
      text: { es: "¿Todo o nada, o lo que se pueda?", en: "All or nothing, or whatever can be saved?" },
    },
    {
      type: "p",
      text: {
        es: "La elección no es técnica, es de negocio, y se decide con una pregunta: ¿los registros de la lista dependen unos de otros? Si son independientes —leads de un formulario, casos de un correo—, guardar los buenos y apuntar los malos es lo sensato: un lead sin empresa no tiene por qué impedir que entren los otros 199. Si forman una unidad —una cuenta con sus contactos, un pedido con sus líneas—, una parte guardada sin la otra es un dato roto, y entonces quieres todo o nada. Esa segunda situación es la de la lección 5.",
        en: "The choice is not technical, it is a business one, and it comes down to one question: do the records in the list depend on each other? If they are independent — leads from a form, cases from an email — saving the good ones and noting the bad ones is sensible: a lead with no company has no reason to stop the other 199. If they form a unit — an account with its contacts, an order with its lines — one part saved without the other is broken data, and then you want all or nothing. That second situation is lesson 5's.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El motivo del error lo escribiste tú", en: "You wrote the error reason yourself" },
      text: {
        es: "Esto me encanta: cuando un registro falla por una regla de validación, getMessage() devuelve exactamente el mensaje de error que escribiste al crear la regla, el mismo que ve un usuario en pantalla y el mismo que aparece en la columna ERROR del error.csv de Data Loader. Por eso vale la pena escribir mensajes de validación que expliquen qué corregir: desde hoy también los leerá tu código.",
        en: "I love this: when a record fails because of a validation rule, getMessage() returns exactly the error message you wrote when you created the rule, the same one a user sees on screen and the same one in the ERROR column of Data Loader's error.csv. That is why it pays to write validation messages that say what to fix: from today your code reads them too.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "El capítulo 7 del libro enseña try/catch con este patrón: catch (SQLException exc) { System.err.println(exc.getMessage()); }. El error se imprime en una consola que nadie mira y el programa sigue como si nada. En Salesforce no hay consola que alguien lea en producción: un error tragado así es un dato perdido. Con Database.insert(lista, false) el error no se lanza, pero tampoco se pierde: está en el SaveResult esperándote. Las excepciones las verás a fondo en el Módulo 8; la regla ya te sirve hoy: nunca tragues un error sin dejar rastro.",
        en: "The book's chapter 7 teaches try/catch with this pattern: catch (SQLException exc) { System.err.println(exc.getMessage()); }. The error is printed to a console nobody watches and the program carries on as if nothing happened. In Salesforce there is no console anyone reads in production: an error swallowed like that is lost data. With Database.insert(list, false) the error is not thrown, but it is not lost either: it waits for you in the SaveResult. You will see exceptions in depth in Module 8; the rule already serves you today: never swallow an error without leaving a trace.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: si insertas 50 registros con insert y el 50 falla, ¿cuántos se guardan? ¿Y con Database.insert(lista, false)? ¿Cómo sabes a qué registro pertenece un SaveResult?",
        en: "Without looking: if you insert 50 records with insert and number 50 fails, how many are saved? And with Database.insert(list, false)? How do you know which record a SaveResult belongs to?",
      },
    },
  ],

  quiz: [
    {
      id: "m04-l02-q1",
      kind: "single",
      prompt: {
        es: "Insertas 100 contactos con insert contacts; y el número 73 incumple una regla de validación. ¿Cuántos se guardan?",
        en: "You insert 100 contacts with insert contacts; and number 73 breaks a validation rule. How many are saved?",
      },
      options: [
        { es: "0", en: "0" },
        { es: "72", en: "72" },
        { es: "99", en: "99" },
      ],
      answer: 0,
      explain: {
        es: "La instrucción insert es todo o nada: un fallo deshace la operación entera y lanza DmlException.",
        en: "The insert statement is all or nothing: one failure undoes the whole operation and throws DmlException.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m04-l02-q2",
      kind: "single",
      prompt: {
        es: "¿Y con Database.insert(contacts, false)?",
        en: "And with Database.insert(contacts, false)?",
      },
      options: [
        { es: "99, y el resultado 72 (el del contacto 73) trae el error", en: "99, and result 72 (contact 73's) carries the error" },
        { es: "0", en: "0" },
        { es: "72, y se detiene en el fallo", en: "72, and it stops at the failure" },
      ],
      answer: 0,
      explain: {
        es: "Se guarda todo lo válido. Los índices empiezan en 0: el contacto número 73 es contacts[72], y su resultado es results[72].",
        en: "Everything valid is saved. Indexes start at 0: contact number 73 is contacts[72], and its result is results[72].",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M1 L8", en: "Review · M1 L8" },
    },
    {
      id: "m04-l02-q3",
      kind: "single",
      prompt: {
        es: "Tu código crea un pedido y después sus líneas. Si alguna línea falla, el pedido no debe quedar. ¿Cuál es la MEJOR opción para las líneas?",
        en: "Your code creates an order and then its lines. If any line fails, the order must not remain. Which is the BEST option for the lines?",
      },
      options: [
        {
          es: "Todo o nada, para que un fallo detenga la transacción entera.",
          en: "All or nothing, so a failure stops the whole transaction.",
        },
        {
          es: "Database.insert(lines, false) y seguir adelante.",
          en: "Database.insert(lines, false) and carry on.",
        },
        {
          es: "Insertar cada línea por separado dentro de un bucle.",
          en: "Insert each line separately inside a loop.",
        },
      ],
      answer: 0,
      explain: {
        es: "Pedido y líneas solo tienen sentido juntos. Con resultados parciales quedaría un pedido a medias; en un bucle, además, gastas una instrucción DML por línea.",
        en: "Order and lines only make sense together. With partial results you would be left with a half order; in a loop, you also spend one DML statement per line.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m04-l02-q4",
      kind: "multi",
      prompt: {
        es: "¿Qué métodos tiene un Database.SaveResult?",
        en: "Which methods does a Database.SaveResult have?",
      },
      options: [
        { es: "isSuccess()", en: "isSuccess()" },
        { es: "getId()", en: "getId()" },
        { es: "getErrors()", en: "getErrors()" },
        { es: "retry()", en: "retry()" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Si se guardó, su Id y, si no, sus errores. No hay reintento automático: si quieres reintentar, lo programas tú.",
        en: "Whether it saved, its Id and, if not, its errors. There is no automatic retry: if you want one, you code it.",
      },
      tags: ["recall"],
    },
    {
      id: "m04-l02-q5",
      kind: "single",
      prompt: {
        es: "¿Qué tiene de malo este código?",
        en: "What is wrong with this code?",
      },
      code: {
        es: `Database.insert(leadsFromWebForm, false);
System.debug('Carga terminada');`,
        en: `Database.insert(leadsFromWebForm, false);
System.debug('Load finished');`,
      },
      options: [
        {
          es: "Ignora los resultados: los leads que fallen se pierden sin que nadie lo sepa.",
          en: "It ignores the results: failed leads are lost without anyone knowing.",
        },
        { es: "No compila sin guardar el resultado.", en: "It does not compile without storing the result." },
        { es: "Nada, es la forma correcta.", en: "Nothing, it is the right way." },
      ],
      answer: 0,
      explain: {
        es: "Compila, pero es el error.csv tirado a la basura sin abrir. Guarda los SaveResult y trata los fallos.",
        en: "It compiles, but it is the error.csv thrown away unopened. Store the SaveResults and handle the failures.",
      },
      tags: ["find-error"],
    },
    {
      id: "m04-l02-q6",
      kind: "text",
      prompt: {
        es: "¿Cómo se llama el segundo parámetro de Database.insert que decide entre todo o nada y resultados parciales?",
        en: "What is the name of Database.insert's second parameter, which decides between all-or-nothing and partial results?",
      },
      accept: ["^\\s*allOrNone\\s*$", "^\\s*all\\s*or\\s*none\\s*$"],
      placeholder: { es: "nombre del parámetro", en: "parameter name" },
      explain: {
        es: "allOrNone. false = guarda lo que puedas.",
        en: "allOrNone. false = save what you can.",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 2 DE 6 · Segunda pieza: la carga nocturna de leads que hoy hace Marketing con Data Loader. Cada noche entran los leads del formulario web. Marketing no quiere perder los buenos por culpa de uno malo, pero sí quiere saber cuáles fallaron y por qué, para corregirlos al día siguiente.",
      en: "TASK 2 OF 6 · Second piece: the nightly lead load Marketing does today with Data Loader. Every night the web-form leads come in. Marketing does not want to lose the good ones because of a bad one, but does want to know which failed and why, to fix them the next day.",
    },
    brief: [
      {
        es: "Inserta la lista leads con resultados parciales y guarda los resultados en results.",
        en: "Insert the leads list with partial results and store the results in results.",
      },
      {
        es: "Recorre los resultados con un for con índice. Cuenta cuántos se guardaron en una variable saved.",
        en: "Walk the results with an indexed for. Count how many were saved in a saved variable.",
      },
      {
        es: "Para cada fallo, añade a una List<String> errors un texto con el apellido del lead y el mensaje de error.",
        en: "For each failure, add to a List<String> errors a text with the lead's last name and the error message.",
      },
      {
        es: "Al final, muestra saved y errors.",
        en: "At the end, show saved and errors.",
      },
    ],
    starter: {
      es: `// CASO: la operación diaria de Northwind, en código
// Tarea 2 de 6: la carga nocturna de leads, guardando lo que se pueda.

List<Lead> leads = new List<Lead>{
    new Lead(LastName = 'Ruiz',  Company = 'Acme',    Email = 'ruiz@acme.com'),
    new Lead(LastName = 'Kim',   Company = 'Globex',  Email = 'no-es-un-email'),
    new Lead(LastName = 'Silva', Company = 'Initech', Email = 'silva@initech.com')
};

insert leads;
`,
      en: `// CASE: Northwind's daily operation, in code
// Task 2 of 6: the nightly lead load, saving whatever can be saved.

List<Lead> leads = new List<Lead>{
    new Lead(LastName = 'Ruiz',  Company = 'Acme',    Email = 'ruiz@acme.com'),
    new Lead(LastName = 'Kim',   Company = 'Globex',  Email = 'not-an-email'),
    new Lead(LastName = 'Silva', Company = 'Initech', Email = 'silva@initech.com')
};

insert leads;
`,
    },
    hints: [
      {
        es: "Yo empezaría por el modo de carga: insert leads; es todo o nada, así que Kim arrastraría a Ruiz y a Silva. Cambia a la versión de Database con allOrNone en false, la que se comporta como Data Loader.",
        en: "I would start with the load mode: insert leads; is all or nothing, so Kim would drag Ruiz and Silva down. Switch to the Database version with allOrNone set to false, the one that behaves like Data Loader.",
      },
      {
        es: "Lo que me ayudó: el for con índice te da i, que sirve a la vez para results[i] y leads[i], como la fila del error.csv que coincide con la de tu archivo. Los errores están en results[i].getErrors(), cada uno con getMessage().",
        en: "What helped me: the indexed for gives you i, which works for both results[i] and leads[i], like the error.csv row that matches your file's row. The errors are in results[i].getErrors(), each with getMessage().",
      },
      {
        es: "Te dejo el esquema: List<Database.SaveResult> results = Database.insert(leads, false); Integer saved = 0; List<String> errors = new List<String>(); for (Integer i = 0; i < results.size(); i++) { if (results[i].isSuccess()) saved++; else for (Database.Error e : results[i].getErrors()) errors.add(leads[i].LastName + ': ' + e.getMessage()); }",
        en: "Here is the outline: List<Database.SaveResult> results = Database.insert(leads, false); Integer saved = 0; List<String> errors = new List<String>(); for (Integer i = 0; i < results.size(); i++) { if (results[i].isSuccess()) saved++; else for (Database.Error e : results[i].getErrors()) errors.add(leads[i].LastName + ': ' + e.getMessage()); }",
      },
    ],
    solution: {
      es: `List<Lead> leads = new List<Lead>{
    new Lead(LastName = 'Ruiz',  Company = 'Acme',    Email = 'ruiz@acme.com'),
    new Lead(LastName = 'Kim',   Company = 'Globex',  Email = 'no-es-un-email'),
    new Lead(LastName = 'Silva', Company = 'Initech', Email = 'silva@initech.com')
};

List<Database.SaveResult> results = Database.insert(leads, false);

Integer saved = 0;
List<String> errors = new List<String>();

for (Integer i = 0; i < results.size(); i++) {
    if (results[i].isSuccess()) {
        saved++;
    } else {
        for (Database.Error err : results[i].getErrors()) {
            errors.add(leads[i].LastName + ': ' + err.getMessage());
        }
    }
}

System.debug('Guardados: ' + saved);
System.debug('Errores: ' + errors);`,
      en: `List<Lead> leads = new List<Lead>{
    new Lead(LastName = 'Ruiz',  Company = 'Acme',    Email = 'ruiz@acme.com'),
    new Lead(LastName = 'Kim',   Company = 'Globex',  Email = 'not-an-email'),
    new Lead(LastName = 'Silva', Company = 'Initech', Email = 'silva@initech.com')
};

List<Database.SaveResult> results = Database.insert(leads, false);

Integer saved = 0;
List<String> errors = new List<String>();

for (Integer i = 0; i < results.size(); i++) {
    if (results[i].isSuccess()) {
        saved++;
    } else {
        for (Database.Error err : results[i].getErrors()) {
            errors.add(leads[i].LastName + ': ' + err.getMessage());
        }
    }
}

System.debug('Saved: ' + saved);
System.debug('Errors: ' + errors);`,
    },
    checks: [
      {
        id: "m04-l02-c1",
        label: {
          es: "Database.insert con allOrNone en false, guardado en results",
          en: "Database.insert with allOrNone false, stored in results",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "List\\s*<\\s*Database\\.SaveResult\\s*>\\s+results\\s*=\\s*Database\\.insert\\(\\s*leads\\s*,\\s*false\\s*\\)\\s*;" },
            { op: "absent", pattern: "^\\s*insert\\s+leads\\s*;", flags: "im" },
          ],
        },
        onFail: {
          es: "Sustituye insert leads; por List<Database.SaveResult> results = Database.insert(leads, false);",
          en: "Replace insert leads; with List<Database.SaveResult> results = Database.insert(leads, false);",
        },
        otter: {
          es: "Para guardar lo que se pueda, como Data Loader, sustituye insert leads; por List<Database.SaveResult> results = Database.insert(leads, false);",
          en: "To save whatever can be saved, like Data Loader, replace insert leads; with List<Database.SaveResult> results = Database.insert(leads, false);",
        },
      },
      {
        id: "m04-l02-c2",
        label: {
          es: "Un for con índice recorre los resultados",
          en: "An indexed for walks the results",
        },
        rule: { op: "match", pattern: "for\\s*\\(\\s*Integer\\s+(\\w+)\\s*=\\s*0\\s*;\\s*\\1\\s*<\\s*results\\.size\\(\\s*\\)\\s*;" },
        onFail: {
          es: "for (Integer i = 0; i < results.size(); i++) — el índice enlaza results[i] con leads[i].",
          en: "for (Integer i = 0; i < results.size(); i++) — the index links results[i] to leads[i].",
        },
        otter: {
          es: "results viene en el mismo orden que leads, igual que el error.csv respeta el orden de tu archivo: for (Integer i = 0; i < results.size(); i++) enlaza results[i] con leads[i].",
          en: "results comes in the same order as leads, just as error.csv keeps your file's order: for (Integer i = 0; i < results.size(); i++) links results[i] with leads[i].",
        },
      },
      {
        id: "m04-l02-c3",
        label: {
          es: "Cuenta los guardados con isSuccess()",
          en: "Counts the saved ones with isSuccess()",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Integer\\s+saved\\s*=\\s*0\\s*;" },
            { op: "match", pattern: "\\.isSuccess\\(\\s*\\)" },
            { op: "match", pattern: "saved\\s*\\+\\+|saved\\s*\\+=\\s*1|saved\\s*=\\s*saved\\s*\\+\\s*1" },
          ],
        },
        onFail: {
          es: "Integer saved = 0; y dentro del if (results[i].isSuccess()) { saved++; }",
          en: "Integer saved = 0; and inside if (results[i].isSuccess()) { saved++; }",
        },
        otter: {
          es: "Contar los guardados es tu success.csv: Integer saved = 0; y dentro del if (results[i].isSuccess()) { saved++; }",
          en: "Counting the saved ones is your success.csv: Integer saved = 0; and inside the if (results[i].isSuccess()) { saved++; }",
        },
      },
      {
        id: "m04-l02-c4",
        label: {
          es: "Cada fallo añade apellido y mensaje a errors",
          en: "Each failure adds last name and message to errors",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "List\\s*<\\s*String\\s*>\\s+errors\\s*=\\s*new\\s+List\\s*<\\s*String\\s*>\\s*\\(\\s*\\)" },
            { op: "match", pattern: "\\.getErrors\\(\\s*\\)" },
            { op: "match", pattern: "errors\\.add\\([^;]*leads\\s*\\[\\s*\\w+\\s*\\]\\.LastName[^;]*getMessage\\(\\s*\\)[^;]*\\)\\s*;" },
          ],
        },
        onFail: {
          es: "for (Database.Error err : results[i].getErrors()) { errors.add(leads[i].LastName + ': ' + err.getMessage()); }",
          en: "for (Database.Error err : results[i].getErrors()) { errors.add(leads[i].LastName + ': ' + err.getMessage()); }",
        },
        otter: {
          es: "Cada fallo es una fila de tu error.csv: for (Database.Error err : results[i].getErrors()) { errors.add(leads[i].LastName + ': ' + err.getMessage()); }",
          en: "Each failure is a row of your error.csv: for (Database.Error err : results[i].getErrors()) { errors.add(leads[i].LastName + ': ' + err.getMessage()); }",
        },
      },
      {
        id: "m04-l02-c5",
        label: { es: "Muestra saved y errors", en: "Shows saved and errors" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "System\\.debug\\([^;]*\\bsaved\\b[^;]*\\)" },
            { op: "match", pattern: "System\\.debug\\([^;]*\\berrors\\b[^;]*\\)" },
          ],
        },
        onFail: {
          es: "Termina con un System.debug de saved y otro de errors.",
          en: "Finish with one System.debug of saved and another of errors.",
        },
        otter: {
          es: "Al final, el resumen para Marketing: un System.debug de saved y otro de errors.",
          en: "At the end, the summary for Marketing: one System.debug of saved and another of errors.",
        },
        onPass: {
          es: "Ruiz y Silva guardados, y el motivo del fallo de Kim listo para Marketing: tu propio error.csv.",
          en: "Ruiz and Silva saved, and the reason for Kim's failure ready for Marketing: your own error.csv.",
        },
      },
    ],
    rubric: [
      {
        es: "En lugar de un System.debug que nadie verá de noche, ¿dónde guardarías esos errores para que Marketing los encuentre por la mañana?",
        en: "Instead of a System.debug nobody will see at night, where would you store those errors so Marketing finds them in the morning?",
      },
    ],
    outro: {
      es: "Ya eliges entre todo o nada y guardar lo que se pueda, y lees cada SaveResult como un error.csv. En la tarea 3 llega el cierre de trimestre: 180 oportunidades ganadas de golpe, y el código de un compañero que revienta.",
      en: "You can now choose between all or nothing and saving what you can, and you read each SaveResult like an error.csv. Task 3 brings the quarter close: 180 won opportunities at once, and a colleague's code that blows up.",
    },
    voice: "otter",
  },
};
