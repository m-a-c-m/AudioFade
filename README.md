# 📈 Audio Fade — Fundidos de entrada y salida para audio

**Free Audio Fade In/Out.** Add independent fade-in and fade-out to any audio file, with duration up to the full track length and no artificial cap, powered by FFmpeg.wasm. No sign-up, no ads, 100% client-side.

🌐 **Demo en vivo / Live demo:** [miguelacm.es/tools/audio-fade](https://miguelacm.es/tools/audio-fade)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## ✨ Features

- **Fade in/out independientes / Independent fade in/out:** set each duration separately
- **Sin tope / No cap:** fade can span the entire track if needed
- **6 formatos / 6 formats:** MP3, WAV, OGG, FLAC, M4A, AAC
- **FFmpeg.wasm:** real audio fade processing running client-side
- **Sin servidor / Zero server:** Everything runs in the browser — nothing is ever uploaded
- **Embebible / Embeddable:** Use it as an iframe on any website
- **Open source:** MIT license, use it freely

---

## 🚀 Quick start

```bash
git clone https://github.com/m-a-c-m/AudioFade.git
cd AudioFade
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables (optional)

```env
NEXT_PUBLIC_SITE_URL=https://miguelacm.es/tools/audio-fade
NEXT_PUBLIC_EMBED_URL=https://miguelacm.es/embed/audio-fade
```

---

## 📦 Embed on your website

### Iframe (plug & play)

```html
<iframe
  src="https://miguelacm.es/embed/audio-fade"
  width="100%"
  height="700"
  style="border:none;border-radius:12px;"
  title="Añadir Fade In y Fade Out a Audio Online Gratis — miguelacm.es"
  loading="lazy"
></iframe>
```

### Link with attribution (recommended for backlink)

```html
<a href="https://miguelacm.es/tools/audio-fade" target="_blank" rel="noopener">
  Fade in/out de audio gratis por MACM
</a>
```

> 💡 The link option generates a real backlink that benefits the project. Recommended if your platform supports custom HTML.

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16 | React framework + SSG |
| [TypeScript](https://www.typescriptlang.org) | 5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Styling |
| [react-icons](https://react-icons.github.io/react-icons/) | 5 | Icons |
| [FFmpeg.wasm](https://ffmpegwasm.netlify.app/) | 0.12 | Audio processing (WASM, in-browser) |

---

## 📄 License

MIT © [Miguel Ángel Colorado Marin (MACM)](https://miguelacm.es)

Built with ❤️ by **[MACM](https://miguelacm.es)** — Full Stack Developer & Cybersecurity Specialist from Guadalajara, Spain.

- 🌐 Portfolio: [miguelacm.es](https://miguelacm.es)
- 💼 LinkedIn: [linkedin.com/in/macm](https://www.linkedin.com/in/macm/)
- 🐙 GitHub: [github.com/m-a-c-m](https://github.com/m-a-c-m)
