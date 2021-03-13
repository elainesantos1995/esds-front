
export class BeneficiarioEnderecoDTO{
	id: number;
    nome: string;
	sobrenome: string;
	dataNascimento: Date;
	beneficiarioTitular: boolean;
	cpf: string;	
	rg: string;	
	rgDataEmissao: string;	
	rgOrgaoEmissor: string;
	sexo: any;
	estadoCivil: any;
	telefone1: string;
	telefone2: string;

	idEndereco: number;
	logradouro: string;
	numero: string;
	complemento: string;
	bairro: string;
	cidade: string;
	cep: string;
	pontoDeReferencia: string;
	email: string;

	imagem: any;
	idImagem: number;
}