App = {
    loading: false,
    contracts: {},
    organizationAddress: '',
    sessionAddress: '',

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
        App.contracts.mainContract = TruffleContract(mainContract)
        App.contracts.mainContract.setProvider(App.web3Provider)

        // Hydrate the smart contract with values from the blockchain
        App.mainContract = await App.contracts.mainContract.deployed()
    },
    loadorganizationContract: async(address, _sessionName, _discription, _start, _end, _lecturers, _attendes) => {
        // Create a JavaScript version of the smart contract
        const Organization = await $.getJSON('Organization.json')
        App.contracts.Organization = web3.eth.contract(Organization.abi).at(address)
        console.log(App.contracts.Organization)
        var sessionAddress = await App.createSessionPromise(_sessionName, _discription, _start, _end, _lecturers, _attendes, App.organizationAddress)
        var sessionEvent = App.contracts.Organization.sessionnCreated()
        sessionEvent.watch(function(error, result) {
            if (!error) {

                console.log(result)
            } else {
                console.log(error);
            }
        });
        App.contracts.Organization.sessionnCreated({}, { fromBlock: 0, toBlock: 'latest' }).get((error, eventResult) => {
            if (error)
                console.log('Error in myEvent event handler: ' + error);
            else
                console.log('myEvent: ' + JSON.stringify(eventResult));
        });
        const Session = await $.getJSON('Session.json')
            /*   App.contracts.Session = web3.eth.contract(Session.abi).at(sessionAddress)
              console.log(App.contracts.Session)
              await App.takeSessionFeedbackPromise('0xa8ff46045fa2c6a0af361819b62126e1b0ec8909', 3) */
    },
    createSessionPromise: (_sessionName, _discription, _start, _end, _lecturers, _attendes, address) => {
        return new Promise(function(resolve, reject) {
            App.contracts.Organization.createSession(_sessionName, _discription, _start, _end, _lecturers, _attendes, address, function(error, response) {
                if (error) {
                    reject(error)
                } else {
                    resolve(response)
                }
            })
        });
    },
    takeSessionFeedbackPromise: (voterAddress, feedback) => {
        return new Promise(function(resolve, reject) {
            App.contracts.Session.take_feedback(voterAddress, feedback, function(error, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                    console.log("el7")
                }
            })
        });
    },

    CreateOrganization: async() => {
        // Load the total task count from the blockchain
        //const taskCount = await App.ContractFactory.taskCount()
        //const $taskTemplate = $('.taskTemplate')
        var OrganizationName = $('#create_Organization_name').val()
        var discription = $('#Organization_discription').val()

        var organization = await App.mainContract.CreateOrganization(OrganizationName, discription)
        console.log(organization.logs[0].args.organization)
        console.log(organization.logs[0].args.creator)
        alert(organization.logs[0].args.organization)
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

        App.loadorganizationContract(App.organizationAddress, _sessionName, _discription, _start, _end, _lecturers, _attendes)
            // console.log(session.logs[0].args.sessionAddress)
            //alert("Your Session Address " + session.logs[0].args.sessionAddress)



        //var session = await App.contracts.Organization.createSession(_sessionName, _discription, _start, _end, _lecturers, _attendes, App.organizationAddress)


        /*  $.getJSON('Organization.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var instance = web3.eth.contract(data.abi).at(App.organizationAddress);
            //var instance = App.contracts.Institution;
            App.contracts.Organization = instance;

            console.log("Organization  address:", instance.address); //inspect element to see the console logs.
            instance.createSession(_sessionName, _discription, _start, _end, _lecturers, _attendes, App.organizationAddress, { from: App.account }, function(err, value) {
                if (!err) {
                    console.log("session address " + value)
                    sessionAddress = value
                } else {
                    console.log("SHIT")
                }
            })
        })
 */



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
    //Take Feedback
    take_feedback: async() => {
        var _sessionName = $('#feedback_session_name').val()
        var _voter = $('#feedback_session_voter').val()
        var _feedback = $('#feedback').val()
        var sessionflag
        App.contracts.Organization.checkForSession(_sessionName, function(err, value) {
                sessionflag = value
            })
            /*    var gattendes = await App.Session.getattendes()
               var glecturer = await App.Session.getlecturers() */
            /* 
                    console.log(gattendes)
                    console.log(glecturer) */

        console.log(sessionflag + " yarab")
        if (sessionflag) {

        }
    },
    //See Result
    getResult: async() => {
        var _sessionName = $('#see_session_name').val()
        var result
        var sessionflag = await App.Organization.checkForSession(_sessionName)
        console.log(sessionflag + " yarab")
        if (sessionflag) {
            result = await App.Session.seeResult()
        }
        console.log(result)
        return result
    },
    drawChart: async(result) => {
        console.log("see = " + result)
        var numOfVoters = result[0] + result[1] + result[1] + result[3] + result[4]
        var colors = ['#007bff', '#28a745', '#333333', '#c3e6cb', '#dc3545', '#6c757d']
        var donutOptions = {
                cutoutPercentage: 85,
                legend: { position: 'bottom', padding: 5, labels: { pointStyle: 'circle', usePointStyle: true } }
            }
            // donut 1
        var chDonutData1 = {
            labels: ['Bad', 'Normal', 'Good', 'Very Good', 'Excellent'],
            datasets: [{
                backgroundColor: colors.slice(0, 5),
                borderWidth: 0,
                data: [(result[0] / numOfVoters) * 100, (result[1] / numOfVoters) * 100, (result[2] / numOfVoters) * 100, (result[3] / numOfVoters) * 100, (result[4] / numOfVoters) * 100]
            }]
        }

        var chDonut1 = document.getElementById("chDonut1")
        if (chDonut1) {
            new Chart(chDonut1, {
                type: 'pie',
                data: chDonutData1,
                options: donutOptions
            })
        }
    },
    showResult: async() => {
        App.getResult().then(function(data) {
            App.drawChart(data)
        })
    }


}

$(() => {
    $(window).load(() => {
        App.load()
    })
})