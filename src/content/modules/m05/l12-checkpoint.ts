import type { Lesson } from "@/lib/types";

export const l12Checkpoint: Lesson = {
  id: "m05-l12",
  slug: "checkpoint",
  n: 12,
  kind: "checkpoint",
  minutes: 50,
  title: { es: "Checkpoint del Módulo 5", en: "Module 5 Checkpoint" },
  summary: {
    es: "Las once piezas de la programación orientada a objetos trabajando juntas en un sistema de comisiones, y tu primera clase guardada en una org real.",
    en: "The eleven pieces of object-oriented programming working together in a commission system, and your first class saved in a real org.",
  },
  analogy: {
    es: "Diseñar un modelo de datos completo en Object Manager, pero con comportamiento",
    en: "Designing a complete data model in Object Manager, but with behaviour",
  },
  objectives: [
    {
      es: "Traducir cada concepto de la POO a su equivalente de Admin y de vuelta.",
      en: "Translate each OOP concept to its Admin equivalent and back.",
    },
    {
      es: "Diseñar una pequeña jerarquía con interfaz, clase abstracta e hijas concretas.",
      en: "Design a small hierarchy with an interface, an abstract class and concrete children.",
    },
    {
      es: "Guardar y ejecutar una clase en una Developer Org de verdad.",
      en: "Save and run a class in a real Developer Org.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Con este módulo has cruzado la línea que separa escribir instrucciones de diseñar código. Todo lo que sigue en el curso —triggers, handlers, asíncrono, tests— está hecho de clases, y ahora ya sabes leerlas y escribirlas.",
        en: "With this module you have crossed the line between writing instructions and designing code. Everything that follows in the course — triggers, handlers, async, tests — is made of classes, and now you know how to read and write them.",
      },
    },
    {
      type: "h",
      text: { es: "Lo que has aprendido, sub-lección a sub-lección", en: "What you learned, sub-lesson by sub-lesson" },
    },
    {
      type: "p",
      text: {
        es: "1 · Clases y objetos. Una clase es la definición de un objeto en Object Manager; una instancia es un registro. Los atributos son sus campos y los métodos sus acciones, con tipo de retorno, parámetros y return. new fabrica instancias y el punto entra en ellas.",
        en: "1 · Classes and objects. A class is an object's definition in Object Manager; an instance is a record. Attributes are its fields and methods its actions, with a return type, parameters and return. new produces instances and the dot goes into them.",
      },
    },
    {
      type: "p",
      text: {
        es: "2 · Referencias. Una variable de objeto guarda el enlace, no el objeto: dos variables pueden ser dos pestañas del mismo registro. Por eso un bucle o un método pueden cambiar registros, y por eso clone() existe. === pregunta si es el mismo objeto.",
        en: "2 · References. An object variable holds the link, not the object: two variables can be two tabs of the same record. That is why a loop or a method can change records, and why clone() exists. === asks whether it is the same object.",
      },
    },
    {
      type: "p",
      text: {
        es: "3 · Constructores. Los valores por defecto al pulsar New: mismo nombre que la clase, sin tipo de retorno, se ejecuta en cada new. Crea las listas vacías para que nada empiece en null. Si escribes uno con parámetros, el vacío desaparece.",
        en: "3 · Constructors. The default values when you click New: same name as the class, no return type, runs on every new. It creates the empty lists so nothing starts as null. Write one with parameters and the empty one disappears.",
      },
    },
    {
      type: "p",
      text: {
        es: "4 · this. El $Record de la clase: this.level distingue el atributo del parámetro del mismo nombre, y this(…) encadena constructores para no repetir lógica. level = level; compila y no hace nada.",
        en: "4 · this. The class's $Record: this.level tells the attribute from a same-named parameter, and this(…) chains constructors so logic is not repeated. level = level; compiles and does nothing.",
      },
    },
    {
      type: "p",
      text: {
        es: "5 · Static. Lo de cada registro frente a lo de toda la org, como un campo frente a un Custom Setting. Los métodos estáticos se llaman con el nombre de la clase —ya usabas Date.today()— y no tienen this. En Apex, una variable estática vive una transacción.",
        en: "5 · Static. What belongs to each record versus what belongs to the whole org, like a field versus a Custom Setting. Static methods are called through the class name — you already used Date.today() — and have no this. In Apex, a static variable lives for one transaction.",
      },
    },
    {
      type: "p",
      text: {
        es: "6 · Access modifiers. Field-Level Security para el código: private (por defecto), protected, public y global. Las propiedades { get; private set; } dejan leer sin dejar escribir, y los métodos que validan son las reglas de validación de tu clase.",
        en: "6 · Access modifiers. Field-Level Security for code: private (the default), protected, public and global. { get; private set; } properties allow reading without allowing writing, and validating methods are your class's validation rules.",
      },
    },
    {
      type: "p",
      text: {
        es: "7 · Herencia. extends da a la hija todo lo del padre, como los campos estándar que todo objeto trae de serie. En Apex el padre tiene que ser virtual o abstract, la hija llama a super(…) en la primera línea y solo hay un padre. Hereda solo si «es un».",
        en: "7 · Inheritance. extends gives the child everything from the parent, like the standard fields every object comes with. In Apex the parent must be virtual or abstract, the child calls super(…) on its first line, and there is only one parent. Inherit only if it “is a”.",
      },
    },
    {
      type: "p",
      text: {
        es: "8 · virtual, abstract y override. virtual permite cambiar, abstract obliga a implementar, override es la hija haciéndolo a su manera, y super.método() amplía en vez de sustituir. Una clase abstracta, como Activity, no se instancia.",
        en: "8 · virtual, abstract and override. virtual allows changing, abstract requires implementing, override is the child doing it its own way, and super.method() extends instead of replacing. An abstract class, like Activity, is never instantiated.",
      },
    },
    {
      type: "p",
      text: {
        es: "9 · Sobrecarga y sobrescritura. Sobrecarga: mismo nombre y distintos parámetros en una clase, elegido al compilar. Sobrescritura: mismos parámetros en una hija, elegida al ejecutar por el objeto real.",
        en: "9 · Overloading and overriding. Overloading: same name and different parameters in one class, chosen at compile time. Overriding: same parameters in a child, chosen at runtime by the real object.",
      },
    },
    {
      type: "p",
      text: {
        es: "10 · Interfaces y polimorfismo. Un contrato de firmas —como Schedulable para aparecer en Schedule Apex— que cualquier clase puede cumplir, varias a la vez. Una lista de objetos distintos con el mismo contrato se recorre igual, y añadir uno nuevo no toca el bucle.",
        en: "10 · Interfaces and polymorphism. A contract of signatures — like Schedulable for appearing in Schedule Apex — that any class can meet, several at once. A list of different objects with the same contract is walked the same way, and adding a new one does not touch the loop.",
      },
    },
    {
      type: "p",
      text: {
        es: "11 · Clases internas y enums. Un enum es un picklist restringido que vigila el compilador; en un switch, sus when van sin prefijo. Una clase interna agrupa lo que solo sirve a su clase, y el wrapper junta datos de varios registros en un objeto a medida.",
        en: "11 · Inner classes and enums. An enum is a restricted picklist the compiler enforces; in a switch, its whens take no prefix. An inner class groups what only serves its class, and the wrapper gathers data from several records into a tailored object.",
      },
    },
    {
      type: "diagram",
      id: "m05-cp-map",
      caption: {
        es: "Todo lo que ya sabías como Admin tenía un nombre en programación orientada a objetos.",
        en: "Everything you already knew as an Admin had a name in object-oriented programming.",
      },
    },
    {
      type: "h",
      text: { es: "Ahora en tu Developer Org", en: "Now in your Developer Org" },
    },
    {
      type: "p",
      text: {
        es: "Hasta aquí el curso ha validado tu código leyéndolo. A partir de este módulo también vas a guardarlo en Salesforce, que es donde se aprende a leer errores de verdad. Solo necesitas una Developer Edition gratuita, que no caduca.",
        en: "So far the course has validated your code by reading it. From this module on you will also save it in Salesforce, which is where you learn to read real errors. All you need is a free Developer Edition, which never expires.",
      },
    },
    {
      type: "list",
      ordered: true,
      items: [
        {
          es: "Crea la org en developer.salesforce.com/signup (si ya tienes una de Trailhead, también sirve).",
          en: "Create the org at developer.salesforce.com/signup (a Trailhead one works too).",
        },
        {
          es: "Setup → Apex Classes → New. Pega solo una clase —por ejemplo la PricingUtils de la lección 5— y pulsa Save. Si hay un error, Salesforce te dice la línea: es el compilador que llevas cinco módulos imaginando.",
          en: "Setup → Apex Classes → New. Paste a single class — for example PricingUtils from lesson 5 — and click Save. If there is an error, Salesforce tells you the line: it is the compiler you have been imagining for five modules.",
        },
        {
          es: "Abre la Developer Console (menú del engranaje) → Debug → Open Execute Anonymous Window. Pega el código de uso, marca Open Log y pulsa Execute.",
          en: "Open the Developer Console (gear menu) → Debug → Open Execute Anonymous Window. Paste the usage code, tick Open Log and click Execute.",
        },
        {
          es: "En el log, marca Debug Only: ahí están tus System.debug. Ese es el resultado real, calculado por Salesforce.",
          en: "In the log, tick Debug Only: your System.debug lines are there. That is the real result, computed by Salesforce.",
        },
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Una clase por archivo", en: "One class per file" },
      text: {
        es: "En los ejercicios escribes varias clases seguidas y el código de uso debajo. En la org, cada clase de primer nivel va en su propio archivo (su propio New), y el código de uso va en Execute Anonymous. Las clases internas y los enums sí viajan dentro de su clase.",
        en: "In the exercises you write several classes in a row with the usage code below. In the org, each top-level class goes in its own file (its own New), and the usage code goes in Execute Anonymous. Inner classes and enums do travel inside their class.",
      },
    },
    {
      type: "h",
      text: { es: "El mapa completo: POO en lenguaje de Admin", en: "The full map: OOP in Admin language" },
    },
    {
      type: "table",
      head: [
        { es: "Concepto", en: "Concept" },
        { es: "Lo que ya conocías", en: "What you already knew" },
        { es: "Para qué lo usarás", en: "What you will use it for" },
      ],
      rows: [
        [{ es: "Clase / objeto", en: "Class / object" }, { es: "Objeto de Object Manager / registro", en: "Object Manager object / record" }, { es: "Todo el código a partir de aquí", en: "All code from here on" }],
        [{ es: "Referencia", en: "Reference" }, { es: "El mismo contacto en dos related lists", en: "The same contact in two related lists" }, { es: "Cambiar registros dentro de bucles y servicios", en: "Changing records inside loops and services" }],
        [{ es: "Constructor", en: "Constructor" }, { es: "Acción rápida con valores predefinidos", en: "Quick action with predefined values" }, { es: "Objetos que nacen válidos", en: "Objects born valid" }],
        [{ es: "this", en: "this" }, { es: "$Record en un flow", en: "$Record in a flow" }, { es: "Constructores y clases de datos de prueba (M10)", en: "Constructors and test-data classes (M10)" }],
        [{ es: "static", en: "static" }, { es: "Custom Setting de toda la org", en: "Org-wide custom setting" }, { es: "Servicios y guardias de triggers (M7)", en: "Services and trigger guards (M7)" }],
        [{ es: "private / get; private set;", en: "private / get; private set;" }, { es: "Field-Level Security y reglas de validación", en: "Field-level security and validation rules" }, { es: "Clases que no se pueden usar mal", en: "Classes that cannot be misused" }],
        [{ es: "Herencia / abstract", en: "Inheritance / abstract" }, { es: "Activity → Task y Event", en: "Activity → Task and Event" }, { es: "Frameworks de triggers (M7)", en: "Trigger frameworks (M7)" }],
        [{ es: "Interfaz", en: "Interface" }, { es: "El contrato de un subflow", en: "A subflow's contract" }, { es: "Schedulable, Queueable, Batchable (M9)", en: "Schedulable, Queueable, Batchable (M9)" }],
        [{ es: "Enum / wrapper", en: "Enum / wrapper" }, { es: "Picklist restringido / fila de informe", en: "Restricted picklist / report row" }, { es: "Pantallas y resultados de servicios", en: "Screens and service results" }],
      ],
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Diseñar clases es diseñar un modelo de datos", en: "Designing classes is designing a data model" },
      text: {
        es: "Cuando te piden un proceso nuevo, antes de tocar Flow dibujas los objetos y sus relaciones: qué es padre de qué, qué campos son comunes. Con las clases se hace igual y en el mismo orden: primero qué cosas hay y qué comparten (herencia), luego qué saben hacer (métodos e interfaces), y al final qué se protege (private). Tu experiencia diseñando modelos de datos es la mejor preparación que existe para esto.",
        en: "When asked for a new process, before touching Flow you sketch the objects and their relationships: what is parent of what, which fields are common. With classes you do the same, in the same order: first which things exist and what they share (inheritance), then what they know how to do (methods and interfaces), and finally what gets protected (private). Your experience designing data models is the best preparation there is for this.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes del quiz", en: "Before the quiz" },
      text: {
        es: "Sin mirar el diagrama: ¿qué concepto de la POO es el Custom Setting? ¿Y el Record Type que sustituye el layout? ¿Y Activity?",
        en: "Without looking at the diagram: which OOP concept is the Custom Setting? And the Record Type replacing the layout? And Activity?",
      },
    },
  ],

  quiz: [
    {
      id: "m05-l12-q1",
      kind: "single",
      prompt: { es: "¿Qué muestra este código?", en: "What does this code print?" },
      code: {
        es: `Contact a = new Contact(LastName = 'Ruiz');
Contact b = a;
Contact c = a.clone();
b.LastName = 'Kim';
System.debug(a.LastName + ' · ' + c.LastName);`,
        en: `Contact a = new Contact(LastName = 'Ruiz');
Contact b = a;
Contact c = a.clone();
b.LastName = 'Kim';
System.debug(a.LastName + ' · ' + c.LastName);`,
      },
      options: [
        { es: "Kim · Ruiz", en: "Kim · Ruiz" },
        { es: "Ruiz · Ruiz", en: "Ruiz · Ruiz" },
        { es: "Kim · Kim", en: "Kim · Kim" },
      ],
      answer: 0,
      explain: {
        es: "b es otra pestaña del mismo registro que a. c es una copia hecha antes del cambio: no se entera.",
        en: "b is another tab of the same record as a. c is a copy made before the change: it never finds out.",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M5 L2", en: "Review · M5 L2" },
    },
    {
      id: "m05-l12-q2",
      kind: "single",
      prompt: {
        es: "¿Qué concepto de la POO se parece más a un Custom Setting de organización?",
        en: "Which OOP concept is most like an org-level Custom Setting?",
      },
      options: [
        { es: "Un miembro static", en: "A static member" },
        { es: "Un atributo de instancia", en: "An instance attribute" },
        { es: "Un constructor", en: "A constructor" },
        { es: "Una clase interna", en: "An inner class" },
      ],
      answer: 0,
      explain: {
        es: "Un único valor compartido por toda la org, que no pertenece a ningún registro concreto. (Aunque recuerda: una variable static solo vive una transacción.)",
        en: "A single value shared by the whole org, belonging to no specific record. (But remember: a static variable only lives for one transaction.)",
      },
      tags: ["interleaving", "spaced"],
      from: { es: "Repaso · M5 L5", en: "Review · M5 L5" },
    },
    {
      id: "m05-l12-q3",
      kind: "single",
      prompt: {
        es: "¿Qué le pasa a este constructor?",
        en: "What is wrong with this constructor?",
      },
      code: {
        es: `public class Territory {
    public String region;
    public Territory(String region) {
        region = region;
    }
}`,
        en: `public class Territory {
    public String region;
    public Territory(String region) {
        region = region;
    }
}`,
      },
      options: [
        {
          es: "Compila, pero el atributo region se queda en null: falta this.",
          en: "It compiles, but the region attribute stays null: this is missing.",
        },
        { es: "No compila: falta void.", en: "It does not compile: void is missing." },
        { es: "Funciona correctamente.", en: "It works correctly." },
      ],
      answer: 0,
      explain: {
        es: "El parámetro tapa al atributo. this.region = region; es lo que quería decir.",
        en: "The parameter hides the attribute. this.region = region; is what was meant.",
      },
      tags: ["find-error", "spaced"],
      from: { es: "Repaso · M5 L4", en: "Review · M5 L4" },
    },
    {
      id: "m05-l12-q4",
      kind: "multi",
      prompt: {
        es: "¿Qué hace falta para que una clase Apex pueda sustituir un método de su padre?",
        en: "What is needed for an Apex class to replace a method of its parent?",
      },
      options: [
        { es: "Que el padre sea virtual o abstract.", en: "The parent is virtual or abstract." },
        { es: "Que el método del padre sea virtual o abstract.", en: "The parent's method is virtual or abstract." },
        { es: "Que la hija escriba override.", en: "The child writes override." },
        { es: "Que la hija sea static.", en: "The child is static." },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Tres permisos explícitos: clase abierta, método abierto y la hija declarando que lo sustituye.",
        en: "Three explicit permissions: an open class, an open method and the child declaring it replaces it.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M5 L8", en: "Review · M5 L8" },
    },
    {
      id: "m05-l12-q5",
      kind: "single",
      prompt: {
        es: "Varias clases de reglas de validación no comparten código, pero todas tienen que ofrecer Boolean isValid(Account a). ¿Qué usas?",
        en: "Several validation-rule classes share no code, but all must offer Boolean isValid(Account a). What do you use?",
      },
      options: [
        { es: "Una interfaz", en: "An interface" },
        { es: "Una clase abstracta", en: "An abstract class" },
        { es: "Un enum", en: "An enum" },
      ],
      answer: 0,
      explain: {
        es: "Solo comparten una capacidad, no código: interfaz. Si compartieran código, clase abstracta.",
        en: "They share only a capability, not code: interface. If they shared code, an abstract class.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m05-l12-q6",
      kind: "text",
      prompt: {
        es: "¿Qué palabra clave llama al constructor del padre desde el constructor de la hija?",
        en: "Which keyword calls the parent's constructor from the child's constructor?",
      },
      accept: ["super", "super\\(\\)"],
      placeholder: { es: "una palabra", en: "one word" },
      explain: {
        es: "super(…), en la primera línea. this(…) llama a otro constructor de la misma clase.",
        en: "super(…), on the first line. this(…) calls another constructor of the same class.",
      },
      tags: ["recall"],
    },
    {
      id: "m05-l12-q7",
      kind: "single",
      prompt: { es: "¿Qué muestra este código?", en: "What does this code print?" },
      code: {
        es: `public virtual class Base {
    public virtual String who() { return 'base'; }
    public String greet() { return 'soy ' + who(); }
}
public class Child extends Base {
    public override String who() { return 'hija'; }
}
Base x = new Child();
System.debug(x.greet());`,
        en: `public virtual class Base {
    public virtual String who() { return 'base'; }
    public String greet() { return 'I am ' + who(); }
}
public class Child extends Base {
    public override String who() { return 'child'; }
}
Base x = new Child();
System.debug(x.greet());`,
      },
      options: [
        { es: "soy hija / I am child", en: "I am child" },
        { es: "soy base / I am base", en: "I am base" },
        { es: "No compila", en: "It does not compile" },
      ],
      answer: 0,
      explain: {
        es: "greet() está en el padre, pero llama a who(), y el objeto real es un Child: se ejecuta la versión sobrescrita. Es polimorfismo incluso desde dentro del padre.",
        en: "greet() lives in the parent, but it calls who(), and the real object is a Child: the overridden version runs. It is polymorphism even from inside the parent.",
      },
      tags: ["predict-output", "interleaving"],
    },
    {
      id: "m05-l12-q8",
      kind: "single",
      prompt: {
        es: "Declaras private Decimal margin; en una clase. ¿Qué ocurre con obj.margin desde otra clase?",
        en: "You declare private Decimal margin; in a class. What happens with obj.margin from another class?",
      },
      options: [
        { es: "No compila: margin es invisible fuera de su clase.", en: "It does not compile: margin is invisible outside its class." },
        { es: "Devuelve null.", en: "It returns null." },
        { es: "Funciona solo para leer.", en: "It works for reading only." },
      ],
      answer: 0,
      explain: {
        es: "private es un campo oculto para todos los perfiles. Para leer sí pero escribir no, la herramienta es { get; private set; }.",
        en: "private is a field hidden from every profile. For read-yes-write-no, the tool is { get; private set; }.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M5 L6", en: "Review · M5 L6" },
    },
    {
      id: "m05-l12-q9",
      kind: "single",
      prompt: {
        es: "Tienes 200 oportunidades y una List<CommissionRule> con 3 reglas. Recorres las oportunidades y, dentro, las reglas. ¿Cuántas llamadas a las reglas se hacen, y es un problema?",
        en: "You have 200 opportunities and a List<CommissionRule> with 3 rules. You walk the opportunities and, inside, the rules. How many rule calls are made, and is it a problem?",
      },
      options: [
        {
          es: "600: es un anidado, pero pequeño y acotado por diseño; no es el anidado de búsqueda que hay que evitar.",
          en: "600: it is a nesting, but a small one bounded by design; it is not the search nesting to avoid.",
        },
        {
          es: "40.000, y hay que sustituirlo por un Map.",
          en: "40,000, and it must be replaced by a Map.",
        },
        {
          es: "203, porque las reglas se ejecutan una sola vez.",
          en: "203, because the rules run only once.",
        },
      ],
      answer: 0,
      explain: {
        es: "200 × 3. El problema del Módulo 2 era cruzar dos listas grandes para buscar coincidencias. Aplicar un puñado fijo de reglas a cada registro es exactamente para lo que sirve el polimorfismo.",
        en: "200 × 3. Module 2's problem was crossing two big lists to look for matches. Applying a small, fixed set of rules to each record is exactly what polymorphism is for.",
      },
      tags: ["interleaving", "spaced"],
      from: { es: "Repaso · M2 L7", en: "Review · M2 L7" },
    },
    {
      id: "m05-l12-q10",
      kind: "single",
      prompt: {
        es: "En tu Developer Org, pegas dos clases de primer nivel en la misma ventana de Apex Classes → New y guardas. ¿Qué pasa?",
        en: "In your Developer Org, you paste two top-level classes into the same Apex Classes → New window and save. What happens?",
      },
      options: [
        {
          es: "Error: cada clase de primer nivel va en su propio archivo.",
          en: "Error: each top-level class goes in its own file.",
        },
        { es: "Se guardan las dos.", en: "Both are saved." },
        { es: "Se guarda solo la primera.", en: "Only the first one is saved." },
      ],
      answer: 0,
      explain: {
        es: "Una clase por archivo. Las internas y los enums viajan dentro de la suya; las de primer nivel, cada una con su New.",
        en: "One class per file. Inner classes and enums travel inside theirs; top-level ones, each with its own New.",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "Ejercicio integrador. Ventas quiere calcular las comisiones del trimestre. Hay dos tipos de oportunidad —negocio nuevo y renovación— que comparten nombre, importe y una comisión base del 5 %, pero el negocio nuevo paga el doble. Y en el futuro habrá otros conceptos comisionables que no serán oportunidades. Diseña las clases y calcula el total.",
      en: "Integrative exercise. Sales wants to work out the quarter's commissions. There are two kinds of opportunity — new business and renewal — that share a name, an amount and a 5% base commission, but new business pays double. And in future there will be other commissionable items that are not opportunities. Design the classes and work out the total.",
    },
    brief: [
      {
        es: "Una interfaz Commissionable con un único método Decimal commission().",
        en: "An interface Commissionable with a single method Decimal commission().",
      },
      {
        es: "Una clase abstracta Deal que implemente Commissionable, con una constante de clase BASE_RATE de 0.05, y name y amount como propiedades de solo lectura desde fuera.",
        en: "An abstract class Deal implementing Commissionable, with a class constant BASE_RATE of 0.05, and name and amount as properties read-only from outside.",
      },
      {
        es: "El constructor de Deal recibe name y amount con esos mismos nombres; un importe vacío se guarda como 0. commission() es virtual y devuelve amount × BASE_RATE.",
        en: "Deal's constructor takes name and amount with those same names; an empty amount is stored as 0. commission() is virtual and returns amount × BASE_RATE.",
      },
      {
        es: "NewBusinessDeal y RenewalDeal heredan de Deal y llaman al constructor del padre. NewBusinessDeal sustituye commission() reutilizando la del padre para devolver el doble.",
        en: "NewBusinessDeal and RenewalDeal inherit from Deal and call the parent's constructor. NewBusinessDeal replaces commission() by reusing the parent's to return double.",
      },
      {
        es: "Debajo: una List<Commissionable> con un negocio nuevo de 10.000 y una renovación de 20.000, y un bucle que sume sus comisiones en totalCommission.",
        en: "Below: a List<Commissionable> with a 10,000 new-business deal and a 20,000 renewal, and a loop that adds their commissions into totalCommission.",
      },
    ],
    starter: {
      es: `// 1. Interfaz Commissionable.


// 2. Clase abstracta Deal.


// 3. NewBusinessDeal y RenewalDeal.


// 4. Uso: lista polimórfica y total.
`,
      en: `// 1. Commissionable interface.


// 2. Abstract class Deal.


// 3. NewBusinessDeal and RenewalDeal.


// 4. Usage: polymorphic list and total.
`,
    },
    hints: [
      {
        es: "Ve de arriba abajo: el contrato (interfaz), la base con lo común (abstracta, con su constante, propiedades y constructor), las dos hijas y, al final, un bucle que solo conoce el contrato. Cada palabra clave del módulo aparece al menos una vez.",
        en: "Go top to bottom: the contract (interface), the base with what is shared (abstract, with its constant, properties and constructor), the two children and, finally, a loop that only knows the contract. Every keyword from the module appears at least once.",
      },
      {
        es: "public abstract class Deal implements Commissionable { public static final Decimal BASE_RATE = 0.05; public String name { get; private set; } … this.amount = amount ?? 0; public virtual Decimal commission() { … } } — en la hija: super(name, amount); y public override Decimal commission() { return super.commission() * 2; }",
        en: "public abstract class Deal implements Commissionable { public static final Decimal BASE_RATE = 0.05; public String name { get; private set; } … this.amount = amount ?? 0; public virtual Decimal commission() { … } } — in the child: super(name, amount); and public override Decimal commission() { return super.commission() * 2; }",
      },
      {
        es: "Pseudocódigo del uso: List<Commissionable> items = new List<Commissionable>{ new NewBusinessDeal('Acme', 10000), new RenewalDeal('Globex', 20000) }; Decimal totalCommission = 0; para cada item → totalCommission += item.commission(); (debe dar 2000)",
        en: "Usage pseudocode: List<Commissionable> items = new List<Commissionable>{ new NewBusinessDeal('Acme', 10000), new RenewalDeal('Globex', 20000) }; Decimal totalCommission = 0; for each item → totalCommission += item.commission(); (it should give 2000)",
      },
    ],
    solution: {
      es: `public interface Commissionable {
    Decimal commission();
}

public abstract class Deal implements Commissionable {
    public static final Decimal BASE_RATE = 0.05;

    public String name { get; private set; }
    public Decimal amount { get; private set; }

    public Deal(String name, Decimal amount) {
        this.name = name;
        this.amount = amount ?? 0;
    }

    public virtual Decimal commission() {
        return amount * BASE_RATE;
    }
}

public class NewBusinessDeal extends Deal {
    public NewBusinessDeal(String name, Decimal amount) {
        super(name, amount);
    }

    public override Decimal commission() {
        return super.commission() * 2;
    }
}

public class RenewalDeal extends Deal {
    public RenewalDeal(String name, Decimal amount) {
        super(name, amount);
    }
}

// Uso
List<Commissionable> items = new List<Commissionable>{
    new NewBusinessDeal('Acme · Plataforma', 10000),
    new RenewalDeal('Globex · Renovación', 20000)
};
Decimal totalCommission = 0;
for (Commissionable item : items) {
    totalCommission += item.commission();
}
System.debug(totalCommission);   // 2000`,
      en: `public interface Commissionable {
    Decimal commission();
}

public abstract class Deal implements Commissionable {
    public static final Decimal BASE_RATE = 0.05;

    public String name { get; private set; }
    public Decimal amount { get; private set; }

    public Deal(String name, Decimal amount) {
        this.name = name;
        this.amount = amount ?? 0;
    }

    public virtual Decimal commission() {
        return amount * BASE_RATE;
    }
}

public class NewBusinessDeal extends Deal {
    public NewBusinessDeal(String name, Decimal amount) {
        super(name, amount);
    }

    public override Decimal commission() {
        return super.commission() * 2;
    }
}

public class RenewalDeal extends Deal {
    public RenewalDeal(String name, Decimal amount) {
        super(name, amount);
    }
}

// Usage
List<Commissionable> items = new List<Commissionable>{
    new NewBusinessDeal('Acme · Platform', 10000),
    new RenewalDeal('Globex · Renewal', 20000)
};
Decimal totalCommission = 0;
for (Commissionable item : items) {
    totalCommission += item.commission();
}
System.debug(totalCommission);   // 2000`,
    },
    checks: [
      {
        id: "m05-l12-c1",
        label: {
          es: "La interfaz Commissionable declara Decimal commission()",
          en: "The Commissionable interface declares Decimal commission()",
        },
        rule: {
          op: "match",
          pattern: "public\\s+interface\\s+Commissionable\\s*\\{\\s*Decimal\\s+commission\\s*\\(\\s*\\)\\s*;\\s*\\}",
        },
        onFail: {
          es: "public interface Commissionable { Decimal commission(); }",
          en: "public interface Commissionable { Decimal commission(); }",
        },
      },
      {
        id: "m05-l12-c2",
        label: {
          es: "Deal es abstracta e implementa Commissionable",
          en: "Deal is abstract and implements Commissionable",
        },
        rule: {
          op: "match",
          pattern: "public\\s+abstract\\s+class\\s+Deal\\s+implements\\s+Commissionable\\s*\\{",
        },
        onFail: {
          es: "Nadie crea un «Deal» genérico, y todos son comisionables: public abstract class Deal implements Commissionable { … }",
          en: "Nobody creates a generic “Deal”, and all of them are commissionable: public abstract class Deal implements Commissionable { … }",
        },
      },
      {
        id: "m05-l12-c3",
        label: {
          es: "BASE_RATE es una constante static final de 0.05",
          en: "BASE_RATE is a static final constant of 0.05",
        },
        rule: {
          op: "match",
          pattern: "(static\\s+final|final\\s+static)\\s+Decimal\\s+BASE_RATE\\s*=\\s*0?\\.05\\s*;",
        },
        onFail: {
          es: "Un valor de toda la clase que no cambia: public static final Decimal BASE_RATE = 0.05;",
          en: "A class-wide value that never changes: public static final Decimal BASE_RATE = 0.05;",
        },
      },
      {
        id: "m05-l12-c4",
        label: {
          es: "name y amount son propiedades de solo lectura desde fuera",
          en: "name and amount are read-only properties from outside",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+String\\s+name\\s*\\{\\s*get\\s*;\\s*private\\s+set\\s*;\\s*\\}" },
            { op: "match", pattern: "public\\s+Decimal\\s+amount\\s*\\{\\s*get\\s*;\\s*private\\s+set\\s*;\\s*\\}" },
          ],
        },
        onFail: {
          es: "public String name { get; private set; } y public Decimal amount { get; private set; }",
          en: "public String name { get; private set; } and public Decimal amount { get; private set; }",
        },
      },
      {
        id: "m05-l12-c5",
        label: {
          es: "El constructor usa this y convierte el importe vacío en 0",
          en: "The constructor uses this and turns an empty amount into 0",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+Deal\\s*\\(\\s*String\\s+name\\s*,\\s*Decimal\\s+amount\\s*\\)\\s*\\{" },
            { op: "match", pattern: "this\\.name\\s*=\\s*name\\s*;" },
            { op: "match", pattern: "this\\.amount\\s*=\\s*amount\\s*\\?\\?\\s*0\\s*;" },
          ],
        },
        onFail: {
          es: "public Deal(String name, Decimal amount) { this.name = name; this.amount = amount ?? 0; } — mismos nombres, así que hace falta this.",
          en: "public Deal(String name, Decimal amount) { this.name = name; this.amount = amount ?? 0; } — same names, so this is required.",
        },
      },
      {
        id: "m05-l12-c6",
        label: {
          es: "commission() es virtual en Deal y usa BASE_RATE",
          en: "commission() is virtual in Deal and uses BASE_RATE",
        },
        rule: {
          op: "match",
          pattern: "public\\s+virtual\\s+Decimal\\s+commission\\s*\\(\\s*\\)\\s*\\{\\s*return\\s+amount\\s*\\*\\s*BASE_RATE\\s*;",
        },
        onFail: {
          es: "public virtual Decimal commission() { return amount * BASE_RATE; } — virtual para que una hija pueda cambiarla.",
          en: "public virtual Decimal commission() { return amount * BASE_RATE; } — virtual so a child can change it.",
        },
      },
      {
        id: "m05-l12-c7",
        label: {
          es: "Las dos hijas heredan de Deal y llaman a super(name, amount)",
          en: "Both children inherit from Deal and call super(name, amount)",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+class\\s+NewBusinessDeal\\s+extends\\s+Deal\\s*\\{" },
            { op: "match", pattern: "public\\s+class\\s+RenewalDeal\\s+extends\\s+Deal\\s*\\{" },
            { op: "count", pattern: "super\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*;", min: 2 },
          ],
        },
        onFail: {
          es: "public class NewBusinessDeal extends Deal { public NewBusinessDeal(String name, Decimal amount) { super(name, amount); } … } — y lo mismo con RenewalDeal.",
          en: "public class NewBusinessDeal extends Deal { public NewBusinessDeal(String name, Decimal amount) { super(name, amount); } … } — and the same for RenewalDeal.",
        },
      },
      {
        id: "m05-l12-c8",
        label: {
          es: "NewBusinessDeal dobla la comisión reutilizando la del padre",
          en: "NewBusinessDeal doubles the commission by reusing the parent's",
        },
        rule: {
          op: "match",
          pattern: "public\\s+override\\s+Decimal\\s+commission\\s*\\(\\s*\\)\\s*\\{\\s*return\\s+(super\\.commission\\(\\s*\\)\\s*\\*\\s*2|2\\s*\\*\\s*super\\.commission\\(\\s*\\))\\s*;",
        },
        onFail: {
          es: "public override Decimal commission() { return super.commission() * 2; } — sin copiar la fórmula del padre.",
          en: "public override Decimal commission() { return super.commission() * 2; } — without copying the parent's formula.",
        },
        onPass: {
          es: "Si Finanzas cambia la comisión base, el negocio nuevo sigue pagando el doble sin tocar NewBusinessDeal.",
          en: "If Finance changes the base commission, new business still pays double without touching NewBusinessDeal.",
        },
      },
      {
        id: "m05-l12-c9",
        label: {
          es: "Una List<Commissionable> recorrida sin saber qué hay dentro",
          en: "A List<Commissionable> walked without knowing what is inside",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "List<Commissionable>\\s+\\w+\\s*=\\s*new\\s+List<Commissionable>" },
            { op: "match", pattern: "new\\s+NewBusinessDeal\\s*\\(\\s*'[^']*'\\s*,\\s*10000\\s*\\)" },
            { op: "match", pattern: "new\\s+RenewalDeal\\s*\\(\\s*'[^']*'\\s*,\\s*20000\\s*\\)" },
            { op: "match", pattern: "Decimal\\s+totalCommission\\s*=\\s*0\\s*;" },
            { op: "match", pattern: "for\\s*\\(\\s*Commissionable\\s+\\w+\\s*:\\s*\\w+\\s*\\)" },
            { op: "match", pattern: "totalCommission\\s*(\\+=|=\\s*totalCommission\\s*\\+)\\s*\\w+\\.commission\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "List<Commissionable> items = new List<Commissionable>{ new NewBusinessDeal('…', 10000), new RenewalDeal('…', 20000) }; Decimal totalCommission = 0; for (Commissionable item : items) { totalCommission += item.commission(); }",
          en: "List<Commissionable> items = new List<Commissionable>{ new NewBusinessDeal('…', 10000), new RenewalDeal('…', 20000) }; Decimal totalCommission = 0; for (Commissionable item : items) { totalCommission += item.commission(); }",
        },
        onPass: {
          es: "El total sale 2000. Y cuando lleguen conceptos comisionables que no son oportunidades, entrarán en la misma lista sin tocar el bucle.",
          en: "The total comes out at 2000. And when commissionable items that are not opportunities arrive, they will join the same list without touching the loop.",
        },
      },
    ],
    rubric: [
      {
        es: "Guarda Deal, NewBusinessDeal y RenewalDeal en tu Developer Org (una por archivo, la interfaz también) y ejecuta el uso en Execute Anonymous. ¿El log dice 2000?",
        en: "Save Deal, NewBusinessDeal and RenewalDeal in your Developer Org (one per file, the interface too) and run the usage in Execute Anonymous. Does the log say 2000?",
      },
      {
        es: "Si mañana aparece un ReferralBonus que no es una oportunidad pero sí se comisiona, ¿de qué clase o interfaz partirías?",
        en: "If a ReferralBonus appears tomorrow that is not an opportunity but is commissionable, which class or interface would you start from?",
      },
    ],
  },
};
