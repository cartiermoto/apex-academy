import type { Module } from "@/lib/types";
import { l01ClasesObjetos } from "./l01-clases-objetos";
import { l02Referencias } from "./l02-referencias";
import { l03Constructores } from "./l03-constructores";
import { l04This } from "./l04-this";
import { l05Static } from "./l05-static";
import { l06AccessModifiers } from "./l06-access-modifiers";
import { l07Herencia } from "./l07-herencia";
import { l08VirtualAbstract } from "./l08-virtual-abstract";
import { l09Sobrecarga } from "./l09-sobrecarga";
import { l10Interfaces } from "./l10-interfaces";
import { l11InternasEnums } from "./l11-internas-enums";
import { l12Checkpoint } from "./l12-checkpoint";

export const m05: Module = {
  id: "m05",
  n: 5,
  category: "obj",
  status: "ready",
  title: { es: "Clases, Interfaces y POO", en: "Classes, Interfaces and OOP" },
  subtitle: {
    es: "Del objeto de Salesforce al objeto de Apex: definir tus propios moldes.",
    en: "From the Salesforce object to the Apex object: defining your own moulds.",
  },
  lessons: [
    l01ClasesObjetos,
    l02Referencias,
    l03Constructores,
    l04This,
    l05Static,
    l06AccessModifiers,
    l07Herencia,
    l08VirtualAbstract,
    l09Sobrecarga,
    l10Interfaces,
    l11InternasEnums,
    l12Checkpoint,
  ],
};
