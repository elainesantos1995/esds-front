import { ProgramaDTO } from "./programaDTO";

export class BeneficioDTO{
    id: number;
	nome: string;
	justificativa: string;
	totalRecursosAportados: number;
	limiteVagas: number;
	controleBiometria: boolean;
	controleDocumento: boolean;
	controleCarteirinha: boolean;
	periodicidade: string;
	toleranciaUsosInadimplente: number;
	toleranciaUsosCancelado: number;
	programa: ProgramaDTO;
	idPrograma: number;
}