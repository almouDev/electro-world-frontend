import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link} from "react-router-dom";
import React from "react";

function NavScrollExample() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary bg-warning">
            <Container fluid>
                <Navbar.Brand href="#">AlmouShop</Navbar.Brand>
                <Form className="d-flex">
                    <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                    />
                </Form>
                <Navbar.Toggle className="text-white" aria-controls="navbarScroll" />

                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link href="#">
                            Produits
                        </Nav.Link>
                        <Nav.Link href="#">
                            Contact
                        </Nav.Link>
                        <div className="icons d-flex m-1">
                            <div><span className="fas fa-user"></span></div>
                            <div><Link to="/panier" className="fas  fa-shopping-cart nav-link"><span className="text-danger"></span></Link></div>
                        </div>
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export  function Welcome(){
    return <>
        <NavScrollExample/>
    </>
}

export default NavScrollExample;