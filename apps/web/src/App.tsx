import { Header } from "@/components/Header"
import { Hero } from "@/components/sections/Hero"
import { Features } from "@/components/sections/Features"
import { Benefits } from "@/components/sections/Benefits"
import { Pricing } from "@/components/sections/Pricing"
import { Gallery } from "@/components/Gallery"
import { Footer } from "@/components/Footer"

function App() {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <main className="w-full">
        <Hero />
        <Features />
        <Benefits />
        <Pricing />
        <Gallery />
      </main>
      <Footer />
    </div>
  )
}

export default App
