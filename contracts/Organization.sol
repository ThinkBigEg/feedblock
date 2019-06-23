// Session.deployed().then(function(instance){ return instance.take_feedback('0x0fce0e522a2a18ee1e0fbf913e12483aec3f8404',8);});
pragma solidity 0.5.0;
import "./Session.sol";
import "./OrganizationCreator.sol";

contract Organization {

     address creator;
     string organizationName;
     string organizationDiscription;
      Session session;
     OrganizationCreator oragnization; 
     
 constructor(string memory _organizationName,string memory _organizationDiscription) public{
       organizationName = _organizationName;
       organizationDiscription = _organizationDiscription;
     }

     event sessionnCreated(string name,address sessionAddress ,address creator);
     
       modifier onlyCreator(){
        require(msg.sender == creator);
        _;
    } 
    
      
      function CreateOrganization(string memory _organizationName,string memory _organizationDiscription)  public returns (address) {
        return oragnization.Create(_organizationName,_organizationDiscription);
      }
      function GoToOrganization(address _organizationAddress) view public returns (bool) {
        return oragnization.GoTo(_organizationAddress);
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
   function sessionSeeResult() public view returns(int[] memory) {
        return  session.seeResult();
   }
}

