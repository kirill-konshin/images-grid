import React from 'react';
import {graphql} from 'gatsby';
import {MDXRenderer} from 'gatsby-plugin-mdx';

import {Layout} from '../components/layout';

const BlogPostTemplate = ({
    data: {
        mdx: post,
        allFile: {nodes: images = []},
    },
    location,
}) => {
    return (
        <Layout
            location={location}
            title={post.frontmatter.title}
            description={post.frontmatter.description || post.excerpt}
        >
            <p>&nbsp;{post.frontmatter.date}</p>
            <MDXRenderer images={images || []}>{post.body}</MDXRenderer>
        </Layout>
    );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
    query BlogPostBySlug($slug: String!, $absolutePathRegex: String!) {
        mdx(fields: {slug: {eq: $slug}}) {
            id
            excerpt(pruneLength: 160)
            body
            frontmatter {
                title
                date(formatString: "MMMM DD, YYYY")
                description
            }
        }
        # here we search for all image-like files in blog directory
        allFile(filter: {extension: {regex: "/(jpg|jpeg|png)/"}, absolutePath: {regex: $absolutePathRegex}}) {
            nodes {
                name
                childImageSharp {
                    fixed {
                        ...GatsbyImageSharpFixed
                    }
                    original {
                        src
                    }
                }
            }
        }
    }
`;
