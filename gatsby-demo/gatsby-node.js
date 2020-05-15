const path = require('path');
const {createFilePath} = require('gatsby-source-filesystem');

exports.createPages = async ({graphql, actions}) => {
    const {createPage} = actions;

    const {
        errors,
        data: {
            allMdx: {edges: posts},
        },
    } = await graphql(`
        query Blog {
            allMdx(sort: {fields: [frontmatter___date], order: DESC}, limit: 1000) {
                edges {
                    node {
                        fileAbsolutePath
                        fields {
                            slug
                        }
                        frontmatter {
                            title
                        }
                    }
                }
            }
        }
    `);

    if (errors) {
        throw errors;
    }

    posts.forEach(
        ({
            node: {
                fileAbsolutePath,
                fields: {slug},
            },
        }) => {
            createPage({
                path: slug,
                component: path.resolve(`src/templates/blog-post.js`),
                context: {
                    slug,
                    absolutePathRegex: `/^${path.dirname(fileAbsolutePath)}/`, //@see https://github.com/gatsbyjs/gatsby/issues/11246#issuecomment-612793091
                },
            });
        },
    );
};

exports.onCreateNode = ({node, actions: {createNodeField}, getNode}) => {
    if (node.internal.type === `Mdx`) {
        const value = createFilePath({node, getNode});
        createNodeField({
            name: `slug`,
            node,
            value,
        });
    }
};
