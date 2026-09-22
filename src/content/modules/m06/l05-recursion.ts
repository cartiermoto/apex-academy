import type { Lesson } from "@/lib/types";

export const l05Recursion: Lesson = {
  id: "m06-l05",
  slug: "recursion",
  n: 5,
  kind: "lesson",
  minutes: 35,
  title: {
    es: "Recursión y cómo evitarla",
    en: "Recursion and how to avoid it",
  },
  summary: {
    es: "Un trigger que guarda registros de su propio objeto se vuelve a disparar a sí mismo. Por qué pasa, cómo reconocerlo y las tres defensas, de mejor a peor.",
    en: "A trigger that saves records of its own object fires itself again. Why it happens, how to spot it and the three defences, from best to worst.",
  },
  analogy: {
    es: "Un Flow que actualiza el mismo registro que lo disparó",
    en: "A Flow that updates the same record that triggered it",
  },
  objectives: [
    {
      es: "Explicar qué provoca la recursión en un trigger y qué error produce.",
      en: "Explain what causes recursion in a trigger and which error it produces.",
    },
    {
      es: "Evitarla de raíz eligiendo before y comprobando si el campo cambió.",
      en: "Prevent it at the root by choosing before and checking whether the field changed.",
    },
    {
      es: "Escribir una guarda con un Set<Id> estático, y saber por qué un Boolean estático no basta.",
      en: "Write a guard with a static Set<Id>, and know why a static Boolean is not enough.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "En la lección 3 viste un aviso: hacer update de los propios registros desde un trigger after es mala idea. Aquí ves por qué. Ese update es un guardado como cualquier otro, recorre el orden de ejecución entero y vuelve a disparar el mismo trigger. Que vuelve a hacer update. Que lo vuelve a disparar. Eso es la [[recursion|recursión]].",
        en: "In lesson 3 you saw a warning: updating the records themselves from an after trigger is a bad idea. Here you see why. That update is a save like any other, goes through the whole order of execution and fires the same trigger again. Which updates again. Which fires it again. That is [[recursion]].",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Si alguna vez hiciste un Record-Triggered Flow «Actions and Related Records» que actualiza el mismo registro que lo disparó, ya conoces el problema: ese Update Records vuelve a guardar el registro y relanza la automatización del objeto. Por eso Salesforce recomienda cambiar el propio registro con «Fast Field Updates». Y en los tiempos de Process Builder, «Allow process to evaluate a record multiple times in a single transaction» era exactamente esta pregunta. En un trigger no hay casilla ni aviso: la defensa la escribes tú.",
        en: "If you ever built an “Actions and Related Records” record-triggered Flow that updates the same record that fired it, you already know the problem: that Update Records saves the record again and reruns the object's automation. That is why Salesforce recommends changing the record itself with “Fast Field Updates”. And back in the Process Builder days, “Allow process to evaluate a record multiple times in a single transaction” was exactly this question. In a trigger there is no checkbox and no warning: you write the defence yourself.",
      },
    },
    {
      type: "h",
      text: { es: "Cómo se ve", en: "What it looks like" },
    },
    {
      type: "code",
      code: {
        es: `trigger OpportunityReview on Opportunity (after update) {
    List<Opportunity> toUpdate = new List<Opportunity>();
    for (Opportunity o : Trigger.new) {
        toUpdate.add(new Opportunity(Id = o.Id, Description = 'Revisada'));
    }
    update toUpdate;   // ← guarda oportunidades… y dispara este trigger otra vez
}`,
        en: `trigger OpportunityReview on Opportunity (after update) {
    List<Opportunity> toUpdate = new List<Opportunity>();
    for (Opportunity o : Trigger.new) {
        toUpdate.add(new Opportunity(Id = o.Id, Description = 'Reviewed'));
    }
    update toUpdate;   // ← saves opportunities… and fires this trigger again
}`,
      },
      caption: {
        es: "Bulkificado, sin consultas en bucles… y aun así roto. La recursión no es un problema de volumen: aparece con un solo registro.",
        en: "Bulkified, no queries in loops… and still broken. Recursion is not a volume problem: it shows up with a single record.",
      },
    },
    {
      type: "diagram",
      id: "m06-recursion",
      caption: {
        es: "Salesforce corta el bucle al llegar a 16 niveles, y entonces se deshace toda la transacción.",
        en: "Salesforce cuts the loop at 16 levels deep, and then the whole transaction is rolled back.",
      },
    },
    {
      type: "p",
      text: {
        es: "Salesforce no deja que el bucle siga para siempre: al llegar a 16 niveles de triggers anidados lanza «Maximum trigger depth exceeded» y la transacción entera se deshace. Antes de llegar ahí, cada vuelta ha gastado CPU, consultas y DML del mismo presupuesto del Módulo 4, así que a menudo el error que ves es otro governor limit. En los dos casos el usuario solo ve que no puede guardar.",
        en: "Salesforce does not let the loop run forever: at 16 levels of nested triggers it throws “Maximum trigger depth exceeded” and the whole transaction is rolled back. Before getting there, each round has spent CPU, queries and DML from the same Module 4 budget, so the error you see is often a different governor limit. Either way, the user only sees that they cannot save.",
      },
    },
    {
      type: "h",
      text: { es: "Defensa 1: no provocarla", en: "Defence 1: do not cause it" },
    },
    {
      type: "p",
      text: {
        es: "La mayoría de las recursiones nacen de cambiar el propio registro en after. Si lo que quieres es cambiar un campo del mismo registro, hazlo en before: se guarda solo, sin DML, y sin DML no hay nuevo guardado que dispare nada. El ejemplo de arriba, reescrito, desaparece como problema.",
        en: "Most recursion is born from changing the record itself in after. If what you want is to change a field on the same record, do it in before: it saves by itself, with no DML, and without DML there is no new save to fire anything. The example above, rewritten, stops being a problem.",
      },
    },
    {
      type: "code",
      code: {
        es: `trigger OpportunityReview on Opportunity (before update) {
    for (Opportunity o : Trigger.new) {
        o.Description = 'Revisada';   // sin DML: no hay segunda vuelta
    }
}`,
        en: `trigger OpportunityReview on Opportunity (before update) {
    for (Opportunity o : Trigger.new) {
        o.Description = 'Reviewed';   // no DML: no second round
    }
}`,
      },
    },
    {
      type: "h",
      text: { es: "Defensa 2: actuar solo si algo cambió", en: "Defence 2: act only if something changed" },
    },
    {
      type: "p",
      text: {
        es: "Hay casos en los que after es inevitable: por ejemplo, cuando una oportunidad cambia de etapa y tienes que actualizar la cuenta, y la cuenta a su vez tiene un trigger que toca sus oportunidades. Ahí la segunda defensa es la comparación de la lección 2: actúa solo si el campo que te importa cambió respecto a Trigger.oldMap. En la segunda vuelta el campo ya no cambia, y la lógica no se vuelve a ejecutar. Es lo que en Flow hace «Only when a record is updated to meet the condition requirements».",
        en: "There are cases where after is unavoidable: for example, when an opportunity changes stage and you have to update the account, and the account in turn has a trigger that touches its opportunities. There the second defence is lesson 2's comparison: act only if the field you care about changed compared to Trigger.oldMap. On the second round the field no longer changes, and the logic does not run again. It is what “Only when a record is updated to meet the condition requirements” does in Flow.",
      },
    },
    {
      type: "h",
      text: { es: "Defensa 3: la guarda estática", en: "Defence 3: the static guard" },
    },
    {
      type: "p",
      text: {
        es: "Cuando no puedes evitar el DML ni basta con comparar, apuntas qué registros ya procesaste en esta transacción. En el Módulo 5 viste que una variable static vive exactamente una transacción: nace con el primer uso y desaparece al terminar. Es el sitio perfecto para esa lista, en una pequeña clase auxiliar.",
        en: "When you cannot avoid the DML and comparing is not enough, you note which records you have already processed in this transaction. In Module 5 you saw that a static variable lives exactly one transaction: it is born on first use and disappears when it ends. It is the perfect place for that list, in a small helper class.",
      },
    },
    {
      type: "code",
      code: {
        es: `public class OpportunityTriggerGuard {
    public static Set<Id> processed = new Set<Id>();
}

trigger OpportunityReview on Opportunity (after update) {
    List<Opportunity> toUpdate = new List<Opportunity>();
    for (Opportunity o : Trigger.new) {
        if (OpportunityTriggerGuard.processed.contains(o.Id)) {
            continue;                                  // ya lo hice en esta transacción
        }
        OpportunityTriggerGuard.processed.add(o.Id);
        toUpdate.add(new Opportunity(Id = o.Id, Description = 'Revisada'));
    }
    if (!toUpdate.isEmpty()) {
        update toUpdate;   // la segunda vuelta encuentra todos los Ids y no hace nada
    }
}`,
        en: `public class OpportunityTriggerGuard {
    public static Set<Id> processed = new Set<Id>();
}

trigger OpportunityReview on Opportunity (after update) {
    List<Opportunity> toUpdate = new List<Opportunity>();
    for (Opportunity o : Trigger.new) {
        if (OpportunityTriggerGuard.processed.contains(o.Id)) {
            continue;                                  // already done in this transaction
        }
        OpportunityTriggerGuard.processed.add(o.Id);
        toUpdate.add(new Opportunity(Id = o.Id, Description = 'Reviewed'));
    }
    if (!toUpdate.isEmpty()) {
        update toUpdate;   // the second round finds every Id and does nothing
    }
}`,
      },
      caption: {
        es: "Son dos archivos: la clase y el trigger. El continue del Módulo 2 salta los ya procesados, y el if de la lista vacía evita un DML inútil.",
        en: "These are two files: the class and the trigger. Module 2's continue skips the ones already processed, and the empty-list if avoids a pointless DML.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "¿Por qué no un Boolean estático?", en: "Why not a static Boolean?" },
      text: {
        es: "En muchos tutoriales verás public static Boolean hasRun = false; y un if (!hasRun) al principio del trigger. Parece más simple y funciona al probar con un registro. El problema es el de siempre, el lote: si Data Loader carga 400 oportunidades, llegan en dos ejecuciones de 200 dentro de la misma transacción. La primera pone hasRun a true, y la segunda se salta sus 200 registros sin procesarlos y sin dar ningún error. El Set<Id> pregunta «¿ya procesé ESTE registro?», no «¿ya se ejecutó el trigger?», y por eso no se salta a nadie.",
        en: "In many tutorials you will see public static Boolean hasRun = false; and an if (!hasRun) at the top of the trigger. It looks simpler and it works when you test with one record. The problem is the usual one, the batch: if Data Loader loads 400 opportunities, they arrive in two runs of 200 within the same transaction. The first sets hasRun to true, and the second skips its 200 records without processing them and without any error. The Set<Id> asks “did I already process THIS record?”, not “has the trigger already run?”, and that is why it skips nobody.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "El libro dedica el apartado 4.3 a la recursividad: un método que se llama a sí mismo, como Factorial(n - 1), con un «caso base» que corta el bucle (si n es 0, devuelve 1). La recursión de un trigger es la misma idea, pero sin querer: nadie escribe «llámate otra vez», lo hace el update. Y la lección del libro sigue valiendo: toda recursión necesita su caso base. En un trigger, el caso base es tu guarda.",
        en: "The book devotes section 4.3 to recursion: a method that calls itself, like Factorial(n - 1), with a “base case” that stops the loop (if n is 0, return 1). A trigger's recursion is the same idea, but unintended: nobody writes “call yourself again”, the update does it. And the book's lesson still holds: every recursion needs its base case. In a trigger, the base case is your guard.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: di las tres defensas en orden de preferencia. ¿Qué error lanza Salesforce y en qué nivel? ¿Por qué un Boolean estático falla con 400 registros y un Set<Id> no?",
        en: "Without looking: name the three defences in order of preference. Which error does Salesforce throw and at what level? Why does a static Boolean fail with 400 records and a Set<Id> does not?",
      },
    },
  ],

  quiz: [
    {
      id: "m06-l05-q1",
      kind: "single",
      prompt: {
        es: "¿Qué error lanza Salesforce cuando un trigger se dispara a sí mismo sin control?",
        en: "Which error does Salesforce throw when a trigger fires itself without control?",
      },
      options: [
        { es: "Maximum trigger depth exceeded", en: "Maximum trigger depth exceeded" },
        { es: "Record is read-only", en: "Record is read-only" },
        { es: "List has no rows for assignment to SObject", en: "List has no rows for assignment to SObject" },
      ],
      answer: 0,
      explain: {
        es: "Al llegar a 16 niveles de triggers anidados. Record is read-only es de la lección 2; List has no rows, del Módulo 3.",
        en: "At 16 levels of nested triggers. Record is read-only is from lesson 2; List has no rows, from Module 3.",
      },
      tags: ["recall", "interleaving"],
    },
    {
      id: "m06-l05-q2",
      kind: "single",
      prompt: {
        es: "Tu trigger after update pone Description = 'Revisada' en las mismas cuentas con un update. ¿Cuál es la MEJOR corrección?",
        en: "Your after update trigger sets Description = 'Reviewed' on the same accounts with an update. What is the BEST fix?",
      },
      options: [
        {
          es: "Pasarlo a before update y cambiar el campo sin DML.",
          en: "Move it to before update and change the field with no DML.",
        },
        {
          es: "Mantener after y añadir una guarda con Set<Id> estático.",
          en: "Keep after and add a guard with a static Set<Id>.",
        },
        {
          es: "Mantener after y añadir un Boolean estático hasRun.",
          en: "Keep after and add a static Boolean hasRun.",
        },
      ],
      answer: 0,
      explain: {
        es: "La mejor guarda es no necesitarla: sin DML no hay segundo guardado. La segunda funciona pero es un parche; la tercera además falla con lotes grandes.",
        en: "The best guard is not needing one: with no DML there is no second save. The second works but is a patch; the third also fails with large batches.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m06-l05-q3",
      kind: "single",
      prompt: {
        es: "Un trigger usa public static Boolean hasRun como guarda. Data Loader carga 400 oportunidades en una transacción. ¿Qué pasa?",
        en: "A trigger uses public static Boolean hasRun as a guard. Data Loader loads 400 opportunities in one transaction. What happens?",
      },
      options: [
        {
          es: "Se procesan las primeras 200 y las otras 200 se saltan sin error.",
          en: "The first 200 are processed and the other 200 are skipped without an error.",
        },
        { es: "Se procesan las 400.", en: "All 400 are processed." },
        { es: "Falla con Maximum trigger depth exceeded.", en: "It fails with Maximum trigger depth exceeded." },
      ],
      answer: 0,
      explain: {
        es: "Dos ejecuciones de 200 en la misma transacción: la primera deja hasRun en true y la segunda no hace nada. El fallo silencioso es el peor tipo de fallo.",
        en: "Two runs of 200 in the same transaction: the first leaves hasRun at true and the second does nothing. A silent failure is the worst kind.",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M4 L3", en: "Review · M4 L3" },
    },
    {
      id: "m06-l05-q4",
      kind: "single",
      prompt: {
        es: "¿Por qué la guarda se guarda en una variable static?",
        en: "Why is the guard kept in a static variable?",
      },
      options: [
        {
          es: "Porque dura toda la transacción y la comparten todas las ejecuciones del trigger dentro de ella.",
          en: "Because it lasts the whole transaction and every run of the trigger within it shares it.",
        },
        {
          es: "Porque se guarda en la base de datos entre transacciones.",
          en: "Because it is stored in the database between transactions.",
        },
        {
          es: "Porque los triggers no admiten variables normales.",
          en: "Because triggers do not allow normal variables.",
        },
      ],
      answer: 0,
      explain: {
        es: "Una static vive una transacción: sobrevive entre la primera y la segunda vuelta, y desaparece al acabar. No se guarda en ningún sitio.",
        en: "A static lives one transaction: it survives between the first and second round, and disappears when it ends. It is not stored anywhere.",
      },
      tags: ["spaced", "recall"],
      from: { es: "Repaso · M5 L5", en: "Review · M5 L5" },
    },
    {
      id: "m06-l05-q5",
      kind: "multi",
      prompt: {
        es: "¿Qué puede disparar una segunda ejecución de tu trigger de update en la misma transacción?",
        en: "What can fire a second run of your update trigger in the same transaction?",
      },
      options: [
        { es: "Un update de los mismos registros desde tu trigger after.", en: "An update of the same records from your after trigger." },
        { es: "Una actualización de campo de una regla de workflow.", en: "A workflow rule field update." },
        { es: "Un flow after-save que actualiza el mismo registro.", en: "An after-save flow that updates the same record." },
        { es: "Cambiar un campo de Trigger.new en before update.", en: "Changing a field on Trigger.new in before update." },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Cualquier nuevo guardado del registro relanza sus triggers. Cambiar Trigger.new en before no es un guardado nuevo: viaja con el que está en marcha.",
        en: "Any new save of the record reruns its triggers. Changing Trigger.new in before is not a new save: it travels with the one under way.",
      },
      tags: ["interleaving", "spaced"],
      from: { es: "Repaso · M6 L4", en: "Review · M6 L4" },
    },
    {
      id: "m06-l05-q6",
      kind: "text",
      prompt: {
        es: "¿A cuántos niveles de triggers anidados corta Salesforce la recursión? (solo el número)",
        en: "At how many levels of nested triggers does Salesforce cut the recursion? (just the number)",
      },
      accept: ["\\s*16\\s*"],
      placeholder: { es: "número", en: "number" },
      explain: {
        es: "16. En la vuelta 16 lanza Maximum trigger depth exceeded y deshace la transacción.",
        en: "16. On round 16 it throws Maximum trigger depth exceeded and rolls back the transaction.",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "Otro equipo tiene un trigger en Account que actualiza las oportunidades de la cuenta, así que tu trigger after update de Opportunity no puede pasar a before: está en un ping-pong entre objetos. Protégelo con las defensas 2 y 3.",
      en: "Another team has a trigger on Account that updates the account's opportunities, so your Opportunity after update trigger cannot move to before: it is in a ping-pong between objects. Protect it with defences 2 and 3.",
    },
    brief: [
      {
        es: "En la clase OpportunityTriggerGuard, declara public static Set<Id> processed, inicializado vacío.",
        en: "In the OpportunityTriggerGuard class, declare public static Set<Id> processed, initialised empty.",
      },
      {
        es: "En el trigger, salta (continue) las oportunidades cuyo Id ya esté en processed, y añade las demás.",
        en: "In the trigger, skip (continue) the opportunities whose Id is already in processed, and add the rest.",
      },
      {
        es: "Solo prepara la actualización si StageName cambió respecto a Trigger.oldMap.",
        en: "Only prepare the update if StageName changed compared to Trigger.oldMap.",
      },
      {
        es: "Haz el update solo si la lista no está vacía. En el editor van los dos archivos, uno detrás de otro.",
        en: "Only run the update if the list is not empty. Both files go in the editor, one after the other.",
      },
    ],
    starter: {
      es: `public class OpportunityTriggerGuard {
    // la guarda de esta transacción
}

trigger OpportunityReview on Opportunity (after update) {
    List<Opportunity> toUpdate = new List<Opportunity>();
    for (Opportunity o : Trigger.new) {
        toUpdate.add(new Opportunity(Id = o.Id, Description = 'Etapa revisada: ' + o.StageName));
    }
    update toUpdate;
}
`,
      en: `public class OpportunityTriggerGuard {
    // this transaction's guard
}

trigger OpportunityReview on Opportunity (after update) {
    List<Opportunity> toUpdate = new List<Opportunity>();
    for (Opportunity o : Trigger.new) {
        toUpdate.add(new Opportunity(Id = o.Id, Description = 'Stage reviewed: ' + o.StageName));
    }
    update toUpdate;
}
`,
    },
    hints: [
      {
        es: "Dos preguntas al principio del bucle, para cada oportunidad: ¿ya la procesé? y ¿cambió la etapa?",
        en: "Two questions at the top of the loop, for each opportunity: did I already process it? and did the stage change?",
      },
      {
        es: "OpportunityTriggerGuard.processed.contains(o.Id) → continue. Luego .add(o.Id). La etapa: o.StageName != Trigger.oldMap.get(o.Id).StageName.",
        en: "OpportunityTriggerGuard.processed.contains(o.Id) → continue. Then .add(o.Id). The stage: o.StageName != Trigger.oldMap.get(o.Id).StageName.",
      },
      {
        es: "Pseudocódigo: public static Set<Id> processed = new Set<Id>(); … for (…) { if (OpportunityTriggerGuard.processed.contains(o.Id)) continue; OpportunityTriggerGuard.processed.add(o.Id); if (o.StageName != Trigger.oldMap.get(o.Id).StageName) toUpdate.add(…); } if (!toUpdate.isEmpty()) update toUpdate;",
        en: "Pseudocode: public static Set<Id> processed = new Set<Id>(); … for (…) { if (OpportunityTriggerGuard.processed.contains(o.Id)) continue; OpportunityTriggerGuard.processed.add(o.Id); if (o.StageName != Trigger.oldMap.get(o.Id).StageName) toUpdate.add(…); } if (!toUpdate.isEmpty()) update toUpdate;",
      },
    ],
    solution: {
      es: `public class OpportunityTriggerGuard {
    public static Set<Id> processed = new Set<Id>();
}

trigger OpportunityReview on Opportunity (after update) {
    List<Opportunity> toUpdate = new List<Opportunity>();
    for (Opportunity o : Trigger.new) {
        if (OpportunityTriggerGuard.processed.contains(o.Id)) {
            continue;
        }
        OpportunityTriggerGuard.processed.add(o.Id);

        if (o.StageName != Trigger.oldMap.get(o.Id).StageName) {
            toUpdate.add(new Opportunity(Id = o.Id, Description = 'Etapa revisada: ' + o.StageName));
        }
    }
    if (!toUpdate.isEmpty()) {
        update toUpdate;
    }
}`,
      en: `public class OpportunityTriggerGuard {
    public static Set<Id> processed = new Set<Id>();
}

trigger OpportunityReview on Opportunity (after update) {
    List<Opportunity> toUpdate = new List<Opportunity>();
    for (Opportunity o : Trigger.new) {
        if (OpportunityTriggerGuard.processed.contains(o.Id)) {
            continue;
        }
        OpportunityTriggerGuard.processed.add(o.Id);

        if (o.StageName != Trigger.oldMap.get(o.Id).StageName) {
            toUpdate.add(new Opportunity(Id = o.Id, Description = 'Stage reviewed: ' + o.StageName));
        }
    }
    if (!toUpdate.isEmpty()) {
        update toUpdate;
    }
}`,
    },
    checks: [
      {
        id: "m06-l05-c1",
        label: {
          es: "La clase declara public static Set<Id> processed",
          en: "The class declares public static Set<Id> processed",
        },
        rule: { op: "match", pattern: "public\\s+static\\s+Set\\s*<\\s*Id\\s*>\\s+processed\\s*=\\s*new\\s+Set\\s*<\\s*Id\\s*>\\s*\\(\\s*\\)\\s*;" },
        onFail: {
          es: "public static Set<Id> processed = new Set<Id>(); dentro de OpportunityTriggerGuard.",
          en: "public static Set<Id> processed = new Set<Id>(); inside OpportunityTriggerGuard.",
        },
      },
      {
        id: "m06-l05-c2",
        label: {
          es: "Salta las ya procesadas y apunta las nuevas",
          en: "Skips the ones already processed and notes the new ones",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "OpportunityTriggerGuard\\.processed\\.contains\\(\\s*\\w+\\.Id\\s*\\)" },
            { op: "match", pattern: "\\bcontinue\\s*;" },
            { op: "match", pattern: "OpportunityTriggerGuard\\.processed\\.add\\(\\s*\\w+\\.Id\\s*\\)" },
          ],
        },
        onFail: {
          es: "if (OpportunityTriggerGuard.processed.contains(o.Id)) { continue; } y después OpportunityTriggerGuard.processed.add(o.Id);",
          en: "if (OpportunityTriggerGuard.processed.contains(o.Id)) { continue; } and then OpportunityTriggerGuard.processed.add(o.Id);",
        },
      },
      {
        id: "m06-l05-c3",
        label: {
          es: "Solo actúa si StageName cambió",
          en: "Only acts if StageName changed",
        },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "\\w+\\.StageName\\s*!=\\s*Trigger\\.oldMap\\.get\\(\\s*\\w+\\.Id\\s*\\)\\.StageName" },
            { op: "match", pattern: "Trigger\\.oldMap\\.get\\(\\s*\\w+\\.Id\\s*\\)\\.StageName\\s*!=\\s*\\w+\\.StageName" },
            { op: "match", pattern: "\\w+\\.StageName\\s*!=\\s*\\w+\\.StageName" },
          ],
        },
        onFail: {
          es: "if (o.StageName != Trigger.oldMap.get(o.Id).StageName) { toUpdate.add(…); }",
          en: "if (o.StageName != Trigger.oldMap.get(o.Id).StageName) { toUpdate.add(…); }",
        },
      },
      {
        id: "m06-l05-c4",
        label: {
          es: "No usa un Boolean estático como guarda",
          en: "Does not use a static Boolean as the guard",
        },
        rule: { op: "absent", pattern: "static\\s+Boolean\\b" },
        onFail: {
          es: "Un Boolean estático se salta el segundo lote de 200. La guarda es el Set<Id>.",
          en: "A static Boolean skips the second batch of 200. The guard is the Set<Id>.",
        },
      },
      {
        id: "m06-l05-c5",
        label: {
          es: "Un solo update, solo si la lista tiene algo",
          en: "A single update, only if the list has something",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "if\\s*\\(\\s*!\\s*toUpdate\\.isEmpty\\(\\s*\\)\\s*\\)" },
            { op: "count", pattern: "\\bupdate\\s+toUpdate\\s*;", min: 1, max: 1 },
          ],
        },
        onFail: {
          es: "if (!toUpdate.isEmpty()) { update toUpdate; } — sin cambios, sin DML.",
          en: "if (!toUpdate.isEmpty()) { update toUpdate; } — no changes, no DML.",
        },
        onPass: {
          es: "La segunda vuelta encuentra todos los Ids apuntados y no hace nada: el ping-pong se para en seco.",
          en: "The second round finds every Id already noted and does nothing: the ping-pong stops dead.",
        },
      },
    ],
    rubric: [
      {
        es: "Con solo la comparación de StageName (sin el Set), ¿se pararía el bucle? ¿Y con solo el Set, sin la comparación? ¿Qué aporta cada una?",
        en: "With only the StageName comparison (no Set), would the loop stop? And with only the Set, no comparison? What does each one contribute?",
      },
    ],
  },
};
