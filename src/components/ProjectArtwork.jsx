function BrandMark() {
  return <span className="demo-brand-mark" aria-hidden="true">M</span>
}

function DotField() {
  return <span className="demo-dot-field" aria-hidden="true" />
}

function WavePanel() {
  return <span className="demo-wave-panel" aria-hidden="true" />
}

function BrowserChrome({ dark = false }) {
  return (
    <div className={`demo-browser-chrome${dark ? ' demo-browser-chrome--dark' : ''}`} aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
      <em>mighty.studio</em>
    </div>
  )
}

function Nav({ compact = false }) {
  return (
    <nav className={`demo-nav${compact ? ' demo-nav--compact' : ''}`}>
      <strong>MIGHTY</strong>
      <span>Projects</span>
      <span>Studio</span>
      <span>Culture</span>
      <span>Contact</span>
    </nav>
  )
}

function MetricStack() {
  return (
    <div className="demo-metric-stack">
      <article><span>01</span><strong>Strategy</strong></article>
      <article><span>02</span><strong>Interface</strong></article>
      <article><span>03</span><strong>Motion</strong></article>
    </div>
  )
}

function ProjectArtwork({ artwork, title }) {
  switch (artwork) {
    case 'landing':
      return (
        <div className="demo-artwork demo-artwork--landing" aria-label={title}>
          <BrowserChrome />
          <Nav />
          <div className="demo-artwork__main">
            <span className="demo-kicker">Selected work / 2026</span>
            <p className="demo-artwork-heading">Digital experiences for people who care how things feel.</p>
            <p>We build websites, product stories, and launch systems with editorial rhythm and useful motion.</p>
          </div>
          <aside className="demo-feature-card">
            <span>Case index</span>
            <strong>01 / 06</strong>
            <p>Made for motion.</p>
          </aside>
          <MetricStack />
          <DotField />
          <WavePanel />
        </div>
      )

    case 'mobile':
    case 'home-mobile':
      return (
        <div className="demo-artwork demo-artwork--mobile" aria-label={title}>
          <div className="demo-phone-bar" />
          <header><strong>MIGHTY</strong><span>Menu</span></header>
          <p className="demo-artwork-heading">Useful products with a pulse.</p>
          <p>Editorial systems, campaign pages, and interface details shaped for launch.</p>
          <section><span>01</span><strong>Culture systems</strong></section>
          <section><span>02</span><strong>Project stories</strong></section>
          <section><span>03</span><strong>Motion language</strong></section>
          <DotField />
        </div>
      )

    case 'about-mobile':
      return (
        <div className="demo-artwork demo-artwork--mobile demo-artwork--mobile-light" aria-label={title}>
          <div className="demo-phone-bar" />
          <header><strong>MIGHTY</strong><span>Work</span></header>
          <p className="demo-artwork-heading">Explore our projects.</p>
          <section><span>Zonder House</span><strong>Publishing brand launch</strong></section>
          <section><span>Listening Room</span><strong>Concert venue story system</strong></section>
          <section><span>Millwork</span><strong>Furniture platform rhythm</strong></section>
          <DotField />
        </div>
      )

    case 'services-desktop':
      return (
        <div className="demo-artwork demo-artwork--dark-site demo-artwork--services-desktop" aria-label={title}>
          <BrowserChrome dark />
          <Nav compact />
          <span className="demo-kicker">Services</span>
          <p className="demo-artwork-heading">Systems for launches that need momentum.</p>
          <p className="demo-dark-copy">Strategy, interface systems, motion direction, and front-end craft shaped into a site people can actually use.</p>
          <div className="demo-dark-panels">
            <article>01 Research</article>
            <article>02 Interface</article>
            <article>03 Release</article>
          </div>
          <WavePanel />
        </div>
      )

    case 'services-mobile':
      return (
        <div className="demo-artwork demo-artwork--mobile demo-artwork--mobile-dark" aria-label={title}>
          <div className="demo-phone-bar" />
          <header><strong>MIGHTY</strong><span>Services</span></header>
          <p className="demo-artwork-heading">Launch systems with rhythm.</p>
          <section><span>01</span><strong>Content strategy</strong></section>
          <section><span>02</span><strong>Design systems</strong></section>
          <section><span>03</span><strong>Motion prototypes</strong></section>
          <WavePanel />
        </div>
      )

    case 'menu':
      return (
        <div className="demo-artwork demo-artwork--menu" aria-label={title}>
          <BrandMark />
          <button type="button" aria-label="Artwork close mark">×</button>
          <p className="demo-artwork-heading">Work</p>
          <ul>
            <li>Furniture</li>
            <li>Higher education</li>
            <li>Entertainment</li>
            <li>Outdoor</li>
            <li>Nonprofit</li>
            <li>Manufacturing</li>
          </ul>
          <p>Studio</p>
          <p>Services</p>
          <p>Careers</p>
          <p>Contact</p>
        </div>
      )

    case 'yellow-system':
      return (
        <div className="demo-artwork demo-artwork--yellow-system" aria-label={title}>
          <BrowserChrome />
          <Nav compact />
          <div>
            <span className="demo-kicker">Services</span>
            <p className="demo-artwork-heading">Clarity that can move through every screen.</p>
            <p>From content strategy to front-end systems, Mighty turns fuzzy launches into useful digital products.</p>
          </div>
          <aside>
            <span>Capability map</span>
            <strong>Brand sites</strong>
            <strong>Editorial systems</strong>
            <strong>Campaign tools</strong>
          </aside>
          <DotField />
          <WavePanel />
        </div>
      )

    case 'paired-mobile':
      return (
        <div className="demo-artwork demo-artwork--paired-mobile" aria-label={title}>
          <div className="demo-phone demo-phone--yellow">
            <strong>MIGHTY</strong>
            <p className="demo-artwork-heading">Studio notes for useful products.</p>
            <p>From sketch to shipped system.</p>
            <ul><li>Research</li><li>Prototype</li><li>Release</li></ul>
          </div>
          <div className="demo-phone demo-phone--pink">
            <strong>Culture</strong>
            <p className="demo-artwork-heading">Objects, stories, launches.</p>
            <ul><li>Selected work</li><li>People-first sites</li><li>Brand motion</li></ul>
          </div>
        </div>
      )

    case 'editorial-desktop':
      return (
        <div className="demo-artwork demo-artwork--editorial-desktop" aria-label={title}>
          <BrowserChrome />
          <span className="demo-side-label">Mighty work in all directions</span>
          <p className="demo-artwork-heading">Explore our projects.</p>
          <div className="demo-editorial-grid">
            <article><span>Zonder House</span><strong>Launching a publishing brand</strong><p>Identity, editorial templates, and a flexible launch hub.</p></article>
            <article><span>Listening Room</span><strong>Not your typical concert venue</strong><p>Ticket moments, artist stories, and location-aware content.</p></article>
            <article><span>Millwork</span><strong>A furniture platform with rhythm</strong><p>Product discovery for a tactile catalog.</p></article>
          </div>
          <DotField />
        </div>
      )

    case 'poster':
      return (
        <div className="demo-artwork demo-artwork--poster" aria-label={title}>
          <BrowserChrome />
          <span>Project detail</span>
          <p className="demo-artwork-heading">Signal over noise.</p>
          <div className="demo-detail-layout">
            <article><strong>Role</strong><p>Creative direction, interface design, front-end system.</p></article>
            <article><strong>Launch</strong><p>Six-week sprint from narrative strategy to interactive release.</p></article>
          </div>
          <BrandMark />
        </div>
      )

    case 'dark-site':
      return (
        <div className="demo-artwork demo-artwork--dark-site" aria-label={title}>
          <BrowserChrome dark />
          <Nav compact />
          <p className="demo-artwork-heading">Interfaces for cultural momentum.</p>
          <p className="demo-dark-copy">A dark editorial view for campaigns that need tension, pace, and a clear path to action.</p>
          <div className="demo-dark-panels">
            <article>01 Strategy</article>
            <article>02 Frontend</article>
            <article>03 Motion</article>
          </div>
          <WavePanel />
        </div>
      )

    case 'pink-wide':
      return (
        <div className="demo-artwork demo-artwork--pink-wide" aria-label={title}>
          <BrowserChrome />
          <div>
            <span>Contact</span>
            <p className="demo-artwork-heading">Tell us what needs to feel clearer.</p>
          </div>
          <form className="demo-contact-form">
            <label>Project type</label>
            <span>Brand site</span>
            <label>Timeline</label>
            <span>Spring launch</span>
            <button type="button">Start a note</button>
          </form>
          <DotField />
        </div>
      )

    case 'culture-grid':
      return (
        <div className="demo-artwork demo-artwork--culture-grid" aria-label={title}>
          <BrowserChrome />
          <p className="demo-artwork-heading">Culture is a product detail.</p>
          <div><article>Teams</article><article>Craft</article><article>Launch</article><article>Care</article></div>
          <p>Repeated language, intentional rhythm, and work that travels cleanly across every handoff.</p>
        </div>
      )

    case 'motion-board':
      return (
        <div className="demo-artwork demo-artwork--motion-board" aria-label={title}>
          <BrowserChrome dark />
          <BrandMark />
          <p className="demo-artwork-heading">Made for motion</p>
          <div className="demo-motion-strip"><span>Brief</span><span>Prototype</span><span>System</span><span>Ship</span></div>
          <WavePanel />
        </div>
      )

    case 'finale':
      return (
        <div className="demo-artwork demo-artwork--finale" aria-label={title}>
          <BrowserChrome />
          <BrandMark />
          <p className="demo-artwork-heading">Mighty</p>
          <p>Digital experiences built with an unreasonable amount of care.</p>
          <div><span>Strategy</span><span>Interface</span><span>Motion</span></div>
          <DotField />
        </div>
      )

    default:
      return (
        <div className="demo-artwork demo-artwork--finale" aria-label={title}>
          <BrandMark />
          <p className="demo-artwork-heading">{title}</p>
        </div>
      )
  }
}

export default ProjectArtwork
