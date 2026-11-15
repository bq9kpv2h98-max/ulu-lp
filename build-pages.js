/* Render the three pages at build time, leaving motion and tracking for the browser. */
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('app.js', 'utf8');
const descriptions = {
  'index.html': '姫路市田寺東のULU整骨院。整体と運動を通じて、身体の悩みやこれからの目標に合わせたケアをご提案します。',
  'back.html': '姫路で腰痛の整体をお探しの方へ。ULU整骨院は身体の状態を確認し、整体と運動で好きなことを楽しめる毎日を目指します。',
  'shoulder.html': '姫路で肩こりの整体をお探しの方へ。ULU整骨院は首や肩の状態を確認し、整体と運動で日々の身体づくりを支えます。',
};
for (const [filename, description] of Object.entries(descriptions)) {
  const main = { innerHTML: '' };
  const document = { title: '', querySelector: () => main };
  vm.runInNewContext(source, { location: { pathname: '/' + filename }, document });
  if (!main.innerHTML || !document.title) throw new Error(`Missing content for ${filename}`);
  let html = fs.readFileSync(filename, 'utf8');
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${document.title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`)
    .replace(/<main id="app">[\s\S]*?<\/main>/, `<main id="app">${main.innerHTML}</main>`)
    .replace(/<script defer src="(?:app|motion)\.js\?v=\d+"><\/script>/, '<script defer src="motion.js?v=1"></script>')
    .replace(/style\.css\?v=\d+/, 'style.css?v=12');
  fs.writeFileSync(filename, html);
}
