import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, auditado
// Tarea 4 de 6: que el usuario escriba valores, nunca código.

public with sharing class RenewalSearch {
    private static final Set<String> SORTABLE = new Set<String>{ 'Name', 'Amount', 'CloseDate' };

    public static List<Opportunity> search(String term, String sortField) {
        // Un nombre de campo no se puede enlazar: se compara con una lista cerrada
        if (!SORTABLE.contains(sortField)) {
            sortField = 'CloseDate';
        }
        String soql = 'SELECT Id, Name, Amount FROM Opportunity ' +
            'WHERE Type = \\'Renewal\\' AND Account.Name LIKE :pattern ' +
            'ORDER BY ' + sortField;

        // Lo que escribe el usuario viaja como valor enlazado, nunca pegado al texto
        Map<String, Object> binds = new Map<String, Object>{ 'pattern' => '%' + term + '%' };
        return Database.queryWithBinds(soql, binds, AccessLevel.USER_MODE);
    }
}`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, auditado\n// Tarea 4 de 6: que el usuario escriba valores, nunca código.",
  "// CASE: the ERP bridge, audited\n// Task 4 of 6: let the user type values, never code.",
)
  .replace("// Un nombre de campo no se puede enlazar: se compara con una lista cerrada", "// A field name cannot be bound: it is checked against a closed list")
  .replace("// Lo que escribe el usuario viaja como valor enlazado, nunca pegado al texto", "// What the user types travels as a bound value, never glued into the text");

const STARTER_ES = `// CASO: el puente con el ERP, auditado
// Ya resuelto (tareas 1-3): sharing declarado y permisos aplicados por la plataforma.
// Tarea 4 de 6: que el usuario escriba valores, nunca código.

// El buscador de renovaciones: el comercial escribe un nombre de cuenta y elige por qué campo ordenar.
public with sharing class RenewalSearch {
    public static List<Opportunity> search(String term, String sortField) {
        String soql = 'SELECT Id, Name, Amount FROM Opportunity ' +
            'WHERE Type = \\'Renewal\\' AND Account.Name LIKE \\'%' + term + '%\\' ' +
            'ORDER BY ' + sortField;
        return Database.query(soql);
    }
}
`;

export const l04InyeccionSoql: Lesson = {
  id: "m12-l04",
  slug: "inyeccion-de-soql",
  n: 4,
  kind: "lesson",
  minutes: 30,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 3", en: "Remember? · Review of lesson 3" },
    prompt: { es: "¿Qué hace WITH USER_MODE al final de una consulta?", en: "What does WITH USER_MODE do at the end of a query?" },
    options: [
      { es: "Aplica los permisos de objeto, de campo y el sharing del usuario", en: "It applies the user's object permissions, field permissions and sharing" },
      { es: "Hace la consulta más rápida", en: "It makes the query faster" },
      { es: "Evita la inyección de SOQL", en: "It prevents SOQL injection" },
    ],
    answer: 0,
    explain: {
      es: "Aplica permisos, pero no impide que alguien cambie la consulta. Eso es lo de hoy.",
      en: "It applies permissions, but does not stop someone from changing the query. That is today's topic.",
    },
  },
  title: { es: "Inyección de SOQL y escaping", en: "SOQL injection and escaping" },
  summary: {
    es: "Si pegas lo que escribe un usuario dentro del texto de una consulta, el usuario puede escribir consulta. Dos reglas lo cierran: los valores se enlazan, y lo que no se puede enlazar se compara con una lista cerrada.",
    en: "If you glue what a user types into a query's text, the user can write query. Two rules close it: values are bound, and what cannot be bound is checked against a closed list.",
  },
  analogy: {
    es: "Un campo de texto libre donde alguien pega una fórmula en lugar de un nombre",
    en: "A free-text field where someone pastes a formula instead of a name",
  },
  objectives: [
    { es: "Reconocer una consulta vulnerable a inyección.", en: "Recognise a query vulnerable to injection." },
    { es: "Enlazar los valores en SOQL dinámico con Database.queryWithBinds.", en: "Bind values in dynamic SOQL with Database.queryWithBinds." },
    { es: "Validar con una lista cerrada lo que no se puede enlazar.", en: "Validate against a closed list what cannot be bound." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Cuarto hallazgo de la auditoría, y el más serio. El buscador de renovaciones monta su consulta pegando lo que escribe el comercial. El auditor escribe en la caja de búsqueda un texto que no es un nombre de cuenta, y el buscador le devuelve oportunidades que no son renovaciones. Ha conseguido que su texto se ejecute como parte de la consulta.",
        en: "The audit's fourth finding, and the most serious. The renewal search builds its query by gluing in what the rep types. The auditor types into the search box a text that is not an account name, and the search returns opportunities that are not renewals. They have made their text run as part of the query.",
      },
    },
    {
      type: "h",
      text: { es: "Cómo se cuela", en: "How it slips in" },
    },
    {
      type: "code",
      code: {
        es: `String soql = 'SELECT Id FROM Opportunity WHERE Type = \\'Renewal\\' AND Account.Name LIKE \\'%' + term + '%\\'';

// Si term es:   acme
// la consulta:  … AND Account.Name LIKE '%acme%'

// Si term es:   %' OR Name LIKE '
// la consulta:  … AND Account.Name LIKE '%%' OR Name LIKE '%'      ← ya no filtra renovaciones`,
        en: `String soql = 'SELECT Id FROM Opportunity WHERE Type = \\'Renewal\\' AND Account.Name LIKE \\'%' + term + '%\\'';

// If term is:   acme
// the query:    … AND Account.Name LIKE '%acme%'

// If term is:   %' OR Name LIKE '
// the query:    … AND Account.Name LIKE '%%' OR Name LIKE '%'      ← it no longer filters renewals`,
      },
      caption: {
        es: "La comilla que escribe el usuario cierra tu texto antes de tiempo, y lo que viene detrás deja de ser un valor: es consulta.",
        en: "The quote the user types closes your text early, and what follows is no longer a value: it is query.",
      },
    },
    {
      type: "diagram",
      id: "m12-injection",
      caption: {
        es: "Escribe en el buscador como un comercial y como un auditor, y mira qué consulta se ejecuta pegando el texto y enlazándolo.",
        en: "Type in the search box as a rep and as an auditor, and see which query runs when the text is glued in and when it is bound.",
      },
    },
    {
      type: "h",
      text: { es: "Dos reglas", en: "Two rules" },
    },
    {
      type: "list",
      ordered: true,
      items: [
        {
          es: "Los valores se enlazan. En una consulta entre corchetes, con :variable (Módulo 3). En SOQL dinámico, con Database.queryWithBinds(texto, mapa, AccessLevel.USER_MODE): el texto lleva :pattern y el mapa dice cuánto vale. Un valor enlazado nunca se interpreta como consulta, tenga las comillas que tenga.",
          en: "Values are bound. In a query in square brackets, with :variable (Module 3). In dynamic SOQL, with Database.queryWithBinds(text, map, AccessLevel.USER_MODE): the text carries :pattern and the map says what it is worth. A bound value is never read as query, whatever quotes it has.",
        },
        {
          es: "Lo que no se puede enlazar, se compara con una lista cerrada. Un nombre de campo para ordenar no es un valor, y no admite los dos puntos. Ahí el usuario solo puede elegir entre opciones que tú has escrito: si lo que llega no está en la lista, se usa una por defecto.",
          en: "What cannot be bound is checked against a closed list. A field name to sort by is not a value, and takes no colon. There the user can only choose among options you wrote: if what arrives is not on the list, a default is used.",
        },
      ],
    },
    {
      type: "p",
      text: {
        es: "Verás también String.escapeSingleQuotes(term), que pone una barra delante de cada comilla: es la defensa antigua, y sirve cuando no hay más remedio que pegar el texto. Pero enlazar es más seguro, porque no depende de que te acuerdes de escapar. Y si la consulta puede escribirse entre corchetes, escríbela así: es la que no se puede inyectar.",
        en: "You will also see String.escapeSingleQuotes(term), which puts a backslash before every quote: it is the old defence, and it helps when there is no choice but to glue the text. But binding is safer, because it does not depend on your remembering to escape. And if the query can be written in square brackets, write it that way: it is the one that cannot be injected.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Aquí Flow es más seguro que tú", en: "Why not a Flow? Here Flow is safer than you" },
      text: {
        es: "Te lo digo sin rodeos: un Get Records no se puede inyectar. Lo que el usuario escribe en una pantalla llega al filtro como valor, nunca como texto de consulta. Este problema solo existe en el código, y solo cuando alguien monta la consulta pegando textos. Es un riesgo que trae Apex consigo, y por eso cae en el examen: la primera pregunta ante un buscador sencillo sigue siendo si hace falta escribirlo en código.",
        en: "Straight up: a Get Records cannot be injected. What the user types on a screen reaches the filter as a value, never as query text. This problem only exists in code, and only when someone builds the query by gluing texts. It is a risk Apex brings with it, and that is why it shows up in the exam: the first question facing a simple search is still whether it needs to be written in code.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿por qué una comilla escrita por el usuario es peligrosa? ¿Cómo se enlaza un valor en SOQL dinámico? ¿Qué haces con un nombre de campo que elige el usuario?",
        en: "Without looking: why is a quote typed by the user dangerous? How do you bind a value in dynamic SOQL? What do you do with a field name the user chooses?",
      },
    },
  ],

  quiz: [
    {
      id: "m12-l04-q1",
      kind: "single",
      prompt: { es: "¿Cuál de estas consultas es vulnerable a inyección?", en: "Which of these queries is vulnerable to injection?" },
      options: [
        { es: "Database.query('SELECT Id FROM Account WHERE Name = \\'' + name + '\\'')", en: "Database.query('SELECT Id FROM Account WHERE Name = \\'' + name + '\\'')" },
        { es: "[SELECT Id FROM Account WHERE Name = :name]", en: "[SELECT Id FROM Account WHERE Name = :name]" },
        { es: "Database.queryWithBinds('SELECT Id FROM Account WHERE Name = :name', binds, AccessLevel.USER_MODE)", en: "Database.queryWithBinds('SELECT Id FROM Account WHERE Name = :name', binds, AccessLevel.USER_MODE)" },
        { es: "[SELECT Id FROM Account LIMIT 10]", en: "[SELECT Id FROM Account LIMIT 10]" },
      ],
      answer: 0,
      explain: {
        es: "La que pega la variable al texto. Las que enlazan con dos puntos tratan el valor como valor.",
        en: "The one gluing the variable into the text. Those binding with a colon treat the value as a value.",
      },
      tags: ["find-error"],
    },
    {
      id: "m12-l04-q2",
      kind: "single",
      prompt: {
        es: "El usuario elige el campo por el que ordenar. ¿Cómo lo metes en la consulta con seguridad?",
        en: "The user picks the field to sort by. How do you put it in the query safely?",
      },
      options: [
        { es: "Comprobando que está en una lista cerrada de campos permitidos", en: "By checking it is on a closed list of allowed fields" },
        { es: "Con una variable de enlace: ORDER BY :sortField", en: "With a bind variable: ORDER BY :sortField" },
        { es: "Pegándolo tal cual: es solo un nombre de campo", en: "Gluing it as is: it is only a field name" },
        { es: "Con WITH USER_MODE basta", en: "WITH USER_MODE is enough" },
      ],
      answer: 0,
      explain: {
        es: "Un nombre de campo no es un valor y no se puede enlazar. Solo queda no aceptar nada que no hayas escrito tú.",
        en: "A field name is not a value and cannot be bound. All that is left is to accept nothing you did not write yourself.",
      },
    },
    {
      id: "m12-l04-q3",
      kind: "single",
      prompt: { es: "¿Qué hace String.escapeSingleQuotes(term)?", en: "What does String.escapeSingleQuotes(term) do?" },
      options: [
        { es: "Pone una barra delante de cada comilla simple, para que no cierre el texto", en: "It puts a backslash before every single quote, so it does not close the text" },
        { es: "Quita todas las comillas", en: "It removes every quote" },
        { es: "Enlaza la variable", en: "It binds the variable" },
        { es: "Comprueba los permisos", en: "It checks permissions" },
      ],
      answer: 0,
      explain: {
        es: "Es la defensa clásica cuando hay que pegar el texto. Funciona, pero depende de no olvidarla: enlazar es más seguro.",
        en: "It is the classic defence when the text must be glued. It works, but depends on not forgetting it: binding is safer.",
      },
    },
    {
      id: "m12-l04-q4",
      kind: "multi",
      prompt: { es: "¿Qué protege de la inyección de SOQL?", en: "What protects against SOQL injection?" },
      options: [
        { es: "Variables de enlace", en: "Bind variables" },
        { es: "Una lista cerrada para nombres de campo", en: "A closed list for field names" },
        { es: "Escribir la consulta entre corchetes cuando se puede", en: "Writing the query in square brackets when possible" },
        { es: "with sharing", en: "with sharing" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "with sharing decide qué registros se ven, pero no impide que alguien cambie la consulta.",
        en: "with sharing decides which records are seen, but does not stop someone from changing the query.",
      },
    },
    {
      id: "m12-l04-q5",
      kind: "text",
      prompt: {
        es: "Escribe la condición del if que detecta que sortField NO está en el Set SORTABLE.",
        en: "Write the if condition detecting that sortField is NOT in the SORTABLE Set.",
      },
      accept: ["!\\s*sortable\\.contains\\(\\s*sortfield\\s*\\)", "\\(\\s*!\\s*sortable\\.contains\\(\\s*sortfield\\s*\\)\\s*\\)"],
      placeholder: { es: "!SORTABLE.…", en: "!SORTABLE.…" },
      explain: { es: "!SORTABLE.contains(sortField)", en: "!SORTABLE.contains(sortField)" },
      tags: ["recall"],
    },
    {
      id: "m12-l04-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿cómo se escribe una variable de enlace dentro de una consulta SOQL?",
        en: "Review: how do you write a bind variable inside a SOQL query?",
      },
      options: [
        { es: "Con dos puntos delante: :term", en: "With a colon in front: :term" },
        { es: "Con llaves: {!term}", en: "With braces: {!term}" },
        { es: "Entre comillas: 'term'", en: "In quotes: 'term'" },
        { es: "Con un signo de dólar: $term", en: "With a dollar sign: $term" },
      ],
      answer: 0,
      explain: {
        es: "Los dos puntos del Módulo 3. {!…} es la sintaxis de Flow y de las fórmulas.",
        en: "Module 3's colon. {!…} is Flow and formula syntax.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M3 L5", en: "Review · M3 L5" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 4 DE 6 · Cuarto hallazgo: el buscador de renovaciones pega en la consulta lo que escribe el comercial y el nombre del campo por el que ordena. Ciérralo: el término de búsqueda tiene que viajar enlazado, el campo de ordenación solo puede ser uno de una lista cerrada, y la consulta se ejecuta en modo usuario.",
      en: "TASK 4 OF 6 · Fourth finding: the renewal search glues into the query what the rep types and the name of the field it sorts by. Close it: the search term must travel bound, the sort field may only be one from a closed list, and the query runs in user mode.",
    },
    brief: [
      {
        es: "Una constante Set<String> con los campos por los que se puede ordenar: Name, Amount y CloseDate. Si sortField no está en ella, usa 'CloseDate'.",
        en: "A Set<String> constant with the fields that may be sorted by: Name, Amount and CloseDate. If sortField is not in it, use 'CloseDate'.",
      },
      {
        es: "En el texto de la consulta, el término va como :pattern, no pegado.",
        en: "In the query text, the term goes as :pattern, not glued in.",
      },
      {
        es: "Ejecuta con Database.queryWithBinds(soql, mapa, AccessLevel.USER_MODE), donde el mapa da a 'pattern' el valor '%' + term + '%'.",
        en: "Run with Database.queryWithBinds(soql, map, AccessLevel.USER_MODE), where the map gives 'pattern' the value '%' + term + '%'.",
      },
    ],
    starter: {
      es: STARTER_ES,
      en: STARTER_ES.replace(
        "// CASO: el puente con el ERP, auditado\n// Ya resuelto (tareas 1-3): sharing declarado y permisos aplicados por la plataforma.\n// Tarea 4 de 6: que el usuario escriba valores, nunca código.",
        "// CASE: the ERP bridge, audited\n// Already solved (tasks 1-3): sharing declared and permissions applied by the platform.\n// Task 4 of 6: let the user type values, never code.",
      ).replace(
        "// El buscador de renovaciones: el comercial escribe un nombre de cuenta y elige por qué campo ordenar.",
        "// The renewal search: the rep types an account name and picks which field to sort by.",
      ),
    },
    hints: [
      {
        es: "Yo me preguntaría, por cada cosa que llega de fuera: ¿es un valor o es un trozo de consulta? El término es un valor. El campo de ordenación es un trozo de consulta.",
        en: "For each thing coming from outside, I would ask: is it a value or a piece of query? The term is a value. The sort field is a piece of query.",
      },
      {
        es: "Lo que me ayudó: los valores se enlazan (con :pattern en el texto y un Map que dice cuánto vale); los trozos de consulta se comparan con una lista que escribiste tú, y si no están, se usa uno por defecto.",
        en: "What helped me: values are bound (with :pattern in the text and a Map saying what it is worth); pieces of query are checked against a list you wrote, and if they are not on it, a default is used.",
      },
      {
        es: "Te dejo el esquema: private static final Set<String> SORTABLE = new Set<String>{ 'Name', 'Amount', 'CloseDate' }; if (!SORTABLE.contains(sortField)) { sortField = 'CloseDate'; } String soql = '… Account.Name LIKE :pattern ORDER BY ' + sortField; Map<String, Object> binds = new Map<String, Object>{ 'pattern' => '%' + term + '%' }; return Database.queryWithBinds(soql, binds, AccessLevel.USER_MODE);",
        en: "Here is the outline: private static final Set<String> SORTABLE = new Set<String>{ 'Name', 'Amount', 'CloseDate' }; if (!SORTABLE.contains(sortField)) { sortField = 'CloseDate'; } String soql = '… Account.Name LIKE :pattern ORDER BY ' + sortField; Map<String, Object> binds = new Map<String, Object>{ 'pattern' => '%' + term + '%' }; return Database.queryWithBinds(soql, binds, AccessLevel.USER_MODE);",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m12-l04-c1",
        label: { es: "El campo de ordenación sale de una lista cerrada", en: "The sort field comes from a closed list" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Set\\s*<\\s*String\\s*>\\s+\\w+\\s*=\\s*new\\s+Set\\s*<\\s*String\\s*>\\s*\\{[^}]*'Name'[^}]*\\}" },
            { op: "match", pattern: "if\\s*\\(\\s*!\\s*\\w+\\s*\\.\\s*contains\\s*\\(\\s*sortField\\s*\\)\\s*\\)\\s*\\{?\\s*sortField\\s*=\\s*'CloseDate'" },
          ],
        },
        onFail: {
          es: "private static final Set<String> SORTABLE = new Set<String>{ 'Name', 'Amount', 'CloseDate' }; if (!SORTABLE.contains(sortField)) { sortField = 'CloseDate'; }",
          en: "private static final Set<String> SORTABLE = new Set<String>{ 'Name', 'Amount', 'CloseDate' }; if (!SORTABLE.contains(sortField)) { sortField = 'CloseDate'; }",
        },
        otter: {
          es: "Un nombre de campo es como una picklist restringida: solo valen los valores que tú definiste. Un Set<String> con Name, Amount y CloseDate, y si lo que llega no está, 'CloseDate'.",
          en: "A field name is like a restricted picklist: only the values you defined count. A Set<String> with Name, Amount and CloseDate, and if what arrives is not there, 'CloseDate'.",
        },
      },
      {
        id: "m12-l04-c2",
        label: { es: "El término ya no se pega al texto de la consulta", en: "The term is no longer glued into the query text" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "LIKE\\s*:\\s*\\w+" },
            { op: "absent", pattern: "LIKE\\s*\\\\'%'\\s*\\+\\s*term" },
          ],
        },
        onFail: {
          es: "En el texto: … Account.Name LIKE :pattern …, sin + term + pegado a la consulta.",
          en: "In the text: … Account.Name LIKE :pattern …, with no + term + glued into the query.",
        },
        otter: {
          es: "El término es un valor, y los valores no se pegan: en el texto de la consulta va :pattern, con sus dos puntos, como en tu {!variable} del Get Records.",
          en: "The term is a value, and values are not glued in: the query text carries :pattern, with its colon, like your Get Records {!variable}.",
        },
      },
      {
        id: "m12-l04-c3",
        label: { es: "Se ejecuta con valores enlazados y en modo usuario", en: "It runs with bound values and in user mode" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Map\\s*<\\s*String\\s*,\\s*Object\\s*>\\s+\\w+\\s*=\\s*new\\s+Map\\s*<\\s*String\\s*,\\s*Object\\s*>\\s*\\{\\s*'\\w+'\\s*=>" },
            { op: "match", pattern: "Database\\s*\\.\\s*queryWithBinds\\s*\\(\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*AccessLevel\\s*\\.\\s*USER_MODE\\s*\\)" },
            { op: "absent", pattern: "Database\\s*\\.\\s*query\\s*\\(" },
          ],
        },
        onFail: {
          es: "Map<String, Object> binds = new Map<String, Object>{ 'pattern' => '%' + term + '%' }; return Database.queryWithBinds(soql, binds, AccessLevel.USER_MODE);",
          en: "Map<String, Object> binds = new Map<String, Object>{ 'pattern' => '%' + term + '%' }; return Database.queryWithBinds(soql, binds, AccessLevel.USER_MODE);",
        },
        otter: {
          es: "El valor de :pattern lo da un Map, y la consulta se ejecuta con Database.queryWithBinds(soql, binds, AccessLevel.USER_MODE): valores enlazados y permisos del usuario, las dos cosas a la vez.",
          en: "A Map gives :pattern its value, and the query runs with Database.queryWithBinds(soql, binds, AccessLevel.USER_MODE): bound values and the user's permissions, both at once.",
        },
      },
    ],
    rubric: [
      {
        es: "Si el buscador no necesitara ordenar por un campo elegido, ¿haría falta SOQL dinámico? ¿Cómo quedaría la consulta entre corchetes?",
        en: "If the search did not need to sort by a chosen field, would dynamic SOQL be needed? How would the query look in square brackets?",
      },
    ],
    voice: "otter",
    outro: {
      es: "El buscador ya solo acepta valores, y los cuatro hallazgos están cerrados. Pero el auditor quiere saber cómo se asegura que sigan cerrados. En la tarea 5 escribes el test que lo demuestra, poniéndote en la piel de un usuario sin permisos.",
      en: "The search now accepts only values, and the four findings are closed. But the auditor wants to know how they are kept closed. In task 5 you write the test that proves it, stepping into the shoes of a user without permissions.",
    },
  },
};
