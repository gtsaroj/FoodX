import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { persistor, Store } from "./Store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import 'react-loading-skeleton/dist/skeleton.css'


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={Store}>
    <PersistGate persistor={persistor} loading={"loading"}>
      <App />
      <Toaster/>
    </PersistGate>
    
  </Provider>
);
