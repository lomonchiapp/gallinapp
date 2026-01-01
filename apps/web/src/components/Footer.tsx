import { Instagram } from "lucide-react"
import logoWhite from "@gallinapp/assets/logo-white.png"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-dark border-t border-white/10 pt-20 pb-10 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-4 space-y-6">
            <img 
              src={logoWhite} 
              alt="Gallinapp" 
              className="h-8 w-auto"
            />
            <p className="text-white/60 leading-relaxed max-w-xs">
              La plataforma líder en gestión avícola profesional. 
              Tecnología para productores que buscan el siguiente nivel.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/gallin.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-brand-primary hover:bg-white/10 transition-all"
                aria-label="Síguenos en Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h5 className="font-bold text-white">Producto</h5>
              <ul className="space-y-2 text-sm font-medium">
                <li><a href="#" className="text-white/60 hover:text-brand-primary transition-colors">Características</a></li>
                <li><a href="#" className="text-white/60 hover:text-brand-primary transition-colors">Precios</a></li>
                <li><a href="#" className="text-white/60 hover:text-brand-primary transition-colors">App Móvil</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-bold text-white">Compañía</h5>
              <ul className="space-y-2 text-sm font-medium">
                <li><a href="#" className="text-white/60 hover:text-brand-primary transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="text-white/60 hover:text-brand-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-white/60 hover:text-brand-primary transition-colors">Carreras</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-bold text-white">Legal</h5>
              <ul className="space-y-2 text-sm font-medium">
                <li><a href="#" className="text-white/60 hover:text-brand-primary transition-colors">Privacidad</a></li>
                <li><a href="#" className="text-white/60 hover:text-brand-primary transition-colors">Términos</a></li>
                <li><a href="#" className="text-white/60 hover:text-brand-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payments & Legal Bottom */}
        <div className="border-t border-white/10 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
            {/* Payment Icons - White versions using CSS filters */}
            <div className="flex flex-wrap items-center gap-6 opacity-90 hover:opacity-100 transition-all duration-300">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                alt="Visa" 
                className="h-4 brightness-0 invert"
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                alt="Mastercard" 
                className="h-6 brightness-0 invert"
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
                alt="PayPal" 
                className="h-5 brightness-0 invert"
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                alt="Stripe" 
                className="h-6 brightness-0 invert"
              />
            </div>

            <div className="flex gap-6 text-xs font-bold text-white/40 uppercase tracking-widest">
              <a href="#" className="hover:text-brand-primary transition-colors">Soporte</a>
              <a href="#" className="hover:text-brand-primary transition-colors">Estado del Sistema</a>
              <a href="#" className="hover:text-brand-primary transition-colors">Seguridad</a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-white/40">
            <p>© {currentYear} Gallinapp Inc. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px]">ES</span>
                Español
              </a>
              <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px]">EN</span>
                English
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
