import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.css';
import Icon from '../icons/Icon'
import { useAuthentication } from "../context/authenticationContext";
import LoginModal from './loginModal'
import RegisterModal from './registerModal'
import {useState} from "react"
import AboutModal from "./aboutModal"

function NavBar() {
    const { authentication, logout } = useAuthentication();
    const [showLogin, setLoginShow] = useState(false);
    const [showRegister, setRegisterShow] = useState(false);
    const [showAbout, setAboutShow] = useState(true);
    const closeModalLogin = () => setLoginShow(false);
    const closeModalRegiser = () => setRegisterShow(false);
    const closeModalAbout = () => setAboutShow(false);

    return (
        <div className='topnavbar'>     
          <LoginModal show={showLogin} close={closeModalLogin} />
          <RegisterModal show={showRegister} close={closeModalRegiser} />
          <AboutModal show={showAbout} close={closeModalAbout} />

          <Navbar bg="dark" variant="dark">
          <Icon width={35} height={35} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"  />
          <Navbar.Brand href="#home">Map Historian</Navbar.Brand>      
          
          <Nav className="mr-auto">
            {authentication.isAuthenticated ? null : <Nav.Link onClick={() => setLoginShow(true)}>Login</Nav.Link>}
            {authentication.isAuthenticated ? null : <Nav.Link  onClick={() => setRegisterShow(true)}>Register</Nav.Link>}
            {authentication.isAuthenticated ?  <Nav.Link onClick={() => logout()}>Logout</Nav.Link> : null}
            <Nav.Link  onClick={() => setAboutShow(true)}>About</Nav.Link>
          </Nav>

          <Navbar.Collapse className="justify-content-end">

          {authentication.isAuthenticated ? 
            <Navbar.Text>
              Signed in as: <a>{authentication.user}</a>
            </Navbar.Text> 
          : null}

          </Navbar.Collapse>

        </Navbar>
        </div>
    ) 
} 
export default NavBar;