import type { Lesson } from "@/lib/types";

export const l01Variables: Lesson = {
  id: "m01-l01",
  slug: "variables",
  n: 1,
  kind: "lesson",
  minutes: 18,
  title: { es: "Variables y Declaración", en: "Variables and Declaration" },
  summary: {
    es: "Una variable es un campo personalizado que vive un instante. Aprende a crearlo: tipo, nombre y valor.",
    en: "A variable is a custom field that lives for an instant. Learn to create one: type, name and value.",
  },
  objectives: [
    {
      es: "Declarar una variable eligiendo el tipo antes que el valor.",
      en: "Declare a variable by choosing the type before the value.",
    },
    {
      es: "Distinguir declarar, asignar y reasignar.",
      en: "Tell declaring, assigning and reassigning apart.",
    },
    {
      es: "Nombrar variables como las nombra un equipo de desarrollo real.",
      en: "Name variables the way a real development team names them.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Cada vez que creaste un campo personalizado seguiste el mismo ritual: elegir el tipo, ponerle nombre y decidir qué valor lleva. Declarar una variable en Apex es exactamente ese ritual, escrito en una línea.",
        en: "Every time you created a custom field you followed the same ritual: pick the type, give it a name, decide what value it holds. Declaring a variable in Apex is exactly that ritual, written on one line.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "En Setup → Object Manager → Fields & Relationships → New, la primera pantalla te obliga a elegir el tipo de dato. No puedes crear un campo «que ya veremos qué guarda». Apex es igual de estricto, y por la misma razón: el tipo es lo que le permite a la plataforma protegerte de guardar «mañana» en un campo de importe.",
        en: "In Setup → Object Manager → Fields & Relationships → New, the very first screen forces you to pick a data type. You cannot create a field that will “figure out later” what it stores. Apex is just as strict, for the same reason: the type is what lets the platform stop you from storing “tomorrow” in an amount field.",
      },
    },
    {
      type: "h",
      text: { es: "Las cuatro partes de una declaración", en: "The four parts of a declaration" },
    },
    {
      type: "p",
      text: {
        es: "Una declaración completa tiene el tipo, el nombre, el signo igual y el valor. Y termina en punto y coma, que en Apex significa «esta instrucción se ha acabado».",
        en: "A complete declaration has the type, the name, an equals sign and the value. And it ends in a semicolon, which in Apex means “this instruction is finished”.",
      },
    },
    {
      type: "diagram",
      id: "m01-variable-anatomy",
      caption: {
        es: "Cada parte responde a una pregunta distinta. Si te falta una, el código no compila.",
        en: "Each part answers a different question. Miss one and the code does not compile.",
      },
    },
    {
      type: "code",
      code: {
        es: `// Declaración con valor inicial
Integer maxDiscount = 20;

// Declarar ahora, asignar después
String accountName;
accountName = 'Acme Corp';

// Reasignar: la caja es la misma, el contenido cambia
maxDiscount = 25;`,
        en: `// Declaration with an initial value
Integer maxDiscount = 20;

// Declare now, assign later
String accountName;
accountName = 'Acme Corp';

// Reassign: same box, different contents
maxDiscount = 25;`,
      },
      caption: {
        es: "El tipo solo se escribe la primera vez. Repetirlo al reasignar es un error de compilación.",
        en: "The type is written only the first time. Repeating it when reassigning is a compile error.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: {
        es: "Declarar y asignar no son lo mismo",
        en: "Declaring and assigning are not the same",
      },
      text: {
        es: "Declarar es crear el campo. Asignar es rellenarlo. Puedes declarar sin asignar —la variable existe y está vacía— pero no puedes asignar algo que no has declarado: Apex no crea campos sobre la marcha.",
        en: "Declaring creates the field. Assigning fills it in. You can declare without assigning — the variable exists and is empty — but you cannot assign to something you never declared: Apex does not invent fields on the fly.",
      },
    },
    {
      type: "h",
      text: { es: "El tipo es una promesa", en: "The type is a promise" },
    },
    {
      type: "p",
      text: {
        es: "Cuando escribes Integer delante de un nombre, le estás prometiendo a la plataforma que ahí solo habrá números enteros. Si más adelante intentas meter texto, el código ni siquiera llega a ejecutarse: falla al compilar, igual que Salesforce te impide guardar «N/A» en un campo Number.",
        en: "When you write Integer before a name, you are promising the platform that only whole numbers will live there. If you later try to put text in, the code never even runs: it fails to compile, just as Salesforce refuses to save “N/A” into a Number field.",
      },
    },
    {
      type: "code",
      code: {
        es: `Integer contactCount = 12;
contactCount = 'doce';   // ❌ no compila: 'doce' no es un Integer`,
        en: `Integer contactCount = 12;
contactCount = 'twelve'; // ❌ does not compile: 'twelve' is not an Integer`,
      },
    },
    {
      type: "h",
      text: { es: "Cómo se nombran las variables", en: "How variables are named" },
    },
    {
      type: "p",
      text: {
        es: "En Apex la convención es camelCase: la primera palabra en minúscula y cada palabra siguiente con inicial mayúscula. Y el nombre se elige como se elige la etiqueta de un campo: pensando en quien lo leerá dentro de seis meses, que probablemente serás tú.",
        en: "In Apex the convention is camelCase: first word lowercase, every following word capitalised. And the name is chosen the way a field label is chosen: thinking of whoever reads it in six months, who will probably be you.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Escribe esto", en: "Write this" },
        { es: "No esto", en: "Not this" },
        { es: "Por qué", en: "Why" },
      ],
      rows: [
        [
          { es: "totalAmount", en: "totalAmount" },
          { es: "ta / x / temp", en: "ta / x / temp" },
          {
            es: "El nombre es la documentación que nunca se desactualiza.",
            en: "The name is the one piece of documentation that never goes stale.",
          },
        ],
        [
          { es: "isActive", en: "isActive" },
          { es: "active", en: "active" },
          {
            es: "Un Boolean se lee mejor como una pregunta de sí/no.",
            en: "A Boolean reads better as a yes/no question.",
          },
        ],
        [
          { es: "accountName", en: "accountName" },
          { es: "AccountName", en: "AccountName" },
          {
            es: "La inicial mayúscula se reserva para clases y objetos.",
            en: "A leading capital is reserved for classes and objects.",
          },
        ],
      ],
    },
    {
      type: "h",
      text: { es: "Variables que no cambian", en: "Variables that never change" },
    },
    {
      type: "p",
      text: {
        es: "Si un valor no debe cambiar nunca —un porcentaje fijo, un nombre de estado—, se declara con final. Es el equivalente a un campo de solo lectura: intentar reasignarlo es un error de compilación, no una sorpresa en ejecución.",
        en: "If a value must never change — a fixed percentage, a status name — declare it final. It is the equivalent of a read-only field: trying to reassign it is a compile error, not a runtime surprise.",
      },
    },
    {
      type: "code",
      code: {
        es: `final Integer MAX_RETRIES = 3;
MAX_RETRIES = 5;   // ❌ no compila: es final`,
        en: `final Integer MAX_RETRIES = 3;
MAX_RETRIES = 5;   // ❌ does not compile: it is final`,
      },
      caption: {
        es: "Las constantes se escriben en MAYÚSCULAS_CON_GUIONES para que se vean de lejos.",
        en: "Constants are written in UPPER_SNAKE_CASE so they stand out at a glance.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿cuáles son las cuatro partes de una declaración con valor inicial, y cuál de ellas desaparece cuando reasignas?",
        en: "Without looking up: what are the four parts of a declaration with an initial value, and which one disappears when you reassign?",
      },
    },
  ],

  quiz: [
    {
      id: "m01-l01-q1",
      kind: "single",
      prompt: {
        es: "¿Cuál de estas líneas declara correctamente una variable de texto con un valor inicial?",
        en: "Which of these lines correctly declares a text variable with an initial value?",
      },
      options: [
        { es: "String region = 'EMEA';", en: "String region = 'EMEA';" },
        { es: "region = 'EMEA';", en: "region = 'EMEA';" },
        { es: "String region == 'EMEA';", en: "String region == 'EMEA';" },
        { es: "var region = 'EMEA';", en: "var region = 'EMEA';" },
      ],
      answer: 0,
      explain: {
        es: "Hace falta tipo, nombre, un solo signo igual y punto y coma. La segunda asigna a algo no declarado, la tercera usa el operador de comparación y la cuarta usa una palabra que Apex no tiene.",
        en: "You need a type, a name, a single equals sign and a semicolon. The second assigns to something never declared, the third uses the comparison operator, and the fourth uses a keyword Apex does not have.",
      },
      tags: ["recall"],
    },
    {
      id: "m01-l01-q2",
      kind: "single",
      prompt: {
        es: "¿Qué ocurre al ejecutar este código?",
        en: "What happens when this code runs?",
      },
      code: {
        es: `Integer opportunityCount = 4;
Integer opportunityCount = 7;`,
        en: `Integer opportunityCount = 4;
Integer opportunityCount = 7;`,
      },
      options: [
        {
          es: "No compila: la variable ya estaba declarada.",
          en: "It does not compile: the variable was already declared.",
        },
        { es: "Compila y la variable vale 7.", en: "It compiles and the variable is 7." },
        { es: "Compila y la variable vale 4.", en: "It compiles and the variable is 4." },
        {
          es: "Compila pero deja la variable vacía.",
          en: "It compiles but leaves the variable empty.",
        },
      ],
      answer: 0,
      explain: {
        es: "El tipo solo se escribe al declarar. La segunda línea intenta crear otra vez el mismo campo; para cambiar el valor bastaba con opportunityCount = 7;",
        en: "The type is written only when declaring. The second line tries to create the same field again; to change the value, opportunityCount = 7; was enough.",
      },
      tags: ["find-error", "predict-output"],
    },
    {
      id: "m01-l01-q3",
      kind: "multi",
      prompt: {
        es: "¿Cuáles de estos nombres siguen la convención de Apex para una variable normal?",
        en: "Which of these names follow the Apex convention for an ordinary variable?",
      },
      options: [
        { es: "closeDate", en: "closeDate" },
        { es: "CloseDate", en: "CloseDate" },
        { es: "isPrimaryContact", en: "isPrimaryContact" },
        { es: "d", en: "d" },
      ],
      answers: [0, 2],
      explain: {
        es: "camelCase y un nombre que se explica solo. La inicial mayúscula se reserva para clases y objetos, y una sola letra no le dice nada a quien lea el código después.",
        en: "camelCase and a self-explaining name. A leading capital is reserved for classes and objects, and a single letter tells the next reader nothing.",
      },
    },
    {
      id: "m01-l01-q4",
      kind: "text",
      prompt: {
        es: "¿Qué palabra clave declara una variable cuyo valor no puede cambiar después de asignarse?",
        en: "Which keyword declares a variable whose value cannot change after being assigned?",
      },
      accept: ["final"],
      placeholder: { es: "una palabra", en: "one word" },
      explain: {
        es: "final. Es el equivalente en código a un campo de solo lectura, y se suele combinar con nombres en MAYÚSCULAS.",
        en: "final. It is the code equivalent of a read-only field, and usually pairs with UPPER_SNAKE_CASE names.",
      },
      tags: ["recall"],
    },
    {
      id: "m01-l01-q5",
      kind: "single",
      prompt: {
        es: "Un compañero dice: «declaro la variable y le pongo el tipo cuando sepa qué va a guardar». ¿Qué le responderías?",
        en: "A colleague says: “I declare the variable and set its type once I know what it will hold.” What do you tell them?",
      },
      options: [
        {
          es: "Que en Apex el tipo se decide al declarar, igual que al crear un campo en Setup.",
          en: "That in Apex the type is decided when declaring, just like when creating a field in Setup.",
        },
        {
          es: "Que puede usar var y decidirlo luego.",
          en: "That they can use var and decide later.",
        },
        {
          es: "Que el tipo solo importa si la variable se guarda en la base de datos.",
          en: "That the type only matters if the variable is saved to the database.",
        },
        {
          es: "Que Apex deduce el tipo del primer valor asignado.",
          en: "That Apex infers the type from the first assigned value.",
        },
      ],
      answer: 0,
      explain: {
        es: "Apex es de tipado estático: el tipo forma parte de la declaración y no se deduce. Esa rigidez es lo que convierte errores de ejecución en errores de compilación.",
        en: "Apex is statically typed: the type is part of the declaration and is never inferred. That rigidity is what turns runtime errors into compile-time errors.",
      },
      tags: ["interleaving"],
    },
  ],

  exercise: {
    prompt: {
      es: "Ventas te pasa esta nota: «Para la campaña de primavera necesitamos guardar el nombre de la cuenta, cuántos contactos tiene, si es cliente estratégico y el descuento máximo autorizado, que este año es fijo en 15 y no debe poder cambiarse». Traduce la nota a declaraciones de Apex.",
      en: "Sales sends you this note: “For the spring campaign we need to hold the account name, how many contacts it has, whether it is a strategic client, and the maximum authorised discount, which this year is fixed at 15 and must not be changeable.” Turn the note into Apex declarations.",
    },
    brief: [
      {
        es: "Una variable de texto llamada accountName con el valor 'Northwind Trading'.",
        en: "A text variable named accountName holding 'Northwind Trading'.",
      },
      {
        es: "Una variable de número entero llamada contactCount con el valor 12.",
        en: "A whole-number variable named contactCount holding 12.",
      },
      {
        es: "Una variable de sí/no llamada isStrategic con el valor verdadero.",
        en: "A yes/no variable named isStrategic holding true.",
      },
      {
        es: "Una constante que no se pueda reasignar, llamada MAX_DISCOUNT, con el valor 15.",
        en: "A constant that cannot be reassigned, named MAX_DISCOUNT, holding 15.",
      },
      {
        es: "Tú eliges el tipo de cada una a partir de la descripción: la nota no te lo dice.",
        en: "You choose each type from the description: the note does not tell you.",
      },
    ],
    starter: {
      es: `// Declara aquí las cuatro variables de la nota de Ventas.
// Piensa primero qué tipo de dato pide cada frase.

`,
      en: `// Declare the four variables from the Sales note here.
// Think first about which data type each sentence asks for.

`,
    },
    hints: [
      {
        es: "Revisa línea por línea: cada declaración necesita cuatro partes y un cierre. ¿Alguna se quedó sin tipo, sin punto y coma, o con el nombre mal escrito?",
        en: "Go line by line: each declaration needs four parts and a closing character. Did one end up without a type, without a semicolon, or with a misspelled name?",
      },
      {
        es: "El tipo sale de la frase: «nombre» es texto, «cuántos» es un entero, «si es…» es verdadero o falso, y «no debe poder cambiarse» pide la palabra clave que bloquea la reasignación.",
        en: "The type comes from the sentence: “name” is text, “how many” is a whole number, “whether it is…” is true or false, and “must not be changeable” asks for the keyword that blocks reassignment.",
      },
      {
        es: "Pseudocódigo: Tipo nombreVariable = valor; — y para la última, final Tipo NOMBRE_CONSTANTE = valor;",
        en: "Pseudocode: Type variableName = value; — and for the last one, final Type CONSTANT_NAME = value;",
      },
    ],
    solution: {
      es: `String accountName = 'Northwind Trading';
Integer contactCount = 12;
Boolean isStrategic = true;
final Integer MAX_DISCOUNT = 15;`,
      en: `String accountName = 'Northwind Trading';
Integer contactCount = 12;
Boolean isStrategic = true;
final Integer MAX_DISCOUNT = 15;`,
    },
    checks: [
      {
        id: "l01-c1",
        label: {
          es: "accountName es String y guarda 'Northwind Trading'",
          en: "accountName is a String holding 'Northwind Trading'",
        },
        rule: {
          op: "match",
          pattern: "String\\s+accountName\\s*=\\s*'[^']*'\\s*;",
        },
        onFail: {
          es: "Un nombre de cuenta es texto, así que el tipo es String y el valor va entre comillas simples. Comprueba también el punto y coma.",
          en: "An account name is text, so the type is String and the value goes in single quotes. Check the semicolon too.",
        },
      },
      {
        id: "l01-c2",
        label: {
          es: "contactCount es Integer y vale 12",
          en: "contactCount is an Integer holding 12",
        },
        rule: { op: "match", pattern: "Integer\\s+contactCount\\s*=\\s*12\\s*;" },
        onFail: {
          es: "«Cuántos contactos» se cuenta en unidades enteras: no hay medio contacto. El tipo es Integer y el valor va sin comillas.",
            en: "“How many contacts” is counted in whole units: there is no half contact. The type is Integer and the value takes no quotes.",
        },
      },
      {
        id: "l01-c3",
        label: {
          es: "isStrategic es Boolean y vale true",
          en: "isStrategic is a Boolean holding true",
        },
        rule: { op: "match", pattern: "Boolean\\s+isStrategic\\s*=\\s*true\\s*;" },
        onFail: {
          es: "«Si es cliente estratégico» solo admite dos respuestas: es el checkbox de Salesforce, y en Apex se llama Boolean con valor true (sin comillas).",
          en: "“Whether it is a strategic client” has only two answers: it is the Salesforce checkbox, and in Apex that is a Boolean with value true (no quotes).",
        },
      },
      {
        id: "l01-c4",
        label: {
          es: "MAX_DISCOUNT es una constante final con valor 15",
          en: "MAX_DISCOUNT is a final constant holding 15",
        },
        rule: {
          op: "match",
          pattern: "final\\s+Integer\\s+MAX_DISCOUNT\\s*=\\s*15\\s*;",
        },
        onFail: {
          es: "«No debe poder cambiarse» es exactamente lo que hace final. Declárala como final Integer y en MAYÚSCULAS, que es la convención para constantes.",
          en: "“Must not be changeable” is exactly what final does. Declare it as a final Integer in UPPER_SNAKE_CASE, the convention for constants.",
        },
        onPass: {
          es: "Usar final donde el valor es fijo convierte un posible bug en un error de compilación. Es gratis y evita disgustos.",
          en: "Using final where the value is fixed turns a possible bug into a compile error. It is free, and it saves grief.",
        },
      },
      {
        id: "l01-c5",
        label: {
          es: "Sin redeclaraciones ni tipos repetidos",
          en: "No redeclarations or repeated types",
        },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "String\\s+accountName", max: 1 },
            { op: "count", pattern: "Integer\\s+contactCount", max: 1 },
          ],
        },
        onFail: {
          es: "Cada variable se declara una sola vez. Si querías cambiar el valor, escribe solo nombre = valor; sin repetir el tipo.",
          en: "Each variable is declared once. If you wanted to change the value, write just name = value; without repeating the type.",
        },
        optional: true,
      },
    ],
    rubric: [
      {
        es: "¿Se entiende qué guarda cada variable sin leer la nota de Ventas? Ese es el listón.",
        en: "Can you tell what each variable holds without re-reading the Sales note? That is the bar.",
      },
    ],
  },
};
