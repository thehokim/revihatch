"use client";

import { useI18n } from "@/components/i18n-provider";
import { PricingInfo, isSpecialProduct } from "./special-pricing";
import { useCurrency } from "@/hooks/use-currency";

// Helper function to get max perimeter for a product
const getMaxPerimeter = (productId: string): number => {
  if (productId === "68f36177f6edd352f8920e21") {
    return 360;
  } else if (productId === "68f8b52c7a3c09f23e7a080b") {
    return 440;
  }
  return 800; // Default for other special products
};

interface PriceDisplayProps {
  showCustomOrder: boolean;
  useCustomSize: boolean;
  productId: string;
  currentWidth: number;
  currentHeight: number;
  currentFlaps: number;
  totalPrice: number;
  pricingInfo?: PricingInfo | null;
}

export function PriceDisplay({
  showCustomOrder,
  useCustomSize,
  productId,
  currentWidth,
  currentHeight,
  currentFlaps,
  totalPrice,
  pricingInfo
}: PriceDisplayProps) {
  const { t } = useI18n() as any;
  const { convertUSDToUZS } = useCurrency();

  if (showCustomOrder) {
    const perimeter = (currentWidth + currentHeight) * 2;
    
    if (isSpecialProduct(productId) && pricingInfo) {
      if (pricingInfo.isOverLimit) {
        return (
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                    {t("cfg.maxSizeExceeded")}
                  </h4>
                  <p className="text-sm text-yellow-800 mb-1">
                    {t("cfg.perimeterMax").replace("{perimeter}", perimeter.toString()).replace("{maxPerimeter}", getMaxPerimeter(productId).toString())}
                  </p>
                  <p className="text-xs text-yellow-700">
                    {t("cfg.managerContactRequired")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        const priceUZS = convertUSDToUZS(pricingInfo.priceUSD);
        return (
          <div className="mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    {t("cfg.perimeterPrice")}
                  </h4>
                  <p className="text-sm text-gray-800 mb-1">
                    {t("cfg.perimeterUpTo").replace("{perimeter}", perimeter.toString()).replace("{maxPerimeter}", pricingInfo.rule.maxPerimeter.toString())}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat("ru-RU").format(priceUZS)} UZS
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div className="mb-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  {t("cfg.customCalculation")}
                </h4>
                <p className="text-sm text-gray-800 mb-1">
                  {t("cfg.priceByPerimeter")}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  if (useCustomSize) {
    if (isSpecialProduct(productId) && pricingInfo) {
      const perimeter = (currentWidth + currentHeight) * 2;
      const priceUZS = Math.round(pricingInfo.priceUSD * 12500);
      return (
        <div className="mb-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  {t("cfg.perimeterPrice")}
                </h4>
                <p className="text-sm text-gray-800 mb-1">
                  {t("cfg.perimeterUpTo").replace("{perimeter}", perimeter.toString()).replace("{maxPerimeter}", pricingInfo.rule.maxPerimeter.toString())}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {new Intl.NumberFormat("ru-RU").format(priceUZS)} UZS
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">
                {t("cfg.priceByPerimeter")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-3xl font-bold text-black mb-6">
      {`${new Intl.NumberFormat("ru-RU").format(totalPrice)} UZS`}
    </div>
  );
}
