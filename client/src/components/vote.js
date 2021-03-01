import {useEffect, useState} from 'react';
import {Button, Alert} from 'react-bootstrap';
import { useAuthentication } from "../context/authenticationContext";
import axios from 'axios';

const Voting = (props) => {
  const { authentication } = useAuthentication();
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState(false);

  useEffect(() => {
    if(props.votes){
      props.votes.map( vote => {
        if(vote.user === authentication.id){
          setVoted(vote.type);
        }
        vote.type === "upvote" ? setVotes(votes + 1) : setVotes(votes - 1)
      })
    }
  },[props] );

  const upVote = () => sendVote("upvote");

  const downVote = () => sendVote("downvote");

  const sendVote = async vote => {
    
    if(voted === vote){
      setShowAlert(true)
    } else {
      setVoted(vote)
    }
    
    const pin = {
      pin: props.pin,
      type: vote
    }
    const config = {
      headers: {
          'Content-Type': 'application/json'
          }
      };

      try {
          if(authentication.isAuthenticated) {
            await axios.post('/vote/', pin, config);
          } 
          else {
            await axios.post('/vote/guest/', pin, config);  
          }

          if(vote === "upvote"){
            setVotes(votes + 1)
          } else {
            setVotes(votes - 1)
          }
      } catch (err) {
          // Error
          if(err.response.status === 429){
            setAlertType(429);
          }
          setShowAlert(true)
      }
  };

  return (
    <>
    <div className="voteButtons">
      {props.approved === true ? 
        <p>Historial Accurate? <br></br>
        <h4>{votes}</h4>    
          <Button variant={voted === "upvote" ? "warning" : "outline-warning"} onClick={upVote}>Upvote👍🏻</Button>
          <Button variant={voted === "downvote" ? "danger" : "outline-danger"} onClick={downVote}>Downvote👎🏻</Button>
        </p>   
      : null} 
    </div>

    <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
        <Alert.Heading>{alertType === 429 ? "To vote more in one day, please create an account😊 This is to prevent spamming" 
        : "You have already voted!"}</Alert.Heading>
    </Alert>
    </>  
  )
  };
  export default Voting;