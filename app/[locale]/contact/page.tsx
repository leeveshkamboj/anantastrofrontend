"use client"

import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from "lucide-react"

export default function ContactPage() {
  const t = useTranslations('contact');

  const contactInfo = [
    { icon: Mail, titleKey: 'emailTitle', descKey: 'emailDesc', value: "support@anantastro.com", link: "mailto:support@anantastro.com" },
    { icon: Phone, titleKey: 'phoneTitle', descKey: 'phoneDesc', value: "+1 (555) 123-4567", link: "tel:+15551234567" },
    { icon: MapPin, titleKey: 'addressTitle', descKey: 'addressDesc', value: "123 Astrology Street, Cosmic City, CC 12345", link: "#" },
    { icon: Clock, titleKey: 'hoursTitle', descKey: 'hoursDesc', valueKey: 'hoursValue', link: "#" },
  ];

  const faqs = [
    { q: 'faq1q', a: 'faq1a' },
    { q: 'faq2q', a: 'faq2a' },
    { q: 'faq3q', a: 'faq3a' },
    { q: 'faq4q', a: 'faq4a' },
  ] as const;

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">{t('formTitle')}</CardTitle>
                <CardDescription>{t('formSubtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 font-medium">{t('firstName')}</Label>
                    <Input id="firstName" type="text" placeholder={t('placeholderFirst')} className="bg-gray-50 border-gray-200 rounded-lg h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 font-medium">{t('lastName')}</Label>
                    <Input id="lastName" type="text" placeholder={t('placeholderLast')} className="bg-gray-50 border-gray-200 rounded-lg h-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">{t('email')}</Label>
                  <Input id="email" type="email" placeholder={t('placeholderEmail')} className="bg-gray-50 border-gray-200 rounded-lg h-12" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">{t('phoneOptional')}</Label>
                  <Input id="phone" type="tel" placeholder={t('placeholderPhone')} className="bg-gray-50 border-gray-200 rounded-lg h-12" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-700 font-medium">{t('subject')}</Label>
                  <Input id="subject" type="text" placeholder={t('placeholderSubject')} className="bg-gray-50 border-gray-200 rounded-lg h-12" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700 font-medium">{t('message')}</Label>
                  <Textarea id="message" placeholder={t('placeholderMessage')} className="bg-gray-50 border-gray-200 rounded-lg min-h-32" />
                </div>

                <Button className="w-full bg-primary hover:bg-[#d6682a] text-white font-bold text-lg py-6 rounded-lg hover:shadow-lg transition-all" size="lg">
                  <Send className="mr-2 h-5 w-5" />
                  {t('submit')}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('getInTouchTitle')}</h2>
                <p className="text-gray-600 leading-relaxed">{t('getInTouchBody')}</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  const displayValue = 'valueKey' in info ? t(info.valueKey as 'hoursValue') : info.value;
                  return (
                    <Card key={index} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary-dark flex items-center justify-center shrink-0">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{t(info.titleKey)}</h3>
                            <p className="text-sm text-gray-600 mb-2">{t(info.descKey)}</p>
                            {info.link !== "#" ? (
                              <a href={info.link} className="text-primary-dark hover:text-primary font-medium">
                                {displayValue}
                              </a>
                            ) : (
                              <p className="text-primary-dark font-medium">{displayValue}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card className="border-0 shadow-lg bg-primary-light">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <MessageSquare className="h-6 w-6 text-primary-dark shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{t('urgentTitle')}</h3>
                      <p className="text-gray-700 text-sm mb-4">{t('urgentBody')}</p>
                      <Button variant="outline" className="!border-[#794235] text-[#794235] hover:bg-[#794235] hover:text-white">
                        {t('liveChat')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8" style={{ background: '#fcbb18' }}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('faqTitle')}</h2>
            <p className="text-lg text-gray-600">{t('faqSubtitle')}</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <Card key={faq.q} className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">{t(faq.q)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{t(faq.a)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
