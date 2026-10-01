import type { Challenge, Course, Lesson, Module } from "@/lib/types";
import { m01 } from "./modules/m01";
import { m02 } from "./modules/m02";
import { m03 } from "./modules/m03";
import { m04 } from "./modules/m04";
import { m05 } from "./modules/m05";
import { m06 } from "./modules/m06";
import { m07 } from "./modules/m07";
import { m08 } from "./modules/m08";
import { m09 } from "./modules/m09";
import { m10 } from "./modules/m10";
import { m11 } from "./modules/m11";
import { m12 } from "./modules/m12";
import { challenge1, challenge2 } from "./challenges";

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
