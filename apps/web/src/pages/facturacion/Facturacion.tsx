import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Container } from "@/components/layout/Container"
import { SectionHeader } from "@/components/layout/SectionHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Receipt, FileText, ArrowLeft, Search, User, CreditCard, 
  TrendingUp, DollarSign, Activity, Check, MousePointer2,
  Zap, Sparkles, Filter, ChevronRight, Smartphone, ShieldCheck,
  BarChart3, Layers, ShoppingBag, Download, Printer, QrCode, Star
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { useState } from "react"
import { cn } from "@/lib/utils"

// --- Componentes del Simulador ---

const MobileFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative mx-auto w-[320px] h-[640px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10 shrink-0">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-50"></div>
    <div className="h-full w-full bg-slate-50 overflow-hidden flex flex-col relative">
      <div className="h-10 bg-white flex items-center justify-between px-6 pt-4 shrink-0 shadow-sm">
        <span className="text-[10px] font-bold">15:45</span>
        <div className="flex gap-1 items-center">
          <ShieldCheck className="w-3 h-3 text-brand-primary" />
          <div className="w-4 h-2 border border-slate-800 rounded-[2px] relative">
            <div className="absolute inset-0.5 bg-slate-800 rounded-[1px] w-[95%]" />
          </div>
        </div>
      </div>
      {children}
    </div>
  </div>
)

export default function Facturacion() {
  const [demoStep, setDemoStep] = useState<'list' | 'detail'>('list')
  const [selectedFactura, setSelectedFactura] = useState<any>(null)

  const facturasMock = [
    { id: '1', numero: 'B0100000123', fecha: '01 Ene 2026', cliente: 'Juan Pérez', total: 350.00, estado: 'EMITIDA' },
    { id: '2', numero: 'B0100000124', fecha: '01 Ene 2026', cliente: 'Agropecuaria Central', total: 12500.00, estado: 'EMITIDA' },
    { id: '3', numero: 'B0100000125', fecha: '02 Ene 2026', cliente: 'Mercado Local', total: 4500.00, estado: 'ANULADA' },
  ]

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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-black uppercase tracking-widest border border-brand-primary/20 mb-6">
                <Star className="w-3.5 h-3.5 fill-brand-primary" />
                Control Fiscal GallinApp Pro
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-stripe-heading mb-6 tracking-tight leading-tight">
                Facturación Legal y <span className="text-brand-primary">Control Fiscal</span>
              </h1>
              <p className="text-xl text-stripe-muted mb-10 leading-relaxed">
                Cumple con tus obligaciones tributarias sin esfuerzo. Emite comprobantes fiscales, gestiona NCF y genera reportes para tu contabilidad en segundos.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-premium hover:scale-105 transition-transform bg-brand-primary text-white border-none cursor-pointer" asChild>
                  <Link to="/auth/signup">Obtener GallinApp Pro</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-semibold border-stripe-border hover:bg-stripe-canvas cursor-pointer" onClick={() => {
                  document.getElementById('simulador-facturacion')?.scrollIntoView({ behavior: 'smooth' })
                }}>
                  Ver Modelo de Factura
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Simulador de Facturación */}
          <div id="simulador-facturacion" className="scroll-mt-24 mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start lg:items-center">
            
            {/* Mockup Móvil */}
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
              
              <MobileFrame>
                <AnimatePresence mode="wait">
                  
                  {/* PANTALLA: LISTADO DE FACTURAS */}
                  {demoStep === 'list' && (
                    <motion.div 
                      key="list"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col bg-slate-50"
                    >
                      <div className="p-4 bg-white border-b border-slate-200">
                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Facturación Pro</h2>
                        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                          <span className="px-3 py-1 bg-slate-800 text-white text-[9px] font-bold rounded-full whitespace-nowrap">Todas</span>
                          <span className="px-3 py-1 bg-white border border-slate-200 text-slate-500 text-[9px] font-bold rounded-full whitespace-nowrap">Emitidas</span>
                          <span className="px-3 py-1 bg-white border border-slate-200 text-slate-500 text-[9px] font-bold rounded-full whitespace-nowrap">Anuladas</span>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3 flex-1 overflow-y-auto no-scrollbar">
                        {facturasMock.map(fac => (
                          <div key={fac.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2 group hover:border-brand-primary/30 transition-all cursor-pointer" onClick={() => { setSelectedFactura(fac); setDemoStep('detail'); }}>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-[11px] font-black text-brand-primary mb-0.5">{fac.numero}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">{fac.fecha}</p>
                              </div>
                              <div className={cn(
                                "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                                fac.estado === 'EMITIDA' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                              )}>
                                {fac.estado}
                              </div>
                            </div>
                            <div className="flex justify-between items-end mt-1">
                              <p className="text-[11px] font-bold text-slate-800">{fac.cliente}</p>
                              <p className="text-sm font-black text-slate-800">${fac.total.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* PANTALLA: DETALLE DE FACTURA */}
                  {demoStep === 'detail' && (
                    <motion.div 
                      key="detail"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex-1 flex flex-col bg-white"
                    >
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                        <div className="flex items-center gap-3">
                          <ArrowLeft className="w-4 h-4 text-slate-400 cursor-pointer" onClick={() => setDemoStep('list')} />
                          <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Comprobante</h2>
                        </div>
                        <div className="flex gap-2">
                          <Printer className="w-3.5 h-3.5 text-slate-400" />
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                        {/* Header de Factura Realista */}
                        <div className="text-center border-b border-slate-100 pb-6">
                          <div className="w-10 h-10 bg-brand-primary rounded-xl mx-auto mb-3 flex items-center justify-center text-white">
                            <Zap className="w-6 h-6 fill-white" />
                          </div>
                          <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">Granja El Paraíso</h3>
                          <p className="text-[8px] text-slate-400 font-bold mt-1 uppercase">RNC: 131-00000-1 · Tel: (809) 555-0123</p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase">Facturado a:</p>
                              <p className="text-[10px] font-bold text-slate-800">{selectedFactura?.cliente}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[8px] font-black text-slate-400 uppercase">No. Comprobante:</p>
                              <p className="text-[10px] font-black text-brand-primary">{selectedFactura?.numero}</p>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-slate-500">Cartón de Huevos (x1)</span>
                              <span className="font-bold text-slate-800">$350.00</span>
                            </div>
                            <div className="border-t border-slate-200 pt-2 flex justify-between text-xs font-black">
                              <span className="text-slate-800">TOTAL RD$</span>
                              <span className="text-brand-primary">${selectedFactura?.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 pt-4 opacity-50">
                          <QrCode className="w-16 h-16 text-slate-800" />
                          <p className="text-[7px] font-bold text-slate-400 uppercase text-center leading-relaxed">
                            Válido para crédito fiscal · Generado por GallinApp Pro<br/>
                            Código de Verificación: 9A2B-4C8D-1E0F
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </MobileFrame>
            </div>

            {/* Narrativa y Guía */}
            <div className="order-1 lg:order-2 space-y-8 lg:pl-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest border border-brand-primary/20">
                <FileText className="w-3.5 h-3.5 fill-brand-primary" />
                Gestión Administrativa Pro
              </div>
              
              <div className="space-y-10">
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-xl bg-brand-primary flex items-center justify-center text-xs text-white font-black shadow-lg shadow-brand-primary/30">1</div>
                  <h4 className="text-xl font-bold text-stripe-heading mb-2">Comprobantes Fiscales (NCF)</h4>
                  <p className="text-stripe-muted leading-relaxed text-sm">
                    Configura tu numeración fiscal y GallinApp asignará los NCF automáticamente a cada venta. Soporte completo para Facturas de Crédito Fiscal, Consumo y más.
                  </p>
                </div>

                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-xs text-white font-black shadow-lg shadow-slate-800/30">2</div>
                  <h4 className="text-xl font-bold text-stripe-heading mb-2">Historial Centralizado</h4>
                  <p className="text-stripe-muted leading-relaxed text-sm">
                    Accede a todas tus facturas desde cualquier dispositivo. Filtra por estado, fecha o cliente y descarga copias en PDF en cualquier momento.
                  </p>
                </div>

                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-xl bg-amber-500 flex items-center justify-center text-xs text-white font-black shadow-lg shadow-amber-500/30">3</div>
                  <h4 className="text-xl font-bold text-stripe-heading mb-2">Reportes para Contabilidad</h4>
                  <p className="text-stripe-muted leading-relaxed text-sm">
                    Exporta tus ventas en formatos compatibles con herramientas de contabilidad o directamente para reportar a la oficina tributaria.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex gap-4 items-start shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-emerald-900 uppercase tracking-tight">100% Legal y Seguro</p>
                  <p className="text-xs text-emerald-800 font-medium">Tus datos fiscales están encriptados y protegidos bajo los más altos estándares de seguridad bancaria.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Características Adicionales */}
          <div className="mt-24 bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-white/10 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <SectionHeader
              title="Más que solo facturas"
              subtitle="Herramientas profesionales para que te enfoques en producir, nosotros nos encargamos del papeleo."
              align="center"
              className="mb-16"
              dark={true}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {[
                { title: "Envío por Email/WhatsApp", description: "Envía los recibos a tus clientes al instante desde la App.", icon: Smartphone },
                { title: "Gestión de Cobros", description: "Seguimiento de facturas pendientes y recordatorios de pago.", icon: DollarSign },
                { title: "Analítica Fiscal", description: "Gráficos de impuestos retenidos y ventas netas mensuales.", icon: BarChart3 }
              ].map((feat, i) => (
                <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center mb-6">
                    <feat.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold mb-3 text-lg text-white">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-32 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-stripe-heading tracking-tight leading-tight">Profesionaliza tu administración hoy mismo</h2>
            <p className="text-xl text-stripe-muted mb-12 font-medium leading-relaxed">
              Únete a los productores que ya están ahorrando horas de trabajo administrativo con GallinApp Pro.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button size="lg" className="h-16 px-12 text-xl font-black bg-brand-primary text-white rounded-2xl shadow-xl shadow-brand-primary/20 hover:scale-105 transition-transform border-none cursor-pointer" asChild>
                <Link to="/auth/signup">PROBAR GRATIS POR 14 DÍAS</Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}


