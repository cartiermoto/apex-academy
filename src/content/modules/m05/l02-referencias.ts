import type { Lesson } from "@/lib/types";

export const l02Referencias: Lesson = {
  id: "m05-l02",
  slug: "referencias",
  n: 2,
  kind: "lesson",
  minutes: 20,
  title: {
    es: "Referencias: dos variables, un solo objeto",
    en: "References: two variables, one object",
  },
  summary: {
    es: "Una variable de tipo objeto no guarda el objeto: guarda el enlace a él. Copiar la variable copia el enlace, no el registro.",
    en: "An object-typed variable does not hold the object: it holds the link to it. Copying the variable copies the link, not the record.",
  },
  analogy: {
    es: "Dos pestañas abiertas del mismo registro",
    en: "Two open tabs of the same record",
  },
  objectives: [
    {
      es: "Predecir qué pasa al asignar una variable de objeto a otra y modificar una de las dos.",
      en: "Predict what happens when you assign one object variable to another and change one of them.",
    },
    {
      es: "Hacer una copia independiente con clone() cuando la necesitas.",
      en: "Make an independent copy with clone() when you need one.",
    },
    {
      es: "Aprovechar las referencias para modificar registros desde un bucle o un método.",
      en: "Use references to change records from a loop or a method.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Con los números y los textos, copiar una variable copia el valor: cambiar la copia no toca el original. Con los objetos no ocurre así, y esa diferencia explica tanto uno de los errores más desconcertantes de Apex como uno de sus trucos más útiles.",
        en: "With numbers and text, copying a variable copies the value: changing the copy does not touch the original. With objects it does not work that way, and that difference explains both one of Apex's most baffling bugs and one of its most useful tricks.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Abres la misma oportunidad en dos pestañas. Cambias la etapa en una, guardas, refrescas la otra: también ha cambiado. No hay dos oportunidades, hay dos ventanas al mismo registro. Una variable de objeto es una de esas pestañas: una [[referencia]] al objeto, no el objeto.",
        en: "You open the same opportunity in two tabs. You change the stage in one, save, refresh the other: it has changed too. There are not two opportunities, there are two windows onto the same record. An object variable is one of those tabs: a [[referencia|reference]] to the object, not the object.",
      },
    },
    {
      type: "h",
      text: { es: "Valores frente a referencias", en: "Values versus references" },
    },
    {
      type: "code",
      code: {
        es: `// Valores: cada variable tiene su propia copia
Integer a = 5;
Integer b = a;
b = 10;
System.debug(a);            // 5

// Referencias: las dos variables apuntan al mismo objeto
Opportunity opp1 = new Opportunity(Name = 'Acme', StageName = 'Prospecting');
Opportunity opp2 = opp1;
opp2.StageName = 'Closed Won';
System.debug(opp1.StageName);   // Closed Won`,
        en: `// Values: each variable has its own copy
Integer a = 5;
Integer b = a;
b = 10;
System.debug(a);            // 5

// References: both variables point to the same object
Opportunity opp1 = new Opportunity(Name = 'Acme', StageName = 'Prospecting');
Opportunity opp2 = opp1;
opp2.StageName = 'Closed Won';
System.debug(opp1.StageName);   // Closed Won`,
      },
      caption: {
        es: "opp2 = opp1 no fabrica otra oportunidad: copia el enlace. Solo hay un new, así que solo hay un objeto.",
        en: "opp2 = opp1 does not produce another opportunity: it copies the link. There is only one new, so there is only one object.",
      },
    },
    {
      type: "diagram",
      id: "m05-references",
      caption: {
        es: "Cuenta los new: ese es el número de objetos. Las variables son solo flechas hacia ellos.",
        en: "Count the news: that is the number of objects. The variables are just arrows pointing at them.",
      },
    },
    {
      type: "p",
      text: {
        es: "Integer, Decimal, Boolean, Date y String se comportan como valores: puedes copiarlos sin miedo. Los sObjects, las colecciones y las instancias de tus clases se comportan como referencias. Regla práctica: si se creó con new, piensa en enlaces.",
        en: "Integer, Decimal, Boolean, Date and String behave as values: you can copy them without fear. sObjects, collections and instances of your classes behave as references. Rule of thumb: if it was made with new, think in links.",
      },
    },
    {
      type: "h",
      text: { es: "El lado útil: cambiar registros desde un bucle", en: "The useful side: changing records from a loop" },
    },
    {
      type: "p",
      text: {
        es: "Por esto funciona algo que hiciste en el Módulo 2 sin pensarlo: en for (Lead l : leads), l no es una copia, es una referencia al registro de la lista. Si cambias l.Rating, cambia el lead que está dentro de leads. Lo mismo ocurre cuando pasas un objeto a un método: el método recibe el enlace y puede modificar el objeto original. Así trabajarán tus triggers en el Módulo 6.",
        en: "This is why something you did in Module 2 without thinking works: in for (Lead l : leads), l is not a copy, it is a reference to the record in the list. If you change l.Rating, the lead inside leads changes. The same happens when you pass an object to a method: the method gets the link and can change the original object. That is how your triggers will work in Module 6.",
      },
    },
    {
      type: "code",
      code: {
        es: `for (Lead l : leads) {
    l.Rating = 'Hot';        // cambia el lead que está en la lista
}
System.debug(leads[0].Rating);   // Hot`,
        en: `for (Lead l : leads) {
    l.Rating = 'Hot';        // changes the lead that is in the list
}
System.debug(leads[0].Rating);   // Hot`,
      },
    },
    {
      type: "h",
      text: { es: "Cuando necesitas una copia de verdad: clone()", en: "When you need a real copy: clone()" },
    },
    {
      type: "p",
      text: {
        es: "Si lo que quieres es un segundo registro independiente —una renovación que parte de la oportunidad de este año—, pide una copia: original.clone() fabrica un objeto nuevo con los mismos valores. A partir de ahí, cambiar uno no toca el otro. Las listas también tienen clone().",
        en: "If what you want is a second, independent record — a renewal starting from this year's opportunity — ask for a copy: original.clone() produces a new object with the same values. From then on, changing one does not touch the other. Lists have clone() too.",
      },
    },
    {
      type: "code",
      code: {
        es: `Opportunity renewal = original.clone();   // otro objeto, mismos valores
renewal.StageName = 'Prospecting';
System.debug(original.StageName);           // sigue igual`,
        en: `Opportunity renewal = original.clone();   // another object, same values
renewal.StageName = 'Prospecting';
System.debug(original.StageName);           // unchanged`,
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "¿El mismo objeto o dos iguales?", en: "The same object, or two equal ones?" },
      text: {
        es: "Para dos sObjects, == compara los valores de sus campos: una copia hecha con clone() es == al original. Si lo que quieres saber es si dos variables apuntan al mismo objeto, Apex tiene ===. opp1 === opp2 es true solo si son la misma pestaña del mismo registro.",
        en: "For two sObjects, == compares their field values: a copy made with clone() is == to the original. If what you want to know is whether two variables point to the same object, Apex has ===. opp1 === opp2 is true only if they are the same tab of the same record.",
      },
    },
    {
      type: "h",
      text: { es: "Un objeto en dos colecciones a la vez", en: "One object in two collections at once" },
    },
    {
      type: "p",
      text: {
        es: "Las referencias no solo aparecen al copiar variables: aparecen cada vez que guardas el mismo objeto en dos colecciones. Es muy habitual en triggers: tienes la lista de cuentas y construyes un Map por Id para buscarlas rápido. Lista y Map no tienen copias distintas, tienen flechas hacia las MISMAS cuentas. Cambia una a través del Map y el cambio se ve también desde la lista.",
        en: "References do not only appear when copying variables: they appear every time you keep the same object in two collections. It is very common in triggers: you have the list of accounts and build a Map by Id to find them fast. The List and the Map do not hold different copies, they hold arrows to the SAME accounts. Change one through the Map and the change is visible from the list too.",
      },
    },
    {
      type: "code",
      code: {
        es: `List<Account> accounts = [SELECT Id, Name, Rating FROM Account LIMIT 10];
Map<Id, Account> byId = new Map<Id, Account>(accounts);

Account acme = byId.get(accounts[0].Id);
acme.Rating = 'Hot';

System.debug(accounts[0].Rating); // Hot: es el mismo objeto`,
        en: `List<Account> accounts = [SELECT Id, Name, Rating FROM Account LIMIT 10];
Map<Id, Account> byId = new Map<Id, Account>(accounts);

Account acme = byId.get(accounts[0].Id);
acme.Rating = 'Hot';

System.debug(accounts[0].Rating); // Hot: it is the same object`,
      },
      caption: {
        es: "Por eso, en el Módulo 7, el servicio podía cambiar la prioridad de los casos que recibía y el cambio llegaba a Trigger.new.",
        en: "That is why, in Module 7, the service could change the priority of the cases it received and the change reached Trigger.new.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El mismo contacto en dos related lists", en: "The same contact in two related lists" },
      text: {
        es: "Un contacto aparece en la related list de su cuenta y también en la de una campaña de la que es miembro. Si le cambias el teléfono desde la campaña, en la cuenta también sale cambiado: no hay dos contactos, hay uno visto desde dos sitios. Eso es exactamente una referencia. Lo que en Apex sería una copia de verdad —clone()— en la interfaz sería el botón «Clonar»: un registro nuevo que a partir de ahí va por su cuenta.",
        en: "A contact shows up in its account's related list and also in the list of a campaign it belongs to. Change its phone from the campaign and it shows changed on the account too: there are not two contacts, there is one seen from two places. That is exactly a reference. What in Apex would be a real copy — clone() — is the “Clone” button in the UI: a new record that goes its own way from then on.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "El ejemplo del libro —miPunto p3 = p2; y cualquier cambio a través de p2 se ve en p3— funciona exactamente igual en Apex. Lo que cambia es la limpieza: el libro habla del recolector de basura y de finalize(). En Apex no existen destructores ni finalize(); la memoria se libera sola al terminar la transacción. Tu preocupación no es liberarla, sino no pasarte del límite de memoria por transacción, el [[heap]].",
        en: "The book's example — miPunto p3 = p2; and any change through p2 shows in p3 — works exactly the same in Apex. What differs is the clean-up: the book talks about the garbage collector and finalize(). Apex has no destructors and no finalize(); memory is freed on its own when the transaction ends. Your concern is not freeing it, but staying under the per-transaction memory limit, the [[heap]].",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: en un bloque de código con dos new y cinco variables de objeto, ¿cuántos objetos hay? ¿Qué método usas si quieres un tercero independiente?",
        en: "Without looking up: in a block of code with two news and five object variables, how many objects are there? Which method do you use if you want a third, independent one?",
      },
    },
  ],

  quiz: [
    {
      id: "m05-l02-q1",
      kind: "single",
      prompt: { es: "¿Qué muestra este código?", en: "What does this code print?" },
      code: {
        es: `Account a = new Account(Name = 'Acme');
Account b = a;
b.Name = 'Globex';
System.debug(a.Name);`,
        en: `Account a = new Account(Name = 'Acme');
Account b = a;
b.Name = 'Globex';
System.debug(a.Name);`,
      },
      options: [
        { es: "Globex", en: "Globex" },
        { es: "Acme", en: "Acme" },
        { es: "null", en: "null" },
        { es: "No compila", en: "It does not compile" },
      ],
      answer: 0,
      explain: {
        es: "Un solo new, un solo objeto. a y b son dos flechas al mismo registro: cambiarlo por b se ve por a.",
        en: "One new, one object. a and b are two arrows at the same record: changing it through b shows through a.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m05-l02-q2",
      kind: "single",
      prompt: { es: "¿Y este?", en: "And this one?" },
      code: {
        es: `String city = 'Madrid';
String other = city;
other = 'Lisboa';
System.debug(city);`,
        en: `String city = 'Madrid';
String other = city;
other = 'Lisbon';
System.debug(city);`,
      },
      options: [
        { es: "Madrid", en: "Madrid" },
        { es: "Lisboa / Lisbon", en: "Lisbon" },
        { es: "null", en: "null" },
      ],
      answer: 0,
      explain: {
        es: "String se comporta como un valor: other = 'Lisboa' cambia other, no city. Recuerda además que un String es inmutable: nunca se modifica, se sustituye.",
        en: "String behaves as a value: other = 'Lisbon' changes other, not city. Remember too that a String is immutable: it is never modified, only replaced.",
      },
      tags: ["predict-output", "spaced", "interleaving"],
      from: { es: "Repaso · M1 L3", en: "Review · M1 L3" },
    },
    {
      id: "m05-l02-q3",
      kind: "single",
      prompt: {
        es: "Quieres crear la oportunidad de renovación partiendo de la actual, sin tocar la actual. ¿Qué línea usas?",
        en: "You want to create the renewal opportunity starting from the current one, without touching the current one. Which line do you use?",
      },
      options: [
        { es: "Opportunity renewal = current.clone();", en: "Opportunity renewal = current.clone();" },
        { es: "Opportunity renewal = current;", en: "Opportunity renewal = current;" },
        { es: "Opportunity renewal = new Opportunity(current);", en: "Opportunity renewal = new Opportunity(current);" },
      ],
      answer: 0,
      explain: {
        es: "clone() fabrica un objeto nuevo con los mismos valores. renewal = current solo copia el enlace —las dos variables apuntan al mismo registro—, y new Opportunity(current) no existe.",
        en: "clone() produces a new object with the same values. renewal = current only copies the link — both variables point at the same record — and new Opportunity(current) does not exist.",
      },
      tags: ["recall"],
    },
    {
      id: "m05-l02-q4",
      kind: "single",
      prompt: {
        es: "¿Qué valor tiene leads[1].Status después del bucle?",
        en: "What value does leads[1].Status hold after the loop?",
      },
      code: {
        es: `List<Lead> leads = new List<Lead>{
    new Lead(LastName = 'Ruiz', Status = 'Open'),
    new Lead(LastName = 'Kim', Status = 'Open')
};
for (Lead l : leads) {
    l.Status = 'Working';
}`,
        en: `List<Lead> leads = new List<Lead>{
    new Lead(LastName = 'Ruiz', Status = 'Open'),
    new Lead(LastName = 'Kim', Status = 'Open')
};
for (Lead l : leads) {
    l.Status = 'Working';
}`,
      },
      options: [
        { es: "Working", en: "Working" },
        { es: "Open", en: "Open" },
        { es: "null", en: "null" },
      ],
      answer: 0,
      explain: {
        es: "l es una referencia a cada lead de la lista, no una copia. Cambiar l cambia el registro que está dentro de leads.",
        en: "l is a reference to each lead in the list, not a copy. Changing l changes the record inside leads.",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M2 L5", en: "Review · M2 L5" },
    },
    {
      id: "m05-l02-q5",
      kind: "text",
      prompt: {
        es: "¿Qué operador de Apex dice si dos variables apuntan exactamente al mismo objeto?",
        en: "Which Apex operator tells you whether two variables point to exactly the same object?",
      },
      accept: ["===", "\\s*===\\s*"],
      placeholder: { es: "operador", en: "operator" },
      explain: {
        es: "===. Con sObjects, == compara los valores de los campos, así que un clon es == al original pero no === a él.",
        en: "===. With sObjects, == compares field values, so a clone is == to the original but not === to it.",
      },
      tags: ["recall"],
    },
    {
      id: "m05-l02-q6",
      kind: "multi",
      prompt: {
        es: "¿Qué tipos se comportan como referencias?",
        en: "Which types behave as references?",
      },
      options: [
        { es: "Account", en: "Account" },
        { es: "List<Contact>", en: "List<Contact>" },
        { es: "Integer", en: "Integer" },
        { es: "Una instancia de tu clase WorkTicket", en: "An instance of your WorkTicket class" },
      ],
      answers: [0, 1, 3],
      explain: {
        es: "Todo lo que se crea con new —sObjects, colecciones, tus clases— viaja por referencia. Los números, Boolean, Date y String, por valor.",
        en: "Everything made with new — sObjects, collections, your classes — travels by reference. Numbers, Boolean, Date and String, by value.",
      },
      tags: ["interleaving"],
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 2 DE 12 · La renovación en sí: se prepara a partir de la oportunidad ganada de este año. Un compañero escribió el código que prepara la renovación anual de un cliente, pero Ventas se queja: después de ejecutarlo, la oportunidad ganada de este año aparece como 'Prospecting'. Encuentra el problema y arréglalo.",
      en: "TASK 2 OF 12 · The renewal itself: it is prepared from this year's won opportunity. A colleague wrote the code that prepares a customer's yearly renewal, but Sales is complaining: after running it, this year's won opportunity shows up as 'Prospecting'. Find the problem and fix it.",
    },
    brief: [
      {
        es: "La renovación tiene que ser un objeto independiente del original.",
        en: "The renewal has to be an object independent of the original.",
      },
      {
        es: "La renovación se llama 'Acme · 2027', está en 'Prospecting', cierra un año después que el original y su importe es un 5 % mayor.",
        en: "The renewal is called 'Acme · 2027', is in 'Prospecting', closes one year after the original and its amount is 5% higher.",
      },
      {
        es: "Añade al final un System.debug que muestre el StageName del original, para demostrar que sigue en 'Closed Won'.",
        en: "Add a System.debug at the end that prints the original's StageName, to prove it is still 'Closed Won'.",
      },
    ],
    starter: {
      es: `// CASO: el motor comercial de Northwind Trading
// Tarea 2 de 12: la renovación, sin estropear la oportunidad original.

Opportunity original = new Opportunity(
    Name = 'Acme · 2026',
    StageName = 'Closed Won',
    Amount = 50000,
    CloseDate = Date.newInstance(2026, 12, 31)
);

Opportunity renewal = original;
renewal.Name = 'Acme · 2027';
renewal.StageName = 'Prospecting';
renewal.CloseDate = original.CloseDate.addYears(1);
`,
      en: `// CASE: Northwind Trading's commercial engine
// Task 2 of 12: the renewal, without spoiling the original opportunity.

Opportunity original = new Opportunity(
    Name = 'Acme · 2026',
    StageName = 'Closed Won',
    Amount = 50000,
    CloseDate = Date.newInstance(2026, 12, 31)
);

Opportunity renewal = original;
renewal.Name = 'Acme · 2027';
renewal.StageName = 'Prospecting';
renewal.CloseDate = original.CloseDate.addYears(1);
`,
    },
    hints: [
      {
        es: "Cuenta los new: solo hay uno. Eso significa que original y renewal son dos pestañas del mismo registro.",
        en: "Count the news: there is only one. That means original and renewal are two tabs of the same record.",
      },
      {
        es: "La línea que crea renewal tiene que fabricar un objeto nuevo con los mismos valores: para eso está clone(). El 5 % más es el importe original multiplicado por 1.05.",
        en: "The line that creates renewal has to produce a new object with the same values: that is what clone() is for. 5% more is the original amount multiplied by 1.05.",
      },
      {
        es: "Pseudocódigo: Opportunity renewal = original.clone(); después nombre, etapa, fecha, renewal.Amount = original.Amount * 1.05; y System.debug(original.StageName);",
        en: "Pseudocode: Opportunity renewal = original.clone(); then name, stage, date, renewal.Amount = original.Amount * 1.05; and System.debug(original.StageName);",
      },
    ],
    solution: {
      es: `Opportunity original = new Opportunity(
    Name = 'Acme · 2026',
    StageName = 'Closed Won',
    Amount = 50000,
    CloseDate = Date.newInstance(2026, 12, 31)
);

Opportunity renewal = original.clone();
renewal.Name = 'Acme · 2027';
renewal.StageName = 'Prospecting';
renewal.CloseDate = original.CloseDate.addYears(1);
renewal.Amount = original.Amount * 1.05;

System.debug(original.StageName);   // Closed Won`,
      en: `Opportunity original = new Opportunity(
    Name = 'Acme · 2026',
    StageName = 'Closed Won',
    Amount = 50000,
    CloseDate = Date.newInstance(2026, 12, 31)
);

Opportunity renewal = original.clone();
renewal.Name = 'Acme · 2027';
renewal.StageName = 'Prospecting';
renewal.CloseDate = original.CloseDate.addYears(1);
renewal.Amount = original.Amount * 1.05;

System.debug(original.StageName);   // Closed Won`,
    },
    checks: [
      {
        id: "m05-l02-c1",
        label: {
          es: "renewal es una copia hecha con clone()",
          en: "renewal is a copy made with clone()",
        },
        rule: { op: "match", pattern: "Opportunity\\s+renewal\\s*=\\s*original\\.clone\\(\\s*\\)\\s*;" },
        onFail: {
          es: "renewal = original copia el enlace. Para un objeto independiente: Opportunity renewal = original.clone();",
          en: "renewal = original copies the link. For an independent object: Opportunity renewal = original.clone();",
        },
      },
      {
        id: "m05-l02-c2",
        label: {
          es: "Ya no queda ninguna asignación directa renewal = original",
          en: "No direct renewal = original assignment is left",
        },
        rule: { op: "absent", pattern: "renewal\\s*=\\s*original\\s*;" },
        onFail: {
          es: "Mientras exista renewal = original; en algún sitio, las dos variables vuelven a apuntar al mismo registro.",
          en: "As long as renewal = original; exists anywhere, both variables point to the same record again.",
        },
      },
      {
        id: "m05-l02-c3",
        label: {
          es: "La renovación tiene su nombre, su etapa y su fecha",
          en: "The renewal has its name, stage and date",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "renewal\\.Name\\s*=\\s*'Acme · 2027'\\s*;" },
            { op: "match", pattern: "renewal\\.StageName\\s*=\\s*'Prospecting'\\s*;" },
            { op: "match", pattern: "renewal\\.CloseDate\\s*=\\s*original\\.CloseDate\\.addYears\\(\\s*1\\s*\\)\\s*;" },
          ],
        },
        onFail: {
          es: "Mantén las tres asignaciones del código original: ahora son seguras porque renewal es otro objeto.",
          en: "Keep the three assignments from the original code: they are safe now because renewal is another object.",
        },
      },
      {
        id: "m05-l02-c4",
        label: {
          es: "El importe de la renovación es un 5 % mayor",
          en: "The renewal's amount is 5% higher",
        },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "renewal\\.Amount\\s*=\\s*original\\.Amount\\s*\\*\\s*1\\.05\\s*;" },
            { op: "match", pattern: "renewal\\.Amount\\s*=\\s*renewal\\.Amount\\s*\\*\\s*1\\.05\\s*;" },
            { op: "match", pattern: "renewal\\.Amount\\s*\\*=\\s*1\\.05\\s*;" },
          ],
        },
        onFail: {
          es: "Un 5 % más es multiplicar por 1.05: renewal.Amount = original.Amount * 1.05;",
          en: "5% more means multiplying by 1.05: renewal.Amount = original.Amount * 1.05;",
        },
      },
      {
        id: "m05-l02-c5",
        label: {
          es: "Un System.debug demuestra el StageName del original",
          en: "A System.debug proves the original's StageName",
        },
        rule: { op: "match", pattern: "System\\.debug\\([^;]*original\\.StageName[^;]*\\)\\s*;" },
        onFail: {
          es: "Añade System.debug(original.StageName); al final: con el arreglo, debe seguir mostrando Closed Won.",
          en: "Add System.debug(original.StageName); at the end: with the fix, it must still show Closed Won.",
        },
        onPass: {
          es: "Con clone(), el registro de este año queda intacto: 'Closed Won' y 50.000.",
          en: "With clone(), this year's record stays intact: 'Closed Won' and 50,000.",
        },
      },
    ],
    rubric: [
      {
        es: "Si quitas el clone() y vuelves a ejecutar mentalmente el código, ¿qué dos campos del original quedarían mal?",
        en: "If you remove the clone() and run the code again in your head, which two fields of the original would end up wrong?",
      },
      {
        es: "Tarea 3: toda renovación incluye un plan de soporte, y ese plan tiene que nacer completo, sin campos olvidados.",
        en: "Task 3: every renewal includes a support plan, and that plan must be born complete, with no forgotten fields.",
      },
    ],
  },
};
