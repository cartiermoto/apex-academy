import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, por dentro
// Tarea 1 de 7: la primera llamada escrita por ti: consultar una renovación en el ERP.

public class ErpApiException extends Exception {}

public class ErpClient {
    public static String fetchRenewal(String erpCode) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:ERP/renewals/' + erpCode);   // lección 3
        req.setMethod('GET');
        req.setTimeout(20000);                                // 20 s; por defecto son 10

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() != 200) {
            throw new ErpApiException('El ERP respondió ' + res.getStatusCode() + ' para ' + erpCode);
        }
        return res.getBody();
    }
}`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, por dentro\n// Tarea 1 de 7: la primera llamada escrita por ti: consultar una renovación en el ERP.",
  "// CASE: the ERP bridge, from the inside\n// Task 1 of 7: the first call written by you: look up a renewal in the ERP.",
)
  .replace("// lección 3", "// lesson 3")
  .replace("// 20 s; por defecto son 10", "// 20 s; the default is 10")
  .replace("'El ERP respondió '", "'The ERP answered '")
  .replace("' para '", "' for '");

export const l01HttpCallouts: Lesson = {
  id: "m11-l01",
  slug: "http-callouts",
  n: 1,
  kind: "lesson",
  minutes: 25,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso del Módulo 10", en: "Remember? · Review of Module 10" },
    prompt: { es: "¿Qué hace un test cuando el código llama a un sistema externo?", en: "What does a test do when the code calls an external system?" },
    options: [
      { es: "Usa un HttpCalloutMock que responde en su lugar", en: "It uses an HttpCalloutMock that answers instead" },
      { es: "Llama al sistema de verdad", en: "It calls the real system" },
      { es: "Se salta esa línea", en: "It skips that line" },
    ],
    answer: 0,
    explain: {
      es: "El mock contestaba a un código que te dábamos hecho. Hoy escribes ese código tú.",
      en: "The mock answered code we handed you. Today you write that code yourself.",
    },
  },
  title: { es: "HTTP callouts: Http, HttpRequest, HttpResponse", en: "HTTP callouts: Http, HttpRequest, HttpResponse" },
  summary: {
    es: "Un callout son tres objetos: la petición que montas (HttpRequest), el que la envía (Http) y la respuesta que vuelve (HttpResponse). Y una regla: mirar siempre el código de estado antes de fiarte del cuerpo.",
    en: "A callout is three objects: the request you build (HttpRequest), the one that sends it (Http) and the response that comes back (HttpResponse). And one rule: always check the status code before trusting the body.",
  },
  analogy: {
    es: "La acción HTTP Callout de un flow, escrita por dentro",
    en: "A flow's HTTP Callout action, written from the inside",
  },
  objectives: [
    { es: "Montar y enviar una petición HTTP desde Apex.", en: "Build and send an HTTP request from Apex." },
    { es: "Leer el código de estado y el cuerpo de la respuesta.", en: "Read the response's status code and body." },
    { es: "Conocer los límites de los callouts: cuántos y cuánto tiempo.", en: "Know callout limits: how many and how long." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Durante tres módulos, el código que llamaba al ERP venía hecho, como una caja cerrada. Ahora el equipo de cuentas quiere algo nuevo: consultar en el ERP el estado de una renovación concreta, desde Salesforce. Es la primera llamada que vas a escribir tú, línea a línea.",
        en: "For three modules, the code calling the ERP came ready-made, like a closed box. Now the accounts team wants something new: look up a specific renewal's status in the ERP, from Salesforce. It is the first call you will write yourself, line by line.",
      },
    },
    {
      type: "h",
      text: { es: "Tres objetos", en: "Three objects" },
    },
    {
      type: "code",
      code: {
        es: `HttpRequest req = new HttpRequest();               // 1 · la petición
req.setEndpoint('callout:ERP/renewals/ERP-100');   //     a dónde
req.setMethod('GET');                              //     qué quieres hacer

Http http = new Http();                            // 2 · el que la envía
HttpResponse res = http.send(req);                 // 3 · la respuesta

Integer status = res.getStatusCode();              // 200, 404, 500…
String body = res.getBody();                       // el contenido, normalmente JSON`,
        en: `HttpRequest req = new HttpRequest();               // 1 · the request
req.setEndpoint('callout:ERP/renewals/ERP-100');   //     where to
req.setMethod('GET');                              //     what you want to do

Http http = new Http();                            // 2 · the sender
HttpResponse res = http.send(req);                 // 3 · the response

Integer status = res.getStatusCode();              // 200, 404, 500…
String body = res.getBody();                       // the content, usually JSON`,
      },
    },
    {
      type: "p",
      text: {
        es: "El método dice qué quieres hacer: GET para leer, POST para crear, PUT o PATCH para cambiar, DELETE para borrar. Si envías datos, van en el cuerpo con setBody y una cabecera que diga en qué formato: setHeader('Content-Type', 'application/json'). La dirección empieza por callout:ERP porque es una [[named-credential|Named Credential]]: la verás en la lección 3.",
        en: "The method says what you want to do: GET to read, POST to create, PUT or PATCH to change, DELETE to delete. If you send data, it goes in the body with setBody and a header saying which format: setHeader('Content-Type', 'application/json'). The address starts with callout:ERP because it is a [[named-credential|Named Credential]]: you will see it in lesson 3.",
      },
    },
    {
      type: "diagram",
      id: "m11-request",
      caption: {
        es: "Monta la petición pieza a pieza, envíala y mira qué vuelve según responda el ERP.",
        en: "Build the request piece by piece, send it and see what comes back depending on the ERP's answer.",
      },
    },
    {
      type: "h",
      text: { es: "El código de estado manda", en: "The status code rules" },
    },
    {
      type: "p",
      text: {
        es: "Un error del otro sistema no lanza una excepción en Apex: http.send devuelve la respuesta y tu código sigue. Si el ERP contesta 404 (no existe) o 500 (se ha roto), el cuerpo no es lo que esperas. Por eso, antes de usar el cuerpo, mira getStatusCode(): 200 y 201 son éxito, 4xx es que la petición estaba mal, 5xx es que el otro sistema falló. Es el fallo que destapó el test del Módulo 10.",
        en: "An error in the other system does not throw an exception in Apex: http.send returns the response and your code goes on. If the ERP answers 404 (does not exist) or 500 (it broke), the body is not what you expect. So, before using the body, check getStatusCode(): 200 and 201 are success, 4xx means the request was wrong, 5xx means the other system failed. It is the bug Module 10's test exposed.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Los límites de los callouts", en: "Callout limits" },
      text: {
        es: "Una transacción admite como mucho 100 callouts. Cada uno espera por defecto 10 segundos y puedes subirlo con setTimeout hasta 120.000 ms, pero entre todos no pueden pasar de 120 segundos por transacción. Y ya lo sabes del Módulo 9: no se llama fuera con un DML pendiente, ni desde un trigger directamente.",
        en: "A transaction allows at most 100 callouts. Each waits 10 seconds by default and you can raise it with setTimeout up to 120,000 ms, but together they cannot exceed 120 seconds per transaction. And you know from Module 9: you do not call out with a DML pending, nor straight from a trigger.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Aquí Flow también llama", en: "Why not a Flow? Here Flow calls too" },
      text: {
        es: "Con franqueza: la acción HTTP Callout de un flow monta esta misma petición con clics, y para una consulta sencilla es una buena opción. Este módulo no te pide abandonarla: te enseña lo que hay dentro, porque el puente del ERP necesita lo que los clics no dan, como reintentar con tu propia lógica (lección 6), exponer tu propia API (lección 4) o hablar con un sistema SOAP (lección 5).",
        en: "Frankly: a flow's HTTP Callout action builds this same request with clicks, and for a simple lookup it is a good option. This module does not ask you to drop it: it shows you what is inside, because the ERP bridge needs what clicks do not give, like retrying with your own logic (lesson 6), exposing your own API (lesson 4) or talking to a SOAP system (lesson 5).",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué objeto monta la petición, cuál la envía y cuál vuelve? ¿Lanza una excepción un 500 del ERP? ¿Cuántos callouts admite una transacción?",
        en: "Without looking: which object builds the request, which sends it and which comes back? Does an ERP 500 throw an exception? How many callouts does a transaction allow?",
      },
    },
  ],

  quiz: [
    {
      id: "m11-l01-q1",
      kind: "single",
      prompt: { es: "El ERP responde 500. ¿Qué hace http.send(req)?", en: "The ERP answers 500. What does http.send(req) do?" },
      options: [
        { es: "Devuelve la respuesta con código 500; el código sigue", en: "It returns the response with status 500; the code goes on" },
        { es: "Lanza una CalloutException", en: "It throws a CalloutException" },
        { es: "Devuelve null", en: "It returns null" },
        { es: "Reintenta solo", en: "It retries on its own" },
      ],
      answer: 0,
      explain: {
        es: "Un código de error es una respuesta como otra. La excepción llega si no hay respuesta, por ejemplo con un timeout.",
        en: "An error code is a response like any other. An exception comes when there is no response, for example on a timeout.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m11-l01-q2",
      kind: "single",
      prompt: { es: "¿Qué método HTTP usas para leer una renovación del ERP?", en: "Which HTTP method do you use to read a renewal from the ERP?" },
      options: [
        { es: "GET", en: "GET" },
        { es: "POST", en: "POST" },
        { es: "DELETE", en: "DELETE" },
        { es: "PATCH", en: "PATCH" },
      ],
      answer: 0,
      explain: { es: "GET lee; POST crea; PUT o PATCH cambian; DELETE borra.", en: "GET reads; POST creates; PUT or PATCH change; DELETE deletes." },
    },
    {
      id: "m11-l01-q3",
      kind: "multi",
      prompt: { es: "¿Qué es cierto sobre los límites de los callouts?", en: "What is true about callout limits?" },
      options: [
        { es: "Como mucho 100 por transacción", en: "At most 100 per transaction" },
        { es: "Cada uno espera 10 s por defecto", en: "Each waits 10 s by default" },
        { es: "Entre todos, como mucho 120 s por transacción", en: "Together, at most 120 s per transaction" },
        { es: "En asíncrono no tienen límite", en: "In async they have no limit" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Los límites de callouts valen igual en síncrono y en asíncrono.",
        en: "Callout limits apply equally in sync and async.",
      },
    },
    {
      id: "m11-l01-q4",
      kind: "text",
      prompt: {
        es: "Escribe la línea que envía la petición req y guarda la respuesta en res (el objeto Http se llama http).",
        en: "Write the line that sends the req request and stores the response in res (the Http object is called http).",
      },
      accept: ["httpresponse\\s+res\\s*=\\s*http\\.send\\(\\s*req\\s*\\)\\s*;?", "res\\s*=\\s*http\\.send\\(\\s*req\\s*\\)\\s*;?"],
      placeholder: { es: "HttpResponse res = …", en: "HttpResponse res = …" },
      explain: { es: "HttpResponse res = http.send(req);", en: "HttpResponse res = http.send(req);" },
      tags: ["recall"],
    },
    {
      id: "m11-l01-q5",
      kind: "single",
      prompt: { es: "¿Qué significa un código 404?", en: "What does a 404 status mean?" },
      options: [
        { es: "Lo que pediste no existe en el otro sistema", en: "What you asked for does not exist in the other system" },
        { es: "Todo fue bien", en: "Everything went fine" },
        { es: "El otro sistema se ha roto", en: "The other system broke" },
        { es: "Salesforce rechazó la petición", en: "Salesforce rejected the request" },
      ],
      answer: 0,
      explain: { es: "4xx: tu petición tiene un problema (404, no existe). 5xx: el problema es del otro lado.", en: "4xx: your request has a problem (404, not found). 5xx: the problem is on the other side." },
    },
    {
      id: "m11-l01-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿qué pasa si haces un callout justo después de un insert en la misma transacción?",
        en: "Review: what happens if you make a callout right after an insert in the same transaction?",
      },
      options: [
        { es: "Falla: «You have uncommitted work pending»", en: "It fails: «You have uncommitted work pending»" },
        { es: "Funciona", en: "It works" },
        { es: "El insert se deshace", en: "The insert is rolled back" },
        { es: "El callout espera al commit", en: "The callout waits for the commit" },
      ],
      answer: 0,
      explain: { es: "Primero la llamada, después el guardado: la regla del Módulo 9.", en: "First the call, then the save: Module 9's rule." },
      tags: ["spaced"],
      from: { es: "Repaso · M9 L6", en: "Review · M9 L6" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 1 DE 7 · El equipo de cuentas quiere consultar en el ERP el estado de una renovación por su código. Escribe ErpClient.fetchRenewal(erpCode): una petición GET a callout:ERP/renewals/ más el código, con 20 segundos de espera, que devuelva el cuerpo si el ERP responde 200 y lance ErpApiException si no.",
      en: "TASK 1 OF 7 · The accounts team wants to look up a renewal's status in the ERP by its code. Write ErpClient.fetchRenewal(erpCode): a GET request to callout:ERP/renewals/ plus the code, with a 20-second wait, returning the body if the ERP answers 200 and throwing ErpApiException otherwise.",
    },
    brief: [
      {
        es: "HttpRequest con setEndpoint('callout:ERP/renewals/' + erpCode), setMethod('GET') y setTimeout(20000).",
        en: "HttpRequest with setEndpoint('callout:ERP/renewals/' + erpCode), setMethod('GET') and setTimeout(20000).",
      },
      {
        es: "Envíala con un Http y guarda el HttpResponse.",
        en: "Send it with an Http and store the HttpResponse.",
      },
      {
        es: "Si getStatusCode() no es 200, throw new ErpApiException con el código de estado y el erpCode en el mensaje. Si lo es, return res.getBody().",
        en: "If getStatusCode() is not 200, throw new ErpApiException with the status code and the erpCode in the message. If it is, return res.getBody().",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, por dentro
// Ya resuelto (Módulos 8 a 10): el puente funciona, programado y probado, con un código de llamada que venía hecho.
// Tarea 1 de 7: la primera llamada escrita por ti: consultar una renovación en el ERP.

public class ErpApiException extends Exception {}

public class ErpClient {
    public static String fetchRenewal(String erpCode) {
        // GET a callout:ERP/renewals/{erpCode}, 20 s de espera, y comprobar el 200
        return null;
    }
}
`,
      en: `// CASE: the ERP bridge, from the inside
// Already solved (Modules 8 to 10): the bridge works, scheduled and tested, with call code that came ready-made.
// Task 1 of 7: the first call written by you: look up a renewal in the ERP.

public class ErpApiException extends Exception {}

public class ErpClient {
    public static String fetchRenewal(String erpCode) {
        // GET to callout:ERP/renewals/{erpCode}, 20 s wait, and check the 200
        return null;
    }
}
`,
    },
    hints: [
      {
        es: "Yo lo pensaría como la acción HTTP Callout de un flow: ¿a qué dirección, con qué método y qué hago con lo que vuelve?",
        en: "I would think of it like a flow's HTTP Callout action: to which address, with which method and what do I do with what comes back?",
      },
      {
        es: "Lo que me ayudó: son tres objetos, en este orden: HttpRequest (montar), Http (enviar) y HttpResponse (leer). Y el código de estado se mira antes que el cuerpo.",
        en: "What helped me: three objects, in this order: HttpRequest (build), Http (send) and HttpResponse (read). And the status code is checked before the body.",
      },
      {
        es: "Te dejo el esquema: HttpRequest req = new HttpRequest(); req.setEndpoint('callout:ERP/renewals/' + erpCode); req.setMethod('GET'); req.setTimeout(20000); HttpResponse res = new Http().send(req); if (res.getStatusCode() != 200) { throw new ErpApiException('…' + res.getStatusCode() + '…' + erpCode); } return res.getBody();",
        en: "Here is the outline: HttpRequest req = new HttpRequest(); req.setEndpoint('callout:ERP/renewals/' + erpCode); req.setMethod('GET'); req.setTimeout(20000); HttpResponse res = new Http().send(req); if (res.getStatusCode() != 200) { throw new ErpApiException('…' + res.getStatusCode() + '…' + erpCode); } return res.getBody();",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m11-l01-c1",
        label: { es: "La petición: dirección, método y espera", en: "The request: address, method and wait" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "new\\s+HttpRequest\\s*\\(\\s*\\)" },
            { op: "match", pattern: "\\.\\s*setEndpoint\\s*\\(\\s*'callout:ERP/renewals/'\\s*\\+\\s*erpCode\\s*\\)" },
            { op: "match", pattern: "\\.\\s*setMethod\\s*\\(\\s*'GET'\\s*\\)" },
            { op: "match", pattern: "\\.\\s*setTimeout\\s*\\(\\s*20000\\s*\\)" },
          ],
        },
        onFail: {
          es: "HttpRequest req = new HttpRequest(); req.setEndpoint('callout:ERP/renewals/' + erpCode); req.setMethod('GET'); req.setTimeout(20000);",
          en: "HttpRequest req = new HttpRequest(); req.setEndpoint('callout:ERP/renewals/' + erpCode); req.setMethod('GET'); req.setTimeout(20000);",
        },
        otter: {
          es: "Son los campos de la acción HTTP Callout, escritos a mano: setEndpoint('callout:ERP/renewals/' + erpCode), setMethod('GET') para leer y setTimeout(20000) para esperar 20 segundos.",
          en: "They are the HTTP Callout action's fields, written by hand: setEndpoint('callout:ERP/renewals/' + erpCode), setMethod('GET') to read and setTimeout(20000) to wait 20 seconds.",
        },
      },
      {
        id: "m11-l01-c2",
        label: { es: "Se envía y se guarda la respuesta", en: "It is sent and the response stored" },
        rule: { op: "match", pattern: "HttpResponse\\s+\\w+\\s*=\\s*(\\w+|new\\s+Http\\s*\\(\\s*\\))\\s*\\.\\s*send\\s*\\(\\s*\\w+\\s*\\)" },
        onFail: {
          es: "Http http = new Http(); HttpResponse res = http.send(req);",
          en: "Http http = new Http(); HttpResponse res = http.send(req);",
        },
        otter: {
          es: "El Http es el cartero: Http http = new Http(); HttpResponse res = http.send(req); y lo que vuelve se queda en res.",
          en: "The Http is the postman: Http http = new Http(); HttpResponse res = http.send(req); and what comes back stays in res.",
        },
      },
      {
        id: "m11-l01-c3",
        label: { es: "Si no es 200, lanza ErpApiException", en: "If not 200, it throws ErpApiException" },
        rule: {
          op: "match",
          pattern: "if\\s*\\(\\s*\\w+\\s*\\.\\s*getStatusCode\\s*\\(\\s*\\)\\s*!=\\s*200\\s*\\)\\s*\\{?\\s*throw\\s+new\\s+ErpApiException\\s*\\([^;]*getStatusCode\\s*\\(\\s*\\)[^;]*erpCode",
        },
        onFail: {
          es: "if (res.getStatusCode() != 200) { throw new ErpApiException('…' + res.getStatusCode() + '…' + erpCode); }",
          en: "if (res.getStatusCode() != 200) { throw new ErpApiException('…' + res.getStatusCode() + '…' + erpCode); }",
        },
        otter: {
          es: "La lección del Módulo 10: un 500 no lanza nada, así que lo miras tú. Si res.getStatusCode() != 200, lanza tu ErpApiException con el código y el erpCode, para saber qué falló y con qué renovación.",
          en: "Module 10's lesson: a 500 throws nothing, so you check it. If res.getStatusCode() != 200, throw your ErpApiException with the code and the erpCode, so you know what failed and with which renewal.",
        },
      },
      {
        id: "m11-l01-c4",
        label: { es: "Con 200, devuelve el cuerpo", en: "With 200, it returns the body" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "return\\s+\\w+\\s*\\.\\s*getBody\\s*\\(\\s*\\)\\s*;" },
            { op: "absent", pattern: "return\\s+null\\s*;" },
          ],
        },
        onFail: { es: "Al final: return res.getBody();", en: "At the end: return res.getBody();" },
        otter: {
          es: "Si llegaste hasta aquí, el ERP dijo 200: devuelve lo que contestó, return res.getBody(). En la tarea 2 aprenderás a leer ese JSON.",
          en: "If you got this far, the ERP said 200: return what it answered, return res.getBody(). In task 2 you will learn to read that JSON.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué debería pasar si el ERP responde 404 porque el código no existe? ¿Es lo mismo que un 500? ¿Lo tratarías igual?",
        en: "What should happen if the ERP answers 404 because the code does not exist? Is it the same as a 500? Would you handle it the same way?",
      },
    ],
    voice: "otter",
    outro: {
      es: "Ya llamas al ERP con tus propias manos. Pero lo que devuelves es un texto de JSON que nadie puede usar tal cual. En la tarea 2 lo conviertes en una clase con campos.",
      en: "You now call the ERP with your own hands. But what you return is a JSON text nobody can use as is. In task 2 you turn it into a class with fields.",
    },
  },
};
