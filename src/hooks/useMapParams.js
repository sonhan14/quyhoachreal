import { useLocation } from "react-router-dom";

const useMapParams = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const vitri = searchParams.get('vitri');
    const zoom = parseInt(searchParams.get('zoom'), 10);
  
    const initialCenter = vitri ? vitri.split(',').map(Number) : [21.136663, 105.7473446];
    const initialZoom = zoom || 17;
  
    return { initialCenter, initialZoom };
  };

export default useMapParams;