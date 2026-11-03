import { mkdir, writeFile } from 'node:fs/promises';
import { variants } from './tokens.js';
import { createTheme } from './theme.js';
awaitGenerate().catch(error => { console.error(error); process.exitCode = 1; });
async function awaitGenerate() {
  await mkdir('themes', { recursive: true });
  for (const variant of variants) {
    const path = `themes/${variant.file}-color-theme.json`;
    await writeFile(path, JSON.stringify(createTheme(variant), null, 2) + '\n');
    console.log(`Generated ${path}`);
  }
}
