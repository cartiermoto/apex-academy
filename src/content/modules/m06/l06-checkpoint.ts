import type { Lesson } from "@/lib/types";

export const l06Checkpoint: Lesson = {
  id: "m06-l06",
  slug: "checkpoint",
  n: 6,
  kind: "checkpoint",
  minutes: 45,
  title: {
    es: "Checkpoint del Módulo 6",
    en: "Module 6 checkpoint",
  },
  summary: {
    es: "Repaso del módulo, un trigger de escalado de casos que combina before, after y bulkificación, y tus primeros triggers de verdad en la Developer Org, incluida una recursión provocada a propósito.",
    en: "A module review, a case-escalation trigger combining before, after and bulkification, and your first real triggers in the Developer Org, including a recursion triggered on purpose.",
  },
  analogy: {
    es: "Pasar un Record-Triggered Flow a código y comprobar que se comporta igual",
    en: "Porting a record-triggered Flow to code and checking it behaves the same",
  },
  objectives: [
    {
      es: "Combinar before y after en un mismo trigger, cada lógica en su momento.",
      en: "Combine before and after in one trigger, each piece of logic at its moment.",
    },
    {
      es: "Escribir un trigger bulkificado que consulta una sola vez y guarda una sola vez.",
      en: "Write a bulkified trigger that queries once and saves once.",
    },
    {
      es: "Crear, probar, leer el log y borrar un trigger en una Developer Org.",
      en: "Create, test, read the log of and delete a trigger in a Developer Org.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Con este módulo tu código ha dejado de esperar a que lo ejecutes. Todo lo anterior —SOQL, DML, bulkificación, clases, static— servía para llegar aquí: código que reacciona solo, a cualquier volumen, dentro de la misma transacción que tus flows y tus reglas.",
        en: "With this module your code has stopped waiting for you to run it. Everything before — SOQL, DML, bulkification, classes, static — was building up to this: code that reacts by itself, at any volume, inside the same transaction as your flows and rules.",
      },
    },
    {
      type: "h",
      text: { es: "Lo que has aprendido, sub-lección a sub-lección", en: "What you learned, sub-lesson by sub-lesson" },
    },
    {
      type: "p",
      text: {
        es: "1 · Qué es un trigger. trigger Nombre on Objeto (eventos). Siete eventos, de los que after delete y after undelete no existen en Flow. Siempre llega una lista, Trigger.new, de 1 a 200 registros: nunca Trigger.new[0]. Varios triggers en el mismo objeto no tienen orden garantizado.",
        en: "1 · What a trigger is. trigger Name on Object (events). Seven events, of which after delete and after undelete do not exist in Flow. A list always arrives, Trigger.new, with 1 to 200 records: never Trigger.new[0]. Several triggers on the same object have no guaranteed order.",
      },
    },
    {
      type: "p",
      text: {
        es: "2 · Contexto. Trigger.new y Trigger.old son $Record y $Record__Prior en plural; newMap y oldMap, lo mismo por Id. No existen en todos los eventos: no hay old al crear, no hay new al borrar, no hay newMap en before insert. Para saber si algo cambió: Trigger.oldMap.get(r.Id).",
        en: "2 · Context. Trigger.new and Trigger.old are $Record and $Record__Prior, plural; newMap and oldMap, the same by Id. They do not exist in every event: no old on create, no new on delete, no newMap in before insert. To know whether something changed: Trigger.oldMap.get(r.Id).",
      },
    },
    {
      type: "p",
      text: {
        es: "3 · before vs after. before es «Fast Field Updates»: cambias el propio registro, sin DML. after es «Actions and Related Records»: ya hay Id, tocas otros registros con un DML, y Trigger.new es de solo lectura.",
        en: "3 · before vs after. before is “Fast Field Updates”: you change the record itself, no DML. after is “Actions and Related Records”: there is an Id, you touch other records with one DML, and Trigger.new is read-only.",
      },
    },
    {
      type: "p",
      text: {
        es: "4 · Orden de ejecución. Validación del sistema → flows before-save → triggers before → validation rules → duplicados → guardado → triggers after → asignación y workflow → flows after-save → roll-ups → commit → asíncrono. Un field update de workflow relanza los triggers de update.",
        en: "4 · Order of execution. System validation → before-save flows → before triggers → validation rules → duplicates → save → after triggers → assignment and workflow → after-save flows → roll-ups → commit → async. A workflow field update reruns the update triggers.",
      },
    },
    {
      type: "p",
      text: {
        es: "5 · Recursión. Un DML sobre el propio objeto vuelve a disparar el trigger, hasta «Maximum trigger depth exceeded» en el nivel 16. Defensas: no provocarla (before), actuar solo si algo cambió, y una guarda static Set<Id>, nunca un Boolean.",
        en: "5 · Recursion. A DML on the same object fires the trigger again, up to “Maximum trigger depth exceeded” at level 16. Defences: do not cause it (before), act only if something changed, and a static Set<Id> guard, never a Boolean.",
      },
    },
    {
      type: "diagram",
      id: "m06-cp-map",
      caption: {
        es: "Todo lo que ya sabías de Flow tiene su sitio en un trigger. Lo único nuevo es que la responsabilidad es tuya.",
        en: "Everything you already knew from Flow has its place in a trigger. The only new thing is that the responsibility is yours.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Flow o trigger?", en: "Flow or trigger?" },
      text: {
        es: "Que ya sepas escribir triggers no significa que todo deba ser un trigger. La recomendación de Salesforce es empezar por Flow y pasar a Apex cuando la lógica es compleja, necesita volumen o rendimiento que Flow no da, o tiene que convivir con otro código. En una org real, un buen developer que viene de Admin sabe elegir: esa es tu ventaja frente a quien solo conoce el código.",
        en: "Knowing how to write triggers does not mean everything should be a trigger. Salesforce's recommendation is to start with Flow and move to Apex when the logic is complex, needs volume or performance Flow does not give, or has to live alongside other code. In a real org, a good developer who comes from Admin knows how to choose: that is your edge over someone who only knows code.",
      },
    },
    {
      type: "h",
      text: { es: "Lo que viene: el Módulo 7", en: "What comes next: Module 7" },
    },
    {
      type: "p",
      text: {
        es: "Los triggers de este módulo tienen la lógica dentro. Funciona, pero con tres o cuatro necesidades por objeto se vuelve un archivo enorme, difícil de probar y de ordenar. El Módulo 7 enseña el patrón que usan las orgs profesionales: un solo trigger por objeto, vacío de lógica, que delega en una clase handler. Todo lo que has escrito aquí se mudará a esa clase.",
        en: "This module's triggers have the logic inside. It works, but with three or four needs per object it becomes a huge file, hard to test and to order. Module 7 teaches the pattern professional orgs use: a single trigger per object, empty of logic, that delegates to a handler class. Everything you wrote here will move into that class.",
      },
    },
    {
      type: "h",
      text: { es: "Ahora en tu Developer Org", en: "Now in your Developer Org" },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Solo en tu Developer Org", en: "Only in your Developer Org" },
      text: {
        es: "Un trigger se ejecuta para todos los usuarios, integraciones y cargas de la org. Practica en tu Developer Org o en un sandbox, nunca en producción, y bórralos al terminar.",
        en: "A trigger runs for every user, integration and load in the org. Practise in your Developer Org or a sandbox, never in production, and delete them when you finish.",
      },
    },
    {
      type: "list",
      ordered: true,
      items: [
        {
          es: "Developer Console → File → New → Apex Trigger. Nombre AccountOnboarding, objeto Account. Pega tu solución de la lección 3 y guarda.",
          en: "Developer Console → File → New → Apex Trigger. Name AccountOnboarding, object Account. Paste your lesson 3 solution and save.",
        },
        {
          es: "Crea una cuenta desde la interfaz sin Rating. Al guardar verás Rating = Warm y, en su related list de actividades, la tarea de bienvenida. Nadie ejecutó nada: lo hizo el trigger.",
          en: "Create an account from the UI with no Rating. On save you will see Rating = Warm and, in its activities related list, the welcome task. Nobody ran anything: the trigger did.",
        },
        {
          es: "Setup → Object Manager → Account → Triggers: ahí está. Justo al lado, Flow Triggers. Son los dos tipos de automatización del mismo objeto.",
          en: "Setup → Object Manager → Account → Triggers: there it is. Right next to it, Flow Triggers. They are the two kinds of automation for the same object.",
        },
        {
          es: "Con la Developer Console abierta, edita la cuenta y abre el log que aparece. Busca CODE_UNIT_STARTED: verás tu trigger, las validaciones y los workflows en el orden de la lección 4.",
          en: "With the Developer Console open, edit the account and open the log that appears. Search for CODE_UNIT_STARTED: you will see your trigger, the validations and the workflows in lesson 4's order.",
        },
        {
          es: "Provoca la recursión: crea el trigger OpportunityReview del ejercicio de la lección 5 en su versión sin guarda y edita una oportunidad. Lee el error: «Maximum trigger depth exceeded». La oportunidad no se guarda.",
          en: "Trigger the recursion: create lesson 5's OpportunityReview trigger in its unguarded version and edit an opportunity. Read the error: “Maximum trigger depth exceeded”. The opportunity is not saved.",
        },
        {
          es: "Crea la clase OpportunityTriggerGuard (Setup → Apex Classes → New), cambia el trigger por tu solución con guarda y vuelve a editar la oportunidad: ahora se guarda.",
          en: "Create the OpportunityTriggerGuard class (Setup → Apex Classes → New), replace the trigger with your guarded solution and edit the opportunity again: now it saves.",
        },
        {
          es: "Limpieza: abre cada trigger en la Developer Console y usa File → Delete, para que no interfieran con los módulos siguientes.",
          en: "Clean-up: open each trigger in the Developer Console and use File → Delete, so they do not interfere with the following modules.",
        },
      ],
    },
    {
      type: "h",
      text: { es: "El diccionario completo: de Flow a trigger", en: "The full dictionary: from Flow to trigger" },
    },
    {
      type: "table",
      head: [
        { es: "En un Record-Triggered Flow", en: "In a record-triggered flow" },
        { es: "En un trigger", en: "In a trigger" },
      ],
      rows: [
        [{ es: "Objeto del elemento Start", en: "The Start element's object" }, { es: "trigger X on Account", en: "trigger X on Account" }],
        [{ es: "«A record is created or updated»", en: "“A record is created or updated”" }, { es: "(… insert, … update)", en: "(… insert, … update)" }],
        [{ es: "Fast Field Updates", en: "Fast Field Updates" }, { es: "before", en: "before" }],
        [{ es: "Actions and Related Records", en: "Actions and Related Records" }, { es: "after", en: "after" }],
        [{ es: "$Record", en: "$Record" }, { es: "cada registro de Trigger.new", en: "each record in Trigger.new" }],
        [{ es: "$Record__Prior", en: "$Record__Prior" }, { es: "Trigger.oldMap.get(r.Id)", en: "Trigger.oldMap.get(r.Id)" }],
        [{ es: "«Only when a record is updated to meet…»", en: "“Only when a record is updated to meet…”" }, { es: "comparar old y new", en: "comparing old and new" }],
        [{ es: "Trigger Order en Flow Trigger Explorer", en: "Trigger Order in Flow Trigger Explorer" }, { es: "no existe: un solo trigger por objeto (Módulo 7)", en: "does not exist: one trigger per object (Module 7)" }],
        [{ es: "Get Records dentro de un Loop", en: "Get Records inside a Loop" }, { es: "consulta dentro de un bucle: el error del Módulo 4", en: "a query inside a loop: Module 4's mistake" }],
      ],
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Lo que no se traduce: el volumen", en: "What does not translate: volume" },
      text: {
        es: "La tabla engaña en una cosa: un flow piensa en un registro ($Record) y la plataforma lo agrupa por ti; un trigger piensa en una lista desde la primera línea. Esa es la verdadera diferencia de mentalidad, y la razón de que en todos los talleres del módulo el código tuviera que aguantar 200 registros a la vez.",
        en: "The table is misleading in one respect: a flow thinks about one record ($Record) and the platform batches it for you; a trigger thinks about a list from the very first line. That is the real mindset difference, and the reason every workshop in this module had to hold up with 200 records at once.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "En el libro, la lógica de la factura vive dentro del botón: btnAgregarActionPerformed consulta, calcula y pinta la tabla, todo junto. Es el mismo problema que tienen los triggers con la lógica dentro, y la misma solución que el libro esboza con sus tres capas (datos, negocio, presentación): separar. El Módulo 7 es esa idea aplicada a los triggers.",
        en: "In the book, the invoice logic lives inside the button: btnAgregarActionPerformed queries, calculates and draws the table, all together. It is the same problem triggers with logic inside have, and the same fix the book sketches with its three layers (data, business, presentation): separate. Module 7 is that idea applied to triggers.",
      },
    },
  ],

  quiz: [
    {
      id: "m06-l06-q1",
      kind: "single",
      prompt: {
        es: "Cuando se crea un caso de una cuenta Hot, su prioridad debe ser High y su propietario debe recibir una tarea. ¿Cómo lo repartes?",
        en: "When a case is created for a Hot account, its priority must be High and its owner must get a task. How do you split it?",
      },
      options: [
        {
          es: "Prioridad en before insert (sin DML); tarea en after insert (con un insert).",
          en: "Priority in before insert (no DML); task in after insert (with one insert).",
        },
        {
          es: "Las dos cosas en after insert, con un update de los casos y un insert de tareas.",
          en: "Both in after insert, with an update of the cases and an insert of tasks.",
        },
        {
          es: "Las dos en before insert.",
          en: "Both in before insert.",
        },
      ],
      answer: 0,
      explain: {
        es: "La prioridad es del propio caso: before, gratis. La tarea necesita el Id del caso: after. Hacerlo todo en after funciona, pero guarda dos veces y abre la puerta a la recursión; hacerlo todo en before crearía tareas sin WhatId.",
        en: "The priority belongs to the case itself: before, for free. The task needs the case's Id: after. Doing it all in after works, but saves twice and opens the door to recursion; doing it all in before would create tasks without a WhatId.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m06-l06-q2",
      kind: "multi",
      prompt: {
        es: "Este trigger tiene varios problemas. Márcalos.",
        en: "This trigger has several problems. Tick them.",
      },
      code: {
        es: `trigger CaseTrigger on Case (after insert) {
    Case c = Trigger.new[0];
    Account a = [SELECT Rating FROM Account WHERE Id = :c.AccountId];
    c.Priority = a.Rating == 'Hot' ? 'High' : 'Medium';
}`,
        en: `trigger CaseTrigger on Case (after insert) {
    Case c = Trigger.new[0];
    Account a = [SELECT Rating FROM Account WHERE Id = :c.AccountId];
    c.Priority = a.Rating == 'Hot' ? 'High' : 'Medium';
}`,
      },
      options: [
        { es: "Solo procesa el primer caso del lote.", en: "It only processes the first case in the batch." },
        { es: "En after, cambiar c.Priority lanza Record is read-only.", en: "In after, changing c.Priority throws Record is read-only." },
        { es: "Si el caso no tiene cuenta, la consulta lanza List has no rows.", en: "If the case has no account, the query throws List has no rows." },
        { es: "Falta un insert al final.", en: "An insert is missing at the end." },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Tres errores de tres lecciones distintas: [0] (L1), cambiar Trigger.new en after (L2-L3) y asignar una consulta a un solo registro (M3). La versión buena es before insert, bulkificada y con un Map.",
        en: "Three mistakes from three different lessons: [0] (L1), changing Trigger.new in after (L2-L3) and assigning a query to a single record (M3). The good version is before insert, bulkified, with a Map.",
      },
      tags: ["find-error", "interleaving", "spaced"],
      from: { es: "Repaso · M3 L1", en: "Review · M3 L1" },
    },
    {
      id: "m06-l06-q3",
      kind: "single",
      prompt: {
        es: "¿Qué variable de contexto NO existe en un trigger after insert?",
        en: "Which context variable does NOT exist in an after insert trigger?",
      },
      options: [
        { es: "Trigger.oldMap", en: "Trigger.oldMap" },
        { es: "Trigger.newMap", en: "Trigger.newMap" },
        { es: "Trigger.new", en: "Trigger.new" },
        { es: "Trigger.isAfter", en: "Trigger.isAfter" },
      ],
      answer: 0,
      explain: {
        es: "Al crear no hay versión anterior: ni old ni oldMap. newMap sí existe en after insert, porque ya hay Ids.",
        en: "On create there is no previous version: neither old nor oldMap. newMap does exist in after insert, because there are Ids.",
      },
      tags: ["recall"],
    },
    {
      id: "m06-l06-q4",
      kind: "single",
      prompt: {
        es: "¿Qué corre justo después de tus triggers before?",
        en: "What runs right after your before triggers?",
      },
      options: [
        { es: "Las validation rules personalizadas", en: "Custom validation rules" },
        { es: "Los triggers after", en: "After triggers" },
        { es: "Los flows after-save", en: "After-save flows" },
        { es: "El commit", en: "The commit" },
      ],
      answer: 0,
      explain: {
        es: "Por eso un trigger before puede rellenar lo que una regla de validación exige.",
        en: "That is why a before trigger can fill in what a validation rule requires.",
      },
      tags: ["recall"],
    },
    {
      id: "m06-l06-q5",
      kind: "single",
      prompt: {
        es: "Con 200 casos, ¿cuántas consultas y cuántos DML gasta la solución del ejercicio de este checkpoint?",
        en: "With 200 cases, how many queries and how many DML does this checkpoint's exercise solution spend?",
      },
      options: [
        {
          es: "1 consulta (en before) y 1 DML (el insert de tareas, en after).",
          en: "1 query (in before) and 1 DML (the task insert, in after).",
        },
        { es: "200 consultas y 200 DML.", en: "200 queries and 200 DML." },
        { es: "1 consulta y 2 DML (update de casos e insert de tareas).", en: "1 query and 2 DML (case update and task insert)." },
      ],
      answer: 0,
      explain: {
        es: "La prioridad se guarda sola en before: no hay update de casos. Una consulta con IN para las cuentas y un insert para todas las tareas.",
        en: "The priority saves by itself in before: there is no case update. One query with IN for the accounts and one insert for all the tasks.",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M4 L4", en: "Review · M4 L4" },
    },
    {
      id: "m06-l06-q6",
      kind: "single",
      prompt: {
        es: "Un after update de Account actualiza sus oportunidades, y un after update de Opportunity actualiza su cuenta. ¿Cuál es la MEJOR protección?",
        en: "An Account after update updates its opportunities, and an Opportunity after update updates its account. What is the BEST protection?",
      },
      options: [
        {
          es: "Actuar solo si cambió el campo que importa y una guarda static Set<Id> en cada lado.",
          en: "Act only if the field that matters changed, plus a static Set<Id> guard on each side.",
        },
        {
          es: "Un static Boolean hasRun en cada lado.",
          en: "A static Boolean hasRun on each side.",
        },
        {
          es: "Un try/catch alrededor del update.",
          en: "A try/catch around the update.",
        },
      ],
      answer: 0,
      explain: {
        es: "El Boolean se salta lotes; el try/catch no evita el bucle y Maximum trigger depth exceeded tampoco se arregla capturándolo. Comparar y apuntar Ids corta el ping-pong sin perder registros.",
        en: "The Boolean skips batches; the try/catch does not prevent the loop, and Maximum trigger depth exceeded is not fixed by catching it either. Comparing and noting Ids stops the ping-pong without losing records.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m06-l06-q7",
      kind: "single",
      prompt: {
        es: "En tu Developer Org, ¿dónde ves juntos los triggers y los flows de un mismo objeto?",
        en: "In your Developer Org, where do you see an object's triggers and flows together?",
      },
      options: [
        {
          es: "Setup → Object Manager → el objeto: Triggers y Flow Triggers, uno al lado del otro.",
          en: "Setup → Object Manager → the object: Triggers and Flow Triggers, side by side.",
        },
        { es: "Setup → Apex Classes", en: "Setup → Apex Classes" },
        { es: "En el Query Editor", en: "In the Query Editor" },
      ],
      answer: 0,
      explain: {
        es: "Son las dos formas de automatizar el mismo objeto, y por eso Object Manager las pone juntas.",
        en: "They are the two ways to automate the same object, which is why Object Manager puts them together.",
      },
      tags: ["recall"],
    },
    {
      id: "m06-l06-q8",
      kind: "text",
      prompt: {
        es: "¿Qué palabra usas dentro de un for para saltar al siguiente registro sin procesar el actual (la usa la guarda de recursión)?",
        en: "Which word do you use inside a for to jump to the next record without processing the current one (the recursion guard uses it)?",
      },
      accept: ["\\s*continue\\s*;?\\s*"],
      placeholder: { es: "palabra clave", en: "keyword" },
      explain: {
        es: "continue, del Módulo 2. break saldría del bucle entero y dejaría sin procesar el resto del lote.",
        en: "continue, from Module 2. break would leave the whole loop and skip the rest of the batch.",
      },
      tags: ["spaced", "recall"],
      from: { es: "Repaso · M2 L6", en: "Review · M2 L6" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 6 DE 6 · La entrega: el último y más importante de los flows, el escalado de casos de Soporte. Soporte quiere automatizar el escalado: cuando se crea un caso de una cuenta con Rating 'Hot', su prioridad pasa a 'High' y su propietario recibe una tarea para revisarlo hoy. Tiene que aguantar la carga de 200 casos que llega cada mañana desde el sistema de tickets.",
      en: "TASK 6 OF 6 · Delivery: the last and most important flow, Support's case escalation. Support wants to automate escalation: when a case is created for an account rated 'Hot', its priority becomes 'High' and its owner gets a task to review it today. It has to withstand the 200-case load that arrives every morning from the ticketing system.",
    },
    brief: [
      {
        es: "Un trigger CaseEscalation sobre Case, en before insert y after insert.",
        en: "A trigger CaseEscalation on Case, on before insert and after insert.",
      },
      {
        es: "Parte before: junta los AccountId en un Set, trae las cuentas Hot con una sola consulta a un Map<Id, Account> hotAccounts, y pon Priority = 'High' a los casos de esas cuentas. Sin DML.",
        en: "Before part: gather the AccountIds in a Set, fetch the Hot accounts with a single query into a Map<Id, Account> hotAccounts, and set Priority = 'High' on those accounts' cases. No DML.",
      },
      {
        es: "Parte after: para cada caso con Priority 'High', una Task con WhatId = el caso, OwnerId = el propietario del caso, Subject y ActivityDate hoy.",
        en: "After part: for each case with Priority 'High', a Task with WhatId = the case, OwnerId = the case owner, Subject and ActivityDate today.",
      },
      {
        es: "Las tareas, con un solo insert. Nada de base de datos dentro de los bucles.",
        en: "The tasks, with a single insert. Nothing touching the database inside loops.",
      },
    ],
    starter: {
      es: `// CASO: la migración de flows a Apex de Northwind
// Tarea 6 de 6: el escalado de casos de Soporte, que el Módulo 7 heredará.

trigger CaseEscalation on Case (before insert, after insert) {
    // before: prioridad según la cuenta

    // after: tareas para los casos escalados
}
`,
      en: `// CASE: Northwind's flow-to-Apex migration
// Task 6 of 6: Support's case escalation, which Module 7 will inherit.

trigger CaseEscalation on Case (before insert, after insert) {
    // before: priority based on the account

    // after: tasks for the escalated cases
}
`,
    },
    hints: [
      {
        es: "Dos ramas (isBefore / isAfter). La primera es la lección 4 (consulta al padre en before); la segunda, la lección 3 (hijos en after).",
        en: "Two branches (isBefore / isAfter). The first is lesson 4 (querying the parent in before); the second, lesson 3 (children in after).",
      },
      {
        es: "En before: Set<Id> accountIds, luego new Map<Id, Account>([SELECT Id FROM Account WHERE Id IN :accountIds AND Rating = 'Hot']) y hotAccounts.containsKey(c.AccountId). En after: if (c.Priority == 'High') tasks.add(…).",
        en: "In before: Set<Id> accountIds, then new Map<Id, Account>([SELECT Id FROM Account WHERE Id IN :accountIds AND Rating = 'Hot']) and hotAccounts.containsKey(c.AccountId). In after: if (c.Priority == 'High') tasks.add(…).",
      },
      {
        es: "Pseudocódigo: if (Trigger.isBefore) { …Set… Map<Id, Account> hotAccounts = …; for (Case c : Trigger.new) if (hotAccounts.containsKey(c.AccountId)) c.Priority = 'High'; } if (Trigger.isAfter) { List<Task> tasks = …; for (…) if (c.Priority == 'High') tasks.add(new Task(WhatId = c.Id, OwnerId = c.OwnerId, Subject = …, ActivityDate = Date.today())); insert tasks; }",
        en: "Pseudocode: if (Trigger.isBefore) { …Set… Map<Id, Account> hotAccounts = …; for (Case c : Trigger.new) if (hotAccounts.containsKey(c.AccountId)) c.Priority = 'High'; } if (Trigger.isAfter) { List<Task> tasks = …; for (…) if (c.Priority == 'High') tasks.add(new Task(WhatId = c.Id, OwnerId = c.OwnerId, Subject = …, ActivityDate = Date.today())); insert tasks; }",
      },
    ],
    solution: {
      es: `trigger CaseEscalation on Case (before insert, after insert) {
    // before: prioridad según la cuenta
    if (Trigger.isBefore) {
        Set<Id> accountIds = new Set<Id>();
        for (Case c : Trigger.new) {
            if (c.AccountId != null) {
                accountIds.add(c.AccountId);
            }
        }

        Map<Id, Account> hotAccounts = new Map<Id, Account>(
            [SELECT Id FROM Account WHERE Id IN :accountIds AND Rating = 'Hot']
        );

        for (Case c : Trigger.new) {
            if (hotAccounts.containsKey(c.AccountId)) {
                c.Priority = 'High';
            }
        }
    }

    // after: tareas para los casos escalados
    if (Trigger.isAfter) {
        List<Task> tasks = new List<Task>();
        for (Case c : Trigger.new) {
            if (c.Priority == 'High') {
                tasks.add(new Task(
                    WhatId = c.Id,
                    OwnerId = c.OwnerId,
                    Subject = 'Revisar caso escalado',
                    ActivityDate = Date.today()
                ));
            }
        }
        insert tasks;
    }
}`,
      en: `trigger CaseEscalation on Case (before insert, after insert) {
    // before: priority based on the account
    if (Trigger.isBefore) {
        Set<Id> accountIds = new Set<Id>();
        for (Case c : Trigger.new) {
            if (c.AccountId != null) {
                accountIds.add(c.AccountId);
            }
        }

        Map<Id, Account> hotAccounts = new Map<Id, Account>(
            [SELECT Id FROM Account WHERE Id IN :accountIds AND Rating = 'Hot']
        );

        for (Case c : Trigger.new) {
            if (hotAccounts.containsKey(c.AccountId)) {
                c.Priority = 'High';
            }
        }
    }

    // after: tasks for the escalated cases
    if (Trigger.isAfter) {
        List<Task> tasks = new List<Task>();
        for (Case c : Trigger.new) {
            if (c.Priority == 'High') {
                tasks.add(new Task(
                    WhatId = c.Id,
                    OwnerId = c.OwnerId,
                    Subject = 'Review escalated case',
                    ActivityDate = Date.today()
                ));
            }
        }
        insert tasks;
    }
}`,
    },
    checks: [
      {
        id: "m06-l06-c1",
        label: {
          es: "Trigger CaseEscalation en before insert y after insert, con dos ramas",
          en: "CaseEscalation trigger on before insert and after insert, with two branches",
        },
        rule: {
          op: "all",
          of: [
            {
              op: "any",
              of: [
                { op: "match", pattern: "trigger\\s+CaseEscalation\\s+on\\s+Case\\s*\\(\\s*before\\s+insert\\s*,\\s*after\\s+insert\\s*\\)" },
                { op: "match", pattern: "trigger\\s+CaseEscalation\\s+on\\s+Case\\s*\\(\\s*after\\s+insert\\s*,\\s*before\\s+insert\\s*\\)" },
              ],
            },
            { op: "match", pattern: "if\\s*\\(\\s*Trigger\\.isBefore\\b" },
            { op: "match", pattern: "if\\s*\\(\\s*Trigger\\.isAfter\\b" },
          ],
        },
        onFail: {
          es: "trigger CaseEscalation on Case (before insert, after insert) con if (Trigger.isBefore) { … } y if (Trigger.isAfter) { … }",
          en: "trigger CaseEscalation on Case (before insert, after insert) with if (Trigger.isBefore) { … } and if (Trigger.isAfter) { … }",
        },
      },
      {
        id: "m06-l06-c2",
        label: {
          es: "Una sola consulta de cuentas Hot con IN, a un Map",
          en: "A single query of Hot accounts with IN, into a Map",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Set\\s*<\\s*Id\\s*>\\s+accountIds\\b" },
            { op: "match", pattern: "accountIds\\.add\\(\\s*\\w+\\.AccountId\\s*\\)" },
            { op: "match", pattern: "Map\\s*<\\s*Id\\s*,\\s*Account\\s*>\\s+hotAccounts\\s*=\\s*new\\s+Map\\s*<\\s*Id\\s*,\\s*Account\\s*>\\s*\\(\\s*\\[" },
            { op: "match", pattern: "Id\\s+IN\\s*:\\s*accountIds[^\\]]*Rating\\s*=\\s*'Hot'|Rating\\s*=\\s*'Hot'[^\\]]*Id\\s+IN\\s*:\\s*accountIds" },
            { op: "count", pattern: "\\[\\s*SELECT\\b", min: 1, max: 1 },
          ],
        },
        onFail: {
          es: "new Map<Id, Account>([SELECT Id FROM Account WHERE Id IN :accountIds AND Rating = 'Hot']) — una sola consulta.",
          en: "new Map<Id, Account>([SELECT Id FROM Account WHERE Id IN :accountIds AND Rating = 'Hot']) — a single query.",
        },
      },
      {
        id: "m06-l06-c3",
        label: {
          es: "Los casos de cuentas Hot pasan a High, sin DML",
          en: "Hot accounts' cases become High, with no DML",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "hotAccounts\\.(containsKey|get)\\(\\s*\\w+\\.AccountId\\s*\\)" },
            { op: "match", pattern: "\\w+\\.Priority\\s*=\\s*'High'\\s*;" },
            { op: "absent", pattern: "\\bupdate\\s+[\\w.()]+\\s*;" },
          ],
        },
        onFail: {
          es: "if (hotAccounts.containsKey(c.AccountId)) { c.Priority = 'High'; } — en before, sin update.",
          en: "if (hotAccounts.containsKey(c.AccountId)) { c.Priority = 'High'; } — in before, no update.",
        },
      },
      {
        id: "m06-l06-c4",
        label: {
          es: "En after: tarea para los casos High, con el Id y el propietario del caso",
          en: "In after: a task for High cases, with the case's Id and owner",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "\\w+\\.Priority\\s*==\\s*'High'" },
            { op: "match", pattern: "new\\s+Task\\([^;]*WhatId\\s*=\\s*\\w+\\.Id\\b" },
            { op: "match", pattern: "new\\s+Task\\([^;]*OwnerId\\s*=\\s*\\w+\\.OwnerId\\b" },
            { op: "match", pattern: "new\\s+Task\\([^;]*ActivityDate\\s*=\\s*Date\\.today\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "if (c.Priority == 'High') { tasks.add(new Task(WhatId = c.Id, OwnerId = c.OwnerId, Subject = …, ActivityDate = Date.today())); }",
          en: "if (c.Priority == 'High') { tasks.add(new Task(WhatId = c.Id, OwnerId = c.OwnerId, Subject = …, ActivityDate = Date.today())); }",
        },
      },
      {
        id: "m06-l06-c5",
        label: {
          es: "Bulkificado: nada de base de datos en bucles y un solo insert",
          en: "Bulkified: no database work in loops and a single insert",
        },
        rule: {
          op: "all",
          of: [
            { op: "absent", pattern: "(for|while)\\s*\\([^)]*\\)\\s*\\{[^{}]*\\[\\s*SELECT\\b" },
            { op: "absent", pattern: "(for|while)\\s*\\([^)]*\\)\\s*\\{[^{}]*\\b(insert|update|delete|upsert)\\s+[\\w.()]+\\s*;" },
            { op: "count", pattern: "\\binsert\\s+\\w+\\s*;", min: 1, max: 1 },
            { op: "absent", pattern: "Trigger\\.new\\s*\\[\\s*\\d+\\s*\\]" },
          ],
        },
        onFail: {
          es: "Ninguna consulta ni DML dentro de un for, ni Trigger.new[0]. Un único insert tasks; al final de la rama after.",
          en: "No query or DML inside a for, and no Trigger.new[0]. A single insert tasks; at the end of the after branch.",
        },
        onPass: {
          es: "1 consulta y 1 DML, sean 3 casos o 200. Tu primer trigger listo para producción; en el Módulo 7 lo mudarás a un handler.",
          en: "1 query and 1 DML, whether 3 cases or 200. Your first production-ready trigger; in Module 7 you will move it into a handler.",
        },
      },
    ],
    rubric: [
      {
        es: "Si mañana piden lo mismo también al editar un caso (update), ¿qué eventos añades y qué comparación con Trigger.oldMap necesitarías para no crear una tarea nueva en cada edición?",
        en: "If tomorrow they want the same on case edits (update), which events do you add and which Trigger.oldMap comparison would you need to avoid a new task on every edit?",
      },
    ],
  },
};
