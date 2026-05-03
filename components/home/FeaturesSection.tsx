"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Star, Heart, Zap } from "lucide-react"
import { useTranslations } from "next-intl"

const items = [
  { icon: BookOpen, k: "kundli" as const },
  { icon: Star, k: "horoscope" as const },
  { icon: Heart, k: "matchmaking" as const },
  { icon: Zap, k: "reports" as const },
] as const

export function FeaturesSection() {
  const t = useTranslations("home.features")

  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("title")}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary-dark flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{t(feature.k)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{t(`${feature.k}Desc`)}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
