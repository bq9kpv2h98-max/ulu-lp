const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync('app.js', 'utf8');
assert.ok(source.includes('4,980'));
assert.ok(source.includes('60〜90分'));
assert.ok(source.includes('https://lin.ee/pum599o'));
assert.ok(!source.includes('保険'));
for (const file of ['index.html', 'back.html', 'shoulder.html', 'style.css', 'assets/clinic.jpg']) assert.ok(fs.existsSync(file));
console.log('LP content checks passed');
const vm = require('node:vm');
for (const [path, heading] of [['/index.html', 'やりたいことを'], ['/back.html', '「腰が気になるから」'], ['/shoulder.html', '首や肩の重さを気にせず']]) {
  const target = { innerHTML: '' };
  const document = { title: '', querySelector: () => target };
  vm.runInNewContext(source, { location: { pathname: path }, document });
  assert.ok(target.innerHTML.includes(heading), `${path}: page heading`);
  assert.equal((target.innerHTML.match(/class="scene"/g) || []).length, 6);
  assert.equal((target.innerHTML.match(/LINEで初回相談・予約/g) || []).length, 3);
  assert.ok(target.innerHTML.includes('ULU METHOD'));
  assert.equal((target.innerHTML.match(/class="button shimmer-button"/g) || []).length, 3);
  assert.ok(target.innerHTML.includes('maps.google.com/maps?q='));
  assert.ok(target.innerHTML.includes('google.com/maps/search/'));
}
console.log('Three page variants render correctly');

const css = fs.readFileSync('style.css', 'utf8');
assert.ok(css.includes('prefers-reduced-motion'));
assert.ok(css.includes('KleeOne-Regular-subset.ttf'));
assert.ok(css.includes('KleeOne-SemiBold-subset.ttf'));
console.log('Motion, font and map checks passed');
