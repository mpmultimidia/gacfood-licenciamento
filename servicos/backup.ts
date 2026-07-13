import { registrarLog } from "./log.js";

export function registrarBackup(
  tipo: string
) {
  const backup = {
    tipo,
    data: new Date().toISOString(),
    status: "registrado"
  };

  registrarLog(
    "BACKUP",
    backup
  );

  return backup;
}