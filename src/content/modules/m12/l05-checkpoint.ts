import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, auditado
// Tarea 5 de 5: la entrega. La clase de la pantalla de renovaciones, lista para producción.

public with sharing class RenewalDeskController {
    public static List<Opportunity> search(String term) {
        String likeTerm = '%' + term + '%';
        // Consulta entre corchetes y con el valor enlazado: no se puede inyectar
        List<Opportunity> rows = [
            SELECT Id, Name, Amount, Margin__c
            FROM Opportunity
            WHERE Type = 'Renewal' AND Account.Name LIKE :likeTerm
            WITH SYSTEM_MODE
        ];
        // El margen solo llega a quien puede verlo
        SObjectAccessDecision decision = Security.stripInaccessible(AccessType.READABLE, rows);
        return (List<Opportunity>) decision.getRecords();
    }

    public static void close(Id oppId) {
        // Leer y guardar con los permisos de quien pulsa el botón
        Opportunity o = [SELECT Id, StageName FROM Opportunity WHERE Id = :oppId WITH USER_MODE];
        o.StageName = 'Closed Won';
        update as user o;
    }
}`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, auditado\n// Tarea 5 de 5: la entrega. La clase de la pantalla de renovaciones, lista para producción.",
  "// CASE: the ERP bridge, audited\n// Task 5 of 5: the delivery. The renewals screen's class, production-ready.",
)
  .replace("// Consulta entre corchetes y con el valor enlazado: no se puede inyectar", "// A query in square brackets with the value bound: it cannot be injected")
  .replace("// El margen solo llega a quien puede verlo", "// The margin only reaches those who may see it")
  .replace("// Leer y guardar con los permisos de quien pulsa el botón", "// Read and save with the permissions of whoever clicks the button");

const STARTER_ES = `// CASO: el puente con el ERP, auditado
// Ya resuelto (tareas 1-4): cada hallazgo, por separado.
// Tarea 5 de 5: la entrega. La clase de la pantalla de renovaciones, lista para producción.

// El informe del auditor señala cuatro hallazgos en esta clase. Encuéntralos y ciérralos.
public class RenewalDeskController {
    public static List<Opportunity> search(String term) {
        String soql = 'SELECT Id, Name, Amount, Margin__c FROM Opportunity ' +
            'WHERE Type = \\'Renewal\\' AND Account.Name LIKE \\'%' + term + '%\\'';
        return Database.query(soql);
    }

    public static void close(Id oppId) {
        Opportunity o = [SELECT Id, StageName FROM Opportunity WHERE Id = :oppId];
        o.StageName = 'Closed Won';
        update o;
    }
}
`;

const STARTER_EN = STARTER_ES.replace(
  "// CASO: el puente con el ERP, auditado\n// Ya resuelto (tareas 1-4): cada hallazgo, por separado.\n// Tarea 5 de 5: la entrega. La clase de la pantalla de renovaciones, lista para producción.",
  "// CASE: the ERP bridge, audited\n// Already solved (tasks 1-4): each finding, on its own.\n// Task 5 of 5: the delivery. The renewals screen's class, production-ready.",
).replace(
  "// El informe del auditor señala cuatro hallazgos en esta clase. Encuéntralos y ciérralos.",
  "// The auditor's report flags four findings in this class. Find them and close them.",
);

export const l05Checkpoint: Lesson = {
  id: "m12-l05",
  slug: "checkpoint",
  n: 5,
  kind: "checkpoint",
  minutes: 45,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 4", en: "Remember? · Review of lesson 4" },
    prompt: {
      es: "El usuario escribe un texto de búsqueda. ¿Cómo llega a la consulta sin riesgo de inyección?",
      en: "The user types a search text. How does it reach the query with no injection risk?",
    },
    options: [
      { es: "Enlazado como valor, con dos puntos", en: "Bound as a value, with a colon" },
      { es: "Pegado al texto con el operador +", en: "Glued into the text with the + operator" },
      { es: "En una clase with sharing", en: "In a with sharing class" },
    ],
    answer: 0,
    explain: {
      es: "Un valor enlazado nunca se lee como consulta. Hoy lo juntas con el resto del módulo.",
      en: "A bound value is never read as query. Today you put it together with the rest of the module.",
    },
  },
  title: { es: "Checkpoint del Módulo 12", en: "Module 12 checkpoint" },
  summary: {
    es: "La entrega, y la última del curso: la clase que usa la pantalla de renovaciones tiene los cuatro hallazgos de la auditoría a la vez. La dejas con el sharing declarado, sin inyección, sin enseñar el margen a quien no debe y guardando con los permisos del usuario.",
    en: "The delivery, and the course's last: the class the renewals screen uses has all four audit findings at once. You leave it with sharing declared, no injection, not showing the margin to those who should not see it and saving with the user's permissions.",
  },
  analogy: {
    es: "Pasar el Health Check de Setup, pero sobre tu propio código",
    en: "Passing Setup's Health Check, but on your own code",
  },
  objectives: [
    { es: "Auditar una clase y reconocer sus fallos de seguridad.", en: "Audit a class and recognise its security faults." },
    { es: "Elegir para cada fallo la herramienta del módulo que lo cierra.", en: "Pick for each fault the module tool that closes it." },
    { es: "Dejar una clase que un auditor aprobaría.", en: "Leave a class an auditor would approve." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Hasta ahora cada hallazgo venía solo y con su nombre. En el trabajo real no: te llega una clase de veinte líneas y nadie te dice qué tiene. La pantalla de renovaciones usa RenewalDeskController, que busca renovaciones por nombre de cuenta y las cierra como ganadas. El auditor ha contado cuatro hallazgos en ella.",
        en: "So far each finding came alone and with its name. Real work is not like that: a twenty-line class lands on you and nobody says what is wrong with it. The renewals screen uses RenewalDeskController, which searches renewals by account name and closes them as won. The auditor has counted four findings in it.",
      },
    },
    {
      type: "h",
      text: { es: "Las cuatro preguntas del auditor", en: "The auditor's four questions" },
    },
    {
      type: "table",
      head: [
        { es: "Pregunta", en: "Question" },
        { es: "Si la respuesta es no", en: "If the answer is no" },
        { es: "Tarea", en: "Task" },
      ],
      rows: [
        [
          { es: "¿La clase declara su sharing?", en: "Does the class declare its sharing?" },
          { es: "with sharing, salvo razón escrita para otra cosa.", en: "with sharing, unless there is a written reason for something else." },
          { es: "1", en: "1" },
        ],
        [
          { es: "¿Lo que escribe el usuario viaja como valor?", en: "Does what the user types travel as a value?" },
          { es: "Consulta entre corchetes con :variable, o queryWithBinds.", en: "A query in square brackets with :variable, or queryWithBinds." },
          { es: "4", en: "4" },
        ],
        [
          { es: "¿Lo que se muestra respeta los permisos de campo?", en: "Does what is shown respect field permissions?" },
          { es: "Security.stripInaccessible antes de devolverlo.", en: "Security.stripInaccessible before returning it." },
          { es: "2 y 3", en: "2 and 3" },
        ],
        [
          { es: "¿Lo que se guarda respeta los permisos del usuario?", en: "Does what is saved respect the user's permissions?" },
          { es: "WITH USER_MODE y «as user».", en: "WITH USER_MODE and «as user»." },
          { es: "3", en: "3" },
        ],
      ],
    },
    {
      type: "diagram",
      id: "m12-cp-audit",
      caption: {
        es: "Activa cada arreglo y vuelve a pasar la auditoría: mira qué hallazgos quedan abiertos y qué ve el comercial en cada caso.",
        en: "Switch each fix on and run the audit again: see which findings stay open and what the rep sees in each case.",
      },
    },
    {
      type: "p",
      text: {
        es: "Fíjate en que las cuatro son independientes. with sharing decide qué registros se ven, pero no qué campos. El modo usuario aplica permisos, pero no impide una inyección. Enlazar valores impide la inyección, pero no sabe nada de permisos. Una clase segura contesta sí a las cuatro, y ninguna tapa a otra.",
        en: "Notice that the four are independent. with sharing decides which records are seen, but not which fields. User mode applies permissions, but does not stop an injection. Binding values stops injection, but knows nothing about permissions. A secure class answers yes to all four, and none covers for another.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? La última vez que te lo pregunto", en: "Why not a Flow? The last time I ask" },
      text: {
        es: "En seguridad, Flow te lo da más hecho: un desplegable decide el contexto de todo el flow, y un Get Records no se puede inyectar. Apex te deja decidir operación por operación, y a cambio cada decisión es tuya y cada olvido también. Por eso, después de doce módulos, la pregunta sigue siendo la primera que debes hacerte: si un flow lo resuelve bien, es el flow. Y cuando no llega, por volumen, por lógica, por integración o por control fino, ahora sabes escribir el código, y escribirlo de forma que un auditor lo apruebe.",
        en: "On security, Flow hands you more ready-made: a dropdown decides the whole flow's context, and a Get Records cannot be injected. Apex lets you decide operation by operation, and in exchange every decision is yours and so is every omission. That is why, after twelve modules, the question is still the first you should ask: if a flow solves it well, it is the flow. And when it falls short, on volume, logic, integration or fine control, you now know how to write the code, and write it so an auditor approves it.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "Lo que viene: el Desafío 2", en: "What comes next: Challenge 2" },
    },
    {
      type: "p",
      text: {
        es: "Con esta entrega terminas los doce módulos, y se desbloquea el Desafío 2, el proyecto final: un caso completo sin tareas guiadas, donde tú decides qué va en un flow, qué va en Apex y cómo lo pruebas y lo aseguras.",
        en: "With this delivery you finish the twelve modules, and Challenge 2 unlocks, the final project: a full case with no guided tasks, where you decide what goes in a flow, what goes in Apex and how you test and secure it.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes del quiz", en: "Before the quiz" },
      text: {
        es: "Sin mirar: ¿cuáles son las cuatro preguntas del auditor? ¿Por qué with sharing no basta para proteger un campo? ¿Cuándo recortas y cuándo dejas que falle?",
        en: "Without looking: what are the auditor's four questions? Why is with sharing not enough to protect a field? When do you trim and when do you let it fail?",
      },
    },
  ],

  quiz: [
    {
      id: "m12-cp-q1",
      kind: "multi",
      prompt: {
        es: "Una clase with sharing consulta Margin__c con WITH SYSTEM_MODE y devuelve el resultado tal cual. ¿Qué es cierto?",
        en: "A with sharing class queries Margin__c with WITH SYSTEM_MODE and returns the result as is. What is true?",
      },
      options: [
        { es: "Solo devuelve los registros que el usuario puede ver", en: "It only returns the records the user can see" },
        { es: "Devuelve el margen aunque el usuario lo tenga oculto", en: "It returns the margin even if the user has it hidden" },
        { es: "Lanza una excepción si el usuario no puede ver el margen", en: "It throws an exception if the user cannot see the margin" },
        { es: "No devuelve nada", en: "It returns nothing" },
      ],
      answers: [0, 1],
      explain: {
        es: "El sharing filtra registros; los permisos de campo son otra cosa, y en modo sistema no se aplican.",
        en: "Sharing filters records; field permissions are something else, and in system mode they are not applied.",
      },
    },
    {
      id: "m12-cp-q2",
      kind: "single",
      prompt: {
        es: "Una pantalla debe enseñar las renovaciones a todos, y el margen solo a quien pueda verlo. ¿Qué usas?",
        en: "A screen must show the renewals to everyone, and the margin only to those who may see it. What do you use?",
      },
      options: [
        { es: "Security.stripInaccessible(AccessType.READABLE, rows)", en: "Security.stripInaccessible(AccessType.READABLE, rows)" },
        { es: "WITH USER_MODE en la consulta", en: "WITH USER_MODE on the query" },
        { es: "without sharing", en: "without sharing" },
        { es: "String.escapeSingleQuotes", en: "String.escapeSingleQuotes" },
      ],
      answer: 0,
      explain: {
        es: "Recortar en vez de fallar. Con WITH USER_MODE, quien no puede ver el margen se quedaría sin pantalla.",
        en: "Trimming instead of failing. With WITH USER_MODE, those who cannot see the margin would be left with no screen.",
      },
    },
    {
      id: "m12-cp-q3",
      kind: "single",
      prompt: {
        es: "¿Cuál de estas líneas tiene un fallo de seguridad?",
        en: "Which of these lines has a security fault?",
      },
      options: [
        { es: "Database.query('SELECT Id FROM Lead WHERE Email = \\'' + email + '\\'')", en: "Database.query('SELECT Id FROM Lead WHERE Email = \\'' + email + '\\'')" },
        { es: "[SELECT Id FROM Lead WHERE Email = :email WITH USER_MODE]", en: "[SELECT Id FROM Lead WHERE Email = :email WITH USER_MODE]" },
        { es: "update as user lead;", en: "update as user lead;" },
        { es: "public with sharing class LeadFinder { }", en: "public with sharing class LeadFinder { }" },
      ],
      answer: 0,
      explain: {
        es: "Pega al texto de la consulta lo que escribió el usuario: inyección de SOQL.",
        en: "It glues into the query text what the user typed: SOQL injection.",
      },
      tags: ["find-error"],
    },
    {
      id: "m12-cp-q4",
      kind: "text",
      prompt: {
        es: "Escribe la cláusula que se añade al final de una consulta para que se ejecute con los permisos del usuario.",
        en: "Write the clause added at the end of a query so it runs with the user's permissions.",
      },
      accept: ["with\\s+user_mode"],
      placeholder: { es: "WITH …", en: "WITH …" },
      explain: { es: "WITH USER_MODE", en: "WITH USER_MODE" },
      tags: ["recall"],
    },
    {
      id: "m12-cp-q5",
      kind: "single",
      prompt: {
        es: "Un trabajo nocturno recalcula totales sobre todas las renovaciones de la empresa. ¿Qué declaración le toca?",
        en: "A nightly job recalculates totals over all the company's renewals. Which declaration fits?",
      },
      options: [
        { es: "without sharing, con un comentario que diga por qué", en: "without sharing, with a comment saying why" },
        { es: "with sharing, como todas", en: "with sharing, like all of them" },
        { es: "Ninguna: así usa el valor por defecto", en: "None: that way it uses the default" },
        { es: "inherited sharing", en: "inherited sharing" },
      ],
      answer: 0,
      explain: {
        es: "Necesita verlo todo, y eso es legítimo si está dicho y justificado. Lo que nunca es legítimo es dejarlo implícito.",
        en: "It needs to see everything, and that is legitimate if stated and justified. What is never legitimate is leaving it implicit.",
      },
    },
    {
      id: "m12-cp-q6",
      kind: "single",
      prompt: {
        es: "¿Por qué conviene escribir siempre la declaración de sharing y el modo de acceso?",
        en: "Why should you always write the sharing declaration and the access mode?",
      },
      options: [
        { es: "Porque el valor por defecto cambió con la versión 67 de la API, y lo explícito se comporta igual en todas", en: "Because the default changed with API version 67, and what is explicit behaves the same on all" },
        { es: "Porque sin ellos la clase no compila", en: "Because without them the class does not compile" },
        { es: "Porque hacen el código más rápido", en: "Because they make the code faster" },
        { es: "Porque los tests lo exigen", en: "Because tests require it" },
      ],
      answer: 0,
      explain: {
        es: "Y porque quien lea el código sabrá que lo decidiste, en vez de preguntarse si lo olvidaste.",
        en: "And because whoever reads the code will know you decided it, instead of wondering whether you forgot.",
      },
    },
    {
      id: "m12-cp-q7",
      kind: "single",
      prompt: {
        es: "Repaso: ¿qué cobertura mínima de tests exige Salesforce para desplegar Apex en producción?",
        en: "Review: what minimum test coverage does Salesforce require to deploy Apex to production?",
      },
      options: [
        { es: "75 %", en: "75%" },
        { es: "50 %", en: "50%" },
        { es: "90 %", en: "90%" },
        { es: "100 %", en: "100%" },
      ],
      answer: 0,
      explain: {
        es: "75 %, y es un suelo: lo que importa es lo que comprueban tus assert.",
        en: "75%, and it is a floor: what matters is what your asserts check.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M10 L1", en: "Review · M10 L1" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 5 DE 5 · La entrega, y la última del curso. RenewalDeskController es la clase que usa la pantalla de renovaciones, y el auditor ha encontrado en ella cuatro hallazgos. Esta vez nadie te dice cuáles: hazle a la clase las cuatro preguntas y ciérralos todos, sin cambiar lo que hace.",
      en: "TASK 5 OF 5 · The delivery, and the course's last. RenewalDeskController is the class the renewals screen uses, and the auditor has found four findings in it. This time nobody tells you which: ask the class the four questions and close them all, without changing what it does.",
    },
    brief: [
      {
        es: "La clase respeta las reglas de colaboración de quien la usa.",
        en: "The class respects the sharing rules of whoever uses it.",
      },
      {
        es: "search no puede inyectarse. No necesita SOQL dinámico: nada de la consulta cambia salvo el valor buscado.",
        en: "search cannot be injected. It needs no dynamic SOQL: nothing in the query changes except the searched value.",
      },
      {
        es: "search devuelve las renovaciones a todos, pero Margin__c solo a quien pueda verlo.",
        en: "search returns the renewals to everyone, but Margin__c only to those who may see it.",
      },
      {
        es: "close lee y guarda con los permisos del usuario: si no puede editar, debe fallar.",
        en: "close reads and saves with the user's permissions: if they may not edit, it must fail.",
      },
    ],
    starter: { es: STARTER_ES, en: STARTER_EN },
    hints: [
      {
        es: "Yo recorrería la clase con las cuatro preguntas de la tabla, de arriba abajo: la primera línea, la consulta de search, lo que devuelve search, y lo que hace close.",
        en: "I would walk the class with the table's four questions, top to bottom: the first line, search's query, what search returns, and what close does.",
      },
      {
        es: "Lo que me ayudó: en search, la consulta cabe entre corchetes con un LIKE :variable (prepara antes el texto con sus %), y el resultado pasa por Security.stripInaccessible. En close, la consulta y el update dicen quién los ejecuta.",
        en: "What helped me: in search, the query fits in square brackets with a LIKE :variable (prepare the text with its % first), and the result goes through Security.stripInaccessible. In close, the query and the update say who runs them.",
      },
      {
        es: "Te dejo el esquema: public with sharing class … String likeTerm = '%' + term + '%'; List<Opportunity> rows = [SELECT … WHERE Type = 'Renewal' AND Account.Name LIKE :likeTerm WITH SYSTEM_MODE]; return (List<Opportunity>) Security.stripInaccessible(AccessType.READABLE, rows).getRecords(); y en close: [SELECT … WHERE Id = :oppId WITH USER_MODE] y update as user o;",
        en: "Here is the outline: public with sharing class … String likeTerm = '%' + term + '%'; List<Opportunity> rows = [SELECT … WHERE Type = 'Renewal' AND Account.Name LIKE :likeTerm WITH SYSTEM_MODE]; return (List<Opportunity>) Security.stripInaccessible(AccessType.READABLE, rows).getRecords(); and in close: [SELECT … WHERE Id = :oppId WITH USER_MODE] and update as user o;",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m12-cp-c1",
        label: { es: "La clase declara que respeta el sharing", en: "The class declares it respects sharing" },
        rule: { op: "match", pattern: "public\\s+with\\s+sharing\\s+class\\s+RenewalDeskController" },
        onFail: {
          es: "public with sharing class RenewalDeskController { … }",
          en: "public with sharing class RenewalDeskController { … }",
        },
        otter: {
          es: "Primera pregunta del auditor, y se contesta en la primera línea: la clase la usa una pantalla, así que respeta lo que ve cada persona. with sharing, entre public y class.",
          en: "The auditor's first question, answered on the first line: a screen uses the class, so it respects what each person sees. with sharing, between public and class.",
        },
      },
      {
        id: "m12-cp-c2",
        label: { es: "La búsqueda ya no se puede inyectar", en: "The search can no longer be injected" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "LIKE\\s*:\\s*\\w+" },
            { op: "absent", pattern: "Database\\s*\\.\\s*query\\s*\\(" },
            { op: "absent", pattern: "LIKE\\s*\\\\'%'\\s*\\+\\s*term" },
          ],
        },
        onFail: {
          es: "String likeTerm = '%' + term + '%'; y en la consulta, entre corchetes: … Account.Name LIKE :likeTerm",
          en: "String likeTerm = '%' + term + '%'; and in the query, in square brackets: … Account.Name LIKE :likeTerm",
        },
        otter: {
          es: "Lo que escribe el comercial sigue pegado al texto de la consulta. Aquí no hace falta SOQL dinámico: prepara el texto con sus % en una variable y escríbela entre corchetes con LIKE :variable.",
          en: "What the rep types is still glued into the query text. No dynamic SOQL is needed here: prepare the text with its % in a variable and write it in square brackets with LIKE :variable.",
        },
      },
      {
        id: "m12-cp-c3",
        label: { es: "El margen solo llega a quien puede verlo", en: "The margin only reaches those who may see it" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Security\\s*\\.\\s*stripInaccessible\\s*\\(\\s*AccessType\\s*\\.\\s*READABLE\\s*,\\s*\\w+\\s*\\)" },
            { op: "match", pattern: "\\.\\s*getRecords\\s*\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "SObjectAccessDecision decision = Security.stripInaccessible(AccessType.READABLE, rows); return (List<Opportunity>) decision.getRecords();",
          en: "SObjectAccessDecision decision = Security.stripInaccessible(AccessType.READABLE, rows); return (List<Opportunity>) decision.getRecords();",
        },
        otter: {
          es: "search devuelve Margin__c a todo el mundo, como un informe que ignora la seguridad a nivel de campo. Pasa la lista por Security.stripInaccessible(AccessType.READABLE, rows) y devuelve su getRecords().",
          en: "search returns Margin__c to everyone, like a report ignoring field-level security. Pass the list through Security.stripInaccessible(AccessType.READABLE, rows) and return its getRecords().",
        },
      },
      {
        id: "m12-cp-c4",
        label: { es: "close lee y guarda en modo usuario", en: "close reads and saves in user mode" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "WHERE\\s+Id\\s*=\\s*:\\s*oppId\\s+WITH\\s+USER_MODE" },
            { op: "match", pattern: "update\\s+as\\s+user\\s+\\w+\\s*;" },
          ],
        },
        onFail: {
          es: "[SELECT Id, StageName FROM Opportunity WHERE Id = :oppId WITH USER_MODE] y update as user o;",
          en: "[SELECT Id, StageName FROM Opportunity WHERE Id = :oppId WITH USER_MODE] and update as user o;",
        },
        otter: {
          es: "close cierra la oportunidad sin mirar si quien pulsa el botón puede editarla. Dilo en las dos operaciones: WITH USER_MODE al final de la consulta y update as user o; al guardar.",
          en: "close closes the opportunity without checking whether whoever clicks the button may edit it. Say it on both operations: WITH USER_MODE at the end of the query and update as user o; when saving.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué tests escribirías para esta clase? Piensa en un usuario sin permiso sobre Margin__c y en un término de búsqueda con una comilla.",
        en: "Which tests would you write for this class? Think of a user without permission on Margin__c and of a search term with a quote.",
      },
      {
        es: "¿Algún hallazgo se habría evitado haciendo la pantalla con un Screen Flow?",
        en: "Would any finding have been avoided by building the screen with a Screen Flow?",
      },
    ],
    voice: "otter",
    outro: {
      es: "Auditoría superada, y con ella el curso entero: doce módulos, desde tu primera variable hasta una clase que un auditor aprueba. Empezaste sabiendo configurar Salesforce y ahora también sabes programarlo, probarlo, integrarlo y asegurarlo. El Desafío 2 ya está abierto: es tu proyecto final, y esta vez las decisiones son todas tuyas.",
      en: "Audit passed, and with it the whole course: twelve modules, from your first variable to a class an auditor approves. You started out knowing how to configure Salesforce and now you also know how to program it, test it, integrate it and secure it. Challenge 2 is now open: it is your final project, and this time every decision is yours.",
    },
  },
};
