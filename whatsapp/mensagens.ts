// whatsapp/mensagens.ts

export const mensagens = {
  boasVindas:
    'Olá! Sou o assistente de licenças do GACFOOD.\n\n' +
    'Digite *RENOVAR* para solicitar um novo código de ativação.',

  pedirCodigoEmpresa:
    'Informe o código da sua empresa (ex: GAC-8F42K). ' +
    'Você encontra esse código na tela de ativação do GACFOOD.',

  codigoGerado: (nomeFantasia: string, codigo: string, minutosValidade: number) =>
    `Encontrei sua empresa: *${nomeFantasia}*\n\n` +
    `Seu código de ativação é: *${codigo}*\n` +
    `Válido por ${minutosValidade} minutos.\n\n` +
    'Digite esse código na tela de ativação do GACFOOD para liberar mais 30 dias de uso.',

  erroGenerico:
    'Não consegui processar sua solicitação agora. ' +
    'Tente novamente em alguns minutos ou entre em contato com o suporte.',
};
