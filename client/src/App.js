//Import Dependencies
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter, Route, Switch } from "react-router-dom";

//Page Routes and components/modals
import NavBar from "./components/navbar";
import Footer from "./components/footer";
// import ItemList from "./components/ItemList";
// import ItemModal from "./components/itemModal";
import Home from "./routes/home";
import About from "./routes/about";
import Catalog from "./routes/catalog";
import User from "./routes/user";

class App extends Component {
  // constructor(props){
  //   super(props);

  //   this.state = {
  //     open: true
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
