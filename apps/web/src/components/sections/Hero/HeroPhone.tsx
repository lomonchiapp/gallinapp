export function HeroPhone() {
  return (
    <div className="relative lg:block hidden">
      <div className="relative mx-auto max-w-sm">
        <div className="aspect-[9/19] w-full rounded-[3rem] border-8 border-neutral-900 bg-neutral-800 p-2 shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <div className="h-full w-full rounded-[2.5rem] bg-white overflow-hidden">
            <div className="h-full w-full bg-gradient-to-br from-primary-500 to-primary-700 flex flex-col items-center justify-center p-8">
              <img
                src="/images/full-logo-white.png"
                alt="Gallinapp"
                className="w-48 mb-6"
              />
              <div className="text-center text-white">
                <div className="text-4xl mb-2">🐓</div>
                <div className="text-lg font-semibold opacity-90">
                  Gestión Avícola Profesional
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}








