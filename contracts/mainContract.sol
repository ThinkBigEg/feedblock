import './Organization.sol';
pragma solidity ^0.5.0;
contract mainContract {
    event OrganizationCreated(address indexed organization, address creator);
    mapping (address => bool) ISorganizations;
    Organization[] organizations;
   
    function CreateOrganization(string memory _organizationName,string memory _organizationDiscription) public returns (address) {
        Organization organization = new Organization(_organizationName,_organizationDiscription,msg.sender);
        emit OrganizationCreated(address(organization), msg.sender);
        ISorganizations[address(organization)] = true;
        organizations.push(organization);
        return address(organization);
    }

     function GoToOrganization(address _organization) public view   returns(bool) {
            if (ISorganizations[_organization]) {
               return true;
            } else {
               return false;
            }
   }
}



