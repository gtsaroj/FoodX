import { useEffect, useState } from "react";
import Footer from "./Components/Footer/Footer";
import Login from "./Components/Login/Login";
import { Header } from "./Components/Navbar/Navbar";
import { Register } from "./Components/Register/Register";
import NotFoundPage from "./Pages/404Page/NotFoundPage";
import Home from "./Pages/Home/Home";
import {
  createBrowserRouter,
  Routes,
  Route,

  BrowserRouter,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, persistor } from "./Reducer/Store";
import PrivateRoute from "./PrivateRoute";

const HomePage = () => {
  persistor.purge();
  return (
    <div className="flex items-center justify-center w-full h-full min-w-[100vw]  ">
      <div className="w-full h-full max-w-[1500px] flex flex-col justify-center items-center ">
        <div className="mb-[100px] z-50">
          <Header />
        </div>
        <div className="w-full">
          <Home />
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
};
export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute/>}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
