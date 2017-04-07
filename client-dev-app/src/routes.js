import { Route, IndexRoute } from "react-router";
import React from "react";

// Main Entry
import App from "./containers/Hello";

// Redux SMART views
// requiers containers (data fetching, dynamic data)
import HomeView from "./containers/Hello";
import VisualizeView from "./containers/Hello";

export default (
  <Route name="app" path="/" component={App}>
        <IndexRoute component={HomeView}/>

        <Route path="home" component={HomeView} />
        <Route path="visualize" component={VisualizeView} />

  </Route>
);
