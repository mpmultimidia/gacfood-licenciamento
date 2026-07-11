export interface AssinaturaLicenca {
  empresaId: string;
  plano: string;
  inicio: Date;
  vencimento: Date;
  ativa: boolean;
}

export function criarAssinatura(
  empresaId: string,
  plano: string,
  dias: number
): AssinaturaLicenca {
  const inicio = new Date();

  const vencimento = new Date();
  vencimento.setDate(
    inicio.getDate() + dias
  );

  return {
    empresaId,
    plano,
    inicio,
    vencimento,
    ativa: true
  };
}