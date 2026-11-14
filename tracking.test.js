const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const script = fs.readFileSync('tracking.js', 'utf8');

class TestElement {
  constructor(href, area) { this.href = href; this.area = area; }
  closest(selector) { return selector === 'a[href]' || selector === this.area ? this : null; }
}
function setup(pathname) {
  const window = {};
  let onClick;
  vm.runInNewContext(script, {
    window, Element: TestElement, URL,
    document: { addEventListener(type, callback) { assert.equal(type, 'click'); onClick = callback; } },
    location: { pathname, href: `https://example.test${pathname}` },
  });
  return { window, click: target => onClick({ target }) };
}
for (const [path, page] of [['/index.html', 'general'], ['/back.html', 'back'], ['/shoulder.html', 'shoulder']]) {
  const t = setup(path);
  t.click(new TestElement('https://appointment-system.net/book?src=test&name=private', '.mobile-booking'));
  assert.deepEqual(JSON.parse(JSON.stringify(t.window.dataLayer[0])), {event:'booking_click', lp_type:page, link_area:'mobile_fixed'});
  t.click(new TestElement('https://lin.ee/pum599o', '.hero'));
  assert.deepEqual(JSON.parse(JSON.stringify(t.window.dataLayer[1])), {event:'line_click', lp_type:page, link_area:'hero'});
  t.click(new TestElement('https://example.com/', 'header'));
  t.click({});
  assert.equal(t.window.dataLayer.length, 2);
}
console.log('Booking and LINE event checks passed');
