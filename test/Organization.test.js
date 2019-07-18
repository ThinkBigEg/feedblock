const MainContract = artifacts.require('./mainContract.sol')
const Organization = artifacts.require('./Organization.sol')
const Session = artifacts.require('./Session.sol')

contract('mainContract', (accounts) => {
    before(async() => {
        this.mainContract = await MainContract.deployed()
    })

    it('deploys successfully', async() => {
        const address = await this.mainContract.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })
    it('Organization deploys Session successfully ', async() => {
        const organization = await this.mainContract.CreateOrganization("Think Big", "STartupsss", "ya7you7", "YA7")
        const organizationAddress = organization.logs[0].args.organization
        let organizationContract = await Organization.at(organizationAddress)
        var todayDate = new Date();
        var session = await organizationContract.createSession("first session", "description of first contract", Date.parse(todayDate), Date.parse(todayDate), ['0x88260a1eb5a2b6c66fa184e4b383a9e3ffa2ce15'], ['0x88260a1eb5a2b6c66fa184e4b383a9e3ffa2ce15'], organizationAddress)
        console.log(session)
        var address = session.logs[0].args.sessionAddress
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('Organization deploys successfully ', async() => {
        const organization = await this.mainContract.CreateOrganization("Think Big", "STartupsss", "ya7you7", "YA7")
        const organizationAddress = organization.logs[0].args.organization
        let organizationContract = await Organization.at(organizationAddress)
        var todayDate = new Date();
        var session = await organizationContract.createSession("first session", "description of first contract", Date.parse(todayDate), Date.parse(todayDate), ['0x88260a1eb5a2b6c66fa184e4b383a9e3ffa2ce15'], ['0x88260a1eb5a2b6c66fa184e4b383a9e3ffa2ce15'], organizationAddress)
        console.log(session)
        var sessionAddress = session.logs[0].args.sessionAddress
        let sessionContract = await Session.at(sessionAddress)
        await sessionContract.take_feedback(3, organizationAddress)

    })

})