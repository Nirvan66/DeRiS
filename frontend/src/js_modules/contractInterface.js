import Web3 from 'web3';

let web3, abi, contract;
const gasLimit = 3000000;

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
    return new Promise ((resolve, reject) => {
        contract.methods.driveRequest().estimateGas({from: ethereumAddress}).then((gasAmount) => {
            console.log('GAS AMOUTN FROM SET DRIVER')
            console.log(gasAmount)
            contract.methods.driveRequest().send({from: ethereumAddress, gas: gasAmount}).then((value) => {
                resolve();
            })
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
    console.log('ETHEREUM ADDRESS\n' + ethereumAddress)
    contract.methods.getWaitingRiders().estimateGas({from: ethereumAddress}).then((gasAmount) => {
        console.log("GAS AMOUNT IN GET CURRENT RIDES: \n" + gasAmount)
        console.log(gasAmount)
        contract.methods.getWaitingRiders().send({from: ethereumAddress, gas: gasAmount}).then((value) => {
            console.log('RIDES EMITTED')
        }).catch(error => console.log("ERROR: CANNOT GET WAITING RIDERS\n" + error +'\nGAS AMOUNT'+gasAmount));
    }).catch(error => console.log("ERROR: CANNOT CHECK GAS FOR WAITING RIDERS.\n" + error));
}

/**
 * Resets a user so they are not 1. matched to anyone 2. locations are wiped
 * 
 * @param {String} ethereumAddress string with the ethereum address of the user to reset 
 */
function resetUser(ethereumAddress){
    contract.methods.userReset().estimateGas({from: ethereumAddress}).then((gasAmount) => {
        console.log(gasAmount)
        contract.methods.userReset().send({from: ethereumAddress, gas: gasAmount}).then((value) => {
            console.log('RESET THE USER')
        });
    });
}

/**
 * 
 * @param {Object} loc          object containing both .lat and .lng attributes. These attributes should be strings, not callables loc 
 * @param {*} ethereumAddress   string with the ethereum address of driver
 */
function informRider(loc, ethereumAddress) {
    console.log('LOCATION FROM INFORM RIDER\n'+loc);
    console.log('EETHEREUM ADDRESS FROM INFORM RIDER\n'+ethereumAddress)
    const locLatLng = [loc.lat, loc.lng].join(',');
    contract.methods.informRider(locLatLng).estimateGas({from: ethereumAddress}).then( gasAmount => {
        contract.methods.informRider(locLatLng).send({from: ethereumAddress, gas: gasAmount}).then( val => {
            console.log('Sent inform rider message');
        })
    })
}

/**
 * Get the User number in the blockchain list. Used for matching in the ride progress page 
 * 
 * @param {*} ethereumAddress   String ethereum address of the requester
 * 
 * @returns {Promise}           Promise that when resolves returns the number (an int) for the user
 */
function getMyRiderNumber(ethereumAddress){
    return new Promise ((resolve, reject) => {
        contract.methods.getNumber().call({from: ethereumAddress}).then(number => {
            resolve(parseInt(number));
        })
    })
}

/**
 * 
 * @param {Int} amount              Integer amount to pay (in wei right now) 
 * @param {String} ethereumAddress  String ethereum address of the sender
 */
function payDriver(amount, ethereumAddress){
    amount = parseInt(amount).toString();
    contract.methods.payDriver().estimateGas({from: ethereumAddress}).then( gasAmount => {
        contract.methods.payDriver().send({from: ethereumAddress, gas: gasLimit, value: web3.utils.toWei(amount, 'wei')}).then( value => {
            console.log('Paid driver')
        }).catch('Error paying driver')
    }).catch('calculating gas')
}

export {
    initBlockchain,
    setDriver, 
    requestRide, 
    getCurrentRides, 
    acceptJob,
    resetUser,
    informRider,
    getMyRiderNumber,
    payDriver
}
