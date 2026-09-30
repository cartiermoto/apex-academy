import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, a prueba
// Tarea 4 de 7: probar la migración en Batch, que es asíncrona.

@isTest
private class RenewalMigrationBatchTest {
    @testSetup
    static void setup() {
        List<ERP_Renewal__c> rows = new List<ERP_Renewal__c>();
        for (Integer i = 0; i < 150; i++) {   // como mucho 200: en un test, el Batch hace una sola tanda
            rows.add(new ERP_Renewal__c(ERP_Code__c = 'ERP-' + i, Amount__c = 1000 + i, Processed__c = false));
        }
        insert rows;
    }

    @isTest
    static void processesEveryPendingRow() {
        Test.startTest();
        Database.executeBatch(new RenewalMigrationBatch(), 200);
        Test.stopTest();   // aquí el Batch ya se ha ejecutado entero

        Integer pending = [SELECT COUNT() FROM ERP_Renewal__c WHERE Processed__c = false];
        Assert.areEqual(0, pending, 'Después del Batch no puede quedar ninguna fila pendiente');
    }
}`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, a prueba\n// Tarea 4 de 7: probar la migración en Batch, que es asíncrona.",
  "// CASE: the ERP bridge, under test\n// Task 4 of 7: test the Batch migration, which is asynchronous.",
)
  .replace("// como mucho 200: en un test, el Batch hace una sola tanda", "// at most 200: in a test, the Batch runs a single chunk")
  .replace("// aquí el Batch ya se ha ejecutado entero", "// here the Batch has already run in full")
  .replace("'Después del Batch no puede quedar ninguna fila pendiente'", "'After the Batch no row can remain pending'");

export const l04StartTestStopTest: Lesson = {
  id: "m10-l04",
  slug: "starttest-stoptest",
  n: 4,
  kind: "lesson",
  minutes: 30,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 3", en: "Remember? · Review of lesson 3" },
    prompt: { es: "¿Qué falla en un test que termina con Assert.isTrue(true)?", en: "What is wrong with a test ending in Assert.isTrue(true)?" },
    options: [
      { es: "Pasa siempre: no comprueba nada", en: "It always passes: it checks nothing" },
      { es: "No compila", en: "It does not compile" },
      { es: "No da cobertura", en: "It gives no coverage" },
    ],
    answer: 0,
    explain: {
      es: "Cubre, pero no prueba. Hoy pruebas algo más difícil: código que no se ejecuta cuando lo llamas.",
      en: "It covers, but does not test. Today you test something harder: code that does not run when you call it.",
    },
  },
  title: { es: "Test.startTest y Test.stopTest", en: "Test.startTest and Test.stopTest" },
  summary: {
    es: "El código asíncrono se ejecuta más tarde, pero un test necesita el resultado ya. Test.stopTest() ejecuta en ese momento todo lo que se encoló desde Test.startTest(), y además da a esa parte un presupuesto de límites nuevo.",
    en: "Async code runs later, but a test needs the result now. Test.stopTest() runs at that moment everything enqueued since Test.startTest(), and also gives that part a fresh limits budget.",
  },
  analogy: {
    es: "Pulsar «Run Now» en un trabajo programado para ver el resultado sin esperar a la noche",
    en: "Clicking «Run Now» on a scheduled job to see the result without waiting for the night",
  },
  objectives: [
    { es: "Probar un Batch, un Queueable o un @future con startTest y stopTest.", en: "Test a Batch, a Queueable or an @future with startTest and stopTest." },
    { es: "Explicar qué pasa con los límites entre startTest y stopTest.", en: "Explain what happens to limits between startTest and stopTest." },
    { es: "Preparar los datos teniendo en cuenta que el Batch hace una sola tanda en un test.", en: "Prepare data knowing the Batch runs a single chunk in a test." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "La migración del Módulo 9 es un Batch. Si en un test llamas a Database.executeBatch y en la línea siguiente compruebas las filas, verás que no ha cambiado nada: el Batch está en la cola y el test ya ha terminado. Hace falta una forma de decir «ejecuta ahora lo encolado y espera».",
        en: "Module 9's migration is a Batch. If in a test you call Database.executeBatch and on the next line check the rows, you will see nothing has changed: the Batch is in the queue and the test has already finished. You need a way to say «run what is queued now and wait».",
      },
    },
    {
      type: "code",
      code: {
        es: `Test.startTest();
Database.executeBatch(new RenewalMigrationBatch(), 200);   // se encola…
Test.stopTest();                                          // …y aquí se ejecuta entero

Integer pending = [SELECT COUNT() FROM ERP_Renewal__c WHERE Processed__c = false];
Assert.areEqual(0, pending, 'Después del Batch no puede quedar ninguna fila pendiente');`,
        en: `Test.startTest();
Database.executeBatch(new RenewalMigrationBatch(), 200);   // it is enqueued…
Test.stopTest();                                          // …and here it runs in full

Integer pending = [SELECT COUNT() FROM ERP_Renewal__c WHERE Processed__c = false];
Assert.areEqual(0, pending, 'After the Batch no row can remain pending');`,
      },
    },
    {
      type: "list",
      items: [
        {
          es: "Todo lo asíncrono que se encola entre startTest y stopTest (@future, Queueable, Batch, Scheduled) se ejecuta al llegar a stopTest, antes de la línea siguiente.",
          en: "Everything async enqueued between startTest and stopTest (@future, Queueable, Batch, Scheduled) runs on reaching stopTest, before the next line.",
        },
        {
          es: "Lo que va entre las dos líneas recibe un presupuesto de límites nuevo: la preparación de datos no le gasta consultas a lo que pruebas.",
          en: "What goes between the two lines gets a fresh limits budget: data preparation does not use up queries of what you test.",
        },
        {
          es: "Cada test puede llamar a startTest y stopTest una sola vez.",
          en: "Each test can call startTest and stopTest only once.",
        },
      ],
    },
    {
      type: "diagram",
      id: "m10-stoptest",
      caption: {
        es: "Ejecuta el test con y sin startTest y stopTest, y mira cuándo corre el Batch y qué ve el Assert.",
        en: "Run the test with and without startTest and stopTest, and see when the Batch runs and what the Assert sees.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "En un test, el Batch hace una sola tanda", en: "In a test, the Batch runs a single chunk" },
      text: {
        es: "Dentro de un test, un Batch solo ejecuta su execute una vez. Si el setup crea 300 filas y la tanda es de 200, se procesan 200 y el Assert de «ninguna pendiente» falla sin que el código tenga la culpa. Crea como mucho tantas filas como el tamaño de tanda.",
        en: "Inside a test, a Batch only runs its execute once. If the setup creates 300 rows and the chunk is 200, 200 are processed and the «none pending» Assert fails through no fault of the code. Create at most as many rows as the chunk size.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El «Run Now» del trabajo programado", en: "The scheduled job's «Run Now»" },
      text: {
        es: "Cuando yo quería probar un flow programado sin esperar a la noche, lo depuraba a mano con un registro concreto. stopTest es eso para Apex: no esperas a que Salesforce encuentre hueco en la cola, lo fuerzas en ese momento y miras el resultado.",
        en: "When I wanted to test a scheduled flow without waiting for the night, I debugged it by hand with a specific record. stopTest is that for Apex: you do not wait for Salesforce to find room in the queue, you force it right then and look at the result.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque sus tests no prueban lo asíncrono", en: "Why not a Flow? Because its tests do not test async" },
      text: {
        es: "Los tests de Flow no admiten los caminos asíncronos: si tu flow avisa al ERP en su camino «Run Asynchronously», esa parte se queda sin probar. En Apex, startTest y stopTest cubren todo el asíncrono del Módulo 9, desde un @future hasta un Batch programado.",
        en: "Flow tests do not support async paths: if your flow notifies the ERP on its «Run Asynchronously» path, that part is left untested. In Apex, startTest and stopTest cover all of Module 9's async, from an @future to a scheduled Batch.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿cuándo se ejecuta un Batch encolado entre startTest y stopTest? ¿Por qué el setup crea como mucho 200 filas? ¿Dónde va el Assert?",
        en: "Without looking: when does a Batch enqueued between startTest and stopTest run? Why does the setup create at most 200 rows? Where does the Assert go?",
      },
    },
  ],

  quiz: [
    {
      id: "m10-l04-q1",
      kind: "single",
      prompt: { es: "¿Qué ve el Assert de este test?", en: "What does this test's Assert see?" },
      code: {
        es: `Database.executeBatch(new RenewalMigrationBatch(), 200);
Integer pending = [SELECT COUNT() FROM ERP_Renewal__c WHERE Processed__c = false];
Assert.areEqual(0, pending);`,
        en: `Database.executeBatch(new RenewalMigrationBatch(), 200);
Integer pending = [SELECT COUNT() FROM ERP_Renewal__c WHERE Processed__c = false];
Assert.areEqual(0, pending);`,
      },
      options: [
        { es: "Las filas sin procesar: el Batch aún no se ha ejecutado, y el test falla", en: "The unprocessed rows: the Batch has not run yet, and the test fails" },
        { es: "0, porque el Batch se ejecuta al instante", en: "0, because the Batch runs instantly" },
        { es: "No compila", en: "It does not compile" },
        { es: "Un error de límites", en: "A limits error" },
      ],
      answer: 0,
      explain: {
        es: "Sin startTest y stopTest, el Batch se queda en la cola hasta después del test.",
        en: "Without startTest and stopTest, the Batch stays in the queue until after the test.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m10-l04-q2",
      kind: "single",
      prompt: {
        es: "El setup crea 250 filas y el test lanza el Batch con tanda de 200. ¿Qué pasa?",
        en: "The setup creates 250 rows and the test launches the Batch with a chunk of 200. What happens?",
      },
      options: [
        { es: "Se procesan 200 y el Assert de «ninguna pendiente» falla", en: "200 are processed and the «none pending» Assert fails" },
        { es: "Se procesan las 250 en dos tandas", en: "All 250 are processed in two chunks" },
        { es: "El test no compila", en: "The test does not compile" },
        { es: "Se procesan 50", en: "50 are processed" },
      ],
      answer: 0,
      explain: {
        es: "En un test, un Batch ejecuta execute una sola vez. Crea como mucho tantas filas como la tanda.",
        en: "In a test, a Batch runs execute only once. Create at most as many rows as the chunk.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m10-l04-q3",
      kind: "multi",
      prompt: { es: "¿Qué hace Test.startTest() … Test.stopTest()?", en: "What does Test.startTest() … Test.stopTest() do?" },
      options: [
        { es: "Ejecuta al llegar a stopTest lo asíncrono encolado entre las dos", en: "Runs on reaching stopTest the async enqueued between the two" },
        { es: "Da a esa parte un presupuesto de límites nuevo", en: "Gives that part a fresh limits budget" },
        { es: "Se puede usar una sola vez por test", en: "Can be used only once per test" },
        { es: "Hace que el test vea los datos de la org", en: "Makes the test see the org's data" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Ver los datos de la org sería SeeAllData, y ya viste por qué evitarlo.",
        en: "Seeing the org's data would be SeeAllData, and you already saw why to avoid it.",
      },
    },
    {
      id: "m10-l04-q4",
      kind: "text",
      prompt: {
        es: "Escribe la línea que, en un test, hace que se ejecute lo asíncrono encolado.",
        en: "Write the line that, in a test, makes the enqueued async run.",
      },
      accept: ["test\\.stoptest\\(\\s*\\)\\s*;?"],
      placeholder: { es: "Test.…", en: "Test.…" },
      explain: { es: "Test.stopTest(); cierra lo que abrió Test.startTest();", en: "Test.stopTest(); closes what Test.startTest(); opened" },
      tags: ["recall"],
    },
    {
      id: "m10-l04-q5",
      kind: "single",
      prompt: { es: "¿Dónde va el Assert que comprueba el resultado del Batch?", en: "Where does the Assert checking the Batch's result go?" },
      options: [
        { es: "Después de Test.stopTest()", en: "After Test.stopTest()" },
        { es: "Entre startTest y stopTest", en: "Between startTest and stopTest" },
        { es: "Antes de startTest", en: "Before startTest" },
        { es: "En el setup", en: "In the setup" },
      ],
      answer: 0,
      explain: {
        es: "Hasta stopTest el Batch no se ha ejecutado; el resultado solo existe después.",
        en: "Until stopTest the Batch has not run; the result only exists afterwards.",
      },
    },
    {
      id: "m10-l04-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿cuántas veces se ejecuta el execute de un Batch con 1.000 registros y tanda de 200, fuera de un test?",
        en: "Review: how many times does a Batch's execute run with 1,000 records and a chunk of 200, outside a test?",
      },
      options: [
        { es: "5", en: "5" },
        { es: "1", en: "1" },
        { es: "200", en: "200" },
        { es: "1.000", en: "1,000" },
      ],
      answer: 0,
      explain: {
        es: "Fuera de un test, una vez por tanda. Dentro de un test, solo una: por eso los datos del test son pocos.",
        en: "Outside a test, once per chunk. Inside a test, just once: that is why test data is small.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M9 L4", en: "Review · M9 L4" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 4 DE 7 · La migración en Batch no tiene test. Escribe uno que prepare 150 filas pendientes de ERP_Renewal__c, lance el Batch y compruebe que no queda ninguna pendiente.",
      en: "TASK 4 OF 7 · The Batch migration has no test. Write one that prepares 150 pending ERP_Renewal__c rows, launches the Batch and checks none remain pending.",
    },
    brief: [
      {
        es: "@testSetup: 150 filas de ERP_Renewal__c con Processed__c = false, creadas en un bucle y guardadas con un solo insert.",
        en: "@testSetup: 150 ERP_Renewal__c rows with Processed__c = false, created in a loop and saved with a single insert.",
      },
      {
        es: "@isTest static void processesEveryPendingRow(): Test.startTest(); Database.executeBatch(new RenewalMigrationBatch(), 200); Test.stopTest();",
        en: "@isTest static void processesEveryPendingRow(): Test.startTest(); Database.executeBatch(new RenewalMigrationBatch(), 200); Test.stopTest();",
      },
      {
        es: "Después de stopTest: cuenta las filas con Processed__c = false y comprueba con Assert.areEqual que son 0, con mensaje.",
        en: "After stopTest: count the rows with Processed__c = false and check with Assert.areEqual that they are 0, with a message.",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, a prueba
// Ya resuelto (tareas 1-3): parseAmount, el guardián y AsyncContext, con asserts de verdad.
// Tarea 4 de 7: probar la migración en Batch, que es asíncrona.

@isTest
private class RenewalMigrationBatchTest {
    @isTest
    static void processesEveryPendingRow() {
        Database.executeBatch(new RenewalMigrationBatch(), 200);
    }
}
`,
      en: `// CASE: the ERP bridge, under test
// Already solved (tasks 1-3): parseAmount, the guard and AsyncContext, with real asserts.
// Task 4 of 7: test the Batch migration, which is asynchronous.

@isTest
private class RenewalMigrationBatchTest {
    @isTest
    static void processesEveryPendingRow() {
        Database.executeBatch(new RenewalMigrationBatch(), 200);
    }
}
`,
    },
    hints: [
      {
        es: "Yo lo pensaría en tres momentos: preparar las filas pendientes, lanzar el Batch obligándolo a terminar, y mirar cómo quedaron.",
        en: "I would think of it in three moments: prepare the pending rows, launch the Batch forcing it to finish, and look at how they ended up.",
      },
      {
        es: "Lo que me ayudó: executeBatch va entre Test.startTest() y Test.stopTest(), y el Assert después. Y 150 filas caben en una sola tanda de 200, que es lo único que un Batch ejecuta en un test.",
        en: "What helped me: executeBatch goes between Test.startTest() and Test.stopTest(), and the Assert afterwards. And 150 rows fit in a single chunk of 200, which is all a Batch runs in a test.",
      },
      {
        es: "Te dejo el esquema: @testSetup static void setup() { List<ERP_Renewal__c> rows = …; for (Integer i = 0; i < 150; i++) { rows.add(new ERP_Renewal__c(… Processed__c = false)); } insert rows; } · Test.startTest(); Database.executeBatch(…, 200); Test.stopTest(); Integer pending = [SELECT COUNT() FROM ERP_Renewal__c WHERE Processed__c = false]; Assert.areEqual(0, pending, '…');",
        en: "Here is the outline: @testSetup static void setup() { List<ERP_Renewal__c> rows = …; for (Integer i = 0; i < 150; i++) { rows.add(new ERP_Renewal__c(… Processed__c = false)); } insert rows; } · Test.startTest(); Database.executeBatch(…, 200); Test.stopTest(); Integer pending = [SELECT COUNT() FROM ERP_Renewal__c WHERE Processed__c = false]; Assert.areEqual(0, pending, '…');",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m10-l04-c1",
        label: { es: "El setup crea como mucho 200 filas pendientes", en: "The setup creates at most 200 pending rows" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "@testSetup\\s+(private\\s+|public\\s+)?static\\s+void\\s+\\w+\\s*\\(\\s*\\)" },
            { op: "match", pattern: "for\\s*\\(\\s*Integer\\s+\\w+\\s*=\\s*0\\s*;\\s*\\w+\\s*<\\s*(200|1\\d\\d|\\d{1,2})\\s*;" },
            { op: "match", pattern: "new\\s+ERP_Renewal__c\\s*\\([^)]*Processed__c\\s*=\\s*false" },
            { op: "absent", pattern: "for\\s*\\([^)]*\\)\\s*\\{[^{}]*\\binsert\\b" },
          ],
        },
        onFail: {
          es: "@testSetup con un for de 150 vueltas que añade new ERP_Renewal__c(… Processed__c = false) a una lista, y un solo insert después del bucle.",
          en: "@testSetup with a 150-pass for that adds new ERP_Renewal__c(… Processed__c = false) to a list, and a single insert after the loop.",
        },
        otter: {
          es: "Las filas pendientes las fabricas tú: un for de 150 vueltas, cada una un new ERP_Renewal__c con Processed__c = false, y un solo insert al final. 150 caben en la única tanda que un Batch ejecuta en un test.",
          en: "You build the pending rows yourself: a 150-pass for, each a new ERP_Renewal__c with Processed__c = false, and a single insert at the end. 150 fit in the single chunk a Batch runs in a test.",
        },
      },
      {
        id: "m10-l04-c2",
        label: { es: "El Batch se lanza entre startTest y stopTest", en: "The Batch is launched between startTest and stopTest" },
        rule: {
          op: "match",
          pattern: "Test\\s*\\.\\s*startTest\\s*\\(\\s*\\)\\s*;[\\s\\S]*Database\\s*\\.\\s*executeBatch\\s*\\(\\s*new\\s+RenewalMigrationBatch\\s*\\(\\s*\\)[^;]*;[\\s\\S]*Test\\s*\\.\\s*stopTest\\s*\\(\\s*\\)\\s*;",
        },
        onFail: {
          es: "Test.startTest(); Database.executeBatch(new RenewalMigrationBatch(), 200); Test.stopTest();",
          en: "Test.startTest(); Database.executeBatch(new RenewalMigrationBatch(), 200); Test.stopTest();",
        },
        otter: {
          es: "Es tu «Run Now»: executeBatch entre Test.startTest() y Test.stopTest(). Al llegar a stopTest, el Batch se ejecuta entero antes de seguir.",
          en: "It is your «Run Now»: executeBatch between Test.startTest() and Test.stopTest(). On reaching stopTest, the Batch runs in full before moving on.",
        },
      },
      {
        id: "m10-l04-c3",
        label: { es: "Después de stopTest, no queda ninguna pendiente", en: "After stopTest, none remain pending" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Test\\s*\\.\\s*stopTest\\s*\\(\\s*\\)\\s*;[\\s\\S]*SELECT\\s+COUNT\\s*\\(\\s*\\)\\s+FROM\\s+ERP_Renewal__c\\s+WHERE\\s+Processed__c\\s*=\\s*false" },
            { op: "match", pattern: "Test\\s*\\.\\s*stopTest\\s*\\(\\s*\\)\\s*;[\\s\\S]*Assert\\s*\\.\\s*areEqual\\s*\\(\\s*0\\s*,\\s*\\w+\\s*,\\s*'[^']+'\\s*\\)" },
          ],
        },
        onFail: {
          es: "Después de stopTest: Integer pending = [SELECT COUNT() FROM ERP_Renewal__c WHERE Processed__c = false]; Assert.areEqual(0, pending, '…');",
          en: "After stopTest: Integer pending = [SELECT COUNT() FROM ERP_Renewal__c WHERE Processed__c = false]; Assert.areEqual(0, pending, '…');",
        },
        otter: {
          es: "El resultado solo existe después de stopTest: cuenta las pendientes con SELECT COUNT() … WHERE Processed__c = false y comprueba con Assert.areEqual(0, pending, '…').",
          en: "The result only exists after stopTest: count the pending ones with SELECT COUNT() … WHERE Processed__c = false and check with Assert.areEqual(0, pending, '…').",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué caso añadirías para comprobar que el Batch no toca filas que ya estaban procesadas?",
        en: "Which case would you add to check the Batch does not touch rows that were already processed?",
      },
    ],
    voice: "otter",
    outro: {
      es: "Ya pruebas lo asíncrono sin esperar a la noche. Pero todos tus casos son el camino feliz. En la tarea 5 pruebas lo que tiene que fallar: importes vacíos, textos raros y la segunda renovación que el guardián debe rechazar.",
      en: "You now test async without waiting for the night. But all your cases are the happy path. In task 5 you test what has to fail: empty amounts, odd text and the second renewal the guard must reject.",
    },
  },
};
