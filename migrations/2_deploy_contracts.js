var mainContract = artifacts.require("./mainContract.sol");
module.exports = function(deployer) {
    deployer.deploy(mainContract);

};