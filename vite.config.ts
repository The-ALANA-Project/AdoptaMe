import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    {
      name: 'inject-og-meta',
      transformIndexHtml(html) {
        const ogTags = `
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://adoptame.pe" />
    <meta property="og:title" content="AdoptaMe — Adopta un animal en Peru" />
    <meta property="og:description" content="Encuentra a tu companero ideal. AdoptaMe es una plataforma comunitaria de adopcion animal en Peru donde puedes adoptar perros, gatos y mas." />
    <meta property="og:image" content="https://teal-united-parrot-418.mypinata.cloud/ipfs/bafybeihscx6ivorazotnxpzv3gaz2p3a3fdnbs2x6lss6vpp5kmfa3tdai/AdoptaMe%20Social%20Crawler.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="AdoptaMe" />
    <meta property="og:locale" content="es_PE" />
    <meta name="author" content="AdoptaMe" />
    <meta property="article:published_time" content="2025-06-01T00:00:00Z" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="AdoptaMe — Adopta un animal en Peru" />
    <meta name="twitter:description" content="Encuentra a tu companero ideal. AdoptaMe es una plataforma comunitaria de adopcion animal en Peru donde puedes adoptar perros, gatos y mas." />
    <meta name="twitter:image" content="https://teal-united-parrot-418.mypinata.cloud/ipfs/bafybeihscx6ivorazotnxpzv3gaz2p3a3fdnbs2x6lss6vpp5kmfa3tdai/AdoptaMe%20Social%20Crawler.png" />
    <link rel="icon" type="image/png" href="https://teal-united-parrot-418.mypinata.cloud/ipfs/bafybeihscx6ivorazotnxpzv3gaz2p3a3fdnbs2x6lss6vpp5kmfa3tdai/AdoptaMe%20Favicon.png" />`;
        return html.replace('</head>', `${ogTags}\n  </head>`);
      },
    },
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})