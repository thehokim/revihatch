"use client"

import { useState, useMemo } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/components/i18n-provider"

const products = {
  transformer: {
    name: "cfg.products.transformer.name",
    description: "cfg.products.transformer.desc",
    basePrice: 250000,
    image: "/lyuk1.png",
  },
  universal: {
    name: "cfg.products.universal.name",
    description: "cfg.products.universal.desc",
    basePrice: 250000,
    image: "/lyuk2.png",
  },
  floor: {
    name: "cfg.products.floor.name",
    description: "cfg.products.floor.desc",
    basePrice: 250000,
    image: "/lyuk3.png",
  },
  anodos: {
    name: "cfg.products.anodos.name",
    description: "cfg.products.anodos.desc",
    basePrice: 250000,
    image: "/lyuk4.png",
  },
  napolny: {
    name: "cfg.products.napolny.name",
    description: "cfg.products.napolny.desc",
    basePrice: 250000,
    image: "/lyuk1.png",
  },
}

// Ready sizes with USD pricing for Transformer
const transformerSizes = [
  { id: "30x20", label: "30 x 20", width: 30, height: 20, priceUSD: 25 },
  { id: "30x30", label: "30 x 30", width: 30, height: 30, priceUSD: 25 },
  { id: "30x40", label: "30 x 40", width: 30, height: 40, priceUSD: 27 },
  { id: "40x30", label: "40 x 30", width: 40, height: 30, priceUSD: 27 },
  { id: "40x40", label: "40 x 40", width: 40, height: 40, priceUSD: 30 },
  { id: "50x30", label: "50 x 30", width: 50, height: 30, priceUSD: 30 },
  { id: "50x40", label: "50 x 40", width: 50, height: 40, priceUSD: 32 },
  { id: "60x30", label: "60 x 30", width: 60, height: 30, priceUSD: 32 },
  { id: "50x50", label: "50 x 50", width: 50, height: 50, priceUSD: 33 },
  { id: "60x40", label: "60 x 40", width: 60, height: 40, priceUSD: 33 },
  { id: "60x50", label: "60 x 50", width: 60, height: 50, priceUSD: 34.5 },
  { id: "60x60", label: "60 x 60", width: 60, height: 60, priceUSD: 36 },
]

// Ready sizes with USD pricing for Anodos
const anodosSizes = [
  { id: "20x20", label: "20 x 20", width: 20, height: 20, priceUSD: 13 },
  { id: "25x25", label: "25 x 25", width: 25, height: 25, priceUSD: 14 },
  { id: "30x30", label: "30 x 30", width: 30, height: 30, priceUSD: 15.5 },
  { id: "30x40", label: "30 x 40", width: 30, height: 40, priceUSD: 16.5 },
  { id: "40x30", label: "40 x 30", width: 40, height: 30, priceUSD: 17.5 },
  { id: "40x40", label: "40 x 40", width: 40, height: 40, priceUSD: 19 },
  { id: "50x40", label: "50 x 40", width: 50, height: 40, priceUSD: 20.5 },
  { id: "50x50", label: "50 x 50", width: 50, height: 50, priceUSD: 22 },
  { id: "60x50", label: "60 x 50", width: 60, height: 50, priceUSD: 23.5 },
  { id: "60x60", label: "60 x 60", width: 60, height: 60, priceUSD: 25 },
]

// Ready sizes with USD pricing for Napolny
const napolnySizes = [
  { id: "50x50", label: "50 x 50", width: 50, height: 50, priceUSD: 61 },
  { id: "60x50", label: "60 x 50", width: 60, height: 50, priceUSD: 64 },
  { id: "60x60", label: "60 x 60", width: 60, height: 60, priceUSD: 66 },
  { id: "64x59", label: "64 x 59", width: 64, height: 59, priceUSD: 66 },
  { id: "70x60", label: "70 x 60", width: 70, height: 60, priceUSD: 73 },
  { id: "70x70", label: "70 x 70", width: 70, height: 70, priceUSD: 77 },
  { id: "70x80", label: "70 x 80", width: 70, height: 80, priceUSD: 81 },
  { id: "80x80", label: "80 x 80", width: 80, height: 80, priceUSD: 84 },
]

// Perimeter-based pricing for larger sizes (Transformer)
const transformerPerimeterPricing = [
  { maxPerimeter: 120, priceUSD: 35, hasDoubleDoorOption: false, hasInstallationTypeOption: false, exampleWidth: 30, exampleHeight: 30 },
  { maxPerimeter: 160, priceUSD: 40, hasDoubleDoorOption: false, hasInstallationTypeOption: false, exampleWidth: 40, exampleHeight: 40 },
  { maxPerimeter: 200, priceUSD: 45, hasDoubleDoorOption: true, hasInstallationTypeOption: false, doubleDoorSurcharge: 0.65, exampleWidth: 50, exampleHeight: 50 },
  { maxPerimeter: 240, priceUSD: 50, hasDoubleDoorOption: true, hasInstallationTypeOption: false, doubleDoorSurcharge: 0.60, exampleWidth: 60, exampleHeight: 60 },
  { maxPerimeter: 280, priceUSD: 55, hasDoubleDoorOption: true, hasInstallationTypeOption: false, doubleDoorSurcharge: 0.55, exampleWidth: 70, exampleHeight: 70 },
  { maxPerimeter: 320, priceUSD: 90, hasDoubleDoorOption: false, hasInstallationTypeOption: false, isDoubleDoor: true, exampleWidth: 80, exampleHeight: 80 },
  { maxPerimeter: 360, priceUSD: 90, hasDoubleDoorOption: false, hasInstallationTypeOption: false, isDoubleDoor: true, exampleWidth: 90, exampleHeight: 90 },
]

// Perimeter-based pricing for larger sizes (Anodos)
const anodosPerimeterPricing = [
  { maxPerimeter: 120, priceUSD: 26, hasDoubleDoorOption: false, hasInstallationTypeOption: false, exampleWidth: 30, exampleHeight: 30 },
  { maxPerimeter: 160, priceUSD: 35, hasDoubleDoorOption: false, hasInstallationTypeOption: false, exampleWidth: 40, exampleHeight: 40 },
  { maxPerimeter: 200, priceUSD: 40, hasDoubleDoorOption: false, hasInstallationTypeOption: false, exampleWidth: 50, exampleHeight: 50 },
  { maxPerimeter: 240, priceUSD: 43, hasDoubleDoorOption: false, hasInstallationTypeOption: false, exampleWidth: 60, exampleHeight: 60 },
  { maxPerimeter: 280, priceUSD: 49, hasDoubleDoorOption: false, hasInstallationTypeOption: true, ceilingSurcharge: 3, exampleWidth: 70, exampleHeight: 70 },
  { maxPerimeter: 320, priceUSD: 57, hasDoubleDoorOption: false, hasInstallationTypeOption: true, ceilingSurcharge: 3, exampleWidth: 80, exampleHeight: 80 },
  { maxPerimeter: 360, priceUSD: 65, hasDoubleDoorOption: false, hasInstallationTypeOption: true, ceilingSurcharge: 3, exampleWidth: 90, exampleHeight: 90 },
  { maxPerimeter: 400, priceUSD: 75, hasDoubleDoorOption: false, hasInstallationTypeOption: true, ceilingSurcharge: 3, exampleWidth: 100, exampleHeight: 100 },
  { maxPerimeter: 440, priceUSD: 87, hasDoubleDoorOption: false, hasInstallationTypeOption: true, ceilingSurcharge: 3, exampleWidth: 110, exampleHeight: 110 },
]

// Perimeter-based pricing for larger sizes (Napolny)
const napolnyPerimeterPricing = [
  { maxPerimeter: 160, priceUSD: 50, hasDoubleDoorOption: false, hasInstallationTypeOption: false, exampleWidth: 40, exampleHeight: 40 },
  { maxPerimeter: 240, priceUSD: 80, hasDoubleDoorOption: false, hasInstallationTypeOption: false, exampleWidth: 60, exampleHeight: 60 },
  { maxPerimeter: 280, priceUSD: 90, hasDoubleDoorOption: false, hasInstallationTypeOption: false, exampleWidth: 70, exampleHeight: 70 },
  { maxPerimeter: 320, priceUSD: 100, hasDoubleDoorOption: false, hasInstallationTypeOption: false, exampleWidth: 80, exampleHeight: 80 },
  { maxPerimeter: 400, priceUSD: 120, hasDoubleDoorOption: false, hasInstallationTypeOption: false, exampleWidth: 100, exampleHeight: 100 },
  { maxPerimeter: 480, priceUSD: 140, hasDoubleDoorOption: true, hasInstallationTypeOption: false, doubleDoorSurcharge: 0.40, exampleWidth: 120, exampleHeight: 120 },
  { maxPerimeter: 560, priceUSD: 220, hasDoubleDoorOption: false, hasInstallationTypeOption: false, isDoubleDoor: true, exampleWidth: 140, exampleHeight: 140 },
  { maxPerimeter: 640, priceUSD: 240, hasDoubleDoorOption: false, hasInstallationTypeOption: false, isDoubleDoor: true, exampleWidth: 160, exampleHeight: 160 },
  { maxPerimeter: 720, priceUSD: 260, hasDoubleDoorOption: false, hasInstallationTypeOption: false, isDoubleDoor: true, exampleWidth: 180, exampleHeight: 180 },
  { maxPerimeter: 800, priceUSD: 340, hasDoubleDoorOption: false, hasInstallationTypeOption: false, isTripleDoor: true, exampleWidth: 200, exampleHeight: 200 },
]

interface ProductConfiguratorProps {
  initialModel: string
}

export function ProductConfigurator({ initialModel }: ProductConfiguratorProps) {
  const { t } = useI18n() as any
  const router = useRouter()
  const [selectedModel, setSelectedModel] = useState(initialModel)
  
  // Initialize size based on model
  const getInitialSize = (model: string) => {
    if (model === 'anodos') return "20x20"
    if (model === 'napolny') return "50x50"
    if (model === 'floor') return "30x20"
    if (model === 'universal') return "30x20"
    return "30x20" // transformer default
  }
  
  const [selectedSize, setSelectedSize] = useState(getInitialSize(initialModel))
  const [customWidth, setCustomWidth] = useState(initialModel === 'anodos' ? 200 : initialModel === 'napolny' ? 500 : 300) // in mm
  const [customHeight, setCustomHeight] = useState(initialModel === 'anodos' ? 200 : initialModel === 'napolny' ? 500 : 200) // in mm
  const [quantity, setQuantity] = useState(1)
  const [useCustomSize, setUseCustomSize] = useState(false)
  const [usePerimeterPricing, setUsePerimeterPricing] = useState(false)
  const [selectedPerimeter, setSelectedPerimeter] = useState("")
  const [isDoubleDoor, setIsDoubleDoor] = useState(false)
  const [isCeilingInstallation, setIsCeilingInstallation] = useState(false)
  const [isTripleDoor, setIsTripleDoor] = useState(false)

  const product = products[selectedModel as keyof typeof products] || products.transformer
  
  // Get appropriate sizes and pricing based on model
  const getSizesForModel = (model: string) => {
    if (model === 'anodos') return anodosSizes
    if (model === 'napolny') return napolnySizes
    if (model === 'floor') return transformerSizes
    if (model === 'universal') return transformerSizes
    return transformerSizes
  }
  
  const getPerimeterPricingForModel = (model: string) => {
    if (model === 'anodos') return anodosPerimeterPricing
    if (model === 'napolny') return napolnyPerimeterPricing
    if (model === 'floor') return transformerPerimeterPricing
    if (model === 'universal') return transformerPerimeterPricing
    return transformerPerimeterPricing
  }
  
  const currentSizes = getSizesForModel(selectedModel)
  const currentPerimeterPricing = getPerimeterPricingForModel(selectedModel)
  
  const selectedSizeData = currentSizes.find(size => size.id === selectedSize)
  const selectedPerimeterData = currentPerimeterPricing.find(p => p.maxPerimeter.toString() === selectedPerimeter)

  // Function to handle model change
  const handleModelChange = (newModel: string) => {
    setSelectedModel(newModel)
    // Reset to appropriate initial size for the new model
    const newInitialSize = getInitialSize(newModel)
    setSelectedSize(newInitialSize)
    setUseCustomSize(false)
    setUsePerimeterPricing(false)
    setSelectedPerimeter("")
    setIsDoubleDoor(false)
    setIsCeilingInstallation(false)
    setIsTripleDoor(false)
    // Update custom dimensions based on model
    if (newModel === 'anodos') {
      setCustomWidth(200)
      setCustomHeight(200)
    } else if (newModel === 'napolny') {
      setCustomWidth(500)
      setCustomHeight(500)
    } else if (newModel === 'floor') {
      setCustomWidth(300)
      setCustomHeight(200)
    } else if (newModel === 'universal') {
      setCustomWidth(300)
      setCustomHeight(200)
    } else {
      setCustomWidth(300)
      setCustomHeight(200)
    }
    
    // Update URL to reflect the new model
    const newUrl = `/configurator?model=${newModel}`
    router.push(newUrl, { scroll: false })
  }

  // Calculate price based on selected size, custom size, or perimeter pricing
  const totalPrice = useMemo(() => {
    let priceUSD = selectedModel === 'anodos' ? 13 : selectedModel === 'napolny' ? 61 : selectedModel === 'floor' ? 25 : selectedModel === 'universal' ? 25 : 25 // default price based on model
    
    if (usePerimeterPricing && selectedPerimeterData) {
      priceUSD = selectedPerimeterData.priceUSD
      
      // Apply double door surcharge for transformer
      if (selectedPerimeterData.hasDoubleDoorOption && isDoubleDoor && 'doubleDoorSurcharge' in selectedPerimeterData && selectedPerimeterData.doubleDoorSurcharge) {
        priceUSD = priceUSD * (1 + selectedPerimeterData.doubleDoorSurcharge)
      }
      
      // Apply ceiling installation surcharge for anodos
      if (selectedPerimeterData.hasInstallationTypeOption && isCeilingInstallation && 'ceilingSurcharge' in selectedPerimeterData && selectedPerimeterData.ceilingSurcharge) {
        priceUSD = priceUSD + selectedPerimeterData.ceilingSurcharge
      }
    } else if (useCustomSize) {
      // Calculate custom price based on perimeter
      const perimeter = (customWidth + customHeight) * 2 / 10 // convert mm to cm
      
      // Find appropriate perimeter pricing
      const perimeterData = currentPerimeterPricing.find(p => perimeter <= p.maxPerimeter)
      if (perimeterData) {
        priceUSD = perimeterData.priceUSD
        
        // Apply surcharges based on model
        if (perimeterData.hasDoubleDoorOption && isDoubleDoor && 'doubleDoorSurcharge' in perimeterData && perimeterData.doubleDoorSurcharge) {
          priceUSD = priceUSD * (1 + perimeterData.doubleDoorSurcharge)
        }
        if (perimeterData.hasInstallationTypeOption && isCeilingInstallation && 'ceilingSurcharge' in perimeterData && perimeterData.ceilingSurcharge) {
          priceUSD = priceUSD + perimeterData.ceilingSurcharge
        }
      } else {
        // For very large perimeters, use the highest tier
        const highestTier = currentPerimeterPricing[currentPerimeterPricing.length - 1]
        priceUSD = highestTier.priceUSD
        if (highestTier.hasInstallationTypeOption && isCeilingInstallation && 'ceilingSurcharge' in highestTier && highestTier.ceilingSurcharge) {
          priceUSD = priceUSD + highestTier.ceilingSurcharge
        }
      }
    } else if (selectedSizeData) {
      priceUSD = selectedSizeData.priceUSD
    }
    
    // Convert to UZS (assuming 1 USD = 12500 UZS)
    const priceUZS = Math.round(priceUSD * 12500)
    return priceUZS * quantity
  }, [selectedModel, selectedSize, customWidth, customHeight, quantity, useCustomSize, usePerimeterPricing, selectedPerimeter, isDoubleDoor, isCeilingInstallation, selectedSizeData, selectedPerimeterData, currentPerimeterPricing])

  // Calculate current dimensions based on selected option
  const currentWidth = useMemo(() => {
    if (useCustomSize) {
      return customWidth / 10 // convert mm to cm
    } else if (usePerimeterPricing && selectedPerimeterData) {
      return selectedPerimeterData.exampleWidth
    } else if (selectedSizeData) {
      return selectedSizeData.width
    }
    return 30 // default
  }, [useCustomSize, customWidth, usePerimeterPricing, selectedPerimeterData, selectedSizeData])

  const currentHeight = useMemo(() => {
    if (useCustomSize) {
      return customHeight / 10 // convert mm to cm
    } else if (usePerimeterPricing && selectedPerimeterData) {
      return selectedPerimeterData.exampleHeight
    } else if (selectedSizeData) {
      return selectedSizeData.height
    }
    return 20 // default
  }, [useCustomSize, customHeight, usePerimeterPricing, selectedPerimeterData, selectedSizeData])

  const perimeter = useMemo(() => {
    return (currentWidth + currentHeight) * 2
  }, [currentWidth, currentHeight])

  const handleAddToCart = () => {
    const orderData = {
      model: selectedModel,
      modelName: product.name,
      width: currentWidth,
      height: currentHeight,
      quantity,
      totalPrice,
    }
    localStorage.setItem("currentOrder", JSON.stringify(orderData))
    router.push("/checkout")
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 lg:px-16">
      <div className="grid gap-8 lg:gap-16 lg:grid-cols-2">
        {/* Left Column - Diagram and Info */}
        <div className="sticky top-4 lg:top-8 self-start z-20">
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              {/* Product Title */}
              <div>
                <h2 className="text-2xl font-bold text-black mb-2">{t(product.name)}</h2>
              </div>

              {/* Diagram */}
              <div className="relative z-20 bg-white rounded-lg p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 border-2 border-black rounded-lg">
                  {/* Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-px bg-gray-300"></div>
                    <div className="absolute w-px h-full bg-gray-300"></div>
                  </div>
                  
                  {/* Single door hinge indicator */}
                  {!isDoubleDoor && !isTripleDoor && (
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                  )}
                  
                  {/* Double door hinge indicators */}
                  {isDoubleDoor && !isTripleDoor && (
                    <>
                      <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                      <div className="absolute top-1/2 right-1/2 transform -translate-y-1/2 -translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                      {/* Vertical divider line for double door */}
                      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-400"></div>
                    </>
                  )}
                  
                  {/* Triple door hinge indicators */}
                  {isTripleDoor && (
                    <>
                      <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 -translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                      <div className="absolute top-1/2 right-1/3 transform -translate-y-1/2 translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                      {/* Vertical divider lines for triple door */}
                      <div className="absolute top-0 bottom-0 left-1/3 w-px bg-gray-400"></div>
                      <div className="absolute top-0 bottom-0 right-1/3 w-px bg-gray-400"></div>
                    </>
                  )}
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("cfg.size")}:</span>
                  <span className="font-medium">{currentWidth} {t("cfg.units.cm")} х {currentHeight} {t("cfg.units.cm")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("cfg.perimeter")}:</span>
                  <span className="font-medium">{perimeter} {t("cfg.units.cm")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("cfg.flaps")}:</span>
                  <span className="font-medium">
                    {isTripleDoor ? t("cfg.doorTypes.tripleEven") : isDoubleDoor ? t("cfg.doorTypes.doubleCenter") : t("cfg.doorTypes.singleRight")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Configuration Options */}
        <div className="relative z-10 bg-white rounded-xl border border-gray-100 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Model Selection */}
        <div>
          <h3 className="text-lg font-bold text-black mb-4">{t("cfg.modelSelection")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              onClick={() => handleModelChange('transformer')}
              className={`p-3 border-2 rounded-lg text-center transition-colors ${
                selectedModel === 'transformer'
                  ? 'bg-white border-gray-600'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-black">{t("cfg.transformer")}</div>
              <div className="text-sm text-gray-600">{t("cfg.transformerDesc")}</div>
            </button>
            <button
              onClick={() => handleModelChange('anodos')}
              className={`p-3 border-2 rounded-lg text-center transition-colors ${
                selectedModel === 'anodos'
                  ? 'bg-white border-gray-600'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-black">{t("cfg.anodos")}</div>
              <div className="text-sm text-gray-600">{t("cfg.anodosDesc")}</div>
            </button>
            <button
              onClick={() => handleModelChange('napolny')}
              className={`p-3 border-2 rounded-lg text-center transition-colors ${
                selectedModel === 'napolny'
                  ? 'bg-white border-gray-600'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-black">{t("cfg.napolny")}</div>
              <div className="text-sm text-gray-600">{t("cfg.napolnyDesc")}</div>
            </button>
          </div>
        </div>

        {/* Ready Sizes */}
        <div>
          <h3 className="text-lg font-bold text-black mb-4">{t("cfg.readySizes")}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {currentSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => {
                  setSelectedSize(size.id)
                  setUseCustomSize(false)
                  setUsePerimeterPricing(false)
                  // Auto-determine door type based on size
                  const sizePerimeter = (size.width + size.height) * 2
                  if (sizePerimeter > 200) {
                    setIsDoubleDoor(true)
                  } else {
                    setIsDoubleDoor(false)
                  }
                }}
                className={`p-3 border-2 rounded-lg text-center transition-colors ${
                  selectedSize === size.id && !useCustomSize && !usePerimeterPricing
                    ? 'bg-white border-gray-600'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-black">{size.label}</div>
                <div className="text-sm text-gray-600">({size.priceUSD} $)</div>
              </button>
            ))}
          </div>
        </div>

        {/* Perimeter Pricing */}
        <div>
          <h3 className="text-lg font-bold text-black mb-4">{t("cfg.perimeterPricing")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentPerimeterPricing.map((pricing) => (
              <button
                key={pricing.maxPerimeter}
                onClick={() => {
                  setSelectedPerimeter(pricing.maxPerimeter.toString())
                  setUsePerimeterPricing(true)
                  setUseCustomSize(false)
                  // Set door type based on model
                  if (selectedModel === 'transformer') {
                    setIsDoubleDoor('isDoubleDoor' in pricing ? pricing.isDoubleDoor || false : false)
                    setIsTripleDoor(false)
                  } else if (selectedModel === 'napolny') {
                    setIsDoubleDoor('isDoubleDoor' in pricing ? pricing.isDoubleDoor || false : false)
                    setIsTripleDoor('isTripleDoor' in pricing && pricing.isTripleDoor ? true : false)
                  } else if (selectedModel === 'floor') {
                    setIsDoubleDoor('isDoubleDoor' in pricing ? pricing.isDoubleDoor || false : false)
                    setIsTripleDoor(false)
                  } else if (selectedModel === 'universal') {
                    setIsDoubleDoor('isDoubleDoor' in pricing ? pricing.isDoubleDoor || false : false)
                    setIsTripleDoor(false)
                  } else {
                    setIsDoubleDoor(false) // Anodos doesn't have double door option
                    setIsTripleDoor(false)
                  }
                  // Reset installation type for anodos
                  if (selectedModel === 'anodos') {
                    setIsCeilingInstallation(false)
                  }
                }}
                className={`p-3 border-2 rounded-lg text-center transition-colors ${
                  selectedPerimeter === pricing.maxPerimeter.toString() && usePerimeterPricing
                    ? 'bg-white border-gray-600'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-black">{t("cfg.upTo")} {pricing.maxPerimeter} {t("cfg.units.cm")}</div>
                <div className="text-sm text-gray-600">({pricing.priceUSD} $)</div>
                <div className="text-xs text-gray-500 mt-1">
                  {t("cfg.example")}: {pricing.exampleWidth}×{pricing.exampleHeight} {t("cfg.units.cm")}
                </div>
                {'isDoubleDoor' in pricing && pricing.isDoubleDoor && (
                  <div className="text-xs text-blue-600 mt-1">{t("cfg.doubleDoorLabel")}</div>
                )}
                {'isTripleDoor' in pricing && (pricing as any).isTripleDoor && (
                  <div className="text-xs text-purple-600 mt-1">{t("cfg.tripleDoorLabel")}</div>
                )}
                {pricing.hasInstallationTypeOption && (
                  <div className="text-xs text-green-600 mt-1">{t("cfg.installationChoice")}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Double Door Option - for Transformer */}
        {selectedPerimeterData?.hasDoubleDoorOption && selectedModel === 'transformer' && (
          <div>
            <h3 className="text-lg font-bold text-black mb-4">{t("cfg.doorType")}</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setIsDoubleDoor(false)}
                className={`p-3 border-2 rounded-lg text-center transition-colors flex-1 ${
                  !isDoubleDoor
                    ? 'bg-white border-gray-600'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-black">{t("cfg.singleDoor")}</div>
              </button>
              <button
                onClick={() => setIsDoubleDoor(true)}
                className={`p-3 border-2 rounded-lg text-center transition-colors flex-1 ${
                  isDoubleDoor
                    ? 'bg-white border-gray-600'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-black">{t("cfg.doubleDoor")}</div>
                <div className="text-sm text-gray-600">
                  (+{Math.round(('doubleDoorSurcharge' in selectedPerimeterData && selectedPerimeterData.doubleDoorSurcharge ? selectedPerimeterData.doubleDoorSurcharge : 0) * 100)}%)
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Installation Type Option - for Anodos */}
        {selectedPerimeterData?.hasInstallationTypeOption && selectedModel === 'anodos' && (
          <div>
            <h3 className="text-lg font-bold text-black mb-4">{t("cfg.installationType")}</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setIsCeilingInstallation(false)}
                className={`p-3 border-2 rounded-lg text-center transition-colors flex-1 ${
                  !isCeilingInstallation
                    ? 'bg-white border-gray-600'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-black">{t("cfg.wallMount")}</div>
                <div className="text-sm text-gray-600">{t("cfg.basePrice")}</div>
              </button>
              <button
                onClick={() => setIsCeilingInstallation(true)}
                className={`p-3 border-2 rounded-lg text-center transition-colors flex-1 ${
                  isCeilingInstallation
                    ? 'bg-white border-gray-600'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-black">{t("cfg.ceilingMount")}</div>
                <div className="text-sm text-gray-600">
                  (+{'ceilingSurcharge' in selectedPerimeterData && selectedPerimeterData.ceilingSurcharge ? selectedPerimeterData.ceilingSurcharge : 0} $)
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Custom Size */}
        <div>
          <h3 className="text-lg font-bold text-black mb-4">{t("cfg.customSize")}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="custom-width" className="text-sm font-medium text-gray-700">{t("cfg.widthLabel")}</Label>
              <div className="relative mt-1">
                <Input
                  id="custom-width"
                  type="number"
                  value={customWidth}
                  onChange={(e) => {
                    const newWidth = Number(e.target.value)
                    setCustomWidth(newWidth)
                    setUseCustomSize(true)
                    setUsePerimeterPricing(false)
                    // Auto-determine door type based on perimeter
                    const newPerimeter = (newWidth + customHeight) * 2 / 10
                    if (newPerimeter > 200) {
                      setIsDoubleDoor(true)
                    } else {
                      setIsDoubleDoor(false)
                    }
                  }}
                  className="pr-8 border-gray-300"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">{t("cfg.units.mm")}</div>
              </div>
            </div>
            <div>
              <Label htmlFor="custom-height" className="text-sm font-medium text-gray-700">{t("cfg.heightLabel")}</Label>
              <div className="relative mt-1">
                <Input
                  id="custom-height"
                  type="number"
                  value={customHeight}
                  onChange={(e) => {
                    const newHeight = Number(e.target.value)
                    setCustomHeight(newHeight)
                    setUseCustomSize(true)
                    setUsePerimeterPricing(false)
                    // Auto-determine door type based on perimeter
                    const newPerimeter = (customWidth + newHeight) * 2 / 10
                    if (newPerimeter > 200) {
                      setIsDoubleDoor(true)
                    } else {
                      setIsDoubleDoor(false)
                    }
                  }}
                  className="pr-8 border-gray-300"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">{t("cfg.units.mm")}</div>
              </div>
            </div>
          </div>
          {useCustomSize && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                {t("cfg.perimeter")}: {((customWidth + customHeight) * 2 / 10).toFixed(1)} {t("cfg.units.cm")}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {t("cfg.doorType")}: {isTripleDoor ? t("cfg.doorTypes.tripleEven") : isDoubleDoor ? t("cfg.doorTypes.doubleCenter") : t("cfg.doorTypes.singleRight")}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {t("cfg.priceCalculation")}
              </div>
            </div>
          )}
        </div>

        {/* Quantity */}
        <div>
          <h3 className="text-lg font-bold text-black mb-4">{t("cfg.quantity")}</h3>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 hover:bg-gray-100 rounded-l-lg rounded-r-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center border-l border-r border-gray-300 px-4 py-2">
              <div className="text-lg font-medium">{quantity} {t("cfg.pcs")}</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 hover:bg-gray-100 rounded-r-lg rounded-l-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Total Price */}
        <div>
          <h3 className="text-lg font-bold text-black mb-4">{t("cfg.total")}</h3>
          <div className="text-3xl font-bold text-black mb-6">
            {new Intl.NumberFormat('ru-RU').format(totalPrice)} сум
          </div>
          
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-medium rounded-lg" 
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {t("cfg.checkout")}
          </Button>
        </div>
        </div>
      </div>
    </div>
  )
}