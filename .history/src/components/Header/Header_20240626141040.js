import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from '../../assets/channels4_profile.jpg'
import { IoMdHome } from "react-icons/io";
import { GrAnnounce } from "react-icons/gr";
import { HiMiniUserGroup } from "react-icons/hi2";
import { FaSearchLocation } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import './Header.scss'
import { useEffect, useState } from 'react';
import ModalNotification from '../Auth/ModalNotification';
import { useDispatch, useSelector } from 'react-redux';
import { doLogoutAction } from '../../redux/account/accountSlice';
import { callLogout, logoutUser, searchQueryAPI } from '../../services/api';
import { message, notification } from 'antd';
const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const user = useSelector(state => state.account.Users);
    // console.log("user type: ", typeof users);
    const [isShowModalLogin, setIsShowModalLogin] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const handleClose = () => {
        setIsShowModalLogin(false);
    }

    function getCookie(cookieName) {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === cookieName) {
                return value;
            }
        }
        return null;
    }

    const handleLogOut =  async() => {

        try {
            const response = await callLogout()
            // localStorage.removeItem('access_token');
            // localStorage.removeItem('refresh_token');
            dispatch(doLogoutAction(response.data));
            console.log("refresh_token logout",localStorage.getItem('refresh_token'))
            console.log("access_token logout",localStorage.getItem('access_token'))
            // response.headers= {
            //     'Authorization': `Bearer ${getCookie('access_token_cookie')}`
            // }
            // console.log("response.headers",response.headers)

            message.success('Đăng xuất thành công!');
            navigate('/login');
            // console.log('response logout results:', response);

        } catch (error) {
            console.error('Search error:', error);
        }
        
      };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        if (searchQuery.trim() !== '') {
            try {
                const response = await searchQueryAPI(searchQuery);
                console.log('Search results:', response.data);

            } catch (error) {
                console.error('Search error:', error);
            }
            setSearchQuery('');
        }
    };
    return (
        <>
            <Navbar bg="#262D34" className='header-container'  expand="lg">
                <Container >
                    <Navbar.Brand href="/">
                        <div className='header-logo'>
                            <img
                                src={logo}
                                width="30"
                                height="30"
                                className="d-inline-block align-top header-logo-img"
                                alt="React Bootstrap logo"
                            />
                            <span className='header-logo-content ml-2'>LAND INVEST</span>
                        </div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav list-item">
                        <Nav className="list-item-icon">
                            <NavLink to="/" className='nav-link'>
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.3441 7.5198L10.8801 0.339514C10.639 0.121018 10.3253 0 9.99995 0C9.6746 0 9.36087 0.121018 9.1198 0.339514L0.656711 7.5199C0.450055 7.70713 0.284894 7.93555 0.17186 8.19047C0.0588252 8.44538 0.000422848 8.72115 0.000411987 9L0.000411987 19.3357C0.000411985 19.5119 0.0703844 19.6808 0.194943 19.8054C0.319502 19.93 0.488449 20 0.664615 20L6.00041 20C6.5527 20 7.00041 19.5523 7.00041 19V15C7.00041 14.436 7.5525 13.9788 8.1167 13.9788H11.8832C12.4475 13.9788 13.0004 14.436 13.0004 15V19C13.0004 19.5523 13.4481 20 14.0004 20H19.3362C19.5124 20 19.6813 19.93 19.8059 19.8054C19.9304 19.6808 20.0004 19.5119 20.0004 19.3357V9C20.0004 8.72114 19.9419 8.44537 19.8289 8.19044C19.7159 7.93551 19.5507 7.70707 19.3441 7.5198Z" fill="white"/>
                                </svg>
                            </NavLink>
                            <NavLink to="/auction" className='nav-link'>
                            <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_4194_13561)">
                                <path d="M11.2854 5.88788L17.3475 16.3875" stroke="white" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"/>
                                <path d="M17.03 15.8359L2.08657 19.3058L1.12946 17.6479L11.6062 6.44147" stroke="white" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"/>
                                <path d="M5.33733 18.5501L6.16017 19.9752C6.45868 20.4869 6.9482 20.859 7.52105 21.0097C8.09388 21.1602 8.70312 21.0773 9.21473 20.7787C9.72636 20.4803 10.0984 19.9908 10.2491 19.4178C10.3998 18.845 10.3168 18.2358 10.0183 17.7241L9.88649 17.496" stroke="white" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"/>
                                <path d="M11.6977 2.88669V0.916931" stroke="white" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"/>
                                <path d="M19.2445 10.4337H21.2143" stroke="white" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"/>
                                <path d="M2.18229 10.4337H4.15204" stroke="white" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"/>
                                <path d="M4.96751 3.70435L6.36034 5.09718" stroke="white" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"/>
                                <path d="M17.0343 5.097L18.427 3.70416" stroke="white" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_4194_13561">
                                <rect width="22" height="22" fill="white"/>
                                </clipPath>
                                </defs>
                                </svg>
                            </NavLink>
                            <NavLink to="/news" className='nav-link'>
                            <svg width="20" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="10.0422" cy="15" rx="6" ry="3" fill="#F4F6F8"/>
                                <circle cx="10.0422" cy="6" r="4" fill="#F4F6F8"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29224 3.46824C4.24608 4.0734 3.54224 5.20451 3.54224 6.5C3.54224 7.79549 4.24608 8.9266 5.29224 9.53176C4.77743 9.82956 4.17974 10 3.54224 10C1.60924 10 0.0422363 8.433 0.0422363 6.5C0.0422363 4.567 1.60924 3 3.54224 3C4.17974 3 4.77743 3.17044 5.29224 3.46824Z" fill="#F4F6F8"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.7922 3.46824C15.8384 4.0734 16.5422 5.20451 16.5422 6.5C16.5422 7.79549 15.8384 8.9266 14.7922 9.53176C15.307 9.82956 15.9047 10 16.5422 10C18.4752 10 20.0422 8.433 20.0422 6.5C20.0422 4.567 18.4752 3 16.5422 3C15.9047 3 15.307 3.17044 14.7922 3.46824Z" fill="#F4F6F8"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5421 12C15.5421 12 15.5422 12 15.5422 12C16.9229 12 18.0422 13.1193 18.0422 14.5C18.0422 15.0628 17.8563 15.5822 17.5424 16C18.923 15.9999 20.0422 14.8807 20.0422 13.5C20.0422 12.1193 18.9229 11 17.5422 11C16.7243 11 15.9982 11.3928 15.5421 12Z" fill="#F4F6F8"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.54242 12C4.54236 12 4.5423 12 4.54224 12C3.16152 12 2.04224 13.1193 2.04224 14.5C2.04224 15.0628 2.22821 15.5822 2.54206 16C1.16143 15.9999 0.0422363 14.8807 0.0422363 13.5C0.0422363 12.1193 1.16152 11 2.54224 11C3.36015 11 4.08632 11.3928 4.54242 12Z" fill="#F4F6F8"/>
                                </svg>
                            </NavLink>
                            <NavLink to="/search" className='nav-link'><svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_4194_13573)">
                                <path d="M9.42469 17.9633C14.2098 17.9633 18.0889 14.1529 18.0889 9.4526C18.0889 4.75226 14.2098 0.941895 9.42469 0.941895C4.63958 0.941895 0.760494 4.75226 0.760494 9.4526C0.760494 14.1529 4.63958 17.9633 9.42469 17.9633Z" stroke="white" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"/>
                                <path d="M21.2395 21.0581L15.7259 15.6422" stroke="white" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"/>
                                <g clipPath="url(#clip1_4194_13573)">
                                <path d="M10.6764 14.0938H5.49994V7.5625L8.08817 5.15625L10.6764 7.5625V14.0938Z" stroke="white" strokeLinecap="round" stroke-linejoin="round"/>
                                <path d="M10.6764 14.0938H13.9117V9.28125H10.6764" stroke="white" strokeLinecap="round" stroke-linejoin="round"/>
                                <path d="M8.08817 14.0938V12.7188" stroke="white" strokeLinecap="round" stroke-linejoin="round"/>
                                <path d="M7.11759 10.6562H9.05876" stroke="white" strokeLinecap="round" stroke-linejoin="round"/>
                                <path d="M7.11759 8.59375H9.05876" stroke="white" strokeLinecap="round" stroke-linejoin="round"/>
                                </g>
                                </g>
                                <defs>
                                <clipPath id="clip0_4194_13573">
                                <rect width="22" height="22" fill="white"/>
                                </clipPath>
                                <clipPath id="clip1_4194_13573">
                                <rect width="9.05882" height="9.625" fill="white" transform="translate(5.17641 4.8125)"/>
                                </clipPath>
                                </defs>
                                </svg>
                            </NavLink>
                        </Nav>
                        <form className='header-search' onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                placeholder='Type here to search...'
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSearchSubmit(e);
                                    }
                                }}
                            />
                            <button type="submit" >
                            <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="10" cy="9" r="8" stroke="#858EAD" strokeWidth="2"/>
                                <path d="M15.5 15.5L19.5 19.5" stroke="#858EAD" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                         
                            </button>
                        </form>
    
                       
                    </Navbar.Collapse>
                    <Navbar.Collapse id="basic-navbar-nav">
                    <div className='header-right'>
                        <div className='header-notification'>
                            <IoIosNotifications size={24}/>
                        </div>
                        {
                            !isAuthenticated ?
                            <button className='btn' onClick={()=>setIsShowModalLogin(true)}>Đăng nhập</button>
                            :
                            <>
                            <span style={{color:"#fff"}}><span style={{marginLeft:"2px"}}>{user.Username}</span></span>
                            <button className='btn' onClick={()=>handleLogOut()}>Đăng xuất</button>
                            </>
                        }
                        
                    </div>
                    </Navbar.Collapse>
                    
                </Container>
            </Navbar>
            <ModalNotification 
                show={isShowModalLogin}
                handleClose={handleClose}
            />
        </>
    );
}

export default Header;