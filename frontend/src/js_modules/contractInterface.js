import fs from 'fs';
import Web3 from 'web3';

let web3, abi, contract;

/**
 * Init the blockchain for the app
 * 
 * @param {String} portNumber       String port number to deploy contract on
 * @param {String} contractAddress  String ethererum address to deploy the contract on
 * @param {String} abiFile          String path the the abi file to load
 */
async function initBlockchain(portNumber, contractAddress, abiFile) {
    web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:"+portNumber));
    console.log(abiFile)
    abi = JSON.parse(fs.readFileSync(abiFile));

    contract = new web3.eth.Contract(abi);
    contract.options.address = contractAddress;

    watchRiderDetails();
}

/**
 * Method called when changing an accounts status to DRIVER
 * 
 * @param {String} ethereumAddress  string of the ethereum address of the one requesting the ride
 * 
 */
function setDriver(ethereumAddress){
    contract.methods.driveRequest().estimateGas({from: ethereumAddress}).then((gasAmount) => {
        contract.methods.driveRequest().send({from: ethereumAddress, gas: gasAmount}).then((value) => {
            })
        })
}

/**
 * Method called to send a ride request to the blockchain
 * 
 * @param {Object} startLoc         object containing both .lat and .lng attributes. These attributes should be strings, not callables
 * @param {Object} endLoc           object containing both .lat and .lng attributes. These attributes should be strings, not callables
 * @param {Number} rideCost         number cost of the trip from startLoc to endLoc
 * @param {String} ethereumAddress  string with the ethereum address of the rider
 */
function requestRide(startLoc, endLoc, rideCost, ethereumAddress){
    const startLatLng = [startLoc.lat, startLoc.lng].join(',');
    const endLatLng = [endLoc.lat, endLoc.lng].join(',');
    contract.methods.rideRequest(startLatLng, endLatLng, rideCost).estimateGas({from: ethereumAddress}).then(function(gasAmount){
        console.log(gasAmount)
        contract.methods.rideRequest(startLatLng, endLatLng, rideCost).send({from: ethereumAddress, gas: gasAmount}).then(function(value) {
            console.log(value)
            })
        })
}

/**
 * Method called when requesting the current available rides
 * 
 * @param {String} ethereumAddress string with the etheruem address of the driver looking for rides
 */
function getCurrentRides(ethereumAddress){
    contract.methods.getWaitingRiders().estimateGas({from: ethereumAddress}).then(function(gasAmount){
        console.log(gasAmount)
        contract.methods.getWaitingRiders().send({from: ethereumAddress, gas: gasAmount}).then(function(value) {
            console.log(value.events.RiderDetails.returnValues)
            })
        })
}

/**
 * Function to init the listener to the riderdetails function. Wrapped so that it is only
 * initialized after contract is initialized
 */
function watchRiderDetails(){
    contract.RiderDetails().watch(function(error, result){
        if (!error)
        {
            console.log(result)
        } 
        else {
            console.log(error);
        }
    });
}


export {
    initBlockchain,
    setDriver, 
    requestRide, 
    getCurrentRides
}
