const OrganizationCreator = artifacts.require("OrganizationCreator");

contract("OrganizationCreator", accounts => {
    it("should Create Organization contract and return it's address", async() => {
        const instance = await OrganizationCreator.deployed();
        var organization = await instance.Create("startup", "startup", { from: accounts[0] });
        const GoTo = await instance.GoTo.call(
            organization.events.organizationCreated.returnValues.organizationAddress
        );
        assert.equal(GoTo, true, "this not the address of organization it's event address");
    });

});