"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const howItWorks = [
  {
    step: "1",
    title: "Sign Up",
    description: "Create your account in seconds with email or social login.",
  },
  {
    step: "2",
    title: "Get Kundli",
    description: "Enter your birth details to get your personalized birth chart.",
  },
  {
    step: "3",
    title: "Get Reports",
    description: "Access personalized reports and horoscope predictions instantly.",
  },
  {
    step: "4",
    title: "Consult Experts",
    description: "Book consultations with verified astrologers for deeper insights.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map((step, index) => (
            <Card key={index} className="border-0 shadow-lg text-center relative bg-white">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{step.description}</CardDescription>
              </CardContent>
              {index < howItWorks.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-primary-dark" />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

