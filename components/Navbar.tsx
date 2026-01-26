"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Menu, User, LogIn, LogOut, LayoutDashboard, Sparkles, Settings, Shield } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/store/hooks/useAuth"
import { useSelector } from "react-redux"
import { selectIsAstrologer } from "@/store/slices/authSlice"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const isAstrologer = useSelector(selectIsAstrologer)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-primary-light to-cream flex items-center justify-center shadow-lg">
              <div className="w-7 h-7 rounded-full border-2 border-primary-light flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
            </div>
            <span className="text-xl md:text-2xl font-serif font-bold text-gray-900">
              AnantAstro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-white hover:bg-primary cursor-pointer">
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                    <div className="grid w-[500px] gap-3 p-4 md:grid-cols-2 bg-white rounded-md">
                      <Link
                        href="/services/kundli"
                        className="group grid h-auto w-full items-center justify-start gap-1 rounded-md p-4 text-sm font-medium transition-colors hover:bg-primary-light hover:text-gray-900 focus:bg-primary-light focus:text-gray-900 cursor-pointer"
                      >
                        <div className="text-sm font-medium leading-none text-gray-900 group-hover:text-gray-900">Kundli Generation</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600 group-hover:text-gray-700">
                          Generate your complete birth chart
                        </p>
                      </Link>
                      <Link
                        href="/services/horoscope"
                        className="group grid h-auto w-full items-center justify-start gap-1 rounded-md p-4 text-sm font-medium transition-colors hover:bg-primary-light hover:text-gray-900 focus:bg-primary-light focus:text-gray-900 cursor-pointer"
                      >
                        <div className="text-sm font-medium leading-none text-gray-900 group-hover:text-gray-900">Horoscope</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600 group-hover:text-gray-700">
                          Daily, weekly, and monthly predictions
                        </p>
                      </Link>
                      <Link
                        href="/services/matchmaking"
                        className="group grid h-auto w-full items-center justify-start gap-1 rounded-md p-4 text-sm font-medium transition-colors hover:bg-primary-light hover:text-gray-900 focus:bg-primary-light focus:text-gray-900 cursor-pointer"
                      >
                        <div className="text-sm font-medium leading-none text-gray-900 group-hover:text-gray-900">Matchmaking</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600 group-hover:text-gray-700">
                          Compatibility analysis for relationships
                        </p>
                      </Link>
                      <Link
                        href="/services/ai-reports"
                        className="group grid h-auto w-full items-center justify-start gap-1 rounded-md p-4 text-sm font-medium transition-colors hover:bg-primary-light hover:text-gray-900 focus:bg-primary-light focus:text-gray-900 cursor-pointer"
                      >
                        <div className="text-sm font-medium leading-none text-gray-900 group-hover:text-gray-900">AI Reports</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600 group-hover:text-gray-700">
                          Career, love, and personality insights
                        </p>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/astrologers" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-white focus:bg-primary focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-gray-700 cursor-pointer">
                      Astrologers
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {!isAstrologer && (
                  <NavigationMenuItem>
                    <Link href="/astrologer/register" legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-white focus:bg-primary focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-gray-700 cursor-pointer">
                        Become an Astrologer
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}

                <NavigationMenuItem>
                  <Link href="/pricing" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-white focus:bg-primary focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-gray-700 cursor-pointer">
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-white focus:bg-primary focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-gray-700 cursor-pointer">
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/contact" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-white focus:bg-primary focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-gray-700 cursor-pointer">
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-primary hover:text-white cursor-pointer overflow-hidden">
                  {isAuthenticated && user?.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt={user.name || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full object-cover w-full h-full"
                    />
                  ) : isAuthenticated && user?.name ? (
                    <div className="h-full w-full rounded-full bg-primary-dark flex items-center justify-center text-white text-sm font-semibold">
                      {getInitials(user.name)}
                    </div>
                  ) : (
                    <User className="h-5 w-5 text-primary-dark hover:text-white" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg" align="end" forceMount>
                {isAuthenticated && user ? (
                  <>
                    <div className="px-3 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-light text-primary-dark mt-1">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </span>
                      )}
                    </div>
                    {isAdmin ? (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center cursor-pointer hover:bg-primary-light hover:text-primary-dark transition-colors">
                          <Shield className="mr-2 h-4 w-4 text-primary-dark" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="flex items-center cursor-pointer hover:bg-primary-light hover:text-primary-dark transition-colors">
                            <User className="mr-2 h-4 w-4 text-primary-dark" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/reports" className="flex items-center cursor-pointer hover:bg-primary-light hover:text-primary-dark transition-colors">
                            <Sparkles className="mr-2 h-4 w-4 text-primary-dark" />
                            My Reports
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer hover:bg-primary-light hover:text-primary-dark transition-colors">
                      <LogOut className="mr-2 h-4 w-4 text-primary-dark" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login" className="flex items-center cursor-pointer hover:bg-primary-light hover:text-primary-dark transition-colors">
                        <LogIn className="mr-2 h-4 w-4 text-primary-dark" />
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/register" className="flex items-center cursor-pointer hover:bg-primary-light hover:text-primary-dark transition-colors">
                        <User className="mr-2 h-4 w-4 text-primary-dark" />
                        Register
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-white cursor-pointer">
                  <Menu className="h-6 w-6 text-gray-700 hover:text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                <DropdownMenuItem asChild>
                  <Link href="/services/kundli">Kundli Generation</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services/horoscope">Horoscope</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services/matchmaking">Matchmaking</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services/ai-reports">AI Reports</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/astrologers">Astrologers</Link>
                </DropdownMenuItem>
                {!isAstrologer && (
                  <DropdownMenuItem asChild>
                    <Link href="/astrologer/register">Become an Astrologer</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/pricing">Pricing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact">Contact</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isAuthenticated ? (
                  <>
                    {isAdmin ? (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer hover:bg-primary-light hover:text-primary-dark transition-colors">Admin Panel</Link>
                      </DropdownMenuItem>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="cursor-pointer hover:bg-primary-light hover:text-primary-dark transition-colors">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/reports" className="cursor-pointer hover:bg-primary-light hover:text-primary-dark transition-colors">My Reports</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-primary-light hover:text-primary-dark transition-colors">
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login" className="cursor-pointer hover:bg-primary-light hover:text-primary-dark transition-colors">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/register" className="cursor-pointer hover:bg-primary-light hover:text-primary-dark transition-colors">Register</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
