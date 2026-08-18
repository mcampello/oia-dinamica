export function limitarPasso(passo: number, total: number) {
  return Math.min(Math.max(passo, 1), total);
}

export function registrarVisita(visitados: ReadonlySet<number>, passo: number) {
  const proximos = new Set(visitados);
  proximos.add(passo);
  return proximos;
}
