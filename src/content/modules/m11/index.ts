import type { Module } from "@/lib/types";
import { l01HttpCallouts } from "./l01-http-callouts";
import { l02Json } from "./l02-json";
import { l03NamedCredentials } from "./l03-named-credentials";
import { l04ApexRest } from "./l04-apex-rest";
import { l05Soap } from "./l05-soap";
import { l06CalloutsAsincronos } from "./l06-callouts-asincronos";
import { l07Checkpoint } from "./l07-checkpoint";

export const m11: Module = {
  id: "m11",
  n: 11,
  category: "scope",
  status: "ready",
  title: { es: "Integraciones", en: "Integrations" },
  subtitle: {
    es: "Salesforce hablando con el resto del mundo: callouts HTTP, JSON, Named Credentials, tu propia API y SOAP. Los siete talleres abren la caja del puente con el ERP.",
    en: "Salesforce talking to the rest of the world: HTTP callouts, JSON, Named Credentials, your own API and SOAP. The seven workshops open the box of the ERP bridge.",
  },
  lessons: [l01HttpCallouts, l02Json, l03NamedCredentials, l04ApexRest, l05Soap, l06CalloutsAsincronos, l07Checkpoint],
};
