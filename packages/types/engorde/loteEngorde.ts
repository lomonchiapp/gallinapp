import type { TipoAve } from "../enums";
import type { LoteBase } from "../loteBase";

export interface LoteEngorde extends LoteBase {
    tipo: TipoAve.POLLO_ENGORDE;
}
