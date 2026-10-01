import type { Lesson } from "@/lib/types";

const REQUEST = `        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:ERP/renewals/' + erpCode);
        req.setMethod('GET');
        req.setTimeout(20000);
        HttpResponse res = new Http().send(req);
        if (res.getStatusCode() != 200) {
            throw new ErpApiException('El ERP respondió ' + res.getStatusCode() + ' para ' + erpCode);
        }`;

const SOLUTION_ES = `// CASO: el puente con el ERP, por dentro
// Tarea 2 de 7: del texto JSON a un objeto con campos, y de vuelta.

public class ErpClient {
    // El molde de lo que manda el ERP: {"erpCode":"ERP-100","amount":12500.00,"status":"PAID"}
    public class ErpRenewal {
        public String erpCode;
        public Decimal amount;
        public String status;
    }

    public static ErpRenewal fetchRenewal(String erpCode) {
${REQUEST}
        return (ErpRenewal) JSON.deserialize(res.getBody(), ErpRenewal.class);
    }

    public static String toJson(List<ErpRenewal> rows) {
        return JSON.serialize(rows);
    }
}`;

const en = (s: string) =>
  s
    .replace("'El ERP respondió '", "'The ERP answered '")
    .replace("' para '", "' for '");

const SOLUTION_EN = en(SOLUTION_ES)
  .replace(
    "// CASO: el puente con el ERP, por dentro\n// Tarea 2 de 7: del texto JSON a un objeto con campos, y de vuelta.",
    "// CASE: the ERP bridge, from the inside\n// Task 2 of 7: from JSON text to an object with fields, and back.",
  )
  .replace("// El molde de lo que manda el ERP:", "// The mould for what the ERP sends:");

const STARTER_ES = `// CASO: el puente con el ERP, por dentro
// Ya resuelto (tarea 1): fetchRenewal llama al ERP y devuelve el cuerpo como texto.
// Tarea 2 de 7: del texto JSON a un objeto con campos, y de vuelta.

public class ErpClient {
    // El ERP responde: {"erpCode":"ERP-100","amount":12500.00,"status":"PAID"}

    public static String fetchRenewal(String erpCode) {
${REQUEST}
        return res.getBody();
    }
}
`;

export const l02Json: Lesson = {
  id: "m11-l02",
  slug: "json",
  n: 2,
  kind: "lesson",
  minutes: 25,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 1", en: "Remember? · Review of lesson 1" },
    prompt: { es: "Antes de usar el cuerpo de una respuesta, ¿qué miras?", en: "Before using a response's body, what do you check?" },
    options: [
      { es: "El código de estado, con getStatusCode()", en: "The status code, with getStatusCode()" },
      { es: "Nada: si hay cuerpo, es bueno", en: "Nothing: if there is a body, it is good" },
      { es: "El tamaño del cuerpo", en: "The body's size" },
    ],
    answer: 0,
    explain: {
      es: "Un 500 también trae cuerpo. Hoy, qué hacer con el cuerpo de un 200.",
      en: "A 500 carries a body too. Today, what to do with a 200's body.",
    },
  },
  title: { es: "JSON: serializar y deserializar", en: "JSON: serialize and deserialize" },
  summary: {
    es: "Los sistemas se hablan en JSON, un texto con nombres y valores. Apex lo convierte en objetos con JSON.deserialize y convierte tus objetos en JSON con JSON.serialize: tú solo defines el molde.",
    en: "Systems talk to each other in JSON, a text of names and values. Apex turns it into objects with JSON.deserialize and turns your objects into JSON with JSON.serialize: you only define the mould.",
  },
  analogy: {
    es: "El mapeo de columnas de Data Loader: cada columna del archivo, a su campo",
    en: "Data Loader's column mapping: each file column, to its field",
  },
  objectives: [
    { es: "Leer un JSON: objetos, listas y pares nombre-valor.", en: "Read JSON: objects, lists and name-value pairs." },
    { es: "Convertir un JSON en un objeto de Apex con una clase molde.", en: "Turn JSON into an Apex object with a mould class." },
    { es: "Convertir objetos de Apex en JSON para enviarlos.", en: "Turn Apex objects into JSON to send them." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "fetchRenewal devuelve un texto: {\"erpCode\":\"ERP-100\",\"amount\":12500.00,\"status\":\"PAID\"}. Para saber el importe habría que buscar dentro con substring, y eso se rompe al primer cambio. Ese texto es [[json|JSON]], y Apex sabe convertirlo en un objeto con campos de verdad.",
        en: "fetchRenewal returns a text: {\"erpCode\":\"ERP-100\",\"amount\":12500.00,\"status\":\"PAID\"}. To get the amount you would have to dig inside with substring, and that breaks at the first change. That text is [[json|JSON]], and Apex knows how to turn it into an object with real fields.",
      },
    },
    {
      type: "h",
      text: { es: "Leer un JSON", en: "Reading JSON" },
    },
    {
      type: "list",
      items: [
        { es: "Las llaves { } encierran un objeto: una serie de pares «nombre»: valor.", en: "Braces { } enclose an object: a series of «name»: value pairs." },
        { es: "Los corchetes [ ] encierran una lista de valores u objetos.", en: "Brackets [ ] enclose a list of values or objects." },
        { es: "Los textos van entre comillas dobles; los números y true/false, sin comillas.", en: "Text goes in double quotes; numbers and true/false, without quotes." },
      ],
    },
    {
      type: "h",
      text: { es: "Del JSON al objeto: una clase molde", en: "From JSON to object: a mould class" },
    },
    {
      type: "code",
      code: {
        es: `public class ErpRenewal {        // un atributo por cada nombre del JSON, con su mismo nombre
    public String erpCode;
    public Decimal amount;
    public String status;
}

ErpRenewal r = (ErpRenewal) JSON.deserialize(res.getBody(), ErpRenewal.class);
System.debug(r.amount);          // 12500.00, ya como Decimal`,
        en: `public class ErpRenewal {        // one attribute per JSON name, with the same name
    public String erpCode;
    public Decimal amount;
    public String status;
}

ErpRenewal r = (ErpRenewal) JSON.deserialize(res.getBody(), ErpRenewal.class);
System.debug(r.amount);          // 12500.00, now as a Decimal`,
      },
      caption: {
        es: "JSON.deserialize devuelve un Object genérico; el (ErpRenewal) de delante es el casting del Módulo 1. Para una lista: (List<ErpRenewal>) JSON.deserialize(body, List<ErpRenewal>.class).",
        en: "JSON.deserialize returns a generic Object; the (ErpRenewal) in front is Module 1's casting. For a list: (List<ErpRenewal>) JSON.deserialize(body, List<ErpRenewal>.class).",
      },
    },
    {
      type: "diagram",
      id: "m11-json",
      caption: {
        es: "Cambia el JSON que manda el ERP y mira cómo queda el objeto: qué se rellena, qué se ignora y qué se queda en null.",
        en: "Change the JSON the ERP sends and see how the object ends up: what is filled, what is ignored and what stays null.",
      },
    },
    {
      type: "p",
      text: {
        es: "Si el JSON trae un nombre que tu clase no tiene, se ignora. Si tu clase tiene un atributo que el JSON no trae, se queda en null. Y el camino de vuelta es una línea: JSON.serialize(objeto) convierte cualquier objeto o lista de Apex en texto JSON, listo para setBody. Cuando no conoces la forma de antemano, JSON.deserializeUntyped te da un Map<String, Object> que recorres por nombre.",
        en: "If the JSON carries a name your class lacks, it is ignored. If your class has an attribute the JSON lacks, it stays null. And the way back is one line: JSON.serialize(object) turns any Apex object or list into JSON text, ready for setBody. When you do not know the shape beforehand, JSON.deserializeUntyped gives you a Map<String, Object> you walk by name.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El mapeo de columnas de Data Loader", en: "Data Loader's column mapping" },
      text: {
        es: "En Data Loader yo mapeaba cada columna del CSV a su campo, y las columnas sin mapear se ignoraban. La clase molde es ese mapeo, escrito una vez: cada nombre del JSON cae en el atributo que se llama igual, y lo que no tiene sitio se queda fuera.",
        en: "In Data Loader I mapped each CSV column to its field, and unmapped columns were ignored. The mould class is that mapping, written once: each JSON name lands in the attribute with the same name, and whatever has no place stays out.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Aquí Flow también lo lee", en: "Why not a Flow? Here Flow reads it too" },
      text: {
        es: "Con franqueza: la acción HTTP Callout de un flow hace esto con clics. Lee el JSON de la respuesta y monta el del cuerpo a partir de ejemplos que le das al configurarla, y para una forma fija funciona bien. Lo aprendes a mano por dos razones: lo necesitas en las lecciones que Flow no cubre (tu propia API, SOAP, reintentos), y cuando una integración falla, lo que aparece en el log es JSON, y hay que saber leerlo.",
        en: "Frankly: a flow's HTTP Callout action does this with clicks. It reads the response's JSON and builds the body's from samples you give it during setup, and for a fixed shape it works well. You learn it by hand for two reasons: you need it in the lessons Flow does not cover (your own API, SOAP, retries), and when an integration fails, what shows up in the log is JSON, and you have to know how to read it.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué encierran las llaves y qué los corchetes? ¿Qué pasa con un nombre del JSON que tu clase no tiene? ¿Qué método convierte una lista de objetos en JSON?",
        en: "Without looking: what do braces enclose and what do brackets? What happens to a JSON name your class does not have? Which method turns a list of objects into JSON?",
      },
    },
  ],

  quiz: [
    {
      id: "m11-l02-q1",
      kind: "single",
      prompt: { es: "¿Qué vale r.status después de esto?", en: "What is r.status after this?" },
      code: {
        es: `String body = '{"erpCode":"ERP-100","amount":12500.00}';
ErpRenewal r = (ErpRenewal) JSON.deserialize(body, ErpRenewal.class);`,
        en: `String body = '{"erpCode":"ERP-100","amount":12500.00}';
ErpRenewal r = (ErpRenewal) JSON.deserialize(body, ErpRenewal.class);`,
      },
      options: [
        { es: "null: el JSON no trae status", en: "null: the JSON carries no status" },
        { es: "Un texto vacío", en: "An empty text" },
        { es: "Salta una excepción", en: "An exception is thrown" },
        { es: "'PAID'", en: "'PAID'" },
      ],
      answer: 0,
      explain: {
        es: "Lo que el JSON no trae se queda en null. Antes de usarlo, compruébalo, como en el Módulo 1.",
        en: "What the JSON does not carry stays null. Check it before using it, as in Module 1.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m11-l02-q2",
      kind: "single",
      prompt: {
        es: "El ERP añade mañana un campo \"currency\" a su respuesta. ¿Qué pasa con tu código?",
        en: "Tomorrow the ERP adds a \"currency\" field to its response. What happens to your code?",
      },
      options: [
        { es: "Nada: JSON.deserialize ignora los nombres que la clase no tiene", en: "Nothing: JSON.deserialize ignores names the class lacks" },
        { es: "Falla al deserializar", en: "It fails to deserialize" },
        { es: "Hay que redesplegar ese mismo día", en: "It must be redeployed that same day" },
        { es: "El campo se guarda en status", en: "The field is stored in status" },
      ],
      answer: 0,
      explain: {
        es: "Los nombres desconocidos se ignoran. Por eso una integración bien hecha aguanta que el otro lado añada datos.",
        en: "Unknown names are ignored. That is why a well-built integration survives the other side adding data.",
      },
    },
    {
      id: "m11-l02-q3",
      kind: "single",
      prompt: { es: "¿Qué es esto en JSON: [ {\"erpCode\":\"ERP-100\"}, {\"erpCode\":\"ERP-200\"} ]?", en: "What is this in JSON: [ {\"erpCode\":\"ERP-100\"}, {\"erpCode\":\"ERP-200\"} ]?" },
      options: [
        { es: "Una lista de dos objetos", en: "A list of two objects" },
        { es: "Un objeto con dos campos", en: "An object with two fields" },
        { es: "Dos listas", en: "Two lists" },
        { es: "Un texto", en: "A text" },
      ],
      answer: 0,
      explain: {
        es: "Corchetes, lista; llaves, objeto. En Apex: List<ErpRenewal>.",
        en: "Brackets, list; braces, object. In Apex: List<ErpRenewal>.",
      },
    },
    {
      id: "m11-l02-q4",
      kind: "text",
      prompt: {
        es: "Escribe la expresión que convierte la lista rows en texto JSON.",
        en: "Write the expression that turns the rows list into JSON text.",
      },
      accept: ["json\\.serialize\\(\\s*rows\\s*\\)\\s*;?"],
      placeholder: { es: "JSON.…", en: "JSON.…" },
      explain: { es: "JSON.serialize(rows)", en: "JSON.serialize(rows)" },
      tags: ["recall"],
    },
    {
      id: "m11-l02-q5",
      kind: "single",
      prompt: { es: "¿Cuándo usarías JSON.deserializeUntyped?", en: "When would you use JSON.deserializeUntyped?" },
      options: [
        { es: "Cuando no conoces de antemano la forma del JSON", en: "When you do not know the JSON's shape beforehand" },
        { es: "Siempre: es más rápido", en: "Always: it is faster" },
        { es: "Para convertir objetos en JSON", en: "To turn objects into JSON" },
        { es: "Solo en tests", en: "Only in tests" },
      ],
      answer: 0,
      explain: {
        es: "Devuelve un Map<String, Object> que recorres por nombre. Con una forma conocida, la clase molde es más segura.",
        en: "It returns a Map<String, Object> you walk by name. With a known shape, the mould class is safer.",
      },
    },
    {
      id: "m11-l02-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿qué es el (ErpRenewal) delante de JSON.deserialize(…)?",
        en: "Review: what is the (ErpRenewal) in front of JSON.deserialize(…)?",
      },
      options: [
        { es: "Un casting: le dices a Apex de qué tipo es el Object que vuelve", en: "A cast: you tell Apex which type the returned Object is" },
        { es: "Una llamada a un constructor", en: "A constructor call" },
        { es: "Un comentario", en: "A comment" },
        { es: "Una anotación", en: "An annotation" },
      ],
      answer: 0,
      explain: {
        es: "El casting del Módulo 1, lección 9: el tipo entre paréntesis delante del valor.",
        en: "Module 1, lesson 9's casting: the type in brackets in front of the value.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M1 L9", en: "Review · M1 L9" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 2 DE 7 · fetchRenewal devuelve un texto que nadie puede usar sin trocearlo. Define el molde ErpRenewal y haz que fetchRenewal devuelva un objeto con sus campos. Y como el puente también envía renovaciones, añade un método que convierta una lista de ErpRenewal en JSON.",
      en: "TASK 2 OF 7 · fetchRenewal returns a text nobody can use without chopping it up. Define the ErpRenewal mould and make fetchRenewal return an object with its fields. And since the bridge also sends renewals, add a method that turns a list of ErpRenewal into JSON.",
    },
    brief: [
      {
        es: "Dentro de ErpClient, una clase ErpRenewal con tres atributos public: erpCode (String), amount (Decimal) y status (String), con los mismos nombres que el JSON.",
        en: "Inside ErpClient, an ErpRenewal class with three public attributes: erpCode (String), amount (Decimal) and status (String), with the same names as the JSON.",
      },
      {
        es: "fetchRenewal devuelve ErpRenewal: (ErpRenewal) JSON.deserialize(res.getBody(), ErpRenewal.class).",
        en: "fetchRenewal returns ErpRenewal: (ErpRenewal) JSON.deserialize(res.getBody(), ErpRenewal.class).",
      },
      {
        es: "public static String toJson(List<ErpRenewal> rows): devuelve JSON.serialize(rows).",
        en: "public static String toJson(List<ErpRenewal> rows): returns JSON.serialize(rows).",
      },
    ],
    starter: {
      es: STARTER_ES,
      en: en(STARTER_ES)
        .replace(
          "// CASO: el puente con el ERP, por dentro\n// Ya resuelto (tarea 1): fetchRenewal llama al ERP y devuelve el cuerpo como texto.\n// Tarea 2 de 7: del texto JSON a un objeto con campos, y de vuelta.",
          "// CASE: the ERP bridge, from the inside\n// Already solved (task 1): fetchRenewal calls the ERP and returns the body as text.\n// Task 2 of 7: from JSON text to an object with fields, and back.",
        )
        .replace("// El ERP responde:", "// The ERP answers:"),
    },
    hints: [
      {
        es: "Yo lo pensaría como mapear un CSV: ¿qué columnas trae el archivo y de qué tipo es cada una? Eso es la clase molde.",
        en: "I would think of it as mapping a CSV: which columns does the file bring and what type is each? That is the mould class.",
      },
      {
        es: "Lo que me ayudó: los atributos tienen que llamarse como los nombres del JSON. Y JSON.deserialize devuelve un Object, así que necesita el casting delante.",
        en: "What helped me: the attributes must be named like the JSON names. And JSON.deserialize returns an Object, so it needs the cast in front.",
      },
      {
        es: "Te dejo el esquema: public class ErpRenewal { public String erpCode; public Decimal amount; public String status; } · public static ErpRenewal fetchRenewal(String erpCode) { … return (ErpRenewal) JSON.deserialize(res.getBody(), ErpRenewal.class); } · public static String toJson(List<ErpRenewal> rows) { return JSON.serialize(rows); }",
        en: "Here is the outline: public class ErpRenewal { public String erpCode; public Decimal amount; public String status; } · public static ErpRenewal fetchRenewal(String erpCode) { … return (ErpRenewal) JSON.deserialize(res.getBody(), ErpRenewal.class); } · public static String toJson(List<ErpRenewal> rows) { return JSON.serialize(rows); }",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m11-l02-c1",
        label: { es: "El molde ErpRenewal con sus tres campos", en: "The ErpRenewal mould with its three fields" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "class\\s+ErpRenewal\\s*\\{" },
            { op: "match", pattern: "public\\s+String\\s+erpCode\\s*;" },
            { op: "match", pattern: "public\\s+Decimal\\s+amount\\s*;" },
            { op: "match", pattern: "public\\s+String\\s+status\\s*;" },
          ],
        },
        onFail: {
          es: "public class ErpRenewal { public String erpCode; public Decimal amount; public String status; }",
          en: "public class ErpRenewal { public String erpCode; public Decimal amount; public String status; }",
        },
        otter: {
          es: "Es tu mapeo de columnas: una clase ErpRenewal con un atributo public por cada nombre del JSON, llamado igual: erpCode, amount (Decimal, es dinero) y status.",
          en: "It is your column mapping: an ErpRenewal class with a public attribute per JSON name, named the same: erpCode, amount (Decimal, it is money) and status.",
        },
      },
      {
        id: "m11-l02-c2",
        label: { es: "fetchRenewal devuelve un objeto, no un texto", en: "fetchRenewal returns an object, not a text" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "static\\s+ErpRenewal\\s+fetchRenewal\\s*\\(" },
            { op: "match", pattern: "\\(\\s*ErpRenewal\\s*\\)\\s*JSON\\s*\\.\\s*deserialize\\s*\\(\\s*\\w+\\s*\\.\\s*getBody\\s*\\(\\s*\\)\\s*,\\s*ErpRenewal\\s*\\.\\s*class\\s*\\)" },
          ],
        },
        onFail: {
          es: "public static ErpRenewal fetchRenewal(…) y al final: return (ErpRenewal) JSON.deserialize(res.getBody(), ErpRenewal.class);",
          en: "public static ErpRenewal fetchRenewal(…) and at the end: return (ErpRenewal) JSON.deserialize(res.getBody(), ErpRenewal.class);",
        },
        otter: {
          es: "Cambia lo que devuelve: ErpRenewal en vez de String. Y la conversión es una línea: (ErpRenewal) JSON.deserialize(res.getBody(), ErpRenewal.class), con su casting delante.",
          en: "Change what it returns: ErpRenewal instead of String. And the conversion is one line: (ErpRenewal) JSON.deserialize(res.getBody(), ErpRenewal.class), with its cast in front.",
        },
      },
      {
        id: "m11-l02-c3",
        label: { es: "toJson convierte la lista en JSON", en: "toJson turns the list into JSON" },
        rule: {
          op: "match",
          pattern: "static\\s+String\\s+toJson\\s*\\(\\s*List\\s*<\\s*ErpRenewal\\s*>\\s+(\\w+)\\s*\\)\\s*\\{\\s*return\\s+JSON\\s*\\.\\s*serialize\\s*\\(\\s*\\w+\\s*\\)\\s*;",
        },
        onFail: {
          es: "public static String toJson(List<ErpRenewal> rows) { return JSON.serialize(rows); }",
          en: "public static String toJson(List<ErpRenewal> rows) { return JSON.serialize(rows); }",
        },
        otter: {
          es: "El camino de vuelta, para cuando el puente envía: public static String toJson(List<ErpRenewal> rows) { return JSON.serialize(rows); }.",
          en: "The way back, for when the bridge sends: public static String toJson(List<ErpRenewal> rows) { return JSON.serialize(rows); }.",
        },
      },
    ],
    rubric: [
      {
        es: "Si el ERP manda \"amount\":\"doce mil\" (un texto donde esperas un número), ¿qué crees que pasa al deserializar? ¿Dónde lo capturarías?",
        en: "If the ERP sends \"amount\":\"twelve thousand\" (text where you expect a number), what do you think happens on deserialize? Where would you catch it?",
      },
    ],
    voice: "otter",
    outro: {
      es: "El puente ya entiende lo que el ERP le dice y sabe contestarle en su idioma. Pero la dirección empieza por un misterioso callout:ERP. En la tarea 3 ves qué hay detrás y por qué ninguna contraseña debería vivir en el código.",
      en: "The bridge now understands what the ERP tells it and can answer in its language. But the address starts with a mysterious callout:ERP. In task 3 you see what is behind it and why no password should live in code.",
    },
  },
};
