export function registrarLog(
  evento: string,
  dados?: unknown
) {
  console.log({
    data: new Date().toISOString(),
    evento,
    dados
  });
}