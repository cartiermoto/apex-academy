import type { Lesson } from "@/lib/types";

const TAIL = `        req.setMethod('GET');
        HttpResponse res = new Http().send(req);
        if (res.getStatusCode() != 200) {
            throw new ErpApiException('Tax API: ' + res.getStatusCode());
        }
        return res.getBody();
    }
}`;

const SOLUTION_ES = `// CASO: el puente con el ERP, por dentro
// Tarea 3 de 7: ni direcciones ni claves en el código.

public class TaxClient {
    public static String fetchRate(String country) {
        HttpRequest req = new HttpRequest();
        // La dirección y la clave viven en Setup → Named Credentials → Tax_API
        req.setEndpoint('callout:Tax_API/v2/rates/' + country);
${TAIL}`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, por dentro\n// Tarea 3 de 7: ni direcciones ni claves en el código.",
  "// CASE: the ERP bridge, from the inside\n// Task 3 of 7: no addresses or keys in the code.",
).replace("// La dirección y la clave viven en Setup → Named Credentials → Tax_API", "// The address and the key live in Setup → Named Credentials → Tax_API");

const STARTER_ES = `// CASO: el puente con el ERP, por dentro
// Ya resuelto (tareas 1-2): ErpClient llama al ERP y entiende su JSON.
// Tarea 3 de 7: ni direcciones ni claves en el código.

// El cliente de la API de impuestos, tal como lo dejó un compañero:
public class TaxClient {
    public static String fetchRate(String country) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://tax.partner-northwind.com/v2/rates/' + country);
        req.setHeader('Authorization', 'Bearer clave-de-produccion-1234');
${TAIL}
`;

export const l03NamedCredentials: Lesson = {
  id: "m11-l03",
  slug: "named-credentials",
  n: 3,
  kind: "lesson",
  minutes: 25,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 2", en: "Remember? · Review of lesson 2" },
    prompt: {
      es: "El JSON del ERP trae un nombre que tu clase molde no tiene. ¿Qué pasa al deserializar?",
      en: "The ERP's JSON carries a name your mould class lacks. What happens on deserialize?",
    },
    options: [
      { es: "Se ignora", en: "It is ignored" },
      { es: "Salta una excepción", en: "An exception is thrown" },
      { es: "Se guarda en el primer atributo libre", en: "It is stored in the first free attribute" },
    ],
    answer: 0,
    explain: {
      es: "Lo desconocido se ignora. Hoy, lo que nunca debería estar en tu código: direcciones y claves.",
      en: "The unknown is ignored. Today, what should never be in your code: addresses and keys.",
    },
  },
  title: { es: "Named Credentials y Remote Site Settings", en: "Named Credentials and Remote Site Settings" },
  summary: {
    es: "Salesforce no deja llamar a una dirección que el Admin no haya autorizado. Una Named Credential guarda en Setup la dirección y la forma de autenticarse; el código solo escribe callout:Nombre, y ninguna clave vive en el código.",
    en: "Salesforce does not let you call an address the Admin has not authorised. A Named Credential keeps the address and the way to authenticate in Setup; code only writes callout:Name, and no key lives in code.",
  },
  analogy: {
    es: "Un usuario de integración que configura el Admin: el código solo lo nombra",
    en: "An integration user the Admin sets up: code only names it",
  },
  objectives: [
    { es: "Explicar por qué un callout a una URL sin autorizar falla.", en: "Explain why a callout to an unauthorised URL fails." },
    { es: "Usar una Named Credential en lugar de una URL y una clave escritas en el código.", en: "Use a Named Credential instead of a URL and a key written in code." },
    { es: "Entender por qué eso hace el código igual en sandbox y en producción.", en: "Understand why that keeps the code identical in sandbox and production." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Revisando el código del puente encuentras el cliente de la API de impuestos, de un compañero: la dirección escrita a mano y, en la línea siguiente, la clave de producción en una cabecera. Cualquiera con acceso al código la puede leer, está copiada en el repositorio para siempre, y en la sandbox ese código llama al sistema de verdad.",
        en: "Reviewing the bridge's code you find the tax API client, written by a teammate: the address typed by hand and, on the next line, the production key in a header. Anyone with access to the code can read it, it is copied in the repository forever, and in the sandbox that code calls the real system.",
      },
    },
    {
      type: "h",
      text: { es: "Salesforce no llama a cualquier sitio", en: "Salesforce does not call just anywhere" },
    },
    {
      type: "p",
      text: {
        es: "Por seguridad, un callout a una dirección que nadie ha autorizado falla con «Unauthorized endpoint». Hay dos formas de autorizarla. La antigua es Setup → Remote Site Settings: una lista de direcciones permitidas, y nada más; la clave seguiría en el código. La buena es una [[named-credential|Named Credential]]: autoriza la dirección y además guarda cómo autenticarse.",
        en: "For security, a callout to an address nobody authorised fails with «Unauthorized endpoint». There are two ways to authorise it. The old one is Setup → Remote Site Settings: a list of allowed addresses, and nothing else; the key would still be in the code. The good one is a [[named-credential|Named Credential]]: it authorises the address and also stores how to authenticate.",
      },
    },
    {
      type: "code",
      code: {
        es: `// Antes: dirección y clave a la vista
req.setEndpoint('https://tax.partner-northwind.com/v2/rates/' + country);
req.setHeader('Authorization', 'Bearer clave-de-produccion-1234');

// Después: el código solo nombra la credencial
req.setEndpoint('callout:Tax_API/v2/rates/' + country);`,
        en: `// Before: address and key in plain sight
req.setEndpoint('https://tax.partner-northwind.com/v2/rates/' + country);
req.setHeader('Authorization', 'Bearer clave-de-produccion-1234');

// After: the code only names the credential
req.setEndpoint('callout:Tax_API/v2/rates/' + country);`,
      },
      caption: {
        es: "callout:Tax_API se sustituye por la dirección guardada en Setup, y Salesforce añade la autenticación al enviar. El resto de la ruta se escribe detrás, como siempre.",
        en: "callout:Tax_API is replaced by the address stored in Setup, and Salesforce adds the authentication on send. The rest of the path is written after it, as usual.",
      },
    },
    {
      type: "diagram",
      id: "m11-named-credential",
      caption: {
        es: "Compara las dos formas: qué se ve en el código, a dónde llama cada entorno y qué hay que hacer para cambiar la clave.",
        en: "Compare both ways: what shows in the code, where each environment calls and what it takes to change the key.",
      },
    },
    {
      type: "list",
      items: [
        {
          es: "La clave no está en el código ni en el repositorio: vive cifrada en Setup, y quién puede usarla se decide con un permission set.",
          en: "The key is not in the code or the repository: it lives encrypted in Setup, and who can use it is decided with a permission set.",
        },
        {
          es: "El mismo código sirve en todos los entornos: en la sandbox, la credencial apunta al sistema de pruebas; en producción, al de verdad.",
          en: "The same code works in every environment: in the sandbox, the credential points at the test system; in production, at the real one.",
        },
        {
          es: "Cambiar la clave es una tarea de Admin en Setup, sin tocar código ni desplegar.",
          en: "Changing the key is an Admin task in Setup, with no code change or deployment.",
        },
      ],
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Esto lo configuras tú mejor que nadie", en: "You set this up better than anyone" },
      text: {
        es: "Aquí el Admin que llevas dentro tiene ventaja: una Named Credential se crea en Setup → Named Credentials, junto con su External Credential (que guarda la autenticación) y un permission set que da acceso. Es configuración, no código. En muchos equipos, el developer escribe callout:Tax_API y es el Admin quien la deja lista en cada entorno.",
        en: "Here the Admin in you has the edge: a Named Credential is created in Setup → Named Credentials, along with its External Credential (which stores the authentication) and a permission set granting access. It is configuration, not code. On many teams, the developer writes callout:Tax_API and the Admin makes it ready in each environment.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Aquí Flow te obligaba a hacerlo bien", en: "Why not a Flow? Here Flow made you do it right" },
      text: {
        es: "Te lo reconozco: la acción HTTP Callout de un flow no te deja escribir una dirección ni una clave; te pide una Named Credential desde el primer paso. En Apex nadie te obliga, y por eso aparece código como el de mi compañero. La regla es la misma en los dos mundos, solo que aquí la disciplina la pones tú.",
        en: "I will give you this: a flow's HTTP Callout action does not let you type an address or a key; it asks for a Named Credential from the first step. In Apex nobody forces you, and that is why code like my teammate's shows up. The rule is the same in both worlds, only here the discipline is yours.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué error da un callout a una dirección sin autorizar? ¿Qué guarda una Named Credential que un Remote Site Setting no guarda? ¿Qué hay que hacer para cambiar la clave?",
        en: "Without looking: which error does a callout to an unauthorised address give? What does a Named Credential store that a Remote Site Setting does not? What does it take to change the key?",
      },
    },
  ],

  quiz: [
    {
      id: "m11-l03-q1",
      kind: "single",
      prompt: {
        es: "Tu código llama a https://api.nueva.com y nadie ha configurado nada en Setup. ¿Qué pasa?",
        en: "Your code calls https://api.new.com and nobody has configured anything in Setup. What happens?",
      },
      options: [
        { es: "Falla: «Unauthorized endpoint»", en: "It fails: «Unauthorized endpoint»" },
        { es: "Funciona", en: "It works" },
        { es: "Salesforce pregunta al usuario", en: "Salesforce asks the user" },
        { es: "Devuelve 404", en: "It returns 404" },
      ],
      answer: 0,
      explain: {
        es: "Hay que autorizar la dirección: con un Remote Site Setting o, mejor, con una Named Credential.",
        en: "The address has to be authorised: with a Remote Site Setting or, better, a Named Credential.",
      },
    },
    {
      id: "m11-l03-q2",
      kind: "multi",
      prompt: { es: "¿Qué ganas con una Named Credential?", en: "What do you gain with a Named Credential?" },
      options: [
        { es: "La clave no está en el código ni en el repositorio", en: "The key is not in the code or the repository" },
        { es: "El mismo código sirve en sandbox y en producción", en: "The same code works in sandbox and production" },
        { es: "Cambiar la clave no necesita un despliegue", en: "Changing the key needs no deployment" },
        { es: "Los callouts dejan de contar para los límites", en: "Callouts stop counting toward limits" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Los límites de callouts no cambian: es una cuestión de seguridad y de mantenimiento.",
        en: "Callout limits do not change: it is a matter of security and maintenance.",
      },
    },
    {
      id: "m11-l03-q3",
      kind: "single",
      prompt: { es: "¿Qué hace un Remote Site Setting?", en: "What does a Remote Site Setting do?" },
      options: [
        { es: "Autoriza una dirección; no guarda ninguna autenticación", en: "It authorises an address; it stores no authentication" },
        { es: "Guarda la clave cifrada", en: "It stores the key encrypted" },
        { es: "Reintenta los callouts fallidos", en: "It retries failed callouts" },
        { es: "Sustituye a los tests", en: "It replaces tests" },
      ],
      answer: 0,
      explain: {
        es: "Solo es la lista de direcciones permitidas. Con él, la clave seguiría teniendo que estar en algún sitio.",
        en: "It is only the list of allowed addresses. With it, the key would still have to live somewhere.",
      },
    },
    {
      id: "m11-l03-q4",
      kind: "text",
      prompt: {
        es: "Escribe la dirección que usarías en setEndpoint para la ruta /v2/rates/ES con la Named Credential Tax_API (con sus comillas).",
        en: "Write the address you would use in setEndpoint for the path /v2/rates/ES with the Named Credential Tax_API (with its quotes).",
      },
      accept: ["'callout:tax_api/v2/rates/es'"],
      placeholder: { es: "'callout:…'", en: "'callout:…'" },
      explain: { es: "'callout:Tax_API/v2/rates/ES'", en: "'callout:Tax_API/v2/rates/ES'" },
      tags: ["recall"],
    },
    {
      id: "m11-l03-q5",
      kind: "single",
      prompt: {
        es: "El proveedor te obliga a cambiar la clave de la API esta tarde. Con una Named Credential, ¿qué hay que hacer?",
        en: "The provider makes you change the API key this afternoon. With a Named Credential, what does it take?",
      },
      options: [
        { es: "Cambiarla en Setup: ni código ni despliegue", en: "Change it in Setup: no code, no deployment" },
        { es: "Cambiar el código y desplegar con tests", en: "Change the code and deploy with tests" },
        { es: "Crear una sandbox nueva", en: "Create a new sandbox" },
        { es: "Nada: se cambia sola", en: "Nothing: it changes itself" },
      ],
      answer: 0,
      explain: {
        es: "Es configuración. Con la clave en el código, habría sido un despliegue de urgencia.",
        en: "It is configuration. With the key in the code, it would have been an emergency deployment.",
      },
    },
    {
      id: "m11-l03-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿cómo dejabas que solo un usuario de integración se saltara los triggers en el Módulo 7?",
        en: "Review: how did you let only an integration user skip the triggers in Module 7?",
      },
      options: [
        { es: "Con un permiso personalizado asignado por permission set", en: "With a custom permission assigned via a permission set" },
        { es: "Con su nombre escrito en el código", en: "With its name written in the code" },
        { es: "Con un checkbox en el registro", en: "With a checkbox on the record" },
        { es: "Desactivando el trigger", en: "By deactivating the trigger" },
      ],
      answer: 0,
      explain: {
        es: "La misma idea: lo que decide quién puede se configura en Setup, no se escribe en el código.",
        en: "The same idea: what decides who may do something is configured in Setup, not written in code.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M7 L4", en: "Review · M7 L4" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 3 DE 7 · El cliente de la API de impuestos tiene la dirección y la clave de producción escritas en el código. El Admin ya ha creado la Named Credential Tax_API. Reescribe el cliente para que no quede ni una dirección ni una clave a la vista.",
      en: "TASK 3 OF 7 · The tax API client has the address and the production key written in the code. The Admin has already created the Named Credential Tax_API. Rewrite the client so not a single address or key is left in sight.",
    },
    brief: [
      {
        es: "setEndpoint usa 'callout:Tax_API/v2/rates/' + country.",
        en: "setEndpoint uses 'callout:Tax_API/v2/rates/' + country.",
      },
      {
        es: "Desaparece la cabecera Authorization: la autenticación la añade Salesforce.",
        en: "The Authorization header goes away: Salesforce adds the authentication.",
      },
      {
        es: "El resto (GET, comprobar el 200, devolver el cuerpo) se queda igual.",
        en: "The rest (GET, checking the 200, returning the body) stays the same.",
      },
    ],
    starter: {
      es: STARTER_ES,
      en: STARTER_ES.replace(
        "// CASO: el puente con el ERP, por dentro\n// Ya resuelto (tareas 1-2): ErpClient llama al ERP y entiende su JSON.\n// Tarea 3 de 7: ni direcciones ni claves en el código.",
        "// CASE: the ERP bridge, from the inside\n// Already solved (tasks 1-2): ErpClient calls the ERP and understands its JSON.\n// Task 3 of 7: no addresses or keys in the code.",
      ).replace("// El cliente de la API de impuestos, tal como lo dejó un compañero:", "// The tax API client, as a teammate left it:"),
    },
    hints: [
      {
        es: "Yo me preguntaría qué líneas de este código cambiarían entre la sandbox y producción, o el día que el proveedor cambie la clave. Esas son las que no deberían estar aquí.",
        en: "I would ask which lines of this code would change between sandbox and production, or the day the provider changes the key. Those are the ones that should not be here.",
      },
      {
        es: "Lo que me ayudó: callout:Tax_API sustituye a todo el https://… hasta el dominio. La ruta (/v2/rates/ + country) se queda. Y la cabecera Authorization sobra entera.",
        en: "What helped me: callout:Tax_API replaces the whole https://… up to the domain. The path (/v2/rates/ + country) stays. And the Authorization header goes entirely.",
      },
      {
        es: "Te dejo el esquema: req.setEndpoint('callout:Tax_API/v2/rates/' + country); y borra la línea del setHeader('Authorization', …).",
        en: "Here is the outline: req.setEndpoint('callout:Tax_API/v2/rates/' + country); and delete the setHeader('Authorization', …) line.",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m11-l03-c1",
        label: { es: "La dirección es la Named Credential", en: "The address is the Named Credential" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "\\.\\s*setEndpoint\\s*\\(\\s*'callout:Tax_API/v2/rates/'\\s*\\+\\s*country\\s*\\)" },
            { op: "absent", pattern: "https?://", flags: "iR" },
          ],
        },
        onFail: {
          es: "req.setEndpoint('callout:Tax_API/v2/rates/' + country); y ninguna dirección https:// en el código.",
          en: "req.setEndpoint('callout:Tax_API/v2/rates/' + country); and no https:// address in the code.",
        },
        otter: {
          es: "La dirección ya la tiene el Admin guardada en Setup: en el código solo va su nombre, 'callout:Tax_API/v2/rates/' + country. Ni rastro de https://.",
          en: "The Admin already has the address stored in Setup: the code only carries its name, 'callout:Tax_API/v2/rates/' + country. No trace of https://.",
        },
      },
      {
        id: "m11-l03-c2",
        label: { es: "Ninguna clave en el código", en: "No key in the code" },
        rule: {
          op: "all",
          of: [
            { op: "absent", pattern: "Authorization" },
            { op: "absent", pattern: "clave-de-produccion|Bearer" },
          ],
        },
        onFail: {
          es: "Borra la línea req.setHeader('Authorization', …): la autenticación la añade la Named Credential.",
          en: "Delete the req.setHeader('Authorization', …) line: the Named Credential adds the authentication.",
        },
        otter: {
          es: "Esa clave la lee cualquiera que abra el archivo, y ya está en el historial del repositorio. Borra la cabecera Authorization: Salesforce añade la autenticación al enviar. Y avisa al proveedor: una clave que estuvo en el código hay que cambiarla.",
          en: "Anyone opening the file can read that key, and it is already in the repository history. Delete the Authorization header: Salesforce adds the authentication on send. And tell the provider: a key that has been in code must be changed.",
        },
      },
      {
        id: "m11-l03-c3",
        label: { es: "El resto del cliente sigue igual", en: "The rest of the client stays the same" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "\\.\\s*setMethod\\s*\\(\\s*'GET'\\s*\\)" },
            { op: "match", pattern: "getStatusCode\\s*\\(\\s*\\)\\s*!=\\s*200" },
            { op: "match", pattern: "return\\s+\\w+\\s*\\.\\s*getBody\\s*\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "No toques lo demás: el GET, la comprobación del 200 y el return res.getBody() se quedan.",
          en: "Leave the rest alone: the GET, the 200 check and the return res.getBody() stay.",
        },
        otter: {
          es: "Solo cambia de dónde salen la dirección y la clave. El GET, la comprobación del 200 y el return del cuerpo siguen como estaban.",
          en: "Only where the address and key come from changes. The GET, the 200 check and returning the body stay as they were.",
        },
      },
    ],
    rubric: [
      {
        es: "La clave antigua sigue en el historial del repositorio aunque la borres hoy. ¿Qué habría que hacer con ella?",
        en: "The old key stays in the repository history even if you delete it today. What should be done with it?",
      },
    ],
    voice: "otter",
    outro: {
      es: "El puente ya no guarda secretos en el código. Hasta ahora Salesforce siempre ha sido quien llama. En la tarea 4 se da la vuelta: el ERP quiere preguntarle cosas a Salesforce, y le vas a abrir una puerta.",
      en: "The bridge no longer keeps secrets in code. So far Salesforce has always been the caller. In task 4 it flips: the ERP wants to ask Salesforce things, and you are going to open a door for it.",
    },
  },
};
