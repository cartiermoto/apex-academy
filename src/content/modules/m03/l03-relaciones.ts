import type { Lesson } from "@/lib/types";

export const l03Relaciones: Lesson = {
  id: "m03-l03",
  slug: "consultas-de-relacion",
  n: 3,
  kind: "lesson",
  minutes: 30,
  title: {
    es: "Consultas de relación (padre e hijo)",
    en: "Relationship queries (parent and child)",
  },
  summary: {
    es: "Subir al padre con un punto, bajar a los hijos con una subconsulta: una sola consulta trae la cuenta, su propietario y todos sus contactos.",
    en: "Go up to the parent with a dot, down to the children with a subquery: one query brings the account, its owner and all its contacts.",
  },
  analogy: {
    es: "Una fórmula entre objetos hacia arriba, una related list hacia abajo",
    en: "A cross-object formula going up, a related list going down",
  },
  objectives: [
    {
      es: "Leer campos del registro padre con la notación de punto (Account.Name, Owner.Email).",
      en: "Read parent-record fields with dot notation (Account.Name, Owner.Email).",
    },
    {
      es: "Traer los registros hijos con una subconsulta y recorrerlos con un bucle anidado.",
      en: "Bring back child records with a subquery and loop them with a nested loop.",
    },
    {
      es: "Distinguir el campo __c del nombre de relación __r en objetos personalizados.",
      en: "Tell the __c field apart from the __r relationship name on custom objects.",
    },
    {
      es: "Filtrar por los hijos con IN (SELECT ...), como el filtro cruzado de un informe.",
      en: "Filter by children with IN (SELECT ...), like a report's cross filter.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Los datos de Salesforce no viven sueltos: un contacto pertenece a una cuenta, una oportunidad tiene propietario, una factura tiene líneas. Como Admin ya diseñaste esas relaciones con campos de búsqueda y maestro-detalle. Esta lección enseña a recorrerlas desde una consulta, en las dos direcciones.",
        en: "Salesforce data does not live on its own: a contact belongs to an account, an opportunity has an owner, an invoice has lines. As an Admin you already designed those relationships with lookup and master-detail fields. This lesson teaches you to walk them from a query, in both directions.",
      },
    },
    {
      type: "diagram",
      id: "m03-relationships",
      caption: {
        es: "Hacia el padre, un punto. Hacia los hijos, una consulta dentro de la consulta.",
        en: "Towards the parent, a dot. Towards the children, a query inside the query.",
      },
    },
    {
      type: "h",
      text: { es: "Hacia arriba: del hijo al padre", en: "Upwards: from child to parent" },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Cuando creas una fórmula en Contacto que muestra el sector de su cuenta, escribes Account.Industry. Con un punto subes por el campo de búsqueda hasta el padre. En SOQL es exactamente el mismo punto, y funciona igual: puedes subir hasta cinco niveles, como en Account.Owner.Manager.Name.",
        en: "When you build a formula on Contact that shows its account's industry, you write Account.Industry. With a dot you climb the lookup field up to the parent. In SOQL it is exactly the same dot, and it works the same way: you can climb up to five levels, as in Account.Owner.Manager.Name.",
      },
    },
    {
      type: "code",
      code: {
        es: `List<Contact> contacts = [
    SELECT Id, LastName, Email,
           Account.Name, Account.Industry,
           Owner.Name
    FROM Contact
    WHERE Account.Industry = 'Retail'
];

for (Contact c : contacts) {
    System.debug(c.LastName + ' trabaja en ' + c.Account.Name);
}`,
        en: `List<Contact> contacts = [
    SELECT Id, LastName, Email,
           Account.Name, Account.Industry,
           Owner.Name
    FROM Contact
    WHERE Account.Industry = 'Retail'
];

for (Contact c : contacts) {
    System.debug(c.LastName + ' works at ' + c.Account.Name);
}`,
      },
      caption: {
        es: "Puedes pedir campos del padre en el SELECT y también filtrar por ellos en el WHERE, como un filtro de informe sobre un campo de la cuenta.",
        en: "You can ask for parent fields in the SELECT and also filter on them in the WHERE, like a report filter on an account field.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "El padre puede no existir", en: "The parent may not exist" },
      text: {
        es: "Un contacto sin cuenta es legal en Salesforce. En ese caso c.Account es null, y c.Account.Name lanza NullPointerException. Si puede faltar, usa el operador seguro del Módulo 1: c.Account?.Name.",
        en: "A contact with no account is legal in Salesforce. In that case c.Account is null, and c.Account.Name throws NullPointerException. If it may be missing, use the safe operator from Module 1: c.Account?.Name.",
      },
    },
    {
      type: "h",
      text: { es: "__c o __r: el campo o el camino", en: "__c or __r: the field or the path" },
    },
    {
      type: "p",
      text: {
        es: "En objetos estándar el nombre de la relación coincide con el del campo sin «Id»: AccountId guarda el Id, Account es el camino. En objetos personalizados la regla es la misma con otro sufijo: el campo de búsqueda Customer__c guarda el Id de la cuenta, y Customer__r es el camino para subir a ella.",
        en: "On standard objects the relationship name matches the field name without “Id”: AccountId stores the Id, Account is the path. On custom objects the rule is the same with another suffix: the lookup field Customer__c stores the account's Id, and Customer__r is the path to climb to it.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Quieres…", en: "You want…" },
        { es: "Estándar (Contact → Account)", en: "Standard (Contact → Account)" },
        { es: "Personalizado (Invoice__c → Account)", en: "Custom (Invoice__c → Account)" },
      ],
      rows: [
        [
          { es: "el Id del padre", en: "the parent's Id" },
          { es: "AccountId", en: "AccountId" },
          { es: "Customer__c", en: "Customer__c" },
        ],
        [
          { es: "un campo del padre", en: "a parent field" },
          { es: "Account.Name", en: "Account.Name" },
          { es: "Customer__r.Name", en: "Customer__r.Name" },
        ],
      ],
    },
    {
      type: "h",
      text: { es: "Hacia abajo: del padre a los hijos", en: "Downwards: from parent to children" },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "En la página de una cuenta, la related list de Contactos te enseña todos sus hijos debajo del registro. Una subconsulta hace lo mismo: dentro del SELECT de la cuenta, entre paréntesis, pides los contactos, y cada cuenta llega con su propia lista de contactos colgando.",
        en: "On an account page, the Contacts related list shows all its children under the record. A subquery does the same: inside the account's SELECT, in brackets, you ask for the contacts, and each account arrives with its own list of contacts attached.",
      },
    },
    {
      type: "code",
      code: {
        es: `List<Account> accounts = [
    SELECT Id, Name,
           (SELECT Id, LastName, Email FROM Contacts ORDER BY LastName)
    FROM Account
    WHERE Industry = 'Retail'
];

for (Account a : accounts) {
    System.debug(a.Name + ' tiene ' + a.Contacts.size() + ' contactos');
    for (Contact c : a.Contacts) {
        System.debug('   · ' + c.LastName);
    }
}`,
        en: `List<Account> accounts = [
    SELECT Id, Name,
           (SELECT Id, LastName, Email FROM Contacts ORDER BY LastName)
    FROM Account
    WHERE Industry = 'Retail'
];

for (Account a : accounts) {
    System.debug(a.Name + ' has ' + a.Contacts.size() + ' contacts');
    for (Contact c : a.Contacts) {
        System.debug('   · ' + c.LastName);
    }
}`,
      },
      caption: {
        es: "a.Contacts es una List<Contact>. Recorrer padres y, dentro, sus hijos es el bucle anidado del Módulo 2, pero aquí sí está justificado: cada interior solo recorre los hijos de esa cuenta.",
        en: "a.Contacts is a List<Contact>. Looping parents and, inside, their children is the nested loop from Module 2, but here it is justified: each inner loop only walks that account's children.",
      },
    },
    {
      type: "list",
      items: [
        {
          es: "En el FROM de la [[subconsulta]] no va el nombre del objeto (Contact) sino el nombre de la relación hija, en plural: Contacts, Opportunities, Cases.",
          en: "The [[subconsulta|subquery]]'s FROM does not take the object name (Contact) but the child relationship name, in plural: Contacts, Opportunities, Cases.",
        },
        {
          es: "En objetos personalizados es el «Child Relationship Name» que pusiste al crear la búsqueda, con __r: (SELECT Id FROM Invoices__r).",
          en: "On custom objects it is the “Child Relationship Name” you set when creating the lookup, with __r: (SELECT Id FROM Invoices__r).",
        },
        {
          es: "La subconsulta admite su propio WHERE, ORDER BY y LIMIT, como el filtro y el orden de una related list.",
          en: "The subquery takes its own WHERE, ORDER BY and LIMIT, like a related list's filter and sort.",
        },
        {
          es: "Una cuenta sin contactos llega con a.Contacts vacía, no null: puedes recorrerla sin miedo.",
          en: "An account with no contacts arrives with an empty a.Contacts, not null: you can loop it without fear.",
        },
      ],
    },
    {
      type: "h",
      text: { es: "Filtrar por los hijos: el filtro cruzado", en: "Filtering by children: the cross filter" },
    },
    {
      type: "p",
      text: {
        es: "En los informes existe el filtro cruzado: «Cuentas con Oportunidades» o «Cuentas sin Casos». En SOQL se escribe con IN o NOT IN y una consulta que devuelve Ids. Es distinto de la subconsulta del SELECT: aquella trae los hijos; esta solo los usa para decidir qué padres entran.",
        en: "Reports have cross filters: “Accounts with Opportunities” or “Accounts without Cases”. In SOQL you write it with IN or NOT IN and a query that returns Ids. It is different from the subquery in the SELECT: that one brings the children; this one only uses them to decide which parents get in.",
      },
    },
    {
      type: "code",
      code: {
        es: `// Cuentas CON al menos una oportunidad ganada
[SELECT Id, Name FROM Account
 WHERE Id IN (SELECT AccountId FROM Opportunity WHERE IsWon = true)]

// Cuentas SIN ningún caso
[SELECT Id, Name FROM Account
 WHERE Id NOT IN (SELECT AccountId FROM Case)]`,
        en: `// Accounts WITH at least one won opportunity
[SELECT Id, Name FROM Account
 WHERE Id IN (SELECT AccountId FROM Opportunity WHERE IsWon = true)]

// Accounts WITHOUT any case
[SELECT Id, Name FROM Account
 WHERE Id NOT IN (SELECT AccountId FROM Case)]`,
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "El formulario de facturas del libro busca el cliente con una consulta, y luego, cada vez que pulsas «Agregar», abre otra conexión y lanza otra consulta para cada producto. En SQL clásico, unir tablas se hace con JOIN; en SOQL no existe JOIN. En su lugar, recorres las relaciones que ya definiste en Object Manager: el punto hacia el padre y la subconsulta hacia los hijos. Una factura con todas sus líneas y el nombre del cliente sale en una sola consulta: [SELECT Name, Customer__r.Name, (SELECT Product__r.Name, Quantity__c FROM Lines__r) FROM Invoice__c WHERE Id = :invoiceId]. Una consulta en lugar de una por línea: en el Módulo 4 verás por qué eso es cuestión de supervivencia.",
        en: "The book's invoice form finds the customer with one query, and then, every time you press “Add”, opens another connection and fires another query for each product. In classic SQL, joining tables is done with JOIN; SOQL has no JOIN. Instead, you walk the relationships you already defined in Object Manager: the dot towards the parent and the subquery towards the children. An invoice with all its lines and the customer's name comes out of a single query: [SELECT Name, Customer__r.Name, (SELECT Product__r.Name, Quantity__c FROM Lines__r) FROM Invoice__c WHERE Id = :invoiceId]. One query instead of one per line: in Module 4 you will see why that is a matter of survival.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: desde Opportunity, ¿cómo pides el sector de su cuenta? Desde Account, ¿qué escribes en el FROM de la subconsulta para traer sus oportunidades? ¿Qué sufijo usa un camino personalizado?",
        en: "Without looking: from Opportunity, how do you ask for its account's industry? From Account, what goes in the subquery's FROM to bring its opportunities? What suffix does a custom path use?",
      },
    },
  ],

  quiz: [
    {
      id: "m03-l03-q1",
      kind: "single",
      prompt: {
        es: "Desde una consulta a Opportunity, ¿cómo pides el nombre del propietario de su cuenta?",
        en: "From a query on Opportunity, how do you ask for the name of its account's owner?",
      },
      options: [
        { es: "Account.Owner.Name", en: "Account.Owner.Name" },
        { es: "AccountId.OwnerId.Name", en: "AccountId.OwnerId.Name" },
        { es: "(SELECT Name FROM Owner)", en: "(SELECT Name FROM Owner)" },
        { es: "Owner.Account.Name", en: "Owner.Account.Name" },
      ],
      answer: 0,
      explain: {
        es: "Subes de Opportunity a Account y de Account a su Owner: dos puntos, dos niveles. Los campos Id (AccountId) guardan el valor; el camino es sin «Id».",
        en: "You climb from Opportunity to Account and from Account to its Owner: two dots, two levels. The Id fields (AccountId) store the value; the path is without “Id”.",
      },
      tags: ["recall"],
    },
    {
      id: "m03-l03-q2",
      kind: "single",
      prompt: {
        es: "Esta subconsulta no compila. ¿Por qué?",
        en: "This subquery does not compile. Why?",
      },
      code: {
        es: `[SELECT Name, (SELECT LastName FROM Contact) FROM Account]`,
        en: `[SELECT Name, (SELECT LastName FROM Contact) FROM Account]`,
      },
      options: [
        {
          es: "Dentro de la subconsulta va el nombre de la relación en plural: Contacts.",
          en: "Inside the subquery goes the relationship name in plural: Contacts.",
        },
        { es: "Las subconsultas no pueden pedir LastName.", en: "Subqueries cannot ask for LastName." },
        { es: "Falta un WHERE en la subconsulta.", en: "The subquery is missing a WHERE." },
      ],
      answer: 0,
      explain: {
        es: "Contact es el objeto; Contacts es la relación de la cuenta hacia sus contactos, el nombre de la related list.",
        en: "Contact is the object; Contacts is the account's relationship to its contacts, the related list's name.",
      },
      tags: ["find-error"],
    },
    {
      id: "m03-l03-q3",
      kind: "single",
      prompt: {
        es: "Invoice__c tiene un campo de búsqueda Customer__c hacia Account. ¿Cómo pides el nombre del cliente?",
        en: "Invoice__c has a lookup field Customer__c to Account. How do you ask for the customer's name?",
      },
      options: [
        { es: "Customer__r.Name", en: "Customer__r.Name" },
        { es: "Customer__c.Name", en: "Customer__c.Name" },
        { es: "Account.Name", en: "Account.Name" },
      ],
      answer: 0,
      explain: {
        es: "Customer__c guarda el Id; Customer__r es el camino hasta el registro. El nombre del objeto padre (Account) no se usa aquí: se usa el de la relación.",
        en: "Customer__c stores the Id; Customer__r is the path to the record. The parent object's name (Account) is not used here: the relationship's name is.",
      },
      tags: ["recall"],
    },
    {
      id: "m03-l03-q4",
      kind: "single",
      prompt: {
        es: "¿Qué muestra este código para una cuenta que no tiene ningún contacto?",
        en: "What does this code print for an account with no contacts?",
      },
      code: {
        es: `Account a = [SELECT Name, (SELECT Id FROM Contacts)
             FROM Account WHERE Name = 'Solo' LIMIT 1];
System.debug(a.Contacts.size());`,
        en: `Account a = [SELECT Name, (SELECT Id FROM Contacts)
             FROM Account WHERE Name = 'Solo' LIMIT 1];
System.debug(a.Contacts.size());`,
      },
      options: [
        { es: "0", en: "0" },
        { es: "null", en: "null" },
        { es: "NullPointerException", en: "NullPointerException" },
      ],
      answer: 0,
      explain: {
        es: "Los hijos de una subconsulta siempre llegan como lista, aunque sea vacía. Vacía no es null: lo viste con las colecciones.",
        en: "A subquery's children always arrive as a list, even an empty one. Empty is not null: you saw it with collections.",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M1 L8", en: "Review · M1 L8" },
    },
    {
      id: "m03-l03-q5",
      kind: "single",
      prompt: {
        es: "Marketing quiere las cuentas que NO tienen ninguna oportunidad, para una campaña de captación. ¿Cuál es la MEJOR consulta?",
        en: "Marketing wants the accounts that have NO opportunity at all, for an acquisition campaign. Which is the BEST query?",
      },
      options: [
        {
          es: "WHERE Id NOT IN (SELECT AccountId FROM Opportunity)",
          en: "WHERE Id NOT IN (SELECT AccountId FROM Opportunity)",
        },
        {
          es: "Traer todas las cuentas con (SELECT Id FROM Opportunities) y quedarte en Apex con las que tienen la lista vacía",
          en: "Bring all accounts with (SELECT Id FROM Opportunities) and keep in Apex the ones with an empty list",
        },
        {
          es: "WHERE Opportunities = null",
          en: "WHERE Opportunities = null",
        },
      ],
      answer: 0,
      explain: {
        es: "Es el filtro cruzado «Cuentas sin Oportunidades»: la base de datos decide y solo viajan las cuentas que buscas. La segunda funciona pero trae todas las cuentas y sus hijos; la tercera no es SOQL válido.",
        en: "It is the “Accounts without Opportunities” cross filter: the database decides and only the accounts you want travel. The second works but brings every account and its children; the third is not valid SOQL.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m03-l03-q6",
      kind: "multi",
      prompt: {
        es: "¿Qué afirmaciones son ciertas?",
        en: "Which statements are true?",
      },
      options: [
        {
          es: "Puedes filtrar por un campo del padre: WHERE Account.Industry = 'Retail'.",
          en: "You can filter on a parent field: WHERE Account.Industry = 'Retail'.",
        },
        { es: "SOQL tiene JOIN como SQL.", en: "SOQL has JOIN like SQL." },
        {
          es: "La subconsulta puede tener su propio ORDER BY.",
          en: "The subquery can have its own ORDER BY.",
        },
        {
          es: "c.Account.Name es seguro aunque el contacto no tenga cuenta.",
          en: "c.Account.Name is safe even if the contact has no account.",
        },
      ],
      answers: [0, 2],
      explain: {
        es: "No hay JOIN: recorres relaciones. Y si el padre falta, c.Account es null: usa c.Account?.Name.",
        en: "There is no JOIN: you walk relationships. And if the parent is missing, c.Account is null: use c.Account?.Name.",
      },
      tags: ["interleaving", "spaced"],
      from: { es: "Repaso · M1 L6", en: "Review · M1 L6" },
    },
  ],

  exercise: {
    prompt: {
      es: "El responsable de cuentas de Retail quiere, antes de su ronda de visitas, cada cuenta de Retail con su propietario y la lista de sus contactos ordenada por apellido. Escríbelo con una sola consulta.",
      en: "The Retail account manager wants, before their round of visits, each Retail account with its owner and its list of contacts sorted by last name. Write it with a single query.",
    },
    brief: [
      {
        es: "Una List<Account> llamada accounts con Id, Name y el nombre del propietario (Owner).",
        en: "A List<Account> called accounts with Id, Name and the owner's name (Owner).",
      },
      {
        es: "Dentro de la misma consulta, los contactos de cada cuenta con LastName y Email, ordenados por apellido.",
        en: "Inside the same query, each account's contacts with LastName and Email, sorted by last name.",
      },
      {
        es: "Solo cuentas cuyo Industry sea 'Retail'.",
        en: "Only accounts whose Industry is 'Retail'.",
      },
      {
        es: "Recorre las cuentas mostrando nombre y propietario, y dentro, cada contacto.",
        en: "Loop the accounts showing name and owner, and inside, each contact.",
      },
    ],
    starter: {
      es: `List<Account> accounts = [
    SELECT Id, Name
    FROM Account
];

for (Account a : accounts) {

}
`,
      en: `List<Account> accounts = [
    SELECT Id, Name
    FROM Account
];

for (Account a : accounts) {

}
`,
    },
    hints: [
      {
        es: "Dos direcciones en una consulta: hacia el propietario (un punto) y hacia los contactos (una subconsulta en el SELECT).",
        en: "Two directions in one query: towards the owner (a dot) and towards the contacts (a subquery in the SELECT).",
      },
      {
        es: "La subconsulta va entre paréntesis y su FROM usa el nombre de la relación: Contacts. Dentro del for de cuentas, otro for recorre a.Contacts.",
        en: "The subquery goes in brackets and its FROM uses the relationship name: Contacts. Inside the accounts for, another for walks a.Contacts.",
      },
      {
        es: "Pseudocódigo: SELECT Id, Name, Owner.Name, (SELECT LastName, Email FROM Contacts ORDER BY LastName) FROM Account WHERE Industry = 'Retail' — luego for (Contact c : a.Contacts) { ... }",
        en: "Pseudocode: SELECT Id, Name, Owner.Name, (SELECT LastName, Email FROM Contacts ORDER BY LastName) FROM Account WHERE Industry = 'Retail' — then for (Contact c : a.Contacts) { ... }",
      },
    ],
    solution: {
      es: `List<Account> accounts = [
    SELECT Id, Name, Owner.Name,
           (SELECT LastName, Email FROM Contacts ORDER BY LastName)
    FROM Account
    WHERE Industry = 'Retail'
];

for (Account a : accounts) {
    System.debug(a.Name + ' · propietario: ' + a.Owner.Name);
    for (Contact c : a.Contacts) {
        System.debug('   · ' + c.LastName + ' <' + c.Email + '>');
    }
}`,
      en: `List<Account> accounts = [
    SELECT Id, Name, Owner.Name,
           (SELECT LastName, Email FROM Contacts ORDER BY LastName)
    FROM Account
    WHERE Industry = 'Retail'
];

for (Account a : accounts) {
    System.debug(a.Name + ' · owner: ' + a.Owner.Name);
    for (Contact c : a.Contacts) {
        System.debug('   · ' + c.LastName + ' <' + c.Email + '>');
    }
}`,
    },
    checks: [
      {
        id: "m03-l03-c1",
        label: {
          es: "Pide el nombre del propietario con Owner.Name",
          en: "Asks for the owner's name with Owner.Name",
        },
        rule: { op: "match", pattern: "SELECT[^\\]]*\\bOwner\\.Name\\b[^\\]]*FROM\\s+Account\\b" },
        onFail: {
          es: "Sube al propietario con un punto en el SELECT: Owner.Name.",
          en: "Climb to the owner with a dot in the SELECT: Owner.Name.",
        },
      },
      {
        id: "m03-l03-c2",
        label: {
          es: "Una subconsulta trae LastName y Email de Contacts",
          en: "A subquery brings LastName and Email from Contacts",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "\\(\\s*SELECT[^)]*\\bLastName\\b[^)]*FROM\\s+Contacts\\b" },
            { op: "match", pattern: "\\(\\s*SELECT[^)]*\\bEmail\\b[^)]*FROM\\s+Contacts\\b" },
          ],
        },
        onFail: {
          es: "Dentro del SELECT: (SELECT LastName, Email FROM Contacts ...). Ojo: Contacts, en plural.",
          en: "Inside the SELECT: (SELECT LastName, Email FROM Contacts ...). Careful: Contacts, plural.",
        },
      },
      {
        id: "m03-l03-c3",
        label: {
          es: "Los contactos van ordenados por apellido",
          en: "Contacts are sorted by last name",
        },
        rule: { op: "match", pattern: "FROM\\s+Contacts\\s+ORDER\\s+BY\\s+LastName\\b" },
        onFail: {
          es: "El orden de la related list va dentro de la subconsulta: FROM Contacts ORDER BY LastName.",
          en: "The related list's sort goes inside the subquery: FROM Contacts ORDER BY LastName.",
        },
      },
      {
        id: "m03-l03-c4",
        label: {
          es: "Filtra las cuentas de Retail",
          en: "Filters Retail accounts",
        },
        rule: { op: "match", pattern: "FROM\\s+Account\\s+WHERE\\s+Industry\\s*=\\s*'Retail'" },
        onFail: {
          es: "Después de FROM Account: WHERE Industry = 'Retail'.",
          en: "After FROM Account: WHERE Industry = 'Retail'.",
        },
      },
      {
        id: "m03-l03-c5",
        label: {
          es: "Un bucle anidado recorre a.Contacts",
          en: "A nested loop walks a.Contacts",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "for\\s*\\(\\s*Contact\\s+\\w+\\s*:\\s*\\w+\\.Contacts\\s*\\)" },
            { op: "match", pattern: "System\\.debug\\([^;]*\\.Owner\\.Name\\b[^;]*\\)" },
          ],
        },
        onFail: {
          es: "Muestra a.Owner.Name en el for de cuentas, y dentro recorre for (Contact c : a.Contacts).",
          en: "Show a.Owner.Name in the accounts loop, and inside walk for (Contact c : a.Contacts).",
        },
        onPass: {
          es: "Una consulta, tres niveles de información: cuenta, propietario y contactos. Así piensa SOQL.",
          en: "One query, three levels of information: account, owner and contacts. That is how SOQL thinks.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Cuántas consultas harías si trajeras las cuentas primero y luego, dentro del bucle, los contactos de cada una? ¿Qué pasaría con 150 cuentas?",
        en: "How many queries would you run if you fetched the accounts first and then, inside the loop, each one's contacts? What would happen with 150 accounts?",
      },
    ],
  },
};
