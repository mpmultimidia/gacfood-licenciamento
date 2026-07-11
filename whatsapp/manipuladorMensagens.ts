// whatsapp/manipuladorMensagens.ts
import type { Message } from 'whatsapp-web.js';
import { solicitarCodigoDeAtivacao } from '../licenciamento/renovacao';
import { ErroValidacao } from '../licenciamento/validacao';
import { ambiente } from '../config/ambiente';
import { definirEstado, obterEstado, limparEstado } from './estadoConversas';
import { mensagens } from './mensagens';

const PALAVRAS_RENOVAR = ['renovar', 'renovacao', 'licenca'];

function normalizar(texto: string): string {
  return texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // remove acentos (renovação -> renovacao)
}

/**
 * Ponto de entrada chamado para cada mensagem recebida no WhatsApp.
 * State machine simples de 2 passos:
 *   1) cliente pede "RENOVAR"           -> bot pede o código da empresa
 *   2) cliente manda o código da empresa -> bot gera e devolve o código de ativação
 */
export async function tratarMensagem(msg: Message): Promise<void> {
  const numero = msg.from;
  const texto = normalizar(msg.body);
  const estado = obterEstado(numero);

  if (estado === 'aguardando_codigo_empresa') {
    limparEstado(numero);
    await responderComCodigoDeAtivacao(msg);
    return;
  }

  if (PALAVRAS_RENOVAR.some((palavra) => texto.includes(palavra))) {
    definirEstado(numero, 'aguardando_codigo_empresa');
    await msg.reply(mensagens.pedirCodigoEmpresa);
    return;
  }

  await msg.reply(mensagens.boasVindas);
}

async function responderComCodigoDeAtivacao(msg: Message): Promise<void> {
  const codigoEmpresa = msg.body.trim();

  try {
    const { empresa, codigoAtivacao } = await solicitarCodigoDeAtivacao(codigoEmpresa);
    await msg.reply(
      mensagens.codigoGerado(
        empresa.nome_fantasia,
        codigoAtivacao.codigo,
        ambiente.codigoAtivacaoMinutosValidade
      )
    );
  } catch (erro) {
    if (erro instanceof ErroValidacao) {
      await msg.reply(erro.message);
      return;
    }
    console.error('Erro ao gerar código de ativação via WhatsApp:', erro);
    await msg.reply(mensagens.erroGenerico);
  }
}
