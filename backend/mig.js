var fs = require('fs');

var Web3 = require('web3');
web3 = new Web3("http://127.0.0.1:7545");
// web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

// var account;
// web3.eth.getAccounts().then((f) => {
//  account = f[0];
// })

bytecode = fs.readFileSync('Voting_sol_Voting.bin').toString()
abi = JSON.parse(fs.readFileSync('Voting_sol_Voting.abi').toString())
deployedContract = new web3.eth.Contract(abi)
listOfCandidates = ['Rama', 'Nick', 'Jose']
deployedContract.deploy({
  data: bytecode,
  arguments: [listOfCandidates.map(name => web3.utils.asciiToHex(name))]
}).send({
  from: '0xf00660Eec668cb99A8967fFE0c25729B5502D250',
  gas: 1500000,
  gasPrice: web3.utils.toWei('0.00003', 'ether')
}).then((newContractInstance) => {
  deployedContract.options.address = newContractInstance.options.address
  console.log(newContractInstance.options.address)
});

  // deployedContract.methods.totalVotesFor(web3.utils.asciiToHex('Rama')).call(console.log)
  // deployedContract.methods.voteForCandidate(web3.utils.asciiToHex('Rama')).send({from: 'YOUR ACCOUNT ADDRESS'}).then((f) => console.log(f))
  // deployedContract.methods.totalVotesFor(web3.utils.asciiToHex('Rama')).call(console.log)


  // web3.eth.getBalance(addr).then((f)=>{console.log(web3.utils.fromWei(f))})