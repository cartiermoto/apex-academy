import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente nocturno con el ERP de Northwind
// Tarea 4 de 6: los errores del negocio, con nombre propio.

// 1. Las clases (en tu org, cada una en su propio archivo)
public class RenewalImportException extends Exception {}

public class RenewalRow {
    public static Decimal parseAmount(String raw) {
        if (String.isBlank(raw)) {
            throw new RenewalImportException('Importe vacío');
        }
        Decimal amount;
        try {
            amount = Decimal.valueOf(raw);
        } catch (TypeException e) {
            throw new RenewalImportException('Importe no numérico: ' + raw, e);   // envuelve la original
        }
        if (amount <= 0) {
            throw new RenewalImportException('Importe no positivo: ' + raw);
        }
        return amount;
    }

    public static String findAccountName(String erpCode, Map<String, String> accountNamesByErp) {
        if (!accountNamesByErp.containsKey(erpCode)) {
            throw new RenewalImportException('Cuenta desconocida: ' + erpCode);
        }
        return accountNamesByErp.get(erpCode);
    }
}

// 2. La importación (como en Execute Anonymous)
Map<String, String> accountNamesByErp = new Map<String, String>{ 'ERP-100' => 'Acme', 'ERP-200' => 'Globex' };
Map<String, String> amountsByErp = new Map<String, String>{ 'ERP-100' => '12500.00', 'ERP-200' => 'doce mil', 'ERP-999' => '4100' };
Integer imported = 0;
Integer rejected = 0;

for (String erpCode : amountsByErp.keySet()) {
    try {
        String accountName = RenewalRow.findAccountName(erpCode, accountNamesByErp);
        Decimal amount = RenewalRow.parseAmount(amountsByErp.get(erpCode));
        imported++;
        System.debug('Lista para ' + accountName + ': ' + amount);
    } catch (RenewalImportException e) {
        rejected++;
        System.debug(erpCode + ' rechazado: ' + e.getMessage());
    }
}

System.debug(imported + ' importados · ' + rejected + ' rechazados');`;

const SOLUTION_EN = `// CASE: Northwind's nightly bridge with the ERP
// Task 4 of 6: business errors, with their own name.

// 1. The classes (in your org, each in its own file)
public class RenewalImportException extends Exception {}

public class RenewalRow {
    public static Decimal parseAmount(String raw) {
        if (String.isBlank(raw)) {
            throw new RenewalImportException('Empty amount');
        }
        Decimal amount;
        try {
            amount = Decimal.valueOf(raw);
        } catch (TypeException e) {
            throw new RenewalImportException('Non-numeric amount: ' + raw, e);   // wraps the original
        }
        if (amount <= 0) {
            throw new RenewalImportException('Non-positive amount: ' + raw);
        }
        return amount;
    }

    public static String findAccountName(String erpCode, Map<String, String> accountNamesByErp) {
        if (!accountNamesByErp.containsKey(erpCode)) {
            throw new RenewalImportException('Unknown account: ' + erpCode);
        }
        return accountNamesByErp.get(erpCode);
    }
}

// 2. The import (as in Execute Anonymous)
Map<String, String> accountNamesByErp = new Map<String, String>{ 'ERP-100' => 'Acme', 'ERP-200' => 'Globex' };
Map<String, String> amountsByErp = new Map<String, String>{ 'ERP-100' => '12500.00', 'ERP-200' => 'twelve thousand', 'ERP-999' => '4100' };
Integer imported = 0;
Integer rejected = 0;

for (String erpCode : amountsByErp.keySet()) {
    try {
        String accountName = RenewalRow.findAccountName(erpCode, accountNamesByErp);
        Decimal amount = RenewalRow.parseAmount(amountsByErp.get(erpCode));
        imported++;
        System.debug('Ready for ' + accountName + ': ' + amount);
    } catch (RenewalImportException e) {
        rejected++;
        System.debug(erpCode + ' rejected: ' + e.getMessage());
    }
}

System.debug(imported + ' imported · ' + rejected + ' rejected');`;

export const l04ExcepcionesPersonalizadas: Lesson = {
  id: "m08-l04",
  slug: "excepciones-personalizadas",
  n: 4,
  kind: "lesson",
  minutes: 35,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 3", en: "Remember? · Review of lesson 3" },
    prompt: {
      es: "parseAmount lanza una IllegalArgumentException y el bucle que la llama no tiene try. ¿Qué pasa?",
      en: "parseAmount throws an IllegalArgumentException and the loop calling it has no try. What happens?",
    },
    options: [
      { es: "La excepción sube hasta la plataforma: se para todo y se deshace", en: "The exception climbs to the platform: everything stops and is rolled back" },
      { es: "parseAmount devuelve null y el bucle sigue", en: "parseAmount returns null and the loop carries on" },
      { es: "El bucle salta esa fila automáticamente", en: "The loop skips that row automatically" },
    ],
    answer: 0,
    explain: {
      es: "Sin un catch en el camino, la excepción sube hasta la plataforma. Hoy le pondrás a esa excepción el nombre de tu negocio.",
      en: "With no catch on the way, the exception climbs to the platform. Today you will give that exception your business's name.",
    },
  },
  title: { es: "Excepciones personalizadas", en: "Custom exceptions" },
  summary: {
    es: "IllegalArgumentException dice «argumento no válido», pero no dice «problema de la importación». Crear tu propia excepción te deja separar los errores del negocio de los fallos técnicos, y capturar solo los tuyos.",
    en: "IllegalArgumentException says «invalid argument», but not «import problem». Creating your own exception lets you separate business errors from technical failures, and catch only yours.",
  },
  analogy: {
    es: "Un valor de picklist propio en lugar de «Otro»",
    en: "A picklist value of your own instead of «Other»",
  },
  objectives: [
    {
      es: "Declarar una excepción propia que extienda Exception.",
      en: "Declare an exception of your own that extends Exception.",
    },
    {
      es: "Envolver una excepción técnica en una de negocio sin perder la original (getCause).",
      en: "Wrap a technical exception in a business one without losing the original (getCause).",
    },
    {
      es: "Capturar solo los errores del negocio y dejar que los fallos inesperados se vean.",
      en: "Catch only business errors and let unexpected failures show.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Tu bucle de importación tiene ya dos catch, y en la tarea 6 serán más. Pero todos dicen lo mismo: «esta fila no se puede importar». Lo que el bucle necesita no es distinguir TypeException de IllegalArgumentException; necesita distinguir «fila rechazada por el negocio» de «algo se ha roto de verdad». Para eso creas tu propio tipo de excepción.",
        en: "Your import loop already has two catch blocks, and in task 6 there will be more. But they all say the same thing: «this row cannot be imported». What the loop needs is not to tell TypeException from IllegalArgumentException; it needs to tell «row rejected by the business» from «something is really broken». For that you create your own exception type.",
      },
    },
    {
      type: "h",
      text: { es: "Una línea basta", en: "One line is enough" },
    },
    {
      type: "p",
      text: {
        es: "Una [[excepcion-personalizada|excepción personalizada]] es una clase que extiende Exception, igual que en el Módulo 5 TaskReminder extendía Notification. Solo hay una regla: su nombre tiene que terminar en Exception. No hace falta escribir nada dentro: al heredar de Exception, ya trae getMessage(), getCause(), getTypeName() y cuatro constructores listos para usar.",
        en: "A [[excepcion-personalizada|custom exception]] is a class that extends Exception, just as TaskReminder extended Notification in Module 5. There is only one rule: its name must end in Exception. Nothing needs writing inside: by inheriting from Exception it already brings getMessage(), getCause(), getTypeName() and four ready-made constructors.",
      },
    },
    {
      type: "code",
      code: {
        es: `public class RenewalImportException extends Exception {}

// Los cuatro constructores que trae de serie:
new RenewalImportException();                              // sin mensaje
new RenewalImportException('Cuenta desconocida: ERP-999'); // con mensaje
new RenewalImportException(e);                             // envolviendo otra excepción
new RenewalImportException('Importe no numérico', e);      // mensaje + la original`,
        en: `public class RenewalImportException extends Exception {}

// The four constructors it comes with:
new RenewalImportException();                              // no message
new RenewalImportException('Unknown account: ERP-999');    // with a message
new RenewalImportException(e);                             // wrapping another exception
new RenewalImportException('Non-numeric amount', e);       // message + the original`,
      },
      caption: {
        es: "Si la llamaras RenewalImportError, no compilaría: las clases que extienden Exception tienen que terminar en Exception.",
        en: "Name it RenewalImportError and it would not compile: classes extending Exception must end in Exception.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Un valor de picklist propio en lugar de «Otro»", en: "A picklist value of your own instead of «Other»" },
      text: {
        es: "¿Te acuerdas de aquella picklist Motivo de pérdida con un «Otro» en el que acababa todo? Nadie podía hacer un informe útil. Lo arreglamos creando los valores del negocio: Precio, Competencia, Sin presupuesto. IllegalArgumentException es ese «Otro»; RenewalImportException es tu valor con nombre: cualquiera que lo vea en un log sabe que viene de la importación de renovaciones.",
        en: "Remember that Loss Reason picklist with an «Other» where everything ended up? Nobody could build a useful report. We fixed it by creating the business values: Price, Competitor, No budget. IllegalArgumentException is that «Other»; RenewalImportException is your named value: anyone who sees it in a log knows it comes from the renewal import.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "Envolver sin perder la original", en: "Wrapping without losing the original" },
    },
    {
      type: "p",
      text: {
        es: "El 'doce mil' sigue lanzando una TypeException dentro de parseAmount, porque la lanza Decimal.valueOf, no tú. Para que al bucle le llegue una RenewalImportException, la capturas justo ahí y lanzas la tuya pasándole la original como segundo argumento. Así el bucle solo ve errores del negocio, y quien depure después puede recuperar el fallo técnico con getCause().",
        en: "The 'twelve thousand' still throws a TypeException inside parseAmount, because Decimal.valueOf throws it, not you. For the loop to receive a RenewalImportException, you catch it right there and throw yours, passing the original as the second argument. That way the loop only sees business errors, and whoever debugs later can recover the technical failure with getCause().",
      },
    },
    {
      type: "code",
      code: {
        es: `Decimal amount;
try {
    amount = Decimal.valueOf(raw);
} catch (TypeException e) {
    throw new RenewalImportException('Importe no numérico: ' + raw, e);
}

// Más arriba, en el catch del bucle:
// e.getMessage()                  → 'Importe no numérico: doce mil'
// e.getCause().getTypeName()      → 'System.TypeException'`,
        en: `Decimal amount;
try {
    amount = Decimal.valueOf(raw);
} catch (TypeException e) {
    throw new RenewalImportException('Non-numeric amount: ' + raw, e);
}

// Further up, in the loop's catch:
// e.getMessage()                  → 'Non-numeric amount: twelve thousand'
// e.getCause().getTypeName()      → 'System.TypeException'`,
      },
      caption: {
        es: "Esto sí es un catch con sentido: no se traga el error, lo traduce al idioma del negocio y conserva la original dentro.",
        en: "This is a catch that makes sense: it does not swallow the error, it translates it into the business's language and keeps the original inside.",
      },
    },
    {
      type: "diagram",
      id: "m08-custom-exception",
      caption: {
        es: "Lanza cada fallo y mira qué catch lo recoge: el tuyo o ninguno.",
        en: "Throw each failure and see which catch picks it up: yours or none.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Capturar solo lo tuyo es una ventaja", en: "Catching only yours is an advantage" },
      text: {
        es: "Con un único catch (RenewalImportException e), el bucle salta las filas que el negocio rechaza… y deja pasar todo lo demás. Si mañana aparece una NullPointerException por un bug tuyo, no quedará escondida como «fila rechazada»: la importación se parará y la verás. Un catch (Exception e) lo habría tapado.",
        en: "With a single catch (RenewalImportException e), the loop skips the rows the business rejects… and lets everything else through. If a NullPointerException from a bug of yours shows up tomorrow, it will not stay hidden as «row rejected»: the import will stop and you will see it. A catch (Exception e) would have covered it up.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque el fault path no tiene categorías", en: "Why not a Flow? Because the fault path has no categories" },
      text: {
        es: "En la versión con clics quisimos lo mismo: separar «el ERP mandó un dato malo» de «algo se rompió». Pero en Flow no puedes crear un tipo de error propio: todo fallo llega al fault path como el mismo $Flow.FaultMessage. Acabamos con una variable de texto errorType que cada rama rellenaba a mano y una Decision que la comparaba; al tercer subflow, alguien escribió «Negocio» en vez de «negocio» y los errores técnicos empezaron a colarse como filas rechazadas. En Apex, el tipo es el compilador quien lo comprueba: un nombre mal escrito no llega ni a guardarse.",
        en: "In the clicks version we wanted the same: to separate «the ERP sent bad data» from «something broke». But in Flow you cannot create an error type of your own: every failure reaches the fault path as the same $Flow.FaultMessage. We ended up with an errorType text variable that each branch filled by hand and a Decision comparing it; by the third subflow someone wrote «Business» instead of «business» and technical errors started slipping through as rejected rows. In Apex the compiler checks the type: a misspelled name cannot even be saved.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿de qué clase tiene que heredar tu excepción y cómo tiene que terminar su nombre? ¿Qué se pasa como segundo argumento al envolver una excepción? ¿Por qué capturar solo RenewalImportException es mejor que capturar Exception?",
        en: "Without looking: which class must your exception inherit from and how must its name end? What goes in as the second argument when wrapping an exception? Why is catching only RenewalImportException better than catching Exception?",
      },
    },
  ],

  quiz: [
    {
      id: "m08-l04-q1",
      kind: "single",
      prompt: { es: "¿Cuál de estas declaraciones compila?", en: "Which of these declarations compiles?" },
      options: [
        { es: "public class RenewalImportException extends Exception {}", en: "public class RenewalImportException extends Exception {}" },
        { es: "public class RenewalImportError extends Exception {}", en: "public class RenewalImportError extends Exception {}" },
        { es: "public class RenewalImportException {}", en: "public class RenewalImportException {}" },
        { es: "public exception RenewalImport {}", en: "public exception RenewalImport {}" },
      ],
      answer: 0,
      explain: {
        es: "Tiene que extender Exception y su nombre tiene que terminar en Exception. RenewalImportError no termina así, y una clase sin extends no es una excepción aunque se llame así.",
        en: "It must extend Exception and its name must end in Exception. RenewalImportError does not end that way, and a class without extends is not an exception even if it is named like one.",
      },
      tags: ["find-error"],
    },
    {
      id: "m08-l04-q2",
      kind: "single",
      prompt: { es: "¿Qué imprime este código?", en: "What does this code print?" },
      code: {
        es: `try {
    try {
        Decimal d = Decimal.valueOf('doce mil');
    } catch (TypeException e) {
        throw new RenewalImportException('Importe no numérico', e);
    }
} catch (RenewalImportException e) {
    System.debug(e.getMessage() + ' · ' + e.getCause().getTypeName());
}`,
        en: `try {
    try {
        Decimal d = Decimal.valueOf('twelve thousand');
    } catch (TypeException e) {
        throw new RenewalImportException('Non-numeric amount', e);
    }
} catch (RenewalImportException e) {
    System.debug(e.getMessage() + ' · ' + e.getCause().getTypeName());
}`,
      },
      options: [
        { es: "Importe no numérico · System.TypeException", en: "Non-numeric amount · System.TypeException" },
        { es: "Importe no numérico · RenewalImportException", en: "Non-numeric amount · RenewalImportException" },
        { es: "Nada: la TypeException para la ejecución", en: "Nothing: the TypeException stops execution" },
        { es: "Importe no numérico · null", en: "Non-numeric amount · null" },
      ],
      answer: 0,
      explain: {
        es: "El catch interior traduce la TypeException a tu excepción y la guarda como causa. El exterior lee tu mensaje y, con getCause(), el tipo de la original.",
        en: "The inner catch translates the TypeException into your exception and keeps it as the cause. The outer one reads your message and, with getCause(), the original's type.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m08-l04-q3",
      kind: "multi",
      prompt: {
        es: "Sin escribir nada dentro de la clase, ¿qué líneas compilan?",
        en: "Without writing anything inside the class, which lines compile?",
      },
      options: [
        { es: "new RenewalImportException()", en: "new RenewalImportException()" },
        { es: "new RenewalImportException('Cuenta desconocida')", en: "new RenewalImportException('Unknown account')" },
        { es: "new RenewalImportException('Importe no numérico', e)", en: "new RenewalImportException('Non-numeric amount', e)" },
        { es: "new RenewalImportException(404)", en: "new RenewalImportException(404)" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Los cuatro constructores de serie son: vacío, con mensaje, con la excepción original, y con mensaje y original. Uno que reciba un Integer tendrías que escribirlo tú.",
        en: "The four built-in constructors are: empty, with a message, with the original exception, and with message and original. One taking an Integer you would have to write yourself.",
      },
    },
    {
      id: "m08-l04-q4",
      kind: "single",
      prompt: {
        es: "El bucle de importación solo tiene catch (RenewalImportException e). Una fila provoca una NullPointerException por un bug. ¿Qué pasa?",
        en: "The import loop only has catch (RenewalImportException e). A row causes a NullPointerException because of a bug. What happens?",
      },
      options: [
        { es: "No la captura: la importación se para y el bug queda a la vista", en: "It does not catch it: the import stops and the bug is in plain sight" },
        { es: "La captura como fila rechazada y sigue", en: "It catches it as a rejected row and carries on" },
        { es: "Se convierte en RenewalImportException automáticamente", en: "It turns into a RenewalImportException automatically" },
        { es: "No compila", en: "It does not compile" },
      ],
      answer: 0,
      explain: {
        es: "Eso es justo lo que quieres: los errores del negocio se tratan y los bugs no se esconden. Con catch (Exception e), ese bug habría pasado por una fila rechazada más.",
        en: "That is exactly what you want: business errors are handled and bugs are not hidden. With catch (Exception e), that bug would have passed for one more rejected row.",
      },
    },
    {
      id: "m08-l04-q5",
      kind: "text",
      prompt: {
        es: "Escribe la declaración completa de una excepción llamada ErpSyncException.",
        en: "Write the full declaration of an exception called ErpSyncException.",
      },
      accept: ["(public\\s+)?class\\s+erpsyncexception\\s+extends\\s+exception\\s*\\{\\s*\\}"],
      placeholder: { es: "public class …", en: "public class …" },
      explain: {
        es: "public class ErpSyncException extends Exception {} — una línea, y todo lo demás lo hereda.",
        en: "public class ErpSyncException extends Exception {} — one line, and it inherits everything else.",
      },
      tags: ["recall"],
    },
    {
      id: "m08-l04-q6",
      kind: "single",
      prompt: {
        es: "Repaso: TaskReminder extends Notification. ¿Qué consigue TaskReminder con ese extends?",
        en: "Review: TaskReminder extends Notification. What does TaskReminder get from that extends?",
      },
      options: [
        { es: "Hereda los atributos y métodos de Notification sin reescribirlos", en: "It inherits Notification's attributes and methods without rewriting them" },
        { es: "Una copia independiente que no se puede usar como Notification", en: "An independent copy that cannot be used as a Notification" },
        { es: "Acceso a los métodos private de Notification", en: "Access to Notification's private methods" },
        { es: "Nada: extends solo sirve para excepciones", en: "Nothing: extends is only for exceptions" },
      ],
      answer: 0,
      explain: {
        es: "Por eso RenewalImportException no necesita código: al extender Exception hereda getMessage(), getCause() y compañía.",
        en: "That is why RenewalImportException needs no code: by extending Exception it inherits getMessage(), getCause() and the rest.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M5 L7", en: "Review · M5 L7" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 4 DE 6 · El ERP ahora manda filas con su código de cuenta, y hay un tercer motivo de rechazo: un código que Northwind no conoce. En vez de sumar otro catch al bucle, dale a los errores de la importación un nombre propio, RenewalImportException, y que el bucle capture solo ese.",
      en: "TASK 4 OF 6 · The ERP now sends rows with their account code, and there is a third reason for rejection: a code Northwind does not know. Instead of adding one more catch to the loop, give the import's errors a name of their own, RenewalImportException, and have the loop catch only that.",
    },
    brief: [
      {
        es: "Declara public class RenewalImportException extends Exception {}.",
        en: "Declare public class RenewalImportException extends Exception {}.",
      },
      {
        es: "parseAmount lanza RenewalImportException en lugar de IllegalArgumentException (vacío y no positivo). La TypeException de Decimal.valueOf se captura ahí mismo y se envuelve: el segundo argumento es la original.",
        en: "parseAmount throws RenewalImportException instead of IllegalArgumentException (empty and non-positive). The TypeException from Decimal.valueOf is caught right there and wrapped: the second argument is the original.",
      },
      {
        es: "Añade a RenewalRow public static String findAccountName(String erpCode, Map<String, String> accountNamesByErp): si el mapa no contiene erpCode, lanza RenewalImportException con un mensaje que incluya el código; si lo contiene, devuelve el nombre.",
        en: "Add to RenewalRow public static String findAccountName(String erpCode, Map<String, String> accountNamesByErp): if the map does not contain erpCode, throw RenewalImportException with a message including the code; if it does, return the name.",
      },
      {
        es: "El bucle llama a findAccountName y a parseAmount dentro del try, y tiene un único catch: RenewalImportException.",
        en: "The loop calls findAccountName and parseAmount inside the try, and has a single catch: RenewalImportException.",
      },
    ],
    starter: {
      es: `// CASO: el puente nocturno con el ERP de Northwind
// Ya resuelto (tareas 1-3): cada fila tiene su try, y parseAmount lanza cuando el importe no cuadra.
// Tarea 4 de 6: los errores del negocio, con nombre propio.

// 1. Las clases (en tu org, cada una en su propio archivo)
public class RenewalRow {
    public static Decimal parseAmount(String raw) {
        if (String.isBlank(raw)) {
            throw new IllegalArgumentException('Importe vacío');
        }
        Decimal amount = Decimal.valueOf(raw);
        if (amount <= 0) {
            throw new IllegalArgumentException('Importe no positivo: ' + raw);
        }
        return amount;
    }
}

// 2. La importación (como en Execute Anonymous)
Map<String, String> accountNamesByErp = new Map<String, String>{ 'ERP-100' => 'Acme', 'ERP-200' => 'Globex' };
Map<String, String> amountsByErp = new Map<String, String>{ 'ERP-100' => '12500.00', 'ERP-200' => 'doce mil', 'ERP-999' => '4100' };
Integer imported = 0;
Integer rejected = 0;

for (String erpCode : amountsByErp.keySet()) {
    try {
        String accountName = accountNamesByErp.get(erpCode);
        Decimal amount = RenewalRow.parseAmount(amountsByErp.get(erpCode));
        imported++;
        System.debug('Lista para ' + accountName + ': ' + amount);
    } catch (IllegalArgumentException e) {
        rejected++;
        System.debug(erpCode + ' rechazado: ' + e.getMessage());
    } catch (TypeException e) {
        rejected++;
        System.debug(erpCode + ' rechazado: no es un número');
    }
}

System.debug(imported + ' importados · ' + rejected + ' rechazados');
`,
      en: `// CASE: Northwind's nightly bridge with the ERP
// Already solved (tasks 1-3): each row has its try, and parseAmount throws when the amount is off.
// Task 4 of 6: business errors, with their own name.

// 1. The classes (in your org, each in its own file)
public class RenewalRow {
    public static Decimal parseAmount(String raw) {
        if (String.isBlank(raw)) {
            throw new IllegalArgumentException('Empty amount');
        }
        Decimal amount = Decimal.valueOf(raw);
        if (amount <= 0) {
            throw new IllegalArgumentException('Non-positive amount: ' + raw);
        }
        return amount;
    }
}

// 2. The import (as in Execute Anonymous)
Map<String, String> accountNamesByErp = new Map<String, String>{ 'ERP-100' => 'Acme', 'ERP-200' => 'Globex' };
Map<String, String> amountsByErp = new Map<String, String>{ 'ERP-100' => '12500.00', 'ERP-200' => 'twelve thousand', 'ERP-999' => '4100' };
Integer imported = 0;
Integer rejected = 0;

for (String erpCode : amountsByErp.keySet()) {
    try {
        String accountName = accountNamesByErp.get(erpCode);
        Decimal amount = RenewalRow.parseAmount(amountsByErp.get(erpCode));
        imported++;
        System.debug('Ready for ' + accountName + ': ' + amount);
    } catch (IllegalArgumentException e) {
        rejected++;
        System.debug(erpCode + ' rejected: ' + e.getMessage());
    } catch (TypeException e) {
        rejected++;
        System.debug(erpCode + ' rejected: not a number');
    }
}

System.debug(imported + ' imported · ' + rejected + ' rejected');
`,
    },
    hints: [
      {
        es: "Yo empezaría por la picklist: primero crea el valor (la clase RenewalImportException, una línea) y después cambia cada throw para que use ese valor en lugar de «Otro».",
        en: "I would start with the picklist: first create the value (the RenewalImportException class, one line) and then change each throw to use that value instead of «Other».",
      },
      {
        es: "Lo que me ayudó: el 'doce mil' lo lanza Decimal.valueOf, no tú. Rodéalo con un try dentro de parseAmount, y en catch (TypeException e) lanza tu excepción pasando e como segundo argumento. ERP-999 no está en accountNamesByErp: eso lo detecta containsKey.",
        en: "What helped me: the 'twelve thousand' is thrown by Decimal.valueOf, not by you. Wrap it in a try inside parseAmount, and in catch (TypeException e) throw your exception passing e as the second argument. ERP-999 is not in accountNamesByErp: containsKey detects that.",
      },
      {
        es: "Te dejo el esquema: try { amount = Decimal.valueOf(raw); } catch (TypeException e) { throw new RenewalImportException('…' + raw, e); } · if (!accountNamesByErp.containsKey(erpCode)) { throw new RenewalImportException('Cuenta desconocida: ' + erpCode); } · en el bucle, un solo catch (RenewalImportException e).",
        en: "Here is the outline: try { amount = Decimal.valueOf(raw); } catch (TypeException e) { throw new RenewalImportException('…' + raw, e); } · if (!accountNamesByErp.containsKey(erpCode)) { throw new RenewalImportException('Unknown account: ' + erpCode); } · in the loop, a single catch (RenewalImportException e).",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m08-l04-c1",
        label: { es: "Se declara RenewalImportException extends Exception", en: "RenewalImportException extends Exception is declared" },
        rule: { op: "match", pattern: "class\\s+RenewalImportException\\s+extends\\s+Exception\\b" },
        onFail: {
          es: "Declara la excepción: public class RenewalImportException extends Exception {}",
          en: "Declare the exception: public class RenewalImportException extends Exception {}",
        },
        otter: {
          es: "Primero crea el valor de la picklist: public class RenewalImportException extends Exception {}. Una línea, y hereda todo lo demás.",
          en: "First create the picklist value: public class RenewalImportException extends Exception {}. One line, and it inherits everything else.",
        },
      },
      {
        id: "m08-l04-c2",
        label: { es: "Todos los rechazos lanzan RenewalImportException", en: "Every rejection throws RenewalImportException" },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "throw\\s+new\\s+RenewalImportException\\s*\\(", min: 4 },
            { op: "absent", pattern: "IllegalArgumentException" },
          ],
        },
        onFail: {
          es: "Hacen falta cuatro throw new RenewalImportException: vacío, no numérico, no positivo y cuenta desconocida. Y ya no debe quedar ninguna IllegalArgumentException.",
          en: "Four throw new RenewalImportException are needed: empty, non-numeric, non-positive and unknown account. And no IllegalArgumentException should remain.",
        },
        otter: {
          es: "Cuatro motivos de rechazo, un solo valor: vacío, no numérico, no positivo y cuenta desconocida lanzan RenewalImportException. Del «Otro» (IllegalArgumentException) no debe quedar nada.",
          en: "Four rejection reasons, one value: empty, non-numeric, non-positive and unknown account throw RenewalImportException. Nothing should remain of the «Other» (IllegalArgumentException).",
        },
      },
      {
        id: "m08-l04-c3",
        label: { es: "La TypeException se envuelve, sin perder la original", en: "The TypeException is wrapped, without losing the original" },
        rule: {
          op: "match",
          pattern: "catch\\s*\\(\\s*(System\\.)?TypeException\\s+(\\w+)\\s*\\)\\s*\\{[^}]*throw\\s+new\\s+RenewalImportException\\s*\\([^;]*,\\s*\\w+\\s*\\)",
        },
        onFail: {
          es: "Dentro de parseAmount: try { amount = Decimal.valueOf(raw); } catch (TypeException e) { throw new RenewalImportException('…', e); } — la e como segundo argumento.",
          en: "Inside parseAmount: try { amount = Decimal.valueOf(raw); } catch (TypeException e) { throw new RenewalImportException('…', e); } — e as the second argument.",
        },
        otter: {
          es: "El 'doce mil' lo lanza Decimal.valueOf. Atrápalo ahí mismo y tradúcelo: catch (TypeException e) { throw new RenewalImportException('…', e); }. Esa e del final guarda la original por si alguien la necesita.",
          en: "The 'twelve thousand' is thrown by Decimal.valueOf. Catch it right there and translate it: catch (TypeException e) { throw new RenewalImportException('…', e); }. That final e keeps the original in case someone needs it.",
        },
      },
      {
        id: "m08-l04-c4",
        label: { es: "findAccountName lanza si el código no existe", en: "findAccountName throws when the code does not exist" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "static\\s+String\\s+findAccountName\\s*\\(" },
            { op: "match", pattern: "\\.containsKey\\s*\\(\\s*erpCode\\s*\\)" },
            { op: "match", pattern: "throw\\s+new\\s+RenewalImportException\\s*\\([^;]*\\+\\s*erpCode" },
          ],
        },
        onFail: {
          es: "Añade public static String findAccountName(String erpCode, Map<String, String> accountNamesByErp): si !accountNamesByErp.containsKey(erpCode), throw new RenewalImportException('…' + erpCode).",
          en: "Add public static String findAccountName(String erpCode, Map<String, String> accountNamesByErp): if !accountNamesByErp.containsKey(erpCode), throw new RenewalImportException('…' + erpCode).",
        },
        otter: {
          es: "ERP-999 no está en el mapa, y hoy get() te devuelve null sin avisar. findAccountName lo comprueba con containsKey(erpCode) y, si falta, lanza tu excepción con el código en el mensaje.",
          en: "ERP-999 is not in the map, and today get() quietly gives you null. findAccountName checks it with containsKey(erpCode) and, if missing, throws your exception with the code in the message.",
        },
      },
      {
        id: "m08-l04-c5",
        label: { es: "El bucle usa findAccountName y captura solo RenewalImportException", en: "The loop uses findAccountName and catches only RenewalImportException" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "RenewalRow\\.findAccountName\\s*\\(" },
            { op: "match", pattern: "catch\\s*\\(\\s*RenewalImportException\\s+\\w+\\s*\\)" },
            { op: "count", pattern: "catch\\s*\\(\\s*(System\\.)?TypeException\\b", max: 1 },
            { op: "absent", pattern: "catch\\s*\\(\\s*(System\\.)?Exception\\s+\\w+\\s*\\)" },
          ],
        },
        onFail: {
          es: "En el bucle: String accountName = RenewalRow.findAccountName(erpCode, accountNamesByErp); y un único catch (RenewalImportException e). La TypeException ya la traduce parseAmount.",
          en: "In the loop: String accountName = RenewalRow.findAccountName(erpCode, accountNamesByErp); and a single catch (RenewalImportException e). parseAmount already translates the TypeException.",
        },
        otter: {
          es: "El bucle solo necesita saber «fila rechazada por el negocio»: llama a RenewalRow.findAccountName y deja un único catch (RenewalImportException e). Nada de catch (Exception e): los bugs de verdad tienen que verse.",
          en: "The loop only needs to know «row rejected by the business»: call RenewalRow.findAccountName and keep a single catch (RenewalImportException e). No catch (Exception e): real bugs must show.",
        },
      },
    ],
    rubric: [
      {
        es: "Si el informe tuviera que separar «cuenta desconocida» de «importe malo», ¿crearías dos excepciones hijas de RenewalImportException o bastaría con el mensaje?",
        en: "If the report had to separate «unknown account» from «bad amount», would you create two exceptions extending RenewalImportException, or would the message be enough?",
      },
      {
        es: "¿Qué pasaría si parseAmount envolviera la TypeException sin pasar e como segundo argumento? ¿Qué perderías al depurar?",
        en: "What would happen if parseAmount wrapped the TypeException without passing e as the second argument? What would you lose when debugging?",
      },
    ],
    voice: "otter",
    outro: {
      es: "Tus errores del negocio ya tienen nombre y los bugs de verdad ya no se esconden. En la tarea 5 cambiamos de lado: un trigger que rechaza renovaciones duplicadas… sin tumbar el resto del lote.",
      en: "Your business errors now have a name and real bugs no longer hide. In task 5 we switch sides: a trigger that rejects duplicate renewals… without bringing down the rest of the batch.",
    },
  },
};
