import type { Challenge } from "@/lib/types";

/* -------------------------------------------------------------------------- */
/* DESAFÍO 1 — Proyecto Intermedio (unlocks after Module 7)                    */
/* -------------------------------------------------------------------------- */

export const challenge1: Challenge = {
  id: "c1",
  n: 1,
  requires: "m07",
  warmup: {
    title: { es: "Antes de empezar: ¿te acuerdas?", en: "Before you start: remember?" },
    prompt: { es: "En la arquitectura del Módulo 7, ¿dónde vive la regla de negocio?", en: "In Module 7's architecture, where does the business rule live?" },
    options: [
      { es: "En el trigger", en: "In the trigger" },
      { es: "En una clase de servicio a la que llama el handler", en: "In a service class the handler calls" },
      { es: "En el handler, junto a las consultas", en: "In the handler, next to the queries" },
    ],
    answer: 1,
    explain: { es: "El trigger decide el cuándo, el handler orquesta y el servicio decide. Este proyecto tiene exactamente esas tres piezas.", en: "The trigger decides the when, the handler orchestrates and the service decides. This project has exactly those three pieces." },
  },
  status: "ready",
  minutes: 90,
  title: {
    es: "Sistema de Asignación Automática de Leads",
    en: "Automatic Lead Assignment System",
  },
  subtitle: {
    es: "Sales Cloud · Trigger + Handler + clase de lógica, bulkificado y a prueba de datos incompletos.",
    en: "Sales Cloud · Trigger + Handler + logic class, bulkified and resilient to incomplete data.",
  },
  scenario: [
    {
      type: "lead",
      text: {
        es: "La empresa recibe Leads de tres fuentes: el formulario web, las ferias y una lista comprada que entra por Data Loader en tandas de 200. Hoy un Admin los reparte a mano cada mañana y los Leads sin dueño claro se quedan días sin tocar.",
        en: "The company receives Leads from three sources: the web form, trade shows, and a purchased list loaded through Data Loader in batches of 200. Today an Admin hands them out every morning, and Leads without a clear owner sit untouched for days.",
      },
    },
    {
      type: "p",
      text: {
        es: "Tu trabajo: automatizar el reparto. Cada Lead debe asignarse a un Sales Rep según su región y su industria, usando una tabla de asignación que ya existe en la org. Si al Lead le falta la región, va al representante por defecto — nunca se queda sin dueño.",
        en: "Your job: automate the hand-off. Each Lead must be assigned to a Sales Rep based on its region and industry, using an assignment table that already exists in the org. If a Lead has no region, it goes to the default rep — it is never left ownerless.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Cómo lo harías con clics", en: "How you would do it with clicks" },
      text: {
        es: "Como Admin, esto yo lo resolvía con las reglas de asignación de leads (Setup → Lead Assignment Rules): entradas por región e industria, evaluadas en orden, y el Default Lead Owner de Lead Settings para lo que no encaja. Aquí lo construyes en código porque la tabla de asignación vive en un objeto personalizado que Ventas mantiene sin tocar Setup, y porque cada pieza que has aprendido tiene su sitio: el trigger es el «cuándo», el handler prepara los datos y el servicio decide el dueño de cada lead.",
        en: "As an Admin I solved this with lead assignment rules (Setup → Lead Assignment Rules): entries by region and industry, evaluated in order, and the Default Lead Owner in Lead Settings for whatever does not fit. Here you build it in code because the assignment table lives in a custom object Sales maintains without touching Setup, and because every piece you have learnt has its place: the trigger is the «when», the handler prepares the data and the service decides each lead's owner.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "La prueba real", en: "The real test" },
      text: {
        es: "La carga de la lista comprada entra en tandas de 200 registros. Si tu código consulta o hace DML dentro de un bucle, la carga falla entera y el Admin se entera por un correo de error a las 7 de la mañana. Bulk-safety no es un extra aquí: es el requisito.",
        en: "The purchased list loads in batches of 200 records. If your code queries or does DML inside a loop, the whole load fails and the Admin finds out through an error email at 7am. Bulk-safety is not a bonus here: it is the requirement.",
      },
    },
    {
      type: "h",
      text: { es: "El modelo de datos", en: "The data model" },
    },
    {
      type: "table",
      head: [
        { es: "Objeto / campo", en: "Object / field" },
        { es: "Para qué se usa", en: "What it is for" },
      ],
      rows: [
        [
          { es: "Lead.Region__c (Text)", en: "Lead.Region__c (Text)" },
          { es: "Región del Lead. Puede venir vacío.", en: "The Lead's region. May arrive empty." },
        ],
        [
          { es: "Lead.Industry (Picklist)", en: "Lead.Industry (Picklist)" },
          { es: "Industria estándar del Lead.", en: "Standard Lead industry." },
        ],
        [
          { es: "Assignment_Rule__c", en: "Assignment_Rule__c" },
          {
            es: "Objeto personalizado con Region__c, Industry__c, Sales_Rep__c (Lookup a User) e Is_Default__c (Checkbox).",
            en: "Custom object with Region__c, Industry__c, Sales_Rep__c (Lookup to User) and Is_Default__c (Checkbox).",
          },
        ],
      ],
    },
  ],
  components: [
    {
      id: "trigger",
      fileName: "LeadAssignmentTrigger.trigger",
      voice: "otter",
      outro: {
        es: "El «cuándo» ya está: un trigger delgado en before insert y before update. Siguiente pieza: el handler, que prepara las reglas con una sola consulta y pasa el trabajo al servicio.",
        en: "The «when» is done: a thin trigger on before insert and before update. Next piece: the handler, which prepares the rules with a single query and hands the work to the service.",
      },
      name: { es: "El Trigger", en: "The Trigger" },
      brief: [
        {
          es: "Un único trigger sobre Lead, en los contextos before insert y before update.",
          en: "A single trigger on Lead, in the before insert and before update contexts.",
        },
        {
          es: "Sin una sola línea de lógica de negocio: delega en el Handler.",
          en: "Not one line of business logic: it delegates to the Handler.",
        },
      ],
      starter: {
        es: `trigger LeadAssignmentTrigger on Lead (/* contextos */) {
    // Delega en el handler. Nada de lógica aquí.
}`,
        en: `trigger LeadAssignmentTrigger on Lead (/* contexts */) {
    // Delegate to the handler. No logic here.
}`,
      },
      hints: [
        {
          es: "Yo empezaría por el «cuándo», como en una regla de asignación: los contextos que declaras entre paréntesis deciden cuándo corre el trigger.",
          en: "I would start with the «when», as in an assignment rule: the contexts you declare in brackets decide when the trigger runs.",
        },
        {
          es: "Lo que me ayudó: asignar OwnerId es cambiar el propio registro que se está guardando, tu Fast Field Updates. El contexto before te lo deja hacer sin un DML extra.",
          en: "What helped me: assigning OwnerId is changing the very record being saved, your Fast Field Updates. The before context lets you do it without an extra DML.",
        },
        {
          es: "Te dejo el esquema: trigger ... on Lead (before insert, before update) { new Handler(...).run(); }, con el handler recibiendo Trigger.new.",
          en: "Here is the outline: trigger ... on Lead (before insert, before update) { new Handler(...).run(); }, with the handler receiving Trigger.new.",
        },
      ],
      checks: [
        {
          id: "c1-t-contexts",
          label: {
            es: "Declara before insert y before update",
            en: "Declares before insert and before update",
          },
          rule: {
            op: "all",
            of: [
              { op: "match", pattern: "trigger\\s+\\w+\\s+on\\s+Lead" },
              { op: "match", pattern: "before\\s+insert" },
              { op: "match", pattern: "before\\s+update" },
            ],
          },
          onFail: {
            es: "El trigger debe correr en before insert y before update sobre Lead. En after no puedes modificar el registro sin un DML adicional.",
            en: "The trigger must run on before insert and before update on Lead. In after context you cannot modify the record without an extra DML.",
          },
          otter: {
            es: "La regla de asignación se aplica al crear y al editar, y cambia el propio lead: before insert y before update. En after no podrías cambiar el OwnerId sin un DML extra.",
            en: "The assignment rule applies on create and on edit, and it changes the lead itself: before insert and before update. In after you could not change OwnerId without an extra DML.",
          },
        },
        {
          id: "c1-t-delegates",
          label: { es: "Delega en el handler", en: "Delegates to the handler" },
          rule: { op: "match", pattern: "LeadAssignmentHandler" },
          onFail: {
            es: "El trigger debe llamar a LeadAssignmentHandler. Si la lógica vive en el trigger, no puedes testearla ni reutilizarla.",
            en: "The trigger must call LeadAssignmentHandler. Logic living in the trigger cannot be tested or reused.",
          },
          otter: {
            es: "El trigger es el Start: solo llama a LeadAssignmentHandler. Si la lógica vive en el trigger, no puedes testearla ni reutilizarla.",
            en: "The trigger is the Start: it only calls LeadAssignmentHandler. If the logic lives in the trigger, you can neither test it nor reuse it.",
          },
        },
        {
          id: "c1-t-nologic",
          label: { es: "Sin lógica en el trigger", en: "No logic in the trigger" },
          rule: {
            op: "all",
            of: [
              { op: "absent", pattern: "\\[\\s*select" },
              { op: "absent", pattern: "\\bfor\\s*\\(" },
              { op: "absent", pattern: "\\b(insert|update|upsert)\\s+[A-Za-z_]" },
            ],
          },
          onFail: {
            es: "Hay SOQL, un bucle o DML dentro del trigger. El trigger es un enrutador de tres líneas; todo lo demás va al handler.",
            en: "There is SOQL, a loop or DML inside the trigger. The trigger is a three-line router; everything else belongs in the handler.",
          },
          otter: {
            es: "Hay una consulta, un bucle o un DML dentro del trigger: eso es el lienzo, y va en el handler. El trigger es un enrutador de tres líneas.",
            en: "There is a query, a loop or a DML inside the trigger: that is the canvas, and it goes in the handler. The trigger is a three-line router.",
          },
        },
      ],
    },
    {
      id: "handler",
      fileName: "LeadAssignmentHandler.cls",
      voice: "otter",
      outro: {
        es: "El handler ya orquesta: una consulta para todas las reglas y ninguna decisión propia. Siguiente pieza: el servicio, que encuentra el dueño de cada lead, también cuando falta la región.",
        en: "The handler now orchestrates: one query for every rule and no decision of its own. Next piece: the service, which finds each lead's owner, even when the region is missing.",
      },
      name: { es: "El Handler", en: "The Handler" },
      brief: [
        {
          es: "Recibe la lista de Leads del contexto y orquesta: prepara los datos y llama a la clase de lógica.",
          en: "Receives the context list of Leads and orchestrates: prepares data and calls the logic class.",
        },
        {
          es: "Una sola consulta SOQL para todas las reglas de asignación, fuera de cualquier bucle.",
          en: "A single SOQL query for all assignment rules, outside any loop.",
        },
      ],
      starter: {
        es: `public with sharing class LeadAssignmentHandler {

    private List<Lead> leads;

    public LeadAssignmentHandler(List<Lead> leads) {
        // Guarda el contexto recibido
    }

    public void run() {
        // 1. Consulta las Assignment_Rule__c una sola vez
        // 2. Pásalas junto a los Leads a LeadAssignmentService
    }
}`,
        en: `public with sharing class LeadAssignmentHandler {

    private List<Lead> leads;

    public LeadAssignmentHandler(List<Lead> leads) {
        // Store the received context
    }

    public void run() {
        // 1. Query Assignment_Rule__c once
        // 2. Hand them, with the Leads, to LeadAssignmentService
    }
}`,
      },
      hints: [
        {
          es: "Yo miraría dónde está la consulta respecto a los bucles, como un Get Records dentro de un Loop: ¿cuántas veces se ejecutaría con 200 leads?",
          en: "I would look at where the query is relative to the loops, like a Get Records inside a Loop: how many times would it run with 200 leads?",
        },
        {
          es: "Lo que me ayudó: aquí una consulta sin WHERE que traiga todas las reglas es correcta, como leer entera la tabla de tu regla de asignación: son pocas filas de configuración y las necesitas todas para construir el índice.",
          en: "What helped me: here a query with no WHERE bringing every rule is right, like reading your assignment rule's whole table: they are few configuration rows and you need them all to build the index.",
        },
        {
          es: "Te dejo el esquema: List<Assignment_Rule__c> rules = [SELECT ... FROM Assignment_Rule__c]; luego LeadAssignmentService.assign(this.leads, rules);",
          en: "Here is the outline: List<Assignment_Rule__c> rules = [SELECT ... FROM Assignment_Rule__c]; then LeadAssignmentService.assign(this.leads, rules);",
        },
      ],
      checks: [
        {
          id: "c1-h-query-once",
          label: { es: "Una consulta, fuera de bucles", en: "One query, outside loops" },
          rule: {
            op: "all",
            of: [
              { op: "count", pattern: "\\[\\s*select", min: 1, max: 1 },
              { op: "absent", pattern: "for\\s*\\([^)]*\\)\\s*\\{[^}]*\\[\\s*select" },
            ],
          },
          onFail: {
            es: "Necesitas exactamente una consulta SOQL y tiene que estar fuera de cualquier bucle. Con 200 Leads, una consulta dentro del bucle son 200 consultas contra un límite de 100.",
            en: "You need exactly one SOQL query and it must sit outside every loop. With 200 Leads, a query inside the loop is 200 queries against a limit of 100.",
          },
          otter: {
            es: "Un solo Get Records para todas las reglas, fuera de cualquier bucle. Con 200 leads, una consulta dentro del bucle son 200 consultas contra un límite de 100.",
            en: "A single Get Records for every rule, outside any loop. With 200 leads, a query inside the loop is 200 queries against a limit of 100.",
          },
          onPass: {
            es: "Consultas una vez y trabajas en memoria: ese es el patrón que sostiene una carga de 200 registros.",
            en: "You query once and work in memory: that is the pattern that survives a 200-record load.",
          },
        },
        {
          id: "c1-h-delegates",
          label: { es: "Llama a la clase de lógica", en: "Calls the logic class" },
          rule: { op: "match", pattern: "LeadAssignmentService" },
          onFail: {
            es: "El handler orquesta, no decide. La regla de qué rep recibe qué Lead vive en LeadAssignmentService.",
            en: "The handler orchestrates, it does not decide. The rule of which rep gets which Lead lives in LeadAssignmentService.",
          },
          otter: {
            es: "El handler es el lienzo que orquesta, no el que decide: la regla de qué comercial recibe qué lead vive en LeadAssignmentService, tu subflow.",
            en: "The handler is the canvas that orchestrates, not the one that decides: the rule for which rep gets which lead lives in LeadAssignmentService, your subflow.",
          },
        },
        {
          id: "c1-h-no-dml",
          label: { es: "Sin DML innecesario", en: "No unnecessary DML" },
          rule: { op: "absent", pattern: "\\b(insert|update|upsert)\\s+[A-Za-z_]" },
          onFail: {
            es: "Estás en contexto before: modificar el registro en memoria basta y Salesforce lo guarda. Un update aquí es un DML extra y, sobre el mismo objeto, recursión.",
            en: "You are in a before context: changing the record in memory is enough and Salesforce saves it. An update here is an extra DML and, on the same object, recursion.",
          },
          otter: {
            es: "Estás en before, tu Fast Field Updates: cambiar el lead en memoria basta y Salesforce lo guarda. Un update aquí es un DML extra y, sobre el mismo objeto, recursión.",
            en: "You are in before, your Fast Field Updates: changing the lead in memory is enough and Salesforce saves it. An update here is an extra DML and, on the same object, recursion.",
          },
        },
      ],
    },
    {
      id: "service",
      fileName: "LeadAssignmentService.cls",
      voice: "otter",
      outro: {
        es: "Y el servicio decide, sin que ningún lead se quede sin dueño. Cuando las tres piezas estén en verde, habrás construido tu propia regla de asignación de leads, a prueba de cargas de 200. ¡Eso es un proyecto de developer de verdad!",
        en: "And the service decides, with no lead left ownerless. Once all three pieces are green, you will have built your own lead assignment rule, able to take loads of 200. That is a real developer project!",
      },
      name: { es: "La clase de lógica", en: "The logic class" },
      brief: [
        {
          es: "Indexa las reglas en un Map por región+industria y asigna el OwnerId de cada Lead.",
          en: "Indexes the rules into a Map keyed by region+industry and sets each Lead's OwnerId.",
        },
        {
          es: "Un Lead sin región (null o vacío) recibe el representante por defecto.",
          en: "A Lead with no region (null or blank) gets the default rep.",
        },
        {
          es: "Si no hay ninguna regla que encaje, también va al representante por defecto. Ningún Lead se queda sin dueño.",
          en: "If no rule matches, it also goes to the default rep. No Lead is left ownerless.",
        },
      ],
      starter: {
        es: `public with sharing class LeadAssignmentService {

    public static void assign(List<Lead> leads, List<Assignment_Rule__c> rules) {
        // 1. Construye un Map<String, Id> con clave región + industria
        // 2. Localiza el representante por defecto (Is_Default__c)
        // 3. Recorre los Leads y asigna OwnerId
    }
}`,
        en: `public with sharing class LeadAssignmentService {

    public static void assign(List<Lead> leads, List<Assignment_Rule__c> rules) {
        // 1. Build a Map<String, Id> keyed by region + industry
        // 2. Find the default rep (Is_Default__c)
        // 3. Walk the Leads and set OwnerId
    }
}`,
      },
      hints: [
        {
          es: "Yo pensaría en el lead que llega sin región antes de construir la clave del Map: ¿qué clave saldría?",
          en: "I would think about the lead that arrives with no region before building the Map key: what key would come out?",
        },
        {
          es: "Lo que me ayudó: String.isBlank() cubre null y vacío de una vez, tu ISBLANK(). Y Map.get() devuelve null cuando la clave no existe, como un BUSCARV sin coincidencia, así que el resultado también hay que comprobarlo.",
          en: "What helped me: String.isBlank() covers null and empty at once, your ISBLANK(). And Map.get() returns null when the key does not exist, like a VLOOKUP with no match, so the result must be checked too.",
        },
        {
          es: "Te dejo el esquema: for (Lead l : leads) { String key = String.isBlank(l.Region__c) ? null : l.Region__c + '|' + l.Industry; Id rep = key == null ? null : ruleMap.get(key); l.OwnerId = rep != null ? rep : defaultRepId; }",
          en: "Here is the outline: for (Lead l : leads) { String key = String.isBlank(l.Region__c) ? null : l.Region__c + '|' + l.Industry; Id rep = key == null ? null : ruleMap.get(key); l.OwnerId = rep != null ? rep : defaultRepId; }",
        },
      ],
      checks: [
        {
          id: "c1-s-map",
          label: { es: "Indexa las reglas en un Map", en: "Indexes the rules into a Map" },
          rule: { op: "match", pattern: "Map\\s*<" },
          onFail: {
            es: "Sin un Map acabas recorriendo la lista de reglas dentro del bucle de Leads: 200 × N comparaciones y un método imposible de leer.",
            en: "Without a Map you end up scanning the rule list inside the Lead loop: 200 × N comparisons and a method nobody can read.",
          },
          otter: {
            es: "Indexa las reglas en un Map, tu BUSCARV por región e industria. Sin él acabas recorriendo todas las reglas para cada lead: 200 × N comparaciones y un método imposible de leer.",
            en: "Index the rules in a Map, your VLOOKUP by region and industry. Without it you end up walking every rule for each lead: 200 × N comparisons and a method nobody can read.",
          },
        },
        {
          id: "c1-s-null",
          label: { es: "Maneja la región ausente", en: "Handles the missing region" },
          rule: {
            op: "any",
            of: [
              { op: "match", pattern: "String\\.isBlank\\s*\\(" },
              { op: "match", pattern: "String\\.isEmpty\\s*\\(" },
              { op: "match", pattern: "Region__c\\s*==\\s*null" },
            ],
          },
          onFail: {
            es: "Un Lead sin región debe acabar en el representante por defecto. Ahora mismo construirías una clave con 'null' dentro y no encontrarías nada.",
            en: "A Lead with no region must land on the default rep. As written you would build a key containing 'null' and match nothing.",
          },
          otter: {
            es: "El lead sin región tiene que acabar en el representante por defecto, como el Default Lead Owner cuando ninguna entrada de la regla encaja. Ahora mismo construirías una clave con 'null' dentro y no encontrarías nada.",
            en: "The lead with no region has to end up with the default rep, like the Default Lead Owner when no rule entry fits. Right now you would build a key with 'null' inside and find nothing.",
          },
          onPass: {
            es: "Compruebas el dato ausente antes de usarlo: la diferencia entre un trigger que aguanta una carga real y uno que la tumba.",
            en: "You check the missing value before using it: the difference between a trigger that survives a real load and one that kills it.",
          },
        },
        {
          id: "c1-s-default",
          label: { es: "Aplica el representante por defecto", en: "Applies the default rep" },
          rule: {
            op: "all",
            of: [
              { op: "match", pattern: "Is_Default__c" },
              { op: "match", pattern: "OwnerId\\s*=" },
            ],
          },
          onFail: {
            es: "Falta el camino por defecto: localiza la regla con Is_Default__c = true y úsala cuando no haya coincidencia.",
            en: "The default path is missing: find the rule with Is_Default__c = true and use it when nothing matches.",
          },
          otter: {
            es: "Falta tu Default Lead Owner: localiza la regla con Is_Default__c = true y úsala cuando no haya coincidencia. Ningún lead se queda sin dueño.",
            en: "Your Default Lead Owner is missing: find the rule with Is_Default__c = true and use it when there is no match. No lead is left ownerless.",
          },
        },
        {
          id: "c1-s-bulk",
          label: { es: "Sin SOQL ni DML en bucles", en: "No SOQL or DML in loops" },
          rule: {
            op: "all",
            of: [
              { op: "absent", pattern: "for\\s*\\([^)]*\\)\\s*\\{[^}]*\\[\\s*select" },
              {
                op: "absent",
                pattern: "for\\s*\\([^)]*\\)\\s*\\{[^}]*\\b(insert|update|upsert)\\s+[A-Za-z_]",
              },
            ],
          },
          onFail: {
            es: "Hay una consulta o un DML dentro de un bucle. Con la carga de 200 registros esto revienta por governor limits.",
            en: "There is a query or a DML inside a loop. With the 200-record load this blows up on governor limits.",
          },
          otter: {
            es: "Hay un Get Records o un Update Records dentro de un Loop. Con la carga de 200 registros de Data Loader, esto revienta por governor limits.",
            en: "There is a Get Records or an Update Records inside a Loop. With Data Loader's 200-record load, this blows up on governor limits.",
          },
        },
        {
          id: "c1-s-loop",
          label: { es: "Recorre la colección recibida", en: "Iterates the received collection" },
          rule: { op: "match", pattern: "for\\s*\\(\\s*Lead\\s+\\w+\\s*:" },
          onFail: {
            es: "Trabaja sobre la lista completa, no sobre leads[0]. El código tiene que dar el mismo resultado con 1 Lead y con 200.",
            en: "Work on the whole list, not on leads[0]. The code must behave the same with 1 Lead and with 200.",
          },
          otter: {
            es: "Trabaja sobre la lista completa, no sobre leads[0]: una regla de asignación se aplica a todos los leads de la carga, sean 1 o 200.",
            en: "Work on the whole list, not on leads[0]: an assignment rule applies to every lead in the load, whether 1 or 200.",
          },
        },
      ],
    },
  ],
  rubric: [
    {
      es: "¿Se lee la intención del código sin ejecutarlo? Un nombre como ruleMapByRegionAndIndustry ahorra un comentario.",
      en: "Can the intent be read without running it? A name like ruleMapByRegionAndIndustry saves a comment.",
    },
    {
      es: "¿Qué pasaría si mañana añaden una tercera dimensión (por ejemplo, tamaño de cuenta) a la regla de asignación?",
      en: "What would happen if a third dimension (say, account size) were added to the assignment rule tomorrow?",
    },
    {
      es: "¿Podrías escribir un test que cubra el camino feliz y el Lead sin región sin tocar la clase de servicio?",
      en: "Could you write a test covering the happy path and the region-less Lead without touching the service class?",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* DESAFÍO 2 — Proyecto Final (unlocks after Module 12)                        */
/* -------------------------------------------------------------------------- */

export const challenge2: Challenge = {
  id: "c2",
  n: 2,
  requires: "m12",
  warmup: {
    title: { es: "Antes de empezar: ¿te acuerdas?", en: "Before you start: remember?" },
    prompt: { es: "¿Qué significa que tu código sea «bulk-safe»?", en: "What does it mean for your code to be «bulk-safe»?" },
    options: [
      { es: "Que usa Database.insert(lista, false)", en: "That it uses Database.insert(list, false)" },
      { es: "Que sus consultas y DML no crecen con el número de registros", en: "That its queries and DML do not grow with the number of records" },
      { es: "Que solo procesa 200 registros", en: "That it only processes 200 records" },
    ],
    answer: 1,
    explain: { es: "Nada de consultas ni DML dentro de bucles. En este proyecto lo aplicarás también a un Batch que procesa millones de registros, lote a lote.", en: "No queries or DML inside loops. In this project you will also apply it to a Batch that processes millions of records, batch by batch." },
  },
  status: "ready",
  minutes: 150,
  title: {
    es: "Suite de Automatización de Operaciones de Ventas",
    en: "Sales Operations Automation Suite",
  },
  subtitle: {
    es: "Trigger handler con excepciones propias, Batch de re-scoring, callout asíncrono, tests reales y seguridad aplicada.",
    en: "Trigger handler with custom exceptions, re-scoring Batch, async callout, real tests and enforced security.",
  },
  scenario: [
    {
      type: "lead",
      text: {
        es: "Operaciones de Ventas quiere cerrar el círculo: que las Opportunities se puntúen solas cada noche, que el CRM avise a un sistema externo cuando una oportunidad grande cambia de fase, y que nada de esto se salte los permisos del usuario que lo dispara.",
        en: "Sales Operations wants to close the loop: Opportunities scored automatically every night, the CRM notifying an external system when a large opportunity changes stage, and none of it bypassing the permissions of the user who triggered it.",
      },
    },
    {
      type: "p",
      text: {
        es: "Este desafío junta todo el curso en una sola entrega: los cuatro componentes se evalúan por separado, pero la retroalimentación mira el conjunto — si el Batch es eficiente pero el test no comprueba nada, no está terminado.",
        en: "This challenge pulls the whole course into one deliverable: the four components are validated separately, but the feedback looks at the whole — an efficient Batch with a test that asserts nothing is not finished.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Cómo lo harías con clics", en: "How you would do it with clicks" },
      text: {
        es: "Con clics lo habrías repartido en varias herramientas: una regla de validación con PRIORVALUE(StageName) para frenar los saltos de fase, un Scheduled Flow nocturno para puntuar las oportunidades, una acción HTTP Callout en un flow para avisar al sistema externo y la Field-Level Security para que nadie escriba donde no debe. Aquí cada una de esas piezas es un componente, y te acompaño en todos: la excepción es tu mensaje de validación, el Batch es tu Scheduled Flow capaz de procesar millones de registros, el callout asíncrono es tu HTTP Callout y el test es la prueba que Salesforce exige antes de dejarte desplegar.",
        en: "With clicks you would have spread it across several tools: a validation rule with PRIORVALUE(StageName) to stop stage jumps, a nightly Scheduled Flow to score the opportunities, an HTTP Callout action in a flow to notify the external system and Field-Level Security so nobody writes where they should not. Here each of those pieces is a component, and I will be with you in all of them: the exception is your validation message, the Batch is your Scheduled Flow able to handle millions of records, the asynchronous callout is your HTTP Callout and the test is the proof Salesforce demands before letting you deploy.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Seguridad aplicada, no comentada", en: "Security enforced, not commented" },
      text: {
        es: "Un comentario que dice «aquí habría que comprobar FLS» no cuenta. La validación busca comprobaciones reales antes del DML: isAccessible(), isUpdateable(), stripInaccessible() o USER_MODE.",
        en: "A comment saying \"FLS should be checked here\" does not count. Validation looks for real checks before the DML: isAccessible(), isUpdateable(), stripInaccessible() or USER_MODE.",
      },
    },
  ],
  components: [
    {
      id: "handler",
      fileName: "OpportunityStageHandler.cls",
      voice: "otter",
      outro: {
        es: "Tu validación de fases ya lanza su propia excepción, como el mensaje de una regla de validación. Siguiente pieza: el Batch nocturno que puntúa las oportunidades.",
        en: "Your stage validation now throws its own exception, like a validation rule's message. Next piece: the nightly Batch that scores the opportunities.",
      },
      name: { es: "Handler con excepciones propias", en: "Handler with custom exceptions" },
      brief: [
        {
          es: "Valida la transición de fase y lanza una excepción personalizada cuando es inválida.",
          en: "Validates the stage transition and throws a custom exception when it is invalid.",
        },
        {
          es: "La excepción personalizada extiende Exception, como toda excepción propia en Apex.",
          en: "The custom exception extends Exception, like every custom exception in Apex.",
        },
        {
          es: "Declara with sharing y comprueba permisos antes de cualquier DML.",
          en: "Declares with sharing and checks permissions before any DML.",
        },
      ],
      starter: {
        es: `public with sharing class OpportunityStageHandler {

    // 1. Declara aquí tu excepción personalizada

    public static void validateTransitions(
        List<Opportunity> newOpps,
        Map<Id, Opportunity> oldMap
    ) {
        // 2. Compara la fase nueva con la anterior
        // 3. Lanza la excepción cuando la transición no está permitida
    }
}`,
        en: `public with sharing class OpportunityStageHandler {

    // 1. Declare your custom exception here

    public static void validateTransitions(
        List<Opportunity> newOpps,
        Map<Id, Opportunity> oldMap
    ) {
        // 2. Compare the new stage with the previous one
        // 3. Throw the exception when the transition is not allowed
    }
}`,
      },
      hints: [
        {
          es: "Yo revisaría la declaración de la excepción: en Apex una clase de excepción tiene que cumplir dos condiciones, no una.",
          en: "I would check the exception's declaration: in Apex an exception class has to meet two conditions, not one.",
        },
        {
          es: "Lo que me ayudó: el nombre de una excepción personalizada debe terminar en Exception y la clase debe extender Exception (o una de sus hijas). Si falta cualquiera de las dos, no compila.",
          en: "What helped me: a custom exception's name must end in Exception and the class must extend Exception (or one of its children). If either is missing, it does not compile.",
        },
        {
          es: "Te dejo el esquema: public class StageTransitionException extends Exception {} y dentro del bucle: if (!allowed) throw new StageTransitionException('...');",
          en: "Here is the outline: public class StageTransitionException extends Exception {} and inside the loop: if (!allowed) throw new StageTransitionException('...');",
        },
      ],
      checks: [
        {
          id: "c2-h-exception",
          label: { es: "Excepción personalizada correcta", en: "Correct custom exception" },
          rule: {
            op: "match",
            pattern: "class\\s+\\w*Exception\\s+extends\\s+Exception",
          },
          onFail: {
            es: "La excepción personalizada debe llamarse algo terminado en Exception y extender Exception. Es la única forma que Apex acepta.",
            en: "The custom exception must be named ending in Exception and extend Exception. That is the only form Apex accepts.",
          },
          otter: {
            es: "Tu excepción es el mensaje de error de una regla de validación, pero en código. Tiene que llamarse algo terminado en Exception y extender Exception: es la única forma que Apex acepta.",
            en: "Your exception is a validation rule's error message, but in code. Its name has to end in Exception and it has to extend Exception: it is the only form Apex accepts.",
          },
        },
        {
          id: "c2-h-throw",
          label: { es: "La lanza cuando corresponde", en: "Throws it when appropriate" },
          rule: { op: "match", pattern: "throw\\s+new\\s+\\w*Exception" },
          onFail: {
            es: "Declaras la excepción pero nunca la lanzas: la validación no llega a impedir nada.",
            en: "You declare the exception but never throw it: the validation never actually blocks anything.",
          },
          otter: {
            es: "Declaras la excepción pero nunca la lanzas: es como una regla de validación desactivada. Lánzala con throw cuando la transición no está permitida.",
            en: "You declare the exception but never throw it: it is like a deactivated validation rule. Throw it with throw when the transition is not allowed.",
          },
        },
        {
          id: "c2-h-oldmap",
          label: { es: "Compara con el valor anterior", en: "Compares against the previous value" },
          rule: { op: "match", pattern: "oldMap\\s*\\.\\s*get\\s*\\(" },
          onFail: {
            es: "Para saber si la transición es válida necesitas la fase anterior, y vive en el mapa de valores antiguos.",
            en: "To know whether the transition is valid you need the previous stage, and it lives in the old-values map.",
          },
          otter: {
            es: "Para saber si la transición es válida necesitas la fase anterior, tu PRIORVALUE(StageName): vive en el mapa de valores antiguos, Trigger.oldMap.",
            en: "To know whether the transition is valid you need the previous stage, your PRIORVALUE(StageName): it lives in the map of old values, Trigger.oldMap.",
          },
        },
        {
          id: "c2-h-sharing",
          label: { es: "with sharing declarado", en: "with sharing declared" },
          rule: { op: "match", pattern: "with\\s+sharing\\s+class" },
          onFail: {
            es: "Sin with sharing la clase corre en modo sistema y ve registros que el usuario no debería ver.",
            en: "Without with sharing the class runs in system mode and sees records the user should not.",
          },
          otter: {
            es: "Sin with sharing la clase corre en modo sistema y ve registros que el usuario no debería ver, como un informe que se saltara el sharing.",
            en: "Without with sharing the class runs in system mode and sees records the user should not see, like a report that skipped sharing.",
          },
        },
      ],
    },
    {
      id: "batch",
      fileName: "OpportunityRescoreBatch.cls",
      voice: "otter",
      outro: {
        es: "El Batch ya procesa por lotes, con un solo DML por lote y la FLS comprobada. Siguiente pieza: avisar al sistema externo sin que su caída tumbe la tuya.",
        en: "The Batch now processes in batches, with a single DML per batch and FLS checked. Next piece: notifying the external system without its failure bringing yours down.",
      },
      name: { es: "Batch de re-scoring", en: "Re-scoring Batch" },
      brief: [
        {
          es: "Implementa Database.Batchable<sObject> con start, execute y finish.",
          en: "Implements Database.Batchable<sObject> with start, execute and finish.",
        },
        {
          es: "start devuelve un QueryLocator; execute recalcula la puntuación y hace un único DML por lote.",
          en: "start returns a QueryLocator; execute recalculates the score and does a single DML per batch.",
        },
        {
          es: "Comprueba que el campo de puntuación es actualizable antes de escribir.",
          en: "Checks that the score field is updateable before writing.",
        },
      ],
      starter: {
        es: `public with sharing class OpportunityRescoreBatch
        implements Database.Batchable<sObject> {

    public Database.QueryLocator start(Database.BatchableContext bc) {
        // Devuelve el conjunto de Opportunities a re-puntuar
    }

    public void execute(Database.BatchableContext bc, List<Opportunity> scope) {
        // Recalcula y actualiza — un solo DML por lote
    }

    public void finish(Database.BatchableContext bc) {
        // Cierre del proceso
    }
}`,
        en: `public with sharing class OpportunityRescoreBatch
        implements Database.Batchable<sObject> {

    public Database.QueryLocator start(Database.BatchableContext bc) {
        // Return the set of Opportunities to re-score
    }

    public void execute(Database.BatchableContext bc, List<Opportunity> scope) {
        // Recalculate and update — a single DML per batch
    }

    public void finish(Database.BatchableContext bc) {
        // Process wrap-up
    }
}`,
      },
      hints: [
        {
          es: "Yo miraría dónde está el update dentro de execute respecto al bucle, como un Update Records dentro del Loop.",
          en: "I would look at where the update is inside execute relative to the loop, like an Update Records inside the Loop.",
        },
        {
          es: "Lo que me ayudó: execute recibe un lote, 200 por defecto, como el Batch size de Data Loader. Un DML por registro son 200 DML por lote; acumula en una List y actualiza una vez al final.",
          en: "What helped me: execute receives one batch, 200 by default, like Data Loader's Batch size. One DML per record is 200 DML per batch; collect in a List and update once at the end.",
        },
        {
          es: "Te dejo el esquema: List<Opportunity> toUpdate = new List<Opportunity>(); for (Opportunity o : scope) { o.Score__c = calc(o); toUpdate.add(o); } if (!toUpdate.isEmpty()) update toUpdate;",
          en: "Here is the outline: List<Opportunity> toUpdate = new List<Opportunity>(); for (Opportunity o : scope) { o.Score__c = calc(o); toUpdate.add(o); } if (!toUpdate.isEmpty()) update toUpdate;",
        },
      ],
      checks: [
        {
          id: "c2-b-interface",
          label: { es: "Implementa Database.Batchable", en: "Implements Database.Batchable" },
          rule: {
            op: "all",
            of: [
              { op: "match", pattern: "implements\\s+Database\\.Batchable" },
              { op: "match", pattern: "QueryLocator\\s+start\\s*\\(" },
              { op: "match", pattern: "void\\s+execute\\s*\\(" },
              { op: "match", pattern: "void\\s+finish\\s*\\(" },
            ],
          },
          onFail: {
            es: "Un Batch necesita los tres métodos de la interfaz: start, execute y finish. Falta alguno.",
            en: "A Batch needs all three interface methods: start, execute and finish. One is missing.",
          },
          otter: {
            es: "Un Batch es tu Scheduled Flow para millones de registros, y necesita los tres métodos de la interfaz: start, execute y finish. Falta alguno.",
            en: "A Batch is your Scheduled Flow for millions of records, and it needs the interface's three methods: start, execute and finish. One is missing.",
          },
        },
        {
          id: "c2-b-single-dml",
          label: { es: "Un solo DML por lote", en: "A single DML per batch" },
          rule: {
            op: "absent",
            pattern: "for\\s*\\([^)]*\\)\\s*\\{[^}]*\\bupdate\\s+[A-Za-z_]",
          },
          onFail: {
            es: "El update está dentro del bucle: con lotes de 200 son 200 DML. Acumula y actualiza una vez.",
            en: "The update is inside the loop: with batches of 200 that is 200 DMLs. Collect and update once.",
          },
          otter: {
            es: "El update está dentro del bucle: con lotes de 200 son 200 DML. Es el Update Records dentro del Loop; acumula y actualiza una vez.",
            en: "The update is inside the loop: with batches of 200 that is 200 DML. It is the Update Records inside the Loop; collect and update once.",
          },
          onPass: {
            es: "Un DML por lote: el Batch procesará millones de registros sin despeinarse.",
            en: "One DML per batch: this Batch will chew through millions of records without flinching.",
          },
        },
        {
          id: "c2-b-fls",
          label: { es: "Comprueba FLS antes de escribir", en: "Checks FLS before writing" },
          rule: {
            op: "any",
            of: [
              { op: "match", pattern: "isUpdateable\\s*\\(" },
              { op: "match", pattern: "stripInaccessible\\s*\\(" },
              { op: "match", pattern: "USER_MODE" },
            ],
          },
          onFail: {
            es: "Falta la comprobación real de permisos antes del DML. Un comentario no protege nada: usa isUpdateable(), stripInaccessible() o USER_MODE.",
            en: "The real permission check before the DML is missing. A comment protects nothing: use isUpdateable(), stripInaccessible() or USER_MODE.",
          },
          otter: {
            es: "Falta la comprobación real de permisos antes del DML, tu Field-Level Security aplicada en código. Un comentario no protege nada: usa isUpdateable(), stripInaccessible() o USER_MODE.",
            en: "The real permission check before the DML is missing, your Field-Level Security applied in code. A comment protects nothing: use isUpdateable(), stripInaccessible() or USER_MODE.",
          },
        },
      ],
    },
    {
      id: "async",
      fileName: "StageNotifier.cls",
      voice: "otter",
      outro: {
        es: "El aviso ya sale en asíncrono y sobrevive a la caída del sistema externo. Última pieza: los tests que demuestran que todo funciona… y que fallarían si algo se rompiera.",
        en: "The notification now goes out asynchronously and survives the external system going down. Last piece: the tests that prove it all works… and that would fail if something broke.",
      },
      name: { es: "Notificación asíncrona con callout", en: "Async notification with callout" },
      brief: [
        {
          es: "Un método @future(callout=true) o una clase Queueable que implemente Database.AllowsCallouts.",
          en: "A @future(callout=true) method or a Queueable class implementing Database.AllowsCallouts.",
        },
        {
          es: "Recibe Ids, no sObjects: el asíncrono solo acepta tipos primitivos como parámetros en @future.",
          en: "Takes Ids, not sObjects: @future only accepts primitive types as parameters.",
        },
        {
          es: "Envuelve el callout en try/catch y registra el fallo en vez de tragárselo.",
          en: "Wraps the callout in try/catch and records the failure instead of swallowing it.",
        },
      ],
      starter: {
        es: `public with sharing class StageNotifier {

    // Declara el método asíncrono con permiso de callout

    public static void notifyExternalSystem(Set<Id> opportunityIds) {
        // Construye la petición, envíala y maneja el error
    }
}`,
        en: `public with sharing class StageNotifier {

    // Declare the async method with callout permission

    public static void notifyExternalSystem(Set<Id> opportunityIds) {
        // Build the request, send it and handle failure
    }
}`,
      },
      hints: [
        {
          es: "Yo compararía la firma del método con lo que exige el asíncrono cuando además hay una llamada HTTP.",
          en: "I would compare the method's signature with what asynchronous code demands when there is also an HTTP call.",
        },
        {
          es: "Lo que me ayudó: @future por sí solo no permite callouts: hay que declarar @future(callout=true). En Queueable, el equivalente es implements Database.AllowsCallouts.",
          en: "What helped me: @future on its own does not allow callouts: you have to declare @future(callout=true). In Queueable, the equivalent is implements Database.AllowsCallouts.",
        },
        {
          es: "Te dejo el esquema: @future(callout=true) public static void notify(Set<Id> ids) { HttpRequest req = new HttpRequest(); req.setEndpoint('callout:MyNamedCred/notify'); req.setMethod('POST'); try { new Http().send(req); } catch (CalloutException e) { ... } }",
          en: "Here is the outline: @future(callout=true) public static void notify(Set<Id> ids) { HttpRequest req = new HttpRequest(); req.setEndpoint('callout:MyNamedCred/notify'); req.setMethod('POST'); try { new Http().send(req); } catch (CalloutException e) { ... } }",
        },
      ],
      checks: [
        {
          id: "c2-a-async",
          label: { es: "Asíncrono con permiso de callout", en: "Async with callout permission" },
          rule: {
            op: "any",
            of: [
              { op: "match", pattern: "@future\\s*\\(\\s*callout\\s*=\\s*true\\s*\\)" },
              { op: "match", pattern: "implements\\s+Queueable\\s*,\\s*Database\\.AllowsCallouts" },
              { op: "match", pattern: "Database\\.AllowsCallouts" },
            ],
          },
          onFail: {
            es: "Un callout desde asíncrono necesita permiso explícito: @future(callout=true) o Database.AllowsCallouts en el Queueable.",
            en: "A callout from async context needs explicit permission: @future(callout=true) or Database.AllowsCallouts on the Queueable.",
          },
          otter: {
            es: "Un callout desde asíncrono necesita permiso explícito: @future(callout=true) o Database.AllowsCallouts en el Queueable.",
            en: "A callout from asynchronous code needs explicit permission: @future(callout=true) or Database.AllowsCallouts on the Queueable.",
          },
        },
        {
          id: "c2-a-http",
          label: { es: "Construye y envía la petición", en: "Builds and sends the request" },
          rule: {
            op: "all",
            of: [
              { op: "match", pattern: "new\\s+HttpRequest\\s*\\(" },
              { op: "match", pattern: "setEndpoint\\s*\\(" },
              { op: "match", pattern: "\\.send\\s*\\(" },
            ],
          },
          onFail: {
            es: "Falta el callout: HttpRequest con endpoint y método, y un Http().send().",
            en: "The callout is missing: an HttpRequest with endpoint and method, and an Http().send().",
          },
          otter: {
            es: "Falta el callout, tu acción HTTP Callout de Flow: HttpRequest con endpoint y método, y un Http().send().",
            en: "The callout is missing, your Flow HTTP Callout action: an HttpRequest with endpoint and method, and an Http().send().",
          },
        },
        {
          id: "c2-a-trycatch",
          label: { es: "Maneja el fallo del callout", en: "Handles callout failure" },
          rule: {
            op: "all",
            of: [
              { op: "match", pattern: "try\\s*\\{" },
              { op: "match", pattern: "catch\\s*\\(" },
            ],
          },
          onFail: {
            es: "Un sistema externo se cae; tu código no debería caerse con él. Envuelve el envío en try/catch.",
            en: "External systems go down; your code should not go down with them. Wrap the send in try/catch.",
          },
          otter: {
            es: "Un sistema externo se cae, y tu código no debería caerse con él. Es tu fault path: envuelve el envío en try/catch y registra el fallo.",
            en: "An external system goes down, and your code should not go down with it. It is your fault path: wrap the send in try/catch and log the failure.",
          },
        },
        {
          id: "c2-a-primitives",
          label: { es: "Parámetros primitivos", en: "Primitive parameters" },
          rule: { op: "absent", pattern: "@future[^\\n]*\\n[^\\n]*\\(\\s*List\\s*<\\s*Opportunity" },
          onFail: {
            es: "@future no admite sObjects como parámetros. Pasa Ids y vuelve a consultar dentro del método.",
            en: "@future does not accept sObjects as parameters. Pass Ids and re-query inside the method.",
          },
          optional: true,
        },
      ],
    },
    {
      id: "tests",
      fileName: "SalesOpsAutomationTest.cls",
      voice: "otter",
      outro: {
        es: "Tus tests ya verifican el camino feliz y el de error. Cuando los cuatro componentes estén en verde, habrás entregado el proyecto final del curso: de Admin a developer. ¡Enhorabuena!",
        en: "Your tests now verify the happy path and the error path. Once all four components are green, you will have delivered the course's final project: from Admin to developer. Congratulations!",
      },
      name: { es: "Clase de test", en: "Test class" },
      brief: [
        {
          es: "Anotada con @isTest y con datos creados en el test, no consultados de la org.",
          en: "Annotated @isTest, with data created in the test rather than queried from the org.",
        },
        {
          es: "Cubre el camino feliz y al menos un camino de error (la excepción personalizada).",
          en: "Covers the happy path and at least one error path (the custom exception).",
        },
        {
          es: "Usa Test.startTest() / Test.stopTest() alrededor del proceso asíncrono y verifica con asserts.",
          en: "Uses Test.startTest() / Test.stopTest() around the async process and verifies with asserts.",
        },
      ],
      starter: {
        es: `@isTest
private class SalesOpsAutomationTest {

    @isTest
    static void rescoresOpportunities() {
        // Camino feliz: datos, ejecución entre startTest/stopTest, asserts
    }

    @isTest
    static void rejectsInvalidStageTransition() {
        // Camino de error: provoca la excepción y compruébala
    }
}`,
        en: `@isTest
private class SalesOpsAutomationTest {

    @isTest
    static void rescoresOpportunities() {
        // Happy path: data, run between startTest/stopTest, asserts
    }

    @isTest
    static void rejectsInvalidStageTransition() {
        // Error path: provoke the exception and check it
    }
}`,
      },
      hints: [
        {
          es: "Yo me preguntaría qué comprueba el test al terminar: ¿fallaría si el código de producción dejara de hacer su trabajo? Es la diferencia entre ver que un flow no dio error y abrir el registro para comprobar el resultado.",
          en: "I would ask what the test checks at the end: would it fail if the production code stopped doing its job? It is the difference between seeing a flow did not error and opening the record to check the result.",
        },
        {
          es: "Lo que me ayudó: un test sin assert solo demuestra que el código no explota; cobertura no es verificación. Y para probar una excepción, el patrón es try { ... Assert.fail(); } catch (MiException e) { ... }.",
          en: "What helped me: a test with no assert only proves the code does not blow up; coverage is not verification. And to test an exception, the pattern is try { ... Assert.fail(); } catch (MyException e) { ... }.",
        },
        {
          es: "Te dejo el esquema: Test.startTest(); Database.executeBatch(new OpportunityRescoreBatch()); Test.stopTest(); Opportunity o = [SELECT Score__c FROM Opportunity WHERE Id = :id]; Assert.areEqual(expected, o.Score__c);",
          en: "Here is the outline: Test.startTest(); Database.executeBatch(new OpportunityRescoreBatch()); Test.stopTest(); Opportunity o = [SELECT Score__c FROM Opportunity WHERE Id = :id]; Assert.areEqual(expected, o.Score__c);",
        },
      ],
      checks: [
        {
          id: "c2-t-istest",
          label: { es: "Clase de test anotada", en: "Annotated test class" },
          rule: { op: "match", pattern: "@isTest" },
          onFail: {
            es: "La clase necesita @isTest para que Salesforce la reconozca y no cuente contra el límite de código.",
            en: "The class needs @isTest so Salesforce recognises it and it does not count against the code limit.",
          },
          otter: {
            es: "La clase necesita @isTest para que Salesforce la reconozca como test y no cuente contra el límite de código.",
            en: "The class needs @isTest so Salesforce recognises it as a test and it does not count against the code limit.",
          },
        },
        {
          id: "c2-t-startstop",
          label: { es: "startTest / stopTest", en: "startTest / stopTest" },
          rule: {
            op: "all",
            of: [
              { op: "match", pattern: "Test\\.startTest\\s*\\(" },
              { op: "match", pattern: "Test\\.stopTest\\s*\\(" },
            ],
          },
          onFail: {
            es: "Sin stopTest() el proceso asíncrono nunca llega a ejecutarse dentro del test y no compruebas nada.",
            en: "Without stopTest() the async process never runs inside the test and you verify nothing.",
          },
          otter: {
            es: "Sin stopTest() el proceso asíncrono nunca llega a ejecutarse dentro del test, y no compruebas nada.",
            en: "Without stopTest() the asynchronous process never runs inside the test, and you check nothing.",
          },
        },
        {
          id: "c2-t-asserts",
          label: { es: "Verifica con asserts", en: "Verifies with asserts" },
          rule: {
            op: "count",
            pattern: "(Assert\\.|System\\.assert)",
            min: 2,
          },
          onFail: {
            es: "Necesitas al menos dos asserts: uno por el camino feliz y otro por el de error. Cobertura sin asserts es cobertura vacía.",
            en: "You need at least two asserts: one for the happy path and one for the error path. Coverage without asserts is empty coverage.",
          },
          otter: {
            es: "Necesitas al menos dos asserts, uno por el camino feliz y otro por el de error: es abrir el registro después de ejecutar el flow, no solo ver que no dio error. Cobertura sin asserts es cobertura vacía.",
            en: "You need at least two asserts, one for the happy path and one for the error path: it is opening the record after running the flow, not just seeing it did not error. Coverage without asserts is empty coverage.",
          },
          onPass: {
            es: "Tus tests afirman algo concreto: si el código de producción se rompe, el test se entera.",
            en: "Your tests assert something concrete: if the production code breaks, the test notices.",
          },
        },
        {
          id: "c2-t-errorpath",
          label: { es: "Cubre el camino de error", en: "Covers the error path" },
          rule: {
            op: "all",
            of: [
              { op: "match", pattern: "catch\\s*\\(\\s*\\w*Exception" },
              { op: "match", pattern: "(Assert\\.fail|System\\.assert)" },
            ],
          },
          onFail: {
            es: "Falta el test que provoca la excepción personalizada. El camino feliz solo demuestra que funciona cuando todo va bien.",
            en: "The test that provokes the custom exception is missing. The happy path only proves it works when nothing goes wrong.",
          },
          otter: {
            es: "Falta el test que provoca la excepción personalizada, como comprobar que tu regla de validación de verdad bloquea el guardado. El camino feliz solo demuestra que funciona cuando todo va bien.",
            en: "The test that triggers the custom exception is missing, like checking your validation rule really blocks the save. The happy path only proves it works when everything goes well.",
          },
        },
        {
          id: "c2-t-nodata-query",
          label: { es: "Crea sus propios datos", en: "Creates its own data" },
          rule: { op: "match", pattern: "insert\\s+" },
          onFail: {
            es: "Un test no debe depender de datos que ya existan en la org: créalos dentro del test.",
            en: "A test must not depend on data already in the org: create it inside the test.",
          },
          optional: true,
        },
      ],
    },
  ],
  rubric: [
    {
      es: "¿El Batch procesaría 5 millones de Opportunities sin tocar los límites, o solo las 200 de tu prueba?",
      en: "Would the Batch process 5 million Opportunities without hitting limits, or only the 200 in your test?",
    },
    {
      es: "Si mañana desactivan el sistema externo, ¿qué ve el usuario? ¿Un error críptico o nada en absoluto?",
      en: "If the external system goes offline tomorrow, what does the user see? A cryptic error, or nothing at all?",
    },
    {
      es: "Tus tests, ¿fallarían si alguien borrara la línea que calcula la puntuación? Si no, no están probando nada.",
      en: "Would your tests fail if someone deleted the line that calculates the score? If not, they are testing nothing.",
    },
    {
      es: "La seguridad, ¿está aplicada o declarada? with sharing protege registros; FLS protege campos. Son dos cosas distintas.",
      en: "Is the security enforced or merely declared? with sharing protects records; FLS protects fields. They are two different things.",
    },
  ],
};
