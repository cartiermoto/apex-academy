import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente con el ERP, auditado
// Tarea 2 de 6: comprobar los permisos antes de tocar.

public class RenewalSecurityException extends Exception {}

public with sharing class RenewalDesk {
    public static void applyDiscount(Id oppId, Decimal percent) {
        // 1 · ¿Puede editar oportunidades?
        if (!Schema.sObjectType.Opportunity.isUpdateable()) {
            throw new RenewalSecurityException('No tienes permiso para editar oportunidades');
        }
        // 2 · ¿Puede editar ESTE campo?
        if (!Schema.sObjectType.Opportunity.fields.Discount__c.isUpdateable()) {
            throw new RenewalSecurityException('No tienes permiso para cambiar el descuento');
        }

        Opportunity o = [SELECT Id, Discount__c FROM Opportunity WHERE Id = :oppId];
        o.Discount__c = percent;
        update o;
    }
}`;

const SOLUTION_EN = SOLUTION_ES.replace(
  "// CASO: el puente con el ERP, auditado\n// Tarea 2 de 6: comprobar los permisos antes de tocar.",
  "// CASE: the ERP bridge, audited\n// Task 2 of 6: check permissions before touching.",
)
  .replace("// 1 · ¿Puede editar oportunidades?", "// 1 · May they edit opportunities?")
  .replace("'No tienes permiso para editar oportunidades'", "'You do not have permission to edit opportunities'")
  .replace("// 2 · ¿Puede editar ESTE campo?", "// 2 · May they edit THIS field?")
  .replace("'No tienes permiso para cambiar el descuento'", "'You do not have permission to change the discount'");

export const l02CrudFls: Lesson = {
  id: "m12-l02",
  slug: "crud-y-fls",
  n: 2,
  kind: "lesson",
  minutes: 25,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 1", en: "Remember? · Review of lesson 1" },
    prompt: { es: "¿Qué decide with sharing?", en: "What does with sharing decide?" },
    options: [
      { es: "Qué registros ve la clase", en: "Which records the class sees" },
      { es: "Qué campos puede editar el usuario", en: "Which fields the user may edit" },
      { es: "Si el usuario puede borrar el objeto", en: "Whether the user may delete the object" },
    ],
    answer: 0,
    explain: {
      es: "Solo registros. Hoy, lo que with sharing no mira: los permisos sobre el objeto y sobre cada campo.",
      en: "Records only. Today, what with sharing does not check: permissions on the object and on each field.",
    },
  },
  title: { es: "CRUD y FLS: comprobar antes de tocar", en: "CRUD and FLS: check before you touch" },
  summary: {
    es: "Los permisos de objeto (crear, leer, editar, borrar) y la seguridad a nivel de campo los configuras tú en perfiles y permission sets. El código en modo sistema no los mira, así que tiene que preguntarlo antes de leer o guardar.",
    en: "Object permissions (create, read, edit, delete) and field-level security are set up by you in profiles and permission sets. Code in system mode does not check them, so it has to ask before reading or saving.",
  },
  analogy: {
    es: "Los permisos de objeto de un perfil y la pantalla Field-Level Security de un campo",
    en: "A profile's object permissions and a field's Field-Level Security screen",
  },
  objectives: [
    { es: "Distinguir sharing, permisos de objeto (CRUD) y seguridad a nivel de campo (FLS).", en: "Tell apart sharing, object permissions (CRUD) and field-level security (FLS)." },
    { es: "Preguntar a Schema si el usuario puede hacer una operación sobre un objeto o un campo.", en: "Ask Schema whether the user may perform an operation on an object or a field." },
    { es: "Rechazar la operación con un mensaje claro cuando no puede.", en: "Reject the operation with a clear message when they may not." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Segundo hallazgo de la auditoría: un becario tiene un perfil de solo lectura sobre Opportunity y el campo Discount__c oculto. Desde el panel, pulsa «Aplicar descuento» y el descuento se guarda. En la interfaz no podría ni ver el campo. El código lo ha hecho por él, porque en [[modo-sistema|modo sistema]] nadie pregunta.",
        en: "The audit's second finding: an intern has a read-only profile on Opportunity and the Discount__c field hidden. From the panel, they click «Apply discount» and the discount is saved. In the UI they could not even see the field. The code did it for them, because in [[modo-sistema|system mode]] nobody asks.",
      },
    },
    {
      type: "h",
      text: { es: "Tres capas, tres preguntas", en: "Three layers, three questions" },
    },
    {
      type: "table",
      head: [
        { es: "Capa", en: "Layer" },
        { es: "Pregunta", en: "Question" },
        { es: "Dónde lo configuras tú", en: "Where you set it up" },
      ],
      rows: [
        [
          { es: "Permisos de objeto (CRUD)", en: "Object permissions (CRUD)" },
          { es: "¿Puede crear, leer, editar o borrar este objeto?", en: "May they create, read, edit or delete this object?" },
          { es: "Perfil o permission set → Object Settings", en: "Profile or permission set → Object Settings" },
        ],
        [
          { es: "Seguridad a nivel de campo (FLS)", en: "Field-level security (FLS)" },
          { es: "¿Puede ver o editar este campo?", en: "May they see or edit this field?" },
          { es: "Field-Level Security del campo", en: "The field's Field-Level Security" },
        ],
        [
          { es: "Sharing", en: "Sharing" },
          { es: "¿Puede ver este registro?", en: "May they see this record?" },
          { es: "OWD, roles, reglas de sharing", en: "OWD, roles, sharing rules" },
        ],
      ],
    },
    {
      type: "h",
      text: { es: "Preguntárselo a Schema", en: "Asking Schema" },
    },
    {
      type: "code",
      code: {
        es: `// Permisos de objeto
Schema.sObjectType.Opportunity.isAccessible();    // ¿leer?
Schema.sObjectType.Opportunity.isCreateable();    // ¿crear?
Schema.sObjectType.Opportunity.isUpdateable();    // ¿editar?
Schema.sObjectType.Opportunity.isDeletable();     // ¿borrar?

// Seguridad a nivel de campo
Schema.sObjectType.Opportunity.fields.Discount__c.isAccessible();   // ¿ver el campo?
Schema.sObjectType.Opportunity.fields.Discount__c.isUpdateable();   // ¿editarlo?`,
        en: `// Object permissions
Schema.sObjectType.Opportunity.isAccessible();    // read?
Schema.sObjectType.Opportunity.isCreateable();    // create?
Schema.sObjectType.Opportunity.isUpdateable();    // edit?
Schema.sObjectType.Opportunity.isDeletable();     // delete?

// Field-level security
Schema.sObjectType.Opportunity.fields.Discount__c.isAccessible();   // see the field?
Schema.sObjectType.Opportunity.fields.Discount__c.isUpdateable();   // edit it?`,
      },
      caption: {
        es: "Todas devuelven un Boolean para el usuario que está ejecutando el código. Se pregunta antes de consultar o guardar, y si la respuesta es no, se rechaza con un mensaje.",
        en: "They all return a Boolean for the user running the code. You ask before querying or saving, and if the answer is no, you reject with a message.",
      },
    },
    {
      type: "diagram",
      id: "m12-crud-fls",
      caption: {
        es: "Cambia los permisos del usuario y mira qué responde cada pregunta y si el descuento llega a guardarse.",
        en: "Change the user's permissions and see what each question answers and whether the discount gets saved.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Tus permisos, que el código tiene que respetar", en: "Your permissions, which code has to respect" },
      text: {
        es: "Esto lo configuras tú todos los días: los permisos de objeto de un perfil y la Field-Level Security de cada campo. En la interfaz, Salesforce los aplica solo. Lo que me sorprendió al empezar con Apex es que el código en modo sistema pasa por encima de todo ese trabajo si nadie lo comprueba. Un developer que viene de Admin tiene aquí ventaja: sabe exactamente qué está en juego.",
        en: "You configure this every day: a profile's object permissions and each field's Field-Level Security. In the UI, Salesforce applies them on its own. What surprised me when I started with Apex is that code in system mode walks right over all that work if nobody checks. A developer coming from Admin has the edge here: they know exactly what is at stake.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque en Flow depende del mismo ajuste", en: "Why not a Flow? Because in Flow it depends on the same setting" },
      text: {
        es: "Con franqueza: un flow en contexto de usuario respeta los permisos de objeto y de campo sin que hagas nada, y uno en contexto de sistema se los salta, igual que el Apex antiguo. No es una carencia de Flow ni una ventaja de Apex: es la misma decisión en dos herramientas. Lo que el código añade es la posibilidad de preguntar campo a campo y contestar con tu propio mensaje.",
        en: "Frankly: a flow in user context respects object and field permissions with nothing done by you, and one in system context skips them, just like old Apex. It is not a gap in Flow or an advantage of Apex: it is the same decision in two tools. What code adds is the ability to ask field by field and answer with your own message.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué tres capas de seguridad hay y qué pregunta contesta cada una? ¿Cómo preguntas si el usuario puede editar Opportunity? ¿Y si puede editar el campo Discount__c?",
        en: "Without looking: which three security layers are there and which question does each answer? How do you ask whether the user may edit Opportunity? And whether they may edit the Discount__c field?",
      },
    },
  ],

  quiz: [
    {
      id: "m12-l02-q1",
      kind: "single",
      prompt: {
        es: "Una clase with sharing, en modo sistema, guarda un campo que el usuario tiene oculto por FLS. ¿Qué pasa?",
        en: "A with sharing class, in system mode, saves a field the user has hidden by FLS. What happens?",
      },
      options: [
        { es: "Se guarda: with sharing solo mira registros, no campos", en: "It is saved: with sharing only checks records, not fields" },
        { es: "Salta una excepción", en: "An exception is thrown" },
        { es: "El campo se ignora", en: "The field is ignored" },
        { es: "No compila", en: "It does not compile" },
      ],
      answer: 0,
      explain: {
        es: "Sharing y FLS son capas distintas. Sin una comprobación, el código en modo sistema escribe el campo.",
        en: "Sharing and FLS are different layers. With no check, code in system mode writes the field.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m12-l02-q2",
      kind: "single",
      prompt: { es: "¿Qué pregunta contesta Schema.sObjectType.Opportunity.isCreateable()?", en: "Which question does Schema.sObjectType.Opportunity.isCreateable() answer?" },
      options: [
        { es: "Si el usuario que ejecuta puede crear oportunidades", en: "Whether the running user may create opportunities" },
        { es: "Si el objeto existe", en: "Whether the object exists" },
        { es: "Si el usuario ve una oportunidad concreta", en: "Whether the user sees a specific opportunity" },
        { es: "Si el campo es obligatorio", en: "Whether the field is required" },
      ],
      answer: 0,
      explain: {
        es: "Es el permiso de objeto «Create» del perfil o permission set, para el usuario que ejecuta.",
        en: "It is the profile's or permission set's «Create» object permission, for the running user.",
      },
    },
    {
      id: "m12-l02-q3",
      kind: "multi",
      prompt: { es: "¿Qué hay que comprobar antes de guardar un cambio en Discount__c?", en: "What must be checked before saving a change to Discount__c?" },
      options: [
        { es: "Que el usuario puede editar Opportunity", en: "That the user may edit Opportunity" },
        { es: "Que el usuario puede editar el campo Discount__c", en: "That the user may edit the Discount__c field" },
        { es: "Que el registro es uno de los que puede ver (sharing)", en: "That the record is one they can see (sharing)" },
        { es: "Que el usuario es administrador", en: "That the user is an administrator" },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Las tres capas: objeto, campo y registro. Ser administrador no es una comprobación, es saltárselas.",
        en: "The three layers: object, field and record. Being an administrator is not a check, it is skipping them.",
      },
    },
    {
      id: "m12-l02-q4",
      kind: "text",
      prompt: {
        es: "Escribe la expresión que dice si el usuario puede editar el campo Amount de Opportunity.",
        en: "Write the expression saying whether the user may edit Opportunity's Amount field.",
      },
      accept: ["schema\\.sobjecttype\\.opportunity\\.fields\\.amount\\.isupdateable\\(\\s*\\)\\s*;?"],
      placeholder: { es: "Schema.sObjectType.…", en: "Schema.sObjectType.…" },
      explain: {
        es: "Schema.sObjectType.Opportunity.fields.Amount.isUpdateable()",
        en: "Schema.sObjectType.Opportunity.fields.Amount.isUpdateable()",
      },
      tags: ["recall"],
    },
    {
      id: "m12-l02-q5",
      kind: "single",
      prompt: {
        es: "El usuario no tiene permiso. ¿Qué es mejor que haga el método?",
        en: "The user has no permission. What is the best thing for the method to do?",
      },
      options: [
        { es: "Lanzar una excepción con un mensaje que diga qué permiso falta", en: "Throw an exception with a message saying which permission is missing" },
        { es: "No hacer nada y terminar en silencio", en: "Do nothing and finish silently" },
        { es: "Guardar igualmente", en: "Save anyway" },
        { es: "Devolver null", en: "Return null" },
      ],
      answer: 0,
      explain: {
        es: "Un rechazo silencioso deja al usuario creyendo que funcionó. Un mensaje claro le dice a quién pedir el permiso.",
        en: "A silent rejection leaves the user thinking it worked. A clear message tells them whom to ask for the permission.",
      },
    },
    {
      id: "m12-l02-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿cómo se declara la excepción RenewalSecurityException?",
        en: "Review: how is the RenewalSecurityException exception declared?",
      },
      options: [
        { es: "public class RenewalSecurityException extends Exception {}", en: "public class RenewalSecurityException extends Exception {}" },
        { es: "public exception RenewalSecurityException {}", en: "public exception RenewalSecurityException {}" },
        { es: "public class RenewalSecurity extends Exception {}", en: "public class RenewalSecurity extends Exception {}" },
        { es: "throw new RenewalSecurityException;", en: "throw new RenewalSecurityException;" },
      ],
      answer: 0,
      explain: {
        es: "Extiende Exception y su nombre termina en Exception: Módulo 8, lección 4.",
        en: "It extends Exception and its name ends in Exception: Module 8, lesson 4.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M8 L4", en: "Review · M8 L4" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 2 DE 6 · Segundo hallazgo: applyDiscount guarda el descuento sin mirar si quien lo pulsa puede editar oportunidades, ni si puede tocar el campo Discount__c. Añade las dos comprobaciones y rechaza con RenewalSecurityException cuando falte el permiso.",
      en: "TASK 2 OF 6 · Second finding: applyDiscount saves the discount without checking whether whoever clicks may edit opportunities, or touch the Discount__c field. Add both checks and reject with RenewalSecurityException when the permission is missing.",
    },
    brief: [
      {
        es: "Antes de nada: si el usuario no puede editar Opportunity (isUpdateable() del objeto), throw new RenewalSecurityException con un mensaje.",
        en: "Before anything: if the user may not edit Opportunity (the object's isUpdateable()), throw new RenewalSecurityException with a message.",
      },
      {
        es: "Después: si no puede editar el campo Discount__c (isUpdateable() del campo), otra RenewalSecurityException con su mensaje.",
        en: "Then: if they may not edit the Discount__c field (the field's isUpdateable()), another RenewalSecurityException with its message.",
      },
      {
        es: "Solo si pasa las dos, la consulta y el update de siempre.",
        en: "Only if both pass, the usual query and update.",
      },
    ],
    starter: {
      es: `// CASO: el puente con el ERP, auditado
// Ya resuelto (tarea 1): cada clase declara qué registros ve.
// Tarea 2 de 6: comprobar los permisos antes de tocar.

public class RenewalSecurityException extends Exception {}

public with sharing class RenewalDesk {
    public static void applyDiscount(Id oppId, Decimal percent) {
        Opportunity o = [SELECT Id, Discount__c FROM Opportunity WHERE Id = :oppId];
        o.Discount__c = percent;
        update o;
    }
}
`,
      en: `// CASE: the ERP bridge, audited
// Already solved (task 1): each class declares which records it sees.
// Task 2 of 6: check permissions before touching.

public class RenewalSecurityException extends Exception {}

public with sharing class RenewalDesk {
    public static void applyDiscount(Id oppId, Decimal percent) {
        Opportunity o = [SELECT Id, Discount__c FROM Opportunity WHERE Id = :oppId];
        o.Discount__c = percent;
        update o;
    }
}
`,
    },
    hints: [
      {
        es: "Yo lo pensaría como lo configuraría en Setup: primero el permiso sobre el objeto, después el del campo. Son dos pantallas distintas y dos preguntas distintas.",
        en: "I would think of it as I would set it up in Setup: first the permission on the object, then the field's. They are two different screens and two different questions.",
      },
      {
        es: "Lo que me ayudó: las dos preguntas empiezan igual, Schema.sObjectType.Opportunity, y la del campo sigue con .fields.Discount__c. Se pregunta con un ! delante: si NO puede, se lanza la excepción.",
        en: "What helped me: both questions start the same, Schema.sObjectType.Opportunity, and the field one continues with .fields.Discount__c. You ask with a ! in front: if they may NOT, the exception is thrown.",
      },
      {
        es: "Te dejo el esquema: if (!Schema.sObjectType.Opportunity.isUpdateable()) { throw new RenewalSecurityException('…'); } if (!Schema.sObjectType.Opportunity.fields.Discount__c.isUpdateable()) { throw new RenewalSecurityException('…'); } y después la consulta y el update.",
        en: "Here is the outline: if (!Schema.sObjectType.Opportunity.isUpdateable()) { throw new RenewalSecurityException('…'); } if (!Schema.sObjectType.Opportunity.fields.Discount__c.isUpdateable()) { throw new RenewalSecurityException('…'); } and then the query and the update.",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m12-l02-c1",
        label: { es: "Comprueba el permiso de edición sobre el objeto", en: "It checks edit permission on the object" },
        rule: {
          op: "match",
          pattern: "if\\s*\\(\\s*!\\s*Schema\\s*\\.\\s*sObjectType\\s*\\.\\s*Opportunity\\s*\\.\\s*isUpdateable\\s*\\(\\s*\\)\\s*\\)\\s*\\{?\\s*throw\\s+new\\s+RenewalSecurityException\\s*\\(\\s*'[^']+'",
        },
        onFail: {
          es: "if (!Schema.sObjectType.Opportunity.isUpdateable()) { throw new RenewalSecurityException('…'); }",
          en: "if (!Schema.sObjectType.Opportunity.isUpdateable()) { throw new RenewalSecurityException('…'); }",
        },
        otter: {
          es: "Es la casilla «Edit» de Opportunity en el perfil: if (!Schema.sObjectType.Opportunity.isUpdateable()) { throw new RenewalSecurityException('…'); }. Si no puede editar el objeto, no hay más que hablar.",
          en: "It is Opportunity's «Edit» checkbox on the profile: if (!Schema.sObjectType.Opportunity.isUpdateable()) { throw new RenewalSecurityException('…'); }. If they cannot edit the object, there is nothing more to discuss.",
        },
      },
      {
        id: "m12-l02-c2",
        label: { es: "Comprueba el permiso sobre el campo", en: "It checks permission on the field" },
        rule: {
          op: "match",
          pattern: "if\\s*\\(\\s*!\\s*Schema\\s*\\.\\s*sObjectType\\s*\\.\\s*Opportunity\\s*\\.\\s*fields\\s*\\.\\s*Discount__c\\s*\\.\\s*isUpdateable\\s*\\(\\s*\\)\\s*\\)\\s*\\{?\\s*throw\\s+new\\s+RenewalSecurityException\\s*\\(\\s*'[^']+'",
        },
        onFail: {
          es: "if (!Schema.sObjectType.Opportunity.fields.Discount__c.isUpdateable()) { throw new RenewalSecurityException('…'); }",
          en: "if (!Schema.sObjectType.Opportunity.fields.Discount__c.isUpdateable()) { throw new RenewalSecurityException('…'); }",
        },
        otter: {
          es: "Y ahora la pantalla Field-Level Security del campo: Schema.sObjectType.Opportunity.fields.Discount__c.isUpdateable(). Poder editar el objeto no significa poder editar todos sus campos.",
          en: "And now the field's Field-Level Security screen: Schema.sObjectType.Opportunity.fields.Discount__c.isUpdateable(). Being able to edit the object does not mean being able to edit all its fields.",
        },
      },
      {
        id: "m12-l02-c3",
        label: { es: "Las comprobaciones van antes del guardado", en: "The checks come before the save" },
        rule: { op: "match", pattern: "isUpdateable\\s*\\(\\s*\\)[\\s\\S]*isUpdateable\\s*\\(\\s*\\)[\\s\\S]*\\bupdate\\s+\\w+\\s*;" },
        onFail: {
          es: "Las dos comprobaciones van al principio del método, antes de la consulta y del update.",
          en: "Both checks go at the top of the method, before the query and the update.",
        },
        otter: {
          es: "Se pregunta antes de tocar: las dos comprobaciones al principio, y solo después la consulta y el update.",
          en: "You ask before touching: both checks at the top, and only then the query and the update.",
        },
      },
    ],
    rubric: [
      {
        es: "Este método tiene dos comprobaciones para un solo campo. ¿Cuántas harían falta si guardara ocho campos? La tarea 3 te da una forma más corta.",
        en: "This method has two checks for a single field. How many would it take if it saved eight fields? Task 3 gives you a shorter way.",
      },
    ],
    voice: "otter",
    outro: {
      es: "El descuento ya no se guarda si quien lo pide no tiene permiso. Pero comprobar campo a campo no escala. En la tarea 3 conoces la forma moderna: pedirle a Salesforce que aplique todos los permisos del usuario de una vez.",
      en: "The discount is no longer saved if whoever asks lacks permission. But checking field by field does not scale. In task 3 you meet the modern way: asking Salesforce to apply all the user's permissions at once.",
    },
  },
};
