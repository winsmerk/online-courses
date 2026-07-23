"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Languages } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function LanguageSwitcher({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function chooseLocale(nextLocale: "zh" | "en") {
    setOpen(false);
    if (nextLocale !== locale) setLocale(nextLocale);
  }

  return (
    <div
      className={`language-menu ${compact ? "compact" : ""}`}
      ref={containerRef}
    >
      <button
        className="language-switcher"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={t("选择语言")}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        title={t("选择语言")}
      >
        <Languages size={17} />
      </button>
      {open && (
        <div
          className="language-dropdown"
          id={menuId}
          role="menu"
          aria-label={t("选择语言")}
        >
          <button
            type="button"
            role="menuitemradio"
            aria-checked={locale === "zh"}
            className={locale === "zh" ? "selected" : ""}
            onClick={() => chooseLocale("zh")}
          >
            <span>中文</span>
            {locale === "zh" && <Check size={15} />}
          </button>
          <button
            type="button"
            role="menuitemradio"
            aria-checked={locale === "en"}
            className={locale === "en" ? "selected" : ""}
            onClick={() => chooseLocale("en")}
          >
            <span>English</span>
            {locale === "en" && <Check size={15} />}
          </button>
        </div>
      )}
    </div>
  );
}
