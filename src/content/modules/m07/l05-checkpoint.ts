import type { Lesson } from "@/lib/types";

/** Task 4's solution: the starting point of the delivery. */
const FROM_TASK4 = `trigger CaseTrigger on Case (before insert, after insert, after update) {
    if (FeatureManagement.checkPermission('Bypass_Case_Triggers')) {
        return;
    }
    CaseTriggerHandler handler = new CaseTriggerHandler();
    switch on Trigger.operationType {
        when BEFORE_INSERT {
            handler.beforeInsert(Trigger.new);
        }
        when AFTER_INSERT {
            handler.afterInsert(Trigger.new);
        }
        when AFTER_UPDATE {
            handler.afterUpdate(Trigger.new, Trigger.oldMap);
        }
    }
}

// ---- CaseTriggerHandler.cls ----
public with sharing class CaseTriggerHandler {

    public void beforeInsert(List<Case> newCases) {
        CaseEscalationService.applyPriorityRules(newCases);
    }

    public void afterInsert(List<Case> newCases) {
        CaseEscalationService.createReviewTasks(newCases);
    }

    public void afterUpdate(List<Case> newCases, Map<Id, Case> oldMap) {
        CaseEscalationService.createTasksForEscalated(newCases, oldMap);
    }
}

// ---- CaseEscalationService.cls ----
public with sharing class CaseEscalationService {

    private static Set<Id> tasksCreatedFor = new Set<Id>();

    public static void applyPriorityRules(List<Case> cases) {
        for (Case c : cases) {
            if (c.Origin == 'Web') {
                c.Priority = 'Low';
            }
        }
        Set<Id> accountIds = new Set<Id>();
        for (Case c : cases) {
            if (c.AccountId != null) {
                accountIds.add(c.AccountId);
            }
        }
        Map<Id, Account> hotAccounts = new Map<Id, Account>(
            [SELECT Id FROM Account WHERE Id IN :accountIds AND Rating = 'Hot']
        );
        for (Case c : cases) {
            if (hotAccounts.containsKey(c.AccountId)) {
                c.Priority = 'High';
            }
        }
    }

    public static void createReviewTasks(List<Case> cases) {
        List<Task> tasks = new List<Task>();
        for (Case c : cases) {
            if (c.Priority == 'High' && !tasksCreatedFor.contains(c.Id)) {
                tasksCreatedFor.add(c.Id);
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

    public static void createTasksForEscalated(List<Case> cases, Map<Id, Case> oldMap) {
        List<Case> escalated = new List<Case>();
        for (Case c : cases) {
            if (c.Priority == 'High' && oldMap.get(c.Id).Priority != 'High') {
                escalated.add(c);
            }
        }
        createReviewTasks(escalated);
    }
}

// ---- CaseActions.cls ----
public with sharing class CaseActions {

    public static void recalculatePriority(Set<Id> caseIds) {
        List<Case> cases = [
            SELECT Id, Origin, AccountId, Priority
            FROM Case
            WHERE Id IN :caseIds
        ];
        CaseEscalationService.applyPriorityRules(cases);
        update cases;
    }
}`;

const HANDOFF = `

// ---- CaseHandoffService.cls ----
public with sharing class CaseHandoffService {

    // Guardia: casos cuyo aviso a Ventas ya se creó en ESTA transacción
    private static Set<Id> followUpsCreatedFor = new Set<Id>();

    public static void createSalesFollowUps(List<Case> cases, Map<Id, Case> oldMap) {
        // 1 · Qué casos cuentan: urgentes, con cuenta, que ACABAN de cerrarse
        List<Case> justClosed = new List<Case>();
        Set<Id> accountIds = new Set<Id>();
        for (Case c : cases) {
            Boolean closedNow = c.IsClosed && !oldMap.get(c.Id).IsClosed;
            if (closedNow && c.Priority == 'High' && c.AccountId != null
                    && !followUpsCreatedFor.contains(c.Id)) {
                justClosed.add(c);
                accountIds.add(c.AccountId);
            }
        }

        // 2 · Una sola consulta para saber el comercial de cada cuenta
        Map<Id, Account> accounts = new Map<Id, Account>(
            [SELECT Id, OwnerId FROM Account WHERE Id IN :accountIds]
        );

        // 3 · Una tarea por caso para el propietario de la CUENTA
        List<Task> followUps = new List<Task>();
        for (Case c : justClosed) {
            followUpsCreatedFor.add(c.Id);
            followUps.add(new Task(
                WhatId = c.AccountId,
                OwnerId = accounts.get(c.AccountId).OwnerId,
                Subject = 'Seguimiento: se cerró un caso urgente',
                ActivityDate = Date.today().addDays(1)
            ));
        }
        insert followUps;
    }
}`;

const SOLUTION = FROM_TASK4.replace(
  "        CaseEscalationService.createTasksForEscalated(newCases, oldMap);\n    }",
  "        CaseEscalationService.createTasksForEscalated(newCases, oldMap);\n        CaseHandoffService.createSalesFollowUps(newCases, oldMap);\n    }",
) + HANDOFF;

const SOLUTION_EN = SOLUTION.replace(
  "// Guardia: casos cuyo aviso a Ventas ya se creó en ESTA transacción",
  "// Guard: cases whose Sales follow-up was already created in THIS transaction",
)
  .replace("// 1 · Qué casos cuentan: urgentes, con cuenta, que ACABAN de cerrarse", "// 1 · Which cases count: urgent, with an account, JUST closed")
  .replace("// 2 · Una sola consulta para saber el comercial de cada cuenta", "// 2 · One single query to find each account's rep")
  .replace("// 3 · Una tarea por caso para el propietario de la CUENTA", "// 3 · One task per case for the ACCOUNT's owner")
  .replace("'Seguimiento: se cerró un caso urgente'", "'Follow-up: an urgent case was closed'");

const TAIL_ES = `

// ---- CaseHandoffService.cls ----
// La regla nueva de Ventas, aquí.
`;
const TAIL_EN = `

// ---- CaseHandoffService.cls ----
// Sales' new rule, here.
`;

export const l05Checkpoint: Lesson = {
  id: "m07-l05",
  slug: "checkpoint",
  n: 5,
  kind: "checkpoint",
  minutes: 45,
  title: { es: "Checkpoint del Módulo 7", en: "Module 7 checkpoint" },
  summary: {
    es: "La prueba de que la arquitectura sirve: llega una regla nueva y entra sin tocar el trigger, con su propio servicio, su guardia y el interruptor que ya existía.",
    en: "The proof the architecture works: a new rule arrives and goes in without touching the trigger, with its own service, its own guard and the switch that already existed.",
  },
  analogy: {
    es: "Añadir un subflow nuevo a un flow bien diseñado, sin reabrir el resto",
    en: "Adding a new subflow to a well-designed flow, without reopening the rest",
  },
  objectives: [
    {
      es: "Explicar qué hace cada capa: trigger, handler, servicio, guardia e interruptor.",
      en: "Explain what each layer does: trigger, handler, service, guard and switch.",
    },
    {
      es: "Añadir una regla de negocio nueva sin modificar el trigger.",
      en: "Add a new business rule without modifying the trigger.",
    },
    {
      es: "Decidir cuándo una regla merece su propio servicio.",
      en: "Decide when a rule deserves its own service.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Las cuatro tareas anteriores no añadieron ni una sola funcionalidad que Soporte pudiera ver: ordenaron. Esta es la tarea en la que se cobra ese trabajo. Llega una regla nueva, y la diferencia entre una org ordenada y una que no lo está es cuánto hay que tocar para meterla.",
        en: "The four previous tasks did not add a single feature Support could see: they put things in order. This is the task where that work pays off. A new rule arrives, and the difference between an orderly org and one that is not is how much you have to touch to add it.",
      },
    },
    {
      type: "h",
      text: { es: "Lo que has construido, capa por capa", en: "What you built, layer by layer" },
    },
    {
      type: "p",
      text: {
        es: "1 · Un trigger por objeto. Como en Flow Trigger Explorer pero sin campo de orden: la única manera de controlar el orden es que no haya dos. Dentro, switch on Trigger.operationType decide el evento y nada más. Importa porque dos triggers «que funcionan» dan resultados distintos según el día.",
        en: "1 · One trigger per object. Like Flow Trigger Explorer but without an order field: the only way to control the order is not to have two. Inside, switch on Trigger.operationType picks the event and nothing else. It matters because two triggers that “work” give different results depending on the day.",
      },
    },
    {
      type: "p",
      text: {
        es: "2 · El handler. El trigger es el Start del flow; el handler, el lienzo. Un método por evento, que recibe Trigger.new por parámetro para no depender del contexto. Importa porque el trigger cabe en una pantalla aunque el objeto tenga veinte reglas.",
        en: "2 · The handler. The trigger is the flow's Start; the handler, the canvas. One method per event, receiving Trigger.new as a parameter so it does not depend on the context. It matters because the trigger fits on one screen even if the object has twenty rules.",
      },
    },
    {
      type: "p",
      text: {
        es: "3 · El servicio. El subflow de Apex: métodos static que reciben listas y no saben nada de triggers, así que el trigger, un botón o un proceso nocturno los llaman igual. Cambia los registros; guardar es cosa de quien lo llama. Importa porque una regla que cambia se cambia en un solo sitio.",
        en: "3 · The service. Apex's subflow: static methods that take lists and know nothing about triggers, so the trigger, a button or a nightly job call them the same way. It changes records; saving is the caller's job. It matters because a rule that changes is changed in one place.",
      },
    },
    {
      type: "p",
      text: {
        es: "4 · La guardia y el interruptor. Un static Set<Id> en el servicio impide hacer dos veces lo mismo en una transacción, incluso cuando una regla de workflow vuelve a disparar el trigger con el Trigger.old de antes. Y un permiso personalizado apaga todas las reglas para quien hace una migración, igual que tu NOT($Permission.Bypass…) en las reglas de validación.",
        en: "4 · The guard and the switch. A static Set<Id> in the service stops the same thing happening twice in a transaction, even when a workflow rule fires the trigger again with the old Trigger.old. And a custom permission turns every rule off for whoever runs a migration, just like your NOT($Permission.Bypass…) in validation rules.",
      },
    },
    {
      type: "diagram",
      id: "m07-architecture",
      caption: {
        es: "Pruébate: ¿en qué capa va cada cosa?",
        en: "Test yourself: which layer does each thing go in?",
      },
    },
    {
      type: "h",
      text: { es: "La regla nueva: el traspaso de Soporte a Ventas", en: "The new rule: the handoff from Support to Sales" },
    },
    {
      type: "p",
      text: {
        es: "Ventas se queja de que se entera tarde de los problemas de sus clientes. La regla: cuando se CIERRA un caso de prioridad 'High' de una cuenta, el propietario de esa cuenta —el comercial, no el agente— recibe una tarea de seguimiento para el día siguiente. Fíjate en tres decisiones antes de escribir nada.",
        en: "Sales complains it finds out about its customers' problems too late. The rule: when a 'High' priority case of an account is CLOSED, that account's owner — the sales rep, not the agent — gets a follow-up task for the next day. Notice three decisions before writing anything.",
      },
    },
    {
      type: "list",
      items: [
        {
          es: "¿Qué evento? «Cuando se cierra» es un cambio sobre un registro que ya existe: after update, comparando IsClosed nuevo con el de oldMap. El trigger ya escucha after update: no se toca.",
          en: "Which event? “When it closes” is a change on an existing record: after update, comparing the new IsClosed with oldMap's. The trigger already listens to after update: it stays untouched.",
        },
        {
          es: "¿En qué servicio? Es una regla de Ventas, no de escalado. Meterla en CaseEscalationService mezclaría dos negocios; merece su propia clase, CaseHandoffService. El handler solo añade una línea.",
          en: "Which service? It is a Sales rule, not an escalation one. Putting it in CaseEscalationService would mix two businesses; it deserves its own class, CaseHandoffService. The handler just gains one line.",
        },
        {
          es: "¿Qué protecciones? Su propia guardia (la de tasksCreatedFor es de otra regla) y el interruptor… que ya existe arriba del trigger y la cubre sin hacer nada.",
          en: "Which protections? Its own guard (tasksCreatedFor belongs to another rule) and the switch… which already exists at the top of the trigger and covers it for free.",
        },
      ],
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El propietario de la cuenta, no el del caso", en: "The account's owner, not the case's" },
      text: {
        es: "El caso tiene su propietario —el agente o la cola— y la cuenta, el suyo —el comercial—. Para llegar al segundo hay que subir del caso a la cuenta: una consulta con los AccountId de todos los casos, como en el Módulo 3, y un Map para encontrar cada uno sin recorrer nada. En Flow habría sido un Get Records; aquí, uno para todos los casos a la vez.",
        en: "The case has its owner — the agent or the queue — and the account has its own — the sales rep. To reach the second you go up from the case to the account: one query with every case's AccountId, as in Module 3, and a Map to find each one without scanning. In Flow it would have been a Get Records; here, one for all the cases at once.",
      },
    },
    {
      type: "h",
      text: { es: "Lo que viene: el Módulo 8", en: "What comes next: Module 8" },
    },
    {
      type: "p",
      text: {
        es: "Todo este módulo ha supuesto que las cosas salen bien. ¿Y si el comercial de una cuenta está inactivo y la tarea no se puede asignar? ¿Y si Soporte quiere impedir cerrar un caso sin una solución escrita, con un mensaje en pantalla como una regla de validación? Eso son excepciones y addError, y es el Módulo 8.",
        en: "This whole module has assumed things go right. What if an account's rep is inactive and the task cannot be assigned? What if Support wants to stop a case being closed without a written solution, with an on-screen message like a validation rule? That is exceptions and addError, and it is Module 8.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes del quiz", en: "Before the quiz" },
      text: {
        es: "Sin mirar: ¿qué capa decide el evento, cuál decide qué reglas se aplican, cuál contiene la regla? ¿Por qué la regla nueva no toca el trigger? ¿Por qué tiene su propia guardia?",
        en: "Without looking: which layer picks the event, which decides which rules apply, which holds the rule? Why does the new rule not touch the trigger? Why does it have its own guard?",
      },
    },
  ],

  quiz: [
    {
      id: "m07-cp-q1",
      kind: "single",
      prompt: {
        es: "Llega una regla nueva sobre casos, en un evento que el trigger ya escucha. ¿Qué se modifica?",
        en: "A new rule on cases arrives, on an event the trigger already listens to. What gets modified?",
      },
      options: [
        { es: "Una línea en el handler y un servicio nuevo o ampliado. El trigger, nada.", en: "One line in the handler and a new or extended service. The trigger, nothing." },
        { es: "El trigger, añadiendo la lógica en su rama del switch.", en: "The trigger, adding the logic in its switch branch." },
        { es: "Se crea un segundo trigger para la regla nueva.", en: "A second trigger is created for the new rule." },
        { es: "El servicio de escalado, aunque la regla sea de otro negocio.", en: "The escalation service, even if the rule belongs to another business." },
      ],
      answer: 0,
      explain: {
        es: "Esa es la recompensa de la arquitectura: el trigger ya decide el evento, el handler solo añade la llamada y la regla vive en su servicio.",
        en: "That is the architecture's reward: the trigger already picks the event, the handler just adds the call and the rule lives in its service.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m07-cp-q2",
      kind: "single",
      prompt: {
        es: "¿Qué condición detecta que un caso ACABA de cerrarse en after update?",
        en: "Which condition detects that a case has JUST closed in after update?",
      },
      options: [
        { es: "c.IsClosed && !oldMap.get(c.Id).IsClosed", en: "c.IsClosed && !oldMap.get(c.Id).IsClosed" },
        { es: "c.IsClosed", en: "c.IsClosed" },
        { es: "c.Status == 'Closed'", en: "c.Status == 'Closed'" },
        { es: "oldMap.get(c.Id).IsClosed", en: "oldMap.get(c.Id).IsClosed" },
      ],
      answer: 0,
      explain: {
        es: "Cerrado ahora y abierto antes. Solo c.IsClosed también sería true al editar un caso que ya estaba cerrado hace meses: cada edición crearía otra tarea.",
        en: "Closed now and open before. c.IsClosed alone would also be true when editing a case closed months ago: every edit would create another task.",
      },
      tags: ["find-error"],
    },
    {
      id: "m07-cp-q3",
      kind: "single",
      prompt: {
        es: "La tarea de seguimiento es para el comercial de la cuenta. ¿De dónde sale su Id?",
        en: "The follow-up task is for the account's rep. Where does their Id come from?",
      },
      options: [
        {
          es: "De Account.OwnerId, con una consulta de las cuentas de todos los casos y un Map.",
          en: "From Account.OwnerId, with one query of every case's account and a Map.",
        },
        { es: "De c.OwnerId, el propietario del caso.", en: "From c.OwnerId, the case owner." },
        { es: "De una consulta a Account dentro del bucle, una por caso.", en: "From a query on Account inside the loop, one per case." },
        { es: "De UserInfo.getUserId(), el usuario que cierra el caso.", en: "From UserInfo.getUserId(), the user closing the case." },
      ],
      answer: 0,
      explain: {
        es: "El propietario del caso es el agente; el de la cuenta, el comercial. Y la consulta, una para todos: con 200 casos cerrados de golpe, una consulta por caso reventaría el límite.",
        en: "The case owner is the agent; the account owner, the rep. And one query for all of them: with 200 cases closed at once, a query per case would blow the limit.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m07-cp-q4",
      kind: "single",
      prompt: {
        es: "¿Por qué la regla de Ventas va en CaseHandoffService y no en CaseEscalationService?",
        en: "Why does the Sales rule go in CaseHandoffService and not CaseEscalationService?",
      },
      options: [
        {
          es: "Porque es otro negocio: mezclarlas haría que cambiar una obligue a revisar la otra.",
          en: "Because it is another business: mixing them would make changing one force a review of the other.",
        },
        { es: "Porque una clase no puede tener más de tres métodos.", en: "Because a class cannot have more than three methods." },
        { es: "Porque los métodos de after update no pueden estar en el mismo servicio.", en: "Because after update methods cannot live in the same service." },
        { es: "Da igual: es solo cuestión de gusto.", en: "It does not matter: it is just taste." },
      ],
      answer: 0,
      explain: {
        es: "Un servicio agrupa las reglas de un mismo tema de negocio. Cuando Ventas cambie su regla, nadie tendrá que tocar —ni volver a probar— el escalado de Soporte.",
        en: "A service groups the rules of one business topic. When Sales changes its rule, nobody will have to touch — or retest — Support's escalation.",
      },
      tags: ["recall"],
    },
    {
      id: "m07-cp-q5",
      kind: "single",
      prompt: {
        es: "El usuario de la migración cierra 10.000 casos históricos urgentes. ¿Cuántas tareas de seguimiento se crean?",
        en: "The migration user closes 10,000 historical urgent cases. How many follow-up tasks get created?",
      },
      options: [
        { es: "Ninguna: el interruptor de arriba del trigger corta antes de llegar a ningún servicio.", en: "None: the switch at the top of the trigger cuts off before reaching any service." },
        { es: "10.000: la regla nueva no tiene bypass propio.", en: "10,000: the new rule has no bypass of its own." },
        { es: "Solo las de los primeros 200.", en: "Only those of the first 200." },
        { es: "Depende de la guardia.", en: "It depends on the guard." },
      ],
      answer: 0,
      explain: {
        es: "El interruptor está antes del handler, así que cubre cualquier regla presente o futura del objeto sin que nadie tenga que acordarse de él.",
        en: "The switch sits before the handler, so it covers any present or future rule on the object without anyone having to remember it.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m07-cp-q6",
      kind: "multi",
      prompt: {
        es: "¿Qué líneas NO deberían aparecer dentro de CaseHandoffService?",
        en: "Which lines should NOT appear inside CaseHandoffService?",
      },
      options: [
        { es: "for (Case c : (List<Case>) Trigger.new) { … }", en: "for (Case c : (List<Case>) Trigger.new) { … }" },
        { es: "Account a = [SELECT OwnerId FROM Account WHERE Id = :c.AccountId];  // dentro del for", en: "Account a = [SELECT OwnerId FROM Account WHERE Id = :c.AccountId];  // inside the for" },
        { es: "private static Set<Id> followUpsCreatedFor = new Set<Id>();", en: "private static Set<Id> followUpsCreatedFor = new Set<Id>();" },
        { es: "insert followUps;", en: "insert followUps;" },
      ],
      answers: [0, 1],
      explain: {
        es: "Trigger.new ataría el servicio al trigger, y una consulta por caso rompe la bulkificación. La guardia propia y un insert de toda la lista son exactamente lo que debe tener.",
        en: "Trigger.new would tie the service to the trigger, and a query per case breaks bulkification. Its own guard and one insert of the whole list are exactly what it should have.",
      },
      tags: ["find-error"],
    },
    {
      id: "m07-cp-q7",
      kind: "single",
      prompt: {
        es: "Repaso: en after update, ¿se puede cambiar un campo de Trigger.new directamente?",
        en: "Review: in after update, can you change a Trigger.new field directly?",
      },
      options: [
        {
          es: "No: en after los registros de Trigger.new son de solo lectura; para cambiarlos haría falta otro DML.",
          en: "No: in after, Trigger.new records are read-only; changing them would take another DML.",
        },
        { es: "Sí, y se guarda solo, igual que en before.", en: "Yes, and it saves itself, just like in before." },
        { es: "Sí, pero solo los campos personalizados.", en: "Yes, but only custom fields." },
        { es: "Solo con el permiso de bypass.", en: "Only with the bypass permission." },
      ],
      answer: 0,
      explain: {
        es: "En after el registro ya está guardado y Trigger.new es de solo lectura (Módulo 6). Por eso la regla nueva crea OTROS registros —tareas— en vez de tocar el caso.",
        en: "In after the record is already saved and Trigger.new is read-only (Module 6). That is why the new rule creates OTHER records — tasks — instead of touching the case.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M6 before/after", en: "Review · M6 before/after" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 5 DE 5 · La entrega. Ventas quiere enterarse a tiempo: cuando se cierra un caso de prioridad 'High' de una cuenta, el propietario de esa cuenta recibe una tarea de seguimiento para mañana. Añádela en la arquitectura que has construido, sin tocar el trigger. Tiene que aguantar el cierre masivo de 200 casos de golpe.",
      en: "TASK 5 OF 5 · Delivery. Sales wants to find out in time: when a 'High' priority case of an account closes, that account's owner gets a follow-up task for tomorrow. Add it to the architecture you built, without touching the trigger. It must survive 200 cases being closed at once.",
    },
    brief: [
      {
        es: "Una clase nueva, public with sharing class CaseHandoffService, al final del archivo, con public static void createSalesFollowUps(List<Case> …, Map<Id, Case> …).",
        en: "A new class, public with sharing class CaseHandoffService, at the end of the file, with public static void createSalesFollowUps(List<Case> …, Map<Id, Case> …).",
      },
      {
        es: "Solo cuentan los casos que ACABAN de cerrarse (IsClosed ahora sí, en oldMap no), de prioridad 'High' y con cuenta.",
        en: "Only cases that have JUST closed count (IsClosed now yes, in oldMap no), 'High' priority and with an account.",
      },
      {
        es: "La tarea va para el propietario de la CUENTA: sácalo con una sola consulta a Account con los Ids de todos esos casos, fuera de cualquier bucle, y búscalo en un Map.",
        en: "The task goes to the ACCOUNT's owner: get it with a single Account query using all those cases' Ids, outside any loop, and look it up in a Map.",
      },
      {
        es: "La regla tiene su propia guardia private static Set<Id>, y un solo insert para todas las tareas.",
        en: "The rule has its own private static Set<Id> guard, and a single insert for every task.",
      },
      {
        es: "El handler llama al servicio nuevo desde afterUpdate, pasándole la lista y el oldMap que ya recibe. El trigger no se toca y el interruptor sigue arriba.",
        en: "The handler calls the new service from afterUpdate, handing it the list and oldMap it already receives. The trigger is untouched and the switch stays at the top.",
      },
    ],
    starter: {
      es: `// CASO: el trigger heredado de Soporte · objeto Case
// Ya resuelto: trigger (1), handler (2), servicio y botón (3), guardia e interruptor (4).
// Tarea 5 de 5: la entrega · el aviso de Soporte a Ventas.

${FROM_TASK4}${TAIL_ES}`,
      en: `// CASE: Support's inherited trigger · Case object
// Already solved: trigger (1), handler (2), service and button (3), guard and switch (4).
// Task 5 of 5: delivery · the handoff from Support to Sales.

${FROM_TASK4}${TAIL_EN}`,
    },
    hints: [
      {
        es: "Empieza por las tres decisiones de la teoría: qué evento (y si el trigger ya lo escucha), en qué clase vive la regla, y qué protecciones necesita. Luego piensa el método en tres pasos: elegir los casos, averiguar los comerciales, crear las tareas.",
        en: "Start from the theory's three decisions: which event (and whether the trigger already listens to it), which class the rule lives in, and which protections it needs. Then think of the method in three steps: pick the cases, find the reps, create the tasks.",
      },
      {
        es: "Paso 1: un bucle que se queda con los casos donde c.IsClosed && !oldMap.get(c.Id).IsClosed && c.Priority == 'High' && c.AccountId != null y que no estén en la guardia, juntando sus AccountId en un Set. Paso 2: [SELECT Id, OwnerId FROM Account WHERE Id IN :accountIds] en un Map. Paso 3: otro bucle que crea las tareas con OwnerId = accounts.get(c.AccountId).OwnerId, y un insert al final.",
        en: "Step 1: a loop keeping cases where c.IsClosed && !oldMap.get(c.Id).IsClosed && c.Priority == 'High' && c.AccountId != null and that are not in the guard, gathering their AccountIds in a Set. Step 2: [SELECT Id, OwnerId FROM Account WHERE Id IN :accountIds] into a Map. Step 3: another loop creating the tasks with OwnerId = accounts.get(c.AccountId).OwnerId, and one insert at the end.",
      },
      {
        es: "En el handler, afterUpdate queda con dos líneas: la del escalado que ya estaba y CaseHandoffService.createSalesFollowUps(newCases, oldMap);. ActivityDate = Date.today().addDays(1) para «mañana».",
        en: "In the handler, afterUpdate ends up with two lines: the escalation one already there and CaseHandoffService.createSalesFollowUps(newCases, oldMap);. ActivityDate = Date.today().addDays(1) for “tomorrow”.",
      },
    ],
    solution: { es: SOLUTION, en: SOLUTION_EN },
    checks: [
      {
        id: "m07-cp-c1",
        label: { es: "CaseHandoffService con su método bulk", en: "CaseHandoffService with its bulk method" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+(with\\s+sharing\\s+)?class\\s+CaseHandoffService\\b" },
            {
              op: "match",
              pattern: "static\\s+void\\s+createSalesFollowUps\\s*\\(\\s*List\\s*<\\s*Case\\s*>\\s+\\w+\\s*,\\s*Map\\s*<\\s*Id\\s*,\\s*Case\\s*>\\s+\\w+\\s*\\)",
            },
          ],
        },
        onFail: {
          es: "La regla nueva vive en su propia clase: public with sharing class CaseHandoffService con public static void createSalesFollowUps(List<Case> cases, Map<Id, Case> oldMap).",
          en: "The new rule lives in its own class: public with sharing class CaseHandoffService with public static void createSalesFollowUps(List<Case> cases, Map<Id, Case> oldMap).",
        },
      },
      {
        id: "m07-cp-c2",
        label: { es: "Detecta los casos que ACABAN de cerrarse", en: "Detects cases that have JUST closed" },
        rule: {
          op: "all",
          of: [
            {
              op: "any",
              of: [
                {
                  op: "match",
                  pattern: "class\\s+CaseHandoffService\\b[\\s\\S]*\\.\\s*IsClosed\\b[\\s\\S]*!\\s*\\w+\\s*\\.\\s*get\\s*\\(\\s*\\w+\\s*\\.\\s*Id\\s*\\)\\s*\\.\\s*IsClosed",
                },
                {
                  op: "match",
                  pattern: "class\\s+CaseHandoffService\\b[\\s\\S]*\\w+\\s*\\.\\s*get\\s*\\(\\s*\\w+\\s*\\.\\s*Id\\s*\\)\\s*\\.\\s*IsClosed\\s*==\\s*false",
                },
              ],
            },
            { op: "match", pattern: "class\\s+CaseHandoffService\\b[\\s\\S]*Priority\\s*==\\s*'High'" },
            { op: "match", pattern: "class\\s+CaseHandoffService\\b[\\s\\S]*AccountId\\s*!=\\s*null" },
          ],
        },
        onFail: {
          es: "«Acaba de cerrarse» es cerrado ahora y abierto antes: c.IsClosed && !oldMap.get(c.Id).IsClosed. Además prioridad 'High' y AccountId != null: sin cuenta no hay comercial a quien avisar.",
          en: "“Just closed” is closed now and open before: c.IsClosed && !oldMap.get(c.Id).IsClosed. Plus 'High' priority and AccountId != null: without an account there is no rep to notify.",
        },
      },
      {
        id: "m07-cp-c3",
        label: { es: "Una consulta de cuentas, bulk, para el comercial", en: "One bulk account query for the rep" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "class\\s+CaseHandoffService\\b[\\s\\S]*SELECT[^\\]]*\\bOwnerId\\b[^\\]]*FROM\\s+Account\\s+WHERE\\s+Id\\s+IN\\s*:\\s*\\w+" },
            { op: "match", pattern: "OwnerId\\s*=\\s*\\w+\\s*\\.\\s*get\\s*\\(\\s*\\w+\\s*\\.\\s*AccountId\\s*\\)\\s*\\.\\s*OwnerId" },
            { op: "absent", pattern: "for\\s*\\([^)]*\\)\\s*\\{[^{}]*\\[\\s*SELECT\\b" },
          ],
        },
        onFail: {
          es: "El comercial es Account.OwnerId, no c.OwnerId. Una sola consulta con WHERE Id IN :accountIds, fuera de los bucles, en un Map; y en la tarea, OwnerId = accounts.get(c.AccountId).OwnerId.",
          en: "The rep is Account.OwnerId, not c.OwnerId. One single query with WHERE Id IN :accountIds, outside the loops, into a Map; and on the task, OwnerId = accounts.get(c.AccountId).OwnerId.",
        },
      },
      {
        id: "m07-cp-c4",
        label: { es: "Su propia guardia y un solo insert", en: "Its own guard and a single insert" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "class\\s+CaseHandoffService\\b[\\s\\S]*\\bstatic\\s+Set\\s*<\\s*Id\\s*>\\s+\\w+\\s*=\\s*new\\s+Set\\s*<\\s*Id\\s*>" },
            { op: "match", pattern: "class\\s+CaseHandoffService\\b[\\s\\S]*!\\s*\\w+\\s*\\.\\s*contains\\s*\\(\\s*\\w+\\s*\\.\\s*Id\\s*\\)" },
            { op: "count", pattern: "\\binsert\\s+\\w+\\s*;", min: 2, max: 2 },
          ],
        },
        onFail: {
          es: "Una guardia propia (private static Set<Id>) que salte los casos ya avisados en esta transacción, y un único insert de toda la lista de tareas al final del método.",
          en: "Its own guard (private static Set<Id>) skipping cases already notified in this transaction, and a single insert of the whole task list at the end of the method.",
        },
      },
      {
        id: "m07-cp-c5",
        label: { es: "El handler llama al servicio nuevo desde afterUpdate", en: "The handler calls the new service from afterUpdate" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "void\\s+afterUpdate\\s*\\([^)]*\\)\\s*\\{[^}]*CaseHandoffService\\s*\\.\\s*createSalesFollowUps\\s*\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)" },
            { op: "absent", pattern: "class\\s+CaseTriggerHandler\\b[\\s\\S]*?(\\[\\s*SELECT\\b|\\binsert\\s+\\w+\\s*;|\\bfor\\s*\\()[\\s\\S]*class\\s+CaseEscalationService\\b" },
          ],
        },
        onFail: {
          es: "Dentro de afterUpdate del handler, una línea más: CaseHandoffService.createSalesFollowUps(newCases, oldMap);. Y el handler sigue sin lógica propia.",
          en: "Inside the handler's afterUpdate, one more line: CaseHandoffService.createSalesFollowUps(newCases, oldMap);. And the handler still holds no logic of its own.",
        },
      },
      {
        id: "m07-cp-c6",
        label: { es: "El trigger no se ha tocado", en: "The trigger was not touched" },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "\\btrigger\\s+\\w+\\s+on\\s+Case\\b", min: 1, max: 1 },
            { op: "match", pattern: "trigger\\s+CaseTrigger\\b[^{]*\\{\\s*if\\s*\\(\\s*FeatureManagement\\s*\\.\\s*checkPermission\\s*\\(\\s*'Bypass_Case_Triggers'\\s*\\)" },
            { op: "absent", pattern: "trigger\\s+CaseTrigger\\b[\\s\\S]*?(CaseHandoffService|\\[\\s*SELECT\\b|\\bfor\\s*\\()[\\s\\S]*class\\s+CaseTriggerHandler\\b" },
            { op: "absent", pattern: "class\\s+CaseTriggerHandler\\b[\\s\\S]*\\bTrigger\\s*\\." },
          ],
        },
        onFail: {
          es: "El trigger se queda como estaba: un solo trigger, el interruptor como primera línea y ninguna mención a la regla nueva. Y fuera del trigger nada usa Trigger.",
          en: "The trigger stays as it was: a single trigger, the switch as its first line and no mention of the new rule. And outside the trigger nothing uses Trigger.",
        },
        onPass: {
          es: "Esa es la prueba de que la arquitectura funciona: una regla nueva, cero líneas en el trigger.",
          en: "That is the proof the architecture works: a new rule, zero lines in the trigger.",
        },
      },
    ],
    rubric: [
      {
        es: "Cuando lo tengas, cuéntalo: ¿cuántas líneas del trigger cambiaste? ¿Cuántas del handler? Si alguien te preguntara en una entrevista por qué usas handlers, esa respuesta —con este ejemplo— es la buena.",
        en: "Once you have it, count: how many trigger lines did you change? How many handler lines? If someone asked you in an interview why you use handlers, that answer — with this example — is the right one.",
      },
    ],
  },
};
