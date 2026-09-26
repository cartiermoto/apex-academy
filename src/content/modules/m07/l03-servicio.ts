import type { Lesson } from "@/lib/types";

/** Task 2's solution: the starting point of task 3. */
const FROM_TASK2 = `trigger CaseTrigger on Case (before insert, after insert) {
    CaseTriggerHandler handler = new CaseTriggerHandler();
    switch on Trigger.operationType {
        when BEFORE_INSERT {
            handler.beforeInsert(Trigger.new);
        }
        when AFTER_INSERT {
            handler.afterInsert(Trigger.new);
        }
    }
}

// ---- CaseTriggerHandler.cls ----
public with sharing class CaseTriggerHandler {

    public void beforeInsert(List<Case> newCases) {
        for (Case c : newCases) {
            if (c.Origin == 'Web') {
                c.Priority = 'Low';
            }
        }
        Set<Id> accountIds = new Set<Id>();
        for (Case c : newCases) {
            if (c.AccountId != null) {
                accountIds.add(c.AccountId);
            }
        }
        Map<Id, Account> hotAccounts = new Map<Id, Account>(
            [SELECT Id FROM Account WHERE Id IN :accountIds AND Rating = 'Hot']
        );
        for (Case c : newCases) {
            if (hotAccounts.containsKey(c.AccountId)) {
                c.Priority = 'High';
            }
        }
    }

    public void afterInsert(List<Case> newCases) {
        List<Task> tasks = new List<Task>();
        for (Case c : newCases) {
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
}`;

const SOLUTION = `trigger CaseTrigger on Case (before insert, after insert) {
    CaseTriggerHandler handler = new CaseTriggerHandler();
    switch on Trigger.operationType {
        when BEFORE_INSERT {
            handler.beforeInsert(Trigger.new);
        }
        when AFTER_INSERT {
            handler.afterInsert(Trigger.new);
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
}

// ---- CaseEscalationService.cls ----
public with sharing class CaseEscalationService {

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

const TAIL_ES = `

// ---- CaseEscalationService.cls ----
// Escribe aquí el servicio.

// ---- CaseActions.cls ----
// Y aquí el botón «Recalcular prioridad».
`;
const TAIL_EN = `

// ---- CaseEscalationService.cls ----
// Write the service here.

// ---- CaseActions.cls ----
// And the “Recalculate priority” button here.
`;

export const l03Servicio: Lesson = {
  id: "m07-l03",
  slug: "clases-de-servicio",
  n: 3,
  kind: "lesson",
  minutes: 34,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 2", en: "Remember? · Review of lesson 2" },
    prompt: { es: "¿Qué debe quedar dentro del trigger delgado?", en: "What should remain inside the thin trigger?" },
    options: [
      { es: "Solo decidir el evento y llamar al handler", en: "Only deciding the event and calling the handler" },
      { es: "Las consultas", en: "The queries" },
      { es: "Toda la lógica, bien ordenada", en: "All the logic, well ordered" },
    ],
    answer: 0,
    explain: { es: "El trigger es el Start: objeto y eventos. La lógica es el lienzo, y vive en el handler.", en: "The trigger is the Start: object and events. The logic is the canvas, and it lives in the handler." },
  },
  title: { es: "Clases de servicio", en: "Service classes" },
  summary: {
    es: "El handler sabe de eventos; la regla de negocio no debería. Sacarla a una clase de servicio es lo que permite que un botón, un proceso nocturno y el trigger usen exactamente la misma regla.",
    en: "The handler knows about events; the business rule should not. Pulling it into a service class is what lets a button, a nightly job and the trigger use exactly the same rule.",
  },
  analogy: {
    es: "Un subflow que llaman varios flows distintos",
    en: "A subflow called by several different flows",
  },
  objectives: [
    {
      es: "Distinguir lo que es del handler (traducir eventos) de lo que es del servicio (la regla de negocio).",
      en: "Tell what belongs to the handler (translating events) from what belongs to the service (the business rule).",
    },
    {
      es: "Escribir un servicio con métodos static que reciben listas y no saben nada de triggers.",
      en: "Write a service with static methods that take lists and know nothing about triggers.",
    },
    {
      es: "Decidir quién guarda: el servicio cambia registros, quien lo llama decide si hace falta DML.",
      en: "Decide who saves: the service changes records, the caller decides whether DML is needed.",
    },
    {
      es: "Reutilizar la misma regla desde otra puerta distinta del trigger.",
      en: "Reuse the same rule from a door other than the trigger.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Soporte está contento: la prioridad ya sale bien. Tan contento que pide más: un botón «Recalcular prioridad» para los casos antiguos, creados antes de que existiera la regla. Y Operaciones quiere revisar cada noche los casos del día. La regla es la misma; lo que cambia es la puerta por la que se entra. Si la regla vive en beforeInsert, ninguna de esas puertas tiene sentido llamándola.",
        en: "Support is happy: priority comes out right now. So happy they ask for more: a “Recalculate priority” button for old cases, created before the rule existed. And Operations wants the day's cases reviewed every night. The rule is the same; what changes is the door you come in through. If the rule lives in beforeInsert, none of those doors makes sense calling it.",
      },
    },
    {
      type: "diagram",
      id: "m07-service-doors",
      caption: {
        es: "Tres puertas, un solo servicio. Cambia de pestaña y fíjate en quién guarda en cada caso.",
        en: "Three doors, one service. Switch tabs and notice who saves in each case.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Ya lo hacías con subflows", en: "You already did this with subflows" },
      text: {
        es: "Yo lo hacía constantemente: cuando dos flows necesitaban la misma lógica —calcular un descuento, asignar una cola—, la sacaba a un autolaunched flow y la llamaba como subflow desde los dos. Cambiabas la regla una vez y todos la heredaban. Una clase de servicio es eso: el subflow de Apex. El trigger, un botón o un proceso programado son los flows que lo llaman.",
        en: "I did it constantly: when two flows needed the same logic — working out a discount, assigning a queue — I moved it into an autolaunched flow and called it as a subflow from both. You changed the rule once and they all inherited it. A service class is exactly that: Apex's subflow. The trigger, a button or a scheduled process are the flows that call it.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "Qué es del handler y qué es del servicio", en: "What belongs to the handler and what to the service" },
    },
    {
      type: "table",
      head: [
        { es: "", en: "" },
        { es: "Handler", en: "Handler" },
        { es: "Servicio", en: "Service" },
      ],
      rows: [
        [
          { es: "Sabe de…", en: "Knows about…" },
          { es: "Eventos: before, after, insert, update.", en: "Events: before, after, insert, update." },
          { es: "El negocio: cuentas Hot, prioridades, tareas.", en: "The business: Hot accounts, priorities, tasks." },
        ],
        [
          { es: "Quién lo llama", en: "Who calls it" },
          { es: "Solo su trigger.", en: "Only its trigger." },
          { es: "Cualquiera: handler, botón, proceso, test.", en: "Anyone: handler, button, job, test." },
        ],
        [
          { es: "Sus métodos se llaman…", en: "Its methods are named…" },
          { es: "Por el evento: beforeInsert.", en: "After the event: beforeInsert." },
          { es: "Por lo que hacen: applyPriorityRules.", en: "After what they do: applyPriorityRules." },
        ],
        [
          { es: "Cómo son sus métodos", en: "What its methods are like" },
          { es: "De instancia, uno por evento.", en: "Instance methods, one per event." },
          { es: "static, reciben listas, bulk.", en: "static, take lists, bulk." },
        ],
      ],
    },
    {
      type: "p",
      text: {
        es: "Con la [[clase-servicio|clase de servicio]], el handler adelgaza hasta quedarse en lo que de verdad es suyo: decidir qué reglas se aplican en cada evento y en qué orden. Cada método del handler pasa a ser una lista de llamadas al servicio. Los métodos del servicio son static porque no guardan nada entre llamadas: reciben una lista, hacen su trabajo y terminan, como una fórmula que no recuerda la ejecución anterior (Módulo 5).",
        en: "With the [[clase-servicio|service class]], the handler slims down to what truly belongs to it: deciding which rules apply on each event and in which order. Each handler method becomes a list of calls to the service. The service's methods are static because they keep nothing between calls: they take a list, do their job and finish, like a formula that does not remember its previous run (Module 5).",
      },
    },
    {
      type: "code",
      code: {
        es: `public with sharing class CaseTriggerHandler {
    public void beforeInsert(List<Case> newCases) {
        CaseEscalationService.applyPriorityRules(newCases);
    }
    public void afterInsert(List<Case> newCases) {
        CaseEscalationService.createReviewTasks(newCases);
    }
}

public with sharing class CaseEscalationService {
    public static void applyPriorityRules(List<Case> cases) { /* la regla */ }
    public static void createReviewTasks(List<Case> cases)  { /* las tareas */ }
}`,
        en: `public with sharing class CaseTriggerHandler {
    public void beforeInsert(List<Case> newCases) {
        CaseEscalationService.applyPriorityRules(newCases);
    }
    public void afterInsert(List<Case> newCases) {
        CaseEscalationService.createReviewTasks(newCases);
    }
}

public with sharing class CaseEscalationService {
    public static void applyPriorityRules(List<Case> cases) { /* the rule */ }
    public static void createReviewTasks(List<Case> cases)  { /* the tasks */ }
}`,
      },
      caption: {
        es: "Los métodos static se llaman con el nombre de la clase delante, sin new: CaseEscalationService.applyPriorityRules(…).",
        en: "Static methods are called with the class name in front, with no new: CaseEscalationService.applyPriorityRules(…).",
      },
    },
    {
      type: "h",
      text: { es: "Quién guarda: la pregunta que decide el diseño", en: "Who saves: the question that decides the design" },
    },
    {
      type: "p",
      text: {
        es: "applyPriorityRules cambia la prioridad en memoria y NO hace update. Parece un olvido, pero es la clave. Cuando la llama el handler en before insert, los casos todavía no se han guardado y Salesforce los guardará solo; un update ahí, además, fallaría, porque en un trigger before no se permite hacer DML sobre los propios registros de Trigger.new. Cuando la llama el botón, en cambio, los casos ya existen, y quien tiene que guardarlos es el botón. El servicio cambia los registros; quien lo llama decide si hace falta guardar.",
        en: "applyPriorityRules changes priority in memory and does NOT update. It looks like an oversight, but it is the key. When the handler calls it in before insert, the cases are not saved yet and Salesforce will save them by itself; an update there would also fail, because a before trigger does not allow DML on Trigger.new's own records. When the button calls it, however, the cases already exist, and the one who must save them is the button. The service changes the records; the caller decides whether saving is needed.",
      },
    },
    {
      type: "code",
      code: {
        es: `public with sharing class CaseActions {
    // El botón «Recalcular prioridad»: otra puerta, la misma regla
    public static void recalculatePriority(Set<Id> caseIds) {
        List<Case> cases = [
            SELECT Id, Origin, AccountId, Priority
            FROM Case
            WHERE Id IN :caseIds
        ];
        CaseEscalationService.applyPriorityRules(cases);
        update cases;   // aquí sí: estos casos ya existen
    }
}`,
        en: `public with sharing class CaseActions {
    // The “Recalculate priority” button: another door, the same rule
    public static void recalculatePriority(Set<Id> caseIds) {
        List<Case> cases = [
            SELECT Id, Origin, AccountId, Priority
            FROM Case
            WHERE Id IN :caseIds
        ];
        CaseEscalationService.applyPriorityRules(cases);
        update cases;   // here yes: these cases already exist
    }
}`,
      },
      caption: {
        es: "La consulta trae los campos que la regla va a leer: Origin y AccountId. Si faltara uno, la regla lanzaría un error al intentar leerlo.",
        en: "The query brings the fields the rule will read: Origin and AccountId. If one were missing, the rule would throw an error trying to read it.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "El servicio no mira el contexto del trigger", en: "The service does not look at the trigger context" },
      text: {
        es: "Ni Trigger.new, ni Trigger.isInsert, ni nada que empiece por Trigger. Si el servicio preguntara «¿estoy en un trigger?», volvería a estar atado a una sola puerta. Recibe una lista, aplica la regla y termina: le da igual quién lo llame.",
        en: "No Trigger.new, no Trigger.isInsert, nothing starting with Trigger. If the service asked “am I in a trigger?”, it would be tied to a single door again. It takes a list, applies the rule and finishes: it does not care who calls it.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "En tu Developer Org", en: "In your Developer Org" },
      text: {
        es: "Crea las tres clases (CaseEscalationService, el handler actualizado y CaseActions) y prueba la puerta nueva desde Execute Anonymous: CaseActions.recalculatePriority(new Map<Id, Case>([SELECT Id FROM Case LIMIT 5]).keySet()); Abre luego esos casos y mira su prioridad. Acabas de ejecutar la regla del trigger sin crear ningún caso.",
        en: "Create the three classes (CaseEscalationService, the updated handler and CaseActions) and try the new door from Execute Anonymous: CaseActions.recalculatePriority(new Map<Id, Case>([SELECT Id FROM Case LIMIT 5]).keySet()); Then open those cases and look at their priority. You just ran the trigger's rule without creating a single case.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué sabe el handler que el servicio no debe saber? ¿Por qué applyPriorityRules no hace update? ¿Quién guarda cuando la regla se aplica desde el botón?",
        en: "Without looking: what does the handler know that the service must not? Why does applyPriorityRules not update? Who saves when the rule runs from the button?",
      },
    },
  ],

  quiz: [
    {
      id: "m07-l03-q1",
      kind: "single",
      prompt: {
        es: "¿Qué nombre de método encaja mejor en una clase de servicio?",
        en: "Which method name fits a service class best?",
      },
      options: [
        { es: "applyPriorityRules(List<Case> cases)", en: "applyPriorityRules(List<Case> cases)" },
        { es: "beforeInsert(List<Case> cases)", en: "beforeInsert(List<Case> cases)" },
        { es: "onTrigger()", en: "onTrigger()" },
        { es: "handleAfterUpdate(Map<Id, Case> oldMap)", en: "handleAfterUpdate(Map<Id, Case> oldMap)" },
      ],
      answer: 0,
      explain: {
        es: "El servicio se nombra por lo que HACE, no por el evento en el que se llama. beforeInsert o handleAfterUpdate son nombres de handler.",
        en: "The service is named after what it DOES, not the event it is called in. beforeInsert or handleAfterUpdate are handler names.",
      },
      tags: ["recall"],
    },
    {
      id: "m07-l03-q2",
      kind: "single",
      prompt: {
        es: "Alguien añade update cases; al final de applyPriorityRules. El trigger lo llama en before insert. ¿Qué pasa?",
        en: "Someone adds update cases; at the end of applyPriorityRules. The trigger calls it in before insert. What happens?",
      },
      options: [
        {
          es: "Falla: en un trigger before no se permite DML sobre los propios registros de Trigger.new.",
          en: "It fails: a before trigger does not allow DML on Trigger.new's own records.",
        },
        { es: "Funciona igual, solo que guarda dos veces.", en: "It works the same, just saving twice." },
        { es: "Funciona y es la forma recomendada.", en: "It works and is the recommended way." },
        { es: "No compila: un servicio no puede hacer update.", en: "It does not compile: a service cannot update." },
      ],
      answer: 0,
      explain: {
        es: "En before insert los casos ni siquiera existen aún en la base de datos, y la plataforma prohíbe hacer DML sobre Trigger.new. Por eso el servicio cambia en memoria y deja que guarde quien lo llama.",
        en: "In before insert the cases do not even exist in the database yet, and the platform forbids DML on Trigger.new. That is why the service changes in memory and lets the caller save.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m07-l03-q3",
      kind: "single",
      prompt: {
        es: "El botón llama a applyPriorityRules(cases) con casos que ya existen, pero olvida el update. ¿Qué ve el usuario?",
        en: "The button calls applyPriorityRules(cases) with existing cases, but forgets the update. What does the user see?",
      },
      options: [
        {
          es: "Nada cambia: las prioridades se calcularon en memoria y nunca llegaron a la base de datos.",
          en: "Nothing changes: the priorities were worked out in memory and never reached the database.",
        },
        { es: "Las prioridades cambian, porque el servicio siempre guarda.", en: "The priorities change, because the service always saves." },
        { es: "Un error de límite de DML.", en: "A DML limit error." },
        { es: "Las prioridades cambian solo en los casos de cuentas Hot.", en: "The priorities change only on Hot accounts' cases." },
      ],
      answer: 0,
      explain: {
        es: "Fuera de un trigger before nadie guarda por ti: los registros modificados en memoria se tiran al acabar la transacción (Módulo 1: en memoria no es lo mismo que guardado).",
        en: "Outside a before trigger nobody saves for you: records changed in memory are discarded when the transaction ends (Module 1: in memory is not the same as saved).",
      },
      tags: ["interleaving"],
    },
    {
      id: "m07-l03-q4",
      kind: "single",
      prompt: {
        es: "¿Cómo se llama un método static de otra clase?",
        en: "How do you call another class's static method?",
      },
      options: [
        { es: "CaseEscalationService.applyPriorityRules(cases);", en: "CaseEscalationService.applyPriorityRules(cases);" },
        { es: "new CaseEscalationService().applyPriorityRules(cases);", en: "new CaseEscalationService().applyPriorityRules(cases);" },
        { es: "applyPriorityRules(cases);", en: "applyPriorityRules(cases);" },
        { es: "CaseEscalationService->applyPriorityRules(cases);", en: "CaseEscalationService->applyPriorityRules(cases);" },
      ],
      answer: 0,
      explain: {
        es: "Con el nombre de la clase delante y sin new: el método pertenece a la clase, no a un objeto concreto (Módulo 5).",
        en: "With the class name in front and no new: the method belongs to the class, not to a particular object (Module 5).",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M5 static", en: "Review · M5 static" },
    },
    {
      id: "m07-l03-q5",
      kind: "multi",
      prompt: {
        es: "¿Qué tres rasgos debe tener un buen método de servicio?",
        en: "Which three traits should a good service method have?",
      },
      options: [
        { es: "Recibe una lista, no un solo registro.", en: "It takes a list, not a single record." },
        { es: "No lee nada que empiece por Trigger.", en: "It reads nothing starting with Trigger." },
        { es: "Consulta fuera de los bucles.", en: "It queries outside loops." },
        { es: "Comprueba Trigger.isBefore para saber si debe guardar.", en: "It checks Trigger.isBefore to know whether to save." },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Lista, sin contexto de trigger y bulk. Preguntar Trigger.isBefore lo ataría al trigger; decidir si guardar es cosa de quien lo llama.",
        en: "A list, no trigger context and bulk. Asking Trigger.isBefore would tie it to the trigger; deciding whether to save is the caller's job.",
      },
      tags: ["recall"],
    },
    {
      id: "m07-l03-q6",
      kind: "single",
      prompt: {
        es: "Esta consulta del botón hará fallar a applyPriorityRules. ¿Por qué?",
        en: "This button query will make applyPriorityRules fail. Why?",
      },
      code: {
        es: `List<Case> cases = [SELECT Id, Priority FROM Case WHERE Id IN :caseIds];
CaseEscalationService.applyPriorityRules(cases);`,
        en: `List<Case> cases = [SELECT Id, Priority FROM Case WHERE Id IN :caseIds];
CaseEscalationService.applyPriorityRules(cases);`,
      },
      options: [
        {
          es: "La regla lee Origin y AccountId, que no se consultaron: leer un campo no consultado lanza un error.",
          en: "The rule reads Origin and AccountId, which were not queried: reading an unqueried field throws an error.",
        },
        { es: "Falta un LIMIT en la consulta.", en: "The query is missing a LIMIT." },
        { es: "No se puede pasar el resultado de una consulta a un servicio.", en: "You cannot pass a query result to a service." },
        { es: "Priority no se puede consultar.", en: "Priority cannot be queried." },
      ],
      answer: 0,
      explain: {
        es: "Cuando los registros vienen de una consulta, solo traen los campos que pediste. Desde el trigger llegaban completos; desde el botón, hay que pedir lo que la regla va a leer.",
        en: "When records come from a query, they only carry the fields you asked for. From the trigger they arrived complete; from the button, you must ask for what the rule will read.",
      },
      tags: ["find-error"],
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 3 DE 5 · Soporte quiere el botón «Recalcular prioridad» para casos antiguos, con la misma regla que el trigger. Saca la lógica del handler a una clase de servicio, CaseEscalationService, y crea la clase del botón, CaseActions, que la reutiliza. El trigger no se toca.",
      en: "TASK 3 OF 5 · Support wants the “Recalculate priority” button for old cases, with the same rule as the trigger. Pull the logic out of the handler into a service class, CaseEscalationService, and create the button class, CaseActions, that reuses it. The trigger stays as it is.",
    },
    brief: [
      {
        es: "Orden en el archivo: el trigger, el handler, el servicio y el botón, como marca el código de partida.",
        en: "Order in the file: the trigger, the handler, the service and the button, as the starter marks.",
      },
      {
        es: "public with sharing class CaseEscalationService con dos métodos public static que reciben List<Case>: uno aplica las prioridades (web 'Low' y después Hot 'High') y otro crea las tareas de revisión.",
        en: "public with sharing class CaseEscalationService with two public static methods taking List<Case>: one applies the priorities (web 'Low' then Hot 'High') and one creates the review tasks.",
      },
      {
        es: "El handler ya no tiene consultas, DML ni bucles: cada uno de sus métodos solo llama al servicio.",
        en: "The handler no longer holds queries, DML or loops: each of its methods only calls the service.",
      },
      {
        es: "public with sharing class CaseActions con public static void recalculatePriority(Set<Id> caseIds): consulta esos casos con los campos que lee la regla, llama al servicio y los guarda.",
        en: "public with sharing class CaseActions with public static void recalculatePriority(Set<Id> caseIds): query those cases with the fields the rule reads, call the service and save them.",
      },
      {
        es: "Nada que empiece por Trigger. puede aparecer fuera del trigger.",
        en: "Nothing starting with Trigger. may appear outside the trigger.",
      },
    ],
    starter: {
      es: `// CASO: el trigger heredado de Soporte · objeto Case
// Ya resuelto: un solo trigger (tarea 1) y un handler (tarea 2).
// Tarea 3 de 5: la regla, en un servicio que también use el botón.

${FROM_TASK2}${TAIL_ES}`,
      en: `// CASE: Support's inherited trigger · Case object
// Already solved: a single trigger (task 1) and a handler (task 2).
// Task 3 of 5: the rule, in a service the button can use too.

${FROM_TASK2}${TAIL_EN}`,
    },
    hints: [
      {
        es: "Yo me haría las preguntas de cuando sacaba un subflow: ¿qué parte del handler es regla de negocio (va al servicio)? ¿Qué se queda en el handler? ¿Qué tiene que hacer el botón que el trigger no necesita?",
        en: "I would ask the questions I asked when moving something into a subflow: which part of the handler is business rule (it goes to the service)? What stays in the handler? What does the button need to do that the trigger does not?",
      },
      {
        es: "Lo que me ayudó: el contenido de beforeInsert se muda casi entero a un método static del servicio, y el de afterInsert a otro. Cada método del handler queda en una línea: CaseEscalationService.elMetodo(newCases);. El botón no está en un trigger before: los casos ya existen, así que después de aplicar la regla necesita un update, como un Update Records.",
        en: "What helped me: the contents of beforeInsert move almost whole into a static method of the service, and afterInsert's into another. Each handler method becomes one line: CaseEscalationService.theMethod(newCases);. The button is not in a before trigger: the cases already exist, so after applying the rule it needs an update, like an Update Records.",
      },
      {
        es: "Te dejo el botón: List<Case> cases = [SELECT Id, Origin, AccountId, Priority FROM Case WHERE Id IN :caseIds]; CaseEscalationService.applyPriorityRules(cases); update cases;",
        en: "Here is the button: List<Case> cases = [SELECT Id, Origin, AccountId, Priority FROM Case WHERE Id IN :caseIds]; CaseEscalationService.applyPriorityRules(cases); update cases;",
      },
    ],
    solution: { es: SOLUTION, en: SOLUTION },
    checks: [
      {
        id: "m07-l03-c1",
        label: { es: "Las cuatro piezas, en orden", en: "The four pieces, in order" },
        rule: {
          op: "match",
          pattern:
            "trigger\\s+CaseTrigger\\b[\\s\\S]*class\\s+CaseTriggerHandler\\b[\\s\\S]*class\\s+CaseEscalationService\\b[\\s\\S]*class\\s+CaseActions\\b",
        },
        onFail: {
          es: "Tienen que estar el trigger, CaseTriggerHandler, CaseEscalationService y CaseActions, en ese orden, como marcan los separadores del código de partida.",
          en: "The trigger, CaseTriggerHandler, CaseEscalationService and CaseActions must all be there, in that order, as the starter's separators mark.",
        },
        otter: {
          es: "Cuatro piezas, como un flow, su subflow y el botón que también lo llama: el trigger, CaseTriggerHandler, CaseEscalationService y CaseActions, en ese orden, como marcan los separadores del código de partida.",
          en: "Four pieces, like a flow, its subflow and the button that calls it too: the trigger, CaseTriggerHandler, CaseEscalationService and CaseActions, in that order, as the starter code's separators mark.",
        },
      },
      {
        id: "m07-l03-c2",
        label: { es: "El servicio tiene la regla, en métodos static que reciben listas", en: "The service holds the rule, in static methods taking lists" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+(with\\s+sharing\\s+)?class\\s+CaseEscalationService\\b" },
            { op: "count", pattern: "\\bstatic\\s+void\\s+\\w+\\s*\\(\\s*List\\s*<\\s*Case\\s*>\\s+\\w+\\s*\\)", min: 2 },
            { op: "match", pattern: "class\\s+CaseEscalationService\\b[\\s\\S]*Rating\\s*=\\s*'Hot'[\\s\\S]*class\\s+CaseActions\\b" },
            { op: "match", pattern: "class\\s+CaseEscalationService\\b[\\s\\S]*\\binsert\\s+\\w+\\s*;[\\s\\S]*class\\s+CaseActions\\b" },
          ],
        },
        onFail: {
          es: "La consulta de cuentas Hot y el insert de tareas tienen que vivir en CaseEscalationService, en métodos public static que reciban List<Case>.",
          en: "The Hot accounts query and the task insert must live in CaseEscalationService, in public static methods taking List<Case>.",
        },
        otter: {
          es: "El servicio es tu subflow: la consulta de cuentas Hot y el insert de tareas viven en CaseEscalationService, en métodos public static que reciben List<Case>.",
          en: "The service is your subflow: the Hot accounts query and the task insert live in CaseEscalationService, in public static methods receiving List<Case>.",
        },
      },
      {
        id: "m07-l03-c3",
        label: { es: "El handler solo delega", en: "The handler only delegates" },
        rule: {
          op: "all",
          of: [
            {
              op: "absent",
              pattern:
                "class\\s+CaseTriggerHandler\\b[\\s\\S]*?(\\[\\s*SELECT\\b|\\binsert\\s+\\w+\\s*;|\\bfor\\s*\\()[\\s\\S]*class\\s+CaseEscalationService\\b",
            },
            { op: "count", pattern: "CaseEscalationService\\s*\\.\\s*\\w+\\s*\\(", min: 3 },
          ],
        },
        onFail: {
          es: "Dentro de CaseTriggerHandler no puede quedar ni un bucle, ni una consulta, ni un insert: cada método se reduce a CaseEscalationService.elMetodo(newCases);. Y el botón también tiene que llamar al servicio.",
          en: "No loop, query or insert may remain in CaseTriggerHandler: each method shrinks to CaseEscalationService.theMethod(newCases);. And the button must call the service too.",
        },
        otter: {
          es: "El handler ya solo llama al subflow: dentro de CaseTriggerHandler no puede quedar ni un bucle, ni una consulta, ni un insert. Cada método se reduce a CaseEscalationService.elMetodo(newCases);, y el botón también llama al servicio.",
          en: "The handler now only calls the subflow: inside CaseTriggerHandler there cannot be a loop, a query or an insert left. Each method shrinks to CaseEscalationService.theMethod(newCases);, and the button calls the service too.",
        },
      },
      {
        id: "m07-l03-c4",
        label: { es: "El botón reutiliza la regla y guarda", en: "The button reuses the rule and saves" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+(with\\s+sharing\\s+)?class\\s+CaseActions\\b" },
            { op: "match", pattern: "static\\s+void\\s+recalculatePriority\\s*\\(\\s*Set\\s*<\\s*Id\\s*>\\s+\\w+\\s*\\)" },
            { op: "match", pattern: "class\\s+CaseActions\\b[\\s\\S]*FROM\\s+Case\\b[\\s\\S]*IN\\s*:\\s*\\w+" },
            { op: "match", pattern: "class\\s+CaseActions\\b[\\s\\S]*CaseEscalationService\\s*\\.\\s*\\w+\\s*\\([\\s\\S]*\\bupdate\\s+\\w+\\s*;" },
          ],
        },
        onFail: {
          es: "recalculatePriority(Set<Id> caseIds) consulta los casos con WHERE Id IN :caseIds, llama al servicio y DESPUÉS hace update: fuera de un trigger before, nadie guarda por ti.",
          en: "recalculatePriority(Set<Id> caseIds) queries the cases with WHERE Id IN :caseIds, calls the service and THEN updates: outside a before trigger, nobody saves for you.",
        },
        otter: {
          es: "El botón es otro flow que llama al mismo subflow: recalculatePriority(Set<Id> caseIds) consulta los casos con WHERE Id IN :caseIds, llama al servicio y DESPUÉS hace update. Fuera de un trigger before, nadie guarda por ti.",
          en: "The button is another flow calling the same subflow: recalculatePriority(Set<Id> caseIds) queries the cases with WHERE Id IN :caseIds, calls the service and THEN runs update. Outside a before trigger, nobody saves for you.",
        },
      },
      {
        id: "m07-l03-c5",
        label: { es: "El botón trae los campos que lee la regla", en: "The button fetches the fields the rule reads" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "class\\s+CaseActions\\b[\\s\\S]*SELECT[^\\]]*\\bOrigin\\b[^\\]]*FROM\\s+Case\\b" },
            { op: "match", pattern: "class\\s+CaseActions\\b[\\s\\S]*SELECT[^\\]]*\\bAccountId\\b[^\\]]*FROM\\s+Case\\b" },
          ],
        },
        onFail: {
          es: "La regla lee Origin y AccountId. Los registros que vienen de una consulta solo traen los campos pedidos: sin ellos, el servicio fallaría al leerlos.",
          en: "The rule reads Origin and AccountId. Records coming from a query only carry the fields asked for: without them, the service would fail reading them.",
        },
        otter: {
          es: "Es la regla del Módulo 3: una columna que no pides no viene. La regla lee Origin y AccountId, así que la consulta del botón tiene que traerlos.",
          en: "It is Module 3's rule: a column you do not ask for does not come. The rule reads Origin and AccountId, so the button's query has to fetch them.",
        },
      },
      {
        id: "m07-l03-c6",
        label: { es: "Nada fuera del trigger mira el contexto del trigger", en: "Nothing outside the trigger looks at the trigger context" },
        rule: { op: "absent", pattern: "class\\s+CaseTriggerHandler\\b[\\s\\S]*\\bTrigger\\s*\\." },
        onFail: {
          es: "Ni el handler, ni el servicio, ni el botón pueden usar Trigger.algo: el servicio recibe una lista y le da igual quién lo llame.",
          en: "Neither the handler, the service nor the button may use Trigger.something: the service takes a list and does not care who calls it.",
        },
        otter: {
          es: "Un subflow no sabe quién lo llama: ni el handler, ni el servicio, ni el botón pueden usar Trigger.algo. El servicio recibe una lista y le da igual de dónde venga.",
          en: "A subflow does not know who calls it: neither the handler, nor the service, nor the button can use Trigger.anything. The service receives a list and does not care where it comes from.",
        },
      },
    ],
    rubric: [
      {
        es: "Operaciones avisa: la org tiene una regla de workflow antigua sobre Case que, al guardar, rellena un campo… y con eso los triggers de update se disparan otra vez. En cuanto la tarea 4 añada una regla en update, eso va a duplicar tareas.",
        en: "Operations warns: the org has an old workflow rule on Case that fills in a field on save… and that fires the update triggers again. As soon as task 4 adds a rule on update, it will duplicate tasks.",
      },
    ],
    outro: {
      es: "Ya tienes la regla en un solo sitio: un servicio al que llaman el trigger y el botón, como un subflow compartido. En la tarea 4, una regla de workflow heredada crea tareas dobles, y la migración de casos antiguos no debería disparar nada.",
      en: "You now have the rule in one place: a service called by both the trigger and the button, like a shared subflow. In task 4, an inherited workflow rule creates duplicate tasks, and the migration of old cases should fire nothing.",
    },
    voice: "otter",
  },
};
