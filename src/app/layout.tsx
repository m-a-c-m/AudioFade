import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://miguelacm.es/tools/audio-fade";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Añadir Fade In y Fade Out a Audio Online Gratis",
    template: "%s | Audio Fade",
  },
  description:
    "Añade fundidos de entrada (fade in) y salida (fade out) a cualquier archivo de audio, con duración libre hasta la duración completa del audio. Todo directamente en tu navegador, sin subir el archivo.",
  keywords: [
    "fade in fade out audio online",
    "añadir fundido audio gratis",
    "fade audio online free",
    "fundido de entrada salida mp3",
    "audio fade tool online",
  ],
  authors: [{ name: "Miguel Ángel Colorado Marin", url: "https://miguelacm.es" }],
  creator: "Miguel Ángel Colorado Marin",
  openGraph: {
    title: "Añadir Fade In y Fade Out a Audio Online Gratis",
    description:
      "Añade fade in y fade out a tu audio con duración totalmente libre, en el navegador. Por MACM.",
    url: SITE_URL,
    siteName: "Audio Fade — MACM",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Añadir Fade In y Fade Out a Audio Online Gratis",
    description: "Fade in y fade out de audio online, sin límite de duración. Por MACM · miguelacm.es",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="author" href="https://miguelacm.es" />
        <meta name="author" content="Miguel Ángel Colorado Marin" />
        <meta name="copyright" content="Miguel Ángel Colorado Marin — miguelacm.es" />
      </head>
      <body className="antialiased">
        {children}
        <footer className="pb-8 text-center text-xs text-text-muted/40">
          ⚡ por{" "}
          <a
            href="https://miguelacm.es"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted/60 transition-colors hover:text-text-muted underline-offset-2 hover:underline"
          >
            MACM · miguelacm.es
          </a>
          {" · "}
          <a
            href="https://github.com/m-a-c-m/AudioFade"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted/60 transition-colors hover:text-text-muted underline-offset-2 hover:underline"
          >
            Código abierto
          </a>
        </footer>
      </body>
    </html>
  );
}
