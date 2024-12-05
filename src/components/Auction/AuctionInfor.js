import React, { useEffect, useState } from 'react';
import './Auction.scss';
import { Button, Container } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchAuctionInfor } from '../../services/api';
//import slider
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import ModalComponent from './ModalComponent/ModalComponent';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { LayersControl, MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import VideoPlayer from './VideoPlayer/VideoPlayer';
import ListComment from './ListComment/ListComment';

const AuctionInfor = () => {
    // state
    const { LandAuctionID } = useParams();
    const [auctionInfor, setAuctionInfor] = useState(null);
    const [isShowModalComment, setIsShowModalComment] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const { BaseLayer } = LayersControl;
    const hanoiCoordinates = [21.0285, 105.8542]; // toa do ha noi

    const navigate = useNavigate();

    useEffect(() => {
        const getAuctionInfor = async () => {
            const result = await fetchAuctionInfor(LandAuctionID);
            setAuctionInfor(result);
        };
        getAuctionInfor();
    }, [LandAuctionID]);

    //Đồi ngày giờ IOS sang giờ ngày tháng năm
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatDateHour = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}  ${day}/${month}/${year}`;
    };

    //Dinh dang tien te
    const fotmatPrice = (number) => Math.round(number / 1000) * 1000;
    const formatMoney = (number) => Number(number?.toFixed(1)).toLocaleString();

    //Slider images
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 1023,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 766,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
        ],
    };

    //handle exit
    const handleExit = () => {
        navigate('/auctions');
    };

    //handle show modal
    const handleShowModal = () => {
        setIsShowModalComment(true);
    };
    const closeModal = () => {
        setIsShowModalComment(false);
    };

    const CloseModal = () => {
        closeModal();
    };

    //map ve tinh
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
        <Container className="infor-container">
            <span onClick={handleExit} className="icon-exit">
                <FaArrowAltCircleLeft />
            </span>
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
            <div className="auction-infor-content">
                {auctionInfor &&
                    auctionInfor.map((e, index) => (
                        <div className="result-infor">
                            <h4>{e.Title}</h4>
                            <div className="tablet-note-auction">
                                <p>
                                    Ghi chú: <span>{e.Note}</span>
                                </p>
                                <p>
                                    Lần đăng: <span>{e.PostTime}</span>
                                </p>
                                <p>
                                    Ngày đăng công khai: <span>{formatDate(e.CreateAt)}</span>
                                </p>
                            </div>
                            <div className="content-infor">
                                <div className="infor-item">
                                    <h5>Thông tin người có tài sản</h5>
                                    <div className="infor-owners">
                                        <p>Tên người có tài sản: {e.NamePropertyOwner}</p>
                                        <p>Địa chỉ: {e.AddressPropertyOwner}</p>
                                    </div>
                                </div>
                                <div className="infor-item">
                                    <h5>Thông tin đơn vị tổ chức đấu giá</h5>
                                    <div className="infor-owners">
                                        <p>Tên đơn vị tổ chức đấu giá: {e.NameAuctionHouse}</p>
                                        <p>Địa chỉ: {e.AddressAuctionHouse}</p>
                                        <p>
                                            số điện thoại: {e.PhoneNumberAuctionHouse} <span>Fax: </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="infor-item">
                                    <h5>Thông tin việc đấu giá</h5>
                                    <div className="infor-owners">
                                        <p>Thời gian tổ chức cuộc đấu giá: {formatDate(e.EventSchedule)}</p>
                                        <p>Đơn vị tổ chức đấu giá: {e.NameAuctionHouse}</p>
                                    </div>
                                </div>
                                <div className="news-board">
                                    <table className="auction-results-table">
                                        <thead className="auction-results-thead">
                                            <tr className="auction-result-row-thead">
                                                <th>Stt</th>
                                                <th>Tên tài sản</th>
                                                <th>Số lượng</th>
                                                <th>Nơi có tài sản</th>
                                                <th>Giá khởi điểm</th>
                                                <th>Tiền đặt trước</th>
                                                <th>Ghi chú</th>
                                            </tr>
                                        </thead>
                                        <tbody className="auction-result-row-body">
                                            <tr className="auction-result-row-tbody">
                                                <td>{index + 1}</td>
                                                <td>{e.NameProperty}</td>
                                                <td></td>
                                                <td>{e.AddressProperty}</td>
                                                <td>{`${formatMoney(fotmatPrice(e.OpenPrice))} VNĐ`}</td>
                                                <td>{e.DepositPrice}</td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="time-auction">
                                    <p>
                                        Thời Gian Bắt Đầu Đăng Ký Tham Gia Đấu Giá:{' '}
                                        {`${formatDateHour(e.RegistrationStartTime)}`}{' '}
                                    </p>
                                    <p>
                                        Thời Gian Kết Thúc Đăng Ký Tham Gia Đấu Giá:{' '}
                                        {`${formatDateHour(e.RegistrationEndTime)}`}
                                    </p>
                                </div>
                                <div className="condition-auction">
                                    <p>Địa điểm, điều kiện, cách thức đăng ký: </p>
                                    <span>{e.Description}</span>
                                </div>
                                <div className="time-auction">
                                    <p>
                                        Thời gian bắt đầu nộp tiền đặt trước:{' '}
                                        {`${formatDateHour(e.DepositPaymentStartTime)}`}{' '}
                                    </p>
                                    <p>
                                        Thời gian kết thúc nộp tiền đặt trước:{' '}
                                        {`${formatDateHour(e.DepositPaymentEndTime)}`}
                                    </p>
                                </div>
                                <p>
                                    Link Chi Tiết:{' '}
                                    <Link to={e.AuctionUrl} className="link-auction">
                                        {e.AuctionUrl}
                                    </Link>
                                </p>
                                <div className="image-slider">
                                    <Slider {...settings}>
                                        {e.Images.map((image, index) => (
                                            <div key={index} className="slider-item">
                                                <img
                                                    src={image.Image}
                                                    alt={`Slide ${index + 1}`}
                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                                <div className="map-video-infor">
                                    {/* map */}
                                    <div className="map-container">
                                        <MapContainer
                                            center={hanoiCoordinates}
                                            zoom={13}
                                            style={{ height: '100%', width: '100%' }}
                                        >
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
                                                        url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                                                        attribution='&copy; <a href="https://maps.google.com">Google Maps</a> contributors'
                                                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                                    />
                                                </BaseLayer>
                                            </LayersControl>
                                        </MapContainer>
                                    </div>
                                    {/* video */}
                                    <div className="video-container">
                                        {e.Videos.map((item, index) => (
                                            <VideoPlayer key={index} videoUrl={item.Video} />
                                        ))}
                                    </div>
                                </div>
                                <div className="infor-item">
                                    <h5>Thông tin thẩm định, đánh giá</h5>
                                    <div className="box-comment">
                                        <textarea onClick={handleShowModal} readOnly></textarea>
                                    </div>
                                    {isShowModalComment && (
                                        <ModalComponent CloseModal={CloseModal} IDAuction={LandAuctionID} />
                                    )}
                                </div>
                            </div>
                            <div className="infor-item list-comment">
                                <div className="list-comment-item">
                                    <ListComment IDAuction={LandAuctionID} />
                                </div>
                            </div>
                            <Button variant="primary" type="submit" onClick={handleExit}>
                                Quay lại
                            </Button>
                            <div className=" infortest">
                                <p></p>
                            </div>
                        </div>
                    ))}
            </div>
        </Container>
    );
};

export default AuctionInfor;
