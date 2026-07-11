export type StatusEmpresa =
  | "ATIVA"
  | "SUSPENSA"
  | "CANCELADA";

export type StatusLicenca =
  | "ATIVA"
  | "EXPIRADA"
  | "CANCELADA";

export interface Empresa {
  id: string;
  codigo: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string | null;
  telefone: string | null;
  whatsapp: string;
  email: string | null;
  cidade: string | null;
  uf: string | null;
  status: StatusEmpresa;
  observacoes: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface Plano {
  id: string;
  nome: string;
  descricao: string | null;
  valor: number;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface Funcionalidade {
  id: string;
  codigo: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface Licenca {
  id: string;
  empresa_id: string;
  plano_id: string;
  codigo_licenca: string;
  versao: string;
  emitida_em: string;
  expira_em: string;
  status: StatusLicenca;
  hash_dispositivo: string | null;
  ultima_validacao: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface Database {
  lic: {
    Tables: {
      empresas: {
        Row: Empresa;
        Insert: Partial<Empresa>;
        Update: Partial<Empresa>;
      };

      planos: {
        Row: Plano;
        Insert: Partial<Plano>;
        Update: Partial<Plano>;
      };

      funcionalidades: {
        Row: Funcionalidade;
        Insert: Partial<Funcionalidade>;
        Update: Partial<Funcionalidade>;
      };

      licencas: {
        Row: Licenca;
        Insert: Partial<Licenca>;
        Update: Partial<Licenca>;
      };
    };

    Views: {
      vw_empresas_licencas: {
        Row: {
          codigo: string;
          nome_fantasia: string;
          empresa_status: StatusEmpresa;
          plano: string | null;
          licenca_status: StatusLicenca | null;
          emitida_em: string | null;
          expira_em: string | null;
        };
      };
    };

    Functions: {
      gerar_codigo_empresa: {
        Args: Record<string, never>;
        Returns: string;
      };

      gerar_codigo_ativacao: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
  };
}