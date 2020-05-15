import React from 'react';
import {graphql, Link} from 'gatsby';
import {Layout} from '../components/layout';

const BlogIndex = ({
    data: {
        allMdx: {edges},
    },
}) => (
    <Layout title="Blog">
        {edges.map(({node}) => (
            <>
                <h2>
                    <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
                </h2>
                <p>{node.frontmatter.date}</p>
                <div dangerouslySetInnerHTML={{__html: node.frontmatter.description || node.excerpt}} />
                <hr />
            </>
        ))}
    </Layout>
);

export default BlogIndex;

export const pageQuery = graphql`
    query BlogIndex {
        allMdx(sort: {fields: [frontmatter___date], order: DESC}) {
            edges {
                node {
                    excerpt
                    fields {
                        slug
                    }
                    frontmatter {
                        date(formatString: "MMMM DD, YYYY")
                        title
                        description
                    }
                }
            }
        }
    }
`;
