import type { Lesson } from "@/lib/types";

export const l03BeforeAfter: Lesson = {
  id: "m06-l03",
  slug: "before-vs-after",
  n: 3,
  kind: "lesson",
  minutes: 35,
  title: {
    es: "before vs after",
    en: "before vs after",
  },
  summary: {
    es: "Cuándo escribir la lógica antes de que el registro se guarde y cuándo después. La regla cabe en una línea: si cambias el mismo registro, before; si tocas otros, after.",
    en: "When to write logic before the record is saved and when after. The rule fits on one line: changing the same record, before; touching others, after.",
  },
  analogy: {
    es: "«Fast Field Updates» frente a «Actions and Related Records» en un Record-Triggered Flow",
    en: "“Fast Field Updates” versus “Actions and Related Records” in a record-triggered Flow",
  },
  objectives: [
    {
      es: "Decidir entre before y after según lo que tiene que hacer el trigger.",
      en: "Choose between before and after based on what the trigger has to do.",
    },
    {
      es: "Cambiar campos del propio registro en before, sin consultas ni DML.",
      en: "Change fields on the record itself in before, with no queries or DML.",
    },
    {
      es: "Crear registros relacionados en after, usando el Id recién generado y un solo DML.",
      en: "Create related records in after, using the newly generated Id and a single DML.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "En la lección anterior viste que Trigger.new se puede cambiar en before y no en after. No es una regla caprichosa: sale directamente de en qué momento del guardado se ejecuta cada uno. Entender ese momento te dice, casi siempre, qué evento elegir.",
        en: "In the previous lesson you saw that Trigger.new can be changed in before and not in after. It is not an arbitrary rule: it comes straight from the point in the save where each one runs. Understanding that point tells you, almost always, which event to pick.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Cuando creas un Record-Triggered Flow, Salesforce te pregunta para qué optimizarlo. «Fast Field Updates» corre antes de guardar y solo puede cambiar campos del propio registro: por eso es tan rápido. «Actions and Related Records» corre después y puede crear tareas, actualizar la cuenta o mandar correos. Es exactamente before y after. Si alguna vez elegiste bien entre esas dos opciones, ya sabes la mitad de esta lección.",
        en: "When you create a record-triggered Flow, Salesforce asks what to optimise it for. “Fast Field Updates” runs before saving and can only change fields on the record itself: that is why it is so fast. “Actions and Related Records” runs afterwards and can create tasks, update the account or send emails. That is exactly before and after. If you ever chose correctly between those two options, you already know half of this lesson.",
      },
    },
    {
      type: "diagram",
      id: "m06-before-after",
      caption: {
        es: "La pregunta clave no es «qué quiero hacer», sino «a qué registro se lo quiero hacer».",
        en: "The key question is not “what do I want to do” but “which record do I want to do it to”.",
      },
    },
    {
      type: "h",
      text: { es: "before: cambiar el propio registro, gratis", en: "before: changing the record itself, for free" },
    },
    {
      type: "p",
      text: {
        es: "En before, el registro está en camino hacia la base de datos pero todavía no ha llegado. Si le cambias un campo, ese cambio viaja con él. No hace falta update, y no debes hacerlo: el guardado ya está en marcha. Es el sitio para rellenar valores por defecto, normalizar textos (el trim y toUpperCase del Módulo 1) o calcular un campo a partir de otros.",
        en: "In before, the record is on its way to the database but has not arrived yet. If you change one of its fields, the change travels with it. No update is needed, and you must not do one: the save is already under way. It is the place to fill in defaults, normalise text (Module 1's trim and toUpperCase) or compute a field from others.",
      },
    },
    {
      type: "code",
      code: {
        es: `trigger LeadClean on Lead (before insert, before update) {
    for (Lead l : Trigger.new) {
        if (l.Company != null) {
            l.Company = l.Company.trim();
        }
        if (String.isBlank(l.LeadSource)) {
            l.LeadSource = 'Web';
        }
    }
    // ni una consulta, ni un DML: el guardado ya está en marcha
}`,
        en: `trigger LeadClean on Lead (before insert, before update) {
    for (Lead l : Trigger.new) {
        if (l.Company != null) {
            l.Company = l.Company.trim();
        }
        if (String.isBlank(l.LeadSource)) {
            l.LeadSource = 'Web';
        }
    }
    // not one query, not one DML: the save is already under way
}`,
      },
      caption: {
        es: "Con 200 leads, este trigger gasta 0 consultas y 0 instrucciones DML. Por eso, cuando el cambio es sobre el propio registro, before siempre gana.",
        en: "With 200 leads, this trigger spends 0 queries and 0 DML statements. That is why, when the change is to the record itself, before always wins.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "¿Y la fórmula o el valor por defecto?", en: "What about a formula or a default value?" },
      text: {
        es: "Antes de escribir un trigger before, hazte la pregunta de Admin: ¿lo resuelve un valor por defecto del campo, un campo fórmula o un Flow «Fast Field Updates»? Si sí, suele ser mejor: se mantiene sin código. El trigger se justifica cuando la lógica es compleja, necesita datos de otros registros o tiene que convivir con el resto del código del objeto.",
        en: "Before writing a before trigger, ask yourself the Admin question: does a field default value, a formula field or a “Fast Field Updates” Flow solve it? If so, it is usually better: it is maintained without code. The trigger is justified when the logic is complex, needs data from other records or has to live alongside the rest of the object's code.",
      },
    },
    {
      type: "h",
      text: { es: "after: el Id existe y puedes tocar otros registros", en: "after: the Id exists and you can touch other records" },
    },
    {
      type: "p",
      text: {
        es: "En after, el registro ya se ha escrito (aunque todavía no se ha confirmado). Eso trae dos cosas. Primero, en insert ya tiene Id, así que puedes crear hijos que apunten a él: tareas, contactos, líneas. Segundo, Trigger.new pasa a ser de solo lectura: el registro ya se escribió y cambiarle un campo en memoria no serviría de nada. Si necesitas modificar otros registros, lo haces como en el Módulo 4: construyes una lista y haces un solo DML.",
        en: "In after, the record has already been written (though not committed yet). That brings two things. First, on insert it has an Id, so you can create children that point to it: tasks, contacts, lines. Second, Trigger.new becomes read-only: the record has been written and changing one of its fields in memory would do nothing. If you need to modify other records, you do it as in Module 4: build a list and do a single DML.",
      },
    },
    {
      type: "code",
      code: {
        es: `trigger AccountOnboarding on Account (after insert) {
    List<Task> tasks = new List<Task>();
    for (Account a : Trigger.new) {
        tasks.add(new Task(
            WhatId = a.Id,              // el Id ya existe
            OwnerId = a.OwnerId,
            Subject = 'Llamada de bienvenida',
            ActivityDate = Date.today().addDays(3)
        ));
    }
    insert tasks;                       // un DML para todo el lote
}`,
        en: `trigger AccountOnboarding on Account (after insert) {
    List<Task> tasks = new List<Task>();
    for (Account a : Trigger.new) {
        tasks.add(new Task(
            WhatId = a.Id,              // the Id exists now
            OwnerId = a.OwnerId,
            Subject = 'Welcome call',
            ActivityDate = Date.today().addDays(3)
        ));
    }
    insert tasks;                       // one DML for the whole batch
}`,
      },
      caption: {
        es: "En before insert, a.Id sería null y las tareas no quedarían vinculadas a nada. Por eso esto va en after.",
        en: "In before insert, a.Id would be null and the tasks would be linked to nothing. That is why this goes in after.",
      },
    },
    {
      type: "h",
      text: { es: "El error típico: arreglar en after lo que era de before", en: "The classic mistake: fixing in after what belonged in before" },
    },
    {
      type: "p",
      text: {
        es: "Como en after no puedes cambiar Trigger.new, hay quien consulta los mismos registros y les hace update. Funciona, pero es el peor de los mundos: gasta una consulta y un DML que en before no necesitabas, el registro se guarda dos veces, y ese segundo update vuelve a disparar el trigger de update. Es el origen clásico de la recursión de la lección 5.",
        en: "Since you cannot change Trigger.new in after, some people query the same records and update them. It works, but it is the worst of both worlds: it spends a query and a DML you did not need in before, the record is saved twice, and that second update fires the update trigger again. It is the classic origin of lesson 5's recursion.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Quieres…", en: "You want to…" },
        { es: "Evento", en: "Event" },
        { es: "¿DML?", en: "DML?" },
      ],
      rows: [
        [
          { es: "Rellenar o normalizar un campo del mismo registro", en: "Fill in or normalise a field on the same record" },
          { es: "before", en: "before" },
          { es: "No", en: "No" },
        ],
        [
          { es: "Calcular un campo a partir de otros del mismo registro", en: "Compute a field from others on the same record" },
          { es: "before", en: "before" },
          { es: "No", en: "No" },
        ],
        [
          { es: "Rellenar un campo con datos del padre (cuenta, propietario)", en: "Fill a field with data from the parent (account, owner)" },
          { es: "before", en: "before" },
          { es: "No (pero sí una consulta)", en: "No (but one query)" },
        ],
        [
          { es: "Crear hijos que necesitan el Id del registro", en: "Create children that need the record's Id" },
          { es: "after", en: "after" },
          { es: "Sí, uno", en: "Yes, one" },
        ],
        [
          { es: "Actualizar el padre u otros registros", en: "Update the parent or other records" },
          { es: "after", en: "after" },
          { es: "Sí, uno", en: "Yes, one" },
        ],
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "before delete y after delete", en: "before delete and after delete" },
      text: {
        es: "En delete la lógica se invierte un poco: en before delete todavía puedes leer los hijos del registro (por ejemplo, contar los contactos de una cuenta antes de que desaparezca), y en after delete el registro ya está en la Papelera. Se usan mucho menos; en este curso bastará con saber que existen y que solo tienen Trigger.old.",
        en: "On delete the logic is slightly reversed: in before delete you can still read the record's children (for example, count an account's contacts before it goes), and in after delete the record is already in the Recycle Bin. They are used far less; for this course it is enough to know they exist and only have Trigger.old.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: di la regla de una línea. ¿Por qué no hay que hacer update en un trigger before? ¿Por qué crear una tarea vinculada a una cuenta nueva tiene que ir en after?",
        en: "Without looking: say the one-line rule. Why must you not do an update in a before trigger? Why does creating a task linked to a new account have to go in after?",
      },
    },
  ],

  quiz: [
    {
      id: "m06-l03-q1",
      kind: "single",
      prompt: {
        es: "Quieres que el campo Industry de una cuenta nueva sea 'Other' si viene vacío. ¿Cuál es la MEJOR opción en código?",
        en: "You want a new account's Industry to be 'Other' if it arrives blank. Which is the BEST option in code?",
      },
      options: [
        {
          es: "before insert: cambiar a.Industry en Trigger.new, sin DML.",
          en: "before insert: change a.Industry on Trigger.new, no DML.",
        },
        {
          es: "after insert: consultar las cuentas, cambiar Industry y hacer update.",
          en: "after insert: query the accounts, change Industry and update.",
        },
        {
          es: "after insert: cambiar a.Industry en Trigger.new.",
          en: "after insert: change a.Industry on Trigger.new.",
        },
      ],
      answer: 0,
      explain: {
        es: "Es un campo del propio registro: before, gratis. La segunda funciona pero gasta consulta y DML y guarda dos veces. La tercera lanza Record is read-only.",
        en: "It is a field on the record itself: before, for free. The second works but spends a query and DML and saves twice. The third throws Record is read-only.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m06-l03-q2",
      kind: "single",
      prompt: {
        es: "¿Qué muestra este código en before insert?",
        en: "What does this code print in before insert?",
      },
      code: {
        es: `trigger ContactTrigger on Contact (before insert) {
    for (Contact c : Trigger.new) {
        System.debug(c.Id);
    }
}`,
        en: `trigger ContactTrigger on Contact (before insert) {
    for (Contact c : Trigger.new) {
        System.debug(c.Id);
    }
}`,
      },
      options: [
        { es: "null", en: "null" },
        { es: "El Id del contacto", en: "The contact's Id" },
        { es: "Lanza una excepción", en: "It throws an exception" },
      ],
      answer: 0,
      explain: {
        es: "Antes de guardar por primera vez no hay Id: lo asigna la base de datos. En after insert sí lo tendría.",
        en: "Before the first save there is no Id: the database assigns it. In after insert it would have one.",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M4 L1", en: "Review · M4 L1" },
    },
    {
      id: "m06-l03-q3",
      kind: "single",
      prompt: {
        es: "¿Qué tiene de malo este trigger?",
        en: "What is wrong with this trigger?",
      },
      code: {
        es: `trigger LeadClean on Lead (before update) {
    for (Lead l : Trigger.new) {
        l.Company = l.Company.trim();
    }
    update Trigger.new;
}`,
        en: `trigger LeadClean on Lead (before update) {
    for (Lead l : Trigger.new) {
        l.Company = l.Company.trim();
    }
    update Trigger.new;
}`,
      },
      options: [
        {
          es: "El update sobra y falla: en before, los cambios ya se guardan solos.",
          en: "The update is unnecessary and fails: in before, changes already save by themselves.",
        },
        { es: "Falta un insert.", en: "An insert is missing." },
        { es: "Nada, así se guardan los cambios.", en: "Nothing, that is how changes are saved." },
      ],
      answer: 0,
      explain: {
        es: "Sobre Trigger.new no se puede hacer DML: Salesforce lanza un error. En before basta con cambiar el campo. Además, l.Company.trim() revienta si Company es null: la versión buena comprueba antes.",
        en: "You cannot run DML on Trigger.new: Salesforce throws an error. In before, changing the field is enough. Also, l.Company.trim() blows up if Company is null: the good version checks first.",
      },
      tags: ["find-error", "interleaving"],
    },
    {
      id: "m06-l03-q4",
      kind: "multi",
      prompt: {
        es: "¿Qué tareas van en after y no en before?",
        en: "Which tasks go in after and not in before?",
      },
      options: [
        {
          es: "Crear una tarea de bienvenida vinculada a cada cuenta nueva.",
          en: "Create a welcome task linked to each new account.",
        },
        {
          es: "Poner en mayúsculas el código postal del propio registro.",
          en: "Upper-case the record's own postal code.",
        },
        {
          es: "Actualizar la valoración de la cuenta cuando se gana una oportunidad.",
          en: "Update the account's rating when an opportunity is won.",
        },
        {
          es: "Rellenar LeadSource si viene vacío.",
          en: "Fill in LeadSource if it is blank.",
        },
      ],
      answers: [0, 2],
      explain: {
        es: "Crear hijos que necesitan el Id y tocar otro registro (la cuenta) son de after. Lo que cambia el propio registro, de before.",
        en: "Creating children that need the Id and touching another record (the account) belong in after. Whatever changes the record itself, in before.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m06-l03-q5",
      kind: "single",
      prompt: {
        es: "En un Record-Triggered Flow, ¿qué opción de optimización equivale a un trigger before?",
        en: "In a record-triggered Flow, which optimisation option is equivalent to a before trigger?",
      },
      options: [
        { es: "Fast Field Updates", en: "Fast Field Updates" },
        { es: "Actions and Related Records", en: "Actions and Related Records" },
        { es: "Run Asynchronously", en: "Run Asynchronously" },
      ],
      answer: 0,
      explain: {
        es: "Fast Field Updates corre antes de guardar y solo cambia campos del propio registro: justo lo que hace before.",
        en: "Fast Field Updates runs before saving and only changes fields on the record itself: exactly what before does.",
      },
      tags: ["recall"],
    },
    {
      id: "m06-l03-q6",
      kind: "text",
      prompt: {
        es: "Escribe el nombre exacto del error que lanza Salesforce si cambias un campo de Trigger.new en un trigger after (lo que va detrás de System.FinalException:).",
        en: "Write the exact name of the error Salesforce throws if you change a field on Trigger.new in an after trigger (what comes after System.FinalException:).",
      },
      accept: ["\\s*record\\s+is\\s+read-?only\\.?\\s*"],
      placeholder: { es: "Record is …", en: "Record is …" },
      explain: {
        es: "Record is read-only. En after, el registro ya está escrito: para cambiar el propio registro, before.",
        en: "Record is read-only. In after, the record has already been written: to change the record itself, before.",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "Alta de cuentas: el equipo quiere que ninguna cuenta nueva se quede sin Rating (si viene vacío, 'Warm') y que cada cuenta nueva tenga una tarea de llamada de bienvenida para su propietario dentro de 3 días. Un solo trigger, con cada cosa en su momento.",
      en: "New accounts: the team wants no new account left without a Rating (if blank, 'Warm') and every new account to get a welcome-call task for its owner within 3 days. A single trigger, with each thing at its right moment.",
    },
    brief: [
      {
        es: "Trigger AccountOnboarding sobre Account, en before insert y after insert.",
        en: "Trigger AccountOnboarding on Account, on before insert and after insert.",
      },
      {
        es: "En la parte before: si Rating está vacío, ponlo en 'Warm'. Sin DML.",
        en: "In the before part: if Rating is blank, set it to 'Warm'. No DML.",
      },
      {
        es: "En la parte after: una Task por cuenta con WhatId = la cuenta, OwnerId = el propietario de la cuenta, Subject 'Llamada de bienvenida' y ActivityDate dentro de 3 días.",
        en: "In the after part: one Task per account with WhatId = the account, OwnerId = the account owner, Subject 'Welcome call' and ActivityDate in 3 days.",
      },
      {
        es: "Todas las tareas con un solo insert, fuera del bucle.",
        en: "All the tasks with a single insert, outside the loop.",
      },
    ],
    starter: {
      es: `trigger AccountOnboarding on Account (before insert, after insert) {

}
`,
      en: `trigger AccountOnboarding on Account (before insert, after insert) {

}
`,
    },
    hints: [
      {
        es: "Dos ramas en el mismo trigger: Trigger.isBefore y Trigger.isAfter.",
        en: "Two branches in the same trigger: Trigger.isBefore and Trigger.isAfter.",
      },
      {
        es: "En before, String.isBlank(a.Rating) y cambias a.Rating directamente. En after, una List<Task> que llenas en el for y un insert después.",
        en: "In before, String.isBlank(a.Rating) and you change a.Rating directly. In after, a List<Task> you fill in the for and an insert afterwards.",
      },
      {
        es: "Pseudocódigo: if (Trigger.isBefore) { for (Account a : Trigger.new) { if (String.isBlank(a.Rating)) a.Rating = 'Warm'; } } if (Trigger.isAfter) { List<Task> tasks = …; for (…) tasks.add(new Task(WhatId = a.Id, OwnerId = a.OwnerId, Subject = …, ActivityDate = Date.today().addDays(3))); insert tasks; }",
        en: "Pseudocode: if (Trigger.isBefore) { for (Account a : Trigger.new) { if (String.isBlank(a.Rating)) a.Rating = 'Warm'; } } if (Trigger.isAfter) { List<Task> tasks = …; for (…) tasks.add(new Task(WhatId = a.Id, OwnerId = a.OwnerId, Subject = …, ActivityDate = Date.today().addDays(3))); insert tasks; }",
      },
    ],
    solution: {
      es: `trigger AccountOnboarding on Account (before insert, after insert) {
    if (Trigger.isBefore) {
        for (Account a : Trigger.new) {
            if (String.isBlank(a.Rating)) {
                a.Rating = 'Warm';
            }
        }
    }

    if (Trigger.isAfter) {
        List<Task> tasks = new List<Task>();
        for (Account a : Trigger.new) {
            tasks.add(new Task(
                WhatId = a.Id,
                OwnerId = a.OwnerId,
                Subject = 'Llamada de bienvenida',
                ActivityDate = Date.today().addDays(3)
            ));
        }
        insert tasks;
    }
}`,
      en: `trigger AccountOnboarding on Account (before insert, after insert) {
    if (Trigger.isBefore) {
        for (Account a : Trigger.new) {
            if (String.isBlank(a.Rating)) {
                a.Rating = 'Warm';
            }
        }
    }

    if (Trigger.isAfter) {
        List<Task> tasks = new List<Task>();
        for (Account a : Trigger.new) {
            tasks.add(new Task(
                WhatId = a.Id,
                OwnerId = a.OwnerId,
                Subject = 'Welcome call',
                ActivityDate = Date.today().addDays(3)
            ));
        }
        insert tasks;
    }
}`,
    },
    checks: [
      {
        id: "m06-l03-c1",
        label: {
          es: "Trigger AccountOnboarding en before insert y after insert",
          en: "AccountOnboarding trigger on before insert and after insert",
        },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "trigger\\s+AccountOnboarding\\s+on\\s+Account\\s*\\(\\s*before\\s+insert\\s*,\\s*after\\s+insert\\s*\\)" },
            { op: "match", pattern: "trigger\\s+AccountOnboarding\\s+on\\s+Account\\s*\\(\\s*after\\s+insert\\s*,\\s*before\\s+insert\\s*\\)" },
          ],
        },
        onFail: {
          es: "trigger AccountOnboarding on Account (before insert, after insert) { … }",
          en: "trigger AccountOnboarding on Account (before insert, after insert) { … }",
        },
      },
      {
        id: "m06-l03-c2",
        label: {
          es: "Separa las ramas con Trigger.isBefore y Trigger.isAfter",
          en: "Splits the branches with Trigger.isBefore and Trigger.isAfter",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "if\\s*\\(\\s*Trigger\\.isBefore\\b" },
            { op: "match", pattern: "if\\s*\\(\\s*Trigger\\.isAfter\\b" },
          ],
        },
        onFail: {
          es: "if (Trigger.isBefore) { … } y if (Trigger.isAfter) { … }",
          en: "if (Trigger.isBefore) { … } and if (Trigger.isAfter) { … }",
        },
      },
      {
        id: "m06-l03-c3",
        label: {
          es: "En before: Rating vacío pasa a 'Warm'",
          en: "In before: a blank Rating becomes 'Warm'",
        },
        rule: {
          op: "all",
          of: [
            {
              op: "any",
              of: [
                { op: "match", pattern: "String\\.isBlank\\(\\s*\\w+\\.Rating\\s*\\)" },
                { op: "match", pattern: "\\w+\\.Rating\\s*==\\s*null" },
              ],
            },
            { op: "match", pattern: "\\w+\\.Rating\\s*=\\s*'Warm'\\s*;" },
          ],
        },
        onFail: {
          es: "if (String.isBlank(a.Rating)) { a.Rating = 'Warm'; }",
          en: "if (String.isBlank(a.Rating)) { a.Rating = 'Warm'; }",
        },
      },
      {
        id: "m06-l03-c4",
        label: {
          es: "En after: una tarea por cuenta, con el Id y el propietario",
          en: "In after: one task per account, with the Id and the owner",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "new\\s+Task\\([^;]*WhatId\\s*=\\s*\\w+\\.Id\\b" },
            { op: "match", pattern: "new\\s+Task\\([^;]*OwnerId\\s*=\\s*\\w+\\.OwnerId\\b" },
            { op: "match", pattern: "new\\s+Task\\([^;]*ActivityDate\\s*=\\s*Date\\.today\\(\\s*\\)\\.addDays\\(\\s*3\\s*\\)" },
          ],
        },
        onFail: {
          es: "new Task(WhatId = a.Id, OwnerId = a.OwnerId, Subject = …, ActivityDate = Date.today().addDays(3))",
          en: "new Task(WhatId = a.Id, OwnerId = a.OwnerId, Subject = …, ActivityDate = Date.today().addDays(3))",
        },
      },
      {
        id: "m06-l03-c5",
        label: {
          es: "Un solo insert de tareas, fuera del bucle, y ningún update",
          en: "A single task insert, outside the loop, and no update",
        },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "\\binsert\\s+\\w+\\s*;", min: 1, max: 1 },
            { op: "absent", pattern: "(for|while)\\s*\\([^)]*\\)\\s*\\{[^{}]*\\binsert\\s+\\w+\\s*;" },
            { op: "absent", pattern: "\\bupdate\\s+[\\w.()]+\\s*;" },
          ],
        },
        onFail: {
          es: "Un único insert tasks; después del for. El Rating se guarda solo en before: no hace falta update.",
          en: "A single insert tasks; after the for. The Rating saves by itself in before: no update needed.",
        },
        onPass: {
          es: "Cada cosa en su momento: el Rating sin coste en before y las tareas con un solo DML en after.",
          en: "Each thing at its moment: the Rating for free in before and the tasks with a single DML in after.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué pasaría si movieras la creación de tareas a la rama before? Piensa en qué valor tendría a.Id.",
        en: "What would happen if you moved the task creation into the before branch? Think about what value a.Id would have.",
      },
    ],
  },
};
