import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../router";
import { lazy } from "react";
import type { IUsers } from "./interfaces/users";
import RCLoader from "../../components/loader";

export const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users",
  component: lazy(() => import(".")),
  loader: getUserData,
  pendingComponent: RCLoader,
});

async function getUserData() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (response.ok) {
      const data = await response.json();
      return data as IUsers[];
    }
    return null;
  } catch (error) {
    console.log("error", error);
  }
}
