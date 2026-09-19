import type { Lesson } from "@/lib/types";

export const l03Constructores: Lesson = {
  id: "m05-l03",
  slug: "constructores",
  n: 3,
  kind: "lesson",
  minutes: 20,
  title: { es: "Constructores", en: "Constructors" },
  summary: {
    es: "El código que se ejecuta solo al hacer new: deja cada instancia lista para usar, como los valores por defecto de un campo al pulsar New.",
    en: "The code that runs by itself on new: it leaves each instance ready to use, like a field's default values when you click New.",
  },
  analogy: {
    es: "Los valores por defecto que aparecen al pulsar New en un registro",
    en: "The default values that appear when you click New on a record",
  },
  objectives: [
    {
      es: "Escribir un constructor con parámetros y reconocer que no lleva tipo de retorno.",
      en: "Write a constructor with parameters and recognise that it has no return type.",
    },
    {
      es: "Dejar cada instancia en un estado válido desde el principio, sin listas a null.",
      en: "Leave each instance in a valid state from the start, with no null lists.",
    },
    {
      es: "Saber cuándo deja de existir el constructor vacío que Apex pone por ti.",
      en: "Know when the empty constructor Apex provides for you stops existing.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "En la lección anterior fabricabas un WorkTicket vacío y después rellenabas sus campos uno a uno. Si olvidabas uno, quedaba en null y un método podía fallar más tarde. Un constructor resuelve eso: es el código que se ejecuta automáticamente al hacer new, y su trabajo es entregar una instancia lista para usar.",
        en: "In the previous lesson you made an empty WorkTicket and then filled in its fields one by one. Forget one and it stayed null, and a method could fail later. A constructor solves that: it is the code that runs automatically on new, and its job is to hand over an instance ready to use.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Cuando pulsas New en una oportunidad, algunos campos ya vienen rellenos: el propietario eres tú, la divisa es la de tu usuario, un picklist trae su valor por defecto. Nadie los escribió: los puso la definición del objeto al crear el registro. El constructor es ese momento, escrito en código.",
        en: "When you click New on an opportunity, some fields come pre-filled: the owner is you, the currency is your user's, a picklist brings its default value. Nobody typed them: the object's definition set them when the record was created. The constructor is that moment, written as code.",
      },
    },
    {
      type: "h",
      text: { es: "Anatomía de un constructor", en: "Anatomy of a constructor" },
    },
    {
      type: "code",
      code: {
        es: `public class SupportPlan {
    public String level;
    public Integer hoursIncluded;
    public Date startDate;
    public List<String> contacts;

    // Constructor: mismo nombre que la clase, sin tipo de retorno
    public SupportPlan(String planLevel) {
        level = planLevel;
        startDate = Date.today();
        contacts = new List<String>();   // nunca null
        hoursIncluded = planLevel == 'Gold' ? 40 : 10;
    }
}

SupportPlan plan = new SupportPlan('Gold');   // el constructor se ejecuta aquí
plan.contacts.add('ana@acme.com');             // funciona: la lista ya existe`,
        en: `public class SupportPlan {
    public String level;
    public Integer hoursIncluded;
    public Date startDate;
    public List<String> contacts;

    // Constructor: same name as the class, no return type
    public SupportPlan(String planLevel) {
        level = planLevel;
        startDate = Date.today();
        contacts = new List<String>();   // never null
        hoursIncluded = planLevel == 'Gold' ? 40 : 10;
    }
}

SupportPlan plan = new SupportPlan('Gold');   // the constructor runs here
plan.contacts.add('ana@acme.com');             // works: the list already exists`,
      },
    },
    {
      type: "list",
      items: [
        {
          es: "Se llama exactamente igual que la clase, con la misma mayúscula.",
          en: "It is named exactly like the class, with the same capital letter.",
        },
        {
          es: "No lleva tipo de retorno, ni siquiera void. Si le pones void, deja de ser un constructor y pasa a ser un método normal que nadie llama.",
          en: "It has no return type, not even void. Put void on it and it stops being a constructor and becomes an ordinary method nobody calls.",
        },
        {
          es: "Lo que va entre los paréntesis de new SupportPlan('Gold') son los argumentos que recibe.",
          en: "What goes in the brackets of new SupportPlan('Gold') are the arguments it receives.",
        },
      ],
    },
    {
      type: "diagram",
      id: "m05-constructor",
      caption: {
        es: "new reserva el objeto, el constructor lo rellena y solo entonces la variable recibe el enlace.",
        en: "new reserves the object, the constructor fills it in, and only then does the variable get the link.",
      },
    },
    {
      type: "h",
      text: { es: "Un objeto válido desde el primer segundo", en: "A valid object from the very first second" },
    },
    {
      type: "p",
      text: {
        es: "Recuerda del Módulo 1 que todo empieza en [[null]], también las listas. Un atributo List<String> contacts; sin inicializar es null, y contacts.add(…) lanzaría una [[excepcion|excepción]]. El constructor es el sitio natural para crear las colecciones vacías y poner los valores por defecto, de modo que nadie que use la clase tenga que acordarse.",
        en: "Remember from Module 1 that everything starts as [[null]], lists included. An attribute List<String> contacts; left uninitialised is null, and contacts.add(…) would throw an [[excepcion|exception]]. The constructor is the natural place to create the empty collections and set the defaults, so nobody using the class has to remember.",
      },
    },
    {
      type: "h",
      text: { es: "El constructor que Apex pone por ti… hasta que escribes uno", en: "The constructor Apex provides for you… until you write one" },
    },
    {
      type: "p",
      text: {
        es: "Si una clase no tiene ningún constructor, Apex le da uno vacío, sin parámetros: por eso new WorkTicket() funcionaba. En cuanto escribes un constructor con parámetros, ese vacío desaparece. Si también quieres permitir new SupportPlan(), tienes que escribirlo tú. Una clase puede tener varios constructores mientras sus parámetros sean distintos.",
        en: "If a class has no constructor at all, Apex gives it an empty one, with no parameters: that is why new WorkTicket() worked. As soon as you write a constructor with parameters, that empty one disappears. If you also want to allow new SupportPlan(), you have to write it yourself. A class can have several constructors as long as their parameters differ.",
      },
    },
    {
      type: "code",
      code: {
        es: `SupportPlan basic = new SupportPlan();   // ❌ no compila: ya no existe el constructor vacío

// Para permitirlo, se escribe explícitamente:
public SupportPlan() {
    level = 'Basic';
    startDate = Date.today();
    contacts = new List<String>();
    hoursIncluded = 5;
}`,
        en: `SupportPlan basic = new SupportPlan();   // ❌ does not compile: the empty constructor is gone

// To allow it, write it explicitly:
public SupportPlan() {
    level = 'Basic';
    startDate = Date.today();
    contacts = new List<String>();
    hoursIncluded = 5;
}`,
      },
      caption: {
        es: "¿Ves las tres líneas repetidas entre los dos constructores? En la próxima lección aprenderás a no repetirlas.",
        en: "See the three lines repeated between the two constructors? Next lesson you will learn not to repeat them.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "Lo que el libro explica del constructor de miPunto —mismo nombre, sin tipo de retorno, se ejecuta con new, puede haber varios— es idéntico en Apex. Lo que puedes saltarte: los constructores de copia y de conversión de C++ (en Apex la copia se hace con clone()) y los destructores, que Apex no tiene.",
        en: "What the book explains about miPunto's constructor — same name, no return type, runs on new, there can be several — is identical in Apex. What you can skip: C++'s copy and conversion constructors (in Apex copying is done with clone()) and destructors, which Apex does not have.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿qué dos cosas distinguen a un constructor de un método normal? ¿Y qué pasa con new MiClase() cuando escribes un constructor que recibe parámetros?",
        en: "Without looking up: which two things set a constructor apart from an ordinary method? And what happens to new MyClass() when you write a constructor that takes parameters?",
      },
    },
  ],

  quiz: [
    {
      id: "m05-l03-q1",
      kind: "single",
      prompt: {
        es: "¿Cuál de estas líneas declara correctamente un constructor de la clase Invoice?",
        en: "Which of these lines correctly declares a constructor for the Invoice class?",
      },
      options: [
        { es: "public Invoice(Decimal amount) {", en: "public Invoice(Decimal amount) {" },
        { es: "public void Invoice(Decimal amount) {", en: "public void Invoice(Decimal amount) {" },
        { es: "public Invoice create(Decimal amount) {", en: "public Invoice create(Decimal amount) {" },
        { es: "public invoice(Decimal amount) {", en: "public invoice(Decimal amount) {" },
      ],
      answer: 0,
      explain: {
        es: "Mismo nombre que la clase y sin tipo de retorno. Con void sería un método llamado Invoice; con otro nombre, un método normal.",
        en: "Same name as the class and no return type. With void it would be a method called Invoice; with another name, an ordinary method.",
      },
      tags: ["recall"],
    },
    {
      id: "m05-l03-q2",
      kind: "single",
      prompt: {
        es: "Esta clase compila. ¿Qué pasa en la línea de uso?",
        en: "This class compiles. What happens on the usage line?",
      },
      code: {
        es: `public class Campaign2027 {
    public String name;
    public Campaign2027(String campaignName) {
        name = campaignName;
    }
}

Campaign2027 c = new Campaign2027();`,
        en: `public class Campaign2027 {
    public String name;
    public Campaign2027(String campaignName) {
        name = campaignName;
    }
}

Campaign2027 c = new Campaign2027();`,
      },
      options: [
        {
          es: "No compila: al escribir un constructor con parámetros, el vacío deja de existir.",
          en: "It does not compile: once a constructor with parameters is written, the empty one stops existing.",
        },
        { es: "Crea la instancia con name = null.", en: "It creates the instance with name = null." },
        { es: "Crea la instancia con name = ''.", en: "It creates the instance with name = ''." },
      ],
      answer: 0,
      explain: {
        es: "Apex solo regala el constructor vacío cuando no has escrito ninguno. Aquí habría que añadir public Campaign2027() { … } o pasar un nombre.",
        en: "Apex only provides the empty constructor when you have written none. Here you would need to add public Campaign2027() { … } or pass a name.",
      },
      tags: ["find-error"],
    },
    {
      id: "m05-l03-q3",
      kind: "single",
      prompt: {
        es: "¿Qué ocurre al ejecutar el uso?",
        en: "What happens when the usage runs?",
      },
      code: {
        es: `public class Team {
    public List<String> members;
    public Team() { }
}

Team t = new Team();
t.members.add('Ana');`,
        en: `public class Team {
    public List<String> members;
    public Team() { }
}

Team t = new Team();
t.members.add('Ana');`,
      },
      options: [
        {
          es: "Lanza una excepción: members es null porque nadie creó la lista.",
          en: "It throws an exception: members is null because nobody created the list.",
        },
        { es: "Añade 'Ana' a la lista.", en: "It adds 'Ana' to the list." },
        { es: "No compila.", en: "It does not compile." },
      ],
      answer: 0,
      explain: {
        es: "Declarar una lista no la crea. El constructor debería hacer members = new List<String>();",
        en: "Declaring a list does not create it. The constructor should do members = new List<String>();",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M1 L6", en: "Review · M1 L6" },
    },
    {
      id: "m05-l03-q4",
      kind: "text",
      prompt: {
        es: "Un constructor no tiene tipo de retorno. ¿Qué palabra, la de «no devuelvo nada», tampoco puede llevar?",
        en: "A constructor has no return type. Which word, the “I return nothing” one, can it not have either?",
      },
      accept: ["void"],
      placeholder: { es: "una palabra", en: "one word" },
      explain: {
        es: "void. Con void deja de ser constructor y se convierte en un método normal.",
        en: "void. With void it stops being a constructor and becomes an ordinary method.",
      },
      tags: ["recall"],
    },
    {
      id: "m05-l03-q5",
      kind: "single",
      prompt: {
        es: "¿Cuándo se ejecuta el código de un constructor?",
        en: "When does a constructor's code run?",
      },
      options: [
        {
          es: "Automáticamente, una vez por cada new.",
          en: "Automatically, once per new.",
        },
        {
          es: "Solo cuando lo llamas por su nombre, como un método.",
          en: "Only when you call it by name, like a method.",
        },
        {
          es: "Una sola vez, la primera vez que se usa la clase.",
          en: "Only once, the first time the class is used.",
        },
      ],
      answer: 0,
      explain: {
        es: "Cada new fabrica una instancia nueva y ejecuta el constructor sobre ella, como cada New en Salesforce aplica los valores por defecto a ese registro.",
        en: "Each new produces a fresh instance and runs the constructor on it, just as each New in Salesforce applies the defaults to that record.",
      },
    },
    {
      id: "m05-l03-q6",
      kind: "single",
      prompt: {
        es: "¿Qué valor tiene hours en cada plan?",
        en: "What value does hours hold on each plan?",
      },
      code: {
        es: `public class Plan {
    public Integer hours;
    public Plan(String level) {
        switch on level {
            when 'Gold'   { hours = 40; }
            when 'Silver' { hours = 20; }
            when else     { hours = 5; }
        }
    }
}
Plan a = new Plan('Silver');
Plan b = new Plan('gold');`,
        en: `public class Plan {
    public Integer hours;
    public Plan(String level) {
        switch on level {
            when 'Gold'   { hours = 40; }
            when 'Silver' { hours = 20; }
            when else     { hours = 5; }
        }
    }
}
Plan a = new Plan('Silver');
Plan b = new Plan('gold');`,
      },
      options: [
        { es: "a: 20 · b: 5", en: "a: 20 · b: 5" },
        { es: "a: 20 · b: 40", en: "a: 20 · b: 40" },
        { es: "a: 5 · b: 5", en: "a: 5 · b: 5" },
      ],
      answer: 0,
      explain: {
        es: "switch distingue mayúsculas: 'gold' no es 'Gold' y cae en when else. Un constructor también puede normalizar: switch on level.toUpperCase() con whens en mayúsculas.",
        en: "switch is case-sensitive: 'gold' is not 'Gold' and falls into when else. A constructor can normalise too: switch on level.toUpperCase() with upper-case whens.",
      },
      tags: ["predict-output", "spaced", "interleaving"],
      from: { es: "Repaso · M2 L2", en: "Review · M2 L2" },
    },
  ],

  exercise: {
    prompt: {
      es: "Customer Success vende planes de soporte. Cada plan debe nacer ya completo: con su nivel, las horas incluidas según el nivel, la fecha de inicio de hoy y una lista vacía de contactos autorizados. Escribe la clase con su constructor y úsala.",
      en: "Customer Success sells support plans. Each plan must be born complete: with its level, the hours included for that level, today's start date and an empty list of authorised contacts. Write the class with its constructor and use it.",
    },
    brief: [
      {
        es: "Clase pública SupportPlan con cuatro atributos públicos: level (String), hoursIncluded (Integer), startDate (Date) y contacts (List<String>).",
        en: "Public class SupportPlan with four public attributes: level (String), hoursIncluded (Integer), startDate (Date) and contacts (List<String>).",
      },
      {
        es: "Un constructor que reciba String planLevel y rellene los cuatro: el nivel recibido, 40 horas para 'Gold', 20 para 'Silver' y 5 para cualquier otro, la fecha de hoy y una lista vacía.",
        en: "A constructor that takes String planLevel and fills in all four: the level received, 40 hours for 'Gold', 20 for 'Silver' and 5 for anything else, today's date and an empty list.",
      },
      {
        es: "Debajo, crea un plan 'Gold' llamado goldPlan y añade un contacto a su lista.",
        en: "Below, create a 'Gold' plan named goldPlan and add a contact to its list.",
      },
    ],
    starter: {
      es: `// 1. Clase SupportPlan con su constructor.


// 2. Uso: crea goldPlan y añade un contacto.
`,
      en: `// 1. SupportPlan class with its constructor.


// 2. Usage: create goldPlan and add a contact.
`,
    },
    hints: [
      {
        es: "El constructor se llama SupportPlan, recibe un parámetro y no tiene tipo de retorno. Dentro rellena los cuatro atributos. Cuidado con la lista: si no la creas, add() fallará.",
        en: "The constructor is called SupportPlan, takes one parameter and has no return type. Inside, it fills in the four attributes. Mind the list: if you do not create it, add() will fail.",
      },
      {
        es: "Las horas dependen de un valor exacto: es trabajo para switch on planLevel (Módulo 2). La fecha de hoy es Date.today() y la lista vacía, new List<String>().",
        en: "The hours depend on an exact value: a job for switch on planLevel (Module 2). Today's date is Date.today() and the empty list, new List<String>().",
      },
      {
        es: "Pseudocódigo: public SupportPlan(String planLevel) { level = planLevel; startDate = Date.today(); contacts = new List<String>(); switch on planLevel { 'Gold' → 40; 'Silver' → 20; else → 5 } } — y después: SupportPlan goldPlan = new SupportPlan('Gold'); goldPlan.contacts.add('…');",
        en: "Pseudocode: public SupportPlan(String planLevel) { level = planLevel; startDate = Date.today(); contacts = new List<String>(); switch on planLevel { 'Gold' → 40; 'Silver' → 20; else → 5 } } — then: SupportPlan goldPlan = new SupportPlan('Gold'); goldPlan.contacts.add('…');",
      },
    ],
    solution: {
      es: `public class SupportPlan {
    public String level;
    public Integer hoursIncluded;
    public Date startDate;
    public List<String> contacts;

    public SupportPlan(String planLevel) {
        level = planLevel;
        startDate = Date.today();
        contacts = new List<String>();
        switch on planLevel {
            when 'Gold' {
                hoursIncluded = 40;
            }
            when 'Silver' {
                hoursIncluded = 20;
            }
            when else {
                hoursIncluded = 5;
            }
        }
    }
}

// Uso
SupportPlan goldPlan = new SupportPlan('Gold');
goldPlan.contacts.add('soporte@acme.com');
System.debug(goldPlan.hoursIncluded);   // 40`,
      en: `public class SupportPlan {
    public String level;
    public Integer hoursIncluded;
    public Date startDate;
    public List<String> contacts;

    public SupportPlan(String planLevel) {
        level = planLevel;
        startDate = Date.today();
        contacts = new List<String>();
        switch on planLevel {
            when 'Gold' {
                hoursIncluded = 40;
            }
            when 'Silver' {
                hoursIncluded = 20;
            }
            when else {
                hoursIncluded = 5;
            }
        }
    }
}

// Usage
SupportPlan goldPlan = new SupportPlan('Gold');
goldPlan.contacts.add('support@acme.com');
System.debug(goldPlan.hoursIncluded);   // 40`,
    },
    checks: [
      {
        id: "m05-l03-c1",
        label: {
          es: "La clase declara los cuatro atributos",
          en: "The class declares the four attributes",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+class\\s+SupportPlan\\s*\\{" },
            { op: "match", pattern: "public\\s+String\\s+level\\s*;" },
            { op: "match", pattern: "public\\s+Integer\\s+hoursIncluded\\s*;" },
            { op: "match", pattern: "public\\s+Date\\s+startDate\\s*;" },
            { op: "match", pattern: "public\\s+List<String>\\s+contacts\\s*;" },
          ],
        },
        onFail: {
          es: "public class SupportPlan { … } con public String level; public Integer hoursIncluded; public Date startDate; public List<String> contacts;",
          en: "public class SupportPlan { … } with public String level; public Integer hoursIncluded; public Date startDate; public List<String> contacts;",
        },
      },
      {
        id: "m05-l03-c2",
        label: {
          es: "Hay un constructor SupportPlan(String planLevel) sin tipo de retorno",
          en: "There is a SupportPlan(String planLevel) constructor with no return type",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+SupportPlan\\s*\\(\\s*String\\s+planLevel\\s*\\)\\s*\\{" },
            { op: "absent", pattern: "void\\s+SupportPlan\\s*\\(" },
          ],
        },
        onFail: {
          es: "Mismo nombre que la clase y sin tipo de retorno —ni siquiera void—: public SupportPlan(String planLevel) { … }",
          en: "Same name as the class and no return type — not even void: public SupportPlan(String planLevel) { … }",
        },
      },
      {
        id: "m05-l03-c3",
        label: {
          es: "El constructor fija el nivel, la fecha de hoy y crea la lista",
          en: "The constructor sets the level, today's date and creates the list",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "level\\s*=\\s*planLevel\\s*;" },
            { op: "match", pattern: "startDate\\s*=\\s*Date\\.today\\(\\s*\\)\\s*;" },
            { op: "match", pattern: "contacts\\s*=\\s*new\\s+List<String>\\s*\\(\\s*\\)\\s*;" },
          ],
        },
        onFail: {
          es: "Dentro del constructor: level = planLevel; startDate = Date.today(); contacts = new List<String>();",
          en: "Inside the constructor: level = planLevel; startDate = Date.today(); contacts = new List<String>();",
        },
      },
      {
        id: "m05-l03-c4",
        label: {
          es: "Las horas dependen del nivel: 40, 20 o 5",
          en: "The hours depend on the level: 40, 20 or 5",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "'Gold'[\\s\\S]{0,60}hoursIncluded\\s*=\\s*40\\s*;" },
            { op: "match", pattern: "'Silver'[\\s\\S]{0,60}hoursIncluded\\s*=\\s*20\\s*;" },
            { op: "match", pattern: "hoursIncluded\\s*=\\s*5\\s*;" },
          ],
        },
        onFail: {
          es: "Tres resultados según un valor exacto: switch on planLevel con when 'Gold' → 40, when 'Silver' → 20 y when else → 5 (o una cadena de if).",
          en: "Three results by an exact value: switch on planLevel with when 'Gold' → 40, when 'Silver' → 20 and when else → 5 (or an if chain).",
        },
      },
      {
        id: "m05-l03-c5",
        label: {
          es: "Crea goldPlan con el constructor y añade un contacto",
          en: "Creates goldPlan with the constructor and adds a contact",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "SupportPlan\\s+goldPlan\\s*=\\s*new\\s+SupportPlan\\s*\\(\\s*'Gold'\\s*\\)" },
            { op: "match", pattern: "goldPlan\\.contacts\\.add\\(\\s*'[^']+'\\s*\\)" },
          ],
        },
        onFail: {
          es: "SupportPlan goldPlan = new SupportPlan('Gold'); y después goldPlan.contacts.add('alguien@empresa.com');",
          en: "SupportPlan goldPlan = new SupportPlan('Gold'); and then goldPlan.contacts.add('someone@company.com');",
        },
        onPass: {
          es: "add() funciona sin que el que usa la clase cree la lista: esa es la gracia de un buen constructor.",
          en: "add() works without the class's user creating the list: that is the point of a good constructor.",
        },
      },
    ],
    rubric: [
      {
        es: "Si alguien escribe new SupportPlan('gold') en minúsculas, ¿cuántas horas recibe? ¿Lo arreglarías en el constructor?",
        en: "If someone writes new SupportPlan('gold') in lower case, how many hours do they get? Would you fix it in the constructor?",
      },
    ],
  },
};
