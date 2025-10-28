"use client";

import { useI18n } from "@/components/i18n-provider";
import { LocalProductSize } from "@/lib/types";
import { Minus, Plus } from "lucide-react";

interface SelectedSizeWithQuantity {
  size: LocalProductSize;
  quantity: number;
}

interface ReadySizesProps {
  currentSizes: LocalProductSize[];
  selectedSize: string;
  useCustomSize: boolean;
  usePerimeterPricing: boolean;
  showCustomOrder: boolean;
  productId: string;
  onSizeSelect: (size: LocalProductSize) => void;
  selectedSizesWithQuantity: SelectedSizeWithQuantity[];
  onQuantityChange: (sizeId: string, quantity: number) => void;
}

export function ReadySizes({
  currentSizes,
  selectedSize,
  useCustomSize,
  usePerimeterPricing,
  showCustomOrder,
  productId,
  onSizeSelect,
  selectedSizesWithQuantity,
  onQuantityChange
}: ReadySizesProps) {
  const { t } = useI18n() as any;

  const getQuantityForSize = (sizeId: string): number => {
    const selected = selectedSizesWithQuantity.find(s => s.size.id === sizeId);
    return selected?.quantity || 0;
  };

  const increaseQuantity = (size: LocalProductSize) => {
    const currentQty = getQuantityForSize(size.id);
    if (currentQty === 0) {
      onSizeSelect(size);
    }
    onQuantityChange(size.id, currentQty + 1);
  };

  const decreaseQuantity = (sizeId: string) => {
    const currentQty = getQuantityForSize(sizeId);
    if (currentQty > 0) {
      onQuantityChange(sizeId, currentQty - 1);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-black">
          {t("cfg.readySizes")}
        </h3>
      </div>

      <div className="space-y-1">
        {currentSizes.map((size) => {
          const quantity = getQuantityForSize(size.id);
          const isSelected = quantity > 0;
          
          return (
            <div
              key={size.id}
              className={`flex items-center justify-between p-2 border-1 rounded-lg transition-colors ${
                isSelected
                  ? "bg-gray-50 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
            >
              <div className="flex-1 text-sm">
                <span className="font-medium text-lg text-black">{size.label}</span>
                <span className="text-gray-black text-lg">
                  {" - "}
                  {`${new Intl.NumberFormat("ru-RU").format(size.priceUZS || 0)} UZS`}
                </span>
              </div>
              
              {isSelected && (
                <div className="flex items-center gap-2 ml-3">
                  <button
                    onClick={() => decreaseQuantity(size.id)}
                    className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => onQuantityChange(size.id, quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              {!isSelected && (
                <button
                  onClick={() => increaseQuantity(size)}
                  className="ml-3 px-4 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium whitespace-nowrap"
                >
                  {t("cfg.add")}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
