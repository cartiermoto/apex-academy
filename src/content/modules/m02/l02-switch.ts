import type { Lesson } from "@/lib/types";

export const l02Switch: Lesson = {
  id: "m02-l02",
  slug: "switch",
  n: 2,
  kind: "lesson",
  minutes: 16,
  title: { es: "Switch Statement", en: "Switch Statement" },
  summary: {
    es: "Cuando la pregunta es «¿qué valor tiene este picklist?», switch lo resuelve con una salida por valor.",
    en: "When the question is “what value does this picklist hold?”, switch answers it with one outcome per value.",
  },
  analogy: {
    es: "Un Decision con una salida por cada valor de un picklist",
    en: "A Decision with one outcome per picklist value",
  },
  objectives: [
    {
      es: "Escribir un switch on con varias ramas when, valores agrupados y when else.",
      en: "Write a switch on with several when branches, grouped values and when else.",
    },
    {
      es: "Elegir entre switch e if según sea una pregunta de valor exacto o de rango.",
      en: "Choose between switch and if depending on whether the question is about an exact value or a range.",
    },
    {
      es: "Tratar el valor vacío y las mayúsculas, que en switch sí importan.",
      en: "Handle the empty value and letter case, which do matter in a switch.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Muchas decisiones de negocio no son «¿es mayor que?», sino «¿cuál de estos valores es?»: el origen de un caso, la etapa de una oportunidad, el sector de una cuenta. Para eso una cadena de else if funciona, pero switch lo dice más claro.",
        en: "Many business decisions are not “is it bigger than?” but “which of these values is it?”: a case's origin, an opportunity's stage, an account's industry. An else if chain works for that, but switch says it more clearly.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Piensa en un Decision sobre Case.Origin con una salida para Phone, otra para Email y Web juntos, y la salida por defecto para lo demás. Cada salida compara el mismo campo con un valor distinto del picklist. switch es exactamente eso: nombras el campo una vez y listas los valores.",
        en: "Think of a Decision on Case.Origin with one outcome for Phone, another for Email and Web together, and the default outcome for the rest. Each outcome compares the same field against a different picklist value. switch is exactly that: you name the field once and list the values.",
      },
    },
    {
      type: "h",
      text: { es: "Anatomía de un switch", en: "Anatomy of a switch" },
    },
    {
      type: "code",
      code: {
        es: `Case support = new Case(Subject = 'No puedo entrar', Origin = 'Email');
String queueName;

switch on support.Origin {
    when 'Phone' {
        queueName = 'Soporte telefónico';
    }
    when 'Email', 'Web' {
        queueName = 'Soporte digital';
    }
    when null {
        queueName = 'Revisión manual';
    }
    when else {
        queueName = 'Soporte general';
    }
}`,
        en: `Case support = new Case(Subject = 'Cannot log in', Origin = 'Email');
String queueName;

switch on support.Origin {
    when 'Phone' {
        queueName = 'Phone support';
    }
    when 'Email', 'Web' {
        queueName = 'Digital support';
    }
    when null {
        queueName = 'Manual review';
    }
    when else {
        queueName = 'General support';
    }
}`,
      },
      caption: {
        es: "switch on + lo que se evalúa; cada when es una salida; when else es la salida por defecto y va siempre la última.",
        en: "switch on + what is evaluated; each when is an outcome; when else is the default outcome and always goes last.",
      },
    },
    {
      type: "list",
      items: [
        {
          es: "Varios valores en una rama se separan con comas: when 'Email', 'Web'.",
          en: "Several values in one branch are separated by commas: when 'Email', 'Web'.",
        },
        {
          es: "when null recoge el campo vacío. Sin esa rama, un null cae en when else; no lanza ninguna excepción.",
          en: "when null catches the empty field. Without that branch, a null falls into when else; it does not throw any exception.",
        },
        {
          es: "Solo se ejecuta una rama y no hace falta ninguna palabra para «salir»: al terminar la rama, el switch termina.",
          en: "Only one branch runs and no keyword is needed to “leave”: when the branch ends, the switch ends.",
        },
        {
          es: "Un mismo valor no puede aparecer en dos ramas: Apex no lo deja compilar.",
          en: "The same value cannot appear in two branches: Apex will not compile it.",
        },
      ],
    },
    {
      type: "diagram",
      id: "m02-switch",
      caption: {
        es: "switch evalúa el campo una sola vez y lo reparte a la salida de su valor.",
        en: "switch evaluates the field once and routes it to the outcome for its value.",
      },
    },
    {
      type: "h",
      text: { es: "Qué puede ir en un when", en: "What can go in a when" },
    },
    {
      type: "p",
      text: {
        es: "Los valores de un when tienen que ser fijos y escritos tal cual: 'Phone', 3, null. No valen rangos ni condiciones como amount > 1000. Por eso switch sirve para Strings (picklists), Integer y Long, pero la pregunta «¿está entre 10.000 y 100.000?» sigue siendo trabajo de if.",
        en: "The values in a when have to be fixed and written literally: 'Phone', 3, null. Ranges and conditions like amount > 1000 are not allowed. That is why switch works for Strings (picklists), Integer and Long, but the question “is it between 10,000 and 100,000?” is still a job for if.",
      },
    },
    {
      type: "table",
      head: [
        { es: "La pregunta es…", en: "The question is…" },
        { es: "Usa", en: "Use" },
      ],
      rows: [
        [
          { es: "¿Qué valor del picklist tiene?", en: "Which picklist value does it hold?" },
          { es: "switch", en: "switch" },
        ],
        [
          { es: "¿Es mayor, menor o está entre dos números?", en: "Is it greater, smaller or between two numbers?" },
          { es: "if / else if", en: "if / else if" },
        ],
        [
          { es: "¿Se cumplen varias cosas a la vez?", en: "Do several things hold at once?" },
          { es: "if con && o ||", en: "if with && or ||" },
        ],
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "En switch, las mayúsculas cuentan", en: "In a switch, case matters" },
      text: {
        es: "Recuerda que == entre Strings ignora mayúsculas. switch no: when 'Phone' no atrapa 'phone'. Con picklists no suele ser un problema porque el valor viene siempre igual, pero si el texto lo escribe una persona, normalízalo antes con toUpperCase() y escribe los when en mayúsculas.",
        en: "Remember that == between Strings ignores case. switch does not: when 'Phone' does not catch 'phone'. With picklists this is rarely a problem because the value always arrives the same way, but if a person typed the text, normalise it first with toUpperCase() and write the whens in upper case.",
      },
    },
    {
      type: "code",
      code: {
        es: `String answer = 'sí';            // escrito a mano por un usuario
switch on answer.toUpperCase() {
    when 'SÍ', 'SI' {
        System.debug('Acepta');
    }
    when else {
        System.debug('No acepta');
    }
}`,
        en: `String answer = 'yes';           // typed by a user
switch on answer.toUpperCase() {
    when 'YES', 'Y' {
        System.debug('Accepted');
    }
    when else {
        System.debug('Not accepted');
    }
}`,
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: nombra una pregunta de negocio que resolverías con switch y otra que no podrías, y explica por qué la segunda necesita if.",
        en: "Without looking up: name one business question you would answer with switch and one you could not, and explain why the second needs if.",
      },
    },
  ],

  quiz: [
    {
      id: "m02-l02-q1",
      kind: "single",
      prompt: { es: "¿Qué muestra este código?", en: "What does this code print?" },
      code: {
        es: `String origin = 'web';
switch on origin {
    when 'Web' {
        System.debug('Digital');
    }
    when else {
        System.debug('Otro');
    }
}`,
        en: `String origin = 'web';
switch on origin {
    when 'Web' {
        System.debug('Digital');
    }
    when else {
        System.debug('Other');
    }
}`,
      },
      options: [
        { es: "Otro", en: "Other" },
        { es: "Digital", en: "Digital" },
        { es: "Nada", en: "Nothing" },
        { es: "Lanza una excepción", en: "It throws an exception" },
      ],
      answer: 0,
      explain: {
        es: "switch distingue mayúsculas: 'web' no es 'Web', así que cae en when else. Con == sí habrían sido iguales.",
        en: "switch is case-sensitive: 'web' is not 'Web', so it falls into when else. With == they would have been equal.",
      },
      tags: ["predict-output", "interleaving"],
    },
    {
      id: "m02-l02-q2",
      kind: "single",
      prompt: {
        es: "¿Cuál de estas ramas no compila?",
        en: "Which of these branches does not compile?",
      },
      options: [
        { es: "when amount > 1000 { … }", en: "when amount > 1000 { … }" },
        { es: "when 'Hot', 'Warm' { … }", en: "when 'Hot', 'Warm' { … }" },
        { es: "when null { … }", en: "when null { … }" },
        { es: "when else { … }", en: "when else { … }" },
      ],
      answer: 0,
      explain: {
        es: "Los when solo admiten valores fijos. Una condición como amount > 1000 es trabajo de if.",
        en: "whens only accept fixed values. A condition like amount > 1000 is a job for if.",
      },
      tags: ["find-error"],
    },
    {
      id: "m02-l02-q3",
      kind: "single",
      prompt: {
        es: "Lead.Rating está vacío y el switch no tiene when null. ¿Qué pasa?",
        en: "Lead.Rating is empty and the switch has no when null. What happens?",
      },
      options: [
        { es: "Entra en when else.", en: "It goes into when else." },
        { es: "Lanza una NullPointerException.", en: "It throws a NullPointerException." },
        { es: "No entra en ninguna rama.", en: "It enters no branch at all." },
        { es: "No compila.", en: "It does not compile." },
      ],
      answer: 0,
      explain: {
        es: "Un null que no tiene rama propia cae en when else, sin excepción. Si el vacío merece un trato distinto, dale su propio when null.",
        en: "A null with no branch of its own falls into when else, with no exception. If the empty value deserves different handling, give it its own when null.",
      },
    },
    {
      id: "m02-l02-q4",
      kind: "text",
      prompt: {
        es: "Completa la rama por defecto de un switch: when ____",
        en: "Complete a switch's default branch: when ____",
      },
      accept: ["else"],
      placeholder: { es: "una palabra", en: "one word" },
      explain: {
        es: "when else. Va siempre la última y recoge cualquier valor que no tenga rama propia.",
        en: "when else. It always goes last and catches any value without a branch of its own.",
      },
      tags: ["recall"],
    },
    {
      id: "m02-l02-q5",
      kind: "multi",
      prompt: {
        es: "¿Qué preguntas se resuelven bien con switch?",
        en: "Which questions are a good fit for switch?",
      },
      options: [
        {
          es: "¿Qué equipo atiende según Case.Origin?",
          en: "Which team handles it, by Case.Origin?",
        },
        {
          es: "¿Qué descuento aplica si el importe está entre 10.000 y 50.000?",
          en: "Which discount applies if the amount is between 10,000 and 50,000?",
        },
        {
          es: "¿Qué plantilla de correo usar según el idioma del contacto ('es', 'en', 'fr')?",
          en: "Which email template to use by the contact's language ('es', 'en', 'fr')?",
        },
        {
          es: "¿La cuenta es cliente y además tiene más de 50 empleados?",
          en: "Is the account a customer and does it also have more than 50 employees?",
        },
      ],
      answers: [0, 2],
      explain: {
        es: "switch brilla con valores exactos de un mismo campo. Los rangos y las combinaciones de condiciones necesitan if.",
        en: "switch shines with exact values of a single field. Ranges and combined conditions need if.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m02-l02-q6",
      kind: "single",
      prompt: {
        es: "¿Qué valor tiene label al final?",
        en: "What value does label hold at the end?",
      },
      code: {
        es: `Integer employees = 250;
String label;
if (employees >= 1000) {
    label = 'Enterprise';
} else if (employees >= 200) {
    label = 'Mid-market';
} else {
    label = 'SMB';
}`,
        en: `Integer employees = 250;
String label;
if (employees >= 1000) {
    label = 'Enterprise';
} else if (employees >= 200) {
    label = 'Mid-market';
} else {
    label = 'SMB';
}`,
      },
      options: [
        { es: "Mid-market", en: "Mid-market" },
        { es: "Enterprise", en: "Enterprise" },
        { es: "SMB", en: "SMB" },
        { es: "null", en: "null" },
      ],
      answer: 0,
      explain: {
        es: "250 no llega a 1000, pero sí a 200: entra en la segunda rama. Fíjate en que esto no se podría escribir con switch, porque son rangos.",
        en: "250 does not reach 1000 but does reach 200: it enters the second branch. Note that this could not be written with switch, because these are ranges.",
      },
      tags: ["spaced", "predict-output"],
      from: { es: "Repaso · M2 L1", en: "Review · M2 L1" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 2 DE 8 · Ya sabes qué nivel de servicio tiene cada cuenta. Ahora Soporte necesita saber en cuánto tiempo responder a sus casos. Soporte ha firmado un acuerdo de nivel de servicio: los casos de prioridad High se responden en 4 horas, los Medium en 24 y los Low en 72. Los casos sin prioridad se tratan como Low, y cualquier valor nuevo que alguien añada al picklist se responde en 48 horas hasta que se decida otra cosa.",
      en: "TASK 2 OF 8 · You now know each account's service tier. Now Support needs to know how fast to answer its cases. Support has signed a service-level agreement: High priority cases are answered within 4 hours, Medium within 24 and Low within 72. Cases with no priority are treated as Low, and any new value someone adds to the picklist is answered within 48 hours until decided otherwise.",
    },
    brief: [
      {
        es: "Parte del caso del código de partida y usa su campo Priority.",
        en: "Start from the case in the starter code and use its Priority field.",
      },
      {
        es: "Declara un Integer llamado slaHours.",
        en: "Declare an Integer named slaHours.",
      },
      {
        es: "Resuélvelo con switch, no con una cadena de if.",
        en: "Solve it with switch, not with an if chain.",
      },
      {
        es: "El caso sin prioridad se trata exactamente igual que Low. Puedes darle su propia rama when null o, mejor, convertir el vacío en 'Low' antes de evaluar con el operador ?? del Módulo 1.",
        en: "The no-priority case is treated exactly like Low. You can give it its own when null branch or, better, turn the empty value into 'Low' before evaluating, with the ?? operator from Module 1.",
      },
      {
        es: "Cualquier otro valor da 48.",
        en: "Any other value gives 48.",
      },
    ],
    starter: {
      es: `// CASO: las reglas de negocio de la cuenta clave · Northwind Trading
// Tarea 2 de 8: las horas de respuesta de cada caso, según su prioridad.

Case support = new Case(Subject = 'Factura duplicada', Priority = 'High');

// Declara slaHours y asígnale las horas con un switch sobre support.Priority.
`,
      en: `// CASE: the key account's business rules · Northwind Trading
// Task 2 of 8: each case's response hours, from its priority.

Case support = new Case(Subject = 'Duplicate invoice', Priority = 'High');

// Declare slaHours and assign the hours with a switch on support.Priority.
`,
    },
    hints: [
      {
        es: "Cuenta los resultados distintos: 4, 24, 72 y 48. Cada uno es una rama, y el 72 tiene que atrapar dos cosas.",
        en: "Count the distinct results: 4, 24, 72 and 48. Each is a branch, and 72 has to catch two things.",
      },
      {
        es: "Lo que se evalúa en switch on puede ser una expresión: support.Priority ?? 'Low' convierte el vacío en 'Low' antes de repartir. Lo que no encaja en nada va a when else.",
        en: "What switch on evaluates can be an expression: support.Priority ?? 'Low' turns the empty value into 'Low' before routing. Whatever fits nowhere goes to when else.",
      },
      {
        es: "Pseudocódigo: Integer slaHours; switch on (support.Priority ?? 'Low') { when 'High' → 4; when 'Medium' → 24; when 'Low' → 72; when else → 48 }",
        en: "Pseudocode: Integer slaHours; switch on (support.Priority ?? 'Low') { when 'High' → 4; when 'Medium' → 24; when 'Low' → 72; when else → 48 }",
      },
    ],
    solution: {
      es: `Case support = new Case(Subject = 'Factura duplicada', Priority = 'High');

Integer slaHours;
switch on (support.Priority ?? 'Low') {
    when 'High' {
        slaHours = 4;
    }
    when 'Medium' {
        slaHours = 24;
    }
    when 'Low' {
        slaHours = 72;
    }
    when else {
        slaHours = 48;
    }
}
System.debug(slaHours);`,
      en: `Case support = new Case(Subject = 'Duplicate invoice', Priority = 'High');

Integer slaHours;
switch on (support.Priority ?? 'Low') {
    when 'High' {
        slaHours = 4;
    }
    when 'Medium' {
        slaHours = 24;
    }
    when 'Low' {
        slaHours = 72;
    }
    when else {
        slaHours = 48;
    }
}
System.debug(slaHours);`,
    },
    checks: [
      {
        id: "m02-l02-c1",
        label: { es: "slaHours se declara como Integer", en: "slaHours is declared as an Integer" },
        rule: { op: "match", pattern: "Integer\\s+slaHours\\s*[;=]" },
        onFail: {
          es: "Las horas se cuentan en unidades enteras: declara Integer slaHours;",
          en: "Hours are counted in whole units: declare Integer slaHours;",
        },
      },
      {
        id: "m02-l02-c2",
        label: {
          es: "Usa switch on sobre support.Priority",
          en: "Uses switch on support.Priority",
        },
        rule: { op: "match", pattern: "switch\\s+on\\s+\\(?\\s*support\\.Priority\\b" },
        onFail: {
          es: "La estructura es switch on support.Priority { … }: nombras el campo una vez y después listas los valores.",
          en: "The shape is switch on support.Priority { … }: you name the field once and then list the values.",
        },
      },
      {
        id: "m02-l02-c3",
        label: {
          es: "High da 4 y Medium da 24",
          en: "High gives 4 and Medium gives 24",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "when\\s+'High'\\s*\\{\\s*slaHours\\s*=\\s*4\\s*;" },
            { op: "match", pattern: "when\\s+'Medium'\\s*\\{\\s*slaHours\\s*=\\s*24\\s*;" },
          ],
        },
        onFail: {
          es: "Cada valor necesita su when con el texto exacto del picklist y la asignación dentro de sus llaves.",
          en: "Each value needs its when with the exact picklist text and the assignment inside its braces.",
        },
      },
      {
        id: "m02-l02-c4",
        label: {
          es: "Low da 72, y un caso sin prioridad también",
          en: "Low gives 72, and so does a case with no priority",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "when\\s+'Low'\\s*\\{\\s*slaHours\\s*=\\s*72\\s*;" },
            {
              op: "any",
              of: [
                { op: "match", pattern: "support\\.Priority\\s*\\?\\?\\s*'Low'" },
                { op: "match", pattern: "when\\s+null\\s*\\{\\s*slaHours\\s*=\\s*72\\s*;" },
              ],
            },
          ],
        },
        onFail: {
          es: "Low necesita su when con 72. Y el vacío tiene que acabar igual: o con switch on (support.Priority ?? 'Low'), o con una rama when null que también dé 72. Sin eso, un caso sin prioridad caería en when else y recibiría 48.",
          en: "Low needs its when with 72. And the empty value has to end up the same: either with switch on (support.Priority ?? 'Low'), or with a when null branch that also gives 72. Without it, a case with no priority would fall into when else and get 48.",
        },
        onPass: {
          es: "Si usaste ??, el vacío y Low comparten una sola asignación: no hay dos copias del 72 que puedan desincronizarse.",
          en: "If you used ??, empty and Low share a single assignment: there are no two copies of 72 that could drift apart.",
        },
      },
      {
        id: "m02-l02-c5",
        label: {
          es: "when else da 48",
          en: "when else gives 48",
        },
        rule: { op: "match", pattern: "when\\s+else\\s*\\{\\s*slaHours\\s*=\\s*48\\s*;" },
        onFail: {
          es: "Los valores futuros del picklist no tienen rama propia: los recoge when else, que va la última.",
          en: "Future picklist values have no branch of their own: when else catches them, and it goes last.",
        },
      },
      {
        id: "m02-l02-c6",
        label: {
          es: "Sin cadenas de if",
          en: "No if chains",
        },
        rule: { op: "absent", pattern: "\\bif\\s*\\(" },
        onFail: {
          es: "Funciona, pero el objetivo era practicar switch: cada valor exacto de un picklist es un when.",
          en: "It works, but the goal was to practise switch: each exact picklist value is a when.",
        },
        optional: true,
      },
    ],
    rubric: [
      {
        es: "Si mañana Soporte añade la prioridad 'Critical', ¿cuántas líneas tendrías que tocar?",
        en: "If Support adds a 'Critical' priority tomorrow, how many lines would you have to touch?",
      },
      {
        es: "Tarea 3: la renovación de Northwind llega a negociación y hay que decidir quién la aprueba. Un compañero lo empezó con if… y no compila.",
        en: "Task 3: Northwind's renewal reaches negotiation and someone must decide who approves it. A colleague started it with ifs… and it does not compile.",
      },
    ],
  },
};
