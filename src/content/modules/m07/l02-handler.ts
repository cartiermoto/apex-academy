import type { Lesson } from "@/lib/types";

/** Task 1's solution: the starting point of task 2. */
const FROM_TASK1 = `trigger CaseTrigger on Case (before insert, after insert) {
    switch on Trigger.operationType {
        when BEFORE_INSERT {
            for (Case c : Trigger.new) {
                if (c.Origin == 'Web') {
                    c.Priority = 'Low';
                }
            }
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

const STARTER_TAIL_ES = `

// ---- CaseTriggerHandler.cls ----
// Deja el trigger arriba y escribe la clase aquí debajo.
`;
const STARTER_TAIL_EN = `

// ---- CaseTriggerHandler.cls ----
// Keep the trigger on top and write the class down here.
`;

export const l02Handler: Lesson = {
  id: "m07-l02",
  slug: "patron-handler",
  n: 2,
  kind: "lesson",
  minutes: 34,
  title: { es: "El patrón Handler", en: "The handler pattern" },
  summary: {
    es: "El trigger se queda con una sola tarea —decir QUÉ evento es— y todo lo demás se muda a una clase. Es el patrón que encontrarás en casi cualquier org profesional.",
    en: "The trigger keeps one job — saying WHICH event this is — and everything else moves into a class. It is the pattern you will find in nearly every professional org.",
  },
  analogy: {
    es: "El elemento Start de un Record-Triggered Flow frente a su lienzo",
    en: "A record-triggered flow's Start element versus its canvas",
  },
  objectives: [
    {
      es: "Separar el CUÁNDO (el trigger) del QUÉ (la clase handler).",
      en: "Separate the WHEN (the trigger) from the WHAT (the handler class).",
    },
    {
      es: "Escribir un handler con un método por evento y pasarle Trigger.new desde el trigger.",
      en: "Write a handler with one method per event and hand it Trigger.new from the trigger.",
    },
    {
      es: "Saber por qué la clase no debe leer Trigger.new por su cuenta.",
      en: "Know why the class should not read Trigger.new on its own.",
    },
    {
      es: "Reconocer este patrón en los frameworks que usan las orgs reales.",
      en: "Recognise this pattern in the frameworks real orgs use.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Tras la tarea 1 tienes un trigger que funciona y en el orden correcto, pero con dos reglas mezcladas en el mismo archivo. La idea del [[handler]] es sencilla: el trigger solo dice CUÁNDO —qué evento está pasando— y una clase dice QUÉ se hace. Así el trigger cabe en una pantalla aunque el objeto tenga veinte reglas.",
        en: "After task 1 you have a trigger that works, in the right order, but with two rules mixed in one file. The [[handler]] idea is simple: the trigger only says WHEN — which event is happening — and a class says WHAT gets done. That way the trigger fits on one screen even if the object has twenty rules.",
      },
    },
    {
      type: "diagram",
      id: "m07-thin-trigger",
      caption: {
        es: "Una carga de 200 casos, de la base de datos al trigger y del trigger al handler, en before y en after.",
        en: "A load of 200 cases, from the database to the trigger and from the trigger to the handler, in before and in after.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El Start y el lienzo", en: "The Start and the canvas" },
      text: {
        es: "Un Record-Triggered Flow tiene dos partes: el elemento Start, donde eliges objeto, si se dispara al crear o al editar y si es antes o después de guardar; y el lienzo, donde van las decisiones y las acciones. El trigger delgado es el Start: objeto y eventos. El handler es el lienzo: la lógica. Nadie mete las decisiones dentro del Start.",
        en: "A record-triggered flow has two parts: the Start element, where you pick the object, whether it fires on create or edit and whether it runs before or after save; and the canvas, where the decisions and actions go. The thin trigger is the Start: object and events. The handler is the canvas: the logic. Nobody puts the decisions inside the Start.",
      },
    },
    {
      type: "h",
      text: { es: "Anatomía: un trigger delgado y su handler", en: "Anatomy: a thin trigger and its handler" },
    },
    {
      type: "code",
      code: {
        es: `trigger AccountTrigger on Account (before insert, before update, after update) {
    AccountTriggerHandler handler = new AccountTriggerHandler();
    switch on Trigger.operationType {
        when BEFORE_INSERT { handler.beforeInsert(Trigger.new); }
        when BEFORE_UPDATE { handler.beforeUpdate(Trigger.new, Trigger.oldMap); }
        when AFTER_UPDATE  { handler.afterUpdate(Trigger.new, Trigger.oldMap); }
    }
}

public with sharing class AccountTriggerHandler {
    public void beforeInsert(List<Account> newAccounts) { /* … */ }
    public void beforeUpdate(List<Account> newAccounts, Map<Id, Account> oldMap) { /* … */ }
    public void afterUpdate(List<Account> newAccounts, Map<Id, Account> oldMap) { /* … */ }
}`,
        en: `trigger AccountTrigger on Account (before insert, before update, after update) {
    AccountTriggerHandler handler = new AccountTriggerHandler();
    switch on Trigger.operationType {
        when BEFORE_INSERT { handler.beforeInsert(Trigger.new); }
        when BEFORE_UPDATE { handler.beforeUpdate(Trigger.new, Trigger.oldMap); }
        when AFTER_UPDATE  { handler.afterUpdate(Trigger.new, Trigger.oldMap); }
    }
}

public with sharing class AccountTriggerHandler {
    public void beforeInsert(List<Account> newAccounts) { /* … */ }
    public void beforeUpdate(List<Account> newAccounts, Map<Id, Account> oldMap) { /* … */ }
    public void afterUpdate(List<Account> newAccounts, Map<Id, Account> oldMap) { /* … */ }
}`,
      },
      caption: {
        es: "Un método por evento, con un nombre que dice cuál. Los de update reciben también oldMap, para poder comparar (Módulo 6).",
        en: "One method per event, named after it. The update ones also receive oldMap, so they can compare (Module 6).",
      },
    },
    {
      type: "table",
      head: [
        { es: "Evento", en: "Event" },
        { es: "Método del handler", en: "Handler method" },
        { es: "Qué le pasa el trigger", en: "What the trigger hands it" },
      ],
      rows: [
        [{ es: "BEFORE_INSERT", en: "BEFORE_INSERT" }, { es: "beforeInsert", en: "beforeInsert" }, { es: "Trigger.new", en: "Trigger.new" }],
        [{ es: "BEFORE_UPDATE", en: "BEFORE_UPDATE" }, { es: "beforeUpdate", en: "beforeUpdate" }, { es: "Trigger.new, Trigger.oldMap", en: "Trigger.new, Trigger.oldMap" }],
        [{ es: "AFTER_INSERT", en: "AFTER_INSERT" }, { es: "afterInsert", en: "afterInsert" }, { es: "Trigger.new (ya con Id)", en: "Trigger.new (with Ids now)" }],
        [{ es: "AFTER_UPDATE", en: "AFTER_UPDATE" }, { es: "afterUpdate", en: "afterUpdate" }, { es: "Trigger.new, Trigger.oldMap", en: "Trigger.new, Trigger.oldMap" }],
        [{ es: "BEFORE_DELETE / AFTER_DELETE", en: "BEFORE_DELETE / AFTER_DELETE" }, { es: "beforeDelete / afterDelete", en: "beforeDelete / afterDelete" }, { es: "Trigger.old, Trigger.oldMap", en: "Trigger.old, Trigger.oldMap" }],
      ],
    },
    {
      type: "h",
      text: { es: "Por qué se le pasa Trigger.new, en vez de que lo lea la clase", en: "Why Trigger.new is handed over instead of read by the class" },
    },
    {
      type: "p",
      text: {
        es: "Dentro del trigger CaseTrigger, Trigger.new ya es una List<Case>: la plataforma sabe de qué objeto es. Dentro de una clase cualquiera, en cambio, Trigger.new es una lista genérica de sObject, y habría que convertirla con (List<Case>) Trigger.new como viste en el Módulo 1. Pero el motivo de fondo no es el casting: una clase que lee Trigger.new solo funciona dentro de un trigger. Una clase que recibe una List<Case> funciona con cualquier lista de casos: la de un trigger, la de una consulta o la que fabriques en una clase de test (Módulo 10).",
        en: "Inside the CaseTrigger trigger, Trigger.new is already a List<Case>: the platform knows which object it is. Inside an ordinary class, however, Trigger.new is a generic list of sObject, and you would have to convert it with (List<Case>) Trigger.new as you saw in Module 1. But the deeper reason is not the cast: a class that reads Trigger.new only works inside a trigger. A class that receives a List<Case> works with any list of cases: a trigger's, a query's, or one you build in a test class (Module 10).",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "El handler tampoco debe mirar Trigger.isInsert", en: "The handler should not look at Trigger.isInsert either" },
      text: {
        es: "Si dentro de la clase aparece cualquier Trigger.algo, el handler ha vuelto a atarse al trigger. Decidir el evento es trabajo del switch del trigger; el método se llama beforeInsert precisamente para que no tenga que preguntar.",
        en: "If any Trigger.something shows up inside the class, the handler has tied itself back to the trigger. Picking the event is the trigger switch's job; the method is called beforeInsert precisely so it does not have to ask.",
      },
    },
    {
      type: "h",
      text: { es: "Nombres que se reconocen de un vistazo", en: "Names you recognise at a glance" },
    },
    {
      type: "p",
      text: {
        es: "La convención más extendida: el trigger se llama como el objeto más Trigger (CaseTrigger, AccountTrigger) y su clase, igual más Handler (CaseTriggerHandler). Parece un detalle, pero es lo que permite que otra persona abra una org que no conoce y encuentre en segundos dónde vive la lógica de Case.",
        en: "The most widespread convention: the trigger is named after the object plus Trigger (CaseTrigger, AccountTrigger) and its class the same plus Handler (CaseTriggerHandler). It looks like a detail, but it is what lets someone open an org they do not know and find in seconds where Case's logic lives.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Lo que verás en las orgs reales", en: "What you will see in real orgs" },
      text: {
        es: "En muchas orgs el handler no se escribe desde cero: hereda de una clase base de un framework, que ya trae el switch dentro y métodos vacíos para cada evento que tú solo sobrescribes. Los dos más conocidos son la clase TriggerHandler de Kevin O'Hara y el Trigger Actions Framework, que además configura el orden con metadatos. No los vas a instalar aquí: el handler que escribes hoy es la misma idea sin framework, para que cuando los veas sepas exactamente qué hacen por dentro. La herencia es la del Módulo 5.",
        en: "In many orgs the handler is not written from scratch: it inherits from a framework base class that already carries the switch and empty methods for each event, which you just override. The two best known are Kevin O'Hara's TriggerHandler class and the Trigger Actions Framework, which also configures the order with metadata. You will not install them here: the handler you write today is the same idea without a framework, so that when you meet them you know exactly what they do inside. The inheritance is Module 5's.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Simplificación: with sharing", en: "Simplification: with sharing" },
      text: {
        es: "Verás public with sharing class en todos los ejemplos. De momento tómalo como «la forma correcta de declarar una clase que toca datos»: significa que la clase respeta las reglas de uso compartido del usuario, igual que un informe solo le enseña lo que puede ver. El Módulo 12 lo explica a fondo y cuándo se usa otra cosa.",
        en: "You will see public with sharing class in every example. For now take it as “the right way to declare a class that touches data”: it means the class respects the user's sharing rules, just as a report only shows what they can see. Module 12 explains it in depth and when to use something else.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "En tu Developer Org", en: "In your Developer Org" },
      text: {
        es: "Developer Console → File → New → Apex Class para CaseTriggerHandler; luego edita el trigger de la tarea 1 para que solo llame al handler. Guarda la clase ANTES que el trigger: si el trigger nombra una clase que todavía no existe, no compila. Después crea un caso en Execute Anonymous (Debug → Open Execute Anonymous Window) y comprueba que la prioridad sigue saliendo bien.",
        en: "Developer Console → File → New → Apex Class for CaseTriggerHandler; then edit task 1's trigger so it only calls the handler. Save the class BEFORE the trigger: if the trigger names a class that does not exist yet, it will not compile. Then create a case in Execute Anonymous (Debug → Open Execute Anonymous Window) and check the priority still comes out right.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué hace el trigger y qué hace el handler? ¿Qué recibe beforeUpdate además de la lista nueva? ¿Por qué no conviene que el handler lea Trigger.new directamente?",
        en: "Without looking: what does the trigger do and what does the handler do? What does beforeUpdate receive besides the new list? Why is it a bad idea for the handler to read Trigger.new directly?",
      },
    },
  ],

  quiz: [
    {
      id: "m07-l02-q1",
      kind: "single",
      prompt: {
        es: "En el patrón handler, ¿de qué se encarga el trigger?",
        en: "In the handler pattern, what is the trigger in charge of?",
      },
      options: [
        { es: "De decidir qué evento es y llamar al método del handler que toca.", en: "Of deciding which event it is and calling the right handler method." },
        { es: "De la lógica sencilla; el handler se queda la complicada.", en: "Of the simple logic; the handler keeps the complex part." },
        { es: "De las consultas; el handler, de los DML.", en: "Of the queries; the handler, of the DML." },
        { es: "De nada: con un handler, el trigger se puede borrar.", en: "Of nothing: with a handler, the trigger can be deleted." },
      ],
      answer: 0,
      explain: {
        es: "El trigger dice CUÁNDO; el handler, QUÉ. Sin trigger no hay nada que dispare la clase: sigue haciendo falta, pero delgado.",
        en: "The trigger says WHEN; the handler, WHAT. Without a trigger nothing fires the class: it is still needed, just thin.",
      },
      tags: ["recall"],
    },
    {
      id: "m07-l02-q2",
      kind: "single",
      prompt: {
        es: "¿Qué firma es la adecuada para el método del handler en before update de Opportunity?",
        en: "Which signature fits the handler method for Opportunity's before update?",
      },
      options: [
        { es: "public void beforeUpdate(List<Opportunity> newOpps, Map<Id, Opportunity> oldMap)", en: "public void beforeUpdate(List<Opportunity> newOpps, Map<Id, Opportunity> oldMap)" },
        { es: "public void beforeUpdate()", en: "public void beforeUpdate()" },
        { es: "public void beforeUpdate(List<Opportunity> newOpps)", en: "public void beforeUpdate(List<Opportunity> newOpps)" },
        { es: "public void beforeUpdate(Trigger t)", en: "public void beforeUpdate(Trigger t)" },
      ],
      answer: 0,
      explain: {
        es: "En update casi siempre hay que comparar con el valor anterior, así que el método recibe la lista nueva y oldMap. Sin parámetros, el método tendría que leer Trigger.new por su cuenta.",
        en: "On update you nearly always need to compare with the previous value, so the method takes the new list and oldMap. With no parameters, it would have to read Trigger.new on its own.",
      },
      tags: ["recall"],
    },
    {
      id: "m07-l02-q3",
      kind: "single",
      prompt: {
        es: "¿Qué tiene de malo este handler?",
        en: "What is wrong with this handler?",
      },
      code: {
        es: `public with sharing class CaseTriggerHandler {
    public void beforeInsert() {
        for (Case c : (List<Case>) Trigger.new) {
            if (c.Origin == 'Web') c.Priority = 'Low';
        }
    }
}`,
        en: `public with sharing class CaseTriggerHandler {
    public void beforeInsert() {
        for (Case c : (List<Case>) Trigger.new) {
            if (c.Origin == 'Web') c.Priority = 'Low';
        }
    }
}`,
      },
      options: [
        {
          es: "Compila, pero solo sirve dentro de un trigger: no se le puede pasar otra lista de casos.",
          en: "It compiles, but only works inside a trigger: you cannot hand it any other list of cases.",
        },
        { es: "No compila: Trigger.new no existe fuera del trigger.", en: "It does not compile: Trigger.new does not exist outside the trigger." },
        { es: "Nada: es la forma recomendada.", en: "Nothing: it is the recommended way." },
        { es: "Le falta un update al final.", en: "It lacks an update at the end." },
      ],
      answer: 0,
      explain: {
        es: "Con el casting compila y funciona desde el trigger. El problema es de diseño: la clase queda atada al contexto del trigger, y ni un botón ni un test pueden reutilizarla con sus propios casos.",
        en: "With the cast it compiles and works from the trigger. The problem is design: the class is tied to the trigger context, and neither a button nor a test can reuse it with their own cases.",
      },
      tags: ["find-error"],
    },
    {
      id: "m07-l02-q4",
      kind: "single",
      prompt: {
        es: "En before insert, el handler cambia c.Priority en la lista que recibe. ¿Se guarda el cambio?",
        en: "In before insert, the handler changes c.Priority in the list it receives. Is the change saved?",
      },
      options: [
        {
          es: "Sí: la lista que recibe es Trigger.new, los mismos registros que van a guardarse.",
          en: "Yes: the list it receives is Trigger.new, the very records about to be saved.",
        },
        { es: "No: el handler trabaja con una copia.", en: "No: the handler works on a copy." },
        { es: "Solo si el handler hace update newCases;", en: "Only if the handler does update newCases;" },
        { es: "Solo si el método es static.", en: "Only if the method is static." },
      ],
      answer: 0,
      explain: {
        es: "Pasar una lista a un método pasa la referencia, no una copia (Módulo 5). El handler toca los mismos registros de Trigger.new, así que en before el cambio viaja a la base de datos sin DML.",
        en: "Passing a list to a method passes the reference, not a copy (Module 5). The handler touches the same Trigger.new records, so in before the change travels to the database with no DML.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m07-l02-q5",
      kind: "multi",
      prompt: {
        es: "¿Cuáles de estas líneas NO deberían aparecer dentro de la clase handler?",
        en: "Which of these lines should NOT appear inside the handler class?",
      },
      options: [
        { es: "if (Trigger.isInsert) { … }", en: "if (Trigger.isInsert) { … }" },
        { es: "for (Case c : (List<Case>) Trigger.new) { … }", en: "for (Case c : (List<Case>) Trigger.new) { … }" },
        { es: "for (Case c : newCases) { … }", en: "for (Case c : newCases) { … }" },
        { es: "insert tasks;", en: "insert tasks;" },
      ],
      answers: [0, 1],
      explain: {
        es: "Cualquier Trigger.algo dentro de la clase la ata al trigger. Recorrer la lista recibida o hacer un insert bulk es exactamente su trabajo.",
        en: "Any Trigger.something inside the class ties it to the trigger. Looping the received list or doing a bulk insert is exactly its job.",
      },
      tags: ["find-error"],
    },
    {
      id: "m07-l02-q6",
      kind: "text",
      prompt: {
        es: "Según la convención, ¿cómo se llama la clase handler del trigger OpportunityTrigger?",
        en: "By convention, what is the handler class of the OpportunityTrigger trigger called?",
      },
      accept: ["opportunitytriggerhandler"],
      placeholder: { es: "Opportunity…", en: "Opportunity…" },
      explain: {
        es: "OpportunityTriggerHandler: el nombre del trigger más Handler. Así cualquiera encuentra la lógica de un objeto sin preguntar.",
        en: "OpportunityTriggerHandler: the trigger's name plus Handler. That way anyone finds an object's logic without asking.",
      },
      tags: ["recall"],
    },
    {
      id: "m07-l02-q7",
      kind: "single",
      prompt: {
        es: "Repaso: el handler recibe 200 casos y necesita las cuentas de todos. ¿Dónde va la consulta?",
        en: "Review: the handler receives 200 cases and needs all their accounts. Where does the query go?",
      },
      options: [
        {
          es: "Fuera del bucle: se juntan los AccountId en un Set y se consulta una vez con IN.",
          en: "Outside the loop: gather the AccountIds in a Set and query once with IN.",
        },
        { es: "Dentro del bucle, una por caso: así cada caso tiene su cuenta.", en: "Inside the loop, one per case: that way each case has its account." },
        { es: "En el trigger, porque el handler no puede consultar.", en: "In the trigger, because the handler cannot query." },
        { es: "En un bucle aparte, una por cuenta distinta.", en: "In a separate loop, one per distinct account." },
      ],
      answer: 0,
      explain: {
        es: "Mudar la lógica a una clase no cambia las reglas de bulkificación del Módulo 4: una consulta con IN para todos, nunca una por registro.",
        en: "Moving logic into a class does not change Module 4's bulkification rules: one query with IN for all of them, never one per record.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M4 bulkificación", en: "Review · M4 bulkification" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 2 DE 5 · En el código de partida tienes la solución de la tarea 1: un solo trigger, en orden, pero con toda la lógica dentro. Muda esa lógica a una clase CaseTriggerHandler, con un método por evento, y deja el trigger limitado a decidir el evento y llamar al handler. El comportamiento no puede cambiar: mismas prioridades, mismas tareas.",
      en: "TASK 2 OF 5 · The starter holds task 1's solution: a single trigger, in order, but with all the logic inside. Move that logic into a CaseTriggerHandler class, with one method per event, and leave the trigger limited to picking the event and calling the handler. Behaviour must not change: same priorities, same tasks.",
    },
    brief: [
      {
        es: "El trigger sigue siendo el único sobre Case, sigue usando switch on Trigger.operationType, y ya no contiene ni consultas, ni DML, ni bucles.",
        en: "The trigger is still the only one on Case, still uses switch on Trigger.operationType, and no longer holds any queries, DML or loops.",
      },
      {
        es: "Una clase public with sharing class CaseTriggerHandler, escrita debajo del trigger.",
        en: "A public with sharing class CaseTriggerHandler, written below the trigger.",
      },
      {
        es: "Dos métodos: beforeInsert(List<Case> …) con la lógica del before, y afterInsert(List<Case> …) con la del after.",
        en: "Two methods: beforeInsert(List<Case> …) with the before logic, and afterInsert(List<Case> …) with the after logic.",
      },
      {
        es: "El trigger les pasa Trigger.new; dentro de la clase no aparece nada que empiece por Trigger.",
        en: "The trigger hands them Trigger.new; nothing starting with Trigger. appears inside the class.",
      },
      {
        es: "Sigue siendo bulk: una sola consulta y un solo insert en todo el código.",
        en: "Still bulk: a single query and a single insert in all the code.",
      },
    ],
    starter: {
      es: `// CASO: el trigger heredado de Soporte · objeto Case
// Ya resuelto en la tarea 1: un solo trigger, en orden.
// Tarea 2 de 5: la lógica, fuera del trigger.

${FROM_TASK1}${STARTER_TAIL_ES}`,
      en: `// CASE: Support's inherited trigger · Case object
// Already solved in task 1: a single trigger, in order.
// Task 2 of 5: the logic, out of the trigger.

${FROM_TASK1}${STARTER_TAIL_EN}`,
    },
    hints: [
      {
        es: "Haz la mudanza por partes: primero escribe la clase con los dos métodos vacíos, luego corta el contenido de cada rama del switch y pégalo en su método. El trigger se queda solo con el switch.",
        en: "Move in stages: first write the class with the two empty methods, then cut each switch branch's contents and paste them into its method. The trigger keeps only the switch.",
      },
      {
        es: "Dentro del método ya no hay Trigger.new: hay un parámetro. Cambia cada Trigger.new pegado por el nombre del parámetro (newCases, por ejemplo). En el trigger, cada rama queda en una línea: handler.beforeInsert(Trigger.new);",
        en: "Inside the method there is no Trigger.new any more: there is a parameter. Replace every pasted Trigger.new with the parameter name (newCases, for example). In the trigger, each branch becomes one line: handler.beforeInsert(Trigger.new);",
      },
      {
        es: "Pseudocódigo: trigger CaseTrigger on Case (before insert, after insert) { CaseTriggerHandler handler = new CaseTriggerHandler(); switch on Trigger.operationType { when BEFORE_INSERT { handler.beforeInsert(Trigger.new); } when AFTER_INSERT { handler.afterInsert(Trigger.new); } } } y debajo public with sharing class CaseTriggerHandler { public void beforeInsert(List<Case> newCases) { … } public void afterInsert(List<Case> newCases) { … } }",
        en: "Pseudocode: trigger CaseTrigger on Case (before insert, after insert) { CaseTriggerHandler handler = new CaseTriggerHandler(); switch on Trigger.operationType { when BEFORE_INSERT { handler.beforeInsert(Trigger.new); } when AFTER_INSERT { handler.afterInsert(Trigger.new); } } } and below it public with sharing class CaseTriggerHandler { public void beforeInsert(List<Case> newCases) { … } public void afterInsert(List<Case> newCases) { … } }",
      },
    ],
    solution: { es: SOLUTION, en: SOLUTION },
    checks: [
      {
        id: "m07-l02-c1",
        label: { es: "Sigue habiendo un solo trigger, arriba, con su switch", en: "Still a single trigger, on top, with its switch" },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "\\btrigger\\s+\\w+\\s+on\\s+Case\\b", min: 1, max: 1 },
            { op: "match", pattern: "switch\\s+on\\s+Trigger\\s*\\.\\s*operationType" },
            { op: "match", pattern: "trigger\\s+CaseTrigger\\b[\\s\\S]*class\\s+CaseTriggerHandler\\b" },
          ],
        },
        onFail: {
          es: "Mantén el trigger CaseTrigger con su switch, arriba del todo, y escribe la clase debajo, como en el código de partida.",
          en: "Keep the CaseTrigger trigger with its switch, at the very top, and write the class below it, as in the starter.",
        },
      },
      {
        id: "m07-l02-c2",
        label: { es: "El trigger ya no tiene consultas, DML ni bucles", en: "The trigger no longer holds queries, DML or loops" },
        rule: {
          op: "absent",
          pattern: "trigger\\s+CaseTrigger\\b[\\s\\S]*?(\\[\\s*SELECT\\b|\\binsert\\s+\\w+\\s*;|\\bfor\\s*\\()[\\s\\S]*class\\s+CaseTriggerHandler\\b",
        },
        onFail: {
          es: "Entre la cabecera del trigger y la clase no puede quedar ni un bucle, ni una consulta, ni un insert: todo eso es el QUÉ, y se muda al handler. El trigger solo dice CUÁNDO.",
          en: "Between the trigger's header and the class there must be no loop, no query and no insert: all of that is the WHAT, and it moves to the handler. The trigger only says WHEN.",
        },
      },
      {
        id: "m07-l02-c3",
        label: { es: "CaseTriggerHandler con beforeInsert y afterInsert", en: "CaseTriggerHandler with beforeInsert and afterInsert" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+(with\\s+sharing\\s+)?class\\s+CaseTriggerHandler\\b" },
            { op: "match", pattern: "void\\s+beforeInsert\\s*\\(\\s*List\\s*<\\s*Case\\s*>\\s+\\w+\\s*\\)" },
            { op: "match", pattern: "void\\s+afterInsert\\s*\\(\\s*List\\s*<\\s*Case\\s*>\\s+\\w+\\s*\\)" },
          ],
        },
        onFail: {
          es: "La clase necesita un método por evento, y cada uno recibe la lista de casos: public void beforeInsert(List<Case> newCases) y public void afterInsert(List<Case> newCases).",
          en: "The class needs one method per event, each receiving the list of cases: public void beforeInsert(List<Case> newCases) and public void afterInsert(List<Case> newCases).",
        },
      },
      {
        id: "m07-l02-c4",
        label: { es: "El trigger llama al handler pasándole Trigger.new", en: "The trigger calls the handler handing it Trigger.new" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "\\.\\s*beforeInsert\\s*\\(\\s*Trigger\\s*\\.\\s*new\\s*\\)" },
            { op: "match", pattern: "\\.\\s*afterInsert\\s*\\(\\s*Trigger\\s*\\.\\s*new\\s*\\)" },
          ],
        },
        onFail: {
          es: "Cada rama del switch se reduce a una llamada: handler.beforeInsert(Trigger.new); y handler.afterInsert(Trigger.new);. Dentro del trigger, Trigger.new ya es List<Case>, así que viaja con su tipo.",
          en: "Each switch branch shrinks to one call: handler.beforeInsert(Trigger.new); and handler.afterInsert(Trigger.new);. Inside the trigger, Trigger.new is already List<Case>, so it travels typed.",
        },
      },
      {
        id: "m07-l02-c5",
        label: { es: "La clase no depende del trigger", en: "The class does not depend on the trigger" },
        rule: { op: "absent", pattern: "class\\s+CaseTriggerHandler\\b[\\s\\S]*\\bTrigger\\s*\\." },
        onFail: {
          es: "Dentro de la clase no puede aparecer Trigger.new, Trigger.isInsert ni ningún otro Trigger.: al pegar la lógica, cambia cada Trigger.new por el parámetro del método.",
          en: "Trigger.new, Trigger.isInsert or any other Trigger. must not appear inside the class: when pasting the logic, replace each Trigger.new with the method's parameter.",
        },
        onPass: {
          es: "Así la clase acepta cualquier lista de casos: la del trigger hoy, la de un botón en la tarea 3 y la de un test en el Módulo 10.",
          en: "Now the class accepts any list of cases: the trigger's today, a button's in task 3 and a test's in Module 10.",
        },
      },
      {
        id: "m07-l02-c6",
        label: { es: "Sigue siendo bulk: una consulta y un insert", en: "Still bulk: one query and one insert" },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "\\[\\s*SELECT\\b", min: 1, max: 1 },
            { op: "count", pattern: "\\binsert\\s+\\w+\\s*;", min: 1, max: 1 },
          ],
        },
        onFail: {
          es: "Mudar el código no debe multiplicarlo: sigue haciendo falta exactamente una consulta y un insert.",
          en: "Moving the code must not multiply it: you still need exactly one query and one insert.",
        },
      },
    ],
    rubric: [
      {
        es: "Soporte pide un botón «Recalcular prioridad» para casos antiguos. ¿Podría llamar a tu handler.beforeInsert? Técnicamente sí… pero ¿tiene sentido que un botón llame a algo que se llama beforeInsert? Esa incomodidad es la tarea 3.",
        en: "Support asks for a “Recalculate priority” button for old cases. Could it call your handler.beforeInsert? Technically yes… but does it make sense for a button to call something named beforeInsert? That discomfort is task 3.",
      },
    ],
  },
};
