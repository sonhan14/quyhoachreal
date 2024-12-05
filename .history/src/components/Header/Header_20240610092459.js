import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, NavLink } from "react-router-dom";
import logo from '../../assets/channels4_profile.jpg'
import './Header.scss'
const Header = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Container className='header-container'>
                <Navbar.Brand href="#home">
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
                    <Nav className="me-auto list-item-icon">
                        <NavLink to="/" className='nav-link'>Home</NavLink>
                        <NavLink to="/users" className='nav-link'>User</NavLink>
                        <NavLink to="/admins" className='nav-link'>Admin</NavLink>
                        <Nav.Link href="/test" className='nav-link'>test</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;