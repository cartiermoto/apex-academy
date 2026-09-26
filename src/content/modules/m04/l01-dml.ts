import type { Lesson } from "@/lib/types";

export const l01Dml: Lesson = {
  id: "m04-l01",
  slug: "insert-update-delete-upsert",
  n: 1,
  kind: "lesson",
  minutes: 30,
  title: {
    es: "insert, update, delete, upsert",
    en: "insert, update, delete, upsert",
  },
  summary: {
    es: "Las cuatro operaciones de Data Loader, escritas en una línea de Apex. Qué necesita cada una, qué pasa por dentro al guardar y por qué siempre trabajan mejor con listas.",
    en: "Data Loader's four operations, written as one line of Apex. What each one needs, what happens inside when saving, and why they always work better with lists.",
  },
  analogy: {
    es: "Las operaciones de Data Loader y los elementos Create/Update/Delete Records de Flow",
    en: "Data Loader's operations and Flow's Create/Update/Delete Records elements",
  },
  objectives: [
    {
      es: "Crear, modificar, borrar y recuperar registros con insert, update, delete y undelete.",
      en: "Create, change, delete and restore records with insert, update, delete and undelete.",
    },
    {
      es: "Usar upsert con un campo de Id externo para crear o actualizar según exista.",
      en: "Use upsert with an external Id field to create or update depending on whether it exists.",
    },
    {
      es: "Explicar qué dispara un DML: reglas de validación, flows y triggers.",
      en: "Explain what a DML sets off: validation rules, flows and triggers.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "En el Módulo 3 aprendiste a leer la base de datos. Todo lo que has construido hasta ahora (objetos con new, campos cambiados, listas preparadas) vive solo en memoria y desaparece al terminar la [[transaccion|transacción]]. Para que algo se guarde de verdad hace falta [[dml|DML]]: las instrucciones que escriben en la base de datos.",
        en: "In Module 3 you learned to read the database. Everything you have built so far (objects made with new, fields changed, lists prepared) lives only in memory and disappears when the [[transaccion|transaction]] ends. For anything to be really saved you need [[dml|DML]]: the statements that write to the database.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Abre Data Loader: Insert, Update, Upsert, Delete. Son exactamente las instrucciones de esta lección. Y ya conoces sus reglas: para Insert no mapeas el Id; para Update el Id es obligatorio; para Upsert eliges un campo de Id externo; lo borrado va a la Papelera. En Flow son los elementos Create Records, Update Records y Delete Records. Apex no inventa nada nuevo: te da las mismas operaciones con más control.",
        en: "Open Data Loader: Insert, Update, Upsert, Delete. They are exactly this lesson's statements. And you already know their rules: for Insert you do not map the Id; for Update the Id is mandatory; for Upsert you pick an external Id field; deleted records go to the Recycle Bin. In Flow they are the Create Records, Update Records and Delete Records elements. Apex invents nothing new: it gives you the same operations with more control.",
      },
    },
    {
      type: "diagram",
      id: "m04-dml-ops",
      caption: {
        es: "Cada operación de Data Loader tiene su instrucción, y cada una necesita lo mismo que allí.",
        en: "Each Data Loader operation has its statement, and each needs the same as it does there.",
      },
    },
    {
      type: "h",
      text: { es: "insert: crear", en: "insert: create" },
    },
    {
      type: "code",
      code: {
        es: `Account acc = new Account(Name = 'Nimbus Logistics', Industry = 'Transportation');
System.debug(acc.Id);   // null: todavía no existe en la base de datos

insert acc;
System.debug(acc.Id);   // 001...: Salesforce le ha dado un Id`,
        en: `Account acc = new Account(Name = 'Nimbus Logistics', Industry = 'Transportation');
System.debug(acc.Id);   // null: it does not exist in the database yet

insert acc;
System.debug(acc.Id);   // 001...: Salesforce has given it an Id`,
      },
      caption: {
        es: "Después del insert, la variable ya tiene su Id, como el archivo success.csv de Data Loader. Con ese Id puedes crear los hijos enseguida.",
        en: "After the insert, the variable already has its Id, like Data Loader's success.csv file. With that Id you can create the children right away.",
      },
    },
    {
      type: "code",
      code: {
        es: `List<Contact> contacts = new List<Contact>{
    new Contact(LastName = 'Ortega', AccountId = acc.Id),
    new Contact(LastName = 'Lindqvist', AccountId = acc.Id)
};
insert contacts;   // una sola instrucción para toda la lista`,
        en: `List<Contact> contacts = new List<Contact>{
    new Contact(LastName = 'Ortega', AccountId = acc.Id),
    new Contact(LastName = 'Lindqvist', AccountId = acc.Id)
};
insert contacts;   // a single statement for the whole list`,
      },
    },
    {
      type: "h",
      text: { es: "update: cambiar", en: "update: change" },
    },
    {
      type: "p",
      text: {
        es: "update necesita el Id, igual que en Data Loader, porque así sabe qué registro cambiar. Lo habitual es consultar, modificar en memoria y actualizar. Pero si ya tienes el Id y solo quieres cambiar un campo, no hace falta consultar: basta un sObject con el Id y el campo, como un CSV de Data Loader con solo dos columnas.",
        en: "update needs the Id, just as in Data Loader, because that is how it knows which record to change. The usual flow is query, change in memory and update. But if you already have the Id and only want to change one field, you do not need to query: an sObject with the Id and the field is enough, like a Data Loader CSV with just two columns.",
      },
    },
    {
      type: "code",
      code: {
        es: `// Consultar → modificar → actualizar
List<Account> cold = [SELECT Id, Rating FROM Account WHERE Rating = 'Cold' AND Industry = 'Retail'];
for (Account a : cold) {
    a.Rating = 'Warm';
}
update cold;

// Sin consultar: solo el Id y lo que cambia
update new Account(Id = acc.Id, Rating = 'Hot');`,
        en: `// Query → change → update
List<Account> cold = [SELECT Id, Rating FROM Account WHERE Rating = 'Cold' AND Industry = 'Retail'];
for (Account a : cold) {
    a.Rating = 'Warm';
}
update cold;

// Without querying: just the Id and what changes
update new Account(Id = acc.Id, Rating = 'Hot');`,
      },
      caption: {
        es: "El bucle cambia los registros en memoria (referencias, Módulo 5); el update, fuera del bucle, los guarda todos de una vez.",
        en: "The loop changes the records in memory (references, Module 5); the update, outside the loop, saves them all at once.",
      },
    },
    {
      type: "h",
      text: { es: "delete y undelete: la Papelera", en: "delete and undelete: the Recycle Bin" },
    },
    {
      type: "code",
      code: {
        es: `List<Lead> junk = [SELECT Id FROM Lead WHERE Email = null AND CreatedDate < LAST_N_DAYS:365];
delete junk;        // van a la Papelera, como al borrar desde la interfaz

// Recuperar: ALL ROWS hace que la consulta vea también lo borrado
List<Lead> back = [SELECT Id FROM Lead WHERE IsDeleted = true AND LastName = 'Ortega' ALL ROWS];
undelete back;`,
        en: `List<Lead> junk = [SELECT Id FROM Lead WHERE Email = null AND CreatedDate < LAST_N_DAYS:365];
delete junk;        // they go to the Recycle Bin, as when deleting from the UI

// Restore: ALL ROWS makes the query see deleted records too
List<Lead> back = [SELECT Id FROM Lead WHERE IsDeleted = true AND LastName = 'Ortega' ALL ROWS];
undelete back;`,
      },
    },
    {
      type: "h",
      text: { es: "upsert: crear o actualizar", en: "upsert: create or update" },
    },
    {
      type: "p",
      text: {
        es: "Cuando cargas datos que vienen de otro sistema (un ERP, una tienda online) no sabes si cada cliente ya existe en Salesforce. En Data Loader usas Upsert con un campo marcado como [[id-externo|External ID]]: si el valor ya está, actualiza; si no, crea. En Apex es igual, indicando ese campo detrás de la lista.",
        en: "When you load data coming from another system (an ERP, an online shop) you do not know whether each customer already exists in Salesforce. In Data Loader you use Upsert with a field marked as [[id-externo|External ID]]: if the value is already there, it updates; if not, it creates. In Apex it is the same, naming that field after the list.",
      },
    },
    {
      type: "code",
      code: {
        es: `// ERP_Id__c es un campo de texto marcado como External ID
List<Account> fromErp = new List<Account>{
    new Account(ERP_Id__c = 'C-1001', Name = 'Nimbus Logistics'),
    new Account(ERP_Id__c = 'C-2040', Name = 'Aurora Foods')
};
upsert fromErp Account.Fields.ERP_Id__c;`,
        en: `// ERP_Id__c is a text field marked as External ID
List<Account> fromErp = new List<Account>{
    new Account(ERP_Id__c = 'C-1001', Name = 'Nimbus Logistics'),
    new Account(ERP_Id__c = 'C-2040', Name = 'Aurora Foods')
};
upsert fromErp Account.Fields.ERP_Id__c;`,
      },
      caption: {
        es: "Sin campo detrás, upsert usa el Id de Salesforce: los registros con Id se actualizan y los que no lo tienen se crean.",
        en: "With no field after it, upsert uses the Salesforce Id: records with an Id are updated and those without one are created.",
      },
    },
    {
      type: "h",
      text: { es: "Lo que se dispara al guardar", en: "What fires when you save" },
    },
    {
      type: "p",
      text: {
        es: "Un insert desde Apex no es una puerta trasera. Pasa por los mismos controles que un guardado desde la pantalla o desde Data Loader: campos obligatorios, reglas de validación, flows desencadenados por registro, triggers, reglas de asignación. Si una regla de validación dice que falta el teléfono, tu insert falla con el mismo mensaje que vería el usuario. En el Módulo 6 verás el orden exacto en que ocurre todo eso.",
        en: "An insert from Apex is not a back door. It goes through the same checks as a save from the screen or from Data Loader: required fields, validation rules, record-triggered flows, triggers, assignment rules. If a validation rule says the phone is missing, your insert fails with the same message the user would see. In Module 6 you will see the exact order in which all of that happens.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Esto sí escribe de verdad", en: "This really writes" },
      text: {
        es: "Todo lo del Módulo 3 era lectura: podías equivocarte sin consecuencias. Un delete ejecutado en la ventana Execute Anonymous de producción borra registros reales, y un update de 5.000 filas dispara 5.000 veces tus flows. Practica siempre en tu Developer Org o en un sandbox. Es la misma regla que ya sigues con Data Loader.",
        en: "Everything in Module 3 was read-only: you could get it wrong with no consequences. A delete run in production's Execute Anonymous window deletes real records, and an update of 5,000 rows fires your flows 5,000 times. Always practise in your Developer Org or a sandbox. It is the same rule you already follow with Data Loader.",
      },
    },
    {
      type: "h",
      text: { es: "Tu código pasa por las mismas reglas que un usuario", en: "Your code goes through the same rules as a user" },
    },
    {
      type: "p",
      text: {
        es: "Un insert desde Apex no es una puerta trasera. El registro recorre el mismo guardado que cuando alguien pulsa Guardar en la pantalla: se ejecutan tus reglas de validación, tus flows desencadenados por registro y los triggers del objeto (Módulo 6). Si una regla de validación rechaza el registro, el insert lanza una DmlException con el mismo mensaje que vería el usuario. Tu código no se salta la configuración de la org: convive con ella.",
        en: "An insert from Apex is not a back door. The record goes through the same save as when someone clicks Save on screen: your validation rules, your record-triggered flows and the object's triggers (Module 6) all run. If a validation rule rejects the record, the insert throws a DmlException with the same message the user would see. Your code does not skip the org's configuration: it lives alongside it.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El «obligatorio» del formato de página no te protege aquí", en: "The page layout's «required» does not protect you here" },
      text: {
        es: "Hay dos formas de hacer un campo obligatorio, y desde Apex solo cuenta una. Marcarlo como Required en la definición del campo (o con una regla de validación) se aplica siempre, también a Apex y a Data Loader. Marcarlo como obligatorio solo en el formato de página se aplica en la pantalla, y nada más: un insert desde código lo guarda vacío sin quejarse. Si un dato no puede faltar nunca, que lo exija el campo o una regla de validación, no el formato de página.",
        en: "There are two ways to make a field required, and from Apex only one counts. Marking it Required in the field definition (or with a validation rule) always applies, to Apex and Data Loader too. Marking it required only on the page layout applies on screen and nowhere else: an insert from code saves it empty without complaint. If a value must never be missing, let the field or a validation rule demand it, not the page layout.",
      },
    },
    {
      type: "h",
      text: { es: "El encargo de este módulo", en: "This module's assignment" },
    },
    {
      type: "p",
      text: {
        es: "Hasta aquí solo has leído datos. En este módulo Northwind te pide escribirlos: su operación diaria, que hoy se hace a mano o con cargas de Data Loader, pasa a código. Cada taller es una pieza de esa operación, y todas comparten los mismos problemas reales: qué pasa si un registro falla, qué pasa si llegan 200 a la vez y cuánto gasta cada bloque del presupuesto de la transacción.",
        en: "So far you have only read data. In this module Northwind asks you to write it: its daily operation, done today by hand or with Data Loader loads, moves into code. Each workshop is one piece of that operation, and they all share the same real problems: what happens if a record fails, what happens if 200 arrive at once and how much of the transaction's budget each block spends.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Las seis piezas de la operación diaria", en: "The six pieces of the daily operation" },
      text: {
        es: "1 · El alta de un cliente que acaba de firmar (Onboarding). 2 · La carga nocturna de leads del formulario web (Marketing). 3 · El cierre de trimestre, que marca como Hot las cuentas con negocio ganado. 4 · Una herramienta para medir cuánto gasta cada bloque. 5 · El alta de la pieza 1, ahora completa o inexistente. 6 · El escalado diario de casos de cuentas Hot (Soporte), que en los Módulos 6 y 7 se convertirá en un trigger.",
        en: "1 · Onboarding a customer who has just signed (Onboarding). 2 · The nightly load of web-form leads (Marketing). 3 · The quarter close, which marks accounts with won business as Hot. 4 · A tool to measure how much each block spends. 5 · Piece 1's onboarding, now complete or non-existent. 6 · The daily escalation of cases from Hot accounts (Support), which in Modules 6 and 7 will become a trigger.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "En la capa de datos del libro, grabar es escribir el texto \"INSERT INTO productos values (\" + cod + \",'\" + wnom1 + \"',...)\", con los valores en la posición exacta de cada columna. Y su método Modificar de productos lanza \"UPDATE productos set nompro = ...\" sin WHERE: cambia todos los productos de la tabla con los datos de uno solo. En Apex no escribes texto: insert recibe objetos con sus campos por nombre, y update cambia exactamente los registros cuyos Ids le pasas, ni uno más. El error de la tabla entera no se puede cometer con una sola línea.",
        en: "In the book's data layer, saving means writing the text \"INSERT INTO productos values (\" + cod + \",'\" + wnom1 + \"',...)\", with the values in each column's exact position. And its products Modificar method fires \"UPDATE productos set nompro = ...\" with no WHERE: it changes every product in the table with the data of just one. In Apex you do not write text: insert takes objects with their fields by name, and update changes exactly the records whose Ids you pass, not one more. The whole-table mistake cannot be made in a single line.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué tiene la variable acc después del insert que no tenía antes? ¿Qué necesita update que insert no necesita? ¿Qué dos cosas decide upsert por ti?",
        en: "Without looking: what does the acc variable have after the insert that it did not have before? What does update need that insert does not? Which two things does upsert decide for you?",
      },
    },
  ],

  quiz: [
    {
      id: "m04-l01-q1",
      kind: "single",
      prompt: {
        es: "¿Qué muestra la última línea?",
        en: "What does the last line print?",
      },
      code: {
        es: `Contact c = new Contact(LastName = 'Ortega');
insert c;
System.debug(c.Id == null);`,
        en: `Contact c = new Contact(LastName = 'Ortega');
insert c;
System.debug(c.Id == null);`,
      },
      options: [
        { es: "false", en: "false" },
        { es: "true", en: "true" },
        { es: "null", en: "null" },
      ],
      answer: 0,
      explain: {
        es: "El insert rellena el Id en la misma variable. Antes era null; después, un Id de 18 caracteres.",
        en: "The insert fills the Id into the same variable. Before it was null; afterwards, an 18-character Id.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m04-l01-q2",
      kind: "single",
      prompt: {
        es: "Con Data Loader, ¿qué columna es obligatoria para un Update? Y en Apex, ¿qué necesita un update?",
        en: "With Data Loader, which column is mandatory for an Update? And in Apex, what does an update need?",
      },
      options: [
        { es: "El Id, en los dos casos.", en: "The Id, in both cases." },
        { es: "El Name, en los dos casos.", en: "The Name, in both cases." },
        { es: "Nada: Apex lo encuentra solo.", en: "Nothing: Apex finds it on its own." },
      ],
      answer: 0,
      explain: {
        es: "Sin Id no hay forma de saber qué registro cambiar. Un update de un registro sin Id falla.",
        en: "Without the Id there is no way to know which record to change. An update of a record with no Id fails.",
      },
      tags: ["recall"],
    },
    {
      id: "m04-l01-q3",
      kind: "single",
      prompt: {
        es: "Cada noche llegan clientes del ERP, algunos nuevos y otros ya existentes, con su código de cliente del ERP. ¿Cuál es la MEJOR opción?",
        en: "Every night customers arrive from the ERP, some new and some existing, with their ERP customer code. Which is the BEST option?",
      },
      options: [
        {
          es: "Un campo External ID con el código del ERP y upsert sobre ese campo.",
          en: "An External ID field holding the ERP code and upsert on that field.",
        },
        {
          es: "Consultar uno a uno si existe y decidir entre insert y update en cada vuelta.",
          en: "Query one by one whether each exists and choose insert or update on each iteration.",
        },
        {
          es: "Borrar todas las cuentas y volver a insertarlas.",
          en: "Delete every account and insert them again.",
        },
      ],
      answer: 0,
      explain: {
        es: "Upsert con Id externo decide por ti crear o actualizar, en una sola instrucción. La segunda gasta una consulta por cliente; la tercera destruye historial, actividades y relaciones.",
        en: "Upsert with an external Id decides create or update for you, in a single statement. The second spends one query per customer; the third destroys history, activities and relationships.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m04-l01-q4",
      kind: "single",
      prompt: {
        es: "Tu org tiene una regla de validación que exige el teléfono en las cuentas de tipo Customer. ¿Qué pasa con este código?",
        en: "Your org has a validation rule requiring a phone on Customer accounts. What happens with this code?",
      },
      code: {
        es: `insert new Account(Name = 'Aurora Foods', Type = 'Customer');`,
        en: `insert new Account(Name = 'Aurora Foods', Type = 'Customer');`,
      },
      options: [
        {
          es: "Falla con el mensaje de la regla de validación.",
          en: "It fails with the validation rule's message.",
        },
        {
          es: "Se guarda: Apex se salta las reglas de validación.",
          en: "It saves: Apex skips validation rules.",
        },
        {
          es: "Se guarda sin teléfono y la regla se ignora hasta el siguiente cambio.",
          en: "It saves without a phone and the rule is ignored until the next change.",
        },
      ],
      answer: 0,
      explain: {
        es: "Apex no es una puerta trasera: valida igual que la pantalla o Data Loader. En el Módulo 8 aprenderás a capturar ese error.",
        en: "Apex is not a back door: it validates the same as the screen or Data Loader. In Module 8 you will learn to catch that error.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m04-l01-q5",
      kind: "multi",
      prompt: {
        es: "¿Qué es cierto sobre este código?",
        en: "What is true about this code?",
      },
      code: {
        es: `update new Opportunity(Id = oppId, StageName = 'Closed Won');`,
        en: `update new Opportunity(Id = oppId, StageName = 'Closed Won');`,
      },
      options: [
        { es: "Cambia solo StageName; el resto de campos no se tocan.", en: "It only changes StageName; other fields are left alone." },
        { es: "No necesita consultar antes la oportunidad.", en: "It does not need to query the opportunity first." },
        { es: "Pone a null todos los campos que no se indican.", en: "It sets every field not mentioned to null." },
        { es: "Dispara los flows y triggers de Opportunity.", en: "It fires Opportunity's flows and triggers." },
      ],
      answers: [0, 1, 3],
      explain: {
        es: "Como un CSV de Data Loader con dos columnas: solo se escriben los campos presentes. Y como todo guardado, dispara la automatización.",
        en: "Like a two-column Data Loader CSV: only the fields present are written. And like every save, it fires the automation.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m04-l01-q6",
      kind: "text",
      prompt: {
        es: "¿Qué palabra añades a una consulta para que también devuelva registros que están en la Papelera?",
        en: "Which words do you add to a query so it also returns records in the Recycle Bin?",
      },
      accept: ["^\\s*ALL\\s+ROWS\\s*$"],
      placeholder: { es: "dos palabras", en: "two words" },
      explain: {
        es: "ALL ROWS, al final de la consulta. Junto con IsDeleted = true te da solo lo borrado, listo para undelete.",
        en: "ALL ROWS, at the end of the query. Together with IsDeleted = true it gives you only the deleted ones, ready for undelete.",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 1 DE 6 · La primera pieza de la operación diaria: el alta de un cliente que acaba de firmar, que hasta hoy se hacía a mano. Alta de un cliente nuevo que acaba de firmar: el equipo de Onboarding quiere crear la cuenta, sus dos contactos principales ya vinculados y marcar la cuenta como Hot, todo desde un script.",
      en: "TASK 1 OF 6 · The first piece of the daily operation: onboarding a customer who has just signed, done by hand until today. Onboarding a customer who has just signed: the Onboarding team wants to create the account, its two main contacts already linked, and mark the account as Hot, all from one script.",
    },
    brief: [
      {
        es: "Inserta una cuenta acc llamada 'Nimbus Logistics' con Industry 'Transportation'.",
        en: "Insert an account acc called 'Nimbus Logistics' with Industry 'Transportation'.",
      },
      {
        es: "Crea una List<Contact> contacts con dos contactos (Ortega y Lindqvist) vinculados a la cuenta mediante AccountId, e insértala con una sola instrucción.",
        en: "Create a List<Contact> contacts with two contacts (Ortega and Lindqvist) linked to the account through AccountId, and insert it with a single statement.",
      },
      {
        es: "Cambia el Rating de la cuenta a 'Hot' y guárdalo.",
        en: "Change the account's Rating to 'Hot' and save it.",
      },
    ],
    starter: {
      es: `// CASO: la operación diaria de Northwind, en código
// Tarea 1 de 6: el alta de un cliente nuevo.

// 1. La cuenta


// 2. Sus dos contactos, vinculados


// 3. Marcar la cuenta como Hot
`,
      en: `// CASE: Northwind's daily operation, in code
// Task 1 of 6: onboarding a new customer.

// 1. The account


// 2. Its two contacts, linked


// 3. Mark the account as Hot
`,
    },
    hints: [
      {
        es: "El orden importa: sin insertar la cuenta primero, no tendrás su Id para vincular los contactos.",
        en: "The order matters: without inserting the account first, you will not have its Id to link the contacts.",
      },
      {
        es: "AccountId = acc.Id en cada contacto. Un solo insert contacts; para la cuenta, cambias el campo y haces update acc.",
        en: "AccountId = acc.Id on each contact. A single insert contacts; for the account, you change the field and do update acc.",
      },
      {
        es: "Pseudocódigo: Account acc = new Account(...); insert acc; List<Contact> contacts = new List<Contact>{ new Contact(LastName = 'Ortega', AccountId = acc.Id), ... }; insert contacts; acc.Rating = 'Hot'; update acc;",
        en: "Pseudocode: Account acc = new Account(...); insert acc; List<Contact> contacts = new List<Contact>{ new Contact(LastName = 'Ortega', AccountId = acc.Id), ... }; insert contacts; acc.Rating = 'Hot'; update acc;",
      },
    ],
    solution: {
      es: `// 1. La cuenta
Account acc = new Account(Name = 'Nimbus Logistics', Industry = 'Transportation');
insert acc;

// 2. Sus dos contactos, vinculados
List<Contact> contacts = new List<Contact>{
    new Contact(LastName = 'Ortega', AccountId = acc.Id),
    new Contact(LastName = 'Lindqvist', AccountId = acc.Id)
};
insert contacts;

// 3. Marcar la cuenta como Hot
acc.Rating = 'Hot';
update acc;`,
      en: `// 1. The account
Account acc = new Account(Name = 'Nimbus Logistics', Industry = 'Transportation');
insert acc;

// 2. Its two contacts, linked
List<Contact> contacts = new List<Contact>{
    new Contact(LastName = 'Ortega', AccountId = acc.Id),
    new Contact(LastName = 'Lindqvist', AccountId = acc.Id)
};
insert contacts;

// 3. Mark the account as Hot
acc.Rating = 'Hot';
update acc;`,
    },
    checks: [
      {
        id: "m04-l01-c1",
        label: {
          es: "Se crea e inserta la cuenta Nimbus Logistics",
          en: "The Nimbus Logistics account is created and inserted",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Account\\s+acc\\s*=\\s*new\\s+Account\\([^;]*Name\\s*=\\s*'Nimbus Logistics'" },
            { op: "match", pattern: "Industry\\s*=\\s*'Transportation'" },
            { op: "match", pattern: "\\binsert\\s+acc\\s*;" },
          ],
        },
        onFail: {
          es: "Account acc = new Account(Name = 'Nimbus Logistics', Industry = 'Transportation'); insert acc;",
          en: "Account acc = new Account(Name = 'Nimbus Logistics', Industry = 'Transportation'); insert acc;",
        },
      },
      {
        id: "m04-l01-c2",
        label: {
          es: "Los dos contactos se vinculan con AccountId = acc.Id",
          en: "Both contacts are linked with AccountId = acc.Id",
        },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "AccountId\\s*=\\s*acc\\.Id", min: 2 },
            { op: "match", pattern: "LastName\\s*=\\s*'Ortega'" },
            { op: "match", pattern: "LastName\\s*=\\s*'Lindqvist'" },
          ],
        },
        onFail: {
          es: "Cada contacto necesita AccountId = acc.Id: es el campo de búsqueda que lo cuelga de la cuenta.",
          en: "Each contact needs AccountId = acc.Id: it is the lookup field that hangs it from the account.",
        },
      },
      {
        id: "m04-l01-c3",
        label: {
          es: "Los contactos se insertan con una sola instrucción sobre la lista",
          en: "The contacts are inserted with a single statement on the list",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "List\\s*<\\s*Contact\\s*>\\s+contacts\\b" },
            { op: "match", pattern: "\\binsert\\s+contacts\\s*;" },
            { op: "count", pattern: "\\binsert\\b", max: 2 },
          ],
        },
        onFail: {
          es: "Mete los dos contactos en la lista contacts y haz un único insert contacts;",
          en: "Put both contacts in the contacts list and do a single insert contacts;",
        },
      },
      {
        id: "m04-l01-c4",
        label: {
          es: "La cuenta se actualiza a Hot después de insertarla",
          en: "The account is updated to Hot after inserting it",
        },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "insert\\s+acc\\s*;[\\s\\S]*acc\\.Rating\\s*=\\s*'Hot'\\s*;[\\s\\S]*\\bupdate\\s+acc\\s*;" },
            { op: "match", pattern: "insert\\s+acc\\s*;[\\s\\S]*update\\s+new\\s+Account\\(\\s*Id\\s*=\\s*acc\\.Id\\s*,\\s*Rating\\s*=\\s*'Hot'\\s*\\)\\s*;" },
          ],
        },
        onFail: {
          es: "acc.Rating = 'Hot'; update acc; (o update new Account(Id = acc.Id, Rating = 'Hot');)",
          en: "acc.Rating = 'Hot'; update acc; (or update new Account(Id = acc.Id, Rating = 'Hot');)",
        },
        onPass: {
          es: "Tres instrucciones DML en total, da igual si fueran dos contactos o doscientos.",
          en: "Three DML statements in total, whether it were two contacts or two hundred.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Podrías haber puesto Rating = 'Hot' ya en el new Account y ahorrarte el update? ¿Cuándo tendría sentido hacerlo en dos pasos?",
        en: "Could you have set Rating = 'Hot' in the new Account and saved the update? When would two steps make sense?",
      },
    ],
  },
};
