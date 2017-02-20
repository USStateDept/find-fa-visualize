import { createStore, applyMiddleware, compose } from "redux";

import thunk from "redux-thunk";
import createLogger from "redux-logger";
import rootReducer from "./reducers/";

const middlewareBuilder = () => {
  let middleware = {};
  let universalMiddleware = [thunk];
  let allComposeElements = [];

  if (process.browser) {
    if (process.env.NODE_ENV === "production") {
      // production
      middleware = applyMiddleware(...universalMiddleware);
      allComposeElements = [middleware];
    } else {
      // development
      console.log(
        "====> 📃 React Logger Enabled - expect browser memory issues"
      );
      middleware = applyMiddleware(...universalMiddleware, createLogger());
      allComposeElements = [middleware];
    }
  } else {
    middleware = applyMiddleware(...universalMiddleware);
    allComposeElements = [middleware];
  }

  return allComposeElements;
};

const finalCreateStore = compose(...middlewareBuilder())(createStore);

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("./reducers", () => {
      const nextRootReducer = require("./reducers/");
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
