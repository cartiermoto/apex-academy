import type { Lesson } from "@/lib/types";

export const l04This: Lesson = {
  id: "m05-l04",
  slug: "this",
  n: 4,
  kind: "lesson",
  minutes: 16,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 3", en: "Remember? · Review of lesson 3" },
    prompt: { es: "¿Qué tipo de retorno lleva un constructor?", en: "What return type does a constructor have?" },
    options: [
      { es: "void", en: "void" },
      { es: "El de la clase", en: "The class's type" },
      { es: "Ninguno", en: "None" },
    ],
    answer: 2,
    explain: { es: "Ninguno, ni siquiera void: se llama igual que la clase y solo prepara el objeto que está naciendo.", en: "None, not even void: it has the class's name and only prepares the object being born." },
  },
  title: { es: "this: el objeto hablando de sí mismo", en: "this: the object talking about itself" },
  summary: {
    es: "Dentro de una clase, this es «esta instancia». Sirve para distinguir un atributo de un parámetro con el mismo nombre y para que un constructor llame a otro.",
    en: "Inside a class, this means “this instance”. It tells an attribute apart from a parameter with the same name, and lets one constructor call another.",
  },
  analogy: {
    es: "$Record en un Flow disparado por registro: «el registro que se está procesando»",
    en: "$Record in a record-triggered Flow: “the record being processed”",
  },
  objectives: [
    {
      es: "Usar this.atributo cuando un parámetro se llama igual que un atributo.",
      en: "Use this.attribute when a parameter has the same name as an attribute.",
    },
    {
      es: "Encadenar constructores con this(…) para no repetir código.",
      en: "Chain constructors with this(…) so code is not repeated.",
    },
    {
      es: "Reconocer el error silencioso de asignar un parámetro a sí mismo.",
      en: "Recognise the silent bug of assigning a parameter to itself.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Dentro de un método, a veces necesitas hablar de la instancia sobre la que se está ejecutando: «mi nivel», «mis horas». Apex tiene una palabra para eso: this. No es un concepto nuevo, solo le pone nombre a algo que ya estabas haciendo.",
        en: "Inside a method you sometimes need to talk about the instance it is running on: “my level”, “my hours”. Apex has a word for that: this. It is not a new concept, it just names something you were already doing.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "En mis Flows disparados por registro escribía $Record.Amount para decir «el importe del registro que ha disparado este Flow». Da igual qué registro sea: $Record siempre es el actual. this es lo mismo dentro de una clase: la instancia sobre la que se ha llamado el método o el constructor.",
        en: "In my record-triggered Flows I wrote $Record.Amount to say «the amount of the record that triggered this Flow». Whatever the record is, $Record is always the current one. this is the same inside a class: the instance the method or constructor was called on.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "Uso 1: cuando el parámetro se llama igual", en: "Use 1: when the parameter has the same name" },
    },
    {
      type: "p",
      text: {
        es: "En la lección anterior el parámetro se llamaba planLevel para no chocar con el atributo level. Lo natural es llamarlos igual, pero entonces dentro del constructor level significa el parámetro, porque es lo más cercano: el [[ambito|ámbito]] más interior gana. this.level deja claro que hablas del atributo de la instancia.",
        en: "In the previous lesson the parameter was called planLevel so as not to clash with the level attribute. The natural thing is to name them the same, but then inside the constructor level means the parameter, because it is the closest: the innermost [[ambito|scope]] wins. this.level makes it clear you mean the instance's attribute.",
      },
    },
    {
      type: "code",
      code: {
        es: `public class SupportPlan {
    public String level;

    public SupportPlan(String level) {
        level = level;        // ❌ asigna el parámetro a sí mismo: el atributo sigue null
        this.level = level;   // ✅ atributo de esta instancia = parámetro
    }
}`,
        en: `public class SupportPlan {
    public String level;

    public SupportPlan(String level) {
        level = level;        // ❌ assigns the parameter to itself: the attribute stays null
        this.level = level;   // ✅ this instance's attribute = the parameter
    }
}`,
      },
      caption: {
        es: "level = level; compila sin quejarse y no hace nada. Es de los errores más difíciles de ver, porque no avisa.",
        en: "level = level; compiles without complaint and does nothing. It is one of the hardest bugs to spot, because it gives no warning.",
      },
    },
    {
      type: "diagram",
      id: "m05-this",
      caption: {
        es: "Dentro del constructor hay dos level: el parámetro, que tapa al otro, y el atributo, al que se llega con this.",
        en: "Inside the constructor there are two levels: the parameter, which hides the other, and the attribute, reached with this.",
      },
    },
    {
      type: "h",
      text: { es: "Uso 2: un constructor que llama a otro", en: "Use 2: one constructor calling another" },
    },
    {
      type: "p",
      text: {
        es: "La lección anterior terminó con dos constructores que repetían tres líneas. this(…), escrito como primera línea de un constructor, llama a otro constructor de la misma clase. Así la lógica vive en un único sitio y los demás constructores solo aportan sus valores por defecto.",
        en: "The previous lesson ended with two constructors repeating three lines. this(…), written as a constructor's first line, calls another constructor of the same class. That way the logic lives in one place and the other constructors only contribute their defaults.",
      },
    },
    {
      type: "code",
      code: {
        es: `public class SupportPlan {
    public String level;
    public Date startDate;
    public List<String> contacts;

    public SupportPlan(String level) {
        this.level = level;
        this.startDate = Date.today();
        this.contacts = new List<String>();
    }

    public SupportPlan() {
        this('Basic');        // «hazlo como el otro, con nivel Basic»
    }
}`,
        en: `public class SupportPlan {
    public String level;
    public Date startDate;
    public List<String> contacts;

    public SupportPlan(String level) {
        this.level = level;
        this.startDate = Date.today();
        this.contacts = new List<String>();
    }

    public SupportPlan() {
        this('Basic');        // "do it like the other one, with level Basic"
    }
}`,
      },
      caption: {
        es: "this(…) tiene que ser la primera línea del constructor. Si cambia la forma de crear un plan, solo se toca un constructor.",
        en: "this(…) must be the constructor's first line. If the way a plan is created changes, only one constructor is touched.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "this no existe en lo estático", en: "this does not exist in static code" },
      text: {
        es: "this es siempre una instancia concreta. En la próxima lección verás métodos que pertenecen a la clase y no a ninguna instancia: dentro de ellos no hay this, igual que no hay $Record en un Flow programado que no recorre registros.",
        en: "this is always a specific instance. In the next lesson you will see methods that belong to the class and to no instance: inside them there is no this, just as there is no $Record in a scheduled Flow that walks no records.",
      },
    },
    {
      type: "h",
      text: { es: "this como argumento: el objeto se presenta a otro", en: "this as an argument: the object introduces itself to another" },
    },
    {
      type: "p",
      text: {
        es: "this no solo sirve para distinguir un atributo de un parámetro. También puedes pasarlo como argumento, cuando un objeto necesita entregarse a sí mismo a otro código: «apúntame en el registro de auditoría», «añádeme a esta lista». Y un método puede devolver this al terminar, para que se puedan encadenar llamadas sobre el mismo objeto, como encadenabas métodos de String en el Módulo 1. Lo verás mucho en el Módulo 10, en las clases que fabrican datos de prueba.",
        en: "this is not only for telling an attribute from a parameter. You can also pass it as an argument, when an object needs to hand itself over to other code: “log me in the audit trail”, “add me to this list”. And a method can return this when it finishes, so calls on the same object can be chained, as you chained String methods in Module 1. You will see it a lot in Module 10, in the classes that build test data.",
      },
    },
    {
      type: "code",
      code: {
        es: `public class SupportPlan {
    public List<String> contacts = new List<String>();

    public SupportPlan addContact(String email) {
        this.contacts.add(email);
        return this;   // devuelve el mismo objeto…
    }
}

// …así que las llamadas se encadenan
SupportPlan plan = new SupportPlan('Gold')
    .addContact('ana@northwind.com')
    .addContact('luis@northwind.com');`,
        en: `public class SupportPlan {
    public List<String> contacts = new List<String>();

    public SupportPlan addContact(String email) {
        this.contacts.add(email);
        return this;   // returns the same object…
    }
}

// …so the calls chain
SupportPlan plan = new SupportPlan('Gold')
    .addContact('ana@northwind.com')
    .addContact('luis@northwind.com');`,
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Pasar $Record a un subflow", en: "Passing $Record to a subflow" },
      text: {
        es: "Esto lo hacía a menudo: en un Record-Triggered Flow, cuando llamas a un subflow y le das $Record como variable de entrada, le estás diciendo «trabaja con este registro, el que me disparó a mí». Pasar this a otro método es exactamente eso: el objeto se entrega entero al código que lo necesita, sin copiar sus campos uno a uno.",
        en: "I did this often: in a Record-Triggered Flow, when you call a subflow and hand it $Record as an input variable, you are telling it «work with this record, the one that triggered me». Passing this to another method is exactly that: the object is handed over whole to the code that needs it, without copying its fields one by one.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "El libro lo muestra con su método inicia2(int x, int y): x = x; no toca el atributo y this.y = y; sí. Es exactamente el error de level = level; en Apex. Y this(…) para encadenar constructores funciona igual que en Java, con la misma regla de ir en la primera línea.",
        en: "The book shows it with its inicia2(int x, int y) method: x = x; does not touch the attribute and this.y = y; does. It is exactly the level = level; bug in Apex. And this(…) for chaining constructors works as in Java, with the same first-line rule.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: si un parámetro y un atributo se llaman amount, ¿a cuál se refiere amount dentro del método? ¿Cómo llegas al otro?",
        en: "Without looking up: if a parameter and an attribute are both called amount, which one does amount refer to inside the method? How do you reach the other?",
      },
    },
  ],

  quiz: [
    {
      id: "m05-l04-q1",
      kind: "single",
      prompt: { es: "¿Qué muestra este código?", en: "What does this code print?" },
      code: {
        es: `public class Region {
    public String code;
    public Region(String code) {
        code = code;
    }
}
Region r = new Region('EMEA');
System.debug(r.code);`,
        en: `public class Region {
    public String code;
    public Region(String code) {
        code = code;
    }
}
Region r = new Region('EMEA');
System.debug(r.code);`,
      },
      options: [
        { es: "null", en: "null" },
        { es: "EMEA", en: "EMEA" },
        { es: "No compila", en: "It does not compile" },
      ],
      answer: 0,
      explain: {
        es: "code = code; asigna el parámetro a sí mismo. El atributo nunca se toca y se queda en null. Hacía falta this.code = code;",
        en: "code = code; assigns the parameter to itself. The attribute is never touched and stays null. It needed this.code = code;",
      },
      tags: ["predict-output", "find-error"],
    },
    {
      id: "m05-l04-q2",
      kind: "single",
      prompt: {
        es: "¿Dónde puede ir this(…) dentro de un constructor?",
        en: "Where can this(…) go inside a constructor?",
      },
      options: [
        { es: "Solo en la primera línea", en: "Only on the first line" },
        { es: "En cualquier línea", en: "On any line" },
        { es: "Solo en la última línea", en: "Only on the last line" },
        { es: "Fuera del constructor", en: "Outside the constructor" },
      ],
      answer: 0,
      explain: {
        es: "Primero se construye «como el otro» y después, si hace falta, se ajusta. Por eso this(…) va el primero.",
        en: "First it is built “like the other one” and then, if needed, adjusted. That is why this(…) goes first.",
      },
      tags: ["recall"],
    },
    {
      id: "m05-l04-q3",
      kind: "text",
      prompt: {
        es: "Completa para asignar el parámetro amount al atributo amount: ____.amount = amount;",
        en: "Complete to assign the amount parameter to the amount attribute: ____.amount = amount;",
      },
      accept: ["this"],
      placeholder: { es: "una palabra", en: "one word" },
      explain: {
        es: "this.amount es el atributo de la instancia; amount a secas, el parámetro.",
        en: "this.amount is the instance's attribute; plain amount, the parameter.",
      },
      tags: ["recall"],
    },
    {
      id: "m05-l04-q4",
      kind: "single",
      prompt: {
        es: "¿Qué valor tiene hours en new Plan()?",
        en: "What value does hours hold in new Plan()?",
      },
      code: {
        es: `public class Plan {
    public Integer hours;
    public Plan(Integer hours) {
        this.hours = hours;
    }
    public Plan() {
        this(5);
    }
}`,
        en: `public class Plan {
    public Integer hours;
    public Plan(Integer hours) {
        this.hours = hours;
    }
    public Plan() {
        this(5);
    }
}`,
      },
      options: [
        { es: "5", en: "5" },
        { es: "null", en: "null" },
        { es: "0", en: "0" },
      ],
      answer: 0,
      explain: {
        es: "El constructor vacío delega en el otro con this(5), que asigna this.hours = 5.",
        en: "The empty constructor delegates to the other one with this(5), which assigns this.hours = 5.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m05-l04-q5",
      kind: "single",
      prompt: {
        es: "Dentro de un for-each declaras una variable amount, y fuera del bucle ya existía otra amount. ¿Qué pasa?",
        en: "Inside a for-each you declare an amount variable, and outside the loop another amount already existed. What happens?",
      },
      options: [
        {
          es: "No compila: dentro de un bloque no se puede redeclarar una variable de fuera.",
          en: "It does not compile: inside a block you cannot redeclare an outer variable.",
        },
        {
          es: "Compila, y la de dentro tapa a la de fuera, como un parámetro tapa a un atributo.",
          en: "It compiles, and the inner one hides the outer one, as a parameter hides an attribute.",
        },
      ],
      answer: 0,
      explain: {
        es: "Con variables locales, Apex no deja duplicar. Los parámetros y los atributos son otra historia: un parámetro sí puede llamarse como un atributo, y por eso existe this.",
        en: "With local variables, Apex does not allow duplicates. Parameters and attributes are a different story: a parameter can share an attribute's name, and that is why this exists.",
      },
      tags: ["interleaving", "spaced"],
      from: { es: "Repaso · M2 L3", en: "Review · M2 L3" },
    },
    {
      id: "m05-l04-q6",
      kind: "multi",
      prompt: {
        es: "¿Para qué sirve this?",
        en: "What is this used for?",
      },
      options: [
        {
          es: "Llegar a un atributo cuando un parámetro se llama igual.",
          en: "Reaching an attribute when a parameter has the same name.",
        },
        {
          es: "Llamar desde un constructor a otro constructor de la misma clase.",
          en: "Calling another constructor of the same class from a constructor.",
        },
        {
          es: "Crear una instancia nueva, como new.",
          en: "Creating a new instance, like new.",
        },
        {
          es: "Llegar a un atributo desde un método estático.",
          en: "Reaching an attribute from a static method.",
        },
      ],
      answers: [0, 1],
      explain: {
        es: "this nunca crea nada: señala la instancia actual. Y en un método estático no hay instancia actual.",
        en: "this never creates anything: it points at the current instance. And in a static method there is no current instance.",
      },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 4 DE 12 · El plan de soporte de la tarea 3 funciona, pero con nombres forzados y código repetido. Mejora la clase SupportPlan de la lección anterior: el parámetro del constructor debe llamarse igual que el atributo, y tiene que existir un plan 'Basic' por defecto sin repetir la lógica del constructor principal.",
      en: "TASK 4 OF 12 · Task 3's support plan works, but with forced names and repeated code. Improve the SupportPlan class from the previous lesson: the constructor's parameter must share the attribute's name, and there must be a default 'Basic' plan without repeating the main constructor's logic.",
    },
    brief: [
      {
        es: "El constructor principal recibe String level (no planLevel) y lo asigna al atributo con this.",
        en: "The main constructor takes String level (not planLevel) and assigns it to the attribute with this.",
      },
      {
        es: "Sigue fijando startDate a hoy y contacts a una lista vacía, también con this.",
        en: "It still sets startDate to today and contacts to an empty list, also with this.",
      },
      {
        es: "Añade un constructor sin parámetros que delegue en el principal con el nivel 'Basic'.",
        en: "Add a parameterless constructor that delegates to the main one with the 'Basic' level.",
      },
      {
        es: "Debajo, crea basicPlan con el constructor sin parámetros.",
        en: "Below, create basicPlan with the parameterless constructor.",
      },
    ],
    starter: {
      es: `// CASO: el motor comercial de Northwind Trading
// Tarea 4 de 12: el mismo plan de soporte, limpio.

public class SupportPlan {
    public String level;
    public Date startDate;
    public List<String> contacts;

    public SupportPlan(String planLevel) {
        level = planLevel;
        startDate = Date.today();
        contacts = new List<String>();
    }
}

// Uso: crea basicPlan sin pasar ningún nivel.
`,
      en: `// CASE: Northwind Trading's commercial engine
// Task 4 of 12: the same support plan, cleaned up.

public class SupportPlan {
    public String level;
    public Date startDate;
    public List<String> contacts;

    public SupportPlan(String planLevel) {
        level = planLevel;
        startDate = Date.today();
        contacts = new List<String>();
    }
}

// Usage: create basicPlan without passing any level.
`,
    },
    hints: [
      {
        es: "Yo miraría qué pasa al renombrar planLevel a level: la línea level = level; dejaría el atributo en null sin avisar. Y el constructor nuevo no debe copiar las tres líneas.",
        en: "I would look at what happens when you rename planLevel to level: the line level = level; would leave the attribute null without warning. And the new constructor must not copy the three lines.",
      },
      {
        es: "Lo que me ayudó: this.level es tu $Record.level, el atributo del objeto actual; level a secas es el parámetro. En el constructor sin parámetros, la primera y única línea es this('Basic');",
        en: "What helped me: this.level is your $Record.level, the current object's attribute; plain level is the parameter. In the parameterless constructor, the first and only line is this('Basic');",
      },
      {
        es: "Te dejo el esquema: public SupportPlan(String level) { this.level = level; this.startDate = Date.today(); this.contacts = new List<String>(); } public SupportPlan() { this('Basic'); } — SupportPlan basicPlan = new SupportPlan();",
        en: "Here is the outline: public SupportPlan(String level) { this.level = level; this.startDate = Date.today(); this.contacts = new List<String>(); } public SupportPlan() { this('Basic'); } — SupportPlan basicPlan = new SupportPlan();",
      },
    ],
    solution: {
      es: `public class SupportPlan {
    public String level;
    public Date startDate;
    public List<String> contacts;

    public SupportPlan(String level) {
        this.level = level;
        this.startDate = Date.today();
        this.contacts = new List<String>();
    }

    public SupportPlan() {
        this('Basic');
    }
}

// Uso
SupportPlan basicPlan = new SupportPlan();
System.debug(basicPlan.level);   // Basic`,
      en: `public class SupportPlan {
    public String level;
    public Date startDate;
    public List<String> contacts;

    public SupportPlan(String level) {
        this.level = level;
        this.startDate = Date.today();
        this.contacts = new List<String>();
    }

    public SupportPlan() {
        this('Basic');
    }
}

// Usage
SupportPlan basicPlan = new SupportPlan();
System.debug(basicPlan.level);   // Basic`,
    },
    checks: [
      {
        id: "m05-l04-c1",
        label: {
          es: "El constructor principal recibe String level",
          en: "The main constructor takes String level",
        },
        rule: { op: "match", pattern: "public\\s+SupportPlan\\s*\\(\\s*String\\s+level\\s*\\)\\s*\\{" },
        onFail: {
          es: "Renombra el parámetro: public SupportPlan(String level) { … }",
          en: "Rename the parameter: public SupportPlan(String level) { … }",
        },
        otter: {
          es: "Renombra el parámetro para que se llame como el atributo: public SupportPlan(String level) { … }",
          en: "Rename the parameter so it has the attribute's name: public SupportPlan(String level) { … }",
        },
      },
      {
        id: "m05-l04-c2",
        label: {
          es: "Asigna el atributo con this.level = level",
          en: "Assigns the attribute with this.level = level",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "this\\.level\\s*=\\s*level\\s*;" },
            { op: "absent", pattern: "(^|[^.\\w])level\\s*=\\s*level\\s*;" },
          ],
        },
        onFail: {
          es: "Sin this, level = level; asigna el parámetro a sí mismo y el atributo queda en null. Escribe this.level = level;",
          en: "Without this, level = level; assigns the parameter to itself and the attribute stays null. Write this.level = level;",
        },
        otter: {
          es: "Sin this, level = level; asigna el parámetro a sí mismo y el atributo queda en null. this.level es tu $Record.level: el campo del objeto actual. Escribe this.level = level;",
          en: "Without this, level = level; assigns the parameter to itself and the attribute stays null. this.level is your $Record.level: the current object's field. Write this.level = level;",
        },
      },
      {
        id: "m05-l04-c3",
        label: {
          es: "La fecha y la lista siguen inicializándose",
          en: "The date and the list are still initialised",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "(this\\.)?startDate\\s*=\\s*Date\\.today\\(\\s*\\)\\s*;" },
            { op: "match", pattern: "(this\\.)?contacts\\s*=\\s*new\\s+List<String>\\s*\\(\\s*\\)\\s*;" },
          ],
        },
        onFail: {
          es: "No pierdas las otras dos líneas del constructor principal: this.startDate = Date.today(); this.contacts = new List<String>();",
          en: "Do not lose the main constructor's other two lines: this.startDate = Date.today(); this.contacts = new List<String>();",
        },
        otter: {
          es: "No pierdas los otros dos valores por defecto del constructor principal: this.startDate = Date.today(); this.contacts = new List<String>();",
          en: "Do not lose the main constructor's other two default values: this.startDate = Date.today(); this.contacts = new List<String>();",
        },
      },
      {
        id: "m05-l04-c4",
        label: {
          es: "El constructor sin parámetros delega con this('Basic')",
          en: "The parameterless constructor delegates with this('Basic')",
        },
        rule: {
          op: "match",
          pattern: "public\\s+SupportPlan\\s*\\(\\s*\\)\\s*\\{\\s*this\\(\\s*'Basic'\\s*\\)\\s*;\\s*\\}",
        },
        onFail: {
          es: "public SupportPlan() { this('Basic'); } — una sola línea que reutiliza el constructor principal.",
          en: "public SupportPlan() { this('Basic'); } — a single line reusing the main constructor.",
        },
        otter: {
          es: "El plan Basic es otra acción rápida que reutiliza la principal en lugar de copiarla: public SupportPlan() { this('Basic'); }",
          en: "The Basic plan is another quick action that reuses the main one instead of copying it: public SupportPlan() { this('Basic'); }",
        },
        onPass: {
          es: "La lógica de creación vive en un solo sitio: si mañana cambia, se toca un constructor.",
          en: "The creation logic lives in one place: if it changes tomorrow, one constructor is touched.",
        },
      },
      {
        id: "m05-l04-c5",
        label: {
          es: "Crea basicPlan con new SupportPlan()",
          en: "Creates basicPlan with new SupportPlan()",
        },
        rule: { op: "match", pattern: "SupportPlan\\s+basicPlan\\s*=\\s*new\\s+SupportPlan\\s*\\(\\s*\\)" },
        onFail: {
          es: "Debajo de la clase: SupportPlan basicPlan = new SupportPlan();",
          en: "Below the class: SupportPlan basicPlan = new SupportPlan();",
        },
        otter: {
          es: "Debajo de la clase, pulsa el New sin datos: SupportPlan basicPlan = new SupportPlan();",
          en: "Below the class, click New with no data: SupportPlan basicPlan = new SupportPlan();",
        },
      },
    ],
    rubric: [
      {
        es: "¿Queda alguna línea duplicada entre los dos constructores?",
        en: "Is there any line left duplicated between the two constructors?",
      },
    ],
    outro: {
      es: "Ya distingues el atributo del parámetro con this y haces que un constructor reutilice otro. En la tarea 5, el motor ya tiene piezas, y ahora hace falta que todas calculen los precios de la misma manera.",
      en: "You can now tell the attribute from the parameter with this and make one constructor reuse another. In task 5 the engine already has pieces, and now they all need to calculate prices the same way.",
    },
    voice: "otter",
  },
};
