import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="celestial-header relative min-h-[40vh] flex flex-col items-center justify-start pt-8 px-6 md:px-12">
      {/* Zodiac symbols decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-48 overflow-hidden pointer-events-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Zodiac symbols as decorative elements - arranged in semicircle */}
          <div className="absolute inset-0 flex items-end justify-center pb-8">
            <div className="text-primary-light/30 text-5xl md:text-7xl font-bold tracking-widest">
              <span className="inline-block transform -rotate-12">♈</span>
              <span className="inline-block mx-2 transform -rotate-6">♉</span>
              <span className="inline-block mx-2">♊</span>
              <span className="inline-block mx-2 transform rotate-6">♋</span>
              <span className="inline-block mx-2 transform rotate-12">♌</span>
              <span className="inline-block mx-2 transform rotate-[18deg]">♍</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top navigation bar */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-primary-light to-cream flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 rounded-full border-2 border-primary-light flex items-center justify-center">
              <span className="text-white text-lg font-bold">A</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">
            AnantAstro
          </h1>
        </div>

        {/* HERUX Button */}
        <Button
          variant="outline"
          className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50"
        >
          HERUX
        </Button>
      </div>
    </header>
  )
}
