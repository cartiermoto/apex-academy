import type { Lesson } from "@/lib/types";

const TWO_TRIGGERS = `// CaseEscalation.trigger · el del checkpoint del Módulo 6
trigger CaseEscalation on Case (before insert, after insert) {
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
}

// CaseWebDefaults.trigger · lo creó un compañero el mes pasado
trigger CaseWebDefaults on Case (before insert) {
    for (Case c : Trigger.new) {
        if (c.Origin == 'Web') {
            c.Priority = 'Low';
        }
    }
}`;

const SOLUTION = `trigger CaseTrigger on Case (before insert, after insert) {
    switch on Trigger.operationType {
        when BEFORE_INSERT {
            // 1 · Por defecto: lo que llega por la web empieza en Low
            for (Case c : Trigger.new) {
                if (c.Origin == 'Web') {
                    c.Priority = 'Low';
                }
            }

            // 2 · Escalado: va DESPUÉS, así que gana al valor por defecto
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
        when AFTER_INSERT {
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
    }
}`;

const SOLUTION_EN = SOLUTION.replace(
  "// 1 · Por defecto: lo que llega por la web empieza en Low",
  "// 1 · Default: whatever comes from the web starts at Low",
).replace(
  "// 2 · Escalado: va DESPUÉS, así que gana al valor por defecto",
  "// 2 · Escalation: runs AFTER, so it beats the default",
);

const TWO_TRIGGERS_EN = TWO_TRIGGERS.replace(
  "// CaseEscalation.trigger · el del checkpoint del Módulo 6",
  "// CaseEscalation.trigger · the one from Module 6's checkpoint",
).replace(
  "// CaseWebDefaults.trigger · lo creó un compañero el mes pasado",
  "// CaseWebDefaults.trigger · a colleague created it last month",
);

export const l01UnTriggerPorObjeto: Lesson = {
  id: "m07-l01",
  slug: "un-trigger-por-objeto",
  n: 1,
  kind: "lesson",
  minutes: 30,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso del Módulo 6", en: "Remember? · Review of Module 6" },
    prompt: { es: "Si dos triggers sobre Case ponen Priority a valores distintos, ¿cuál gana?", en: "If two triggers on Case set Priority to different values, which one wins?" },
    options: [
      { es: "El que se creó primero", en: "The one created first" },
      { es: "El que corra el último, y ese orden no está garantizado", en: "Whichever runs last, and that order is not guaranteed" },
      { es: "Siempre el trigger before", en: "Always the before trigger" },
    ],
    answer: 1,
    explain: { es: "No hay Trigger Order para los triggers de Apex: el orden lo decide la plataforma. Hoy verás la única solución: que no haya dos.", en: "Apex triggers have no Trigger Order: the platform decides the order. Today you will see the only fix: for there not to be two." },
  },
  title: {
    es: "Un trigger por objeto, y por qué sin lógica",
    en: "One trigger per object, and why with no logic",
  },
  summary: {
    es: "Dos triggers sobre el mismo objeto y evento se ejecutan en el orden que a la plataforma le parezca. La regla profesional es uno por objeto, y el primer paso para cumplirla es Trigger.operationType.",
    en: "Two triggers on the same object and event run in whatever order the platform likes. The professional rule is one per object, and the first step to keeping it is Trigger.operationType.",
  },
  analogy: {
    es: "Varios flows del mismo objeto sin ordenar en Flow Trigger Explorer",
    en: "Several unordered flows on one object in Flow Trigger Explorer",
  },
  objectives: [
    {
      es: "Explicar por qué dos triggers del mismo objeto y evento son un error aunque «funcionen».",
      en: "Explain why two triggers on the same object and event are a bug even when they “work”.",
    },
    {
      es: "Unir varios triggers en uno solo que decide el evento con switch on Trigger.operationType.",
      en: "Merge several triggers into a single one that picks the event with switch on Trigger.operationType.",
    },
    {
      es: "Escribir el orden de las reglas a propósito, en lugar de dejárselo a la plataforma.",
      en: "Write the order of the rules on purpose, instead of leaving it to the platform.",
    },
    {
      es: "Reconocer por qué la lógica dentro del trigger es el siguiente problema a resolver.",
      en: "Recognise why logic inside the trigger is the next problem to solve.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "El trigger CaseEscalation del Módulo 6 funcionó: los casos de cuentas Hot suben a 'High' y su propietario recibe una tarea. Un mes después, Soporte pidió otra regla —lo que entra por la web empieza en 'Low'— y un compañero, con prisa, creó un segundo trigger sobre Case. Nadie lo revisó, porque «funcionaba». Esta sub-lección va de por qué ese «funcionaba» es una bomba de relojería, y de cómo desactivarla.",
        en: "Module 6's CaseEscalation trigger worked: cases from Hot accounts go up to 'High' and their owner gets a task. A month later, Support asked for another rule — whatever comes in through the web starts at 'Low' — and a colleague, in a hurry, created a second trigger on Case. Nobody reviewed it, because “it worked”. This sub-lesson is about why that “it worked” is a time bomb, and how to defuse it.",
      },
    },
    {
      type: "h",
      text: { es: "El encargo de este módulo", en: "This module's assignment" },
    },
    {
      type: "p",
      text: {
        es: "Como en los módulos anteriores, los cinco talleres son un solo encargo. Esta vez no es una funcionalidad nueva, sino algo que vas a hacer muchísimas veces en tu vida profesional: heredar código ajeno y ponerlo en orden sin romper nada. Partimos del trigger del Módulo 6 y del que añadió tu compañero, y al final del módulo habrás construido la arquitectura con la que trabajan las orgs profesionales… y la usarás para entregar una regla nueva de Soporte.",
        en: "As in earlier modules, the five workshops are one assignment. This time it is not a new feature, but something you will do countless times in your working life: inherit someone else's code and put it in order without breaking anything. We start from Module 6's trigger and the one your colleague added, and by the end of the module you will have built the architecture professional orgs work with… and used it to deliver a new rule for Support.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El encargo, tal cual lo cuenta el jefe de Soporte", en: "The assignment, as the Support lead tells it" },
      text: {
        es: "Vengo de hablar con el jefe de Soporte, y esto es lo que me contó, tal cual: «Los casos de Hot a veces salen en 'Low' y nadie sabe por qué. Queremos que eso no vuelva a pasar, que las reglas de casos estén en un solo sitio, que el botón de recalcular prioridad use la misma regla, que no se dupliquen las tareas, que la migración de casos antiguos no dispare nada… y, cuando esté todo en orden, una regla nueva: cuando se cierra un caso urgente, el comercial de la cuenta tiene que enterarse». Cinco tareas; la de hoy es la primera frase.",
        en: "I have just talked to the head of Support, and this is what they told me, word for word: “Hot cases sometimes come out as 'Low' and nobody knows why. We want that never to happen again, the case rules to live in one place, the recalculate-priority button to use the same rule, no duplicated tasks, the migration of old cases not to fire anything… and, once it is all in order, a new rule: when an urgent case closes, the account's sales rep has to find out.” Five tasks; today's is the first sentence.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "Dos triggers, dos resultados", en: "Two triggers, two results" },
    },
    {
      type: "p",
      text: {
        es: "En el Módulo 6 viste la frase de pasada: Salesforce no garantiza en qué orden se ejecutan dos triggers del mismo objeto y el mismo evento. Aquí se nota por qué importa. CaseWebDefaults pone 'Low' a lo que viene de la web; CaseEscalation pone 'High' a lo que viene de una cuenta Hot. Un caso que cumple las dos cosas termina con la prioridad del que se ejecute el último. Pulsa guardar varias veces en el diagrama.",
        en: "In Module 6 you saw the sentence in passing: Salesforce does not guarantee in which order two triggers on the same object and the same event run. Here you can see why it matters. CaseWebDefaults sets 'Low' on whatever comes from the web; CaseEscalation sets 'High' on whatever comes from a Hot account. A case that meets both ends up with the priority of whichever runs last. Press save several times in the diagram.",
      },
    },
    {
      type: "diagram",
      id: "m07-two-triggers",
      caption: {
        es: "Guarda el mismo caso varias veces con dos triggers; luego activa «un solo trigger» y repite.",
        en: "Save the same case several times with two triggers; then switch on “one trigger” and repeat.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Tú ya tienes esta herramienta… para los flows", en: "You already have this tool… for flows" },
      text: {
        es: "Yo ordenaba mis flows con Flow Trigger Explorer y el campo Trigger Order: si dos flows del mismo objeto chocan, les pones número y se acabó. Los triggers de Apex no tienen nada parecido. La única forma de decidir el orden es que no haya dos: un solo trigger por objeto, y dentro, las reglas en el orden que tú escribas.",
        en: "I ordered my flows with Flow Trigger Explorer and the Trigger Order field: if two flows on the same object clash, you number them and that is that. Apex triggers have nothing like it. The only way to decide the order is for there not to be two: one trigger per object, and inside it, the rules in the order you write them.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "Trigger.operationType: el evento en una sola variable", en: "Trigger.operationType: the event in one variable" },
    },
    {
      type: "p",
      text: {
        es: "Un solo trigger por objeto significa que ese trigger escucha todos los eventos que necesite. En el Módulo 6 los distinguías con Booleans (Trigger.isBefore, Trigger.isInsert…) combinados en if. Hay algo más limpio: Trigger.operationType, que guarda el evento completo —momento y operación— en un único valor. Y como es un valor exacto, encaja con el switch del Módulo 2.",
        en: "One trigger per object means that trigger listens to every event it needs. In Module 6 you told them apart with Booleans (Trigger.isBefore, Trigger.isInsert…) combined in ifs. There is something cleaner: Trigger.operationType, which holds the whole event — moment and operation — in a single value. And since it is an exact value, it fits Module 2's switch.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Trigger.operationType vale…", en: "Trigger.operationType is…" },
        { es: "Equivale a", en: "Equivalent to" },
      ],
      rows: [
        [{ es: "BEFORE_INSERT", en: "BEFORE_INSERT" }, { es: "Trigger.isBefore && Trigger.isInsert", en: "Trigger.isBefore && Trigger.isInsert" }],
        [{ es: "BEFORE_UPDATE", en: "BEFORE_UPDATE" }, { es: "Trigger.isBefore && Trigger.isUpdate", en: "Trigger.isBefore && Trigger.isUpdate" }],
        [{ es: "BEFORE_DELETE", en: "BEFORE_DELETE" }, { es: "Trigger.isBefore && Trigger.isDelete", en: "Trigger.isBefore && Trigger.isDelete" }],
        [{ es: "AFTER_INSERT", en: "AFTER_INSERT" }, { es: "Trigger.isAfter && Trigger.isInsert", en: "Trigger.isAfter && Trigger.isInsert" }],
        [{ es: "AFTER_UPDATE", en: "AFTER_UPDATE" }, { es: "Trigger.isAfter && Trigger.isUpdate", en: "Trigger.isAfter && Trigger.isUpdate" }],
        [{ es: "AFTER_DELETE", en: "AFTER_DELETE" }, { es: "Trigger.isAfter && Trigger.isDelete", en: "Trigger.isAfter && Trigger.isDelete" }],
        [{ es: "AFTER_UNDELETE", en: "AFTER_UNDELETE" }, { es: "Trigger.isUndelete (solo existe en after)", en: "Trigger.isUndelete (after only)" }],
      ],
    },
    {
      type: "code",
      code: {
        es: `trigger OpportunityTrigger on Opportunity (before insert, before update, after update) {
    switch on Trigger.operationType {
        when BEFORE_INSERT, BEFORE_UPDATE {
            // lo mismo para crear y para editar: una sola rama
        }
        when AFTER_UPDATE {
            // solo al editar, y después de guardar
        }
    }
}`,
        en: `trigger OpportunityTrigger on Opportunity (before insert, before update, after update) {
    switch on Trigger.operationType {
        when BEFORE_INSERT, BEFORE_UPDATE {
            // the same for create and edit: one branch
        }
        when AFTER_UPDATE {
            // on edit only, and after saving
        }
    }
}`,
      },
      caption: {
        es: "Los valores del enum se escriben sin comillas y sin prefijo dentro del when. Y un when admite varios separados por comas, como en el Módulo 2.",
        en: "Enum values are written with no quotes and no prefix inside the when. And one when accepts several separated by commas, as in Module 2.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "La lista de eventos del trigger y el switch tienen que cuadrar", en: "The trigger's event list and the switch must match" },
      text: {
        es: "Si escribes when AFTER_UPDATE pero en la cabecera del trigger no pusiste after update, esa rama no se ejecutará nunca: la plataforma ni siquiera llama al trigger en ese evento. Y al revés: si el trigger escucha un evento que ningún when atiende, se dispara para nada. Lo que está entre paréntesis en la primera línea manda.",
        en: "If you write when AFTER_UPDATE but did not put after update in the trigger's header, that branch will never run: the platform does not even call the trigger on that event. And the other way round: if the trigger listens to an event no when handles, it fires for nothing. What sits in brackets on the first line rules.",
      },
    },
    {
      type: "h",
      text: { es: "Y ahora el problema de verdad: la lógica dentro", en: "And now the real problem: logic inside" },
    },
    {
      type: "p",
      text: {
        es: "Unir los dos triggers en uno arregla el orden, pero deja otro problema a la vista: el archivo empieza a mezclar reglas que no tienen nada que ver. Con dos reglas se lee; con diez, es un documento de 400 líneas donde nadie se atreve a tocar nada. Además, esa lógica solo se puede ejecutar guardando un caso: si mañana Soporte quiere un botón que aplique la misma regla, habría que copiarla. Por eso la norma completa es «un trigger por objeto, y sin lógica». Hoy cumples la primera mitad; la segunda es la tarea 2.",
        en: "Merging the two triggers into one fixes the order, but exposes another problem: the file starts mixing rules that have nothing to do with each other. With two rules it reads fine; with ten, it is a 400-line document nobody dares touch. Besides, that logic can only run by saving a case: if Support wants a button tomorrow that applies the same rule, it would have to be copied. That is why the full rule is “one trigger per object, and no logic”. Today you meet the first half; the second is task 2.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El flow gigante que nadie quiere abrir", en: "The giant flow nobody wants to open" },
      text: {
        es: "Yo he heredado alguno: un Record-Triggered Flow con cuarenta elementos, decisiones anidadas y un lienzo que no cabe en la pantalla. Funciona, pero cada cambio da miedo. Un trigger con toda la lógica dentro es exactamente eso, en código. Y la solución también se parece: en Flow sacabas trozos a subflows; en Apex, a clases.",
        en: "I have inherited a few: a Record-Triggered Flow with forty elements, nested decisions and a canvas that does not fit on the screen. It works, but every change is scary. A trigger with all the logic inside is exactly that, in code. And the fix looks alike too: in Flow you moved pieces into subflows; in Apex, into classes.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "En tu Developer Org", en: "In your Developer Org" },
      text: {
        es: "Setup → Object Manager → Case → Triggers te lista todos los triggers del objeto. Es la primera parada cuando heredas una org: si ves dos o más sobre el mismo objeto, ya sabes cuál es tu primera tarea. Crea en tu org los dos triggers del código de partida, guarda un caso de una cuenta con Rating 'Hot' y Origin 'Web', y mira qué prioridad le queda.",
        en: "Setup → Object Manager → Case → Triggers lists every trigger on the object. It is the first stop when you inherit an org: if you see two or more on the same object, you know your first task. Create the two triggers from the starter in your org, save a case from an account with Rating 'Hot' and Origin 'Web', and look at the priority it ends up with.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿por qué dos triggers del mismo objeto y evento son un problema aunque los dos estén bien escritos? ¿Qué valor de Trigger.operationType equivale a isAfter && isUpdate? Si en un switch dos reglas asignan el mismo campo, ¿cuál gana?",
        en: "Without looking: why are two triggers on the same object and event a problem even if both are well written? Which Trigger.operationType value is isAfter && isUpdate? If two rules in a switch assign the same field, which wins?",
      },
    },
  ],

  quiz: [
    {
      id: "m07-l01-q1",
      kind: "single",
      prompt: {
        es: "Hay dos triggers before insert sobre Case. Uno pone Priority = 'Low' y el otro Priority = 'High'. ¿Qué prioridad tiene el caso al guardarse?",
        en: "There are two before insert triggers on Case. One sets Priority = 'Low' and the other Priority = 'High'. What priority does the case have when saved?",
      },
      options: [
        { es: "No se puede saber: depende del orden, y la plataforma no lo garantiza.", en: "You cannot tell: it depends on the order, and the platform does not guarantee it." },
        { es: "'High', porque es la prioridad más alta.", en: "'High', because it is the higher priority." },
        { es: "'Low', porque el trigger más antiguo se ejecuta primero.", en: "'Low', because the older trigger runs first." },
        { es: "Salesforce lanza un error por conflicto.", en: "Salesforce throws a conflict error." },
      ],
      answer: 0,
      explain: {
        es: "Gana el que se ejecute el último, y el orden entre triggers del mismo objeto y evento no está garantizado: ni por antigüedad ni por nombre. Por eso la regla es uno por objeto.",
        en: "Whichever runs last wins, and the order between triggers on the same object and event is not guaranteed: not by age, not by name. That is why the rule is one per object.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m07-l01-q2",
      kind: "single",
      prompt: {
        es: "¿Qué valor de Trigger.operationType equivale a Trigger.isAfter && Trigger.isUpdate?",
        en: "Which Trigger.operationType value is Trigger.isAfter && Trigger.isUpdate?",
      },
      options: [
        { es: "AFTER_UPDATE", en: "AFTER_UPDATE" },
        { es: "'After Update'", en: "'After Update'" },
        { es: "UPDATE_AFTER", en: "UPDATE_AFTER" },
        { es: "TriggerOperation.UPDATE", en: "TriggerOperation.UPDATE" },
      ],
      answer: 0,
      explain: {
        es: "Momento y operación en un solo valor de enum: AFTER_UPDATE. Sin comillas, porque no es un texto.",
        en: "Moment and operation in one enum value: AFTER_UPDATE. No quotes, because it is not text.",
      },
      tags: ["recall"],
    },
    {
      id: "m07-l01-q3",
      kind: "single",
      prompt: {
        es: "Este trigger nunca crea las tareas. ¿Por qué?",
        en: "This trigger never creates the tasks. Why?",
      },
      code: {
        es: `trigger CaseTrigger on Case (before insert) {
    switch on Trigger.operationType {
        when BEFORE_INSERT { /* prioridad */ }
        when AFTER_INSERT  { /* tareas */ }
    }
}`,
        en: `trigger CaseTrigger on Case (before insert) {
    switch on Trigger.operationType {
        when BEFORE_INSERT { /* priority */ }
        when AFTER_INSERT  { /* tasks */ }
    }
}`,
      },
      options: [
        {
          es: "La cabecera solo escucha before insert: la plataforma nunca llama al trigger en after insert.",
          en: "The header only listens to before insert: the platform never calls the trigger on after insert.",
        },
        { es: "AFTER_INSERT se escribe entre comillas.", en: "AFTER_INSERT must be in quotes." },
        { es: "Un switch no puede tener dos when.", en: "A switch cannot have two whens." },
        { es: "Las tareas solo se pueden crear en before.", en: "Tasks can only be created in before." },
      ],
      answer: 0,
      explain: {
        es: "Lo que está entre paréntesis en la primera línea decide cuándo se dispara el trigger. Falta after insert en la cabecera, así que esa rama del switch no se alcanza nunca.",
        en: "What sits in brackets on the first line decides when the trigger fires. after insert is missing from the header, so that switch branch is never reached.",
      },
      tags: ["find-error"],
    },
    {
      id: "m07-l01-q4",
      kind: "single",
      prompt: {
        es: "Dentro de when BEFORE_INSERT, una regla pone Priority = 'Low' y, más abajo, otra pone Priority = 'High' al mismo caso. ¿Qué queda?",
        en: "Inside when BEFORE_INSERT, one rule sets Priority = 'Low' and, further down, another sets Priority = 'High' on the same case. What remains?",
      },
      options: [
        { es: "'High': la última asignación gana, y ahora el orden lo decides tú.", en: "'High': the last assignment wins, and now you decide the order." },
        { es: "'Low': la primera asignación bloquea el campo.", en: "'Low': the first assignment locks the field." },
        { es: "Es aleatorio, igual que con dos triggers.", en: "It is random, just like with two triggers." },
        { es: "No compila: no se puede asignar dos veces el mismo campo.", en: "It does not compile: you cannot assign the same field twice." },
      ],
      answer: 0,
      explain: {
        es: "Dentro de un mismo trigger el código se ejecuta de arriba abajo, siempre igual. Esa es la ganancia: el orden deja de ser un misterio y pasa a estar escrito.",
        en: "Inside one trigger the code runs top to bottom, the same every time. That is the gain: the order stops being a mystery and becomes written down.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m07-l01-q5",
      kind: "multi",
      prompt: {
        es: "¿Qué problemas tiene un trigger con toda la lógica dentro, aunque sea el único del objeto?",
        en: "What problems does a trigger with all the logic inside have, even if it is the only one on the object?",
      },
      options: [
        { es: "Mezcla reglas que no tienen nada que ver en un solo archivo que crece sin parar.", en: "It mixes unrelated rules in one file that keeps growing." },
        { es: "La lógica solo se puede ejecutar guardando un registro: un botón o un proceso tendrían que copiarla.", en: "The logic can only run by saving a record: a button or a job would have to copy it." },
        { es: "Consume más límites de gobierno que la misma lógica en una clase.", en: "It consumes more governor limits than the same logic in a class." },
        { es: "Salesforce no permite más de 200 líneas en un trigger.", en: "Salesforce does not allow more than 200 lines in a trigger." },
      ],
      answers: [0, 1],
      explain: {
        es: "Los problemas son de mantenimiento y de reutilización, no de límites: el mismo código consume lo mismo esté en un trigger o en una clase. Y no existe un tope de 200 líneas.",
        en: "The problems are maintenance and reuse, not limits: the same code costs the same whether it lives in a trigger or a class. And there is no 200-line cap.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m07-l01-q6",
      kind: "text",
      prompt: {
        es: "Completa la primera línea del switch que decide el evento dentro de un trigger: switch on ______",
        en: "Complete the first line of the switch that picks the event inside a trigger: switch on ______",
      },
      accept: ["trigger\\.operationtype"],
      placeholder: { es: "Trigger.…", en: "Trigger.…" },
      explain: {
        es: "switch on Trigger.operationType: el evento completo en un solo valor de enum.",
        en: "switch on Trigger.operationType: the whole event in one enum value.",
      },
      tags: ["recall"],
    },
    {
      id: "m07-l01-q7",
      kind: "single",
      prompt: {
        es: "Repaso: en before insert, ¿por qué el trigger puede cambiar c.Priority sin hacer ningún update?",
        en: "Review: in before insert, why can the trigger change c.Priority without any update?",
      },
      options: [
        {
          es: "Porque el registro todavía no se ha guardado: lo que cambias en Trigger.new se guarda solo.",
          en: "Because the record is not saved yet: whatever you change in Trigger.new saves by itself.",
        },
        { es: "Porque Priority es un campo de sistema.", en: "Because Priority is a system field." },
        { es: "Porque los triggers hacen update automáticamente al final.", en: "Because triggers run an update automatically at the end." },
        { es: "No puede: siempre hace falta un update.", en: "It cannot: an update is always needed." },
      ],
      answer: 0,
      explain: {
        es: "Es la ventaja de before (Módulo 6): el registro está en camino a la base de datos y lo que le cambies viaja con él, gratis. En after ya es de solo lectura.",
        en: "That is before's advantage (Module 6): the record is on its way to the database and whatever you change travels with it, for free. In after it is read-only.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M6 before/after", en: "Review · M6 before/after" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 1 DE 5 · Los casos de Hot a veces salen en 'Low'. En el código de partida tienes los dos triggers que hay hoy sobre Case. Únelos en uno solo, CaseTrigger, que decida el evento con Trigger.operationType. Soporte ha decidido que el escalado manda: si un caso es de una cuenta Hot, acaba en 'High' aunque venga de la web. La lógica puede quedarse dentro por ahora; sacarla es la tarea 2.",
      en: "TASK 1 OF 5 · Hot cases sometimes come out as 'Low'. The starter holds the two triggers on Case today. Merge them into one, CaseTrigger, that picks the event with Trigger.operationType. Support has decided escalation rules: if a case belongs to a Hot account, it ends up 'High' even when it came from the web. The logic may stay inside for now; pulling it out is task 2.",
    },
    brief: [
      {
        es: "Al terminar, en el archivo solo puede quedar UN trigger sobre Case, llamado CaseTrigger, que escuche before insert y after insert.",
        en: "When you finish, only ONE trigger on Case may remain in the file, named CaseTrigger, listening to before insert and after insert.",
      },
      {
        es: "El evento se decide con switch on Trigger.operationType, con una rama when BEFORE_INSERT y otra when AFTER_INSERT. Nada de Trigger.isBefore ni Trigger.isAfter.",
        en: "The event is picked with switch on Trigger.operationType, with a when BEFORE_INSERT branch and a when AFTER_INSERT branch. No Trigger.isBefore or Trigger.isAfter.",
      },
      {
        es: "En before: primero el valor por defecto de la web ('Low') y DESPUÉS el escalado ('High'), para que el escalado gane.",
        en: "In before: first the web default ('Low') and AFTER it the escalation ('High'), so escalation wins.",
      },
      {
        es: "En after: las tareas de revisión, igual que antes.",
        en: "In after: the review tasks, as before.",
      },
      {
        es: "Sigue siendo código bulk: una sola consulta y un solo insert en todo el trigger.",
        en: "It is still bulk code: a single query and a single insert in the whole trigger.",
      },
    ],
    starter: {
      es: `// CASO: el trigger heredado de Soporte · objeto Case
// Tarea 1 de 5: dos triggers → uno solo, con el orden escrito.

${TWO_TRIGGERS}
`,
      en: `// CASE: Support's inherited trigger · Case object
// Task 1 of 5: two triggers → a single one, with the order written.

${TWO_TRIGGERS_EN}
`,
    },
    hints: [
      {
        es: "Yo lo haría como juntar dos flows en uno: empieza por la cabecera, un solo trigger CaseTrigger on Case con los dos eventos que necesitan las reglas. Luego piensa qué va en cada momento: ¿qué regla toca el propio caso (before, tu Fast Field Updates) y cuál crea otros registros que necesitan su Id (after)?",
        en: "I would do it like merging two flows into one: start with the header, a single trigger CaseTrigger on Case with the two events the rules need. Then think about what goes at each moment: which rule touches the case itself (before, your Fast Field Updates) and which creates other records that need its Id (after)?",
      },
      {
        es: "Lo que me ayudó: switch on Trigger.operationType { when BEFORE_INSERT { … } when AFTER_INSERT { … } }. Dentro de BEFORE_INSERT el orden importa, como el Trigger Order de tus flows: la última asignación a Priority es la que queda, así que el bucle del 'Low' va primero.",
        en: "What helped me: switch on Trigger.operationType { when BEFORE_INSERT { … } when AFTER_INSERT { … } }. Inside BEFORE_INSERT order matters, like your flows' Trigger Order: the last assignment to Priority is the one that stays, so the 'Low' loop goes first.",
      },
      {
        es: "Te dejo el before: for (Case c : Trigger.new) { if (c.Origin == 'Web') c.Priority = 'Low'; } … y a continuación el bloque del escalado tal cual estaba (Set de Ids, una consulta, el bucle que pone 'High'). Borra los dos triggers antiguos.",
        en: "Here is the before: for (Case c : Trigger.new) { if (c.Origin == 'Web') c.Priority = 'Low'; } … and then the escalation block as it was (Set of Ids, one query, the loop setting 'High'). Delete the two old triggers.",
      },
    ],
    solution: { es: SOLUTION, en: SOLUTION_EN },
    checks: [
      {
        id: "m07-l01-c1",
        label: { es: "Queda un solo trigger sobre Case", en: "A single trigger on Case remains" },
        rule: { op: "count", pattern: "\\btrigger\\s+\\w+\\s+on\\s+Case\\b", min: 1, max: 1 },
        onFail: {
          es: "Tiene que quedar exactamente un trigger sobre Case. Si dejas los antiguos, el orden sigue siendo cosa de la plataforma y el problema no se ha ido.",
          en: "Exactly one trigger on Case must remain. Leave the old ones and the order is still up to the platform: the problem has not gone.",
        },
        otter: {
          es: "Dos triggers sobre Case son dos flows sin Trigger Order: el orden lo decide la plataforma. Tiene que quedar exactamente uno; borra los antiguos.",
          en: "Two triggers on Case are two flows without a Trigger Order: the platform decides the order. Exactly one must remain; delete the old ones.",
        },
      },
      {
        id: "m07-l01-c2",
        label: { es: "CaseTrigger escucha before insert y after insert", en: "CaseTrigger listens to before insert and after insert" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "trigger\\s+CaseTrigger\\s+on\\s+Case\\s*\\([^)]*before\\s+insert" },
            { op: "match", pattern: "trigger\\s+CaseTrigger\\s+on\\s+Case\\s*\\([^)]*after\\s+insert" },
          ],
        },
        onFail: {
          es: "La cabecera decide cuándo se dispara: trigger CaseTrigger on Case (before insert, after insert). Sin after insert, las tareas no se crearían nunca.",
          en: "The header decides when it fires: trigger CaseTrigger on Case (before insert, after insert). Without after insert, the tasks would never be created.",
        },
        otter: {
          es: "La cabecera es tu elemento Start: trigger CaseTrigger on Case (before insert, after insert). Sin after insert, las tareas no se crearían nunca.",
          en: "The header is your Start element: trigger CaseTrigger on Case (before insert, after insert). Without after insert, the tasks would never be created.",
        },
      },
      {
        id: "m07-l01-c3",
        label: { es: "El evento se decide con switch on Trigger.operationType", en: "The event is picked with switch on Trigger.operationType" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "switch\\s+on\\s+Trigger\\s*\\.\\s*operationType" },
            { op: "match", pattern: "when\\s+BEFORE_INSERT\\b" },
            { op: "match", pattern: "when\\s+AFTER_INSERT\\b" },
            { op: "absent", pattern: "Trigger\\s*\\.\\s*is(Before|After)\\b" },
          ],
        },
        onFail: {
          es: "switch on Trigger.operationType con when BEFORE_INSERT y when AFTER_INSERT, sin comillas. Y quita los if con Trigger.isBefore / isAfter: el switch los sustituye.",
          en: "switch on Trigger.operationType with when BEFORE_INSERT and when AFTER_INSERT, no quotes. And remove the ifs with Trigger.isBefore / isAfter: the switch replaces them.",
        },
        otter: {
          es: "El switch reparte por evento, como las salidas de un Decision: switch on Trigger.operationType con when BEFORE_INSERT y when AFTER_INSERT, sin comillas. Y quita los if con Trigger.isBefore / isAfter: el switch los sustituye.",
          en: "The switch sorts by event, like a Decision's outcomes: switch on Trigger.operationType with when BEFORE_INSERT and when AFTER_INSERT, no quotes. And remove the ifs with Trigger.isBefore / isAfter: the switch replaces them.",
        },
      },
      {
        id: "m07-l01-c4",
        label: { es: "El escalado va después del valor por defecto, así que gana", en: "Escalation comes after the default, so it wins" },
        rule: { op: "match", pattern: "Priority\\s*=\\s*'Low'[\\s\\S]*Priority\\s*=\\s*'High'" },
        onFail: {
          es: "Dentro de BEFORE_INSERT la última asignación a Priority es la que se guarda. Si el escalado va antes que el 'Low' de la web, un caso Hot que llega por la web acabaría en 'Low': el mismo fallo que querías arreglar, pero ahora siempre.",
          en: "Inside BEFORE_INSERT the last assignment to Priority is the one saved. If escalation comes before the web 'Low', a Hot case arriving through the web would end up 'Low': the very bug you wanted to fix, but now every time.",
        },
        otter: {
          es: "Aquí el orden lo pones tú, como el Trigger Order: dentro de BEFORE_INSERT la última asignación a Priority es la que se guarda. Si el escalado va antes que el 'Low' de la web, un caso Hot que llega por la web acabaría en 'Low': el mismo fallo que querías arreglar, pero ahora siempre.",
          en: "Here you set the order, like the Trigger Order: inside BEFORE_INSERT the last assignment to Priority is the one saved. If the escalation comes before the web's 'Low', a Hot case arriving from the web would end up 'Low': the same bug you wanted to fix, only now every time.",
        },
        onPass: {
          es: "Ese es el cambio de fondo: el orden ya no lo decide la plataforma, está escrito en tu código.",
          en: "That is the deep change: the order is no longer the platform's call, it is written in your code.",
        },
      },
      {
        id: "m07-l01-c5",
        label: { es: "Sigue siendo bulk: una consulta y un insert", en: "Still bulk: one query and one insert" },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "\\[\\s*SELECT\\b", min: 1, max: 1 },
            { op: "count", pattern: "\\binsert\\s+\\w+\\s*;", min: 1, max: 1 },
          ],
        },
        onFail: {
          es: "Al unir los triggers no dupliques la consulta de cuentas Hot ni el insert de tareas: sigue haciendo falta exactamente una de cada, sean 3 casos o 200.",
          en: "When merging, do not duplicate the Hot accounts query or the task insert: you still need exactly one of each, whether 3 cases or 200.",
        },
        otter: {
          es: "Al juntar los dos flows no dupliques los Get Records ni los Create Records: sigue haciendo falta exactamente una consulta de cuentas Hot y un insert de tareas, sean 3 casos o 200.",
          en: "When merging the two flows do not duplicate the Get Records or the Create Records: you still need exactly one query for Hot accounts and one insert of tasks, whether there are 3 cases or 200.",
        },
      },
    ],
    rubric: [
      {
        es: "Imagina que Soporte pide tres reglas más. ¿Cuántas líneas tendría este trigger? ¿Te atreverías a cambiar la del medio sin miedo a romper las otras? Esa sensación es la tarea 2.",
        en: "Imagine Support asks for three more rules. How many lines would this trigger have? Would you dare change the middle one without fear of breaking the others? That feeling is task 2.",
      },
    ],
    outro: {
      es: "Ya tienes un solo trigger por objeto, que decide el evento con un switch y aplica las reglas en el orden que tú escribes. En la tarea 2, tantas reglas en un trigger son el flow gigante que nadie quiere abrir: toca mudar la lógica a un handler.",
      en: "You now have one trigger per object, which decides the event with a switch and applies the rules in the order you write. In task 2, so many rules in one trigger are the giant flow nobody wants to open: time to move the logic into a handler.",
    },
    voice: "otter",
  },
};
