import type { Lesson } from "@/lib/types";

const STARTER_BODY = `String erpCode = 'ERP-404';
Decimal amount = 12500;

Account acc = [SELECT Id, Name, OwnerId FROM Account WHERE ERP_Code__c = :erpCode LIMIT 1];
Opportunity renewal = new Opportunity(
    Name = acc.Name + ' · Renovación',
    AccountId = acc.Id,
    OwnerId = acc.OwnerId,
    Type = 'Renewal',
    StageName = 'Prospecting',
    CloseDate = Date.today().addDays(30),
    Amount = amount
);
insert renewal;
System.debug('Renovación creada: ' + renewal.Id);
`;

const SOLUTION_ES = `// CASO: el puente nocturno con el ERP de Northwind
// Tarea 2 de 6: la cuenta del ERP puede no existir… o no dejarse guardar.

String erpCode = 'ERP-404';
Decimal amount = 12500;

try {
    Account acc = [SELECT Id, Name, OwnerId FROM Account WHERE ERP_Code__c = :erpCode LIMIT 1];
    Opportunity renewal = new Opportunity(
        Name = acc.Name + ' · Renovación',
        AccountId = acc.Id,
        OwnerId = acc.OwnerId,
        Type = 'Renewal',
        StageName = 'Prospecting',
        CloseDate = Date.today().addDays(30),
        Amount = amount
    );
    insert renewal;
    System.debug('Renovación creada: ' + renewal.Id);
} catch (QueryException e) {
    System.debug('No hay ninguna cuenta con el código ' + erpCode);
} catch (DmlException e) {
    System.debug('Guardado rechazado: ' + e.getDmlMessage(0));
} catch (Exception e) {
    System.debug('Error inesperado: ' + e.getTypeName() + ' · ' + e.getMessage());
}`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente nocturno con el ERP de Northwind\n// Tarea 2 de 6: la cuenta del ERP puede no existir… o no dejarse guardar.",
  "// CASE: Northwind's nightly bridge with the ERP\n// Task 2 of 6: the ERP's account may not exist… or may refuse to save.",
)
  .replace("' · Renovación'", "' · Renewal'")
  .replace("'Renovación creada: '", "'Renewal created: '")
  .replace("'No hay ninguna cuenta con el código '", "'No account with the code '")
  .replace("'Guardado rechazado: '", "'Save rejected: '")
  .replace("'Error inesperado: '", "'Unexpected error: '");

export const l02TiposDeExcepcion: Lesson = {
  id: "m08-l02",
  slug: "tipos-de-excepcion",
  n: 2,
  kind: "lesson",
  minutes: 30,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 1", en: "Remember? · Review of lesson 1" },
    prompt: {
      es: "Quieres que un importe mal escrito no pare el resto de filas. ¿Dónde va el try?",
      en: "You want a badly written amount not to stop the rest of the rows. Where does the try go?",
    },
    options: [
      { es: "Fuera del bucle, rodeándolo entero", en: "Outside the loop, wrapping it whole" },
      { es: "Dentro del bucle, alrededor de cada fila", en: "Inside the loop, around each row" },
      { es: "Da igual dónde", en: "It does not matter where" },
    ],
    answer: 1,
    explain: {
      es: "Dentro del bucle: cada fila tiene su propio fault path y el bucle sigue con la siguiente.",
      en: "Inside the loop: each row gets its own fault path and the loop moves on to the next.",
    },
  },
  title: { es: "Tipos de excepción en Apex", en: "Exception types in Apex" },
  summary: {
    es: "No todos los fallos son iguales: no es lo mismo que una cuenta no exista que un guardado rechazado. Cada tipo de excepción dice qué pasó, y cada catch se ocupa del suyo.",
    en: "Not all failures are equal: an account that does not exist is not the same as a rejected save. Each exception type says what happened, and each catch deals with its own.",
  },
  analogy: {
    es: "Los códigos de error de un error.csv de Data Loader",
    en: "The error codes in a Data Loader error.csv",
  },
  objectives: [
    {
      es: "Reconocer las excepciones más habituales y qué situación provoca cada una.",
      en: "Recognise the most common exceptions and the situation behind each one.",
    },
    {
      es: "Encadenar varios catch, del tipo más concreto al más general.",
      en: "Chain several catch blocks, from the most specific type to the most general.",
    },
    {
      es: "Explicar por qué LimitException no se puede capturar.",
      en: "Explain why LimitException cannot be caught.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "En la tarea 1 el fallo era siempre el mismo: un texto que no era un número. Pero en el puente con el ERP pueden fallar cosas muy distintas, y no todas se tratan igual. Si la cuenta no existe, hay que avisar al ERP de que el código es incorrecto. Si Salesforce rechaza el guardado, hay que decir por qué. El tipo de la excepción es lo que te permite distinguirlas.",
        en: "In task 1 the failure was always the same: text that was not a number. But on the ERP bridge very different things can fail, and not all are handled the same way. If the account does not exist, the ERP must be told the code is wrong. If Salesforce rejects the save, you must say why. The exception's type is what lets you tell them apart.",
      },
    },
    {
      type: "h",
      text: { es: "Las excepciones que más te vas a encontrar", en: "The exceptions you will meet most" },
    },
    {
      type: "table",
      head: [
        { es: "Excepción", en: "Exception" },
        { es: "Cuándo salta", en: "When it is thrown" },
        { es: "Ejemplo", en: "Example" },
      ],
      rows: [
        [
          { es: "DmlException", en: "DmlException" },
          { es: "Un insert, update o delete rechazado: una regla de validación, un campo obligatorio, un propietario inactivo.", en: "An insert, update or delete that is rejected: a validation rule, a required field, an inactive owner." },
          { es: "insert opp; con un OwnerId de un usuario inactivo", en: "insert opp; with an inactive user's OwnerId" },
        ],
        [
          { es: "QueryException", en: "QueryException" },
          { es: "Asignas a un solo registro una consulta que no devuelve ninguno (o que devuelve más de uno).", en: "You assign to a single record a query that returns none (or more than one)." },
          { es: "Account a = [SELECT … WHERE ERP_Code__c = 'ERP-404'];", en: "Account a = [SELECT … WHERE ERP_Code__c = 'ERP-404'];" },
        ],
        [
          { es: "NullPointerException", en: "NullPointerException" },
          { es: "Usas algo que es null como si tuviera valor.", en: "You use something null as if it had a value." },
          { es: "acc.Name cuando acc es null", en: "acc.Name when acc is null" },
        ],
        [
          { es: "TypeException", en: "TypeException" },
          { es: "Una conversión imposible entre tipos.", en: "An impossible conversion between types." },
          { es: "Decimal.valueOf('12.500,00')", en: "Decimal.valueOf('12.500,00')" },
        ],
        [
          { es: "ListException", en: "ListException" },
          { es: "Pides una posición que la lista no tiene.", en: "You ask for a position the list does not have." },
          { es: "rows[5] en una lista de 3", en: "rows[5] on a list of 3" },
        ],
        [
          { es: "SObjectException", en: "SObjectException" },
          { es: "Lees un campo que no pediste en la consulta.", en: "You read a field you did not ask for in the query." },
          { es: "a.Industry si el SELECT solo traía Id", en: "a.Industry when the SELECT only brought Id" },
        ],
        [
          { es: "LimitException", en: "LimitException" },
          { es: "Superas un governor limit. No se puede capturar.", en: "You exceed a governor limit. It cannot be caught." },
          { es: "La consulta número 101", en: "Query number 101" },
        ],
      ],
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Los códigos de error que ya has visto", en: "The error codes you have already seen" },
      text: {
        es: "Seguro que en un error.csv de Data Loader has visto REQUIRED_FIELD_MISSING, FIELD_CUSTOM_VALIDATION_EXCEPTION o INACTIVE_OWNER_OR_USER; yo me los sé de memoria. Son los códigos de estado de un guardado rechazado, y en Apex llegan dentro de una DmlException: e.getDmlMessage(0) te da el mensaje del primer registro que falló, y e.getDmlType(0), su código.",
        en: "You have surely seen REQUIRED_FIELD_MISSING, FIELD_CUSTOM_VALIDATION_EXCEPTION or INACTIVE_OWNER_OR_USER in a Data Loader error.csv; I know them by heart. They are the status codes of a rejected save, and in Apex they arrive inside a DmlException: e.getDmlMessage(0) gives you the first failed record's message, and e.getDmlType(0) its code.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "Varios catch, del más concreto al más general", en: "Several catch blocks, most specific first" },
    },
    {
      type: "p",
      text: {
        es: "Un try puede llevar varios catch seguidos. Cuando salta una excepción, Apex los prueba de arriba abajo y usa el primero cuyo tipo encaja. Todas las excepciones son hijas de Exception, así que un catch (Exception e) encaja con cualquiera: si lo pones, que sea el último, como red de seguridad para lo que no esperabas. Si lo pusieras el primero, se quedaría con todo y los catch concretos no llegarían a usarse nunca.",
        en: "A try can carry several catch blocks in a row. When an exception is thrown, Apex tries them top to bottom and uses the first whose type fits. Every exception is a child of Exception, so a catch (Exception e) fits any of them: if you use it, make it the last one, as a safety net for what you did not expect. Put it first and it would keep everything, and the specific catch blocks would never be used.",
      },
    },
    {
      type: "code",
      code: {
        es: `try {
    Account acc = [SELECT Id, OwnerId FROM Account WHERE ERP_Code__c = :erpCode LIMIT 1];
    insert new Opportunity(Name = erpCode, AccountId = acc.Id, OwnerId = acc.OwnerId,
                           StageName = 'Prospecting', CloseDate = Date.today());
} catch (QueryException e) {
    System.debug('Código de cuenta desconocido: ' + erpCode);      // avisar al ERP
} catch (DmlException e) {
    System.debug(e.getDmlType(0) + ': ' + e.getDmlMessage(0));    // el motivo exacto
} catch (Exception e) {
    System.debug('Inesperado: ' + e.getTypeName() + ' en la línea ' + e.getLineNumber());
}`,
        en: `try {
    Account acc = [SELECT Id, OwnerId FROM Account WHERE ERP_Code__c = :erpCode LIMIT 1];
    insert new Opportunity(Name = erpCode, AccountId = acc.Id, OwnerId = acc.OwnerId,
                           StageName = 'Prospecting', CloseDate = Date.today());
} catch (QueryException e) {
    System.debug('Unknown account code: ' + erpCode);             // tell the ERP
} catch (DmlException e) {
    System.debug(e.getDmlType(0) + ': ' + e.getDmlMessage(0));    // the exact reason
} catch (Exception e) {
    System.debug('Unexpected: ' + e.getTypeName() + ' on line ' + e.getLineNumber());
}`,
      },
      caption: {
        es: "getTypeName() dice qué tipo de excepción era (por ejemplo, System.ListException) y getLineNumber() en qué línea saltó: oro puro cuando cae en la red de seguridad.",
        en: "getTypeName() says which exception type it was (for example, System.ListException) and getLineNumber() which line threw it: pure gold when it lands in the safety net.",
      },
    },
    {
      type: "diagram",
      id: "m08-exception-types",
      caption: {
        es: "Para cada línea, ¿qué excepción salta? Fíjate en la pista de cada una.",
        en: "For each line, which exception is thrown? Look at each one's clue.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque el fault path solo recibe un texto", en: "Why not a Flow? Because the fault path only gets text" },
      text: {
        es: "Esto nos pasó con la primera versión: en Flow, cuando un elemento falla, el fault path recibe un único texto, $Flow.FaultMessage. Queríamos tratar distinto «la cuenta no existe» y «el guardado fue rechazado», y la única forma era buscar palabras dentro de ese texto con una fórmula… y cruzar los dedos para que Salesforce no cambiara la redacción del mensaje. En Apex el tipo de la excepción ya te dice qué pasó, y cada catch se ocupa del suyo.",
        en: "It happened to us with the first version: in Flow, when an element fails, the fault path gets a single text, $Flow.FaultMessage. We wanted to treat «the account does not exist» and «the save was rejected» differently, and the only way was to search for words inside that text with a formula… and cross our fingers that Salesforce never reworded the message. In Apex the exception's type already tells you what happened, and each catch deals with its own.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "LimitException no se captura", en: "LimitException cannot be caught" },
      text: {
        es: "De todas, hay una que ningún catch puede atrapar: LimitException. Si superas un governor limit, la transacción muere sí o sí, aunque la hayas rodeado con un try. Por eso el Flow de la lección 1 no tenía salvación al llegar al DML 151, y por eso los límites se previenen con bulkificación (Módulo 4), no se capturan.",
        en: "Of all of them, there is one no catch can trap: LimitException. If you exceed a governor limit, the transaction dies no matter what, even inside a try. That is why lesson 1's Flow could not be saved when it reached DML 151, and why limits are prevented with bulkification (Module 4), not caught.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué excepción salta al asignar a un solo Account una consulta sin resultados? ¿Por qué el catch de Exception va el último? ¿Qué excepción no se puede capturar?",
        en: "Without looking: which exception is thrown when you assign a query with no results to a single Account? Why does the Exception catch go last? Which exception cannot be caught?",
      },
    },
  ],

  quiz: [
    {
      id: "m08-l02-q1",
      kind: "single",
      prompt: {
        es: "En la org no hay ninguna cuenta llamada 'Zeta'. ¿Qué pasa al ejecutar esta línea?",
        en: "There is no account called 'Zeta' in the org. What happens when this line runs?",
      },
      code: { es: "Account a = [SELECT Id FROM Account WHERE Name = 'Zeta'];", en: "Account a = [SELECT Id FROM Account WHERE Name = 'Zeta'];" },
      options: [
        { es: "Salta una QueryException: no hay ninguna fila que asignar", en: "A QueryException is thrown: there is no row to assign" },
        { es: "a queda en null y el código sigue", en: "a becomes null and the code carries on" },
        { es: "Salta una NullPointerException", en: "A NullPointerException is thrown" },
        { es: "Salta una DmlException", en: "A DmlException is thrown" },
      ],
      answer: 0,
      explain: {
        es: "Asignar a un solo registro exige exactamente una fila. Con cero salta QueryException: «List has no rows for assignment to SObject». Si lo guardaras en una List, quedaría vacía y sin error.",
        en: "Assigning to a single record demands exactly one row. With zero, QueryException is thrown: «List has no rows for assignment to SObject». Stored in a List, it would simply be empty with no error.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m08-l02-q2",
      kind: "single",
      prompt: { es: "¿Qué problema tiene este orden de catch?", en: "What is wrong with this catch order?" },
      code: {
        es: `try {
    Account a = [SELECT Id FROM Account WHERE ERP_Code__c = :code];
} catch (Exception e) {
    System.debug('Algo falló');
} catch (QueryException e) {
    System.debug('Código desconocido');
}`,
        en: `try {
    Account a = [SELECT Id FROM Account WHERE ERP_Code__c = :code];
} catch (Exception e) {
    System.debug('Something failed');
} catch (QueryException e) {
    System.debug('Unknown code');
}`,
      },
      options: [
        {
          es: "El catch de Exception encaja con todo: el de QueryException no llegaría a usarse nunca.",
          en: "The Exception catch fits everything: the QueryException one would never be used.",
        },
        { es: "Ninguno: Apex elige siempre el catch más concreto.", en: "None: Apex always picks the most specific catch." },
        { es: "Un try solo admite un catch.", en: "A try only allows one catch." },
        { es: "QueryException no es hija de Exception.", en: "QueryException is not a child of Exception." },
      ],
      answer: 0,
      explain: {
        es: "Apex prueba los catch de arriba abajo y se queda con el primero que encaja. Los concretos primero; Exception, si está, el último.",
        en: "Apex tries the catch blocks top to bottom and keeps the first that fits. Specific ones first; Exception, if present, last.",
      },
      tags: ["find-error"],
    },
    {
      id: "m08-l02-q3",
      kind: "single",
      prompt: { es: "¿Qué excepción no se puede capturar con un catch?", en: "Which exception cannot be caught with a catch?" },
      options: [
        { es: "LimitException", en: "LimitException" },
        { es: "DmlException", en: "DmlException" },
        { es: "NullPointerException", en: "NullPointerException" },
        { es: "QueryException", en: "QueryException" },
      ],
      answer: 0,
      explain: {
        es: "Superar un governor limit mata la transacción sin remedio. Los límites se previenen; no se capturan.",
        en: "Exceeding a governor limit kills the transaction beyond rescue. Limits are prevented; they are not caught.",
      },
      tags: ["recall"],
    },
    {
      id: "m08-l02-q4",
      kind: "multi",
      prompt: { es: "¿Qué líneas lanzan una excepción?", en: "Which lines throw an exception?" },
      options: [
        { es: "List<Account> accs = [SELECT Id FROM Account WHERE Name = 'Zeta'];", en: "List<Account> accs = [SELECT Id FROM Account WHERE Name = 'Zeta'];" },
        { es: "Account a = [SELECT Id FROM Account WHERE Name = 'Zeta'];", en: "Account a = [SELECT Id FROM Account WHERE Name = 'Zeta'];" },
        { es: "Integer n = Integer.valueOf('7');", en: "Integer n = Integer.valueOf('7');" },
        { es: "String s = new List<String>()[0];", en: "String s = new List<String>()[0];" },
      ],
      answers: [1, 3],
      explain: {
        es: "Una List vacía es un resultado válido; asignar cero filas a un solo registro no (QueryException). '7' sí es un número. Y pedir la posición 0 de una lista vacía lanza ListException.",
        en: "An empty List is a valid result; assigning zero rows to a single record is not (QueryException). '7' is a number. And asking for position 0 of an empty list throws ListException.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m08-l02-q5",
      kind: "text",
      prompt: {
        es: "Dentro de catch (DmlException e), escribe la expresión que devuelve el mensaje del primer registro que falló.",
        en: "Inside catch (DmlException e), write the expression that returns the first failed record's message.",
      },
      accept: ["e\\.getdmlmessage\\s*\\(\\s*0\\s*\\)", "getdmlmessage\\s*\\(\\s*0\\s*\\)"],
      placeholder: { es: "e.get…", en: "e.get…" },
      explain: {
        es: "e.getDmlMessage(0): el 0 es la posición del primer registro fallido. Con e.getDmlType(0) tienes su código, como en el error.csv.",
        en: "e.getDmlMessage(0): 0 is the position of the first failed record. With e.getDmlType(0) you get its code, as in the error.csv.",
      },
      tags: ["recall"],
    },
    {
      id: "m08-l02-q6",
      kind: "single",
      prompt: {
        es: "Repaso: tu código lee a.Industry, pero la consulta solo pidió Id y Name. ¿Qué pasa?",
        en: "Review: your code reads a.Industry, but the query only asked for Id and Name. What happens?",
      },
      options: [
        { es: "Salta una SObjectException al leer el campo", en: "An SObjectException is thrown when reading the field" },
        { es: "Devuelve null sin avisar", en: "It returns null without warning" },
        { es: "Salesforce trae el campo automáticamente", en: "Salesforce fetches the field automatically" },
        { es: "Salta una QueryException", en: "A QueryException is thrown" },
      ],
      answer: 0,
      explain: {
        es: "Un campo que no pediste no viene, y leerlo lanza SObjectException. Ahora ya sabes su nombre.",
        en: "A field you did not ask for does not come, and reading it throws SObjectException. Now you know its name.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M3 L1", en: "Review · M3 L1" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 2 DE 6 · El importe ya se convierte bien, pero cada fila del ERP busca su cuenta por el código ERP, y a veces el código no existe o Salesforce rechaza el guardado. Hoy cualquiera de las dos cosas para la importación con un error rojo. Trata cada fallo por su tipo: el ERP necesita saber si el código estaba mal o si el guardado se rechazó, y por qué.",
      en: "TASK 2 OF 6 · The amount now converts fine, but each ERP row looks up its account by ERP code, and sometimes the code does not exist or Salesforce rejects the save. Today either one stops the import with a red error. Handle each failure by its type: the ERP needs to know whether the code was wrong or the save was rejected, and why.",
    },
    brief: [
      {
        es: "La consulta de la cuenta, la creación de la oportunidad y el insert van dentro de un try.",
        en: "The account query, building the opportunity and the insert go inside a try.",
      },
      {
        es: "catch (QueryException e): un System.debug que diga qué código de ERP no existe (usa erpCode).",
        en: "catch (QueryException e): a System.debug saying which ERP code does not exist (use erpCode).",
      },
      {
        es: "catch (DmlException e): un System.debug con el motivo del rechazo, e.getDmlMessage(0).",
        en: "catch (DmlException e): a System.debug with the rejection reason, e.getDmlMessage(0).",
      },
      {
        es: "Al final, como red de seguridad, catch (Exception e) con e.getTypeName() y e.getMessage().",
        en: "Last, as a safety net, catch (Exception e) with e.getTypeName() and e.getMessage().",
      },
    ],
    starter: {
      es: `// CASO: el puente nocturno con el ERP de Northwind
// Ya resuelto (tarea 1): un importe mal escrito ya no tumba la importación.
// Tarea 2 de 6: la cuenta del ERP puede no existir… o no dejarse guardar.

${STARTER_BODY}`,
      en: `// CASE: Northwind's nightly bridge with the ERP
// Already solved (task 1): a badly written amount no longer brings the import down.
// Task 2 of 6: the ERP's account may not exist… or may refuse to save.

${STARTER_BODY.replace("' · Renovación'", "' · Renewal'").replace("'Renovación creada: '", "'Renewal created: '")}`,
    },
    hints: [
      {
        es: "Yo empezaría preguntándome qué dos líneas pueden fallar y con qué excepción cada una: la consulta que asigna a un solo Account y el insert.",
        en: "I would start by asking which two lines can fail and with which exception each: the query assigning to a single Account and the insert.",
      },
      {
        es: "Lo que me ayudó: una consulta sin resultados asignada a un solo registro lanza QueryException; un guardado rechazado, DmlException. Cada uno con su catch, y catch (Exception e) el último, como red de seguridad.",
        en: "What helped me: a query with no results assigned to a single record throws QueryException; a rejected save, DmlException. Each with its catch, and catch (Exception e) last, as a safety net.",
      },
      {
        es: "Te dejo el esquema: try { Account acc = [SELECT …]; Opportunity renewal = …; insert renewal; } catch (QueryException e) { … erpCode … } catch (DmlException e) { … e.getDmlMessage(0) … } catch (Exception e) { … e.getTypeName() … }",
        en: "Here is the outline: try { Account acc = [SELECT …]; Opportunity renewal = …; insert renewal; } catch (QueryException e) { … erpCode … } catch (DmlException e) { … e.getDmlMessage(0) … } catch (Exception e) { … e.getTypeName() … }",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m08-l02-c1",
        label: { es: "La consulta y el insert van dentro del try", en: "The query and the insert are inside the try" },
        rule: { op: "match", pattern: "\\btry\\s*\\{[\\s\\S]*?\\[\\s*SELECT[\\s\\S]*?\\binsert\\s+renewal[\\s\\S]*?\\}\\s*catch" },
        onFail: {
          es: "Rodea con el try la consulta de la cuenta, la creación de la oportunidad y el insert renewal: las dos líneas que pueden fallar tienen que estar dentro.",
          en: "Wrap the account query, building the opportunity and the insert renewal in the try: both lines that can fail have to be inside.",
        },
        otter: {
          es: "Las dos líneas que pueden fallar, la consulta y el insert, tienen que ir dentro del try, igual que el elemento de Flow al que le cuelgas el fault path.",
          en: "Both lines that can fail, the query and the insert, have to go inside the try, just like the Flow element you hang the fault path on.",
        },
      },
      {
        id: "m08-l02-c2",
        label: { es: "Un catch para QueryException", en: "A catch for QueryException" },
        rule: { op: "match", pattern: "catch\\s*\\(\\s*(System\\.)?QueryException\\s+\\w+\\s*\\)" },
        onFail: {
          es: "Una consulta sin resultados asignada a un solo Account lanza QueryException: dale su propio catch.",
          en: "A query with no results assigned to a single Account throws QueryException: give it its own catch.",
        },
        otter: {
          es: "La cuenta que no existe tiene nombre propio: QueryException, «List has no rows for assignment». Dale su catch, igual que en el error.csv cada fallo trae su código.",
          en: "The missing account has its own name: QueryException, «List has no rows for assignment». Give it its catch, just as every failure in the error.csv carries its code.",
        },
      },
      {
        id: "m08-l02-c3",
        label: { es: "Un catch para DmlException con el motivo", en: "A catch for DmlException with the reason" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "catch\\s*\\(\\s*(System\\.)?DmlException\\s+\\w+\\s*\\)" },
            { op: "match", pattern: "\\.getDmlMessage\\s*\\(\\s*0\\s*\\)" },
          ],
        },
        onFail: {
          es: "Un guardado rechazado es una DmlException: catch (DmlException e) y, dentro, e.getDmlMessage(0) para el motivo.",
          en: "A rejected save is a DmlException: catch (DmlException e) and, inside, e.getDmlMessage(0) for the reason.",
        },
        otter: {
          es: "El guardado rechazado es tu fila del error.csv: catch (DmlException e) y e.getDmlMessage(0), que trae el mismo mensaje que vería un usuario, por ejemplo el de tu regla de validación.",
          en: "The rejected save is your error.csv row: catch (DmlException e) and e.getDmlMessage(0), which carries the same message a user would see, for example your validation rule's.",
        },
      },
      {
        id: "m08-l02-c4",
        label: { es: "La red de seguridad, catch (Exception e), va la última", en: "The safety net, catch (Exception e), goes last" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "catch\\s*\\(\\s*(System\\.)?Exception\\s+\\w+\\s*\\)" },
            { op: "absent", pattern: "catch\\s*\\(\\s*(System\\.)?Exception\\s+\\w+\\s*\\)[\\s\\S]*catch\\s*\\(" },
            { op: "match", pattern: "\\.getTypeName\\s*\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "Añade al final catch (Exception e) con e.getTypeName(): encaja con cualquier excepción, así que tiene que ir después de los concretos.",
          en: "Add catch (Exception e) at the end with e.getTypeName(): it fits any exception, so it has to come after the specific ones.",
        },
        otter: {
          es: "La red de seguridad va la última, porque Exception encaja con todo: si fuera la primera, se quedaría con todos los fallos. Y con e.getTypeName() sabrás qué fue lo inesperado.",
          en: "The safety net goes last, because Exception fits everything: if it came first, it would keep every failure. And with e.getTypeName() you will know what the unexpected thing was.",
        },
      },
      {
        id: "m08-l02-c5",
        label: { es: "El aviso de cuenta inexistente dice qué código falló", en: "The missing-account notice says which code failed" },
        rule: { op: "match", pattern: "catch\\s*\\(\\s*(System\\.)?QueryException\\s+\\w+\\s*\\)\\s*\\{[^}]*erpCode" },
        onFail: {
          es: "Dentro del catch de QueryException, incluye erpCode en el mensaje: el ERP necesita saber qué código corregir.",
          en: "Inside the QueryException catch, include erpCode in the message: the ERP needs to know which code to fix.",
        },
        otter: {
          es: "Un «no existe» sin decir qué código es como un error.csv sin la fila: incluye erpCode en el mensaje para que el ERP sepa qué corregir.",
          en: "A «does not exist» that does not say which code is like an error.csv without the row: include erpCode in the message so the ERP knows what to fix.",
        },
      },
    ],
    rubric: [
      {
        es: "Cambia la consulta para guardarla en una List<Account> y comprueba si está vacía. ¿Sigue haciendo falta el catch de QueryException? ¿Qué forma te parece más clara?",
        en: "Change the query to store it in a List<Account> and check whether it is empty. Is the QueryException catch still needed? Which way seems clearer to you?",
      },
      {
        es: "Con 300 filas, ¿harías esta consulta una vez por fila? ¿Qué te enseñó el Módulo 4 sobre eso? La tarea 6 lo resuelve.",
        en: "With 300 rows, would you run this query once per row? What did Module 4 teach you about that? Task 6 solves it.",
      },
    ],
    voice: "otter",
    outro: {
      es: "Ya reconoces cada fallo por su nombre y le das a cada uno su catch, del más concreto al más general. En la tarea 3, la validación de cada fila sale a un método… que tiene que avisar a quien lo llama cuando algo no cuadra.",
      en: "You can now recognise each failure by name and give each its catch, from the most specific to the most general. In task 3, each row's validation moves into a method… which has to warn whoever calls it when something is off.",
    },
  },
};
