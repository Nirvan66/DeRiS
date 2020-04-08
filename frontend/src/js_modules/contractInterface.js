var fs = require('fs')
var Web3 = require('web3')
web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

abi = JSON.parse(fs.readFileSync('deris_sol_Deris.abi'));

contract = new web3.eth.Contract(abi);
contract.options.address = "0xDC825F515Dd94DFAcB9a4750E73F33D33E48337b";


// Driver ready to drive
function setDriver(ethereumAddress){
    contract.methods.driveRequest().estimateGas({from: ethereumAddress}).then((gasAmount) => {
        contract.methods.driveRequest().send({from: ethereumAddress, gas: gasAmount}).then((value) => {
            })
        })
}


/**
 * requestRide
 * 
 * @param {Object} startLoc         object containing both .lat and .lng attributes. These attributes should be strings, not callables
 * @param {Object} endLoc           object containing both .lat and .lng attributes. These attributes should be strings, not callables
 * @param {String} ethereumAddress  string with the ethereum address of the rider
 */
function requestRide(startLoc, endLoc, ethereumAddress){
    contract.methods.rideRequest("10,-11","-11,10",10).estimateGas({from: '0xf00660Eec668cb99A8967fFE0c25729B5502D250'}).then(function(gasAmount){
        console.log(gasAmount)
        contract.methods.rideRequest("10,-11","-11,10",10).send({from: "0xf00660Eec668cb99A8967fFE0c25729B5502D250", gas: gasAmount}).then(function(value) {
            console.log(value)
            })
        })
}


// find riders
contract.methods.getWaitingRiders().estimateGas({from: '0xD01e67609fC9DC2bAf85c33F376E10189efAa788'}).then(function(gasAmount){
    console.log(gasAmount)
    contract.methods.getWaitingRiders().send({from: "0xD01e67609fC9DC2bAf85c33F376E10189efAa788", gas: gasAmount}).then(function(value) {
        console.log(value.events.RiderDetails.returnValues)
        })
    })

contract.RiderDetails().watch(function(error, result){
    if (!error)
    {
        console.log(result)
    } 
    else {
        console.log(error);
    }
});
