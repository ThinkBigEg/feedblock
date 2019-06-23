pragma solidity >=0.4.21 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/OrganizationCreator.sol";

contract TestOrganizationCreation{
    function testCreatingOrganization() public {
        OrganizationCreator meta = OrganizationCreator(DeployedAddresses.OrganizationCreator());


        Assert.equal(
            meta.Create("ThinkBig","Startup"),
            address(0),
            "Create should return a valid Organization address "
        );
    }

    function testGotTo() public {
        OrganizationCreator meta = new OrganizationCreator();

        bool expected = false;

        Assert.equal(
            meta.GoTo(address(this)),
            expected,
            "Address shouldn't be exist"
        );
    }
}
