"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";
import {
  convertApiSizesToLocal,
  getPriceForSize,
  getLocalizedProduct,
} from "@/lib/api";
import { LocalProductSize, SupportedLanguage } from "@/lib/types";
import { useProducts } from "@/hooks/use-products";
import { useCurrency } from "@/hooks/use-currency";
import { 
  getSpecialPricingForProduct, 
  getSpecialPricingInfo, 
  getAllowedFlaps, 
  isSpecialProduct 
} from "./special-pricing";
import { PriceDisplay } from "./price-display";
import { ReadySizes } from "./ready-sizes";
import { CustomOrderForm } from "./custom-order-form";
import { InstallationTypeSelector } from "./installation-type-selector";

interface ProductConfiguratorProps {
  productId: string;
}

export function ProductConfigurator({ productId }: ProductConfiguratorProps) {
  const { t, lang } = useI18n() as any;
  const router = useRouter();
  const currentLanguage = lang === "uz" ? "uz" : ("ru" as SupportedLanguage);
  const {
    products: apiProducts,
    loading,
    getProductById,
  } = useProducts(currentLanguage);

  const { convertUSDToUZS, rate: currencyRate, loading: currencyLoading } = useCurrency();

  const product = getProductById(productId);

  const getInitialSize = (product: any) => {
    if (product && product.sizes.length > 0) {
      return product.sizes[0].size;
    }
    return "20x20";
  };

  const getInitialDimensions = (product: any) => {
    if (product && product.sizes.length > 0) {
      const firstSize = product.sizes[0].size;
      const [width, height] = firstSize.split("x").map(Number);
      return { width, height };
    }
    return { width: 20, height: 20 };
  };

  const initialDimensions = product
    ? getInitialDimensions(product)
    : { width: 20, height: 20 };
  const [selectedSize, setSelectedSize] = useState(
    product ? getInitialSize(product) : "20x20"
  );
  const [customWidth, setCustomWidth] = useState(initialDimensions.width);
  const [customHeight, setCustomHeight] = useState(initialDimensions.height);
  const [quantity, setQuantity] = useState(1);
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [usePerimeterPricing, setUsePerimeterPricing] = useState(false);
  const [selectedPerimeter, setSelectedPerimeter] = useState("");
  const [isDoubleDoor, setIsDoubleDoor] = useState(false);
  const [isCeilingInstallation, setIsCeilingInstallation] = useState(false);
  const [isTripleDoor, setIsTripleDoor] = useState(false);
  const [showCustomOrder, setShowCustomOrder] = useState(false);
  const [customOrderData, setCustomOrderData] = useState({
    width: "20",
    height: "20",
    flaps: 1,
  });
  const [currency, setCurrency] = useState<"USD" | "UZS">("UZS");

  // Force UZS currency for special product
  useEffect(() => {
    if (isSpecialProduct(productId)) {
      setCurrency("UZS");
    }
  }, [productId]);

  const getCurrentProduct = () => {
    if (product) {
      const localized = getLocalizedProduct(product, currentLanguage);
      return localized;
    }
    return null;
  };

  const localizedProduct = getCurrentProduct();

  const getSizesForProduct = (product: any): LocalProductSize[] => {
    if (product) {
      return convertApiSizesToLocal(product.sizes);
    }

    return [];
  };

  const getPerimeterPricingForProduct = (product: any) => {
    if (product && product.perimeterPricing) {
      return product.perimeterPricing;
    }

    return [];
  };

  const currentSizes = getSizesForProduct(product);
  const currentPerimeterPricing = getPerimeterPricingForProduct(product);

  const selectedSizeData = currentSizes.find(
    (size) => size.id === selectedSize
  );
  const selectedPerimeterData = currentPerimeterPricing.find(
    (p: any) => p.maxPerimeter.toString() === selectedPerimeter
  );

  const currentFlaps = useMemo(() => {
    if (showCustomOrder) {
      return customOrderData.flaps;
    } else if (isTripleDoor) {
      return 3;
    } else if (isDoubleDoor) {
      return 2;
    } else {
      return 1;
    }
  }, [showCustomOrder, customOrderData.flaps, isTripleDoor, isDoubleDoor]);

  const currentWidth = useMemo(() => {
    if (showCustomOrder) {
      const width = Number(customOrderData.width);
      return Number.isFinite(width) && width > 0 ? width : 20;
    } else if (useCustomSize) {
      return Number.isFinite(customWidth as unknown as number)
        ? (customWidth as unknown as number)
        : 0;
    } else if (usePerimeterPricing && selectedPerimeterData) {
      return selectedPerimeterData.exampleWidth;
    } else if (selectedSizeData) {
      return selectedSizeData.width;
    }
    return 30;
  }, [
    showCustomOrder,
    customOrderData.width,
    useCustomSize,
    customWidth,
    usePerimeterPricing,
    selectedPerimeterData,
    selectedSizeData,
  ]);

  const currentHeight = useMemo(() => {
    if (showCustomOrder) {
      const height = Number(customOrderData.height);
      return Number.isFinite(height) && height > 0 ? height : 20;
    } else if (useCustomSize) {
      return Number.isFinite(customHeight as unknown as number)
        ? (customHeight as unknown as number)
        : 0;
    } else if (usePerimeterPricing && selectedPerimeterData) {
      return selectedPerimeterData.exampleHeight;
    } else if (selectedSizeData) {
      return selectedSizeData.height;
    }
    return 20;
  }, [
    showCustomOrder,
    customOrderData.height,
    useCustomSize,
    customHeight,
    usePerimeterPricing,
    selectedPerimeterData,
    selectedSizeData,
  ]);

  const totalPrice = useMemo(() => {
    if (showCustomOrder) {
      // Calculate price for custom order
      if (isSpecialProduct(productId)) {
        const perimeter = (currentWidth + currentHeight) * 2;
        const specialPrice = getSpecialPricingForProduct(productId, perimeter, currentFlaps, isCeilingInstallation);
        if (specialPrice !== null) {
          return convertUSDToUZS(specialPrice) * quantity;
        }
      }
      return 0;
    }

    let priceUSD = product?.basePrice || 0;

    const widthForCalc = Number.isFinite(customWidth as unknown as number)
      ? (customWidth as unknown as number)
      : 0;
    const heightForCalc = Number.isFinite(customHeight as unknown as number)
      ? (customHeight as unknown as number)
      : 0;

    // Special pricing for special products - only for custom orders
    if (isSpecialProduct(productId) && (useCustomSize || showCustomOrder)) {
      // Use current dimensions for calculation
      const perimeter = (currentWidth + currentHeight) * 2;
      const flaps = currentFlaps;
      
      const specialPrice = getSpecialPricingForProduct(productId, perimeter, flaps, isCeilingInstallation);
      if (specialPrice !== null) {
        priceUSD = specialPrice;
      } else {
        return 0;
      }
    } else if (
      usePerimeterPricing &&
      selectedPerimeterData &&
      selectedPerimeterData.priceUSD
    ) {
      priceUSD = selectedPerimeterData.priceUSD;

      if (
        selectedPerimeterData.hasDoubleDoorOption &&
        isDoubleDoor &&
        "doubleDoorSurcharge" in selectedPerimeterData &&
        selectedPerimeterData.doubleDoorSurcharge
      ) {
        priceUSD = priceUSD * (1 + selectedPerimeterData.doubleDoorSurcharge);
      }

      if (
        selectedPerimeterData.hasInstallationTypeOption &&
        isCeilingInstallation &&
        "ceilingSurcharge" in selectedPerimeterData &&
        selectedPerimeterData.ceilingSurcharge
      ) {
        priceUSD = priceUSD + selectedPerimeterData.ceilingSurcharge;
      }
    } else if (useCustomSize) {
      const perimeter = (widthForCalc + heightForCalc) * 2;

      const perimeterData = currentPerimeterPricing.find(
        (p: any) => perimeter <= p.maxPerimeter
      );
      if (perimeterData && perimeterData.priceUSD) {
        priceUSD = perimeterData.priceUSD;

        if (
          perimeterData.hasDoubleDoorOption &&
          isDoubleDoor &&
          "doubleDoorSurcharge" in perimeterData &&
          perimeterData.doubleDoorSurcharge
        ) {
          priceUSD = priceUSD * (1 + perimeterData.doubleDoorSurcharge);
        }
        if (
          perimeterData.hasInstallationTypeOption &&
          isCeilingInstallation &&
          "ceilingSurcharge" in perimeterData &&
          perimeterData.ceilingSurcharge
        ) {
          priceUSD = priceUSD + perimeterData.ceilingSurcharge;
        }
      } else {
        const highestTier =
          currentPerimeterPricing[currentPerimeterPricing.length - 1];
        if (highestTier && highestTier.priceUSD) {
          priceUSD = highestTier.priceUSD;
          if (
            highestTier.hasInstallationTypeOption &&
            isCeilingInstallation &&
            "ceilingSurcharge" in highestTier &&
            highestTier.ceilingSurcharge
          ) {
            priceUSD = priceUSD + highestTier.ceilingSurcharge;
          }
        }
      }
    } else if (selectedSizeData && selectedSizeData.priceUSD) {
      // For custom orders, use priceUSD and convert dynamically
      priceUSD = selectedSizeData.priceUSD;

      if (product?.category === "anodos" && isCeilingInstallation) {
        priceUSD = priceUSD + 3;
      }
    }

    // For ready sizes, return priceUZS directly without conversion
    if (selectedSizeData && !useCustomSize && !usePerimeterPricing && !showCustomOrder) {
      let finalPriceUZS = selectedSizeData.priceUZS;
      
      // Add ceiling installation surcharge if applicable
      if (product?.category === "anodos" && isCeilingInstallation) {
        finalPriceUZS = finalPriceUZS + (3 * 12500); // Convert $3 to UZS using fallback rate
      }
      
      return finalPriceUZS * quantity;
    }

    // For custom orders and other cases, use dynamic conversion
    const priceUZS = convertUSDToUZS(priceUSD);
    return priceUZS * quantity;
  }, [
    showCustomOrder,
    product,
    productId,
    selectedSize,
    customWidth,
    customHeight,
    quantity,
    useCustomSize,
    usePerimeterPricing,
    selectedPerimeter,
    isDoubleDoor,
    isCeilingInstallation,
    selectedSizeData,
    selectedPerimeterData,
    currentPerimeterPricing,
    currentFlaps,
    currentWidth,
    currentHeight,
    convertUSDToUZS,
  ]);

  const perimeter = useMemo(() => {
    return (currentWidth + currentHeight) * 2;
  }, [currentWidth, currentHeight]);

  const handleAddToCart = () => {
    if (!product) return;

    const orderData = {
      productId: productId,
      modelName: localizedProduct?.name || product?.name || "Unknown Product",
      width: currentWidth,
      height: currentHeight,
      quantity,
      totalPrice,
      isCustomSize: useCustomSize,
      selectedSize: selectedSize,
      productCategory: product.category,
      currency: currency,
    };

    localStorage.setItem("currentOrder", JSON.stringify(orderData));
    localStorage.removeItem("customOrder");
    router.push("/checkout");
  };

  const handleCustomOrderSubmit = () => {
    if (!product) return;

    const width = Number(customOrderData.width);
    const height = Number(customOrderData.height);

    if (
      !Number.isFinite(width) ||
      !Number.isFinite(height) ||
      width <= 0 ||
      height <= 0
    ) {
      alert("Пожалуйста, введите корректные размеры");
      return;
    }

    const perimeter = (width + height) * 2;
    const allowedFlaps = getAllowedFlaps(productId, perimeter);

    // Calculate the actual price for custom order
    let calculatedPrice = 0;
    if (isSpecialProduct(productId)) {
      const specialPrice = getSpecialPricingForProduct(productId, perimeter, customOrderData.flaps, isCeilingInstallation);
      if (specialPrice !== null) {
        calculatedPrice = convertUSDToUZS(specialPrice) * quantity;
      }
    }

    const orderData = {
      productId: productId,
      modelName: localizedProduct?.name || product?.name || "Unknown Product",
      width: width,
      height: height,
      quantity: quantity,
      totalPrice: calculatedPrice,
      isCustomSize: true,
      isCustomOrder: true,
      flaps: customOrderData.flaps,
      perimeter: perimeter,
      productCategory: product.category,
      currency: currency,
    };
    localStorage.setItem("customOrder", JSON.stringify(orderData));
    localStorage.removeItem("currentOrder");
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Загрузка продукта...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Продукт не найден
          </h2>
          <p className="text-gray-600 mb-4">
            Продукт с ID "{productId}" не найден в API
          </p>
          <Button onClick={() => router.push("/")}>Вернуться на главную</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid gap-8 lg:gap-16 lg:grid-cols-2">
        <div className="relative z-10 bg-white rounded-xl border border-gray-100 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          <ReadySizes
            currentSizes={currentSizes}
            selectedSize={selectedSize}
            useCustomSize={useCustomSize}
            usePerimeterPricing={usePerimeterPricing}
            showCustomOrder={showCustomOrder}
            productId={productId}
            onSizeSelect={(size) => {
                        setSelectedSize(size.id);
                        setUseCustomSize(false);
                        setUsePerimeterPricing(false);
                        setCustomWidth(size.width);
                        setCustomHeight(size.height);
              
              // Close custom order form if it's open
              setShowCustomOrder(false);
              
                        const sizePerimeter = (size.width + size.height) * 2;
                        
              // Special logic for special products
              if (isSpecialProduct(productId)) {
                const allowedFlaps = getAllowedFlaps(productId, sizePerimeter);
                          if (allowedFlaps.length > 0) {
                            // Set to first allowed option
                            if (allowedFlaps.includes(1)) {
                              setIsDoubleDoor(false);
                              setIsTripleDoor(false);
                            } else if (allowedFlaps.includes(2)) {
                              setIsDoubleDoor(true);
                              setIsTripleDoor(false);
                            } else if (allowedFlaps.includes(3)) {
                              setIsDoubleDoor(false);
                              setIsTripleDoor(true);
                            }
                          }
                        } else {
                          // Original logic for other products
                          if (sizePerimeter > 200) {
                            setIsDoubleDoor(true);
                          } else {
                            setIsDoubleDoor(false);
                          }
                        }
                      }}
          />

          {selectedPerimeterData?.hasDoubleDoorOption &&
            product?.category === "transformer" && (
              <div>
                <h3 className="text-lg font-bold text-black mb-4">
                  {t("cfg.doorType")}
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setIsDoubleDoor(false)}
                    className={`p-3 border-2 rounded-lg text-center transition-colors flex-1 ${
                      !isDoubleDoor
                        ? "bg-white border-gray-600"
                        : "bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-black">
                      {t("cfg.singleDoor")}
                    </div>
                  </button>
                  <button
                    onClick={() => setIsDoubleDoor(true)}
                    className={`p-3 border-2 rounded-lg text-center transition-colors flex-1 ${
                      isDoubleDoor
                        ? "bg-white border-gray-600"
                        : "bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-black">
                      {t("cfg.doubleDoor")}
                    </div>
                    <div className="text-sm text-gray-600">
                      (+
                      {Math.round(
                        ("doubleDoorSurcharge" in selectedPerimeterData &&
                        selectedPerimeterData.doubleDoorSurcharge
                          ? selectedPerimeterData.doubleDoorSurcharge
                          : 0) * 100
                      )}
                      %)
                    </div>
                  </button>
                </div>
              </div>
            )}

          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => {
                if (!showCustomOrder) {
                  // Reset ready size selection when opening custom order
                  setSelectedSize("");
                  setUseCustomSize(false);
                  setUsePerimeterPricing(false);
                }
                setShowCustomOrder(!showCustomOrder);
              }}
              className="w-full border-gray-300 hover:bg-gray-50 text-gray-700 py-3"
            >
              {showCustomOrder ? t("cfg.closeCustomOrder") : t("cfg.customOrder")}
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-bold text-black mb-4">
              {t("cfg.quantity")}
            </h3>
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
                <div className="text-lg font-medium">
                  {quantity} {t("cfg.pcs")}
                </div>
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
            <h3 className="text-lg font-bold text-black mb-4">
              {t("cfg.total")}
            </h3>
            <PriceDisplay
              showCustomOrder={showCustomOrder}
              useCustomSize={useCustomSize}
              productId={productId}
              currentWidth={currentWidth}
              currentHeight={currentHeight}
              currentFlaps={currentFlaps}
              totalPrice={totalPrice}
              pricingInfo={(showCustomOrder || useCustomSize) ? getSpecialPricingInfo(productId, (currentWidth + currentHeight) * 2, currentFlaps, isCeilingInstallation) : undefined}
            />

            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-medium rounded-lg"
              onClick={showCustomOrder ? handleCustomOrderSubmit : handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {showCustomOrder ? t("cfg.submitOrder") : t("cfg.checkout")}
            </Button>
          </div>
        </div>

        {showCustomOrder && (
          <CustomOrderForm
            productId={productId}
            customOrderData={customOrderData}
            onDataChange={setCustomOrderData}
            onClose={() => setShowCustomOrder(false)}
            isCeilingInstallation={isCeilingInstallation}
            onInstallationTypeChange={setIsCeilingInstallation}
          />
            )}

      </div>
    </div>
  );
}
