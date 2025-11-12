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

  // Recorrer de forma recursiva y devolver todos los archivos de imagen
  async function walk(dir, rel=''){
    let out=[];
    let list;
    try { list = await fs.readdir(dir, { withFileTypes:true }); } catch { return out; }
    for(const e of list){
      const name = e.name;
      if(e.isDirectory()){
        const subRel = path.join(rel, name);
        out = out.concat(await walk(path.join(dir, name), subRel));
      } else if(e.isFile() && IMG_RE.test(name)){
        const relPath = path.join(rel, name).replace(/\\/g,'/');
        out.push(relPath);
      }
    }
    return out;
  }
  const allFiles = await walk(DIR_P);

  // Detectar listas específicas
  const inDir = (p, d) => p.split('/')[0].toLowerCase() === d.toLowerCase();
  const baseName = p => p.split('/').pop();

  // Regla especial: si existen archivos en 'backstage teatro', separar por prefijo de nombre
  const btFiles = allFiles.filter(p => inDir(p, 'backstage teatro'));
  const btBacks = btFiles.filter(f => /^backstage\b/i.test(baseName(f))).map(baseName);
  const btPers  = btFiles.filter(f => !/^backstage\b/i.test(baseName(f))).map(baseName);

  // Archivos en otras ubicaciones
  const other = allFiles.filter(p => !inDir(p, 'backstage teatro'));
  const bsBacks = other.filter(p => inDir(p, 'Backstage')).map(baseName);
  const persOther = other.filter(p => !inDir(p, 'Backstage')).map(baseName);

  // Consolidar
  const personFiles = Array.from(new Set([...btPers, ...persOther]));
  const backs = Array.from(new Set([...btBacks, ...bsBacks])).sort();

  // agrupar por base (Abuela, Aurora, Director, etc.)
  const map = new Map();
  for (const f of personFiles) { const b=baseFrom(f); if(!map.has(b)) map.set(b,[]); map.get(b).push(f); }

  const personajes = [...map.entries()].map(([nombre, fotos])=>({ nombre, fotos:fotos.sort().slice(0,3) }))
    .sort((a,b)=>a.nombre.localeCompare(b.nombre));
  const backstages = backs.sort().map(f=>({ titulo: baseFrom(f), foto: f }));

  await fs.mkdir(path.dirname(OUT), { recursive:true });
  await fs.writeFile(OUT, JSON.stringify({ personajes, backstages }, null, 2), 'utf8');
  console.log('Manifest escrito en', OUT, '(base:', BASE, ')');
}

main().catch(err=>{ console.error(err); process.exit(1); });
