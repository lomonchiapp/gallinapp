import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Container } from "@/components/layout/Container"
import { SectionHeader } from "@/components/layout/SectionHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Tags, Plus, ArrowLeft, Search, User, CreditCard, 
  TrendingUp, DollarSign, Activity, Check, MousePointer2,
  Zap, Sparkles, Filter, ChevronRight, Smartphone, ShieldCheck,
  BarChart3, Layers, ShoppingBag, Receipt, ArrowRight, Star
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
        <span className="text-[10px] font-bold">14:20</span>
        <div className="flex gap-1 items-center">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <div className="w-4 h-2 border border-slate-800 rounded-[2px] relative">
            <div className="absolute inset-0.5 bg-slate-800 rounded-[1px] w-[60%]" />
          </div>
        </div>
      </div>
      {children}
    </div>
  </div>
)

export default function Ventas() {
  const [demoStep, setDemoStep] = useState<'products' | 'client' | 'confirm' | 'success'>('products')
  
  // Estado mock para productos y carrito
  const [availableProducts] = useState([
    { id: 1, nombre: 'Cartón de Huevos (30 un)', precio: 350.00, stock: 150, unidad: 'un' },
    { id: 2, nombre: 'Gallina de Descarte', precio: 450.00, stock: 45, unidad: 'ave' },
  ])

  const [cart, setCart] = useState<{id: number, nombre: string, precio: number, cantidad: number}[]>([])
  const [selectedClient, setSelectedClient] = useState<{nombre: string, cedula: string} | null>(null)

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0), [cart])

  const addToCart = (product: any) => {
    setCart([{ ...product, cantidad: 1 }]) // Solo permitimos uno para la demo simple
    setDemoStep('client')
  }

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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 text-amber-600 rounded-full text-xs font-black uppercase tracking-widest border border-amber-500/20 mb-6">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                Característica GallinApp Pro
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-stripe-heading mb-6 tracking-tight leading-tight">
                Ventas Inteligentes y <span className="text-brand-primary">Débito Automático</span>
              </h1>
              <p className="text-xl text-stripe-muted mb-10 leading-relaxed">
                Transforma tu producción en ingresos con un solo toque. Vende tus productos, genera facturas profesionales y mantén tu inventario sincronizado automáticamente.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-premium hover:scale-105 transition-transform bg-brand-primary text-white border-none cursor-pointer" asChild>
                  <Link to="/auth/signup">Actualizar a Pro Gratis</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-semibold border-stripe-border hover:bg-stripe-canvas cursor-pointer" onClick={() => {
                  document.getElementById('simulador-ventas')?.scrollIntoView({ behavior: 'smooth' })
                }}>
                  Simular una Venta
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Simulador de Ventas */}
          <div id="simulador-ventas" className="scroll-mt-24 mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start lg:items-center">
            
            {/* Mockup Móvil */}
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
              
              <MobileFrame>
                <AnimatePresence mode="wait">
                  
                  {/* PANTALLA: SELECCIÓN DE PRODUCTOS */}
                  {demoStep === 'products' && (
                    <motion.div 
                      key="products"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col bg-slate-50"
                    >
                      <div className="p-4 bg-white border-b border-slate-200">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Nueva Venta</h2>
                          <div className="px-2 py-0.5 bg-amber-500 text-white text-[8px] font-black rounded uppercase">PRO</div>
                        </div>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input disabled placeholder="Buscar producto derivado..." className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-[10px] outline-none border-none font-medium" />
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3 flex-1 overflow-y-auto no-scrollbar">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Disponibles en Lote</p>
                        {availableProducts.map(prod => (
                          <div key={prod.id} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-brand-primary/30 transition-all cursor-pointer" onClick={() => addToCart(prod)}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                                {prod.id === 1 ? <ShoppingBag className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                              </div>
                              <div>
                                <p className="text-[11px] font-bold text-slate-800 leading-none mb-1">{prod.nombre}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Stock: {prod.stock} {prod.unidad}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[11px] font-black text-slate-800">${prod.precio.toFixed(2)}</p>
                              <Plus className="w-3 h-3 text-brand-primary ml-auto mt-1" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* PANTALLA: SELECCIÓN DE CLIENTE */}
                  {demoStep === 'client' && (
                    <motion.div 
                      key="client"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col bg-white"
                    >
                      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                        <ArrowLeft className="w-4 h-4 text-slate-400 cursor-pointer" onClick={() => setDemoStep('products')} />
                        <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Seleccionar Cliente</h2>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 group cursor-pointer hover:border-brand-primary/30" onClick={() => { setSelectedClient({nombre: 'Juan Pérez', cedula: '001-0000000-1'}); setDemoStep('confirm'); }}>
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[11px] font-bold text-slate-800">Juan Pérez</p>
                            <p className="text-[9px] text-slate-400">001-0000000-1</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        </div>

                        <div className="p-3 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:border-brand-primary/30 hover:text-brand-primary transition-colors cursor-pointer">
                          <Plus className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase">Nuevo Cliente</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* PANTALLA: CONFIRMACIÓN */}
                  {demoStep === 'confirm' && (
                    <motion.div 
                      key="confirm"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex-1 flex flex-col bg-white"
                    >
                      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                        <ArrowLeft className="w-4 h-4 text-slate-400 cursor-pointer" onClick={() => setDemoStep('client')} />
                        <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Resumen de Venta</h2>
                      </div>
                      <div className="p-4 space-y-5">
                        <div className="space-y-2">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cliente</p>
                          <p className="text-xs font-bold text-slate-800">{selectedClient?.nombre}</p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Productos</p>
                          <div className="flex justify-between items-center text-xs font-medium">
                            <span className="text-slate-600">{cart[0]?.nombre} (x1)</span>
                            <span className="font-bold text-slate-800">${cart[0]?.precio.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 space-y-2">
                          <div className="flex justify-between items-center text-xs font-black uppercase text-slate-800">
                            <span>Total a Cobrar</span>
                            <span className="text-brand-primary text-lg">${subtotal.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Método de Pago</p>
                          <div className="flex gap-2">
                            <div className="flex-1 p-2 bg-slate-800 text-white rounded-lg flex flex-col items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span className="text-[8px] font-bold uppercase">Efectivo</span>
                            </div>
                            <div className="flex-1 p-2 bg-slate-50 text-slate-400 border border-slate-200 rounded-lg flex flex-col items-center gap-1 opacity-50">
                              <CreditCard className="w-4 h-4" />
                              <span className="text-[8px] font-bold uppercase">Tarjeta</span>
                            </div>
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-brand-primary h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-brand-primary/20"
                          onClick={() => setDemoStep('success')}
                        >
                          Confirmar y Cobrar
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
                      <div className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center mb-6 shadow-xl shadow-brand-primary/20 animate-bounce">
                        <Check className="w-10 h-10 text-white stroke-[4px]" />
                      </div>
                      <h3 className="text-base font-black text-slate-800 mb-2 uppercase tracking-tight">Venta Exitosa</h3>
                      <p className="text-[10px] text-slate-500 text-center leading-relaxed mb-8">
                        Se ha debitado **1 unidad** del inventario automáticamente. El ingreso de **${subtotal.toFixed(2)}** ha sido registrado.
                      </p>
                      
                      <div className="w-full space-y-3">
                        <Button 
                          className="w-full bg-slate-800 rounded-xl font-bold py-4 text-white text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                          asChild
                        >
                          <Link to="/facturacion">
                            <Receipt className="w-4 h-4" /> Ver Factura Pro
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost"
                          className="w-full rounded-xl font-bold py-4 text-slate-400 text-[10px] uppercase tracking-widest"
                          onClick={() => {
                            setDemoStep('products')
                            setCart([])
                            setSelectedClient(null)
                          }}
                        >
                          Nueva Venta
                        </Button>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </MobileFrame>
            </div>

            {/* Narrativa y Guía */}
            <div className="order-1 lg:order-2 space-y-8 lg:pl-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest border border-brand-primary/20">
                <Zap className="w-3.5 h-3.5 fill-brand-primary" />
                Flujo Automatizado Pro
              </div>
              
              <div className="space-y-10">
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-xl bg-brand-primary flex items-center justify-center text-xs text-white font-black shadow-lg shadow-brand-primary/30">1</div>
                  <h4 className="text-xl font-bold text-stripe-heading mb-2">Inventario Sincronizado</h4>
                  <p className="text-stripe-muted leading-relaxed text-sm">
                    Al vender huevos o aves, GallinApp descuenta automáticamente del stock del lote correspondiente. Nunca más vendas lo que no tienes.
                  </p>
                </div>

                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-xs text-white font-black shadow-lg shadow-slate-800/30">2</div>
                  <h4 className="text-xl font-bold text-stripe-heading mb-2">Base de Datos de Clientes</h4>
                  <p className="text-stripe-muted leading-relaxed text-sm">
                    Gestiona tu cartera de clientes de forma profesional. Conoce quiénes son tus mejores compradores y sus historiales de pago.
                  </p>
                </div>

                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-xl bg-amber-500 flex items-center justify-center text-xs text-white font-black shadow-lg shadow-amber-500/30">3</div>
                  <h4 className="text-xl font-bold text-stripe-heading mb-2">Ingresos y Facturación</h4>
                  <p className="text-stripe-muted leading-relaxed text-sm">
                    Cada venta genera un asiento contable automático y un comprobante legal (Pro). El dinero entra al sistema listo para reportes financieros.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex gap-4 items-start shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-blue-900 uppercase tracking-tight">Análisis de Ventas</p>
                  <p className="text-xs text-blue-800 font-medium">Obtén gráficos de tus productos más vendidos y proyecciones de flujo de caja en tiempo real.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Value Propositions */}
          <div className="bg-stripe-canvas/40 rounded-[3rem] p-10 md:p-16 border border-stripe-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <SectionHeader
              title="¿Por qué actualizar a GallinApp Pro?"
              subtitle="El plan profesional diseñado para granjas que buscan escalar su rentabilidad."
              align="center"
              className="mb-16"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
              {[
                { title: "Módulo de Ventas", description: "Control total de salidas de productos y aves.", icon: ShoppingBag },
                { title: "Facturación Legal", description: "Emisión de comprobantes fiscales y recibos PDF.", icon: Receipt },
                { title: "Reportes Avanzados", description: "Balances, estados de resultados y rentabilidad por ave.", icon: BarChart3 }
              ].map((feat, index) => (
                <div key={index} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-premium flex items-center justify-center mb-6 text-brand-primary border border-stripe-border group-hover:scale-110 transition-transform duration-300">
                    <feat.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-stripe-heading mb-3 text-lg">{feat.title}</h3>
                  <p className="text-sm text-stripe-muted leading-relaxed font-medium">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Final */}
          <div className="mt-32 bg-amber-500 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -mr-64 -mt-64 blur-3xl animate-pulse"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black mb-8 text-white tracking-tight leading-tight">Escala tu granja al siguiente nivel</h2>
              <p className="text-xl text-white/90 mb-12 font-medium leading-relaxed">
                Empieza hoy con 14 días gratis de GallinApp Pro. Sin compromisos, sin tarjeta de crédito.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button size="lg" className="h-16 px-12 text-xl font-black hover:scale-105 transition-transform bg-white text-amber-600 rounded-2xl shadow-2xl cursor-pointer border-none" asChild>
                  <Link to="/auth/signup">PROBAR GALLINAPP PRO</Link>
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






