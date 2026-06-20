"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { useMotion } from "@/components/motion"
import { getPresetForTier, getReducedPreset, getTransition } from "@/lib/motion"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const { reduced } = useMotion()
  const variants = reduced
    ? getReducedPreset("slideInRight")
    : getPresetForTier("slideInRight", "instrument")
  const transition = reduced ? { duration: 0 } : getTransition("instrument")
  const hidden = variants.hidden
  const visible = variants.visible
  const hiddenX = typeof hidden === "object" && hidden !== null && "x" in hidden ? hidden.x : 32
  const hiddenOpacity =
    typeof hidden === "object" && hidden !== null && "opacity" in hidden ? hidden.opacity : 0

  return (
    <>
      <style>{`
        [data-sonner-toaster][data-x-position='right'] [data-sonner-toast][data-mounted='true'] {
          animation: sonner-slide-in-right ${transition.duration}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        [data-sonner-toaster][data-x-position='left'] [data-sonner-toast][data-mounted='true'] {
          animation: sonner-slide-in-left ${transition.duration}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes sonner-slide-in-right {
          from {
            transform: translateX(${typeof hiddenX === "number" ? hiddenX : 32}px);
            opacity: ${hiddenOpacity};
          }
          to {
            transform: translateX(0);
            opacity: ${typeof visible === "object" && visible !== null && "opacity" in visible ? visible.opacity : 1};
          }
        }
        @keyframes sonner-slide-in-left {
          from {
            transform: translateX(-${typeof hiddenX === "number" ? hiddenX : 32}px);
            opacity: ${hiddenOpacity};
          }
          to {
            transform: translateX(0);
            opacity: ${typeof visible === "object" && visible !== null && "opacity" in visible ? visible.opacity : 1};
          }
        }
      `}</style>
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        icons={{
          success: <CircleCheckIcon className="size-4 text-green-600" />,
          info: <InfoIcon className="size-4 text-blue-600" />,
          warning: <TriangleAlertIcon className="size-4 text-yellow-600" />,
          error: <OctagonXIcon className="size-4 text-red-600" />,
          loading: <Loader2Icon className="size-4 animate-spin text-gray-600" />,
        }}
        toastOptions={{
          classNames: {
            toast: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
            success: "bg-white dark:bg-gray-900",
            error: "bg-white dark:bg-gray-900",
            warning: "bg-white dark:bg-gray-900",
            info: "bg-white dark:bg-gray-900",
          },
        }}
        style={
          {
            "--normal-bg": "hsl(var(--popover))",
            "--normal-text": "hsl(var(--popover-foreground))",
            "--normal-border": "hsl(var(--border))",
            "--border-radius": "var(--radius)",
          } as React.CSSProperties
        }
        {...props}
      />
    </>
  )
}

export { Toaster }
