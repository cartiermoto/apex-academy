import type { Lesson } from "@/lib/types";

export const l03String: Lesson = {
  id: "m01-l03",
  slug: "string",
  n: 3,
  kind: "lesson",
  minutes: 34,
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
      type: "callout",
      variant: "tip",
      title: { es: "Por qué esto aparece justo aquí", en: "Why this shows up right here" },
      text: {
        es: "Los métodos no son cosa del texto: en Apex los tienen todos los tipos —Decimal tiene setScale(), Date tiene addYears(), List tiene add()—. Pero el texto es el primer sitio donde no puedes hacer nada sin ellos: los números se manejan con símbolos que ya conoces (+, -, *, /) y para «quítale los espacios» o «ponlo en mayúsculas» no hay símbolo, hay método. Y es el sitio donde el concepto cae sobre algo que ya sabes hacer: TRIM() y UPPER() en un campo fórmula. A partir de aquí todas las sub-lecciones dan los métodos por sabidos; en el Módulo 5 se cierra el círculo y verás POR QUÉ un dato tiene comportamiento.",
        en: "Methods are not a text thing: in Apex every type has them — Decimal has setScale(), Date has addYears(), List has add(). But text is the first place where you can do nothing without them: numbers are handled with symbols you already know (+, -, *, /), and for “strip the spaces” or “upper-case it” there is no symbol, there is a method. It is also where the idea lands on something you already do: TRIM() and UPPER() in a formula field. From here on every sub-lesson assumes methods; Module 5 closes the circle and shows you WHY a value has behaviour.",
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
          { es: "String con la primera letra en mayúscula; el resto se queda tal cual estaba.", en: "String with the first letter capitalised; the rest is left exactly as it was." },
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
      text: { es: "Encadenar métodos: uno detrás de otro", en: "Chaining methods: one after another" },
    },
    {
      type: "p",
      text: {
        es: "Cada método devuelve un valor nuevo, y ese valor nuevo también es un dato al que le puedes pedir otro método, con otro punto pegado detrás. Eso es encadenar: cleanCompany.substring(0, 4).toUpperCase() no son dos instrucciones, es una sola que se lee de izquierda a derecha. Primero substring(0, 4) actúa sobre cleanCompany y devuelve un texto más corto; después toUpperCase() actúa sobre ESE texto corto, no sobre cleanCompany.",
        en: "Every method returns a new value, and that new value is itself something you can ask another method of, with another dot stuck on the end. That is chaining: cleanCompany.substring(0, 4).toUpperCase() is not two instructions, it is one, read left to right. First substring(0, 4) acts on cleanCompany and returns a shorter text; then toUpperCase() acts on THAT shorter text, not on cleanCompany.",
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
      title: { es: "Lo mismo que anidar funciones en una fórmula", en: "The same thing as nesting functions in a formula" },
      text: {
        es: "Yo ya hacía esto en campos fórmula sin llamarlo así: UPPER(LEFT(Company_Name__c, 4)) primero recorta y luego pone en mayúsculas, aunque lo escribas de fuera hacia dentro. La diferencia está en el orden de lectura: la fórmula se lee de dentro hacia fuera (LEFT ocurre primero aunque esté más adentro), y el encadenado de Apex se lee de izquierda a derecha en el mismo orden en que ocurre. A mí me resultó más fácil de seguir precisamente porque no hay que leerlo al revés.",
        en: "I was already doing this in formula fields without calling it that: UPPER(LEFT(Company_Name__c, 4)) first trims and then uppercases, even though you write it from the outside in. The difference is the reading order: the formula reads from the inside out (LEFT happens first even though it sits deeper), and Apex chaining reads left to right in the same order it happens. I found it easier to follow precisely because you do not have to read it backwards.",
      },
      voice: "otter",
    },
    {
      type: "p",
      text: {
        es: "Veámoslo con el Lead sucio del ejercicio, eslabón a eslabón. La columna que importa es la última: el tipo que devuelve cada paso decide qué métodos puedes pedirle al siguiente.",
        en: "Let us walk the dirty Lead from the exercise through it, link by link. The column that matters is the last one: the type each step returns decides which methods you may ask of the next.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Lo que llevas escrito", en: "What you have written so far" },
        { es: "Valor en ese punto", en: "Value at that point" },
        { es: "Tipo", en: "Type" },
      ],
      rows: [
        [
          { es: "rawCompany", en: "rawCompany" },
          { es: "'  northwind trading  '", en: "'  northwind trading  '" },
          { es: "String", en: "String" },
        ],
        [
          { es: "rawCompany.trim()", en: "rawCompany.trim()" },
          { es: "'northwind trading'", en: "'northwind trading'" },
          { es: "String", en: "String" },
        ],
        [
          { es: "rawCompany.trim().substring(0, 4)", en: "rawCompany.trim().substring(0, 4)" },
          { es: "'nort'", en: "'nort'" },
          { es: "String", en: "String" },
        ],
        [
          { es: "rawCompany.trim().substring(0, 4).toUpperCase()", en: "rawCompany.trim().substring(0, 4).toUpperCase()" },
          { es: "'NORT'", en: "'NORT'" },
          { es: "String", en: "String" },
        ],
        [
          { es: "rawCompany.trim().length()", en: "rawCompany.trim().length()" },
          { es: "17", en: "17" },
          { es: "Integer — aquí se acaba la cadena de texto", en: "Integer — the text chain ends here" },
        ],
      ],
    },
    {
      type: "p",
      text: {
        es: "Una cadena no es obligatoria: siempre puedes desarmarla en variables intermedias y el resultado es idéntico. Mientras aprendes, desarmarla es buena idea —cada paso tiene nombre y lo puedes mirar con System.debug()—; cuando ya lo lees con soltura, la versión encadenada ahorra variables que solo vivían para pasar el dato al siguiente paso.",
        en: "A chain is never compulsory: you can always break it into intermediate variables and the result is identical. While you are learning, breaking it up is a good idea — every step has a name and you can inspect it with System.debug(); once you read chains fluently, the chained version saves variables that only existed to hand the value along.",
      },
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
      title: { es: "La regla del tipo: cada eslabón tiene que encajar", en: "The type rule: every link has to fit" },
      text: {
        es: "Solo puedes pedirle a un eslabón los métodos de su tipo. rawCompany.trim().length() funciona porque trim() devuelve un String y los String tienen length(). Pero name.length().toUpperCase() no compila: length() devuelve un Integer, y un número no sabe ponerse en mayúsculas. Es como en Flow: la salida de un elemento solo se puede usar donde se espera ese tipo de dato.",
        en: "You may only ask a link for the methods of its type. rawCompany.trim().length() works because trim() returns a String and Strings have length(). But name.length().toUpperCase() does not compile: length() returns an Integer, and a number does not know how to upper-case itself. It is like Flow: an element's output can only go where that data type is expected.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Un eslabón roto revienta toda la cadena", en: "One broken link blows up the whole chain" },
      text: {
        es: "Si algún paso intermedio devuelve null —por ejemplo porque el dato de partida no existía—, pedirle un método al siguiente eslabón lanza NullPointerException, igual que viste con un dato suelto. La cadena entera es tan frágil como su punto más débil. Por eso String.isBlank() (que se le pide al tipo, no al dato) suele ir antes de empezar a encadenar, no en medio de la cadena.",
        en: "If some step in the middle returns null — say, because the starting value did not exist — asking the next link for a method throws NullPointerException, exactly as you saw with a lone value. The whole chain is only as strong as its weakest link. That is why String.isBlank() (which you ask the type, not the value) usually runs before you start chaining, not in the middle of the chain.",
      },
    },
    {
      type: "h",
      text: { es: "Métodos que se le piden al tipo, no al dato", en: "Methods you ask the type, not the value" },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "String es un tipo, nunca un método", en: "String is a type, never a method" },
      text: {
        es: "Antes de seguir, quítate esta duda de encima: String no es un método. String es el tipo, y los métodos son suyos —trim(), length(), toUpperCase() no existen sueltos por ahí—. Lo que confunde es que el punto se usa en dos sitios: nombre.trim() se lo pides al DATO («oye, este texto, límpiate»), y String.valueOf(42) se lo pides al TIPO («oye, tipo String, fabrícame un texto con esto»). En los dos casos el método es lo que va después del punto y siempre lleva paréntesis. En Object Manager pasa igual: «Nuevo» es una acción del objeto Cuenta y «cambiar el nombre» es una acción de una cuenta concreta.",
        en: "Before going on, get this doubt out of the way: String is not a method. String is the type, and the methods belong to it — trim(), length() and toUpperCase() do not float around on their own. What confuses people is that the dot shows up in two places: name.trim() asks the VALUE (“hey, this text, clean yourself up”), while String.valueOf(42) asks the TYPE (“hey, String type, make me a text out of this”). In both cases the method is what follows the dot, and it always carries brackets. Object Manager works the same way: “New” is an action of the Account object, and “rename” is an action of one particular account.",
      },
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
      text: { es: "Anidar: un método dentro de los paréntesis de otro", en: "Nesting: one method inside another's brackets" },
    },
    {
      type: "p",
      text: {
        es: "Encadenar es poner un método detrás de otro. Anidar es poner una llamada dentro de los paréntesis de otra, como argumento. Funciona por la misma razón: una llamada a un método ES un valor, así que puede ir en cualquier sitio donde iría ese valor escrito a mano. Y aquí la lectura sí es de dentro hacia fuera, exactamente como en una fórmula: Apex resuelve primero lo de los paréntesis de dentro y le pasa el resultado al de fuera.",
        en: "Chaining puts one method after another. Nesting puts one call inside another's brackets, as an argument. It works for the same reason: a method call IS a value, so it can go anywhere that value could go if you typed it by hand. And here the reading really is inside out, exactly like a formula: Apex resolves the inner brackets first and hands the result to the outer call.",
      },
    },
    {
      type: "code",
      code: {
        es: `String rawName = '  ana torres  ';

// 1 · Un método como argumento de otro
String lengthText = String.valueOf(rawName.trim().length());
//   primero rawName.trim().length()  → 10
//   después String.valueOf(10)       → '10'

// 2 · Un método dentro de una concatenación
String greeting = 'Hola, ' + rawName.trim().capitalize();   // 'Hola, Ana torres'

// 3 · Un método dentro de otro método del mismo dato
String keyword = 'TORRES';
Boolean found = rawName.contains(keyword.toLowerCase());    // true`,
        en: `String rawName = '  ana torres  ';

// 1 · A method as another method's argument
String lengthText = String.valueOf(rawName.trim().length());
//   first rawName.trim().length()   → 10
//   then String.valueOf(10)         → '10'

// 2 · A method inside a concatenation
String greeting = 'Hello, ' + rawName.trim().capitalize();  // 'Hello, Ana torres'

// 3 · A method inside another method on the same value
String keyword = 'TORRES';
Boolean found = rawName.contains(keyword.toLowerCase());    // true`,
      },
      caption: {
        es: "En el ejemplo 3, contains() recibe 'torres' —el resultado de toLowerCase()—, no 'TORRES'. Lo de dentro siempre se resuelve antes.",
        en: "In example 3, contains() receives 'torres' — the result of toLowerCase() — not 'TORRES'. The inside always resolves first.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Esto sí es anidar como en fórmulas", en: "This is formula-style nesting, for real" },
      text: {
        es: "TEXT(LEN(TRIM(Name))) en un campo fórmula es exactamente String.valueOf(name.trim().length()): una función dentro de otra, resuelta de dentro hacia fuera. Lo que a mí me descolocó es que Apex mezcla los dos estilos en la misma línea: la parte encadenada (name.trim().length()) se lee de izquierda a derecha, y la parte anidada (String.valueOf(…)) de dentro hacia fuera. Mi truco para leer cualquier línea: busco el paréntesis más interno, lo resuelvo en la cabeza y lo sustituyo por su valor. Repito hasta que no queda nada.",
        en: "TEXT(LEN(TRIM(Name))) in a formula field is exactly String.valueOf(name.trim().length()): one function inside another, solved from the inside out. What threw me is that Apex mixes both styles on the same line: the chained part (name.trim().length()) reads left to right, and the nested part (String.valueOf(…)) from the inside out. My trick for reading any line: find the innermost parenthesis, solve it in my head and replace it with its value. Repeat until nothing is left.",
      },
      voice: "otter",
    },
    {
      type: "table",
      head: [
        { es: "En un campo fórmula", en: "In a formula field" },
        { es: "En Apex", en: "In Apex" },
        { es: "Qué hace", en: "What it does" },
      ],
      rows: [
        [
          { es: "UPPER(TRIM(Company))", en: "UPPER(TRIM(Company))" },
          { es: "company.trim().toUpperCase()", en: "company.trim().toUpperCase()" },
          { es: "Limpia y pone en mayúsculas.", en: "Cleans and upper-cases." },
        ],
        [
          { es: "UPPER(LEFT(TRIM(Company), 4))", en: "UPPER(LEFT(TRIM(Company), 4))" },
          { es: "company.trim().substring(0, 4).toUpperCase()", en: "company.trim().substring(0, 4).toUpperCase()" },
          { es: "Código corto de 4 letras.", en: "A 4-letter short code." },
        ],
        [
          { es: "LEN(TRIM(Company))", en: "LEN(TRIM(Company))" },
          { es: "company.trim().length()", en: "company.trim().length()" },
          { es: "Cuenta sin los espacios de los extremos.", en: "Counts without the outer spaces." },
        ],
        [
          { es: "TEXT(LEN(Name))", en: "TEXT(LEN(Name))" },
          { es: "String.valueOf(name.length())", en: "String.valueOf(name.length())" },
          { es: "El recuento, convertido a texto.", en: "The count, turned into text." },
        ],
        [
          { es: "\"Hola, \" & TRIM(FirstName)", en: "\"Hello, \" & TRIM(FirstName)" },
          { es: "'Hola, ' + firstName.trim()", en: "'Hello, ' + firstName.trim()" },
          { es: "Saludo con el nombre limpio.", en: "A greeting with the clean name." },
        ],
      ],
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
        es: "Es el mismo comportamiento de un filtro de informe: si filtras Industry igual a «technology» te salen también los «Technology». Cómodo el 90 % de las veces… y yo caí en el 10 % restante, comparando códigos donde la mayúscula sí significaba algo. Ahí es una fuente silenciosa de bugs.",
        en: "It is the same behaviour as a report filter: filter Industry equals «technology» and you also get the «Technology» ones. Handy 90% of the time… and I fell into the other 10%, comparing codes where the capital letter did mean something. There it is a silent source of bugs.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿por qué rawName.toUpperCase(); en una línea suelta no sirve para nada? ¿Qué devuelve contains()? En code.substring(0, 4).toUpperCase(), ¿sobre qué actúa exactamente toUpperCase()? ¿Por qué name.length().toUpperCase() no compila? Y en String.valueOf(name.trim().length()), ¿qué se ejecuta primero?",
        en: "Without looking up: why is rawName.toUpperCase(); on a line of its own completely useless? What does contains() return? In code.substring(0, 4).toUpperCase(), what exactly does toUpperCase() act on? Why does name.length().toUpperCase() not compile? And in String.valueOf(name.trim().length()), what runs first?",
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
          es: "Un correo se compara y se guarda siempre en minúsculas. Aquí el orden da igual —trim() y toLowerCase() no se estorban—, pero los dos tienen que estar, y partiendo de rawEmail.",
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
          es: "Los trozos fijos —el espacio y los signos < y >— van entre comillas; los que cambian son displayName y cleanEmail, unidos con el signo más. Si escribes el nombre dentro de las comillas, el resumen será el mismo para todos los contactos.",
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
        es: "Dos preguntas para pensar: si el formulario enviara el correo vacío, ¿en qué punto exacto de tus cadenas reventaría? Y si mañana piden el dominio del correo —lo que va detrás de la arroba—, ¿con qué método empezarías a buscarlo?",
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
