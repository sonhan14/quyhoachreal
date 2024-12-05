import './Auction.scss';
import AuctionSearch from './AuctionSearch';
import React from 'react';
import { Container } from 'react-bootstrap';
import './Auction.scss';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useState } from 'react';
import { useDebounce } from '../Hooks/useDebounce';
import {
    fetchDistrictsByProvinces,
    fetchFilteredAuctions,
    fetchOrganization,
    fetchProvinces,
} from '../../services/api';
import { message } from 'antd';

const Auction = () => {
    const [formData, setFormData] = useState({
        assetName: '',
        organization: '',
        ownerName: '',
        province: null,
        district: null,
        fromDateAuction: '',
        toDateAuction: '',
        fromDateAnnouncement: '',
        toDateAnnouncement: '',
        fromPrice: '',
        toPrice: '',
        sortOption: '',
    });

    //State
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [selectedProvinceId, setSelectedProvinceId] = useState(null);
    const [auctionResults, setAuctionResults] = useState([]);
    const debouncedData = useDebounce(formData, 1000);
    const [hanoiCoordinates, setHanoiCoordinates] = useState([21.0285, 105.8542]);
    const [loading, setLoading] = useState(false);
    const [isOrganization, setIsOrganization] = useState([]);

    useEffect(() => {
        // api provinces
        const fetchProvincesData = async () => {
            const data = await fetchProvinces();
            setProvince(data);
        };
        fetchProvincesData();
        // api district
        const fetchDistrictsData = async () => {
            if (selectedProvinceId) {
                const districtsData = await fetchDistrictsByProvinces(selectedProvinceId);
                setDistrict(districtsData);
            }
        };

        fetchDistrictsData();
    }, [selectedProvinceId]);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        const adjustedValue = value === 'Tất cả' ? null : value;
        setFormData({
            ...formData,
            [name]: adjustedValue,
        });
        if (name === 'province') {
            const selectedProvince = province.find((p) => p.TenTinhThanhPho === value);
            if (selectedProvince) {
                setSelectedProvinceId(selectedProvince.TinhThanhPhoID);
            } else {
                setSelectedProvinceId(null);
            }
            setDistrict([]);
        }
    };

    // api tổ chức
    useEffect(() => {
        const fetchOrganizationData = async () => {
            const data = await fetchOrganization();
            setIsOrganization(data.message);
        };
        fetchOrganizationData();
    }, []);

    const validateForm = () => {
        for (let key in formData) {
            if (formData[key] === '') {
                return false;
            }
        }
        return true;
    };

    //Đổi định dạng ngày tháng năm theo ISO

    const formatDateToISO = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Thêm '0' vào trước nếu tháng chỉ có 1 chữ số
        const day = ('0' + date.getDate()).slice(-2); // Thêm '0' vào trước nếu ngày chỉ có 1 chữ số
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };
    // Đổi định dạng theo DD/MM/YYYY
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}  ${day}/${month}/${year}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                setLoading(true);
                const startTime = debouncedData.fromDateAuction ? formatDateToISO(debouncedData.fromDateAuction) : null;
                const endTime = debouncedData.toDateAuction ? formatDateToISO(debouncedData.toDateAuction) : null;
                const startPrice = debouncedData.fromPrice ? Number(debouncedData.fromPrice) : null;
                const endPrice = debouncedData.toPrice ? Number(debouncedData.toPrice) : null;
                const province = debouncedData.province;
                const district = debouncedData.district;
                const results = await fetchFilteredAuctions(
                    startTime,
                    endTime,
                    startPrice,
                    endPrice,
                    province,
                    district,
                );
                setAuctionResults(results);
            } catch (error) {
                console.error('Error fetching filtered auctions', error);
                message.error('Đã xảy ra lỗi khi tìm kiếm đấu giá');
            } finally {
                setLoading(false);
            }
        } else {
            message.error('Vui lòng điền đủ các trường');
        }
    };

    return (
        <Container>
            <div className="auction-container-form">
                <div className=" text-auction">
                    <span className="icon-auction">
                        <svg width="50" height="50" viewBox="0 0 50 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3 53.3234H28.4057"
                                stroke="#B7A800"
                                stroke-width="5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M25.0183 53.3234V43.3234H6.38745V53.3234"
                                stroke="#B7A800"
                                stroke-width="5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M27.6832 4.17157L15.5391 18.5117C14.2163 20.0738 14.2163 22.6064 15.5391 24.1686L20.9045 30.5042C22.2274 32.0663 24.3722 32.0663 25.6951 30.5042L37.839 16.1641C39.1621 14.602 39.1621 12.0693 37.839 10.5072L32.4737 4.17157C31.1508 2.60948 29.006 2.60948 27.6832 4.17157Z"
                                stroke="#B7A800"
                                stroke-width="5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M31.7931 23.3235L47.0365 41.3234"
                                stroke="#B7A800"
                                stroke-width="5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </span>
                    <h2>Thông báo đấu giá</h2>
                </div>
            </div>
            <AuctionSearch
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                province={province}
                district={district}
                hanoiCoordinates={hanoiCoordinates}
                auctionResults={auctionResults}
                setSelectedProvinceId={setSelectedProvinceId}
                formatDate={formatDate}
                loading={loading}
                isOrganization={isOrganization}
            />
        </Container>
    );
};

export default Auction;
