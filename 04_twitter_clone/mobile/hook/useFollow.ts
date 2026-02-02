import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api";
import { Alert } from "react-native";

export const useFollow = () => {
    const api = useApiClient();
    const queryClient = useQueryClient();

    const followMutation = useMutation({
        mutationFn: (targetUserId: string) => userApi.followUser(api, targetUserId),
        onSuccess: (response) => {
            // Invalidate current user to update following list
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            // Invalidate profile of the target user if we are viewing it
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error: any) => {
            Alert.alert("Error", error.response?.data?.message || "Failed to follow user");
        },
    });

    const checkIsFollowing = (currentUser: any, targetUserId: string) => {
        if (!currentUser || !targetUserId) return false;
        return currentUser.following?.includes(targetUserId);
    };

    return {
        toggleFollow: (targetUserId: string) => followMutation.mutate(targetUserId),
        isFollowingLoading: followMutation.isPending,
        checkIsFollowing,
    };
};
