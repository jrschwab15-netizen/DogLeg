// Verified official artwork only. Assets and source receipts are bundled at build time.
const courseBrands=COURSE_BRANDS_DATA;
function courseBrand(c){const name=String(c?.course||c?.name||c||'').trim().toLowerCase(),id=c?.courseCard?.courseId||c?.courseId||c?.id,location=c?.location;return courseBrands.find(b=>b.ids?.includes(id)||b.names.includes(name)&&(!location||Math.abs(location.lat-b.lat)<.1&&Math.abs(location.lon-b.lon)<.1))}
function courseBadge(c){const brand=courseBrand(c);return brand?`<img class="course-logo ${brand.dark?'course-logo-dark':''}" src="${brand.image}" alt="" decoding="async">`:`<span class="course-monogram" aria-hidden="true">${esc(String(c?.course||c?.name||c||'?').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase())}</span>`}
