import { registrarLog } from "./log.js";

export function enviarNotificacao(
  destino: string,
  mensagem: string
) {
  registrarLog(
    "NOTIFICACAO",
    {
      destino,
      mensagem
    }
  );

  return {
    enviado: true,
    destino,
    mensagem
  };
}