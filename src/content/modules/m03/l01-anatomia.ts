import type { Lesson } from "@/lib/types";

export const l01Anatomia: Lesson = {
  id: "m03-l01",
  slug: "anatomia-soql",
  n: 1,
  kind: "lesson",
  minutes: 20,
  title: {
    es: "Anatomía de una consulta SOQL",
    en: "Anatomy of a SOQL query",
  },
  summary: {
    es: "SELECT qué campos, FROM qué objeto. Entre corchetes, dentro de tu código, y te devuelve una lista de registros lista para usar.",
    en: "SELECT which fields, FROM which object. In square brackets, inside your code, and it hands back a list of records ready to use.",
  },
  analogy: {
    es: "Un Report Type y las columnas que eliges para el informe",
    en: "A Report Type and the columns you pick for the report",
  },
  objectives: [
    {
      es: "Escribir una consulta SOQL con SELECT y FROM y guardar el resultado en una List.",
      en: "Write a SOQL query with SELECT and FROM and store the result in a List.",
    },
    {
      es: "Explicar por qué solo puedes leer los campos que pediste en el SELECT.",
      en: "Explain why you can only read the fields you asked for in the SELECT.",
    },
    {
      es: "Saber cuándo asignar el resultado a un solo registro y qué pasa si no hay filas.",
      en: "Know when to assign the result to a single record and what happens when there are no rows.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Hasta ahora tus registros los fabricabas tú con new. En una org real ya existen: miles de cuentas, contactos y oportunidades guardados en la base de datos. [[soql|SOQL]] es la forma de pedírselos a Salesforce desde Apex.",
        en: "Until now you made your records yourself with new. In a real org they already exist: thousands of accounts, contacts and opportunities stored in the database. [[soql|SOQL]] is how you ask Salesforce for them from Apex.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Cuando creas un informe, primero eliges el Report Type (Cuentas, Oportunidades…) y luego las columnas que quieres ver. SOQL es exactamente eso, escrito en una línea: FROM es el Report Type y SELECT son las columnas. Si una columna no está en el informe, no la ves; si un campo no está en el SELECT, tu código tampoco lo ve.",
        en: "When you build a report, you first pick the Report Type (Accounts, Opportunities…) and then the columns you want. SOQL is exactly that, written in one line: FROM is the Report Type and SELECT is the columns. If a column is not in the report, you do not see it; if a field is not in the SELECT, your code does not see it either.",
      },
    },
    {
      type: "h",
      text: { es: "La consulta más pequeña", en: "The smallest query" },
    },
    {
      type: "code",
      code: {
        es: `List<Account> accounts = [SELECT Id, Name, Industry FROM Account];

for (Account a : accounts) {
    System.debug(a.Name + ' · ' + a.Industry);
}`,
        en: `List<Account> accounts = [SELECT Id, Name, Industry FROM Account];

for (Account a : accounts) {
    System.debug(a.Name + ' · ' + a.Industry);
}`,
      },
      caption: {
        es: "Los corchetes le dicen a Apex «esto es una consulta». El resultado ya es una List<Account>: la recorres con el for del Módulo 2.",
        en: "The square brackets tell Apex “this is a query”. The result is already a List<Account>: you loop it with the for from Module 2.",
      },
    },
    {
      type: "diagram",
      id: "m03-anatomy",
      caption: {
        es: "Cada pieza de la consulta tiene su equivalente en el constructor de informes.",
        en: "Each piece of the query has its equivalent in the report builder.",
      },
    },
    {
      type: "list",
      items: [
        {
          es: "SELECT: los campos, separados por comas. Usa el nombre de API (Industry, Rating__c), no la etiqueta.",
          en: "SELECT: the fields, comma-separated. Use the API name (Industry, Rating__c), not the label.",
        },
        {
          es: "FROM: un solo objeto, también por su nombre de API (Account, Invoice__c).",
          en: "FROM: a single object, also by its API name (Account, Invoice__c).",
        },
        {
          es: "El Id siempre viene, lo pidas o no. Pídelo igualmente: deja claro que lo usarás.",
          en: "The Id always comes back, whether you ask for it or not. Ask anyway: it makes clear you will use it.",
        },
      ],
    },
    {
      type: "table",
      head: [
        { es: "En el constructor de informes", en: "In the report builder" },
        { es: "En SOQL", en: "In SOQL" },
      ],
      rows: [
        [
          { es: "Report Type: Cuentas", en: "Report Type: Accounts" },
          { es: "FROM Account", en: "FROM Account" },
        ],
        [
          { es: "Columnas: Nombre, Sector", en: "Columns: Name, Industry" },
          { es: "SELECT Name, Industry", en: "SELECT Name, Industry" },
        ],
        [
          { es: "Filtros: Sector = Tecnología", en: "Filters: Industry = Technology" },
          { es: "WHERE Industry = 'Technology' (lección 2)", en: "WHERE Industry = 'Technology' (lesson 2)" },
        ],
        [
          { es: "Ordenar por Nombre", en: "Sort by Name" },
          { es: "ORDER BY Name (lección 2)", en: "ORDER BY Name (lesson 2)" },
        ],
        [
          { es: "Lo ves en pantalla", en: "You see it on screen" },
          { es: "Lo recibes en una List para trabajar con ello", en: "You get it in a List to work with" },
        ],
      ],
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Ya has escrito SOQL sin saberlo", en: "You have already written SOQL without knowing" },
      text: {
        es: "Si alguna vez exportaste datos con Data Loader, eligiendo objeto, campos y condiciones, al final del asistente aparecía una línea que empezaba por SELECT: Data Loader construye una consulta SOQL con lo que marcas. Lo mismo hace una list view con sus filtros, por dentro. La diferencia es que ahora la escribes tú y usas el resultado en código.",
        en: "If you ever exported data with Data Loader, picking the object, fields and conditions, at the end of the wizard there was a line starting with SELECT: Data Loader builds a SOQL query from what you tick. A list view with its filters does the same under the hood. The difference is that now you write it yourself and use the result in code.",
      },
    },
    {
      type: "h",
      text: { es: "Dónde se escribe SOQL", en: "Where SOQL is written" },
    },
    {
      type: "list",
      items: [
        {
          es: "Dentro de Apex, entre corchetes: lo que haces en este módulo. El resultado es una lista de registros.",
          en: "Inside Apex, in square brackets: what you do in this module. The result is a list of records.",
        },
        {
          es: "En el Query Editor de la Developer Console: pegas la consulta sin corchetes y ves una tabla. Ideal para probar antes de meterla en código.",
          en: "In the Developer Console's Query Editor: you paste the query without brackets and see a table. Ideal for testing before putting it in code.",
        },
        {
          es: "En Data Loader y Workbench, para exportar. La sintaxis es exactamente la misma.",
          en: "In Data Loader and Workbench, to export. The syntax is exactly the same.",
        },
      ],
    },
    {
      type: "h",
      text: { es: "Solo ves lo que pediste", en: "You only see what you asked for" },
    },
    {
      type: "p",
      text: {
        es: "Si consultas SELECT Id, Name y luego lees a.Phone, Apex no va a buscarlo por ti: lanza una [[excepcion|excepción]] SObjectException que dice que el campo se consultó sin incluirlo en el SELECT. No hay «SELECT *» en SOQL: pides campo a campo. Es una ventaja, no una molestia: cada campo que traes ocupa memoria de la [[transaccion|transacción]].",
        en: "If you query SELECT Id, Name and then read a.Phone, Apex does not go and fetch it for you: it throws an SObjectException saying the field was retrieved without being queried in the SELECT. There is no “SELECT *” in SOQL: you ask field by field. It is an advantage, not a nuisance: every field you bring back takes memory in the [[transaccion|transaction]].",
      },
    },
    {
      type: "h",
      text: { es: "Un solo registro", en: "A single record" },
    },
    {
      type: "code",
      code: {
        es: `// Si estás seguro de que hay exactamente uno:
Account acme = [SELECT Id, Name FROM Account WHERE Name = 'Acme' LIMIT 1];

// Si puede no haber ninguno, pide una lista y compruébala:
List<Account> found = [SELECT Id, Name FROM Account WHERE Name = 'Acme' LIMIT 1];
if (!found.isEmpty()) {
    Account acme2 = found[0];
}`,
        en: `// If you are sure there is exactly one:
Account acme = [SELECT Id, Name FROM Account WHERE Name = 'Acme' LIMIT 1];

// If there may be none, ask for a list and check it:
List<Account> found = [SELECT Id, Name FROM Account WHERE Name = 'Acme' LIMIT 1];
if (!found.isEmpty()) {
    Account acme2 = found[0];
}`,
      },
      caption: {
        es: "WHERE y LIMIT los verás a fondo en la siguiente lección. Aquí solo importa dónde guardas el resultado.",
        en: "You will see WHERE and LIMIT in depth in the next lesson. Here all that matters is where you store the result.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "List has no rows for assignment", en: "List has no rows for assignment" },
      text: {
        es: "Asignar una consulta a un solo registro (Account acme = [...]) funciona solo si vuelve exactamente una fila. Si vuelven cero, Apex lanza QueryException: «List has no rows for assignment to SObject». Es uno de los errores más vistos en producción. Si puede no haber ninguno, usa una lista y comprueba isEmpty(), como aprendiste con las colecciones.",
        en: "Assigning a query to a single record (Account acme = [...]) only works if exactly one row comes back. If zero come back, Apex throws QueryException: “List has no rows for assignment to SObject”. It is one of the most common errors in production. If there may be none, use a list and check isEmpty(), as you learned with collections.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "En la capa de datos del libro, consultar clientes cuesta cinco pasos: cargar un driver con Class.forName, abrir una conexión con usuario y contraseña, crear un Statement, lanzar el texto \"SELECT * FROM clientes\" y recorrer un ResultSet pidiendo cada columna con getString(\"nomcli\"). En Apex no hay driver, ni conexión, ni contraseña: ya estás dentro de la base de datos. La consulta va entre corchetes, el compilador comprueba que el objeto y los campos existen al guardar, y el resultado ya llega como registros con sus campos (a.Name), no como texto que tienes que leer columna a columna.",
        en: "In the book's data layer, querying customers takes five steps: load a driver with Class.forName, open a connection with user and password, create a Statement, send the text \"SELECT * FROM clientes\" and walk a ResultSet asking for each column with getString(\"nomcli\"). In Apex there is no driver, no connection, no password: you are already inside the database. The query goes in square brackets, the compiler checks that the object and fields exist when you save, and the result arrives as records with their fields (a.Name), not as text you read column by column.",
      },
    },
    {
      type: "h",
      text: { es: "El encargo de este módulo", en: "This module's assignment" },
    },
    {
      type: "p",
      text: {
        es: "En los Módulos 1 y 2 los datos te los daban escritos en el código. En la vida real están en la org, y hay que ir a buscarlos. Por eso el encargo de este módulo lo trae el equipo de cuentas, y es el de cada trimestre: la revisión de cartera. Como en los módulos anteriores, los ocho talleres son ese mismo encargo, troceado en el orden en que se aprende a consultar.",
        en: "In Modules 1 and 2 the data was handed to you written in the code. In real life it lives in the org, and you have to go and get it. So this module's assignment comes from the account team, and it is the one they have every quarter: the portfolio review. As in earlier modules, the eight workshops are that same assignment, cut into pieces in the order you learn to query.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Lo que pide el equipo de cuentas", en: "What the account team asks for" },
      text: {
        es: "«Para la revisión trimestral queremos: ver la cartera; las diez oportunidades grandes del trimestre; cada cuenta de Retail con su propietario y sus contactos; cuáles tienen negocio abierto y cuáles no han comprado nunca; un buscador de casos que no sea un agujero de seguridad; el pipeline sumado por etapa; un buscador para cuando llaman y no sabemos qué es; y todo eso junto para una región». Hoy lo montarías con varios informes, un par de Report Types personalizados y alguna exportación a Excel. Aquí son consultas, y la primera es la de hoy: ver qué hay.",
        en: "“For the quarterly review we want: to see the portfolio; the quarter's ten big opportunities; each Retail account with its owner and contacts; which have open business and which never bought; a case search that is not a security hole; the pipeline summed by stage; a search for when someone calls and we do not know what it is about; and all of that together for one region.” Today you would build it with several reports, a couple of custom Report Types and an export to Excel. Here it is queries, and the first one is today's: see what is there.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿qué parte de la consulta equivale al Report Type y cuál a las columnas? ¿Qué error sale si asignas a un solo registro una consulta que no devuelve nada?",
        en: "Without looking up: which part of the query is the Report Type and which the columns? What error do you get if you assign a query that returns nothing to a single record?",
      },
    },
  ],

  quiz: [
    {
      id: "m03-l01-q1",
      kind: "single",
      prompt: {
        es: "¿Qué tipo devuelve esta consulta?",
        en: "What type does this query return?",
      },
      code: {
        es: `[SELECT Id, LastName FROM Contact]`,
        en: `[SELECT Id, LastName FROM Contact]`,
      },
      options: [
        { es: "List<Contact>", en: "List<Contact>" },
        { es: "Contact", en: "Contact" },
        { es: "Set<Id>", en: "Set<Id>" },
        { es: "String", en: "String" },
      ],
      answer: 0,
      explain: {
        es: "Una consulta devuelve una lista de registros del objeto del FROM. Solo si la asignas a un Contact suelto Apex intenta darte uno.",
        en: "A query returns a list of records of the FROM object. Only if you assign it to a single Contact does Apex try to give you one.",
      },
      tags: ["recall"],
    },
    {
      id: "m03-l01-q2",
      kind: "single",
      prompt: {
        es: "¿Qué pasa al ejecutar este código?",
        en: "What happens when this code runs?",
      },
      code: {
        es: `List<Account> accs = [SELECT Id, Name FROM Account LIMIT 5];
System.debug(accs[0].Phone);`,
        en: `List<Account> accs = [SELECT Id, Name FROM Account LIMIT 5];
System.debug(accs[0].Phone);`,
      },
      options: [
        {
          es: "Lanza una SObjectException: Phone no se pidió en el SELECT.",
          en: "It throws an SObjectException: Phone was not asked for in the SELECT.",
        },
        { es: "Muestra null.", en: "It prints null." },
        { es: "Apex consulta Phone automáticamente.", en: "Apex queries Phone automatically." },
      ],
      answer: 0,
      explain: {
        es: "Solo ves las columnas que pusiste en el informe. Leer un campo no consultado es un error en ejecución, no un null.",
        en: "You only see the columns you put in the report. Reading a field you did not query is a runtime error, not a null.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m03-l01-q3",
      kind: "single",
      prompt: {
        es: "En la org no existe ninguna cuenta llamada 'Zeta'. ¿Qué hace esta línea?",
        en: "There is no account called 'Zeta' in the org. What does this line do?",
      },
      code: {
        es: `Account z = [SELECT Id FROM Account WHERE Name = 'Zeta' LIMIT 1];`,
        en: `Account z = [SELECT Id FROM Account WHERE Name = 'Zeta' LIMIT 1];`,
      },
      options: [
        {
          es: "Lanza QueryException: List has no rows for assignment to SObject.",
          en: "It throws QueryException: List has no rows for assignment to SObject.",
        },
        { es: "z queda en null.", en: "z ends up null." },
        { es: "z queda como una cuenta vacía.", en: "z ends up as an empty account." },
      ],
      answer: 0,
      explain: {
        es: "Asignar a un solo registro exige exactamente una fila. Si puede no haber ninguna, consulta a una List y comprueba isEmpty().",
        en: "Assigning to a single record requires exactly one row. If there may be none, query into a List and check isEmpty().",
      },
      tags: ["predict-output"],
    },
    {
      id: "m03-l01-q4",
      kind: "single",
      prompt: {
        es: "Tienes un campo personalizado con etiqueta «Nivel de cliente» y nombre de API Customer_Tier__c. ¿Cómo lo pides?",
        en: "You have a custom field labelled “Customer tier” with API name Customer_Tier__c. How do you ask for it?",
      },
      options: [
        { es: "SELECT Id, Customer_Tier__c FROM Account", en: "SELECT Id, Customer_Tier__c FROM Account" },
        { es: "SELECT Id, Nivel de cliente FROM Account", en: "SELECT Id, Customer tier FROM Account" },
        { es: "SELECT Id, Customer_Tier FROM Account", en: "SELECT Id, Customer_Tier FROM Account" },
      ],
      answer: 0,
      explain: {
        es: "SOQL usa nombres de API, con su __c. Es el mismo nombre que ya usabas en fórmulas y en Flow.",
        en: "SOQL uses API names, with their __c. It is the same name you already used in formulas and in Flow.",
      },
      tags: ["spaced", "interleaving"],
      from: { es: "Repaso · M1 L5", en: "Review · M1 L5" },
    },
    {
      id: "m03-l01-q5",
      kind: "text",
      prompt: {
        es: "Completa: List<Opportunity> opps = [SELECT Id, Name ____ Opportunity];",
        en: "Complete: List<Opportunity> opps = [SELECT Id, Name ____ Opportunity];",
      },
      accept: ["^\\s*from\\s*$"],
      placeholder: { es: "palabra clave", en: "keyword" },
      explain: {
        es: "FROM indica el objeto, como el Report Type del informe.",
        en: "FROM names the object, like the report's Report Type.",
      },
      tags: ["recall"],
    },
    {
      id: "m03-l01-q6",
      kind: "multi",
      prompt: {
        es: "¿Qué afirmaciones son ciertas sobre SOQL en Apex?",
        en: "Which statements about SOQL in Apex are true?",
      },
      options: [
        {
          es: "El compilador comprueba que el objeto y los campos existen al guardar la clase.",
          en: "The compiler checks that the object and fields exist when you save the class.",
        },
        { es: "Puedes escribir SELECT * para traer todos los campos.", en: "You can write SELECT * to bring back every field." },
        {
          es: "El resultado se puede recorrer con un for-each como cualquier lista.",
          en: "The result can be looped with a for-each like any list.",
        },
        {
          es: "Necesitas abrir una conexión a la base de datos antes de consultar.",
          en: "You need to open a database connection before querying.",
        },
      ],
      answers: [0, 2],
      explain: {
        es: "Los campos se piden uno a uno y no hay conexión que abrir: ya estás dentro de Salesforce. Un nombre mal escrito falla al guardar, como en el Módulo 1.",
        en: "Fields are asked for one by one and there is no connection to open: you are already inside Salesforce. A misspelled name fails on save, as in Module 1.",
      },
      tags: ["interleaving"],
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 1 DE 8 · Antes de revisar la cartera hay que verla: primero, qué cuentas hay y de qué sector es cada una. El equipo de Customer Success quiere un listado rápido de las cuentas y su sector para revisar la cartera. Escribe la consulta y recorre el resultado.",
      en: "TASK 1 OF 8 · Before reviewing the portfolio you have to see it: first, which accounts exist and each one's industry. The Customer Success team wants a quick list of accounts and their industry to review the portfolio. Write the query and loop over the result.",
    },
    brief: [
      {
        es: "Guarda en una List<Account> llamada accounts las cuentas con sus campos Id, Name e Industry.",
        en: "Store in a List<Account> called accounts the accounts with their Id, Name and Industry fields.",
      },
      {
        es: "Recorre la lista con un for-each y muestra con System.debug el nombre y el sector de cada cuenta.",
        en: "Loop over the list with a for-each and show each account's name and industry with System.debug.",
      },
      {
        es: "Al final, muestra cuántas cuentas se han leído.",
        en: "At the end, show how many accounts were read.",
      },
    ],
    starter: {
      es: `// CASO: la revisión trimestral de cartera del equipo de cuentas
// Tarea 1 de 8: ver qué hay en la cartera.

// 1. Consulta las cuentas con Id, Name e Industry


// 2. Recorre y muestra nombre y sector


// 3. Muestra cuántas hay
`,
      en: `// CASE: the account team's quarterly portfolio review
// Task 1 of 8: see what is in the portfolio.

// 1. Query the accounts with Id, Name and Industry


// 2. Loop and show name and industry


// 3. Show how many there are
`,
    },
    hints: [
      {
        es: "La consulta va entre corchetes a la derecha del =. A la izquierda, el tipo que devuelve: una lista de cuentas.",
        en: "The query goes in square brackets on the right of the =. On the left, the type it returns: a list of accounts.",
      },
      {
        es: "SELECT lleva los tres campos separados por comas; FROM, el objeto Account. Para contar, las listas tienen size().",
        en: "SELECT takes the three fields separated by commas; FROM, the Account object. To count, lists have size().",
      },
      {
        es: "Pseudocódigo: List<Account> accounts = [SELECT Id, Name, Industry FROM Account]; for (Account a : accounts) { System.debug(a.Name + ...); } System.debug(accounts.size());",
        en: "Pseudocode: List<Account> accounts = [SELECT Id, Name, Industry FROM Account]; for (Account a : accounts) { System.debug(a.Name + ...); } System.debug(accounts.size());",
      },
    ],
    solution: {
      es: `List<Account> accounts = [SELECT Id, Name, Industry FROM Account];

for (Account a : accounts) {
    System.debug(a.Name + ' · ' + a.Industry);
}

System.debug('Cuentas leídas: ' + accounts.size());`,
      en: `List<Account> accounts = [SELECT Id, Name, Industry FROM Account];

for (Account a : accounts) {
    System.debug(a.Name + ' · ' + a.Industry);
}

System.debug('Accounts read: ' + accounts.size());`,
    },
    checks: [
      {
        id: "m03-l01-c1",
        label: {
          es: "La consulta se guarda en una List<Account> llamada accounts",
          en: "The query is stored in a List<Account> called accounts",
        },
        rule: { op: "match", pattern: "List\\s*<\\s*Account\\s*>\\s+accounts\\s*=\\s*\\[\\s*SELECT\\b" },
        onFail: {
          es: "Declara List<Account> accounts = [SELECT ... ];",
          en: "Declare List<Account> accounts = [SELECT ... ];",
        },
      },
      {
        id: "m03-l01-c2",
        label: {
          es: "El SELECT pide Id, Name e Industry FROM Account",
          en: "The SELECT asks for Id, Name and Industry FROM Account",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "SELECT[^\\]]*\\bId\\b[^\\]]*FROM\\s+Account\\b" },
            { op: "match", pattern: "SELECT[^\\]]*\\bName\\b[^\\]]*FROM\\s+Account\\b" },
            { op: "match", pattern: "SELECT[^\\]]*\\bIndustry\\b[^\\]]*FROM\\s+Account\\b" },
          ],
        },
        onFail: {
          es: "Los tres campos van en el SELECT, antes de FROM Account. Si no pides Industry, no podrás leerlo.",
          en: "All three fields go in the SELECT, before FROM Account. If you do not ask for Industry, you cannot read it.",
        },
      },
      {
        id: "m03-l01-c3",
        label: {
          es: "Un for-each recorre accounts",
          en: "A for-each loops over accounts",
        },
        rule: { op: "match", pattern: "for\\s*\\(\\s*Account\\s+\\w+\\s*:\\s*accounts\\s*\\)" },
        onFail: {
          es: "Recorre la lista con for (Account a : accounts) { ... }",
          en: "Loop the list with for (Account a : accounts) { ... }",
        },
      },
      {
        id: "m03-l01-c4",
        label: {
          es: "Dentro del bucle se muestran el nombre y el sector",
          en: "Inside the loop, name and industry are shown",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "System\\.debug\\([^;]*\\.Name\\b[^;]*\\)\\s*;" },
            { op: "match", pattern: "System\\.debug\\([^;]*\\.Industry\\b[^;]*\\)\\s*;" },
          ],
        },
        onFail: {
          es: "Usa System.debug con a.Name y a.Industry (pueden ir en la misma línea).",
          en: "Use System.debug with a.Name and a.Industry (they can go on the same line).",
        },
      },
      {
        id: "m03-l01-c5",
        label: { es: "Se muestra cuántas cuentas hay", en: "The number of accounts is shown" },
        rule: { op: "match", pattern: "accounts\\.size\\(\\s*\\)" },
        onFail: {
          es: "Las listas saben cuántos elementos tienen: accounts.size().",
          en: "Lists know how many elements they hold: accounts.size().",
        },
        onPass: {
          es: "Consulta, recorrido y recuento: el esqueleto de casi todo el código que lee datos.",
          en: "Query, loop and count: the skeleton of almost all code that reads data.",
        },
      },
    ],
    rubric: [
      {
        es: "Si mañana Customer Success también quiere el teléfono, ¿qué dos líneas cambias?",
        en: "If tomorrow Customer Success also wants the phone number, which two lines do you change?",
      },
      {
        es: "Tarea 2: ver todo no sirve para una reunión; la directora de Ventas quiere solo lo que importa, ordenado y con un tope.",
        en: "Task 2: seeing everything is useless in a meeting; the sales director wants only what matters, ordered and capped.",
      },
    ],
  },
};
