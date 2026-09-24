import type { Module } from "@/lib/types";
import { l01UnTriggerPorObjeto } from "./l01-un-trigger-por-objeto";
import { l02Handler } from "./l02-handler";
import { l03Servicio } from "./l03-servicio";
import { l04GuardiaBypass } from "./l04-guardia-bypass";
import { l05Checkpoint } from "./l05-checkpoint";

export const m07: Module = {
  id: "m07",
  n: 7,
  category: "obj",
  status: "ready",
  title: { es: "Trigger Handlers", en: "Trigger Handlers" },
  subtitle: {
    es: "Un trigger por objeto, toda la lógica fuera: el patrón que hace mantenible una org. Los cinco talleres ponen en orden el trigger heredado de Soporte.",
    en: "One trigger per object, all logic outside: the pattern that keeps an org maintainable. The five workshops put Support's inherited trigger in order.",
  },
  lessons: [l01UnTriggerPorObjeto, l02Handler, l03Servicio, l04GuardiaBypass, l05Checkpoint],
};
