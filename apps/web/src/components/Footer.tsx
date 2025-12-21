import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Logo } from "@/components/shared/Logo"
import { SocialLinks } from "@/components/shared/SocialLinks"

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <Logo variant="line" height={40} />
            </div>
            <p className="text-sm text-neutral-300 mb-4">
              Gestión avícola profesional en tu bolsillo. Controla tu granja desde cualquier lugar.
            </p>
            <SocialLinks variant="default" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Producto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#caracteristicas" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Características
                </a>
              </li>
              <li>
                <a href="#precios" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Precios
                </a>
              </li>
              <li>
                <a href="#galeria" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Galería
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Carreras
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Soporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Centro de ayuda
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Términos de servicio
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-400">
              © 2024 Gallinapp. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" size="sm" className="gap-2 border-neutral-700 text-neutral-300 hover:bg-primary-500 hover:border-primary-500 hover:text-white">
                <Download className="h-4 w-4" />
                App Store
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-neutral-700 text-neutral-300 hover:bg-primary-500 hover:border-primary-500 hover:text-white">
                <Download className="h-4 w-4" />
                Google Play
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

