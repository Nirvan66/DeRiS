import Web3 from 'web3';

let web3, abi, contract;
const gasLimit = 3000000;

// TODO: make a funciton to make int from the first one to lat lng (getRides)

// TODO: in the driver page, get the estimated time to pickRider (acceptRide or whatever) -- time.now + time to get there (pass to pickRider) (divide the sum by 1000)

// TODO: endRide on timer up from the previous todo (userReset)

// TODO: add a .catch in informRider to catch the failure. Lets the driver know that the driver is't close enough to the rider

/**
 * Turns coordinates into the form for the blockchain of [int, int] ([lat, lng])
 *
 * @param {Object} loc  object with .lat and .lng attributes. These should be strings
 */
function __blockifyCoords(loc){
    return [
        Math.round(parseFloat(loc.lat) * 1000000),
        Math.round(parseFloat(loc.lng) * 1000000)
    ]
}

/**
 * Init the blockchain for the app
 *
 * @param {String} portNumber       String port number to deploy contract on
 * @param {String} contractAddress  String ethererum address to deploy the contract on
 * @param {Object} abiFile          Object containing the abi
 */
async function initBlockchain(portNumber, contractAddress, abiInterface) {
    web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.0.16:"+portNumber));

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
        contract.methods.driveRequest().send({from: ethereumAddress, gas: gasLimit}).then((value) => {
            resolve();
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
 *
 * @returns {Promise}
 */
function requestRide(startLoc, endLoc, rideCost, ethereumAddress){
    const startLatLng = __blockifyCoords(startLoc);
    const endLatLng = __blockifyCoords(endLoc);

    return new Promise((resolve, reject) => {
        contract.methods.rideRequest(startLatLng, endLatLng, rideCost).send({from: ethereumAddress, gas: gasLimit}).then((value) => {
            console.log(value)
            resolve(value);
        })
    })

}

/**
 * Method called to send a ride request to the blockchain
 *
 * @param {int} riderNumber  number from getNumber that identifies a user
 * @param {int} timeToArrive number of seconds the driver has to get to the rider before penalty
 *
 */
function acceptJob(riderNumber, timeToArrive, ethereumAddress){

    const now = Math.round(new Date().getTime() / 1000); //current time in seconds

    const timeRemaining = now + timeToArrive;

    contract.methods.pickRider(riderNumber, timeRemaining).send({from: ethereumAddress, gas: gasLimit}).then((value) => {
        console.log(value)
    })
}

/**
 * Method called when requesting the current available rides
 *
 * @param {String} ethereumAddress string with the etheruem address of the driver looking for rides
 *
 */
function getCurrentRides(ethereumAddress){
    contract.methods.getWaitingRiders().send({from: ethereumAddress, gas: gasLimit}).then((value) => {
        console.log('RIDES EMITTED')
    }).catch(error => console.log("ERROR: CANNOT GET WAITING RIDERS\n" + error +'\nGAS AMOUNT'+gasLimit));
}

/**
 * Resets a user so they are not 1. matched to anyone 2. locations are wiped
 *
 * @param {String} ethereumAddress string with the ethereum address of the user to reset
 * @param {Int} feeAmount           integer value in wei to cost the user by reseting user
 */
function resetUser(ethereumAddress, feeAmount){
    feeAmount = parseInt(feeAmount).toString();
    return new Promise((resolve, reject) => {
        contract.methods.userReset().send({from: ethereumAddress, gas: gasLimit, value: web3.utils.toWei(feeAmount, 'wei')}).then((value) => {
            console.log('RESET THE USER');
            resolve();
        });
    })
}

/**
 *
 * @param {Object} loc          object containing both .lat and .lng attributes. These attributes should be strings, not callables loc
 * @param {*} ethereumAddress   string with the ethereum address of driver
 */
function informRider(loc, ethereumAddress) {
    const locLatLng = __blockifyCoords(loc);
    contract.methods.informRider(locLatLng).send({from: ethereumAddress, gas: gasLimit}).then( val => {
        console.log('Sent inform rider message');
    }).catch(error => console.log('Error: not close enough to the rider. Please move closer'))
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
    contract.methods.payDriver().send({from: ethereumAddress, gas: gasLimit, value: web3.utils.toWei(amount, 'wei')}).then( value => {
        console.log('Paid driver')
    }).catch('Error paying driver')
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
