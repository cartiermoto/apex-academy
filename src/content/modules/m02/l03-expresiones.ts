import type { Lesson } from "@/lib/types";

export const l03Expresiones: Lesson = {
  id: "m02-l03",
  slug: "expresiones-y-sentencias",
  n: 3,
  kind: "lesson",
  minutes: 18,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 2", en: "Remember? · Review of lesson 2" },
    prompt: { es: "En un switch, ¿qué rama recoge los valores del picklist que no tienen su propio when?", en: "In a switch, which branch catches the picklist values that have no when of their own?" },
    options: [
      { es: "when else", en: "when else" },
      { es: "when null", en: "when null" },
      { es: "default", en: "default" },
    ],
    answer: 0,
    explain: { es: "when else, tu salida por defecto del Decision. En Apex no existe default como en otros lenguajes.", en: "when else, your Decision's default outcome. Apex has no default as other languages do." },
  },
  title: { es: "Expresiones vs Sentencias", en: "Expressions vs Statements" },
  summary: {
    es: "Una expresión calcula un valor, como un campo fórmula. Una sentencia hace algo, como un elemento de Flow. Y cada variable vive solo dentro de sus llaves.",
    en: "An expression computes a value, like a formula field. A statement does something, like a Flow element. And every variable lives only inside its braces.",
  },
  analogy: {
    es: "Campo fórmula (calcula) frente a elemento de Flow (actúa)",
    en: "Formula field (computes) versus Flow element (acts)",
  },
  objectives: [
    {
      es: "Distinguir una expresión de una sentencia y saber dónde puede ir cada una.",
      en: "Tell an expression from a statement and know where each one can go.",
    },
    {
      es: "Elegir entre el operador condicional y un if según haya que elegir un valor o una acción.",
      en: "Choose between the conditional operator and an if depending on whether you are picking a value or an action.",
    },
    {
      es: "Declarar cada variable en el ámbito correcto para poder usarla donde la necesitas.",
      en: "Declare each variable in the right scope so you can use it where you need it.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Ahora que tu código tiene ramas, aparecen dos preguntas que antes no importaban: ¿esto que escribo da un valor o hace algo? y ¿hasta dónde llega esta variable? Las dos tienen respuesta sencilla, y las dos explican la mayoría de errores de compilación de este módulo.",
        en: "Now that your code has branches, two questions appear that did not matter before: does what I am writing produce a value or do something? And how far does this variable reach? Both have simple answers, and both explain most compile errors in this module.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Así lo separé yo en la cabeza: un campo fórmula nunca hace nada, solo calcula y devuelve un valor. Un elemento de Flow —Assignment, Update Records— no devuelve nada que puedas pegar en otra fórmula: actúa. En Apex, lo primero se llama expresión y lo segundo sentencia.",
        en: "This is how I split it in my head: a formula field never does anything, it only calculates and returns a value. A Flow element — Assignment, Update Records — returns nothing you could paste into another formula: it acts. In Apex, the first is called an expression and the second a statement.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "Expresión: algo que vale algo", en: "Expression: something that has a value" },
    },
    {
      type: "p",
      text: {
        es: "Una expresión es cualquier trozo de código que, al evaluarse, da un valor: amount * 1.21, stage == 'Closed Won', name.trim(), isVip && amount > 1000. Puedes ponerla a la derecha de un =, dentro de un paréntesis de if, o como argumento de un método.",
        en: "An expression is any piece of code that, when evaluated, gives a value: amount * 1.21, stage == 'Closed Won', name.trim(), isVip && amount > 1000. You can put it on the right of an =, inside an if's brackets, or as a method argument.",
      },
    },
    {
      type: "h",
      text: { es: "Sentencia: una orden completa", en: "Statement: a complete instruction" },
    },
    {
      type: "p",
      text: {
        es: "Una sentencia es una instrucción completa: declarar, asignar, llamar a System.debug, un if entero. Las sentencias simples terminan en punto y coma; las que llevan un bloque, como if o switch, terminan en su llave de cierre. Casi todas las sentencias llevan expresiones dentro.",
        en: "A statement is a complete instruction: declaring, assigning, calling System.debug, an entire if. Simple statements end in a semicolon; the ones that carry a block, like if or switch, end at their closing brace. Almost every statement carries expressions inside.",
      },
    },
    {
      type: "code",
      code: {
        es: `Decimal total = amount * 1.21;   // sentencia (con la expresión amount * 1.21 dentro)
System.debug(total);             // sentencia
amount > 1000                    // expresión sola: no compila como línea suelta`,
        en: `Decimal total = amount * 1.21;   // statement (with the expression amount * 1.21 inside)
System.debug(total);             // statement
amount > 1000                    // a bare expression: does not compile as a line on its own`,
      },
      caption: {
        es: "Una expresión suelta no es una orden: Apex no sabe qué hacer con el valor.",
        en: "A bare expression is not an instruction: Apex does not know what to do with the value.",
      },
    },
    {
      type: "h",
      text: { es: "Elegir un valor o elegir una acción", en: "Picking a value or picking an action" },
    },
    {
      type: "p",
      text: {
        es: "Aquí la diferencia se vuelve práctica. El operador condicional que viste en Operadores — condición ? a : b — es una expresión: elige un valor. if es una sentencia: elige qué hacer. Si lo único que cambia entre las dos ramas es el valor que asignas, el operador condicional lo dice en una línea. Si cambian las acciones, usa if.",
        en: "Here the difference becomes practical. The conditional operator you saw in Operators — condition ? a : b — is an expression: it picks a value. if is a statement: it picks what to do. If the only thing that changes between the two branches is the value you assign, the conditional operator says it in one line. If the actions change, use if.",
      },
    },
    {
      type: "code",
      code: {
        es: `// Solo cambia el valor → expresión
String approver = amount >= 50000 ? 'Director' : 'Jefe de equipo';

// Cambian las acciones → sentencia
if (amount >= 50000) {
    System.debug('Pedir aprobación');
    requiresLegal = true;
} else {
    System.debug('Aprobación automática');
}`,
        en: `// Only the value changes → expression
String approver = amount >= 50000 ? 'Director' : 'Team lead';

// The actions change → statement
if (amount >= 50000) {
    System.debug('Request approval');
    requiresLegal = true;
} else {
    System.debug('Auto-approved');
}`,
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Un Boolean ya es una respuesta", en: "A Boolean is already an answer" },
      text: {
        es: "Si escribes if (amount > 1000) { isBig = true; } else { isBig = false; }, estás traduciendo una expresión a una sentencia para volver a obtener la misma expresión. Boolean isBig = amount > 1000; dice lo mismo.",
        en: "If you write if (amount > 1000) { isBig = true; } else { isBig = false; }, you are translating an expression into a statement only to get the same expression back. Boolean isBig = amount > 1000; says the same thing.",
      },
    },
    {
      type: "h",
      text: { es: "Ámbito: cada variable vive dentro de sus llaves", en: "Scope: every variable lives inside its braces" },
    },
    {
      type: "p",
      text: {
        es: "Una variable existe desde la línea en que se declara hasta la llave que cierra el [[bloque]] donde se declaró. Esa zona es su [[ambito|ámbito]]. Declarada dentro de un if, desaparece al cerrarse el if, y usarla después es un error de compilación. La solución es declararla antes, fuera, y solo asignarla dentro.",
        en: "A variable exists from the line where it is declared until the brace that closes the [[bloque|block]] it was declared in. That zone is its [[ambito|scope]]. Declared inside an if, it disappears when the if closes, and using it afterwards is a compile error. The fix is to declare it earlier, outside, and only assign it inside.",
      },
    },
    {
      type: "diagram",
      id: "m02-scope",
      caption: {
        es: "Desde dentro se ve lo de fuera; desde fuera no se ve lo de dentro.",
        en: "From inside you can see what is outside; from outside you cannot see what is inside.",
      },
    },
    {
      type: "code",
      code: {
        es: `// ❌ approver solo existe dentro de cada rama
if (amount >= 50000) {
    String approver = 'Director';
} else {
    String approver = 'Jefe de equipo';
}
System.debug(approver);   // no compila: aquí approver no existe

// ✅ se declara fuera y se asigna dentro
String approver;
if (amount >= 50000) {
    approver = 'Director';
} else {
    approver = 'Jefe de equipo';
}
System.debug(approver);`,
        en: `// ❌ approver only exists inside each branch
if (amount >= 50000) {
    String approver = 'Director';
} else {
    String approver = 'Team lead';
}
System.debug(approver);   // does not compile: approver does not exist here

// ✅ declared outside, assigned inside
String approver;
if (amount >= 50000) {
    approver = 'Director';
} else {
    approver = 'Team lead';
}
System.debug(approver);`,
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Un nombre, una variable", en: "One name, one variable" },
      text: {
        es: "Dentro de un bloque no puedes declarar otra variable con el mismo nombre que una de fuera: Apex lo rechaza como variable duplicada. Si querías cambiar su valor, asigna sin repetir el tipo.",
        en: "Inside a block you cannot declare another variable with the same name as one outside: Apex rejects it as a duplicate variable. If you meant to change its value, assign without repeating the type.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: una variable declarada dentro del bloque de un else, ¿se puede leer en la línea siguiente al else? ¿Qué cambiarías para que sí?",
        en: "Without looking up: can a variable declared inside an else block be read on the line after the else? What would you change so it can?",
      },
    },
  ],

  quiz: [
    {
      id: "m02-l03-q1",
      kind: "multi",
      prompt: { es: "¿Cuáles de estos fragmentos son expresiones?", en: "Which of these fragments are expressions?" },
      options: [
        { es: "amount * 2", en: "amount * 2" },
        { es: "isActive && isVip", en: "isActive && isVip" },
        { es: "Integer count = 5;", en: "Integer count = 5;" },
        { es: "accountName.toUpperCase()", en: "accountName.toUpperCase()" },
      ],
      answers: [0, 1, 3],
      explain: {
        es: "Las tres dan un valor. Integer count = 5; es una sentencia: declara y asigna, pero no vale nada por sí misma.",
        en: "Those three produce a value. Integer count = 5; is a statement: it declares and assigns, but has no value of its own.",
      },
    },
    {
      id: "m02-l03-q2",
      kind: "single",
      prompt: { es: "¿Qué le pasa a este código?", en: "What is wrong with this code?" },
      code: {
        es: `Decimal amount = 80000;
if (amount > 50000) {
    Boolean needsApproval = true;
}
System.debug(needsApproval);`,
        en: `Decimal amount = 80000;
if (amount > 50000) {
    Boolean needsApproval = true;
}
System.debug(needsApproval);`,
      },
      options: [
        {
          es: "No compila: needsApproval solo existe dentro del if.",
          en: "It does not compile: needsApproval only exists inside the if.",
        },
        { es: "Muestra true.", en: "It prints true." },
        { es: "Muestra null.", en: "It prints null." },
        { es: "Muestra false.", en: "It prints false." },
      ],
      answer: 0,
      explain: {
        es: "La variable nace y muere dentro de las llaves del if. Para leerla después hay que declararla antes del if.",
        en: "The variable is born and dies inside the if's braces. To read it afterwards it has to be declared before the if.",
      },
      tags: ["find-error"],
    },
    {
      id: "m02-l03-q3",
      kind: "single",
      prompt: { es: "¿Qué valor tiene size?", en: "What value does size hold?" },
      code: {
        es: `Decimal amount = 500;
String size = amount > 1000 ? 'Grande' : 'Pequeña';`,
        en: `Decimal amount = 500;
String size = amount > 1000 ? 'Large' : 'Small';`,
      },
      options: [
        { es: "Pequeña / Small", en: "Small" },
        { es: "Grande / Large", en: "Large" },
        { es: "true", en: "true" },
        { es: "No compila", en: "It does not compile" },
      ],
      answer: 0,
      explain: {
        es: "500 > 1000 es false, así que el operador condicional devuelve el valor de detrás de los dos puntos.",
        en: "500 > 1000 is false, so the conditional operator returns the value after the colon.",
      },
      tags: ["spaced", "predict-output"],
      from: { es: "Repaso · M1 L7", en: "Review · M1 L7" },
    },
    {
      id: "m02-l03-q4",
      kind: "text",
      prompt: {
        es: "¿Qué carácter cierra una sentencia simple en Apex?",
        en: "Which character ends a simple statement in Apex?",
      },
      accept: [";", "punto y coma", "semicolon"],
      placeholder: { es: "un carácter", en: "one character" },
      explain: {
        es: "El punto y coma. Las sentencias con bloque, como if o switch, terminan en su llave de cierre.",
        en: "The semicolon. Statements with a block, like if or switch, end at their closing brace.",
      },
      tags: ["recall"],
    },
    {
      id: "m02-l03-q5",
      kind: "single",
      prompt: {
        es: "Hay que guardar 'Renovación' o 'Nuevo negocio' en dealType según si la cuenta ya es cliente. ¿Qué es lo más claro?",
        en: "You need to store 'Renewal' or 'New business' in dealType depending on whether the account is already a customer. What is clearest?",
      },
      options: [
        {
          es: "String dealType = isCustomer ? 'Renovación' : 'Nuevo negocio';",
          en: "String dealType = isCustomer ? 'Renewal' : 'New business';",
        },
        {
          es: "Un if/else que declare String dealType dentro de cada rama.",
          en: "An if/else that declares String dealType inside each branch.",
        },
        {
          es: "Un switch sobre isCustomer.",
          en: "A switch on isCustomer.",
        },
      ],
      answer: 0,
      explain: {
        es: "Solo cambia el valor, así que basta una expresión. Declarar dealType dentro de cada rama del if/else ni siquiera dejaría usarla después —muere al cerrar la llave—, y switch no acepta Boolean.",
        en: "Only the value changes, so an expression is enough. Declaring dealType inside each branch of an if/else would not even let you use it afterwards — it dies at the closing brace — and switch does not accept Boolean.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m02-l03-q6",
      kind: "single",
      prompt: { es: "¿Qué ocurre con este código?", en: "What happens with this code?" },
      code: {
        es: `Integer count = 0;
if (count == 0) {
    Integer count = 5;
}`,
        en: `Integer count = 0;
if (count == 0) {
    Integer count = 5;
}`,
      },
      options: [
        {
          es: "No compila: count ya está declarada fuera del bloque.",
          en: "It does not compile: count is already declared outside the block.",
        },
        {
          es: "Compila, y count vale 5 al terminar.",
          en: "It compiles, and count is 5 at the end.",
        },
        {
          es: "Compila, y count vale 0 al terminar.",
          en: "It compiles, and count is 0 at the end.",
        },
      ],
      answer: 0,
      explain: {
        es: "Dentro del bloque se sigue viendo la count de fuera, así que declarar otra con el mismo nombre es una variable duplicada. Para cambiarla bastaba count = 5;",
        en: "Inside the block the outer count is still visible, so declaring another with the same name is a duplicate variable. To change it, count = 5; was enough.",
      },
      tags: ["find-error", "spaced"],
      from: { es: "Repaso · M1 L1", en: "Review · M1 L1" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 3 DE 8 · La renovación de Northwind está en negociación: hay que decidir quién la aprueba y si pasa por Legal. Un compañero empezó esta parte y la dejó a medias. Un compañero dejó este código a medias y no compila. Arréglalo y, de paso, déjalo más limpio: la aprobación y el aviso a Legal no necesitan ningún if, porque en los dos casos lo único que se decide es un valor.",
      en: "TASK 3 OF 8 · Northwind's renewal is in negotiation: someone must decide who approves it and whether it goes through Legal. A colleague started this part and left it half done. A colleague left this code half-done and it does not compile. Fix it and, while you are at it, make it cleaner: the approval and the Legal flag do not need any if, because in both cases the only thing being decided is a value.",
    },
    brief: [
      {
        es: "approver debe valer 'Director' si el importe es de 50.000 o más, y el otro valor en caso contrario. Decláralo una sola vez y en una sola línea.",
        en: "approver must be 'Director' if the amount is 50,000 or more, and the other value otherwise. Declare it once, on one line.",
      },
      {
        es: "needsLegal debe ser un Boolean que valga true cuando el importe sea de 75.000 o más y además la etapa sea 'Negotiation'.",
        en: "needsLegal must be a Boolean that is true when the amount is 75,000 or more and the stage is also 'Negotiation'.",
      },
      {
        es: "Sin un solo if: las dos cosas son expresiones.",
        en: "Not a single if: both are expressions.",
      },
      {
        es: "La línea de System.debug del final tiene que poder leer las dos variables.",
        en: "The System.debug line at the end must be able to read both variables.",
      },
    ],
    starter: {
      es: `// CASO: las reglas de negocio de la cuenta clave · Northwind Trading
// Tarea 3 de 8: quién aprueba la renovación y si pasa por Legal.

Opportunity opp = new Opportunity(Name = 'Renovación Acme', Amount = 80000, StageName = 'Negotiation');

if (opp.Amount >= 50000) {
    String approver = 'Director';
} else {
    String approver = 'Jefe de equipo';
}

System.debug(approver + ' · Legal: ' + needsLegal);
`,
      en: `// CASE: the key account's business rules · Northwind Trading
// Task 3 of 8: who approves the renewal and whether it goes through Legal.

Opportunity opp = new Opportunity(Name = 'Acme Renewal', Amount = 80000, StageName = 'Negotiation');

if (opp.Amount >= 50000) {
    String approver = 'Director';
} else {
    String approver = 'Team lead';
}

System.debug(approver + ' · Legal: ' + needsLegal);
`,
    },
    hints: [
      {
        es: "Yo empezaría por el error de compilación, que es de ámbito: approver se declara dentro de las ramas y se usa fuera, como si una variable solo existiera dentro de una salida del Decision. Y needsLegal ni siquiera existe todavía.",
        en: "I would start with the compile error, which is about scope: approver is declared inside the branches and used outside, as if a variable only existed inside one outcome of the Decision. And needsLegal does not even exist yet.",
      },
      {
        es: "Lo que me ordenó la cabeza: para elegir un valor entre dos está el operador condicional, tu IF() de fórmulas: condición ? valorSi : valorNo. Para un sí/no, la propia comparación ya es un Boolean, como un campo fórmula de tipo Checkbox, y && une las dos condiciones.",
        en: "What put my head in order: to choose one value out of two there is the conditional operator, your formula IF(): condition ? valueIfTrue : valueIfFalse. For a yes/no, the comparison itself is already a Boolean, like a Checkbox formula field, and && joins the two conditions.",
      },
      {
        es: "Te dejo el esquema: String approver = importe ≥ 50000 ? 'Director' : '…'; Boolean needsLegal = importe ≥ 75000 && etapa == 'Negotiation';",
        en: "Here is the outline: String approver = amount ≥ 50000 ? 'Director' : '…'; Boolean needsLegal = amount ≥ 75000 && stage == 'Negotiation';",
      },
    ],
    solution: {
      es: `Opportunity opp = new Opportunity(Name = 'Renovación Acme', Amount = 80000, StageName = 'Negotiation');

String approver = opp.Amount >= 50000 ? 'Director' : 'Jefe de equipo';
Boolean needsLegal = opp.Amount >= 75000 && opp.StageName == 'Negotiation';

System.debug(approver + ' · Legal: ' + needsLegal);`,
      en: `Opportunity opp = new Opportunity(Name = 'Acme Renewal', Amount = 80000, StageName = 'Negotiation');

String approver = opp.Amount >= 50000 ? 'Director' : 'Team lead';
Boolean needsLegal = opp.Amount >= 75000 && opp.StageName == 'Negotiation';

System.debug(approver + ' · Legal: ' + needsLegal);`,
    },
    checks: [
      {
        id: "m02-l03-c1",
        label: {
          es: "approver se declara una sola vez",
          en: "approver is declared exactly once",
        },
        rule: { op: "count", pattern: "String\\s+approver\\b", min: 1, max: 1 },
        onFail: {
          es: "Si declaras approver dentro de cada rama, hay dos variables que mueren al cerrar sus llaves. Tiene que haber una sola declaración, fuera de cualquier bloque.",
          en: "If you declare approver inside each branch, there are two variables that die when their braces close. There must be a single declaration, outside any block.",
        },
        otter: {
          es: "approver tiene que declararse una sola vez, fuera de cualquier bloque. Si la declaras dentro de cada rama, son dos variables distintas que desaparecen al cerrar sus llaves, y la última línea no las ve.",
          en: "approver has to be declared once, outside any block. Declare it inside each branch and they are two different variables that disappear when their braces close, and the last line cannot see them.",
        },
      },
      {
        id: "m02-l03-c2",
        label: {
          es: "approver se elige con el operador condicional",
          en: "approver is picked with the conditional operator",
        },
        rule: {
          op: "match",
          pattern: "String\\s+approver\\s*=\\s*[^;]*>=\\s*50000[^;]*\\?\\s*'Director'\\s*:[^;]+;",
        },
        onFail: {
          es: "Lo que cambia es solo el valor: String approver = opp.Amount >= 50000 ? 'Director' : '…';",
          en: "Only the value changes: String approver = opp.Amount >= 50000 ? 'Director' : '…';",
        },
        otter: {
          es: "Lo que cambia es solo el valor, así que es un campo fórmula, no un Flow: String approver = opp.Amount >= 50000 ? 'Director' : '…';",
          en: "Only the value changes, so it is a formula field, not a Flow: String approver = opp.Amount >= 50000 ? 'Director' : '…';",
        },
      },
      {
        id: "m02-l03-c3",
        label: {
          es: "needsLegal es un Boolean que combina importe y etapa",
          en: "needsLegal is a Boolean combining amount and stage",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Boolean\\s+needsLegal\\s*=[^;]*;" },
            { op: "match", pattern: "needsLegal\\s*=[^;]*>=\\s*75000[^;]*&&[^;]*;" },
            { op: "match", pattern: "needsLegal\\s*=[^;]*StageName\\s*==\\s*'Negotiation'[^;]*;" },
          ],
        },
        onFail: {
          es: "La comparación ya es un Boolean: Boolean needsLegal = opp.Amount >= 75000 && opp.StageName == 'Negotiation';",
          en: "The comparison is already a Boolean: Boolean needsLegal = opp.Amount >= 75000 && opp.StageName == 'Negotiation';",
        },
        otter: {
          es: "needsLegal es como un campo fórmula de tipo Checkbox: la comparación ya da verdadero o falso. Boolean needsLegal = opp.Amount >= 75000 && opp.StageName == 'Negotiation';",
          en: "needsLegal is like a Checkbox formula field: the comparison already gives true or false. Boolean needsLegal = opp.Amount >= 75000 && opp.StageName == 'Negotiation';",
        },
        onPass: {
          es: "Una línea que se lee como la regla de negocio. Eso es lo que hace fácil revisarla dentro de un año.",
          en: "One line that reads like the business rule. That is what makes it easy to review a year from now.",
        },
      },
      {
        id: "m02-l03-c4",
        label: { es: "Sin ningún if", en: "No if at all" },
        rule: { op: "absent", pattern: "\\bif\\s*\\(" },
        onFail: {
          es: "Las dos decisiones eligen un valor, no una acción: se resuelven con expresiones y el if sobra.",
          en: "Both decisions pick a value, not an action: they are solved with expressions and the if is not needed.",
        },
        otter: {
          es: "Las dos decisiones eligen un valor, no una acción: son fórmulas, no un Flow. Se resuelven con expresiones y el if sobra.",
          en: "Both decisions choose a value, not an action: they are formulas, not a Flow. They are solved with expressions and the if is not needed.",
        },
      },
      {
        id: "m02-l03-c5",
        label: {
          es: "El System.debug final sigue ahí",
          en: "The final System.debug is still there",
        },
        rule: { op: "match", pattern: "System\\.debug\\([^;]*approver[^;]*needsLegal[^;]*\\)\\s*;" },
        onFail: {
          es: "No borres la última línea: es la prueba de que las dos variables están en el ámbito correcto.",
          en: "Do not delete the last line: it is the proof that both variables are in the right scope.",
        },
        otter: {
          es: "No borres el System.debug final: es tu prueba, como mirar el valor del campo después de guardar, de que las dos variables están en el ámbito correcto.",
          en: "Do not delete the final System.debug: it is your proof, like checking the field value after saving, that both variables are in the right scope.",
        },
      },
    ],
    rubric: [
      {
        es: "Lee cada línea en voz alta. ¿Suena como la regla que te dio el negocio?",
        en: "Read each line aloud. Does it sound like the rule the business gave you?",
      },
    ],
    outro: {
      es: "Ya distingues lo que calcula un valor de lo que ejecuta una acción, y eliges el operador condicional cuando solo cambia el valor. En la tarea 4, Dirección levanta la vista hacia el objetivo del año: ¿cuántos meses faltan?",
      en: "You can now tell what calculates a value from what performs an action, and you pick the conditional operator when only the value changes. In task 4, Management looks up at the year's target: how many months to go?",
    },
    voice: "otter",
  },
};
