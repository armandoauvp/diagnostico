/**
 * Teto da curva do painel, com folga. O teto acompanha a ponta da curva e só
 * muda quando ela passa de 90% da altura (sobe) ou cai abaixo de 30% (desce).
 * Assim a curva reage a cada clique sem ficar colada no chão nem pular aos saltos.
 */
export function proximaEscala(atual: number, fim: number) {
  if (fim <= 0) return atual;
  if (atual === 0 || fim > atual * 0.9 || fim < atual * 0.3) return fim * 1.5;
  return atual;
}
