module.exports = {
  layout: "layouts/topic.njk",
  navPrefix: "../index.html",
  assetPrefix: "../",
  ogType: "website",
  titleMaxWidth: "20ch",
  permalink: (data) => `${data.slug}/index.html`,
  eleventyComputed: {
    canonicalUrl: (data) => `https://nourtherapy.me/${data.slug}/`,
    pageTitle: (data) => `${data.seoTitle || data.title} | Nour Therapy, Bothell WA`,
    ogTitle: (data) => data.title,
  },
};
