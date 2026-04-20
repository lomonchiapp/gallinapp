import type { ReactNode } from "react"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Container } from "@/components/layout/Container"
import { ChevronLeft, FileText, Shield, RotateCcw } from "lucide-react"

interface LegalLayoutProps {
  title: string
  intro: string
  lastUpdated: string
  children: ReactNode
  active: "terminos" | "privacidad" | "cancelaciones"
}

const LEGAL_NAV = [
  { id: "terminos", label: "Términos de uso", icon: FileText, href: "/terminos" },
  { id: "privacidad", label: "Política de privacidad", icon: Shield, href: "/privacidad" },
  { id: "cancelaciones", label: "Cancelaciones y reembolsos", icon: RotateCcw, href: "/cancelaciones" },
] as const

/**
 * Layout compartido para las paginas legales: header, sidebar de navegacion,
 * tipografia consistente y footer.
 */
export function LegalLayout({ title, intro, lastUpdated, children, active }: LegalLayoutProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [active])

  return (
    <>
      <Header />
      <main className="w-full pt-16 md:pt-20 bg-stripe-canvas">
        {/* Hero / breadcrumb */}
        <section className="bg-brand-dark text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px]" />
          </div>
          <Container>
            <div className="relative z-10 py-16 md:py-20">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-6"
              >
                <ChevronLeft className="w-4 h-4" />
                Volver al inicio
              </Link>
              <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">{title}</h1>
              <p className="text-lg text-white/70 max-w-2xl leading-relaxed">{intro}</p>
              <p className="text-xs text-white/40 mt-6 uppercase tracking-widest font-bold">
                Última actualización: {lastUpdated}
              </p>
            </div>
          </Container>
        </section>

        <Container>
          <div className="grid lg:grid-cols-[260px_1fr] gap-10 py-12 md:py-16">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-xs font-black uppercase tracking-widest text-stripe-muted mb-3">
                Documentos legales
              </p>
              <nav className="space-y-1">
                {LEGAL_NAV.map((item) => {
                  const Icon = item.icon
                  const isActive = item.id === active
                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        isActive
                          ? "bg-brand-dark text-white shadow-md"
                          : "text-stripe-text hover:bg-white hover:text-brand-dark"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${isActive ? "text-cyan-300" : "text-stripe-muted group-hover:text-primary-500"}`}
                      />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-8 p-4 rounded-2xl bg-white border border-stripe-border">
                <p className="text-xs font-bold text-brand-dark mb-2">¿Necesitas ayuda legal?</p>
                <p className="text-xs text-stripe-text leading-relaxed mb-3">
                  Para consultas sobre estos términos, escríbenos.
                </p>
                <a
                  href="mailto:legal@gallinapp.com"
                  className="text-xs font-black text-primary-600 hover:underline"
                >
                  legal@gallinapp.com
                </a>
              </div>
            </aside>

            {/* Content */}
            <article className="prose-legal max-w-3xl">{children}</article>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}

export const legalProseStyles = `
  .prose-legal h2 {
    color: #0A2540;
    font-weight: 900;
    font-size: 1.5rem;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  .prose-legal h2:first-child { margin-top: 0; }
  .prose-legal h3 {
    color: #0A2540;
    font-weight: 800;
    font-size: 1.125rem;
    margin-top: 1.75rem;
    margin-bottom: 0.5rem;
  }
  .prose-legal p {
    color: #425466;
    line-height: 1.7;
    margin-bottom: 1rem;
  }
  .prose-legal ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    color: #425466;
  }
  .prose-legal li { margin-bottom: 0.4rem; line-height: 1.6; }
  .prose-legal strong { color: #0A2540; font-weight: 700; }
  .prose-legal a { color: #345DAD; text-decoration: underline; }
`

export function LegalProseStyles() {
  return <style>{legalProseStyles}</style>
}
