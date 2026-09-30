import type { Module } from "@/lib/types";
import { l01PorQueAsincrono } from "./l01-por-que-asincrono";
import { l02Future } from "./l02-future";
import { l03Queueable } from "./l03-queueable";
import { l04Batch } from "./l04-batch";
import { l05Scheduled } from "./l05-scheduled";
import { l06ElegirHerramienta } from "./l06-elegir-herramienta";
import { l07Checkpoint } from "./l07-checkpoint";

export const m09: Module = {
  id: "m09",
  n: 9,
  category: "robust",
  status: "ready",
  title: { es: "Apex Asíncrono", en: "Asynchronous Apex" },
  subtitle: {
    es: "Trabajo que no cabe en una transacción: @future, Queueable, Batch y Scheduled, y cuándo usar cada uno. Los siete talleres llevan el puente con el ERP de 300 filas a 300.000.",
    en: "Work that does not fit in one transaction: @future, Queueable, Batch and Scheduled, and when to use each. The seven workshops take the ERP bridge from 300 rows to 300,000.",
  },
  lessons: [
    l01PorQueAsincrono,
    l02Future,
    l03Queueable,
    l04Batch,
    l05Scheduled,
    l06ElegirHerramienta,
    l07Checkpoint,
  ],
};
