import type { Lesson } from "@/lib/types";

const SOLUTION_ES = `// CASO: el puente nocturno con el ERP de Northwind
// Tarea 1 de 6: que un importe mal escrito no tumbe la importación.

List<String> rawAmounts = new List<String>{ '12500.00', '8300.50', '12.500,00', '', '4100' };
Decimal total = 0;
Integer failed = 0;
Integer processed = 0;

for (String raw : rawAmounts) {
    try {
        Decimal amount = Decimal.valueOf(raw);
        total += amount;
    } catch (TypeException e) {
        failed++;
        System.debug('Importe no válido «' + raw + '»: ' + e.getMessage());
    } finally {
        processed++;
    }
}

System.debug('Total importado: ' + total + ' · fallidos: ' + failed + ' · procesados: ' + processed);`;

const SOLUTION_EN = `// CASE: Northwind's nightly bridge with the ERP
// Task 1 of 6: a badly written amount must not bring the import down.

List<String> rawAmounts = new List<String>{ '12500.00', '8300.50', '12.500,00', '', '4100' };
Decimal total = 0;
Integer failed = 0;
Integer processed = 0;

for (String raw : rawAmounts) {
    try {
        Decimal amount = Decimal.valueOf(raw);
        total += amount;
    } catch (TypeException e) {
        failed++;
        System.debug('Invalid amount «' + raw + '»: ' + e.getMessage());
    } finally {
        processed++;
    }
}

System.debug('Total imported: ' + total + ' · failed: ' + failed + ' · processed: ' + processed);`;

export const l01TryCatchFinally: Lesson = {
  id: "m08-l01",
  slug: "try-catch-finally",
  n: 1,
  kind: "lesson",
  minutes: 30,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso del Módulo 7", en: "Remember? · Review of Module 7" },
    prompt: {
      es: "¿Qué hace un return; como primera línea del trigger cuando el usuario tiene el permiso de bypass?",
      en: "What does a return; as the trigger's first line do when the user has the bypass permission?",
    },
    options: [
      { es: "Sale del trigger sin aplicar ninguna regla", en: "It leaves the trigger without applying any rule" },
      { es: "Deshace el guardado", en: "It undoes the save" },
      { es: "Muestra un error al usuario", en: "It shows the user an error" },
    ],
    answer: 0,
    explain: {
      es: "Sale sin hacer nada y el guardado sigue. Hoy aprendes lo contrario: qué hacer cuando algo sí falla, sin que se pare todo.",
      en: "It leaves without doing anything and the save goes on. Today you learn the opposite: what to do when something does fail, without everything stopping.",
    },
  },
  title: { es: "try, catch y finally", en: "try, catch and finally" },
  summary: {
    es: "Hasta ahora, cuando algo fallaba, la transacción entera se paraba. Con try, catch y finally decides tú qué pasa: qué se intenta, qué se hace si falla y qué se hace siempre.",
    en: "Until now, when something failed, the whole transaction stopped. With try, catch and finally you decide what happens: what is attempted, what to do if it fails and what to do always.",
  },
  analogy: {
    es: "El fault path de un elemento de Flow",
    en: "A Flow element's fault path",
  },
  objectives: [
    {
      es: "Explicar qué pasa cuando una excepción no se captura y por qué se deshace la transacción.",
      en: "Explain what happens when an exception is not caught and why the transaction is rolled back.",
    },
    {
      es: "Rodear con try solo la parte que puede fallar y capturar un tipo concreto de excepción.",
      en: "Wrap only the part that can fail in try and catch a specific exception type.",
    },
    {
      es: "Usar finally para lo que tiene que ocurrir siempre, haya fallo o no.",
      en: "Use finally for what must always happen, failure or not.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Hasta ahora, cuando algo fallaba en tu código —un null, un límite, un registro que no se podía guardar—, Apex lanzaba una excepción, la transacción entera se paraba y todo lo hecho se deshacía. Es un buen comportamiento por defecto, pero no siempre es el que quiere el negocio. En este módulo aprendes a decidir tú qué pasa cuando algo falla.",
        en: "Until now, when something failed in your code — a null, a limit, a record that could not be saved — Apex threw an exception, the whole transaction stopped and everything done was undone. It is a good default, but not always what the business wants. In this module you learn to decide yourself what happens when something fails.",
      },
    },
    {
      type: "h",
      text: { es: "El encargo de este módulo", en: "This module's assignment" },
    },
    {
      type: "p",
      text: {
        es: "Cada noche, el ERP de Northwind deja en un objeto intermedio, ERP_Renewal__c, las renovaciones que se firmaron ese día: el código de la cuenta en el ERP y el importe. Hay que convertirlas en oportunidades de renovación en Salesforce antes de que llegue el equipo de Ventas. El problema es que los datos del ERP no son perfectos: importes mal escritos, códigos de cuenta que no existen, propietarios que ya no están en la empresa. Los seis talleres construyen ese puente, pieza a pieza, hasta que ninguna fila mala pueda tumbar a las buenas.",
        en: "Every night, Northwind's ERP drops into a staging object, ERP_Renewal__c, the renewals signed that day: the account's ERP code and the amount. They have to become renewal opportunities in Salesforce before the Sales team arrives. The problem is that the ERP's data is not perfect: badly written amounts, account codes that do not exist, owners who have left the company. The six workshops build that bridge, piece by piece, until no bad row can bring down the good ones.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "¿Y por qué no un Flow? Porque ya lo intentamos", en: "Why not a Flow? Because we already tried" },
      text: {
        es: "Te lo cuento porque lo viví: primero lo montamos con clics. Un Scheduled Flow que cada noche hacía un Get Records de ERP_Renewal__c, recorría la colección con un Loop y, dentro del Loop, un Create Records por fila con un fault path que guardaba un registro de log. La primera noche llegaron 320 filas: un DML por vuelta, y en la 151 saltó «Too many DML statements: 151». La transacción entera se deshizo, también las 150 renovaciones ya creadas, y ese límite no se puede capturar: no hay fault path que lo salve. Sacamos el Create Records del Loop y chocamos con lo siguiente: una fila con una cuenta equivocada hacía fallar el elemento entero. Activamos la opción de éxito parcial que Create Records tiene desde Winter '25 y guardó las buenas, sí, pero sin decirnos cuáles habían fallado ni por qué, y el ERP necesita esa respuesta fila a fila. Ahí decidimos que era trabajo para Apex.",
        en: "I am telling you because I lived it: first we built it with clicks. A Scheduled Flow that every night ran a Get Records on ERP_Renewal__c, walked the collection with a Loop and, inside the Loop, a Create Records per row with a fault path that saved a log record. The first night 320 rows arrived: one DML per pass, and at 151 came «Too many DML statements: 151». The whole transaction was rolled back, including the 150 renewals already created, and that limit cannot be caught: no fault path saves it. We moved the Create Records out of the Loop and hit the next wall: one row with a wrong account made the whole element fail. We switched on the partial success option Create Records has had since Winter '25 and it saved the good ones, yes, but without telling us which had failed or why, and the ERP needs that answer row by row. That is when we decided it was a job for Apex.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Las seis piezas del puente con el ERP", en: "The six pieces of the ERP bridge" },
      text: {
        es: "1 · Que un importe mal escrito no tumbe la importación. 2 · Reconocer qué ha fallado: no es lo mismo una cuenta que no existe que un guardado rechazado. 3 · Sacar la validación de cada fila a un método que avise cuando algo no cuadra. 4 · Errores con nombre propio, los del negocio de Northwind. 5 · Que Salesforce rechace una segunda renovación abierta para la misma cuenta, fila a fila. 6 · La entrega: la importación nocturna completa, con su informe para el ERP.",
        en: "1 · A badly written amount must not bring the import down. 2 · Recognise what failed: an account that does not exist is not the same as a rejected save. 3 · Move each row's validation into a method that raises the alarm when something is off. 4 · Errors with their own name, Northwind's business ones. 5 · Salesforce rejecting a second open renewal for the same account, row by row. 6 · The delivery: the full nightly import, with its report for the ERP.",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "Qué es una excepción, y qué pasa si nadie la atrapa", en: "What an exception is, and what happens if nobody catches it" },
    },
    {
      type: "p",
      text: {
        es: "Una [[excepcion|excepción]] es la forma que tiene Apex de decir «no puedo seguir»: convertir 'doce' en un número, leer un campo de un null, guardar un registro que una regla de validación rechaza. En el momento en que ocurre, Apex deja de ejecutar la línea siguiente y busca, hacia arriba, alguien que se haga cargo. Si nadie lo hace, la excepción llega hasta la plataforma: la transacción se detiene, todos sus cambios se deshacen y el usuario —o el correo del Admin— recibe el mensaje de error.",
        en: "An [[excepcion|exception]] is Apex's way of saying «I cannot go on»: turning 'twelve' into a number, reading a field from a null, saving a record a validation rule rejects. The moment it happens, Apex stops running the next line and looks upwards for someone to take charge. If nobody does, the exception reaches the platform: the transaction stops, all its changes are undone and the user — or the Admin's inbox — gets the error message.",
      },
    },
    {
      type: "h",
      text: { es: "try, catch y finally", en: "try, catch and finally" },
    },
    {
      type: "p",
      text: {
        es: "Con tres palabras decides tú. En try va lo que puede fallar. En catch, lo que haces si falla, y solo se ejecuta cuando salta una excepción del tipo que indicas entre paréntesis. En finally, lo que tiene que ocurrir siempre, haya fallado o no. Cuando un catch se hace cargo, el error se considera tratado: la transacción no se deshace y el código sigue en la línea siguiente a todo el bloque.",
        en: "With three words you decide. try holds what can fail. catch holds what you do if it fails, and it only runs when an exception of the type you name in brackets is thrown. finally holds what must always happen, failure or not. When a catch takes charge, the error counts as handled: the transaction is not rolled back and the code carries on at the line after the whole block.",
      },
    },
    {
      type: "code",
      code: {
        es: `try {
    Decimal amount = Decimal.valueOf('12.500,00');   // ← falla: no es un número para Apex
    System.debug('Importe: ' + amount);              // no llega a ejecutarse
} catch (TypeException e) {
    System.debug('Importe no válido: ' + e.getMessage());
} finally {
    System.debug('Fila procesada');                  // se ejecuta siempre
}
System.debug('Y el código sigue');`,
        en: `try {
    Decimal amount = Decimal.valueOf('12.500,00');   // ← fails: not a number to Apex
    System.debug('Amount: ' + amount);               // never runs
} catch (TypeException e) {
    System.debug('Invalid amount: ' + e.getMessage());
} finally {
    System.debug('Row processed');                   // always runs
}
System.debug('And the code carries on');`,
      },
      caption: {
        es: "La e del catch es la propia excepción: getMessage() te da el motivo. Apex espera el punto como separador decimal, así que '12.500,00' no es un número válido.",
        en: "The catch's e is the exception itself: getMessage() gives you the reason. Apex expects a dot as the decimal separator, so '12.500,00' is not a valid number.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El fault path de tus flows", en: "Your flows' fault path" },
      text: {
        es: "Tú ya has hecho esto con clics, como yo: en un elemento de Flow que puede fallar —un Create Records, un Update Records— arrastras el conector de fallo (fault path) hacia otro camino, por ejemplo uno que manda un aviso. El elemento es tu try y el fault path es tu catch. Lo que Flow no tiene es finally: un tramo que se ejecute tanto si el elemento fue bien como si falló, sin tener que dibujarlo dos veces.",
        en: "You have done this with clicks, as I have: on a Flow element that can fail — a Create Records, an Update Records — you drag the fault connector (fault path) to another path, for example one that sends an alert. The element is your try and the fault path is your catch. What Flow lacks is finally: a stretch that runs whether the element went well or failed, without drawing it twice.",
      },
      voice: "otter",
    },
    {
      type: "diagram",
      id: "m08-try-flow",
      caption: {
        es: "Procesa las filas del ERP con y sin try/catch, y mira qué camino toma cada una.",
        en: "Process the ERP rows with and without try/catch, and watch which path each one takes.",
      },
    },
    {
      type: "h",
      text: { es: "Dónde poner el try", en: "Where to put the try" },
    },
    {
      type: "p",
      text: {
        es: "La pregunta clave es qué quieres que siga funcionando cuando algo falla. Si el try rodea todo el bucle, el primer importe malo te saca del bucle entero: las filas siguientes ni se intentan. Si el try va dentro del bucle, alrededor de cada fila, una fila mala se captura y el bucle sigue con la siguiente. Para una importación fila a fila, casi siempre quieres lo segundo.",
        en: "The key question is what you want to keep working when something fails. If the try wraps the whole loop, the first bad amount throws you out of the entire loop: the following rows are never attempted. If the try goes inside the loop, around each row, a bad row is caught and the loop moves on to the next. For a row-by-row import you almost always want the second.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Un catch vacío es peor que no tener catch", en: "An empty catch is worse than no catch" },
      text: {
        es: "catch (Exception e) { } hace desaparecer el error: nadie sabrá nunca qué fila falló ni por qué, y el proceso parecerá correcto. Todo catch tiene que dejar rastro —un contador, un registro de log, un mensaje— o volver a lanzar el error (lección 3). Y captura el tipo concreto que esperas: un catch de Exception a secas también se tragaría errores que no esperabas, como un NullPointerException de un fallo tuyo.",
        en: "catch (Exception e) { } makes the error vanish: nobody will ever know which row failed or why, and the process will look fine. Every catch must leave a trace — a counter, a log record, a message — or throw the error again (lesson 3). And catch the specific type you expect: a plain Exception catch would also swallow errors you did not expect, such as a NullPointerException from a bug of yours.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué pasa con la transacción si una excepción no la captura nadie? ¿Y si la captura un catch? ¿Cuándo se ejecuta finally?",
        en: "Without looking: what happens to the transaction if nobody catches an exception? And if a catch does? When does finally run?",
      },
    },
  ],

  quiz: [
    {
      id: "m08-l01-q1",
      kind: "single",
      prompt: { es: "¿Qué imprime este código?", en: "What does this code print?" },
      code: {
        es: `try {
    Integer n = Integer.valueOf('doce');
    System.debug('A');
} catch (TypeException e) {
    System.debug('B');
} finally {
    System.debug('C');
}`,
        en: `try {
    Integer n = Integer.valueOf('twelve');
    System.debug('A');
} catch (TypeException e) {
    System.debug('B');
} finally {
    System.debug('C');
}`,
      },
      options: [
        { es: "B y C", en: "B and C" },
        { es: "A, B y C", en: "A, B and C" },
        { es: "Solo B", en: "Only B" },
        { es: "A y C", en: "A and C" },
      ],
      answer: 0,
      explain: {
        es: "La conversión falla, así que 'A' nunca se imprime: el código salta al catch ('B') y después, como siempre, al finally ('C').",
        en: "The conversion fails, so 'A' is never printed: the code jumps to the catch ('B') and then, as always, to finally ('C').",
      },
      tags: ["predict-output"],
    },
    {
      id: "m08-l01-q2",
      kind: "single",
      prompt: { es: "¿Cuándo se ejecuta el bloque finally?", en: "When does the finally block run?" },
      options: [
        { es: "Siempre: haya excepción o no", en: "Always: exception or not" },
        { es: "Solo si hubo una excepción", en: "Only if there was an exception" },
        { es: "Solo si no hubo ninguna excepción", en: "Only if there was no exception" },
        { es: "Solo si el catch capturó la excepción", en: "Only if the catch caught the exception" },
      ],
      answer: 0,
      explain: {
        es: "finally es lo que tiene que ocurrir en cualquier caso: contar la fila, cerrar el informe. Por eso no existe en Flow un equivalente directo.",
        en: "finally is what must happen in any case: count the row, close the report. That is why Flow has no direct equivalent.",
      },
      tags: ["recall"],
    },
    {
      id: "m08-l01-q3",
      kind: "single",
      prompt: { es: "¿Qué problema tiene este código?", en: "What is wrong with this code?" },
      code: {
        es: `for (String raw : rawAmounts) {
    try {
        total += Decimal.valueOf(raw);
    } catch (TypeException e) {
    }
}`,
        en: `for (String raw : rawAmounts) {
    try {
        total += Decimal.valueOf(raw);
    } catch (TypeException e) {
    }
}`,
      },
      options: [
        {
          es: "El catch está vacío: el error desaparece y nadie sabrá qué fila falló.",
          en: "The catch is empty: the error vanishes and nobody will know which row failed.",
        },
        { es: "El try no puede ir dentro de un for.", en: "The try cannot go inside a for." },
        { es: "Falta un finally: sin él no compila.", en: "A finally is missing: without it, it does not compile." },
        { es: "TypeException no existe en Apex.", en: "TypeException does not exist in Apex." },
      ],
      answer: 0,
      explain: {
        es: "Compila y hasta parece funcionar, pero se traga los errores. Todo catch tiene que dejar rastro: un contador, un log o un mensaje.",
        en: "It compiles and even seems to work, but it swallows the errors. Every catch must leave a trace: a counter, a log or a message.",
      },
      tags: ["find-error"],
    },
    {
      id: "m08-l01-q4",
      kind: "multi",
      prompt: { es: "¿Qué afirmaciones son ciertas?", en: "Which statements are true?" },
      options: [
        { es: "Un catch solo atrapa excepciones del tipo que indica (o de sus hijas).", en: "A catch only catches exceptions of the type it names (or its children)." },
        { es: "Cuando un catch se hace cargo, el código sigue después del bloque completo.", en: "When a catch takes charge, the code carries on after the whole block." },
        { es: "Un try necesita al menos un catch o un finally.", en: "A try needs at least one catch or one finally." },
        { es: "Un catch deshace automáticamente lo que se hizo dentro del try.", en: "A catch automatically undoes what was done inside the try." },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Lo último es falso: capturar no deshace nada. Si quieres volver atrás, eso es un savepoint del Módulo 4.",
        en: "The last one is false: catching undoes nothing. If you want to go back, that is a Module 4 savepoint.",
      },
    },
    {
      id: "m08-l01-q5",
      kind: "text",
      prompt: {
        es: "Escribe la cabecera del bloque que captura una TypeException en una variable llamada e.",
        en: "Write the header of the block that catches a TypeException in a variable called e.",
      },
      accept: ["catch\\s*\\(\\s*(system\\.)?typeexception\\s+e\\s*\\)"],
      placeholder: { es: "catch (…", en: "catch (…" },
      explain: {
        es: "catch (TypeException e): el tipo que esperas y un nombre para la excepción, que usarás para leer su mensaje con e.getMessage().",
        en: "catch (TypeException e): the type you expect and a name for the exception, which you will use to read its message with e.getMessage().",
      },
      tags: ["recall"],
    },
    {
      id: "m08-l01-q6",
      kind: "single",
      prompt: {
        es: "Repaso: con Database.insert(leads, false), uno de los leads tiene un correo inválido. ¿Qué pasa?",
        en: "Review: with Database.insert(leads, false), one of the leads has an invalid email. What happens?",
      },
      options: [
        { es: "Se guardan los válidos y el error queda en su SaveResult, sin lanzar excepción.", en: "The valid ones are saved and the error stays in its SaveResult, with no exception thrown." },
        { es: "Se lanza una DmlException y no se guarda ninguno.", en: "A DmlException is thrown and none is saved." },
        { es: "Se guardan todos, también el inválido.", en: "All are saved, the invalid one too." },
        { es: "Se para la transacción con una LimitException.", en: "The transaction stops with a LimitException." },
      ],
      answer: 0,
      explain: {
        es: "Es la otra forma de tratar fallos, sin try/catch: allOrNone en false. En la tarea 6 usarás las dos juntas.",
        en: "It is the other way of handling failures, without try/catch: allOrNone set to false. In task 6 you will use both together.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M4 L2", en: "Review · M4 L2" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 1 DE 6 · El ERP manda los importes como texto, y alguno llega mal escrito. Hoy, una sola fila mala tumba la importación entera. Haz que cada importe se convierta dentro de su propio try: si falla, apunta el fallo y sigue con la siguiente fila; pase lo que pase, cuenta la fila como procesada.",
      en: "TASK 1 OF 6 · The ERP sends the amounts as text, and some arrive badly written. Today a single bad row brings the whole import down. Make each amount be converted inside its own try: if it fails, note the failure and move on to the next row; whatever happens, count the row as processed.",
    },
    brief: [
      {
        es: "Dentro del for, la conversión Decimal.valueOf(raw) y la suma al total van en un bloque try.",
        en: "Inside the for, the Decimal.valueOf(raw) conversion and the addition to total go in a try block.",
      },
      {
        es: "Un catch que capture TypeException —no Exception a secas— suma 1 a failed y muestra con System.debug el importe y e.getMessage().",
        en: "A catch for TypeException — not a plain Exception — adds 1 to failed and shows the amount and e.getMessage() with System.debug.",
      },
      {
        es: "Un finally que sume 1 a processed en cada vuelta, haya ido bien o mal.",
        en: "A finally that adds 1 to processed on every pass, whether it went well or not.",
      },
      {
        es: "Al final, fuera del bucle, un System.debug con total, failed y processed.",
        en: "At the end, outside the loop, a System.debug with total, failed and processed.",
      },
    ],
    starter: {
      es: `// CASO: el puente nocturno con el ERP de Northwind
// Tarea 1 de 6: que un importe mal escrito no tumbe la importación.

List<String> rawAmounts = new List<String>{ '12500.00', '8300.50', '12.500,00', '', '4100' };
Decimal total = 0;
Integer failed = 0;
Integer processed = 0;

for (String raw : rawAmounts) {
    Decimal amount = Decimal.valueOf(raw);
    total += amount;
}

System.debug('Total importado: ' + total);
`,
      en: `// CASE: Northwind's nightly bridge with the ERP
// Task 1 of 6: a badly written amount must not bring the import down.

List<String> rawAmounts = new List<String>{ '12500.00', '8300.50', '12.500,00', '', '4100' };
Decimal total = 0;
Integer failed = 0;
Integer processed = 0;

for (String raw : rawAmounts) {
    Decimal amount = Decimal.valueOf(raw);
    total += amount;
}

System.debug('Total imported: ' + total);
`,
    },
    hints: [
      {
        es: "Yo lo pensaría como el fault path de cada fila: ¿qué línea puede fallar? Esa, y la que depende de ella, van dentro del try; el resto del bucle, fuera.",
        en: "I would think of it as each row's fault path: which line can fail? That one, and the one depending on it, go inside the try; the rest of the loop stays outside.",
      },
      {
        es: "Lo que me ayudó: catch (TypeException e) atrapa solo los textos que no son números. Dentro, failed++ y un System.debug con e.getMessage(). Y finally { processed++; } se ejecuta en las dos ramas.",
        en: "What helped me: catch (TypeException e) only catches text that is not a number. Inside it, failed++ and a System.debug with e.getMessage(). And finally { processed++; } runs on both branches.",
      },
      {
        es: "Te dejo el esquema: for (String raw : rawAmounts) { try { Decimal amount = Decimal.valueOf(raw); total += amount; } catch (TypeException e) { failed++; System.debug(…); } finally { processed++; } }",
        en: "Here is the outline: for (String raw : rawAmounts) { try { Decimal amount = Decimal.valueOf(raw); total += amount; } catch (TypeException e) { failed++; System.debug(…); } finally { processed++; } }",
      },
    ],
    solution: { es: SOLUTION_ES, en: SOLUTION_EN },
    checks: [
      {
        id: "m08-l01-c1",
        label: { es: "La conversión va en un try, dentro del bucle", en: "The conversion is in a try, inside the loop" },
        rule: {
          op: "match",
          pattern: "for\\s*\\(\\s*String\\s+\\w+\\s*:\\s*rawAmounts\\s*\\)\\s*\\{[^}]*?\\btry\\s*\\{[^}]*Decimal\\.valueOf",
        },
        onFail: {
          es: "El try tiene que ir dentro del for, rodeando Decimal.valueOf(raw). Fuera del bucle, el primer importe malo saca de golpe todas las filas siguientes.",
          en: "The try has to go inside the for, around Decimal.valueOf(raw). Outside the loop, the first bad amount throws out every following row at once.",
        },
        otter: {
          es: "Cada fila necesita su propio fault path: el try va dentro del for, rodeando Decimal.valueOf(raw). Si lo pones fuera, el primer importe malo saca de golpe todo el bucle.",
          en: "Each row needs its own fault path: the try goes inside the for, around Decimal.valueOf(raw). Put it outside and the first bad amount throws the whole loop out at once.",
        },
      },
      {
        id: "m08-l01-c2",
        label: { es: "Captura TypeException, no Exception a secas", en: "Catches TypeException, not a plain Exception" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "catch\\s*\\(\\s*(System\\.)?TypeException\\s+\\w+\\s*\\)" },
            { op: "absent", pattern: "catch\\s*\\(\\s*(System\\.)?Exception\\s+\\w+\\s*\\)" },
          ],
        },
        onFail: {
          es: "Captura el tipo que esperas: catch (TypeException e). Un catch de Exception a secas también escondería errores que no esperas.",
          en: "Catch the type you expect: catch (TypeException e). A plain Exception catch would also hide errors you do not expect.",
        },
        otter: {
          es: "Captura el tipo concreto, TypeException, como un fault path que solo salta con un error concreto. catch (Exception e) también atraparía errores que no esperas y los escondería.",
          en: "Catch the specific type, TypeException, like a fault path that only fires on one specific error. catch (Exception e) would also catch errors you do not expect and hide them.",
        },
      },
      {
        id: "m08-l01-c3",
        label: { es: "El catch cuenta el fallo y muestra el motivo", en: "The catch counts the failure and shows the reason" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "catch\\s*\\([^)]*\\)\\s*\\{[^}]*failed\\s*(\\+\\+|\\+=\\s*1)" },
            { op: "match", pattern: "catch\\s*\\([^)]*\\)\\s*\\{[^}]*\\.getMessage\\s*\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "Dentro del catch: failed++; y un System.debug que incluya e.getMessage(). Un catch que no deja rastro esconde el error.",
          en: "Inside the catch: failed++; and a System.debug including e.getMessage(). A catch that leaves no trace hides the error.",
        },
        otter: {
          es: "El catch es tu fault path: apunta el fallo (failed++) y deja rastro del motivo con e.getMessage(), como el correo de error de un flow, pero sin despertar a nadie a las 7.",
          en: "The catch is your fault path: note the failure (failed++) and leave a trace of the reason with e.getMessage(), like a flow's error email, but without waking anyone at 7am.",
        },
      },
      {
        id: "m08-l01-c4",
        label: { es: "finally cuenta cada fila", en: "finally counts every row" },
        rule: { op: "match", pattern: "finally\\s*\\{[^}]*processed\\s*(\\+\\+|\\+=\\s*1)" },
        onFail: {
          es: "Un finally { processed++; } que se ejecute en cada vuelta, haya ido bien o mal.",
          en: "A finally { processed++; } that runs on every pass, whether it went well or not.",
        },
        otter: {
          es: "finally es lo que en Flow no tienes: un tramo que se ejecuta haya fallado o no. Pon ahí processed++ para contar todas las filas.",
          en: "finally is what Flow does not give you: a stretch that runs whether it failed or not. Put processed++ there to count every row.",
        },
      },
      {
        id: "m08-l01-c5",
        label: { es: "La suma solo ocurre si la conversión fue bien", en: "The addition only happens if the conversion worked" },
        rule: { op: "match", pattern: "try\\s*\\{[^}]*Decimal\\.valueOf\\s*\\(\\s*\\w+\\s*\\)[^}]*total\\s*\\+=" },
        onFail: {
          es: "total += amount; tiene que ir dentro del try, después de la conversión: si la conversión falla, la suma no debe ocurrir.",
          en: "total += amount; has to go inside the try, after the conversion: if the conversion fails, the addition must not happen.",
        },
        otter: {
          es: "total += amount tiene que ir dentro del try, justo después de la conversión: si la conversión falla, esa suma no debe ocurrir.",
          en: "total += amount has to go inside the try, right after the conversion: if the conversion fails, that addition must not happen.",
        },
      },
      {
        id: "m08-l01-c6",
        label: { es: "El informe final muestra fallidos y procesados", en: "The final report shows failed and processed" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "System\\.debug\\s*\\([^;]*failed" },
            { op: "match", pattern: "System\\.debug\\s*\\([^;]*processed" },
          ],
        },
        onFail: {
          es: "Termina con un System.debug que incluya total, failed y processed.",
          en: "Finish with a System.debug including total, failed and processed.",
        },
        otter: {
          es: "El resumen para Operaciones: un System.debug final con total, failed y processed, fuera del bucle.",
          en: "The summary for Operations: a final System.debug with total, failed and processed, outside the loop.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué pasaría si cambiaras TypeException por Exception? ¿Qué errores empezarías a esconder sin querer?",
        en: "What would happen if you swapped TypeException for Exception? Which errors would you start hiding by accident?",
      },
      {
        es: "Si el ERP mandara null en vez de un texto vacío, ¿qué excepción crees que saltaría? ¿La atraparía tu catch? Pruébalo en Execute Anonymous.",
        en: "If the ERP sent null instead of an empty string, which exception do you think would be thrown? Would your catch trap it? Try it in Execute Anonymous.",
      },
    ],
    voice: "otter",
    outro: {
      es: "Ya sabes que un error no tiene por qué tumbarlo todo: try, catch y finally deciden qué pasa fila a fila. En la tarea 2 el importe está bien… pero la cuenta del ERP no existe, y ahí salta otro tipo de excepción.",
      en: "You now know an error does not have to bring everything down: try, catch and finally decide what happens row by row. In task 2 the amount is fine… but the ERP's account does not exist, and a different kind of exception is thrown.",
    },
  },
};
