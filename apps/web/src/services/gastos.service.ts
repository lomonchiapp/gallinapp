import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { TipoAve } from '@gallinapp/types';
import type { Gasto } from '@gallinapp/types';

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

export const calcularCostoProduccionUnitario = async (loteId: string, tipoLote: TipoAve): Promise<number> => {
  try {
    const gastosLote = await obtenerGastos(loteId, tipoLote);
    return gastosLote.reduce((total, gasto) => total + gasto.total, 0);
  } catch (error) {
    console.error('Error al calcular costo de producción unitario:', error);
    return 0;
  }
};

