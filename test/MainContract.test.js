const MainContract = artifacts.require('./mainContract.sol')

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
    it('Organization deploys successfully ', async() => {
        const organization = await this.mainContract.CreateOrganization("Think Big", "STartupsss", "ya7you7", "YA7")
        var address = organization.logs[0].args.organization
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })


})