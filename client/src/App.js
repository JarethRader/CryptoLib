//Import Dependencies
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import store from "./store";
import { getMetamaskAddress, loadUser } from "./actions/userAction";
// import loadUserAddress from "./features/utils/loadUserAddress.js";

//Page Routes and components/modals
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./routes/home";
import About from "./routes/about";
import Catalog from "./routes/catalog";
import User from "./routes/user";
import DailyShelf from "./routes/dailyShelf";
import ErrorModal from "./components/errorModal";

class App extends Component {
  constructor(props) {
    super(props);

    window.ethereum.on("accountsChanged", function(accounts) {
      // Time to reload your interface with accounts[0]!
      store.dispatch(getMetamaskAddress(accounts[0]));
    });
    store.dispatch(loadUser());
  }

  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <NavBar />
          <div className="body">
            <ErrorModal />
            <Switch>
              <Route path="/user">
                <User />
              </Route>
              <Route path="/catalog">
                <Catalog />
              </Route>
              <Route path="/dailyShelf">
                <DailyShelf />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
