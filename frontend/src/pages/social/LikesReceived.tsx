import { useCallback, useState } from "react"
import { limitList } from "../discovery/SuggestPage"
import { SelectFilter } from "@/components/selectFilter"
import type { LikeReceivedOut } from "@/types/social"
import { useAuth } from "@/auth/useAuth"
import * as socialApi from "@/api/social"

function LikesReceived() {
    const { accessToken, logout } = useAuth()
    const [ serverError, setServerError ] = useState<string | null>(null)
    const [ isLoading, setIsLoading ] = useState(false)
    const [limit, setLimit] = useState("20")
    const [likesReceivedList, setLikesReceivedList] = useState<LikeReceivedOut[]>([])
    const [ hasMore, setHasMore ] = useState(true)
    const offsetRef = useRef(0)

    const getLikesReceivedList = useCallback(
        async () => {
            if (!accessToken) return
            setServerError(null)
            setIsLoading(true)
            try {
                const receivedList = await socialApi.getLikesReceivedList(accessToken, )
            }
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
        </>
    )
}

export default LikesReceived