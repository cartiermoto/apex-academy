import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente nocturno con el ERP de Northwind
// Tarea 5 de 6: el guardián de renovaciones, sin tumbar el lote.

// Lo llama OpportunityTriggerHandler en before insert (Módulo 7)
public class RenewalGuard {
    public static void validate(List<Opportunity> newOpps) {
        // 1. Reunir las cuentas de las renovaciones que llegan
        Set<Id> accountIds = new Set<Id>();
        for (Opportunity o : newOpps) {
            if (o.Type == 'Renewal' && o.AccountId != null) {
                accountIds.add(o.AccountId);
            }
        }

        // 2. Una sola consulta: ¿cuáles ya tienen una renovación abierta?
        List<Opportunity> openRenewals = [
            SELECT AccountId FROM Opportunity
            WHERE AccountId IN :accountIds AND Type = 'Renewal' AND IsClosed = false
        ];
        Set<Id> accountsWithRenewal = new Set<Id>();
        for (Opportunity existing : openRenewals) {
            accountsWithRenewal.add(existing.AccountId);
        }

        // 3. Decidir fila a fila, sin lanzar nada
        for (Opportunity o : newOpps) {
            if (o.Type != 'Renewal') {
                continue;
            }
            if (o.Amount == null || o.Amount <= 0) {
                o.Amount.addError('El importe de una renovación tiene que ser mayor que 0.');
            } else if (accountsWithRenewal.contains(o.AccountId)) {
                o.addError('Esta cuenta ya tiene una renovación abierta.');
            } else {
                accountsWithRenewal.add(o.AccountId);   // la siguiente del mismo lote ya la verá
            }
        }
    }
}`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente nocturno con el ERP de Northwind\n// Tarea 5 de 6: el guardián de renovaciones, sin tumbar el lote.\n\n// Lo llama OpportunityTriggerHandler en before insert (Módulo 7)",
  "// CASE: Northwind's nightly bridge with the ERP\n// Task 5 of 6: the renewal guard, without bringing down the batch.\n\n// Called by OpportunityTriggerHandler in before insert (Module 7)",
)
  .replace("// 1. Reunir las cuentas de las renovaciones que llegan", "// 1. Gather the accounts of the incoming renewals")
  .replace("// 2. Una sola consulta: ¿cuáles ya tienen una renovación abierta?", "// 2. A single query: which ones already have an open renewal?")
  .replace("// 3. Decidir fila a fila, sin lanzar nada", "// 3. Decide row by row, throwing nothing")
  .replace("'El importe de una renovación tiene que ser mayor que 0.'", "'A renewal amount must be greater than 0.'")
  .replace("'Esta cuenta ya tiene una renovación abierta.'", "'This account already has an open renewal.'")
  .replace("// la siguiente del mismo lote ya la verá", "// the next one in the same batch will see it");

const STARTER_ES = `// CASO: el puente nocturno con el ERP de Northwind
// Ya resuelto (tareas 1-4): la importación trata cada fila y sus errores tienen nombre propio.
// Tarea 5 de 6: el guardián de renovaciones, sin tumbar el lote.

// Lo llama OpportunityTriggerHandler en before insert (Módulo 7)
public class RenewalGuard {
    public static void validate(List<Opportunity> newOpps) {
        for (Opportunity o : newOpps) {
            if (o.Type != 'Renewal') {
                continue;
            }
            Integer openCount = [
                SELECT COUNT() FROM Opportunity
                WHERE AccountId = :o.AccountId AND Type = 'Renewal' AND IsClosed = false
            ];
            if (openCount > 0) {
                throw new RenewalImportException('Esta cuenta ya tiene una renovación abierta.');
            }
        }
    }
}
`;

const STARTER_EN = `// CASE: Northwind's nightly bridge with the ERP
// Already solved (tasks 1-4): the import handles each row and its errors have their own name.
// Task 5 of 6: the renewal guard, without bringing down the batch.

// Called by OpportunityTriggerHandler in before insert (Module 7)
public class RenewalGuard {
    public static void validate(List<Opportunity> newOpps) {
        for (Opportunity o : newOpps) {
            if (o.Type != 'Renewal') {
                continue;
            }
            Integer openCount = [
                SELECT COUNT() FROM Opportunity
                WHERE AccountId = :o.AccountId AND Type = 'Renewal' AND IsClosed = false
            ];
            if (openCount > 0) {
                throw new RenewalImportException('This account already has an open renewal.');
            }
        }
    }
}
`;

export const l05AdderrorEnTriggers: Lesson = {
  id: "m08-l05",
  slug: "adderror-en-triggers",
  n: 5,
  kind: "lesson",
  minutes: 35,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 4", en: "Remember? · Review of lesson 4" },
    prompt: {
      es: "¿Por qué el bucle de la importación captura solo RenewalImportException y no Exception?",
      en: "Why does the import loop catch only RenewalImportException and not Exception?",
    },
    options: [
      { es: "Para tratar los rechazos del negocio y que los bugs de verdad no se escondan", en: "To handle business rejections and keep real bugs from hiding" },
      { es: "Porque Exception no se puede capturar", en: "Because Exception cannot be caught" },
      { es: "Porque es más rápido", en: "Because it is faster" },
    ],
    answer: 0,
    explain: {
      es: "Exception lo atraparía todo, también un NullPointerException por un bug. Hoy vas al otro lado: un trigger que rechaza registros sin lanzar ninguna excepción.",
      en: "Exception would trap everything, including a NullPointerException from a bug. Today you go to the other side: a trigger that rejects records without throwing any exception.",
    },
  },
  title: { es: "addError en triggers", en: "addError in triggers" },
  summary: {
    es: "En un trigger no lanzas excepciones para rechazar un registro: marcas ese registro con addError. Solo falla él, el usuario ve tu mensaje como el de una regla de validación, y el resto del lote sigue su camino.",
    en: "In a trigger you do not throw exceptions to reject a record: you mark that record with addError. Only that one fails, the user sees your message just like a validation rule's, and the rest of the batch goes on its way.",
  },
  analogy: {
    es: "Una regla de validación que sí ve los demás registros",
    en: "A validation rule that can see the other records",
  },
  objectives: [
    {
      es: "Rechazar un registro en un trigger con addError, a nivel de registro y de campo.",
      en: "Reject a record in a trigger with addError, at record level and at field level.",
    },
    {
      es: "Explicar qué pasa con el lote al usar throw o addError, con insert o con Database.insert(list, false).",
      en: "Explain what happens to the batch with throw or addError, using insert or Database.insert(list, false).",
    },
    {
      es: "Detectar duplicados dentro del mismo lote, algo que ni una regla de validación ni un flow resuelven bien.",
      en: "Detect duplicates inside the same batch, something neither a validation rule nor a flow handles well.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Northwind quiere una norma: una cuenta no puede tener dos renovaciones abiertas a la vez. La primera versión del guardián la escribió alguien del equipo con un throw, y la primera noche que el ERP cargó 200 renovaciones, una sola repetida tumbó las 200. Hoy aprenderás la forma correcta de decir «no» dentro de un trigger.",
        en: "Northwind wants a rule: an account cannot have two open renewals at once. The first version of the guard was written by someone on the team with a throw, and the first night the ERP loaded 200 renewals, a single duplicate brought down all 200. Today you will learn the right way to say «no» inside a trigger.",
      },
    },
    {
      type: "h",
      text: { es: "addError: rechazar un registro, no la transacción", en: "addError: rejecting a record, not the transaction" },
    },
    {
      type: "p",
      text: {
        es: "Todo registro de Trigger.new tiene un método addError('mensaje'). Llamarlo no lanza nada: tu código sigue ejecutándose con normalidad, pero ese registro queda marcado como fallido y Salesforce no lo guardará. Si lo pides sobre un campo, o.Amount.addError('…'), el mensaje aparece junto a ese campo en el formulario, igual que una regla de validación con «Error Location: Field».",
        en: "Every record in Trigger.new has an addError('message') method. Calling it throws nothing: your code keeps running normally, but that record is marked as failed and Salesforce will not save it. Call it on a field, o.Amount.addError('…'), and the message appears next to that field on the form, just like a validation rule with «Error Location: Field».",
      },
    },
    {
      type: "code",
      code: {
        es: `for (Opportunity o : newOpps) {
    if (o.Amount == null || o.Amount <= 0) {
        o.Amount.addError('El importe tiene que ser mayor que 0.');   // junto al campo
    } else if (accountsWithRenewal.contains(o.AccountId)) {
        o.addError('Esta cuenta ya tiene una renovación abierta.');   // arriba del registro
    }
}
// El bucle sigue: ningún addError para la ejecución`,
        en: `for (Opportunity o : newOpps) {
    if (o.Amount == null || o.Amount <= 0) {
        o.Amount.addError('The amount must be greater than 0.');      // next to the field
    } else if (accountsWithRenewal.contains(o.AccountId)) {
        o.addError('This account already has an open renewal.');      // at the top of the record
    }
}
// The loop carries on: no addError stops execution`,
      },
      caption: {
        es: "A diferencia de throw, addError no interrumpe el bucle: puedes marcar varios registros en una sola pasada.",
        en: "Unlike throw, addError does not interrupt the loop: you can mark several records in a single pass.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Tu regla de validación de siempre… con vista al resto del lote", en: "Your usual validation rule… with a view of the rest of the batch" },
      text: {
        es: "Para el usuario que guarda desde el formulario, addError es indistinguible de una regla de validación: el mismo cuadro rojo, el mismo mensaje. Para Data Loader también: el registro aparece en el error.csv con tu texto y los demás se guardan. La diferencia está dentro: tu código puede consultar otros registros y ver todo el lote antes de decidir.",
        en: "To the user saving from the form, addError is indistinguishable from a validation rule: the same red box, the same message. To Data Loader too: the record shows up in the error.csv with your text and the others are saved. The difference is inside: your code can query other records and see the whole batch before deciding.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "throw o addError: qué pasa con el lote", en: "throw or addError: what happens to the batch" },
    },
    {
      type: "p",
      text: {
        es: "Lo que le pase al resto del lote depende de dos cosas: cómo rechaza el trigger y cómo se hizo el guardado. Una excepción sin capturar dentro de un trigger hace fallar el guardado entero, se haya pedido como se haya pedido. addError, en cambio, marca solo ese registro: con un insert normal (todo o nada, Módulo 4) el guardado lanza una DmlException y no se guarda nada; con Database.insert(list, false), fallan solo los marcados y el resto se guarda. Data Loader y la mayoría de integraciones guardan en modo parcial.",
        en: "What happens to the rest of the batch depends on two things: how the trigger rejects and how the save was requested. An uncaught exception inside a trigger fails the entire save, however it was requested. addError, on the other hand, marks only that record: with a plain insert (all or nothing, Module 4) the save throws a DmlException and nothing is saved; with Database.insert(list, false), only the marked ones fail and the rest is saved. Data Loader and most integrations save in partial mode.",
      },
    },
    {
      type: "diagram",
      id: "m08-adderror",
      caption: {
        es: "Elige cómo rechaza el trigger y cómo se guarda el lote, y mira qué registros sobreviven.",
        en: "Choose how the trigger rejects and how the batch is saved, and see which records survive.",
      },
    },
    {
      type: "h",
      text: { es: "Duplicados dentro del mismo lote", en: "Duplicates inside the same batch" },
    },
    {
      type: "p",
      text: {
        es: "La consulta solo ve lo que ya está guardado. Si el ERP manda en el mismo lote dos renovaciones para la misma cuenta, ninguna de las dos está en la base de datos todavía, así que la consulta dice «no hay ninguna abierta» para ambas. El truco: cada vez que aceptas una renovación, añades su cuenta al Set. La siguiente del mismo lote ya la encontrará.",
        en: "The query only sees what is already saved. If the ERP sends two renewals for the same account in the same batch, neither is in the database yet, so the query says «none open» for both. The trick: every time you accept a renewal, add its account to the Set. The next one in the same batch will find it.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow… ni una regla de validación? Porque no ven el lote", en: "Why not a Flow… or a validation rule? Because they cannot see the batch" },
      text: {
        es: "Lo intentamos por las dos vías. Primero, un campo de resumen en la cuenta que contaba las renovaciones abiertas y una regla de validación que miraba ese número. Después, un flow before-save con un Get Records y un elemento Custom Error, que sí existe en los flows desencadenados por registro. Con un usuario guardando a mano, las dos funcionaban. Pero la primera noche el ERP mandó dos renovaciones de Acme en el mismo lote: ni el resumen ni el Get Records ven registros que todavía no se han guardado, cada interview del flow solo conoce su $Record, y las dos pasaron. Probamos a moverlo a un flow after-save, donde ya se ven guardadas… y entonces cada una veía a la otra y se rechazaban las dos. (Simplificación: se puede apañar comparando fechas o Ids, pero ya no es un flow que un Admin mantenga tranquilo.) Con Apex recibes el lote entero en una lista, y el Set decide: la primera se queda, la segunda no.",
        en: "We tried both routes. First, a roll-up summary on the account counting open renewals, plus a validation rule reading that number. Then, a before-save flow with a Get Records and a Custom Error element, which does exist in record-triggered flows. With a user saving by hand, both worked. But the first night the ERP sent two Acme renewals in the same batch: neither the roll-up nor the Get Records can see records that have not been saved yet, each flow interview only knows its own $Record, and both got through. We tried moving it to an after-save flow, where they are already saved… and then each saw the other and both were rejected. (Simplification: it can be patched by comparing dates or Ids, but it is no longer a flow an Admin can maintain calmly.) With Apex you receive the whole batch in one list, and the Set decides: the first one stays, the second does not.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Solo en los registros del trigger", en: "Only on the trigger's records" },
      text: {
        es: "addError solo bloquea el guardado si lo llamas sobre registros de Trigger.new (o de Trigger.old en un delete). Sobre un registro que has consultado tú, no hace nada útil. Y en un trigger before no hace falta ningún DML: rechazar o modificar se hace directamente sobre el registro que llega (Módulo 6).",
        en: "addError only blocks the save if you call it on records from Trigger.new (or Trigger.old in a delete). On a record you queried yourself, it does nothing useful. And in a before trigger no DML is needed: rejecting or changing is done directly on the incoming record (Module 6).",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué diferencia hay entre o.addError('…') y o.Amount.addError('…')? Si el trigger lanza una excepción sin capturar y el ERP guardó con Database.insert(list, false), ¿cuántos registros se guardan? ¿Por qué hace falta añadir la cuenta al Set cuando aceptas una renovación?",
        en: "Without looking: what is the difference between o.addError('…') and o.Amount.addError('…')? If the trigger throws an uncaught exception and the ERP saved with Database.insert(list, false), how many records are saved? Why do you need to add the account to the Set when you accept a renewal?",
      },
    },
  ],

  quiz: [
    {
      id: "m08-l05-q1",
      kind: "single",
      prompt: {
        es: "El ERP guarda 200 renovaciones con Database.insert(list, false). El trigger encuentra una duplicada y hace throw sin capturarla. ¿Cuántas se guardan?",
        en: "The ERP saves 200 renewals with Database.insert(list, false). The trigger finds a duplicate and throws without catching it. How many are saved?",
      },
      options: [
        { es: "Ninguna: la excepción hace fallar el guardado entero", en: "None: the exception fails the entire save" },
        { es: "199", en: "199" },
        { es: "200", en: "200" },
        { es: "Las que iban antes de la duplicada", en: "The ones before the duplicate" },
      ],
      answer: 0,
      explain: {
        es: "Una excepción sin capturar en un trigger no distingue registros: falla todo. El modo parcial solo ayuda si el trigger rechaza con addError.",
        en: "An uncaught exception in a trigger does not tell records apart: everything fails. Partial mode only helps if the trigger rejects with addError.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m08-l05-q2",
      kind: "single",
      prompt: {
        es: "Mismo lote de 200, pero ahora el trigger usa addError en la duplicada y el guardado es un insert normal. ¿Qué pasa?",
        en: "Same batch of 200, but now the trigger uses addError on the duplicate and the save is a plain insert. What happens?",
      },
      options: [
        { es: "El insert lanza una DmlException y no se guarda ninguna", en: "The insert throws a DmlException and none are saved" },
        { es: "Se guardan 199", en: "199 are saved" },
        { es: "Se guardan las 200 y la duplicada lleva un aviso", en: "All 200 are saved and the duplicate carries a warning" },
        { es: "El trigger se para en la duplicada", en: "The trigger stops at the duplicate" },
      ],
      answer: 0,
      explain: {
        es: "insert es todo o nada: basta un registro marcado para que falle el lote entero. Con Database.insert(list, false) se habrían guardado 199.",
        en: "insert is all or nothing: a single marked record fails the whole batch. With Database.insert(list, false), 199 would have been saved.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m08-l05-q3",
      kind: "single",
      prompt: {
        es: "¿Por qué el guardián añade la cuenta a accountsWithRenewal cuando acepta una renovación?",
        en: "Why does the guard add the account to accountsWithRenewal when it accepts a renewal?",
      },
      options: [
        {
          es: "Para que una segunda renovación de la misma cuenta en el mismo lote se rechace: la consulta no la ve porque aún no está guardada",
          en: "So that a second renewal for the same account in the same batch is rejected: the query cannot see it because it is not saved yet",
        },
        { es: "Para ahorrar una consulta", en: "To save a query" },
        { es: "Porque addError lo exige", en: "Because addError requires it" },
        { es: "No hace falta: la consulta ya lo cubre", en: "It is not needed: the query already covers it" },
      ],
      answer: 0,
      explain: {
        es: "La consulta solo ve lo guardado. El Set es la memoria del lote: justo lo que ni un flow ni una regla de validación tienen.",
        en: "The query only sees what is saved. The Set is the batch's memory: exactly what neither a flow nor a validation rule has.",
      },
    },
    {
      id: "m08-l05-q4",
      kind: "multi",
      prompt: {
        es: "¿Qué es cierto sobre addError?",
        en: "What is true about addError?",
      },
      options: [
        { es: "No interrumpe el código: el bucle sigue", en: "It does not interrupt the code: the loop carries on" },
        { es: "o.Amount.addError('…') muestra el mensaje junto al campo Amount", en: "o.Amount.addError('…') shows the message next to the Amount field" },
        { es: "Sirve igual sobre un registro que has consultado tú", en: "It works the same on a record you queried yourself" },
        { es: "Lanza una excepción que tienes que capturar", en: "It throws an exception you have to catch" },
      ],
      answers: [0, 1],
      explain: {
        es: "addError marca y sigue; a nivel de campo, el mensaje sale junto al campo. Solo bloquea el guardado en registros del trigger, y no lanza nada dentro de tu código.",
        en: "addError marks and carries on; at field level, the message appears next to the field. It only blocks the save on the trigger's records, and throws nothing inside your code.",
      },
    },
    {
      id: "m08-l05-q5",
      kind: "text",
      prompt: {
        es: "Escribe la línea que rechaza la oportunidad o con el mensaje 'Importe obligatorio' junto al campo Amount.",
        en: "Write the line that rejects opportunity o with the message 'Amount required' next to the Amount field.",
      },
      accept: [
        "o\\.amount\\.adderror\\s*\\(\\s*'importe obligatorio'\\s*\\)\\s*;?",
        "o\\.amount\\.adderror\\s*\\(\\s*'amount required'\\s*\\)\\s*;?",
      ],
      placeholder: { es: "o.…", en: "o.…" },
      explain: {
        es: "o.Amount.addError('Importe obligatorio'); — el campo antes del addError decide dónde aparece el mensaje.",
        en: "o.Amount.addError('Amount required'); — the field before addError decides where the message appears.",
      },
      tags: ["recall"],
    },
    {
      id: "m08-l05-q6",
      kind: "single",
      prompt: {
        es: "Repaso: en un trigger before insert, ¿cómo cambias el StageName del registro que se está guardando?",
        en: "Review: in a before insert trigger, how do you change the StageName of the record being saved?",
      },
      options: [
        { es: "Asignándolo directamente en el registro de Trigger.new, sin DML", en: "Assigning it directly on the Trigger.new record, with no DML" },
        { es: "Con un update después de asignarlo", en: "With an update after assigning it" },
        { es: "Consultando el registro y haciendo insert", en: "Querying the record and doing an insert" },
        { es: "No se puede en before", en: "It cannot be done in before" },
      ],
      answer: 0,
      explain: {
        es: "En before, el registro aún no está guardado: lo que cambies se guarda con él. Igual que addError, que actúa sobre ese mismo registro.",
        en: "In before, the record is not saved yet: whatever you change is saved with it. Just like addError, which acts on that same record.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M6 L3", en: "Review · M6 L3" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 5 DE 6 · El guardián de renovaciones que escribió el equipo tiene dos problemas: una consulta por cada oportunidad (con 200 filas del ERP revienta el límite de 100) y un throw que, con un solo duplicado, tumba el lote entero. Reescríbelo para que rechace solo las filas malas, con addError, y que también pille los duplicados dentro del mismo lote.",
      en: "TASK 5 OF 6 · The renewal guard the team wrote has two problems: one query per opportunity (with 200 ERP rows it blows the 100 limit) and a throw that, with a single duplicate, brings down the whole batch. Rewrite it so it rejects only the bad rows, with addError, and also catches duplicates inside the same batch.",
    },
    brief: [
      {
        es: "Primero reúne en un Set<Id> las AccountId de las oportunidades con Type 'Renewal'.",
        en: "First gather into a Set<Id> the AccountId of the opportunities with Type 'Renewal'.",
      },
      {
        es: "Una sola consulta, fuera de cualquier bucle: las Opportunity con AccountId IN :accountIds, Type 'Renewal' e IsClosed = false. Guarda sus cuentas en Set<Id> accountsWithRenewal.",
        en: "A single query, outside any loop: the Opportunity records with AccountId IN :accountIds, Type 'Renewal' and IsClosed = false. Store their accounts in Set<Id> accountsWithRenewal.",
      },
      {
        es: "Recorre las renovaciones: si Amount es null o no positivo, o.Amount.addError('…'); si la cuenta ya está en accountsWithRenewal, o.addError('…'); si no, añade la cuenta al Set.",
        en: "Loop over the renewals: if Amount is null or not positive, o.Amount.addError('…'); if the account is already in accountsWithRenewal, o.addError('…'); otherwise, add the account to the Set.",
      },
      {
        es: "Ningún throw: el guardián rechaza registros, no la transacción.",
        en: "No throw: the guard rejects records, not the transaction.",
      },
    ],
    starter: { es: STARTER_ES, en: STARTER_EN },
    hints: [
      {
        es: "Yo lo pensaría como la receta del Módulo 4 más una regla de validación: reunir cuentas, una consulta, decidir fila a fila. Y en vez de «parar el guardado de todos», marcar solo la fila mala.",
        en: "I would think of it as Module 4's recipe plus a validation rule: gather accounts, one query, decide row by row. And instead of «stopping everyone's save», mark only the bad row.",
      },
      {
        es: "Lo que me ayudó: addError no lanza nada, así que el bucle sigue. o.Amount.addError('…') pone el mensaje junto al campo; o.addError('…'), arriba del registro. Y para los duplicados del mismo lote, accountsWithRenewal.add(o.AccountId) cuando aceptas una.",
        en: "What helped me: addError throws nothing, so the loop carries on. o.Amount.addError('…') puts the message next to the field; o.addError('…'), at the top of the record. And for same-batch duplicates, accountsWithRenewal.add(o.AccountId) when you accept one.",
      },
      {
        es: "Te dejo el esquema: for (o) { if Renewal → accountIds.add(o.AccountId); } · List<Opportunity> openRenewals = [SELECT AccountId FROM Opportunity WHERE AccountId IN :accountIds AND Type = 'Renewal' AND IsClosed = false]; · for (existing) accountsWithRenewal.add(existing.AccountId); · for (o) { if (o.Amount == null || o.Amount <= 0) o.Amount.addError(…); else if (accountsWithRenewal.contains(o.AccountId)) o.addError(…); else accountsWithRenewal.add(o.AccountId); }",
        en: "Here is the outline: for (o) { if Renewal → accountIds.add(o.AccountId); } · List<Opportunity> openRenewals = [SELECT AccountId FROM Opportunity WHERE AccountId IN :accountIds AND Type = 'Renewal' AND IsClosed = false]; · for (existing) accountsWithRenewal.add(existing.AccountId); · for (o) { if (o.Amount == null || o.Amount <= 0) o.Amount.addError(…); else if (accountsWithRenewal.contains(o.AccountId)) o.addError(…); else accountsWithRenewal.add(o.AccountId); }",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m08-l05-c1",
        label: { es: "Rechaza con addError, sin throw", en: "Rejects with addError, no throw" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "\\.addError\\s*\\(" },
            { op: "absent", pattern: "\\bthrow\\b" },
          ],
        },
        onFail: {
          es: "Cambia el throw por addError sobre la oportunidad: o.addError('…'). El throw tumba el lote entero.",
          en: "Replace the throw with addError on the opportunity: o.addError('…'). The throw brings down the whole batch.",
        },
        otter: {
          es: "El throw es un «no» para las 200 filas. Lo que quieres es la regla de validación de siempre: marcar solo la mala con o.addError('…') y dejar pasar el resto.",
          en: "The throw is a «no» to all 200 rows. What you want is your usual validation rule: mark only the bad one with o.addError('…') and let the rest through.",
        },
      },
      {
        id: "m08-l05-c2",
        label: { es: "Una sola consulta, fuera de los bucles", en: "A single query, outside the loops" },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "\\[\\s*SELECT\\b", min: 1, max: 1 },
            { op: "absent", pattern: "(for|while)\\s*\\([^)]*\\)\\s*\\{[^{}]*\\[\\s*SELECT\\b" },
          ],
        },
        onFail: {
          es: "Saca la consulta del bucle: primero reúne las cuentas en un Set y después haz una sola consulta con AccountId IN :accountIds.",
          en: "Move the query out of the loop: first gather the accounts in a Set and then run a single query with AccountId IN :accountIds.",
        },
        otter: {
          es: "Una consulta por oportunidad es el Get Records dentro del Loop que ya conoces: con 200 filas, adiós al límite de 100. Reúne las cuentas en un Set y consulta una sola vez, fuera del bucle.",
          en: "One query per opportunity is the Get Records inside a Loop you already know: with 200 rows, goodbye to the 100 limit. Gather the accounts in a Set and query once, outside the loop.",
        },
      },
      {
        id: "m08-l05-c3",
        label: { es: "La consulta busca renovaciones abiertas de esas cuentas", en: "The query looks for open renewals of those accounts" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "FROM\\s+Opportunity\\b[^\\]]*AccountId\\s+IN\\s*:\\s*\\w+" },
            { op: "match", pattern: "FROM\\s+Opportunity\\b[^\\]]*IsClosed\\s*=\\s*false" },
            { op: "match", pattern: "Set\\s*<\\s*Id\\s*>\\s+accountsWithRenewal\\b" },
          ],
        },
        onFail: {
          es: "La consulta: FROM Opportunity WHERE AccountId IN :accountIds AND Type = 'Renewal' AND IsClosed = false. Y sus cuentas, en Set<Id> accountsWithRenewal.",
          en: "The query: FROM Opportunity WHERE AccountId IN :accountIds AND Type = 'Renewal' AND IsClosed = false. And their accounts, in Set<Id> accountsWithRenewal.",
        },
        otter: {
          es: "Pregúntale a la base de datos de una vez: renovaciones con AccountId IN :accountIds e IsClosed = false. Sus cuentas van a un Set<Id> accountsWithRenewal: tu lista de «ya tienen una».",
          en: "Ask the database once: renewals with AccountId IN :accountIds and IsClosed = false. Their accounts go into a Set<Id> accountsWithRenewal: your «already have one» list.",
        },
      },
      {
        id: "m08-l05-c4",
        label: { es: "Pilla los duplicados del mismo lote", en: "Catches duplicates inside the same batch" },
        rule: { op: "count", pattern: "accountsWithRenewal\\s*\\.\\s*add\\s*\\(", min: 2 },
        onFail: {
          es: "Además de llenar el Set con lo consultado, añade la cuenta cada vez que aceptas una renovación: accountsWithRenewal.add(o.AccountId).",
          en: "Besides filling the Set with the query results, add the account every time you accept a renewal: accountsWithRenewal.add(o.AccountId).",
        },
        otter: {
          es: "Esto es lo que ni mi regla de validación ni mi flow podían hacer: cuando aceptas una renovación, accountsWithRenewal.add(o.AccountId). Así la segunda de Acme en el mismo lote ya la encuentra.",
          en: "This is what neither my validation rule nor my flow could do: when you accept a renewal, accountsWithRenewal.add(o.AccountId). That way Acme's second one in the same batch finds it.",
        },
      },
      {
        id: "m08-l05-c5",
        label: { es: "El importe malo se marca en el campo Amount", en: "The bad amount is flagged on the Amount field" },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "\\.Amount\\s*\\.\\s*addError\\s*\\(" },
            { op: "match", pattern: "\\.addError\\s*\\(\\s*'Amount'\\s*," },
          ],
        },
        onFail: {
          es: "Si Amount es null o no positivo, rechaza a nivel de campo: o.Amount.addError('…').",
          en: "If Amount is null or not positive, reject at field level: o.Amount.addError('…').",
        },
        otter: {
          es: "Como una regla de validación con «Error Location: Field»: o.Amount.addError('…') pone el mensaje justo debajo del importe, donde el usuario lo tiene que corregir.",
          en: "Like a validation rule with «Error Location: Field»: o.Amount.addError('…') puts the message right under the amount, where the user has to fix it.",
        },
      },
    ],
    rubric: [
      {
        es: "Si la norma cambiara a «como mucho dos renovaciones abiertas por cuenta», ¿qué cambiarías: el Set por un Map<Id, Integer>?",
        en: "If the rule changed to «at most two open renewals per account», what would you change: the Set for a Map<Id, Integer>?",
      },
      {
        es: "¿Qué pasa si una renovación llega con AccountId null? ¿Debería el guardián rechazarla también?",
        en: "What happens if a renewal arrives with a null AccountId? Should the guard reject it too?",
      },
    ],
    voice: "otter",
    outro: {
      es: "Tu guardián ya dice «no» fila a fila, sin tumbar el lote y pillando los duplicados que el flow dejaba pasar. En la tarea 6 lo juntas todo: el importador completo, con guardado parcial y un informe de errores que el ERP pueda leer.",
      en: "Your guard now says «no» row by row, without bringing down the batch and catching the duplicates the flow let through. In task 6 you put it all together: the full importer, with a partial save and an error report the ERP can read.",
    },
  },
};
