import { Header } from "@/components/Header"
import { Hero } from "@/components/sections/Hero/Hero"
import { Features } from "@/components/sections/Features/Features"
import { Pricing } from "@/components/sections/Pricing/Pricing"
import { Footer } from "@/components/Footer"

export default function Landing() {
  return (
    <>
      <Header />
      <main className="w-full pt-16 md:pt-20">
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </>
  )
}







