import { useEffect, useMemo, useRef, useState } from "react"
import { limitList } from "../discovery/SuggestPage"
import { SelectFilter } from "@/components/selectFilter"
import useLikesReceived from "@/social/useLikesReceived"

function LikesReceived() {
    const [limit, setLimit] = useState("20")
    const sentinelRef = useRef<HTMLDivElement>(null)

    const filters = useMemo(()=>({
        limit: Number(limit)
    }), [limit])
    const {likesReceivedList, serverError, isLoading, hasMore, loadMore} = useLikesReceived(filters, true)

    useEffect(()=>{
        const el = sentinelRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            (entires) => {
                if (entires[0].isIntersecting)
                    loadMore()
            }, {
                rootMargin: "200px"
            }
        )
        observer.observe(el)
        return ()=>observer.disconnect()
    }, [loadMore])

    return (
        <>
            <div className="flex flex-wrap gap-2">
                <SelectFilter
                    label="Limite"
                    items={limitList}
                    value={limit}
                    onChange={v=>setLimit(v ?? "20")}/> 
            </div>
            {serverError && <p className="p-1">{serverError}</p>}
            <div className="m-8 grid gap-8 justify-items-center
                grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                <ul>
                {likesReceivedList.map((p) => (
                    <li key={p.id}>
                        <div></div>
                    </li>
                ))}
                </ul>
            </div>
            <div ref={sentinelRef} />
            {isLoading && <p className="p-1">Loading...</p>}
            {!hasMore && !isLoading && <p className="p-1">No more profiles.</p>}
        </>
    )
}

export default LikesReceived