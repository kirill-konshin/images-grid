import React from 'react';
import {GalleryMeasurer} from 'react-images-grid';

export default () => (
    <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <GalleryMeasurer
            images={[
                {src: '/images/Image-01.jpg', thumbnail: '/images/Image-01.jpg', title: 'Streets of Toronto'},
                {src: '/images/Image-02.jpg', thumbnail: '/images/Image-02.jpg', title: 'Streets of Toronto'},
                {src: '/images/Image-03.jpg', thumbnail: '/images/Image-03.jpg', title: 'Streets of Toronto'},
                {src: '/images/Image-04.jpg', thumbnail: '/images/Image-04.jpg', title: 'University'},
                {src: '/images/Image-05.jpg', thumbnail: '/images/Image-05.jpg', title: 'Museum'},
                {src: '/images/Image-06.jpg', thumbnail: '/images/Image-06.jpg', title: 'Niagara in the night'},
                {src: '/images/Image-07.jpg', thumbnail: '/images/Image-07.jpg', title: 'Niagara in the night'},
                {src: '/images/Image-08.jpg', thumbnail: '/images/Image-08.jpg', title: 'Niagara'},
                {src: '/images/Image-09.jpg', thumbnail: '/images/Image-09.jpg', title: 'Niagara'},
                {src: '/images/Image-10.jpg', thumbnail: '/images/Image-10.jpg', title: 'Niagara, view from the car'},
            ]}
            onSelect={index => console.log('Selected', index)}
        />
    </div>
);
