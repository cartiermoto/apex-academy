import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, por dentro
// Tarea 7 de 7 · La entrega: enviar las renovaciones y leer qué aceptó el ERP.

public class ErpClient {
    // El molde de la respuesta:
    // {"accepted":["ERP-100"],"rejected":[{"erpCode":"ERP-200","reason":"Cliente bloqueado"}]}
    public class Rejection {
        public String erpCode;
        public String reason;
    }
    public class PushResult {
        public List<String> accepted;
        public List<Rejection> rejected;
    }

    public static PushResult pushRenewals(List<Opportunity> renewals) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:ERP/renewals');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setBody(JSON.serialize(renewals));

        HttpResponse res = new Http().send(req);
        if (res.getStatusCode() != 200) {
            throw new ErpApiException('El ERP respondió ' + res.getStatusCode());
        }
        PushResult result = (PushResult) JSON.deserialize(res.getBody(), PushResult.class);

        // Solo se marcan las que el ERP aceptó, y después de la llamada
        List<Opportunity> toUpdate = new List<Opportunity>();
        for (Opportunity o : renewals) {
            if (result.accepted.contains(o.Account.ERP_Code__c)) {
                o.ERP_Synced__c = true;
                toUpdate.add(o);
            }
        }
        update toUpdate;
        return result;
    }
}`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, por dentro\n// Tarea 7 de 7 · La entrega: enviar las renovaciones y leer qué aceptó el ERP.",
  "// CASE: the ERP bridge, from the inside\n// Task 7 of 7 · The delivery: send the renewals and read what the ERP accepted.",
)
  .replace("// El molde de la respuesta:", "// The response's mould:")
  .replace('"reason":"Cliente bloqueado"', '"reason":"Customer blocked"')
  .replace("'El ERP respondió '", "'The ERP answered '")
  .replace("// Solo se marcan las que el ERP aceptó, y después de la llamada", "// Only the ones the ERP accepted are marked, and after the call");

const STARTER_ES = `// CASO: el puente con el ERP, por dentro
// Ya resuelto (tareas 1-6): callouts, JSON, Named Credentials, tu propia API, SOAP y reintentos.
// Tarea 7 de 7 · La entrega: enviar las renovaciones y leer qué aceptó el ERP.

// La «caja cerrada» de los Módulos 9 y 10, tal como estaba:
public class ErpClient {
    // El ERP responde:
    // {"accepted":["ERP-100"],"rejected":[{"erpCode":"ERP-200","reason":"Cliente bloqueado"}]}

    public static void pushRenewals(List<Opportunity> renewals) {
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:ERP/renewals');
        req.setMethod('POST');
        req.setBody(JSON.serialize(renewals));
        http.send(req);

        for (Opportunity o : renewals) {
            o.ERP_Synced__c = true;
        }
        update renewals;
    }
}
`;

export const l07Checkpoint: Lesson = {
  id: "m11-l07",
  slug: "checkpoint",
  n: 7,
  kind: "checkpoint",
  minutes: 50,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 6", en: "Remember? · Review of lesson 6" },
    prompt: { es: "¿Qué impide que un reintento se convierta en un bucle infinito?", en: "What keeps a retry from becoming an infinite loop?" },
    options: [
      { es: "Un tope de intentos que viaja con el trabajo", en: "An attempt cap travelling with the job" },
      { es: "Salesforce lo para solo", en: "Salesforce stops it on its own" },
      { es: "El tiempo de espera del callout", en: "The callout's timeout" },
    ],
    answer: 0,
    explain: {
      es: "El contador de intentos, con su if. Hoy juntas todas las piezas del módulo en el cliente del ERP.",
      en: "The attempt counter, with its if. Today you put every piece of the module together in the ERP client.",
    },
  },
  title: { es: "Checkpoint del Módulo 11", en: "Module 11 checkpoint" },
  summary: {
    es: "La entrega: abrir la «caja cerrada» que llamaba al ERP y rehacerla bien. Petición con su formato, código de estado comprobado, respuesta leída con moldes, y marcar como enviadas solo las renovaciones que el ERP aceptó.",
    en: "The delivery: open the «closed box» that called the ERP and redo it properly. A request with its format, a checked status code, a response read with moulds, and marking as sent only the renewals the ERP accepted.",
  },
  analogy: {
    es: "Una carga de Data Loader con su success.csv y su error.csv, pero contra otro sistema",
    en: "A Data Loader load with its success.csv and error.csv, but against another system",
  },
  objectives: [
    { es: "Montar una petición POST con cuerpo JSON y su cabecera.", en: "Build a POST request with a JSON body and its header." },
    { es: "Leer una respuesta con listas y objetos anidados.", en: "Read a response with nested lists and objects." },
    { es: "Actuar registro a registro según lo que respondió el otro sistema.", en: "Act record by record on what the other system answered." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Durante tres módulos, el código que enviaba las renovaciones al ERP fue una caja cerrada. Ábrela: envía sin decir en qué formato, no mira el código de estado, no lee la respuesta y marca todo como enviado. Y el ERP lleva meses contestando con algo que nadie leía: qué renovaciones aceptó y cuáles rechazó, con su motivo.",
        en: "For three modules, the code sending the renewals to the ERP was a closed box. Open it: it sends without saying which format, does not check the status code, does not read the response and marks everything as sent. And the ERP has spent months answering with something nobody read: which renewals it accepted and which it rejected, with the reason.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Pieza", en: "Piece" },
        { es: "Qué hace en la entrega", en: "What it does in the delivery" },
        { es: "Tarea", en: "Task" },
      ],
      rows: [
        [{ es: "HttpRequest + Http", en: "HttpRequest + Http" }, { es: "POST con el cuerpo y la cabecera Content-Type.", en: "POST with the body and the Content-Type header." }, { es: "1", en: "1" }],
        [{ es: "getStatusCode()", en: "getStatusCode()" }, { es: "Si no es 200, excepción: no se lee ni se marca nada.", en: "If not 200, exception: nothing is read or marked." }, { es: "1", en: "1" }],
        [{ es: "JSON y moldes", en: "JSON and moulds" }, { es: "La lista accepted y la lista de objetos rejected.", en: "The accepted list and the rejected list of objects." }, { es: "2", en: "2" }],
        [{ es: "Named Credential", en: "Named Credential" }, { es: "callout:ERP: ni dirección ni clave en el código.", en: "callout:ERP: no address or key in the code." }, { es: "3", en: "3" }],
        [{ es: "Callout antes que DML", en: "Callout before DML" }, { es: "Primero la respuesta, después el update.", en: "First the response, then the update." }, { es: "6", en: "6" }],
      ],
    },
    {
      type: "diagram",
      id: "m11-cp-roundtrip",
      caption: {
        es: "Sigue un envío completo: qué sale, qué vuelve y qué renovaciones quedan marcadas con la caja vieja y con la nueva.",
        en: "Follow a full send: what goes out, what comes back and which renewals end up marked with the old box and the new one.",
      },
    },
    {
      type: "h",
      text: { es: "Un molde con una lista dentro", en: "A mould with a list inside" },
    },
    {
      type: "code",
      code: {
        es: `// {"accepted":["ERP-100"],"rejected":[{"erpCode":"ERP-200","reason":"Cliente bloqueado"}]}
public class Rejection {
    public String erpCode;
    public String reason;
}
public class PushResult {
    public List<String> accepted;        // una lista de textos
    public List<Rejection> rejected;     // una lista de objetos, cada uno con su molde
}`,
        en: `// {"accepted":["ERP-100"],"rejected":[{"erpCode":"ERP-200","reason":"Customer blocked"}]}
public class Rejection {
    public String erpCode;
    public String reason;
}
public class PushResult {
    public List<String> accepted;        // a list of texts
    public List<Rejection> rejected;     // a list of objects, each with its mould
}`,
      },
      caption: {
        es: "Los corchetes del JSON son List en Apex; las llaves, una clase. Un molde puede contener otros, como un objeto con su lista relacionada.",
        en: "JSON brackets are List in Apex; braces, a class. A mould can contain others, like an object with its related list.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Aquí está la frontera", en: "Why not a Flow? Here is the border" },
      text: {
        es: "Este módulo ha sido honesto con Flow: una llamada sencilla, con su Named Credential y su JSON de forma fija, se hace bien con la acción HTTP Callout. La frontera está en lo que has construido aquí: una tanda de 100 renovaciones en una sola petición, una respuesta que hay que cruzar registro a registro, tu propia API con sus códigos de estado, un sistema SOAP y reintentos con contador. Cuando la integración es eso, es código. Saber dónde está esa frontera es lo que te distingue de quien solo sabe una de las dos cosas.",
        en: "This module has been honest with Flow: a simple call, with its Named Credential and fixed-shape JSON, is done well with the HTTP Callout action. The border lies in what you built here: a chunk of 100 renewals in a single request, a response to be matched record by record, your own API with its status codes, a SOAP system and retries with a counter. When the integration is that, it is code. Knowing where that border lies is what sets you apart from someone who knows only one of the two.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "Lo que viene: el Módulo 12", en: "What comes next: Module 12" },
    },
    {
      type: "p",
      text: {
        es: "En la tarea 4 escribiste with sharing sin saber del todo qué hacía. El último módulo va de eso: Apex puede ejecutarse con más poder que el usuario que lo dispara, y asegurarte de que no enseña ni cambia lo que ese usuario no debería tocar es responsabilidad tuya. Es el Módulo 12, y con él se desbloquea el Desafío 2.",
        en: "In task 4 you wrote with sharing without quite knowing what it did. The last module is about that: Apex can run with more power than the user who triggers it, and making sure it does not show or change what that user should not touch is your responsibility. That is Module 12, and it unlocks Challenge 2.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes del quiz", en: "Before the quiz" },
      text: {
        es: "Sin mirar: ¿qué cuatro fallos tenía la caja cerrada? ¿Cómo se escribe en Apex un JSON con una lista de objetos dentro? ¿Por qué el update va después del http.send?",
        en: "Without looking: which four faults did the closed box have? How do you write in Apex a JSON with a list of objects inside? Why does the update go after the http.send?",
      },
    },
  ],

  quiz: [
    {
      id: "m11-cp-q1",
      kind: "multi",
      prompt: { es: "¿Qué fallos tenía la «caja cerrada» que enviaba al ERP?", en: "Which faults did the «closed box» sending to the ERP have?" },
      options: [
        { es: "No miraba el código de estado", en: "It did not check the status code" },
        { es: "No leía la respuesta del ERP", en: "It did not read the ERP's response" },
        { es: "Marcaba todas como enviadas, también las rechazadas", en: "It marked all as sent, including the rejected ones" },
        { es: "Usaba una Named Credential", en: "It used a Named Credential" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "La Named Credential era lo único que hacía bien.",
        en: "The Named Credential was the only thing it did right.",
      },
    },
    {
      id: "m11-cp-q2",
      kind: "single",
      prompt: {
        es: "¿Qué molde lee \"rejected\":[{\"erpCode\":\"ERP-200\",\"reason\":\"…\"}]?",
        en: "Which mould reads \"rejected\":[{\"erpCode\":\"ERP-200\",\"reason\":\"…\"}]?",
      },
      options: [
        { es: "public List<Rejection> rejected; con una clase Rejection de dos atributos", en: "public List<Rejection> rejected; with a two-attribute Rejection class" },
        { es: "public String rejected;", en: "public String rejected;" },
        { es: "public Rejection rejected;", en: "public Rejection rejected;" },
        { es: "public List<String> rejected;", en: "public List<String> rejected;" },
      ],
      answer: 0,
      explain: {
        es: "Corchetes, List; llaves, una clase. Una lista de objetos es List<TuClase>.",
        en: "Brackets, List; braces, a class. A list of objects is List<YourClass>.",
      },
    },
    {
      id: "m11-cp-q3",
      kind: "single",
      prompt: {
        es: "El ERP acepta ERP-100 y rechaza ERP-200. ¿Qué renovaciones quedan con ERP_Synced__c = true?",
        en: "The ERP accepts ERP-100 and rejects ERP-200. Which renewals end up with ERP_Synced__c = true?",
      },
      options: [
        { es: "Solo la de ERP-100", en: "Only ERP-100's" },
        { es: "Las dos", en: "Both" },
        { es: "Ninguna", en: "Neither" },
        { es: "Solo la de ERP-200", en: "Only ERP-200's" },
      ],
      answer: 0,
      explain: {
        es: "Se marca lo que el ERP aceptó. La rechazada sigue pendiente, y su motivo está en result.rejected.",
        en: "What the ERP accepted is marked. The rejected one stays pending, and its reason is in result.rejected.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m11-cp-q4",
      kind: "text",
      prompt: {
        es: "Escribe la línea que dice al ERP que el cuerpo de la petición req es JSON.",
        en: "Write the line telling the ERP that the req request's body is JSON.",
      },
      accept: ["req\\.setheader\\(\\s*'content-type'\\s*,\\s*'application/json'\\s*\\)\\s*;?"],
      placeholder: { es: "req.setHeader(…)", en: "req.setHeader(…)" },
      explain: {
        es: "req.setHeader('Content-Type', 'application/json');",
        en: "req.setHeader('Content-Type', 'application/json');",
      },
      tags: ["recall"],
    },
    {
      id: "m11-cp-q5",
      kind: "single",
      prompt: {
        es: "Diccionario Flow → Apex: ¿qué equivale a la acción HTTP Callout de un flow?",
        en: "Flow → Apex dictionary: what matches a flow's HTTP Callout action?",
      },
      options: [
        { es: "HttpRequest, Http y HttpResponse, con JSON.deserialize para leer la respuesta", en: "HttpRequest, Http and HttpResponse, with JSON.deserialize to read the response" },
        { es: "@RestResource", en: "@RestResource" },
        { es: "WSDL2Apex", en: "WSDL2Apex" },
        { es: "Un Batch", en: "A Batch" },
      ],
      answer: 0,
      explain: {
        es: "@RestResource es al revés (te llaman a ti), y WSDL2Apex es para SOAP, que Flow no cubre.",
        en: "@RestResource is the other way round (you get called), and WSDL2Apex is for SOAP, which Flow does not cover.",
      },
    },
    {
      id: "m11-cp-q6",
      kind: "single",
      prompt: {
        es: "¿Por qué el update de las renovaciones va después del http.send?",
        en: "Why does the renewals' update go after the http.send?",
      },
      options: [
        { es: "Porque hasta leer la respuesta no sabes cuáles marcar, y porque no se llama fuera con un DML pendiente", en: "Because until you read the response you do not know which to mark, and because you do not call out with a DML pending" },
        { es: "Por estilo", en: "For style" },
        { es: "Porque el update es más lento", en: "Because the update is slower" },
        { es: "Porque lo exige JSON.serialize", en: "Because JSON.serialize requires it" },
      ],
      answer: 0,
      explain: {
        es: "Dos razones que apuntan al mismo orden: la lógica y la regla del «uncommitted work pending».",
        en: "Two reasons pointing to the same order: logic and the «uncommitted work pending» rule.",
      },
    },
    {
      id: "m11-cp-q7",
      kind: "single",
      prompt: {
        es: "Repaso: en un test de pushRenewals, ¿cómo consigues que el ERP «responda» con un JSON concreto?",
        en: "Review: in a pushRenewals test, how do you make the ERP «answer» with a specific JSON?",
      },
      options: [
        { es: "Con un HttpCalloutMock cuyo respond haga res.setBody('…')", en: "With an HttpCalloutMock whose respond does res.setBody('…')" },
        { es: "Llamando al ERP de pruebas", en: "By calling the test ERP" },
        { es: "Con @testSetup", en: "With @testSetup" },
        { es: "No se puede", en: "It cannot be done" },
      ],
      answer: 0,
      explain: {
        es: "El mock del Módulo 10, ahora con un cuerpo JSON de verdad: así pruebas también el molde.",
        en: "Module 10's mock, now with a real JSON body: that way you test the mould too.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M10 L6", en: "Review · M10 L6" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 7 DE 7 · La entrega. Abre la caja cerrada y rehazla. pushRenewals tiene que enviar las renovaciones como JSON, comprobar que el ERP responde 200, leer su respuesta con moldes y marcar como enviadas solo las que el ERP aceptó. Y devolver el resultado, para que quien lo llame sepa cuáles se rechazaron y por qué.",
      en: "TASK 7 OF 7 · The delivery. Open the closed box and redo it. pushRenewals has to send the renewals as JSON, check the ERP answers 200, read its response with moulds and mark as sent only the ones the ERP accepted. And return the result, so the caller knows which were rejected and why.",
    },
    brief: [
      {
        es: "Dos moldes dentro de ErpClient: Rejection (erpCode, reason) y PushResult (List<String> accepted, List<Rejection> rejected).",
        en: "Two moulds inside ErpClient: Rejection (erpCode, reason) and PushResult (List<String> accepted, List<Rejection> rejected).",
      },
      {
        es: "La petición: POST a 'callout:ERP/renewals', con la cabecera Content-Type application/json y el cuerpo JSON.serialize(renewals).",
        en: "The request: POST to 'callout:ERP/renewals', with the Content-Type application/json header and the body JSON.serialize(renewals).",
      },
      {
        es: "Guarda la respuesta. Si el código no es 200, throw new ErpApiException. Si lo es, deserializa el cuerpo en un PushResult.",
        en: "Store the response. If the status is not 200, throw new ErpApiException. If it is, deserialize the body into a PushResult.",
      },
      {
        es: "Marca ERP_Synced__c = true solo en las renovaciones cuyo Account.ERP_Code__c esté en result.accepted, con un único update fuera del bucle, y devuelve el PushResult.",
        en: "Set ERP_Synced__c = true only on renewals whose Account.ERP_Code__c is in result.accepted, with a single update outside the loop, and return the PushResult.",
      },
    ],
    starter: {
      es: STARTER_ES,
      en: STARTER_ES.replace(
        "// CASO: el puente con el ERP, por dentro\n// Ya resuelto (tareas 1-6): callouts, JSON, Named Credentials, tu propia API, SOAP y reintentos.\n// Tarea 7 de 7 · La entrega: enviar las renovaciones y leer qué aceptó el ERP.",
        "// CASE: the ERP bridge, from the inside\n// Already solved (tasks 1-6): callouts, JSON, Named Credentials, your own API, SOAP and retries.\n// Task 7 of 7 · The delivery: send the renewals and read what the ERP accepted.",
      )
        .replace("// La «caja cerrada» de los Módulos 9 y 10, tal como estaba:", "// The «closed box» from Modules 9 and 10, as it stood:")
        .replace("// El ERP responde:", "// The ERP answers:")
        .replace('"reason":"Cliente bloqueado"', '"reason":"Customer blocked"'),
    },
    hints: [
      {
        es: "Yo lo pensaría como una carga de Data Loader contra otro sistema: envío el lote, miro si la carga fue bien, leo el success y el error, y solo doy por hechas las filas del success.",
        en: "I would think of it as a Data Loader load against another system: I send the batch, check whether the load went well, read the success and the error, and only count the success rows as done.",
      },
      {
        es: "Lo que me ayudó: empezar por los moldes, mirando el JSON de ejemplo. Corchetes son List; llaves, una clase. Después, la respuesta se guarda (HttpResponse res = …), se comprueba y se deserializa antes de tocar ninguna renovación.",
        en: "What helped me: start with the moulds, looking at the sample JSON. Brackets are List; braces, a class. Then the response is stored (HttpResponse res = …), checked and deserialized before touching any renewal.",
      },
      {
        es: "Te dejo el esquema: class Rejection { String erpCode; String reason; } class PushResult { List<String> accepted; List<Rejection> rejected; } · req.setHeader('Content-Type', 'application/json'); HttpResponse res = new Http().send(req); if (res.getStatusCode() != 200) { throw new ErpApiException(…); } PushResult result = (PushResult) JSON.deserialize(res.getBody(), PushResult.class); · for (o) { if (result.accepted.contains(o.Account.ERP_Code__c)) { o.ERP_Synced__c = true; toUpdate.add(o); } } update toUpdate; return result;",
        en: "Here is the outline: class Rejection { String erpCode; String reason; } class PushResult { List<String> accepted; List<Rejection> rejected; } · req.setHeader('Content-Type', 'application/json'); HttpResponse res = new Http().send(req); if (res.getStatusCode() != 200) { throw new ErpApiException(…); } PushResult result = (PushResult) JSON.deserialize(res.getBody(), PushResult.class); · for (o) { if (result.accepted.contains(o.Account.ERP_Code__c)) { o.ERP_Synced__c = true; toUpdate.add(o); } } update toUpdate; return result;",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m11-cp-c1",
        label: { es: "Los dos moldes de la respuesta", en: "The response's two moulds" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "class\\s+Rejection\\s*\\{[^}]*String\\s+erpCode\\s*;[^}]*String\\s+reason\\s*;" },
            { op: "match", pattern: "class\\s+PushResult\\s*\\{[^}]*List\\s*<\\s*String\\s*>\\s+accepted\\s*;" },
            { op: "match", pattern: "class\\s+PushResult\\s*\\{[^}]*List\\s*<\\s*Rejection\\s*>\\s+rejected\\s*;" },
          ],
        },
        onFail: {
          es: "public class Rejection { public String erpCode; public String reason; } y public class PushResult { public List<String> accepted; public List<Rejection> rejected; }",
          en: "public class Rejection { public String erpCode; public String reason; } and public class PushResult { public List<String> accepted; public List<Rejection> rejected; }",
        },
        otter: {
          es: "Mira el JSON de ejemplo como un CSV con una related list: accepted es una lista de textos (List<String>) y rejected, una lista de objetos con erpCode y reason (List<Rejection>). Cada llave, una clase.",
          en: "Read the sample JSON like a CSV with a related list: accepted is a list of texts (List<String>) and rejected, a list of objects with erpCode and reason (List<Rejection>). Each brace, a class.",
        },
      },
      {
        id: "m11-cp-c2",
        label: { es: "La petición dice que envía JSON", en: "The request says it sends JSON" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "\\.\\s*setEndpoint\\s*\\(\\s*'callout:ERP/renewals'\\s*\\)" },
            { op: "match", pattern: "\\.\\s*setMethod\\s*\\(\\s*'POST'\\s*\\)" },
            { op: "match", pattern: "\\.\\s*setHeader\\s*\\(\\s*'Content-Type'\\s*,\\s*'application/json'\\s*\\)" },
            { op: "match", pattern: "\\.\\s*setBody\\s*\\(\\s*JSON\\s*\\.\\s*serialize\\s*\\(" },
          ],
        },
        onFail: {
          es: "Añade req.setHeader('Content-Type', 'application/json'); junto al setEndpoint, el setMethod('POST') y el setBody(JSON.serialize(renewals)).",
          en: "Add req.setHeader('Content-Type', 'application/json'); next to the setEndpoint, the setMethod('POST') and the setBody(JSON.serialize(renewals)).",
        },
        otter: {
          es: "A la caja vieja le faltaba decir en qué idioma hablaba: req.setHeader('Content-Type', 'application/json'). El resto (POST, callout:ERP/renewals y JSON.serialize en el cuerpo) ya estaba.",
          en: "The old box never said which language it spoke: req.setHeader('Content-Type', 'application/json'). The rest (POST, callout:ERP/renewals and JSON.serialize in the body) was already there.",
        },
      },
      {
        id: "m11-cp-c3",
        label: { es: "Comprueba el 200 y lee la respuesta", en: "It checks the 200 and reads the response" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "HttpResponse\\s+\\w+\\s*=\\s*[^;]*\\.\\s*send\\s*\\(" },
            { op: "match", pattern: "getStatusCode\\s*\\(\\s*\\)\\s*!=\\s*200\\s*\\)\\s*\\{?\\s*throw\\s+new\\s+ErpApiException" },
            { op: "match", pattern: "\\(\\s*PushResult\\s*\\)\\s*JSON\\s*\\.\\s*deserialize\\s*\\(\\s*\\w+\\s*\\.\\s*getBody\\s*\\(\\s*\\)\\s*,\\s*PushResult\\s*\\.\\s*class\\s*\\)" },
          ],
        },
        onFail: {
          es: "HttpResponse res = new Http().send(req); if (res.getStatusCode() != 200) { throw new ErpApiException(…); } PushResult result = (PushResult) JSON.deserialize(res.getBody(), PushResult.class);",
          en: "HttpResponse res = new Http().send(req); if (res.getStatusCode() != 200) { throw new ErpApiException(…); } PushResult result = (PushResult) JSON.deserialize(res.getBody(), PushResult.class);",
        },
        otter: {
          es: "La caja vieja tiraba la respuesta. Guárdala, mira el código de estado antes que nada y, si es 200, conviértela: (PushResult) JSON.deserialize(res.getBody(), PushResult.class).",
          en: "The old box threw the response away. Store it, check the status code before anything else and, if it is 200, convert it: (PushResult) JSON.deserialize(res.getBody(), PushResult.class).",
        },
      },
      {
        id: "m11-cp-c4",
        label: { es: "Solo se marcan las aceptadas, con un update", en: "Only the accepted ones are marked, with one update" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "\\.\\s*accepted\\s*\\.\\s*contains\\s*\\(\\s*\\w+\\s*\\.\\s*Account\\s*\\.\\s*ERP_Code__c\\s*\\)" },
            { op: "match", pattern: "\\.\\s*send\\s*\\([\\s\\S]*ERP_Synced__c\\s*=\\s*true[\\s\\S]*\\bupdate\\s+\\w+\\s*;" },
            { op: "absent", pattern: "for\\s*\\([^)]*\\)\\s*\\{[^{}]*\\bupdate\\s+\\w+\\s*;" },
            { op: "absent", pattern: "for\\s*\\(\\s*Opportunity\\s+\\w+\\s*:\\s*\\w+\\s*\\)\\s*\\{\\s*\\w+\\s*\\.\\s*ERP_Synced__c\\s*=\\s*true" },
          ],
        },
        onFail: {
          es: "En el bucle: if (result.accepted.contains(o.Account.ERP_Code__c)) { o.ERP_Synced__c = true; toUpdate.add(o); } y, fuera, un único update toUpdate;",
          en: "In the loop: if (result.accepted.contains(o.Account.ERP_Code__c)) { o.ERP_Synced__c = true; toUpdate.add(o); } and, outside, a single update toUpdate;",
        },
        otter: {
          es: "Solo das por hechas las filas del success: si result.accepted contiene el código de la cuenta de esa renovación, se marca y se añade a una lista. Las rechazadas siguen pendientes. Y un solo update, fuera del bucle.",
          en: "You only count the success rows as done: if result.accepted contains that renewal's account code, it is marked and added to a list. The rejected ones stay pending. And a single update, outside the loop.",
        },
      },
      {
        id: "m11-cp-c5",
        label: { es: "Devuelve el resultado a quien lo llama", en: "It returns the result to its caller" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "static\\s+PushResult\\s+pushRenewals\\s*\\(" },
            { op: "match", pattern: "return\\s+\\w+\\s*;" },
          ],
        },
        onFail: {
          es: "public static PushResult pushRenewals(List<Opportunity> renewals) { … return result; }",
          en: "public static PushResult pushRenewals(List<Opportunity> renewals) { … return result; }",
        },
        otter: {
          es: "Quien llama necesita el error.csv: cambia void por PushResult y termina con return result. Así el Batch nocturno puede contar los rechazos y sus motivos.",
          en: "The caller needs the error.csv: change void to PushResult and end with return result. That way the nightly Batch can count the rejections and their reasons.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué pasa con una renovación que el ERP no menciona ni en accepted ni en rejected? ¿Queda pendiente o enviada? ¿Es lo que quieres?",
        en: "What happens to a renewal the ERP mentions in neither accepted nor rejected? Does it stay pending or sent? Is that what you want?",
      },
      {
        es: "En una entrevista te preguntarán cómo harías una integración con otro sistema. Esta entrega es tu respuesta: Named Credential, código de estado, moldes JSON, callout antes que DML y reintentos. ¿Sabrías contarla en dos minutos?",
        en: "In an interview you will be asked how you would integrate with another system. This delivery is your answer: Named Credential, status code, JSON moulds, callout before DML and retries. Could you tell it in two minutes?",
      },
    ],
    voice: "otter",
    outro: {
      es: "¡Abriste la caja y la dejaste bien hecha! El puente ya llama, entiende lo que le contestan, se deja llamar, habla con el veterano de SOAP y no se rinde al primer fallo. Queda un módulo, el más corto y quizá el más serio: la seguridad. Con él se desbloquea el Desafío 2.",
      en: "You opened the box and left it done properly! The bridge now calls, understands the answers, lets itself be called, talks to the SOAP veteran and does not give up at the first failure. One module is left, the shortest and perhaps the most serious: security. It unlocks Challenge 2.",
    },
  },
};
