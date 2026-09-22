import type { Module } from "@/lib/types";
import { l01Dml } from "./l01-dml";
import { l02DatabaseMethods } from "./l02-database-methods";
import { l03Bulkificacion } from "./l03-bulkificacion";
import { l04GovernorLimits } from "./l04-governor-limits";
import { l05Savepoints } from "./l05-savepoints";
import { l06Checkpoint } from "./l06-checkpoint";

export const m04: Module = {
  id: "m04",
  n: 4,
  category: "logic",
  status: "ready",
  title: { es: "DML y Governor Limits", en: "DML and Governor Limits" },
  subtitle: {
    es: "Escribir en la base de datos sin que la org te pare los pies.",
    en: "Writing to the database without the org shutting you down.",
  },
  lessons: [
    l01Dml,
    l02DatabaseMethods,
    l03Bulkificacion,
    l04GovernorLimits,
    l05Savepoints,
    l06Checkpoint,
  ],
};
