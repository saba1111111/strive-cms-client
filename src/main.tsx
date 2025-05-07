import ReactDOM from "react-dom/client";
import React from "react";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>
);
