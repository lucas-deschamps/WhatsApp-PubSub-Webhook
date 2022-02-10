interface Gestor {
  id: string,
  nome?: string,
  email?: string,
}

interface Imobiliaria {
  id: string,
  nome?: string,
}

interface Corretor {
  id: string,
  nome?: string,
  email?: string,
}

interface Situacao {
  id: string,
  nome?: string,
}

interface Empreedimento {
  id: string,
  nome?: string,
}

interface Interacao {
  id: string,
  descricao?: string,
  data_cad?: string,
}

interface Tarefa {
  id: string,
  nome?: string,
  descricao?: string,
  data_cad?: string,
  data?: string,
  data_conclusao?: string,
  data_cancelamento?: string,
}

interface MotivoCancelamento {
  id: string,
  nome?: string,
  descricao?: string,
}

interface CampoAdicional {
  slug: string,
  valor: string,
}

export interface ILead {
  idlead: string,
  gestor?: Gestor,
  imobiliaria?: Imobiliaria,
  corretor?: Corretor,
  situacao?: Situacao,
  nome: string,
  email: string,
  telefone?: string,
  score?: string,
  data_cad?: string,
  midia_principal?: string,
  documento_tipo?: string,
  documento?: string,
  sexo?: string,
  renda_familiar?: string,
  cep?: string,
  numero?: string,
  bairro?: string,
  complemento?: string,
  estado?: string,
  cidade?: string,
  profissao?: string,
  origem?: string,
  data_reativacao?: string,
  empreendimentos?: Array<Empreedimento>,
  midias?: Array<string>,
  tags?: Array<string>,
  data_cancelamento?: string,
  motivo_cancelamento?: MotivoCancelamento,
  data_venda?: string,
  campos_adicionais?: Array<CampoAdicional>,
  interacao?: Array<Interacao>,
  tarefa?: Array<Tarefa>,
  autor_ultima_alteracao?: string,
  fireHSM?: string,
}
