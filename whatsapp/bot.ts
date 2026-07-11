// whatsapp/bot.ts
//
// Ponto de entrada do bot. Rode com: npx ts-node whatsapp/bot.ts
// Na primeira vez, escaneie o QR Code exibido no terminal com o WhatsApp
// que vai atender os clientes (recomendado: um número dedicado, não o
// seu pessoal — veja a nota sobre risco de bloqueio abaixo).
//
// ⚠️ whatsapp-web.js é uma biblioteca não-oficial: ela automatiza o
// WhatsApp Web via navegador (Puppeteer). O WhatsApp não permite bots
// não-oficiais nos termos de uso — existe risco de bloqueio do número,
// principalmente com alto volume de mensagens. Para uso mais seguro em
// produção, considere migrar para a Cloud API oficial da Meta no futuro.
//
// A sessão fica salva em .wwebjs_auth/ (não versione essa pasta no git).

import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { tratarMensagem } from './manipuladorMensagens';

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'gacfood-licenciamento' }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.on('qr', (qr) => {
  console.log('Escaneie o QR Code abaixo com o WhatsApp do robô:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Bot de WhatsApp do GACFOOD conectado e pronto.');
});

client.on('auth_failure', (mensagem) => {
  console.error('❌ Falha na autenticação do WhatsApp:', mensagem);
});

client.on('disconnected', (motivo) => {
  console.warn('⚠️ WhatsApp desconectado:', motivo);
});

client.on('message', (msg) => {
  tratarMensagem(msg).catch((erro) => {
    console.error('Erro ao tratar mensagem do WhatsApp:', erro);
  });
});

client.initialize();
