import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, a prueba
// Tarea 3 de 7: un test que de verdad compruebe algo.

@isTest
private class AsyncContextTest {
    @isTest
    static void isSynchronousOutsideAJob() {
        Boolean result = AsyncContext.isAsync();
        Assert.isFalse(result, 'Fuera de un trabajo asíncrono, isAsync() tiene que ser false');
    }

    @isTest
    static void describesTheSynchronousBudget() {
        String text = AsyncContext.describe();
        Assert.areEqual('síncrono · 100 consultas · 10000 ms de CPU', text,
            'La descripción síncrona no coincide');
    }
}`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, a prueba\n// Tarea 3 de 7: un test que de verdad compruebe algo.",
  "// CASE: the ERP bridge, under test\n// Task 3 of 7: a test that really checks something.",
)
  .replace("'Fuera de un trabajo asíncrono, isAsync() tiene que ser false'", "'Outside an async job, isAsync() must be false'")
  .replace("'síncrono · 100 consultas · 10000 ms de CPU'", "'synchronous · 100 queries · 10000 ms of CPU'")
  .replace("'La descripción síncrona no coincide'", "'The synchronous description does not match'");

export const l03Assert: Lesson = {
  id: "m10-l03",
  slug: "assert",
  n: 3,
  kind: "lesson",
  minutes: 25,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 2", en: "Remember? · Review of lesson 2" },
    prompt: {
      es: "El test A cambia un registro del setup. ¿Lo ve cambiado el test B?",
      en: "Test A changes a setup record. Does test B see it changed?",
    },
    options: [
      { es: "No: cada test recibe los datos del setup intactos", en: "No: each test gets the setup's data intact" },
      { es: "Sí, si se ejecuta después", en: "Yes, if it runs afterwards" },
      { es: "Solo si comparten variable static", en: "Only if they share a static variable" },
    ],
    answer: 0,
    explain: {
      es: "Cada test empieza del mismo punto. Hoy toca la otra mitad de un test: comprobar el resultado.",
      en: "Each test starts from the same point. Today it is the other half of a test: checking the result.",
    },
  },
  title: { es: "Assert: verificar de verdad", en: "Assert: actually verifying" },
  summary: {
    es: "La cobertura dice qué líneas se ejecutaron; el Assert dice si hicieron lo correcto. Un test sin Assert pasa aunque el código esté mal. Hoy aprendes a escribir comprobaciones que fallan cuando deben.",
    en: "Coverage says which lines ran; the Assert says whether they did the right thing. A test without an Assert passes even if the code is wrong. Today you learn to write checks that fail when they should.",
  },
  analogy: {
    es: "El «resultado esperado» de un caso de prueba de UAT",
    en: "The «expected result» of a UAT test case",
  },
  objectives: [
    { es: "Usar los métodos de la clase Assert para comprobar resultados.", en: "Use the Assert class methods to check results." },
    { es: "Escribir mensajes que expliquen qué falló.", en: "Write messages that explain what failed." },
    { es: "Reconocer un test que da cobertura pero no comprueba nada.", en: "Recognise a test that gives coverage but checks nothing." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Un compañero dice que AsyncContext, la clase de la tarea 1 del Módulo 9, ya está probada: su test da 100 % de cobertura. Lo abres y encuentras que llama a los dos métodos y termina con Assert.isTrue(true). Ese test pasaría aunque isAsync() devolviera siempre true. Cubre, pero no prueba.",
        en: "A teammate says AsyncContext, the class from Module 9's task 1, is already tested: its test gives 100% coverage. You open it and find it calls both methods and ends with Assert.isTrue(true). That test would pass even if isAsync() always returned true. It covers, but it does not test.",
      },
    },
    {
      type: "h",
      text: { es: "Preparar, actuar, comprobar", en: "Arrange, act, assert" },
    },
    {
      type: "code",
      code: {
        es: `@isTest
static void describesTheSynchronousBudget() {
    // 1 · Preparar: aquí no hace falta nada (lección 2 si hicieran falta datos)
    // 2 · Actuar: una sola llamada, la que se prueba
    String text = AsyncContext.describe();
    // 3 · Comprobar: lo esperado, lo obtenido y qué significa si no coinciden
    Assert.areEqual('síncrono · 100 consultas · 10000 ms de CPU', text,
        'La descripción síncrona no coincide');
}`,
        en: `@isTest
static void describesTheSynchronousBudget() {
    // 1 · Arrange: nothing needed here (lesson 2 if data were needed)
    // 2 · Act: one single call, the one being tested
    String text = AsyncContext.describe();
    // 3 · Assert: the expected, the actual and what it means if they differ
    Assert.areEqual('synchronous · 100 queries · 10000 ms of CPU', text,
        'The synchronous description does not match');
}`,
      },
    },
    {
      type: "table",
      head: [
        { es: "Método", en: "Method" },
        { es: "Falla si…", en: "Fails if…" },
      ],
      rows: [
        [{ es: "Assert.areEqual(esperado, real, msg)", en: "Assert.areEqual(expected, actual, msg)" }, { es: "los dos valores son distintos", en: "the two values differ" }],
        [{ es: "Assert.areNotEqual(a, b, msg)", en: "Assert.areNotEqual(a, b, msg)" }, { es: "son iguales", en: "they are equal" }],
        [{ es: "Assert.isTrue(cond, msg) / isFalse", en: "Assert.isTrue(cond, msg) / isFalse" }, { es: "la condición no es la esperada", en: "the condition is not the expected one" }],
        [{ es: "Assert.isNull(x, msg) / isNotNull", en: "Assert.isNull(x, msg) / isNotNull" }, { es: "el valor es (o no es) null", en: "the value is (or is not) null" }],
        [{ es: "Assert.fail(msg)", en: "Assert.fail(msg)" }, { es: "se llega a esa línea (lección 5)", en: "that line is reached (lesson 5)" }],
      ],
    },
    {
      type: "p",
      text: {
        es: "El mensaje es opcional, pero es lo primero que leerás cuando el test falle dentro de seis meses, en un despliegue que no es el tuyo. «La descripción síncrona no coincide» te dice dónde mirar; sin mensaje solo verías los dos valores. Y en código antiguo verás System.assertEquals: es lo mismo, con el nombre de antes.",
        en: "The message is optional, but it is the first thing you will read when the test fails six months from now, in a deployment that is not yours. «The synchronous description does not match» tells you where to look; with no message you would only see the two values. And in older code you will see System.assertEquals: it is the same, under the old name.",
      },
    },
    {
      type: "diagram",
      id: "m10-assert",
      caption: {
        es: "Rompe AsyncContext a propósito y mira qué tests se enteran: el que solo cubre y el que comprueba.",
        en: "Break AsyncContext on purpose and see which tests notice: the one that only covers and the one that checks.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El «resultado esperado» de tu caso de prueba", en: "Your test case's «expected result»" },
      text: {
        es: "En una hoja de casos de UAT, cada fila tenía tres columnas: pasos, resultado esperado y resultado real. Un caso sin resultado esperado no se puede dar por bueno ni por malo. El Assert es esa columna: sin él, el test «pasa» diga lo que diga el código.",
        en: "In a UAT test case sheet, each row had three columns: steps, expected result and actual result. A case with no expected result cannot be marked good or bad. The Assert is that column: without it, the test «passes» whatever the code says.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Aquí Flow piensa igual", en: "Why not a Flow? Here Flow thinks the same way" },
      text: {
        es: "Con franqueza: los tests de Flow también llevan comprobaciones, las Assertions, y la idea es exactamente esta: qué debería valer el registro después de ejecutar el flow. Si ya las escribías, ya sabes escribir un Assert. La diferencia está en el alcance: en Apex compruebas cualquier valor, también el de un método que no toca ningún registro, como describe().",
        en: "Frankly: Flow tests carry checks too, the Assertions, and the idea is exactly this one: what the record should hold after the flow runs. If you already wrote them, you already know how to write an Assert. The difference is the scope: in Apex you check any value, including that of a method that touches no record, like describe().",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué diferencia hay entre cobertura y comprobación? ¿En qué orden van los argumentos de Assert.areEqual? ¿Para qué sirve el mensaje?",
        en: "Without looking: what is the difference between coverage and checking? In which order do Assert.areEqual's arguments go? What is the message for?",
      },
    },
  ],

  quiz: [
    {
      id: "m10-l03-q1",
      kind: "single",
      prompt: { es: "¿Qué comprueba este test?", en: "What does this test check?" },
      code: {
        es: `@isTest
static void describes() {
    AsyncContext.describe();
    Assert.isTrue(true);
}`,
        en: `@isTest
static void describes() {
    AsyncContext.describe();
    Assert.isTrue(true);
}`,
      },
      options: [
        { es: "Nada: pasa diga lo que diga describe()", en: "Nothing: it passes whatever describe() says" },
        { es: "Que describe() devuelve true", en: "That describe() returns true" },
        { es: "Que describe() devuelve un texto no vacío", en: "That describe() returns a non-empty text" },
        { es: "Que el contexto es síncrono", en: "That the context is synchronous" },
      ],
      answer: 0,
      explain: {
        es: "isTrue(true) siempre pasa. Como mucho detecta una excepción, pero no comprueba ningún resultado: cubre sin probar.",
        en: "isTrue(true) always passes. At most it catches an exception, but it checks no result: it covers without testing.",
      },
    },
    {
      id: "m10-l03-q2",
      kind: "single",
      prompt: {
        es: "¿En qué orden van los dos primeros argumentos de Assert.areEqual?",
        en: "In which order do Assert.areEqual's first two arguments go?",
      },
      options: [
        { es: "Primero lo esperado, después lo obtenido", en: "First the expected, then the actual" },
        { es: "Primero lo obtenido, después lo esperado", en: "First the actual, then the expected" },
        { es: "Da igual", en: "It does not matter" },
        { es: "Solo recibe uno", en: "It only takes one" },
      ],
      answer: 0,
      explain: {
        es: "Al comparar da igual, pero el mensaje de error dice «Expected: …, Actual: …»: si los inviertes, te mentirá al fallar.",
        en: "For comparing it does not matter, but the error message says «Expected: …, Actual: …»: swap them and it will lie to you when it fails.",
      },
    },
    {
      id: "m10-l03-q3",
      kind: "multi",
      prompt: { es: "¿Qué hace bueno un Assert?", en: "What makes an Assert good?" },
      options: [
        { es: "Compara con un valor que tú sabes que es el correcto", en: "It compares against a value you know is correct" },
        { es: "Lleva un mensaje que explica qué significa el fallo", en: "It carries a message explaining what the failure means" },
        { es: "Fallaría si el código estuviera mal", en: "It would fail if the code were wrong" },
        { es: "Calcula lo esperado con el mismo código que prueba", en: "It computes the expected value with the same code it tests" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Si calculas lo esperado con el mismo código, el test siempre coincide consigo mismo y nunca falla.",
        en: "If you compute the expected value with the same code, the test always matches itself and never fails.",
      },
    },
    {
      id: "m10-l03-q4",
      kind: "text",
      prompt: {
        es: "Escribe la comprobación de que el Boolean result es false, con el mensaje 'Debería ser síncrono'.",
        en: "Write the check that the Boolean result is false, with the message 'Should be synchronous'.",
      },
      accept: [
        "assert\\.isfalse\\(\\s*result\\s*,\\s*'deberia ser sincrono'\\s*\\)\\s*;?",
        "assert\\.isfalse\\(\\s*result\\s*,\\s*'should be synchronous'\\s*\\)\\s*;?",
      ],
      placeholder: { es: "Assert.…", en: "Assert.…" },
      explain: {
        es: "Assert.isFalse(result, 'Debería ser síncrono');",
        en: "Assert.isFalse(result, 'Should be synchronous');",
      },
      tags: ["recall"],
    },
    {
      id: "m10-l03-q5",
      kind: "single",
      prompt: { es: "¿Qué ves en código antiguo en lugar de Assert.areEqual?", en: "What do you see in older code instead of Assert.areEqual?" },
      options: [
        { es: "System.assertEquals", en: "System.assertEquals" },
        { es: "Test.assert", en: "Test.assert" },
        { es: "Assert.equals", en: "Assert.equals" },
        { es: "System.check", en: "System.check" },
      ],
      answer: 0,
      explain: {
        es: "System.assertEquals, System.assert y System.assertNotEquals: la versión antigua de la clase Assert. Siguen funcionando.",
        en: "System.assertEquals, System.assert and System.assertNotEquals: the old version of the Assert class. They still work.",
      },
    },
    {
      id: "m10-l03-q6",
      kind: "single",
      prompt: {
        es: "Repaso: en un test normal (síncrono), ¿qué devuelve Limits.getLimitQueries()?",
        en: "Review: in a normal (synchronous) test, what does Limits.getLimitQueries() return?",
      },
      options: [
        { es: "100", en: "100" },
        { es: "200", en: "200" },
        { es: "Las consultas gastadas", en: "The queries used" },
        { es: "0", en: "0" },
      ],
      answer: 0,
      explain: {
        es: "El test corre en síncrono: tope de 100. Por eso la descripción esperada dice «100 consultas».",
        en: "The test runs synchronously: a ceiling of 100. That is why the expected description says «100 queries».",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M9 L1", en: "Review · M9 L1" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 3 DE 7 · El test de AsyncContext da 100 % de cobertura y no comprueba nada. Reescríbelo con dos casos que fallarían si la clase estuviera mal: que fuera de un trabajo asíncrono isAsync() es false, y que describe() devuelve exactamente la línea síncrona.",
      en: "TASK 3 OF 7 · AsyncContext's test gives 100% coverage and checks nothing. Rewrite it with two cases that would fail if the class were wrong: that outside an async job isAsync() is false, and that describe() returns exactly the synchronous line.",
    },
    brief: [
      {
        es: "@isTest static void isSynchronousOutsideAJob(): Assert.isFalse sobre AsyncContext.isAsync(), con mensaje.",
        en: "@isTest static void isSynchronousOutsideAJob(): Assert.isFalse on AsyncContext.isAsync(), with a message.",
      },
      {
        es: "@isTest static void describesTheSynchronousBudget(): Assert.areEqual('síncrono · 100 consultas · 10000 ms de CPU', AsyncContext.describe(), mensaje).",
        en: "@isTest static void describesTheSynchronousBudget(): Assert.areEqual('synchronous · 100 queries · 10000 ms of CPU', AsyncContext.describe(), message).",
      },
      {
        es: "Fuera el Assert.isTrue(true).",
        en: "Remove the Assert.isTrue(true).",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, a prueba
// Ya resuelto (tareas 1-2): tests de parseAmount y del guardián, con sus datos.
// Tarea 3 de 7: un test que de verdad compruebe algo.

@isTest
private class AsyncContextTest {
    @isTest
    static void describesTheContext() {
        AsyncContext.isAsync();
        AsyncContext.describe();
        Assert.isTrue(true);   // «100 % de cobertura»
    }
}
`,
      en: `// CASE: the ERP bridge, under test
// Already solved (tasks 1-2): tests for parseAmount and the guard, with their data.
// Task 3 of 7: a test that really checks something.

@isTest
private class AsyncContextTest {
    @isTest
    static void describesTheContext() {
        AsyncContext.isAsync();
        AsyncContext.describe();
        Assert.isTrue(true);   // «100% coverage»
    }
}
`,
    },
    hints: [
      {
        es: "Yo me preguntaría lo de la hoja de UAT: para cada método, ¿cuál es el resultado esperado exacto? Si no lo sabes escribir, no lo estás probando.",
        en: "I would ask the UAT-sheet question: for each method, what is the exact expected result? If you cannot write it down, you are not testing it.",
      },
      {
        es: "Lo que me ayudó: el test corre en síncrono, así que isAsync() tiene que dar false y los topes son 100 consultas y 10000 ms. Esos números los escribes tú, a mano: son lo esperado.",
        en: "What helped me: the test runs synchronously, so isAsync() must give false and the ceilings are 100 queries and 10000 ms. You write those numbers by hand: they are the expected.",
      },
      {
        es: "Te dejo el esquema: @isTest static void isSynchronousOutsideAJob() { Assert.isFalse(AsyncContext.isAsync(), '…'); } · @isTest static void describesTheSynchronousBudget() { Assert.areEqual('síncrono · 100 consultas · 10000 ms de CPU', AsyncContext.describe(), '…'); }",
        en: "Here is the outline: @isTest static void isSynchronousOutsideAJob() { Assert.isFalse(AsyncContext.isAsync(), '…'); } · @isTest static void describesTheSynchronousBudget() { Assert.areEqual('synchronous · 100 queries · 10000 ms of CPU', AsyncContext.describe(), '…'); }",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m10-l03-c1",
        label: { es: "Fuera la comprobación que siempre pasa", en: "The always-passing check is gone" },
        rule: { op: "absent", pattern: "Assert\\s*\\.\\s*isTrue\\s*\\(\\s*true\\s*\\)" },
        onFail: {
          es: "Quita Assert.isTrue(true): pasa siempre, diga lo que diga el código.",
          en: "Remove Assert.isTrue(true): it always passes, whatever the code says.",
        },
        otter: {
          es: "Assert.isTrue(true) es un caso de UAT con el resultado esperado en blanco: siempre «pasa». Fuera.",
          en: "Assert.isTrue(true) is a UAT case with a blank expected result: it always «passes». Out.",
        },
      },
      {
        id: "m10-l03-c2",
        label: { es: "isAsync es false fuera de un trabajo", en: "isAsync is false outside a job" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "@isTest\\s+(private\\s+|public\\s+)?static\\s+void\\s+isSynchronousOutsideAJob\\s*\\(\\s*\\)" },
            { op: "match", pattern: "Assert\\s*\\.\\s*isFalse\\s*\\([^;]*,\\s*'[^']+'\\s*\\)" },
            { op: "match", pattern: "AsyncContext\\s*\\.\\s*isAsync\\s*\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "@isTest static void isSynchronousOutsideAJob() { Assert.isFalse(AsyncContext.isAsync(), '…'); }",
          en: "@isTest static void isSynchronousOutsideAJob() { Assert.isFalse(AsyncContext.isAsync(), '…'); }",
        },
        otter: {
          es: "El test corre en síncrono, así que el resultado esperado es false: Assert.isFalse(AsyncContext.isAsync(), '…'), con un mensaje que diga qué significa si falla.",
          en: "The test runs synchronously, so the expected result is false: Assert.isFalse(AsyncContext.isAsync(), '…'), with a message saying what it means if it fails.",
        },
      },
      {
        id: "m10-l03-c3",
        label: { es: "describe devuelve exactamente la línea esperada", en: "describe returns exactly the expected line" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "@isTest\\s+(private\\s+|public\\s+)?static\\s+void\\s+describesTheSynchronousBudget\\s*\\(\\s*\\)" },
            { op: "match", pattern: "Assert\\s*\\.\\s*areEqual\\s*\\(\\s*'(síncrono|synchronous)[^']*100[^']*10000[^']*'\\s*,[^;]*,\\s*'[^']+'\\s*\\)" },
          ],
        },
        onFail: {
          es: "@isTest static void describesTheSynchronousBudget() { Assert.areEqual('síncrono · 100 consultas · 10000 ms de CPU', AsyncContext.describe(), '…'); }",
          en: "@isTest static void describesTheSynchronousBudget() { Assert.areEqual('synchronous · 100 queries · 10000 ms of CPU', AsyncContext.describe(), '…'); }",
        },
        otter: {
          es: "Lo esperado se escribe a mano, entero: 'síncrono · 100 consultas · 10000 ms de CPU'. Primero eso, después describe() y al final el mensaje.",
          en: "The expected is written by hand, in full: 'synchronous · 100 queries · 10000 ms of CPU'. First that, then describe() and finally the message.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Cómo probarías que isAsync() devuelve true dentro de un Queueable? Pista: la lección 4 te da la herramienta.",
        en: "How would you test that isAsync() returns true inside a Queueable? Hint: lesson 4 gives you the tool.",
      },
    ],
    voice: "otter",
    outro: {
      es: "Tus tests ya fallan cuando deben. Pero todo lo que has probado hasta ahora es síncrono, y la mitad del puente no lo es. En la tarea 4 pruebas la migración en Batch, con la herramienta que hace que el asíncrono se ejecute al momento.",
      en: "Your tests now fail when they should. But everything you have tested so far is synchronous, and half the bridge is not. In task 4 you test the Batch migration, with the tool that makes async run right away.",
    },
  },
};
