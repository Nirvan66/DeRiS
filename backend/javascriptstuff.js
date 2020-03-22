var fs = require('fs')
var Web3 = require('web3')
web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

abi = JSON.parse(fs.readFileSync('deris_sol_Deris.abi'));

contract = new web3.eth.Contract(abi);
contract.options.address = "0xC6f8825a9343257822D680a4C2Dd740C71A89b03";

contract.methods.driveRequest().send({from: "0x689AA1d224DfD68B0A8D54698e9DB3B39f893C83", gas: 145135}).then(function(value) {
	console.log(value)
	})

contract.methods.users("0x35AEf9Bb347a4AceFfc54C639aa26DA81e57468f").call({from: '0x35AEf9Bb347a4AceFfc54C639aa26DA81e57468f'}).then(function(result){
    console.log(result)
    })

contract.methods.userList(0).call({from: '0xf00660Eec668cb99A8967fFE0c25729B5502D250'}).then(function(result){
    console.log(result)
    })

contract.methods.driveRequest().estimateGas({from: '0x35AEf9Bb347a4AceFfc54C639aa26DA81e57468f'}).then(function(gasAmount){
    console.log(gasAmount)
    })

contract.methods.getGas().call().then((f) => {
  console.log(f)
 })

0x35AEf9Bb347a4AceFfc54C639aa26DA81e57468f

web3.eth.getAccounts().then((f) => {
    for(var i=0; i< f.length;i++){
        web3.eth.getBalance(f[i]).then((g)=>{
            console.log(g,web3.utils.fromWei(g, 'ether'));
        });
    }
});
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

