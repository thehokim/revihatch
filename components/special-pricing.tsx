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
    { maxPerimeter: 160, priceUSD: 50, allowedFlaps: [1] },
    { maxPerimeter: 240, priceUSD: 80, allowedFlaps: [1] },
    { maxPerimeter: 280, priceUSD: 90, allowedFlaps: [1] },
    { maxPerimeter: 320, priceUSD: 100, allowedFlaps: [1] },
    { maxPerimeter: 400, priceUSD: 120, allowedFlaps: [1] },
    { maxPerimeter: 480, priceUSD: 140, allowedFlaps: [1, 2] },
    { maxPerimeter: 560, priceUSD: 220, allowedFlaps: [2] },
    { maxPerimeter: 640, priceUSD: 240, allowedFlaps: [2] },
    { maxPerimeter: 720, priceUSD: 260, allowedFlaps: [2] },
    { maxPerimeter: 800, priceUSD: 340, allowedFlaps: [3] },
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

  // For product "69006228bafc5fb7b6d2a888", allow both 1 and 2 flaps if perimeter-based rule exists
  // Otherwise, check if flaps are allowed for this perimeter
  if (productId !== "69006228bafc5fb7b6d2a888" && !rule.allowedFlaps.includes(flaps)) return null;

  let priceUSD = rule.priceUSD;

  // Special pricing logic for different products
  if (productId === "68f36177f6edd352f8920e1f") {
    // Add 40% surcharge for 2-door option on perimeter up to 480
    if (flaps === 2 && perimeter <= 480) {
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
    // Add $3 for ceiling installation on perimeter >= 280
    if (isCeilingInstallation && perimeter >= 280) {
      priceUSD = priceUSD + 3;
    }
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

  // For product "69006228bafc5fb7b6d2a888", allow both 1 and 2 flaps if perimeter-based rule exists
  // Otherwise, check if flaps are allowed for this perimeter
  if (productId !== "69006228bafc5fb7b6d2a888" && !rule.allowedFlaps.includes(flaps)) return null;

  let priceUSD = rule.priceUSD;

  // Special pricing logic for different products
  if (productId === "68f36177f6edd352f8920e1f") {
    // Add 40% surcharge for 2-door option on perimeter up to 480
    if (flaps === 2 && perimeter <= 480) {
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
    // Add $3 for ceiling installation on perimeter >= 280
    if (isCeilingInstallation && perimeter >= 280) {
      priceUSD = priceUSD + 3;
    }
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
  }

  // Determine if over limit based on product
  let maxPerimeter = 800; // Default for first product
  if (productId === "68f36177f6edd352f8920e21") {
    maxPerimeter = 360;
  } else if (productId === "69006228bafc5fb7b6d2a888") {
    maxPerimeter = 600;
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
    if (perimeter <= 400) {
      return [1]; // Only 1 flap allowed up to 400
    } else if (perimeter <= 480) {
      return [1, 2]; // Choice between 1 and 2 flaps for 480
    } else if (perimeter <= 720) {
      return [2]; // Only 2 flaps allowed for 560-720
    } else if (perimeter <= 800) {
      return [3]; // Only 3 flaps allowed for 800
    } else {
      return []; // No flaps allowed above 800
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
    // Use 40% rule based on dimensions
    if (width !== undefined && height !== undefined && width > 0 && height > 0) {
      const widthRatio = width / height;
      const heightRatio = height / width;
      
      // If width or height exceeds the other by more than 40%, force 2 flaps
      if (widthRatio > 1.4 || heightRatio > 1.4) {
        return [2];
      } else {
        // Otherwise, allow choice between 1 and 2 flaps
        return [1, 2];
      }
    }
    // Fallback to [1, 2] if dimensions not provided
    return [1, 2];
  }

  return [1, 2, 3]; // Default fallback
};

export const isSpecialProduct = (productId: string): boolean => {
  return productId in SPECIAL_PRICING_RULES;
};

export const getMaxPerimeterForProduct = (productId: string): number => {
  if (productId === "68f36177f6edd352f8920e21") {
    return 360;
  } else if (productId === "69006228bafc5fb7b6d2a888") {
    return 600;
  } else if (productId === "68f36177f6edd352f8920e1f") {
    return 800;
  }
  return 800; // Default
};
