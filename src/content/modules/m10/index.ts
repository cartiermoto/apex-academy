import type { Module } from "@/lib/types";
import { l01IsTest } from "./l01-istest";
import { l02DatosTestSetup } from "./l02-datos-testsetup";
import { l03Assert } from "./l03-assert";
import { l04StartTestStopTest } from "./l04-starttest-stoptest";
import { l05ExcepcionesLimites } from "./l05-excepciones-limites";
import { l06Mocks } from "./l06-mocks";
import { l07Checkpoint } from "./l07-checkpoint";

export const m10: Module = {
  id: "m10",
  n: 10,
  category: "robust",
  status: "ready",
  title: { es: "Testing en Apex", en: "Testing in Apex" },
  subtitle: {
    es: "El 75 % no es la meta: es el mínimo para desplegar. La meta es que un test encuentre el fallo antes que un cliente. Los siete talleres ponen a prueba el puente con el ERP.",
    en: "75% is not the goal: it is the minimum to deploy. The goal is a test finding the bug before a customer does. The seven workshops put the ERP bridge to the test.",
  },
  lessons: [
    l01IsTest,
    l02DatosTestSetup,
    l03Assert,
    l04StartTestStopTest,
    l05ExcepcionesLimites,
    l06Mocks,
    l07Checkpoint,
  ],
};
