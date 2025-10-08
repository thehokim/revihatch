"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/components/i18n-provider"
import { MapPin, Search } from "lucide-react"

interface AddressMapProps {
  onAddressSelect: (address: string, lat: number, lng: number) => void
  initialAddress?: string
}

interface Suggestion {
  display_name: string
  lat: string
  lon: string
}

export function AddressMap({ onAddressSelect, initialAddress }: AddressMapProps) {
  const { t, lang } = useI18n() as any
  const [searchQuery, setSearchQuery] = useState(initialAddress || "")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&accept-language=${lang}&limit=5`,
        )
        const data = await response.json()
        setSuggestions(data)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsSearching(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    const lat = Number.parseFloat(suggestion.lat)
    const lng = Number.parseFloat(suggestion.lon)
    setSelectedLocation({ lat, lng })
    setSearchQuery(suggestion.display_name)
    onAddressSelect(suggestion.display_name, lat, lng)
    setSuggestions([])
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("map.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute z-50 mt-2 w-full rounded-lg border bg-background shadow-lg">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="flex w-full items-start gap-3 border-b p-3 text-left text-sm transition-colors last:border-b-0 hover:bg-muted"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{suggestion.display_name}</span>
              </button>
            ))}
          </div>
        )}

        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {/* Map Preview */}
      <div className="relative h-[400px] overflow-hidden rounded-lg border bg-muted">
        {selectedLocation ? (
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedLocation.lng - 0.01},${selectedLocation.lat - 0.01},${selectedLocation.lng + 0.01},${selectedLocation.lat + 0.01}&layer=mapnik&marker=${selectedLocation.lat},${selectedLocation.lng}`}
            className="border-0"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="rounded-full bg-background p-4">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="mb-1 font-medium">{t("map.pickAddress")}</p>
              <p className="text-sm text-muted-foreground">{t("map.startTyping")}</p>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">{t("map.hint")}</p>
    </div>
  )
}
