import React, {useState, memo} from 'react';
import Carousel, {Modal, ModalGateway} from 'react-images';
import {Gallery, GalleryMeasurer, OnSelect, ResolvedImage, UnresolvedImage} from 'react-images-grid';

//FIXME https://github.com/smooth-code/react-flatten-children/pull/9
const flattenChildren = (children: any): any =>
    React.Children.toArray(children).reduce((flatChildren: any[], child: any) => {
        if (child?.props?.children) {
            return flatChildren.concat(flattenChildren(child.props.children));
        }
        flatChildren.push(child);
        return flatChildren;
    }, []);

export const ImagesGallery = memo(({children}) => (
    <GalleryWithCarousel
        measure={true}
        images={
            flattenChildren(children)
                .filter((c: any) => c?.props?.srcSet)
                .map(({props: {srcSet, src, title}}: any) => ({
                    title,
                    thumbnail: srcSet[1].split(' ').shift(),
                    src,
                })) as ResolvedImage[]
        }
    />
));

/**
 * Converts files response into gallery images set
 * @param {any} images
 * @returns {any}
 */
export const FilesGallery = memo<{children: any}>((
    {children}, // BlogPostBySlugQuery['allFile']['nodes']
) => (
    <GalleryWithCarousel
        images={children.map(
            ({
                name: title,
                childImageSharp: {
                    fixed: {src: thumbnail, width, height},
                    original: {src},
                },
            }: any) => ({
                thumbnail,
                width,
                height,
                src,
                title,
            }),
        )}
    />
));

const ModalCarousel = memo<{images: (UnresolvedImage | ResolvedImage)[]; selected: number | null; onSelect: OnSelect}>(
    ({images, selected, onSelect}) => {
        return (
            <ModalGateway>
                {null !== selected ? (
                    <Modal onClose={() => onSelect(null)}>
                        <Carousel
                            currentIndex={selected}
                            views={images.map(({title, src}) => ({
                                source: src,
                                caption: title,
                            }))}
                        />
                    </Modal>
                ) : null}
            </ModalGateway>
        );
    },
);

const GalleryWithCarousel = memo<{images: (UnresolvedImage | ResolvedImage)[]; measure?: boolean}>(
    ({images, measure}) => {
        const [selected, onSelect] = useState<number | null>(null);
        const GalleryImplementation = measure ? GalleryMeasurer : Gallery;
        return (
            <>
                <ModalCarousel images={images} onSelect={onSelect} selected={selected} />
                <GalleryImplementation onSelect={onSelect} images={images as any} />
            </>
        );
    },
);
