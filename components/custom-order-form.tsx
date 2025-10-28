"use client";

import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import { getAllowedFlaps, isSpecialProduct, getSpecialPricingForProduct, getMaxPerimeterForProduct } from "./special-pricing";
import { useCurrency } from "@/hooks/use-currency";
import { InstallationTypeSelector } from "./installation-type-selector";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, CheckCircle, Minus, Plus } from "lucide-react";

interface CustomOrderData {
  width: string;
  height: string;
  flaps: number;
  quantity: number;
}

interface CustomOrderFormProps {
  productId: string;
  customOrderData: CustomOrderData;
  onDataChange: (data: CustomOrderData) => void;
  onClose: () => void;
  isCeilingInstallation?: boolean;
  onInstallationTypeChange?: (isCeiling: boolean) => void;
  onPriceCalculated?: (price: number, hasOrder: boolean) => void;
}

export function CustomOrderForm({
  productId,
  customOrderData,
  onDataChange,
  onClose,
  isCeilingInstallation,
  onInstallationTypeChange,
  onPriceCalculated
}: CustomOrderFormProps) {
  const { t } = useI18n() as any;
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showMinSizeModal, setShowMinSizeModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [isPriceCalculated, setIsPriceCalculated] = useState(false);
  const [lastCalculatedDimensions, setLastCalculatedDimensions] = useState({ width: "", height: "" });
  const { convertUSDToUZS } = useCurrency();

  // Auto-adjust flaps when dimensions change for special product
  useEffect(() => {
    if (isSpecialProduct(productId)) {
      const width = Number(customOrderData.width);
      const height = Number(customOrderData.height);
      
      if (productId === "69006228bafc5fb7b6d2a888" && Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
        // Use 40% rule for this specific product
        const widthRatio = width / height;
        const heightRatio = height / width;
        
        // If width or height exceeds the other by more than 40%, force 2 flaps
        if (widthRatio > 1.4 || heightRatio > 1.4) {
          if (customOrderData.flaps !== 2) {
            onDataChange({
              ...customOrderData,
              flaps: 2
            });
          }
        }
      }
      
      const perimeter = Number.isFinite(width) && Number.isFinite(height) ? (width + height) * 2 : 0;
      const allowedFlaps = getAllowedFlaps(productId, perimeter, width, height);
      
      if (allowedFlaps.length > 0 && !allowedFlaps.includes(customOrderData.flaps)) {
        onDataChange({
          ...customOrderData,
          flaps: allowedFlaps[0] // Set to first allowed option
        });
      }
    }
  }, [customOrderData.width, customOrderData.height, productId, customOrderData.flaps, onDataChange]);

  // Store flaps value to detect changes
  const prevFlapsRef = useRef(customOrderData.flaps);

  // Reset price if dimensions change (price should be recalculated)
  useEffect(() => {
    if (isSpecialProduct(productId) && isPriceCalculated && lastCalculatedDimensions.width && lastCalculatedDimensions.height) {
      const currentDimensions = customOrderData.width + "_" + customOrderData.height;
      const lastDimensions = lastCalculatedDimensions.width + "_" + lastCalculatedDimensions.height;
      
      // If dimensions changed, reset calculated price
      if (currentDimensions !== lastDimensions) {
        setCalculatedPrice(0);
        setIsPriceCalculated(false);
        if (onPriceCalculated) {
          onPriceCalculated(0, false);
        }
      }
    }
  }, [customOrderData.width, customOrderData.height, productId, isPriceCalculated, lastCalculatedDimensions, onPriceCalculated, isSpecialProduct]);

  // Reset price if flaps change (price should be recalculated)
  useEffect(() => {
    if (isSpecialProduct(productId) && isPriceCalculated && prevFlapsRef.current !== customOrderData.flaps) {
      setCalculatedPrice(0);
      setIsPriceCalculated(false);
      if (onPriceCalculated) {
        onPriceCalculated(0, false);
      }
    }
    prevFlapsRef.current = customOrderData.flaps;
  }, [customOrderData.flaps, productId, isPriceCalculated, onPriceCalculated, isSpecialProduct]);

  const handleWidthChange = (value: string) => {
    onDataChange({
      ...customOrderData,
      width: value,
    });
  };

  const handleHeightChange = (value: string) => {
    onDataChange({
      ...customOrderData,
      height: value,
    });
  };

  const handleFlapsChange = (flaps: number) => {
    onDataChange({
      ...customOrderData,
      flaps,
    });
  };

  const handleCalculate = () => {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return;
    }
    
    // Check if size is below minimum (15x15)
    if (width < 15 || height < 15) {
      setShowMinSizeModal(true);
      return;
    }
    
    const widthRatio = width / height;
    const heightRatio = height / width;
    
    // Check if aspect ratio exceeds 170%
    if (widthRatio > 1.7 || heightRatio > 1.7) {
      // Reset values to minimum size (15x15) when showing modal
      onDataChange({
        width: "15",
        height: "15",
        flaps: customOrderData.flaps,
        quantity: customOrderData.quantity
      });
      setShowLimitModal(true);
      return;
    }

    // If all conditions are met, calculate and show the price
    if (isSpecialProduct(productId)) {
      const perimeter = (width + height) * 2;
      const specialPrice = getSpecialPricingForProduct(productId, perimeter, customOrderData.flaps, isCeilingInstallation);
      
      if (specialPrice !== null) {
        const priceUZS = convertUSDToUZS(specialPrice);
        setCalculatedPrice(priceUZS);
        setIsPriceCalculated(true);
        setLastCalculatedDimensions({ width: customOrderData.width, height: customOrderData.height });
        // Notify parent component about calculated price
        if (onPriceCalculated) {
          onPriceCalculated(priceUZS, true);
        }
      }
    }
  };

  const width = Number(customOrderData.width);
  const height = Number(customOrderData.height);
  const perimeter = Number.isFinite(width) && Number.isFinite(height) ? (width + height) * 2 : 0;
  const allowedFlaps = getAllowedFlaps(productId, perimeter, width, height);

  // Визуальная схема для специальных продуктов
  const showSpecialLayout = isSpecialProduct(productId);
  const maxPerimeter = isSpecialProduct(productId) ? getMaxPerimeterForProduct(productId) : 800;

  return (
    <div className="relative z-10">
      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-black">
              {t("cfg.customOrderTitle")}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          {/* Визуальная схема для special product */}
          {showSpecialLayout && (
            <div className="w-full flex justify-center my-4">
              {(() => {
            // Определяем тип прямоугольника на основе соотношения сторон
            const currentWidth = Number(width || 20);
            const currentHeight = Number(height || 20);
            const aspectRatio = currentWidth / currentHeight;
            
            let rectWidth, rectHeight;
            
            if (Math.abs(aspectRatio - 1) < 0.1) {
              // Квадрат
              rectWidth = 280;
              rectHeight = 280;
            } else if (aspectRatio > 1) {
              // Ширина больше высоты
              rectWidth = 340;
              rectHeight = 200;
            } else {
              // Высота больше ширины
              rectWidth = 200;
              rectHeight = 340;
            }
            
            // Центрируем прямоугольник
            const centerX = 200;
            const centerY = 200;
            const rectX = centerX - rectWidth / 2;
            const rectY = centerY - rectHeight / 2;
            
            // Вычисляем точные границы с минимальными отступами
            const leftEdge = rectX - 60;  // Уменьшил от 70+ до 60
            const rightEdge = rectX + rectWidth + 10;
            
            const topEdge = rectY - 10;   // Уменьшил отступ сверху
            const bottomEdge = rectY + rectHeight + 70;  // Уменьшил отступ снизу
            
            const viewBoxWidth = rightEdge - leftEdge;
            const viewBoxHeight = bottomEdge - topEdge;
            
            return (
              <svg 
                width={viewBoxWidth}
                height={viewBoxHeight}
                viewBox={`${leftEdge} ${topEdge} ${viewBoxWidth} ${viewBoxHeight}`}
              >
                {/* Основной прямоугольник с закругленными углами */}
                <rect
                  x={rectX}
                  y={rectY}
                  width={rectWidth}
                  height={rectHeight}
                  rx="12"
                  ry="12"
                  fill="none"
                  stroke="#000"
                  strokeWidth="4"
                />
                
                {/* Горизонтальная линия по центру */}
                <line
                  x1={rectX}
                  y1={rectY + rectHeight / 2}
                  x2={rectX + rectWidth}
                  y2={rectY + rectHeight / 2}
                  stroke="#999"
                  strokeWidth="2"
                />
                
                {/* Вертикальная линия по центру */}
                <line
                  x1={rectX + rectWidth / 2}
                  y1={rectY}
                  x2={rectX + rectWidth / 2}
                  y2={rectY + rectHeight}
                  stroke={customOrderData.flaps === 2 ? "#000" : "#999"}
                  strokeWidth={customOrderData.flaps === 2 ? "3" : "2"}
                />
                
                {/* Черный круг(и) в зависимости от типа створок */}
                {customOrderData.flaps === 1 ? (
                  // Один круг для одностворчатого - на пересечении линий справа, дальше от центра
                  <circle
                    cx={rectX + rectWidth * 0.85}
                    cy={rectY + rectHeight / 2}
                    r="8"
                    fill="#000"
                  />
                ) : (
                  // Два круга для двухстворчатого - на горизонтальной линии ближе друг к другу
                  <>
                    <circle
                      cx={rectX + rectWidth * 0.4}
                      cy={rectY + rectHeight / 2}
                      r="8"
                      fill="#000"
                    />
                    <circle
                      cx={rectX + rectWidth * 0.6}
                      cy={rectY + rectHeight / 2}
                      r="8"
                      fill="#000"
                    />
                  </>
                )}
                
                {/* Определение стрелок */}
                <defs>
                  <marker id="arrowhead-special" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#000" />
                  </marker>
                  <marker id="arrowhead-reverse" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto-start-reverse">
                    <polygon points="0 0, 10 3, 0 6" fill="#000" />
                  </marker>
                </defs>
                
                {/* Вертикальная стрелка слева (Высота) */}
                <line 
                  x1={rectX - 30} 
                  y1={rectY} 
                  x2={rectX - 30} 
                  y2={rectY + rectHeight} 
                  stroke="#000" 
                  strokeWidth="1.5" 
                  markerEnd="url(#arrowhead-special)" 
                  markerStart="url(#arrowhead-reverse)" 
                />
                <text 
                  x={rectX - 50} 
                  y={rectY + rectHeight / 2} 
                  fontSize="10" 
                  fill="#000" 
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(-90 ${rectX - 50} ${rectY + rectHeight / 2})`}
                >
                  {height || 20} {t("cfg.units.cm")}
                </text>
                
                {/* Горизонтальная стрелка снизу (Ширина) */}
                <line 
                  x1={rectX} 
                  y1={rectY + rectHeight + 30} 
                  x2={rectX + rectWidth} 
                  y2={rectY + rectHeight + 30} 
                  stroke="#000" 
                  strokeWidth="1.5" 
                  markerEnd="url(#arrowhead-special)" 
                  markerStart="url(#arrowhead-reverse)" 
                />
                <text 
                  x={rectX + rectWidth / 2} 
                  y={rectY + rectHeight + 55} 
                  fontSize="10" 
                  fill="#000" 
                  textAnchor="middle"
                >
                  {width || 20} {t("cfg.units.cm")}
                </text>
              </svg>
              );
            })()}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {showSpecialLayout ? (
                <>
                  <div>
                    <Label
                      htmlFor="custom-height"
                      className="text-sm font-medium text-gray-700"
                    >
                      {t("cfg.heightDimension")}
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="custom-height"
                        type="number"
                        min="15"
                        max="200"
                        value={customOrderData.height}
                        onChange={(e) => handleHeightChange(e.target.value)}
                        className="pr-8 border-gray-300"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        {t("cfg.units.cm")}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="custom-width"
                      className="text-sm font-medium text-gray-700"
                    >
                      {t("cfg.widthDimension")}
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="custom-width"
                        type="number"
                        min="15"
                        max="200"
                        value={customOrderData.width}
                        onChange={(e) => handleWidthChange(e.target.value)}
                        className="pr-8 border-gray-300"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        {t("cfg.units.cm")}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label
                      htmlFor="custom-width"
                      className="text-sm font-medium text-gray-700"
                    >
                      {t("cfg.widthLabel")}
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="custom-width"
                        type="number"
                        min="15"
                        max="200"
                        value={customOrderData.width}
                        onChange={(e) => handleWidthChange(e.target.value)}
                        className="pr-8 border-gray-300"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        {t("cfg.units.cm")}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="custom-height"
                      className="text-sm font-medium text-gray-700"
                    >
                      {t("cfg.heightLabel")}
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="custom-height"
                        type="number"
                        min="15"
                        max="200"
                        value={customOrderData.height}
                        onChange={(e) => handleHeightChange(e.target.value)}
                        className="pr-8 border-gray-300"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        {t("cfg.units.cm")}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Опции для special product */}
            {isSpecialProduct(productId) && isCeilingInstallation !== undefined && onInstallationTypeChange ? (
              <>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    {t("cfg.flapType")}
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`relative cursor-pointer group ${!allowedFlaps.includes(1) ? 'cursor-not-allowed' : ''}`}>
                      <input
                        type="radio"
                        name="flaps"
                        value={1}
                        checked={customOrderData.flaps === 1}
                        onChange={(e) => handleFlapsChange(Number(e.target.value))}
                        disabled={!allowedFlaps.includes(1)}
                        className="sr-only"
                      />
                      <div
                        className={`p-3 border-2 rounded-lg text-center transition-all duration-200 ${
                          customOrderData.flaps === 1
                            ? "bg-white border-gray-600 shadow-sm"
                            : !allowedFlaps.includes(1)
                            ? "bg-gray-100 border-gray-200 opacity-50"
                            : "bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm"
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {t("cfg.singleFlap")}
                        </div>
                      </div>
                    </label>

                    <label className={`relative cursor-pointer group ${!allowedFlaps.includes(2) ? 'cursor-not-allowed' : ''}`}>
                      <input
                        type="radio"
                        name="flaps"
                        value={2}
                        checked={customOrderData.flaps === 2}
                        onChange={(e) => handleFlapsChange(Number(e.target.value))}
                        disabled={!allowedFlaps.includes(2)}
                        className="sr-only"
                      />
                      <div
                        className={`p-3 border-2 rounded-lg text-center transition-all duration-200 ${
                          customOrderData.flaps === 2
                            ? "bg-white border-gray-600 shadow-sm"
                            : !allowedFlaps.includes(2)
                            ? "bg-gray-100 border-gray-200 opacity-50"
                            : "bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm"
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {t("cfg.doubleFlap")}
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Show installation type selector only when perimeter >= 240cm */}
                {perimeter >= 240 && (
                  <InstallationTypeSelector
                    isCeilingInstallation={isCeilingInstallation}
                    onInstallationTypeChange={onInstallationTypeChange}
                  />
                )}
              </>
            ) : (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  {t("cfg.flaps")}
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="relative cursor-pointer group">
                    <input
                      type="radio"
                      name="flaps"
                      value={1}
                      checked={customOrderData.flaps === 1}
                      disabled={!allowedFlaps.includes(1)}
                      onChange={(e) => handleFlapsChange(Number(e.target.value))}
                      className="sr-only"
                    />
                    <div
                      className={`p-3 border-2 rounded-lg text-center transition-all duration-200 h-20 flex flex-col justify-center space-y-1 ${
                        customOrderData.flaps === 1
                          ? "bg-white border-gray-600 shadow-sm"
                          : allowedFlaps.includes(1)
                          ? "bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm"
                          : "bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        1
                      </div>
                      <div className="text-xs text-gray-600">
                        {t("cfg.doorTypes.singleRight")}
                      </div>
                    </div>
                  </label>

                  <label className="relative cursor-pointer group">
                    <input
                      type="radio"
                      name="flaps"
                      value={2}
                      checked={customOrderData.flaps === 2}
                      disabled={!allowedFlaps.includes(2)}
                      onChange={(e) => handleFlapsChange(Number(e.target.value))}
                      className="sr-only"
                    />
                    <div
                      className={`p-3 border-2 rounded-lg text-center transition-all duration-200 h-20 flex flex-col justify-center space-y-1 ${
                        customOrderData.flaps === 2
                          ? "bg-white border-gray-600 shadow-sm"
                          : allowedFlaps.includes(2)
                          ? "bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm"
                          : "bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        2
                      </div>
                      <div className="text-xs text-gray-600">
                        {t("cfg.doorTypes.doubleCenter")}
                      </div>
                    </div>
                  </label>

                  <label className="relative cursor-pointer group">
                    <input
                      type="radio"
                      name="flaps"
                      value={3}
                      checked={customOrderData.flaps === 3}
                      disabled={!allowedFlaps.includes(3)}
                      onChange={(e) => handleFlapsChange(Number(e.target.value))}
                      className="sr-only"
                    />
                    <div
                      className={`p-3 border-2 rounded-lg text-center transition-all duration-200 h-20 flex flex-col justify-center space-y-1 ${
                        customOrderData.flaps === 3
                          ? "bg-white border-gray-600 shadow-sm"
                          : allowedFlaps.includes(3)
                          ? "bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm"
                          : "bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        3
                      </div>
                      <div className="text-xs text-gray-600">
                        {t("cfg.doorTypes.tripleEven")}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div className="flex items-center justify-between border-1 border-gray-200 rounded-xl bg-white">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDataChange({
                  ...customOrderData,
                  quantity: Math.max(0, customOrderData.quantity - 1)
                })}
                disabled={customOrderData.quantity <= 0}
                className="w-12 h-12 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="h-5 w-5" />
              </Button>
              <span className="text-xl font-semibold text-black px-4">
                {customOrderData.quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDataChange({
                  ...customOrderData,
                  quantity: customOrderData.quantity + 1
                })}
                className="w-12 h-12 hover:bg-gray-100 transition-colors"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            {/* Show calculated price and calculate button for special products */}
            {isSpecialProduct(productId) && (
              <>
                {calculatedPrice > 0 && perimeter <= maxPerimeter && (
                  <div className="text-right text-lg font-semibold text-black mb-2">
                    {t("cfg.priceLabel")} {(calculatedPrice * customOrderData.quantity).toLocaleString("ru-RU")} UZS
                  </div>
                )}
                {isPriceCalculated && perimeter > maxPerimeter && (
                  <div className="text-sm text-gray-600 italic mb-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    {t("cfg.customOrderPriceNote")}
                  </div>
                )}
                <Button
                  onClick={handleCalculate}
                  className="w-full border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-900 py-3 text-lg font-medium rounded-lg"
                >
                  {t("cfg.calculate")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal for aspect ratio limit */}
      <Dialog open={showLimitModal} onOpenChange={(open) => !open && setShowLimitModal(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {t("cfg.dimensionsExceededTitle")}
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="pt-4">
            <p className="text-gray-700 text-base leading-relaxed">
              {t("cfg.dimensionsExceededDesc")}
            </p>
            <Button 
              onClick={() => setShowLimitModal(false)}
              className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white"
            >
              {t("cfg.understood")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal for minimum size limit */}
      <Dialog open={showMinSizeModal} onOpenChange={(open) => !open && setShowMinSizeModal(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {t("cfg.minSizeTitle")}
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="pt-4">
            <p className="text-gray-700 text-base leading-relaxed">
              {t("cfg.minSizeDesc")}
            </p>
            <Button 
              onClick={() => setShowMinSizeModal(false)}
              className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white"
            >
              {t("cfg.understood")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal for calculated price */}
      <Dialog open={showPriceModal} onOpenChange={(open) => !open && setShowPriceModal(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {t("cfg.finalPrice")}
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="pt-4">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-600 mb-2">
                {t("cfg.dimensions")} {customOrderData.width} × {customOrderData.height} {t("cfg.units.cm")}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {t("cfg.perimeterLabel")} {perimeter} {t("cfg.units.cm")}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {t("cfg.flapTypeLabel")} {customOrderData.flaps === 1 ? t("cfg.singleFlap") : t("cfg.doubleFlap")}
              </div>
              {isCeilingInstallation && (
                <div className="text-sm text-gray-600 mb-2">
                  {t("cfg.installationTypeLabel")} {t("cfg.ceiling")}
                </div>
              )}
            </div>
            <div className="text-center py-4 border-t border-b border-gray-200">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {calculatedPrice.toLocaleString("ru-RU")} UZS
              </div>
              <div className="text-sm text-gray-600">
                {t("cfg.perUnit")}
              </div>
            </div>
            <Button 
              onClick={() => setShowPriceModal(false)}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white"
            >
              {t("cfg.understood")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
