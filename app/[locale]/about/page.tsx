import { AboutCTASection } from "@/components/about/AboutCTASection"
import { AboutHeroSection } from "@/components/about/AboutHeroSection"
import { AboutMissionSection } from "@/components/about/AboutMissionSection"
import { AboutTeamSection } from "@/components/about/AboutTeamSection"
import { AboutValuesSection } from "@/components/about/AboutValuesSection"
import { AboutWhySection } from "@/components/about/AboutWhySection"

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden bg-white text-gray-900">
      <AboutHeroSection />
      <AboutMissionSection />
      <AboutValuesSection />
      <AboutTeamSection />
      <AboutWhySection />
      <AboutCTASection />
    </div>
  )
}
