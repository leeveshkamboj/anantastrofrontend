"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, Zap } from "lucide-react"
import { useTranslations } from "next-intl"

export function FeaturesGridSection() {
  const t = useTranslations("home.featuresGrid")

  return (
    <section className="py-20 px-4 md:px-8" style={{ background: '#fcbb18' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary-dark flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle>{t("expertTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{t("expertDesc")}</CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary-dark flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle>{t("secureTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{t("secureDesc")}</CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary-dark flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle>{t("instantTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{t("instantDesc")}</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
