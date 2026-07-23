import type { Metadata } from "next";
import { LanguageProvider } from "@/components/language-provider";
import { NavigationProgress } from "@/components/navigation-progress";
import { getLocale } from "@/lib/i18n-server";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: {
      default:
        locale === "en"
          ? "Beyond Wild | Turn experience into capability"
          : "Beyond Wild｜把经验变成能力",
      template: "%s｜Beyond Wild",
    },
    description:
      locale === "en"
        ? "High-quality online courses for creators and professionals in branding, communication, and growth."
        : "面向创作者与专业人士的高质量在线课程，系统学习品牌、表达与增长。",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale === "en" ? "en" : "zh-CN"} suppressHydrationWarning>
      <body>
        <LanguageProvider initialLocale={locale}>
          <NavigationProgress />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
