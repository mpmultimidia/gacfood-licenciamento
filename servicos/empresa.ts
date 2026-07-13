import { EmpresaRepositorio } from "../repositorios/empresa.js";

const repositorio = new EmpresaRepositorio();

export async function listarEmpresas() {
  return await repositorio.listar();
}

export async function buscarEmpresa(
  id: string
) {
  return await repositorio.buscarPorId(id);
}

export async function criarEmpresa(
  dados: unknown
) {
  return await repositorio.criar(dados);
}