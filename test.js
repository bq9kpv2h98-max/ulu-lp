const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync('app.js', 'utf8');
assert.ok(source.includes('4,980'));
assert.ok(source.includes('60〜90分'));
assert.ok(source.includes('https://lin.ee/pum599o'));
assert.ok(!source.includes('保険'));
for (const file of ['index.html', 'back.html', 'shoulder.html', 'style.css', 'assets/clinic.jpg']) assert.ok(fs.existsSync(file));
console.log('LP content checks passed');
