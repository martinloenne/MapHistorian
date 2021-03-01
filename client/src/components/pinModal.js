import {Modal, Button, Jumbotron} from 'react-bootstrap';
import Voting from "./vote";


const PinModal = ({show, close, info}) => {
  return (
    <>
    <Modal show={show} onHide={close} centered>
      <Modal.Header closeButton>
        <Modal.Title><h4>{info.name}</h4></Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <b className="left-footer-type">{info.type}</b>
        <p></p>
      <Jumbotron>
        <p>{info.description ? info.description : "This pin don't have a description yet✍🏻"}</p>
        </Jumbotron>
      
 
      { info.approved === true ? <p>Approved✔</p>      
      : <p>Not Approved Yet🤞🏻</p> }

      <Voting approved={info.approved} pin={info.id} votes={info.votes} />
      
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>Close</Button>
      </Modal.Footer>
    </Modal>
  </>
  )
};
export default PinModal;