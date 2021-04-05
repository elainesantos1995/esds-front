import { BeneficiarioEnderecoDTO } from "./beneficiarioEnderecoDTO";
import {BeneficioDTO} from './beneficioDTO';

export class ProgramaDTO{
    id: number;
    nome: string;
    descricao: string;
    vigenciaInicio: Date;
    vigenciaTermino: Date;
    beneficiosDTO: BeneficioDTO[];
    ano: number;
}