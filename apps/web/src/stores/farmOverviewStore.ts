import { create } from 'zustand';
import { obtenerLotesPonedoras } from '../services/ponedoras.service';
import { obtenerLotesLevantes } from '../services/levantes.service';
import { obtenerLotesEngorde } from '../services/engorde.service';
import { calcularCostoProduccionUnitario } from '../services/gastos.service';
import { EstadoLote, TipoAve } from '@gallinapp/types';

interface FarmStats {
  ponedoras: { actives: number; investment: number };
  levantes: { actives: number; investment: number };
  engorde: { actives: number; investment: number };
}

interface FarmOverviewState {
  stats: FarmStats;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useFarmOverviewStore = create<FarmOverviewState>((set) => ({
  stats: {
    ponedoras: { actives: 0, investment: 0 },
    levantes: { actives: 0, investment: 0 },
    engorde: { actives: 0, investment: 0 },
  },
  isLoading: false,
  error: null,
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const [lotesPonedoras, lotesLevantes, lotesEngorde] = await Promise.all([
        obtenerLotesPonedoras({ status: EstadoLote.ACTIVO }),
        obtenerLotesLevantes({ status: EstadoLote.ACTIVO }),
        obtenerLotesEngorde({ status: EstadoLote.ACTIVO }),
      ]);

      const calcularInversion = async (lotes: any[], tipo: TipoAve) => {
        const inversiones = await Promise.all(
          lotes.map(async (lote) => {
            const gastosTotal = await calcularCostoProduccionUnitario(lote.id, tipo);
            return (lote.costo || 0) + gastosTotal;
          })
        );
        return inversiones.reduce((sum, current) => sum + current, 0);
      };

      const [invPonedoras, invLevantes, invEngorde] = await Promise.all([
        calcularInversion(lotesPonedoras, TipoAve.PONEDORA),
        calcularInversion(lotesLevantes, TipoAve.POLLO_LEVANTE),
        calcularInversion(lotesEngorde, TipoAve.POLLO_ENGORDE),
      ]);

      set({
        stats: {
          ponedoras: { actives: lotesPonedoras.length, investment: invPonedoras },
          levantes: { actives: lotesLevantes.length, investment: invLevantes },
          engorde: { actives: lotesEngorde.length, investment: invEngorde },
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));



