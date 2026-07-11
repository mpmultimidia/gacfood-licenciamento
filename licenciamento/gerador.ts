import { gerarChaveAleatoria } from "../seguranca/chaves";

export function gerarCodigoLicenca(): string {
  const prefixo = "GAC";

  const codigo = gerarChaveAleatoria(20)
    .toUpperCase();

  return `${prefixo}-${codigo}`;
}