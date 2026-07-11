export function registrarAuditoria(
  acao: string,
  usuario?: string,
  dados?: unknown
) {
  console.log({
    data: new Date().toISOString(),
    acao,
    usuario,
    dados
  });
}