import type { Metadata, Viewport } from "next";
import { Nunito, Plus_Jakarta_Sans } from "next/font/google";
import { Shell } from "@/components/Shell";
import { THEME_SCRIPT } from "@/lib/theme-script";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Soltura · Diccionario de inglés por temas",
  description:
    "Aprende inglés gratis por temas: partes del cuerpo, animales, comida y más. Con singular y plural, preguntas de ejemplo, audio y frases para armar.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ececf1" },
    { media: "(prefers-color-scheme: dark)", color: "#121119" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-theme="light"
      suppressHydrationWarning
      className={`${jakarta.variable} ${nunito.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full font-sans">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
