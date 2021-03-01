import {Modal, Button, Jumbotron} from 'react-bootstrap';


const AboutModal = ({show, close}) => {
  return (
    <>
    <Modal show={show} onHide={close}         dialogClassName="modal-50w">
      <Modal.Header closeButton>
        <Modal.Title><h4>What is this?</h4></Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
      <Jumbotron>
        <h3>Crowd-Sourced map of historic locations and events</h3>
        <p>
            I made this site in order to create an overview over historic locations. 
            Both because of interest but also in the future would like to travel to these locations.
        </p>
        <p>Right now this site <b>only contains historic locations and events from the Classical Antiquity-Era</b> but in the future hopefully expand to cover other eras as well.</p>
        <p>The Classical Antiquity-era spans between 8th century BC and the 6th century AD, this means mostly ancient Rome and Greek.</p>
        <h4>So please only add events and locations from this time😄</h4>


        <div>Icons made by <a href="https://www.flaticon.com/authors/nikita-golubev" title="Nikita Golubev">Nikita Golubev</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/eucalyp" title="Eucalyp">Eucalyp</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

        </Jumbotron>

        <Button variant="success" size="lg" block onClick={close}>Close</Button>
      </Modal.Body>

    </Modal>
  </>
  )
};
export default AboutModal;