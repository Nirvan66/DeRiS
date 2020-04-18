import Web3 from 'web3';

let web3, abi, contract;

/**
 * Init the blockchain for the app
 * 
 * @param {String} portNumber       String port number to deploy contract on
 * @param {String} contractAddress  String ethererum address to deploy the contract on
 * @param {Object} abiFile          Object containing the abi
 */
async function initBlockchain(portNumber, contractAddress, abiInterface) {
    web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:"+portNumber));

    contract = new web3.eth.Contract(abiInterface);
    contract.options.address = contractAddress;

    return contract;
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
    contract.methods.rideRequest(startLatLng, endLatLng, rideCost).estimateGas({from: ethereumAddress}).then((gasAmount) => {
        console.log(gasAmount)
        contract.methods.rideRequest(startLatLng, endLatLng, rideCost).send({from: ethereumAddress, gas: gasAmount}).then((value) => {
            console.log(value)
            })
        })
}

/**
 * Method called to send a ride request to the blockchain
 * 
 * @param {int} riderNumber         
 */
function acceptJob(riderNumber, ethereumAddress){
    contract.methods.pickRider(riderNumber).estimateGas({from: ethereumAddress}).then((gasAmount) => {
        console.log(gasAmount)
        contract.methods.pickRider(riderNumber).send({from: ethereumAddress, gas: gasAmount}).then((value) => {
            console.log(value)
            })
        })
}

/**
 * Method called when requesting the current available rides
 * 
 * @param {String} ethereumAddress string with the etheruem address of the driver looking for rides
 * 
 */
function getCurrentRides(ethereumAddress){
    contract.methods.getWaitingRiders().estimateGas({from: ethereumAddress}).then((gasAmount) => {
        console.log(gasAmount)
        contract.methods.getWaitingRiders().send({from: ethereumAddress, gas: gasAmount}).then((value) => {
            console.log('RIDES EMITTED')
        });
    });
}

function resetUser(ethereumAddress){
    contract.methods.userReset().estimateGas({from: ethereumAddress}).then((gasAmount) => {
        console.log(gasAmount)
        contract.methods.userReset().send({from: ethereumAddress, gas: gasAmount}).then((value) => {
            console.log('RESET THE USER')
        });
    });
}

export {
    initBlockchain,
    setDriver, 
    requestRide, 
    getCurrentRides, 
    acceptJob,
    resetUser
}
