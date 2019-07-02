App = {
    loading: false,
    contracts: {},
    organizationAddress: '',

    load: async() => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()

    },

    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async() => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                    // Acccounts now exposed
                web3.eth.sendTransaction({ /* ... */ })
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
                // Acccounts always exposed
            web3.eth.sendTransaction({ /* ... */ })
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadAccount: async() => {
        // Set the current blockchain account
        App.account = web3.eth.accounts[0]
    },

    loadContract: async() => {
        // Create a JavaScript version of the smart contract
        const mainContract = await $.getJSON('mainContract.json')
        const Organization = await $.getJSON('Organization.json')
        const Session = await $.getJSON('Session.json')

        App.contracts.mainContract = TruffleContract(mainContract)
        App.contracts.mainContract.setProvider(App.web3Provider)

        App.contracts.Organization = TruffleContract(Organization)
        App.contracts.Organization.setProvider(App.web3Provider)

        App.contracts.Session = TruffleContract(Session)
        App.contracts.Session.setProvider(App.web3Provider)

        // Hydrate the smart contract with values from the blockchain
        App.mainContract = await App.contracts.mainContract.deployed()
        App.Organization = await App.contracts.Organization.deployed()
        App.Session = await App.contracts.Session.deployed()
    },
    useAddress: async(contractName, address) => {
        var contractABI = web3.eth.contract(App.ContractFactory.abi)
        var contract = contractABI.at(address)
        return contract
    },


    CreateOrganization: async() => {
        // Load the total task count from the blockchain
        //const taskCount = await App.ContractFactory.taskCount()
        //const $taskTemplate = $('.taskTemplate')
        var OrganizationName = $('#create_Organization_name').val()
        var discription = $('#Organization_discription').val()
        var organization = await App.mainContract.CreateOrganization(OrganizationName, discription)
        console.log(organization.logs[0].args.organization)
        alert("Your Organization Address " + organization.logs[0].args.organization)
        App.organizationAddress = organization.logs[0].args.organization
        $(".create-organization").css({ 'display': 'none' })

        $(".create-sessions").css({ 'display': 'block' })


    },
    GoToOrganization: async() => {
        var OrganizationAddress = $('#create_Organization_Address').val()
        var flag = await App.mainContract.GoToOrganization(OrganizationAddress)

        console.log(flag)
        if (flag) {
            $(".create-organization").css({ 'display': 'none' })
            $(".create-sessions").css({ 'display': 'block' })
        } else {
            alert("error")
        }
    },
    //Back Buttion 
    BackBtn: async() => {
        $(".create-organization").css({ 'display': 'block' })
        $(".create-sessions").css({ 'display': 'none' })
    },

    //Create Sessions
    //Events Time
    parseDate: async(input) => {
        var parts = input.match(/(\d+)/g)
            // New Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
        return new Date(parts[0], parts[1] - 1, parts[2]) // months are 0-based
    },

    createSession: async(_sessionName, _discription, _start, _end, _lecturers, _attendes) => {
        var session = await App.Organization.createSession(_sessionName, _discription, _start, _end, _lecturers, _attendes, App.organizationAddress)
        console.log(session.logs[0].args.sessionAddress)
        alert("Your Session Address " + session.logs[0].args.sessionAddress)
    },
    onSubmit: async() => {
        var sessionName = $('#create_session_name').val()

        var discription = $('#discription').val()

        var start_date = await App.parseDate($('#start_date').val())
        console.log(start_date)
        var start = (start_date.getTime()) / 1000

        var end_date = await App.parseDate($('#end_date').val())
        var end = (end_date.getTime()) / 1000

        var lecturers = $('#lecturers').val().split(',')

        var attendes = $('#attendes').val().split(',')

        App.createSession(sessionName, discription, start, end, lecturers, attendes)
    },


}

$(() => {
    $(window).load(() => {
        App.load()
    })
})