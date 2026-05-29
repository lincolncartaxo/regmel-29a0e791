export type Comunidade = {
  apf: string;
  municipio: string;
  comunidade: string;
  total: number;
  subtotal: number;
  inapto: number;
  apto: number;
  inaptoNisNaoLocalizado: number;
  temContrato: number;
  inaptoNaoRf: number;
  aptoDuplicado: number;
  semContratoSemConsulta: number;
  aptoSemContrato: number;
  inaptoSemContrato: number;
  desvio: number;
  status: "em_andamento" | "pendente";
};

export const comunidades: Comunidade[] = [
  { apf: "0613664-14", municipio: "João Pessoa", comunidade: "Comunidade Bola na Rede", total: 315, subtotal: 159, inapto: 0, apto: 70, inaptoNisNaoLocalizado: 5, temContrato: 78, inaptoNaoRf: 0, aptoDuplicado: 0, semContratoSemConsulta: 12, aptoSemContrato: 168, inaptoSemContrato: 3, desvio: -89, status: "em_andamento" },
  { apf: "0613665-29", municipio: "João Pessoa", comunidade: "Comunidade Nova Trindade", total: 221, subtotal: 112, inapto: 1, apto: 87, inaptoNisNaoLocalizado: 30, temContrato: 14, inaptoNaoRf: 5, aptoDuplicado: 2, semContratoSemConsulta: 0, aptoSemContrato: 1, inaptoSemContrato: 1, desvio: -25, status: "em_andamento" },
  { apf: "0613666-33", municipio: "João Pessoa", comunidade: "Comunidade Jacarapé", total: 85, subtotal: 44, inapto: 0, apto: 55, inaptoNisNaoLocalizado: 1, temContrato: 3, inaptoNaoRf: 0, aptoDuplicado: 0, semContratoSemConsulta: 0, aptoSemContrato: 24, inaptoSemContrato: 0, desvio: 11, status: "em_andamento" },
  { apf: "0613667-47", municipio: "João Pessoa", comunidade: "Comunidade Jardim Mangueira", total: 215, subtotal: 109, inapto: 0, apto: 77, inaptoNisNaoLocalizado: 22, temContrato: 19, inaptoNaoRf: 7, aptoDuplicado: 4, semContratoSemConsulta: 3, aptoSemContrato: 11, inaptoSemContrato: 2, desvio: -32, status: "em_andamento" },
  { apf: "0613668-52", municipio: "João Pessoa", comunidade: "Comunidade Vila Japonesa", total: 315, subtotal: 159, inapto: 3, apto: 80, inaptoNisNaoLocalizado: 52, temContrato: 19, inaptoNaoRf: 8, aptoDuplicado: 2, semContratoSemConsulta: 2, aptoSemContrato: 2, inaptoSemContrato: 0, desvio: -79, status: "em_andamento" },
  { apf: "0613660-79", municipio: "João Pessoa", comunidade: "Gauchinha II", total: 195, subtotal: 99, inapto: 0, apto: 0, inaptoNisNaoLocalizado: 0, temContrato: 0, inaptoNaoRf: 0, aptoDuplicado: 0, semContratoSemConsulta: 0, aptoSemContrato: 0, inaptoSemContrato: 0, desvio: -99, status: "pendente" },
  { apf: "0613661-83", municipio: "João Pessoa", comunidade: "Bananeiras", total: 142, subtotal: 72, inapto: 0, apto: 40, inaptoNisNaoLocalizado: 9, temContrato: 25, inaptoNaoRf: 0, aptoDuplicado: 1, semContratoSemConsulta: 0, aptoSemContrato: 0, inaptoSemContrato: 0, desvio: -32, status: "em_andamento" },
  { apf: "0613662-97", municipio: "João Pessoa", comunidade: "José Mendes", total: 180, subtotal: 91, inapto: 0, apto: 0, inaptoNisNaoLocalizado: 0, temContrato: 0, inaptoNaoRf: 0, aptoDuplicado: 0, semContratoSemConsulta: 0, aptoSemContrato: 0, inaptoSemContrato: 0, desvio: -91, status: "pendente" },
  { apf: "0613663-00", municipio: "João Pessoa", comunidade: "Patricia Tomaz", total: 178, subtotal: 90, inapto: 0, apto: 35, inaptoNisNaoLocalizado: 2, temContrato: 53, inaptoNaoRf: 2, aptoDuplicado: 0, semContratoSemConsulta: 1, aptoSemContrato: 1, inaptoSemContrato: 0, desvio: -55, status: "em_andamento" },
];

export const totals = {
  total: 1846,
  subtotal: 935,
  inapto: 4,
  apto: 444,
  inaptoNisNaoLocalizado: 121,
  temContrato: 211,
  inaptoNaoRf: 22,
  aptoDuplicado: 9,
  semContratoSemConsulta: 18,
  aptoSemContrato: 207,
  inaptoSemContrato: 6,
  desvio: -491,
};
