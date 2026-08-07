import type { SearchQueryParamsValues } from "@/schemas/discovery";
import { useDiscoveryFilters } from "./useDiscoveryFilters";
import * as discoveryApi from "../api/discovery";

type FilterParams = Omit<SearchQueryParamsValues, "offset">

function useSearchProfiles(filters: FilterParams, enabled = true) {
    const {profiles, serverError, isLoading, hasMore, loadMore} = useDiscoveryFilters({
        filters,
        enabled,
        fetchPage: discoveryApi.getSearchProfiles
    })
    return {suggestedProfiles: profiles, serverError, isLoading, hasMore, loadMore}
}

export default useSearchProfiles