import {useState} from 'react';
import {Button, Form, Jumbotron, Row, Col, Container, Alert} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string';

function Reset() {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [error, setError] = useState(false);
    const query = queryString.parse(window.location.search);


    const [user, setUser] = useState({
        password: ''
      });
      const { password } = user;  
      const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });


      const handleSubmit = async e => {
        e.preventDefault();


       
        if (password === '') {
          //setAlert('Please fill in all fields', 'danger');    // Use alert from react-bootstrap
        } 
        else 
        {
            // reset password by token
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                    }
            };         
            try {
                await axios.put(`/auth/resetPassword/${query.token}`, {password: password}, config);  
                setShow(true)      
            } catch (err) {
                // Error
                setShow(true) 
                setError(true);
            }
            

        }
      }

    return (
        <div>           
            <Container fluid="md">
            <Row>
                <Col>

                    <Jumbotron>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label
                            id="inputPassword5"
                            aria-describedby="passwordHelpBlock"
                            type='password'
                            name='password'
                            value={password}
                            onChange={onChange}
                            required
                            >Enter your new password here</Form.Label>
                            <Form.Control onChange={onChange} name='password' type="password" placeholder="A good password but at the same time easy to remember" />
                            <Form.Text id="passwordHelpBlock" muted>
                                Your password must be 8-20 characters long, contain letters and numbers, and
                                must not contain spaces, special characters, or emoji.
                            </Form.Text>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit new password
                        </Button>
                    </Form>
                </Jumbotron>

                <>
            <Alert show={show} variant={error ? "danger" :"success"}>
                <Alert.Heading>{error ? "Error occured!" : "Password is updated!"}</Alert.Heading>
                    <p>
                    {error ? "Something went wrong with updating your password, maybe your token is wrong." :
                    "You can now go back by clicking on the button and login with your new password"}
                    </p>
                <hr />
                <div className="d-flex justify-content-end">
                <Button  onClick={() => history.push('/')} variant="success">
                    Go back
                </Button>
                </div>
            </Alert>
            </>

                </Col>
            </Row>
            </Container>



     
        </div>
    )
} 

export default Reset;