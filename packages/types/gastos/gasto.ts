import type { CategoriaGasto, TipoAve } from "../enums";

export interface Gasto {
    id: string;
    loteId: string;
    tipoLote: TipoAve; // Usar enum TipoAve en lugar de string
    articuloId: string;
    articuloNombre: string; // Para mantener el nombre incluso si el artículo cambia
    cantidad: number;
    precioUnitario?: number; // Precio al momento de la compra
    total: number;
    fecha: Date;
    categoria: CategoriaGasto;
    descripcion?: string;
    afectaInventario?: boolean;
    movimientoInventarioId?: string;
    almacenId?: string;
    createdBy: string;
    createdAt: Date;
}
  