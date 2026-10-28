/* Escala dos sliders de dinheiro, arredondamento e formatação (idênticos à v6). */

export const LIMITES = {
  aporte: { max: 500_000, base: 3500 },
  patrimonio: { max: 100_000_000, base: 4500 },
  imoveis: { max: 100_000_000, base: 4500 },
} as const;
export type CampoValor = keyof typeof LIMITES;

export const IDADE = { min: 16, max: 85, inicial: 35 };

/** Escala logarítmica: t (0–1) → valor */
export function paraValor(campo: CampoValor, t: number) {
  const { max, base } = LIMITES[campo];
  const a = max / (base - 1);
  return a * (Math.pow(base, t) - 1);
}

/** valor → t (0–1) */
export function paraPosicao(campo: CampoValor, v: number) {
  if (v <= 0) return 0;
  const { max, base } = LIMITES[campo];
  const a = max / (base - 1);
  return Math.min(1, Math.max(0, Math.log(v / a + 1) / Math.log(base)));
}

export function arredonda(v: number) {
  if (v < 10_000) return Math.round(v / 100) * 100;
  if (v < 100_000) return Math.round(v / 1000) * 1000;
  if (v < 1_000_000) return Math.round(v / 5000) * 5000;
  if (v < 10_000_000) return Math.round(v / 50_000) * 50_000;
  return Math.round(v / 250_000) * 250_000;
}

/** Passo dos botões − e +, proporcional ao valor. */
export function passoDinheiro(v: number) {
  return v < 10_000 ? 500 : v < 100_000 ? 5000 : v < 1_000_000 ? 25_000 : v < 10_000_000 ? 250_000 : 1_000_000;
}

/** Novo valor após clicar em − (dir -1) ou + (dir 1). */
export function aplicaPasso(campo: CampoValor, atual: number, dir: 1 | -1) {
  const s = passoDinheiro(dir < 0 ? Math.max(0, atual - 1) : atual);
  return Math.max(0, Math.min(LIMITES[campo].max, atual + dir * s));
}

export const fmt = (n: number) => "R$ " + Math.round(n).toLocaleString("pt-BR");
export const fmtNum = (n: number) => Math.round(n).toLocaleString("pt-BR");
export const digitos = (s: string) => s.replace(/\D/g, "");

export function fmtCurto(n: number) {
  if (n >= 1e6) return "R$ " + (n / 1e6).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + " mi";
  if (n >= 1e3) return "R$ " + Math.round(n / 1e3).toLocaleString("pt-BR") + " mil";
  return fmt(n);
}
