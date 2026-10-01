import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, por dentro
// Tarea 5 de 7: pedir una factura al sistema de facturación, que habla SOAP.

// InvoiceService ya existe: lo generó Salesforce a partir del WSDL del sistema de facturación.

public class InvoiceClient {
    public static String createInvoice(String erpCode, Decimal amount) {
        InvoiceService.InvoicePort port = new InvoiceService.InvoicePort();
        port.endpoint_x = 'callout:Invoicing/soap/invoices';   // Named Credential, como en REST
        port.timeout_x = 20000;
        try {
            return port.createInvoice(erpCode, amount);        // parece un método normal: es un callout
        } catch (CalloutException e) {
            throw new ErpApiException('Facturación no disponible para ' + erpCode, e);
        }
    }
}`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, por dentro\n// Tarea 5 de 7: pedir una factura al sistema de facturación, que habla SOAP.",
  "// CASE: the ERP bridge, from the inside\n// Task 5 of 7: ask the invoicing system, which speaks SOAP, for an invoice.",
)
  .replace("// InvoiceService ya existe: lo generó Salesforce a partir del WSDL del sistema de facturación.", "// InvoiceService already exists: Salesforce generated it from the invoicing system's WSDL.")
  .replace("// Named Credential, como en REST", "// Named Credential, as in REST")
  .replace("// parece un método normal: es un callout", "// looks like a normal method: it is a callout")
  .replace("'Facturación no disponible para '", "'Invoicing unavailable for '");

export const l05Soap: Lesson = {
  id: "m11-l05",
  slug: "soap-y-wsdl2apex",
  n: 5,
  kind: "lesson",
  minutes: 25,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 4", en: "Remember? · Review of lesson 4" },
    prompt: { es: "¿Qué anotación publica una clase de Apex como servicio REST?", en: "Which annotation publishes an Apex class as a REST service?" },
    options: [
      { es: "@RestResource(urlMapping='…')", en: "@RestResource(urlMapping='…')" },
      { es: "@future(callout=true)", en: "@future(callout=true)" },
      { es: "@isTest", en: "@isTest" },
    ],
    answer: 0,
    explain: {
      es: "@RestResource, con su urlMapping. Hoy vuelves a llamar tú, pero a un sistema que no habla REST.",
      en: "@RestResource, with its urlMapping. Today you are the caller again, but to a system that does not speak REST.",
    },
  },
  title: { es: "SOAP y WSDL2Apex", en: "SOAP and WSDL2Apex" },
  summary: {
    es: "Muchos sistemas veteranos hablan SOAP: mensajes en XML con un contrato estricto, el WSDL. No lo escribes a mano: Salesforce lee el WSDL y genera clases de Apex que llamas como cualquier otro método.",
    en: "Many veteran systems speak SOAP: XML messages with a strict contract, the WSDL. You do not write it by hand: Salesforce reads the WSDL and generates Apex classes you call like any other method.",
  },
  analogy: {
    es: "Un formulario oficial con casillas fijas, frente a una nota libre",
    en: "An official form with fixed boxes, versus a free-form note",
  },
  objectives: [
    { es: "Distinguir REST de SOAP y saber cuándo te tocará cada uno.", en: "Tell REST from SOAP and know when you will meet each." },
    { es: "Generar clases de Apex a partir de un WSDL y usarlas.", en: "Generate Apex classes from a WSDL and use them." },
    { es: "Tratar el fallo de un callout SOAP.", en: "Handle a SOAP callout's failure." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Northwind factura con un sistema de hace quince años. No tiene una API REST ni habla JSON: habla SOAP. Cuando una renovación se cierra, hay que pedirle una factura. Lo primero que te manda su equipo no es documentación, es un archivo: el WSDL.",
        en: "Northwind invoices with a fifteen-year-old system. It has no REST API and does not speak JSON: it speaks SOAP. When a renewal closes, you have to ask it for an invoice. The first thing its team sends you is not documentation, it is a file: the WSDL.",
      },
    },
    {
      type: "table",
      head: [
        { es: "", en: "" },
        { es: "REST", en: "REST" },
        { es: "SOAP", en: "SOAP" },
      ],
      rows: [
        [{ es: "Formato", en: "Format" }, { es: "JSON, normalmente", en: "JSON, usually" }, { es: "XML, siempre, dentro de un «sobre»", en: "XML, always, inside an «envelope»" }],
        [{ es: "Contrato", en: "Contract" }, { es: "Documentación; a veces OpenAPI", en: "Documentation; sometimes OpenAPI" }, { es: "El WSDL: operaciones y tipos, obligatorio", en: "The WSDL: operations and types, mandatory" }],
        [{ es: "Cómo se llama", en: "How you call it" }, { es: "Verbos y direcciones (GET /renewals/…)", en: "Verbs and addresses (GET /renewals/…)" }, { es: "Operaciones con nombre (createInvoice)", en: "Named operations (createInvoice)" }],
        [{ es: "En Apex", en: "In Apex" }, { es: "Http, HttpRequest, JSON", en: "Http, HttpRequest, JSON" }, { es: "Clases generadas con WSDL2Apex", en: "Classes generated with WSDL2Apex" }],
      ],
    },
    {
      type: "h",
      text: { es: "WSDL2Apex: que el XML lo escriba Salesforce", en: "WSDL2Apex: let Salesforce write the XML" },
    },
    {
      type: "p",
      text: {
        es: "En Setup → Apex Classes hay un botón, Generate from WSDL. Subes el archivo y Salesforce genera clases de Apex: una por cada tipo de dato y una clase «puerto» con un método por cada operación del servicio. Esas clases montan el sobre XML, lo envían y convierten la respuesta. Tú solo creas el puerto y llamas al método.",
        en: "In Setup → Apex Classes there is a button, Generate from WSDL. You upload the file and Salesforce generates Apex classes: one per data type and a «port» class with one method per service operation. Those classes build the XML envelope, send it and convert the response. You only create the port and call the method.",
      },
    },
    {
      type: "code",
      code: {
        es: `InvoiceService.InvoicePort port = new InvoiceService.InvoicePort();   // el puerto generado
port.endpoint_x = 'callout:Invoicing/soap/invoices';                 // a dónde (Named Credential)
port.timeout_x = 20000;                                              // cuánto esperar
String invoiceId = port.createInvoice('ERP-100', 12500.00);          // la operación del WSDL`,
        en: `InvoiceService.InvoicePort port = new InvoiceService.InvoicePort();   // the generated port
port.endpoint_x = 'callout:Invoicing/soap/invoices';                 // where to (Named Credential)
port.timeout_x = 20000;                                              // how long to wait
String invoiceId = port.createInvoice('ERP-100', 12500.00);          // the WSDL's operation`,
      },
      caption: {
        es: "Los atributos que terminan en _x son los ajustes de la llamada que añade el generador. createInvoice parece un método normal, pero por dentro es un callout, con todas sus reglas.",
        en: "The attributes ending in _x are the call settings the generator adds. createInvoice looks like a normal method, but inside it is a callout, with all its rules.",
      },
    },
    {
      type: "diagram",
      id: "m11-soap",
      caption: {
        es: "La misma petición en REST y en SOAP: qué viaja por el cable y qué escribes tú en Apex.",
        en: "The same request in REST and in SOAP: what travels over the wire and what you write in Apex.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Sigue siendo un callout", en: "It is still a callout" },
      text: {
        es: "Como es un callout, no puede ir en un trigger ni después de un DML sin confirmar, cuenta para los 100 por transacción y en los tests necesita un mock: aquí es WebServiceMock, registrado con Test.setMock(WebServiceMock.class, …). Y si el servicio falla o no responde, salta una CalloutException: captúrala y tradúcela a tu excepción, como en el Módulo 8.",
        en: "Being a callout, it cannot go in a trigger or after an uncommitted DML, it counts toward the 100 per transaction and in tests it needs a mock: here it is WebServiceMock, registered with Test.setMock(WebServiceMock.class, …). And if the service fails or does not respond, a CalloutException is thrown: catch it and translate it into your exception, as in Module 8.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque Flow no habla SOAP", en: "Why not a Flow? Because Flow does not speak SOAP" },
      text: {
        es: "Este sí es un límite claro. Las herramientas de clics para llamar fuera, External Services y la acción HTTP Callout, trabajan con APIs REST descritas en OpenAPI: un servicio SOAP con su WSDL no se puede registrar ahí. Para el sistema de facturación, el único camino es Apex: generar las clases con WSDL2Apex y, si quieres usarlas desde un flow, envolverlas en una acción invocable.",
        en: "This one is a clear limit. The click tools for calling out, External Services and the HTTP Callout action, work with REST APIs described in OpenAPI: a SOAP service with its WSDL cannot be registered there. For the invoicing system, the only path is Apex: generate the classes with WSDL2Apex and, if you want to use them from a flow, wrap them in an invocable action.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué es un WSDL? ¿Qué genera WSDL2Apex y qué escribes tú? ¿Qué excepción salta si el servicio SOAP no responde?",
        en: "Without looking: what is a WSDL? What does WSDL2Apex generate and what do you write? Which exception is thrown if the SOAP service does not respond?",
      },
    },
  ],

  quiz: [
    {
      id: "m11-l05-q1",
      kind: "single",
      prompt: { es: "¿Qué es un WSDL?", en: "What is a WSDL?" },
      options: [
        { es: "El contrato de un servicio SOAP: sus operaciones y sus tipos de datos", en: "A SOAP service's contract: its operations and data types" },
        { es: "Un formato alternativo a JSON para REST", en: "An alternative format to JSON for REST" },
        { es: "Una Named Credential para SOAP", en: "A Named Credential for SOAP" },
        { es: "Un tipo de test", en: "A kind of test" },
      ],
      answer: 0,
      explain: {
        es: "Es el archivo que describe el servicio. Con él, Salesforce genera las clases de Apex.",
        en: "It is the file describing the service. With it, Salesforce generates the Apex classes.",
      },
    },
    {
      id: "m11-l05-q2",
      kind: "single",
      prompt: { es: "¿Dónde se generan las clases de Apex a partir de un WSDL?", en: "Where are Apex classes generated from a WSDL?" },
      options: [
        { es: "Setup → Apex Classes → Generate from WSDL", en: "Setup → Apex Classes → Generate from WSDL" },
        { es: "Setup → Named Credentials", en: "Setup → Named Credentials" },
        { es: "En Flow Builder", en: "In Flow Builder" },
        { es: "Hay que escribirlas a mano", en: "They must be written by hand" },
      ],
      answer: 0,
      explain: {
        es: "Subes el WSDL y Salesforce escribe las clases. Si el servicio cambia, se regeneran con el WSDL nuevo.",
        en: "You upload the WSDL and Salesforce writes the classes. If the service changes, they are regenerated from the new WSDL.",
      },
    },
    {
      id: "m11-l05-q3",
      kind: "multi",
      prompt: { es: "port.createInvoice(…) es un callout. ¿Qué implica?", en: "port.createInvoice(…) is a callout. What does that imply?" },
      options: [
        { es: "No puede ir directamente en un trigger", en: "It cannot go straight in a trigger" },
        { es: "Cuenta para el límite de 100 callouts", en: "It counts toward the 100-callout limit" },
        { es: "En un test necesita un mock (WebServiceMock)", en: "In a test it needs a mock (WebServiceMock)" },
        { es: "No puede fallar: el WSDL lo garantiza", en: "It cannot fail: the WSDL guarantees it" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Aunque parezca un método normal, sale de Salesforce: puede fallar o no responder, y lanza CalloutException.",
        en: "Even though it looks like a normal method, it leaves Salesforce: it can fail or not respond, and it throws CalloutException.",
      },
    },
    {
      id: "m11-l05-q4",
      kind: "text",
      prompt: {
        es: "Escribe la línea que fija la dirección del puerto port a la Named Credential Invoicing (ruta /soap/invoices).",
        en: "Write the line setting the port's address to the Named Credential Invoicing (path /soap/invoices).",
      },
      accept: ["port\\.endpoint_x\\s*=\\s*'callout:invoicing/soap/invoices'\\s*;?"],
      placeholder: { es: "port.…", en: "port.…" },
      explain: { es: "port.endpoint_x = 'callout:Invoicing/soap/invoices';", en: "port.endpoint_x = 'callout:Invoicing/soap/invoices';" },
      tags: ["recall"],
    },
    {
      id: "m11-l05-q5",
      kind: "single",
      prompt: {
        es: "Un Admin quiere llamar a un servicio SOAP desde un flow, sin Apex. ¿Puede?",
        en: "An Admin wants to call a SOAP service from a flow, without Apex. Can they?",
      },
      options: [
        { es: "No: External Services y HTTP Callout trabajan con REST; hace falta una acción en Apex", en: "No: External Services and HTTP Callout work with REST; an Apex action is needed" },
        { es: "Sí, con la acción HTTP Callout", en: "Yes, with the HTTP Callout action" },
        { es: "Sí, subiendo el WSDL a Flow Builder", en: "Yes, by uploading the WSDL to Flow Builder" },
        { es: "Sí, con un Get Records", en: "Yes, with a Get Records" },
      ],
      answer: 0,
      explain: {
        es: "Es uno de los casos en los que el código es el único camino. La acción invocable hace de puente entre el flow y las clases generadas.",
        en: "It is one of the cases where code is the only path. The invocable action bridges the flow and the generated classes.",
      },
    },
    {
      id: "m11-l05-q6",
      kind: "single",
      prompt: {
        es: "Repaso: al capturar la CalloutException y lanzar la tuya, ¿para qué pasas e como segundo argumento?",
        en: "Review: when catching the CalloutException and throwing yours, why pass e as the second argument?",
      },
      options: [
        { es: "Para conservar la excepción original como causa", en: "To keep the original exception as the cause" },
        { es: "Para que el código compile", en: "To make the code compile" },
        { es: "Para reintentar el callout", en: "To retry the callout" },
        { es: "Para que no se deshaga la transacción", en: "So the transaction is not rolled back" },
      ],
      answer: 0,
      explain: {
        es: "El envoltorio del Módulo 8: tu mensaje para el negocio y, dentro, el error técnico para quien depure.",
        en: "Module 8's wrapper: your message for the business and, inside, the technical error for whoever debugs.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M8 L4", en: "Review · M8 L4" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 5 DE 7 · Cuando se cierra una renovación hay que pedir una factura al sistema de facturación, que habla SOAP. Salesforce ya generó InvoiceService a partir de su WSDL. Escribe InvoiceClient.createInvoice: crea el puerto, apúntalo a la Named Credential Invoicing, llama a la operación y traduce el fallo a ErpApiException.",
      en: "TASK 5 OF 7 · When a renewal closes an invoice must be requested from the invoicing system, which speaks SOAP. Salesforce already generated InvoiceService from its WSDL. Write InvoiceClient.createInvoice: create the port, point it at the Named Credential Invoicing, call the operation and translate the failure into ErpApiException.",
    },
    brief: [
      {
        es: "Crea el puerto: InvoiceService.InvoicePort port = new InvoiceService.InvoicePort();",
        en: "Create the port: InvoiceService.InvoicePort port = new InvoiceService.InvoicePort();",
      },
      {
        es: "port.endpoint_x = 'callout:Invoicing/soap/invoices' y port.timeout_x = 20000.",
        en: "port.endpoint_x = 'callout:Invoicing/soap/invoices' and port.timeout_x = 20000.",
      },
      {
        es: "Devuelve port.createInvoice(erpCode, amount), dentro de un try.",
        en: "Return port.createInvoice(erpCode, amount), inside a try.",
      },
      {
        es: "catch (CalloutException e): lanza ErpApiException con el erpCode en el mensaje y e como causa.",
        en: "catch (CalloutException e): throw ErpApiException with the erpCode in the message and e as the cause.",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, por dentro
// Ya resuelto (tareas 1-4): el puente llama y contesta por REST, sin claves en el código.
// Tarea 5 de 7: pedir una factura al sistema de facturación, que habla SOAP.

// InvoiceService ya existe: lo generó Salesforce a partir del WSDL del sistema de facturación.
// Su puerto, InvoiceService.InvoicePort, tiene la operación: String createInvoice(String erpCode, Decimal amount)

public class InvoiceClient {
    public static String createInvoice(String erpCode, Decimal amount) {
        return null;
    }
}
`,
      en: `// CASE: the ERP bridge, from the inside
// Already solved (tasks 1-4): the bridge calls and answers over REST, with no keys in code.
// Task 5 of 7: ask the invoicing system, which speaks SOAP, for an invoice.

// InvoiceService already exists: Salesforce generated it from the invoicing system's WSDL.
// Its port, InvoiceService.InvoicePort, has the operation: String createInvoice(String erpCode, Decimal amount)

public class InvoiceClient {
    public static String createInvoice(String erpCode, Decimal amount) {
        return null;
    }
}
`,
    },
    hints: [
      {
        es: "Yo lo pensaría como rellenar un formulario oficial: no escribo la carta (el XML), solo relleno las casillas que me dan y lo entrego en la ventanilla correcta.",
        en: "I would think of it as filling in an official form: I do not write the letter (the XML), I only fill in the boxes given and hand it in at the right window.",
      },
      {
        es: "Lo que me ayudó: tres pasos. Crear el puerto, decirle a dónde y cuánto esperar (endpoint_x y timeout_x) y llamar a la operación como a un método normal. Y como es un callout, puede lanzar CalloutException.",
        en: "What helped me: three steps. Create the port, tell it where to and how long to wait (endpoint_x and timeout_x) and call the operation like a normal method. And since it is a callout, it may throw CalloutException.",
      },
      {
        es: "Te dejo el esquema: InvoiceService.InvoicePort port = new InvoiceService.InvoicePort(); port.endpoint_x = 'callout:Invoicing/soap/invoices'; port.timeout_x = 20000; try { return port.createInvoice(erpCode, amount); } catch (CalloutException e) { throw new ErpApiException('…' + erpCode, e); }",
        en: "Here is the outline: InvoiceService.InvoicePort port = new InvoiceService.InvoicePort(); port.endpoint_x = 'callout:Invoicing/soap/invoices'; port.timeout_x = 20000; try { return port.createInvoice(erpCode, amount); } catch (CalloutException e) { throw new ErpApiException('…' + erpCode, e); }",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m11-l05-c1",
        label: { es: "Se crea el puerto generado", en: "The generated port is created" },
        rule: { op: "match", pattern: "InvoiceService\\s*\\.\\s*InvoicePort\\s+\\w+\\s*=\\s*new\\s+InvoiceService\\s*\\.\\s*InvoicePort\\s*\\(\\s*\\)" },
        onFail: {
          es: "InvoiceService.InvoicePort port = new InvoiceService.InvoicePort();",
          en: "InvoiceService.InvoicePort port = new InvoiceService.InvoicePort();",
        },
        otter: {
          es: "El formulario ya lo imprimió Salesforce: InvoiceService.InvoicePort port = new InvoiceService.InvoicePort(). Es una clase interna, por eso lleva el punto.",
          en: "Salesforce already printed the form: InvoiceService.InvoicePort port = new InvoiceService.InvoicePort(). It is an inner class, hence the dot.",
        },
      },
      {
        id: "m11-l05-c2",
        label: { es: "Apunta a la Named Credential y fija la espera", en: "It points at the Named Credential and sets the wait" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "\\.\\s*endpoint_x\\s*=\\s*'callout:Invoicing/soap/invoices'" },
            { op: "match", pattern: "\\.\\s*timeout_x\\s*=\\s*20000" },
            { op: "absent", pattern: "https?://", flags: "iR" },
          ],
        },
        onFail: {
          es: "port.endpoint_x = 'callout:Invoicing/soap/invoices'; port.timeout_x = 20000;",
          en: "port.endpoint_x = 'callout:Invoicing/soap/invoices'; port.timeout_x = 20000;",
        },
        otter: {
          es: "La ventanilla y la paciencia: port.endpoint_x con la Named Credential ('callout:Invoicing/soap/invoices'), igual que en REST, y port.timeout_x = 20000.",
          en: "The window and the patience: port.endpoint_x with the Named Credential ('callout:Invoicing/soap/invoices'), as in REST, and port.timeout_x = 20000.",
        },
      },
      {
        id: "m11-l05-c3",
        label: { es: "Llama a la operación y devuelve su resultado", en: "It calls the operation and returns its result" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "return\\s+\\w+\\s*\\.\\s*createInvoice\\s*\\(\\s*erpCode\\s*,\\s*amount\\s*\\)\\s*;" },
            { op: "absent", pattern: "return\\s+null\\s*;" },
          ],
        },
        onFail: { es: "return port.createInvoice(erpCode, amount);", en: "return port.createInvoice(erpCode, amount);" },
        otter: {
          es: "La operación del WSDL es un método del puerto: return port.createInvoice(erpCode, amount). El sobre XML lo monta la clase generada.",
          en: "The WSDL's operation is a method on the port: return port.createInvoice(erpCode, amount). The generated class builds the XML envelope.",
        },
      },
      {
        id: "m11-l05-c4",
        label: { es: "El fallo se traduce a ErpApiException, con su causa", en: "The failure is translated into ErpApiException, with its cause" },
        rule: {
          op: "match",
          pattern: "catch\\s*\\(\\s*(System\\.)?CalloutException\\s+(\\w+)\\s*\\)\\s*\\{[^}]*throw\\s+new\\s+ErpApiException\\s*\\([^;]*erpCode[^;]*,\\s*\\w+\\s*\\)",
        },
        onFail: {
          es: "try { return port.createInvoice(erpCode, amount); } catch (CalloutException e) { throw new ErpApiException('…' + erpCode, e); }",
          en: "try { return port.createInvoice(erpCode, amount); } catch (CalloutException e) { throw new ErpApiException('…' + erpCode, e); }",
        },
        otter: {
          es: "Un sistema de quince años se cae de vez en cuando. catch (CalloutException e) y tradúcelo, como en el Módulo 8: throw new ErpApiException('…' + erpCode, e), con la original dentro.",
          en: "A fifteen-year-old system goes down now and then. catch (CalloutException e) and translate it, as in Module 8: throw new ErpApiException('…' + erpCode, e), with the original inside.",
        },
      },
    ],
    rubric: [
      {
        es: "Si el equipo de facturación añade una operación nueva al servicio, ¿qué tienes que hacer en Salesforce para poder usarla?",
        en: "If the invoicing team adds a new operation to the service, what do you have to do in Salesforce to be able to use it?",
      },
    ],
    voice: "otter",
    outro: {
      es: "Ya hablas REST y SOAP, hacia fuera y hacia dentro. Falta juntar esto con el Módulo 9: un callout desde un trabajo asíncrono que sepa qué hacer cuando el otro sistema está caído. En la tarea 6, reintentos.",
      en: "You now speak REST and SOAP, outbound and inbound. What is left is joining this with Module 9: a callout from an async job that knows what to do when the other system is down. In task 6, retries.",
    },
  },
};
