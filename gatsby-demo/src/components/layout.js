import React from 'react';
import {Link} from 'gatsby';
import {MDXProvider} from '@mdx-js/react';
import {FilesGallery, ImagesGallery} from 'gatsby-images-grid';

const components = {FilesGallery, ImagesGallery};

export const Layout = ({children, title}) => (
    <MDXProvider components={components}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h1>
                <Link to="/">Back to Index</Link>
            </h1>
            <hr />
            <h2>{title}</h2>
            {children}
        </div>
    </MDXProvider>
);

export default Layout;
