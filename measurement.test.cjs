const assert = require('node:assert/strict');
const fs = require('node:fs');
for (const name of ['index.html', 'back.html', 'shoulder.html']) {
  const html = fs.readFileSync(name, 'utf8');
  assert.equal((html.match(/googletagmanager\.com\/gtm\.js/g) || []).length, 1, name);
  assert.equal((html.match(/googletagmanager\.com\/ns\.html/g) || []).length, 1, name);
  assert.equal((html.match(/tracking\.js\?v=1/g) || []).length, 1, name);
  assert.match(html, /GTM-WN6FW2GV/);
  assert.match(html, /<main id="app">[\s\S]*?<h1>/);
}
console.log('Measurement setup checks passed for all three pages');
