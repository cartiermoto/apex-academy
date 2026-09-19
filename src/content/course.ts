import type { Challenge, Course, Lesson, Module, ModuleCategory } from "@/lib/types";
import { m01 } from "./modules/m01";
import { challenge1, challenge2 } from "./challenges";

/* -------------------------------------------------------------------------- */
/* Modules 2–12 — outlines. Each becomes a full module with the same shape as  */
/* m01 (Teoría → Quiz → Ejercicio per sub-lesson + a Checkpoint).              */
/* -------------------------------------------------------------------------- */

function planned(
  n: number,
  id: string,
  category: ModuleCategory,
  title: { es: string; en: string },
  subtitle: { es: string; en: string },
  outline: Array<[string, string]>,
): Module {
  return {
    id,
    n,
    category,
    title,
    subtitle,
    status: "planned",
    lessons: [],
    outline: outline.map(([es, en]) => ({ es, en })),
  };
}

const m02 = planned(
  2,
  "m02",
  "logic",
  { es: "Control de Flujo", en: "Control Flow" },
  {
    es: "Decidir y repetir: lo que en Flow eran nodos de decisión y bucles, aquí son diez líneas de código.",
    en: "Deciding and repeating: what Flow drew as decision nodes and loops is ten lines of code here.",
  },
  [
    ["If / Else / Else If", "If / Else / Else If"],
    ["Switch Statement", "Switch statement"],
    ["Expresiones vs Sentencias", "Expressions vs statements"],
    ["While Loop", "While loop"],
    ["For Loop y sus variantes", "For loop and its variants"],
    ["Break y Continue", "Break and continue"],
    ["Loops Anidados", "Nested loops"],
    ["Checkpoint del Módulo 2", "Module 2 checkpoint"],
  ],
);

const m03 = planned(
  3,
  "m03",
  "logic",
  { es: "SOQL y SOSL", en: "SOQL and SOSL" },
  {
    es: "Preguntarle a la base de datos: el equivalente en código a un Report Type con filtros.",
    en: "Asking the database: the code equivalent of a Report Type with filters.",
  },
  [
    ["Anatomía de una consulta SOQL", "Anatomy of a SOQL query"],
    ["WHERE, ORDER BY, LIMIT", "WHERE, ORDER BY, LIMIT"],
    ["Consultas de relación (padre e hijo)", "Relationship queries (parent and child)"],
    ["Variables de enlace y SOQL dinámico", "Bind variables and dynamic SOQL"],
    ["Funciones de agregación", "Aggregate functions"],
    ["SOSL: búsqueda en varios objetos", "SOSL: searching across objects"],
    ["Checkpoint del Módulo 3", "Module 3 checkpoint"],
  ],
);

const m04 = planned(
  4,
  "m04",
  "logic",
  { es: "DML y Governor Limits", en: "DML and Governor Limits" },
  {
    es: "Escribir en la base de datos sin que la org te pare los pies.",
    en: "Writing to the database without the org shutting you down.",
  },
  [
    ["insert, update, delete, upsert", "insert, update, delete, upsert"],
    ["Database.insert y resultados parciales", "Database.insert and partial results"],
    ["Bulkificación", "Bulkification"],
    ["Governor Limits: qué se cuenta y por qué", "Governor limits: what is counted and why"],
    ["Savepoints y rollback", "Savepoints and rollback"],
    ["Checkpoint del Módulo 4", "Module 4 checkpoint"],
  ],
);

const m05 = planned(
  5,
  "m05",
  "obj",
  { es: "Clases, Interfaces y POO", en: "Classes, Interfaces and OOP" },
  {
    es: "Del objeto de Salesforce al objeto de Apex: definir tus propios moldes.",
    en: "From the Salesforce object to the Apex object: defining your own moulds.",
  },
  [
    ["Clases y objetos", "Classes and objects"],
    ["Referencias: dos variables, un solo objeto", "References: two variables, one object"],
    ["Constructores", "Constructors"],
    ["this: el objeto hablando de sí mismo", "this: the object talking about itself"],
    ["Static vs Non-Static", "Static vs non-static"],
    ["Access Modifiers", "Access modifiers"],
    ["Herencia", "Inheritance"],
    ["virtual, abstract y override", "virtual, abstract and override"],
    ["Sobrecarga vs sobrescritura", "Overloading vs overriding"],
    ["Interfaces y polimorfismo", "Interfaces and polymorphism"],
    ["Clases internas y Enums", "Inner classes and enums"],
    ["Checkpoint del Módulo 5", "Module 5 checkpoint"],
  ],
);

const m06 = planned(
  6,
  "m06",
  "obj",
  { es: "Triggers", en: "Triggers" },
  {
    es: "La automatización que corre cuando nadie mira: el Record-Triggered Flow, en código.",
    en: "The automation that runs when nobody is looking: the record-triggered Flow, in code.",
  },
  [
    ["Qué es un trigger y cuándo se dispara", "What a trigger is and when it fires"],
    ["Contexto: Trigger.new, Trigger.old, Trigger.newMap", "Context: Trigger.new, Trigger.old, Trigger.newMap"],
    ["before vs after", "before vs after"],
    ["Orden de ejecución en Salesforce", "Salesforce order of execution"],
    ["Recursión y cómo evitarla", "Recursion and how to avoid it"],
    ["Checkpoint del Módulo 6", "Module 6 checkpoint"],
  ],
);

const m07 = planned(
  7,
  "m07",
  "obj",
  { es: "Trigger Handlers", en: "Trigger Handlers" },
  {
    es: "Un trigger por objeto, toda la lógica fuera: el patrón que hace mantenible una org.",
    en: "One trigger per object, all logic outside: the pattern that keeps an org maintainable.",
  },
  [
    ["Por qué un trigger no debe tener lógica", "Why a trigger should hold no logic"],
    ["El patrón Handler", "The handler pattern"],
    ["Separar lógica de negocio en clases de servicio", "Service classes for business logic"],
    ["Control de recursión con variables estáticas", "Recursion control with static variables"],
    ["Checkpoint del Módulo 7", "Module 7 checkpoint"],
  ],
);

const m08 = planned(
  8,
  "m08",
  "robust",
  { es: "Manejo de Excepciones", en: "Exception Handling" },
  {
    es: "Qué hacer cuando algo falla — y por qué tu excepción personalizada extiende Exception.",
    en: "What to do when something breaks — and why your custom exception extends Exception.",
  },
  [
    ["try / catch / finally", "try / catch / finally"],
    ["Tipos de excepción en Apex", "Exception types in Apex"],
    ["throw y propagación", "throw and propagation"],
    ["Excepciones personalizadas (extends Exception)", "Custom exceptions (extends Exception)"],
    ["addError en triggers", "addError in triggers"],
    ["Checkpoint del Módulo 8", "Module 8 checkpoint"],
  ],
);

const m09 = planned(
  9,
  "m09",
  "robust",
  { es: "Apex Asíncrono", en: "Asynchronous Apex" },
  {
    es: "Trabajo que no cabe en una transacción: cuatro herramientas y cuándo usar cada una.",
    en: "Work that does not fit in one transaction: four tools and when to use each.",
  },
  [
    ["Por qué existe el asíncrono", "Why async exists"],
    ["@future", "@future"],
    ["Queueable Apex", "Queueable Apex"],
    ["Batch Apex", "Batch Apex"],
    ["Scheduled Apex", "Scheduled Apex"],
    ["Elegir la herramienta correcta", "Choosing the right tool"],
    ["Checkpoint del Módulo 9", "Module 9 checkpoint"],
  ],
);

const m10 = planned(
  10,
  "m10",
  "robust",
  { es: "Testing en Apex", en: "Testing in Apex" },
  {
    es: "El 75 % no es la meta: es el mínimo para desplegar. La meta es dormir tranquilo.",
    en: "75% is not the goal: it is the minimum to deploy. The goal is sleeping well.",
  },
  [
    ["@isTest y la clase de test", "@isTest and the test class"],
    ["Datos de prueba y @testSetup", "Test data and @testSetup"],
    ["Assert: verificar de verdad", "Assert: actually verifying"],
    ["Test.startTest / Test.stopTest", "Test.startTest / Test.stopTest"],
    ["Probar excepciones y casos límite", "Testing exceptions and edge cases"],
    ["Mocks para callouts", "Mocks for callouts"],
    ["Checkpoint del Módulo 10", "Module 10 checkpoint"],
  ],
);

const m11 = planned(
  11,
  "m11",
  "scope",
  { es: "Integraciones", en: "Integrations" },
  {
    es: "Salesforce hablando con el resto del mundo.",
    en: "Salesforce talking to the rest of the world.",
  },
  [
    ["HTTP callouts: Http, HttpRequest, HttpResponse", "HTTP callouts: Http, HttpRequest, HttpResponse"],
    ["JSON: serializar y deserializar", "JSON: serialize and deserialize"],
    ["Named Credentials y Remote Site Settings", "Named credentials and remote site settings"],
    ["Exponer Apex como REST", "Exposing Apex as REST"],
    ["SOAP y WSDL2Apex", "SOAP and WSDL2Apex"],
    ["Callouts en asíncrono", "Callouts from async context"],
    ["Checkpoint del Módulo 11", "Module 11 checkpoint"],
  ],
);

const m12 = planned(
  12,
  "m12",
  "scope",
  { es: "Seguridad", en: "Security" },
  {
    es: "Apex corre en modo sistema por defecto. Ese 'por defecto' es tu responsabilidad.",
    en: "Apex runs in system mode by default. That default is your responsibility.",
  },
  [
    ["with sharing / without sharing / inherited sharing", "with sharing / without sharing / inherited sharing"],
    ["CRUD y FLS: comprobar antes de tocar", "CRUD and FLS: check before you touch"],
    ["Security.stripInaccessible y WITH USER_MODE", "Security.stripInaccessible and WITH USER_MODE"],
    ["Inyección de SOQL y escaping", "SOQL injection and escaping"],
    ["Checkpoint del Módulo 12", "Module 12 checkpoint"],
  ],
);

export const course: Course = {
  modules: [m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12],
  challenges: [challenge1, challenge2],
};

/* -------------------------------------------------------------------------- */
/* Lookups                                                                    */
/* -------------------------------------------------------------------------- */

export function getModule(moduleId: string): Module | undefined {
  return course.modules.find((m) => m.id === moduleId);
}

export function getLesson(moduleId: string, slug: string): Lesson | undefined {
  return getModule(moduleId)?.lessons.find((l) => l.slug === slug);
}

export function getChallenge(id: string): Challenge | undefined {
  return course.challenges.find((c) => c.id === id);
}

/** Flat, ordered list of every authored lesson — powers prev/next. */
export function flatLessons(): Array<{ module: Module; lesson: Lesson }> {
  return course.modules.flatMap((m) => m.lessons.map((lesson) => ({ module: m, lesson })));
}

export function neighbours(moduleId: string, slug: string) {
  const flat = flatLessons();
  const i = flat.findIndex((x) => x.module.id === moduleId && x.lesson.slug === slug);
  return {
    prev: i > 0 ? flat[i - 1] : undefined,
    next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : undefined,
  };
}

export function moduleIsComplete(
  moduleId: string,
  lessons: Record<string, { status: string }>,
): boolean {
  const mod = getModule(moduleId);
  if (!mod || mod.lessons.length === 0) return false;
  return mod.lessons.every((l) => lessons[l.id]?.status === "completed");
}
