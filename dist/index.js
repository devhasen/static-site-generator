"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const contentDir = path_1.default.join(process.cwd(), 'content');
const outDir = path_1.default.join(process.cwd(), 'dist-site');
function mdToHtml(md) {
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
function template(title, body) {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title></head><body>${body}</body></html>`;
}
function main() {
    if (!fs_1.default.existsSync(outDir))
        fs_1.default.mkdirSync(outDir, { recursive: true });
    const files = fs_1.default.readdirSync(contentDir).filter(f => f.endsWith('.md'));
    for (const f of files) {
        const md = fs_1.default.readFileSync(path_1.default.join(contentDir, f), 'utf8');
        const title = (md.match(/^# (.*)$/m) || [])[1] || f;
        const body = mdToHtml(md);
        const html = template(title, body);
        const out = path_1.default.join(outDir, f.replace('.md', '.html'));
        fs_1.default.writeFileSync(out, html);
        console.log('generated', out);
    }
    console.log('done:', files.length, 'pages');
}
main();
