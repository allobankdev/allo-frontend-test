import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { BsRocketTakeoff } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'
import { styles } from './style'

function NavbarComponent() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <>
                    <Navbar.Brand href="/" style={styles?.navBrands}>
                        <BsRocketTakeoff size={25} />
                        {' '}
                        OrbitalSpecs
                    </Navbar.Brand>
                </>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink style={styles?.navLinkStyle} to='/' >Home</NavLink>
                        <NavLink style={styles?.navLinkStyle} to='/list-rocket/' >List Rockets</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavbarComponent
