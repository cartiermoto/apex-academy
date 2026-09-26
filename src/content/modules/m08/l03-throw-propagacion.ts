import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente nocturno con el ERP de Northwind
// Tarea 3 de 6: la validación de cada fila, en un método que avisa.

// 1. La clase (en tu org, en su propio archivo)
public class RenewalRow {
    public static Decimal parseAmount(String raw) {
        if (String.isBlank(raw)) {
            throw new IllegalArgumentException('Importe vacío');
        }
        Decimal amount = Decimal.valueOf(raw);   // si no es un número, la TypeException también sube
        if (amount <= 0) {
            throw new IllegalArgumentException('Importe no positivo: ' + raw);
        }
        return amount;
    }
}

// 2. La importación (como en Execute Anonymous)
List<String> rawAmounts = new List<String>{ '12500.00', '', '-300', 'doce mil', '8300.50' };
Integer imported = 0;
Integer rejected = 0;

for (String raw : rawAmounts) {
    try {
        Decimal amount = RenewalRow.parseAmount(raw);
        imported++;
    } catch (IllegalArgumentException e) {
        rejected++;
        System.debug('Rechazado: ' + e.getMessage());
    } catch (TypeException e) {
        rejected++;
        System.debug('Rechazado: «' + raw + '» no es un número');
    }
}

System.debug(imported + ' importados · ' + rejected + ' rechazados');`;

const SOLUTION_EN = `// CASE: Northwind's nightly bridge with the ERP
// Task 3 of 6: each row's validation, in a method that raises the alarm.

// 1. The class (in your org, in its own file)
public class RenewalRow {
    public static Decimal parseAmount(String raw) {
        if (String.isBlank(raw)) {
            throw new IllegalArgumentException('Empty amount');
        }
        Decimal amount = Decimal.valueOf(raw);   // if it is not a number, the TypeException bubbles up too
        if (amount <= 0) {
            throw new IllegalArgumentException('Non-positive amount: ' + raw);
        }
        return amount;
    }
}

// 2. The import (as in Execute Anonymous)
List<String> rawAmounts = new List<String>{ '12500.00', '', '-300', 'twelve thousand', '8300.50' };
Integer imported = 0;
Integer rejected = 0;

for (String raw : rawAmounts) {
    try {
        Decimal amount = RenewalRow.parseAmount(raw);
        imported++;
    } catch (IllegalArgumentException e) {
        rejected++;
        System.debug('Rejected: ' + e.getMessage());
    } catch (TypeException e) {
        rejected++;
        System.debug('Rejected: «' + raw + '» is not a number');
    }
}

System.debug(imported + ' imported · ' + rejected + ' rejected');`;

export const l03ThrowPropagacion: Lesson = {
  id: "m08-l03",
  slug: "throw-y-propagacion",
  n: 3,
  kind: "lesson",
  minutes: 30,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 2", en: "Remember? · Review of lesson 2" },
    prompt: {
      es: "Account a = [SELECT Id FROM Account WHERE ERP_Code__c = 'ERP-404']; y ese código no existe. ¿Qué excepción salta?",
      en: "Account a = [SELECT Id FROM Account WHERE ERP_Code__c = 'ERP-404']; and that code does not exist. Which exception is thrown?",
    },
    options: [
      { es: "NullPointerException", en: "NullPointerException" },
      { es: "QueryException", en: "QueryException" },
      { es: "DmlException", en: "DmlException" },
    ],
    answer: 1,
    explain: {
      es: "QueryException: asignar cero filas a un solo registro no se puede. Hoy las excepciones no las lanza Apex: las lanzas tú.",
      en: "QueryException: zero rows cannot be assigned to a single record. Today the exceptions are not thrown by Apex: you throw them.",
    },
  },
  title: { es: "throw y propagación", en: "throw and propagation" },
  summary: {
    es: "Además de capturar excepciones, puedes lanzarlas tú con throw cuando un dato no cuadra. Y si el método que la lanza no la captura, la excepción sube hasta quien sí pueda hacer algo con ella.",
    en: "Besides catching exceptions, you can throw them yourself with throw when some data is off. And if the method that throws it does not catch it, the exception travels up to whoever can do something about it.",
  },
  analogy: {
    es: "Una regla de validación que para el guardado con tu mensaje",
    en: "A validation rule that stops the save with your message",
  },
  objectives: [
    {
      es: "Lanzar una excepción con throw new cuando un dato no cumple una regla.",
      en: "Throw an exception with throw new when some data breaks a rule.",
    },
    {
      es: "Explicar cómo sube una excepción de método en método hasta un catch o hasta la plataforma.",
      en: "Explain how an exception climbs from method to method up to a catch or to the platform.",
    },
    {
      es: "Decidir dónde capturar: en el sitio que sabe qué hacer con el fallo.",
      en: "Decide where to catch: at the place that knows what to do with the failure.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Hasta ahora las excepciones las lanzaba Apex: un texto que no era un número, una consulta sin filas. Pero hay datos que Apex acepta sin rechistar y que tu negocio no: un importe vacío o negativo es un Decimal perfectamente válido para Apex, y un disparate para una renovación. Para esos casos, la excepción la lanzas tú.",
        en: "Until now Apex threw the exceptions: text that was not a number, a query with no rows. But some data Apex accepts without complaint and your business does not: an empty or negative amount is a perfectly valid Decimal to Apex, and nonsense for a renewal. For those cases, you throw the exception yourself.",
      },
    },
    {
      type: "h",
      text: { es: "throw: lanzar tú la excepción", en: "throw: throwing the exception yourself" },
    },
    {
      type: "p",
      text: {
        es: "throw new, seguido del tipo de excepción y un mensaje, para el método en seco en esa línea, igual que lo haría un fallo de Apex. Para errores del tipo «el dato que me has dado no es válido», Apex trae IllegalArgumentException, que puedes lanzar tú. En la lección 4 crearás las tuyas, con el nombre de tu negocio.",
        en: "throw new, followed by the exception type and a message, stops the method dead on that line, just as an Apex failure would. For «the data you gave me is not valid» errors, Apex ships IllegalArgumentException, which you can throw yourself. In lesson 4 you will create your own, named after your business.",
      },
    },
    {
      type: "code",
      code: {
        es: `public static Decimal parseAmount(String raw) {
    if (String.isBlank(raw)) {
        throw new IllegalArgumentException('Importe vacío');   // el método se para aquí
    }
    Decimal amount = Decimal.valueOf(raw);
    if (amount <= 0) {
        throw new IllegalArgumentException('Importe no positivo: ' + raw);
    }
    return amount;                                             // solo llega si todo cuadra
}`,
        en: `public static Decimal parseAmount(String raw) {
    if (String.isBlank(raw)) {
        throw new IllegalArgumentException('Empty amount');    // the method stops here
    }
    Decimal amount = Decimal.valueOf(raw);
    if (amount <= 0) {
        throw new IllegalArgumentException('Non-positive amount: ' + raw);
    }
    return amount;                                             // only reached if all is well
}`,
      },
      caption: {
        es: "throw lleva new: una excepción es un objeto (Módulo 5), así que primero se crea y después se lanza.",
        en: "throw takes new: an exception is an object (Module 5), so it is created first and then thrown.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Como tu regla de validación, pero en un método", en: "Like your validation rule, but in a method" },
      text: {
        es: "Una regla de validación hace exactamente esto, y yo escribí cientos: comprueba una condición y, si no se cumple, para el guardado con el mensaje que tú escribiste. throw hace lo mismo dentro de un método: para en seco y entrega tu mensaje. La diferencia es que la regla solo protege el guardado de un registro, y el método protege cualquier cálculo, lo llame quien lo llame.",
        en: "A validation rule does exactly this, and I have written hundreds: it checks a condition and, if it is not met, stops the save with the message you wrote. throw does the same inside a method: it stops dead and hands over your message. The difference is that the rule only protects one record's save, while the method protects any calculation, whoever calls it.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "Propagación: la excepción sube hasta que alguien la atrapa", en: "Propagation: the exception climbs until someone catches it" },
    },
    {
      type: "p",
      text: {
        es: "Cuando parseAmount lanza, no hace falta que la capture ella. La excepción hace un viaje hacia arriba —se llama [[propagacion|propagación]]—: sale del método que la lanzó y aparece en la línea que lo llamó. Si esa línea está dentro de un try con un catch del tipo adecuado, ahí se atrapa. Si no, sigue subiendo al método de más arriba, y así hasta llegar a la plataforma, que para la transacción. Por eso parseAmount puede ser pequeño y honesto: valida, lanza si algo no cuadra, y deja la decisión a quien lo llama.",
        en: "When parseAmount throws, it does not have to catch it itself. The exception travels upwards — this is called [[propagacion|propagation]] —: it leaves the method that threw it and shows up on the line that called it. If that line sits inside a try with a catch of the right type, it is caught there. If not, it keeps climbing to the method above, and so on up to the platform, which stops the transaction. That is why parseAmount can be small and honest: it validates, throws if something is off, and leaves the decision to its caller.",
      },
    },
    {
      type: "diagram",
      id: "m08-propagation",
      caption: {
        es: "Elige dónde está el catch y mira hasta dónde sube la excepción.",
        en: "Choose where the catch is and watch how far the exception climbs.",
      },
    },
    {
      type: "code",
      code: {
        es: `for (String raw : rawAmounts) {
    try {
        Decimal amount = RenewalRow.parseAmount(raw);   // puede lanzar: la excepción sube hasta aquí
        imported++;                                      // solo si parseAmount no lanzó nada
    } catch (IllegalArgumentException e) {
        rejected++;
        System.debug('Rechazado: ' + e.getMessage());
    }
}`,
        en: `for (String raw : rawAmounts) {
    try {
        Decimal amount = RenewalRow.parseAmount(raw);   // may throw: the exception climbs up to here
        imported++;                                      // only if parseAmount threw nothing
    } catch (IllegalArgumentException e) {
        rejected++;
        System.debug('Rejected: ' + e.getMessage());
    }
}`,
      },
      caption: {
        es: "El método lanza y el bucle captura. Una TypeException de Decimal.valueOf dentro de parseAmount también subiría hasta aquí: no hace falta declararla en ningún sitio.",
        en: "The method throws and the loop catches. A TypeException from Decimal.valueOf inside parseAmount would also climb up to here: it does not need declaring anywhere.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Dónde capturar: la regla práctica", en: "Where to catch: the rule of thumb" },
      text: {
        es: "Captura donde puedas hacer algo útil con el fallo. parseAmount no sabe si hay que saltar la fila, avisar al ERP o parar todo: esa decisión es del bucle que importa. Por eso el método lanza y el bucle captura. A diferencia de Java, Apex no te obliga a declarar qué excepciones puede lanzar un método, así que es fácil olvidar capturarlas: esa responsabilidad es tuya.",
        en: "Catch where you can do something useful with the failure. parseAmount does not know whether to skip the row, tell the ERP or stop everything: that decision belongs to the loop doing the import. That is why the method throws and the loop catches. Unlike Java, Apex does not make you declare which exceptions a method can throw, so it is easy to forget to catch them: that responsibility is yours.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque un subflow no sabe «lanzar»", en: "Why not a Flow? Because a subflow cannot «throw»" },
      text: {
        es: "En la versión con clics sacamos la validación de cada fila a un subflow, y ahí vimos el problema: un subflow que valida datos no puede lanzar un error propio a quien lo llama. Lo habitual es devolver variables de salida —isValid, errorMessage— y cada flow que lo usa tiene que acordarse de comprobarlas; el que se olvida, sigue adelante con el dato malo. (Simplificación: los flows desencadenados por registro sí tienen el elemento Custom Error para parar un guardado con tu mensaje, pero eso no sirve para devolverle un fallo a otro flow.) Con throw, quien llama no puede olvidarse: o captura la excepción, o la transacción se para.",
        en: "In the clicks version we moved each row's validation into a subflow, and that is where we saw the problem: a subflow validating data cannot throw its own error to its caller. The usual approach is to return output variables — isValid, errorMessage — and every flow using it has to remember to check them; the one that forgets carries on with the bad data. (Simplification: record-triggered flows do have the Custom Error element to stop a save with your message, but it cannot hand a failure back to another flow.) With throw, the caller cannot forget: either it catches the exception or the transaction stops.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué hace throw new en la línea donde se ejecuta? Si parseAmount lanza y el bucle que la llama no tiene try, ¿dónde acaba la excepción? ¿Por qué el catch va en el bucle y no en el método?",
        en: "Without looking: what does throw new do on the line where it runs? If parseAmount throws and the calling loop has no try, where does the exception end up? Why does the catch go in the loop and not in the method?",
      },
    },
  ],

  quiz: [
    {
      id: "m08-l03-q1",
      kind: "single",
      prompt: { es: "¿Qué imprime este código?", en: "What does this code print?" },
      code: {
        es: `public static void check(Decimal amount) {
    if (amount <= 0) {
        throw new IllegalArgumentException('Importe no positivo');
    }
    System.debug('A');
}

try {
    check(-5);
    System.debug('B');
} catch (IllegalArgumentException e) {
    System.debug(e.getMessage());
}
System.debug('C');`,
        en: `public static void check(Decimal amount) {
    if (amount <= 0) {
        throw new IllegalArgumentException('Non-positive amount');
    }
    System.debug('A');
}

try {
    check(-5);
    System.debug('B');
} catch (IllegalArgumentException e) {
    System.debug(e.getMessage());
}
System.debug('C');`,
      },
      options: [
        { es: "El mensaje de la excepción y después C", en: "The exception's message and then C" },
        { es: "A, B y C", en: "A, B and C" },
        { es: "B y C", en: "B and C" },
        { es: "Nada: la transacción se para", en: "Nothing: the transaction stops" },
      ],
      answer: 0,
      explain: {
        es: "throw para check antes de 'A'; la excepción sube a la línea check(-5), así que 'B' tampoco se imprime. El catch muestra el mensaje y el código sigue con 'C'.",
        en: "throw stops check before 'A'; the exception climbs to the check(-5) line, so 'B' is not printed either. The catch shows the message and the code carries on with 'C'.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m08-l03-q2",
      kind: "single",
      prompt: {
        es: "Un método lanza una excepción y nadie en toda la cadena de llamadas la captura. ¿Qué pasa?",
        en: "A method throws an exception and nobody in the whole call chain catches it. What happens?",
      },
      options: [
        { es: "Llega a la plataforma: la transacción se para y se deshace", en: "It reaches the platform: the transaction stops and is rolled back" },
        { es: "El método que la lanzó devuelve null", en: "The method that threw it returns null" },
        { es: "Apex la ignora y sigue en la línea siguiente", en: "Apex ignores it and moves on to the next line" },
        { es: "No compila: hay que capturarla siempre", en: "It does not compile: it must always be caught" },
      ],
      answer: 0,
      explain: {
        es: "Sube de método en método buscando un catch. Si no lo encuentra, se comporta como cualquier error sin tratar: se para todo y se deshace.",
        en: "It climbs from method to method looking for a catch. If it finds none, it behaves like any unhandled error: everything stops and is rolled back.",
      },
    },
    {
      id: "m08-l03-q3",
      kind: "single",
      prompt: {
        es: "parseAmount valida importes y lo llaman la importación nocturna, un botón y un test. ¿Dónde capturas su excepción?",
        en: "parseAmount validates amounts and is called by the nightly import, a button and a test. Where do you catch its exception?",
      },
      options: [
        { es: "En cada sitio que la llama, porque cada uno sabe qué hacer con el fallo", en: "At each place that calls it, because each knows what to do with the failure" },
        { es: "Dentro de parseAmount, para que nadie tenga que preocuparse", en: "Inside parseAmount, so nobody has to worry" },
        { es: "En ningún sitio: las excepciones se capturan solas", en: "Nowhere: exceptions catch themselves" },
        { es: "Solo en el test", en: "Only in the test" },
      ],
      answer: 0,
      explain: {
        es: "La importación salta la fila, el botón muestra un aviso y el test comprueba que el error salta. Si parseAmount se lo tragara, ninguno de los tres podría decidir.",
        en: "The import skips the row, the button shows a warning and the test checks the error is thrown. If parseAmount swallowed it, none of the three could decide.",
      },
    },
    {
      id: "m08-l03-q4",
      kind: "single",
      prompt: { es: "¿Qué falla en esta línea?", en: "What is wrong with this line?" },
      code: { es: "throw IllegalArgumentException('Importe vacío');", en: "throw IllegalArgumentException('Empty amount');" },
      options: [
        { es: "Falta new: una excepción es un objeto y primero hay que crearlo", en: "new is missing: an exception is an object and has to be created first" },
        { es: "IllegalArgumentException no se puede lanzar", en: "IllegalArgumentException cannot be thrown" },
        { es: "El mensaje debería ir entre comillas dobles", en: "The message should be in double quotes" },
        { es: "Nada: es correcta", en: "Nothing: it is correct" },
      ],
      answer: 0,
      explain: {
        es: "throw new IllegalArgumentException('…'): se crea el objeto excepción con su mensaje y se lanza.",
        en: "throw new IllegalArgumentException('…'): the exception object is created with its message and thrown.",
      },
      tags: ["find-error"],
    },
    {
      id: "m08-l03-q5",
      kind: "text",
      prompt: {
        es: "Escribe la línea que lanza una IllegalArgumentException con el mensaje 'Importe vacío'.",
        en: "Write the line that throws an IllegalArgumentException with the message 'Empty amount'.",
      },
      accept: [
        "throw\\s+new\\s+(system\\.)?illegalargumentexception\\s*\\(\\s*'importe vac(í|i)o'\\s*\\)\\s*;?",
        "throw\\s+new\\s+(system\\.)?illegalargumentexception\\s*\\(\\s*'empty amount'\\s*\\)\\s*;?",
      ],
      placeholder: { es: "throw new …", en: "throw new …" },
      explain: {
        es: "throw new IllegalArgumentException('Importe vacío'); — tipo, mensaje y punto y coma.",
        en: "throw new IllegalArgumentException('Empty amount'); — type, message and semicolon.",
      },
      tags: ["recall"],
    },
    {
      id: "m08-l03-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿qué modificador hace que un método solo se pueda llamar desde su propia clase?",
        en: "Review: which modifier makes a method callable only from its own class?",
      },
      options: [
        { es: "private", en: "private" },
        { es: "public", en: "public" },
        { es: "static", en: "static" },
        { es: "global", en: "global" },
      ],
      answer: 0,
      explain: {
        es: "private: es un detalle interno. En la tarea 6, parseAmount será private dentro del importador.",
        en: "private: it is an internal detail. In task 6, parseAmount will be private inside the importer.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M5 L6", en: "Review · M5 L6" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 3 DE 6 · El ERP ya no solo manda textos raros: también importes vacíos o negativos, que para Apex son números válidos y para Northwind no. Saca la validación a un método, RenewalRow.parseAmount, que lance una excepción cuando el importe no cuadre, y que el bucle de la importación capture el fallo y siga con la siguiente fila.",
      en: "TASK 3 OF 6 · The ERP now sends not only odd text but also empty or negative amounts, which are valid numbers to Apex and not to Northwind. Move the validation into a method, RenewalRow.parseAmount, that throws an exception when the amount is off, and have the import loop catch the failure and move on to the next row.",
    },
    brief: [
      {
        es: "En parseAmount: si String.isBlank(raw), throw new IllegalArgumentException con un mensaje; si el importe convertido es 0 o menos, otra IllegalArgumentException.",
        en: "In parseAmount: if String.isBlank(raw), throw new IllegalArgumentException with a message; if the converted amount is 0 or less, another IllegalArgumentException.",
      },
      {
        es: "parseAmount no captura nada: valida, lanza y deja que la excepción suba.",
        en: "parseAmount catches nothing: it validates, throws and lets the exception climb.",
      },
      {
        es: "En el bucle, la llamada a RenewalRow.parseAmount y el imported++ van dentro de un try.",
        en: "In the loop, the call to RenewalRow.parseAmount and the imported++ go inside a try.",
      },
      {
        es: "El bucle captura IllegalArgumentException y también TypeException (el 'doce mil' de la lista), y en los dos casos suma 1 a rejected.",
        en: "The loop catches IllegalArgumentException and also TypeException (the list's 'twelve thousand'), and in both cases adds 1 to rejected.",
      },
    ],
    starter: {
      es: `// CASO: el puente nocturno con el ERP de Northwind
// Ya resuelto (tareas 1-2): cada fila tiene su try y cada fallo, su tipo.
// Tarea 3 de 6: la validación de cada fila, en un método que avisa.

// 1. La clase (en tu org, en su propio archivo)
public class RenewalRow {
    public static Decimal parseAmount(String raw) {
        return Decimal.valueOf(raw);
    }
}

// 2. La importación (como en Execute Anonymous)
List<String> rawAmounts = new List<String>{ '12500.00', '', '-300', 'doce mil', '8300.50' };
Integer imported = 0;
Integer rejected = 0;

for (String raw : rawAmounts) {
    Decimal amount = RenewalRow.parseAmount(raw);
    imported++;
}

System.debug(imported + ' importados · ' + rejected + ' rechazados');
`,
      en: `// CASE: Northwind's nightly bridge with the ERP
// Already solved (tasks 1-2): each row has its try and each failure, its type.
// Task 3 of 6: each row's validation, in a method that raises the alarm.

// 1. The class (in your org, in its own file)
public class RenewalRow {
    public static Decimal parseAmount(String raw) {
        return Decimal.valueOf(raw);
    }
}

// 2. The import (as in Execute Anonymous)
List<String> rawAmounts = new List<String>{ '12500.00', '', '-300', 'twelve thousand', '8300.50' };
Integer imported = 0;
Integer rejected = 0;

for (String raw : rawAmounts) {
    Decimal amount = RenewalRow.parseAmount(raw);
    imported++;
}

System.debug(imported + ' imported · ' + rejected + ' rejected');
`,
    },
    hints: [
      {
        es: "Yo lo pensaría como dos reglas de validación dentro de parseAmount: vacío y no positivo. Cada una, un throw. Y la decisión de qué hacer con el fallo, fuera, en el bucle.",
        en: "I would think of it as two validation rules inside parseAmount: empty and non-positive. Each one, a throw. And the decision about what to do with the failure stays outside, in the loop.",
      },
      {
        es: "Lo que me ayudó: throw new IllegalArgumentException('…') para el método en esa línea. En el bucle, try { parseAmount…; imported++; } con dos catch: IllegalArgumentException y TypeException.",
        en: "What helped me: throw new IllegalArgumentException('…') stops the method on that line. In the loop, try { parseAmount…; imported++; } with two catch blocks: IllegalArgumentException and TypeException.",
      },
      {
        es: "Te dejo el esquema: if (String.isBlank(raw)) { throw new IllegalArgumentException('Importe vacío'); } Decimal amount = Decimal.valueOf(raw); if (amount <= 0) { throw new IllegalArgumentException('…' + raw); } return amount;",
        en: "Here is the outline: if (String.isBlank(raw)) { throw new IllegalArgumentException('Empty amount'); } Decimal amount = Decimal.valueOf(raw); if (amount <= 0) { throw new IllegalArgumentException('…' + raw); } return amount;",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m08-l03-c1",
        label: { es: "parseAmount lanza si el importe viene vacío", en: "parseAmount throws when the amount is empty" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "String\\.isBlank\\s*\\(\\s*raw\\s*\\)" },
            { op: "match", pattern: "throw\\s+new\\s+(System\\.)?IllegalArgumentException\\s*\\(" },
          ],
        },
        onFail: {
          es: "Dentro de parseAmount: if (String.isBlank(raw)) { throw new IllegalArgumentException('…'); }",
          en: "Inside parseAmount: if (String.isBlank(raw)) { throw new IllegalArgumentException('…'); }",
        },
        otter: {
          es: "Es tu primera regla de validación, escrita con throw: if (String.isBlank(raw)) { throw new IllegalArgumentException('…'); }. Para el método en seco, con tu mensaje.",
          en: "It is your first validation rule, written with throw: if (String.isBlank(raw)) { throw new IllegalArgumentException('…'); }. It stops the method dead, with your message.",
        },
      },
      {
        id: "m08-l03-c2",
        label: { es: "…y también si no es positivo", en: "…and also when it is not positive" },
        rule: { op: "count", pattern: "throw\\s+new\\s+(System\\.)?IllegalArgumentException\\s*\\(", min: 2 },
        onFail: {
          es: "Hace falta un segundo throw: si el importe convertido es 0 o menos (amount <= 0).",
          en: "A second throw is needed: when the converted amount is 0 or less (amount <= 0).",
        },
        otter: {
          es: "Tu segunda regla: -300 es un Decimal válido para Apex y un disparate para una renovación. if (amount <= 0) { throw new IllegalArgumentException('…' + raw); }",
          en: "Your second rule: -300 is a valid Decimal to Apex and nonsense for a renewal. if (amount <= 0) { throw new IllegalArgumentException('…' + raw); }",
        },
      },
      {
        id: "m08-l03-c3",
        label: { es: "parseAmount no captura: deja subir la excepción", en: "parseAmount does not catch: it lets the exception climb" },
        rule: { op: "absent", pattern: "class\\s+RenewalRow[\\s\\S]*?\\bcatch\\b[\\s\\S]*?List<String>\\s+rawAmounts" },
        onFail: {
          es: "Dentro de la clase RenewalRow no debe haber ningún catch: el método valida y lanza, y quien lo llama decide.",
          en: "There must be no catch inside the RenewalRow class: the method validates and throws, and its caller decides.",
        },
        otter: {
          es: "Una regla de validación no decide qué hacer después: solo para y avisa. parseAmount igual: nada de catch dentro, que la excepción suba al bucle.",
          en: "A validation rule does not decide what happens next: it just stops and warns. Same for parseAmount: no catch inside, let the exception climb to the loop.",
        },
      },
      {
        id: "m08-l03-c4",
        label: { es: "El bucle captura los dos tipos y cuenta los rechazos", en: "The loop catches both types and counts the rejections" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "catch\\s*\\(\\s*(System\\.)?IllegalArgumentException\\s+\\w+\\s*\\)" },
            { op: "match", pattern: "catch\\s*\\(\\s*(System\\.)?TypeException\\s+\\w+\\s*\\)" },
            { op: "count", pattern: "rejected\\s*(\\+\\+|\\+=\\s*1)", min: 2 },
          ],
        },
        onFail: {
          es: "En el bucle: catch (IllegalArgumentException e) y catch (TypeException e), y en los dos rejected++.",
          en: "In the loop: catch (IllegalArgumentException e) and catch (TypeException e), and rejected++ in both.",
        },
        otter: {
          es: "Al bucle le llegan dos tipos de fallo: los tuyos (IllegalArgumentException) y el 'doce mil' que Apex no sabe convertir (TypeException). Un catch para cada uno, y rejected++ en los dos.",
          en: "Two kinds of failure reach the loop: yours (IllegalArgumentException) and the 'twelve thousand' Apex cannot convert (TypeException). One catch for each, and rejected++ in both.",
        },
      },
      {
        id: "m08-l03-c5",
        label: { es: "imported solo sube si parseAmount no lanzó", en: "imported only goes up if parseAmount did not throw" },
        rule: { op: "match", pattern: "try\\s*\\{[^}]*RenewalRow\\.parseAmount\\s*\\([^)]*\\)[^}]*imported\\s*(\\+\\+|\\+=\\s*1)" },
        onFail: {
          es: "Dentro del try, primero la llamada a RenewalRow.parseAmount(raw) y después imported++: si la llamada lanza, imported no debe subir.",
          en: "Inside the try, first the RenewalRow.parseAmount(raw) call and then imported++: if the call throws, imported must not go up.",
        },
        otter: {
          es: "imported++ va justo después de la llamada, dentro del try: si parseAmount lanza, esa línea no llega a ejecutarse, igual que un guardado que la regla de validación paró.",
          en: "imported++ goes right after the call, inside the try: if parseAmount throws, that line never runs, just like a save the validation rule stopped.",
        },
      },
    ],
    rubric: [
      {
        es: "Si mañana el importe máximo por renovación fuera 1.000.000, ¿dónde añadirías esa regla? ¿Tendrías que tocar el bucle?",
        en: "If tomorrow the maximum amount per renewal were 1,000,000, where would you add that rule? Would you have to touch the loop?",
      },
      {
        es: "IllegalArgumentException dice «argumento no válido», pero no dice «problema de la renovación». ¿Cómo distinguirías en el informe un error del negocio de uno técnico? Es la tarea 4.",
        en: "IllegalArgumentException says «invalid argument», but not «renewal problem». How would you tell a business error from a technical one in the report? That is task 4.",
      },
    ],
    voice: "otter",
    outro: {
      es: "Ya lanzas tus propias excepciones y sabes que suben hasta quien puede decidir qué hacer con ellas. En la tarea 4, IllegalArgumentException se queda corta: los errores del negocio de Northwind merecen un nombre propio.",
      en: "You now throw your own exceptions and know they climb up to whoever can decide what to do with them. In task 4, IllegalArgumentException falls short: Northwind's business errors deserve their own name.",
    },
  },
};
