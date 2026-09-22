import type { Lesson } from "@/lib/types";

export const l04BindDinamico: Lesson = {
  id: "m03-l04",
  slug: "variables-de-enlace-y-soql-dinamico",
  n: 4,
  kind: "lesson",
  minutes: 30,
  title: {
    es: "Variables de enlace y SOQL dinámico",
    en: "Bind variables and dynamic SOQL",
  },
  summary: {
    es: "Meter valores de Apex dentro de la consulta con dos puntos, filtrar por una colección entera con IN y construir consultas en tiempo de ejecución sin abrirle la puerta a nadie.",
    en: "Put Apex values into the query with a colon, filter by a whole collection with IN, and build queries at runtime without opening the door to anyone.",
  },
  analogy: {
    es: "El filtro de un Get Records que usa {!recordId}",
    en: "A Get Records filter that uses {!recordId}",
  },
  objectives: [
    {
      es: "Usar una variable de Apex dentro de una consulta con :variable.",
      en: "Use an Apex variable inside a query with :variable.",
    },
    {
      es: "Filtrar por muchos Ids a la vez con IN :conjunto.",
      en: "Filter by many Ids at once with IN :set.",
    },
    {
      es: "Saber cuándo hace falta SOQL dinámico y cómo evitar la inyección de SOQL.",
      en: "Know when dynamic SOQL is needed and how to avoid SOQL injection.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Una consulta con 'Acme' escrito dentro solo sirve para Acme. En código real, el valor del filtro llega de fuera: el registro que se acaba de guardar, lo que un usuario escribió en un buscador, la lista de cuentas que procesas. Esta lección es sobre cómo meter esos valores en la consulta, de la forma segura y de la forma peligrosa.",
        en: "A query with 'Acme' typed inside only works for Acme. In real code, the filter value comes from outside: the record just saved, what a user typed into a search box, the list of accounts you are processing. This lesson is about putting those values into the query, the safe way and the dangerous way.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "En un Flow, el elemento Get Records filtra con «AccountId Equals {!$Record.AccountId}»: no escribes un Id, apuntas a una variable del Flow y el valor se pone en el momento. En SOQL eso se llama [[variable-enlace|variable de enlace]] y se escribe con dos puntos: WHERE AccountId = :accId.",
        en: "In a Flow, the Get Records element filters with “AccountId Equals {!$Record.AccountId}”: you do not type an Id, you point to a Flow variable and the value is plugged in at runtime. In SOQL that is called a [[variable-enlace|bind variable]] and is written with a colon: WHERE AccountId = :accId.",
      },
    },
    {
      type: "h",
      text: { es: "Los dos puntos", en: "The colon" },
    },
    {
      type: "code",
      code: {
        es: `Id accId = '0015g00000Xyz12AAB';
String stage = 'Prospecting';
Date since = Date.today().addDays(-30);

List<Opportunity> opps = [
    SELECT Id, Name
    FROM Opportunity
    WHERE AccountId = :accId
      AND StageName = :stage
      AND CreatedDate >= :since
];`,
        en: `Id accId = '0015g00000Xyz12AAB';
String stage = 'Prospecting';
Date since = Date.today().addDays(-30);

List<Opportunity> opps = [
    SELECT Id, Name
    FROM Opportunity
    WHERE AccountId = :accId
      AND StageName = :stage
      AND CreatedDate >= :since
];`,
      },
      caption: {
        es: ":stage no lleva comillas aunque sea un texto: Apex sabe que es un String y lo pasa como valor. Nunca como trozo de código.",
        en: ":stage has no quotes even though it is text: Apex knows it is a String and passes it as a value. Never as a piece of code.",
      },
    },
    {
      type: "list",
      items: [
        {
          es: "Detrás de los dos puntos puede ir una variable (:accId), el campo de un objeto (:opp.AccountId) o una expresión (:Date.today().addDays(-30)).",
          en: "After the colon you can put a variable (:accId), an object's field (:opp.AccountId) or an expression (:Date.today().addDays(-30)).",
        },
        {
          es: "El tipo tiene que encajar con el campo: no puedes comparar Amount con un String. Es el tipado estático del Módulo 1 funcionando también dentro de la consulta.",
          en: "The type has to match the field: you cannot compare Amount with a String. It is Module 1's static typing working inside the query too.",
        },
      ],
    },
    {
      type: "h",
      text: { es: "IN :colección: muchos valores de una vez", en: "IN :collection: many values at once" },
    },
    {
      type: "p",
      text: {
        es: "Aquí está la pieza que más usarás a partir del Módulo 6. Si tienes 200 oportunidades y quieres las cuentas de todas, no haces 200 consultas: juntas los AccountId en un Set<Id> y haces una sola consulta con IN :accountIds. Es el operador «In» del Get Records de Flow, apuntando a una variable de colección.",
        en: "Here is the piece you will use most from Module 6 onwards. If you have 200 opportunities and want all their accounts, you do not run 200 queries: you gather the AccountIds into a Set<Id> and run a single query with IN :accountIds. It is Flow's Get Records “In” operator, pointing at a collection variable.",
      },
    },
    {
      type: "code",
      code: {
        es: `// 1. Juntar los Ids (el Set descarta repetidos)
Set<Id> accountIds = new Set<Id>();
for (Opportunity o : opps) {
    accountIds.add(o.AccountId);
}

// 2. Una sola consulta para todas
Map<Id, Account> accountsById = new Map<Id, Account>(
    [SELECT Id, Name, Industry FROM Account WHERE Id IN :accountIds]
);

// 3. Buscar sin recorrer
for (Opportunity o : opps) {
    Account parent = accountsById.get(o.AccountId);
}`,
        en: `// 1. Gather the Ids (the Set drops duplicates)
Set<Id> accountIds = new Set<Id>();
for (Opportunity o : opps) {
    accountIds.add(o.AccountId);
}

// 2. One single query for all of them
Map<Id, Account> accountsById = new Map<Id, Account>(
    [SELECT Id, Name, Industry FROM Account WHERE Id IN :accountIds]
);

// 3. Look up without looping
for (Opportunity o : opps) {
    Account parent = accountsById.get(o.AccountId);
}`,
      },
      caption: {
        es: "new Map<Id, Account>(consulta) construye el mapa Id → registro directamente: es el VLOOKUP del Módulo 2, montado en una línea.",
        en: "new Map<Id, Account>(query) builds the Id → record map directly: it is Module 2's VLOOKUP, set up in one line.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Recuerda este patrón", en: "Remember this pattern" },
      text: {
        es: "Juntar Ids en un Set → una consulta con IN → un Map para buscar. Aparece en casi todos los triggers bien escritos. Si al terminar el curso solo recuerdas una cosa de SOQL, que sea esta.",
        en: "Gather Ids in a Set → one query with IN → a Map to look up. It shows up in almost every well-written trigger. If you only remember one thing about SOQL at the end of the course, make it this.",
      },
    },
    {
      type: "h",
      text: { es: "SOQL dinámico: cuando la consulta se decide al ejecutar", en: "Dynamic SOQL: when the query is decided at runtime" },
    },
    {
      type: "p",
      text: {
        es: "La consulta entre corchetes es estática: su forma (qué objeto, qué campos, qué condiciones) está fija al guardar la clase, y por eso el compilador la revisa. A veces la forma no se conoce hasta que el código corre: un buscador donde el usuario elige por qué campo ordenar, o una utilidad que sirve para cualquier objeto. Para eso existe Database.query, que recibe la consulta como texto.",
        en: "The query in square brackets is static: its shape (which object, which fields, which conditions) is fixed when you save the class, and that is why the compiler checks it. Sometimes the shape is not known until the code runs: a search where the user picks which field to sort by, or a utility that works for any object. That is what Database.query is for: it takes the query as text.",
      },
    },
    {
      type: "code",
      code: {
        es: `String sortField = 'Name';   // viene de una opción del usuario
String soql = 'SELECT Id, Name FROM Account ORDER BY ' + sortField + ' LIMIT 50';
List<Account> accs = Database.query(soql);`,
        en: `String sortField = 'Name';   // comes from a user's choice
String soql = 'SELECT Id, Name FROM Account ORDER BY ' + sortField + ' LIMIT 50';
List<Account> accs = Database.query(soql);`,
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Es la diferencia entre un informe que tú dejas configurado y una list view donde cada usuario elige sus propias columnas y filtros. Más flexible, pero ahora lo que llega del usuario forma parte de la definición. Y ahí empieza el riesgo.",
        en: "It is the difference between a report you leave configured and a list view where each user picks their own columns and filters. More flexible, but now what comes from the user is part of the definition. And that is where the risk begins.",
      },
    },
    {
      type: "h",
      text: { es: "La inyección de SOQL", en: "SOQL injection" },
    },
    {
      type: "p",
      text: {
        es: "Si pegas con + lo que escribió el usuario dentro del texto de la consulta, el usuario ya no escribe un valor: escribe código. Imagina un buscador de casos por asunto que hace '... WHERE IsClosed = false AND Subject LIKE \\'%' + keyword + '%\\''. Alguien escribe en el buscador: %' OR Subject LIKE '% — y la consulta resultante ya no filtra casos cerrados: ve todos. Eso es la [[inyeccion-soql|inyección de SOQL]].",
        en: "If you glue what the user typed into the query text with +, the user is no longer typing a value: they are typing code. Imagine a case search by subject that does '... WHERE IsClosed = false AND Subject LIKE \\'%' + keyword + '%\\''. Someone types into the search box: %' OR Subject LIKE '% — and the resulting query no longer filters closed cases: it sees them all. That is [[inyeccion-soql|SOQL injection]].",
      },
    },
    {
      type: "diagram",
      id: "m03-bind",
      caption: {
        es: "Con : el valor viaja en un sobre cerrado. Con + se mezcla con el código de la consulta.",
        en: "With : the value travels in a sealed envelope. With + it mixes with the query's code.",
      },
    },
    {
      type: "list",
      ordered: true,
      items: [
        {
          es: "Primera opción: no uses SOQL dinámico. Si solo cambia el valor del filtro, la consulta estática con :variable basta y es inmune a la inyección.",
          en: "First choice: do not use dynamic SOQL. If only the filter value changes, the static query with :variable is enough and immune to injection.",
        },
        {
          es: "Si necesitas dinámico, pasa los valores como enlaces: Database.queryWithBinds(soql, new Map<String, Object>{ 'kw' => pattern }, AccessLevel.USER_MODE), con :kw dentro del texto.",
          en: "If you need dynamic, pass the values as binds: Database.queryWithBinds(soql, new Map<String, Object>{ 'kw' => pattern }, AccessLevel.USER_MODE), with :kw inside the text.",
        },
        {
          es: "Lo que no puede ir como enlace (un nombre de campo para ORDER BY) compruébalo contra una lista de valores permitidos. String.escapeSingleQuotes() existe, pero es la última línea de defensa, no la primera.",
          en: "What cannot go as a bind (a field name for ORDER BY) check against a list of allowed values. String.escapeSingleQuotes() exists, but it is the last line of defence, not the first.",
        },
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "Todas las consultas de la capa de datos del libro se construyen pegando textos: \"UPDATE Clientes set nomcli = '\" + wnom1 + \"' ... where codcli = '\" + cod + \"'\". Es exactamente el patrón vulnerable de esta lección: cualquier comilla en un nombre de cliente (O'Brien) rompe la sentencia, y un usuario malintencionado puede reescribirla. En Java la solución es PreparedStatement con ?; en Apex, la :variable. Es la misma idea: el valor va por un canal separado del código.",
        en: "Every query in the book's data layer is built by gluing text: \"UPDATE Clientes set nomcli = '\" + wnom1 + \"' ... where codcli = '\" + cod + \"'\". It is exactly this lesson's vulnerable pattern: any quote in a customer name (O'Brien) breaks the statement, and a malicious user can rewrite it. In Java the fix is PreparedStatement with ?; in Apex, the :variable. It is the same idea: the value travels on a channel separate from the code.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿cómo filtras por 300 Ids con una sola consulta? ¿Qué pierdes al pasar de SOQL estático a Database.query, además de seguridad?",
        en: "Without looking: how do you filter by 300 Ids with a single query? What do you lose by moving from static SOQL to Database.query, besides safety?",
      },
    },
  ],

  quiz: [
    {
      id: "m03-l04-q1",
      kind: "single",
      prompt: {
        es: "¿Cómo filtras por el valor de la variable String region?",
        en: "How do you filter by the value of the String variable region?",
      },
      options: [
        { es: "WHERE BillingState = :region", en: "WHERE BillingState = :region" },
        { es: "WHERE BillingState = ':region'", en: "WHERE BillingState = ':region'" },
        { es: "WHERE BillingState = region", en: "WHERE BillingState = region" },
        { es: "WHERE BillingState = {!region}", en: "WHERE BillingState = {!region}" },
      ],
      answer: 0,
      explain: {
        es: "Dos puntos y sin comillas. Con comillas buscarías literalmente el texto «:region»; sin dos puntos, SOQL buscaría un campo llamado region. {!…} es la sintaxis de Flow y fórmulas.",
        en: "Colon and no quotes. With quotes you would search for the literal text “:region”; without the colon, SOQL would look for a field called region. {!…} is Flow and formula syntax.",
      },
      tags: ["recall"],
    },
    {
      id: "m03-l04-q2",
      kind: "single",
      prompt: {
        es: "Tienes 200 contactos y necesitas sus cuentas. ¿Cuál es la MEJOR opción?",
        en: "You have 200 contacts and need their accounts. Which is the BEST option?",
      },
      options: [
        {
          es: "Juntar los AccountId en un Set<Id> y hacer una consulta con WHERE Id IN :accountIds.",
          en: "Gather the AccountIds in a Set<Id> and run one query with WHERE Id IN :accountIds.",
        },
        {
          es: "Dentro del for de contactos, una consulta WHERE Id = :c.AccountId por cada uno.",
          en: "Inside the contacts loop, a WHERE Id = :c.AccountId query for each one.",
        },
        {
          es: "Consultar todas las cuentas de la org y buscar cada una en un bucle.",
          en: "Query every account in the org and look each one up in a loop.",
        },
      ],
      answer: 0,
      explain: {
        es: "Una consulta en lugar de 200. La segunda superaría el límite de 100 consultas por transacción; la tercera trae miles de filas que no necesitas.",
        en: "One query instead of 200. The second would exceed the 100-queries-per-transaction limit; the third brings thousands of rows you do not need.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m03-l04-q3",
      kind: "single",
      prompt: {
        es: "¿Qué tipo de colección conviene para juntar los Ids antes del IN, y por qué?",
        en: "Which collection type is best for gathering the Ids before the IN, and why?",
      },
      options: [
        { es: "Set<Id>: descarta los repetidos.", en: "Set<Id>: it drops duplicates." },
        { es: "List<Id>: mantiene el orden.", en: "List<Id>: it keeps the order." },
        { es: "Map<Id, Id>: es más rápido.", en: "Map<Id, Id>: it is faster." },
      ],
      answer: 0,
      explain: {
        es: "Diez contactos de la misma cuenta aportarían diez veces el mismo Id. El Set se queda con uno. IN acepta también List, pero el Set expresa mejor la intención.",
        en: "Ten contacts from the same account would contribute the same Id ten times. The Set keeps one. IN also accepts List, but the Set expresses the intent better.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M1 L8", en: "Review · M1 L8" },
    },
    {
      id: "m03-l04-q4",
      kind: "single",
      prompt: {
        es: "¿Qué problema tiene este código?",
        en: "What is wrong with this code?",
      },
      code: {
        es: `String name = searchBox;   // lo que escribe el usuario
List<Account> r = Database.query(
    'SELECT Id FROM Account WHERE Name = \\'' + name + '\\''
);`,
        en: `String name = searchBox;   // what the user types
List<Account> r = Database.query(
    'SELECT Id FROM Account WHERE Name = \\'' + name + '\\''
);`,
      },
      options: [
        {
          es: "Es vulnerable a inyección de SOQL: el texto del usuario pasa a formar parte de la consulta.",
          en: "It is vulnerable to SOQL injection: the user's text becomes part of the query.",
        },
        { es: "Database.query no acepta WHERE.", en: "Database.query does not accept WHERE." },
        { es: "No tiene ningún problema.", en: "It has no problem at all." },
      ],
      answer: 0,
      explain: {
        es: "Y ni siquiera necesita ser dinámico: solo cambia el valor. [SELECT Id FROM Account WHERE Name = :name] es más corto, lo revisa el compilador y es inmune.",
        en: "And it does not even need to be dynamic: only the value changes. [SELECT Id FROM Account WHERE Name = :name] is shorter, compiler-checked and immune.",
      },
      tags: ["find-error"],
    },
    {
      id: "m03-l04-q5",
      kind: "multi",
      prompt: {
        es: "¿Qué pierdes al usar Database.query en lugar de una consulta entre corchetes?",
        en: "What do you lose by using Database.query instead of a query in square brackets?",
      },
      options: [
        {
          es: "La comprobación del compilador: un campo mal escrito falla al ejecutar, no al guardar.",
          en: "The compiler check: a misspelled field fails at runtime, not on save.",
        },
        {
          es: "La protección automática contra inyección si concatenas valores.",
          en: "Automatic protection against injection if you concatenate values.",
        },
        { es: "La posibilidad de usar WHERE.", en: "The ability to use WHERE." },
        { es: "Nada: son idénticas.", en: "Nothing: they are identical." },
      ],
      answers: [0, 1],
      explain: {
        es: "Lo dinámico es un texto: el compilador no lo lee. Por eso la regla es estática por defecto y dinámica solo cuando la forma de la consulta cambia de verdad.",
        en: "Dynamic is text: the compiler does not read it. That is why the rule is static by default and dynamic only when the query's shape truly changes.",
      },
      tags: ["interleaving", "spaced"],
      from: { es: "Repaso · M1 L1", en: "Review · M1 L1" },
    },
    {
      id: "m03-l04-q6",
      kind: "text",
      prompt: {
        es: "Completa la línea que construye el mapa Id → cuenta directamente desde la consulta: Map<Id, Account> m = new ______([SELECT Id, Name FROM Account WHERE Id IN :ids]);",
        en: "Complete the line that builds the Id → account map straight from the query: Map<Id, Account> m = new ______([SELECT Id, Name FROM Account WHERE Id IN :ids]);",
      },
      accept: ["^\\s*Map\\s*<\\s*Id\\s*,\\s*Account\\s*>\\s*$"],
      placeholder: { es: "tipo", en: "type" },
      explain: {
        es: "new Map<Id, Account>(lista) usa el Id de cada registro como clave. Te ahorras el bucle de rellenar el mapa.",
        en: "new Map<Id, Account>(list) uses each record's Id as the key. It saves you the loop that fills the map.",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "Un compañero montó el buscador de casos del equipo de Soporte pegando textos, como en el libro. Seguridad lo ha marcado como vulnerable. Reescríbelo con una consulta estática y, de paso, trae las cuentas de los casos encontrados con una sola consulta más.",
      en: "A colleague built the Support team's case search by gluing text, like in the book. Security has flagged it as vulnerable. Rewrite it with a static query and, while you are at it, bring the found cases' accounts with just one more query.",
    },
    brief: [
      {
        es: "Nada de Database.query ni de concatenar keyword dentro de la consulta.",
        en: "No Database.query and no gluing keyword into the query.",
      },
      {
        es: "Prepara una variable pattern con el comodín: % + keyword + %. Úsala con LIKE :pattern.",
        en: "Prepare a pattern variable with the wildcard: % + keyword + %. Use it with LIKE :pattern.",
      },
      {
        es: "Solo casos abiertos (IsClosed = false), con Id, Subject y AccountId.",
        en: "Only open cases (IsClosed = false), with Id, Subject and AccountId.",
      },
      {
        es: "Junta los AccountId en un Set<Id> accountIds y consulta esas cuentas con IN, guardándolas en un Map<Id, Account> accountsById.",
        en: "Gather the AccountIds into a Set<Id> accountIds and query those accounts with IN, storing them in a Map<Id, Account> accountsById.",
      },
    ],
    starter: {
      es: `String keyword = 'impresora';   // lo escribe el agente en el buscador

String soql = 'SELECT Id, Subject, AccountId FROM Case '
            + 'WHERE IsClosed = false AND Subject LIKE \\'%' + keyword + '%\\'';
List<Case> cases = Database.query(soql);
`,
      en: `String keyword = 'printer';   // typed by the agent in the search box

String soql = 'SELECT Id, Subject, AccountId FROM Case '
            + 'WHERE IsClosed = false AND Subject LIKE \\'%' + keyword + '%\\'';
List<Case> cases = Database.query(soql);
`,
    },
    hints: [
      {
        es: "Solo cambia el valor que se busca, no la forma de la consulta: no hace falta nada dinámico.",
        en: "Only the searched value changes, not the query's shape: nothing dynamic is needed.",
      },
      {
        es: "El % va dentro de la variable, no dentro de la consulta: String pattern = '%' + keyword + '%'; y luego Subject LIKE :pattern. Después, el patrón Set → IN → Map de la teoría.",
        en: "The % goes inside the variable, not inside the query: String pattern = '%' + keyword + '%'; then Subject LIKE :pattern. After that, the Set → IN → Map pattern from the theory.",
      },
      {
        es: "Pseudocódigo: List<Case> cases = [SELECT ... FROM Case WHERE IsClosed = false AND Subject LIKE :pattern]; for (Case c : cases) accountIds.add(c.AccountId); Map<Id, Account> accountsById = new Map<Id, Account>([SELECT Id, Name FROM Account WHERE Id IN :accountIds]);",
        en: "Pseudocode: List<Case> cases = [SELECT ... FROM Case WHERE IsClosed = false AND Subject LIKE :pattern]; for (Case c : cases) accountIds.add(c.AccountId); Map<Id, Account> accountsById = new Map<Id, Account>([SELECT Id, Name FROM Account WHERE Id IN :accountIds]);",
      },
    ],
    solution: {
      es: `String keyword = 'impresora';   // lo escribe el agente en el buscador
String pattern = '%' + keyword + '%';

List<Case> cases = [
    SELECT Id, Subject, AccountId
    FROM Case
    WHERE IsClosed = false AND Subject LIKE :pattern
];

Set<Id> accountIds = new Set<Id>();
for (Case c : cases) {
    accountIds.add(c.AccountId);
}

Map<Id, Account> accountsById = new Map<Id, Account>(
    [SELECT Id, Name FROM Account WHERE Id IN :accountIds]
);`,
      en: `String keyword = 'printer';   // typed by the agent in the search box
String pattern = '%' + keyword + '%';

List<Case> cases = [
    SELECT Id, Subject, AccountId
    FROM Case
    WHERE IsClosed = false AND Subject LIKE :pattern
];

Set<Id> accountIds = new Set<Id>();
for (Case c : cases) {
    accountIds.add(c.AccountId);
}

Map<Id, Account> accountsById = new Map<Id, Account>(
    [SELECT Id, Name FROM Account WHERE Id IN :accountIds]
);`,
    },
    checks: [
      {
        id: "m03-l04-c1",
        label: {
          es: "Ya no hay Database.query ni concatenación en la consulta",
          en: "No Database.query and no concatenation in the query",
        },
        rule: {
          op: "all",
          of: [
            { op: "absent", pattern: "Database\\.query" },
            { op: "absent", pattern: "LIKE\\s*\\\\'" },
          ],
        },
        onFail: {
          es: "Quita el texto soql y el Database.query: la consulta va entre corchetes.",
          en: "Remove the soql text and the Database.query: the query goes in square brackets.",
        },
      },
      {
        id: "m03-l04-c2",
        label: {
          es: "El comodín va en una variable pattern y se enlaza con LIKE :pattern",
          en: "The wildcard goes in a pattern variable bound with LIKE :pattern",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "String\\s+pattern\\s*=\\s*'%'\\s*\\+\\s*keyword\\s*\\+\\s*'%'\\s*;" },
            { op: "match", pattern: "Subject\\s+LIKE\\s*:\\s*pattern\\b" },
          ],
        },
        onFail: {
          es: "String pattern = '%' + keyword + '%'; y en la consulta: Subject LIKE :pattern.",
          en: "String pattern = '%' + keyword + '%'; and in the query: Subject LIKE :pattern.",
        },
      },
      {
        id: "m03-l04-c3",
        label: {
          es: "Consulta estática de casos abiertos con AccountId",
          en: "Static query of open cases with AccountId",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "List\\s*<\\s*Case\\s*>\\s+cases\\s*=\\s*\\[\\s*SELECT[^\\]]*\\bAccountId\\b[^\\]]*FROM\\s+Case\\b" },
            { op: "match", pattern: "FROM\\s+Case\\s+WHERE[^\\]]*IsClosed\\s*=\\s*false" },
          ],
        },
        onFail: {
          es: "List<Case> cases = [SELECT Id, Subject, AccountId FROM Case WHERE IsClosed = false AND ...];",
          en: "List<Case> cases = [SELECT Id, Subject, AccountId FROM Case WHERE IsClosed = false AND ...];",
        },
      },
      {
        id: "m03-l04-c4",
        label: {
          es: "Los AccountId se juntan en un Set<Id> accountIds",
          en: "The AccountIds are gathered into a Set<Id> accountIds",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Set\\s*<\\s*Id\\s*>\\s+accountIds\\s*=\\s*new\\s+Set\\s*<\\s*Id\\s*>\\s*\\(\\s*\\)" },
            { op: "match", pattern: "accountIds\\.add\\(\\s*\\w+\\.AccountId\\s*\\)" },
          ],
        },
        onFail: {
          es: "Crea el Set vacío y, en un for sobre cases, accountIds.add(c.AccountId);",
          en: "Create the empty Set and, in a for over cases, accountIds.add(c.AccountId);",
        },
      },
      {
        id: "m03-l04-c5",
        label: {
          es: "Una sola consulta con IN :accountIds llena un Map<Id, Account>",
          en: "A single query with IN :accountIds fills a Map<Id, Account>",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Map\\s*<\\s*Id\\s*,\\s*Account\\s*>\\s+accountsById\\s*=\\s*new\\s+Map\\s*<\\s*Id\\s*,\\s*Account\\s*>\\s*\\(\\s*\\[" },
            { op: "match", pattern: "FROM\\s+Account\\s+WHERE\\s+Id\\s+IN\\s*:\\s*accountIds\\b" },
            { op: "count", pattern: "FROM\\s+Account\\b", max: 1 },
          ],
        },
        onFail: {
          es: "new Map<Id, Account>([SELECT Id, Name FROM Account WHERE Id IN :accountIds]) — y fuera de cualquier bucle.",
          en: "new Map<Id, Account>([SELECT Id, Name FROM Account WHERE Id IN :accountIds]) — and outside any loop.",
        },
        onPass: {
          es: "Inmune a la inyección y con dos consultas en total, busque lo que busque el agente.",
          en: "Immune to injection and two queries in total, whatever the agent searches for.",
        },
      },
    ],
    rubric: [
      {
        es: "Si el agente escribe O'Brien en el buscador, ¿qué habría pasado con el código original? ¿Y con el tuyo?",
        en: "If the agent types O'Brien into the search box, what would have happened with the original code? And with yours?",
      },
    ],
  },
};
