import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../router";
import { lazy } from "react";

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazy(() => import(".")),
});
