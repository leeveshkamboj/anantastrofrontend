"use client"

import { Globe, Languages, SlidersHorizontal, Star, Timer } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Container } from "@/components/layout/Container"
import type { AstrologerFilters } from "@/lib/astrologer-utils"

type AstrologerFilterBarProps = {
  filters: AstrologerFilters
  onChange: (filters: AstrologerFilters) => void
  expertiseOptions: string[]
  resultCount?: number
}

export function AstrologerFilterBar({
  filters,
  onChange,
  expertiseOptions,
  resultCount,
}: AstrologerFilterBarProps) {
  const t = useTranslations("astrologersPage")

  const update = (key: keyof AstrologerFilters, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  const activeFilterCount = Object.values(filters).filter((v) => v !== "all").length

  return (
    <div className="relative z-20 -mt-12 px-4 pb-4 lg:-mt-16">
      <Container>
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/80 bg-white/95 shadow-[0_20px_60px_-12px_rgba(46,10,94,0.25)] backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-linear-to-r from-orange-50/80 via-white to-purple-50/60 px-5 py-3.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <SlidersHorizontal className="h-4 w-4 text-astro-orange" aria-hidden="true" />
              {t("filterTitle")}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-astro-orange/15 px-2.5 py-1 font-bold text-astro-orange">
                  {t("filterActive", { n: activeFilterCount })}
                </span>
              )}
              {resultCount != null && (
                <span className="hidden sm:inline">{t("filterResults", { n: resultCount })}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4 lg:p-5">
            <FilterSelect
              icon={Languages}
              label={t("filterLanguage")}
              value={filters.language}
              onValueChange={(value) => update("language", value)}
              options={[
                { value: "all", label: t("filterAll") },
                { value: "english", label: t("filterEnglish") },
                { value: "hindi", label: t("filterHindi") },
              ]}
            />
            <FilterSelect
              icon={Globe}
              label={t("filterExpertise")}
              value={filters.expertise}
              onValueChange={(value) => update("expertise", value)}
              options={[
                { value: "all", label: t("filterAll") },
                ...expertiseOptions.map((option) => ({ value: option, label: option })),
              ]}
            />
            <FilterSelect
              icon={Star}
              label={t("filterRating")}
              value={filters.rating}
              onValueChange={(value) => update("rating", value)}
              options={[
                { value: "all", label: t("filterAll") },
                { value: "4+", label: t("filterRating4") },
                { value: "4.5+", label: t("filterRating45") },
              ]}
            />
            <FilterSelect
              icon={Timer}
              label={t("filterAvailability")}
              value={filters.availability}
              onValueChange={(value) => update("availability", value)}
              options={[
                { value: "all", label: t("filterAll") },
                { value: "online", label: t("filterOnline") },
              ]}
            />
          </div>
        </div>
      </Container>
    </div>
  )
}

type FilterSelectProps = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
}

function FilterSelect({ icon: Icon, label, value, onValueChange, options }: FilterSelectProps) {
  return (
    <div className="min-w-0">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500">
        <Icon className="h-3.5 w-3.5 text-astro-purple" aria-hidden="true" />
        {label}
      </p>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-11 w-full rounded-2xl border-gray-200 bg-gray-50/80 shadow-none hover:bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
