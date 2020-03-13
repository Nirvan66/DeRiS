import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import LandingPage from './pages/landingPage.jsx'
import RiderPage from './pages/riderPage.jsx'
import DriverPage from './pages/driverPage.jsx'
import RideProgressPage from './pages/rideProgressPage.jsx'

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
      role: '',
      riderStartLocation: '',
      riderEndLocation: '',
      driverStartLocation: '',
      driverJobRadius: '',
      driverJobInfo: '',
      // state info for page loading
      isLandingPage: true,
      isRiderPage: false,
      isDriverPage: false,
      isRideProgressPage: false
    }

    //  bindings
    this.onLandingPageSubmit = this.onLandingPageSubmit.bind(this);
    this.onRiderPageSubmit = this.onRiderPageSubmit.bind(this);
    this.onDriverPageSubmit = this.onDriverPageSubmit.bind(this);
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
    console.log('Rider continuing ride', isContinuing);

    this.setState({
      riderStartLocation: payload.startLocation,
      riderEndLocation: payload.endLocation,
      isRiderPage: false,
      isRideProgressPage: isContinuing,
      isLandingPage: !isContinuing
    });
  }

  onDriverPageSubmit(payload) {
    const isCancel = payload.isCancel;
    console.log('Driver canceling request: ' + isCancel);
    this.setState({
      isDriverPage: false,
      isRideProgressPage: !isCancel,
      isLandingPage: isCancel,
      driverStartLocation: payload.center,
      driverJobRadius: payload.radius,
      driverJobInfo: payload.jobInfo
    });
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
          onSubmit={this.onDriverPageSubmit}
          show={this.state.isDriverPage}
        ></DriverPage>
        <RideProgressPage
          show={this.state.isRideProgressPage}
        ></RideProgressPage>
      </div>
      
    );
  }
}

export default App;