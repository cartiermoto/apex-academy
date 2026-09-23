import type { Module } from "@/lib/types";
import { l01Anatomia } from "./l01-anatomia";
import { l02WhereOrderLimit } from "./l02-where-order-limit";
import { l03Relaciones } from "./l03-relaciones";
import { l08Subconsultas } from "./l08-subconsultas";
import { l04BindDinamico } from "./l04-bind-dinamico";
import { l05Agregados } from "./l05-agregados";
import { l06Sosl } from "./l06-sosl";
import { l07Checkpoint } from "./l07-checkpoint";
import { l09Practica } from "./l09-practica";

export const m03: Module = {
  id: "m03",
  n: 3,
  category: "logic",
  status: "ready",
  title: { es: "SOQL y SOSL", en: "SOQL and SOSL" },
  subtitle: {
    es: "Preguntarle a la base de datos: el equivalente en código a un Report Type con filtros. Los ocho talleres son la revisión trimestral de cartera, troceada.",
    en: "Asking the database: the code equivalent of a Report Type with filters. The eight workshops are the quarterly portfolio review, cut into pieces.",
  },
  lessons: [
    l01Anatomia,
    l02WhereOrderLimit,
    l03Relaciones,
    l08Subconsultas,
    l04BindDinamico,
    l05Agregados,
    l06Sosl,
    l07Checkpoint,
    l09Practica,
  ],
};
