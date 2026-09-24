import type { Lesson } from "@/lib/types";

export const l02Contexto: Lesson = {
  id: "m06-l02",
  slug: "contexto-trigger-new-old",
  n: 2,
  kind: "lesson",
  minutes: 35,
  title: {
    es: "Contexto: Trigger.new, Trigger.old, Trigger.newMap",
    en: "Context: Trigger.new, Trigger.old, Trigger.newMap",
  },
  summary: {
    es: "Lo que Salesforce le entrega a tu trigger en cada ejecución: los registros nuevos, los viejos, sus mapas por Id y unas preguntas de sí o no para saber qué está pasando.",
    en: "What Salesforce hands your trigger on every run: the new records, the old ones, their maps by Id and a few yes/no questions to know what is going on.",
  },
  analogy: {
    es: "$Record y $Record__Prior de un Flow, pero en listas",
    en: "A Flow's $Record and $Record__Prior, but as lists",
  },
  objectives: [
    {
      es: "Saber qué contiene Trigger.new, Trigger.old, Trigger.newMap y Trigger.oldMap, y en qué eventos existe cada uno.",
      en: "Know what Trigger.new, Trigger.old, Trigger.newMap and Trigger.oldMap contain, and in which events each exists.",
    },
    {
      es: "Detectar si un campo cambió comparando el valor nuevo con el viejo.",
      en: "Detect whether a field changed by comparing the new value with the old one.",
    },
    {
      es: "Usar Trigger.isInsert, isUpdate, isBefore e isAfter para separar la lógica.",
      en: "Use Trigger.isInsert, isUpdate, isBefore and isAfter to split the logic.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Cuando Salesforce ejecuta tu trigger, no lo hace a ciegas: le deja preparadas unas [[variables-contexto|variables de contexto]] con todo lo que necesita saber. Qué registros llegan, cómo eran antes del cambio y qué operación se está haciendo. Toda la lógica de un trigger se escribe a partir de ellas.",
        en: "When Salesforce runs your trigger, it does not do it blind: it leaves a set of [[variables-contexto|context variables]] ready with everything the trigger needs to know. Which records are coming in, what they looked like before the change and which operation is under way. All of a trigger's logic is written from them.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "En un Record-Triggered Flow que se ejecuta al actualizar, usas {!$Record.StageName} para el valor nuevo y {!$Record__Prior.StageName} para el que tenía antes. Y la condición de entrada «Only when a record is updated to meet the condition requirements» compara los dos por ti. En un trigger tienes lo mismo, pero en plural: Trigger.new son todos los $Record del lote y Trigger.old todos los $Record__Prior. La comparación la escribes tú.",
        en: "In a record-triggered Flow that runs on update, you use {!$Record.StageName} for the new value and {!$Record__Prior.StageName} for the one it had before. And the entry condition “Only when a record is updated to meet the condition requirements” compares both for you. In a trigger you have the same thing, but plural: Trigger.new is every $Record in the batch and Trigger.old every $Record__Prior. You write the comparison yourself.",
      },
    },
    {
      type: "h",
      text: { es: "Las cuatro colecciones", en: "The four collections" },
    },
    {
      type: "list",
      items: [
        {
          es: "Trigger.new: List con los registros tal como van a quedar. Es tu $Record en plural.",
          en: "Trigger.new: a List with the records as they are going to end up. It is your $Record, plural.",
        },
        {
          es: "Trigger.old: List con los registros tal como estaban antes del cambio. Tu $Record__Prior en plural.",
          en: "Trigger.old: a List with the records as they were before the change. Your $Record__Prior, plural.",
        },
        {
          es: "Trigger.newMap: los mismos registros nuevos, en un Map<Id, sObject>. Para buscar por Id sin recorrer, como el VLOOKUP del Módulo 2.",
          en: "Trigger.newMap: the same new records, in a Map<Id, sObject>. To look up by Id without looping, like Module 2's VLOOKUP.",
        },
        {
          es: "Trigger.oldMap: los registros viejos en un Map<Id, sObject>. Es la que más usarás: con ella encuentras el «antes» de cada registro de Trigger.new.",
          en: "Trigger.oldMap: the old records in a Map<Id, sObject>. It is the one you will use most: with it you find the “before” of each record in Trigger.new.",
        },
      ],
    },
    {
      type: "diagram",
      id: "m06-old-new",
      caption: {
        es: "La misma oportunidad dos veces: como estaba (oldMap) y como va a quedar (new). El Id es el hilo que las une.",
        en: "The same opportunity twice: as it was (oldMap) and as it will end up (new). The Id is the thread joining them.",
      },
    },
    {
      type: "h",
      text: { es: "No todas existen en todos los eventos", en: "Not every one exists in every event" },
    },
    {
      type: "p",
      text: {
        es: "Tiene lógica si piensas en el registro: al crearlo no hay un «antes», así que no hay Trigger.old. Al borrarlo no hay un «después», así que no hay Trigger.new. Y en before insert el registro todavía no tiene Id, así que no puede haber un mapa por Id.",
        en: "It makes sense if you think about the record: when creating it there is no “before”, so there is no Trigger.old. When deleting it there is no “after”, so there is no Trigger.new. And in before insert the record has no Id yet, so there cannot be a map by Id.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Evento", en: "Event" },
        { es: "new", en: "new" },
        { es: "newMap", en: "newMap" },
        { es: "old", en: "old" },
        { es: "oldMap", en: "oldMap" },
      ],
      rows: [
        [{ es: "before insert", en: "before insert" }, { es: "✓ (editable)", en: "✓ (editable)" }, { es: "✗ sin Id", en: "✗ no Id" }, { es: "✗", en: "✗" }, { es: "✗", en: "✗" }],
        [{ es: "after insert", en: "after insert" }, { es: "✓ lectura", en: "✓ read-only" }, { es: "✓", en: "✓" }, { es: "✗", en: "✗" }, { es: "✗", en: "✗" }],
        [{ es: "before update", en: "before update" }, { es: "✓ (editable)", en: "✓ (editable)" }, { es: "✓", en: "✓" }, { es: "✓", en: "✓" }, { es: "✓", en: "✓" }],
        [{ es: "after update", en: "after update" }, { es: "✓ lectura", en: "✓ read-only" }, { es: "✓", en: "✓" }, { es: "✓", en: "✓" }, { es: "✓", en: "✓" }],
        [{ es: "before delete", en: "before delete" }, { es: "✗", en: "✗" }, { es: "✗", en: "✗" }, { es: "✓", en: "✓" }, { es: "✓", en: "✓" }],
        [{ es: "after delete", en: "after delete" }, { es: "✗", en: "✗" }, { es: "✗", en: "✗" }, { es: "✓", en: "✓" }, { es: "✓", en: "✓" }],
        [{ es: "after undelete", en: "after undelete" }, { es: "✓ lectura", en: "✓ read-only" }, { es: "✓", en: "✓" }, { es: "✗", en: "✗" }, { es: "✗", en: "✗" }],
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Usar la que no existe no avisa al compilar", en: "Using one that does not exist does not warn at compile time" },
      text: {
        es: "Si un trigger escucha varios eventos y lees Trigger.old en su parte de insert, el código compila. Al ejecutarse, Trigger.old es null, y pedirle cualquier cosa lanza NullPointerException, igual que en el Módulo 1. Por eso las preguntas de sí o no de la siguiente sección no son opcionales.",
        en: "If a trigger listens to several events and you read Trigger.old in its insert part, the code compiles. At runtime, Trigger.old is null, and asking it for anything throws NullPointerException, just like in Module 1. That is why the yes/no questions in the next section are not optional.",
      },
    },
    {
      type: "h",
      text: { es: "¿Cambió el campo? El patrón old frente a new", en: "Did the field change? The old versus new pattern" },
    },
    {
      type: "p",
      text: {
        es: "La pregunta más frecuente en un trigger de update no es «¿cómo está el registro?» sino «¿qué cambió?». Si no la haces, tu lógica se ejecuta cada vez que alguien edita cualquier campo, aunque sea la descripción. Se responde recorriendo Trigger.new y buscando cada registro en Trigger.oldMap por su Id.",
        en: "The most common question in an update trigger is not “what does the record look like?” but “what changed?”. If you skip it, your logic runs every time someone edits any field, even the description. You answer it by walking Trigger.new and looking each record up in Trigger.oldMap by its Id.",
      },
    },
    {
      type: "code",
      code: {
        es: `trigger OpportunityStage on Opportunity (before update) {
    for (Opportunity opp : Trigger.new) {
        Opportunity before = Trigger.oldMap.get(opp.Id);

        if (opp.StageName != before.StageName) {
            opp.NextStep = 'Etapa: ' + before.StageName + ' → ' + opp.StageName;
        }
    }
}`,
        en: `trigger OpportunityStage on Opportunity (before update) {
    for (Opportunity opp : Trigger.new) {
        Opportunity before = Trigger.oldMap.get(opp.Id);

        if (opp.StageName != before.StageName) {
            opp.NextStep = 'Stage: ' + before.StageName + ' → ' + opp.StageName;
        }
    }
}`,
      },
      caption: {
        es: "Trigger.oldMap.get(opp.Id) es el $Record__Prior de esa oportunidad concreta. Y como es before update, basta con cambiar opp.NextStep: se guarda solo, sin DML.",
        en: "Trigger.oldMap.get(opp.Id) is that particular opportunity's $Record__Prior. And since it is before update, changing opp.NextStep is enough: it saves by itself, no DML.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Recorre new y busca en oldMap", en: "Walk new, look up in oldMap" },
      text: {
        es: "Podrías recorrer Trigger.new y Trigger.old con un for de índice y confiar en que la posición 5 de una es la 5 de la otra. Funciona, pero se lee peor y depende del orden. Buscar en oldMap por Id es explícito: «dame esta misma oportunidad, pero como estaba». Es el patrón que verás en cualquier org profesional.",
        en: "You could walk Trigger.new and Trigger.old with an indexed for and trust that position 5 in one is position 5 in the other. It works, but it reads worse and depends on order. Looking up in oldMap by Id is explicit: “give me this same opportunity, as it was”. It is the pattern you will see in any professional org.",
      },
    },
    {
      type: "h",
      text: { es: "Las preguntas de sí o no", en: "The yes/no questions" },
    },
    {
      type: "p",
      text: {
        es: "Un mismo trigger puede escuchar varios eventos. Para saber cuál es el de esta ejecución, Salesforce te da unos Boolean: Trigger.isInsert, isUpdate, isDelete, isUndelete, y para el momento, isBefore e isAfter. Con los if del Módulo 2 separas cada rama. También tienes Trigger.size (cuántos registros llegan) y Trigger.operationType, que lo resume todo en un valor como BEFORE_UPDATE.",
        en: "A single trigger can listen to several events. To know which one this run is, Salesforce gives you some Booleans: Trigger.isInsert, isUpdate, isDelete, isUndelete, and for the moment, isBefore and isAfter. With Module 2's ifs you split each branch. You also have Trigger.size (how many records arrived) and Trigger.operationType, which sums it all up in a value like BEFORE_UPDATE.",
      },
    },
    {
      type: "code",
      code: {
        es: `trigger AccountTrigger on Account (before insert, before update, after insert) {
    if (Trigger.isBefore && Trigger.isInsert) {
        // solo al crear, antes de guardar
    }
    if (Trigger.isBefore && Trigger.isUpdate) {
        // aquí sí existe Trigger.oldMap
    }
    if (Trigger.isAfter && Trigger.isInsert) {
        // ya hay Ids: Trigger.newMap disponible
    }
}`,
        en: `trigger AccountTrigger on Account (before insert, before update, after insert) {
    if (Trigger.isBefore && Trigger.isInsert) {
        // only on create, before saving
    }
    if (Trigger.isBefore && Trigger.isUpdate) {
        // Trigger.oldMap does exist here
    }
    if (Trigger.isAfter && Trigger.isInsert) {
        // there are Ids now: Trigger.newMap available
    }
}`,
      },
    },
    {
      type: "h",
      text: { es: "Trigger.new solo se puede tocar en before", en: "Trigger.new can only be touched in before" },
    },
    {
      type: "p",
      text: {
        es: "En before insert y before update, cambiar un campo de un registro de Trigger.new es la forma de modificarlo: el cambio se guarda solo, porque el registro todavía no se ha escrito. En los eventos after, en cambio, Trigger.new es de solo lectura: si intentas asignar un campo, Salesforce lanza System.FinalException: Record is read-only. Y Trigger.old no se puede cambiar nunca. La lección 3 explica por qué y qué se hace entonces.",
        en: "In before insert and before update, changing a field on a Trigger.new record is how you modify it: the change saves by itself, because the record has not been written yet. In after events, by contrast, Trigger.new is read-only: if you try to assign a field, Salesforce throws System.FinalException: Record is read-only. And Trigger.old can never be changed. Lesson 3 explains why and what you do then.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "ISCHANGED() y PRIORVALUE(): old y new en tus fórmulas", en: "ISCHANGED() and PRIORVALUE(): old and new in your formulas" },
      text: {
        es: "En una regla de validación escribes ISCHANGED(StageName) para saber si la etapa cambió, y PRIORVALUE(StageName) para leer la que había antes. Son exactamente Trigger.oldMap.get(o.Id).StageName comparado con o.StageName. La diferencia es de escala: la fórmula mira un registro; el trigger recibe hasta 200 y compara cada uno con su versión anterior, buscándola por Id en oldMap.",
        en: "In a validation rule you write ISCHANGED(StageName) to know whether the stage changed, and PRIORVALUE(StageName) to read the previous one. They are exactly Trigger.oldMap.get(o.Id).StageName compared with o.StageName. The difference is scale: the formula looks at one record; the trigger gets up to 200 and compares each with its previous version, finding it by Id in oldMap.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "En el formulario de facturas del libro, el método btnAgregarActionPerformed recibe un parámetro, ActionEvent evt, con los datos del clic: en Java, quien avisa de un evento te pasa un objeto con la información. En un trigger no hay parámetros: las variables de contexto son static de la clase Trigger (Módulo 5), y por eso se escriben Trigger.new y no algo que tú declares. Existen solo mientras dura la ejecución del trigger, igual que las static duran una transacción.",
        en: "In the book's invoice form, the btnAgregarActionPerformed method receives a parameter, ActionEvent evt, with the click's data: in Java, whoever raises an event hands you an object with the information. A trigger has no parameters: the context variables are statics of the Trigger class (Module 5), which is why you write Trigger.new and not something you declare. They only exist while the trigger is running, just as statics last one transaction.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar la tabla: ¿en qué eventos no existe Trigger.old? ¿Por qué no hay Trigger.newMap en before insert? ¿Cómo encuentras el valor anterior de un registro concreto de Trigger.new?",
        en: "Without looking at the table: in which events does Trigger.old not exist? Why is there no Trigger.newMap in before insert? How do you find the previous value of a specific Trigger.new record?",
      },
    },
  ],

  quiz: [
    {
      id: "m06-l02-q1",
      kind: "single",
      prompt: {
        es: "¿En qué evento NO está disponible Trigger.newMap?",
        en: "In which event is Trigger.newMap NOT available?",
      },
      options: [
        { es: "before insert", en: "before insert" },
        { es: "after insert", en: "after insert" },
        { es: "before update", en: "before update" },
        { es: "after undelete", en: "after undelete" },
      ],
      answer: 0,
      explain: {
        es: "En before insert el registro aún no tiene Id, y un mapa por Id necesita Ids. En after insert ya los tiene.",
        en: "In before insert the record has no Id yet, and a map by Id needs Ids. In after insert it has them.",
      },
      tags: ["recall"],
    },
    {
      id: "m06-l02-q2",
      kind: "multi",
      prompt: {
        es: "¿En qué eventos existe Trigger.old?",
        en: "In which events does Trigger.old exist?",
      },
      options: [
        { es: "before update", en: "before update" },
        { es: "after delete", en: "after delete" },
        { es: "after insert", en: "after insert" },
        { es: "after undelete", en: "after undelete" },
      ],
      answers: [0, 1],
      explain: {
        es: "Solo hay un «antes» cuando el registro ya existía: update y delete. Al crear o recuperar no hay versión anterior en el trigger.",
        en: "There is only a “before” when the record already existed: update and delete. When creating or restoring there is no previous version in the trigger.",
      },
      tags: ["recall"],
    },
    {
      id: "m06-l02-q3",
      kind: "single",
      prompt: {
        es: "¿Qué pasa al ejecutar este trigger?",
        en: "What happens when this trigger runs?",
      },
      code: {
        es: `trigger CaseTrigger on Case (after update) {
    for (Case c : Trigger.new) {
        c.Priority = 'High';
    }
}`,
        en: `trigger CaseTrigger on Case (after update) {
    for (Case c : Trigger.new) {
        c.Priority = 'High';
    }
}`,
      },
      options: [
        {
          es: "System.FinalException: Record is read-only.",
          en: "System.FinalException: Record is read-only.",
        },
        { es: "Los casos se guardan con prioridad High.", en: "The cases are saved with High priority." },
        { es: "No compila.", en: "It does not compile." },
      ],
      answer: 0,
      explain: {
        es: "Compila, pero en after Trigger.new es de solo lectura. Para cambiar el propio registro se usa before update; en after harían falta consulta y DML.",
        en: "It compiles, but in after Trigger.new is read-only. To change the record itself you use before update; in after you would need a query and DML.",
      },
      tags: ["predict-output", "find-error"],
    },
    {
      id: "m06-l02-q4",
      kind: "single",
      prompt: {
        es: "En un before update, ¿cuál es la MEJOR forma de saber si cambió el Owner de cada cuenta?",
        en: "In a before update, what is the BEST way to know whether each account's Owner changed?",
      },
      options: [
        {
          es: "for (Account a : Trigger.new) { if (a.OwnerId != Trigger.oldMap.get(a.Id).OwnerId) … }",
          en: "for (Account a : Trigger.new) { if (a.OwnerId != Trigger.oldMap.get(a.Id).OwnerId) … }",
        },
        {
          es: "Consultar las cuentas con SOQL para ver el Owner que tenían",
          en: "Query the accounts with SOQL to see the Owner they had",
        },
        {
          es: "Comparar Trigger.new[0].OwnerId con Trigger.old[0].OwnerId",
          en: "Compare Trigger.new[0].OwnerId with Trigger.old[0].OwnerId",
        },
      ],
      answer: 0,
      explain: {
        es: "El valor anterior ya lo tienes en Trigger.oldMap: gastar una consulta es innecesario. Y [0] solo mira la primera cuenta del lote.",
        en: "You already have the previous value in Trigger.oldMap: spending a query is unnecessary. And [0] only looks at the first account in the batch.",
      },
      tags: ["interleaving", "spaced"],
      from: { es: "Repaso · M4 L3", en: "Review · M4 L3" },
    },
    {
      id: "m06-l02-q5",
      kind: "single",
      prompt: {
        es: "Un trigger escucha before insert y before update. ¿Qué pasa con esta línea cuando se crea un registro?",
        en: "A trigger listens to before insert and before update. What happens with this line when a record is created?",
      },
      code: {
        es: `Account previous = Trigger.oldMap.get(acc.Id);`,
        en: `Account previous = Trigger.oldMap.get(acc.Id);`,
      },
      options: [
        {
          es: "NullPointerException: en insert Trigger.oldMap es null.",
          en: "NullPointerException: in insert Trigger.oldMap is null.",
        },
        { es: "previous queda en null y sigue.", en: "previous ends up null and carries on." },
        { es: "No compila.", en: "It does not compile." },
      ],
      answer: 0,
      explain: {
        es: "No es un mapa vacío, es que no hay mapa. Por eso esa línea va dentro de un if (Trigger.isUpdate).",
        en: "It is not an empty map; there is no map at all. That is why that line goes inside an if (Trigger.isUpdate).",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M1 L6", en: "Review · M1 L6" },
    },
    {
      id: "m06-l02-q6",
      kind: "text",
      prompt: {
        es: "¿Qué variable de contexto usarías para buscar el registro anterior de una oportunidad a partir de su Id?",
        en: "Which context variable would you use to find an opportunity's previous record from its Id?",
      },
      accept: ["\\s*Trigger\\.oldMap\\s*", "\\s*oldMap\\s*"],
      placeholder: { es: "Trigger.…", en: "Trigger.…" },
      explain: {
        es: "Trigger.oldMap: Trigger.oldMap.get(opp.Id) te da la oportunidad tal como estaba.",
        en: "Trigger.oldMap: Trigger.oldMap.get(opp.Id) gives you the opportunity as it was.",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 2 DE 6 · Segundo flow: el rastro de cambios de etapa que usa Ventas. En el flow era $Record frente a $Record__Prior. Ventas quiere un rastro rápido de los cambios de etapa: cada vez que una oportunidad cambia de StageName, el campo NextStep debe decir de qué etapa venía y a cuál pasó. Si se edita cualquier otro campo, NextStep no se toca.",
      en: "TASK 2 OF 6 · Second flow: the stage-change trail Sales uses. In the flow it was $Record versus $Record__Prior. Sales wants a quick trail of stage changes: every time an opportunity changes StageName, the NextStep field must say which stage it came from and which it moved to. If any other field is edited, NextStep is left alone.",
    },
    brief: [
      {
        es: "Trigger OpportunityStage sobre Opportunity, en before update.",
        en: "Trigger OpportunityStage on Opportunity, on before update.",
      },
      {
        es: "Recorre Trigger.new y, para cada oportunidad, obtén su versión anterior con Trigger.oldMap.",
        en: "Walk Trigger.new and, for each opportunity, get its previous version with Trigger.oldMap.",
      },
      {
        es: "Solo si StageName cambió, pon en NextStep el texto 'Etapa: ' + etapa anterior + ' → ' + etapa nueva.",
        en: "Only if StageName changed, set NextStep to 'Stage: ' + previous stage + ' → ' + new stage.",
      },
      {
        es: "Sin consultas y sin DML: estás en before.",
        en: "No queries and no DML: you are in before.",
      },
    ],
    starter: {
      es: `// CASO: la migración de flows a Apex de Northwind
// Tarea 2 de 6: el rastro de etapas, comparando el antes y el después.

trigger OpportunityStage on Opportunity (before update) {

}
`,
      en: `// CASE: Northwind's flow-to-Apex migration
// Task 2 of 6: the stage trail, comparing before and after.

trigger OpportunityStage on Opportunity (before update) {

}
`,
    },
    hints: [
      {
        es: "El valor anterior no hay que consultarlo: ya te lo da el contexto del trigger.",
        en: "You do not need to query the previous value: the trigger context already gives it to you.",
      },
      {
        es: "Opportunity before = Trigger.oldMap.get(opp.Id); y después un if que compare opp.StageName con before.StageName.",
        en: "Opportunity before = Trigger.oldMap.get(opp.Id); then an if comparing opp.StageName with before.StageName.",
      },
      {
        es: "Pseudocódigo: for (Opportunity opp : Trigger.new) { Opportunity before = Trigger.oldMap.get(opp.Id); if (opp.StageName != before.StageName) { opp.NextStep = 'Etapa: ' + before.StageName + ' → ' + opp.StageName; } }",
        en: "Pseudocode: for (Opportunity opp : Trigger.new) { Opportunity before = Trigger.oldMap.get(opp.Id); if (opp.StageName != before.StageName) { opp.NextStep = 'Stage: ' + before.StageName + ' → ' + opp.StageName; } }",
      },
    ],
    solution: {
      es: `trigger OpportunityStage on Opportunity (before update) {
    for (Opportunity opp : Trigger.new) {
        Opportunity before = Trigger.oldMap.get(opp.Id);

        if (opp.StageName != before.StageName) {
            opp.NextStep = 'Etapa: ' + before.StageName + ' → ' + opp.StageName;
        }
    }
}`,
      en: `trigger OpportunityStage on Opportunity (before update) {
    for (Opportunity opp : Trigger.new) {
        Opportunity before = Trigger.oldMap.get(opp.Id);

        if (opp.StageName != before.StageName) {
            opp.NextStep = 'Stage: ' + before.StageName + ' → ' + opp.StageName;
        }
    }
}`,
    },
    checks: [
      {
        id: "m06-l02-c1",
        label: {
          es: "Trigger OpportunityStage en before update",
          en: "OpportunityStage trigger on before update",
        },
        rule: { op: "match", pattern: "trigger\\s+OpportunityStage\\s+on\\s+Opportunity\\s*\\(\\s*before\\s+update\\s*\\)" },
        onFail: {
          es: "trigger OpportunityStage on Opportunity (before update) { … }",
          en: "trigger OpportunityStage on Opportunity (before update) { … }",
        },
      },
      {
        id: "m06-l02-c2",
        label: {
          es: "Recorre Trigger.new y busca el anterior en Trigger.oldMap",
          en: "Walks Trigger.new and looks up the previous one in Trigger.oldMap",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "for\\s*\\(\\s*Opportunity\\s+(\\w+)\\s*:\\s*Trigger\\.new\\s*\\)" },
            { op: "match", pattern: "Trigger\\.oldMap\\.get\\(\\s*\\w+\\.Id\\s*\\)" },
          ],
        },
        onFail: {
          es: "for (Opportunity opp : Trigger.new) y dentro Trigger.oldMap.get(opp.Id).",
          en: "for (Opportunity opp : Trigger.new) and inside Trigger.oldMap.get(opp.Id).",
        },
      },
      {
        id: "m06-l02-c3",
        label: {
          es: "Solo actúa si StageName cambió",
          en: "Only acts if StageName changed",
        },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "if\\s*\\(\\s*\\w+\\.StageName\\s*!=\\s*\\w+(\\.StageName|\\.get\\(\\s*\\w+\\.Id\\s*\\)\\.StageName)\\s*\\)" },
            { op: "match", pattern: "if\\s*\\(\\s*Trigger\\.oldMap\\.get\\(\\s*\\w+\\.Id\\s*\\)\\.StageName\\s*!=\\s*\\w+\\.StageName\\s*\\)" },
            { op: "match", pattern: "if\\s*\\(\\s*!\\s*\\w+\\.StageName\\.equals\\(" },
          ],
        },
        onFail: {
          es: "Compara: if (opp.StageName != before.StageName) { … }. Sin ese if, NextStep cambiaría con cualquier edición.",
          en: "Compare: if (opp.StageName != before.StageName) { … }. Without that if, NextStep would change on any edit.",
        },
      },
      {
        id: "m06-l02-c4",
        label: {
          es: "NextStep lleva la etapa anterior y la nueva",
          en: "NextStep carries the previous and the new stage",
        },
        rule: { op: "match", pattern: "\\w+\\.NextStep\\s*=\\s*[^;]*\\.StageName[^;]*\\.StageName[^;]*;" },
        onFail: {
          es: "opp.NextStep = 'Etapa: ' + before.StageName + ' → ' + opp.StageName;",
          en: "opp.NextStep = 'Stage: ' + before.StageName + ' → ' + opp.StageName;",
        },
      },
      {
        id: "m06-l02-c5",
        label: {
          es: "Sin consultas ni DML",
          en: "No queries and no DML",
        },
        rule: {
          op: "all",
          of: [
            { op: "absent", pattern: "\\[\\s*SELECT\\b" },
            { op: "absent", pattern: "\\b(update|insert|delete|upsert)\\s+[\\w.()]+\\s*;" },
          ],
        },
        onFail: {
          es: "En before, cambiar opp.NextStep ya lo guarda. El valor anterior está en Trigger.oldMap: no hace falta consultarlo.",
          en: "In before, changing opp.NextStep already saves it. The previous value is in Trigger.oldMap: no need to query it.",
        },
        onPass: {
          es: "Cero consultas y cero DML, para 1 oportunidad o para 200: el contexto del trigger ya te lo daba todo.",
          en: "Zero queries and zero DML, for 1 opportunity or 200: the trigger context already gave you everything.",
        },
      },
    ],
    rubric: [
      {
        es: "Si el trigger también escuchara before insert, ¿qué línea fallaría al crear una oportunidad y cómo la protegerías?",
        en: "If the trigger also listened to before insert, which line would fail when creating an opportunity and how would you protect it?",
      },
      {
        es: "Tarea 3: el flow de alta de cuentas hace dos cosas, y cada una necesita un momento distinto del guardado.",
        en: "Task 3: the account onboarding flow does two things, and each needs a different moment of the save.",
      },
    ],
  },
};
