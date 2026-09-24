import type { Lesson } from "@/lib/types";

/** Task 3's solution plus the new on-update rule, with only Module 6's defence 2. */
const STARTER_CODE = `trigger CaseTrigger on Case (before insert, after insert, after update) {
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

    // NUEVO: un caso que un agente sube a 'High' también recibe su tarea
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

const SOLUTION = `trigger CaseTrigger on Case (before insert, after insert, after update) {
    // Interruptor: la migración de datos no dispara ninguna regla
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

    // Guardia: casos que ya tienen su tarea en ESTA transacción
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

export const l04GuardiaBypass: Lesson = {
  id: "m07-l04",
  slug: "guardia-y-bypass",
  n: 4,
  kind: "lesson",
  minutes: 36,
  title: { es: "La guardia y el interruptor", en: "The guard and the switch" },
  summary: {
    es: "Con la arquitectura ya ordenada, dos protecciones viven en un solo sitio: una guardia estática que impide hacer dos veces lo mismo en una transacción, y un interruptor con permiso personalizado para cargas de datos.",
    en: "With the architecture in order, two protections live in one place: a static guard that stops the same thing happening twice in a transaction, and a custom-permission switch for data loads.",
  },
  analogy: {
    es: "El permiso «Bypass» que ya usas en tus reglas de validación",
    en: "The “Bypass” permission you already use in your validation rules",
  },
  objectives: [
    {
      es: "Explicar por qué comparar old y new no basta cuando una regla de workflow vuelve a disparar el trigger.",
      en: "Explain why comparing old and new is not enough when a workflow rule fires the trigger again.",
    },
    {
      es: "Poner la guardia static Set<Id> en el sitio donde se hace el trabajo: el servicio.",
      en: "Put the static Set<Id> guard where the work happens: the service.",
    },
    {
      es: "Crear un interruptor con un permiso personalizado y FeatureManagement.checkPermission.",
      en: "Build a switch with a custom permission and FeatureManagement.checkPermission.",
    },
    {
      es: "Saber para quién es un bypass y para quién no.",
      en: "Know whom a bypass is for and whom it is not.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Soporte pidió una regla más: si un agente sube a mano la prioridad de un caso a 'High', su propietario también debe recibir la tarea de revisión. Se escribió con la defensa 2 del Módulo 6 —solo si la prioridad CAMBIÓ a 'High'— y en la sandbox iba perfecto. En producción, los agentes empezaron a ver dos tareas por caso. Lo que avisó Operaciones al final de la tarea 3 era verdad.",
        en: "Support asked for one more rule: if an agent manually raises a case's priority to 'High', its owner must get the review task too. It was written with Module 6's defence 2 — only if the priority CHANGED to 'High' — and in the sandbox it was perfect. In production, agents started seeing two tasks per case. What Operations warned at the end of task 3 was true.",
      },
    },
    {
      type: "h",
      text: { es: "Por qué la defensa 2 no basta aquí", en: "Why defence 2 is not enough here" },
    },
    {
      type: "p",
      text: {
        es: "La org heredada tiene una regla de workflow sobre Case que rellena un campo al guardar. En el Módulo 6 viste que, cuando una actualización de campo de workflow cambia el registro, los triggers de update se ejecutan una vez más. Lo que no viste es el detalle traicionero: en esa segunda pasada, Trigger.old NO trae la versión de justo antes del workflow, sino la de antes de la actualización ORIGINAL. Así que la comparación vuelve a ver 'Medium' → 'High', cree que la prioridad acaba de cambiar… y crea la tarea otra vez.",
        en: "The inherited org has a workflow rule on Case that fills in a field on save. In Module 6 you saw that when a workflow field update changes the record, the update triggers run one more time. What you did not see is the treacherous detail: in that second pass, Trigger.old does NOT hold the version from just before the workflow, but the one from before the ORIGINAL update. So the comparison sees 'Medium' → 'High' again, thinks the priority has just changed… and creates the task again.",
      },
    },
    {
      type: "diagram",
      id: "m07-guard-bypass",
      caption: {
        es: "Guarda primero sin guardia, luego con ella, y por último con el permiso de bypass.",
        en: "Save first without the guard, then with it, and finally with the bypass permission.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Todavía hay reglas de workflow?", en: "Are there still workflow rules?" },
      text: {
        es: "Salesforce dejó de dar soporte a Workflow Rules y Process Builder a finales de 2025 y recomienda migrarlas a Flow, pero en las orgs antiguas siguen activas muchas: por eso esto te lo vas a encontrar. Y la lección vale igual para los flows after-save que actualizan el mismo registro: cualquier segunda vuelta por el trigger es una ocasión de hacer las cosas dos veces.",
        en: "Salesforce ended support for Workflow Rules and Process Builder at the end of 2025 and recommends migrating them to Flow, but many are still active in older orgs: that is why you will run into this. And the lesson holds just as well for after-save flows that update the same record: any second trip through the trigger is a chance to do things twice.",
      },
    },
    {
      type: "h",
      text: { es: "La guardia, en su sitio", en: "The guard, where it belongs" },
    },
    {
      type: "p",
      text: {
        es: "La defensa 3 del Módulo 6 es la que resuelve esto: un Set<Id> static que recuerda qué registros ya se procesaron en la transacción. Lo nuevo es DÓNDE vive. Con la arquitectura de este módulo hay un sitio obvio: el método del servicio que hace el trabajo. Así la protección se aplica venga de donde venga la llamada —el after insert, el after update o una segunda pasada por culpa del workflow— y nadie tiene que acordarse de añadirla en cada puerta.",
        en: "Module 6's defence 3 is what solves this: a static Set<Id> that remembers which records were already processed in the transaction. What is new is WHERE it lives. With this module's architecture there is an obvious place: the service method that does the work. That way the protection applies wherever the call comes from — after insert, after update or a second pass caused by the workflow — and nobody has to remember to add it at each door.",
      },
    },
    {
      type: "code",
      code: {
        es: `public with sharing class CaseEscalationService {
    // Casos que ya tienen su tarea en ESTA transacción
    private static Set<Id> tasksCreatedFor = new Set<Id>();

    public static void createReviewTasks(List<Case> cases) {
        List<Task> tasks = new List<Task>();
        for (Case c : cases) {
            if (c.Priority == 'High' && !tasksCreatedFor.contains(c.Id)) {
                tasksCreatedFor.add(c.Id);
                tasks.add(new Task(WhatId = c.Id, OwnerId = c.OwnerId,
                                   Subject = 'Revisar caso escalado'));
            }
        }
        insert tasks;
    }
}`,
        en: `public with sharing class CaseEscalationService {
    // Cases that already have their task in THIS transaction
    private static Set<Id> tasksCreatedFor = new Set<Id>();

    public static void createReviewTasks(List<Case> cases) {
        List<Task> tasks = new List<Task>();
        for (Case c : cases) {
            if (c.Priority == 'High' && !tasksCreatedFor.contains(c.Id)) {
                tasksCreatedFor.add(c.Id);
                tasks.add(new Task(WhatId = c.Id, OwnerId = c.OwnerId,
                                   Subject = 'Review escalated case'));
            }
        }
        insert tasks;
    }
}`,
      },
      caption: {
        es: "private: nadie de fuera necesita tocar la guardia. static: vive lo que dura la transacción, y todas las llamadas de esa transacción la comparten.",
        en: "private: nobody outside needs to touch the guard. static: it lives as long as the transaction, and every call in that transaction shares it.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "La guardia no bloquea para siempre", en: "The guard does not block forever" },
      text: {
        es: "Una variable static se vacía al terminar la transacción. Si mañana un agente vuelve a subir el mismo caso a 'High', es otra transacción, la guardia empieza vacía y la tarea se crea: exactamente lo que quieres. Y por eso sigue siendo un Set<Id> y no un Boolean: un Boolean dejaría fuera los registros del segundo lote de 200 de la misma carga, como viste en el Módulo 6.",
        en: "A static variable empties when the transaction ends. If an agent raises the same case to 'High' again tomorrow, that is another transaction, the guard starts empty and the task gets created: exactly what you want. And that is why it is still a Set<Id> and not a Boolean: a Boolean would leave out the records in the second batch of 200 of the same load, as you saw in Module 6.",
      },
    },
    {
      type: "h",
      text: { es: "El interruptor: un bypass con permiso personalizado", en: "The switch: a bypass with a custom permission" },
    },
    {
      type: "p",
      text: {
        es: "La última petición de Soporte es la contraria: van a migrar 50.000 casos históricos de un sistema antiguo, y no quieren ni prioridades recalculadas ni miles de tareas en las colas. Hace falta un interruptor que apague las reglas… pero solo para quien hace la migración. La forma limpia es un [[permiso-personalizado|permiso personalizado]] (Custom Permission) que se asigna con un permission set solo al usuario de integración, y en el código una línea que lo comprueba: FeatureManagement.checkPermission devuelve true si el usuario que está ejecutando tiene ese permiso.",
        en: "Support's last request is the opposite one: they are going to migrate 50,000 historical cases from an old system, and they want neither recalculated priorities nor thousands of tasks in the queues. A switch is needed to turn the rules off… but only for whoever runs the migration. The clean way is a [[permiso-personalizado|Custom Permission]] assigned through a permission set to the integration user only, and a line in the code that checks it: FeatureManagement.checkPermission returns true if the running user holds that permission.",
      },
    },
    {
      type: "code",
      code: {
        es: `trigger CaseTrigger on Case (before insert, after insert, after update) {
    // Interruptor: si quien guarda tiene el permiso, no se aplica ninguna regla
    if (FeatureManagement.checkPermission('Bypass_Case_Triggers')) {
        return;
    }
    CaseTriggerHandler handler = new CaseTriggerHandler();
    switch on Trigger.operationType { /* … */ }
}`,
        en: `trigger CaseTrigger on Case (before insert, after insert, after update) {
    // Switch: if whoever saves holds the permission, no rule applies
    if (FeatureManagement.checkPermission('Bypass_Case_Triggers')) {
        return;
    }
    CaseTriggerHandler handler = new CaseTriggerHandler();
    switch on Trigger.operationType { /* … */ }
}`,
      },
      caption: {
        es: "Va arriba del todo, antes de crear el handler: una sola comprobación apaga todas las reglas del objeto a la vez.",
        en: "It goes at the very top, before creating the handler: one check turns off every rule on the object at once.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Es el mismo truco de tus reglas de validación", en: "It is the same trick as your validation rules" },
      text: {
        es: "Muchas orgs tienen un permiso personalizado «Bypass Validation Rules» y en cada regla una condición NOT($Permission.Bypass_Validation_Rules), para que las cargas masivas no choquen con validaciones pensadas para usuarios. El bypass del trigger es exactamente eso: $Permission en una fórmula, FeatureManagement.checkPermission en Apex. Mismo permiso, mismo permission set, misma persona.",
        en: "Many orgs have a “Bypass Validation Rules” custom permission and a NOT($Permission.Bypass_Validation_Rules) condition in every rule, so bulk loads do not collide with validations meant for users. The trigger bypass is exactly that: $Permission in a formula, FeatureManagement.checkPermission in Apex. Same permission, same permission set, same person.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Un bypass para todos es un agujero", en: "A bypass for everyone is a hole" },
      text: {
        es: "El permiso se asigna a usuarios concretos (integración, migración) y se documenta. Si acaba en el perfil estándar de todos, has apagado tu propia automatización sin que nadie lo note. Y nunca uses como interruptor un checkbox en el propio registro: cualquier usuario que pueda editar el caso podría saltarse las reglas.",
        en: "The permission is assigned to specific users (integration, migration) and documented. If it ends up on everyone's standard profile, you have switched off your own automation without anyone noticing. And never use a checkbox on the record itself as the switch: any user who can edit the case could skip the rules.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "En tu Developer Org", en: "In your Developer Org" },
      text: {
        es: "Setup → Custom Permissions → New: etiqueta «Bypass Case Triggers», nombre Bypass_Case_Triggers. Crea un permission set, añádele ese permiso y asígnatelo. Guarda un caso de una cuenta Hot: no debería cambiar su prioridad. Quítate el permission set y repite: la regla vuelve. Así se prueba un bypass antes de dárselo al usuario de integración.",
        en: "Setup → Custom Permissions → New: label “Bypass Case Triggers”, name Bypass_Case_Triggers. Create a permission set, add that permission and assign it to yourself. Save a case from a Hot account: its priority should not change. Remove the permission set and repeat: the rule comes back. That is how you test a bypass before handing it to the integration user.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: tras una actualización de campo de workflow, ¿qué versión trae Trigger.old? ¿Por qué la guardia va en el servicio y no en el trigger? ¿A quién se le asigna el permiso de bypass?",
        en: "Without looking: after a workflow field update, which version does Trigger.old hold? Why does the guard go in the service and not the trigger? Who gets the bypass permission?",
      },
    },
  ],

  quiz: [
    {
      id: "m07-l04-q1",
      kind: "single",
      prompt: {
        es: "Un agente cambia la prioridad de 'Medium' a 'High'. Una regla de workflow rellena otro campo y los triggers de update se ejecutan otra vez. En esa segunda pasada, ¿qué prioridad trae Trigger.old?",
        en: "An agent changes priority from 'Medium' to 'High'. A workflow rule fills another field and the update triggers run again. In that second pass, what priority does Trigger.old hold?",
      },
      options: [
        { es: "'Medium': la versión de antes de la actualización original.", en: "'Medium': the version from before the original update." },
        { es: "'High': la versión de justo antes del workflow.", en: "'High': the version from just before the workflow." },
        { es: "null: en la segunda pasada no hay Trigger.old.", en: "null: there is no Trigger.old in the second pass." },
        { es: "Depende del orden de los triggers.", en: "It depends on the triggers' order." },
      ],
      answer: 0,
      explain: {
        es: "Es el detalle documentado que rompe la defensa 2: Trigger.old sigue con los valores de antes del primer guardado, así que el «cambio a 'High'» parece nuevo otra vez.",
        en: "It is the documented detail that breaks defence 2: Trigger.old keeps the values from before the first save, so the “change to 'High'” looks new again.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m07-l04-q2",
      kind: "single",
      prompt: {
        es: "¿Dónde conviene poner la guardia static Set<Id> que evita crear dos veces la misma tarea?",
        en: "Where is the best place for the static Set<Id> guard that stops the same task being created twice?",
      },
      options: [
        { es: "En el método del servicio que crea las tareas.", en: "In the service method that creates the tasks." },
        { es: "En el trigger, antes del switch.", en: "In the trigger, before the switch." },
        { es: "En cada método del handler por separado.", en: "In each handler method separately." },
        { es: "En un campo checkbox del caso.", en: "In a checkbox field on the case." },
      ],
      answer: 0,
      explain: {
        es: "Donde se hace el trabajo: así protege todas las puertas que llegan a él (insert, update, segunda pasada) sin tener que repetirla. Un checkbox en el registro necesitaría un DML y lo podría tocar cualquiera.",
        en: "Where the work happens: that way it guards every door leading to it (insert, update, second pass) without repeating it. A checkbox on the record would need DML and anyone could change it.",
      },
      tags: ["recall"],
    },
    {
      id: "m07-l04-q3",
      kind: "single",
      prompt: {
        es: "Hoy la guardia evitó una tarea duplicada del caso 00001234. Mañana un agente vuelve a subir ese caso a 'High'. ¿Se crea la tarea?",
        en: "Today the guard prevented a duplicate task for case 00001234. Tomorrow an agent raises that case to 'High' again. Is the task created?",
      },
      options: [
        {
          es: "Sí: es otra transacción y la variable static empieza vacía.",
          en: "Yes: it is another transaction and the static variable starts empty.",
        },
        { es: "No: el Id se quedó guardado en la guardia.", en: "No: the Id stayed stored in the guard." },
        { es: "Solo si alguien reinicia la org.", en: "Only if someone restarts the org." },
        { es: "Solo si el usuario tiene el permiso de bypass.", en: "Only if the user has the bypass permission." },
      ],
      answer: 0,
      explain: {
        es: "Las variables static viven lo que dura la transacción. La guardia impide duplicados dentro de una misma ejecución, no para siempre.",
        en: "Static variables live as long as the transaction. The guard prevents duplicates within one run, not forever.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m07-l04-q4",
      kind: "single",
      prompt: {
        es: "¿Qué devuelve FeatureManagement.checkPermission('Bypass_Case_Triggers')?",
        en: "What does FeatureManagement.checkPermission('Bypass_Case_Triggers') return?",
      },
      options: [
        {
          es: "true si el usuario que ejecuta el código tiene ese permiso personalizado.",
          en: "true if the user running the code holds that custom permission.",
        },
        { es: "true si el caso tiene marcado un campo Bypass.", en: "true if the case has a Bypass field ticked." },
        { es: "true si el trigger está desactivado en Setup.", en: "true if the trigger is deactivated in Setup." },
        { es: "La lista de usuarios con ese permiso.", en: "The list of users with that permission." },
      ],
      answer: 0,
      explain: {
        es: "Pregunta por el usuario que está ejecutando, igual que $Permission en una fórmula. Por eso el permiso se asigna solo al usuario de la migración.",
        en: "It asks about the running user, just like $Permission in a formula. That is why the permission goes only to the migration user.",
      },
      tags: ["recall"],
    },
    {
      id: "m07-l04-q5",
      kind: "multi",
      prompt: {
        es: "¿Qué formas de montar el bypass son una mala idea?",
        en: "Which ways of building the bypass are a bad idea?",
      },
      options: [
        { es: "Un checkbox «Saltar reglas» en el propio caso.", en: "A “Skip rules” checkbox on the case itself." },
        { es: "Asignar el permiso de bypass en el perfil estándar de todos los usuarios.", en: "Granting the bypass permission on everyone's standard profile." },
        { es: "Un permiso personalizado en un permission set asignado solo al usuario de integración.", en: "A custom permission in a permission set assigned only to the integration user." },
        { es: "Desactivar el trigger en producción cada vez que hay una carga.", en: "Deactivating the trigger in production every time there is a load." },
      ],
      answers: [0, 1, 3],
      explain: {
        es: "El checkbox lo puede marcar cualquiera que edite el caso; el perfil de todos apaga la automatización para toda la org; desactivar el trigger exige un despliegue y lo apaga también para los usuarios que siguen trabajando. El permiso en un permission set concreto es el camino.",
        en: "Anyone editing the case can tick the checkbox; everyone's profile switches automation off for the whole org; deactivating the trigger needs a deployment and turns it off for users still working too. The permission in a specific permission set is the way.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m07-l04-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿por qué la guardia es un Set<Id> y no un static Boolean?",
        en: "Review: why is the guard a Set<Id> and not a static Boolean?",
      },
      options: [
        {
          es: "Un Boolean se queda en true tras el primer lote de 200 y el segundo lote de la misma carga no se procesaría.",
          en: "A Boolean stays true after the first batch of 200 and the second batch of the same load would not be processed.",
        },
        { es: "Apex no permite Booleans static.", en: "Apex does not allow static Booleans." },
        { es: "Un Set<Id> gasta menos memoria.", en: "A Set<Id> uses less memory." },
        { es: "No hay diferencia; es cuestión de estilo.", en: "There is no difference; it is a style choice." },
      ],
      answer: 0,
      explain: {
        es: "La plataforma parte las cargas grandes en lotes de 200 dentro de la misma transacción. Un Boolean diría «ya procesé» a los registros nuevos del segundo lote; un Set<Id> recuerda registro a registro.",
        en: "The platform splits big loads into batches of 200 within the same transaction. A Boolean would tell the second batch's new records “already processed”; a Set<Id> remembers record by record.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M6 recursión", en: "Review · M6 recursion" },
    },
    {
      id: "m07-l04-q7",
      kind: "text",
      prompt: {
        es: "Escribe la condición de fórmula que usa un Admin para que una regla de validación no afecte a quien tiene el permiso Bypass_Validation.",
        en: "Write the formula condition an Admin uses so a validation rule does not affect whoever holds the Bypass_Validation permission.",
      },
      accept: ["not\\(\\s*\\$permission\\.bypass_validation\\s*\\)"],
      placeholder: { es: "NOT(…)", en: "NOT(…)" },
      explain: {
        es: "NOT($Permission.Bypass_Validation). En Apex, lo mismo es FeatureManagement.checkPermission('Bypass_Validation').",
        en: "NOT($Permission.Bypass_Validation). In Apex, the same thing is FeatureManagement.checkPermission('Bypass_Validation').",
      },
      tags: ["interleaving"],
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 4 DE 5 · En el código de partida está todo lo de las tareas 1 a 3 más la regla nueva de Soporte (tarea para los casos que un agente sube a 'High'), escrita solo con la defensa 2. Por culpa de la regla de workflow heredada, crea tareas dobles. Añade la guardia que lo impide y el interruptor para la migración de casos antiguos.",
      en: "TASK 4 OF 5 · The starter holds everything from tasks 1 to 3 plus Support's new rule (a task for cases an agent raises to 'High'), written with defence 2 only. Because of the inherited workflow rule, it creates double tasks. Add the guard that prevents it and the switch for the old-cases migration.",
    },
    brief: [
      {
        es: "En CaseEscalationService, una guardia private static Set<Id> que recuerde a qué casos ya se les creó la tarea en esta transacción.",
        en: "In CaseEscalationService, a private static Set<Id> guard remembering which cases already got their task in this transaction.",
      },
      {
        es: "Úsala donde se crean las tareas: salta los casos que ya están en el Set y añade los que procesas. Así protege tanto el after insert como el after update.",
        en: "Use it where the tasks are created: skip cases already in the Set and add the ones you process. That way it guards both after insert and after update.",
      },
      {
        es: "Nada de static Boolean: tiene que funcionar con cargas de más de 200 registros.",
        en: "No static Boolean: it must work with loads over 200 records.",
      },
      {
        es: "El interruptor: si FeatureManagement.checkPermission('Bypass_Case_Triggers') es true, no se aplica ninguna regla. Ponlo en un solo sitio, lo antes posible.",
        en: "The switch: if FeatureManagement.checkPermission('Bypass_Case_Triggers') is true, no rule applies. Put it in one place, as early as possible.",
      },
      {
        es: "El trigger sigue sin lógica, y fuera de él nada usa Trigger.",
        en: "The trigger still holds no logic, and nothing outside it uses Trigger.",
      },
    ],
    starter: {
      es: `// CASO: el trigger heredado de Soporte · objeto Case
// Ya resuelto: un trigger (1), un handler (2), un servicio y el botón (3).
// Tarea 4 de 5: sin tareas dobles, y con interruptor para la migración.
// Ojo: la regla de workflow heredada vuelve a disparar el after update.

${STARTER_CODE}
`,
      en: `// CASE: Support's inherited trigger · Case object
// Already solved: one trigger (1), a handler (2), a service and the button (3).
// Task 4 of 5: no double tasks, and a switch for the migration.
// Careful: the inherited workflow rule fires after update again.

${STARTER_CODE}
`,
    },
    hints: [
      {
        es: "Dos piezas independientes. La guardia es una variable que vive toda la transacción dentro del servicio; el interruptor es una comprobación que corta la ejecución antes de que empiece ninguna regla.",
        en: "Two independent pieces. The guard is a variable living the whole transaction inside the service; the switch is a check that cuts execution before any rule starts.",
      },
      {
        es: "La guardia va en createReviewTasks, que es por donde pasan las dos puertas: añade !tasksCreatedFor.contains(c.Id) a la condición y tasksCreatedFor.add(c.Id) al crear la tarea. El interruptor, arriba del todo en el trigger: if (…) { return; }",
        en: "The guard goes in createReviewTasks, which both doors go through: add !tasksCreatedFor.contains(c.Id) to the condition and tasksCreatedFor.add(c.Id) when creating the task. The switch, at the very top of the trigger: if (…) { return; }",
      },
      {
        es: "Pseudocódigo: private static Set<Id> tasksCreatedFor = new Set<Id>(); … if (c.Priority == 'High' && !tasksCreatedFor.contains(c.Id)) { tasksCreatedFor.add(c.Id); tasks.add(…); } — y en el trigger: if (FeatureManagement.checkPermission('Bypass_Case_Triggers')) { return; }",
        en: "Pseudocode: private static Set<Id> tasksCreatedFor = new Set<Id>(); … if (c.Priority == 'High' && !tasksCreatedFor.contains(c.Id)) { tasksCreatedFor.add(c.Id); tasks.add(…); } — and in the trigger: if (FeatureManagement.checkPermission('Bypass_Case_Triggers')) { return; }",
      },
    ],
    solution: { es: SOLUTION, en: SOLUTION },
    checks: [
      {
        id: "m07-l04-c1",
        label: { es: "La guardia es un static Set<Id> del servicio", en: "The guard is a service static Set<Id>" },
        rule: {
          op: "all",
          of: [
            {
              op: "match",
              pattern:
                "class\\s+CaseEscalationService\\b[\\s\\S]*\\bstatic\\s+Set\\s*<\\s*Id\\s*>\\s+\\w+\\s*=\\s*new\\s+Set\\s*<\\s*Id\\s*>\\s*\\(\\s*\\)[\\s\\S]*class\\s+CaseActions\\b",
            },
            { op: "absent", pattern: "\\bstatic\\s+Boolean\\b" },
          ],
        },
        onFail: {
          es: "Declara la guardia dentro de CaseEscalationService: private static Set<Id> tasksCreatedFor = new Set<Id>();. Un static Boolean no vale: dejaría fuera el segundo lote de 200 de una misma carga.",
          en: "Declare the guard inside CaseEscalationService: private static Set<Id> tasksCreatedFor = new Set<Id>();. A static Boolean will not do: it would leave out the second batch of 200 in the same load.",
        },
      },
      {
        id: "m07-l04-c2",
        label: { es: "La guardia se consulta y se rellena caso a caso", en: "The guard is checked and filled case by case" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "!\\s*\\w+\\s*\\.\\s*contains\\s*\\(\\s*\\w+\\s*\\.\\s*Id\\s*\\)" },
            { op: "match", pattern: "\\w+\\s*\\.\\s*add\\s*\\(\\s*\\w+\\s*\\.\\s*Id\\s*\\)\\s*;[\\s\\S]*class\\s+CaseActions\\b" },
          ],
        },
        onFail: {
          es: "La guardia solo sirve si se usa: salta los casos que ya están (!tasksCreatedFor.contains(c.Id)) y apunta los que procesas (tasksCreatedFor.add(c.Id)), en el bucle que crea las tareas.",
          en: "The guard only helps if it is used: skip cases already in it (!tasksCreatedFor.contains(c.Id)) and record the ones you process (tasksCreatedFor.add(c.Id)), in the loop that creates the tasks.",
        },
        onPass: {
          es: "Y como está en createReviewTasks, protege a la vez el after insert, el after update y la segunda pasada del workflow.",
          en: "And being in createReviewTasks, it guards after insert, after update and the workflow's second pass at once.",
        },
      },
      {
        id: "m07-l04-c3",
        label: { es: "El interruptor comprueba el permiso y corta", en: "The switch checks the permission and cuts off" },
        rule: {
          op: "match",
          pattern: "FeatureManagement\\s*\\.\\s*checkPermission\\s*\\(\\s*'Bypass_Case_Triggers'\\s*\\)\\s*\\)\\s*\\{?\\s*return\\s*;",
        },
        onFail: {
          es: "if (FeatureManagement.checkPermission('Bypass_Case_Triggers')) { return; } — con el nombre de API exacto del permiso y un return que corte antes de que se aplique ninguna regla.",
          en: "if (FeatureManagement.checkPermission('Bypass_Case_Triggers')) { return; } — with the permission's exact API name and a return that cuts off before any rule applies.",
        },
      },
      {
        id: "m07-l04-c4",
        label: { es: "El interruptor está en un solo sitio, arriba", en: "The switch is in one place, at the top" },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "checkPermission\\s*\\(", min: 1, max: 1 },
            { op: "match", pattern: "trigger\\s+CaseTrigger\\b[^{]*\\{\\s*if\\s*\\(\\s*FeatureManagement\\s*\\.\\s*checkPermission" },
          ],
        },
        onFail: {
          es: "Una sola comprobación, como primera línea del trigger: así apaga todas las reglas del objeto a la vez y nadie tiene que repetirla en cada método.",
          en: "A single check, as the trigger's first line: that way it turns off every rule on the object at once and nobody has to repeat it in each method.",
        },
      },
      {
        id: "m07-l04-c5",
        label: { es: "La arquitectura sigue intacta", en: "The architecture is still intact" },
        rule: {
          op: "all",
          of: [
            {
              op: "absent",
              pattern: "trigger\\s+CaseTrigger\\b[\\s\\S]*?(\\[\\s*SELECT\\b|\\binsert\\s+\\w+\\s*;|\\bfor\\s*\\()[\\s\\S]*class\\s+CaseTriggerHandler\\b",
            },
            { op: "absent", pattern: "class\\s+CaseTriggerHandler\\b[\\s\\S]*\\bTrigger\\s*\\." },
            { op: "match", pattern: "\\.\\s*afterUpdate\\s*\\(\\s*Trigger\\s*\\.\\s*new\\s*,\\s*Trigger\\s*\\.\\s*oldMap\\s*\\)" },
          ],
        },
        onFail: {
          es: "El trigger sigue sin consultas, DML ni bucles, las clases no usan Trigger. y la rama AFTER_UPDATE sigue pasando Trigger.new y Trigger.oldMap al handler.",
          en: "The trigger still has no queries, DML or loops, the classes do not use Trigger., and the AFTER_UPDATE branch still hands Trigger.new and Trigger.oldMap to the handler.",
        },
      },
    ],
    rubric: [
      {
        es: "Ya tienes la arquitectura completa: un trigger, un handler, un servicio, una guardia y un interruptor. La tarea 5 no arregla nada: la usa para entregar una regla nueva desde cero.",
        en: "You now have the full architecture: one trigger, a handler, a service, a guard and a switch. Task 5 fixes nothing: it uses it to deliver a brand-new rule from scratch.",
      },
    ],
  },
};
