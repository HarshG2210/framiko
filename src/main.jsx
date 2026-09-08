import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./redux/store";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);
