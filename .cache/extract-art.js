const fs = require('fs');
const path = require('path');

const ART_DOC_PATH = path.join(__dirname, 'art-doc.json');
const ROOT = path.resolve(__dirname, '..');
const CODE_DIR = path.join(ROOT, 'assets', 'art', 'components', 'code');
const REF_DIR = path.join(ROOT, 'assets', 'art', 'reference');

function decodeHtml(source) {
  return source
    .replace(/&#xA;/g, '')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, '\'')
    .replace(/&quot;/g, '"');
}

function toSlug(source) {
  return decodeHtml(source)
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[：:（）()【】\[\]\/\\]+/g, '_')
    .replace(/[^\w\u4e00-\u9fa5_-]+/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function main() {
  const raw = JSON.parse(fs.readFileSync(ART_DOC_PATH, 'utf8'));
  const content = raw.data.document.content;
  const blockRegex = /<pre caption=\"([^\"]*)\"[^>]*lang=\"([^\"]+)\"><code>([\s\S]*?)<\/code><\/pre>/g;
  const extMap = {
    YAML: 'css',
    XML: 'html',
    HTML: 'html',
    Java: 'js',
    'Plain Text': 'txt'
  };
  const entries = [];
  let match;

  ensureDir(CODE_DIR);
  ensureDir(REF_DIR);

  while ((match = blockRegex.exec(content)) !== null) {
    const caption = decodeHtml(match[1]).trim() || '未命名素材';
    const lang = match[2];
    const code = decodeHtml(match[3]).trim() + '\n';
    const ext = extMap[lang] || 'txt';
    const fileName = toSlug(caption) + '.' + ext;
    const outPath = path.join(CODE_DIR, fileName);

    fs.writeFileSync(outPath, code);
    entries.push({
      type: 'code',
      name: caption,
      lang: lang,
      file: path.relative(ROOT, outPath)
    });
  }

  fs.writeFileSync(
    path.join(REF_DIR, 'art-code-index.json'),
    JSON.stringify(entries, null, 2) + '\n'
  );
}

main();
