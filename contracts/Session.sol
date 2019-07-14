pragma solidity 0.5.0;
contract Session {

      address public creator;  // The address of parent Organization
     
      string sessionName;
      string description;
      uint startTime;
      uint endTime;
      address[] lecturer;
      address[] attendes; 

      uint8[5]  result; 
      mapping(address => uint8) public attendes_feedback; //institution boardMembers
      mapping(address => bool) public Isattendes;
      mapping(address => bool) public Islecturer;
      modifier onlyVoter(address _voter){
              require(Isattendes[_voter]);
              _;
          }
    
      constructor (string memory _sessionName, string memory _description, uint _startTime,uint _endTime,address[] memory _lecturer,address[] memory  _attendes,address _creator) public{
              
              sessionName =  _sessionName;
              description = _description;
              startTime = _startTime;
              endTime = _endTime;
              lecturer = _lecturer;
              attendes = _attendes;
              creator = _creator;
              init(attendes,lecturer);
      }

    function init(address[] memory _attendes,address[] memory _lecturer) private{
           for(uint i=0 ; i < _attendes.length ; i++){
            Isattendes[_attendes[i]] = true;
        }
          for (uint i =0; i < lecturer.length; i++) {
            Islecturer[_lecturer[i]]  = true;
          }
    }
   
   
    function take_feedback(uint8 _feedback)  public onlyVoter(msg.sender) {
            if (attendes_feedback[msg.sender] != 0) 
           {
                result[attendes_feedback[msg.sender]]  = result[attendes_feedback[msg.sender]] - 1;
           } 
           attendes_feedback[msg.sender] = _feedback; 
           result[_feedback] = result[_feedback] + 1;         
    }
     
  function seeResult() public view returns(uint8[5] memory){
          return result;
  }
}