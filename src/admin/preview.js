/* Custom preview templates so editors see something close to the real page,
   styled with the site's actual CSS, instead of a plain data dump. */

function stripLinks(str) {
  if (!str) return "";
  return String(str).replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function paragraphs(str) {
  return stripLinks(str)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function toJS(value, fallback) {
  if (value == null) return fallback;
  return typeof value.toJS === "function" ? value.toJS() : value;
}

function field(entry, path, fallback) {
  return toJS(entry.getIn(["data", ...path]), fallback);
}

CMS.registerPreviewStyle(
  "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Karla:wght@300;400;500;600&display=swap'); body { padding: 24px; }",
  { raw: true }
);
CMS.registerPreviewStyle("/css/style.css");

const HomepagePreview = ({ entry, widgetFor }) => {
  const hero = field(entry, ["hero"], {});
  const about = field(entry, ["about"], {});
  const services = field(entry, ["services"], {});
  const expect = field(entry, ["expect"], {});
  const fees = field(entry, ["fees"], {});
  const contact = field(entry, ["contact"], {});

  return html`
    <div class="layout" style="grid-template-columns: 1fr; max-width: 900px;">
      <main id="top">
        <section>
          <div class="eyebrow-row eyebrow">
            <span>${hero.eyebrowWord1}</span><span class="dot">·</span><span>${hero.eyebrowWord2}</span>
          </div>
          <h1 class="hero-title">${hero.title}</h1>
          <p class="hero-lede">${hero.lede}</p>
        </section>

        <section>
          <div class="meaning">${widgetFor("meaning")}</div>
        </section>

        <section id="about">
          <div class="eyebrow">About</div>
          <h2 class="section-title">Samar Farange</h2>
          <div class="about-kicker">${about.kicker}</div>
          <div class="about-copy">
            ${(about.paragraphs || []).map((p) => html`<p>${p}</p>`)}
          </div>
          <div class="tags">
            ${(about.tags || []).map((t) => html`<span class="tag">${t}</span>`)}
          </div>
        </section>

        <section id="services">
          <div class="eyebrow">Who I work with</div>
          <h2 class="section-title services-title">${services.title}</h2>
          <div class="services-grid">
            ${(services.items || []).map(
              (item) => html`
                <div class="service-card">
                  <div class="service-dash" style="background: ${item.color};"></div>
                  <h3>${item.title}</h3>
                  <p>${item.description}</p>
                  ${item.links && item.links.length
                    ? html`<div class="card-links">
                        ${item.links.map((l) => html`<span class="link-underline">${l.text}</span>`)}
                      </div>`
                    : null}
                </div>
              `
            )}
          </div>
        </section>

        <section id="expect" class="expect-section">
          <div class="eyebrow expect-eyebrow">What to expect</div>
          <h2 class="section-title expect-title">Starting is the hardest part. So here is all of it.</h2>
          <p class="expect-lede">${expect.lede}</p>
          <div class="expect-grid">
            ${(expect.steps || []).map(
              (s) => html`
                <div class="expect-item">
                  <div class="expect-num">${s.num}</div>
                  <h3>${s.title}</h3>
                  <p>${s.description}</p>
                </div>
              `
            )}
          </div>
        </section>

        <section id="fees">
          <div class="fees-grid">
            <div>
              <div class="eyebrow">Fees &amp; insurance</div>
              <h2 class="section-title fee-title">Plainly stated</h2>
              <div class="fee-rows">
                ${(fees.rows || []).map(
                  (r) => html`<div class="fee-row"><span>${r.label}</span><span class="value">${r.value}</span></div>`
                )}
              </div>
              <p class="fee-note">${fees.note}</p>
            </div>
            <div class="fee-aside">
              <h3>Good to know</h3>
              <div class="fee-aside-list">
                ${(fees.goodToKnow || []).map((g) => html`<div>${g}</div>`)}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" class="contact-section">
          <div class="contact-intro">
            <div class="eyebrow contact-eyebrow">Get in touch</div>
            <h2 class="section-title contact-title">Start with a free 20-minute call.</h2>
            <p class="contact-lede">${contact.lede}</p>
          </div>
        </section>
      </main>
    </div>
  `;
};

const TopicPreview = ({ entry }) => {
  const title = field(entry, ["title"], "");
  const eyebrow = field(entry, ["eyebrow"], "");
  const sections = field(entry, ["sections"], []);
  const faq = field(entry, ["faq"], []);
  const ctaText = field(entry, ["ctaText"], "");

  return html`
    <div class="layout" style="grid-template-columns: 1fr; max-width: 760px;">
      <main id="top">
        <section>
          <div class="article-eyebrow">${eyebrow}</div>
          <h1 class="article-title" style="max-width: none;">${title}</h1>

          ${sections.map((section) => {
            if (section.type === "list") {
              return html`
                ${section.heading ? html`<h2 class="page-subhead">${section.heading}</h2>` : null}
                <ul class="page-list">
                  ${(section.items || []).map((item) => html`<li>${stripLinks(item)}</li>`)}
                </ul>
              `;
            }
            return html`
              ${section.heading ? html`<h2 class="page-subhead">${section.heading}</h2>` : null}
              <div class="article-body">
                ${paragraphs(section.body).map((p) => html`<p>${p}</p>`)}
              </div>
            `;
          })}

          <div class="mini-faq">
            ${faq.map(
              (item) => html`
                <details class="faq-item" open>
                  <summary><span>${item.question}</span><span class="plus">+</span></summary>
                  <p>${item.answer}</p>
                </details>
              `
            )}
          </div>

          <div class="article-cta">
            <p>${ctaText}</p>
            <span class="btn btn-lg">Book a free 20-minute consult</span>
          </div>
        </section>
      </main>
    </div>
  `;
};

const BlogPreview = ({ entry, widgetFor }) => {
  const title = field(entry, ["title"], "");
  const category = field(entry, ["category"], "");
  const image = field(entry, ["image"], "");
  const imageAlt = field(entry, ["imageAlt"], "");
  const disclaimer = field(entry, ["disclaimer"], "");
  const ctaText = field(entry, ["ctaText"], "");

  return html`
    <div class="layout" style="grid-template-columns: 1fr; max-width: 760px;">
      <main id="top">
        <section>
          <div class="article-eyebrow">${category}</div>
          <h1 class="article-title">${title}</h1>
          <div class="article-byline">Samar Farange · Licensed Therapist, Washington</div>

          ${image ? html`<div class="article-cover"><img src=${image} alt=${imageAlt} /></div>` : null}

          <div class="article-body">${widgetFor("body")}</div>

          ${disclaimer ? html`<p class="article-disclaimer">${disclaimer}</p>` : null}

          <div class="article-cta">
            <p>${ctaText}</p>
            <span class="btn btn-lg">Book a free 20-minute consult</span>
          </div>
        </section>
      </main>
    </div>
  `;
};

CMS.registerPreviewTemplate("homepage", HomepagePreview);
CMS.registerPreviewTemplate("topics", TopicPreview);
CMS.registerPreviewTemplate("blog", BlogPreview);
