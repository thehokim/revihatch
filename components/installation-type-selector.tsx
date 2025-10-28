"use client";

import { useI18n } from "@/components/i18n-provider";

interface InstallationTypeSelectorProps {
  isCeilingInstallation: boolean;
  onInstallationTypeChange: (isCeiling: boolean) => void;
}

export function InstallationTypeSelector({
  isCeilingInstallation,
  onInstallationTypeChange
}: InstallationTypeSelectorProps) {
  const { t } = useI18n() as any;

  return (
    <div>
      <h3 className="text-lg font-bold text-black mb-4">
        {t("cfg.installationType")}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <label className="relative cursor-pointer group">
          <input
            type="radio"
            name="installation-type"
            checked={!isCeilingInstallation}
            onChange={() => onInstallationTypeChange(false)}
            className="sr-only"
          />
          <div
            className={`p-3 border-2 rounded-lg text-center transition-all duration-200 h-12 flex flex-col justify-center space-y-1 ${
              !isCeilingInstallation
                ? "bg-white border-gray-600 shadow-sm"
                : "bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm"
            }`}
          >
            <div className="text-sm font-medium text-gray-900">
              {t("cfg.wallInstallation")}
            </div>
          </div>
        </label>

        <label className="relative cursor-pointer group">
          <input
            type="radio"
            name="installation-type"
            checked={isCeilingInstallation}
            onChange={() => onInstallationTypeChange(true)}
            className="sr-only"
          />
          <div
            className={`p-3 border-2 rounded-lg text-center transition-all duration-200 h-12 flex flex-col justify-center space-y-1 ${
              isCeilingInstallation
                ? "bg-white border-gray-600 shadow-sm"
                : "bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm"
            }`}
          >
            <div className="text-sm font-medium text-gray-900">
              {t("cfg.ceilingInstallation")}
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}
