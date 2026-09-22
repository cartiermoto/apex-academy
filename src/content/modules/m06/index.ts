import type { Module } from "@/lib/types";
import { l01QueEsTrigger } from "./l01-que-es-trigger";
import { l02Contexto } from "./l02-contexto";
import { l03BeforeAfter } from "./l03-before-after";
import { l04OrdenEjecucion } from "./l04-orden-ejecucion";
import { l05Recursion } from "./l05-recursion";
import { l06Checkpoint } from "./l06-checkpoint";

export const m06: Module = {
  id: "m06",
  n: 6,
  category: "obj",
  status: "ready",
  title: { es: "Triggers", en: "Triggers" },
  subtitle: {
    es: "La automatización que corre cuando nadie mira: el Record-Triggered Flow, en código.",
    en: "The automation that runs when nobody is looking: the record-triggered Flow, in code.",
  },
  lessons: [
    l01QueEsTrigger,
    l02Contexto,
    l03BeforeAfter,
    l04OrdenEjecucion,
    l05Recursion,
    l06Checkpoint,
  ],
};
