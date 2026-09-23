import type { Lesson } from "@/lib/types";

export const l07Anidados: Lesson = {
  id: "m02-l07",
  slug: "loops-anidados",
  n: 7,
  kind: "lesson",
  minutes: 22,
  title: { es: "Loops Anidados", en: "Nested Loops" },
  summary: {
    es: "Un bucle dentro de otro multiplica las vueltas. Aprende a leerlo, a reconocer cuándo sobra y a sustituirlo por una búsqueda en un Set o un Map.",
    en: "A loop inside another multiplies the passes. Learn to read one, to spot when it is unnecessary, and to replace it with a lookup in a Set or a Map.",
  },
  analogy: {
    es: "Cruzar dos informes a mano frente a hacer un BUSCARV",
    en: "Cross-checking two reports by hand versus doing a VLOOKUP",
  },
  objectives: [
    {
      es: "Predecir cuántas vueltas hace un bucle anidado y qué hacen break y continue dentro de él.",
      en: "Predict how many passes a nested loop makes and what break and continue do inside it.",
    },
    {
      es: "Reconocer el anidado que solo sirve para buscar coincidencias.",
      en: "Recognise the nesting that exists only to look for matches.",
    },
    {
      es: "Sustituirlo por dos bucles seguidos y un Set o Map intermedio.",
      en: "Replace it with two loops in a row and a Set or Map in between.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Tarde o temprano tendrás dos listas y una pregunta que las cruza: ¿qué leads son de empresas que ya son clientes?, ¿qué contactos pertenecen a estas cuentas? La primera solución que se le ocurre a todo el mundo es un bucle dentro de otro. Funciona. Y con volumen real, es la que tumba la transacción.",
        en: "Sooner or later you will have two lists and a question that crosses them: which leads come from companies that are already customers? which contacts belong to these accounts? The first solution everyone thinks of is a loop inside another. It works. And with real volume, it is the one that brings the transaction down.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Exportas dos informes a Excel y quieres marcar los leads cuya empresa aparece en la lista de clientes. Puedes coger cada lead y bajar con el dedo por toda la lista de clientes: eso es un bucle anidado. O puedes hacer un BUSCARV, que va directo a la fila. En Apex, el BUSCARV es un Set o un Map.",
        en: "You export two reports to Excel and want to flag the leads whose company appears in the customer list. You can take each lead and run your finger down the entire customer list: that is a nested loop. Or you can do a VLOOKUP, which goes straight to the row. In Apex, the VLOOKUP is a Set or a Map.",
      },
    },
    {
      type: "h",
      text: { es: "Cómo se lee un bucle anidado", en: "How to read a nested loop" },
    },
    {
      type: "p",
      text: {
        es: "El bucle de fuera avanza una vez; el de dentro da todas sus vueltas; el de fuera avanza otra vez; el de dentro vuelve a empezar desde cero. Por eso las vueltas se multiplican: 3 de fuera × 4 de dentro son 12 ejecuciones del cuerpo interior.",
        en: "The outer loop advances once; the inner one makes all its passes; the outer one advances again; the inner one starts again from zero. That is why the passes multiply: 3 outer × 4 inner is 12 runs of the inner body.",
      },
    },
    {
      type: "code",
      code: {
        es: `for (Integer week = 1; week <= 3; week++) {
    for (Integer day = 1; day <= 4; day++) {
        System.debug('Semana ' + week + ', día ' + day);
    }
}
// 12 líneas: semana 1 días 1-4, semana 2 días 1-4, semana 3 días 1-4`,
        en: `for (Integer week = 1; week <= 3; week++) {
    for (Integer day = 1; day <= 4; day++) {
        System.debug('Week ' + week + ', day ' + day);
    }
}
// 12 lines: week 1 days 1-4, week 2 days 1-4, week 3 days 1-4`,
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "break solo sale del bucle de dentro", en: "break only leaves the inner loop" },
      text: {
        es: "Lo avanzamos en la sub-lección anterior: un break dentro del bucle interior corta ese bucle, pero el exterior sigue con su siguiente vuelta y el interior vuelve a empezar. Si necesitas parar los dos, usa una variable Boolean y compruébala también en el de fuera.",
        en: "We previewed it in the last sub-lesson: a break inside the inner loop cuts that loop, but the outer one carries on with its next pass and the inner one starts again. If you need to stop both, use a Boolean variable and check it in the outer one too.",
      },
    },
    {
      type: "h",
      text: { es: "El problema: las vueltas se disparan", en: "The problem: the passes explode" },
    },
    {
      type: "p",
      text: {
        es: "Cruzar 200 leads con 200 cuentas mediante dos bucles anidados son 40.000 comparaciones. Con 2.000 cuentas, 400.000. Cada una consume [[cpu-time|tiempo de CPU]], y un [[trigger]] recibe hasta un [[lote]] de 200 registros de golpe. El código que en tu prueba con 3 registros iba perfecto es el que un día de carga masiva lanza «Apex CPU time limit exceeded».",
        en: "Crossing 200 leads with 200 accounts through two nested loops is 40,000 comparisons. With 2,000 accounts, 400,000. Each one burns [[cpu-time|CPU time]], and a [[trigger]] receives up to a [[lote|batch]] of 200 records at once. The code that ran perfectly in your 3-record test is the one that, on a mass-load day, throws “Apex CPU time limit exceeded”.",
      },
    },
    {
      type: "diagram",
      id: "m02-nested-vs-lookup",
      caption: {
        es: "Anidado: cada lead recorre todas las cuentas. Con un Set: se recorren las cuentas una vez y cada lead hace una sola pregunta.",
        en: "Nested: every lead walks through all the accounts. With a Set: the accounts are walked once and each lead asks a single question.",
      },
    },
    {
      type: "h",
      text: { es: "La solución: dos bucles seguidos y un BUSCARV", en: "The fix: two loops in a row and a VLOOKUP" },
    },
    {
      type: "p",
      text: {
        es: "En lugar de meter un bucle dentro de otro, pones uno detrás de otro. El primero recorre una lista y construye un Set (si solo necesitas saber «¿está?») o un Map (si además necesitas el registro). El segundo recorre la otra lista y, en cada vuelta, pregunta al Set o al Map con contains() o get(): una consulta directa, sin recorrer nada. 200 + 200 = 400 vueltas en vez de 40.000.",
        en: "Instead of putting one loop inside another, you put one after the other. The first walks one list and builds a Set (if you only need to know “is it there?”) or a Map (if you also need the record). The second walks the other list and, on each pass, asks the Set or Map with contains() or get(): a direct lookup, no walking. 200 + 200 = 400 passes instead of 40,000.",
      },
    },
    {
      type: "code",
      code: {
        es: `// ❌ Anidado: cuentas × leads comparaciones
for (Lead l : leads) {
    for (Account a : customers) {
        if (l.Company == a.Name) {
            l.Rating = 'Hot';
        }
    }
}

// ✅ Dos bucles seguidos: cuentas + leads vueltas
Set<String> customerNames = new Set<String>();
for (Account a : customers) {
    customerNames.add(a.Name);
}
for (Lead l : leads) {
    if (customerNames.contains(l.Company)) {
        l.Rating = 'Hot';
    }
}`,
        en: `// ❌ Nested: accounts × leads comparisons
for (Lead l : leads) {
    for (Account a : customers) {
        if (l.Company == a.Name) {
            l.Rating = 'Hot';
        }
    }
}

// ✅ Two loops in a row: accounts + leads passes
Set<String> customerNames = new Set<String>();
for (Account a : customers) {
    customerNames.add(a.Name);
}
for (Lead l : leads) {
    if (customerNames.contains(l.Company)) {
        l.Rating = 'Hot';
    }
}`,
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Set y Map sí distinguen mayúsculas", en: "Sets and Maps are case-sensitive" },
      text: {
        es: "A diferencia de ==, contains() y get() comparan textos exactos: 'ACME' no encuentra 'Acme'. Cuando las dos listas pueden venir escritas distinto, normaliza al guardar y al preguntar, por ejemplo con toUpperCase() en los dos sitios.",
        en: "Unlike ==, contains() and get() compare exact text: 'ACME' does not find 'Acme'. When the two lists may be written differently, normalise when storing and when asking, for example with toUpperCase() in both places.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "La regla que te acompañará todo el curso", en: "The rule that will follow you all course" },
      text: {
        es: "Dentro de un bucle, nada caro: ni otro bucle sobre una lista grande, ni —cuando las aprendas— una consulta [[soql|SOQL]] o una operación [[dml|DML]]. Esas dos tienen además un tope por transacción, los [[governor-limits|governor limits]]. El patrón siempre es el mismo: preparar antes del bucle, consultar un Set o Map dentro.",
        en: "Inside a loop, nothing expensive: no other loop over a big list, and — once you learn them — no [[soql|SOQL]] query or [[dml|DML]] operation. Those two also have a per-transaction cap, the [[governor-limits|governor limits]]. The pattern is always the same: prepare before the loop, look up a Set or Map inside.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿cuántas comparaciones hace un anidado de 150 × 300? ¿Y cuántas vueltas la versión con un Set?",
        en: "Without looking up: how many comparisons does a 150 × 300 nesting make? And how many passes does the Set version make?",
      },
    },
  ],

  quiz: [
    {
      id: "m02-l07-q1",
      kind: "single",
      prompt: {
        es: "¿Cuántas veces se ejecuta System.debug?",
        en: "How many times does System.debug run?",
      },
      code: {
        es: `for (Integer i = 0; i < 4; i++) {
    for (Integer j = 0; j < 5; j++) {
        System.debug(i + '-' + j);
    }
}`,
        en: `for (Integer i = 0; i < 4; i++) {
    for (Integer j = 0; j < 5; j++) {
        System.debug(i + '-' + j);
    }
}`,
      },
      options: [
        { es: "20", en: "20" },
        { es: "9", en: "9" },
        { es: "5", en: "5" },
        { es: "25", en: "25" },
      ],
      answer: 0,
      explain: {
        es: "4 vueltas de fuera × 5 de dentro = 20. Las vueltas se multiplican, no se suman.",
        en: "4 outer passes × 5 inner = 20. Passes multiply, they do not add up.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m02-l07-q2",
      kind: "single",
      prompt: {
        es: "¿Cuántas veces se ejecuta System.debug ahora?",
        en: "How many times does System.debug run now?",
      },
      code: {
        es: `for (Integer i = 0; i < 3; i++) {
    for (Integer j = 0; j < 5; j++) {
        if (j == 2) {
            break;
        }
        System.debug(i + '-' + j);
    }
}`,
        en: `for (Integer i = 0; i < 3; i++) {
    for (Integer j = 0; j < 5; j++) {
        if (j == 2) {
            break;
        }
        System.debug(i + '-' + j);
    }
}`,
      },
      options: [
        { es: "6", en: "6" },
        { es: "2", en: "2" },
        { es: "15", en: "15" },
        { es: "3", en: "3" },
      ],
      answer: 0,
      explain: {
        es: "break corta solo el bucle de dentro, en j = 2. En cada una de las 3 vueltas de fuera se muestran j = 0 y j = 1: 3 × 2 = 6.",
        en: "break only cuts the inner loop, at j = 2. On each of the 3 outer passes, j = 0 and j = 1 are printed: 3 × 2 = 6.",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M2 L6", en: "Review · M2 L6" },
    },
    {
      id: "m02-l07-q3",
      kind: "single",
      prompt: {
        es: "Un trigger cruza 200 contactos con 200 cuentas mediante dos bucles anidados. ¿Cuántas comparaciones hace?",
        en: "A trigger crosses 200 contacts with 200 accounts through two nested loops. How many comparisons does it make?",
      },
      options: [
        { es: "40.000", en: "40,000" },
        { es: "400", en: "400" },
        { es: "200", en: "200" },
        { es: "20.000", en: "20,000" },
      ],
      answer: 0,
      explain: {
        es: "200 × 200. La versión con un Map haría 200 + 200 = 400 vueltas.",
        en: "200 × 200. The Map version would make 200 + 200 = 400 passes.",
      },
    },
    {
      id: "m02-l07-q4",
      kind: "text",
      prompt: {
        es: "¿Qué método de Set responde «¿está este valor?» sin recorrer nada?",
        en: "Which Set method answers “is this value in here?” without walking anything?",
      },
      accept: ["contains", "contains\\(\\)"],
      placeholder: { es: "nombre del método", en: "method name" },
      explain: {
        es: "contains(). En un Map, la pregunta equivalente es containsKey(), y get() además te devuelve el valor.",
        en: "contains(). In a Map, the equivalent question is containsKey(), and get() also hands you the value.",
      },
      tags: ["recall", "spaced"],
      from: { es: "Repaso · M1 L8", en: "Review · M1 L8" },
    },
    {
      id: "m02-l07-q5",
      kind: "single",
      prompt: {
        es: "customerNames contiene 'Acme Corp'. ¿Qué devuelve customerNames.contains('ACME CORP')?",
        en: "customerNames contains 'Acme Corp'. What does customerNames.contains('ACME CORP') return?",
      },
      options: [
        { es: "false", en: "false" },
        { es: "true", en: "true" },
        { es: "Lanza una excepción", en: "It throws an exception" },
      ],
      answer: 0,
      explain: {
        es: "Set compara textos exactos, a diferencia de ==. Si las mayúsculas pueden variar, normaliza al guardar y al preguntar.",
        en: "Set compares exact text, unlike ==. If case can vary, normalise when storing and when asking.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m02-l07-q6",
      kind: "multi",
      prompt: {
        es: "¿Qué cambios convierten un anidado de búsqueda en código que aguanta volumen?",
        en: "Which changes turn a search nesting into code that holds up under volume?",
      },
      options: [
        {
          es: "Construir un Set o Map con la primera lista en un bucle aparte.",
          en: "Build a Set or Map from the first list in a separate loop.",
        },
        {
          es: "Dentro del segundo bucle, preguntar con contains() o get().",
          en: "Inside the second loop, ask with contains() or get().",
        },
        {
          es: "Añadir un tercer bucle para verificar el resultado.",
          en: "Add a third loop to double-check the result.",
        },
        {
          es: "Poner un break en el bucle de fuera.",
          en: "Put a break in the outer loop.",
        },
      ],
      answers: [0, 1],
      explain: {
        es: "Preparar antes, consultar dentro. Un break en el bucle de fuera cambiaría el resultado, no el coste de buscar.",
        en: "Prepare before, look up inside. A break in the outer loop would change the result, not the cost of searching.",
      },
      tags: ["interleaving"],
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 7 DE 8 · Marketing vuelve de una feria y quiere saber qué leads son de empresas que ya son clientes, como Northwind. Dos listas a la vez. Marketing importa leads de una feria y quiere avisar a Ventas de los que vienen de empresas que ya son clientes. Un compañero lo resolvió con un bucle dentro de otro. Hazlo con dos bucles seguidos y un Set.",
      en: "TASK 7 OF 8 · Marketing is back from a trade show and wants to know which leads come from companies that are already customers, like Northwind. Two lists at once. Marketing is importing leads from a trade show and wants to alert Sales to the ones from companies that are already customers. A colleague solved it with a loop inside another. Do it with two loops in a row and a Set.",
    },
    brief: [
      {
        es: "Parte de customers y leads del código de partida.",
        en: "Start from customers and leads in the starter code.",
      },
      {
        es: "Primer bucle: construye un Set<String> llamado customerNames con el nombre de cada cuenta.",
        en: "First loop: build a Set<String> named customerNames with each account's name.",
      },
      {
        es: "Segundo bucle: recorre los leads y añade a una List<Lead> llamada existingCustomerLeads los que tengan su Company en el Set.",
        en: "Second loop: walk the leads and add to a List<Lead> named existingCustomerLeads the ones whose Company is in the Set.",
      },
      {
        es: "Ningún bucle dentro de otro.",
        en: "No loop inside another.",
      },
    ],
    starter: {
      es: `// CASO: las reglas de negocio de la cuenta clave · Northwind Trading
// Tarea 7 de 8: cruzar los leads de la feria con los clientes, sin bucle dentro de bucle.

List<Account> customers = new List<Account>{
    new Account(Name = 'Acme Corp'),
    new Account(Name = 'Globex'),
    new Account(Name = 'Initech')
};
List<Lead> leads = new List<Lead>{
    new Lead(LastName = 'García', Company = 'Globex'),
    new Lead(LastName = 'Smith', Company = 'Hooli'),
    new Lead(LastName = 'Rossi', Company = 'Acme Corp'),
    new Lead(LastName = 'Tanaka', Company = 'Umbrella')
};

// Construye customerNames y después existingCustomerLeads.
`,
      en: `// CASE: the key account's business rules · Northwind Trading
// Task 7 of 8: cross the trade-show leads with the customers, with no loop inside a loop.

List<Account> customers = new List<Account>{
    new Account(Name = 'Acme Corp'),
    new Account(Name = 'Globex'),
    new Account(Name = 'Initech')
};
List<Lead> leads = new List<Lead>{
    new Lead(LastName = 'Garcia', Company = 'Globex'),
    new Lead(LastName = 'Smith', Company = 'Hooli'),
    new Lead(LastName = 'Rossi', Company = 'Acme Corp'),
    new Lead(LastName = 'Tanaka', Company = 'Umbrella')
};

// Build customerNames and then existingCustomerLeads.
`,
    },
    hints: [
      {
        es: "Dos bucles, uno detrás de otro, y dos variables que se declaran antes de su bucle: el Set y la lista de resultado.",
        en: "Two loops, one after the other, and two variables declared before their loop: the Set and the result list.",
      },
      {
        es: "El primer bucle solo llena el Set con customerNames.add(a.Name). El segundo pregunta customerNames.contains(l.Company) y, si es true, hace existingCustomerLeads.add(l).",
        en: "The first loop only fills the Set with customerNames.add(a.Name). The second asks customerNames.contains(l.Company) and, if true, does existingCustomerLeads.add(l).",
      },
      {
        es: "Pseudocódigo: Set<String> customerNames = new Set<String>(); para cada cuenta → add(nombre). List<Lead> existingCustomerLeads = new List<Lead>(); para cada lead → si contains(empresa) → add(lead).",
        en: "Pseudocode: Set<String> customerNames = new Set<String>(); for each account → add(name). List<Lead> existingCustomerLeads = new List<Lead>(); for each lead → if contains(company) → add(lead).",
      },
    ],
    solution: {
      es: `List<Account> customers = new List<Account>{
    new Account(Name = 'Acme Corp'),
    new Account(Name = 'Globex'),
    new Account(Name = 'Initech')
};
List<Lead> leads = new List<Lead>{
    new Lead(LastName = 'García', Company = 'Globex'),
    new Lead(LastName = 'Smith', Company = 'Hooli'),
    new Lead(LastName = 'Rossi', Company = 'Acme Corp'),
    new Lead(LastName = 'Tanaka', Company = 'Umbrella')
};

Set<String> customerNames = new Set<String>();
for (Account a : customers) {
    customerNames.add(a.Name);
}

List<Lead> existingCustomerLeads = new List<Lead>();
for (Lead l : leads) {
    if (customerNames.contains(l.Company)) {
        existingCustomerLeads.add(l);
    }
}
System.debug(existingCustomerLeads.size());   // 2`,
      en: `List<Account> customers = new List<Account>{
    new Account(Name = 'Acme Corp'),
    new Account(Name = 'Globex'),
    new Account(Name = 'Initech')
};
List<Lead> leads = new List<Lead>{
    new Lead(LastName = 'Garcia', Company = 'Globex'),
    new Lead(LastName = 'Smith', Company = 'Hooli'),
    new Lead(LastName = 'Rossi', Company = 'Acme Corp'),
    new Lead(LastName = 'Tanaka', Company = 'Umbrella')
};

Set<String> customerNames = new Set<String>();
for (Account a : customers) {
    customerNames.add(a.Name);
}

List<Lead> existingCustomerLeads = new List<Lead>();
for (Lead l : leads) {
    if (customerNames.contains(l.Company)) {
        existingCustomerLeads.add(l);
    }
}
System.debug(existingCustomerLeads.size());   // 2`,
    },
    checks: [
      {
        id: "m02-l07-c1",
        label: {
          es: "customerNames es un Set<String> nuevo",
          en: "customerNames is a new Set<String>",
        },
        rule: {
          op: "match",
          pattern: "Set<String>\\s+customerNames\\s*=\\s*new\\s+Set<String>\\s*\\(\\s*\\)",
        },
        onFail: {
          es: "Declara el Set vacío antes del primer bucle: Set<String> customerNames = new Set<String>();",
          en: "Declare the empty Set before the first loop: Set<String> customerNames = new Set<String>();",
        },
      },
      {
        id: "m02-l07-c2",
        label: {
          es: "El primer bucle llena el Set con el nombre de cada cuenta",
          en: "The first loop fills the Set with each account's name",
        },
        rule: {
          op: "match",
          pattern: "for\\s*\\(\\s*Account\\s+\\w+\\s*:\\s*customers\\s*\\)[\\s\\S]*?customerNames\\.add\\(\\s*\\w+\\.Name\\s*\\)",
        },
        onFail: {
          es: "Recorre customers con un for-each y, en cada vuelta, customerNames.add(a.Name);",
          en: "Walk customers with a for-each and, on each pass, customerNames.add(a.Name);",
        },
      },
      {
        id: "m02-l07-c3",
        label: {
          es: "existingCustomerLeads es una List<Lead> nueva",
          en: "existingCustomerLeads is a new List<Lead>",
        },
        rule: {
          op: "match",
          pattern: "List<Lead>\\s+existingCustomerLeads\\s*=\\s*new\\s+List<Lead>\\s*\\(\\s*\\)",
        },
        onFail: {
          es: "La lista de resultado se declara vacía antes del segundo bucle: List<Lead> existingCustomerLeads = new List<Lead>();",
          en: "The result list is declared empty before the second loop: List<Lead> existingCustomerLeads = new List<Lead>();",
        },
      },
      {
        id: "m02-l07-c4",
        label: {
          es: "El segundo bucle pregunta al Set y añade las coincidencias",
          en: "The second loop asks the Set and adds the matches",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "for\\s*\\(\\s*Lead\\s+\\w+\\s*:\\s*leads\\s*\\)" },
            { op: "match", pattern: "customerNames\\.contains\\(\\s*\\w+\\.Company\\s*\\)" },
            { op: "match", pattern: "existingCustomerLeads\\.add\\(\\s*\\w+\\s*\\)" },
          ],
        },
        onFail: {
          es: "Dentro del bucle de leads: if (customerNames.contains(l.Company)) { existingCustomerLeads.add(l); }",
          en: "Inside the leads loop: if (customerNames.contains(l.Company)) { existingCustomerLeads.add(l); }",
        },
        onPass: {
          es: "Con 200 cuentas y 200 leads, esto son 400 vueltas. El anidado habría hecho 40.000 comparaciones.",
          en: "With 200 accounts and 200 leads, this is 400 passes. The nesting would have made 40,000 comparisons.",
        },
      },
      {
        id: "m02-l07-c5",
        label: {
          es: "Ningún bucle dentro de otro",
          en: "No loop inside another",
        },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "\\bfor\\s*\\(", max: 2 },
            { op: "absent", pattern: "for\\s*\\([^{]*\\)\\s*\\{[^}]*\\bfor\\s*\\(" },
          ],
        },
        onFail: {
          es: "El objetivo es no anidar: el bucle de cuentas termina antes de que empiece el de leads, y dentro del de leads la búsqueda la hace contains().",
          en: "The goal is not to nest: the accounts loop ends before the leads loop begins, and inside the leads loop the lookup is done by contains().",
        },
      },
    ],
    rubric: [
      {
        es: "Añade un lead con Company = 'ACME CORP'. ¿Lo encuentra tu código? ¿Qué cambiarías para que sí?",
        en: "Add a lead with Company = 'ACME CORP'. Does your code find it? What would you change so it does?",
      },
      {
        es: "Tarea 8: la entrega. La revisión trimestral junta todo lo anterior sobre el pipeline real: niveles, reglas, recorridos y paradas.",
        en: "Task 8: delivery. The quarterly review brings everything before together on the real pipeline: tiers, rules, walks and stops.",
      },
    ],
  },
};
