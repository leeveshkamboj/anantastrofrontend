import { ContactFaqSection } from "@/components/contact/ContactFaqSection"
import { ContactHeroSection } from "@/components/contact/ContactHeroSection"
import { ContactMainSection } from "@/components/contact/ContactMainSection"

export default function ContactPage() {
  return (
    <div className="bg-white text-gray-900">
      <ContactHeroSection />
      <ContactMainSection />
      <ContactFaqSection />
    </div>
  )
}
