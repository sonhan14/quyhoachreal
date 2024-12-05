import { useEffect, useState } from "react";
import { ImageOverlay } from "react-leaflet";

const LazyImageOverlay = ({ url, bounds, opacity }) => {
    const [loaded, setLoaded] = useState(false);
  
    useEffect(() => {
      const img = new Image();
      img.onload = () => setLoaded(true);
      img.src = url;
    }, [url]);
  
    if (!loaded) return null;
  
    return <ImageOverlay url={url} bounds={bounds} opacity={opacity} />;
  };
export default LazyImageOverlay  