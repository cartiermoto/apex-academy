import type { Lesson } from "@/lib/types";

export const l09Casting: Lesson = {
  id: "m01-l09",
  slug: "casting",
  n: 9,
  kind: "lesson",
  minutes: 22,
  title: { es: "Casting y conversión de tipos", en: "Casting and type conversion" },
  summary: {
    es: "Cuando el dato que tienes no es del tipo que necesitas. Unas conversiones las hace Apex solo; otras las pides tú, y alguna puede fallar en ejecución.",
    en: "When the value you have is not the type you need. Some conversions Apex does for you; others you ask for, and one kind can fail at runtime.",
  },
  analogy: {
    es: "Cambiar un campo de Texto a Número en Setup",
    en: "Changing a field from Text to Number in Setup",
  },
  objectives: [
    {
      es: "Distinguir la conversión que Apex hace sola de la que tienes que pedir.",
      en: "Tell the conversion Apex performs on its own from the one you must request.",
    },
    {
      es: "Pasar de texto a número y de número a texto sin perder datos por el camino.",
      en: "Go from text to number and back without losing data on the way.",
    },
    {
      es: "Usar el operador de casting con sObjects y saber por qué puede fallar.",
      en: "Use the cast operator with sObjects and know why it can fail.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Cambiar un campo de Texto a Número en Setup lanza una advertencia: «los datos que no se puedan convertir se perderán». Esa advertencia es, palabra por palabra, de lo que trata esta sub-lección.",
        en: "Changing a field from Text to Number in Setup raises a warning: “data that cannot be converted will be lost”. That warning is, word for word, what this sub-lesson is about.",
      },
    },
    {
      type: "diagram",
      id: "m01-casting",
      caption: {
        es: "Hacia arriba nunca se pierde nada, así que Apex no pregunta. Hacia abajo sí, así que tienes que pedirlo.",
        en: "Going up loses nothing, so Apex does not ask. Going down does, so you have to ask for it.",
      },
    },
    {
      type: "h",
      text: { es: "Lo que Apex hace por su cuenta", en: "What Apex does on its own" },
    },
    {
      type: "p",
      text: {
        es: "Si el valor cabe sin perder nada en el tipo de destino, la conversión es automática. Un Integer cabe en un Decimal, así que puedes asignarlo directamente y nadie protesta. Es la misma lógica que permite ampliar un campo de Texto(40) a Texto(255) sin advertencias.",
        en: "If the value fits into the target type without loss, the conversion is automatic. An Integer fits inside a Decimal, so you can assign it directly and nobody complains. It is the same logic that lets you widen a Text(40) field to Text(255) with no warning.",
      },
    },
    {
      type: "code",
      code: {
        es: `Integer units = 5;

Decimal price = units;       // automático: 5 cabe en un Decimal
Long bigNumber = units;      // automático

Decimal total = units * 19.99;   // el Integer se amplía para operar`,
        en: `Integer units = 5;

Decimal price = units;       // automatic: 5 fits inside a Decimal
Long bigNumber = units;      // automatic

Decimal total = units * 19.99;   // the Integer widens to take part`,
      },
    },
    {
      type: "h",
      text: { es: "Lo que tienes que pedir", en: "What you have to ask for" },
    },
    {
      type: "p",
      text: {
        es: "En sentido contrario hay pérdida: un Decimal en un Integer deja los decimales fuera. Por eso Apex no lo hace solo y hay que llamar a un método que diga qué quieres exactamente — cortar, redondear o ajustar decimales.",
        en: "The other way round there is loss: a Decimal into an Integer leaves the decimals behind. That is why Apex will not do it silently, and you call a method that says exactly what you want — truncate, round, or set the scale.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Método", en: "Method" },
        { es: "Qué hace con 19.99", en: "What it does to 19.99" },
        { es: "Devuelve", en: "Returns" },
      ],
      rows: [
        [
          { es: "intValue()", en: "intValue()" },
          { es: "19 — corta, no redondea.", en: "19 — truncates, does not round." },
          { es: "Integer", en: "Integer" },
        ],
        [
          { es: "round()", en: "round()" },
          { es: "20 — redondea al entero más cercano.", en: "20 — rounds to the nearest whole." },
          { es: "Long", en: "Long" },
        ],
        [
          { es: "setScale(1)", en: "setScale(1)" },
          { es: "20.0 — ajusta los decimales.", en: "20.0 — adjusts the decimals." },
          { es: "Decimal", en: "Decimal" },
        ],
        [
          { es: "longValue()", en: "longValue()" },
          { es: "19 — como intValue pero con más rango.", en: "19 — like intValue with a wider range." },
          { es: "Long", en: "Long" },
        ],
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Cortar no es redondear", en: "Truncating is not rounding" },
      text: {
        es: "intValue() sobre 19.99 devuelve 19, no 20. Si eso son euros y el cálculo se repite mil veces, acabas de perder cientos sin que nadie vea un error. Cuando la cifra importa, el método es round() o setScale(), nunca el corte por defecto.",
        en: "intValue() on 19.99 returns 19, not 20. If those are euros and the calculation repeats a thousand times, you just lost hundreds with nobody seeing an error. When the figure matters, the method is round() or setScale(), never the default truncation.",
      },
    },
    {
      type: "h",
      text: { es: "Texto y número nunca se convierten solos", en: "Text and number never convert on their own" },
    },
    {
      type: "p",
      text: {
        es: "Un texto que parece un número sigue siendo un texto: '42' no es 42, igual que en una fórmula necesitabas VALUE() y TEXT(). La conversión se pide con valueOf(), que se le escribe al tipo de destino.",
        en: "Text that looks like a number is still text: '42' is not 42, exactly as a formula needed VALUE() and TEXT(). The conversion is requested with valueOf(), written on the destination type.",
      },
    },
    {
      type: "code",
      code: {
        es: `String raw = '42';

Integer units = Integer.valueOf(raw);       // texto → número entero
Decimal price = Decimal.valueOf('19.99');   // texto → decimal
String label = String.valueOf(42);          // número → texto

// Y funciona con cualquier cosa, no solo números:
String dateText = String.valueOf(Date.today());`,
        en: `String raw = '42';

Integer units = Integer.valueOf(raw);       // text → whole number
Decimal price = Decimal.valueOf('19.99');   // text → decimal
String label = String.valueOf(42);          // number → text

// And it works with anything, not only numbers:
String dateText = String.valueOf(Date.today());`,
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Convertir y redondear en una línea: TEXT(ROUND(…)) en Apex", en: "Convert and round in one line: TEXT(ROUND(…)) in Apex" },
      text: {
        es: "La última línea de arriba ya anidaba: Date.today() se resuelve primero y su resultado entra en String.valueOf(). Lo más habitual en la vida real es convertir un importe a texto ya redondeado, lo que en una fórmula sería TEXT(ROUND(Amount, 2)). En Apex: String.valueOf(total.setScale(2)). Se lee de dentro hacia fuera: primero total.setScale(2) da un Decimal con dos decimales, y ese Decimal es el que String.valueOf() convierte a texto. (Simplificación: ROUND() de fórmulas y setScale() no redondean igual en el caso exacto del medio, como 0.125; para importes normales dan lo mismo).",
        en: "The last line above was already nesting: Date.today() resolves first and its result goes into String.valueOf(). The everyday case is turning an amount into already-rounded text — in a formula, TEXT(ROUND(Amount, 2)). In Apex: String.valueOf(total.setScale(2)). Read it inside out: first total.setScale(2) gives a Decimal with two decimals, and that Decimal is what String.valueOf() turns into text. (Simplification: formula ROUND() and setScale() do not round the same way in the exact halfway case, such as 0.125; for normal amounts they agree.)",
      },
    },
    {
      type: "code",
      code: {
        es: `Decimal total = Decimal.valueOf('1234.5678');

// Desarmado: dos pasos con nombre
Decimal rounded = total.setScale(2);          // 1234.57
String label1 = String.valueOf(rounded);      // '1234.57'

// Anidado: los mismos dos pasos en una línea
String label2 = String.valueOf(total.setScale(2)); // '1234.57'

// Y de texto a número a texto, con un cálculo en medio
String doubled = String.valueOf(Integer.valueOf('21') * 2); // '42'`,
        en: `Decimal total = Decimal.valueOf('1234.5678');

// Broken up: two named steps
Decimal rounded = total.setScale(2);          // 1234.57
String label1 = String.valueOf(rounded);      // '1234.57'

// Nested: the same two steps on one line
String label2 = String.valueOf(total.setScale(2)); // '1234.57'

// And text to number to text, with a calculation in between
String doubled = String.valueOf(Integer.valueOf('21') * 2); // '42'`,
      },
      caption: {
        es: "Lo necesitarás en el checkpoint para mostrar un importe con dos decimales.",
        en: "You will need this in the checkpoint to show an amount with two decimals.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Si el texto no es un número, revienta", en: "If the text is not a number, it blows up" },
      text: {
        es: "Integer.valueOf('N/A') lanza una excepción en ejecución. Y como los datos de formularios y de integraciones llegan como texto, esta es la línea que más veces falla en producción por un dato que nadie previó. El Módulo 8 enseña a capturarla; por ahora, recuerda que puede ocurrir.",
        en: "Integer.valueOf('N/A') throws at runtime. And because form and integration data arrives as text, this is the line that most often fails in production over a value nobody anticipated. Module 8 teaches how to catch it; for now, just remember it can happen.",
      },
    },
    {
      type: "h",
      text: { es: "El operador de casting: los paréntesis", en: "The cast operator: the brackets" },
    },
    {
      type: "p",
      text: {
        es: "Hay un tercer caso, y es el que de verdad se llama casting en Apex: cuando tienes un valor guardado en un tipo genérico y quieres tratarlo como el tipo concreto que sabes que es. Se escribe el tipo destino entre paréntesis delante del valor.",
        en: "There is a third case, and it is the one genuinely called casting in Apex: when you hold a value in a generic type and want to treat it as the specific type you know it is. You write the target type in brackets in front of the value.",
      },
    },
    {
      type: "code",
      code: {
        es: `sObject record = new Account(Name = 'Northwind');

// Como sObject, solo se ven los métodos genéricos
Account account = (Account) record;     // casting: ahora es una Account
String name = account.Name;`,
        en: `sObject record = new Account(Name = 'Northwind');

// As an sObject, only the generic methods are visible
Account account = (Account) record;     // cast: now it is an Account
String name = account.Name;`,
      },
      caption: {
        es: "El casting no transforma el dato: solo cambia cómo lo mira Apex. Debajo siempre fue una Account.",
        en: "A cast does not transform the value: it only changes how Apex looks at it. Underneath it was always an Account.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Como abrir un registro sin saber de qué objeto es", en: "Like opening a record without knowing its object" },
      text: {
        es: "Un sObject es «un registro de algo»: sabes que es una fila, pero no de qué objeto. El casting es el momento en que dices «esto es una Account» y, a partir de ahí, puedes pedirle Name, Industry o AnnualRevenue. Si te equivocas de objeto, el error no llega al compilar sino al ejecutar, con un TypeException.",
        en: "An sObject is “a record of something”: you know it is a row, but not of which object. The cast is the moment you say “this is an Account” and, from there, you can ask for Name, Industry or AnnualRevenue. Get the object wrong and the error does not arrive at compile time but at runtime, as a TypeException.",
      },
    },
    {
      type: "code",
      code: {
        es: `sObject record = new Account(Name = 'Northwind');
Contact wrong = (Contact) record;   // 💥 TypeException en ejecución`,
        en: `sObject record = new Account(Name = 'Northwind');
Contact wrong = (Contact) record;   // 💥 TypeException at runtime`,
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿qué devuelve Decimal.valueOf('19.99').intValue()? ¿Y en qué momento falla un casting equivocado, al compilar o al ejecutar?",
        en: "Without looking up: what does Decimal.valueOf('19.99').intValue() return? And when does a wrong cast fail — at compile time or at runtime?",
      },
    },
  ],

  quiz: [
    {
      id: "m01-l09-q1",
      kind: "single",
      prompt: { es: "¿Qué imprime este código?", en: "What does this code print?" },
      code: {
        es: `Decimal price = 19.99;
System.debug(price.intValue());`,
        en: `Decimal price = 19.99;
System.debug(price.intValue());`,
      },
      options: [
        { es: "19", en: "19" },
        { es: "20", en: "20" },
        { es: "19.99", en: "19.99" },
        { es: "Lanza una excepción.", en: "It throws an exception." },
      ],
      answer: 0,
      explain: {
        es: "intValue() corta la parte decimal, no la redondea. Para obtener 20 había que usar round().",
        en: "intValue() chops the decimal part off, it does not round. To get 20 you needed round().",
      },
      tags: ["predict-output"],
    },
    {
      id: "m01-l09-q2",
      kind: "single",
      prompt: {
        es: "Un formulario web envía la cantidad como texto: '25'. Necesitas multiplicarla por el precio unitario. ¿Qué haces?",
        en: "A web form sends the quantity as text: '25'. You need to multiply it by the unit price. What do you do?",
      },
      options: [
        { es: "Integer qty = Integer.valueOf(raw);", en: "Integer qty = Integer.valueOf(raw);" },
        { es: "Integer qty = raw;", en: "Integer qty = raw;" },
        { es: "Integer qty = (Integer) raw;", en: "Integer qty = (Integer) raw;" },
        { es: "Integer qty = raw.intValue();", en: "Integer qty = raw.intValue();" },
      ],
      answer: 0,
      explain: {
        es: "Texto y número no se convierten solos ni con paréntesis: hace falta valueOf(). Y un String no tiene intValue(), porque no es un número.",
        en: "Text and number do not convert on their own, nor with brackets: valueOf() is required. And a String has no intValue(), because it is not a number.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m01-l09-q3",
      kind: "single",
      prompt: {
        es: "¿Cuándo falla esta línea?",
        en: "When does this line fail?",
      },
      code: {
        es: `sObject record = new Account(Name = 'Northwind');
Contact c = (Contact) record;`,
        en: `sObject record = new Account(Name = 'Northwind');
Contact c = (Contact) record;`,
      },
      options: [
        {
          es: "En ejecución, con un TypeException.",
          en: "At runtime, with a TypeException.",
        },
        {
          es: "Al compilar: Apex detecta el objeto equivocado.",
          en: "At compile time: Apex spots the wrong object.",
        },
        { es: "No falla: c queda en null.", en: "It does not fail: c ends up null." },
        { es: "No falla nunca.", en: "It never fails." },
      ],
      answer: 0,
      explain: {
        es: "El compilador solo ve un sObject, así que acepta la promesa. La verdad se descubre al ejecutar, cuando resulta que debajo había una Account.",
        en: "The compiler only sees an sObject, so it accepts the promise. The truth surfaces at runtime, when it turns out there was an Account underneath.",
      },
      tags: ["find-error"],
    },
    {
      id: "m01-l09-q4",
      kind: "multi",
      prompt: {
        es: "¿Cuáles de estas conversiones hace Apex automáticamente, sin que pidas nada?",
        en: "Which of these conversions does Apex perform automatically, without you asking?",
      },
      options: [
        { es: "Integer → Decimal", en: "Integer → Decimal" },
        { es: "Integer → Long", en: "Integer → Long" },
        { es: "Decimal → Integer", en: "Decimal → Integer" },
        { es: "String → Integer", en: "String → Integer" },
      ],
      answers: [0, 1],
      explain: {
        es: "Solo las que no pierden nada. Bajar de Decimal a Integer pierde decimales y pasar de texto a número puede fallar directamente: las dos hay que pedirlas.",
        en: "Only the lossless ones. Going down from Decimal to Integer loses decimals, and text to number can fail outright: both must be requested.",
      },
    },
    {
      id: "m01-l09-q5",
      kind: "single",
      prompt: {
        es: "¿Qué imprime esto?",
        en: "What does this print?",
      },
      code: {
        es: `Integer won = 7;
Integer total = 2;
System.debug(Decimal.valueOf(won) / total);`,
        en: `Integer won = 7;
Integer total = 2;
System.debug(Decimal.valueOf(won) / total);`,
      },
      options: [
        { es: "3.5", en: "3.5" },
        { es: "3", en: "3" },
        { es: "4", en: "4" },
        { es: "No compila.", en: "It does not compile." },
      ],
      answer: 0,
      explain: {
        es: "Convertir uno de los dos operandos antes de dividir es lo que evita la división entera. Es exactamente el arreglo que quedó pendiente en la sub-lección 2.",
        en: "Converting one operand before dividing is what avoids integer division. It is exactly the fix left pending back in sub-lesson 2.",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M1 L2", en: "Review · M1 L2" },
    },
    {
      id: "m01-l09-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿qué devuelve un Map cuando le pides una clave que no existe?",
        en: "Review: what does a Map return when you ask for a key that is not there?",
      },
      options: [
        { es: "null", en: "null" },
        { es: "0", en: "0" },
        { es: "Lanza una excepción.", en: "It throws an exception." },
        { es: "El primer valor del mapa.", en: "The map's first value." },
      ],
      answer: 0,
      explain: {
        es: "null, en silencio. Y si después conviertes ese null con valueOf() o haces cuentas con él, el error salta lejos de donde estaba la causa.",
        en: "null, silently. And if you then convert that null with valueOf() or do arithmetic with it, the error fires far from where the cause was.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M1 L8", en: "Review · M1 L8" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 9 DE 10 · Última pieza antes de montar la ficha. El sistema de pedidos de Northwind manda las líneas de la renovación por una integración, y las manda TODAS como texto, más el registro como sObject genérico. Nada de eso se puede multiplicar ni mostrar tal cual: conviértelo a los tipos correctos. Tú decides qué conversión usa cada dato.",
      en: "TASK 9 OF 10 · Last piece before assembling the summary. Northwind's order system sends the renewal lines through an integration, and it sends them ALL as text, plus the record as a generic sObject. None of that can be multiplied or displayed as it is: convert it to the right types. You decide which conversion each value needs.",
    },
    brief: [
      {
        es: "quantity: el texto rawQuantity convertido a número entero.",
        en: "quantity: the text rawQuantity converted to a whole number.",
      },
      {
        es: "unitPrice: el texto rawPrice convertido al tipo correcto para dinero.",
        en: "unitPrice: the text rawPrice converted to the right type for money.",
      },
      {
        es: "orderTotal: quantity multiplicado por unitPrice.",
        en: "orderTotal: quantity multiplied by unitPrice.",
      },
      {
        es: "roundedTotal: orderTotal ajustado a dos decimales. Tiene que redondear, no cortar.",
        en: "roundedTotal: orderTotal set to two decimals. It must round, not truncate.",
      },
      {
        es: "totalLabel: roundedTotal convertido a texto, para mostrarlo.",
        en: "totalLabel: roundedTotal converted to text, for display.",
      },
      {
        es: "accountRecord: el sObject genericRecord tratado como una Account. accountName: su campo Name.",
        en: "accountRecord: the sObject genericRecord treated as an Account. accountName: its Name field.",
      },
    ],
    starter: {
      es: `// CASO: campaña de renovaciones · cliente Northwind Trading
// Tarea 9 de 10: las líneas de la renovación, tal y como las manda la integración.
String rawQuantity = '25';
String rawPrice = '19.99';
sObject genericRecord = new Account(Name = 'Northwind Trading');

// Convierte cada dato al tipo que necesitas para poder operar.

`,
      en: `// CASE: renewals campaign · customer Northwind Trading
// Task 9 of 10: the renewal lines, exactly as the integration sends them.
String rawQuantity = '25';
String rawPrice = '19.99';
sObject genericRecord = new Account(Name = 'Northwind Trading');

// Convert each value into the type you need in order to calculate.

`,
    },
    hints: [
      {
        es: "Mira cómo estás bajando de decimales a entero y de un tipo genérico a uno concreto: ¿son el mismo tipo de conversión? No lo son.",
        en: "Look at how you go from decimals to whole numbers and from a generic type to a concrete one: are those the same kind of conversion? They are not.",
      },
      {
        es: "De texto a número se usa valueOf() sobre el tipo destino; para ajustar decimales redondeando, setScale(); y para tratar un sObject como un objeto concreto, el tipo entre paréntesis delante.",
        en: "Text to number uses valueOf() on the destination type; adjusting decimals with rounding is setScale(); and treating an sObject as a concrete object is the type in brackets in front.",
      },
      {
        es: "Pseudocódigo: Decimal roundedTotal = orderTotal.setScale(2); y Account accountRecord = (Account) genericRecord;",
        en: "Pseudocode: Decimal roundedTotal = orderTotal.setScale(2); and Account accountRecord = (Account) genericRecord;",
      },
    ],
    solution: {
      es: `Integer quantity = Integer.valueOf(rawQuantity);
Decimal unitPrice = Decimal.valueOf(rawPrice);
Decimal orderTotal = quantity * unitPrice;
Decimal roundedTotal = orderTotal.setScale(2);
String totalLabel = String.valueOf(roundedTotal);

Account accountRecord = (Account) genericRecord;
String accountName = accountRecord.Name;`,
      en: `Integer quantity = Integer.valueOf(rawQuantity);
Decimal unitPrice = Decimal.valueOf(rawPrice);
Decimal orderTotal = quantity * unitPrice;
Decimal roundedTotal = orderTotal.setScale(2);
String totalLabel = String.valueOf(roundedTotal);

Account accountRecord = (Account) genericRecord;
String accountName = accountRecord.Name;`,
    },
    checks: [
      {
        id: "l09-c1",
        label: {
          es: "quantity convierte el texto a Integer",
          en: "quantity converts the text to an Integer",
        },
        rule: {
          op: "match",
          pattern: "Integer\\s+quantity\\s*=\\s*Integer\\s*\\.\\s*valueOf\\s*\\(\\s*rawQuantity\\s*\\)",
        },
        onFail: {
          es: "Un texto no se convierte en número con paréntesis ni por asignación: hace falta Integer.valueOf(rawQuantity).",
          en: "Text does not become a number through brackets or assignment: it needs Integer.valueOf(rawQuantity).",
        },
      },
      {
        id: "l09-c2",
        label: {
          es: "unitPrice es Decimal, no Double ni Integer",
          en: "unitPrice is a Decimal, not a Double or Integer",
        },
        rule: {
          op: "all",
          of: [
            {
              op: "match",
              pattern: "Decimal\\s+unitPrice\\s*=\\s*Decimal\\s*\\.\\s*valueOf\\s*\\(\\s*rawPrice\\s*\\)",
            },
            { op: "absent", pattern: "(Double|Integer)\\s+unitPrice" },
          ],
        },
        onFail: {
          es: "Es un precio: Decimal. Con Integer.valueOf('19.99') perderías los céntimos antes incluso de multiplicar.",
          en: "It is a price: Decimal. With Integer.valueOf('19.99') you would lose the cents before you even multiplied.",
        },
        onPass: {
          es: "Elegir Decimal al convertir evita que el redondeo ocurra en el peor sitio posible: al principio.",
          en: "Choosing Decimal at conversion time keeps the rounding from happening in the worst possible place: at the start.",
        },
      },
      {
        id: "l09-c3",
        label: {
          es: "orderTotal se calcula con las dos variables convertidas",
          en: "orderTotal is computed from both converted variables",
        },
        rule: {
          op: "match",
          pattern: "Decimal\\s+orderTotal\\s*=\\s*quantity\\s*\\*\\s*unitPrice",
        },
        onFail: {
          es: "El total sale de multiplicar las variables ya convertidas, no los textos originales: '25' * '19.99' no compila.",
          en: "The total comes from multiplying the already-converted variables, not the original strings: '25' * '19.99' does not compile.",
        },
      },
      {
        id: "l09-c4",
        label: {
          es: "roundedTotal redondea a dos decimales",
          en: "roundedTotal rounds to two decimals",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Decimal\\s+roundedTotal\\s*=" },
            { op: "match", pattern: "setScale\\s*\\(\\s*2\\s*\\)" },
            { op: "absent", pattern: "roundedTotal\\s*=[^;]*intValue\\s*\\(" },
          ],
        },
        onFail: {
          es: "intValue() cortaría los céntimos enteros. setScale(2) ajusta a dos decimales redondeando, que es lo que pide un importe.",
          en: "intValue() would chop the cents off entirely. setScale(2) adjusts to two decimals by rounding, which is what an amount needs.",
        },
      },
      {
        id: "l09-c5",
        label: {
          es: "totalLabel convierte el número a texto",
          en: "totalLabel converts the number to text",
        },
        rule: {
          op: "match",
          pattern: "String\\s+totalLabel\\s*=\\s*String\\s*\\.\\s*valueOf\\s*\\(\\s*roundedTotal\\s*\\)",
        },
        onFail: {
          es: "Para mostrarlo hace falta texto, y la conversión de vuelta también se pide: String.valueOf(roundedTotal).",
          en: "Displaying it needs text, and the conversion back must also be requested: String.valueOf(roundedTotal).",
        },
      },
      {
        id: "l09-c6",
        label: {
          es: "accountRecord usa el operador de casting",
          en: "accountRecord uses the cast operator",
        },
        rule: {
          op: "all",
          of: [
            {
              op: "match",
              pattern: "Account\\s+accountRecord\\s*=\\s*\\(\\s*Account\\s*\\)\\s*genericRecord",
            },
            { op: "match", pattern: "String\\s+accountName\\s*=\\s*accountRecord\\s*\\.\\s*Name" },
          ],
        },
        onFail: {
          es: "Un sObject no deja leer Name directamente: hay que decirle a Apex qué objeto es, con el tipo entre paréntesis delante. Aquí sí se usa el casting de verdad.",
          en: "An sObject will not let you read Name directly: you have to tell Apex which object it is, with the type in brackets in front. This is where a real cast belongs.",
        },
      },
    ],
    rubric: [
      {
        es: "Si mañana la integración enviara 'N/A' en rawQuantity, ¿qué línea se rompería y qué vería el usuario? Esa pregunta es el Módulo 8.",
        en: "If the integration sent 'N/A' in rawQuantity tomorrow, which line would break and what would the user see? That question is Module 8.",
      },
    ],
  },
};
