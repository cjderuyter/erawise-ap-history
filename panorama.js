/* EraWise · era panorama with to-scale timeline (hover an era to open it). Data is filled in by build.py. */
(function () {
  var root = document.getElementById('pano');
  if (!root) return;
  var D = {"raw": [[1, "Pre-Columbian America", "Before 1492", null, 1460, 1492], [2, "Age of Exploration & Early Contact", "1492–1607", null, 1492, 1607], [3, "Colonial Era", "1607–1754", null, 1607, 1754], [4, "Revolutionary Period", "1754–1789", null, 1754, 1789], [5, "Early Republic", "1789–1824", null, 1789, 1824], [6, "Jacksonian Era", "1824–1840s", null, 1824, 1845], [7, "Market Revolution & Reform", "1820s–1850s", null, 1820, 1855], [8, "Westward Expansion & Manifest Destiny", "1820s–1853", null, 1820, 1853], [9, "Sectionalism & Antebellum Crisis", "1840s–1861", null, 1840, 1861], [10, "Civil War", "1861–1865", null, 1861, 1865], [11, "Reconstruction", "1865–1877", null, 1865, 1877], [12, "Gilded Age", "1877–1900", null, 1877, 1900], [13, "American Imperialism", "1890–1914", null, 1890, 1914], [14, "Progressive Era", "1890s–1920", null, 1890, 1920], [15, "World War I", "1914–1918", null, 1914, 1918], [16, "Roaring Twenties", "1920–1929", null, 1920, 1929], [17, "Great Depression & New Deal", "1929–1941", null, 1929, 1941], [18, "World War II", "1941–1945", null, 1941, 1945], [19, "Early Cold War", "1945–1960s", null, 1945, 1965], [20, "Civil Rights Movement", "1950s–1960s", null, 1950, 1968], [21, "Vietnam & Social Upheaval", "1960s–1975", null, 1960, 1975], [22, "Late Cold War / Conservative Resurgence", "1970s–1991", null, 1970, 1991], [23, "Post–Cold War", "1991–2001", null, 1991, 2001], [24, "War on Terror", "2001–2010s", null, 2001, 2015], [25, "Contemporary America", "2010s–Present", null, 2010, 2026]], "MAJOR": [[1487.7, "c. 1100", "Cahokia at its height", 1], [1492, "1492", "Columbus reaches the Americas", 2], [1607, "1607", "Jamestown founded", 3], [1776, "1776", "Declaration of Independence", 4], [1787, "1787", "Constitution written", 4], [1803, "1803", "Louisiana Purchase", 5], [1828, "1828", "Jackson elected", 6], [1846, "1846", "Mexican–American War", 8], [1861, "1861", "Civil War begins", 10], [1877, "1877", "Reconstruction ends", 11], [1898, "1898", "Spanish–American War", 13], [1917, "1917", "U.S. enters WWI", 15], [1929, "1929", "Stock market crash", 17], [1941, "1941", "Pearl Harbor", 18], [1954, "1954", "Brown v. Board", 20], [1964, "1964", "Civil Rights Act", 20], [1980, "1980", "Reagan elected", 22], [1991, "1991", "Soviet Union collapses", 23], [2001, "2001", "9/11 attacks", 24], [2008, "2008", "Great Recession", 25]], "DETAIL": [[1486.6, "c. 1000", "Norse reach Newfoundland", 1], [1489.6, "c. 1450", "Haudenosaunee Confederacy forms", 1], [1494, "1494", "Treaty of Tordesillas", 2], [1519, "1519", "Cortés invades the Aztec Empire", 2], [1550, "1550", "Valladolid debate", 2], [1565, "1565", "St. Augustine founded", 2], [1598, "1598", "Oñate enters New Mexico", 2], [1619, "1619", "Enslaved Africans reach Virginia", 3], [1620, "1620", "Mayflower Compact", 3], [1630, "1630", "Massachusetts Bay founded", 3], [1676, "1676", "Bacon’s Rebellion", 3], [1680, "1680", "Pueblo Revolt", 3], [1739, "1739", "Stono Rebellion", 3], [1763, "1763", "Proclamation of 1763", 4], [1765, "1765", "Stamp Act", 4], [1773, "1773", "Boston Tea Party", 4], [1775, "1775", "Lexington & Concord", 4], [1781, "1781", "Victory at Yorktown", 4], [1786, "1786", "Shays’ Rebellion", 4], [1791, "1791", "Bill of Rights ratified", 5], [1798, "1798", "Alien and Sedition Acts", 5], [1803.6, "1803", "Marbury v. Madison", 5], [1812, "1812", "War of 1812", 5], [1820, "1820", "Missouri Compromise", 5], [1823, "1823", "Monroe Doctrine", 5], [1824, "1824", "“Corrupt Bargain”", 6], [1830, "1830", "Indian Removal Act", 6], [1832, "1832", "Bank veto; Nullification Crisis", 6], [1838, "1838", "Trail of Tears", 6], [1825, "1825", "Erie Canal opens", 7], [1831, "1831", "The Liberator founded", 7], [1837, "1837", "Panic of 1837", 7], [1844, "1844", "Morse’s telegraph", 7], [1848, "1848", "Seneca Falls Convention", 7], [1836, "1836", "Texas independence", 8], [1845, "1845", "Texas annexed", 8], [1846.6, "1846", "Oregon Treaty", 8], [1848, "1848", "Treaty of Guadalupe Hidalgo", 8], [1849, "1849", "California Gold Rush", 8], [1850, "1850", "Compromise of 1850", 9], [1852, "1852", "Uncle Tom’s Cabin", 9], [1854, "1854", "Kansas–Nebraska Act", 9], [1857, "1857", "Dred Scott decision", 9], [1859, "1859", "John Brown’s raid", 9], [1860, "1860", "Lincoln elected", 9], [1862, "1862", "Antietam", 10], [1863, "1863", "Emancipation Proclamation", 10], [1863.5, "1863", "Gettysburg", 10], [1864, "1864", "Sherman’s March", 10], [1865, "1865", "Surrender at Appomattox", 10], [1865.3, "1865", "13th Amendment", 11], [1867, "1867", "Reconstruction Acts", 11], [1868, "1868", "14th Amendment", 11], [1868.5, "1868", "Johnson impeached", 11], [1870, "1870", "15th Amendment", 11], [1882, "1882", "Chinese Exclusion Act", 12], [1886, "1886", "Haymarket Affair", 12], [1887, "1887", "Dawes Act", 12], [1890, "1890", "Wounded Knee", 12], [1896, "1896", "Plessy v. Ferguson", 12], [1893, "1893", "Hawaiian monarchy overthrown", 13], [1899, "1899", "Open Door notes", 13], [1904, "1904", "Roosevelt Corollary", 13], [1914, "1914", "Panama Canal opens", 13], [1906, "1906", "Pure Food and Drug Act", 14], [1912, "1912", "Bull Moose election", 14], [1913, "1913", "16th & 17th Amendments", 14], [1920, "1920", "19th Amendment", 14], [1915, "1915", "Lusitania sunk", 15], [1917.4, "1917", "Zimmermann Telegram", 15], [1918, "1918", "Armistice; Fourteen Points", 15], [1919, "1919", "Red Scare; Versailles", 15], [1921, "1921", "Emergency Quota Act", 16], [1924, "1924", "Immigration Act of 1924", 16], [1925, "1925", "Scopes Trial", 16], [1927, "1927", "Lindbergh flies the Atlantic", 16], [1932, "1932", "Bonus Army", 17], [1933, "1933", "New Deal begins", 17], [1935, "1935", "Social Security Act", 17], [1937, "1937", "Court-packing plan", 17], [1939, "1939", "War begins in Europe", 17], [1942, "1942", "Executive Order 9066", 18], [1942.5, "1942", "Battle of Midway", 18], [1944, "1944", "D-Day", 18], [1945, "1945", "Atomic bombs; war ends", 18], [1947, "1947", "Truman Doctrine", 19], [1948, "1948", "Marshall Plan", 19], [1949, "1949", "NATO formed", 19], [1950, "1950", "Korean War begins", 19], [1950.5, "1950", "McCarthy’s Wheeling speech", 19], [1955, "1955", "Montgomery Bus Boycott", 20], [1957, "1957", "Little Rock Nine", 20], [1960, "1960", "Greensboro sit-ins", 20], [1963, "1963", "March on Washington", 20], [1965, "1965", "Voting Rights Act", 20], [1964.5, "1964", "Gulf of Tonkin Resolution", 21], [1965.5, "1965", "Great Society programs", 21], [1968, "1968", "Tet Offensive", 21], [1973, "1973", "Roe v. Wade", 21], [1974, "1974", "Nixon resigns", 21], [1975, "1975", "Fall of Saigon", 21], [1979, "1979", "Iran hostage crisis", 22], [1981, "1981", "Reagan tax cuts", 22], [1986, "1986", "Iran–Contra affair", 22], [1987, "1987", "“Tear down this wall”", 22], [1989, "1989", "Berlin Wall falls", 22], [1991.5, "1991", "Gulf War", 23], [1994, "1994", "NAFTA takes effect", 23], [1994.6, "1994", "Contract with America", 23], [1998, "1998", "Clinton impeached", 23], [2001.5, "2001", "War in Afghanistan", 24], [2002, "2002", "No Child Left Behind", 24], [2003, "2003", "Iraq War", 24], [2005, "2005", "Hurricane Katrina", 24], [2009, "2009", "Obama inaugurated", 25], [2010, "2010", "Affordable Care Act", 25], [2016, "2016", "Trump elected", 25], [2020, "2020", "COVID-19 pandemic", 25], [2021, "2021", "Biden inaugurated", 25]]};
  var RAW = D.raw, MAJOR = D.MAJOR, DETAIL = D.DETAIL;
  var Y0 = 1490, Y1 = 2030, XA = 440, XB = 7420, K = (XB - XA) / (Y1 - Y0);
  function xs(y) { return XA + (y - Y0) * K; }
  function yAt(x) { return Y0 + (x - XA) / K; }
  var SL = 388, SR = 7480, SW = SR - SL;
  var CUT = [yAt(SL), 1492, 1607, 1754, 1789, 1824, 1834, 1844, 1850, 1861, 1865, 1877, 1890, 1901, 1914, 1918, 1929, 1941, 1945, 1954, 1964, 1975, 1991, 2001, 2008, yAt(SR)];
  var baseW = RAW.map(function (r, i) { return xs(CUT[i + 1]) - xs(CUT[i]); });
  var hov = null, R = Math.round;
  function el(tag, cls, css, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (css) e.style.cssText = css; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  root.appendChild(el('div', '', 'position:absolute;left:0;top:0;width:520px;height:720px;background:#1f3a5f'));
  var strip = el('div', 'pano-strip', 'position:absolute;left:388px;top:0;width:7092px;height:720px');
  root.appendChild(strip);
  var slices = RAW.map(function (r, i) {
    var w = baseW[i], blend = R(Math.min(60, w * 0.4)), wide = w >= 230;
    var s = el('div', 'sl', 'width:' + w + 'px');
    var mask = 'linear-gradient(to right, transparent 0px, #000 ' + blend + 'px)';
    s.appendChild(el('img', '', 'position:absolute;top:0;left:-' + blend + 'px;width:calc(100% + ' + blend + 'px);height:720px;object-fit:cover;-webkit-mask-image:' + mask + ';mask-image:' + mask));
    s.firstChild.src = 'img/eras/era-' + pad(r[0]) + '.jpg'; s.firstChild.alt = 'Era ' + r[0] + ': ' + r[1];
    s.appendChild(el('div', '', 'position:absolute;left:0;top:0;width:100%;height:230px;background:linear-gradient(to bottom,rgba(10,16,28,.85),rgba(10,16,28,0));pointer-events:none'));
    s.appendChild(el('div', '', 'position:absolute;left:0;top:480px;width:100%;height:240px;background:linear-gradient(to bottom,rgba(16,21,31,0),rgba(16,21,31,1));pointer-events:none'));
    if (!wide) s.appendChild(el('div', 'vl', '', '<div class="k">ERA ' + r[0] + '</div><div class="n">' + esc(r[1]) + '</div><div class="y">' + esc(r[2]) + '</div>'));
    s.appendChild(el('div', 'hl' + (wide ? ' on' : ''), 'width:' + (wide ? R(Math.min(w - 36, 320)) : 500) + 'px',
      '<div class="k">ERA ' + r[0] + '</div><div class="n">' + esc(r[1]) + '</div><div class="y">' + esc(r[2]) + '</div><a class="open" href="era-' + pad(r[0]) + '.html">Open Era page →</a>'));
    s.addEventListener('mouseenter', function () { if (hov !== i) { hov = i; layout(); } });
    s.addEventListener('click', function (ev) { if (ev.target.tagName !== 'A' && hov !== i) { hov = i; layout(); } });
    strip.appendChild(s);
    return s;
  });
  strip.addEventListener('mouseleave', function () { if (hov !== null) { hov = null; layout(); } });

  root.appendChild(el('div', 'pano-intro', '', '<div class="k">AP United States History by EraWise</div><h2>The 25 Eras</h2><p>Everything here is drawn to scale. Each era’s picture is as wide as the years it covers, so World War I is a sliver and the Colonial Era stretches for 147 years.</p><p class="sm">Hover over any era to open it up. The timeline below stretches with it.</p><div class="go">Scroll through time →</div>'));
  root.appendChild(el('div', 'pano-legend', '', '<div class="k">Drawn to scale · 1490 to today</div><p>Some eras overlap in time. The pictures hand off at a shared year; the blue bars show each era’s full span, overlaps included.</p><div class="row"><span class="sw"></span>Era (number)</div><div class="row"><span class="dot"></span>Key date</div>'));
  root.appendChild(el('div', '', 'position:absolute;left:378px;top:732px;width:7066px;height:120px;box-sizing:border-box;border:1.5px solid rgba(200,216,238,.45);background:rgba(200,216,238,.04)'));
  root.appendChild(el('div', 'pano-tag', 'left:396px;top:723px;color:#c8d8ee', 'ERAS · FULL SPANS'));
  root.appendChild(el('div', '', 'position:absolute;left:380px;top:860px;width:7050px;height:3px;background:#e0b65a;box-shadow:0 0 8px rgba(224,182,90,.5)'));
  root.appendChild(el('div', '', 'position:absolute;left:7426px;top:852px;width:0;height:0;border-top:10px solid transparent;border-bottom:10px solid transparent;border-left:20px solid #e0b65a'));
  root.appendChild(el('div', '', 'position:absolute;left:392px;top:848px;font-size:18px;font-weight:700;color:#10151f;background:#e0b65a;padding:0 3px;line-height:26px', '//'));

  var laneEnd = [];
  var bars = RAW.map(function (r) {
    var L = 0; while (laneEnd[L] !== undefined && laneEnd[L] > r[4]) L++; laneEnd[L] = r[5];
    var b = el('div', 'mv pbar', 'top:' + (744 + L * 26) + 'px', '<div class="lb">' + r[0] + '</div><div class="ln"></div>');
    root.appendChild(b); return b;
  });
  var ticks = [];
  for (var y = 1500; y <= 2020; y += 10) {
    var major = y % 50 === 0;
    var t = el('div', 'mv', 'position:absolute;top:863px;width:' + (major ? 2 : 1) + 'px;height:' + (major ? 12 : 6) + 'px;background:rgba(224,182,90,.85)');
    root.appendChild(t);
    var lab = null;
    if (major) { lab = el('div', 'mv ptick', 'top:878px', String(y)); root.appendChild(lab); }
    ticks.push({ y: y, t: t, lab: lab, major: major });
  }
  var evEls = {};
  function evEl(key, e, detail) {
    if (evEls[key]) return evEls[key];
    var c = detail ? '#ffffff' : '#f3d9a4';
    var o = {
      line: el('div', 'mv' + (detail ? ' dt' : ''), 'position:absolute;top:866px;width:1px;background:rgba(243,217,164,.45)'),
      dot: el('div', 'mv' + (detail ? ' dt' : ''), 'position:absolute;top:856px;width:9px;height:9px;border-radius:50%;background:' + c + ';border:1.5px solid #10151f'),
      lab: el('div', 'mv pev' + (detail ? ' dt' : ''), 'border-top-color:' + c, '<div class="y">' + esc(e[1]) + '</div><div class="t">' + esc(e[2]) + '</div>')
    };
    root.appendChild(o.line); root.appendChild(o.dot); root.appendChild(o.lab);
    evEls[key] = o; return o;
  }

  function layout() {
    var h = hov, OPEN = 560, W = baseW.slice();
    if (h !== null && baseW[h] < OPEN) {
      var f = (SW - OPEN) / (SW - baseW[h]);
      W = baseW.map(function (w, i) { return i === h ? OPEN : w * f; });
    }
    var P = [SL]; W.forEach(function (w, i) { P.push(P[i] + w); });
    function map(y) { var k = 0; while (k < RAW.length - 1 && y > CUT[k + 1]) k++; return P[k] + (y - CUT[k]) / (CUT[k + 1] - CUT[k]) * W[k]; }
    slices.forEach(function (s, i) { s.style.width = W[i] + 'px'; s.classList.toggle('open-now', h === i); });
    bars.forEach(function (b, i) {
      var r = RAW[i], left = r[0] === 1 ? SL : map(r[4]), right = map(r[5]);
      b.style.left = (R(left) + 4) + 'px'; b.style.width = Math.max(R(right - left) - 8, 10) + 'px';
      b.classList.toggle('hot', h === i); b.firstChild.textContent = h === i ? 'Era ' + r[0] : String(r[0]);
    });
    ticks.forEach(function (o) { var x = R(map(o.y)); o.t.style.left = (x - (o.major ? 1 : 0)) + 'px'; if (o.lab) o.lab.style.left = (x - 30) + 'px'; });
    var shown = MAJOR.map(function (e, i) { return { k: 'm' + i, e: e, d: false }; });
    if (h !== null) DETAIL.forEach(function (e, i) { if (e[3] === h + 1) shown.push({ k: 'd' + i, e: e, d: true }); });
    shown.forEach(function (s) { s.x = map(s.e[0]); });
    shown.sort(function (a, b) { return a.x - b.x; });
    var LW = 118, rowRight = [], on = {};
    shown.forEach(function (s) {
      var r = 0; while (r < 4 && rowRight[r] !== undefined && rowRight[r] + 4 > s.x - LW / 2) r++;
      rowRight[r] = s.x + LW / 2;
      var top = 904 + r * 46, xi = R(s.x), o = evEl(s.k, s.e, s.d);
      o.line.style.left = xi + 'px'; o.line.style.height = (top - 866) + 'px';
      o.dot.style.left = (xi - 5) + 'px';
      o.lab.style.left = Math.max(xi - LW / 2, 340) + 'px'; o.lab.style.top = top + 'px';
      on[s.k] = 1;
    });
    Object.keys(evEls).forEach(function (k) { var v = on[k] ? '' : 'none'; evEls[k].line.style.display = v; evEls[k].dot.style.display = v; evEls[k].lab.style.display = v; });
  }
  layout();
})();
