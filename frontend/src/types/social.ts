export type LikeStateResponse = {
    liked: boolean
    connected: boolean   
}

export type LikeReceivedOut = {
    id: number
    username: string
    first_name: string
    last_name: string
    liked_at: string
}

export type VisitorOut = {
    id: number
    username: string
    first_name: string
    last_name: string
    visited_at: string
}