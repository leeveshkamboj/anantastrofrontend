"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

const steps = ["1", "2", "3", "4"] as const

export function HowItWorksSection() {
  const t = useTranslations("home.howItWorks")

  return (
    <section className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("title")}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((stepNum, index) => (
            <Card key={stepNum} className="border-0 shadow-lg text-center relative bg-white">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{stepNum}</span>
                </div>
                <CardTitle className="text-xl">{t(`step${index + 1}Title`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{t(`step${index + 1}Desc`)}</CardDescription>
              </CardContent>
              {index < steps.length - 1 && (
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
