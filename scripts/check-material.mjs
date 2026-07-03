import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const files = readdirSync(root).filter((file) => file.endsWith('.md'));
const visit = (directory) => {
  for (const entry of readdirSync(join(root, directory), { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) visit(path);
    else if (['.html', '.md'].includes(extname(path))) files.push(path);
  }
};
visit('labs');
const withoutCodeExamples = (source) => source.replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/g, '');

const errors = [];
for (const file of files) {
  const source = readFileSync(join(root, file), 'utf8');
  const html = extname(file) === '.html';
  const markup = html ? withoutCodeExamples(source) : source;
  const links = html
    ? [...markup.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map((match) => match[1])
    : [...source.matchAll(/!?\[[^\]]*\]\(([^\s)]+)/g)].map((match) => match[1]);
  for (const link of links) {
    if (/^[a-z][a-z\d+.-]*:|^\/\//i.test(link)) continue;
    const [path, fragment] = link.split('#');
    const target = path ? resolve(root, dirname(file), decodeURIComponent(path)) : join(root, file);
    if (!existsSync(target)) {
      errors.push(`${file}: missing ${link}`);
      continue;
    }
    if (fragment && extname(target) === '.html') {
      const ids = [...withoutCodeExamples(readFileSync(target, 'utf8')).matchAll(/\bid=["']([^"']+)["']/g)].map(
        (match) => match[1],
      );
      if (!ids.includes(decodeURIComponent(fragment))) errors.push(`${file}: missing anchor ${link}`);
    }
  }
  if (html) {
    const ids = [...markup.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
    if (new Set(ids).size !== ids.length) errors.push(`${file}: duplicate HTML id`);
    for (const block of source.matchAll(/<pre\b[^>]*>[\s\S]*?<code>([\s\S]*?)<\/code>[\s\S]*?<\/pre>/g)) {
      if (/<[a-z][^>]*>/i.test(block[1])) errors.push(`${file}: unescaped HTML inside a code example`);
    }
  }
}
for (const error of errors) console.error(error);
console.log(`Material check: ${files.length} files, ${errors.length} errors (local paths and HTML anchors/examples).`);
process.exitCode = errors.length ? 1 : 0;
