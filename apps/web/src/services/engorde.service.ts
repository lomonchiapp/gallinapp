import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { EstadoLote } from '@gallinapp/types';
import type { LoteEngorde } from '@gallinapp/types';

export const obtenerLotesEngorde = async (filtro?: { status?: EstadoLote }): Promise<LoteEngorde[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    const constraints = [where('createdBy', '==', userId)];
    if (filtro?.status) constraints.push(where('estado', '==', filtro.status));
    
    const q = query(collection(db, 'lotesEngorde'), ...constraints, orderBy('fechaInicio', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fechaInicio: doc.data().fechaInicio?.toDate?.() || new Date(doc.data().fechaInicio),
    } as LoteEngorde));
  } catch (error) {
    console.error('Error al obtener lotes de engorde:', error);
    return [];
  }
};

