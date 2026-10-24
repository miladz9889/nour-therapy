const { DateTime } = require("luxon");
const yaml = require("js-yaml");
const markdownIt = require("markdown-it")({ html: true });

const SITE_URL = "https://nourtherapy.me";

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/llms.txt": "llms.txt" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  eleventyConfig.addCollection("topics", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/content/topics/*.md").sort((a, b) => {
      const orderA = a.data.order ?? 999;
      const orderB = b.data.order ?? 999;
      return orderA - orderB;
    });
  });

  eleventyConfig.addCollection("blog", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/content/blog/*.md").sort((a, b) => {
      const dateDiff = b.data.date - a.data.date;
      if (dateDiff !== 0) return dateDiff;
      return (a.data.order ?? 999) - (b.data.order ?? 999);
    });
  });

  eleventyConfig.addFilter("dateDisplay", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("MMMM d, yyyy");
  });

  eleventyConfig.addFilter("dateISO", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-MM-dd");
  });

  eleventyConfig.addFilter("jsonify", (value) => JSON.stringify(value));
  eleventyConfig.addFilter("markdownify", (value) => markdownIt.render(value || ""));
  eleventyConfig.addFilter("markdownInline", (value) => markdownIt.renderInline(value || ""));

  eleventyConfig.setLibrary("md", markdownIt);

  function toPlainText(markdown) {
    return markdown
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1");
  }

  function ldJson(graph) {
    return `<script type="application/ld+json">\n${JSON.stringify(
      { "@context": "https://schema.org", "@graph": graph },
      null,
      2
    )}\n</script>`;
  }

  eleventyConfig.addShortcode("homepageSchema", function (faq, site) {
    const graph = [
      {
        "@type": "MedicalBusiness",
        "@id": `${SITE_URL}/#business`,
        name: "Nour Therapy",
        url: `${SITE_URL}/`,
        telephone: site.phoneHref,
        priceRange: "$$",
        description: `Private therapy practice led by Samar Farange, based in ${site.city}, ${site.state}, offering individual, couples, teen, and family counseling online across Washington state, in English or Farsi.`,
        address: {
          "@type": "PostalAddress",
          addressLocality: site.city,
          addressRegion: site.state,
          addressCountry: "US",
        },
        areaServed: [
          { "@type": "City", name: site.city },
          { "@type": "State", name: "Washington" },
        ],
        founder: { "@id": `${SITE_URL}/#samar` },
        employee: { "@id": `${SITE_URL}/#samar` },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Therapy services",
          itemListElement: [
            "Individual therapy for adults",
            "Couples counseling",
            "Therapy for teens",
            "Family therapy",
            "Perinatal and postpartum support for new and expecting parents",
            "Therapy for immigrants and first-generation clients navigating two cultures",
          ].map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name, areaServed: "Washington" },
          })),
        },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#samar`,
        name: "Samar Farange",
        jobTitle: "Licensed Therapist",
        worksFor: { "@id": `${SITE_URL}/#business` },
        url: `${SITE_URL}/#about`,
        areaServed: "Washington, USA",
        knowsAbout: [
          "Anxiety",
          "Couples therapy",
          "Family therapy",
          "Teen therapy",
          "Postpartum support",
          "Immigrant and first-generation mental health",
        ],
        knowsLanguage: ["English", "Farsi"],
        ...(site.psychologyTodayUrl ? { sameAs: [site.psychologyTodayUrl] } : {}),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: toPlainText(f.answer) },
        })),
      },
    ];
    return ldJson(graph);
  });

  eleventyConfig.addShortcode("topicSchema", function (canonicalUrl, title, metaDescription, schemaType, medicalCondition, faq) {
    const graph = [
      {
        "@type": schemaType,
        "@id": canonicalUrl,
        url: canonicalUrl,
        name: title,
        description: metaDescription,
        ...(medicalCondition ? { about: { "@type": "MedicalCondition", name: medicalCondition } } : {}),
        isPartOf: { "@type": "WebSite", url: `${SITE_URL}/`, name: "Nour Therapy" },
        author: { "@id": `${SITE_URL}/#samar` },
        publisher: { "@id": `${SITE_URL}/#business` },
        inLanguage: "en-US",
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: toPlainText(f.answer) },
        })),
      },
    ];
    return ldJson(graph);
  });

  eleventyConfig.addShortcode("blogSchema", function (canonicalUrl, title, metaDescription, dateISOStr, image, category) {
    const graph = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      description: metaDescription,
      datePublished: dateISOStr,
      dateModified: dateISOStr,
      author: { "@id": `${SITE_URL}/#samar` },
      publisher: { "@id": `${SITE_URL}/#business` },
      mainEntityOfPage: canonicalUrl,
      image: image,
      articleSection: category,
      inLanguage: "en-US",
    };
    return `<script type="application/ld+json">\n${JSON.stringify(graph, null, 2)}\n</script>`;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
