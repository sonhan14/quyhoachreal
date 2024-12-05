import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import './Auction.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import { LayersControl, MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';

const AuctionSearch = ({
    formData,
    handleChange,
    handleSubmit,
    province,
    district,
    hanoiCoordinates,
    auctionResults,
    setSelectedProvinceId,
    formatDate,
    loading,
    isOrganization,
}) => {
    // UseState
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    const [selectedLocation, setSelectedLocation] = useState(null); // State để lưu trữ vị trí được chọn trên bản đồ
    const { BaseLayer } = LayersControl;
    const navigate = useNavigate();
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentItems = auctionResults.slice(indexOfFirstItem, indexOfLastItem);

    const handleClick = (LandAuctionID) => {
        navigate(`/auctions/information/${LandAuctionID}`);
    };

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e?.latlng;
                setSelectedLocation([lat, lng]);
            },
        });
        return null;
    };

    return (
        <Container className=" m-0 p-0">
            <div className=" auction-content">
                {/* Auction Map */}
                <div className="auction-map">
                    <MapContainer center={hanoiCoordinates} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <MapEvents />
                        <LayersControl>
                            <BaseLayer checked name="Map mặc định">
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            </BaseLayer>
                            <BaseLayer name="Map vệ tinh">
                                <TileLayer
                                    url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                    attribution='&copy; <a href="https://maps.google.com">Google Maps</a> contributors'
                                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                />
                            </BaseLayer>
                        </LayersControl>
                    </MapContainer>
                </div>
                {/* Auction Form */}
                <div className="auction-form">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs={12} sm={12}>
                                <Form.Group as={Row} className="mb-2" controlId="formAssetName">
                                    <Form.Label column sm={2}>
                                        Tên tài sản
                                    </Form.Label>
                                    <Col sm={10}>
                                        <Form.Control
                                            type="text"
                                            name="assetName"
                                            value={formData.assetName}
                                            onChange={handleChange}
                                            placeholder="Tên tài sản"
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                            {/* left */}
                            <Col sm={6}>
                                <Form.Group as={Row} className="mb-2" controlId="formOrganization">
                                    <Form.Label column sm={4}>
                                        Tổ chức ĐGTS
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            as="select"
                                            name="organization"
                                            value={formData.organization}
                                            onChange={handleChange}
                                        >
                                            <option value={null}>Tất cả</option>
                                            {isOrganization.map((item, index) => (
                                                <option key={index} value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-2" controlId="formFromDateAuction">
                                    <Form.Label column sm={4}>
                                        Từ ngày
                                    </Form.Label>
                                    <Col sm={8}>
                                        <DatePicker
                                            selected={
                                                formData.fromDateAuction ? new Date(formData.fromDateAuction) : null
                                            }
                                            onChange={(date) =>
                                                handleChange({ target: { name: 'fromDateAuction', value: date } })
                                            }
                                            placeholderText="Thời gian tổ chức việc đấu giá"
                                            className="form-control"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-2" controlId="formToDateAuction">
                                    <Form.Label column sm={4}>
                                        Đến ngày
                                    </Form.Label>
                                    <Col sm={8}>
                                        <DatePicker
                                            selected={formData.toDateAuction ? new Date(formData.toDateAuction) : null}
                                            onChange={(date) =>
                                                handleChange({ target: { name: 'toDateAuction', value: date } })
                                            }
                                            placeholderText="Thời gian tổ chức việc đấu giá"
                                            className="form-control"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-2" controlId="formFromPrice">
                                    <Form.Label column sm={4}>
                                        Giá khởi điểm từ
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="number"
                                            name="fromPrice"
                                            value={formData.fromPrice}
                                            onChange={handleChange}
                                            placeholder="Giá khởi điểm từ"
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-2" controlId="formToPrice">
                                    <Form.Label column sm={4}>
                                        Giá khởi điểm đến
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="number"
                                            name="toPrice"
                                            value={formData.toPrice}
                                            onChange={handleChange}
                                            placeholder="Giá khởi điểm đến"
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-2" controlId="formSortOption">
                                    <Form.Label column sm={4}>
                                        Tiêu chí sắp xếp
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            as="select"
                                            name="sortOption"
                                            value={formData.sortOption}
                                            onChange={handleChange}
                                        >
                                            <option value="Ngày công khai việc đấu giá">
                                                Ngày công khai việc đấu giá
                                            </option>
                                            <option value="Ngày công khai việc đấu giá">Ngày tổ chức đấu giá</option>
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
                            </Col>
                            {/* right */}
                            <Col sm={6}>
                                <Form.Group as={Row} className="mb-2" controlId="formOwnerName">
                                    <Form.Label column sm={4}>
                                        Người có tài sản
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                            placeholder="Họ và tên người có tài sản"
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-2" controlId="formProvince">
                                    <Form.Label column sm={4}>
                                        Tỉnh thành
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            as="select"
                                            name="province"
                                            value={formData.province}
                                            onChange={(e) => {
                                                const selectedProvinceName = e.target.value;
                                                setSelectedProvinceId(
                                                    province.find((p) => p.TenTinhThanhPho === selectedProvinceName)
                                                        ?.TinhThanhPhoID || '',
                                                );
                                                handleChange(e);
                                            }}
                                        >
                                            <option value={null}>Tất cả</option>
                                            {province.map((province, index) => (
                                                <option key={index} value={province.TenTinhThanhPho}>
                                                    {province.TenTinhThanhPho}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-2" controlId="formDistrict">
                                    <Form.Label column sm={4}>
                                        Quận/huyện
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            as="select"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            disabled={!formData.province}
                                        >
                                            <option value={null}>Tất cả</option>
                                            {district.map((district, index) => (
                                                <option key={index} value={district.DistrictName}>
                                                    {district.DistrictName}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-2" controlId="formFromDateAnnouncement">
                                    <Form.Label column sm={4}>
                                        Từ ngày
                                    </Form.Label>
                                    <Col sm={8}>
                                        <DatePicker
                                            selected={
                                                formData.fromDateAnnouncement
                                                    ? new Date(formData.fromDateAnnouncement)
                                                    : null
                                            }
                                            onChange={(date) =>
                                                handleChange({ target: { name: 'fromDateAnnouncement', value: date } })
                                            }
                                            placeholderText="Thời gian công khai việc đấu giá"
                                            className="form-control"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-2" controlId="formToDateAnnouncement">
                                    <Form.Label column sm={4}>
                                        Đến ngày
                                    </Form.Label>
                                    <Col sm={8}>
                                        <DatePicker
                                            selected={
                                                formData.toDateAnnouncement
                                                    ? new Date(formData.toDateAnnouncement)
                                                    : null
                                            }
                                            onChange={(date) =>
                                                handleChange({ target: { name: 'toDateAnnouncement', value: date } })
                                            }
                                            placeholderText="Thời gian công khai việc đấu giá"
                                            className="form-control"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="btn-search">
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Loading...' : 'Tìm kiếm'}
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            <div className="search-results">
                <div className="text-search">
                    <h2>Danh sách tìm kiếm</h2>
                </div>
                <div className="pagination-container">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={auctionResults.length}
                        onChange={handlePageChange}
                    />
                </div>
                <div className="list-search-result">
                    {currentItems.length > 0 ? (
                        currentItems.map((e, index) => (
                            <div className="search-container" key={index} onClick={() => handleClick(e.LandAuctionID)}>
                                <div className="description-search">
                                    <p>{e.Title}</p>
                                    <span className="time-auction">
                                        <label>
                                            (Đăng ký tham gia đấu giá từ {formatDate(e.RegistrationStartTime)} đến{' '}
                                            {formatDate(e.RegistrationEndTime)}; Thời gian tổ chức đấu giá:{' '}
                                            {formatDate(e.EventSchedule)})
                                        </label>
                                    </span>
                                </div>
                                <div className="img-search">
                                    {e.Images.map((item, index) => (
                                        <img key={index} src={item.Image} alt={`auction ${index}`} />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Không có bản ghi</p>
                    )}
                </div>
                <div style={{ height: '300px' }}></div>
            </div>
        </Container>
    );
};

export default AuctionSearch;
