"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import { getAllowedFlaps, isSpecialProduct } from "./special-pricing";
import { InstallationTypeSelector } from "./installation-type-selector";

interface CustomOrderData {
  width: string;
  height: string;
  flaps: number;
}

interface CustomOrderFormProps {
  productId: string;
  customOrderData: CustomOrderData;
  onDataChange: (data: CustomOrderData) => void;
  onClose: () => void;
  isCeilingInstallation?: boolean;
  onInstallationTypeChange?: (isCeiling: boolean) => void;
}

export function CustomOrderForm({
  productId,
  customOrderData,
  onDataChange,
  onClose,
  isCeilingInstallation,
  onInstallationTypeChange
}: CustomOrderFormProps) {
  const { t } = useI18n() as any;

  // Auto-adjust flaps when dimensions change for special product
  useEffect(() => {
    if (isSpecialProduct(productId)) {
      const width = Number(customOrderData.width);
      const height = Number(customOrderData.height);
      const perimeter = Number.isFinite(width) && Number.isFinite(height) ? (width + height) * 2 : 0;
      const allowedFlaps = getAllowedFlaps(productId, perimeter);
      
      if (allowedFlaps.length > 0 && !allowedFlaps.includes(customOrderData.flaps)) {
        onDataChange({
          ...customOrderData,
          flaps: allowedFlaps[0] // Set to first allowed option
        });
      }
    }
  }, [customOrderData.width, customOrderData.height, productId, customOrderData.flaps, onDataChange]);

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

  const width = Number(customOrderData.width);
  const height = Number(customOrderData.height);
  const perimeter = Number.isFinite(width) && Number.isFinite(height) ? (width + height) * 2 : 0;
  const allowedFlaps = getAllowedFlaps(productId, perimeter);

  return (
    <div className="sticky top-16 lg:top-24 self-start z-10">
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
                    min="20"
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
            </div>

            {productId === "68f8b52c7a3c09f23e7a080b" && isCeilingInstallation !== undefined && onInstallationTypeChange ? (
              <InstallationTypeSelector
                isCeilingInstallation={isCeilingInstallation}
                onInstallationTypeChange={onInstallationTypeChange}
              />
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
                    {perimeter}{" "}
                    {t("cfg.units.cm")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
