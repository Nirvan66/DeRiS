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
    this.state = { 
      ethereumAddress : '',
      startLocation: '',
      endLocation: '',
      role: '',
      isLandingPage: true,
      isRiderPage: false,
      isDriverPage: false,
      isRideProgressPage: false
    }

    //  bindings
    this.onLandingPageSubmit = this.onLandingPageSubmit.bind(this);
    this.onRiderPageSubmit = this.onRiderPageSubmit.bind(this);
  }

  /////////////////////////////////////////////////////////////////////////
  //              Submissions
  /////////////////////////////////////////////////////////////////////////
  onLandingPageSubmit(payload) {
    const isRiderPage = payload.role == 'rider';

    this.setState({
      ethereumAddress: payload.ethereumAddress,
      isLandingPage: false,
      isRiderPage: isRiderPage,
      isDriverPage: !isRiderPage
    });
  }

  onRiderPageSubmit(payload){
    const isContinuing = payload.requestType == 'request';
    alert('the next page comes from the button '+ payload.requestType)

    this.setState({
      startLocation: payload.startLocation,
      endLocation: payload.endLocation,
      isRiderPage: false,
      isRideProgressPage: isContinuing,
      isLandingPage: !isContinuing
    })
  }

  /////////////////////////////////////////////////////////////////////////
  //              App render
  /////////////////////////////////////////////////////////////////////////
  render() {
    return (
      <div>
        <LandingPage 
          onSubmit={this.onLandingPageSubmit}
          show={this.state.isLandingPage}
        ></LandingPage>
        <RiderPage
          onSubmit={this.onRiderPageSubmit}
          show={this.state.isRiderPage}
        ></RiderPage>
        <DriverPage
          show={this.state.isDriverPage}
        ></DriverPage>
      </div>
      
    );
  }
}

export default App;