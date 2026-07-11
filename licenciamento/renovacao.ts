export function verificarRenovacao(
  vencimento: Date
): boolean {

  const hoje = new Date();

  return vencimento.getTime() <= hoje.getTime();

}



export function renovarLicenca(
  dias: number
): Date {

  const novaData = new Date();

  novaData.setDate(
    novaData.getDate() + dias
  );

  return novaData;

}



export function solicitarCodigoDeAtivacao(): string {

  const parte1 = Date.now().toString(36).toUpperCase();

  const parte2 = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();


  return `${parte1}-${parte2}`;

}



export function ativarOuRenovarLicenca(
  codigo: string,
  dias: number = 30
) {

  if (!codigo) {

    throw new Error(
      "Código de ativação não informado."
    );

  }


  return {

    codigo,

    novaDataVencimento:
      renovarLicenca(dias),

    status: "ATIVA"

  };

}