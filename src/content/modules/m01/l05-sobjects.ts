import type { Lesson } from "@/lib/types";

export const l05SObjects: Lesson = {
  id: "m01-l05",
  slug: "sobjects",
  n: 5,
  kind: "lesson",
  minutes: 24,
  title: { es: "sObjects", en: "sObjects" },
  summary: {
    es: "El tipo que convierte un registro de Salesforce en una variable. Aquí es donde Apex deja de parecer un lenguaje genérico.",
    en: "The type that turns a Salesforce record into a variable. This is where Apex stops looking like a generic language.",
  },
  objectives: [
    {
      es: "Crear un registro en memoria y rellenar sus campos.",
      en: "Create a record in memory and fill in its fields.",
    },
    {
      es: "Usar nombres de API en lugar de etiquetas, y saber por qué importa.",
      en: "Use API names instead of labels, and know why it matters.",
    },
    {
      es: "Distinguir un registro que existe en memoria de uno que existe en la base de datos.",
      en: "Tell a record that exists in memory from one that exists in the database.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Hasta ahora las variables guardaban un dato suelto: un texto, un número, una fecha. Un sObject guarda una fila entera — un registro con todos sus campos — y en Apex se maneja exactamente igual que cualquier otra variable.",
        en: "So far a variable held one loose value: a piece of text, a number, a date. An sObject holds an entire row — a record with all its fields — and in Apex you handle it exactly like any other variable.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Object Manager es la definición; el sObject es la fila", en: "Object Manager is the definition; the sObject is the row" },
      text: {
        es: "En Setup defines el objeto Account una vez: qué campos tiene, de qué tipo, con qué nombre de API. Eso es el molde. Cada cuenta que existe en la org es una fila hecha con ese molde. Cuando en Apex escribes Account, estás usando el molde; cuando escribes new Account(), estás fabricando una fila nueva.",
        en: "In Setup you define the Account object once: which fields it has, of what type, under which API names. That is the mould. Every account in the org is a row cast from it. When you write Account in Apex you are using the mould; when you write new Account() you are producing a fresh row.",
      },
    },
    {
      type: "diagram",
      id: "m01-sobject",
      caption: {
        es: "Mismo molde a ambos lados. La diferencia está en si la fila ya se guardó o todavía solo existe en memoria.",
        en: "The same mould on both sides. The difference is whether the row has been saved or still only lives in memory.",
      },
    },
    {
      type: "h",
      text: { es: "Crear un registro", en: "Creating a record" },
    },
    {
      type: "p",
      text: {
        es: "La palabra new fabrica un registro vacío del objeto que le digas. A partir de ahí, cada campo se rellena con un punto: el punto significa «el campo de».",
        en: "The keyword new produces an empty record of whatever object you name. From there, each field is filled in with a dot: the dot means “the field of”.",
      },
    },
    {
      type: "code",
      code: {
        es: `Account newAccount = new Account();
newAccount.Name = 'Northwind Trading';
newAccount.Industry = 'Technology';
newAccount.NumberOfEmployees = 340;`,
        en: `Account newAccount = new Account();
newAccount.Name = 'Northwind Trading';
newAccount.Industry = 'Technology';
newAccount.NumberOfEmployees = 340;`,
      },
    },
    {
      type: "p",
      text: {
        es: "Hay una forma más corta que hace lo mismo en una sola sentencia: pasar los campos dentro de los paréntesis, cada uno con su nombre. Es la que verás en el código de cualquier org.",
        en: "There is a shorter form that does the same in one statement: pass the fields inside the brackets, each by name. It is the one you will see in any org's code.",
      },
    },
    {
      type: "code",
      code: {
        es: `Account newAccount = new Account(
    Name = 'Northwind Trading',
    Industry = 'Technology',
    NumberOfEmployees = 340
);`,
        en: `Account newAccount = new Account(
    Name = 'Northwind Trading',
    Industry = 'Technology',
    NumberOfEmployees = 340
);`,
      },
      caption: {
        es: "Dentro de los paréntesis se usa un solo igual, aunque estés «configurando» y no comparando.",
        en: "Inside the brackets you use a single equals, even though you are configuring rather than comparing.",
      },
    },
    {
      type: "h",
      text: { es: "El nombre de API manda", en: "The API name rules" },
    },
    {
      type: "p",
      text: {
        es: "En el layout ves «Número de empleados». En Apex escribes NumberOfEmployees. La etiqueta es para las personas y puede cambiar —incluso traducirse— sin romper nada; el nombre de API es el que usa el código y no cambia jamás una vez creado.",
        en: "The layout shows “Number of Employees”. In Apex you write NumberOfEmployees. The label is for people and can change — even be translated — without breaking anything; the API name is what the code uses and never changes once created.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Tipo de campo", en: "Field kind" },
        { es: "Cómo se escribe", en: "How it is written" },
        { es: "Ejemplo", en: "Example" },
      ],
      rows: [
        [
          { es: "Estándar", en: "Standard" },
          { es: "Tal cual, sin sufijo.", en: "As is, no suffix." },
          { es: "opportunity.StageName", en: "opportunity.StageName" },
        ],
        [
          { es: "Personalizado", en: "Custom" },
          { es: "Termina en __c (dos guiones bajos).", en: "Ends in __c (two underscores)." },
          { es: "lead.Region__c", en: "lead.Region__c" },
        ],
        [
          { es: "Objeto personalizado", en: "Custom object" },
          { es: "El propio objeto también lleva __c.", en: "The object itself also carries __c." },
          { es: "new Assignment_Rule__c()", en: "new Assignment_Rule__c()" },
        ],
        [
          { es: "Identificador", en: "Identifier" },
          { es: "Siempre se llama Id.", en: "Always called Id." },
          { es: "account.Id", en: "account.Id" },
        ],
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Un nombre mal escrito no es un error en ejecución", en: "A misspelled name is not a runtime error" },
      text: {
        es: "Si escribes account.Nmae, el código no compila. Apex conoce la estructura de tus objetos y comprueba cada campo al guardar la clase. Es la misma protección que te da una regla de validación, pero mucho antes: antes incluso de que exista un registro.",
        en: "Write account.Nmae and the code does not compile. Apex knows your objects' structure and checks every field when the class is saved. It is the same protection a validation rule gives you, only far earlier: before a record even exists.",
      },
    },
    {
      type: "h",
      text: { es: "En memoria no es lo mismo que guardado", en: "In memory is not the same as saved" },
    },
    {
      type: "p",
      text: {
        es: "Crear un sObject con new es como pulsar «Nuevo» en la interfaz y empezar a rellenar el formulario: el registro existe delante de ti, pero todavía no está en la base de datos. Su campo Id está vacío, nadie más lo ve y, si la transacción termina, desaparece. Guardarlo es otra operación —DML— y tiene su propio módulo.",
        en: "Creating an sObject with new is like hitting “New” in the UI and starting to fill in the form: the record is there in front of you, but it is not in the database yet. Its Id field is empty, nobody else can see it, and if the transaction ends it vanishes. Saving it is a separate operation — DML — and it has its own module.",
      },
    },
    {
      type: "code",
      code: {
        es: `Opportunity opp = new Opportunity(Name = 'Renovación Northwind');

System.debug(opp.Id);      // null: todavía no existe en la base de datos
System.debug(opp.Name);    // 'Renovación Northwind'`,
        en: `Opportunity opp = new Opportunity(Name = 'Northwind renewal');

System.debug(opp.Id);      // null: it does not exist in the database yet
System.debug(opp.Name);    // 'Northwind renewal'`,
      },
    },
    {
      type: "h",
      text: { es: "Leer campos de un registro", en: "Reading fields from a record" },
    },
    {
      type: "p",
      text: {
        es: "Leer se hace con el mismo punto, y el valor que sale tiene el tipo del campo: un campo de texto devuelve un String, uno de moneda devuelve un Decimal, una casilla devuelve un Boolean. Por eso todo lo de las sub-lecciones anteriores sigue aplicando aquí.",
        en: "Reading uses the same dot, and the value that comes out has the field's type: a text field gives a String, a currency field gives a Decimal, a checkbox gives a Boolean. Which is why everything from the earlier sub-lessons still applies here.",
      },
    },
    {
      type: "code",
      code: {
        es: `Account account = new Account(Name = '  acme corp  ', AnnualRevenue = 500000);

String tidyName = account.Name.trim();          // método de String sobre un campo
Decimal revenue = account.AnnualRevenue;        // un campo Currency es Decimal
Integer nameLength = account.Name.length();`,
        en: `Account account = new Account(Name = '  acme corp  ', AnnualRevenue = 500000);

String tidyName = account.Name.trim();          // a String method on a field
Decimal revenue = account.AnnualRevenue;        // a Currency field is a Decimal
Integer nameLength = account.Name.length();`,
      },
      caption: {
        es: "Un campo no es un tipo aparte: es un String, un Decimal o una Date, con todos sus métodos.",
        en: "A field is not a separate kind of thing: it is a String, a Decimal or a Date, with all their methods.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿qué vale el campo Id de un registro recién creado con new? ¿Y cómo se escribe un campo personalizado llamado «Región»?",
        en: "Without looking up: what is the Id field worth on a record just created with new? And how do you write a custom field called “Region”?",
      },
    },
  ],

  quiz: [
    {
      id: "m01-l05-q1",
      kind: "single",
      prompt: { es: "¿Qué imprime este código?", en: "What does this code print?" },
      code: {
        es: `Contact c = new Contact(LastName = 'García');
System.debug(c.Id);`,
        en: `Contact c = new Contact(LastName = 'Garcia');
System.debug(c.Id);`,
      },
      options: [
        { es: "null", en: "null" },
        { es: "Un Id de 18 caracteres.", en: "An 18-character Id." },
        { es: "0", en: "0" },
        { es: "Lanza una excepción.", en: "It throws an exception." },
      ],
      answer: 0,
      explain: {
        es: "El Id lo asigna la base de datos al guardar. Hasta que no haya un insert, el registro solo existe en memoria y su Id está vacío.",
        en: "The Id is assigned by the database on save. Until there is an insert, the record only exists in memory and its Id is empty.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m01-l05-q2",
      kind: "single",
      prompt: {
        es: "Tienes un campo personalizado con etiqueta «Región» y nombre de API Region__c. ¿Cómo lo asignas en Apex?",
        en: "You have a custom field labelled “Region” with API name Region__c. How do you set it in Apex?",
      },
      options: [
        { es: "lead.Region__c = 'EMEA';", en: "lead.Region__c = 'EMEA';" },
        { es: "lead.Región = 'EMEA';", en: "lead.Region = 'EMEA';" },
        { es: "lead.Region_c = 'EMEA';", en: "lead.Region_c = 'EMEA';" },
        { es: "lead['Región'] = 'EMEA';", en: "lead['Region'] = 'EMEA';" },
      ],
      answer: 0,
      explain: {
        es: "Siempre el nombre de API, y los campos personalizados llevan dos guiones bajos antes de la c. Con uno solo no compila.",
        en: "Always the API name, and custom fields carry two underscores before the c. With only one it does not compile.",
      },
    },
    {
      id: "m01-l05-q3",
      kind: "single",
      prompt: {
        es: "¿Qué ocurre con esta línea?",
        en: "What happens with this line?",
      },
      code: {
        es: `Account a = new Account();
a.Nmae = 'Acme';`,
        en: `Account a = new Account();
a.Nmae = 'Acme';`,
      },
      options: [
        {
          es: "No compila: Apex conoce los campos del objeto y ese no existe.",
          en: "It does not compile: Apex knows the object's fields and that one does not exist.",
        },
        {
          es: "Compila y crea el campo sobre la marcha.",
          en: "It compiles and creates the field on the fly.",
        },
        {
          es: "Compila y falla en ejecución.",
          en: "It compiles and fails at runtime.",
        },
        {
          es: "Compila y el valor se ignora silenciosamente.",
          en: "It compiles and the value is silently ignored.",
        },
      ],
      answer: 0,
      explain: {
        es: "El error salta al guardar la clase, no al ejecutarla. Apex valida la estructura de los objetos en tiempo de compilación, que es la mejor hora posible para enterarse.",
        en: "The error fires when the class is saved, not when it runs. Apex validates object structure at compile time, which is the best possible moment to find out.",
      },
      tags: ["find-error"],
    },
    {
      id: "m01-l05-q4",
      kind: "multi",
      prompt: {
        es: "¿Cuáles de estas afirmaciones sobre un registro creado con new son ciertas?",
        en: "Which of these statements about a record created with new are true?",
      },
      options: [
        {
          es: "Existe solo en la memoria de esta transacción.",
          en: "It exists only in this transaction's memory.",
        },
        {
          es: "Su Id está vacío hasta que se guarde.",
          en: "Its Id is empty until it is saved.",
        },
        {
          es: "Otros usuarios pueden verlo en la interfaz.",
          en: "Other users can see it in the UI.",
        },
        {
          es: "Sus campos se leen y escriben con un punto.",
          en: "Its fields are read and written with a dot.",
        },
      ],
      answers: [0, 1, 3],
      explain: {
        es: "Hasta que no se ejecuta un DML no existe para nadie más. Es exactamente el formulario «Nuevo» a medio rellenar.",
        en: "Until a DML runs it does not exist for anyone else. It is exactly the half-filled “New” form.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m01-l05-q5",
      kind: "single",
      prompt: {
        es: "Un campo Currency leído desde un sObject llega a Apex como…",
        en: "A Currency field read from an sObject arrives in Apex as…",
      },
      code: {
        es: `Account a = new Account(AnnualRevenue = 500000);
??? revenue = a.AnnualRevenue;`,
        en: `Account a = new Account(AnnualRevenue = 500000);
??? revenue = a.AnnualRevenue;`,
      },
      options: [
        { es: "Decimal", en: "Decimal" },
        { es: "Integer", en: "Integer" },
        { es: "String", en: "String" },
        { es: "Double", en: "Double" },
      ],
      answer: 0,
      explain: {
        es: "Un campo no tiene un tipo propio de Salesforce: al leerlo obtienes un tipo de Apex, y el de Currency es Decimal.",
        en: "A field does not have some special Salesforce type: reading it gives you an Apex type, and Currency's is Decimal.",
      },
      tags: ["spaced", "interleaving"],
      from: { es: "Repaso · M1 L2", en: "Review · M1 L2" },
    },
    {
      id: "m01-l05-q6",
      kind: "text",
      prompt: {
        es: "Escribe la línea que crea en memoria una oportunidad con el nombre 'Renovación' usando la forma corta (los campos dentro de los paréntesis). Llama a la variable opp.",
        en: "Write the line that creates an opportunity in memory named 'Renewal' using the short form (fields inside the brackets). Name the variable opp.",
      },
      accept: [
        "opportunity\\s+opp\\s*=\\s*new\\s+opportunity\\s*\\(\\s*name\\s*=\\s*'[^']+'\\s*\\)\\s*;?",
      ],
      placeholder: { es: "Opportunity opp = …", en: "Opportunity opp = …" },
      explain: {
        es: "Opportunity opp = new Opportunity(Name = 'Renovación'); — dentro de los paréntesis va un solo igual, aunque parezca una comparación.",
        en: "Opportunity opp = new Opportunity(Name = 'Renewal'); — inside the brackets it is a single equals, even though it looks like a comparison.",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "Marketing te pasa una ficha de Lead recogida en una feria. Crea el registro en memoria y prepara dos valores derivados para el panel. La ficha describe los datos; tú decides el tipo de cada variable auxiliar.",
      en: "Marketing hands you a Lead captured at a trade show. Create the record in memory and prepare two derived values for the dashboard. The note describes the data; you decide the type of each helper variable.",
    },
    brief: [
      {
        es: "Crea un Lead llamado newLead con Company = '  globex industries  ', LastName = 'Fernández' y NumberOfEmployees = 120.",
        en: "Create a Lead named newLead with Company = '  globex industries  ', LastName = 'Fernandez' and NumberOfEmployees = 120.",
      },
      {
        es: "Asigna también el campo personalizado Region__c con el valor 'EMEA'.",
        en: "Also set the custom field Region__c to 'EMEA'.",
      },
      {
        es: "cleanCompany: el nombre de empresa del Lead, sin los espacios de los extremos. Léelo del registro, no de un texto suelto.",
        en: "cleanCompany: the Lead's company name with the outer spaces removed. Read it from the record, not from a loose string.",
      },
      {
        es: "employeeCount: el número de empleados del Lead. Elige el tipo que corresponde a un recuento.",
        en: "employeeCount: the Lead's employee count. Choose the type that fits a count.",
      },
      {
        es: "capturedOn: el día en que se captura el Lead, que es hoy.",
        en: "capturedOn: the day the Lead is captured, which is today.",
      },
    ],
    starter: {
      es: `// Ficha de feria. Crea el registro en memoria y deriva los dos valores.

`,
      en: `// Trade-show capture. Create the record in memory and derive the two values.

`,
    },
    hints: [
      {
        es: "Fíjate en de dónde sacas cleanCompany: ¿lo estás leyendo del registro que acabas de crear, o volviste a escribir el texto?",
        en: "Look at where cleanCompany comes from: are you reading it off the record you just created, or did you retype the text?",
      },
      {
        es: "Los campos de un sObject se leen con el mismo punto con el que se escriben, y lo que devuelven es un tipo normal de Apex con todos sus métodos: newLead.Company es un String.",
        en: "An sObject's fields are read with the same dot used to write them, and what they return is an ordinary Apex type with all its methods: newLead.Company is a String.",
      },
      {
        es: "Pseudocódigo: String cleanCompany = newLead.Company.trim(); — y recuerda que un campo personalizado lleva __c.",
        en: "Pseudocode: String cleanCompany = newLead.Company.trim(); — and remember a custom field carries __c.",
      },
    ],
    solution: {
      es: `Lead newLead = new Lead(
    Company = '  globex industries  ',
    LastName = 'Fernández',
    NumberOfEmployees = 120
);
newLead.Region__c = 'EMEA';

String cleanCompany = newLead.Company.trim();
Integer employeeCount = newLead.NumberOfEmployees;
Date capturedOn = Date.today();`,
      en: `Lead newLead = new Lead(
    Company = '  globex industries  ',
    LastName = 'Fernandez',
    NumberOfEmployees = 120
);
newLead.Region__c = 'EMEA';

String cleanCompany = newLead.Company.trim();
Integer employeeCount = newLead.NumberOfEmployees;
Date capturedOn = Date.today();`,
    },
    checks: [
      {
        id: "l05-c1",
        label: {
          es: "Crea un Lead en memoria con los tres campos estándar",
          en: "Creates a Lead in memory with the three standard fields",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Lead\\s+newLead\\s*=\\s*new\\s+Lead\\s*\\(" },
            { op: "match", pattern: "Company\\s*=" },
            { op: "match", pattern: "LastName\\s*=" },
            { op: "match", pattern: "NumberOfEmployees\\s*=\\s*120" },
          ],
        },
        onFail: {
          es: "El registro se fabrica con new Lead(...) y los campos se escriben con su nombre de API exacto: Company, LastName, NumberOfEmployees.",
          en: "The record is produced with new Lead(...) and the fields are written with their exact API names: Company, LastName, NumberOfEmployees.",
        },
      },
      {
        id: "l05-c2",
        label: {
          es: "Asigna el campo personalizado Region__c",
          en: "Sets the custom field Region__c",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Region__c\\s*=\\s*'EMEA'" },
            { op: "absent", pattern: "Region_c\\s*=" },
          ],
        },
        onFail: {
          es: "Los campos personalizados llevan dos guiones bajos antes de la c: Region__c. Con uno solo, Apex no encuentra el campo y no compila.",
          en: "Custom fields carry two underscores before the c: Region__c. With only one, Apex cannot find the field and will not compile.",
        },
      },
      {
        id: "l05-c3",
        label: {
          es: "cleanCompany se lee del registro y se limpia",
          en: "cleanCompany is read off the record and cleaned",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "String\\s+cleanCompany\\s*=" },
            {
              op: "match",
              pattern: "cleanCompany\\s*=\\s*newLead\\s*\\.\\s*Company\\s*\\.\\s*trim\\s*\\(\\s*\\)",
            },
          ],
        },
        onFail: {
          es: "Tiene que salir del registro: newLead.Company.trim(). Si vuelves a escribir el texto a mano, el día que cambie el Lead el panel seguirá mostrando lo de antes.",
          en: "It must come off the record: newLead.Company.trim(). Retype the text by hand and the day the Lead changes, the dashboard keeps showing the old value.",
        },
        onPass: {
          es: "Leer del registro en vez de repetir el literal es lo que hace que el código siga sirviendo con el siguiente Lead.",
          en: "Reading from the record instead of repeating the literal is what keeps the code useful for the next Lead.",
        },
      },
      {
        id: "l05-c4",
        label: {
          es: "employeeCount es Integer y sale del campo",
          en: "employeeCount is an Integer taken from the field",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Integer\\s+employeeCount\\s*=" },
            { op: "match", pattern: "employeeCount\\s*=\\s*newLead\\s*\\.\\s*NumberOfEmployees" },
          ],
        },
        onFail: {
          es: "Un recuento de empleados es Integer, y el valor tiene que leerse del campo del registro, no volver a escribirse.",
          en: "An employee count is an Integer, and the value has to be read from the record's field rather than retyped.",
        },
      },
      {
        id: "l05-c5",
        label: { es: "capturedOn es un Date de hoy", en: "capturedOn is today's Date" },
        rule: {
          op: "match",
          pattern: "Date\\s+capturedOn\\s*=\\s*(Date|System)\\s*\\.\\s*today\\s*\\(\\s*\\)",
        },
        onFail: {
          es: "«El día en que se captura» es un día, no un instante: Date.today(). Datetime.now() añadiría una hora y una zona horaria que nadie pidió.",
          en: "“The day it is captured” is a day, not an instant: Date.today(). Datetime.now() would add a time and a zone nobody asked for.",
        },
      },
    ],
    rubric: [
      {
        es: "Si este Lead viniera de un formulario y Company llegara vacío, ¿qué haría .trim()? Esa pregunta es exactamente la siguiente sub-lección.",
        en: "If this Lead came from a form and Company arrived empty, what would .trim() do? That question is precisely the next sub-lesson.",
      },
    ],
  },
};
