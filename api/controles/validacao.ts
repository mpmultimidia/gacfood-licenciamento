export function campoObrigatorio(
  valor: unknown,
  nome: string
) {
  if (
    valor === undefined ||
    valor === null ||
    valor === ""
  ) {
    throw new Error(
      `Campo obrigatório: ${nome}`
    );
  }

  return true;
}