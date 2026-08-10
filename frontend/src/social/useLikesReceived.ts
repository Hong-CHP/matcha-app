import type { BasicQueryParamsValues } from "@/schemas/discovery"
import * as socialApi from "@/api/social"
import { usePagination } from "@/hooks/usePagination"

type FilterParams = Omit<BasicQueryParamsValues, "offset">

function useLikesReceived (filters: FilterParams, enabled = true) {
    const {data, serverError, isLoading, hasMore, loadMore} = usePagination({
        filters,
        enabled,
        fetchPage: socialApi.getLikesReceivedList
    })
    return {likesReceivedList: data, serverError, isLoading, hasMore, loadMore}
}

export default useLikesReceived