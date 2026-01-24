"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Users, Shield, Heart, Star, Zap } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We approach every consultation with empathy and understanding, recognizing the personal nature of astrological guidance.",
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "We maintain the highest standards of accuracy and ethical practice in all our astrological services.",
    },
    {
      icon: Star,
      title: "Excellence",
      description: "We combine traditional wisdom with modern AI technology to deliver exceptional insights and reports.",
    },
    {
      icon: Users,
      title: "Community",
      description: "We foster a supportive community where individuals can explore their spiritual journey together.",
    },
  ]

  const team = [
    {
      name: "Expert Astrologers",
      role: "Traditional & Modern",
      description: "Our team consists of verified astrologers with decades of combined experience in Vedic, Western, and modern astrological practices.",
    },
    {
      name: "AI Specialists",
      role: "Technology & Innovation",
      description: "Our AI team works tirelessly to develop cutting-edge algorithms that enhance traditional astrological interpretations.",
    },
    {
      name: "Customer Support",
      role: "Dedicated Service",
      description: "Our support team is available 24/7 to assist you with any questions or concerns about our services.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-primary-light text-primary-dark relative py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            About AnantAstro
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Bridging ancient wisdom with modern technology to help you discover your true potential and navigate life&apos;s journey with confidence.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                At AnantAstro, we believe that everyone deserves access to accurate, personalized astrological guidance. Our mission is to make the ancient wisdom of astrology accessible to all through innovative technology and expert consultations.
              </p>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                We combine traditional Vedic and Western astrological practices with cutting-edge AI technology to provide comprehensive insights into your personality, relationships, career, and life path.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Whether you&apos;re seeking clarity on major life decisions, understanding your relationships better, or exploring your spiritual journey, AnantAstro is here to guide you every step of the way.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-primary to-primary-dark flex items-center justify-center">
                <Sparkles className="h-32 w-32 text-white opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 md:px-8" style={{ background: '#fcbb18' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="border-0 shadow-lg bg-white">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary-dark flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{value.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dedicated professionals committed to your astrological journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardHeader>
                  <div className="w-20 h-20 rounded-full bg-primary-dark flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-base font-medium text-primary-dark">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 md:px-8" style={{ background: '#fcbb18' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose AnantAstro?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-dark flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">AI-Powered Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">
                  Our advanced AI algorithms analyze thousands of astrological patterns to provide you with personalized, accurate insights that traditional methods alone cannot match.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-dark flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Verified Experts</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">
                  All our astrologers are verified professionals with years of experience. We ensure quality and authenticity in every consultation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-dark flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Comprehensive Reports</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">
                  From career guidance to relationship compatibility, our reports cover all aspects of your life with detailed, actionable insights.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-dark flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Privacy & Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">
                  Your personal information and birth data are encrypted and secure. We prioritize your privacy and confidentiality above all else.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600">
            Join thousands of satisfied users who have discovered clarity and guidance through AnantAstro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-primary hover:bg-[#d6682a] text-white font-bold text-lg py-6 px-8 rounded-lg hover:shadow-lg transition-all"
              size="lg"
            >
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="text-lg py-6 px-8 !border-[#794235] text-[#794235] hover:bg-[#794235] hover:text-white hover:!border-[#794235]"
              size="lg"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

