import type { Lesson } from "@/lib/types";

export const l02NumerosBoolean: Lesson = {
  id: "m01-l02",
  slug: "numeros-y-boolean",
  n: 2,
  kind: "lesson",
  minutes: 22,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 1", en: "Remember? · Review of lesson 1" },
    prompt: { es: "¿Qué hace la palabra final delante de una variable?", en: "What does the word final do in front of a variable?" },
    options: [
      { es: "La hace obligatoria", en: "Makes it required" },
      { es: "La borra al terminar la transacción", en: "Deletes it when the transaction ends" },
      { es: "Impide cambiarle el valor después", en: "Stops its value being changed afterwards" },
    ],
    answer: 2,
    explain: { es: "final es tu campo de solo lectura: recibe un valor una vez y nadie lo cambia. Como el MAX_DISCOUNT de la tarea 1.", en: "final is your read-only field: it gets a value once and nobody changes it. Like MAX_DISCOUNT in task 1." },
  },
  title: {
    es: "Tipos Numéricos y Boolean",
    en: "Numeric Types and Boolean",
  },
  summary: {
    es: "Integer, Long, Decimal, Double, Boolean — más Id y Blob, los dos tipos que solo existen porque esto es Salesforce.",
    en: "Integer, Long, Decimal, Double, Boolean — plus Id and Blob, the two types that exist only because this is Salesforce.",
  },
  analogy: {
    es: "Elegir entre Number, Currency, Percent y Checkbox",
    en: "Choosing between Number, Currency, Percent and Checkbox",
  },
  objectives: [
    {
      es: "Elegir entre Integer, Long, Decimal y Double a partir del dato, no por costumbre.",
      en: "Choose between Integer, Long, Decimal and Double from the data, not from habit.",
    },
    {
      es: "Entender por qué una división entre enteros pierde los decimales.",
      en: "Understand why dividing two integers loses the decimals.",
    },
    {
      es: "Reconocer Id y Blob y saber para qué sirve cada uno.",
      en: "Recognise Id and Blob and know what each is for.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "En el asistente de campos nuevos, «Number», «Currency» y «Percent» parecen casi lo mismo, pero tú ya sabes que no lo son: uno cuenta unidades, otro dinero, otro proporciones. Apex hace la misma distinción, solo que te obliga a declararla en voz alta.",
        en: "In the new-field wizard, “Number”, “Currency” and “Percent” look almost identical, but you already know they are not: one counts units, one counts money, one counts proportions. Apex draws the same distinction — it just makes you say it out loud.",
      },
    },
    {
      type: "diagram",
      id: "m01-number-types",
      caption: {
        es: "La pregunta no es «¿es un número?», sino «¿qué clase de número y para qué?».",
        en: "The question is not “is it a number?” but “what kind of number, and what for?”.",
      },
    },
    {
      type: "h",
      text: { es: "Integer y Long: contar cosas", en: "Integer and Long: counting things" },
    },
    {
      type: "p",
      text: {
        es: "Integer guarda números enteros entre unos -2.100 millones y +2.100 millones. Sirve para todo lo que se cuenta en unidades: contactos, días, intentos, posiciones. Cuando ese rango se queda corto —milisegundos desde 1970, identificadores de un sistema externo— se usa Long, que se escribe con una L al final.",
        en: "Integer holds whole numbers between roughly -2.1 billion and +2.1 billion. It covers everything counted in units: contacts, days, attempts, positions. When that range is not enough — milliseconds since 1970, identifiers from an external system — you use Long, written with a trailing L.",
      },
    },
    {
      type: "code",
      code: {
        es: `Integer daysOpen = 47;
Long externalRecordId = 9000000000L;   // la L es obligatoria`,
        en: `Integer daysOpen = 47;
Long externalRecordId = 9000000000L;   // the L is mandatory`,
      },
    },
    {
      type: "h",
      text: { es: "Decimal: el tipo del dinero", en: "Decimal: the money type" },
    },
    {
      type: "p",
      text: {
        es: "Decimal guarda decimales de forma exacta, cifra a cifra. Es el tipo que Salesforce te devuelve cuando lees un campo Currency, y es el único en el que deberías pensar cuando hay importes de por medio. Double también guarda decimales, pero de forma aproximada, en [[binario]]: perfecto para cálculos científicos y pésimo para facturas.",
        en: "Decimal stores decimals exactly, digit by digit. It is the type Salesforce hands you when you read a Currency field, and the only one you should consider when money is involved. Double also stores decimals, but approximately, in [[binario|binary]]: perfect for scientific maths and terrible for invoices.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: {
        es: "Por qué Double y el dinero no se llevan bien",
        en: "Why Double and money do not get along",
      },
      text: {
        es: "Un Double guarda 0,1 como «lo más cerca de 0,1 que se puede llegar en binario». Sumando muchos de esos «casi» acabas con un total que se desvía un céntimo, y ese céntimo aparece en un informe que alguien firma. Decimal no tiene ese problema porque guarda el número tal cual lo escribiste.",
        en: "A Double stores 0.1 as “the closest thing to 0.1 binary can reach”. Add enough of those near-misses and the total drifts by a cent — and that cent shows up in a report someone signs. Decimal has no such problem, because it stores the number exactly as you wrote it.",
      },
    },
    {
      type: "code",
      code: {
        es: `Decimal unitPrice = 19.99;
Decimal taxRate = 0.21;
Decimal total = unitPrice * 3;    // 59.97, exacto

Double temperature = 36.6;        // medición, no dinero`,
        en: `Decimal unitPrice = 19.99;
Decimal taxRate = 0.21;
Decimal total = unitPrice * 3;    // 59.97, exact

Double temperature = 36.6;        // a measurement, not money`,
      },
    },
    {
      type: "h",
      text: {
        es: "La trampa de la división entre enteros",
        en: "The integer division trap",
      },
    },
    {
      type: "p",
      text: {
        es: "Cuando divides dos Integer, Apex responde con un Integer: se queda con la parte entera y tira los decimales sin avisar. No redondea, corta. Es el error número uno de quien viene de fórmulas, donde 7/2 siempre da 3,5.",
        en: "When you divide two Integers, Apex answers with an Integer: it keeps the whole part and throws the decimals away without warning. It does not round, it truncates. This is the number-one gotcha for anyone coming from formulas, where 7/2 always gives 3.5.",
      },
    },
    {
      type: "code",
      code: {
        es: `Integer won = 7;
Integer total = 2;

Decimal ratioA = won / total;                   // 3   ← ya se perdió antes de guardar
Decimal ratioB = Decimal.valueOf(won) / total;  // 3.5 ← uno de los dos es Decimal`,
        en: `Integer won = 7;
Integer total = 2;

Decimal ratioA = won / total;                   // 3   ← lost before it was ever stored
Decimal ratioB = Decimal.valueOf(won) / total;  // 3.5 ← one of the two is a Decimal`,
      },
      caption: {
        es: "Declarar el resultado como Decimal no salva nada: la división ya ocurrió entre enteros. Convertir uno de los dos antes de dividir tiene nombre —conversión de tipos— y es la sub-lección 9; por ahora quédate con el síntoma.",
        en: "Declaring the result as a Decimal saves nothing: the division already happened between integers. Converting one operand before dividing has a name — type conversion — and it is sub-lesson 9; for now, just note the symptom.",
      },
    },
    {
      type: "h",
      text: { es: "Boolean: el checkbox, con un matiz", en: "Boolean: the checkbox, with a twist" },
    },
    {
      type: "p",
      text: {
        es: "Boolean guarda true o false, igual que un checkbox. El matiz es que un Boolean declarado y no asignado no vale false: vale [[null]], que es un tercer estado —«no se sabe»— del que hablaremos en detalle más adelante. Un checkbox en la base de datos nunca está vacío; una variable Boolean en memoria sí puede estarlo.",
        en: "Boolean holds true or false, like a checkbox. The twist is that a Boolean that was declared but never assigned is not false: it is [[null]], a third state meaning “unknown”, which gets its own sub-lesson later. A checkbox in the database is never empty; a Boolean variable in memory can be.",
      },
    },
    {
      type: "code",
      code: {
        es: `Boolean isRenewal = true;
Boolean hasDiscount;        // null, no false`,
        en: `Boolean isRenewal = true;
Boolean hasDiscount;        // null, not false`,
      },
    },
    {
      type: "h",
      text: { es: "Id: el tipo que solo existe aquí", en: "Id: the type that only exists here" },
    },
    {
      type: "p",
      text: {
        es: "Id guarda el identificador de un registro: esa cadena de 15 o 18 caracteres que ves en la URL cuando abres una cuenta. Podrías guardarlo en un String y funcionaría, pero al declararlo como Id la plataforma valida el formato por ti y rechaza una cadena inventada en el momento de asignarla.",
        en: "Id holds a record identifier: that 15- or 18-character string you see in the URL when you open an account. You could keep it in a String and it would work, but declaring it as an Id makes the platform validate the format for you and reject a made-up string the moment you assign it.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Longitud", en: "Length" },
        { es: "Dónde aparece", en: "Where you see it" },
        { es: "Detalle", en: "Detail" },
      ],
      rows: [
        [
          { es: "15 caracteres", en: "15 characters" },
          { es: "URLs, informes exportados", en: "URLs, exported reports" },
          {
            es: "Distingue mayúsculas de minúsculas.",
            en: "Case-sensitive.",
          },
        ],
        [
          { es: "18 caracteres", en: "18 characters" },
          { es: "API, Apex, integraciones", en: "API, Apex, integrations" },
          {
            es: "Los 3 últimos son un sufijo de control; no distingue mayúsculas.",
            en: "The last 3 are a checksum suffix; not case-sensitive.",
          },
        ],
      ],
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Lo mismo que ya te pasó en un VLOOKUP", en: "The same thing that bit you in a VLOOKUP" },
      text: {
        es: "A mí me pasó: crucé dos exportaciones de Salesforce en Excel con un VLOOKUP y no me cuadraban las filas. Estaba comparando un Id de 15 caracteres con uno de 18. En Apex esto se nota menos porque la plataforma te devuelve siempre 18, pero el día que recibas Ids de un sistema externo, esa diferencia volverá.",
        en: "It happened to me: I matched two Salesforce exports in Excel with a VLOOKUP and the rows would not line up. I was comparing a 15-character Id with an 18-character one. In Apex you notice it less because the platform always hands you 18, but the day you receive Ids from an external system, that difference will be back.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "Blob: el archivo en bruto", en: "Blob: the raw file" },
    },
    {
      type: "p",
      text: {
        es: "Blob guarda datos binarios: el contenido real de un PDF, una imagen o un adjunto. No se lee ni se manipula directamente; se convierte. Blob.valueOf() pasa de texto a Blob, y toString() hace el camino de vuelta. Es el tipo que aparece cuando trabajas con ContentVersion o cuando firmas una petición a un sistema externo.",
        en: "Blob holds binary data: the actual content of a PDF, an image or an attachment. You do not read or edit it directly; you convert it. Blob.valueOf() goes from text to Blob, and toString() comes back. It is the type that shows up when you work with ContentVersion, or when you sign a request to an external system.",
      },
    },
    {
      type: "code",
      code: {
        es: `Blob fileBody = Blob.valueOf('Resumen trimestral');
String readable = fileBody.toString();`,
        en: `Blob fileBody = Blob.valueOf('Quarterly summary');
String readable = fileBody.toString();`,
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿qué tipo elegirías para el importe de una factura, y qué le pasa a 7/2 si ambos son Integer?",
        en: "Without looking up: which type would you pick for an invoice amount, and what happens to 7/2 when both are Integers?",
      },
    },
  ],

  quiz: [
    {
      id: "m01-l02-q1",
      kind: "single",
      prompt: {
        es: "Un campo Currency de Salesforce, leído desde Apex, llega como…",
        en: "A Salesforce Currency field, read from Apex, arrives as…",
      },
      options: [
        { es: "Decimal", en: "Decimal" },
        { es: "Double", en: "Double" },
        { es: "Integer", en: "Integer" },
        { es: "String", en: "String" },
      ],
      answer: 0,
      explain: {
        es: "Decimal: exacto, sin la deriva binaria de Double. Es el tipo que debes usar siempre que haya importes.",
        en: "Decimal: exact, with none of Double's binary drift. It is the type to use whenever money is involved.",
      },
    },
    {
      id: "m01-l02-q2",
      kind: "single",
      prompt: { es: "¿Qué imprime este código?", en: "What does this code print?" },
      code: {
        es: `Integer closedWon = 9;
Integer totalOpps = 4;
Decimal winRate = closedWon / totalOpps;
System.debug(winRate);`,
        en: `Integer closedWon = 9;
Integer totalOpps = 4;
Decimal winRate = closedWon / totalOpps;
System.debug(winRate);`,
      },
      options: [
        { es: "2", en: "2" },
        { es: "2.25", en: "2.25" },
        { es: "2.3", en: "2.3" },
        { es: "No compila.", en: "It does not compile." },
      ],
      answer: 0,
      explain: {
        es: "Los dos operandos son Integer, así que la división ocurre entre enteros y se queda en 2 antes de guardarse. Declarar winRate como Decimal llega tarde: para arreglarlo hay que convertir uno de los dos antes de dividir.",
        en: "Both operands are Integers, so the division happens between whole numbers and lands on 2 before anything is stored. Declaring winRate as a Decimal comes too late: to fix it you convert one operand before dividing.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m01-l02-q3",
      kind: "single",
      prompt: {
        es: "¿Cuál es el valor de hasRenewal justo después de esta línea?",
        en: "What is hasRenewal's value right after this line?",
      },
      code: { es: `Boolean hasRenewal;`, en: `Boolean hasRenewal;` },
      options: [
        { es: "null", en: "null" },
        { es: "false", en: "false" },
        { es: "true", en: "true" },
        { es: "Da error de compilación.", en: "It is a compile error." },
      ],
      answer: 0,
      explain: {
        es: "Una variable declarada y no asignada vale null. Un Boolean en Apex tiene tres estados posibles, no dos, y esa diferencia con el checkbox de la base de datos causa errores reales.",
        en: "A declared-but-unassigned variable is null. A Boolean in Apex has three possible states, not two, and that difference from the database checkbox causes real bugs.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m01-l02-q4",
      kind: "multi",
      prompt: {
        es: "Ventas te describe cuatro datos. ¿Cuáles pedirían un Decimal?",
        en: "Sales describes four values. Which ones call for a Decimal?",
      },
      options: [
        {
          es: "El importe anual del contrato.",
          en: "The annual contract amount.",
        },
        {
          es: "El número de contactos asociados.",
          en: "The number of related contacts.",
        },
        {
          es: "El porcentaje de descuento aplicado.",
          en: "The applied discount percentage.",
        },
        {
          es: "Si el cliente aceptó los términos.",
          en: "Whether the client accepted the terms.",
        },
      ],
      answers: [0, 2],
      explain: {
        es: "Importes y porcentajes tienen decimales y exigen exactitud. Contar contactos es Integer, y una aceptación es Boolean.",
        en: "Amounts and percentages have decimals and demand exactness. Counting contacts is an Integer, and an acceptance is a Boolean.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m01-l02-q5",
      kind: "single",
      prompt: {
        es: "¿Qué tiene de malo esta declaración?",
        en: "What is wrong with this declaration?",
      },
      code: {
        es: `Long millisecondsSinceEpoch = 1700000000000;`,
        en: `Long millisecondsSinceEpoch = 1700000000000;`,
      },
      options: [
        {
          es: "Falta la L al final del número: sin ella el literal se interpreta como Integer y no cabe.",
          en: "The trailing L is missing: without it the literal is read as an Integer and does not fit.",
        },
        {
          es: "Nada, es correcta.",
          en: "Nothing, it is correct.",
        },
        {
          es: "Long no admite valores tan grandes.",
          en: "Long does not accept numbers that large.",
        },
        {
          es: "El nombre no sigue camelCase.",
          en: "The name does not follow camelCase.",
        },
      ],
      answer: 0,
      explain: {
        es: "El tipo de la variable es Long, pero el número escrito a la derecha se lee como Integer y se desborda. La L le dice a Apex que ese [[literal]] ya es un Long.",
        en: "The variable's type is Long, but the number written on the right is read as an Integer and overflows. The L tells Apex that [[literal]] is already a Long.",
      },
      tags: ["find-error"],
    },
    {
      id: "m01-l02-q6",
      kind: "text",
      prompt: {
        es: "¿Qué tipo de Apex usarías para guardar el contenido binario de un PDF adjunto?",
        en: "Which Apex type would you use to hold the binary content of an attached PDF?",
      },
      accept: ["blob"],
      placeholder: { es: "un tipo", en: "one type" },
      explain: {
        es: "Blob. No se lee directamente: se convierte con Blob.valueOf() y toString().",
        en: "Blob. You do not read it directly: you convert with Blob.valueOf() and toString().",
      },
      tags: ["recall"],
    },
    {
      id: "m01-l02-q7",
      kind: "single",
      prompt: {
        es: "Repaso: ¿qué palabra clave impide que una variable se reasigne?",
        en: "Review: which keyword stops a variable from being reassigned?",
      },
      options: [
        { es: "final", en: "final" },
        { es: "static", en: "static" },
        { es: "const", en: "const" },
        { es: "readonly", en: "readonly" },
      ],
      answer: 0,
      explain: {
        es: "final. const y readonly no existen en Apex, y static es otra cosa distinta que verás en el módulo de clases.",
        en: "final. const and readonly do not exist in Apex, and static is a different thing you will meet in the classes module.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M1 L1", en: "Review · M1 L1" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 2 DE 10 · Ayer apuntaste quién es el cliente. Hoy llegan los números del contrato de renovación de Northwind, y aquí el tipo ya no es cosmético: uno mal elegido se come los céntimos o pierde el identificador del registro. Te dan la descripción de cada dato, no el tipo: elígelo tú y calcula el importe con IVA.",
      en: "TASK 2 OF 10 · Yesterday you wrote down who the customer is. Today the numbers of Northwind's renewal contract arrive, and here the type is no longer cosmetic: a wrong one eats the cents or loses the record identifier. You get a description of each value, not its type: choose it yourself and compute the amount with tax.",
    },
    brief: [
      {
        es: "contractAmount: el importe firmado del contrato, 24500.75. Es dinero.",
        en: "contractAmount: the signed contract amount, 24500.75. This is money.",
      },
      {
        es: "employeeCount: cuántos empleados tiene la cuenta, 340.",
        en: "employeeCount: how many employees the account has, 340.",
      },
      {
        es: "isKeyAccount: si la cuenta es estratégica. Sí lo es.",
        en: "isKeyAccount: whether the account is strategic. It is.",
      },
      {
        es: "accountRecordId: el identificador del registro de la cuenta, '0015g00000AbCdEfGHI'. Usa el tipo que valida el formato.",
        en: "accountRecordId: the account record identifier, '0015g00000AbCdEfGHI'. Use the type that validates the format.",
      },
      {
        es: "amountWithTax: el importe anterior multiplicado por 1.21. Calcúlalo a partir de contractAmount, no escribas el resultado a mano.",
        en: "amountWithTax: the previous amount multiplied by 1.21. Compute it from contractAmount — do not type the result by hand.",
      },
    ],
    starter: {
      es: `// CASO: campaña de renovaciones · cliente Northwind Trading
// Ya resuelto en la tarea 1:
String accountName = 'Northwind Trading';
final Integer MAX_DISCOUNT = 15;

// Tarea 2 de 10: los números del contrato. Cinco variables más.
// El tipo lo decides tú a partir de la descripción.

`,
      en: `// CASE: renewals campaign · customer Northwind Trading
// Already solved in task 1:
String accountName = 'Northwind Trading';
final Integer MAX_DISCOUNT = 15;

// Task 2 of 10: the contract's numbers. Five more variables.
// You decide each type from the description.

`,
    },
    hints: [
      {
        es: "Yo miraría una por una las variables numéricas, como revisas los campos de moneda de un objeto: ¿alguna guarda un importe en un tipo que redondea o aproxima?",
        en: "I would look at the numeric variables one by one, the way you review an object's currency fields: is any of them holding an amount in a type that rounds or approximates?",
      },
      {
        es: "Lo que me salvó a mí: el dinero va siempre en Decimal, nunca en Double ni en Integer, igual que en Setup elegirías un campo Currency para dinero. Y el identificador de un registro tiene su propio tipo en Apex, que valida el formato al asignarlo.",
        en: "What saved me: money always goes in Decimal, never in Double or Integer, just as in Setup you would pick a Currency field for money. And a record identifier has its own type in Apex, which checks the format when you assign it.",
      },
      {
        es: "Te dejo la última casi hecha: Decimal amountWithTax = contractAmount * 1.21;",
        en: "Here is the last one nearly done: Decimal amountWithTax = contractAmount * 1.21;",
      },
    ],
    solution: {
      es: `Decimal contractAmount = 24500.75;
Integer employeeCount = 340;
Boolean isKeyAccount = true;
Id accountRecordId = '0015g00000AbCdEfGHI';
Decimal amountWithTax = contractAmount * 1.21;`,
      en: `Decimal contractAmount = 24500.75;
Integer employeeCount = 340;
Boolean isKeyAccount = true;
Id accountRecordId = '0015g00000AbCdEfGHI';
Decimal amountWithTax = contractAmount * 1.21;`,
    },
    checks: [
      {
        id: "l02-c1",
        label: {
          es: "contractAmount es Decimal (no Double ni Integer)",
          en: "contractAmount is a Decimal (not Double or Integer)",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Decimal\\s+contractAmount\\s*=\\s*24500\\.75\\s*;" },
            { op: "absent", pattern: "(Double|Integer)\\s+contractAmount" },
          ],
        },
        onFail: {
          es: "Un importe firmado es dinero, y el dinero va en Decimal: es el único tipo decimal que guarda la cifra tal cual, sin desviarse un céntimo al acumular.",
          en: "A signed amount is money, and money goes in a Decimal: the only decimal type that stores the figure exactly, without drifting a cent as it accumulates.",
        },
        otter: {
          es: "contractAmount es dinero, como un campo Currency. En Apex el dinero va en Decimal: Double aproxima y puede desviarse un céntimo al acumular, e Integer se come los decimales directamente.",
          en: "contractAmount is money, like a Currency field. In Apex money goes in Decimal: Double approximates and can drift by a cent as it adds up, and Integer simply swallows the decimals.",
        },
        onPass: {
          es: "Decimal para el dinero. Suena obvio hasta que ves un informe cuadrado al céntimo gracias a esa decisión.",
          en: "Decimal for money. It sounds obvious until you see a report balance to the cent because of that one decision.",
        },
      },
      {
        id: "l02-c2",
        label: { es: "employeeCount es Integer y vale 340", en: "employeeCount is an Integer holding 340" },
        rule: { op: "match", pattern: "Integer\\s+employeeCount\\s*=\\s*340\\s*;" },
        onFail: {
          es: "Los empleados se cuentan en unidades enteras. Integer, sin comillas y sin decimales.",
          en: "Employees are counted in whole units. Integer, no quotes and no decimals.",
        },
        otter: {
          es: "employeeCount es un recuento, como el campo Employees de la cuenta: un número entero. Integer, sin comillas y sin decimales, con valor 340.",
          en: "employeeCount is a count, like the account's Employees field: a whole number. Integer, no quotes and no decimals, with the value 340.",
        },
      },
      {
        id: "l02-c3",
        label: { es: "isKeyAccount es Boolean y vale true", en: "isKeyAccount is a Boolean holding true" },
        rule: { op: "match", pattern: "Boolean\\s+isKeyAccount\\s*=\\s*true\\s*;" },
        onFail: {
          es: "«Si la cuenta es estratégica» es el checkbox de siempre: Boolean con true, sin comillas.",
          en: "“Whether the account is strategic” is the familiar checkbox: a Boolean set to true, no quotes.",
        },
        otter: {
          es: "isKeyAccount vuelve a ser un checkbox: Boolean con true, sin comillas.",
          en: "isKeyAccount is a checkbox again: Boolean with true, no quotes.",
        },
      },
      {
        id: "l02-c4",
        label: {
          es: "accountRecordId usa el tipo Id",
          en: "accountRecordId uses the Id type",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Id\\s+accountRecordId\\s*=\\s*'[^']+'\\s*;" },
            { op: "absent", pattern: "String\\s+accountRecordId" },
          ],
        },
        onFail: {
          es: "En un String cabría cualquier cosa. Declarándolo como Id, la plataforma comprueba el formato en el momento de asignarlo y te avisa antes de que ese valor llegue a una consulta.",
          en: "A String would swallow anything. Declared as an Id, the platform checks the format at assignment time and warns you before that value reaches a query.",
        },
        otter: {
          es: "accountRecordId es el Id del registro, el de 18 caracteres que ves en la URL. Si lo guardas como String cabe cualquier cosa; con el tipo Id, la plataforma comprueba el formato al asignarlo y te avisa antes de que llegue a una consulta.",
          en: "accountRecordId is the record Id, the 18-character one you see in the URL. Stored as a String, anything fits; with the Id type, the platform checks the format on assignment and warns you before it reaches a query.",
        },
      },
      {
        id: "l02-c5",
        label: {
          es: "amountWithTax se calcula a partir de contractAmount",
          en: "amountWithTax is computed from contractAmount",
        },
        rule: {
          op: "all",
          of: [
            {
              op: "match",
              pattern: "Decimal\\s+amountWithTax\\s*=\\s*contractAmount\\s*\\*\\s*1\\.21\\s*;",
            },
          ],
        },
        onFail: {
          es: "El valor tiene que salir de la multiplicación, no escrito a mano: si mañana cambia contractAmount, el total debe cambiar solo.",
          en: "The value must come from the multiplication, not be typed in: if contractAmount changes tomorrow, the total has to follow on its own.",
        },
        otter: {
          es: "amountWithTax tiene que comportarse como un campo fórmula: contractAmount * 1.21. Si lo escribes a mano, es un número muerto que nadie actualiza cuando cambia el importe.",
          en: "amountWithTax has to behave like a formula field: contractAmount * 1.21. Typed by hand, it is a dead number nobody updates when the amount changes.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué pasaría con este cálculo si el IVA dejara de ser el 21 %? Una constante final lo haría evidente.",
        en: "What would happen to this calculation if the tax stopped being 21%? A final constant would make that obvious.",
      },
    ],
    outro: {
      es: "Ya distingues Integer, Decimal, Double, Boolean e Id, y sabes por qué el dinero va siempre en Decimal. En la tarea 3 el contacto llega del formulario web con el nombre hecho un desastre, y toca limpiarlo con métodos de String.",
      en: "You can now tell Integer, Decimal, Double, Boolean and Id apart, and you know why money always goes in Decimal. In task 3 the contact arrives from the web form with a messy name, and it is time to clean it with String methods.",
    },
    voice: "otter",
  },
};
