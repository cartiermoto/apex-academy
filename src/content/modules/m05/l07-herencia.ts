import type { Lesson } from "@/lib/types";

export const l07Herencia: Lesson = {
  id: "m05-l07",
  slug: "herencia",
  n: 7,
  kind: "lesson",
  minutes: 22,
  title: { es: "Herencia", en: "Inheritance" },
  summary: {
    es: "Una clase hija recibe todo lo de su clase padre y añade lo suyo. En Apex, además, el padre tiene que dar permiso para ser heredado.",
    en: "A child class receives everything from its parent class and adds its own. In Apex, the parent also has to give permission to be inherited from.",
  },
  analogy: {
    es: "Los campos estándar que todo objeto trae de serie, más los personalizados que añades tú",
    en: "The standard fields every object comes with, plus the custom ones you add",
  },
  objectives: [
    {
      es: "Crear una clase hija con extends a partir de una clase padre marcada virtual.",
      en: "Create a child class with extends from a parent class marked virtual.",
    },
    {
      es: "Llamar al constructor del padre con super(…) y usar protected para compartir con las hijas.",
      en: "Call the parent's constructor with super(…) and use protected to share with the children.",
    },
    {
      es: "Reconocer cuándo la relación «es un» justifica heredar.",
      en: "Recognise when an “is a” relationship justifies inheriting.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Imagina que tienes una clase Notification con destinatario, asunto y un método para previsualizarla. Ahora necesitas recordatorios de tareas: son notificaciones, pero con fecha de vencimiento. Copiar la clase entera y añadir un campo funcionaría… hasta que alguien arregle un fallo en una copia y no en la otra. La herencia evita esa copia.",
        en: "Imagine a Notification class with a recipient, a subject and a method to preview it. Now you need task reminders: they are notifications, but with a due date. Copying the whole class and adding a field would work… until someone fixes a bug in one copy and not in the other. Inheritance avoids that copy.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Cuando creas un objeto personalizado, ya trae Id, Name, OwnerId, CreatedDate y LastModifiedDate. No los defines: los hereda de lo que todo objeto de Salesforce tiene en común. Tú solo añades los campos que lo hacen distinto. Una clase hija es eso: todo lo del padre, más lo suyo.",
        en: "When you create a custom object, it already comes with Id, Name, OwnerId, CreatedDate and LastModifiedDate. You do not define them: it inherits them from what every Salesforce object has in common. You only add the fields that make it different. A child class is exactly that: everything from the parent, plus its own.",
      },
    },
    {
      type: "h",
      text: { es: "Padre e hija", en: "Parent and child" },
    },
    {
      type: "code",
      code: {
        es: `public virtual class Notification {
    protected String recipient;
    public String subject;

    public Notification(String recipient, String subject) {
        this.recipient = recipient;
        this.subject = subject;
    }

    public String preview() {
        return subject + ' → ' + recipient;
    }
}

public class TaskReminder extends Notification {
    public Date dueDate;

    public TaskReminder(String recipient, String subject, Date dueDate) {
        super(recipient, subject);     // el padre rellena lo suyo
        this.dueDate = dueDate;        // la hija, lo suyo
    }

    public Boolean isOverdue() {
        return dueDate < Date.today();
    }
}`,
        en: `public virtual class Notification {
    protected String recipient;
    public String subject;

    public Notification(String recipient, String subject) {
        this.recipient = recipient;
        this.subject = subject;
    }

    public String preview() {
        return subject + ' → ' + recipient;
    }
}

public class TaskReminder extends Notification {
    public Date dueDate;

    public TaskReminder(String recipient, String subject, Date dueDate) {
        super(recipient, subject);     // the parent fills in its part
        this.dueDate = dueDate;        // the child, its own
    }

    public Boolean isOverdue() {
        return dueDate < Date.today();
    }
}`,
      },
    },
    {
      type: "list",
      items: [
        {
          es: "extends Notification: TaskReminder hereda recipient, subject y preview() sin volver a escribirlos.",
          en: "extends Notification: TaskReminder inherits recipient, subject and preview() without writing them again.",
        },
        {
          es: "virtual en el padre: en Apex, una clase no se puede heredar a menos que lo permita. Sin virtual, extends Notification no compila.",
          en: "virtual on the parent: in Apex, a class cannot be inherited from unless it allows it. Without virtual, extends Notification does not compile.",
        },
        {
          es: "super(…) llama al constructor del padre y tiene que ir en la primera línea, igual que this(…).",
          en: "super(…) calls the parent's constructor and must go on the first line, just like this(…).",
        },
        {
          es: "protected: recipient es invisible para el resto de la org, pero TaskReminder sí puede usarlo. Es el nivel de acceso «solo para la familia».",
          en: "protected: recipient is invisible to the rest of the org, but TaskReminder can use it. It is the “family only” access level.",
        },
      ],
    },
    {
      type: "diagram",
      id: "m05-inheritance",
      caption: {
        es: "La hija no copia al padre: lo amplía. Un arreglo en preview() llega a todas las hijas a la vez.",
        en: "The child does not copy the parent: it extends it. A fix in preview() reaches every child at once.",
      },
    },
    {
      type: "h",
      text: { es: "Usar la hija", en: "Using the child" },
    },
    {
      type: "code",
      code: {
        es: `TaskReminder reminder = new TaskReminder('ana@acme.com', 'Llamar a Acme', Date.today().addDays(-1));
System.debug(reminder.preview());     // heredado: Llamar a Acme → ana@acme.com
System.debug(reminder.isOverdue());   // propio: true

Notification anyNotice = reminder;    // una TaskReminder ES una Notification`,
        en: `TaskReminder reminder = new TaskReminder('ana@acme.com', 'Call Acme', Date.today().addDays(-1));
System.debug(reminder.preview());     // inherited: Call Acme → ana@acme.com
System.debug(reminder.isOverdue());   // its own: true

Notification anyNotice = reminder;    // a TaskReminder IS a Notification`,
      },
      caption: {
        es: "La última línea anticipa el polimorfismo: donde se espera un padre, vale cualquier hija.",
        en: "The last line previews polymorphism: wherever a parent is expected, any child will do.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Hereda solo si «es un»", en: "Inherit only if it “is a”" },
      text: {
        es: "Un recordatorio de tarea es una notificación: hereda. Una factura tiene líneas, pero no es una línea: eso no es herencia, es un atributo (List<InvoiceLine>). Si al leer «Hija es un Padre» en voz alta suena raro, no heredes.",
        en: "A task reminder is a notification: inherit. An invoice has lines, but it is not a line: that is not inheritance, it is an attribute (List<InvoiceLine>). If “Child is a Parent” sounds odd when read aloud, do not inherit.",
      },
    },
    {
      type: "h",
      text: { es: "Lo que se hereda y lo que no", en: "What is inherited and what is not" },
    },
    {
      type: "p",
      text: {
        es: "La hija recibe los atributos y métodos públicos y protected del padre. Lo private del padre sigue existiendo dentro del objeto, pero la hija no puede tocarlo: por eso recipient es protected, para que TaskReminder pueda usarlo. Y hay algo que NO se hereda nunca: los constructores. Si el padre solo tiene un constructor con parámetros, la hija tiene que escribir el suyo y llamar al del padre con super(…) como primera línea. Es la forma de decir «primero construye la parte de notificación, y luego yo añado lo mío».",
        en: "The child receives the parent's public and protected attributes and methods. The parent's private parts still exist inside the object, but the child cannot touch them: that is why recipient is protected, so TaskReminder can use it. And there is something NEVER inherited: constructors. If the parent only has a constructor with parameters, the child must write its own and call the parent's with super(…) as its first line. It is the way of saying “first build the notification part, then I add mine”.",
      },
    },
    {
      type: "code",
      code: {
        es: `public class TaskReminder extends Notification {
    private Date dueDate;

    public TaskReminder(String recipient, String subject, Date dueDate) {
        super(recipient, subject);   // 1º: el padre monta su parte
        this.dueDate = dueDate;      // 2º: la hija añade la suya
    }
}`,
        en: `public class TaskReminder extends Notification {
    private Date dueDate;

    public TaskReminder(String recipient, String subject, Date dueDate) {
        super(recipient, subject);   // 1st: the parent builds its part
        this.dueDate = dueDate;      // 2nd: the child adds its own
    }
}`,
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Un perfil base y lo que se añade encima", en: "A base profile and what is added on top" },
      text: {
        es: "Simplificación útil: piensa en un perfil mínimo que todos comparten y en los permission sets que se suman encima para cada rol. El comercial tiene todo lo del perfil base y además lo suyo; si mañana arreglas algo en el perfil, lo reciben todos a la vez. La herencia funciona así: lo común se escribe una vez en el padre y cada hija añade lo que la hace distinta. (Donde la analogía falla: un usuario puede sumar varios permission sets, y en Apex una clase solo puede heredar de UNA.)",
        en: "Useful simplification: think of a minimal profile everyone shares and the permission sets added on top for each role. The sales rep has everything from the base profile plus their own; fix something in the profile tomorrow and everyone gets it at once. Inheritance works like that: the common part is written once in the parent and each child adds what makes it different. (Where the analogy breaks: a user can stack several permission sets, while in Apex a class can inherit from only ONE.)",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "El miPunto3D extends miPunto del libro es la misma idea, con dos diferencias importantes. Primera: en Java cualquier clase se puede heredar; en Apex el padre tiene que declararse virtual (o abstract). Segunda: el libro dibuja la herencia múltiple (una hija con dos padres); ni Java ni Apex la permiten con clases. Una clase Apex tiene un único padre, y para lo demás existen las interfaces, que verás en la lección 10.",
        en: "The book's miPunto3D extends miPunto is the same idea, with two important differences. First: in Java any class can be inherited from; in Apex the parent must be declared virtual (or abstract). Second: the book draws multiple inheritance (a child with two parents); neither Java nor Apex allows it with classes. An Apex class has a single parent, and for the rest there are interfaces, which you will see in lesson 10.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿qué dos palabras hacen falta, una en el padre y otra en la hija, para que la herencia compile en Apex? ¿Dónde va super(…)?",
        en: "Without looking up: which two words are needed, one on the parent and one on the child, for inheritance to compile in Apex? Where does super(…) go?",
      },
    },
  ],

  quiz: [
    {
      id: "m05-l07-q1",
      kind: "single",
      prompt: { es: "¿Por qué no compila la clase hija?", en: "Why does the child class not compile?" },
      code: {
        es: `public class Vehicle {
    public String plate;
}
public class Truck extends Vehicle {
    public Decimal maxLoad;
}`,
        en: `public class Vehicle {
    public String plate;
}
public class Truck extends Vehicle {
    public Decimal maxLoad;
}`,
      },
      options: [
        {
          es: "Vehicle no está marcada virtual (ni abstract), así que no se puede heredar.",
          en: "Vehicle is not marked virtual (or abstract), so it cannot be inherited from.",
        },
        { es: "Truck debería repetir el atributo plate.", en: "Truck should repeat the plate attribute." },
        { es: "Falta un constructor en Truck.", en: "Truck is missing a constructor." },
      ],
      answer: 0,
      explain: {
        es: "En Apex las clases son cerradas por defecto. public virtual class Vehicle da permiso para heredar.",
        en: "In Apex classes are closed by default. public virtual class Vehicle grants permission to inherit.",
      },
      tags: ["find-error"],
    },
    {
      id: "m05-l07-q2",
      kind: "text",
      prompt: {
        es: "¿Qué palabra clave se usa en la clase hija para indicar de qué clase hereda?",
        en: "Which keyword is used in the child class to say which class it inherits from?",
      },
      accept: ["extends"],
      placeholder: { es: "una palabra", en: "one word" },
      explain: {
        es: "extends. public class TaskReminder extends Notification { … }",
        en: "extends. public class TaskReminder extends Notification { … }",
      },
      tags: ["recall"],
    },
    {
      id: "m05-l07-q3",
      kind: "single",
      prompt: {
        es: "Un atributo protected del padre, ¿desde dónde se puede usar?",
        en: "A parent's protected attribute — where can it be used from?",
      },
      options: [
        { es: "Desde el padre y sus clases hijas", en: "From the parent and its child classes" },
        { es: "Solo desde el padre", en: "Only from the parent" },
        { es: "Desde cualquier clase de la org", en: "From any class in the org" },
      ],
      answer: 0,
      explain: {
        es: "protected es el acceso «de familia»: la clase y las que heredan de ella. Es lo que dejó pendiente la lección anterior.",
        en: "protected is “family” access: the class and those inheriting from it. It is what the previous lesson left pending.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M5 L6", en: "Review · M5 L6" },
    },
    {
      id: "m05-l07-q4",
      kind: "single",
      prompt: {
        es: "¿Qué muestra este código, con las clases de la teoría?",
        en: "What does this code print, with the classes from the theory?",
      },
      code: {
        es: `TaskReminder r = new TaskReminder('luis@acme.com', 'Enviar contrato', Date.today().addDays(3));
System.debug(r.preview() + ' · ' + r.isOverdue());`,
        en: `TaskReminder r = new TaskReminder('luis@acme.com', 'Send contract', Date.today().addDays(3));
System.debug(r.preview() + ' · ' + r.isOverdue());`,
      },
      options: [
        {
          es: "Enviar contrato → luis@acme.com · false",
          en: "Send contract → luis@acme.com · false",
        },
        {
          es: "Enviar contrato → luis@acme.com · true",
          en: "Send contract → luis@acme.com · true",
        },
        {
          es: "No compila: preview() no está en TaskReminder",
          en: "It does not compile: preview() is not in TaskReminder",
        },
      ],
      answer: 0,
      explain: {
        es: "preview() se hereda del padre, y super(…) rellenó subject y recipient. La fecha es dentro de 3 días, así que aún no ha vencido.",
        en: "preview() is inherited from the parent, and super(…) filled in subject and recipient. The date is 3 days away, so it is not overdue yet.",
      },
      tags: ["predict-output", "spaced", "interleaving"],
      from: { es: "Repaso · M1 L4", en: "Review · M1 L4" },
    },
    {
      id: "m05-l07-q5",
      kind: "multi",
      prompt: {
        es: "¿En qué casos tiene sentido la herencia?",
        en: "In which cases does inheritance make sense?",
      },
      options: [
        {
          es: "SmsNotification a partir de Notification",
          en: "SmsNotification from Notification",
        },
        {
          es: "InvoiceLine a partir de Invoice",
          en: "InvoiceLine from Invoice",
        },
        {
          es: "PremiumSupportPlan a partir de SupportPlan",
          en: "PremiumSupportPlan from SupportPlan",
        },
        {
          es: "Account a partir de Contact",
          en: "Account from Contact",
        },
      ],
      answers: [0, 2],
      explain: {
        es: "Un SMS es una notificación y un plan premium es un plan de soporte. Una línea no es una factura, y una cuenta no es un contacto: son relaciones de «tiene», no de «es».",
        en: "An SMS is a notification and a premium plan is a support plan. A line is not an invoice, and an account is not a contact: those are “has” relationships, not “is” ones.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m05-l07-q6",
      kind: "single",
      prompt: {
        es: "¿Cuántas clases padre puede tener directamente una clase Apex?",
        en: "How many parent classes can an Apex class have directly?",
      },
      options: [
        { es: "Una", en: "One" },
        { es: "Dos", en: "Two" },
        { es: "Las que quiera", en: "As many as it likes" },
      ],
      answer: 0,
      explain: {
        es: "Herencia simple: un solo extends. Si una clase necesita cumplir varios papeles, usará interfaces, que sí se pueden combinar.",
        en: "Single inheritance: one extends only. If a class needs to play several roles, it uses interfaces, which can be combined.",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 7 DE 12 · El motor tiene que avisar: de las renovaciones que vencen, de las tareas pendientes. Soporte quiere recordatorios de tareas que, además de todo lo que tiene una notificación, sepan si están vencidos. Escribe la clase padre, la hija y úsalas.",
      en: "TASK 7 OF 12 · The engine has to notify: about renewals falling due, about pending tasks. Support wants task reminders that, on top of everything a notification has, know whether they are overdue. Write the parent class, the child and use them.",
    },
    brief: [
      {
        es: "Clase padre Notification que se pueda heredar, con recipient (String, visible solo para la familia) y subject (String, público).",
        en: "Parent class Notification that can be inherited from, with recipient (String, visible to the family only) and subject (String, public).",
      },
      {
        es: "Su constructor recibe recipient y subject. Tiene un método público preview() que devuelve subject + ' → ' + recipient.",
        en: "Its constructor takes recipient and subject. It has a public method preview() that returns subject + ' → ' + recipient.",
      },
      {
        es: "Clase hija TaskReminder que herede de Notification, con dueDate (Date). Su constructor recibe los tres datos y delega los dos primeros en el padre.",
        en: "Child class TaskReminder inheriting from Notification, with dueDate (Date). Its constructor takes all three values and delegates the first two to the parent.",
      },
      {
        es: "Un método público isOverdue() que devuelva true si dueDate es anterior a hoy.",
        en: "A public method isOverdue() returning true if dueDate is before today.",
      },
      {
        es: "Debajo: crea un TaskReminder vencido ayer y guarda su preview() en previewText.",
        en: "Below: create a TaskReminder that fell due yesterday and store its preview() in previewText.",
      },
    ],
    starter: {
      es: `// CASO: el motor comercial de Northwind Trading
// Tarea 7 de 12: avisos que comparten lo común.

// 1. Clase padre Notification.


// 2. Clase hija TaskReminder.


// 3. Uso.
`,
      en: `// CASE: Northwind Trading's commercial engine
// Task 7 of 12: notices that share the common part.

// 1. Parent class Notification.


// 2. Child class TaskReminder.


// 3. Usage.
`,
    },
    hints: [
      {
        es: "Tres palabras clave hacen que esto funcione: una en la cabecera del padre, otra en la cabecera de la hija y otra en la primera línea del constructor de la hija. Y una más para el acceso «de familia».",
        en: "Three keywords make this work: one in the parent's header, one in the child's header and one on the first line of the child's constructor. And one more for “family” access.",
      },
      {
        es: "public virtual class Notification { protected String recipient; … } — public class TaskReminder extends Notification { … } — y en su constructor, super(recipient, subject); antes que nada.",
        en: "public virtual class Notification { protected String recipient; … } — public class TaskReminder extends Notification { … } — and in its constructor, super(recipient, subject); before anything else.",
      },
      {
        es: "Pseudocódigo: isOverdue() → return dueDate < Date.today(); — Uso: TaskReminder r = new TaskReminder('…', '…', Date.today().addDays(-1)); String previewText = r.preview();",
        en: "Pseudocode: isOverdue() → return dueDate < Date.today(); — Usage: TaskReminder r = new TaskReminder('…', '…', Date.today().addDays(-1)); String previewText = r.preview();",
      },
    ],
    solution: {
      es: `public virtual class Notification {
    protected String recipient;
    public String subject;

    public Notification(String recipient, String subject) {
        this.recipient = recipient;
        this.subject = subject;
    }

    public String preview() {
        return subject + ' → ' + recipient;
    }
}

public class TaskReminder extends Notification {
    public Date dueDate;

    public TaskReminder(String recipient, String subject, Date dueDate) {
        super(recipient, subject);
        this.dueDate = dueDate;
    }

    public Boolean isOverdue() {
        return dueDate < Date.today();
    }
}

// Uso
TaskReminder reminder = new TaskReminder('ana@acme.com', 'Renovar contrato', Date.today().addDays(-1));
String previewText = reminder.preview();
System.debug(previewText + ' · vencido: ' + reminder.isOverdue());`,
      en: `public virtual class Notification {
    protected String recipient;
    public String subject;

    public Notification(String recipient, String subject) {
        this.recipient = recipient;
        this.subject = subject;
    }

    public String preview() {
        return subject + ' → ' + recipient;
    }
}

public class TaskReminder extends Notification {
    public Date dueDate;

    public TaskReminder(String recipient, String subject, Date dueDate) {
        super(recipient, subject);
        this.dueDate = dueDate;
    }

    public Boolean isOverdue() {
        return dueDate < Date.today();
    }
}

// Usage
TaskReminder reminder = new TaskReminder('ana@acme.com', 'Renew contract', Date.today().addDays(-1));
String previewText = reminder.preview();
System.debug(previewText + ' · overdue: ' + reminder.isOverdue());`,
    },
    checks: [
      {
        id: "m05-l07-c1",
        label: {
          es: "Notification es virtual, con recipient protected y subject public",
          en: "Notification is virtual, with a protected recipient and a public subject",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+virtual\\s+class\\s+Notification\\s*\\{" },
            { op: "match", pattern: "protected\\s+String\\s+recipient\\s*;" },
            { op: "match", pattern: "public\\s+String\\s+subject\\s*;" },
          ],
        },
        onFail: {
          es: "public virtual class Notification { protected String recipient; public String subject; … } — sin virtual no se puede heredar.",
          en: "public virtual class Notification { protected String recipient; public String subject; … } — without virtual it cannot be inherited from.",
        },
      },
      {
        id: "m05-l07-c2",
        label: {
          es: "El padre tiene su constructor y preview()",
          en: "The parent has its constructor and preview()",
        },
        rule: {
          op: "all",
          of: [
            {
              op: "match",
              pattern: "public\\s+Notification\\s*\\(\\s*String\\s+\\w+\\s*,\\s*String\\s+\\w+\\s*\\)\\s*\\{",
            },
            { op: "match", pattern: "public\\s+String\\s+preview\\s*\\(\\s*\\)\\s*\\{" },
            { op: "match", pattern: "return\\s+subject\\s*\\+\\s*' → '\\s*\\+\\s*recipient\\s*;" },
          ],
        },
        onFail: {
          es: "public Notification(String recipient, String subject) { … } y public String preview() { return subject + ' → ' + recipient; }",
          en: "public Notification(String recipient, String subject) { … } and public String preview() { return subject + ' → ' + recipient; }",
        },
      },
      {
        id: "m05-l07-c3",
        label: {
          es: "TaskReminder hereda de Notification",
          en: "TaskReminder inherits from Notification",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+class\\s+TaskReminder\\s+extends\\s+Notification\\s*\\{" },
            { op: "match", pattern: "public\\s+Date\\s+dueDate\\s*;" },
          ],
        },
        onFail: {
          es: "public class TaskReminder extends Notification { public Date dueDate; … }",
          en: "public class TaskReminder extends Notification { public Date dueDate; … }",
        },
      },
      {
        id: "m05-l07-c4",
        label: {
          es: "El constructor de la hija delega en el padre con super(…) en la primera línea",
          en: "The child's constructor delegates to the parent with super(…) on the first line",
        },
        rule: {
          op: "match",
          pattern:
            "public\\s+TaskReminder\\s*\\(\\s*String\\s+\\w+\\s*,\\s*String\\s+\\w+\\s*,\\s*Date\\s+\\w+\\s*\\)\\s*\\{\\s*super\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*;",
        },
        onFail: {
          es: "public TaskReminder(String recipient, String subject, Date dueDate) { super(recipient, subject); this.dueDate = dueDate; }",
          en: "public TaskReminder(String recipient, String subject, Date dueDate) { super(recipient, subject); this.dueDate = dueDate; }",
        },
        onPass: {
          es: "El padre se encarga de lo suyo: si mañana Notification valida el correo en su constructor, TaskReminder lo recibe gratis.",
          en: "The parent handles its part: if tomorrow Notification validates the email in its constructor, TaskReminder gets it for free.",
        },
      },
      {
        id: "m05-l07-c5",
        label: {
          es: "isOverdue() compara con hoy, y el uso prueba un recordatorio vencido",
          en: "isOverdue() compares with today, and the usage tries an overdue reminder",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+Boolean\\s+isOverdue\\s*\\(\\s*\\)" },
            { op: "match", pattern: "dueDate\\s*<\\s*Date\\.today\\(\\s*\\)|Date\\.today\\(\\s*\\)\\s*>\\s*dueDate" },
            { op: "match", pattern: "new\\s+TaskReminder\\s*\\([^;]*Date\\.today\\(\\s*\\)\\.addDays\\(\\s*-\\s*1\\s*\\)" },
            { op: "match", pattern: "String\\s+previewText\\s*=\\s*\\w+\\.preview\\(\\s*\\)\\s*;" },
          ],
        },
        onFail: {
          es: "isOverdue() devuelve dueDate < Date.today(). En el uso, crea el recordatorio con Date.today().addDays(-1) y guarda String previewText = r.preview();",
          en: "isOverdue() returns dueDate < Date.today(). In the usage, create the reminder with Date.today().addDays(-1) and store String previewText = r.preview();",
        },
      },
    ],
    rubric: [
      {
        es: "Si Marketing pide mañana EmailNotification con una lista de adjuntos, ¿qué clase escribirías y qué no tendrías que tocar?",
        en: "If Marketing asks tomorrow for an EmailNotification with a list of attachments, which class would you write and what would you not have to touch?",
      },
      {
        es: "Tarea 8: los descuentos de la renovación. Todos se aplican sobre un importe, pero cada uno a su manera, y no existe «un descuento» genérico.",
        en: "Task 8: the renewal discounts. They all apply to an amount, each its own way, and there is no generic “discount”.",
      },
    ],
  },
};
