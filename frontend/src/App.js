import React, { Component } from 'react'
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
  getCurrentRides,
  resetUser,
  acceptJob,
  informRider,
  getMyRiderNumber,
  payDriver
} from './js_modules/contractInterface'

const NO_BLOCKCHAIN_DEV = false;

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    if (NO_BLOCKCHAIN_DEV) { return; }

    const portNumber = '7545';
    
    // the blockchain address
    const address = '0xa58d4404b72C026410c2785fc7a2A656Dd049e1e';

    const blockchainFunctions = await initBlockchain(portNumber, address, derisInterface);
    const getAvailableRidesListener = cb => blockchainFunctions.events.RiderDetails({}).on('data', (event) => cb(event));
    const onRideAcceptedListener = cb => blockchainFunctions.events.RiderPicked({}).on('data', (event) => cb(event));
    const onDriverArrivedListener = cb => blockchainFunctions.events.imHere({}).on('data', event => cb(event));
    const onDriverPaidListener = cb => blockchainFunctions.events.cashMoney({}).on('data', event => cb(event));

    this.setState({ blockchainFunctions, onRideAcceptedListener, getAvailableRidesListener, onDriverArrivedListener, onDriverPaidListener});
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
      riderNumber: null,
      tripRate: null,
      // address info for printing to page
      pickupAddress: null,
      dropOffAddress: null,
      // state info for page loading
      isLandingPage: true,
      isRiderPage: false,
      isDriverPage: false,
      isRideProgressPage: false,
      // blockchain functions
      blockchainFunctions: null,
      // blockchain events
      getAvailableRidesListener: null,
      onRideAcceptedListener: null
    }

    //  bindings
    this.onLandingPageSubmit = this.onLandingPageSubmit.bind(this);
    this.onRiderPageSubmit = this.onRiderPageSubmit.bind(this);
    this.onDriverPageSubmit = this.onDriverPageSubmit.bind(this);
  }

  /////////////////////////////////////////////////////////////////////////
  //              Submissions
  /////////////////////////////////////////////////////////////////////////
  async onLandingPageSubmit(payload) {
    const isRiderPage = payload.role == 'rider';
    if (!isRiderPage && !NO_BLOCKCHAIN_DEV){
      console.log('Setting driver')
      await setDriver(payload.ethereumAddress);
    }

    this.setState({
      ethereumAddress: payload.ethereumAddress,
      isLandingPage: false,
      isRiderPage,
      isDriverPage: !isRiderPage,
      role: payload.role
    });
  }

  onRiderPageSubmit(payload){
    const isContinuing = payload.requestType == 'request';

    let riderNumber = null;
    if (isContinuing && !NO_BLOCKCHAIN_DEV){
      const startLoc = {lat: payload.startLocation.lat().toString(), lng: payload.startLocation.lng().toString()};
      const endLoc = {lat: payload.endLocation.lat(), lng: payload.endLocation.lng()};
      const tripRate =  Math.round(payload.tripRate);
      requestRide(startLoc, endLoc, tripRate, this.state.ethereumAddress);
      getMyRiderNumber(this.state.ethereumAddress).then(number => riderNumber = number);
    }

    this.setState({
      riderStartLocation: payload.startLocation,
      riderEndLocation: payload.endLocation,
      pickupAddress: payload.startAddress,
      dropOffAddress: payload.endAddress,
      isRiderPage: false,
      isRideProgressPage: isContinuing,
      isLandingPage: !isContinuing, 
      riderNumber: riderNumber,
      tripRate: Math.round(payload.tripRate),
      directions: payload.directions,
    });
  }

  onDriverPageSubmit(payload) {
    const isCancel = payload.isCancel;

    if (isCancel){
      resetUser(this.state.ethereumAddress);
      this.setState({
        isDriverPage: false,
        isLandingPage: true,
      })
    }

    // accept the job
    acceptJob(parseInt(payload.jobInfo.riderNumber), this.state.ethereumAddress);

    console.log('PAYLOAD FRM ON DRIVER PAGE SUBMIT')
    console.log(payload)

    this.setState({
      isDriverPage: false,
      isRideProgressPage: !isCancel,
      isLandingPage: isCancel,
      driverStartLocation: payload.center,
      driverJobRadius: payload.radius,
      driverJobInfo: payload.jobInfo,
      pickupAddress: payload.jobInfo.startAddr,
      dropOffAddress: payload.jobInfo.endAddr,
      tripRate: payload.jobInfo.rate,
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
          DEV={NO_BLOCKCHAIN_DEV}
        ></LandingPage>
        <RiderPage
          onSubmit={this.onRiderPageSubmit}
          show={this.state.isRiderPage}
          DEV={NO_BLOCKCHAIN_DEV}
        ></RiderPage>
        <DriverPage
          onSubmit={this.onDriverPageSubmit}
          show={this.state.isDriverPage}
          currentRides={this.state.currentRides}
          DEV={NO_BLOCKCHAIN_DEV}
          getAvailableRidesListener={this.state.getAvailableRidesListener}
          getAvailableRides={getCurrentRides}
          ethereumAddress={this.state.ethereumAddress}
        ></DriverPage>
        <RideProgressPage
          show={this.state.isRideProgressPage}
          role={this.state.role}
          riderPickupAddress={this.state.pickupAddress}
          riderDropOffAddress={this.state.dropOffAddress}
          riderPickupLocation={this.state.riderStartLocation}
          riderDropOffLocation={this.state.riderEndLocation}
          DEV={NO_BLOCKCHAIN_DEV}
          onRideAcceptedListener={this.state.onRideAcceptedListener}
          onDriverArrivedListener={this.state.onDriverArrivedListener}
          riderNumber={this.state.riderNumber}
          informRider={informRider}
          ethereumAddress={this.state.ethereumAddress}
          tripRate={this.state.tripRate}
          directions={this.state.directions}
          payDriver={payDriver}
          onDriverPaid={this.state.onDriverPaidListener}
        ></RideProgressPage>
      </div>
      
    );
  }
}

export default App;