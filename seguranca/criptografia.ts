import crypto from "crypto";

const algoritmo = "aes-256-cbc";

export function criptografar(
  texto: string,
  chave: string
): string {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    algoritmo,
    crypto
      .createHash("sha256")
      .update(chave)
      .digest(),
    iv
  );

  const resultado = Buffer.concat([
    cipher.update(texto, "utf8"),
    cipher.final()
  ]);

  return `${iv.toString("hex")}:${resultado.toString("hex")}`;
}

export function descriptografar(
  texto: string,
  chave: string
): string {
  const partes = texto.split(":");

  const iv = Buffer.from(partes[0], "hex");

  const dados = Buffer.from(
    partes[1],
    "hex"
  );

  const decipher = crypto.createDecipheriv(
    algoritmo,
    crypto
      .createHash("sha256")
      .update(chave)
      .digest(),
    iv
  );

  const resultado = Buffer.concat([
    decipher.update(dados),
    decipher.final()
  ]);

  return resultado.toString("utf8");
}