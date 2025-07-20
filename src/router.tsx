import { createRootRoute, createRouter, Outlet } from "@tanstack/react-router";
import { homeRoute } from "./pages/home/route";
import { usersRoute } from "./pages/users/route";

// root route with a layout component that renders child routes via <Outlet />
export const rootRoute = createRootRoute({
  component: () => <Outlet />,
  errorComponent: () => <div>Oops! Something went wrong</div>,
});

// create a route tree by adding child routes to the root route
const routeTree = rootRoute.addChildren([homeRoute, usersRoute]);

// create and export the router instance using the route tree
export const router = createRouter({ routeTree });

// register the router for type safety with TanStack Router
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
