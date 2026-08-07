import * as discoveryApi from "../api/discovery"
import type { SuggestQueryParamsValues } from "@/schemas/discovery"
import { useDiscoveryFilters } from "./useDiscoveryFilters"

type FilterParams = Omit<SuggestQueryParamsValues, "offset">

function useSuggestedProfiles (filters: FilterParams, enabled = true) {
    const {profiles, serverError, isLoading, hasMore, loadMore} = useDiscoveryFilters({
        filters,
        enabled,
        fetchPage: discoveryApi.getSuggestedProfiles
    })
    return {suggestedProfiles: profiles, serverError, isLoading, hasMore, loadMore}
}

export default useSuggestedProfiles