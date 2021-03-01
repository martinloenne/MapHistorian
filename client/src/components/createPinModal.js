import {useState} from 'react';
import {Modal, Button, Form, InputGroup, FormControl, Alert} from 'react-bootstrap';
import { useAuthentication } from "../context/authenticationContext";
import axios from 'axios';


const CreatePinModal = ({show, close, info, setters, closeOnly}) => {
  const { authentication } = useAuthentication();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState(false);
  const [pin, setPin] = useState({
    name: '',
    description: '',
    type: 'Museum',
    latitude: info.latitude,
    longitude: info.longitude
  });
  const { name, description, type } = pin;

  const onChange = e => setPin({ ...pin, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (name === '' || description === '' || type === '') {
      setAlertType(412);
      setShowAlert(true)
    } 
    else 
    {
      const config = {
        headers: {
            'Content-Type': 'application/json'
            }
        };         
        try {
            if(authentication.isAuthenticated) {
              const res = await axios.post('/pin/', pin, config);  
              const info = { id: res.data.data.id, name: res.data.data.name, type: res.data.data.type, longitude: res.data.data.longitude, latitude: res.data.data.latitude, description: res.data.data.description}     
              setters(info)
              closeOnly()  
            } 
            else {
              const res = await axios.post('/pin/guest/', pin, config);  
              console.log(res.data.data.id)
              const info = { id: res.data.data.id, name: res.data.data.name, type: res.data.data.type, longitude: res.data.data.longitude, latitude: res.data.data.latitude, description: res.data.data.description}       
              setters(info)
              closeOnly()  
            }
        } catch (err) {
            // Error
            if(err.response.status === 429){
              if(authentication.isAuthenticated){
                  setAlertType(430);
              }
              else{
                setAlertType(429)
              }
            }
            else {
              setAlertType(404);
            }
            setShowAlert(true)  
        }
    }
  }

  return (
    <>
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title><h4>Create a pin</h4></Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
      <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Name of location or event</Form.Label>
          <Form.Control name='name' onChange={onChange} size="lg" type="text" placeholder="Temple of Zeus" required />
          
          <br />
    
          <Form.Label>Type of location</Form.Label>
          <Form.Control name='type' onChange={onChange} as="select">
            <option>Museum</option>
            <option>Bridge</option>
            <option>Temple</option>
            <option>Theatre</option>
          </Form.Control>
          
          <br />

          <Form.Label>Description</Form.Label>
          <InputGroup>
            <FormControl name='description' onChange={onChange} as="textarea" aria-label="With textarea" />       
          </InputGroup>
          <Form.Text className="text-muted" required>
            Only 200 characters allowed to keep it short
          </Form.Text>
        </Form.Group>
        <Button variant="success" type="submit">Submit</Button>
      </Form>

      </Modal.Body>

      <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
        <Alert.Heading>
          {(() => {
          if (alertType === 429)
            return <span>To create more pins in one day, please create an account😊 This is to prevent spamming</span>
          else if (alertType === 430)
            return <span>You can only create one pin every 2 minutes😊 This is to prevent spamming</span>
          else if (alertType === 400)
            return <span>bad Input</span>
          else if (alertType === 412)
            return <span>Some information missing, please fill out all the fields</span>
          else if (alertType === 404)
            return <span>Something didnt go as planned🤔 You may be creating a duplicate</span>
          })()}
        </Alert.Heading>
      </Alert>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>Close</Button>
      </Modal.Footer>
    </Modal>
  </>
  )
};
export default CreatePinModal;