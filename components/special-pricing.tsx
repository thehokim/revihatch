"use client";

export interface PricingRule {
  maxPerimeter: number;
  priceUSD: number;
  allowedFlaps: number[];
}

export interface PricingInfo {
  priceUSD: number;
  rule: PricingRule;
  isOverLimit: boolean;
}

// Special pricing rules for different product IDs
const SPECIAL_PRICING_RULES: Record<string, PricingRule[]> = {
  "68f36177f6edd352f8920e1f": [
    { maxPerimeter: 160, priceUSD: 56, allowedFlaps: [1] },
    { maxPerimeter: 240, priceUSD: 95, allowedFlaps: [1] },
    { maxPerimeter: 280, priceUSD: 104, allowedFlaps: [1] },
    { maxPerimeter: 320, priceUSD: 118, allowedFlaps: [1] },
    { maxPerimeter: 400, priceUSD: 150, allowedFlaps: [1] },
    { maxPerimeter: 480, priceUSD: 175, allowedFlaps: [1, 2] },
    { maxPerimeter: 560, priceUSD: 275, allowedFlaps: [2] },
    { maxPerimeter: 640, priceUSD: 300, allowedFlaps: [2] },
    { maxPerimeter: 720, priceUSD: 325, allowedFlaps: [2] },
  ],
  "68f36177f6edd352f8920e21": [
    { maxPerimeter: 120, priceUSD: 35, allowedFlaps: [1] },
    { maxPerimeter: 160, priceUSD: 40, allowedFlaps: [1] },
    { maxPerimeter: 200, priceUSD: 45, allowedFlaps: [1, 2] },
    { maxPerimeter: 240, priceUSD: 50, allowedFlaps: [1, 2] },
    { maxPerimeter: 280, priceUSD: 55, allowedFlaps: [1, 2] },
    { maxPerimeter: 320, priceUSD: 90, allowedFlaps: [2] },
    { maxPerimeter: 360, priceUSD: 95, allowedFlaps: [2] },
  ],
  "69006228bafc5fb7b6d2a888": [
    { maxPerimeter: 120, priceUSD: 32, allowedFlaps: [1, 2] },
    { maxPerimeter: 160, priceUSD: 44, allowedFlaps: [1, 2] },
    { maxPerimeter: 200, priceUSD: 50, allowedFlaps: [1, 2] },
    { maxPerimeter: 240, priceUSD: 53, allowedFlaps: [1, 2] },
    { maxPerimeter: 280, priceUSD: 61, allowedFlaps: [1, 2] },
    { maxPerimeter: 320, priceUSD: 71, allowedFlaps: [1, 2] },
    { maxPerimeter: 360, priceUSD: 81, allowedFlaps: [1, 2] },
    { maxPerimeter: 400, priceUSD: 93, allowedFlaps: [1, 2] },
    { maxPerimeter: 440, priceUSD: 108, allowedFlaps: [1, 2] },
    { maxPerimeter: 480, priceUSD: 118, allowedFlaps: [1, 2] },
    { maxPerimeter: 520, priceUSD: 131, allowedFlaps: [1, 2] },
    { maxPerimeter: 560, priceUSD: 143, allowedFlaps: [1, 2] },
    { maxPerimeter: 600, priceUSD: 156, allowedFlaps: [1, 2] },
  ],
  "68ff560a5c85e742c1891de5": [
    { maxPerimeter: 120, priceUSD: 50, allowedFlaps: [1] },
    { maxPerimeter: 160, priceUSD: 56, allowedFlaps: [1] },
    { maxPerimeter: 200, priceUSD: 62, allowedFlaps: [1, 2] },
    { maxPerimeter: 240, priceUSD: 69, allowedFlaps: [1, 2] },
    { maxPerimeter: 280, priceUSD: 75, allowedFlaps: [1, 2] },
    { maxPerimeter: 320, priceUSD: 118, allowedFlaps: [2] },
    { maxPerimeter: 360, priceUSD: 125, allowedFlaps: [2] },
  ],
  "68f36177f6edd352f8920e1d": [
    { maxPerimeter: 120, priceUSD: 35, allowedFlaps: [1, 2] },
    { maxPerimeter: 160, priceUSD: 38, allowedFlaps: [1, 2] },
    { maxPerimeter: 200, priceUSD: 41, allowedFlaps: [1, 2] },
    { maxPerimeter: 240, priceUSD: 45, allowedFlaps: [1, 2] },
    { maxPerimeter: 280, priceUSD: 50, allowedFlaps: [1, 2] },
    { maxPerimeter: 320, priceUSD: 55, allowedFlaps: [1, 2] },
    { maxPerimeter: 360, priceUSD: 60, allowedFlaps: [1, 2] },
    { maxPerimeter: 400, priceUSD: 65, allowedFlaps: [1, 2] },
    { maxPerimeter: 440, priceUSD: 70, allowedFlaps: [1, 2] },
    { maxPerimeter: 480, priceUSD: 75, allowedFlaps: [1, 2] },
    { maxPerimeter: 520, priceUSD: 80, allowedFlaps: [1, 2] },
    { maxPerimeter: 560, priceUSD: 85, allowedFlaps: [1, 2] },
    { maxPerimeter: 600, priceUSD: 120, allowedFlaps: [2] },
  ],
  // Add more product IDs here as needed
  // "another-product-id": [...],
};

export const getSpecialPricingForProduct = (productId: string, perimeter: number, flaps: number, isCeilingInstallation?: boolean): number | null => {
  const rules = SPECIAL_PRICING_RULES[productId];
  if (!rules) return null;

  let rule = rules.find(r => perimeter <= r.maxPerimeter);
  // If no rule found (perimeter exceeds max), use the last rule (highest tier)
  if (!rule && rules.length > 0) {
    rule = rules[rules.length - 1];
  }
  if (!rule) return null;

  // For product "69006228bafc5fb7b6d2a888" and "68f36177f6edd352f8920e1d", allow both 1 and 2 flaps if perimeter-based rule exists
  // For product "68f36177f6edd352f8920e1f", check dynamically based on perimeter ranges
  // Otherwise, check if flaps are allowed for this perimeter
  if (productId === "68f36177f6edd352f8920e1f") {
    // Dynamic check based on perimeter:
    // - До 400: только [1]
    // - С 401 до 480: [1, 2]
    // - С 481 и выше: только [2]
    if (perimeter <= 400) {
      if (flaps !== 1) return null;
    } else if (perimeter <= 480) {
      if (![1, 2].includes(flaps)) return null;
    } else {
      // 481 and above
      if (flaps !== 2) return null;
    }
  } else if (productId === "68ff560a5c85e742c1891de5") {
    // Dynamic check based on perimeter:
    // - До 160: только [1]
    // - С 161 до 280: [1, 2]
    // - С 281 и выше: только [2]
    if (perimeter <= 160) {
      if (flaps !== 1) return null;
    } else if (perimeter <= 280) {
      if (![1, 2].includes(flaps)) return null;
    } else {
      // 281 and above
      if (flaps !== 2) return null;
    }
  } else if (productId === "69006228bafc5fb7b6d2a888") {
    // Dynamic check based on perimeter:
    // - До 160: только [1]
    // - С 161 до 600: выбор между [1, 2] (но правило 40% проверяется в getAllowedFlaps)
    // - После 600: только [2]
    if (perimeter <= 160) {
      if (flaps !== 1) return null;
    } else if (perimeter <= 600) {
      if (![1, 2].includes(flaps)) return null;
    } else {
      // После 600: только 2 створки
      if (flaps !== 2) return null;
    }
  } else if (productId !== "68f36177f6edd352f8920e1d" && !rule.allowedFlaps.includes(flaps)) return null;

  let priceUSD = rule.priceUSD;

  // Special pricing logic for different products
  if (productId === "68f36177f6edd352f8920e1f") {
    // Add 40% surcharge for 2-door option for perimeter 401-480
    if (flaps === 2 && perimeter > 400 && perimeter <= 480) {
      priceUSD = priceUSD * 1.4;
    }
  } else if (productId === "68f36177f6edd352f8920e21") {
    // Add surcharge for 2-door option based on perimeter
    if (flaps === 2 && perimeter <= 200) {
      priceUSD = priceUSD * 1.65; // +65%
    } else if (flaps === 2 && perimeter <= 240) {
      priceUSD = priceUSD * 1.60; // +60%
    } else if (flaps === 2 && perimeter <= 280) {
      priceUSD = priceUSD * 1.55; // +55%
    }
  } else if (productId === "69006228bafc5fb7b6d2a888") {
    // Ceiling installation surcharge is handled universally at the end
    // Add percentage surcharge for 2-door option based on perimeter
    // Price only changes for flaps after 160cm perimeter
    if (flaps === 2 && perimeter > 160) {
      if (perimeter <= 200) {
        priceUSD = priceUSD * 1.7; // +70%
      } else if (perimeter <= 240) {
        priceUSD = priceUSD * 1.67; // +67%
      } else if (perimeter <= 280) {
        priceUSD = priceUSD * 1.51; // +51%
      } else if (perimeter <= 320) {
        priceUSD = priceUSD * 1.42; // +42%
      } else if (perimeter <= 360) {
        priceUSD = priceUSD * 1.31; // +31%
      } else if (perimeter <= 400) {
        priceUSD = priceUSD * 1.2; // +20%
      } else {
        // 440, 480, 520, 560, 600
        priceUSD = priceUSD * 1.1; // +10%
      }
    }
  } else if (productId === "68f36177f6edd352f8920e1d") {
    // Price rules for 68f36177f6edd352f8920e1d:
    // - Up to 160: price doesn't change based on flaps (only 1 flap allowed)
    // - 161-560: choice between 1 and 2 flaps, if 2 flaps selected add percentage surcharge
    // - 561+ (including 600+): only 2 flaps allowed (mandatory)
    if (flaps === 2 && perimeter > 160) {
      if (perimeter <= 200) {
        priceUSD = priceUSD * 1.5; // +50%
      } else if (perimeter <= 280) {
        priceUSD = priceUSD * 1.4; // +40%
      } else if (perimeter <= 320) {
        priceUSD = priceUSD * 1.4; // +40%
      } else if (perimeter <= 360) {
        priceUSD = priceUSD * 1.35; // +35%
      } else if (perimeter <= 400) {
        priceUSD = priceUSD * 1.35; // +35%
      } else if (perimeter <= 440) {
        priceUSD = priceUSD * 1.35; // +35%
      } else if (perimeter <= 480) {
        priceUSD = priceUSD * 1.35; // +35%
      } else if (perimeter <= 520) {
        priceUSD = priceUSD * 1.35; // +35%
      } else if (perimeter <= 560) {
        priceUSD = priceUSD * 1.35; // +35%
      }
      // For 561-600 and above, 2 flaps is mandatory but no additional surcharge (price already set)
    }
    // For perimeter <= 160, flaps === 1 is mandatory and price doesn't change
  } else if (productId === "68ff560a5c85e742c1891de5") {
    // Add percentage surcharge for 2-door option based on perimeter
    // Only applies for perimeter 161-280 (choice between 1 and 2 flaps)
    // For 281+, 2 flaps is mandatory, so no surcharge needed
    if (flaps === 2 && perimeter > 160 && perimeter <= 280) {
      if (perimeter <= 200) {
        priceUSD = priceUSD * 1.65; // +65%
      } else if (perimeter <= 240) {
        priceUSD = priceUSD * 1.60; // +60%
      } else if (perimeter <= 280) {
        priceUSD = priceUSD * 1.55; // +55%
      }
    }
  }

  // Add $3 for ceiling installation (universal rule for all products)
  if (isCeilingInstallation) {
    priceUSD = priceUSD + 3;
  }

  return priceUSD;
};

export const getSpecialPricingInfo = (productId: string, perimeter: number, flaps: number, isCeilingInstallation?: boolean): PricingInfo | null => {
  const rules = SPECIAL_PRICING_RULES[productId];
  if (!rules) return null;
  
  let rule = rules.find(r => perimeter <= r.maxPerimeter);
  // If no rule found (perimeter exceeds max), use the last rule (highest tier)
  if (!rule && rules.length > 0) {
    rule = rules[rules.length - 1];
  }
  if (!rule) return null;

  // For product "69006228bafc5fb7b6d2a888" and "68f36177f6edd352f8920e1d", allow both 1 and 2 flaps if perimeter-based rule exists
  // For product "68f36177f6edd352f8920e1f", check dynamically based on perimeter ranges
  // Otherwise, check if flaps are allowed for this perimeter
  if (productId === "68f36177f6edd352f8920e1f") {
    // Dynamic check based on perimeter:
    // - До 400: только [1]
    // - С 401 до 480: [1, 2]
    // - С 481 и выше: только [2]
    if (perimeter <= 400) {
      if (flaps !== 1) return null;
    } else if (perimeter <= 480) {
      if (![1, 2].includes(flaps)) return null;
    } else {
      // 481 and above
      if (flaps !== 2) return null;
    }
  } else if (productId === "68ff560a5c85e742c1891de5") {
    // Dynamic check based on perimeter:
    // - До 160: только [1]
    // - С 161 до 280: [1, 2]
    // - С 281 и выше: только [2]
    if (perimeter <= 160) {
      if (flaps !== 1) return null;
    } else if (perimeter <= 280) {
      if (![1, 2].includes(flaps)) return null;
    } else {
      // 281 and above
      if (flaps !== 2) return null;
    }
  } else if (productId === "69006228bafc5fb7b6d2a888") {
    // Dynamic check based on perimeter:
    // - До 160: только [1]
    // - С 161 до 600: выбор между [1, 2] (но правило 40% проверяется в getAllowedFlaps)
    // - После 600: только [2]
    if (perimeter <= 160) {
      if (flaps !== 1) return null;
    } else if (perimeter <= 600) {
      if (![1, 2].includes(flaps)) return null;
    } else {
      // После 600: только 2 створки
      if (flaps !== 2) return null;
    }
  } else if (productId !== "68f36177f6edd352f8920e1d" && !rule.allowedFlaps.includes(flaps)) return null;

  let priceUSD = rule.priceUSD;

  // Special pricing logic for different products
  if (productId === "68f36177f6edd352f8920e1f") {
    // Add 40% surcharge for 2-door option for perimeter 401-480
    if (flaps === 2 && perimeter > 400 && perimeter <= 480) {
      priceUSD = priceUSD * 1.4;
    }
  } else if (productId === "68f36177f6edd352f8920e21") {
    // Add surcharge for 2-door option based on perimeter
    if (flaps === 2 && perimeter <= 200) {
      priceUSD = priceUSD * 1.65; // +65%
    } else if (flaps === 2 && perimeter <= 240) {
      priceUSD = priceUSD * 1.60; // +60%
    } else if (flaps === 2 && perimeter <= 280) {
      priceUSD = priceUSD * 1.55; // +55%
    }
  } else if (productId === "69006228bafc5fb7b6d2a888") {
    // Ceiling installation surcharge is handled universally at the end
    // Add percentage surcharge for 2-door option based on perimeter
    // Price only changes for flaps after 160cm perimeter
    if (flaps === 2 && perimeter > 160) {
      if (perimeter <= 200) {
        priceUSD = priceUSD * 1.7; // +70%
      } else if (perimeter <= 240) {
        priceUSD = priceUSD * 1.67; // +67%
      } else if (perimeter <= 280) {
        priceUSD = priceUSD * 1.51; // +51%
      } else if (perimeter <= 320) {
        priceUSD = priceUSD * 1.42; // +42%
      } else if (perimeter <= 360) {
        priceUSD = priceUSD * 1.31; // +31%
      } else if (perimeter <= 400) {
        priceUSD = priceUSD * 1.2; // +20%
      } else {
        // 440, 480, 520, 560, 600
        priceUSD = priceUSD * 1.1; // +10%
      }
    }
  } else if (productId === "68f36177f6edd352f8920e1d") {
    // Price rules for 68f36177f6edd352f8920e1d:
    // - Up to 160: price doesn't change based on flaps (only 1 flap allowed)
    // - 161-560: choice between 1 and 2 flaps, if 2 flaps selected add percentage surcharge
    // - 561+ (including 600+): only 2 flaps allowed (mandatory)
    if (flaps === 2 && perimeter > 160) {
      if (perimeter <= 200) {
        priceUSD = priceUSD * 1.5; // +50%
      } else if (perimeter <= 280) {
        priceUSD = priceUSD * 1.4; // +40%
      } else if (perimeter <= 320) {
        priceUSD = priceUSD * 1.4; // +40%
      } else if (perimeter <= 360) {
        priceUSD = priceUSD * 1.35; // +35%
      } else if (perimeter <= 400) {
        priceUSD = priceUSD * 1.35; // +35%
      } else if (perimeter <= 440) {
        priceUSD = priceUSD * 1.35; // +35%
      } else if (perimeter <= 480) {
        priceUSD = priceUSD * 1.35; // +35%
      } else if (perimeter <= 520) {
        priceUSD = priceUSD * 1.35; // +35%
      } else if (perimeter <= 560) {
        priceUSD = priceUSD * 1.35; // +35%
      }
      // For 561-600 and above, 2 flaps is mandatory but no additional surcharge (price already set)
    }
    // For perimeter <= 160, flaps === 1 is mandatory and price doesn't change
  } else if (productId === "68ff560a5c85e742c1891de5") {
    // Add percentage surcharge for 2-door option based on perimeter
    // Only applies for perimeter 161-280 (choice between 1 and 2 flaps)
    // For 281+, 2 flaps is mandatory, so no surcharge needed
    if (flaps === 2 && perimeter > 160 && perimeter <= 280) {
      if (perimeter <= 200) {
        priceUSD = priceUSD * 1.65; // +65%
      } else if (perimeter <= 240) {
        priceUSD = priceUSD * 1.60; // +60%
      } else if (perimeter <= 280) {
        priceUSD = priceUSD * 1.55; // +55%
      }
    }
  }

  // Add $3 for ceiling installation (universal rule for all products)
  if (isCeilingInstallation) {
    priceUSD = priceUSD + 3;
  }

  // Determine if over limit based on product
  let maxPerimeter = 720; // Default for first product
  if (productId === "68f36177f6edd352f8920e1f") {
    maxPerimeter = 720;
  } else if (productId === "68f36177f6edd352f8920e21") {
    maxPerimeter = 360;
  } else if (productId === "69006228bafc5fb7b6d2a888") {
    maxPerimeter = 600;
  } else if (productId === "68f36177f6edd352f8920e1d") {
    maxPerimeter = 600;
  } else if (productId === "68ff560a5c85e742c1891de5") {
    maxPerimeter = 360;
  }

  return {
    priceUSD,
    rule,
    isOverLimit: perimeter > maxPerimeter
  };
};

export const getAllowedFlaps = (productId: string, perimeter: number, width?: number, height?: number): number[] => {
  const rules = SPECIAL_PRICING_RULES[productId];
  if (!rules) {
    return [1, 2, 3]; // All flaps allowed for other products
  }

  if (productId === "68f36177f6edd352f8920e1f") {
    // Rules for 68f36177f6edd352f8920e1f:
    // - До 400: только одностворчатое [1]
    // - С 401 до 480: выбор створок [1, 2], если выбрать 2х ств то +40% на цену
    // - С 481 до 720: только 2х ств обязательно [2]
    // - После 720: также только 2х ств [2]
    
    // Check if dimensions violate the 2-flap height restriction
    // For 2 flaps, height cannot be less than width * 0.55 (minimum height requirement)
    // If width is 200cm, height cannot be less than 110cm
    // Example: 200x110 is allowed, 200x109 is not allowed
    if (width !== undefined && height !== undefined && width > 0 && height > 0) {
      const minHeight = width * 0.55;
      const heightBelowLimit = height < minHeight;
      
      if (perimeter <= 400) {
        // До 400: только одностворчатое
        return [1];
      } else if (perimeter <= 480) {
        // С 401 до 480: выбор створок
        // If height is below the limit for 2 flaps, only allow 1 flap
        if (heightBelowLimit) {
          return [1]; // Only 1 flap allowed when height < width * 0.55
        }
        return [1, 2]; // Choice between 1 and 2 flaps for 401-480
      } else if (perimeter <= 720) {
        // С 481 до 720: только 2х ств обязательно
        // For larger perimeters, 2 flaps is required, but check height limit
        if (heightBelowLimit) {
          return []; // No valid configuration if height is below limit
        }
        return [2]; // Only 2 flaps allowed for 481-720
      } else {
        // После 720: также только 2х ств
        if (heightBelowLimit) {
          return []; // No valid configuration if height is below limit
        }
        return [2]; // Only 2 flaps allowed above 720
      }
    } else {
      // Fallback when dimensions not provided
      if (perimeter <= 400) {
        return [1];
      } else if (perimeter <= 480) {
        return [1, 2];
      } else {
        return [2]; // 481+ and above: only 2 flaps
      }
    }
  } else if (productId === "68f36177f6edd352f8920e21") {
    if (perimeter <= 160) {
      return [1]; // Only 1 flap allowed up to 160
    } else if (perimeter <= 280) {
      return [1, 2]; // Choice between 1 and 2 flaps for 200-280
    } else if (perimeter <= 360) {
      return [2]; // Only 2 flaps allowed for 320-360
    } else {
      return []; // No flaps allowed above 360
    }
  } else if (productId === "69006228bafc5fb7b6d2a888") {
    // Rules for 69006228bafc5fb7b6d2a888:
    // - До 160: только одностворчатая [1]
    // - С 161 до 600: выбор между 1 и 2 створками [1, 2], НО если высота относительно ширины или ширина относительно высоты превышает более чем на 40%, автоматически становится 2х створчатым [2]
    
    if (perimeter <= 160) {
      return [1]; // Только одностворчатая до 160
    } else if (perimeter <= 600) {
      // С 161 до 600: проверяем правило 40%
      if (width !== undefined && height !== undefined && width > 0 && height > 0) {
        const widthRatio = width / height;
        const heightRatio = height / width;
        
        // Если превышает 40%, автоматически становится 2х створчатым
        if (widthRatio > 1.4 || heightRatio > 1.4) {
          return [2];
        } else {
          // Иначе выбор между 1 и 2 створками
          return [1, 2];
        }
      }
      // Fallback если размеры не предоставлены
      return [1, 2];
    } else {
      // После 600: только 2 створки (максимальный периметр для продукта)
      return [2];
    }
  } else if (productId === "68f36177f6edd352f8920e1d") {
    // Flap rules for 68f36177f6edd352f8920e1d based on perimeter and 50% rule:
    // - Up to 160: only 1 flap allowed (mandatory single), ignore 50% rule
    // - 161-560: choice between 1 and 2 flaps, but if 50% rule applies (width/height > 1.5 or height/width > 1.5), force 2 flaps
    // - 561+ (including 600+): only 2 flaps allowed (mandatory double)
    
    // Check 50% rule: if width or height exceeds the other by more than 50%, force 2 flaps
    if (width !== undefined && height !== undefined && width > 0 && height > 0) {
      const widthRatio = width / height;
      const heightRatio = height / width;
      
      // If 50% rule applies (ratio > 1.5), force 2 flaps regardless of perimeter (except <= 160)
      if (widthRatio > 1.5 || heightRatio > 1.5) {
        if (perimeter <= 160) {
          // Even with 50% rule, perimeter <= 160 forces 1 flap
          return [1];
        }
        // For perimeter > 160, 50% rule forces 2 flaps
        return [2];
      }
    }
    
    // If 50% rule doesn't apply, use perimeter-based rules
    if (perimeter <= 160) {
      return [1]; // Only 1 flap allowed up to 160
    } else if (perimeter <= 560) {
      return [1, 2]; // Choice between 1 and 2 flaps from 161 to 560
    } else {
      return [2]; // Only 2 flaps allowed from 561 and above
    }
  } else if (productId === "68ff560a5c85e742c1891de5") {
    // Flap rules for 68ff560a5c85e742c1891de5:
    // - До 160: только одностворчатая [1]
    // - С 161 до 280: выбор между 1 и 2 створками [1, 2]
    // - С 281 до 360: обязательно 2-створчатая [2]
    // - После 360: также обязательно 2-створчатая [2]
    if (perimeter <= 160) {
      return [1]; // Only 1 flap allowed up to 160
    } else if (perimeter <= 280) {
      return [1, 2]; // Choice between 1 and 2 flaps for 161-280
    } else {
      return [2]; // Only 2 flaps allowed for 281 and above
    }
  }

  return [1, 2, 3]; // Default fallback
};

export const isSpecialProduct = (productId: string): boolean => {
  return productId in SPECIAL_PRICING_RULES;
};

export const getMaxPerimeterForProduct = (productId: string): number => {
  if (productId === "68f36177f6edd352f8920e1f") {
    return 720;
  } else if (productId === "68f36177f6edd352f8920e21") {
    return 360;
  } else if (productId === "68ff560a5c85e742c1891de5") {
    return 360;
  } else if (productId === "69006228bafc5fb7b6d2a888") {
    return 600;
  } else if (productId === "68f36177f6edd352f8920e1d") {
    return 600; // Maximum perimeter for automatic calculation
  }
  return 800; // Default
};
