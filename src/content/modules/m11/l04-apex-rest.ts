import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, por dentro
// Tarea 4 de 7: una puerta para que el ERP pregunte por una renovación.

@RestResource(urlMapping='/renewals/*')
global with sharing class RenewalApi {
    // Lo que se devuelve: Salesforce lo convierte en JSON
    global class RenewalStatus {
        global String erpCode;
        global String stage;
        global Decimal amount;
    }

    // GET /services/apexrest/renewals/ERP-100
    @HttpGet
    global static RenewalStatus getRenewal() {
        String erpCode = RestContext.request.requestURI.substringAfterLast('/');

        List<Opportunity> found = [
            SELECT StageName, Amount
            FROM Opportunity
            WHERE Type = 'Renewal' AND Account.ERP_Code__c = :erpCode
            ORDER BY CreatedDate DESC
            LIMIT 1
        ];
        if (found.isEmpty()) {
            RestContext.response.statusCode = 404;
            return null;
        }

        RenewalStatus result = new RenewalStatus();
        result.erpCode = erpCode;
        result.stage = found[0].StageName;
        result.amount = found[0].Amount;
        return result;
    }
}`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, por dentro\n// Tarea 4 de 7: una puerta para que el ERP pregunte por una renovación.",
  "// CASE: the ERP bridge, from the inside\n// Task 4 of 7: a door for the ERP to ask about a renewal.",
).replace("// Lo que se devuelve: Salesforce lo convierte en JSON", "// What is returned: Salesforce turns it into JSON");

export const l04ApexRest: Lesson = {
  id: "m11-l04",
  slug: "apex-rest",
  n: 4,
  kind: "lesson",
  minutes: 30,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 3", en: "Remember? · Review of lesson 3" },
    prompt: { es: "¿Dónde vive la clave de una API externa?", en: "Where does an external API's key live?" },
    options: [
      { es: "En una Named Credential, en Setup", en: "In a Named Credential, in Setup" },
      { es: "En una constante de la clase", en: "In a class constant" },
      { es: "En un comentario", en: "In a comment" },
    ],
    answer: 0,
    explain: {
      es: "Nunca en el código. Hasta ahora llamabas tú; hoy te llaman a ti.",
      en: "Never in code. So far you made the calls; today you get called.",
    },
  },
  title: { es: "Exponer Apex como REST", en: "Exposing Apex as REST" },
  summary: {
    es: "Con @RestResource, una clase de Apex se convierte en una dirección a la que otros sistemas pueden llamar. Tú decides la URL, qué recibe, qué devuelve y con qué código de estado responde.",
    en: "With @RestResource, an Apex class becomes an address other systems can call. You decide the URL, what it receives, what it returns and which status code it answers with.",
  },
  analogy: {
    es: "La API estándar de Salesforce que usa Data Loader, pero con una puerta hecha a tu medida",
    en: "The standard Salesforce API Data Loader uses, but with a door built to your measure",
  },
  objectives: [
    { es: "Crear un servicio REST con @RestResource y @HttpGet.", en: "Create a REST service with @RestResource and @HttpGet." },
    { es: "Leer la petición con RestContext y devolver un objeto que se convierte en JSON.", en: "Read the request with RestContext and return an object that becomes JSON." },
    { es: "Responder con el código de estado correcto cuando no hay nada que devolver.", en: "Answer with the right status code when there is nothing to return." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Hasta ahora el puente tenía un solo sentido: Salesforce llama al ERP. Ahora el ERP quiere preguntar: «¿en qué etapa está la renovación de ERP-100?». Podría usar la API estándar de Salesforce, pero tendría que conocer tus objetos y tus campos. Mejor una puerta sencilla, hecha a medida.",
        en: "So far the bridge ran one way: Salesforce calls the ERP. Now the ERP wants to ask: «which stage is ERP-100's renewal in?». It could use Salesforce's standard API, but it would have to know your objects and fields. Better a simple door, made to measure.",
      },
    },
    {
      type: "code",
      code: {
        es: `@RestResource(urlMapping='/renewals/*')      // la dirección: /services/apexrest/renewals/…
global with sharing class RenewalApi {
    @HttpGet                                 // responde a las peticiones GET
    global static RenewalStatus getRenewal() {
        String erpCode = RestContext.request.requestURI.substringAfterLast('/');
        // … consultar y devolver
    }
}`,
        en: `@RestResource(urlMapping='/renewals/*')      // the address: /services/apexrest/renewals/…
global with sharing class RenewalApi {
    @HttpGet                                 // answers GET requests
    global static RenewalStatus getRenewal() {
        String erpCode = RestContext.request.requestURI.substringAfterLast('/');
        // … query and return
    }
}`,
      },
    },
    {
      type: "list",
      items: [
        {
          es: "@RestResource(urlMapping='/renewals/*') publica la clase en /services/apexrest/renewals/. El asterisco deja pasar lo que venga detrás, como el código ERP.",
          en: "@RestResource(urlMapping='/renewals/*') publishes the class at /services/apexrest/renewals/. The asterisk lets through whatever comes after, like the ERP code.",
        },
        {
          es: "La clase y sus métodos son global: tienen que verse desde fuera de la org. Cada verbo tiene su anotación (@HttpGet, @HttpPost, @HttpPatch, @HttpDelete), y solo un método por verbo en cada clase.",
          en: "The class and its methods are global: they must be visible from outside the org. Each verb has its annotation (@HttpGet, @HttpPost, @HttpPatch, @HttpDelete), and only one method per verb in each class.",
        },
        {
          es: "RestContext.request trae la petición (la URL, los parámetros, el cuerpo) y RestContext.response te deja elegir el código de estado.",
          en: "RestContext.request carries the request (the URL, the parameters, the body) and RestContext.response lets you choose the status code.",
        },
        {
          es: "Lo que devuelve el método se convierte solo en JSON: basta con devolver un objeto con sus atributos.",
          en: "Whatever the method returns becomes JSON on its own: returning an object with its attributes is enough.",
        },
      ],
    },
    {
      type: "diagram",
      id: "m11-rest",
      caption: {
        es: "Haz de ERP: llama a la puerta con distintos códigos y mira qué responde Salesforce.",
        en: "Play the ERP: knock on the door with different codes and see what Salesforce answers.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Una puerta al exterior se diseña con cuidado", en: "A door to the outside is designed with care" },
      text: {
        es: "Quien llama necesita un usuario de Salesforce con permisos, igual que con la API estándar, y la clase lleva with sharing para respetar lo que ese usuario puede ver (Módulo 12). El valor que llega por la URL viene de fuera: va a la consulta como variable de enlace (:erpCode), nunca pegado al texto. Y si no hay nada que devolver, se dice con un 404, no con un 200 vacío.",
        en: "The caller needs a Salesforce user with permissions, just as with the standard API, and the class carries with sharing to respect what that user can see (Module 12). The value arriving in the URL comes from outside: it goes into the query as a bind variable (:erpCode), never glued into the text. And if there is nothing to return, say so with a 404, not an empty 200.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "La misma API que usa Data Loader, a tu medida", en: "The same API Data Loader uses, to your measure" },
      text: {
        es: "Cuando Data Loader o Workbench leen cuentas, llaman a la API estándar de Salesforce, que ya existe para todos los objetos. Apex REST es añadir tu propia dirección a esa API: en vez de «dame el objeto Opportunity con estos filtros», el ERP pregunta «dame la renovación de ERP-100» y tú decides qué contestar.",
        en: "When Data Loader or Workbench read accounts, they call Salesforce's standard API, which already exists for every object. Apex REST is adding your own address to that API: instead of «give me the Opportunity object with these filters», the ERP asks «give me ERP-100's renewal» and you decide what to answer.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque la puerta no sería la tuya", en: "Why not a Flow? Because the door would not be yours" },
      text: {
        es: "Un flow autolanzado sí se puede llamar desde fuera, por la API REST de Salesforce: una petición POST a /services/data/vXX.X/actions/custom/flow/NombreDelFlow. Funciona, pero con las reglas de Salesforce: esa URL, siempre POST y la forma de respuesta de las acciones. No puedes ofrecer un GET /renewals/ERP-100, ni contestar con un 404 cuando no existe. Con Apex REST, la URL, el verbo y el código de estado los diseñas tú.",
        en: "An autolaunched flow can be called from outside, through Salesforce's REST API: a POST request to /services/data/vXX.X/actions/custom/flow/FlowName. It works, but on Salesforce's terms: that URL, always POST and the actions' response shape. You cannot offer a GET /renewals/ERP-100, or answer with a 404 when it does not exist. With Apex REST, you design the URL, the verb and the status code.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué anotación publica la clase y cuál marca el método que responde a un GET? ¿Por qué todo es global? ¿Cómo llega el código ERP a la consulta?",
        en: "Without looking: which annotation publishes the class and which marks the method answering a GET? Why is everything global? How does the ERP code reach the query?",
      },
    },
  ],

  quiz: [
    {
      id: "m11-l04-q1",
      kind: "single",
      prompt: {
        es: "Con @RestResource(urlMapping='/renewals/*'), ¿a qué dirección llama el ERP para ERP-100?",
        en: "With @RestResource(urlMapping='/renewals/*'), which address does the ERP call for ERP-100?",
      },
      options: [
        { es: "/services/apexrest/renewals/ERP-100", en: "/services/apexrest/renewals/ERP-100" },
        { es: "/renewals/ERP-100", en: "/renewals/ERP-100" },
        { es: "/services/data/renewals/ERP-100", en: "/services/data/renewals/ERP-100" },
        { es: "/apex/RenewalApi?code=ERP-100", en: "/apex/RenewalApi?code=ERP-100" },
      ],
      answer: 0,
      explain: {
        es: "Todos los servicios de Apex REST cuelgan de /services/apexrest/, seguido de tu urlMapping.",
        en: "Every Apex REST service hangs off /services/apexrest/, followed by your urlMapping.",
      },
    },
    {
      id: "m11-l04-q2",
      kind: "single",
      prompt: { es: "¿Qué falla en esta clase?", en: "What is wrong with this class?" },
      code: {
        es: `@RestResource(urlMapping='/renewals/*')
public class RenewalApi {
    @HttpGet
    public static String getRenewal() { return 'ok'; }
}`,
        en: `@RestResource(urlMapping='/renewals/*')
public class RenewalApi {
    @HttpGet
    public static String getRenewal() { return 'ok'; }
}`,
      },
      options: [
        { es: "La clase y el método tienen que ser global", en: "The class and the method must be global" },
        { es: "Falta un constructor", en: "A constructor is missing" },
        { es: "Un servicio REST no puede devolver String", en: "A REST service cannot return String" },
        { es: "Nada", en: "Nothing" },
      ],
      answer: 0,
      explain: {
        es: "Se llaman desde fuera de la org: global en la clase y en cada método expuesto.",
        en: "They are called from outside the org: global on the class and on each exposed method.",
      },
      tags: ["find-error"],
    },
    {
      id: "m11-l04-q3",
      kind: "single",
      prompt: {
        es: "El ERP pregunta por un código que no existe en Salesforce. ¿Qué debería responder tu servicio?",
        en: "The ERP asks about a code that does not exist in Salesforce. What should your service answer?",
      },
      options: [
        { es: "Un 404, con RestContext.response.statusCode = 404", en: "A 404, with RestContext.response.statusCode = 404" },
        { es: "Un 200 con el cuerpo vacío", en: "A 200 with an empty body" },
        { es: "Una excepción sin capturar", en: "An uncaught exception" },
        { es: "Un 200 con el texto 'error'", en: "A 200 with the text 'error'" },
      ],
      answer: 0,
      explain: {
        es: "Quien llama mira el código de estado, igual que haces tú con el ERP. Un 200 vacío le haría creer que todo fue bien.",
        en: "The caller checks the status code, just as you do with the ERP. An empty 200 would make it believe all went well.",
      },
    },
    {
      id: "m11-l04-q4",
      kind: "text",
      prompt: {
        es: "Escribe la anotación que marca el método que responde a las peticiones GET.",
        en: "Write the annotation marking the method that answers GET requests.",
      },
      accept: ["@httpget"],
      placeholder: { es: "@…", en: "@…" },
      explain: { es: "@HttpGet. Sus hermanas: @HttpPost, @HttpPatch, @HttpPut y @HttpDelete.", en: "@HttpGet. Its siblings: @HttpPost, @HttpPatch, @HttpPut and @HttpDelete." },
      tags: ["recall"],
    },
    {
      id: "m11-l04-q5",
      kind: "single",
      prompt: { es: "¿Qué hace Salesforce con el objeto que devuelve tu método @HttpGet?", en: "What does Salesforce do with the object your @HttpGet method returns?" },
      options: [
        { es: "Lo convierte en JSON y lo envía como cuerpo de la respuesta", en: "It turns it into JSON and sends it as the response body" },
        { es: "Lo guarda en la base de datos", en: "It saves it to the database" },
        { es: "Nada: hay que llamar a JSON.serialize a mano", en: "Nothing: you must call JSON.serialize by hand" },
        { es: "Lo convierte en XML siempre", en: "It always turns it into XML" },
      ],
      answer: 0,
      explain: {
        es: "La conversión es automática: el JSON.serialize de la lección 2, hecho por la plataforma.",
        en: "The conversion is automatic: lesson 2's JSON.serialize, done by the platform.",
      },
    },
    {
      id: "m11-l04-q6",
      kind: "single",
      prompt: {
        es: "Repaso: el código ERP llega por la URL, escrito por otro sistema. ¿Cómo lo metes en la consulta?",
        en: "Review: the ERP code arrives in the URL, written by another system. How do you put it in the query?",
      },
      options: [
        { es: "Como variable de enlace: WHERE Account.ERP_Code__c = :erpCode", en: "As a bind variable: WHERE Account.ERP_Code__c = :erpCode" },
        { es: "Pegándolo al texto de la consulta con +", en: "Gluing it into the query text with +" },
        { es: "Con String.valueOf", en: "With String.valueOf" },
        { es: "No se puede usar en una consulta", en: "It cannot be used in a query" },
      ],
      answer: 0,
      explain: {
        es: "Lo que viene de fuera nunca se pega al texto de una consulta: sería una inyección de SOQL esperando a ocurrir.",
        en: "What comes from outside is never glued into a query's text: it would be a SOQL injection waiting to happen.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M3 L5", en: "Review · M3 L5" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 4 DE 7 · El ERP quiere preguntarle a Salesforce en qué etapa está la renovación de un cliente. Ábrele una puerta: un servicio REST en /renewals/ que, con un GET y el código ERP al final de la URL, devuelva la etapa y el importe de su renovación más reciente, o un 404 si no hay ninguna.",
      en: "TASK 4 OF 7 · The ERP wants to ask Salesforce which stage a customer's renewal is in. Open it a door: a REST service at /renewals/ that, on a GET with the ERP code at the end of the URL, returns the stage and amount of its most recent renewal, or a 404 if there is none.",
    },
    brief: [
      {
        es: "@RestResource(urlMapping='/renewals/*') sobre una clase global with sharing llamada RenewalApi.",
        en: "@RestResource(urlMapping='/renewals/*') on a global with sharing class called RenewalApi.",
      },
      {
        es: "Un método @HttpGet global static que devuelva RenewalStatus (ya definida). El código ERP sale de RestContext.request.requestURI, lo que va detrás de la última barra.",
        en: "An @HttpGet global static method returning RenewalStatus (already defined). The ERP code comes from RestContext.request.requestURI, whatever follows the last slash.",
      },
      {
        es: "Consulta la renovación más reciente de esa cuenta (Type = 'Renewal', Account.ERP_Code__c = :erpCode, la más nueva primero, LIMIT 1), con variable de enlace.",
        en: "Query that account's most recent renewal (Type = 'Renewal', Account.ERP_Code__c = :erpCode, newest first, LIMIT 1), with a bind variable.",
      },
      {
        es: "Si no hay ninguna: RestContext.response.statusCode = 404 y return null. Si la hay, rellena y devuelve un RenewalStatus.",
        en: "If there is none: RestContext.response.statusCode = 404 and return null. If there is, fill and return a RenewalStatus.",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, por dentro
// Ya resuelto (tareas 1-3): Salesforce llama al ERP, entiende su JSON y no guarda claves en el código.
// Tarea 4 de 7: una puerta para que el ERP pregunte por una renovación.

public class RenewalApi {
    // Lo que se devuelve: Salesforce lo convierte en JSON
    global class RenewalStatus {
        global String erpCode;
        global String stage;
        global Decimal amount;
    }

    // GET /services/apexrest/renewals/ERP-100
}
`,
      en: `// CASE: the ERP bridge, from the inside
// Already solved (tasks 1-3): Salesforce calls the ERP, understands its JSON and keeps no keys in code.
// Task 4 of 7: a door for the ERP to ask about a renewal.

public class RenewalApi {
    // What is returned: Salesforce turns it into JSON
    global class RenewalStatus {
        global String erpCode;
        global String stage;
        global Decimal amount;
    }

    // GET /services/apexrest/renewals/ERP-100
}
`,
    },
    hints: [
      {
        es: "Yo lo pensaría desde el lado del ERP: ¿a qué dirección llamo, con qué verbo, y qué espero que me conteste si el cliente existe y si no existe?",
        en: "I would think of it from the ERP's side: which address do I call, with which verb, and what do I expect back if the customer exists and if it does not?",
      },
      {
        es: "Lo que me ayudó: dos anotaciones (@RestResource en la clase, @HttpGet en el método), todo global, y el código ERP se saca de la URL con substringAfterLast('/'). La consulta, con :erpCode.",
        en: "What helped me: two annotations (@RestResource on the class, @HttpGet on the method), everything global, and the ERP code comes out of the URL with substringAfterLast('/'). The query, with :erpCode.",
      },
      {
        es: "Te dejo el esquema: @RestResource(urlMapping='/renewals/*') global with sharing class RenewalApi { … @HttpGet global static RenewalStatus getRenewal() { String erpCode = RestContext.request.requestURI.substringAfterLast('/'); List<Opportunity> found = [SELECT StageName, Amount FROM Opportunity WHERE Type = 'Renewal' AND Account.ERP_Code__c = :erpCode ORDER BY CreatedDate DESC LIMIT 1]; if (found.isEmpty()) { RestContext.response.statusCode = 404; return null; } RenewalStatus result = new RenewalStatus(); … return result; } }",
        en: "Here is the outline: @RestResource(urlMapping='/renewals/*') global with sharing class RenewalApi { … @HttpGet global static RenewalStatus getRenewal() { String erpCode = RestContext.request.requestURI.substringAfterLast('/'); List<Opportunity> found = [SELECT StageName, Amount FROM Opportunity WHERE Type = 'Renewal' AND Account.ERP_Code__c = :erpCode ORDER BY CreatedDate DESC LIMIT 1]; if (found.isEmpty()) { RestContext.response.statusCode = 404; return null; } RenewalStatus result = new RenewalStatus(); … return result; } }",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m11-l04-c1",
        label: { es: "La clase se publica en /renewals/", en: "The class is published at /renewals/" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "@RestResource\\s*\\(\\s*urlMapping\\s*=\\s*'/renewals/\\*'\\s*\\)" },
            { op: "match", pattern: "global\\s+(with\\s+sharing\\s+)?class\\s+RenewalApi\\b" },
          ],
        },
        onFail: {
          es: "@RestResource(urlMapping='/renewals/*') encima de global with sharing class RenewalApi.",
          en: "@RestResource(urlMapping='/renewals/*') above global with sharing class RenewalApi.",
        },
        otter: {
          es: "La puerta necesita dirección y tiene que verse desde fuera: @RestResource(urlMapping='/renewals/*') y la clase global, no public.",
          en: "The door needs an address and must be visible from outside: @RestResource(urlMapping='/renewals/*') and the class global, not public.",
        },
      },
      {
        id: "m11-l04-c2",
        label: { es: "Un método GET que lee el código de la URL", en: "A GET method reading the code from the URL" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "@HttpGet\\s+global\\s+static\\s+RenewalStatus\\s+\\w+\\s*\\(\\s*\\)" },
            { op: "match", pattern: "requestURI\\s*\\.\\s*substringAfterLast\\s*\\(\\s*'/'\\s*\\)" },
          ],
        },
        onFail: {
          es: "@HttpGet global static RenewalStatus getRenewal() { String erpCode = RestContext.request.requestURI.substringAfterLast('/'); … }",
          en: "@HttpGet global static RenewalStatus getRenewal() { String erpCode = RestContext.request.requestURI.substringAfterLast('/'); … }",
        },
        otter: {
          es: "El verbo va en una anotación: @HttpGet sobre un método global static. Y el código ERP viaja al final de la URL: RestContext.request.requestURI.substringAfterLast('/').",
          en: "The verb goes in an annotation: @HttpGet on a global static method. And the ERP code travels at the end of the URL: RestContext.request.requestURI.substringAfterLast('/').",
        },
      },
      {
        id: "m11-l04-c3",
        label: { es: "La consulta usa variable de enlace", en: "The query uses a bind variable" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "FROM\\s+Opportunity\\b[^\\]]*Account\\s*\\.\\s*ERP_Code__c\\s*=\\s*:\\s*\\w+" },
            { op: "match", pattern: "FROM\\s+Opportunity\\b[^\\]]*LIMIT\\s+1" },
            { op: "absent", pattern: "Database\\s*\\.\\s*query" },
          ],
        },
        onFail: {
          es: "[SELECT StageName, Amount FROM Opportunity WHERE Type = 'Renewal' AND Account.ERP_Code__c = :erpCode ORDER BY CreatedDate DESC LIMIT 1]",
          en: "[SELECT StageName, Amount FROM Opportunity WHERE Type = 'Renewal' AND Account.ERP_Code__c = :erpCode ORDER BY CreatedDate DESC LIMIT 1]",
        },
        otter: {
          es: "Ese código lo ha escrito otro sistema: a la consulta entra con dos puntos, Account.ERP_Code__c = :erpCode, como tu {!variable} del Get Records. Y solo quieres la más reciente: ORDER BY CreatedDate DESC LIMIT 1.",
          en: "Another system wrote that code: it enters the query with a colon, Account.ERP_Code__c = :erpCode, like your Get Records {!variable}. And you only want the most recent: ORDER BY CreatedDate DESC LIMIT 1.",
        },
      },
      {
        id: "m11-l04-c4",
        label: { es: "Si no existe, responde 404", en: "If it does not exist, it answers 404" },
        rule: {
          op: "match",
          pattern: "isEmpty\\s*\\(\\s*\\)\\s*\\)\\s*\\{[^}]*RestContext\\s*\\.\\s*response\\s*\\.\\s*statusCode\\s*=\\s*404[^}]*return\\s+null\\s*;",
        },
        onFail: {
          es: "if (found.isEmpty()) { RestContext.response.statusCode = 404; return null; }",
          en: "if (found.isEmpty()) { RestContext.response.statusCode = 404; return null; }",
        },
        otter: {
          es: "Trata al ERP como te gusta que te traten: si no hay renovación, dilo con el código de estado. if (found.isEmpty()) { RestContext.response.statusCode = 404; return null; }",
          en: "Treat the ERP the way you like to be treated: if there is no renewal, say so with the status code. if (found.isEmpty()) { RestContext.response.statusCode = 404; return null; }",
        },
      },
    ],
    rubric: [
      {
        es: "¿Cómo probarías este servicio en un test? Pista: RestContext.request se puede preparar a mano con new RestRequest().",
        en: "How would you test this service? Hint: RestContext.request can be prepared by hand with new RestRequest().",
      },
    ],
    voice: "otter",
    outro: {
      es: "El puente ya tiene dos sentidos: Salesforce llama y Salesforce contesta. Pero no todos los sistemas hablan REST y JSON. En la tarea 5 te toca el veterano de la casa: el sistema de facturación, que habla SOAP.",
      en: "The bridge now runs both ways: Salesforce calls and Salesforce answers. But not every system speaks REST and JSON. In task 5 you get the house veteran: the invoicing system, which speaks SOAP.",
    },
  },
};
