import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import LandingPage from './pages/landingPage.jsx'
import RiderPage from './pages/riderPage.jsx'
import DriverPage from './pages/driverPage.jsx'
import RideProgressPage from './pages/rideProgressPage.jsx'
import {derisInterface} from './deris_sol_Deris_abi'
import { 
  initBlockchain,
  setDriver, 
  requestRide,
  getCurrentRides
} from './js_modules/contractInterface'

const NO_BLOCKCHAIN_DEV = false;

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    if (NO_BLOCKCHAIN_DEV) { return; }

    const portNumber = '7545';
    // This should be done on submission of the landing page
    // const accounts = await web3.eth.getAccounts()
    // this.setState({ account: accounts[0] })
    const address = '0xFc4D5B8779398F2707EDd55dddb243FA7503dD86';

    const blockchainFunctions = initBlockchain(portNumber, address, derisInterface);
    
    this.setState({ blockchainFunctions });

    // const taskCount = await todoList.methods.taskCount().call()
    // this.setState({ taskCount })
    // for (var i = 1; i <= taskCount; i++) {
    //   const task = await todoList.methods.tasks(i).call()
    //   this.setState({
    //     tasks: [...this.state.tasks, task]
    //   })
    // }
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
      isRideProgressPage: false,
      // blockchain functions
      blockchainFunctions: null,
      currentRides: null
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

    const currentRides = isRiderPage ? null : getCurrentRides(payload.ethereumAddress);

    if (!isRiderPage){
      setDriver(payload.ethereumAddress);
    }

    this.setState({
      ethereumAddress: payload.ethereumAddress,
      isLandingPage: false,
      isRiderPage,
      isDriverPage: !isRiderPage,
      currentRides
    });
  }

  onRiderPageSubmit(payload){
    const isContinuing = payload.requestType == 'request';
    console.log('Rider continuing ride', isContinuing);
    if (isContinuing){
      requestRide(payload.startLocation, payload.endLocation, 10, this.state.ethereumAddress);
    }

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