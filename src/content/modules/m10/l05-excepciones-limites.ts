import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, a prueba
// Tarea 5 de 7: probar lo que tiene que fallar.

@isTest
private class RenewalRowTest {
    @isTest
    static void parsesAValidAmount() {
        Assert.areEqual(12500.00, RenewalRow.parseAmount('12500.00'));
    }

    @isTest
    static void rejectsAMissingAmount() {
        try {
            RenewalRow.parseAmount(null);
            Assert.fail('Un importe nulo tenía que lanzar RenewalImportException');
        } catch (RenewalImportException e) {
            Assert.isTrue(e.getMessage().contains('vacío'), 'Mensaje inesperado: ' + e.getMessage());
        }
    }

    @isTest
    static void keepsTheOriginalErrorForText() {
        try {
            RenewalRow.parseAmount('doce mil');
            Assert.fail('Un texto tenía que lanzar RenewalImportException');
        } catch (RenewalImportException e) {
            Assert.isInstanceOfType(e.getCause(), TypeException.class, 'La causa tenía que ser la TypeException original');
        }
    }
}

// En RenewalGuardTest (tarea 2), un caso más:
@isTest
static void rejectsASecondOpenRenewal() {
    Account acme = [SELECT Id FROM Account WHERE Name = 'Acme' LIMIT 1];
    Opportunity second = new Opportunity(
        Name = 'Acme · Renovación 2', AccountId = acme.Id, Type = 'Renewal',
        StageName = 'Prospecting', CloseDate = Date.today().addDays(60), Amount = 3000
    );
    Database.SaveResult sr = Database.insert(second, false);
    Assert.isFalse(sr.isSuccess(), 'El guardián tenía que rechazar la segunda renovación');
    Assert.isTrue(sr.getErrors()[0].getMessage().contains('renovación abierta'), 'Mensaje inesperado');
}`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, a prueba\n// Tarea 5 de 7: probar lo que tiene que fallar.",
  "// CASE: the ERP bridge, under test\n// Task 5 of 7: test what has to fail.",
)
  .replace("'Un importe nulo tenía que lanzar RenewalImportException'", "'A null amount should throw RenewalImportException'")
  .replace("contains('vacío'), 'Mensaje inesperado: '", "contains('Empty'), 'Unexpected message: '")
  .replace("parseAmount('doce mil')", "parseAmount('twelve thousand')")
  .replace("'Un texto tenía que lanzar RenewalImportException'", "'Text should throw RenewalImportException'")
  .replace("'La causa tenía que ser la TypeException original'", "'The cause should be the original TypeException'")
  .replace("// En RenewalGuardTest (tarea 2), un caso más:", "// In RenewalGuardTest (task 2), one more case:")
  .replace("'Acme · Renovación 2'", "'Acme · Renewal 2'")
  .replace("'El guardián tenía que rechazar la segunda renovación'", "'The guard should reject the second renewal'")
  .replace("contains('renovación abierta'), 'Mensaje inesperado'", "contains('open renewal'), 'Unexpected message'");

export const l05ExcepcionesLimites: Lesson = {
  id: "m10-l05",
  slug: "excepciones-y-casos-limite",
  n: 5,
  kind: "lesson",
  minutes: 30,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 4", en: "Remember? · Review of lesson 4" },
    prompt: { es: "¿Dónde va el Assert que comprueba el resultado de un Batch?", en: "Where does the Assert checking a Batch's result go?" },
    options: [
      { es: "Después de Test.stopTest()", en: "After Test.stopTest()" },
      { es: "Antes de Test.startTest()", en: "Before Test.startTest()" },
      { es: "Dentro del Batch", en: "Inside the Batch" },
    ],
    answer: 0,
    explain: {
      es: "Después de stopTest, cuando ya se ha ejecutado. Hasta ahora has probado caminos felices; hoy, los que tienen que fallar.",
      en: "After stopTest, once it has run. So far you have tested happy paths; today, the ones that have to fail.",
    },
  },
  title: { es: "Probar excepciones y casos límite", en: "Testing exceptions and edge cases" },
  summary: {
    es: "Un buen test no solo comprueba que lo correcto funciona: comprueba que lo incorrecto falla como debe. Importes nulos, textos raros, duplicados: si el código tiene que rechazarlos, un test lo demuestra.",
    en: "A good test does not only check that the right thing works: it checks that the wrong thing fails as it should. Null amounts, odd text, duplicates: if the code has to reject them, a test proves it.",
  },
  analogy: {
    es: "Probar que la regla de validación salta con los datos malos, no solo que deja pasar los buenos",
    en: "Testing that the validation rule fires with bad data, not only that it lets good data through",
  },
  objectives: [
    { es: "Comprobar que un método lanza la excepción esperada con try, Assert.fail y catch.", en: "Check that a method throws the expected exception with try, Assert.fail and catch." },
    { es: "Probar los casos límite: null, vacío, tipos erróneos.", en: "Test edge cases: null, empty, wrong types." },
    { es: "Probar que un trigger rechaza un registro con addError.", en: "Test that a trigger rejects a record with addError." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "En el Módulo 8, el puente aprendió a rechazar: importes vacíos, textos que no son números, una segunda renovación abierta. Si mañana alguien «simplifica» parseAmount y quita el throw, ningún test de camino feliz lo notará. Hay que probar también el camino de error.",
        en: "In Module 8, the bridge learned to reject: empty amounts, text that is not a number, a second open renewal. If tomorrow someone «simplifies» parseAmount and removes the throw, no happy-path test will notice. The error path has to be tested too.",
      },
    },
    {
      type: "h",
      text: { es: "Comprobar que salta la excepción", en: "Checking that the exception is thrown" },
    },
    {
      type: "code",
      code: {
        es: `try {
    RenewalRow.parseAmount(null);
    Assert.fail('Un importe nulo tenía que lanzar RenewalImportException');   // no debería llegar aquí
} catch (RenewalImportException e) {
    Assert.isTrue(e.getMessage().contains('vacío'), 'Mensaje inesperado: ' + e.getMessage());
}`,
        en: `try {
    RenewalRow.parseAmount(null);
    Assert.fail('A null amount should throw RenewalImportException');   // it should not get here
} catch (RenewalImportException e) {
    Assert.isTrue(e.getMessage().contains('Empty'), 'Unexpected message: ' + e.getMessage());
}`,
      },
      caption: {
        es: "Si parseAmount lanza, se salta al catch y se comprueba el mensaje. Si no lanza, Assert.fail hace fallar el test. Sin esa línea, el test pasaría también cuando el código no rechaza nada.",
        en: "If parseAmount throws, it jumps to the catch and the message is checked. If it does not, Assert.fail makes the test fail. Without that line, the test would also pass when the code rejects nothing.",
      },
    },
    {
      type: "p",
      text: {
        es: "Y si tu excepción envuelve a otra, como hace parseAmount con la TypeException del texto, compruébalo también: Assert.isInstanceOfType(e.getCause(), TypeException.class, mensaje). Así nadie podrá perder la causa original sin que un test se entere.",
        en: "And if your exception wraps another, as parseAmount does with the text's TypeException, check that too: Assert.isInstanceOfType(e.getCause(), TypeException.class, message). That way nobody can lose the original cause without a test noticing.",
      },
    },
    {
      type: "diagram",
      id: "m10-edge-cases",
      caption: {
        es: "Pasa cada entrada por parseAmount y mira qué camino toma y qué test lo protege.",
        en: "Run each input through parseAmount and see which path it takes and which test protects it.",
      },
    },
    {
      type: "h",
      text: { es: "Probar el rechazo de un trigger", en: "Testing a trigger's rejection" },
    },
    {
      type: "p",
      text: {
        es: "El guardián rechaza con addError. En el test, inserta con Database.insert(registro, false) y mira el SaveResult: isSuccess() tiene que ser false y el mensaje, el de tu addError. Es el mismo SaveResult del Módulo 8, ahora del lado de quien prueba.",
        en: "The guard rejects with addError. In the test, insert with Database.insert(record, false) and look at the SaveResult: isSuccess() must be false and the message, your addError's. It is Module 8's SaveResult, now on the tester's side.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Los casos límite que siempre pruebo", en: "The edge cases I always test" },
      text: {
        es: "null y vacío en cada texto que entra; 0 y negativos en cada número; un registro sin su padre; y, en los triggers, un lote de 200 registros insertados de golpe, para demostrar que el código está bulkificado. Un test que inserta un solo registro no prueba lo que pasará con Data Loader.",
        en: "null and empty on every incoming text; 0 and negatives on every number; a record without its parent; and, in triggers, a batch of 200 records inserted at once, to prove the code is bulkified. A test inserting a single record does not prove what will happen with Data Loader.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Aquí Flow también lo intenta", en: "Why not a Flow? Here Flow tries too" },
      text: {
        es: "Con franqueza: en un test de Flow puedes definir un registro con datos malos y comprobar el resultado, igual que harías con tu regla de validación. Lo que no puedes es probar un rechazo que dependa de otro registro, como la segunda renovación de Acme, porque sus tests no trabajan con padres ni con otros registros del objeto. En Apex preparas el escenario entero y compruebas el mensaje exacto.",
        en: "Frankly: in a Flow test you can define a record with bad data and check the result, just as you would with your validation rule. What you cannot do is test a rejection that depends on another record, like Acme's second renewal, because its tests do not work with parents or other records of the object. In Apex you prepare the whole scenario and check the exact message.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿para qué sirve Assert.fail dentro del try? ¿Cómo compruebas la causa de una excepción envuelta? ¿Cómo pruebas un addError sin que el test reviente?",
        en: "Without looking: what is Assert.fail for inside the try? How do you check a wrapped exception's cause? How do you test an addError without the test blowing up?",
      },
    },
  ],

  quiz: [
    {
      id: "m10-l05-q1",
      kind: "single",
      prompt: {
        es: "Alguien quita el throw de parseAmount para los importes vacíos. ¿Qué pasa con este test?",
        en: "Someone removes parseAmount's throw for empty amounts. What happens to this test?",
      },
      code: {
        es: `try {
    RenewalRow.parseAmount('');
} catch (RenewalImportException e) {
    Assert.isTrue(e.getMessage().contains('vacío'));
}`,
        en: `try {
    RenewalRow.parseAmount('');
} catch (RenewalImportException e) {
    Assert.isTrue(e.getMessage().contains('Empty'));
}`,
      },
      options: [
        { es: "Sigue en verde: sin Assert.fail no se da cuenta", en: "It stays green: without Assert.fail it does not notice" },
        { es: "Falla, como debe", en: "It fails, as it should" },
        { es: "No compila", en: "It does not compile" },
        { es: "Salta una TypeException sin capturar", en: "An uncaught TypeException is thrown" },
      ],
      answer: 0,
      explain: {
        es: "Sin excepción no se entra al catch, no se ejecuta ningún Assert y el test pasa. Falta Assert.fail justo después de la llamada.",
        en: "With no exception the catch is never entered, no Assert runs and the test passes. Assert.fail is missing right after the call.",
      },
      tags: ["find-error"],
    },
    {
      id: "m10-l05-q2",
      kind: "single",
      prompt: {
        es: "¿Cómo pruebas que el guardián rechaza una segunda renovación sin que el test reviente?",
        en: "How do you test that the guard rejects a second renewal without the test blowing up?",
      },
      options: [
        {
          es: "Database.insert(registro, false) y comprobar que el SaveResult no es isSuccess() y trae el mensaje",
          en: "Database.insert(record, false) and check that the SaveResult is not isSuccess() and carries the message",
        },
        { es: "insert normal y que el test falle", en: "A plain insert and let the test fail" },
        { es: "Assert.isTrue(true) después del insert", en: "Assert.isTrue(true) after the insert" },
        { es: "No se puede probar un trigger", en: "A trigger cannot be tested" },
      ],
      answer: 0,
      explain: {
        es: "Con allOrNone = false, el rechazo llega como resultado y no como excepción. También valdría un insert normal dentro de un try con catch de DmlException.",
        en: "With allOrNone = false, the rejection arrives as a result, not an exception. A plain insert inside a try with a DmlException catch would also work.",
      },
    },
    {
      id: "m10-l05-q3",
      kind: "multi",
      prompt: { es: "¿Qué casos límite merece la pena probar en parseAmount?", en: "Which edge cases are worth testing in parseAmount?" },
      options: [
        { es: "null", en: "null" },
        { es: "Texto vacío o solo espacios", en: "Empty text or only spaces" },
        { es: "Un texto que no es un número", en: "Text that is not a number" },
        { es: "Cero y negativos", en: "Zero and negatives" },
      ],
      answers: [0, 1, 2, 3],
      explain: {
        es: "Los cuatro son caminos distintos del código. Cada uno, un test con su nombre.",
        en: "All four are different code paths. Each one, a test with its own name.",
      },
    },
    {
      id: "m10-l05-q4",
      kind: "text",
      prompt: {
        es: "Escribe la línea que hace fallar el test si la ejecución llega a ella, con el mensaje 'Tenía que lanzar'.",
        en: "Write the line that fails the test if execution reaches it, with the message 'Should have thrown'.",
      },
      accept: ["assert\\.fail\\(\\s*'tenia que lanzar'\\s*\\)\\s*;?", "assert\\.fail\\(\\s*'should have thrown'\\s*\\)\\s*;?"],
      placeholder: { es: "Assert.…", en: "Assert.…" },
      explain: { es: "Assert.fail('Tenía que lanzar');", en: "Assert.fail('Should have thrown');" },
      tags: ["recall"],
    },
    {
      id: "m10-l05-q5",
      kind: "single",
      prompt: {
        es: "¿Por qué un test de trigger debería insertar 200 registros de golpe?",
        en: "Why should a trigger test insert 200 records at once?",
      },
      options: [
        { es: "Para demostrar que el trigger está bulkificado, como llegará con Data Loader", en: "To prove the trigger is bulkified, the way it will arrive with Data Loader" },
        { es: "Para subir la cobertura", en: "To raise coverage" },
        { es: "Porque Salesforce lo exige", en: "Because Salesforce demands it" },
        { es: "Para que el test tarde más", en: "To make the test take longer" },
      ],
      answer: 0,
      explain: {
        es: "Un registro y 200 ejecutan las mismas líneas: la cobertura no cambia, pero solo 200 destapan una consulta dentro de un bucle.",
        en: "One record and 200 run the same lines: coverage does not change, but only 200 expose a query inside a loop.",
      },
    },
    {
      id: "m10-l05-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿qué devuelve e.getCause() en la RenewalImportException de un importe 'doce mil'?",
        en: "Review: what does e.getCause() return on the RenewalImportException of an amount 'twelve thousand'?",
      },
      options: [
        { es: "La TypeException original", en: "The original TypeException" },
        { es: "null", en: "null" },
        { es: "Otra RenewalImportException", en: "Another RenewalImportException" },
        { es: "El texto 'doce mil'", en: "The text 'twelve thousand'" },
      ],
      answer: 0,
      explain: {
        es: "parseAmount la envolvió pasándola como segundo argumento. Hoy lo proteges con Assert.isInstanceOfType.",
        en: "parseAmount wrapped it by passing it as the second argument. Today you protect it with Assert.isInstanceOfType.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M8 L4", en: "Review · M8 L4" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 5 DE 7 · Los tests del puente solo prueban el camino feliz. Añade los de error: un importe nulo tiene que lanzar RenewalImportException, un texto tiene que conservar la TypeException como causa, y el guardián tiene que rechazar la segunda renovación abierta de Acme.",
      en: "TASK 5 OF 7 · The bridge's tests only test the happy path. Add the error ones: a null amount must throw RenewalImportException, text must keep the TypeException as its cause, and the guard must reject Acme's second open renewal.",
    },
    brief: [
      {
        es: "En RenewalRowTest, rejectsAMissingAmount(): parseAmount(null) dentro de un try, Assert.fail justo después, y en catch (RenewalImportException e) comprueba el mensaje.",
        en: "In RenewalRowTest, rejectsAMissingAmount(): parseAmount(null) inside a try, Assert.fail right after, and in catch (RenewalImportException e) check the message.",
      },
      {
        es: "keepsTheOriginalErrorForText(): lo mismo con 'doce mil', y en el catch Assert.isInstanceOfType(e.getCause(), TypeException.class, mensaje).",
        en: "keepsTheOriginalErrorForText(): the same with 'twelve thousand', and in the catch Assert.isInstanceOfType(e.getCause(), TypeException.class, message).",
      },
      {
        es: "En RenewalGuardTest, rejectsASecondOpenRenewal(): una segunda renovación para Acme con Database.insert(…, false); Assert.isFalse(sr.isSuccess(), …) y comprueba que el mensaje menciona la renovación abierta.",
        en: "In RenewalGuardTest, rejectsASecondOpenRenewal(): a second renewal for Acme with Database.insert(…, false); Assert.isFalse(sr.isSuccess(), …) and check the message mentions the open renewal.",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, a prueba
// Ya resuelto (tareas 1-4): camino feliz de parseAmount, del guardián, de AsyncContext y del Batch.
// Tarea 5 de 7: probar lo que tiene que fallar.

@isTest
private class RenewalRowTest {
    @isTest
    static void parsesAValidAmount() {
        Assert.areEqual(12500.00, RenewalRow.parseAmount('12500.00'));
    }
}

// En RenewalGuardTest (tarea 2), el caso que falta:
`,
      en: `// CASE: the ERP bridge, under test
// Already solved (tasks 1-4): happy path of parseAmount, the guard, AsyncContext and the Batch.
// Task 5 of 7: test what has to fail.

@isTest
private class RenewalRowTest {
    @isTest
    static void parsesAValidAmount() {
        Assert.areEqual(12500.00, RenewalRow.parseAmount('12500.00'));
    }
}

// In RenewalGuardTest (task 2), the missing case:
`,
    },
    hints: [
      {
        es: "Yo lo pensaría como probar una regla de validación: no basta con que deje pasar lo bueno; hay que meter lo malo y ver que salta el mensaje correcto.",
        en: "I would think of it as testing a validation rule: letting the good through is not enough; you have to feed it the bad and see the right message fire.",
      },
      {
        es: "Lo que me ayudó: el patrón es try { llamada; Assert.fail('…'); } catch (LaExcepcion e) { comprobaciones }. Y para el guardián, Database.insert(registro, false) devuelve un SaveResult en vez de reventar.",
        en: "What helped me: the pattern is try { call; Assert.fail('…'); } catch (TheException e) { checks }. And for the guard, Database.insert(record, false) returns a SaveResult instead of blowing up.",
      },
      {
        es: "Te dejo el esquema: try { RenewalRow.parseAmount(null); Assert.fail('…'); } catch (RenewalImportException e) { Assert.isTrue(e.getMessage().contains('vacío'), '…'); } · … catch (RenewalImportException e) { Assert.isInstanceOfType(e.getCause(), TypeException.class, '…'); } · Database.SaveResult sr = Database.insert(second, false); Assert.isFalse(sr.isSuccess(), '…'); Assert.isTrue(sr.getErrors()[0].getMessage().contains('renovación abierta'), '…');",
        en: "Here is the outline: try { RenewalRow.parseAmount(null); Assert.fail('…'); } catch (RenewalImportException e) { Assert.isTrue(e.getMessage().contains('Empty'), '…'); } · … catch (RenewalImportException e) { Assert.isInstanceOfType(e.getCause(), TypeException.class, '…'); } · Database.SaveResult sr = Database.insert(second, false); Assert.isFalse(sr.isSuccess(), '…'); Assert.isTrue(sr.getErrors()[0].getMessage().contains('open renewal'), '…');",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m10-l05-c1",
        label: { es: "Un importe nulo tiene que lanzar la excepción", en: "A null amount must throw the exception" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "try\\s*\\{\\s*RenewalRow\\s*\\.\\s*parseAmount\\s*\\(\\s*null\\s*\\)\\s*;\\s*Assert\\s*\\.\\s*fail\\s*\\(" },
            { op: "match", pattern: "catch\\s*\\(\\s*RenewalImportException\\s+\\w+\\s*\\)\\s*\\{[^}]*getMessage\\s*\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "try { RenewalRow.parseAmount(null); Assert.fail('…'); } catch (RenewalImportException e) { … e.getMessage() … }",
          en: "try { RenewalRow.parseAmount(null); Assert.fail('…'); } catch (RenewalImportException e) { … e.getMessage() … }",
        },
        otter: {
          es: "Mete el dato malo y exige que salte: try { RenewalRow.parseAmount(null); Assert.fail('…'); }. El Assert.fail es clave: si no salta nada, el test tiene que caerse. Y en el catch, comprueba el mensaje.",
          en: "Feed the bad data and demand it fires: try { RenewalRow.parseAmount(null); Assert.fail('…'); }. The Assert.fail is key: if nothing is thrown, the test must fail. And in the catch, check the message.",
        },
      },
      {
        id: "m10-l05-c2",
        label: { es: "Con texto, la causa es la TypeException", en: "With text, the cause is the TypeException" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "RenewalRow\\s*\\.\\s*parseAmount\\s*\\(\\s*'[^']*[a-záéíóúñ][^']*'\\s*\\)\\s*;\\s*Assert\\s*\\.\\s*fail\\s*\\(" },
            { op: "match", pattern: "Assert\\s*\\.\\s*isInstanceOfType\\s*\\(\\s*\\w+\\s*\\.\\s*getCause\\s*\\(\\s*\\)\\s*,\\s*TypeException\\s*\\.\\s*class" },
          ],
        },
        onFail: {
          es: "try { RenewalRow.parseAmount('doce mil'); Assert.fail('…'); } catch (RenewalImportException e) { Assert.isInstanceOfType(e.getCause(), TypeException.class, '…'); }",
          en: "try { RenewalRow.parseAmount('twelve thousand'); Assert.fail('…'); } catch (RenewalImportException e) { Assert.isInstanceOfType(e.getCause(), TypeException.class, '…'); }",
        },
        otter: {
          es: "Protege el envoltorio del Módulo 8: con 'doce mil', la excepción tiene que traer dentro la original. Assert.isInstanceOfType(e.getCause(), TypeException.class, '…').",
          en: "Protect Module 8's wrapper: with 'twelve thousand', the exception must carry the original inside. Assert.isInstanceOfType(e.getCause(), TypeException.class, '…').",
        },
      },
      {
        id: "m10-l05-c3",
        label: { es: "El guardián rechaza la segunda renovación", en: "The guard rejects the second renewal" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "FROM\\s+Account\\s+WHERE\\s+Name\\s*=\\s*'Acme'" },
            { op: "match", pattern: "Database\\s*\\.\\s*SaveResult\\s+\\w+\\s*=\\s*Database\\s*\\.\\s*insert\\s*\\(\\s*\\w+\\s*,\\s*false\\s*\\)" },
            { op: "match", pattern: "Assert\\s*\\.\\s*isFalse\\s*\\(\\s*\\w+\\s*\\.\\s*isSuccess\\s*\\(\\s*\\)" },
            { op: "match", pattern: "getErrors\\s*\\(\\s*\\)\\s*\\[\\s*0\\s*\\]\\s*\\.\\s*getMessage\\s*\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "Recupera Acme, crea la segunda renovación y: Database.SaveResult sr = Database.insert(second, false); Assert.isFalse(sr.isSuccess(), '…'); y comprueba sr.getErrors()[0].getMessage().",
          en: "Fetch Acme, build the second renewal and: Database.SaveResult sr = Database.insert(second, false); Assert.isFalse(sr.isSuccess(), '…'); and check sr.getErrors()[0].getMessage().",
        },
        otter: {
          es: "Acme ya tiene una renovación en el setup de la tarea 2. Inserta otra con Database.insert(second, false): el rechazo llega como SaveResult. Assert.isFalse(sr.isSuccess()) y mira que sr.getErrors()[0].getMessage() sea el mensaje del guardián.",
          en: "Acme already has a renewal in task 2's setup. Insert another with Database.insert(second, false): the rejection arrives as a SaveResult. Assert.isFalse(sr.isSuccess()) and check that sr.getErrors()[0].getMessage() is the guard's message.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué test añadirías para demostrar que el guardián aguanta un lote de 200 renovaciones de cuentas distintas?",
        en: "Which test would you add to prove the guard holds up with a batch of 200 renewals from different accounts?",
      },
    ],
    voice: "otter",
    outro: {
      es: "Ya pruebas lo que tiene que fallar, y nadie podrá quitar un throw sin que un test lo grite. Queda la pieza que habla con el ERP, y los tests no pueden llamar fuera. En la tarea 6 aprendes a fingir la respuesta del ERP.",
      en: "You now test what has to fail, and nobody can remove a throw without a test shouting. The piece that talks to the ERP remains, and tests cannot call out. In task 6 you learn to fake the ERP's answer.",
    },
  },
};
