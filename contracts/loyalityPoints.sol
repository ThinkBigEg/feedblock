pragma solidity ^0.5.0;
contract loyalityPoints {
     string tokenName;
     string tokenDiscription;
     address userCreator;
     address contractCreator;
     mapping (address => uint) balanceOf;
     mapping (address => uint) permissionLimit; 
     event give(address contractCreator,address reciver,uint points);
     event pay(address contractCreator,address payer,address reciver ,uint points);
     constructor (string memory _tokenName,string memory _tokenDiscription,address _contractCreator) public{
          tokenName = _tokenName;
          tokenDiscription =_tokenDiscription;
          contractCreator = _contractCreator;
          userCreator = msg.sender;
      }

      modifier onlyCreator(){
        require(msg.sender == userCreator);
        _;
    } 
       modifier onlyPermitted(address account,uint points){
        require(msg.sender == userCreator || permissionLimit[account] >= points );
        _;
    } 
    modifier hadPoints(uint points){
        require(balanceOf[msg.sender] >= points);
        _;
    }
    function givePermission(address account,uint limit) public onlyCreator {
        permissionLimit[account] = limit;
    }

    function giveLP(address reciver , uint points )  public  onlyPermitted(reciver,points) {
        balanceOf[reciver] += points;
        emit give(address(this),reciver,points);
    }
    function payLP(address payer ,address reciver, uint points )  public  hadPoints(points) {
        balanceOf[payer] -= points;
        balanceOf[reciver] += points;
        emit pay(address(this),payer,reciver,points);

    }
}



