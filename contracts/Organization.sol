pragma solidity 0.5.0;
import "./Session.sol";
contract Organization {

     address creator;
     Session session;
     event sessionnCreated(string name,address sessionAddress ,address creator);
     
       modifier onlyCreator(){
        require(msg.sender == creator);
        _;
    } 
     
     //construct Session Contract
     function createdSession(
      string memory _sessionName,
      string memory _description,
      uint _startTime,
      uint _endTime,
      address[] memory _lecturer,
      address[] memory _attendes
     ) public   returns(address) {
        
        session = new Session(_sessionName , _description , _startTime , _endTime, _lecturer,_attendes );
        emit sessionnCreated(_sessionName,address(session),creator);
        return address(session);
     }
     
     //Session Contract Methods
     function sessionTakeFeedback(address _voter,uint8 _feedback) public{
       session.take_feedback(_voter,_feedback);
     }
  
}

