import type { Lesson } from "@/lib/types";

export const l06AccessModifiers: Lesson = {
  id: "m05-l06",
  slug: "access-modifiers",
  n: 6,
  kind: "lesson",
  minutes: 22,
  title: { es: "Access Modifiers", en: "Access Modifiers" },
  summary: {
    es: "private, public, protected y global deciden quién ve cada pieza de una clase. Encapsular es exponer acciones seguras en lugar de campos que cualquiera puede romper.",
    en: "private, public, protected and global decide who sees each piece of a class. Encapsulating means exposing safe actions instead of fields anyone can break.",
  },
  analogy: {
    es: "Field-Level Security: oculto, solo lectura o editable",
    en: "Field-Level Security: hidden, read-only or editable",
  },
  objectives: [
    {
      es: "Elegir el modificador de acceso adecuado para cada atributo y método.",
      en: "Choose the right access modifier for each attribute and method.",
    },
    {
      es: "Usar propiedades con { get; private set; } para exponer un valor en solo lectura.",
      en: "Use properties with { get; private set; } to expose a value as read-only.",
    },
    {
      es: "Proteger el estado de un objeto con métodos que validan, como una regla de validación.",
      en: "Protect an object's state with methods that validate, like a validation rule.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Hasta ahora todo era public: cualquiera podía escribir ticket.hoursSpent = -40; y nadie lo impedía. En un equipo real, tu clase la usarán otras personas y otros procesos. Los modificadores de acceso deciden qué pueden tocar desde fuera, y eso es lo que mantiene los datos coherentes.",
        en: "Until now everything was public: anyone could write ticket.hoursSpent = -40; and nothing stopped them. In a real team, your class will be used by other people and other processes. Access modifiers decide what they can touch from outside, and that is what keeps the data consistent.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Con Field-Level Security decides, campo a campo, si un perfil no lo ve, lo ve en solo lectura o lo puede editar. Y aunque un campo sea editable, una regla de validación impide guardar valores absurdos. Los modificadores de acceso hacen lo primero; los métodos que validan antes de cambiar un atributo hacen lo segundo.",
        en: "With Field-Level Security you decide, field by field, whether a profile cannot see it, sees it read-only or can edit it. And even if a field is editable, a validation rule stops absurd values from being saved. Access modifiers do the first; methods that validate before changing an attribute do the second.",
      },
    },
    {
      type: "h",
      text: { es: "Los cuatro niveles", en: "The four levels" },
    },
    {
      type: "table",
      head: [
        { es: "Modificador", en: "Modifier" },
        { es: "Quién lo ve", en: "Who sees it" },
        { es: "En Salesforce sería…", en: "In Salesforce it would be…" },
      ],
      rows: [
        [
          { es: "private", en: "private" },
          { es: "Solo la propia clase", en: "Only the class itself" },
          { es: "Un campo oculto para todos los perfiles", en: "A field hidden from every profile" },
        ],
        [
          { es: "protected", en: "protected" },
          { es: "La clase y las que heredan de ella", en: "The class and those inheriting from it" },
          { es: "Visible solo para una «familia» de perfiles", en: "Visible only to a “family” of profiles" },
        ],
        [
          { es: "public", en: "public" },
          { es: "Todo el código de tu org", en: "All the code in your org" },
          { es: "Visible para todos los usuarios internos", en: "Visible to every internal user" },
        ],
        [
          { es: "global", en: "global" },
          { es: "También código de fuera: paquetes, integraciones", en: "Code from outside too: packages, integrations" },
          { es: "Publicado en una API para terceros", en: "Published on an API for third parties" },
        ],
      ],
    },
    {
      type: "p",
      text: {
        es: "Si no escribes nada delante de un atributo o método, Apex lo trata como private. La clase en sí, si es de primer nivel, tiene que ser public o global para que alguien la pueda usar. protected tendrá sentido en la próxima lección, con la herencia; global solo lo necesitarás si publicas un paquete o una API.",
        en: "If you write nothing in front of an attribute or method, Apex treats it as private. The class itself, if it is top-level, has to be public or global for anyone to use it. protected will make sense next lesson, with inheritance; you will only need global if you publish a package or an API.",
      },
    },
    {
      type: "diagram",
      id: "m05-access",
      caption: {
        es: "Cuanto más fuera está quien pregunta, menos piezas de la clase puede ver.",
        en: "The further outside the caller is, the fewer pieces of the class it can see.",
      },
    },
    {
      type: "h",
      text: { es: "Propiedades: leer sí, escribir no", en: "Properties: read yes, write no" },
    },
    {
      type: "p",
      text: {
        es: "A menudo quieres que un valor se pueda leer desde fuera pero solo lo cambie la propia clase, como un campo de solo lectura en el page layout que sí actualiza la automatización. Apex tiene una forma corta para eso: la propiedad. public Decimal balance { get; private set; } se lee desde cualquier sitio, pero solo se asigna dentro de la clase.",
        en: "Often you want a value readable from outside but changed only by the class itself, like a read-only field on the page layout that automation does update. Apex has a short form for that: the property. public Decimal balance { get; private set; } can be read from anywhere, but only assigned inside the class.",
      },
    },
    {
      type: "code",
      code: {
        es: `public class CreditLine {
    public Decimal creditLimit { get; private set; }
    public Decimal usedAmount { get; private set; }

    public CreditLine(Decimal creditLimit) {
        this.creditLimit = creditLimit;
        this.usedAmount = 0;
    }

    // La única puerta para cambiar usedAmount: valida antes de tocar
    public Boolean charge(Decimal amount) {
        if (!fits(amount)) {
            return false;
        }
        usedAmount += amount;
        return true;
    }

    // Detalle interno: nadie de fuera necesita llamarlo
    private Boolean fits(Decimal amount) {
        return amount != null && amount > 0 && usedAmount + amount <= creditLimit;
    }
}

CreditLine line = new CreditLine(5000);
line.charge(3000);                 // true
System.debug(line.usedAmount);     // 3000: leer sí
line.usedAmount = 0;               // ❌ no compila: escribir no`,
        en: `public class CreditLine {
    public Decimal creditLimit { get; private set; }
    public Decimal usedAmount { get; private set; }

    public CreditLine(Decimal creditLimit) {
        this.creditLimit = creditLimit;
        this.usedAmount = 0;
    }

    // The only door to change usedAmount: it validates before touching
    public Boolean charge(Decimal amount) {
        if (!fits(amount)) {
            return false;
        }
        usedAmount += amount;
        return true;
    }

    // Internal detail: nobody outside needs to call it
    private Boolean fits(Decimal amount) {
        return amount != null && amount > 0 && usedAmount + amount <= creditLimit;
    }
}

CreditLine line = new CreditLine(5000);
line.charge(3000);                 // true
System.debug(line.usedAmount);     // 3000: reading is fine
line.usedAmount = 0;               // ❌ does not compile: writing is not`,
      },
      caption: {
        es: "Nadie puede dejar usedAmount por encima del límite, porque la única forma de cambiarlo pasa por la validación.",
        en: "Nobody can push usedAmount over the limit, because the only way to change it goes through the validation.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "La regla práctica", en: "The rule of thumb" },
      text: {
        es: "Empieza con todo private y abre solo lo que otros necesitan de verdad. Es más fácil hacer public algo mañana que convertir en private algo de lo que ya dependen diez clases.",
        en: "Start with everything private and open only what others really need. It is easier to make something public tomorrow than to make private something ten classes already depend on.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "La idea de encapsulamiento del libro —restringir y controlar el uso de la clase, como su ejemplo del saldo del Padre que la Visita no puede ver— es la misma. Cambian los detalles: en Java, sin modificador, el miembro es visible en todo su package; en Apex es private. Apex añade global, que Java no tiene, y las propiedades { get; set; } sustituyen a los métodos getSaldo()/setSaldo() que verás en código Java.",
        en: "The book's idea of encapsulation — restricting and controlling the class's use, like its example of the Parent's balance the Visitor cannot see — is the same. The details change: in Java, with no modifier, a member is visible across its package; in Apex it is private. Apex adds global, which Java lacks, and { get; set; } properties replace the getSaldo()/setSaldo() methods you will see in Java code.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿qué modificador tiene un método que no lleva ninguno? ¿Cómo expones un valor para leer pero no para escribir?",
        en: "Without looking up: which modifier does a method with none written have? How do you expose a value for reading but not for writing?",
      },
    },
  ],

  quiz: [
    {
      id: "m05-l06-q1",
      kind: "single",
      prompt: {
        es: "Dentro de una clase escribes Decimal margin; sin ningún modificador. ¿Quién puede usarlo?",
        en: "Inside a class you write Decimal margin; with no modifier. Who can use it?",
      },
      options: [
        { es: "Solo la propia clase: es private", en: "Only the class itself: it is private" },
        { es: "Todo el código de la org: es public", en: "All the code in the org: it is public" },
        { es: "La clase y sus subclases", en: "The class and its subclasses" },
      ],
      answer: 0,
      explain: {
        es: "En Apex, sin modificador significa private. Es el valor más seguro por defecto.",
        en: "In Apex, no modifier means private. It is the safest default.",
      },
      tags: ["recall"],
    },
    {
      id: "m05-l06-q2",
      kind: "single",
      prompt: {
        es: "¿Qué pasa con la última línea?",
        en: "What happens with the last line?",
      },
      code: {
        es: `public class Invoice {
    public Decimal total { get; private set; }
    public Invoice(Decimal total) {
        this.total = total;
    }
}
Invoice inv = new Invoice(900);
inv.total = 0;`,
        en: `public class Invoice {
    public Decimal total { get; private set; }
    public Invoice(Decimal total) {
        this.total = total;
    }
}
Invoice inv = new Invoice(900);
inv.total = 0;`,
      },
      options: [
        {
          es: "No compila: total solo se puede asignar dentro de la clase.",
          en: "It does not compile: total can only be assigned inside the class.",
        },
        { es: "total pasa a valer 0.", en: "total becomes 0." },
        { es: "Lanza una excepción al ejecutarse.", en: "It throws an exception at runtime." },
      ],
      answer: 0,
      explain: {
        es: "private set: leer desde fuera sí, asignar no. Y como es un error de compilación, nunca llega a un usuario.",
        en: "private set: reading from outside yes, assigning no. And since it is a compile error, it never reaches a user.",
      },
      tags: ["find-error", "predict-output"],
    },
    {
      id: "m05-l06-q3",
      kind: "single",
      prompt: {
        es: "Un método auxiliar que solo usa la propia clase para calcular algo interno, ¿qué modificador debería llevar?",
        en: "A helper method used only by the class itself to work out something internal — which modifier should it have?",
      },
      options: [
        { es: "private", en: "private" },
        { es: "public", en: "public" },
        { es: "global", en: "global" },
      ],
      answer: 0,
      explain: {
        es: "Lo que nadie de fuera necesita, no se expone. Así puedes cambiarlo mañana sin romper a nadie.",
        en: "What nobody outside needs is not exposed. That way you can change it tomorrow without breaking anyone.",
      },
    },
    {
      id: "m05-l06-q4",
      kind: "text",
      prompt: {
        es: "¿Qué modificador hace visible una clase también para código de fuera de tu org, como un paquete gestionado?",
        en: "Which modifier makes a class visible to code outside your org too, such as a managed package?",
      },
      accept: ["global"],
      placeholder: { es: "una palabra", en: "one word" },
      explain: {
        es: "global. Es el más abierto de todos y el que menos usarás: una vez publicado, es muy difícil de retirar.",
        en: "global. It is the most open of all and the one you will use least: once published, it is very hard to take back.",
      },
      tags: ["recall"],
    },
    {
      id: "m05-l06-q5",
      kind: "single",
      prompt: {
        es: "Con la clase CreditLine de la teoría, ¿qué muestra esto?",
        en: "With the CreditLine class from the theory, what does this print?",
      },
      code: {
        es: `CreditLine line = new CreditLine(1000);
Boolean first = line.charge(700);
Boolean second = line.charge(400);
System.debug(second + ' · ' + line.usedAmount);`,
        en: `CreditLine line = new CreditLine(1000);
Boolean first = line.charge(700);
Boolean second = line.charge(400);
System.debug(second + ' · ' + line.usedAmount);`,
      },
      options: [
        { es: "false · 700", en: "false · 700" },
        { es: "true · 1100", en: "true · 1100" },
        { es: "false · 1100", en: "false · 1100" },
      ],
      answer: 0,
      explain: {
        es: "700 + 400 superaría el límite de 1000, así que fits() devuelve false y charge() no toca usedAmount. La validación vive dentro de la clase.",
        en: "700 + 400 would exceed the 1000 limit, so fits() returns false and charge() does not touch usedAmount. The validation lives inside the class.",
      },
      tags: ["predict-output", "interleaving"],
    },
    {
      id: "m05-l06-q6",
      kind: "multi",
      prompt: {
        es: "¿Qué ventajas tiene exponer charge() en lugar de hacer public usedAmount?",
        en: "What are the advantages of exposing charge() instead of making usedAmount public?",
      },
      options: [
        {
          es: "La validación no se puede saltar: toda modificación pasa por ella.",
          en: "The validation cannot be skipped: every change goes through it.",
        },
        {
          es: "Si cambia la regla del límite, solo se toca la clase.",
          en: "If the limit rule changes, only the class is touched.",
        },
        {
          es: "El código se ejecuta más rápido.",
          en: "The code runs faster.",
        },
      ],
      answers: [0, 1],
      explain: {
        es: "Encapsular no va de velocidad: va de que el estado del objeto sea siempre válido y de poder cambiar la regla en un solo sitio.",
        en: "Encapsulation is not about speed: it is about the object's state always being valid, and being able to change the rule in one place.",
      },
      tags: ["interleaving"],
    },
  ],

  exercise: {
    prompt: {
      es: "Ventas quiere controlar el presupuesto de marketing de cada campaña: se puede consultar lo gastado desde cualquier sitio, pero solo se puede gastar a través de una acción que compruebe que no se supera el presupuesto.",
      en: "Sales wants to control each campaign's marketing budget: the amount spent can be read from anywhere, but money can only be spent through an action that checks the budget is not exceeded.",
    },
    brief: [
      {
        es: "Clase pública CampaignBudget con dos propiedades de solo lectura desde fuera: budget y spent (Decimal).",
        en: "Public class CampaignBudget with two properties that are read-only from outside: budget and spent (Decimal).",
      },
      {
        es: "Un constructor que reciba el presupuesto y deje spent en 0.",
        en: "A constructor that takes the budget and leaves spent at 0.",
      },
      {
        es: "Un método privado canAfford(Decimal amount) que diga si el gasto es positivo y cabe en lo que queda.",
        en: "A private method canAfford(Decimal amount) that says whether the expense is positive and fits in what is left.",
      },
      {
        es: "Un método público spend(Decimal amount) que devuelva Boolean: si canAfford lo permite, suma el gasto y devuelve true; si no, devuelve false sin tocar nada.",
        en: "A public method spend(Decimal amount) returning Boolean: if canAfford allows it, adds the expense and returns true; otherwise returns false without touching anything.",
      },
      {
        es: "Debajo: crea un presupuesto de 10000, gasta 6000 y después intenta gastar 5000 guardando el resultado en secondOk.",
        en: "Below: create a budget of 10000, spend 6000 and then try to spend 5000, storing the result in secondOk.",
      },
    ],
    starter: {
      es: `// 1. Clase CampaignBudget.


// 2. Uso.
`,
      en: `// 1. CampaignBudget class.


// 2. Usage.
`,
    },
    hints: [
      {
        es: "Revisa quién puede hacer qué: los dos valores se leen desde fuera pero solo se escriben dentro; la comprobación es un detalle interno; la acción de gastar es la única puerta pública.",
        en: "Check who can do what: both values are read from outside but written only inside; the check is an internal detail; the spend action is the only public door.",
      },
      {
        es: "Propiedades: public Decimal spent { get; private set; }. El método privado devuelve amount != null && amount > 0 && spent + amount <= budget. spend() lo usa en un if.",
        en: "Properties: public Decimal spent { get; private set; }. The private method returns amount != null && amount > 0 && spent + amount <= budget. spend() uses it in an if.",
      },
      {
        es: "Pseudocódigo: public Boolean spend(Decimal amount) { si !canAfford(amount) → return false; spent += amount; return true; } — Uso: CampaignBudget b = new CampaignBudget(10000); b.spend(6000); Boolean secondOk = b.spend(5000);",
        en: "Pseudocode: public Boolean spend(Decimal amount) { if !canAfford(amount) → return false; spent += amount; return true; } — Usage: CampaignBudget b = new CampaignBudget(10000); b.spend(6000); Boolean secondOk = b.spend(5000);",
      },
    ],
    solution: {
      es: `public class CampaignBudget {
    public Decimal budget { get; private set; }
    public Decimal spent { get; private set; }

    public CampaignBudget(Decimal budget) {
        this.budget = budget;
        this.spent = 0;
    }

    public Boolean spend(Decimal amount) {
        if (!canAfford(amount)) {
            return false;
        }
        spent += amount;
        return true;
    }

    private Boolean canAfford(Decimal amount) {
        return amount != null && amount > 0 && spent + amount <= budget;
    }
}

// Uso
CampaignBudget springBudget = new CampaignBudget(10000);
springBudget.spend(6000);
Boolean secondOk = springBudget.spend(5000);   // false
System.debug(secondOk + ' · ' + springBudget.spent);   // false · 6000`,
      en: `public class CampaignBudget {
    public Decimal budget { get; private set; }
    public Decimal spent { get; private set; }

    public CampaignBudget(Decimal budget) {
        this.budget = budget;
        this.spent = 0;
    }

    public Boolean spend(Decimal amount) {
        if (!canAfford(amount)) {
            return false;
        }
        spent += amount;
        return true;
    }

    private Boolean canAfford(Decimal amount) {
        return amount != null && amount > 0 && spent + amount <= budget;
    }
}

// Usage
CampaignBudget springBudget = new CampaignBudget(10000);
springBudget.spend(6000);
Boolean secondOk = springBudget.spend(5000);   // false
System.debug(secondOk + ' · ' + springBudget.spent);   // false · 6000`,
    },
    checks: [
      {
        id: "m05-l06-c1",
        label: {
          es: "budget y spent son propiedades de solo lectura desde fuera",
          en: "budget and spent are read-only properties from outside",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+class\\s+CampaignBudget\\s*\\{" },
            { op: "match", pattern: "public\\s+Decimal\\s+budget\\s*\\{\\s*get\\s*;\\s*private\\s+set\\s*;\\s*\\}" },
            { op: "match", pattern: "public\\s+Decimal\\s+spent\\s*\\{\\s*get\\s*;\\s*private\\s+set\\s*;\\s*\\}" },
          ],
        },
        onFail: {
          es: "Leer sí, escribir solo dentro: public Decimal spent { get; private set; } (y lo mismo para budget).",
          en: "Read yes, write only inside: public Decimal spent { get; private set; } (and the same for budget).",
        },
      },
      {
        id: "m05-l06-c2",
        label: {
          es: "El constructor fija el presupuesto y deja spent en 0",
          en: "The constructor sets the budget and leaves spent at 0",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+CampaignBudget\\s*\\(\\s*Decimal\\s+\\w+\\s*\\)\\s*\\{" },
            { op: "match", pattern: "(this\\.)?budget\\s*=\\s*\\w+\\s*;" },
            { op: "match", pattern: "(this\\.)?spent\\s*=\\s*0\\s*;" },
          ],
        },
        onFail: {
          es: "public CampaignBudget(Decimal budget) { this.budget = budget; this.spent = 0; }",
          en: "public CampaignBudget(Decimal budget) { this.budget = budget; this.spent = 0; }",
        },
      },
      {
        id: "m05-l06-c3",
        label: {
          es: "canAfford es privado y valida importe positivo y saldo",
          en: "canAfford is private and checks a positive amount and the balance",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "private\\s+Boolean\\s+canAfford\\s*\\(\\s*Decimal\\s+amount\\s*\\)" },
            { op: "match", pattern: "amount\\s*>\\s*0" },
            { op: "match", pattern: "spent\\s*\\+\\s*amount\\s*<=\\s*budget|amount\\s*\\+\\s*spent\\s*<=\\s*budget|amount\\s*<=\\s*budget\\s*-\\s*spent" },
          ],
        },
        onFail: {
          es: "La comprobación es un detalle interno: private Boolean canAfford(Decimal amount) { return amount != null && amount > 0 && spent + amount <= budget; }",
          en: "The check is an internal detail: private Boolean canAfford(Decimal amount) { return amount != null && amount > 0 && spent + amount <= budget; }",
        },
      },
      {
        id: "m05-l06-c4",
        label: {
          es: "spend es público, usa canAfford y solo suma si se permite",
          en: "spend is public, uses canAfford and only adds when allowed",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+Boolean\\s+spend\\s*\\(\\s*Decimal\\s+amount\\s*\\)" },
            { op: "match", pattern: "canAfford\\(\\s*amount\\s*\\)" },
            { op: "match", pattern: "return\\s+false\\s*;" },
            { op: "match", pattern: "spent\\s*(\\+=\\s*amount|=\\s*spent\\s*\\+\\s*amount)\\s*;" },
            { op: "match", pattern: "return\\s+true\\s*;" },
          ],
        },
        onFail: {
          es: "public Boolean spend(Decimal amount) { if (!canAfford(amount)) { return false; } spent += amount; return true; }",
          en: "public Boolean spend(Decimal amount) { if (!canAfford(amount)) { return false; } spent += amount; return true; }",
        },
        onPass: {
          es: "La única puerta para gastar pasa por la validación: ningún proceso puede dejar el presupuesto en negativo.",
          en: "The only door for spending goes through the validation: no process can push the budget negative.",
        },
      },
      {
        id: "m05-l06-c5",
        label: {
          es: "El uso gasta 6000 y guarda el segundo intento en secondOk",
          en: "The usage spends 6000 and stores the second attempt in secondOk",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "new\\s+CampaignBudget\\s*\\(\\s*10000\\s*\\)" },
            { op: "match", pattern: "\\.spend\\(\\s*6000\\s*\\)" },
            { op: "match", pattern: "Boolean\\s+secondOk\\s*=\\s*\\w+\\.spend\\(\\s*5000\\s*\\)" },
            { op: "absent", pattern: "\\b(?!this\\b)\\w+\\.spent\\s*=(?!=)" },
          ],
        },
        onFail: {
          es: "Crea el presupuesto con new CampaignBudget(10000), llama a spend(6000) y guarda Boolean secondOk = ….spend(5000). Nunca asignes spent desde fuera.",
          en: "Create the budget with new CampaignBudget(10000), call spend(6000) and store Boolean secondOk = ….spend(5000). Never assign spent from outside.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué pasa si alguien llama a spend(-500)? ¿Y a spend(null)? Tu clase debería decir false en los dos casos.",
        en: "What happens if someone calls spend(-500)? And spend(null)? Your class should say false in both cases.",
      },
    ],
  },
};
