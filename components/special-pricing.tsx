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
  "68f8b52c7a3c09f23e7a080b": [
    { maxPerimeter: 120, priceUSD: 26, allowedFlaps: [1] },
    { maxPerimeter: 160, priceUSD: 35, allowedFlaps: [1] },
    { maxPerimeter: 200, priceUSD: 40, allowedFlaps: [1] },
    { maxPerimeter: 240, priceUSD: 43, allowedFlaps: [1] },
    { maxPerimeter: 280, priceUSD: 49, allowedFlaps: [1] },
    { maxPerimeter: 320, priceUSD: 57, allowedFlaps: [1] },
    { maxPerimeter: 360, priceUSD: 65, allowedFlaps: [1] },
    { maxPerimeter: 400, priceUSD: 75, allowedFlaps: [1] },
    { maxPerimeter: 440, priceUSD: 87, allowedFlaps: [1] },
  ],
  // Add more product IDs here as needed
  // "another-product-id": [...],
};

export const getSpecialPricingForProduct = (productId: string, perimeter: number, flaps: number, isCeilingInstallation?: boolean): number | null => {
  const rules = SPECIAL_PRICING_RULES[productId];
  if (!rules) return null;

  const rule = rules.find(r => perimeter <= r.maxPerimeter);
  if (!rule) return null;

  // Check if flaps are allowed for this perimeter
  if (!rule.allowedFlaps.includes(flaps)) return null;

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
  } else if (productId === "68f8b52c7a3c09f23e7a080b") {
    // Add $3 for ceiling installation on perimeter >= 280
    if (isCeilingInstallation && perimeter >= 280) {
      priceUSD = priceUSD + 3;
    }
  }

  return priceUSD;
};

export const getSpecialPricingInfo = (productId: string, perimeter: number, flaps: number, isCeilingInstallation?: boolean): PricingInfo | null => {
  const rules = SPECIAL_PRICING_RULES[productId];
  if (!rules) return null;
  
  const rule = rules.find(r => perimeter <= r.maxPerimeter);
  if (!rule) return null;

  // Check if flaps are allowed for this perimeter
  if (!rule.allowedFlaps.includes(flaps)) return null;

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
  } else if (productId === "68f8b52c7a3c09f23e7a080b") {
    // Add $3 for ceiling installation on perimeter >= 280
    if (isCeilingInstallation && perimeter >= 280) {
      priceUSD = priceUSD + 3;
    }
  }

  // Determine if over limit based on product
  let maxPerimeter = 800; // Default for first product
  if (productId === "68f36177f6edd352f8920e21") {
    maxPerimeter = 360;
  } else if (productId === "68f8b52c7a3c09f23e7a080b") {
    maxPerimeter = 440;
  }

  return {
    priceUSD,
    rule,
    isOverLimit: perimeter > maxPerimeter
  };
};

export const getAllowedFlaps = (productId: string, perimeter: number): number[] => {
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
  } else if (productId === "68f8b52c7a3c09f23e7a080b") {
    return [1]; // Only 1 flap allowed for all perimeters
  }

  return [1, 2, 3]; // Default fallback
};

export const isSpecialProduct = (productId: string): boolean => {
  return productId in SPECIAL_PRICING_RULES;
};
