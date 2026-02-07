"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, Zap } from "lucide-react"

export function FeaturesGridSection() {
  return (
    <section className="py-20 px-4 md:px-8" style={{ background: '#fcbb18' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary-dark flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Expert Astrologers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Connect with verified and experienced astrologers for personalized consultations and guidance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary-dark flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Your data is encrypted and secure. We prioritize your privacy and confidentiality.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary-dark flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Instant Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Get personalized reports instantly. No waiting, no delays - just instant insights.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

