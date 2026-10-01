import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, auditado
// Tarea 3 de 5: que los permisos los aplique Salesforce, todos a la vez.

public with sharing class RenewalDesk {
    public static void applyDiscount(Id oppId, Decimal percent) {
        // Modo usuario: objeto, campos y sharing, comprobados por la plataforma
        Opportunity o = [SELECT Id, Discount__c FROM Opportunity WHERE Id = :oppId WITH USER_MODE];
        o.Discount__c = percent;
        update as user o;
    }

    public static List<Opportunity> myOpenRenewals() {
        List<Opportunity> rows = [
            SELECT Id, Name, Amount, Margin__c, StageName
            FROM Opportunity
            WHERE Type = 'Renewal' AND IsClosed = false
            WITH SYSTEM_MODE
        ];
        // Se quitan los campos que este usuario no puede ver, sin fallar
        SObjectAccessDecision decision = Security.stripInaccessible(AccessType.READABLE, rows);
        return (List<Opportunity>) decision.getRecords();
    }
}`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, auditado\n// Tarea 3 de 5: que los permisos los aplique Salesforce, todos a la vez.",
  "// CASE: the ERP bridge, audited\n// Task 3 of 5: let Salesforce apply the permissions, all at once.",
)
  .replace("// Modo usuario: objeto, campos y sharing, comprobados por la plataforma", "// User mode: object, fields and sharing, checked by the platform")
  .replace("// Se quitan los campos que este usuario no puede ver, sin fallar", "// Fields this user cannot see are removed, without failing");

const STARTER_ES = `// CASO: el puente con el ERP, auditado
// Ya resuelto (tareas 1-2): sharing declarado y permisos comprobados a mano.
// Tarea 3 de 5: que los permisos los aplique Salesforce, todos a la vez.

public with sharing class RenewalDesk {
    public static void applyDiscount(Id oppId, Decimal percent) {
        if (!Schema.sObjectType.Opportunity.isUpdateable()) {
            throw new RenewalSecurityException('No tienes permiso para editar oportunidades');
        }
        if (!Schema.sObjectType.Opportunity.fields.Discount__c.isUpdateable()) {
            throw new RenewalSecurityException('No tienes permiso para cambiar el descuento');
        }
        Opportunity o = [SELECT Id, Discount__c FROM Opportunity WHERE Id = :oppId];
        o.Discount__c = percent;
        update o;
    }

    // Tercer hallazgo: devuelve Margin__c a comerciales que lo tienen oculto
    public static List<Opportunity> myOpenRenewals() {
        List<Opportunity> rows = [
            SELECT Id, Name, Amount, Margin__c, StageName
            FROM Opportunity
            WHERE Type = 'Renewal' AND IsClosed = false
            WITH SYSTEM_MODE
        ];
        return rows;
    }
}
`;

export const l03UserMode: Lesson = {
  id: "m12-l03",
  slug: "user-mode-y-stripinaccessible",
  n: 3,
  kind: "lesson",
  minutes: 30,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 2", en: "Remember? · Review of lesson 2" },
    prompt: {
      es: "¿Qué expresión dice si el usuario puede editar el campo Discount__c?",
      en: "Which expression says whether the user may edit the Discount__c field?",
    },
    options: [
      { es: "Schema.sObjectType.Opportunity.fields.Discount__c.isUpdateable()", en: "Schema.sObjectType.Opportunity.fields.Discount__c.isUpdateable()" },
      { es: "Opportunity.Discount__c.canEdit()", en: "Opportunity.Discount__c.canEdit()" },
      { es: "with sharing", en: "with sharing" },
    ],
    answer: 0,
    explain: {
      es: "Una pregunta por campo. Hoy, la forma de no tener que hacer veinte.",
      en: "One question per field. Today, the way not to have to ask twenty.",
    },
  },
  title: { es: "Security.stripInaccessible y WITH USER_MODE", en: "Security.stripInaccessible and WITH USER_MODE" },
  summary: {
    es: "En lugar de comprobar permiso a permiso, le pides a Salesforce que ejecute la consulta o el guardado como lo haría el usuario: WITH USER_MODE y «as user». Y cuando prefieres quitar lo que no puede ver en vez de fallar, Security.stripInaccessible.",
    en: "Instead of checking permission by permission, you ask Salesforce to run the query or the save as the user would: WITH USER_MODE and «as user». And when you would rather remove what they cannot see than fail, Security.stripInaccessible.",
  },
  analogy: {
    es: "Poner un flow en «User Context» en vez de comprobar cada permiso con una Decision",
    en: "Setting a flow to «User Context» instead of checking each permission with a Decision",
  },
  objectives: [
    { es: "Ejecutar consultas y guardados en modo usuario.", en: "Run queries and saves in user mode." },
    { es: "Quitar de un resultado los campos que el usuario no puede ver.", en: "Remove from a result the fields the user cannot see." },
    { es: "Elegir entre fallar y recortar según el caso.", en: "Choose between failing and trimming depending on the case." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Las comprobaciones de la tarea 2 funcionan, pero son dos líneas por campo y es fácil olvidar una. Tercer hallazgo de la auditoría: el panel devuelve el campo Margin__c, el margen de cada renovación, a comerciales que lo tienen oculto. Nadie escribió su comprobación. Hace falta algo que no dependa de acordarse.",
        en: "Task 2's checks work, but they are two lines per field and it is easy to forget one. The audit's third finding: the panel returns the Margin__c field, each renewal's margin, to reps who have it hidden. Nobody wrote its check. Something that does not depend on remembering is needed.",
      },
    },
    {
      type: "h",
      text: { es: "Modo usuario: que lo compruebe la plataforma", en: "User mode: let the platform check" },
    },
    {
      type: "code",
      code: {
        es: `// Consulta en modo usuario: objeto, campos y sharing del usuario
Opportunity o = [SELECT Id, Discount__c FROM Opportunity WHERE Id = :oppId WITH USER_MODE];

// Guardado en modo usuario
update as user o;

// Y lo contrario, cuando el proceso necesita todo el poder, dicho en voz alta
List<Opportunity> all = [SELECT Id FROM Opportunity WITH SYSTEM_MODE];`,
        en: `// Query in user mode: the user's object, fields and sharing
Opportunity o = [SELECT Id, Discount__c FROM Opportunity WHERE Id = :oppId WITH USER_MODE];

// Save in user mode
update as user o;

// And the opposite, when the process needs full power, said out loud
List<Opportunity> all = [SELECT Id FROM Opportunity WITH SYSTEM_MODE];`,
      },
      caption: {
        es: "En modo usuario, si el usuario no puede leer o editar algo de lo que toca la operación, Salesforce lanza una excepción en vez de hacerlo. insert, update y delete admiten «as user» y «as system».",
        en: "In user mode, if the user may not read or edit something the operation touches, Salesforce throws an exception instead of doing it. insert, update and delete accept «as user» and «as system».",
      },
    },
    {
      type: "p",
      text: {
        es: "Igual que con el sharing, aquí también cambió el valor por defecto: hasta la versión 66 de la API, las consultas y los guardados iban en modo sistema; desde la 67 (Summer '26), en modo usuario. Y la conclusión es la misma: no lo dejes implícito. Escribir WITH USER_MODE o WITH SYSTEM_MODE hace que el código se comporte igual en cualquier versión, y que quien lo lea sepa que lo decidiste.",
        en: "As with sharing, the default changed here too: up to API version 66, queries and saves ran in system mode; from 67 (Summer '26), in user mode. And the conclusion is the same: do not leave it implicit. Writing WITH USER_MODE or WITH SYSTEM_MODE makes the code behave the same on any version, and tells whoever reads it that you decided.",
      },
    },
    {
      type: "diagram",
      id: "m12-user-mode",
      caption: {
        es: "La misma consulta, en modo sistema, en modo usuario y con stripInaccessible: qué vuelve para un comercial que no puede ver el margen.",
        en: "The same query, in system mode, in user mode and with stripInaccessible: what comes back for a rep who cannot see the margin.",
      },
    },
    {
      type: "h",
      text: { es: "Recortar en vez de fallar", en: "Trimming instead of failing" },
    },
    {
      type: "p",
      text: {
        es: "A veces no quieres una excepción: el panel debería enseñar las renovaciones a todos, con el margen solo para quien pueda verlo. Security.stripInaccessible, con AccessType.READABLE y la lista de registros, devuelve una copia de la lista sin los campos que el usuario no puede leer. Con AccessType.UPDATABLE o CREATABLE, recorta antes de guardar. La regla práctica: para guardar, modo usuario, que falla si no puede; para mostrar, recortar.",
        en: "Sometimes you do not want an exception: the panel should show the renewals to everyone, with the margin only for those who may see it. Security.stripInaccessible, given AccessType.READABLE and the list of records, returns a copy of the list without the fields the user cannot read. With AccessType.UPDATABLE or CREATABLE, it trims before saving. The rule of thumb: to save, user mode, which fails if they may not; to display, trim.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque es el mismo desplegable", en: "Why not a Flow? Because it is the same dropdown" },
      text: {
        es: "WITH USER_MODE es poner el flow en «User Context»: Salesforce aplica los permisos del usuario por ti. Y WITH SYSTEM_MODE es «System Context». Flow lo decide una vez para todo el flow; Apex te deja decidirlo operación por operación, que es justo lo que hace falta aquí: consultar con todo el poder y recortar después. En Flow no hay un equivalente de recortar los campos que el usuario no puede ver: o el flow entero respeta los permisos, o no los respeta.",
        en: "WITH USER_MODE is setting the flow to «User Context»: Salesforce applies the user's permissions for you. And WITH SYSTEM_MODE is «System Context». Flow decides it once for the whole flow; Apex lets you decide operation by operation, which is exactly what is needed here: query with full power and trim afterwards. Flow has no equivalent of trimming the fields the user cannot see: either the whole flow respects permissions, or it does not.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué comprueba WITH USER_MODE? ¿Qué pasa si el usuario no puede ver un campo de la consulta? ¿Cuándo usarías stripInaccessible en su lugar?",
        en: "Without looking: what does WITH USER_MODE check? What happens if the user cannot see a field in the query? When would you use stripInaccessible instead?",
      },
    },
  ],

  quiz: [
    {
      id: "m12-l03-q1",
      kind: "single",
      prompt: {
        es: "Un comercial tiene oculto Margin__c. ¿Qué pasa con esta consulta?",
        en: "A rep has Margin__c hidden. What happens with this query?",
      },
      code: {
        es: "List<Opportunity> rows = [SELECT Id, Margin__c FROM Opportunity WITH USER_MODE];",
        en: "List<Opportunity> rows = [SELECT Id, Margin__c FROM Opportunity WITH USER_MODE];",
      },
      options: [
        { es: "Salta una excepción: no puede leer ese campo", en: "An exception is thrown: they cannot read that field" },
        { es: "Devuelve las filas sin Margin__c", en: "It returns the rows without Margin__c" },
        { es: "Devuelve Margin__c igualmente", en: "It returns Margin__c anyway" },
        { es: "Devuelve una lista vacía", en: "It returns an empty list" },
      ],
      answer: 0,
      explain: {
        es: "El modo usuario falla si la operación toca algo que el usuario no puede. Para recortar sin fallar está stripInaccessible.",
        en: "User mode fails if the operation touches something the user may not. To trim without failing there is stripInaccessible.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m12-l03-q2",
      kind: "multi",
      prompt: { es: "¿Qué comprueba WITH USER_MODE?", en: "What does WITH USER_MODE check?" },
      options: [
        { es: "Los permisos de objeto", en: "Object permissions" },
        { es: "La seguridad a nivel de campo", en: "Field-level security" },
        { es: "El sharing", en: "Sharing" },
        { es: "Los governor limits", en: "Governor limits" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Las tres capas de la lección 2, de una vez. Los límites van aparte y valen siempre.",
        en: "Lesson 2's three layers, at once. Limits are separate and always apply.",
      },
    },
    {
      id: "m12-l03-q3",
      kind: "single",
      prompt: {
        es: "El panel tiene que enseñar las renovaciones a todos, y el margen solo a quien pueda verlo. ¿Qué usas?",
        en: "The panel must show the renewals to everyone, and the margin only to those who may see it. What do you use?",
      },
      options: [
        { es: "Security.stripInaccessible(AccessType.READABLE, rows)", en: "Security.stripInaccessible(AccessType.READABLE, rows)" },
        { es: "WITH USER_MODE", en: "WITH USER_MODE" },
        { es: "without sharing", en: "without sharing" },
        { es: "Nada: que lo oculte la pantalla", en: "Nothing: let the screen hide it" },
      ],
      answer: 0,
      explain: {
        es: "Recorta los campos no visibles y devuelve el resto. Ocultarlo solo en la pantalla no vale: el dato ya habría viajado.",
        en: "It trims the non-visible fields and returns the rest. Hiding it only on screen does not count: the data would already have travelled.",
      },
    },
    {
      id: "m12-l03-q4",
      kind: "text",
      prompt: {
        es: "Escribe la línea que guarda la oportunidad o con un update en modo usuario.",
        en: "Write the line that saves opportunity o with an update in user mode.",
      },
      accept: ["update\\s+as\\s+user\\s+o\\s*;?"],
      placeholder: { es: "update …", en: "update …" },
      explain: { es: "update as user o;", en: "update as user o;" },
      tags: ["recall"],
    },
    {
      id: "m12-l03-q5",
      kind: "single",
      prompt: {
        es: "¿Por qué escribir WITH USER_MODE o WITH SYSTEM_MODE aunque exista un valor por defecto?",
        en: "Why write WITH USER_MODE or WITH SYSTEM_MODE even though a default exists?",
      },
      options: [
        {
          es: "Porque el valor por defecto depende de la versión de la API de la clase, y así el código se comporta igual y deja clara la decisión",
          en: "Because the default depends on the class's API version, and this way the code behaves the same and makes the decision clear",
        },
        { es: "Porque sin eso no compila", en: "Because without it the code does not compile" },
        { es: "Porque es más rápido", en: "Because it is faster" },
        { es: "Porque ahorra límites", en: "Because it saves limits" },
      ],
      answer: 0,
      explain: {
        es: "Hasta la versión 66, modo sistema; desde la 67, modo usuario. En una org conviven las dos.",
        en: "Up to version 66, system mode; from 67, user mode. Both coexist in an org.",
      },
    },
    {
      id: "m12-l03-q6",
      kind: "single",
      prompt: {
        es: "Repaso: decision.getRecords() devuelve una List<SObject>. ¿Cómo la devuelves como List<Opportunity>?",
        en: "Review: decision.getRecords() returns a List<SObject>. How do you return it as List<Opportunity>?",
      },
      options: [
        { es: "Con un casting: (List<Opportunity>) decision.getRecords()", en: "With a cast: (List<Opportunity>) decision.getRecords()" },
        { es: "Con JSON.serialize", en: "With JSON.serialize" },
        { es: "Con String.valueOf", en: "With String.valueOf" },
        { es: "No se puede", en: "It cannot be done" },
      ],
      answer: 0,
      explain: {
        es: "El casting del Módulo 1: el tipo entre paréntesis delante.",
        en: "Module 1's casting: the type in brackets in front.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M1 L9", en: "Review · M1 L9" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 3 DE 5 · Dos cambios. En applyDiscount, sustituye las comprobaciones a mano por el modo usuario: que sea Salesforce quien rechace la operación si falta un permiso. Y arregla el tercer hallazgo: myOpenRenewals devuelve Margin__c a quien lo tiene oculto; recorta los campos que el usuario no puede ver.",
      en: "TASK 3 OF 5 · Two changes. In applyDiscount, replace the manual checks with user mode: let Salesforce reject the operation if a permission is missing. And fix the third finding: myOpenRenewals returns Margin__c to those who have it hidden; trim the fields the user cannot see.",
    },
    brief: [
      {
        es: "applyDiscount: la consulta lleva WITH USER_MODE y el guardado es update as user. Desaparecen los dos if con Schema.",
        en: "applyDiscount: the query carries WITH USER_MODE and the save is update as user. Both Schema ifs go away.",
      },
      {
        es: "myOpenRenewals: pasa la lista por Security.stripInaccessible(AccessType.READABLE, rows) y devuelve getRecords(), con su casting a List<Opportunity>.",
        en: "myOpenRenewals: pass the list through Security.stripInaccessible(AccessType.READABLE, rows) and return getRecords(), with its cast to List<Opportunity>.",
      },
    ],
    starter: {
      es: STARTER_ES,
      en: STARTER_ES.replace(
        "// CASO: el puente con el ERP, auditado\n// Ya resuelto (tareas 1-2): sharing declarado y permisos comprobados a mano.\n// Tarea 3 de 5: que los permisos los aplique Salesforce, todos a la vez.",
        "// CASE: the ERP bridge, audited\n// Already solved (tasks 1-2): sharing declared and permissions checked by hand.\n// Task 3 of 5: let Salesforce apply the permissions, all at once.",
      )
        .replace("'No tienes permiso para editar oportunidades'", "'You do not have permission to edit opportunities'")
        .replace("'No tienes permiso para cambiar el descuento'", "'You do not have permission to change the discount'")
        .replace("// Tercer hallazgo: devuelve Margin__c a comerciales que lo tienen oculto", "// Third finding: it returns Margin__c to reps who have it hidden"),
    },
    hints: [
      {
        es: "Yo lo pensaría como cambiar un flow de «System Context» a «User Context»: dejo de comprobar yo, y que compruebe la plataforma. Y para el panel, la pregunta es otra: ¿quiero que falle, o que enseñe lo que se pueda?",
        en: "I would think of it as switching a flow from «System Context» to «User Context»: I stop checking, and the platform checks. And for the panel, the question is different: do I want it to fail, or to show what it can?",
      },
      {
        es: "Lo que me ayudó: WITH USER_MODE va al final de la consulta, después del WHERE. El guardado es update as user o;. Y stripInaccessible devuelve un objeto de decisión: los registros recortados salen de getRecords().",
        en: "What helped me: WITH USER_MODE goes at the end of the query, after the WHERE. The save is update as user o;. And stripInaccessible returns a decision object: the trimmed records come out of getRecords().",
      },
      {
        es: "Te dejo el esquema: Opportunity o = [SELECT Id, Discount__c FROM Opportunity WHERE Id = :oppId WITH USER_MODE]; o.Discount__c = percent; update as user o; · SObjectAccessDecision decision = Security.stripInaccessible(AccessType.READABLE, rows); return (List<Opportunity>) decision.getRecords();",
        en: "Here is the outline: Opportunity o = [SELECT Id, Discount__c FROM Opportunity WHERE Id = :oppId WITH USER_MODE]; o.Discount__c = percent; update as user o; · SObjectAccessDecision decision = Security.stripInaccessible(AccessType.READABLE, rows); return (List<Opportunity>) decision.getRecords();",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m12-l03-c1",
        label: { es: "El descuento se consulta y se guarda en modo usuario", en: "The discount is queried and saved in user mode" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "FROM\\s+Opportunity\\s+WHERE\\s+Id\\s*=\\s*:\\s*\\w+\\s+WITH\\s+USER_MODE" },
            {
              op: "any",
              of: [
                { op: "match", pattern: "\\bupdate\\s+as\\s+user\\s+\\w+\\s*;" },
                { op: "match", pattern: "Database\\s*\\.\\s*update\\s*\\(\\s*\\w+\\s*,\\s*AccessLevel\\s*\\.\\s*USER_MODE\\s*\\)" },
              ],
            },
          ],
        },
        onFail: {
          es: "[SELECT Id, Discount__c FROM Opportunity WHERE Id = :oppId WITH USER_MODE] y update as user o;",
          en: "[SELECT Id, Discount__c FROM Opportunity WHERE Id = :oppId WITH USER_MODE] and update as user o;",
        },
        otter: {
          es: "Pon la operación en «User Context»: WITH USER_MODE al final de la consulta y update as user o; para guardar. Si falta un permiso, Salesforce lo rechaza por ti.",
          en: "Put the operation in «User Context»: WITH USER_MODE at the end of the query and update as user o; to save. If a permission is missing, Salesforce rejects it for you.",
        },
      },
      {
        id: "m12-l03-c2",
        label: { es: "Ya no hay comprobaciones a mano", en: "No more manual checks" },
        rule: { op: "absent", pattern: "isUpdateable\\s*\\(" },
        onFail: {
          es: "Quita los dos if con Schema…isUpdateable(): el modo usuario ya comprueba objeto y campos.",
          en: "Remove both Schema…isUpdateable() ifs: user mode already checks object and fields.",
        },
        otter: {
          es: "Los dos if de la tarea 2 sobran: el modo usuario comprueba el objeto, todos los campos que tocas y el sharing. Menos código y nada que olvidar.",
          en: "Task 2's two ifs are not needed: user mode checks the object, every field you touch and sharing. Less code and nothing to forget.",
        },
      },
      {
        id: "m12-l03-c3",
        label: { es: "El panel recorta los campos que el usuario no puede ver", en: "The panel trims the fields the user cannot see" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Security\\s*\\.\\s*stripInaccessible\\s*\\(\\s*AccessType\\s*\\.\\s*READABLE\\s*,\\s*\\w+\\s*\\)" },
            { op: "match", pattern: "return\\s+\\(\\s*List\\s*<\\s*Opportunity\\s*>\\s*\\)\\s*[\\w.()\\s,]*getRecords\\s*\\(\\s*\\)\\s*;" },
            { op: "absent", pattern: "return\\s+rows\\s*;" },
          ],
        },
        onFail: {
          es: "SObjectAccessDecision decision = Security.stripInaccessible(AccessType.READABLE, rows); return (List<Opportunity>) decision.getRecords();",
          en: "SObjectAccessDecision decision = Security.stripInaccessible(AccessType.READABLE, rows); return (List<Opportunity>) decision.getRecords();",
        },
        otter: {
          es: "El panel no debe fallar, debe enseñar lo que cada uno puede ver: Security.stripInaccessible(AccessType.READABLE, rows) quita el margen a quien lo tiene oculto, y devuelves decision.getRecords() con su casting.",
          en: "The panel must not fail, it must show what each may see: Security.stripInaccessible(AccessType.READABLE, rows) removes the margin from those who have it hidden, and you return decision.getRecords() with its cast.",
        },
      },
    ],
    rubric: [
      {
        es: "Con stripInaccessible, ¿cómo sabrías qué campos se quitaron? Busca getRemovedFields() en la documentación.",
        en: "With stripInaccessible, how would you know which fields were removed? Look up getRemovedFields() in the documentation.",
      },
    ],
    voice: "otter",
    outro: {
      es: "Los permisos ya los aplica la plataforma, y el panel enseña a cada uno lo que puede ver. Queda una puerta por la que el usuario puede colar código propio: el buscador. En la tarea 4, la inyección de SOQL.",
      en: "The platform now applies the permissions, and the panel shows each person what they may see. One door remains through which the user can slip their own code: the search box. In task 4, SOQL injection.",
    },
  },
};
