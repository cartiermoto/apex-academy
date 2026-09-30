import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, a prueba
// Tarea 2 de 7: los datos del test del guardián de renovaciones.

@isTest
private class RenewalGuardTest {
    @testSetup
    static void setup() {
        List<Account> accounts = new List<Account>{
            new Account(Name = 'Acme'),
            new Account(Name = 'Globex')
        };
        insert accounts;

        // Acme ya tiene una renovación abierta; Globex, ninguna
        insert new Opportunity(
            Name = 'Acme · Renovación', AccountId = accounts[0].Id, Type = 'Renewal',
            StageName = 'Prospecting', CloseDate = Date.today().addDays(30), Amount = 5000
        );
    }

    @isTest
    static void allowsTheFirstRenewal() {
        Account globex = [SELECT Id FROM Account WHERE Name = 'Globex' LIMIT 1];
        Opportunity renewal = new Opportunity(
            Name = 'Globex · Renovación', AccountId = globex.Id, Type = 'Renewal',
            StageName = 'Prospecting', CloseDate = Date.today().addDays(30), Amount = 8000
        );
        insert renewal;
        Assert.isNotNull(renewal.Id, 'La primera renovación de Globex tenía que guardarse');
    }
}`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, a prueba\n// Tarea 2 de 7: los datos del test del guardián de renovaciones.",
  "// CASE: the ERP bridge, under test\n// Task 2 of 7: the data for the renewal guard's test.",
)
  .replace("// Acme ya tiene una renovación abierta; Globex, ninguna", "// Acme already has an open renewal; Globex, none")
  .replace("'Acme · Renovación'", "'Acme · Renewal'")
  .replace("'Globex · Renovación'", "'Globex · Renewal'")
  .replace("'La primera renovación de Globex tenía que guardarse'", "'The first Globex renewal should have been saved'");

export const l02DatosTestSetup: Lesson = {
  id: "m10-l02",
  slug: "datos-de-prueba",
  n: 2,
  kind: "lesson",
  minutes: 25,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 1", en: "Remember? · Review of lesson 1" },
    prompt: { es: "¿Dónde va la anotación @isTest?", en: "Where does the @isTest annotation go?" },
    options: [
      { es: "Encima de la clase y encima de cada método de test", en: "Above the class and above each test method" },
      { es: "Solo encima de la clase", en: "Only above the class" },
      { es: "Solo encima del primer método", en: "Only above the first method" },
    ],
    answer: 0,
    explain: {
      es: "Dos veces. Hoy añades una tercera anotación: la que prepara los datos para todos los métodos.",
      en: "Twice. Today you add a third annotation: the one that prepares the data for every method.",
    },
  },
  title: { es: "Datos de prueba y @testSetup", en: "Test data and @testSetup" },
  summary: {
    es: "Un test no ve los datos de la org: empieza con la base de datos vacía y fabrica lo que necesita. @testSetup prepara esos datos una vez para todos los métodos de la clase, y todo se deshace al terminar.",
    en: "A test does not see the org's data: it starts with an empty database and builds what it needs. @testSetup prepares that data once for every method in the class, and everything is rolled back at the end.",
  },
  analogy: {
    es: "Una sandbox recién creada, sin datos, donde cargas solo lo que tu prueba necesita",
    en: "A freshly created sandbox, with no data, where you load only what your test needs",
  },
  objectives: [
    { es: "Explicar por qué un test no ve los datos de la org.", en: "Explain why a test does not see the org's data." },
    { es: "Preparar datos con @testSetup y recuperarlos con una consulta.", en: "Prepare data with @testSetup and get it back with a query." },
    { es: "Saber qué pasa con los datos de un test cuando termina.", en: "Know what happens to a test's data when it finishes." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "La siguiente pieza del puente es el guardián de renovaciones del Módulo 8: un trigger que rechaza una segunda renovación abierta para la misma cuenta. Para probarlo hacen falta cuentas y oportunidades. Pero las de tu org no sirven, y no por prudencia: el test ni siquiera las ve.",
        en: "The next piece of the bridge is Module 8's renewal guard: a trigger that rejects a second open renewal for the same account. Testing it needs accounts and opportunities. But your org's will not do, and not out of caution: the test does not even see them.",
      },
    },
    {
      type: "h",
      text: { es: "Cada test empieza con la base de datos vacía", en: "Every test starts with an empty database" },
    },
    {
      type: "p",
      text: {
        es: "Por defecto, un test no ve los registros de la org: una consulta a Account devuelve cero filas. Es a propósito. Si el test dependiera de datos reales, pasaría en una sandbox y fallaría en otra, o el día que alguien borrara «la cuenta de pruebas». Así que cada test fabrica lo que necesita, y al terminar Salesforce deshace todo lo que el test insertó: nada llega a guardarse.",
        en: "By default, a test does not see the org's records: a query on Account returns zero rows. That is on purpose. If the test depended on real data, it would pass in one sandbox and fail in another, or the day someone deleted «the test account». So each test builds what it needs, and when it ends Salesforce rolls back everything the test inserted: nothing ever gets saved.",
      },
    },
    {
      type: "h",
      text: { es: "@testSetup: los datos, una vez para todos", en: "@testSetup: the data, once for all" },
    },
    {
      type: "code",
      code: {
        es: `@testSetup
static void setup() {
    insert new List<Account>{ new Account(Name = 'Acme'), new Account(Name = 'Globex') };
}

@isTest
static void allowsTheFirstRenewal() {
    Account globex = [SELECT Id FROM Account WHERE Name = 'Globex' LIMIT 1];   // se recupera
    // …
}`,
        en: `@testSetup
static void setup() {
    insert new List<Account>{ new Account(Name = 'Acme'), new Account(Name = 'Globex') };
}

@isTest
static void allowsTheFirstRenewal() {
    Account globex = [SELECT Id FROM Account WHERE Name = 'Globex' LIMIT 1];   // fetched back
    // …
}`,
      },
      caption: {
        es: "El método @testSetup se ejecuta una vez antes de los tests de la clase. Cada test recibe esos datos tal como los dejó el setup: lo que cambie un test no lo ve el siguiente.",
        en: "The @testSetup method runs once before the class's tests. Each test gets that data as the setup left it: what one test changes, the next does not see.",
      },
    },
    {
      type: "p",
      text: {
        es: "Las variables del setup no llegan a los tests; los registros sí. Por eso cada test los recupera con una consulta, por nombre o por algún campo que los identifique. Y como el setup es código normal, sigue las reglas de siempre: un insert por lista, no uno por registro.",
        en: "The setup's variables do not reach the tests; the records do. That is why each test fetches them with a query, by name or by some field that identifies them. And since the setup is normal code, it follows the usual rules: one insert per list, not one per record.",
      },
    },
    {
      type: "diagram",
      id: "m10-test-data",
      caption: {
        es: "Ejecuta los tests de la clase y mira qué datos ve cada uno: los de la org, los del setup y los que cambió el test anterior.",
        en: "Run the class's tests and see which data each one sees: the org's, the setup's and the ones the previous test changed.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "SeeAllData=true: casi nunca", en: "SeeAllData=true: almost never" },
      text: {
        es: "Existe @isTest(SeeAllData=true) para que un test vea los datos de la org, y es una trampa: el test pasa hoy y falla mañana porque alguien cambió un registro. Salvo casos muy concretos, fabrica tus datos.",
        en: "@isTest(SeeAllData=true) exists so a test can see the org's data, and it is a trap: the test passes today and fails tomorrow because someone changed a record. Except in very specific cases, build your own data.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque sus tests no ven al padre", en: "Why not a Flow? Because its tests do not see the parent" },
      text: {
        es: "En un test de Flow también defines el registro de prueba campo a campo. El límite es que solo trabaja con el objeto del flow: no puedes preparar la cuenta y una renovación que ya existía. Y el guardián depende justo de eso, de otras oportunidades de la misma cuenta. Con @testSetup preparas el escenario completo: cuentas, oportunidades y lo que haga falta.",
        en: "In a Flow test you also define the test record field by field. The limit is that it only works with the flow's object: you cannot prepare the account and a renewal that already existed. And the guard depends on exactly that, on other opportunities of the same account. With @testSetup you prepare the full scenario: accounts, opportunities and whatever is needed.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué devuelve una consulta a Account en un test sin datos preparados? ¿Cuántas veces se ejecuta un método @testSetup? ¿Cómo recupera un test los registros del setup?",
        en: "Without looking: what does an Account query return in a test with no data prepared? How many times does an @testSetup method run? How does a test get the setup's records back?",
      },
    },
  ],

  quiz: [
    {
      id: "m10-l02-q1",
      kind: "single",
      prompt: {
        es: "Tu org tiene 5.000 cuentas. En un test sin datos preparados, ¿qué devuelve [SELECT COUNT() FROM Account]?",
        en: "Your org has 5,000 accounts. In a test with no data prepared, what does [SELECT COUNT() FROM Account] return?",
      },
      options: [
        { es: "0", en: "0" },
        { es: "5.000", en: "5,000" },
        { es: "Salta una excepción", en: "An exception is thrown" },
        { es: "Depende de la sandbox", en: "It depends on the sandbox" },
      ],
      answer: 0,
      explain: {
        es: "Los tests no ven los datos de la org salvo con SeeAllData=true. Empiezan en blanco.",
        en: "Tests do not see the org's data unless SeeAllData=true. They start blank.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m10-l02-q2",
      kind: "single",
      prompt: {
        es: "El test A cambia el nombre de Acme a 'Acme Corp'. Después se ejecuta el test B de la misma clase. ¿Qué nombre ve B?",
        en: "Test A renames Acme to 'Acme Corp'. Then test B in the same class runs. Which name does B see?",
      },
      options: [
        { es: "'Acme', como lo dejó el setup", en: "'Acme', as the setup left it" },
        { es: "'Acme Corp'", en: "'Acme Corp'" },
        { es: "Ninguno: la cuenta ya no existe", en: "None: the account no longer exists" },
        { es: "Depende del orden de los tests", en: "It depends on the tests' order" },
      ],
      answer: 0,
      explain: {
        es: "Cada test recibe los datos del setup intactos. Lo que un test cambia se deshace al terminar.",
        en: "Each test gets the setup's data intact. What one test changes is rolled back when it ends.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m10-l02-q3",
      kind: "single",
      prompt: {
        es: "En el setup guardas la cuenta en una variable static Account acme. ¿Puedes usar acme dentro de los tests?",
        en: "In the setup you store the account in a static Account acme variable. Can you use acme inside the tests?",
      },
      options: [
        { es: "No: las variables del setup no llegan; se recupera con una consulta", en: "No: the setup's variables do not carry over; you fetch it with a query" },
        { es: "Sí, por ser static", en: "Yes, since it is static" },
        { es: "Sí, pero solo en el primer test", en: "Yes, but only in the first test" },
        { es: "Solo si la clase es public", en: "Only if the class is public" },
      ],
      answer: 0,
      explain: {
        es: "Del setup a los tests viajan los registros, no las variables. Por eso el patrón es [SELECT … WHERE Name = 'Acme' LIMIT 1].",
        en: "From the setup to the tests the records travel, not the variables. That is why the pattern is [SELECT … WHERE Name = 'Acme' LIMIT 1].",
      },
    },
    {
      id: "m10-l02-q4",
      kind: "text",
      prompt: {
        es: "Escribe la anotación que marca el método que prepara los datos de todos los tests de la clase.",
        en: "Write the annotation that marks the method preparing data for every test in the class.",
      },
      accept: ["@testsetup"],
      placeholder: { es: "@…", en: "@…" },
      explain: { es: "@testSetup, encima de un static void setup().", en: "@testSetup, above a static void setup()." },
      tags: ["recall"],
    },
    {
      id: "m10-l02-q5",
      kind: "single",
      prompt: { es: "¿Por qué evitar @isTest(SeeAllData=true)?", en: "Why avoid @isTest(SeeAllData=true)?" },
      options: [
        {
          es: "Porque el test depende de datos que pueden cambiar: pasa hoy y falla mañana",
          en: "Because the test depends on data that can change: it passes today and fails tomorrow",
        },
        { es: "Porque borra los datos de la org", en: "Because it deletes the org's data" },
        { es: "Porque no cuenta para la cobertura", en: "Because it does not count toward coverage" },
        { es: "Porque no compila en producción", en: "Because it does not compile in production" },
      ],
      answer: 0,
      explain: {
        es: "No borra nada, pero ata el test a datos que no controlas. Un test fiable fabrica los suyos.",
        en: "It deletes nothing, but it ties the test to data you do not control. A reliable test builds its own.",
      },
    },
    {
      id: "m10-l02-q6",
      kind: "single",
      prompt: {
        es: "Repaso: en el setup necesitas 200 cuentas. ¿Cómo las insertas?",
        en: "Review: in the setup you need 200 accounts. How do you insert them?",
      },
      options: [
        { es: "Las añades a una lista en un bucle y haces un solo insert", en: "Add them to a list in a loop and do a single insert" },
        { es: "Un insert dentro del bucle, uno por cuenta", en: "An insert inside the loop, one per account" },
        { es: "No hace falta: el test ya tiene cuentas", en: "No need: the test already has accounts" },
        { es: "Con Database.insert(cuentas, false) obligatoriamente", en: "With Database.insert(accounts, false), mandatorily" },
      ],
      answer: 0,
      explain: {
        es: "Los tests tienen los mismos límites: 200 inserts en un bucle revientan en el DML 151.",
        en: "Tests have the same limits: 200 inserts in a loop blow up at DML 151.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M4 L3", en: "Review · M4 L3" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 2 DE 7 · Para probar el guardián de renovaciones hacen falta cuentas y renovaciones, y el test no ve las de la org. Prepara el escenario con @testSetup y escribe el primer caso: Globex, que no tiene renovaciones abiertas, puede guardar la suya.",
      en: "TASK 2 OF 7 · Testing the renewal guard needs accounts and renewals, and the test does not see the org's. Prepare the scenario with @testSetup and write the first case: Globex, which has no open renewals, can save its own.",
    },
    brief: [
      {
        es: "@testSetup static void setup(): inserta Acme y Globex en una sola lista, y una renovación abierta para Acme (Type 'Renewal', StageName 'Prospecting', CloseDate y Amount).",
        en: "@testSetup static void setup(): insert Acme and Globex in a single list, and one open renewal for Acme (Type 'Renewal', StageName 'Prospecting', CloseDate and Amount).",
      },
      {
        es: "@isTest static void allowsTheFirstRenewal(): recupera Globex con una consulta por nombre, inserta una renovación para ella y comprueba con Assert.isNotNull que tiene Id.",
        en: "@isTest static void allowsTheFirstRenewal(): fetch Globex with a query by name, insert a renewal for it and check with Assert.isNotNull that it has an Id.",
      },
      {
        es: "Sin SeeAllData: todos los datos los fabrica el test.",
        en: "No SeeAllData: the test builds all its data.",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, a prueba
// Ya resuelto (tarea 1): RenewalRowTest comprueba parseAmount.
// Tarea 2 de 7: los datos del test del guardián de renovaciones.

@isTest(SeeAllData=true)
private class RenewalGuardTest {
    @isTest
    static void allowsTheFirstRenewal() {
        // Usa una cuenta real de la org: "seguro que Globex existe"
        Account globex = [SELECT Id FROM Account WHERE Name = 'Globex' LIMIT 1];
    }
}
`,
      en: `// CASE: the ERP bridge, under test
// Already solved (task 1): RenewalRowTest checks parseAmount.
// Task 2 of 7: the data for the renewal guard's test.

@isTest(SeeAllData=true)
private class RenewalGuardTest {
    @isTest
    static void allowsTheFirstRenewal() {
        // Uses a real org account: "Globex surely exists"
        Account globex = [SELECT Id FROM Account WHERE Name = 'Globex' LIMIT 1];
    }
}
`,
    },
    hints: [
      {
        es: "Yo lo pensaría como preparar una sandbox vacía antes de una demo: ¿qué registros tienen que existir para que la prueba cuente algo? Una cuenta que ya tiene renovación y otra que no.",
        en: "I would think of it as preparing an empty sandbox before a demo: which records must exist for the test to mean something? An account that already has a renewal and one that does not.",
      },
      {
        es: "Lo que me ayudó: el setup inserta; el test consulta. Las cuentas van en una lista con un solo insert, y la renovación de Acme usa accounts[0].Id, que ya existe después del insert.",
        en: "What helped me: the setup inserts; the test queries. The accounts go in a list with a single insert, and Acme's renewal uses accounts[0].Id, which exists after the insert.",
      },
      {
        es: "Te dejo el esquema: @isTest private class RenewalGuardTest { @testSetup static void setup() { List<Account> accounts = …Acme, Globex…; insert accounts; insert new Opportunity(… AccountId = accounts[0].Id, Type = 'Renewal' …); } @isTest static void allowsTheFirstRenewal() { Account globex = [SELECT …]; Opportunity renewal = new Opportunity(…); insert renewal; Assert.isNotNull(renewal.Id, '…'); } }",
        en: "Here is the outline: @isTest private class RenewalGuardTest { @testSetup static void setup() { List<Account> accounts = …Acme, Globex…; insert accounts; insert new Opportunity(… AccountId = accounts[0].Id, Type = 'Renewal' …); } @isTest static void allowsTheFirstRenewal() { Account globex = [SELECT …]; Opportunity renewal = new Opportunity(…); insert renewal; Assert.isNotNull(renewal.Id, '…'); } }",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m10-l02-c1",
        label: { es: "Sin SeeAllData: el test fabrica sus datos", en: "No SeeAllData: the test builds its data" },
        rule: { op: "absent", pattern: "SeeAllData\\s*=\\s*true" },
        onFail: {
          es: "Quita SeeAllData=true: la clase queda como @isTest private class RenewalGuardTest.",
          en: "Remove SeeAllData=true: the class becomes @isTest private class RenewalGuardTest.",
        },
        otter: {
          es: "«Seguro que Globex existe» es como una demo que depende de que nadie haya tocado la sandbox. Quita SeeAllData=true y fabrica los datos.",
          en: "«Globex surely exists» is like a demo that depends on nobody touching the sandbox. Remove SeeAllData=true and build the data.",
        },
      },
      {
        id: "m10-l02-c2",
        label: { es: "Un @testSetup con las cuentas en un solo insert", en: "An @testSetup with the accounts in a single insert" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "@testSetup\\s+(private\\s+|public\\s+)?static\\s+void\\s+\\w+\\s*\\(\\s*\\)" },
            { op: "match", pattern: "Name\\s*=\\s*'Acme'[\\s\\S]*Name\\s*=\\s*'Globex'|Name\\s*=\\s*'Globex'[\\s\\S]*Name\\s*=\\s*'Acme'" },
            { op: "match", pattern: "insert\\s+\\w+\\s*;" },
            { op: "absent", pattern: "for\\s*\\([^)]*\\)\\s*\\{[^{}]*\\binsert\\b" },
          ],
        },
        onFail: {
          es: "@testSetup static void setup() { List<Account> accounts = new List<Account>{ new Account(Name = 'Acme'), new Account(Name = 'Globex') }; insert accounts; … }",
          en: "@testSetup static void setup() { List<Account> accounts = new List<Account>{ new Account(Name = 'Acme'), new Account(Name = 'Globex') }; insert accounts; … }",
        },
        otter: {
          es: "La sandbox vacía se prepara una vez: @testSetup static void setup(), con Acme y Globex en una lista y un solo insert.",
          en: "The empty sandbox is prepared once: @testSetup static void setup(), with Acme and Globex in a list and a single insert.",
        },
      },
      {
        id: "m10-l02-c3",
        label: { es: "Acme ya tiene una renovación abierta", en: "Acme already has an open renewal" },
        rule: {
          op: "match",
          pattern: "new\\s+Opportunity\\s*\\([^;]*AccountId\\s*=\\s*\\w+\\s*\\[\\s*0\\s*\\]\\s*\\.\\s*Id[^;]*Type\\s*=\\s*'Renewal'|new\\s+Opportunity\\s*\\([^;]*Type\\s*=\\s*'Renewal'[^;]*AccountId\\s*=\\s*\\w+\\s*\\[\\s*0\\s*\\]\\s*\\.\\s*Id",
        },
        onFail: {
          es: "En el setup, después del insert de cuentas: insert new Opportunity(… AccountId = accounts[0].Id, Type = 'Renewal', StageName = 'Prospecting', CloseDate = …, Amount = …);",
          en: "In the setup, after the accounts insert: insert new Opportunity(… AccountId = accounts[0].Id, Type = 'Renewal', StageName = 'Prospecting', CloseDate = …, Amount = …);",
        },
        otter: {
          es: "El escenario del guardián necesita una cuenta que ya tiene renovación: Acme. Tras el insert, accounts[0].Id ya existe; úsalo en una Opportunity con Type = 'Renewal'.",
          en: "The guard's scenario needs an account that already has a renewal: Acme. After the insert, accounts[0].Id exists; use it in an Opportunity with Type = 'Renewal'.",
        },
      },
      {
        id: "m10-l02-c4",
        label: { es: "El test recupera Globex, inserta y comprueba", en: "The test fetches Globex, inserts and checks" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "@isTest\\s+(private\\s+|public\\s+)?static\\s+void\\s+allowsTheFirstRenewal\\s*\\(\\s*\\)" },
            { op: "match", pattern: "FROM\\s+Account\\s+WHERE\\s+Name\\s*=\\s*'Globex'" },
            { op: "match", pattern: "Assert\\s*\\.\\s*isNotNull\\s*\\(\\s*\\w+\\s*\\.\\s*Id" },
          ],
        },
        onFail: {
          es: "En allowsTheFirstRenewal: Account globex = [SELECT Id FROM Account WHERE Name = 'Globex' LIMIT 1]; inserta la renovación y Assert.isNotNull(renewal.Id, '…');",
          en: "In allowsTheFirstRenewal: Account globex = [SELECT Id FROM Account WHERE Name = 'Globex' LIMIT 1]; insert the renewal and Assert.isNotNull(renewal.Id, '…');",
        },
        otter: {
          es: "Del setup al test viajan los registros, no las variables: recupera Globex con una consulta por nombre, inserta su renovación y comprueba con Assert.isNotNull(renewal.Id) que se guardó.",
          en: "From the setup to the test the records travel, not the variables: fetch Globex with a query by name, insert its renewal and check with Assert.isNotNull(renewal.Id) that it was saved.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué pasaría con este test si alguien desactiva el guardián? ¿Seguiría en verde? ¿Qué caso faltaría para detectarlo?",
        en: "What would happen to this test if someone deactivates the guard? Would it stay green? Which case would be missing to catch it?",
      },
    ],
    voice: "otter",
    outro: {
      es: "Ya fabricas tus propios datos y el test no depende de nadie. Pero un test solo vale lo que valen sus comprobaciones. En la tarea 3 revisas uno que da 100 % de cobertura… y no comprueba nada.",
      en: "You now build your own data and the test depends on nobody. But a test is only worth its checks. In task 3 you review one that gives 100% coverage… and checks nothing.",
    },
  },
};
