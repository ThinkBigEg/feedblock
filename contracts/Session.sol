pragma solidity 0.5.0;
contract Session {

      address public creator;  // The address of parent Organization
     
      string sessionName;
      string description;
      uint startTime;
      uint endTime;
      address[] lecturer;
      address[] attendes; 

      int[] result; 
      mapping(address => int) public attendes_feedback; //institution boardMembers
      modifier onTime(uint _startTime){
            require(now < _startTime);
            _;
      }
      constructor (string memory _sessionName, string memory _description, uint _startTime,uint _endTime,address[] memory   _lecturer,address[] memory  _attendes) public onTime(_startTime){
              
              sessionName =  _sessionName;
              description = _description;
              startTime = _startTime;
              endTime = _endTime;
              attendes = _attendes;
              lecturer = _lecturer;
              initAttendes(attendes);
      } 
      
    function initAttendes(address[] memory _attendes) private{
           for(uint i=0 ; i < _attendes.length ; i++){
            attendes_feedback[_attendes[i]] = -1;
        }
    }
   
    function Time() public view returns (bool){
       return (now >=  startTime  && now <= endTime);          
     }

    modifier checkTime(){
        require(Time());
        _;
      }
      function test() public pure returns(bool) {
             return true;
      }
    function take_feedback(address _voter,uint8 _feedback)  public checkTime  {
         require(attendes_feedback[_voter] != 0);
          attendes_feedback[_voter] = _feedback;
          result[_feedback]++;
    }
 
  function seeResult() public view returns(int[] memory){
          return result;
  }
}