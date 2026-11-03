const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'frontend', 'dist');
const dest = path.join(__dirname, '..', 'dist');

try {
  if (fs.existsSync(src)) {
    // Ensure clean destination
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true, force: true });
    }
    fs.cpSync(src, dest, { recursive: true, force: true });
    console.log(`[Render Build] Successfully synced compiled assets from ${src} to ${dest}`);

    const indexHtmlPath = path.join(dest, 'index.html');
    if (fs.existsSync(indexHtmlPath)) {
      const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');

      // 1. Create 404.html fallback for static hosts (Render, GitHub Pages, surge)
      fs.writeFileSync(path.join(dest, '404.html'), indexHtmlContent, 'utf-8');
      console.log('[SPA Routing] Generated dist/404.html SPA fallback');

      // 2. Generate direct folder fallbacks for deep links like /super, /admin, etc.
      // This guarantees HTTP 200 even without custom server rewrite rules!
      const directRoutes = ['super', 'admin', 'filaments', 'custom-3d-print'];
      directRoutes.forEach(route => {
        const routeDir = path.join(dest, route);
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true });
        }
        fs.writeFileSync(path.join(routeDir, 'index.html'), indexHtmlContent, 'utf-8');
        console.log(`[SPA Routing] Generated direct route fallback: dist/${route}/index.html`);
      });
    }

    // 3. Ensure _redirects exists for Render, Netlify, and Cloudflare Pages
    const redirectsFile = path.join(dest, '_redirects');
    if (!fs.existsSync(redirectsFile)) {
      fs.writeFileSync(redirectsFile, '/*    /index.html   200\n', 'utf-8');
      console.log('[SPA Routing] Generated dist/_redirects rewrite file');
    }

    // 4. Ensure static.json exists
    const staticJsonFile = path.join(dest, 'static.json');
    if (!fs.existsSync(staticJsonFile)) {
      fs.writeFileSync(staticJsonFile, JSON.stringify({
        root: '.',
        clean_urls: false,
        routes: {
          '/**': 'index.html'
        }
      }, null, 2), 'utf-8');
      console.log('[SPA Routing] Generated dist/static.json SPA routing file');
    }

    console.log('[Render Build] All SPA routing fallbacks successfully generated in dist directory.');
  } else {
    console.error(`[Render Build Error] Source directory not found: ${src}`);
    process.exit(1);
  }
} catch (err) {
  console.error('[Render Build Error] Failed to prepare dist directory:', err);
  process.exit(1);
}
