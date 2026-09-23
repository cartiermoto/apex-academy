import type { Lesson } from "@/lib/types";

export const l08Subconsultas: Lesson = {
  id: "m03-l08",
  slug: "subconsultas",
  n: 4,
  kind: "lesson",
  minutes: 34,
  title: { es: "Subconsultas a fondo", en: "Subqueries in depth" },
  summary: {
    es: "La sub-lección anterior presentó las subconsultas. Esta las lleva al límite: su propio filtro y orden, cómo recorrerlas, cómo combinarlas con IN y NOT IN, y las reglas exactas que la plataforma no te deja saltar.",
    en: "The previous sub-lesson introduced subqueries. This one takes them to the limit: their own filter and order, how to loop them, how to combine them with IN and NOT IN, and the exact rules the platform will not let you break.",
  },
  analogy: {
    es: "La related list filtrada de la página del registro, y el filtro cruzado de un informe",
    en: "A record page's filtered related list, and a report's cross filter",
  },
  objectives: [
    {
      es: "Encontrar el nombre de la relación hija en Object Manager y escribirlo bien en el FROM de la subconsulta.",
      en: "Find the child relationship name in Object Manager and write it correctly in the subquery's FROM.",
    },
    {
      es: "Filtrar, ordenar y limitar DENTRO de la subconsulta, sabiendo que cada padre recibe su propio resultado.",
      en: "Filter, order and limit INSIDE the subquery, knowing each parent gets its own result.",
    },
    {
      es: "Combinar en una misma consulta traer los hijos y filtrar los padres por sus hijos.",
      en: "Combine, in one query, bringing the children back and filtering the parents by their children.",
    },
    {
      es: "Conocer los límites reales: un nivel hacia abajo, cinco hacia arriba, dos filtros por hijos, y cómo cuenta todo para los governor limits.",
      en: "Know the real limits: one level down, five up, two child filters, and how all of it counts towards governor limits.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Abre una cuenta en Salesforce y baja hasta la related list de Oportunidades. Ahora pulsa «Ver todo» y fíjate: puedes ordenarla por importe y quedarte con las primeras. Eso, escrito como texto y para todas las cuentas a la vez, es una [[subconsulta]] con su propio ORDER BY y LIMIT. Y el filtro cruzado de un informe —«Cuentas con Oportunidades»— es la otra mitad de esta sub-lección.",
        en: "Open an account in Salesforce and scroll to the Opportunities related list. Now click “View All” and notice: you can sort it by amount and keep the top ones. That, written as text and for every account at once, is a [[subconsulta|subquery]] with its own ORDER BY and LIMIT. And a report's cross filter — “Accounts with Opportunities” — is the other half of this sub-lesson.",
      },
    },
    {
      type: "h",
      text: { es: "El nombre de la relación: dónde se mira", en: "The relationship name: where to look it up" },
    },
    {
      type: "p",
      text: {
        es: "El FROM de una subconsulta no lleva el nombre del objeto hijo, sino el de la relación hija. Para los objetos estándar es el plural en inglés (Contacts, Opportunities, Cases). Para los personalizados lo decidió quien creó el campo de búsqueda, y lleva __r al final. No hay que adivinarlo: está escrito en Setup.",
        en: "A subquery's FROM does not take the child object's name but the child relationship's name. For standard objects it is the English plural (Contacts, Opportunities, Cases). For custom ones it was chosen by whoever created the lookup field, and it ends in __r. No guessing needed: it is written down in Setup.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Lo configuraste tú al crear el campo", en: "You set it yourself when you created the field" },
      text: {
        es: "Object Manager → el objeto HIJO → Fields & Relationships → el campo de búsqueda o maestro-detalle que apunta al padre. En su página aparece «Child Relationship Name». Es el mismo nombre que viste en el asistente cuando creaste la relación, en el paso donde también eliges la etiqueta de la related list. Ese valor, con __r detrás, es lo que va en el FROM.",
        en: "Object Manager → the CHILD object → Fields & Relationships → the lookup or master-detail field pointing at the parent. Its page shows “Child Relationship Name”. It is the same name you saw in the wizard when you created the relationship, on the step where you also choose the related list label. That value, with __r after it, is what goes in the FROM.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Objeto hijo", en: "Child object" },
        { es: "Campo que apunta al padre", en: "Field pointing at the parent" },
        { es: "En el FROM de la subconsulta", en: "In the subquery's FROM" },
      ],
      rows: [
        [
          { es: "Contact", en: "Contact" },
          { es: "AccountId", en: "AccountId" },
          { es: "Contacts", en: "Contacts" },
        ],
        [
          { es: "Opportunity", en: "Opportunity" },
          { es: "AccountId", en: "AccountId" },
          { es: "Opportunities", en: "Opportunities" },
        ],
        [
          { es: "Case", en: "Case" },
          { es: "AccountId", en: "AccountId" },
          { es: "Cases", en: "Cases" },
        ],
        [
          { es: "OpportunityLineItem", en: "OpportunityLineItem" },
          { es: "OpportunityId", en: "OpportunityId" },
          { es: "OpportunityLineItems", en: "OpportunityLineItems" },
        ],
        [
          { es: "Renewal_Line__c (personalizado)", en: "Renewal_Line__c (custom)" },
          { es: "Contract__c", en: "Contract__c" },
          { es: "Renewal_Lines__r — el que pusieras al crearlo", en: "Renewal_Lines__r — whatever you named it" },
        ],
      ],
    },
    {
      type: "h",
      text: { es: "Su propio WHERE, ORDER BY y LIMIT", en: "Its own WHERE, ORDER BY and LIMIT" },
    },
    {
      type: "p",
      text: {
        es: "Dentro de los paréntesis de una subconsulta caben las mismas cláusulas que ya conoces. Y aquí está la idea que más cuesta al principio: se aplican a los hijos DE CADA PADRE por separado. LIMIT 3 dentro de la subconsulta no significa «tres oportunidades en total», significa «como mucho tres oportunidades por cuenta».",
        en: "Inside a subquery's brackets fit the same clauses you already know. And here is the idea that costs most at first: they apply to EACH PARENT's children separately. LIMIT 3 inside the subquery does not mean “three opportunities in total”, it means “at most three opportunities per account”.",
      },
    },
    {
      type: "code",
      code: {
        es: `List<Account> accounts = [
    SELECT Name,
        (SELECT Name, Amount
         FROM Opportunities
         WHERE IsClosed = false
         ORDER BY Amount DESC
         LIMIT 3)
    FROM Account
    WHERE Industry = 'Technology'
];
// 10 cuentas → hasta 30 oportunidades: las 3 mayores DE CADA UNA`,
        en: `List<Account> accounts = [
    SELECT Name,
        (SELECT Name, Amount
         FROM Opportunities
         WHERE IsClosed = false
         ORDER BY Amount DESC
         LIMIT 3)
    FROM Account
    WHERE Industry = 'Technology'
];
// 10 accounts → up to 30 opportunities: the top 3 OF EACH ONE`,
      },
      caption: {
        es: "El WHERE de dentro elige qué hijos vuelven. El WHERE de fuera elige qué padres. Son dos filtros distintos.",
        en: "The inner WHERE picks which children come back. The outer WHERE picks which parents. They are two different filters.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "El WHERE de dentro no quita padres", en: "The inner WHERE does not remove parents" },
      text: {
        es: "Si una cuenta no tiene ninguna oportunidad abierta, la consulta de arriba la devuelve IGUALMENTE, con la lista de oportunidades vacía. El filtro de la subconsulta solo decide qué hijos cuelgan de cada padre; nunca saca a un padre del resultado. Para eso hace falta la otra herramienta: IN, que viene dos apartados más abajo.",
        en: "If an account has no open opportunities, the query above returns it ANYWAY, with an empty opportunities list. The subquery's filter only decides which children hang off each parent; it never takes a parent out of the result. For that you need the other tool: IN, two sections further down.",
      },
    },
    {
      type: "h",
      text: { es: "Recorrerla: un bucle dentro de otro", en: "Looping it: one loop inside another" },
    },
    {
      type: "p",
      text: {
        es: "Cada cuenta que vuelve trae sus hijos en una propiedad con el mismo nombre de la relación: a.Opportunities, a.Contacts. Es una List normal, así que se recorre con el for que ya conoces. Y como vimos, si no hay hijos llega vacía, no null: el bucle simplemente no da ninguna vuelta.",
        en: "Every account that comes back carries its children in a property with the same name as the relationship: a.Opportunities, a.Contacts. It is a normal List, so you loop it with the for you already know. And as we saw, with no children it arrives empty, not null: the loop simply does not go round.",
      },
    },
    {
      type: "code",
      code: {
        es: `for (Account a : accounts) {
    System.debug(a.Name + ' tiene ' + a.Opportunities.size() + ' abiertas');

    for (Opportunity o : a.Opportunities) {
        System.debug('   ' + o.Name + ' · ' + o.Amount);
    }
}`,
        en: `for (Account a : accounts) {
    System.debug(a.Name + ' has ' + a.Opportunities.size() + ' open');

    for (Opportunity o : a.Opportunities) {
        System.debug('   ' + o.Name + ' · ' + o.Amount);
    }
}`,
      },
    },
    {
      type: "h",
      text: { es: "Filtrar los padres por sus hijos: IN y NOT IN", en: "Filtering parents by their children: IN and NOT IN" },
    },
    {
      type: "p",
      text: {
        es: "Cuando lo que quieres es decidir QUÉ padres entran según sus hijos, la subconsulta va en el WHERE, detrás de IN o NOT IN, y devuelve una lista de Ids. Es exactamente el filtro cruzado de los informes: «Cuentas CON casos abiertos» es IN; «Cuentas SIN oportunidades» es NOT IN.",
        en: "When what you want is to decide WHICH parents get in based on their children, the subquery goes in the WHERE, after IN or NOT IN, and returns a list of Ids. It is exactly the report cross filter: “Accounts WITH open cases” is IN; “Accounts WITHOUT opportunities” is NOT IN.",
      },
    },
    {
      type: "code",
      code: {
        es: `// Filtro cruzado «CON»: cuentas que tienen algún caso abierto
List<Account> withOpenCases = [
    SELECT Name FROM Account
    WHERE Id IN (SELECT AccountId FROM Case WHERE IsClosed = false)
];

// Filtro cruzado «SIN»: cuentas que nunca han tenido una oportunidad
List<Account> neverSold = [
    SELECT Name FROM Account
    WHERE Id NOT IN (SELECT AccountId FROM Opportunity)
];`,
        en: `// "WITH" cross filter: accounts that have some open case
List<Account> withOpenCases = [
    SELECT Name FROM Account
    WHERE Id IN (SELECT AccountId FROM Case WHERE IsClosed = false)
];

// "WITHOUT" cross filter: accounts that never had an opportunity
List<Account> neverSold = [
    SELECT Name FROM Account
    WHERE Id NOT IN (SELECT AccountId FROM Opportunity)
];`,
      },
    },
    {
      type: "list",
      items: [
        {
          es: "A la izquierda del IN va el Id o un campo que apunta a otro registro (AccountId, OwnerId), y sin puntos: Account.Id no vale.",
          en: "Left of the IN goes the Id or a field pointing at another record (AccountId, OwnerId), with no dots: Account.Id is not allowed.",
        },
        {
          es: "La subconsulta selecciona UN solo campo, que también apunta a un registro, y tampoco puede llevar puntos.",
          en: "The subquery selects ONE field, which also points at a record, and it cannot use dots either.",
        },
        {
          es: "Los dos lados tienen que hablar del mismo objeto: Id de Account a la izquierda, AccountId a la derecha.",
          en: "Both sides must talk about the same object: an Account Id on the left, AccountId on the right.",
        },
        {
          es: "Como mucho dos filtros de este tipo por consulta, y solo en el WHERE principal: no dentro del WHERE de otra subconsulta.",
          en: "At most two filters of this kind per query, and only in the main WHERE: not inside another subquery's WHERE.",
        },
      ],
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Traer hijos y filtrar por hijos no se sustituyen", en: "Bringing children back and filtering by them do not replace each other" },
      text: {
        es: "En un informe con Report Type «Cuentas con Oportunidades» ves las oportunidades Y solo salen las cuentas que tienen alguna. En SOQL son dos piezas separadas: la subconsulta del SELECT trae los hijos pero no quita padres; el IN del WHERE quita padres pero no trae hijos. Para reproducir ese informe hacen falta las dos a la vez.",
        en: "In a report with the “Accounts with Opportunities” report type you see the opportunities AND only accounts that have some appear. In SOQL those are two separate pieces: the SELECT subquery brings children but removes no parents; the WHERE IN removes parents but brings no children. To reproduce that report you need both at once.",
      },
    },
    {
      type: "code",
      code: {
        es: `// Solo cuentas con casos abiertos, y cada una con SUS casos abiertos
List<Account> support = [
    SELECT Name,
        (SELECT CaseNumber, Subject, Priority
         FROM Cases
         WHERE IsClosed = false
         ORDER BY Priority)
    FROM Account
    WHERE Id IN (SELECT AccountId FROM Case WHERE IsClosed = false)
];`,
        en: `// Only accounts with open cases, each with ITS open cases
List<Account> support = [
    SELECT Name,
        (SELECT CaseNumber, Subject, Priority
         FROM Cases
         WHERE IsClosed = false
         ORDER BY Priority)
    FROM Account
    WHERE Id IN (SELECT AccountId FROM Case WHERE IsClosed = false)
];`,
      },
      caption: {
        es: "La condición «IsClosed = false» aparece dos veces, y no sobra ninguna: una elige qué cuentas entran, la otra qué casos viajan con cada cuenta.",
        en: "The “IsClosed = false” condition appears twice, and neither is spare: one picks which accounts get in, the other which cases travel with each account.",
      },
    },
    {
      type: "h",
      text: { es: "Los límites que hay que saberse", en: "The limits you need to know" },
    },
    {
      type: "table",
      head: [
        { es: "Regla", en: "Rule" },
        { es: "Límite", en: "Limit" },
        { es: "Qué significa en la práctica", en: "What it means in practice" },
      ],
      rows: [
        [
          { es: "Hacia abajo (subconsulta)", en: "Downwards (subquery)" },
          { es: "1 nivel", en: "1 level" },
          { es: "No se anida una subconsulta dentro de otra: cuentas → oportunidades sí; cuentas → oportunidades → productos, no.", en: "No subquery inside another: accounts → opportunities yes; accounts → opportunities → products, no." },
        ],
        [
          { es: "Hacia arriba (punto)", en: "Upwards (dot)" },
          { es: "5 niveles", en: "5 levels" },
          { es: "Contact.Account.Owner.Manager.Name es válido.", en: "Contact.Account.Owner.Manager.Name is valid." },
        ],
        [
          { es: "Subconsultas en un SELECT", en: "Subqueries in one SELECT" },
          { es: "20", en: "20" },
          { es: "Una cuenta con sus contactos, oportunidades y casos en la misma consulta: sin problema.", en: "An account with its contacts, opportunities and cases in one query: no problem." },
        ],
        [
          { es: "IN / NOT IN con subconsulta", en: "IN / NOT IN with a subquery" },
          { es: "2 por consulta", en: "2 per query" },
          { es: "«Con casos abiertos Y sin oportunidades» cabe; una tercera condición así, no.", en: "“With open cases AND without opportunities” fits; a third such condition does not." },
        ],
        [
          { es: "Filas devueltas", en: "Rows returned" },
          { es: "50.000 por transacción", en: "50,000 per transaction" },
          { es: "Los hijos cuentan: 200 cuentas con 10 contactos cada una son 2.200 filas, no 200.", en: "Children count: 200 accounts with 10 contacts each are 2,200 rows, not 200." },
        ],
      ],
    },
    {
      type: "p",
      text: {
        es: "Y el límite que más importa, el de consultas: una consulta con subconsultas es UNA sentencia SOQL de las 100 que permite una transacción, traiga los hijos que traiga. Por eso la subconsulta no es solo cómoda: es la forma de no preguntar a la base de datos una vez por cada registro. Cambia de pestaña en el diagrama y sube a 200 cuentas.",
        en: "And the limit that matters most, the query one: a query with subqueries is ONE SOQL statement out of the 100 a transaction allows, however many children it brings. That is why the subquery is not just convenient: it is how you avoid asking the database once per record. Switch tabs in the diagram and move up to 200 accounts.",
      },
    },
    {
      type: "diagram",
      id: "m03-subquery-cost",
      caption: {
        es: "Los mismos datos, dos maneras de pedirlos. Las filas son idénticas; lo que cambia es cuántas veces preguntas. Esto es el Módulo 4 asomando la cabeza.",
        en: "The same data, two ways of asking for it. The rows are identical; what changes is how many times you ask. This is Module 4 peeking in.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Pruébalo en tu Developer Org", en: "Try it in your Developer Org" },
      text: {
        es: "En el Developer Console, pestaña Query Editor, pega la consulta de los casos de arriba (sin los corchetes ni el List<Account> =) y pulsa Execute. Fíjate en cómo aparecen los casos de cada cuenta en el resultado. Luego cambia Cases por Case en el FROM de la subconsulta y lee el error: es el que te encontrarás el día que olvides que va el nombre de la relación.",
        en: "In the Developer Console, Query Editor tab, paste the cases query above (without the brackets or the List<Account> =) and press Execute. Notice how each account's cases show up in the result. Then change Cases to Case in the subquery's FROM and read the error: it is the one you will meet the day you forget it takes the relationship name.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué significa LIMIT 3 dentro de una subconsulta? Si una cuenta no tiene hijos que cumplan el WHERE de la subconsulta, ¿sale en el resultado? ¿Qué escribes para quedarte solo con las cuentas que SÍ los tienen? ¿Cuántas sentencias SOQL gasta una consulta con dos subconsultas?",
        en: "Without looking: what does LIMIT 3 inside a subquery mean? If an account has no children matching the subquery's WHERE, does it appear in the result? What do you write to keep only the accounts that DO have them? How many SOQL statements does a query with two subqueries use up?",
      },
    },
  ],

  quiz: [
    {
      id: "m03-l08-q1",
      kind: "single",
      prompt: {
        es: "Hay 10 cuentas de Technology y cada una tiene 8 oportunidades abiertas. ¿Cuántas oportunidades devuelve esta consulta en total?",
        en: "There are 10 Technology accounts and each has 8 open opportunities. How many opportunities does this query return in total?",
      },
      code: {
        es: `[SELECT Name,
    (SELECT Name FROM Opportunities
     WHERE IsClosed = false ORDER BY Amount DESC LIMIT 3)
 FROM Account WHERE Industry = 'Technology']`,
        en: `[SELECT Name,
    (SELECT Name FROM Opportunities
     WHERE IsClosed = false ORDER BY Amount DESC LIMIT 3)
 FROM Account WHERE Industry = 'Technology']`,
      },
      options: [
        { es: "30", en: "30" },
        { es: "3", en: "3" },
        { es: "80", en: "80" },
        { es: "10", en: "10" },
      ],
      answer: 0,
      explain: {
        es: "El LIMIT de la subconsulta se aplica a los hijos de CADA cuenta por separado: 3 por cuenta × 10 cuentas = 30.",
        en: "The subquery's LIMIT applies to EACH account's children separately: 3 per account × 10 accounts = 30.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m03-l08-q2",
      kind: "single",
      prompt: {
        es: "Esta consulta no compila. ¿Por qué?",
        en: "This query does not compile. Why?",
      },
      code: {
        es: `[SELECT Name, (SELECT LastName FROM Contact) FROM Account]`,
        en: `[SELECT Name, (SELECT LastName FROM Contact) FROM Account]`,
      },
      options: [
        {
          es: "En el FROM de la subconsulta va el nombre de la relación hija, Contacts, no el del objeto.",
          en: "The subquery's FROM takes the child relationship name, Contacts, not the object name.",
        },
        {
          es: "Una subconsulta no puede ir en el SELECT, solo en el WHERE.",
          en: "A subquery cannot go in the SELECT, only in the WHERE.",
        },
        {
          es: "Falta el Id en la subconsulta.",
          en: "The subquery is missing the Id.",
        },
        {
          es: "Hay que escribir Contact__r, porque es una relación.",
          en: "It must be Contact__r, because it is a relationship.",
        },
      ],
      answer: 0,
      explain: {
        es: "La subconsulta del SELECT recorre la relación hija, y su nombre en objetos estándar es el plural: Contacts. __r es para relaciones personalizadas, y Contact es estándar.",
        en: "The SELECT subquery walks the child relationship, and on standard objects its name is the plural: Contacts. __r is for custom relationships, and Contact is standard.",
      },
      tags: ["find-error"],
    },
    {
      id: "m03-l08-q3",
      kind: "single",
      prompt: {
        es: "Una cuenta de Technology no tiene ninguna oportunidad abierta. ¿Qué pasa con ella en la consulta de la pregunta 1?",
        en: "A Technology account has no open opportunities. What happens to it in the query from question 1?",
      },
      options: [
        {
          es: "Aparece en el resultado, con la lista de oportunidades vacía.",
          en: "It appears in the result, with an empty opportunities list.",
        },
        {
          es: "No aparece: el WHERE de la subconsulta la descarta.",
          en: "It does not appear: the subquery's WHERE discards it.",
        },
        {
          es: "Aparece con a.Opportunities igual a null.",
          en: "It appears with a.Opportunities equal to null.",
        },
        {
          es: "La consulta lanza una excepción.",
          en: "The query throws an exception.",
        },
      ],
      answer: 0,
      explain: {
        es: "El WHERE de dentro solo elige qué hijos cuelgan de cada padre; nunca quita padres. La lista llega vacía —no null—, así que recorrerla es seguro. Para quitar esa cuenta haría falta un IN en el WHERE de fuera.",
        en: "The inner WHERE only picks which children hang off each parent; it never removes parents. The list arrives empty — not null — so looping it is safe. Removing that account would take an IN in the outer WHERE.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m03-l08-q4",
      kind: "single",
      prompt: {
        es: "Quieres cada cuenta con sus oportunidades, y dentro de cada oportunidad sus productos. ¿Qué pasa con esta consulta?",
        en: "You want each account with its opportunities, and inside each opportunity its products. What happens with this query?",
      },
      code: {
        es: `[SELECT Name,
    (SELECT Name,
        (SELECT Quantity FROM OpportunityLineItems)
     FROM Opportunities)
 FROM Account]`,
        en: `[SELECT Name,
    (SELECT Name,
        (SELECT Quantity FROM OpportunityLineItems)
     FROM Opportunities)
 FROM Account]`,
      },
      options: [
        {
          es: "No compila: hacia abajo solo se baja un nivel, no se anida una subconsulta dentro de otra.",
          en: "It does not compile: you only go one level down, a subquery cannot nest inside another.",
        },
        {
          es: "Funciona y trae los tres niveles.",
          en: "It works and brings all three levels.",
        },
        {
          es: "Compila, pero ignora la subconsulta de productos.",
          en: "It compiles, but ignores the products subquery.",
        },
        {
          es: "Funciona solo si se añade LIMIT a cada subconsulta.",
          en: "It works only if LIMIT is added to each subquery.",
        },
      ],
      answer: 0,
      explain: {
        es: "Hacia arriba se suben hasta cinco niveles con puntos; hacia abajo, uno solo. La salida habitual es consultar desde el nivel del medio: SELECT Name, Account.Name, (SELECT Quantity FROM OpportunityLineItems) FROM Opportunity.",
        en: "Upwards you climb up to five levels with dots; downwards, only one. The usual way out is to query from the middle level: SELECT Name, Account.Name, (SELECT Quantity FROM OpportunityLineItems) FROM Opportunity.",
      },
      tags: ["find-error"],
    },
    {
      id: "m03-l08-q5",
      kind: "single",
      prompt: {
        es: "¿Qué devuelve esta consulta?",
        en: "What does this query return?",
      },
      code: {
        es: `[SELECT Name FROM Account
 WHERE Id NOT IN (SELECT AccountId FROM Opportunity)]`,
        en: `[SELECT Name FROM Account
 WHERE Id NOT IN (SELECT AccountId FROM Opportunity)]`,
      },
      options: [
        {
          es: "Las cuentas que no tienen ninguna oportunidad, sin ningún dato de oportunidades.",
          en: "The accounts with no opportunities at all, with no opportunity data.",
        },
        {
          es: "Las oportunidades que no tienen cuenta.",
          en: "The opportunities that have no account.",
        },
        {
          es: "Todas las cuentas, con su lista de oportunidades vacía.",
          en: "Every account, with an empty opportunities list.",
        },
        {
          es: "Las cuentas cuyas oportunidades están todas cerradas.",
          en: "The accounts whose opportunities are all closed.",
        },
      ],
      answer: 0,
      explain: {
        es: "Es el filtro cruzado «Cuentas SIN Oportunidades». La subconsulta del WHERE solo sirve para decidir qué cuentas entran: el resultado son cuentas, y no trae nada de las oportunidades. Para «todas cerradas» haría falta otra condición.",
        en: "It is the “Accounts WITHOUT Opportunities” cross filter. The WHERE subquery only decides which accounts get in: the result is accounts, bringing nothing from the opportunities. “All closed” would need a different condition.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m03-l08-q6",
      kind: "single",
      prompt: {
        es: "Una consulta trae las cuentas con sus contactos y sus oportunidades, con dos subconsultas en el SELECT. ¿Cuántas de las 100 consultas SOQL de la transacción gasta?",
        en: "A query brings accounts with their contacts and opportunities, using two subqueries in the SELECT. How many of the transaction's 100 SOQL queries does it use?",
      },
      options: [
        { es: "1", en: "1" },
        { es: "3", en: "3" },
        { es: "Una por cada cuenta devuelta", en: "One per account returned" },
        { es: "2", en: "2" },
      ],
      answer: 0,
      explain: {
        es: "Es una sola sentencia SOQL, traiga los hijos que traiga. Las filas sí cuentan todas para el tope de 50.000: cuentas, contactos y oportunidades.",
        en: "It is a single SOQL statement, however many children it brings. The rows do all count towards the 50,000 cap: accounts, contacts and opportunities.",
      },
      tags: ["recall"],
    },
    {
      id: "m03-l08-q7",
      kind: "text",
      prompt: {
        es: "Escribe lo que va dentro del FROM de una subconsulta que trae los casos de cada cuenta.",
        en: "Write what goes in the FROM of a subquery that brings each account's cases.",
      },
      accept: ["cases"],
      placeholder: { es: "FROM …", en: "FROM …" },
      explain: {
        es: "Cases: el plural, porque es el nombre de la relación hija del objeto estándar Case.",
        en: "Cases: the plural, because it is the child relationship name of the standard Case object.",
      },
      tags: ["recall"],
    },
    {
      id: "m03-l08-q8",
      kind: "single",
      prompt: {
        es: "Repaso: ¿qué hace este bucle cuando a.Contacts es una lista vacía?",
        en: "Review: what does this loop do when a.Contacts is an empty list?",
      },
      code: {
        es: `for (Contact c : a.Contacts) {
    System.debug(c.LastName);
}`,
        en: `for (Contact c : a.Contacts) {
    System.debug(c.LastName);
}`,
      },
      options: [
        { es: "No da ninguna vuelta y el código sigue sin error.", en: "It goes round zero times and the code carries on with no error." },
        { es: "Lanza NullPointerException.", en: "It throws NullPointerException." },
        { es: "Da una vuelta con c igual a null.", en: "It goes round once with c equal to null." },
        { es: "No compila: hay que comprobar size() antes.", en: "It does not compile: you must check size() first." },
      ],
      answer: 0,
      explain: {
        es: "Recorrer una lista vacía es seguro: el for mira cuántos elementos hay, ve cero y no entra. Lo peligroso sería una lista null, y la subconsulta nunca la devuelve null.",
        en: "Looping an empty list is safe: the for checks how many elements there are, sees zero and does not go in. The danger would be a null list, and a subquery never returns one as null.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M2 Bucles", en: "Review · M2 Loops" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 4 DE 8 · Revisión de cartera de Retail. Ventas prepara la reunión del lunes y pide dos listas: las cuentas de Retail que tienen negocio abierto —cada una con su propietario y sus tres oportunidades abiertas más grandes— y, aparte, las de Retail que no han tenido nunca una oportunidad, para asignarlas a prospección. Dos consultas, ni una más.",
      en: "TASK 4 OF 8 · Retail portfolio review. Sales is preparing Monday's meeting and asks for two lists: the Retail accounts with open business — each with its owner and its three largest open opportunities — and, separately, the Retail accounts that never had an opportunity, to hand them to prospecting. Two queries, not one more.",
    },
    brief: [
      {
        es: "pipeline: una List<Account> con el nombre de la cuenta y el nombre de su propietario.",
        en: "pipeline: a List<Account> with the account name and its owner's name.",
      },
      {
        es: "Dentro de la misma consulta, de cada cuenta, sus oportunidades ABIERTAS con Name, Amount y StageName: solo las tres de mayor importe.",
        en: "In that same query, for each account, its OPEN opportunities with Name, Amount and StageName: only the three largest by amount.",
      },
      {
        es: "En pipeline solo entran cuentas de Retail que tengan AL MENOS una oportunidad abierta. Una cuenta sin negocio abierto no debe aparecer con la lista vacía.",
        en: "pipeline only takes Retail accounts with AT LEAST one open opportunity. An account with no open business must not show up with an empty list.",
      },
      {
        es: "Recorre pipeline mostrando cada cuenta con su propietario y, debajo, cada una de sus oportunidades.",
        en: "Loop pipeline showing each account with its owner and, beneath it, each of its opportunities.",
      },
      {
        es: "noPipeline: las cuentas de Retail que no tienen ninguna oportunidad, ni abierta ni cerrada.",
        en: "noPipeline: the Retail accounts with no opportunity at all, open or closed.",
      },
      {
        es: "toAssign: cuántas cuentas hay en noPipeline, calculado.",
        en: "toAssign: how many accounts are in noPipeline, computed.",
      },
      {
        es: "«Abierta» es IsClosed = false. Y ninguna consulta dentro de un bucle.",
        en: "“Open” is IsClosed = false. And no query inside a loop.",
      },
    ],
    starter: {
      es: `// CASO: la revisión trimestral de cartera del equipo de cuentas
// Tarea 4 de 8: la cartera con negocio abierto, y la que nunca ha comprado.

// Revisión de cartera de Retail · reunión del lunes
// Dos consultas: la cartera con negocio abierto y las cuentas sin estrenar.

`,
      en: `// CASE: the account team's quarterly portfolio review
// Task 4 of 8: the portfolio with open business, and the part that never bought.

// Retail portfolio review · Monday's meeting
// Two queries: the portfolio with open business and the untouched accounts.

`,
    },
    hints: [
      {
        es: "Hay dos filtros distintos escondidos en la primera lista: uno decide QUÉ oportunidades viajan con cada cuenta y otro decide QUÉ cuentas entran. ¿Dónde va cada uno?",
        en: "Two different filters hide in the first list: one decides WHICH opportunities travel with each account, the other WHICH accounts get in. Where does each go?",
      },
      {
        es: "Las tres mayores por cuenta son ORDER BY y LIMIT DENTRO de la subconsulta. «Solo las que tienen negocio abierto» es un Id IN (SELECT AccountId …) en el WHERE de fuera, con su propio IsClosed = false. La segunda lista es la misma idea con NOT IN.",
        en: "The top three per account are ORDER BY and LIMIT INSIDE the subquery. “Only those with open business” is an Id IN (SELECT AccountId …) in the outer WHERE, with its own IsClosed = false. The second list is the same idea with NOT IN.",
      },
      {
        es: "Pseudocódigo: [SELECT Id, Name, Owner.Name, (SELECT … FROM Opportunities WHERE IsClosed = false ORDER BY Amount DESC LIMIT 3) FROM Account WHERE Industry = 'Retail' AND Id IN (SELECT AccountId FROM Opportunity WHERE IsClosed = false)]",
        en: "Pseudocode: [SELECT Id, Name, Owner.Name, (SELECT … FROM Opportunities WHERE IsClosed = false ORDER BY Amount DESC LIMIT 3) FROM Account WHERE Industry = 'Retail' AND Id IN (SELECT AccountId FROM Opportunity WHERE IsClosed = false)]",
      },
    ],
    solution: {
      es: `List<Account> pipeline = [
    SELECT Id, Name, Owner.Name,
        (SELECT Name, Amount, StageName
         FROM Opportunities
         WHERE IsClosed = false
         ORDER BY Amount DESC
         LIMIT 3)
    FROM Account
    WHERE Industry = 'Retail'
      AND Id IN (SELECT AccountId FROM Opportunity WHERE IsClosed = false)
];

for (Account a : pipeline) {
    System.debug(a.Name + ' · ' + a.Owner.Name);
    for (Opportunity o : a.Opportunities) {
        System.debug('   ' + o.Name + ' · ' + o.Amount + ' · ' + o.StageName);
    }
}

List<Account> noPipeline = [
    SELECT Id, Name
    FROM Account
    WHERE Industry = 'Retail'
      AND Id NOT IN (SELECT AccountId FROM Opportunity)
];
Integer toAssign = noPipeline.size();`,
      en: `List<Account> pipeline = [
    SELECT Id, Name, Owner.Name,
        (SELECT Name, Amount, StageName
         FROM Opportunities
         WHERE IsClosed = false
         ORDER BY Amount DESC
         LIMIT 3)
    FROM Account
    WHERE Industry = 'Retail'
      AND Id IN (SELECT AccountId FROM Opportunity WHERE IsClosed = false)
];

for (Account a : pipeline) {
    System.debug(a.Name + ' · ' + a.Owner.Name);
    for (Opportunity o : a.Opportunities) {
        System.debug('   ' + o.Name + ' · ' + o.Amount + ' · ' + o.StageName);
    }
}

List<Account> noPipeline = [
    SELECT Id, Name
    FROM Account
    WHERE Industry = 'Retail'
      AND Id NOT IN (SELECT AccountId FROM Opportunity)
];
Integer toAssign = noPipeline.size();`,
    },
    checks: [
      {
        id: "l08-c1",
        label: {
          es: "pipeline trae el propietario subiendo al padre",
          en: "pipeline brings the owner by going up to the parent",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "List\\s*<\\s*Account\\s*>\\s+pipeline\\s*=\\s*\\[" },
            { op: "match", pattern: "Owner\\s*\\.\\s*Name" },
          ],
        },
        onFail: {
          es: "El propietario es el padre de la cuenta: se sube con un punto, Owner.Name, dentro del SELECT de pipeline.",
          en: "The owner is the account's parent: you go up with a dot, Owner.Name, in pipeline's SELECT.",
        },
      },
      {
        id: "l08-c2",
        label: {
          es: "La subconsulta trae las tres oportunidades mayores de cada cuenta",
          en: "The subquery brings each account's three largest opportunities",
        },
        rule: {
          op: "match",
          pattern: "\\(\\s*SELECT[^()]*FROM\\s+Opportunities\\b[^()]*ORDER\\s+BY\\s+Amount\\s+DESC[^()]*LIMIT\\s+3\\s*\\)",
        },
        onFail: {
          es: "Dentro de los paréntesis: FROM Opportunities (el nombre de la relación, en plural), ORDER BY Amount DESC y LIMIT 3. Ese LIMIT se aplica a cada cuenta por separado, que es justo lo que pide Ventas.",
          en: "Inside the brackets: FROM Opportunities (the relationship name, plural), ORDER BY Amount DESC and LIMIT 3. That LIMIT applies to each account separately, which is exactly what Sales asks for.",
        },
        onPass: {
          es: "LIMIT dentro de la subconsulta = como mucho tres POR CUENTA, no tres en total.",
          en: "LIMIT inside the subquery = at most three PER ACCOUNT, not three in total.",
        },
      },
      {
        id: "l08-c3",
        label: {
          es: "Solo entran cuentas con negocio abierto (IN en el WHERE de fuera)",
          en: "Only accounts with open business get in (IN in the outer WHERE)",
        },
        rule: {
          op: "match",
          pattern: "\\bId\\s+IN\\s*\\(\\s*SELECT\\s+AccountId\\s+FROM\\s+Opportunity\\s+WHERE\\s+IsClosed\\s*=\\s*false\\s*\\)",
        },
        onFail: {
          es: "El WHERE de la subconsulta del SELECT no quita cuentas: una cuenta sin oportunidades abiertas saldría igualmente, con la lista vacía. Para dejarla fuera hace falta Id IN (SELECT AccountId FROM Opportunity WHERE IsClosed = false) en el WHERE de fuera.",
          en: "The SELECT subquery's WHERE removes no accounts: an account with no open opportunities would still come back, with an empty list. Keeping it out takes Id IN (SELECT AccountId FROM Opportunity WHERE IsClosed = false) in the outer WHERE.",
        },
        onPass: {
          es: "Ese es el punto difícil del ejercicio: IsClosed = false aparece dos veces porque son dos filtros distintos —qué cuentas entran y qué oportunidades viajan con ellas—.",
          en: "That is the hard part of the exercise: IsClosed = false appears twice because they are two different filters — which accounts get in, and which opportunities travel with them.",
        },
      },
      {
        id: "l08-c4",
        label: {
          es: "Las dos listas se quedan en Retail",
          en: "Both lists stay in Retail",
        },
        rule: {
          op: "count",
          pattern: "Industry\\s*=\\s*'Retail'",
          min: 2,
        },
        onFail: {
          es: "Cada consulta tiene su propio WHERE: las dos necesitan Industry = 'Retail'. Si la segunda no lo lleva, prospección recibiría cuentas de toda la org.",
          en: "Each query has its own WHERE: both need Industry = 'Retail'. If the second lacks it, prospecting would receive accounts from the whole org.",
        },
      },
      {
        id: "l08-c5",
        label: {
          es: "Recorre las cuentas y, dentro, sus oportunidades",
          en: "Loops the accounts and, inside, their opportunities",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "for\\s*\\(\\s*Account\\s+(\\w+)\\s*:\\s*pipeline\\s*\\)" },
            { op: "match", pattern: "for\\s*\\(\\s*Opportunity\\s+\\w+\\s*:\\s*\\w+\\s*\\.\\s*Opportunities\\s*\\)" },
          ],
        },
        onFail: {
          es: "Un for por las cuentas de pipeline y, dentro, otro por a.Opportunities: los hijos viajan en una propiedad con el nombre de la relación.",
          en: "One for over pipeline's accounts and, inside, another over a.Opportunities: the children travel in a property named after the relationship.",
        },
      },
      {
        id: "l08-c6",
        label: {
          es: "noPipeline usa NOT IN contra todas las oportunidades",
          en: "noPipeline uses NOT IN against every opportunity",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "List\\s*<\\s*Account\\s*>\\s+noPipeline\\s*=\\s*\\[" },
            { op: "match", pattern: "\\bId\\s+NOT\\s+IN\\s*\\(\\s*SELECT\\s+AccountId\\s+FROM\\s+Opportunity\\s*\\)" },
          ],
        },
        onFail: {
          es: "«Nunca ha tenido una oportunidad» es el filtro cruzado SIN: Id NOT IN (SELECT AccountId FROM Opportunity). Sin filtro dentro: si le pones IsClosed = false, entrarían cuentas que sí tuvieron negocio, aunque ya esté cerrado.",
          en: "“Never had an opportunity” is the WITHOUT cross filter: Id NOT IN (SELECT AccountId FROM Opportunity). With no filter inside: add IsClosed = false and accounts that did have business, now closed, would get in.",
        },
      },
      {
        id: "l08-c7",
        label: {
          es: "toAssign se calcula con size()",
          en: "toAssign is computed with size()",
        },
        rule: {
          op: "match",
          pattern: "Integer\\s+toAssign\\s*=\\s*noPipeline\\s*\\.\\s*size\\s*\\(\\s*\\)",
        },
        onFail: {
          es: "Cuántas hay en una lista lo dice size(), y es un Integer.",
          en: "How many a list holds is size(), and it is an Integer.",
        },
      },
      {
        id: "l08-c8",
        label: {
          es: "Exactamente dos consultas: ninguna dentro del bucle",
          en: "Exactly two queries: none inside the loop",
        },
        rule: {
          op: "count",
          pattern: "\\[\\s*SELECT\\b",
          min: 2,
          max: 2,
        },
        onFail: {
          es: "Ventas pidió dos listas y hacen falta dos consultas. Si hay más, lo normal es que una esté dentro del bucle, preguntando por las oportunidades de cada cuenta: eso es exactamente lo que la subconsulta evita, y con 200 cuentas revienta el límite de 100 consultas.",
          en: "Sales asked for two lists and two queries are needed. If there are more, usually one sits inside the loop asking for each account's opportunities: exactly what the subquery avoids, and with 200 accounts it blows the 100-query limit.",
        },
      },
    ],
    rubric: [
      {
        es: "Si mañana Ventas pide además «y que no tengan ningún caso abierto», ¿cabe en la primera consulta? Cuenta cuántos IN y NOT IN llevarías y compáralo con el límite.",
        en: "If tomorrow Sales also asks “and with no open cases”, does it fit in the first query? Count how many IN and NOT IN you would carry and compare it with the limit.",
      },
      {
        es: "Tarea 5: Soporte también entra en la revisión, y su buscador de casos tiene un agujero de seguridad que hay que cerrar.",
        en: "Task 5: Support joins the review too, and its case search has a security hole to close.",
      },
    ],
  },
};
