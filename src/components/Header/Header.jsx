import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/channels4_profile.jpg';

import { IoIosNotifications } from 'react-icons/io';
import './Header.scss';
import { Dropdown, Space, Avatar, List, Button, Drawer } from 'antd';
import { memo, useEffect, useState } from 'react';
import ModalNotification from '../Auth/ModalNotification';
import { useDispatch, useSelector } from 'react-redux';
import { doLogoutAction } from '../../redux/account/accountSlice';
import { callLogout, fetchAccount } from '../../services/api';
import { message, notification } from 'antd';
import axios from 'axios';
import { useDebounce } from 'use-debounce';
import { doSearch } from '../../redux/search/searchSlice';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { ActionIcon, HomeIcon, NewsIcon, SearchIcon, SearchNavbarIcon, NotificationIcon } from '../Icons';
import fetchProvinceName from '../../function/findProvince';
import useWindowSize from '../../hooks/useWindowSise';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search?';
const params = {
    format: 'json',
    addressdetails: 1,
    polygon_geojson: 1,
    countrycodes: 'VN',
};

const iconAvatar =
    'https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
    const datauser = useSelector((state) => state.account.dataUser);
    const user = useSelector((state) => state.account.Users);
    const [isShowModalLogin, setIsShowModalLogin] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [debouncedInputSearch] = useDebounce(searchQuery, 300);
    const [isLoading, setIsLoading] = useState(false);
    const [apiUser, setApiUser] = useState([]);
    const windowSize = useWindowSize();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    //User
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (datauser?.UserID) {
                    const response = await fetchAccount();
                    const fetchedUser = response.find((user) => user?.userid === datauser?.UserID);
                    fetchedUser && setApiUser(fetchedUser);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch user data',
                });
            }
        };
        fetchUserData();
    }, [datauser?.UserID]);

    let items = [
        {
            label: <Link to="/userprofile">Trang profile</Link>,
            key: 'userprofile',
        },

        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => handleLogOut()}>
                    Đăng xuất
                </label>
            ),
            key: 'logout',
        },
    ];
    if (datauser?.role === true) {
        items.unshift({
            label: <Link to="/admin">Trang quản trị</Link>,
            key: 'admin',
        });
    }

    const handleClose = () => {
        setIsShowModalLogin(false);
    };

    const handleLogOut = async () => {
        const { Username, Password } = user;
        const res = await callLogout(Username, Password);
        if (res) {
            dispatch(doLogoutAction());
            navigate('/');
            message.success('Đăng xuất thành công!');
        } else {
            notification.error({
                message: 'Có lỗi xáy ra',
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message[1],
                duration: 5,
            });
        }
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const { data } = await axios.get(
                `${NOMINATIM_BASE_URL}${new URLSearchParams({
                    ...params,
                    q: debouncedInputSearch,
                }).toString()}`,
            );
            const filteredData = data.filter((item) => item.geojson?.type === 'Polygon');

            handleSearchDispatch(filteredData[0]);
            setSearchQuery('');
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };
    // Search
    const handleSearchDispatch = async (item) => {
        try {
            const info = await fetchProvinceName(item.lat, item.lon);
            dispatch(
                doSearch({
                    displayName: item.display_name,
                    lat: item.lat,
                    lon: item.lon,
                    coordinates: item.geojson.coordinates,
                    boundingbox: item.boundingbox,
                    provinceName: info.provinceName,
                    districtName: info.districtName,
                }),
            );
            searchParams.set('vitri', `${item.lat},${item.lon}`);
            navigate({ search: searchParams.toString() });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const handleGetData = async () => {
            if (debouncedInputSearch) {
                try {
                    setIsLoading(true);
                    const { data } = await axios.get(
                        `${NOMINATIM_BASE_URL}${new URLSearchParams({
                            ...params,
                            q: debouncedInputSearch,
                        }).toString()}`,
                    );
                    const filteredData = data.filter((item) => item.geojson?.type === 'Polygon');
                    setSearchResult(filteredData);

                    setIsLoading(false);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setIsLoading(false);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSearchResult([]);
            }
        };

        handleGetData();
    }, [debouncedInputSearch]);

    const handleItemClick = (item) => {
        if (item) {
            handleSearchDispatch(item);
        }
        setSearchQuery('');
        // window.history.pushState({}, '', `/${item.name}`);
        // navigate(`/${item.name}`);
    };

    return (
        <>
            {windowSize.windowWidth > 768 ? (
                <Navbar bg="#262D34" className="header-container" expand="lg">
                    <Container>
                        <Navbar.Brand href="/">
                            <div className="header-logo">
                                <img
                                    src={logo}
                                    width="30"
                                    height="30"
                                    className="d-inline-block align-top header-logo-img"
                                    alt="React Bootstrap logo"
                                />
                                <span className="header-logo-content ml-2">LAND INVEST</span>
                            </div>
                        </Navbar.Brand>
                        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
                        <Navbar.Collapse id="basic-navbar-nav list-item">
                            <Nav className="list-item-icon">
                                <NavLink to="/" className="nav-link">
                                    <HomeIcon />
                                </NavLink>
                                {/* <NavLink to="/planMap" className="nav-link">
                               <FaMap />
                           </NavLink> */}
                                <NavLink to="/notifications" className="nav-link">
                                    <NotificationIcon />
                                </NavLink>
                                <NavLink to="/news" className="nav-link">
                                    <NewsIcon />
                                </NavLink>
                                <NavLink to="/search" className="nav-link">
                                    <SearchNavbarIcon />
                                </NavLink>
                                <NavLink to="/auctions" className="nav-link">
                                    <ActionIcon />
                                </NavLink>
                            </Nav>
                            <form className="header-search" onSubmit={handleSearchSubmit}>
                                <input
                                    type="text"
                                    placeholder="Tìm địa chỉ.."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {isLoading && <AiOutlineLoading3Quarters className="loading" />}
                                <button type="submit">
                                    <SearchIcon />
                                </button>
                                {searchResult.length > 0 && (
                                    <List
                                        bordered
                                        className="list--search"
                                        dataSource={searchResult}
                                        renderItem={(item) => (
                                            <List.Item className="list--item" onClick={() => handleItemClick(item)}>
                                                {item.display_name}
                                            </List.Item>
                                        )}
                                    />
                                )}
                            </form>

                            <div id="basic-navbar-nav">
                                <div className="header-right">
                                    <div className="header-notification">
                                        <IoIosNotifications size={24} />
                                    </div>
                                    {!isAuthenticated ? (
                                        <button className="btn" onClick={() => setIsShowModalLogin(true)}>
                                            Đăng nhập
                                        </button>
                                    ) : (
                                        <Dropdown menu={{ items }} trigger={['click']}>
                                            <button
                                                style={{
                                                    color: '#fff',
                                                    cursor: 'pointer',
                                                    background: 'none',
                                                    border: 'none',
                                                    padding: 0,
                                                }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                }}
                                            >
                                                <Space>
                                                    <Avatar src={apiUser?.avatarLink || iconAvatar} />
                                                    {apiUser?.FullName}
                                                </Space>
                                            </button>
                                        </Dropdown>
                                    )}
                                </div>
                            </div>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            ) : (
                <>
                    <div
                        style={{
                            background: '#262D34',
                            display: 'flex',
                            padding: '0 20px',
                            zIndex: 999999999999999,
                            paddingY: '10px',
                        }}
                        className="h-[100%] flex  bg-[#262D34] items-center justify-between"
                    >
                        <div className="flex items-center py-3">
                            <img
                                src={logo}
                                width="30"
                                height="30"
                                className="d-inline-block align-top header-logo-img"
                                alt="React Bootstrap logo"
                            />
                            <span
                                className="text-[12px]"
                                style={{ color: 'orange', padding: '7px', fontWeight: '700' }}
                            >
                                LAND INVEST
                            </span>
                        </div>
                        <div>
                            <form className="flex items-center" onSubmit={handleSearchSubmit}>
                                <input
                                    type="text"
                                    placeholder="Tìm địa chỉ.."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                <button type="submit">
                                    <SearchIcon />
                                </button>
                            </form>
                            <div
                                style={{
                                    position: 'fixed',
                                    backgroundColor: 'white',
                                    borderRadius: 4,
                                    boxShadow: '#ff571a',
                                    zIndex: 999999999999999,
                                    width: '100%',
                                }}
                            >
                                {searchResult.length > 0 && (
                                    <List
                                        bordered
                                        className="list--search"
                                        dataSource={searchResult}
                                        renderItem={(item) => (
                                            <List.Item className="list--item" onClick={() => handleItemClick(item)}>
                                                {item.display_name}
                                            </List.Item>
                                        )}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div
                        className="py-4"
                        style={{
                            height: '5vh',
                            background: '#262D34',
                            display: 'flex',
                            justifyContent: 'space-evenly',
                        }}
                    >
                        <NavLink to="/" className="nav-link">
                            <HomeIcon />
                        </NavLink>
                        <NavLink to="/notifications" className="nav-link">
                            <NotificationIcon />
                        </NavLink>
                        <NavLink to="/news" className="nav-link">
                            <NewsIcon />
                        </NavLink>
                        <NavLink to="/search" className="nav-link">
                            <SearchNavbarIcon />
                        </NavLink>
                        <NavLink to="/auctions" className="nav-link">
                            <ActionIcon />
                        </NavLink>
                        <NavLink to="/" className="nav-link">
                            <IoIosNotifications style={{ color: 'white' }} />
                        </NavLink>
                        {!isAuthenticated ? (
                            <button
                                className="text-[12px]"
                                style={{
                                    color: 'white',
                                    background: '#ff571a',
                                    borderRadius: '5px',
                                    border: '1px solid #ff571a',
                                    frontSize: '',
                                }}
                                onClick={() => setIsShowModalLogin(true)}
                            >
                                Đăng nhập
                            </button>
                        ) : (
                            <Dropdown menu={{ items }} trigger={['click']}>
                                <button
                                    style={{ color: '#fff', cursor: 'pointer' }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}
                                >
                                    <Space>
                                        <Avatar src={apiUser?.avatarLink || iconAvatar} />
                                        {apiUser?.FullName}
                                    </Space>
                                </button>
                            </Dropdown>
                        )}
                    </div>
                </>
            )}
            <ModalNotification show={isShowModalLogin} handleClose={handleClose} />
        </>
    );
};

export default memo(Header);
