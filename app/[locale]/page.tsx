import { Suspense } from "react"
import { HeroSection } from "@/components/homepage/HeroSection"
import { ServicesSection } from "@/components/homepage/ServicesSection"
import { ReportsSection } from "@/components/homepage/ReportsSection"
import { AccountDeactivatedBanner } from "@/components/homepage/AccountDeactivatedBanner"

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-gray-900">
      <Suspense fallback={null}>
        <AccountDeactivatedBanner />
      </Suspense>
      <HeroSection />
      <ServicesSection />
      <ReportsSection />
    </div>
  )
}
