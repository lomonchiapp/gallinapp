import { Header } from "@/components/Header"
import { Hero } from "@/components/sections/Hero/Hero"
import { Workflow } from "@/components/sections/Workflow"
import { Modules } from "@/components/sections/Modules"
import { Spotlight } from "@/components/sections/Spotlight"
import { Features } from "@/components/sections/Features/Features"
import { Pricing } from "@/components/sections/Pricing/Pricing"
import { Comparison } from "@/components/sections/Comparison"
import { FAQ } from "@/components/sections/FAQ"
import { Footer } from "@/components/Footer"

export default function Landing() {
  return (
    <>
      <Header />
      <main className="w-full pt-16 md:pt-20">
        <Hero />
        <Workflow />
        <Modules />
        <Spotlight />
        <Features />
        <Pricing />
        <Comparison />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
