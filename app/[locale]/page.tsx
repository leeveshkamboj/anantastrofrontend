import { HeroSection } from "@/components/homepage/HeroSection"
import { ServicesSection } from "@/components/homepage/ServicesSection"
import { ReportsSection } from "@/components/homepage/ReportsSection"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <HeroSection />
      <ServicesSection />
      <ReportsSection />
    </div>
  )
}
