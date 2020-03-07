import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import LandingPage from './landingPage.js'

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
  }

  constructor(props) {
    super(props)
    this.state = { ethereumAddress : '' }

    //  bindings
    this.setEthereumAddress = this.setEthereumAddress.bind(this);
    this.onLandingPageSubmit = this.onLandingPageSubmit.bind(this);
    this.onRiderPageSubmit = this.onRiderPageSubmit.bind(this);
    this.onDriverPageSubmit = this.onDriverPageSubmit.bind(this);
  }

  /////////////////////////////////////////////////////////////////////////
  //              General Data Manipulation
  /////////////////////////////////////////////////////////////////////////
  setEthereumAddress (address) {
    this.setState({ethereumAddress: address})
  }

  /////////////////////////////////////////////////////////////////////////
  //              Submissions
  /////////////////////////////////////////////////////////////////////////
  onLandingPageSubmit (event) {
    this.setState({ethereumAddress: event.target.value})
    // TODO: we need to go to either the driver or rider page
  }

  render() {
    return (
      <LandingPage 
        onSubmit={this.onLandingPageSubmit}
        ethereumAddress={this.state.ethereumAddress}
        setEthereumAddress={this.setEthereumAddress}
      ></LandingPage>
    );
  }
}

export default App;