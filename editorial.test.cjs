const fs = require('node:fs');
const assert = require('node:assert/strict');
const css = fs.readFileSync('style.css', 'utf8');
assert.match(css, /family=Shippori\+Mincho/);
for (const [file, theme, source] of [
  ['index.html', 'general', 'lp_top'],
  ['back.html', 'back', 'lp_youtu'],
  ['shoulder.html', 'shoulder', 'lp_katakori'],
]) {
  const html = fs.readFileSync(file, 'utf8');
  assert.ok(html.includes(`data-theme="${theme}"`));
  assert.ok(html.includes(`appointment-system.net/book?src=${source}`));
  assert.ok(html.includes('https://lin.ee/pum599o'));
  assert.ok(html.includes('style.css?v=13'));
  assert.ok(html.includes('<span class="hero-location">姫路市田寺東</span>'));
  assert.ok(html.includes('GTM-WN6FW2GV'));
  assert.ok(css.includes(`body[data-theme="${theme}"]`));
}
console.log('Editorial styles, page themes and destinations verified');
