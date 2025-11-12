import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CANDIDATES = ['personajes', 'personajes teatro'];
const IMG_RE = /(\.(png|jpe?g|webp|avif))$/i;

const titleCase = s => (s||'').replace(/[\-_]+/g,' ').replace(/\s+/g,' ').trim().replace(/\b\w/g,m=>m.toUpperCase());
const baseFrom  = fn => { const name=path.basename(fn).replace(/\.[^.]+$/,''); return titleCase(name.split(/[-_\s]?\d+/)[0]); };
const list = async d => { try { return (await fs.readdir(d)).filter(f=>IMG_RE.test(f)); } catch { return []; } };

async function main(){
  let BASE = null;
  for (const c of CANDIDATES) {
    try {
      const stat = await fs.stat(path.join(ROOT, c));
      if (stat && stat.isDirectory()) { BASE = c; break; }
    } catch {}
  }
  if (!BASE) {
    console.error('No se encontró carpeta de personajes. Crea "personajes" o "personajes teatro".');
    process.exit(1);
  }

  const DIR_P = path.join(ROOT, BASE);
  const DIR_B = path.join(DIR_P, 'Backstage'); // Backstage dentro de la base
  const DIR_B2 = path.join(DIR_P, 'backstage teatro'); // alternativa con espacio/minúsculas
  const DIR_B_ALT = path.join(ROOT, 'Backstage'); // Backstage en raíz del proyecto
  const OUT   = path.join(DIR_P, 'elenco.manifest.json');

  // Recorrer personajes de forma recursiva, excluyendo carpetas de backstage
  async function walk(dir, rel=''){
    let out=[];
    let list;
    try { list = await fs.readdir(dir, { withFileTypes:true }); } catch { return out; }
    for(const e of list){
      const name = e.name;
      const lower = name.toLowerCase();
      if(e.isDirectory()){
        if(lower === 'backstage' || lower === 'backstage teatro') continue;
        const subRel = path.join(rel, name);
        out = out.concat(await walk(path.join(dir, name), subRel));
      } else if(e.isFile() && IMG_RE.test(name)){
        const relPath = path.join(rel, name).replace(/\\/g,'/');
        out.push(relPath);
      }
    }
    return out;
  }
  const files = await walk(DIR_P);
  const backs1 = await list(DIR_B);
  const backs2 = await list(DIR_B2);
  const backs3 = await list(DIR_B_ALT);
  const backs = Array.from(new Set([...(backs1||[]), ...(backs2||[]), ...(backs3||[])])).sort();

  // agrupar por base (Abuela, Aurora, Director, etc.)
  const map = new Map();
  for (const f of files) { const b=baseFrom(f); if(!map.has(b)) map.set(b,[]); map.get(b).push(f); }

  const personajes = [...map.entries()].map(([nombre, fotos])=>({ nombre, fotos:fotos.sort().slice(0,3) }))
    .sort((a,b)=>a.nombre.localeCompare(b.nombre));
  const backstages = backs.sort().map(f=>({ titulo: baseFrom(f), foto: f }));

  await fs.mkdir(path.dirname(OUT), { recursive:true });
  await fs.writeFile(OUT, JSON.stringify({ personajes, backstages }, null, 2), 'utf8');
  console.log('Manifest escrito en', OUT, '(base:', BASE, ')');
}

main().catch(err=>{ console.error(err); process.exit(1); });
