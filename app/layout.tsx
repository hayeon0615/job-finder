import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "커리어픽 | 대학생을 위한 첫 커리어 추천", description: "전공과 관심사에 맞는 대학생 맞춤 채용공고를 찾아보세요.", icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body>{children}</body></html>; }
