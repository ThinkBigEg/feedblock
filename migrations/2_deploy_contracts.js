const Organization = artifacts.require("Organization");
const Session = artifacts.require("Session");

var todayDate = new Date();
module.exports = function(deployer, accounts) {
    //deployer.link(ConvertLib, MetaCoin);
    deployer.deploy(Organization, "Think Big", "Startup");
    deployer.deploy(Session, "first session", "description of first contract", Date.parse(todayDate), Date.parse(todayDate), ['0x88260a1eb5a2b6c66fa184e4b383a9e3ffa2ce15'], ['0x88260a1eb5a2b6c66fa184e4b383a9e3ffa2ce15']);
};