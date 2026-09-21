import type { Lesson } from "@/lib/types";

export const l04While: Lesson = {
  id: "m02-l04",
  slug: "while",
  n: 4,
  kind: "lesson",
  minutes: 18,
  title: { es: "While Loop", en: "While Loop" },
  summary: {
    es: "Repetir mientras algo siga siendo cierto: el bucle para cuando no sabes de antemano cuántas vueltas harán falta.",
    en: "Repeat while something is still true: the loop for when you do not know in advance how many passes it will take.",
  },
  analogy: {
    es: "Un conector de Flow que vuelve atrás a un Decision",
    en: "A Flow connector that loops back to a Decision",
  },
  objectives: [
    {
      es: "Escribir un while que se detenga solo porque su cuerpo acerca la condición a false.",
      en: "Write a while that stops on its own because its body moves the condition towards false.",
    },
    {
      es: "Distinguir while de do-while y saber cuándo el cuerpo se ejecuta al menos una vez.",
      en: "Tell while from do-while and know when the body runs at least once.",
    },
    {
      es: "Proteger un bucle con un tope para que un dato inesperado no lo vuelva infinito.",
      en: "Guard a loop with a cap so an unexpected value cannot make it infinite.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Hasta ahora cada línea se ejecutaba como mucho una vez. Un bucle repite un bloque. while es el más sencillo: «mientras la condición sea cierta, vuelve a hacer esto». Es el bucle para cuando no sabes cuántas vueltas hacen falta, solo cuándo parar.",
        en: "Until now each line ran at most once. A loop repeats a block. while is the simplest: “as long as the condition is true, do this again.” It is the loop for when you do not know how many passes are needed, only when to stop.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "En Flow puedes conectar un elemento de vuelta a un Decision anterior: Decision → Assignment → otra vez el Decision, hasta que el Decision mande por la salida de «terminado». Ese circuito es un while. El Decision es la condición y lo que hay en el circuito es el cuerpo del bucle.",
        en: "In Flow you can connect an element back to an earlier Decision: Decision → Assignment → back to the Decision, until the Decision sends you down the “done” outcome. That circuit is a while. The Decision is the condition and what sits in the circuit is the loop body.",
      },
    },
    {
      type: "h",
      text: { es: "Anatomía de un while", en: "Anatomy of a while" },
    },
    {
      type: "code",
      code: {
        es: `Decimal debt = 10000;
Decimal installment = 1500;
Integer payments = 0;

while (debt > 0) {
    debt = debt - installment;
    payments++;
}
System.debug(payments);   // 7`,
        en: `Decimal debt = 10000;
Decimal installment = 1500;
Integer payments = 0;

while (debt > 0) {
    debt = debt - installment;
    payments++;
}
System.debug(payments);   // 7`,
      },
      caption: {
        es: "payments++ suma 1 a payments. Es el atajo de payments = payments + 1.",
        en: "payments++ adds 1 to payments. It is the shortcut for payments = payments + 1.",
      },
    },
    {
      type: "p",
      text: {
        es: "La condición se comprueba antes de cada vuelta, o [[iteracion|iteración]]. Si es true, se ejecuta el bloque entero y se vuelve a comprobar. En cuanto es false, el código sigue debajo del bucle. Si ya era false la primera vez, el cuerpo no se ejecuta ni una vez.",
        en: "The condition is checked before every pass, or [[iteracion|iteration]]. If it is true, the whole block runs and the condition is checked again. As soon as it is false, the code carries on below the loop. If it was already false the first time, the body does not run even once.",
      },
    },
    {
      type: "diagram",
      id: "m02-while",
      caption: {
        es: "Comprobar, ejecutar, volver: el ciclo se rompe solo cuando la condición da false.",
        en: "Check, run, go back: the cycle only breaks when the condition gives false.",
      },
    },
    {
      type: "h",
      text: { es: "La regla de oro: el cuerpo tiene que acercar el final", en: "The golden rule: the body must bring the end closer" },
    },
    {
      type: "p",
      text: {
        es: "Algo dentro del bucle tiene que cambiar lo que mira la condición. Si nada lo cambia, la condición sigue siendo true para siempre: un [[bucle-infinito|bucle infinito]]. En Salesforce eso no cuelga la org, pero la transacción se corta con «Apex CPU time limit exceeded» cuando agota su [[cpu-time|tiempo de CPU]], y lo que el usuario intentaba guardar se pierde.",
        en: "Something inside the loop has to change what the condition looks at. If nothing changes it, the condition stays true forever: an [[bucle-infinito|infinite loop]]. In Salesforce that does not hang the org, but the transaction is cut off with “Apex CPU time limit exceeded” when it runs out of [[cpu-time|CPU time]], and whatever the user was trying to save is lost.",
      },
    },
    {
      type: "code",
      code: {
        es: `Integer attempts = 0;
while (attempts < 3) {
    System.debug('Intento');
    // ❌ falta attempts++: attempts vale 0 para siempre
}`,
        en: `Integer attempts = 0;
while (attempts < 3) {
    System.debug('Attempt');
    // ❌ attempts++ is missing: attempts stays 0 forever
}`,
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Ponle un tope de seguridad", en: "Give it a safety cap" },
      text: {
        es: "Cuando la parada depende de un dato —un porcentaje de crecimiento, una cuota—, un valor inesperado puede impedir que llegue nunca. Añade a la condición un contador con un máximo razonable: while (debt > 0 && payments < 120). El bucle para por el motivo de negocio o por el tope, lo que ocurra antes.",
        en: "When stopping depends on data — a growth rate, an instalment — an unexpected value can mean it never arrives. Add a counter with a reasonable maximum to the condition: while (debt > 0 && payments < 120). The loop stops for the business reason or for the cap, whichever comes first.",
      },
    },
    {
      type: "h",
      text: { es: "do-while: al menos una vez", en: "do-while: at least once" },
    },
    {
      type: "p",
      text: {
        es: "do { … } while (condición); pone la comprobación al final. El cuerpo se ejecuta una vez antes de preguntar nada, así que siempre hace al menos una vuelta. Fíjate en el punto y coma tras el paréntesis: es de los pocos sitios donde un bloque lo lleva.",
        en: "do { … } while (condition); puts the check at the end. The body runs once before asking anything, so it always makes at least one pass. Note the semicolon after the bracket: it is one of the few places where a block takes one.",
      },
    },
    {
      type: "code",
      code: {
        es: `Integer retries = 5;
do {
    retries++;
} while (retries < 3);
System.debug(retries);   // 6: entró una vez aunque 5 < 3 es false`,
        en: `Integer retries = 5;
do {
    retries++;
} while (retries < 3);
System.debug(retries);   // 6: it went in once even though 5 < 3 is false`,
      },
    },
    {
      type: "table",
      head: [
        { es: "Bucle", en: "Loop" },
        { es: "Comprueba…", en: "Checks…" },
        { es: "Vueltas mínimas", en: "Minimum passes" },
      ],
      rows: [
        [
          { es: "while", en: "while" },
          { es: "antes de cada vuelta", en: "before every pass" },
          { es: "0", en: "0" },
        ],
        [
          { es: "do-while", en: "do-while" },
          { es: "después de cada vuelta", en: "after every pass" },
          { es: "1", en: "1" },
        ],
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Cuándo no usar while", en: "When not to use while" },
      text: {
        es: "Si vas a recorrer una lista de registros, while te obliga a llevar tú la cuenta de la posición. Para eso existe for, que es la siguiente sub-lección. while es para cuando la parada depende de un valor que va cambiando, no de cuántos elementos hay.",
        en: "If you are going to walk through a list of records, while forces you to keep track of the position yourself. That is what for is for, the next sub-lesson. while is for when stopping depends on a value that keeps changing, not on how many items there are.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿qué tiene que ocurrir dentro de un while para que termine, y qué ve el usuario si no ocurre?",
        en: "Without looking up: what has to happen inside a while for it to end, and what does the user see if it does not?",
      },
    },
  ],

  quiz: [
    {
      id: "m02-l04-q1",
      kind: "single",
      prompt: { es: "¿Qué muestra este código?", en: "What does this code print?" },
      code: {
        es: `Integer i = 0;
while (i < 3) {
    i++;
}
System.debug(i);`,
        en: `Integer i = 0;
while (i < 3) {
    i++;
}
System.debug(i);`,
      },
      options: [
        { es: "3", en: "3" },
        { es: "2", en: "2" },
        { es: "4", en: "4" },
        { es: "0", en: "0" },
      ],
      answer: 0,
      explain: {
        es: "Vueltas con i = 0, 1 y 2. Tras la tercera, i vale 3, la condición 3 < 3 es false y el bucle termina.",
        en: "Passes with i = 0, 1 and 2. After the third, i is 3, the condition 3 < 3 is false and the loop ends.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m02-l04-q2",
      kind: "single",
      prompt: {
        es: "Este bucle está en un trigger. ¿Qué pasa cuando un usuario guarda un registro?",
        en: "This loop is in a trigger. What happens when a user saves a record?",
      },
      code: {
        es: `Integer processed = 0;
while (processed < 10) {
    System.debug('Procesando');
}`,
        en: `Integer processed = 0;
while (processed < 10) {
    System.debug('Processing');
}`,
      },
      options: [
        {
          es: "La transacción se corta por límite de CPU y el registro no se guarda.",
          en: "The transaction is cut off by the CPU limit and the record is not saved.",
        },
        {
          es: "Se ejecuta 10 veces y termina.",
          en: "It runs 10 times and finishes.",
        },
        {
          es: "No compila.",
          en: "It does not compile.",
        },
        {
          es: "La org se queda colgada hasta que un administrador la reinicia.",
          en: "The org hangs until an administrator restarts it.",
        },
      ],
      answer: 0,
      explain: {
        es: "Nada cambia processed, así que la condición es true para siempre. Salesforce corta la transacción al agotar el tiempo de CPU y deshace todo: el usuario ve un error y el registro no se guarda.",
        en: "Nothing changes processed, so the condition is true forever. Salesforce cuts the transaction off when CPU time runs out and rolls everything back: the user sees an error and the record is not saved.",
      },
      tags: ["find-error"],
    },
    {
      id: "m02-l04-q3",
      kind: "single",
      prompt: { es: "¿Qué muestra este código?", en: "What does this code print?" },
      code: {
        es: `Integer attempts = 5;
do {
    attempts++;
} while (attempts < 3);
System.debug(attempts);`,
        en: `Integer attempts = 5;
do {
    attempts++;
} while (attempts < 3);
System.debug(attempts);`,
      },
      options: [
        { es: "6", en: "6" },
        { es: "5", en: "5" },
        { es: "3", en: "3" },
        { es: "Nunca termina", en: "It never ends" },
      ],
      answer: 0,
      explain: {
        es: "do-while ejecuta el cuerpo antes de comprobar: attempts pasa a 6, luego 6 < 3 es false y termina.",
        en: "do-while runs the body before checking: attempts becomes 6, then 6 < 3 is false and it ends.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m02-l04-q4",
      kind: "text",
      prompt: {
        es: "¿Con qué palabra clave empieza el bucle que ejecuta su cuerpo al menos una vez?",
        en: "Which keyword starts the loop that runs its body at least once?",
      },
      accept: ["do"],
      placeholder: { es: "una palabra", en: "one word" },
      explain: {
        es: "do. do { … } while (condición); comprueba al final de cada vuelta.",
        en: "do. do { … } while (condition); checks at the end of each pass.",
      },
      tags: ["recall"],
    },
    {
      id: "m02-l04-q5",
      kind: "single",
      prompt: { es: "¿Qué muestra este código?", en: "What does this code print?" },
      code: {
        es: `Integer total = 7;
Integer halvings = 0;
while (total > 1) {
    total = total / 2;
    halvings++;
}
System.debug(halvings);`,
        en: `Integer total = 7;
Integer halvings = 0;
while (total > 1) {
    total = total / 2;
    halvings++;
}
System.debug(halvings);`,
      },
      options: [
        { es: "2", en: "2" },
        { es: "3", en: "3" },
        { es: "4", en: "4" },
        { es: "Nunca termina", en: "It never ends" },
      ],
      answer: 0,
      explain: {
        es: "La división entre Integers descarta los decimales: 7 / 2 = 3 y 3 / 2 = 1. Con total = 1 la condición es false. Dos vueltas.",
        en: "Division between Integers drops the decimals: 7 / 2 = 3 and 3 / 2 = 1. With total = 1 the condition is false. Two passes.",
      },
      tags: ["spaced", "interleaving", "predict-output"],
      from: { es: "Repaso · M1 L2", en: "Review · M1 L2" },
    },
    {
      id: "m02-l04-q6",
      kind: "multi",
      prompt: {
        es: "¿En qué casos es while una buena elección?",
        en: "In which cases is while a good choice?",
      },
      options: [
        {
          es: "Calcular cuántos meses tarda un pipeline en llegar a un objetivo si crece un 10 % al mes.",
          en: "Working out how many months a pipeline takes to reach a target if it grows 10% a month.",
        },
        {
          es: "Recorrer los 200 contactos de una lista para ponerles un valor.",
          en: "Walking through 200 contacts in a list to set a value on each.",
        },
        {
          es: "Repartir una deuda en cuotas hasta que quede saldada.",
          en: "Splitting a debt into instalments until it is paid off.",
        },
      ],
      answers: [0, 2],
      explain: {
        es: "while encaja cuando la parada depende de un valor que va cambiando. Para recorrer una lista hay una herramienta mejor: for, la siguiente sub-lección.",
        en: "while fits when stopping depends on a value that keeps changing. To walk through a list there is a better tool: for, the next sub-lesson.",
      },
      tags: ["interleaving"],
    },
  ],

  exercise: {
    prompt: {
      es: "Dirección comercial quiere saber cuántos meses tardará el pipeline actual en alcanzar el objetivo si crece un 10 % cada mes. Como la previsión de crecimiento podría ajustarse a 0 algún día, el cálculo nunca debe pasar de 120 meses.",
      en: "Sales leadership wants to know how many months the current pipeline will take to reach the target if it grows 10% every month. Since the growth forecast might be set to 0 some day, the calculation must never go past 120 months.",
    },
    brief: [
      {
        es: "Parte de pipeline y target del código de partida.",
        en: "Start from pipeline and target in the starter code.",
      },
      {
        es: "Declara un Integer llamado months que empiece en 0.",
        en: "Declare an Integer named months starting at 0.",
      },
      {
        es: "Con un while, haz crecer pipeline un 10 % en cada vuelta y cuenta los meses, mientras no llegue al objetivo.",
        en: "With a while, grow pipeline by 10% on each pass and count the months, as long as it has not reached the target.",
      },
      {
        es: "El bucle también debe parar al llegar a 120 meses, pase lo que pase.",
        en: "The loop must also stop on reaching 120 months, no matter what.",
      },
    ],
    starter: {
      es: `Decimal pipeline = 50000;
Decimal target = 80000;

// Cuenta cuántos meses hacen falta con un while.
`,
      en: `Decimal pipeline = 50000;
Decimal target = 80000;

// Count how many months it takes with a while.
`,
    },
    hints: [
      {
        es: "Tres cosas tienen que estar en su sitio: un contador que empiece en 0, una condición que mire pipeline y target, y un cuerpo que cambie pipeline y el contador.",
        en: "Three things need to be in place: a counter starting at 0, a condition that looks at pipeline and target, and a body that changes both pipeline and the counter.",
      },
      {
        es: "Crecer un 10 % es multiplicar por 1.10. El tope se añade a la condición con &&: el bucle sigue solo si no ha llegado al objetivo y además no ha llegado a 120.",
        en: "Growing by 10% means multiplying by 1.10. The cap is added to the condition with &&: the loop continues only if it has not reached the target and has not reached 120 either.",
      },
      {
        es: "Pseudocódigo: Integer months = 0; mientras (pipeline < target && months < 120) { pipeline = pipeline * 1.10; months++; }",
        en: "Pseudocode: Integer months = 0; while (pipeline < target && months < 120) { pipeline = pipeline * 1.10; months++; }",
      },
    ],
    solution: {
      es: `Decimal pipeline = 50000;
Decimal target = 80000;

Integer months = 0;
while (pipeline < target && months < 120) {
    pipeline = pipeline * 1.10;
    months++;
}
System.debug(months);   // 5`,
      en: `Decimal pipeline = 50000;
Decimal target = 80000;

Integer months = 0;
while (pipeline < target && months < 120) {
    pipeline = pipeline * 1.10;
    months++;
}
System.debug(months);   // 5`,
    },
    checks: [
      {
        id: "m02-l04-c1",
        label: { es: "months es un Integer que empieza en 0", en: "months is an Integer starting at 0" },
        rule: { op: "match", pattern: "Integer\\s+months\\s*=\\s*0\\s*;" },
        onFail: {
          es: "Los meses se cuentan desde cero: Integer months = 0; antes del bucle, fuera de él.",
          en: "Months are counted from zero: Integer months = 0; before the loop, outside it.",
        },
      },
      {
        id: "m02-l04-c2",
        label: {
          es: "Un while que sigue mientras pipeline no llegue a target",
          en: "A while that continues while pipeline has not reached target",
        },
        rule: { op: "match", pattern: "while\\s*\\([^)]*pipeline\\s*<\\s*target" },
        onFail: {
          es: "La condición de negocio es «todavía no hemos llegado»: pipeline < target.",
          en: "The business condition is “we are not there yet”: pipeline < target.",
        },
      },
      {
        id: "m02-l04-c3",
        label: {
          es: "La condición incluye el tope de 120 meses",
          en: "The condition includes the 120-month cap",
        },
        rule: {
          op: "match",
          pattern: "while\\s*\\([^)]*&&[^)]*months\\s*(<\\s*120|<=\\s*119)|while\\s*\\([^)]*months\\s*(<\\s*120|<=\\s*119)[^)]*&&",
        },
        onFail: {
          es: "Si el crecimiento fuese 0, pipeline nunca llegaría. Añade && months < 120 a la condición para que el bucle tenga siempre una salida.",
          en: "If growth were 0, pipeline would never get there. Add && months < 120 to the condition so the loop always has a way out.",
        },
        onPass: {
          es: "Un tope razonable convierte un posible límite de CPU en un resultado que puedes revisar.",
          en: "A reasonable cap turns a possible CPU limit into a result you can inspect.",
        },
      },
      {
        id: "m02-l04-c4",
        label: {
          es: "Cada vuelta hace crecer pipeline un 10 %",
          en: "Each pass grows pipeline by 10%",
        },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "pipeline\\s*=\\s*pipeline\\s*\\*\\s*1\\.10?\\b" },
            { op: "match", pattern: "pipeline\\s*\\*=\\s*1\\.10?\\b" },
            { op: "match", pattern: "pipeline\\s*=\\s*pipeline\\s*\\+\\s*pipeline\\s*\\*\\s*0?\\.10?\\b" },
            { op: "match", pattern: "pipeline\\s*\\+=\\s*pipeline\\s*\\*\\s*0?\\.10?\\b" },
          ],
        },
        onFail: {
          es: "Si pipeline no cambia dentro del bucle, la condición no cambia nunca. Crecer un 10 % es pipeline = pipeline * 1.10;",
          en: "If pipeline does not change inside the loop, the condition never changes. Growing 10% is pipeline = pipeline * 1.10;",
        },
      },
      {
        id: "m02-l04-c5",
        label: { es: "Cada vuelta suma un mes", en: "Each pass adds a month" },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "months\\s*\\+\\+" },
            { op: "match", pattern: "\\+\\+\\s*months" },
            { op: "match", pattern: "months\\s*\\+=\\s*1\\s*;" },
            { op: "match", pattern: "months\\s*=\\s*months\\s*\\+\\s*1\\s*;" },
          ],
        },
        onFail: {
          es: "Sin sumar 1 a months, el tope nunca llega y el resultado siempre es 0.",
          en: "Without adding 1 to months, the cap never arrives and the result is always 0.",
        },
      },
    ],
    rubric: [
      {
        es: "Cambia target a 5000000 y el crecimiento a 1.0. ¿Termina? ¿Qué valor da months?",
        en: "Change target to 5000000 and the growth to 1.0. Does it finish? What value does months give?",
      },
    ],
  },
};
