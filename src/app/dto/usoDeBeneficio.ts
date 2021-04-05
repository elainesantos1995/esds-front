import { InscricaoDTO } from "./inscricaoDTO";
import { BeneficioDTO } from './beneficioDTO';

export class UsoDeBeneficioDTO{
    id: number;
	dataDoUso: Date;
	controleBiometria: boolean;
	controleDocumento: boolean;
	controleCarteirinha: boolean;
    idInscricao: number;  
	idBeneficio: number;
	beneficio: BeneficioDTO;
	inscricao: InscricaoDTO;
}