export abstract class RepositorioBase {
  protected nomeTabela: string;

  constructor(nomeTabela: string) {
    this.nomeTabela = nomeTabela;
  }

  public tabela(): string {
    return this.nomeTabela;
  }
}-