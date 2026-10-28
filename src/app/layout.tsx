import type { Metadata, Viewport } from "next";
import { Anek_Latin, Roboto, Sora } from "next/font/google";
import "./globals.css";

const anek = Anek_Latin({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--f-anek", display: "swap" });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--f-roboto", display: "swap" });
const sora = Sora({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--f-sora", display: "swap" });

export const metadata: Metadata = {
  title: "AUVP — Diagnóstico patrimonial",
  description: "Responda algumas perguntas e receba o seu plano.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF8F1" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

// aplica o tema salvo antes da pintura, para não piscar
const temaScript = `try{var t=localStorage.getItem('auvp-diag-tema');if(t==='claro'||t==='escuro')document.documentElement.dataset.tema=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${anek.variable} ${roboto.variable} ${sora.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
