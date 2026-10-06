import type { Lesson } from "@/lib/types";

const BODY = (desk: string, stats: string, finder: string, c1: string, c2: string, c3: string) => `${c1}
${desk} RenewalDesk {
    public static List<Opportunity> myOpenRenewals() {
        return [SELECT Id, Name, Amount, StageName FROM Opportunity
                WHERE Type = 'Renewal' AND IsClosed = false];
    }
}

${c2}
${stats} RenewalStats {
    public static Integer countOpen() {
        return [SELECT COUNT() FROM Opportunity WHERE Type = 'Renewal' AND IsClosed = false];
    }
}

${c3}
${finder} RenewalFinder {
    public static List<Opportunity> byAccount(Id accountId) {
        return [SELECT Id, Name, StageName FROM Opportunity
                WHERE Type = 'Renewal' AND AccountId = :accountId];
    }
}`;

const C_ES = [
  "// El panel «Mis renovaciones» de cada comercial: solo las que puede ver",
  "// El contador de la pantalla de Dirección: tiene que contar todas, las vea o no quien mira",
  "// Una utilidad que llaman las dos: que herede el modo de quien la llama",
];
const C_EN = [
  "// Each rep's «My renewals» panel: only the ones they can see",
  "// The counter on the Management screen: it must count all, whether or not the viewer can see them",
  "// A utility both call: let it inherit its caller's mode",
];

const HEAD_ES = "// CASO: el puente con el ERP, auditado\n// Tarea 1 de 6: quién ve qué registros.\n\n";
const HEAD_EN = "// CASE: the ERP bridge, audited\n// Task 1 of 6: who sees which records.\n\n";

const SOLUTION_ES =
  HEAD_ES + BODY("public with sharing class", "public without sharing class", "public inherited sharing class", C_ES[0], C_ES[1], C_ES[2]);
const SOLUTION_EN =
  HEAD_EN + BODY("public with sharing class", "public without sharing class", "public inherited sharing class", C_EN[0], C_EN[1], C_EN[2]);

const STARTER_ES =
  "// CASO: el puente con el ERP, auditado\n// Ya resuelto (Módulos 8 a 11): el puente funciona, está probado y habla con otros sistemas.\n// Tarea 1 de 6: quién ve qué registros.\n\n// Las tres clases son de la versión 58 de la API: sin declaración, se ejecutan sin sharing.\n\n" +
  BODY("public class", "public class", "public class", C_ES[0], C_ES[1], C_ES[2]) +
  "\n";
const STARTER_EN =
  "// CASE: the ERP bridge, audited\n// Already solved (Modules 8 to 11): the bridge works, is tested and talks to other systems.\n// Task 1 of 6: who sees which records.\n\n// All three classes are on API version 58: with no declaration, they run without sharing.\n\n" +
  BODY("public class", "public class", "public class", C_EN[0], C_EN[1], C_EN[2]) +
  "\n";

export const l01Sharing: Lesson = {
  id: "m12-l01",
  slug: "sharing",
  n: 1,
  kind: "lesson",
  minutes: 25,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso del Módulo 11", en: "Remember? · Review of Module 11" },
    prompt: {
      es: "En el servicio REST del Módulo 11 escribiste global with sharing class. ¿Para qué era with sharing?",
      en: "In Module 11's REST service you wrote global with sharing class. What was with sharing for?",
    },
    options: [
      { es: "Para que el código respete qué registros puede ver quien llama", en: "So the code respects which records the caller can see" },
      { es: "Para que la clase se vea desde fuera", en: "So the class is visible from outside" },
      { es: "Para que el JSON salga bien", en: "So the JSON comes out right" },
    ],
    answer: 0,
    explain: {
      es: "Lo escribiste sin detalle. Hoy lo entiendes: es la primera de las cuatro preguntas de seguridad de este módulo.",
      en: "You wrote it without detail. Today you understand it: it is the first of this module's four security questions.",
    },
  },
  title: { es: "with sharing, without sharing e inherited sharing", en: "with sharing, without sharing and inherited sharing" },
  summary: {
    es: "El sharing decide qué registros ve cada usuario. Una clase de Apex elige, con dos palabras en su cabecera, si lo respeta o no. La regla profesional: no dejarlo al valor por defecto, que además ha cambiado.",
    en: "Sharing decides which records each user sees. An Apex class chooses, with two words in its header, whether to respect it or not. The professional rule: do not leave it to the default, which has also changed.",
  },
  analogy: {
    es: "El ajuste «How to Run the Flow»: contexto de usuario o de sistema, con o sin sharing",
    en: "The «How to Run the Flow» setting: user or system context, with or without sharing",
  },
  objectives: [
    { es: "Explicar qué hace cada una de las tres declaraciones de sharing.", en: "Explain what each of the three sharing declarations does." },
    { es: "Elegir la declaración según lo que la clase tiene que mostrar.", en: "Choose the declaration by what the class has to show." },
    { es: "Saber qué pasa cuando no se declara nada, según la versión de la API.", en: "Know what happens when nothing is declared, depending on the API version." },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Antes de pasar el puente a producción, el equipo de Seguridad lo audita. Primer hallazgo: un comercial abre el panel «Mis renovaciones» y ve las de toda la empresa, incluidas las de cuentas que no son suyas. En la interfaz, el sharing se lo impediría. El código no se lo impide, porque nadie le dijo que lo respetara.",
        en: "Before the bridge goes to production, the Security team audits it. First finding: a sales rep opens the «My renewals» panel and sees the whole company's, including those of accounts that are not theirs. In the UI, sharing would stop them. The code does not, because nobody told it to respect it.",
      },
    },
    {
      type: "h",
      text: { es: "Tres declaraciones", en: "Three declarations" },
    },
    {
      type: "table",
      head: [
        { es: "En la cabecera", en: "In the header" },
        { es: "Qué registros ve la clase", en: "Which records the class sees" },
        { es: "Úsala cuando…", en: "Use it when…" },
      ],
      rows: [
        [
          { es: "with sharing", en: "with sharing" },
          { es: "Los que puede ver el usuario: OWD, jerarquía de roles, reglas de sharing.", en: "The ones the user can see: OWD, role hierarchy, sharing rules." },
          { es: "El resultado se le enseña a un usuario. Es tu opción habitual.", en: "The result is shown to a user. It is your usual choice." },
        ],
        [
          { es: "without sharing", en: "without sharing" },
          { es: "Todos, los pueda ver el usuario o no.", en: "All of them, whether the user can see them or not." },
          { es: "El proceso necesita la foto completa: un total para Dirección, un trabajo nocturno. Con un comentario que diga por qué.", en: "The process needs the full picture: a total for Management, a nightly job. With a comment saying why." },
        ],
        [
          { es: "inherited sharing", en: "inherited sharing" },
          { es: "Lo que decida quien la llama; si nadie la llama, como with sharing.", en: "Whatever its caller decides; if nobody calls it, like with sharing." },
          { es: "Una utilidad que usan clases de los dos tipos.", en: "A utility used by classes of both kinds." },
        ],
      ],
    },
    {
      type: "diagram",
      id: "m12-sharing",
      caption: {
        es: "Elige quién ejecuta y con qué declaración, y mira qué renovaciones devuelve la consulta.",
        en: "Choose who runs it and with which declaration, and see which renewals the query returns.",
      },
    },
    {
      type: "h",
      text: { es: "Si no declaras nada", en: "If you declare nothing" },
    },
    {
      type: "p",
      text: {
        es: "Aquí hay historia. Hasta la versión 66 de la API, una clase sin declaración se ejecutaba sin sharing cuando era el punto de entrada: por eso tanto código antiguo enseña más de la cuenta. Desde la versión 67 (Summer '26), una clase sin declaración usa with sharing. Como en una org conviven clases de muchas versiones, la regla profesional es no depender de ese valor: escribe siempre una de las tres. Y un detalle que no cambia: un trigger se ejecuta siempre con todo el poder, y es la clase a la que llama la que decide.",
        en: "There is history here. Up to API version 66, a class with no declaration ran without sharing when it was the entry point: that is why so much old code shows more than it should. From version 67 (Summer '26), a class with no declaration uses with sharing. Since an org holds classes from many versions, the professional rule is not to rely on that default: always write one of the three. And one detail that does not change: a trigger always runs with full power, and it is the class it calls that decides.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Sharing no es permisos", en: "Sharing is not permissions" },
      text: {
        es: "with sharing solo decide qué REGISTROS ve la clase. No mira si el usuario tiene permiso sobre el objeto ni si puede ver cada campo: eso son los permisos de objeto y la seguridad a nivel de campo, y son las tareas 2 y 3. Una clase with sharing puede seguir enseñando un campo que el usuario no debería ver.",
        en: "with sharing only decides which RECORDS the class sees. It does not check whether the user has permission on the object or may see each field: those are object permissions and field-level security, and they are tasks 2 and 3. A with sharing class can still show a field the user should not see.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque Flow te hace la misma pregunta", en: "Why not a Flow? Because Flow asks you the same question" },
      text: {
        es: "Con franqueza: esto no es algo que Flow no sepa hacer, es algo que ya hacías. En «How to Run the Flow» eliges contexto de usuario, contexto de sistema con sharing o contexto de sistema sin sharing, y un flow desencadenado por registro corre en contexto de sistema por defecto. Es exactamente esta decisión. En Flow es un desplegable; en Apex, dos palabras en la cabecera. Lo que cambia es que el código lo revisa menos gente, así que el descuido tarda más en verse.",
        en: "Frankly: this is not something Flow cannot do, it is something you already did. In «How to Run the Flow» you choose user context, system context with sharing or system context without sharing, and a record-triggered flow runs in system context by default. It is exactly this decision. In Flow it is a dropdown; in Apex, two words in the header. What changes is that fewer people review code, so the slip takes longer to show.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué ve una clase with sharing y qué una without sharing? ¿Qué hace inherited sharing? ¿Por qué conviene declarar siempre una de las tres?",
        en: "Without looking: what does a with sharing class see and what a without sharing one? What does inherited sharing do? Why is it wise to always declare one of the three?",
      },
    },
  ],

  quiz: [
    {
      id: "m12-l01-q1",
      kind: "single",
      prompt: {
        es: "Un comercial que solo ve sus 12 renovaciones ejecuta una consulta dentro de una clase without sharing. La org tiene 4.000. ¿Cuántas devuelve?",
        en: "A rep who only sees their 12 renewals runs a query inside a without sharing class. The org has 4,000. How many does it return?",
      },
      options: [
        { es: "4.000", en: "4,000" },
        { es: "12", en: "12" },
        { es: "0", en: "0" },
        { es: "Salta una excepción", en: "An exception is thrown" },
      ],
      answer: 0,
      explain: {
        es: "without sharing ignora el sharing del usuario: la consulta ve todos los registros.",
        en: "without sharing ignores the user's sharing: the query sees every record.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m12-l01-q2",
      kind: "single",
      prompt: { es: "¿Qué decide with sharing?", en: "What does with sharing decide?" },
      options: [
        { es: "Qué registros ve la clase; no los permisos de objeto ni de campo", en: "Which records the class sees; not object or field permissions" },
        { es: "Qué campos puede ver el usuario", en: "Which fields the user can see" },
        { es: "Si el usuario puede crear registros", en: "Whether the user can create records" },
        { es: "Todo lo anterior", en: "All of the above" },
      ],
      answer: 0,
      explain: {
        es: "Sharing es acceso a registros. Los permisos de objeto y de campo van aparte.",
        en: "Sharing is record access. Object and field permissions are separate.",
      },
    },
    {
      id: "m12-l01-q3",
      kind: "single",
      prompt: {
        es: "Una clase sin declaración de sharing, en la versión 58 de la API, es el punto de entrada. ¿Cómo se ejecuta?",
        en: "A class with no sharing declaration, on API version 58, is the entry point. How does it run?",
      },
      options: [
        { es: "Sin sharing", en: "Without sharing" },
        { es: "Con sharing", en: "With sharing" },
        { es: "No compila", en: "It does not compile" },
        { es: "Depende del perfil", en: "It depends on the profile" },
      ],
      answer: 0,
      explain: {
        es: "Hasta la versión 66, sin declaración era sin sharing. Desde la 67, con sharing. Por eso se declara siempre.",
        en: "Up to version 66, no declaration meant without sharing. From 67, with sharing. That is why you always declare.",
      },
    },
    {
      id: "m12-l01-q4",
      kind: "text",
      prompt: {
        es: "Escribe la cabecera de una clase public llamada RenewalFinder que herede el modo de sharing de quien la llama.",
        en: "Write the header of a public class called RenewalFinder that inherits its caller's sharing mode.",
      },
      accept: ["public\\s+inherited\\s+sharing\\s+class\\s+renewalfinder\\s*\\{?"],
      placeholder: { es: "public …", en: "public …" },
      explain: { es: "public inherited sharing class RenewalFinder", en: "public inherited sharing class RenewalFinder" },
      tags: ["recall"],
    },
    {
      id: "m12-l01-q5",
      kind: "single",
      prompt: {
        es: "El Batch nocturno que sincroniza todas las renovaciones con el ERP, ¿qué declaración lleva?",
        en: "The nightly Batch syncing every renewal with the ERP, which declaration does it carry?",
      },
      options: [
        { es: "without sharing, con un comentario que explique por qué", en: "without sharing, with a comment explaining why" },
        { es: "with sharing", en: "with sharing" },
        { es: "Ninguna: da igual", en: "None: it does not matter" },
        { es: "inherited sharing", en: "inherited sharing" },
      ],
      answer: 0,
      explain: {
        es: "Tiene que ver todas las renovaciones, las de cualquier propietario. Es un uso legítimo de without sharing, y se documenta.",
        en: "It must see every renewal, of any owner. It is a legitimate use of without sharing, and it is documented.",
      },
    },
    {
      id: "m12-l01-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿qué modificador hace que un método solo se pueda llamar desde su propia clase?",
        en: "Review: which modifier makes a method callable only from its own class?",
      },
      options: [
        { es: "private", en: "private" },
        { es: "with sharing", en: "with sharing" },
        { es: "global", en: "global" },
        { es: "static", en: "static" },
      ],
      answer: 0,
      explain: {
        es: "private controla quién puede llamar al código; el sharing, qué registros ve. Son cosas distintas.",
        en: "private controls who may call the code; sharing, which records it sees. They are different things.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M5 L6", en: "Review · M5 L6" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 1 DE 6 · Primer hallazgo de la auditoría: tres clases del puente no declaran sharing, y un comercial ve las renovaciones de toda la empresa. Declara en cada una lo que le corresponde según para qué sirve.",
      en: "TASK 1 OF 6 · The audit's first finding: three bridge classes declare no sharing, and a rep sees the whole company's renewals. Declare in each what fits its purpose.",
    },
    brief: [
      {
        es: "RenewalDesk enseña a cada comercial sus renovaciones: tiene que respetar lo que ese usuario puede ver.",
        en: "RenewalDesk shows each rep their renewals: it must respect what that user can see.",
      },
      {
        es: "RenewalStats cuenta todas las renovaciones abiertas para Dirección, las vea o no quien mira la pantalla.",
        en: "RenewalStats counts every open renewal for Management, whether or not the viewer can see them.",
      },
      {
        es: "RenewalFinder es una utilidad que llaman las otras dos: que se comporte como quien la llama.",
        en: "RenewalFinder is a utility the other two call: let it behave like its caller.",
      },
    ],
    starter: { es: STARTER_ES, en: STARTER_EN },
    hints: [
      {
        es: "Yo me haría la pregunta del desplegable de un flow: ¿el resultado se le enseña a un usuario concreto, o el proceso necesita verlo todo?",
        en: "I would ask the flow dropdown's question: is the result shown to a specific user, or does the process need to see everything?",
      },
      {
        es: "Lo que me ayudó: las dos palabras van entre public y class. Para lo que ve un usuario, with sharing; para lo que necesita la foto completa, without sharing; para una utilidad compartida, inherited sharing.",
        en: "What helped me: the two words go between public and class. For what a user sees, with sharing; for what needs the full picture, without sharing; for a shared utility, inherited sharing.",
      },
      {
        es: "Te dejo el esquema: public with sharing class RenewalDesk · public without sharing class RenewalStats · public inherited sharing class RenewalFinder",
        en: "Here is the outline: public with sharing class RenewalDesk · public without sharing class RenewalStats · public inherited sharing class RenewalFinder",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m12-l01-c1",
        label: { es: "El panel del comercial respeta el sharing", en: "The rep's panel respects sharing" },
        rule: { op: "match", pattern: "public\\s+with\\s+sharing\\s+class\\s+RenewalDesk\\b" },
        onFail: { es: "public with sharing class RenewalDesk", en: "public with sharing class RenewalDesk" },
        otter: {
          es: "Lo que ve un comercial tiene que pasar por su sharing, igual que un flow en contexto de usuario: public with sharing class RenewalDesk.",
          en: "What a rep sees must go through their sharing, just like a flow in user context: public with sharing class RenewalDesk.",
        },
      },
      {
        id: "m12-l01-c2",
        label: { es: "El contador de Dirección ve todas", en: "Management's counter sees all" },
        rule: { op: "match", pattern: "public\\s+without\\s+sharing\\s+class\\s+RenewalStats\\b" },
        onFail: { es: "public without sharing class RenewalStats", en: "public without sharing class RenewalStats" },
        otter: {
          es: "El total de Dirección no puede depender de quién abra la pantalla: public without sharing class RenewalStats. Es legítimo, y el comentario de encima dice por qué.",
          en: "Management's total cannot depend on who opens the screen: public without sharing class RenewalStats. It is legitimate, and the comment above says why.",
        },
      },
      {
        id: "m12-l01-c3",
        label: { es: "La utilidad hereda el modo de quien la llama", en: "The utility inherits its caller's mode" },
        rule: { op: "match", pattern: "public\\s+inherited\\s+sharing\\s+class\\s+RenewalFinder\\b" },
        onFail: { es: "public inherited sharing class RenewalFinder", en: "public inherited sharing class RenewalFinder" },
        otter: {
          es: "La utilidad no sabe para quién trabaja: que lo decida quien la llama. public inherited sharing class RenewalFinder.",
          en: "The utility does not know who it works for: let its caller decide. public inherited sharing class RenewalFinder.",
        },
      },
    ],
    rubric: [
      {
        es: "Si RenewalStats (without sharing) llama a RenewalFinder (inherited sharing), ¿la consulta de RenewalFinder respeta el sharing? ¿Y si la llama RenewalDesk?",
        en: "If RenewalStats (without sharing) calls RenewalFinder (inherited sharing), does RenewalFinder's query respect sharing? And if RenewalDesk calls it?",
      },
    ],
    voice: "otter",
    outro: {
      es: "Cada clase dice ya qué registros ve. Pero el sharing no mira permisos: en la tarea 2, un becario sin permiso de edición sobre Opportunity aplica un descuento desde el panel, y el código se lo permite.",
      en: "Each class now says which records it sees. But sharing does not check permissions: in task 2, an intern with no edit permission on Opportunity applies a discount from the panel, and the code lets them.",
    },
  },
};
