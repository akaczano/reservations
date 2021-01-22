import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './Navbar.css';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';

function AppNav(props) {

    const getAuthLink = () => {
        if (props.authorized) {
            return (
                <Nav.Link onClick={ () => props.logoutUser() }>
                    <span className="nav-text">Logout</span>
                </Nav.Link>
            );
        }
        else {
            return (
                <Nav.Link href="/login" >
                    <span className="nav-text">Login</span>
                </Nav.Link>
            );
        }
    }

    const getAdminLinks = () => {
        if (props.authorized) {
            return (
                <Nav.Link href="/admin">
                    <span className="nav-text">Admin</span>
                </Nav.Link>
            )
        }
    }

    return (
        <Navbar className="app-nav" expand="lg">
            <Navbar.Brand href="/">
                <span className="nav-text">St. Thomas Reservations</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
                <Nav className="mr-auto">
                    <Nav.Link href="/">
                        <span className="nav-text">Mass List</span>
                    </Nav.Link>
                    <Nav.Link href="/info">
                        <span className="nav-text">Information</span>
                    </Nav.Link>      
                    {getAdminLinks()}              
                </Nav>
                <Nav className="ml-auto">
                    {getAuthLink()}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )

}

const mapStateToProps = state => {
    return {
        authorized: state.auth.isAuthenticated
    }
};

export default connect(mapStateToProps, { logoutUser })(AppNav);