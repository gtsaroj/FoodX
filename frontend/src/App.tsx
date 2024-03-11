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

const HomePage = () => {
  // persistor.purge();
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

  const loginUser = useSelector((state: RootState) => state.root.loginAuth);
  const signin = useSelector((state: RootState) => state.root.loginAuth);

  // console.log(loginUser.success)


  
  useEffect(() => {
    loginUser.success || signin.success ? SetShowContent(true) : SetShowContent(false);
  }, [loginUser, signin ]);

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
          path: `${ShowContent ? "/" : "/register"}`,
          element: <Register />,
        },
        {
          path: `${ShowContent ? "/" : "/login"}`,
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
