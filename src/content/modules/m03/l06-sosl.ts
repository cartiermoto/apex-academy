import type { Lesson } from "@/lib/types";

export const l06Sosl: Lesson = {
  id: "m03-l06",
  slug: "sosl",
  n: 7,
  kind: "lesson",
  minutes: 20,
  title: {
    es: "SOSL: búsqueda en varios objetos",
    en: "SOSL: searching across objects",
  },
  summary: {
    es: "Cuando sabes qué texto buscas pero no en qué objeto ni en qué campo está: una búsqueda, varios objetos, una lista por cada uno.",
    en: "When you know what text you are looking for but not which object or field holds it: one search, several objects, one list for each.",
  },
  analogy: {
    es: "La barra de búsqueda global de la parte de arriba de Salesforce",
    en: "The global search bar at the top of Salesforce",
  },
  objectives: [
    {
      es: "Escribir una búsqueda SOSL con FIND, IN y RETURNING.",
      en: "Write a SOSL search with FIND, IN and RETURNING.",
    },
    {
      es: "Leer el resultado List<List<SObject>> y convertir cada lista a su tipo.",
      en: "Read the List<List<SObject>> result and convert each list to its type.",
    },
    {
      es: "Elegir entre SOQL y SOSL según la pregunta de negocio.",
      en: "Choose between SOQL and SOSL based on the business question.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Un agente de soporte recibe una llamada: «Soy de Acme, os escribí la semana pasada». ¿Acme es una cuenta, un contacto con ese correo, una oportunidad con ese nombre? SOQL necesita que le digas el objeto y el campo. SOSL no: le das el texto y te dice dónde aparece.",
        en: "A support agent takes a call: “I am from Acme, I wrote to you last week”. Is Acme an account, a contact with that email, an opportunity with that name? SOQL needs you to tell it the object and the field. SOSL does not: you give it the text and it tells you where it appears.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Escribes «Acme» en la barra de búsqueda global y Salesforce te enseña resultados agrupados: Cuentas (2), Contactos (5), Oportunidades (3). No elegiste objeto ni campo. Eso es SOSL. Y como en la búsqueda global, lo que se puede encontrar depende de qué objetos y campos están indexados para búsqueda.",
        en: "You type “Acme” into the global search bar and Salesforce shows grouped results: Accounts (2), Contacts (5), Opportunities (3). You did not pick an object or a field. That is SOSL. And just like global search, what can be found depends on which objects and fields are indexed for search.",
      },
    },
    {
      type: "h",
      text: { es: "Anatomía de una búsqueda", en: "Anatomy of a search" },
    },
    {
      type: "code",
      code: {
        es: `List<List<SObject>> results = [
    FIND 'Acme*'
    IN ALL FIELDS
    RETURNING Account(Id, Name),
              Contact(Id, Name, Email),
              Opportunity(Id, Name, StageName WHERE IsClosed = false)
    LIMIT 50
];

List<Account>     accounts = (List<Account>)     results[0];
List<Contact>     contacts = (List<Contact>)     results[1];
List<Opportunity> opps     = (List<Opportunity>) results[2];`,
        en: `List<List<SObject>> results = [
    FIND 'Acme*'
    IN ALL FIELDS
    RETURNING Account(Id, Name),
              Contact(Id, Name, Email),
              Opportunity(Id, Name, StageName WHERE IsClosed = false)
    LIMIT 50
];

List<Account>     accounts = (List<Account>)     results[0];
List<Contact>     contacts = (List<Contact>)     results[1];
List<Opportunity> opps     = (List<Opportunity>) results[2];`,
      },
    },
    {
      type: "list",
      items: [
        {
          es: "FIND: el texto a buscar, entre comillas simples. * es «cualquier cosa a partir de aquí» y ? es «un carácter»: 'Acme*' encuentra Acme, Acme Corp, Acmeline.",
          en: "FIND: the text to search for, in single quotes. * means “anything from here on” and ? means “one character”: 'Acme*' finds Acme, Acme Corp, Acmeline.",
        },
        {
          es: "IN: dónde mirar. ALL FIELDS (todos los campos de texto indexados), NAME FIELDS, EMAIL FIELDS o PHONE FIELDS. Cuanto más concreto, más rápido y menos ruido.",
          en: "IN: where to look. ALL FIELDS (all indexed text fields), NAME FIELDS, EMAIL FIELDS or PHONE FIELDS. The more specific, the faster and the less noise.",
        },
        {
          es: "RETURNING: los objetos que te interesan y, entre paréntesis, los campos de cada uno. Cada objeto admite su propio WHERE, ORDER BY y LIMIT, como en SOQL.",
          en: "RETURNING: the objects you care about and, in brackets, the fields of each. Each object takes its own WHERE, ORDER BY and LIMIT, as in SOQL.",
        },
        {
          es: "El texto también puede venir de una variable: FIND :term. Enlazado con dos puntos, igual que en la lección 4.",
          en: "The text can also come from a variable: FIND :term. Bound with a colon, just like in lesson 4.",
        },
      ],
    },
    {
      type: "h",
      text: { es: "Una lista de listas", en: "A list of lists" },
    },
    {
      type: "p",
      text: {
        es: "SOSL devuelve List<List<SObject>>: una lista exterior con una lista interior por cada objeto del RETURNING, en el mismo orden en que los escribiste. La primera, results[0], son las cuentas; results[1], los contactos. Cada lista interior llega como SObject genérico, así que haces un casting a su tipo real para poder leer sus campos cómodamente. Es la misma idea que el AggregateResult de la lección anterior: el resultado llega con un tipo general y tú le dices qué es.",
        en: "SOSL returns List<List<SObject>>: an outer list with one inner list per RETURNING object, in the same order you wrote them. The first, results[0], is the accounts; results[1], the contacts. Each inner list arrives as a generic SObject, so you cast it to its real type to read its fields comfortably. It is the same idea as the previous lesson's AggregateResult: the result arrives with a general type and you tell it what it is.",
      },
    },
    {
      type: "diagram",
      id: "m03-sosl",
      caption: {
        es: "Un FIND, tres cajones. El orden de los cajones es el orden del RETURNING.",
        en: "One FIND, three drawers. The order of the drawers is the order of the RETURNING.",
      },
    },
    {
      type: "h",
      text: { es: "¿SOQL o SOSL?", en: "SOQL or SOSL?" },
    },
    {
      type: "table",
      head: [
        { es: "La pregunta es…", en: "The question is…" },
        { es: "Usa", en: "Use" },
      ],
      rows: [
        [
          { es: "«Las oportunidades de esta cuenta que cierran este mes»", en: "“This account's opportunities closing this month”" },
          { es: "SOQL: sabes objeto, campos y filtros", en: "SOQL: you know object, fields and filters" },
        ],
        [
          { es: "«Todo lo que contenga 'Acme', esté donde esté»", en: "“Everything containing 'Acme', wherever it is”" },
          { es: "SOSL: sabes el texto, no el sitio", en: "SOSL: you know the text, not the place" },
        ],
        [
          { es: "«Un contacto por su correo, en cualquier objeto con email»", en: "“A contact by email, in any object with email”" },
          { es: "SOSL con IN EMAIL FIELDS", en: "SOSL with IN EMAIL FIELDS" },
        ],
        [
          { es: "«Totales por etapa», «cuentas sin casos»", en: "“Totals per stage”, “accounts without cases”" },
          { es: "SOQL: SOSL no agrega ni recorre relaciones", en: "SOQL: SOSL does not aggregate or walk relationships" },
        ],
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "El índice va un poco por detrás", en: "The index runs slightly behind" },
      text: {
        es: "SOSL busca en el índice de búsqueda, no directamente en la tabla. Un registro recién creado puede tardar unos momentos en aparecer, igual que a veces tarda en salir en la búsqueda global. SOQL consulta los datos directamente y no tiene ese retraso. Además, una transacción solo puede lanzar 20 búsquedas SOSL, frente a 100 consultas SOQL.",
        en: "SOSL searches the search index, not the table directly. A record just created may take a moment to show up, just as it sometimes takes a moment to appear in global search. SOQL queries the data directly and has no such delay. Also, a transaction can only run 20 SOSL searches, against 100 SOQL queries.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Un apunte para el Módulo 10", en: "A note for Module 10" },
      text: {
        es: "En las clases de test, SOSL devuelve listas vacías aunque hayas creado datos, porque el índice no se construye durante el test. Se resuelve con Test.setFixedSearchResults(). Lo verás cuando llegues a testing; por ahora, basta con saber que no es un fallo tuyo.",
        en: "In test classes, SOSL returns empty lists even if you created data, because the index is not built during the test. It is solved with Test.setFixedSearchResults(). You will see it when you get to testing; for now, it is enough to know it is not your mistake.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué tipo devuelve SOSL? Si el RETURNING dice Contact(...), Lead(...), ¿en qué posición están los leads? ¿Qué pregunta de negocio te haría elegir SOSL en lugar de SOQL?",
        en: "Without looking: what type does SOSL return? If the RETURNING says Contact(...), Lead(...), in which position are the leads? What business question would make you pick SOSL over SOQL?",
      },
    },
  ],

  quiz: [
    {
      id: "m03-l06-q1",
      kind: "single",
      prompt: {
        es: "¿Qué tipo devuelve una búsqueda SOSL?",
        en: "What type does a SOSL search return?",
      },
      options: [
        { es: "List<List<SObject>>", en: "List<List<SObject>>" },
        { es: "List<SObject>", en: "List<SObject>" },
        { es: "Map<String, List<SObject>>", en: "Map<String, List<SObject>>" },
        { es: "List<AggregateResult>", en: "List<AggregateResult>" },
      ],
      answer: 0,
      explain: {
        es: "Una lista por cada objeto del RETURNING, todas dentro de una lista exterior.",
        en: "One list per RETURNING object, all inside an outer list.",
      },
      tags: ["recall"],
    },
    {
      id: "m03-l06-q2",
      kind: "single",
      prompt: {
        es: "Con este RETURNING, ¿cómo obtienes la lista de leads?",
        en: "With this RETURNING, how do you get the list of leads?",
      },
      code: {
        es: `List<List<SObject>> r = [FIND 'Kim' IN NAME FIELDS
                         RETURNING Contact(Id, Name), Lead(Id, Name)];`,
        en: `List<List<SObject>> r = [FIND 'Kim' IN NAME FIELDS
                         RETURNING Contact(Id, Name), Lead(Id, Name)];`,
      },
      options: [
        { es: "List<Lead> leads = (List<Lead>) r[1];", en: "List<Lead> leads = (List<Lead>) r[1];" },
        { es: "List<Lead> leads = (List<Lead>) r[0];", en: "List<Lead> leads = (List<Lead>) r[0];" },
        { es: "List<Lead> leads = r.get('Lead');", en: "List<Lead> leads = r.get('Lead');" },
      ],
      answer: 0,
      explain: {
        es: "El orden es el del RETURNING y los índices empiezan en 0: Contact es r[0], Lead es r[1].",
        en: "The order is the RETURNING's and indexes start at 0: Contact is r[0], Lead is r[1].",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M1 L8", en: "Review · M1 L8" },
    },
    {
      id: "m03-l06-q3",
      kind: "single",
      prompt: {
        es: "Un cliente llama y solo da su correo electrónico. No sabes si es contacto o lead. ¿Cuál es la MEJOR opción?",
        en: "A customer calls and only gives their email address. You do not know if they are a contact or a lead. Which is the BEST option?",
      },
      options: [
        {
          es: "FIND :email IN EMAIL FIELDS RETURNING Contact(Id, Name), Lead(Id, Name)",
          en: "FIND :email IN EMAIL FIELDS RETURNING Contact(Id, Name), Lead(Id, Name)",
        },
        {
          es: "Dos consultas SOQL, una a Contact y otra a Lead, filtrando por Email",
          en: "Two SOQL queries, one on Contact and one on Lead, filtering by Email",
        },
        {
          es: "FIND :email IN ALL FIELDS RETURNING Account, Contact, Lead, Opportunity, Case",
          en: "FIND :email IN ALL FIELDS RETURNING Account, Contact, Lead, Opportunity, Case",
        },
      ],
      answer: 0,
      explain: {
        es: "Una sola búsqueda, limitada a campos de email y a los dos objetos donde puede estar. La segunda también funciona, pero gasta dos consultas. La tercera busca de más y trae ruido.",
        en: "A single search, limited to email fields and to the two objects where it can be. The second works too, but spends two queries. The third searches too broadly and brings noise.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m03-l06-q4",
      kind: "multi",
      prompt: {
        es: "¿Para qué preguntas es SOQL la herramienta adecuada, y no SOSL?",
        en: "For which questions is SOQL the right tool, not SOSL?",
      },
      options: [
        { es: "El importe total por etapa.", en: "The total amount per stage." },
        { es: "Los contactos de una cuenta concreta.", en: "The contacts of a specific account." },
        {
          es: "Cualquier registro que mencione «Globex» en cualquier campo.",
          en: "Any record mentioning “Globex” in any field.",
        },
        { es: "Las cuentas sin ningún caso.", en: "The accounts without any case." },
      ],
      answers: [0, 1, 3],
      explain: {
        es: "Agregados, relaciones y filtros cruzados son terreno de SOQL. SOSL brilla cuando sabes el texto pero no dónde está.",
        en: "Aggregates, relationships and cross filters are SOQL territory. SOSL shines when you know the text but not where it is.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m03-l06-q5",
      kind: "single",
      prompt: {
        es: "Creas un contacto «Zoe Nakamura» y, en la línea siguiente, lo buscas con SOSL. No aparece. ¿Por qué es posible?",
        en: "You create a contact “Zoe Nakamura” and, on the next line, search for it with SOSL. It does not show up. Why is that possible?",
      },
      options: [
        {
          es: "SOSL busca en el índice de búsqueda, que puede ir unos momentos por detrás.",
          en: "SOSL searches the search index, which can run a moment behind.",
        },
        { es: "SOSL no encuentra contactos.", en: "SOSL does not find contacts." },
        { es: "Hay que buscar en mayúsculas.", en: "You have to search in capitals." },
      ],
      answer: 0,
      explain: {
        es: "Por eso, si acabas de crear o cambiar el dato y sabes dónde está, SOQL es más fiable.",
        en: "That is why, if you just created or changed the data and you know where it is, SOQL is more reliable.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m03-l06-q6",
      kind: "text",
      prompt: {
        es: "¿Qué palabra de SOSL indica los objetos y campos que quieres de vuelta?",
        en: "Which SOSL keyword lists the objects and fields you want back?",
      },
      accept: ["^\\s*RETURNING\\s*$"],
      placeholder: { es: "palabra clave", en: "keyword" },
      explain: {
        es: "RETURNING. FIND dice qué buscar; IN, dónde mirar; RETURNING, qué traer.",
        en: "RETURNING. FIND says what to look for; IN, where to look; RETURNING, what to bring back.",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "El equipo de Servicio quiere un buscador rápido para la consola: el agente escribe un término y ve de golpe las cuentas, los contactos y las oportunidades abiertas que lo contienen.",
      en: "The Service team wants a quick search for the console: the agent types a term and sees at once the accounts, contacts and open opportunities that contain it.",
    },
    brief: [
      {
        es: "El término está en la variable term. Búscalo en todos los campos, enlazado con dos puntos.",
        en: "The term is in the term variable. Search for it in all fields, bound with a colon.",
      },
      {
        es: "Devuelve Account (Id, Name), Contact (Id, Name, Email) y Opportunity (Id, Name, StageName), en ese orden, y de Opportunity solo las abiertas.",
        en: "Return Account (Id, Name), Contact (Id, Name, Email) and Opportunity (Id, Name, StageName), in that order, and only open opportunities.",
      },
      {
        es: "Guarda el resultado en results y pasa cada lista a su tipo: accounts, contacts y opps.",
        en: "Store the result in results and turn each list into its type: accounts, contacts and opps.",
      },
      {
        es: "Muestra cuántos resultados hay de cada objeto.",
        en: "Show how many results there are for each object.",
      },
    ],
    starter: {
      es: `String term = 'Acme*';   // lo escribe el agente

`,
      en: `String term = 'Acme*';   // typed by the agent

`,
    },
    hints: [
      {
        es: "Buscas un texto en varios objetos a la vez: SOSL, con FIND :term.",
        en: "You are searching for text across several objects at once: SOSL, with FIND :term.",
      },
      {
        es: "IN ALL FIELDS RETURNING Account(...), Contact(...), Opportunity(... WHERE IsClosed = false). Luego results[0], [1] y [2] con su casting.",
        en: "IN ALL FIELDS RETURNING Account(...), Contact(...), Opportunity(... WHERE IsClosed = false). Then results[0], [1] and [2] with their cast.",
      },
      {
        es: "Pseudocódigo: List<List<SObject>> results = [FIND :term IN ALL FIELDS RETURNING ...]; List<Account> accounts = (List<Account>) results[0]; ... System.debug(accounts.size());",
        en: "Pseudocode: List<List<SObject>> results = [FIND :term IN ALL FIELDS RETURNING ...]; List<Account> accounts = (List<Account>) results[0]; ... System.debug(accounts.size());",
      },
    ],
    solution: {
      es: `String term = 'Acme*';   // lo escribe el agente

List<List<SObject>> results = [
    FIND :term
    IN ALL FIELDS
    RETURNING Account(Id, Name),
              Contact(Id, Name, Email),
              Opportunity(Id, Name, StageName WHERE IsClosed = false)
];

List<Account>     accounts = (List<Account>)     results[0];
List<Contact>     contacts = (List<Contact>)     results[1];
List<Opportunity> opps     = (List<Opportunity>) results[2];

System.debug('Cuentas: ' + accounts.size());
System.debug('Contactos: ' + contacts.size());
System.debug('Oportunidades abiertas: ' + opps.size());`,
      en: `String term = 'Acme*';   // typed by the agent

List<List<SObject>> results = [
    FIND :term
    IN ALL FIELDS
    RETURNING Account(Id, Name),
              Contact(Id, Name, Email),
              Opportunity(Id, Name, StageName WHERE IsClosed = false)
];

List<Account>     accounts = (List<Account>)     results[0];
List<Contact>     contacts = (List<Contact>)     results[1];
List<Opportunity> opps     = (List<Opportunity>) results[2];

System.debug('Accounts: ' + accounts.size());
System.debug('Contacts: ' + contacts.size());
System.debug('Open opportunities: ' + opps.size());`,
    },
    checks: [
      {
        id: "m03-l06-c1",
        label: {
          es: "Una búsqueda SOSL con FIND :term IN ALL FIELDS guardada en List<List<SObject>> results",
          en: "A SOSL search with FIND :term IN ALL FIELDS stored in List<List<SObject>> results",
        },
        rule: {
          op: "match",
          pattern: "List\\s*<\\s*List\\s*<\\s*SObject\\s*>\\s*>\\s+results\\s*=\\s*\\[\\s*FIND\\s*:\\s*term\\s+IN\\s+ALL\\s+FIELDS\\b",
        },
        onFail: {
          es: "List<List<SObject>> results = [FIND :term IN ALL FIELDS RETURNING ...];",
          en: "List<List<SObject>> results = [FIND :term IN ALL FIELDS RETURNING ...];",
        },
      },
      {
        id: "m03-l06-c2",
        label: {
          es: "RETURNING en el orden Account, Contact, Opportunity con sus campos",
          en: "RETURNING in the order Account, Contact, Opportunity with their fields",
        },
        rule: {
          op: "match",
          pattern: "RETURNING\\s+Account\\s*\\([^)]*\\bName\\b[^)]*\\)\\s*,\\s*Contact\\s*\\([^)]*\\bEmail\\b[^)]*\\)\\s*,\\s*Opportunity\\s*\\([^)]*\\bStageName\\b",
        },
        onFail: {
          es: "RETURNING Account(Id, Name), Contact(Id, Name, Email), Opportunity(Id, Name, StageName ...) — en ese orden.",
          en: "RETURNING Account(Id, Name), Contact(Id, Name, Email), Opportunity(Id, Name, StageName ...) — in that order.",
        },
      },
      {
        id: "m03-l06-c3",
        label: {
          es: "De Opportunity solo trae las abiertas",
          en: "Only open opportunities are returned",
        },
        rule: { op: "match", pattern: "Opportunity\\s*\\([^)]*WHERE\\s+IsClosed\\s*=\\s*false[^)]*\\)" },
        onFail: {
          es: "El filtro va dentro de los paréntesis de Opportunity: Opportunity(Id, Name, StageName WHERE IsClosed = false).",
          en: "The filter goes inside Opportunity's brackets: Opportunity(Id, Name, StageName WHERE IsClosed = false).",
        },
      },
      {
        id: "m03-l06-c4",
        label: {
          es: "Cada lista se convierte a su tipo con el índice correcto",
          en: "Each list is cast to its type with the right index",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "\\(\\s*List\\s*<\\s*Account\\s*>\\s*\\)\\s*results\\s*\\[\\s*0\\s*\\]" },
            { op: "match", pattern: "\\(\\s*List\\s*<\\s*Contact\\s*>\\s*\\)\\s*results\\s*\\[\\s*1\\s*\\]" },
            { op: "match", pattern: "\\(\\s*List\\s*<\\s*Opportunity\\s*>\\s*\\)\\s*results\\s*\\[\\s*2\\s*\\]" },
          ],
        },
        onFail: {
          es: "Account es results[0], Contact results[1] y Opportunity results[2], cada uno con su (List<...>) delante.",
          en: "Account is results[0], Contact results[1] and Opportunity results[2], each with its (List<...>) in front.",
        },
      },
      {
        id: "m03-l06-c5",
        label: { es: "Muestra cuántos hay de cada objeto", en: "Shows how many there are of each object" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "accounts\\.size\\(\\s*\\)" },
            { op: "match", pattern: "contacts\\.size\\(\\s*\\)" },
            { op: "match", pattern: "opps\\.size\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "Un System.debug por lista con .size().",
          en: "One System.debug per list with .size().",
        },
        onPass: {
          es: "Una búsqueda cubre tres objetos: la barra de búsqueda global, dentro de tu código.",
          en: "One search covers three objects: the global search bar, inside your code.",
        },
      },
    ],
    rubric: [
      {
        es: "Si los agentes solo buscan por nombre de persona o empresa, ¿qué cambiarías en el IN para reducir ruido?",
        en: "If the agents only search by person or company name, what would you change in the IN to reduce noise?",
      },
    ],
  },
};
