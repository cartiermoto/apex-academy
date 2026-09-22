import type { Lesson } from "@/lib/types";

export const l04Fechas: Lesson = {
  id: "m01-l04",
  slug: "fechas",
  n: 4,
  kind: "lesson",
  minutes: 22,
  title: { es: "Date, Time y Datetime", en: "Date, Time and Datetime" },
  summary: {
    es: "Tres tipos para el tiempo, y una zona horaria que explica el 90 % de los «pero si en el informe salía otro día».",
    en: "Three types for time, and one time zone that explains 90% of every “but the report said another day”.",
  },
  analogy: {
    es: "Los campos Date, Time y Date/Time, y la zona horaria de los informes",
    en: "Date, Time and Date/Time fields, and report time zones",
  },
  objectives: [
    {
      es: "Elegir entre Date, Time y Datetime según lo que realmente se necesita saber.",
      en: "Choose between Date, Time and Datetime based on what you actually need to know.",
    },
    {
      es: "Crear fechas y operar con ellas sin escribirlas como texto.",
      en: "Build dates and do arithmetic with them without writing them as text.",
    },
    {
      es: "Explicar por qué una fecha parece cambiar según quién la mira.",
      en: "Explain why a date seems to change depending on who is looking at it.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "En el asistente de campos hay tres opciones distintas para el tiempo: Date, Time y Date/Time. Elegiste mal alguna vez y lo pagaste en un informe. Apex tiene exactamente los mismos tres tipos, con los mismos nombres y las mismas consecuencias.",
        en: "The field wizard offers three separate options for time: Date, Time and Date/Time. You picked the wrong one once and paid for it in a report. Apex has exactly those three types, with the same names and the same consequences.",
      },
    },
    {
      type: "diagram",
      id: "m01-datetime",
      caption: {
        es: "La pregunta que decide el tipo: ¿necesito el día, el momento del día, o el instante exacto?",
        en: "The question that decides the type: do I need the day, the moment of the day, or the exact instant?",
      },
    },
    {
      type: "h",
      text: { es: "Crear una fecha", en: "Creating a date" },
    },
    {
      type: "p",
      text: {
        es: "Las fechas no se escriben entre comillas. Un texto entre comillas es texto, aunque parezca una fecha, y no sabe sumar días. Para crear una fecha se usa newInstance(), indicando año, mes y día por separado; para la de hoy, today().",
        en: "Dates are not written in quotes. Text in quotes is text, even when it looks like a date, and it cannot add days. To build one you use newInstance(), giving year, month and day separately; for today's date, today().",
      },
    },
    {
      type: "code",
      code: {
        es: `Date closeDate = Date.newInstance(2026, 3, 15);   // año, mes, día
Date today = Date.today();

Datetime createdAt = Datetime.now();
Datetime meeting = Datetime.newInstance(2026, 3, 15, 14, 30, 0);

Time reminder = Time.newInstance(9, 0, 0, 0);    // h, min, s, ms`,
        en: `Date closeDate = Date.newInstance(2026, 3, 15);   // year, month, day
Date today = Date.today();

Datetime createdAt = Datetime.now();
Datetime meeting = Datetime.newInstance(2026, 3, 15, 14, 30, 0);

Time reminder = Time.newInstance(9, 0, 0, 0);    // h, min, s, ms`,
      },
      caption: {
        es: "El mes va de 1 a 12, como esperas. Es de las pocas cosas en programación que no empieza en 0.",
        en: "The month runs 1 to 12, as you would expect. One of the few things in programming that does not start at 0.",
      },
    },
    {
      type: "h",
      text: { es: "Hacer cuentas con fechas", en: "Doing arithmetic with dates" },
    },
    {
      type: "p",
      text: {
        es: "Sumar un mes a una fecha no es sumar 30 días, y calcular los días entre dos fechas a mano es una invitación al bug. Los tipos de fecha traen métodos que ya saben de meses de 28 días y de años bisiestos.",
        en: "Adding a month to a date is not adding 30 days, and working out the days between two dates by hand is an invitation to a bug. The date types ship methods that already know about 28-day months and leap years.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Método", en: "Method" },
        { es: "Qué devuelve", en: "What it returns" },
        { es: "Ejemplo", en: "Example" },
      ],
      rows: [
        [
          { es: "addDays(n) / addMonths(n) / addYears(n)", en: "addDays(n) / addMonths(n) / addYears(n)" },
          { es: "Date: una fecha nueva desplazada.", en: "Date: a new, shifted date." },
          { es: "closeDate.addMonths(12)", en: "closeDate.addMonths(12)" },
        ],
        [
          { es: "daysBetween(otraFecha)", en: "daysBetween(otherDate)" },
          { es: "Integer: días de diferencia (negativo si es anterior).", en: "Integer: difference in days (negative if earlier)." },
          { es: "today.daysBetween(closeDate)", en: "today.daysBetween(closeDate)" },
        ],
        [
          { es: "monthsBetween(otraFecha)", en: "monthsBetween(otherDate)" },
          { es: "Integer: meses completos de diferencia.", en: "Integer: whole months of difference." },
          { es: "start.monthsBetween(end)", en: "start.monthsBetween(end)" },
        ],
        [
          { es: "year() / month() / day()", en: "year() / month() / day()" },
          { es: "Integer: la parte que pides.", en: "Integer: the part you ask for." },
          { es: "closeDate.year()", en: "closeDate.year()" },
        ],
        [
          { es: "addDays() sobre un Datetime", en: "addDays() on a Datetime" },
          { es: "Datetime: mismo instante, otro día.", en: "Datetime: same instant, different day." },
          { es: "createdAt.addHours(2)", en: "createdAt.addHours(2)" },
        ],
        [
          { es: "format()", en: "format()" },
          { es: "String: la fecha lista para mostrar.", en: "String: the date ready to display." },
          { es: "createdAt.format()", en: "createdAt.format()" },
        ],
      ],
    },
    {
      type: "code",
      code: {
        es: `Date signed = Date.newInstance(2026, 1, 31);
Date renewal = signed.addMonths(1);        // 2026-02-28, no 2026-02-31

Date today = Date.today();
Integer daysToRenewal = today.daysBetween(renewal);`,
        en: `Date signed = Date.newInstance(2026, 1, 31);
Date renewal = signed.addMonths(1);        // 2026-02-28, not 2026-02-31

Date today = Date.today();
Integer daysToRenewal = today.daysBetween(renewal);`,
      },
      caption: {
        es: "Igual que los String, las fechas son inmutables: addMonths() devuelve una fecha nueva y deja la original intacta.",
        en: "Like Strings, dates are immutable: addMonths() returns a new date and leaves the original untouched.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Date.today().daysBetween(): una cadena que empieza en el tipo", en: "Date.today().daysBetween(): a chain that starts on the type" },
      text: {
        es: "En una fórmula escribirías Renewal_Date__c - TODAY() y el resultado ya sería un número de días. En Apex, las dos líneas de arriba (Date today = Date.today(); y luego today.daysBetween(renewal)) se suelen escribir en una sola: Date.today().daysBetween(renewal). Es el encadenado de la sub-lección de String: Date.today() se le pide al tipo Date y devuelve un Date —el de hoy—, y a ESE Date le pides daysBetween(). Si te cuesta leerlo, desármalo en dos líneas como arriba: es exactamente lo mismo. Ojo al orden: la fecha desde la que cuentas va delante del punto; al revés, el número sale negativo.",
        en: "In a formula you would write Renewal_Date__c - TODAY() and the result would already be a number of days. In Apex, the two lines above (Date today = Date.today(); then today.daysBetween(renewal)) are usually written as one: Date.today().daysBetween(renewal). It is the chaining from the String sub-lesson: Date.today() is asked of the Date type and returns a Date — today's — and you ask THAT Date for daysBetween(). If it is hard to read, break it into two lines as above: it is exactly the same. Mind the order: the date you count from goes before the dot; the other way round, the number comes out negative.",
      },
    },
    {
      type: "code",
      code: {
        es: `Date closeDate = Date.newInstance(2026, 12, 31);

Integer daysLeft = Date.today().daysBetween(closeDate);    // cadena: hoy → días hasta el cierre
Integer closeYear = closeDate.addDays(30).year();           // cadena: +30 días → su año
String closeLabel = String.valueOf(closeDate.addMonths(1)); // anidado: la fecha nueva, como texto`,
        en: `Date closeDate = Date.newInstance(2026, 12, 31);

Integer daysLeft = Date.today().daysBetween(closeDate);    // chain: today → days until close
Integer closeYear = closeDate.addDays(30).year();           // chain: +30 days → its year
String closeLabel = String.valueOf(closeDate.addMonths(1)); // nested: the new date, as text`,
      },
      caption: {
        es: "closeYear vale 2027: al sumar 30 días al 31 de diciembre se cambia de año, y year() lee el año de la fecha NUEVA, no de closeDate.",
        en: "closeYear is 2027: adding 30 days to 31 December rolls over the year, and year() reads the year of the NEW date, not closeDate's.",
      },
    },
    {
      type: "h",
      text: { es: "La zona horaria, de una vez por todas", en: "The time zone, once and for all" },
    },
    {
      type: "p",
      text: {
        es: "Un Datetime se guarda siempre en [[gmt]] y se muestra en la zona horaria del usuario que lo mira. Por eso una reunión creada a las 00:30 en Madrid puede aparecer como el día anterior para un compañero en Londres: el instante es el mismo, la etiqueta cambia.",
        en: "A Datetime is always stored in [[gmt]] and displayed in the time zone of whoever is looking at it. That is why a meeting created at 00:30 in Madrid can show up as the previous day for a colleague in London: the instant is identical, the label changes.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El informe que «estaba mal»", en: "The report that was “wrong”" },
      text: {
        es: "Aquel informe agrupado por CreatedDate en el que un pedido de última hora de la noche aparecía en el día siguiente: no estaba mal, estaba agrupando en GMT mientras tú mirabas en hora local. En Apex la decisión es explícita: date() te da el día en la zona del usuario y dateGMT() te lo da en GMT.",
        en: "That report grouped by CreatedDate where a late-night order landed on the following day: it was not wrong, it was grouping in GMT while you were reading in local time. In Apex the choice is explicit: date() gives you the day in the user's zone and dateGMT() gives it in GMT.",
      },
    },
    {
      type: "code",
      code: {
        es: `Datetime createdAt = Datetime.now();

Date localDay = createdAt.date();       // día según la zona del usuario
Date gmtDay = createdAt.dateGMT();      // día en GMT
String shown = createdAt.format();      // texto, ya en la zona del usuario`,
        en: `Datetime createdAt = Datetime.now();

Date localDay = createdAt.date();       // day in the user's zone
Date gmtDay = createdAt.dateGMT();      // day in GMT
String shown = createdAt.format();      // text, already in the user's zone`,
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Un Date no tiene zona horaria", en: "A Date has no time zone" },
      text: {
        es: "Y eso es una ventaja, no una carencia. Una fecha de cierre, un cumpleaños o un vencimiento son el mismo día en todo el mundo. Usar Datetime donde bastaba un Date es la forma más rápida de importar un problema que no tenías.",
        en: "And that is a feature, not a gap. A close date, a birthday or a due date are the same day everywhere. Using a Datetime where a Date would do is the quickest way to import a problem you did not have.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿qué devuelve daysBetween(), un Date o un Integer? ¿Y qué tipo usarías para «fecha de cierre prevista»?",
        en: "Without looking up: does daysBetween() return a Date or an Integer? And which type would you use for “expected close date”?",
      },
    },
  ],

  quiz: [
    {
      id: "m01-l04-q1",
      kind: "single",
      prompt: {
        es: "Necesitas guardar la fecha de cierre prevista de una oportunidad. ¿Qué tipo eliges?",
        en: "You need to store an opportunity's expected close date. Which type do you pick?",
      },
      options: [
        { es: "Date", en: "Date" },
        { es: "Datetime", en: "Datetime" },
        { es: "Time", en: "Time" },
        { es: "String", en: "String" },
      ],
      answer: 0,
      explain: {
        es: "Un cierre es un día, no un instante. Usar Datetime añadiría una zona horaria que nadie pidió y que puede mover el día para otro usuario.",
        en: "A close is a day, not an instant. A Datetime would add a time zone nobody asked for, and one that can shift the day for another user.",
      },
    },
    {
      id: "m01-l04-q2",
      kind: "single",
      prompt: { es: "¿Cuál es el valor de renewal?", en: "What is the value of renewal?" },
      code: {
        es: `Date signed = Date.newInstance(2026, 1, 31);
Date renewal = signed.addMonths(1);`,
        en: `Date signed = Date.newInstance(2026, 1, 31);
Date renewal = signed.addMonths(1);`,
      },
      options: [
        { es: "2026-02-28", en: "2026-02-28" },
        { es: "2026-03-03", en: "2026-03-03" },
        { es: "2026-02-31", en: "2026-02-31" },
        { es: "Lanza un error.", en: "It throws an error." },
      ],
      answer: 0,
      explain: {
        es: "addMonths() ajusta al último día válido del mes destino. Sumar «30 días» a mano habría dado el 2 de marzo, que no es lo que significa «un mes después».",
        en: "addMonths() clamps to the last valid day of the target month. Adding “30 days” by hand would have given 2 March, which is not what “one month later” means.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m01-l04-q3",
      kind: "single",
      prompt: {
        es: "¿Qué tiene de malo esta línea?",
        en: "What is wrong with this line?",
      },
      code: {
        es: `Date closeDate = '2026-03-15';`,
        en: `Date closeDate = '2026-03-15';`,
      },
      options: [
        {
          es: "Lo de la derecha es texto, no una fecha: hay que construirla con Date.newInstance().",
          en: "The right-hand side is text, not a date: it must be built with Date.newInstance().",
        },
        { es: "El formato de fecha es incorrecto.", en: "The date format is wrong." },
        { es: "Falta la hora.", en: "The time is missing." },
        { es: "Nada, es correcta.", en: "Nothing, it is correct." },
      ],
      answer: 0,
      explain: {
        es: "Entre comillas está un String, y un String no sabe sumar días ni compararse con otra fecha. El tipo declarado no convierte el texto por arte de magia.",
        en: "In quotes it is a String, and a String cannot add days or compare itself to another date. The declared type does not magically convert the text.",
      },
      tags: ["find-error"],
    },
    {
      id: "m01-l04-q4",
      kind: "single",
      prompt: {
        es: "Un pedido creado a las 00:30 hora de Madrid aparece con fecha del día anterior para un usuario de Londres. ¿Por qué?",
        en: "An order created at 00:30 Madrid time shows the previous day for a user in London. Why?",
      },
      options: [
        {
          es: "El Datetime se guarda en GMT y se muestra en la zona de cada usuario.",
          en: "The Datetime is stored in GMT and displayed in each user's zone.",
        },
        {
          es: "Salesforce redondea las horas de madrugada.",
          en: "Salesforce rounds down small-hours timestamps.",
        },
        {
          es: "El campo se guardó como Date y perdió la hora.",
          en: "The field was saved as a Date and lost the time.",
        },
        {
          es: "Es un error conocido de la plataforma.",
          en: "It is a known platform bug.",
        },
      ],
      answer: 0,
      explain: {
        es: "El instante es el mismo; lo que cambia es la etiqueta con la que se muestra. Si el día tiene que ser el mismo para todos, el tipo correcto era Date.",
        en: "The instant is identical; what changes is the label it is shown with. If the day must be the same for everyone, the right type was Date.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m01-l04-q5",
      kind: "text",
      prompt: {
        es: "Escribe la expresión que calcula cuántos días faltan desde hoy hasta la variable renewal.",
        en: "Write the expression that calculates how many days remain from today until the variable renewal.",
      },
      accept: [
        "date\\.today\\(\\)\\.daysbetween\\(\\s*renewal\\s*\\)",
        "system\\.today\\(\\)\\.daysbetween\\(\\s*renewal\\s*\\)",
      ],
      placeholder: { es: "Date.today()…", en: "Date.today()…" },
      explain: {
        es: "Date.today().daysBetween(renewal). El orden importa: la fecha desde la que cuentas va delante, y si renewal ya pasó el resultado es negativo.",
        en: "Date.today().daysBetween(renewal). Order matters: the date you count from goes first, and if renewal is in the past the result is negative.",
      },
      tags: ["recall"],
    },
    {
      id: "m01-l04-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿qué imprime esto?",
        en: "Review: what does this print?",
      },
      code: {
        es: `String stage = 'Prospecting';
stage.toUpperCase();
System.debug(stage);`,
        en: `String stage = 'Prospecting';
stage.toUpperCase();
System.debug(stage);`,
      },
      options: [
        { es: "Prospecting", en: "Prospecting" },
        { es: "PROSPECTING", en: "PROSPECTING" },
        { es: "null", en: "null" },
        { es: "No compila.", en: "It does not compile." },
      ],
      answer: 0,
      explain: {
        es: "Los String son inmutables: toUpperCase() devolvió un texto nuevo que nadie guardó. Las fechas se comportan igual con addMonths().",
        en: "Strings are immutable: toUpperCase() returned a new string nobody stored. Dates behave the same way with addMonths().",
      },
      tags: ["spaced", "predict-output"],
      from: { es: "Repaso · M1 L3", en: "Review · M1 L3" },
    },
  ],

  exercise: {
    prompt: {
      es: "Renovaciones necesita preparar el aviso de un contrato. Te describen los datos en palabras; tú eliges el tipo de cada uno y calculas lo que falta, sin escribir ninguna fecha resultado a mano.",
      en: "Renewals needs to prepare a contract reminder. The data is described in words; you choose each type and compute what is missing, without typing any resulting date by hand.",
    },
    brief: [
      {
        es: "signedDate: el contrato se firmó el 15 de marzo de 2026. Solo importa el día.",
        en: "signedDate: the contract was signed on 15 March 2026. Only the day matters.",
      },
      {
        es: "renewalDate: exactamente un año después de la firma. Calcúlalo desde signedDate.",
        en: "renewalDate: exactly one year after signing. Compute it from signedDate.",
      },
      {
        es: "daysUntilRenewal: cuántos días faltan desde hoy hasta la renovación. Elige el tipo correcto para un recuento de días.",
        en: "daysUntilRenewal: how many days remain from today until the renewal. Choose the right type for a count of days.",
      },
      {
        es: "renewalYear: el año de la renovación, como número.",
        en: "renewalYear: the renewal year, as a number.",
      },
      {
        es: "reminderSentAt: el instante exacto en que se envía el aviso, que es ahora mismo.",
        en: "reminderSentAt: the exact instant the reminder is sent, which is right now.",
      },
    ],
    starter: {
      es: `// Renovaciones: prepara el aviso.
// Ojo con el tipo de cada dato: día, recuento, año o instante exacto.

`,
      en: `// Renewals: prepare the reminder.
// Mind each type: a day, a count, a year, or an exact instant.

`,
    },
    hints: [
      {
        es: "Repasa los tipos que elegiste: ¿hay alguna fecha escrita entre comillas, o algún recuento guardado en un tipo de fecha?",
        en: "Review the types you chose: is there a date written in quotes, or a count stored in a date type?",
      },
      {
        es: "Una fecha se construye con Date.newInstance(año, mes, día), nunca con comillas. Y daysBetween() cuenta días, así que lo que devuelve es un número entero, no una fecha.",
        en: "A date is built with Date.newInstance(year, month, day), never with quotes. And daysBetween() counts days, so what it returns is a whole number, not a date.",
      },
      {
        es: "Pseudocódigo: Date renewalDate = signedDate.addYears(1); e Integer daysUntilRenewal = Date.today().daysBetween(renewalDate);",
        en: "Pseudocode: Date renewalDate = signedDate.addYears(1); and Integer daysUntilRenewal = Date.today().daysBetween(renewalDate);",
      },
    ],
    solution: {
      es: `Date signedDate = Date.newInstance(2026, 3, 15);
Date renewalDate = signedDate.addYears(1);
Integer daysUntilRenewal = Date.today().daysBetween(renewalDate);
Integer renewalYear = renewalDate.year();
Datetime reminderSentAt = Datetime.now();`,
      en: `Date signedDate = Date.newInstance(2026, 3, 15);
Date renewalDate = signedDate.addYears(1);
Integer daysUntilRenewal = Date.today().daysBetween(renewalDate);
Integer renewalYear = renewalDate.year();
Datetime reminderSentAt = Datetime.now();`,
    },
    checks: [
      {
        id: "l04-c1",
        label: {
          es: "signedDate es un Date construido, no un texto",
          en: "signedDate is a built Date, not text",
        },
        rule: {
          op: "all",
          of: [
            {
              op: "match",
              pattern: "Date\\s+signedDate\\s*=\\s*Date\\s*\\.\\s*newInstance\\s*\\(\\s*2026\\s*,\\s*3\\s*,\\s*15\\s*\\)",
            },
            { op: "absent", pattern: "signedDate\\s*=\\s*'" },
          ],
        },
        onFail: {
          es: "Una fecha entre comillas es texto: no sabe sumar años. Constrúyela con Date.newInstance(2026, 3, 15).",
          en: "A date in quotes is text: it cannot add years. Build it with Date.newInstance(2026, 3, 15).",
        },
      },
      {
        id: "l04-c2",
        label: {
          es: "renewalDate se calcula desde signedDate",
          en: "renewalDate is computed from signedDate",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Date\\s+renewalDate\\s*=\\s*signedDate\\s*\\.\\s*add(Years|Months)\\s*\\(" },
          ],
        },
        onFail: {
          es: "«Un año después» se calcula, no se escribe: signedDate.addYears(1). Si mañana cambia la fecha de firma, la renovación debe seguirla sola.",
          en: "“One year later” is computed, not typed: signedDate.addYears(1). If the signing date changes tomorrow, the renewal has to follow on its own.",
        },
        onPass: {
          es: "Derivar la fecha en vez de escribirla es lo que hace que el código siga siendo correcto el año que viene.",
          en: "Deriving the date instead of typing it is what keeps the code correct next year.",
        },
      },
      {
        id: "l04-c3",
        label: {
          es: "daysUntilRenewal es Integer y usa daysBetween()",
          en: "daysUntilRenewal is an Integer using daysBetween()",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Integer\\s+daysUntilRenewal\\s*=" },
            { op: "match", pattern: "daysBetween\\s*\\(\\s*renewalDate\\s*\\)" },
            { op: "match", pattern: "(Date|System)\\s*\\.\\s*today\\s*\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "Un recuento de días es un número entero, no una fecha. Y tiene que contarse desde hoy: Date.today().daysBetween(renewalDate).",
          en: "A count of days is a whole number, not a date. And it must count from today: Date.today().daysBetween(renewalDate).",
        },
      },
      {
        id: "l04-c4",
        label: {
          es: "renewalYear sale de la propia fecha",
          en: "renewalYear comes from the date itself",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Integer\\s+renewalYear\\s*=" },
            { op: "match", pattern: "renewalYear\\s*=\\s*renewalDate\\s*\\.\\s*year\\s*\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "Escribir 2027 a mano funciona hasta el primer contrato firmado en otra fecha. year() te lo da a partir de renewalDate.",
          en: "Typing 2027 by hand works until the first contract signed on another date. year() derives it from renewalDate.",
        },
      },
      {
        id: "l04-c5",
        label: {
          es: "reminderSentAt es un Datetime del instante actual",
          en: "reminderSentAt is a Datetime of the current instant",
        },
        rule: {
          op: "match",
          pattern: "Datetime\\s+reminderSentAt\\s*=\\s*Datetime\\s*\\.\\s*now\\s*\\(\\s*\\)",
        },
        onFail: {
          es: "«El instante exacto» es lo único de este ejercicio que sí necesita hora y zona horaria: Datetime.now(). Date.today() perdería la hora.",
          en: "“The exact instant” is the only thing here that genuinely needs a time and a zone: Datetime.now(). Date.today() would drop the time.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Cuál de estas cinco variables cambiaría de valor según quién ejecute el código? Esa es la que lleva zona horaria.",
        en: "Which of these five variables would change value depending on who runs the code? That is the one carrying a time zone.",
      },
    ],
  },
};
