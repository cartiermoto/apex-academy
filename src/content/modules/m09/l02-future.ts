import type { Lesson } from "@/lib/types";

const CALLOUT_BODY = `        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:ERP/renewals');   // Named Credential (Módulo 11)
        req.setMethod('POST');
        req.setBody(JSON.serialize(renewals));
        http.send(req);`;

const SOLUTION_ES = `// CASO: el puente con el ERP, a escala
// Tarea 2 de 7: avisar al ERP de las renovaciones nuevas, sin hacer esperar al trigger.

public class ErpNotifier {
    @future(callout=true)
    public static void notifyRenewals(Set<Id> renewalIds) {
        // Los registros se consultan aquí, frescos: al método solo llegan Ids
        List<Opportunity> renewals = [
            SELECT Id, Name, Amount, Account.ERP_Code__c
            FROM Opportunity
            WHERE Id IN :renewalIds
        ];
${CALLOUT_BODY}
    }
}

// En el handler de Opportunity (after insert), una sola llamada para todo el lote:
// ErpNotifier.notifyRenewals(new Map<Id, Opportunity>(renewals).keySet());`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, a escala\n// Tarea 2 de 7: avisar al ERP de las renovaciones nuevas, sin hacer esperar al trigger.",
  "// CASE: the ERP bridge, at scale\n// Task 2 of 7: notify the ERP of new renewals, without making the trigger wait.",
)
  .replace("// Los registros se consultan aquí, frescos: al método solo llegan Ids", "// Records are queried here, fresh: only Ids reach the method")
  .replace("// Named Credential (Módulo 11)", "// Named Credential (Module 11)")
  .replace("// En el handler de Opportunity (after insert), una sola llamada para todo el lote:", "// In the Opportunity handler (after insert), one single call for the whole batch:");

export const l02Future: Lesson = {
  id: "m09-l02",
  slug: "future",
  n: 2,
  kind: "lesson",
  minutes: 25,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 1", en: "Remember? · Review of lesson 1" },
    prompt: {
      es: "¿Puede un trigger llamar al ERP por HTTP en mitad del guardado?",
      en: "Can a trigger call the ERP over HTTP in the middle of the save?",
    },
    options: [
      { es: "No: el callout tiene que ir en código asíncrono", en: "No: the callout has to go in async code" },
      { es: "Sí, en after insert", en: "Yes, in after insert" },
      { es: "Sí, si el lote es pequeño", en: "Yes, if the batch is small" },
    ],
    answer: 0,
    explain: {
      es: "El guardado no puede quedarse esperando a otro sistema. Hoy aprendes la forma más sencilla de sacarlo fuera: @future.",
      en: "The save cannot sit waiting for another system. Today you learn the simplest way to move it out: @future.",
    },
  },
  title: { es: "@future", en: "@future" },
  summary: {
    es: "La forma más sencilla de asíncrono: una anotación encima de un método static void. Se ejecuta después, en su propia transacción, y con callout=true puede llamar a otros sistemas.",
    en: "The simplest form of async: an annotation on top of a static void method. It runs afterwards, in its own transaction, and with callout=true it can call other systems.",
  },
  analogy: {
    es: "Una acción en el camino asíncrono de un flow",
    en: "An action on a flow's asynchronous path",
  },
  objectives: [
    { es: "Escribir un método @future con sus tres reglas: static, void y parámetros simples.", en: "Write an @future method with its three rules: static, void and simple parameters." },
    { es: "Explicar por qué se le pasan Ids y no registros.", en: "Explain why it receives Ids and not records." },
    { es: "Llamar a @future una vez por lote, no una vez por registro.", en: "Call @future once per batch, not once per record." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Cada renovación nueva que se crea en Salesforce tiene que llegar al ERP. El primer intento del equipo fue llamar al ERP desde el trigger, y Salesforce lo rechazó con «Callout from triggers are currently not supported». La solución más corta es una palabra: @future.",
        en: "Every new renewal created in Salesforce has to reach the ERP. The team's first attempt was calling the ERP from the trigger, and Salesforce rejected it with «Callout from triggers are currently not supported». The shortest fix is one word: @future.",
      },
    },
    {
      type: "h",
      text: { es: "Una anotación y tres reglas", en: "One annotation and three rules" },
    },
    {
      type: "code",
      code: {
        es: `public class ErpNotifier {
    @future(callout=true)                      // sin callout=true, no puede llamar fuera
    public static void notifyRenewals(Set<Id> renewalIds) {
        // … se ejecuta más tarde, en su propia transacción
    }
}`,
        en: `public class ErpNotifier {
    @future(callout=true)                      // without callout=true, it cannot call out
    public static void notifyRenewals(Set<Id> renewalIds) {
        // … runs later, in its own transaction
    }
}`,
      },
    },
    {
      type: "list",
      items: [
        {
          es: "static: no pertenece a ningún objeto, porque cuando se ejecute, el objeto que lo llamó ya no existirá.",
          en: "static: it belongs to no object, because by the time it runs, the object that called it will no longer exist.",
        },
        {
          es: "void: no devuelve nada, porque quien lo llamó ya terminó y no puede esperar la respuesta.",
          en: "void: it returns nothing, because its caller has already finished and cannot wait for the answer.",
        },
        {
          es: "Parámetros simples: tipos primitivos (Id, String, Integer…) o colecciones de ellos. Nunca sObjects.",
          en: "Simple parameters: primitive types (Id, String, Integer…) or collections of them. Never sObjects.",
        },
      ],
    },
    {
      type: "diagram",
      id: "m09-future",
      caption: {
        es: "Guarda un lote de renovaciones y sigue el @future: del trigger a la cola, y de la cola al ERP.",
        en: "Save a batch of renewals and follow the @future: from the trigger to the queue, and from the queue to the ERP.",
      },
    },
    {
      type: "h",
      text: { es: "Por qué Ids y no registros", en: "Why Ids and not records" },
    },
    {
      type: "p",
      text: {
        es: "Entre la llamada y la ejecución pasan segundos, a veces minutos. Si le pasaras la oportunidad entera, trabajaría con una foto vieja: alguien pudo cambiar el importe mientras tanto. Por eso Salesforce solo acepta Ids y valores simples, y el método consulta los registros al empezar. Así el ERP recibe los datos como están cuando se envían.",
        en: "Seconds, sometimes minutes, pass between the call and the run. If you passed the whole opportunity, it would work with an old snapshot: someone may have changed the amount in the meantime. That is why Salesforce only accepts Ids and simple values, and the method queries the records when it starts. That way the ERP gets the data as it is when it is sent.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Una llamada por lote, no por registro", en: "One call per batch, not per record" },
      text: {
        es: "Cada transacción admite como mucho 50 llamadas a métodos @future. Si el trigger llama a notifyRenewals dentro del for, una carga de 200 revienta en la llamada 51. Junta los Ids en un Set y llama una sola vez. Y un @future no puede llamar a otro @future: para encadenar pasos está el Queueable de la lección 3.",
        en: "Each transaction allows at most 50 calls to @future methods. If the trigger calls notifyRenewals inside the for, a load of 200 blows up at call 51. Gather the Ids in a Set and call once. And an @future cannot call another @future: for chaining steps there is lesson 3's Queueable.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Aquí Flow también llega", en: "Why not a Flow? Here Flow gets there too" },
      text: {
        es: "Con franqueza: una acción HTTP Callout en el camino asíncrono de un flow desencadenado por registro también avisaría al ERP. Lo que no te da es control sobre el lote: cada interview trabaja con un solo registro, $Record, así que montar una única petición con las 200 renovaciones de la carga no está a su alcance. El ERP de Northwind limita las peticiones por minuto y pide recibirlas juntas, y eso es exactamente lo que hace un @future que recibe el Set completo.",
        en: "Frankly: an HTTP Callout action on a record-triggered flow's async path would also notify the ERP. What it does not give you is control over the batch: each interview works with a single record, $Record, so building one request with the load's 200 renewals is out of its reach. Northwind's ERP limits requests per minute and asks to receive them together, and that is exactly what an @future receiving the full Set does.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿cuáles son las tres reglas de un método @future? ¿Por qué no se le puede pasar una List<Opportunity>? ¿Cuántas llamadas @future admite una transacción?",
        en: "Without looking: what are the three rules of an @future method? Why can it not receive a List<Opportunity>? How many @future calls does a transaction allow?",
      },
    },
  ],

  quiz: [
    {
      id: "m09-l02-q1",
      kind: "single",
      prompt: { es: "¿Qué firma es válida para un método @future?", en: "Which signature is valid for an @future method?" },
      options: [
        { es: "public static void send(Set<Id> ids)", en: "public static void send(Set<Id> ids)" },
        { es: "public static Boolean send(Set<Id> ids)", en: "public static Boolean send(Set<Id> ids)" },
        { es: "public void send(Set<Id> ids)", en: "public void send(Set<Id> ids)" },
        { es: "public static void send(List<Opportunity> opps)", en: "public static void send(List<Opportunity> opps)" },
      ],
      answer: 0,
      explain: {
        es: "static, void y parámetros simples. Devolver algo, no ser static o recibir sObjects no compila.",
        en: "static, void and simple parameters. Returning something, not being static or receiving sObjects does not compile.",
      },
      tags: ["find-error"],
    },
    {
      id: "m09-l02-q2",
      kind: "single",
      prompt: { es: "¿Por qué un @future recibe Ids y no registros?", en: "Why does an @future receive Ids and not records?" },
      options: [
        {
          es: "Porque se ejecuta más tarde y los registros podrían haber cambiado: los consulta al empezar",
          en: "Because it runs later and the records may have changed: it queries them when it starts",
        },
        { es: "Porque los Ids ocupan menos", en: "Because Ids take less space" },
        { es: "Porque los sObjects no existen en asíncrono", en: "Because sObjects do not exist in async" },
        { es: "Es una convención, pero funcionaría igual", en: "It is a convention, but it would work anyway" },
      ],
      answer: 0,
      explain: {
        es: "Es una regla del compilador, no una convención, y su razón es la foto vieja: consultar al empezar da datos frescos.",
        en: "It is a compiler rule, not a convention, and its reason is the old snapshot: querying at the start gives fresh data.",
      },
    },
    {
      id: "m09-l02-q3",
      kind: "single",
      prompt: {
        es: "El trigger llama a ErpNotifier.notifyRenewals(new Set<Id>{ o.Id }) dentro del for. ¿Qué pasa con una carga de 200 renovaciones?",
        en: "The trigger calls ErpNotifier.notifyRenewals(new Set<Id>{ o.Id }) inside the for. What happens with a load of 200 renewals?",
      },
      options: [
        { es: "Revienta en la llamada 51: el máximo es 50 por transacción", en: "It blows up at call 51: the maximum is 50 per transaction" },
        { es: "Funciona: son asíncronas", en: "It works: they are asynchronous" },
        { es: "Se agrupan solas en una", en: "They merge into one on their own" },
        { es: "Se ejecutan 200, pero más despacio", en: "200 run, but more slowly" },
      ],
      answer: 0,
      explain: {
        es: "Es el «nada dentro del bucle» de siempre, con otro límite: 50 llamadas @future. Junta los Ids y llama una vez.",
        en: "It is the usual «nothing inside the loop», with another limit: 50 @future calls. Gather the Ids and call once.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m09-l02-q4",
      kind: "text",
      prompt: {
        es: "Escribe la anotación que permite a un método asíncrono llamar a un sistema externo.",
        en: "Write the annotation that lets an async method call an external system.",
      },
      accept: ["@future\\s*\\(\\s*callout\\s*=\\s*true\\s*\\)"],
      placeholder: { es: "@…", en: "@…" },
      explain: {
        es: "@future(callout=true). Sin callout=true, el método es asíncrono pero no puede salir de Salesforce.",
        en: "@future(callout=true). Without callout=true, the method is async but cannot leave Salesforce.",
      },
      tags: ["recall"],
    },
    {
      id: "m09-l02-q5",
      kind: "multi",
      prompt: { es: "¿Qué es cierto sobre @future?", en: "What is true about @future?" },
      options: [
        { es: "Se ejecuta en su propia transacción, con límites asíncronos", en: "It runs in its own transaction, with async limits" },
        { es: "Un @future no puede llamar a otro @future", en: "An @future cannot call another @future" },
        { es: "Puedes saber cuándo termina y con qué resultado desde el código que lo llamó", en: "You can know when it finishes and with what result from the calling code" },
        { es: "Se ejecuta en el mismo orden garantizado en que se llamó", en: "It runs in the same guaranteed order it was called" },
      ],
      answers: [0, 1],
      explain: {
        es: "Quien lo llama no recibe nada: ni resultado ni Id de trabajo. Y el orden entre varios @future no está garantizado. Para eso existe Queueable.",
        en: "Its caller receives nothing: neither a result nor a job Id. And the order among several @future calls is not guaranteed. That is what Queueable is for.",
      },
    },
    {
      id: "m09-l02-q6",
      kind: "single",
      prompt: {
        es: "Repaso: en la arquitectura del Módulo 7, ¿dónde va la llamada a ErpNotifier?",
        en: "Review: in Module 7's architecture, where does the call to ErpNotifier go?",
      },
      options: [
        { es: "En el handler, en su método afterInsert", en: "In the handler, in its afterInsert method" },
        { es: "Directamente en el trigger", en: "Directly in the trigger" },
        { es: "En un before insert", en: "In a before insert" },
        { es: "En la guardia static", en: "In the static guard" },
      ],
      answer: 0,
      explain: {
        es: "El trigger solo decide el evento; el handler reparte el trabajo. Y after, porque en before los registros aún no tienen Id.",
        en: "The trigger only picks the event; the handler hands out the work. And after, because in before the records have no Id yet.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M7 L2", en: "Review · M7 L2" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 2 DE 7 · El ERP necesita saber de cada renovación nueva, pero el trigger no puede llamarle en mitad del guardado. La clase ErpNotifier ya tiene el código de la llamada; conviértela en un método @future que se pueda llamar una sola vez por lote.",
      en: "TASK 2 OF 7 · The ERP needs to know about every new renewal, but the trigger cannot call it in the middle of the save. The ErpNotifier class already has the call's code; turn it into an @future method that can be called once per batch.",
    },
    brief: [
      {
        es: "Anota notifyRenewals con @future(callout=true).",
        en: "Annotate notifyRenewals with @future(callout=true).",
      },
      {
        es: "Cambia el parámetro: en vez de List<Opportunity>, recibe Set<Id> renewalIds.",
        en: "Change the parameter: instead of List<Opportunity>, it receives Set<Id> renewalIds.",
      },
      {
        es: "Al empezar, consulta las oportunidades con WHERE Id IN :renewalIds (Name, Amount y Account.ERP_Code__c) y envía esa lista.",
        en: "At the start, query the opportunities with WHERE Id IN :renewalIds (Name, Amount and Account.ERP_Code__c) and send that list.",
      },
      {
        es: "El método sigue siendo public static void.",
        en: "The method is still public static void.",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, a escala
// Ya resuelto (tarea 1): cada pieza sabe si corre en síncrono o en asíncrono.
// Tarea 2 de 7: avisar al ERP de las renovaciones nuevas, sin hacer esperar al trigger.

public class ErpNotifier {
    public static void notifyRenewals(List<Opportunity> renewals) {
${CALLOUT_BODY}
    }
}
`,
      en: `// CASE: the ERP bridge, at scale
// Already solved (task 1): every piece knows whether it runs sync or async.
// Task 2 of 7: notify the ERP of new renewals, without making the trigger wait.

public class ErpNotifier {
    public static void notifyRenewals(List<Opportunity> renewals) {
${CALLOUT_BODY.replace("// Named Credential (Módulo 11)", "// Named Credential (Module 11)")}
    }
}
`,
    },
    hints: [
      {
        es: "Yo lo pensaría como mover una acción al camino asíncrono de un flow: la acción es la misma, lo que cambia es cuándo corre y qué datos puede recibir.",
        en: "I would think of it as moving an action to a flow's async path: the action is the same, what changes is when it runs and what data it can receive.",
      },
      {
        es: "Lo que me ayudó: @future no acepta sObjects, así que el método recibe un Set<Id> y consulta las oportunidades él mismo al empezar. Y para llamar fuera necesita callout=true.",
        en: "What helped me: @future does not accept sObjects, so the method receives a Set<Id> and queries the opportunities itself at the start. And to call out it needs callout=true.",
      },
      {
        es: "Te dejo el esquema: @future(callout=true) public static void notifyRenewals(Set<Id> renewalIds) { List<Opportunity> renewals = [SELECT Id, Name, Amount, Account.ERP_Code__c FROM Opportunity WHERE Id IN :renewalIds]; … el código de la llamada … }",
        en: "Here is the outline: @future(callout=true) public static void notifyRenewals(Set<Id> renewalIds) { List<Opportunity> renewals = [SELECT Id, Name, Amount, Account.ERP_Code__c FROM Opportunity WHERE Id IN :renewalIds]; … the call's code … }",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m09-l02-c1",
        label: { es: "Anotado con @future(callout=true)", en: "Annotated with @future(callout=true)" },
        rule: { op: "match", pattern: "@future\\s*\\(\\s*callout\\s*=\\s*true\\s*\\)\\s*public\\s+static\\s+void\\s+notifyRenewals" },
        onFail: {
          es: "Justo encima del método: @future(callout=true), y el método sigue siendo public static void.",
          en: "Right above the method: @future(callout=true), and the method stays public static void.",
        },
        otter: {
          es: "Es el camino asíncrono del flow, en una línea: @future(callout=true) encima de public static void notifyRenewals. Sin callout=true, se ejecutaría después pero no podría llamar al ERP.",
          en: "It is the flow's async path, in one line: @future(callout=true) above public static void notifyRenewals. Without callout=true, it would run later but could not call the ERP.",
        },
      },
      {
        id: "m09-l02-c2",
        label: { es: "Recibe Ids, no registros", en: "It receives Ids, not records" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "notifyRenewals\\s*\\(\\s*(Set|List)\\s*<\\s*Id\\s*>\\s+\\w+\\s*\\)" },
            { op: "absent", pattern: "notifyRenewals\\s*\\(\\s*List\\s*<\\s*Opportunity\\s*>" },
          ],
        },
        onFail: {
          es: "Cambia el parámetro a Set<Id> renewalIds: un @future no acepta sObjects.",
          en: "Change the parameter to Set<Id> renewalIds: an @future does not accept sObjects.",
        },
        otter: {
          es: "Un @future no puede recibir oportunidades: cuando se ejecute, serían una foto vieja. Recibe Set<Id> renewalIds y los datos se piden frescos dentro.",
          en: "An @future cannot receive opportunities: by the time it runs they would be an old snapshot. It receives Set<Id> renewalIds and the data is fetched fresh inside.",
        },
      },
      {
        id: "m09-l02-c3",
        label: { es: "Consulta los registros al empezar", en: "It queries the records at the start" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "FROM\\s+Opportunity\\s+WHERE\\s+Id\\s+IN\\s*:\\s*\\w+" },
            { op: "match", pattern: "SELECT[^\\]]*Account\\s*\\.\\s*ERP_Code__c" },
            { op: "count", pattern: "\\[\\s*SELECT\\b", max: 1 },
          ],
        },
        onFail: {
          es: "Dentro del método: [SELECT Id, Name, Amount, Account.ERP_Code__c FROM Opportunity WHERE Id IN :renewalIds], una sola consulta.",
          en: "Inside the method: [SELECT Id, Name, Amount, Account.ERP_Code__c FROM Opportunity WHERE Id IN :renewalIds], one single query.",
        },
        otter: {
          es: "Con los Ids en la mano, una sola consulta te da las renovaciones como están ahora: WHERE Id IN :renewalIds, con Account.ERP_Code__c para que el ERP sepa de qué cliente es cada una.",
          en: "With the Ids in hand, one single query gives you the renewals as they are now: WHERE Id IN :renewalIds, with Account.ERP_Code__c so the ERP knows each one's customer.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué pasa si una renovación se borra entre el guardado y la ejecución del @future? ¿La consulta falla o simplemente no la trae?",
        en: "What happens if a renewal is deleted between the save and the @future run? Does the query fail or does it simply not bring it?",
      },
    ],
    voice: "otter",
    outro: {
      es: "El ERP ya se entera de cada renovación sin que nadie espere. Pero @future no sabe encadenar ni te dice cuándo termina. En la tarea 3 empiezas con las 300.000 renovaciones de la migración, trocito a trocito, con Queueable.",
      en: "The ERP now hears about every renewal without anyone waiting. But @future cannot chain and does not tell you when it finishes. In task 3 you start on the migration's 300,000 renewals, bit by bit, with Queueable.",
    },
  },
};
