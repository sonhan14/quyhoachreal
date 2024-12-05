import { useLocation } from 'react-router-dom';

const useGetParams = () => {
    const location = useLocation();

    // Lấy query params từ URL
    const searchParams = new URLSearchParams(location.search);
    return searchParams;
};

export default useGetParams;
