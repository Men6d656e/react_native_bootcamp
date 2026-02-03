import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../convex/_generated/api";

/**
 * Hook to synchronize the Clerk authenticated user with the Convex database.
 * 
 * If a user is signed in via Clerk but does not exist in the Convex 'users' table,
 * this hook will call the 'createUser' mutation to sync the user data.
 */
export function useAuthSync() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [isSyncing, setIsSyncing] = useState(false);

    // Query to check if the user exists in Convex
    const convexUser = useQuery(
        api.users.getUserByClerkId,
        user ? { clerkId: user.id } : "skip"
    );

    // Mutation to create a new user in Convex
    const createUser = useMutation(api.users.createUser);

    useEffect(() => {
        // If no Clerk user or if user already exists in Convex, do nothing
        if (!user || convexUser !== null || isSyncing) return;

        /**
         * Internal function to perform the sync.
         */
        const syncUser = async () => {
            try {
                setIsSyncing(true);
                console.log("[useAuthSync] Syncing user to Convex:", user.id);

                await createUser({
                    clerkId: user.id,
                    email: user.emailAddresses[0].emailAddress,
                    fullname: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Anonymous",
                    image: user.imageUrl,
                    username: user.username || user.emailAddresses[0].emailAddress.split("@")[0],
                });

                console.log("[useAuthSync] User synced successfully.");
            } catch (error) {
                console.error("[useAuthSync] Error syncing user to Convex:", error);
            } finally {
                setIsSyncing(false);
            }
        };

        syncUser();
    }, [user, convexUser, createUser, isSyncing]);

    return {
        // We are hydrated if:
        // 1. Auth is not loaded yet (InitialLayout will wait)
        // 2. Auth is loaded, but user is not signed in (nothing to hydrate)
        // 3. Auth is loaded, user is signed in, AND convexUser query has finished AND found a record
        // If not found (null), we're still waiting for the sync mutation to finish.
        isHydrated: isLoaded && (!isSignedIn || (convexUser !== undefined && convexUser !== null)),
        userData: convexUser,
    };
}
