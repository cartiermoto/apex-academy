import type { Module } from "@/lib/types";
import { l01TryCatchFinally } from "./l01-try-catch-finally";
import { l02TiposDeExcepcion } from "./l02-tipos-de-excepcion";
import { l03ThrowPropagacion } from "./l03-throw-propagacion";
import { l04ExcepcionesPersonalizadas } from "./l04-excepciones-personalizadas";
import { l05AdderrorEnTriggers } from "./l05-adderror-en-triggers";
import { l06Checkpoint } from "./l06-checkpoint";

export const m08: Module = {
  id: "m08",
  n: 8,
  category: "robust",
  status: "ready",
  title: { es: "Manejo de Excepciones", en: "Exception Handling" },
  subtitle: {
    es: "Qué hacer cuando algo falla: el fault path de tus flows, pero con tipos, informe por registro y sin tumbar el lote. Los seis talleres construyen el puente nocturno con el ERP de Northwind.",
    en: "What to do when something breaks: your flows' fault path, but with types, a per-record report and without bringing down the batch. The six workshops build Northwind's nightly bridge with the ERP.",
  },
  lessons: [
    l01TryCatchFinally,
    l02TiposDeExcepcion,
    l03ThrowPropagacion,
    l04ExcepcionesPersonalizadas,
    l05AdderrorEnTriggers,
    l06Checkpoint,
  ],
};
