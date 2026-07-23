"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/language-provider";

export function NavigationProgress() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    function startLoading(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }
      const destination = new URL(anchor.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        (destination.pathname === window.location.pathname &&
          destination.search === window.location.search)
      ) {
        return;
      }

      setLoading(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setLoading(false), 15000);
    }

    document.addEventListener("click", startLoading, true);
    return () => {
      document.removeEventListener("click", startLoading, true);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      className={`navigation-progress ${loading ? "visible" : ""}`}
      role="progressbar"
      aria-label={t("页面加载中")}
      aria-hidden={!loading}
    />
  );
}
