"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "@/i18n/navigation"
import { useDispatch, useSelector } from "react-redux"
import { useTranslations } from "next-intl"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { CosmicCard } from "@/components/ui/CosmicCard"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CoinGlyph } from "@/components/coins/CoinGlyph"
import { BirthGenderSelect, type BirthGender } from "@/components/kundli/BirthGenderSelect"
import { FadeIn } from "@/components/motion/FadeIn"
import { Stagger, StaggerItem } from "@/components/motion/Stagger"
import { getChoreographyDelay, getPresetForTier, getReducedPreset } from "@/lib/motion"
import { useMotion } from "@/components/motion/MotionProvider"
import {
  useCreateKundliMutation,
  useGetMyKundlisQuery,
  useLazyGetGeocodeSuggestionsQuery,
} from "@/store/api/kundliApi"
import type { PlaceSuggestion } from "@/store/api/kundliApi"
import { selectIsAuthenticated } from "@/store/slices/authSlice"
import { setKundliFormData } from "@/store/slices/kundliFormSlice"
import { useServiceRunPrice } from "@/hooks/useServiceRunPrice"

export function KundliHeroForm() {
  const t = useTranslations("home.hero")
  const { reduced, tier } = useMotion()
  const scaleIn = reduced ? getReducedPreset("scaleIn") : getPresetForTier("scaleIn", tier)
  const router = useRouter()
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const { data: kundlisData } = useGetMyKundlisQuery(undefined, { skip: !isAuthenticated })
  const [createKundli] = useCreateKundliMutation()
  const [getGeocodeSuggestions] = useLazyGetGeocodeSuggestionsQuery()
  const { compactLabel: kundliPriceLine } = useServiceRunPrice("kundli")

  const [name, setName] = useState("")
  const [gender, setGender] = useState<BirthGender>("Male")
  const [dateOfBirth, setDateOfBirth] = useState<string | undefined>()
  const [timeOfBirth, setTimeOfBirth] = useState("")
  const [placeOfBirth, setPlaceOfBirth] = useState("")
  const [selectedPlace, setSelectedPlace] = useState<PlaceSuggestion | null>(null)
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([])
  const [placeSearchLoading, setPlaceSearchLoading] = useState(false)
  const [debouncedPlaceSearch, setDebouncedPlaceSearch] = useState("")
  const placeInputContainerRef = useRef<HTMLDivElement>(null)
  const skipSuggestionsRef = useRef(false)
  const hasPrefilledFromProfileRef = useRef(false)
  const prefilledPlaceRef = useRef<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPlaceSearch(placeOfBirth?.trim() ?? "")
    }, 400)
    return () => clearTimeout(timer)
  }, [placeOfBirth])

  useEffect(() => {
    if (!isAuthenticated || hasPrefilledFromProfileRef.current) return
    const first = kundlisData?.data?.[0]
    if (!first) return
    hasPrefilledFromProfileRef.current = true
    if (first.name?.trim()) setName(first.name.trim())
    if (first.gender === "Male" || first.gender === "Female") setGender(first.gender)
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
      if (
        placeInputContainerRef.current &&
        !placeInputContainerRef.current.contains(e.target as Node)
      ) {
        setPlaceSuggestions([])
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (selectedPlace && placeOfBirth.trim() !== (selectedPlace.formattedAddress ?? "").trim()) {
      setSelectedPlace(null)
    }
  }, [placeOfBirth, selectedPlace])

  const onSelectPlace = (suggestion: PlaceSuggestion) => {
    setPlaceSuggestions([])
    skipSuggestionsRef.current = true
    prefilledPlaceRef.current = null
    setPlaceOfBirth(suggestion.formattedAddress)
    setSelectedPlace(suggestion)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isAuthenticated && name.trim()) {
      const kundlis = kundlisData?.data ?? []
      const first = kundlis[0]
      const nameTrim = name.trim()
      const dob = dateOfBirth ?? ""
      const time = timeOfBirth.trim()
      const place = (placeOfBirth ?? "").trim()
      const unchanged =
        first &&
        (first.name ?? "").trim() === nameTrim &&
        (first.gender ?? "Male") === gender &&
        (first.dateOfBirth ?? "") === dob &&
        (first.timeOfBirth ?? "").trim() === time &&
        (first.placeOfBirth ?? "").trim() === place

      if (unchanged) {
        router.push(`/services/kundli/generate?profileId=${first.id}&from=hero`)
        return
      }

      try {
        const result = await createKundli({
          name: nameTrim,
          gender,
          dateOfBirth: dateOfBirth || undefined,
          timeOfBirth: timeOfBirth || undefined,
          placeOfBirth: placeOfBirth || undefined,
          ...(selectedPlace &&
            selectedPlace.placeId &&
            (selectedPlace.formattedAddress ?? "").trim() === (placeOfBirth ?? "").trim() && {
              placeId: selectedPlace.placeId,
            }),
        }).unwrap()
        if (result?.data?.id) {
          router.push(`/services/kundli/generate?profileId=${result.data.id}&from=hero`)
        } else {
          router.push("/services/kundli/generate?from=hero")
        }
      } catch {
        router.push("/services/kundli/generate?from=hero")
      }
    } else {
      dispatch(
        setKundliFormData({
          name,
          gender,
          dateOfBirth: dateOfBirth ?? "",
          timeOfBirth,
          placeOfBirth,
        })
      )
      router.push("/auth/register")
    }
  }

  return (
    <motion.div
      className="mx-auto w-full max-w-md lg:max-w-none lg:mx-16"
      initial="hidden"
      animate="visible"
      variants={scaleIn}
    >
      <CosmicCard
        variant="glass"
        padding="md"
        className="celestial-surface-light w-full items-stretch p-5 text-left text-gray-900 sm:p-8"
      >
        <FadeIn preset="fadeUp" delay={getChoreographyDelay("title", reduced)}>
          <h2 className="mb-1 text-center text-2xl font-bold text-gray-900">{t("cardTitle")}</h2>
        </FadeIn>
        <FadeIn preset="fadeUp" delay={getChoreographyDelay("subtitle", reduced)}>
          <p className="mb-6 text-center text-sm text-gray-600">{t("cardDescription")}</p>
        </FadeIn>

        <Stagger inView={false}>
          <form className="w-full space-y-5" aria-label={t("cardTitle")} onSubmit={handleSubmit}>
            <StaggerItem className="space-y-2">
              <Label htmlFor="kundli-name" className="text-sm font-medium text-gray-700">
                {t("name")}
              </Label>
              <Input
                id="kundli-name"
                name="name"
                type="text"
                placeholder={t("namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </StaggerItem>

            <StaggerItem>
              <BirthGenderSelect
                id="kundli-gender"
                value={gender}
                onChange={setGender}
                translationNamespace="home.hero"
                labelClassName="text-sm font-medium text-gray-700"
                selectClassName="h-11 w-full rounded-full border border-gray-300 bg-transparent px-4 py-3 text-sm focus-visible:border-astro-orange focus-visible:ring-1 focus-visible:ring-astro-orange"
              />
            </StaggerItem>

            <StaggerItem className="space-y-2">
              <Label htmlFor="kundli-dob" className="text-sm font-medium text-gray-700">
                {t("dateOfBirth")}
              </Label>
              <DatePicker
                value={dateOfBirth}
                onChange={setDateOfBirth}
                placeholder={t("dateOfBirthPlaceholder")}
                className="h-11 w-full justify-start rounded-full border-gray-300 px-4 font-normal"
              />
            </StaggerItem>

            <StaggerItem className="space-y-2">
              <Label htmlFor="kundli-time" className="text-sm font-medium text-gray-700">
                {t("timeOfBirth")}
              </Label>
              <Input
                id="kundli-time"
                name="timeOfBirth"
                type="time"
                value={timeOfBirth}
                onChange={(e) => setTimeOfBirth(e.target.value)}
              />
            </StaggerItem>

            <StaggerItem ref={placeInputContainerRef} className="relative space-y-2">
              <Label htmlFor="kundli-place" className="text-sm font-medium text-gray-700">
                {t("placeOfBirth")}
              </Label>
              <Input
                id="kundli-place"
                name="placeOfBirth"
                type="text"
                placeholder={t("placePlaceholder")}
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                autoComplete="off"
              />
              {placeSearchLoading && placeOfBirth.trim() && isAuthenticated && (
                <p className="text-sm text-gray-500">{t("searching")}</p>
              )}
              {placeSuggestions.length > 0 && (
                <ul className="absolute z-20 mt-0.5 max-h-56 w-full overflow-auto rounded-2xl border border-gray-200 bg-white py-1 shadow-lg">
                  {placeSuggestions.map((s, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => onSelectPlace(s)}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        {s.formattedAddress}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </StaggerItem>

            <StaggerItem>
              <CosmicButton type="submit" variant="primary" size="lg" className="text-white">
                <span className="inline-flex items-center gap-1.5">
                  <span>{t("getKundli")}</span>
                  {kundliPriceLine && (
                    <>
                      <span aria-hidden>·</span>
                      <CoinGlyph className="h-4 w-4" />
                      <span>{kundliPriceLine}</span>
                    </>
                  )}
                </span>
              </CosmicButton>
            </StaggerItem>
          </form>
        </Stagger>
      </CosmicCard>
    </motion.div>
  )
}
