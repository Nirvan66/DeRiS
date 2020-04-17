//var abi = JSON.parse('[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"riderNumber","type":"uint256"},{"indexed":false,"internalType":"string","name":"pick","type":"string"},{"indexed":false,"internalType":"string","name":"drop","type":"string"}],"name":"RiderDetails","type":"event"},{"inputs":[],"name":"driveComplete","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"driveRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getWaitingRiders","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"payDriver","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"riderNumber","type":"uint256"}],"name":"pickRider","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rideComplete","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"pick","type":"string"},{"internalType":"string","name":"drop","type":"string"},{"internalType":"uint256","name":"tripCost","type":"uint256"}],"name":"rideRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"userList","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"bool","name":"isUser","type":"bool"},{"internalType":"uint256","name":"number","type":"uint256"},{"internalType":"enum Deris.Status","name":"state","type":"uint8"},{"internalType":"address","name":"currPairing","type":"address"},{"internalType":"string","name":"pickup","type":"string"},{"internalType":"string","name":"dropoff","type":"string"},{"internalType":"uint256","name":"escrow","type":"uint256"},{"internalType":"uint256","name":"paid","type":"uint256"}],"stateMutability":"view","type":"function"}]');
var abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "riderNumber",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "pick",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "drop",
                "type": "string"
            }
        ],
        "name": "RiderDetails",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "riderNumber",
                "type": "uint256"
            }
        ],
        "name": "RiderPicked",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "driveRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getNumber",
        "outputs": [
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getWaitingRiders",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "payDriver",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "riderNumber",
                "type": "uint256"
            }
        ],
        "name": "pickRider",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "pick",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "drop",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "tripCost",
                "type": "uint256"
            }
        ],
        "name": "rideRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "userList",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "userReset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "users",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isUser",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "number",
                "type": "uint256"
            },
            {
                "internalType": "enum Deris.Status",
                "name": "state",
                "type": "uint8"
            },
            {
                "internalType": "address",
                "name": "currPairing",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "pickup",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "dropoff",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "escrow",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "paid",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
var ethAddr;
var web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:7545"));

var contract = new web3.eth.Contract(abi);
contract.options.address = "0xDC825F515Dd94DFAcB9a4750E73F33D33E48337b";

contract.events.RiderDetails({}).on('data', function(event){
		console.log("RiderDetails")
	    console.log(event.returnValues);
	    document.getElementById("riderList").innerHTML = document.getElementById("riderList").innerHTML 
	    													+ JSON.stringify(event.returnValues);
	})

contract.events.RiderPicked({}).on('data', function(event){
		console.log("RiderPicked")
	    console.log(event.returnValues);
	    document.getElementById("picRider").innerHTML = JSON.stringify(event.returnValues);
	})


function myFunction() {
 document.getElementById("demo").innerHTML =  document.getElementById("demo0").innerHTML;
 // document.write("haha")
 // window.alert("haha")
}

function login() {
	document.getElementById("usrAddr").innerHTML = "User Addr: " + document.getElementById("ethAddr").value
	ethAddr = document.getElementById("ethAddr").value;
	console.log("Got User Address: " + ethAddr);

	contract.methods.getNumber().call({from: ethAddr}).then((f) => {
	   console.log('getNumber')
       console.log(f)
       document.getElementById("usrNumber").innerHTML = "User Number: " + f
	})
}

function rideRequest() {
	document.getElementById("riderOut").innerHTML = "start: " + document.getElementById("startLoc").value 
													+ " end: " + document.getElementById("endLoc").value;
	startLoc = document.getElementById("startLoc").value;
	endLoc = document.getElementById("endLoc").value;
	console.log("start: " + document.getElementById("startLoc").value 
				+ " end: " + document.getElementById("endLoc").value)

	contract.methods.rideRequest(startLoc,endLoc,10).estimateGas({from: ethAddr}).then(function(gasAmount){
    console.log(gasAmount)
    contract.methods.rideRequest(startLoc,endLoc,10).send({from: ethAddr, gas: gasAmount}).then(function(value) {
    	console.log('rideRequest')
        console.log(value)
        contract.methods.getNumber().call({from: ethAddr}).then((f) => {
			   console.log('getNumber')
		       console.log(f)
		       document.getElementById("usrNumber").innerHTML = "User Number: " + f
			})
        })
    })
}

function driveRequest() {
	contract.methods.driveRequest().estimateGas({from: ethAddr}).then(function(gasAmount){
	    console.log(gasAmount)
	    contract.methods.driveRequest().send({from: ethAddr, gas: gasAmount}).then(function(value) {
	    	console.log('driverRequest')
	        console.log(value)
            contract.methods.getNumber().call({from: ethAddr}).then((f) => {
               console.log('getNumber')
               console.log(f)
               document.getElementById("usrNumber").innerHTML = "User Number: " + f
            })
	   })
    })
}

function getRiders() {
	document.getElementById("riderList").innerHTML = ''
	contract.methods.getWaitingRiders().estimateGas({from: ethAddr}).then(function(gasAmount){
    	console.log(gasAmount)
	    contract.methods.getWaitingRiders().send({from: ethAddr, gas: gasAmount})
	    .then(function(value) {
	    	console.log('getRiders')
	    	console.log(value)
	        })
		})
}

function pickRider() {
	riderNo = document.getElementById("riderNo").value;
	console.log("picked rider: " + document.getElementById("riderNo").value)

	contract.methods.pickRider(riderNo).estimateGas({from: ethAddr}).then(function(gasAmount){
	    console.log(gasAmount)
	    contract.methods.pickRider(riderNo).send({from: ethAddr, gas: gasAmount}).then(function(value) {
	    	console.log('pickRider')
	        console.log(value)
	        })
    })
}

function rideProgress() {
	web3.fromWei(web3.eth.getBalance(ethAddr));
}

function endRide() {
	web3.fromWei(web3.eth.getBalance(ethAddr));
}