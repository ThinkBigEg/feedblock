pragma solidity 0.5.0;
import  "./Organization.sol";
contract OrganizationCreator {
      string organizationName;
      string organizationDiscription;
      Organization organization;
      mapping (address => Organization) organizations;
      event organizationCreated(string name,string discription ,address organizationAddress);
      function Create(string memory _organizationName,string memory _organizationDiscription) public returns (address) {
       organization = new Organization(_organizationName,_organizationDiscription);
       organizations[address(organization)] = organization;
       emit organizationCreated(_organizationName,_organizationDiscription,address(organization));
       return address(organization);
      }
     function GoTo(address _organizationAddress) view public returns (bool) {
      uint size;
      assembly {
        size := extcodesize(_organizationAddress)
        }
        return size > 0;
     }
}