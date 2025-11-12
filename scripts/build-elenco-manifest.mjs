import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIR_P = path.join(ROOT, 'personajes');
const DIR_B = path.join(DIR_P, 'Backstage'); // ojo: B mayúscula
const OUT   = path.join(DIR_P, 'elenco.manifest.json');
const IMG_RE = /(\.(png|jpe?g|webp|avif))$/i;

const titleCase = s => (s||'').replace(/[\-_]+/g,' ').replace(/\s+/g,' ').trim().replace(/\b\w/g,m=>m.toUpperCase());
const baseFrom  = fn => { const name=path.basename(fn).replace(/\.[^.]+$/,''); return titleCase(name.split(/[-_\s]?\d+/)[0]); };
const list = async d => { try { return (await fs.readdir(d)).filter(f=>IMG_RE.test(f)); } catch { return []; } };

// personajes: todo menos la carpeta Backstage
const entries = await fs.readdir(DIR_P, { withFileTypes: true });
const files = entries.filter(e => e.isFile() && IMG_RE.test(e.name)).map(e => e.name);
const backs = await list(DIR_B);

// agrupar por base (Abuela, Aurora, Director, Elvira, Estela, Laura, etc.)
const map = new Map();
for (const f of files) { const b=baseFrom(f); if(!map.has(b)) map.set(b,[]); map.get(b).push(f); }

const personajes = [...map.entries()].map(([nombre, fotos])=>({ nombre, fotos:fotos.sort() }))
  .sort((a,b)=>a.nombre.localeCompare(b.nombre));
const backstages = backs.sort().map(f=>({ titulo: baseFrom(f), foto: f }));

await fs.mkdir(path.dirname(OUT), { recursive:true });
await fs.writeFile(OUT, JSON.stringify({ personajes, backstages }, null, 2), 'utf8');
console.log('Manifest escrito en', OUT);
