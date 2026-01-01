import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/Logo"
import { cn } from "@/lib/utils"
import { Menu, X, GraduationCap, BookOpen, FileText, HelpCircle, LayoutGrid, Receipt, Tags, Activity, Zap, Boxes, BarChart3, FileBarChart, Globe, LogOut, User as UserIcon } from "lucide-react"
import { MegaMenu } from "./MegaMenu"
import { LanguageSelector } from "./shared/LanguageSelector"
import { useAuth } from "../context/AuthContext"

const learnMenuItems = [
  {
    title: "Documentación",
    description: "Guía técnica completa de la plataforma",
    icon: FileText,
    href: "#documentacion"
  },
  {
    title: "Tutoriales",
    description: "Aprende paso a paso cómo usar todas las funciones",
    icon: GraduationCap,
    href: "#tutoriales"
  },
  {
    title: "Guías",
    description: "Mejores prácticas y consejos profesionales",
    icon: BookOpen,
    href: "#guias"
  },
  {
    title: "Ayuda",
    description: "Resuelve tus dudas más comunes",
    icon: HelpCircle,
    href: "#faq"
  }
]

const modulesMenuItems = [
  {
    title: "Mi Granja",
    description: "Gestión de lotes (Ponedoras, Levante, Engorde), mortalidad y costos unitarios.",
    icon: LayoutGrid,
    href: "/mi-granja"
  },
  {
    title: "Gastos",
    description: "Registro de artículos (insumos, alimentos) e historial de inversiones por lote.",
    icon: Receipt,
    href: "/gastos"
  },
  {
    title: "Ventas",
    description: "Venta por unidades o lotes completos con débito automático de inventario.",
    icon: Tags,
    href: "/ventas"
  },
  {
    title: "Facturación",
    description: "Control de numeración, impuestos y emisión de comprobantes fiscales.",
    icon: FileText,
    href: "/facturacion"
  }
]

const featuresMenuItems = [
  {
    title: "Bienestar Animal",
    description: "Sistema de monitoreo y alertas de salud en tiempo real para tus aves.",
    icon: Activity,
    href: "#bienestar"
  },
  {
    title: "IA Predictiva",
    description: "Algoritmos avanzados para predecir producción, mortalidad y rentabilidad.",
    icon: Zap,
    href: "#ia"
  },
  {
    title: "Inventario Pro",
    description: "Control inteligente de suministros, alimentos y stock de productos.",
    icon: Boxes,
    href: "#inventario"
  },
  {
    title: "Analítica Pro",
    description: "Dashboards comparativos de rendimiento entre lotes y periodos.",
    icon: BarChart3,
    href: "#analitica"
  },
  {
    title: "Reportes Ejecutivos",
    description: "Generación masiva de reportes profesionales en PDF y Excel.",
    icon: FileBarChart,
    href: "#reportes"
  },
  {
    title: "Multi-Granja",
    description: "Gestiona múltiples ubicaciones y equipos desde una sola cuenta.",
    icon: Globe,
    href: "#multi-granja"
  }
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Características", href: "#caracteristicas" },
  ]

  const PricingLink = () => (
    <a
      href="#precios"
      className="text-sm font-medium text-stripe-heading hover:text-brand-primary transition-colors"
    >
      Precios
    </a>
  )

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 px-6 py-4",
        isScrolled 
          ? "bg-white/90 backdrop-blur-md border-b border-stripe-border py-3 shadow-md" 
          : "bg-transparent"
      )}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/">
            <Logo variant="line" height={32} />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <MegaMenu title="Módulos" items={modulesMenuItems} align="left" />
            <MegaMenu title="Funciones" items={featuresMenuItems} />
            <PricingLink />
            <MegaMenu title="Aprende" items={learnMenuItems} align="right" />
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-stripe-heading hover:text-brand-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <LanguageSelector />
          <div className="h-6 w-px bg-stripe-border mx-2" />
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/10">
                <UserIcon className="w-4 h-4 text-brand-primary" />
                <span className="text-sm font-bold text-brand-dark max-w-[120px] truncate">
                  {user.displayName || user.email}
                </span>
              </div>
              <button 
                onClick={() => signOut()}
                className="p-2 text-stripe-muted hover:text-red-500 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => navigate('/auth/login')}
                className="text-sm font-semibold text-stripe-heading hover:opacity-70 transition-opacity"
              >
                Iniciar Sesión
              </button>
              <Button 
                onClick={() => navigate('/auth/signup')}
                className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full px-6 shadow-md transition-all hover:shadow-lg"
              >
                Prueba 15 días gratis
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-stripe-heading"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-stripe-border p-6 shadow-xl md:hidden animate-fade-in max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col gap-6">
            {user && (
              <div className="flex items-center gap-3 p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10 mb-2">
                <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-black text-brand-dark truncate">{user.displayName || "Usuario"}</p>
                  <p className="text-xs text-stripe-text truncate">{user.email}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <p className="text-xs font-bold text-stripe-muted uppercase tracking-widest">Módulos</p>
              <div className="grid grid-cols-1 gap-3">
                {modulesMenuItems.map((item) => (
                  <Link 
                    key={item.title} 
                    to={item.href} 
                    className="flex items-center gap-3 text-stripe-heading hover:text-brand-primary" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5 text-brand-primary" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold text-stripe-muted uppercase tracking-widest">Funciones</p>
              <div className="grid grid-cols-1 gap-3">
                {featuresMenuItems.map((item) => (
                  <a key={item.title} href={item.href} className="flex items-center gap-3 text-stripe-heading hover:text-brand-primary" onClick={() => setMobileMenuOpen(false)}>
                    <item.icon className="w-5 h-5 text-brand-primary" />
                    <span className="font-medium">{item.title}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="py-2">
              <a 
                href="#precios" 
                className="text-lg font-bold text-stripe-heading hover:text-brand-primary flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Tags className="w-5 h-5 text-brand-primary" />
                Precios
              </a>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold text-stripe-muted uppercase tracking-widest">Aprende</p>
              <div className="grid grid-cols-1 gap-3">
                {learnMenuItems.map((item) => (
                  <a key={item.title} href={item.href} className="flex items-center gap-3 text-stripe-heading hover:text-brand-primary" onClick={() => setMobileMenuOpen(false)}>
                    <item.icon className="w-5 h-5 text-brand-primary" />
                    <span className="font-medium">{item.title}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-lg font-bold text-stripe-heading"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>

            <hr className="border-stripe-border" />
            <div className="py-2">
              <p className="text-xs font-bold text-stripe-muted uppercase tracking-widest mb-3">Idioma</p>
              <LanguageSelector />
            </div>
            <hr className="border-stripe-border" />
            
            {user ? (
              <button 
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 text-red-500 font-bold py-2"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    navigate('/auth/login');
                    setMobileMenuOpen(false);
                  }}
                  className="text-center font-bold py-3 text-stripe-heading border border-stripe-border rounded-xl"
                >
                  Iniciar Sesión
                </button>
                <Button 
                  onClick={() => {
                    navigate('/auth/signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-brand-primary h-12 rounded-xl text-base font-bold"
                >
                  Comenzar Prueba Gratis
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
