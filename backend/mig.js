var fs = require('fs');

var Web3 = require('web3');
web3 = new Web3("http://127.0.0.1:7545");
// web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

// var account;
// web3.eth.getAccounts().then((f) => {
//  account = f[0];
// })

bytecode = fs.readFileSync('deris_sol_Deris.bin').toString()
abi = JSON.parse(fs.readFileSync('deris_sol_Deris.abi').toString())
deployedContract = new web3.eth.Contract(abi)

// deployedContract.deploy({
//   data: bytecode,
//   arguments: []
// }).send({
//   from: '0xf00660Eec668cb99A8967fFE0c25729B5502D250',
//   gasLimit: 3000000,
//   gas: 2898290,
//   // gasPrice: web3.utils.toWei('0.00003', 'ether')
// }).then((newContractInstance) => {
//   deployedContract.options.address = newContractInstance.options.address
//   console.log(newContractInstance.options.address)
// });

deployedContract.deploy({
  data: bytecode
}).estimateGas().then(function(gasAmount){
    console.log(gasAmount)
    deployedContract.deploy({
      data: bytecode,
      arguments: []
    }).send({
      from: '0xf00660Eec668cb99A8967fFE0c25729B5502D250',
      gasLimit: 3000000,
      gas: gasAmount,
      // gasPrice: web3.utils.toWei('0.00003', 'ether')
    }).then((newContractInstance) => {
      console.log(newContractInstance.options.address)
    });
})