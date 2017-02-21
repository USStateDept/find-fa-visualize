import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import configureStore from "./store";
const store = configureStore({});

import App from "./containers/App";

import "./styles/index.css";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
// dev hot reloading
// function render(Component) {
//   ReactDOM.render(
//     <Provider store={store}>
//       <Component />
//     </Provider>,
//     document.getElementById("root")
//   );
// }
// render(App);
// if (module.hot) {
//   module.hot.accept("./containers/App", () => {
//     const NextApp = require("./containers/App").default;
//     render(NextApp);
//   });
// }
