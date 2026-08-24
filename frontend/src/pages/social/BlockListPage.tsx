import { SelectFilter } from "@/components/selectFilter"
import useVisitors from "@/social/useVisitors"
import { useEffect, useMemo, useRef, useState } from "react"
import { limitList } from "../discovery/SuggestPage"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"
import { useBlockList } from "@/social/useBlockList"
import { Button } from "@/components/ui/button"

export function BlockListPage() {
    const [limit, setLimit] = useState("20")
    const sentinelRef = useRef<HTMLDivElement>(null)
    const filter = useMemo(()=>({
        limit: Number(limit)
    }),[limit])
    const { blockList, serverError, isLoading, hasMore, loadMore} = useBlockList(filter, true)
    const loadMoreRef = useRef(loadMore)
    
    useEffect(()=>{
        const el = sentinelRef.current
        if (!el) return 
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreRef.current()
                }
            }, {rootMargin: "10px"}
        )
        observer.observe(el)
        return ()=>observer.disconnect()
    }, [])

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
                <div className="flex w-full flex-col gap-2 text-sm">
                {blockList.map((block) => {
                    const rawDate = block.blocked_at
                                    ? (block.blocked_at.endsWith('Z') ? block.blocked_at : block.blocked_at + 'Z') : null
                    const formattedDate = rawDate ? new Date(rawDate).toLocaleString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    }) : ''                
                    return (                   
                        <div key={block.id}>
                            <dl
                                className="flex flex-wrap gap-2 items-center justify-between"
                                // onClick={()=>navigate(`/users/${block.id}`)}
                            >
                                <dt>{block.first_name} {block.last_name}</dt>
                                <dd className="text-muted-foreground">Blocked at {formattedDate}</dd>
                                <Button>Unblock</Button>
                            </dl>
                            <Separator />
                    </div>
                    )
                })}
                </div>
            </div>
            <div ref={sentinelRef} />
            {isLoading && <p className="p-1">Loading...</p>}
            {!hasMore && !isLoading && <p className="p-1">End of list.</p>}
        </>
    )
}