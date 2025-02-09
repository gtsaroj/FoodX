import ReactDOM from "react-dom/client";
import React from "react";
const App = React.lazy(() =>
  import("./app").then((module) => ({
    default: module.App,
  }))
);
import "./index.css";
import { Provider } from "react-redux";
import { persistor, Store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import "react-loading-skeleton/dist/skeleton.css";
import { Suspense } from "react";
import { Loader } from "./components/loader/loader";
import { ThemeContextProvider } from "./context/context.theme";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";



registerSW();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Suspense fallback={<Loader isLoading={true} loadingFn={() => false} />}>
    <Provider store={Store}>
      <PersistGate persistor={persistor} loading={"loading"}>
        <BrowserRouter>
          <ThemeContextProvider>
            <App />
          </ThemeContextProvider>
        </BrowserRouter>
        <Toaster position="top-center" />
      </PersistGate>
    </Provider>
  </Suspense>
);
