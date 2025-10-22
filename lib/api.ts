import { Product, ProductsResponse, ApiError, getLocalizedText, SupportedLanguage } from './types'

const API_BASE_URL = 'https://api.lyukirevizor.uz/api'

export const PRODUCT_IMAGE_MAP: Record<string, string> = {
  'anodos': '/ano1.jpg',
  'napolny': '/nap1.jpg', 
  'floor': '/uni1.png',
  'universal': '/uni1.png',
  'transformer': '/tra1.jpg',
  'wall': '/lyuk1.png',
  'industrial': '/industrial-wall-access-panel-white.jpg',
  'premium': '/premium-anodized-aluminum-hatch.jpg',
  'minimalist': '/minimalist-invisible-wall-hatch-aluminum.jpg'
}

function convertGoogleDriveUrl(url: string): string {
  const idMatch = url.match(/[?&]id=([^&]+)/)
  if (!idMatch) return url
  
  const fileId = idMatch[1]
  
  const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`
  
  const altUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
  
  const altUrl2 = `https://lh3.googleusercontent.com/d/${fileId}`
  
  return directUrl
}

export function getSafeImageUrl(imageUrl: string | null | undefined, category: string): string {
  if (imageUrl) {
    if (imageUrl.includes('drive.google.com')) {
      return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
    }
    return imageUrl
  }
  
  return PRODUCT_IMAGE_MAP[category] || '/placeholder.svg'
}

export function getDiverseImageUrl(imageUrl: string | null | undefined, category: string, index: number = 0): string {
  if (imageUrl) {
    if (imageUrl.includes('drive.google.com')) {
      return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
    }
    return imageUrl
  }
  
  const baseImage = PRODUCT_IMAGE_MAP[category] || '/placeholder.svg'
  return getVariedImageUrl(baseImage, index)
}

function getVariedImageUrl(baseImage: string, index: number): string {
  const imageVariations: Record<string, string[]> = {
    'anodos': ['/ano1.jpg', '/ano2.jpg', '/ano3.png'],
    'napolny': ['/nap1.jpg', '/nap2.jpg', '/nap3.jpg'],
    'transformer': ['/tra1.jpg', '/tra2.jpg', '/tra3.jpg'],
    'floor': ['/uni1.png', '/uni2.png', '/uni3.png'],
    'universal': ['/uni1.png', '/uni2.png', '/uni3.png'],
    'wall': ['/lyuk1.png', '/lyuk2.png', '/lyuk3.png', '/lyuk4.png'],
    'industrial': ['/industrial-wall-access-panel-white.jpg'],
    'premium': ['/premium-anodized-aluminum-hatch.jpg'],
    'minimalist': ['/minimalist-invisible-wall-hatch-aluminum.jpg']
  }
  
  const variations = imageVariations[baseImage.split('/')[1]?.split('.')[0]] || [baseImage]
  return variations[index % variations.length] || baseImage
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: Product[] = await response.json()
    return data
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to fetch products',
      error instanceof Error && 'status' in error ? (error as any).status : undefined
    )
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const product: Product = await response.json()
    return product
  } catch (error) {
    try {
      const products = await fetchProducts()
      return products.find(product => product._id === id) || null
    } catch (fallbackError) {
      return null
    }
  }
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  try {
    const products = await fetchProducts()
    return products.filter(product => product.category === category)
  } catch (error) {
    return []
  }
}

export function convertApiProductToLocal(product: Product, language: SupportedLanguage = 'ru'): {
  id: string
  name: string
  description: string
  image: string
} {
  return {
    id: product._id,
    name: getLocalizedText(product, 'name', language),
    description: getLocalizedText(product, 'description', language),
    image: getSafeImageUrl(product.mainImage || product.images[0], product.category)
  }
}

export function convertApiSizesToLocal(sizes: Product['sizes']): Array<{
  id: string
  label: string
  width: number
  height: number
  priceUSD: number
  priceUZS: number
}> {
  return sizes.map(size => {
    const [width, height] = size.size.split('x').map(Number)
    
    return {
      id: size.size,
      label: `${width} x ${height}`,
      width,
      height,
      priceUSD: size.priceUSD,
      priceUZS: size.priceUZS
    }
  })
}

export function getPriceForSize(product: Product, sizeId: string): number {
  const size = product.sizes.find(s => s.size === sizeId)
  if (size) {
    return size.priceUSD
  }
  
  if (product.calculatedPrices) {
    const calculatedPrice = product.calculatedPrices.find(cp => cp.size === sizeId)
    if (calculatedPrice) {
      return calculatedPrice.price
    }
  }
  
  return product.basePrice
}
export function getLocalizedProduct(product: Product, language: SupportedLanguage = 'ru'): {
  name: string
  description: string
  basePrice: number
  image: string
} {
  return {
    name: getLocalizedText(product, 'name', language),
    description: getLocalizedText(product, 'description', language),
    basePrice: product.basePrice,
    image: getSafeImageUrl(product.mainImage || product.images[0], product.category)
  }
}
