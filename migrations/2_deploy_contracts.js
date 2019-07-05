var mainContract = artifacts.require("./mainContract.sol");
var todayDate = new Date();
module.exports = function(deployer) {
    deployer.deploy(mainContract);


};