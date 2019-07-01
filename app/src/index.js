import Web3 from "web3";
import OrganizationArtifact from "../../build/contracts/Organization.json";
const App = {
    web3: null,
    account: null,
    meta: null,

    start: async function() {
        const { web3 } = this;

        try {
            // get contract instance
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = OrganizationArtifact.networks[networkId];
            this.meta = new web3.eth.Contract(
                OrganizationArtifact.abi,
                deployedNetwork.address,
            );

            // get accounts
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];

        } catch (error) {
            console.error("Could not connect to contract or chain.");
        }
    },



    CreateOrganization: async function() {
        var OrganizationName = $('#create_Organization_name').val();
        var discription = $('#Organization_discription').val();
        const { CreateOrganization } = this.meta.methods;
        var address;
        console.log(OrganizationName);
        console.log(discription);
        address = await CreateOrganization(OrganizationName, discription).send({ from: this.account });
        console.log(address);
        alert("Your Organization address = " + address.events.organizationCreated.returnValues.organizationAddress)
            //alert("Your Organization Address" + address.events.sessionnCreated.returnValues.sessionAddress);
        $(".create-organization").css({ 'display': 'none' });

        $(".create-sessions").css({ 'display': 'block' });
    },
    GoToOrganization: async function() {
        var OrganizationAddress = $('#create_Organization_Address').val();
        const { GoToOrganization } = this.meta.methods;
        var flag;
        flag = await GoToOrganization(OrganizationAddress).call();
        console.log(flag);
        if (flag) {
            $(".create-organization").css({ 'display': 'none' });
            $(".create-sessions").css({ 'display': 'block' });
        } else {
            alert("error");
        }
    },
    //Create session
    createdSession: async function(_sessionName, _description, _startTime, _endTime, _lecturer, _attendes) {
        const { createdSession } = this.meta.methods;
        var contractAddress, c;
        contractAddress = await createdSession(_sessionName, _description, _startTime, _endTime, _lecturer, _attendes).send({ from: this.account });
        console.log(contractAddress);
        alert("Your Session Address Is " + contractAddress.events.sessionnCreated.returnValues.sessionAddress);

    },
    BackBtn: function() {
        $(".create-organization").css({ 'display': 'block' });
        $(".create-sessions").css({ 'display': 'none' });
    },

    //Events Time
    parseDate: function(input) {
        var parts = input.match(/(\d+)/g);
        // New Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
        return new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
    },


    onSubmit: async function() {
        var sessionName = $('#create_session_name').val();

        var discription = $('#discription').val();

        var start_date = this.parseDate($('#start_date').val());
        var start = (start_date.getTime()) / 1000;

        var end_date = this.parseDate($('#end_date').val());
        var end = (end_date.getTime()) / 1000;

        var lecturers = $('#lecturers').val().split(',');

        var attendes = $('#attendes').val().split(',');

        this.createdSession(sessionName, discription, start, end, lecturers, attendes);


    },
    //Take Feedback
    take_feedback: async function() {
        var _sessionName = $('#feedback_session_name').val();
        var _voter = $('#feedback_session_voter').val();
        var _feedback = $('#feedback').val();
        const { sessionTakeFeedback } = this.meta.methods;
        await sessionTakeFeedback(_sessionName, _voter, _feedback).send({ from: this.account });

    },
    //See Result
    getResult: async function() {
        var _sessionName = $('#see_session_name').val();
        var result;
        const { sessionSeeResult } = this.meta.methods;
        result = await sessionSeeResult(_sessionName).call();
        console.log(result);
        return result;
    },
    drawChart: function(result) {
        console.log("see = " + result);
        var numOfVoters = result[0] + result[1] + result[1] + result[3] + result[4];
        var colors = ['#007bff', '#28a745', '#333333', '#c3e6cb', '#dc3545', '#6c757d'];
        var donutOptions = {
            cutoutPercentage: 85,
            legend: { position: 'bottom', padding: 5, labels: { pointStyle: 'circle', usePointStyle: true } }
        };
        // donut 1
        var chDonutData1 = {
            labels: ['Bad', 'Normal', 'Good', 'Very Good', 'Excellent'],
            datasets: [{
                backgroundColor: colors.slice(0, 5),
                borderWidth: 0,
                data: [(result[0] / numOfVoters) * 100, (result[1] / numOfVoters) * 100, (result[2] / numOfVoters) * 100, (result[3] / numOfVoters) * 100, (result[4] / numOfVoters) * 100]
            }]
        };

        var chDonut1 = document.getElementById("chDonut1");
        if (chDonut1) {
            new Chart(chDonut1, {
                type: 'pie',
                data: chDonutData1,
                options: donutOptions
            });
        }
    },
    showResult: function() {
        var that = this;
        this.getResult().then(function(data) {
            that.drawChart(data);
        })
    }

};

window.App = App;

window.addEventListener("load", function() {
    if (window.ethereum) {
        // use MetaMask's provider
        App.web3 = new Web3(window.ethereum);
        window.ethereum.enable(); // get permission to access accounts
    } else {
        console.warn(
            "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
        );
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        App.web3 = new Web3(
            new Web3.providers.HttpProvider("http://127.0.0.1:9545"),
        );
    }

    App.start();
});