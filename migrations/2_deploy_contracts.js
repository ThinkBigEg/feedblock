const Organization = artifacts.require("Organization");

module.exports = function(deployer) {
    //deployer.link(ConvertLib, MetaCoin);
    deployer.deploy(Organization);
};
