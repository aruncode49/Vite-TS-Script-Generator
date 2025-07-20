import { useLoaderData } from "@tanstack/react-router";

export function useUsers() {
  // fetch users data from loader functions
  const data = useLoaderData({ from: "/users" });
  return {
    state: {},
    vars: { data },
    actions: {},
  };
}
