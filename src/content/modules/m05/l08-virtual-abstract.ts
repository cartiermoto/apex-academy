import type { Lesson } from "@/lib/types";

export const l08VirtualAbstract: Lesson = {
  id: "m05-l08",
  slug: "virtual-abstract-override",
  n: 8,
  kind: "lesson",
  minutes: 24,
  title: { es: "virtual, abstract y override", en: "virtual, abstract and override" },
  summary: {
    es: "Cómo decide el padre qué pueden cambiar sus hijas: virtual permite, abstract obliga y override es la hija diciendo «esto lo hago a mi manera».",
    en: "How the parent decides what its children may change: virtual allows, abstract requires, and override is the child saying “I do this my own way”.",
  },
  analogy: {
    es: "Activity: nadie crea una «actividad», se crean Tasks o Events que comparten lo común",
    en: "Activity: nobody creates an “activity”; you create Tasks or Events that share what is common",
  },
  objectives: [
    {
      es: "Permitir que una hija cambie un método con virtual y hacerlo con override.",
      en: "Allow a child to change a method with virtual, and do it with override.",
    },
    {
      es: "Declarar una clase abstract con métodos que cada hija está obligada a implementar.",
      en: "Declare an abstract class with methods every child is required to implement.",
    },
    {
      es: "Ampliar el comportamiento del padre en lugar de sustituirlo, con super.método().",
      en: "Extend the parent's behaviour instead of replacing it, with super.method().",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "En la lección anterior la hija heredaba los métodos del padre tal cual. Pero a menudo cada hija necesita hacer lo mismo de forma distinta: todos los descuentos «se aplican», pero uno resta un porcentaje y otro un importe fijo. Apex te deja decidir, método a método, qué se puede cambiar y qué no.",
        en: "In the previous lesson the child inherited the parent's methods as they were. But often each child needs to do the same thing differently: every discount “applies”, but one takes off a percentage and another a fixed amount. Apex lets you decide, method by method, what may change and what may not.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Task y Event comparten campos como Subject, ActivityDate u OwnerId porque los dos son Activities. Pero en tu org nunca creas una «Activity» a secas: creas una Task o un Event, y cada uno tiene sus propias reglas. Activity funciona como una clase abstracta: define lo común y exige que alguien concrete el resto.",
        en: "Task and Event share fields like Subject, ActivityDate or OwnerId because both are Activities. But in your org you never create a plain “Activity”: you create a Task or an Event, and each has its own rules. Activity works like an abstract class: it defines what is common and requires someone to make the rest concrete.",
      },
    },
    {
      type: "h",
      text: { es: "virtual + override: «puedes cambiarlo»", en: "virtual + override: “you may change this”" },
    },
    {
      type: "p",
      text: {
        es: "Igual que las clases, los métodos de Apex son cerrados por defecto: una hija no los puede cambiar. Si el padre marca un método como virtual, ofrece una versión por defecto que las hijas pueden sustituir. La hija lo hace escribiendo el mismo método con override. Sin virtual en el padre o sin override en la hija, no compila.",
        en: "Like classes, Apex methods are closed by default: a child cannot change them. If the parent marks a method virtual, it offers a default version the children may replace. The child does so by writing the same method with override. Without virtual on the parent or override on the child, it does not compile.",
      },
    },
    {
      type: "code",
      code: {
        es: `public virtual class Notification {
    public String subject;
    public virtual String channel() {
        return 'Correo';            // versión por defecto
    }
}

public class SmsNotification extends Notification {
    public override String channel() {
        return 'SMS';               // la hija lo hace a su manera
    }
}`,
        en: `public virtual class Notification {
    public String subject;
    public virtual String channel() {
        return 'Email';             // default version
    }
}

public class SmsNotification extends Notification {
    public override String channel() {
        return 'SMS';               // the child does it its own way
    }
}`,
      },
    },
    {
      type: "h",
      text: { es: "abstract: «tienes que hacerlo tú»", en: "abstract: “you must do this yourself”" },
    },
    {
      type: "p",
      text: {
        es: "A veces el padre no tiene ninguna versión sensata que ofrecer: ¿cómo se aplica «un descuento» en abstracto? Entonces la clase se declara abstract y el método también, sin cuerpo, terminado en punto y coma. Una clase abstracta no se puede instanciar —new Discount() no compila— y cada hija concreta está obligada a implementar sus métodos abstractos con override.",
        en: "Sometimes the parent has no sensible version to offer: how do you apply “a discount” in the abstract? Then the class is declared abstract and so is the method, with no body, ending in a semicolon. An abstract class cannot be instantiated — new Discount() does not compile — and every concrete child must implement its abstract methods with override.",
      },
    },
    {
      type: "code",
      code: {
        es: `public abstract class Discount {
    public String label;

    public Discount(String label) {
        this.label = label;
    }

    public abstract Decimal apply(Decimal amount);   // sin cuerpo: cada hija decide

    public virtual String describe() {
        return label;
    }
}

public class PercentDiscount extends Discount {
    private Decimal percent;

    public PercentDiscount(String label, Decimal percent) {
        super(label);
        this.percent = percent;
    }

    public override Decimal apply(Decimal amount) {
        return amount * (1 - percent / 100);
    }

    public override String describe() {
        return super.describe() + ' (' + percent + ' %)';   // amplía, no sustituye
    }
}`,
        en: `public abstract class Discount {
    public String label;

    public Discount(String label) {
        this.label = label;
    }

    public abstract Decimal apply(Decimal amount);   // no body: each child decides

    public virtual String describe() {
        return label;
    }
}

public class PercentDiscount extends Discount {
    private Decimal percent;

    public PercentDiscount(String label, Decimal percent) {
        super(label);
        this.percent = percent;
    }

    public override Decimal apply(Decimal amount) {
        return amount * (1 - percent / 100);
    }

    public override String describe() {
        return super.describe() + ' (' + percent + '%)';   // extends, does not replace
    }
}`,
      },
      caption: {
        es: "super.describe() ejecuta la versión del padre. Así la hija añade algo sin copiar lo que ya hacía el padre.",
        en: "super.describe() runs the parent's version. That way the child adds something without copying what the parent already did.",
      },
    },
    {
      type: "diagram",
      id: "m05-abstract",
      caption: {
        es: "Abstract define lo común y lo que falta por concretar; cada hija concreta rellena el hueco a su manera.",
        en: "Abstract defines what is common and what is left to make concrete; each concrete child fills the gap its own way.",
      },
    },
    {
      type: "table",
      head: [
        { es: "", en: "" },
        { es: "Sin marca", en: "No keyword" },
        { es: "virtual", en: "virtual" },
        { es: "abstract", en: "abstract" },
      ],
      rows: [
        [
          { es: "Clase: ¿se puede heredar?", en: "Class: can it be inherited from?" },
          { es: "No", en: "No" },
          { es: "Sí", en: "Yes" },
          { es: "Sí (y hay que hacerlo)", en: "Yes (and it has to be)" },
        ],
        [
          { es: "Clase: ¿new directamente?", en: "Class: direct new?" },
          { es: "Sí", en: "Yes" },
          { es: "Sí", en: "Yes" },
          { es: "No", en: "No" },
        ],
        [
          { es: "Método: ¿tiene cuerpo?", en: "Method: does it have a body?" },
          { es: "Sí", en: "Yes" },
          { es: "Sí, por defecto", en: "Yes, a default one" },
          { es: "No", en: "No" },
        ],
        [
          { es: "Método: ¿la hija puede o debe cambiarlo?", en: "Method: may or must the child change it?" },
          { es: "No puede", en: "It cannot" },
          { es: "Puede (override)", en: "It may (override)" },
          { es: "Debe (override)", en: "It must (override)" },
        ],
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "La claseA abstracta del libro con su metodoAbstracto() funciona igual en Apex. La diferencia está en todo lo demás: en Java cualquier método se puede sobrescribir y @Override es solo un aviso opcional. En Apex el padre tiene que marcar el método como virtual (o abstract) y la hija tiene que escribir override; si falta cualquiera de los dos, no compila. Es más estricto, y por eso más seguro.",
        en: "The book's abstract claseA with its metodoAbstracto() works the same in Apex. The difference is everywhere else: in Java any method can be overridden and @Override is only an optional hint. In Apex the parent must mark the method virtual (or abstract) and the child must write override; if either is missing, it does not compile. Stricter, and therefore safer.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿qué diferencia hay entre un método virtual y uno abstract? ¿Por qué new Discount() no compila?",
        en: "Without looking up: what is the difference between a virtual method and an abstract one? Why does new Discount() not compile?",
      },
    },
  ],

  quiz: [
    {
      id: "m05-l08-q1",
      kind: "single",
      prompt: {
        es: "¿Qué ocurre con la última línea?",
        en: "What happens with the last line?",
      },
      code: {
        es: `public abstract class Discount {
    public abstract Decimal apply(Decimal amount);
}
Discount d = new Discount();`,
        en: `public abstract class Discount {
    public abstract Decimal apply(Decimal amount);
}
Discount d = new Discount();`,
      },
      options: [
        {
          es: "No compila: una clase abstracta no se puede instanciar.",
          en: "It does not compile: an abstract class cannot be instantiated.",
        },
        { es: "Crea un descuento vacío.", en: "It creates an empty discount." },
        { es: "Compila, pero apply() devuelve null.", en: "It compiles, but apply() returns null." },
      ],
      answer: 0,
      explain: {
        es: "Como Activity: se instancian sus hijas concretas (PercentDiscount, FixedDiscount), nunca el padre abstracto. La variable sí puede ser de tipo Discount.",
        en: "Like Activity: its concrete children are instantiated (PercentDiscount, FixedDiscount), never the abstract parent. The variable can still be of type Discount.",
      },
      tags: ["find-error"],
    },
    {
      id: "m05-l08-q2",
      kind: "single",
      prompt: {
        es: "La hija escribe public String channel() { return 'SMS'; } sin override, y el padre lo tiene como virtual. ¿Qué pasa?",
        en: "The child writes public String channel() { return 'SMS'; } without override, and the parent has it as virtual. What happens?",
      },
      options: [
        {
          es: "No compila: en Apex hay que escribir override para sustituir un método.",
          en: "It does not compile: in Apex you must write override to replace a method.",
        },
        { es: "Compila y sustituye el método igualmente.", en: "It compiles and replaces the method anyway." },
        { es: "Compila, pero se sigue usando la versión del padre.", en: "It compiles, but the parent's version is still used." },
      ],
      answer: 0,
      explain: {
        es: "Apex exige que la intención sea explícita en los dos lados: virtual en el padre, override en la hija.",
        en: "Apex requires the intent to be explicit on both sides: virtual on the parent, override on the child.",
      },
      tags: ["find-error"],
    },
    {
      id: "m05-l08-q3",
      kind: "single",
      prompt: {
        es: "Con la clase PercentDiscount de la teoría, ¿qué muestra esto?",
        en: "With the PercentDiscount class from the theory, what does this print?",
      },
      code: {
        es: `Discount d = new PercentDiscount('Primavera', 20);
System.debug(d.apply(150) + ' · ' + d.describe());`,
        en: `Discount d = new PercentDiscount('Spring', 20);
System.debug(d.apply(150) + ' · ' + d.describe());`,
      },
      options: [
        {
          es: "120.0 · Primavera (20 %)",
          en: "120.0 · Spring (20%)",
        },
        {
          es: "120.0 · Primavera",
          en: "120.0 · Spring",
        },
        {
          es: "150 · Primavera (20 %)",
          en: "150 · Spring (20%)",
        },
      ],
      answer: 0,
      explain: {
        es: "La variable es de tipo Discount, pero el objeto es un PercentDiscount: se ejecutan sus versiones de apply() y describe(). describe() usa super para reutilizar la etiqueta del padre.",
        en: "The variable is of type Discount, but the object is a PercentDiscount: its versions of apply() and describe() run. describe() uses super to reuse the parent's label.",
      },
      tags: ["predict-output", "interleaving"],
    },
    {
      id: "m05-l08-q4",
      kind: "text",
      prompt: {
        es: "¿Qué palabra clave escribe la clase hija para sustituir un método virtual o implementar uno abstracto?",
        en: "Which keyword does the child class write to replace a virtual method or implement an abstract one?",
      },
      accept: ["override"],
      placeholder: { es: "una palabra", en: "one word" },
      explain: {
        es: "override. Y para llamar a la versión del padre desde la hija, super.método().",
        en: "override. And to call the parent's version from the child, super.method().",
      },
      tags: ["recall"],
    },
    {
      id: "m05-l08-q5",
      kind: "multi",
      prompt: {
        es: "¿Qué afirmaciones son ciertas sobre un método abstract?",
        en: "Which statements about an abstract method are true?",
      },
      options: [
        { es: "No tiene cuerpo: termina en punto y coma.", en: "It has no body: it ends in a semicolon." },
        {
          es: "Solo puede estar en una clase abstract.",
          en: "It can only live in an abstract class.",
        },
        {
          es: "Cada hija concreta está obligada a implementarlo.",
          en: "Every concrete child is required to implement it.",
        },
        {
          es: "La hija puede elegir no implementarlo y usar el del padre.",
          en: "The child may choose not to implement it and use the parent's.",
        },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "No hay «el del padre» que usar: por eso es obligatorio. Esa es justo la diferencia con virtual.",
        en: "There is no “parent's version” to use: that is why it is mandatory. That is exactly the difference from virtual.",
      },
    },
    {
      id: "m05-l08-q6",
      kind: "single",
      prompt: {
        es: "Una clase Contract de Salesforce no está marcada virtual. ¿Qué dice eso?",
        en: "A Contract class is not marked virtual. What does that tell you?",
      },
      options: [
        {
          es: "Que nadie puede heredar de ella: su autor la dejó cerrada a propósito.",
          en: "That nobody can inherit from it: its author left it closed on purpose.",
        },
        {
          es: "Que se hereda igual, pero sin poder cambiar sus métodos.",
          en: "That it is inherited all the same, but its methods cannot be changed.",
        },
        {
          es: "Que no se puede instanciar.",
          en: "That it cannot be instantiated.",
        },
      ],
      answer: 0,
      explain: {
        es: "Sin marca, una clase Apex es final: se instancia, pero no se hereda. Lo repasaste en la lección anterior con virtual.",
        en: "With no keyword, an Apex class is final: it can be instantiated but not inherited from. You met this last lesson with virtual.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M5 L7", en: "Review · M5 L7" },
    },
  ],

  exercise: {
    prompt: {
      es: "El equipo de pricing tiene dos tipos de descuento: por porcentaje y de importe fijo. Todos tienen una etiqueta y se aplican sobre un importe, pero cada uno a su manera, y nadie debe poder crear un «descuento» genérico.",
      en: "The pricing team has two kinds of discount: percentage and fixed amount. They all have a label and are applied to an amount, but each in its own way, and nobody should be able to create a generic “discount”.",
    },
    brief: [
      {
        es: "Clase abstracta Discount con label (String público), un constructor que la reciba, un método abstracto apply(Decimal amount) que devuelva Decimal, y un método virtual describe() que devuelva la etiqueta.",
        en: "Abstract class Discount with label (public String), a constructor that takes it, an abstract method apply(Decimal amount) returning Decimal, and a virtual method describe() returning the label.",
      },
      {
        es: "PercentDiscount: hereda de Discount, recibe etiqueta y porcentaje, y apply devuelve el importe menos ese porcentaje.",
        en: "PercentDiscount: inherits from Discount, takes a label and a percentage, and apply returns the amount minus that percentage.",
      },
      {
        es: "FixedDiscount: hereda de Discount, recibe etiqueta e importe a descontar, apply nunca devuelve menos de 0, y describe() amplía la del padre añadiendo el importe descontado.",
        en: "FixedDiscount: inherits from Discount, takes a label and an amount to take off, apply never returns less than 0, and describe() extends the parent's by adding the amount taken off.",
      },
      {
        es: "Debajo: dos variables de tipo Discount, una con cada clase, y aplica el fijo de 50 a un importe de 30 (debe dar 0).",
        en: "Below: two variables of type Discount, one of each class, and apply the fixed 50 discount to an amount of 30 (it must give 0).",
      },
    ],
    starter: {
      es: `// 1. Clase abstracta Discount.


// 2. PercentDiscount y FixedDiscount.


// 3. Uso.
`,
      en: `// 1. Abstract class Discount.


// 2. PercentDiscount and FixedDiscount.


// 3. Usage.
`,
    },
    hints: [
      {
        es: "El padre tiene tres tipos de pieza: una normal (label y constructor), una obligatoria para las hijas (apply) y una opcional (describe). Cada tipo lleva su palabra clave.",
        en: "The parent has three kinds of piece: an ordinary one (label and constructor), one the children must provide (apply) and an optional one (describe). Each kind carries its keyword.",
      },
      {
        es: "public abstract Decimal apply(Decimal amount); sin cuerpo. En las hijas: super(label); en el constructor y public override Decimal apply(…). Para no bajar de 0: amount - off > 0 ? amount - off : 0. Para ampliar describe: super.describe() + …",
        en: "public abstract Decimal apply(Decimal amount); with no body. In the children: super(label); in the constructor and public override Decimal apply(…). To stay at or above 0: amount - off > 0 ? amount - off : 0. To extend describe: super.describe() + …",
      },
      {
        es: "Pseudocódigo del uso: Discount spring = new PercentDiscount('Primavera', 10); Discount welcome = new FixedDiscount('Bienvenida', 50); Decimal result = welcome.apply(30);",
        en: "Usage pseudocode: Discount spring = new PercentDiscount('Spring', 10); Discount welcome = new FixedDiscount('Welcome', 50); Decimal result = welcome.apply(30);",
      },
    ],
    solution: {
      es: `public abstract class Discount {
    public String label;

    public Discount(String label) {
        this.label = label;
    }

    public abstract Decimal apply(Decimal amount);

    public virtual String describe() {
        return label;
    }
}

public class PercentDiscount extends Discount {
    private Decimal percent;

    public PercentDiscount(String label, Decimal percent) {
        super(label);
        this.percent = percent;
    }

    public override Decimal apply(Decimal amount) {
        return amount * (1 - percent / 100);
    }
}

public class FixedDiscount extends Discount {
    private Decimal off;

    public FixedDiscount(String label, Decimal off) {
        super(label);
        this.off = off;
    }

    public override Decimal apply(Decimal amount) {
        return amount - off > 0 ? amount - off : 0;
    }

    public override String describe() {
        return super.describe() + ' (-' + off + ')';
    }
}

// Uso
Discount spring = new PercentDiscount('Primavera', 10);
Discount welcome = new FixedDiscount('Bienvenida', 50);
Decimal result = welcome.apply(30);   // 0
System.debug(spring.apply(200) + ' · ' + welcome.describe());`,
      en: `public abstract class Discount {
    public String label;

    public Discount(String label) {
        this.label = label;
    }

    public abstract Decimal apply(Decimal amount);

    public virtual String describe() {
        return label;
    }
}

public class PercentDiscount extends Discount {
    private Decimal percent;

    public PercentDiscount(String label, Decimal percent) {
        super(label);
        this.percent = percent;
    }

    public override Decimal apply(Decimal amount) {
        return amount * (1 - percent / 100);
    }
}

public class FixedDiscount extends Discount {
    private Decimal off;

    public FixedDiscount(String label, Decimal off) {
        super(label);
        this.off = off;
    }

    public override Decimal apply(Decimal amount) {
        return amount - off > 0 ? amount - off : 0;
    }

    public override String describe() {
        return super.describe() + ' (-' + off + ')';
    }
}

// Usage
Discount spring = new PercentDiscount('Spring', 10);
Discount welcome = new FixedDiscount('Welcome', 50);
Decimal result = welcome.apply(30);   // 0
System.debug(spring.apply(200) + ' · ' + welcome.describe());`,
    },
    checks: [
      {
        id: "m05-l08-c1",
        label: {
          es: "Discount es abstracta, con apply abstracto y describe virtual",
          en: "Discount is abstract, with an abstract apply and a virtual describe",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+abstract\\s+class\\s+Discount\\s*\\{" },
            { op: "match", pattern: "public\\s+abstract\\s+Decimal\\s+apply\\s*\\(\\s*Decimal\\s+\\w+\\s*\\)\\s*;" },
            { op: "match", pattern: "public\\s+virtual\\s+String\\s+describe\\s*\\(\\s*\\)\\s*\\{" },
          ],
        },
        onFail: {
          es: "public abstract class Discount { … public abstract Decimal apply(Decimal amount); public virtual String describe() { return label; } }",
          en: "public abstract class Discount { … public abstract Decimal apply(Decimal amount); public virtual String describe() { return label; } }",
        },
      },
      {
        id: "m05-l08-c2",
        label: {
          es: "Las dos hijas heredan de Discount y llaman a super(label)",
          en: "Both children inherit from Discount and call super(label)",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+class\\s+PercentDiscount\\s+extends\\s+Discount\\s*\\{" },
            { op: "match", pattern: "public\\s+class\\s+FixedDiscount\\s+extends\\s+Discount\\s*\\{" },
            { op: "count", pattern: "super\\(\\s*\\w+\\s*\\)\\s*;", min: 2 },
          ],
        },
        onFail: {
          es: "public class PercentDiscount extends Discount { … } y lo mismo con FixedDiscount; cada constructor empieza con super(label);",
          en: "public class PercentDiscount extends Discount { … } and the same for FixedDiscount; each constructor starts with super(label);",
        },
      },
      {
        id: "m05-l08-c3",
        label: {
          es: "Cada hija implementa apply con override",
          en: "Each child implements apply with override",
        },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "public\\s+override\\s+Decimal\\s+apply\\s*\\(\\s*Decimal\\s+\\w+\\s*\\)\\s*\\{", min: 2 },
            { op: "match", pattern: "/\\s*100" },
          ],
        },
        onFail: {
          es: "apply es abstracto: cada hija tiene que escribir public override Decimal apply(Decimal amount) { … }. El porcentaje se convierte con / 100.",
          en: "apply is abstract: each child must write public override Decimal apply(Decimal amount) { … }. The percentage is converted with / 100.",
        },
      },
      {
        id: "m05-l08-c4",
        label: {
          es: "FixedDiscount no baja de 0 y amplía describe con super",
          en: "FixedDiscount never goes below 0 and extends describe with super",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: ">\\s*0\\s*\\?[^;]*:\\s*0\\s*;|<\\s*0\\s*\\?\\s*0\\s*:|Math\\.max\\(" },
            { op: "match", pattern: "public\\s+override\\s+String\\s+describe\\s*\\(\\s*\\)\\s*\\{[^}]*super\\.describe\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "Para no bajar de 0: amount - off > 0 ? amount - off : 0. Y describe(): public override String describe() { return super.describe() + …; }",
          en: "To stay at or above 0: amount - off > 0 ? amount - off : 0. And describe(): public override String describe() { return super.describe() + …; }",
        },
        onPass: {
          es: "super.describe() reutiliza lo del padre: si mañana la etiqueta se formatea distinto, FixedDiscount lo hereda sin tocarla.",
          en: "super.describe() reuses the parent's work: if the label is formatted differently tomorrow, FixedDiscount inherits it untouched.",
        },
      },
      {
        id: "m05-l08-c5",
        label: {
          es: "El uso trabaja con variables de tipo Discount y nunca instancia Discount",
          en: "The usage works with Discount-typed variables and never instantiates Discount",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Discount\\s+\\w+\\s*=\\s*new\\s+PercentDiscount\\s*\\(" },
            { op: "match", pattern: "Discount\\s+\\w+\\s*=\\s*new\\s+FixedDiscount\\s*\\(\\s*'[^']*'\\s*,\\s*50\\s*\\)" },
            { op: "match", pattern: "\\.apply\\(\\s*30\\s*\\)" },
            { op: "absent", pattern: "new\\s+Discount\\s*\\(" },
          ],
        },
        onFail: {
          es: "Discount spring = new PercentDiscount(…); Discount welcome = new FixedDiscount('…', 50); y welcome.apply(30). new Discount() no compilaría.",
          en: "Discount spring = new PercentDiscount(…); Discount welcome = new FixedDiscount('…', 50); and welcome.apply(30). new Discount() would not compile.",
        },
      },
    ],
    rubric: [
      {
        es: "Si mañana llega un BuyTwoGetOneDiscount, ¿qué tendrías que escribir y qué seguro que no tocarías?",
        en: "If a BuyTwoGetOneDiscount arrives tomorrow, what would you have to write and what would you definitely not touch?",
      },
    ],
  },
};
