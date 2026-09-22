import type { Lesson } from "@/lib/types";

export const l04GovernorLimits: Lesson = {
  id: "m04-l04",
  slug: "governor-limits",
  n: 4,
  kind: "lesson",
  minutes: 30,
  title: {
    es: "Governor Limits: qué se cuenta y por qué",
    en: "Governor limits: what is counted and why",
  },
  summary: {
    es: "Los topes que Salesforce pone a cada transacción, por qué existen, cuáles vas a tocar primero y cómo medir lo que gasta tu código antes de que lo mida producción.",
    en: "The caps Salesforce puts on every transaction, why they exist, which ones you will hit first, and how to measure what your code spends before production measures it for you.",
  },
  analogy: {
    es: "El correo de error de Flow que dice «Too many SOQL queries: 101»",
    en: "The Flow error email that says “Too many SOQL queries: 101”",
  },
  objectives: [
    {
      es: "Explicar por qué existen los governor limits y qué es una transacción.",
      en: "Explain why governor limits exist and what a transaction is.",
    },
    {
      es: "Recordar los límites que más se tocan: consultas, filas, DML, CPU y heap.",
      en: "Remember the limits most often hit: queries, rows, DML, CPU and heap.",
    },
    {
      es: "Medir el consumo con la clase Limits.",
      en: "Measure consumption with the Limits class.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Has oído hablar de los [[governor-limits|governor limits]] desde el Módulo 1. Ya tienes todo lo necesario para entenderlos de verdad: sabes qué es una consulta, qué es un DML y por qué un bucle puede multiplicarlos. Esta lección pone los números encima de la mesa.",
        en: "You have heard about [[governor-limits|governor limits]] since Module 1. You now have everything you need to really understand them: you know what a query is, what a DML is and why a loop can multiply them. This lesson puts the numbers on the table.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Ya te has cruzado con ellos", en: "You have already run into them" },
      text: {
        es: "Si alguna vez te llegó el correo «An error occurred with your … flow» con el texto «Too many SOQL queries: 101» o «Too many DML statements: 151», ya conoces un governor limit. El Flow no tenía un fallo de lógica: hizo más viajes a la base de datos de los que la transacción permite. Apex juega exactamente con las mismas reglas, y con el mismo contador.",
        en: "If you ever got the “An error occurred with your … flow” email with the text “Too many SOQL queries: 101” or “Too many DML statements: 151”, you already know a governor limit. The Flow had no logic bug: it made more trips to the database than the transaction allows. Apex plays by exactly the same rules, and with the same counter.",
      },
    },
    {
      type: "h",
      text: { es: "Por qué existen", en: "Why they exist" },
    },
    {
      type: "p",
      text: {
        es: "Tu org no tiene servidores propios: comparte la infraestructura con miles de otras empresas. Es lo que Salesforce llama arquitectura [[multitenant]]. Si un código mal escrito de otra empresa pudiera acaparar la base de datos durante diez minutos, tu org se volvería lenta sin que tú hubieras hecho nada. Los governor limits son el reparto justo: cada transacción recibe un presupuesto, y quien lo supera se detiene sin molestar a los demás.",
        en: "Your org has no servers of its own: it shares infrastructure with thousands of other companies. This is what Salesforce calls a [[multitenant]] architecture. If another company's badly written code could hog the database for ten minutes, your org would slow down without you having done anything. Governor limits are the fair share: every transaction gets a budget, and whoever exceeds it is stopped without bothering anyone else.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Una comparación (simplificada)", en: "A comparison (simplified)" },
      text: {
        es: "Piensa en un edificio de oficinas con el agua y la luz compartidas: cada oficina tiene un tope por día para que ninguna deje a las demás sin suministro. Es una simplificación: en realidad los límites no se miden por día sino por transacción, y cada uno protege un recurso distinto (base de datos, procesador, memoria). Pero la idea de fondo es esa.",
        en: "Picture an office building with shared water and power: each office has a daily cap so none leaves the others without supply. It is a simplification: in reality the limits are not measured per day but per transaction, and each protects a different resource (database, processor, memory). But the underlying idea is that.",
      },
    },
    {
      type: "h",
      text: { es: "Qué es exactamente una transacción", en: "What exactly a transaction is" },
    },
    {
      type: "p",
      text: {
        es: "Una [[transaccion|transacción]] es todo lo que ocurre a raíz de un mismo guardado: el trigger, los flows desencadenados por registro, las reglas de validación, las actualizaciones de campo, otros triggers que esos cambios disparen… Todo comparte el mismo presupuesto. Por eso tu trigger puede fallar por culpa de consultas que hizo un flow antes que él, y al revés. Los límites no son de tu código: son del guardado entero.",
        en: "A [[transaccion|transaction]] is everything that happens as a result of one single save: the trigger, the record-triggered flows, the validation rules, the field updates, other triggers those changes fire… All of it shares the same budget. That is why your trigger can fail because of queries a flow made before it, and vice versa. The limits are not your code's: they belong to the whole save.",
      },
    },
    {
      type: "h",
      text: { es: "Los que vas a tocar primero", en: "The ones you will hit first" },
    },
    {
      type: "table",
      head: [
        { es: "Límite por transacción", en: "Per-transaction limit" },
        { es: "Síncrono", en: "Synchronous" },
        { es: "Asíncrono (Módulo 9)", en: "Asynchronous (Module 9)" },
        { es: "Qué lo gasta", en: "What spends it" },
      ],
      rows: [
        [
          { es: "Consultas SOQL", en: "SOQL queries" },
          { es: "100", en: "100" },
          { es: "200", en: "200" },
          { es: "Cada [SELECT …] y cada Get Records", en: "Every [SELECT …] and every Get Records" },
        ],
        [
          { es: "Filas devueltas por SOQL", en: "Rows returned by SOQL" },
          { es: "50.000", en: "50,000" },
          { es: "50.000", en: "50,000" },
          { es: "La suma de filas de todas las consultas", en: "The sum of rows from all queries" },
        ],
        [
          { es: "Instrucciones DML", en: "DML statements" },
          { es: "150", en: "150" },
          { es: "150", en: "150" },
          { es: "Cada insert/update/delete/upsert, tenga 1 o 200 registros", en: "Every insert/update/delete/upsert, whether 1 or 200 records" },
        ],
        [
          { es: "Filas procesadas por DML", en: "Rows processed by DML" },
          { es: "10.000", en: "10,000" },
          { es: "10.000", en: "10,000" },
          { es: "La suma de registros de todos los DML", en: "The sum of records across all DML" },
        ],
        [
          { es: "Tiempo de CPU", en: "CPU time" },
          { es: "10 s", en: "10 s" },
          { es: "60 s", en: "60 s" },
          { es: "Bucles, cálculos, flows, fórmulas…", en: "Loops, calculations, flows, formulas…" },
        ],
        [
          { es: "Memoria (heap)", en: "Memory (heap)" },
          { es: "6 MB", en: "6 MB" },
          { es: "12 MB", en: "12 MB" },
          { es: "Listas, mapas y objetos que guardas", en: "Lists, maps and objects you hold" },
        ],
        [
          { es: "Búsquedas SOSL", en: "SOSL searches" },
          { es: "20", en: "20" },
          { es: "20", en: "20" },
          { es: "Cada [FIND …]", en: "Every [FIND …]" },
        ],
      ],
    },
    {
      type: "diagram",
      id: "m04-limits",
      caption: {
        es: "El resumen que verás al final de cada log. La barra que se acerca al final es la que tienes que vigilar.",
        en: "The summary you will see at the end of every log. The bar approaching its end is the one to watch.",
      },
    },
    {
      type: "p",
      text: {
        es: "Fíjate en la diferencia entre instrucciones y filas. Un update de una lista de 200 cuentas es 1 instrucción DML y 200 filas. Por eso la bulkificación de la lección anterior funciona: no reduce los registros que guardas, reduce los viajes. 150 viajes se acaban enseguida; 10.000 filas dan para mucho.",
        en: "Notice the difference between statements and rows. An update of a list of 200 accounts is 1 DML statement and 200 rows. That is why the previous lesson's bulkification works: it does not reduce the records you save, it reduces the trips. 150 trips run out fast; 10,000 rows go a long way.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "LimitException no se puede capturar", en: "LimitException cannot be caught" },
      text: {
        es: "Cuando se supera un límite, Salesforce lanza System.LimitException y detiene la transacción en seco. A diferencia de otros errores, no hay try/catch que la atrape (lo verás en el Módulo 8). Todo lo que la transacción había guardado se deshace. La única defensa es no llegar: bulkificar y medir.",
        en: "When a limit is exceeded, Salesforce throws System.LimitException and stops the transaction dead. Unlike other errors, no try/catch can catch it (you will see this in Module 8). Everything the transaction had saved is undone. The only defence is not getting there: bulkify and measure.",
      },
    },
    {
      type: "h",
      text: { es: "Medir: la clase Limits", en: "Measuring: the Limits class" },
    },
    {
      type: "code",
      code: {
        es: `System.debug('Consultas: ' + Limits.getQueries() + ' de ' + Limits.getLimitQueries());
System.debug('DML: '       + Limits.getDmlStatements() + ' de ' + Limits.getLimitDmlStatements());
System.debug('Filas DML: ' + Limits.getDmlRows() + ' de ' + Limits.getLimitDmlRows());
System.debug('CPU (ms): '  + Limits.getCpuTime() + ' de ' + Limits.getLimitCpuTime());`,
        en: `System.debug('Queries: '   + Limits.getQueries() + ' of ' + Limits.getLimitQueries());
System.debug('DML: '       + Limits.getDmlStatements() + ' of ' + Limits.getLimitDmlStatements());
System.debug('DML rows: '  + Limits.getDmlRows() + ' of ' + Limits.getLimitDmlRows());
System.debug('CPU (ms): '  + Limits.getCpuTime() + ' of ' + Limits.getLimitCpuTime());`,
      },
      caption: {
        es: "Cada límite tiene su pareja: getX() dice cuánto llevas gastado y getLimitX() cuánto tienes. Son métodos static: no hace falta crear nada (Módulo 5).",
        en: "Each limit has its pair: getX() says how much you have spent and getLimitX() how much you have. They are static methods: no need to create anything (Module 5).",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Leer el log como un Admin con lupa", en: "Reading the log like an Admin with a magnifying glass" },
      text: {
        es: "Al final de cualquier debug log hay un bloque LIMIT_USAGE_FOR_NS con todos los contadores: «Number of SOQL queries: 3 out of 100». Si depuras un Flow que falla por límites, ese bloque te dice quién se come el presupuesto. Es la misma información que la clase Limits, pero al final en lugar de en el momento que tú elijas.",
        en: "At the end of any debug log there is a LIMIT_USAGE_FOR_NS block with every counter: “Number of SOQL queries: 3 out of 100”. If you are debugging a Flow that fails on limits, that block tells you who is eating the budget. It is the same information as the Limits class, but at the end instead of at the moment you choose.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "En el libro, un programa Java se ejecuta en tu ordenador con todos sus recursos: puede abrir tantas conexiones y hacer tantas consultas como quiera, y si es lento, solo tú esperas. No hay nada parecido a un governor limit en todo el libro, y no es un olvido: Java no los tiene. Es la mayor diferencia de mentalidad entre programar en Java y programar en Salesforce: aquí cada viaje a la base de datos tiene un precio y un presupuesto.",
        en: "In the book, a Java program runs on your computer with all its resources: it can open as many connections and run as many queries as it likes, and if it is slow, only you wait. There is nothing like a governor limit anywhere in the book, and it is not an oversight: Java has none. It is the biggest mindset difference between programming in Java and programming in Salesforce: here every trip to the database has a price and a budget.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿cuántas consultas y cuántas instrucciones DML tienes en una transacción síncrona? Un update de 300 contactos, ¿cuánto gasta de cada contador de DML? ¿Qué parte de un guardado comparte presupuesto con tu trigger?",
        en: "Without looking: how many queries and how many DML statements do you get in a synchronous transaction? An update of 300 contacts, how much does it spend of each DML counter? Which parts of a save share the budget with your trigger?",
      },
    },
  ],

  quiz: [
    {
      id: "m04-l04-q1",
      kind: "single",
      prompt: {
        es: "Un update de una lista con 300 contactos, ¿qué gasta?",
        en: "An update of a list with 300 contacts, what does it spend?",
      },
      options: [
        { es: "1 instrucción DML y 300 filas DML", en: "1 DML statement and 300 DML rows" },
        { es: "300 instrucciones DML", en: "300 DML statements" },
        { es: "1 instrucción DML y 1 fila DML", en: "1 DML statement and 1 DML row" },
      ],
      answer: 0,
      explain: {
        es: "Un viaje, 300 registros. El límite de instrucciones (150) cuenta viajes; el de filas (10.000) cuenta registros.",
        en: "One trip, 300 records. The statement limit (150) counts trips; the row limit (10,000) counts records.",
      },
      tags: ["recall"],
    },
    {
      id: "m04-l04-q2",
      kind: "single",
      prompt: {
        es: "Un flow desencadenado por registro hace 60 consultas. Después, en el mismo guardado, tu trigger hace 45. ¿Qué pasa?",
        en: "A record-triggered flow runs 60 queries. Then, in the same save, your trigger runs 45. What happens?",
      },
      options: [
        {
          es: "La transacción falla: entre los dos suman 105 y el límite es 100.",
          en: "The transaction fails: together they add up to 105 and the limit is 100.",
        },
        {
          es: "Nada: cada uno tiene sus propias 100.",
          en: "Nothing: each has its own 100.",
        },
        {
          es: "Falla solo el flow.",
          en: "Only the flow fails.",
        },
      ],
      answer: 0,
      explain: {
        es: "El presupuesto es de la transacción, no de cada automatización. Flow y Apex lo comparten.",
        en: "The budget belongs to the transaction, not to each automation. Flow and Apex share it.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m04-l04-q3",
      kind: "single",
      prompt: {
        es: "Tu código supera el límite de consultas. Pones un try/catch alrededor para capturar el error. ¿Qué pasa?",
        en: "Your code exceeds the query limit. You wrap it in a try/catch to catch the error. What happens?",
      },
      options: [
        {
          es: "No sirve: LimitException no se puede capturar y la transacción se deshace entera.",
          en: "It does not help: LimitException cannot be caught and the whole transaction is rolled back.",
        },
        { es: "El catch la captura y el código sigue.", en: "The catch catches it and the code continues." },
        { es: "Salesforce amplía el límite a 200.", en: "Salesforce raises the limit to 200." },
      ],
      answer: 0,
      explain: {
        es: "La única defensa contra un límite es no alcanzarlo. Por eso se bulkifica y se mide antes.",
        en: "The only defence against a limit is not reaching it. That is why you bulkify and measure beforehand.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m04-l04-q4",
      kind: "single",
      prompt: {
        es: "¿Qué muestra este código si es lo primero que se ejecuta en la transacción?",
        en: "What does this code print if it is the first thing run in the transaction?",
      },
      code: {
        es: `List<Account> a = [SELECT Id FROM Account LIMIT 5];
List<Contact> c = [SELECT Id FROM Contact LIMIT 5];
System.debug(Limits.getQueries());`,
        en: `List<Account> a = [SELECT Id FROM Account LIMIT 5];
List<Contact> c = [SELECT Id FROM Contact LIMIT 5];
System.debug(Limits.getQueries());`,
      },
      options: [
        { es: "2", en: "2" },
        { es: "100", en: "100" },
        { es: "10", en: "10" },
      ],
      answer: 0,
      explain: {
        es: "getQueries() dice cuántas llevas: dos. getLimitQueries() diría 100. Las 10 filas cuentan en otro contador, getQueryRows().",
        en: "getQueries() says how many you have run: two. getLimitQueries() would say 100. The 10 rows count on another counter, getQueryRows().",
      },
      tags: ["predict-output"],
    },
    {
      id: "m04-l04-q5",
      kind: "multi",
      prompt: {
        es: "¿Qué gasta tiempo de CPU de la transacción?",
        en: "What spends the transaction's CPU time?",
      },
      options: [
        { es: "Un bucle anidado que recorre 200 × 200 elementos.", en: "A nested loop over 200 × 200 elements." },
        { es: "Un flow desencadenado por registro del mismo guardado.", en: "A record-triggered flow in the same save." },
        { es: "El tiempo que la base de datos tarda en responder a una consulta.", en: "The time the database takes to answer a query." },
        { es: "Tu código Apex calculando descuentos.", en: "Your Apex code calculating discounts." },
      ],
      answers: [0, 1, 3],
      explain: {
        es: "La CPU mide el trabajo del servidor de aplicación: Apex, flows, fórmulas. El tiempo de espera de la base de datos no cuenta como CPU. El bucle 200 × 200 son 40.000 vueltas: es el VLOOKUP manual del Módulo 2.",
        en: "CPU measures the application server's work: Apex, flows, formulas. Database wait time does not count as CPU. The 200 × 200 loop is 40,000 iterations: it is Module 2's manual VLOOKUP.",
      },
      tags: ["interleaving", "spaced"],
      from: { es: "Repaso · M2 L7", en: "Review · M2 L7" },
    },
    {
      id: "m04-l04-q6",
      kind: "text",
      prompt: {
        es: "¿Qué método de la clase Limits te dice cuántas instrucciones DML llevas gastadas?",
        en: "Which Limits class method tells you how many DML statements you have spent?",
      },
      accept: ["^\\s*(Limits\\.)?getDmlStatements\\s*(\\(\\s*\\))?\\s*;?\\s*$"],
      placeholder: { es: "método", en: "method" },
      explain: {
        es: "Limits.getDmlStatements(). Su pareja, Limits.getLimitDmlStatements(), devuelve 150.",
        en: "Limits.getDmlStatements(). Its pair, Limits.getLimitDmlStatements(), returns 150.",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "Vas a revisar el código de otros compañeros y quieres una herramienta reutilizable para medir cuánto gasta cada bloque. Escribe una clase con un método que imprima los cuatro contadores principales y avise cuando uno pase del 80 %.",
      en: "You are going to review colleagues' code and want a reusable tool to measure how much each block spends. Write a class with a method that prints the four main counters and warns when one goes over 80%.",
    },
    brief: [
      {
        es: "Una clase pública LimitsReport con un método public static void log(String label).",
        en: "A public class LimitsReport with a method public static void log(String label).",
      },
      {
        es: "El método muestra, junto a label, lo gastado y el máximo de: consultas, instrucciones DML, filas DML y CPU.",
        en: "The method shows, next to label, the spent amount and the maximum for: queries, DML statements, DML rows and CPU.",
      },
      {
        es: "Si las consultas gastadas superan el 80 % del máximo, muestra además un aviso con System.debug(LoggingLevel.WARN, ...).",
        en: "If the queries spent go over 80% of the maximum, also show a warning with System.debug(LoggingLevel.WARN, ...).",
      },
    ],
    starter: {
      es: `public class LimitsReport {

}
`,
      en: `public class LimitsReport {

}
`,
    },
    hints: [
      {
        es: "Todos los métodos de Limits van en parejas: getQueries / getLimitQueries, getDmlStatements / getLimitDmlStatements, getDmlRows / getLimitDmlRows, getCpuTime / getLimitCpuTime.",
        en: "All Limits methods come in pairs: getQueries / getLimitQueries, getDmlStatements / getLimitDmlStatements, getDmlRows / getLimitDmlRows, getCpuTime / getLimitCpuTime.",
      },
      {
        es: "El método es static porque no guarda estado: se llama LimitsReport.log('antes del bucle'). El 80 % es un if del Módulo 2: Limits.getQueries() > Limits.getLimitQueries() * 0.8.",
        en: "The method is static because it holds no state: you call LimitsReport.log('before the loop'). The 80% is a Module 2 if: Limits.getQueries() > Limits.getLimitQueries() * 0.8.",
      },
      {
        es: "Pseudocódigo: public static void log(String label) { System.debug(label + ' · SOQL ' + Limits.getQueries() + '/' + Limits.getLimitQueries()); … cuatro líneas … if (Limits.getQueries() > Limits.getLimitQueries() * 0.8) { System.debug(LoggingLevel.WARN, ...); } }",
        en: "Pseudocode: public static void log(String label) { System.debug(label + ' · SOQL ' + Limits.getQueries() + '/' + Limits.getLimitQueries()); … four lines … if (Limits.getQueries() > Limits.getLimitQueries() * 0.8) { System.debug(LoggingLevel.WARN, ...); } }",
      },
    ],
    solution: {
      es: `public class LimitsReport {

    public static void log(String label) {
        System.debug(label + ' · SOQL '      + Limits.getQueries()       + '/' + Limits.getLimitQueries());
        System.debug(label + ' · DML '       + Limits.getDmlStatements() + '/' + Limits.getLimitDmlStatements());
        System.debug(label + ' · filas DML ' + Limits.getDmlRows()       + '/' + Limits.getLimitDmlRows());
        System.debug(label + ' · CPU ms '    + Limits.getCpuTime()       + '/' + Limits.getLimitCpuTime());

        if (Limits.getQueries() > Limits.getLimitQueries() * 0.8) {
            System.debug(LoggingLevel.WARN, label + ' · más del 80 % de las consultas gastadas');
        }
    }
}`,
      en: `public class LimitsReport {

    public static void log(String label) {
        System.debug(label + ' · SOQL '     + Limits.getQueries()       + '/' + Limits.getLimitQueries());
        System.debug(label + ' · DML '      + Limits.getDmlStatements() + '/' + Limits.getLimitDmlStatements());
        System.debug(label + ' · DML rows ' + Limits.getDmlRows()       + '/' + Limits.getLimitDmlRows());
        System.debug(label + ' · CPU ms '   + Limits.getCpuTime()       + '/' + Limits.getLimitCpuTime());

        if (Limits.getQueries() > Limits.getLimitQueries() * 0.8) {
            System.debug(LoggingLevel.WARN, label + ' · over 80% of queries spent');
        }
    }
}`,
    },
    checks: [
      {
        id: "m04-l04-c1",
        label: {
          es: "Clase LimitsReport con public static void log(String label)",
          en: "LimitsReport class with public static void log(String label)",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+class\\s+LimitsReport\\b" },
            { op: "match", pattern: "public\\s+static\\s+void\\s+log\\s*\\(\\s*String\\s+label\\s*\\)" },
          ],
        },
        onFail: {
          es: "Dentro de la clase: public static void log(String label) { ... }",
          en: "Inside the class: public static void log(String label) { ... }",
        },
      },
      {
        id: "m04-l04-c2",
        label: {
          es: "Muestra consultas e instrucciones DML con su máximo",
          en: "Shows queries and DML statements with their maximum",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Limits\\.getQueries\\(\\s*\\)" },
            { op: "match", pattern: "Limits\\.getLimitQueries\\(\\s*\\)" },
            { op: "match", pattern: "Limits\\.getDmlStatements\\(\\s*\\)" },
            { op: "match", pattern: "Limits\\.getLimitDmlStatements\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "Usa las parejas getQueries/getLimitQueries y getDmlStatements/getLimitDmlStatements.",
          en: "Use the pairs getQueries/getLimitQueries and getDmlStatements/getLimitDmlStatements.",
        },
      },
      {
        id: "m04-l04-c3",
        label: {
          es: "Muestra filas DML y CPU con su máximo",
          en: "Shows DML rows and CPU with their maximum",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Limits\\.getDmlRows\\(\\s*\\)" },
            { op: "match", pattern: "Limits\\.getLimitDmlRows\\(\\s*\\)" },
            { op: "match", pattern: "Limits\\.getCpuTime\\(\\s*\\)" },
            { op: "match", pattern: "Limits\\.getLimitCpuTime\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "Faltan getDmlRows/getLimitDmlRows o getCpuTime/getLimitCpuTime.",
          en: "getDmlRows/getLimitDmlRows or getCpuTime/getLimitCpuTime are missing.",
        },
      },
      {
        id: "m04-l04-c4",
        label: {
          es: "Avisa si las consultas pasan del 80 %",
          en: "Warns if queries go over 80%",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "if\\s*\\(\\s*Limits\\.getQueries\\(\\s*\\)\\s*>=?\\s*(Limits\\.getLimitQueries\\(\\s*\\)\\s*\\*\\s*0?\\.8|0?\\.8\\s*\\*\\s*Limits\\.getLimitQueries\\(\\s*\\)|80)" },
            { op: "match", pattern: "System\\.debug\\(\\s*LoggingLevel\\.WARN\\s*," },
          ],
        },
        onFail: {
          es: "if (Limits.getQueries() > Limits.getLimitQueries() * 0.8) { System.debug(LoggingLevel.WARN, ...); }",
          en: "if (Limits.getQueries() > Limits.getLimitQueries() * 0.8) { System.debug(LoggingLevel.WARN, ...); }",
        },
        onPass: {
          es: "Una herramienta que usarás en cada revisión: LimitsReport.log('antes') y LimitsReport.log('después') alrededor del bloque sospechoso.",
          en: "A tool you will use in every review: LimitsReport.log('before') and LimitsReport.log('after') around the suspicious block.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Por qué comparar con getLimitQueries() en lugar de escribir el número 100 directamente?",
        en: "Why compare with getLimitQueries() instead of writing the number 100 directly?",
      },
    ],
  },
};
