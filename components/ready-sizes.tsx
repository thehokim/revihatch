"use client";

import { useI18n } from "@/components/i18n-provider";
import { LocalProductSize } from "@/lib/types";
import { getAllowedFlaps, isSpecialProduct } from "./special-pricing";

interface ReadySizesProps {
  currentSizes: LocalProductSize[];
  selectedSize: string;
  useCustomSize: boolean;
  usePerimeterPricing: boolean;
  showCustomOrder: boolean;
  productId: string;
  onSizeSelect: (size: LocalProductSize) => void;
}

export function ReadySizes({
  currentSizes,
  selectedSize,
  useCustomSize,
  usePerimeterPricing,
  showCustomOrder,
  productId,
  onSizeSelect
}: ReadySizesProps) {
  const { t } = useI18n() as any;

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-black">
          {t("cfg.readySizes")}
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {currentSizes.map((size) => (
          <button
            key={size.id}
            onClick={() => onSizeSelect(size)}
            className={`p-3 border-2 rounded-lg text-center transition-colors ${
              selectedSize === size.id &&
              !useCustomSize &&
              !usePerimeterPricing &&
              !showCustomOrder
                ? "bg-white border-gray-600"
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="font-medium text-black">{size.label}</div>
            <div className="text-sm text-gray-600">
              (
              {`${new Intl.NumberFormat("ru-RU").format(
                size.priceUZS || 0
              )} UZS`}
              )
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
