import type { Lesson } from "@/lib/types";

export const l01QueEsTrigger: Lesson = {
  id: "m06-l01",
  slug: "que-es-un-trigger",
  n: 1,
  kind: "lesson",
  minutes: 30,
  title: {
    es: "Qué es un trigger y cuándo se dispara",
    en: "What a trigger is and when it fires",
  },
  summary: {
    es: "El código que Salesforce ejecuta solo cuando alguien crea, edita, borra o recupera un registro. Su anatomía, sus siete eventos y dónde vive dentro de tu org.",
    en: "The code Salesforce runs by itself whenever someone creates, edits, deletes or restores a record. Its anatomy, its seven events and where it lives inside your org.",
  },
  analogy: {
    es: "Un Record-Triggered Flow, escrito en código",
    en: "A record-triggered Flow, written as code",
  },
  objectives: [
    {
      es: "Leer y escribir la cabecera de un trigger: nombre, objeto y eventos.",
      en: "Read and write a trigger's header: name, object and events.",
    },
    {
      es: "Elegir los eventos correctos para una necesidad de negocio.",
      en: "Pick the right events for a business need.",
    },
    {
      es: "Explicar por qué un trigger siempre recibe una lista y no un registro.",
      en: "Explain why a trigger always receives a list and not a single record.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Hasta ahora tu código se ejecutaba cuando tú lo lanzabas: pulsabas Execute en la Developer Console y ya. Un [[trigger]] es distinto: nadie lo lanza. Salesforce lo ejecuta solo, cada vez que ocurre algo con un registro. Es el paso que convierte lo aprendido en los Módulos 3, 4 y 5 en automatización de verdad.",
        en: "Until now your code ran when you launched it: you clicked Execute in the Developer Console and that was it. A [[trigger]] is different: nobody launches it. Salesforce runs it by itself, every time something happens to a record. It is the step that turns what you learned in Modules 3, 4 and 5 into real automation.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Ya construiste esto con clics. Un Record-Triggered Flow empieza con tres preguntas: sobre qué objeto, cuándo (se crea, se actualiza, se crea o actualiza, se borra) y si optimizas para «Fast Field Updates» o para «Actions and Related Records». Un trigger responde a las mismas tres preguntas, en una sola línea de código.",
        en: "You have already built this with clicks. A record-triggered Flow starts with three questions: on which object, when (created, updated, created or updated, deleted) and whether you optimise for “Fast Field Updates” or for “Actions and Related Records”. A trigger answers the same three questions, in a single line of code.",
      },
    },
    {
      type: "h",
      text: { es: "La anatomía", en: "The anatomy" },
    },
    {
      type: "diagram",
      id: "m06-anatomy",
      caption: {
        es: "Cuatro piezas: la palabra trigger, un nombre, el objeto después de on y, entre paréntesis, los eventos.",
        en: "Four pieces: the word trigger, a name, the object after on and, in brackets, the events.",
      },
    },
    {
      type: "code",
      code: {
        es: `trigger LeadWelcome on Lead (after insert) {
    for (Lead l : Trigger.new) {
        System.debug('Nuevo lead: ' + l.LastName + ' · ' + l.Company);
    }
}`,
        en: `trigger LeadWelcome on Lead (after insert) {
    for (Lead l : Trigger.new) {
        System.debug('New lead: ' + l.LastName + ' · ' + l.Company);
    }
}`,
      },
      caption: {
        es: "No es una clase: empieza por trigger, no por class. Y no tiene métodos: el cuerpo entre llaves es lo que se ejecuta.",
        en: "It is not a class: it starts with trigger, not class. And it has no methods: the body between the braces is what runs.",
      },
    },
    {
      type: "list",
      items: [
        {
          es: "trigger: la palabra clave. Un trigger vive en su propio archivo, igual que una clase del Módulo 5.",
          en: "trigger: the keyword. A trigger lives in its own file, just like a Module 5 class.",
        },
        {
          es: "El nombre: por convención, el objeto seguido de lo que hace o de «Trigger» (LeadWelcome, OpportunityTrigger).",
          en: "The name: by convention, the object followed by what it does or by “Trigger” (LeadWelcome, OpportunityTrigger).",
        },
        {
          es: "on Lead: un solo objeto por trigger, por su nombre de API (Invoice__c si es personalizado).",
          en: "on Lead: one object per trigger, by its API name (Invoice__c if custom).",
        },
        {
          es: "(after insert): uno o varios eventos, separados por comas.",
          en: "(after insert): one or more events, comma-separated.",
        },
      ],
    },
    {
      type: "h",
      text: { es: "Los siete eventos", en: "The seven events" },
    },
    {
      type: "p",
      text: {
        es: "Un evento combina dos cosas: la operación (insert, update, delete, undelete) y el momento (before, antes de guardar; after, después de guardar). La diferencia entre before y after es la lección 3; por ahora quédate con que existen los dos.",
        en: "An event combines two things: the operation (insert, update, delete, undelete) and the moment (before, before saving; after, after saving). The difference between before and after is lesson 3; for now, just keep in mind that both exist.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Evento", en: "Event" },
        { es: "Cuándo", en: "When" },
        { es: "En un Record-Triggered Flow", en: "In a record-triggered Flow" },
      ],
      rows: [
        [
          { es: "before insert", en: "before insert" },
          { es: "Se va a crear, aún sin guardar", en: "About to be created, not saved yet" },
          { es: "Se crea · Fast Field Updates", en: "Created · Fast Field Updates" },
        ],
        [
          { es: "after insert", en: "after insert" },
          { es: "Recién creado, ya con Id", en: "Just created, with an Id" },
          { es: "Se crea · Actions and Related Records", en: "Created · Actions and Related Records" },
        ],
        [
          { es: "before update", en: "before update" },
          { es: "Se va a guardar un cambio", en: "A change is about to be saved" },
          { es: "Se actualiza · Fast Field Updates", en: "Updated · Fast Field Updates" },
        ],
        [
          { es: "after update", en: "after update" },
          { es: "El cambio ya está guardado", en: "The change is saved" },
          { es: "Se actualiza · Actions and Related Records", en: "Updated · Actions and Related Records" },
        ],
        [
          { es: "before delete", en: "before delete" },
          { es: "Se va a borrar", en: "About to be deleted" },
          { es: "Se borra", en: "Deleted" },
        ],
        [
          { es: "after delete", en: "after delete" },
          { es: "Ya está en la Papelera", en: "Already in the Recycle Bin" },
          { es: "— (no existe)", en: "— (does not exist)" },
        ],
        [
          { es: "after undelete", en: "after undelete" },
          { es: "Recuperado de la Papelera", en: "Restored from the Recycle Bin" },
          { es: "— (no existe)", en: "— (does not exist)" },
        ],
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Lo que un trigger puede y un Flow no", en: "What a trigger can do and a Flow cannot" },
      text: {
        es: "Fíjate en las dos últimas filas: un Record-Triggered Flow no reacciona a que un registro se recupere de la Papelera, y tampoco a after delete. Un trigger sí. Tampoco existe «before undelete»: la recuperación solo tiene momento after. Es una de esas preguntas que caen en el examen Platform Developer I.",
        en: "Look at the last two rows: a record-triggered Flow does not react to a record being restored from the Recycle Bin, nor to after delete. A trigger does. There is no “before undelete” either: a restore only has an after moment. It is one of those questions that shows up on the Platform Developer I exam.",
      },
    },
    {
      type: "h",
      text: { es: "Siempre llega una lista", en: "A list always arrives" },
    },
    {
      type: "p",
      text: {
        es: "Esta es la diferencia más importante con Flow. Un Record-Triggered Flow trabaja con un registro, $Record, y Salesforce agrupa por ti las interviews cuando llegan muchas. Un trigger, en cambio, recibe todos los registros del lote a la vez en Trigger.new, que es una List: uno si alguien guarda desde la pantalla, hasta 200 si llegan de Data Loader. Por eso el código de dentro es un for, y por eso el Módulo 4 insistía tanto en bulkificar. Aquí no es un consejo: es la forma en que llegan los datos.",
        en: "This is the most important difference from Flow. A record-triggered Flow works with one record, $Record, and Salesforce groups the interviews for you when many arrive. A trigger, by contrast, receives every record in the batch at once in Trigger.new, which is a List: one if someone saves from the screen, up to 200 if they come from Data Loader. That is why the code inside is a for, and why Module 4 insisted so much on bulkifying. Here it is not advice: it is how the data arrives.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Nunca Trigger.new[0]", en: "Never Trigger.new[0]" },
      text: {
        es: "El error de principiante más visto en revisiones de código: escribir Account a = Trigger.new[0]; y trabajar con esa cuenta. Funciona cuando pruebas guardando una cuenta a mano, y con una carga de 200 procesa la primera e ignora las 199 restantes, sin dar ningún error. Recorre siempre la lista entera.",
        en: "The beginner mistake seen most often in code reviews: writing Account a = Trigger.new[0]; and working with that account. It works when you test by saving one account by hand, and with a load of 200 it processes the first and ignores the other 199, without any error. Always walk the whole list.",
      },
    },
    {
      type: "h",
      text: { es: "Dónde vive en tu org", en: "Where it lives in your org" },
    },
    {
      type: "list",
      items: [
        {
          es: "Setup → Object Manager → Lead → Triggers: la lista de triggers de ese objeto. Justo al lado está Flow Triggers, con los flows del mismo objeto. Son vecinos por algo.",
          en: "Setup → Object Manager → Lead → Triggers: the list of that object's triggers. Right next to it is Flow Triggers, with the same object's flows. They are neighbours for a reason.",
        },
        {
          es: "Para crear uno: Developer Console → File → New → Apex Trigger. Te pide el nombre y el objeto, y te da la cabecera escrita.",
          en: "To create one: Developer Console → File → New → Apex Trigger. It asks for the name and the object, and gives you the header already written.",
        },
        {
          es: "Setup → Apex Triggers: todos los triggers de la org. Desde ahí se ve si están activos, como las versiones de un flow.",
          en: "Setup → Apex Triggers: every trigger in the org. From there you can see whether they are active, like a flow's versions.",
        },
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Varios triggers en el mismo objeto", en: "Several triggers on the same object" },
      text: {
        es: "Salesforce te deja crear dos triggers sobre Lead con el mismo evento, pero no garantiza cuál se ejecuta primero. Es como tener dos flows sin ordenar en Flow Trigger Explorer, pero sin la opción de ordenarlos. Por eso la práctica profesional es un solo trigger por objeto, y es exactamente lo que construirás en el Módulo 7.",
        en: "Salesforce lets you create two triggers on Lead with the same event, but it does not guarantee which runs first. It is like having two unordered flows in Flow Trigger Explorer, without the option to order them. That is why professional practice is one trigger per object, and it is exactly what you will build in Module 7.",
      },
    },
    {
      type: "h",
      text: { es: "Dónde se escribe un trigger… y dónde no", en: "Where a trigger is written… and where it is not" },
    },
    {
      type: "p",
      text: {
        es: "Un flow lo puedes crear y activar directamente en producción. Un trigger no: en una org de producción no se puede escribir ni editar código Apex desde la interfaz. Se escribe en un sandbox o en una Developer Org, se prueba, y se despliega a producción, y el despliegue solo se acepta si las clases de test cubren al menos el 75 % del código (Módulo 10). Tu Developer Org es la excepción: es tu propio laboratorio, y en ella sí puedes escribir directamente.",
        en: "A flow can be built and activated straight in production. A trigger cannot: in a production org you cannot write or edit Apex code from the UI. It is written in a sandbox or a Developer Org, tested, and deployed to production, and the deployment is only accepted if the test classes cover at least 75% of the code (Module 10). Your Developer Org is the exception: it is your own lab, and there you can write directly.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Como un change set, pero con examen", en: "Like a change set, but with an exam" },
      text: {
        es: "Si alguna vez subiste campos o flows de un sandbox a producción con un change set, ya conoces el camino. Con Apex es el mismo, con una condición más: al desplegar, Salesforce ejecuta los tests y rechaza el paquete si no llegan a la cobertura mínima. Por eso ningún developer serio escribe un trigger sin su clase de test al lado.",
        en: "If you ever moved fields or flows from a sandbox to production with a change set, you already know the path. With Apex it is the same, with one extra condition: on deployment, Salesforce runs the tests and rejects the package if they fall short of the minimum coverage. That is why no serious developer writes a trigger without its test class next to it.",
      },
    },
    {
      type: "h",
      text: { es: "El encargo de este módulo", en: "This module's assignment" },
    },
    {
      type: "p",
      text: {
        es: "La org de Northwind ha crecido a base de Record-Triggered Flows, y algunos se han quedado cortos: se vuelven lentos con las cargas masivas, chocan entre sí o necesitan lógica que en el lienzo es un laberinto. El equipo ha decidido migrar los más críticos a Apex, uno por uno. Ese es el encargo del módulo: cada taller migra uno de esos flows a un trigger, empezando por el más sencillo y terminando por el escalado de casos de Soporte, que es el que el Módulo 7 convertirá en una arquitectura profesional.",
        en: "Northwind's org has grown on record-triggered flows, and some have fallen short: they slow down under bulk loads, collide with each other or need logic that is a maze on the canvas. The team has decided to migrate the most critical ones to Apex, one by one. That is this module's assignment: each workshop migrates one of those flows to a trigger, starting with the simplest and ending with Support's case escalation, which Module 7 will turn into a professional architecture.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Los seis flows que se migran", en: "The six flows being migrated" },
      text: {
        es: "1 · El registro de leads del formulario web (Marketing). 2 · El rastro de cambios de etapa de las oportunidades (Ventas). 3 · El alta de cuentas nuevas con su tarea de bienvenida. 4 · El país de los contactos que exige una regla de validación. 5 · La revisión de oportunidades que se pelea con otro equipo. 6 · El escalado de casos de Soporte. Seis objetos distintos: al acabar habrás tocado casi todo Sales Cloud desde el código.",
        en: "1 · Logging web-form leads (Marketing). 2 · The opportunity stage-change trail (Sales). 3 · Onboarding new accounts with their welcome task. 4 · The contacts' country a validation rule requires. 5 · The opportunity review clashing with another team. 6 · Support's case escalation. Six different objects: by the end you will have touched nearly all of Sales Cloud from code.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "Ninguno de los dos libros de Java tiene un equivalente, y no es un olvido: Java no trae triggers. Lo más parecido en Java son los eventos de una interfaz gráfica, como el ActionListener del botón Agregar en el formulario de facturas del libro: código que se ejecuta cuando alguien pulsa. Un trigger es la misma idea, pero el «botón» es guardar un registro, y lo pulsa cualquiera: un usuario, Data Loader, una integración o un flow.",
        en: "Neither Java book has an equivalent, and it is not an oversight: Java has no triggers. The closest thing in Java is a GUI event, like the ActionListener on the Add button in the book's invoice form: code that runs when someone clicks. A trigger is the same idea, but the “button” is saving a record, and anyone can press it: a user, Data Loader, an integration or a flow.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué cuatro piezas tiene la cabecera de un trigger? ¿Qué evento no tiene versión before? ¿Por qué el cuerpo de casi todos los triggers empieza con un for?",
        en: "Without looking: which four pieces does a trigger header have? Which event has no before version? Why does the body of almost every trigger start with a for?",
      },
    },
  ],

  quiz: [
    {
      id: "m06-l01-q1",
      kind: "single",
      prompt: {
        es: "¿Qué cabecera es válida?",
        en: "Which header is valid?",
      },
      options: [
        { es: "trigger CaseTrigger on Case (before insert, after update)", en: "trigger CaseTrigger on Case (before insert, after update)" },
        { es: "trigger CaseTrigger on Case, Account (before insert)", en: "trigger CaseTrigger on Case, Account (before insert)" },
        { es: "public class CaseTrigger on Case (before insert)", en: "public class CaseTrigger on Case (before insert)" },
        { es: "trigger CaseTrigger on Case (before undelete)", en: "trigger CaseTrigger on Case (before undelete)" },
      ],
      answer: 0,
      explain: {
        es: "Varios eventos separados por comas, sí; varios objetos, no. Un trigger no es una clase, y before undelete no existe.",
        en: "Several comma-separated events, yes; several objects, no. A trigger is not a class, and before undelete does not exist.",
      },
      tags: ["find-error"],
    },
    {
      id: "m06-l01-q2",
      kind: "single",
      prompt: {
        es: "Un usuario carga 150 contactos con Data Loader. ¿Cuántas veces se ejecuta un trigger after insert sobre Contact y cuántos registros trae Trigger.new?",
        en: "A user loads 150 contacts with Data Loader. How many times does an after insert trigger on Contact run, and how many records does Trigger.new hold?",
      },
      options: [
        { es: "Una vez, con 150 registros", en: "Once, with 150 records" },
        { es: "150 veces, con un registro cada vez", en: "150 times, with one record each" },
        { es: "Una vez, con un registro", en: "Once, with one record" },
      ],
      answer: 0,
      explain: {
        es: "Con el tamaño de lote por defecto (200), los 150 caben en un solo lote: una ejecución, 150 registros en la lista. Con 450 serían tres ejecuciones (200 + 200 + 50).",
        en: "With the default batch size (200), all 150 fit in one batch: one run, 150 records in the list. With 450 it would be three runs (200 + 200 + 50).",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M4 L3", en: "Review · M4 L3" },
    },
    {
      id: "m06-l01-q3",
      kind: "single",
      prompt: {
        es: "¿Qué tiene de malo este trigger?",
        en: "What is wrong with this trigger?",
      },
      code: {
        es: `trigger AccountWelcome on Account (after insert) {
    Account a = Trigger.new[0];
    System.debug('Bienvenida: ' + a.Name);
}`,
        en: `trigger AccountWelcome on Account (after insert) {
    Account a = Trigger.new[0];
    System.debug('Welcome: ' + a.Name);
}`,
      },
      options: [
        {
          es: "Solo procesa la primera cuenta del lote; las demás se ignoran sin error.",
          en: "It only processes the first account in the batch; the rest are ignored without an error.",
        },
        { es: "No compila: Trigger.new no se puede leer en after insert.", en: "It does not compile: Trigger.new cannot be read in after insert." },
        { es: "Nada, es correcto.", en: "Nothing, it is correct." },
      ],
      answer: 0,
      explain: {
        es: "Funciona al probar a mano y falla en silencio con una carga masiva. Se recorre la lista con for (Account a : Trigger.new).",
        en: "It works when tested by hand and fails silently with a mass load. You walk the list with for (Account a : Trigger.new).",
      },
      tags: ["find-error"],
    },
    {
      id: "m06-l01-q4",
      kind: "multi",
      prompt: {
        es: "¿Qué eventos puede escuchar un trigger pero NO un Record-Triggered Flow?",
        en: "Which events can a trigger listen to but a record-triggered Flow CANNOT?",
      },
      options: [
        { es: "after undelete", en: "after undelete" },
        { es: "after delete", en: "after delete" },
        { es: "before update", en: "before update" },
        { es: "after insert", en: "after insert" },
      ],
      answers: [0, 1],
      explain: {
        es: "Los Record-Triggered Flows tienen «se borra» solo antes del borrado, y no reaccionan a la recuperación. Insert y update existen en los dos.",
        en: "Record-triggered flows have “deleted” only before the deletion, and do not react to restores. Insert and update exist in both.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m06-l01-q5",
      kind: "single",
      prompt: {
        es: "Tu org tiene dos triggers after insert sobre Opportunity. ¿En qué orden se ejecutan?",
        en: "Your org has two after insert triggers on Opportunity. In what order do they run?",
      },
      options: [
        { es: "No está garantizado.", en: "It is not guaranteed." },
        { es: "Por orden alfabético del nombre.", en: "Alphabetically by name." },
        { es: "Por fecha de creación.", en: "By creation date." },
      ],
      answer: 0,
      explain: {
        es: "Salesforce no garantiza ningún orden entre triggers del mismo objeto y evento. Por eso la norma es un trigger por objeto (Módulo 7).",
        en: "Salesforce guarantees no order between triggers on the same object and event. That is why the rule is one trigger per object (Module 7).",
      },
      tags: ["recall"],
    },
    {
      id: "m06-l01-q6",
      kind: "text",
      prompt: {
        es: "Escribe la cabecera completa de un trigger llamado InvoiceTrigger sobre el objeto personalizado Invoice__c que se dispare en before insert y before update (sin la llave).",
        en: "Write the full header of a trigger called InvoiceTrigger on the custom object Invoice__c that fires on before insert and before update (without the brace).",
      },
      accept: [
        "trigger\\s+InvoiceTrigger\\s+on\\s+Invoice__c\\s*\\(\\s*before\\s+insert\\s*,\\s*before\\s+update\\s*\\)\\s*\\{?",
        "trigger\\s+InvoiceTrigger\\s+on\\s+Invoice__c\\s*\\(\\s*before\\s+update\\s*,\\s*before\\s+insert\\s*\\)\\s*\\{?",
      ],
      placeholder: { es: "trigger …", en: "trigger …" },
      explain: {
        es: "trigger InvoiceTrigger on Invoice__c (before insert, before update). El orden de los eventos entre paréntesis da igual.",
        en: "trigger InvoiceTrigger on Invoice__c (before insert, before update). The order of the events in brackets does not matter.",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 1 DE 6 · Primer flow que se migra, el más sencillo: el registro de leads del formulario web de Marketing. Marketing quiere saber, en el log, qué leads entran por el formulario web justo al crearse. Escribe el trigger que los recorre todos, estén llegando de uno en uno o de 200 en 200.",
      en: "TASK 1 OF 6 · The first flow to migrate, the simplest: Marketing's web-form lead log. Marketing wants to see in the log which leads come in through the web form right as they are created. Write the trigger that walks all of them, whether they arrive one at a time or 200 at a time.",
    },
    brief: [
      {
        es: "Un trigger llamado LeadWelcome sobre Lead que se dispare solo en after insert.",
        en: "A trigger called LeadWelcome on Lead that fires only on after insert.",
      },
      {
        es: "Recorre todos los leads recibidos con un for-each sobre Trigger.new, sin usar [0].",
        en: "Walk every lead received with a for-each over Trigger.new, without using [0].",
      },
      {
        es: "Para cada uno, muestra con System.debug su LastName y su Company.",
        en: "For each one, show its LastName and Company with System.debug.",
      },
      {
        es: "Al final, fuera del bucle, muestra cuántos leads llegaron en esta ejecución.",
        en: "At the end, outside the loop, show how many leads arrived in this run.",
      },
    ],
    starter: {
      es: `// CASO: la migración de flows a Apex de Northwind
// Tarea 1 de 6: el flow de leads del formulario web, ahora como trigger.

// Escribe aquí el trigger LeadWelcome
`,
      en: `// CASE: Northwind's flow-to-Apex migration
// Task 1 of 6: the web-form leads flow, now as a trigger.

// Write the LeadWelcome trigger here
`,
    },
    hints: [
      {
        es: "Cabecera: palabra clave, nombre, on y el objeto, y el evento entre paréntesis.",
        en: "Header: keyword, name, on and the object, and the event in brackets.",
      },
      {
        es: "Dentro, for (Lead l : Trigger.new) { … }. Trigger.new es una List<Lead>, así que tiene size().",
        en: "Inside, for (Lead l : Trigger.new) { … }. Trigger.new is a List<Lead>, so it has size().",
      },
      {
        es: "Pseudocódigo: trigger LeadWelcome on Lead (after insert) { for (Lead l : Trigger.new) { System.debug(l.LastName + ' · ' + l.Company); } System.debug(Trigger.new.size()); }",
        en: "Pseudocode: trigger LeadWelcome on Lead (after insert) { for (Lead l : Trigger.new) { System.debug(l.LastName + ' · ' + l.Company); } System.debug(Trigger.new.size()); }",
      },
    ],
    solution: {
      es: `trigger LeadWelcome on Lead (after insert) {
    for (Lead l : Trigger.new) {
        System.debug('Nuevo lead: ' + l.LastName + ' · ' + l.Company);
    }
    System.debug('Leads en esta ejecución: ' + Trigger.new.size());
}`,
      en: `trigger LeadWelcome on Lead (after insert) {
    for (Lead l : Trigger.new) {
        System.debug('New lead: ' + l.LastName + ' · ' + l.Company);
    }
    System.debug('Leads in this run: ' + Trigger.new.size());
}`,
    },
    checks: [
      {
        id: "m06-l01-c1",
        label: {
          es: "Cabecera: trigger LeadWelcome on Lead (after insert)",
          en: "Header: trigger LeadWelcome on Lead (after insert)",
        },
        rule: { op: "match", pattern: "trigger\\s+LeadWelcome\\s+on\\s+Lead\\s*\\(\\s*after\\s+insert\\s*\\)\\s*\\{" },
        onFail: {
          es: "trigger LeadWelcome on Lead (after insert) { … } — un solo evento: after insert.",
          en: "trigger LeadWelcome on Lead (after insert) { … } — a single event: after insert.",
        },
      },
      {
        id: "m06-l01-c2",
        label: {
          es: "Recorre Trigger.new con un for-each y no usa [0]",
          en: "Walks Trigger.new with a for-each and does not use [0]",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "for\\s*\\(\\s*Lead\\s+\\w+\\s*:\\s*Trigger\\.new\\s*\\)" },
            { op: "absent", pattern: "Trigger\\.new\\s*\\[\\s*\\d+\\s*\\]" },
          ],
        },
        onFail: {
          es: "for (Lead l : Trigger.new) { … }. Trigger.new[0] se queda solo con el primero del lote.",
          en: "for (Lead l : Trigger.new) { … }. Trigger.new[0] keeps only the first in the batch.",
        },
      },
      {
        id: "m06-l01-c3",
        label: {
          es: "Muestra LastName y Company de cada lead",
          en: "Shows each lead's LastName and Company",
        },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "System\\.debug\\([^;]*\\.LastName\\b[^;]*\\.Company\\b[^;]*\\)" },
            { op: "match", pattern: "System\\.debug\\([^;]*\\.Company\\b[^;]*\\.LastName\\b[^;]*\\)" },
          ],
        },
        onFail: {
          es: "Dentro del bucle: System.debug(l.LastName + ' · ' + l.Company);",
          en: "Inside the loop: System.debug(l.LastName + ' · ' + l.Company);",
        },
      },
      {
        id: "m06-l01-c4",
        label: {
          es: "Muestra cuántos llegaron con Trigger.new.size()",
          en: "Shows how many arrived with Trigger.new.size()",
        },
        rule: { op: "match", pattern: "Trigger\\.(new\\.size\\(\\s*\\)|size)" },
        onFail: {
          es: "Trigger.new es una lista: System.debug(Trigger.new.size());",
          en: "Trigger.new is a list: System.debug(Trigger.new.size());",
        },
        onPass: {
          es: "Un lead desde la pantalla o 200 desde Data Loader: el mismo código los recorre todos.",
          en: "One lead from the screen or 200 from Data Loader: the same code walks them all.",
        },
      },
    ],
    rubric: [
      {
        es: "Si Marketing también quisiera verlo cuando un lead se edita, ¿qué cambiarías en la cabecera y qué se quedaría igual?",
        en: "If Marketing also wanted to see it when a lead is edited, what would you change in the header and what would stay the same?",
      },
      {
        es: "Tarea 2: el siguiente flow es de Ventas y no mira solo el registro nuevo: necesita saber qué valor tenía antes.",
        en: "Task 2: the next flow belongs to Sales and does not only look at the new record: it needs to know the previous value.",
      },
    ],
  },
};
