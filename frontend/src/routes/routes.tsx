import React from "react";
const Login = React.lazy(() =>
  import("../components/index.ts").then((module) => ({ default: module.Login }))
);
const OrderSuccess = React.lazy(() =>
  import("../pages/Order.Success.page.tsx").then((module) => ({
    default: module.OrderSuccess,
  }))
);
const VerificationPage = React.lazy(() =>
  import("../pages/verification/page.verification.tsx").then((module) => ({
    default: module.VerificationPage,
  }))
);

const Register = React.lazy(() =>
  import("../components/register/register.tsx").then((module) => ({
    default: module.Register,
  }))
);
const NotFoundPage = React.lazy(() =>
  import("../pages/index.ts").then((module) => ({
    default: module.NotFoundPage,
  }))
);
const Home = React.lazy(() =>
  import("../pages/home/index.ts").then((module) => ({ default: module.Home }))
);
const ForgotPassword = React.lazy(() =>
  import("../features/index.ts").then((module) => ({
    default: module.ForgotPassword,
  }))
);
const CartPage = React.lazy(() =>
  import("../pages/index.ts").then((module) => ({
    default: module.CartPage,
  }))
);
const CheckoutPage = React.lazy(() =>
  import("../pages/index.ts").then((module) => ({
    default: module.CheckoutPage,
  }))
);
const UserProfile = React.lazy(() =>
  import("../pages/profile/page.profile.tsx").then((module) => ({
    default: module.UserProfile,
  }))
);
const Order = React.lazy(() => import("../pages/order/order.tsx"));

interface Routes {
  [path: string]: {
    requiresAuth?: boolean;
    roles?: Array<"customer" | "chef" | "admin">;
    isAccessibleToPublicOnly?: boolean;
    element: React.ReactNode;
    accessToAnyOne: boolean;
  };
}

export const routes: Routes = {
  "/": {
    roles: ["customer"],
    element: <Home />,
    accessToAnyOne: true,
  },
  "/cart": {
    roles: ["customer"],
    element: <CartPage />,
    accessToAnyOne: true,
  },
  "/profile": {
    requiresAuth: true,
    roles: ["customer"],
    element: <UserProfile />,
    accessToAnyOne: false,
  },

  "/orders": {
    requiresAuth: true,
    roles: ["customer", "chef", "admin"],
    element: <Order />,
    accessToAnyOne: false,
  },
  "/cart/checkout": {
    requiresAuth: true,
    roles: ["customer", "chef", "admin"],
    element: <CheckoutPage />,
    accessToAnyOne: false,
  },
  "/order/success": {
    requiresAuth: true,
    roles: ["customer", "chef", "admin"],
    element: <OrderSuccess />,
    accessToAnyOne: false,
  },
  "/login": {
    isAccessibleToPublicOnly: true,
    element: <Login />,
    accessToAnyOne: false,
  },
  "/register": {
    isAccessibleToPublicOnly: true,
    element: <Register />,
    accessToAnyOne: false,
  },
  "/email-verification": {
    isAccessibleToPublicOnly: true,
    element: <VerificationPage />,
    accessToAnyOne: false,
  },
  "/forgot-password": {
    element: <ForgotPassword />,
    accessToAnyOne: true,
  },
  "*": {
    element: <NotFoundPage />,
    accessToAnyOne: true,
  },
};
