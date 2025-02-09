import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
const PrivateRoute = React.lazy(() => import("./routes/privateRoute.tsx"));

import { QueryClient, QueryClientProvider } from "react-query";
import { routes } from "./routes/routes.tsx";
import { useAppSelector } from "./hooks/useActions.ts";
const HomePage = React.lazy(() =>
  import("./routes/index.tsx").then((module) => ({
    default: module.HomePage,
  }))
);

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { auth } = useAppSelector();

  useEffect(() => {
    auth.success ? setIsAuthenticated(true) : setIsAuthenticated(false);
  }, [auth]);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
      {Object.entries(routes).map(([pathName, config]) =>
          config.isAccessibleToPublicOnly ? (
            <Route
              key={pathName}
              path={pathName}
              element={
                isAuthenticated ? <Navigate to="/" replace /> : config.element
              }
            />
          ) : (
            ""
          )
        )}
        <Route path="/" element={<HomePage />}>
          {Object.entries(routes).map(([pathName, config]) => {
            return config.accessToAnyOne ? (
              <Route
                key={pathName}
                index
                path={pathName === "/" ? undefined : pathName}
                element={config.element}
              />
            ) : config.requiresAuth ? (
              <Route
                key={pathName}
                element={
                  <PrivateRoute userRole={[auth.userInfo.role as Auth.role]} />
                }
              >
                <Route path={pathName} element={config.element} />
              </Route>
            ) : (
              <Route key={pathName} path={pathName} element={config.element} />
            );
          })}
        </Route>

      </Routes>
    </QueryClientProvider>
  );
};
