import type { Lesson } from "@/lib/types";

export const l03String: Lesson = {
  id: "m01-l03",
  slug: "string",
  n: 3,
  kind: "lesson",
  minutes: 26,
  title: { es: "String y qué es un método", en: "String and what a method is" },
  summary: {
    es: "El texto es el tipo con el que más vas a pelear. Antes de listar sus herramientas, hay que entender qué es exactamente una «herramienta» en Apex.",
    en: "Text is the type you will wrestle with most. Before listing its tools, you need to know what a “tool” actually is in Apex.",
  },
  analogy: {
    es: "Las funciones de fórmula: TRIM(), UPPER(), CONTAINS()",
    en: "Formula functions: TRIM(), UPPER(), CONTAINS()",
  },
  objectives: [
    {
      es: "Explicar qué es un método y qué devuelve, sin recurrir a ejemplos.",
      en: "Explain what a method is and what it returns, without leaning on examples.",
    },
    {
      es: "Usar los métodos de String más habituales para limpiar y componer texto.",
      en: "Use the common String methods to clean and compose text.",
    },
    {
      es: "Saber por qué comparar textos con == en Apex sorprende a todo el mundo una vez.",
      en: "Know why comparing text with == in Apex surprises everyone exactly once.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Si alguna vez escribiste TRIM(LastName) o UPPER(Country) en un campo fórmula, ya has usado métodos sin llamarlos así. La diferencia es de puntuación: donde la fórmula pone la función delante, Apex la pega detrás del dato.",
        en: "If you ever wrote TRIM(LastName) or UPPER(Country) in a formula field, you have already used methods without calling them that. The difference is punctuation: where the formula puts the function in front, Apex attaches it behind the value.",
      },
    },
    {
      type: "h",
      text: { es: "Primero: qué es un método", en: "First: what a method is" },
    },
    {
      type: "p",
      text: {
        es: "Un método es una acción con nombre que un dato sabe hacer consigo mismo. Se escribe pegado al dato con un punto, lleva paréntesis —siempre, aunque estén vacíos— y termina devolviendo algo: un texto nuevo, un número, un sí o un no.",
        en: "A method is a named action a value knows how to perform on itself. You write it attached to the value with a dot, it always carries brackets — even empty ones — and it ends by returning something: a new piece of text, a number, a yes or a no.",
      },
    },
    {
      type: "diagram",
      id: "m01-method-anatomy",
      caption: {
        es: "El dato entra, el método actúa, y lo que sale es un valor nuevo. El original se queda como estaba.",
        en: "The value goes in, the method acts, and what comes out is a new value. The original is untouched.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Los paréntesis no son decorativos", en: "The brackets are not decoration" },
      text: {
        es: "Los paréntesis son lo que convierte el nombre de una acción en la acción ejecutándose. Dentro van los argumentos: los datos extra que el método necesita. trim() no necesita ninguno; replace('a', 'b') necesita dos.",
        en: "The brackets are what turn the name of an action into the action actually running. Inside go the arguments: the extra data the method needs. trim() needs none; replace('a', 'b') needs two.",
      },
    },
    {
      type: "p",
      text: {
        es: "Y hay un detalle que confunde al principio: un String en Apex es [[inmutable]]. Ningún método lo cambia por dentro. Todos devuelven un texto nuevo, así que si no guardas el resultado en algún sitio, el trabajo se pierde.",
        en: "And there is a detail that trips everyone up at first: a String in Apex is [[inmutable|immutable]]. No method changes it from the inside. They all return a new piece of text, so if you do not store the result somewhere, the work is thrown away.",
      },
    },
    {
      type: "code",
      code: {
        es: `String rawName = '  acme corp  ';

rawName.trim();                    // se calcula… y se tira
String cleanName = rawName.trim(); // se calcula y se guarda`,
        en: `String rawName = '  acme corp  ';

rawName.trim();                    // computed… and discarded
String cleanName = rawName.trim(); // computed and stored`,
      },
    },
    {
      type: "h",
      text: { es: "Escribir texto en Apex", en: "Writing text in Apex" },
    },
    {
      type: "p",
      text: {
        es: "El texto va entre comillas simples, no dobles. Si necesitas una comilla dentro del texto, se escapa con una barra invertida. Y para unir textos se usa el signo más, igual que en una fórmula se usa el ampersand.",
        en: "Text goes in single quotes, not double. If you need a quote inside the text, escape it with a backslash. And to join pieces of text you use plus, the way a formula uses an ampersand.",
      },
    },
    {
      type: "code",
      code: {
        es: `String company = 'Northwind';
String owner = 'María';
String note = 'Cuenta de ' + owner + ': ' + company;
String quoted = 'El cliente dijo \\'sí\\' ayer';`,
        en: `String company = 'Northwind';
String owner = 'Maria';
String note = 'Account of ' + owner + ': ' + company;
String quoted = 'The client said \\'yes\\' yesterday';`,
      },
    },
    {
      type: "h",
      text: { es: "Los métodos de String que usarás cada día", en: "The String methods you will use daily" },
    },
    {
      type: "table",
      head: [
        { es: "Método", en: "Method" },
        { es: "Qué devuelve", en: "What it returns" },
        { es: "Su primo en fórmulas", en: "Its formula cousin" },
      ],
      rows: [
        [
          { es: "length()", en: "length()" },
          { es: "Integer: cuántos caracteres.", en: "Integer: how many characters." },
          { es: "LEN()", en: "LEN()" },
        ],
        [
          { es: "trim()", en: "trim()" },
          { es: "String sin espacios al principio ni al final.", en: "String with no leading or trailing spaces." },
          { es: "TRIM()", en: "TRIM()" },
        ],
        [
          { es: "toUpperCase() / toLowerCase()", en: "toUpperCase() / toLowerCase()" },
          { es: "String en mayúsculas o minúsculas.", en: "String in upper or lower case." },
          { es: "UPPER() / LOWER()", en: "UPPER() / LOWER()" },
        ],
        [
          { es: "contains('texto')", en: "contains('text')" },
          { es: "Boolean: si aparece dentro.", en: "Boolean: whether it appears inside." },
          { es: "CONTAINS()", en: "CONTAINS()" },
        ],
        [
          { es: "startsWith(…) / endsWith(…)", en: "startsWith(…) / endsWith(…)" },
          { es: "Boolean: si empieza o acaba así.", en: "Boolean: whether it starts or ends that way." },
          { es: "BEGINS()", en: "BEGINS()" },
        ],
        [
          { es: "substring(0, 3)", en: "substring(0, 3)" },
          { es: "String: un trozo, desde una posición hasta otra.", en: "String: a slice, from one position to another." },
          { es: "MID() / LEFT()", en: "MID() / LEFT()" },
        ],
        [
          { es: "replace('a', 'b')", en: "replace('a', 'b')" },
          { es: "String con todas las apariciones sustituidas.", en: "String with every occurrence swapped." },
          { es: "SUBSTITUTE()", en: "SUBSTITUTE()" },
        ],
        [
          { es: "capitalize()", en: "capitalize()" },
          { es: "String con la primera letra en mayúscula.", en: "String with the first letter capitalised." },
          { es: "—", en: "—" },
        ],
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Las posiciones empiezan en 0", en: "Positions start at 0" },
      text: {
        es: "substring(0, 3) devuelve los tres primeros caracteres: empieza en la posición 0 y para justo antes de la 3. No es un despiste de Apex, es la convención de casi todos los lenguajes, y choca de frente con MID(), que en fórmulas empieza en 1.",
        en: "substring(0, 3) returns the first three characters: it starts at position 0 and stops just before 3. That is not an Apex quirk, it is the convention in almost every language — and it collides head-on with MID(), which starts at 1 in formulas.",
      },
    },
    {
      type: "h",
      text: { es: "Métodos que se le piden al tipo, no al dato", en: "Methods you ask the type, not the value" },
    },
    {
      type: "p",
      text: {
        es: "Casi todos los métodos se escriben sobre el dato: nombre.trim(). Pero algunos se escriben sobre la palabra String, con el dato dentro de los paréntesis. Son los que tienen que funcionar aunque el dato no exista todavía, y por eso son los que salvan el día cuando el texto puede venir vacío.",
        en: "Most methods are written on the value: name.trim(). But some are written on the word String, with the value inside the brackets. Those are the ones that must work even when the value does not exist yet — which is exactly why they save the day when the text might arrive empty.",
      },
    },
    {
      type: "code",
      code: {
        es: `String region = '   ';

Boolean a = String.isBlank(region);    // true: vacío o solo espacios
Boolean b = String.isNotBlank(region); // false
String c = String.valueOf(42);         // '42': convierte a texto`,
        en: `String region = '   ';

Boolean a = String.isBlank(region);    // true: empty or only spaces
Boolean b = String.isNotBlank(region); // false
String c = String.valueOf(42);         // '42': converts to text`,
      },
      caption: {
        es: "String.isBlank() es el método más útil de todo este módulo. Vuelve en la sub-lección de Null y no te abandona nunca más.",
        en: "String.isBlank() is the single most useful method in this module. It comes back in the Null sub-lesson and never leaves you again.",
      },
    },
    {
      type: "h",
      text: { es: "Comparar textos: la sorpresa de Apex", en: "Comparing text: the Apex surprise" },
    },
    {
      type: "p",
      text: {
        es: "En casi todos los lenguajes, comparar dos textos distingue mayúsculas de minúsculas. En Apex, el operador == aplicado a Strings no las distingue: 'EMEA' == 'emea' es verdadero. Si necesitas una comparación estricta, existe el método equals(), que sí distingue.",
        en: "In almost every language, comparing two strings is case-sensitive. In Apex, the == operator on Strings is not: 'EMEA' == 'emea' is true. If you need a strict comparison, the equals() method is case-sensitive.",
      },
    },
    {
      type: "code",
      code: {
        es: `Boolean loose  = 'EMEA' == 'emea';          // true
Boolean strict = 'EMEA'.equals('emea');     // false
Boolean loose2 = 'EMEA'.equalsIgnoreCase('emea'); // true, y se lee mejor`,
        en: `Boolean loose  = 'EMEA' == 'emea';          // true
Boolean strict = 'EMEA'.equals('emea');     // false
Boolean loose2 = 'EMEA'.equalsIgnoreCase('emea'); // true, and it reads better`,
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Por qué esto te suena", en: "Why this rings a bell" },
      text: {
        es: "Es el mismo comportamiento de un filtro de informe: si filtras Industry igual a «technology» te salen también los «Technology». Cómodo el 90 % de las veces, y una fuente silenciosa de bugs el 10 % restante, cuando comparas códigos o claves donde la mayúscula sí significa algo.",
        en: "It is the same behaviour as a report filter: filter Industry equals “technology” and you also get the “Technology” rows. Convenient 90% of the time, and a silent source of bugs the other 10%, when you are comparing codes or keys where case actually means something.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿por qué rawName.toUpperCase(); en una línea suelta no sirve para nada? ¿Y qué devuelve contains()?",
        en: "Without looking up: why is rawName.toUpperCase(); on a line of its own completely useless? And what does contains() return?",
      },
    },
  ],

  quiz: [
    {
      id: "m01-l03-q1",
      kind: "single",
      prompt: { es: "¿Qué imprime este código?", en: "What does this code print?" },
      code: {
        es: `String city = '  Madrid  ';
city.trim();
System.debug(city.length());`,
        en: `String city = '  Madrid  ';
city.trim();
System.debug(city.length());`,
      },
      options: [
        { es: "10", en: "10" },
        { es: "6", en: "6" },
        { es: "8", en: "8" },
        { es: "null", en: "null" },
      ],
      answer: 0,
      explain: {
        es: "trim() devuelve un texto nuevo, pero nadie lo guardó, así que city sigue siendo '  Madrid  ': 6 letras más 4 espacios, 10 caracteres.",
        en: "trim() returns a new string, but nobody stored it, so city is still '  Madrid  ': 6 letters plus 4 spaces, 10 characters.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m01-l03-q2",
      kind: "single",
      prompt: {
        es: "¿Cuál es el valor de match?",
        en: "What is the value of match?",
      },
      code: {
        es: `String stored = 'Closed Won';
Boolean match = stored == 'closed won';`,
        en: `String stored = 'Closed Won';
Boolean match = stored == 'closed won';`,
      },
      options: [
        { es: "true", en: "true" },
        { es: "false", en: "false" },
        { es: "null", en: "null" },
        { es: "No compila.", en: "It does not compile." },
      ],
      answer: 0,
      explain: {
        es: "El operador == sobre Strings en Apex ignora mayúsculas y minúsculas. Para una comparación estricta hay que usar equals().",
        en: "The == operator on Strings in Apex ignores case. For a strict comparison you need equals().",
      },
      tags: ["predict-output"],
    },
    {
      id: "m01-l03-q3",
      kind: "single",
      prompt: {
        es: "¿Qué devuelve este método, es decir, de qué tipo es el valor que sale?",
        en: "What does this method return — that is, what type is the value that comes out?",
      },
      code: {
        es: `'Acme Corporation'.contains('Corp')`,
        en: `'Acme Corporation'.contains('Corp')`,
      },
      options: [
        { es: "Boolean", en: "Boolean" },
        { es: "String", en: "String" },
        { es: "Integer", en: "Integer" },
        { es: "No devuelve nada.", en: "It returns nothing." },
      ],
      answer: 0,
      explain: {
        es: "contains() responde a una pregunta de sí o no, así que devuelve un Boolean. Cada método devuelve un tipo concreto, y saber cuál es lo que te permite encadenarlos o guardarlos.",
        en: "contains() answers a yes/no question, so it returns a Boolean. Every method returns a specific type, and knowing which one is what lets you chain or store it.",
      },
      tags: ["recall"],
    },
    {
      id: "m01-l03-q4",
      kind: "single",
      prompt: {
        es: "Quieres quedarte con los cuatro primeros caracteres de un código de producto. ¿Cuál es correcto?",
        en: "You want the first four characters of a product code. Which one is right?",
      },
      options: [
        { es: "code.substring(0, 4)", en: "code.substring(0, 4)" },
        { es: "code.substring(1, 4)", en: "code.substring(1, 4)" },
        { es: "code.substring(4)", en: "code.substring(4)" },
        { es: "MID(code, 1, 4)", en: "MID(code, 1, 4)" },
      ],
      answer: 0,
      explain: {
        es: "Las posiciones empiezan en 0 y el segundo número marca dónde parar, sin incluirlo. La cuarta opción es sintaxis de fórmulas, que no existe en Apex.",
        en: "Positions start at 0 and the second number marks where to stop, exclusive. The fourth option is formula syntax, which does not exist in Apex.",
      },
      tags: ["find-error"],
    },
    {
      id: "m01-l03-q5",
      kind: "text",
      prompt: {
        es: "¿Qué método escribirías para comprobar si un texto está vacío, es solo espacios o ni siquiera existe? Escribe la llamada completa con la variable region dentro.",
        en: "Which method would you write to check whether a piece of text is empty, all spaces, or does not even exist? Write the full call with the variable region inside.",
      },
      accept: ["string\\.isblank\\(\\s*region\\s*\\)"],
      placeholder: { es: "String…", en: "String…" },
      explain: {
        es: "String.isBlank(region). Se le pide al tipo, no al dato, precisamente porque tiene que funcionar aunque region no exista.",
        en: "String.isBlank(region). You ask the type, not the value, precisely because it has to work even when region does not exist.",
      },
      tags: ["recall"],
    },
    {
      id: "m01-l03-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿qué tipo elegirías para el resultado de dividir dos importes de contrato?",
        en: "Review: which type would you choose for the result of dividing two contract amounts?",
      },
      options: [
        { es: "Decimal", en: "Decimal" },
        { es: "Integer", en: "Integer" },
        { es: "Double", en: "Double" },
        { es: "String", en: "String" },
      ],
      answer: 0,
      explain: {
        es: "Decimal: hay decimales y hay dinero, así que hace falta exactitud. Integer cortaría el resultado y Double lo aproximaría.",
        en: "Decimal: there are decimals and there is money, so exactness matters. Integer would truncate the result and Double would approximate it.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M1 L2", en: "Review · M1 L2" },
    },
  ],

  exercise: {
    prompt: {
      es: "Los Leads del formulario web llegan sucios: el nombre de empresa viene con espacios y en minúsculas, y marketing quiere un código de campaña en mayúsculas. Limpia los datos y compón el saludo, sin escribir ningún resultado a mano.",
      en: "Leads from the web form arrive dirty: the company name comes with spaces and in lower case, and marketing wants a campaign code in upper case. Clean the data and compose the greeting, without typing any result by hand.",
    },
    brief: [
      {
        es: "Parte de esta línea tal cual: String rawCompany = '  northwind trading  ';",
        en: "Start from this exact line: String rawCompany = '  northwind trading  ';",
      },
      {
        es: "cleanCompany: rawCompany sin los espacios de los extremos.",
        en: "cleanCompany: rawCompany with the outer spaces removed.",
      },
      {
        es: "companyCode: los cuatro primeros caracteres de cleanCompany, en mayúsculas ('NORT').",
        en: "companyCode: the first four characters of cleanCompany, in upper case ('NORT').",
      },
      {
        es: "nameLength: cuántos caracteres tiene cleanCompany. Elige tú el tipo.",
        en: "nameLength: how many characters cleanCompany has. You choose the type.",
      },
      {
        es: "greeting: el texto 'Hola, ' seguido de cleanCompany.",
        en: "greeting: the text 'Hello, ' followed by cleanCompany.",
      },
      {
        es: "Todos los valores se calculan con métodos. No escribas 'NORT' ni el número 17 a mano.",
        en: "Every value is computed with methods. Do not type 'NORT' or the number 17 by hand.",
      },
    ],
    starter: {
      es: `String rawCompany = '  northwind trading  ';

// Limpia, recorta, cuenta y saluda. Todo con métodos.

`,
      en: `String rawCompany = '  northwind trading  ';

// Clean, slice, count and greet. All with methods.

`,
    },
    hints: [
      {
        es: "Comprueba si estás guardando el resultado de cada método. Una llamada suelta en su propia línea calcula y tira el resultado.",
        en: "Check that you are storing the result of every method call. A bare call on its own line computes the value and throws it away.",
      },
      {
        es: "Los métodos se pueden encadenar: lo que devuelve uno es un dato al que se le puede pedir otro. Y recuerda que las posiciones de substring empiezan en 0.",
        en: "Methods can be chained: what one returns is a value you can ask the next one. And remember substring positions start at 0.",
      },
      {
        es: "Pseudocódigo: String companyCode = cleanCompany.substring(0, 4).toUpperCase(); — y para unir textos, el signo más.",
        en: "Pseudocode: String companyCode = cleanCompany.substring(0, 4).toUpperCase(); — and to join text, the plus sign.",
      },
    ],
    solution: {
      es: `String rawCompany = '  northwind trading  ';

String cleanCompany = rawCompany.trim();
String companyCode = cleanCompany.substring(0, 4).toUpperCase();
Integer nameLength = cleanCompany.length();
String greeting = 'Hola, ' + cleanCompany;`,
      en: `String rawCompany = '  northwind trading  ';

String cleanCompany = rawCompany.trim();
String companyCode = cleanCompany.substring(0, 4).toUpperCase();
Integer nameLength = cleanCompany.length();
String greeting = 'Hello, ' + cleanCompany;`,
    },
    checks: [
      {
        id: "l03-c1",
        label: {
          es: "cleanCompany guarda el resultado de trim()",
          en: "cleanCompany stores the result of trim()",
        },
        rule: {
          op: "match",
          pattern: "String\\s+cleanCompany\\s*=\\s*rawCompany\\s*\\.\\s*trim\\s*\\(\\s*\\)",
        },
        onFail: {
          es: "trim() no modifica rawCompany: devuelve un texto nuevo. Si no lo asignas a cleanCompany, el trabajo se pierde.",
          en: "trim() does not modify rawCompany: it returns a new string. If you do not assign it to cleanCompany, the work is lost.",
        },
      },
      {
        id: "l03-c2",
        label: {
          es: "companyCode se calcula, no se escribe",
          en: "companyCode is computed, not typed",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "String\\s+companyCode\\s*=" },
            { op: "match", pattern: "substring\\s*\\(\\s*0\\s*,\\s*4\\s*\\)" },
            { op: "match", pattern: "toUpperCase\\s*\\(\\s*\\)" },
            { op: "absent", pattern: "companyCode\\s*=\\s*'NORT'" },
          ],
        },
        onFail: {
          es: "Necesitas los cuatro primeros caracteres —substring(0, 4), porque se empieza a contar en 0— y luego pasarlos a mayúsculas. Escribir 'NORT' a mano funciona hoy y falla con el siguiente Lead.",
          en: "You need the first four characters — substring(0, 4), because counting starts at 0 — and then upper-case them. Typing 'NORT' works today and breaks on the next Lead.",
        },
        onPass: {
          es: "Encadenar substring().toUpperCase() es idiomático: cada método recibe lo que devolvió el anterior.",
          en: "Chaining substring().toUpperCase() is idiomatic: each method receives what the previous one returned.",
        },
      },
      {
        id: "l03-c3",
        label: {
          es: "nameLength es Integer y usa length()",
          en: "nameLength is an Integer and uses length()",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Integer\\s+nameLength\\s*=" },
            { op: "match", pattern: "nameLength\\s*=\\s*cleanCompany\\s*\\.\\s*length\\s*\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "length() cuenta caracteres, así que devuelve un Integer. Y tiene que contar cleanCompany, no rawCompany: los espacios ya no cuentan.",
          en: "length() counts characters, so it returns an Integer. And it must count cleanCompany, not rawCompany: the spaces are gone now.",
        },
      },
      {
        id: "l03-c4",
        label: {
          es: "greeting concatena el saludo con cleanCompany",
          en: "greeting concatenates the greeting with cleanCompany",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "String\\s+greeting\\s*=" },
            { op: "match", pattern: "greeting\\s*=\\s*'[^']*'\\s*\\+\\s*cleanCompany" },
          ],
        },
        onFail: {
          es: "Se unen textos con el signo más, y la parte variable tiene que ser cleanCompany: si escribes el nombre dentro de las comillas, el saludo no cambia nunca.",
          en: "Text is joined with a plus, and the variable part must be cleanCompany: if you type the name inside the quotes, the greeting never changes.",
        },
      },
      {
        id: "l03-c5",
        label: {
          es: "No se descarta ninguna llamada a método",
          en: "No method call is thrown away",
        },
        rule: {
          op: "absent",
          pattern: "^\\s*\\w+\\s*\\.\\s*(trim|toUpperCase|toLowerCase|substring)\\s*\\([^)]*\\)\\s*;\\s*$",
          flags: "im",
        },
        onFail: {
          es: "Hay una llamada a un método en su propia línea, sin asignar. Los String son inmutables: ese resultado se calcula y se descarta.",
          en: "There is a method call on its own line, unassigned. Strings are immutable: that result is computed and discarded.",
        },
        optional: true,
      },
    ],
    rubric: [
      {
        es: "Si mañana el formulario envía '   ' como empresa, ¿qué haría substring(0, 4)? Guárdate la pregunta para la sub-lección de Null.",
        en: "If the form sent '   ' as the company tomorrow, what would substring(0, 4) do? Hold that question for the Null sub-lesson.",
      },
    ],
  },
};
