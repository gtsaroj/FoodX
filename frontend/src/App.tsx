import { useEffect, useState } from "react";
import Footer from "./Components/Footer/Footer";
import Login from "./Components/Login/Login";
import { Header } from "./Components/Navbar/Navbar";
import { Register } from "./Components/Register/Register";
import NotFoundPage from "./Pages/404Page/NotFoundPage";
import Home from "./Pages/Home/Home";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, persistor } from "./Reducer/Store";
import { auth } from "./firebase";


const HomePage = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-w-[100vw]  ">
      <div className="w-full h-full max-w-[1500px] flex flex-col justify-center items-center ">
        <div className="mb-[100px] z-50">
          <Header />
        </div>
        <div className="w-full">
          <Outlet />
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
};
export const App: React.FC = () => {
  const [ShowContent, SetShowContent] = useState<boolean>(false);

  const authUser = useSelector((state: RootState) => state.root.auth);


  console.log(authUser.success);
  useEffect(() => {
    authUser.success ? SetShowContent(true) : SetShowContent(false)
  }, [ authUser] );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      children: [
        {
          path: "/",
          element: ShowContent ? <Home /> : <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
