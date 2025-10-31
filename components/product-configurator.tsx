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
  isSpecialProduct,
  getMaxPerimeterForProduct
} from "./special-pricing";
import { PriceDisplay } from "./price-display";
import { ReadySizes } from "./ready-sizes";
import { CustomOrderForm } from "./custom-order-form";
import { InstallationTypeSelector } from "./installation-type-selector";

interface ProductConfiguratorProps {
  productId: string;
}

interface SelectedSizeWithQuantity {
  size: LocalProductSize;
  quantity: number;
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
    return { width: 15, height: 15 };
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
  
  // Get initial dimensions based on product
  const getInitialCustomOrderDimensions = () => {
    if (productId === "68ff560a5c85e742c1891de5") {
      return { width: "20", height: "30" };
    } else if (productId === "69006228bafc5fb7b6d2a888") {
      return { width: "15", height: "15" };
    } else if (productId === "68f36177f6edd352f8920e1d") {
      return { width: "15", height: "15" };
    } else if (productId === "68f36177f6edd352f8920e1f") {
      return { width: "25", height: "25" };
    }
    return { width: "15", height: "15" };
  };
  
  const [customOrderData, setCustomOrderData] = useState(() => {
    const dims = getInitialCustomOrderDimensions();
    return {
      width: dims.width,
      height: dims.height,
      flaps: 1,
      quantity: 1,
    };
  });
  const [currency, setCurrency] = useState<"USD" | "UZS">("UZS");
  const [selectedSizesWithQuantity, setSelectedSizesWithQuantity] = useState<SelectedSizeWithQuantity[]>([]);
  const [customOrderPrice, setCustomOrderPrice] = useState(0);
  const [hasCustomOrder, setHasCustomOrder] = useState(false);
  const [customOrderExceedsLimit, setCustomOrderExceedsLimit] = useState(false);

  // Force UZS currency for special product
  useEffect(() => {
    if (isSpecialProduct(productId)) {
      setCurrency("UZS");
    }
  }, [productId]);

  // Update custom order dimensions when product changes or form opens
  useEffect(() => {
    if (showCustomOrder) {
      const dims = getInitialCustomOrderDimensions();
      const currentWidth = Number(customOrderData.width);
      const currentHeight = Number(customOrderData.height);
      const minWidth = Number(dims.width);
      const minHeight = Number(dims.height);
      
      // Update dimensions if current values are below minimum for this product
      if (currentWidth < minWidth || currentHeight < minHeight) {
        setCustomOrderData(prev => ({
          ...prev,
          width: dims.width,
          height: dims.height,
        }));
      }
    }
  }, [showCustomOrder, productId]);

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

  const handleQuantityChange = (sizeId: string, quantity: number) => {
    setSelectedSizesWithQuantity(prev => {
      const allSizes = getSizesForProduct(product);
      if (quantity === 0) {
        // Remove item if quantity is 0
        return prev.filter(item => item.size.id !== sizeId);
      } else {
        // Update or add item
        const existing = prev.find(item => item.size.id === sizeId);
        if (existing) {
          return prev.map(item => 
            item.size.id === sizeId ? { ...item, quantity } : item
          );
        } else {
          const size = allSizes.find(s => s.id === sizeId);
          if (size) {
            return [...prev, { size, quantity }];
          }
          return prev;
        }
      }
    });
  };

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
      alert(t("cfg.invalidDimensions"));
      return;
    }

    const perimeter = (width + height) * 2;
    const allowedFlaps = getAllowedFlaps(productId, perimeter, width, height);

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
          <p className="mt-4 text-lg">{t("cfg.loading")}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t("cfg.productNotFound")}
          </h2>
          <p className="text-gray-600 mb-4">
            {t("cfg.productNotFoundDesc").replace("{productId}", productId)}
          </p>
          <Button onClick={() => router.push("/")}>{t("cfg.goBack")}</Button>
        </div>
      </div>
    );
  }

  const hasRightColumnContent = showCustomOrder || selectedSizesWithQuantity.length > 0;

  return (
    <div className="w-full">
        <div className={hasRightColumnContent ? "grid gap-8 lg:gap-16 lg:grid-cols-2 lg:items-start" : ""}>
        <div className={`relative z-10 bg-white rounded-xl border border-gray-100 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 ${!hasRightColumnContent ? 'w-full max-w-2xl' : 'lg:self-start'}`}>
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
              
                        const sizePerimeter = (size.width + size.height) * 2;
                        
              // Special logic for special products
              if (isSpecialProduct(productId)) {
                const allowedFlaps = getAllowedFlaps(productId, sizePerimeter, size.width, size.height);
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
            selectedSizesWithQuantity={selectedSizesWithQuantity}
            onQuantityChange={handleQuantityChange}
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
              className="w-full border-gray-300 bg-red-50 hover:bg-red-100 hover:text-red-800 text-red-700 py-3"
            >
              {showCustomOrder ? t("cfg.closeCustomOrder") : t("cfg.customOrder")}
            </Button>
          </div>

          {/* <div>
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
          </div> */}

          {/* <div>
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
          </div> */}
        </div>

        {hasRightColumnContent && (
          <div className="lg:self-start">
            {showCustomOrder && (
              <div className="space-y-6">
                <CustomOrderForm
                  productId={productId}
                  customOrderData={customOrderData}
                  onDataChange={setCustomOrderData}
                  onClose={() => setShowCustomOrder(false)}
                  isCeilingInstallation={isCeilingInstallation}
                  onInstallationTypeChange={setIsCeilingInstallation}
                  onPriceCalculated={(price, hasOrder) => {
                    setCustomOrderPrice(price);
                    setHasCustomOrder(hasOrder);
                    // Check if perimeter exceeds max perimeter for special products
                    const width = Number(customOrderData.width);
                    const height = Number(customOrderData.height);
                    const perimeter = (width + height) * 2;
                    const maxPerimeter = getMaxPerimeterForProduct(productId);
                    setCustomOrderExceedsLimit(perimeter > maxPerimeter);
                  }}
                />
              </div>
            )}

            {/* Final Check - Combined Order Summary */}
            {(selectedSizesWithQuantity.length > 0 || (hasCustomOrder && customOrderData.quantity > 0)) && (
              <div className="relative z-10 bg-white border rounded-lg border-gray-300 p-4 mt-6">
                {/* Ready Sizes */}
                {selectedSizesWithQuantity.map((item) => {
                  const subtotal = item.size.priceUZS * item.quantity;
                  const displayText = t("cfg.checkoutItemFormat")
                    .replace("{width}", item.size.width.toString())
                    .replace("{height}", item.size.height.toString())
                    .replace("{quantity}", item.quantity.toString())
                    .replace("{type}", t("cfg.readySizeLabel"));
                  return (
                    <div key={item.size.id} className="flex justify-between py-2">
                      <span className="text-base text-black">{displayText}</span>
                      <span className="text-base font-bold text-black">{subtotal.toLocaleString("ru-RU")} UZS</span>
                    </div>
                  );
                })}

                {/* Custom Order */}
                {hasCustomOrder && customOrderData.quantity > 0 && (
                  <div>
                    <div className="flex justify-between py-2">
                      <span className="text-base text-black">{t("cfg.checkoutItemFormat")
                        .replace("{width}", customOrderData.width)
                        .replace("{height}", customOrderData.height)
                        .replace("{quantity}", String(customOrderData.quantity || 1))
                        .replace("{type}", t("cfg.customSizeLabel"))}</span>
                      {!customOrderExceedsLimit && (
                        <span className="text-base font-bold text-black">{(customOrderPrice * (customOrderData.quantity || 1)).toLocaleString("ru-RU")} UZS</span>
                      )}
                    </div>
                    {customOrderExceedsLimit && (
                      <div className="text-xs text-gray-600 italic mt-1 mb-2">
                        {selectedSizesWithQuantity.length > 0 ? t("cfg.customOrderMixedNote") : t("cfg.customOrderPriceNote")}
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t border-gray-300 my-3"></div>

                {/* Total */}
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-black">{t("cfg.totalLabel")}</span>
                  <span className="text-2xl font-bold text-black">
                    {(selectedSizesWithQuantity
                      .reduce((sum, item) => sum + item.size.priceUZS * item.quantity, 0) + 
                      (hasCustomOrder && !customOrderExceedsLimit ? customOrderPrice * (customOrderData.quantity || 1) : 0))
                      .toLocaleString("ru-RU")}{" "}
                    UZS
                  </span>
                </div>

                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-medium rounded-lg mt-4"
                  onClick={() => {
                    const totalPrice = selectedSizesWithQuantity
                      .reduce((sum, item) => sum + item.size.priceUZS * item.quantity, 0) + 
                      (hasCustomOrder && !customOrderExceedsLimit ? customOrderPrice * (customOrderData.quantity || 1) : 0);
                    
                    const orderData = {
                      readySizes: selectedSizesWithQuantity,
                      customOrder: hasCustomOrder ? {
                        width: Number(customOrderData.width),
                        height: Number(customOrderData.height),
                        flaps: customOrderData.flaps,
                        quantity: customOrderData.quantity || 1,
                        price: customOrderPrice,
                      } : null,
                      totalPrice: totalPrice,
                      productId: productId,
                      modelName: localizedProduct?.name || product?.name || "Unknown Product",
                    };
                    
                    localStorage.setItem("combinedOrder", JSON.stringify(orderData));
                    localStorage.removeItem("currentOrder");
                    localStorage.removeItem("customOrder");
                    router.push("/checkout");
                  }}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {t("cfg.checkoutBtn")}
                </Button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
