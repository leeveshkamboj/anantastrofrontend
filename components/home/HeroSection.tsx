"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "lucide-react"
import Link from "next/link"
import { 
  TbZodiacAries, 
  TbZodiacTaurus, 
  TbZodiacGemini, 
  TbZodiacCancer, 
  TbZodiacLeo, 
  TbZodiacVirgo,
  TbZodiacLibra,
  TbZodiacScorpio,
  TbZodiacSagittarius,
  TbZodiacCapricorn,
  TbZodiacAquarius,
  TbZodiacPisces
} from "react-icons/tb"

const zodiacSigns = [
  { Icon: TbZodiacAries, rotation: -12 },
  { Icon: TbZodiacTaurus, rotation: -6 },
  { Icon: TbZodiacGemini, rotation: 0 },
  { Icon: TbZodiacCancer, rotation: 6 },
  { Icon: TbZodiacLeo, rotation: 12 },
  { Icon: TbZodiacVirgo, rotation: 18 },
  { Icon: TbZodiacLibra, rotation: -12 },
  { Icon: TbZodiacScorpio, rotation: -6 },
  { Icon: TbZodiacSagittarius, rotation: 0 },
  { Icon: TbZodiacCapricorn, rotation: 6 },
  { Icon: TbZodiacAquarius, rotation: 12 },
  { Icon: TbZodiacPisces, rotation: 18 },
]

// Pre-calculated offsets for consistent rendering
const offsets = [5, -8, 12, -5, 8, -12, 6, -9, 11, -7, 9, -11, 7, -6, 10, -10]
const scatterPositions = [
  { left: 10, top: 15, rotation: 8, opacity: 0.06 },
  { left: 85, top: 20, rotation: -12, opacity: 0.08 },
  { left: 25, top: 60, rotation: 15, opacity: 0.05 },
  { left: 70, top: 55, rotation: -8, opacity: 0.07 },
  { left: 5, top: 80, rotation: 12, opacity: 0.06 },
  { left: 90, top: 75, rotation: -15, opacity: 0.08 },
  { left: 50, top: 10, rotation: 10, opacity: 0.05 },
  { left: 15, top: 40, rotation: -10, opacity: 0.07 },
  { left: 80, top: 45, rotation: 12, opacity: 0.06 },
  { left: 35, top: 85, rotation: -8, opacity: 0.08 },
  { left: 60, top: 25, rotation: 15, opacity: 0.05 },
  { left: 95, top: 65, rotation: -12, opacity: 0.07 },
  { left: 20, top: 30, rotation: 9, opacity: 0.06 },
  { left: 75, top: 35, rotation: -11, opacity: 0.08 },
  { left: 40, top: 70, rotation: 13, opacity: 0.05 },
  { left: 65, top: 90, rotation: -9, opacity: 0.07 },
  { left: 30, top: 5, rotation: 11, opacity: 0.06 },
  { left: 55, top: 50, rotation: -13, opacity: 0.08 },
  { left: 45, top: 95, rotation: 7, opacity: 0.05 },
  { left: 88, top: 12, rotation: -14, opacity: 0.07 },
]

export function HeroSection() {
  return (
    <div className="celestial-header relative min-h-[70vh] flex flex-col items-center justify-center pt-32 px-4 md:px-8 pb-24 overflow-hidden">
      {/* Zodiac symbols decorative background - filled pattern */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="relative w-full h-full">
          {/* Grid pattern covering entire background */}
          <div className="absolute inset-0 grid grid-cols-6 md:grid-cols-12 lg:grid-cols-16 gap-4 md:gap-6 lg:gap-8 p-4 md:p-8">
            {Array.from({ length: 96 }).map((_, index) => {
              const zodiacIndex = index % zodiacSigns.length
              const { Icon, rotation } = zodiacSigns[zodiacIndex]
              const offset = offsets[index % offsets.length]
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-center"
                  style={{
                    transform: `rotate(${rotation + offset}deg)`,
                    opacity: 0.08 + (index % 3) * 0.13, // Varying opacity
                  }}
                >
                  <Icon className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 text-primary" />
                </div>
              )
            })}
          </div>
          
          {/* Additional scattered larger symbols for depth */}
          <div className="absolute inset-0">
            {scatterPositions.map((pos, index) => {
              const zodiacIndex = index % zodiacSigns.length
              const { Icon, rotation } = zodiacSigns[zodiacIndex]
              
              return (
                <div
                  key={`scatter-${index}`}
                  className="absolute"
                  style={{
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                    transform: `rotate(${rotation + pos.rotation}deg)`,
                    opacity: pos.opacity,
                  }}
                >
                  <Icon className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 text-primary" />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="text-center lg:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
              Discover Your Destiny with AnantAstro
            </h1>
            <p className="text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
              Get accurate kundli generation, personalized horoscopes, AI-powered reports, and expert astrological consultations all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                className="bg-primary hover:bg-[#d6682a] text-white font-bold text-lg py-6 px-8 rounded-lg hover:shadow-lg transition-all cursor-pointer"
                size="lg"
              >
                <Link href="/auth/register">Get Started Free</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="text-lg py-6 px-8 !border-[#794235] text-[#794235] hover:bg-[#794235] hover:text-white hover:!border-[#794235] cursor-pointer transition-all"
                size="lg"
              >
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Booking Form Card */}
          <Card className="rounded-3xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Book a Consultation</CardTitle>
              <CardDescription>Schedule a session with our expert astrologers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium text-sm">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="bg-gray-50 border-gray-200 rounded-lg h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-50 border-gray-200 rounded-lg h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-time" className="text-gray-700 font-medium text-sm">
                  Date & Time
                </Label>
                <div className="relative">
                  <Input
                    id="date-time"
                    type="text"
                    placeholder="Select date and time"
                    className="bg-gray-50 border-gray-200 rounded-lg h-12 pr-10 text-base"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-dark pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultation" className="text-gray-700 font-medium text-sm">
                  Consultation Type
                </Label>
                <Textarea
                  id="consultation"
                  placeholder="Describe what you'd like to discuss"
                  className="bg-gray-50 border-gray-200 rounded-lg min-h-24 text-base"
                />
              </div>

              <Button
                className="w-full bg-primary hover:bg-[#d6682a] text-white font-bold text-lg py-6 rounded-lg hover:shadow-lg transition-all uppercase tracking-wide"
                size="lg"
              >
                BOOK NOW
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

