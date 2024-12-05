import React from 'react';

const YoutubeThumbnail = ({ youtubeId }) => {
    const url = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    return <img src={url} alt={`Video thumnail ${youtubeId}`} className="border border-white image-full" />;
};

export default YoutubeThumbnail;
