import AudioFade from "@/components/AudioFade";
import { MdTrendingUp } from "react-icons/md";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://miguelacm.es/tools/audio-fade";
const EMBED_URL = process.env.NEXT_PUBLIC_EMBED_URL || "https://miguelacm.es/embed/audio-fade";

export const metadata = {
  title: "Añadir Fade In y Fade Out a Audio Online Gratis",
  description:
    "Añade fundidos de entrada (fade in) y salida (fade out) a cualquier archivo de audio, con duración libre hasta la duración completa del audio. Todo directamente en tu navegador, sin subir el archivo.",
  alternates: { canonical: SITE_URL },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Añadir Fade In y Fade Out a Audio Online Gratis",
  url: SITE_URL,
  description:
    "Añade fundidos de entrada (fade in) y salida (fade out) a cualquier archivo de audio, con duración libre hasta la duración completa del audio. Todo directamente en tu navegador, sin subir el archivo.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  inLanguage: "es-ES",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  author: {
    "@type": "Person",
    name: "Miguel Ángel Colorado Marin",
    url: "https://miguelacm.es",
  },
  featureList: [
    "Fade in configurable de forma independiente",
    "Fade out configurable de forma independiente",
    "Duración sin tope artificial (hasta el audio completo)",
    "Soporta MP3, WAV, OGG, FLAC, M4A, AAC",
    "Procesamiento con FFmpeg.wasm en el navegador",
    "Sin registro",
    "Código abierto",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <MdTrendingUp className="text-base" />
              Herramienta gratuita · Código abierto
            </div>
            <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
              Fade In / Fade Out de Audio
            </h1>
            <p className="mb-2 text-lg text-text-muted">
              Añade fundidos de entrada y salida a tu audio, con la duración exacta que necesites.
            </p>
            <p className="text-sm text-text-muted/60">
              Hecho por{" "}
              <a
                href="https://miguelacm.es"
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-text font-medium hover:opacity-80 transition-opacity"
              >
                MACM
              </a>{" "}
              · Sin registro · Sin anuncios · 100% en el navegador
            </p>
          </div>

          <div className="glass rounded-2xl border border-border/20 p-6 md:p-8">
            <AudioFade />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: "📈",
                title: "Fade in y fade out independientes",
                desc: "Configura por separado la duración del fundido de entrada y del de salida.",
              },
              {
                icon: "♾️",
                title: "Duración sin límite artificial",
                desc: "El fundido puede llegar hasta la duración completa del audio, no hay un tope de segundos impuesto por la herramienta.",
              },
              {
                icon: "🔒",
                title: "100% privado",
                desc: "El procesamiento con FFmpeg.wasm ocurre en tu navegador, sin subir el archivo a ningún servidor.",
              },
            ].map((item) => (
              <div
                key={item.icon}
                className="glass rounded-xl border border-border/15 p-5"
              >
                <span className="mb-3 block text-2xl">{item.icon}</span>
                <h3 className="mb-1 font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-border/20 bg-white/3 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Cómo añadir fade in y fade out a un audio
            </h2>
            <ol className="space-y-3">
              {[
                { n: 1, text: "Sube tu archivo de audio." },
                { n: 2, text: "Ajusta la duración del fade in (entrada)." },
                { n: 3, text: "Ajusta la duración del fade out (salida)." },
                { n: 4, text: "Aplica los fundidos y descarga el resultado." },
              ].map((step) => (
                <li key={step.n} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    {step.n}
                  </span>
                  <p className="text-sm text-text-muted leading-relaxed">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold text-white">Preguntas frecuentes</h2>
            {[
              {
                q: "¿Qué es un fade in y un fade out?",
                a: "Un fade in sube gradualmente el volumen desde el silencio al inicio del audio, y un fade out lo baja gradualmente hasta el silencio al final. Se usan para evitar cortes bruscos al empezar o terminar una pista.",
              },
              {
                q: "¿Puedo aplicar solo uno de los dos fundidos?",
                a: "Sí, puedes dejar la duración de uno de ellos en 0 para aplicar únicamente el otro.",
              },
              {
                q: "¿Hay un máximo de duración para el fundido?",
                a: "No, puede llegar hasta la duración completa del audio si lo necesitas, sin ningún tope artificial.",
              },
              {
                q: "¿Se sube el audio a un servidor?",
                a: "No, todo ocurre en tu navegador con FFmpeg.wasm.",
              },
              {
                q: "¿Qué formatos de audio soporta?",
                a: "MP3, WAV, OGG, FLAC, M4A y AAC.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-border/20 bg-white/3 p-5"
              >
                <h3 className="mb-2 font-medium text-white">{item.q}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-border/20 bg-white/3 p-6">
            <h2 className="mb-2 font-semibold text-white">
              Integra el fundido de audio en tu web
            </h2>
            <p className="mb-4 text-sm text-text-muted">
              Puedes embeber esta herramienta en cualquier web con un simple iframe.
            </p>
            <div className="mb-3 rounded-lg bg-black/40 p-3">
              <p className="mb-1 text-xs text-text-muted/60">Iframe (integración directa):</p>
              <code className="text-xs text-green-400 break-all">
                {`<iframe src="${EMBED_URL}" width="100%" height="700" style="border:none;border-radius:12px;" title="Añadir Fade In y Fade Out a Audio Online Gratis — miguelacm.es" loading="lazy"></iframe>`}
              </code>
            </div>
            <div className="rounded-lg bg-black/40 p-3">
              <p className="mb-1 text-xs text-text-muted/60">
                Enlace con atribución (recomendado para backlink):
              </p>
              <code className="text-xs text-green-400 break-all">
                {`<a href="${SITE_URL}" target="_blank" rel="noopener">Fade in/out de audio gratis por MACM</a>`}
              </code>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
