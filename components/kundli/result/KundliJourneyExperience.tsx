"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

export type JourneyPhase = "loading" | "pending" | "processing";

export const KUNDLI_JOURNEY_STEP_KEYS = [
  "stepDetails",
  "stepHouses",
  "stepPlanets",
  "stepDasha",
  "stepInsights",
  "stepFinalize",
] as const;

export const HOROSCOPE_JOURNEY_STEP_KEYS = [
  "stepDetails",
  "stepChart",
  "stepTransits",
  "stepPeriod",
  "stepPredictions",
  "stepFinalize",
] as const;

export const MATCHMAKING_JOURNEY_STEP_KEYS = [
  "stepPartners",
  "stepCharts",
  "stepGunMilan",
  "stepCompatibility",
  "stepInsights",
  "stepFinalize",
] as const;

type GenerationJourneyExperienceProps = {
  title: string;
  message: string;
  phase: JourneyPhase;
  translationNamespace: string;
  stepKeys: readonly string[];
};

type KundliJourneyExperienceProps = Omit<
  GenerationJourneyExperienceProps,
  "translationNamespace" | "stepKeys"
>;

const STEP_THRESHOLDS = [10, 24, 42, 58, 76, 90];

const phaseBounds: Record<JourneyPhase, { floor: number; ceiling: number }> = {
  loading: { floor: 6, ceiling: 34 },
  pending: { floor: 34, ceiling: 64 },
  processing: { floor: 64, ceiling: 96 },
};

export function GenerationJourneyExperience({
  title,
  message,
  phase,
  translationNamespace,
  stepKeys,
}: GenerationJourneyExperienceProps) {
  const t = useTranslations(translationNamespace);
  const { floor, ceiling } = phaseBounds[phase];
  const [progress, setProgress] = useState(floor);

  useEffect(() => {
    setProgress((prev) => Math.max(prev, floor));
  }, [floor]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= ceiling) return prev;
        const remaining = ceiling - prev;
        const step = remaining > 20 ? 2 : 1;
        return Math.min(prev + step, ceiling);
      });
    }, 180);
    return () => window.clearInterval(interval);
  }, [ceiling]);

  const steps = useMemo(
    () =>
      stepKeys.map((key, idx) => ({
        key,
        label: t(key),
        threshold: STEP_THRESHOLDS[idx] ?? 90,
      })),
    [stepKeys, t],
  );

  const currentStepIndex = steps.findIndex((step) => progress < step.threshold);
  const allStepsDone = currentStepIndex === -1;

  return (
    <div className="flex min-h-screen items-center bg-astro-dark stars-bg px-6 py-16 text-gray-900 lg:px-24">
      <Container size="narrow" className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-lg overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_24px_64px_-16px_rgba(46,10,94,0.28)]"
        >
          <div
            className="h-1.5 bg-linear-to-r from-astro-orange via-astro-yellow to-astro-purple"
            aria-hidden="true"
          />

          <div className="space-y-7 p-8 md:p-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-astro-purple/10 px-4 py-1.5 text-xs font-semibold text-astro-purple">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {t("badge")}
              </span>

              <div className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-astro-purple/15 bg-astro-yellow/20">
                <Loader2 className="h-7 w-7 animate-spin text-astro-orange" aria-hidden="true" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{message}</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
                <span>{t("progress")}</span>
                <span className="tabular-nums text-astro-orange">{Math.round(progress)}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  className="h-full rounded-full bg-linear-to-r from-astro-orange to-astro-yellow"
                  initial={{ width: "4%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              </div>
            </div>

            <ol className="space-y-2">
              {steps.map((step, idx) => {
                const done = allStepsDone || idx < currentStepIndex;
                const current = !allStepsDone && idx === currentStepIndex;

                return (
                  <motion.li
                    key={step.key}
                    layout
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-3.5 py-3 transition-colors",
                      current
                        ? "border-astro-orange/30 bg-astro-orange/5"
                        : done
                          ? "border-emerald-200/80 bg-emerald-50"
                          : "border-transparent bg-transparent",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        done
                          ? "bg-emerald-100 text-emerald-600"
                          : current
                            ? "bg-astro-orange/15 text-astro-orange"
                            : "bg-gray-100 text-gray-400",
                      )}
                    >
                      {done ? (
                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                      ) : current ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        idx + 1
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-sm leading-snug",
                        done && "font-medium text-emerald-800",
                        current && "font-medium text-gray-900",
                        !done && !current && "text-gray-400",
                      )}
                    >
                      {step.label}
                    </span>
                  </motion.li>
                );
              })}
            </ol>

            <p className="text-center text-xs text-gray-500">{t("autoUpdate")}</p>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}

export function KundliJourneyExperience(props: KundliJourneyExperienceProps) {
  return (
    <GenerationJourneyExperience
      {...props}
      translationNamespace="results.kundli.journey"
      stepKeys={KUNDLI_JOURNEY_STEP_KEYS}
    />
  );
}

export function HoroscopeJourneyExperience(props: KundliJourneyExperienceProps) {
  return (
    <GenerationJourneyExperience
      {...props}
      translationNamespace="results.horoscope.journey"
      stepKeys={HOROSCOPE_JOURNEY_STEP_KEYS}
    />
  );
}

export function MatchmakingJourneyExperience(props: KundliJourneyExperienceProps) {
  return (
    <GenerationJourneyExperience
      {...props}
      translationNamespace="results.matchmaking.journey"
      stepKeys={MATCHMAKING_JOURNEY_STEP_KEYS}
    />
  );
}
