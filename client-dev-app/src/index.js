
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route } from 'react-router';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import configureStore from "./store";
//import routes from "./routes";
import "./styles/index.css";

const history = createBrowserHistory();
const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);
const rootElement = document.getElementById('root');

// Main Entry
import App from "./containers/App";

// Redux SMART views
import VisualizeView from "./containers/Visualize";

ReactDOM.render((
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={VisualizeView}>
            </Route>
        </Router>
    </Provider>
    ), document.getElementById("root")
);