import { useQuery } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api";

export const useCurrentUser = () => {
  const api = useApiClient();

  const {
    data: currentUser,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => userApi.getCurrentUser(api),
    select: (response) => {
      // If the backend returns { user: {...} }, use response.data.user
      // If the backend returns {...} directly, use response.data
      // console.log("response", response.data);
      return response.data.user || response.data;
    },
  });

  return { currentUser, isLoading, error, refetch };
};
