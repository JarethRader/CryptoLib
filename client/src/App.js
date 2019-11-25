//Import Dependencies
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Provider } from "react-redux";
import store from "./store";
import { getMetamaskAddress } from "./actions/userAction";
// import loadUserAddress from "./features/utils/loadUserAddress.js";

//Page Routes and components/modals
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./routes/home";
import About from "./routes/about";
import Catalog from "./routes/catalog";
import User from "./routes/user";

class App extends Component {
  constructor(props) {
    super(props);

    window.ethereum.on("accountsChanged", function(accounts) {
      // Time to reload your interface with accounts[0]!
      store.dispatch(getMetamaskAddress(accounts[0]));
    });
  }
  // async componentDidMount() {
  //   try {
  //     await loadUserAddress().then(async account => {
  //       await store.dispatch(getMetamaskAddress(account));
  //       await store.dispatch(loadUser());
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="app">
            <NavBar />
            <Switch>
              <Route path="/user">
                <User />
              </Route>
              <Route path="/catalog">
                <Catalog />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
            <Footer />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
