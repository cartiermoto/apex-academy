import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, a prueba
// Tarea 6 de 7: probar el aviso al ERP sin llamar al ERP.

@isTest
private class ErpSyncJobTest {
    // El ERP de mentira: responde siempre «recibido»
    private class ErpOkMock implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            res.setBody('{"received": true}');
            return res;
        }
    }

    @isTest
    static void marksTheRenewalsAsSynced() {
        Test.setMock(HttpCalloutMock.class, new ErpOkMock());   // antes de nada

        Account acme = new Account(Name = 'Acme');
        insert acme;
        Opportunity renewal = new Opportunity(
            Name = 'Acme · Renovación', AccountId = acme.Id, Type = 'Renewal',
            StageName = 'Prospecting', CloseDate = Date.today().addDays(30), Amount = 5000
        );
        insert renewal;

        Test.startTest();
        System.enqueueJob(new ErpSyncJob(new Set<Id>{ renewal.Id }));
        Test.stopTest();

        Opportunity synced = [SELECT ERP_Synced__c FROM Opportunity WHERE Id = :renewal.Id];
        Assert.isTrue(synced.ERP_Synced__c, 'La renovación tenía que quedar marcada como enviada');
    }
}`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, a prueba\n// Tarea 6 de 7: probar el aviso al ERP sin llamar al ERP.",
  "// CASE: the ERP bridge, under test\n// Task 6 of 7: test the ERP notice without calling the ERP.",
)
  .replace("// El ERP de mentira: responde siempre «recibido»", "// The fake ERP: it always answers «received»")
  .replace("// antes de nada", "// before anything else")
  .replace("'Acme · Renovación'", "'Acme · Renewal'")
  .replace("'La renovación tenía que quedar marcada como enviada'", "'The renewal should be marked as sent'");

export const l06Mocks: Lesson = {
  id: "m10-l06",
  slug: "mocks-para-callouts",
  n: 6,
  kind: "lesson",
  minutes: 30,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 5", en: "Remember? · Review of lesson 5" },
    prompt: { es: "¿Para qué sirve Assert.fail justo después de la llamada, dentro del try?", en: "What is Assert.fail for right after the call, inside the try?" },
    options: [
      { es: "Para que el test falle si no salta la excepción esperada", en: "So the test fails if the expected exception is not thrown" },
      { es: "Para capturar la excepción", en: "To catch the exception" },
      { es: "Para subir la cobertura", en: "To raise coverage" },
    ],
    answer: 0,
    explain: {
      es: "Sin él, el test pasaría también cuando el código no rechaza nada. Hoy, la última pieza difícil: el código que llama fuera.",
      en: "Without it, the test would also pass when the code rejects nothing. Today, the last hard piece: code that calls out.",
    },
  },
  title: { es: "Mocks para callouts", en: "Mocks for callouts" },
  summary: {
    es: "Un test no puede llamar a un sistema externo: fallaría. Para probar el código que lo hace, le das una respuesta de mentira, un mock, y compruebas qué hace tu código con ella.",
    en: "A test cannot call an external system: it would fail. To test the code that does, you give it a fake answer, a mock, and check what your code does with it.",
  },
  analogy: {
    es: "Probar en una sandbox con un usuario de prueba en lugar del cliente real",
    en: "Testing in a sandbox with a test user instead of the real customer",
  },
  objectives: [
    { es: "Escribir un HttpCalloutMock que devuelva una respuesta preparada.", en: "Write an HttpCalloutMock that returns a prepared response." },
    { es: "Registrarlo con Test.setMock antes de que el código llame fuera.", en: "Register it with Test.setMock before the code calls out." },
    { es: "Probar qué hace tu código con la respuesta.", en: "Test what your code does with the response." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "ErpSyncJob, el Queueable del Módulo 9, llama al ERP y después marca las renovaciones como enviadas. Si lo ejecutas en un test tal cual, falla: los métodos de test no pueden hacer callouts. Y aunque pudieran, no querrías que cada despliegue mandara renovaciones de prueba al ERP de verdad.",
        en: "ErpSyncJob, Module 9's Queueable, calls the ERP and then marks the renewals as sent. If you run it in a test as is, it fails: test methods cannot make callouts. And even if they could, you would not want every deployment sending test renewals to the real ERP.",
      },
    },
    {
      type: "h",
      text: { es: "Un ERP de mentira", en: "A fake ERP" },
    },
    {
      type: "code",
      code: {
        es: `private class ErpOkMock implements HttpCalloutMock {
    public HttpResponse respond(HttpRequest req) {
        HttpResponse res = new HttpResponse();
        res.setStatusCode(200);
        res.setBody('{"received": true}');
        return res;
    }
}

Test.setMock(HttpCalloutMock.class, new ErpOkMock());   // desde aquí, cada callout lo contesta el mock`,
        en: `private class ErpOkMock implements HttpCalloutMock {
    public HttpResponse respond(HttpRequest req) {
        HttpResponse res = new HttpResponse();
        res.setStatusCode(200);
        res.setBody('{"received": true}');
        return res;
    }
}

Test.setMock(HttpCalloutMock.class, new ErpOkMock());   // from here on, the mock answers every callout`,
      },
      caption: {
        es: "HttpCalloutMock es otra interfaz con un solo método: respond. Recibe la petición que tu código iba a enviar y devuelve la respuesta que tú decidas.",
        en: "HttpCalloutMock is another single-method interface: respond. It receives the request your code was going to send and returns whatever response you decide.",
      },
    },
    {
      type: "p",
      text: {
        es: "Con Test.setMock, cuando el código ejecuta http.send(req), no sale nada de Salesforce: el [[mock]] contesta. Así pruebas lo que de verdad es tuyo, qué haces con la respuesta. Y puedes tener varios mocks: uno que responde 200, otro que responde 500 y otro que lanza una CalloutException, para probar también qué pasa cuando el ERP falla.",
        en: "With Test.setMock, when the code runs http.send(req), nothing leaves Salesforce: the [[mock]] answers. That way you test what is really yours, what you do with the answer. And you can have several mocks: one answering 200, another 500 and another throwing a CalloutException, to also test what happens when the ERP fails.",
      },
    },
    {
      type: "diagram",
      id: "m10-mock",
      caption: {
        es: "Ejecuta el test con y sin mock, y con un ERP que responde bien o que falla.",
        en: "Run the test with and without a mock, and with an ERP that answers fine or fails.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "El mock va antes de todo", en: "The mock goes before everything" },
      text: {
        es: "Registra el mock en la primera línea del test, antes de insertar datos. Si al insertar la renovación el trigger ya encola un aviso al ERP, ese callout también necesita respuesta. Un mock registrado tarde deja un callout sin contestar y el test falla por una razón que no tiene nada que ver con lo que pruebas.",
        en: "Register the mock on the test's first line, before inserting data. If inserting the renewal already makes the trigger enqueue an ERP notice, that callout needs an answer too. A mock registered late leaves a callout unanswered and the test fails for a reason unrelated to what you are testing.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Tu usuario de prueba, pero para sistemas", en: "Your test user, but for systems" },
      text: {
        es: "Cuando probaba en una sandbox, nunca usaba el correo de un cliente real: creaba un contacto de prueba para que los emails no llegaran a nadie. Un mock es ese contacto de prueba para el ERP: el código hace exactamente lo mismo, pero la llamada no sale.",
        en: "When I tested in a sandbox, I never used a real customer's email: I created a test contact so emails would reach nobody. A mock is that test contact for the ERP: the code does exactly the same, but the call does not go out.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque el callout vive donde Flow no prueba", en: "Why not a Flow? Because the callout lives where Flow does not test" },
      text: {
        es: "En un flow desencadenado por registro, el callout HTTP va en el camino asíncrono, y los tests de Flow no admiten caminos asíncronos. Esa parte del flow se despliega sin probar. En Apex, HttpCalloutMock te deja probar la llamada, la respuesta buena y la mala antes de que nada llegue a producción.",
        en: "In a record-triggered flow, the HTTP callout goes on the async path, and Flow tests do not support async paths. That part of the flow is deployed untested. In Apex, HttpCalloutMock lets you test the call, the good answer and the bad one before anything reaches production.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué pasa si un test hace un callout sin mock? ¿Qué método tiene que escribir un HttpCalloutMock? ¿Por qué Test.setMock va en la primera línea?",
        en: "Without looking: what happens if a test makes a callout with no mock? Which method must an HttpCalloutMock write? Why does Test.setMock go on the first line?",
      },
    },
  ],

  quiz: [
    {
      id: "m10-l06-q1",
      kind: "single",
      prompt: { es: "¿Qué pasa si un test ejecuta un http.send sin mock registrado?", en: "What happens if a test runs an http.send with no mock registered?" },
      options: [
        { es: "El test falla: los tests no pueden hacer callouts reales", en: "The test fails: tests cannot make real callouts" },
        { es: "Llama al sistema real", en: "It calls the real system" },
        { es: "Devuelve una respuesta vacía", en: "It returns an empty response" },
        { es: "Se salta el callout", en: "It skips the callout" },
      ],
      answer: 0,
      explain: {
        es: "Salesforce no deja salir a un test. Por eso el mock no es opcional: es la única forma de probar ese código.",
        en: "Salesforce does not let a test out. That is why the mock is not optional: it is the only way to test that code.",
      },
    },
    {
      id: "m10-l06-q2",
      kind: "single",
      prompt: { es: "¿Qué firma tiene el método de un HttpCalloutMock?", en: "What signature does an HttpCalloutMock's method have?" },
      options: [
        { es: "public HttpResponse respond(HttpRequest req)", en: "public HttpResponse respond(HttpRequest req)" },
        { es: "public void respond()", en: "public void respond()" },
        { es: "public static HttpRequest send(HttpResponse res)", en: "public static HttpRequest send(HttpResponse res)" },
        { es: "public void execute(QueueableContext ctx)", en: "public void execute(QueueableContext ctx)" },
      ],
      answer: 0,
      explain: {
        es: "Recibe la petición que iba a salir y devuelve la respuesta que tú preparas.",
        en: "It receives the request that was about to go out and returns the response you prepare.",
      },
    },
    {
      id: "m10-l06-q3",
      kind: "multi",
      prompt: { es: "¿Qué puedes probar con distintos mocks?", en: "What can you test with different mocks?" },
      options: [
        { es: "Que con un 200 las renovaciones se marcan como enviadas", en: "That with a 200 the renewals are marked as sent" },
        { es: "Que con un 500 no se marcan", en: "That with a 500 they are not marked" },
        { es: "Que si el ERP no responde (CalloutException) el código reacciona como debe", en: "That if the ERP does not respond (CalloutException) the code reacts as it should" },
        { es: "Que el ERP real está encendido", en: "That the real ERP is up" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "El mock prueba tu código, no el sistema externo: si el ERP real funciona es cosa de otra prueba.",
        en: "The mock tests your code, not the external system: whether the real ERP works is another test's business.",
      },
    },
    {
      id: "m10-l06-q4",
      kind: "text",
      prompt: {
        es: "Escribe la línea que registra new ErpOkMock() como respuesta a los callouts HTTP del test.",
        en: "Write the line that registers new ErpOkMock() as the answer to the test's HTTP callouts.",
      },
      accept: ["test\\.setmock\\(\\s*httpcalloutmock\\.class\\s*,\\s*new\\s+erpokmock\\(\\s*\\)\\s*\\)\\s*;?"],
      placeholder: { es: "Test.…", en: "Test.…" },
      explain: {
        es: "Test.setMock(HttpCalloutMock.class, new ErpOkMock()); en la primera línea del test.",
        en: "Test.setMock(HttpCalloutMock.class, new ErpOkMock()); on the test's first line.",
      },
      tags: ["recall"],
    },
    {
      id: "m10-l06-q5",
      kind: "single",
      prompt: {
        es: "El test registra el mock después de insertar la renovación, y falla con un error de callout. ¿Por qué?",
        en: "The test registers the mock after inserting the renewal, and fails with a callout error. Why?",
      },
      options: [
        {
          es: "Al insertar, el trigger ya encoló un aviso al ERP, y ese callout se quedó sin mock",
          en: "On insert, the trigger already enqueued an ERP notice, and that callout was left without a mock",
        },
        { es: "Test.setMock solo funciona dentro de startTest", en: "Test.setMock only works inside startTest" },
        { es: "Los mocks no sirven para Queueables", en: "Mocks do not work for Queueables" },
        { es: "El mock tiene que ser public", en: "The mock has to be public" },
      ],
      answer: 0,
      explain: {
        es: "El mock va antes de todo, incluso de la preparación de datos.",
        en: "The mock goes before everything, even data preparation.",
      },
    },
    {
      id: "m10-l06-q6",
      kind: "single",
      prompt: {
        es: "Repaso: dentro de ErpSyncJob, ¿por qué el http.send va antes del update?",
        en: "Review: inside ErpSyncJob, why does the http.send go before the update?",
      },
      options: [
        { es: "Porque no se puede llamar fuera con un DML pendiente de confirmar", en: "Because you cannot call out with an uncommitted DML pending" },
        { es: "Por estilo", en: "For style" },
        { es: "Porque el update es más lento", en: "Because the update is slower" },
        { es: "Porque lo exige el mock", en: "Because the mock requires it" },
      ],
      answer: 0,
      explain: {
        es: "«You have uncommitted work pending». El mock no lo evita: el test te lo mostraría igual.",
        en: "«You have uncommitted work pending». The mock does not avoid it: the test would show it to you all the same.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M9 L6", en: "Review · M9 L6" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 6 DE 7 · ErpSyncJob no tiene test porque «no se puede probar sin el ERP». Sí se puede: escribe un ERP de mentira que responda 200 y comprueba que, tras ejecutar el trabajo, la renovación queda con ERP_Synced__c = true.",
      en: "TASK 6 OF 7 · ErpSyncJob has no test because «it cannot be tested without the ERP». Yes it can: write a fake ERP that answers 200 and check that, after running the job, the renewal ends up with ERP_Synced__c = true.",
    },
    brief: [
      {
        es: "Dentro de ErpSyncJobTest, una clase private ErpOkMock implements HttpCalloutMock cuyo respond devuelva un HttpResponse con código 200 y un cuerpo.",
        en: "Inside ErpSyncJobTest, a private ErpOkMock class implements HttpCalloutMock whose respond returns an HttpResponse with status 200 and a body.",
      },
      {
        es: "En marksTheRenewalsAsSynced(), la primera línea es Test.setMock(HttpCalloutMock.class, new ErpOkMock()); después, una cuenta y una renovación.",
        en: "In marksTheRenewalsAsSynced(), the first line is Test.setMock(HttpCalloutMock.class, new ErpOkMock()); then an account and a renewal.",
      },
      {
        es: "Entre Test.startTest() y Test.stopTest(), encola new ErpSyncJob con el Id de la renovación. Después, consúltala y comprueba ERP_Synced__c con Assert.isTrue.",
        en: "Between Test.startTest() and Test.stopTest(), enqueue new ErpSyncJob with the renewal's Id. Then query it and check ERP_Synced__c with Assert.isTrue.",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, a prueba
// Ya resuelto (tareas 1-5): caminos felices y de error del puente, y el Batch.
// Tarea 6 de 7: probar el aviso al ERP sin llamar al ERP.

@isTest
private class ErpSyncJobTest {
    @isTest
    static void marksTheRenewalsAsSynced() {
        // «Esto no se puede probar sin el ERP de verdad»
    }
}
`,
      en: `// CASE: the ERP bridge, under test
// Already solved (tasks 1-5): happy and error paths of the bridge, and the Batch.
// Task 6 of 7: test the ERP notice without calling the ERP.

@isTest
private class ErpSyncJobTest {
    @isTest
    static void marksTheRenewalsAsSynced() {
        // «This cannot be tested without the real ERP»
    }
}
`,
    },
    hints: [
      {
        es: "Yo lo pensaría como el contacto de prueba de una sandbox: el código no sabe que el ERP es de mentira, así que hace todo igual. Tú solo decides qué contesta.",
        en: "I would think of it as a sandbox's test contact: the code does not know the ERP is fake, so it does everything the same. You only decide what it answers.",
      },
      {
        es: "Lo que me ayudó: HttpCalloutMock es una interfaz de un solo método, respond. Se registra con Test.setMock al principio, y el Queueable se ejecuta al llegar a Test.stopTest().",
        en: "What helped me: HttpCalloutMock is a single-method interface, respond. It is registered with Test.setMock at the start, and the Queueable runs on reaching Test.stopTest().",
      },
      {
        es: "Te dejo el esquema: private class ErpOkMock implements HttpCalloutMock { public HttpResponse respond(HttpRequest req) { HttpResponse res = new HttpResponse(); res.setStatusCode(200); res.setBody('…'); return res; } } · Test.setMock(HttpCalloutMock.class, new ErpOkMock()); … Test.startTest(); System.enqueueJob(new ErpSyncJob(new Set<Id>{ renewal.Id })); Test.stopTest(); … Assert.isTrue(synced.ERP_Synced__c, '…');",
        en: "Here is the outline: private class ErpOkMock implements HttpCalloutMock { public HttpResponse respond(HttpRequest req) { HttpResponse res = new HttpResponse(); res.setStatusCode(200); res.setBody('…'); return res; } } · Test.setMock(HttpCalloutMock.class, new ErpOkMock()); … Test.startTest(); System.enqueueJob(new ErpSyncJob(new Set<Id>{ renewal.Id })); Test.stopTest(); … Assert.isTrue(synced.ERP_Synced__c, '…');",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m10-l06-c1",
        label: { es: "Un ERP de mentira que responde 200", en: "A fake ERP answering 200" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "class\\s+\\w+\\s+implements\\s+HttpCalloutMock\\b" },
            { op: "match", pattern: "public\\s+HttpResponse\\s+respond\\s*\\(\\s*HttpRequest\\s+\\w+\\s*\\)" },
            { op: "match", pattern: "\\.\\s*setStatusCode\\s*\\(\\s*200\\s*\\)" },
            { op: "match", pattern: "return\\s+\\w+\\s*;" },
          ],
        },
        onFail: {
          es: "private class ErpOkMock implements HttpCalloutMock { public HttpResponse respond(HttpRequest req) { HttpResponse res = new HttpResponse(); res.setStatusCode(200); … return res; } }",
          en: "private class ErpOkMock implements HttpCalloutMock { public HttpResponse respond(HttpRequest req) { HttpResponse res = new HttpResponse(); res.setStatusCode(200); … return res; } }",
        },
        otter: {
          es: "Tu contacto de prueba para el ERP: una clase que implementa HttpCalloutMock con un solo método, respond, que devuelve un HttpResponse con setStatusCode(200).",
          en: "Your test contact for the ERP: a class implementing HttpCalloutMock with a single method, respond, that returns an HttpResponse with setStatusCode(200).",
        },
      },
      {
        id: "m10-l06-c2",
        label: { es: "El mock se registra antes de todo", en: "The mock is registered before everything" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Test\\s*\\.\\s*setMock\\s*\\(\\s*HttpCalloutMock\\s*\\.\\s*class\\s*,\\s*new\\s+\\w+\\s*\\(\\s*\\)\\s*\\)" },
            { op: "match", pattern: "Test\\s*\\.\\s*setMock[\\s\\S]*\\binsert\\s+\\w+" },
            { op: "absent", pattern: "\\binsert\\s+\\w+[\\s\\S]*Test\\s*\\.\\s*setMock" },
          ],
        },
        onFail: {
          es: "La primera línea del test: Test.setMock(HttpCalloutMock.class, new ErpOkMock()); y después los inserts.",
          en: "The test's first line: Test.setMock(HttpCalloutMock.class, new ErpOkMock()); and then the inserts.",
        },
        otter: {
          es: "El mock va antes de preparar los datos: si el trigger avisa al ERP al insertar la renovación, ese callout también necesita respuesta. Test.setMock(HttpCalloutMock.class, new ErpOkMock()); lo primero.",
          en: "The mock goes before preparing the data: if the trigger notifies the ERP when the renewal is inserted, that callout needs an answer too. Test.setMock(HttpCalloutMock.class, new ErpOkMock()); first.",
        },
      },
      {
        id: "m10-l06-c3",
        label: { es: "El trabajo se ejecuta y se comprueba el resultado", en: "The job runs and the result is checked" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Test\\s*\\.\\s*startTest\\s*\\(\\s*\\)\\s*;[\\s\\S]*System\\s*\\.\\s*enqueueJob\\s*\\(\\s*new\\s+ErpSyncJob\\s*\\([\\s\\S]*Test\\s*\\.\\s*stopTest\\s*\\(\\s*\\)\\s*;" },
            { op: "match", pattern: "Test\\s*\\.\\s*stopTest\\s*\\(\\s*\\)\\s*;[\\s\\S]*SELECT[^\\]]*ERP_Synced__c[^\\]]*FROM\\s+Opportunity" },
            { op: "match", pattern: "Assert\\s*\\.\\s*isTrue\\s*\\(\\s*\\w+\\s*\\.\\s*ERP_Synced__c\\s*,\\s*'[^']+'\\s*\\)" },
          ],
        },
        onFail: {
          es: "Test.startTest(); System.enqueueJob(new ErpSyncJob(new Set<Id>{ renewal.Id })); Test.stopTest(); después consulta la renovación y Assert.isTrue(synced.ERP_Synced__c, '…');",
          en: "Test.startTest(); System.enqueueJob(new ErpSyncJob(new Set<Id>{ renewal.Id })); Test.stopTest(); then query the renewal and Assert.isTrue(synced.ERP_Synced__c, '…');",
        },
        otter: {
          es: "Lo que es tuyo es qué haces con la respuesta: encola ErpSyncJob entre startTest y stopTest, vuelve a consultar la renovación y comprueba con Assert.isTrue que ERP_Synced__c quedó en true.",
          en: "What is yours is what you do with the answer: enqueue ErpSyncJob between startTest and stopTest, query the renewal again and check with Assert.isTrue that ERP_Synced__c ended up true.",
        },
      },
    ],
    rubric: [
      {
        es: "Escribe mentalmente un segundo mock que responda 500. ¿Qué debería pasar con ERP_Synced__c? ¿Lo hace hoy ErpSyncJob, o el test destaparía un fallo?",
        en: "Mentally write a second mock answering 500. What should happen to ERP_Synced__c? Does ErpSyncJob do it today, or would the test expose a bug?",
      },
    ],
    voice: "otter",
    outro: {
      es: "Ya pruebas el código que habla con otros sistemas sin molestar a nadie. Tienes todas las piezas: en la tarea 7 cubres la sincronización nocturna completa, con un ERP que responde y otro que se cae.",
      en: "You now test code that talks to other systems without bothering anyone. You have every piece: in task 7 you cover the full nightly sync, with an ERP that answers and one that goes down.",
    },
  },
};
