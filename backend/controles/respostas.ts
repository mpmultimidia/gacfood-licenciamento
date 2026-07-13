export function sucesso(
  dados: unknown,
  mensagem = "Operação realizada com sucesso"
) {
  return {
    sucesso: true,
    mensagem,
    dados
  };
}

export function falha(
  mensagem: string,
  erro?: unknown
) {
  return {
    sucesso: false,
    mensagem,
    erro
  };
}