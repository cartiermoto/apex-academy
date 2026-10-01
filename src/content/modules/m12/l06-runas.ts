import type { Lesson } from "@/lib/types";

const HELPER = `    // Un usuario de prueba con un perfil sin permisos sobre Opportunity
    private static User newIntern() {
        Profile p = [SELECT Id FROM Profile WHERE Name = 'Minimum Access - Salesforce'];
        return new User(
            LastName = 'Becario', Alias = 'becario', Email = 'becario@northwind.example',
            Username = 'becario' + System.currentTimeMillis() + '@northwind.example',
            ProfileId = p.Id, TimeZoneSidKey = 'Europe/Madrid', LocaleSidKey = 'es_ES',
            EmailEncodingKey = 'UTF-8', LanguageLocaleKey = 'es'
        );
    }`;

const SOLUTION_ES = `// CASO: el puente con el ERP, auditado
// Tarea 5 de 6: demostrar con un test que el permiso se respeta.

@isTest
private class RenewalDeskTest {
${HELPER}

    @isTest
    static void internCannotApplyDiscount() {
        Opportunity o = new Opportunity(Name = 'Acme 2026', StageName = 'Prospecting',
            CloseDate = Date.today(), Type = 'Renewal');
        insert o;
        User intern = newIntern();

        Boolean rejected = false;
        // Lo de dentro se ejecuta como el becario
        System.runAs(intern) {
            try {
                RenewalDesk.applyDiscount(o.Id, 10);
            } catch (Exception e) {
                rejected = true;
            }
        }

        // Fuera del bloque vuelve a mandar el usuario del test
        Assert.isTrue(rejected, 'Un becario sin permisos no puede aplicar descuentos');
        Opportunity after = [SELECT Discount__c FROM Opportunity WHERE Id = :o.Id];
        Assert.isNull(after.Discount__c, 'El descuento no tenía que guardarse');
    }
}`;

const STARTER_ES = `// CASO: el puente con el ERP, auditado
// Ya resuelto (tareas 1-4): los cuatro hallazgos, cerrados uno a uno.
// Tarea 5 de 6: demostrar con un test que el permiso se respeta.

@isTest
private class RenewalDeskTest {
${HELPER}

    @isTest
    static void internCannotApplyDiscount() {
        Opportunity o = new Opportunity(Name = 'Acme 2026', StageName = 'Prospecting',
            CloseDate = Date.today(), Type = 'Renewal');
        insert o;
        User intern = newIntern();

        Boolean rejected = false;
        // Este test llama al método como el usuario del test, que puede con todo:
        // no demuestra nada sobre el becario
        try {
            RenewalDesk.applyDiscount(o.Id, 10);
        } catch (Exception e) {
            rejected = true;
        }

        Assert.isTrue(rejected, 'Un becario sin permisos no puede aplicar descuentos');
    }
}
`;

const toEn = (s: string) =>
  s
    .replace("// CASO: el puente con el ERP, auditado", "// CASE: the ERP bridge, audited")
    .replace("// Ya resuelto (tareas 1-4): los cuatro hallazgos, cerrados uno a uno.", "// Already solved (tasks 1-4): the four findings, closed one by one.")
    .replace("// Tarea 5 de 6: demostrar con un test que el permiso se respeta.", "// Task 5 of 6: prove with a test that the permission is respected.")
    .replace("// Un usuario de prueba con un perfil sin permisos sobre Opportunity", "// A test user with a profile that has no permissions on Opportunity")
    .replace("// Lo de dentro se ejecuta como el becario", "// What is inside runs as the intern")
    .replace("// Fuera del bloque vuelve a mandar el usuario del test", "// Outside the block the test's user is back in charge")
    .replace(
      "// Este test llama al método como el usuario del test, que puede con todo:\n        // no demuestra nada sobre el becario",
      "// This test calls the method as the test's user, who can do everything:\n        // it proves nothing about the intern",
    )
    .replace(/'Un becario sin permisos no puede aplicar descuentos'/g, "'An intern without permissions cannot apply discounts'")
    .replace("'El descuento no tenía que guardarse'", "'The discount should not have been saved'");

export const l06RunAs: Lesson = {
  id: "m12-l06",
  slug: "probar-la-seguridad-con-runas",
  n: 5,
  kind: "lesson",
  minutes: 30,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 4", en: "Remember? · Review of lesson 4" },
    prompt: {
      es: "El usuario elige el campo por el que ordenar. ¿Cómo entra en la consulta con seguridad?",
      en: "The user picks the field to sort by. How does it enter the query safely?",
    },
    options: [
      { es: "Solo si está en una lista cerrada escrita por ti", en: "Only if it is on a closed list written by you" },
      { es: "Enlazado con dos puntos", en: "Bound with a colon" },
      { es: "Pegado tal cual", en: "Glued in as is" },
    ],
    answer: 0,
    explain: {
      es: "Un nombre de campo no se puede enlazar. Los cuatro hallazgos están cerrados; hoy lo demuestras.",
      en: "A field name cannot be bound. The four findings are closed; today you prove it.",
    },
  },
  title: { es: "Probar la seguridad con System.runAs", en: "Testing security with System.runAs" },
  summary: {
    es: "Un test se ejecuta como un usuario que puede con casi todo, así que no dice nada sobre lo que pasa con un becario. System.runAs ejecuta un trozo del test como otro usuario, y así el permiso queda demostrado en cada despliegue.",
    en: "A test runs as a user who can do almost everything, so it says nothing about what happens with an intern. System.runAs runs a piece of the test as another user, so the permission is proven on every deployment.",
  },
  analogy: {
    es: "El botón «Login as» de Setup, pero escrito en un test",
    en: "Setup's «Login as» button, but written in a test",
  },
  objectives: [
    { es: "Crear un usuario de prueba con un perfil concreto.", en: "Create a test user with a specific profile." },
    { es: "Ejecutar parte de un test como ese usuario con System.runAs.", en: "Run part of a test as that user with System.runAs." },
    { es: "Saber qué aplica runAs y qué no.", en: "Know what runAs applies and what it does not." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "El auditor vuelve con una pregunta incómoda: «Habéis cerrado los hallazgos. ¿Cómo sé que dentro de seis meses siguen cerrados?». Si alguien quita un «as user» por error, los tests del Módulo 10 seguirán en verde, porque todos se ejecutan como un usuario con permisos de sobra. Hace falta un test que se ponga en la piel del becario.",
        en: "The auditor comes back with an awkward question: «You closed the findings. How do I know they are still closed in six months?». If someone removes an «as user» by mistake, Module 10's tests will stay green, because they all run as a user with permissions to spare. A test that steps into the intern's shoes is needed.",
      },
    },
    {
      type: "h",
      text: { es: "Un bloque que se ejecuta como otra persona", en: "A block that runs as someone else" },
    },
    {
      type: "code",
      code: {
        es: `User intern = newIntern();        // un usuario creado en el test, con su perfil

System.runAs(intern) {
    // aquí dentro, el usuario que ejecuta es el becario
    RenewalDesk.applyDiscount(o.Id, 10);
}
// aquí fuera vuelve a ser el usuario del test`,
        en: `User intern = newIntern();        // a user created in the test, with its profile

System.runAs(intern) {
    // in here, the running user is the intern
    RenewalDesk.applyDiscount(o.Id, 10);
}
// out here it is the test's user again`,
      },
      caption: {
        es: "System.runAs solo existe en los tests. El usuario no hace falta insertarlo: basta con construirlo con sus campos obligatorios y un perfil.",
        en: "System.runAs only exists in tests. The user need not be inserted: building it with its required fields and a profile is enough.",
      },
    },
    {
      type: "h",
      text: { es: "Qué aplica y qué no", en: "What it applies and what it does not" },
    },
    {
      type: "p",
      text: {
        es: "Aquí está la trampa del examen. Dentro del bloque, runAs cambia quién es el usuario: se aplica su sharing, y todo lo que pregunta por sus permisos contesta por él (Schema, WITH USER_MODE, «as user», stripInaccessible). Pero runAs no convierte el código en seguro: una consulta o un guardado en modo sistema siguen sin mirar los permisos de objeto ni de campo, sea quien sea el usuario. Por eso este test es útil: si el código respeta los permisos, el becario es rechazado; si alguien lo deja en modo sistema, el descuento se guarda y el test se pone en rojo.",
        en: "Here is the exam trap. Inside the block, runAs changes who the user is: their sharing applies, and everything that asks about their permissions answers for them (Schema, WITH USER_MODE, «as user», stripInaccessible). But runAs does not make code secure: a query or a save in system mode still ignores object and field permissions, whoever the user is. That is why this test is useful: if the code respects permissions, the intern is rejected; if someone leaves it in system mode, the discount is saved and the test goes red.",
      },
    },
    {
      type: "diagram",
      id: "m12-runas",
      caption: {
        es: "Elige quién ejecuta el test y cómo guarda el código, y mira si el descuento se guarda y de qué color queda el test.",
        en: "Choose who runs the test and how the code saves, and see whether the discount is saved and what colour the test ends up.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque allí se prueba a mano", en: "Why not a Flow? Because there it is tested by hand" },
      text: {
        es: "La idea ya la conoces: en Setup usas «Login as» para ver lo que ve otra persona, y al depurar un flow en una sandbox puedes marcar «Run flow as another user». Es lo mismo que runAs, pero hecho a mano y una vez. La diferencia del test de Apex es que queda escrito y se repite solo en cada despliegue: si alguien abre el agujero, lo sabes antes de llegar a producción.",
        en: "You already know the idea: in Setup you use «Login as» to see what someone else sees, and when debugging a flow in a sandbox you can tick «Run flow as another user». It is the same as runAs, but done by hand and once. The difference with the Apex test is that it stays written and repeats itself on every deployment: if someone opens the hole, you know before reaching production.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿dónde se puede usar System.runAs? ¿Qué pasa con el usuario al salir del bloque? ¿Respeta los permisos de campo un update en modo sistema dentro de runAs?",
        en: "Without looking: where can System.runAs be used? What happens to the user on leaving the block? Does a system-mode update inside runAs respect field permissions?",
      },
    },
  ],

  quiz: [
    {
      id: "m12-l06-q1",
      kind: "single",
      prompt: { es: "¿Dónde se puede usar System.runAs?", en: "Where can System.runAs be used?" },
      options: [
        { es: "Solo en métodos de test", en: "Only in test methods" },
        { es: "En cualquier clase with sharing", en: "In any with sharing class" },
        { es: "En triggers", en: "In triggers" },
        { es: "En Execute Anonymous", en: "In Execute Anonymous" },
      ],
      answer: 0,
      explain: {
        es: "Es una herramienta de pruebas: en código real nadie puede hacerse pasar por otro usuario.",
        en: "It is a testing tool: in real code nobody can pose as another user.",
      },
    },
    {
      id: "m12-l06-q2",
      kind: "single",
      prompt: {
        es: "Dentro de System.runAs(intern), el código hace «update o;» en modo sistema. El becario no puede editar oportunidades. ¿Qué pasa?",
        en: "Inside System.runAs(intern), the code runs «update o;» in system mode. The intern may not edit opportunities. What happens?",
      },
      options: [
        { es: "Se guarda: el modo sistema no mira los permisos de objeto, tampoco dentro de runAs", en: "It is saved: system mode ignores object permissions, inside runAs too" },
        { es: "Falla, porque runAs aplica todos los permisos del usuario", en: "It fails, because runAs applies all the user's permissions" },
        { es: "El test no compila", en: "The test does not compile" },
        { es: "Se guarda, pero solo hasta que termina el bloque", en: "It is saved, but only until the block ends" },
      ],
      answer: 0,
      explain: {
        es: "runAs cambia quién es el usuario, no el modo en que se ejecuta el código. Justo por eso el test detecta el agujero.",
        en: "runAs changes who the user is, not the mode the code runs in. That is exactly why the test detects the hole.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m12-l06-q3",
      kind: "multi",
      prompt: { es: "Dentro de un bloque runAs, ¿qué responde por el usuario indicado?", en: "Inside a runAs block, what answers for the given user?" },
      options: [
        { es: "El sharing de una clase with sharing", en: "The sharing of a with sharing class" },
        { es: "Una consulta WITH USER_MODE", en: "A WITH USER_MODE query" },
        { es: "Schema…isUpdateable()", en: "Schema…isUpdateable()" },
        { es: "Un update en modo sistema", en: "A system-mode update" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Todo lo que pregunta por el usuario contesta por el becario. Lo que no pregunta, sigue sin preguntar.",
        en: "Everything that asks about the user answers for the intern. What does not ask, still does not ask.",
      },
    },
    {
      id: "m12-l06-q4",
      kind: "text",
      prompt: {
        es: "Escribe la línea que abre un bloque que se ejecuta como el usuario de la variable intern.",
        en: "Write the line opening a block that runs as the user in the variable intern.",
      },
      accept: ["system\\.runas\\(\\s*intern\\s*\\)\\s*\\{?"],
      placeholder: { es: "System.…", en: "System.…" },
      explain: { es: "System.runAs(intern) {", en: "System.runAs(intern) {" },
      tags: ["recall"],
    },
    {
      id: "m12-l06-q5",
      kind: "single",
      prompt: {
        es: "¿Por qué el test comprueba, además, que Discount__c sigue vacío?",
        en: "Why does the test also check that Discount__c is still empty?",
      },
      options: [
        { es: "Porque una excepción cualquiera no demuestra que el dato quedó a salvo", en: "Because just any exception does not prove the data stayed safe" },
        { es: "Porque sin dos Assert el test no cuenta para la cobertura", en: "Because without two Asserts the test does not count for coverage" },
        { es: "Porque runAs borra el campo", en: "Because runAs clears the field" },
        { es: "Para que el test tarde menos", en: "So the test takes less time" },
      ],
      answer: 0,
      explain: {
        es: "Lo que importa es el resultado: el descuento no se guardó. El Assert sobre el dato es el que lo dice.",
        en: "What matters is the outcome: the discount was not saved. The Assert on the data is the one that says so.",
      },
    },
    {
      id: "m12-l06-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿ve un test los registros que ya existen en la org?",
        en: "Review: does a test see the records already in the org?",
      },
      options: [
        { es: "No: crea sus propios datos, salvo excepciones como usuarios y perfiles", en: "No: it creates its own data, with exceptions such as users and profiles" },
        { es: "Sí, todos", en: "Yes, all of them" },
        { es: "Solo los del usuario que lanza el test", en: "Only those of the user running the test" },
        { es: "Solo en sandbox", en: "Only in a sandbox" },
      ],
      answer: 0,
      explain: {
        es: "Por eso el test crea su oportunidad, y por eso sí puede consultar el perfil, que es configuración.",
        en: "That is why the test creates its opportunity, and why it can query the profile, which is setup.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M10 L2", en: "Review · M10 L2" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 5 DE 6 · El auditor quiere una prueba que se repita sola. El test de abajo dice comprobar que un becario no puede aplicar descuentos, pero llama al método como el usuario del test, así que no demuestra nada. Haz que la llamada se ejecute como el becario, y comprueba también que el descuento no llegó a guardarse.",
      en: "TASK 5 OF 6 · The auditor wants a proof that repeats itself. The test below claims to check that an intern cannot apply discounts, but it calls the method as the test's user, so it proves nothing. Make the call run as the intern, and also check that the discount was never saved.",
    },
    brief: [
      {
        es: "La llamada a applyDiscount, con su try y su catch, va dentro de un bloque System.runAs(intern).",
        en: "The call to applyDiscount, with its try and catch, goes inside a System.runAs(intern) block.",
      },
      {
        es: "Después del bloque, vuelve a consultar la oportunidad y comprueba con Assert.isNull que Discount__c sigue vacío.",
        en: "After the block, query the opportunity again and check with Assert.isNull that Discount__c is still empty.",
      },
    ],
    starter: { es: STARTER_ES, en: toEn(STARTER_ES) },
    hints: [
      {
        es: "Yo me preguntaría: ¿quién está ejecutando la línea que llama a applyDiscount? Si es alguien que puede con todo, el test no va a fallar nunca, haga lo que haga el código.",
        en: "I would ask: who is running the line that calls applyDiscount? If it is someone who can do everything, the test will never fail, whatever the code does.",
      },
      {
        es: "Lo que me ayudó: System.runAs(intern) { … } envuelve el try entero. Y la comprobación del dato va fuera del bloque, donde el usuario del test sí puede leer el campo.",
        en: "What helped me: System.runAs(intern) { … } wraps the whole try. And the check on the data goes outside the block, where the test's user can read the field.",
      },
      {
        es: "Te dejo el esquema: System.runAs(intern) { try { RenewalDesk.applyDiscount(o.Id, 10); } catch (Exception e) { rejected = true; } } Assert.isTrue(rejected, '…'); Opportunity after = [SELECT Discount__c FROM Opportunity WHERE Id = :o.Id]; Assert.isNull(after.Discount__c, '…');",
        en: "Here is the outline: System.runAs(intern) { try { RenewalDesk.applyDiscount(o.Id, 10); } catch (Exception e) { rejected = true; } } Assert.isTrue(rejected, '…'); Opportunity after = [SELECT Discount__c FROM Opportunity WHERE Id = :o.Id]; Assert.isNull(after.Discount__c, '…');",
      },
    ],
    solution: { es: SOLUTION_ES, en: toEn(SOLUTION_ES) },
    checks: [
      {
        id: "m12-l06-c1",
        label: { es: "La llamada se ejecuta como el becario", en: "The call runs as the intern" },
        rule: {
          op: "match",
          pattern: "System\\s*\\.\\s*runAs\\s*\\(\\s*intern\\s*\\)\\s*\\{\\s*try\\s*\\{\\s*RenewalDesk\\s*\\.\\s*applyDiscount\\s*\\(",
        },
        onFail: {
          es: "System.runAs(intern) { try { RenewalDesk.applyDiscount(o.Id, 10); } catch (Exception e) { rejected = true; } }",
          en: "System.runAs(intern) { try { RenewalDesk.applyDiscount(o.Id, 10); } catch (Exception e) { rejected = true; } }",
        },
        otter: {
          es: "La llamada sigue ejecutándose como el usuario del test. Es como probar un permiso entrando con tu usuario de Admin: no falla nunca. Envuelve el try entero en System.runAs(intern) { … }.",
          en: "The call still runs as the test's user. It is like testing a permission while logged in as your Admin user: it never fails. Wrap the whole try in System.runAs(intern) { … }.",
        },
      },
      {
        id: "m12-l06-c2",
        label: { es: "Comprueba que el descuento no se guardó", en: "It checks the discount was not saved" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "\\[\\s*SELECT\\s+[^\\]]*Discount__c[^\\]]*FROM\\s+Opportunity\\s+WHERE\\s+Id\\s*=\\s*:\\s*o\\.Id\\s*\\]" },
            { op: "match", pattern: "Assert\\s*\\.\\s*isNull\\s*\\(\\s*\\w+\\.Discount__c" },
          ],
        },
        onFail: {
          es: "Opportunity after = [SELECT Discount__c FROM Opportunity WHERE Id = :o.Id]; Assert.isNull(after.Discount__c, '…');",
          en: "Opportunity after = [SELECT Discount__c FROM Opportunity WHERE Id = :o.Id]; Assert.isNull(after.Discount__c, '…');",
        },
        otter: {
          es: "Que saltara una excepción no dice qué pasó con el dato. Después del bloque, vuelve a leer la oportunidad, como cuando abres el registro para ver si la regla de validación de verdad lo frenó, y comprueba con Assert.isNull que Discount__c sigue vacío.",
          en: "An exception being thrown does not say what happened to the data. After the block, read the opportunity again, as when you open the record to see whether the validation rule really stopped it, and check with Assert.isNull that Discount__c is still empty.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué test complementario escribirías para demostrar que un comercial con permisos sí puede aplicar el descuento?",
        en: "Which complementary test would you write to prove that a rep with permissions can apply the discount?",
      },
    ],
    voice: "otter",
    outro: {
      es: "Ahora el permiso no depende de la memoria de nadie: si alguien lo rompe, un test se pone en rojo. Queda la entrega. En la tarea 6, la última del curso, te llega una clase con los cuatro hallazgos a la vez y nadie te dice cuáles son.",
      en: "Now the permission does not depend on anyone's memory: if someone breaks it, a test goes red. The delivery remains. In task 6, the course's last, a class lands on you with all four findings at once and nobody tells you which they are.",
    },
  },
};
