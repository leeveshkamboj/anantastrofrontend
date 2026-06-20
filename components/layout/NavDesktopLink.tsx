import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

interface NavDesktopLinkProps {
  href: string
  label: string
  active?: boolean
}

export function NavDesktopLink({ href, label, active }: NavDesktopLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "link-reset relative inline-flex h-10 items-center px-0.5 text-sm font-medium text-black",
        "hover:opacity-80",
        active && "font-semibold"
      )}
      aria-current={active ? "page" : undefined}
    >
      {label}
      {active ? (
        <span
          className="absolute bottom-1 left-0 right-0 h-0.5 rounded-full bg-black"
          aria-hidden="true"
        />
      ) : null}
    </Link>
  )
}
