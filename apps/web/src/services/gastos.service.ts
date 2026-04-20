import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { TipoAve } from '@gallinapp/types';
import type { Gasto } from '@gallinapp/types';

function esLineaCostoInicialSintetica(g: Gasto): boolean {
  if (g.articuloId === 'costo-inicial') return true;
  const d = (g.descripcion || '').toLowerCase();
  const n = (g.articuloNombre || '').toLowerCase();
  return d.includes('costo inicial') || n.includes('costo inicial');
}

function calcularInversionYLoteGastos(gastos: Gasto[], costoEnDocumentoLote: number): number {
  const sumaMovimientos = gastos.reduce((s, g) => s + g.total, 0);
  if (gastos.some(esLineaCostoInicialSintetica)) {
    return sumaMovimientos;
  }
  return (costoEnDocumentoLote || 0) + sumaMovimientos;
}

export const obtenerGastos = async (loteId?: string, tipoLote?: TipoAve): Promise<Gasto[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    
    let constraints: any[] = [where('createdBy', '==', userId)];
    if (loteId) constraints.push(where('loteId', '==', loteId));
    if (tipoLote) constraints.push(where('tipoLote', '==', tipoLote));
    
    const q = query(collection(db, 'gastos'), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      total: doc.data().total || 0,
    } as Gasto));
  } catch (error) {
    console.error('Error al obtener gastos:', error);
    return [];
  }
};

/** Inversión total: misma lógica que apps/mobile (sin duplicar `lote.costo` + línea costo-inicial en GASTOS). */
export const calcularCostoProduccionUnitario = async (
  loteId: string,
  tipoLote: TipoAve,
  costoEnDocumentoLote = 0
): Promise<number> => {
  try {
    const gastosLote = await obtenerGastos(loteId, tipoLote);
    return calcularInversionYLoteGastos(gastosLote, costoEnDocumentoLote);
  } catch (error) {
    console.error('Error al calcular costo de producción unitario:', error);
    return 0;
  }
};

