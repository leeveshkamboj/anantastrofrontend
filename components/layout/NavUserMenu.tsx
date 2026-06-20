"use client"

import Image from "next/image"
import { Link, useRouter } from "@/i18n/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileText,
  LogIn,
  LogOut,
  MessageCircle,
  Shield,
  User,
  Wallet,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useSelector } from "react-redux"
import { useAuth } from "@/store/hooks/useAuth"
import { selectIsAstrologer } from "@/store/slices/authSlice"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function NavUserMenu() {
  const t = useTranslations("nav")
  const router = useRouter()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const isAstrologer = useSelector(selectIsAstrologer)

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-black text-white"
          aria-label={isAuthenticated ? t("profile") : t("login")}
        >
          {isAuthenticated && user?.profileImage ? (
            <Image
              src={user.profileImage}
              alt={user.name || "User"}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : isAuthenticated && user?.name ? (
            <span className="text-sm font-semibold">{getInitials(user.name)}</span>
          ) : (
            <User className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {isAuthenticated && user ? (
          <>
            <div className="border-b px-3 py-2">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-gray-500">{user.email}</p>
              {isAdmin && (
                <span className="mt-1 inline-flex items-center rounded bg-astro-orange/10 px-2 py-0.5 text-xs font-medium text-astro-orange">
                  <Shield className="mr-1 h-3 w-3" />
                  {t("adminBadge")}
                </span>
              )}
            </div>
            {isAdmin ? (
              <DropdownMenuItem asChild>
                <Link href="/admin">{t("adminPanel")}</Link>
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/profile">{t("profile")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/reports">{t("myReports")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wallet">{t("walletCoins")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/conversations">{t("conversations")}</Link>
                </DropdownMenuItem>
                {isAstrologer && (
                  <DropdownMenuItem asChild>
                    <Link href="/astrologer">{t("dashboard")}</Link>
                  </DropdownMenuItem>
                )}
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 inline h-4 w-4" />
              {t("logout")}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/auth/login">
                <LogIn className="mr-2 inline h-4 w-4" />
                {t("login")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/auth/register">
                <User className="mr-2 inline h-4 w-4" />
                {t("register")}
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
