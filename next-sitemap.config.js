/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://gajendramandal.in',
  generateRobotsTxt: true,
  outDir: './out',
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: ['https://gajendramandal.in/sitemap.xml'],
  },
};
