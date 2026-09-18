import type { Module } from "@/lib/types";
import { l01Variables } from "./l01-variables";
import { l02NumerosBoolean } from "./l02-numeros-boolean";
import { l03String } from "./l03-string";
import { l04Fechas } from "./l04-fechas";
import { l05SObjects } from "./l05-sobjects";
import { l06Null } from "./l06-null";
import { l07Operadores } from "./l07-operadores";
import { l08Colecciones } from "./l08-colecciones";
import { l09Casting } from "./l09-casting";
import { l10Checkpoint } from "./l10-checkpoint";

export const m01: Module = {
  id: "m01",
  n: 1,
  status: "ready",
  title: { es: "Fundamentos", en: "Fundamentals" },
  subtitle: {
    es: "Los ladrillos del lenguaje: tipos, datos, colecciones y el hueco donde no hay nada.",
    en: "The building blocks: types, data, collections, and the gap where nothing is.",
  },
  lessons: [
    l01Variables,
    l02NumerosBoolean,
    l03String,
    l04Fechas,
    l05SObjects,
    l06Null,
    l07Operadores,
    l08Colecciones,
    l09Casting,
    l10Checkpoint,
  ],
};
