var fs = require('fs')
var Web3 = require('web3')
web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

abi = JSON.parse(fs.readFileSync('deris_sol_Deris.abi'));

contract = new web3.eth.Contract(abi);
contract.options.address = "0xD165075b76229a4D85e2E8a5e5abB953Faf76198";

contract.methods.driveRequest().estimateGas({from: '0xD01e67609fC9DC2bAf85c33F376E10189efAa788'}).then(function(gasAmount){
    console.log(gasAmount)
    contract.methods.driveRequest().send({from: "0xD01e67609fC9DC2bAf85c33F376E10189efAa788", gas: gasAmount}).then(function(value) {
        console.log(value)
        })
    })


contract.methods.rideRequest("10,-11","-11,10",10).estimateGas({from: '0xf00660Eec668cb99A8967fFE0c25729B5502D250'}).then(function(gasAmount){
    console.log(gasAmount)
    contract.methods.rideRequest("10,-11","-11,10",10).send({from: "0xf00660Eec668cb99A8967fFE0c25729B5502D250", gas: gasAmount}).then(function(value) {
        console.log(value)
        })
    })

contract.methods.getWaitingRiders().estimateGas({from: '0xD01e67609fC9DC2bAf85c33F376E10189efAa788'}).then(function(gasAmount){
    console.log(gasAmount)
    contract.methods.getWaitingRiders().send({from: "0xD01e67609fC9DC2bAf85c33F376E10189efAa788", gas: gasAmount}).then(function(value) {
        console.log(value.events.RiderDetails.returnValues)
        })
    })

contract.methods.users("0x35AEf9Bb347a4AceFfc54C639aa26DA81e57468f").call({from: '0x35AEf9Bb347a4AceFfc54C639aa26DA81e57468f'}).then(function(result){
    console.log(result)
    })

contract.methods.userList(0).call({from: '0xf00660Eec668cb99A8967fFE0c25729B5502D250'}).then(function(result){
    console.log(result)
    })

contract.methods.driveRequest().estimateGas({from: '0xf00660Eec668cb99A8967fFE0c25729B5502D250'}).then(function(gasAmount){
    console.log(gasAmount)
    })

contract.methods.getGas().call().then((f) => {
  console.log(f)
 })




web3.eth.getAccounts().then((f) => {
    for(var i=0; i< f.length;i++){
        web3.eth.getBalance(f[i]).then((g)=>{
            console.log(g,web3.utils.fromWei(g, 'ether'));
        });
    }
});

contract.RiderDetails().watch(function(error, result){
    if (!error)
    {
        console.log(result)
    } 
    else {
        console.log(error);
    }
}

///////////////////////////////////////////
var fs = require('fs')
var Web3 = require('web3')
web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

abi = JSON.parse(fs.readFileSync('Voting_sol_Voting.abi'));

contract = new web3.eth.Contract(abi);
contract.options.address = "0x1f2Dc4E7D0DB6dd49A2Fae80431bABc04cE1D512";


contract.methods.voteForCandidate(web3.utils.asciiToHex("Rama")).estimateGas({from: '0xf00660Eec668cb99A8967fFE0c25729B5502D250'}).then(function(gasAmount){
    console.log(gasAmount)
    })

contract.methods.totalVotesFor(web3.utils.asciiToHex("Rama")).call().then((f) => {
  console.log(f)
 })

contract.methods.getGas().call().then((f) => {
  console.log(f)
 })

contract.methods.voteForCandidate(web3.utils.asciiToHex("Rama")).send({from: "0x35AEf9Bb347a4AceFfc54C639aa26DA81e57468f"}).then(function(value) {
    console.log(value)
    })

contract.methods.voteForCandidate(web3.utils.asciiToHex("Rama")).call().then((f) => {
  console.log(f)
 })


contract.methods.candidateList(3).call({from: '0xf00660Eec668cb99A8967fFE0c25729B5502D250'}).then(function(result){
    console.log(web3.utils.hexToAscii(result))
    })


var account;
web3.eth.getAccounts().then((f) => {
 account = f[1];
})

