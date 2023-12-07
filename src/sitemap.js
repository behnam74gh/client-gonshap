const sitemap = require('sitemap');
const fs = require('fs');

const hostname = 'https://www.bazarchak.ir';

const urls = [
    { url: '/', changefreq: 'daily', priority: 1 },
    { url: '/shop', changefreq: 'daily', priority: 0.8 },
    { url: '/stores', changefreq: 'daily', priority: 0.8 },
    { url: '/cart', changefreq: 'daily', priority: 0.8 },
    { url: '/favorites', changefreq: 'daily', priority: 0.8 },
];

const sitemapInstance = sitemap.createSitemap({
    hostname,
    urls,
});

fs.writeFileSync('./public/sitemap.xml', sitemapInstance.toString());