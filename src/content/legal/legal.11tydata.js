module.exports = {
  layout: "layouts/legal.njk",
  navPrefix: "../index.html",
  assetPrefix: "../",
  ogType: "website",
  permalink: (data) => `${data.slug}/index.html`,
  eleventyComputed: {
    canonicalUrl: (data) => `https://nourtherapy.me/${data.slug}/`,
    pageTitle: (data) => `${data.title} | Nour Therapy, Bothell WA`,
    ogTitle: (data) => data.title,
  },
};
