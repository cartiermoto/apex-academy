import type { Lesson } from "@/lib/types";

const ROW_CLASS = `// Ya existe (Módulo 8), en su propio archivo:
public class RenewalRow {
    public static Decimal parseAmount(String raw) {
        if (String.isBlank(raw)) {
            throw new RenewalImportException('Importe vacío');
        }
        Decimal amount;
        try {
            amount = Decimal.valueOf(raw);
        } catch (TypeException e) {
            throw new RenewalImportException('Importe no numérico: ' + raw, e);
        }
        if (amount <= 0) {
            throw new RenewalImportException('Importe no positivo: ' + raw);
        }
        return amount;
    }
}`;

const ROW_CLASS_EN = ROW_CLASS.replace("// Ya existe (Módulo 8), en su propio archivo:", "// Already exists (Module 8), in its own file:")
  .replace("'Importe vacío'", "'Empty amount'")
  .replace("'Importe no numérico: '", "'Non-numeric amount: '")
  .replace("'Importe no positivo: '", "'Non-positive amount: '");

const SOLUTION_ES = `// CASO: el puente con el ERP, a prueba
// Tarea 1 de 7: el primer test, para que el despliegue deje de salir en 0 %.

${ROW_CLASS}

// Tu test, en otro archivo:
@isTest
private class RenewalRowTest {
    @isTest
    static void parsesAValidAmount() {
        Decimal amount = RenewalRow.parseAmount('12500.00');
        Assert.areEqual(12500.00, amount);
    }
}`;

const SOLUTION_EN = SOLUTION_ES.replace(ROW_CLASS, ROW_CLASS_EN)
  .replace(
    "// CASO: el puente con el ERP, a prueba\n// Tarea 1 de 7: el primer test, para que el despliegue deje de salir en 0 %.",
    "// CASE: the ERP bridge, under test\n// Task 1 of 7: the first test, so the deployment stops showing 0%.",
  )
  .replace("// Tu test, en otro archivo:", "// Your test, in another file:");

export const l01IsTest: Lesson = {
  id: "m10-l01",
  slug: "istest",
  n: 1,
  kind: "lesson",
  minutes: 25,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso del Módulo 9", en: "Remember? · Review of Module 9" },
    prompt: {
      es: "¿Qué hace falta en tu org para poder desplegar un trigger o una clase a producción?",
      en: "What does your org need before you can deploy a trigger or a class to production?",
    },
    options: [
      { es: "Tests que cubran al menos el 75 % del código", en: "Tests covering at least 75% of the code" },
      { es: "Nada: se activa como un flow", en: "Nothing: it is activated like a flow" },
      { es: "Que lo apruebe un administrador", en: "An administrator's approval" },
    ],
    answer: 0,
    explain: {
      es: "Lo viste de pasada en el Módulo 6. Hoy toca escribir esos tests.",
      en: "You saw it in passing in Module 6. Today it is time to write those tests.",
    },
  },
  title: { es: "@isTest y la clase de test", en: "@isTest and the test class" },
  summary: {
    es: "Un test es código que ejecuta tu código y comprueba el resultado. Vive en su propia clase, marcada con @isTest, no toca los datos reales y es lo que Salesforce exige antes de dejarte desplegar.",
    en: "A test is code that runs your code and checks the result. It lives in its own class, marked with @isTest, does not touch real data and is what Salesforce demands before letting you deploy.",
  },
  analogy: {
    es: "Las pruebas de aceptación (UAT) antes de pasar a producción",
    en: "User acceptance testing (UAT) before going to production",
  },
  objectives: [
    { es: "Escribir una clase de test con @isTest y un método de test.", en: "Write a test class with @isTest and a test method." },
    { es: "Explicar qué es la cobertura y por qué se exige el 75 %.", en: "Explain what coverage is and why 75% is required." },
    { es: "Ejecutar un test y leer su resultado en tu Developer Org.", en: "Run a test and read its result in your Developer Org." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "El puente con el ERP de los Módulos 8 y 9 funciona en la sandbox. Llega el día de desplegarlo y Salesforce lo rechaza: «Average test coverage across all Apex Classes and Triggers is 0%, at least 75% test coverage is required». Nadie escribió un solo test. Este módulo lo arregla, pieza a pieza.",
        en: "The ERP bridge from Modules 8 and 9 works in the sandbox. Deployment day comes and Salesforce rejects it: «Average test coverage across all Apex Classes and Triggers is 0%, at least 75% test coverage is required». Nobody wrote a single test. This module fixes that, piece by piece.",
      },
    },
    {
      type: "h",
      text: { es: "La forma de un test", en: "The shape of a test" },
    },
    {
      type: "code",
      code: {
        es: `@isTest
private class RenewalRowTest {
    @isTest
    static void parsesAValidAmount() {
        Decimal amount = RenewalRow.parseAmount('12500.00');   // 1 · ejecuta tu código
        Assert.areEqual(12500.00, amount);                     // 2 · comprueba el resultado
    }
}`,
        en: `@isTest
private class RenewalRowTest {
    @isTest
    static void parsesAValidAmount() {
        Decimal amount = RenewalRow.parseAmount('12500.00');   // 1 · run your code
        Assert.areEqual(12500.00, amount);                     // 2 · check the result
    }
}`,
      },
    },
    {
      type: "list",
      items: [
        {
          es: "@isTest encima de la clase: es código de prueba, no se ejecuta en producción ni cuenta para el límite de tamaño de código de la org.",
          en: "@isTest above the class: it is test code, it does not run in production nor count toward the org's code size limit.",
        },
        {
          es: "private: nadie más necesita llamar a un test. Y el nombre suele ser el de la clase probada más Test.",
          en: "private: nobody else needs to call a test. And the name is usually the tested class's plus Test.",
        },
        {
          es: "@isTest encima de cada método static void sin parámetros: cada uno es un caso de prueba, y su nombre dice qué comprueba.",
          en: "@isTest above each static void method with no parameters: each one is a test case, and its name says what it checks.",
        },
      ],
    },
    {
      type: "diagram",
      id: "m10-coverage",
      caption: {
        es: "Añade tests y mira qué líneas de parseAmount se ejecutan y cómo sube la cobertura.",
        en: "Add tests and see which lines of parseAmount run and how coverage goes up.",
      },
    },
    {
      type: "h",
      text: { es: "La cobertura: qué líneas se ejecutaron", en: "Coverage: which lines ran" },
    },
    {
      type: "p",
      text: {
        es: "Al pasar los tests, Salesforce apunta qué líneas de tu código se ejecutaron: eso es la [[cobertura]]. Para desplegar hace falta al menos un 75 % en conjunto, y cada trigger tiene que ejecutarse alguna vez. Pero ojo: la cobertura solo dice qué líneas corrieron, no si hicieron lo correcto. Eso lo dice el Assert, y es la lección 3.",
        en: "When tests run, Salesforce records which lines of your code executed: that is [[cobertura|coverage]]. Deploying needs at least 75% overall, and every trigger has to run at least once. But careful: coverage only says which lines ran, not whether they did the right thing. The Assert says that, and it is lesson 3.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Tu UAT, pero automática", en: "Your UAT, but automatic" },
      text: {
        es: "Antes de pasar un cambio a producción yo hacía pruebas de aceptación: abrir la sandbox, crear un registro, comprobar que el flow hacía lo que tenía que hacer. Un test de Apex es esa prueba escrita una vez y repetida siempre: en cada despliegue, Salesforce vuelve a pasar todos los tests de la org, y si tu cambio rompe algo de otro, lo sabes antes de que llegue a los usuarios.",
        en: "Before moving a change to production I did acceptance testing: open the sandbox, create a record, check the flow did what it should. An Apex test is that test written once and repeated forever: on every deployment, Salesforce runs every test in the org again, and if your change breaks someone else's, you know before it reaches users.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "En tu Developer Org", en: "In your Developer Org" },
      text: {
        es: "Crea la clase de test en la Developer Console y pulsa Run Test, o ve a Setup → Apex Test Execution. Verás cada método en verde o rojo, y en la pestaña Code Coverage de la consola, las líneas cubiertas en azul y las no cubiertas en rojo.",
        en: "Create the test class in the Developer Console and click Run Test, or go to Setup → Apex Test Execution. You will see each method in green or red, and in the console's Code Coverage tab, covered lines in blue and uncovered ones in red.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Flow también tiene tests… opcionales", en: "Why not a Flow? Flow has tests too… optional ones" },
      text: {
        es: "Con franqueza: Flow Builder tiene sus propios tests para flows desencadenados por registro, y conviene usarlos. Pero son opcionales y tienen límites: no cubren caminos asíncronos ni flows de borrado, y solo trabajan con el objeto del flow, sin padres ni hijos. En Apex no es opcional: sin tests no hay despliegue. Por eso un developer escribe el test a la vez que el código.",
        en: "Frankly: Flow Builder has its own tests for record-triggered flows, and they are worth using. But they are optional and limited: they do not cover async paths or delete flows, and they only work with the flow's object, without parents or children. In Apex it is not optional: no tests, no deployment. That is why a developer writes the test along with the code.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿dónde va @isTest y por qué dos veces? ¿Qué cobertura hace falta para desplegar? ¿Qué NO te dice la cobertura?",
        en: "Without looking: where does @isTest go and why twice? What coverage do you need to deploy? What does coverage NOT tell you?",
      },
    },
  ],

  quiz: [
    {
      id: "m10-l01-q1",
      kind: "single",
      prompt: { es: "¿Qué cobertura mínima exige Salesforce para desplegar Apex a producción?", en: "What minimum coverage does Salesforce demand to deploy Apex to production?" },
      options: [
        { es: "75 % en conjunto, y cada trigger ejecutado alguna vez", en: "75% overall, and every trigger run at least once" },
        { es: "100 %", en: "100%" },
        { es: "50 % por clase", en: "50% per class" },
        { es: "Ninguna, si el código compila", en: "None, if the code compiles" },
      ],
      answer: 0,
      explain: {
        es: "75 % de las líneas en conjunto. Es el mínimo para desplegar, no la meta: la meta es que los tests comprueben algo.",
        en: "75% of lines overall. It is the minimum to deploy, not the goal: the goal is tests that check something.",
      },
    },
    {
      id: "m10-l01-q2",
      kind: "single",
      prompt: { es: "¿Qué falla en este test?", en: "What is wrong with this test?" },
      code: {
        es: `@isTest
private class RenewalRowTest {
    static void parsesAValidAmount() {
        Assert.areEqual(10, RenewalRow.parseAmount('10'));
    }
}`,
        en: `@isTest
private class RenewalRowTest {
    static void parsesAValidAmount() {
        Assert.areEqual(10, RenewalRow.parseAmount('10'));
    }
}`,
      },
      options: [
        { es: "Al método le falta @isTest: Salesforce no lo ejecutará como test", en: "The method lacks @isTest: Salesforce will not run it as a test" },
        { es: "La clase no puede ser private", en: "The class cannot be private" },
        { es: "Un test no puede llamar a otra clase", en: "A test cannot call another class" },
        { es: "Nada", en: "Nothing" },
      ],
      answer: 0,
      explain: {
        es: "La clase y cada método de test llevan su @isTest. Sin él, el método es un método normal que nadie llama.",
        en: "The class and each test method carry their @isTest. Without it, the method is a normal method nobody calls.",
      },
      tags: ["find-error"],
    },
    {
      id: "m10-l01-q3",
      kind: "single",
      prompt: {
        es: "Un test ejecuta todas las líneas de una clase pero no comprueba ningún resultado. ¿Qué es cierto?",
        en: "A test runs every line of a class but checks no result. What is true?",
      },
      options: [
        { es: "Da 100 % de cobertura y no demuestra que el código funcione", en: "It gives 100% coverage and proves nothing about the code working" },
        { es: "No cuenta para la cobertura", en: "It does not count toward coverage" },
        { es: "Salesforce lo rechaza al desplegar", en: "Salesforce rejects it on deployment" },
        { es: "Es el test ideal", en: "It is the ideal test" },
      ],
      answer: 0,
      explain: {
        es: "La cobertura mide líneas ejecutadas, no resultados correctos. Por eso cada test necesita su Assert.",
        en: "Coverage measures lines run, not correct results. That is why every test needs its Assert.",
      },
    },
    {
      id: "m10-l01-q4",
      kind: "text",
      prompt: {
        es: "Escribe la anotación que va encima de una clase de test.",
        en: "Write the annotation that goes above a test class.",
      },
      accept: ["@istest"],
      placeholder: { es: "@…", en: "@…" },
      explain: { es: "@isTest, y la misma encima de cada método de test.", en: "@isTest, and the same above every test method." },
      tags: ["recall"],
    },
    {
      id: "m10-l01-q5",
      kind: "multi",
      prompt: { es: "¿Qué es cierto sobre las clases de test?", en: "What is true about test classes?" },
      options: [
        { es: "No cuentan para el límite de tamaño de código de la org", en: "They do not count toward the org's code size limit" },
        { es: "Salesforce las vuelve a ejecutar en cada despliegue a producción", en: "Salesforce runs them again on every deployment to production" },
        { es: "Sus métodos de test son static void y sin parámetros", en: "Their test methods are static void with no parameters" },
        { es: "Se ejecutan cada vez que un usuario guarda un registro", en: "They run every time a user saves a record" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Los tests solo corren cuando alguien los lanza o al desplegar; nunca en el día a día de los usuarios.",
        en: "Tests only run when someone launches them or on deployment; never in users' day-to-day work.",
      },
    },
    {
      id: "m10-l01-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿qué lanza RenewalRow.parseAmount('') según la tarea 4 del Módulo 8?",
        en: "Review: what does RenewalRow.parseAmount('') throw, per Module 8's task 4?",
      },
      options: [
        { es: "Una RenewalImportException", en: "A RenewalImportException" },
        { es: "Una TypeException", en: "A TypeException" },
        { es: "Devuelve 0", en: "It returns 0" },
        { es: "Devuelve null", en: "It returns null" },
      ],
      answer: 0,
      explain: {
        es: "String.isBlank('') es true, así que lanza tu excepción. Probar ese camino es la lección 5.",
        en: "String.isBlank('') is true, so it throws your exception. Testing that path is lesson 5.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M8 L4", en: "Review · M8 L4" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 1 DE 7 · El despliegue del puente con el ERP sale en 0 %. Empieza por la pieza más sencilla, RenewalRow.parseAmount: escribe su clase de test con un primer caso que compruebe que un importe válido se convierte bien.",
      en: "TASK 1 OF 7 · The ERP bridge deployment shows 0%. Start with the simplest piece, RenewalRow.parseAmount: write its test class with a first case checking that a valid amount converts correctly.",
    },
    brief: [
      {
        es: "Una clase private RenewalRowTest, marcada con @isTest.",
        en: "A private RenewalRowTest class, marked with @isTest.",
      },
      {
        es: "Un método @isTest static void parsesAValidAmount().",
        en: "An @isTest static void parsesAValidAmount() method.",
      },
      {
        es: "Dentro: llama a RenewalRow.parseAmount('12500.00') y comprueba con Assert.areEqual que devuelve 12500.00.",
        en: "Inside: call RenewalRow.parseAmount('12500.00') and check with Assert.areEqual that it returns 12500.00.",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, a prueba
// Ya resuelto (Módulos 8 y 9): el puente funciona… y el despliegue sale en 0 %.
// Tarea 1 de 7: el primer test, para que el despliegue deje de salir en 0 %.

${ROW_CLASS}

// Tu test, en otro archivo:
`,
      en: `// CASE: the ERP bridge, under test
// Already solved (Modules 8 and 9): the bridge works… and the deployment shows 0%.
// Task 1 of 7: the first test, so the deployment stops showing 0%.

${ROW_CLASS_EN}

// Your test, in another file:
`,
    },
    hints: [
      {
        es: "Yo lo pensaría como una prueba de UAT escrita: ¿qué dato meto (la entrada), qué acción lanzo (la llamada) y qué espero ver (el resultado)?",
        en: "I would think of it as a written UAT test: what data do I enter (the input), what action do I trigger (the call) and what do I expect to see (the result)?",
      },
      {
        es: "Lo que me ayudó: @isTest va dos veces, encima de la clase y encima del método. Y Assert.areEqual recibe primero lo que esperas y después lo que salió.",
        en: "What helped me: @isTest goes twice, above the class and above the method. And Assert.areEqual takes first what you expect and then what came out.",
      },
      {
        es: "Te dejo el esquema: @isTest private class RenewalRowTest { @isTest static void parsesAValidAmount() { Decimal amount = RenewalRow.parseAmount('12500.00'); Assert.areEqual(12500.00, amount); } }",
        en: "Here is the outline: @isTest private class RenewalRowTest { @isTest static void parsesAValidAmount() { Decimal amount = RenewalRow.parseAmount('12500.00'); Assert.areEqual(12500.00, amount); } }",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m10-l01-c1",
        label: { es: "La clase de test lleva @isTest", en: "The test class carries @isTest" },
        rule: { op: "match", pattern: "@isTest\\s+(private\\s+)?class\\s+RenewalRowTest\\b" },
        onFail: {
          es: "@isTest encima de la clase: @isTest private class RenewalRowTest { … }",
          en: "@isTest above the class: @isTest private class RenewalRowTest { … }",
        },
        otter: {
          es: "Primero dile a Salesforce que esto es código de prueba: @isTest justo encima de private class RenewalRowTest.",
          en: "First tell Salesforce this is test code: @isTest right above private class RenewalRowTest.",
        },
      },
      {
        id: "m10-l01-c2",
        label: { es: "Un método de test con su @isTest", en: "A test method with its @isTest" },
        rule: { op: "match", pattern: "@isTest\\s+(public\\s+|private\\s+)?static\\s+void\\s+parsesAValidAmount\\s*\\(\\s*\\)" },
        onFail: {
          es: "Dentro de la clase: @isTest static void parsesAValidAmount() { … }",
          en: "Inside the class: @isTest static void parsesAValidAmount() { … }",
        },
        otter: {
          es: "Cada caso de prueba es un método @isTest static void sin parámetros, con un nombre que diga qué comprueba: parsesAValidAmount().",
          en: "Each test case is an @isTest static void method with no parameters, with a name that says what it checks: parsesAValidAmount().",
        },
      },
      {
        id: "m10-l01-c3",
        label: { es: "Ejecuta parseAmount y comprueba el resultado", en: "Runs parseAmount and checks the result" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "RenewalRow\\s*\\.\\s*parseAmount\\s*\\(\\s*'12500(\\.00)?'\\s*\\)" },
            { op: "match", pattern: "Assert\\s*\\.\\s*areEqual\\s*\\(\\s*12500(\\.00?)?\\s*,\\s*\\w+" },
          ],
        },
        onFail: {
          es: "Decimal amount = RenewalRow.parseAmount('12500.00'); y después Assert.areEqual(12500.00, amount);",
          en: "Decimal amount = RenewalRow.parseAmount('12500.00'); and then Assert.areEqual(12500.00, amount);",
        },
        otter: {
          es: "La prueba de UAT en dos líneas: ejecuta RenewalRow.parseAmount('12500.00') y comprueba con Assert.areEqual(12500.00, amount) que salió lo esperado. Primero lo esperado, después lo que salió.",
          en: "The UAT test in two lines: run RenewalRow.parseAmount('12500.00') and check with Assert.areEqual(12500.00, amount) that the expected came out. Expected first, then what came out.",
        },
      },
    ],
    rubric: [
      {
        es: "Con este test, ¿qué líneas de parseAmount se ejecutan y cuáles no? ¿Qué casos harían falta para cubrirlas todas?",
        en: "With this test, which lines of parseAmount run and which do not? Which cases would be needed to cover them all?",
      },
    ],
    voice: "otter",
    outro: {
      es: "Tu primer test pasa en verde. Pero parseAmount no toca la base de datos, y el resto del puente sí. En la tarea 2 aprendes a fabricar los datos que necesita un test, porque los tests no ven los de la org.",
      en: "Your first test passes green. But parseAmount does not touch the database, and the rest of the bridge does. In task 2 you learn to build the data a test needs, because tests do not see the org's data.",
    },
  },
};
