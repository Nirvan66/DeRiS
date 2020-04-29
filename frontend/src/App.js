import React, { Component } from 'react'
import './App.css'
import LandingPage from './pages/landingPage.jsx'
import RiderPage from './pages/riderPage.jsx'
import DriverPage from './pages/driverPage.jsx'
import RiderProgressPage from './pages/riderProgressPage.jsx'
import DriverProgressPage from './pages/driverProgressPage.jsx'
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
const FORGIVENESS_TIME = 60;
const depositRate = 10; // percentage

class App extends Component {
  async componentWillMount() {
    await this.loadBlockchainData()
    window.onbeforeunload = this.onPageRefresh;
  }

  async onPageRefresh(){
    let cancelFee = this.state.tripRate ? this.state.tripRate / depositRate : 0;
    await resetUser(this.state.ethereumAddress, parseInt(cancelFee));
    alert('You have lost ' + cancelFee + ' amount of money for cancelling your trip.')
  }

  async loadBlockchainData() {
    if (NO_BLOCKCHAIN_DEV) { return; }

    const portNumber = '7545';

    // the blockchain address
    const address = '0xc30eA5bdE02F2FF1e6134d41a7D6796A7d999F36';

    const blockchainFunctions = await initBlockchain(portNumber, address, derisInterface);
    const getAvailableRidesListener = cb => blockchainFunctions.events.RiderDetails({}).on('data', (event) => cb(event));
    const onRideAcceptedListener = cb => blockchainFunctions.events.RiderPicked({}).on('data', (event) => cb(event));
    const onDriverArrivedListener = cb => blockchainFunctions.events.imHere({}).on('data', event => cb(event));
    const onDriverPaidListener = cb => blockchainFunctions.events.cashMoney({}).on('data', event => cb(event));
    const onTripEndedListener = cb => blockchainFunctions.events.undone({}).on('data', event => cb(event));

    this.setState({ blockchainFunctions, onRideAcceptedListener, getAvailableRidesListener, onDriverArrivedListener, onDriverPaidListener, onTripEndedListener});
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
      driverNumber: null,
      tripRate: null,
      // address info for printing to page
      pickupAddress: null,
      dropOffAddress: null,
      // state info for page loading
      isLandingPage: true,
      isRiderPage: false,
      isDriverPage: false,
      isRiderProgressPage: false,
      isDriverProgressPage: false,
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
    this.onRiderCancels = this.onRiderCancels.bind(this);
    this.onDriverCancels = this.onDriverCancels.bind(this);
    this.toLoginPage = this.toLoginPage.bind(this);
    this.toDriverPage = this.toDriverPage.bind(this);
    this.onPageRefresh = this.onPageRefresh.bind(this);
  }

  /////////////////////////////////////////////////////////////////////////
  //              Submissions
  /////////////////////////////////////////////////////////////////////////
  async onLandingPageSubmit(payload) {
    const isRiderPage = payload.role == 'rider';
    if (!isRiderPage && !NO_BLOCKCHAIN_DEV){
      console.log('Setting driver')
      const startTime = new Date().getTime(); // ms
      await setDriver(payload.ethereumAddress);
      console.log('set driver time')
      console.log(new Date().getTime() - startTime);
    }

    this.setState({
      ethereumAddress: payload.ethereumAddress,
      isLandingPage: false,
      isRiderPage,
      isDriverPage: !isRiderPage,
      role: payload.role
    });
  }

  async onRiderPageSubmit(payload){
    const isContinuing = payload.requestType == 'request';

    let riderNumber = null;
    if (isContinuing && !NO_BLOCKCHAIN_DEV){
      const startLoc = {lat: payload.startLocation.lat().toString(), lng: payload.startLocation.lng().toString()};
      const endLoc = {lat: payload.endLocation.lat(), lng: payload.endLocation.lng()};
      const tripRate =  Math.round(payload.tripRate);
      await requestRide(startLoc, endLoc, tripRate, this.state.ethereumAddress);

      riderNumber = await getMyRiderNumber(this.state.ethereumAddress);
      this.setState({
        riderStartLocation: payload.startLocation,
        riderEndLocation: payload.endLocation,
        pickupAddress: payload.startAddress,
        dropOffAddress: payload.endAddress,
        isRiderPage: false,
        isRiderProgressPage: isContinuing,
        isLandingPage: !isContinuing,
        riderNumber: riderNumber,
        tripRate: Math.round(payload.tripRate),
        directions: payload.directions,
      });
    }

    if (!isContinuing){
      resetUser(this.state.ethereumAddress, 0);
    }
  }



  async onDriverPageSubmit(payload) {
    const isCancel = payload.isCancel;
    let driverNumber;
    let arrivalTime;
    if (isCancel){
      resetUser(this.state.ethereumAddress, 0);
      this.setState({
        isDriverPage: false,
        isLandingPage: true,
      })
      return;
    }
    else {
      acceptJob(parseInt(payload.jobInfo.riderNumber), payload.arrivalTime + FORGIVENESS_TIME, this.state.ethereumAddress);
      driverNumber = await getMyRiderNumber(this.state.ethereumAddress);
      arrivalTime = Math.round(new Date().getTime() / 1000) + payload.arrivalTime + FORGIVENESS_TIME;
    }

    this.setState({
      isDriverPage: false,
      isDriverProgressPage: !isCancel,
      isLandingPage: isCancel,
      driverStartLocation: payload.center,
      driverJobRadius: payload.radius,
      driverJobInfo: payload.jobInfo,
      pickupAddress: payload.jobInfo.startAddr,
      dropOffAddress: payload.jobInfo.endAddr,
      riderStartLocation: payload.jobInfo.startLoc,
      riderEndLocation: payload.jobInfo.endLoc,
      tripRate: payload.jobInfo.rate,
      driverNumber,
      arrivalTime,
    });
  }

  // called when the rider cancels a ride
  async onRiderCancels(payload) {
    let cancelFee = this.state.tripRate ? this.state.tripRate / depositRate: 0;
    await resetUser(this.state.ethereumAddress, Math.round(cancelFee));
    this.setState({
      ethereumAddress: '',
      isLandingPage: true,
      isRiderProgressPage: false,
    });
  }

  // called when the driver cancels a ride
  async onDriverCancels(payload) {
    let cancelFee = this.state.tripRate ? this.state.tripRate / depositRate : 0;
    await resetUser(this.state.ethereumAddress, Math.round(cancelFee));
    this.setState({
      ethereumAddress: '',
      isLandingPage: true,
      isDriverProgressPage: false,
    })
  }

  async toDriverPage(){
    await resetUser(this.state.ethereumAddress, 0);
    await setDriver(this.state.ethereumAddress);
    this.setState({
      isDriverProgressPage: false,
      isDriverPage: true,
    })
  }

  async toLoginPage(){

    this.setState({
      ethereumAddress : '',
      role: '',
      riderStartLocation: '',
      riderEndLocation: '',
      driverStartLocation: '',
      driverJobRadius: '',
      driverJobInfo: '',
      riderNumber: null,
      driverNumber: null,
      tripRate: null,
      // address info for printing to page
      pickupAddress: null,
      dropOffAddress: null,
      // state info for page loading
      isLandingPage: true,
      isRiderPage: false,
      isDriverPage: false,
      isRiderProgressPage: false,
      isDriverProgressPage: false,
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
        <RiderProgressPage
          show={this.state.isRiderProgressPage}
          riderPickupAddress={this.state.pickupAddress}
          riderDropOffAddress={this.state.dropOffAddress}
          riderPickupLocation={this.state.riderStartLocation}
          riderDropOffLocation={this.state.riderEndLocation}
          DEV={NO_BLOCKCHAIN_DEV}
          onRideAcceptedListener={this.state.onRideAcceptedListener}
          onDriverArrivedListener={this.state.onDriverArrivedListener}
          riderNumber={this.state.riderNumber}
          ethereumAddress={this.state.ethereumAddress}
          tripRate={this.state.tripRate}
          directions={this.state.directions}
          payDriver={payDriver}
          forgivenessTime={FORGIVENESS_TIME}
          onTripEndedListener={this.state.onTripEndedListener}
          cancelTrip={this.onRiderCancels}
          toLoginPage={this.toLoginPage}
        ></RiderProgressPage>
        <DriverProgressPage
          show={this.state.isDriverProgressPage}
          riderPickupAddress={this.state.pickupAddress}
          riderDropOffAddress={this.state.dropOffAddress}
          riderPickupLocation={this.state.riderStartLocation}
          riderDropOffLocation={this.state.riderEndLocation}
          DEV={NO_BLOCKCHAIN_DEV}
          driverNumber={this.state.driverNumber}
          informRider={informRider}
          ethereumAddress={this.state.ethereumAddress}
          tripRate={this.state.tripRate}
          directions={this.state.directions}
          onDriverPaid={this.state.onDriverPaidListener}
          arrivalTime={this.state.arrivalTime}
          onTripEndedListener={this.state.onTripEndedListener}
          cancelTrip={this.onDriverCancels}
          backToJobPage={this.toDriverPage}
          toLoginPage={this.toLoginPage}
        ></DriverProgressPage>
      </div>

    );
  }
}

export default App;
