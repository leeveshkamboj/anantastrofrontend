"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Discover Your Future?
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied users who have found guidance and clarity through AnantAstro.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-primary hover:bg-[#d6682a] text-white font-bold text-lg py-6 px-8 rounded-lg hover:shadow-lg transition-all"
            size="lg"
          >
            <Link href="/register">Get Started Free</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="text-lg py-6 px-8"
            size="lg"
          >
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

