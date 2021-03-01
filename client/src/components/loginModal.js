import {useState} from 'react';
import {Modal, Button, Form, Tab, Row, Col, Nav, Alert} from 'react-bootstrap';
import { useAuthentication } from "../context/authenticationContext";


const LoginModal = ({show, close}) => {
  const { login, forgotPassword } = useAuthentication();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);

  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  const { email, password } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    if (email === '' || password === '') {
      setShowAlert(true)
      setAlertMessage("Please fill out all fields")
    } 
    else 
    {
      const result = await login({email, password})
      console.log(result)
      if(result.res === true){
        close();
      }else{
        // Error in logging in!
        setShowAlert(true)
        setAlertMessage("Login failed")
        console.log(result.msg);
      }
    }
  }


  const handleSubmitForgot = async e => {
    e.preventDefault();
    if (email === '') {
      setShowAlert(true)
      setAlertMessage("Missing email")
    } 
    else 
    {
      const result = await forgotPassword({email})
      console.log(result)
      if(result.res === true){
        setShowAlert(true)
        setAlertMessage("Email sent, check your inbox")
      }else{
        // Error in logging in!
        console.log(result.msg);
      }
    }
  }

  return (
      <>
        <Modal show={show} onHide={close}>
          <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          
          <Modal.Body>


          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column" >
                <Nav.Item>
                  <Nav.Link onClick={() => setShowAlert(false)} eventKey="first">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link onClick={() => setShowAlert(false)} eventKey="second">Forgot Password</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <Form onSubmit={handleSubmit}>
                          <Form.Group controlId="formBasicEmail">
                            <Form.Label id='email'
                                type='email'
                                value={email}
                                required>Email address
                            </Form.Label>
                            <Form.Control onChange={onChange} name='email' type="email" placeholder="Enter email" />
                          </Form.Group>

                          <Form.Group controlId="formBasicPassword">
                            <Form.Label
                              id='password'
                              type='password'
                              name='password'
                              value={password}
                              onChange={onChange}
                              required
                            >Password</Form.Label>
                            <Form.Control onChange={onChange} name='password' type="password" placeholder="Password" />
                          </Form.Group>
                          
                          <hr />

                          <Button variant="success" type="submit">
                            Login
                          </Button>
                    </Form>             
                </Tab.Pane>


                <Tab.Pane eventKey="second">

                <Form onSubmit={handleSubmitForgot}>
                          <Form.Group controlId="formBasicEmail">
                            <Form.Label id='email'
                                type='email'
                                value={email}
                                required>Email address
                            </Form.Label>
                            <Form.Control onChange={onChange} name='email' type="email" placeholder="Enter email" />
                          </Form.Group>
                          
                          <Button variant="success" type="submit">
                          Forgot password
                          </Button>
                  </Form>  
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>

          <hr />
          <Alert show={showAlert} variant={'success'}>   
                    <Alert.Heading>{alertMessage}</Alert.Heading>
                  </Alert>
        </Tab.Container>


          </Modal.Body>
          <Modal.Footer>
  
          </Modal.Footer>
        </Modal>
      </>
    );
}
export default LoginModal;