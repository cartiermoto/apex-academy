import type { Lesson } from "@/lib/types";

export const l06Null: Lesson = {
  id: "m01-l06",
  slug: "null",
  n: 6,
  kind: "lesson",
  minutes: 24,
  title: { es: "Null", en: "Null" },
  summary: {
    es: "El campo en blanco, llevado al código. Es la causa número uno de errores en Apex y la más fácil de evitar.",
    en: "The blank field, taken into code. It is the number-one cause of Apex errors and the easiest to avoid.",
  },
  analogy: {
    es: "Un campo en blanco, ISBLANK() y BLANKVALUE()",
    en: "A blank field, ISBLANK() and BLANKVALUE()",
  },
  objectives: [
    {
      es: "Distinguir null de una cadena vacía y de un cero.",
      en: "Tell null apart from an empty string and from zero.",
    },
    {
      es: "Reconocer las tres operaciones que hacen saltar un NullPointerException.",
      en: "Recognise the three operations that trigger a NullPointerException.",
    },
    {
      es: "Comprobar la ausencia de un dato antes de usarlo, con la herramienta adecuada a cada tipo.",
      en: "Check for a missing value before using it, with the right tool for each type.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Abre cualquier lista de Leads de tu org y mira la columna de teléfono: habrá filas en blanco. Ese blanco tiene nombre en Apex —null— y, a diferencia de la interfaz, aquí no se ignora educadamente: si intentas usarlo, la [[transaccion]] entera se detiene.",
        en: "Open any Lead list in your org and look at the phone column: some rows are blank. That blank has a name in Apex — null — and unlike the UI it is not politely ignored here: try to use it and the whole [[transaccion|transaction]] stops.",
      },
    },
    {
      type: "h",
      text: { es: "Tres cosas que no son lo mismo", en: "Three things that are not the same" },
    },
    {
      type: "p",
      text: {
        es: "Esto ya lo sabías como Admin, aunque quizá sin ponerle nombre: no es lo mismo un campo que nadie ha rellenado, un campo rellenado con nada, y un campo rellenado con cero. En un informe, los tres se ven casi igual. En Apex se comportan de forma muy distinta.",
        en: "You already knew this as an Admin, perhaps without naming it: a field nobody filled in, a field filled in with nothing, and a field filled in with zero are three different things. In a report they look almost identical. In Apex they behave very differently.",
      },
    },
    {
      type: "diagram",
      id: "m01-null",
      caption: {
        es: "null no es un valor pequeño: es la ausencia de valor. Por eso no se le puede pedir nada.",
        en: "null is not a small value: it is the absence of one. Which is why you cannot ask it for anything.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Valor", en: "Value" },
        { es: "Significa", en: "Means" },
        { es: "length() devuelve", en: "length() returns" },
      ],
      rows: [
        [
          { es: "null", en: "null" },
          { es: "Nunca se rellenó.", en: "Never filled in." },
          { es: "NullPointerException", en: "NullPointerException" },
        ],
        [
          { es: "''", en: "''" },
          { es: "Se rellenó con nada.", en: "Filled in with nothing." },
          { es: "0", en: "0" },
        ],
        [
          { es: "'   '", en: "'   '" },
          { es: "Se rellenó con espacios.", en: "Filled in with spaces." },
          { es: "3", en: "3" },
        ],
        [
          { es: "0", en: "0" },
          { es: "Se midió y salió cero.", en: "Measured, and it came out zero." },
          { es: "— (no es texto)", en: "— (not text)" },
        ],
      ],
    },
    {
      type: "h",
      text: { es: "Todo empieza en null", en: "Everything starts as null" },
    },
    {
      type: "p",
      text: {
        es: "Una variable declarada y no asignada vale null, sea del tipo que sea. Un campo vacío leído de la base de datos también llega como null. Y un Boolean sin asignar no es false: es null, que es un tercer estado.",
        en: "A declared-but-unassigned variable is null, whatever its type. An empty field read from the database also arrives as null. And an unassigned Boolean is not false: it is null, a third state.",
      },
    },
    {
      type: "code",
      code: {
        es: `Integer contactCount;      // null, no 0
String region;             // null, no ''
Boolean isActive;          // null, no false

Lead webLead = new Lead(LastName = 'Ruiz');
System.debug(webLead.Company);   // null: nunca se asignó`,
        en: `Integer contactCount;      // null, not 0
String region;             // null, not ''
Boolean isActive;          // null, not false

Lead webLead = new Lead(LastName = 'Ruiz');
System.debug(webLead.Company);   // null: never assigned`,
      },
    },
    {
      type: "h",
      text: { es: "Las tres formas de romperlo", en: "The three ways to break it" },
    },
    {
      type: "p",
      text: {
        es: "El error se llama NullPointerException y siempre dice lo mismo: «Attempt to de-reference a null object». Traducido: le has pedido algo a algo que no existe. Ocurre en tres situaciones, y las tres se reconocen a simple vista.",
        en: "The error is called NullPointerException and always says the same thing: “Attempt to de-reference a null object”. Translated: you asked something of something that is not there. It happens in three situations, and all three are visible at a glance.",
      },
    },
    {
      type: "code",
      code: {
        es: `String region = null;
Integer count = null;
Account account = null;

region.toUpperCase();      // 1. llamar a un método sobre null
Integer total = count + 5; // 2. operar aritméticamente con null
String name = account.Name;// 3. leer un campo de un registro null`,
        en: `String region = null;
Integer count = null;
Account account = null;

region.toUpperCase();      // 1. calling a method on null
Integer total = count + 5; // 2. doing arithmetic with null
String name = account.Name;// 3. reading a field off a null record`,
      },
      caption: {
        es: "Las tres fallan en ejecución, no al compilar: el compilador no sabe qué valdrá la variable.",
        en: "All three fail at runtime, not at compile time: the compiler cannot know what the variable will hold.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "La excepción que no salta", en: "The exception that does not fire" },
      text: {
        es: "Concatenar texto con null no da error: 'Región: ' + null produce 'Región: null', con la palabra «null» escrita tal cual dentro del texto. Es peor que un error, porque no se entera nadie hasta que un cliente ve «Estimado null» en un correo.",
        en: "Concatenating text with null does not error: 'Region: ' + null produces 'Region: null', with the word “null” written out inside the text. That is worse than an error, because nobody notices until a customer reads “Dear null” in an email.",
      },
    },
    {
      type: "h",
      text: { es: "Comprobar antes de usar", en: "Check before you use" },
    },
    {
      type: "p",
      text: {
        es: "La comprobación básica sirve para cualquier tipo: comparar con null usando == o !=. Para texto hay algo mejor, porque el problema real casi nunca es solo null: también son un problema la cadena vacía y la cadena de espacios.",
        en: "The basic check works for any type: compare against null with == or !=. For text there is something better, because the real problem is almost never just null: an empty string and a string of spaces are problems too.",
      },
    },
    {
      type: "code",
      code: {
        es: `String region = webLead.Region__c;

Boolean exists = region != null;          // vale para cualquier tipo
Boolean usable = String.isNotBlank(region); // null, '' y '   ' de una vez
Boolean missing = String.isBlank(region);   // lo contrario`,
        en: `String region = webLead.Region__c;

Boolean exists = region != null;            // works for any type
Boolean usable = String.isNotBlank(region); // null, '' and '   ' in one go
Boolean missing = String.isBlank(region);   // the opposite`,
      },
      caption: {
        es: "String.isBlank() es la comprobación que resuelve el 90 % de los casos reales con datos de formularios.",
        en: "String.isBlank() is the check that handles 90% of real cases with form data.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Ya escribiste esto en una fórmula", en: "You already wrote this in a formula" },
      text: {
        es: "ISBLANK(Region__c) y BLANKVALUE(Region__c, 'Sin región') son exactamente la misma idea: comprobar el hueco antes de usarlo y decidir qué poner si está vacío. Apex te obliga a hacerlo explícito, pero la lógica es la que ya aplicabas.",
        en: "ISBLANK(Region__c) and BLANKVALUE(Region__c, 'No region') are exactly the same idea: check the gap before using it and decide what goes there if it is empty. Apex forces you to be explicit, but the logic is the one you already applied.",
      },
    },
    {
      type: "h",
      text: { es: "El operador de navegación segura", en: "The safe navigation operator" },
    },
    {
      type: "p",
      text: {
        es: "Cuando solo quieres leer algo y te da igual que no exista, existe una forma corta: escribir ?. en lugar del punto. Si lo de la izquierda es null, la expresión entera vale null y no se lanza ninguna [[excepcion]].",
        en: "When you only want to read something and you do not mind if it is missing, there is a short form: write ?. instead of the dot. If the left-hand side is null, the whole expression is null and no [[excepcion|exception]] is thrown.",
      },
    },
    {
      type: "code",
      code: {
        es: `String region = null;

String loud = region.toUpperCase();    // 💥 NullPointerException
String safe = region?.toUpperCase();   // null, sin explotar

Account account = null;
String name = account?.Name;           // null, sin explotar`,
        en: `String region = null;

String loud = region.toUpperCase();    // 💥 NullPointerException
String safe = region?.toUpperCase();   // null, no explosion

Account account = null;
String name = account?.Name;           // null, no explosion`,
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Seguro no es lo mismo que correcto", en: "Safe is not the same as correct" },
      text: {
        es: "?. evita el error, pero te deja un null en la mano. Sigue siendo tu decisión qué hacer con él: dejarlo pasar, sustituirlo por un valor por defecto o avisar. Esa decisión necesita un operador que verás en la sub-lección siguiente.",
        en: "?. avoids the error, but it hands you a null. What to do with it is still your call: let it through, swap in a default, or raise it. That decision needs an operator you will meet in the next sub-lesson.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿cuáles son las tres operaciones que hacen saltar un NullPointerException, y cuál es la única de las tres que no da error sino un texto raro?",
        en: "Without looking up: what are the three operations that raise a NullPointerException, and which related one gives you odd text instead of an error?",
      },
    },
  ],

  quiz: [
    {
      id: "m01-l06-q1",
      kind: "single",
      prompt: { es: "¿Qué imprime este código?", en: "What does this code print?" },
      code: {
        es: `String region;
System.debug('Región: ' + region);`,
        en: `String region;
System.debug('Region: ' + region);`,
      },
      options: [
        { es: "Región: null", en: "Region: null" },
        { es: "Región: ", en: "Region: " },
        { es: "Lanza NullPointerException.", en: "It throws a NullPointerException." },
        { es: "No compila.", en: "It does not compile." },
      ],
      answer: 0,
      explain: {
        es: "Concatenar con null no falla: escribe la palabra «null» dentro del texto. Es el bug que acaba en un correo que empieza por «Estimado null».",
        en: "Concatenating with null does not fail: it writes the word “null” into the text. It is the bug that ends up in an email starting “Dear null”.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m01-l06-q2",
      kind: "single",
      prompt: {
        es: "¿Cuál de estas líneas lanza un NullPointerException?",
        en: "Which of these lines throws a NullPointerException?",
      },
      code: {
        es: `String empty = '';
String missing = null;`,
        en: `String empty = '';
String missing = null;`,
      },
      options: [
        { es: "missing.length()", en: "missing.length()" },
        { es: "empty.length()", en: "empty.length()" },
        { es: "String.isBlank(missing)", en: "String.isBlank(missing)" },
        { es: "'x' + missing", en: "'x' + missing" },
      ],
      answer: 0,
      explain: {
        es: "empty sí es un texto —vacío, pero existe— y devuelve 0. missing no existe, así que no hay a quién pedirle length(). isBlank() está pensado precisamente para aceptar null.",
        en: "empty is a string — empty, but present — and returns 0. missing does not exist, so there is nobody to ask for length(). isBlank() exists precisely to accept null.",
      },
      tags: ["find-error"],
    },
    {
      id: "m01-l06-q3",
      kind: "single",
      prompt: {
        es: "Los Leads del formulario web a veces traen Region__c vacío, a veces con espacios y a veces sin rellenar. ¿Qué comprobación los cubre los tres casos?",
        en: "Web-form Leads sometimes arrive with Region__c empty, sometimes with spaces, sometimes never filled. Which check covers all three?",
      },
      options: [
        { es: "String.isBlank(lead.Region__c)", en: "String.isBlank(lead.Region__c)" },
        { es: "lead.Region__c == null", en: "lead.Region__c == null" },
        { es: "lead.Region__c == ''", en: "lead.Region__c == ''" },
        { es: "lead.Region__c.length() == 0", en: "lead.Region__c.length() == 0" },
      ],
      answer: 0,
      explain: {
        es: "isBlank() cubre null, cadena vacía y cadena de espacios de una vez. La última opción, además, explotaría justo en el caso que intenta detectar.",
        en: "isBlank() covers null, empty string and whitespace-only in one go. The last option would also explode on the exact case it is trying to detect.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m01-l06-q4",
      kind: "single",
      prompt: { es: "¿Cuál es el valor de result?", en: "What is the value of result?" },
      code: {
        es: `Account account = null;
String result = account?.Name;`,
        en: `Account account = null;
String result = account?.Name;`,
      },
      options: [
        { es: "null", en: "null" },
        { es: "''", en: "''" },
        { es: "Lanza NullPointerException.", en: "It throws a NullPointerException." },
        { es: "'null'", en: "'null'" },
      ],
      answer: 0,
      explain: {
        es: "El operador ?. corta la expresión en cuanto encuentra un null y devuelve null en lugar de lanzar la excepción. Evita el error, pero no decide por ti qué poner en su lugar.",
        en: "The ?. operator short-circuits as soon as it meets a null and returns null instead of throwing. It avoids the error, but it does not decide what goes there instead.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m01-l06-q5",
      kind: "multi",
      prompt: {
        es: "¿Cuáles de estas variables valen null justo después de declararse?",
        en: "Which of these variables are null right after being declared?",
      },
      options: [
        { es: "Integer count;", en: "Integer count;" },
        { es: "Boolean isActive;", en: "Boolean isActive;" },
        { es: "String region;", en: "String region;" },
        { es: "Integer count = 0;", en: "Integer count = 0;" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Todo lo declarado sin asignar vale null, incluidos los números y los Boolean. Solo la cuarta tiene un valor real, que además no es null sino cero.",
        en: "Anything declared without a value is null, numbers and Booleans included. Only the fourth has a real value — and that value is zero, not null.",
      },
    },
    {
      id: "m01-l06-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿qué vale el campo Id de un registro creado con new y todavía no guardado?",
        en: "Review: what is the Id field of a record created with new and not yet saved?",
      },
      options: [
        { es: "null", en: "null" },
        { es: "Una cadena vacía.", en: "An empty string." },
        { es: "Un Id temporal.", en: "A temporary Id." },
        { es: "0", en: "0" },
      ],
      answer: 0,
      explain: {
        es: "null, que es justo el caso que acabas de estudiar: leer account.Id.length() sobre un registro sin guardar sería un NullPointerException.",
        en: "null — exactly the case you just studied: reading account.Id.length() on an unsaved record would be a NullPointerException.",
      },
      tags: ["spaced", "interleaving"],
      from: { es: "Repaso · M1 L5", en: "Review · M1 L5" },
    },
  ],

  exercise: {
    prompt: {
      es: "Los Leads del formulario web llegan con huecos. Antes de tocar nada, escribe el diagnóstico: qué falta y qué se puede usar. No cambies los datos todavía —eso es la sub-lección siguiente— y no dejes que el código explote con ninguno de los dos Leads.",
      en: "Web-form Leads arrive with gaps. Before touching anything, write the diagnosis: what is missing and what is usable. Do not change the data yet — that is the next sub-lesson — and do not let the code explode on either Lead.",
    },
    brief: [
      {
        es: "Parte de los dos Leads que ya están en el código de partida. No los modifiques.",
        en: "Start from the two Leads already in the starter code. Do not modify them.",
      },
      {
        es: "regionMissing: Boolean que diga si la región del Lead incompleto está ausente, vacía o solo con espacios. Elige la comprobación que cubre los tres casos.",
        en: "regionMissing: a Boolean saying whether the incomplete Lead's region is absent, empty or whitespace-only. Choose the check that covers all three.",
      },
      {
        es: "companyUsable: Boolean que diga si la empresa del Lead incompleto sí se puede usar.",
        en: "companyUsable: a Boolean saying whether the incomplete Lead's company is actually usable.",
      },
      {
        es: "safeRegionUpper: la región del Lead incompleto en mayúsculas, sin que el código falle si no existe. Usa el operador de navegación segura.",
        en: "safeRegionUpper: the incomplete Lead's region in upper case, without the code failing when it is missing. Use the safe navigation operator.",
      },
      {
        es: "employeesMissing: Boolean que diga si el número de empleados del Lead incompleto no tiene valor. Para un número no sirve isBlank().",
        en: "employeesMissing: a Boolean saying whether the incomplete Lead's employee count has no value. isBlank() does not work for a number.",
      },
    ],
    starter: {
      es: `Lead completeLead = new Lead(
    Company = 'Globex Industries',
    LastName = 'Fernández',
    NumberOfEmployees = 120
);
completeLead.Region__c = 'EMEA';

Lead incompleteLead = new Lead(LastName = 'Ruiz');
incompleteLead.Company = '   ';

// Diagnostica el Lead incompleto. Que no explote nada.

`,
      en: `Lead completeLead = new Lead(
    Company = 'Globex Industries',
    LastName = 'Fernandez',
    NumberOfEmployees = 120
);
completeLead.Region__c = 'EMEA';

Lead incompleteLead = new Lead(LastName = 'Ruiz');
incompleteLead.Company = '   ';

// Diagnose the incomplete Lead. Nothing should explode.

`,
    },
    hints: [
      {
        es: "Mira cada línea y pregúntate: si ese campo fuera null, ¿esta línea sobreviviría? Hay una que llama a un método directamente sobre un campo vacío.",
        en: "Read each line and ask: if that field were null, would this line survive? One of them calls a method straight on an empty field.",
      },
      {
        es: "Para texto, String.isBlank() e isNotBlank() aceptan null sin quejarse. Para un número no existe isBlank: la comprobación es comparar con null usando == o !=. Y para leer sin riesgo está ?.",
        en: "For text, String.isBlank() and isNotBlank() accept null without complaining. For a number there is no isBlank: the check is comparing against null with == or !=. And to read without risk there is ?.",
      },
      {
        es: "Pseudocódigo: Boolean regionMissing = String.isBlank(incompleteLead.Region__c); y String safeRegionUpper = incompleteLead.Region__c?.toUpperCase();",
        en: "Pseudocode: Boolean regionMissing = String.isBlank(incompleteLead.Region__c); and String safeRegionUpper = incompleteLead.Region__c?.toUpperCase();",
      },
    ],
    solution: {
      es: `Boolean regionMissing = String.isBlank(incompleteLead.Region__c);
Boolean companyUsable = String.isNotBlank(incompleteLead.Company);
String safeRegionUpper = incompleteLead.Region__c?.toUpperCase();
Boolean employeesMissing = incompleteLead.NumberOfEmployees == null;`,
      en: `Boolean regionMissing = String.isBlank(incompleteLead.Region__c);
Boolean companyUsable = String.isNotBlank(incompleteLead.Company);
String safeRegionUpper = incompleteLead.Region__c?.toUpperCase();
Boolean employeesMissing = incompleteLead.NumberOfEmployees == null;`,
    },
    checks: [
      {
        id: "l06-c1",
        label: {
          es: "regionMissing usa isBlank sobre el campo del Lead",
          en: "regionMissing uses isBlank on the Lead's field",
        },
        rule: {
          op: "match",
          pattern:
            "Boolean\\s+regionMissing\\s*=\\s*String\\s*\\.\\s*isBlank\\s*\\(\\s*incompleteLead\\s*\\.\\s*Region__c\\s*\\)",
        },
        onFail: {
          es: "Comparar solo con null dejaría pasar la cadena vacía y la de espacios, que es exactamente lo que manda un formulario web. String.isBlank() cubre los tres casos de una vez.",
          en: "Comparing against null alone would let the empty string and the whitespace string through — exactly what a web form sends. String.isBlank() covers all three at once.",
        },
        onPass: {
          es: "isBlank() en vez de == null: has cubierto el caso que de verdad llega en producción, no solo el de manual.",
          en: "isBlank() instead of == null: you covered the case that actually arrives in production, not just the textbook one.",
        },
      },
      {
        id: "l06-c2",
        label: {
          es: "companyUsable comprueba que la empresa sí sirve",
          en: "companyUsable checks the company is actually usable",
        },
        rule: {
          op: "any",
          of: [
            {
              op: "match",
              pattern:
                "Boolean\\s+companyUsable\\s*=\\s*String\\s*\\.\\s*isNotBlank\\s*\\(\\s*incompleteLead\\s*\\.\\s*Company\\s*\\)",
            },
            {
              op: "match",
              pattern:
                "Boolean\\s+companyUsable\\s*=\\s*!\\s*String\\s*\\.\\s*isBlank\\s*\\(\\s*incompleteLead\\s*\\.\\s*Company\\s*\\)",
            },
          ],
        },
        onFail: {
          es: "La empresa de este Lead es '   ': existe, pero no sirve para nada. isNotBlank() responde a «¿puedo usarlo?», que es la pregunta real.",
          en: "This Lead's company is '   ': it exists, but it is useless. isNotBlank() answers “can I use it?”, which is the real question.",
        },
      },
      {
        id: "l06-c3",
        label: {
          es: "safeRegionUpper usa navegación segura",
          en: "safeRegionUpper uses safe navigation",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "String\\s+safeRegionUpper\\s*=" },
            { op: "match", pattern: "Region__c\\s*\\?\\.\\s*toUpperCase\\s*\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "Con el punto normal, toUpperCase() sobre un campo vacío lanza NullPointerException y para la transacción. Con ?. la expresión devuelve null y el código sigue.",
          en: "With the plain dot, toUpperCase() on an empty field throws a NullPointerException and halts the transaction. With ?. the expression returns null and the code carries on.",
        },
      },
      {
        id: "l06-c4",
        label: {
          es: "employeesMissing compara el número con null",
          en: "employeesMissing compares the number against null",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Boolean\\s+employeesMissing\\s*=" },
            {
              op: "match",
              pattern: "incompleteLead\\s*\\.\\s*NumberOfEmployees\\s*==\\s*null",
            },
          ],
        },
        onFail: {
          es: "isBlank() solo existe para texto. Para un número, la comprobación es comparar con null: NumberOfEmployees == null.",
          en: "isBlank() only exists for text. For a number, the check is a comparison against null: NumberOfEmployees == null.",
        },
      },
      {
        id: "l06-c5",
        label: {
          es: "Ninguna línea llama a un método directamente sobre un campo que puede faltar",
          en: "No line calls a method straight on a field that may be missing",
        },
        rule: {
          op: "absent",
          pattern:
            "incompleteLead\\s*\\.\\s*(Region__c|Company)\\s*\\.\\s*(toUpperCase|toLowerCase|trim|length|substring)\\s*\\(",
        },
        onFail: {
          es: "Queda una llamada directa sobre un campo que puede venir vacío. O la envuelves en una comprobación, o usas ?. — pero tal cual, un solo Lead sin región tira la carga entera.",
          en: "There is still a direct call on a field that can arrive empty. Either guard it or use ?. — as written, one region-less Lead brings the whole load down.",
        },
      },
    ],
    rubric: [
      {
        es: "Ahora tienes el diagnóstico, pero los datos siguen igual. ¿Con qué los sustituirías cuando faltan? Esa decisión es la sub-lección 7.",
        en: "You have the diagnosis, but the data is unchanged. What would you substitute when a value is missing? That decision is sub-lesson 7.",
      },
    ],
  },
};
