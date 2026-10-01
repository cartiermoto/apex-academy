import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, por dentro
// Tarea 6 de 7: pedir la factura en segundo plano, y volver a intentarlo si falla.

public class InvoiceRetryJob implements Queueable, Database.AllowsCallouts {
    private static final Integer MAX_ATTEMPTS = 3;
    private String erpCode;
    private Decimal amount;
    private Integer attempt;

    public InvoiceRetryJob(String erpCode, Decimal amount, Integer attempt) {
        this.erpCode = erpCode;
        this.amount = amount;
        this.attempt = attempt;
    }

    public void execute(QueueableContext ctx) {
        try {
            String invoiceId = InvoiceClient.createInvoice(erpCode, amount);
            System.debug('Factura creada: ' + invoiceId);
        } catch (ErpApiException e) {
            if (attempt < MAX_ATTEMPTS) {
                System.enqueueJob(new InvoiceRetryJob(erpCode, amount, attempt + 1));
            } else {
                System.debug(LoggingLevel.ERROR, 'Sin factura tras ' + attempt + ' intentos: ' + e.getMessage());
            }
        }
    }
}

// En el handler de Opportunity, cuando la renovación se cierra:
System.enqueueJob(new InvoiceRetryJob(erpCode, amount, 1));`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, por dentro\n// Tarea 6 de 7: pedir la factura en segundo plano, y volver a intentarlo si falla.",
  "// CASE: the ERP bridge, from the inside\n// Task 6 of 7: request the invoice in the background, and try again if it fails.",
)
  .replace("'Factura creada: '", "'Invoice created: '")
  .replace("'Sin factura tras ' + attempt + ' intentos: '", "'No invoice after ' + attempt + ' attempts: '")
  .replace("// En el handler de Opportunity, cuando la renovación se cierra:", "// In the Opportunity handler, when the renewal closes:");

export const l06CalloutsAsincronos: Lesson = {
  id: "m11-l06",
  slug: "callouts-en-asincrono",
  n: 6,
  kind: "lesson",
  minutes: 30,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 5", en: "Remember? · Review of lesson 5" },
    prompt: { es: "¿Qué lanza port.createInvoice(…) si el sistema de facturación no responde?", en: "What does port.createInvoice(…) throw if the invoicing system does not respond?" },
    options: [
      { es: "Una CalloutException", en: "A CalloutException" },
      { es: "Nada: devuelve null", en: "Nothing: it returns null" },
      { es: "Una DmlException", en: "A DmlException" },
    ],
    answer: 0,
    explain: {
      es: "Y tu cliente la traduce a ErpApiException. Hoy decides qué hacer con ella: volver a intentarlo.",
      en: "And your client translates it into ErpApiException. Today you decide what to do with it: try again.",
    },
  },
  title: { es: "Callouts en asíncrono", en: "Callouts from async context" },
  summary: {
    es: "Un callout desde un trigger tiene que ir en un trabajo asíncrono. Y ahí puedes hacer algo que en el guardado no cabría: si el otro sistema falla, volver a intentarlo más tarde, un número limitado de veces.",
    en: "A callout from a trigger has to go in an async job. And there you can do something that would not fit in the save: if the other system fails, try again later, a limited number of times.",
  },
  analogy: {
    es: "Reenviar un correo que rebotó, pero solo tres veces",
    en: "Resending an email that bounced, but only three times",
  },
  objectives: [
    { es: "Sacar un callout de un trigger a un Queueable con Database.AllowsCallouts.", en: "Move a callout out of a trigger into a Queueable with Database.AllowsCallouts." },
    { es: "Reintentar con un contador de intentos y un tope.", en: "Retry with an attempt counter and a cap." },
    { es: "Decidir qué hacer cuando se agotan los intentos.", en: "Decide what to do when attempts run out." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Al cerrarse una renovación hay que pedir su factura. El primer intento fue llamar a InvoiceClient desde el trigger: «Callout from triggers are currently not supported». El segundo, un Queueable: funciona, hasta la noche en que el sistema de facturación se cae diez minutos para una actualización y veinte facturas se quedan sin pedir.",
        en: "When a renewal closes its invoice has to be requested. The first attempt was calling InvoiceClient from the trigger: «Callout from triggers are currently not supported». The second, a Queueable: it works, until the night the invoicing system goes down for ten minutes for an update and twenty invoices are left unrequested.",
      },
    },
    {
      type: "h",
      text: { es: "Las reglas, juntas", en: "The rules, together" },
    },
    {
      type: "list",
      items: [
        {
          es: "Desde un trigger, el callout va en un @future(callout=true) o en un Queueable con Database.AllowsCallouts (Módulo 9).",
          en: "From a trigger, the callout goes in an @future(callout=true) or a Queueable with Database.AllowsCallouts (Module 9).",
        },
        {
          es: "Dentro del trabajo, primero el callout y después el DML, nunca al revés.",
          en: "Inside the job, first the callout and then the DML, never the other way round.",
        },
        {
          es: "Un trabajo asíncrono tiene los mismos límites de callouts: 100 por transacción y 120 segundos entre todos.",
          en: "An async job has the same callout limits: 100 per transaction and 120 seconds in total.",
        },
        {
          es: "Un Queueable puede encolar un hijo: es la pieza que permite reintentar.",
          en: "A Queueable can enqueue one child: that is the piece that makes retrying possible.",
        },
      ],
    },
    {
      type: "h",
      text: { es: "Reintentar, con tope", en: "Retrying, with a cap" },
    },
    {
      type: "code",
      code: {
        es: `} catch (ErpApiException e) {
    if (attempt < MAX_ATTEMPTS) {
        System.enqueueJob(new InvoiceRetryJob(erpCode, amount, attempt + 1));   // otra vez, más tarde
    } else {
        System.debug(LoggingLevel.ERROR, 'Sin factura tras ' + attempt + ' intentos');   // se acabó: avisar
    }
}`,
        en: `} catch (ErpApiException e) {
    if (attempt < MAX_ATTEMPTS) {
        System.enqueueJob(new InvoiceRetryJob(erpCode, amount, attempt + 1));   // again, later
    } else {
        System.debug(LoggingLevel.ERROR, 'No invoice after ' + attempt + ' attempts');   // done: raise the alarm
    }
}`,
      },
      caption: {
        es: "El número de intento viaja en el propio trabajo, como atributo. Cada reintento es un trabajo nuevo que sabe cuántas veces se ha probado ya.",
        en: "The attempt number travels in the job itself, as an attribute. Each retry is a new job that knows how many times it has been tried already.",
      },
    },
    {
      type: "diagram",
      id: "m11-retry",
      caption: {
        es: "Elige cuándo se recupera el sistema de facturación y sigue los intentos, uno por trabajo.",
        en: "Choose when the invoicing system recovers and follow the attempts, one per job.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Sin tope, un reintento es un bucle infinito", en: "Without a cap, a retry is an infinite loop" },
      text: {
        es: "Si el trabajo se reencola siempre que falla y el otro sistema está caído todo el día, la cola se llena de trabajos que fallan y se relanzan sin fin. El tope de intentos es la condición de parada del Módulo 9. Y cuando se agota, el fallo no puede perderse en silencio: se registra, o se avisa a alguien. Si quieres dejar un respiro entre intentos, System.enqueueJob admite un segundo argumento con minutos de espera.",
        en: "If the job re-enqueues itself whenever it fails and the other system is down all day, the queue fills with jobs failing and relaunching endlessly. The attempt cap is Module 9's stopping condition. And when it runs out, the failure cannot vanish silently: it is logged, or someone is told. If you want a pause between attempts, System.enqueueJob takes a second argument with minutes to wait.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque un flow no vuelve a intentarlo", en: "Why not a Flow? Because a flow does not try again" },
      text: {
        es: "En Flow, el callout va en el camino asíncrono, y si falla puedes recogerlo en el fault path para mandar un aviso. Hasta ahí llega. Lo que no hay es una forma de decir «vuelve a probar dentro de un rato, y si a la tercera sigue fallando, para»: la interview termina y no se relanza a sí misma con lo que sabe. En Apex, el trabajo lleva su contador y decide.",
        en: "In Flow, the callout goes on the async path, and if it fails you can catch it on the fault path to send a notice. That is as far as it goes. What is missing is a way to say «try again in a while, and if the third time still fails, stop»: the interview ends and does not relaunch itself with what it knows. In Apex, the job carries its counter and decides.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿por qué el callout no puede ir en el trigger? ¿Dónde viaja el número de intento? ¿Qué pasa si no hay tope de intentos?",
        en: "Without looking: why can the callout not go in the trigger? Where does the attempt number travel? What happens with no attempt cap?",
      },
    },
  ],

  quiz: [
    {
      id: "m11-l06-q1",
      kind: "single",
      prompt: {
        es: "El sistema de facturación está caído todo el día y el trabajo se reencola siempre que falla, sin tope. ¿Qué pasa?",
        en: "The invoicing system is down all day and the job re-enqueues itself whenever it fails, with no cap. What happens?",
      },
      options: [
        { es: "Una cadena de trabajos que fallan y se relanzan sin fin", en: "A chain of jobs failing and relaunching endlessly" },
        { es: "Salesforce lo para a los 3 intentos", en: "Salesforce stops it after 3 attempts" },
        { es: "El primer fallo detiene todo", en: "The first failure stops everything" },
        { es: "Nada: espera a que vuelva", en: "Nothing: it waits for it to come back" },
      ],
      answer: 0,
      explain: {
        es: "Nadie lo para por ti. El tope de intentos lo escribes tú, como la condición de parada de la cadena del Módulo 9.",
        en: "Nobody stops it for you. You write the attempt cap, like the stopping condition of Module 9's chain.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m11-l06-q2",
      kind: "single",
      prompt: { es: "¿Cómo sabe el reintento cuántas veces se ha probado ya?", en: "How does the retry know how many times it has been tried already?" },
      options: [
        { es: "El número de intento viaja como atributo del Queueable, por el constructor", en: "The attempt number travels as a Queueable attribute, through the constructor" },
        { es: "Con una variable static", en: "With a static variable" },
        { es: "Salesforce lo cuenta solo", en: "Salesforce counts it automatically" },
        { es: "Con un campo en el usuario", en: "With a field on the user" },
      ],
      answer: 0,
      explain: {
        es: "Cada trabajo es otra transacción: una static no sobrevive. Lo que sí viaja es el estado del objeto encolado.",
        en: "Each job is another transaction: a static does not survive. What does travel is the enqueued object's state.",
      },
    },
    {
      id: "m11-l06-q3",
      kind: "multi",
      prompt: { es: "¿Qué es cierto sobre los callouts en un Queueable?", en: "What is true about callouts in a Queueable?" },
      options: [
        { es: "La clase necesita Database.AllowsCallouts", en: "The class needs Database.AllowsCallouts" },
        { es: "Siguen contando para el límite de 100 por transacción", en: "They still count toward the 100-per-transaction limit" },
        { es: "El callout va antes que el DML", en: "The callout goes before the DML" },
        { es: "Si fallan, Salesforce los reintenta", en: "If they fail, Salesforce retries them" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Salesforce no reintenta nada por ti: el reintento es código tuyo.",
        en: "Salesforce retries nothing for you: the retry is your code.",
      },
    },
    {
      id: "m11-l06-q4",
      kind: "text",
      prompt: {
        es: "Escribe la condición del if que deja reintentar mientras attempt sea menor que MAX_ATTEMPTS.",
        en: "Write the if condition that allows a retry while attempt is below MAX_ATTEMPTS.",
      },
      accept: ["attempt\\s*<\\s*max_attempts", "\\(\\s*attempt\\s*<\\s*max_attempts\\s*\\)"],
      placeholder: { es: "attempt …", en: "attempt …" },
      explain: { es: "attempt < MAX_ATTEMPTS", en: "attempt < MAX_ATTEMPTS" },
      tags: ["recall"],
    },
    {
      id: "m11-l06-q5",
      kind: "single",
      prompt: { es: "Se agotan los tres intentos. ¿Qué debería hacer el trabajo?", en: "The three attempts run out. What should the job do?" },
      options: [
        { es: "Dejar constancia del fallo: registrarlo o avisar a alguien", en: "Leave a record of the failure: log it or tell someone" },
        { es: "Nada: ya lo intentó", en: "Nothing: it already tried" },
        { es: "Lanzar una excepción para que Salesforce lo reintente", en: "Throw an exception so Salesforce retries it" },
        { es: "Borrar la renovación", en: "Delete the renewal" },
      ],
      answer: 0,
      explain: {
        es: "Es el «catch vacío» del Módulo 8 con otro disfraz: un fallo que no deja rastro es una factura que nadie sabe que falta.",
        en: "It is Module 8's «empty catch» in another costume: a failure leaving no trace is an invoice nobody knows is missing.",
      },
    },
    {
      id: "m11-l06-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿cuántos trabajos hijo puede encolar un Queueable desde su execute?",
        en: "Review: how many child jobs can a Queueable enqueue from its execute?",
      },
      options: [
        { es: "Uno", en: "One" },
        { es: "50", en: "50" },
        { es: "Ninguno", en: "None" },
        { es: "Sin límite", en: "No limit" },
      ],
      answer: 0,
      explain: { es: "Uno por execute: suficiente para el siguiente intento.", en: "One per execute: enough for the next attempt." },
      tags: ["spaced"],
      from: { es: "Repaso · M9 L3", en: "Review · M9 L3" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 6 DE 7 · Al cerrarse una renovación, el handler llama a InvoiceClient directamente, y Salesforce lo rechaza: es un callout desde un trigger. Pásalo a un Queueable que pida la factura y, si el sistema de facturación falla, lo vuelva a intentar hasta tres veces. Si a la tercera sigue fallando, que deje constancia.",
      en: "TASK 6 OF 7 · When a renewal closes, the handler calls InvoiceClient directly, and Salesforce rejects it: it is a callout from a trigger. Move it into a Queueable that requests the invoice and, if the invoicing system fails, tries again up to three times. If the third still fails, leave a record.",
    },
    brief: [
      {
        es: "InvoiceRetryJob implements Queueable, Database.AllowsCallouts, con atributos erpCode, amount y attempt que llena el constructor.",
        en: "InvoiceRetryJob implements Queueable, Database.AllowsCallouts, with erpCode, amount and attempt attributes the constructor fills.",
      },
      {
        es: "En execute, dentro de un try: InvoiceClient.createInvoice(erpCode, amount).",
        en: "In execute, inside a try: InvoiceClient.createInvoice(erpCode, amount).",
      },
      {
        es: "En catch (ErpApiException e): si attempt es menor que el máximo (3), encola un nuevo InvoiceRetryJob con attempt + 1; si no, deja constancia con System.debug.",
        en: "In catch (ErpApiException e): if attempt is below the maximum (3), enqueue a new InvoiceRetryJob with attempt + 1; otherwise, leave a record with System.debug.",
      },
      {
        es: "El handler ya no llama a InvoiceClient: encola el trabajo con el intento 1.",
        en: "The handler no longer calls InvoiceClient: it enqueues the job with attempt 1.",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, por dentro
// Ya resuelto (tareas 1-5): el puente habla REST y SOAP, hacia fuera y hacia dentro.
// Tarea 6 de 7: pedir la factura en segundo plano, y volver a intentarlo si falla.

// En el handler de Opportunity, cuando la renovación se cierra:
InvoiceClient.createInvoice(erpCode, amount);   // «Callout from triggers are currently not supported»
`,
      en: `// CASE: the ERP bridge, from the inside
// Already solved (tasks 1-5): the bridge speaks REST and SOAP, outbound and inbound.
// Task 6 of 7: request the invoice in the background, and try again if it fails.

// In the Opportunity handler, when the renewal closes:
InvoiceClient.createInvoice(erpCode, amount);   // «Callout from triggers are currently not supported»
`,
    },
    hints: [
      {
        es: "Yo lo pensaría como un correo que rebota: lo reenvías, pero llevas la cuenta, y a la tercera dejas de insistir y avisas a alguien.",
        en: "I would think of it as a bouncing email: you resend it, but you keep count, and after the third you stop insisting and tell someone.",
      },
      {
        es: "Lo que me ayudó: el número de intento es un atributo más del trabajo. El primero se encola con 1; cada reintento, con attempt + 1. Y el if (attempt < 3) es lo único que impide el bucle infinito.",
        en: "What helped me: the attempt number is just another attribute of the job. The first is enqueued with 1; each retry, with attempt + 1. And the if (attempt < 3) is all that prevents the infinite loop.",
      },
      {
        es: "Te dejo el esquema: class InvoiceRetryJob implements Queueable, Database.AllowsCallouts { atributos y constructor con this.; public void execute(QueueableContext ctx) { try { InvoiceClient.createInvoice(erpCode, amount); } catch (ErpApiException e) { if (attempt < MAX_ATTEMPTS) { System.enqueueJob(new InvoiceRetryJob(erpCode, amount, attempt + 1)); } else { System.debug(…); } } } } · System.enqueueJob(new InvoiceRetryJob(erpCode, amount, 1));",
        en: "Here is the outline: class InvoiceRetryJob implements Queueable, Database.AllowsCallouts { attributes and constructor with this.; public void execute(QueueableContext ctx) { try { InvoiceClient.createInvoice(erpCode, amount); } catch (ErpApiException e) { if (attempt < MAX_ATTEMPTS) { System.enqueueJob(new InvoiceRetryJob(erpCode, amount, attempt + 1)); } else { System.debug(…); } } } } · System.enqueueJob(new InvoiceRetryJob(erpCode, amount, 1));",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m11-l06-c1",
        label: { es: "Un Queueable que puede hacer callouts y recuerda el intento", en: "A Queueable that can make callouts and remembers the attempt" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "class\\s+InvoiceRetryJob\\s+implements[^{]*\\bQueueable\\b" },
            { op: "match", pattern: "class\\s+InvoiceRetryJob\\s+implements[^{]*Database\\s*\\.\\s*AllowsCallouts" },
            { op: "match", pattern: "InvoiceRetryJob\\s*\\(\\s*String\\s+\\w+\\s*,\\s*Decimal\\s+\\w+\\s*,\\s*Integer\\s+\\w+\\s*\\)\\s*\\{[^}]*this\\s*\\.\\s*attempt\\s*=" },
          ],
        },
        onFail: {
          es: "public class InvoiceRetryJob implements Queueable, Database.AllowsCallouts, con un constructor (String erpCode, Decimal amount, Integer attempt) que guarde los tres con this.",
          en: "public class InvoiceRetryJob implements Queueable, Database.AllowsCallouts, with a (String erpCode, Decimal amount, Integer attempt) constructor storing all three with this.",
        },
        otter: {
          es: "El trabajo lleva consigo lo que necesita: qué factura pedir y qué intento es. implements Queueable, Database.AllowsCallouts, y un constructor que guarde erpCode, amount y attempt.",
          en: "The job carries what it needs: which invoice to request and which attempt it is. implements Queueable, Database.AllowsCallouts, and a constructor storing erpCode, amount and attempt.",
        },
      },
      {
        id: "m11-l06-c2",
        label: { es: "Pide la factura dentro de un try", en: "It requests the invoice inside a try" },
        rule: {
          op: "match",
          pattern: "try\\s*\\{[^}]*InvoiceClient\\s*\\.\\s*createInvoice\\s*\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)[^}]*\\}\\s*catch\\s*\\(\\s*ErpApiException\\s+\\w+\\s*\\)",
        },
        onFail: {
          es: "try { InvoiceClient.createInvoice(erpCode, amount); } catch (ErpApiException e) { … }",
          en: "try { InvoiceClient.createInvoice(erpCode, amount); } catch (ErpApiException e) { … }",
        },
        otter: {
          es: "La llamada puede fallar, y tu cliente ya traduce el fallo a ErpApiException: try { InvoiceClient.createInvoice(erpCode, amount); } catch (ErpApiException e) { … }.",
          en: "The call may fail, and your client already translates the failure into ErpApiException: try { InvoiceClient.createInvoice(erpCode, amount); } catch (ErpApiException e) { … }.",
        },
      },
      {
        id: "m11-l06-c3",
        label: { es: "Reintenta con tope, y deja constancia al agotarlo", en: "It retries with a cap, and leaves a record when it runs out" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "if\\s*\\(\\s*attempt\\s*<\\s*(\\w+|3)\\s*\\)\\s*\\{\\s*System\\s*\\.\\s*enqueueJob\\s*\\(\\s*new\\s+InvoiceRetryJob\\s*\\([^;]*attempt\\s*\\+\\s*1\\s*\\)" },
            { op: "match", pattern: "\\}\\s*else\\s*\\{[^}]*System\\s*\\.\\s*debug\\s*\\(" },
          ],
        },
        onFail: {
          es: "if (attempt < MAX_ATTEMPTS) { System.enqueueJob(new InvoiceRetryJob(erpCode, amount, attempt + 1)); } else { System.debug(…); }",
          en: "if (attempt < MAX_ATTEMPTS) { System.enqueueJob(new InvoiceRetryJob(erpCode, amount, attempt + 1)); } else { System.debug(…); }",
        },
        otter: {
          es: "Reenvía el correo, pero cuenta: if (attempt < MAX_ATTEMPTS) encola otro trabajo con attempt + 1. Y en el else, cuando ya no quedan intentos, deja constancia: una factura que falta no puede perderse en silencio.",
          en: "Resend the email, but count: if (attempt < MAX_ATTEMPTS) enqueue another job with attempt + 1. And in the else, when no attempts remain, leave a record: a missing invoice cannot vanish silently.",
        },
      },
      {
        id: "m11-l06-c4",
        label: { es: "El handler encola el primer intento", en: "The handler enqueues the first attempt" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "System\\s*\\.\\s*enqueueJob\\s*\\(\\s*new\\s+InvoiceRetryJob\\s*\\(\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*1\\s*\\)" },
            { op: "count", pattern: "InvoiceClient\\s*\\.\\s*createInvoice\\s*\\(", max: 1 },
          ],
        },
        onFail: {
          es: "En el handler, en vez de llamar a InvoiceClient: System.enqueueJob(new InvoiceRetryJob(erpCode, amount, 1));",
          en: "In the handler, instead of calling InvoiceClient: System.enqueueJob(new InvoiceRetryJob(erpCode, amount, 1));",
        },
        otter: {
          es: "El trigger no puede llamar fuera, pero sí encolar: System.enqueueJob(new InvoiceRetryJob(erpCode, amount, 1)). El 1 es el primer intento, y la llamada directa a InvoiceClient desaparece del handler.",
          en: "The trigger cannot call out, but it can enqueue: System.enqueueJob(new InvoiceRetryJob(erpCode, amount, 1)). The 1 is the first attempt, and the direct call to InvoiceClient leaves the handler.",
        },
      },
    ],
    rubric: [
      {
        es: "Si el handler recibe 200 renovaciones cerradas a la vez, ¿encolarías 200 trabajos? ¿Cuántos deja encolar una transacción? ¿Cómo lo rediseñarías?",
        en: "If the handler receives 200 closed renewals at once, would you enqueue 200 jobs? How many does a transaction allow? How would you redesign it?",
      },
    ],
    voice: "otter",
    outro: {
      es: "El puente ya no se rinde al primer fallo, y tampoco insiste para siempre. Tienes todas las piezas de una integración de verdad. En la tarea 7 las montas: enviar las renovaciones al ERP y leer, una a una, cuáles aceptó y cuáles no.",
      en: "The bridge no longer gives up at the first failure, nor insists forever. You have every piece of a real integration. In task 7 you assemble them: send the renewals to the ERP and read, one by one, which it accepted and which it did not.",
    },
  },
};
