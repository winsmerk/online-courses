import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "知序课堂｜把经验变成能力",
    template: "%s｜知序课堂",
  },
  description:
    "面向创作者与专业人士的高质量在线课程，系统学习品牌、表达与增长。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
