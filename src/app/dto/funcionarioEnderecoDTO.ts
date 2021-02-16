export class FuncionarioEnderecoDTO{

    id: number;
    nome: string;
    matricula: string;
    rg: string;
    rgDataEmissao: string;
    rgOrgaoEmissor: string;
    cpf: string;
    dataNascimento: Date;
    login: string;
    senha: string;
    admin: boolean;
    matriculaCFESS: string;
    sexo: any;
    tipo: string;

    idEndereco: number;
    logradouro: string;
	numero: string;
	complemento: string;
	bairro: string;
	cidade: string;
	cep: string;
    pontoDeReferencia: string;
    email: string;
    telefone1: string;
    telefone2: string;
}