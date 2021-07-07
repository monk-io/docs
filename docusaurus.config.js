const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'monk Docs',
  tagline: 'Make DevOps fun again with the p2p alternative to Kubernetes',
  url: 'https://monk.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/monk-dolphin-small.svg',
  organizationName: 'OakDS Inc.', // Usually your GitHub org/user name.
  projectName: 'monk-io/docs', // Usually your repo name.
  themeConfig: {
    navbar: {
      // title: 'monk Docs',
      logo: {
        alt: 'monk Docs Logo',
        src: 'img/monk-dolphin-full.svg',
        srcDark: 'img/monk-dolphin-full-dark.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'welcome',
          position: 'left',
          label: 'Docs',
        },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/monk-io/docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          // title: 'Docs',
          items: [
            {
              label: 'Terms',
              href: 'https://monk.io/terms-of-service',
            },
            {
              label: 'Privacy',
              href: 'https://monk.io/privacy-policy',
            },
          ],
        },
        {
          // title: 'More',
          items: [
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/channel/UCtVa9hzta_6huDd7k5D6Cxw',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/monk-io/homebrew-monk',
            },
          ],
        },
        {
          // title: 'Community',
          items: [
            {
              label: 'Medium',
              href: 'https://medium.com/monk-io',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/monk_io',
            },
            {
              label: 'Discord',
              href: 'https://discord.com/invite/2YGryc5',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} OakDS Inc.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/monk-io/docs',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
