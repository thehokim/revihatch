export interface ProductSize {
  size: string
  priceUSD: number
  priceUZS: number
}

export interface CalculatedPrice {
  size: string
  coefficient: number
  price: number
}

export interface PerimeterPricing {
  maxPerimeter: number
  priceUSD: number
  hasDoubleDoorOption: boolean
  hasInstallationTypeOption: boolean
  doubleDoorSurcharge?: number
  ceilingSurcharge?: number
  exampleWidth: number
  exampleHeight: number
}

export interface ProductTranslations {
  ru?: {
    name?: string
    description?: string
  }
  uz?: {
    name?: string
    description?: string
  }
  en?: {
    name?: string
    description?: string
  }
}

export interface Product {
  _id: string
  name: string | { ru: string; uz: string; en?: string }
  description: string | { ru: string; uz: string; en?: string }
  name_ru?: string
  name_uz?: string
  description_ru?: string
  description_uz?: string
  translations?: ProductTranslations
  basePrice: number
  category: string
  sizes: ProductSize[]
  images: string[]
  mainImage: string | null
  calculatedPrices?: CalculatedPrice[]
  perimeterPricing?: PerimeterPricing[]
  createdAt: string
  updatedAt: string
}

export interface LocalProductSize {
  id: string
  label: string
  width: number
  height: number
  priceUSD: number
  priceUZS: number
}

export interface LocalProduct {
  id: string
  name: string
  description: string
  image: string
}

export interface LocalProductConfig {
  name: string
  description: string
  basePrice: number
  image: string
}

export interface ProductsResponse {
  success: boolean
  data: Product[]
  message?: string
}

export class ApiError extends Error {
  status?: number
  
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export type SupportedLanguage = 'ru' | 'uz' | 'en'

export function getLocalizedText(
  product: Product, 
  field: 'name' | 'description', 
  language: SupportedLanguage = 'ru'
): string {
  if (field === 'name') {
    if (typeof product.name === 'object' && product.name !== null) {
      const result = product.name[language] || product.name.ru || ''
      return result
    }
    if (typeof product.name === 'string') {
      return product.name
    }
  }
  
  if (field === 'description') {
    if (typeof product.description === 'object' && product.description !== null) {
      const result = product.description[language] || product.description.ru || ''
      return result
    }
    if (typeof product.description === 'string') {
      return product.description
    }
  }
  
  if (field === 'name') {
    if (language === 'ru' && product.name_ru) {
      return product.name_ru
    }
    if (language === 'uz' && product.name_uz) {
      return product.name_uz
    }
  }
  
  if (field === 'description') {
    if (language === 'ru' && product.description_ru) {
      return product.description_ru
    }
    if (language === 'uz' && product.description_uz) {
      return product.description_uz
    }
  }
  
  if (product.translations?.[language]?.[field]) {
    return product.translations[language][field]!
  }
  
  if (field === 'name') {
    return typeof product.name === 'string' ? product.name : `cfg.products.${product.category}.name`
  }
  
  if (field === 'description') {
    return typeof product.description === 'string' ? product.description : `cfg.products.${product.category}.desc`
  }
  
  return ''
}
