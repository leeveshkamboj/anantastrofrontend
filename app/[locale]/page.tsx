import { HeroSection } from "@/components/home/HeroSection"
import { FeaturesSection } from "@/components/home/FeaturesSection"
import { AIReportsSection } from "@/components/home/AIReportsSection"
import { HowItWorksSection } from "@/components/home/HowItWorksSection"
import { FeaturesGridSection } from "@/components/home/FeaturesGridSection"
import { CTASection } from "@/components/home/CTASection"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <AIReportsSection />
      <HowItWorksSection />
      <FeaturesGridSection />
      <CTASection />
    </div>
  )
}
