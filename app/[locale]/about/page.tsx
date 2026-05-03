"use client"

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star as StarIcon, Users, Shield, Heart, Star, Zap } from "lucide-react"
import { Link } from "@/i18n/navigation"

export default function AboutPage() {
  const t = useTranslations('about');

  const values = [
    { icon: Heart, titleKey: 'v1t' as const, descKey: 'v1d' as const },
    { icon: Shield, titleKey: 'v2t' as const, descKey: 'v2d' as const },
    { icon: Star, titleKey: 'v3t' as const, descKey: 'v3d' as const },
    { icon: Users, titleKey: 'v4t' as const, descKey: 'v4d' as const },
  ];

  const team = [
    { titleKey: 'team1n' as const, roleKey: 'team1r' as const, descKey: 'team1d' as const },
    { titleKey: 'team2n' as const, roleKey: 'team2r' as const, descKey: 'team2d' as const },
    { titleKey: 'team3n' as const, roleKey: 'team3r' as const, descKey: 'team3d' as const },
  ];

  const why = [
    { icon: Zap, titleKey: 'w1t' as const, descKey: 'w1d' as const },
    { icon: Shield, titleKey: 'w2t' as const, descKey: 'w2d' as const },
    { icon: Star, titleKey: 'w3t' as const, descKey: 'w3d' as const },
    { icon: Heart, titleKey: 'w4t' as const, descKey: 'w4d' as const },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-primary-light text-primary-dark relative py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t('missionTitle')}</h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">{t('missionP1')}</p>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">{t('missionP2')}</p>
              <p className="text-lg text-gray-600 leading-relaxed">{t('missionP3')}</p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-primary to-primary-dark flex items-center justify-center">
                <StarIcon className="h-32 w-32 text-white opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8" style={{ background: '#fcbb18' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('valuesTitle')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('valuesSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-0 shadow-lg bg-white">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary-dark flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{t(value.titleKey)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{t(value.descKey)}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('teamTitle')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('teamSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardHeader>
                  <div className="w-20 h-20 rounded-full bg-primary-dark flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl">{t(member.titleKey)}</CardTitle>
                  <CardDescription className="text-base font-medium text-primary-dark">{t(member.roleKey)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{t(member.descKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8" style={{ background: '#fcbb18' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('whyTitle')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {why.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="border-0 shadow-lg bg-white">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary-dark flex items-center justify-center">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{t(item.titleKey)}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-lg">{t(item.descKey)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('ctaTitle')}</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600">{t('ctaSubtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-primary hover:bg-[#d6682a] text-white font-bold text-lg py-6 px-8 rounded-lg hover:shadow-lg transition-all" size="lg">
              <Link href="/register">{t('getStartedFree')}</Link>
            </Button>
            <Button asChild variant="outline" className="text-lg py-6 px-8 !border-[#794235] text-[#794235] hover:bg-[#794235] hover:text-white hover:!border-[#794235]" size="lg">
              <Link href="/contact">{t('contactUs')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
