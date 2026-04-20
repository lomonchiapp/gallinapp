import type { TipoAve } from "./enums";

export interface RegistroMortalidad {
    id: string;
    loteId: string;
    tipoLote: TipoAve.PONEDORA | TipoAve.POLLO_ENGORDE | TipoAve.POLLO_LEVANTE; // ponedoras, levantes, engorde
    fecha: Date;
    cantidad: number;
    causa?: string;
    createdBy: string;
    createdAt: Date;
  }