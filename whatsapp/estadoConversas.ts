// whatsapp/estadoConversas.ts
//
// Estado de conversa por número de WhatsApp, guardado em memória.
// Se o processo do bot reiniciar, o cliente só perde o passo em que
// estava e precisa digitar RENOVAR de novo — aceitável para v1.0.
// Se quiser sobreviver a reinícios no futuro, dá pra trocar isso por
// uma tabela no Supabase.

export type EstadoConversa = 'aguardando_codigo_empresa';

const estados = new Map<string, EstadoConversa>();

export function definirEstado(numero: string, estado: EstadoConversa): void {
  estados.set(numero, estado);
}

export function obterEstado(numero: string): EstadoConversa | undefined {
  return estados.get(numero);
}

export function limparEstado(numero: string): void {
  estados.delete(numero);
}
