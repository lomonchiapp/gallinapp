import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Container } from "@/components/layout/Container"
import { SectionHeader } from "@/components/layout/SectionHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Egg, Leaf, Beef, ChevronRight, TrendingUp, DollarSign, Activity, CheckCircle2, 
  BarChart3, Smartphone, ShieldCheck, ArrowLeft, Plus, History as HistoryIcon, Scale, Users,
  Check, Info, MousePointer2, Sparkles, Zap, Calculator, LayoutGrid
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"

// --- Iconos Nativos Replicados de Mobile ---

const PonedoraIcon = ({ width = 24, height = 24, fill = "currentColor", className = "" }: any) => (
  <svg width={width} height={height} viewBox="0 0 512 512" fill="none" className={className}>
    <path
      d="M467.432,374.712c-3.59-19.061-13.062-33.15-25.987-38.655c-4.393-1.873-9.135-2.684-13.897-2.689c-3.906-0.004-7.824,0.532-11.576,1.47c11.906-22.092,19.282-46.384,21.602-71.593c6.56-16.267,10.181-34.022,10.181-52.61c0-4.305-3.49-7.795-7.795-7.795h-52.831c-4.305,0-7.795,3.49-7.795,7.795s3.49,7.795,7.795,7.795h44.797c-3.586,58.208-47.027,105.81-103.3,115.792c-7.246,1.286-14.622,1.933-21.98,1.933h-39.917c-32.457,0-58.862-26.406-58.862-58.862c0-32.456,26.406-58.862,58.862-58.862h16.951h72.27c4.305,0,7.795-3.49,7.795-7.795s-3.49-7.795-7.795-7.795h-69.084c-7.435-8.256-12.844-25.099-18.543-42.858c-4.258-13.267-8.909-27.755-15.171-41.025c11.155-3.22,20.667-11.167,25.874-18.967c6.076-9.102,7.324-18.784,3.424-26.564c-2.409-4.807-7.591-10.435-18.68-13.377c1.652-5.152,1.315-10.648-1.214-15.828c-4.848-9.932-18.764-19.484-42.84-17.699c0.038-0.37,0.077-0.741,0.098-1.112c0.332-5.786-1.276-14.05-10.817-20.551c-9.145-6.233-21.832-6.475-35.724-0.684c-7.061,2.945-14.072,7.291-20.836,12.919c-3.309,2.753-3.76,7.668-1.006,10.979c2.752,3.309,7.668,3.76,10.978,1.006c5.567-4.632,11.241-8.169,16.865-10.514c5.132-2.14,14.678-5.092,20.944-0.822c3.748,2.555,4.141,4.859,4.032,6.777c-0.329,5.759-8.645,18.241-20.924,24.691c-3.811,2.002-5.278,6.714-3.276,10.526c1.395,2.654,4.103,4.172,6.908,4.172c1.221,0,2.462-0.288,3.618-0.896c7.126-3.744,16.189-11.116,22.331-19.912c21.345-3.836,32.976,2.504,35.641,7.961c1.812,3.71-0.671,6.884-3.08,8.898c-1.821,1.527-4.194,2.874-7.054,4.004c-4.005,1.581-5.968,6.109-4.386,10.113c1.211,3.064,4.146,4.934,7.253,4.934c0.953,0,1.922-0.176,2.861-0.547c3.226-1.274,6.126-2.796,8.665-4.535c8.25,0.806,14.042,3.163,15.708,6.486c1.299,2.591,0.381,6.674-2.454,10.921c-4.09,6.127-12.314,12.302-20.693,13.36c-0.565-0.889-1.134-1.775-1.723-2.64c-14.021-20.598-32.161-30.612-55.456-30.612c-22.408,0-42.174,5.36-59.147,15.971c2.005-10.919,5.747-21.472,11.11-31.136c2.089-3.765,0.732-8.51-3.033-10.598c-3.766-2.089-8.51-0.731-10.598,3.033c-8.818,15.89-13.857,33.846-14.662,52.139c-2.888,2.778-5.664,5.764-8.338,8.934c-11.68,0.041-39.131,2.297-49.844,21.713c-0.577,1.047-0.906,2.211-0.961,3.405c-0.059,1.289-1.093,29.248,17.928,42.977c-3.75,14.869-5.795,29.107-6.882,41.105c-0.389,4.287,2.772,8.078,7.06,8.467c4.275,0.388,8.078-2.772,8.467-7.06c1.518-16.764,4.304-31.224,7.761-43.633c0.05-0.146,0.106-0.288,0.148-0.437c2.991-10.664,6.823-21.128,11.76-31.051c0.049-0.099,0.099-0.197,0.149-0.296c17.607-35.211,49.082-57.938,89.084-57.938c21.936,0,35.684,11.687,45.643,28.481c0.282,0.694,0.661,1.34,1.122,1.921c7.758,13.766,13.181,30.661,18.525,47.312c4.669,14.55,8.923,27.807,14.573,38.094h-1.321c-41.054,0-74.453,33.4-74.453,74.454c0,20.862,8.989,41.062,24.419,55.088c13.61,12.373,31.638,19.364,50.034,19.364h39.917c7.121,0,14.211-0.58,21.255-1.601c0.106-0.016,0.213-0.031,0.319-0.048c33.104-5.064,62.96-21.634,84.631-46.436c-5.836,16.388-14.172,31.871-24.793,45.928c-6.285,5.16-12.206,11.406-17.454,18.54c-19.953-10.162-43.441,1.972-58.464,15.406c-3.755,3.358-7.2,7.017-10.443,10.867c-0.411,0.495-0.823,0.985-1.226,1.489c-10.126-20.173-25.783-33.324-41.943-34.575c-0.141-0.011-0.284-0.022-0.425-0.031c-20.054-1.364-35.936,15.422-44.911,31.474c-0.021,0.037-0.042,0.076-0.062,0.113c-0.528,0.96-1.047,1.934-1.549,2.93c-0.015,0.029-0.031,0.057-0.046,0.086c-13.038-16.287-33.113-31.779-55.021-31.362c-5.2,0.099-10.46,1.238-15.111,3.601c-10.397-14.134-23.429-24.797-36.721-30.391c-16.475-26.072-25.619-56.126-26.472-87.087c-0.117-4.303-3.721-7.696-8.006-7.578c-4.304,0.119-7.696,3.703-7.578,8.007c0.794,28.842,8.209,56.956,21.549,82.271c-22.988,0.157-35.77,21.002-39.604,41.359c-3.563,18.919-0.932,40.125,7.409,59.711c12.079,28.366,32.825,44.634,56.918,44.634c6.983,0,13.834-1.391,20.37-4.118c12.392,22.566,31.077,35.299,52.385,35.299c13.354,0,26.543-5.264,36.273-14.395C228.356,506.814,242.207,512,256,512c12.508,0,26.977-4.664,38.031-16.203c4.507,4.24,9.766,7.7,15.578,10.175c6.545,2.788,13.642,4.312,20.89,4.311c18.784-0.002,38.562-10.262,52.25-35.34c6.531,2.724,13.377,4.113,20.361,4.114c24.088,0,44.834-16.27,56.913-44.634C468.363,414.837,470.995,393.631,467.432,374.712z"
      fill={fill}
    />
  </svg>
)

const LevanteIcon = ({ width = 24, height = 24, fill = "currentColor", className = "" }: any) => (
  <svg width={width} height={height} viewBox="0 0 512 512" fill="none" className={className}>
    <path
      d="M436.094,282.012l-1.166-26.645l-36.376,35.064l-25.499-24.586c-3.086-14.887-6.747-28.837-10.301-41.298c-3.725-13.088-7.31-24.568-9.939-33.69c3.82-5.017,7.266-10.332,10.269-15.939c7.076-2.337,39.867-13.05,54.476-15.97c-9.066-24.175-36.167-37.225-40.475-39.17c0-0.291,0.02-0.577,0.02-0.874c0.006-16.382-3.332-32.055-9.351-46.29c-9.033-21.349-24.092-39.48-43.065-52.302C305.724,7.494,282.778-0.006,258.199,0c-16.389,0-32.056,3.326-46.291,9.35c-21.349,9.034-39.486,24.092-52.302,43.066c-12.822,18.961-20.323,41.9-20.316,66.486c-0.006,21.546,5.79,41.806,15.831,59.233L131.39,274.08l-16.953,16.345l-37.244-35.92l-1.235,26.55c-0.247,5.309-0.393,10.681-0.393,16.142c0,37.275,5.543,69.407,15.432,96.679c7.412,20.45,17.264,38.15,28.964,53.138c17.548,22.496,39.22,38.834,62.654,49.439C206.048,507.065,231.211,512,256,512c22.039,0,44.358-3.896,65.517-12.22c15.863-6.24,31.054-14.976,44.884-26.379c20.754-17.098,38.391-40.221,50.694-69.527c12.315-29.313,19.34-64.744,19.34-106.676C436.435,292.066,436.309,287.01,436.094,282.012z M178.142,169.736c-9.363-14.716-14.786-32.087-14.798-50.833c0.007-13.126,2.66-25.574,7.456-36.914c7.19-17.003,19.233-31.51,34.374-41.742c15.154-10.224,33.335-16.186,53.025-16.193c13.126,0.007,25.568,2.655,36.914,7.451c17.003,7.19,31.51,19.233,41.742,34.38c10.231,15.154,16.186,33.336,16.186,53.018c-0.006,23.49-8.508,44.866-22.635,61.463l-4.105,4.814l1.641,6.113c2.902,10.732,7.228,24.219,11.675,39.841c1.78,6.246,3.573,12.848,5.303,19.696l-41.076,39.594l-47.355-45.664l-47.354,45.664l-46.024-44.377l17.795-71.966L178.142,169.736z M398.381,385.679c-6.601,18.213-15.236,33.62-25.315,46.537c-15.128,19.372-33.525,33.215-53.608,42.318c-20.076,9.098-41.855,13.412-63.458,13.412c-19.202,0-38.556-3.408-56.712-10.548c-13.614-5.365-26.576-12.822-38.391-22.559c-17.706-14.621-32.904-34.362-43.813-60.285c-9.705-23.091-15.958-51.149-17.219-84.75l14.571,14.051l31.935-30.802l4.808,1.191l1.894-7.659l8.704-8.4l47.354,45.663l47.354-45.663l47.355,45.663l47.164-45.479c0.292,1.546,0.589,3.091,0.862,4.65l3.674-0.646l43.009,41.476l8.35-8.052l5.201-5.011C410.924,339.775,406.015,364.621,398.381,385.679z"
      fill={fill}
    />
    <path
      d="M265.484,135.906c12.074,0,21.862-9.788,21.862-21.862s-9.788-21.856-21.862-21.856c-12.069,0-21.862,9.781-21.862,21.856S253.415,135.906,265.484,135.906z"
      fill={fill}
    />
  </svg>
)

const EngordeIcon = ({ width = 24, height = 24, fill = "currentColor", className = "" }: any) => (
  <svg width={width} height={height} viewBox="0 0 70 70" fill="none" className={className}>
    <path
      d="M62.131,8.45c-3.445-3.446-8.139-5.344-13.215-5.344c-5.678,0-11.348,2.413-15.554,6.619C26.787,16.3,19.139,31.689,20.874,41.44l-7.891,7.891c-2.729-1.6-6.083-1.244-8.414,1.086c-2.717,2.717-2.726,7.131-0.02,9.84c0.886,0.885,1.969,1.506,3.15,1.814c0.316,1.184,0.941,1.927,1.815,2.8c1.315,1.314,3.067,1.712,4.933,1.712c0.016,0,0.031,0,0.047,0c1.861,0,3.604-0.372,4.91-1.677c2.08-2.08,2.486-5.259,1.21-7.813l7.712-7.619c1.149,0.281,2.419,0.469,3.802,0.469c9.404,0,22.688-6.707,28.727-12.747c3.987-3.986,6.328-9.143,6.594-14.54C67.719,17.186,65.829,12.148,62.131,8.45z M16.605,55.63c-0.781,0.779-0.781,2.047-0.001,2.828c0.911,0.91,1.098,2.842-0.027,3.965c-0.555,0.557-1.312,0.869-2.103,0.854c-0.807-0.006-1.563-0.32-2.131-0.889c-0.558-0.557-0.878-1.324-0.88-2.105c-0.003-1.102-0.896-1.992-1.997-1.994c-0.79-0.002-1.532-0.309-2.089-0.865c-1.146-1.146-1.138-3.021,0.02-4.178c1.236-1.238,3.025-1.176,4.35,0.148c0.375,0.375,0.884,0.586,1.414,0.586s1.039-0.211,1.414-0.586l7.848-7.846c0.337,0.52,0.716,1.01,1.158,1.451c0.276,0.277,0.575,0.531,0.887,0.77L16.605,55.63z M63.454,22.471c-0.217,4.403-2.144,8.636-5.427,11.919c-5.475,5.474-17.714,11.597-25.898,11.597c-2.59,0-4.515-0.611-5.72-1.816c-5.414-5.416,2.362-24.198,9.781-31.618c3.462-3.462,8.101-5.447,12.726-5.447c4.008,0,7.696,1.481,10.387,4.172C62.192,14.167,63.667,18.143,63.454,22.471z"
      fill={fill}
    />
    <path
      d="M54.475,11.944c-0.491-0.249-1.095-0.05-1.344,0.441c-0.249,0.493-0.051,1.095,0.441,1.344c0.921,0.465,1.757,1.069,2.483,1.796c0.195,0.195,0.451,0.293,0.707,0.293s0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414C56.593,13.234,55.585,12.504,54.475,11.944z"
      fill={fill}
    />
    <path
      d="M47.407,10.729c-3.204,0.358-6.274,1.861-8.645,4.232c-2.686,2.685-5.54,7.548-7.104,12.104c-0.179,0.522,0.1,1.091,0.622,1.271c0.107,0.036,0.217,0.054,0.324,0.054c0.415,0,0.804-0.261,0.946-0.676c1.473-4.293,4.136-8.849,6.625-11.338c2.051-2.052,4.697-3.351,7.453-3.658c0.549-0.062,0.943-0.557,0.883-1.105C48.451,11.064,47.961,10.667,47.407,10.729z"
      fill={fill}
    />
    <path
      d="M9.724,52.583c-0.004,0-0.008,0-0.011,0c-0.567,0-1.668,0.747-2.201,1.974c-0.221,0.506,0.012,1.315,0.519,1.536c0.13,0.057,0.265,0.174,0.397,0.174c0.387,0,0.754-0.189,0.918-0.566c0.132-0.301,0.334-0.344,0.421-0.354c0.537-0.023,0.963-0.842,0.957-1.383C10.718,53.415,10.271,52.583,9.724,52.583z"
      fill={fill}
    />
  </svg>
)

// --- Componentes del Simulador Móvil ---

const MobileFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative mx-auto w-[320px] h-[640px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10 shrink-0">
    {/* Notch */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-50"></div>
    {/* Screen Content */}
    <div className="h-full w-full bg-slate-50 overflow-hidden flex flex-col relative">
      {/* Mobile StatusBar Sim */}
      <div className="h-10 bg-white flex items-center justify-between px-6 pt-4 shrink-0 shadow-sm">
        <span className="text-[10px] font-bold">9:41</span>
        <div className="flex gap-1 items-center">
          <Zap className="w-3 h-3 fill-slate-800" />
          <div className="w-4 h-2 border border-slate-800 rounded-[2px] relative">
            <div className="absolute inset-0.5 bg-slate-800 rounded-[1px] w-[70%]" />
          </div>
        </div>
      </div>
      {children}
    </div>
  </div>
)

// --- Configuración Estática ---

const additionalFeatures = [
  {
    title: "Control Financiero",
    description: "Seguimiento riguroso de gastos e ingresos por cada lote.",
    icon: DollarSign
  },
  {
    title: "Análisis de Datos",
    description: "Gráficos interactivos de rentabilidad y proyecciones.",
    icon: BarChart3
  },
  {
    title: "Acceso Móvil",
    description: "Gestiona tu granja desde cualquier lugar con nuestra App.",
    icon: Smartphone
  },
  {
    title: "Seguridad Total",
    description: "Tus datos están protegidos y respaldados en la nube.",
    icon: ShieldCheck
  }
]

// --- Vistas del Simulador ---

export default function MiGranja() {
  const [demoStep, setDemoStep] = useState<'landing' | 'naming' | 'modules' | 'list' | 'form' | 'success'>('landing')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [farmName, setFarmName] = useState('')
  
  // Estado del formulario simulado
  const [form, setForm] = useState({
    nombre: '',
    cantidad: '',
    costoUnitario: '25.00',
    costoTotal: '',
    raza: 'Hy-Line Brown',
    galpon: 'Galpón Principal',
    usarUnitario: true,
    observaciones: ''
  })

  // Configuración de categorías para la demo con iconos nativos
  const categories = [
    { id: 'ponedoras', title: 'Gallinas Ponedoras', icon: PonedoraIcon, color: 'text-amber-500', bg: 'bg-amber-100', subtitle: 'Producción de Huevos' },
    { id: 'levantes', title: 'Pollos de Levante', icon: LevanteIcon, color: 'text-emerald-500', bg: 'bg-emerald-100', subtitle: 'Crecimiento Inicial' },
    { id: 'engorde', title: 'Pollos de Engorde', icon: EngordeIcon, color: 'text-red-500', bg: 'bg-red-100', subtitle: 'Producción de Carne' }
  ]

  // Cálculos automáticos para la demo
  const inversionTotal = useMemo(() => {
    if (form.usarUnitario) {
      const cant = parseInt(form.cantidad) || 0
      const cost = parseFloat(form.costoUnitario) || 0
      return cant * cost
    } else {
      return parseFloat(form.costoTotal) || 0
    }
  }, [form.cantidad, form.costoUnitario, form.costoTotal, form.usarUnitario])

  const costoHuevoEstimado = 345.50

  return (
    <div className="min-h-screen bg-stripe-page">
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
                La potencia de <span className="text-brand-primary">GallinApp</span> en tu bolsillo
              </h1>
              <p className="text-xl text-stripe-muted mb-10 leading-relaxed">
                No solo es una web, es una herramienta diseñada para el campo. Experimenta nuestra app móvil 
                aquí mismo y descubre lo fácil que es profesionalizar tu granja.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-premium hover:scale-105 transition-transform bg-brand-primary text-white border-none cursor-pointer">
                  <Link to="/auth/signup">Pruébalo Gratis por 14 Días</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-semibold border-stripe-border hover:bg-stripe-page cursor-pointer" onClick={() => {
                  document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth' })
                }}>
                  Ver Demo Interactiva
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Simulador Interactivo Section */}
          <div id="simulador" className="scroll-mt-24 mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start lg:items-center">
            
            {/* Mockup Móvil */}
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
              
              <MobileFrame>
                <AnimatePresence mode="wait">
                  {/* PANTALLA INICIAL */}
                  {demoStep === 'landing' && (
                    <motion.div 
                      key="landing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white"
                    >
                      <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center mb-6 animate-bounce">
                        <Smartphone className="w-10 h-10 text-brand-primary" />
                      </div>
                      <h3 className="text-lg font-black text-slate-800 mb-3 leading-tight uppercase tracking-tight">Bienvenido</h3>
                      <p className="text-[11px] text-slate-500 mb-8 leading-relaxed">
                        Estás a punto de experimentar el control total de tu granja avícola.
                      </p>
                      <Button 
                        className="w-full bg-brand-primary rounded-xl font-bold py-6 shadow-xl shadow-brand-primary/20 text-white text-xs uppercase tracking-widest"
                        onClick={() => setDemoStep('naming')}
                      >
                        Comenzar Experiencia
                      </Button>
                    </motion.div>
                  )}

                  {/* PANTALLA: NOMBRAR GRANJA */}
                  {demoStep === 'naming' && (
                    <motion.div 
                      key="naming"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex-1 flex flex-col items-center justify-center p-8 bg-white"
                    >
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                        <LayoutGrid className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-base font-black text-slate-800 mb-2 uppercase tracking-tight">Personaliza tu App</h3>
                      <p className="text-[10px] text-slate-500 mb-6 text-center">Dale un nombre a tu granja para iniciar la gestión profesional.</p>
                      
                      <div className="w-full space-y-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Nombre de tu Granja</label>
                          <input 
                            autoFocus
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-primary font-bold text-slate-800" 
                            placeholder="Ej: Granja El Paraíso"
                            value={farmName}
                            onChange={(e) => setFarmName(e.target.value)}
                          />
                        </div>
                        <Button 
                          className="w-full bg-brand-primary rounded-xl font-bold h-12 shadow-lg shadow-brand-primary/20 text-white text-xs uppercase"
                          disabled={!farmName.trim()}
                          onClick={() => setDemoStep('modules')}
                        >
                          Crear Mi Granja
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* PANTALLA: SELECCIÓN DE CATEGORÍA */}
                  {demoStep === 'modules' && (
                    <motion.div 
                      key="modules"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col bg-slate-50"
                    >
                      <div className="p-4 bg-white border-b border-slate-200">
                        <h2 className="text-sm font-black text-slate-800 tracking-tight uppercase truncate">{farmName || 'Mi Granja'}</h2>
                        <p className="text-[10px] text-slate-500 font-medium tracking-tight">Selecciona un módulo para gestionar</p>
                      </div>
                      <div className="p-4 space-y-3">
                        {categories.map((cat) => (
                          <motion.button
                            key={cat.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setActiveCategory(cat.id)
                              setDemoStep('list')
                            }}
                            className="w-full p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-brand-primary/30 transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-inner", cat.bg)}>
                                <cat.icon width={20} height={20} fill="currentColor" className={cat.color} />
                              </div>
                              <div className="text-left">
                                <p className="text-xs font-bold text-slate-800 leading-none mb-1">{cat.title}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{cat.subtitle}</p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-primary transition-colors" />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* PANTALLA: LISTA DE LOTES */}
                  {demoStep === 'list' && (
                    <motion.div 
                      key="list"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col bg-slate-50"
                    >
                      <div className="p-4 bg-white border-b border-slate-200 flex items-center gap-3">
                        <div className="p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => setDemoStep('modules')}>
                          <ArrowLeft className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <h2 className="text-xs font-black text-slate-800 leading-none mb-1 uppercase tracking-tight truncate max-w-[180px]">
                            {categories.find(c => c.id === activeCategory)?.title}
                          </h2>
                          <p className="text-[9px] text-slate-500 font-bold uppercase">{farmName}</p>
                        </div>
                      </div>
                      <div className="p-4 space-y-3 relative flex-1">
                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", categories.find(c => c.id === activeCategory)?.bg)}>
                            {activeCategory === 'ponedoras' && <PonedoraIcon width={20} height={20} fill="currentColor" className="text-amber-500" />}
                            {activeCategory === 'levantes' && <LevanteIcon width={20} height={20} fill="currentColor" className="text-emerald-500" />}
                            {activeCategory === 'engorde' && <EngordeIcon width={20} height={20} fill="currentColor" className="text-red-500" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">Lote de Prueba</p>
                            <p className="text-[10px] text-slate-500 font-medium tracking-tight">2,500 aves · Activo</p>
                          </div>
                        </div>

                        {/* Indicador de clic para la demo */}
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute bottom-8 right-4 w-12 h-12 bg-brand-primary/20 rounded-full flex items-center justify-center z-10"
                        >
                          <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer" onClick={() => setDemoStep('form')}>
                            <Plus className="w-5 h-5" />
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* PANTALLA: FORMULARIO */}
                  {demoStep === 'form' && (
                    <motion.div 
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col bg-white"
                    >
                      <div className="p-4 border-b border-slate-100 flex items-center gap-2 sticky top-0 bg-white z-10">
                        <ArrowLeft className="w-4 h-4 text-slate-400 cursor-pointer" onClick={() => setDemoStep('list')} />
                        <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Nuevo Lote</h2>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 no-scrollbar">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Nombre del Lote</label>
                          <input className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-brand-primary font-medium" placeholder="Ej: Lote 01" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cantidad de Aves</label>
                          <input className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-brand-primary font-medium" placeholder="Ej: 100" type="number" value={form.cantidad} onChange={(e) => setForm({...form, cantidad: e.target.value})} />
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                          <p className="text-[9px] font-black text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5"><DollarSign className="w-3 h-3 text-brand-primary" />Información de Costos</p>
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-bold text-slate-600">Usar precio por ave</span>
                            <button onClick={() => setForm({...form, usarUnitario: !form.usarUnitario})} className={cn("w-10 h-5 rounded-full transition-colors relative", form.usarUnitario ? "bg-brand-primary" : "bg-slate-300")}><div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm", form.usarUnitario ? "left-6" : "left-1")} /></button>
                          </div>
                          {form.usarUnitario ? (
                            <div className="space-y-1 animate-in fade-in duration-300">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Precio por Ave ($)</label>
                              <input className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none font-bold text-brand-primary" value={form.costoUnitario} onChange={(e) => setForm({...form, costoUnitario: e.target.value})} />
                              {inversionTotal > 0 && <p className="text-[10px] text-brand-primary font-black text-center mt-1 bg-brand-primary/10 py-1.5 rounded-lg">TOTAL: ${inversionTotal.toLocaleString()}</p>}
                            </div>
                          ) : (
                            <div className="space-y-1 animate-in fade-in duration-300">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Costo Total ($)</label>
                              <input className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none font-bold" placeholder="Ej: 2500.00" value={form.costoTotal} onChange={(e) => setForm({...form, costoTotal: e.target.value})} />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Raza</label>
                          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">{['Hy-Line Brown', 'Lohmann', 'Cobb 500', 'Isa Brown'].map(r => (
                            <button key={r} onClick={() => setForm({...form, raza: r})} className={cn("px-3 py-1.5 rounded-full text-[10px] font-black whitespace-nowrap transition-all border", form.raza === r ? "bg-brand-primary text-white border-brand-primary shadow-md" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300")}>{r}</button>
                          ))}</div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-slate-100 flex gap-3 z-20">
                        <button className="flex-1 h-11 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest" onClick={() => setDemoStep('list')}>Cancelar</button>
                        <button className={cn("flex-1 h-11 rounded-xl text-[10px] font-black text-white transition-all shadow-lg uppercase tracking-widest", (!form.nombre || !form.cantidad) ? "bg-slate-300" : "bg-brand-primary shadow-brand-primary/20")} onClick={() => setDemoStep('success')} disabled={!form.nombre || !form.cantidad}>Guardar Lote</button>
                      </div>
                    </motion.div>
                  )}

                  {/* PANTALLA: ÉXITO */}
                  {demoStep === 'success' && (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex-1 flex flex-col bg-slate-50"
                    >
                      <div className="p-4 bg-brand-primary text-white shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer" onClick={() => setDemoStep('list')}>
                            <ArrowLeft className="w-4 h-4" />
                          </div>
                          <h2 className="text-[11px] font-black uppercase tracking-widest truncate max-w-[150px]">Lote {form.nombre}</h2>
                          <div className="w-4"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white/15 p-2 rounded-lg border border-white/10">
                            <p className="text-[7px] text-white/70 uppercase font-black tracking-widest mb-0.5">Inversión</p>
                            <p className="text-xs font-black">${inversionTotal.toLocaleString()}</p>
                          </div>
                          <div className="bg-white/15 p-2 rounded-lg border border-white/10">
                            <p className="text-[7px] text-white/70 uppercase font-black tracking-widest mb-0.5">Aves Vivas</p>
                            <p className="text-xs font-black">{form.cantidad}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 -mt-4">
                        <Card className="border-none shadow-2xl bg-white rounded-2xl overflow-hidden ring-1 ring-black/5">
                          <CardHeader className="bg-amber-500 p-4">
                            <div className="flex items-center gap-3 text-white">
                              <Sparkles className="w-5 h-5 fill-white/20" />
                              <span className="text-[9px] font-black uppercase tracking-[0.2em]">ANÁLISIS GallinApp</span>
                            </div>
                          </CardHeader>
                          <CardContent className="p-6 text-center">
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-2">Costo Proyectado por Huevo</p>
                            <div className="flex items-center justify-center gap-1.5">
                              <span className="text-4xl font-black text-slate-800 tracking-tighter">${costoHuevoEstimado}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">/ unidad</span>
                            </div>
                            <div className="mt-4 p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-center gap-2">
                              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-tight">Rentabilidad: +24.5%</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Button 
                          variant="ghost" 
                          className="w-full mt-8 text-[9px] font-black text-brand-primary uppercase tracking-[0.2em] hover:bg-brand-primary/5 cursor-pointer"
                          onClick={() => {
                            setDemoStep('modules')
                            setForm({ ...form, nombre: '', cantidad: '', costoTotal: '', observaciones: '' })
                          }}
                        >
                          Reiniciar Experiencia
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </MobileFrame>
            </div>

            {/* Narrativa y Guía (Anotaciones) */}
            <div className="order-1 lg:order-2 space-y-8 lg:pl-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest border border-brand-primary/20">
                <Zap className="w-3.5 h-3.5 fill-brand-primary" />
                Experiencia 100% Realista
              </div>
              
              <div className="space-y-10">
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-xl bg-brand-primary flex items-center justify-center text-xs text-white font-black shadow-lg shadow-brand-primary/30">1</div>
                  <h4 className="text-xl font-bold text-stripe-heading mb-2">Identidad de tu Granja</h4>
                  <p className="text-stripe-muted leading-relaxed text-sm">
                    Inicia personalizando tu espacio. GallinApp te permite gestionar múltiples granjas bajo una misma cuenta, adaptando cada header a tu marca.
                  </p>
                </div>

                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-xs text-white font-black shadow-lg shadow-slate-800/30">2</div>
                  <h4 className="text-xl font-bold text-stripe-heading mb-2">Iconografía Especializada</h4>
                  <p className="text-stripe-muted leading-relaxed text-sm">
                    Utilizamos la misma iconografía de nuestra App Móvil para que te familiarices con el sistema de **Gallinas Ponedoras, Levante y Engorde**.
                  </p>
                </div>

                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-xl bg-amber-500 flex items-center justify-center text-xs text-white font-black shadow-lg shadow-amber-500/30">3</div>
                  <h4 className="text-xl font-bold text-stripe-heading mb-2">Cálculos Proyectivos</h4>
                  <p className="text-stripe-muted leading-relaxed text-sm">
                    Registra lotes asignando razas y galpones. Observa cómo GallinApp calcula la inversión y proyecta el **Costo por Huevo** al instante.
                  </p>
                </div>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-3xl border border-stripe-border shadow-premium">
                <div className="flex -space-x-3 shrink-0">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-brand-primary flex items-center justify-center text-xs text-white font-black shadow-sm">
                    +500
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm font-black text-stripe-heading uppercase tracking-tight">Únete a la comunidad</p>
                  <p className="text-xs text-stripe-muted font-medium">Más de 500 productores ya están profesionalizando el campo con nosotros.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Value Propositions */}
          <div className="bg-stripe-page/40 rounded-[3rem] p-10 md:p-16 border border-stripe-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <SectionHeader
              title="Por qué elegir GallinApp para tu granja"
              subtitle="Nuestra tecnología te ayuda a profesionalizar tu producción sin complicaciones técnicas."
              align="center"
              className="mb-16"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {additionalFeatures.map((feat, index) => (
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

          {/* Final CTA */}
          <div className="mt-32 bg-brand-primary rounded-[3rem] p-12 md:p-20 text-center text-white shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -mr-64 -mt-64 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full -ml-64 -mb-64 blur-3xl animate-pulse"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black mb-8 text-white tracking-tight leading-tight">¿Listo para transformar la gestión de tu granja?</h2>
              <p className="text-xl text-white/80 mb-12 font-medium leading-relaxed">
                No arriesgues tu inversión con registros manuales. Únete a GallinApp hoy y toma el control total de tu producción.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button size="lg" variant="secondary" className="h-16 px-12 text-xl font-black hover:scale-105 transition-transform bg-white text-brand-primary rounded-2xl shadow-2xl cursor-pointer">
                  <Link to="/auth/signup">CREAR MI CUENTA GRATIS</Link>
                </Button>
                <p className="text-sm text-white/60 font-bold uppercase tracking-[0.2em]">14 días de prueba · Sin tarjeta</p>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
