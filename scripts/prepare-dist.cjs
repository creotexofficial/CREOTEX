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
  } else {
    console.error(`[Render Build Error] Source directory not found: ${src}`);
    process.exit(1);
  }
} catch (err) {
  console.error('[Render Build Error] Failed to prepare dist directory:', err);
  process.exit(1);
}
