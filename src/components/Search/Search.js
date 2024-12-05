import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Container } from 'react-bootstrap';
import './Search.scss';
import { searchQueryAPI } from '../../services/api';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

const ImageOverlayComponent = ({ imageUrl, bounds, opacity }) => {
    const map = useMap();
    const overlayRef = useRef(null);

    useEffect(() => {
        if (imageUrl && bounds) {
            const overlay = L.imageOverlay(imageUrl, bounds, {
                opacity,
                interactive: false,
                className: 'high-res-image',
            }).addTo(map);
            overlayRef.current = overlay;

            map.flyToBounds(bounds);
        }

        return () => {
            if (overlayRef.current) {
                map.removeLayer(overlayRef.current);
            }
        };
    }, [map, imageUrl, bounds, opacity]);

    return null;
};

const Search = (props) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedResult, setSelectedResult] = useState(null);
    const [overlayImages, setOverlayImages] = useState([null, null, null]);
    const [overlayBounds, setOverlayBounds] = useState([null, null, null]);
    const [opacities, setOpacities] = useState([1, 1, 1]);
    const [hanoiCoordinates, setHanoiCoordinates] = useState([21.0285, 105.8542]);
    const [mapHeight, setMapHeight] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5; // Số lượng dữ liệu hiển thị trên mỗi trang

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        if (searchQuery.trim() !== '') {
            try {
                const response = await searchQueryAPI(searchQuery);
                setSearchResults(response.data);

                if (response.data.length > 0) {
                    handleResultClick(response.data[0]);
                }
            } catch (error) {
                console.error('Search error:', error);
            }
            setSearchQuery('');
        }
    };

    const handleResultClick = (result) => {
        setSelectedResult(result);
        setHanoiCoordinates([result.Imglat, result.Imglng]);

        const northWest = [result.Imglat + 0.01, result.Imglng - 0.01];
        const southEast = [result.Imglat - 0.01, result.Imglng + 0.01];
        const bounds = [northWest, southEast];

        setOverlayImages([result.ZoningImg, result.ZoningImg, result.ZoningImg]);
        setOverlayBounds([bounds, bounds, bounds]);

        // Reset phân trang về trang đầu tiên
        setCurrentPage(0);
    };

    const handleOpacityChange = (index, newValue) => {
        const newOpacities = [...opacities];
        newOpacities[index] = newValue / 100;
        setOpacities(newOpacities);
    };

    const toggleMapHeight = () => {
        setMapHeight(mapHeight === 1 ? 2 : mapHeight === 2 ? 3 : 1);
    };

    const scrollUp = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const scrollDown = () => {
        if ((currentPage + 1) * itemsPerPage < searchResults.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleCloseOverlay = (index) => {
        const newOverlayImages = [...overlayImages];
        const newOverlayBounds = [...overlayBounds];

        newOverlayImages[index] = null;
        newOverlayBounds[index] = null;

        setOverlayImages(newOverlayImages);
        setOverlayBounds(newOverlayBounds);
    };

    const calculateDisplayRange = () => {
        const startIndex = currentPage * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, searchResults.length);
        return [startIndex, endIndex];
    };

    useEffect(() => {
        if (searchResults.length > itemsPerPage) {
            setCurrentPage(0);
        }
    }, [searchResults, itemsPerPage]);

    const maps = [
        { id: 0, className: 'Planning-maps-one' },
        { id: 1, className: 'Planning-maps-two' },
        { id: 2, className: 'Planning-maps-father' },
    ];

    // const emptyRowsCount = itemsPerPage - searchResults.length % itemsPerPage;

    return (
        // phân tích quy hoạch planning analysis
        <Container className="Planning-container">
            <div className="Planning">
                <div className="Planning-analysis">
                    <div className="Planning-analysis-icon">
                        <svg width="35" height="35" viewBox="0 0 58 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_3920_3694)">
                                <path
                                    d="M24.7857 38.1429C37.3699 38.1429 47.5714 30.052 47.5714 20.0714C47.5714 10.0908 37.3699 2 24.7857 2C12.2015 2 2 10.0908 2 20.0714C2 30.052 12.2015 38.1429 24.7857 38.1429Z"
                                    stroke="#B7A800"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M55.8569 44.7143L41.3569 33.2143"
                                    stroke="#B7A800"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    stroke-linejoin="round"
                                />
                                <g clipPath="url(#clip1_3920_3694)">
                                    <path
                                        d="M28.0778 29.9263H14.4644V16.058L21.2711 10.9487L28.0778 16.058V29.9263Z"
                                        stroke="#B7A800"
                                        strokeLinecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M28.0776 29.9263H36.586V19.7076H28.0776"
                                        stroke="#B7A800"
                                        strokeLinecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M21.271 29.9264V27.0067"
                                        stroke="#B7A800"
                                        strokeLinecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M18.7188 22.6273H23.8238"
                                        stroke="#B7A800"
                                        strokeLinecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M18.7188 18.2478H23.8238"
                                        stroke="#B7A800"
                                        strokeLinecap="round"
                                        stroke-linejoin="round"
                                    />
                                </g>
                                <g clipPath="url(#clip2_3920_3694)">
                                    <path
                                        d="M28.4645 29.7076H14.8511V15.8393L21.6578 10.7299L28.4645 15.8393V29.7076Z"
                                        stroke="#B7A800"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M28.4644 29.7076H36.9728V19.4888H28.4644"
                                        stroke="#B7A800"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M21.6577 29.7076V26.788"
                                        stroke="#B7A800"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M19.1055 22.4085H24.2105"
                                        stroke="#B7A800"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M19.1055 18.0291H24.2105"
                                        stroke="#B7A800"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        stroke-linejoin="round"
                                    />
                                </g>
                            </g>
                            <defs>
                                <clipPath id="clip0_3920_3694">
                                    <rect width="57.8571" height="46.7143" fill="white" />
                                </clipPath>
                                <clipPath id="clip1_3920_3694">
                                    <rect
                                        width="23.8235"
                                        height="20.4375"
                                        fill="white"
                                        transform="translate(13.6133 10.2188)"
                                    />
                                </clipPath>
                                <clipPath id="clip2_3920_3694">
                                    <rect width="23.8235" height="20.4375" fill="white" transform="translate(14 10)" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <div className="Planning-analysis-title">PHÂN TÍCH QUY HOẠCH</div>
                </div>
                <button onClick={toggleMapHeight}>
                    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_d_4150_7182)">
                            <rect x="4.5" y="0.5" width="39" height="39" rx="14.5" fill="#2C353D" />
                            <rect x="4.5" y="0.5" width="39" height="39" rx="14.5" stroke="black" />
                            <path
                                d="M28.9229 4L35.0767 10.1538L28.9229 16.3077"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M8 17.5385V12.6155C8 11.9626 8.25934 11.3365 8.72097 10.8749C9.1826 10.4133 9.80869 10.1539 10.4615 10.1539H35.0769"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M19.0767 36L12.9229 29.8462L19.0767 23.6923"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M39.9998 22.4616V27.3847C39.9998 28.0375 39.7403 28.6637 39.2788 29.1252C38.8173 29.5868 38.191 29.8462 37.5382 29.8462H12.9229"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                stroke-linejoin="round"
                            />
                        </g>
                        <defs>
                            <filter
                                id="filter0_d_4150_7182"
                                x="0"
                                y="0"
                                width="48"
                                height="48"
                                filterUnits="userSpaceOnUse"
                                color-interpolation-filters="sRGB"
                            >
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix
                                    in="SourceAlpha"
                                    type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                    result="hardAlpha"
                                />
                                <feOffset dy="4" />
                                <feGaussianBlur stdDeviation="2" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4150_7182" />
                                <feBlend
                                    mode="normal"
                                    in="SourceGraphic"
                                    in2="effect1_dropShadow_4150_7182"
                                    result="shape"
                                />
                            </filter>
                        </defs>
                    </svg>
                </button>
            </div>
            <div className={`Planning-maps height-${mapHeight}`}>
                <div className="Planning-maps-item">
                    {maps.map((map) => (
                        <div key={map.id} className={map.className}>
                            <div className="Planning-maps_map">
                                <MapContainer
                                    center={hanoiCoordinates}
                                    zoom={13}
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    {overlayBounds[map.id] && (
                                        <ImageOverlayComponent
                                            imageUrl={overlayImages[map.id]}
                                            bounds={overlayBounds[map.id]}
                                            opacity={opacities[map.id]}
                                        />
                                    )}
                                </MapContainer>
                                <>
                                    {overlayBounds[map.id] && (
                                        <Box
                                            sx={{ position: 'absolute', top: 10, right: 10, height: 300 }}
                                            className="slider-container"
                                        >
                                            <Slider
                                                orientation="vertical"
                                                value={opacities[map.id] * 100}
                                                min={0}
                                                max={100}
                                                step={1}
                                                onChange={(e, newValue) => handleOpacityChange(map.id, newValue)}
                                                valueLabelDisplay="auto"
                                                aria-labelledby="opacity-slider"
                                            />
                                        </Box>
                                    )}
                                    <div className="Planning-maps_clear">
                                        <button onClick={() => handleCloseOverlay(map.id)}>
                                            <svg
                                                width="30"
                                                height="28"
                                                viewBox="0 0 44 42"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <g filter="url(#filter0_d_3934_3795)">
                                                    <path
                                                        d="M21.9998 14.4858L18.222 10.9303L15.5508 13.4444L19.3285 17L15.5508 20.5556L18.222 23.0697L21.9998 19.5142L25.7776 23.0697L28.4489 20.5556L24.6711 17L28.4489 13.4444L25.7776 10.9303L21.9998 14.4858Z"
                                                        fill="#B74C00"
                                                    />
                                                    <path
                                                        fill-rule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M39 1H5V33H39V1ZM8.77778 29.4444V4.55556H35.2222V29.4444H8.77778Z"
                                                        fill="#B74C00"
                                                    />
                                                    <path
                                                        d="M21.9998 14.4858L18.222 10.9303L15.5508 13.4444L19.3285 17L15.5508 20.5556L18.222 23.0697L21.9998 19.5142L25.7776 23.0697L28.4489 20.5556L24.6711 17L28.4489 13.4444L25.7776 10.9303L21.9998 14.4858Z"
                                                        stroke="black"
                                                        strokeLinecap="square"
                                                    />
                                                    <path
                                                        fill-rule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M39 1H5V33H39V1ZM8.77778 29.4444V4.55556H35.2222V29.4444H8.77778Z"
                                                        stroke="black"
                                                        strokeLinecap="square"
                                                    />
                                                </g>
                                                <defs>
                                                    <filter
                                                        id="filter0_d_3934_3795"
                                                        x="0.5"
                                                        y="0.5"
                                                        width="43"
                                                        height="41"
                                                        filterUnits="userSpaceOnUse"
                                                        color-interpolation-filters="sRGB"
                                                    >
                                                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                        <feColorMatrix
                                                            in="SourceAlpha"
                                                            type="matrix"
                                                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                                            result="hardAlpha"
                                                        />
                                                        <feOffset dy="4" />
                                                        <feGaussianBlur stdDeviation="2" />
                                                        <feComposite in2="hardAlpha" operator="out" />
                                                        <feColorMatrix
                                                            type="matrix"
                                                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                                        />
                                                        <feBlend
                                                            mode="normal"
                                                            in2="BackgroundImageFix"
                                                            result="effect1_dropShadow_3934_3795"
                                                        />
                                                        <feBlend
                                                            mode="normal"
                                                            in="SourceGraphic"
                                                            in2="effect1_dropShadow_3934_3795"
                                                            result="shape"
                                                        />
                                                    </filter>
                                                </defs>
                                            </svg>
                                        </button>
                                    </div>
                                </>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="Planning-search-vector">
                <form className="Planning-search" onSubmit={handleSearchSubmit}>
                    <input
                        placeholder="Nhập Quận, huyện cần tìm"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearchSubmit(e);
                            }
                        }}
                    />
                    <button type="submit">
                        <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="9" r="8" stroke="#858EAD" strokeWidth="2" />
                            <path d="M14.5 15.5L18.5 19.5" stroke="#858EAD" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </form>
                <div className="Planning-vector">
                    {searchResults.length > 0 && currentPage > 0 && (
                        <button className="Planning-vector_scrollUp" onClick={scrollUp}>
                            <svg
                                width="32"
                                height="34"
                                viewBox="0 0 42 44"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g filter="url(#filter0_d_4148_6307)">
                                    <path
                                        d="M19.4 15.3041L14.6 20.4041L12.3372 18L21 8.79579L29.6627 18L27.4 20.4041L22.6 15.3042V26.5H19.4L19.4 15.3041Z"
                                        fill="#FCFCFC"
                                    />
                                    <path
                                        fill-rule="evenodd"
                                        clipRule="evenodd"
                                        d="M21 35C29.8366 35 37 27.3888 37 18C37 8.61116 29.8366 1 21 1C12.1634 1 5 8.61116 5 18C5 27.3888 12.1634 35 21 35ZM33.8 18C33.8 25.5111 28.0692 31.6 21 31.6C13.9308 31.6 8.2 25.5111 8.2 18C8.2 10.4889 13.9308 4.4 21 4.4C28.0692 4.4 33.8 10.4889 33.8 18Z"
                                        fill="#FCFCFC"
                                    />
                                    <path
                                        d="M19.4 15.3041L14.6 20.4041L12.3372 18L21 8.79579L29.6627 18L27.4 20.4041L22.6 15.3042V26.5H19.4L19.4 15.3041Z"
                                        stroke="black"
                                        strokeLinecap="square"
                                    />
                                    <path
                                        fill-rule="evenodd"
                                        clipRule="evenodd"
                                        d="M21 35C29.8366 35 37 27.3888 37 18C37 8.61116 29.8366 1 21 1C12.1634 1 5 8.61116 5 18C5 27.3888 12.1634 35 21 35ZM33.8 18C33.8 25.5111 28.0692 31.6 21 31.6C13.9308 31.6 8.2 25.5111 8.2 18C8.2 10.4889 13.9308 4.4 21 4.4C28.0692 4.4 33.8 10.4889 33.8 18Z"
                                        stroke="black"
                                        strokeLinecap="square"
                                    />
                                </g>
                                <defs>
                                    <filter
                                        id="filter0_d_4148_6307"
                                        x="0.5"
                                        y="0.5"
                                        width="41"
                                        height="43"
                                        filterUnits="userSpaceOnUse"
                                        color-interpolation-filters="sRGB"
                                    >
                                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                        <feColorMatrix
                                            in="SourceAlpha"
                                            type="matrix"
                                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                            result="hardAlpha"
                                        />
                                        <feOffset dy="4" />
                                        <feGaussianBlur stdDeviation="2" />
                                        <feComposite in2="hardAlpha" operator="out" />
                                        <feColorMatrix
                                            type="matrix"
                                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                        />
                                        <feBlend
                                            mode="normal"
                                            in2="BackgroundImageFix"
                                            result="effect1_dropShadow_4148_6307"
                                        />
                                        <feBlend
                                            mode="normal"
                                            in="SourceGraphic"
                                            in2="effect1_dropShadow_4148_6307"
                                            result="shape"
                                        />
                                    </filter>
                                </defs>
                            </svg>
                        </button>
                    )}
                    {searchResults.length > 0 && (currentPage + 1) * itemsPerPage < searchResults.length && (
                        <button className="Planning-vector_scrollDown" onClick={scrollDown}>
                            <svg
                                width="32"
                                height="34"
                                viewBox="0 0 42 44"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g filter="url(#filter0_d_3934_3760)">
                                    <path
                                        d="M22.6 20.6959L27.4 15.5959L29.6628 18L21 27.2042L12.3373 18L14.6 15.5959L19.4 20.6958V9.5H22.6V20.6959Z"
                                        fill="#FCFCFC"
                                    />
                                    <path
                                        fill-rule="evenodd"
                                        clipRule="evenodd"
                                        d="M21 1C12.1634 1 5 8.61116 5 18C5 27.3888 12.1634 35 21 35C29.8366 35 37 27.3888 37 18C37 8.61116 29.8366 1 21 1ZM8.2 18C8.2 10.4889 13.9308 4.4 21 4.4C28.0692 4.4 33.8 10.4889 33.8 18C33.8 25.5111 28.0692 31.6 21 31.6C13.9308 31.6 8.2 25.5111 8.2 18Z"
                                        fill="#FCFCFC"
                                    />
                                    <path
                                        d="M22.6 20.6959L27.4 15.5959L29.6628 18L21 27.2042L12.3373 18L14.6 15.5959L19.4 20.6958V9.5H22.6V20.6959Z"
                                        stroke="black"
                                        strokeLinecap="square"
                                    />
                                    <path
                                        fill-rule="evenodd"
                                        clipRule="evenodd"
                                        d="M21 1C12.1634 1 5 8.61116 5 18C5 27.3888 12.1634 35 21 35C29.8366 35 37 27.3888 37 18C37 8.61116 29.8366 1 21 1ZM8.2 18C8.2 10.4889 13.9308 4.4 21 4.4C28.0692 4.4 33.8 10.4889 33.8 18C33.8 25.5111 28.0692 31.6 21 31.6C13.9308 31.6 8.2 25.5111 8.2 18Z"
                                        stroke="black"
                                        strokeLinecap="square"
                                    />
                                </g>
                                <defs>
                                    <filter
                                        id="filter0_d_3934_3760"
                                        x="0.5"
                                        y="0.5"
                                        width="41"
                                        height="43"
                                        filterUnits="userSpaceOnUse"
                                        color-interpolation-filters="sRGB"
                                    >
                                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                        <feColorMatrix
                                            in="SourceAlpha"
                                            type="matrix"
                                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                            result="hardAlpha"
                                        />
                                        <feOffset dy="4" />
                                        <feGaussianBlur stdDeviation="2" />
                                        <feComposite in2="hardAlpha" operator="out" />
                                        <feColorMatrix
                                            type="matrix"
                                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                        />
                                        <feBlend
                                            mode="normal"
                                            in2="BackgroundImageFix"
                                            result="effect1_dropShadow_3934_3760"
                                        />
                                        <feBlend
                                            mode="normal"
                                            in="SourceGraphic"
                                            in2="effect1_dropShadow_3934_3760"
                                            result="shape"
                                        />
                                    </filter>
                                </defs>
                            </svg>
                        </button>
                    )}
                    {searchResults.length === 0 && (
                        <button className="Planning-vector_scrollDown" onClick={scrollDown}>
                            <svg
                                width="32"
                                height="34"
                                viewBox="0 0 42 44"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g filter="url(#filter0_d_3934_3760)">
                                    <path
                                        d="M22.6 20.6959L27.4 15.5959L29.6628 18L21 27.2042L12.3373 18L14.6 15.5959L19.4 20.6958V9.5H22.6V20.6959Z"
                                        fill="#FCFCFC"
                                    />
                                    <path
                                        fill-rule="evenodd"
                                        clipRule="evenodd"
                                        d="M21 1C12.1634 1 5 8.61116 5 18C5 27.3888 12.1634 35 21 35C29.8366 35 37 27.3888 37 18C37 8.61116 29.8366 1 21 1ZM8.2 18C8.2 10.4889 13.9308 4.4 21 4.4C28.0692 4.4 33.8 10.4889 33.8 18C33.8 25.5111 28.0692 31.6 21 31.6C13.9308 31.6 8.2 25.5111 8.2 18Z"
                                        fill="#FCFCFC"
                                    />
                                    <path
                                        d="M22.6 20.6959L27.4 15.5959L29.6628 18L21 27.2042L12.3373 18L14.6 15.5959L19.4 20.6958V9.5H22.6V20.6959Z"
                                        stroke="black"
                                        strokeLinecap="square"
                                    />
                                    <path
                                        fill-rule="evenodd"
                                        clipRule="evenodd"
                                        d="M21 1C12.1634 1 5 8.61116 5 18C5 27.3888 12.1634 35 21 35C29.8366 35 37 27.3888 37 18C37 8.61116 29.8366 1 21 1ZM8.2 18C8.2 10.4889 13.9308 4.4 21 4.4C28.0692 4.4 33.8 10.4889 33.8 18C33.8 25.5111 28.0692 31.6 21 31.6C13.9308 31.6 8.2 25.5111 8.2 18Z"
                                        stroke="black"
                                        strokeLinecap="square"
                                    />
                                </g>
                                <defs>
                                    <filter
                                        id="filter0_d_3934_3760"
                                        x="0.5"
                                        y="0.5"
                                        width="41"
                                        height="43"
                                        filterUnits="userSpaceOnUse"
                                        color-interpolation-filters="sRGB"
                                    >
                                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                        <feColorMatrix
                                            in="SourceAlpha"
                                            type="matrix"
                                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                            result="hardAlpha"
                                        />
                                        <feOffset dy="4" />
                                        <feGaussianBlur stdDeviation="2" />
                                        <feComposite in2="hardAlpha" operator="out" />
                                        <feColorMatrix
                                            type="matrix"
                                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                        />
                                        <feBlend
                                            mode="normal"
                                            in2="BackgroundImageFix"
                                            result="effect1_dropShadow_3934_3760"
                                        />
                                        <feBlend
                                            mode="normal"
                                            in="SourceGraphic"
                                            in2="effect1_dropShadow_3934_3760"
                                            result="shape"
                                        />
                                    </filter>
                                </defs>
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            <div className="Planning-table">
                <table className="Planning-table_data" border="1">
                    <thead>
                        <tr>
                            <th className="Planning-table_th">STT</th>
                            <th>Huyện</th>
                            <th>Tọa độ</th>
                            <th>Tọa độ</th>
                            <th>Tọa độ</th>
                            <th>Tọa độ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.length > 0 &&
                            searchResults.slice(...calculateDisplayRange()).map((result, index) => (
                                <tr key={index} onClick={() => handleResultClick(result)}>
                                    <td>{index + 1 + currentPage * itemsPerPage}</td>
                                    <td>{result.Description}</td>
                                    <td>{result.Imglat}</td>
                                    <td>{result.Imglng}</td>
                                    <td>{result.OtherCoordinates1}</td>
                                    <td>{result.OtherCoordinates2}</td>
                                </tr>
                            ))}
                        {searchResults.length === 0 &&
                            Array.from({ length: itemsPerPage }).map((_, index) => (
                                <tr key={index}>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </Container>
    );
};

export default Search;
