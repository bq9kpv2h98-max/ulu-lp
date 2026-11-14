// Add the public GTM container and click-event listener to each static LP.
const fs = require('node:fs');
const gtm = `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WN6FW2GV');</script>`;
const fallback = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WN6FW2GV" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>`;
for (const name of ['index.html', 'back.html', 'shoulder.html']) {
  let html = fs.readFileSync(name, 'utf8');
  if (html.includes('GTM-WN6FW2GV') || html.includes('tracking.js')) throw new Error(`Measurement already present: ${name}`);
  html = html.replace('</head>', `${gtm}<script defer src="tracking.js?v=1"></script></head>`);
  html = html.replace(/(<body\b[^>]*>)/, `$1${fallback}`);
  if (!html.includes(gtm) || !html.includes(fallback)) throw new Error(`Missing insertion point: ${name}`);
  fs.writeFileSync(name, html);
}
