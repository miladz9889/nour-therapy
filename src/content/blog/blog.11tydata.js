module.exports = {
  layout: "layouts/blog.njk",
  navPrefix: "../index.html",
  assetPrefix: "../",
  ogType: "article",
  permalink: (data) => `writing/${data.slug}.html`,
  eleventyComputed: {
    canonicalUrl: (data) => `https://nourtherapy.me/writing/${data.slug}.html`,
    pageTitle: (data) => `${data.seoTitle} | Nour Therapy, Bothell WA`,
    ogTitle: (data) => data.seoTitle,
    ogDescription: (data) => data.teaser,
  },
};
