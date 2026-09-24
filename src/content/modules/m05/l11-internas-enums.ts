import type { Lesson } from "@/lib/types";

export const l11InternasEnums: Lesson = {
  id: "m05-l11",
  slug: "clases-internas-y-enums",
  n: 11,
  kind: "lesson",
  minutes: 22,
  title: { es: "Clases internas y Enums", en: "Inner classes and Enums" },
  summary: {
    es: "Un enum es una lista cerrada de valores que el compilador vigila. Una clase interna agrupa datos que solo tienen sentido junto a su clase, como una fila de informe con columnas de varios objetos.",
    en: "An enum is a closed list of values the compiler watches over. An inner class groups data that only makes sense next to its class, like a report row with columns from several objects.",
  },
  analogy: {
    es: "Un picklist restringido (enum) y una fila de informe con columnas de varios objetos (clase wrapper)",
    en: "A restricted picklist (enum) and a report row with columns from several objects (wrapper class)",
  },
  objectives: [
    {
      es: "Declarar un enum, usar sus valores y recorrerlo con switch.",
      en: "Declare an enum, use its values and route on it with switch.",
    },
    {
      es: "Escribir una clase interna y usarla desde fuera con Externa.Interna.",
      en: "Write an inner class and use it from outside as Outer.Inner.",
    },
    {
      es: "Reconocer el patrón wrapper: juntar en un objeto datos que vienen de sitios distintos.",
      en: "Recognise the wrapper pattern: gathering into one object data that comes from different places.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Dos herramientas pequeñas para cerrar el módulo, y las dos las verás en casi cualquier org. Los enums acaban con los errores de escribir mal un texto. Las clases internas mantienen juntas las piezas que solo existen para servir a una clase.",
        en: "Two small tools to close the module, and you will see both in almost any org. Enums put an end to mistyped-text bugs. Inner classes keep together the pieces that only exist to serve one class.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Un picklist restringido solo acepta sus valores: nadie puede guardar 'Hgih' en Priority. Un enum es eso, pero lo vigila el compilador: si escribes un valor que no existe, la clase ni siquiera se guarda. Y una clase wrapper es como una fila de un informe con columnas de Account y de Opportunity: un objeto hecho a medida para llevar juntos datos de varios sitios.",
        en: "A restricted picklist only accepts its values: nobody can save 'Hgih' in Priority. An enum is that, but the compiler enforces it: write a value that does not exist and the class will not even save. And a wrapper class is like a report row with Account and Opportunity columns: an object tailored to carry data from several places together.",
      },
    },
    {
      type: "h",
      text: { es: "Enum: una lista cerrada de valores", en: "Enum: a closed list of values" },
    },
    {
      type: "code",
      code: {
        es: `public enum Tier { STANDARD, PRIORITY, CRITICAL }

Tier current = Tier.CRITICAL;
Tier typo = Tier.CRITCAL;        // ❌ no compila: ese valor no existe
String asText = 'CRITCAL';       // ✅ compila… y el error aparecerá en producción

System.debug(current.name());     // CRITICAL
System.debug(current.ordinal());  // 2: su posición, empezando en 0
System.debug(Tier.values());      // (STANDARD, PRIORITY, CRITICAL)`,
        en: `public enum Tier { STANDARD, PRIORITY, CRITICAL }

Tier current = Tier.CRITICAL;
Tier typo = Tier.CRITCAL;        // ❌ does not compile: that value does not exist
String asText = 'CRITCAL';       // ✅ compiles… and the bug will surface in production

System.debug(current.name());     // CRITICAL
System.debug(current.ordinal());  // 2: its position, starting at 0
System.debug(Tier.values());      // (STANDARD, PRIORITY, CRITICAL)`,
      },
      caption: {
        es: "Con un String, una errata es un bug silencioso. Con un enum, es un error al guardar que solo ves tú.",
        en: "With a String, a typo is a silent bug. With an enum, it is a save error only you see.",
      },
    },
    {
      type: "p",
      text: {
        es: "Los enums encajan de maravilla con el switch del Módulo 2. Hay una particularidad: en los when se escribe solo el valor, sin el nombre del enum delante. Y como el compilador conoce todos los valores, un enum es mucho más seguro que repartir por textos.",
        en: "Enums fit Module 2's switch beautifully. There is one quirk: in the whens you write just the value, without the enum's name in front. And since the compiler knows every value, an enum is much safer than routing by text.",
      },
    },
    {
      type: "code",
      code: {
        es: `switch on current {
    when CRITICAL { slaHours = 4; }      // CRITICAL, no Tier.CRITICAL
    when PRIORITY { slaHours = 24; }
    when else     { slaHours = 72; }
}`,
        en: `switch on current {
    when CRITICAL { slaHours = 4; }      // CRITICAL, not Tier.CRITICAL
    when PRIORITY { slaHours = 24; }
    when else     { slaHours = 72; }
}`,
      },
    },
    {
      type: "h",
      text: { es: "Clases internas y el patrón wrapper", en: "Inner classes and the wrapper pattern" },
    },
    {
      type: "p",
      text: {
        es: "Una clase puede declarar otra dentro de sus llaves. Desde fuera se nombra como Externa.Interna. Se usa sobre todo para el patrón wrapper: un objeto pequeño que junta datos de varios registros —el nombre del caso, su nivel, sus horas de respuesta— y que solo tiene sentido para esa clase. Lo verás muchísimo cuando envíes datos a una pantalla con LWC.",
        en: "A class can declare another inside its braces. From outside it is named as Outer.Inner. It is used above all for the wrapper pattern: a small object gathering data from several records — the case's subject, its tier, its response hours — that only makes sense for that class. You will see it constantly when sending data to a screen with LWC.",
      },
    },
    {
      type: "code",
      code: {
        es: `public class CaseRouter {
    public enum Tier { STANDARD, PRIORITY, CRITICAL }

    public class Assignment {                 // clase interna (wrapper)
        public String caseSubject;
        public Tier tier;
        public Integer slaHours;
    }

    public static Assignment route(Case c) {
        Assignment result = new Assignment();
        result.caseSubject = c.Subject;
        result.tier = c.Priority == 'High' ? Tier.CRITICAL : Tier.STANDARD;
        result.slaHours = result.tier == Tier.CRITICAL ? 4 : 72;
        return result;
    }
}

CaseRouter.Assignment a = CaseRouter.route(new Case(Subject = 'Portal caído', Priority = 'High'));
System.debug(a.tier.name() + ' · ' + a.slaHours);   // CRITICAL · 4`,
        en: `public class CaseRouter {
    public enum Tier { STANDARD, PRIORITY, CRITICAL }

    public class Assignment {                 // inner class (wrapper)
        public String caseSubject;
        public Tier tier;
        public Integer slaHours;
    }

    public static Assignment route(Case c) {
        Assignment result = new Assignment();
        result.caseSubject = c.Subject;
        result.tier = c.Priority == 'High' ? Tier.CRITICAL : Tier.STANDARD;
        result.slaHours = result.tier == Tier.CRITICAL ? 4 : 72;
        return result;
    }
}

CaseRouter.Assignment a = CaseRouter.route(new Case(Subject = 'Portal down', Priority = 'High'));
System.debug(a.tier.name() + ' · ' + a.slaHours);   // CRITICAL · 4`,
      },
      caption: {
        es: "Dentro de CaseRouter basta con Assignment y Tier; desde fuera se escriben CaseRouter.Assignment y CaseRouter.Tier.",
        en: "Inside CaseRouter, Assignment and Tier are enough; from outside you write CaseRouter.Assignment and CaseRouter.Tier.",
      },
    },
    {
      type: "diagram",
      id: "m05-inner-enum",
      caption: {
        es: "La clase externa agrupa su enum y su wrapper: quien la usa lo encuentra todo bajo un mismo nombre.",
        en: "The outer class groups its enum and its wrapper: whoever uses it finds everything under one name.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Dos límites de las clases internas", en: "Two limits of inner classes" },
      text: {
        es: "Solo hay un nivel: una clase interna no puede tener otra dentro. Y una clase interna no ve los atributos de instancia de la externa: son dos moldes distintos que comparten apellido, no una instancia dentro de otra.",
        en: "There is only one level: an inner class cannot contain another. And an inner class does not see the outer class's instance attributes: they are two different moulds sharing a surname, not one instance inside another.",
      },
    },
    {
      type: "h",
      text: { es: "El wrapper que verás en cualquier entrevista", en: "The wrapper you will see in any interview" },
    },
    {
      type: "p",
      text: {
        es: "El uso más famoso de una clase interna es el wrapper para pantallas: una tabla de cuentas con una casilla para seleccionar varias y actuar sobre ellas. Account no tiene ningún campo «seleccionado», y crear uno en el objeto solo para una pantalla sería ensuciar el modelo de datos. La solución es un wrapper que junta el registro y la casilla. Es tan habitual que en las entrevistas de desarrollador Salesforce se pregunta casi siempre.",
        en: "The most famous use of an inner class is the screen wrapper: a table of accounts with a checkbox to select several and act on them. Account has no “selected” field, and creating one on the object just for a screen would clutter the data model. The fix is a wrapper bundling the record and the checkbox. It is so common that Salesforce developer interviews ask about it almost every time.",
      },
    },
    {
      type: "code",
      code: {
        es: `public class AccountPicker {
    public class Row {
        public Boolean selected = false;   // lo que la cuenta no tiene
        public Account record;             // el registro, entero
        public Row(Account record) { this.record = record; }
    }
}

List<AccountPicker.Row> rows = new List<AccountPicker.Row>();
for (Account a : [SELECT Id, Name FROM Account LIMIT 20]) {
    rows.add(new AccountPicker.Row(a));
}`,
        en: `public class AccountPicker {
    public class Row {
        public Boolean selected = false;   // what the account lacks
        public Account record;             // the whole record
        public Row(Account record) { this.record = record; }
    }
}

List<AccountPicker.Row> rows = new List<AccountPicker.Row>();
for (Account a : [SELECT Id, Name FROM Account LIMIT 20]) {
    rows.add(new AccountPicker.Row(a));
}`,
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Picklist restringido o enum: dónde vive la lista", en: "Restricted picklist or enum: where the list lives" },
      text: {
        es: "Un picklist restringido protege los DATOS: nadie puede guardar un valor que no esté en la lista, ni siquiera por API. Un enum protege el CÓDIGO: nadie puede escribir un valor que no exista, porque no compila. Y hay una diferencia práctica: un Admin cambia los valores del picklist desde Setup cuando quiere; los de un enum solo cambian con un despliegue. Por eso los enums se usan para listas que son parte de la lógica (niveles de servicio, estados internos), no para las que decide el negocio cada trimestre.",
        en: "A restricted picklist protects the DATA: nobody can save a value not on the list, not even through the API. An enum protects the CODE: nobody can write a value that does not exist, because it will not compile. And there is a practical difference: an Admin changes a picklist's values from Setup whenever they like; an enum's only change with a deployment. That is why enums are used for lists that are part of the logic (service tiers, internal states), not for those the business decides every quarter.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "El libro no cubre enums ni clases internas, así que si ves ejemplos de Java por internet, ojo: los enums de Java pueden tener atributos, constructores y métodos propios. Los de Apex son mucho más simples: una lista de valores con name(), ordinal() y values(). Si necesitas más, lo normal en Apex es una clase o Custom Metadata.",
        en: "The book does not cover enums or inner classes, so if you see Java examples online, beware: Java enums can have their own attributes, constructors and methods. Apex ones are much simpler: a list of values with name(), ordinal() and values(). If you need more, the usual Apex answer is a class or Custom Metadata.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿qué ventaja tiene Tier.CRITICAL sobre el texto 'CRITICAL'? ¿Cómo se escribe el tipo de la clase interna Assignment desde fuera de CaseRouter?",
        en: "Without looking up: what advantage does Tier.CRITICAL have over the text 'CRITICAL'? How do you write the Assignment inner class's type from outside CaseRouter?",
      },
    },
  ],

  quiz: [
    {
      id: "m05-l11-q1",
      kind: "single",
      prompt: {
        es: "Con public enum Tier { STANDARD, PRIORITY, CRITICAL }, ¿qué ocurre con Tier t = Tier.URGENT;?",
        en: "With public enum Tier { STANDARD, PRIORITY, CRITICAL }, what happens with Tier t = Tier.URGENT;?",
      },
      options: [
        { es: "No compila: URGENT no es un valor del enum.", en: "It does not compile: URGENT is not a value of the enum." },
        { es: "t queda en null.", en: "t is left null." },
        { es: "Lanza una excepción al ejecutarse.", en: "It throws an exception at runtime." },
      ],
      answer: 0,
      explain: {
        es: "Esa es la ventaja del enum: el error aparece al guardar, no delante de un usuario.",
        en: "That is the enum's advantage: the error shows up on save, not in front of a user.",
      },
      tags: ["find-error"],
    },
    {
      id: "m05-l11-q2",
      kind: "single",
      prompt: { es: "¿Qué muestra este código?", en: "What does this code print?" },
      code: {
        es: `public enum Stage { LEAD, QUALIFIED, WON }
Stage s = Stage.WON;
System.debug(s.ordinal() + ' ' + s.name());`,
        en: `public enum Stage { LEAD, QUALIFIED, WON }
Stage s = Stage.WON;
System.debug(s.ordinal() + ' ' + s.name());`,
      },
      options: [
        { es: "2 WON", en: "2 WON" },
        { es: "3 WON", en: "3 WON" },
        { es: "2 Stage.WON", en: "2 Stage.WON" },
      ],
      answer: 0,
      explain: {
        es: "ordinal() cuenta desde 0, como los índices de una List: LEAD 0, QUALIFIED 1, WON 2. name() da el texto del valor.",
        en: "ordinal() counts from 0, like List indexes: LEAD 0, QUALIFIED 1, WON 2. name() gives the value's text.",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M1 L8", en: "Review · M1 L8" },
    },
    {
      id: "m05-l11-q3",
      kind: "single",
      prompt: {
        es: "¿Cuál es la forma correcta de un when para un switch sobre un enum Tier?",
        en: "What is the correct form of a when for a switch on a Tier enum?",
      },
      options: [
        { es: "when CRITICAL { … }", en: "when CRITICAL { … }" },
        { es: "when Tier.CRITICAL { … }", en: "when Tier.CRITICAL { … }" },
        { es: "when 'CRITICAL' { … }", en: "when 'CRITICAL' { … }" },
      ],
      answer: 0,
      explain: {
        es: "En los when de un enum va solo el valor. Con comillas sería un String, que es otro tipo.",
        en: "In an enum's whens, only the value goes. With quotes it would be a String, a different type.",
      },
      tags: ["spaced", "interleaving"],
      from: { es: "Repaso · M2 L2", en: "Review · M2 L2" },
    },
    {
      id: "m05-l11-q4",
      kind: "text",
      prompt: {
        es: "Desde fuera de la clase CaseRouter, ¿cómo se escribe el tipo de su clase interna Assignment?",
        en: "From outside the CaseRouter class, how do you write the type of its Assignment inner class?",
      },
      accept: ["CaseRouter\\.Assignment"],
      placeholder: { es: "Externa.Interna", en: "Outer.Inner" },
      explain: {
        es: "CaseRouter.Assignment: el apellido de la clase externa, un punto y el nombre de la interna.",
        en: "CaseRouter.Assignment: the outer class's surname, a dot and the inner class's name.",
      },
      tags: ["recall"],
    },
    {
      id: "m05-l11-q5",
      kind: "multi",
      prompt: {
        es: "¿Qué afirmaciones son ciertas sobre las clases internas en Apex?",
        en: "Which statements about inner classes in Apex are true?",
      },
      options: [
        {
          es: "Solo hay un nivel: una clase interna no puede tener otra dentro.",
          en: "There is only one level: an inner class cannot contain another.",
        },
        {
          es: "Son la forma habitual de escribir wrappers.",
          en: "They are the usual way to write wrappers.",
        },
        {
          es: "Pueden leer directamente los atributos de instancia de la externa.",
          en: "They can read the outer class's instance attributes directly.",
        },
      ],
      answers: [0, 1],
      explain: {
        es: "La interna comparte nombre con la externa, pero no su instancia: no ve sus atributos.",
        en: "The inner class shares a name with the outer one, but not its instance: it does not see its attributes.",
      },
    },
    {
      id: "m05-l11-q6",
      kind: "single",
      prompt: {
        es: "¿Qué valor tiene hours?",
        en: "What value does hours hold?",
      },
      code: {
        es: `public enum Tier { STANDARD, PRIORITY, CRITICAL }
Tier t = Tier.PRIORITY;
Integer hours;
switch on t {
    when CRITICAL { hours = 4; }
    when PRIORITY { hours = 24; }
    when else     { hours = 72; }
}`,
        en: `public enum Tier { STANDARD, PRIORITY, CRITICAL }
Tier t = Tier.PRIORITY;
Integer hours;
switch on t {
    when CRITICAL { hours = 4; }
    when PRIORITY { hours = 24; }
    when else     { hours = 72; }
}`,
      },
      options: [
        { es: "24", en: "24" },
        { es: "4", en: "4" },
        { es: "72", en: "72" },
      ],
      answer: 0,
      explain: {
        es: "El switch sobre enum funciona igual que sobre texto, pero sin riesgo de mayúsculas ni erratas.",
        en: "A switch on an enum works just like one on text, but with no risk from case or typos.",
      },
      tags: ["predict-output"],
    },
  ],

  exercise: {
    prompt: {
      es: "Soporte quiere dejar de repartir casos comparando textos. Escribe un enrutador con un enum para los niveles y un wrapper con el resultado de cada asignación.",
      en: "Support wants to stop routing cases by comparing text. Write a router with an enum for the tiers and a wrapper holding each assignment's result.",
    },
    brief: [
      {
        es: "Clase pública CaseRouter con un enum público Tier con los valores STANDARD, PRIORITY y CRITICAL.",
        en: "Public class CaseRouter with a public enum Tier holding STANDARD, PRIORITY and CRITICAL.",
      },
      {
        es: "Una clase interna pública Assignment con caseSubject (String), tier (Tier) y slaHours (Integer).",
        en: "A public inner class Assignment with caseSubject (String), tier (Tier) and slaHours (Integer).",
      },
      {
        es: "Un método estático route(Case c) que devuelva un Assignment: Priority 'High' es CRITICAL, 'Medium' es PRIORITY y el resto STANDARD. Las horas salen de un switch sobre el tier: 4, 24 y 72.",
        en: "A static method route(Case c) returning an Assignment: Priority 'High' is CRITICAL, 'Medium' is PRIORITY and the rest STANDARD. The hours come from a switch on the tier: 4, 24 and 72.",
      },
      {
        es: "Debajo: enruta un caso de prioridad 'Medium' y guarda el resultado en una variable del tipo de la clase interna.",
        en: "Below: route a 'Medium' priority case and store the result in a variable of the inner class's type.",
      },
    ],
    starter: {
      es: `// 1. CaseRouter con su enum, su clase interna y route().


// 2. Uso.
`,
      en: `// 1. CaseRouter with its enum, its inner class and route().


// 2. Usage.
`,
    },
    hints: [
      {
        es: "Todo vive dentro de las llaves de CaseRouter: el enum, la clase interna y el método. Desde fuera, los tipos se nombran con CaseRouter. delante.",
        en: "Everything lives inside CaseRouter's braces: the enum, the inner class and the method. From outside, the types are named with CaseRouter. in front.",
      },
      {
        es: "public enum Tier { STANDARD, PRIORITY, CRITICAL } — public class Assignment { … public Tier tier; … } — en route: primero decide el tier con if/else if (o switch sobre Priority), después switch on result.tier con when CRITICAL, when PRIORITY y when else.",
        en: "public enum Tier { STANDARD, PRIORITY, CRITICAL } — public class Assignment { … public Tier tier; … } — in route: first decide the tier with if/else if (or a switch on Priority), then switch on result.tier with when CRITICAL, when PRIORITY and when else.",
      },
      {
        es: "Pseudocódigo del uso: CaseRouter.Assignment a = CaseRouter.route(new Case(Subject = '…', Priority = 'Medium')); — debería dar PRIORITY y 24 horas.",
        en: "Usage pseudocode: CaseRouter.Assignment a = CaseRouter.route(new Case(Subject = '…', Priority = 'Medium')); — it should give PRIORITY and 24 hours.",
      },
    ],
    solution: {
      es: `public class CaseRouter {
    public enum Tier { STANDARD, PRIORITY, CRITICAL }

    public class Assignment {
        public String caseSubject;
        public Tier tier;
        public Integer slaHours;
    }

    public static Assignment route(Case c) {
        Assignment result = new Assignment();
        result.caseSubject = c.Subject;

        if (c.Priority == 'High') {
            result.tier = Tier.CRITICAL;
        } else if (c.Priority == 'Medium') {
            result.tier = Tier.PRIORITY;
        } else {
            result.tier = Tier.STANDARD;
        }

        switch on result.tier {
            when CRITICAL {
                result.slaHours = 4;
            }
            when PRIORITY {
                result.slaHours = 24;
            }
            when else {
                result.slaHours = 72;
            }
        }
        return result;
    }
}

// Uso
CaseRouter.Assignment assignment = CaseRouter.route(new Case(Subject = 'Error en la factura', Priority = 'Medium'));
System.debug(assignment.tier.name() + ' · ' + assignment.slaHours);   // PRIORITY · 24`,
      en: `public class CaseRouter {
    public enum Tier { STANDARD, PRIORITY, CRITICAL }

    public class Assignment {
        public String caseSubject;
        public Tier tier;
        public Integer slaHours;
    }

    public static Assignment route(Case c) {
        Assignment result = new Assignment();
        result.caseSubject = c.Subject;

        if (c.Priority == 'High') {
            result.tier = Tier.CRITICAL;
        } else if (c.Priority == 'Medium') {
            result.tier = Tier.PRIORITY;
        } else {
            result.tier = Tier.STANDARD;
        }

        switch on result.tier {
            when CRITICAL {
                result.slaHours = 4;
            }
            when PRIORITY {
                result.slaHours = 24;
            }
            when else {
                result.slaHours = 72;
            }
        }
        return result;
    }
}

// Usage
CaseRouter.Assignment assignment = CaseRouter.route(new Case(Subject = 'Invoice error', Priority = 'Medium'));
System.debug(assignment.tier.name() + ' · ' + assignment.slaHours);   // PRIORITY · 24`,
    },
    checks: [
      {
        id: "m05-l11-c1",
        label: {
          es: "CaseRouter declara el enum Tier con sus tres valores",
          en: "CaseRouter declares the Tier enum with its three values",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+class\\s+CaseRouter\\s*\\{" },
            {
              op: "match",
              pattern: "public\\s+enum\\s+Tier\\s*\\{\\s*STANDARD\\s*,\\s*PRIORITY\\s*,\\s*CRITICAL\\s*\\}",
              flags: "",
            },
          ],
        },
        onFail: {
          es: "Dentro de CaseRouter: public enum Tier { STANDARD, PRIORITY, CRITICAL }",
          en: "Inside CaseRouter: public enum Tier { STANDARD, PRIORITY, CRITICAL }",
        },
      },
      {
        id: "m05-l11-c2",
        label: {
          es: "La clase interna Assignment tiene sus tres atributos, uno de tipo Tier",
          en: "The Assignment inner class has its three attributes, one of type Tier",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+class\\s+Assignment\\s*\\{" },
            { op: "match", pattern: "public\\s+String\\s+caseSubject\\s*;" },
            { op: "match", pattern: "public\\s+Tier\\s+tier\\s*;" },
            { op: "match", pattern: "public\\s+Integer\\s+slaHours\\s*;" },
          ],
        },
        onFail: {
          es: "public class Assignment { public String caseSubject; public Tier tier; public Integer slaHours; } — dentro de CaseRouter.",
          en: "public class Assignment { public String caseSubject; public Tier tier; public Integer slaHours; } — inside CaseRouter.",
        },
      },
      {
        id: "m05-l11-c3",
        label: {
          es: "route es estático, devuelve un Assignment y fija los tres niveles",
          en: "route is static, returns an Assignment and sets all three tiers",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+static\\s+Assignment\\s+route\\s*\\(\\s*Case\\s+\\w+\\s*\\)" },
            { op: "match", pattern: "Tier\\.CRITICAL", flags: "" },
            { op: "match", pattern: "Tier\\.PRIORITY", flags: "" },
            { op: "match", pattern: "Tier\\.STANDARD", flags: "" },
            { op: "match", pattern: "return\\s+\\w+\\s*;" },
          ],
        },
        onFail: {
          es: "public static Assignment route(Case c) { … } que cree el Assignment, le asigne Tier.CRITICAL, Tier.PRIORITY o Tier.STANDARD según la prioridad y lo devuelva.",
          en: "public static Assignment route(Case c) { … } that creates the Assignment, sets Tier.CRITICAL, Tier.PRIORITY or Tier.STANDARD by priority, and returns it.",
        },
      },
      {
        id: "m05-l11-c4",
        label: {
          es: "Las horas salen de un switch sobre el tier, con los when sin prefijo",
          en: "The hours come from a switch on the tier, with unprefixed whens",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "switch\\s+on\\s+[\\w.]*tier\\s*\\{" },
            { op: "match", pattern: "when\\s+CRITICAL\\s*\\{[^}]*=\\s*4\\s*;", flags: "" },
            { op: "match", pattern: "when\\s+PRIORITY\\s*\\{[^}]*=\\s*24\\s*;", flags: "" },
            { op: "match", pattern: "when\\s+else\\s*\\{[^}]*=\\s*72\\s*;" },
          ],
        },
        onFail: {
          es: "switch on result.tier { when CRITICAL { … 4 } when PRIORITY { … 24 } when else { … 72 } } — en los when de un enum va solo el valor.",
          en: "switch on result.tier { when CRITICAL { … 4 } when PRIORITY { … 24 } when else { … 72 } } — an enum's whens take just the value.",
        },
        onPass: {
          es: "Si alguien escribe when CRITCAL, no compila. Con textos, ese caso habría caído en when else sin avisar.",
          en: "If someone writes when CRITCAL, it does not compile. With text, that case would have fallen into when else without warning.",
        },
      },
      {
        id: "m05-l11-c5",
        label: {
          es: "El uso guarda el resultado en una variable CaseRouter.Assignment",
          en: "The usage stores the result in a CaseRouter.Assignment variable",
        },
        rule: {
          op: "match",
          pattern: "CaseRouter\\.Assignment\\s+\\w+\\s*=\\s*CaseRouter\\.route\\(\\s*new\\s+Case\\s*\\([^)]*Priority\\s*=\\s*'Medium'[^)]*\\)\\s*\\)",
        },
        onFail: {
          es: "CaseRouter.Assignment a = CaseRouter.route(new Case(Subject = '…', Priority = 'Medium'));",
          en: "CaseRouter.Assignment a = CaseRouter.route(new Case(Subject = '…', Priority = 'Medium'));",
        },
      },
    ],
    rubric: [
      {
        es: "Si Soporte añade un nivel VIP, ¿qué te avisaría el compilador que te falta por tocar? ¿Y si los niveles fueran textos?",
        en: "If Support adds a VIP tier, what would the compiler warn you is left to change? And if the tiers were text?",
      },
    ],
  },
};
