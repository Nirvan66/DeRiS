import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import LandingPage from './pages/landingPage.js'
import RiderPage from './pages/riderPage.js'
import DriverPage from './pages/driverPage.js'
import RideProgressPage from './pages/rideProgressPage.js'

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
    this.onLandingPageSubmit = this.onLandingPageSubmit.bind(this);
  }

  /////////////////////////////////////////////////////////////////////////
  //              Submissions
  /////////////////////////////////////////////////////////////////////////
  onLandingPageSubmit (payload) {
    this.setState({ethereumAddress: payload.ethereumAddress})
    alert('Changed ethereum address to ' + this.state.ethereumAddress + '\n and going to page ' + payload.type)
    // TODO: we need to go to either the driver or rider page
    if (payload.type == 'rider'){
      // got to the rider page
    }
    else {
      // go to the driver page
    }
  }

  render() {
    return (
      <LandingPage 
        onSubmit={this.onLandingPageSubmit}
      ></LandingPage>
    );
  }
}

export default App;