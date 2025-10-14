"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n-provider"
import { MapPin, Search, Bookmark, Plus, Map } from "lucide-react"

interface AddressMapProps {
  onAddressSelect: (address: string, lat: number, lng: number) => void
  initialAddress?: string
}

interface Suggestion {
  display_name: string
  lat: string
  lon: string
}

interface SavedAddress {
  id: string
  name: string
  address: string
  lat: number
  lng: number
}

// Leaflet типы
declare global {
  interface Window {
    L: any
  }
}

export function AddressMap({ onAddressSelect, initialAddress }: AddressMapProps) {
  const { t, lang } = useI18n() as any
  const [searchQuery, setSearchQuery] = useState(initialAddress || "")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [showSaved, setShowSaved] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedCoords, setSelectedCoords] = useState<{lat: number, lng: number} | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  // Load saved addresses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedAddresses")
    if (saved) {
      setSavedAddresses(JSON.parse(saved))
    }
  }, [])

  // Load Leaflet Maps API
  useEffect(() => {
    if (!window.L) {
      // Load Leaflet CSS
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
      
      // Load Leaflet JS
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.async = true
      script.onload = () => {
        setMapLoaded(true)
      }
      document.head.appendChild(script)
    } else {
      setMapLoaded(true)
    }
  }, [])

  // Initialize map when loaded
  useEffect(() => {
    if (mapLoaded && showMap && mapRef.current && !mapInstanceRef.current) {
      const map = window.L.map(mapRef.current).setView([41.2995, 69.2401], 12)

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      mapInstanceRef.current = map

      // Add click handler to map
      map.on('click', (e: any) => {
        const coords = e.latlng
        setSelectedCoords({ lat: coords.lat, lng: coords.lng })
        
        // Reverse geocoding to get address using Nominatim
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&accept-language=${lang}`)
          .then(response => response.json())
          .then(data => {
            const address = data.display_name || `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
            
            setSearchQuery(address)
            onAddressSelect(address, coords.lat, coords.lng)
            
            // Add marker
            if (markerRef.current) {
              map.removeLayer(markerRef.current)
            }
            
            markerRef.current = window.L.marker([coords.lat, coords.lng])
              .addTo(map)
              .bindPopup(address)
              .openPopup()
          })
          .catch(error => {
            console.error('Reverse geocoding error:', error)
            const address = `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
            setSearchQuery(address)
            onAddressSelect(address, coords.lat, coords.lng)
            
            if (markerRef.current) {
              map.removeLayer(markerRef.current)
            }
            
            markerRef.current = window.L.marker([coords.lat, coords.lng])
              .addTo(map)
              .bindPopup(address)
              .openPopup()
          })
      })
    }
  }, [mapLoaded, showMap])

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
  }, [searchQuery, initialAddress])

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    const lat = Number.parseFloat(suggestion.lat)
    const lng = Number.parseFloat(suggestion.lon)
    setSearchQuery(suggestion.display_name)
    onAddressSelect(suggestion.display_name, lat, lng)
    setSuggestions([])
    
    // Update map if it's open
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15)
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current)
      }
      markerRef.current = window.L.marker([lat, lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(suggestion.display_name)
        .openPopup()
    }
  }

  const handleSelectSaved = (address: SavedAddress) => {
    setSearchQuery(address.address)
    onAddressSelect(address.address, address.lat, address.lng)
    setShowSaved(false)
    
    // Update map if it's open
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([address.lat, address.lng], 15)
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current)
      }
      markerRef.current = window.L.marker([address.lat, address.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(address.address)
        .openPopup()
    }
  }

  const saveCurrentAddress = () => {
    if (!searchQuery.trim()) return
    
    const newAddress: SavedAddress = {
      id: Date.now().toString(),
      name: `Адрес ${savedAddresses.length + 1}`,
      address: searchQuery,
      lat: selectedCoords?.lat || 0,
      lng: selectedCoords?.lng || 0
    }
    
    const updated = [...savedAddresses, newAddress]
    setSavedAddresses(updated)
    localStorage.setItem("savedAddresses", JSON.stringify(updated))
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
            className="pl-8 sm:pl-10 pr-20 sm:pr-24 h-9 sm:h-10 text-sm"
          />
        </div>

        {/* Action buttons */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-5 w-5 sm:h-6 sm:w-6 p-0"
            onClick={() => setShowMap(!showMap)}
            title={t("map.showMap")}
          >
            <Map className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          </Button>
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
          <div className="absolute right-16 sm:right-20 top-1/2 -translate-y-1/2">
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {/* Interactive Map */}
      {showMap && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Map className="h-3 w-3" />
            {t("map.clickToSelect")}
          </div>
          <div 
            ref={mapRef}
            className="w-full h-64 sm:h-80 rounded-md border bg-muted/20"
            style={{ minHeight: '256px' }}
          />
          {!mapLoaded && (
            <div className="flex items-center justify-center h-64 sm:h-80 rounded-md border bg-muted/20">
              <div className="text-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t("map.loading")}</p>
              </div>
            </div>
          )}
        </div>
      )}

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
                className="h-auto w-full justify-start p-1.5 sm:p-2 text-left hover:bg-muted/50"
                onClick={() => handleSelectSaved(address)}
              >
                <div className="flex items-start gap-1.5 sm:gap-2 w-full">
                  <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs leading-tight break-words text-left">{address.address}</span>
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
                className="flex w-full items-start gap-1.5 sm:gap-2 border-b p-1.5 sm:p-2 text-left text-xs transition-colors last:border-b-0 hover:bg-muted/50"
              >
                <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 text-muted-foreground mt-0.5" />
                <span className="leading-tight break-words text-left">{suggestion.display_name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compact Hint */}
      {suggestions.length === 0 && (
        <p className="text-xs text-muted-foreground px-1">{t("map.hint")}</p>
      )}
    </div>
  )
}
