import type { Lesson } from "@/lib/types";

export const l03String: Lesson = {
  id: "m01-l03",
  slug: "string",
  n: 3,
  kind: "lesson",
  minutes: 22,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 2", en: "Remember? · Review of lesson 2" },
    prompt: { es: "Vas a guardar el importe de un contrato. ¿Qué tipo usas?", en: "You are going to store a contract amount. Which type do you use?" },
    options: [
      { es: "Decimal", en: "Decimal" },
      { es: "Double", en: "Double" },
      { es: "Integer", en: "Integer" },
    ],
    answer: 0,
    explain: { es: "Decimal, siempre para dinero, como un campo Currency: Double aproxima e Integer se come los céntimos.", en: "Decimal, always for money, like a Currency field: Double approximates and Integer eats the cents." },
  },
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
      es: "Encadenar y anidar métodos, y leer cualquier combinación paso a paso como lees una fórmula anidada.",
      en: "Chain and nest methods, and read any combination step by step the way you read a nested formula.",
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
      text: { es: "Qué es un método", en: "What a method is" },
    },
    {
      type: "p",
      text: {
        es: "Un método es una acción con nombre que un dato sabe hacer consigo mismo. Se escribe pegado al dato con un punto, lleva paréntesis (siempre, aunque estén vacíos) y devuelve algo: un texto nuevo, un número, un sí o un no. Dentro de los paréntesis van los datos extra que necesita: trim() ninguno, replace('a', 'b') dos.",
        en: "A method is a named action a value knows how to perform on itself. You write it attached to the value with a dot, it always carries brackets (even empty ones) and it returns something: a new piece of text, a number, a yes or a no. Inside the brackets go the extra data it needs: trim() needs none, replace('a', 'b') needs two.",
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
      type: "p",
      text: {
        es: "Ese último detalle confunde al principio: un String es [[inmutable]]. Ningún método lo cambia por dentro; todos devuelven un texto nuevo, así que si no guardas el resultado, el trabajo se pierde.",
        en: "That last detail trips everyone up at first: a String is [[inmutable|immutable]]. No method changes it from the inside; they all return a new piece of text, so if you do not store the result, the work is thrown away.",
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
      text: { es: "Escribir texto y los métodos de cada día", en: "Writing text and the everyday methods" },
    },
    {
      type: "p",
      text: {
        es: "El texto va entre comillas simples, no dobles; si necesitas una comilla dentro, se escribe con una barra invertida delante. Para unir textos se usa el signo más, igual que en una fórmula se usa el ampersand.",
        en: "Text goes in single quotes, not double; if you need a quote inside, put a backslash in front of it. To join pieces of text you use plus, the way a formula uses an ampersand.",
      },
    },
    {
      type: "code",
      code: {
        es: `String owner = 'María';
String note = 'Cuenta de ' + owner + ': Northwind';   // 'Cuenta de María: Northwind'
String quoted = 'El cliente dijo \\'sí\\' ayer';     // El cliente dijo 'sí' ayer`,
        en: `String owner = 'Maria';
String note = 'Account of ' + owner + ': Northwind';  // 'Account of Maria: Northwind'
String quoted = 'The client said \\'yes\\' today'; // The client said 'yes' today`,
      },
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
          { es: "String con la primera letra en mayúscula; el resto se queda tal cual estaba.", en: "String with the first letter capitalised; the rest is left exactly as it was." },
          { es: "Sin equivalente directo", en: "None" },
        ],
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Las posiciones empiezan en 0", en: "Positions start at 0" },
      text: {
        es: "substring(0, 3) devuelve los tres primeros caracteres: empieza en la posición 0 y para justo antes de la 3. Choca de frente con MID(), que en fórmulas empieza en 1.",
        en: "substring(0, 3) returns the first three characters: it starts at position 0 and stops just before 3. It collides head-on with MID(), which starts at 1 in formulas.",
      },
    },
    {
      type: "h",
      text: { es: "Encadenar: un método detrás de otro", en: "Chaining: one method after another" },
    },
    {
      type: "p",
      text: {
        es: "Lo que devuelve un método es un dato nuevo, y a ese dato le puedes pedir otro método con otro punto. rawCompany.trim().substring(0, 4).toUpperCase() se lee de izquierda a derecha: cada paso actúa sobre lo que devolvió el anterior.",
        en: "What a method returns is a new value, and you can ask that value for another method with another dot. rawCompany.trim().substring(0, 4).toUpperCase() reads left to right: each step acts on what the previous one returned.",
      },
    },
    {
      type: "diagram",
      id: "m01-method-chain",
      caption: {
        es: "Pulsa Reproducir o avanza paso a paso: lo que sale de un paso es lo único que entra en el siguiente. Cambia a «Anidar» para ver el orden de dentro hacia fuera, que se explica más abajo.",
        en: "Press Play or step through: what comes out of one step is all that goes into the next. Switch to “Nest” to see the inside-out order, explained further down.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Como anidar funciones en una fórmula, pero al derecho", en: "Like nesting formula functions, but the right way round" },
      text: {
        es: "Yo ya hacía esto en fórmulas: UPPER(LEFT(Company, 4)) primero recorta y luego pone en mayúsculas, aunque lo escribas de fuera hacia dentro. En Apex se escribe en el mismo orden en que ocurre, de izquierda a derecha. A mí me resultó más fácil de seguir.",
        en: "I was already doing this in formulas: UPPER(LEFT(Company, 4)) trims first and upper-cases after, even though you write it outside in. In Apex you write it in the same order it happens, left to right. I found it easier to follow.",
      },
      voice: "otter",
    },
    {
      type: "code",
      code: {
        es: `String rawCompany = '  northwind trading  ';

// Desarmada: un paso por línea, cada resultado con nombre
String trimmed = rawCompany.trim();          // 'northwind trading'
String firstFour = trimmed.substring(0, 4);  // 'nort'
String code1 = firstFour.toUpperCase();      // 'NORT'

// Encadenada: los mismos tres pasos, en una línea
String code2 = rawCompany.trim().substring(0, 4).toUpperCase(); // 'NORT'`,
        en: `String rawCompany = '  northwind trading  ';

// Broken up: one step per line, every result named
String trimmed = rawCompany.trim();          // 'northwind trading'
String firstFour = trimmed.substring(0, 4);  // 'nort'
String code1 = firstFour.toUpperCase();      // 'NORT'

// Chained: the same three steps, on one line
String code2 = rawCompany.trim().substring(0, 4).toUpperCase(); // 'NORT'`,
      },
      caption: {
        es: "code1 y code2 valen lo mismo. Si una cadena no te sale, desármala: el paso que falla queda a la vista.",
        en: "code1 and code2 hold the same value. When a chain will not work, break it up: the failing step shows itself.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Cada eslabón tiene que encajar", en: "Every link has to fit" },
      text: {
        es: "Solo puedes pedirle a un eslabón los métodos de su tipo. name.trim().length() funciona, pero name.length().toUpperCase() no compila: length() devuelve un Integer, y un número no sabe ponerse en mayúsculas.",
        en: "You may only ask a link for the methods of its type. name.trim().length() works, but name.length().toUpperCase() does not compile: length() returns an Integer, and a number does not know how to upper-case itself.",
      },
    },
    {
      type: "h",
      text: { es: "String es una clase que ya trae Apex", en: "String is a class Apex already ships" },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Como un objeto estándar", en: "Like a standard object" },
      text: {
        es: "Así lo entendí yo: String es como Account. No lo creas tú, viene con Apex y ya trae sus «botones», que son sus métodos. Cada texto concreto, como 'Ana Torres', es como un registro. Y hay dos tipos de botón: los que se pulsan en un registro (nombre.trim(): «este texto, límpiate») y los que se pulsan en el objeto, como «Nuevo» (String.valueOf(42): «clase String, fabrícame un texto con esto»). Simplificación: un registro se guarda en la base de datos; un texto solo vive mientras corre tu código.",
        en: "This is how I understood it: String is like Account. You do not create it, it comes with Apex and already has its «buttons», which are its methods. Each specific text, like 'Ana Torres', is like a record. And there are two kinds of button: the ones you press on a record (name.trim(): «this text, clean yourself up») and the ones you press on the object, like «New» (String.valueOf(42): «String class, make me a text out of this»). Simplification: a record is stored in the database; a text only lives while your code runs.",
      },
      voice: "otter",
    },
    {
      type: "p",
      text: {
        es: "Los métodos de la clase llevan el dato dentro de los paréntesis. Dos te van a acompañar todo el curso: String.isBlank(), que funciona aunque el texto ni siquiera exista, y String.valueOf(), el TEXT() de tus fórmulas, que convierte un número o una fecha en texto.",
        en: "Class methods take the value inside the brackets. Two will be with you all course long: String.isBlank(), which works even when the text does not exist at all, and String.valueOf(), your formula TEXT(), which turns a number or a date into text.",
      },
    },
    {
      type: "code",
      code: {
        es: `String region = '   ';
Integer total = 42;

Boolean empty = String.isBlank(region);   // true: vacío, solo espacios o null
String a = total;                         // ✗ no compila: 42 es un número, no un texto
String b = String.valueOf(total);         // ✓ '42'
String c = 'Total: ' + total;             // ✓ al pegarlo con +, Apex lo convierte solo`,
        en: `String region = '   ';
Integer total = 42;

Boolean empty = String.isBlank(region);   // true: empty, only spaces or null
String a = total;                         // ✗ does not compile: 42 is a number, not text
String b = String.valueOf(total);         // ✓ '42'
String c = 'Total: ' + total;             // ✓ attached with +, Apex converts it for you`,
      },
      caption: {
        es: "Regla práctica: si el número va solo a una variable String, necesitas String.valueOf(); si lo pegas a un texto con +, no. La sub-lección de Casting vuelve a esto con calma.",
        en: "Rule of thumb: if the number goes on its own into a String variable, you need String.valueOf(); if you attach it to text with +, you do not. The Casting sub-lesson comes back to this calmly.",
      },
    },
    {
      type: "h",
      text: { es: "Anidar: un método dentro de los paréntesis de otro", en: "Nesting: one method inside another's brackets" },
    },
    {
      type: "p",
      text: {
        es: "Una llamada a un método ES un valor, así que puede ir dentro de los paréntesis de otra. Aquí la lectura sí es de dentro hacia fuera, como en una fórmula: Apex resuelve primero lo de dentro y le pasa el resultado al de fuera.",
        en: "A method call IS a value, so it can go inside another call's brackets. Here the reading really is inside out, like a formula: Apex resolves the inside first and hands the result to the outer call.",
      },
    },
    {
      type: "code",
      code: {
        es: `String rawName = '  ana torres  ';

String lengthText = String.valueOf(rawName.trim().length());
//   primero rawName.trim().length()  → 10
//   después String.valueOf(10)       → '10'

Boolean found = rawName.contains('TORRES'.toLowerCase());   // contains('torres') → true`,
        en: `String rawName = '  ana torres  ';

String lengthText = String.valueOf(rawName.trim().length());
//   first rawName.trim().length()   → 10
//   then String.valueOf(10)         → '10'

Boolean found = rawName.contains('TORRES'.toLowerCase());   // contains('torres') → true`,
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Mi truco para leer cualquier línea", en: "My trick for reading any line" },
      text: {
        es: "TEXT(LEN(TRIM(Name))) en una fórmula es exactamente String.valueOf(name.trim().length()). Para leer cualquier línea busco el paréntesis más interno, lo resuelvo en la cabeza y lo sustituyo por su valor. Repito hasta que no queda nada.",
        en: "TEXT(LEN(TRIM(Name))) in a formula is exactly String.valueOf(name.trim().length()). To read any line I find the innermost bracket, solve it in my head and replace it with its value. I repeat until nothing is left.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "Comparar textos: la sorpresa de Apex", en: "Comparing text: the Apex surprise" },
    },
    {
      type: "p",
      text: {
        es: "En Apex, == entre textos no distingue mayúsculas: 'EMEA' == 'emea' es verdadero, casi al revés que en cualquier otro lenguaje. Si la mayúscula importa, usa equals(); si quieres dejar claro que no importa, equalsIgnoreCase().",
        en: "In Apex, == between strings ignores case: 'EMEA' == 'emea' is true, almost the opposite of any other language. If case matters, use equals(); to make it clear that it does not, equalsIgnoreCase().",
      },
    },
    {
      type: "code",
      code: {
        es: `Boolean loose  = 'EMEA' == 'emea';          // true
Boolean strict = 'EMEA'.equals('emea');     // false
Boolean same   = 'EMEA'.equalsIgnoreCase('emea'); // true, y se lee mejor que ==`,
        en: `Boolean loose  = 'EMEA' == 'emea';          // true
Boolean strict = 'EMEA'.equals('emea');     // false
Boolean same   = 'EMEA'.equalsIgnoreCase('emea'); // true, and it reads better than ==`,
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Por qué esto te suena", en: "Why this rings a bell" },
      text: {
        es: "Es lo mismo que un filtro de informe: Industry igual a «technology» también saca los «Technology». Cómodo casi siempre… y yo caí la vez que comparaba códigos donde la mayúscula sí significaba algo.",
        en: "It is the same as a report filter: Industry equals «technology» also brings the «Technology» ones. Handy almost always… and I fell for it the time I compared codes where the capital did mean something.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿por qué rawName.toUpperCase(); en una línea suelta no sirve para nada? ¿Por qué name.length().toUpperCase() no compila? ¿Qué diferencia hay entre nombre.trim() y String.valueOf(42)? Y en String.valueOf(name.trim().length()), ¿qué se ejecuta primero?",
        en: "Without looking up: why is rawName.toUpperCase(); on a line of its own useless? Why does name.length().toUpperCase() not compile? What is the difference between name.trim() and String.valueOf(42)? And in String.valueOf(name.trim().length()), what runs first?",
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
        es: "Las posiciones empiezan en 0 y el segundo número marca dónde parar, sin incluirlo. MID(code, 1, 4) es sintaxis de fórmulas, que no existe en Apex.",
        en: "Positions start at 0 and the second number marks where to stop, exclusive. MID(code, 1, 4) is formula syntax, which does not exist in Apex.",
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
    {
      id: "m01-l03-q7",
      kind: "single",
      prompt: { es: "¿Qué muestra este código?", en: "What does this code print?" },
      code: {
        es: `String code = 'apex-academy';
System.debug(code.substring(0, 4).toUpperCase());`,
        en: `String code = 'apex-academy';
System.debug(code.substring(0, 4).toUpperCase());`,
      },
      options: [
        { es: "APEX", en: "APEX" },
        { es: "apex", en: "apex" },
        { es: "APEX-ACADEMY", en: "APEX-ACADEMY" },
        { es: "No compila: dos métodos seguidos no se pueden encadenar.", en: "It does not compile: you cannot chain two methods in a row." },
      ],
      answer: 0,
      explain: {
        es: "Primero substring(0, 4) actúa sobre code y devuelve 'apex'. Después toUpperCase() actúa sobre ese 'apex', no sobre code: el resultado es 'APEX'.",
        en: "First substring(0, 4) acts on code and returns 'apex'. Then toUpperCase() acts on that 'apex', not on code: the result is 'APEX'.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m01-l03-q8",
      kind: "single",
      prompt: { es: "¿Qué muestra este código?", en: "What does this code print?" },
      code: {
        es: `String city = '  Lima  ';
System.debug('Letras: ' + String.valueOf(city.trim().length()));`,
        en: `String city = '  Lima  ';
System.debug('Letters: ' + String.valueOf(city.trim().length()));`,
      },
      options: [
        { es: "Letras: 4", en: "Letters: 4" },
        { es: "Letras: 8", en: "Letters: 8" },
        { es: "Letras:   Lima  ", en: "Letters:   Lima  " },
        { es: "No compila: no se puede meter un método dentro de otro.", en: "It does not compile: you cannot put a method inside another." },
      ],
      answer: 0,
      explain: {
        es: "De dentro hacia fuera: city.trim() da 'Lima', .length() da 4, String.valueOf(4) da '4', y el + lo pega detrás de 'Letras: '. Si saliera 8, sería porque se contó sin trim().",
        en: "Inside out: city.trim() gives 'Lima', .length() gives 4, String.valueOf(4) gives '4', and + attaches it after 'Letters: '. Getting 8 would mean counting without trim().",
      },
      tags: ["predict-output"],
    },
    {
      id: "m01-l03-q9",
      kind: "single",
      prompt: {
        es: "Una de estas líneas no compila. ¿Cuál?",
        en: "One of these lines does not compile. Which?",
      },
      options: [
        { es: "Integer n = name.length().toUpperCase();", en: "Integer n = name.length().toUpperCase();" },
        { es: "Integer n = name.trim().length();", en: "Integer n = name.trim().length();" },
        { es: "String s = name.trim().toUpperCase();", en: "String s = name.trim().toUpperCase();" },
        { es: "String s = String.valueOf(name.length());", en: "String s = String.valueOf(name.length());" },
      ],
      answer: 0,
      explain: {
        es: "length() devuelve un Integer, y un Integer no tiene toUpperCase(). Cada eslabón solo admite los métodos del tipo que le llega, igual que en Flow la salida de un elemento solo encaja donde se espera ese tipo.",
        en: "length() returns an Integer, and an Integer has no toUpperCase(). Each link only accepts the methods of the type it receives, just as in Flow an element's output only fits where that type is expected.",
      },
      tags: ["find-error"],
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 3 DE 10 · Ventas pidió que la ficha muestre el nombre «bien escrito». El contacto de Northwind llegó por el formulario web, y llega como lo teclea la gente: mayúsculas donde no tocan y espacios de sobra. Límpialo para poder crear el Contact. Ninguno de estos valores sale de un solo método: piensa primero qué tienes, qué quieres y en qué orden hay que pedir las cosas.",
      en: "TASK 3 OF 10 · Sales asked for the summary to show the name “properly written”. Northwind's contact came in through the web form, and it arrives the way people type: capitals where they do not belong and spare spaces. Clean it up so the Contact can be created. None of these values comes out of a single method: think first about what you have, what you want, and in which order to ask for things.",
    },
    brief: [
      {
        es: "Parte de las dos líneas del código de partida. No cambies sus valores.",
        en: "Start from the two lines in the starter code. Do not change their values.",
      },
      {
        es: "displayName: rawName sin espacios en los extremos y escrito como un nombre propio, es decir, solo la primera letra en mayúscula: 'Ana maría torres'.",
        en: "displayName: rawName without the outer spaces and written like a proper name, that is, only the first letter capitalised: 'Ana maría torres'.",
      },
      {
        es: "cleanEmail: rawEmail sin espacios en los extremos y todo en minúsculas.",
        en: "cleanEmail: rawEmail without the outer spaces and all in lower case.",
      },
      {
        es: "isDotCom: Boolean que diga si cleanEmail acaba en '.com'.",
        en: "isDotCom: a Boolean saying whether cleanEmail ends in '.com'.",
      },
      {
        es: "initial: la primera letra de cleanEmail, en mayúscula ('V'). Tiene que ser un String.",
        en: "initial: the first letter of cleanEmail, capitalised ('V'). It must be a String.",
      },
      {
        es: "lengthLabel: cuántos caracteres tiene cleanEmail, pero ya convertido a texto para poder mostrarlo.",
        en: "lengthLabel: how many characters cleanEmail has, already converted to text so it can be displayed.",
      },
      {
        es: "summary: displayName, un espacio, y cleanEmail entre los signos < y >.",
        en: "summary: displayName, a space, and cleanEmail between < and >.",
      },
      {
        es: "Todo se calcula con métodos: no escribas a mano ningún resultado, ni 'V', ni el 20, ni el nombre ya arreglado.",
        en: "Everything is computed with methods: do not type any result by hand — not 'V', not 20, not the tidied name.",
      },
    ],
    starter: {
      es: `// CASO: campaña de renovaciones · cliente Northwind Trading
// Tarea 3 de 10: el contacto, tal y como lo mandó el formulario web.
String rawName = '  ANA maría TORRES  ';
String rawEmail = ' Ventas@Northwind.COM ';

// Seis valores. Ninguno sale de un solo método.

`,
      en: `// CASE: renewals campaign · customer Northwind Trading
// Task 3 of 10: the contact, exactly as the web form sent it.
String rawName = '  ANA maría TORRES  ';
String rawEmail = ' Ventas@Northwind.COM ';

// Six values. Not one of them comes out of a single method.

`,
    },
    hints: [
      {
        es: "Antes de escribir, yo me hago dos preguntas por cada valor, como al diseñar un campo fórmula: ¿de qué dato parto? ¿de qué tipo tiene que ser el resultado? Si el tipo de salida no es texto, el último método de la línea no puede ser uno de String.",
        en: "Before writing, I ask myself two questions for each value, as when designing a formula field: which data do I start from? What type must the result be? If the output type is not text, the last method on the line cannot be a String one.",
      },
      {
        es: "Aquí tropecé yo: en displayName el orden lo decide todo. capitalize() solo toca la primera letra y deja el resto como estaba, así que lo de en medio ya tiene que llegar en minúsculas. Son tres métodos seguidos.",
        en: "This is where I tripped: in displayName the order decides everything. capitalize() only touches the first letter and leaves the rest as it was, so whatever is in the middle has to arrive in lowercase already. Three methods in a row.",
      },
      {
        es: "Te dejo la clave de lengthLabel: es el único que se anida. Dentro de los paréntesis de String.valueOf() va el recuento, y ese recuento se le pide al correo ya limpio, no a rawEmail.",
        en: "Here is the key to lengthLabel: it is the only one that nests. The count goes inside the brackets of String.valueOf(), and that count is asked of the email that is already clean, not of rawEmail.",
      },
    ],
    solution: {
      es: `String rawName = '  ANA maría TORRES  ';
String rawEmail = ' Ventas@Northwind.COM ';

String displayName = rawName.trim().toLowerCase().capitalize();
String cleanEmail = rawEmail.trim().toLowerCase();
Boolean isDotCom = cleanEmail.endsWith('.com');
String initial = cleanEmail.substring(0, 1).toUpperCase();
String lengthLabel = String.valueOf(cleanEmail.length());
String summary = displayName + ' <' + cleanEmail + '>';`,
      en: `String rawName = '  ANA maría TORRES  ';
String rawEmail = ' Ventas@Northwind.COM ';

String displayName = rawName.trim().toLowerCase().capitalize();
String cleanEmail = rawEmail.trim().toLowerCase();
Boolean isDotCom = cleanEmail.endsWith('.com');
String initial = cleanEmail.substring(0, 1).toUpperCase();
String lengthLabel = String.valueOf(cleanEmail.length());
String summary = displayName + ' <' + cleanEmail + '>';`,
    },
    checks: [
      {
        id: "l03-c1",
        label: {
          es: "displayName limpia, baja a minúsculas y capitaliza, en ese orden",
          en: "displayName trims, lower-cases and capitalises, in that order",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "rawName\\s*\\.\\s*trim\\s*\\(\\s*\\)" },
            { op: "match", pattern: "rawName\\s*\\.[^;]*toLowerCase\\s*\\(\\s*\\)" },
            { op: "match", pattern: "String\\s+displayName\\s*=[^;]*capitalize\\s*\\(\\s*\\)" },
            { op: "absent", pattern: "capitalize\\s*\\(\\s*\\)\\s*\\.\\s*toLowerCase\\s*\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "Son tres métodos encadenados sobre rawName. capitalize() solo cambia la primera letra: si llega 'ANA MARÍA TORRES', devuelve 'ANA MARÍA TORRES'. Hay que pasar a minúsculas ANTES de capitalizar.",
          en: "It is three methods chained on rawName. capitalize() only changes the first letter: if 'ANA MARÍA TORRES' arrives, it returns 'ANA MARÍA TORRES'. You must lower-case BEFORE capitalising.",
        },
        otter: {
          es: "displayName es como limpiar un dato antes de importarlo: quitar espacios, bajar todo a minúsculas y solo entonces capitalizar, en ese orden. capitalize() solo cambia la primera letra: si le llega 'ANA MARÍA TORRES', devuelve 'ANA MARÍA TORRES'.",
          en: "displayName is like cleaning data before an import: remove the spaces, lowercase everything and only then capitalize, in that order. capitalize() only changes the first letter: given 'ANA MARÍA TORRES', it returns 'ANA MARÍA TORRES'.",
        },
        onPass: {
          es: "Ese es el punto: en una cadena, cada método recibe lo que dejó el anterior, así que el orden cambia el resultado.",
          en: "That is the point: in a chain each method receives what the previous one left, so the order changes the result.",
        },
      },
      {
        id: "l03-c2",
        label: {
          es: "cleanEmail sale de rawEmail, sin espacios y en minúsculas",
          en: "cleanEmail comes from rawEmail, trimmed and lower-cased",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "String\\s+cleanEmail\\s*=\\s*rawEmail\\s*\\." },
            { op: "match", pattern: "cleanEmail\\s*=[^;]*trim\\s*\\(\\s*\\)" },
            { op: "match", pattern: "cleanEmail\\s*=[^;]*toLowerCase\\s*\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "Un correo se compara y se guarda siempre en minúsculas. Aquí el orden da igual (trim() y toLowerCase() no se estorban), pero los dos tienen que estar, y partiendo de rawEmail.",
          en: "An email is always stored and compared in lower case. Here the order does not matter — trim() and toLowerCase() do not interfere — but both must be there, starting from rawEmail.",
        },
        otter: {
          es: "cleanEmail es la limpieza que harías en Excel antes de importar contactos: sin espacios y en minúsculas, porque un correo se compara siempre en minúsculas. Aquí el orden da igual, pero los dos métodos tienen que estar, partiendo de rawEmail.",
          en: "cleanEmail is the clean-up you would do in Excel before importing contacts: no spaces and lowercase, because an email is always compared in lowercase. The order does not matter here, but both methods must be there, starting from rawEmail.",
        },
      },
      {
        id: "l03-c3",
        label: {
          es: "isDotCom es Boolean y pregunta por el final del texto",
          en: "isDotCom is a Boolean and asks about the end of the text",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Boolean\\s+isDotCom\\s*=" },
            { op: "match", pattern: "isDotCom\\s*=[^;]*cleanEmail\\s*\\.\\s*endsWith\\s*\\(\\s*'\\.com'\\s*\\)", flags: "" },
          ],
        },
        onFail: {
          es: "«¿Acaba en algo?» es una pregunta de sí o no: el tipo es Boolean y el método es endsWith('.com'), pedido sobre cleanEmail. Sobre rawEmail fallaría por el espacio final y por las mayúsculas.",
          en: "“Does it end with something?” is a yes/no question: the type is Boolean and the method is endsWith('.com'), asked of cleanEmail. On rawEmail it would fail because of the trailing space and the capitals.",
        },
        otter: {
          es: "isDotCom es un checkbox: «¿acaba en .com?» es de sí o no, así que es Boolean. En una fórmula usarías RIGHT(Email, 4) = '.com'; en Apex es endsWith('.com'), pedido sobre cleanEmail: sobre rawEmail fallaría por el espacio final y las mayúsculas.",
          en: "isDotCom is a checkbox: «does it end in .com?» is yes or no, so it is a Boolean. In a formula you would use RIGHT(Email, 4) = '.com'; in Apex it is endsWith('.com'), asked of cleanEmail: on rawEmail it would fail because of the trailing space and the capitals.",
        },
      },
      {
        id: "l03-c4",
        label: {
          es: "initial recorta un carácter y lo pone en mayúscula",
          en: "initial slices one character and upper-cases it",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "String\\s+initial\\s*=" },
            { op: "match", pattern: "initial\\s*=[^;]*substring\\s*\\(\\s*0\\s*,\\s*1\\s*\\)" },
            { op: "match", pattern: "initial\\s*=[^;]*toUpperCase\\s*\\(\\s*\\)" },
            { op: "absent", pattern: "initial\\s*=\\s*'[Vv]'" },
          ],
        },
        onFail: {
          es: "Un solo carácter, el de la posición 0: substring(0, 1), porque el segundo número marca dónde parar sin incluirlo. Y después, en mayúscula. Escribir 'V' a mano funciona con este correo y con ninguno más.",
          en: "A single character, the one at position 0: substring(0, 1), because the second number marks where to stop, exclusive. And then upper-cased. Typing 'V' by hand works for this email and no other.",
        },
        otter: {
          es: "initial es como LEFT(Email, 1) en una fórmula, pero en Apex se dice substring(0, 1): se empieza a contar en 0 y el segundo número marca dónde parar sin incluirlo. Después, en mayúscula. Escribir 'V' a mano sirve para este correo y para ninguno más.",
          en: "initial is like LEFT(Email, 1) in a formula, but in Apex you say substring(0, 1): counting starts at 0 and the second number marks where to stop, without including it. Then uppercase it. Typing 'V' by hand works for this email and no other.",
        },
      },
      {
        id: "l03-c5",
        label: {
          es: "lengthLabel anida el recuento dentro de String.valueOf()",
          en: "lengthLabel nests the count inside String.valueOf()",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "String\\s+lengthLabel\\s*=[^;]*String\\s*\\.\\s*valueOf\\s*\\(" },
            { op: "match", pattern: "lengthLabel\\s*=[^;]*cleanEmail\\s*\\.\\s*length\\s*\\(\\s*\\)" },
            { op: "absent", pattern: "lengthLabel\\s*=\\s*'\\d" },
          ],
        },
        onFail: {
          es: "length() devuelve un Integer y lo que pides es un texto, así que el recuento va DENTRO de los paréntesis de String.valueOf(). Y se cuenta el correo ya limpio: rawEmail tiene dos caracteres de más.",
          en: "length() returns an Integer and what you want is text, so the count goes INSIDE String.valueOf()'s brackets. And it counts the clean email: rawEmail has two characters too many.",
        },
        otter: {
          es: "lengthLabel es el TEXT(LEN(…)) de las fórmulas: length() devuelve un número y tú quieres texto, así que el recuento va DENTRO de los paréntesis de String.valueOf(). Y se cuenta el correo ya limpio: rawEmail tiene dos caracteres de más.",
          en: "lengthLabel is the TEXT(LEN(…)) of formulas: length() returns a number and you want text, so the count goes INSIDE the brackets of String.valueOf(). And you count the email that is already clean: rawEmail has two characters too many.",
        },
        onPass: {
          es: "Anidado de libro: primero se resuelve lo de dentro, y su resultado entra en el método de fuera.",
          en: "Textbook nesting: the inside resolves first, and its result goes into the outer method.",
        },
      },
      {
        id: "l03-c6",
        label: {
          es: "summary se compone con las variables, no con el texto escrito a mano",
          en: "summary is composed from the variables, not from hand-typed text",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "String\\s+summary\\s*=[^;]*displayName" },
            { op: "match", pattern: "summary\\s*=[^;]*cleanEmail" },
            { op: "match", pattern: "summary\\s*=[^;]*'[^']*<" },
          ],
        },
        onFail: {
          es: "Los trozos fijos (el espacio y los signos < y >) van entre comillas; los que cambian son displayName y cleanEmail, unidos con el signo más. Si escribes el nombre dentro de las comillas, el resumen será el mismo para todos los contactos.",
          en: "The fixed bits — the space and the < > signs — go in quotes; the changing ones are displayName and cleanEmail, joined with plus. If you type the name inside the quotes, the summary will be identical for every contact.",
        },
        otter: {
          es: "summary es como una plantilla de email con campos de combinación: los trozos fijos (el espacio y los signos < y >) van entre comillas, y los que cambian son displayName y cleanEmail, unidos con el signo más. Si escribes el nombre dentro de las comillas, todos los contactos recibirían el mismo resumen.",
          en: "summary is like an email template with merge fields: the fixed bits (the space and the < and > signs) go in quotes, and the changing ones are displayName and cleanEmail, joined with the plus sign. Type the name inside the quotes and every contact would get the same summary.",
        },
      },
      {
        id: "l03-c7",
        label: {
          es: "No se descarta ninguna llamada a método",
          en: "No method call is thrown away",
        },
        rule: {
          op: "absent",
          pattern: "^\\s*\\w+\\s*\\.\\s*(trim|toUpperCase|toLowerCase|capitalize|substring)\\s*\\([^)]*\\)\\s*;\\s*$",
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
        es: "Dos preguntas para pensar: si el formulario enviara el correo vacío, ¿en qué punto exacto de tus cadenas reventaría? Y si mañana piden el dominio del correo (lo que va detrás de la arroba), ¿con qué método empezarías a buscarlo?",
        en: "Two questions to chew on: if the form sent an empty email, at which exact point in your chains would it blow up? And if tomorrow they ask for the email's domain — what comes after the @ — which method would you start looking with?",
      },
    ],
    outro: {
      es: "Ya limpias texto con métodos, y sabes encadenarlos y anidarlos. En la tarea 4 toca la parte del calendario de la ficha: cuándo se firmó, cuándo se renueva y cuántos días quedan.",
      en: "You can now clean text with methods, and you know how to chain and nest them. Task 4 brings the calendar part of the sheet: when it was signed, when it renews and how many days are left.",
    },
    voice: "otter",
  },
};
