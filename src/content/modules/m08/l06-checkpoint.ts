import type { Lesson } from "@/lib/types";

/** parseAmount as tasks 3-4 left it: given, so the delivery is about the importer. */
const PARSE_ES = `    // Ya resuelto en las tareas 3 y 4
    private static Decimal parseAmount(String raw) {
        if (String.isBlank(raw)) {
            throw new RenewalImportException('Importe vacío');
        }
        Decimal amount;
        try {
            amount = Decimal.valueOf(raw);
        } catch (TypeException e) {
            throw new RenewalImportException('Importe no numérico: ' + raw, e);
        }
        if (amount <= 0) {
            throw new RenewalImportException('Importe no positivo: ' + raw);
        }
        return amount;
    }`;

const PARSE_EN = `    // Already solved in tasks 3 and 4
    private static Decimal parseAmount(String raw) {
        if (String.isBlank(raw)) {
            throw new RenewalImportException('Empty amount');
        }
        Decimal amount;
        try {
            amount = Decimal.valueOf(raw);
        } catch (TypeException e) {
            throw new RenewalImportException('Non-numeric amount: ' + raw, e);
        }
        if (amount <= 0) {
            throw new RenewalImportException('Non-positive amount: ' + raw);
        }
        return amount;
    }`;

const SOLUTION_ES = `// CASO: el puente nocturno con el ERP de Northwind
// Tarea 6 de 6 · La entrega: el importador completo.

// 1. La excepción (tarea 4), en su propio archivo
public class RenewalImportException extends Exception {}

// 2. El importador que llama el proceso nocturno
public class RenewalImporter {
    public static void run(Map<String, String> amountsByErp) {
        List<String> report = new List<String>();
        try {
            // Una sola consulta para todas las filas
            List<Account> accounts = [
                SELECT Id, Name, OwnerId, ERP_Code__c FROM Account
                WHERE ERP_Code__c IN :amountsByErp.keySet()
            ];
            Map<String, Account> accountsByErp = new Map<String, Account>();
            for (Account a : accounts) {
                accountsByErp.put(a.ERP_Code__c, a);
            }

            // Cada fila con su propio try: una mala no para a las demás
            List<Opportunity> toInsert = new List<Opportunity>();
            for (String erpCode : amountsByErp.keySet()) {
                try {
                    if (!accountsByErp.containsKey(erpCode)) {
                        throw new RenewalImportException('Cuenta desconocida: ' + erpCode);
                    }
                    Account acc = accountsByErp.get(erpCode);
                    toInsert.add(new Opportunity(
                        Name = acc.Name + ' · Renovación',
                        AccountId = acc.Id,
                        OwnerId = acc.OwnerId,
                        Type = 'Renewal',
                        StageName = 'Prospecting',
                        CloseDate = Date.today().addDays(30),
                        Amount = parseAmount(amountsByErp.get(erpCode))
                    ));
                } catch (RenewalImportException e) {
                    report.add(erpCode + ' · ' + e.getMessage());
                }
            }

            // Guardado parcial: el guardián (tarea 5) o un propietario inactivo rechazan solo su fila
            List<Database.SaveResult> results = Database.insert(toInsert, false);
            for (Integer i = 0; i < results.size(); i++) {
                if (!results[i].isSuccess()) {
                    report.add(toInsert[i].Name + ' · ' + results[i].getErrors()[0].getMessage());
                }
            }
        } finally {
            // Pase lo que pase, el ERP recibe su informe
            System.debug('Informe para el ERP (' + report.size() + ' rechazos): ' + report);
        }
    }

${PARSE_ES}
}`;

const SOLUTION_EN = `// CASE: Northwind's nightly bridge with the ERP
// Task 6 of 6 · The delivery: the full importer.

// 1. The exception (task 4), in its own file
public class RenewalImportException extends Exception {}

// 2. The importer the nightly job calls
public class RenewalImporter {
    public static void run(Map<String, String> amountsByErp) {
        List<String> report = new List<String>();
        try {
            // A single query for every row
            List<Account> accounts = [
                SELECT Id, Name, OwnerId, ERP_Code__c FROM Account
                WHERE ERP_Code__c IN :amountsByErp.keySet()
            ];
            Map<String, Account> accountsByErp = new Map<String, Account>();
            for (Account a : accounts) {
                accountsByErp.put(a.ERP_Code__c, a);
            }

            // Each row with its own try: a bad one does not stop the others
            List<Opportunity> toInsert = new List<Opportunity>();
            for (String erpCode : amountsByErp.keySet()) {
                try {
                    if (!accountsByErp.containsKey(erpCode)) {
                        throw new RenewalImportException('Unknown account: ' + erpCode);
                    }
                    Account acc = accountsByErp.get(erpCode);
                    toInsert.add(new Opportunity(
                        Name = acc.Name + ' · Renewal',
                        AccountId = acc.Id,
                        OwnerId = acc.OwnerId,
                        Type = 'Renewal',
                        StageName = 'Prospecting',
                        CloseDate = Date.today().addDays(30),
                        Amount = parseAmount(amountsByErp.get(erpCode))
                    ));
                } catch (RenewalImportException e) {
                    report.add(erpCode + ' · ' + e.getMessage());
                }
            }

            // Partial save: the guard (task 5) or an inactive owner rejects only its own row
            List<Database.SaveResult> results = Database.insert(toInsert, false);
            for (Integer i = 0; i < results.size(); i++) {
                if (!results[i].isSuccess()) {
                    report.add(toInsert[i].Name + ' · ' + results[i].getErrors()[0].getMessage());
                }
            }
        } finally {
            // Whatever happens, the ERP gets its report
            System.debug('Report for the ERP (' + report.size() + ' rejections): ' + report);
        }
    }

${PARSE_EN}
}`;

const STARTER_ES = `// CASO: el puente nocturno con el ERP de Northwind
// Ya resuelto (tareas 1-5): try por fila, tipos, throw, RenewalImportException y el guardián con addError.
// Tarea 6 de 6 · La entrega: el importador completo.

// 1. La excepción (tarea 4), en su propio archivo
public class RenewalImportException extends Exception {}

// 2. El importador que llama el proceso nocturno (la primera versión del equipo)
public class RenewalImporter {
    public static void run(Map<String, String> amountsByErp) {
        for (String erpCode : amountsByErp.keySet()) {
            Account acc = [SELECT Id, Name, OwnerId FROM Account WHERE ERP_Code__c = :erpCode LIMIT 1];
            Opportunity renewal = new Opportunity(
                Name = acc.Name + ' · Renovación',
                AccountId = acc.Id,
                OwnerId = acc.OwnerId,
                Type = 'Renewal',
                StageName = 'Prospecting',
                CloseDate = Date.today().addDays(30),
                Amount = parseAmount(amountsByErp.get(erpCode))
            );
            insert renewal;
        }
    }

${PARSE_ES}
}
`;

const STARTER_EN = `// CASE: Northwind's nightly bridge with the ERP
// Already solved (tasks 1-5): a try per row, types, throw, RenewalImportException and the guard with addError.
// Task 6 of 6 · The delivery: the full importer.

// 1. The exception (task 4), in its own file
public class RenewalImportException extends Exception {}

// 2. The importer the nightly job calls (the team's first version)
public class RenewalImporter {
    public static void run(Map<String, String> amountsByErp) {
        for (String erpCode : amountsByErp.keySet()) {
            Account acc = [SELECT Id, Name, OwnerId FROM Account WHERE ERP_Code__c = :erpCode LIMIT 1];
            Opportunity renewal = new Opportunity(
                Name = acc.Name + ' · Renewal',
                AccountId = acc.Id,
                OwnerId = acc.OwnerId,
                Type = 'Renewal',
                StageName = 'Prospecting',
                CloseDate = Date.today().addDays(30),
                Amount = parseAmount(amountsByErp.get(erpCode))
            );
            insert renewal;
        }
    }

${PARSE_EN}
}
`;

export const l06Checkpoint: Lesson = {
  id: "m08-l06",
  slug: "checkpoint",
  n: 6,
  kind: "checkpoint",
  minutes: 50,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 5", en: "Remember? · Review of lesson 5" },
    prompt: {
      es: "El guardián marca una renovación duplicada con addError y el ERP guardó con Database.insert(list, false). ¿Qué pasa?",
      en: "The guard marks a duplicate renewal with addError and the ERP saved with Database.insert(list, false). What happens?",
    },
    options: [
      { es: "Solo falla la duplicada; el resto se guarda", en: "Only the duplicate fails; the rest is saved" },
      { es: "Falla el lote entero", en: "The whole batch fails" },
      { es: "Se guardan todas, con un aviso", en: "All are saved, with a warning" },
    ],
    answer: 0,
    explain: {
      es: "addError + guardado parcial: falla solo la marcada. Hoy leerás ese fallo desde el importador, en su SaveResult.",
      en: "addError + partial save: only the marked one fails. Today you will read that failure from the importer, in its SaveResult.",
    },
  },
  title: { es: "Checkpoint del Módulo 8", en: "Module 8 checkpoint" },
  summary: {
    es: "La entrega: el importador nocturno completo. Una consulta para todas las filas, un try por fila, guardado parcial y un informe para el ERP que sale pase lo que pase.",
    en: "The delivery: the full nightly importer. One query for every row, a try per row, a partial save and a report for the ERP that goes out whatever happens.",
  },
  analogy: {
    es: "Un Data Loader con su error.csv, escrito por ti",
    en: "A Data Loader with its error.csv, written by you",
  },
  objectives: [
    {
      es: "Combinar try por fila, excepción propia y guardado parcial en un mismo proceso.",
      en: "Combine a try per row, your own exception and a partial save in a single process.",
    },
    {
      es: "Leer los fallos de cada registro con SaveResult: isSuccess() y getErrors().",
      en: "Read each record's failures with SaveResult: isSuccess() and getErrors().",
    },
    {
      es: "Traducir cada herramienta de errores de Flow a su equivalente en Apex.",
      en: "Translate each Flow error tool into its Apex equivalent.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Cinco tareas preparando piezas: un try que no deja caer la importación, los tipos, throw, tu excepción y el guardián con addError. Esta es la tarea en la que se montan. El proceso nocturno llama a RenewalImporter.run con las filas del ERP, y por la mañana el ERP espera dos cosas: las renovaciones buenas creadas y una lista de las malas con su motivo.",
        en: "Five tasks preparing parts: a try that does not let the import fall, the types, throw, your exception and the guard with addError. This is the task where they are assembled. The nightly job calls RenewalImporter.run with the ERP's rows, and in the morning the ERP expects two things: the good renewals created and a list of the bad ones with their reason.",
      },
    },
    {
      type: "h",
      text: { es: "Lo que has construido, pieza por pieza", en: "What you built, piece by piece" },
    },
    {
      type: "table",
      head: [
        { es: "Pieza", en: "Piece" },
        { es: "Qué resuelve", en: "What it solves" },
        { es: "Tarea", en: "Task" },
      ],
      rows: [
        [
          { es: "try / catch / finally", en: "try / catch / finally" },
          { es: "Una fila mala no tumba las demás, y lo del finally se ejecuta siempre.", en: "A bad row does not bring down the others, and whatever is in finally always runs." },
          { es: "1", en: "1" },
        ],
        [
          { es: "Varios catch por tipo", en: "Several catch blocks by type" },
          { es: "Cada fallo tratado según lo que es, del más concreto al más general.", en: "Each failure handled for what it is, from the most specific to the most general." },
          { es: "2", en: "2" },
        ],
        [
          { es: "throw y propagación", en: "throw and propagation" },
          { es: "El método valida y avisa; decide quien lo llama.", en: "The method validates and warns; its caller decides." },
          { es: "3", en: "3" },
        ],
        [
          { es: "RenewalImportException", en: "RenewalImportException" },
          { es: "Los errores del negocio con nombre propio; los bugs no se esconden.", en: "Business errors with their own name; bugs do not hide." },
          { es: "4", en: "4" },
        ],
        [
          { es: "addError", en: "addError" },
          { es: "El trigger rechaza una fila sin tumbar el lote.", en: "The trigger rejects one row without bringing down the batch." },
          { es: "5", en: "5" },
        ],
        [
          { es: "Database.insert(list, false) + SaveResult", en: "Database.insert(list, false) + SaveResult" },
          { es: "Guardar lo que se pueda y saber qué falló y por qué, registro a registro.", en: "Save what can be saved and know what failed and why, record by record." },
          { es: "6", en: "6" },
        ],
      ],
    },
    {
      type: "diagram",
      id: "m08-cp-map",
      caption: {
        es: "Tu diccionario de errores: para cada herramienta de Flow, ¿cuál es su pieza en Apex?",
        en: "Your error dictionary: for each Flow tool, which is its Apex piece?",
      },
    },
    {
      type: "h",
      text: { es: "La entrega: el importador completo", en: "The delivery: the full importer" },
    },
    {
      type: "p",
      text: {
        es: "run recibe un Map de código ERP → importe en texto. Primero, una sola consulta trae todas las cuentas cuyo ERP_Code__c está entre las claves, y un Map<String, Account> las deja a mano (Módulo 4). Después, cada fila en su propio try: si el código no está en el mapa o el importe no sirve, salta una RenewalImportException, se apunta en el informe y el bucle sigue. Las filas que pasan van a una lista que se guarda de una vez con Database.insert(toInsert, false).",
        en: "run receives a Map of ERP code → amount as text. First, a single query brings every account whose ERP_Code__c is among the keys, and a Map<String, Account> keeps them at hand (Module 4). Then, each row in its own try: if the code is not in the map or the amount is no good, a RenewalImportException is thrown, noted in the report and the loop carries on. The rows that pass go into a list saved in one go with Database.insert(toInsert, false).",
      },
    },
    {
      type: "p",
      text: {
        es: "Ese guardado todavía puede rechazar filas que el bucle no podía prever: el guardián de la tarea 5 con su addError, o una cuenta cuyo propietario es un usuario inactivo (INACTIVE_OWNER_OR_USER). Database.insert devuelve una lista de SaveResult en el mismo orden que toInsert: results[i] habla de toInsert[i]. isSuccess() dice si se guardó y getErrors() trae el motivo.",
        en: "That save can still reject rows the loop could not foresee: task 5's guard with its addError, or an account whose owner is an inactive user (INACTIVE_OWNER_OR_USER). Database.insert returns a list of SaveResult in the same order as toInsert: results[i] is about toInsert[i]. isSuccess() says whether it was saved and getErrors() brings the reason.",
      },
    },
    {
      type: "code",
      code: {
        es: `List<Database.SaveResult> results = Database.insert(toInsert, false);
for (Integer i = 0; i < results.size(); i++) {
    if (!results[i].isSuccess()) {
        Database.Error err = results[i].getErrors()[0];
        report.add(toInsert[i].Name + ' · ' + err.getStatusCode() + ' · ' + err.getMessage());
    }
}`,
        en: `List<Database.SaveResult> results = Database.insert(toInsert, false);
for (Integer i = 0; i < results.size(); i++) {
    if (!results[i].isSuccess()) {
        Database.Error err = results[i].getErrors()[0];
        report.add(toInsert[i].Name + ' · ' + err.getStatusCode() + ' · ' + err.getMessage());
    }
}`,
      },
      caption: {
        es: "Tu error.csv, fila a fila: el registro, el código de estado y el mensaje, como los que ves en Data Loader.",
        en: "Your error.csv, row by row: the record, the status code and the message, like the ones you see in Data Loader.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque el ERP necesita la lista", en: "Why not a Flow? Because the ERP needs the list" },
      text: {
        es: "Recapitulo lo que nos pasó con el flow programado. Con un Create Records dentro del Loop, la noche de 300 filas reventó en «Too many DML statements: 151», y eso no lo captura ningún fault path. Lo pasamos a un Create Records de colección fuera del Loop: todo o nada, una fila mala y no se creaba ninguna. Desde Winter '25 Create Records tiene una opción para guardar parcialmente, y la probamos: se guardaban las buenas… pero el flow no recibe qué registros fallaron ni por qué, y eso era justo lo que el ERP pedía cada mañana. Con Database.insert(list, false), cada SaveResult te dice cuál y por qué.",
        en: "Let me recap what happened with the scheduled flow. With a Create Records inside the Loop, the 300-row night blew up with «Too many DML statements: 151», and no fault path catches that. We moved to a collection Create Records outside the Loop: all or nothing, one bad row and none were created. Since Winter '25 Create Records has an option to save partially, and we tried it: the good ones were saved… but the flow does not get which records failed or why, and that was exactly what the ERP asked for every morning. With Database.insert(list, false), each SaveResult tells you which and why.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "El finally es la promesa al ERP", en: "The finally is the promise to the ERP" },
      text: {
        es: "Todo run va dentro de un try con finally, y el informe se envía en el finally. Si mañana alguien mete un bug que lanza una NullPointerException, la importación se parará —y está bien que se pare—, pero el ERP recibirá igualmente la lista de lo que se rechazó hasta ese momento. Ojo: si lo que salta es una LimitException, ni el finally llega a ejecutarse; por eso la consulta y el guardado van fuera de los bucles.",
        en: "All of run sits inside a try with finally, and the report goes out in the finally. If tomorrow someone introduces a bug that throws a NullPointerException, the import will stop — and it is right that it stops — but the ERP will still get the list of what was rejected up to that point. Careful: if what is thrown is a LimitException, not even the finally runs; that is why the query and the save sit outside the loops.",
      },
    },
    {
      type: "h",
      text: { es: "Lo que viene: el Módulo 9", en: "What comes next: Module 9" },
    },
    {
      type: "p",
      text: {
        es: "El importador ya aguanta 300 filas. ¿Y 300.000? No caben en una transacción, por mucho que bulkifiques. Para eso Apex tiene trabajo asíncrono: procesos que se trocean y se ejecutan en segundo plano. Es el Módulo 9.",
        en: "The importer now copes with 300 rows. What about 300,000? They do not fit in one transaction, however much you bulkify. For that Apex has asynchronous work: jobs that split up and run in the background. That is Module 9.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes del quiz", en: "Before the quiz" },
      text: {
        es: "Sin mirar: ¿por qué el try va dentro del bucle y el finally fuera? ¿Qué rechazos llegan al catch del bucle y cuáles al SaveResult? ¿Por qué results[i] corresponde a toInsert[i]?",
        en: "Without looking: why does the try go inside the loop and the finally outside? Which rejections reach the loop's catch and which reach the SaveResult? Why does results[i] match toInsert[i]?",
      },
    },
  ],

  quiz: [
    {
      id: "m08-cp-q1",
      kind: "single",
      prompt: {
        es: "En el importador, ¿por qué la consulta de cuentas va antes del bucle y el try, dentro?",
        en: "In the importer, why does the account query go before the loop and the try inside it?",
      },
      options: [
        {
          es: "Una consulta para todas las filas no gasta el límite; y el try por fila deja que una mala no pare a las demás",
          en: "One query for all rows does not burn the limit; and a try per row keeps a bad one from stopping the rest",
        },
        { es: "Porque Apex no permite consultas dentro de un try", en: "Because Apex does not allow queries inside a try" },
        { es: "Es solo estilo: funcionaría igual al revés", en: "It is just style: it would work the same the other way round" },
        { es: "Para que el finally se ejecute dos veces", en: "So that the finally runs twice" },
      ],
      answer: 0,
      explain: {
        es: "Fuera del bucle, lo que cuenta límites (Módulo 4). Dentro, lo que se decide fila a fila (tarea 1).",
        en: "Outside the loop, whatever counts against limits (Module 4). Inside, whatever is decided row by row (task 1).",
      },
    },
    {
      id: "m08-cp-q2",
      kind: "single",
      prompt: {
        es: "A mitad del bucle, un bug lanza una NullPointerException que ningún catch captura. ¿Qué pasa?",
        en: "Halfway through the loop, a bug throws a NullPointerException that no catch traps. What happens?",
      },
      options: [
        {
          es: "El finally imprime el informe y después la excepción sigue subiendo: la importación se para",
          en: "The finally prints the report and then the exception keeps climbing: the import stops",
        },
        { es: "El catch de RenewalImportException la trata como fila rechazada", en: "The RenewalImportException catch treats it as a rejected row" },
        { es: "El finally no se ejecuta", en: "The finally does not run" },
        { es: "El bucle sigue con la siguiente fila", en: "The loop moves on to the next row" },
      ],
      answer: 0,
      explain: {
        es: "finally se ejecuta aunque nadie capture la excepción; después, la excepción sigue su camino. El ERP recibe el informe y el bug no queda escondido.",
        en: "finally runs even if nobody catches the exception; afterwards, the exception goes on its way. The ERP gets the report and the bug does not stay hidden.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m08-cp-q3",
      kind: "multi",
      prompt: {
        es: "¿Qué rechazos acaban en el informe del ERP?",
        en: "Which rejections end up in the ERP's report?",
      },
      options: [
        { es: "Un código ERP que no existe (catch del bucle)", en: "An ERP code that does not exist (the loop's catch)" },
        { es: "Un importe 'doce mil' (envuelto en RenewalImportException)", en: "An amount 'twelve thousand' (wrapped in RenewalImportException)" },
        { es: "Una renovación duplicada que el guardián marca con addError (SaveResult)", en: "A duplicate renewal the guard marks with addError (SaveResult)" },
        { es: "Superar el límite de 150 DML (LimitException)", en: "Exceeding the 150 DML limit (LimitException)" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Los tres primeros tienen su camino: catch o SaveResult. LimitException no se captura y mata la transacción, sin finally: se previene, no se informa.",
        en: "The first three have their route: catch or SaveResult. LimitException cannot be caught and kills the transaction, with no finally: it is prevented, not reported.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m08-cp-q4",
      kind: "single",
      prompt: {
        es: "Desde Winter '25, Create Records en Flow puede guardar parcialmente. ¿Qué te da SaveResult que ese flow no?",
        en: "Since Winter '25, Flow's Create Records can save partially. What does SaveResult give you that the flow does not?",
      },
      options: [
        { es: "Qué registro concreto falló y por qué", en: "Which specific record failed and why" },
        { es: "La posibilidad de guardar parcialmente", en: "The ability to save partially" },
        { es: "Saltarse las reglas de validación", en: "Skipping validation rules" },
        { es: "Más límite de DML", en: "A higher DML limit" },
      ],
      answer: 0,
      explain: {
        es: "Guardar parcialmente ya lo hacen los dos. La diferencia es el detalle: results[i] te dice si toInsert[i] se guardó y, si no, su código y su mensaje.",
        en: "Both can save partially now. The difference is the detail: results[i] tells you whether toInsert[i] was saved and, if not, its code and message.",
      },
    },
    {
      id: "m08-cp-q5",
      kind: "single",
      prompt: {
        es: "Diccionario Flow → Apex: ¿qué equivale al elemento Roll Back Records?",
        en: "Flow → Apex dictionary: what matches the Roll Back Records element?",
      },
      options: [
        { es: "Database.rollback(sp), con un Savepoint creado antes", en: "Database.rollback(sp), with a Savepoint created earlier" },
        { es: "addError", en: "addError" },
        { es: "finally", en: "finally" },
        { es: "throw", en: "throw" },
      ],
      answer: 0,
      explain: {
        es: "Roll Back Records deshace lo hecho en la transacción; en Apex, Database.setSavepoint() marca el punto y Database.rollback(sp) vuelve a él (Módulo 4).",
        en: "Roll Back Records undoes what the transaction did; in Apex, Database.setSavepoint() marks the point and Database.rollback(sp) goes back to it (Module 4).",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M4 L5", en: "Review · M4 L5" },
    },
    {
      id: "m08-cp-q6",
      kind: "text",
      prompt: {
        es: "Escribe la expresión que dice si el registro de la posición i se guardó, sabiendo que los resultados están en results.",
        en: "Write the expression that says whether the record at position i was saved, given the results are in results.",
      },
      accept: ["results\\s*\\[\\s*i\\s*\\]\\s*\\.\\s*issuccess\\s*\\(\\s*\\)\\s*;?"],
      placeholder: { es: "results…", en: "results…" },
      explain: {
        es: "results[i].isSuccess(): true si toInsert[i] se guardó. Si es false, results[i].getErrors() trae el motivo.",
        en: "results[i].isSuccess(): true if toInsert[i] was saved. If false, results[i].getErrors() brings the reason.",
      },
      tags: ["recall"],
    },
    {
      id: "m08-cp-q7",
      kind: "single",
      prompt: {
        es: "Repaso: ¿qué devuelve Database.insert(toInsert, false)?",
        en: "Review: what does Database.insert(toInsert, false) return?",
      },
      options: [
        { es: "Una List<Database.SaveResult>, una por registro y en el mismo orden", en: "A List<Database.SaveResult>, one per record and in the same order" },
        { es: "Nada: es void", en: "Nothing: it is void" },
        { es: "Un Boolean: si se guardó todo", en: "A Boolean: whether everything was saved" },
        { es: "Solo los registros que fallaron", en: "Only the records that failed" },
      ],
      answer: 0,
      explain: {
        es: "Un resultado por registro, en el mismo orden: por eso results[i] habla de toInsert[i].",
        en: "One result per record, in the same order: that is why results[i] is about toInsert[i].",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M4 L2", en: "Review · M4 L2" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 6 DE 6 · La entrega. La primera versión del importador hace una consulta y un insert por fila, y la primera cuenta que falta, el primer importe raro o la primera renovación duplicada tumban la noche entera. Reescribe RenewalImporter.run para que cree todas las renovaciones buenas y deje un informe con cada fila rechazada y su motivo, pase lo que pase.",
      en: "TASK 6 OF 6 · The delivery. The importer's first version runs a query and an insert per row, and the first missing account, the first odd amount or the first duplicate renewal brings down the whole night. Rewrite RenewalImporter.run so it creates every good renewal and leaves a report with each rejected row and its reason, whatever happens.",
    },
    brief: [
      {
        es: "Una sola consulta de Account con ERP_Code__c IN :amountsByErp.keySet(), guardada en un Map<String, Account> por código ERP.",
        en: "A single Account query with ERP_Code__c IN :amountsByErp.keySet(), stored in a Map<String, Account> by ERP code.",
      },
      {
        es: "En el bucle de filas, lo primero es un try. Si el código no está en el mapa, throw new RenewalImportException con el código. Las renovaciones válidas van a una List<Opportunity> toInsert. catch (RenewalImportException e) apunta la fila y el motivo en una List<String> report.",
        en: "In the row loop, the first thing is a try. If the code is not in the map, throw new RenewalImportException with the code. Valid renewals go into a List<Opportunity> toInsert. catch (RenewalImportException e) notes the row and reason in a List<String> report.",
      },
      {
        es: "Después del bucle, Database.insert(toInsert, false). Recorre los SaveResult: si !isSuccess(), añade al informe el nombre de la oportunidad y getErrors()[0].getMessage().",
        en: "After the loop, Database.insert(toInsert, false). Walk the SaveResults: if !isSuccess(), add the opportunity's name and getErrors()[0].getMessage() to the report.",
      },
      {
        es: "Todo run dentro de un try con finally, y en el finally un System.debug con el informe. Ningún DML ni consulta dentro de un bucle.",
        en: "All of run inside a try with finally, and in the finally a System.debug with the report. No DML or query inside a loop.",
      },
    ],
    starter: { es: STARTER_ES, en: STARTER_EN },
    hints: [
      {
        es: "Yo lo haría como un Data Loader que escribes tú: primero traigo todo lo que necesito de una vez, después reviso fila a fila apartando las malas, guardo las buenas en bloque y, pase lo que pase, dejo el error.csv.",
        en: "I would do it like a Data Loader you write yourself: first I fetch everything I need in one go, then I review row by row setting the bad ones aside, save the good ones in bulk and, whatever happens, leave the error.csv.",
      },
      {
        es: "Lo que me ayudó: hay dos sitios donde se rechaza una fila. Antes de guardar, lo que tú detectas (código desconocido, importe malo) llega al catch de RenewalImportException. Al guardar, lo que detecta Salesforce (el guardián, un propietario inactivo) llega en el SaveResult. Los dos van al mismo report.",
        en: "What helped me: there are two places a row is rejected. Before saving, what you detect (unknown code, bad amount) reaches the RenewalImportException catch. When saving, what Salesforce detects (the guard, an inactive owner) arrives in the SaveResult. Both go into the same report.",
      },
      {
        es: "Te dejo el esquema: List<String> report = …; try { List<Account> accounts = [SELECT … WHERE ERP_Code__c IN :amountsByErp.keySet()]; Map<String, Account> accountsByErp …; for (erpCode) { try { if (!accountsByErp.containsKey(erpCode)) throw …; toInsert.add(…); } catch (RenewalImportException e) { report.add(…); } } List<Database.SaveResult> results = Database.insert(toInsert, false); for (i) { if (!results[i].isSuccess()) report.add(…getErrors()[0].getMessage()); } } finally { System.debug(report); }",
        en: "Here is the outline: List<String> report = …; try { List<Account> accounts = [SELECT … WHERE ERP_Code__c IN :amountsByErp.keySet()]; Map<String, Account> accountsByErp …; for (erpCode) { try { if (!accountsByErp.containsKey(erpCode)) throw …; toInsert.add(…); } catch (RenewalImportException e) { report.add(…); } } List<Database.SaveResult> results = Database.insert(toInsert, false); for (i) { if (!results[i].isSuccess()) report.add(…getErrors()[0].getMessage()); } } finally { System.debug(report); }",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m08-cp-c1",
        label: { es: "Una sola consulta de cuentas, en un Map por código ERP", en: "A single account query, in a Map by ERP code" },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "\\[\\s*SELECT\\b", min: 1, max: 1 },
            { op: "match", pattern: "ERP_Code__c\\s+IN\\s*:" },
            { op: "match", pattern: "Map\\s*<\\s*String\\s*,\\s*Account\\s*>" },
            { op: "absent", pattern: "(for|while)\\s*\\([^)]*\\)\\s*\\{[^{}]*\\[\\s*SELECT\\b" },
          ],
        },
        onFail: {
          es: "Saca la consulta del bucle: una sola, WHERE ERP_Code__c IN :amountsByErp.keySet(), y guarda las cuentas en un Map<String, Account> por código.",
          en: "Move the query out of the loop: a single one, WHERE ERP_Code__c IN :amountsByErp.keySet(), and store the accounts in a Map<String, Account> by code.",
        },
        otter: {
          es: "Con 300 filas, una consulta por fila es el Get Records en el Loop de siempre. Trae todas las cuentas de una vez con ERP_Code__c IN :amountsByErp.keySet() y déjalas en un Map<String, Account> para encontrarlas por código.",
          en: "With 300 rows, one query per row is the usual Get Records in a Loop. Bring every account at once with ERP_Code__c IN :amountsByErp.keySet() and keep them in a Map<String, Account> to find them by code.",
        },
      },
      {
        id: "m08-cp-c2",
        label: { es: "Cada fila tiene su try y su catch de RenewalImportException", en: "Each row has its try and its RenewalImportException catch" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "for\\s*\\(\\s*String\\s+\\w+\\s*:\\s*amountsByErp\\s*\\.\\s*keySet\\s*\\(\\s*\\)\\s*\\)\\s*\\{\\s*try\\s*\\{" },
            { op: "match", pattern: "catch\\s*\\(\\s*RenewalImportException\\s+\\w+\\s*\\)\\s*\\{[^}]*\\.add\\s*\\(" },
          ],
        },
        onFail: {
          es: "Dentro de for (String erpCode : amountsByErp.keySet()), lo primero es try { … } y su catch (RenewalImportException e) añade la fila y e.getMessage() al informe.",
          en: "Inside for (String erpCode : amountsByErp.keySet()), the first thing is try { … } and its catch (RenewalImportException e) adds the row and e.getMessage() to the report.",
        },
        otter: {
          es: "Es el fault path por fila de la tarea 1: el try justo al abrir el bucle, y en catch (RenewalImportException e), report.add(…) con el código y el motivo. La fila mala se apunta y el bucle sigue.",
          en: "It is task 1's per-row fault path: the try right as the loop opens, and in catch (RenewalImportException e), report.add(…) with the code and the reason. The bad row is noted and the loop carries on.",
        },
      },
      {
        id: "m08-cp-c3",
        label: { es: "Un código desconocido lanza RenewalImportException", en: "An unknown code throws RenewalImportException" },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "!\\s*\\w+\\s*\\.\\s*containsKey\\s*\\(\\s*\\w+\\s*\\)\\s*\\)\\s*\\{?\\s*throw\\s+new\\s+RenewalImportException" },
            { op: "match", pattern: "==\\s*null\\s*\\)\\s*\\{?\\s*throw\\s+new\\s+RenewalImportException" },
          ],
        },
        onFail: {
          es: "Antes de crear la oportunidad: if (!accountsByErp.containsKey(erpCode)) { throw new RenewalImportException('…' + erpCode); }",
          en: "Before building the opportunity: if (!accountsByErp.containsKey(erpCode)) { throw new RenewalImportException('…' + erpCode); }",
        },
        otter: {
          es: "El ERP-999 de la tarea 4 sigue llegando. Compruébalo contra el mapa: if (!accountsByErp.containsKey(erpCode)) { throw new RenewalImportException('Cuenta desconocida: ' + erpCode); }",
          en: "Task 4's ERP-999 still arrives. Check it against the map: if (!accountsByErp.containsKey(erpCode)) { throw new RenewalImportException('Unknown account: ' + erpCode); }",
        },
      },
      {
        id: "m08-cp-c4",
        label: { es: "Guardado parcial, leyendo cada SaveResult", en: "Partial save, reading each SaveResult" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Database\\s*\\.\\s*insert\\s*\\(\\s*\\w+\\s*,\\s*false\\s*\\)" },
            { op: "match", pattern: "\\.\\s*isSuccess\\s*\\(\\s*\\)" },
            { op: "match", pattern: "\\.\\s*getErrors\\s*\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "Después del bucle: List<Database.SaveResult> results = Database.insert(toInsert, false); y, para cada results[i] que no isSuccess(), apunta getErrors()[0].getMessage().",
          en: "After the loop: List<Database.SaveResult> results = Database.insert(toInsert, false); and, for each results[i] that is not isSuccess(), note getErrors()[0].getMessage().",
        },
        otter: {
          es: "Esto es lo que el flow no nos daba: Database.insert(toInsert, false) guarda las buenas, y cada results[i] te dice con isSuccess() si toInsert[i] entró y, si no, getErrors() trae el motivo. Tu error.csv.",
          en: "This is what the flow did not give us: Database.insert(toInsert, false) saves the good ones, and each results[i] tells you with isSuccess() whether toInsert[i] got in and, if not, getErrors() brings the reason. Your error.csv.",
        },
      },
      {
        id: "m08-cp-c5",
        label: { es: "El informe sale en un finally", en: "The report goes out in a finally" },
        rule: { op: "match", pattern: "\\}\\s*finally\\s*\\{[^}]*System\\s*\\.\\s*debug\\s*\\(" },
        onFail: {
          es: "Rodea todo run con try { … } finally { System.debug(… report …); }: el informe tiene que salir aunque algo inesperado pare la importación.",
          en: "Wrap all of run in try { … } finally { System.debug(… report …); }: the report must go out even if something unexpected stops the import.",
        },
        otter: {
          es: "El ERP espera su informe cada mañana, pase lo que pase. Eso es un finally: try { todo run } finally { System.debug(… report …); }.",
          en: "The ERP expects its report every morning, whatever happens. That is a finally: try { all of run } finally { System.debug(… report …); }.",
        },
      },
      {
        id: "m08-cp-c6",
        label: { es: "Ningún DML dentro de un bucle", en: "No DML inside a loop" },
        rule: {
          op: "all",
          of: [
            { op: "absent", pattern: "\\b(insert|update|upsert|delete)\\s+\\w+\\s*;" },
            { op: "count", pattern: "Database\\s*\\.\\s*insert\\s*\\(", max: 1 },
          ],
        },
        onFail: {
          es: "Quita el insert renewal; del bucle: las renovaciones se acumulan en toInsert y se guardan una sola vez con Database.insert(toInsert, false).",
          en: "Remove the insert renewal; from the loop: renewals pile up in toInsert and are saved once with Database.insert(toInsert, false).",
        },
        otter: {
          es: "Un insert por fila es el Create Records dentro del Loop que reventó en el DML 151, y ese límite no lo salva ningún catch. Acumula en toInsert y guarda una sola vez.",
          en: "One insert per row is the Create Records inside the Loop that blew up at DML 151, and no catch can save that limit. Pile them up in toInsert and save once.",
        },
      },
    ],
    rubric: [
      {
        es: "Cuando lo tengas, cuenta: ¿cuántas consultas y cuántos DML gasta el importador con 3 filas? ¿Y con 300? Si la respuesta es la misma, está bien bulkificado.",
        en: "Once you have it, count: how many queries and how many DML statements does the importer use with 3 rows? And with 300? If the answer is the same, it is properly bulkified.",
      },
      {
        es: "En una entrevista te preguntarán cuándo usar try/catch, cuándo addError y cuándo Database.insert(list, false). Este importador usa los tres: ¿sabrías explicar por qué cada uno está donde está?",
        en: "In an interview you will be asked when to use try/catch, when addError and when Database.insert(list, false). This importer uses all three: could you explain why each one is where it is?",
      },
    ],
    voice: "otter",
    outro: {
      es: "¡Entregaste el puente con el ERP! Crea lo bueno, rechaza lo malo fila a fila y deja un informe que el ERP puede leer, pase lo que pase: exactamente lo que el flow no podía darnos. En el Módulo 9 llega el Apex asíncrono: qué hacer cuando las filas no son 300, sino 300.000.",
      en: "You delivered the ERP bridge! It creates the good, rejects the bad row by row and leaves a report the ERP can read, whatever happens: exactly what the flow could not give us. Module 9 brings asynchronous Apex: what to do when the rows are not 300 but 300,000.",
    },
  },
};
