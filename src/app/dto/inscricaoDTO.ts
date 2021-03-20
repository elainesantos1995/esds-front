import { BeneficioDTO } from "./beneficioDTO";

export class InscricaoDTO{
    id: number;
	dataInscricao: Date;
	parecer: string;
	status: string;

	quantBeneficiosASeremRetiradados: number;
	quantBeneficiosRetirados: number;
	
	cpfBeneficiario: string;

	idBeneficio: number;
	beneficiosDTO: any;
	beneficiarioDTO: any;
	
}