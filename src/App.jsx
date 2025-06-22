import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Manage from "./pages/Manage.jsx";
import NavbarPage from "./pages/Navbar.jsx";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Navbar
          collapseOnSelect
          expand="lg"
          className="bg-body-tertiary w-full fixed-top"
        >
          <Container fluid className="w-full">
            <Navbar.Brand as={Link} to="/">
              MemberApp
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/manage">
                  Manage
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div className="pt-5 mt-5 px-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manage" element={<Manage />} />
            <Route path="/navbar" element={<NavbarPage />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
