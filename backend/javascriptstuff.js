web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"))
var account;
web3.eth.getAccounts().then((f) => {
 account = f[1];
})

var fs = require('fs');

abi = JSON.parse(fs.readFileSync('Voting_sol_Voting.abi'));
abi = JSON.parse('')
