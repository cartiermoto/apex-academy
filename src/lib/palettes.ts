import type { L } from "./types";

/**
 * Colour palettes the student can pick from the menu. The colours themselves live
 * in globals.css (selected by data-palette on <html>); this list only names them
 * and carries the three swatch colours the menu shows, so keep both in step.
 * "bosque" is the base: it has no CSS block of its own.
 */
export type PaletteId = "bosque" | "oceano" | "terracota" | "ciruela" | "grafito";

export interface Palette {
  id: PaletteId;
  name: L;
  note: L;
  /** swatch: accent, soft surface, page background */
  light: [string, string, string];
  dark: [string, string, string];
}

export const DEFAULT_PALETTE: PaletteId = "bosque";

export const PALETTES: Palette[] = [
  {
    id: "bosque",
    name: { es: "Bosque", en: "Forest" },
    note: { es: "Verde, la original", en: "Green, the original" },
    light: ["#2e7a4c", "#d9eddf", "#fbf7f1"],
    dark: ["#6bc08a", "#1e4636", "#12262e"],
  },
  {
    id: "oceano",
    name: { es: "Océano", en: "Ocean" },
    note: { es: "Azul sereno", en: "Calm blue" },
    light: ["#1f6fa8", "#d6e7f5", "#f3f7fb"],
    dark: ["#6cb4ea", "#1b4560", "#0e2030"],
  },
  {
    id: "terracota",
    name: { es: "Terracota", en: "Terracotta" },
    note: { es: "Arcilla cálida", en: "Warm clay" },
    light: ["#b04a26", "#f6dccd", "#fcf5ef"],
    dark: ["#ec9a77", "#53321f", "#2a1a15"],
  },
  {
    id: "ciruela",
    name: { es: "Ciruela", en: "Plum" },
    note: { es: "Violeta suave", en: "Soft violet" },
    light: ["#6b3fa0", "#e7dcf3", "#f8f5fb"],
    dark: ["#c6a6ee", "#41305a", "#1d1727"],
  },
  {
    id: "grafito",
    name: { es: "Grafito", en: "Graphite" },
    note: { es: "Sin color, solo grises", en: "No colour, just greys" },
    light: ["#2b2b2b", "#e4e4df", "#f6f6f3"],
    dark: ["#ece8e8", "#383838", "#161616"],
  },
];

export const isPaletteId = (v: unknown): v is PaletteId => PALETTES.some((p) => p.id === v);
