import { Endereco } from "./endereco";

export class Beneficiario{
    id: number;
    nome: string;
    rg: string;
    rgDataEmissao: string;
    rgOrgaoEmissor: string;
    cpf: string;
    dataNascimento: Date;
    beneficiarioTitular: boolean;
    estadoCivil: any;
    sexo: any;
}