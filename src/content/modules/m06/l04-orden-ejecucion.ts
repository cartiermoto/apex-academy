import type { Lesson } from "@/lib/types";

export const l04OrdenEjecucion: Lesson = {
  id: "m06-l04",
  slug: "orden-de-ejecucion",
  n: 4,
  kind: "lesson",
  minutes: 35,
  title: {
    es: "Orden de ejecución en Salesforce",
    en: "Salesforce order of execution",
  },
  summary: {
    es: "Todo lo que ocurre, y en qué orden, desde que alguien pulsa Guardar hasta que el registro queda confirmado: validaciones, flows, triggers, reglas y roll-ups. Saberlo es lo que te permite explicar comportamientos que parecen magia.",
    en: "Everything that happens, and in what order, from the moment someone clicks Save until the record is committed: validations, flows, triggers, rules and roll-ups. Knowing it is what lets you explain behaviour that looks like magic.",
  },
  analogy: {
    es: "Flow Trigger Explorer, pero para toda la automatización del objeto",
    en: "Flow Trigger Explorer, but for all of the object's automation",
  },
  objectives: [
    {
      es: "Situar los triggers before y after dentro del orden de ejecución.",
      en: "Place before and after triggers within the order of execution.",
    },
    {
      es: "Predecir qué ve una regla de validación o un flow según dónde corre respecto a tu trigger.",
      en: "Predict what a validation rule or a flow sees depending on where it runs relative to your trigger.",
    },
    {
      es: "Usar un trigger before para completar datos que una validación exige.",
      en: "Use a before trigger to complete data a validation requires.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "«La regla de validación salta aunque mi trigger ya rellenó el campo.» «El flow ve el valor viejo.» «El roll-up no se actualiza hasta que refresco.» Casi todos los misterios de automatización en Salesforce se resuelven con la misma herramienta: saber en qué orden ocurren las cosas cuando se guarda un registro. Salesforce lo llama [[orden-ejecucion|orden de ejecución]], y es de lo más preguntado en el examen Platform Developer I.",
        en: "“The validation rule fires even though my trigger already filled the field.” “The flow sees the old value.” “The roll-up does not update until I refresh.” Almost every automation mystery in Salesforce is solved with the same tool: knowing the order in which things happen when a record is saved. Salesforce calls it the [[orden-ejecucion|order of execution]], and it is one of the most asked topics on the Platform Developer I exam.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Flow Trigger Explorer te enseña, para un objeto, qué flows corren antes de guardar y cuáles después, y te deja ordenarlos entre sí. Es un trozo del orden de ejecución. Aquí vas a ver el mapa completo: dónde encajan tus triggers, tus validation rules, las reglas de asignación, los workflows heredados y los roll-ups, todo en la misma línea de tiempo.",
        en: "Flow Trigger Explorer shows you, for one object, which flows run before saving and which after, and lets you order them among themselves. It is a piece of the order of execution. Here you will see the full map: where your triggers, your validation rules, assignment rules, legacy workflows and roll-ups fit, all on the same timeline.",
      },
    },
    {
      type: "h",
      text: { es: "El recorrido de un guardado, paso a paso", en: "A save's journey, step by step" },
    },
    {
      type: "p",
      text: {
        es: "Pulsa Reproducir y sigue al registro. Puedes pararlo, ir hacia atrás o pulsar cualquier paso para leer qué ocurre en él. Los dos pasos marcados como «tu código» son tus triggers.",
        en: "Press Play and follow the record. You can pause it, step back or click any step to read what happens there. The two steps marked “your code” are your triggers.",
      },
    },
    {
      type: "diagram",
      id: "m06-order",
      caption: {
        es: "Versión simplificada: el orden oficial tiene unos 20 pasos. Aquí se agrupan los que importan para escribir un trigger; entitlements y reglas de compartición, por ejemplo, van entre los roll-ups y el commit.",
        en: "Simplified version: the official order has about 20 steps. Here the ones that matter for writing a trigger are grouped; entitlements and sharing rules, for instance, sit between the roll-ups and the commit.",
      },
    },
    {
      type: "h",
      text: { es: "Cinco consecuencias que te ahorran horas", en: "Five consequences that save you hours" },
    },
    {
      type: "list",
      ordered: true,
      items: [
        {
          es: "Los flows «Fast Field Updates» corren antes que tus triggers before. Si los dos tocan el mismo campo, gana el trigger, porque escribe el último.",
          en: "“Fast Field Updates” flows run before your before triggers. If both touch the same field, the trigger wins, because it writes last.",
        },
        {
          es: "Las validation rules corren después de los triggers before. Por eso un trigger before puede rellenar un campo que una regla de validación exige, y la regla ya lo verá relleno.",
          en: "Validation rules run after before triggers. That is why a before trigger can fill in a field a validation rule requires, and the rule will already see it filled.",
        },
        {
          es: "Los triggers after corren antes que los flows «Actions and Related Records». Si un flow after necesita algo que crea tu trigger after, ya estará.",
          en: "After triggers run before “Actions and Related Records” flows. If an after flow needs something your after trigger creates, it will already be there.",
        },
        {
          es: "Un roll-up en el padre no es parte de tu guardado: el padre pasa por su propio guardado, con su propio orden de ejecución y sus propios triggers.",
          en: "A roll-up on the parent is not part of your save: the parent goes through its own save, with its own order of execution and its own triggers.",
        },
        {
          es: "Nada es definitivo hasta el commit. Si un flow after-save falla, también se deshace lo que hizo tu trigger before. Es la misma [[transaccion|transacción]] del Módulo 4, con el mismo presupuesto de límites.",
          en: "Nothing is final until the commit. If an after-save flow fails, what your before trigger did is undone too. It is the same [[transaccion|transaction]] from Module 4, with the same limits budget.",
        },
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "El workflow que vuelve a disparar tus triggers", en: "The workflow that fires your triggers again" },
      text: {
        es: "Si una regla de workflow (la automatización antigua, anterior a Flow) tiene una actualización de campo, al aplicarla Salesforce vuelve a ejecutar los triggers before update y after update del registro, una vez más. Muchas orgs con años a sus espaldas todavía tienen workflows activos: si tu trigger se ejecuta dos veces y no sabes por qué, busca ahí primero. Es también una de las puertas de entrada a la recursión de la lección siguiente.",
        en: "If a workflow rule (the old automation, from before Flow) has a field update, when it applies Salesforce runs the record's before update and after update triggers again, one more time. Many orgs with years behind them still have active workflows: if your trigger runs twice and you do not know why, look there first. It is also one of the entry points to next lesson's recursion.",
      },
    },
    {
      type: "h",
      text: { es: "Un caso práctico: rellenar lo que la validación exige", en: "A practical case: filling in what validation requires" },
    },
    {
      type: "p",
      text: {
        es: "Imagina una regla de validación en Contact: «el país es obligatorio». Los contactos que llegan de una integración vienen sin país, pero su cuenta sí lo tiene. Como los triggers before corren antes que las validation rules, un trigger before insert puede copiar el país de la cuenta antes de que la regla mire. La consulta a la cuenta se hace con la receta del Módulo 4: juntar Ids, una consulta, un Map.",
        en: "Imagine a validation rule on Contact: “country is required”. Contacts arriving from an integration come without a country, but their account has one. Because before triggers run before validation rules, a before insert trigger can copy the account's country before the rule looks. The account query uses Module 4's recipe: gather Ids, one query, a Map.",
      },
    },
    {
      type: "code",
      code: {
        es: `trigger ContactCountry on Contact (before insert) {
    Set<Id> accountIds = new Set<Id>();
    for (Contact c : Trigger.new) {
        if (String.isBlank(c.MailingCountry) && c.AccountId != null) {
            accountIds.add(c.AccountId);
        }
    }

    Map<Id, Account> accounts = new Map<Id, Account>(
        [SELECT Id, BillingCountry FROM Account WHERE Id IN :accountIds]
    );

    for (Contact c : Trigger.new) {
        Account acc = accounts.get(c.AccountId);
        if (String.isBlank(c.MailingCountry) && acc != null) {
            c.MailingCountry = acc.BillingCountry;   // antes de que mire la validación
        }
    }
}`,
        en: `trigger ContactCountry on Contact (before insert) {
    Set<Id> accountIds = new Set<Id>();
    for (Contact c : Trigger.new) {
        if (String.isBlank(c.MailingCountry) && c.AccountId != null) {
            accountIds.add(c.AccountId);
        }
    }

    Map<Id, Account> accounts = new Map<Id, Account>(
        [SELECT Id, BillingCountry FROM Account WHERE Id IN :accountIds]
    );

    for (Contact c : Trigger.new) {
        Account acc = accounts.get(c.AccountId);
        if (String.isBlank(c.MailingCountry) && acc != null) {
            c.MailingCountry = acc.BillingCountry;   // before validation looks
        }
    }
}`,
      },
      caption: {
        es: "Una consulta para todo el lote y ningún DML. Si esto estuviera en after, la regla de validación ya habría rechazado el contacto.",
        en: "One query for the whole batch and no DML. If this were in after, the validation rule would already have rejected the contact.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Cómo verlo con tus propios ojos", en: "How to see it with your own eyes" },
      text: {
        es: "En el debug log de un guardado (Developer Console, con el nivel de Apex en FINEST o Workflow en INFO), busca las líneas CODE_UNIT_STARTED: aparecen en el orden en que se ejecuta cada pieza, con nombres como «Validation:Contact», «Workflow:Contact» o el nombre de tu trigger. Es el orden de ejecución, impreso por Salesforce. Lo harás en el Checkpoint.",
        en: "In a save's debug log (Developer Console, with the Apex level at FINEST or Workflow at INFO), look for the CODE_UNIT_STARTED lines: they appear in the order each piece runs, with names like “Validation:Contact”, “Workflow:Contact” or your trigger's name. It is the order of execution, printed by Salesforce. You will do it in the Checkpoint.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué corre antes, un flow «Fast Field Updates» o tu trigger before? ¿Y las validation rules respecto a tu trigger before? ¿Qué pasa con tus triggers si un workflow actualiza un campo?",
        en: "Without looking: which runs first, a “Fast Field Updates” flow or your before trigger? And validation rules relative to your before trigger? What happens to your triggers if a workflow updates a field?",
      },
    },
  ],

  quiz: [
    {
      id: "m06-l04-q1",
      kind: "single",
      prompt: {
        es: "¿Qué se ejecuta primero al guardar un registro?",
        en: "Which runs first when a record is saved?",
      },
      options: [
        { es: "Los flows before-save («Fast Field Updates»)", en: "Before-save flows (“Fast Field Updates”)" },
        { es: "Los triggers before", en: "Before triggers" },
        { es: "Las validation rules", en: "Validation rules" },
        { es: "Los triggers after", en: "After triggers" },
      ],
      answer: 0,
      explain: {
        es: "Tras la validación del sistema: flows before-save, luego triggers before, luego validation rules. Los triggers after, ya con el registro guardado.",
        en: "After system validation: before-save flows, then before triggers, then validation rules. After triggers come once the record is saved.",
      },
      tags: ["recall"],
    },
    {
      id: "m06-l04-q2",
      kind: "single",
      prompt: {
        es: "Una regla de validación exige Phone en las cuentas de tipo Customer. Un trigger before insert pone un teléfono genérico si falta. ¿Qué ocurre al crear una cuenta Customer sin teléfono?",
        en: "A validation rule requires Phone on Customer accounts. A before insert trigger sets a generic phone if it is missing. What happens when creating a Customer account without a phone?",
      },
      options: [
        {
          es: "Se guarda: la regla corre después del trigger before y ya ve el teléfono.",
          en: "It saves: the rule runs after the before trigger and already sees the phone.",
        },
        {
          es: "Falla: la regla corre antes que el trigger.",
          en: "It fails: the rule runs before the trigger.",
        },
        {
          es: "Depende del orden en que se crearon la regla y el trigger.",
          en: "It depends on the order the rule and the trigger were created.",
        },
      ],
      answer: 0,
      explain: {
        es: "Triggers before → validation rules. Lo que rellena el trigger before ya está cuando la regla evalúa.",
        en: "Before triggers → validation rules. What the before trigger fills in is already there when the rule evaluates.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m06-l04-q3",
      kind: "single",
      prompt: {
        es: "Un flow «Fast Field Updates» pone Rating = 'Warm' y tu trigger before update pone Rating = 'Hot' en la misma cuenta. ¿Con qué valor se guarda?",
        en: "A “Fast Field Updates” flow sets Rating = 'Warm' and your before update trigger sets Rating = 'Hot' on the same account. Which value is saved?",
      },
      options: [
        { es: "Hot", en: "Hot" },
        { es: "Warm", en: "Warm" },
        { es: "Salta un error de conflicto", en: "A conflict error fires" },
      ],
      answer: 0,
      explain: {
        es: "El flow before-save corre primero; el trigger before escribe después y gana. Tener dos automatizaciones sobre el mismo campo es, en sí, algo a evitar.",
        en: "The before-save flow runs first; the before trigger writes afterwards and wins. Having two automations on the same field is itself something to avoid.",
      },
      tags: ["predict-output", "interleaving"],
    },
    {
      id: "m06-l04-q4",
      kind: "single",
      prompt: {
        es: "Tu trigger after update se ejecuta dos veces cada vez que editas una oportunidad. En la org hay reglas de workflow antiguas. ¿Cuál es la explicación MÁS probable?",
        en: "Your after update trigger runs twice every time you edit an opportunity. The org has old workflow rules. What is the MOST likely explanation?",
      },
      options: [
        {
          es: "Una actualización de campo de workflow vuelve a disparar los triggers de update una vez más.",
          en: "A workflow field update fires the update triggers one more time.",
        },
        { es: "Salesforce ejecuta siempre los triggers after dos veces.", en: "Salesforce always runs after triggers twice." },
        { es: "Hay un error en la cabecera del trigger.", en: "There is an error in the trigger's header." },
      ],
      answer: 0,
      explain: {
        es: "Es el paso de workflow del orden de ejecución: su field update relanza before update y after update, una sola vez más.",
        en: "It is the workflow step of the order of execution: its field update reruns before update and after update, one more time only.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m06-l04-q5",
      kind: "multi",
      prompt: {
        es: "¿Qué es cierto sobre el commit?",
        en: "What is true about the commit?",
      },
      options: [
        {
          es: "Hasta el commit, un error en cualquier paso deshace también lo que hicieron los pasos anteriores.",
          en: "Until the commit, an error in any step also undoes what earlier steps did.",
        },
        {
          es: "Los correos y el Apex asíncrono se lanzan después del commit.",
          en: "Emails and asynchronous Apex fire after the commit.",
        },
        {
          es: "Tras el trigger before el registro ya queda confirmado.",
          en: "After the before trigger the record is already committed.",
        },
        {
          es: "El registro tiene Id en los triggers after aunque todavía no esté confirmado.",
          en: "The record has an Id in after triggers even though it is not committed yet.",
        },
      ],
      answers: [0, 1, 3],
      explain: {
        es: "Guardado no es lo mismo que confirmado: en after ya hay Id, pero todo sigue siendo reversible hasta el commit. Lo asíncrono espera a que sea definitivo.",
        en: "Saved is not the same as committed: in after there is an Id, but everything stays reversible until the commit. Async work waits for it to be final.",
      },
      tags: ["spaced", "interleaving"],
      from: { es: "Repaso · M4 L5", en: "Review · M4 L5" },
    },
    {
      id: "m06-l04-q6",
      kind: "single",
      prompt: {
        es: "Un campo roll-up en Account suma el importe de sus oportunidades. Guardas una oportunidad. ¿Qué pasa con los triggers de Account?",
        en: "A roll-up field on Account sums its opportunities' amounts. You save an opportunity. What happens to the Account triggers?",
      },
      options: [
        {
          es: "Al recalcularse el roll-up, la cuenta pasa por su propio guardado y sus triggers de update se ejecutan.",
          en: "When the roll-up recalculates, the account goes through its own save and its update triggers run.",
        },
        { es: "No se ejecutan: el roll-up no es un guardado.", en: "They do not run: the roll-up is not a save." },
        { es: "Se ejecutan antes que los de la oportunidad.", en: "They run before the opportunity's." },
      ],
      answer: 0,
      explain: {
        es: "El padre se actualiza y recorre su propio orden de ejecución. Por eso un roll-up puede despertar código que no esperabas.",
        en: "The parent is updated and goes through its own order of execution. That is why a roll-up can wake up code you did not expect.",
      },
      tags: ["predict-output"],
    },
  ],

  exercise: {
    prompt: {
      es: "Datos maestros ha creado una regla de validación en Contact: el país postal es obligatorio. Los contactos que llegan de la integración de eventos vienen sin país, pero sus cuentas sí lo tienen. Escribe el trigger que completa el país antes de que la regla mire, sin romper con cargas de 200.",
      en: "Master data has created a validation rule on Contact: the mailing country is required. Contacts arriving from the events integration come without a country, but their accounts have one. Write the trigger that completes the country before the rule looks, without breaking on loads of 200.",
    },
    brief: [
      {
        es: "Trigger ContactCountry sobre Contact, en el evento que corre antes que las validation rules al crear.",
        en: "Trigger ContactCountry on Contact, on the event that runs before validation rules on create.",
      },
      {
        es: "Junta en un Set<Id> accountIds las cuentas de los contactos que no tienen MailingCountry.",
        en: "Gather in a Set<Id> accountIds the accounts of the contacts that have no MailingCountry.",
      },
      {
        es: "Una sola consulta de esas cuentas con su BillingCountry, a un Map<Id, Account>.",
        en: "A single query of those accounts with their BillingCountry, into a Map<Id, Account>.",
      },
      {
        es: "Copia BillingCountry en MailingCountry cuando falte. Sin DML.",
        en: "Copy BillingCountry into MailingCountry when it is missing. No DML.",
      },
    ],
    starter: {
      es: `// Regla de validación existente: MailingCountry obligatorio en Contact.
// Tu trigger tiene que correr ANTES que ella.
`,
      en: `// Existing validation rule: MailingCountry required on Contact.
// Your trigger has to run BEFORE it.
`,
    },
    hints: [
      {
        es: "Mira el orden de ejecución: ¿qué corre justo antes que las validation rules? Y como vas a leer cuentas, recuerda la receta del Módulo 4.",
        en: "Look at the order of execution: what runs just before validation rules? And since you will read accounts, remember Module 4's recipe.",
      },
      {
        es: "before insert. Primer for: juntar AccountId de los que tienen String.isBlank(c.MailingCountry). Consulta con IN :accountIds a un Map. Segundo for: accounts.get(c.AccountId) y copiar.",
        en: "before insert. First for: gather AccountId of those with String.isBlank(c.MailingCountry). Query with IN :accountIds into a Map. Second for: accounts.get(c.AccountId) and copy.",
      },
      {
        es: "Pseudocódigo: trigger ContactCountry on Contact (before insert) { Set<Id> accountIds …; for (…) if (String.isBlank(c.MailingCountry) && c.AccountId != null) accountIds.add(c.AccountId); Map<Id, Account> accounts = new Map<Id, Account>([SELECT Id, BillingCountry FROM Account WHERE Id IN :accountIds]); for (…) { Account acc = accounts.get(c.AccountId); if (… && acc != null) c.MailingCountry = acc.BillingCountry; } }",
        en: "Pseudocode: trigger ContactCountry on Contact (before insert) { Set<Id> accountIds …; for (…) if (String.isBlank(c.MailingCountry) && c.AccountId != null) accountIds.add(c.AccountId); Map<Id, Account> accounts = new Map<Id, Account>([SELECT Id, BillingCountry FROM Account WHERE Id IN :accountIds]); for (…) { Account acc = accounts.get(c.AccountId); if (… && acc != null) c.MailingCountry = acc.BillingCountry; } }",
      },
    ],
    solution: {
      es: `trigger ContactCountry on Contact (before insert) {
    Set<Id> accountIds = new Set<Id>();
    for (Contact c : Trigger.new) {
        if (String.isBlank(c.MailingCountry) && c.AccountId != null) {
            accountIds.add(c.AccountId);
        }
    }

    Map<Id, Account> accounts = new Map<Id, Account>(
        [SELECT Id, BillingCountry FROM Account WHERE Id IN :accountIds]
    );

    for (Contact c : Trigger.new) {
        Account acc = accounts.get(c.AccountId);
        if (String.isBlank(c.MailingCountry) && acc != null) {
            c.MailingCountry = acc.BillingCountry;
        }
    }
}`,
      en: `trigger ContactCountry on Contact (before insert) {
    Set<Id> accountIds = new Set<Id>();
    for (Contact c : Trigger.new) {
        if (String.isBlank(c.MailingCountry) && c.AccountId != null) {
            accountIds.add(c.AccountId);
        }
    }

    Map<Id, Account> accounts = new Map<Id, Account>(
        [SELECT Id, BillingCountry FROM Account WHERE Id IN :accountIds]
    );

    for (Contact c : Trigger.new) {
        Account acc = accounts.get(c.AccountId);
        if (String.isBlank(c.MailingCountry) && acc != null) {
            c.MailingCountry = acc.BillingCountry;
        }
    }
}`,
    },
    checks: [
      {
        id: "m06-l04-c1",
        label: {
          es: "Trigger ContactCountry en before insert",
          en: "ContactCountry trigger on before insert",
        },
        rule: { op: "match", pattern: "trigger\\s+ContactCountry\\s+on\\s+Contact\\s*\\(\\s*before\\s+insert\\s*\\)" },
        onFail: {
          es: "Tiene que correr antes que las validation rules: trigger ContactCountry on Contact (before insert).",
          en: "It has to run before validation rules: trigger ContactCountry on Contact (before insert).",
        },
      },
      {
        id: "m06-l04-c2",
        label: {
          es: "Junta en accountIds las cuentas de los contactos sin país",
          en: "Gathers in accountIds the accounts of contacts with no country",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Set\\s*<\\s*Id\\s*>\\s+accountIds\\s*=\\s*new\\s+Set\\s*<\\s*Id\\s*>\\s*\\(\\s*\\)" },
            { op: "match", pattern: "accountIds\\.add\\(\\s*\\w+\\.AccountId\\s*\\)" },
            {
              op: "any",
              of: [
                { op: "match", pattern: "String\\.isBlank\\(\\s*\\w+\\.MailingCountry\\s*\\)" },
                { op: "match", pattern: "\\w+\\.MailingCountry\\s*==\\s*null" },
              ],
            },
          ],
        },
        onFail: {
          es: "for (Contact c : Trigger.new) { if (String.isBlank(c.MailingCountry) && c.AccountId != null) accountIds.add(c.AccountId); }",
          en: "for (Contact c : Trigger.new) { if (String.isBlank(c.MailingCountry) && c.AccountId != null) accountIds.add(c.AccountId); }",
        },
      },
      {
        id: "m06-l04-c3",
        label: {
          es: "Una sola consulta con IN :accountIds a un Map<Id, Account>",
          en: "A single query with IN :accountIds into a Map<Id, Account>",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Map\\s*<\\s*Id\\s*,\\s*Account\\s*>\\s+\\w+\\s*=\\s*new\\s+Map\\s*<\\s*Id\\s*,\\s*Account\\s*>\\s*\\(\\s*\\[" },
            { op: "match", pattern: "SELECT[^\\]]*\\bBillingCountry\\b[^\\]]*FROM\\s+Account\\s+WHERE\\s+Id\\s+IN\\s*:\\s*accountIds\\b" },
            { op: "count", pattern: "\\[\\s*SELECT\\b", min: 1, max: 1 },
            { op: "absent", pattern: "(for|while)\\s*\\([^)]*\\)\\s*\\{[^{}]*\\[\\s*SELECT\\b" },
          ],
        },
        onFail: {
          es: "new Map<Id, Account>([SELECT Id, BillingCountry FROM Account WHERE Id IN :accountIds]) — una vez, fuera de los bucles.",
          en: "new Map<Id, Account>([SELECT Id, BillingCountry FROM Account WHERE Id IN :accountIds]) — once, outside the loops.",
        },
      },
      {
        id: "m06-l04-c4",
        label: {
          es: "Copia BillingCountry en MailingCountry",
          en: "Copies BillingCountry into MailingCountry",
        },
        rule: { op: "match", pattern: "\\w+\\.MailingCountry\\s*=\\s*[\\w.()]*BillingCountry\\s*;" },
        onFail: {
          es: "c.MailingCountry = acc.BillingCountry; (con acc = accounts.get(c.AccountId)).",
          en: "c.MailingCountry = acc.BillingCountry; (with acc = accounts.get(c.AccountId)).",
        },
      },
      {
        id: "m06-l04-c5",
        label: {
          es: "Sin DML: en before el cambio se guarda solo",
          en: "No DML: in before the change saves by itself",
        },
        rule: { op: "absent", pattern: "\\b(update|insert|delete|upsert)\\s+[\\w.()]+\\s*;" },
        onFail: {
          es: "Quita el DML: en before insert, cambiar c.MailingCountry ya viaja con el registro.",
          en: "Remove the DML: in before insert, changing c.MailingCountry already travels with the record.",
        },
        onPass: {
          es: "Una consulta, cero DML y la validación ya ve el país. El orden de ejecución, trabajando a tu favor.",
          en: "One query, zero DML and validation already sees the country. The order of execution, working in your favour.",
        },
      },
      {
        id: "m06-l04-c6",
        label: {
          es: "No revienta si el contacto no tiene cuenta",
          en: "Does not blow up if the contact has no account",
        },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "\\w+\\s*!=\\s*null" },
            { op: "match", pattern: "\\?\\." },
            { op: "match", pattern: "containsKey\\(" },
          ],
        },
        optional: true,
        onFail: {
          es: "Un contacto sin cuenta no está en el mapa: get() devuelve null. Comprueba acc != null antes de leer acc.BillingCountry.",
          en: "A contact without an account is not in the map: get() returns null. Check acc != null before reading acc.BillingCountry.",
        },
      },
    ],
    rubric: [
      {
        es: "Si en vez de before insert lo hubieras escrito en after insert con un update, ¿llegaría a ejecutarse alguna vez con un contacto sin país? Piensa en qué paso lo rechazaría.",
        en: "If you had written it in after insert with an update instead of before insert, would it ever even run for a contact without a country? Think about which step would reject it.",
      },
    ],
  },
};
