import { ProfileCard } from "@/components/ProfileCard"
import { SelectFilter } from "@/components/selectFilter"
import useSuggestedProfiles from "@/discovery/useSuggestedProfiles"
import type { SuggestQueryParamsValues } from "@/schemas/discovery"
import { useLikes } from "@/social/useLikes"
import { useEffect, useMemo, useRef, useState } from "react"

const limitList = [
    { label: "Limit", value: null },
    { label: "1", value: "1" },
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "40", value: "40" }
]

const sortList = [
    { label: "Sort by", value: null },
    { label: "age", value: "age" },
    { label: "distance", value: "distance" },
    { label: "fame", value: "fame" },
    { label: "tags", value: "tags" },
]

const orderList = [
    { label: "Order by", value: null },
    { label: "asc", value: "asc" },
    { label: "desc", value: "desc" },
]

type SortValue = SuggestQueryParamsValues["sort"]
type OrderValue = SuggestQueryParamsValues["order"]

function SuggestPage() {
    const [limit, setLimit ] = useState("20")
    const [sort, setSort ] = useState<SortValue>(undefined)
    const [order, setOrder ] = useState<OrderValue>(undefined)

    const filters = useMemo(()=>(
        {
            limit: Number(limit), sort, order
        }
    ), [limit, sort, order])

    const sentinelRef = useRef<HTMLDivElement>(null)

    const {suggestedProfiles, serverError, isLoading, hasMore, loadMore} = useSuggestedProfiles(filters)
    const {like, unlike, likeState, serverError: likeError} = useLikes()

    useEffect(()=>{
        const el = sentinelRef.current
        if (!el) return 
        const observer = new IntersectionObserver(
            (entires) => {
                if (entires[0].isIntersecting)
                    loadMore()
            },
            { rootMargin: "200px" }
        )
        observer.observe(el)
        return ()=>observer.disconnect()
    }, [loadMore])

    return (
        <>
            <div className="flex gap-2">
                <SelectFilter
                    label="Limite"
                    items={limitList}
                    value={limit}
                    onChange={v=>setLimit(v ?? "20")}/>
                <SelectFilter
                    label="Sort by"
                    items={sortList}
                    value={sort}
                    onChange={v=>setSort(v as SortValue)}/>
                <SelectFilter
                    label="Order by"
                    items={orderList}
                    value={order}
                    onChange={v=>setOrder(v as OrderValue)}/>
            </div>
            {serverError && <p className="p-1">{serverError}</p>}
            {likeError && <p className="p-1">{likeError}</p>}
            <div className="m-8 grid gap-8 justify-items-center
                grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                {suggestedProfiles.map((p) => (
                    <div key={p.id}>
                        <ProfileCard profile={p} onLike={like} onUnlike={unlike} likeState={likeState} />
                    </div>
                ))}
            </div>
            <div ref={sentinelRef} />
            {isLoading && <p className="p-1">Loading...</p>}
            {!hasMore && !isLoading && <p className="p-1">No more profiles.</p>}
        </>
    )
}

export default SuggestPage