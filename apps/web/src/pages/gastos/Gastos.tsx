import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Container } from "@/components/layout/Container"
import { SectionHeader } from "@/components/layout/SectionHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Receipt, Plus, ArrowLeft, Search, Package, ShoppingCart, 
  TrendingDown, DollarSign, Activity, Check, MousePointer2,
  Zap, Sparkles, Filter, ChevronRight, Smartphone, ShieldCheck,
  BarChart3, Layers, History as HistoryIcon
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"

// --- Componentes del Simulador ---

const MobileFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative mx-auto w-[320px] h-[640px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10 shrink-0">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-50"></div>
    <div className="h-full w-full bg-slate-50 overflow-hidden flex flex-col relative">
      <div className="h-10 bg-white flex items-center justify-between px-6 pt-4 shrink-0 shadow-sm">
        <span className="text-[10px] font-bold">10:30</span>
        <div className="flex gap-1 items-center">
          <Activity className="w-3 h-3 text-brand-primary" />
          <div className="w-4 h-2 border border-slate-800 rounded-[2px] relative">
            <div className="absolute inset-0.5 bg-slate-800 rounded-[1px] w-[85%]" />
          </div>
        </div>
      </div>
      {children}
    </div>
  </div>
)

export default function Gastos() {
  const [demoStep, setDemoStep] = useState<'inventory' | 'add-item' | 'assign-lot' | 'success'>('inventory')
  
  // Estado mock para artículos e inventario
  const [items, setItems] = useState([
    { id: 1, nombre: 'Maíz Amarillo', categoria: 'Alimento', precio: 45.00, unidad: 'kg' },
    { id: 2, nombre: 'Vacuna Newcastle', categoria: 'Medicina', precio: 120.00, unidad: 'un' },
  ])

  const [newItem, setNewItem] = useState({ nombre: '', categoria: 'Alimento', precio: '' })
  const [assignment, setAssign] = useState({ lote: 'Lote 01 - Ponedoras', cantidad: '50' })

  const totalGasto = useMemo(() => {
    const p = parseFloat(items[0].precio.toString())
    const c = parseFloat(assignment.cantidad)
    return p * c
  }, [assignment.cantidad])

  return (
    <div className="min-h-screen bg-stripe-canvas">
      <Header />
      
      <main className="pt-24 pb-20">
        <Container>
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-stripe-heading mb-6 tracking-tight leading-tight">
                Control de <span className="text-brand-primary">Gastos e Inventario</span>
              </h1>
              <p className="text-xl text-stripe-muted mb-10 leading-relaxed">
                Gestiona tus insumos con precisión quirúrgica. Registra artículos, controla tu stock y asigna gastos a tus lotes para conocer tu rentabilidad real al centavo.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-premium hover:scale-105 transition-transform bg-brand-primary text-white border-none cursor-pointer" asChild>
                  <Link to="/auth/signup">Empieza a Ahorrar Hoy</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-semibold border-stripe-border hover:bg-stripe-canvas cursor-pointer" onClick={() => {
                  document.getElementById('simulador-gastos')?.scrollIntoView({ behavior: 'smooth' })
                }}>
                  Ver Cómo Funciona
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Simulador de Gastos */}
          <div id="simulador-gastos" className="scroll-mt-24 mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start lg:items-center">
            
            {/* Mockup Móvil */}
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
              
              <MobileFrame>
                <AnimatePresence mode="wait">
                  
                  {/* PANTALLA: INVENTARIO (LISTA DE ARTÍCULOS) */}
                  {demoStep === 'inventory' && (
                    <motion.div 
                      key="inventory"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col bg-slate-50"
                    >
                      <div className="p-4 bg-white border-b border-slate-200">
                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Inventario</h2>
                        <div className="mt-3 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input disabled placeholder="Buscar insumo..." className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-[10px] outline-none border-none font-medium" />
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3 flex-1 overflow-y-auto no-scrollbar">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Artículos Registrados</p>
                        {items.map(item => (
                          <div key={item.id} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-brand-primary/30 transition-all cursor-pointer" onClick={() => setDemoStep('assign-lot')}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                                {item.categoria === 'Alimento' ? <Package className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                              </div>
                              <div>
                                <p className="text-[11px] font-bold text-slate-800 leading-none mb-1">{item.nombre}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">${item.precio} / {item.unidad}</p>
                              </div>
                            </div>
                            <Plus className="w-4 h-4 text-slate-300 group-hover:text-brand-primary transition-colors" />
                          </div>
                        ))}
                      </div>

                      <div className="p-4 bg-white border-t border-slate-100">
                        <Button 
                          className="w-full bg-slate-800 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex gap-2 items-center justify-center"
                          onClick={() => setDemoStep('add-item')}
                        >
                          <Plus className="w-4 h-4" /> Nuevo Artículo
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* PANTALLA: AGREGAR ARTÍCULO */}
                  {demoStep === 'add-item' && (
                    <motion.div 
                      key="add-item"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col bg-white"
                    >
                      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                        <ArrowLeft className="w-4 h-4 text-slate-400 cursor-pointer" onClick={() => setDemoStep('inventory')} />
                        <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Nuevo Insumo</h2>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Nombre del Artículo</label>
                          <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary font-medium" placeholder="Ej: Concentrado Ponedora" value={newItem.nombre} onChange={e => setNewItem({...newItem, nombre: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Categoría</label>
                          <div className="grid grid-cols-2 gap-2">
                            {['Alimento', 'Medicina'].map(cat => (
                              <button key={cat} onClick={() => setNewItem({...newItem, categoria: cat})} className={cn("p-3 rounded-xl border text-[10px] font-bold uppercase transition-all", newItem.categoria === cat ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200")}>{cat}</button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Precio Unitario ($)</label>
                          <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary font-bold" placeholder="0.00" value={newItem.precio} onChange={e => setNewItem({...newItem, precio: e.target.value})} />
                        </div>
                        <Button 
                          className="w-full bg-brand-primary h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-white mt-4 shadow-lg shadow-brand-primary/20"
                          onClick={() => {
                            if(newItem.nombre && newItem.precio) {
                              setItems([...items, { id: Date.now(), ...newItem, precio: parseFloat(newItem.precio), unidad: 'kg' }])
                              setDemoStep('inventory')
                              setNewItem({ nombre: '', categoria: 'Alimento', precio: '' })
                            }
                          }}
                        >
                          Guardar en Inventario
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* PANTALLA: ASIGNAR GASTO A LOTE */}
                  {demoStep === 'assign-lot' && (
                    <motion.div 
                      key="assign-lot"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex-1 flex flex-col bg-white"
                    >
                      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                        <ArrowLeft className="w-4 h-4 text-slate-400 cursor-pointer" onClick={() => setDemoStep('inventory')} />
                        <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Registrar Gasto</h2>
                      </div>
                      <div className="p-4 space-y-5">
                        <div className="flex items-center gap-4 p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                            <Package className="w-6 h-6 text-brand-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">{items[0].nombre}</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Inventario actual: 500kg</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Seleccionar Lote Destino</label>
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex justify-between items-center">
                            {assignment.lote}
                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cantidad a Consumir ({items[0].unidad})</label>
                          <input 
                            type="number"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-primary font-black text-slate-800" 
                            value={assignment.cantidad}
                            onChange={e => setAssign({...assignment, cantidad: e.target.value})}
                          />
                        </div>

                        <div className="pt-4 border-t border-slate-100 space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
                            <span>Subtotal</span>
                            <span>${totalGasto.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-black uppercase text-slate-800">
                            <span>Gasto Total</span>
                            <span className="text-brand-primary text-lg">${totalGasto.toLocaleString()}</span>
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-brand-primary h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-brand-primary/20"
                          onClick={() => setDemoStep('success')}
                        >
                          Confirmar Gasto
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* PANTALLA: ÉXITO */}
                  {demoStep === 'success' && (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex-1 flex flex-col items-center justify-center p-8 bg-white"
                    >
                      <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
                        <Check className="w-10 h-10 text-white stroke-[4px]" />
                      </div>
                      <h3 className="text-base font-black text-slate-800 mb-2 uppercase tracking-tight">Gasto Registrado</h3>
                      <p className="text-[10px] text-slate-500 text-center leading-relaxed mb-8">
                        El gasto de **${totalGasto.toLocaleString()}** ha sido aplicado al **{assignment.lote}**. 
                        Tu costo de producción se ha actualizado automáticamente.
                      </p>
                      <Button 
                        className="w-full bg-slate-800 rounded-xl font-bold py-4 text-white text-[10px] uppercase tracking-widest"
                        onClick={() => {
                          setDemoStep('inventory')
                          setAssign({...assignment, cantidad: '50'})
                        }}
                      >
                        Volver al Inventario
                      </Button>
                    </motion.div>
                  )}

                </AnimatePresence>
              </MobileFrame>
            </div>

            {/* Narrativa y Guía */}
            <div className="order-1 lg:order-2 space-y-8 lg:pl-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest border border-brand-primary/20">
                <ShoppingCart className="w-3.5 h-3.5 fill-brand-primary" />
                Módulo de Finanzas Pro
              </div>
              
              <div className="space-y-10">
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-xl bg-brand-primary flex items-center justify-center text-xs text-white font-black shadow-lg shadow-brand-primary/30">1</div>
                  <h4 className="text-xl font-bold text-stripe-heading mb-2">Inventario de Insumos</h4>
                  <p className="text-stripe-muted leading-relaxed text-sm">
                    Crea una base de datos de tus alimentos, vacunas y herramientas. GallinApp mantiene el precio unitario actualizado para tus futuros cálculos.
                  </p>
                </div>

                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-xs text-white font-black shadow-lg shadow-slate-800/30">2</div>
                  <h4 className="text-xl font-bold text-stripe-heading mb-2">Asignación Directa a Lotes</h4>
                  <p className="text-stripe-muted leading-relaxed text-sm">
                    No más hojas sueltas. Cuando un lote consume alimento, regístralo al instante. El sistema descuenta del inventario y suma al gasto del lote.
                  </p>
                </div>

                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-xl bg-emerald-500 flex items-center justify-center text-xs text-white font-black shadow-lg shadow-emerald-500/30">3</div>
                  <h4 className="text-xl font-bold text-stripe-heading mb-2">Análisis de Costo Real</h4>
                  <p className="text-stripe-muted leading-relaxed text-sm">
                    Cada gramo de alimento cuenta. GallinApp utiliza estos registros para darte el **Costo de Producción por ave/huevo** más exacto del mercado.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4 items-start shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-lg">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-amber-900 uppercase tracking-tight">Reduce Desperdicios</p>
                  <p className="text-xs text-amber-800 font-medium">Detecta consumos inusuales y optimiza tus compras de insumos basándote en historial real.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Características Adicionales de Finanzas */}
          <div className="mt-24">
            <SectionHeader
              title="Todo lo que necesitas para tus finanzas"
              subtitle="Herramientas diseñadas para que nunca pierdas el rastro de tu dinero."
              align="center"
              className="mb-16"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Historial de Gastos", description: "Filtra tus gastos por fecha, lote o categoría para auditorías rápidas.", icon: HistoryIcon },
                { title: "Reportes en PDF", description: "Genera estados financieros de tus lotes listos para imprimir o compartir.", icon: Receipt },
                { title: "Alertas de Insumos", description: "Notificaciones automáticas cuando tu stock de alimento esté por agotarse.", icon: Zap }
              ].map((feat, i) => (
                <Card key={i} className="border-stripe-border hover:shadow-premium transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 mb-4">
                      <feat.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{feat.title}</CardTitle>
                    <CardDescription>{feat.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Final */}
          <div className="mt-32 bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-3xl -mr-64 -mt-64 opacity-50"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight leading-tight italic italic">"Si no lo mides, no lo puedes mejorar."</h2>
              <p className="text-xl text-slate-400 mb-12 font-medium leading-relaxed">
                Empieza hoy a llevar un control financiero profesional de tu granja. Únete a GallinApp y maximiza tus ganancias.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button size="lg" className="h-16 px-12 text-xl font-black bg-brand-primary text-white rounded-2xl shadow-xl shadow-brand-primary/20 hover:scale-105 transition-transform border-none cursor-pointer" asChild>
                  <Link to="/auth/signup">REGISTRARME GRATIS</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
