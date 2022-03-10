const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: "monk Docs",
    tagline: "Make DevOps fun again with the p2p alternative to Kubernetes",
    url: "https://docs.monk.io",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/monk-dolphin-small.svg",
    organizationName: "OakDS Inc.", // Usually your GitHub org/user name.
    projectName: "monk-io/docs", // Usually your repo name.
    themeConfig: {
        navbar: {
            // title: 'monk Docs',
            logo: {
                alt: "monk Docs Logo",
                src: "img/monk-dolphin-full.svg",
                srcDark: "img/monk-dolphin-full-dark.svg",
            },
            items: [
                {
                    type: "doc",
                    docId: "welcome",
                    position: "left",
                    label: "Docs",
                },
                // {to: '/blog', label: 'Blog', position: 'left'},
                {
                    href: "https://github.com/monk-io/docs",
                    label: "GitHub",
                    position: "right",
                },
            ],
            // algolia: {
            //   indexName: 'monk-docs',
            //   apiKey: 'fd80626beb26ac2e5ace88192dd0c7a1',
            // },
        },
        footer: {
            style: "dark",
            links: [
                {
                    // title: 'Docs',
                    items: [
                        {
                            label: "Terms",
                            href: "https://monk.io/terms-of-service",
                        },
                        {
                            label: "Privacy",
                            href: "https://monk.io/privacy-policy",
                        },
                    ],
                },
                {
                    // title: 'More',
                    items: [
                        {
                            label: "YouTube",
                            href: "https://www.youtube.com/channel/UCtVa9hzta_6huDd7k5D6Cxw",
                        },
                        {
                            label: "GitHub",
                            href: "https://github.com/monk-io/homebrew-monk",
                        },
                    ],
                },
                {
                    // title: 'Community',
                    items: [
                        {
                            label: "Medium",
                            href: "https://medium.com/monk-io",
                        },
                        {
                            label: "Twitter",
                            href: "https://twitter.com/monk_io",
                        },
                        {
                            label: "Discord",
                            href: "https://discord.com/invite/2YGryc5",
                        },
                    ],
                },
            ],
        },
        prism: {
            theme: darkCodeTheme,
            darkTheme: darkCodeTheme,
        },
        algolia: {
            apiKey: "3f459c6b16389d8cfd66d06dd837a635",
            indexName: "monk-docs",
            appId: "JMJR6P1AKQ",
            contextualSearch: true
        },
        metadata: [
            {
                property: 'image',
                content: 'https://monk.io/media-dolphin-monk.png',
              },
            {
              property: 'og:image',
              content: 'https://monk.io/media-dolphin-monk.png',
            },
            {
              name: 'twitter:image',
              content: 'https://monk.io/media-dolphin-monk.png',
            },
        ],
    },
    stylesheets: [
        'https://at-ui.github.io/feather-font/css/iconfont.css'
    ],
    scripts: [
        '/js/chatwoot.js',
    ],
    plugins: ["docusaurus-plugin-sass"],
    presets: [
        [
            "@docusaurus/preset-classic",
            {
                docs: {
                    sidebarPath: require.resolve("./sidebars.js"),
                    // Please change this to your repo.
                    editUrl: "https://github.com/monk-io/docs/blob/main",
                },
                // blog: {
                //   showReadingTime: true,
                //   // Please change this to your repo.
                //   editUrl:
                //     'https://github.com/facebook/docusaurus/edit/master/website/blog/',
                // },
                theme: {
                    customCss: [
                        require.resolve("./src/stylesheet/custom.css"),
                        require.resolve("./src/stylesheet/footer.scss"),
                    ],
                },
                gtag: {
                    trackingID: "G-8G90Y8YY1W",
                },
            },
        ],
    ],
};
