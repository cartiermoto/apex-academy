import type { Challenge } from "@/lib/types";

/* -------------------------------------------------------------------------- */
/* DESAFÍO 1 — Proyecto Intermedio (unlocks after Module 7)                    */
/* -------------------------------------------------------------------------- */

export const challenge1: Challenge = {
  id: "c1",
  n: 1,
  requires: "m07",
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
          es: "Mira la firma del trigger: los contextos que declaras entre paréntesis deciden cuándo corre.",
          en: "Look at the trigger signature: the contexts you declare in brackets decide when it runs.",
        },
        {
          es: "Asignar OwnerId es un cambio sobre el propio registro que se está guardando. El contexto before te lo deja hacer sin un DML extra.",
          en: "Setting OwnerId is a change to the record being saved. The before context lets you do it without an extra DML.",
        },
        {
          es: "Pseudocódigo: trigger ... on Lead (before insert, before update) { new Handler(...).run(); } — con el handler recibiendo Trigger.new.",
          en: "Pseudocode: trigger ... on Lead (before insert, before update) { new Handler(...).run(); } — with the handler receiving Trigger.new.",
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
        },
        {
          id: "c1-t-delegates",
          label: { es: "Delega en el handler", en: "Delegates to the handler" },
          rule: { op: "match", pattern: "LeadAssignmentHandler" },
          onFail: {
            es: "El trigger debe llamar a LeadAssignmentHandler. Si la lógica vive en el trigger, no puedes testearla ni reutilizarla.",
            en: "The trigger must call LeadAssignmentHandler. Logic living in the trigger cannot be tested or reused.",
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
        },
      ],
    },
    {
      id: "handler",
      fileName: "LeadAssignmentHandler.cls",
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
          es: "Revisa dónde está tu consulta SOQL respecto a los bucles: ¿cuántas veces se ejecutaría con 200 Leads?",
          en: "Check where your SOQL sits relative to any loop: how many times would it run with 200 Leads?",
        },
        {
          es: "Una consulta sin WHERE que traiga todas las reglas es correcta aquí: son pocas filas de configuración y las necesitas todas para construir el índice.",
          en: "A query with no WHERE returning every rule is right here: it is a handful of configuration rows and you need all of them to build the index.",
        },
        {
          es: "Pseudocódigo: List<Assignment_Rule__c> rules = [SELECT ... FROM Assignment_Rule__c]; luego LeadAssignmentService.assign(this.leads, rules);",
          en: "Pseudocode: List<Assignment_Rule__c> rules = [SELECT ... FROM Assignment_Rule__c]; then LeadAssignmentService.assign(this.leads, rules);",
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
        },
        {
          id: "c1-h-no-dml",
          label: { es: "Sin DML innecesario", en: "No unnecessary DML" },
          rule: { op: "absent", pattern: "\\b(insert|update|upsert)\\s+[A-Za-z_]" },
          onFail: {
            es: "Estás en contexto before: modificar el registro en memoria basta y Salesforce lo guarda. Un update aquí es un DML extra y, sobre el mismo objeto, recursión.",
            en: "You are in a before context: changing the record in memory is enough and Salesforce saves it. An update here is an extra DML and, on the same object, recursion.",
          },
        },
      ],
    },
    {
      id: "service",
      fileName: "LeadAssignmentService.cls",
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
          es: "Piensa qué pasa con un Lead cuyo Region__c es null antes de construir la clave del Map.",
          en: "Think about what happens to a Lead whose Region__c is null before you build the Map key.",
        },
        {
          es: "String.isBlank() cubre null y cadena vacía en una sola comprobación; y Map.get() devuelve null cuando la clave no existe, así que el resultado también hay que comprobarlo.",
          en: "String.isBlank() covers null and empty string in one check; and Map.get() returns null for a missing key, so the result needs checking too.",
        },
        {
          es: "Pseudocódigo: for (Lead l : leads) { String key = String.isBlank(l.Region__c) ? null : l.Region__c + '|' + l.Industry; Id rep = key == null ? null : ruleMap.get(key); l.OwnerId = rep != null ? rep : defaultRepId; }",
          en: "Pseudocode: for (Lead l : leads) { String key = String.isBlank(l.Region__c) ? null : l.Region__c + '|' + l.Industry; Id rep = key == null ? null : ruleMap.get(key); l.OwnerId = rep != null ? rep : defaultRepId; }",
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
        },
        {
          id: "c1-s-loop",
          label: { es: "Recorre la colección recibida", en: "Iterates the received collection" },
          rule: { op: "match", pattern: "for\\s*\\(\\s*Lead\\s+\\w+\\s*:" },
          onFail: {
            es: "Trabaja sobre la lista completa, no sobre leads[0]. El código tiene que dar el mismo resultado con 1 Lead y con 200.",
            en: "Work on the whole list, not on leads[0]. The code must behave the same with 1 Lead and with 200.",
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
          es: "Revisa la declaración de tu excepción: en Apex una clase de excepción tiene que cumplir dos condiciones, no una.",
          en: "Check your exception declaration: in Apex an exception class must meet two conditions, not one.",
        },
        {
          es: "El nombre de una excepción personalizada debe terminar en Exception y la clase debe extender Exception (o una de sus hijas). Si falta cualquiera de las dos, no compila.",
          en: "A custom exception's name must end in Exception and the class must extend Exception (or one of its children). Miss either and it does not compile.",
        },
        {
          es: "Pseudocódigo: public class StageTransitionException extends Exception {} y dentro del bucle: if (!allowed) throw new StageTransitionException('...');",
          en: "Pseudocode: public class StageTransitionException extends Exception {} and inside the loop: if (!allowed) throw new StageTransitionException('...');",
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
        },
        {
          id: "c2-h-throw",
          label: { es: "La lanza cuando corresponde", en: "Throws it when appropriate" },
          rule: { op: "match", pattern: "throw\\s+new\\s+\\w*Exception" },
          onFail: {
            es: "Declaras la excepción pero nunca la lanzas: la validación no llega a impedir nada.",
            en: "You declare the exception but never throw it: the validation never actually blocks anything.",
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
        },
        {
          id: "c2-h-sharing",
          label: { es: "with sharing declarado", en: "with sharing declared" },
          rule: { op: "match", pattern: "with\\s+sharing\\s+class" },
          onFail: {
            es: "Sin with sharing la clase corre en modo sistema y ve registros que el usuario no debería ver.",
            en: "Without with sharing the class runs in system mode and sees records the user should not.",
          },
        },
      ],
    },
    {
      id: "batch",
      fileName: "OpportunityRescoreBatch.cls",
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
          es: "Mira dónde pusiste el update dentro de execute respecto al bucle que recorre el scope.",
          en: "Look at where the update sits inside execute relative to the loop over the scope.",
        },
        {
          es: "execute recibe un lote (200 por defecto). Un DML por registro son 200 DML en un lote; acumula en una List y actualiza una vez al final.",
          en: "execute receives a batch (200 by default). One DML per record is 200 DMLs in a batch; collect into a List and update once at the end.",
        },
        {
          es: "Pseudocódigo: List<Opportunity> toUpdate = new List<Opportunity>(); for (Opportunity o : scope) { o.Score__c = calc(o); toUpdate.add(o); } if (!toUpdate.isEmpty()) update toUpdate;",
          en: "Pseudocode: List<Opportunity> toUpdate = new List<Opportunity>(); for (Opportunity o : scope) { o.Score__c = calc(o); toUpdate.add(o); } if (!toUpdate.isEmpty()) update toUpdate;",
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
        },
      ],
    },
    {
      id: "async",
      fileName: "StageNotifier.cls",
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
          es: "Compara la firma de tu método con lo que exige el asíncrono cuando además hay una llamada HTTP.",
          en: "Compare your method signature with what async requires when there is also an HTTP call.",
        },
        {
          es: "@future por sí solo no permite callouts: hay que declarar @future(callout=true). En Queueable el equivalente es implements Database.AllowsCallouts.",
          en: "@future alone does not allow callouts: you must declare @future(callout=true). In Queueable the equivalent is implements Database.AllowsCallouts.",
        },
        {
          es: "Pseudocódigo: @future(callout=true) public static void notify(Set<Id> ids) { HttpRequest req = new HttpRequest(); req.setEndpoint('callout:MyNamedCred/notify'); req.setMethod('POST'); try { new Http().send(req); } catch (CalloutException e) { ... } }",
          en: "Pseudocode: @future(callout=true) public static void notify(Set<Id> ids) { HttpRequest req = new HttpRequest(); req.setEndpoint('callout:MyNamedCred/notify'); req.setMethod('POST'); try { new Http().send(req); } catch (CalloutException e) { ... } }",
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
          es: "Mira qué comprueba tu test cuando termina. ¿Fallaría si el código de producción dejara de hacer su trabajo?",
          en: "Look at what your test checks when it finishes. Would it fail if the production code stopped doing its job?",
        },
        {
          es: "Un test sin assert solo demuestra que el código no explota; cobertura no es verificación. Y para probar una excepción, el patrón es try { ... Assert.fail(); } catch (MiException e) { ... }.",
          en: "A test with no assert only proves the code does not explode; coverage is not verification. And to test an exception the pattern is try { ... Assert.fail(); } catch (MyException e) { ... }.",
        },
        {
          es: "Pseudocódigo: Test.startTest(); Database.executeBatch(new OpportunityRescoreBatch()); Test.stopTest(); Opportunity o = [SELECT Score__c FROM Opportunity WHERE Id = :id]; Assert.areEqual(expected, o.Score__c);",
          en: "Pseudocode: Test.startTest(); Database.executeBatch(new OpportunityRescoreBatch()); Test.stopTest(); Opportunity o = [SELECT Score__c FROM Opportunity WHERE Id = :id]; Assert.areEqual(expected, o.Score__c);",
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
