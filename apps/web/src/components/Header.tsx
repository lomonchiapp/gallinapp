import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/Logo"
import { DownloadButton } from "@/components/shared/DownloadButton"
import { MegaMenu } from "./MegaMenu"
import { BookOpen, GraduationCap, FileText, HelpCircle } from "lucide-react"

const learnMenuItems = [
  {
    title: "Tutoriales",
    description: "Aprende paso a paso cómo usar todas las funciones",
    icon: GraduationCap,
    href: "#tutoriales"
  },
  {
    title: "Documentación",
    description: "Guía técnica completa de la plataforma",
    icon: FileText,
    href: "#documentacion"
  },
  {
    title: "Guías",
    description: "Mejores prácticas y consejos profesionales",
    icon: BookOpen,
    href: "#guias"
  },
  {
    title: "Preguntas Frecuentes",
    description: "Resuelve tus dudas más comunes",
    icon: HelpCircle,
    href: "#faq"
  }
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-200/50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 max-w-7xl">
        <div className="flex items-center gap-3">
          <Logo variant="line" height={40} />
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#caracteristicas" className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors relative group">
            Características
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#precios" className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors relative group">
            Precios
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#galeria" className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors relative group">
            Galería
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
          </a>
          <MegaMenu items={learnMenuItems} />
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex hover:bg-primary-50 hover:text-primary-600">
            Iniciar Sesión
          </Button>
          <DownloadButton platform="general" variant="header" />
        </div>
      </div>
    </header>
  )
}

