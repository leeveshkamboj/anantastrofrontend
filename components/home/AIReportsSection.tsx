"use client"

import { Button } from "@/components/ui/button"
import { Briefcase, Heart, User, Calendar, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const aiReports = [
  {
    icon: Briefcase,
    title: "Career Report",
    description: "Discover your ideal career path and professional opportunities.",
  },
  {
    icon: Heart,
    title: "Love Report",
    description: "Understand your romantic compatibility and relationship dynamics.",
  },
  {
    icon: User,
    title: "Personality Report",
    description: "Deep insights into your personality traits and behavioral patterns.",
  },
  {
    icon: Calendar,
    title: "Daily/Weekly Reports",
    description: "Personalized daily and weekly predictions for your life.",
  },
]

export function AIReportsSection() {
  return (
    <section className="py-20 px-4 md:px-8" style={{ background: '#fcbb18' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Personalized Astrological Reports
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Get personalized insights based on traditional astrological wisdom. Our reports cover career, love, personality, and life predictions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiReports.map((report, index) => {
                const Icon = report.icon
                return (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border border-primary-dark/20">
                    <div className="w-10 h-10 rounded-lg bg-primary-dark flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                      <p className="text-sm text-gray-600">{report.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <Button asChild className="mt-8 bg-primary hover:bg-[#d6682a] text-white" size="lg">
              <Link href="/services/ai-reports">
                View All Reports <ArrowRight className="ml-2 h-4 w-4 text-primary-dark" />
              </Link>
            </Button>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/homepage_woman.png"
              alt="Mystical woman illustration"
              fill
              className="object-contain object-center"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

