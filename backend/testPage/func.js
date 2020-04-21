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
                "components": [
                    {
                        "internalType": "int256",
                        "name": "lat",
                        "type": "int256"
                    },
                    {
                        "internalType": "int256",
                        "name": "long",
                        "type": "int256"
                    }
                ],
                "indexed": false,
                "internalType": "struct Deris.coordinates",
                "name": "pick",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "int256",
                        "name": "lat",
                        "type": "int256"
                    },
                    {
                        "internalType": "int256",
                        "name": "long",
                        "type": "int256"
                    }
                ],
                "indexed": false,
                "internalType": "struct Deris.coordinates",
                "name": "drop",
                "type": "tuple"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "escrow",
                "type": "uint256"
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
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "arrivalTime",
                "type": "uint256"
            }
        ],
        "name": "RiderPicked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "driverNumber",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "bills",
                "type": "uint256"
            }
        ],
        "name": "cashMoney",
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
            },
            {
                "indexed": false,
                "internalType": "int256[]",
                "name": "location",
                "type": "int256[]"
            }
        ],
        "name": "imHere",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "usrNumber",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "cancelFee",
                "type": "uint256"
            }
        ],
        "name": "undone",
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
        "inputs": [
            {
                "internalType": "int256[]",
                "name": "loc",
                "type": "int256[]"
            }
        ],
        "name": "informRider",
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
            },
            {
                "internalType": "uint256",
                "name": "arrivalTime",
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
                "internalType": "int256[]",
                "name": "pick",
                "type": "int256[]"
            },
            {
                "internalType": "int256[]",
                "name": "drop",
                "type": "int256[]"
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
        "stateMutability": "payable",
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
                "components": [
                    {
                        "internalType": "int256",
                        "name": "lat",
                        "type": "int256"
                    },
                    {
                        "internalType": "int256",
                        "name": "long",
                        "type": "int256"
                    }
                ],
                "internalType": "struct Deris.coordinates",
                "name": "pickup",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "int256",
                        "name": "lat",
                        "type": "int256"
                    },
                    {
                        "internalType": "int256",
                        "name": "long",
                        "type": "int256"
                    }
                ],
                "internalType": "struct Deris.coordinates",
                "name": "dropoff",
                "type": "tuple"
            },
            {
                "internalType": "uint256",
                "name": "arrivalTime",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "driverArrived",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "inProgress",
                "type": "bool"
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
var number;
var tripCost = 400
var arrivalTime;
var timer;
var gaslimit = 3000000;

var web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:7545"));

var contract = new web3.eth.Contract(abi);
contract.options.address = "0xA5884F847799906b3ACd5C9Fc6bfC820A5d003a6";


function myFunction() {
 document.getElementById("demo").innerHTML =  document.getElementById("demo0").innerHTML;
 // document.write("haha")
 // window.alert("haha")
}

function rideRequest() {
    document.getElementById("usrAddrR").innerHTML = "User Addr: " + document.getElementById("ethAddrR").value
    ethAddr = document.getElementById("ethAddrR").value;
    console.log("Got User Address: " + ethAddr);

    web3.eth.getBalance(ethAddr).then(function(value){
        console.log(value);
        document.getElementById("ether").innerHTML =   value;
    });

    function dstatusR(){
        width = parseInt(document.getElementById("dstatusRB").style.width)
        if(width==0){
            clearTimeout(timer)
            document.getElementById("dstatusRB").style.width = '100%'
            document.getElementById("select").innerHTML = "Drivers time is up. End trip if you want"

        }else{
            width = width - 100/arrivalTime;
            console.log(width)
            document.getElementById("dstatusRB").style.width = width.toString() + '%'
        }
    }

    contract.events.RiderPicked({}).on('data', function(event){
        console.log("RiderPicked")
        console.log(event.returnValues);
        if (parseInt(event.returnValues.riderNumber)==number){
            arrivalTime = (new Date(event.returnValues.arrivalTime * 1000) - new Date(Date.now()))/1000
            timer = setInterval(dstatusR(), 1000);
            document.getElementById("dstatusR").style.visibility = 'visible';
            document.getElementById("select").innerHTML = "Surprise Motherfucker!! Your rider should be here in : " + arrivalTime
        }
    })

    contract.events.imHere({}).on('data', function(event){
        console.log("imHere")
        console.log(event.returnValues);
        if (parseInt(event.returnValues.riderNumber)==number){
            document.getElementById("select").innerHTML = "Your ride is here: "+  
                                                            event.returnValues.location 
                                                            +" Get your skechers on."
        }
    })

    contract.events.undone({}).on('data', function(event){
        console.log("undone")
        console.log(event.returnValues);
        if (parseInt(event.returnValues.usrNumber)==number){
            window.alert("Trip ended with penalty/cancellation fee: " + event.returnValues.cancelFee);
            document.getElementById("tripCmpR").innerHTML = "Trip complete. End trip"
        }
    })

    //"40.005140, -105.256061" => [40005140, -105256061]
    startLoc = document.getElementById("startLoc").value
                    .split(',').map(item => parseInt(item.replace('.','')));
    endLoc = document.getElementById("endLoc").value
                    .split(',').map(item => parseInt(item.replace('.','')));

    console.log("start: " + startLoc
                + " end: " + endLoc)
    document.getElementById("riderOut").innerHTML = "You better be at: "  
                                                    + startLoc
                                                    + " to take your lazy ass to: "
                                                    + endLoc;

    document.getElementById("select").innerHTML = "Waiting for a sorry soul to pick your bitch ass"

    contract.methods.rideRequest(startLoc,endLoc,web3.utils.toWei(tripCost.toString(), 'wei')).send({from: ethAddr, gas: gaslimit}).then(function(value) {
    	console.log('rideRequest')
        console.log(value)
        contract.methods.getNumber().call({from: ethAddr}).then((f) => {
			   console.log('getNumber')
               number = parseInt(f)
		       console.log(number)
		       document.getElementById("usrNumberR").innerHTML = "User Number: " + number
               web3.eth.getBalance(ethAddr).then(function(value){
                    console.log(value);
                    document.getElementById("ether").innerHTML =   value;
                });
			})
        })
}

function driveRequest() {
    document.getElementById("usrAddrD").innerHTML = "User Addr: " + document.getElementById("ethAddrD").value
    ethAddr = document.getElementById("ethAddrD").value;
    console.log("Got User Address: " + ethAddr);

    web3.eth.getBalance(ethAddr).then(function(value){
        console.log(value);
        document.getElementById("ether").innerHTML =   value;
    });

    contract.events.RiderDetails({}).on('data', function(event){
        console.log("RiderDetails")
        console.log(event.returnValues);
        document.getElementById("riderList").innerHTML = document.getElementById("riderList").innerHTML 
                                                            + JSON.stringify(event.returnValues);
    })

    contract.events.cashMoney({}).on('data', function(event){
        console.log("cashMoney")
        console.log(event.returnValues);
        if (parseInt(event.returnValues.driverNumber)==number){
            document.getElementById("receiveMn").innerHTML = "Popping Bands: " + event.returnValues.bills;

            width = parseInt(document.getElementById("progressDB").style.width)
            if(width==100){
                document.getElementById("progressDB").style.width = '0%'
            }else{
                width = width + ((parseFloat(event.returnValues.bills)*100.0)/parseFloat(tripCost));
                console.log(width)
                document.getElementById("progressDB").style.width = width.toString() + '%'
            }
        }

        web3.eth.getBalance(ethAddr).then(function(value){
            console.log(value);
            document.getElementById("ether").innerHTML =   value;
        });
    })

    contract.events.undone({}).on('data', function(event){
        console.log("undone")
        console.log(event.returnValues);
        if (parseInt(event.returnValues.usrNumber)==number){
            window.alert("Trip ended with penalty/cancellation fee: " + event.returnValues.cancelFee);
            document.getElementById("tripCmpD").innerHTML = "Trip complete. End trip"
        }
    })

    contract.methods.driveRequest().send({from: ethAddr, gas: gaslimit}).then(function(value) {
    	console.log('driverRequest')
        console.log(value)
        contract.methods.getNumber().call({from: ethAddr}).then((f) => {
           console.log('getNumber')
           number = parseInt(f)
           console.log(number)
           document.getElementById("usrNumberD").innerHTML = "User Number: " + number
           web3.eth.getBalance(ethAddr).then(function(value){
                    console.log(value);
                    document.getElementById("ether").innerHTML =   value;
                });
        })
   })
}

function getRiders() {
	document.getElementById("riderList").innerHTML = ''
    contract.methods.getWaitingRiders().send({from: ethAddr, gas: gaslimit})
    .then(function(value) {
    	console.log('getRiders')
    	console.log(value)
        web3.eth.getBalance(ethAddr).then(function(value){
                    console.log(value);
                    document.getElementById("ether").innerHTML =   value;
                });
        })
}

function pickRider() {
	riderNo = document.getElementById("riderNo").value;
	console.log("picked rider: " + document.getElementById("riderNo").value)
    function timeRemaining(){
        width = parseInt(document.getElementById("timeRemainingB").style.width)
        if(width==0){
            clearTimeout(timer)
            document.getElementById("timeRemainingB").style.width = '100%'
            loss = Math.ceil( tripCost * 0.1 );
            document.getElementById("picRider").innerHTML = "Times up, you loose 10% of the trip: "
                                                            + loss
            endRide();

        }else{
            width = width - 100/30;
            console.log(width)
            document.getElementById("timeRemainingB").style.width = width.toString() + '%'
        }
    }

    d = new Date(Date.now())
    d.setSeconds(d.getSeconds() + 30)

    contract.methods.pickRider(riderNo, parseInt(d.getTime()/1000)).send({from: ethAddr, gas: gaslimit}).then(function(value) {
    	console.log('pickRider')
        console.log(value)
        document.getElementById("picRider").innerHTML = "Rider selected: " 
                                                        + riderNo 
                                                        + " Get there in: "
                                                        + 30
        timer = setInterval(timeRemaining, 1000);
        document.getElementById("timeRemaining").style.visibility = 'visible';
        web3.eth.getBalance(ethAddr).then(function(value){
                    console.log(value);
                    document.getElementById("ether").innerHTML =   value;
                });
        })
}

function infromRider(){
    driverLoc = document.getElementById("driveLoc").value
                    .split(',').map(item => parseInt(item.replace('.','')));
    console.log("Driver Location: " + driveLoc);
    contract.methods.informRider(driverLoc).send({from: ethAddr, gas: gaslimit}).then(function(value) {
        console.log('informRider')
        console.log(value)
        document.getElementById("picRider").innerHTML = "Informed rider of location: " + driverLoc
        clearTimeout(timer)
        document.getElementById("timeRemainingB").style.width = '100%'
        web3.eth.getBalance(ethAddr).then(function(value){
            console.log(value);
            document.getElementById("ether").innerHTML =   value;
        });
        })
}

function payDriver() {
    val = document.getElementById("cashAmt").value
    contract.methods.payDriver().send({from: ethAddr, gas: gaslimit, value:web3.utils.toWei(val, 'wei')}).then(function(value) {
        console.log('payDriver')
        console.log(value)
        document.getElementById("sendMn").innerHTML = "Cash sent: " + val
        width = parseInt(document.getElementById("progressRB").style.width)
        if(width>=100){
            document.getElementById("progressRB").style.width = '0%'
        }else{
            width = width + ((parseFloat(val)*100.0)/parseFloat(tripCost));
            console.log(width)
            document.getElementById("progressRB").style.width = width.toString() + '%'
        }

        web3.eth.getBalance(ethAddr).then(function(value){
            console.log(value);
            document.getElementById("ether").innerHTML =   value;
        });
        });
	
}

function endRide() {
    loss = parseInt(0.1*tripCost)
    window.alert("Ending trip prematurely might lead to loss of 10% of trip: " + loss);

    contract.methods.userReset().send({from: ethAddr, gas: gaslimit, value:web3.utils.toWei(loss.toString(), 'wei')}).then(function(value) {
        console.log('userReset')
        console.log(value)
        document.getElementById("tripStop").innerHTML = "Byeeeeeee!!!"
        oldBalance = parseInt(document.getElementById("ether").innerHTML)
        web3.eth.getBalance(ethAddr).then(function(value){
            console.log(oldBalance);
            console.log(value);
            document.getElementById("ether").innerHTML =   value;
            console.log("Balance lost" + (oldBalance-value))
        });
        });
    
}

// d = new Date(Date.now())
// d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()

// d = new Date( 1587351339 *1000)
// d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()


// Date(d.getTime()/1000)
// d.getMinutes() + ':' + d.getSeconds()
// d.setSeconds(d.getSeconds() + 10)
// d.getMinutes() + ':' + d.getSeconds()
// Date(d.getTime()/1000)
// d

// d = new Date('2014-01-01 10:11:55')
// d.getMinutes() + ':' + d.getSeconds()
// d.setSeconds(d.getSeconds() + 10)
// d.getMinutes() + ':' + d.getSeconds()

// parseInt(-14.5678.toString().replace('.',''))


// d1 = new Date(Date.now())
// d = new Date(Date.now())
// d.setSeconds(d.getSeconds() + 20)
// d2 = d