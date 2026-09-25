import type { Lesson } from "@/lib/types";

export const l05For: Lesson = {
  id: "m02-l05",
  slug: "for",
  n: 5,
  kind: "lesson",
  minutes: 24,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 4", en: "Remember? · Review of lesson 4" },
    prompt: { es: "En un while, ¿qué pasa si nada dentro del cuerpo cambia la condición?", en: "In a while, what happens if nothing inside the body changes the condition?" },
    options: [
      { es: "El bucle no termina nunca", en: "The loop never ends" },
      { es: "Se ejecuta una sola vez", en: "It runs only once" },
      { es: "No compila", en: "It does not compile" },
    ],
    answer: 0,
    explain: { es: "Si la condición es verdadera al entrar y nada la cambia, gira sin parar hasta chocar con un límite de la plataforma. Por eso el tope de 120 meses.", en: "If the condition is true on the way in and nothing changes it, it spins until it hits a platform limit. That is why there was a 120-month cap." },
  },
  title: { es: "For Loop y sus variantes", en: "For Loop and its variants" },
  summary: {
    es: "Recorrer una lista registro a registro: el elemento Loop de Flow, en una línea. Y el for clásico, para cuando cuentas vueltas.",
    en: "Walking a list record by record: Flow's Loop element, on one line. And the classic for, for when you are counting passes.",
  },
  analogy: {
    es: "El elemento Loop de Flow sobre una variable de colección",
    en: "Flow's Loop element over a collection variable",
  },
  objectives: [
    {
      es: "Recorrer una List, un Set o los valores de un Map con un for-each.",
      en: "Walk through a List, a Set or a Map's values with a for-each.",
    },
    {
      es: "Escribir un for clásico con sus tres partes cuando lo que cuentas son vueltas.",
      en: "Write a classic for with its three parts when what you count is passes.",
    },
    {
      es: "Aplicar los dos patrones más útiles dentro de un bucle: acumular y filtrar.",
      en: "Apply the two most useful patterns inside a loop: accumulating and filtering.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Casi todo el Apex real hace lo mismo: recibe una lista de registros y hace algo con cada uno. Un trigger recibe hasta un [[lote]]; una consulta devuelve una lista. El bucle for es la herramienta para eso, y es el que más vas a escribir.",
        en: "Almost all real Apex does the same thing: it receives a list of records and does something with each one. A trigger receives up to a [[lote|batch]]; a query returns a list. The for loop is the tool for that, and it is the one you will write most.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "En Flow, el elemento Loop me pedía dos cosas: la variable de colección que quería recorrer y una variable para el «elemento actual». Dentro del bucle trabajaba con ese elemento actual, y al terminar la colección salía por «After Last Item». El for-each de Apex pide exactamente lo mismo, en el mismo orden.",
        en: "In Flow, the Loop element asked me for two things: the collection variable I wanted to walk through and a variable for the «current item». Inside the loop I worked with that current item, and when the collection ran out I left through «After Last Item». Apex's for-each asks for exactly the same, in the same order.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "For-each: un registro cada vez", en: "For-each: one record at a time" },
    },
    {
      type: "code",
      code: {
        es: `List<Opportunity> opps = new List<Opportunity>{
    new Opportunity(Name = 'Acme', Amount = 12000),
    new Opportunity(Name = 'Globex', Amount = 45000)
};

for (Opportunity opp : opps) {
    System.debug(opp.Name + ': ' + opp.Amount);
}`,
        en: `List<Opportunity> opps = new List<Opportunity>{
    new Opportunity(Name = 'Acme', Amount = 12000),
    new Opportunity(Name = 'Globex', Amount = 45000)
};

for (Opportunity opp : opps) {
    System.debug(opp.Name + ': ' + opp.Amount);
}`,
      },
      caption: {
        es: "Léelo como «para cada Opportunity opp de opps». opp es el elemento actual; en cada vuelta apunta al siguiente registro.",
        en: "Read it as “for each Opportunity opp in opps”. opp is the current item; on each pass it points to the next record.",
      },
    },
    {
      type: "diagram",
      id: "m02-for-each",
      caption: {
        es: "Las mismas piezas que el elemento Loop de Flow: la colección, el elemento actual y lo que se hace con él.",
        en: "The same pieces as Flow's Loop element: the collection, the current item and what is done with it.",
      },
    },
    {
      type: "p",
      text: {
        es: "Tú no llevas la cuenta de nada: el bucle hace tantas [[iteracion|iteraciones]] como elementos haya, en orden, y si la lista está vacía no entra ni una vez. El tipo del elemento actual tiene que coincidir con el de la colección: para una List<Contact>, el elemento es un Contact. Y en la mayoría de org, esa lista vendrá de una consulta [[soql|SOQL]]; aquí la construimos a mano porque eso llega en el Módulo 3.",
        en: "You keep count of nothing: the loop makes as many [[iteracion|iterations]] as there are items, in order, and if the list is empty it does not go in even once. The current item's type must match the collection's: for a List<Contact>, the item is a Contact. In most orgs that list will come from a [[soql|SOQL]] query; here we build it by hand because that arrives in Module 3.",
      },
    },
    {
      type: "h",
      text: { es: "Recorrer un Set o un Map", en: "Walking a Set or a Map" },
    },
    {
      type: "p",
      text: {
        es: "Un Set se recorre igual que una List, aunque sin orden garantizado. Un Map no se recorre directamente: le pides una de sus dos caras. keySet() devuelve el Set de claves y values() la List de valores.",
        en: "A Set is walked just like a List, though with no guaranteed order. A Map is not walked directly: you ask it for one of its two sides. keySet() returns the Set of keys and values() the List of values.",
      },
    },
    {
      type: "code",
      code: {
        es: `Map<String, Decimal> quotaByRegion = new Map<String, Decimal>{
    'EMEA' => 500000,
    'APAC' => 300000
};

for (String region : quotaByRegion.keySet()) {
    System.debug(region + ' → ' + quotaByRegion.get(region));
}

Decimal totalQuota = 0;
for (Decimal quota : quotaByRegion.values()) {
    totalQuota += quota;
}`,
        en: `Map<String, Decimal> quotaByRegion = new Map<String, Decimal>{
    'EMEA' => 500000,
    'APAC' => 300000
};

for (String region : quotaByRegion.keySet()) {
    System.debug(region + ' → ' + quotaByRegion.get(region));
}

Decimal totalQuota = 0;
for (Decimal quota : quotaByRegion.values()) {
    totalQuota += quota;
}`,
      },
      caption: {
        es: "totalQuota += quota es el atajo de totalQuota = totalQuota + quota.",
        en: "totalQuota += quota is the shortcut for totalQuota = totalQuota + quota.",
      },
    },
    {
      type: "h",
      text: { es: "Los dos patrones que más vas a usar", en: "The two patterns you will use most" },
    },
    {
      type: "p",
      text: {
        es: "Acumular: declaras un total antes del bucle y le sumas algo en cada vuelta. Filtrar: declaras una lista vacía antes del bucle y le añades solo los elementos que cumplen una condición. En los dos casos la variable se declara fuera: si la declarases dentro, se reiniciaría en cada vuelta y moriría al terminar, como viste en ámbito.",
        en: "Accumulate: you declare a total before the loop and add something to it on every pass. Filter: you declare an empty list before the loop and add only the items that meet a condition. In both cases the variable is declared outside: declared inside, it would reset on every pass and die at the end, as you saw with scope.",
      },
    },
    {
      type: "code",
      code: {
        es: `Decimal openPipeline = 0;                        // acumular
List<Opportunity> bigDeals = new List<Opportunity>(); // filtrar

for (Opportunity opp : opps) {
    Decimal amount = opp.Amount ?? 0;
    openPipeline += amount;
    if (amount >= 40000) {
        bigDeals.add(opp);
    }
}`,
        en: `Decimal openPipeline = 0;                        // accumulate
List<Opportunity> bigDeals = new List<Opportunity>(); // filter

for (Opportunity opp : opps) {
    Decimal amount = opp.Amount ?? 0;
    openPipeline += amount;
    if (amount >= 40000) {
        bigDeals.add(opp);
    }
}`,
      },
      caption: {
        es: "amount sí se declara dentro: solo hace falta durante una vuelta.",
        en: "amount is declared inside: it is only needed for one pass.",
      },
    },
    {
      type: "h",
      text: { es: "El for clásico: contar vueltas", en: "The classic for: counting passes" },
    },
    {
      type: "p",
      text: {
        es: "Cuando lo que necesitas es un número que va avanzando —generar 12 cuotas mensuales, o saber en qué posición de la lista estás—, el for clásico tiene tres partes separadas por punto y coma: dónde empieza el contador, mientras qué condición sigue, y cuánto avanza tras cada vuelta.",
        en: "When what you need is a number that keeps advancing — generating 12 monthly instalments, or knowing which position of the list you are at — the classic for has three parts separated by semicolons: where the counter starts, while which condition it continues, and how much it advances after each pass.",
      },
    },
    {
      type: "code",
      code: {
        es: `for (Integer month = 1; month <= 12; month++) {
    System.debug('Cuota del mes ' + month);
}

for (Integer i = 0; i < opps.size(); i++) {
    System.debug((i + 1) + '. ' + opps[i].Name);
}`,
        en: `for (Integer month = 1; month <= 12; month++) {
    System.debug('Instalment for month ' + month);
}

for (Integer i = 0; i < opps.size(); i++) {
    System.debug((i + 1) + '. ' + opps[i].Name);
}`,
      },
      caption: {
        es: "Es un while con el contador, la condición y el avance escritos en una sola línea. Los índices de una List empiezan en 0, así que la condición es i < size(), no i <= size().",
        en: "It is a while with the counter, the condition and the step written on one line. List indexes start at 0, so the condition is i < size(), not i <= size().",
      },
    },
    {
      type: "table",
      head: [
        { es: "Necesitas…", en: "You need…" },
        { es: "Usa", en: "Use" },
      ],
      rows: [
        [
          { es: "Hacer algo con cada registro de una lista", en: "Do something with every record in a list" },
          { es: "for (Tipo x : lista)", en: "for (Type x : list)" },
        ],
        [
          { es: "Un número que avanza, o la posición", en: "A number that advances, or the position" },
          { es: "for (Integer i = 0; …; i++)", en: "for (Integer i = 0; …; i++)" },
        ],
        [
          { es: "Repetir hasta que un valor cambie", en: "Repeat until a value changes" },
          { es: "while", en: "while" },
        ],
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "No cambies la lista que estás recorriendo", en: "Do not change the list you are walking" },
      text: {
        es: "Dentro de un for-each puedes cambiar los campos del elemento actual, pero no añadir ni quitar elementos de la propia lista: Apex lanza una excepción. Si necesitas una lista distinta, créala aparte, como en el patrón de filtrar.",
        en: "Inside a for-each you may change the current item's fields, but not add or remove items from the list itself: Apex throws an exception. If you need a different list, build it separately, as in the filter pattern.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: en for (Contact c : contacts), ¿qué es contacts, qué es c y qué pasa si contacts está vacía?",
        en: "Without looking up: in for (Contact c : contacts), what is contacts, what is c, and what happens if contacts is empty?",
      },
    },
  ],

  quiz: [
    {
      id: "m02-l05-q1",
      kind: "single",
      prompt: { es: "¿Qué muestra este código?", en: "What does this code print?" },
      code: {
        es: `List<Integer> units = new List<Integer>{ 3, 5, 2 };
Integer total = 0;
for (Integer u : units) {
    total += u;
}
System.debug(total);`,
        en: `List<Integer> units = new List<Integer>{ 3, 5, 2 };
Integer total = 0;
for (Integer u : units) {
    total += u;
}
System.debug(total);`,
      },
      options: [
        { es: "10", en: "10" },
        { es: "2", en: "2" },
        { es: "3", en: "3" },
        { es: "0", en: "0" },
      ],
      answer: 0,
      explain: {
        es: "Patrón acumular: total empieza en 0 y suma 3, 5 y 2.",
        en: "Accumulate pattern: total starts at 0 and adds 3, 5 and 2.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m02-l05-q2",
      kind: "single",
      prompt: {
        es: "Este código debería sumar los importes, pero siempre muestra el último. ¿Por qué?",
        en: "This code should add up the amounts, but it always prints the last one. Why?",
      },
      code: {
        es: `for (Opportunity opp : opps) {
    Decimal total = 0;
    total += opp.Amount;
    System.debug(total);
}`,
        en: `for (Opportunity opp : opps) {
    Decimal total = 0;
    total += opp.Amount;
    System.debug(total);
}`,
      },
      options: [
        {
          es: "total se declara dentro del bucle y vuelve a 0 en cada vuelta.",
          en: "total is declared inside the loop and goes back to 0 on every pass.",
        },
        {
          es: "+= no suma: sustituye.",
          en: "+= does not add: it replaces.",
        },
        {
          es: "El for-each solo ve el último elemento.",
          en: "The for-each only sees the last item.",
        },
      ],
      answer: 0,
      explain: {
        es: "Un acumulador se declara antes del bucle. Dentro, cada vuelta crea un total nuevo a 0 que muere al cerrar la llave.",
        en: "An accumulator is declared before the loop. Inside, every pass creates a fresh total at 0 that dies when the brace closes.",
      },
      tags: ["find-error", "interleaving"],
    },
    {
      id: "m02-l05-q3",
      kind: "single",
      prompt: {
        es: "¿Qué devuelve keySet() sobre un Map<Id, Account>?",
        en: "What does keySet() return on a Map<Id, Account>?",
      },
      options: [
        { es: "Un Set<Id> con las claves", en: "A Set<Id> with the keys" },
        { es: "Una List<Account> con los valores", en: "A List<Account> with the values" },
        { es: "Una List<Id> ordenada", en: "A sorted List<Id>" },
        { es: "El número de entradas", en: "The number of entries" },
      ],
      answer: 0,
      explain: {
        es: "keySet() da las claves, y como las claves de un Map no se repiten, las da en un Set. values() da los valores en una List.",
        en: "keySet() gives the keys, and since a Map's keys never repeat, it gives them in a Set. values() gives the values in a List.",
      },
      tags: ["recall", "spaced"],
      from: { es: "Repaso · M1 L8", en: "Review · M1 L8" },
    },
    {
      id: "m02-l05-q4",
      kind: "single",
      prompt: {
        es: "¿Cuántas veces se ejecuta el cuerpo de este bucle?",
        en: "How many times does this loop's body run?",
      },
      code: {
        es: `for (Integer i = 0; i < 5; i++) {
    System.debug(i);
}`,
        en: `for (Integer i = 0; i < 5; i++) {
    System.debug(i);
}`,
      },
      options: [
        { es: "5 (de 0 a 4)", en: "5 (from 0 to 4)" },
        { es: "6 (de 0 a 5)", en: "6 (from 0 to 5)" },
        { es: "4 (de 1 a 4)", en: "4 (from 1 to 4)" },
      ],
      answer: 0,
      explain: {
        es: "Empieza en 0 y sigue mientras i < 5: 0, 1, 2, 3 y 4. Cinco vueltas.",
        en: "It starts at 0 and continues while i < 5: 0, 1, 2, 3 and 4. Five passes.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m02-l05-q5",
      kind: "text",
      prompt: {
        es: "Completa para recorrer los valores de un Map llamado accountsById: for (Account a : accountsById.______())",
        en: "Complete to walk the values of a Map named accountsById: for (Account a : accountsById.______())",
      },
      accept: ["values"],
      placeholder: { es: "nombre del método", en: "method name" },
      explain: {
        es: "values(). Para las claves sería keySet().",
        en: "values(). For the keys it would be keySet().",
      },
      tags: ["recall"],
    },
    {
      id: "m02-l05-q6",
      kind: "single",
      prompt: {
        es: "Una oportunidad de la lista tiene Amount vacío. ¿Qué pasa con este bucle?",
        en: "One opportunity in the list has an empty Amount. What happens with this loop?",
      },
      code: {
        es: `Decimal total = 0;
for (Opportunity opp : opps) {
    total += opp.Amount;
}`,
        en: `Decimal total = 0;
for (Opportunity opp : opps) {
    total += opp.Amount;
}`,
      },
      options: [
        {
          es: "Lanza una excepción al sumar null.",
          en: "It throws an exception when adding null.",
        },
        {
          es: "Se salta la oportunidad vacía.",
          en: "It skips the empty opportunity.",
        },
        {
          es: "Suma 0 por esa oportunidad.",
          en: "It adds 0 for that opportunity.",
        },
      ],
      answer: 0,
      explain: {
        es: "Sumar null a un Decimal lanza NullPointerException. En bucles sobre registros reales, protégete siempre: total += opp.Amount ?? 0;",
        en: "Adding null to a Decimal throws a NullPointerException. In loops over real records, always protect yourself: total += opp.Amount ?? 0;",
      },
      tags: ["spaced", "interleaving"],
      from: { es: "Repaso · M1 L6", en: "Review · M1 L6" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 5 DE 8 · Ya no es una oportunidad: es la lista entera del pipeline, y hay que recorrerla. Para la reunión de pipeline del lunes, Dirección quiere tres datos de las oportunidades abiertas: el importe total, cuántas son de 50.000 o más, y la lista con los nombres de esas grandes. Una de las oportunidades aún no tiene importe.",
      en: "TASK 5 OF 8 · It is no longer one opportunity: it is the whole pipeline list, and it has to be walked. For Monday's pipeline meeting, management wants three figures from the open opportunities: the total amount, how many are worth 50,000 or more, and the list of names of those big ones. One of the opportunities has no amount yet.",
    },
    brief: [
      {
        es: "Parte de la lista opps del código de partida y recórrela con un for-each.",
        en: "Start from the opps list in the starter code and walk it with a for-each.",
      },
      {
        es: "totalAmount (Decimal): la suma de los importes. Un importe vacío cuenta como 0.",
        en: "totalAmount (Decimal): the sum of the amounts. An empty amount counts as 0.",
      },
      {
        es: "bigDealCount (Integer): cuántas tienen un importe de 50.000 o más.",
        en: "bigDealCount (Integer): how many have an amount of 50,000 or more.",
      },
      {
        es: "bigDealNames (List<String>): los nombres de esas oportunidades grandes.",
        en: "bigDealNames (List<String>): the names of those big opportunities.",
      },
      {
        es: "Las tres variables tienen que poder leerse después del bucle.",
        en: "All three variables must be readable after the loop.",
      },
    ],
    starter: {
      es: `// CASO: las reglas de negocio de la cuenta clave · Northwind Trading
// Tarea 5 de 8: recorrer el pipeline del lunes y resumirlo.

List<Opportunity> opps = new List<Opportunity>{
    new Opportunity(Name = 'Acme · Renovación', Amount = 72000),
    new Opportunity(Name = 'Globex · Piloto', Amount = 18000),
    new Opportunity(Name = 'Initech · Ampliación', Amount = 50000),
    new Opportunity(Name = 'Umbrella · Nuevo'),
    new Opportunity(Name = 'Hooli · Soporte', Amount = 9500)
};

// Calcula totalAmount, bigDealCount y bigDealNames.
`,
      en: `// CASE: the key account's business rules · Northwind Trading
// Task 5 of 8: walk Monday's pipeline and summarise it.

List<Opportunity> opps = new List<Opportunity>{
    new Opportunity(Name = 'Acme · Renewal', Amount = 72000),
    new Opportunity(Name = 'Globex · Pilot', Amount = 18000),
    new Opportunity(Name = 'Initech · Expansion', Amount = 50000),
    new Opportunity(Name = 'Umbrella · New'),
    new Opportunity(Name = 'Hooli · Support', Amount = 9500)
};

// Work out totalAmount, bigDealCount and bigDealNames.
`,
    },
    hints: [
      {
        es: "Yo lo pensaría como un Loop de Flow con tres variables de resultado: tres resultados, un solo bucle. Los tres se declaran antes del for; dentro del for solo se actualizan. Y una de las oportunidades hará fallar cualquier suma que no se proteja.",
        en: "I would think of it as a Flow Loop with three result variables: three results, one single loop. All three are declared before the for; inside the for they are only updated. And one of the opportunities will break any sum that is not protected.",
      },
      {
        es: "Lo que me ayudó: totalAmount es acumular, como un Assignment con «Add»; bigDealNames es filtrar con .add(); bigDealCount es un contador que sube dentro del mismo if. opp.Amount ?? 0 resuelve el vacío.",
        en: "What helped me: totalAmount is accumulating, like an Assignment with «Add»; bigDealNames is filtering with .add(); bigDealCount is a counter that goes up inside the same if. opp.Amount ?? 0 deals with the empty value.",
      },
      {
        es: "Te dejo el esquema: declarar los tres; para cada opp { Decimal amount = opp.Amount ?? 0; totalAmount += amount; si amount ≥ 50000 { bigDealCount++; bigDealNames.add(opp.Name); } }",
        en: "Here is the outline: declare all three; for each opp { Decimal amount = opp.Amount ?? 0; totalAmount += amount; if amount ≥ 50000 { bigDealCount++; bigDealNames.add(opp.Name); } }",
      },
    ],
    solution: {
      es: `List<Opportunity> opps = new List<Opportunity>{
    new Opportunity(Name = 'Acme · Renovación', Amount = 72000),
    new Opportunity(Name = 'Globex · Piloto', Amount = 18000),
    new Opportunity(Name = 'Initech · Ampliación', Amount = 50000),
    new Opportunity(Name = 'Umbrella · Nuevo'),
    new Opportunity(Name = 'Hooli · Soporte', Amount = 9500)
};

Decimal totalAmount = 0;
Integer bigDealCount = 0;
List<String> bigDealNames = new List<String>();

for (Opportunity opp : opps) {
    Decimal amount = opp.Amount ?? 0;
    totalAmount += amount;
    if (amount >= 50000) {
        bigDealCount++;
        bigDealNames.add(opp.Name);
    }
}
System.debug(totalAmount + ' · ' + bigDealCount + ' · ' + bigDealNames);`,
      en: `List<Opportunity> opps = new List<Opportunity>{
    new Opportunity(Name = 'Acme · Renewal', Amount = 72000),
    new Opportunity(Name = 'Globex · Pilot', Amount = 18000),
    new Opportunity(Name = 'Initech · Expansion', Amount = 50000),
    new Opportunity(Name = 'Umbrella · New'),
    new Opportunity(Name = 'Hooli · Support', Amount = 9500)
};

Decimal totalAmount = 0;
Integer bigDealCount = 0;
List<String> bigDealNames = new List<String>();

for (Opportunity opp : opps) {
    Decimal amount = opp.Amount ?? 0;
    totalAmount += amount;
    if (amount >= 50000) {
        bigDealCount++;
        bigDealNames.add(opp.Name);
    }
}
System.debug(totalAmount + ' · ' + bigDealCount + ' · ' + bigDealNames);`,
    },
    checks: [
      {
        id: "m02-l05-c1",
        label: {
          es: "Recorre opps con un for-each",
          en: "Walks opps with a for-each",
        },
        rule: { op: "match", pattern: "for\\s*\\(\\s*Opportunity\\s+\\w+\\s*:\\s*opps\\s*\\)" },
        onFail: {
          es: "La forma es for (Opportunity opp : opps) { … }: el tipo del elemento, un nombre, dos puntos y la lista.",
          en: "The shape is for (Opportunity opp : opps) { … }: the item's type, a name, a colon and the list.",
        },
        otter: {
          es: "El for-each es tu Loop de Flow: for (Opportunity opp : opps) { … }. El tipo del elemento actual, un nombre para él, dos puntos y la colección.",
          en: "The for-each is your Flow Loop: for (Opportunity opp : opps) { … }. The current item's type, a name for it, a colon and the collection.",
        },
      },
      {
        id: "m02-l05-c2",
        label: {
          es: "Los tres resultados se declaran antes del bucle y con su tipo",
          en: "All three results are declared before the loop, with their types",
        },
        rule: {
          op: "match",
          pattern:
            "(?=[\\s\\S]*Decimal\\s+totalAmount\\s*=\\s*0[\\s\\S]*for\\s*\\()(?=[\\s\\S]*Integer\\s+bigDealCount\\s*=\\s*0[\\s\\S]*for\\s*\\()(?=[\\s\\S]*List<String>\\s+bigDealNames\\s*=\\s*new\\s+List<String>\\s*\\(\\s*\\)[\\s\\S]*for\\s*\\()",
        },
        onFail: {
          es: "Decimal totalAmount = 0; Integer bigDealCount = 0; List<String> bigDealNames = new List<String>(); — antes del for. Dentro se reiniciarían en cada vuelta.",
          en: "Decimal totalAmount = 0; Integer bigDealCount = 0; List<String> bigDealNames = new List<String>(); — before the for. Inside, they would reset on every pass.",
        },
        otter: {
          es: "Los tres resultados son como las variables que creas en Flow antes del Loop: se declaran antes del for y con su tipo. Decimal totalAmount = 0; Integer bigDealCount = 0; List<String> bigDealNames = new List<String>(); Dentro del bucle se reiniciarían en cada vuelta.",
          en: "The three results are like the variables you create in Flow before the Loop: declared before the for and with their type. Decimal totalAmount = 0; Integer bigDealCount = 0; List<String> bigDealNames = new List<String>(); Inside the loop they would reset on every pass.",
        },
      },
      {
        id: "m02-l05-c3",
        label: {
          es: "La suma protege el importe vacío",
          en: "The sum protects against the empty amount",
        },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "\\.Amount\\s*\\?\\?\\s*0" },
            { op: "match", pattern: "\\.Amount\\s*!=\\s*null" },
            { op: "match", pattern: "\\.Amount\\s*==\\s*null" },
          ],
        },
        onFail: {
          es: "La oportunidad de Umbrella no tiene importe: sumarla tal cual lanza una excepción. opp.Amount ?? 0 la convierte en 0.",
          en: "The Umbrella opportunity has no amount: adding it as-is throws an exception. opp.Amount ?? 0 turns it into 0.",
        },
        otter: {
          es: "Umbrella no tiene importe, y sumarlo tal cual lanza una excepción. Es tu BLANKVALUE(Amount, 0): opp.Amount ?? 0.",
          en: "Umbrella has no amount, and adding it as it is throws an exception. It is your BLANKVALUE(Amount, 0): opp.Amount ?? 0.",
        },
      },
      {
        id: "m02-l05-c4",
        label: {
          es: "totalAmount acumula en cada vuelta",
          en: "totalAmount accumulates on every pass",
        },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "totalAmount\\s*\\+=" },
            { op: "match", pattern: "totalAmount\\s*=\\s*totalAmount\\s*\\+" },
          ],
        },
        onFail: {
          es: "Acumular es sumar al total que ya había: totalAmount += amount;",
          en: "Accumulating means adding to the total so far: totalAmount += amount;",
        },
        otter: {
          es: "Acumular es sumar al total que ya había, como un Assignment con «Add» dentro del Loop: totalAmount += amount;",
          en: "Accumulating is adding to the total you already had, like an Assignment with «Add» inside the Loop: totalAmount += amount;",
        },
      },
      {
        id: "m02-l05-c5",
        label: {
          es: "Las grandes se cuentan y sus nombres se añaden a la lista",
          en: "Big ones are counted and their names added to the list",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: ">=\\s*50000" },
            {
              op: "any",
              of: [
                { op: "match", pattern: "bigDealCount\\s*\\+\\+" },
                { op: "match", pattern: "bigDealCount\\s*\\+=\\s*1" },
                { op: "match", pattern: "bigDealCount\\s*=\\s*bigDealCount\\s*\\+\\s*1" },
              ],
            },
            { op: "match", pattern: "bigDealNames\\.add\\(\\s*\\w+\\.Name\\s*\\)" },
          ],
        },
        onFail: {
          es: "Dentro de un if con importe >= 50000, sube el contador con bigDealCount++ y añade el nombre con bigDealNames.add(opp.Name).",
          en: "Inside an if with amount >= 50000, bump the counter with bigDealCount++ and add the name with bigDealNames.add(opp.Name).",
        },
        otter: {
          es: "Dentro del bucle, un if con importe >= 50000 es tu Decision: si se cumple, sube el contador (bigDealCount++) y añade el nombre a la colección (bigDealNames.add(opp.Name)).",
          en: "Inside the loop, an if with amount >= 50000 is your Decision: if it is met, the counter goes up (bigDealCount++) and the name is added to the collection (bigDealNames.add(opp.Name)).",
        },
        onPass: {
          es: "Un solo recorrido para tres resultados: con 200 registros, eso es la diferencia entre 200 vueltas y 600.",
          en: "One pass for three results: with 200 records, that is the difference between 200 iterations and 600.",
        },
      },
    ],
    rubric: [
      {
        es: "Si mañana piden también el importe medio, ¿qué añadirías y dónde?",
        en: "If tomorrow they also ask for the average amount, what would you add and where?",
      },
    ],
    outro: {
      es: "Ya recorres una colección con for-each y sabes acumular, contar y filtrar en una sola pasada. En la tarea 6, el mismo recorrido sobre la cola de casos de Soporte… pero parando en cuanto aparezca lo urgente.",
      en: "You can now walk a collection with for-each and accumulate, count and filter in a single pass. In task 6, the same walk over Support's case queue… but stopping as soon as something urgent shows up.",
    },
    voice: "otter",
  },
};
