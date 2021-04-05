import { BeneficiarioEnderecoDTO } from "./beneficiarioEnderecoDTO";

export class DadosSocioeconomicosDTO{

	id: number;
//_________________________________		
	temBanheiro: boolean;
	aguaEncanada: boolean;
	energiaEletrica: boolean;
	coletaEsgoto: boolean;
	familiaIndigena: boolean;
	familiaQuilombola: boolean;
	membroEmpregado: boolean;
	doencaCronica: boolean;	
	membroDeficiente: boolean;
//_________________________________	
	composicaoDomicilio: string;
	localidade: string;
	condicaoResidencia: string;
	quantComodos: string;	
	quantMembrosFamilia: string;
	quantMembrosIdosos: string;
	tipoDeTrabalho: string;
	rendaPerCapita: string;
	quantMembrosCriancas: string;
//_________________________________		
	nomesMembrosFamilia: string[];
	rendaFamiliar: number;	
	doencasCronicas: string[];
	quantMembroDeficiente: number;
	tipoDeficiencia: string;
//_________________________________		
	idBeneficiario: string;
	cpfBeneficiario:string;
//_________________________________
	dataPreenchimento: Date;
	dataUltimaAtualizacao: Date;
	pontuacao: number;	
//_________________________________
	beneficiarioTitular: BeneficiarioEnderecoDTO;
	
}