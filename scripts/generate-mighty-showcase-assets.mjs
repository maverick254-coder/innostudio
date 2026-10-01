import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const sourceDir = join(root, 'public', 'projects', 'mighty', '_source')
const outputDir = join(root, 'public', 'projects', 'mighty')

mkdirSync(sourceDir, { recursive: true })
mkdirSync(outputDir, { recursive: true })

const desktop = { width: 1440, height: 900 }
const mobile = { width: 390, height: 844 }

function nav(x, y, dark = false) {
  const fill = dark ? '#f7f2e8' : '#111111'
  return `
    <text x="${x}" y="${y}" class="brand" fill="${fill}">MIGHTY</text>
    <text x="${x + 150}" y="${y}" class="nav" fill="${fill}">WORK</text>
    <text x="${x + 230}" y="${y}" class="nav" fill="${fill}">STUDIO</text>
    <text x="${x + 330}" y="${y}" class="nav" fill="${fill}">SERVICES</text>
    <text x="${x + 455}" y="${y}" class="nav" fill="${fill}">CONTACT</text>
  `
}

function dotField(fill = '#111111', accent = '#ff5b3d') {
  return `
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="4" r="2.5" fill="${fill}" opacity=".82"/>
      <circle cx="14" cy="14" r="1.8" fill="${accent}" opacity=".8"/>
    </pattern>
  `
}

function wavePattern() {
  return `
    <pattern id="waves" width="120" height="28" patternUnits="userSpaceOnUse">
      <path d="M0 14 C30 0 60 28 90 14 C105 7 114 6 120 8" fill="none" stroke="#ffffff" stroke-opacity=".14" stroke-width="2"/>
    </pattern>
  `
}

function styles() {
  return `
    <style>
      .brand{font:900 30px Montserrat,Arial,sans-serif;letter-spacing:6px}
      .nav{font:800 15px Work Sans,Arial,sans-serif;letter-spacing:2px}
      .kicker{font:800 17px Work Sans,Arial,sans-serif;letter-spacing:3px}
      .serif{font:900 90px Georgia,serif;line-height:1}
      .serif-sm{font:900 48px Georgia,serif}
      .body{font:500 27px Work Sans,Arial,sans-serif}
      .body-sm{font:600 20px Work Sans,Arial,sans-serif}
      .label{font:800 14px Work Sans,Arial,sans-serif;letter-spacing:2px}
    </style>
  `
}

function desktopChrome(width, dark = false) {
  return `
    <rect x="42" y="36" width="${width - 84}" height="38" rx="19" fill="${dark ? '#ffffff' : '#111111'}" opacity="${dark ? '.08' : '.08'}"/>
    <circle cx="68" cy="55" r="6" fill="${dark ? '#ffffff' : '#111111'}" opacity=".42"/>
    <circle cx="88" cy="55" r="6" fill="${dark ? '#ffffff' : '#111111'}" opacity=".34"/>
    <circle cx="108" cy="55" r="6" fill="${dark ? '#ffffff' : '#111111'}" opacity=".26"/>
  `
}

const assets = [
  {
    name: 'home-desktop',
    size: desktop,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900">
        ${styles()}${dotField()}${wavePattern()}
        <rect width="1440" height="900" fill="#ffcb00"/>
        ${desktopChrome(1440)}${nav(82, 130)}
        <rect x="1005" y="0" width="435" height="900" fill="#050505"/>
        <rect x="1005" y="0" width="435" height="900" fill="url(#waves)"/>
        <circle cx="980" cy="680" r="260" fill="url(#dots)" opacity=".85"/>
        <text x="160" y="310" class="kicker" fill="#111111">SELECTED WORK / 2026</text>
        <text x="160" y="430" class="serif" fill="#111111">Digital experiences</text>
        <text x="160" y="520" class="serif" fill="#111111">for people who care</text>
        <text x="160" y="610" class="serif" fill="#111111">how things feel.</text>
        <text x="165" y="690" class="body" fill="#111111">Editorial rhythm, useful motion, and launch systems</text>
        <text x="165" y="730" class="body" fill="#111111">built with enough care to feel inevitable.</text>
        <rect x="760" y="245" width="310" height="430" fill="#f4f1ec"/>
        <text x="805" y="325" class="label" fill="#111111">CASE INDEX</text>
        <text x="805" y="385" class="serif-sm" fill="#111111">01 / 06</text>
        <text x="805" y="445" class="body-sm" fill="#111111">Made for motion.</text>
        <rect x="150" y="790" width="190" height="64" fill="#111111"/><text x="183" y="831" class="label" fill="#ffcb00">STRATEGY</text>
        <rect x="360" y="790" width="190" height="64" fill="#111111"/><text x="396" y="831" class="label" fill="#ffcb00">INTERFACE</text>
        <rect x="570" y="790" width="190" height="64" fill="#111111"/><text x="616" y="831" class="label" fill="#ffcb00">MOTION</text>
      </svg>
    `,
  },
  {
    name: 'home-mobile',
    size: mobile,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844">
        ${styles()}${dotField()}
        <rect width="390" height="844" fill="#ffcb00"/>
        <rect x="128" y="12" width="134" height="24" rx="12" fill="#050505"/>
        <text x="34" y="82" class="brand" fill="#111111" font-size="22">MIGHTY</text>
        <text x="294" y="80" class="nav" fill="#111111">MENU</text>
        <circle cx="318" cy="690" r="145" fill="url(#dots)" opacity=".72"/>
        <text x="34" y="184" class="serif-sm" fill="#111111">Useful products</text>
        <text x="34" y="240" class="serif-sm" fill="#111111">with a pulse.</text>
        <text x="34" y="305" class="body-sm" fill="#111111">Editorial systems, campaign pages,</text>
        <text x="34" y="334" class="body-sm" fill="#111111">and details shaped for launch.</text>
        <line x1="34" y1="430" x2="356" y2="430" stroke="#111111" opacity=".35"/>
        <text x="34" y="475" class="label" fill="#111111">01</text><text x="86" y="475" class="body-sm" fill="#111111">Culture systems</text>
        <line x1="34" y1="530" x2="356" y2="530" stroke="#111111" opacity=".35"/>
        <text x="34" y="575" class="label" fill="#111111">02</text><text x="86" y="575" class="body-sm" fill="#111111">Project stories</text>
        <line x1="34" y1="630" x2="356" y2="630" stroke="#111111" opacity=".35"/>
        <text x="34" y="675" class="label" fill="#111111">03</text><text x="86" y="675" class="body-sm" fill="#111111">Motion language</text>
      </svg>
    `,
  },
  {
    name: 'about-desktop',
    size: desktop,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900">
        ${styles()}${dotField('#111111','#ff5b3d')}${wavePattern()}
        <rect width="1440" height="900" fill="#f4f1ec"/>
        ${desktopChrome(1440)}${nav(82, 130)}
        <text x="76" y="274" class="label" fill="#111111" transform="rotate(-90 76 274)">MIGHTY WORK IN ALL DIRECTIONS</text>
        <text x="190" y="255" class="serif" fill="#111111">Explore our</text>
        <text x="190" y="345" class="serif" fill="#111111">projects.</text>
        <circle cx="1080" cy="230" r="220" fill="url(#dots)" opacity=".7"/>
        <rect x="190" y="470" width="290" height="250" fill="#ffffff"/>
        <rect x="190" y="470" width="290" height="22" fill="#ffcb00"/>
        <text x="225" y="585" class="label" fill="#111111">ZONDER HOUSE</text>
        <text x="225" y="645" class="serif-sm" fill="#111111" font-size="37">Publishing brand</text>
        <rect x="575" y="425" width="330" height="295" fill="#ffffff"/>
        <rect x="575" y="425" width="330" height="22" fill="#ffcb00"/>
        <text x="615" y="565" class="label" fill="#111111">LISTENING ROOM</text>
        <text x="615" y="625" class="serif-sm" fill="#111111" font-size="37">Concert venue</text>
        <rect x="1000" y="505" width="280" height="215" fill="#050505"/>
        <rect x="1000" y="505" width="280" height="215" fill="url(#waves)"/>
        <text x="1034" y="628" class="label" fill="#ffcb00">MILLWORK</text>
        <text x="1034" y="675" class="body-sm" fill="#ffffff">Platform rhythm</text>
      </svg>
    `,
  },
  {
    name: 'about-mobile',
    size: mobile,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844">
        ${styles()}${dotField()}
        <rect width="390" height="844" fill="#f4f1ec"/>
        <rect x="128" y="12" width="134" height="24" rx="12" fill="#050505"/>
        <text x="34" y="82" class="brand" fill="#111111" font-size="22">MIGHTY</text>
        <text x="302" y="80" class="nav" fill="#111111">WORK</text>
        <text x="34" y="185" class="serif-sm" fill="#111111">Explore our</text>
        <text x="34" y="240" class="serif-sm" fill="#111111">projects.</text>
        <circle cx="300" cy="185" r="100" fill="url(#dots)" opacity=".55"/>
        <rect x="34" y="335" width="322" height="112" fill="#ffffff"/>
        <rect x="34" y="335" width="12" height="112" fill="#ffcb00"/>
        <text x="70" y="382" class="label" fill="#111111">ZONDER HOUSE</text><text x="70" y="420" class="body-sm" fill="#111111">Publishing brand launch</text>
        <rect x="34" y="482" width="322" height="112" fill="#ffffff"/>
        <rect x="34" y="482" width="12" height="112" fill="#ffcb00"/>
        <text x="70" y="529" class="label" fill="#111111">LISTENING ROOM</text><text x="70" y="567" class="body-sm" fill="#111111">Venue story system</text>
        <rect x="34" y="629" width="322" height="112" fill="#050505"/>
        <text x="70" y="676" class="label" fill="#ffcb00">MILLWORK</text><text x="70" y="714" class="body-sm" fill="#ffffff">Furniture platform rhythm</text>
      </svg>
    `,
  },
  {
    name: 'services-desktop',
    size: desktop,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900">
        ${styles()}${wavePattern()}${dotField('#ffcb00','#ff5b3d')}
        <rect width="1440" height="900" fill="#050505"/>
        ${desktopChrome(1440, true)}${nav(82, 130, true)}
        <rect x="0" y="0" width="1440" height="900" fill="url(#waves)" opacity=".9"/>
        <circle cx="1120" cy="690" r="260" fill="url(#dots)" opacity=".22"/>
        <text x="170" y="255" class="kicker" fill="#ffcb00">SERVICES</text>
        <text x="170" y="390" class="serif" fill="#f7f2e8">Systems for</text>
        <text x="170" y="482" class="serif" fill="#f7f2e8">launches that</text>
        <text x="170" y="574" class="serif" fill="#f7f2e8">need momentum.</text>
        <text x="175" y="660" class="body" fill="#f7f2e8" opacity=".75">Strategy, interface systems, motion direction,</text>
        <text x="175" y="700" class="body" fill="#f7f2e8" opacity=".75">and front-end craft shaped into a useful site.</text>
        <rect x="830" y="250" width="210" height="270" fill="none" stroke="#ffffff" stroke-opacity=".24"/>
        <text x="870" y="388" class="label" fill="#ffcb00">01 RESEARCH</text>
        <rect x="1065" y="330" width="210" height="270" fill="none" stroke="#ffffff" stroke-opacity=".24"/>
        <text x="1105" y="468" class="label" fill="#ffcb00">02 INTERFACE</text>
        <rect x="945" y="590" width="210" height="190" fill="#ffcb00"/>
        <text x="985" y="696" class="label" fill="#111111">03 RELEASE</text>
      </svg>
    `,
  },
  {
    name: 'services-mobile',
    size: mobile,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844">
        ${styles()}${wavePattern()}
        <rect width="390" height="844" fill="#050505"/>
        <rect width="390" height="844" fill="url(#waves)" opacity=".9"/>
        <rect x="128" y="12" width="134" height="24" rx="12" fill="#ffcb00"/>
        <text x="34" y="82" class="brand" fill="#f7f2e8" font-size="22">MIGHTY</text>
        <text x="266" y="80" class="nav" fill="#f7f2e8">SERVICES</text>
        <text x="34" y="178" class="kicker" fill="#ffcb00">SERVICES</text>
        <text x="34" y="255" class="serif-sm" fill="#f7f2e8">Launch systems</text>
        <text x="34" y="312" class="serif-sm" fill="#f7f2e8">with rhythm.</text>
        <line x1="34" y1="420" x2="356" y2="420" stroke="#ffffff" opacity=".24"/>
        <text x="34" y="468" class="label" fill="#ffcb00">01</text><text x="92" y="468" class="body-sm" fill="#f7f2e8">Content strategy</text>
        <line x1="34" y1="535" x2="356" y2="535" stroke="#ffffff" opacity=".24"/>
        <text x="34" y="583" class="label" fill="#ffcb00">02</text><text x="92" y="583" class="body-sm" fill="#f7f2e8">Design systems</text>
        <line x1="34" y1="650" x2="356" y2="650" stroke="#ffffff" opacity=".24"/>
        <text x="34" y="698" class="label" fill="#ffcb00">03</text><text x="92" y="698" class="body-sm" fill="#f7f2e8">Motion prototypes</text>
      </svg>
    `,
  },
]

for (const asset of assets) {
  const sourcePath = join(sourceDir, `${asset.name}.svg`)
  const outputPath = join(outputDir, `${asset.name}.webp`)

  writeFileSync(sourcePath, asset.svg.replace(/^\n\s*/, '').trim())

  const result = spawnSync('magick', [sourcePath, '-quality', '86', outputPath], {
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}
