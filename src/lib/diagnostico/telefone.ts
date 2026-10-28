import { digitos } from "./valores";

export interface Pais {
  c: string;
  d: string;
  f: string;
  min: number;
  max: number;
  mask: "br" | "us" | "gen";
}

export const PAISES: Pais[] = [
  { c: "BR", d: "55", f: "🇧🇷", min: 10, max: 11, mask: "br" },
  { c: "PT", d: "351", f: "🇵🇹", min: 9, max: 9, mask: "gen" },
  { c: "US", d: "1", f: "🇺🇸", min: 10, max: 10, mask: "us" },
  { c: "AR", d: "54", f: "🇦🇷", min: 10, max: 11, mask: "gen" },
  { c: "PY", d: "595", f: "🇵🇾", min: 9, max: 9, mask: "gen" },
  { c: "UY", d: "598", f: "🇺🇾", min: 8, max: 9, mask: "gen" },
  { c: "ES", d: "34", f: "🇪🇸", min: 9, max: 9, mask: "gen" },
  { c: "GB", d: "44", f: "🇬🇧", min: 10, max: 10, mask: "gen" },
  { c: "", d: "", f: "🌎", min: 6, max: 15, mask: "gen" },
];

export function mascara(d: string, pais: Pais) {
  if (pais.mask === "br") {
    // (11) 91234-5678
    if (d.length <= 2) return d.length ? "(" + d : "";
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7, 11);
  }
  if (pais.mask === "us") {
    if (d.length <= 3) return d;
    if (d.length <= 6) return "(" + d.slice(0, 3) + ") " + d.slice(3);
    return "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6, 10);
  }
  return d;
}

export function formataTelefone(valor: string, paisIdx: number) {
  const p = PAISES[paisIdx] ?? PAISES[0];
  return mascara(digitos(valor).slice(0, p.max), p);
}

export function telefoneOk(valor: string, paisIdx: number) {
  const p = PAISES[paisIdx] ?? PAISES[0];
  const n = digitos(valor).length;
  return n >= p.min && n <= p.max;
}

export function telefoneE164(valor: string, paisIdx: number) {
  const p = PAISES[paisIdx] ?? PAISES[0];
  return "+" + (p.d || "") + digitos(valor);
}
