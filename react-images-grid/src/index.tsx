import React, {useCallback, useEffect, useState, FC, memo} from 'react';

export interface UnresolvedImage {
    title: string;
    thumbnail: string;
    src: string;
}

export interface MeasuredImage {
    width: number;
    height: number;
}

export interface ResolvedImage extends MeasuredImage, UnresolvedImage {}

export type OnSelect = (index: number | null) => void;

interface GalleryProps {
    images: ResolvedImage[];
    onSelect?: OnSelect;
    maxOccupiedSpace?: number;
    minOccupiedSpace?: number;
}

// @see https://github.com/gatsbyjs/gatsby/issues/11246#issuecomment-457558245
// @see https://github.com/benhowell/react-grid-gallery
// @see http://jossmac.github.io/react-images
// @see https://github.com/xiaolin/react-image-gallery
export const Gallery = memo<GalleryProps>(({images, onSelect, maxOccupiedSpace = 0.3, minOccupiedSpace = 0.15}) => {
    const aspect: number[] = [];
    const adjustedWidth: number[] = [];
    const basis: number[] = [];

    const minHeight = images.reduce((res, {width, height}, i) => {
        aspect[i] = width / height;
        return res < height ? res : height;
    }, Infinity);

    const maxAdjustedWidth = images.reduce((res, {width, height}, i) => {
        adjustedWidth[i] = Math.round(minHeight * aspect[i]);
        return res > adjustedWidth[i] ? res : adjustedWidth[i];
    }, 0);

    images.forEach((photo, i) => {
        basis[i] = (adjustedWidth[i] / maxAdjustedWidth) * maxOccupiedSpace;
        if (basis[i] < minOccupiedSpace) basis[i] = minOccupiedSpace;
    });

    const onClick = useCallback(
        (e, i) => {
            e.preventDefault();
            onSelect && onSelect(i);
        },
        [onSelect],
    );

    return (
        <div className="react-images-grid__container">
            <div className="react-images-grid__wrapper">
                {images.map(({title, thumbnail, width, height, src}, i) => (
                    <a
                        key={i}
                        className="react-images-grid__photo"
                        style={{
                            backgroundImage: `url(${thumbnail})`,
                            flexBasis: basis[i] * 100 + '%',
                            maxWidth: basis[i] * 100 + 10 + '%', // this prevents last images in a row to take all space
                        }}
                        href={src}
                        onClick={e => onClick(e, i)}
                    >
                        {title && <span className="react-images-grid__title">{title}</span>}
                    </a>
                ))}
            </div>
        </div>
    );
});

const DefaultError: FC<{error: Error}> = ({error}) => <div>Error loading image information: {error.toString()}</div>;
const DefaultLoading = () => <div>Loading...</div>;
const DefaultEmpty = () => <div>Empty Gallery</div>;

const cache = new Map<string, Promise<MeasuredImage>>();

const measureImage = async (src: string): Promise<MeasuredImage> => {
    if (!cache.has(src)) {
        cache.set(
            src,
            new Promise<MeasuredImage>((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    resolve({width: img.width, height: img.height});
                };
                // img.onerror = reject;
                img.src = src;
            }),
        );
    }
    return cache.get(src) as any;
};

export const GalleryMeasurer = memo<
    GalleryProps & {
        images: UnresolvedImage[];
        Loading?: any;
        Error?: any;
        Empty?: any;
    }
>(({images, Error: ErrorCmp = DefaultError, Loading = DefaultLoading, Empty = DefaultEmpty, ...props}) => {
    const [resolvedImages, setImages] = useState<ResolvedImage[] | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                mounted &&
                    setImages(
                        await Promise.all(
                            images.map(async ({title, thumbnail, src}) => ({
                                title,
                                thumbnail,
                                src,
                                ...(await measureImage(thumbnail)),
                            })),
                        ),
                    );
            } catch (e) {
                console.error('Error loading image information', e);
                mounted && setError(e);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [images]);

    if (error) return <ErrorCmp error={error} />;

    if (null === resolvedImages) return <Loading />;

    if (!resolvedImages.length) return <Empty />;

    return <Gallery {...props} images={resolvedImages} />;
});
