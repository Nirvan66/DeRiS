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
    this.state = { account: '' }
  }

  render() {
    return (
      <LandingPage></LandingPage>
    );
  }
}

export default App;