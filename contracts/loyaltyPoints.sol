pragma solidity ^0.5.0;
contract loyaltyPoints {
     string tokenName;
     string tokenSymbol;//symbol
     address userCreator;
     address contractCreator;
     mapping (address => uint) balanceOf;
     mapping (address => uint) permissionLimit; 
     event give(address contractCreator,address reciver,uint points);
     event pay(address contractCreator,address payer,address reciver ,uint points);
     constructor (string memory _tokenName,string memory _tokenSymbol,address _contractCreator) public{
          tokenName = _tokenName;
          tokenSymbol =_tokenSymbol;
          contractCreator = _contractCreator;
          userCreator = msg.sender;
      }

   
       modifier onlyUserCreator(){
        require(msg.sender == userCreator);
        _;
    }
    
     modifier onlyContractCreator(address _currentContract){
        require(_currentContract == contractCreator );
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
    function givePermission(address account,uint limit) public onlyUserCreator {
        permissionLimit[account] = limit;
    }

    function giveLP(address reciver , uint points,address _currentContract )  public  onlyContractCreator(_currentContract) {
        balanceOf[reciver] += points;
        emit give(address(this),reciver,points);
    }
    function payLP(address payer ,address reciver, uint points )  public  hadPoints(points) {
        balanceOf[payer] -= points;
        balanceOf[reciver] += points;
        emit pay(address(this),payer,reciver,points);

    }
}



