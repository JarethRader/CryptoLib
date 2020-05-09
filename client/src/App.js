//Import Dependencies
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import store from './store';
import { getMetamaskAddress, loadUser } from './actions/userAction';
import { Helmet } from 'react-helmet';

//Page Routes and components/modals
import NavBar from './components/navbar';
import Footer from './components/footer';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './routes/home';
import About from './routes/about';
import Catalog from './routes/catalog';
import User from './routes/user';
import DailyShelf from './routes/dailyShelf';
import ErrorModal from './components/errorModal';

class App extends Component {
  constructor(props) {
    super(props);

    if (window.ethereum || window.web3) {
      window.ethereum.autoRefreshOnNetworkChange = false;
      window.ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        store.dispatch(getMetamaskAddress(accounts[0]));
      });
    }
    try {
      store.dispatch(loadUser());
    } catch (err) {
      //User is probably no logged in
    }
  }

  render() {
    return (
      <div>
        <Helmet>
          <meta charSet='utf-8' />
          <meta name='Application' content='Cryptolibs' />
          <title>CryptoLib</title>
          <link rel='canonical' href='https://cryptolib.co' />
        </Helmet>
        <BrowserRouter>
          <div className='app'>
            <NavBar />
            <div className='body'>
              <ErrorModal />
              <Switch>
                <Route exact path='/user'>
                  <User />
                </Route>
                <Route exact path='/catalog'>
                  <Catalog />
                </Route>
                <Route exact path='/dailyShelf'>
                  <DailyShelf />
                </Route>
                <Route exact path='/about'>
                  <About />
                </Route>
                <Route path='/'>
                  <Home />
                </Route>
              </Switch>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
