import { Hero } from "@/components/hero"
import { ProductGrid } from "@/components/product-grid"
import { Statistics } from "@/components/statistics"
import { Reviews } from "@/components/reviews"
import { FAQ } from "@/components/faq"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        <ProductGrid />
        <Statistics />
        <Reviews />
        <FAQ />
      </main>
    </div>
  )
}
