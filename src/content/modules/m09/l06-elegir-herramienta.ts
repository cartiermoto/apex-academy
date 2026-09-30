import type { Lesson } from "@/lib/types";

const CALLOUT_ES = `        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:ERP/renewals');
        req.setMethod('POST');
        req.setBody(JSON.serialize(renewals));
        http.send(req);`;

const SOLUTION_ES = `// CASO: el puente con el ERP, a escala
// Tarea 6 de 7: el aviso al ERP, como Queueable, y marcando lo enviado.

public class ErpSyncJob implements Queueable, Database.AllowsCallouts {
    private Set<Id> renewalIds;

    public ErpSyncJob(Set<Id> renewalIds) {
        this.renewalIds = renewalIds;
    }

    public void execute(QueueableContext ctx) {
        List<Opportunity> renewals = [
            SELECT Id, Name, Amount, Account.ERP_Code__c
            FROM Opportunity
            WHERE Id IN :renewalIds
        ];
${CALLOUT_ES}

        // Primero la llamada, después el guardado
        for (Opportunity o : renewals) {
            o.ERP_Synced__c = true;
        }
        update renewals;
    }
}

// En el handler de Opportunity (after insert):
Id jobId = System.enqueueJob(new ErpSyncJob(renewalIds));`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, a escala\n// Tarea 6 de 7: el aviso al ERP, como Queueable, y marcando lo enviado.",
  "// CASE: the ERP bridge, at scale\n// Task 6 of 7: the ERP notice, as a Queueable, and marking what was sent.",
)
  .replace("// Primero la llamada, después el guardado", "// First the call, then the save")
  .replace("// En el handler de Opportunity (after insert):", "// In the Opportunity handler (after insert):");

export const l06ElegirHerramienta: Lesson = {
  id: "m09-l06",
  slug: "elegir-herramienta",
  n: 6,
  kind: "lesson",
  minutes: 30,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 5", en: "Remember? · Review of lesson 5" },
    prompt: { es: "¿Qué significa '0 0 2 ? * MON-FRI'?", en: "What does '0 0 2 ? * MON-FRI' mean?" },
    options: [
      { es: "A las 2:00, de lunes a viernes", en: "At 2:00, Monday to Friday" },
      { es: "Cada 2 horas, de lunes a viernes", en: "Every 2 hours, Monday to Friday" },
      { es: "El día 2 de cada mes", en: "The 2nd of every month" },
    ],
    answer: 0,
    explain: {
      es: "Segundos, minutos, horas, día del mes (?), mes (*) y día de la semana. Ya tienes las cuatro herramientas; hoy, a elegir.",
      en: "Seconds, minutes, hours, day of month (?), month (*) and day of week. You have the four tools; today, choosing.",
    },
  },
  title: { es: "Elegir la herramienta correcta", en: "Choosing the right tool" },
  summary: {
    es: "Cuatro herramientas asíncronas, cuatro trabajos distintos. Hoy aprendes a elegir, y a cambiar de herramienta cuando la elegida se queda corta: el @future de la tarea 2 pasa a Queueable.",
    en: "Four async tools, four different jobs. Today you learn to choose, and to switch tools when the chosen one falls short: task 2's @future becomes a Queueable.",
  },
  analogy: {
    es: "Elegir entre un flow desencadenado, uno programado y uno autolanzado",
    en: "Choosing between a record-triggered, a scheduled and an autolaunched flow",
  },
  objectives: [
    { es: "Elegir entre @future, Queueable, Batch y Scheduled según el trabajo.", en: "Choose between @future, Queueable, Batch and Scheduled depending on the job." },
    { es: "Pasar un @future a Queueable con Database.AllowsCallouts.", en: "Turn an @future into a Queueable with Database.AllowsCallouts." },
    { es: "Hacer el callout antes que el DML en la misma transacción.", en: "Make the callout before the DML in the same transaction." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "El ERP ha pedido algo nuevo: saber qué renovaciones ya recibió. El @future de la tarea 2 envía, pero no te da un Id para seguirlo ni sabe encadenar un segundo paso. Es buen momento para poner las cuatro herramientas una al lado de otra.",
        en: "The ERP has asked for something new: to know which renewals it already received. Task 2's @future sends, but gives you no Id to follow it and cannot chain a second step. A good time to put the four tools side by side.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Herramienta", en: "Tool" },
        { es: "Úsala para…", en: "Use it for…" },
        { es: "Su límite a recordar", en: "Its limit to remember" },
      ],
      rows: [
        [
          { es: "@future", en: "@future" },
          { es: "Algo pequeño y suelto tras el guardado, como un callout sencillo.", en: "Something small and standalone after the save, like a simple callout." },
          { es: "Solo parámetros simples, sin Id de trabajo, no encadena.", en: "Simple parameters only, no job Id, no chaining." },
        ],
        [
          { es: "Queueable", en: "Queueable" },
          { es: "Lo mismo, cuando necesitas estado, seguirlo o encadenar pasos.", en: "The same, when you need state, tracking or chained steps." },
          { es: "Un solo hijo por execute.", en: "One child per execute." },
        ],
        [
          { es: "Batch", en: "Batch" },
          { es: "Recorrer muchos registros de un objeto, en tandas.", en: "Walking many records of an object, in chunks." },
          { es: "5 en marcha a la vez; hasta 50 millones por trabajo.", en: "5 running at once; up to 50 million per job." },
        ],
        [
          { es: "Scheduled", en: "Scheduled" },
          { es: "Arrancar algo a una hora, normalmente un Batch o un Queueable.", en: "Starting something at a set time, usually a Batch or a Queueable." },
          { es: "100 programados a la vez; sin callouts directos.", en: "100 scheduled at once; no direct callouts." },
        ],
      ],
    },
    {
      type: "diagram",
      id: "m09-chooser",
      caption: {
        es: "Para cada encargo de Northwind, ¿qué herramienta elegirías?",
        en: "For each Northwind request, which tool would you choose?",
      },
    },
    {
      type: "h",
      text: { es: "De @future a Queueable", en: "From @future to Queueable" },
    },
    {
      type: "p",
      text: {
        es: "Salesforce recomienda Queueable frente a @future para trabajo nuevo: hace lo mismo y más. El cambio es mecánico: los parámetros del método pasan a ser atributos que recibe el constructor, el cuerpo pasa a execute, y callout=true se convierte en una segunda interfaz, Database.AllowsCallouts.",
        en: "Salesforce recommends Queueable over @future for new work: it does the same and more. The change is mechanical: the method's parameters become attributes the constructor receives, the body moves to execute, and callout=true becomes a second interface, Database.AllowsCallouts.",
      },
    },
    {
      type: "code",
      code: {
        es: `// Antes
@future(callout=true)
public static void notifyRenewals(Set<Id> renewalIds) { … }

// Después
public class ErpSyncJob implements Queueable, Database.AllowsCallouts {
    private Set<Id> renewalIds;
    public ErpSyncJob(Set<Id> renewalIds) { this.renewalIds = renewalIds; }
    public void execute(QueueableContext ctx) { … }
}`,
        en: `// Before
@future(callout=true)
public static void notifyRenewals(Set<Id> renewalIds) { … }

// After
public class ErpSyncJob implements Queueable, Database.AllowsCallouts {
    private Set<Id> renewalIds;
    public ErpSyncJob(Set<Id> renewalIds) { this.renewalIds = renewalIds; }
    public void execute(QueueableContext ctx) { … }
}`,
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Primero la llamada, después el guardado", en: "First the call, then the save" },
      text: {
        es: "Dentro de una transacción, un callout no puede ir después de un DML sin confirmar: Salesforce lo rechaza con «You have uncommitted work pending». El orden correcto es llamar al ERP y, con la respuesta, guardar. Si necesitas guardar antes, parte el trabajo en dos Queueables encadenados.",
        en: "Inside a transaction, a callout cannot come after an uncommitted DML: Salesforce rejects it with «You have uncommitted work pending». The right order is to call the ERP and, with the answer, save. If you need to save first, split the work into two chained Queueables.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? El mapa completo", en: "Why not a Flow? The full map" },
      text: {
        es: "Con franqueza, esto resume el módulo: el camino asíncrono de un flow cubre lo que harías con un @future o un Queueable sencillo, y un flow programado cubre un Scheduled pequeño. Donde Flow no llega es a la escala y al control: el tope diario de 250.000 interviews programadas, encadenar trabajos con estado, elegir el tamaño de las tandas o lanzar un Batch. Si tu caso cabe en Flow, Flow suele ser la mejor opción; si no cabe, ya sabes qué herramienta de Apex usar.",
        en: "Frankly, this sums up the module: a flow's async path covers what you would do with an @future or a simple Queueable, and a scheduled flow covers a small Scheduled job. Where Flow does not reach is scale and control: the daily cap of 250,000 scheduled interviews, chaining jobs with state, choosing chunk size or launching a Batch. If your case fits in Flow, Flow is usually the best option; if it does not, you now know which Apex tool to use.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué herramienta usarías para recorrer dos millones de cuentas? ¿Qué interfaz sustituye a callout=true en un Queueable? ¿Por qué el callout va antes del update?",
        en: "Without looking: which tool would you use to walk two million accounts? Which interface replaces callout=true in a Queueable? Why does the callout go before the update?",
      },
    },
  ],

  quiz: [
    {
      id: "m09-l06-q1",
      kind: "single",
      prompt: { es: "Hay que recalcular el Rating de 2 millones de cuentas. ¿Qué herramienta?", en: "The Rating of 2 million accounts has to be recalculated. Which tool?" },
      options: [
        { es: "Batch", en: "Batch" },
        { es: "@future", en: "@future" },
        { es: "Un Queueable sin encadenar", en: "A Queueable without chaining" },
        { es: "Un Schedulable que lo haga todo en su execute", en: "A Schedulable doing it all in its execute" },
      ],
      answer: 0,
      explain: {
        es: "Muchos registros de un objeto, en tandas: es lo que hace Batch.",
        en: "Many records of an object, in chunks: that is what Batch does.",
      },
    },
    {
      id: "m09-l06-q2",
      kind: "single",
      prompt: {
        es: "Tras crear un caso, hay que llamar a un sistema externo y, con su respuesta, lanzar un segundo paso. ¿Qué herramienta?",
        en: "After a case is created, an external system must be called and, with its answer, a second step launched. Which tool?",
      },
      options: [
        { es: "Queueable con Database.AllowsCallouts, que encola el segundo paso", en: "A Queueable with Database.AllowsCallouts, which enqueues the second step" },
        { es: "@future(callout=true) que llama a otro @future", en: "An @future(callout=true) calling another @future" },
        { es: "Batch", en: "Batch" },
        { es: "Un callout en el trigger", en: "A callout in the trigger" },
      ],
      answer: 0,
      explain: {
        es: "Encadenar es cosa de Queueable. Un @future no puede llamar a otro, y el trigger no puede hacer callouts.",
        en: "Chaining is Queueable's job. An @future cannot call another, and the trigger cannot make callouts.",
      },
    },
    {
      id: "m09-l06-q3",
      kind: "single",
      prompt: { es: "¿Qué pasa con este execute?", en: "What happens with this execute?" },
      code: {
        es: `public void execute(QueueableContext ctx) {
    update renewals;
    http.send(req);
}`,
        en: `public void execute(QueueableContext ctx) {
    update renewals;
    http.send(req);
}`,
      },
      options: [
        { es: "Falla: no se puede hacer un callout después de un DML sin confirmar", en: "It fails: a callout cannot follow an uncommitted DML" },
        { es: "Funciona igual que al revés", en: "It works the same as the other way round" },
        { es: "Falla: un Queueable no puede hacer update", en: "It fails: a Queueable cannot do an update" },
        { es: "Funciona, pero el update se deshace", en: "It works, but the update is rolled back" },
      ],
      answer: 0,
      explain: {
        es: "«You have uncommitted work pending». Primero la llamada y después el guardado.",
        en: "«You have uncommitted work pending». First the call, then the save.",
      },
      tags: ["find-error"],
    },
    {
      id: "m09-l06-q4",
      kind: "text",
      prompt: {
        es: "Escribe la cabecera de una clase ErpSyncJob encolable que pueda hacer callouts.",
        en: "Write the header of an enqueueable ErpSyncJob class that can make callouts.",
      },
      accept: ["(public\\s+)?class\\s+erpsyncjob\\s+implements\\s+(queueable\\s*,\\s*database\\.allowscallouts|database\\.allowscallouts\\s*,\\s*queueable)\\s*\\{?"],
      placeholder: { es: "public class …", en: "public class …" },
      explain: {
        es: "public class ErpSyncJob implements Queueable, Database.AllowsCallouts: dos interfaces separadas por coma.",
        en: "public class ErpSyncJob implements Queueable, Database.AllowsCallouts: two interfaces separated by a comma.",
      },
      tags: ["recall"],
    },
    {
      id: "m09-l06-q5",
      kind: "multi",
      prompt: { es: "¿Qué ganas al pasar el aviso al ERP de @future a Queueable?", en: "What do you gain by moving the ERP notice from @future to Queueable?" },
      options: [
        { es: "Un Id para seguir el trabajo en AsyncApexJob", en: "An Id to track the job in AsyncApexJob" },
        { es: "Poder encadenar un segundo paso", en: "Being able to chain a second step" },
        { es: "Atributos y constructor, con el estado que necesites", en: "Attributes and a constructor, with whatever state you need" },
        { es: "Límites síncronos", en: "Synchronous limits" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Sigue siendo asíncrono, con límites asíncronos; lo que gana es control.",
        en: "It is still asynchronous, with async limits; what it gains is control.",
      },
    },
    {
      id: "m09-l06-q6",
      kind: "single",
      prompt: {
        es: "Repaso: en el constructor de ErpSyncJob, ¿qué distingue this.renewalIds de renewalIds?",
        en: "Review: in ErpSyncJob's constructor, what tells this.renewalIds apart from renewalIds?",
      },
      options: [
        { es: "this.renewalIds es el atributo del objeto; renewalIds, el parámetro", en: "this.renewalIds is the object's attribute; renewalIds, the parameter" },
        { es: "Son lo mismo", en: "They are the same" },
        { es: "this.renewalIds es static", en: "this.renewalIds is static" },
        { es: "renewalIds es el atributo", en: "renewalIds is the attribute" },
      ],
      answer: 0,
      explain: {
        es: "Es el this del Módulo 5: cuando el parámetro se llama igual que el atributo, this señala el del objeto.",
        en: "It is Module 5's this: when the parameter has the attribute's name, this points to the object's one.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M5 L4", en: "Review · M5 L4" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 6 DE 7 · El ERP quiere saber qué renovaciones ya recibió, y el equipo quiere poder seguir cada envío. Pasa el @future de la tarea 2 a un Queueable que haga la llamada y, después, marque las renovaciones enviadas con ERP_Synced__c = true.",
      en: "TASK 6 OF 7 · The ERP wants to know which renewals it already received, and the team wants to track each send. Turn task 2's @future into a Queueable that makes the call and, afterwards, marks the sent renewals with ERP_Synced__c = true.",
    },
    brief: [
      {
        es: "public class ErpSyncJob implements Queueable, Database.AllowsCallouts, con un atributo private Set<Id> renewalIds que recibe el constructor.",
        en: "public class ErpSyncJob implements Queueable, Database.AllowsCallouts, with a private Set<Id> renewalIds attribute the constructor receives.",
      },
      {
        es: "En execute: la misma consulta y la misma llamada que antes.",
        en: "In execute: the same query and the same call as before.",
      },
      {
        es: "Después de http.send, marca ERP_Synced__c = true en cada renovación y haz un único update.",
        en: "After http.send, set ERP_Synced__c = true on each renewal and do a single update.",
      },
      {
        es: "Fuera: Id jobId = System.enqueueJob(new ErpSyncJob(renewalIds));. Ya no queda ningún @future.",
        en: "Outside: Id jobId = System.enqueueJob(new ErpSyncJob(renewalIds));. No @future remains.",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, a escala
// Ya resuelto (tareas 1-5): aviso al ERP con @future, migración en Batch, programada cada noche.
// Tarea 6 de 7: el aviso al ERP, como Queueable, y marcando lo enviado.

public class ErpNotifier {
    @future(callout=true)
    public static void notifyRenewals(Set<Id> renewalIds) {
        List<Opportunity> renewals = [
            SELECT Id, Name, Amount, Account.ERP_Code__c
            FROM Opportunity
            WHERE Id IN :renewalIds
        ];
${CALLOUT_ES}
    }
}

// En el handler de Opportunity (after insert):
ErpNotifier.notifyRenewals(renewalIds);
`,
      en: `// CASE: the ERP bridge, at scale
// Already solved (tasks 1-5): ERP notice with @future, migration as a Batch, scheduled every night.
// Task 6 of 7: the ERP notice, as a Queueable, and marking what was sent.

public class ErpNotifier {
    @future(callout=true)
    public static void notifyRenewals(Set<Id> renewalIds) {
        List<Opportunity> renewals = [
            SELECT Id, Name, Amount, Account.ERP_Code__c
            FROM Opportunity
            WHERE Id IN :renewalIds
        ];
${CALLOUT_ES}
    }
}

// In the Opportunity handler (after insert):
ErpNotifier.notifyRenewals(renewalIds);
`,
    },
    hints: [
      {
        es: "Yo lo pensaría como mover la lógica de un flow a otro con más opciones: lo que hace es lo mismo; lo que cambia es la caja donde vive y lo que puedes hacer después.",
        en: "I would think of it as moving logic from one flow to another with more options: what it does is the same; what changes is the box it lives in and what you can do afterwards.",
      },
      {
        es: "Lo que me ayudó: el parámetro del @future pasa a ser un atributo que llena el constructor, con this. Y el orden dentro de execute importa: primero http.send, después el update.",
        en: "What helped me: the @future's parameter becomes an attribute the constructor fills, with this. And the order inside execute matters: first http.send, then the update.",
      },
      {
        es: "Te dejo el esquema: public class ErpSyncJob implements Queueable, Database.AllowsCallouts { private Set<Id> renewalIds; public ErpSyncJob(Set<Id> renewalIds) { this.renewalIds = renewalIds; } public void execute(QueueableContext ctx) { consulta; llamada; for (Opportunity o : renewals) { o.ERP_Synced__c = true; } update renewals; } } · Id jobId = System.enqueueJob(new ErpSyncJob(renewalIds));",
        en: "Here is the outline: public class ErpSyncJob implements Queueable, Database.AllowsCallouts { private Set<Id> renewalIds; public ErpSyncJob(Set<Id> renewalIds) { this.renewalIds = renewalIds; } public void execute(QueueableContext ctx) { query; call; for (Opportunity o : renewals) { o.ERP_Synced__c = true; } update renewals; } } · Id jobId = System.enqueueJob(new ErpSyncJob(renewalIds));",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m09-l06-c1",
        label: { es: "Queueable que puede hacer callouts", en: "A Queueable that can make callouts" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "class\\s+ErpSyncJob\\s+implements[^{]*\\bQueueable\\b" },
            { op: "match", pattern: "class\\s+ErpSyncJob\\s+implements[^{]*Database\\s*\\.\\s*AllowsCallouts" },
            { op: "absent", pattern: "@future" },
          ],
        },
        onFail: {
          es: "public class ErpSyncJob implements Queueable, Database.AllowsCallouts, y ya sin ningún @future.",
          en: "public class ErpSyncJob implements Queueable, Database.AllowsCallouts, and no @future left.",
        },
        otter: {
          es: "El callout=true del @future se convierte en un segundo contrato: implements Queueable, Database.AllowsCallouts. Y el @future viejo desaparece.",
          en: "The @future's callout=true becomes a second contract: implements Queueable, Database.AllowsCallouts. And the old @future goes away.",
        },
      },
      {
        id: "m09-l06-c2",
        label: { es: "El constructor guarda los Ids", en: "The constructor stores the Ids" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "ErpSyncJob\\s*\\(\\s*Set\\s*<\\s*Id\\s*>\\s+\\w+\\s*\\)\\s*\\{[^}]*this\\s*\\.\\s*\\w+\\s*=" },
            { op: "match", pattern: "public\\s+void\\s+execute\\s*\\(\\s*QueueableContext\\s+\\w+\\s*\\)" },
          ],
        },
        onFail: {
          es: "public ErpSyncJob(Set<Id> renewalIds) { this.renewalIds = renewalIds; } y public void execute(QueueableContext ctx) { … }",
          en: "public ErpSyncJob(Set<Id> renewalIds) { this.renewalIds = renewalIds; } and public void execute(QueueableContext ctx) { … }",
        },
        otter: {
          es: "Lo que antes era el parámetro del @future ahora viaja dentro del objeto: el constructor lo guarda con this.renewalIds = renewalIds, y execute lo usa cuando le toque.",
          en: "What used to be the @future's parameter now travels inside the object: the constructor stores it with this.renewalIds = renewalIds, and execute uses it when its turn comes.",
        },
      },
      {
        id: "m09-l06-c3",
        label: { es: "Llama primero y guarda después", en: "Calls first and saves afterwards" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "\\.\\s*send\\s*\\([^)]*\\)[\\s\\S]*ERP_Synced__c\\s*=\\s*true[\\s\\S]*\\bupdate\\s+\\w+\\s*;" },
            { op: "absent", pattern: "\\bupdate\\s+\\w+\\s*;[\\s\\S]*\\.\\s*send\\s*\\(" },
            { op: "absent", pattern: "for\\s*\\([^)]*\\)\\s*\\{[^{}]*\\bupdate\\s+\\w+\\s*;" },
          ],
        },
        onFail: {
          es: "Después de http.send(req): for (Opportunity o : renewals) { o.ERP_Synced__c = true; } y un único update renewals; fuera del bucle.",
          en: "After http.send(req): for (Opportunity o : renewals) { o.ERP_Synced__c = true; } and a single update renewals; outside the loop.",
        },
        otter: {
          es: "El orden importa: con un update pendiente, Salesforce ya no deja llamar fuera. Primero http.send(req), después ERP_Synced__c = true en el bucle y un solo update renewals; al final.",
          en: "The order matters: with an update pending, Salesforce no longer lets you call out. First http.send(req), then ERP_Synced__c = true in the loop and a single update renewals; at the end.",
        },
      },
      {
        id: "m09-l06-c4",
        label: { es: "Se encola y se guarda su Id", en: "It is enqueued and its Id stored" },
        rule: { op: "match", pattern: "Id\\s+\\w+\\s*=\\s*System\\s*\\.\\s*enqueueJob\\s*\\(\\s*new\\s+ErpSyncJob\\s*\\(\\s*\\w+\\s*\\)\\s*\\)" },
        onFail: {
          es: "En el handler: Id jobId = System.enqueueJob(new ErpSyncJob(renewalIds));",
          en: "In the handler: Id jobId = System.enqueueJob(new ErpSyncJob(renewalIds));",
        },
        otter: {
          es: "Esto es lo que @future no te daba: Id jobId = System.enqueueJob(new ErpSyncJob(renewalIds)); y con ese Id, el envío se sigue en Setup → Apex Jobs.",
          en: "This is what @future did not give you: Id jobId = System.enqueueJob(new ErpSyncJob(renewalIds)); and with that Id, the send is tracked in Setup → Apex Jobs.",
        },
      },
    ],
    rubric: [
      {
        es: "Si el ERP responde con un error, ¿deberías marcar ERP_Synced__c igualmente? ¿Cómo mirarías la respuesta antes del update? El Módulo 11 lo trata a fondo.",
        en: "If the ERP answers with an error, should you set ERP_Synced__c anyway? How would you check the response before the update? Module 11 covers it in depth.",
      },
    ],
    voice: "otter",
    outro: {
      es: "Ya eliges la herramienta por el trabajo, y sabes cambiarla cuando se queda corta. En la tarea 7 las juntas: la sincronización nocturna completa con el ERP, de principio a fin.",
      en: "You now choose the tool by the job, and know how to switch when it falls short. In task 7 you put them together: the full nightly sync with the ERP, from start to finish.",
    },
  },
};
