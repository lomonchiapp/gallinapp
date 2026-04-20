import React, { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Copy, Smartphone, Apple, Play } from 'lucide-react';

/**
 * Página de invitación a una granja.
 * URL: /invite?code=XXXXXXXX
 * Muestra el código y un enlace para abrir la app con el código pre-rellenado.
 */
export default function Invite() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code')?.trim().toUpperCase() ?? '';

  const appInviteUrl = useMemo(() => {
    if (!code) return '';
    return `gallinapp://invite?code=${encodeURIComponent(code)}`;
  }, [code]);

  const copyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
    }
  };

  const handleOpenApp = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Intentar abrir la app
    window.location.href = appInviteUrl;

    // Si no se abre en 2.5 segundos, mostrar opciones de descarga o redirigir
    setTimeout(() => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /android/i.test(navigator.userAgent);
      
      if (isIOS) {
        // Reemplazar con URL real de App Store
        window.open('https://apps.apple.com/app/idXXXXXXXXX', '_blank');
      } else if (isAndroid) {
        // Reemplazar con URL real de Play Store
        window.open('https://play.google.com/store/apps/details?id=com.gallinapp', '_blank');
      }
    }, 2500);
  };

  return (
    <>
      <Header />
      <main className="min-h-[70vh] w-full pt-24 pb-16 px-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">
            Invitación a una granja
          </h1>
          <p className="text-neutral-600">
            Te han invitado a unirte a una granja en Gallinapp. Usa el código
            siguiente en la app para solicitar acceso.
          </p>

          {code ? (
            <>
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                  Código de granja
                </p>
                <p className="text-3xl font-mono font-bold text-brand-primary tracking-widest">
                  {code}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4 gap-2"
                  onClick={copyCode}
                >
                  <Copy className="w-4 h-4" />
                  Copiar código
                </Button>
              </div>

              <p className="text-sm text-neutral-500">
                Abre la app Gallinapp, ve a &quot;Unirse a una granja&quot; e
                ingresa este código.
              </p>

              <Button
                asChild
                size="lg"
                className="w-full gap-2 bg-primary-500 hover:bg-primary-600"
              >
                <a href={appInviteUrl} onClick={handleOpenApp}>
                  <Smartphone className="w-5 h-5" />
                  Abrir en la app
                </a>
              </Button>
              <p className="text-xs text-neutral-400">
                Si no tienes la app instalada, te redirigiremos a la tienda para descargarla.
              </p>

              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-sm text-neutral-500 mb-4">¿No tienes la app?</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" className="gap-2" asChild>
                    <a href="https://apps.apple.com/app/idXXXXXXXXX" target="_blank" rel="noopener noreferrer">
                      <Apple className="w-4 h-4" />
                      App Store
                    </a>
                  </Button>
                  <Button variant="outline" className="gap-2" asChild>
                    <a href="https://play.google.com/store/apps/details?id=com.gallinapp" target="_blank" rel="noopener noreferrer">
                      <Play className="w-4 h-4" />
                      Google Play
                    </a>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
              <p className="text-amber-800 dark:text-amber-200">
                Este enlace no incluye un código de granja. Pide al propietario
                que te envíe de nuevo el link de invitación.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
