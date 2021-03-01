import {useState} from 'react';
import {Modal, Button, Form, Alert} from 'react-bootstrap';
import { useAuthentication } from "../context/authenticationContext";



const RegisterModal = ({show, close}) => {
  const { register } = useAuthentication();
  const [showAlert, setShowAlert] = useState(false);
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
    } 
    else 
    {
     
      const result = await register({email, password})
      console.log(result)
      if(result.res === true){
        close();
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
            <Modal.Title>Register</Modal.Title>
          </Modal.Header>
          
          <Modal.Body>

          <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label id='email'
                    type='email'
                    value={email}
                    required>Email address
                </Form.Label>
                <Form.Control onChange={onChange} name='email' type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
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

              <Button variant="primary" type="submit">
                Register
              </Button>
            </Form>
          
            <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
              <Alert.Heading>
                  <span>Please fill out fields</span>
              </Alert.Heading>
            </Alert>

          </Modal.Body>
          
          <Modal.Footer>

          </Modal.Footer>
        </Modal>
      </>
    );
}
export default RegisterModal;