import type { Lesson } from "@/lib/types";

export const l05Static: Lesson = {
  id: "m05-l05",
  slug: "static",
  n: 5,
  kind: "lesson",
  minutes: 20,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 4", en: "Remember? · Review of lesson 4" },
    prompt: { es: "En un constructor con un parámetro level, ¿qué hace la línea level = level; sin this?", en: "In a constructor with a level parameter, what does the line level = level; without this do?" },
    options: [
      { es: "Asigna el atributo", en: "It assigns the attribute" },
      { es: "Asigna el parámetro a sí mismo y el atributo queda en null", en: "It assigns the parameter to itself and the attribute stays null" },
      { es: "No compila", en: "It does not compile" },
    ],
    answer: 1,
    explain: { es: "Sin this gana el parámetro, y el atributo queda vacío sin ningún aviso. this.level es tu $Record.level.", en: "Without this the parameter wins, and the attribute stays empty with no warning. this.level is your $Record.level." },
  },
  title: { es: "Static vs Non-Static", en: "Static vs Non-Static" },
  summary: {
    es: "Lo que pertenece a cada instancia frente a lo que pertenece a la clase entera. Llevas usando métodos estáticos desde el Módulo 1 sin saberlo.",
    en: "What belongs to each instance versus what belongs to the whole class. You have been using static methods since Module 1 without knowing it.",
  },
  analogy: {
    es: "Un campo de cada registro frente a un Custom Setting de toda la org",
    en: "A field on each record versus an org-wide Custom Setting",
  },
  objectives: [
    {
      es: "Distinguir un miembro de instancia de uno estático y llamar a cada uno correctamente.",
      en: "Tell an instance member from a static one and call each one correctly.",
    },
    {
      es: "Escribir una clase de utilidades con constantes y métodos estáticos.",
      en: "Write a utility class with constants and static methods.",
    },
    {
      es: "Saber cuánto vive una variable estática en Salesforce.",
      en: "Know how long a static variable lives in Salesforce.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Todo lo que has escrito en este módulo pertenecía a una instancia: cada WorkTicket tenía sus horas, cada SupportPlan su nivel. Pero hay cosas que no son de ningún registro concreto: el tipo de IVA, una función que calcula un precio. Esas pertenecen a la clase, y se marcan con static.",
        en: "Everything you have written in this module belonged to an instance: each WorkTicket had its hours, each SupportPlan its level. But some things belong to no specific record: the VAT rate, a function that works out a price. Those belong to the class, and they are marked static.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Así lo separo yo: un campo guarda un valor distinto en cada registro. Un Custom Setting de organización, o un registro de Custom Metadata, guarda un único valor para toda la org, que cualquiera puede consultar sin abrir ningún registro. Instancia = campo del registro. Static = ese valor compartido.",
        en: "This is how I tell them apart: a field holds a different value in each record. An org-wide Custom Setting, or a Custom Metadata record, holds a single value for the whole org, which anyone can read without opening any record. Instance = a record's field. Static = that shared value.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "Ya los estabas usando", en: "You were already using them" },
    },
    {
      type: "p",
      text: {
        es: "Date.today(), String.isBlank(name), Integer.valueOf('42'): en todos escribes el nombre de una clase, un punto y el método, sin ningún new delante. Son métodos estáticos. En cambio name.trim() o opp.clone() se llaman sobre una instancia concreta: son métodos de instancia.",
        en: "Date.today(), String.isBlank(name), Integer.valueOf('42'): in all of them you write a class name, a dot and the method, with no new in front. They are static methods. By contrast name.trim() or opp.clone() are called on a specific instance: they are instance methods.",
      },
    },
    {
      type: "diagram",
      id: "m05-static",
      caption: {
        es: "Cada instancia tiene sus atributos; la parte estática existe una sola vez, en la clase, y la comparten todas.",
        en: "Each instance has its own attributes; the static part exists once, on the class, and they all share it.",
      },
    },
    {
      type: "h",
      text: { es: "Una clase de utilidades", en: "A utility class" },
    },
    {
      type: "code",
      code: {
        es: `public class PricingUtils {
    public static final Decimal VAT_RATE = 0.21;

    public static Decimal withVat(Decimal amount) {
        return (amount ?? 0) * (1 + VAT_RATE);
    }
}

// Se usa con el nombre de la clase, sin new
Decimal total = PricingUtils.withVat(1000);   // 1210`,
        en: `public class PricingUtils {
    public static final Decimal VAT_RATE = 0.21;

    public static Decimal withVat(Decimal amount) {
        return (amount ?? 0) * (1 + VAT_RATE);
    }
}

// Used through the class name, with no new
Decimal total = PricingUtils.withVat(1000);   // 1210`,
      },
      caption: {
        es: "static final es la constante de toda la clase: un único valor, compartido y que no se puede cambiar.",
        en: "static final is the class-wide constant: a single value, shared, and unchangeable.",
      },
    },
    {
      type: "p",
      text: {
        es: "Un método estático no trabaja sobre ninguna instancia, así que no puede leer atributos de instancia ni usar this: no hay «registro actual». Todo lo que necesita le llega por parámetro. Al revés sí funciona: un método de instancia puede usar las constantes y métodos estáticos de su clase.",
        en: "A static method works on no instance, so it cannot read instance attributes or use this: there is no “current record”. Everything it needs arrives as a parameter. The other way round does work: an instance method can use its class's static constants and methods.",
      },
    },
    {
      type: "table",
      head: [
        { es: "", en: "" },
        { es: "De instancia", en: "Instance" },
        { es: "Estático", en: "Static" },
      ],
      rows: [
        [
          { es: "Pertenece a…", en: "Belongs to…" },
          { es: "cada objeto", en: "each object" },
          { es: "la clase", en: "the class" },
        ],
        [
          { es: "Se llama…", en: "Called as…" },
          { es: "ticket.cost(95)", en: "ticket.cost(95)" },
          { es: "PricingUtils.withVat(1000)", en: "PricingUtils.withVat(1000)" },
        ],
        [
          { es: "¿Hace falta new?", en: "Needs new?" },
          { es: "Sí", en: "Yes" },
          { es: "No", en: "No" },
        ],
        [
          { es: "¿Puede usar this?", en: "Can it use this?" },
          { es: "Sí", en: "Yes" },
          { es: "No", en: "No" },
        ],
      ],
    },
    {
      type: "h",
      text: { es: "Cuánto vive una variable estática", en: "How long a static variable lives" },
    },
    {
      type: "p",
      text: {
        es: "Una variable estática (static, sin final) se puede cambiar y todo el código la ve con el mismo valor… pero solo durante una [[transaccion|transacción]]. Cuando termina el guardado que la creó, desaparece; el siguiente usuario empieza de cero. Eso la hace perfecta para recordar algo mientras dura un guardado —por ejemplo, «este trigger ya se ha ejecutado»— y es justo lo que usarás en el Módulo 7.",
        en: "A static variable (static, not final) can be changed and all code sees it with the same value… but only for one [[transaccion|transaction]]. When the save that created it ends, it disappears; the next user starts from scratch. That makes it perfect for remembering something during one save — for example, “this trigger has already run” — and it is exactly what you will use in Module 7.",
      },
    },
    {
      type: "h",
      text: { es: "¿Constante en el código o configuración en la org?", en: "A constant in code or configuration in the org?" },
    },
    {
      type: "p",
      text: {
        es: "static final VAT_RATE = 0.21 es perfecto para algo que nunca cambia sin que cambie también el código. Pero si el valor lo decide el negocio —el IVA de otro país, el descuento máximo del trimestre—, meterlo en una constante significa que cada cambio necesita un desarrollador y un despliegue. Para eso la plataforma tiene Custom Metadata Types y Custom Settings: el valor vive en la org, lo cambia un Admin desde Setup y el código lo lee. La regla: static final para lo que es parte de la lógica; metadatos para lo que es parte del negocio.",
        en: "static final VAT_RATE = 0.21 is perfect for something that never changes without the code changing too. But if the business decides the value — another country's VAT, the quarter's maximum discount — putting it in a constant means every change needs a developer and a deployment. That is what Custom Metadata Types and Custom Settings are for: the value lives in the org, an Admin changes it from Setup and the code reads it. The rule: static final for what is part of the logic; metadata for what is part of the business.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Tú mismo pedirías esto", en: "You would ask for this yourself" },
      text: {
        es: "Si un desarrollador te dice «para cambiar el descuento máximo hay que desplegar», como Admin tienes derecho a quejarte; yo lo hice. Lo profesional es que ese valor esté en un registro de Custom Metadata que tú puedes editar, y que la clase lo lea. Saber distinguir qué va en una constante y qué va en configuración es lo que hace que el código no dependa de ti para cada cambio pequeño… ni tú de él.",
        en: "If a developer tells you «changing the maximum discount needs a deployment», as an Admin you have every right to complain; I did. The professional way is for that value to live in a Custom Metadata record you can edit, and for the class to read it. Knowing what goes in a constant and what goes in configuration is what keeps the code from depending on you for every small change… and you on it.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Static y los triggers del Módulo 7", en: "Static and Module 7's triggers" },
      text: {
        es: "Esto lo agradecerás más adelante: la guardia static Set<Id> que verás en el Módulo 7 funciona precisamente por lo que ves en esta lección. Una variable static es compartida por todo el código de la transacción, así que la segunda pasada del trigger ve los Ids que guardó la primera. Una variable de instancia no serviría: cada new CaseTriggerHandler() empieza con la suya, vacía.",
        en: "You will be grateful for this later: the static Set<Id> guard you will see in Module 7 works precisely because of what you see in this lesson. A static variable is shared by all the code in the transaction, so the trigger's second pass sees the Ids the first one stored. An instance variable would not do: each new CaseTriggerHandler() starts with its own, empty.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "El libro no se detiene en static, pero es la diferencia más importante con Java: allí una variable estática vive mientras dura el programa y la comparten todos los usuarios del servidor. En Apex vive una sola transacción y nunca se comparte entre usuarios. Si quieres un valor que persista, eso es un Custom Setting, Custom Metadata o un registro, no una variable static.",
        en: "The book does not dwell on static, but it is the most important difference from Java: there a static variable lives as long as the program and is shared by every user on the server. In Apex it lives for one transaction and is never shared between users. If you want a value that persists, that is a Custom Setting, Custom Metadata or a record, not a static variable.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿por qué Date.today() no necesita new y name.trim() sí necesita un name? ¿Qué no puede usar nunca un método estático?",
        en: "Without looking up: why does Date.today() need no new while name.trim() does need a name? What can a static method never use?",
      },
    },
  ],

  quiz: [
    {
      id: "m05-l05-q1",
      kind: "multi",
      prompt: {
        es: "¿Cuáles de estas llamadas son a métodos estáticos?",
        en: "Which of these calls are to static methods?",
      },
      options: [
        { es: "Date.today()", en: "Date.today()" },
        { es: "accountName.toUpperCase()", en: "accountName.toUpperCase()" },
        { es: "String.isBlank(accountName)", en: "String.isBlank(accountName)" },
        { es: "opp.clone()", en: "opp.clone()" },
      ],
      answers: [0, 2],
      explain: {
        es: "Nombre de clase + punto + método: estático. Variable + punto + método: de instancia, trabaja sobre ese valor concreto.",
        en: "Class name + dot + method: static. Variable + dot + method: instance, it works on that specific value.",
      },
      tags: ["spaced", "interleaving"],
      from: { es: "Repaso · M1 L3", en: "Review · M1 L3" },
    },
    {
      id: "m05-l05-q2",
      kind: "single",
      prompt: {
        es: "Este método no compila. ¿Por qué?",
        en: "This method does not compile. Why?",
      },
      code: {
        es: `public class WorkTicket {
    public Decimal hoursSpent;

    public static Decimal doubleHours() {
        return hoursSpent * 2;
    }
}`,
        en: `public class WorkTicket {
    public Decimal hoursSpent;

    public static Decimal doubleHours() {
        return hoursSpent * 2;
    }
}`,
      },
      options: [
        {
          es: "Un método estático no puede leer un atributo de instancia: ¿de qué ticket serían las horas?",
          en: "A static method cannot read an instance attribute: whose hours would they be?",
        },
        {
          es: "Los métodos estáticos no pueden devolver Decimal.",
          en: "Static methods cannot return Decimal.",
        },
        {
          es: "Falta this delante de hoursSpent.",
          en: "this is missing before hoursSpent.",
        },
      ],
      answer: 0,
      explain: {
        es: "No hay instancia actual, así que no hay hoursSpent que leer. Y this tampoco existe ahí. O el método deja de ser static, o recibe las horas por parámetro.",
        en: "There is no current instance, so there is no hoursSpent to read. And this does not exist there either. Either the method stops being static, or it receives the hours as a parameter.",
      },
      tags: ["find-error"],
    },
    {
      id: "m05-l05-q3",
      kind: "single",
      prompt: {
        es: "¿Cómo se llama correctamente al método withVat de la clase PricingUtils?",
        en: "How do you correctly call the withVat method of the PricingUtils class?",
      },
      options: [
        { es: "PricingUtils.withVat(500)", en: "PricingUtils.withVat(500)" },
        { es: "new PricingUtils().withVat(500)", en: "new PricingUtils().withVat(500)" },
        { es: "withVat.PricingUtils(500)", en: "withVat.PricingUtils(500)" },
      ],
      answer: 0,
      explain: {
        es: "Los métodos estáticos se llaman sobre la clase. Crear una instancia para eso sobra, y Apex ni siquiera deja llamar a un estático a través de una instancia.",
        en: "Static methods are called on the class. Creating an instance for that is pointless, and Apex does not even allow calling a static through an instance.",
      },
      tags: ["recall"],
    },
    {
      id: "m05-l05-q4",
      kind: "single",
      prompt: {
        es: "Una variable static Integer counter se incrementa en cada guardado. Dos usuarios guardan un registro a la vez. ¿Qué valor ve cada uno al terminar su guardado?",
        en: "A static Integer counter variable is incremented on each save. Two users save a record at the same time. What value does each one see at the end of their save?",
      },
      options: [
        {
          es: "1 cada uno: cada transacción tiene su propia copia, que empieza de cero.",
          en: "1 each: every transaction has its own copy, starting from zero.",
        },
        {
          es: "1 el primero y 2 el segundo.",
          en: "1 for the first and 2 for the second.",
        },
        {
          es: "El total de guardados desde que se desplegó la clase.",
          en: "The total number of saves since the class was deployed.",
        },
      ],
      answer: 0,
      explain: {
        es: "En Apex, lo estático vive una transacción y no se comparte entre usuarios. Para contar entre guardados necesitarías un registro o un Custom Setting.",
        en: "In Apex, static lives for one transaction and is not shared between users. To count across saves you would need a record or a Custom Setting.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m05-l05-q5",
      kind: "text",
      prompt: {
        es: "¿Qué dos palabras clave declaran una constante de clase, compartida y que no se puede cambiar? (en orden)",
        en: "Which two keywords declare a class constant, shared and unchangeable? (in order)",
      },
      accept: ["static\\s+final", "static final"],
      placeholder: { es: "dos palabras", en: "two words" },
      explain: {
        es: "static final: static la hace de la clase, final impide reasignarla. Como en el Módulo 1, su nombre va en MAYÚSCULAS.",
        en: "static final: static makes it belong to the class, final stops it being reassigned. As in Module 1, its name goes in UPPER_SNAKE_CASE.",
      },
      tags: ["recall", "spaced"],
      from: { es: "Repaso · M1 L1", en: "Review · M1 L1" },
    },
    {
      id: "m05-l05-q6",
      kind: "single",
      prompt: {
        es: "¿Qué debería ser static en una clase Invoice?",
        en: "What should be static in an Invoice class?",
      },
      options: [
        {
          es: "El número de días de plazo de pago que usa toda la empresa.",
          en: "The number of payment-term days the whole company uses.",
        },
        { es: "El importe de cada factura.", en: "Each invoice's amount." },
        { es: "La fecha de emisión de cada factura.", en: "Each invoice's issue date." },
      ],
      answer: 0,
      explain: {
        es: "Lo que es igual para todas las facturas es de la clase; lo que cambia de una factura a otra es de cada instancia.",
        en: "Whatever is the same for every invoice belongs to the class; whatever changes from one invoice to another belongs to each instance.",
      },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 5 DE 12 · Los precios de las renovaciones tienen que calcularse igual en todo el motor. Finanzas quiere que todo el código de la org calcule los precios igual. Escribe una clase de utilidades con el IVA como constante y dos métodos estáticos, y úsala sin crear ninguna instancia.",
      en: "TASK 5 OF 12 · Renewal prices must be computed the same way across the whole engine. Finance wants all code in the org to work out prices the same way. Write a utility class with VAT as a constant and two static methods, and use it without creating any instance.",
    },
    brief: [
      {
        es: "Clase pública PricingUtils con una constante pública VAT_RATE de 0.21, compartida por toda la clase y que no se pueda cambiar.",
        en: "Public class PricingUtils with a public constant VAT_RATE of 0.21, shared by the whole class and unchangeable.",
      },
      {
        es: "Método estático withVat(Decimal amount) que devuelva el importe con IVA. Un importe vacío cuenta como 0.",
        en: "Static method withVat(Decimal amount) that returns the amount with VAT. An empty amount counts as 0.",
      },
      {
        es: "Método estático applyDiscount(Decimal amount, Decimal percent) que devuelva el importe con el descuento aplicado (por ejemplo, 10 significa un 10 %).",
        en: "Static method applyDiscount(Decimal amount, Decimal percent) that returns the amount with the discount applied (for example, 10 means 10%).",
      },
      {
        es: "Debajo: calcula finalPrice aplicando primero un 10 % de descuento a 2000 y después el IVA. Sin ningún new PricingUtils.",
        en: "Below: work out finalPrice by first applying a 10% discount to 2000 and then VAT. Without any new PricingUtils.",
      },
    ],
    starter: {
      es: `// CASO: el motor comercial de Northwind Trading
// Tarea 5 de 12: los precios, en un solo sitio y sin instancias.

// 1. Clase PricingUtils: constante y dos métodos estáticos.


// 2. Uso: finalPrice = 2000 con un 10 % de descuento y después IVA.
`,
      en: `// CASE: Northwind Trading's commercial engine
// Task 5 of 12: prices, in one place and with no instances.

// 1. PricingUtils class: a constant and two static methods.


// 2. Usage: finalPrice = 2000 with a 10% discount and then VAT.
`,
    },
    hints: [
      {
        es: "Yo lo pensaría como un Custom Setting: tres miembros y los tres llevan static. La constante lleva además final. Ninguno usa atributos de instancia: todo les llega por parámetro.",
        en: "I would think of it as a Custom Setting: three members and all three are static. The constant is also final. None uses instance attributes: everything reaches them as a parameter.",
      },
      {
        es: "Lo que me ayudó: IVA, (amount ?? 0) * (1 + VAT_RATE). Descuento, amount * (1 - percent / 100). Para encadenar, pasa el resultado de uno como argumento del otro, como anidar funciones en una fórmula.",
        en: "What helped me: VAT, (amount ?? 0) * (1 + VAT_RATE). Discount, amount * (1 - percent / 100). To chain them, pass one's result as the other's argument, like nesting functions in a formula.",
      },
      {
        es: "Te dejo el esquema: public static final Decimal VAT_RATE = 0.21; public static Decimal withVat(Decimal amount) { … } public static Decimal applyDiscount(Decimal amount, Decimal percent) { … } — Decimal finalPrice = PricingUtils.withVat(PricingUtils.applyDiscount(2000, 10));",
        en: "Here is the outline: public static final Decimal VAT_RATE = 0.21; public static Decimal withVat(Decimal amount) { … } public static Decimal applyDiscount(Decimal amount, Decimal percent) { … } — Decimal finalPrice = PricingUtils.withVat(PricingUtils.applyDiscount(2000, 10));",
      },
    ],
    solution: {
      es: `public class PricingUtils {
    public static final Decimal VAT_RATE = 0.21;

    public static Decimal withVat(Decimal amount) {
        return (amount ?? 0) * (1 + VAT_RATE);
    }

    public static Decimal applyDiscount(Decimal amount, Decimal percent) {
        return (amount ?? 0) * (1 - percent / 100);
    }
}

// Uso
Decimal discounted = PricingUtils.applyDiscount(2000, 10);   // 1800
Decimal finalPrice = PricingUtils.withVat(discounted);        // 2178`,
      en: `public class PricingUtils {
    public static final Decimal VAT_RATE = 0.21;

    public static Decimal withVat(Decimal amount) {
        return (amount ?? 0) * (1 + VAT_RATE);
    }

    public static Decimal applyDiscount(Decimal amount, Decimal percent) {
        return (amount ?? 0) * (1 - percent / 100);
    }
}

// Usage
Decimal discounted = PricingUtils.applyDiscount(2000, 10);   // 1800
Decimal finalPrice = PricingUtils.withVat(discounted);        // 2178`,
    },
    checks: [
      {
        id: "m05-l05-c1",
        label: {
          es: "VAT_RATE es una constante static final de 0.21",
          en: "VAT_RATE is a static final constant of 0.21",
        },
        rule: {
          op: "match",
          pattern: "public\\s+(static\\s+final|final\\s+static)\\s+Decimal\\s+VAT_RATE\\s*=\\s*0?\\.21\\s*;",
        },
        onFail: {
          es: "Compartida y no modificable: public static final Decimal VAT_RATE = 0.21;",
          en: "Shared and unchangeable: public static final Decimal VAT_RATE = 0.21;",
        },
        otter: {
          es: "El IVA es un valor único para toda la org, como un Custom Setting que nadie puede editar: public static final Decimal VAT_RATE = 0.21;",
          en: "VAT is a single value for the whole org, like a Custom Setting nobody can edit: public static final Decimal VAT_RATE = 0.21;",
        },
      },
      {
        id: "m05-l05-c2",
        label: {
          es: "withVat es estático y protege el importe vacío",
          en: "withVat is static and protects against the empty amount",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+static\\s+Decimal\\s+withVat\\s*\\(\\s*Decimal\\s+amount\\s*\\)" },
            { op: "match", pattern: "amount\\s*\\?\\?\\s*0|amount\\s*==\\s*null|amount\\s*!=\\s*null" },
            { op: "match", pattern: "1\\s*\\+\\s*VAT_RATE|VAT_RATE\\s*\\+\\s*1" },
          ],
        },
        onFail: {
          es: "public static Decimal withVat(Decimal amount) { return (amount ?? 0) * (1 + VAT_RATE); } — usando la constante, no un 0.21 escrito a mano.",
          en: "public static Decimal withVat(Decimal amount) { return (amount ?? 0) * (1 + VAT_RATE); } — using the constant, not a hand-typed 0.21.",
        },
        otter: {
          es: "withVat es una utilidad compartida, sin registro detrás: public static Decimal withVat(Decimal amount) { return (amount ?? 0) * (1 + VAT_RATE); }, usando la constante, no un 0.21 escrito a mano.",
          en: "withVat is a shared utility, with no record behind it: public static Decimal withVat(Decimal amount) { return (amount ?? 0) * (1 + VAT_RATE); }, using the constant, not a hand-typed 0.21.",
        },
      },
      {
        id: "m05-l05-c3",
        label: {
          es: "applyDiscount es estático y recibe importe y porcentaje",
          en: "applyDiscount is static and takes amount and percent",
        },
        rule: {
          op: "all",
          of: [
            {
              op: "match",
              pattern: "public\\s+static\\s+Decimal\\s+applyDiscount\\s*\\(\\s*Decimal\\s+amount\\s*,\\s*Decimal\\s+percent\\s*\\)",
            },
            { op: "match", pattern: "percent\\s*/\\s*100" },
          ],
        },
        onFail: {
          es: "public static Decimal applyDiscount(Decimal amount, Decimal percent) — y el 10 % se convierte en fracción con percent / 100.",
          en: "public static Decimal applyDiscount(Decimal amount, Decimal percent) — and 10% becomes a fraction with percent / 100.",
        },
        otter: {
          es: "applyDiscount también es compartido y recibe todo por parámetro: public static Decimal applyDiscount(Decimal amount, Decimal percent), con el 10 % convertido en fracción con percent / 100.",
          en: "applyDiscount is shared too and takes everything as parameters: public static Decimal applyDiscount(Decimal amount, Decimal percent), with the 10% turned into a fraction with percent / 100.",
        },
      },
      {
        id: "m05-l05-c4",
        label: {
          es: "Se usan con el nombre de la clase, sin new",
          en: "They are used through the class name, with no new",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "PricingUtils\\.applyDiscount\\(\\s*2000\\s*,\\s*10\\s*\\)" },
            { op: "match", pattern: "PricingUtils\\.withVat\\(" },
            { op: "absent", pattern: "new\\s+PricingUtils" },
          ],
        },
        onFail: {
          es: "Los estáticos se llaman sobre la clase: PricingUtils.applyDiscount(2000, 10) y PricingUtils.withVat(…). Sin crear instancias.",
          en: "Statics are called on the class: PricingUtils.applyDiscount(2000, 10) and PricingUtils.withVat(…). No instances.",
        },
        otter: {
          es: "Lo compartido se usa sin crear ningún registro, como leer un Custom Setting: PricingUtils.applyDiscount(2000, 10) y PricingUtils.withVat(…), sin new.",
          en: "Shared things are used without creating any record, like reading a Custom Setting: PricingUtils.applyDiscount(2000, 10) and PricingUtils.withVat(…), with no new.",
        },
      },
      {
        id: "m05-l05-c5",
        label: {
          es: "finalPrice aplica el descuento antes del IVA",
          en: "finalPrice applies the discount before VAT",
        },
        rule: {
          op: "any",
          of: [
            {
              op: "match",
              pattern: "Decimal\\s+finalPrice\\s*=\\s*PricingUtils\\.withVat\\(\\s*PricingUtils\\.applyDiscount\\(\\s*2000\\s*,\\s*10\\s*\\)\\s*\\)\\s*;",
            },
            {
              op: "match",
              pattern: "Decimal\\s+(\\w+)\\s*=\\s*PricingUtils\\.applyDiscount\\(\\s*2000\\s*,\\s*10\\s*\\)\\s*;[\\s\\S]*Decimal\\s+finalPrice\\s*=\\s*PricingUtils\\.withVat\\(\\s*\\1\\s*\\)\\s*;",
            },
          ],
        },
        onFail: {
          es: "El orden importa: primero el descuento sobre 2000 y, sobre ese resultado, el IVA. finalPrice debería salir 2178.",
          en: "Order matters: first the discount on 2000 and, on that result, VAT. finalPrice should come out at 2178.",
        },
        otter: {
          es: "El orden importa, como al anidar funciones en una fórmula: primero el descuento sobre 2000 y, sobre ese resultado, el IVA. finalPrice debería salir 2178.",
          en: "Order matters, as when nesting functions in a formula: first the discount on 2000 and, on that result, the VAT. finalPrice should come out as 2178.",
        },
        onPass: {
          es: "Si Finanzas cambia el IVA, se toca una línea y todo el código de la org lo recoge.",
          en: "If Finance changes VAT, one line is touched and all the org's code picks it up.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Por qué es mejor que el IVA viva en PricingUtils que repetido en cada clase que lo necesite?",
        en: "Why is it better for VAT to live in PricingUtils than repeated in every class that needs it?",
      },
    ],
    outro: {
      es: "Ya distingues lo que vive en cada objeto de lo que se comparte con static, como un campo frente a un Custom Setting. En la tarea 6, Marketing financia campañas para empujar las renovaciones, y su presupuesto no se puede saltar desde ningún sitio.",
      en: "You can now tell what lives in each object from what is shared with static, like a field versus a Custom Setting. In task 6, Marketing funds campaigns to push renewals, and their budget cannot be bypassed from anywhere.",
    },
    voice: "otter",
  },
};
