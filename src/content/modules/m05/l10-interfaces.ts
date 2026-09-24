import type { Lesson } from "@/lib/types";

export const l10Interfaces: Lesson = {
  id: "m05-l10",
  slug: "interfaces-y-polimorfismo",
  n: 10,
  kind: "lesson",
  minutes: 26,
  title: { es: "Interfaces y polimorfismo", en: "Interfaces and polymorphism" },
  summary: {
    es: "Una interfaz es un contrato: «quien me implemente tendrá estos métodos». El polimorfismo es tratar igual a objetos distintos que cumplen el mismo contrato.",
    en: "An interface is a contract: “whoever implements me will have these methods”. Polymorphism is treating different objects the same way because they meet the same contract.",
  },
  analogy: {
    es: "Schedule Apex en Setup: solo aparecen las clases que implementan Schedulable",
    en: "Schedule Apex in Setup: only classes implementing Schedulable show up",
  },
  objectives: [
    {
      es: "Declarar una interfaz e implementarla en varias clases.",
      en: "Declare an interface and implement it in several classes.",
    },
    {
      es: "Recorrer una lista de objetos distintos que cumplen el mismo contrato y tratarlos igual.",
      en: "Walk a list of different objects that meet the same contract and treat them alike.",
    },
    {
      es: "Elegir entre interfaz y clase abstracta según haya o no código común.",
      en: "Choose between an interface and an abstract class depending on whether there is shared code.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "La herencia dice «es un». Pero muchas veces lo que importa no es qué es un objeto, sino qué sabe hacer: puntuar un lead, ejecutarse de madrugada, ordenarse en una lista. Una [[interfaz]] describe exactamente eso: una capacidad, sin decir cómo se consigue.",
        en: "Inheritance says “is a”. But often what matters is not what an object is, but what it can do: score a lead, run in the middle of the night, sort itself in a list. An [[interfaz|interface]] describes exactly that: a capability, without saying how it is achieved.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "En Setup → Apex Classes → Schedule Apex, el desplegable no muestra todas las clases de la org: solo las que implementan la interfaz Schedulable. Salesforce no sabe ni le importa qué hace tu clase; solo necesita saber que tiene un método execute() al que llamar a la hora programada. Eso es una interfaz: un contrato que la plataforma puede usar sin conocerte.",
        en: "In Setup → Apex Classes → Schedule Apex, the dropdown does not show every class in the org: only the ones implementing the Schedulable interface. Salesforce neither knows nor cares what your class does; it only needs to know it has an execute() method to call at the scheduled time. That is an interface: a contract the platform can use without knowing you.",
      },
    },
    {
      type: "h",
      text: { es: "Declarar e implementar", en: "Declaring and implementing" },
    },
    {
      type: "code",
      code: {
        es: `public interface LeadScoringRule {
    Integer score(Lead candidate);      // solo la firma: sin cuerpo
}

public class IndustryRule implements LeadScoringRule {
    public Integer score(Lead candidate) {
        return candidate.Industry == 'Technology' ? 20 : 0;
    }
}

public class SizeRule implements LeadScoringRule {
    public Integer score(Lead candidate) {
        Integer employees = candidate.NumberOfEmployees ?? 0;
        return employees >= 500 ? 30 : 0;
    }
}`,
        en: `public interface LeadScoringRule {
    Integer score(Lead candidate);      // signature only: no body
}

public class IndustryRule implements LeadScoringRule {
    public Integer score(Lead candidate) {
        return candidate.Industry == 'Technology' ? 20 : 0;
    }
}

public class SizeRule implements LeadScoringRule {
    public Integer score(Lead candidate) {
        Integer employees = candidate.NumberOfEmployees ?? 0;
        return employees >= 500 ? 30 : 0;
    }
}`,
      },
    },
    {
      type: "list",
      items: [
        {
          es: "La interfaz solo lista firmas: nombre, parámetros y tipo de retorno. No tiene atributos ni cuerpo.",
          en: "The interface only lists signatures: name, parameters and return type. It has no attributes and no body.",
        },
        {
          es: "implements LeadScoringRule obliga a la clase a tener todos esos métodos, públicos. Si falta uno, no compila.",
          en: "implements LeadScoringRule forces the class to have all those methods, public. If one is missing, it does not compile.",
        },
        {
          es: "Una clase puede implementar varias interfaces a la vez (implements A, B) y, además, heredar de una clase.",
          en: "A class can implement several interfaces at once (implements A, B) and also inherit from a class.",
        },
      ],
    },
    {
      type: "h",
      text: { es: "Polimorfismo: tratar igual lo que es distinto", en: "Polymorphism: treating different things alike" },
    },
    {
      type: "p",
      text: {
        es: "Aquí está la recompensa. Una List<LeadScoringRule> puede guardar reglas de clases distintas, y el bucle que las recorre no necesita saber cuál es cuál: llama a score() y cada una responde a su manera. Para añadir una regla nueva mañana, escribes una clase y la metes en la lista; el bucle no se toca.",
        en: "Here is the payoff. A List<LeadScoringRule> can hold rules of different classes, and the loop walking it does not need to know which is which: it calls score() and each one answers its own way. To add a new rule tomorrow, you write a class and put it in the list; the loop is not touched.",
      },
    },
    {
      type: "code",
      code: {
        es: `List<LeadScoringRule> rules = new List<LeadScoringRule>{
    new IndustryRule(),
    new SizeRule()
};

Lead candidate = new Lead(LastName = 'Kim', Company = 'Globex',
                          Industry = 'Technology', NumberOfEmployees = 800);
Integer total = 0;
for (LeadScoringRule rule : rules) {
    total += rule.score(candidate);    // cada regla a su manera
}
System.debug(total);   // 50`,
        en: `List<LeadScoringRule> rules = new List<LeadScoringRule>{
    new IndustryRule(),
    new SizeRule()
};

Lead candidate = new Lead(LastName = 'Kim', Company = 'Globex',
                          Industry = 'Technology', NumberOfEmployees = 800);
Integer total = 0;
for (LeadScoringRule rule : rules) {
    total += rule.score(candidate);    // each rule its own way
}
System.debug(total);   // 50`,
      },
    },
    {
      type: "diagram",
      id: "m05-interface",
      caption: {
        es: "El bucle solo conoce el contrato. Detrás, cada clase lo cumple a su manera.",
        en: "The loop only knows the contract. Behind it, each class meets it in its own way.",
      },
    },
    {
      type: "h",
      text: { es: "Interfaces que ya existen en la plataforma", en: "Interfaces that already exist on the platform" },
    },
    {
      type: "table",
      head: [
        { es: "Interfaz", en: "Interface" },
        { es: "Te obliga a tener…", en: "Requires you to have…" },
        { es: "Para qué", en: "What for" },
      ],
      rows: [
        [
          { es: "Schedulable", en: "Schedulable" },
          { es: "execute(SchedulableContext ctx)", en: "execute(SchedulableContext ctx)" },
          { es: "Programar la clase desde Setup (Módulo 9)", en: "Scheduling the class from Setup (Module 9)" },
        ],
        [
          { es: "Queueable", en: "Queueable" },
          { es: "execute(QueueableContext ctx)", en: "execute(QueueableContext ctx)" },
          { es: "Trabajo asíncrono encadenable (Módulo 9)", en: "Chainable asynchronous work (Module 9)" },
        ],
        [
          { es: "Database.Batchable", en: "Database.Batchable" },
          { es: "start, execute y finish", en: "start, execute and finish" },
          { es: "Procesar millones de registros (Módulo 9)", en: "Processing millions of records (Module 9)" },
        ],
        [
          { es: "Comparable", en: "Comparable" },
          { es: "compareTo(Object other)", en: "compareTo(Object other)" },
          { es: "Que list.sort() sepa ordenar tus objetos", en: "Letting list.sort() order your objects" },
        ],
      ],
    },
    {
      type: "table",
      head: [
        { es: "", en: "" },
        { es: "Interfaz", en: "Interface" },
        { es: "Clase abstracta", en: "Abstract class" },
      ],
      rows: [
        [
          { es: "¿Tiene código común?", en: "Does it hold shared code?" },
          { es: "No, solo firmas", en: "No, signatures only" },
          { es: "Sí, además de métodos abstractos", en: "Yes, as well as abstract methods" },
        ],
        [
          { es: "¿Cuántas por clase?", en: "How many per class?" },
          { es: "Todas las que quieras", en: "As many as you like" },
          { es: "Una sola (extends)", en: "Only one (extends)" },
        ],
        [
          { es: "Úsala cuando…", en: "Use it when…" },
          { es: "compartes una capacidad", en: "you share a capability" },
          { es: "compartes una base y código", en: "you share a base and code" },
        ],
      ],
    },
    {
      type: "h",
      text: { es: "Por qué no un if por cada tipo", en: "Why not an if per type" },
    },
    {
      type: "p",
      text: {
        es: "Podrías escribir el scoring con un bucle y una cadena de if: si es la regla del sector, haz esto; si es la del origen, esto otro. Funciona el primer trimestre. El segundo, Marketing añade dos reglas y alguien tiene que abrir el bucle, añadir ramas y volver a probarlo todo, arriesgando las reglas que ya funcionaban. Con la interfaz, añadir una regla es escribir una clase nueva y meterla en la lista: el bucle que calcula el total no se toca nunca. Es el mismo razonamiento que en el Módulo 7 llevó las reglas de casos a clases de servicio: lo que cambia a menudo se aísla de lo que no debería cambiar.",
        en: "You could write the scoring with a loop and a chain of ifs: if it is the industry rule, do this; if it is the source rule, that. It works the first quarter. The second, Marketing adds two rules and someone has to open the loop, add branches and retest everything, risking the rules that already worked. With the interface, adding a rule means writing a new class and putting it in the list: the loop that computes the total is never touched. It is the same reasoning that in Module 7 moved the case rules into service classes: what changes often is isolated from what should not change.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El elemento Subflow solo conoce el contrato", en: "The Subflow element only knows the contract" },
      text: {
        es: "Cuando un flow llama a un subflow, solo le importa qué variables de entrada acepta y cuáles devuelve. Puedes cambiar por completo lo que hace ese subflow por dentro —o sustituirlo por otro con las mismas variables— y el flow que lo llama ni se entera. Una interfaz es ese contrato de entradas y salidas, escrito en código: el bucle del scoring llama a score() sin saber qué clase hay detrás.",
        en: "When a flow calls a subflow, all it cares about is which input variables it accepts and which it returns. You can completely change what that subflow does inside — or swap it for another with the same variables — and the calling flow never notices. An interface is that contract of inputs and outputs, written in code: the scoring loop calls score() without knowing which class is behind it.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "Los ejemplos de polimorfismo del libro —las piezas de ajedrez que se mueven cada una a su manera, los empleados que cobran de forma distinta— son exactamente este patrón. Y la herencia múltiple que dibuja el libro (una clase con dos padres), que Apex no permite con clases, se resuelve aquí: una clase puede implementar tantas interfaces como necesite.",
        en: "The book's polymorphism examples — chess pieces each moving their own way, employees paid differently — are exactly this pattern. And the multiple inheritance the book draws (a class with two parents), which Apex does not allow with classes, is solved here: a class can implement as many interfaces as it needs.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿qué tiene que hacer una clase para aparecer en Schedule Apex? Si mañana añades una tercera regla de scoring, ¿qué líneas del bucle cambian?",
        en: "Without looking up: what must a class do to appear in Schedule Apex? If you add a third scoring rule tomorrow, which lines of the loop change?",
      },
    },
  ],

  quiz: [
    {
      id: "m05-l10-q1",
      kind: "single",
      prompt: {
        es: "¿Por qué no compila esta clase?",
        en: "Why does this class not compile?",
      },
      code: {
        es: `public interface Notifier {
    void send(String message);
    Boolean isAvailable();
}
public class SlackNotifier implements Notifier {
    public void send(String message) { }
}`,
        en: `public interface Notifier {
    void send(String message);
    Boolean isAvailable();
}
public class SlackNotifier implements Notifier {
    public void send(String message) { }
}`,
      },
      options: [
        {
          es: "No implementa isAvailable(): hay que cumplir todo el contrato.",
          en: "It does not implement isAvailable(): the whole contract must be met.",
        },
        { es: "Falta override en send().", en: "override is missing on send()." },
        { es: "Una interfaz no puede tener métodos void.", en: "An interface cannot have void methods." },
      ],
      answer: 0,
      explain: {
        es: "implements es una promesa: todos los métodos de la interfaz, públicos. Con interfaces no se escribe override.",
        en: "implements is a promise: every method of the interface, public. With interfaces you do not write override.",
      },
      tags: ["find-error"],
    },
    {
      id: "m05-l10-q2",
      kind: "text",
      prompt: {
        es: "¿Qué palabra clave usa una clase para comprometerse a cumplir una interfaz?",
        en: "Which keyword does a class use to commit to meeting an interface?",
      },
      accept: ["implements"],
      placeholder: { es: "una palabra", en: "one word" },
      explain: {
        es: "implements. Para heredar de una clase es extends; para cumplir interfaces, implements.",
        en: "implements. To inherit from a class it is extends; to meet interfaces, implements.",
      },
      tags: ["recall"],
    },
    {
      id: "m05-l10-q3",
      kind: "single",
      prompt: {
        es: "Con las reglas de la teoría, ¿qué total da este lead?",
        en: "With the rules from the theory, what total does this lead get?",
      },
      code: {
        es: `Lead l = new Lead(LastName = 'Ruiz', Company = 'Initech', Industry = 'Retail');
Integer total = 0;
for (LeadScoringRule rule : rules) {
    total += rule.score(l);
}`,
        en: `Lead l = new Lead(LastName = 'Ruiz', Company = 'Initech', Industry = 'Retail');
Integer total = 0;
for (LeadScoringRule rule : rules) {
    total += rule.score(l);
}`,
      },
      options: [
        { es: "0", en: "0" },
        { es: "20", en: "20" },
        { es: "Lanza una excepción: NumberOfEmployees está vacío", en: "It throws an exception: NumberOfEmployees is empty" },
      ],
      answer: 0,
      explain: {
        es: "No es Technology (0) y, como SizeRule convierte el vacío en 0 con ??, tampoco llega a 500 (0). Sin ese ??, la comparación sí habría fallado.",
        en: "It is not Technology (0) and, since SizeRule turns the empty value into 0 with ??, it does not reach 500 either (0). Without that ??, the comparison would have failed.",
      },
      tags: ["predict-output", "spaced", "interleaving"],
      from: { es: "Repaso · M1 L6", en: "Review · M1 L6" },
    },
    {
      id: "m05-l10-q4",
      kind: "multi",
      prompt: {
        es: "¿Qué afirmaciones son ciertas?",
        en: "Which statements are true?",
      },
      options: [
        {
          es: "Una clase puede implementar varias interfaces.",
          en: "A class can implement several interfaces.",
        },
        {
          es: "Una clase puede heredar de una clase e implementar interfaces a la vez.",
          en: "A class can inherit from a class and implement interfaces at the same time.",
        },
        {
          es: "Una interfaz puede guardar atributos con valor.",
          en: "An interface can hold attributes with values.",
        },
        {
          es: "Una variable puede ser del tipo de una interfaz.",
          en: "A variable can be of an interface's type.",
        },
      ],
      answers: [0, 1, 3],
      explain: {
        es: "LeadScoringRule rule = new SizeRule(); es válido. Lo que una interfaz no puede tener es estado: solo firmas.",
        en: "LeadScoringRule rule = new SizeRule(); is valid. What an interface cannot have is state: signatures only.",
      },
    },
    {
      id: "m05-l10-q5",
      kind: "single",
      prompt: {
        es: "Quieres que list.sort() ordene tus objetos Deal por importe. ¿Qué haces?",
        en: "You want list.sort() to order your Deal objects by amount. What do you do?",
      },
      options: [
        {
          es: "Implementar la interfaz Comparable y su método compareTo().",
          en: "Implement the Comparable interface and its compareTo() method.",
        },
        { es: "Heredar de List.", en: "Inherit from List." },
        { es: "Declarar Deal como abstract.", en: "Declare Deal as abstract." },
      ],
      answer: 0,
      explain: {
        es: "sort() no sabe nada de Deal, pero sabe llamar a compareTo() de cualquier cosa que sea Comparable. Es el mismo trato que Schedulable con Setup.",
        en: "sort() knows nothing about Deal, but it knows how to call compareTo() on anything Comparable. It is the same deal Schedulable has with Setup.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m05-l10-q6",
      kind: "single",
      prompt: {
        es: "Varias clases de notificación comparten el mismo método para registrar el envío, y cada una envía a su manera. ¿Qué encaja mejor?",
        en: "Several notification classes share the same method for logging the send, and each sends in its own way. What fits best?",
      },
      options: [
        {
          es: "Una clase abstracta con el registro implementado y send() abstracto",
          en: "An abstract class with the logging implemented and send() abstract",
        },
        {
          es: "Una interfaz, copiando el registro en cada clase",
          en: "An interface, copying the logging into each class",
        },
        {
          es: "Una clase normal sin herencia",
          en: "A plain class with no inheritance",
        },
      ],
      answer: 0,
      explain: {
        es: "Hay código común (el registro): eso pide clase abstracta. Si solo compartieran la capacidad de enviar, bastaría una interfaz.",
        en: "There is shared code (the logging): that calls for an abstract class. If they only shared the ability to send, an interface would do.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M5 L8", en: "Review · M5 L8" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 10 DE 12 · Mientras se renueva la cartera, Marketing busca clientes nuevos. Marketing quiere puntuar los leads con reglas que irán cambiando cada trimestre. Diseña el scoring para que añadir o quitar una regla no obligue a tocar el cálculo del total.",
      en: "TASK 10 OF 12 · While the portfolio renews, Marketing hunts new customers. Marketing wants to score leads with rules that will change every quarter. Design the scoring so that adding or removing a rule never forces a change to the total calculation.",
    },
    brief: [
      {
        es: "Interfaz LeadScoringRule con un método score que reciba un Lead y devuelva un Integer.",
        en: "Interface LeadScoringRule with a score method that takes a Lead and returns an Integer.",
      },
      {
        es: "IndustryRule: 20 puntos si Industry es 'Technology', 0 si no.",
        en: "IndustryRule: 20 points if Industry is 'Technology', 0 otherwise.",
      },
      {
        es: "SourceRule: 25 puntos si LeadSource es 'Partner Referral', 0 si no.",
        en: "SourceRule: 25 points if LeadSource is 'Partner Referral', 0 otherwise.",
      },
      {
        es: "Debajo: una List<LeadScoringRule> con las dos reglas, un lead de Technology que venga de 'Partner Referral', y un bucle que sume en totalScore lo que da cada regla.",
        en: "Below: a List<LeadScoringRule> with both rules, a Technology lead coming from 'Partner Referral', and a loop that adds up into totalScore what each rule gives.",
      },
    ],
    starter: {
      es: `// CASO: el motor comercial de Northwind Trading
// Tarea 10 de 12: reglas de puntuación que se añaden sin tocar el cálculo.

// 1. La interfaz.


// 2. Las dos reglas.


// 3. Uso: lista de reglas, lead y bucle.
`,
      en: `// CASE: Northwind Trading's commercial engine
// Task 10 of 12: scoring rules added without touching the calculation.

// 1. The interface.


// 2. The two rules.


// 3. Usage: list of rules, lead and loop.
`,
    },
    hints: [
      {
        es: "Tres piezas: un contrato con una sola firma, dos clases que lo cumplen y un bucle que solo conoce el contrato. El bucle no debería mencionar IndustryRule ni SourceRule.",
        en: "Three pieces: a contract with a single signature, two classes meeting it and a loop that only knows the contract. The loop should not mention IndustryRule or SourceRule.",
      },
      {
        es: "public interface LeadScoringRule { Integer score(Lead candidate); } — public class IndustryRule implements LeadScoringRule { public Integer score(Lead candidate) { … } } — el bucle es for (LeadScoringRule rule : rules).",
        en: "public interface LeadScoringRule { Integer score(Lead candidate); } — public class IndustryRule implements LeadScoringRule { public Integer score(Lead candidate) { … } } — the loop is for (LeadScoringRule rule : rules).",
      },
      {
        es: "Pseudocódigo del uso: List<LeadScoringRule> rules = new List<LeadScoringRule>{ new IndustryRule(), new SourceRule() }; Lead l = new Lead(…, Industry = 'Technology', LeadSource = 'Partner Referral'); Integer totalScore = 0; para cada rule → totalScore += rule.score(l);",
        en: "Usage pseudocode: List<LeadScoringRule> rules = new List<LeadScoringRule>{ new IndustryRule(), new SourceRule() }; Lead l = new Lead(…, Industry = 'Technology', LeadSource = 'Partner Referral'); Integer totalScore = 0; for each rule → totalScore += rule.score(l);",
      },
    ],
    solution: {
      es: `public interface LeadScoringRule {
    Integer score(Lead candidate);
}

public class IndustryRule implements LeadScoringRule {
    public Integer score(Lead candidate) {
        return candidate.Industry == 'Technology' ? 20 : 0;
    }
}

public class SourceRule implements LeadScoringRule {
    public Integer score(Lead candidate) {
        return candidate.LeadSource == 'Partner Referral' ? 25 : 0;
    }
}

// Uso
List<LeadScoringRule> rules = new List<LeadScoringRule>{
    new IndustryRule(),
    new SourceRule()
};
Lead candidate = new Lead(LastName = 'Kim', Company = 'Globex',
                          Industry = 'Technology', LeadSource = 'Partner Referral');
Integer totalScore = 0;
for (LeadScoringRule rule : rules) {
    totalScore += rule.score(candidate);
}
System.debug(totalScore);   // 45`,
      en: `public interface LeadScoringRule {
    Integer score(Lead candidate);
}

public class IndustryRule implements LeadScoringRule {
    public Integer score(Lead candidate) {
        return candidate.Industry == 'Technology' ? 20 : 0;
    }
}

public class SourceRule implements LeadScoringRule {
    public Integer score(Lead candidate) {
        return candidate.LeadSource == 'Partner Referral' ? 25 : 0;
    }
}

// Usage
List<LeadScoringRule> rules = new List<LeadScoringRule>{
    new IndustryRule(),
    new SourceRule()
};
Lead candidate = new Lead(LastName = 'Kim', Company = 'Globex',
                          Industry = 'Technology', LeadSource = 'Partner Referral');
Integer totalScore = 0;
for (LeadScoringRule rule : rules) {
    totalScore += rule.score(candidate);
}
System.debug(totalScore);   // 45`,
    },
    checks: [
      {
        id: "m05-l10-c1",
        label: {
          es: "La interfaz declara Integer score(Lead …) sin cuerpo",
          en: "The interface declares Integer score(Lead …) with no body",
        },
        rule: {
          op: "match",
          pattern: "public\\s+interface\\s+LeadScoringRule\\s*\\{\\s*Integer\\s+score\\s*\\(\\s*Lead\\s+\\w+\\s*\\)\\s*;\\s*\\}",
        },
        onFail: {
          es: "public interface LeadScoringRule { Integer score(Lead candidate); } — solo la firma, terminada en punto y coma.",
          en: "public interface LeadScoringRule { Integer score(Lead candidate); } — signature only, ending in a semicolon.",
        },
      },
      {
        id: "m05-l10-c2",
        label: {
          es: "IndustryRule y SourceRule implementan la interfaz",
          en: "IndustryRule and SourceRule implement the interface",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+class\\s+IndustryRule\\s+implements\\s+LeadScoringRule\\s*\\{" },
            { op: "match", pattern: "public\\s+class\\s+SourceRule\\s+implements\\s+LeadScoringRule\\s*\\{" },
            { op: "count", pattern: "public\\s+Integer\\s+score\\s*\\(\\s*Lead\\s+\\w+\\s*\\)\\s*\\{", min: 2 },
          ],
        },
        onFail: {
          es: "public class IndustryRule implements LeadScoringRule { public Integer score(Lead candidate) { … } } — y lo mismo con SourceRule.",
          en: "public class IndustryRule implements LeadScoringRule { public Integer score(Lead candidate) { … } } — and the same for SourceRule.",
        },
      },
      {
        id: "m05-l10-c3",
        label: {
          es: "Cada regla da sus puntos: 20 por Technology y 25 por Partner Referral",
          en: "Each rule gives its points: 20 for Technology and 25 for Partner Referral",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Industry\\s*==\\s*'Technology'[^;]*20" },
            { op: "match", pattern: "LeadSource\\s*==\\s*'Partner Referral'[^;]*25" },
          ],
        },
        onFail: {
          es: "IndustryRule: return candidate.Industry == 'Technology' ? 20 : 0; — SourceRule: return candidate.LeadSource == 'Partner Referral' ? 25 : 0;",
          en: "IndustryRule: return candidate.Industry == 'Technology' ? 20 : 0; — SourceRule: return candidate.LeadSource == 'Partner Referral' ? 25 : 0;",
        },
      },
      {
        id: "m05-l10-c4",
        label: {
          es: "Una List<LeadScoringRule> con las dos reglas",
          en: "A List<LeadScoringRule> holding both rules",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "List<LeadScoringRule>\\s+\\w+\\s*=\\s*new\\s+List<LeadScoringRule>" },
            { op: "match", pattern: "new\\s+IndustryRule\\s*\\(\\s*\\)" },
            { op: "match", pattern: "new\\s+SourceRule\\s*\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "List<LeadScoringRule> rules = new List<LeadScoringRule>{ new IndustryRule(), new SourceRule() };",
          en: "List<LeadScoringRule> rules = new List<LeadScoringRule>{ new IndustryRule(), new SourceRule() };",
        },
      },
      {
        id: "m05-l10-c5",
        label: {
          es: "El bucle solo conoce el contrato y acumula en totalScore",
          en: "The loop only knows the contract and accumulates into totalScore",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Integer\\s+totalScore\\s*=\\s*0\\s*;" },
            { op: "match", pattern: "for\\s*\\(\\s*LeadScoringRule\\s+\\w+\\s*:\\s*\\w+\\s*\\)" },
            { op: "match", pattern: "totalScore\\s*(\\+=|=\\s*totalScore\\s*\\+)\\s*\\w+\\.score\\(\\s*\\w+\\s*\\)" },
            { op: "absent", pattern: "instanceof" },
          ],
        },
        onFail: {
          es: "Integer totalScore = 0; for (LeadScoringRule rule : rules) { totalScore += rule.score(candidate); } — sin preguntar de qué clase es cada regla.",
          en: "Integer totalScore = 0; for (LeadScoringRule rule : rules) { totalScore += rule.score(candidate); } — without asking which class each rule is.",
        },
        onPass: {
          es: "Una regla nueva el próximo trimestre es una clase más y una línea en la lista. El cálculo del total no se vuelve a tocar.",
          en: "A new rule next quarter is one more class and one line in the list. The total calculation is never touched again.",
        },
      },
    ],
    rubric: [
      {
        es: "Añade mentalmente una SizeRule. ¿Cuántas líneas del bucle cambian? Si la respuesta no es cero, revisa el diseño.",
        en: "Add a SizeRule in your head. How many lines of the loop change? If the answer is not zero, revisit the design.",
      },
      {
        es: "Tarea 11: Soporte también forma parte del motor, y quiere dejar de repartir los casos de los clientes comparando textos.",
        en: "Task 11: Support is part of the engine too, and wants to stop routing customers' cases by comparing text.",
      },
    ],
  },
};
