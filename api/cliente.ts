import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:3002/api",

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const cliente = {
  listarEmpresas() {
    return api.get("/empresas");
  },

  listarUsuarios() {
    return api.get("/usuarios");
  },

  listarPlanos() {
    return api.get("/planos");
  },

  listarLicencas() {
    return api.get("/licencas");
  },

  listarModulos() {
    return api.get("/modulos");
  },

  listarConfiguracoes() {
    return api.get("/configuracoes");
  },

  salvarConfiguracoes(dados: unknown) {
    return api.put("/configuracoes", dados);
  },

  listarLogs() {
    return api.get("/logs");
  },

  listarHistorico() {
    return api.get("/historico");
  },

  saude() {
    return api.get("/saude");
  },
};

export default cliente;