"use client";

import { useState, useMemo, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

  // Get the specific product by ID
  const product = getProductById(productId);

  const getInitialSize = (product: any) => {
    if (product && product.sizes.length > 0) {
      return product.sizes[0].size;
    }
    return "20x20"; // fallback
  };

  const getInitialDimensions = (product: any) => {
    if (product && product.sizes.length > 0) {
      const firstSize = product.sizes[0].size;
      const [width, height] = firstSize.split("x").map(Number);
      return { width, height };
    }
    return { width: 20, height: 20 }; // fallback
  };

  const initialDimensions = product
    ? getInitialDimensions(product)
    : { width: 20, height: 20 };
  const [selectedSize, setSelectedSize] = useState(
    product ? getInitialSize(product) : "20x20"
  );
  const [customWidth, setCustomWidth] = useState(initialDimensions.width); // in cm
  const [customHeight, setCustomHeight] = useState(initialDimensions.height); // in cm
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

  const totalPrice = useMemo(() => {
    if (showCustomOrder) {
      return 0;
    }

    let priceUSD = product?.basePrice || 0;

    const widthForCalc = Number.isFinite(customWidth as unknown as number)
      ? (customWidth as unknown as number)
      : 0;
    const heightForCalc = Number.isFinite(customHeight as unknown as number)
      ? (customHeight as unknown as number)
      : 0;

    if (
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
      if (product) {
        const apiPrice = getPriceForSize(product, selectedSizeData.id);
        priceUSD = apiPrice || selectedSizeData.priceUSD;
      } else {
        priceUSD = selectedSizeData.priceUSD;
      }

      if (product?.category === "anodos" && isCeilingInstallation) {
        priceUSD = priceUSD + 3;
      }
    }

    const priceUZS = Math.round(priceUSD * 12500);
    return priceUZS * quantity;
  }, [
    showCustomOrder,
    product,
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
  ]);

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

  const perimeter = useMemo(() => {
    return (currentWidth + currentHeight) * 2;
  }, [currentWidth, currentHeight]);

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

    const orderData = {
      productId: productId,
      modelName: localizedProduct?.name || product?.name || "Unknown Product",
      width: width,
      height: height,
      quantity: quantity,
      totalPrice: 0,
      isCustomSize: true,
      isCustomOrder: true,
      flaps: customOrderData.flaps,
      perimeter: (width + height) * 2,
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
        <div className="sticky top-16 lg:top-24 self-start z-20 configurator-sticky">
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-black mb-2">
                  {localizedProduct?.name || "Loading..."}
                </h2>
              </div>

              <div className="relative z-20 bg-white rounded-lg p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                {(() => {
                  const width = currentWidth;
                  const height = currentHeight;

                  const isSquare = width === height;
                  const isHorizontal = width > height;
                  const isVertical = height > width;

                  const baseSize = 200;
                  let displayWidth, displayHeight;

                  if (isSquare) {
                    displayWidth = displayHeight = baseSize;
                  } else if (isHorizontal) {
                    const ratio = height / width;
                    displayWidth = baseSize;
                    displayHeight = baseSize * ratio;
                  } else {
                    const ratio = width / height;
                    displayWidth = baseSize * ratio;
                    displayHeight = baseSize;
                  }

                  return (
                    <div className="relative">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                        {width} {t("cfg.units.cmShort")}
                      </div>
                      <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs font-medium text-gray-600">
                        {height} {t("cfg.units.cmShort")}
                      </div>

                      <div
                        className="relative border-2 border-black rounded-lg"
                        style={{
                          width: `${displayWidth}px`,
                          height: `${displayHeight}px`,
                          minWidth: "120px",
                          minHeight: "120px",
                          maxWidth: "280px",
                          maxHeight: "280px",
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-px bg-gray-300"></div>
                          <div className="absolute w-px h-full bg-gray-300"></div>
                        </div>

                        {currentFlaps === 1 && (
                          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                        )}

                        {currentFlaps === 2 && (
                          <>
                            <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                            <div className="absolute top-1/2 right-1/2 transform -translate-y-1/2 -translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-400"></div>
                          </>
                        )}

                        {currentFlaps === 3 && (
                          <>
                            <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 -translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                            <div className="absolute top-1/2 right-1/3 transform -translate-y-1/2 translate-x-1 w-3 h-3 bg-black rounded-full"></div>
                            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-gray-400"></div>
                            <div className="absolute top-0 bottom-0 right-1/3 w-px bg-gray-400"></div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("cfg.size")}:</span>
                  <span className="font-medium">
                    {currentWidth} {t("cfg.units.cm")} х {currentHeight}{" "}
                    {t("cfg.units.cm")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("cfg.perimeter")}:</span>
                  <span className="font-medium">
                    {perimeter} {t("cfg.units.cm")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("cfg.flaps")}:</span>
                  <span className="font-medium">
                    {currentFlaps === 3
                      ? t("cfg.doorTypes.tripleEven")
                      : currentFlaps === 2
                      ? t("cfg.doorTypes.doubleCenter")
                      : t("cfg.doorTypes.singleRight")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 bg-white rounded-xl border border-gray-100 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          {product?.category === "anodos" && (
            <div>
              <h3 className="text-lg font-bold text-black mb-4">
                {t("cfg.installationType")}
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsCeilingInstallation(false)}
                  className={`p-3 border-2 rounded-lg text-center transition-colors flex-1 ${
                    !isCeilingInstallation
                      ? "bg-white border-gray-600"
                      : "bg-white border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-black">
                    {t("cfg.wallMount")}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t("cfg.basePrice")}
                  </div>
                </button>
                <button
                  onClick={() => setIsCeilingInstallation(true)}
                  className={`p-3 border-2 rounded-lg text-center transition-colors flex-1 ${
                    isCeilingInstallation
                      ? "bg-white border-gray-600"
                      : "bg-white border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-black">
                    {t("cfg.ceilingMount")}
                  </div>
                  <div className="text-sm text-gray-600">(+3 $)</div>
                </button>
              </div>
            </div>
          )}

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-black">
                {showCustomOrder
                  ? t("cfg.customOrderTitle")
                  : t("cfg.readySizes")}
              </h3>
              {!showCustomOrder && (
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setCurrency("USD")}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      currency === "USD"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    $
                  </button>
                  <button
                    onClick={() => setCurrency("UZS")}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      currency === "UZS"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    UZS
                  </button>
                </div>
              )}
            </div>

            {!showCustomOrder ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {currentSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => {
                        setSelectedSize(size.id);
                        setUseCustomSize(false);
                        setUsePerimeterPricing(false);
                        setCustomWidth(size.width);
                        setCustomHeight(size.height);
                        const sizePerimeter = (size.width + size.height) * 2;
                        if (sizePerimeter > 200) {
                          setIsDoubleDoor(true);
                        } else {
                          setIsDoubleDoor(false);
                        }
                      }}
                      className={`p-3 border-2 rounded-lg text-center transition-colors ${
                        selectedSize === size.id &&
                        !useCustomSize &&
                        !usePerimeterPricing
                          ? "bg-white border-gray-600"
                          : "bg-white border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-medium text-black">{size.label}</div>
                      <div className="text-sm text-gray-600">
                        (
                        {currency === "USD"
                          ? `${size.priceUSD || 0} $`
                          : `${new Intl.NumberFormat("ru-RU").format(
                              size.priceUZS || 0
                            )} UZS`}
                        )
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                        min="20"
                        max="200"
                        value={customOrderData.width}
                        onChange={(e) =>
                          setCustomOrderData((prev) => ({
                            ...prev,
                            width: e.target.value,
                          }))
                        }
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
                        min="20"
                        max="200"
                        value={customOrderData.height}
                        onChange={(e) =>
                          setCustomOrderData((prev) => ({
                            ...prev,
                            height: e.target.value,
                          }))
                        }
                        className="pr-8 border-gray-300"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        {t("cfg.units.cm")}
                      </div>
                    </div>
                  </div>
                </div>

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
                        onChange={(e) =>
                          setCustomOrderData((prev) => ({
                            ...prev,
                            flaps: Number(e.target.value),
                          }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`p-3 border-2 rounded-lg text-center transition-all duration-200 h-20 flex flex-col justify-center space-y-1 ${
                          customOrderData.flaps === 1
                            ? "bg-white border-gray-600 shadow-sm"
                            : "bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm"
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
                        onChange={(e) =>
                          setCustomOrderData((prev) => ({
                            ...prev,
                            flaps: Number(e.target.value),
                          }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`p-3 border-2 rounded-lg text-center transition-all duration-200 h-20 flex flex-col justify-center space-y-1 ${
                          customOrderData.flaps === 2
                            ? "bg-white border-gray-600 shadow-sm"
                            : "bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm"
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
                        onChange={(e) =>
                          setCustomOrderData((prev) => ({
                            ...prev,
                            flaps: Number(e.target.value),
                          }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`p-3 border-2 rounded-lg text-center transition-all duration-200 h-20 flex flex-col justify-center space-y-1 ${
                          customOrderData.flaps === 3
                            ? "bg-white border-gray-600 shadow-sm"
                            : "bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm"
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

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>{t("cfg.size")}:</span>
                      <span className="font-medium">
                        {customOrderData.width} × {customOrderData.height}{" "}
                        {t("cfg.units.cm")}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>{t("cfg.perimeter")}:</span>
                      <span className="font-medium">
                        {(() => {
                          const width = Number(customOrderData.width);
                          const height = Number(customOrderData.height);
                          return Number.isFinite(width) &&
                            Number.isFinite(height)
                            ? (width + height) * 2
                            : 0;
                        })()}{" "}
                        {t("cfg.units.cm")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

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
              onClick={() => setShowCustomOrder(!showCustomOrder)}
              className="w-full border-gray-300 hover:bg-gray-50 text-gray-700 py-3"
            >
              {showCustomOrder ? t("cfg.readySizes") : t("cfg.customOrder")}
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
            {showCustomOrder ? (
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
                      <p className="text-xs text-gray-700">
                        {t("cfg.priceCalculationNote")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : useCustomSize ? (
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
            ) : (
              <div className="text-3xl font-bold text-black mb-6">
                {currency === "USD"
                  ? `${new Intl.NumberFormat("ru-RU").format(
                      Math.round(totalPrice / 12500)
                    )} $`
                  : `${new Intl.NumberFormat("ru-RU").format(totalPrice)} UZS`}
              </div>
            )}

            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-medium rounded-lg"
              onClick={
                showCustomOrder ? handleCustomOrderSubmit : handleAddToCart
              }
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {showCustomOrder ? t("cfg.submitOrder") : t("cfg.checkout")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
