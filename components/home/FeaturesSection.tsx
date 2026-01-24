"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Star, Heart, Zap } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Kundli Generation",
    description: "Generate your complete birth chart with accurate planetary positions and houses.",
  },
  {
    icon: Star,
    title: "Horoscope",
    description: "Get daily, weekly, and monthly predictions tailored to your zodiac sign.",
  },
  {
    icon: Heart,
    title: "Matchmaking",
    description: "Compatibility analysis for relationships using traditional and modern methods.",
  },
  {
    icon: Zap,
    title: "AI Reports",
    description: "AI-powered insights on career, love, personality, and life predictions.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive astrological services powered by AI and traditional wisdom
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary-dark flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

