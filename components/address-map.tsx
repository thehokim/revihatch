"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n-provider"
import { MapPin, Search, Bookmark, Plus, Map } from "lucide-react"
import "./address-map.css"

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

  const createCustomMarker = (address: string) => {
    return window.L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-container">
          <div class="marker-pulse"></div>
          <div class="marker-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#ef4444"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    })
  }

  useEffect(() => {
    const saved = localStorage.getItem("savedAddresses")
    if (saved) {
      setSavedAddresses(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (!window.L) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
      
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

  useEffect(() => {
    if (mapLoaded && showMap && mapRef.current && !mapInstanceRef.current) {
      const map = window.L.map(mapRef.current).setView([41.2995, 69.2401], 12)

      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map)

      mapInstanceRef.current = map

      map.on('click', (e: any) => {
        const coords = e.latlng
        setSelectedCoords({ lat: coords.lat, lng: coords.lng })
        
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&accept-language=${lang}`)
          .then(response => response.json())
          .then(data => {
            const address = data.display_name || `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
            
            setSearchQuery(address)
            onAddressSelect(address, coords.lat, coords.lng)
            
            if (markerRef.current) {
              map.removeLayer(markerRef.current)
            }
            
            markerRef.current = window.L.marker([coords.lat, coords.lng], { icon: createCustomMarker(address) })
              .addTo(map)
              .bindPopup(`
                <div class="popup-content">
                  <div class="popup-icon">📍</div>
                  <div class="popup-text">${address}</div>
                </div>
              `)
              .openPopup()
          })
          .catch(error => {
            const address = `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
            setSearchQuery(address)
            onAddressSelect(address, coords.lat, coords.lng)
            
            if (markerRef.current) {
              map.removeLayer(markerRef.current)
            }
            
            markerRef.current = window.L.marker([coords.lat, coords.lng], { icon: createCustomMarker(address) })
              .addTo(map)
              .bindPopup(`
                <div class="popup-content">
                  <div class="popup-icon">📍</div>
                  <div class="popup-text">${address}</div>
                </div>
              `)
              .openPopup()
          })
      })
    }
  }, [mapLoaded, showMap])

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
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15)
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current)
      }
      markerRef.current = window.L.marker([lat, lng], { icon: createCustomMarker(suggestion.display_name) })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="popup-content">
            <div class="popup-icon">📍</div>
            <div class="popup-text">${suggestion.display_name}</div>
          </div>
        `)
        .openPopup()
    }
  }

  const handleSelectSaved = (address: SavedAddress) => {
    setSearchQuery(address.address)
    onAddressSelect(address.address, address.lat, address.lng)
    setShowSaved(false)
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([address.lat, address.lng], 15)
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current)
      }
      markerRef.current = window.L.marker([address.lat, address.lng], { icon: createCustomMarker(address.address) })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="popup-content">
            <div class="popup-icon">📍</div>
            <div class="popup-text">${address.address}</div>
          </div>
        `)
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
      <div className="relative">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder={t("map.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-24 h-11 text-sm border-2 focus:border-primary transition-all duration-200 rounded-xl"
          />
        </div>

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5">
          <Button
            size="sm"
            variant={showMap ? "default" : "ghost"}
            className="h-7 w-7 p-0 rounded-lg transition-all duration-200 hover:scale-105"
            onClick={() => setShowMap(!showMap)}
            title={t("map.showMap")}
          >
            <Map className="h-4 w-4" />
          </Button>
          {searchQuery.trim() && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 rounded-lg transition-all duration-200 hover:scale-105 hover:bg-green-100 hover:text-green-600"
              onClick={saveCurrentAddress}
              title={t("map.saveAddress")}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
          {savedAddresses.length > 0 && (
            <Button
              size="sm"
              variant={showSaved ? "default" : "ghost"}
              className="h-7 w-7 p-0 rounded-lg transition-all duration-200 hover:scale-105"
              onClick={() => setShowSaved(!showSaved)}
              title={t("map.savedAddresses")}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isSearching && (
          <div className="absolute right-16 sm:right-20 top-1/2 -translate-y-1/2">
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {showMap && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
            <Map className="h-4 w-4 text-primary" />
            {t("map.clickToSelect")}
          </div>
          <div 
            ref={mapRef}
            className="w-full h-80 sm:h-96 rounded-xl border-2 border-border overflow-hidden"
            style={{ minHeight: '320px' }}
          />
          {!mapLoaded && (
            <div className="flex items-center justify-center h-80 sm:h-96 rounded-xl border-2 border-border bg-gradient-to-br from-muted/20 to-muted/40">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-medium">{t("map.loading")}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {showSaved && savedAddresses.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
            <Bookmark className="h-4 w-4 text-primary" />
            {t("map.savedAddresses")}
          </div>
          <div className="grid gap-2">
            {savedAddresses.map((address) => (
              <Button
                key={address.id}
                variant="ghost"
                className="h-auto w-full justify-start p-3 text-left hover:bg-muted/50 rounded-xl border border-border/50 hover:border-border transition-all duration-200"
                onClick={() => handleSelectSaved(address)}
              >
                <div className="flex items-start gap-3 w-full">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                  <span className="text-sm leading-relaxed break-words text-left">{address.address}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}
      {suggestions.length === 0 && !showMap && (
        <div className="bg-muted/30 px-4 py-3 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground text-center">{t("map.hint")}</p>
        </div>
      )}
    </div>
  )
}
