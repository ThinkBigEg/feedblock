// Session.deployed().then(function(instance){ return instance.take_feedback('0x0fce0e522a2a18ee1e0fbf913e12483aec3f8404',8);});
pragma solidity 0.5.0;
import "./Session.sol";


contract Organization {
  
    address creator;
    string organizationName;
    string organizationDiscription;
    Session[] sessions;
    mapping (address => bool) ISsession;

   constructor(string  memory _organizationName, string memory _organizationDiscription) public{
        organizationName = _organizationName;
        organizationDiscription = _organizationDiscription;
        creator =  msg.sender;
   }    
    event sessionnCreated(string name,address sessionAddress ,address creator);
    modifier onlyCreator(){
        require(msg.sender == creator);
        _;
    } 
     function checkForSession(address _address) view public returns (bool) {
        return ISsession[_address];
     }
    
     //construct Session Contract
     function createSession(
      string memory _sessionName,
      string memory _description,
      uint _startTime,
      uint _endTime,
      address[] memory _lecturer,
      address[] memory _attendes,
      address _organizationAddress
     ) public  onlyCreator returns(address) {
        
         Session session = new Session(_sessionName , _description , _startTime , _endTime, _lecturer,_attendes,_organizationAddress );
        ISsession[address(session)] = true;
        sessions.push(session);
        emit sessionnCreated(_sessionName,address(session),creator);
        return address(session);
     }
     
  
}

