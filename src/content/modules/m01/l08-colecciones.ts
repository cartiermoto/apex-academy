import type { Lesson } from "@/lib/types";

export const l08Colecciones: Lesson = {
  id: "m01-l08",
  slug: "colecciones",
  n: 8,
  kind: "lesson",
  minutes: 28,
  title: { es: "Colecciones: List, Set y Map", en: "Collections: List, Set and Map" },
  summary: {
    es: "Una variable guarda un dato. Estas tres guardan muchos, y elegir mal entre ellas es lo que separa el código que aguanta 200 registros del que no.",
    en: "A variable holds one value. These three hold many, and choosing wrongly between them is what separates code that survives 200 records from code that does not.",
  },
  analogy: {
    es: "Lista relacionada, agrupación de informe y cruce por Id",
    en: "Related list, report grouping and matching by Id",
  },
  objectives: [
    {
      es: "Elegir entre List, Set y Map según la pregunta que tengas que responder.",
      en: "Choose between List, Set and Map based on the question you need to answer.",
    },
    {
      es: "Crear colecciones y añadir, leer y consultar sus elementos.",
      en: "Create collections and add, read and query their elements.",
    },
    {
      es: "Anticipar qué devuelve un Map cuando la clave no existe.",
      en: "Anticipate what a Map returns when the key is missing.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Abre una cuenta y mira la lista relacionada de contactos: filas en un orden, con posibles repeticiones de nombre. Abre el filtro de un informe por Industry: valores únicos, sin repetir. Y piensa en cómo cruzas dos exportaciones por Id. Acabas de recorrer List, Set y Map.",
        en: "Open an account and look at the related list of contacts: rows in an order, with names that may repeat. Open a report filter by Industry: unique values, no repeats. Then think about how you cross two exports by Id. You have just walked through List, Set and Map.",
      },
    },
    {
      type: "diagram",
      id: "m01-collections",
      caption: {
        es: "Tres formas de guardar muchos datos, cada una buena en algo distinto.",
        en: "Three ways to hold many values, each good at something different.",
      },
    },
    {
      type: "h",
      text: { es: "Cómo se declara una colección", en: "How a collection is declared" },
    },
    {
      type: "p",
      text: {
        es: "Una colección declara dos cosas: qué tipo de colección es y qué guarda dentro, entre los símbolos de mayor y menor. List<String> es «una lista de textos» y no aceptará números. Es la misma promesa del tipo de la primera sub-lección, aplicada al contenido.",
        en: "A collection declares two things: which kind of collection it is, and what it holds inside, between angle brackets. List<String> is “a list of text values” and will not take numbers. It is the same type promise from the first sub-lesson, applied to the contents.",
      },
    },
    {
      type: "code",
      code: {
        es: `List<String> regions = new List<String>();
List<String> stages = new List<String>{ 'Prospecting', 'Closed Won' };
Set<Id> accountIds = new Set<Id>();
Map<Id, Account> accountsById = new Map<Id, Account>();`,
        en: `List<String> regions = new List<String>();
List<String> stages = new List<String>{ 'Prospecting', 'Closed Won' };
Set<Id> accountIds = new Set<Id>();
Map<Id, Account> accountsById = new Map<Id, Account>();`,
      },
      caption: {
        es: "Las llaves permiten crear la colección ya con contenido. Sin ellas, nace vacía pero lista para usarse.",
        en: "The braces let you create the collection with contents already in it. Without them it is born empty but ready to use.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Vacía no es null", en: "Empty is not null" },
      text: {
        es: "new List<String>() crea una lista que existe y no tiene nada dentro: puedes añadirle elementos sin problema. Una List declarada y no asignada vale null, y añadirle algo lanza un NullPointerException. Es el mismo blanco de la sub-lección 6, con otro disfraz.",
        en: "new List<String>() creates a list that exists and holds nothing: you can add to it happily. A List declared and never assigned is null, and adding to it throws a NullPointerException. Same blank from sub-lesson 6, wearing a different costume.",
      },
    },
    {
      type: "h",
      text: { es: "List: orden y posiciones", en: "List: order and positions" },
    },
    {
      type: "p",
      text: {
        es: "Una List mantiene el orden en que metiste las cosas y admite repetidos. Cada elemento tiene una posición, empezando en 0 — igual que substring, y por la misma convención.",
        en: "A List keeps the order you put things in and accepts duplicates. Each element has a position, starting at 0 — just like substring, by the same convention.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Método", en: "Method" },
        { es: "Qué hace", en: "What it does" },
        { es: "Devuelve", en: "Returns" },
      ],
      rows: [
        [
          { es: "add(valor)", en: "add(value)" },
          { es: "Añade al final.", en: "Appends at the end." },
          { es: "nada", en: "nothing" },
        ],
        [
          { es: "get(0)  o  lista[0]", en: "get(0)  or  list[0]" },
          { es: "Lee la posición indicada.", en: "Reads the given position." },
          { es: "el elemento", en: "the element" },
        ],
        [
          { es: "size()", en: "size()" },
          { es: "Cuántos elementos hay.", en: "How many elements there are." },
          { es: "Integer", en: "Integer" },
        ],
        [
          { es: "isEmpty()", en: "isEmpty()" },
          { es: "¿Está vacía?", en: "Is it empty?" },
          { es: "Boolean", en: "Boolean" },
        ],
        [
          { es: "contains(valor)", en: "contains(value)" },
          { es: "¿Está dentro?", en: "Is it inside?" },
          { es: "Boolean", en: "Boolean" },
        ],
        [
          { es: "sort()", en: "sort()" },
          { es: "Ordena la lista en el sitio.", en: "Sorts the list in place." },
          { es: "nada", en: "nothing" },
        ],
      ],
    },
    {
      type: "code",
      code: {
        es: `List<String> pipeline = new List<String>();
pipeline.add('Prospecting');
pipeline.add('Negotiation');
pipeline.add('Prospecting');        // repetido: la List lo acepta

Integer howMany = pipeline.size();  // 3
String first = pipeline.get(0);     // 'Prospecting'
Boolean empty = pipeline.isEmpty(); // false`,
        en: `List<String> pipeline = new List<String>();
pipeline.add('Prospecting');
pipeline.add('Negotiation');
pipeline.add('Prospecting');        // duplicate: the List accepts it

Integer howMany = pipeline.size();  // 3
String first = pipeline.get(0);     // 'Prospecting'
Boolean empty = pipeline.isEmpty(); // false`,
      },
      caption: {
        es: "Fíjate en que add() no devuelve nada: modifica la lista. Las colecciones sí cambian por dentro, al contrario que los String.",
        en: "Note that add() returns nothing: it modifies the list. Collections do change internally, unlike Strings.",
      },
    },
    {
      type: "h",
      text: { es: "Set: sin repetidos", en: "Set: no duplicates" },
    },
    {
      type: "p",
      text: {
        es: "Un Set ignora los duplicados: si añades dos veces el mismo valor, sigue habiendo uno. A cambio, no tiene posiciones — no puedes pedirle «el tercero» — y no garantiza el orden. Es la colección que usas cuando la pregunta es «¿está esto aquí?» o «¿cuáles son los valores distintos?».",
        en: "A Set ignores duplicates: add the same value twice and there is still one. In exchange it has no positions — you cannot ask for “the third one” — and it guarantees no order. It is the collection you reach for when the question is “is this in here?” or “what are the distinct values?”.",
      },
    },
    {
      type: "code",
      code: {
        es: `Set<String> industries = new Set<String>();
industries.add('Technology');
industries.add('Retail');
industries.add('Technology');          // se descarta

Integer distinct = industries.size();  // 2
Boolean hasRetail = industries.contains('Retail');  // true`,
        en: `Set<String> industries = new Set<String>();
industries.add('Technology');
industries.add('Retail');
industries.add('Technology');          // dropped

Integer distinct = industries.size();  // 2
Boolean hasRetail = industries.contains('Retail');  // true`,
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El Set que ya usabas sin saberlo", en: "The Set you already used without knowing" },
      text: {
        es: "Cuando agrupas un informe por Industry, la columna de grupos es un Set: cada valor aparece una vez aunque haya 4.000 cuentas detrás. Y cuando en Apex quieras recoger los Ids de cuenta de [[lote|200 Leads]] para [[soql|consultarlos]] de una vez, el Set es lo que evita pedir el mismo Id veinte veces.",
        en: "When you group a report by Industry, the group column is a Set: each value shows once even with 4,000 accounts behind it. And when in Apex you gather account Ids from [[lote|200 Leads]] to [[soql|query them]] in one go, the Set is what stops you asking for the same Id twenty times.",
      },
    },
    {
      type: "h",
      text: { es: "Map: buscar por clave", en: "Map: looking up by key" },
    },
    {
      type: "p",
      text: {
        es: "Un Map guarda parejas: una clave y un valor. Le das la clave y te devuelve el valor, sin recorrer nada. Es el cruce por Id que harías en una hoja de cálculo, pero instantáneo, y es la estructura que sostiene prácticamente todo el Apex de producción.",
        en: "A Map stores pairs: a key and a value. You hand it the key and it hands back the value, without scanning anything. It is the cross-reference by Id you would do in a spreadsheet, but instant — and it is the structure that holds up practically all production Apex.",
      },
    },
    {
      type: "code",
      code: {
        es: `Map<String, Decimal> quotaByRegion = new Map<String, Decimal>();
quotaByRegion.put('EMEA', 150000);
quotaByRegion.put('AMER', 220000);

Decimal emeaQuota = quotaByRegion.get('EMEA');      // 150000
Boolean hasApac = quotaByRegion.containsKey('APAC'); // false
Integer regions = quotaByRegion.size();              // 2`,
        en: `Map<String, Decimal> quotaByRegion = new Map<String, Decimal>();
quotaByRegion.put('EMEA', 150000);
quotaByRegion.put('AMER', 220000);

Decimal emeaQuota = quotaByRegion.get('EMEA');       // 150000
Boolean hasApac = quotaByRegion.containsKey('APAC'); // false
Integer regions = quotaByRegion.size();              // 2`,
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "get() con una clave que no existe devuelve null", en: "get() with a missing key returns null" },
      text: {
        es: "No lanza error: devuelve null, silenciosamente. Si la línea siguiente hace cuentas con ese valor, el NullPointerException salta ahí y parece que el problema está en la operación, cuando estaba en la clave. Por eso existe containsKey(), y por eso el operador condicional que viste en la sub-lección anterior aparece tanto al lado de un get().",
        en: "It does not error: it returns null, quietly. If the next line does arithmetic with that value, the NullPointerException fires there and looks like a problem with the maths, when it was a problem with the key. That is why containsKey() exists, and why the conditional operator from the previous sub-lesson shows up so often next to a get().",
      },
    },
    {
      type: "code",
      code: {
        es: `Decimal apacQuota = quotaByRegion.get('APAC');        // null
Decimal safeQuota = quotaByRegion.containsKey('APAC')
    ? quotaByRegion.get('APAC')
    : 0;                                                  // 0`,
        en: `Decimal apacQuota = quotaByRegion.get('APAC');        // null
Decimal safeQuota = quotaByRegion.containsKey('APAC')
    ? quotaByRegion.get('APAC')
    : 0;                                                  // 0`,
      },
    },
    {
      type: "h",
      text: { es: "Cuál elegir", en: "Which one to choose" },
    },
    {
      type: "table",
      head: [
        { es: "Si necesitas…", en: "If you need…" },
        { es: "Usa", en: "Use" },
        { es: "Porque", en: "Because" },
      ],
      rows: [
        [
          { es: "Conservar el orden o admitir repetidos", en: "Keep order, or allow duplicates" },
          { es: "List", en: "List" },
          { es: "Es la única con posiciones.", en: "It is the only one with positions." },
        ],
        [
          { es: "Valores únicos, o preguntar «¿está?»", en: "Unique values, or asking “is it there?”" },
          { es: "Set", en: "Set" },
          { es: "Descarta duplicados por diseño.", en: "It drops duplicates by design." },
        ],
        [
          { es: "Encontrar algo por una clave", en: "Find something by a key" },
          { es: "Map", en: "Map" },
          { es: "Responde sin recorrer la colección.", en: "It answers without scanning." },
        ],
      ],
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿qué devuelve size() sobre un Set al que has añadido tres veces el mismo valor? ¿Y qué devuelve get() con una clave inexistente?",
        en: "Without looking up: what does size() return on a Set you added the same value to three times? And what does get() return for a key that is not there?",
      },
    },
  ],

  quiz: [
    {
      id: "m01-l08-q1",
      kind: "single",
      prompt: { es: "¿Qué imprime este código?", en: "What does this code print?" },
      code: {
        es: `Set<String> regions = new Set<String>();
regions.add('EMEA');
regions.add('EMEA');
regions.add('AMER');
System.debug(regions.size());`,
        en: `Set<String> regions = new Set<String>();
regions.add('EMEA');
regions.add('EMEA');
regions.add('AMER');
System.debug(regions.size());`,
      },
      options: [
        { es: "2", en: "2" },
        { es: "3", en: "3" },
        { es: "1", en: "1" },
        { es: "Lanza una excepción por duplicado.", en: "It throws a duplicate exception." },
      ],
      answer: 0,
      explain: {
        es: "El Set descarta el duplicado sin protestar. No falla, simplemente no lo guarda dos veces.",
        en: "The Set drops the duplicate without complaining. It does not fail, it simply does not store it twice.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m01-l08-q2",
      kind: "single",
      prompt: { es: "¿Cuál es el valor de quota?", en: "What is the value of quota?" },
      code: {
        es: `Map<String, Decimal> quotaByRegion = new Map<String, Decimal>();
quotaByRegion.put('EMEA', 150000);
Decimal quota = quotaByRegion.get('APAC');`,
        en: `Map<String, Decimal> quotaByRegion = new Map<String, Decimal>();
quotaByRegion.put('EMEA', 150000);
Decimal quota = quotaByRegion.get('APAC');`,
      },
      options: [
        { es: "null", en: "null" },
        { es: "0", en: "0" },
        { es: "150000", en: "150000" },
        { es: "Lanza una excepción.", en: "It throws an exception." },
      ],
      answer: 0,
      explain: {
        es: "Una clave que no existe devuelve null en silencio. El error llegará después, cuando alguien intente sumar o multiplicar esa variable.",
        en: "A missing key returns null silently. The error arrives later, when somebody tries to add or multiply that variable.",
      },
      tags: ["predict-output", "interleaving"],
    },
    {
      id: "m01-l08-q3",
      kind: "single",
      prompt: {
        es: "Necesitas recoger los Ids de cuenta de 200 Leads para luego buscarlos de una vez, sin repetir ninguno. ¿Qué colección usas?",
        en: "You need to gather account Ids from 200 Leads to look them up in one go, with no repeats. Which collection do you use?",
      },
      options: [
        { es: "Set<Id>", en: "Set<Id>" },
        { es: "List<Id>", en: "List<Id>" },
        { es: "Map<Id, Id>", en: "Map<Id, Id>" },
        { es: "List<String>", en: "List<String>" },
      ],
      answer: 0,
      explain: {
        es: "Sin repetidos y sin importar el orden: eso es exactamente un Set. Con una List acabarías pidiendo la misma cuenta veinte veces.",
        en: "No duplicates and order irrelevant: that is exactly a Set. With a List you would end up asking for the same account twenty times.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m01-l08-q4",
      kind: "single",
      prompt: { es: "¿Qué está mal aquí?", en: "What is wrong here?" },
      code: {
        es: `List<String> regions;
regions.add('EMEA');`,
        en: `List<String> regions;
regions.add('EMEA');`,
      },
      options: [
        {
          es: "La lista nunca se creó: vale null, y add() sobre null lanza NullPointerException.",
          en: "The list was never created: it is null, and add() on null throws a NullPointerException.",
        },
        {
          es: "Falta declarar el tipo de la lista.",
          en: "The list type is missing.",
        },
        {
          es: "add() no existe en List.",
          en: "add() does not exist on List.",
        },
        { es: "Nada, es correcto.", en: "Nothing, it is correct." },
      ],
      answer: 0,
      explain: {
        es: "Declarar no crea. Hacía falta new List<String>(); una lista vacía y una lista inexistente se parecen en el código y no se parecen en nada en ejecución.",
        en: "Declaring does not create. It needed new List<String>(); an empty list and a non-existent list look alike in the code and behave nothing alike at runtime.",
      },
      tags: ["find-error", "spaced"],
      from: { es: "Repaso · M1 L6", en: "Review · M1 L6" },
    },
    {
      id: "m01-l08-q5",
      kind: "multi",
      prompt: {
        es: "¿Cuáles de estas operaciones existen en un Set?",
        en: "Which of these operations exist on a Set?",
      },
      options: [
        { es: "contains(valor)", en: "contains(value)" },
        { es: "size()", en: "size()" },
        { es: "get(0)", en: "get(0)" },
        { es: "add(valor)", en: "add(value)" },
      ],
      answers: [0, 1, 3],
      explain: {
        es: "Un Set no tiene posiciones, así que no hay get(0). Si necesitas el elemento «en la posición N», la colección correcta era una List.",
        en: "A Set has no positions, so there is no get(0). If you need the element “at position N”, the right collection was a List.",
      },
    },
    {
      id: "m01-l08-q6",
      kind: "text",
      prompt: {
        es: "Escribe la declaración de un mapa vacío que relacione Ids de cuenta con registros de cuenta. Llámalo accountsById.",
        en: "Write the declaration of an empty map relating account Ids to account records. Name it accountsById.",
      },
      accept: [
        "map\\s*<\\s*id\\s*,\\s*account\\s*>\\s*accountsbyid\\s*=\\s*new\\s+map\\s*<\\s*id\\s*,\\s*account\\s*>\\s*\\(\\s*\\)\\s*;?",
      ],
      placeholder: { es: "Map<…> … = …", en: "Map<…> … = …" },
      explain: {
        es: "Map<Id, Account> accountsById = new Map<Id, Account>(); — el tipo se escribe dos veces: en la declaración y al crear el mapa.",
        en: "Map<Id, Account> accountsById = new Map<Id, Account>(); — the type appears twice: in the declaration and when creating the map.",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "Operaciones quiere un resumen del pipeline de la semana. Te dan tres necesidades distintas; cada una pide una colección diferente. Elige tú cuál en cada caso y llena las tres.",
      en: "Operations wants a summary of this week's pipeline. You are given three different needs; each calls for a different collection. You choose which, and fill all three.",
    },
    brief: [
      {
        es: "stageHistory: las fases por las que ha pasado una oportunidad, en orden y admitiendo repeticiones. Añade 'Prospecting', 'Negotiation' y 'Prospecting'.",
        en: "stageHistory: the stages an opportunity has gone through, in order and allowing repeats. Add 'Prospecting', 'Negotiation' and 'Prospecting'.",
      },
      {
        es: "activeRegions: las regiones distintas con actividad, sin repetidos. Añade 'EMEA', 'AMER' y 'EMEA'.",
        en: "activeRegions: the distinct regions with activity, no duplicates. Add 'EMEA', 'AMER' and 'EMEA'.",
      },
      {
        es: "quotaByRegion: la cuota de cada región, para poder consultarla por nombre. Guarda 'EMEA' → 150000 y 'AMER' → 220000.",
        en: "quotaByRegion: each region's quota, so it can be looked up by name. Store 'EMEA' → 150000 and 'AMER' → 220000.",
      },
      {
        es: "stageCount: cuántas fases hay en stageHistory. distinctRegions: cuántas regiones distintas hay.",
        en: "stageCount: how many stages are in stageHistory. distinctRegions: how many distinct regions there are.",
      },
      {
        es: "apacQuota: la cuota de 'APAC', que no está en el mapa, sustituida por 0 si no existe. Que no salga null.",
        en: "apacQuota: the quota for 'APAC', which is not in the map, replaced by 0 when missing. It must not come out null.",
      },
    ],
    starter: {
      es: `// Tres necesidades, tres colecciones distintas. Elige cada una.

`,
      en: `// Three needs, three different collections. You pick each one.

`,
    },
    hints: [
      {
        es: "Revisa la última variable: ¿qué devuelve exactamente un get() con una clave que no está en el mapa, y qué pasaría si alguien sumara ese valor?",
        en: "Look at the last variable: what exactly does a get() return for a key that is not in the map, and what would happen if someone added that value up?",
      },
      {
        es: "containsKey() responde si la clave existe antes de pedir el valor, y el operador condicional de la sub-lección anterior te deja elegir el valor por defecto en la misma línea.",
        en: "containsKey() tells you whether the key exists before you ask for the value, and the conditional operator from the previous sub-lesson lets you pick the default on the same line.",
      },
      {
        es: "Pseudocódigo: Decimal apacQuota = quotaByRegion.containsKey('APAC') ? quotaByRegion.get('APAC') : 0;",
        en: "Pseudocode: Decimal apacQuota = quotaByRegion.containsKey('APAC') ? quotaByRegion.get('APAC') : 0;",
      },
    ],
    solution: {
      es: `List<String> stageHistory = new List<String>();
stageHistory.add('Prospecting');
stageHistory.add('Negotiation');
stageHistory.add('Prospecting');

Set<String> activeRegions = new Set<String>();
activeRegions.add('EMEA');
activeRegions.add('AMER');
activeRegions.add('EMEA');

Map<String, Decimal> quotaByRegion = new Map<String, Decimal>();
quotaByRegion.put('EMEA', 150000);
quotaByRegion.put('AMER', 220000);

Integer stageCount = stageHistory.size();
Integer distinctRegions = activeRegions.size();

Decimal apacQuota = quotaByRegion.containsKey('APAC')
    ? quotaByRegion.get('APAC')
    : 0;`,
      en: `List<String> stageHistory = new List<String>();
stageHistory.add('Prospecting');
stageHistory.add('Negotiation');
stageHistory.add('Prospecting');

Set<String> activeRegions = new Set<String>();
activeRegions.add('EMEA');
activeRegions.add('AMER');
activeRegions.add('EMEA');

Map<String, Decimal> quotaByRegion = new Map<String, Decimal>();
quotaByRegion.put('EMEA', 150000);
quotaByRegion.put('AMER', 220000);

Integer stageCount = stageHistory.size();
Integer distinctRegions = activeRegions.size();

Decimal apacQuota = quotaByRegion.containsKey('APAC')
    ? quotaByRegion.get('APAC')
    : 0;`,
    },
    checks: [
      {
        id: "l08-c1",
        label: {
          es: "stageHistory es una List creada y con tres elementos",
          en: "stageHistory is a created List with three elements",
        },
        rule: {
          op: "all",
          of: [
            {
              op: "match",
              pattern: "List\\s*<\\s*String\\s*>\\s+stageHistory\\s*=\\s*new\\s+List\\s*<\\s*String\\s*>",
            },
            { op: "count", pattern: "stageHistory\\s*\\.\\s*add\\s*\\(", min: 3 },
          ],
        },
        onFail: {
          es: "«En orden y admitiendo repeticiones» solo lo cumple una List — y hay que crearla con new, no solo declararla.",
          en: "“In order and allowing repeats” is only a List — and it must be created with new, not merely declared.",
        },
      },
      {
        id: "l08-c2",
        label: {
          es: "activeRegions es un Set",
          en: "activeRegions is a Set",
        },
        rule: {
          op: "all",
          of: [
            {
              op: "match",
              pattern: "Set\\s*<\\s*String\\s*>\\s+activeRegions\\s*=\\s*new\\s+Set\\s*<\\s*String\\s*>",
            },
            { op: "count", pattern: "activeRegions\\s*\\.\\s*add\\s*\\(", min: 3 },
          ],
        },
        onFail: {
          es: "«Distintas, sin repetidos» es un Set. Con una List tendrías 'EMEA' dos veces y el recuento saldría mal.",
          en: "“Distinct, no duplicates” is a Set. With a List you would hold 'EMEA' twice and the count would come out wrong.",
        },
        onPass: {
          es: "Elegir el Set hace que la deduplicación sea gratis: no hay que escribir ni comprobar nada.",
          en: "Choosing the Set makes deduplication free: there is nothing to write and nothing to check.",
        },
      },
      {
        id: "l08-c3",
        label: {
          es: "quotaByRegion es un Map con las dos cuotas",
          en: "quotaByRegion is a Map holding both quotas",
        },
        rule: {
          op: "all",
          of: [
            {
              op: "match",
              pattern: "Map\\s*<\\s*String\\s*,\\s*Decimal\\s*>\\s+quotaByRegion\\s*=\\s*new\\s+Map\\s*<",
            },
            { op: "count", pattern: "quotaByRegion\\s*\\.\\s*put\\s*\\(", min: 2 },
          ],
        },
        onFail: {
          es: "«Consultarla por nombre» es un Map con clave String. Y las cuotas son dinero: el valor va en Decimal, no en Integer.",
          en: "“Looked up by name” is a Map keyed by String. And quotas are money: the value goes in a Decimal, not an Integer.",
        },
      },
      {
        id: "l08-c4",
        label: {
          es: "Los recuentos salen de size()",
          en: "The counts come from size()",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Integer\\s+stageCount\\s*=\\s*stageHistory\\s*\\.\\s*size\\s*\\(\\s*\\)" },
            {
              op: "match",
              pattern: "Integer\\s+distinctRegions\\s*=\\s*activeRegions\\s*\\.\\s*size\\s*\\(\\s*\\)",
            },
          ],
        },
        onFail: {
          es: "Escribir 3 y 2 a mano funciona con estos datos exactos y con ningunos otros. size() los cuenta siempre bien.",
          en: "Typing 3 and 2 by hand works with these exact values and no others. size() always counts correctly.",
        },
      },
      {
        id: "l08-c5",
        label: {
          es: "apacQuota nunca queda en null",
          en: "apacQuota never ends up null",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Decimal\\s+apacQuota\\s*=" },
            {
              op: "any",
              of: [
                { op: "match", pattern: "containsKey\\s*\\(\\s*'APAC'\\s*\\)" },
                { op: "match", pattern: "get\\s*\\(\\s*'APAC'\\s*\\)\\s*==\\s*null" },
              ],
            },
            { op: "match", pattern: "\\?[\\s\\S]{0,120}:" },
          ],
        },
        onFail: {
          es: "get('APAC') devuelve null sin avisar. Comprueba con containsKey() y decide el valor por defecto con el operador condicional, o la primera suma que toque esa variable reventará.",
          en: "get('APAC') returns null without warning. Check with containsKey() and pick the default with the conditional operator, or the first sum touching that variable will blow up.",
        },
        onPass: {
          es: "Comprobar la clave antes de usar el valor es el reflejo que evita la mitad de los NullPointerException de una org.",
          en: "Checking the key before using the value is the reflex that prevents half of an org's NullPointerExceptions.",
        },
      },
    ],
    rubric: [
      {
        es: "Con 200 oportunidades, ¿cuál de tus tres colecciones seguiría respondiendo igual de rápido a «¿cuál es la cuota de EMEA?»?",
        en: "With 200 opportunities, which of your three collections would still answer “what is EMEA's quota?” just as fast?",
      },
    ],
  },
};
