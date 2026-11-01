import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');
const outDir = path.join(process.cwd(), 'dist-site');

function mdToHtml(md: string): string {
  let h = md;
  h = h.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  h = h.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  h = h.replace(/^# (.*)$/gm, '<h1>$1</h1>');
  h = h.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/\*(.*?)\*/g, '<em>$1</em>');
  h = h.replace(/`([^`]+)`/g, '<code>$1</code>');
  h = h.replace(/^- (.*)$/gm, '<li>$1</li>');
  const paras = h.split('\n\n').map(b => b.startsWith('<') ? b : '<p>' + b.replace(/\n/g, ' ') + '</p>');
  return paras.join('\n');
}

function template(title: string, body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title></head><body>${body}</body></html>`;
}

function main() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const md = fs.readFileSync(path.join(contentDir, f), 'utf8');
    const title = (md.match(/^# (.*)$/m) || [])[1] || f;
    const body = mdToHtml(md);
    const html = template(title, body);
    const out = path.join(outDir, f.replace('.md', '.html'));
    fs.writeFileSync(out, html);
    console.log('generated', out);
  }
  console.log('done:', files.length, 'pages');
}

main();
