"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { setKundliFormData } from "@/store/slices/kundliFormSlice"
import { useCreateKundliMutation, useLazyGetGeocodeSuggestionsQuery, useGetMyKundlisQuery } from "@/store/api/kundliApi"
import type { PlaceSuggestion } from "@/store/api/kundliApi"
import { selectIsAuthenticated } from "@/store/slices/authSlice"
import { DatePicker } from "@/components/ui/date-picker"
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
  const router = useRouter()
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const { data: kundlisData } = useGetMyKundlisQuery(undefined, { skip: !isAuthenticated })
  const [createKundli] = useCreateKundliMutation()
  const [getGeocodeSuggestions] = useLazyGetGeocodeSuggestionsQuery()
  const [name, setName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState<string | undefined>()
  const [timeOfBirth, setTimeOfBirth] = useState("")
  const [placeOfBirth, setPlaceOfBirth] = useState("")
  const [selectedPlace, setSelectedPlace] = useState<PlaceSuggestion | null>(null)
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([])
  const [placeSearchLoading, setPlaceSearchLoading] = useState(false)
  const placeInputContainerRef = useRef<HTMLDivElement>(null)
  const skipSuggestionsRef = useRef(false)
  const hasPrefilledFromProfileRef = useRef(false)
  const prefilledPlaceRef = useRef<string | null>(null)

  const [debouncedPlaceSearch, setDebouncedPlaceSearch] = useState("")
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedPlaceSearch(placeOfBirth?.trim() ?? "")
    }, 400)
    return () => clearTimeout(t)
  }, [placeOfBirth])

  // Auto-fill hero form from first profile when user is authenticated and has profiles
  useEffect(() => {
    if (!isAuthenticated || hasPrefilledFromProfileRef.current) return
    const kundlis = kundlisData?.data ?? []
    const first = kundlis[0]
    if (!first) return
    hasPrefilledFromProfileRef.current = true
    if (first.name?.trim()) setName(first.name.trim())
    if (first.dateOfBirth) setDateOfBirth(first.dateOfBirth)
    if (first.timeOfBirth) setTimeOfBirth(first.timeOfBirth)
    if (first.placeOfBirth) {
      const place = first.placeOfBirth.trim()
      prefilledPlaceRef.current = place
      setPlaceOfBirth(place)
    }
  }, [isAuthenticated, kundlisData?.data])

  useEffect(() => {
    if (skipSuggestionsRef.current) {
      skipSuggestionsRef.current = false
      setPlaceSuggestions([])
      setPlaceSearchLoading(false)
      return
    }
    if (!isAuthenticated) {
      setPlaceSuggestions([])
      setPlaceSearchLoading(false)
      return
    }
    const query = debouncedPlaceSearch
    if (!query) {
      setPlaceSuggestions([])
      setPlaceSearchLoading(false)
      return
    }
    // Don't open suggestions when place was auto-filled from first profile (we already have the place)
    if (prefilledPlaceRef.current && query.trim() === prefilledPlaceRef.current) {
      setPlaceSuggestions([])
      setPlaceSearchLoading(false)
      return
    }
    let cancelled = false
    setPlaceSearchLoading(true)
    getGeocodeSuggestions({ place: query, limit: 8 })
      .unwrap()
      .then((res) => {
        if (!cancelled && res?.data) setPlaceSuggestions(res.data)
      })
      .catch(() => {
        if (!cancelled) setPlaceSuggestions([])
      })
      .finally(() => {
        if (!cancelled) setPlaceSearchLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedPlaceSearch, getGeocodeSuggestions, isAuthenticated])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (placeInputContainerRef.current && !placeInputContainerRef.current.contains(e.target as Node)) {
        setPlaceSuggestions([])
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const onSelectPlace = (suggestion: PlaceSuggestion) => {
    setPlaceSuggestions([])
    skipSuggestionsRef.current = true
    prefilledPlaceRef.current = null
    setPlaceOfBirth(suggestion.formattedAddress)
    setSelectedPlace(suggestion)
  }

  useEffect(() => {
    if (selectedPlace && placeOfBirth.trim() !== (selectedPlace.formattedAddress ?? '').trim()) {
      setSelectedPlace(null)
    }
  }, [placeOfBirth, selectedPlace])

  const handleKundliSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isAuthenticated && name.trim()) {
      try {
        const result = await createKundli({
          name: name.trim(),
          dateOfBirth: dateOfBirth || undefined,
          timeOfBirth: timeOfBirth || undefined,
          placeOfBirth: placeOfBirth || undefined,
          ...(selectedPlace && selectedPlace.placeId && (selectedPlace.formattedAddress ?? '').trim() === (placeOfBirth ?? '').trim() && { placeId: selectedPlace.placeId }),
        }).unwrap()
        if (result?.data?.id) {
          router.push(`/kundli/generate?profileId=${result.data.id}&from=hero`)
        } else {
          router.push("/kundli/generate?from=hero")
        }
      } catch {
        router.push("/kundli/generate?from=hero")
      }
    } else {
      dispatch(
        setKundliFormData({
          name,
          dateOfBirth: dateOfBirth ?? "",
          timeOfBirth,
          placeOfBirth,
        })
      )
      router.push("/auth/register")
    }
  }

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

          {/* Right Column - Get your first kundli free form */}
          <Card className="rounded-3xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Get your first kundli free
              </CardTitle>
              <CardDescription>
                Enter your birth details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleKundliSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="kundli-name" className="text-gray-700 font-medium text-sm">
                    Name
                  </Label>
                  <Input
                    id="kundli-name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-50 border-gray-200 rounded-lg h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kundli-dob" className="text-gray-700 font-medium text-sm">
                    Date of birth
                  </Label>
                  <DatePicker
                    value={dateOfBirth}
                    onChange={(date) => setDateOfBirth(date)}
                    placeholder="Select date of birth"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kundli-time" className="text-gray-700 font-medium text-sm">
                    Time of birth
                  </Label>
                  <div className="relative">
                    <Input
                      id="kundli-time"
                      type="time"
                      value={timeOfBirth}
                      onChange={(e) => setTimeOfBirth(e.target.value)}
                      className="bg-gray-50 border-gray-200 rounded-lg h-12 text-base"
                    />
                  </div>
                </div>

                <div ref={placeInputContainerRef} className="relative space-y-2">
                  <Label htmlFor="kundli-place" className="text-gray-700 font-medium text-sm">
                    Place of birth
                  </Label>
                  <Input
                    id="kundli-place"
                    type="text"
                    placeholder="Search city or place of birth"
                    value={placeOfBirth}
                    onChange={(e) => setPlaceOfBirth(e.target.value)}
                    className="bg-gray-50 border-gray-200 rounded-lg h-12 text-base"
                    autoComplete="off"
                  />
                  {placeSearchLoading && placeOfBirth.trim() && isAuthenticated && (
                    <p className="text-sm text-gray-500">Searching…</p>
                  )}
                  {placeSuggestions.length > 0 && (
                    <ul className="absolute z-20 mt-0.5 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg max-h-56 overflow-auto">
                      {placeSuggestions.map((s, i) => (
                        <li key={i}>
                          <button
                            type="button"
                            onClick={() => onSelectPlace(s)}
                            className="w-full text-left px-3 py-2.5 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            {s.formattedAddress}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-[#d6682a] text-white font-bold text-lg py-6 rounded-lg hover:shadow-lg transition-all uppercase tracking-wide"
                  size="lg"
                >
                  Get free kundli
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

