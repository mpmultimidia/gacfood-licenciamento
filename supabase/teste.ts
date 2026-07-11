// supabase/teste.ts
// Rode com: npx ts-node supabase/teste.ts
// (ou: npx ts-node-dev supabase/teste.ts)

import { testarConexao } from './conexao';

testarConexao()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
