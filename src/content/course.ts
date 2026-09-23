import type { Challenge, Course, Lesson, Module, ModuleCategory } from "@/lib/types";
import { m01 } from "./modules/m01";
import { m02 } from "./modules/m02";
import { m03 } from "./modules/m03";
import { m04 } from "./modules/m04";
import { m05 } from "./modules/m05";
import { m06 } from "./modules/m06";
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

/** The lessons that count towards finishing a module: optional practice does not. */
export function requiredLessons(m: Module): Lesson[] {
  return m.lessons.filter((l) => !l.optional);
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
