const srcPath = `${__dirname}/src`;

module.exports = {
    pathPrefix: `/images-grid`,
    plugins: [
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${srcPath}/blog`,
                name: `blog`,
            },
        },
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-plugin-mdx`,
            options: {
                defaultLayouts: {
                    blog: require.resolve(`${srcPath}/components/empty.js`), // blog is wrapped at src/template/blog-post level
                    default: require.resolve(`${srcPath}/components/layout.js`),
                },
                plugins: [`gatsby-remark-images`],
                gatsbyRemarkPlugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 1000,
                        },
                    },
                    `gatsby-remark-copy-linked-files`,
                ],
            },
        },
    ],
};
