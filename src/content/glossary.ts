import type { GlossaryEntry } from "@/lib/types";

/**
 * Course glossary.
 *
 * Every entry becomes a tooltip wherever the course text marks it with
 * [[id]] or [[id|visible text]]. Definitions are one or two sentences: a
 * tooltip is a reminder, not a lesson. Terms that a later module teaches
 * properly say where.
 */
export const glossary: GlossaryEntry[] = [
  {
    id: "compilar",
    term: { es: "compilar", en: "compile" },
    definition: {
      es: "Revisar el código antes de ejecutarlo. Salesforce lo hace al guardar una clase: si un tipo no encaja o un campo no existe, no te deja guardar.",
      en: "Checking the code before it runs. Salesforce does it when you save a class: if a type does not fit or a field does not exist, it will not let you save.",
    },
    admin: {
      es: "Como una regla de validación, pero sobre el código y antes de que exista ningún registro.",
      en: "Like a validation rule, but on the code, and before any record exists.",
    },
  },
  {
    id: "tipado-estatico",
    term: { es: "tipado estático", en: "static typing" },
    definition: {
      es: "El tipo de cada variable se decide al escribir el código y ya no cambia. Por eso muchos errores aparecen al guardar, no delante del usuario.",
      en: "Each variable's type is decided when the code is written and never changes. That is why many errors show up on save, not in front of the user.",
    },
    admin: {
      es: "Como el tipo de un campo: una vez creado como Number, no acepta texto.",
      en: "Like a field's type: once created as Number, it will not take text.",
    },
  },
  {
    id: "transaccion",
    term: { es: "transacción", en: "transaction" },
    definition: {
      es: "Todo lo que ocurre desde que se pulsa Guardar hasta que Salesforce termina de procesarlo. Si algo falla por el camino, se deshace entero.",
      en: "Everything that happens from the moment Save is pressed until Salesforce finishes processing it. If anything fails along the way, the whole thing is undone.",
    },
    admin: {
      es: "Es por lo que un Flow que falla no deja el registro a medio guardar.",
      en: "It is why a failing Flow never leaves the record half-saved.",
    },
  },
  {
    id: "literal",
    term: { es: "literal", en: "literal" },
    definition: {
      es: "Un valor escrito tal cual en el código: 'EMEA', 42, true. Lo contrario de un valor que se calcula o se lee de un registro.",
      en: "A value written as-is in the code: 'EMEA', 42, true. The opposite of a value that is computed or read from a record.",
    },
  },
  {
    id: "binario",
    term: { es: "binario", en: "binary" },
    definition: {
      es: "La forma en que el ordenador guarda los datos: solo ceros y unos. Algunos decimales, como 0,1, no tienen representación exacta en binario; de ahí que Double aproxime.",
      en: "How a computer stores data: only zeros and ones. Some decimals, like 0.1, have no exact binary form — which is why Double approximates.",
    },
  },
  {
    id: "null",
    term: { es: "null", en: "null" },
    definition: {
      es: "La ausencia de valor: algo que nunca se rellenó. No es cero ni texto vacío. Tiene su propia sub-lección, la 6.",
      en: "The absence of a value: something that was never filled in. It is neither zero nor empty text. It has its own sub-lesson, number 6.",
    },
    admin: {
      es: "Un campo en blanco en el registro.",
      en: "A blank field on the record.",
    },
  },
  {
    id: "inmutable",
    term: { es: "inmutable", en: "immutable" },
    definition: {
      es: "Que no se puede modificar después de crearse. Los métodos de un String o de un Date no lo cambian: te devuelven uno nuevo.",
      en: "Cannot be modified once created. A String's or a Date's methods do not change it: they hand you a new one.",
    },
  },
  {
    id: "gmt",
    term: { es: "GMT", en: "GMT" },
    definition: {
      es: "La hora de referencia universal. Salesforce guarda todos los Datetime en GMT y los convierte a la zona horaria de cada usuario al mostrarlos.",
      en: "The universal reference time. Salesforce stores every Datetime in GMT and converts it to each user's time zone when displaying it.",
    },
    admin: {
      es: "La zona que usa la base de datos; la que ves tú es la de tu perfil de usuario.",
      en: "The zone the database uses; the one you see is the one on your user profile.",
    },
  },
  {
    id: "excepcion",
    term: { es: "excepción", en: "exception" },
    definition: {
      es: "Un error en ejecución que detiene la transacción. Su tipo —NullPointerException, TypeException…— dice qué salió mal.",
      en: "A runtime error that halts the transaction. Its type — NullPointerException, TypeException… — says what went wrong.",
    },
    admin: {
      es: "El correo de «Apex script unhandled exception» que alguna vez te llegó.",
      en: "The “Apex script unhandled exception” email you have probably received.",
    },
    taughtIn: { es: "Módulo 8", en: "Module 8" },
  },
  {
    id: "dml",
    term: { es: "DML", en: "DML" },
    definition: {
      es: "Las operaciones que escriben en la base de datos: insert, update, delete y upsert. Es el «Guardar» del código.",
      en: "The operations that write to the database: insert, update, delete and upsert. It is the code's “Save”.",
    },
    admin: {
      es: "Lo que hace Data Loader, pero desde Apex.",
      en: "What Data Loader does, but from Apex.",
    },
    taughtIn: { es: "Módulo 4", en: "Module 4" },
  },
  {
    id: "soql",
    term: { es: "SOQL", en: "SOQL" },
    definition: {
      es: "El lenguaje para consultar registros desde Apex: eliges objeto, campos y filtros, y te devuelve una lista.",
      en: "The language for querying records from Apex: you choose object, fields and filters, and it returns a list.",
    },
    admin: {
      es: "Un informe, escrito en una línea de código.",
      en: "A report, written as one line of code.",
    },
    taughtIn: { es: "Módulo 3", en: "Module 3" },
  },
  {
    id: "governor-limits",
    term: { es: "governor limits", en: "governor limits" },
    definition: {
      es: "Los topes que Salesforce pone a cada transacción —por ejemplo, 100 consultas SOQL— para que ningún código acapare la plataforma compartida.",
      en: "The caps Salesforce puts on every transaction — for example, 100 SOQL queries — so no code can hog the shared platform.",
    },
    admin: {
      es: "Como los límites de tu edición (campos por objeto, reglas activas…), pero por ejecución.",
      en: "Like your edition's limits (fields per object, active rules…), but per run.",
    },
    taughtIn: { es: "Módulo 4", en: "Module 4" },
  },
  {
    id: "lote",
    term: { es: "lote de 200", en: "batch of 200" },
    definition: {
      es: "Salesforce procesa los registros en bloques: hasta 200 a la vez en un trigger. El código tiene que funcionar igual con 1 registro que con 200.",
      en: "Salesforce processes records in blocks: up to 200 at a time in a trigger. Code has to behave the same with 1 record as with 200.",
    },
    admin: {
      es: "Lo que pasa cuando cargas un CSV con Data Loader.",
      en: "What happens when you load a CSV with Data Loader.",
    },
  },
  {
    id: "trigger",
    term: { es: "trigger", en: "trigger" },
    definition: {
      es: "Código Apex que se ejecuta solo cuando se crea, modifica o borra un registro.",
      en: "Apex code that runs by itself when a record is created, changed or deleted.",
    },
    admin: {
      es: "Un Flow disparado por registro, escrito en código.",
      en: "A record-triggered Flow, written as code.",
    },
    taughtIn: { es: "Módulo 6", en: "Module 6" },
  },
  {
    id: "bloque",
    term: { es: "bloque", en: "block" },
    definition: {
      es: "Las líneas encerradas entre { y }. Se ejecutan juntas, como un grupo, cuando el código llega a ellas.",
      en: "The lines enclosed between { and }. They run together, as a group, when the code reaches them.",
    },
    admin: {
      es: "Las acciones que cuelgan de una salida de un nodo Decision en Flow.",
      en: "The actions hanging off one outcome of a Decision element in Flow.",
    },
  },
  {
    id: "ambito",
    term: { es: "ámbito", en: "scope" },
    definition: {
      es: "La zona del código donde una variable existe. Una variable declarada dentro de un bloque desaparece al cerrarse su }.",
      en: "The part of the code where a variable exists. A variable declared inside a block disappears when its } closes.",
    },
    admin: {
      es: "Como un componente de una pantalla de Flow: solo existe mientras estás en esa pantalla.",
      en: "Like a component on a Flow screen: it only exists while you are on that screen.",
    },
  },
  {
    id: "iteracion",
    term: { es: "iteración", en: "iteration" },
    definition: {
      es: "Cada vuelta de un bucle. Un bucle sobre 200 registros hace 200 iteraciones.",
      en: "Each pass of a loop. A loop over 200 records makes 200 iterations.",
    },
    admin: {
      es: "Cada vez que el elemento Loop de Flow pasa al siguiente registro.",
      en: "Each time Flow's Loop element moves on to the next record.",
    },
  },
  {
    id: "bucle-infinito",
    term: { es: "bucle infinito", en: "infinite loop" },
    definition: {
      es: "Un bucle cuya condición nunca llega a ser falsa. En Salesforce no cuelga la org: la transacción se corta al agotar el tiempo de CPU.",
      en: "A loop whose condition never becomes false. In Salesforce it does not hang the org: the transaction is cut off when it runs out of CPU time.",
    },
    admin: {
      es: "Dos Flows que se actualizan el uno al otro sin fin hasta que Salesforce los detiene.",
      en: "Two Flows updating each other endlessly until Salesforce stops them.",
    },
  },
  {
    id: "cpu-time",
    term: { es: "tiempo de CPU", en: "CPU time" },
    definition: {
      es: "El tiempo de cálculo que una transacción puede gastar: 10 segundos en síncrono. Los bucles grandes o anidados son lo primero que lo agota.",
      en: "The compute time one transaction may spend: 10 seconds synchronously. Big or nested loops are the first thing to burn through it.",
    },
    admin: {
      es: "El error «Apex CPU time limit exceeded» que a veces aparece con Flows muy pesados.",
      en: "The “Apex CPU time limit exceeded” error that sometimes shows up with very heavy Flows.",
    },
    taughtIn: { es: "Módulo 4", en: "Module 4" },
  },
  {
    id: "clase",
    term: { es: "clase", en: "class" },
    definition: {
      es: "La definición de un tipo de objeto: qué datos guarda (atributos) y qué sabe hacer (métodos). No es un objeto: es el molde con el que se fabrican.",
      en: "The definition of a kind of object: what data it holds (attributes) and what it can do (methods). It is not an object: it is the mould they are made from.",
    },
    admin: {
      es: "La definición de un objeto en Object Manager: campos y comportamiento, sin ningún registro todavía.",
      en: "An object's definition in Object Manager: fields and behaviour, with no records yet.",
    },
  },
  {
    id: "instancia",
    term: { es: "instancia", en: "instance" },
    definition: {
      es: "Un objeto concreto fabricado a partir de una clase con new. Cada instancia tiene sus propios valores.",
      en: "A concrete object made from a class with new. Each instance has its own values.",
    },
    admin: {
      es: "Un registro: la cuenta «Acme» es una instancia del objeto Account.",
      en: "A record: the “Acme” account is an instance of the Account object.",
    },
  },
  {
    id: "referencia",
    term: { es: "referencia", en: "reference" },
    definition: {
      es: "Lo que guarda una variable de tipo objeto: no el objeto en sí, sino la dirección donde vive. Dos variables pueden apuntar al mismo objeto.",
      en: "What an object-typed variable holds: not the object itself, but the address where it lives. Two variables can point to the same object.",
    },
    admin: {
      es: "Como el enlace a un registro: dos personas con el mismo enlace están viendo y editando el mismo registro.",
      en: "Like a link to a record: two people with the same link are viewing and editing the same record.",
    },
  },
  {
    id: "interfaz",
    term: { es: "interfaz", en: "interface" },
    definition: {
      es: "Una lista de métodos que una clase se compromete a tener, sin decir cómo. Cualquier clase que la implemente se puede usar donde se pida la interfaz.",
      en: "A list of methods a class commits to having, without saying how. Any class that implements it can be used wherever the interface is asked for.",
    },
    admin: {
      es: "El requisito para programar una clase en Setup: solo aparecen las que implementan Schedulable.",
      en: "The requirement for scheduling a class in Setup: only the ones implementing Schedulable show up.",
    },
  },
  {
    id: "heap",
    term: { es: "heap", en: "heap" },
    definition: {
      es: "La memoria que una transacción puede usar para sus objetos: 6 MB en síncrono. Si la superas, la transacción falla.",
      en: "The memory a transaction may use for its objects: 6 MB synchronously. Go over it and the transaction fails.",
    },
    admin: {
      es: "Otro de los límites por ejecución, como el tiempo de CPU.",
      en: "Another per-run limit, like CPU time.",
    },
    taughtIn: { es: "Módulo 4", en: "Module 4" },
  },
  {
    id: "subconsulta",
    term: { es: "subconsulta", en: "subquery" },
    definition: {
      es: "Una consulta dentro de otra. En el SELECT trae los registros hijos de cada padre; en el WHERE (con IN) decide qué padres entran.",
      en: "A query inside another one. In the SELECT it brings each parent's child records; in the WHERE (with IN) it decides which parents get in.",
    },
    admin: {
      es: "La related list de la página de un registro.",
      en: "The related list on a record page.",
    },
    taughtIn: { es: "Módulo 3", en: "Module 3" },
  },
  {
    id: "variable-enlace",
    term: { es: "variable de enlace", en: "bind variable" },
    definition: {
      es: "Una variable de Apex usada dentro de una consulta con dos puntos (:accId). Su valor viaja aparte del texto de la consulta, así que no puede alterarla.",
      en: "An Apex variable used inside a query with a colon (:accId). Its value travels separately from the query text, so it cannot alter it.",
    },
    admin: {
      es: "El {!recordId} que pones en el filtro de un Get Records de Flow.",
      en: "The {!recordId} you put in a Flow Get Records filter.",
    },
    taughtIn: { es: "Módulo 3", en: "Module 3" },
  },
  {
    id: "inyeccion-soql",
    term: { es: "inyección de SOQL", en: "SOQL injection" },
    definition: {
      es: "Un ataque en el que el texto que escribe un usuario se pega dentro de una consulta dinámica y cambia lo que la consulta hace, por ejemplo saltándose un filtro.",
      en: "An attack in which text typed by a user is glued into a dynamic query and changes what the query does, for example skipping a filter.",
    },
    taughtIn: { es: "Módulo 3 · Módulo 12", en: "Module 3 · Module 12" },
  },
];

const byId = new Map(glossary.map((g) => [g.id, g]));

export function getTerm(id: string): GlossaryEntry | undefined {
  return byId.get(id);
}
