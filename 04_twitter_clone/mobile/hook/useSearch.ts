import { useQuery } from "@tanstack/react-query";
import { useApiClient, postApi } from "../utils/api";
import { useState, useEffect } from "react";

export const useSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const api = useApiClient();

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    const {
        data: searchResults,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["searchPosts", debouncedQuery],
        queryFn: () => postApi.searchPosts(api, debouncedQuery),
        enabled: debouncedQuery.length > 0,
        select: (response) => response.data,
    });

    return {
        searchQuery,
        setSearchQuery,
        searchResults: searchResults || [],
        isLoading: isLoading && debouncedQuery.length > 0,
        search: refetch,
    };
};
