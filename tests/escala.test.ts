import { describe, expect, it } from "vitest";
import { proximaEscala } from "@/components/escala";

describe("escala da curva do painel", () => {
  it("a ponta sobe a cada aumento e nunca passa do topo", () => {
    let escala = 0;
    let anterior = 0;
    let reescalas = 0;
    for (let fim = 100_000; fim <= 3_000_000; fim += 100_000) {
      const nova = proximaEscala(escala, fim);
      const reescalou = nova !== escala;
      if (reescalou) reescalas++;
      escala = nova;
      const altura = fim / escala;
      expect(altura).toBeLessThanOrEqual(0.9);
      expect(altura).toBeGreaterThanOrEqual(0.3);
      // entre duas reescalas, aumentar o valor sempre levanta a ponta
      if (!reescalou && anterior) expect(altura).toBeGreaterThan(anterior);
      anterior = altura;
    }
    // reescala de vez em quando, não a cada clique
    expect(reescalas).toBeLessThan(12);
  });

  it("ao diminuir muito, a escala desce junto", () => {
    let escala = proximaEscala(0, 2_000_000);
    escala = proximaEscala(escala, 200_000);
    expect(200_000 / escala).toBeGreaterThanOrEqual(0.3);
  });

  it("sem valor, mantém a escala", () => {
    expect(proximaEscala(10, 0)).toBe(10);
  });
});
