"use client"

import { useState, useMemo, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/components/i18n-provider"
import { convertApiSizesToLocal, getPriceForSize, getLocalizedProduct } from "@/lib/api"
import { LocalProductSize, SupportedLanguage } from "@/lib/types"
import { useProducts } from "@/hooks/use-products"

interface ProductConfiguratorProps {
  productId: string
}

export function ProductConfigurator({ productId }: ProductConfiguratorProps) {
  const { t, lang } = useI18n() as any
  const router = useRouter()
  const currentLanguage = lang === 'uz' ? 'uz' : 'ru' as SupportedLanguage
  const { products: apiProducts, loading, getProductById } = useProducts(currentLanguage)
  
  // Get the specific product by ID
  const product = getProductById(productId)
  
  const getInitialSize = (product: any) => {
    if (product && product.sizes.length > 0) {
      return product.sizes[0].size
    }
    return "20x20" // fallback
  }
  
  const getInitialDimensions = (product: any) => {
    if (product && product.sizes.length > 0) {
      const firstSize = product.sizes[0].size
      const [width, height] = firstSize.split('x').map(Number)
      return { width, height }
    }
    return { width: 20, height: 20 } // fallback
  }

  const initialDimensions = product ? getInitialDimensions(product) : { width: 20, height: 20 }
  const [selectedSize, setSelectedSize] = useState(product ? getInitialSize(product) : "20x20")
  const [customWidth, setCustomWidth] = useState(initialDimensions.width) // in cm
  const [customHeight, setCustomHeight] = useState(initialDimensions.height) // in cm
  const [quantity, setQuantity] = useState(1)
  const [useCustomSize, setUseCustomSize] = useState(false)
  const [usePerimeterPricing, setUsePerimeterPricing] = useState(false)
  const [selectedPerimeter, setSelectedPerimeter] = useState("")
  const [isDoubleDoor, setIsDoubleDoor] = useState(false)
  const [isCeilingInstallation, setIsCeilingInstallation] = useState(false)
  const [isTripleDoor, setIsTripleDoor] = useState(false)

  // Get current product from API only
  const getCurrentProduct = () => {
    if (product) {
      return getLocalizedProduct(product, currentLanguage)
    }
    // Return null if no API product found
    return null
  }

  const localizedProduct = getCurrentProduct()
  
  const getSizesForProduct = (product: any): LocalProductSize[] => {
    if (product) {
      return convertApiSizesToLocal(product.sizes, product.calculatedPrices)
    }
    
    // Return empty array if no API product found
    return []
  }
  
  const getPerimeterPricingForProduct = (product: any) => {
    if (product && product.perimeterPricing) {
      return product.perimeterPricing
    }
    
    // Return empty array if no API product found
    return []
  }
  
  const currentSizes = getSizesForProduct(product)
  const currentPerimeterPricing = getPerimeterPricingForProduct(product)
  
  const selectedSizeData = currentSizes.find(size => size.id === selectedSize)
  const selectedPerimeterData = currentPerimeterPricing.find((p: any) => p.maxPerimeter.toString() === selectedPerimeter)

  const totalPrice = useMemo(() => {
    // Get base price from API or fallback
    let priceUSD = product?.basePrice || 0

    // Use safe values when user is editing and input is empty
    const widthForCalc = Number.isFinite(customWidth as unknown as number) ? (customWidth as unknown as number) : 0
    const heightForCalc = Number.isFinite(customHeight as unknown as number) ? (customHeight as unknown as number) : 0
    
    if (usePerimeterPricing && selectedPerimeterData && selectedPerimeterData.priceUSD) {
      priceUSD = selectedPerimeterData.priceUSD
      
      if (selectedPerimeterData.hasDoubleDoorOption && isDoubleDoor && 'doubleDoorSurcharge' in selectedPerimeterData && selectedPerimeterData.doubleDoorSurcharge) {
        priceUSD = priceUSD * (1 + selectedPerimeterData.doubleDoorSurcharge)
      }
      
      if (selectedPerimeterData.hasInstallationTypeOption && isCeilingInstallation && 'ceilingSurcharge' in selectedPerimeterData && selectedPerimeterData.ceilingSurcharge) {
        priceUSD = priceUSD + selectedPerimeterData.ceilingSurcharge
      }
    } else if (useCustomSize) {
      const perimeter = (widthForCalc + heightForCalc) * 2
      
      const perimeterData = currentPerimeterPricing.find((p: any) => perimeter <= p.maxPerimeter)
      if (perimeterData && perimeterData.priceUSD) {
        priceUSD = perimeterData.priceUSD
        
        if (perimeterData.hasDoubleDoorOption && isDoubleDoor && 'doubleDoorSurcharge' in perimeterData && perimeterData.doubleDoorSurcharge) {
          priceUSD = priceUSD * (1 + perimeterData.doubleDoorSurcharge)
        }
        if (perimeterData.hasInstallationTypeOption && isCeilingInstallation && 'ceilingSurcharge' in perimeterData && perimeterData.ceilingSurcharge) {
          priceUSD = priceUSD + perimeterData.ceilingSurcharge
        }
      } else {
        const highestTier = currentPerimeterPricing[currentPerimeterPricing.length - 1]
        if (highestTier && highestTier.priceUSD) {
          priceUSD = highestTier.priceUSD
          if (highestTier.hasInstallationTypeOption && isCeilingInstallation && 'ceilingSurcharge' in highestTier && highestTier.ceilingSurcharge) {
            priceUSD = priceUSD + highestTier.ceilingSurcharge
          }
        }
      }
    } else if (selectedSizeData && selectedSizeData.priceUSD) {
      // Use API calculated price if available, otherwise use local price
      if (product) {
        const apiPrice = getPriceForSize(product, selectedSizeData.id)
        priceUSD = apiPrice || selectedSizeData.priceUSD
      } else {
        priceUSD = selectedSizeData.priceUSD
      }
      
      if (product?.category === 'anodos' && isCeilingInstallation) {
        priceUSD = priceUSD + 3
      }
    }
    
    const priceUZS = Math.round(priceUSD * 12500)
    return priceUZS * quantity
  }, [product, selectedSize, customWidth, customHeight, quantity, useCustomSize, usePerimeterPricing, selectedPerimeter, isDoubleDoor, isCeilingInstallation, selectedSizeData, selectedPerimeterData, currentPerimeterPricing])

  const currentWidth = useMemo(() => {
    if (useCustomSize) {
      return Number.isFinite(customWidth as unknown as number) ? (customWidth as unknown as number) : 0
    } else if (usePerimeterPricing && selectedPerimeterData) {
      return selectedPerimeterData.exampleWidth
    } else if (selectedSizeData) {
      return selectedSizeData.width
    }
    return 30
  }, [useCustomSize, customWidth, usePerimeterPricing, selectedPerimeterData, selectedSizeData])

  const currentHeight = useMemo(() => {
    if (useCustomSize) {
      return Number.isFinite(customHeight as unknown as number) ? (customHeight as unknown as number) : 0
    } else if (usePerimeterPricing && selectedPerimeterData) {
      return selectedPerimeterData.exampleHeight
    } else if (selectedSizeData) {
      return selectedSizeData.height
    }
    return 20
  }, [useCustomSize, customHeight, usePerimeterPricing, selectedPerimeterData, selectedSizeData])

  const perimeter = useMemo(() => {
    return (currentWidth + currentHeight) * 2
  }, [currentWidth, currentHeight])

  const handleAddToCart = () => {
    if (!product) return
    
    const orderData = {
      productId: productId,
      modelName: localizedProduct?.name || product?.name || 'Unknown Product',
      width: currentWidth,
      height: currentHeight,
      quantity,
      totalPrice,
      isCustomSize: useCustomSize,
    }
    localStorage.setItem("currentOrder", JSON.stringify(orderData))
    router.push("/checkout")
  }

  // Show loading or error if no product found
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Загрузка продукта...</p>
        </div>
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Продукт не найден</h2>
          <p className="text-gray-600 mb-4">Продукт с ID "{productId}" не найден в API</p>
          <Button onClick={() => router.push('/')}>
            Вернуться на главную
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid gap-8 lg:gap-16 lg:grid-cols-2">
        <div className="sticky top-16 lg:top-24 self-start z-20 configurator-sticky">
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-black mb-2">{localizedProduct?.name || 'Loading...'}</h2>
              </div>

              <div className="relative z-20 bg-white rounded-lg p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                {/* Определяем тип конфигуратора и размеры */}
                {(() => {
                  // В тексте "60 см х 50 см" означает: ширина = 60см (горизонталь), высота = 50см (вертикаль)
                  const width = currentWidth;   // Ширина (горизонтальная ось)
                  const height = currentHeight; // Высота (вертикальная ось)
                  
                  const isSquare = width === height;
                  const isHorizontal = width > height;
                  const isVertical = height > width;
                  
                  // Базовые размеры для отображения
                  const baseSize = 200;
                  let displayWidth, displayHeight;
                  
                  if (isSquare) {
                    displayWidth = displayHeight = baseSize;
                  } else if (isHorizontal) {
                    // Для горизонтального прямоугольника (ширина > высоты)
                    const ratio = height / width;
                    displayWidth = baseSize;
                    displayHeight = baseSize * ratio;
                  } else {
                    // Для вертикального прямоугольника (высота > ширины)
                    const ratio = width / height;
                    displayWidth = baseSize * ratio;
                    displayHeight = baseSize;
                  }
                  
                  return (
                    <div className="relative">
                      {/* Ширина отображается сверху (горизонтально) */}
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                        {width} {t("cfg.units.cmShort")}
                      </div>
                      {/* Высота отображается слева (вертикально) */}
                      <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs font-medium text-gray-600">
                        {height} {t("cfg.units.cmShort")}
                      </div>
                      
                      <div 
                        className="relative border-2 border-black rounded-lg"
                        style={{ 
                          width: `${displayWidth}px`, 
                          height: `${displayHeight}px`,
                          minWidth: '120px',
                          minHeight: '120px',
                          maxWidth: '280px',
                          maxHeight: '280px'
                        }}
                      >
                        {/* Центральные линии */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-px bg-gray-300"></div>
                          <div className="absolute w-px h-full bg-gray-300"></div>
                        </div>
                        
                        {/* Петли/ручки в зависимости от типа дверей */}
                        {!isDoubleDoor && !isTripleDoor && (
                          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                        )}
                        
                        {isDoubleDoor && !isTripleDoor && (
                          <>
                            <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                            <div className="absolute top-1/2 right-1/2 transform -translate-y-1/2 -translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-400"></div>
                          </>
                        )}
                        
                        {isTripleDoor && (
                          <>
                            <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 -translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                            <div className="absolute top-1/2 right-1/3 transform -translate-y-1/2 translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-gray-400"></div>
                            <div className="absolute top-0 bottom-0 right-1/3 w-px bg-gray-400"></div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

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

        <div className="relative z-10 bg-white rounded-xl border border-gray-100 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">

        {product?.category === 'anodos' && (
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
                  (+3 $)
                </div>
              </button>
            </div>
          </div>
        )}

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
                  setCustomWidth(size.width)
                  setCustomHeight(size.height)
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
                <div className="text-sm text-gray-600">({size.priceUSD || 0} $)</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-black mb-4">{t("cfg.perimeterPricing")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentPerimeterPricing.map((pricing: any) => (
              <button
                key={pricing.maxPerimeter}
                onClick={() => {
                  setSelectedPerimeter(pricing.maxPerimeter.toString())
                  setUsePerimeterPricing(true)
                  setUseCustomSize(false)
                  setCustomWidth(pricing.exampleWidth)
                  setCustomHeight(pricing.exampleHeight)
                  // Reset door options when selecting perimeter pricing
                  setIsDoubleDoor(false)
                  setIsTripleDoor(false)
                  if (product?.category === 'anodos') {
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
                <div className="text-sm text-gray-600">({pricing.priceUSD || 0} $)</div>
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

        {selectedPerimeterData?.hasDoubleDoorOption && product?.category === 'transformer' && (
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

        <div>
          <h3 className="text-lg font-bold text-black mb-4">{t("cfg.customSize")}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="custom-width" className="text-sm font-medium text-gray-700">{t("cfg.widthLabel")}</Label>
              <div className="relative mt-1">
                <Input
                  id="custom-width"
                  type="number"
                  min="20"
                  max={product?.category === 'anodos' ? 110 : product?.category === 'transformer' ? 90 : product?.category === 'napolny' ? 200 : 90}
                  value={Number.isFinite(customWidth as unknown as number) && (customWidth as unknown as number) !== 0 ? customWidth : ''}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      setCustomWidth(NaN as unknown as number)
                      setUseCustomSize(true)
                      setUsePerimeterPricing(false)
                      return
                    }
                    const newWidth = Number(e.target.value)
                    setCustomWidth(newWidth)
                    setUseCustomSize(true)
                    setUsePerimeterPricing(false)
                    
                    const heightForCalc = Number.isFinite(customHeight as unknown as number) ? (customHeight as unknown as number) : 0
                    const newPerimeter = (newWidth + heightForCalc) * 2
                    if (newPerimeter > 200) {
                      setIsDoubleDoor(true)
                    } else {
                      setIsDoubleDoor(false)
                    }
                  }}
                  className="pr-8 border-gray-300"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">{t("cfg.units.cm")}</div>
              </div>
            </div>
            <div>
              <Label htmlFor="custom-height" className="text-sm font-medium text-gray-700">{t("cfg.heightLabel")}</Label>
              <div className="relative mt-1">
                <Input
                  id="custom-height"
                  type="number"
                  min="20"
                  max={product?.category === 'anodos' ? 110 : product?.category === 'transformer' ? 90 : product?.category === 'napolny' ? 200 : 90}
                  value={Number.isFinite(customHeight as unknown as number) && (customHeight as unknown as number) !== 0 ? customHeight : ''}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      setCustomHeight(NaN as unknown as number)
                      setUseCustomSize(true)
                      setUsePerimeterPricing(false)
                      return
                    }
                    const newHeight = Number(e.target.value)
                    setCustomHeight(newHeight)
                    setUseCustomSize(true)
                    setUsePerimeterPricing(false)
                    
                    const widthForCalc = Number.isFinite(customWidth as unknown as number) ? (customWidth as unknown as number) : 0
                    const newPerimeter = (widthForCalc + newHeight) * 2
                    if (newPerimeter > 200) {
                      setIsDoubleDoor(true)
                    } else {
                      setIsDoubleDoor(false)
                    }
                  }}
                  className="pr-8 border-gray-300"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">{t("cfg.units.cm")}</div>
              </div>
            </div>
          </div>
          {useCustomSize && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                {t("cfg.perimeter")}: {((customWidth + customHeight) * 2).toFixed(1)} {t("cfg.units.cm")}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {t("cfg.doorType")}: {isTripleDoor ? t("cfg.doorTypes.tripleEven") : isDoubleDoor ? t("cfg.doorTypes.doubleCenter") : t("cfg.doorTypes.singleRight")}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {t("cfg.priceCalculation")}
              </div>
              {(() => {
                const currentPerimeter = (customWidth + customHeight) * 2
                const maxPerimeter = product?.category === 'anodos' ? 440 : product?.category === 'transformer' ? 360 : product?.category === 'napolny' ? 800 : 360
                if (currentPerimeter > maxPerimeter) {
                  return (
                    <div className="text-sm text-red-600 mt-2 font-medium">
                      {t("cfg.perimeterExceeded")} ({maxPerimeter} {t("cfg.units.cm")})
                    </div>
                  )
                }
                return null
              })()}
            </div>
          )}
        </div>

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

        <div>
          <h3 className="text-lg font-bold text-black mb-4">{t("cfg.total")}</h3>
          {useCustomSize ? (
            <div className="text-lg text-gray-600 mb-6">
              {t("cfg.priceByPerimeter")}
            </div>
          ) : (
            <div className="text-3xl font-bold text-black mb-6">
              {new Intl.NumberFormat('ru-RU').format(totalPrice)} {t("cfg.currency")}
            </div>
          )}
          
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