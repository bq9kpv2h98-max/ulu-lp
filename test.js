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
const scenePositionsSeen = new Set();
for (const [path, heading, src] of [['/index.html', 'やりたいことを', 'lp_top'], ['/back.html', '「腰が気になるから」', 'lp_youtu'], ['/shoulder.html', '首や肩の重さを気にせず', 'lp_katakori']]) {
  const target = { innerHTML: '' };
  const document = { title: '', querySelector: () => target };
  vm.runInNewContext(source, { location: { pathname: path }, document });
  assert.ok(target.innerHTML.includes(heading), `${path}: page heading`);
  assert.equal((target.innerHTML.match(/class="scene"/g) || []).length, 6);
  const positions = [...target.innerHTML.matchAll(/class="scene-photo"[^>]*background-image:url\(assets\/([^)]*)\);background-position:([^"]+)/g)].map(m => m[1] + ":" + m[2]);
  assert.equal(positions.length, 6, `${path}: six distinct scene photographs`);
  for (const position of positions) { assert.ok(!scenePositionsSeen.has(position), `scene photograph repeated: ${position}`); scenePositionsSeen.add(position); }
  const photos = [...target.innerHTML.matchAll(/<img src="assets\/([^"]+)/g)].map(m => m[1]);
  assert.equal(new Set(photos).size, photos.length, `${path}: repeated image`);
  assert.ok(fs.readFileSync(path.slice(1), 'utf8').includes('data-theme="' + (src === 'lp_top' ? 'general' : src === 'lp_youtu' ? 'back' : 'shoulder') + '"'));
  assert.equal((target.innerHTML.match(/初回予約はこちら/g) || []).length, 3);
  assert.equal((target.innerHTML.match(new RegExp('https://appointment-system.net/book\\?src=' + src, 'g')) || []).length, 3);
  const pageHtml = fs.readFileSync(path.slice(1), 'utf8');
  assert.equal((pageHtml.match(new RegExp('https://appointment-system.net/book\\?src=' + src, 'g')) || []).length, 3, `${path}: header, mobile and desktop booking links`);
  assert.ok(pageHtml.includes('class="mobile-booking"'));
  assert.ok(pageHtml.includes('class="desktop-left"'));
  assert.ok(pageHtml.includes('class="desktop-right"'));
  for (const id of ['top','vision','scenes','method','first-visit','price','access','faq']) assert.ok(target.innerHTML.includes('id="' + id + '"'), `${path}: missing section ${id}`);
  for (const image of positions) assert.ok(fs.existsSync('assets/' + image.split(':')[0]), `${path}: missing scene image`);
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
