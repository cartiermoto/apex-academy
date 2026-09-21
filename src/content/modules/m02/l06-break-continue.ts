import type { Lesson } from "@/lib/types";

export const l06BreakContinue: Lesson = {
  id: "m02-l06",
  slug: "break-y-continue",
  n: 6,
  kind: "lesson",
  minutes: 16,
  title: { es: "Break y Continue", en: "Break and Continue" },
  summary: {
    es: "continue salta al siguiente registro; break deja de recorrer en cuanto encuentras lo que buscabas.",
    en: "continue skips to the next record; break stops walking as soon as you find what you were looking for.",
  },
  analogy: {
    es: "La salida «no aplica» que vuelve al Loop, y dejar de buscar al encontrar",
    en: "The “not applicable” outcome that returns to the Loop, and stopping the search once found",
  },
  objectives: [
    {
      es: "Usar continue para saltarse los registros que no aplican sin anidar más if.",
      en: "Use continue to skip records that do not apply without nesting more ifs.",
    },
    {
      es: "Usar break para detener una búsqueda en cuanto aparece el resultado.",
      en: "Use break to stop a search as soon as the result turns up.",
    },
    {
      es: "Saber qué variable guarda el hallazgo y cómo distinguir «encontrado» de «no encontrado».",
      en: "Know which variable holds the finding and how to tell “found” from “not found”.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Un for recorre todos los elementos, uno detrás de otro. A veces eso sobra: hay registros que no te interesan, o solo necesitas el primero que cumpla algo. Dos palabras cambian el recorrido desde dentro: continue y break.",
        en: "A for walks every item, one after another. Sometimes that is more than you need: there are records you do not care about, or you only need the first one that meets something. Two words change the walk from inside: continue and break.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "En un Loop de Flow, cuando un registro no aplica, pones un Decision cuya salida «no aplica» vuelve directa al Loop, sin pasar por las acciones. Eso es continue. break no tiene un botón en Flow: es lo que haces cuando buscas un registro en una vista de lista y dejas de leer en cuanto lo ves.",
        en: "In a Flow Loop, when a record does not apply, you add a Decision whose “not applicable” outcome goes straight back to the Loop, skipping the actions. That is continue. break has no button in Flow: it is what you do when you look for a record in a list view and stop reading the moment you see it.",
      },
    },
    {
      type: "h",
      text: { es: "continue: siguiente, por favor", en: "continue: next, please" },
    },
    {
      type: "p",
      text: {
        es: "continue abandona la vuelta actual y salta a la siguiente. Todo lo que hay debajo de él dentro del bucle se omite para ese elemento. Su gran ventaja es de lectura: en lugar de meter todo el trabajo dentro de un if, descartas lo que no aplica arriba del todo y el resto del cuerpo queda plano.",
        en: "continue abandons the current pass and jumps to the next one. Everything below it inside the loop is skipped for that item. Its big advantage is readability: instead of putting all the work inside an if, you discard what does not apply at the very top and the rest of the body stays flat.",
      },
    },
    {
      type: "code",
      code: {
        es: `Integer openCases = 0;
for (Case c : cases) {
    if (c.Status == 'Closed') {
        continue;              // este no cuenta: al siguiente
    }
    openCases++;
    System.debug('Pendiente: ' + c.Subject);
}`,
        en: `Integer openCases = 0;
for (Case c : cases) {
    if (c.Status == 'Closed') {
        continue;              // this one does not count: next
    }
    openCases++;
    System.debug('Pending: ' + c.Subject);
}`,
      },
      caption: {
        es: "Una cláusula de guarda: «si no aplica, sigue». El trabajo real queda sin sangría extra.",
        en: "A guard clause: “if it does not apply, move on”. The real work stays without extra indentation.",
      },
    },
    {
      type: "h",
      text: { es: "break: ya lo tengo", en: "break: got it" },
    },
    {
      type: "p",
      text: {
        es: "break sale del bucle por completo, en ese mismo instante. El código continúa debajo del bucle y los elementos que quedaban ni se miran. Es la herramienta de búsqueda: recorres hasta encontrar y paras.",
        en: "break leaves the loop entirely, at that very moment. The code carries on below the loop and the remaining items are not even looked at. It is the search tool: you walk until you find and then stop.",
      },
    },
    {
      type: "code",
      code: {
        es: `Case firstUrgent;              // null = todavía no encontrado
for (Case c : cases) {
    if (c.Priority == 'High' && c.Status == 'New') {
        firstUrgent = c;
        break;                 // no hace falta mirar más
    }
}

if (firstUrgent == null) {
    System.debug('No hay casos urgentes nuevos');
} else {
    System.debug('Atender primero: ' + firstUrgent.Subject);
}`,
        en: `Case firstUrgent;              // null = not found yet
for (Case c : cases) {
    if (c.Priority == 'High' && c.Status == 'New') {
        firstUrgent = c;
        break;                 // no need to look further
    }
}

if (firstUrgent == null) {
    System.debug('No new urgent cases');
} else {
    System.debug('Handle first: ' + firstUrgent.Subject);
}`,
      },
      caption: {
        es: "La variable del hallazgo se declara fuera y empieza en null. Después del bucle, null significa «no había ninguno».",
        en: "The finding's variable is declared outside and starts as null. After the loop, null means “there was none”.",
      },
    },
    {
      type: "diagram",
      id: "m02-break-continue",
      caption: {
        es: "continue vuelve a la cabecera del bucle; break salta fuera de él.",
        en: "continue goes back to the top of the loop; break jumps out of it.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Solo afectan al bucle más cercano", en: "They only affect the nearest loop" },
      text: {
        es: "Si hay un bucle dentro de otro, break y continue actúan sobre el de dentro, el que los contiene directamente. El de fuera sigue con su siguiente vuelta. Lo verás en acción en la próxima sub-lección.",
        en: "If there is a loop inside another, break and continue act on the inner one, the one that directly contains them. The outer one carries on with its next pass. You will see it in action in the next sub-lesson.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "No los uses para todo", en: "Do not use them for everything" },
      text: {
        es: "Un continue arriba del bucle aclara; tres continue repartidos por el cuerpo confunden. Si un bucle necesita muchas salidas, suele ser señal de que está haciendo demasiadas cosas a la vez.",
        en: "One continue at the top of the loop clarifies; three continues scattered through the body confuse. If a loop needs many exits, it is usually a sign it is doing too many things at once.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: después de un bucle de búsqueda con break, ¿cómo sabes si se encontró algo o se recorrió todo sin éxito?",
        en: "Without looking up: after a search loop with break, how do you know whether something was found or the whole list was walked without success?",
      },
    },
  ],

  quiz: [
    {
      id: "m02-l06-q1",
      kind: "single",
      prompt: { es: "¿Qué muestra este código?", en: "What does this code print?" },
      code: {
        es: `Integer total = 0;
for (Integer i = 1; i <= 5; i++) {
    if (i == 3) {
        continue;
    }
    total += i;
}
System.debug(total);`,
        en: `Integer total = 0;
for (Integer i = 1; i <= 5; i++) {
    if (i == 3) {
        continue;
    }
    total += i;
}
System.debug(total);`,
      },
      options: [
        { es: "12", en: "12" },
        { es: "15", en: "15" },
        { es: "3", en: "3" },
        { es: "6", en: "6" },
      ],
      answer: 0,
      explain: {
        es: "Suma 1, 2, 4 y 5: la vuelta del 3 se salta con continue. 1 + 2 + 4 + 5 = 12.",
        en: "It adds 1, 2, 4 and 5: the pass for 3 is skipped with continue. 1 + 2 + 4 + 5 = 12.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m02-l06-q2",
      kind: "single",
      prompt: { es: "¿Y este?", en: "And this one?" },
      code: {
        es: `Integer total = 0;
for (Integer i = 1; i <= 5; i++) {
    if (i == 3) {
        break;
    }
    total += i;
}
System.debug(total);`,
        en: `Integer total = 0;
for (Integer i = 1; i <= 5; i++) {
    if (i == 3) {
        break;
    }
    total += i;
}
System.debug(total);`,
      },
      options: [
        { es: "3", en: "3" },
        { es: "12", en: "12" },
        { es: "6", en: "6" },
        { es: "15", en: "15" },
      ],
      answer: 0,
      explain: {
        es: "Suma 1 y 2; al llegar al 3, break sale del bucle y el resto no se procesa. 1 + 2 = 3.",
        en: "It adds 1 and 2; on reaching 3, break leaves the loop and the rest is never processed. 1 + 2 = 3.",
      },
      tags: ["predict-output", "interleaving"],
    },
    {
      id: "m02-l06-q3",
      kind: "text",
      prompt: {
        es: "¿Qué palabra clave abandona la vuelta actual y pasa directamente a la siguiente?",
        en: "Which keyword abandons the current pass and goes straight to the next one?",
      },
      accept: ["continue"],
      placeholder: { es: "una palabra", en: "one word" },
      explain: {
        es: "continue. break, en cambio, sale del bucle entero.",
        en: "continue. break, by contrast, leaves the whole loop.",
      },
      tags: ["recall"],
    },
    {
      id: "m02-l06-q4",
      kind: "single",
      prompt: {
        es: "Buscas la primera cuenta de la lista con más de 1.000 empleados. ¿Qué falla aquí?",
        en: "You are looking for the first account in the list with more than 1,000 employees. What is wrong here?",
      },
      code: {
        es: `for (Account a : accounts) {
    Account found;
    if (a.NumberOfEmployees > 1000) {
        found = a;
        break;
    }
}
System.debug(found);`,
        en: `for (Account a : accounts) {
    Account found;
    if (a.NumberOfEmployees > 1000) {
        found = a;
        break;
    }
}
System.debug(found);`,
      },
      options: [
        {
          es: "found se declara dentro del bucle: después no existe y no compila.",
          en: "found is declared inside the loop: it does not exist afterwards and it does not compile.",
        },
        {
          es: "break debería ir antes de found = a.",
          en: "break should come before found = a.",
        },
        {
          es: "Hay que usar continue en lugar de break.",
          en: "continue should be used instead of break.",
        },
      ],
      answer: 0,
      explain: {
        es: "Otra vez el ámbito: la variable del hallazgo se declara antes del bucle, empezando en null, para poder leerla cuando el bucle termine.",
        en: "Scope again: the finding's variable is declared before the loop, starting as null, so it can be read when the loop ends.",
      },
      tags: ["find-error", "spaced"],
      from: { es: "Repaso · M2 L3", en: "Review · M2 L3" },
    },
    {
      id: "m02-l06-q5",
      kind: "single",
      prompt: {
        es: "En un bucle de búsqueda con break, la lista no tenía ningún registro que cumpliera la condición. ¿Qué vale la variable del hallazgo al terminar?",
        en: "In a search loop with break, the list had no record meeting the condition. What does the finding's variable hold at the end?",
      },
      options: [
        {
          es: "null, el valor con el que se declaró",
          en: "null, the value it was declared with",
        },
        { es: "El último registro de la lista", en: "The last record in the list" },
        { es: "El primer registro de la lista", en: "The first record in the list" },
        { es: "Una lista vacía", en: "An empty list" },
      ],
      answer: 0,
      explain: {
        es: "Nunca se le asignó nada, así que sigue en null. Por eso después del bucle se pregunta if (found == null).",
        en: "Nothing was ever assigned to it, so it is still null. That is why after the loop you ask if (found == null).",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M1 L6", en: "Review · M1 L6" },
    },
    {
      id: "m02-l06-q6",
      kind: "multi",
      prompt: {
        es: "¿En qué casos encaja break?",
        en: "Which cases suit break?",
      },
      options: [
        {
          es: "Encontrar el primer contacto sin correo electrónico.",
          en: "Finding the first contact without an email address.",
        },
        {
          es: "Sumar el importe de todas las oportunidades.",
          en: "Adding up the amount of every opportunity.",
        },
        {
          es: "Saber si existe al menos un caso de prioridad Critical.",
          en: "Knowing whether at least one Critical priority case exists.",
        },
        {
          es: "Contar cuántos leads vienen de la web.",
          en: "Counting how many leads come from the web.",
        },
      ],
      answers: [0, 2],
      explain: {
        es: "break sirve cuando basta con el primero. Sumar o contar todos exige recorrer la lista entera.",
        en: "break is for when the first one is enough. Summing or counting everything requires walking the whole list.",
      },
      tags: ["interleaving"],
    },
  ],

  exercise: {
    prompt: {
      es: "La responsable de Soporte empieza el turno y quiere dos cosas: cuántos casos siguen abiertos, y cuál es el primer caso urgente nuevo de la cola para asignarlo ya. Los cerrados no cuentan para nada.",
      en: "The Support lead is starting the shift and wants two things: how many cases are still open, and which is the first new urgent case in the queue so it can be assigned right away. Closed ones count for nothing.",
    },
    brief: [
      {
        es: "Parte de la lista cases del código de partida.",
        en: "Start from the cases list in the starter code.",
      },
      {
        es: "Bucle 1 — openCount (Integer): los casos cuyo Status no sea 'Closed'. Sáltate los cerrados con continue.",
        en: "Loop 1 — openCount (Integer): the cases whose Status is not 'Closed'. Skip the closed ones with continue.",
      },
      {
        es: "Bucle 2 — firstUrgent (Case): el primer caso con Priority 'High' y Status 'New'. Detén el bucle con break en cuanto lo encuentres.",
        en: "Loop 2 — firstUrgent (Case): the first case with Priority 'High' and Status 'New'. Stop the loop with break as soon as you find it.",
      },
      {
        es: "Al final, muestra el Subject de firstUrgent, o un aviso si no había ninguno.",
        en: "At the end, print firstUrgent's Subject, or a notice if there was none.",
      },
    ],
    starter: {
      es: `List<Case> cases = new List<Case>{
    new Case(Subject = 'Cambio de dirección', Status = 'Closed', Priority = 'Low'),
    new Case(Subject = 'Error en factura', Status = 'Working', Priority = 'High'),
    new Case(Subject = 'No puedo entrar', Status = 'New', Priority = 'High'),
    new Case(Subject = 'Solicitud de demo', Status = 'New', Priority = 'Medium'),
    new Case(Subject = 'Caída del portal', Status = 'New', Priority = 'High')
};

// Bucle 1: openCount con continue.
// Bucle 2: firstUrgent con break.
`,
      en: `List<Case> cases = new List<Case>{
    new Case(Subject = 'Address change', Status = 'Closed', Priority = 'Low'),
    new Case(Subject = 'Invoice error', Status = 'Working', Priority = 'High'),
    new Case(Subject = 'Cannot log in', Status = 'New', Priority = 'High'),
    new Case(Subject = 'Demo request', Status = 'New', Priority = 'Medium'),
    new Case(Subject = 'Portal outage', Status = 'New', Priority = 'High')
};

// Loop 1: openCount with continue.
// Loop 2: firstUrgent with break.
`,
    },
    hints: [
      {
        es: "Son dos preguntas distintas y por eso dos bucles: contar necesita recorrer todo; buscar el primero puede parar antes. Declara openCount y firstUrgent antes de sus bucles.",
        en: "These are two different questions and so two loops: counting needs to walk everything; finding the first can stop early. Declare openCount and firstUrgent before their loops.",
      },
      {
        es: "En el primero, la guarda va arriba: si Status es 'Closed', continue; debajo, openCount++. En el segundo, cuando se cumplan las dos condiciones con &&, guarda el caso en firstUrgent y haz break.",
        en: "In the first, the guard goes at the top: if Status is 'Closed', continue; below it, openCount++. In the second, when both conditions hold with &&, store the case in firstUrgent and break.",
      },
      {
        es: "Pseudocódigo: Integer openCount = 0; para cada c { si cerrado → continue; openCount++; } Case firstUrgent; para cada c { si High && New { firstUrgent = c; break; } } si firstUrgent == null → aviso; si no → Subject.",
        en: "Pseudocode: Integer openCount = 0; for each c { if closed → continue; openCount++; } Case firstUrgent; for each c { if High && New { firstUrgent = c; break; } } if firstUrgent == null → notice; else → Subject.",
      },
    ],
    solution: {
      es: `List<Case> cases = new List<Case>{
    new Case(Subject = 'Cambio de dirección', Status = 'Closed', Priority = 'Low'),
    new Case(Subject = 'Error en factura', Status = 'Working', Priority = 'High'),
    new Case(Subject = 'No puedo entrar', Status = 'New', Priority = 'High'),
    new Case(Subject = 'Solicitud de demo', Status = 'New', Priority = 'Medium'),
    new Case(Subject = 'Caída del portal', Status = 'New', Priority = 'High')
};

Integer openCount = 0;
for (Case c : cases) {
    if (c.Status == 'Closed') {
        continue;
    }
    openCount++;
}

Case firstUrgent;
for (Case c : cases) {
    if (c.Priority == 'High' && c.Status == 'New') {
        firstUrgent = c;
        break;
    }
}

System.debug('Abiertos: ' + openCount);
if (firstUrgent == null) {
    System.debug('No hay urgentes nuevos');
} else {
    System.debug('Asignar ya: ' + firstUrgent.Subject);
}`,
      en: `List<Case> cases = new List<Case>{
    new Case(Subject = 'Address change', Status = 'Closed', Priority = 'Low'),
    new Case(Subject = 'Invoice error', Status = 'Working', Priority = 'High'),
    new Case(Subject = 'Cannot log in', Status = 'New', Priority = 'High'),
    new Case(Subject = 'Demo request', Status = 'New', Priority = 'Medium'),
    new Case(Subject = 'Portal outage', Status = 'New', Priority = 'High')
};

Integer openCount = 0;
for (Case c : cases) {
    if (c.Status == 'Closed') {
        continue;
    }
    openCount++;
}

Case firstUrgent;
for (Case c : cases) {
    if (c.Priority == 'High' && c.Status == 'New') {
        firstUrgent = c;
        break;
    }
}

System.debug('Open: ' + openCount);
if (firstUrgent == null) {
    System.debug('No new urgent cases');
} else {
    System.debug('Assign now: ' + firstUrgent.Subject);
}`,
    },
    checks: [
      {
        id: "m02-l06-c1",
        label: {
          es: "openCount se declara antes de su bucle y empieza en 0",
          en: "openCount is declared before its loop and starts at 0",
        },
        rule: { op: "match", pattern: "Integer\\s+openCount\\s*=\\s*0\\s*;[\\s\\S]*for\\s*\\(" },
        onFail: {
          es: "Un contador se declara antes del bucle: Integer openCount = 0;",
          en: "A counter is declared before the loop: Integer openCount = 0;",
        },
      },
      {
        id: "m02-l06-c2",
        label: {
          es: "Los cerrados se saltan con continue",
          en: "Closed ones are skipped with continue",
        },
        rule: {
          op: "match",
          pattern: "Status\\s*==\\s*'Closed'\\s*\\)\\s*\\{?\\s*continue\\s*;",
        },
        onFail: {
          es: "La guarda es: if (c.Status == 'Closed') { continue; } — arriba del cuerpo, antes de contar.",
          en: "The guard is: if (c.Status == 'Closed') { continue; } — at the top of the body, before counting.",
        },
      },
      {
        id: "m02-l06-c3",
        label: { es: "openCount sube en cada caso abierto", en: "openCount goes up for each open case" },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "openCount\\s*\\+\\+" },
            { op: "match", pattern: "openCount\\s*\\+=\\s*1" },
            { op: "match", pattern: "openCount\\s*=\\s*openCount\\s*\\+\\s*1" },
          ],
        },
        onFail: {
          es: "Debajo del continue, cada vuelta que llega hasta ahí es un caso abierto: openCount++;",
          en: "Below the continue, every pass that gets that far is an open case: openCount++;",
        },
      },
      {
        id: "m02-l06-c4",
        label: {
          es: "firstUrgent se declara como Case fuera del bucle",
          en: "firstUrgent is declared as a Case outside the loop",
        },
        rule: { op: "match", pattern: "Case\\s+firstUrgent\\s*(=\\s*null\\s*)?;[\\s\\S]*for\\s*\\(" },
        onFail: {
          es: "La variable del hallazgo va antes del bucle y empieza vacía: Case firstUrgent;",
          en: "The finding's variable goes before the loop and starts empty: Case firstUrgent;",
        },
      },
      {
        id: "m02-l06-c5",
        label: {
          es: "Al encontrarlo, lo guarda y hace break",
          en: "When found, it stores it and breaks",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Priority\\s*==\\s*'High'" },
            { op: "match", pattern: "Status\\s*==\\s*'New'" },
            { op: "match", pattern: "firstUrgent\\s*=\\s*\\w+\\s*;\\s*break\\s*;" },
          ],
        },
        onFail: {
          es: "Las dos condiciones van unidas con &&; dentro del if, firstUrgent = c; y justo después break;",
          en: "Both conditions go together with &&; inside the if, firstUrgent = c; and right after, break;",
        },
        onPass: {
          es: "En una cola de 200 casos, si el urgente es el tercero, el bucle hace 3 vueltas en vez de 200.",
          en: "In a queue of 200 cases, if the urgent one is third, the loop makes 3 passes instead of 200.",
        },
      },
      {
        id: "m02-l06-c6",
        label: {
          es: "Distingue «no encontrado» antes de leer el Subject",
          en: "Tells “not found” apart before reading the Subject",
        },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "firstUrgent\\s*==\\s*null" },
            { op: "match", pattern: "firstUrgent\\s*!=\\s*null" },
            { op: "match", pattern: "firstUrgent\\?\\.Subject" },
          ],
        },
        onFail: {
          es: "Si ningún caso cumple, firstUrgent sigue en null y firstUrgent.Subject lanza una excepción. Pregunta antes if (firstUrgent == null).",
          en: "If no case matches, firstUrgent is still null and firstUrgent.Subject throws an exception. Ask first: if (firstUrgent == null).",
        },
      },
    ],
    rubric: [
      {
        es: "Cambia el último caso a Priority 'Low' y el tercero a Status 'Working'. ¿Tu código muestra el aviso en vez de fallar?",
        en: "Change the last case to Priority 'Low' and the third to Status 'Working'. Does your code show the notice instead of failing?",
      },
    ],
  },
};
