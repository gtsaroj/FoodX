import React, { useEffect, useState } from "react";
import Dasboard from "./Pages/Dashboard/Dasboard";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { useSelector } from "react-redux";
import { UserRole } from "./models/user.model";
import { QueryClient, QueryClientProvider } from "react-query";
import { RootState } from "./Store";
import "./index.css";

const DesktopSlider = React.lazy(() =>
  import("./Components/Slider/Slider").then((module) => ({
    default: module.DesktopSlider,
  }))
);
const MobileSlider = React.lazy(() =>
  import("./Components/Slider/Slider").then((module) => ({
    default: module.MobileSlider,
  }))
);
const Analytics = React.lazy(() => import("./Pages/Analytics/Analytics"));
const OrderList = React.lazy(() => import("./Pages/Order/Order.page"));
const CustomerList = React.lazy(() => import("./Pages/User/User.page"));
const TicketPage = React.lazy(() => import("./Pages/Ticket/Ticket.chef.page"));
const AdminProfile = React.lazy(() =>
  import("./Pages/Profile/AdminProfile").then((module) => ({
    default: module.AdminProfile,
  }))
);
const BannerPage = React.lazy(() => import("./Pages/Banner/Banner.page"));
const FoodPage = React.lazy(() => import("./Pages/Product/Product.page"));
const Login = React.lazy(() => import("./Auth/Login/Login"));
const NotFoundPage = React.lazy(() => import("./Pages/404Page/NotFoundPage"));
const Footer = React.lazy(() => import("./Components/Footer/Footer"));
const CategoryPage = React.lazy(() =>
  import("./Pages/Category/Category.page").then((module) => ({
    default: module.CategoryPage,
  }))
);
const Navbar = React.lazy(() => import("./Components/Navbar/Navbar"));
const WelcomePage = React.lazy(() =>
  import("./Pages/Page.Welcome").then((module) => ({
    default: module.WelcomePage,
  }))
);
const TicketAdminPage = React.lazy(
  () => import("./Pages/Ticket/Ticket.admin.page")
);

const MainPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full overflow-hidden ">
      <div className=" flex xl:flex-row flex-col w-full 2xl:container lg:h-[100vh] gap-4 py-3 items-start justify-center  px-3 xl:px-5">
        <div className="hidden xl:flex ">
          <DesktopSlider closeFn={() => {}} open={false} />
        </div>
        <div className="flex w-full xl:hidden">
          <MobileSlider />
        </div>
        <div className="w-full h-full overflow-auto  flex flex-col items-center justify-end bg-[var(--light-foreground)] ">
          <Navbar />
          <div className="w-full h-[200vh] overflow-y-auto overflow-x-hidden 2xl:justify-between  flex flex-col items-center bg-[var(--light-foreground)]  ">
            <Outlet />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const auth = useSelector((state: RootState) => state.root.user);
  const [showContent, setShowContent] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<UserRole["role"]>(
    auth.userInfo.role as UserRole["role"]
  );

  const queryClient = new QueryClient();

  useEffect(() => {
    auth.success ? setShowContent(true) : setShowContent(false);
  }, [auth.success]);


  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              !auth.userInfo.role ? (
                <WelcomePage user={(role) => setUserRole(role)} />
              ) : (
                <Navigate to={`/${auth.userInfo.role}`} replace />
              )
            }
          />
          <Route
            path="login/"
            element={
              showContent ? (
                <Navigate to={`/${auth.userInfo.role}`} replace />
              ) : (
                <Login role={userRole as UserRole["role"]} />
              )
            }
          />
          z
          <Route
            element={
              <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
            }
          >
            <Route path={`${userRole}/`} element={<MainPage />}>
              <Route
                element={
                  <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
                }
              >
                <Route index element={<Dasboard />} />
              </Route>
              <Route element={<PrivateRoute role={[{ role: "admin" }]} />}>
                <Route path="analytics" element={<Analytics />} />
              </Route>
              <Route
                element={
                  <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
                }
              >
                <Route path="order-list" element={<OrderList />} />
              </Route>
              <Route
                element={
                  <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
                }
              >
                <Route path="customer-list" element={<CustomerList />} />
              </Route>

              <Route element={<PrivateRoute role={[{ role: "chef" }]} />}>
                <Route path="contact/chef-tickets" element={<TicketPage />} />
              </Route>
              <Route element={<PrivateRoute role={[{ role: "admin" }]} />}>
                <Route
                  path="contact/admin-tickets"
                  element={<TicketAdminPage />}
                />
              </Route>
              <Route
                element={
                  <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
                }
              >
                <Route path="contact/profile" element={<AdminProfile />} />
              </Route>
              <Route
                element={
                  <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
                }
              >
                <Route path="collection/foodlist" element={<FoodPage />} />
              </Route>
              <Route
                element={
                  <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
                }
              >
                <Route path="collection/banner" element={<BannerPage />} />
              </Route>
              <Route
                element={
                  <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
                }
              >
                <Route path="category" element={<CategoryPage />} />
              </Route>
              <Route
                element={
                  <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
                }
              >
                <Route path="profile" element={<AdminProfile />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
