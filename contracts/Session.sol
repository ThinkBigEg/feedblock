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
    
      constructor (string memory _sessionName, string memory _description, uint _startTime,uint _endTime,address[] memory   _lecturer,address[] memory  _attendes,address _creator) public{
              
              sessionName =  _sessionName;
              description = _description;
              startTime = _startTime;
              endTime = _endTime;
              attendes = _attendes;
              lecturer = _lecturer;
              creator = _creator;
              init(_attendes,lecturer);
      } 
      function getattendes() view public returns (address[] memory) {
        return attendes;
      }
      function getlecturers() view public returns (address[] memory) {
        return lecturer;
      }
      
    function init(address[] memory _attendes,address[] memory _lecturer) private{
           for(uint i=0 ; i < _attendes.length ; i++){
            Isattendes[_attendes[i]] = true;
        }
          for (uint i =0; i < lecturer.length; i++) {
            Islecturer[_lecturer[i]]  = true;
          }
    }
   
   
    function take_feedback(address _voter,uint8 _feedback)  public onlyVoter(_voter) {
            if (attendes_feedback[_voter] != 0) 
           {
                result[attendes_feedback[_voter]]  = result[attendes_feedback[_voter]] - 1;
           } 
           attendes_feedback[_voter] = _feedback; 
           result[_feedback] = result[_feedback] + 1;         
    }
     
  function seeResult() public view returns(uint8[5] memory){
          return result;
  }
}