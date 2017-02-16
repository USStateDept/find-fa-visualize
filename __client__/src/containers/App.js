import React, { Component } from "react";

import Visualize from "./Visualize";

/* Mimiced Components from fa.gov */
import FANavbar from "../components/app/fa-mimic/navbar";

class App extends Component {
  render() {
    return <div className="App"><FANavbar /> <Visualize /></div>;
  }
}

export default App;
