"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n-provider"
import { MapPin, Search, Clock, Star, Bookmark, Plus } from "lucide-react"

interface AddressMapProps {
  onAddressSelect: (address: string, lat: number, lng: number) => void
  initialAddress?: string
}

interface Suggestion {
  display_name: string
  lat: string
  lon: string
}

// Популярные адреса для быстрого выбора
const popularAddresses = [
  {
    name: "г. Ташкент, Бектемирский район, рынок \"Куйлюк\", магазин 36-А",
    lat: 41.2995,
    lng: 69.2401,
    type: "shop"
  },
  {
    name: "г. Ташкент, Чиланзарский район, ТЦ \"Самарканд Дарвоза\"",
    lat: 41.3111,
    lng: 69.2797,
    type: "mall"
  },
  {
    name: "г. Ташкент, Мирзо-Улугбекский район, ТЦ \"Next\"",
    lat: 41.3153,
    lng: 69.2489,
    type: "mall"
  },
  {
    name: "г. Ташкент, Яшнабадский район, ТЦ \"Mega Planet\"",
    lat: 41.3406,
    lng: 69.2847,
    type: "mall"
  }
]

interface SavedAddress {
  id: string
  name: string
  address: string
  lat: number
  lng: number
}

export function AddressMap({ onAddressSelect, initialAddress }: AddressMapProps) {
  const { t, lang } = useI18n() as any
  const [searchQuery, setSearchQuery] = useState(initialAddress || "")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showPopular, setShowPopular] = useState(!initialAddress)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [showSaved, setShowSaved] = useState(false)

  // Load saved addresses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedAddresses")
    if (saved) {
      setSavedAddresses(JSON.parse(saved))
    }
  }, [])

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSuggestions([])
      setShowPopular(!initialAddress && searchQuery.length === 0)
      return
    }

    setShowPopular(false)
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
  }, [searchQuery, initialAddress])

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    const lat = Number.parseFloat(suggestion.lat)
    const lng = Number.parseFloat(suggestion.lon)
    setSearchQuery(suggestion.display_name)
    onAddressSelect(suggestion.display_name, lat, lng)
    setSuggestions([])
    setShowPopular(false)
  }

  const handleSelectPopular = (address: typeof popularAddresses[0]) => {
    setSearchQuery(address.name)
    onAddressSelect(address.name, address.lat, address.lng)
    setShowPopular(false)
  }

  const handleSelectSaved = (address: SavedAddress) => {
    setSearchQuery(address.address)
    onAddressSelect(address.address, address.lat, address.lng)
    setShowSaved(false)
  }

  const saveCurrentAddress = () => {
    if (!searchQuery.trim()) return
    
    const newAddress: SavedAddress = {
      id: Date.now().toString(),
      name: `Адрес ${savedAddresses.length + 1}`,
      address: searchQuery,
      lat: 0, // Will be updated when address is selected
      lng: 0
    }
    
    const updated = [...savedAddresses, newAddress]
    setSavedAddresses(updated)
    localStorage.setItem("savedAddresses", JSON.stringify(updated))
  }


  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'shop': return <MapPin className="h-4 w-4" />
      case 'mall': return <Star className="h-4 w-4" />
      default: return <MapPin className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("map.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 sm:pl-10 pr-16 sm:pr-20 h-9 sm:h-10 text-sm"
          />
        </div>

        {/* Action buttons */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
          {searchQuery.trim() && (
            <Button
              size="sm"
              variant="ghost"
              className="h-5 w-5 sm:h-6 sm:w-6 p-0"
              onClick={saveCurrentAddress}
              title={t("map.saveAddress")}
            >
              <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </Button>
          )}
          {savedAddresses.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="h-5 w-5 sm:h-6 sm:w-6 p-0"
              onClick={() => setShowSaved(!showSaved)}
              title={t("map.savedAddresses")}
            >
              <Bookmark className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </Button>
          )}
        </div>

        {isSearching && (
          <div className="absolute right-10 sm:right-12 top-1/2 -translate-y-1/2">
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {/* Saved Addresses */}
      {showSaved && savedAddresses.length > 0 && (
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center gap-1 sm:gap-2 text-xs font-medium text-muted-foreground">
            <Bookmark className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            {t("map.savedAddresses")}
          </div>
          <div className="grid gap-1 sm:gap-1.5">
            {savedAddresses.map((address) => (
              <Button
                key={address.id}
                variant="ghost"
                className="h-auto justify-start p-1.5 sm:p-2 text-left hover:bg-muted/50"
                onClick={() => handleSelectSaved(address)}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                  <span className="text-xs leading-tight truncate">{address.address}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Addresses */}
      {showPopular && !showSaved && (
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center gap-1 sm:gap-2 text-xs font-medium text-muted-foreground">
            <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            {t("map.popularAddresses")}
          </div>
          <div className="grid gap-1 sm:gap-1.5">
            {popularAddresses.map((address, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-auto justify-start p-1.5 sm:p-2 text-left hover:bg-muted/50"
                onClick={() => handleSelectPopular(address)}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="flex-shrink-0">
                    {getAddressIcon(address.type)}
                  </div>
                  <span className="text-xs leading-tight truncate">{address.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground px-1">
            {t("map.searchResults")}
          </div>
          <div className="rounded-md border bg-background shadow-sm">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="flex w-full items-center gap-1.5 sm:gap-2 border-b p-1.5 sm:p-2 text-left text-xs transition-colors last:border-b-0 hover:bg-muted/50"
              >
                <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 text-muted-foreground" />
                <span className="leading-tight truncate">{suggestion.display_name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compact Hint */}
      {!showPopular && suggestions.length === 0 && (
        <p className="text-xs text-muted-foreground px-1">{t("map.hint")}</p>
      )}
    </div>
  )
}
