import type { Module } from "@/lib/types";
import { l01IfElse } from "./l01-if-else";
import { l02Switch } from "./l02-switch";
import { l03Expresiones } from "./l03-expresiones";
import { l04While } from "./l04-while";
import { l05For } from "./l05-for";
import { l06BreakContinue } from "./l06-break-continue";
import { l07Anidados } from "./l07-anidados";
import { l08Checkpoint } from "./l08-checkpoint";

export const m02: Module = {
  id: "m02",
  n: 2,
  category: "logic",
  status: "ready",
  title: { es: "Control de Flujo", en: "Control Flow" },
  subtitle: {
    es: "Decidir y repetir: lo que en Flow eran nodos de decisión y bucles, aquí son diez líneas de código. Los ocho talleres son las reglas de negocio de una misma cuenta.",
    en: "Deciding and repeating: what Flow drew as decision nodes and loops is ten lines of code here. The eight workshops are one account's business rules.",
  },
  lessons: [
    l01IfElse,
    l02Switch,
    l03Expresiones,
    l04While,
    l05For,
    l06BreakContinue,
    l07Anidados,
    l08Checkpoint,
  ],
};
