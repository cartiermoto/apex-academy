import type { Module } from "@/lib/types";
import { l01Sharing } from "./l01-sharing";
import { l02CrudFls } from "./l02-crud-fls";
import { l03UserMode } from "./l03-user-mode";
import { l04InyeccionSoql } from "./l04-inyeccion-soql";
import { l05Checkpoint } from "./l05-checkpoint";

export const m12: Module = {
  id: "m12",
  n: 12,
  category: "scope",
  status: "ready",
  title: { es: "Seguridad", en: "Security" },
  subtitle: {
    es: "Apex puede ver y cambiar más que el usuario que lo dispara, y cuánto es decisión tuya: sharing, permisos de objeto y de campo, modo usuario e inyección de SOQL. Los cinco talleres pasan una auditoría al puente con el ERP.",
    en: "Apex can see and change more than the user who triggers it, and how much is your decision: sharing, object and field permissions, user mode and SOQL injection. The five workshops put the ERP bridge through an audit.",
  },
  lessons: [l01Sharing, l02CrudFls, l03UserMode, l04InyeccionSoql, l05Checkpoint],
};
