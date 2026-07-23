"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function LanguageSwitcher({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { locale, setLocale, t } = useLanguage();
  const nextLocale = locale === "zh" ? "en" : "zh";
  const label = locale === "zh" ? "EN" : "中文";

  return (
    <button
      className={`language-switcher ${compact ? "compact" : ""}`}
      type="button"
      onClick={() => setLocale(nextLocale)}
      aria-label={t(locale === "zh" ? "切换到英文" : "切换到中文")}
      title={t(locale === "zh" ? "切换到英文" : "切换到中文")}
    >
      <Languages size={15} />
      <span>{label}</span>
    </button>
  );
}
