import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { Provider } from "react-redux";
import { persistor, Store } from "./Store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import { Loading } from "./Components/Common/Loader/Loader";
import React from "react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<Loading isLoading={true} loadingFn={() => false} />}>
      <Provider store={Store}>
        <PersistGate persistor={persistor} loading={"loading"}>
          <App />
        </PersistGate>
        <Toaster />
      </Provider>
    </Suspense>
  </React.StrictMode>
);
