interface Variaveis {
  "1": string,
}

interface Contato {
  nome: string,
  telefone: string,
}

export interface IQualifiedHSM {
  cod_conta: number,
  hsm: number,
  cod_flow: number,
  tipo_envio: number,
  variaveis: Variaveis,
  contato: Contato,
  start_flow: number,
}
