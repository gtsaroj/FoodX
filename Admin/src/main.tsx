import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css"
import { Provider } from "react-redux";
import { persistor, Store } from "./Reducer/Store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={Store}>
    <PersistGate persistor={persistor} loading={"loading"}>
      <App />
    </PersistGate>
    <Toaster/>
  </Provider>
);
