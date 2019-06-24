// Session.deployed().then(function(instance){ return instance.take_feedback('0x0fce0e522a2a18ee1e0fbf913e12483aec3f8404',8);});
pragma solidity 0.5.0;
import "./Session.sol";


contract Organization {
  
    address creator;
    string organizationName;
    string organizationDiscription;
    Session session;
    mapping (address => uint) ISsession;
    mapping (address => uint) organizations;
   
   constructor(string  memory _organizationName, string memory _organizationDiscription) public{
        organizationName = _organizationName;
        organizationDiscription = _organizationDiscription;
      }

    //create Organization
   function CreateOrganization(string  memory _organizationName, string memory _organizationDiscription) public returns(address) {
         address childAddress = clone(address(this));
         Organization child = Organization(childAddress);
         child.setcreator(address(this));
         organizations[ address(child)] = 7;
         setOrganizationInfo(_organizationName,_organizationDiscription);
         return address(child);
   }
   function GoToOrganization(address _organization) public view   returns(bool) {
            if (organizations[_organization] == 7) {
               return true;
            } else {
               return false;
            }
   }
   
  function setOrganizationInfo(string  memory _organizationName, string memory _organizationDiscription)  public  {
       organizationName = _organizationName;
        organizationDiscription = _organizationDiscription;
  }
   function setcreator(address addr) public {
         creator = addr;
   }

   function clone(address a) public returns(address)  {
      address retval;
      assembly{
         mstore(0x0, or (0x5880730000000000000000000000000000000000000000803b80938091923cF3 ,mul(a,0x1000000000000000000)))
         retval := create(0,0, 32)
      }
      return retval;
   }
      
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
        session = Session(address(session));
        ISsession[address(session)] = 7;
        emit sessionnCreated(_sessionName,address(session),creator);
        return address(session);
     }
     
     //Session Contract Methods
     function sessionTakeFeedback(address _session,address _voter,uint8 _feedback) public{
        require(ISsession[_session] == 7);
        Session(address(session)).take_feedback(_voter,_feedback);  
     }
   function sessionSeeResult(address _session) public view returns(int[] memory) {
        require(ISsession[_session] == 7);
        return   Session(address(session)).seeResult();
   }
}

