import type { Lesson } from "@/lib/types";

export const l01ClasesObjetos: Lesson = {
  id: "m05-l01",
  slug: "clases-y-objetos",
  n: 1,
  kind: "lesson",
  minutes: 24,
  title: { es: "Clases y objetos", en: "Classes and objects" },
  summary: {
    es: "Una clase es la definición de un objeto en Object Manager; un objeto es un registro. Ahora vas a crear tus propias definiciones, con sus campos y sus acciones.",
    en: "A class is an object's definition in Object Manager; an object is a record. Now you will create your own definitions, with their fields and their actions.",
  },
  analogy: {
    es: "Definir un objeto personalizado (campos + acciones) y crear registros con él",
    en: "Defining a custom object (fields + actions) and creating records with it",
  },
  objectives: [
    {
      es: "Escribir una clase con atributos y un método que devuelve un valor.",
      en: "Write a class with attributes and a method that returns a value.",
    },
    {
      es: "Crear instancias con new y leer o cambiar sus atributos con el punto.",
      en: "Create instances with new and read or change their attributes with the dot.",
    },
    {
      es: "Explicar por qué cada instancia tiene sus propios valores.",
      en: "Explain why each instance has its own values.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Hasta ahora has usado objetos que Salesforce ya había definido: Account, Opportunity, Case. En el Módulo 1 viste que Account es un molde y que new Account() fabrica una fila nueva. Esta lección da el paso siguiente: escribir tus propios moldes. Eso es una [[clase]], y es la base de todo el código Apex que existe en una org.",
        en: "Until now you have used objects Salesforce had already defined: Account, Opportunity, Case. In Module 1 you saw that Account is a mould and new Account() produces a fresh row. This lesson takes the next step: writing your own moulds. That is a [[clase|class]], and it is the basis of all the Apex code in an org.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Cuando creas un objeto personalizado en Object Manager, defines sus campos y, con botones y acciones, lo que se puede hacer con él. Todavía no existe ningún registro: solo la definición. Después, cada registro que alguien crea tiene sus propios valores en esos campos. Clase = la definición. Objeto o [[instancia]] = un registro.",
        en: "When you create a custom object in Object Manager, you define its fields and, with buttons and actions, what can be done with it. No record exists yet: only the definition. Later, every record someone creates has its own values in those fields. Class = the definition. Object or [[instancia|instance]] = a record.",
      },
    },
    {
      type: "diagram",
      id: "m05-class-vs-object",
      caption: {
        es: "Una clase, muchas instancias. Todas tienen los mismos campos; cada una, sus propios valores.",
        en: "One class, many instances. They all have the same fields; each has its own values.",
      },
    },
    {
      type: "h",
      text: { es: "Anatomía de una clase", en: "Anatomy of a class" },
    },
    {
      type: "code",
      code: {
        es: `public class ServiceTicket {

    // Atributos: los «campos» de la clase
    public String subject;
    public Decimal hoursSpent;
    public Boolean isBillable;

    // Método: una «acción» que usa los atributos
    public Decimal cost(Decimal hourlyRate) {
        if (isBillable != true || hoursSpent == null) {
            return 0;
        }
        return hoursSpent * hourlyRate;
    }
}`,
        en: `public class ServiceTicket {

    // Attributes: the class's "fields"
    public String subject;
    public Decimal hoursSpent;
    public Boolean isBillable;

    // Method: an "action" that uses the attributes
    public Decimal cost(Decimal hourlyRate) {
        if (isBillable != true || hoursSpent == null) {
            return 0;
        }
        return hoursSpent * hourlyRate;
    }
}`,
      },
      caption: {
        es: "public delante de cada pieza permite usarla desde fuera de la clase. Qué significa exactamente, y cuándo no ponerlo, lo verás en Access Modifiers.",
        en: "public in front of each piece lets it be used from outside the class. What it means exactly, and when not to use it, comes in Access Modifiers.",
      },
    },
    {
      type: "list",
      items: [
        {
          es: "public class ServiceTicket { … } declara la clase. Su nombre empieza por mayúscula, como Account: es un tipo.",
          en: "public class ServiceTicket { … } declares the class. Its name starts with a capital, like Account: it is a type.",
        },
        {
          es: "Los atributos se declaran como las variables del Módulo 1, pero dentro de la clase. Todavía no tienen valor: cada instancia pondrá el suyo.",
          en: "Attributes are declared like the variables from Module 1, but inside the class. They have no value yet: each instance will set its own.",
        },
        {
          es: "Un método tiene tipo de retorno (Decimal), nombre (cost), parámetros entre paréntesis (Decimal hourlyRate) y un bloque. return devuelve el valor y termina el método.",
          en: "A method has a return type (Decimal), a name (cost), parameters in brackets (Decimal hourlyRate) and a block. return hands back the value and ends the method.",
        },
        {
          es: "Si un método no devuelve nada, su tipo de retorno es void, como el de System.debug.",
          en: "If a method returns nothing, its return type is void, like System.debug's.",
        },
      ],
    },
    {
      type: "h",
      text: { es: "Fabricar y usar objetos", en: "Making and using objects" },
    },
    {
      type: "code",
      code: {
        es: `ServiceTicket migration = new ServiceTicket();
migration.subject = 'Migración de datos';
migration.hoursSpent = 6;
migration.isBillable = true;

ServiceTicket training = new ServiceTicket();
training.subject = 'Formación interna';
training.hoursSpent = 3;
training.isBillable = false;

System.debug(migration.cost(80));   // 480
System.debug(training.cost(80));    // 0`,
        en: `ServiceTicket migration = new ServiceTicket();
migration.subject = 'Data migration';
migration.hoursSpent = 6;
migration.isBillable = true;

ServiceTicket training = new ServiceTicket();
training.subject = 'Internal training';
training.hoursSpent = 3;
training.isBillable = false;

System.debug(migration.cost(80));   // 480
System.debug(training.cost(80));    // 0`,
      },
      caption: {
        es: "new ServiceTicket() fabrica una instancia. El punto entra en ella: migration.subject es el campo de esa instancia; migration.cost(80) ejecuta su acción.",
        en: "new ServiceTicket() produces an instance. The dot goes into it: migration.subject is that instance's field; migration.cost(80) runs its action.",
      },
    },
    {
      type: "p",
      text: {
        es: "El mismo método da resultados distintos porque cada instancia tiene sus propios valores: cuando cost() lee hoursSpent, lee el de la instancia sobre la que lo llamaste. Es lo mismo que un campo fórmula: una única definición, un resultado distinto en cada registro.",
        en: "The same method gives different results because each instance has its own values: when cost() reads hoursSpent, it reads the one of the instance you called it on. It is the same as a formula field: one definition, a different result on each record.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "Todo lo que el libro dice de clase, objeto, instancia, atributos y el operador punto vale igual en Apex. La diferencia práctica: en tu org, cada clase se guarda en su propio archivo (Setup → Apex Classes, o VS Code) y Salesforce la compila al guardarla. En los ejercicios de este módulo escribirás la clase y, debajo, el código que la usa, como si ya la hubieras guardado y la probaras en Execute Anonymous.",
        en: "Everything the book says about class, object, instance, attributes and the dot operator holds in Apex. The practical difference: in your org, each class is saved in its own file (Setup → Apex Classes, or VS Code) and Salesforce compiles it on save. In this module's exercises you will write the class and, below it, the code that uses it, as if you had already saved it and were trying it in Execute Anonymous.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿qué es la clase y qué es la instancia en «el objeto Case» y «el caso 00001234»? ¿Y qué pieza de un método indica lo que devuelve?",
        en: "Without looking up: in “the Case object” and “case 00001234”, which is the class and which is the instance? And which piece of a method says what it returns?",
      },
    },
  ],

  quiz: [
    {
      id: "m05-l01-q1",
      kind: "single",
      prompt: {
        es: "En Salesforce, ¿qué equivale a una instancia de una clase?",
        en: "In Salesforce, what is the equivalent of an instance of a class?",
      },
      options: [
        { es: "Un registro concreto, como la cuenta «Acme»", en: "A specific record, like the “Acme” account" },
        { es: "La definición del objeto en Object Manager", en: "The object's definition in Object Manager" },
        { es: "Un campo del objeto", en: "A field on the object" },
        { es: "Un page layout", en: "A page layout" },
      ],
      answer: 0,
      explain: {
        es: "La definición es la clase; cada registro fabricado con ella es una instancia con sus propios valores.",
        en: "The definition is the class; every record made from it is an instance with its own values.",
      },
      tags: ["recall"],
    },
    {
      id: "m05-l01-q2",
      kind: "single",
      prompt: { es: "¿Qué muestra este código?", en: "What does this code print?" },
      code: {
        es: `ServiceTicket a = new ServiceTicket();
a.hoursSpent = 2;
a.isBillable = true;
ServiceTicket b = new ServiceTicket();
b.hoursSpent = 5;
b.isBillable = true;
System.debug(a.cost(100));`,
        en: `ServiceTicket a = new ServiceTicket();
a.hoursSpent = 2;
a.isBillable = true;
ServiceTicket b = new ServiceTicket();
b.hoursSpent = 5;
b.isBillable = true;
System.debug(a.cost(100));`,
      },
      options: [
        { es: "200", en: "200" },
        { es: "500", en: "500" },
        { es: "700", en: "700" },
        { es: "0", en: "0" },
      ],
      answer: 0,
      explain: {
        es: "cost() lee el hoursSpent de la instancia sobre la que se llama: a tiene 2 horas. Lo que tenga b no le afecta.",
        en: "cost() reads the hoursSpent of the instance it is called on: a has 2 hours. Whatever b holds does not affect it.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m05-l01-q3",
      kind: "single",
      prompt: {
        es: "Este método no compila. ¿Por qué?",
        en: "This method does not compile. Why?",
      },
      code: {
        es: `public Decimal discountedPrice(Decimal price) {
    Decimal result = price * 0.9;
}`,
        en: `public Decimal discountedPrice(Decimal price) {
    Decimal result = price * 0.9;
}`,
      },
      options: [
        {
          es: "Promete devolver un Decimal y no tiene return.",
          en: "It promises to return a Decimal and has no return.",
        },
        {
          es: "Los parámetros no pueden ser Decimal.",
          en: "Parameters cannot be Decimal.",
        },
        {
          es: "Falta la palabra void.",
          en: "The word void is missing.",
        },
      ],
      answer: 0,
      explain: {
        es: "El tipo de retorno es una promesa, como el tipo de una variable. Si dices Decimal, tiene que haber un return result;. Si no quisieras devolver nada, el tipo sería void.",
        en: "The return type is a promise, like a variable's type. If you say Decimal, there must be a return result;. If you did not want to return anything, the type would be void.",
      },
      tags: ["find-error", "spaced"],
      from: { es: "Repaso · M1 L1", en: "Review · M1 L1" },
    },
    {
      id: "m05-l01-q4",
      kind: "text",
      prompt: {
        es: "¿Qué palabra clave fabrica una instancia nueva de una clase?",
        en: "Which keyword produces a new instance of a class?",
      },
      accept: ["new"],
      placeholder: { es: "una palabra", en: "one word" },
      explain: {
        es: "new. La misma que ya usabas con new Account() o new List<String>().",
        en: "new. The same one you already used with new Account() or new List<String>().",
      },
      tags: ["recall", "spaced"],
      from: { es: "Repaso · M1 L5", en: "Review · M1 L5" },
    },
    {
      id: "m05-l01-q5",
      kind: "multi",
      prompt: {
        es: "¿Qué afirmaciones son ciertas sobre una clase?",
        en: "Which statements about a class are true?",
      },
      options: [
        {
          es: "Define qué atributos y métodos tendrá cada instancia.",
          en: "It defines which attributes and methods every instance will have.",
        },
        {
          es: "Por sí sola no guarda los valores de ningún registro concreto.",
          en: "On its own it does not hold the values of any specific record.",
        },
        {
          es: "Solo se puede fabricar una instancia de cada clase.",
          en: "Only one instance of each class can be made.",
        },
        {
          es: "Su nombre se escribe con inicial mayúscula porque es un tipo.",
          en: "Its name is written with a leading capital because it is a type.",
        },
      ],
      answers: [0, 1, 3],
      explain: {
        es: "De una clase salen tantas instancias como necesites, igual que de un objeto salen tantos registros como quieras.",
        en: "A class yields as many instances as you need, just as an object yields as many records as you want.",
      },
    },
    {
      id: "m05-l01-q6",
      kind: "single",
      prompt: {
        es: "Un método que envía un aviso y no devuelve nada, ¿qué tipo de retorno lleva?",
        en: "A method that sends a notice and returns nothing — what return type does it have?",
      },
      options: [
        { es: "void", en: "void" },
        { es: "null", en: "null" },
        { es: "Boolean", en: "Boolean" },
        { es: "Ninguno: se deja vacío", en: "None: it is left blank" },
      ],
      answer: 0,
      explain: {
        es: "void significa «no devuelvo nada». El tipo de retorno nunca se deja vacío; solo los constructores, que verás en dos lecciones, no llevan.",
        en: "void means “I return nothing”. The return type is never left blank; only constructors, which you will see in two lessons, have none.",
      },
      tags: ["interleaving"],
    },
  ],

  exercise: {
    prompt: {
      es: "Tu equipo de Servicios Profesionales quiere calcular el coste de sus partes de trabajo antes de facturar. Define la clase y úsala para dos partes: uno facturable y uno interno.",
      en: "Your Professional Services team wants to work out the cost of its work tickets before invoicing. Define the class and use it for two tickets: one billable and one internal.",
    },
    brief: [
      {
        es: "Una clase pública WorkTicket con tres atributos públicos: subject (texto), hoursSpent (número con decimales) e isBillable (sí/no).",
        en: "A public class WorkTicket with three public attributes: subject (text), hoursSpent (number with decimals) and isBillable (yes/no).",
      },
      {
        es: "Un método público cost que reciba la tarifa por hora (Decimal hourlyRate) y devuelva un Decimal: horas × tarifa si es facturable, y 0 si no lo es.",
        en: "A public method cost that takes the hourly rate (Decimal hourlyRate) and returns a Decimal: hours × rate if billable, and 0 otherwise.",
      },
      {
        es: "Debajo de la clase, crea dos instancias: billableTicket (8 horas, facturable) e internalTicket (3 horas, no facturable), y guarda el coste de cada una con una tarifa de 95.",
        en: "Below the class, create two instances: billableTicket (8 hours, billable) and internalTicket (3 hours, not billable), and store each one's cost at a rate of 95.",
      },
    ],
    starter: {
      es: `// 1. Define la clase WorkTicket.


// 2. Uso (como en Execute Anonymous): crea las dos instancias y calcula su coste.
`,
      en: `// 1. Define the WorkTicket class.


// 2. Usage (as in Execute Anonymous): create both instances and work out their cost.
`,
    },
    hints: [
      {
        es: "Son dos piezas: la clase (con sus atributos y su método) y, fuera de sus llaves, el código que la usa. Revisa que el método tenga tipo de retorno, parámetro y return en todas sus ramas.",
        en: "There are two pieces: the class (with its attributes and its method) and, outside its braces, the code that uses it. Check that the method has a return type, a parameter and a return on every branch.",
      },
      {
        es: "Los atributos son String, Decimal y Boolean. En el método, si no es facturable devuelve 0; si lo es, devuelve hoursSpent * hourlyRate. Para usarla: WorkTicket x = new WorkTicket(); y después x.hoursSpent = 8; …",
        en: "The attributes are String, Decimal and Boolean. In the method, if not billable return 0; if it is, return hoursSpent * hourlyRate. To use it: WorkTicket x = new WorkTicket(); then x.hoursSpent = 8; …",
      },
      {
        es: "Pseudocódigo: public class WorkTicket { public String subject; public Decimal hoursSpent; public Boolean isBillable; public Decimal cost(Decimal hourlyRate) { si no facturable → return 0; return hoursSpent * hourlyRate; } }",
        en: "Pseudocode: public class WorkTicket { public String subject; public Decimal hoursSpent; public Boolean isBillable; public Decimal cost(Decimal hourlyRate) { if not billable → return 0; return hoursSpent * hourlyRate; } }",
      },
    ],
    solution: {
      es: `public class WorkTicket {
    public String subject;
    public Decimal hoursSpent;
    public Boolean isBillable;

    public Decimal cost(Decimal hourlyRate) {
        if (isBillable != true || hoursSpent == null) {
            return 0;
        }
        return hoursSpent * hourlyRate;
    }
}

// Uso
WorkTicket billableTicket = new WorkTicket();
billableTicket.subject = 'Configuración de CPQ';
billableTicket.hoursSpent = 8;
billableTicket.isBillable = true;

WorkTicket internalTicket = new WorkTicket();
internalTicket.subject = 'Reunión de equipo';
internalTicket.hoursSpent = 3;
internalTicket.isBillable = false;

Decimal billableCost = billableTicket.cost(95);   // 760
Decimal internalCost = internalTicket.cost(95);   // 0`,
      en: `public class WorkTicket {
    public String subject;
    public Decimal hoursSpent;
    public Boolean isBillable;

    public Decimal cost(Decimal hourlyRate) {
        if (isBillable != true || hoursSpent == null) {
            return 0;
        }
        return hoursSpent * hourlyRate;
    }
}

// Usage
WorkTicket billableTicket = new WorkTicket();
billableTicket.subject = 'CPQ setup';
billableTicket.hoursSpent = 8;
billableTicket.isBillable = true;

WorkTicket internalTicket = new WorkTicket();
internalTicket.subject = 'Team meeting';
internalTicket.hoursSpent = 3;
internalTicket.isBillable = false;

Decimal billableCost = billableTicket.cost(95);   // 760
Decimal internalCost = internalTicket.cost(95);   // 0`,
    },
    checks: [
      {
        id: "m05-l01-c1",
        label: { es: "Se declara public class WorkTicket", en: "public class WorkTicket is declared" },
        rule: { op: "match", pattern: "public\\s+class\\s+WorkTicket\\s*\\{" },
        onFail: {
          es: "La clase empieza así: public class WorkTicket { … } — con mayúscula inicial, porque es un tipo.",
          en: "The class starts like this: public class WorkTicket { … } — with a leading capital, because it is a type.",
        },
      },
      {
        id: "m05-l01-c2",
        label: {
          es: "Tiene los tres atributos con su tipo",
          en: "It has the three attributes with their types",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+String\\s+subject\\s*;" },
            { op: "match", pattern: "public\\s+Decimal\\s+hoursSpent\\s*;" },
            { op: "match", pattern: "public\\s+Boolean\\s+isBillable\\s*;" },
          ],
        },
        onFail: {
          es: "Texto, número con decimales y sí/no: public String subject; public Decimal hoursSpent; public Boolean isBillable;",
          en: "Text, number with decimals and yes/no: public String subject; public Decimal hoursSpent; public Boolean isBillable;",
        },
      },
      {
        id: "m05-l01-c3",
        label: {
          es: "El método cost recibe la tarifa y devuelve un Decimal",
          en: "The cost method takes the rate and returns a Decimal",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+Decimal\\s+cost\\s*\\(\\s*Decimal\\s+hourlyRate\\s*\\)\\s*\\{" },
            { op: "match", pattern: "return\\s+0\\s*;" },
            { op: "match", pattern: "return\\s+hoursSpent\\s*\\*\\s*hourlyRate\\s*;|return\\s+hourlyRate\\s*\\*\\s*hoursSpent\\s*;" },
          ],
        },
        onFail: {
          es: "public Decimal cost(Decimal hourlyRate) { … } con dos return: 0 si no es facturable y hoursSpent * hourlyRate si lo es.",
          en: "public Decimal cost(Decimal hourlyRate) { … } with two returns: 0 if not billable and hoursSpent * hourlyRate if it is.",
        },
      },
      {
        id: "m05-l01-c4",
        label: {
          es: "Crea las dos instancias con new",
          en: "Creates both instances with new",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "WorkTicket\\s+billableTicket\\s*=\\s*new\\s+WorkTicket\\s*\\(\\s*\\)" },
            { op: "match", pattern: "WorkTicket\\s+internalTicket\\s*=\\s*new\\s+WorkTicket\\s*\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "Cada parte es una instancia: WorkTicket billableTicket = new WorkTicket(); y lo mismo para internalTicket.",
          en: "Each ticket is an instance: WorkTicket billableTicket = new WorkTicket(); and the same for internalTicket.",
        },
      },
      {
        id: "m05-l01-c5",
        label: {
          es: "Rellena los valores de cada instancia y llama a cost(95)",
          en: "Fills in each instance's values and calls cost(95)",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "billableTicket\\.hoursSpent\\s*=\\s*8\\s*;" },
            { op: "match", pattern: "billableTicket\\.isBillable\\s*=\\s*true\\s*;" },
            { op: "match", pattern: "internalTicket\\.hoursSpent\\s*=\\s*3\\s*;" },
            { op: "match", pattern: "internalTicket\\.isBillable\\s*=\\s*false\\s*;" },
            { op: "match", pattern: "billableTicket\\.cost\\(\\s*95\\s*\\)" },
            { op: "match", pattern: "internalTicket\\.cost\\(\\s*95\\s*\\)" },
          ],
        },
        onFail: {
          es: "Con el punto entras en cada instancia: billableTicket.hoursSpent = 8; billableTicket.isBillable = true; … y después billableTicket.cost(95).",
          en: "The dot takes you into each instance: billableTicket.hoursSpent = 8; billableTicket.isBillable = true; … and then billableTicket.cost(95).",
        },
        onPass: {
          es: "Un método, dos resultados: 760 y 0. Cada instancia responde con sus propios valores.",
          en: "One method, two results: 760 and 0. Each instance answers with its own values.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué devuelve tu método si alguien crea un WorkTicket y nunca rellena isBillable? ¿Falla o devuelve 0?",
        en: "What does your method return if someone creates a WorkTicket and never fills in isBillable? Does it fail or return 0?",
      },
    ],
  },
};
