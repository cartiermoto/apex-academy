import type { Lesson } from "@/lib/types";

const BATCH_TOP = `public class ErpNightlySyncBatch implements Database.Batchable<sObject>, Database.Stateful, Database.AllowsCallouts {
    private Integer synced = 0;
    private Integer failed = 0;

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator(
            'SELECT Id, Name, Amount, Account.ERP_Code__c FROM Opportunity ' +
            'WHERE Type = \\'Renewal\\' AND ERP_Synced__c = false'
        );
    }

    public void execute(Database.BatchableContext bc, List<Opportunity> scope) {
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:ERP/renewals');
        req.setMethod('POST');
        req.setBody(JSON.serialize(scope));`;

const BATCH_BOTTOM = `
        for (Opportunity o : scope) {
            o.ERP_Synced__c = true;
        }
        for (Database.SaveResult sr : Database.update(scope, false)) {
            if (sr.isSuccess()) {
                synced++;
            } else {
                failed++;
            }
        }
    }

    public void finish(Database.BatchableContext bc) {
        System.enqueueJob(new ErpNightlyReport(synced, failed));
    }
}`;

const SOLUTION_ES = `// CASO: el puente con el ERP, a prueba
// Tarea 7 de 7 · La entrega: la sincronización nocturna, probada… y corregida.

// 1. El Batch del Módulo 9, con el fallo que destapó el test
${BATCH_TOP}
        HttpResponse res = http.send(req);
        if (res.getStatusCode() != 200) {
            failed += scope.size();
            return;   // no se marca nada: siguen pendientes para mañana
        }
${BATCH_BOTTOM}

// 2. Los tests
@isTest
private class ErpNightlySyncBatchTest {
    private class ErpOkMock implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            return res;
        }
    }

    private class ErpErrorMock implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(500);
            return res;
        }
    }

    @testSetup
    static void setup() {
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < 100; i++) {
            accounts.add(new Account(Name = 'Cliente ' + i));
        }
        insert accounts;

        List<Opportunity> renewals = new List<Opportunity>();
        for (Account a : accounts) {   // una por cuenta: el guardián no deja dos abiertas
            renewals.add(new Opportunity(
                Name = a.Name + ' · Renovación', AccountId = a.Id, Type = 'Renewal',
                StageName = 'Prospecting', CloseDate = Date.today().addDays(30), Amount = 1000
            ));
        }
        insert renewals;
    }

    @isTest
    static void syncsEveryPendingRenewal() {
        Test.setMock(HttpCalloutMock.class, new ErpOkMock());
        Test.startTest();
        Database.executeBatch(new ErpNightlySyncBatch(), 100);
        Test.stopTest();
        Integer pending = [SELECT COUNT() FROM Opportunity WHERE ERP_Synced__c = false];
        Assert.areEqual(0, pending, 'Con el ERP respondiendo, no puede quedar ninguna pendiente');
    }

    @isTest
    static void keepsThemPendingWhenTheErpFails() {
        Test.setMock(HttpCalloutMock.class, new ErpErrorMock());
        Test.startTest();
        Database.executeBatch(new ErpNightlySyncBatch(), 100);
        Test.stopTest();
        Integer pending = [SELECT COUNT() FROM Opportunity WHERE ERP_Synced__c = false];
        Assert.areEqual(100, pending, 'Si el ERP falla, las renovaciones tienen que seguir pendientes');
    }
}`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, a prueba\n// Tarea 7 de 7 · La entrega: la sincronización nocturna, probada… y corregida.",
  "// CASE: the ERP bridge, under test\n// Task 7 of 7 · The delivery: the nightly sync, tested… and fixed.",
)
  .replace("// 1. El Batch del Módulo 9, con el fallo que destapó el test", "// 1. Module 9's Batch, with the bug the test exposed")
  .replace("// no se marca nada: siguen pendientes para mañana", "// nothing is marked: they stay pending for tomorrow")
  .replace("// 2. Los tests", "// 2. The tests")
  .replace("'Cliente ' + i", "'Customer ' + i")
  .replace("// una por cuenta: el guardián no deja dos abiertas", "// one per account: the guard allows no two open ones")
  .replace("' · Renovación'", "' · Renewal'")
  .replace("'Con el ERP respondiendo, no puede quedar ninguna pendiente'", "'With the ERP answering, none can remain pending'")
  .replace("'Si el ERP falla, las renovaciones tienen que seguir pendientes'", "'If the ERP fails, the renewals must stay pending'");

export const l07Checkpoint: Lesson = {
  id: "m10-l07",
  slug: "checkpoint",
  n: 7,
  kind: "checkpoint",
  minutes: 50,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 6", en: "Remember? · Review of lesson 6" },
    prompt: { es: "¿Dónde va Test.setMock dentro de un test?", en: "Where does Test.setMock go inside a test?" },
    options: [
      { es: "En la primera línea, antes de preparar datos", en: "On the first line, before preparing data" },
      { es: "Después de Test.stopTest()", en: "After Test.stopTest()" },
      { es: "Dentro del mock", en: "Inside the mock" },
    ],
    answer: 0,
    explain: {
      es: "Antes de todo. Hoy lo usas dos veces: un ERP que responde bien y otro que falla.",
      en: "Before everything. Today you use it twice: an ERP answering fine and one that fails.",
    },
  },
  title: { es: "Checkpoint del Módulo 10", en: "Module 10 checkpoint" },
  summary: {
    es: "La entrega: los tests de la sincronización nocturna. Datos propios, dos mocks, startTest y stopTest, y asserts que comprueban el caso bueno y el malo. Y un premio: el test destapa un fallo real del Módulo 9.",
    en: "The delivery: the nightly sync's tests. Own data, two mocks, startTest and stopTest, and asserts checking the good case and the bad. And a prize: the test exposes a real bug from Module 9.",
  },
  analogy: {
    es: "Una UAT completa, con el caso feliz y el caso de error, que se repite sola en cada despliegue",
    en: "A full UAT, with the happy case and the error case, repeating itself on every deployment",
  },
  objectives: [
    { es: "Combinar @testSetup, mocks, startTest/stopTest y Assert en un mismo test.", en: "Combine @testSetup, mocks, startTest/stopTest and Assert in one test." },
    { es: "Probar el camino feliz y el de error de un proceso asíncrono con callouts.", en: "Test the happy and error paths of an async process with callouts." },
    { es: "Usar un test que falla para encontrar y corregir un fallo.", en: "Use a failing test to find and fix a bug." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Solo falta la pieza más grande: el Batch nocturno que envía las renovaciones al ERP. Al escribir su test del caso malo (el ERP responde 500), el test sale en rojo: el Batch marca las renovaciones como enviadas aunque el ERP haya dicho que no. Es el fallo que la rúbrica de la tarea 6 insinuaba, y lo ha encontrado un test antes que un cliente.",
        en: "Only the biggest piece is left: the nightly Batch sending the renewals to the ERP. When you write its bad-case test (the ERP answers 500), the test comes out red: the Batch marks the renewals as sent even though the ERP said no. It is the bug task 6's rubric hinted at, and a test found it before a customer did.",
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
        [{ es: "@testSetup", en: "@testSetup" }, { es: "100 cuentas con una renovación pendiente cada una.", en: "100 accounts with one pending renewal each." }, { es: "2", en: "2" }],
        [{ es: "Dos HttpCalloutMock", en: "Two HttpCalloutMock" }, { es: "Un ERP que responde 200 y otro que responde 500.", en: "An ERP answering 200 and one answering 500." }, { es: "6", en: "6" }],
        [{ es: "startTest / stopTest", en: "startTest / stopTest" }, { es: "El Batch se ejecuta entero antes de comprobar.", en: "The Batch runs in full before checking." }, { es: "4", en: "4" }],
        [{ es: "Assert con mensaje", en: "Assert with a message" }, { es: "0 pendientes en el caso bueno, 100 en el malo.", en: "0 pending in the good case, 100 in the bad one." }, { es: "3 y 5", en: "3 and 5" }],
      ],
    },
    {
      type: "diagram",
      id: "m10-cp-suite",
      caption: {
        es: "Pasa la batería de tests del puente con el Batch original y con el corregido, y mira cuál sale en rojo y por qué.",
        en: "Run the bridge's test suite with the original Batch and the fixed one, and see which comes out red and why.",
      },
    },
    {
      type: "p",
      text: {
        es: "Dos detalles del setup. Son 100 renovaciones porque en un test el Batch hace una sola tanda, y la tanda es de 100. Y cada una va en su propia cuenta porque el guardián del Módulo 8 no deja dos renovaciones abiertas en la misma. Desde que existe la sincronización nocturna, el equipo quitó del handler el aviso inmediato al ERP, así que insertar renovaciones ya no encola ningún callout.",
        en: "Two setup details. There are 100 renewals because in a test the Batch runs a single chunk, and the chunk is 100. And each goes on its own account because Module 8's guard allows no two open renewals on the same one. Since the nightly sync exists, the team removed the immediate ERP notice from the handler, so inserting renewals no longer enqueues any callout.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque esta prueba no existe en Flow", en: "Why not a Flow? Because this test does not exist in Flow" },
      text: {
        es: "Un proceso nocturno que recorre 100 cuentas con sus renovaciones y llama a otro sistema no se puede probar con los tests de Flow: no cubren caminos asíncronos, no trabajan con padres ni hijos y no fingen respuestas externas. En Apex, esta batería entera corre en cada despliegue, y si alguien vuelve a quitar la comprobación del 500, el despliegue se para.",
        en: "A nightly process walking 100 accounts with their renewals and calling another system cannot be tested with Flow tests: they do not cover async paths, do not work with parents or children and do not fake external answers. In Apex, this whole suite runs on every deployment, and if someone removes the 500 check again, the deployment stops.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "Lo que viene: el Módulo 11", en: "What comes next: Module 11" },
    },
    {
      type: "p",
      text: {
        es: "Llevas tres módulos llamando al ERP con un código que te dimos hecho. En el Módulo 11 lo abres: cómo se monta una petición HTTP, cómo se lee el JSON de la respuesta, qué es una Named Credential y cómo expones tu propio Apex para que otros sistemas te llamen a ti.",
        en: "You have spent three modules calling the ERP with code we handed you. In Module 11 you open it up: how an HTTP request is built, how the response's JSON is read, what a Named Credential is and how you expose your own Apex so other systems can call you.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes del quiz", en: "Before the quiz" },
      text: {
        es: "Sin mirar: ¿por qué el setup crea exactamente 100 renovaciones? ¿Qué comprueba cada uno de los dos tests? ¿Qué fallo del Batch destapa el test del 500?",
        en: "Without looking: why does the setup create exactly 100 renewals? What does each of the two tests check? Which Batch bug does the 500 test expose?",
      },
    },
  ],

  quiz: [
    {
      id: "m10-cp-q1",
      kind: "single",
      prompt: {
        es: "Con el Batch original, el ERP responde 500. ¿Qué quedaba en ERP_Synced__c?",
        en: "With the original Batch, the ERP answers 500. What was left in ERP_Synced__c?",
      },
      options: [
        { es: "true: las marcaba como enviadas sin mirar la respuesta", en: "true: it marked them as sent without looking at the response" },
        { es: "false: el 500 lanzaba una excepción", en: "false: the 500 threw an exception" },
        { es: "null", en: "null" },
        { es: "Depende del mock", en: "It depends on the mock" },
      ],
      answer: 0,
      explain: {
        es: "Un 500 no es una excepción: http.send devuelve la respuesta y el código sigue. Hay que mirar getStatusCode().",
        en: "A 500 is not an exception: http.send returns the response and the code goes on. You have to check getStatusCode().",
      },
      tags: ["predict-output"],
    },
    {
      id: "m10-cp-q2",
      kind: "single",
      prompt: { es: "¿Por qué el setup crea 100 renovaciones y no 300?", en: "Why does the setup create 100 renewals and not 300?" },
      options: [
        { es: "Porque en un test el Batch hace una sola tanda, y la tanda es de 100", en: "Because in a test the Batch runs a single chunk, and the chunk is 100" },
        { es: "Porque un test no puede insertar más de 100 registros", en: "Because a test cannot insert more than 100 records" },
        { es: "Por el límite de 100 consultas", en: "Because of the 100-query limit" },
        { es: "Da igual el número", en: "The number does not matter" },
      ],
      answer: 0,
      explain: {
        es: "Con 300, el Batch procesaría 100 y el assert de «0 pendientes» fallaría sin que el código tuviera la culpa.",
        en: "With 300, the Batch would process 100 and the «0 pending» assert would fail through no fault of the code.",
      },
    },
    {
      id: "m10-cp-q3",
      kind: "single",
      prompt: {
        es: "¿Por qué cada renovación del setup va en una cuenta distinta?",
        en: "Why does each setup renewal go on a different account?",
      },
      options: [
        { es: "Porque el guardián del Módulo 8 no deja dos renovaciones abiertas en la misma cuenta", en: "Because Module 8's guard allows no two open renewals on the same account" },
        { es: "Porque el Batch lo exige", en: "Because the Batch requires it" },
        { es: "Por el límite de filas", en: "Because of the row limit" },
        { es: "Por estilo", en: "For style" },
      ],
      answer: 0,
      explain: {
        es: "Los tests pasan por todos los triggers, igual que Data Loader. Un buen setup respeta las reglas de la org.",
        en: "Tests go through every trigger, just like Data Loader. A good setup respects the org's rules.",
      },
    },
    {
      id: "m10-cp-q4",
      kind: "multi",
      prompt: { es: "¿Qué hace falta en el test del caso malo?", en: "What is needed in the bad-case test?" },
      options: [
        { es: "Un mock que responda con un código de error", en: "A mock answering with an error code" },
        { es: "Registrarlo con Test.setMock antes de lanzar el Batch", en: "Registering it with Test.setMock before launching the Batch" },
        { es: "Un Assert que espere 100 pendientes después de stopTest", en: "An Assert expecting 100 pending after stopTest" },
        { es: "@isTest(SeeAllData=true)", en: "@isTest(SeeAllData=true)" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Los datos los prepara el setup; SeeAllData no pinta nada aquí.",
        en: "The setup prepares the data; SeeAllData has no place here.",
      },
    },
    {
      id: "m10-cp-q5",
      kind: "text",
      prompt: {
        es: "Escribe la condición del if que detecta que el ERP no respondió bien, usando la variable res.",
        en: "Write the if condition that detects the ERP did not answer well, using the res variable.",
      },
      accept: ["res\\.getstatuscode\\(\\s*\\)\\s*!=\\s*200", "\\(?\\s*res\\.getstatuscode\\(\\s*\\)\\s*!=\\s*200\\s*\\)?"],
      placeholder: { es: "res.…", en: "res.…" },
      explain: { es: "res.getStatusCode() != 200", en: "res.getStatusCode() != 200" },
      tags: ["recall"],
    },
    {
      id: "m10-cp-q6",
      kind: "single",
      prompt: {
        es: "Diccionario Admin → Apex: ¿qué equivale a repetir tu UAT en cada despliegue sin hacerla a mano?",
        en: "Admin → Apex dictionary: what matches repeating your UAT on every deployment without doing it by hand?",
      },
      options: [
        { es: "Las clases de test, que Salesforce ejecuta al desplegar", en: "Test classes, which Salesforce runs on deployment" },
        { es: "La cobertura", en: "Coverage" },
        { es: "Un Batch nocturno", en: "A nightly Batch" },
        { es: "Un change set", en: "A change set" },
      ],
      answer: 0,
      explain: {
        es: "La cobertura es solo el porcentaje de líneas; lo que repite tu UAT son los tests con sus asserts.",
        en: "Coverage is only the percentage of lines; what repeats your UAT is the tests with their asserts.",
      },
    },
    {
      id: "m10-cp-q7",
      kind: "single",
      prompt: {
        es: "Repaso: si una tanda del Batch lanza una excepción sin capturar, ¿qué pasa con las demás?",
        en: "Review: if one Batch chunk throws an uncaught exception, what happens to the others?",
      },
      options: [
        { es: "Siguen: solo se deshace esa tanda", en: "They go on: only that chunk is rolled back" },
        { es: "Se deshace todo el Batch", en: "The whole Batch is rolled back" },
        { es: "Se detiene el Batch", en: "The Batch stops" },
        { es: "Se repite la tanda", en: "The chunk is retried" },
      ],
      answer: 0,
      explain: {
        es: "Cada tanda es su transacción. Por eso el return con el 500 es más limpio: la tanda termina sin excepción y cuenta sus fallos.",
        en: "Each chunk is its own transaction. That is why the return on a 500 is cleaner: the chunk ends without an exception and counts its failures.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M9 L4", en: "Review · M9 L4" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 7 DE 7 · La entrega. Escribe los tests de la sincronización nocturna: 100 renovaciones pendientes, un ERP que responde 200 y otro que responde 500. El del 500 saldrá en rojo, porque el Batch marca como enviadas las renovaciones aunque el ERP falle: corrígelo para que, si la respuesta no es 200, cuente la tanda como fallida y no marque nada.",
      en: "TASK 7 OF 7 · The delivery. Write the nightly sync's tests: 100 pending renewals, an ERP answering 200 and one answering 500. The 500 one will come out red, because the Batch marks the renewals as sent even when the ERP fails: fix it so that, if the response is not 200, it counts the chunk as failed and marks nothing.",
    },
    brief: [
      {
        es: "En el Batch: guarda la respuesta (HttpResponse res = http.send(req);) y, si res.getStatusCode() != 200, suma scope.size() a failed y haz return antes de marcar nada.",
        en: "In the Batch: store the response (HttpResponse res = http.send(req);) and, if res.getStatusCode() != 200, add scope.size() to failed and return before marking anything.",
      },
      {
        es: "En ErpNightlySyncBatchTest: dos mocks, uno con 200 y otro con 500.",
        en: "In ErpNightlySyncBatchTest: two mocks, one with 200 and one with 500.",
      },
      {
        es: "@testSetup: 100 cuentas y una renovación pendiente por cuenta, cada grupo con un solo insert.",
        en: "@testSetup: 100 accounts and one pending renewal per account, each group with a single insert.",
      },
      {
        es: "Dos tests: con el mock de 200 esperan 0 pendientes; con el de 500, 100. Cada uno registra su mock, lanza el Batch con tanda 100 entre startTest y stopTest, y comprueba con Assert.areEqual.",
        en: "Two tests: with the 200 mock they expect 0 pending; with the 500 one, 100. Each registers its mock, launches the Batch with chunk 100 between startTest and stopTest, and checks with Assert.areEqual.",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, a prueba
// Ya resuelto (tareas 1-6): todas las piezas del puente tienen tests, menos la más grande.
// Tarea 7 de 7 · La entrega: la sincronización nocturna, probada… y corregida.

// 1. El Batch del Módulo 9, tal como está
${BATCH_TOP}
        http.send(req);
${BATCH_BOTTOM}

// 2. Tus tests:
`,
      en: `// CASE: the ERP bridge, under test
// Already solved (tasks 1-6): every piece of the bridge has tests, except the biggest.
// Task 7 of 7 · The delivery: the nightly sync, tested… and fixed.

// 1. Module 9's Batch, as it stands
${BATCH_TOP}
        http.send(req);
${BATCH_BOTTOM}

// 2. Your tests:
`,
    },
    hints: [
      {
        es: "Yo empezaría por los tests, como una UAT: ¿qué debería pasar si el ERP dice que sí? ¿Y si dice que no? Cuando el segundo salga en rojo, el propio test te dirá qué línea del Batch cambiar.",
        en: "I would start with the tests, like a UAT: what should happen if the ERP says yes? And if it says no? When the second comes out red, the test itself will tell you which Batch line to change.",
      },
      {
        es: "Lo que me ayudó: un 500 no es una excepción, así que http.send devuelve la respuesta y el código sigue como si nada. Hay que guardarla y mirar getStatusCode(). Y en el setup, una renovación por cuenta, o el guardián las rechazará.",
        en: "What helped me: a 500 is not an exception, so http.send returns the response and the code carries on as if nothing happened. You have to store it and check getStatusCode(). And in the setup, one renewal per account, or the guard will reject them.",
      },
      {
        es: "Te dejo el esquema: HttpResponse res = http.send(req); if (res.getStatusCode() != 200) { failed += scope.size(); return; } · dos clases private …Mock implements HttpCalloutMock con setStatusCode(200) y setStatusCode(500) · @testSetup con 100 cuentas y 100 renovaciones · en cada test: Test.setMock(…); Test.startTest(); Database.executeBatch(new ErpNightlySyncBatch(), 100); Test.stopTest(); Assert.areEqual(0 o 100, [SELECT COUNT() … WHERE ERP_Synced__c = false], '…');",
        en: "Here is the outline: HttpResponse res = http.send(req); if (res.getStatusCode() != 200) { failed += scope.size(); return; } · two private …Mock classes implementing HttpCalloutMock with setStatusCode(200) and setStatusCode(500) · @testSetup with 100 accounts and 100 renewals · in each test: Test.setMock(…); Test.startTest(); Database.executeBatch(new ErpNightlySyncBatch(), 100); Test.stopTest(); Assert.areEqual(0 or 100, [SELECT COUNT() … WHERE ERP_Synced__c = false], '…');",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m10-cp-c1",
        label: { es: "El Batch no marca nada si el ERP falla", en: "The Batch marks nothing if the ERP fails" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "HttpResponse\\s+\\w+\\s*=\\s*\\w+\\s*\\.\\s*send\\s*\\(" },
            { op: "match", pattern: "if\\s*\\(\\s*\\w+\\s*\\.\\s*getStatusCode\\s*\\(\\s*\\)\\s*!=\\s*200\\s*\\)\\s*\\{[^}]*\\breturn\\s*;[\\s\\S]*ERP_Synced__c\\s*=\\s*true" },
          ],
        },
        onFail: {
          es: "En execute: HttpResponse res = http.send(req); if (res.getStatusCode() != 200) { failed += scope.size(); return; } antes del bucle que marca ERP_Synced__c.",
          en: "In execute: HttpResponse res = http.send(req); if (res.getStatusCode() != 200) { failed += scope.size(); return; } before the loop setting ERP_Synced__c.",
        },
        otter: {
          es: "Este es el fallo que el test del 500 destapa: un 500 no lanza nada, así que hay que mirar la respuesta. HttpResponse res = http.send(req); y si res.getStatusCode() != 200, cuenta la tanda en failed y return, antes de marcar nada.",
          en: "This is the bug the 500 test exposes: a 500 throws nothing, so you have to look at the response. HttpResponse res = http.send(req); and if res.getStatusCode() != 200, count the chunk in failed and return, before marking anything.",
        },
      },
      {
        id: "m10-cp-c2",
        label: { es: "Dos ERP de mentira: 200 y 500", en: "Two fake ERPs: 200 and 500" },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "implements\\s+HttpCalloutMock\\b", min: 2 },
            { op: "match", pattern: "\\.\\s*setStatusCode\\s*\\(\\s*200\\s*\\)" },
            { op: "match", pattern: "\\.\\s*setStatusCode\\s*\\(\\s*5\\d\\d\\s*\\)" },
          ],
        },
        onFail: {
          es: "Dos clases que implementen HttpCalloutMock: una con setStatusCode(200) y otra con setStatusCode(500).",
          en: "Two classes implementing HttpCalloutMock: one with setStatusCode(200) and one with setStatusCode(500).",
        },
        otter: {
          es: "Una UAT completa tiene el caso feliz y el de error: un mock con setStatusCode(200) y otro con setStatusCode(500).",
          en: "A full UAT has the happy case and the error one: a mock with setStatusCode(200) and another with setStatusCode(500).",
        },
      },
      {
        id: "m10-cp-c3",
        label: { es: "El setup: 100 cuentas con una renovación cada una", en: "The setup: 100 accounts with one renewal each" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "@testSetup\\s+(private\\s+|public\\s+)?static\\s+void\\s+\\w+\\s*\\(\\s*\\)" },
            { op: "match", pattern: "for\\s*\\(\\s*Integer\\s+\\w+\\s*=\\s*0\\s*;\\s*\\w+\\s*<\\s*100\\s*;" },
            { op: "match", pattern: "AccountId\\s*=\\s*\\w+\\s*\\.\\s*Id" },
            { op: "absent", pattern: "for\\s*\\([^)]*\\)\\s*\\{[^{}]*\\binsert\\b" },
          ],
        },
        onFail: {
          es: "@testSetup: un for de 100 cuentas con un solo insert, y después una renovación por cuenta (AccountId = a.Id) con otro insert.",
          en: "@testSetup: a for of 100 accounts with a single insert, and then one renewal per account (AccountId = a.Id) with another insert.",
        },
        otter: {
          es: "100 renovaciones, una sola tanda de test, y cada una en su cuenta, porque el guardián no deja dos abiertas en la misma: un for de 100 cuentas, insert, y otro bucle que crea una renovación por cuenta, insert.",
          en: "100 renewals, a single test chunk, and each on its own account, because the guard allows no two open on the same one: a for of 100 accounts, insert, and another loop creating one renewal per account, insert.",
        },
      },
      {
        id: "m10-cp-c4",
        label: { es: "Dos tests: 0 pendientes y 100 pendientes", en: "Two tests: 0 pending and 100 pending" },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "Test\\s*\\.\\s*setMock\\s*\\(\\s*HttpCalloutMock\\s*\\.\\s*class", min: 2 },
            { op: "count", pattern: "Database\\s*\\.\\s*executeBatch\\s*\\(\\s*new\\s+ErpNightlySyncBatch\\s*\\(\\s*\\)\\s*,\\s*100\\s*\\)\\s*;\\s*Test\\s*\\.\\s*stopTest", min: 2 },
            { op: "match", pattern: "Assert\\s*\\.\\s*areEqual\\s*\\(\\s*0\\s*,\\s*\\w+\\s*,\\s*'[^']+'\\s*\\)" },
            { op: "match", pattern: "Assert\\s*\\.\\s*areEqual\\s*\\(\\s*100\\s*,\\s*\\w+\\s*,\\s*'[^']+'\\s*\\)" },
          ],
        },
        onFail: {
          es: "En cada test: Test.setMock(HttpCalloutMock.class, …); Test.startTest(); Database.executeBatch(new ErpNightlySyncBatch(), 100); Test.stopTest(); y Assert.areEqual(0, …) en uno y Assert.areEqual(100, …) en el otro.",
          en: "In each test: Test.setMock(HttpCalloutMock.class, …); Test.startTest(); Database.executeBatch(new ErpNightlySyncBatch(), 100); Test.stopTest(); and Assert.areEqual(0, …) in one and Assert.areEqual(100, …) in the other.",
        },
        otter: {
          es: "Dos casos con la misma forma y distinto resultado esperado: con el ERP bien, Assert.areEqual(0, pending, '…'); con el ERP en 500, Assert.areEqual(100, pending, '…'). Cada uno con su Test.setMock y el Batch entre startTest y stopTest.",
          en: "Two cases with the same shape and different expected results: with the ERP fine, Assert.areEqual(0, pending, '…'); with the ERP at 500, Assert.areEqual(100, pending, '…'). Each with its Test.setMock and the Batch between startTest and stopTest.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué cobertura tendría el Batch con estos dos tests? ¿Queda alguna línea sin ejecutar? ¿Merece la pena un tercer caso, por ejemplo con una renovación que no se puede guardar?",
        en: "What coverage would the Batch have with these two tests? Is any line left unrun? Is a third case worth it, for example with a renewal that cannot be saved?",
      },
      {
        es: "En una entrevista te preguntarán qué diferencia hay entre cobertura y un buen test. Esta entrega es tu respuesta: ¿sabrías contarla?",
        en: "In an interview you will be asked the difference between coverage and a good test. This delivery is your answer: could you tell it?",
      },
    ],
    voice: "otter",
    outro: {
      es: "¡Entregaste el puente con el ERP, probado! Cada pieza tiene tests de camino feliz y de error, el despliegue ya no sale en 0 %, y un test encontró un fallo antes que un cliente. En el Módulo 11 abres la caja de las integraciones: HTTP, JSON y Named Credentials.",
      en: "You delivered the ERP bridge, tested! Every piece has happy-path and error tests, the deployment no longer shows 0%, and a test found a bug before a customer did. In Module 11 you open the integrations box: HTTP, JSON and Named Credentials.",
    },
  },
};
