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

export type RelationshipResponse = {
    liked_by_me: boolean
    liked_you: boolean
    connected: boolean
    blocked_by_me: boolean
    blocked_you: boolean
    last_connection: string
    is_online: boolean
}

export type BlockStateResponse = {
    blocked: boolean
}