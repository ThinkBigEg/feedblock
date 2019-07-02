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

      modifier onTime(uint _startTime){
            require(now < _startTime);
            _;
      }
  
      constructor (string memory _sessionName, string memory _description, uint _startTime,uint _endTime,address[] memory   _lecturer,address[] memory  _attendes,address _creator) public onTime(_startTime){
              
              sessionName =  _sessionName;
              description = _description;
              startTime = _startTime;
              endTime = _endTime;
              attendes = _attendes;
              lecturer = _lecturer;
              creator = _creator;
              initAttendes(attendes);
      } 
      
    function initAttendes(address[] memory _attendes) private{
           for(uint i=0 ; i < _attendes.length ; i++){
            attendes_feedback[_attendes[i]] = 6;
        }
    }
   
    function Time() public view returns (bool){
       return (now >=  startTime  && now <= endTime && startTime < endTime);          
     }

    modifier checkTime(){
        require(Time());
        _;
      }
    modifier onlyVoter(address _voter){
        require(attendes_feedback[_voter] != 0);
        _;
      }
    function take_feedback(address _voter,uint8 _feedback)  public  onlyVoter(_voter) {
           if (attendes_feedback[_voter] != 6) 
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