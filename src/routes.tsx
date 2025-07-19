import { createRootRoute, createRouter, Outlet } from "@tanstack/react-router";

// root route with a layout component that renders child routes via <Outlet />
export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// create a route tree by adding child routes to the root route
const routeTree = rootRoute.addChildren([]); // add all route files here <---------------------------

// create and export the router instance using the route tree
export const router = createRouter({ routeTree });

// register the router for type safety with TanStack Router
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
