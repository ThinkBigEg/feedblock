const Organization = artifacts.require("Organization");
const Session = artifacts.require("Session");
var todayDate = new Date();
module.exports = function(deployer) {
    //deployer.link(ConvertLib, MetaCoin);
    deployer.deploy(Organization);
    deployer.deploy(Session, "first session", "description of first contract", Date.parse(todayDate), Date.parse(todayDate), ['0x0fce0e522a2a18ee1e0fbf913e12483aec3f8404'], ['0x0fce0e522a2a18ee1e0fbf913e12483aec3f8404']);
};