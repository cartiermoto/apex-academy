import type { Lesson } from "@/lib/types";

export const l10Checkpoint: Lesson = {
  id: "m01-l10",
  slug: "checkpoint",
  n: 10,
  kind: "checkpoint",
  minutes: 45,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 9", en: "Remember? · Review of lesson 9" },
    prompt: { es: "¿Cómo conviertes el texto '25' en un número entero?", en: "How do you turn the text '25' into a whole number?" },
    options: [
      { es: "(Integer) '25'", en: "(Integer) '25'" },
      { es: "Integer.valueOf('25')", en: "Integer.valueOf('25')" },
      { es: "'25'.toInteger()", en: "'25'.toInteger()" },
    ],
    answer: 1,
    explain: { es: "De texto a número se le pide al tipo destino, con valueOf(): es tu VALUE() de fórmulas. El casting entre paréntesis no convierte texto en número.", en: "From text to number you ask the target type, with valueOf(): it is your formula VALUE(). Casting in brackets does not turn text into a number." },
  },
  title: { es: "Checkpoint del Módulo 1", en: "Module 1 Checkpoint" },
  summary: {
    es: "Las nueve sub-lecciones, un caso de negocio real resuelto con todas ellas, y un quiz que no se aprueba de memoria.",
    en: "The nine sub-lessons, one real business case solved with all of them, and a quiz you cannot pass from memory.",
  },
  analogy: {
    es: "Un caso real de Sales Cloud con las nueve piezas",
    en: "A real Sales Cloud case using all nine pieces",
  },
  objectives: [
    {
      es: "Reconstruir de memoria qué resuelve cada sub-lección y por qué está donde está.",
      en: "Rebuild from memory what each sub-lesson solves and why it sits where it does.",
    },
    {
      es: "Leer un bloque de Apex real e identificar de dónde sale cada decisión.",
      en: "Read a real block of Apex and identify where each decision comes from.",
    },
    {
      es: "Escribir código que sobreviva a datos incompletos sin haber visto todavía un if.",
      en: "Write code that survives incomplete data without having seen an if yet.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Un módulo de fundamentos parece una lista de tipos hasta que ves las nueve piezas trabajando juntas sobre un registro real. Esa es exactamente la diferencia entre saber qué es un Decimal y saber cuándo usarlo.",
        en: "A fundamentals module looks like a list of types until you see the nine pieces working together on a real record. That is exactly the difference between knowing what a Decimal is and knowing when to use one.",
      },
    },
    {
      type: "h",
      text: { es: "Lo que has aprendido, sub-lección a sub-lección", en: "What you learned, sub-lesson by sub-lesson" },
    },
    {
      type: "p",
      text: {
        es: "1 · Variables y declaración. Declarar una variable es el asistente de campo personalizado en una línea: eliges el tipo antes que el valor, le pones nombre y decides si podrá cambiar. Integer maxDiscount = 20; tiene cuatro partes y todas hacen falta. Importa porque el tipo es una promesa que la plataforma verifica al compilar, y esa rigidez convierte errores de ejecución —los que ve el cliente— en errores de guardado, que solo ves tú.",
        en: "1 · Variables and declaration. Declaring a variable is the custom-field wizard on one line: you pick the type before the value, give it a name, and decide whether it can change. Integer maxDiscount = 20; has four parts and every one is needed. It matters because the type is a promise the platform verifies at compile time, and that rigidity turns runtime errors — the ones customers see — into save-time errors, which only you see.",
      },
    },
    {
      type: "p",
      text: {
        es: "2 · Tipos numéricos y Boolean. Es el mismo desplegable de «Number, Currency, Percent, Checkbox», con consecuencias más visibles: Decimal para dinero, Integer para lo que se cuenta, Boolean para lo que solo admite sí o no. Decimal total = units * 19.99; suena inocente hasta que descubres que 9 / 4 entre Integers da 2. Y aquí aparecen los dos tipos que solo existen porque esto es Salesforce: Id, que valida el formato de un identificador, y Blob, que guarda el archivo en bruto.",
        en: "2 · Numeric types and Boolean. Same “Number, Currency, Percent, Checkbox” dropdown, with more visible consequences: Decimal for money, Integer for things you count, Boolean for what only admits yes or no. Decimal total = units * 19.99; sounds innocent until you discover 9 / 4 between Integers gives 2. And this is where the two types that exist only because this is Salesforce show up: Id, which validates an identifier's format, and Blob, which holds the raw file.",
      },
    },
    {
      type: "p",
      text: {
        es: "3 · String y qué es un método. Un método es una acción con nombre que un dato sabe hacer consigo mismo: lo que en fórmulas era TRIM(Name), aquí es name.trim(). Devuelve siempre un valor nuevo y nunca modifica el original, así que String clean = raw.trim(); guarda el trabajo y raw.trim(); lo tira. Como cada método devuelve un valor, se pueden encadenar (raw.trim().toUpperCase(), de izquierda a derecha) y anidar (String.valueOf(total.setScale(2)), de dentro hacia fuera, como TEXT(ROUND(Amount, 2))). En este checkpoint verás las dos cosas. Importa porque es el primer sitio donde se ve que en Apex los datos no son inertes: tienen comportamiento.",
        en: "3 · String and what a method is. A method is a named action a value knows how to perform on itself: what formulas wrote as TRIM(Name), here is name.trim(). It always returns a new value and never modifies the original, so String clean = raw.trim(); keeps the work and raw.trim(); throws it away. Because every method returns a value, methods can be chained (raw.trim().toUpperCase(), left to right) and nested (String.valueOf(total.setScale(2)), inside out, like TEXT(ROUND(Amount, 2))). This checkpoint uses both. It matters because it is the first place you see that in Apex data is not inert: it has behaviour.",
      },
    },
    {
      type: "p",
      text: {
        es: "4 · Date, Time y Datetime. Los tres tipos de fecha del asistente, con la misma trampa: solo Datetime lleva zona horaria, y por eso un pedido de las 00:30 cambia de día según quién lo mire. Date renewal = signed.addYears(1); calcula en vez de escribir, y addMonths() ya sabe que febrero tiene 28. Importa porque una fecha mal tipada no da error: da un informe que no cuadra y nadie sabe por qué.",
        en: "4 · Date, Time and Datetime. The wizard's three date types, with the same trap: only Datetime carries a time zone, which is why a 00:30 order changes day depending on who is looking. Date renewal = signed.addYears(1); computes instead of typing, and addMonths() already knows February has 28 days. It matters because a mistyped date does not error: it produces a report that does not add up and nobody knows why.",
      },
    },
    {
      type: "p",
      text: {
        es: "5 · sObjects. Object Manager define el molde; new Account() fabrica una fila con ese molde, y el punto significa «el campo de». Account a = new Account(Name = 'Acme'); crea un registro que existe solo en memoria: su Id está vacío y desaparece al acabar la transacción. Importa porque marca la frontera entre «tengo el dato delante» y «el dato está guardado», que es la frontera donde empiezan los módulos de [[dml]] y [[trigger|triggers]].",
        en: "5 · sObjects. Object Manager defines the mould; new Account() casts a row from it, and the dot means “the field of”. Account a = new Account(Name = 'Acme'); creates a record that exists only in memory: its Id is empty and it vanishes when the transaction ends. It matters because it marks the border between “I have the value in front of me” and “the value is saved”, which is where the [[dml]] and [[trigger]] modules begin.",
      },
    },
    {
      type: "p",
      text: {
        es: "6 · Null. Es el campo en blanco de siempre, pero aquí no se ignora educadamente: pedirle un método a null detiene la transacción con un NullPointerException. String.isBlank(region) cubre de una vez el null, la cadena vacía y la de espacios, que es exactamente lo que manda un formulario web. Importa porque es la causa número uno de errores en Apex y la más barata de evitar: una comprobación de una línea.",
        en: "6 · Null. It is the same old blank field, but here it is not politely ignored: asking null for a method halts the transaction with a NullPointerException. String.isBlank(region) covers null, the empty string and the whitespace string in one go — exactly what a web form sends. It matters because it is the number-one cause of Apex errors and the cheapest to prevent: a one-line check.",
      },
    },
    {
      type: "p",
      text: {
        es: "7 · Operadores. Los mismos símbolos que usabas en una regla de validación, con dos añadidos decisivos: && evalúa en corto, así que region != null && region.length() > 2 es seguro y el orden inverso explota; y el operador condicional es el IF() de las fórmulas escrito como condición ? a : b. Importa porque es lo que te permite decidir sin haber visto todavía un if, y porque el orden de las condiciones no es estilo: es estabilidad.",
        en: "7 · Operators. The same symbols you used in a validation rule, with two decisive additions: && short-circuits, so region != null && region.length() > 2 is safe while the reverse order explodes; and the conditional operator is the formula IF() written condition ? a : b. It matters because it lets you decide before ever seeing an if, and because the order of conditions is not style: it is stability.",
      },
    },
    {
      type: "p",
      text: {
        es: "8 · Colecciones. List es la lista relacionada —orden y repetidos—, Set es la columna de agrupación de un informe —valores únicos— y Map es el cruce por Id que harías en una hoja de cálculo. Map<String, Decimal> quotaByRegion = new Map<String, Decimal>(); responde «¿cuál es la cuota de EMEA?» sin recorrer nada. Importa porque a partir del Módulo 3 todo llega en bloques de 200 registros, y elegir mal la colección es la diferencia entre código que aguanta y código que agota los [[governor-limits|límites]].",
        en: "8 · Collections. List is the related list — order and duplicates — Set is a report's grouping column — unique values — and Map is the cross-reference by Id you would do in a spreadsheet. Map<String, Decimal> quotaByRegion = new Map<String, Decimal>(); answers “what is EMEA's quota?” without scanning anything. It matters because from Module 3 onwards everything arrives in blocks of 200 records, and choosing the wrong collection is the difference between code that holds and code that exhausts the [[governor-limits|limits]].",
      },
    },
    {
      type: "p",
      text: {
        es: "9 · Casting y conversión. Es la advertencia de Setup al cambiar un campo de Texto a Número, hecha explícita: hacia arriba Apex convierte solo, hacia abajo lo pides tú con intValue() o setScale(), y entre texto y número nunca hay automatismo — Integer.valueOf('42'). El casting de verdad, (Account) record, no transforma nada: cambia cómo mira Apex un valor, y si te equivocas el error llega en ejecución. Importa porque los datos de integraciones y formularios siempre llegan como texto.",
        en: "9 · Casting and conversion. It is Setup's warning when changing a field from Text to Number, made explicit: upwards Apex converts by itself, downwards you ask with intValue() or setScale(), and between text and number there is never anything automatic — Integer.valueOf('42'). The genuine cast, (Account) record, transforms nothing: it changes how Apex looks at a value, and if you get it wrong the error arrives at runtime. It matters because integration and form data always arrives as text.",
      },
    },
    {
      type: "divider",
    },
    {
      type: "h",
      text: { es: "El caso real: ficha de oportunidad para dirección", en: "The real case: an opportunity summary for management" },
    },
    {
      type: "p",
      text: {
        es: "Dirección de Ventas quiere una ficha resumen por oportunidad: nombre limpio, código corto, importe con impuestos, si necesita aprobación, cuántos días faltan para el cierre y qué cuota tiene la región del cliente. Los datos llegan como llegan: el nombre con espacios y en minúsculas, la región del cliente sin rellenar. El código de abajo resuelve el caso completo usando las nueve sub-lecciones — y sin una sola condición ni un solo bucle, porque todavía no los has visto.",
        en: "Sales management wants a per-opportunity summary: a clean name, a short code, the amount with tax, whether it needs approval, how many days remain before close, and what quota the customer's region carries. The data arrives as it arrives: the name with spaces and in lower case, the customer's region unfilled. The code below solves the whole case using all nine sub-lessons — and without a single condition or loop, because you have not met those yet.",
      },
    },
    {
      type: "code",
      code: {
        es: `// ─── L5 · sObjects: los registros, todavía solo en memoria ───────────────
Opportunity opp = new Opportunity(
    Name      = '  renovación northwind  ',
    StageName = 'Negotiation',
    CloseDate = Date.newInstance(2026, 6, 30),
    Amount    = 24500.75
);
Account customer = new Account(Name = 'Northwind Trading');
// customer.Region__c se queda sin asignar: el formulario lo envió vacío.

// ─── L1 · Variables + L2 · Tipos: constantes del negocio ─────────────────
final Decimal TAX_RATE = 0.21;             // dinero → Decimal
final Integer BIG_DEAL_THRESHOLD = 20000;  // umbral contable → Integer

// ─── L3 · String: limpiar lo que llega sucio ─────────────────────────────
String cleanName = opp.Name.trim().capitalize();
String opportunityCode = cleanName.substring(0, 4).toUpperCase();

// ─── L6 · Null + L7 · Operadores: decidir qué hacer con los huecos ───────
Decimal safeAmount = opp.Amount == null ? 0 : opp.Amount;
String displayRegion = String.isBlank(customer.Region__c)
    ? 'Sin región'
    : customer.Region__c;

// ─── L7 · Operadores: las reglas de negocio, una a una ───────────────────
Decimal amountWithTax = safeAmount * (1 + TAX_RATE);
Boolean isBigDeal = safeAmount >= BIG_DEAL_THRESHOLD;
Boolean isNegotiating = opp.StageName == 'Negotiation';
Boolean needsApproval = isBigDeal && isNegotiating;

// ─── L4 · Fechas: cuentas sobre el calendario, no sobre días sueltos ─────
Integer daysToClose = Date.today().daysBetween(opp.CloseDate);
Date internalReviewDate = opp.CloseDate.addDays(-15);

// ─── L8 · Colecciones: la tabla de cuotas y el resumen ───────────────────
Map<String, Decimal> quotaByRegion = new Map<String, Decimal>();
quotaByRegion.put('EMEA', 150000);
quotaByRegion.put('AMER', 220000);

Decimal regionQuota = quotaByRegion.containsKey(displayRegion)
    ? quotaByRegion.get(displayRegion)
    : 0;

List<String> summaryLines = new List<String>();
summaryLines.add(opportunityCode + ' · ' + cleanName);
summaryLines.add('Región: ' + displayRegion);
summaryLines.add(needsApproval ? 'Requiere aprobación' : 'Aprobación no necesaria');

// ─── L9 · Casting: de número a texto para mostrarlo ──────────────────────
String amountLabel = String.valueOf(amountWithTax.setScale(2));
summaryLines.add('Importe con IVA: ' + amountLabel);

System.debug(summaryLines);`,
        en: `// ─── L5 · sObjects: the records, still only in memory ────────────────────
Opportunity opp = new Opportunity(
    Name      = '  northwind renewal  ',
    StageName = 'Negotiation',
    CloseDate = Date.newInstance(2026, 6, 30),
    Amount    = 24500.75
);
Account customer = new Account(Name = 'Northwind Trading');
// customer.Region__c is left unassigned: the form sent it empty.

// ─── L1 · Variables + L2 · Types: the business constants ─────────────────
final Decimal TAX_RATE = 0.21;             // money → Decimal
final Integer BIG_DEAL_THRESHOLD = 20000;  // accounting threshold → Integer

// ─── L3 · String: clean up what arrives dirty ────────────────────────────
String cleanName = opp.Name.trim().capitalize();
String opportunityCode = cleanName.substring(0, 4).toUpperCase();

// ─── L6 · Null + L7 · Operators: decide what to do with the gaps ─────────
Decimal safeAmount = opp.Amount == null ? 0 : opp.Amount;
String displayRegion = String.isBlank(customer.Region__c)
    ? 'No region'
    : customer.Region__c;

// ─── L7 · Operators: the business rules, one at a time ───────────────────
Decimal amountWithTax = safeAmount * (1 + TAX_RATE);
Boolean isBigDeal = safeAmount >= BIG_DEAL_THRESHOLD;
Boolean isNegotiating = opp.StageName == 'Negotiation';
Boolean needsApproval = isBigDeal && isNegotiating;

// ─── L4 · Dates: arithmetic on the calendar, not on loose days ───────────
Integer daysToClose = Date.today().daysBetween(opp.CloseDate);
Date internalReviewDate = opp.CloseDate.addDays(-15);

// ─── L8 · Collections: the quota table and the summary ───────────────────
Map<String, Decimal> quotaByRegion = new Map<String, Decimal>();
quotaByRegion.put('EMEA', 150000);
quotaByRegion.put('AMER', 220000);

Decimal regionQuota = quotaByRegion.containsKey(displayRegion)
    ? quotaByRegion.get(displayRegion)
    : 0;

List<String> summaryLines = new List<String>();
summaryLines.add(opportunityCode + ' · ' + cleanName);
summaryLines.add('Region: ' + displayRegion);
summaryLines.add(needsApproval ? 'Approval required' : 'No approval needed');

// ─── L9 · Casting: number to text so it can be displayed ─────────────────
String amountLabel = String.valueOf(amountWithTax.setScale(2));
summaryLines.add('Amount with tax: ' + amountLabel);

System.debug(summaryLines);`,
      },
      caption: {
        es: "Ni un if ni un for, y el caso queda resuelto — incluida la región que nunca llegó.",
        en: "Not one if and not one for, and the case is solved — including the region that never arrived.",
      },
    },
    {
      type: "diagram",
      id: "m01-cp-flow",
      caption: {
        es: "Diagrama 1 · El flujo del ejemplo, paso a paso, etiquetado por la sub-lección de la que sale cada bloque.",
        en: "Diagram 1 · The example's flow, step by step, labelled with the sub-lesson each block comes from.",
      },
    },
    {
      type: "h",
      text: { es: "El concepto puente: campo fórmula frente a Apex", en: "The bridge concept: formula field vs Apex" },
    },
    {
      type: "p",
      text: {
        es: "Casi todo lo de este módulo tiene un equivalente en un campo fórmula, y por eso te ha resultado familiar. La diferencia no está en lo que se puede calcular, sino en dónde vive el cálculo, cuándo ocurre y cuántos registros puede tocar. Ese salto es lo que justifica todo lo que viene después.",
        en: "Almost everything in this module has an equivalent in a formula field, which is why it felt familiar. The difference is not in what can be calculated, but in where the calculation lives, when it happens and how many records it can touch. That jump is what justifies everything that comes next.",
      },
    },
    {
      type: "diagram",
      id: "m01-cp-formula-vs-apex",
      caption: {
        es: "Diagrama 2 · Lo mismo que ya sabías hacer con clicks, y lo que se abre al escribirlo en código.",
        en: "Diagram 2 · What you already knew how to do with clicks, and what opens up when you write it as code.",
      },
    },
    {
      type: "h",
      text: { es: "Por qué el módulo va en este orden", en: "Why the module runs in this order" },
    },
    {
      type: "p",
      text: {
        es: "No es un índice arbitrario. Los tipos básicos sostienen a los sObjects, los sObjects hacen que null deje de ser una curiosidad y pase a ser el caso habitual, y sin entender null no se pueden usar bien ni los operadores ni las colecciones ni las conversiones — las tres tienen un camino donde aparece un hueco.",
        en: "It is not an arbitrary index. The basic types hold up the sObjects, sObjects turn null from a curiosity into the normal case, and without understanding null you cannot properly use operators, collections or conversions — all three have a path where a gap shows up.",
      },
    },
    {
      type: "diagram",
      id: "m01-cp-deps",
      caption: {
        es: "Diagrama 3 · Qué sub-lección necesita a cuál. Si algo de la fila de abajo se te resistió, la respuesta suele estar más arriba.",
        en: "Diagram 3 · Which sub-lesson needs which. If something in the bottom row resisted you, the answer is usually further up.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes del quiz", en: "Before the quiz" },
      text: {
        es: "Cierra esta página y responde en voz alta: ¿qué hace safeAmount que no hace opp.Amount? ¿Por qué displayRegion se calcula antes de usarse como clave del Map? Si dudas en alguna, vuelve a la sub-lección correspondiente antes de seguir.",
        en: "Close this page and answer out loud: what does safeAmount do that opp.Amount does not? Why is displayRegion computed before being used as the Map's key? If either makes you hesitate, go back to that sub-lesson before moving on.",
      },
    },
  ],

  quiz: [
    {
      id: "m01-cp-q1",
      kind: "single",
      prompt: {
        es: "En el ejemplo de la ficha, ¿qué habría pasado si la línea de safeAmount no existiera y amountWithTax se calculara directamente desde opp.Amount, con una oportunidad cuyo importe está vacío?",
        en: "In the summary example, what would have happened without the safeAmount line, computing amountWithTax straight from opp.Amount on an opportunity whose amount is empty?",
      },
      options: [
        {
          es: "NullPointerException: no se puede multiplicar null.",
          en: "NullPointerException: null cannot be multiplied.",
        },
        {
          es: "amountWithTax valdría 0.",
          en: "amountWithTax would be 0.",
        },
        {
          es: "amountWithTax valdría null sin error.",
          en: "amountWithTax would be null with no error.",
        },
        {
          es: "No compilaría.",
          en: "It would not compile.",
        },
      ],
      answer: 0,
      explain: {
        es: "Operar aritméticamente con null es una de las tres formas de provocar un NullPointerException. Concatenar sí lo tolera —produce el texto 'null'—, pero multiplicar no.",
        en: "Arithmetic with null is one of the three ways to raise a NullPointerException. Concatenation tolerates it — producing the text 'null' — but multiplication does not.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m01-cp-q2",
      kind: "single",
      prompt: { es: "¿Qué imprime este código?", en: "What does this code print?" },
      code: {
        es: `Opportunity opp = new Opportunity(Name = '  acme deal  ', Amount = 15000);
Integer threshold = 20000;
Boolean isBig = opp.Amount >= threshold;
System.debug(opp.Name.trim().length() + ' / ' + isBig);`,
        en: `Opportunity opp = new Opportunity(Name = '  acme deal  ', Amount = 15000);
Integer threshold = 20000;
Boolean isBig = opp.Amount >= threshold;
System.debug(opp.Name.trim().length() + ' / ' + isBig);`,
      },
      options: [
        { es: "9 / false", en: "9 / false" },
        { es: "13 / false", en: "13 / false" },
        { es: "9 / true", en: "9 / true" },
        { es: "Lanza NullPointerException.", en: "It throws a NullPointerException." },
      ],
      answer: 0,
      explain: {
        es: "'acme deal' son 9 caracteres una vez recortado, y 15000 no llega a 20000. El Integer se amplía automáticamente para compararse con el Decimal del campo Amount.",
        en: "'acme deal' is 9 characters once trimmed, and 15000 does not reach 20000. The Integer widens automatically to be compared against the Amount field's Decimal.",
      },
      tags: ["predict-output", "interleaving"],
    },
    {
      id: "m01-cp-q3",
      kind: "single",
      prompt: {
        es: "Este código falla en ejecución con algunos Leads. ¿Dónde está el error?",
        en: "This code fails at runtime for some Leads. Where is the error?",
      },
      code: {
        es: `Lead webLead = new Lead(LastName = 'Ruiz');
String region = webLead.Region__c;
Boolean isEmea = region.toUpperCase() == 'EMEA' && region != null;`,
        en: `Lead webLead = new Lead(LastName = 'Ruiz');
String region = webLead.Region__c;
Boolean isEmea = region.toUpperCase() == 'EMEA' && region != null;`,
      },
      options: [
        {
          es: "El orden de las condiciones: toUpperCase() se evalúa antes de comprobar que region existe.",
          en: "The order of the conditions: toUpperCase() is evaluated before checking that region exists.",
        },
        {
          es: "== no sirve para comparar textos en Apex.",
          en: "== cannot compare text in Apex.",
        },
        {
          es: "Falta declarar isEmea como String.",
          en: "isEmea should be declared as a String.",
        },
        {
          es: "Region__c no puede leerse de un Lead sin guardar.",
          en: "Region__c cannot be read from an unsaved Lead.",
        },
      ],
      answer: 0,
      explain: {
        es: "&& evalúa de izquierda a derecha y para en cuanto sabe la respuesta, así que la comprobación protectora tiene que ir primero: region != null && region.toUpperCase() == 'EMEA'.",
        en: "&& evaluates left to right and stops as soon as it knows the answer, so the guarding check has to come first: region != null && region.toUpperCase() == 'EMEA'.",
      },
      tags: ["find-error", "interleaving"],
    },
    {
      id: "m01-cp-q4",
      kind: "single",
      prompt: { es: "¿Cuál es el valor final de summary?", en: "What is the final value of summary?" },
      code: {
        es: `Map<String, Decimal> quota = new Map<String, Decimal>();
quota.put('EMEA', 150000);
String region = '   ';
String displayRegion = String.isBlank(region) ? 'Sin región' : region;
Decimal value = quota.containsKey(displayRegion) ? quota.get(displayRegion) : 0;
String summary = displayRegion + ': ' + value;`,
        en: `Map<String, Decimal> quota = new Map<String, Decimal>();
quota.put('EMEA', 150000);
String region = '   ';
String displayRegion = String.isBlank(region) ? 'No region' : region;
Decimal value = quota.containsKey(displayRegion) ? quota.get(displayRegion) : 0;
String summary = displayRegion + ': ' + value;`,
      },
      options: [
        { es: "'Sin región: 0'", en: "'No region: 0'" },
        { es: "'Sin región: null'", en: "'No region: null'" },
        { es: "'   : 0'", en: "'   : 0'" },
        { es: "Lanza NullPointerException.", en: "It throws a NullPointerException." },
      ],
      answer: 0,
      explain: {
        es: "isBlank() considera en blanco la cadena de espacios, así que displayRegion es 'Sin región'; esa clave no está en el mapa, y containsKey() evita quedarse con el null que devolvería get().",
        en: "isBlank() treats the whitespace string as blank, so displayRegion is 'No region'; that key is not in the map, and containsKey() avoids being left with the null that get() would return.",
      },
      tags: ["predict-output", "interleaving"],
    },
    {
      id: "m01-cp-q5",
      kind: "multi",
      prompt: {
        es: "Ventas describe cuatro datos nuevos. ¿Cuáles están mal tipados en esta propuesta?",
        en: "Sales describes four new values. Which ones are mistyped in this proposal?",
      },
      code: {
        es: `Double contractValue = 48200.50;       // importe firmado
Integer renewalMonths = 12;             // duración en meses
String closeDate = '2026-06-30';        // fecha de cierre prevista
Boolean autoRenew = true;               // renovación automática`,
        en: `Double contractValue = 48200.50;       // signed amount
Integer renewalMonths = 12;             // duration in months
String closeDate = '2026-06-30';        // expected close date
Boolean autoRenew = true;               // automatic renewal`,
      },
      options: [
        { es: "contractValue", en: "contractValue" },
        { es: "renewalMonths", en: "renewalMonths" },
        { es: "closeDate", en: "closeDate" },
        { es: "autoRenew", en: "autoRenew" },
      ],
      answers: [0, 2],
      explain: {
        es: "Un importe firmado es Decimal, no Double: Double aproxima y el dinero exige exactitud. Y una fecha entre comillas es texto, incapaz de sumar meses o compararse: era Date.",
        en: "A signed amount is a Decimal, not a Double: Double approximates and money demands exactness. And a date in quotes is text, unable to add months or compare itself: it should be a Date.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m01-cp-q6",
      kind: "single",
      prompt: {
        es: "Necesitas recoger las industrias distintas de 200 cuentas y, por separado, poder consultar el importe total de cada industria por su nombre. ¿Qué eliges?",
        en: "You need to gather the distinct industries from 200 accounts and, separately, look up each industry's total amount by name. What do you choose?",
      },
      options: [
        {
          es: "Un Set<String> para las industrias y un Map<String, Decimal> para los totales.",
          en: "A Set<String> for the industries and a Map<String, Decimal> for the totals.",
        },
        {
          es: "Dos List<String>, una para cada cosa.",
          en: "Two List<String>, one for each.",
        },
        {
          es: "Un Map<String, String> para todo.",
          en: "A single Map<String, String> for everything.",
        },
        {
          es: "Un Set<String> para las dos cosas.",
          en: "A Set<String> for both.",
        },
      ],
      answer: 0,
      explain: {
        es: "«Distintas» es un Set y «consultar por nombre» es un Map. Un Set no guarda valores asociados y una List no deduplica ni busca por clave.",
        en: "“Distinct” is a Set and “look up by name” is a Map. A Set stores no associated value, and a List neither deduplicates nor looks up by key.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m01-cp-q7",
      kind: "single",
      prompt: {
        es: "¿Qué imprime este código?",
        en: "What does this code print?",
      },
      code: {
        es: `String rawPrice = '19.99';
Integer units = 3;
Decimal total = Decimal.valueOf(rawPrice) * units;
System.debug(total.intValue());`,
        en: `String rawPrice = '19.99';
Integer units = 3;
Decimal total = Decimal.valueOf(rawPrice) * units;
System.debug(total.intValue());`,
      },
      options: [
        { es: "59", en: "59" },
        { es: "60", en: "60" },
        { es: "59.97", en: "59.97" },
        { es: "No compila.", en: "It does not compile." },
      ],
      answer: 0,
      explain: {
        es: "59.97 pasado por intValue() se corta a 59, no se redondea a 60. Si esos son euros, acabas de perder casi uno por operación.",
        en: "59.97 through intValue() truncates to 59, it does not round to 60. If those are euros, you just lost nearly one per transaction.",
      },
      tags: ["predict-output", "interleaving"],
    },
    {
      id: "m01-cp-q8",
      kind: "single",
      prompt: {
        es: "Un compañero escribe esto para «marcar la cuenta como estratégica si factura más de 500.000». ¿Qué hace realmente?",
        en: "A colleague writes this to “flag the account as strategic if it bills over 500,000”. What does it actually do?",
      },
      code: {
        es: `Account a = new Account(AnnualRevenue = 120000);
Boolean isStrategic = a.AnnualRevenue = 500000;`,
        en: `Account a = new Account(AnnualRevenue = 120000);
Boolean isStrategic = a.AnnualRevenue = 500000;`,
      },
      options: [
        {
          es: "Sobrescribe AnnualRevenue con 500000 en vez de comparar, porque usa un solo igual.",
          en: "It overwrites AnnualRevenue with 500000 instead of comparing, because it uses a single equals.",
        },
        {
          es: "Compara correctamente y devuelve false.",
          en: "It compares correctly and returns false.",
        },
        {
          es: "Compara correctamente y devuelve true.",
          en: "It compares correctly and returns true.",
        },
        {
          es: "Lanza NullPointerException.",
          en: "It throws a NullPointerException.",
        },
      ],
      answer: 0,
      explain: {
        es: "Un igual asigna, dos comparan. Además, «más de» sería > y no >=: dos errores en una línea de catorce caracteres.",
        en: "One equals assigns, two compare. On top of that, “over” would be > and not >=: two mistakes in a fourteen-character line.",
      },
      tags: ["find-error"],
    },
    {
      id: "m01-cp-q9",
      kind: "text",
      prompt: {
        es: "Escribe la expresión que deja en displayName el nombre de la cuenta customer, o el texto 'Sin nombre' cuando esté vacío, en blanco o ausente. Usa la comprobación que cubre los tres casos.",
        en: "Write the expression that puts the account customer's name into displayName, or the text 'No name' when it is empty, blank or absent. Use the check that covers all three cases.",
      },
      accept: [
        "string\\s+displayname\\s*=\\s*string\\.isblank\\(\\s*customer\\.name\\s*\\)\\s*\\?\\s*'[^']+'\\s*:\\s*customer\\.name\\s*;?",
      ],
      placeholder: { es: "String displayName = …", en: "String displayName = …" },
      explain: {
        es: "String displayName = String.isBlank(customer.Name) ? 'Sin nombre' : customer.Name; — la comprobación de texto va con isBlank, y la decisión con el operador condicional.",
        en: "String displayName = String.isBlank(customer.Name) ? 'No name' : customer.Name; — the text check is isBlank, and the decision is the conditional operator.",
      },
      tags: ["recall", "interleaving"],
    },
    {
      id: "m01-cp-q10",
      kind: "single",
      prompt: {
        es: "En el ejemplo de la ficha, displayRegion se calcula antes de usarse como clave del Map. ¿Por qué no se usa directamente customer.Region__c?",
        en: "In the summary example, displayRegion is computed before being used as the Map's key. Why is customer.Region__c not used directly?",
      },
      options: [
        {
          es: "Porque un null como clave devolvería siempre null y el resumen mostraría un hueco en lugar de un valor.",
          en: "Because a null key would always return null and the summary would show a gap instead of a value.",
        },
        {
          es: "Porque un Map no admite claves de tipo String.",
          en: "Because a Map does not accept String keys.",
        },
        {
          es: "Porque containsKey() lanza una excepción con null.",
          en: "Because containsKey() throws an exception on null.",
        },
        {
          es: "Por estilo: funciona igual de las dos formas.",
          en: "Style only: it works the same either way.",
        },
      ],
      answer: 0,
      explain: {
        es: "Normalizar el dato antes de usarlo como clave es lo que hace que el resto del código no tenga que preocuparse por el hueco. Es el mismo patrón que verás en el Desafío 1 con la región de los Leads.",
        en: "Normalising the value before using it as a key is what frees the rest of the code from worrying about the gap. It is the same pattern you will see in Challenge 1 with the Leads' region.",
      },
      tags: ["interleaving"],
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 10 DE 10 · La entrega. Es el requisito completo que Ventas soltó en la reunión de la sub-lección 1, entero y de una vez: la ficha de la renovación de Northwind. Y llega en el peor estado posible —el nombre sucio, el importe vacío, la región sin rellenar—, que es como llegan los datos de verdad. No vas a inventar nada nuevo: cada línea es un trozo que ya resolviste en las nueve tareas anteriores. Sin una sola condición ni bucle, porque todavía no los has visto.",
      en: "TASK 10 OF 10 · Delivery day. This is the complete requirement Sales dropped in the sub-lesson 1 meeting, whole and all at once: Northwind's renewal summary. And it arrives in the worst possible shape — dirty name, empty amount, unfilled region — which is how real data arrives. You will invent nothing new: every line is a piece you already solved in the previous nine tasks. Without a single condition or loop, because you have not met those yet.",
    },
    brief: [
      {
        es: "Parte de los dos registros del código de partida. No cambies sus valores.",
        en: "Start from the two records in the starter code. Do not change their values.",
      },
      {
        es: "cleanName: el nombre de la oportunidad, sin espacios en los extremos.",
        en: "cleanName: the opportunity name, with the outer spaces removed.",
      },
      {
        es: "safeAmount: el importe de la oportunidad, o 0 cuando está vacío. Aquí lo está: si no lo resuelves, la línea siguiente revienta.",
        en: "safeAmount: the opportunity amount, or 0 when it is empty. Here it is: if you do not handle it, the next line blows up.",
      },
      {
        es: "amountWithTax: safeAmount multiplicado por 1 más TAX_RATE, que ya está declarado.",
        en: "amountWithTax: safeAmount multiplied by 1 plus TAX_RATE, which is already declared.",
      },
      {
        es: "displayRegion: la región del cliente, o 'Sin región' si falta, está vacía o son espacios.",
        en: "displayRegion: the customer's region, or 'No region' when missing, empty or whitespace.",
      },
      {
        es: "daysToClose: días desde hoy hasta la fecha de cierre. Elige el tipo correcto.",
        en: "daysToClose: days from today until the close date. Choose the right type.",
      },
      {
        es: "regionQuota: la cuota de displayRegion en el mapa quotaByRegion, o 0 si esa clave no existe.",
        en: "regionQuota: the quota for displayRegion in the quotaByRegion map, or 0 when that key is missing.",
      },
      {
        es: "summaryLines: una List<String> con tres líneas — el nombre limpio, 'Región: ' más displayRegion, y el importe con impuestos convertido a texto con dos decimales.",
        en: "summaryLines: a List<String> with three lines — the clean name, 'Region: ' plus displayRegion, and the amount with tax converted to text with two decimals.",
      },
    ],
    starter: {
      es: `Opportunity opp = new Opportunity(
    Name      = '  renovación northwind  ',
    StageName = 'Negotiation',
    CloseDate = Date.newInstance(2026, 6, 30)
);
// Amount se queda sin asignar: la oportunidad todavía no tiene importe.

Account customer = new Account(Name = 'Northwind Trading');
// Region__c tampoco se asigna.

final Decimal TAX_RATE = 0.21;

Map<String, Decimal> quotaByRegion = new Map<String, Decimal>();
quotaByRegion.put('EMEA', 150000);
quotaByRegion.put('AMER', 220000);

// Construye la ficha. Sin if, sin for, y sin que explote nada.

`,
      en: `Opportunity opp = new Opportunity(
    Name      = '  northwind renewal  ',
    StageName = 'Negotiation',
    CloseDate = Date.newInstance(2026, 6, 30)
);
// Amount is left unassigned: the opportunity has no amount yet.

Account customer = new Account(Name = 'Northwind Trading');
// Region__c is not assigned either.

final Decimal TAX_RATE = 0.21;

Map<String, Decimal> quotaByRegion = new Map<String, Decimal>();
quotaByRegion.put('EMEA', 150000);
quotaByRegion.put('AMER', 220000);

// Build the summary. No if, no for, and nothing may explode.

`,
    },
    hints: [
      {
        es: "Yo recorrería el código línea por línea preguntando lo mismo que antes de una carga con Data Loader: «¿y si este dato viene vacío?». Hay dos datos ausentes y tres sitios donde eso se nota: la multiplicación, la clave del mapa y la concatenación final.",
        en: "I would walk through the code line by line asking what I ask before a Data Loader load: «what if this value comes in empty?». There are two missing values and three places where it shows: the multiplication, the map key and the final concatenation.",
      },
      {
        es: "Lo que a mí me sirvió: para un número ausente la comprobación es == null; para un texto, String.isBlank(); y para una clave de mapa, containsKey(). Las tres se resuelven con el operador condicional, tu IF() de fórmulas, que devuelve un valor y se asigna directamente.",
        en: "What worked for me: for a missing number the check is == null; for text, String.isBlank(); and for a map key, containsKey(). All three are solved with the conditional operator, your formula IF(), which returns a value you assign directly.",
      },
      {
        es: "Te dejo dos líneas casi hechas: Decimal safeAmount = opp.Amount == null ? 0 : opp.Amount; y Decimal regionQuota = quotaByRegion.containsKey(displayRegion) ? quotaByRegion.get(displayRegion) : 0;",
        en: "Here are two lines nearly done: Decimal safeAmount = opp.Amount == null ? 0 : opp.Amount; and Decimal regionQuota = quotaByRegion.containsKey(displayRegion) ? quotaByRegion.get(displayRegion) : 0;",
      },
    ],
    solution: {
      es: `String cleanName = opp.Name.trim();

Decimal safeAmount = opp.Amount == null ? 0 : opp.Amount;
Decimal amountWithTax = safeAmount * (1 + TAX_RATE);

String displayRegion = String.isBlank(customer.Region__c)
    ? 'Sin región'
    : customer.Region__c;

Integer daysToClose = Date.today().daysBetween(opp.CloseDate);

Decimal regionQuota = quotaByRegion.containsKey(displayRegion)
    ? quotaByRegion.get(displayRegion)
    : 0;

List<String> summaryLines = new List<String>();
summaryLines.add(cleanName);
summaryLines.add('Región: ' + displayRegion);
summaryLines.add(String.valueOf(amountWithTax.setScale(2)));`,
      en: `String cleanName = opp.Name.trim();

Decimal safeAmount = opp.Amount == null ? 0 : opp.Amount;
Decimal amountWithTax = safeAmount * (1 + TAX_RATE);

String displayRegion = String.isBlank(customer.Region__c)
    ? 'No region'
    : customer.Region__c;

Integer daysToClose = Date.today().daysBetween(opp.CloseDate);

Decimal regionQuota = quotaByRegion.containsKey(displayRegion)
    ? quotaByRegion.get(displayRegion)
    : 0;

List<String> summaryLines = new List<String>();
summaryLines.add(cleanName);
summaryLines.add('Region: ' + displayRegion);
summaryLines.add(String.valueOf(amountWithTax.setScale(2)));`,
    },
    checks: [
      {
        id: "cp-c1",
        label: {
          es: "cleanName limpia el nombre leído del registro",
          en: "cleanName cleans the name read off the record",
        },
        rule: {
          op: "match",
          pattern: "String\\s+cleanName\\s*=\\s*opp\\s*\\.\\s*Name\\s*\\.\\s*trim\\s*\\(\\s*\\)",
        },
        onFail: {
          es: "El nombre sale del registro y se limpia con trim(). Volver a escribirlo a mano rompe el ejercicio en cuanto cambie la oportunidad.",
          en: "The name comes off the record and is cleaned with trim(). Retyping it by hand breaks the moment the opportunity changes.",
        },
        otter: {
          es: "cleanName sale del registro, como un campo de combinación, y se limpia con trim(). Si lo vuelves a escribir a mano, la ficha dejará de servir en cuanto cambie la oportunidad.",
          en: "cleanName comes from the record, like a merge field, and is cleaned with trim(). Type it again by hand and the sheet stops working the moment the opportunity changes.",
        },
      },
      {
        id: "cp-c2",
        label: {
          es: "safeAmount sustituye el importe ausente por 0",
          en: "safeAmount replaces the missing amount with 0",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Decimal\\s+safeAmount\\s*=" },
            { op: "match", pattern: "opp\\s*\\.\\s*Amount\\s*==\\s*null" },
            { op: "match", pattern: "\\?[\\s\\S]{0,80}:" },
          ],
        },
        onFail: {
          es: "Este es el caso que obliga el ejercicio: Amount está vacío. Sin sustituirlo por 0, la multiplicación siguiente lanza NullPointerException y la ficha no se genera.",
          en: "This is the case the exercise forces: Amount is empty. Without replacing it with 0, the next multiplication throws a NullPointerException and no summary is produced.",
        },
        otter: {
          es: "safeAmount: el importe de esta oportunidad viene vacío. Es tu BLANKVALUE(Amount, 0): sin ese 0, la multiplicación siguiente lanza NullPointerException y la ficha no se genera.",
          en: "safeAmount: this opportunity's amount is empty. It is your BLANKVALUE(Amount, 0): without that 0, the next multiplication throws NullPointerException and the sheet is never produced.",
        },
        onPass: {
          es: "Normalizar el dato ausente justo después de leerlo, y no diez líneas más abajo, es lo que mantiene limpio el resto del método.",
          en: "Normalising the missing value right where you read it, rather than ten lines later, is what keeps the rest of the method clean.",
        },
      },
      {
        id: "cp-c3",
        label: {
          es: "amountWithTax se calcula desde safeAmount y TAX_RATE",
          en: "amountWithTax is computed from safeAmount and TAX_RATE",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Decimal\\s+amountWithTax\\s*=\\s*safeAmount\\s*\\*" },
            { op: "match", pattern: "TAX_RATE" },
            { op: "absent", pattern: "amountWithTax\\s*=\\s*opp\\s*\\.\\s*Amount" },
          ],
        },
        onFail: {
          es: "Tiene que multiplicar safeAmount, no opp.Amount — si usas el campo directamente vuelves a tener el null — y usar la constante TAX_RATE en vez de escribir 1.21.",
          en: "It must multiply safeAmount, not opp.Amount — using the field directly brings the null straight back — and use the TAX_RATE constant rather than typing 1.21.",
        },
        otter: {
          es: "amountWithTax es un campo fórmula sobre safeAmount, no sobre opp.Amount —ahí vuelve el null—, y usa la constante TAX_RATE en vez de escribir 1.21: si el impuesto cambia, se cambia en un solo sitio.",
          en: "amountWithTax is a formula over safeAmount, not over opp.Amount — that is where the null comes back — and it uses the TAX_RATE constant instead of typing 1.21: if the tax changes, it changes in one place.",
        },
      },
      {
        id: "cp-c4",
        label: {
          es: "displayRegion cubre null, vacío y espacios",
          en: "displayRegion covers null, empty and whitespace",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "String\\s+displayRegion\\s*=" },
            {
              op: "match",
              pattern: "String\\s*\\.\\s*isBlank\\s*\\(\\s*customer\\s*\\.\\s*Region__c\\s*\\)",
            },
            { op: "match", pattern: "\\?[\\s\\S]{0,120}:" },
          ],
        },
        onFail: {
          es: "Comparar solo con null dejaría pasar la cadena de espacios, que es lo que manda un formulario. String.isBlank() cubre los tres casos, y el operador condicional elige el texto por defecto.",
          en: "Comparing against null alone lets the whitespace string through, which is what a form sends. String.isBlank() covers all three, and the conditional operator picks the default text.",
        },
        otter: {
          es: "displayRegion: comparar solo con null dejaría pasar la cadena de espacios que manda un formulario. Es tu IF(ISBLANK(Region__c), 'Sin región', Region__c): String.isBlank() y el operador condicional.",
          en: "displayRegion: comparing only with null would let through the string of spaces a form sends. It is your IF(ISBLANK(Region__c), 'No region', Region__c): String.isBlank() and the conditional operator.",
        },
      },
      {
        id: "cp-c5",
        label: {
          es: "daysToClose es Integer y usa daysBetween()",
          en: "daysToClose is an Integer using daysBetween()",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Integer\\s+daysToClose\\s*=" },
            { op: "match", pattern: "daysBetween\\s*\\(\\s*opp\\s*\\.\\s*CloseDate\\s*\\)" },
          ],
        },
        onFail: {
          es: "Un recuento de días es un Integer, y se calcula desde hoy: Date.today().daysBetween(opp.CloseDate).",
          en: "A count of days is an Integer, computed from today: Date.today().daysBetween(opp.CloseDate).",
        },
        otter: {
          es: "daysToClose es tu CloseDate - TODAY() de fórmulas: un número, así que Integer, y contado desde hoy: Date.today().daysBetween(opp.CloseDate).",
          en: "daysToClose is your formula CloseDate - TODAY(): a number, so an Integer, counted from today: Date.today().daysBetween(opp.CloseDate).",
        },
      },
      {
        id: "cp-c6",
        label: {
          es: "regionQuota no se queda en null con una clave inexistente",
          en: "regionQuota does not end up null for a missing key",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Decimal\\s+regionQuota\\s*=" },
            { op: "match", pattern: "containsKey\\s*\\(\\s*displayRegion\\s*\\)" },
            { op: "match", pattern: "\\?[\\s\\S]{0,140}:" },
          ],
        },
        onFail: {
          es: "'Sin región' no está en el mapa, así que get() devolvería null en silencio. containsKey() lo detecta antes y el operador condicional pone el 0.",
          en: "'No region' is not in the map, so get() would quietly return null. containsKey() catches it first and the conditional operator supplies the 0.",
        },
        otter: {
          es: "regionQuota: 'Sin región' no está en el mapa, y get() devolvería null en silencio, como un VLOOKUP sin coincidencia. containsKey() lo detecta antes y el operador condicional pone el 0.",
          en: "regionQuota: 'No region' is not in the map, and get() would quietly return null, like a VLOOKUP with no match. containsKey() catches it first and the conditional operator puts in the 0.",
        },
      },
      {
        id: "cp-c7",
        label: {
          es: "summaryLines es una List creada con las tres líneas",
          en: "summaryLines is a created List with the three lines",
        },
        rule: {
          op: "all",
          of: [
            {
              op: "match",
              pattern: "List\\s*<\\s*String\\s*>\\s+summaryLines\\s*=\\s*new\\s+List\\s*<\\s*String\\s*>",
            },
            { op: "count", pattern: "summaryLines\\s*\\.\\s*add\\s*\\(", min: 3 },
            { op: "match", pattern: "String\\s*\\.\\s*valueOf\\s*\\(" },
            { op: "match", pattern: "setScale\\s*\\(\\s*2\\s*\\)" },
          ],
        },
        onFail: {
          es: "La lista hay que crearla con new antes de añadirle nada, y la última línea necesita dos conversiones: setScale(2) para los céntimos y String.valueOf() para poder concatenarla.",
          en: "The list must be created with new before anything is added, and the last line needs two conversions: setScale(2) for the cents and String.valueOf() so it can be concatenated.",
        },
        otter: {
          es: "summaryLines: la lista se crea con new antes de añadirle nada, y la última línea necesita dos conversiones, como TEXT(ROUND(…, 2)) en una fórmula: setScale(2) para los céntimos y String.valueOf() para poder concatenarla.",
          en: "summaryLines: the list is created with new before anything is added, and the last line needs two conversions, like TEXT(ROUND(…, 2)) in a formula: setScale(2) for the cents and String.valueOf() so it can be concatenated.",
        },
      },
      {
        id: "cp-c8",
        label: {
          es: "Sin condiciones ni bucles: todavía no se han enseñado",
          en: "No conditions or loops: they have not been taught yet",
        },
        rule: {
          op: "all",
          of: [
            { op: "absent", pattern: "\\bif\\s*\\(" },
            { op: "absent", pattern: "\\bfor\\s*\\(" },
            { op: "absent", pattern: "\\bwhile\\s*\\(" },
          ],
        },
        onFail: {
          es: "Este ejercicio se resuelve entero con el operador condicional. Si necesitaste un if, no es que esté mal: es que el Módulo 2 te va a gustar.",
          en: "This exercise is solved entirely with the conditional operator. If you reached for an if, that is not wrong: it means you are going to enjoy Module 2.",
        },
        otter: {
          es: "Aquí no hacen falta if ni bucles: todo se resuelve con el operador condicional, igual que resolvías campos fórmula sin montar un Flow. Si el cuerpo te pidió un if, no está mal: es que el Módulo 2 te va a gustar.",
          en: "No ifs or loops needed here: everything is solved with the conditional operator, just as you solved formula fields without building a Flow. If you felt the urge for an if, that is not wrong: it means you are going to like Module 2.",
        },
      },
      {
        id: "cp-c9",
        label: {
          es: "Ningún método llamado directamente sobre un campo que puede faltar",
          en: "No method called straight on a field that may be missing",
        },
        rule: {
          op: "absent",
          pattern:
            "customer\\s*\\.\\s*Region__c\\s*\\.\\s*(toUpperCase|toLowerCase|trim|length|substring)\\s*\\(",
        },
        onFail: {
          es: "Region__c es null en este cliente: cualquier método llamado directamente sobre él detiene la transacción. Usa la comprobación o el operador de navegación segura.",
          en: "Region__c is null for this customer: any method called straight on it halts the transaction. Use the check or the safe navigation operator.",
        },
        optional: true,
      },
    ],
    rubric: [
      {
        es: "¿Qué pasaría con este mismo código si en vez de una oportunidad llegaran 200? No cambiaría nada — y ese es precisamente el problema que resuelven los bucles del Módulo 2.",
        en: "What would happen to this same code if 200 opportunities arrived instead of one? Nothing would change — and that is precisely the problem Module 2's loops solve.",
      },
      {
        es: "¿Cuántas de tus líneas seguirían siendo correctas si el campo Amount dejara de existir mañana? Las que leen del registro fallarían al compilar, que es la mejor forma de fallar.",
        en: "How many of your lines would still be correct if the Amount field disappeared tomorrow? The ones reading from the record would fail at compile time, which is the best way to fail.",
      },
      {
        es: "Lee tus nombres de variable en voz alta. ¿Se entiende la ficha entera sin leer el código que hay debajo?",
        en: "Read your variable names out loud. Can the whole summary be understood without reading the code underneath?",
      },
    ],
    outro: {
      es: "¡Entregaste la ficha que pidió Ventas en la primera reunión! Lo que en la sub-lección 1 parecía gigante lo has construido pieza a pieza. En el Módulo 2 llegan las decisiones y los bucles, y con ellos las reglas de negocio de las cuentas clave.",
      en: "You delivered the sheet Sales asked for in the first meeting! What looked huge in sub-lesson 1 you have built piece by piece. Module 2 brings decisions and loops, and with them the business rules for key accounts.",
    },
    voice: "otter",
  },
};
