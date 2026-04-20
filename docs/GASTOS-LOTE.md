# Flujo de gastos por lote (Gallinapp)

## Fuente de verdad

- **Colección:** `farms/{farmId}/gastos` (ver `FARM_COLLECTIONS.GASTOS`).
- Cada movimiento lleva **`loteId`** y **`tipoLote`** (`TipoAve`: ponedora, levante, engorde).
- Lectura unificada: `obtenerGastosParaLote` / `obtenerGastos` en `gastos.service.ts` y `gastos-lote-base.service.ts`.

## Alta de un gasto

1. **Desde la app (artículo / inventario):** pantalla `gastos/nuevo-gasto` → `useGastosStore.registrarGasto` → `registrarGasto` en `gastos.service.ts` (misma colección, con `loteId` + `tipoLote`).
2. **Al crear un lote** (`crearLotePonedora` / `crearLoteEngorde` / `crearLoteLevante`): si `lote.costo > 0`, se crea además un movimiento con **`articuloId: 'costo-inicial'`** y texto tipo “Costo inicial del lote”. Eso **copia el importe** que ya está en el documento del lote (`lote.costo`).

## Inversión total (sin duplicar)

El **costo inicial** puede estar en **dos sitios**:

1. Campo **`lote.costo`** en el documento del lote.
2. Un **movimiento** en `gastos` (línea sintética `costo-inicial`).

Si sumamos **`lote.costo + todos los movimientos`**, se **duplica** el costo inicial para lotes creados con flujo nuevo.

**Regla implementada** en `calcularInversionYLoteGastos` (`gastos-lote-base.service.ts`):

- Si existe al menos un movimiento de **costo inicial sintético** (`articuloId === 'costo-inicial'` o texto “costo inicial” en nombre/descripción), la **inversión total** es la **suma de todos los movimientos** en `gastos` (ya incluye el costo inicial como línea).
- Si **no** existe esa línea (datos antiguos o solo `lote.costo`), la inversión es **`lote.costo + suma de movimientos`**.

Misma lógica se usa en:

- Estadísticas de ponedoras / engorde.
- `calcularCostoProduccionUnitario` (inversión del lote) y **GranjaLanding** (totales por módulo).
- **Web** `apps/web/src/services/gastos.service.ts` + `farmOverviewStore` (misma fórmula).

## Tab “Gastos” en detalle de lote

Muchas pantallas **filtran** la línea de “costo inicial” para mostrar **solo gastos adicionales** en listados, pero el **total coherente con inversión** debe usar la función anterior, no `lote.costo + sum(gastos)` a ciegas.

## Resumen

| Concepto | Significado |
|----------|-------------|
| **Suma de movimientos** | Suma de `total` de todos los documentos en `gastos` para ese lote (incluye la línea costo-inicial si existe). |
| **`lote.costo`** | Costo inicial guardado en el lote. |
| **Inversión total** | Ver regla arriba: evita contar dos veces el costo inicial. |
